import React, { useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { scroller } from "react-scroll";
import { MOBILE_NAV, SCROLL_DURATION, SCROLL_OFFSET } from "../../constants";
import useSectionScroll from "../../hooks/useSectionScroll";

/*
  Each item occupies exactly ITEM_W px so we can calculate the bubble's
  x position mathematically rather than measuring DOM rects.
*/
const ITEM_W = 52;
const DOCK_PAD_H = 8; /* horizontal inner padding */
const DOCK_PAD_V = 8; /* vertical inner padding   */

/* ─── MobileNav ─────────────────────────────────────────── */
const MobileNav = () => {
  const { activeSection, beginScrollTo } = useSectionScroll();

  const activeIndex = Math.max(
    0,
    MOBILE_NAV.findIndex((n) => n.to === activeSection)
  );

  /* ── Bubble spring ──────────────────────────────────────
     rawX is the target; springX follows with spring physics.
     useVelocity lets us squash/stretch the bubble while moving. */
  const rawX = useMotionValue(activeIndex * ITEM_W + DOCK_PAD_H);
  const springX = useSpring(rawX, { stiffness: 360, damping: 26, mass: 0.9 });
  const vel = useVelocity(springX);

  /* Squash-and-stretch: bubble elongates horizontally and
     flattens vertically while it's in motion */
  const bubbleSX = useTransform(vel, [-720, 0, 720], [1.24, 1, 1.24]);
  const bubbleSY = useTransform(vel, [-720, 0, 720], [0.80, 1, 0.80]);

  useEffect(() => {
    rawX.set(activeIndex * ITEM_W + DOCK_PAD_H);
  }, [activeIndex, rawX]);

  /* ── Navigation handler ─────────────────────────────── */
  const handleNav = (to, offset) => {
    beginScrollTo(to);
    scroller.scrollTo(to, {
      smooth: true,
      duration: SCROLL_DURATION,
      offset: offset !== undefined ? offset : SCROLL_OFFSET,
    });
  };

  const activeLabel =
    MOBILE_NAV.find((n) => n.to === activeSection)?.label ?? "";

  return (
    <nav className="mobile-nav md:hidden" aria-label="Section navigation">
      {/* ── Wrapper: makes label + dock a single stacked unit ── */}
      <motion.div
        style={{ position: "relative" }}
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      >
        {/* ── Active section label (floats above dock) ── */}
        <AnimatePresence mode="wait">
          <motion.span
            key={activeSection}
            initial={{ opacity: 0, y: 6, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -5, filter: "blur(5px)" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(129,140,248,0.88)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {activeLabel}
          </motion.span>
        </AnimatePresence>

        {/* ── Dock ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            padding: `${DOCK_PAD_V}px ${DOCK_PAD_H}px`,
            background: "rgba(10, 10, 13, 0.93)",
            backdropFilter: "blur(36px)",
            WebkitBackdropFilter: "blur(36px)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 999,
            boxShadow:
              "0 22px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* ── Morphing bubble indicator ──
              Slides to the active icon with spring physics.
              Squashes on fast travel, pops back to a square when settled. */}
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: DOCK_PAD_V,
              left: 0,
              x: springX,
              width: ITEM_W,
              height: ITEM_W,
              borderRadius: 15,
              scaleX: bubbleSX,
              scaleY: bubbleSY,
              background:
                "linear-gradient(135deg, rgba(129,140,248,0.26) 0%, rgba(34,211,238,0.16) 100%)",
              boxShadow:
                "0 0 28px rgba(129,140,248,0.38), inset 0 1px 0 rgba(255,255,255,0.12)",
              border: "1px solid rgba(129,140,248,0.26)",
              pointerEvents: "none",
            }}
          />

          {/* ── Nav items with perspective-depth scale ── */}
          {MOBILE_NAV.map(({ label, to, Icon, offset }, i) => {
            const isActive = activeSection === to;
            /* distance from active item drives the depth scale */
            const dist = Math.abs(i - activeIndex);

            return (
              <motion.button
                key={to}
                type="button"
                onClick={() => handleNav(to, offset)}
                aria-label={label}
                style={{
                  width: ITEM_W,
                  height: ITEM_W,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  outline: "none",
                  touchAction: "manipulation",
                }}
                /* Depth-of-field scale: active is "close", outer items recede */
                animate={{
                  scale: isActive ? 1.08 : dist === 1 ? 0.86 : 0.72,
                  opacity: isActive ? 1 : dist === 1 ? 0.52 : 0.34,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                whileTap={{ scale: 0.78 }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive
                      ? "#818cf8"
                      : "rgba(255,255,255,0.48)",
                    transition: "color 0.28s ease",
                  }}
                >
                  <Icon size={20} />
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
};

export default MobileNav;
