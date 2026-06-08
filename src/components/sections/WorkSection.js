import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { HOME_PROJECTS } from "../../constants";
import AnimatedSection from "../ui/AnimatedSection";

const EASE_EXPO = [0.22, 1, 0.36, 1];

const ACCENT = {
  violet: {
    color: "#818cf8",
    glow: "rgba(129,140,248,0.32)",
    softGlow: "rgba(129,140,248,0.12)",
    bg: "rgba(129,140,248,0.07)",
    border: "rgba(129,140,248,0.22)",
  },
  cyan: {
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.28)",
    softGlow: "rgba(34,211,238,0.10)",
    bg: "rgba(34,211,238,0.07)",
    border: "rgba(34,211,238,0.20)",
  },
};

/* ─── Browser chrome mock (web projects) ─── */
const BrowserChrome = ({ href, accentColor }) => (
  <div
    style={{
      height: 36,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      padding: "0 14px",
      gap: 10,
      background: "rgba(0,0,0,0.55)",
      borderBottom: `1px solid rgba(255,255,255,0.06)`,
    }}
  >
    <div style={{ display: "flex", gap: 5 }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444", opacity: 0.85 }} />
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b", opacity: 0.85 }} />
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e", opacity: 0.85 }} />
    </div>
    <div
      style={{
        flex: 1,
        height: 18,
        borderRadius: 5,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        paddingLeft: 8,
        gap: 5,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: accentColor,
          flexShrink: 0,
          opacity: 0.7,
        }}
      />
      <span
        style={{
          fontSize: 9,
          color: "rgba(255,255,255,0.22)",
          fontFamily: "monospace",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {href ? href.replace("https://", "") : "project.dev"}
      </span>
    </div>
  </div>
);

/* ─── HUD corner brackets ─── */
const HudCorners = ({ color, visible }) =>
  ["tl", "tr", "bl", "br"].map((c) => (
    <span
      key={c}
      style={{
        position: "absolute",
        width: 18,
        height: 18,
        pointerEvents: "none",
        ...(c.includes("t") ? { top: 14 } : { bottom: 14 }),
        ...(c.includes("l") ? { left: 14 } : { right: 14 }),
        borderColor: color,
        borderStyle: "solid",
        borderWidth: 0,
        ...(c === "tl" && { borderTopWidth: 1.5, borderLeftWidth: 1.5 }),
        ...(c === "tr" && { borderTopWidth: 1.5, borderRightWidth: 1.5 }),
        ...(c === "bl" && { borderBottomWidth: 1.5, borderLeftWidth: 1.5 }),
        ...(c === "br" && { borderBottomWidth: 1.5, borderRightWidth: 1.5 }),
        opacity: visible ? 0.65 : 0,
        transition: "opacity 0.25s ease",
        zIndex: 10,
      }}
      aria-hidden="true"
    />
  ));

/* ─── Single 3D project card ─── */
const Card3D = ({ project, featured = false, index = 0 }) => {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const meta = ACCENT[project.accent] || ACCENT.violet;
  const isWeb = project.tag === "Web";

  /* motion values */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 220, damping: 24 };
  const smx = useSpring(mx, spring);
  const smy = useSpring(my, spring);

  const maxTilt = featured ? 7 : 11;
  const cardRotX = useTransform(smy, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const cardRotY = useTransform(smx, [-0.5, 0.5], [-maxTilt, maxTilt]);

  /* inner image parallax (moves opposite to tilt) */
  const imgX = useTransform(smx, [-0.5, 0.5], [18, -18]);
  const imgY = useTransform(smy, [-0.5, 0.5], [10, -10]);

  /* specular glare */
  const glareX = useTransform(smx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smy, [-0.5, 0.5], [0, 100]);
  const glareGradient = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.13) 0%, transparent 62%)`;

  const onMove = useCallback(
    (e) => {
      const el = cardRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      mx.set((e.clientX - left) / width - 0.5);
      my.set((e.clientY - top) / height - 0.5);
    },
    [mx, my]
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  const imageHeight = featured ? 420 : 280;
  const cardRadius = 22;
  const enterDir = featured ? 0 : index % 2 === 0 ? -60 : 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: enterDir }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: EASE_EXPO, delay: featured ? 0.1 : 0.2 + index * 0.12 }}
      style={{ perspective: 1400 }}
      className="relative"
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX: cardRotX,
          rotateY: cardRotY,
          transformStyle: "preserve-3d",
          borderRadius: cardRadius,
          overflow: "hidden",
          border: `1px solid ${hovered ? meta.border : "rgba(255,255,255,0.08)"}`,
          boxShadow: hovered
            ? `0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px ${meta.border}, 0 0 80px ${meta.glow}`
            : "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
          background: "rgba(9,9,11,0.92)",
          cursor: project.href ? "pointer" : "default",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
        whileHover={{ scale: featured ? 1.012 : 1.018 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        onClick={() => project.href && window.open(project.href, "_blank", "noopener")}
      >
        {/* ambient accent glow behind card */}
        <div
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: cardRadius,
            background: hovered ? meta.softGlow : "transparent",
            transition: "background 0.4s ease",
            pointerEvents: "none",
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {/* browser chrome */}
        {isWeb && (
          <BrowserChrome href={project.href} accentColor={meta.color} />
        )}

        {/* image area */}
        <div
          style={{
            position: "relative",
            height: imageHeight,
            overflow: "hidden",
            background: "#050505",
          }}
        >
          {/* inner-parallax image */}
          {project.image && (
            <motion.div
              style={{
                position: "absolute",
                inset: "-5% -3%",
                x: imgX,
                y: imgY,
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  filter: `brightness(${hovered ? 0.82 : 0.72}) saturate(0.9)`,
                  transition: "filter 0.35s ease",
                  display: "block",
                }}
                loading="lazy"
              />
            </motion.div>
          )}

          {/* bottom fade */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to top, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.3) 42%, transparent 70%)`,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />

          {/* specular glare */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: glareGradient,
              pointerEvents: "none",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
            aria-hidden="true"
          />

          {/* scan line sweep */}
          <motion.div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`,
              opacity: 0.55,
              pointerEvents: "none",
            }}
            animate={{ top: ["10%", "92%", "10%"], opacity: [0, 0.55, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.7,
            }}
            aria-hidden="true"
          />

          {/* watermark number */}
          <span
            style={{
              position: "absolute",
              left: 16,
              bottom: 14,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: featured ? 100 : 72,
              lineHeight: 1,
              color: "rgba(255,255,255,0.04)",
              pointerEvents: "none",
              userSelect: "none",
              letterSpacing: "-0.05em",
              transform: "translateZ(-10px)",
            }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* tag badge */}
          {project.tag && (
            <span
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                padding: "5px 11px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.6)",
                border: `1px solid ${meta.border}`,
                color: meta.color,
                backdropFilter: "blur(8px)",
                zIndex: 5,
              }}
            >
              {project.tag}
            </span>
          )}

          {/* HUD corners */}
          <HudCorners color={meta.color} visible={hovered} />
        </div>

        {/* ── metadata footer ── */}
        <div style={{ padding: featured ? "22px 26px" : "18px 22px", position: "relative", zIndex: 5 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: meta.color,
                  opacity: 0.75,
                  marginBottom: 5,
                }}
              >
                {project.category}
              </span>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: featured ? 22 : 17,
                  color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.82)",
                  lineHeight: 1.2,
                  transition: "color 0.2s",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {project.title}
              </h3>
            </div>

            {/* CTA circle */}
            {project.href && (
              <motion.span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: hovered ? meta.bg : "rgba(255,255,255,0.04)",
                  border: `1px solid ${hovered ? meta.border : "rgba(255,255,255,0.08)"}`,
                  color: hovered ? meta.color : "rgba(255,255,255,0.3)",
                  transition: "all 0.25s ease",
                }}
                animate={{ rotate: hovered ? 0 : -45 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <HiArrowUpRight size={15} />
              </motion.span>
            )}
          </div>

          {project.description && (
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.32)",
                lineHeight: 1.65,
                marginTop: 10,
                marginBottom: 0,
                maxWidth: 560,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: featured ? 2 : 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {project.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* drop glow beneath card */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: "15%",
          right: "15%",
          height: 40,
          background: `radial-gradient(ellipse, ${meta.glow} 0%, transparent 70%)`,
          filter: "blur(16px)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
          zIndex: -1,
        }}
        aria-hidden="true"
      />
    </motion.div>
  );
};

/* ─── Section ─── */
const WorkSection = () => {
  const [featured, ...rest] = HOME_PROJECTS;

  return (
    <section className="section" id="work">
      <div className="container">
        {/* header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6">
          <AnimatedSection direction="right" delay={0.15}>
            <span className="label">Portfolio</span>
            <h2 className="h2">
              My Latest <span className="text-gradient">Work.</span>
            </h2>
            <p className="text-body-sm text-white/30 max-w-md">
              From visually stunning websites to cutting-edge mobile
              applications — a collection committed to craft and excellence.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="left" delay={0.25}>
            <Link to="/projects">
              <button type="button" className="btn btn-outline">
                View all projects
              </button>
            </Link>
          </AnimatedSection>
        </div>

        {/* featured */}
        <div className="mb-5 lg:mb-6">
          <Card3D project={featured} featured index={0} />
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {rest.map((project, i) => (
            <Card3D key={project.id} project={project} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
