import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-scroll";
import { BsArrowDown } from "react-icons/bs";
import avatar from "../../assets/avatar.png";
import { SITE } from "../../constants";
import SocialLinks from "../ui/SocialLinks";

const EASE_EXPO = [0.22, 1, 0.36, 1];
const AVATAR_SIZE = 288;
const RING_PAD = 22;

/* ─── per-letter blur reveal ──────────────────── */
const LetterReveal = ({ text, baseDelay = 0 }) =>
  text.split("").map((char, i) => (
    <motion.span
      key={i}
      style={{ display: "inline-block" }}
      initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.65, ease: EASE_EXPO, delay: baseDelay + i * 0.045 }}
    >
      {char}
    </motion.span>
  ));

/* ─── floating data chip ──────────────────────── */
const DataChip = ({ value, label, accentColor, style, delay = 0 }) => (
  <motion.div
    style={{
      position: "absolute",
      borderRadius: 16,
      background: "rgba(7,7,11,0.90)",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      boxShadow: "0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
      padding: "12px 18px",
      zIndex: 20,
      ...style,
    }}
    initial={{ opacity: 0, scale: 0.78 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.55, ease: EASE_EXPO, delay }}
  >
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.8 + delay, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 20,
          lineHeight: 1,
          color: accentColor,
        }}
      >
        {value}
      </p>
      <p
        style={{
          margin: "5px 0 0",
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.30)",
        }}
      >
        {label}
      </p>
    </motion.div>
  </motion.div>
);

/* ─── rotating SVG ring ───────────────────────── */
const OrbitalRing = ({ size, dashArray, stroke, duration, reverse = false }) => (
  <motion.div
    style={{ position: "absolute", inset: -(size - AVATAR_SIZE) / 2, zIndex: 0 }}
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
    aria-hidden="true"
  >
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 2}
        stroke={stroke}
        strokeWidth="1"
        strokeDasharray={dashArray}
      />
    </svg>
  </motion.div>
);

/* ─── HERO SECTION ────────────────────────────── */
const HeroSection = () => {
  const sectionRef = useRef(null);
  const mX = useMotionValue(0.5);
  const mY = useMotionValue(0.5);
  const spX = useSpring(mX, { stiffness: 45, damping: 20 });
  const spY = useSpring(mY, { stiffness: 45, damping: 20 });

  /* aurora parallax — each blob moves at different rate/direction */
  const b1x = useTransform(spX, [0, 1], [-55, 55]);
  const b1y = useTransform(spY, [0, 1], [-38, 38]);
  const b2x = useTransform(spX, [0, 1], [35, -35]);
  const b2y = useTransform(spY, [0, 1], [25, -25]);
  /* avatar counter-moves (deeper parallax layer) */
  const avX = useTransform(spX, [0, 1], [16, -16]);
  const avY = useTransform(spY, [0, 1], [9, -9]);

  const onMouseMove = useCallback(
    (e) => {
      const r = sectionRef.current?.getBoundingClientRect();
      if (!r) return;
      mX.set((e.clientX - r.left) / r.width);
      mY.set((e.clientY - r.top) / r.height);
    },
    [mX, mY]
  );

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      id="home"
      onMouseMove={onMouseMove}
      style={{ position: "relative" }}
    >
      {/* ── Aurora blobs (clipped so they don't scroll the page) ── */}
      <div
        style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <motion.div
          style={{
            position: "absolute",
            width: 660,
            height: 660,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(129,140,248,0.22) 0%, transparent 62%)",
            filter: "blur(90px)",
            top: "-22%",
            right: "-8%",
            x: b1x,
            y: b1y,
          }}
          animate={{ scale: [1, 1.09, 0.95, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 62%)",
            filter: "blur(80px)",
            bottom: "-18%",
            left: "-6%",
            x: b2x,
            y: b2y,
          }}
          animate={{ scale: [1, 0.92, 1.07, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
        {/* mid-tone indigo accent */}
        <div
          style={{
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.09) 0%, transparent 65%)",
            filter: "blur(70px)",
            top: "40%",
            left: "40%",
            transform: "translate(-50%,-50%)",
          }}
        />
      </div>

      <div className="container w-full relative" style={{ zIndex: 1 }}>

        {/* ── Mobile circular avatar ── */}
        <motion.div
          className="flex justify-center mb-10 lg:hidden"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.15 }}
        >
          <div style={{ position: "relative", width: 148, height: 148 }}>
            {/* rotating ring */}
            <motion.div
              style={{ position: "absolute", inset: -14 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              <svg width={176} height={176} viewBox="0 0 176 176" fill="none">
                <circle cx={88} cy={88} r={85} stroke="rgba(129,140,248,0.28)" strokeWidth="1" strokeDasharray="6 11" />
              </svg>
            </motion.div>
            {/* pulse ring */}
            <motion.div
              style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "1px solid rgba(129,140,248,0.28)" }}
              animate={{ opacity: [0.28, 0.65, 0.28], scale: [1, 1.018, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              style={{
                width: 148, height: 148, borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(0,0,0,0.35)",
              }}
            >
              <img
                src={avatar}
                alt={SITE.name}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                  objectPosition: "center center",
                }}
              />
            </div>
            <span
              style={{
                position: "absolute", bottom: 5, right: 5,
                width: 14, height: 14, borderRadius: "50%",
                background: "#34d399",
                border: "2.5px solid #050505",
                boxShadow: "0 0 9px rgba(52,211,153,0.55)",
              }}
              aria-label="Available for work"
            />
          </div>
        </motion.div>

        {/* ── Main flex row ── */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-14 lg:gap-16">

          {/* ══ LEFT — text ══ */}
          <div className="flex-1 min-w-0">

            {/* availability label */}
            {/* <motion.span
              className="label"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.18 }}
            >
              {SITE.availability} ✦
            </motion.span> */}

            {/* NAME — letter-by-letter reveal */}
            <h1
              className="text-display"
              style={{ marginBottom: 6, letterSpacing: "-0.03em", lineHeight: 0.95 }}
            >
              {/* "Mario" — white letters */}
              <span style={{ display: "block" }}>
                <LetterReveal text="Mario" baseDelay={0.32} />
              </span>

              {/* "Nassar" — gradient, whole-word reveal */}
              <motion.span
                className="text-gradient"
                style={{ display: "block" }}
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.75, ease: EASE_EXPO, delay: 0.72 }}
              >
                Nassar
              </motion.span>
            </h1>

            {/* role */}
            <motion.div
              className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <span className="text-role-prefix">I'm a</span>
              <TypeAnimation
                sequence={SITE.roles.flatMap((r) => [r, 2200])}
                speed={55}
                wrapper="span"
                repeat={Infinity}
                className="text-role"
              />
            </motion.div>

            {/* tagline */}
            <motion.p
              className="text-body text-white/40 mb-8 max-w-[420px]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_EXPO, delay: 1.1 }}
            >
              {SITE.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row sm:items-center gap-3 mb-10"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_EXPO, delay: 1.2 }}
            >
              <Link to="contact" smooth className="cursor-pointer">
                <button type="button" className="btn btn-primary w-full sm:w-auto justify-center">
                  Contact me
                </button>
              </Link>
              <a href={SITE.portfolioUrl} className="btn btn-outline w-full sm:w-auto justify-center">
                My Portfolio
              </a>
            </motion.div>

            {/* socials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.35 }}
            >
              <SocialLinks />
            </motion.div>
          </div>

          {/* ══ RIGHT — avatar lens, desktop only ══ */}
          <motion.div
            className="hidden lg:block flex-shrink-0"
            style={{ width: 400, position: "relative", x: avX, y: avY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.45 }}
          >
            {/* center the avatar in the 400px column */}
            <div
              style={{
                position: "relative",
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                margin: "0 auto",
              }}
            >
              {/* outer ring — slow CW */}
              <OrbitalRing
                size={AVATAR_SIZE + (RING_PAD + 14) * 2}
                dashArray="7 14"
                stroke="rgba(129,140,248,0.26)"
                duration={28}
              />

              {/* inner ring — faster CCW */}
              <OrbitalRing
                size={AVATAR_SIZE + RING_PAD * 2}
                dashArray="3 18"
                stroke="rgba(34,211,238,0.16)"
                duration={18}
                reverse
              />

              {/* pulsing static halo */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: -5,
                  borderRadius: "50%",
                  border: "1px solid rgba(129,140,248,0.32)",
                  zIndex: 0,
                }}
                animate={{ opacity: [0.32, 0.72, 0.32], scale: [1, 1.014, 1] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* avatar image */}
              <div
                style={{
                  position: "relative",
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.4)",
                  zIndex: 1,
                }}
              >
                <img
                  src={avatar}
                  alt={SITE.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                    objectPosition: "center center",
                    filter: "brightness(0.85) saturate(0.88)",
                  }}
                />
                {/* inner shadow vignette */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    boxShadow: "inset 0 0 70px rgba(0,0,0,0.55)",
                    pointerEvents: "none",
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* ── floating stat chips ── */}
              {/* <DataChip
                value="1.5+"
                label="Years Experience"
                accentColor="#818cf8"
                delay={1.0}
                style={{ left: -100, top: "20%" }}
              />
              <DataChip
                value="5+"
                label="Projects Done"
                accentColor="#22d3ee"
                delay={1.12}
                style={{ right: -90, bottom: "22%" }}
              /> */}

              {/* status pill — bottom center */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "rgba(7,7,11,0.90)",
                  border: "1px solid rgba(52,211,153,0.20)",
                  backdropFilter: "blur(22px)",
                  WebkitBackdropFilter: "blur(22px)",
                  boxShadow: "0 10px 32px rgba(0,0,0,0.5)",
                  zIndex: 20,
                  whiteSpace: "nowrap",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE_EXPO, delay: 1.25 }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#34d399",
                    boxShadow: "0 0 9px rgba(52,211,153,0.55)",
                    flexShrink: 0,
                    animation: "pulse 2.4s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.14em",
                    color: "rgba(255,255,255,0.48)",
                  }}
                >
                  {SITE.availability}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* scroll hint */}
        <motion.div
          className="hidden lg:flex items-center gap-3 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/20"
          >
            <BsArrowDown size={14} />
          </motion.div>
          <span className="scroll-hint">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
