import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";
import { HiArrowsPointingOut } from "react-icons/hi2";

/* ─── Desktop screenshots ──────────────────────────── */
import webHome1    from "../../assets/raffoul_motors_web/home_page_1.png";
import webHome2    from "../../assets/raffoul_motors_web/home_page_2.png";
import webCars     from "../../assets/raffoul_motors_web/available_cars_page.png";
import webWorkshop from "../../assets/raffoul_motors_web/workshop_page.png";
import webDash     from "../../assets/raffoul_motors_web/dashboard_page_1.png";

/* ─── Mobile screenshots ───────────────────────────── */
import mobHome     from "../../assets/raffoul_motors_web/mobile_view_home_page.png";
import mobCars     from "../../assets/raffoul_motors_web/mobile_view_available_cars.png";
import mobWorkshop from "../../assets/raffoul_motors_web/mobile_view_workshop_cars.png";
import mobDash     from "../../assets/raffoul_motors_web/mobile_view_dashboard.png";
import raffoulLogo from "../../assets/raffoulmotors.png";

/* ─── Colour system (brand: white + red) ───────────── */
const RED = "#E31E24";
const R = (a) => `rgba(227,30,36,${a})`;
const EASE  = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 340, damping: 30 };

/* ─── Screen arrays ────────────────────────────────── */
const WEB_SCREENS = [
  { src: webHome1,    label: "Home — Hero"    },
  { src: webHome2,    label: "Home — Showroom" },
  { src: webCars,     label: "Available Cars"  },
  { src: webWorkshop, label: "Workshop"        },
  { src: webDash,     label: "Admin Dashboard" },
];

const MOB_SCREENS = [
  { src: mobHome,     label: "Home"           },
  { src: mobCars,     label: "Available Cars" },
  { src: mobWorkshop, label: "Workshop"       },
  { src: mobDash,     label: "Admin View"     },
];

/* ─── Content ──────────────────────────────────────── */
const ALL_TECH = [
  { name: "React 18"   },
  { name: "TypeScript" },
  { name: "Firebase"   },
  { name: "Vite"       },
  { name: "i18next"    },
  { name: "Figma"      },
];

const FEATURES = [
  "Full bilingual Arabic & English with live language picker",
  "Inventory browse with filters — make, year, price & more",
  "Car detail pages with gallery, specs & WhatsApp contact",
  "Workshop section for cars currently in refurbishment",
  "Admin panel — publish, edit and delete listings without code",
  "Image upload & optimisation with 360° spin frame support",
];

const TABS = [
  { id: "overview", label: "Overview"    },
  { id: "website",  label: "Website"     },
  { id: "mobile",   label: "Mobile View" },
];

/* ─── Raffoul Motors logo mark ─────────────────────── */
const RaffoulMark = ({ size = 1 }) => (
  <motion.img
    src={raffoulLogo}
    alt="Raffoul Motors"
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.35, ease: EASE }}
    style={{
      height: 44 * size,
      width: "auto",
      objectFit: "contain",
      flexShrink: 0,
      display: "block",
    }}
  />
);

/* ─── Tab bar ──────────────────────────────────────── */
const TabBar = ({ active, onChange, tabs = TABS }) => (
  <div style={{
    display: "flex", gap: 2, padding: 4,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)",
  }}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          position: "relative", padding: "7px 15px", borderRadius: 7,
          border: "none", cursor: "pointer", background: "transparent",
          color: active === tab.id ? "white" : "rgba(255,255,255,0.38)",
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 12,
          fontWeight: 500, transition: "color 0.2s", outline: "none",
          zIndex: 1, whiteSpace: "nowrap",
        }}
      >
        {active === tab.id && (
          <motion.div
            layoutId="rm-tab-pill"
            style={{
              position: "absolute", inset: 0, borderRadius: 7,
              background: R(0.12), border: `1px solid ${R(0.28)}`, zIndex: -1,
            }}
            transition={SPRING}
          />
        )}
        {tab.label}
      </button>
    ))}
  </div>
);

/* ─── Nav arrow ────────────────────────────────────── */
const NavArrow = ({ dir, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.12, background: "rgba(255,255,255,0.1)" }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{
      width: 28, height: 28, borderRadius: "50%",
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", color: "rgba(255,255,255,0.45)", outline: "none",
      flexShrink: 0, transition: "background 0.2s",
    }}
  >
    {dir === -1 ? <HiChevronLeft size={13} /> : <HiChevronRight size={13} />}
  </motion.button>
);

/* ─── Dots ─────────────────────────────────────────── */
const Dots = ({ count, current, onChange }) => (
  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.button
        key={i}
        onClick={() => onChange(i)}
        animate={{ width: current === i ? 16 : 5, background: current === i ? RED : "rgba(255,255,255,0.15)" }}
        transition={{ duration: 0.28, ease: EASE }}
        style={{ height: 5, borderRadius: 3, border: "none", cursor: "pointer", padding: 0, flexShrink: 0, outline: "none" }}
      />
    ))}
  </div>
);

/* ─── Progress bar ─────────────────────────────────── */
const ProgressBar = ({ duration, trackKey }) => (
  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden", zIndex: 8 }}>
    <motion.div
      key={trackKey}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration, ease: "linear" }}
      style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${R(0.5)}, ${RED})`, transformOrigin: "left" }}
    />
  </div>
);

/* ─── Phone mockup ─────────────────────────────────── */
const PhoneMockup = ({ screen, dir, width = 200, autoAdvanceDur, onClick }) => {
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
        background: "linear-gradient(160deg, #252525, #141414)",
        border: "1.5px solid rgba(255,255,255,0.08)", overflow: "hidden",
        boxShadow: ["0 35px 70px rgba(0,0,0,0.75)", `0 0 50px ${R(0.14)}`, "inset 0 1px 0 rgba(255,255,255,0.06)"].join(", "),
      }}>
        <AnimatePresence custom={dir}>
          <motion.div
            key={screen.src} custom={dir}
            initial={{ x: dir * 28, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -dir * 28, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{ position: "absolute", inset: 0 }}
          >
            <img src={screen.src} alt={screen.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </motion.div>
        </AnimatePresence>
        {/* Dynamic island */}
        <div style={{ position: "absolute", top: width * 0.056, left: "50%", transform: "translateX(-50%)", width: width * 0.38, height: width * 0.11, borderRadius: width * 0.06, background: "#111", zIndex: 10 }} />
        {/* Home bar */}
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: width * 0.44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", zIndex: 10 }} />
        {/* Inner shadow */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: "inset 0 0 24px rgba(0,0,0,0.45)", pointerEvents: "none", zIndex: 5 }} />
        {autoAdvanceDur && <ProgressBar duration={autoAdvanceDur} trackKey={screen.src} />}
      </div>
      {/* Side buttons */}
      {[{ side: "right", top: "28%", h: 56 }, { side: "left", top: "19%", h: 34 }, { side: "left", top: "33%", h: 34 }, { side: "left", top: "13%", h: 18 }].map((btn, i) => (
        <div key={i} style={{ position: "absolute", [btn.side]: -2, top: btn.top, width: 3, height: btn.h, borderRadius: btn.side === "right" ? "0 2px 2px 0" : "2px 0 0 2px", background: "#252525" }} />
      ))}
      {/* Glow */}
      <div style={{ position: "absolute", bottom: -18, left: "10%", right: "10%", height: 30, background: `radial-gradient(ellipse, ${R(0.28)}, transparent 70%)`, filter: "blur(10px)", pointerEvents: "none" }} />
      {/* Expand overlay */}
      {onClick && (
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ position: "absolute", inset: 0, borderRadius: width * 0.19, background: "rgba(0,0,0,0.38)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 25, pointerEvents: "none" }}
        >
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <HiArrowsPointingOut size={20} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ─── Browser mockup ───────────────────────────────── */
const BrowserMockup = ({ screen, dir, height, autoAdvanceDur, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", width: "100%", borderRadius: 12, overflow: "hidden",
        background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)",
        cursor: onClick ? "zoom-in" : "default",
        boxShadow: ["0 28px 60px rgba(0,0,0,0.6)", `0 0 45px ${R(0.1)}`, "inset 0 1px 0 rgba(255,255,255,0.04)"].join(", "),
      }}
    >
      {/* Chrome bar */}
      <div style={{ height: 36, display: "flex", alignItems: "center", padding: "0 12px", gap: 10, background: "rgba(0,0,0,0.55)", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 18, borderRadius: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 8, gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: RED, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", whiteSpace: "nowrap" }}>raffoul-motors.vercel.app</span>
        </div>
      </div>
      {/* Screenshot */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          ...(height ? { height } : { aspectRatio: "16 / 9" }),
        }}
      >
        <AnimatePresence custom={dir}>
          <motion.div
            key={screen.src} custom={dir}
            initial={{ x: dir * 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -dir * 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ position: "absolute", inset: 0 }}
          >
            <img src={screen.src} alt={screen.label} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "top center", display: "block", background: "#0a0a0a" }} />
          </motion.div>
        </AnimatePresence>
        {autoAdvanceDur && <ProgressBar duration={autoAdvanceDur} trackKey={screen.src} />}
      </div>
      {/* Expand overlay */}
      {onClick && (
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 25, pointerEvents: "none" }}
        >
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <HiArrowsPointingOut size={22} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ─── Thumbnail grid ───────────────────────────────── */
const ThumbnailGrid = ({ screens, current, onChange, aspectRatio = "16/10", cols }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols || Math.min(screens.length, 9)}, 1fr)`, gap: 6 }}>
    {screens.map((s, i) => (
      <motion.button
        key={i}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(i)}
        style={{
          position: "relative", overflow: "hidden",
          borderRadius: aspectRatio === "9/18" ? 6 : 5,
          cursor: "pointer", padding: 0, border: "none",
          outline: current === i ? `2px solid ${RED}` : "2px solid transparent",
          outlineOffset: 1, aspectRatio, transition: "outline-color 0.2s",
        }}
      >
        <img src={s.src} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: current === i ? R(0.18) : "rgba(0,0,0,0.28)", transition: "background 0.2s" }} />
        <span style={{ position: "absolute", bottom: 3, left: 0, right: 0, textAlign: "center", fontFamily: "'Space Grotesk', sans-serif", fontSize: 7, letterSpacing: "0.04em", color: current === i ? RED : "rgba(255,255,255,0.4)", fontWeight: 500, padding: "0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {s.label}
        </span>
      </motion.button>
    ))}
  </div>
);

/* ─── Section label ────────────────────────────────── */
const SectionLabel = ({ children, color = RED }) => (
  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color, opacity: 0.85 }}>
    {children}
  </span>
);

/* ─── Tech pill ────────────────────────────────────── */
const TechPill = ({ name, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.24, ease: EASE }}
    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.06em", padding: "4px 11px", borderRadius: 999, background: R(0.08), border: `1px solid ${R(0.2)}`, color: RED, whiteSpace: "nowrap" }}
  >
    {name}
  </motion.span>
);

/* ─── Fullscreen lightbox ──────────────────────────── */
const Lightbox = ({ type, screens, idx, dir, onStep, onJump, onClose }) => {
  const screen = screens[idx];

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onStep, onClose]);

  const lbPhoneW  = Math.min(Math.round((window.innerHeight * 0.78) / 2.08), 360);
  const lbBrowserH = Math.min(Math.round(window.innerHeight * 0.68), 560);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{ position: "fixed", inset: 0, zIndex: 10002, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.97)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", padding: "64px 24px 28px", gap: 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ambient glow */}
      <div style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 500, background: `radial-gradient(ellipse, ${R(0.07)} 0%, transparent 65%)`, filter: "blur(60px)", pointerEvents: "none" }} />
      {/* counter */}
      <div style={{ position: "absolute", top: 22, left: 24, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.22)" }}>{idx + 1} / {screens.length}</div>
      {/* close */}
      <motion.button
        whileHover={{ scale: 1.08, background: "rgba(255,255,255,0.12)" }} whileTap={{ scale: 0.9 }} onClick={onClose}
        style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.65)", outline: "none", zIndex: 10 }}
      >
        <HiX size={18} />
      </motion.button>
      {/* device + arrows */}
      <div style={{ display: "flex", alignItems: "center", gap: type === "phone" ? 28 : 20, width: "100%", justifyContent: "center", flex: 1, minHeight: 0 }}>
        <motion.button whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.9 }} onClick={() => onStep(-1)} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.55)", outline: "none", flexShrink: 0 }}>
          <HiChevronLeft size={22} />
        </motion.button>
        <motion.div
          key={screen.src}
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          style={type !== "phone" ? { width: "min(88vw, 1000px)", flexShrink: 0 } : {}}
        >
          {type === "phone"
            ? <PhoneMockup screen={screen} dir={dir} width={lbPhoneW} />
            : <BrowserMockup screen={screen} dir={dir} height={lbBrowserH} />
          }
        </motion.div>
        <motion.button whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.9 }} onClick={() => onStep(1)} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.55)", outline: "none", flexShrink: 0 }}>
          <HiChevronRight size={22} />
        </motion.button>
      </div>
      {/* label + dots */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{screen.label}</span>
        <Dots count={screens.length} current={idx} onChange={onJump} />
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN CASE STUDY
═══════════════════════════════════════════════════════ */
const RaffoulMotorsCaseStudy = () => {
  const [tab, setTab] = useState(() => (window.innerWidth < 640 ? "website" : "overview"));
  const [webIdx, setWebIdx] = useState(0);
  const [webDir, setWebDir] = useState(1);
  const [mobIdx, setMobIdx] = useState(0);
  const [mobDir, setMobDir] = useState(1);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [lightbox, setLightbox] = useState(null); // null | "web" | "phone"

  const containerRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 16 });
  const smy = useSpring(my, { stiffness: 55, damping: 16 });
  const browserRotX = useTransform(smy, [-0.5, 0.5], [4, -4]);
  const browserRotY = useTransform(smx, [-0.5, 0.5], [6, -6]);
  const phoneRotX   = useTransform(smy, [-0.5, 0.5], [7, -7]);
  const phoneRotY   = useTransform(smx, [-0.5, 0.5], [-9, 9]);

  const handleMouse = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mx.set((e.clientX - left) / width - 0.5);
    my.set((e.clientY - top) / height - 0.5);
  }, [mx, my]);

  const resetMouse = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  const stepWeb = useCallback((dir) => {
    setWebDir(dir);
    setWebIdx((i) => (i + dir + WEB_SCREENS.length) % WEB_SCREENS.length);
  }, []);
  const stepMob = useCallback((dir) => {
    setMobDir(dir);
    setMobIdx((i) => (i + dir + MOB_SCREENS.length) % MOB_SCREENS.length);
  }, []);

  /* Auto-advance */
  useEffect(() => {
    const w = setInterval(() => stepWeb(1), 4200);
    const m = setInterval(() => stepMob(1), 3800);
    return () => { clearInterval(w); clearInterval(m); };
  }, [stepWeb, stepMob]);

  /* Responsive tracker */
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const visibleTabs = isMobile ? TABS.filter((t) => t.id !== "overview") : TABS;

  useEffect(() => {
    if (isMobile && tab === "overview") setTab("website");
  }, [isMobile, tab]);

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      style={{ position: "relative", width: "100%" }}
    >
      {/* Ambient red glow */}
      <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, background: `radial-gradient(ellipse, ${R(0.07)} 0%, transparent 65%)`, filter: "blur(50px)", pointerEvents: "none" }} />

      <div
        ref={containerRef}
        onMouseMove={isMobile ? undefined : handleMouse}
        onMouseLeave={isMobile ? undefined : resetMouse}
        style={{ position: "relative", width: "100%", overflowX: "hidden" }}
      >
        {/* ── Sticky header ── */}
        <div style={{
          position: "sticky", top: 0, zIndex: 30,
          padding: isMobile ? "12px 16px 10px" : "14px 24px 12px",
          background: "rgba(9,9,11,0.92)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {/* Back link */}
          <Link
            to="/"
            className="projects-page__back"
            style={{ marginBottom: isMobile ? 10 : 12 }}
          >
            <HiChevronLeft size={16} />
            Back to home
          </Link>

          {/* Row 1: mark + title (+ tabs on desktop) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <RaffoulMark size={isMobile ? 0.85 : 1} />
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 14 : 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.1 }}>
                  Raffoul Motors
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: RED, marginTop: 2, letterSpacing: "0.04em" }}>
                  Car dealership platform
                </div>
              </div>
            </div>
            {!isMobile && <TabBar active={tab} onChange={setTab} tabs={visibleTabs} />}
          </div>

          {/* Row 2: tabs on mobile */}
          {isMobile && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <TabBar active={tab} onChange={setTab} tabs={visibleTabs} />
            </div>
          )}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">

          {/* ════════ OVERVIEW ════════ */}
          {tab === "overview" && !isMobile && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ padding: "28px 28px 32px" }}
            >
              {/* Intro */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.38, ease: EASE }} style={{ marginBottom: 28 }}>
                <SectionLabel>Case Study · 2025</SectionLabel>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, marginTop: 8, maxWidth: 640 }}>
                  A bilingual web platform for a family-run pre-owned car showroom in South Lebanon.
                  Built solo — full public site with inventory, car detail pages, and a workshop section,
                  plus a private admin panel for managing listings, media, and site settings without code.
                </p>
              </motion.div>

              {/* Dual mockup row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1px auto", gap: "0 20px", alignItems: "start", marginBottom: 32, perspective: 1400 }}>

                {/* Desktop web */}
                <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5, ease: EASE }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div>
                      <SectionLabel color="rgba(255,255,255,0.3)">Website</SectionLabel>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.18)", marginTop: 2, letterSpacing: "0.12em", textTransform: "uppercase" }}>React 18 · TypeScript</div>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <NavArrow dir={-1} onClick={() => stepWeb(-1)} />
                      <NavArrow dir={1}  onClick={() => stepWeb(1)}  />
                    </div>
                  </div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>
                    <motion.div style={{ rotateX: browserRotX, rotateY: browserRotY, transformStyle: "preserve-3d" }}>
                      <BrowserMockup screen={WEB_SCREENS[webIdx]} dir={webDir} autoAdvanceDur={4.2} onClick={() => setLightbox("web")} />
                    </motion.div>
                  </motion.div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 8 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{WEB_SCREENS[webIdx].label}</span>
                    <Dots count={WEB_SCREENS.length} current={webIdx} onChange={(i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }} />
                  </div>
                </motion.div>

                {/* Divider */}
                <div style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)", alignSelf: "stretch" }} />

                {/* Mobile view */}
                <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5, ease: EASE }} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 210 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 10 }}>
                    <div>
                      <SectionLabel color="rgba(255,255,255,0.3)">Mobile View</SectionLabel>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.18)", marginTop: 2, letterSpacing: "0.12em", textTransform: "uppercase" }}>Responsive · EN &amp; AR</div>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <NavArrow dir={-1} onClick={() => stepMob(-1)} />
                      <NavArrow dir={1}  onClick={() => stepMob(1)}  />
                    </div>
                  </div>
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}>
                    <motion.div style={{ rotateX: phoneRotX, rotateY: phoneRotY, transformStyle: "preserve-3d" }}>
                      <PhoneMockup screen={MOB_SCREENS[mobIdx]} dir={mobDir} width={190} autoAdvanceDur={3.8} onClick={() => setLightbox("phone")} />
                    </motion.div>
                  </motion.div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, width: "100%", gap: 8 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{MOB_SCREENS[mobIdx].label}</span>
                    <Dots count={MOB_SCREENS.length} current={mobIdx} onChange={(i) => { setMobDir(i > mobIdx ? 1 : -1); setMobIdx(i); }} />
                  </div>
                </motion.div>
              </div>

              {/* Features */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.4, ease: EASE }} style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: 12 }}>Key Features</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 20px" }}>
                  {FEATURES.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 + i * 0.06, duration: 0.3, ease: EASE }}
                      style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.55 }}>
                      <span style={{ color: RED, flexShrink: 0, marginTop: 1, fontSize: 9 }}>▸</span>
                      {f}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tech + CTA */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52, duration: 0.38, ease: EASE }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {ALL_TECH.map((t, i) => <TechPill key={t.name} name={t.name} delay={0.56 + i * 0.04} />)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>Solo Project · 2025</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ════════ WEBSITE ════════ */}
          {tab === "website" && (
            <motion.div
              key="website"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ padding: isMobile ? "20px 16px 24px" : "28px 28px 32px" }}
            >
              <div style={{ marginBottom: isMobile ? 16 : 22 }}>
                <SectionLabel>React 18 · TypeScript · Firebase</SectionLabel>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: "rgba(255,255,255,0.9)", margin: "7px 0 8px", lineHeight: 1.2 }}>
                  The Web Platform
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 12.5 : 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.75, maxWidth: 580 }}>
                  A public-facing bilingual site where customers browse inventory, view car details
                  with full specs and photo galleries, and contact the showroom via phone or WhatsApp.
                  A private admin panel lets the dealership manage listings, images, and settings without touching code.
                </p>
              </div>

              {/* Browser + nav */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.38)" }}>{WEB_SCREENS[webIdx].label}</span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <NavArrow dir={-1} onClick={() => stepWeb(-1)} />
                    <NavArrow dir={1}  onClick={() => stepWeb(1)}  />
                  </div>
                </div>
                <BrowserMockup screen={WEB_SCREENS[webIdx]} dir={webDir} onClick={() => setLightbox("web")} />
                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                  <Dots count={WEB_SCREENS.length} current={webIdx} onChange={(i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }} />
                </div>
              </div>

              {/* Thumbnails — desktop only */}
              {!isMobile && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>All Screens</div>
                  <ThumbnailGrid screens={WEB_SCREENS} current={webIdx} onChange={(i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }} aspectRatio="16/10" cols={WEB_SCREENS.length} />
                </div>
              )}

              {/* Footer */}
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["React 18", "TypeScript", "Firebase", "Vite", "i18next"].map((t, i) => <TechPill key={t} name={t} delay={i * 0.04} />)}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════ MOBILE VIEW ════════ */}
          {tab === "mobile" && (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ padding: isMobile ? "20px 16px 24px" : "28px 28px 32px" }}
            >
              <div style={{ marginBottom: isMobile ? 16 : 22 }}>
                <SectionLabel>Responsive · English &amp; Arabic</SectionLabel>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: "rgba(255,255,255,0.9)", margin: "7px 0 8px", lineHeight: 1.2 }}>
                  Mobile View
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 12.5 : 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.75, maxWidth: 580 }}>
                  The platform is fully responsive — every page adapts cleanly to mobile screens.
                  Customers on the go can browse inventory, open car details, and contact the showroom
                  via WhatsApp with a single tap, in both English and Arabic.
                </p>
              </div>

              {/* Phone + arrows */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: isMobile ? 20 : 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 28 }}>
                  <NavArrow dir={-1} onClick={() => stepMob(-1)} />
                  <motion.div
                    animate={isMobile ? {} : { y: [0, -6, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ perspective: 1200 }}
                  >
                    <motion.div style={isMobile ? {} : { rotateX: phoneRotX, rotateY: phoneRotY, transformStyle: "preserve-3d" }}>
                      <PhoneMockup screen={MOB_SCREENS[mobIdx]} dir={mobDir} width={isMobile ? 190 : 290} autoAdvanceDur={3.8} onClick={() => setLightbox("phone")} />
                    </motion.div>
                  </motion.div>
                  <NavArrow dir={1} onClick={() => stepMob(1)} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{MOB_SCREENS[mobIdx].label}</span>
                  <Dots count={MOB_SCREENS.length} current={mobIdx} onChange={(i) => { setMobDir(i > mobIdx ? 1 : -1); setMobIdx(i); }} />
                </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["React 18", "i18next", "Firebase", "Figma"].map((t, i) => <TechPill key={t} name={t} delay={i * 0.04} />)}
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>EN &amp; AR</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>

    {/* ── Lightbox ── */}
    <AnimatePresence>
      {lightbox && (
        <Lightbox
          type={lightbox}
          screens={lightbox === "phone" ? MOB_SCREENS : WEB_SCREENS}
          idx={lightbox === "phone" ? mobIdx : webIdx}
          dir={lightbox === "phone" ? mobDir : webDir}
          onStep={lightbox === "phone" ? stepMob : stepWeb}
          onJump={lightbox === "phone"
            ? (i) => { setMobDir(i > mobIdx ? 1 : -1); setMobIdx(i); }
            : (i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }
          }
          onClose={() => setLightbox(null)}
        />
      )}
    </AnimatePresence>
    </>
  );
};

export default RaffoulMotorsCaseStudy;
