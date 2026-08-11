const STORAGE_KEY = "portfolio.geminiApiKey";

export function getStoredGeminiKey() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function setStoredGeminiKey(key) {
  try {
    if (key) sessionStorage.setItem(STORAGE_KEY, key);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export async function requestTourPlan({ prompt } = {}) {
  const apiKey = getStoredGeminiKey();

  const response = await fetch("/api/tour", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      ...(apiKey ? { apiKey } : {}),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.ok) {
    const err = new Error(data.error || "Tour planning failed");
    err.code = data.code || "REQUEST_FAILED";
    throw err;
  }

  return data.tour;
}

export async function requestPortfolioAnswer(question) {
  const apiKey = getStoredGeminiKey();

  const response = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      ...(apiKey ? { apiKey } : {}),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.ok) {
    const err = new Error(data.error || "Could not answer that");
    err.code = data.code || "REQUEST_FAILED";
    throw err;
  }

  return data.result;
}

export function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * One-shot voice capture. Resolves with transcript text.
 */
export function listenOnce({
  lang = "en-US",
  timeoutMs = 12000,
  onPartial,
} = {}) {
  const Recognition = getSpeechRecognition();
  if (!Recognition) {
    const err = new Error(
      "Voice input isn’t supported in this browser. Try Chrome, or type your question."
    );
    err.code = "NO_SPEECH_API";
    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalText = "";
    let settled = false;
    let timer = null;

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      if (timer) window.clearTimeout(timer);
      listenOnce._active = null;
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      fn(value);
    };

    timer = window.setTimeout(() => {
      if (finalText.trim()) finish(resolve, finalText.trim());
      else {
        const err = new Error("I didn’t catch that — try again.");
        err.code = "TIMEOUT";
        finish(reject, err);
      }
    }, timeoutMs);

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const piece = event.results[i][0]?.transcript || "";
        if (event.results[i].isFinal) finalText += `${piece} `;
        else interim += piece;
      }
      if (typeof onPartial === "function") {
        onPartial((finalText + interim).trim());
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        const err = new Error("Listening cancelled");
        err.code = "CANCELLED";
        finish(reject, err);
        return;
      }
      if (event.error === "no-speech") {
        if (finalText.trim()) finish(resolve, finalText.trim());
        else {
          const err = new Error("No speech detected. Tap the mic and ask again.");
          err.code = "NO_SPEECH";
          finish(reject, err);
        }
        return;
      }
      const err = new Error(
        event.error === "not-allowed"
          ? "Microphone permission is blocked. Allow mic access and try again."
          : "Could not hear you clearly. Try again."
      );
      err.code = String(event.error || "SPEECH_ERROR").toUpperCase();
      finish(reject, err);
    };

    recognition.onend = () => {
      if (finalText.trim()) finish(resolve, finalText.trim());
      else if (!settled) {
        const err = new Error("No speech detected. Tap the mic and ask again.");
        err.code = "NO_SPEECH";
        finish(reject, err);
      }
    };

    listenOnce._active = {
      cancel: () => {
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
      },
    };

    try {
      recognition.start();
    } catch (error) {
      finish(reject, error);
    }
  });
}

export function cancelListening() {
  try {
    listenOnce._active?.cancel?.();
  } catch {
    /* ignore */
  }
}

export function resolveTourTarget(stepId) {
  const preferred = document.querySelector(`[data-tour="${stepId}"]`);
  if (preferred) return preferred;

  const fallbacks = {
    home: "#home",
    about: "#about",
    services: "#services",
    work: "#work",
    "work-featured": "#work",
    contact: "#contact",
  };

  const sel = fallbacks[stepId];
  return sel ? document.querySelector(sel) : null;
}

/**
 * Speaks narration and resolves only when speech finishes (or is cancelled).
 * Returns { promise, cancel } so the tour can wait for the voice.
 */
export function speakNarration(text, { enabled }) {
  const noop = { promise: Promise.resolve(), cancel: () => {} };

  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) {
    return noop;
  }

  const synth = window.speechSynthesis;
  let settled = false;
  let fallbackTimer = null;

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 0.95;

  const voices = synth.getVoices();
  const preferred =
    voices.find(
      (v) => /en(-|_)?(US|GB)/i.test(v.lang) && /female|google|natural/i.test(v.name)
    ) || voices.find((v) => /^en/i.test(v.lang));
  if (preferred) utter.voice = preferred;

  let resolveDone;
  const promise = new Promise((resolve) => {
    resolveDone = resolve;
  });

  const finish = () => {
    if (settled) return;
    settled = true;
    if (fallbackTimer) window.clearTimeout(fallbackTimer);
    resolveDone();
  };

  utter.onend = finish;
  utter.onerror = finish;

  // Chrome sometimes never fires onend — estimate from word count as safety net.
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  const fallbackMs = Math.min(28000, Math.max(5000, Math.ceil(words / 2.1) * 1000 + 1200));
  fallbackTimer = window.setTimeout(finish, fallbackMs);

  try {
    synth.cancel();
    synth.speak(utter);
  } catch {
    finish();
  }

  const cancel = () => {
    try {
      synth.cancel();
    } catch {
      /* ignore */
    }
    finish();
  };

  return { promise, cancel };
}
