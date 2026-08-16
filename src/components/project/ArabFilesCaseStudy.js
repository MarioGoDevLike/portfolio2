import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import { HiArrowsPointingOut } from "react-icons/hi2";
import CaseStudyMobileLayout, { MobilePreviewVideo } from "./CaseStudyMobile";
import { getHomeBackLink, getHomeBackState } from "../../utils/homeScroll";
import LazyVideo from "../ui/LazyVideo";
import OptimizedImage from "../ui/OptimizedImage";

import arabFilesLogo from "../../assets/Arabfiles/arab-files-logo.webp";
import arabFilesVideo from "../../assets/Arabfiles/arabfiles.mp4";
import arabFilesPoster from "../../assets/Arabfiles/arabfiles.poster.webp";

/* ─── Brand ──────────────────────────────────────── */
const RED = "#E11D2E";
const R = (a) => `rgba(225,29,46,${a})`;
const EASE = [0.22, 1, 0.36, 1];


const HIGHLIGHTS = [
  {
    label: "Read",
    desc: "Home feeds, category browsing, and polished article details",
  },
  {
    label: "Watch",
    desc: "Dedicated video section and native-style YouTube in articles",
  },
  {
    label: "Alert",
    desc: "FCM push for breaking news with deep links into stories",
  },
  {
    label: "Localize",
    desc: "Arabic RTL and English UI that matches the brand",
  },
];

const TECH = [
  {
    category: "Mobile",
    items: ["Flutter", "Dart", "iOS & Android"],
  },
  {
    category: "App layer",
    items: ["Riverpod", "GoRouter", "Dio REST"],
  },
  {
    category: "Platform",
    items: ["Firebase Messaging", "YouTube playback", "RTL / bilingual"],
  },
];

const TECH_BULLETS = [
  "Flutter (iOS/Android)",
  "Riverpod — state management",
  "GoRouter — navigation & deep links",
  "Dio — REST API client",
  "Firebase Messaging — push + article deep linking",
  "Bilingual UI — Arabic (RTL) / English",
  "Video — YouTube stream playback in-article",
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
    <span
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 10,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: RED,
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
            `0 0 64px ${R(0.16)}`,
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
          background: `radial-gradient(ellipse, ${R(0.28)}, transparent 70%)`,
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

const ArabFilesCaseStudy = () => {
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
    "Arabfiles is a production Flutter news client built for a Lebanese/Arab media brand. It delivers a fast, RTL-first reading experience with home feeds, category browsing, article details, and a dedicated video section — all powered by the live Arabfiles REST API.";

  const scrollToApp = () =>
    document.getElementById("arabfiles-app")?.scrollIntoView({ behavior: "smooth" });

  const mobileLayout = (
    <CaseStudyMobileLayout
      brand={{ color: RED, rgba: R }}
      title="ArabFiles News"
      summary={summary}
      logo={
        <OptimizedImage
          src={arabFilesLogo}
          alt="Arab Files"
          style={{ height: 36, width: "auto", objectFit: "contain", display: "block" }}
        />
      }
      meta={[
        { label: "Role", value: "Flutter Developer" },
        { label: "Platform", value: "iOS & Android" },
        { label: "Stack", value: "Flutter · Riverpod · Dio" },
        { label: "Type", value: "News Client" },
      ]}
      ctas={[{ label: "Watch App", onClick: scrollToApp, primary: true }]}
      preview={
        <MobilePreviewVideo
          src={arabFilesVideo}
          poster={arabFilesPoster}
          brand={{ color: RED, rgba: R }}
          label="News app preview"
        />
      }
      videoAppShowcase={{
        id: "arabfiles-app",
        title: "News Client",
        subtitle:
          "Feeds, categories, articles, video, and push deep links — built for bilingual, RTL-first reading.",
        videoSrc: arabFilesVideo,
        poster: arabFilesPoster,
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
                background: `radial-gradient(ellipse, ${R(0.09)} 0%, transparent 60%)`,
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
                    src={arabFilesLogo}
                    alt="Arab Files"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
                    style={{
                      height: 44,
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
                    fontSize: 58,
                    lineHeight: 1.05,
                    letterSpacing: "-0.025em",
                    color: "rgba(255,255,255,0.95)",
                    margin: "0 0 18px",
                  }}
                >
                  ArabFiles News
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
                    maxWidth: 540,
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
                    { label: "Platform", value: "iOS & Android" },
                    { label: "Stack", value: "Flutter · Riverpod · Dio" },
                    { label: "Type", value: "News Client" },
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
                  <motion.button
                    type="button"
                    onClick={scrollToApp}
                    whileHover={{ scale: 1.04, boxShadow: `0 0 36px ${R(0.45)}` }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "12px 24px",
                      borderRadius: 10,
                      background: RED,
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      border: "none",
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
                  filter: `drop-shadow(0 28px 44px rgba(0,0,0,0.75)) drop-shadow(0 0 32px ${R(0.18)})`,
                }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <VideoPhone src={arabFilesVideo} poster={arabFilesPoster} width={230} onClick={() => setLightbox(true)} />
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
                  background: `linear-gradient(to bottom, ${R(0.5)}, transparent)`,
                }}
              />
            </motion.div>
          </section>

        <Divider />

        
          <section style={{ padding: "100px 0" }}>
            <div style={wrap}>
              <FadeUp>
                <SectionLabel>Stack & Craft</SectionLabel>
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
                  Clean architecture, client-ready UI
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
                  Built as a freelance client project with a focus on clean architecture,
                  localization, and a polished mobile UI that matches the brand.
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
                          color: RED,
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
                              background: R(0.08),
                              border: `1px solid ${R(0.2)}`,
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
                          background: RED,
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

      {lightbox && <VideoLightbox src={arabFilesVideo} poster={arabFilesPoster} onClose={() => setLightbox(false)} />}
    </>
  );
};

export default ArabFilesCaseStudy;
