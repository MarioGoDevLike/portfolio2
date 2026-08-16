import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../../animations/variants";
import { SITE } from "../../constants";

const DURATION_MS = 2600;
const INTERVAL_MS = 16;

const BOOT_LINES = [
  { at: 8, text: "mount workspace" },
  { at: 22, text: "hydrate routes · home → contact" },
  { at: 38, text: "link case studies · 7 projects" },
  { at: 55, text: "prime motion layer" },
  { at: 72, text: "open contact channel" },
  { at: 88, text: "stand by for transmission" },
];

const STATUS_STEPS = [
  { until: 28, label: "Booting" },
  { until: 58, label: "Syncing" },
  { until: 86, label: "Calibrating" },
  { until: 101, label: "Ready" },
];

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      const t = setTimeout(() => setExiting(true), 350);
      return () => clearTimeout(t);
    }

    const increment = 100 / (DURATION_MS / INTERVAL_MS);
    const timer = setInterval(() => {
      setCount((prev) => {
        const next = Math.min(prev + increment, 100);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setExiting(true), 420);
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  const progress = Math.floor(count);
  const status =
    STATUS_STEPS.find((step) => progress < step.until)?.label ?? "Ready";
  const visibleLines = BOOT_LINES.filter((line) => progress >= line.at);
  const ringOffset = 276 - (276 * Math.min(progress, 100)) / 100;

  return (
    <div
      className={`boot${exiting ? " boot--exit" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {!exiting && (
        <>
          <div className="boot__atmosphere" aria-hidden="true">
            <span className="boot__grain" />
            <span className="boot__beam" />
            <span className="boot__scan" />
          </div>

          <div className="boot__hud" aria-hidden="true">
            <i className="boot__corner boot__corner--tl" />
            <i className="boot__corner boot__corner--tr" />
            <i className="boot__corner boot__corner--bl" />
            <i className="boot__corner boot__corner--br" />
          </div>

          <header className="boot__meta">
            <span className="boot__meta-id">MN · SYS</span>
            <span className="boot__meta-sep" />
            <AnimatePresence mode="wait">
              <motion.span
                key={status}
                className="boot__meta-status"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
              >
                {status}
              </motion.span>
            </AnimatePresence>
            <span className="boot__meta-clock">
              {String(progress).padStart(3, "0")}
            </span>
          </header>

          <div className="boot__stage">
            <div className="boot__scope" aria-hidden="true">
              <svg className="boot__ring boot__ring--track" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" />
              </svg>
              <svg className="boot__ring boot__ring--progress" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  style={{ strokeDashoffset: ringOffset }}
                />
              </svg>
              <motion.span
                className="boot__orbit"
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="boot__orbit boot__orbit--inner"
                animate={prefersReducedMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <motion.div
              className="boot__glyph"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.1 }}
            >
              <svg
                viewBox="0 0 120 72"
                className="boot__monogram"
                aria-hidden="true"
              >
                <motion.path
                  d="M8 64 V12 L36 48 L64 12 V64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0.35 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.15 }}
                />
                <motion.path
                  d="M78 64 L78 12 L112 64 L112 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0.35 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.35 }}
                />
              </svg>
              <span className="boot__glyph-sub">portfolio boot</span>
            </motion.div>
          </div>

          <div className="boot__log" aria-hidden="true">
            <span className="boot__log-label">Sequence</span>
            <ul className="boot__log-list">
              <AnimatePresence initial={false}>
                {visibleLines.map((line) => (
                  <motion.li
                    key={line.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                  >
                    <span className="boot__log-mark">›</span>
                    {line.text}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          <footer className="boot__footer">
            <div className="boot__identity">
              <span className="boot__name">{SITE.name}</span>
              <span className="boot__role">{SITE.role}</span>
            </div>
            <div className="boot__meter" aria-hidden="true">
              <span
                className="boot__meter-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </footer>
        </>
      )}

      <AnimatePresence>
        {exiting && (
          <>
            <motion.span
              key="shutter-l"
              className="boot__shutter boot__shutter--left"
              initial={{ x: "0%" }}
              animate={{ x: "-101%" }}
              transition={{
                duration: prefersReducedMotion ? 0.35 : 0.9,
                ease: EASE_OUT_EXPO,
              }}
              onAnimationComplete={onComplete}
              aria-hidden="true"
            />
            <motion.span
              key="shutter-r"
              className="boot__shutter boot__shutter--right"
              initial={{ x: "0%" }}
              animate={{ x: "101%" }}
              transition={{
                duration: prefersReducedMotion ? 0.35 : 0.9,
                ease: EASE_OUT_EXPO,
              }}
              aria-hidden="true"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Preloader;
