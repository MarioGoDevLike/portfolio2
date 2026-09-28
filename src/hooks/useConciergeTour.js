import { useCallback, useEffect, useRef, useState } from "react";
import { speak } from "../services/assistantApi";

/** Tour stops, in order. Each targets [data-tour="<id>"] (or the fallback selector). */
export const TOUR_STOPS = [
  {
    id: "home",
    fallback: "#home",
    label: "Intro",
    line: "Welcome. This portfolio shows how Mario works — clean design, smooth motion, and a strong first impression.",
  },
  {
    id: "about",
    fallback: "#about",
    label: "About",
    line: "Mario is a mobile and web developer. He builds with React, Flutter, and Firebase, and focuses on products that hold up in the real world.",
  },
  {
    id: "services",
    fallback: "#services",
    label: "Services",
    line: "He covers both mobile and web with the same care — clear structure, solid code, and products clients can trust.",
  },
  {
    id: "work",
    fallback: "#work",
    label: "Work",
    line: "These are real client projects — marketplace, news, and delivery apps, plus polished websites.",
  },
  {
    id: "work-featured",
    fallback: "#work",
    label: "Featured",
    line: "The featured project shows his standard: he owns the full build and ships something polished and ready to use.",
  },
  {
    id: "contact",
    fallback: "#contact",
    label: "Contact",
    line: "If you're looking for a reliable developer, this is the next step. Mario is available and replies quickly.",
  },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isMobile = () => window.innerWidth < 768;

/** Roughly 200 wpm plus a beat, so written lines stay up long enough to read. */
const readingTime = (text) => Math.max(4500, text.split(/\s+/).length * 300 + 1200);

function findTarget(item) {
  return document.querySelector(`[data-tour="${item.id}"]`) || document.querySelector(item.fallback);
}

async function scrollToTarget(el) {
  el.scrollIntoView({ behavior: "smooth", block: isMobile() ? "start" : "center" });
  await wait(isMobile() ? 850 : 700);
}

/** Spotlight box around the element, clamped so it never sits under the HUD. */
function readRect(el) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const mobile = isMobile();
  const pad = mobile ? 10 : 14;
  const hudReserve = mobile ? 190 : 150;
  const width = Math.min(window.innerWidth - 16, Math.max(120, r.width + pad * 2));
  const height = Math.min(window.innerHeight - hudReserve - 16, Math.max(90, r.height + pad * 2));
  const left = Math.max(8, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - 8));
  const top = Math.max(8, Math.min(r.top + r.height / 2 - height / 2, window.innerHeight - height - hudReserve));
  return { top, left, width, height };
}

/**
 * Guided tour engine: scroll → spotlight → narrate (text, optionally voice) → next.
 * Every run gets an id; bumping it cancels whatever run is in flight.
 */
export default function useConciergeTour({ onFinish } = {}) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [voice, setVoice] = useState(false);
  const [spotlight, setSpotlight] = useState(null);

  const runRef = useRef(0);
  const stopsRef = useRef([]);
  const indexRef = useRef(-1);
  const pausedRef = useRef(false);
  const voiceRef = useRef(false);
  const cancelSpeechRef = useRef(() => {});
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const setPausedBoth = (value) => {
    pausedRef.current = value;
    setPaused(value);
  };

  const end = useCallback(() => {
    runRef.current += 1;
    cancelSpeechRef.current();
    setPausedBoth(false);
    setActive(false);
    setIndex(-1);
    setSpotlight(null);
    indexRef.current = -1;
  }, []);

  const finish = useCallback(() => {
    end();
    onFinishRef.current?.();
  }, [end]);

  /** Holds a stop until it has been readable long enough and any speech has finished. */
  const hold = useCallback(async (item, runId) => {
    const alive = () => runRef.current === runId;
    let speechDone = true;

    if (voiceRef.current) {
      speechDone = false;
      const speech = speak(item.line);
      cancelSpeechRef.current = speech.cancel;
      speech.promise.then(() => {
        speechDone = true;
      });
    }

    const dwell = readingTime(item.line);
    let elapsed = 0;
    while (elapsed < dwell || !speechDone) {
      if (!alive()) return false;
      await wait(100);
      if (!pausedRef.current) elapsed += 100;
    }
    return alive();
  }, []);

  const runFrom = useCallback(
    async (start, runId) => {
      const stops = stopsRef.current;
      setActive(true);

      for (let i = start; i < stops.length; i++) {
        if (runRef.current !== runId) return;
        indexRef.current = i;
        setIndex(i);

        const el = findTarget(stops[i]);
        setSpotlight(null);
        await scrollToTarget(el);
        if (runRef.current !== runId) return;
        setSpotlight(readRect(el));

        if (!(await hold(stops[i], runId))) return;
      }

      if (runRef.current === runId) finish();
    },
    [hold, finish]
  );

  const restartAt = useCallback(
    (i) => {
      cancelSpeechRef.current();
      setPausedBoth(false);
      const runId = runRef.current + 1;
      runRef.current = runId;
      runFrom(i, runId);
    },
    [runFrom]
  );

  const start = useCallback(() => {
    stopsRef.current = TOUR_STOPS.filter((item) => findTarget(item));
    if (stopsRef.current.length) restartAt(0);
  }, [restartAt]);

  const next = useCallback(() => {
    const i = indexRef.current + 1;
    if (i >= stopsRef.current.length) finish();
    else restartAt(i);
  }, [restartAt, finish]);

  const prev = useCallback(() => {
    if (indexRef.current > 0) restartAt(indexRef.current - 1);
  }, [restartAt]);

  const togglePause = useCallback(() => {
    const value = !pausedRef.current;
    setPausedBoth(value);
    try {
      if (value) window.speechSynthesis?.pause();
      else window.speechSynthesis?.resume();
    } catch {
      /* speech not available */
    }
  }, []);

  /** Turning voice off silences the current line; turning it on applies from the next stop. */
  const toggleVoice = useCallback(() => {
    voiceRef.current = !voiceRef.current;
    setVoice(voiceRef.current);
    if (!voiceRef.current) cancelSpeechRef.current();
  }, []);

  // Keep the spotlight glued to its element while the page moves.
  useEffect(() => {
    if (!active) return undefined;
    const sync = () => {
      const item = stopsRef.current[indexRef.current];
      if (item) setSpotlight(readRect(findTarget(item)));
    };
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [active]);

  // Cancel any running tour on unmount.
  useEffect(
    () => () => {
      runRef.current += 1;
      cancelSpeechRef.current();
    },
    []
  );

  return {
    active,
    index,
    total: stopsRef.current.length,
    current: stopsRef.current[index] || null,
    paused,
    voice,
    spotlight,
    start,
    end,
    next,
    prev,
    togglePause,
    toggleVoice,
  };
}
