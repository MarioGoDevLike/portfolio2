import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "../../animations/variants";
import { SITE } from "../../constants";

const DURATION_MS = 2200;
const INTERVAL_MS = 16;

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const increment = 100 / (DURATION_MS / INTERVAL_MS);

    const timer = setInterval(() => {
      setCount((prev) => {
        const next = Math.min(prev + increment, 100);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setExiting(true), 350);
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="preloader"
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      initial={{ y: 0 }}
      transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
      onAnimationComplete={() => exiting && onComplete()}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="preloader__orb preloader__orb--violet" aria-hidden="true" />
      <div className="preloader__orb preloader__orb--cyan" aria-hidden="true" />

      <motion.p
        className="preloader__counter"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        aria-hidden="true"
      >
        {String(Math.floor(count)).padStart(2, "0")}
      </motion.p>

      <div className="preloader__footer">
        <div className="flex justify-between items-center mb-3">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="preloader__label"
          >
            Loading Experience
          </motion.span>
          <span className="preloader__percent">{Math.floor(count)}%</span>
        </div>

        <div className="preloader__track">
          <div className="preloader__bar" style={{ width: `${count}%` }} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="preloader__brand"
        >
          {SITE.name}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Preloader;
