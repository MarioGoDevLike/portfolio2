import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import { HiArrowUpRight, HiArrowsPointingOut } from "react-icons/hi2";
import CaseStudyMobileLayout, { MobilePreviewVideo } from "./CaseStudyMobile";
import { getHomeBackLink, getHomeBackState } from "../../utils/homeScroll";
import LazyVideo from "../ui/LazyVideo";
import OptimizedImage from "../ui/OptimizedImage";

import martixLogo from "../../assets/Martix/martix-logo-2.webp";
import martixVideo from "../../assets/Martix/martix stores.mp4";
import martixPoster from "../../assets/Martix/martix stores.poster.webp";

/* ─── Brand ──────────────────────────────────────── */
const CYAN = "#22D3EE";
const C = (a) => `rgba(34,211,238,${a})`;
const EASE = [0.22, 1, 0.36, 1];
const LIVE_URL = "https://martixstores.com/";


const HIGHLIGHTS = [
  {
    label: "Discover",
    desc: "Categories, flash deals, search, and storefront browsing",
  },
  {
    label: "Buy",
    desc: "Product details, cart, checkout, and saved addresses",
  },
  {
    label: "Follow up",
    desc: "Orders, reviews, and a realtime chat inbox with sellers",
  },
  {
    label: "Ship ready",
    desc: "Auth options, RTL localization, push, and remote update screens",
  },
];

const TECH = [
  {
    category: "Mobile",
    items: ["Flutter", "Dart", "Android (iOS-ready)"],
  },
  {
    category: "Realtime & Auth",
    items: ["Firebase Chat", "FCM", "OTP · Google · Facebook"],
  },
  {
    category: "Architecture",
    items: ["GetIt DI", "Dio", "Drift cache", "Controller → Service → Repository"],
  },
];

const TECH_BULLETS = [
  "Multi-vendor marketplace UX (stores, products, deals, checkout)",
  "Realtime customer–seller chat (Firebase)",
  "FCM push + deep links / App Links",
  "Auth: phone OTP, email, Google/Facebook",
  "Localization + RTL",
  "Offline-friendly caching + remote update screen",
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
    <span style={{ width: 16, height: 1, background: C(0.65), display: "block" }} />
    <span
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 10,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: CYAN,
        opacity: 0.85,
      }}
    >
      {children}
    </span>
  </div>
);

const Divider = () => (
  <div
    style={{
      height: 1,
      background:
        "linear-gradient(to right,transparent,rgba(255,255,255,0.05) 30%,rgba(255,255,255,0.05) 70%,transparent)",
    }}
  />
);

const VideoPhone = ({ src, poster, width = 220, onClick }) => {
  const [hov, setHov] = useState(false);
  const h = Math.round(width * 2.08);

  return (
    <div
      style={{
        width,
        height: h,
        position: "relative",
        flexShrink: 0,
        cursor: onClick ? "zoom-in" : "default",
      }}
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: width * 0.19,
          background: "linear-gradient(160deg,#252525,#141414)",
          border: "1.5px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          boxShadow: [
            "0 44px 88px rgba(0,0,0,0.8)",
            `0 0 64px ${C(0.16)}`,
            "inset 0 1px 0 rgba(255,255,255,0.06)",
          ].join(", "),
        }}
      >
        <LazyVideo
          src={src}
          poster={poster}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
            pointerEvents: "none",
          }}
        />
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
      </div>
      {[
        { side: "right", top: "28%", h: 56 },
        { side: "left", top: "19%", h: 34 },
        { side: "left", top: "33%", h: 34 },
        { side: "left", top: "13%", h: 18 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            [b.side]: -2,
            top: b.top,
            width: 3,
            height: b.h,
            borderRadius: b.side === "right" ? "0 2px 2px 0" : "2px 0 0 2px",
            background: "#252525",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          bottom: -22,
          left: "10%",
          right: "10%",
          height: 36,
          background: `radial-gradient(ellipse, ${C(0.28)}, transparent 70%)`,
          filter: "blur(12px)",
          pointerEvents: "none",
        }}
      />
      {onClick && (
        <motion.div
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: width * 0.19,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 25,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.28)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <HiArrowsPointingOut size={20} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

const VideoLightbox = ({ src, poster, onClose }) => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: isMobile ? "min(320px, 85vw)" : "min(360px, 92vw)" }}
      >
        <VideoPhone src={src} poster={poster} width={Math.min(isMobile ? 300 : 340, window.innerWidth * 0.8)} />
      </motion.div>
      <button
        type="button"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.7)",
          cursor: "pointer",
          fontSize: 18,
        }}
      >
        ×
      </button>
    </motion.div>
  );
};

const MartixCaseStudy = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const wrap = {
    maxWidth: 1080,
    margin: "0 auto",
    padding: isMobile ? "0 20px" : "0 48px",
  };

  const summary =
    "Martix is a live multi-vendor marketplace where customers discover stores, buy products, and talk directly to sellers. I built the Flutter customer app that ships that experience on Android (iOS-ready), integrated against martixstores.com.";

  const mobileLayout = (
    <CaseStudyMobileLayout
      brand={{ color: CYAN, rgba: C }}
      title="Martix"
      summary={summary}
      logo={
        <OptimizedImage
          src={martixLogo}
          alt="Martix"
          style={{ height: 40, width: "auto", objectFit: "contain", display: "block" }}
        />
      }
      meta={[
        { label: "Role", value: "Flutter Developer" },
        { label: "Platform", value: "Android · iOS-ready" },
        { label: "Stack", value: "Flutter · Firebase · Dio" },
        { label: "Type", value: "Marketplace App" },
      ]}
      ctas={[
        { label: "Visit Marketplace", href: LIVE_URL, primary: true },
        {
          label: "Watch App",
          onClick: () =>
            document.getElementById("martix-app")?.scrollIntoView({ behavior: "smooth" }),
        },
      ]}
      preview={
        <MobilePreviewVideo
          src={martixVideo}
          poster={martixPoster}
          brand={{ color: CYAN, rgba: C }}
          label="Customer app preview"
        />
      }
      videoAppShowcase={{
        id: "martix-app",
        title: "Customer App",
        subtitle:
          "Full shopping journey — browse, buy, chat — with production systems for push, deep links, and updates.",
        videoSrc: martixVideo,
        poster: martixPoster,
        onExpand: () => setLightbox(true),
        highlights: HIGHLIGHTS,
      }}
      tech={TECH}
    />
  );

  return (
    <>
      {isMobile ? (
        mobileLayout
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
            background: "#080808",
          }}
        >
          {/* ══════════ HERO ══════════ */}
          <section
            style={{
              position: "relative",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "35%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 900,
                height: 700,
                background: `radial-gradient(ellipse, ${C(0.08)} 0%, transparent 60%)`,
                filter: "blur(70px)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                padding: "28px 48px",
                zIndex: 10,
              }}
            >
              <Link
                to={getHomeBackLink()} state={getHomeBackState()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                }}
              >
                <HiChevronLeft size={14} /> Back to home
              </Link>
            </div>

            <div
              style={{
                ...wrap,
                paddingTop: 130,
                paddingBottom: 80,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 64,
                position: "relative",
                zIndex: 1,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ marginBottom: 36 }}
                >
                  <motion.img
                    src={martixLogo}
                    alt="Martix"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
                    style={{
                      height: 48,
                      width: "auto",
                      objectFit: "contain",
                      flexShrink: 0,
                      display: "block",
                    }}
                  />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 68,
                    lineHeight: 1.0,
                    letterSpacing: "-0.025em",
                    color: "rgba(255,255,255,0.95)",
                    margin: "0 0 18px",
                  }}
                >
                  Martix
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.5, ease: EASE }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 17,
                    color: "rgba(255,255,255,0.36)",
                    lineHeight: 1.7,
                    margin: "0 0 32px",
                    maxWidth: 520,
                  }}
                >
                  {summary}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
                  style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}
                >
                  {[
                    { label: "Role", value: "Flutter Developer" },
                    { label: "Platform", value: "Android · iOS-ready" },
                    { label: "Stack", value: "Flutter · Firebase · Dio" },
                    { label: "Type", value: "Marketplace App" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 9,
                          color: "rgba(255,255,255,0.28)",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        {m.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 12,
                          color: "rgba(255,255,255,0.7)",
                          fontWeight: 500,
                        }}
                      >
                        {m.value}
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.4, ease: EASE }}
                  style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                >
                  <motion.a
                    href={LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, boxShadow: `0 0 36px ${C(0.45)}` }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "12px 24px",
                      borderRadius: 10,
                      background: CYAN,
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#080808",
                      textDecoration: "none",
                    }}
                  >
                    Visit Marketplace <HiArrowUpRight size={14} />
                  </motion.a>
                  <motion.button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("martix-app")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    whileHover={{ scale: 1.03, borderColor: C(0.4) }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "12px 24px",
                      borderRadius: 10,
                      background: "transparent",
                      border: `1px solid ${C(0.22)}`,
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    Watch App
                  </motion.button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 32, scale: 0.93 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.75, ease: EASE }}
                style={{
                  flexShrink: 0,
                  filter: `drop-shadow(0 28px 44px rgba(0,0,0,0.75)) drop-shadow(0 0 32px ${C(0.18)})`,
                }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <VideoPhone src={martixVideo} poster={martixPoster} width={230} onClick={() => setLightbox(true)} />
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{
                position: "absolute",
                bottom: 28,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.18)",
                }}
              >
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 1,
                  height: 28,
                  background: `linear-gradient(to bottom, ${C(0.5)}, transparent)`,
                }}
              />
            </motion.div>
          </section>

          <Divider />

          {/* ══════════ APP SHOWCASE ══════════ */}
          <section id="martix-app" style={{ padding: "100px 0" }}>
            <div style={wrap}>
              <FadeUp>
                <SectionLabel>Flutter Customer App</SectionLabel>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 42,
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.92)",
                    margin: "0 0 52px",
                    lineHeight: 1.15,
                  }}
                >
                  The shopping journey
                </h2>
              </FadeUp>

              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 72 }}>
                <div style={{ flex: 1 }}>
                  <FadeUp>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 15,
                        color: "rgba(255,255,255,0.38)",
                        lineHeight: 1.8,
                        marginBottom: 28,
                      }}
                    >
                      Customers can browse categories and flash deals, open storefronts, search
                      products, check out, manage addresses and orders, leave reviews, and message
                      sellers in realtime — with push, deep links, and remote update controls behind
                      the scenes.
                    </p>
                  </FadeUp>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {HIGHLIGHTS.map((item, i) => (
                      <FadeUp key={item.label} delay={i * 0.07}>
                        <div
                          style={{
                            display: "flex",
                            gap: 14,
                            padding: "14px 16px",
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: CYAN,
                              opacity: 0.6,
                              flexShrink: 0,
                              marginTop: 4,
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: 13,
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.75)",
                                marginBottom: 3,
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 12,
                                color: "rgba(255,255,255,0.3)",
                                lineHeight: 1.55,
                              }}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      </FadeUp>
                    ))}
                  </div>
                </div>

                <FadeUp delay={0.15} style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <VideoPhone src={martixVideo} poster={martixPoster} width={270} onClick={() => setLightbox(true)} />
                  </motion.div>
                </FadeUp>
              </div>
            </div>
          </section>

        

          <Divider />

          {/* ══════════ TECH ══════════ */}
          <section style={{ padding: "100px 0" }}>
            <div style={wrap}>
              <FadeUp>
                <SectionLabel>Stack & Structure</SectionLabel>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 42,
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.92)",
                    margin: "0 0 16px",
                    lineHeight: 1.15,
                  }}
                >
                  Built to stay maintainable
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15,
                    color: "rgba(255,255,255,0.36)",
                    lineHeight: 1.7,
                    maxWidth: 640,
                    margin: "0 0 36px",
                  }}
                >
                  Features follow a consistent controller → service → repository pattern, with
                  centralized API constants, Dio auth headers, and dependency injection via GetIt —
                  so a large feature set stayed shippable while production fixes landed around auth
                  edge cases, chat reliability, and Play Store link verification.
                </p>
              </FadeUp>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                {TECH.map((group, i) => (
                  <FadeUp key={group.category} delay={i * 0.06}>
                    <div
                      style={{
                        padding: "20px 18px",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: 11,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: CYAN,
                          marginBottom: 14,
                          opacity: 0.85,
                        }}
                      >
                        {group.category}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {group.items.map((item) => (
                          <span
                            key={item}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 10,
                              background: C(0.08),
                              border: `1px solid ${C(0.18)}`,
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 12,
                              color: "rgba(255,255,255,0.7)",
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>

              <FadeUp delay={0.1}>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {TECH_BULLETS.map((line) => (
                    <li
                      key={line}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.5,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: CYAN,
                          opacity: 0.7,
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </FadeUp>
            </div>
          </section>

        </div>
      )}

      {lightbox && <VideoLightbox src={martixVideo} poster={martixPoster} onClose={() => setLightbox(false)} />}
    </>
  );
};

export default MartixCaseStudy;
