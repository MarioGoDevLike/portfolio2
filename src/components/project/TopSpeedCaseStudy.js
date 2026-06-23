import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiArrowsPointingOut } from "react-icons/hi2";
import CaseStudyLightbox from "./CaseStudyLightbox";
import CaseStudyMobileLayout, { MobilePreviewPhones, MobilePhoneFrame } from "./CaseStudyMobile";

/* ─── Assets ─────────────────────────────────────── */
import vendorDashboard from "../../assets/Top_speed_apps/vendor_dashboard_page.png";
import vendorAddOrder  from "../../assets/Top_speed_apps/vendor_addorder_page.png";
import vendorOrders    from "../../assets/Top_speed_apps/vendor_orders_page.png";
import vendorSettings  from "../../assets/Top_speed_apps/vendor_settings_page.png";
import driverLogin     from "../../assets/Top_speed_apps/driver_login_page.png";
import driverDashboard from "../../assets/Top_speed_apps/driver_dashboard_page.png";
import driverArchive   from "../../assets/Top_speed_apps/driver_archive_page.jpeg";
import driverSettings  from "../../assets/Top_speed_apps/driver_settings_page.png";
import topSpeedLogo    from "../../assets/Top_speed_apps/topspeedlogo.png";

/* ─── Brand ──────────────────────────────────────── */
const RED  = "#DC1F26";
const R    = (a) => `rgba(220,31,38,${a})`;
const EASE = [0.22, 1, 0.36, 1];

/* ─── Data ───────────────────────────────────────── */
const VENDOR_SCREENS = [
  { src: vendorDashboard, label: "Dashboard" },
  { src: vendorAddOrder,  label: "Add Order" },
  { src: vendorOrders,    label: "Orders"    },
  { src: vendorSettings,  label: "Settings"  },
];

const DRIVER_SCREENS = [
  { src: driverLogin,     label: "Login"     },
  { src: driverDashboard, label: "Dashboard" },
  { src: driverArchive,   label: "Archive"   },
  { src: driverSettings,  label: "Settings"  },
];

const STORY = [
  {
    num: "01",
    label: "The Problem",
    heading: "Two roles, two phones, zero coordination",
    body: "Vendors needed to post deliveries and track drivers. Drivers needed to receive orders and report status. There was no shared system — both sides operated blind.",
  },
  {
    num: "02",
    label: "The Approach",
    heading: "Two dedicated Flutter apps, one shared backend",
    body: "A Vendor App for posting and tracking orders, and a Driver App for receiving, accepting, and completing deliveries — both connected to Firebase with real-time sync and push notifications.",
  },
  {
    num: "03",
    label: "The Outcome",
    heading: "Real-time delivery coordination, live GPS",
    body: "Vendors see live order statuses. Drivers get instant push notifications. GPS tracking runs while on duty. Both apps are multilingual and production-deployed.",
  },
];

const FEATURES = [
  { title: "Order Management",     desc: "Vendors post deliveries and track every status in real time"              },
  { title: "Vendor Dashboard",     desc: "Pending, active, and delivered order counts at a glance"                  },
  { title: "Push Notifications",   desc: "Drivers receive instant Firebase alerts for every new order"              },
  { title: "Live GPS Tracking",    desc: "Location tracking active while drivers are on duty"                       },
  { title: "Order Archive",        desc: "Full delivery history accessible for both vendors and drivers"            },
  { title: "Multi-Language",       desc: "Full localisation across both vendor and driver apps"                     },
];

const VENDOR_HIGHLIGHTS = [
  { idx: 0, label: "Dashboard",  desc: "Order summary with live pending, active, delivered counters" },
  { idx: 1, label: "Add Order",  desc: "Create a delivery with destination, package info, and priority" },
  { idx: 2, label: "Orders",     desc: "Full order list with real-time status updates" },
  { idx: 3, label: "Settings",   desc: "Profile and notification preferences" },
];

const DRIVER_HIGHLIGHTS = [
  { idx: 0, label: "Login",      desc: "Secure driver authentication flow" },
  { idx: 1, label: "Dashboard",  desc: "Active orders and GPS tracking toggle" },
  { idx: 2, label: "Archive",    desc: "Completed deliveries history view" },
  { idx: 3, label: "Settings",   desc: "Driver profile and language settings" },
];

const TECH = [
  { category: "Mobile",   items: ["Flutter", "Dart", "Google Maps SDK"] },
  { category: "Backend",  items: ["Firebase", "Firestore", "FCM Push"]   },
  { category: "Tooling",  items: ["PHP API", "Figma", "Git"]             },
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
      background: "rgba(255,255,255,0.05)", border: `1px solid ${R(0.22)}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", color: "rgba(255,255,255,0.5)",
      outline: "none", flexShrink: 0, transition: "background 0.2s",
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
    <motion.div key={trackKey} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration, ease: "linear" }}
      style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${R(0.4)}, ${RED})`, transformOrigin: "left" }} />
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
          <motion.div key={screen.src} custom={dir}
            initial={{ x: dir * 28, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -dir * 28, opacity: 0 }}
            transition={{ duration: 0.36, ease: EASE }} style={{ position: "absolute", inset: 0 }}
          >
            <img src={screen.src} alt={screen.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
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
        <motion.div animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.18 }}
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

const Divider = () => (
  <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(255,255,255,0.05) 30%,rgba(255,255,255,0.05) 70%,transparent)" }} />
);

/* ── App showcase panel (reused for Vendor + Driver) ─ */
const AppShowcase = ({ title, subtitle, screens, highlights, idx, dir, setIdx, setDir, step, setLightbox, isMobile }) => (
  <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 44 : 72 }}>
    {/* Feature list */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, order: isMobile ? 2 : 1 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "rgba(255,255,255,0.88)", lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4, lineHeight: 1.6 }}>{subtitle}</div>
      </div>
      {highlights.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
        >
          <motion.div
            whileHover={{ x: 4 }}
            onClick={() => { setDir(item.idx > idx ? 1 : -1); setIdx(item.idx); }}
            style={{
              display: "flex", gap: 14, cursor: "pointer",
              padding: "16px 18px", borderRadius: 12,
              background: idx === item.idx ? R(0.06) : "rgba(255,255,255,0.02)",
              border: `1px solid ${idx === item.idx ? R(0.22) : "rgba(255,255,255,0.05)"}`,
              transition: "background 0.25s, border-color 0.25s",
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 10, background: R(0.1), border: `1px solid ${R(0.22)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, color: RED }}>{String(item.idx + 1).padStart(2, "0")}</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: idx === item.idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)", marginBottom: 4, transition: "color 0.25s" }}>{item.label}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.58 }}>{item.desc}</div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
    {/* Phone */}
    <motion.div
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
      style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", order: isMobile ? 1 : 2 }}
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
        <Phone screen={screens[idx]} dir={dir} width={isMobile ? 210 : 270} autoAdvanceDur={3.8} onClick={setLightbox} />
      </motion.div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28 }}>
        <NavBtn dir={-1} onClick={() => step(-1)} />
        <Dots count={screens.length} current={idx} onChange={i => { setDir(i > idx ? 1 : -1); setIdx(i); }} />
        <NavBtn dir={1}  onClick={() => step(1)}  />
      </div>
    </motion.div>
  </div>
);

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const TopSpeedCaseStudy = () => {
  const [vendorIdx, setVendorIdx] = useState(0);
  const [driverIdx, setDriverIdx] = useState(0);
  const [vendorDir, setVendorDir] = useState(1);
  const [driverDir, setDriverDir] = useState(1);
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth < 768);
  const [lightbox, setLightbox]   = useState(null);

  const stepVendor = useCallback((dir) => {
    setVendorDir(dir);
    setVendorIdx(i => (i + dir + VENDOR_SCREENS.length) % VENDOR_SCREENS.length);
  }, []);
  const stepDriver = useCallback((dir) => {
    setDriverDir(dir);
    setDriverIdx(i => (i + dir + DRIVER_SCREENS.length) % DRIVER_SCREENS.length);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;
    const v = setInterval(() => stepVendor(1), 4000);
    const d = setInterval(() => stepDriver(1), 3700);
    return () => { clearInterval(v); clearInterval(d); };
  }, [stepVendor, stepDriver, isMobile]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const wrap = { maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" };

  const mobileLayout = (
    <CaseStudyMobileLayout
      brand={{ color: RED, rgba: R }}
      eyebrow="Case Study · 2024"
      title="Top Speed"
      summary="Two dedicated Flutter apps — one for vendors, one for drivers — coordinating real-time deliveries with Firebase push notifications and live GPS tracking."
      logo={
        <img src={topSpeedLogo} alt="Top Speed" style={{ height: 44, width: 44, objectFit: "contain", display: "block", mixBlendMode: "screen" }} />
      }
      meta={[
        { label: "Role", value: "Mobile Developer" },
        { label: "Platform", value: "Flutter · iOS & Android" },
        { label: "Backend", value: "Firebase · PHP" },
        { label: "Type", value: "Dual-App System" },
      ]}
      ctas={[
        { label: "Vendor App", onClick: () => document.getElementById("ts-vendor")?.scrollIntoView({ behavior: "smooth" }), primary: true },
        { label: "Driver App", onClick: () => document.getElementById("ts-driver")?.scrollIntoView({ behavior: "smooth" }) },
      ]}
      preview={
        <MobilePreviewPhones
          leftSrc={VENDOR_SCREENS[vendorIdx].src}
          rightSrc={DRIVER_SCREENS[driverIdx].src}
          brand={{ color: RED, rgba: R }}
        />
      }
      story={STORY}
      appShowcases={[
        {
          id: "ts-vendor",
          navLabel: "Vendor",
          title: "Vendor App",
          subtitle: "Flutter · for business owners and dispatchers",
          screens: VENDOR_SCREENS,
          highlights: VENDOR_HIGHLIGHTS,
          activeIdx: vendorIdx,
          onIdxChange: (i) => { setVendorDir(i > vendorIdx ? 1 : -1); setVendorIdx(i); },
          onExpand: () => setLightbox("vendor"),
        },
        {
          id: "ts-driver",
          navLabel: "Driver",
          title: "Driver App",
          subtitle: "Flutter · for delivery drivers on the road",
          screens: DRIVER_SCREENS,
          highlights: DRIVER_HIGHLIGHTS,
          activeIdx: driverIdx,
          onIdxChange: (i) => { setDriverDir(i > driverIdx ? 1 : -1); setDriverIdx(i); },
          onExpand: () => setLightbox("driver"),
        },
      ]}
      features={FEATURES}
      tech={TECH}
      cta={{
        title: "Live & operational",
        description: "Both apps are deployed and in active use — vendors and drivers coordinating in real time.",
      }}
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

          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: isMobile ? "20px 20px" : "28px 48px", zIndex: 10 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
              <HiChevronLeft size={14} /> Back to home
            </Link>
          </div>

          <div style={{ ...wrap, paddingTop: isMobile ? 110 : 130, paddingBottom: 80, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 52 : 64, position: "relative", zIndex: 1 }}>

            <div style={{ flex: 1, minWidth: 0 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}
              >
                <motion.img
                  src={topSpeedLogo} alt="Top Speed"
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
                  style={{ height: 48, width: 48, objectFit: "contain", flexShrink: 0, display: "block", mixBlendMode: "screen" }}
                />
                <div style={{ borderLeft: `1px solid ${R(0.2)}`, paddingLeft: 14 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 22, height: 1, background: RED, opacity: 0.7, display: "block" }} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: RED, opacity: 0.85 }}>Case Study · 2024</span>
                  </div>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 42 : 68, lineHeight: 1.0, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.95)", margin: "0 0 18px" }}
              >
                Top Speed
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.5, ease: EASE }}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.36)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 500 }}
              >
                Two dedicated Flutter apps — one for vendors, one for drivers — coordinating real-time deliveries with Firebase push notifications and live GPS tracking.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}
              >
                {[
                  { label: "Role",     value: "Mobile Developer"    },
                  { label: "Platform", value: "Flutter · iOS & Android" },
                  { label: "Backend",  value: "Firebase · PHP"      },
                  { label: "Type",     value: "Dual-App System"     },
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
                <motion.button type="button"
                  onClick={() => document.getElementById("ts-vendor").scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ scale: 1.04, boxShadow: `0 0 36px ${R(0.55)}` }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 10, background: RED, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", border: "none", outline: "none" }}
                >
                  Vendor App
                </motion.button>
                <motion.button type="button"
                  onClick={() => document.getElementById("ts-driver").scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ scale: 1.03, borderColor: R(0.4) }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 10, background: "transparent", border: `1px solid ${R(0.22)}`, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", cursor: "pointer", outline: "none" }}
                >
                  Driver App
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT — dual phone preview (desktop) */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: 32, scale: 0.93 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.75, ease: EASE }}
                style={{ flexShrink: 0, width: 340, position: "relative", display: "flex", gap: 20, alignItems: "flex-start" }}
              >
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ filter: `drop-shadow(0 24px 40px rgba(0,0,0,0.7)) drop-shadow(0 0 30px ${R(0.18)})` }}
                >
                  <Phone screen={VENDOR_SCREENS[vendorIdx]} dir={vendorDir} width={148} autoAdvanceDur={4} />
                </motion.div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  style={{ marginTop: 36, filter: `drop-shadow(0 24px 40px rgba(0,0,0,0.7)) drop-shadow(0 0 30px ${R(0.12)})` }}
                >
                  <Phone screen={DRIVER_SCREENS[driverIdx]} dir={driverDir} width={148} autoAdvanceDur={3.7} />
                </motion.div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
          >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ width: 1, height: 28, background: `linear-gradient(to bottom, ${R(0.5)}, transparent)` }} />
          </motion.div>
        </section>

        <Divider />

        {/* ══════════ STORY ══════════ */}
        <section style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp>
              <SectionLabel>Project Story</SectionLabel>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: "0 0 48px", lineHeight: 1.15 }}>
                Two apps, one system
              </h2>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
              {STORY.map((card, i) => (
                <FadeUp key={card.num} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -5, borderColor: R(0.3) }}
                    style={{ padding: "28px 24px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid ${R(0.1)}`, height: "100%", position: "relative", overflow: "hidden", transition: "border-color 0.25s" }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${R(0.55)}, ${R(0.08)})` }} />
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 800, color: R(0.07), letterSpacing: "-0.04em", marginBottom: 18, lineHeight: 1 }}>{card.num}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: RED, opacity: 0.75, marginBottom: 10 }}>{card.label}</div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: isMobile ? 15 : 16, color: "rgba(255,255,255,0.88)", margin: "0 0 10px", lineHeight: 1.35 }}>{card.heading}</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.37)", lineHeight: 1.72, margin: 0 }}>{card.body}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ══════════ VENDOR APP ══════════ */}
        <section id="ts-vendor" style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp style={{ marginBottom: 48 }}>
              <SectionLabel>App One</SectionLabel>
            </FadeUp>
            <AppShowcase
              title="Vendor App"
              subtitle="Flutter · for business owners and dispatchers"
              screens={VENDOR_SCREENS}
              highlights={VENDOR_HIGHLIGHTS}
              idx={vendorIdx}
              dir={vendorDir}
              setIdx={setVendorIdx}
              setDir={setVendorDir}
              step={stepVendor}
              setLightbox={() => setLightbox("vendor")}
              isMobile={isMobile}
            />
          </div>
        </section>

        <Divider />

        {/* ══════════ DRIVER APP ══════════ */}
        <section id="ts-driver" style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp style={{ marginBottom: 48 }}>
              <SectionLabel>App Two</SectionLabel>
            </FadeUp>
            <AppShowcase
              title="Driver App"
              subtitle="Flutter · for delivery drivers on the road"
              screens={DRIVER_SCREENS}
              highlights={DRIVER_HIGHLIGHTS}
              idx={driverIdx}
              dir={driverDir}
              setIdx={setDriverIdx}
              setDir={setDriverDir}
              step={stepDriver}
              setLightbox={() => setLightbox("driver")}
              isMobile={isMobile}
            />
          </div>
        </section>

        <Divider />

        {/* ══════════ FEATURES ══════════ */}
        <section style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp style={{ marginBottom: 44 }}>
              <SectionLabel>Capabilities</SectionLabel>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.15 }}>What it does</h2>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
              {FEATURES.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -4, borderColor: R(0.25) }}
                    style={{ padding: isMobile ? "18px 14px" : "24px 20px", borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", height: "100%", transition: "border-color 0.25s" }}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: R(0.09), border: `1px solid ${R(0.18)}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 13, color: RED }}>✦</span>
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? 12 : 13, fontWeight: 600, color: "rgba(255,255,255,0.82)", marginBottom: 6, lineHeight: 1.3 }}>{f.title}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 11 : 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.65 }}>{f.desc}</div>
                  </motion.div>
                </FadeUp>
              ))}
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

        {/* ══════════ FOOTER ══════════ */}
        <section style={{ padding: isMobile ? "80px 0 110px" : "100px 0 130px" }}>
          <div style={{ ...wrap, textAlign: "center" }}>
            <FadeUp>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 28, height: 1, background: R(0.5) }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: RED, opacity: 0.8 }}>Deployed</span>
                <div style={{ width: 28, height: 1, background: R(0.5) }} />
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 46, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.92)", margin: "0 0 14px", lineHeight: 1.1 }}>
                Live &amp; operational
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.32)", margin: "0 auto 40px", maxWidth: 380, lineHeight: 1.7 }}>
                Both apps are deployed and in active use — vendors and drivers coordinating in real time.
              </p>
              <Link
                to="/"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "14px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
              >
                <HiChevronLeft size={13} /> Back to portfolio
              </Link>
            </FadeUp>
          </div>
        </section>

      </div>
      )}

      {/* ══════════ LIGHTBOX ══════════ */}
      <AnimatePresence>
        {lightbox && (
          <CaseStudyLightbox
            type="phone"
            screens={lightbox === "vendor" ? VENDOR_SCREENS : DRIVER_SCREENS}
            idx={lightbox === "vendor" ? vendorIdx : driverIdx}
            dir={lightbox === "vendor" ? vendorDir : driverDir}
            onStep={lightbox === "vendor" ? stepVendor : stepDriver}
            onJump={lightbox === "vendor"
              ? i => { setVendorDir(i > vendorIdx ? 1 : -1); setVendorIdx(i); }
              : i => { setDriverDir(i > driverIdx ? 1 : -1); setDriverIdx(i); }
            }
            onClose={() => setLightbox(null)}
            glowColor={R(0.07)}
            renderSlide={(screen, dims) => (
              <Phone screen={screen} dir={lightbox === "vendor" ? vendorDir : driverDir} width={dims.phoneW} />
            )}
            renderFooter={screen => (
              <>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{screen.label}</span>
                <Dots
                  count={(lightbox === "vendor" ? VENDOR_SCREENS : DRIVER_SCREENS).length}
                  current={lightbox === "vendor" ? vendorIdx : driverIdx}
                  onChange={lightbox === "vendor"
                    ? i => { setVendorDir(i > vendorIdx ? 1 : -1); setVendorIdx(i); }
                    : i => { setDriverDir(i > driverIdx ? 1 : -1); setDriverIdx(i); }
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

export default TopSpeedCaseStudy;
