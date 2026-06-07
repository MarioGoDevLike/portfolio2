import React, { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import {
  SiReact,
  SiFlutter,
  SiTypescript,
  SiWordpress,
  SiNodedotjs,
  SiTailwindcss,
  SiAndroidstudio,
  SiFirebase,
  SiFigma,
  SiJavascript,
} from "react-icons/si";
import { FaMobileAlt } from "react-icons/fa";

/**
 * Each skill carries:
 *  color     — brand colour used on hover (icon tint, glow, tooltip text)
 *  glow      — rgba for box-shadow
 *  left/top  — position inside the 380×460 canvas
 *  bubbleSize / iconSize — in px
 *  float     — y keyframe array, duration, stagger delay
 */
const SKILLS = [
  {
    name: "React",
    Icon: SiReact,
    color: "#61DAFB",
    glow: "rgba(97,218,251,0.20)",
    bg: "rgba(97,218,251,0.09)",
    border: "rgba(97,218,251,0.28)",
    iconSize: 26,
    bubbleSize: 60,
    left: "12%",
    top: "3%",
    float: { y: [0, -13, 0], dur: 3.1, delay: 0.0 },
  },
  {
    name: "TypeScript",
    Icon: SiTypescript,
    color: "#60A5FA",
    glow: "rgba(96,165,250,0.20)",
    bg: "rgba(96,165,250,0.09)",
    border: "rgba(96,165,250,0.28)",
    iconSize: 22,
    bubbleSize: 52,
    left: "53%",
    top: "4%",
    float: { y: [0, -8, 0], dur: 2.7, delay: 0.5 },
  },
  {
    name: "Flutter",
    Icon: SiFlutter,
    color: "#54C5F8",
    glow: "rgba(84,197,248,0.20)",
    bg: "rgba(84,197,248,0.09)",
    border: "rgba(84,197,248,0.28)",
    iconSize: 26,
    bubbleSize: 60,
    left: "77%",
    top: "14%",
    float: { y: [0, -14, 0], dur: 3.6, delay: 0.8 },
  },
  {
    name: "JavaScript",
    Icon: SiJavascript,
    color: "#FDE047",
    glow: "rgba(253,224,71,0.16)",
    bg: "rgba(253,224,71,0.07)",
    border: "rgba(253,224,71,0.24)",
    iconSize: 22,
    bubbleSize: 52,
    left: "3%",
    top: "34%",
    float: { y: [0, -10, 0], dur: 3.0, delay: 1.2 },
  },
  {
    name: "WordPress",
    Icon: SiWordpress,
    color: "#7DD3FC",
    glow: "rgba(125,211,252,0.18)",
    bg: "rgba(125,211,252,0.07)",
    border: "rgba(125,211,252,0.24)",
    iconSize: 22,
    bubbleSize: 52,
    left: "35%",
    top: "20%",
    float: { y: [0, -9, 0], dur: 2.9, delay: 0.6 },
  },
  {
    name: "Node.js",
    Icon: SiNodedotjs,
    color: "#4ADE80",
    glow: "rgba(74,222,128,0.18)",
    bg: "rgba(74,222,128,0.07)",
    border: "rgba(74,222,128,0.26)",
    iconSize: 22,
    bubbleSize: 52,
    left: "65%",
    top: "38%",
    float: { y: [0, -13, 0], dur: 3.4, delay: 1.0 },
  },
  {
    name: "Tailwind CSS",
    Icon: SiTailwindcss,
    color: "#22D3EE",
    glow: "rgba(34,211,238,0.20)",
    bg: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.28)",
    iconSize: 26,
    bubbleSize: 60,
    left: "10%",
    top: "59%",
    float: { y: [0, -11, 0], dur: 3.2, delay: 0.3 },
  },
  {
    name: "React Native",
    Icon: SiReact,
    color: "#818CF8",
    glow: "rgba(129,140,248,0.20)",
    bg: "rgba(129,140,248,0.09)",
    border: "rgba(129,140,248,0.28)",
    iconSize: 22,
    bubbleSize: 52,
    left: "44%",
    top: "50%",
    float: { y: [0, -7, 0], dur: 2.6, delay: 1.4 },
  },
  {
    name: "Firebase",
    Icon: SiFirebase,
    color: "#FCD34D",
    glow: "rgba(252,211,77,0.16)",
    bg: "rgba(252,211,77,0.07)",
    border: "rgba(252,211,77,0.24)",
    iconSize: 26,
    bubbleSize: 60,
    left: "72%",
    top: "62%",
    float: { y: [0, -15, 0], dur: 3.8, delay: 0.9 },
  },
  {
    name: "Android Studio",
    Icon: SiAndroidstudio,
    color: "#34D399",
    glow: "rgba(52,211,153,0.18)",
    bg: "rgba(52,211,153,0.07)",
    border: "rgba(52,211,153,0.26)",
    iconSize: 22,
    bubbleSize: 52,
    left: "22%",
    top: "78%",
    float: { y: [0, -10, 0], dur: 3.1, delay: 0.4 },
  },
  {
    name: "Figma",
    Icon: SiFigma,
    color: "#F87171",
    glow: "rgba(248,113,113,0.18)",
    bg: "rgba(248,113,113,0.07)",
    border: "rgba(248,113,113,0.26)",
    iconSize: 22,
    bubbleSize: 52,
    left: "55%",
    top: "83%",
    float: { y: [0, -8, 0], dur: 2.8, delay: 1.1 },
  },
  {
    name: "Mobile Dev",
    Icon: FaMobileAlt,
    color: "#C084FC",
    glow: "rgba(192,132,252,0.18)",
    bg: "rgba(192,132,252,0.08)",
    border: "rgba(192,132,252,0.26)",
    iconSize: 20,
    bubbleSize: 48,
    left: "81%",
    top: "81%",
    float: { y: [0, -12, 0], dur: 3.5, delay: 0.7 },
  },
];

const FloatingSkills = () => {
  const [hovered, setHovered] = useState(null);

  return (
    /* Outer wrapper — allows tooltips to escape the visual frame */
    <div className="relative" style={{ width: 380, height: 460 }}>

      {/* ── Visual frame ────────────────────────── */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
        aria-hidden="true"
      />

      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 52% 46%, rgba(129,140,248,0.07) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />

      {/* Left accent bar (mirrors the about-visual accent) */}
      <div
        className="absolute top-8 bottom-8 pointer-events-none"
        style={{
          left: 14,
          width: 1,
          background:
            "linear-gradient(to bottom, transparent, rgba(129,140,248,0.24) 38%, rgba(34,211,238,0.20) 64%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* Corner label */}
      <span
        className="absolute font-primary text-[9px] uppercase tracking-[4px] pointer-events-none select-none"
        style={{ top: 16, right: 18, color: "rgba(255,255,255,0.12)" }}
      >
        Tech Stack
      </span>

      {/* ── Skill bubbles ────────────────────────── */}
      {SKILLS.map((skill) => {
        const isHovered = hovered === skill.name;

        return (
          <motion.div
            key={skill.name}
            className="absolute"
            style={{ left: skill.left, top: skill.top }}
            /* continuous float */
            animate={{ y: skill.float.y }}
            transition={{
              duration: skill.float.dur,
              delay: skill.float.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  className="absolute left-1/2 whitespace-nowrap font-primary font-semibold text-[11px] px-3 py-[5px] rounded-full z-30 pointer-events-none select-none"
                  style={{
                    bottom: `calc(100% + 9px)`,
                    transform: "translateX(-50%)",
                    background: "rgba(8,8,10,0.94)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: skill.color,
                    boxShadow: `0 4px 18px ${skill.glow}`,
                  }}
                  initial={{ opacity: 0, y: 6, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.88 }}
                  transition={{ duration: 0.14, ease: "easeOut" }}
                >
                  {skill.name}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Bubble */}
            <motion.div
              className="relative flex items-center justify-center rounded-full cursor-pointer select-none"
              style={{
                width: skill.bubbleSize,
                height: skill.bubbleSize,
                background: isHovered ? skill.bg : "rgba(255,255,255,0.038)",
                border: isHovered
                  ? `1px solid ${skill.border}`
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: isHovered
                  ? `0 0 24px ${skill.glow}, inset 0 1px 0 rgba(255,255,255,0.10)`
                  : "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 12px rgba(0,0,0,0.32)",
                transition: "background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
              }}
              whileHover={{ scale: 1.20 }}
              onHoverStart={() => setHovered(skill.name)}
              onHoverEnd={() => setHovered(null)}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            >
              <skill.Icon
                size={skill.iconSize}
                style={{
                  color: isHovered ? skill.color : "rgba(255,255,255,0.32)",
                  transition: "color 0.22s ease",
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingSkills;

/* ─────────────────────────────────────────────────────────
   MobileSkills — two auto-scrolling rows of branded chips
   Visible only on < lg viewports
───────────────────────────────────────────────────────── */

// Row 1 scrolls left-to-right, Row 2 right-to-left
const ROW1 = SKILLS.slice(0, 6);
const ROW2 = SKILLS.slice(6, 12);

const SkillChip = ({ skill }) => (
  <div
    className="flex items-center gap-2.5 flex-shrink-0 px-4 py-[10px] rounded-full"
    style={{
      background: "rgba(255,255,255,0.045)",
      border: "1px solid rgba(255,255,255,0.09)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
    }}
  >
    <skill.Icon
      size={14}
      style={{ color: skill.color, flexShrink: 0 }}
    />
    <span
      className="font-secondary text-[12px] font-medium whitespace-nowrap"
      style={{ color: "rgba(255,255,255,0.55)" }}
    >
      {skill.name}
    </span>
  </div>
);

export const MobileSkills = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      className="block lg:hidden overflow-hidden"
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Label */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="block h-px flex-shrink-0"
          style={{ width: 28, background: "#818cf8" }}
          aria-hidden="true"
        />
        <span className="font-primary text-[10px] uppercase tracking-[5px] text-accent">
          Tech Stack
        </span>
      </div>

      {/* Scrolling rows with edge fade */}
      <div className="overflow-hidden marquee-fade">
        {/* Row 1 — scrolls left */}
        <div className="marquee-track-ltr mb-3" style={{ animationDuration: "22s" }}>
          {[...ROW1, ...ROW1].map((skill, i) => (
            <div key={`r1-${i}`} className="mr-3">
              <SkillChip skill={skill} />
            </div>
          ))}
        </div>

        {/* Row 2 — scrolls right */}
        <div className="marquee-track-rtl" style={{ animationDuration: "26s" }}>
          {[...ROW2, ...ROW2].map((skill, i) => (
            <div key={`r2-${i}`} className="mr-3">
              <SkillChip skill={skill} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
