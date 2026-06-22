import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiX } from "react-icons/hi";
import { HiArrowUpRight, HiArrowsPointingOut } from "react-icons/hi2";
import { getLightboxDims } from "./CaseStudyLightbox";

import alterWebVideo from "../../assets/alter_images/alter_web_view.mp4";
import alterMobileVideo from "../../assets/alter_images/alter_mobile_view.mp4";
import alterLogo from "../../assets/alter_images/alter logo white .png";

const LIVE_URL = "https://altercoms.vercel.app/";

const CHROMELESS_VIDEO_PROPS = {
  autoPlay: true,
  loop: true,
  muted: true,
  playsInline: true,
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  controls: false,
  controlsList: "nodownload noplaybackrate noremoteplayback nofullscreen",
  onContextMenu: (e) => e.preventDefault(),
};

const useChromelessVideo = (videoRef, src) => {
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const keepPlaying = () => {
      if (v.paused) v.play().catch(() => {});
    };

    v.play().catch(() => {});
    v.addEventListener("pause", keepPlaying);
    return () => v.removeEventListener("pause", keepPlaying);
  }, [videoRef, src]);
};

const ChromelessVideo = ({ videoRef, src, style, className = "alter-case-study-video" }) => (
  <video
    ref={videoRef}
    src={src}
    className={className}
    {...CHROMELESS_VIDEO_PROPS}
    style={{ pointerEvents: "none", ...style }}
  />
);

/* ─── Brand palette (luxury PR — white + champagne gold) ── */
const GOLD = "#C4A574";
const G = (a) => `rgba(196,165,116,${a})`;
const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 340, damping: 30 };

const ALL_TECH = [
  { name: "React.js" },
  { name: "JavaScript" },
  { name: "CSS3" },
  { name: "Vercel" },
  { name: "Responsive" },
  { name: "Figma" },
];

const FEATURES = [
  "Cinematic hero with live agency stats — 1,651+ campaigns, 330+ artists",
  "Scrolling artist roster with premium marquee presentation",
  "Influencer network showcase with talent cards and social proof",
  "Six service pillars — digital growth, influencer marketing, content, music, PR, branding",
  "Trusted partners & brands section with polished logo wall",
  "Fully responsive layout — desktop spectacle, mobile-first refinement",
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "website", label: "Website" },
  { id: "mobile", label: "Mobile View" },
];

const AlterMark = ({ size = 1 }) => (
  <motion.img
    src={alterLogo}
    alt="Alter"
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.2, duration: 0.35, ease: EASE }}
    style={{
      height: 28 * size,
      width: "auto",
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
            layoutId="alter-tab-pill"
            style={{ position: "absolute", inset: 0, borderRadius: 7, background: G(0.12), border: `1px solid ${G(0.28)}`, zIndex: -1 }}
            transition={SPRING}
          />
        )}
        {tab.label}
      </button>
    ))}
  </div>
);

const SectionLabel = ({ children, color = GOLD }) => (
  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color, opacity: 0.85 }}>
    {children}
  </span>
);

const TechPill = ({ name, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.24, ease: EASE }}
    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.06em", padding: "4px 11px", borderRadius: 999, background: G(0.08), border: `1px solid ${G(0.2)}`, color: GOLD, whiteSpace: "nowrap" }}
  >
    {name}
  </motion.span>
);

const LiveButton = () => (
  <motion.a
    href={LIVE_URL}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${G(0.45)}` }}
    whileTap={{ scale: 0.97 }}
    style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px",
      borderRadius: 9, background: GOLD, color: "#1a1408",
      fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700,
      textDecoration: "none", boxShadow: `0 0 20px ${G(0.28)}`, letterSpacing: "0.03em",
      flexShrink: 0,
    }}
  >
    Visit Live Site
    <HiArrowUpRight size={13} />
  </motion.a>
);

const VideoBrowserMockup = ({ src, onClick, height }) => {
  const [hov, setHov] = useState(false);
  const videoRef = useRef(null);

  useChromelessVideo(videoRef, src);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", width: "100%", borderRadius: 12, overflow: "hidden",
        background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)",
        cursor: onClick ? "zoom-in" : "default",
        boxShadow: ["0 28px 60px rgba(0,0,0,0.6)", `0 0 45px ${G(0.1)}`, "inset 0 1px 0 rgba(255,255,255,0.04)"].join(", "),
      }}
    >
      <div style={{ height: 36, display: "flex", alignItems: "center", padding: "0 12px", gap: 10, background: "rgba(0,0,0,0.55)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 18, borderRadius: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 8, gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", whiteSpace: "nowrap" }}>altercoms.vercel.app</span>
        </div>
      </div>
      <div style={{ position: "relative", overflow: "hidden", width: "100%", ...(height ? { height } : { aspectRatio: "16 / 9" }) }}>
        <ChromelessVideo
          videoRef={videoRef}
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "top center", display: "block", background: "#0a0a0a" }}
        />
      </div>
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

const VideoPhoneMockup = ({ src, onClick, width = 200 }) => {
  const h = Math.round(width * 2.08);
  const [hov, setHov] = useState(false);
  const videoRef = useRef(null);

  useChromelessVideo(videoRef, src);

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
        boxShadow: ["0 35px 70px rgba(0,0,0,0.75)", `0 0 50px ${G(0.14)}`, "inset 0 1px 0 rgba(255,255,255,0.06)"].join(", "),
      }}>
        <ChromelessVideo
          videoRef={videoRef}
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
        />
        <div style={{ position: "absolute", top: width * 0.056, left: "50%", transform: "translateX(-50%)", width: width * 0.38, height: width * 0.11, borderRadius: width * 0.06, background: "#111", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: width * 0.44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", zIndex: 10 }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: "inset 0 0 24px rgba(0,0,0,0.45)", pointerEvents: "none", zIndex: 5 }} />
      </div>
      {[{ side: "right", top: "28%", h: 56 }, { side: "left", top: "19%", h: 34 }, { side: "left", top: "33%", h: 34 }, { side: "left", top: "13%", h: 18 }].map((btn, i) => (
        <div key={i} style={{ position: "absolute", [btn.side]: -2, top: btn.top, width: 3, height: btn.h, borderRadius: btn.side === "right" ? "0 2px 2px 0" : "2px 0 0 2px", background: "#252525" }} />
      ))}
      <div style={{ position: "absolute", bottom: -18, left: "10%", right: "10%", height: 30, background: `radial-gradient(ellipse, ${G(0.28)}, transparent 70%)`, filter: "blur(10px)", pointerEvents: "none" }} />
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

const VideoLightbox = ({ type, onClose }) => {
  const src = type === "phone" ? alterMobileVideo : alterWebVideo;
  const videoRef = useRef(null);
  const [vp, setVp] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
    portrait: window.innerHeight > window.innerWidth,
    mobile: window.innerWidth < 640,
  }));

  useEffect(() => {
    const fn = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight,
      portrait: window.innerHeight > window.innerWidth,
      mobile: window.innerWidth < 640,
    });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const dims = getLightboxDims(type === "phone" ? "phone" : "web", vp);
  const isWebLandscape = type === "web" && dims.webRotateLandscape;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useChromelessVideo(videoRef, src);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{ position: "fixed", inset: 0, zIndex: 10002, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.97)", backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", padding: vp.mobile ? "52px 12px 20px" : "64px 24px 28px", gap: 16, overflow: "hidden" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", width: Math.min(vp.w, 700), height: 500, background: `radial-gradient(ellipse, ${G(0.07)} 0%, transparent 65%)`, filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: vp.mobile ? 16 : 22, left: vp.mobile ? 16 : 24, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.22)" }}>
        {type === "phone" ? "Mobile View" : "Website"}
      </div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.08, background: "rgba(255,255,255,0.12)" }} whileTap={{ scale: 0.9 }} onClick={onClose}
        aria-label="Close"
        style={{ position: "absolute", top: vp.mobile ? 12 : 16, right: vp.mobile ? 12 : 16, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.65)", outline: "none", zIndex: 10 }}
      >
        <HiX size={18} />
      </motion.button>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", minHeight: 0 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          style={{
            transform: isWebLandscape ? "rotate(90deg)" : undefined,
            transformOrigin: "center center",
            flexShrink: 0,
          }}
        >
          {type === "phone" ? (
            <div style={{ width: dims.phoneW, height: Math.round(dims.phoneW * 2.08), borderRadius: dims.phoneW * 0.19, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.1)", boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 60px ${G(0.15)}` }}>
              <ChromelessVideo
                videoRef={videoRef}
                src={src}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
            </div>
          ) : (
            <div style={{
              width: dims.webWidth,
              aspectRatio: "16 / 9",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 60px ${G(0.12)}`,
              background: "#0a0a0a",
            }}
            >
              <ChromelessVideo
                videoRef={videoRef}
                src={src}
                style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "top center", background: "#0a0a0a" }}
              />
            </div>
          )}
        </motion.div>
      </div>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>
        {type === "phone" ? "Mobile experience" : "Desktop experience"}
      </span>
    </motion.div>
  );
};

const AlterCaseStudy = () => {
  const [tab, setTab] = useState(() => (window.innerWidth < 640 ? "website" : "overview"));
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [lightbox, setLightbox] = useState(null);

  const containerRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 16 });
  const smy = useSpring(my, { stiffness: 55, damping: 16 });
  const browserRotX = useTransform(smy, [-0.5, 0.5], [4, -4]);
  const browserRotY = useTransform(smx, [-0.5, 0.5], [6, -6]);
  const phoneRotX = useTransform(smy, [-0.5, 0.5], [7, -7]);
  const phoneRotY = useTransform(smx, [-0.5, 0.5], [-9, 9]);

  const handleMouse = useCallback((e) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mx.set((e.clientX - left) / width - 0.5);
    my.set((e.clientY - top) / height - 0.5);
  }, [mx, my]);

  const resetMouse = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

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
        style={{ position: "relative", width: "100%", maxWidth: "100%", overflowX: "hidden" }}
      >
        {!isMobile && (
        <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, background: `radial-gradient(ellipse, ${G(0.07)} 0%, transparent 65%)`, filter: "blur(50px)", pointerEvents: "none" }} />
        )}

        <div
          ref={containerRef}
          onMouseMove={isMobile ? undefined : handleMouse}
          onMouseLeave={isMobile ? undefined : resetMouse}
          style={{ position: "relative", width: "100%", maxWidth: "100%", overflowX: "hidden" }}
        >
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
                <AlterMark size={isMobile ? 0.85 : 1} />
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 14 : 16, color: "rgba(255,255,255,0.9)", lineHeight: 1.1 }}>
                    Alter
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: GOLD, marginTop: 2, letterSpacing: "0.04em" }}>
                    PR &amp; Marketing Agency · MENA
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

            {tab === "overview" && !isMobile && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE }}
                style={{ padding: "28px 28px 32px" }}
              >
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.38, ease: EASE }} style={{ marginBottom: 28 }}>
                  <SectionLabel>Case Study · React.js</SectionLabel>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.75, marginTop: 8, maxWidth: 680 }}>
                    A premium digital presence for Alter — a PR &amp; marketing agency empowering artists,
                    brands, and creators across the MENA region. Built in React.js with cinematic scroll
                    experiences, live campaign statistics, a marquee artist roster, influencer showcases,
                    and a fully responsive layout that scales from desktop spectacle to mobile elegance.
                  </p>
                </motion.div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1px auto", gap: "0 20px", alignItems: "start", marginBottom: 32, perspective: 1400 }}>
                  <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5, ease: EASE }}>
                    <div style={{ marginBottom: 10 }}>
                      <SectionLabel color="rgba(255,255,255,0.3)">Website</SectionLabel>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.18)", marginTop: 2, letterSpacing: "0.12em", textTransform: "uppercase" }}>React.js · Desktop</div>
                    </div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>
                      <motion.div style={{ rotateX: browserRotX, rotateY: browserRotY, transformStyle: "preserve-3d" }}>
                        <VideoBrowserMockup src={alterWebVideo} onClick={() => setLightbox("web")} />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <div style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent 100%)", alignSelf: "stretch" }} />

                  <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.5, ease: EASE }} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 210 }}>
                    <div style={{ width: "100%", marginBottom: 10 }}>
                      <SectionLabel color="rgba(255,255,255,0.3)">Mobile View</SectionLabel>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.18)", marginTop: 2, letterSpacing: "0.12em", textTransform: "uppercase" }}>Responsive · React.js</div>
                    </div>
                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}>
                      <motion.div style={{ rotateX: phoneRotX, rotateY: phoneRotY, transformStyle: "preserve-3d" }}>
                        <VideoPhoneMockup src={alterMobileVideo} width={190} onClick={() => setLightbox("phone")} />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.4, ease: EASE }} style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", marginBottom: 12 }}>Key Features</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 20px" }}>
                    {FEATURES.map((f, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 + i * 0.06, duration: 0.3, ease: EASE }}
                        style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.55 }}>
                        <span style={{ color: GOLD, flexShrink: 0, marginTop: 1, fontSize: 9 }}>▸</span>
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
                  <LiveButton />
                </motion.div>
              </motion.div>
            )}

            {tab === "website" && (
              <motion.div
                key="website"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE }}
                style={{ padding: isMobile ? "20px 16px 24px" : "28px 28px 32px" }}
              >
                <div style={{ marginBottom: isMobile ? 16 : 22 }}>
                  <SectionLabel>React.js · Vercel</SectionLabel>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: "rgba(255,255,255,0.9)", margin: "7px 0 8px", lineHeight: 1.2 }}>
                    The Website
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 12.5 : 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.75, maxWidth: 580 }}>
                    The desktop experience opens with a bold hero and live agency metrics — campaigns run,
                    artists represented, influencers in network. Scroll reveals a marquee artist roster,
                    influencer talent cards, six core service pillars, and a trusted partners wall.
                    Every section is crafted to communicate scale, prestige, and creative authority.
                  </p>
                </div>
                <div style={{ maxWidth: "100%", overflow: "hidden" }}>
                <VideoBrowserMockup src={alterWebVideo} onClick={() => setLightbox("web")} />
                </div>
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["React.js", "JavaScript", "CSS3", "Vercel"].map((t, i) => <TechPill key={t} name={t} delay={i * 0.04} />)}
                  </div>
                  <LiveButton />
                </div>
              </motion.div>
            )}

            {tab === "mobile" && (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: EASE }}
                style={{ padding: isMobile ? "20px 16px 24px" : "28px 28px 32px" }}
              >
                <div style={{ marginBottom: isMobile ? 16 : 22 }}>
                  <SectionLabel>Responsive Design</SectionLabel>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 18 : 22, color: "rgba(255,255,255,0.9)", margin: "7px 0 8px", lineHeight: 1.2 }}>
                    Mobile View
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 12.5 : 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.75, maxWidth: 580 }}>
                    On mobile, the same premium identity holds — hero stats stack cleanly,
                    artist and influencer sections adapt to touch, and service cards reflow
                    without losing impact. Built mobile-first in React so the agency looks
                    impeccable on every screen size.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, maxWidth: "100%", overflow: "hidden" }}>
                  <motion.div animate={isMobile ? {} : { y: [0, -6, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }} style={{ perspective: 1200 }}>
                    <motion.div style={isMobile ? {} : { rotateX: phoneRotX, rotateY: phoneRotY, transformStyle: "preserve-3d" }}>
                      <VideoPhoneMockup src={alterMobileVideo} width={isMobile ? 190 : 290} onClick={() => setLightbox("phone")} />
                    </motion.div>
                  </motion.div>
                </div>
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["React.js", "Responsive", "Mobile-first", "Figma"].map((t, i) => <TechPill key={t} name={t} delay={i * 0.04} />)}
                  </div>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em" }}>MENA Region</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightbox && <VideoLightbox type={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </>
  );
};

export default AlterCaseStudy;
