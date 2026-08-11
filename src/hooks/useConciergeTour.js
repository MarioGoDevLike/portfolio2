import { useCallback, useEffect, useRef, useState } from "react";
import { resolveTourTarget, speakNarration } from "../services/tourApi";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrollToTarget(el) {
  if (!el) return;
  const isMobile = window.innerWidth < 768;
  el.scrollIntoView({
    behavior: "smooth",
    block: isMobile ? "start" : "center",
    inline: "nearest",
  });
  await wait(isMobile ? 900 : 700);
  if (isMobile) {
    window.scrollBy({ top: -72, left: 0, behavior: "smooth" });
    await wait(220);
  }
}

function readRect(el) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const isMobile = window.innerWidth < 768;
  const pad = isMobile ? 10 : 14;
  const hudReserve = isMobile ? 168 : 120;
  const maxW = window.innerWidth - (isMobile ? 16 : 24);
  const maxH = window.innerHeight - hudReserve - (isMobile ? 12 : 24);
  const width = Math.min(maxW, Math.max(120, r.width + pad * 2));
  const height = Math.min(maxH, Math.max(90, r.height + pad * 2));
  let left = r.left + r.width / 2 - width / 2;
  let top = r.top + r.height / 2 - height / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
  top = Math.max(8, Math.min(top, window.innerHeight - height - hudReserve));
  return { top, left, width, height };
}

async function waitWhilePaused(pauseRef, runIdRef, runId) {
  while (pauseRef.current) {
    if (runIdRef.current !== runId) return false;
    await wait(120);
  }
  return runIdRef.current === runId;
}

/**
 * Runs a planned tour: scroll → spotlight → narrate → wait for voice/dwell → next.
 */
export default function useConciergeTour({ voiceEnabled }) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [steps, setSteps] = useState([]);
  const [meta, setMeta] = useState({ title: "", vibe: "" });
  const [spotlight, setSpotlight] = useState(null);
  const [narration, setNarration] = useState("");
  const [phase, setPhase] = useState("idle");

  const runIdRef = useRef(0);
  const pauseRef = useRef(false);
  const stopSpeechRef = useRef(() => {});
  const stepsRef = useRef([]);
  const indexRef = useRef(-1);
  const voiceRef = useRef(voiceEnabled);

  voiceRef.current = voiceEnabled;

  const clearSpotlight = useCallback(() => setSpotlight(null), []);

  const stop = useCallback(() => {
    runIdRef.current += 1;
    pauseRef.current = false;
    stopSpeechRef.current();
    setActive(false);
    setPhase("idle");
    setStepIndex(-1);
    setNarration("");
    clearSpotlight();
    indexRef.current = -1;
  }, [clearSpotlight]);

  const syncSpotlight = useCallback(() => {
    const step = stepsRef.current[indexRef.current];
    if (!step) return;
    const el = resolveTourTarget(step.id);
    setSpotlight(readRect(el));
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    const onScroll = () => syncSpotlight();
    const onResize = () => syncSpotlight();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [active, syncSpotlight]);

  const holdOnStep = useCallback(async (step, runId) => {
    const stillActive = () => runIdRef.current === runId;

    if (voiceRef.current) {
      stopSpeechRef.current();
      const { promise, cancel } = speakNarration(step.narration, { enabled: true });
      stopSpeechRef.current = cancel;

      await promise;
      if (!stillActive()) return;

      // Brief beat after speech before scrolling on.
      await wait(450);
      if (!stillActive()) return;
      if (!(await waitWhilePaused(pauseRef, runIdRef, runId))) return;
      return;
    }

    // No voice — keep the written line on screen for dwellMs.
    const dwell = step.dwellMs || 4800;
    const tick = 80;
    let elapsed = 0;
    while (elapsed < dwell) {
      if (!stillActive()) return;
      if (!(await waitWhilePaused(pauseRef, runIdRef, runId))) return;
      await wait(tick);
      elapsed += tick;
    }
  }, []);

  const runFrom = useCallback(
    async (startAt, runId) => {
      setPhase("running");
      setActive(true);

      for (let i = startAt; i < stepsRef.current.length; i++) {
        if (runIdRef.current !== runId) return;
        if (!(await waitWhilePaused(pauseRef, runIdRef, runId))) return;

        const step = stepsRef.current[i];
        indexRef.current = i;
        setStepIndex(i);

        const el = resolveTourTarget(step.id);
        await scrollToTarget(el);
        if (runIdRef.current !== runId) return;

        setSpotlight(readRect(el));
        setNarration(step.narration);

        await holdOnStep(step, runId);
        if (runIdRef.current !== runId) return;
      }

      if (runIdRef.current !== runId) return;

      setPhase("done");
      setNarration("Tour complete. Take the wheel — or ask for another path.");
      stopSpeechRef.current();

      if (voiceRef.current) {
        const { promise, cancel } = speakNarration(
          "Tour complete. Take the wheel — or ask for another path.",
          { enabled: true }
        );
        stopSpeechRef.current = cancel;
        await promise;
      } else {
        await wait(1600);
      }

      if (runIdRef.current === runId) stop();
    },
    [holdOnStep, stop]
  );

  const start = useCallback(
    async (tour) => {
      stopSpeechRef.current();
      pauseRef.current = false;
      const nextSteps = tour?.steps || [];
      stepsRef.current = nextSteps;
      setSteps(nextSteps);
      setMeta({ title: tour?.title || "Site tour", vibe: tour?.vibe || "" });
      setStepIndex(-1);
      indexRef.current = -1;
      const runId = runIdRef.current + 1;
      runIdRef.current = runId;
      await runFrom(0, runId);
    },
    [runFrom]
  );

  const togglePause = useCallback(() => {
    if (!active) return;
    pauseRef.current = !pauseRef.current;
    setPhase(pauseRef.current ? "paused" : "running");

    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        if (pauseRef.current) window.speechSynthesis.pause();
        else window.speechSynthesis.resume();
      }
    } catch {
      /* ignore */
    }
  }, [active]);

  const skip = useCallback(() => {
    if (!active || phase === "done") return;
    const next = indexRef.current + 1;
    stopSpeechRef.current();
    if (next >= stepsRef.current.length) {
      stop();
      return;
    }
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    pauseRef.current = false;
    runFrom(next, runId);
  }, [active, phase, runFrom, stop]);

  return {
    active,
    phase,
    steps,
    stepIndex,
    meta,
    spotlight,
    narration,
    start,
    stop,
    togglePause,
    skip,
  };
}
