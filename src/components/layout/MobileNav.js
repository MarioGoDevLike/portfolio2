import React, { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { scroller } from "react-scroll";
import { MOBILE_NAV, SCROLL_DURATION, SCROLL_OFFSET } from "../../constants";
import useSectionScroll from "../../hooks/useSectionScroll";

const BUBBLE_GRADIENT = "linear-gradient(135deg, rgba(129, 140, 248, 0.26) 0%, rgba(34, 211, 238, 0.16) 100%)";
const ACTIVE_ICON = "#818cf8";

const ITEM_W = 54;
const DOCK_PAD_H = 10;
const DOCK_PAD_V = 10;

const MobileNav = () => {
  const { activeSection, beginScrollTo } = useSectionScroll();

  const activeIndex = Math.max(
    0,
    MOBILE_NAV.findIndex((n) => n.to === activeSection)
  );

  const rawX = useMotionValue(activeIndex * ITEM_W + DOCK_PAD_H);
  const springX = useSpring(rawX, { stiffness: 380, damping: 28, mass: 0.85 });
  const vel = useVelocity(springX);
  const bubbleSX = useTransform(vel, [-720, 0, 720], [1.18, 1, 1.18]);
  const bubbleSY = useTransform(vel, [-720, 0, 720], [0.84, 1, 0.84]);

  useEffect(() => {
    rawX.set(activeIndex * ITEM_W + DOCK_PAD_H);
  }, [activeIndex, rawX]);

  const handleNav = (to, offset) => {
    beginScrollTo(to);
    scroller.scrollTo(to, {
      smooth: true,
      duration: SCROLL_DURATION,
      offset: offset !== undefined ? offset : SCROLL_OFFSET,
    });
  };

  const dockWidth = MOBILE_NAV.length * ITEM_W + DOCK_PAD_H * 2;

  return (
    <nav className="mobile-nav md:hidden" aria-label="Section navigation">
      <motion.div
        className="mobile-nav__shell"
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      >
        {/* Ambient gradient glow beneath dock */}
        <div className="mobile-nav__glow" aria-hidden="true" />

        {/* Dock */}
        <div className="mobile-nav__dock" style={{ width: dockWidth }}>
          {/* Gradient border ring */}
          <div className="mobile-nav__dock-ring" aria-hidden="true" />

          {/* Sliding active indicator */}
          <motion.div
            aria-hidden="true"
            className="mobile-nav__bubble"
            style={{
              top: DOCK_PAD_V,
              x: springX,
              width: ITEM_W,
              height: ITEM_W,
              scaleX: bubbleSX,
              scaleY: bubbleSY,
              background: BUBBLE_GRADIENT,
            }}
          />

          {MOBILE_NAV.map(({ label, to, Icon, offset }) => {
            const isActive = activeSection === to;

            return (
              <motion.button
                key={to}
                type="button"
                onClick={() => handleNav(to, offset)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className="mobile-nav__item"
                style={{ width: ITEM_W, height: ITEM_W }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 480, damping: 28 }}
              >
                <motion.span
                  className="mobile-nav__icon"
                  animate={{
                    scale: isActive ? 1.08 : 0.92,
                    color: isActive ? ACTIVE_ICON : "rgba(255,255,255,0.42)",
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                >
                  <Icon size={isActive ? 21 : 20} />
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
};

export default MobileNav;
