import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiArrowUpRight } from "react-icons/hi2";
import { getHomeBackLink } from "../../utils/homeScroll";

const EASE = [0.22, 1, 0.36, 1];
const FONT = "'Space Grotesk', sans-serif";
const BODY = "'Inter', sans-serif";

/* ─── Lazy autoplay video — only plays when visible ─ */
const LazyAutoplayVideo = ({ src, style, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
      style={style}
    />
  );
};

/* ─── Hook ───────────────────────────────────────── */
export function useIsMobileCaseStudy(breakpoint = 768) {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < breakpoint);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, [breakpoint]);
  return mobile;
}

/* ─── Primitives ─────────────────────────────────── */
const SectionEyebrow = ({ children, color }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
    <span style={{ width: 14, height: 1, background: color, opacity: 0.65 }} />
    <span style={{ fontFamily: FONT, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color, opacity: 0.85 }}>
      {children}
    </span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.94)", margin: "0 0 6px", lineHeight: 1.15 }}>
    {children}
  </h2>
);

const SectionBlock = ({ id, children, style }) => (
  <section
    id={id}
    style={{
      padding: "52px 0",
      scrollMarginTop: 58,
      contentVisibility: "auto",
      containIntrinsicSize: "0 480px",
      ...style,
    }}
  >
    <div style={{ padding: "0 20px" }}>{children}</div>
  </section>
);

const Divider = ({ rgba }) => (
  <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${rgba(0.08)} 40%, ${rgba(0.08)} 60%, transparent)` }} />
);

/* ─── Sticky progress + section nav ─────────────── */
const MobileCaseNav = ({ sections, brand, activeId, onSectionChange, onNavigate }) => {
  const [visible, setVisible] = useState(false);
  const progressRef = useRef(null);
  const visibleRef = useRef(false);
  const activeRef = useRef(activeId);
  const rafRef = useRef(null);

  activeRef.current = activeId;

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const y = window.scrollY;

        if (progressRef.current) {
          const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const p = max > 0 ? Math.min(y / max, 1) : 0;
          progressRef.current.style.transform = `scaleX(${p})`;
        }

        const shouldShow = y > 280;
        if (shouldShow !== visibleRef.current) {
          visibleRef.current = shouldShow;
          setVisible(shouldShow);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const obs = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = intersecting[0]?.target?.id;
        if (id && id !== activeRef.current) onSectionChange(id);
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections, onSectionChange]);

  return (
    <>
      {/* scroll progress — DOM-only updates, no React re-renders */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 200, background: "rgba(255,255,255,0.04)" }}>
        <div
          ref={progressRef}
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${brand.color}, ${brand.color}88)`,
            transformOrigin: "left",
            transform: "scaleX(0)",
            willChange: "transform",
          }}
        />
      </div>

      {/* sticky section pills */}
      <nav
        aria-label="Case study sections"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 190,
          paddingTop: "max(8px, env(safe-area-inset-top))",
          background: "rgba(8,8,8,0.96)",
          borderBottom: `1px solid ${brand.rgba(0.12)}`,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.28s ease",
        }}
      >
        <div
          className="hide-scrollbar"
          style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 16px 12px", WebkitOverflowScrolling: "touch" }}
        >
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onNavigate(s.id)}
                style={{
                  flexShrink: 0,
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: `1px solid ${active ? brand.rgba(0.45) : "rgba(255,255,255,0.08)"}`,
                  background: active ? brand.rgba(0.14) : "rgba(255,255,255,0.03)",
                  color: active ? brand.color : "rgba(255,255,255,0.42)",
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                  transition: "all 0.2s",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

/* ─── Hero ───────────────────────────────────────── */
const MobileHero = ({ brand, eyebrow, title, summary, logo, meta, ctas, preview }) => (
  <section style={{ position: "relative", overflow: "hidden" }}>
    {/* back */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "16px 20px", zIndex: 5 }}>
      <Link
        to={getHomeBackLink()}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
      >
        <HiChevronLeft size={15} /> Back
      </Link>
    </div>

    {/* preview — visual first */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{ paddingTop: 52 }}
    >
      {preview}
    </motion.div>

    {/* content */}
    <div style={{ padding: "28px 20px 36px" }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.45, ease: EASE }}>
        {logo}
        {eyebrow ? (
          <div style={{ marginTop: 16, marginBottom: 10 }}>
            <SectionEyebrow color={brand.color}>{eyebrow}</SectionEyebrow>
          </div>
        ) : null}
        <h1 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, lineHeight: 1.05, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.96)", margin: "0 0 12px" }}>
          {title}
        </h1>
        <p style={{ fontFamily: BODY, fontSize: 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, margin: "0 0 22px" }}>
          {summary}
        </p>

        {/* meta — 2x2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
          {meta.map((m) => (
            <div key={m.label} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontFamily: BODY, fontSize: 9, color: "rgba(255,255,255,0.28)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 3 }}>{m.label}</div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500, lineHeight: 1.3 }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ctas.map((cta) => {
            const base = {
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              minHeight: 50, borderRadius: 14, fontFamily: FONT, fontSize: 14, fontWeight: 700,
              textDecoration: "none", cursor: "pointer", WebkitTapHighlightColor: "transparent",
            };
            if (cta.primary) {
              return (
                <motion.a
                  key={cta.label}
                  href={cta.href}
                  target={cta.href?.startsWith("http") ? "_blank" : undefined}
                  rel={cta.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={cta.onClick}
                  whileTap={{ scale: 0.98 }}
                  style={{ ...base, background: brand.color, color: "#080808", border: "none" }}
                >
                  {cta.label} {cta.href?.startsWith("http") && <HiArrowUpRight size={15} />}
                </motion.a>
              );
            }
            return (
              <motion.button
                key={cta.label}
                type="button"
                onClick={cta.onClick}
                whileTap={{ scale: 0.98 }}
                style={{ ...base, background: "transparent", border: `1px solid ${brand.rgba(0.28)}`, color: "rgba(255,255,255,0.65)", outline: "none" }}
              >
                {cta.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── Preview builders ───────────────────────────── */
export const MobilePreviewDual = ({ webSrc, phoneSrc, brand, url }) => (
  <div style={{ position: "relative", padding: "0 20px" }}>
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: `0 24px 56px rgba(0,0,0,0.55), 0 0 40px ${brand.rgba(0.1)}` }}>
      <div style={{ height: 28, display: "flex", alignItems: "center", padding: "0 10px", gap: 6, background: "rgba(0,0,0,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {["#ef4444", "#f59e0b", "#22c55e"].map((c) => <span key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.75 }} />)}
        {url && <span style={{ marginLeft: 6, fontSize: 8, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url.replace("https://", "")}</span>}
      </div>
      <img src={webSrc} alt="Preview" style={{ width: "100%", display: "block", aspectRatio: "16/10", objectFit: "cover", objectPosition: "top", background: "#0a0a0a" }} />
    </div>
    <div style={{ position: "absolute", bottom: -28, right: 28, width: 88, borderRadius: 18, overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", boxShadow: `0 20px 40px rgba(0,0,0,0.7), 0 0 24px ${brand.rgba(0.2)}` }}>
      <img src={phoneSrc} alt="App" style={{ width: "100%", display: "block", aspectRatio: "9/19", objectFit: "cover", objectPosition: "top" }} />
    </div>
    <div style={{ height: 36 }} />
  </div>
);

export const MobilePreviewPhones = ({ leftSrc, rightSrc, brand }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 14, padding: "0 20px" }}>
    {[leftSrc, rightSrc].map((src, i) => (
      <div key={i} style={{ width: "42%", borderRadius: 20, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.08)", boxShadow: `0 20px 48px rgba(0,0,0,0.6), 0 0 32px ${brand.rgba(0.12)}` }}>
        <img src={src} alt="" style={{ width: "100%", display: "block", aspectRatio: "9/19", objectFit: "cover", objectPosition: "top" }} />
      </div>
    ))}
  </div>
);

export const MobilePreviewVideo = ({ src, brand, label }) => (
  <div style={{ padding: "0 20px" }}>
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: `0 24px 56px rgba(0,0,0,0.55), 0 0 40px ${brand.rgba(0.1)}` }}>
      <LazyAutoplayVideo src={src} className="alter-case-study-video" style={{ width: "100%", display: "block", aspectRatio: "16/10", objectFit: "cover" }} />
    </div>
    {label && <p style={{ textAlign: "center", marginTop: 10, fontFamily: FONT, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{label}</p>}
  </div>
);

export const MobilePreviewImage = ({ src, brand }) => (
  <div style={{ padding: "0 20px" }}>
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: `0 24px 56px rgba(0,0,0,0.55), 0 0 40px ${brand.rgba(0.1)}` }}>
      <img src={src} alt="Preview" style={{ width: "100%", display: "block", aspectRatio: "16/10", objectFit: "cover", objectPosition: "top" }} />
    </div>
  </div>
);

/* ─── Swipeable web gallery ──────────────────────── */
const MobileWebGallery = ({ id, title, subtitle, screens, brand, onExpand }) => {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);

  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = ref.current;
      if (!el?.firstChild) return;
      const w = el.firstChild.offsetWidth + 14;
      const idx = Math.min(Math.round(el.scrollLeft / w), screens.length - 1);
      setActive((prev) => (prev === idx ? prev : idx));
    });
  }, [screens.length]);

  return (
    <SectionBlock id={id}>
      <SectionEyebrow color={brand.color}>Web Platform</SectionEyebrow>
      <SectionTitle>{title}</SectionTitle>
      {subtitle && <p style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.32)", margin: "0 0 20px", lineHeight: 1.65 }}>{subtitle}</p>}

      <div
        ref={ref}
        onScroll={onScroll}
        className="hide-scrollbar"
        style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory", margin: "0 -20px", padding: "0 20px 4px", WebkitOverflowScrolling: "touch" }}
      >
        {screens.map((s, i) => (
          <motion.button
            key={s.src}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => { setActive(i); onExpand(i); }}
            style={{
              flexShrink: 0, width: "88vw", maxWidth: 340, scrollSnapAlign: "center",
              padding: 0, border: `1px solid ${i === active ? brand.rgba(0.4) : "rgba(255,255,255,0.07)"}`,
              borderRadius: 14, overflow: "hidden", background: "#0d0d0d", cursor: "pointer",
              boxShadow: i === active ? `0 16px 48px rgba(0,0,0,0.5), 0 0 32px ${brand.rgba(0.12)}` : "0 8px 32px rgba(0,0,0,0.4)",
              WebkitTapHighlightColor: "transparent", textAlign: "left",
            }}
          >
            <div style={{ height: 26, display: "flex", alignItems: "center", padding: "0 10px", gap: 5, background: "rgba(0,0,0,0.65)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => <span key={c} style={{ width: 6, height: 6, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
            </div>
            <img src={s.src} alt={s.label} style={{ width: "100%", display: "block", aspectRatio: "16/10", objectFit: "cover", objectPosition: "top" }} />
            <div style={{ padding: "12px 14px", background: "rgba(0,0,0,0.5)" }}>
              <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{s.label}</span>
              <span style={{ display: "block", fontFamily: BODY, fontSize: 10, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>Tap to expand</span>
            </div>
          </motion.button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 16 }}>
        {screens.map((_, i) => (
          <div key={i} style={{ width: i === active ? 16 : 5, height: 4, borderRadius: 2, background: i === active ? brand.color : "rgba(255,255,255,0.14)", transition: "all 0.25s" }} />
        ))}
      </div>
    </SectionBlock>
  );
};

/* ─── iPhone frame with video (Alter mobile showcase) ─ */
export const MobilePhoneFrameVideo = ({ src, brand, width = 250 }) => {
  const h = Math.round(width * 2.08);
  const r = width * 0.19;

  return (
    <div style={{ width, height: h, position: "relative", flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          background: "linear-gradient(165deg, #2a2a2a 0%, #121212 55%, #0a0a0a 100%)",
          border: "2px solid rgba(255,255,255,0.1)",
          boxShadow: [
            "0 40px 80px rgba(0,0,0,0.8)",
            `0 0 56px ${brand.rgba(0.14)}`,
            "inset 0 1px 0 rgba(255,255,255,0.08)",
          ].join(", "),
          overflow: "hidden",
        }}
      >
        <LazyAutoplayVideo
          src={src}
          className="alter-case-study-video"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
        />
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: width * 0.048,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.34,
            height: width * 0.1,
            borderRadius: width * 0.05,
            background: "#000",
            zIndex: 10,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04)",
          }}
        />
        {/* Home indicator */}
        <div
          style={{
            position: "absolute",
            bottom: width * 0.028,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.36,
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.22)",
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            boxShadow: "inset 0 0 28px rgba(0,0,0,0.35)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      </div>
      {/* Side buttons */}
      {[
        { side: "right", top: "26%", h: 52 },
        { side: "left", top: "18%", h: 28 },
        { side: "left", top: "30%", h: 28 },
        { side: "left", top: "12%", h: 16 },
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
            background: "#1c1c1c",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: "8%",
          right: "8%",
          height: 32,
          background: `radial-gradient(ellipse, ${brand.rgba(0.22)}, transparent 70%)`,
          filter: "blur(12px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

/* ─── Video showcase (Alter) ─────────────────────── */
const MobileVideoShowcase = ({ id, title, subtitle, videoSrc, brand, onExpand, phone, highlights }) => (
  <SectionBlock id={id}>
    <SectionEyebrow color={brand.color}>{phone ? "Mobile" : "Web Platform"}</SectionEyebrow>
    <SectionTitle>{title}</SectionTitle>
    {subtitle && <p style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.32)", margin: "0 0 20px", lineHeight: 1.65 }}>{subtitle}</p>}
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onExpand}
      style={{
        width: "100%",
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {phone ? (
        <MobilePhoneFrameVideo src={videoSrc} brand={brand} width={250} />
      ) : (
        <div
          style={{
            width: "100%",
            border: `1px solid ${brand.rgba(0.25)}`,
            borderRadius: 14,
            overflow: "hidden",
            background: "#0a0a0a",
            boxShadow: `0 20px 48px rgba(0,0,0,0.55), 0 0 36px ${brand.rgba(0.1)}`,
          }}
        >
          <LazyAutoplayVideo
            src={videoSrc}
            className="alter-case-study-video"
            style={{ width: "100%", display: "block", aspectRatio: "16/10", objectFit: "cover" }}
          />
        </div>
      )}
    </motion.button>
    {phone && (
      <p style={{ textAlign: "center", marginTop: 14, fontFamily: BODY, fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
        Tap for fullscreen
      </p>
    )}
    {highlights?.length > 0 && (
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        {highlights.map((h) => (
          <div key={h.label} style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.78)", marginBottom: 3 }}>{h.label}</div>
            <div style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.55 }}>{h.desc}</div>
          </div>
        ))}
      </div>
    )}
  </SectionBlock>
);

/* ─── Compact phone frame for mobile showcases ───── */
export const MobilePhoneFrame = ({ screen, brand, width = 200 }) => {
  const h = Math.round(width * 2.08);
  return (
    <div style={{ width, height: h, position: "relative", flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: width * 0.19,
        background: "linear-gradient(160deg,#252525,#141414)",
        border: "1.5px solid rgba(255,255,255,0.08)", overflow: "hidden",
        boxShadow: [`0 32px 64px rgba(0,0,0,0.75)`, `0 0 48px ${brand.rgba(0.18)}`].join(", "),
      }}>
        <img src={screen.src} alt={screen.label} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        <div style={{ position: "absolute", top: width * 0.056, left: "50%", transform: "translateX(-50%)", width: width * 0.38, height: width * 0.11, borderRadius: width * 0.06, background: "#111", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", width: width * 0.44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", zIndex: 10 }} />
      </div>
    </div>
  );
};

/* ─── App showcase — swipe + feature chips ───────── */
const MobileAppShowcase = ({
  id, title, subtitle, screens, highlights, brand,
  activeIdx, onIdxChange,   onExpand, renderPhone,
}) => {
  const scrollRef = useRef(null);
  const rafRef = useRef(null);

  const scrollToIdx = (idx) => {
    onIdxChange(idx);
    const el = scrollRef.current;
    if (el?.children[idx]) {
      el.children[idx].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  return (
    <SectionBlock id={id}>
      <SectionEyebrow color={brand.color}>Mobile App</SectionEyebrow>
      <SectionTitle>{title}</SectionTitle>
      {subtitle && <p style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.32)", margin: "0 0 24px", lineHeight: 1.65 }}>{subtitle}</p>}

      {/* phone carousel */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onExpand}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
        >
          {renderPhone(screens[activeIdx])}
        </motion.button>
      </div>

      {/* screen label */}
      <p style={{ textAlign: "center", fontFamily: FONT, fontSize: 12, fontWeight: 600, color: brand.color, margin: "0 0 16px" }}>
        {screens[activeIdx]?.label}
      </p>

      {/* swipeable screen strip */}
      <div
        ref={scrollRef}
        className="hide-scrollbar"
        style={{ display: "flex", gap: 10, overflowX: "auto", scrollSnapType: "x mandatory", margin: "0 -20px", padding: "0 20px 8px", WebkitOverflowScrolling: "touch" }}
        onScroll={() => {
          if (rafRef.current) return;
          rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            const el = scrollRef.current;
            if (!el?.firstChild) return;
            const w = el.firstChild.offsetWidth + 10;
            const idx = Math.round(el.scrollLeft / w);
            if (idx !== activeIdx && idx < screens.length) onIdxChange(idx);
          });
        }}
      >
        {screens.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => scrollToIdx(i)}
            style={{
              flexShrink: 0, width: 56, scrollSnapAlign: "start", padding: 0,
              border: `2px solid ${i === activeIdx ? brand.color : "rgba(255,255,255,0.08)"}`,
              borderRadius: 8, overflow: "hidden", background: "transparent", cursor: "pointer",
              boxShadow: i === activeIdx ? `0 0 16px ${brand.rgba(0.25)}` : "none",
            }}
          >
            <img src={s.src} alt={s.label} style={{ width: "100%", aspectRatio: "9/16", objectFit: "cover", objectPosition: "top", display: "block" }} />
          </button>
        ))}
      </div>

      {/* feature chips */}
      {highlights?.length > 0 && (
        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          {highlights.map((h) => {
            const active = activeIdx === h.idx;
            return (
              <motion.button
                key={h.label}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToIdx(h.idx)}
                style={{
                  display: "flex", gap: 12, textAlign: "left", width: "100%",
                  padding: "14px 16px", borderRadius: 14, cursor: "pointer",
                  background: active ? brand.rgba(0.08) : "rgba(255,255,255,0.02)",
                  border: `1px solid ${active ? brand.rgba(0.28) : "rgba(255,255,255,0.06)"}`,
                  WebkitTapHighlightColor: "transparent", outline: "none",
                }}
              >
                <span style={{ width: 32, height: 32, borderRadius: 8, background: brand.rgba(0.12), border: `1px solid ${brand.rgba(0.22)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT, fontSize: 10, fontWeight: 700, color: brand.color }}>
                  {String(h.idx + 1).padStart(2, "0")}
                </span>
                <span>
                  <span style={{ display: "block", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)", marginBottom: 3 }}>{h.label}</span>
                  <span style={{ fontFamily: BODY, fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>{h.desc}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </SectionBlock>
  );
};

/* ─── Features — single column ───────────────────── */
const MobileFeatures = ({ features, brand }) => (
  <SectionBlock id="cs-features">
    <SectionEyebrow color={brand.color}>Capabilities</SectionEyebrow>
    <SectionTitle>What it does</SectionTitle>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
      {features.map((f) => (
        <div
          key={f.title}
          style={{ padding: "18px 16px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: brand.rgba(0.1), border: `1px solid ${brand.rgba(0.2)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: brand.color }}>✦</span>
            <span>
              <span style={{ display: "block", fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.88)", marginBottom: 4 }}>{f.title}</span>
              <span style={{ fontFamily: BODY, fontSize: 13, color: "rgba(255,255,255,0.32)", lineHeight: 1.6 }}>{f.desc}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  </SectionBlock>
);

/* ─── Tech stack ─────────────────────────────────── */
const MobileTech = ({ tech, brand }) => (
  <SectionBlock id="cs-tech">
    <SectionEyebrow color={brand.color}>Architecture</SectionEyebrow>
    <SectionTitle>Built with</SectionTitle>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
      {tech.map((cat) => (
        <div key={cat.category} style={{ padding: "18px 16px", borderRadius: 14, background: "rgba(255,255,255,0.025)", border: `1px solid ${brand.rgba(0.12)}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${brand.color}, transparent)` }} />
          <div style={{ fontFamily: FONT, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: brand.color, opacity: 0.8, marginBottom: 12 }}>{cat.category}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cat.items.map((item) => (
              <span key={item} style={{ padding: "7px 12px", borderRadius: 999, background: brand.rgba(0.08), border: `1px solid ${brand.rgba(0.18)}`, fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.72)", fontWeight: 500 }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </SectionBlock>
);

/* ─── CTA footer ─────────────────────────────────── */
const MobileCTA = ({ brand, title, description, liveUrl, liveLabel }) => (
  <section id="cs-cta" style={{ padding: "56px 20px 100px", textAlign: "center", scrollMarginTop: 58 }}>
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <span style={{ width: 20, height: 1, background: brand.rgba(0.5) }} />
      <span style={{ fontFamily: FONT, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: brand.color }}>Live</span>
      <span style={{ width: 20, height: 1, background: brand.rgba(0.5) }} />
    </div>
    <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em", color: "rgba(255,255,255,0.92)", margin: "0 0 10px", lineHeight: 1.15 }}>{title}</h2>
    <p style={{ fontFamily: BODY, fontSize: 14, color: "rgba(255,255,255,0.32)", margin: "0 auto 28px", maxWidth: 300, lineHeight: 1.65 }}>{description}</p>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto" }}>
      {liveUrl && (
        <motion.a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.98 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 50, borderRadius: 14, background: brand.color, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#080808", textDecoration: "none" }}
        >
          {liveLabel || "Visit Live Site"} <HiArrowUpRight size={15} />
        </motion.a>
      )}
      <Link
        to={getHomeBackLink()}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 48, borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", fontFamily: FONT, fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
      >
        <HiChevronLeft size={14} /> Back to portfolio
      </Link>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════
   MAIN MOBILE LAYOUT
═══════════════════════════════════════════════════ */
export default function CaseStudyMobileLayout({
  brand,
  eyebrow,
  title,
  summary,
  logo,
  meta,
  ctas,
  preview,
  webShowcase,
  videoWebShowcase,
  appShowcases = [],
  videoAppShowcase,
  features,
  tech,
  cta,
  renderPhone,
}) {
  const [activeNav, setActiveNav] = useState("cs-hero");

  const navSections = [
    { id: "cs-hero", label: "Overview" },
    ...(webShowcase ? [{ id: webShowcase.id, label: "Website" }] : []),
    ...(videoWebShowcase ? [{ id: videoWebShowcase.id, label: "Website" }] : []),
    ...appShowcases.map((a) => ({ id: a.id, label: a.navLabel || a.title })),
    ...(videoAppShowcase ? [{ id: videoAppShowcase.id, label: "Mobile" }] : []),
    { id: "cs-features", label: "Features" },
    { id: "cs-tech", label: "Tech" },
  ];

  const onSectionChange = useCallback((id) => {
    setActiveNav((prev) => (prev === id ? prev : id));
  }, []);

  const navigateTo = useCallback((id) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "100%", overflowX: "hidden", background: "#080808", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 400, height: 320, background: `radial-gradient(ellipse, ${brand.rgba(0.05)} 0%, transparent 65%)`, pointerEvents: "none" }} />

      <MobileCaseNav sections={navSections} brand={brand} activeId={activeNav} onSectionChange={onSectionChange} onNavigate={navigateTo} />

      <div id="cs-hero" style={{ scrollMarginTop: 58 }}>
        <MobileHero
          brand={brand}
          eyebrow={eyebrow}
          title={title}
          summary={summary}
          logo={logo}
          meta={meta}
          ctas={ctas}
          preview={preview}
        />
      </div>

      <Divider rgba={brand.rgba} />

      {webShowcase && (
        <>
          <MobileWebGallery {...webShowcase} brand={brand} />
          <Divider rgba={brand.rgba} />
        </>
      )}

      {videoWebShowcase && (
        <>
          <MobileVideoShowcase {...videoWebShowcase} brand={brand} phone={false} />
          <Divider rgba={brand.rgba} />
        </>
      )}

      {appShowcases.map((showcase) => (
        <React.Fragment key={showcase.id}>
          <MobileAppShowcase {...showcase} brand={brand} renderPhone={renderPhone} />
          <Divider rgba={brand.rgba} />
        </React.Fragment>
      ))}

      {videoAppShowcase && (
        <>
          <MobileVideoShowcase {...videoAppShowcase} brand={brand} phone />
          <Divider rgba={brand.rgba} />
        </>
      )}

      <MobileFeatures features={features} brand={brand} />

      <Divider rgba={brand.rgba} />

      <MobileTech tech={tech} brand={brand} />

      <MobileCTA brand={brand} {...cta} />
    </div>
  );
}
