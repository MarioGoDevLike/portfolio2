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

/* ─── Vendor app screenshots ───────────────────────── */
import vendorDashboard from "../../assets/Top_speed_apps/vendor_dashboard_page.png";
import vendorAddOrder  from "../../assets/Top_speed_apps/vendor_addorder_page.png";
import vendorOrders    from "../../assets/Top_speed_apps/vendor_orders_page.png";
import vendorSettings  from "../../assets/Top_speed_apps/vendor_settings_page.png";

/* ─── Driver app screenshots ───────────────────────── */
import driverLogin     from "../../assets/Top_speed_apps/driver_login_page.png";
import driverDashboard from "../../assets/Top_speed_apps/driver_dashboard_page.png";
import driverArchive   from "../../assets/Top_speed_apps/driver_archive_page.jpeg";
import driverSettings  from "../../assets/Top_speed_apps/driver_settings_page.png";

import topSpeedLogo from "../../assets/Top_speed_apps/topspeedlogo.png";

/* ─── Brand colours (white + red) ──────────────────── */
const RED = "#DC1F26";
const R = (a) => `rgba(220,31,38,${a})`;
const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 340, damping: 30 };

const VENDOR_SCREENS = [
  { src: vendorDashboard, label: "Dashboard"  },
  { src: vendorAddOrder,  label: "Add Order"  },
  { src: vendorOrders,    label: "Orders"     },
  { src: vendorSettings,  label: "Settings"   },
];

const DRIVER_SCREENS = [
  { src: driverLogin,     label: "Login"      },
  { src: driverDashboard, label: "Dashboard"  },
  { src: driverArchive,   label: "Archive"    },
  { src: driverSettings,  label: "Settings"   },
];

const ALL_TECH = [
  { name: "Flutter"  },
  { name: "PHP"      },
  { name: "Firebase" },
  { name: "FCM"      },
  { name: "GPS"      },
  { name: "Figma"    },
];

const FEATURES = [
  "Vendors post delivery orders and track every status in real time",
  "Vendor dashboard with pending, active, and delivered order counts",
  "Full archived order history for vendors",
  "Drivers receive instant Firebase push notifications for new orders",
  "Driver dashboard for active packages and delivery statuses",
  "Live GPS location tracking while drivers are on duty",
  "Multi-language support across both vendor and driver apps",
];

const TABS = [
  { id: "overview", label: "Overview"    },
  { id: "vendor",   label: "Vendor App"  },
  { id: "driver",   label: "Driver App"  },
];

const TopSpeedMark = ({ size = 1 }) => (
  <motion.img
    src={topSpeedLogo}
    alt="Top Speed"
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.35, ease: EASE }}
    style={{
      height: 48 * size,
      width: 48 * size,
      objectFit: "contain",
      flexShrink: 0,
      display: "block",
    }}
  />
);

const TabBar = ({ active, onChange, tabs = TABS }) => (
  <div style={{ display: "flex", gap: 2, padding: 4, background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          position: "relative", padding: "7px 15px", borderRadius: 7, border: "none", cursor: "pointer",
          background: "transparent", color: active === tab.id ? "white" : "rgba(255,255,255,0.38)",
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 500,
          transition: "color 0.2s", outline: "none", zIndex: 1, whiteSpace: "nowrap",
        }}
      >
        {active === tab.id && (
          <motion.div
            layoutId="ts-tab-pill"
            style={{ position: "absolute", inset: 0, borderRadius: 7, background: R(0.12), border: `1px solid ${R(0.28)}`, zIndex: -1 }}
            transition={SPRING}
          />
        )}
        {tab.label}
      </button>
    ))}
  </div>
);

const NavArrow = ({ dir, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.12, background: "rgba(255,255,255,0.1)" }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{
      width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center",
      justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.45)",
      outline: "none", flexShrink: 0,
    }}
  >
    {dir === -1 ? <HiChevronLeft size={13} /> : <HiChevronRight size={13} />}
  </motion.button>
);

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

const PhoneMockup = ({ screen, dir, width = 200, autoAdvanceDur, onClick, glowColor = RED }) => {
  const h = Math.round(width * 2.08);
  const glow = glowColor === RED ? R : (a) => `rgba(220,31,38,${a})`;
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
        boxShadow: ["0 35px 70px rgba(0,0,0,0.75)", `0 0 50px ${glow(0.14)}`, "inset 0 1px 0 rgba(255,255,255,0.06)"].join(", "),
      }}>
        <AnimatePresence custom={dir}>
          <motion.div
            key={screen.src}
            custom={dir}
            initial={{ x: dir * 28, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -dir * 28, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{ position: "absolute", inset: 0 }}
          >
            <img src={screen.src} alt={screen.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </motion.div>
        </AnimatePresence>
        <div style={{ position: "absolute", top: width * 0.056, left: "50%", transform: "translateX(-50%)", width: width * 0.38, height: width * 0.11, borderRadius: width * 0.06, background: "#111", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: width * 0.44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", zIndex: 10 }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: "inset 0 0 24px rgba(0,0,0,0.45)", pointerEvents: "none", zIndex: 5 }} />
        {autoAdvanceDur && <ProgressBar duration={autoAdvanceDur} trackKey={screen.src} />}
      </div>
      {[{ side: "right", top: "28%", h: 56 }, { side: "left", top: "19%", h: 34 }, { side: "left", top: "33%", h: 34 }, { side: "left", top: "13%", h: 18 }].map((btn, i) => (
        <div key={i} style={{ position: "absolute", [btn.side]: -2, top: btn.top, width: 3, height: btn.h, borderRadius: btn.side === "right" ? "0 2px 2px 0" : "2px 0 0 2px", background: "#252525" }} />
      ))}
      <div style={{ position: "absolute", bottom: -18, left: "10%", right: "10%", height: 30, background: `radial-gradient(ellipse, ${glow(0.28)}, transparent 70%)`, filter: "blur(10px)", pointerEvents: "none" }} />
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

const SectionLabel = ({ children, color = RED }) => (
  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color, opacity: 0.85 }}>
    {children}
  </span>
);

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

const Lightbox = ({ screens, idx, dir, onStep, onJump, onClose }) => {
  const screen = screens[idx];
  const lbPhoneW = Math.min(Math.round((window.innerHeight * 0.78) / 2.08), 360);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onStep, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{ position: "fixed", inset: 0, zIndex: 10002, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.97)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", padding: "64px 24px 28px", gap: 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 500, background: `radial-gradient(ellipse, ${R(0.07)} 0%, transparent 65%)`, filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 22, left: 24, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.22)" }}>{idx + 1} / {screens.length}</div>
      <motion.button
        whileHover={{ scale: 1.08, background: "rgba(255,255,255,0.12)" }} whileTap={{ scale: 0.9 }} onClick={onClose}
        style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.65)", outline: "none", zIndex: 10 }}
      >
        <HiX size={18} />
      </motion.button>
      <div style={{ display: "flex", alignItems: "center", gap: 28, width: "100%", justifyContent: "center", flex: 1, minHeight: 0 }}>
        <motion.button whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.9 }} onClick={() => onStep(-1)} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.55)", outline: "none", flexShrink: 0 }}>
          <HiChevronLeft size={22} />
        </motion.button>
        <motion.div key={screen.src} initial={{ opacity: 0, scale: 0.88, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 280, damping: 24 }}>
          <PhoneMockup screen={screen} dir={dir} width={lbPhoneW} />
        </motion.div>
        <motion.button whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.9 }} onClick={() => onStep(1)} style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.55)", outline: "none", flexShrink: 0 }}>
          <HiChevronRight size={22} />
        </motion.button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{screen.label}</span>
        <Dots count={screens.length} current={idx} onChange={onJump} />
      </div>
    </motion.div>
  );
};

/* ─── Phone column (reused in overview + tabs) ───────── */
const PhoneColumn = ({ label, sublabel, screens, idx, dir, step, setLightbox, phoneRotX, phoneRotY, width, autoAdvance, isMobile, levitateDelay = 0 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: isMobile ? "100%" : "auto" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 10 }}>
      <div>
        <SectionLabel color="rgba(255,255,255,0.3)">{label}</SectionLabel>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.18)", marginTop: 2, letterSpacing: "0.12em", textTransform: "uppercase" }}>{sublabel}</div>
      </div>
      <div style={{ display: "flex", gap: 5 }}>
        <NavArrow dir={-1} onClick={() => step(-1)} />
        <NavArrow dir={1} onClick={() => step(1)} />
      </div>
    </div>
    <motion.div
      animate={isMobile ? {} : { y: [0, -6, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: levitateDelay }}
      style={{ perspective: 1200 }}
    >
      <motion.div style={isMobile ? {} : { rotateX: phoneRotX, rotateY: phoneRotY, transformStyle: "preserve-3d" }}>
        <PhoneMockup screen={screens[idx]} dir={dir} width={width} autoAdvanceDur={autoAdvance} onClick={setLightbox} />
      </motion.div>
    </motion.div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, width: "100%", gap: 8 }}>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{screens[idx].label}</span>
      <Dots count={screens.length} current={idx} onChange={(i) => step(i > idx ? 1 : -1, i)} />
    </div>
  </div>
);

const TopSpeedCaseStudy = () => {
  const [tab, setTab] = useState(() => (window.innerWidth < 640 ? "vendor" : "overview"));
  const [vendorIdx, setVendorIdx] = useState(0);
  const [vendorDir, setVendorDir] = useState(1);
  const [driverIdx, setDriverIdx] = useState(0);
  const [driverDir, setDriverDir] = useState(1);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [lightbox, setLightbox] = useState(null);

  const containerRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 16 });
  const smy = useSpring(my, { stiffness: 55, damping: 16 });
  const vendorRotX = useTransform(smy, [-0.5, 0.5], [7, -7]);
  const vendorRotY = useTransform(smx, [-0.5, 0.5], [9, -9]);
  const driverRotX = useTransform(smy, [-0.5, 0.5], [7, -7]);
  const driverRotY = useTransform(smx, [-0.5, 0.5], [-9, 9]);

  const handleMouse = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mx.set((e.clientX - left) / width - 0.5);
    my.set((e.clientY - top) / height - 0.5);
  }, [mx, my]);

  const resetMouse = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  const stepVendor = useCallback((dir, jump) => {
    if (typeof jump === "number") {
      setVendorDir(jump > vendorIdx ? 1 : -1);
      setVendorIdx(jump);
      return;
    }
    setVendorDir(dir);
    setVendorIdx((i) => (i + dir + VENDOR_SCREENS.length) % VENDOR_SCREENS.length);
  }, [vendorIdx]);

  const stepDriver = useCallback((dir, jump) => {
    if (typeof jump === "number") {
      setDriverDir(jump > driverIdx ? 1 : -1);
      setDriverIdx(jump);
      return;
    }
    setDriverDir(dir);
    setDriverIdx((i) => (i + dir + DRIVER_SCREENS.length) % DRIVER_SCREENS.length);
  }, [driverIdx]);

  useEffect(() => {
    const v = setInterval(() => stepVendor(1), 4000);
    const d = setInterval(() => stepDriver(1), 3800);
    return () => { clearInterval(v); clearInterval(d); };
  }, [stepVendor, stepDriver]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const visibleTabs = isMobile ? TABS.filter((t) => t.id !== "overview") : TABS;

  useEffect(() => {
    if (isMobile && tab === "overview") setTab("vendor");
  }, [isMobile, tab]);

  const lightboxScreens = lightbox === "vendor" ? VENDOR_SCREENS : DRIVER_SCREENS;
  const lightboxIdx = lightbox === "vendor" ? vendorIdx : driverIdx;
  const lightboxDir = lightbox === "vendor" ? vendorDir : driverDir;
  const lightboxStep = lightbox === "vendor" ? stepVendor : stepDriver;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ position: "relative", width: "100%" }}
      >
        <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, background: `radial-gradient(ellipse, ${R(0.08)} 0%, transparent 65%)`, filter: "blur(50px)", pointerEvents: "none" }} />

        <div
          ref={containerRef}
          onMouseMove={isMobile ? undefined : handleMouse}
          onMouseLeave={isMobile ? undefined : resetMouse}
          style={{ position: "relative", width: "100%", overflowX: "hidden" }}
        >
          {/* Header */}
          <div style={{
            position: "sticky", top: 0, zIndex: 30,
            padding: isMobile ? "12px 16px 10px" : "14px 24px 12px",
            background: "rgba(9,9,11,0.92)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            <Link to="/" className="projects-page__back" style={{ marginBottom: isMobile ? 10 : 12 }}>
              <HiChevronLeft size={16} />
              Back to home
            </Link>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <TopSpeedMark size={isMobile ? 0.85 : 1} />
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 14 : 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.1 }}>
                    Top Speed
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: RED, marginTop: 2, letterSpacing: "0.04em" }}>
                    Delivery platform · Vendor &amp; Driver apps
                  </div>
                </div>
              </div>
              {!isMobile && <TabBar active={tab} onChange={setTab} tabs={visibleTabs} />}
            </div>
            {isMobile && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <TabBar active={tab} onChange={setTab} tabs={visibleTabs} />
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">

            {/* OVERVIEW */}
            {tab === "overview" && !isMobile && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE }}
                style={{ padding: "28px 28px 32px" }}
              >
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.38, ease: EASE }} style={{ marginBottom: 28 }}>
                  <SectionLabel>Case Study · Delivery</SectionLabel>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, marginTop: 8, maxWidth: 680 }}>
                    A dual-app delivery ecosystem connecting vendors and drivers. Vendors post orders,
                    track deliveries, and manage archives — drivers receive real-time assignments,
                    update package statuses, and are GPS-tracked while on duty. Built with Flutter,
                    PHP, and Firebase push notifications, with full multi-language support.
                  </p>
                </motion.div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "0 32px", alignItems: "start", marginBottom: 32, perspective: 1400 }}>
                  <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5, ease: EASE }}>
                    <PhoneColumn
                      label="Vendor App"
                      sublabel="Flutter · Orders &amp; Dashboard"
                      screens={VENDOR_SCREENS}
                      idx={vendorIdx}
                      dir={vendorDir}
                      step={stepVendor}
                      setLightbox={() => setLightbox("vendor")}
                      phoneRotX={vendorRotX}
                      phoneRotY={vendorRotY}
                      width={210}
                      autoAdvance={4}
                      isMobile={false}
                    />
                  </motion.div>
                  <div style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)", alignSelf: "stretch" }} />
                  <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5, ease: EASE }}>
                    <PhoneColumn
                      label="Driver App"
                      sublabel="Flutter · GPS &amp; Notifications"
                      screens={DRIVER_SCREENS}
                      idx={driverIdx}
                      dir={driverDir}
                      step={stepDriver}
                      setLightbox={() => setLightbox("driver")}
                      phoneRotX={driverRotX}
                      phoneRotY={driverRotY}
                      width={210}
                      autoAdvance={3.8}
                      isMobile={false}
                      levitateDelay={0.6}
                    />
                  </motion.div>
                </div>

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

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52, duration: 0.38, ease: EASE }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {ALL_TECH.map((t, i) => <TechPill key={t.name} name={t.name} delay={0.56 + i * 0.04} />)}
                  </div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em" }}>iOS &amp; Android</span>
                </motion.div>
              </motion.div>
            )}

            {/* VENDOR APP */}
            {tab === "vendor" && (
              <motion.div
                key="vendor"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE }}
                style={{ padding: isMobile ? "20px 16px 24px" : "28px 28px 32px" }}
              >
                <div style={{ marginBottom: isMobile ? 16 : 22 }}>
                  <SectionLabel>Flutter · PHP · Firebase</SectionLabel>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: "rgba(255,255,255,0.9)", margin: "7px 0 8px", lineHeight: 1.2 }}>
                    Vendor App
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 12.5 : 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.75, maxWidth: 580 }}>
                    Vendors use this app to post new delivery orders, monitor every active shipment,
                    and review completed work from the archive. The dashboard surfaces pending and
                    delivered counts at a glance — with multi-language support built in.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 28 }}>
                    <NavArrow dir={-1} onClick={() => stepVendor(-1)} />
                    <motion.div animate={isMobile ? {} : { y: [0, -6, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }} style={{ perspective: 1200 }}>
                      <motion.div style={isMobile ? {} : { rotateX: vendorRotX, rotateY: vendorRotY, transformStyle: "preserve-3d" }}>
                        <PhoneMockup screen={VENDOR_SCREENS[vendorIdx]} dir={vendorDir} width={isMobile ? 190 : 290} autoAdvanceDur={4} onClick={() => setLightbox("vendor")} />
                      </motion.div>
                    </motion.div>
                    <NavArrow dir={1} onClick={() => stepVendor(1)} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{VENDOR_SCREENS[vendorIdx].label}</span>
                    <Dots count={VENDOR_SCREENS.length} current={vendorIdx} onChange={(i) => stepVendor(i > vendorIdx ? 1 : -1, i)} />
                  </div>
                </div>
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Flutter", "PHP", "Firebase", "i18n"].map((t, i) => <TechPill key={t} name={t} delay={i * 0.04} />)}
                </div>
              </motion.div>
            )}

            {/* DRIVER APP */}
            {tab === "driver" && (
              <motion.div
                key="driver"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE }}
                style={{ padding: isMobile ? "20px 16px 24px" : "28px 28px 32px" }}
              >
                <div style={{ marginBottom: isMobile ? 16 : 22 }}>
                  <SectionLabel>Flutter · GPS · Push Notifications</SectionLabel>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: "rgba(255,255,255,0.9)", margin: "7px 0 8px", lineHeight: 1.2 }}>
                    Driver App
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 12.5 : 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.75, maxWidth: 580 }}>
                    Drivers receive pending orders via Firebase push notifications, manage active
                    packages from the dashboard, and update delivery statuses in real time.
                    While on duty, live GPS tracking logs their route so the company always
                    knows where each driver is headed.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 28 }}>
                    <NavArrow dir={-1} onClick={() => stepDriver(-1)} />
                    <motion.div animate={isMobile ? {} : { y: [0, -6, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} style={{ perspective: 1200 }}>
                      <motion.div style={isMobile ? {} : { rotateX: driverRotX, rotateY: driverRotY, transformStyle: "preserve-3d" }}>
                        <PhoneMockup screen={DRIVER_SCREENS[driverIdx]} dir={driverDir} width={isMobile ? 190 : 290} autoAdvanceDur={3.8} onClick={() => setLightbox("driver")} />
                      </motion.div>
                    </motion.div>
                    <NavArrow dir={1} onClick={() => stepDriver(1)} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{DRIVER_SCREENS[driverIdx].label}</span>
                    <Dots count={DRIVER_SCREENS.length} current={driverIdx} onChange={(i) => stepDriver(i > driverIdx ? 1 : -1, i)} />
                  </div>
                </div>
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["Flutter", "Firebase FCM", "GPS", "PHP"].map((t, i) => <TechPill key={t} name={t} delay={i * 0.04} />)}
                  </div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>Live tracking</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            screens={lightboxScreens}
            idx={lightboxIdx}
            dir={lightboxDir}
            onStep={lightboxStep}
            onJump={(i) => lightboxStep(i > lightboxIdx ? 1 : -1, i)}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TopSpeedCaseStudy;
