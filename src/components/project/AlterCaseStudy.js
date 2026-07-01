import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import { HiArrowUpRight, HiArrowsPointingOut } from "react-icons/hi2";
import CaseStudyMobileLayout, { MobilePreviewVideo } from "./CaseStudyMobile";
import { getHomeBackLink } from "../../utils/homeScroll";

import alterWebVideo    from "../../assets/alter_images/alter_web_view.mp4";
import alterMobileVideo from "../../assets/alter_images/alter_mobile_view.mp4";
import alterLogo        from "../../assets/alter_images/alter logo white .png";

/* ─── Brand ──────────────────────────────────────── */
const GOLD = "#C4A574";
const G    = (a) => `rgba(196,165,116,${a})`;
const EASE = [0.22, 1, 0.36, 1];
const LIVE_URL = "https://altercoms.vercel.app/";

/* ─── Chromeless video helpers ───────────────────── */
const CHROMELESS_PROPS = {
  autoPlay: true, loop: true, muted: true, playsInline: true,
  disablePictureInPicture: true, disableRemotePlayback: true,
  controls: false, controlsList: "nodownload noplaybackrate noremoteplayback nofullscreen",
  onContextMenu: e => e.preventDefault(),
};

const useChromeless = (ref, src) => {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const resume = () => { if (v.paused) v.play().catch(() => {}); };
    v.play().catch(() => {});
    v.addEventListener("pause", resume);
    return () => v.removeEventListener("pause", resume);
  }, [ref, src]);
};

/* ─── Data ───────────────────────────────────────── */
const FEATURES = [
  { title: "Cinematic Hero",        desc: "Live agency stats — 1,651+ campaigns and 330+ artists front and center"  },
  { title: "Artist Marquee",        desc: "Scrolling roster presenting the agency's talent in premium style"          },
  { title: "Influencer Showcase",   desc: "Talent cards with social proof and network scale"                          },
  { title: "Service Pillars",       desc: "Six core offerings — digital, influencer, content, music, PR, branding"    },
  { title: "Partners Wall",         desc: "Trusted brands section with polished logo presentation"                    },
  { title: "Mobile-First Responsive", desc: "Desktop spectacle that collapses into a clean, thumb-friendly mobile experience" },
];

const TECH = [
  { category: "Frontend",  items: ["React.js", "JavaScript", "CSS3 Animations"] },
  { category: "Design",    items: ["Figma", "Custom Typography", "Motion Design"]  },
  { category: "Deploy",    items: ["Vercel", "Performance CDN", "Responsive Grid"] },
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
    <span style={{ width: 16, height: 1, background: G(0.65), display: "block" }} />
    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, opacity: 0.85 }}>
      {children}
    </span>
  </div>
);

const Divider = () => (
  <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(255,255,255,0.05) 30%,rgba(255,255,255,0.05) 70%,transparent)" }} />
);

/* ─── Video browser mockup ────────────────────────── */
const VideoBrowser = ({ src, onClick }) => {
  const videoRef = useRef(null);
  const [hov, setHov] = useState(false);
  useChromeless(videoRef, src);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", width: "100%", borderRadius: 14, overflow: "hidden",
        background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)",
        cursor: onClick ? "zoom-in" : "default",
        boxShadow: [`0 32px 64px rgba(0,0,0,0.65)`, `0 0 50px ${G(0.1)}`, "inset 0 1px 0 rgba(255,255,255,0.05)"].join(", "),
      }}
    >
      <div style={{ height: 38, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, background: "rgba(0,0,0,0.65)", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
        </div>
        <div style={{ flex: 1, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 10, gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontFamily: "monospace", whiteSpace: "nowrap" }}>altercoms.vercel.app</span>
        </div>
      </div>
      <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#000" }}>
        <video ref={videoRef} src={src} {...CHROMELESS_PROPS}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
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

/* ─── Video phone mockup ──────────────────────────── */
const VideoPhone = ({ src, width = 220, onClick }) => {
  const videoRef = useRef(null);
  const [hov, setHov] = useState(false);
  const h = Math.round(width * 2.08);
  useChromeless(videoRef, src);
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
        boxShadow: [`0 44px 88px rgba(0,0,0,0.8)`, `0 0 64px ${G(0.16)}`, "inset 0 1px 0 rgba(255,255,255,0.06)"].join(", "),
      }}>
        <video ref={videoRef} src={src} {...CHROMELESS_PROPS}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: width * 0.056, left: "50%", transform: "translateX(-50%)", width: width * 0.38, height: width * 0.11, borderRadius: width * 0.06, background: "#111", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: width * 0.44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", zIndex: 10 }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", boxShadow: "inset 0 0 24px rgba(0,0,0,0.45)", pointerEvents: "none", zIndex: 5 }} />
      </div>
      {[{ side: "right", top: "28%", h: 56 }, { side: "left", top: "19%", h: 34 }, { side: "left", top: "33%", h: 34 }, { side: "left", top: "13%", h: 18 }].map((b, i) => (
        <div key={i} style={{ position: "absolute", [b.side]: -2, top: b.top, width: 3, height: b.h, borderRadius: b.side === "right" ? "0 2px 2px 0" : "2px 0 0 2px", background: "#252525" }} />
      ))}
      <div style={{ position: "absolute", bottom: -22, left: "10%", right: "10%", height: 36, background: `radial-gradient(ellipse, ${G(0.28)}, transparent 70%)`, filter: "blur(12px)", pointerEvents: "none" }} />
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

/* ─── Video lightbox ──────────────────────────────── */
const VideoLightbox = ({ src, type, onClose }) => {
  const videoRef = useRef(null);
  const phoneVideoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useChromeless(videoRef, src);
  useChromeless(phoneVideoRef, src);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

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

  const isPhone = type === "phone";
  const immersive = isPhone && isMobile;

  const closeBtn = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close fullscreen"
      style={{
        position: "absolute",
        top: "max(14px, env(safe-area-inset-top))",
        right: "max(14px, env(safe-area-inset-right))",
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.22)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 18,
        lineHeight: 1,
        outline: "none",
        zIndex: 10,
        WebkitTapHighlightColor: "transparent",
        backdropFilter: "blur(8px)",
      }}
    >
      ✕
    </button>
  );

  if (immersive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#000",
        }}
      >
        {closeBtn}
        <video
          ref={phoneVideoRef}
          src={src}
          {...CHROMELESS_PROPS}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(16px)", padding: 20 }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ width: isPhone ? "min(320px, 85vw)" : "min(900px, 92vw)", maxHeight: "90vh", borderRadius: 16, overflow: "hidden" }}
      >
        {isPhone ? (
          <VideoPhone src={src} width={Math.min(320, window.innerWidth * 0.85)} />
        ) : (
          <div style={{ borderRadius: 14, overflow: "hidden", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ height: 32, display: "flex", alignItems: "center", padding: "0 12px", gap: 8, background: "rgba(0,0,0,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["#ef4444","#f59e0b","#22c55e"].map(c => <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
            </div>
            <video ref={videoRef} src={src} {...CHROMELESS_PROPS}
              style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover", pointerEvents: "none" }} />
          </div>
        )}
      </motion.div>
      {closeBtn}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const AlterCaseStudy = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const wrap = { maxWidth: 1080, margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px" };

  const mobileLayout = (
    <CaseStudyMobileLayout
      brand={{ color: GOLD, rgba: G }}
      title="Alter"
      summary="A cinematic digital presence for a leading MENA PR & marketing agency — built in React.js with live campaign statistics, a marquee artist roster, and a fully responsive layout."
      logo={
        <img src={alterLogo} alt="Alter" style={{ height: 28, width: "auto", objectFit: "contain", display: "block" }} />
      }
      meta={[
        { label: "Role", value: "Frontend Developer" },
        { label: "Client", value: "Alter Agency — MENA" },
        { label: "Stack", value: "React.js · Vercel" },
        { label: "Type", value: "Marketing Website" },
      ]}
      ctas={[
        { label: "Visit Live Site", href: LIVE_URL, primary: true },
        { label: "View Showcase", onClick: () => document.getElementById("alter-web")?.scrollIntoView({ behavior: "smooth" }) },
      ]}
      preview={
        <MobilePreviewVideo src={alterWebVideo} brand={{ color: GOLD, rgba: G }} label="Live site preview" />
      }
      videoWebShowcase={{
        id: "alter-web",
        title: "The Website",
        subtitle: "Cinematic scroll experience with live stats, artist roster, and service pillars.",
        videoSrc: alterWebVideo,
        onExpand: () => setLightbox("web"),
      }}
      videoAppShowcase={{
        id: "alter-mobile",
        title: "Mobile Experience",
        subtitle: "Every scroll interaction, stat counter, and marquee preserved at any screen size.",
        videoSrc: alterMobileVideo,
        onExpand: () => setLightbox("phone"),
        highlights: [
          { label: "Stats Hero", desc: "Live campaign and artist counts, full-width on mobile" },
          { label: "Artist Roster", desc: "Marquee scrolls and talent cards adapt to touch" },
          { label: "Service Grid", desc: "Six pillars stack cleanly for mobile reading" },
          { label: "Partners Wall", desc: "Logo grid reflows to 2-column on small screens" },
        ],
      }}
      features={FEATURES}
      tech={TECH}
      cta={{
        title: "See the full experience",
        description: "Alter is live. Explore the cinematic scroll experience for yourself.",
        liveUrl: LIVE_URL,
        liveLabel: "Open Alter",
      }}
    />
  );

  return (
    <>
      {isMobile ? mobileLayout : (
      <div style={{ position: "relative", width: "100%", maxWidth: "100%", overflowX: "hidden", background: "#080808" }}>

        {/* ══════════ HERO ══════════ */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
          {/* Ambient gold glow */}
          <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 700, background: `radial-gradient(ellipse, ${G(0.07)} 0%, transparent 60%)`, filter: "blur(70px)", pointerEvents: "none" }} />

          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: isMobile ? "20px 20px" : "28px 48px", zIndex: 10 }}>
            <Link to={getHomeBackLink()} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
              <HiChevronLeft size={14} /> Back to home
            </Link>
          </div>

          <div style={{ ...wrap, paddingTop: isMobile ? 110 : 130, paddingBottom: 80, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 52 : 64, position: "relative", zIndex: 1 }}>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Logo + eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ marginBottom: 36 }}
              >
                <motion.img
                  src={alterLogo} alt="Alter"
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
                  style={{ height: 28, width: "auto", objectFit: "contain", flexShrink: 0, display: "block" }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 42 : 72, lineHeight: 1.0, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.95)", margin: "0 0 18px" }}
              >
                Alter
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.5, ease: EASE }}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.36)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 500 }}
              >
                A cinematic digital presence for a leading MENA PR &amp; marketing agency — built in React.js with live campaign statistics, a marquee artist roster, and a fully responsive layout.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}
              >
                {[
                  { label: "Role",    value: "Frontend Developer" },
                  { label: "Client",  value: "Alter Agency — MENA" },
                  { label: "Stack",   value: "React.js · Vercel"  },
                  { label: "Type",    value: "Marketing Website"   },
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
                <motion.a
                  href={LIVE_URL} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, boxShadow: `0 0 36px ${G(0.55)}` }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 10, background: GOLD, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: "#080808", textDecoration: "none" }}
                >
                  Visit Live Site <HiArrowUpRight size={14} />
                </motion.a>
                <motion.button
                  type="button"
                  onClick={() => document.getElementById("alter-web").scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ scale: 1.03, borderColor: G(0.4) }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 24px", borderRadius: 10, background: "transparent", border: `1px solid ${G(0.22)}`, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", cursor: "pointer", outline: "none" }}
                >
                  View Showcase
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT — hero video preview (desktop) */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: 32, scale: 0.93 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.75, ease: EASE }}
                style={{ flexShrink: 0, width: 400, position: "relative" }}
              >
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.09)", boxShadow: `0 28px 56px rgba(0,0,0,0.65), 0 0 48px ${G(0.08)}` }}>
                  <div style={{ height: 30, display: "flex", alignItems: "center", padding: "0 10px", gap: 6, background: "rgba(0,0,0,0.75)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {["#ef4444","#f59e0b","#22c55e"].map(c => <span key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
                  </div>
                  <HeroVideoPreview src={alterWebVideo} />
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", bottom: -36, right: -24, filter: `drop-shadow(0 28px 44px rgba(0,0,0,0.75)) drop-shadow(0 0 32px ${G(0.18)})` }}
                >
                  <VideoPhone src={alterMobileVideo} width={110} />
                </motion.div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
          >
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} style={{ width: 1, height: 28, background: `linear-gradient(to bottom, ${G(0.5)}, transparent)` }} />
          </motion.div>
        </section>

        <Divider />

        {/* ══════════ WEBSITE SHOWCASE ══════════ */}
        <section id="alter-web" style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp>
              <SectionLabel>Desktop Experience</SectionLabel>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.15 }}>
                    The Website
                  </h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.32)", margin: "8px 0 0", maxWidth: 520 }}>
                    The desktop opens with a bold hero, live campaign metrics, a marquee artist roster, and a cinematic scroll experience that communicates prestige and scale.
                  </p>
                </div>
                <motion.a
                  href={LIVE_URL} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, boxShadow: `0 0 24px ${G(0.4)}` }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: GOLD, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color: "#080808", textDecoration: "none", flexShrink: 0 }}
                >
                  Live Site <HiArrowUpRight size={13} />
                </motion.a>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <VideoBrowser src={alterWebVideo} onClick={() => setLightbox("web")} />
            </FadeUp>
            <FadeUp delay={0.14}>
              <div style={{ marginTop: 14, textAlign: "right" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Tap to expand fullscreen</span>
              </div>
            </FadeUp>
          </div>
        </section>

        <Divider />

        {/* ══════════ MOBILE VIEW ══════════ */}
        <section style={{ padding: isMobile ? "72px 0" : "100px 0" }}>
          <div style={wrap}>
            <FadeUp>
              <SectionLabel>Responsive Design</SectionLabel>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: "0 0 52px", lineHeight: 1.15 }}>
                Mobile Experience
              </h2>
            </FadeUp>

            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: isMobile ? 44 : 72 }}>
              {/* Left — description */}
              <div style={{ flex: 1, order: isMobile ? 2 : 1 }}>
                <FadeUp>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.8, marginBottom: 28 }}>
                    The same cinematic content collapses into a clean, thumb-friendly mobile layout — every scroll interaction, stat counter, and marquee preserved at any screen size.
                  </p>
                </FadeUp>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Stats Hero",     desc: "Live campaign and artist counts, full-width on mobile" },
                    { label: "Artist Roster",  desc: "Marquee scrolls and talent cards adapt to touch" },
                    { label: "Service Grid",   desc: "Six pillars stack cleanly for mobile reading" },
                    { label: "Partners Wall",  desc: "Logo grid reflows to 2-column on small screens" },
                  ].map((item, i) => (
                    <FadeUp key={item.label} delay={i * 0.07}>
                      <div style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, opacity: 0.6, flexShrink: 0, marginTop: 4 }} />
                        <div>
                          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)", marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.55 }}>{item.desc}</div>
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <FadeUp delay={0.15} style={{ flexShrink: 0, display: "flex", justifyContent: "center", order: isMobile ? 1 : 2 }}>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
                  <VideoPhone src={alterMobileVideo} width={isMobile ? 210 : 270} onClick={() => setLightbox("phone")} />
                </motion.div>
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
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 42, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.15 }}>What it does</h2>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12 }}>
              {FEATURES.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -4, borderColor: G(0.25) }}
                    style={{ padding: isMobile ? "18px 14px" : "24px 20px", borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", height: "100%", transition: "border-color 0.25s" }}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: G(0.09), border: `1px solid ${G(0.18)}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 13, color: GOLD }}>✦</span>
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
                  <div style={{ padding: "26px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid ${G(0.1)}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${G(0.55)}, transparent)` }} />
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, opacity: 0.8, marginBottom: 18 }}>{cat.category}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {cat.items.map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, opacity: 0.55, flexShrink: 0 }} />
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
                <div style={{ width: 28, height: 1, background: G(0.5) }} />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, opacity: 0.8 }}>Live</span>
                <div style={{ width: 28, height: 1, background: G(0.5) }} />
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: isMobile ? 30 : 46, letterSpacing: "-0.025em", color: "rgba(255,255,255,0.92)", margin: "0 0 14px", lineHeight: 1.1 }}>
                See the full experience
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.32)", margin: "0 auto 40px", maxWidth: 380, lineHeight: 1.7 }}>
                Alter is live. Explore the cinematic scroll experience for yourself.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <motion.a
                  href={LIVE_URL} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.04, boxShadow: `0 0 44px ${G(0.58)}` }} whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px", borderRadius: 12, background: GOLD, fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: "#080808", textDecoration: "none" }}
                >
                  Open Alter <HiArrowUpRight size={15} />
                </motion.a>
                <Link
                  to={getHomeBackLink()}
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
          <VideoLightbox
            src={lightbox === "web" ? alterWebVideo : alterMobileVideo}
            type={lightbox}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Small hero preview video (no sound, shrunk) ── */
const HeroVideoPreview = ({ src }) => {
  const ref = useRef(null);
  useChromeless(ref, src);
  return (
    <video ref={ref} src={src} {...CHROMELESS_PROPS}
      style={{ width: "100%", display: "block", aspectRatio: "16/10", objectFit: "cover", pointerEvents: "none" }} />
  );
};

export default AlterCaseStudy;
