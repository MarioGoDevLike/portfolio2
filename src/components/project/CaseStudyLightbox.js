import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";

const SWIPE_THRESHOLD = 48;
const EASE = [0.22, 1, 0.36, 1];

function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
    portrait: window.innerHeight > window.innerWidth,
    mobile: window.innerWidth < 640,
  }));

  useEffect(() => {
    const fn = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight,
      portrait: window.innerHeight > window.innerWidth,
      mobile: window.innerWidth < 640,
    });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return vp;
}

export function getLightboxDims(type, vp) {
  const { w, h, portrait, mobile } = vp;
  const phoneW = Math.min(Math.round((h * 0.78) / 2.08), mobile ? 300 : 360);

  if (type !== "web") {
    return { phoneW, webWidth: 0, webRotateLandscape: false };
  }

  if (portrait && mobile) {
    return {
      phoneW,
      webWidth: Math.min(Math.round(h * 0.88), 1000),
      webRotateLandscape: true,
    };
  }

  return {
    phoneW,
    webWidth: Math.min(Math.round(w * 0.94), 1100),
    webRotateLandscape: false,
  };
}

/** Full-bleed landscape website screenshot for lightbox clarity */
export const LandscapeWebImage = ({ screen, dir, width }) => (
  <div
    style={{
      width,
      aspectRatio: "16 / 9",
      borderRadius: 10,
      overflow: "hidden",
      background: "#0a0a0a",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 32px 64px rgba(0,0,0,0.75), 0 0 40px rgba(255,255,255,0.04)",
    }}
  >
    <AnimatePresence mode="wait" custom={dir}>
      <motion.img
        key={screen.src}
        custom={dir}
        src={screen.src}
        alt={screen.label}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        initial={{ x: dir * 56, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -dir * 56, opacity: 0 }}
        transition={{ duration: 0.34, ease: EASE }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "top center",
          display: "block",
        }}
        draggable={false}
      />
    </AnimatePresence>
  </div>
);

const NavButton = ({ dir, onClick }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.1)" }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    aria-label={dir === -1 ? "Previous" : "Next"}
    style={{
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "rgba(255,255,255,0.55)",
      outline: "none",
      flexShrink: 0,
    }}
  >
    {dir === -1 ? <HiChevronLeft size={22} /> : <HiChevronRight size={22} />}
  </motion.button>
);

const CaseStudyLightbox = ({
  type = "phone",
  screens,
  idx,
  dir,
  onStep,
  onJump,
  onClose,
  glowColor = "rgba(255,255,255,0.07)",
  renderSlide,
  renderFooter,
}) => {
  const screen = screens[idx];
  const vp = useViewport();
  const dims = getLightboxDims(type, vp);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onStep, onClose]);

  const handleDragEnd = useCallback((_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD) onStep(1);
    else if (info.offset.x > SWIPE_THRESHOLD) onStep(-1);
  }, [onStep]);

  const showArrows = !vp.mobile;
  const isWebLandscape = type === "web" && dims.webRotateLandscape;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10002,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.97)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        padding: vp.mobile ? "52px 12px 20px" : "64px 24px 28px",
        gap: 16,
        overflow: "hidden",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: Math.min(vp.w, 700),
          height: 500,
          background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 65%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: vp.mobile ? 16 : 22,
          left: vp.mobile ? 16 : 24,
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 12,
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.22)",
        }}
      >
        {idx + 1} / {screens.length}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.08, background: "rgba(255,255,255,0.12)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: vp.mobile ? 12 : 16,
          right: vp.mobile ? 12 : 16,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(255,255,255,0.65)",
          outline: "none",
          zIndex: 10,
        }}
      >
        <HiX size={18} />
      </motion.button>

      {/* Swipe zone — horizontal swipe works in screen space even when content is rotated */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={handleDragEnd}
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
          touchAction: "pan-y",
          cursor: vp.mobile ? "grab" : "default",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: type === "phone" ? 28 : 20,
            width: "100%",
            transform: isWebLandscape ? "rotate(90deg)" : undefined,
            transformOrigin: "center center",
          }}
        >
          {showArrows && <NavButton dir={-1} onClick={() => onStep(-1)} />}

          <motion.div
            key={screen.src}
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            style={{ flexShrink: 0 }}
          >
            {renderSlide(screen, dims)}
          </motion.div>

          {showArrows && <NavButton dir={1} onClick={() => onStep(1)} />}
        </div>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {renderFooter ? renderFooter(screen) : (
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.04em",
          }}
          >
            {screen.label}
          </span>
        )}
        {vp.mobile && screens.length > 1 && (
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.02em",
          }}
          >
            Swipe left or right
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default CaseStudyLightbox;
