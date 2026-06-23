import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiArrowUpRight, HiArrowsPointingOut } from "react-icons/hi2";
import CaseStudyLightbox, { LandscapeWebImage } from "./CaseStudyLightbox";
import CaseStudyMobileLayout, { MobilePreviewDual, MobilePhoneFrame } from "./CaseStudyMobile";

/* ─── Assets ─────────────────────────────────────── */
import appWelcome   from "../../assets/ello_app_images/unlogged page.png";
import appHome      from "../../assets/ello_app_images/Home page.png";
import appSignUp    from "../../assets/ello_app_images/sign up page.png";
import appCourse    from "../../assets/ello_app_images/Course page.png";
import appInstructor from "../../assets/ello_app_images/instructor page.png";
import appSessions  from "../../assets/ello_app_images/my sessions page.png";
import webHome      from "../../assets/ello_website_images/home page.png";
import webTeachers  from "../../assets/ello_website_images/teachers page.png";
import webCourses   from "../../assets/ello_website_images/courses page.png";
import webProfile1  from "../../assets/ello_website_images/teacher profile 1.png";
import webProfile2  from "../../assets/ello_website_images/teacher profile 2.png";
import webBook      from "../../assets/ello_website_images/book page.png";
import webStudentDash from "../../assets/ello_website_images/student dashboard.png";
import webTeacherDash from "../../assets/ello_website_images/teachers dashboard.png";
import webCourseDetail from "../../assets/ello_website_images/course details 1.png";

/* ─── Brand ──────────────────────────────────────── */
const TEAL  = "#5ECFB1";
const T     = (a) => `rgba(94,207,177,${a})`;
const EASE  = [0.22, 1, 0.36, 1];

/* ─── Data ───────────────────────────────────────── */
const APP_SCREENS = [
  { src: appWelcome,    label: "Welcome"         },
  { src: appHome,       label: "Explore"         },
  { src: appSignUp,     label: "Join Ello"       },
  { src: appCourse,     label: "Course Detail"   },
  { src: appInstructor, label: "Instructor"      },
  { src: appSessions,   label: "My Sessions"     },
];

const WEB_SCREENS = [
  { src: webHome,         label: "Homepage"           },
  { src: webTeachers,     label: "Teachers"           },
  { src: webCourses,      label: "Courses"            },
  { src: webCourseDetail, label: "Course Detail"      },
  { src: webProfile1,     label: "Teacher Profile"    },
  { src: webProfile2,     label: "Profile Details"    },
  { src: webBook,         label: "Booking Flow"       },
  { src: webStudentDash,  label: "Student Dashboard"  },
  { src: webTeacherDash,  label: "Teacher Dashboard"  },
];

const STORY = [
  {
    num: "01",
    label: "The Problem",
    heading: "Students had no way to find the right instructor",
    body: "Learners struggled to discover verified, qualified instructors. Existing platforms lacked trust signals, had poor booking flows, and forced students and teachers onto disconnected tools.",
  },
  {
    num: "02",
    label: "The Approach",
    heading: "One cohesive ecosystem — web and mobile",
    body: "A shared Firebase backend powers a React.js web platform with dual dashboards plus a cross-platform React Native app. Built solo from Figma to deployment.",
  },
  {
    num: "03",
    label: "The Outcome",
    heading: "Shipped solo, production-ready end-to-end",
    body: "9 web screens, 6 mobile screens, Stripe checkout, real-time messaging, and session management — all from a single developer, zero to launch.",
  },
];

const FEATURES = [
  { title: "Verified Profiles",    desc: "Instructors with full education & experience verification" },
  { title: "Smart Booking",        desc: "Multi-tier session scheduling with Stripe checkout"         },
  { title: "Real-Time Messaging",  desc: "Live chat between students and instructors"                 },
  { title: "Dual Dashboards",      desc: "Separate student & teacher management experiences"          },
  { title: "Cross-Platform App",   desc: "iOS & Android from one React Native codebase"               },
  { title: "Course Management",    desc: "Full course creation, discovery, and enrolment flow"        },
];

const APP_HIGHLIGHTS = [
  { idx: 0, label: "Onboarding",       desc: "Smooth first-launch experience with role selection"       },
  { idx: 1, label: "Course Discovery", desc: "Browse instructors by subject, rating, and availability" },
  { idx: 3, label: "Booking Flow",     desc: "Select sessions, pick packages, pay with Stripe"          },
  { idx: 5, label: "Session Tracker",  desc: "Track all upcoming and past sessions in one place"        },
];

const TECH = [
  { category: "Frontend",  items: ["React.js", "Tailwind CSS", "React Router"] },
  { category: "Mobile",    items: ["React Native", "Expo", "React Navigation"]  },
  { category: "Backend",   items: ["Firebase", "Node.js", "Stripe API"]         },
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

const Eyebrow = () => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <span style={{ width: 22, height: 1, background: TEAL, opacity: 0.7, display: "block" }} />
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL, opacity: 0.85 }}>
      Case Study · 2024
    </span>
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
    <span style={{ width: 16, height: 1, background: T(0.6), display: "block" }} />
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: TEAL, opacity: 0.8 }}>
      {children}
    </span>
  </div>
);

const NavBtn = ({ dir, onClick }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.1, background: T(0.1) }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{
      width: 40, height: 40, borderRadius: "50%",
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${T(0.18)}`,
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
        animate={{ width: current === i ? 18 : 5, background: current === i ? TEAL : "rgba(255,255,255,0.15)" }}
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
      style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${T(0.4)}, ${TEAL})`, transformOrigin: "left" }}
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
        boxShadow: [`0 44px 88px rgba(0,0,0,0.8)`, `0 0 64px ${T(0.18)}`, "inset 0 1px 0 rgba(255,255,255,0.06)"].join(", "),
      }}>
        <AnimatePresence custom={dir}>
          <motion.div
            key={screen.src} custom={dir}
            initial={{ x: dir * 28, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -dir * 28, opacity: 0 }}
            transition={{ duration: 0.36, ease: EASE }}
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
      {[{ side: "right", top: "28%", h: 56 }, { side: "left", top: "19%", h: 34 }, { side: "left", top: "33%", h: 34 }, { side: "left", top: "13%", h: 18 }].map((b, i) => (
        <div key={i} style={{ position: "absolute", [b.side]: -2, top: b.top, width: 3, height: b.h, borderRadius: b.side === "right" ? "0 2px 2px 0" : "2px 0 0 2px", background: "#252525" }} />
      ))}
      <div style={{ position: "absolute", bottom: -22, left: "10%", right: "10%", height: 36, background: `radial-gradient(ellipse, ${T(0.32)}, transparent 70%)`, filter: "blur(12px)", pointerEvents: "none" }} />
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
        boxShadow: [`0 32px 64px rgba(0,0,0,0.65)`, `0 0 50px ${T(0.1)}`, "inset 0 1px 0 rgba(255,255,255,0.05)"].join(", "),
      }}
    >
      <div style={{ height: 38, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, background: "rgba(0,0,0,0.65)", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
        </div>
        <div style={{ flex: 1, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 10, gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", whiteSpace: "nowrap" }}>ellos-new-website.vercel.app</span>
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
            <img src={screen.src} alt={screen.label} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "top center", display: "block", background: "#0a0a0a" }} />
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
          padding: 0, border: `1px solid ${i === current ? T(0.55) : "rgba(255,255,255,0.07)"}`,
          borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "transparent", outline: "none",
          boxShadow: i === current ? `0 0 10px ${T(0.28)}` : "none", transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
          <img src={s.src} alt={s.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        </div>
      </motion.button>
    ))}
  </div>
);

/* ─── Ello logo mark ──────────────────────────────── */
const ElloMark = ({ size = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2.5 * size, flexShrink: 0 }}>
    {[{ w: 22, bg: "#4EAAA0" }, { w: 16, bg: "#2C6B70" }, { w: 22, bg: "#7ECEC4" }, { w: 14, bg: "#4EAAA0" }].map((bar, i) => (
      <motion.div
        key={i}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.3 + i * 0.07, duration: 0.32, ease: EASE }}
        style={{ width: bar.w * size, height: 4 * size, borderRadius: 2, background: bar.bg, transformOrigin: "left" }}
      />
    ))}
  </div>
);

/* ─── Divider ─────────────────────────────────────── */
const Divider = () => (
  <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(255,255,255,0.05) 30%,rgba(255,255,255,0.05) 70%,transparent)" }} />
);

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const ElloCafeCaseStudy = () => {
  const [appIdx, setAppIdx]     = useState(0);
  const [webIdx, setWebIdx]     = useState(0);
  const [appDir, setAppDir]     = useState(1);
  const [webDir, setWebDir]     = useState(1);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [lightbox, setLightbox] = useState(null);

  const stepApp = useCallback((dir) => {
    setAppDir(dir);
    setAppIdx(i => (i + dir + APP_SCREENS.length) % APP_SCREENS.length);
  }, []);
  const stepWeb = useCallback((dir) => {
    setWebDir(dir);
    setWebIdx(i => (i + dir + WEB_SCREENS.length) % WEB_SCREENS.length);
  }, []);

  useEffect(() => {
    if (isMobile) return undefined;
    const a = setInterval(() => stepApp(1), 3800);
    const w = setInterval(() => stepWeb(1), 4500);
    return () => { clearInterval(a); clearInterval(w); };
  }, [stepApp, stepWeb, isMobile]);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const wrap = { maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" };

  const mobileLayout = (
    <CaseStudyMobileLayout
      brand={{ color: TEAL, rgba: T }}
      eyebrow="Case Study · 2024"
      title="Ello Café"
      summary="A full-stack ed-tech ecosystem connecting students with verified instructors — one product across web and mobile, built solo from design to deployment."
      logo={<ElloMark size={1.1} />}
      meta={[
        { label: "Role", value: "Full-Stack Developer" },
        { label: "Type", value: "Web + Mobile" },
        { label: "Stack", value: "React · RN · Firebase" },
        { label: "Year", value: "2024" },
      ]}
      ctas={[
        { label: "Visit Live Site", href: "https://ellos-new-website.vercel.app/", primary: true },
        { label: "View Showcase", onClick: () => document.getElementById("ello-web")?.scrollIntoView({ behavior: "smooth" }) },
      ]}
      preview={
        <MobilePreviewDual
          webSrc={WEB_SCREENS[webIdx].src}
          phoneSrc={APP_SCREENS[appIdx].src}
          brand={{ color: TEAL, rgba: T }}
          url="https://ellos-new-website.vercel.app/"
        />
      }
      story={STORY}
      webShowcase={{
        id: "ello-web",
        title: "The Website",
        subtitle: "A React.js platform where students book sessions, track progress, and message instructors.",
        screens: WEB_SCREENS,
        onExpand: (i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); setLightbox("web"); },
      }}
      appShowcases={[{
        id: "ello-app",
        title: "React Native · iOS & Android",
        subtitle: "Cross-platform mobile app with booking, messaging, and session tracking.",
        screens: APP_SCREENS,
        highlights: APP_HIGHLIGHTS,
        activeIdx: appIdx,
        onIdxChange: (i) => { setAppDir(i > appIdx ? 1 : -1); setAppIdx(i); },
        onExpand: () => setLightbox("phone"),
      }]}
      features={FEATURES}
      tech={TECH}
      cta={{
        title: "See it in the wild",
        description: "The full platform is live and running. Take a look at the real thing.",
        liveUrl: "https://ellos-new-website.vercel.app/",
        liveLabel: "Open Ello Café",
      }}
      renderPhone={(screen) => <MobilePhoneFrame screen={screen} brand={{ color: TEAL, rgba: T }} width={210} />}
    />
  );

  return (
    <>
      {isMobile ? mobileLayout : (
      <div style={{ position: "relative", width: "100%", maxWidth: "100%", overflowX: "hidden", background: "#080808" }}>

        {/* ══════════ HERO ══════════ */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          {/* Ambient glow */}
          <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 700, background: `radial-gradient(ellipse, ${T(0.08)} 0%, transparent 60%)`, filter: "blur(70px)", pointerEvents: "none" }} />

          {/* Back link — fixed top */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: isMobile ? "20px 20px" : "28px 48px", zIndex: 10 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "0.02em" }}>
              <HiChevronLeft size={14} />
              Back to home
            </Link>
          </div>

          {/* Hero content */}
          <div style={{ ...wrap, paddingTop: isMobile ? 110 : 130, paddingBottom: 80, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 52 : 64, position: "relative", zIndex: 1 }}>

            {/* LEFT — text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}
              >
                <ElloMark size={1.1} />
                <div style={{ borderLeft: `1px solid ${T(0.2)}`, paddingLeft: 14 }}>
                  <Eyebrow />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 42 : 72, lineHeight: 1.0, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.95)", margin: "0 0 18px" }}
              >
                Ello Café
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.5, ease: EASE }}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.36)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 500 }}
              >
                A full-stack ed-tech ecosystem connecting students with verified instructors — one product across web and mobile, built solo from design to deployment.
              </motion.p>

              {/* Meta row */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}
              >
                {[
                  { label: "Role",  value: "Full-Stack Developer" },
                  { label: "Type",  value: "Web + Mobile"          },
                  { label: "Stack", value: "React · RN · Firebase"  },
                  { label: "Year",  value: "2024"                    },
                ].map(m => (
                  <div key={m.label} style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{m.value}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.4, ease: EASE }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
              >
                <motion.a
                  href="https://ellos-new-website.vercel.app/" target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, boxShadow: `0 0 36px ${T(0.55)}` }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 10, background: TEAL, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: "#080808", textDecoration: "none", letterSpacing: "0.01em" }}
                >
                  Visit Live Site <HiArrowUpRight size={14} />
                </motion.a>
                <motion.button
                  type="button"
                  onClick={() => document.getElementById("ello-web").scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ scale: 1.03, borderColor: T(0.4) }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 10, background: "transparent", border: `1px solid ${T(0.2)}`, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", cursor: "pointer", outline: "none", letterSpacing: "0.02em" }}
                >
                  View Showcase
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT — hero preview (desktop only) */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: 32, scale: 0.93 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.75, ease: EASE }}
                style={{ flexShrink: 0, width: 400, position: "relative" }}
              >
                {/* Browser preview */}
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.09)", boxShadow: `0 28px 56px rgba(0,0,0,0.65), 0 0 48px ${T(0.08)}` }}>
                  <div style={{ height: 30, display: "flex", alignItems: "center", padding: "0 10px", gap: 6, background: "rgba(0,0,0,0.75)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["#ef4444","#f59e0b","#22c55e"].map(c => <span key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
                  </div>
                  <img src={WEB_SCREENS[webIdx].src} alt="Ello" style={{ width: "100%", display: "block", objectFit: "contain", objectPosition: "top", background: "#0a0a0a", aspectRatio: "16/10" }} />
                </div>
                {/* Floating phone */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", bottom: -36, right: -24, filter: `drop-shadow(0 28px 44px rgba(0,0,0,0.75)) drop-shadow(0 0 32px ${T(0.2)})` }}
                >
                  <Phone screen={APP_SCREENS[appIdx]} dir={appDir} width={116} autoAdvanceDur={3.8} />
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
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ width: 1, height: 28, background: `linear-gradient(to bottom, ${T(0.5)}, transparent)` }} />
          </motion.div>
        </section>

        <Divider />

        {/* ══════════ STORY ══════════ */}
        <section style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp>
              <SectionLabel>Project Story</SectionLabel>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: "0 0 48px", lineHeight: 1.15 }}>
                From problem to product
              </h2>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
              {STORY.map((card, i) => (
                <FadeUp key={card.num} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -5, borderColor: T(0.3) }}
                    style={{
                      padding: "28px 24px", borderRadius: 14,
                      background: "rgba(255,255,255,0.025)",
                      border: `1px solid ${T(0.1)}`,
                      height: "100%", position: "relative", overflow: "hidden",
                      transition: "border-color 0.25s",
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${T(0.55)}, ${T(0.08)})` }} />
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 800, color: T(0.07), letterSpacing: "-0.04em", marginBottom: 18, lineHeight: 1 }}>{card.num}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: TEAL, opacity: 0.75, marginBottom: 10 }}>{card.label}</div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: isMobile ? 15 : 16, color: "rgba(255,255,255,0.88)", margin: "0 0 10px", lineHeight: 1.35 }}>{card.heading}</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.37)", lineHeight: 1.72, margin: 0 }}>{card.body}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ══════════ WEB SHOWCASE ══════════ */}
        <section id="ello-web" style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp>
              <SectionLabel>Web Platform</SectionLabel>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.15 }}>
                    The Website
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.32)", margin: "8px 0 0", maxWidth: 480 }}>
                    A React.js platform where students book sessions, track progress, and message instructors — with separate dashboards for teachers too.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.32)", letterSpacing: "0.04em" }}>
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

        {/* ══════════ APP SHOWCASE ══════════ */}
        <section style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp>
              <SectionLabel>Mobile App</SectionLabel>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: "0 0 52px", lineHeight: 1.15 }}>
                React Native · iOS &amp; Android
              </h2>
            </FadeUp>

            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 44 : 72 }}>

              {/* Feature list */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, order: isMobile ? 2 : 1 }}>
                {APP_HIGHLIGHTS.map((item, i) => (
                  <FadeUp key={item.label} delay={i * 0.07}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      onClick={() => { setAppDir(item.idx > appIdx ? 1 : -1); setAppIdx(item.idx); }}
                      style={{
                        display: "flex", gap: 14, cursor: "pointer",
                        padding: "16px 18px", borderRadius: 12,
                        background: appIdx === item.idx ? T(0.07) : "rgba(255,255,255,0.02)",
                        border: `1px solid ${appIdx === item.idx ? T(0.22) : "rgba(255,255,255,0.05)"}`,
                        transition: "background 0.25s, border-color 0.25s",
                      }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: T(0.1), border: `1px solid ${T(0.22)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, color: TEAL }}>{String(item.idx + 1).padStart(2, "0")}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: appIdx === item.idx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)", marginBottom: 4, transition: "color 0.25s" }}>{item.label}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.58 }}>{item.desc}</div>
                      </div>
                    </motion.div>
                  </FadeUp>
                ))}
              </div>

              {/* Phone */}
              <FadeUp delay={0.15} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", order: isMobile ? 1 : 2 }}>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
                  <Phone screen={APP_SCREENS[appIdx]} dir={appDir} width={isMobile ? 210 : 270} autoAdvanceDur={3.8} onClick={() => setLightbox("phone")} />
                </motion.div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28 }}>
                  <NavBtn dir={-1} onClick={() => stepApp(-1)} />
                  <Dots count={APP_SCREENS.length} current={appIdx} onChange={i => { setAppDir(i > appIdx ? 1 : -1); setAppIdx(i); }} />
                  <NavBtn dir={1}  onClick={() => stepApp(1)}  />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        <Divider />

        {/* ══════════ FEATURES ══════════ */}
        <section style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp style={{ marginBottom: 44 }}>
              <SectionLabel>Capabilities</SectionLabel>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.15 }}>
                What it does
              </h2>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
              {FEATURES.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -4, borderColor: T(0.25) }}
                    style={{
                      padding: isMobile ? "18px 14px" : "24px 20px", borderRadius: 12,
                      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
                      height: "100%", transition: "border-color 0.25s",
                    }}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: T(0.09), border: `1px solid ${T(0.18)}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 13, color: TEAL }}>✦</span>
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

        {/* ══════════ TECH STACK ══════════ */}
        <section style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp style={{ marginBottom: 44 }}>
              <SectionLabel>Architecture</SectionLabel>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.15 }}>
                Built with
              </h2>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
              {TECH.map((cat, i) => (
                <FadeUp key={cat.category} delay={i * 0.1}>
                  <div style={{ padding: "26px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid ${T(0.1)}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${T(0.55)}, transparent)` }} />
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: TEAL, opacity: 0.8, marginBottom: 18 }}>{cat.category}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {cat.items.map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, opacity: 0.55, flexShrink: 0 }} />
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

        {/* ══════════ CTA FOOTER ══════════ */}
        <section style={{ padding: isMobile ? "80px 0 110px" : "100px 0 130px" }}>
          <div style={{ ...wrap, textAlign: "center" }}>
            <FadeUp>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 28, height: 1, background: T(0.5) }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: TEAL, opacity: 0.8 }}>Live</span>
                <div style={{ width: 28, height: 1, background: T(0.5) }} />
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 46, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.92)", margin: "0 0 14px", lineHeight: 1.1 }}>
                See it in the wild
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.32)", margin: "0 auto 40px", maxWidth: 380, lineHeight: 1.7 }}>
                The full platform is live and running. Take a look at the real thing.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <motion.a
                  href="https://ellos-new-website.vercel.app/" target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, boxShadow: `0 0 44px ${T(0.58)}` }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px", borderRadius: 12, background: TEAL, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: "#080808", textDecoration: "none" }}
                >
                  Open Ello Café <HiArrowUpRight size={15} />
                </motion.a>
                <Link
                  to="/"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "14px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
                >
                  <HiChevronLeft size={13} /> Back to portfolio
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>

      </div>
      )}

      {/* ══════════ LIGHTBOX ══════════ */}
      <AnimatePresence>
        {lightbox && (
          <CaseStudyLightbox
            type={lightbox}
            screens={lightbox === "phone" ? APP_SCREENS : WEB_SCREENS}
            idx={lightbox === "phone" ? appIdx : webIdx}
            dir={lightbox === "phone" ? appDir : webDir}
            onStep={lightbox === "phone" ? stepApp : stepWeb}
            onJump={lightbox === "phone"
              ? i => { setAppDir(i > appIdx ? 1 : -1); setAppIdx(i); }
              : i => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }
            }
            onClose={() => setLightbox(null)}
            glowColor={T(0.07)}
            renderSlide={(screen, dims) => (
              lightbox === "phone"
                ? <Phone screen={screen} dir={appDir} width={dims.phoneW} />
                : <LandscapeWebImage screen={screen} dir={webDir} width={dims.webWidth} />
            )}
            renderFooter={screen => (
              <>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{screen.label}</span>
                <Dots
                  count={(lightbox === "phone" ? APP_SCREENS : WEB_SCREENS).length}
                  current={lightbox === "phone" ? appIdx : webIdx}
                  onChange={lightbox === "phone"
                    ? i => { setAppDir(i > appIdx ? 1 : -1); setAppIdx(i); }
                    : i => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }
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

export default ElloCafeCaseStudy;
