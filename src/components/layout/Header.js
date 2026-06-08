import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { HEADER_NAV, SCROLL_DURATION, SCROLL_OFFSET, SITE } from "../../constants";
import useSectionScroll from "../../hooks/useSectionScroll";

const EASE_EXPO = [0.22, 1, 0.36, 1];

/* Characters used during the scramble animation */
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$!%";
const SCRAMBLE_FRAMES = 10;
const SCRAMBLE_MS = 36;

const scrollProps = {
  smooth: true,
  duration: SCROLL_DURATION,
  offset: SCROLL_OFFSET,
  ease: "easeOutCubic",
};

/* ─── Letter-scramble hook ───────────────────────────────────
   Cycles through random characters before revealing the real
   text from left to right, like a terminal decoding sequence. */
function useScramble(text, active) {
  const [display, setDisplay] = useState(text);
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!active) {
      setDisplay(text);
      return;
    }
    let frame = 0;
    timerRef.current = setInterval(() => {
      frame++;
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            /* reveal letters left-to-right as frames progress */
            const revealAt = Math.floor((i / text.length) * SCRAMBLE_FRAMES);
            if (frame > revealAt) return text[i];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );
      if (frame >= SCRAMBLE_FRAMES) {
        clearInterval(timerRef.current);
        setDisplay(text);
      }
    }, SCRAMBLE_MS);

    return () => clearInterval(timerRef.current);
  }, [active, text]);

  return display;
}

/* ─── Single magnetic nav item ───────────────────────────────
   - Magnetic pull: label drifts toward cursor via springs
   - Scramble: letters decode on enter
   - Active dot: glowing indicator when section is active      */
const MagneticNavItem = ({
  label,
  to,
  isActive,
  isHighlighted,
  beginScrollTo,
  setHover,
  clearHover,
}) => {
  const wrapRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spx = useSpring(mx, { stiffness: 260, damping: 20 });
  const spy = useSpring(my, { stiffness: 260, damping: 20 });
  const [scramble, setScramble] = useState(false);
  const displayed = useScramble(label, scramble);

  const onMove = (e) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const onEnter = () => {
    setScramble(true);
    setHover(to);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setScramble(false);
    clearHover();
  };

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* sliding highlight pill — springs between items */}
      {isHighlighted && (
        <motion.span
          layoutId="nav-pill"
          className="desktop-header__nav-pill"
          style={{
            boxShadow:
              "0 0 0 1px rgba(129,140,248,0.18), 0 0 24px rgba(129,140,248,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}

      <Link
        to={to}
        {...scrollProps}
        className="desktop-header__nav-link"
        onClick={() => beginScrollTo(to)}
      >
        <motion.span
          className="desktop-header__nav-label"
          style={{
            x: spx,
            y: spy,
            display: "inline-block",
            position: "relative",
            color: isActive
              ? "#818cf8"
              : isHighlighted
              ? "rgba(255,255,255,0.82)"
              : "rgba(255,255,255,0.42)",
          }}
        >
          {/*
            Hidden layout anchor — always the real text,
            so the container width never changes during scramble.
          */}
          <span
            aria-hidden="true"
            style={{ opacity: 0, pointerEvents: "none", userSelect: "none" }}
          >
            {label}
          </span>

          {/* Scrambled/real text overlaid, centered */}
          <span
            aria-label={label}
            style={{ position: "absolute", inset: 0, textAlign: "center" }}
          >
            {displayed}
          </span>
        </motion.span>
      </Link>

      {/* Glowing dot under the active section label */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            key="active-dot"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            style={{
              position: "absolute",
              bottom: 2,
              left: "calc(50% - 2px)",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#818cf8",
              boxShadow: "0 0 9px rgba(129,140,248,0.9)",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Header ─────────────────────────────────────────────── */
const Header = () => {
  const { activeSection, beginScrollTo } = useSectionScroll();
  const [hoveredNav, setHoveredNav] = useState(null);

  const highlightedNav =
    hoveredNav ??
    (HEADER_NAV.some((n) => n.to === activeSection) ? activeSection : null);

  const [firstName, lastName] = SITE.name.split(" ");

  /* ── Global mouse → 3D bar tilt ──
     The whole floating pill subtly rotates in both axes,
     making it feel like a physical panel tracking the cursor. */
  const gx = useMotionValue(0.5);
  const gy = useMotionValue(0.5);
  const sgx = useSpring(gx, { stiffness: 36, damping: 18 });
  const sgy = useSpring(gy, { stiffness: 36, damping: 18 });
  const barRotY = useTransform(sgx, [0, 0.5, 1], [2.4, 0, -2.4]);
  const barRotX = useTransform(sgy, [0, 0.25, 0.75, 1], [-1.0, 0, 0, 1.0]);

  useEffect(() => {
    const onMouseMove = (e) => {
      gx.set(e.clientX / window.innerWidth);
      gy.set(e.clientY / window.innerHeight);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [gx, gy]);

  /* ── CTA magnetic ── */
  const ctaRef = useRef(null);
  const cmx = useMotionValue(0);
  const cmy = useMotionValue(0);
  const scmx = useSpring(cmx, { stiffness: 280, damping: 22 });
  const scmy = useSpring(cmy, { stiffness: 280, damping: 22 });

  const onCtaMove = (e) => {
    const r = ctaRef.current?.getBoundingClientRect();
    if (!r) return;
    cmx.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    cmy.set((e.clientY - (r.top + r.height / 2)) * 0.22);
  };
  const onCtaLeave = () => {
    cmx.set(0);
    cmy.set(0);
  };

  return (
      <header
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center px-5 lg:px-8 pt-5 pointer-events-none"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="desktop-header__shell pointer-events-auto"
          style={{ rotateY: barRotY, rotateX: barRotX }}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
        >
          {/* ── Brand ── */}
          <Link
            to="home"
            {...scrollProps}
            offset={0}
            className="desktop-header__brand cursor-pointer"
            onClick={() => beginScrollTo("home")}
          >
            <motion.div
              className="desktop-header__monogram"
              whileHover={{
                scale: 1.1,
                boxShadow:
                  "0 0 0 1px rgba(129,140,248,0.32), 0 0 20px rgba(129,140,248,0.20), inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              aria-hidden="true"
            >
              <span className="text-white">{firstName[0]}</span>
              <span className="text-[#7B96FF]">{lastName[0]}</span>
            </motion.div>

            <div className="desktop-header__identity">
              <span className="desktop-header__name">
                {firstName}{" "}
                <span className="text-[#7B96FF]">{lastName}</span>
              </span>
              <span className="desktop-header__role">{SITE.role}</span>
            </div>
          </Link>

          {/* ── Nav ── */}
          <nav className="desktop-header__nav-track" aria-label="Primary">
            {HEADER_NAV.map(({ label, to }) => (
              <MagneticNavItem
                key={to}
                label={label}
                to={to}
                isActive={activeSection === to}
                isHighlighted={highlightedNav === to}
                beginScrollTo={beginScrollTo}
                setHover={setHoveredNav}
                clearHover={() => setHoveredNav(null)}
              />
            ))}
          </nav>

          {/* ── CTA ── */}
          <div className="justify-self-end">
            <Link
              to="contact"
              {...scrollProps}
              className="cursor-pointer"
              onClick={() => beginScrollTo("contact")}
            >
              <motion.button
                ref={ctaRef}
                type="button"
                className="desktop-header__cta"
                style={{ x: scmx, y: scmy }}
                onMouseMove={onCtaMove}
                onMouseLeave={onCtaLeave}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <span>Let&apos;s talk</span>
                <span className="desktop-header__cta-icon">
                  <HiArrowUpRight size={13} color="#fff" />
                </span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </header>
  );
};

export default Header;
