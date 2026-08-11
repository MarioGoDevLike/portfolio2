import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { HOME_PROJECTS } from "../../constants";
import AnimatedSection from "../ui/AnimatedSection";
import { saveHomeScroll } from "../../utils/homeScroll";

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
      height: 32,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      gap: 8,
      background: "rgba(0,0,0,0.55)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div style={{ display: "flex", gap: 4 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", opacity: 0.85 }} />
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", opacity: 0.85 }} />
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", opacity: 0.85 }} />
    </div>
    <div
      style={{
        flex: 1, height: 16, borderRadius: 4,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", paddingLeft: 6, gap: 4, overflow: "hidden",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: accentColor, flexShrink: 0, opacity: 0.7 }} />
      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.22)", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {href ? href.replace("https://", "") : "raffoul-motors.vercel.app"}
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
        position: "absolute", width: 18, height: 18, pointerEvents: "none",
        ...(c.includes("t") ? { top: 14 } : { bottom: 14 }),
        ...(c.includes("l") ? { left: 14 } : { right: 14 }),
        borderColor: color, borderStyle: "solid", borderWidth: 0,
        ...(c === "tl" && { borderTopWidth: 1.5, borderLeftWidth: 1.5 }),
        ...(c === "tr" && { borderTopWidth: 1.5, borderRightWidth: 1.5 }),
        ...(c === "bl" && { borderBottomWidth: 1.5, borderLeftWidth: 1.5 }),
        ...(c === "br" && { borderBottomWidth: 1.5, borderRightWidth: 1.5 }),
        opacity: visible ? 0.65 : 0, transition: "opacity 0.25s ease", zIndex: 10,
      }}
      aria-hidden="true"
    />
  ));

/* ─── Desktop 3D project card ─── */
const Card3D = ({ project, featured = false, index = 0, onCustomClick }) => {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const meta = ACCENT[project.accent] || ACCENT.violet;
  const isWeb = project.tag === "Web";

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 220, damping: 24 };
  const smx = useSpring(mx, spring);
  const smy = useSpring(my, spring);

  const maxTilt = featured ? 7 : 11;
  const cardRotX = useTransform(smy, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const cardRotY = useTransform(smx, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const imgX = useTransform(smx, [-0.5, 0.5], [18, -18]);
  const imgY = useTransform(smy, [-0.5, 0.5], [10, -10]);
  const glareX = useTransform(smx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smy, [-0.5, 0.5], [0, 100]);
  const glareGradient = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.13) 0%, transparent 62%)`;

  const onMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mx.set((e.clientX - left) / width - 0.5);
    my.set((e.clientY - top) / height - 0.5);
  }, [mx, my]);

  const onLeave = useCallback(() => {
    mx.set(0); my.set(0); setHovered(false);
  }, [mx, my]);

  const imageHeight = featured ? 420 : 280;
  const imageFit = project.imageFit || "cover";
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
          rotateX: cardRotX, rotateY: cardRotY,
          transformStyle: "preserve-3d",
          borderRadius: cardRadius, overflow: "hidden",
          border: `1px solid ${hovered ? meta.border : "rgba(255,255,255,0.08)"}`,
          boxShadow: hovered
            ? `0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px ${meta.border}, 0 0 80px ${meta.glow}`
            : "0 20px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
          background: "rgba(9,9,11,0.92)",
          cursor: (project.href || project.caseStudyPath || onCustomClick) ? "pointer" : "default",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
        whileHover={{ scale: featured ? 1.012 : 1.018 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        onClick={() => {
          if (onCustomClick) { onCustomClick(); }
          else if (project.href) { window.open(project.href, "_blank", "noopener"); }
        }}
      >
        <div style={{ position: "absolute", inset: -1, borderRadius: cardRadius, background: hovered ? meta.softGlow : "transparent", transition: "background 0.4s ease", pointerEvents: "none", zIndex: 0 }} aria-hidden="true" />
        {isWeb && <BrowserChrome href={project.liveHref || project.href} accentColor={meta.color} />}
        <div style={{ position: "relative", height: imageHeight, overflow: "hidden", background: "#050505" }}>
          {project.previewVideo ? (
            <motion.div style={{ position: "absolute", inset: 0, x: imgX, y: imgY }}>
              <video src={project.previewVideo} autoPlay muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", filter: `brightness(${hovered ? 0.82 : 0.72}) saturate(0.9)`, transition: "filter 0.35s ease", display: "block" }} />
            </motion.div>
          ) : project.image && (
            <motion.div style={{ position: "absolute", inset: imageFit === "contain" ? 0 : "-5% -3%", x: imageFit === "contain" ? 0 : imgX, y: imageFit === "contain" ? 0 : imgY, display: "flex", alignItems: "center", justifyContent: "center", padding: imageFit === "contain" ? "28px 40px" : 0 }}>
              <img src={project.image} alt={project.title}
                style={{ width: imageFit === "contain" ? "auto" : "100%", height: imageFit === "contain" ? "auto" : "100%", maxWidth: "100%", maxHeight: "100%", objectFit: imageFit, objectPosition: "center", filter: imageFit === "contain" ? "none" : `brightness(${hovered ? 0.82 : 0.72}) saturate(0.9)`, transition: "filter 0.35s ease", display: "block" }}
                loading="lazy" />
            </motion.div>
          )}
          <div style={{ position: "absolute", inset: 0, background: imageFit === "contain" && !project.previewVideo ? "none" : "linear-gradient(to top, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.3) 42%, transparent 70%)", pointerEvents: "none" }} aria-hidden="true" />
          <motion.div style={{ position: "absolute", inset: 0, background: glareGradient, pointerEvents: "none", opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease" }} aria-hidden="true" />
          <motion.div
            style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`, opacity: 0.55, pointerEvents: "none" }}
            animate={{ top: ["10%", "92%", "10%"], opacity: [0, 0.55, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.7 }}
            aria-hidden="true"
          />
          <span style={{ position: "absolute", left: 16, bottom: 14, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: featured ? 100 : 72, lineHeight: 1, color: "rgba(255,255,255,0.04)", pointerEvents: "none", userSelect: "none", letterSpacing: "-0.05em" }} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.tag && (
            <span style={{ position: "absolute", top: 14, right: 14, fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", padding: "5px 11px", borderRadius: 999, background: "rgba(0,0,0,0.6)", border: `1px solid ${meta.border}`, color: meta.color, backdropFilter: "blur(8px)", zIndex: 5 }}>
              {project.tag}
            </span>
          )}
          <HudCorners color={meta.color} visible={hovered} />
        </div>
        <div style={{ padding: featured ? "22px 26px" : "18px 22px", position: "relative", zIndex: 5 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: meta.color, opacity: 0.75, marginBottom: 5 }}>
                {project.category}
              </span>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: featured ? 22 : 17, color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.82)", lineHeight: 1.2, transition: "color 0.2s", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {project.title}
              </h3>
            </div>
          </div>
          {project.description && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.32)", lineHeight: 1.65, marginTop: 10, marginBottom: 0, maxWidth: 560, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {project.description}
            </p>
          )}
        </div>
      </motion.div>
      <div style={{ position: "absolute", bottom: -20, left: "15%", right: "15%", height: 40, background: `radial-gradient(ellipse, ${meta.glow} 0%, transparent 70%)`, filter: "blur(16px)", opacity: hovered ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: "none", zIndex: -1 }} aria-hidden="true" />
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   MOBILE-ONLY COMPONENTS
══════════════════════════════════════════ */

const getMobileContainPadding = (project, height) =>
  project.mobileImagePadding || (height >= 200 ? "24px 36px" : "18px 32px");

const MobileCardMedia = ({ project, height, imageFit }) => {
  if (project.previewVideo) {
    return (
      <div style={{ position: "relative", height, overflow: "hidden", background: "#050505" }}>
        <video
          src={project.previewVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            filter: "brightness(0.75) saturate(0.88)",
            display: "block",
          }}
        />
      </div>
    );
  }

  if (!project.image) {
    return <div style={{ height, background: "#050505" }} aria-hidden="true" />;
  }

  if (imageFit === "contain") {
    return (
      <div
        style={{
          position: "relative",
          height,
          overflow: "hidden",
          background: "#050505",
          padding: getMobileContainPadding(project, height),
          boxSizing: "border-box",
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height, overflow: "hidden", background: "#050505" }}>
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        style={{
          width: "100%",
          height: "100%",
          objectFit: imageFit,
          objectPosition: "center",
          filter: "brightness(0.75) saturate(0.88)",
          display: "block",
        }}
      />
    </div>
  );
};

/* ─── Mobile featured card ─── */
const MobileFeaturedCard = ({ project, onCustomClick }) => {
  const meta = ACCENT[project.accent] || ACCENT.violet;
  const isWeb = project.tag === "Web";
  const imageFit = project.imageFit || "cover";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: EASE_EXPO }}
      whileTap={{ scale: 0.985 }}
      onClick={onCustomClick}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${meta.border}`,
        background: "rgba(9,9,11,0.95)",
        boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 48px ${meta.softGlow}`,
        cursor: onCustomClick ? "pointer" : "default",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
    >
      {isWeb && <BrowserChrome href={project.liveHref || project.href} accentColor={meta.color} />}

      <div style={{ position: "relative" }}>
        <MobileCardMedia project={project} height={210} imageFit={imageFit} />

        {imageFit !== "contain" && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.18) 50%, transparent 75%)", pointerEvents: "none" }} aria-hidden="true" />
        )}

        {/* Gradient accent line at top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`, opacity: 0.5 }} aria-hidden="true" />

        {/* Tag badge */}
        {project.tag && (
          <span style={{ position: "absolute", top: 12, right: 12, fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, background: "rgba(0,0,0,0.65)", border: `1px solid ${meta.border}`, color: meta.color, backdropFilter: "blur(12px)" }}>
            {project.tag}
          </span>
        )}

        {/* "Featured" label */}
        <span style={{ position: "absolute", top: 12, left: 12, fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 999, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}>
          Featured
        </span>

        {/* Case study CTA */}
        {/* {onCustomClick && (
          <div style={{ position: "absolute", bottom: 12, left: 14, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: meta.color, opacity: 0.9 }}>
              View Case Study →
            </span>
          </div>
        )} */}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 18px 18px" }}>
        <span style={{ display: "block", fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: meta.color, opacity: 0.7, marginBottom: 5 }}>
          {project.category}
        </span>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 18, color: "rgba(255,255,255,0.92)", lineHeight: 1.2, margin: "0 0 8px" }}>
          {project.title}
        </h3>
        {project.description && (
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.32)", lineHeight: 1.65, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {project.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Mobile carousel card ─── */
const MobileCarouselCard = ({ project, onCustomClick, isActive }) => {
  const meta = ACCENT[project.accent] || ACCENT.violet;
  const isWeb = project.tag === "Web";
  const imageFit = project.imageFit || "cover";

  return (
    <motion.div
      whileTap={{ scale: 0.975 }}
      onClick={onCustomClick}
      style={{
        flexShrink: 0,
        width: "76vw",
        maxWidth: 280,
        scrollSnapAlign: "start",
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${isActive ? meta.border : "rgba(255,255,255,0.07)"}`,
        background: "rgba(9,9,11,0.95)",
        boxShadow: isActive
          ? `0 16px 44px rgba(0,0,0,0.55), 0 0 36px ${meta.softGlow}`
          : "0 10px 32px rgba(0,0,0,0.4)",
        transition: "border-color 0.3s, box-shadow 0.3s",
        cursor: onCustomClick ? "pointer" : "default",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
    >
      {isWeb && <BrowserChrome href={project.liveHref || project.href} accentColor={meta.color} />}

      <div style={{ position: "relative" }}>
        <MobileCardMedia project={project} height={160} imageFit={imageFit} />

        {imageFit !== "contain" && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,5,0.9) 0%, transparent 60%)", pointerEvents: "none" }} aria-hidden="true" />
        )}

        {project.tag && (
          <span style={{ position: "absolute", top: 10, right: 10, fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: "rgba(0,0,0,0.65)", border: `1px solid ${meta.border}`, color: meta.color, backdropFilter: "blur(10px)" }}>
            {project.tag}
          </span>
        )}
      </div>

      <div style={{ padding: "13px 14px 15px" }}>
        <span style={{ display: "block", fontFamily: "'Space Grotesk',sans-serif", fontSize: 8, letterSpacing: "0.24em", textTransform: "uppercase", color: meta.color, opacity: 0.7, marginBottom: 4 }}>
          {project.category}
        </span>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.88)", lineHeight: 1.2, margin: "0 0 5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {project.title}
        </h3>
        {project.description && (
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.55, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {project.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Mobile horizontal carousel ─── */
const MobileProjectCarousel = ({ projects, navigate }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.firstChild?.offsetWidth ?? 0;
    const gap = 12;
    const idx = Math.round(el.scrollLeft / (cardW + gap));
    setActiveIdx(Math.min(idx, projects.length - 1));
  }, [projects.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.1 }}
    >
      {/* Swipe hint */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 20, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>
          More projects
        </span>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 9, color: "rgba(255,255,255,0.15)" }}>← swipe →</span>
      </div>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 4,
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        className="hide-scrollbar"
      >
        {projects.map((project, i) => (
          <MobileCarouselCard
            key={project.id}
            project={project}
            isActive={i === activeIdx}
            onCustomClick={
              project.caseStudyPath ? () => navigate(project.caseStudyPath)
              : project.href ? () => window.open(project.href, "_blank", "noopener")
              : undefined
            }
          />
        ))}
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 16 }}>
        {projects.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === activeIdx ? 18 : 5,
              background: i === activeIdx ? "#818cf8" : "rgba(255,255,255,0.14)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ height: 4, borderRadius: 2 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Section ─── */
const WorkSection = () => {
  const [featured, ...rest] = HOME_PROJECTS;
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  const goToCaseStudy = useCallback((path) => {
    saveHomeScroll();
    navigate(path);
  }, [navigate]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  return (
    <section className="section" id="work" data-tour="work" style={{ paddingBottom: isMobile ? 64 : undefined }}>

      {/* ── Section header ── */}
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-5">
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

          {!isMobile && (
            <AnimatedSection direction="left" delay={0.25}>
              <Link to="/projects">
                <button type="button" className="btn btn-outline">
                  View all projects
                </button>
              </Link>
            </AnimatedSection>
          )}
        </div>
      </div>

      {/* ── Mobile layout ── */}
      {isMobile ? (
        <div>
          {/* Featured card */}
          <div data-tour="work-featured" style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 20 }}>
            <MobileFeaturedCard
              project={featured}
              onCustomClick={
                featured.caseStudyPath ? () => goToCaseStudy(featured.caseStudyPath)
                : featured.href ? () => window.open(featured.href, "_blank", "noopener")
                : undefined
              }
            />
          </div>

          {/* Horizontal carousel for remaining projects */}
          <MobileProjectCarousel projects={rest} navigate={goToCaseStudy} />

          {/* "View all" button */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24, paddingLeft: 20, paddingRight: 20 }}>
            <Link to="/projects" style={{ width: "100%" }}>
              <button type="button" className="btn btn-outline" style={{ width: "100%", justifyContent: "center", minHeight: 48 }}>
                View all projects
              </button>
            </Link>
          </div>
        </div>
      ) : (
        /* ── Desktop layout (original) ── */
        <div className="container">
          <div className="mb-5 lg:mb-6" data-tour="work-featured">
            <Card3D
              project={featured}
              featured
              index={0}
              onCustomClick={featured.caseStudyPath ? () => goToCaseStudy(featured.caseStudyPath) : undefined}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {rest.map((project, i) => (
              <Card3D
                key={project.id}
                project={project}
                index={i + 1}
                onCustomClick={project.caseStudyPath ? () => goToCaseStudy(project.caseStudyPath) : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkSection;
