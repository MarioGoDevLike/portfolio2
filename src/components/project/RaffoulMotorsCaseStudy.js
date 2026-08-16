import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiArrowUpRight, HiArrowsPointingOut } from "react-icons/hi2";
import CaseStudyLightbox, { LandscapeWebImage } from "./CaseStudyLightbox";
import CaseStudyMobileLayout, { MobilePreviewDual, MobilePhoneFrame } from "./CaseStudyMobile";
import { getHomeBackLink, getHomeBackState } from "../../utils/homeScroll";
import OptimizedImage from "../ui/OptimizedImage";

/* ─── Assets ─────────────────────────────────────── */
import webHome1    from "../../assets/raffoul_motors_web/home_page_1.webp";
import webHome2    from "../../assets/raffoul_motors_web/home_page_2.webp";
import webCars     from "../../assets/raffoul_motors_web/available_cars_page.webp";
import webWorkshop from "../../assets/raffoul_motors_web/workshop_page.webp";
import webDash     from "../../assets/raffoul_motors_web/dashboard_page_1.webp";
import mobHome     from "../../assets/raffoul_motors_web/mobile_view_home_page.webp";
import mobCars     from "../../assets/raffoul_motors_web/mobile_view_available_cars.webp";
import mobWorkshop from "../../assets/raffoul_motors_web/mobile_view_workshop_cars.webp";
import mobDash     from "../../assets/raffoul_motors_web/mobile_view_dashboard.webp";
import raffoulLogo from "../../assets/raffoulmotors.webp";

/* ─── Brand ──────────────────────────────────────── */
const RED  = "#E31E24";
const R    = (a) => `rgba(227,30,36,${a})`;
const EASE = [0.22, 1, 0.36, 1];

/* ─── Data ───────────────────────────────────────── */
const WEB_SCREENS = [
  { src: webHome1,    label: "Home — Hero"     },
  { src: webHome2,    label: "Home — Showroom" },
  { src: webCars,     label: "Available Cars"  },
  { src: webWorkshop, label: "Workshop"        },
  { src: webDash,     label: "Admin Dashboard" },
];

const MOB_SCREENS = [
  { src: mobHome,     label: "Mobile Home"     },
  { src: mobCars,     label: "Available Cars"  },
  { src: mobWorkshop, label: "Workshop"        },
  { src: mobDash,     label: "Admin View"      },
];


const MOB_HIGHLIGHTS = [
  { idx: 0, label: "Mobile Home",  desc: "Full hero experience adapts perfectly on every device"             },
  { idx: 1, label: "Car Listings", desc: "Responsive inventory grid with filters — swipe-friendly on mobile" },
  { idx: 2, label: "Workshop",     desc: "Workshop inventory fully accessible on mobile"                      },
  { idx: 3, label: "Admin Panel",  desc: "Owners can manage listings from their phone too"                    },
];

const TECH = [
  { category: "Frontend",  items: ["React 18", "TypeScript", "Tailwind CSS", "i18next"] },
  { category: "Backend",   items: ["Firebase", "Firestore", "Cloud Storage"]             },
  { category: "Tooling",   items: ["Vite", "Figma", "ESLint"]                            },
];

/* ─── Shared micro-components ─────────────────────── */

const FadeUp = ({ children, delay = 0, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-72px 0px" }}
    transition={{ duration: 0.6, ease: EASE, delay }}
    style={style}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ children }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
    <span style={{ width: 16, height: 1, background: R(0.65), display: "block" }} />
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: RED, opacity: 0.85 }}>
      {children}
    </span>
  </div>
);

const NavBtn = ({ dir, onClick }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.1, background: R(0.1) }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{
      width: 40, height: 40, borderRadius: "50%",
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${R(0.22)}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", color: "rgba(255,255,255,0.5)",
      outline: "none", flexShrink: 0, transition: "background 0.2s, border-color 0.2s",
    }}
  >
    {dir === -1 ? <HiChevronLeft size={16} /> : <HiChevronRight size={16} />}
  </motion.button>
);

const Dots = ({ count, current, onChange }) => (
  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.button
        key={i} type="button" onClick={() => onChange(i)}
        animate={{ width: current === i ? 18 : 5, background: current === i ? RED : "rgba(255,255,255,0.15)" }}
        transition={{ duration: 0.26, ease: EASE }}
        style={{ height: 4, borderRadius: 2, border: "none", cursor: "pointer", padding: 0, flexShrink: 0, outline: "none" }}
      />
    ))}
  </div>
);

const ProgressBar = ({ duration, trackKey }) => (
  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.04)", overflow: "hidden", zIndex: 8 }}>
    <motion.div
      key={trackKey}
      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
      transition={{ duration, ease: "linear" }}
      style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${R(0.4)}, ${RED})`, transformOrigin: "left" }}
    />
  </div>
);

/* ─── Phone mockup ────────────────────────────────── */
const Phone = ({ screen, dir, width = 220, autoAdvanceDur, onClick }) => {
  const h = Math.round(width * 2.08);
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ width, height: h, position: "relative", flexShrink: 0, cursor: onClick ? "zoom-in" : "default" }}
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        position: "absolute", inset: 0, borderRadius: width * 0.19,
        background: "linear-gradient(160deg,#252525,#141414)",
        border: "1.5px solid rgba(255,255,255,0.08)", overflow: "hidden",
        boxShadow: [`0 44px 88px rgba(0,0,0,0.8)`, `0 0 64px ${R(0.15)}`, "inset 0 1px 0 rgba(255,255,255,0.06)"].join(", "),
      }}>
        <AnimatePresence custom={dir}>
          <motion.div
            key={screen.src} custom={dir}
            initial={{ x: dir * 28, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -dir * 28, opacity: 0 }}
            transition={{ duration: 0.36, ease: EASE }}
            style={{ position: "absolute", inset: 0 }}
          >
            <OptimizedImage src={screen.src} alt={screen.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </motion.div>
        </AnimatePresence>
        <div style={{ position: "absolute", top: width * 0.056, left: "50%", transform: "translateX(-50%)", width: width * 0.38, height: width * 0.11, borderRadius: width * 0.06, background: "#111", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: width * 0.44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", zIndex: 10 }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: "inset 0 0 24px rgba(0,0,0,0.45)", pointerEvents: "none", zIndex: 5 }} />
        {autoAdvanceDur && <ProgressBar duration={autoAdvanceDur} trackKey={screen.src} />}
      </div>
      {[{ side: "right", top: "28%", h: 56 }, { side: "left", top: "19%", h: 34 }, { side: "left", top: "33%", h: 34 }, { side: "left", top: "13%", h: 18 }].map((b, i) => (
        <div key={i} style={{ position: "absolute", [b.side]: -2, top: b.top, width: 3, height: b.h, borderRadius: b.side === "right" ? "0 2px 2px 0" : "2px 0 0 2px", background: "#252525" }} />
      ))}
      <div style={{ position: "absolute", bottom: -22, left: "10%", right: "10%", height: 36, background: `radial-gradient(ellipse, ${R(0.28)}, transparent 70%)`, filter: "blur(12px)", pointerEvents: "none" }} />
      {onClick && (
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.18 }}
          style={{ position: "absolute", inset: 0, borderRadius: width * 0.19, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 25, pointerEvents: "none" }}
        >
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <HiArrowsPointingOut size={20} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ─── Browser mockup ──────────────────────────────── */
const Browser = ({ screen, dir, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", width: "100%", borderRadius: 14, overflow: "hidden",
        background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)",
        cursor: onClick ? "zoom-in" : "default",
        boxShadow: [`0 32px 64px rgba(0,0,0,0.65)`, `0 0 50px ${R(0.08)}`, "inset 0 1px 0 rgba(255,255,255,0.05)"].join(", "),
      }}
    >
      <div style={{ height: 38, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, background: "rgba(0,0,0,0.65)", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
        </div>
        <div style={{ flex: 1, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 10, gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: RED, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", whiteSpace: "nowrap" }}>raffoulmotors.com</span>
        </div>
      </div>
      <div style={{ position: "relative", overflow: "hidden", width: "100%", aspectRatio: "16/9" }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={screen.src} custom={dir}
            initial={{ x: dir * 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -dir * 40, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{ position: "absolute", inset: 0 }}
          >
            <OptimizedImage src={screen.src} alt={screen.label} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "top center", display: "block", background: "#0a0a0a" }} />
          </motion.div>
        </AnimatePresence>
      </div>
      {onClick && (
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.18 }}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 25, pointerEvents: "none" }}
        >
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <HiArrowsPointingOut size={22} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ─── Thumbnail strip ─────────────────────────────── */
const Thumbs = ({ screens, current, onChange }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${screens.length}, 1fr)`, gap: 6 }}>
    {screens.map((s, i) => (
      <motion.button
        key={s.src} type="button" onClick={() => onChange(i)}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        style={{
          padding: 0, border: `1px solid ${i === current ? R(0.55) : "rgba(255,255,255,0.07)"}`,
          borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "transparent", outline: "none",
          boxShadow: i === current ? `0 0 10px ${R(0.28)}` : "none", transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
          <OptimizedImage src={s.src} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        </div>
      </motion.button>
    ))}
  </div>
);

const Divider = () => (
  <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(255,255,255,0.05) 30%,rgba(255,255,255,0.05) 70%,transparent)" }} />
);

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const RaffoulMotorsCaseStudy = () => {
  const [webIdx, setWebIdx]     = useState(0);
  const [mobIdx, setMobIdx]     = useState(0);
  const [webDir, setWebDir]     = useState(1);
  const [mobDir, setMobDir]     = useState(1);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [lightbox, setLightbox] = useState(null);

  const stepWeb = useCallback((dir) => {
    setWebDir(dir);
    setWebIdx(i => (i + dir + WEB_SCREENS.length) % WEB_SCREENS.length);
  }, []);
  const stepMob = useCallback((dir) => {
    setMobDir(dir);
    setMobIdx(i => (i + dir + MOB_SCREENS.length) % MOB_SCREENS.length);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;
    const w = setInterval(() => stepWeb(1), 4200);
    const m = setInterval(() => stepMob(1), 3600);
    return () => { clearInterval(w); clearInterval(m); };
  }, [stepWeb, stepMob, isMobile]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const wrap = { maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" };

  const mobileLayout = (
    <CaseStudyMobileLayout
      brand={{ color: RED, rgba: R }}
      title="Raffoul Motors"
      summary="A bilingual automotive platform that put a premium Lebanese car dealer online — full inventory management, workshop listings, and an admin panel with zero code required."
      logo={
        <OptimizedImage src={raffoulLogo} alt="Raffoul Motors" style={{ height: 40, width: "auto", objectFit: "contain", display: "block" }} />
      }
      meta={[
        { label: "Role", value: "Full-Stack Developer" },
        { label: "Type", value: "Web Platform" },
        { label: "Stack", value: "React · Firebase · TS" },
        { label: "Language", value: "Arabic & English" },
      ]}
      ctas={[
        { label: "View Website", onClick: () => document.getElementById("rm-web")?.scrollIntoView({ behavior: "smooth" }), primary: true },
        { label: "Mobile Views", onClick: () => document.getElementById("rm-mobile")?.scrollIntoView({ behavior: "smooth" }) },
      ]}
      preview={
        <MobilePreviewDual
          webSrc={WEB_SCREENS[webIdx].src}
          phoneSrc={MOB_SCREENS[mobIdx].src}
          brand={{ color: RED, rgba: R }}
        />
      }
      webShowcase={{
        id: "rm-web",
        title: "The Website",
        subtitle: "Full inventory browsing, workshop section, and bilingual support across every screen.",
        screens: WEB_SCREENS,
        onExpand: (i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); setLightbox("web"); },
      }}
      appShowcases={[{
        id: "rm-mobile",
        navLabel: "Mobile",
        title: "Responsive Views",
        subtitle: "Every page adapts perfectly — inventory, workshop, and admin on any device.",
        screens: MOB_SCREENS,
        highlights: MOB_HIGHLIGHTS,
        activeIdx: mobIdx,
        onIdxChange: (i) => { setMobDir(i > mobIdx ? 1 : -1); setMobIdx(i); },
        onExpand: () => setLightbox("mob"),
      }]}
      tech={TECH}
      renderPhone={(screen) => <MobilePhoneFrame screen={screen} brand={{ color: RED, rgba: R }} width={210} />}
    />
  );

  return (
    <>
      {isMobile ? mobileLayout : (
      <div style={{ position: "relative", width: "100%", maxWidth: "100%", overflowX: "hidden", background: "#080808" }}>

        {/* ══════════ HERO ══════════ */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 700, background: `radial-gradient(ellipse, ${R(0.07)} 0%, transparent 60%)`, filter: "blur(70px)", pointerEvents: "none" }} />

          {/* Back link */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: isMobile ? "20px 20px" : "28px 48px", zIndex: 10 }}>
            <Link to={getHomeBackLink()} state={getHomeBackState()} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "0.02em" }}>
              <HiChevronLeft size={14} />
              Back to home
            </Link>
          </div>

          <div style={{ ...wrap, paddingTop: isMobile ? 110 : 130, paddingBottom: 80, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 52 : 64, position: "relative", zIndex: 1 }}>

            {/* LEFT — text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ marginBottom: 36 }}
              >
                <motion.img
                  src={raffoulLogo} alt="Raffoul Motors"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
                  style={{ height: 44, width: "auto", objectFit: "contain", flexShrink: 0, display: "block" }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 42 : 68, lineHeight: 1.0, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.95)", margin: "0 0 18px" }}
              >
                Raffoul Motors
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.5, ease: EASE }}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.36)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 500 }}
              >
                A bilingual automotive platform that put a premium Lebanese car dealer online — full inventory management, workshop listings, and an admin panel with zero code required.
              </motion.p>

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}
              >
                {[
                  { label: "Role",     value: "Full-Stack Developer"  },
                  { label: "Type",     value: "Web Platform"           },
                  { label: "Stack",    value: "React · Firebase · TS"  },
                  { label: "Language", value: "Arabic & English"        },
                ].map(m => (
                  <div key={m.label} style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{m.value}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.4, ease: EASE }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <motion.button
                  type="button"
                  onClick={() => document.getElementById("rm-web").scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ scale: 1.04, boxShadow: `0 0 36px ${R(0.55)}` }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 10, background: RED, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none", outline: "none", letterSpacing: "0.01em" }}
                >
                  View Showcase <HiArrowUpRight size={14} />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => document.getElementById("rm-mobile").scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ scale: 1.03, borderColor: R(0.4) }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 10, background: "transparent", border: `1px solid ${R(0.22)}`, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", cursor: "pointer", outline: "none", letterSpacing: "0.02em" }}
                >
                  Mobile View
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT — hero preview (desktop) */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: 32, scale: 0.93 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.75, ease: EASE }}
                style={{ flexShrink: 0, width: 420, position: "relative" }}
              >
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.09)", boxShadow: `0 28px 56px rgba(0,0,0,0.65), 0 0 48px ${R(0.07)}` }}>
                  <div style={{ height: 30, display: "flex", alignItems: "center", padding: "0 10px", gap: 6, background: "rgba(0,0,0,0.75)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["#ef4444","#f59e0b","#22c55e"].map(c => <span key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
                  </div>
                  <OptimizedImage src={WEB_SCREENS[webIdx].src} alt="Raffoul Motors" style={{ width: "100%", display: "block", objectFit: "contain", objectPosition: "top", background: "#0a0a0a", aspectRatio: "16/10" }} />
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", bottom: -36, right: -24, filter: `drop-shadow(0 28px 44px rgba(0,0,0,0.75)) drop-shadow(0 0 32px ${R(0.18)})` }}
                >
                  <Phone screen={MOB_SCREENS[mobIdx]} dir={mobDir} width={116} autoAdvanceDur={3.6} />
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
          >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ width: 1, height: 28, background: `linear-gradient(to bottom, ${R(0.5)}, transparent)` }} />
          </motion.div>
        </section>

        <Divider />

        {/* ══════════ WEB SHOWCASE ══════════ */}
        <section id="rm-web" style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp>
              <SectionLabel>Desktop Website</SectionLabel>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.15 }}>
                    The Website
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.32)", margin: "8px 0 0", maxWidth: 480 }}>
                    Full inventory browsing, car detail pages, workshop listings, and a zero-code admin panel — bilingual Arabic and English.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.32)" }}>
                    {webIdx + 1} / {WEB_SCREENS.length} — {WEB_SCREENS[webIdx].label}
                  </span>
                  <NavBtn dir={-1} onClick={() => stepWeb(-1)} />
                  <NavBtn dir={1}  onClick={() => stepWeb(1)}  />
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <Browser screen={WEB_SCREENS[webIdx]} dir={webDir} onClick={() => setLightbox("web")} />
            </FadeUp>

            <FadeUp delay={0.14}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, marginBottom: !isMobile ? 20 : 0 }}>
                <Dots count={WEB_SCREENS.length} current={webIdx} onChange={i => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Tap to expand fullscreen</span>
              </div>
            </FadeUp>

            {!isMobile && (
              <FadeUp delay={0.2}>
                <Thumbs screens={WEB_SCREENS} current={webIdx} onChange={i => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }} />
              </FadeUp>
            )}
          </div>
        </section>

        <Divider />

        {/* ══════════ MOBILE SHOWCASE ══════════ */}
        <section id="rm-mobile" style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp>
              <SectionLabel>Responsive Design</SectionLabel>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: "0 0 52px", lineHeight: 1.15 }}>
                Mobile Experience
              </h2>
            </FadeUp>

            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 44 : 72 }}>
              {/* Feature list */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, order: isMobile ? 2 : 1 }}>
                {MOB_HIGHLIGHTS.map((item, i) => (
                  <FadeUp key={item.label} delay={i * 0.07}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      onClick={() => { setMobDir(item.idx > mobIdx ? 1 : -1); setMobIdx(item.idx); }}
                      style={{
                        display: "flex", gap: 14, cursor: "pointer",
                        padding: "16px 18px", borderRadius: 12,
                        background: mobIdx === item.idx ? R(0.06) : "rgba(255,255,255,0.02)",
                        border: `1px solid ${mobIdx === item.idx ? R(0.22) : "rgba(255,255,255,0.05)"}`,
                        transition: "background 0.25s, border-color 0.25s",
                      }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: R(0.1), border: `1px solid ${R(0.22)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, color: RED }}>{String(item.idx + 1).padStart(2, "0")}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: mobIdx === item.idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)", marginBottom: 4, transition: "color 0.25s" }}>{item.label}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.58 }}>{item.desc}</div>
                      </div>
                    </motion.div>
                  </FadeUp>
                ))}
              </div>

              {/* Phone */}
              <FadeUp delay={0.15} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", order: isMobile ? 1 : 2 }}>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
                  <Phone screen={MOB_SCREENS[mobIdx]} dir={mobDir} width={isMobile ? 210 : 270} autoAdvanceDur={3.6} onClick={() => setLightbox("mob")} />
                </motion.div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28 }}>
                  <NavBtn dir={-1} onClick={() => stepMob(-1)} />
                  <Dots count={MOB_SCREENS.length} current={mobIdx} onChange={i => { setMobDir(i > mobIdx ? 1 : -1); setMobIdx(i); }} />
                  <NavBtn dir={1}  onClick={() => stepMob(1)}  />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        

        <Divider />

        {/* ══════════ TECH ══════════ */}
        <section style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp style={{ marginBottom: 44 }}>
              <SectionLabel>Architecture</SectionLabel>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.15 }}>Built with</h2>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
              {TECH.map((cat, i) => (
                <FadeUp key={cat.category} delay={i * 0.1}>
                  <div style={{ padding: "26px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid ${R(0.1)}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${R(0.55)}, transparent)` }} />
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: RED, opacity: 0.8, marginBottom: 18 }}>{cat.category}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {cat.items.map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: RED, opacity: 0.55, flexShrink: 0 }} />
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

      </div>
      )}

      {/* ══════════ LIGHTBOX ══════════ */}
      <AnimatePresence>
        {lightbox && (
          <CaseStudyLightbox
            type="phone"
            screens={lightbox === "web" ? WEB_SCREENS : MOB_SCREENS}
            idx={lightbox === "web" ? webIdx : mobIdx}
            dir={lightbox === "web" ? webDir : mobDir}
            onStep={lightbox === "web" ? stepWeb : stepMob}
            onJump={lightbox === "web"
              ? i => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }
              : i => { setMobDir(i > mobIdx ? 1 : -1); setMobIdx(i); }
            }
            onClose={() => setLightbox(null)}
            glowColor={R(0.07)}
            renderSlide={(screen, dims) => (
              lightbox === "web"
                ? <LandscapeWebImage screen={screen} dir={webDir} width={dims.webWidth} />
                : <Phone screen={screen} dir={mobDir} width={dims.phoneW} />
            )}
            renderFooter={screen => (
              <>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{screen.label}</span>
                <Dots
                  count={(lightbox === "web" ? WEB_SCREENS : MOB_SCREENS).length}
                  current={lightbox === "web" ? webIdx : mobIdx}
                  onChange={lightbox === "web"
                    ? i => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }
                    : i => { setMobDir(i > mobIdx ? 1 : -1); setMobIdx(i); }
                  }
                />
              </>
            )}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default RaffoulMotorsCaseStudy;
