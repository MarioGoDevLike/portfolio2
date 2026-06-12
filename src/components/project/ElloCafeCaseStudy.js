import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiX } from "react-icons/hi";
import { HiArrowUpRight, HiArrowsPointingOut } from "react-icons/hi2";

/* ─── App screenshots ──────────────────────────────── */
import appWelcome from "../../assets/ello_app_images/unlogged page.png";
import appHome from "../../assets/ello_app_images/Home page.png";
import appSignUp from "../../assets/ello_app_images/sign up page.png";
import appCourse from "../../assets/ello_app_images/Course page.png";
import appInstructor from "../../assets/ello_app_images/instructor page.png";
import appSessions from "../../assets/ello_app_images/my sessions page.png";

/* ─── Website screenshots ──────────────────────────── */
import webHome from "../../assets/ello_website_images/home page.png";
import webTeachers from "../../assets/ello_website_images/teachers page.png";
import webCourses from "../../assets/ello_website_images/courses page.png";
import webProfile1 from "../../assets/ello_website_images/teacher profile 1.png";
import webProfile2 from "../../assets/ello_website_images/teacher profile 2.png";
import webBook from "../../assets/ello_website_images/book page.png";
import webStudentDash from "../../assets/ello_website_images/student dashboard.png";
import webTeacherDash from "../../assets/ello_website_images/teachers dashboard.png";
import webCourseDetail from "../../assets/ello_website_images/course details 1.png";

/* ─── Constants ────────────────────────────────────── */
const TEAL = "#5ECFB1";
const T = (a) => `rgba(94,207,177,${a})`;
const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 340, damping: 30 };

const APP_SCREENS = [
  { src: appWelcome, label: "Welcome" },
  { src: appHome, label: "Explore" },
  { src: appSignUp, label: "Join Ello" },
  { src: appCourse, label: "Course Detail" },
  { src: appInstructor, label: "Instructor" },
  { src: appSessions, label: "My Lessons" },
];

const WEB_SCREENS = [
  { src: webHome, label: "Homepage" },
  { src: webTeachers, label: "Teachers" },
  { src: webCourses, label: "Courses" },
  { src: webCourseDetail, label: "Course Detail" },
  { src: webProfile1, label: "Teacher Profile" },
  { src: webProfile2, label: "Profile Details" },
  { src: webBook, label: "Booking Flow" },
  { src: webStudentDash, label: "Student Dashboard" },
  { src: webTeacherDash, label: "Teacher Dashboard" },
];

const ALL_TECH = [
  { name: "React.js", note: "Web App" },
  { name: "React Native", note: "Mobile" },
  { name: "Firebase", note: "Backend" },
  { name: "Node.js", note: "API" },
  { name: "Stripe", note: "Payments" },
  { name: "Figma", note: "Design" },
];

const FEATURES = [
  "Verified instructor profiles with education & experience",
  "Multi-tier session booking with Stripe checkout",
  "Real-time messaging between students and instructors",
  "Student & teacher dashboards with session tracking",
  "Cross-platform React Native app for iOS and Android",
  "Dark mode checkout flow with pricing packages",
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "website", label: "Website" },
  { id: "app", label: "Mobile App" },
];

/* ─── Ello logo mark (CSS recreation of the stacked bars) ── */
const ElloMark = ({ size = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 * size, flexShrink: 0 }}>
    {[
      { w: 22 * size, bg: "#4EAAA0" },
      { w: 16 * size, bg: "#2C6B70" },
      { w: 22 * size, bg: "#7ECEC4" },
      { w: 14 * size, bg: "#4EAAA0" },
    ].map((bar, i) => (
      <motion.div
        key={i}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.25 + i * 0.06, duration: 0.32, ease: EASE }}
        style={{
          width: bar.w,
          height: 4 * size,
          borderRadius: 2,
          background: bar.bg,
          transformOrigin: "left",
        }}
      />
    ))}
  </div>
);

/* ─── Tab bar with sliding pill ────────────────────── */
const TabBar = ({ active, onChange, tabs = TABS }) => (
  <div
    style={{
      display: "flex",
      gap: 2,
      padding: 4,
      background: "rgba(255,255,255,0.04)",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          position: "relative",
          padding: "7px 15px",
          borderRadius: 7,
          border: "none",
          cursor: "pointer",
          background: "transparent",
          color: active === tab.id ? "white" : "rgba(255,255,255,0.38)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 12,
          fontWeight: 500,
          transition: "color 0.2s",
          outline: "none",
          zIndex: 1,
          whiteSpace: "nowrap",
        }}
      >
        {active === tab.id && (
          <motion.div
            layoutId="ello-tab-pill"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 7,
              background: T(0.12),
              border: `1px solid ${T(0.28)}`,
              zIndex: -1,
            }}
            transition={SPRING}
          />
        )}
        {tab.label}
      </button>
    ))}
  </div>
);

/* ─── Nav arrow button ─────────────────────────────── */
const NavArrow = ({ dir, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.12, background: "rgba(255,255,255,0.1)" }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.09)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "rgba(255,255,255,0.45)",
      outline: "none",
      flexShrink: 0,
      transition: "background 0.2s",
    }}
  >
    {dir === -1 ? <HiChevronLeft size={13} /> : <HiChevronRight size={13} />}
  </motion.button>
);

/* ─── Animated dot pills ───────────────────────────── */
const Dots = ({ count, current, onChange }) => (
  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.button
        key={i}
        onClick={() => onChange(i)}
        animate={{ width: current === i ? 16 : 5, background: current === i ? TEAL : "rgba(255,255,255,0.15)" }}
        transition={{ duration: 0.28, ease: EASE }}
        style={{
          height: 5,
          borderRadius: 3,
          border: "none",
          cursor: "pointer",
          padding: 0,
          flexShrink: 0,
          outline: "none",
        }}
      />
    ))}
  </div>
);

/* ─── Auto-advance progress bar ────────────────────── */
const ProgressBar = ({ duration, trackKey }) => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      background: "rgba(255,255,255,0.05)",
      overflow: "hidden",
      zIndex: 8,
    }}
  >
    <motion.div
      key={trackKey}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration, ease: "linear" }}
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(90deg, ${T(0.5)}, ${TEAL})`,
        transformOrigin: "left",
      }}
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: width * 0.19,
          background: "linear-gradient(160deg, #252525, #141414)",
          border: "1.5px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          boxShadow: [
            "0 35px 70px rgba(0,0,0,0.75)",
            `0 0 50px ${T(0.14)}`,
            "inset 0 1px 0 rgba(255,255,255,0.06)",
          ].join(", "),
        }}
      >
        <AnimatePresence custom={dir}>
          <motion.div
            key={screen.src}
            custom={dir}
            initial={{ x: dir * 28, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -dir * 28, opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE }}
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            <img
              src={screen.src}
              alt={screen.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                display: "block",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic island */}
        <div
          style={{
            position: "absolute",
            top: width * 0.056,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.38,
            height: width * 0.11,
            borderRadius: width * 0.06,
            background: "#111",
            zIndex: 10,
          }}
        />
        {/* Home bar */}
        <div
          style={{
            position: "absolute",
            bottom: 7,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.44,
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.2)",
            zIndex: 10,
          }}
        />
        {/* Inner shadow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            boxShadow: "inset 0 0 24px rgba(0,0,0,0.45)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
        {autoAdvanceDur && <ProgressBar duration={autoAdvanceDur} trackKey={screen.src} />}
      </div>

      {/* Side buttons */}
      {[
        { side: "right", top: "28%", h: 56 },
        { side: "left", top: "19%", h: 34 },
        { side: "left", top: "33%", h: 34 },
        { side: "left", top: "13%", h: 18 },
      ].map((btn, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            [btn.side]: -2,
            top: btn.top,
            width: 3,
            height: btn.h,
            borderRadius: btn.side === "right" ? "0 2px 2px 0" : "2px 0 0 2px",
            background: "#252525",
          }}
        />
      ))}

      {/* Glow puddle */}
      <div
        style={{
          position: "absolute",
          bottom: -18,
          left: "10%",
          right: "10%",
          height: 30,
          background: `radial-gradient(ellipse, ${T(0.28)}, transparent 70%)`,
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      {/* Expand overlay (hover on desktop, always-dim badge on touch) */}
      {onClick && (
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: width * 0.19,
            background: "rgba(0,0,0,0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 25,
            pointerEvents: "none",
          }}
        >
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.28)",
            backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white",
          }}>
            <HiArrowsPointingOut size={20} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ─── Browser mockup ───────────────────────────────── */
const BrowserMockup = ({ screen, dir, height = 240, autoAdvanceDur, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
  <div
    onClick={onClick}
    onMouseEnter={() => onClick && setHov(true)}
    onMouseLeave={() => setHov(false)}
    style={{
      position: "relative",
      width: "100%",
      borderRadius: 12,
      overflow: "hidden",
      background: "#0d0d0d",
      border: "1px solid rgba(255,255,255,0.07)",
      cursor: onClick ? "zoom-in" : "default",
      boxShadow: [
        "0 28px 60px rgba(0,0,0,0.6)",
        `0 0 45px ${T(0.1)}`,
        "inset 0 1px 0 rgba(255,255,255,0.04)",
      ].join(", "),
    }}
  >
    {/* Chrome bar */}
    <div
      style={{
        height: 36,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 10,
        background: "rgba(0,0,0,0.55)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", gap: 5 }}>
        {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
          <span
            key={c}
            style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }}
          />
        ))}
      </div>
      <div
        style={{
          flex: 1,
          height: 18,
          borderRadius: 5,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 8,
          gap: 5,
        }}
      >
        <span
          style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, flexShrink: 0 }}
        />
        <span
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
          }}
        >
          ellos-new-website.vercel.app
        </span>
      </div>
    </div>

    {/* Screenshot */}
    <div style={{ position: "relative", overflow: "hidden", height }}>
      <AnimatePresence custom={dir}>
        <motion.div
          key={screen.src}
          custom={dir}
          initial={{ x: dir * 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -dir * 40, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ position: "absolute", inset: 0 }}
        >
          <img
            src={screen.src}
            alt={screen.label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              display: "block",
            }}
          />
        </motion.div>
      </AnimatePresence>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 52,
          background: "linear-gradient(to top, #0d0d0d, transparent)",
          pointerEvents: "none",
        }}
      />
      {autoAdvanceDur && <ProgressBar duration={autoAdvanceDur} trackKey={screen.src} />}
    </div>

    {/* Expand overlay */}
    {onClick && (
      <motion.div
        animate={{ opacity: hov ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.32)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 25,
          pointerEvents: "none",
        }}
      >
        <div style={{
          width: 50, height: 50, borderRadius: "50%",
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.28)",
          backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white",
        }}>
          <HiArrowsPointingOut size={22} />
        </div>
      </motion.div>
    )}
  </div>
  );
};

/* ─── Thumbnail grid ───────────────────────────────── */
const ThumbnailGrid = ({ screens, current, onChange, aspectRatio = "16/10", cols }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols || Math.min(screens.length, 9)}, 1fr)`,
      gap: 6,
    }}
  >
    {screens.map((s, i) => (
      <motion.button
        key={i}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(i)}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: aspectRatio === "9/18" ? 6 : 5,
          cursor: "pointer",
          padding: 0,
          border: "none",
          outline: current === i ? `2px solid ${TEAL}` : "2px solid transparent",
          outlineOffset: 1,
          aspectRatio,
          transition: "outline-color 0.2s",
        }}
      >
        <img
          src={s.src}
          alt={s.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: current === i ? T(0.18) : "rgba(0,0,0,0.28)",
            transition: "background 0.2s",
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: 3,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 7,
            letterSpacing: "0.04em",
            color: current === i ? TEAL : "rgba(255,255,255,0.4)",
            fontWeight: 500,
            padding: "0 2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {s.label}
        </span>
      </motion.button>
    ))}
  </div>
);

/* ─── Shared section label ─────────────────────────── */
const SectionLabel = ({ children, color = TEAL }) => (
  <span
    style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 10,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color,
      opacity: 0.85,
    }}
  >
    {children}
  </span>
);

/* ─── Tech pill ────────────────────────────────────── */
const TechPill = ({ name, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.24, ease: EASE }}
    style={{
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 10,
      letterSpacing: "0.06em",
      padding: "4px 11px",
      borderRadius: 999,
      background: T(0.08),
      border: `1px solid ${T(0.2)}`,
      color: TEAL,
      whiteSpace: "nowrap",
    }}
  >
    {name}
  </motion.span>
);

/* ─── Live site button ─────────────────────────────── */
const LiveButton = ({ label = "Visit Live Site" }) => (
  <motion.a
    href="https://ellos-new-website.vercel.app/"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${T(0.45)}` }}
    whileTap={{ scale: 0.97 }}
    style={{  
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "9px 18px",
      borderRadius: 9,
      background: TEAL,
      color: "#071410",
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 12,
      fontWeight: 700,
      textDecoration: "none",
      boxShadow: `0 0 20px ${T(0.28)}`,
      letterSpacing: "0.03em",
      flexShrink: 0,
      transition: "box-shadow 0.3s",
    }}
  >
    {label}
    <HiArrowUpRight size={13} />
  </motion.a>
);

/* ─── Fullscreen Lightbox ──────────────────────────── */
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

  const lbPhoneW = Math.min(Math.round((window.innerHeight * 0.78) / 2.08), 360);
  const lbBrowserH = Math.min(Math.round(window.innerHeight * 0.68), 560);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10002,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.97)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        padding: "64px 24px 28px",
        gap: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "42%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 700, height: 500,
        background: `radial-gradient(ellipse, ${T(0.07)} 0%, transparent 65%)`,
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      {/* Counter top-left */}
      <div style={{
        position: "absolute", top: 22, left: 24,
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 12, letterSpacing: "0.1em",
        color: "rgba(255,255,255,0.22)",
      }}>
        {idx + 1} / {screens.length}
      </div>

      {/* Close top-right */}
      <motion.button
        whileHover={{ scale: 1.08, background: "rgba(255,255,255,0.12)" }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16,
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "rgba(255,255,255,0.65)", outline: "none", zIndex: 10,
        }}
      >
        <HiX size={18} />
      </motion.button>

      {/* Device + nav row */}
      <div style={{
        display: "flex", alignItems: "center",
        gap: type === "phone" ? 28 : 20,
        width: "100%", justifyContent: "center",
        flex: 1, minHeight: 0,
      }}>
        <motion.button
          whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.1)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onStep(-1)}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "rgba(255,255,255,0.55)", outline: "none", flexShrink: 0,
          }}
        >
          <HiChevronLeft size={22} />
        </motion.button>

        <motion.div
          key={screen.src}
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          style={type !== "phone" ? { width: "min(88vw, 1000px)", flexShrink: 0 } : {}}
        >
          {type === "phone" ? (
            <PhoneMockup screen={screen} dir={dir} width={lbPhoneW} />
          ) : (
            <BrowserMockup screen={screen} dir={dir} height={lbBrowserH} />
          )}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.1)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onStep(1)}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "rgba(255,255,255,0.55)", outline: "none", flexShrink: 0,
          }}
        >
          <HiChevronRight size={22} />
        </motion.button>
      </div>

      {/* Label + dots */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 13, color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.04em",
        }}>
          {screen.label}
        </span>
        <Dots count={screens.length} current={idx} onChange={onJump} />
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   CASE STUDY (page content)
═══════════════════════════════════════════════════════ */
const ElloCafeCaseStudy = () => {
  const [tab, setTab] = useState(() => (window.innerWidth < 640 ? "website" : "overview"));
  const [appIdx, setAppIdx] = useState(0);
  const [webIdx, setWebIdx] = useState(0);
  const [appDir, setAppDir] = useState(1);
  const [webDir, setWebDir] = useState(1);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [lightbox, setLightbox] = useState(null); // null | "phone" | "web"

  const containerRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 16 });
  const smy = useSpring(my, { stiffness: 55, damping: 16 });

  const phoneRotX = useTransform(smy, [-0.5, 0.5], [7, -7]);
  const phoneRotY = useTransform(smx, [-0.5, 0.5], [-9, 9]);
  const browserRotX = useTransform(smy, [-0.5, 0.5], [4, -4]);
  const browserRotY = useTransform(smx, [-0.5, 0.5], [6, -6]);

  const handleMouse = useCallback(
    (e) => {
      const el = containerRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      mx.set((e.clientX - left) / width - 0.5);
      my.set((e.clientY - top) / height - 0.5);
    },
    [mx, my]
  );
  const resetMouse = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const stepApp = useCallback(
    (dir) => {
      setAppDir(dir);
      setAppIdx((i) => (i + dir + APP_SCREENS.length) % APP_SCREENS.length);
    },
    []
  );
  const stepWeb = useCallback(
    (dir) => {
      setWebDir(dir);
      setWebIdx((i) => (i + dir + WEB_SCREENS.length) % WEB_SCREENS.length);
    },
    []
  );

  /* Auto-advance */
  useEffect(() => {
    const a = setInterval(() => stepApp(1), 3800);
    const w = setInterval(() => stepWeb(1), 4500);
    return () => { clearInterval(a); clearInterval(w); };
  }, [stepApp, stepWeb]);

  /* Responsive breakpoint tracker */
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const visibleTabs = isMobile ? TABS.filter((t) => t.id !== "overview") : TABS;

  /* Overview is desktop-only — fall back when entering mobile */
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
      {/* Ambient teal radial glow */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 900,
          height: 600,
          background: `radial-gradient(ellipse, ${T(0.07)} 0%, transparent 65%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Page content panel ── */}
      <div
        ref={containerRef}
        onMouseMove={isMobile ? undefined : handleMouse}
        onMouseLeave={isMobile ? undefined : resetMouse}
        style={{
          position: "relative",
          width: "100%",
          overflowX: "hidden",
        }}
      >

        {/* ── Sticky header ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            padding: isMobile ? "12px 16px 10px" : "14px 24px 12px",
            background: "rgba(9,9,11,0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Link
            to="/"
            className="projects-page__back"
            style={{ marginBottom: isMobile ? 10 : 12 }}
          >
            <HiChevronLeft size={16} />
            Back to home
          </Link>

          {/* Row 1: Logo + tabs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ElloMark size={isMobile ? 0.85 : 1} />
              <div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: isMobile ? 14 : 16,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1.1,
                  }}
                >
                  Ello Café
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    color: TEAL,
                    marginTop: 2,
                    letterSpacing: "0.04em",
                  }}
                >
                  Ed-tech learning platform
                </div>
              </div>
            </div>

            {/* Tabs inline on desktop only */}
            {!isMobile && <TabBar active={tab} onChange={setTab} tabs={visibleTabs} />}
          </div>

          {/* Row 2 (mobile only): Tabs full-width */}
          {isMobile && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <TabBar active={tab} onChange={setTab} tabs={visibleTabs} />
            </div>
          )}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">

          {/* ════════════════ OVERVIEW ════════════════ */}
          {tab === "overview" && !isMobile && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ padding: isMobile ? "20px 16px 24px" : "28px 28px 32px" }}
            >
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.38, ease: EASE }}
                style={{ marginBottom: isMobile ? 20 : 28 }}
              >
                <SectionLabel>Case Study · 2024</SectionLabel>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: isMobile ? 12.5 : 13.5,
                    color: "rgba(255,255,255,0.38)",
                    lineHeight: 1.75,
                    marginTop: 8,
                    maxWidth: 640,
                  }}
                >
                  A full-stack ed-tech ecosystem connecting students with verified instructors.
                  Built solo — one cohesive product across web and mobile: a React.js web platform
                  with dual dashboards, and a React Native app for iOS and Android.
                </p>
              </motion.div>

              {/* ── Dual mockup row (desktop) / stacked (mobile) ── */}
              <div
                style={isMobile ? {
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  marginBottom: 24,
                } : {
                  display: "grid",
                  gridTemplateColumns: "1fr 1px auto",
                  gap: "0 20px",
                  alignItems: "start",
                  marginBottom: 32,
                  perspective: 1400,
                }}
              >
                {/* MOBILE APP first on mobile, second on desktop */}
                {isMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14, duration: 0.45, ease: EASE }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 10 }}>
                      <div>
                        <SectionLabel color="rgba(255,255,255,0.3)">Mobile App</SectionLabel>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.18)", marginTop: 2, letterSpacing: "0.12em", textTransform: "uppercase" }}>React Native · iOS &amp; Android</div>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <NavArrow dir={-1} onClick={() => stepApp(-1)} />
                        <NavArrow dir={1} onClick={() => stepApp(1)} />
                      </div>
                    </div>
                    <PhoneMockup screen={APP_SCREENS[appIdx]} dir={appDir} width={160} autoAdvanceDur={3.8} onClick={() => setLightbox("phone")} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, width: "100%", gap: 8 }}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{APP_SCREENS[appIdx].label}</span>
                      <Dots count={APP_SCREENS.length} current={appIdx} onChange={(i) => { setAppDir(i > appIdx ? 1 : -1); setAppIdx(i); }} />
                    </div>
                  </motion.div>
                )}

                {/* Horizontal divider on mobile */}
                {isMobile && (
                  <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />
                )}

                {/* WEBSITE column */}
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.5, ease: EASE }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <SectionLabel color="rgba(255,255,255,0.3)">Website</SectionLabel>
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 9,
                          color: "rgba(255,255,255,0.18)",
                          marginTop: 2,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        React.js
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <NavArrow dir={-1} onClick={() => stepWeb(-1)} />
                      <NavArrow dir={1} onClick={() => stepWeb(1)} />
                    </div>
                  </div>

                  <motion.div
                    animate={isMobile ? {} : { y: [0, -5, 0] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.div
                      style={isMobile ? {} : {
                        rotateX: browserRotX,
                        rotateY: browserRotY,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <BrowserMockup
                        screen={WEB_SCREENS[webIdx]}
                        dir={webDir}
                        height={isMobile ? 180 : 236}
                        autoAdvanceDur={4.5}
                        onClick={() => setLightbox("web")}
                      />
                    </motion.div>
                  </motion.div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 10,
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {WEB_SCREENS[webIdx].label}
                    </span>
                    <Dots
                      count={WEB_SCREENS.length}
                      current={webIdx}
                      onChange={(i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }}
                    />
                  </div>
                </motion.div>

                {/* Vertical divider (desktop only) */}
                {!isMobile && (
                  <div
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)",
                      alignSelf: "stretch",
                    }}
                  />
                )}

                {/* MOBILE APP column (desktop only) */}
                {!isMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.5, ease: EASE }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 210 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        marginBottom: 10,
                      }}
                    >
                      <div>
                        <SectionLabel color="rgba(255,255,255,0.3)">Mobile App</SectionLabel>
                        <div
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 9,
                            color: "rgba(255,255,255,0.18)",
                            marginTop: 2,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                          }}
                        >
                          React Native · iOS &amp; Android
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <NavArrow dir={-1} onClick={() => stepApp(-1)} />
                        <NavArrow dir={1} onClick={() => stepApp(1)} />
                      </div>
                    </div>

                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    >
                      <motion.div
                        style={{
                          rotateX: phoneRotX,
                          rotateY: phoneRotY,
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <PhoneMockup
                          screen={APP_SCREENS[appIdx]}
                          dir={appDir}
                          width={190}
                          autoAdvanceDur={3.8}
                          onClick={() => setLightbox("phone")}
                        />
                      </motion.div>
                    </motion.div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 10,
                        width: "100%",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 11,
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        {APP_SCREENS[appIdx].label}
                      </span>
                      <Dots
                        count={APP_SCREENS.length}
                        current={appIdx}
                        onChange={(i) => { setAppDir(i > appIdx ? 1 : -1); setAppIdx(i); }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ── Features ── */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.4, ease: EASE }}
                style={{ marginBottom: 24 }}
              >
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.22)",
                    marginBottom: 12,
                  }}
                >
                  Key Features
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                    gap: "8px 16px",
                  }}
                >
                  {FEATURES.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.42 + i * 0.06, duration: 0.3, ease: EASE }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.42)",
                        lineHeight: 1.55,
                      }}
                    >
                      <span style={{ color: TEAL, flexShrink: 0, marginTop: 1, fontSize: 9 }}>▸</span>
                      {f}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── Tech + meta + CTA ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.38, ease: EASE }}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "stretch" : "center",
                  justifyContent: "space-between",
                  gap: isMobile ? 12 : 14,
                  paddingTop: 18,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {ALL_TECH.map((t, i) => (
                    <TechPill key={t.name} name={t.name} delay={0.56 + i * 0.04} />
                  ))}
                </div>
                <div style={{
                  display: "flex",
                  alignItems: isMobile ? "center" : "center",
                  justifyContent: isMobile ? "space-between" : "flex-end",
                  gap: 14,
                }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.18)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Solo Project · 2024
                  </span>
                  <LiveButton />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ════════════════ WEBSITE ════════════════ */}
          {tab === "website" && (
            <motion.div
              key="website"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ padding: isMobile ? "20px 16px 24px" : "28px 28px 32px" }}
            >
              <div style={{ marginBottom: isMobile ? 16 : 22 }}>
                <SectionLabel>React.js</SectionLabel>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: isMobile ? 18 : 22,
                    color: "rgba(255,255,255,0.9)",
                    margin: "7px 0 8px",
                    lineHeight: 1.2,
                  }}
                >
                  The Web Platform
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: isMobile ? 12.5 : 13,
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.75,
                    maxWidth: 580,
                  }}
                >
                  A React.js web platform where students book sessions, track progress,
                  and message instructors. Teachers manage courses, availability,
                  and student interactions — all in one place.
                </p>
              </div>

              {/* Browser mockup + nav */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.38)",
                    }}
                  >
                    {WEB_SCREENS[webIdx].label}
                  </span>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <NavArrow dir={-1} onClick={() => stepWeb(-1)} />
                    <NavArrow dir={1} onClick={() => stepWeb(1)} />
                  </div>
                </div>
                <BrowserMockup screen={WEB_SCREENS[webIdx]} dir={webDir} height={isMobile ? 200 : 330} onClick={() => setLightbox("web")} />
                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                  <Dots
                    count={WEB_SCREENS.length}
                    current={webIdx}
                    onChange={(i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }}
                  />
                </div>
              </div>

              {/* Thumbnail grid — desktop only */}
              {!isMobile && (
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 10,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.2)",
                      marginBottom: 10,
                    }}
                  >
                    All Screens
                  </div>
                  <ThumbnailGrid
                    screens={WEB_SCREENS}
                    current={webIdx}
                    onChange={(i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }}
                    aspectRatio="16/10"
                    cols={Math.min(WEB_SCREENS.length, 9)}
                  />
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "stretch" : "center",
                  justifyContent: "space-between",
                  gap: isMobile ? 12 : 12,
                }}
              >
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["React.js", "Node.js", "Tailwind", "Stripe", "REST API"].map((t, i) => (
                    <TechPill key={t} name={t} delay={i * 0.04} />
                  ))}
                </div>
                <LiveButton label="Open Website" />
              </div>
            </motion.div>
          )}

          {/* ════════════════ MOBILE APP ════════════════ */}
          {tab === "app" && (
            <motion.div
              key="app"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{ padding: isMobile ? "20px 16px 24px" : "28px 28px 32px" }}
            >
              <div style={{ marginBottom: isMobile ? 16 : 22 }}>
                <SectionLabel>React Native · Firebase</SectionLabel>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: isMobile ? 18 : 22,
                    color: "rgba(255,255,255,0.9)",
                    margin: "7px 0 8px",
                    lineHeight: 1.2,
                  }}
                >
                  The Mobile App
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: isMobile ? 12.5 : 13,
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.75,
                    maxWidth: 580,
                  }}
                >
                  A cross-platform React Native app built for both students and instructors.
                  Features onboarding, course discovery, instructor profiles,
                  real-time messaging, session booking, and progress tracking —
                  shipping natively on iOS and Android.
                </p>
              </div>

              {/* Centered phone + arrows */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: isMobile ? 20 : 28,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 16 : 28 }}>
                  <NavArrow dir={-1} onClick={() => stepApp(-1)} />
                  <motion.div
                    animate={isMobile ? {} : { y: [0, -6, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ perspective: 1200 }}
                  >
                    <motion.div
                      style={isMobile ? {} : {
                        rotateX: phoneRotX,
                        rotateY: phoneRotY,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <PhoneMockup
                        screen={APP_SCREENS[appIdx]}
                        dir={appDir}
                        width={isMobile ? 190 : 230}
                        autoAdvanceDur={3.8}
                        onClick={() => setLightbox("phone")}
                      />
                    </motion.div>
                  </motion.div>
                  <NavArrow dir={1} onClick={() => stepApp(1)} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {APP_SCREENS[appIdx].label}
                  </span>
                  <Dots
                    count={APP_SCREENS.length}
                    current={appIdx}
                    onChange={(i) => { setAppDir(i > appIdx ? 1 : -1); setAppIdx(i); }}
                  />
                </div>
              </div>

              {/* Thumbnail strip — desktop only */}
              {!isMobile && (
                <div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 10,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.2)",
                      marginBottom: 10,
                    }}
                  >
                    All Screens
                  </div>
                  <ThumbnailGrid
                    screens={APP_SCREENS}
                    current={appIdx}
                    onChange={(i) => { setAppDir(i > appIdx ? 1 : -1); setAppIdx(i); }}
                    aspectRatio="9/18"
                    cols={Math.min(APP_SCREENS.length, 6)}
                  />
                </div>
              )}

              {/* Footer */}
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["React Native", "Firebase", "Figma", "REST API"].map((t, i) => (
                    <TechPill key={t} name={t} delay={i * 0.04} />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.04em",
                  }}
                >
                  iOS &amp; Android
                </span>
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
          screens={lightbox === "phone" ? APP_SCREENS : WEB_SCREENS}
          idx={lightbox === "phone" ? appIdx : webIdx}
          dir={lightbox === "phone" ? appDir : webDir}
          onStep={lightbox === "phone" ? stepApp : stepWeb}
          onJump={lightbox === "phone"
            ? (i) => { setAppDir(i > appIdx ? 1 : -1); setAppIdx(i); }
            : (i) => { setWebDir(i > webIdx ? 1 : -1); setWebIdx(i); }
          }
          onClose={() => setLightbox(null)}
        />
      )}
    </AnimatePresence>
    </>
  );
};

export default ElloCafeCaseStudy;
