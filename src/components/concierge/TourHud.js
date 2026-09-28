import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiBackward,
  HiForward,
  HiPause,
  HiPlay,
  HiSpeakerWave,
  HiSpeakerXMark,
  HiXMark,
} from "react-icons/hi2";

const EASE = [0.22, 1, 0.36, 1];
const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

const HudButton = ({ label, onClick, disabled, active, children }) => (
  <button
    type="button"
    className={`cc-icon-btn${active ? " is-active" : ""}`}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
  >
    {children}
  </button>
);

/** Dimmed page, spotlight on the current section, and the tour controls. */
const TourHud = ({ tour }) => {
  const { index, total, current, paused, voice, spotlight, end, next, prev } = tour;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") end();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [end, next, prev]);

  return (
    <motion.div
      className="cc-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="cc-stage__veil" aria-hidden="true" />
      {spotlight && (
        <motion.div
          className="cc-spotlight"
          initial={false}
          animate={spotlight}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          aria-hidden="true"
        />
      )}

      <motion.div
        className="cc-hud"
        role="region"
        aria-label="Site tour"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <div className="cc-hud__meta">
          <span className="cc-hud__label">{current?.label}</span>
          <span className="cc-hud__count">
            {index + 1} / {total}
          </span>
        </div>
        <div className="cc-hud__progress" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={i < index ? "is-done" : i === index ? "is-active" : ""} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={current?.id}
            className="cc-hud__line"
            aria-live="polite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {current?.line}
          </motion.p>
        </AnimatePresence>

        <div className="cc-hud__controls">
          <HudButton label="Previous" onClick={prev} disabled={index <= 0}>
            <HiBackward aria-hidden="true" />
          </HudButton>
          <HudButton label={paused ? "Resume" : "Pause"} onClick={tour.togglePause}>
            {paused ? <HiPlay aria-hidden="true" /> : <HiPause aria-hidden="true" />}
          </HudButton>
          <HudButton label={index + 1 >= total ? "Finish" : "Next"} onClick={next}>
            <HiForward aria-hidden="true" />
          </HudButton>
          <span className="cc-hud__spacer" />
          {canSpeak && (
            <HudButton label={voice ? "Mute narration" : "Read aloud"} onClick={tour.toggleVoice} active={voice}>
              {voice ? <HiSpeakerWave aria-hidden="true" /> : <HiSpeakerXMark aria-hidden="true" />}
            </HudButton>
          )}
          <HudButton label="End tour" onClick={end}>
            <HiXMark aria-hidden="true" />
          </HudButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TourHud;
