import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsSkipEndFill,
  BsVolumeMute,
  BsVolumeUp,
  BsX,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import useConciergeTour from "../../hooks/useConciergeTour";
import { requestTourPlan } from "../../services/tourApi";
import VoiceAskPanel from "./VoiceAskPanel";

const EASE = [0.22, 1, 0.36, 1];
const WELCOME_KEY = "concierge.welcomeSeen";

const Spotlight = ({ rect }) => {
  if (!rect) return null;
  return (
    <motion.div
      className="concierge-spotlight"
      initial={false}
      animate={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        opacity: 1,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      aria-hidden="true"
    >
      <span className="concierge-spotlight__ring" />
      <span className="concierge-spotlight__glow" />
    </motion.div>
  );
};

const SiteConcierge = () => {
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [panelMode, setPanelMode] = useState("tour"); // tour | ask
  const [prompt, setPrompt] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState("");

  const {
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
  } = useConciergeTour({ voiceEnabled });

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
    const onVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    try {
      if (sessionStorage.getItem(WELCOME_KEY) === "1") return undefined;
    } catch {
      /* show welcome anyway */
    }

    const timer = window.setTimeout(() => setWelcomeOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const markWelcomeSeen = () => {
    try {
      sessionStorage.setItem(WELCOME_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const dismissWelcome = () => {
    markWelcomeSeen();
    setWelcomeOpen(false);
  };

  const acceptWelcomeTour = () => {
    markWelcomeSeen();
    setWelcomeOpen(false);
    setOpen(true);
  };

  const beginTour = async () => {
    setLoading(true);
    setError(null);
    setHint("");
    try {
      const tour = await requestTourPlan({ prompt });
      setOpen(false);
      if (tour.warning) setHint(tour.warning);
      await start(tour);
    } catch (err) {
      setError(err.message || "Could not start tour");
    } finally {
      setLoading(false);
    }
  };

  const endEverything = () => {
    stop();
    setOpen(false);
    setError(null);
  };

  const currentLabel = steps[stepIndex]?.label;

  return (
    <>
      {/* Welcome gate — tour or explore alone */}
      <AnimatePresence>
        {welcomeOpen && !active && (
          <motion.div
            className="concierge-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              className="concierge-welcome__backdrop"
              aria-label="Dismiss"
              onClick={dismissWelcome}
            />
            <motion.div
              className="concierge-welcome__card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="concierge-welcome-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className="concierge-welcome__badge">
                <HiSparkles size={13} /> AI Concierge
              </span>
              <h2 id="concierge-welcome-title" className="concierge-welcome__title">
                Want a guided tour?
              </h2>
              <p className="concierge-welcome__copy">
                I can walk you through the site with AI — or you can explore at
                your own pace.
              </p>
              <div className="concierge-welcome__actions">
                <motion.button
                  type="button"
                  className="concierge-welcome__btn concierge-welcome__btn--primary"
                  onClick={acceptWelcomeTour}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Yes, give me a tour
                </motion.button>
                <motion.button
                  type="button"
                  className="concierge-welcome__btn concierge-welcome__btn--ghost"
                  onClick={dismissWelcome}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  I’ll scroll myself
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic dim + spotlight while touring */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="concierge-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="concierge-stage__veil" aria-hidden="true" />
            <Spotlight rect={spotlight} />

            <div className="concierge-hud-wrap">
              <motion.div
                className="concierge-hud"
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <div className="concierge-hud__top">
                  <div className="concierge-hud__identity">
                    <span className="concierge-hud__orb" aria-hidden="true">
                      <HiSparkles size={14} />
                    </span>
                    <div>
                      <p className="concierge-hud__kicker">AI Concierge</p>
                      <p className="concierge-hud__title">
                        {meta.title || "Guided tour"}
                        {currentLabel ? (
                          <span className="concierge-hud__stop">
                            {" "}
                            · {currentLabel}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>

                  <div className="concierge-hud__progress" aria-hidden="true">
                    {steps.map((s, i) => (
                      <span
                        key={s.id + i}
                        className={`concierge-hud__dot ${
                          i === stepIndex
                            ? "is-active"
                            : i < stepIndex
                              ? "is-done"
                              : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={narration}
                    className="concierge-hud__line"
                    initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {narration}
                  </motion.p>
                </AnimatePresence>

                {meta.vibe && (
                  <p className="concierge-hud__vibe">{meta.vibe}</p>
                )}

                <div className="concierge-hud__controls">
                  <button
                    type="button"
                    className="concierge-hud__btn"
                    onClick={togglePause}
                    aria-label={phase === "paused" ? "Resume tour" : "Pause tour"}
                  >
                    {phase === "paused" ? (
                      <BsFillPlayFill size={16} />
                    ) : (
                      <BsFillPauseFill size={16} />
                    )}
                    <span>{phase === "paused" ? "Resume" : "Pause"}</span>
                  </button>
                  <button
                    type="button"
                    className="concierge-hud__btn"
                    onClick={skip}
                    aria-label="Skip to next stop"
                  >
                    <BsSkipEndFill size={16} />
                    <span>Next</span>
                  </button>
                  <button
                    type="button"
                    className="concierge-hud__btn concierge-hud__btn--ghost"
                    onClick={endEverything}
                    aria-label="End tour"
                  >
                    <BsX size={18} />
                    <span>End</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher + planner panel */}
      {!active && (
        <div className={`concierge-dock ${open ? "is-open" : ""}`}>
          <AnimatePresence>
            {open && (
              <motion.button
                type="button"
                key="concierge-backdrop"
                className="concierge-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-label="Close tour panel"
                onClick={() => setOpen(false)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {open && (
              <motion.div
                className="concierge-panel"
                initial={{ opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE }}
                role="dialog"
                aria-modal="true"
                aria-label="AI Site Concierge"
              >
                <div className="concierge-panel__grab" aria-hidden="true" />
                <div className="concierge-panel__head">
                  <div>
                    <p className="concierge-panel__eyebrow">
                      <HiSparkles size={12} /> Live guide
                    </p>
                    <h3 className="concierge-panel__title">
                      {panelMode === "ask"
                        ? "Ask about Mario"
                        : "Let the site take you through"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="concierge-panel__close"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                  >
                    <BsX size={18} />
                  </button>
                </div>

                <div className="concierge-panel__tabs" role="tablist" aria-label="Concierge modes">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={panelMode === "tour"}
                    className={`concierge-panel__tab ${panelMode === "tour" ? "is-active" : ""}`}
                    onClick={() => setPanelMode("tour")}
                  >
                    Guided tour
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={panelMode === "ask"}
                    className={`concierge-panel__tab ${panelMode === "ask" ? "is-active" : ""}`}
                    onClick={() => setPanelMode("ask")}
                  >
                    Ask with voice
                  </button>
                </div>

                {panelMode === "tour" ? (
                  <>
                    <p className="concierge-panel__copy">
                      A short walk through the site — how it’s built, and why
                      Mario’s work stands out.
                    </p>

                    <label className="concierge-panel__label" htmlFor="concierge-prompt">
                      Optional direction
                    </label>
                    <input
                      id="concierge-prompt"
                      className="concierge-panel__input"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder='e.g. "Focus on mobile apps"'
                    />

                    <div className="concierge-panel__row">
                      <button
                        type="button"
                        className={`concierge-voice ${voiceEnabled ? "is-on" : ""}`}
                        onClick={() => setVoiceEnabled((v) => !v)}
                      >
                        {voiceEnabled ? (
                          <BsVolumeUp size={14} />
                        ) : (
                          <BsVolumeMute size={14} />
                        )}
                        Voice {voiceEnabled ? "on" : "off"}
                      </button>

                      <motion.button
                        type="button"
                        className="concierge-panel__go"
                        onClick={beginTour}
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.97 }}
                      >
                        {loading ? "Choreographing…" : "Start guided tour"}
                      </motion.button>
                    </div>

                    {error && <p className="concierge-panel__error">{error}</p>}
                    {hint && !error && (
                      <p className="concierge-panel__hint">
                        Using offline choreography · {hint.slice(0, 90)}
                      </p>
                    )}
                  </>
                ) : (
                  <VoiceAskPanel />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            className={`concierge-launcher ${open ? "is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close AI Tour" : "Open AI Tour"}
            title="AI Tour"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="concierge-launcher__core">
              <HiSparkles size={16} />
            </span>
            <span className="concierge-launcher__text">
              {open ? "Close" : "AI Tour"}
            </span>
          </motion.button>
        </div>
      )}
    </>
  );
};

export default SiteConcierge;
