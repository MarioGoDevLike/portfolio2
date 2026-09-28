/** Client for /api/ask plus browser speech helpers used by the concierge. */

export const MAX_QUESTION = 400;

export async function askAssistant(question, history = []) {
  let response;
  try {
    response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
    });
  } catch {
    throw new Error("You seem to be offline. Check your connection and try again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data.result;
}

/* ─── Speech recognition ─────────────────────────── */

export function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

const speechError = (message, code) => Object.assign(new Error(message), { code });

/**
 * One-shot voice capture.
 * Returns { promise, cancel }; the promise resolves with the transcript.
 */
export function listen({ lang = "en-US", timeoutMs = 12000, onPartial } = {}) {
  const Recognition = getSpeechRecognition();
  if (!Recognition) {
    return {
      promise: Promise.reject(speechError("Voice input isn't supported in this browser.", "UNSUPPORTED")),
      cancel: () => {},
    };
  }

  const recognition = new Recognition();
  recognition.lang = lang;
  recognition.interimResults = true;
  recognition.continuous = false;

  let finalText = "";
  let settled = false;
  let timer;

  const promise = new Promise((resolve, reject) => {
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
      fn(value);
    };
    const resolveOrFail = (message) =>
      finalText.trim() ? finish(resolve, finalText.trim()) : finish(reject, speechError(message, "NO_SPEECH"));

    timer = setTimeout(() => resolveOrFail("I didn't catch that — try again."), timeoutMs);

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0]?.transcript || "";
        if (event.results[i].isFinal) finalText += `${piece} `;
        else interim += piece;
      }
      onPartial?.((finalText + interim).trim());
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") return finish(reject, speechError("Cancelled", "CANCELLED"));
      if (event.error === "no-speech") return resolveOrFail("I didn't catch that — try again.");
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        return finish(reject, speechError("Microphone access is blocked.", "NOT_ALLOWED"));
      }
      return finish(reject, speechError("Couldn't hear you clearly — try again.", "SPEECH_ERROR"));
    };

    recognition.onend = () => resolveOrFail("I didn't catch that — try again.");

    try {
      recognition.start();
    } catch (error) {
      finish(reject, error);
    }
  });

  const cancel = () => {
    try {
      recognition.abort();
    } catch {
      /* already stopped */
    }
  };

  return { promise, cancel };
}

/* ─── Speech synthesis ───────────────────────────── */

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /^en[-_](US|GB)/i.test(v.lang) && /natural|google|samantha|daniel/i.test(v.name)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    null
  );
}

/**
 * Speaks text aloud. Returns { promise, cancel }; the promise resolves when
 * speech ends, is cancelled, or fails.
 */
export function speak(text) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text) {
    return { promise: Promise.resolve(), cancel: () => {} };
  }

  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utter.voice = voice;

  let done;
  const promise = new Promise((resolve) => {
    done = resolve;
  });

  // Chrome occasionally never fires onend; fall back to an estimate from word count.
  const words = String(text).split(/\s+/).length;
  const fallback = setTimeout(() => done(), Math.min(30000, 1500 + words * 450));
  const finish = () => {
    clearTimeout(fallback);
    done();
  };
  utter.onend = finish;
  utter.onerror = finish;

  try {
    synth.cancel();
    synth.speak(utter);
  } catch {
    finish();
  }

  return {
    promise,
    cancel: () => {
      try {
        synth.cancel();
      } catch {
        /* nothing to cancel */
      }
      finish();
    },
  };
}
