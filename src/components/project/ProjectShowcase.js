import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import OptimizedImage from "../ui/OptimizedImage";
import LazyVideo from "../ui/LazyVideo";
import "./project-showcase.css";

export const ACCENT = {
  violet: {
    color: "#818cf8",
    glow: "rgba(129,140,248,0.32)",
    softGlow: "rgba(129,140,248,0.12)",
    bg: "rgba(129,140,248,0.07)",
    border: "rgba(129,140,248,0.22)",
  },
  cyan: {
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.28)",
    softGlow: "rgba(34,211,238,0.10)",
    bg: "rgba(34,211,238,0.07)",
    border: "rgba(34,211,238,0.20)",
  },
};

/* Still screenshot by default; swaps to its looping video while `active`
   (hover / active carousel slide). The poster is the same still, so the
   swap has no flash. Reduced-motion users keep the still. */
const Screen = ({ image, video, active, alt, className }) => {
  const reduceMotion = useReducedMotion();
  if (video && active && !reduceMotion) {
    return <LazyVideo eager src={video} poster={image} className={className} aria-label={alt} />;
  }
  return <OptimizedImage src={image} alt={alt} className={className} />;
};

const Phone = ({ image, video, active, alt, className = "" }) => (
  <div className={`showcase__phone ${className}`}>
    <span className="showcase__notch" aria-hidden="true" />
    <Screen image={image} video={video} active={active} alt={alt} className="showcase__phone-screen" />
  </div>
);

/**
 * Product preview for a project card.
 *  - desktop shot  → fills the frame (the card draws the browser chrome)
 *  - desktop + phone → phone peeks over the bottom-right corner
 *  - phones only   → one or two phones on an accent-lit stage
 * `parallax` ({ x, y } motion values) drifts the phones for depth.
 */
const ProjectShowcase = ({ project, active = false, parallax, compact = false }) => {
  const { showcase = {}, title, logo, logoBadge } = project;
  const { desktop, desktopVideo, phones = [], phoneVideo } = showcase;
  const meta = ACCENT[project.accent] || ACCENT.violet;
  const layout = desktop ? (phones.length ? "overlay" : "desktop") : "phones";
  const visiblePhones = layout === "overlay" ? phones.slice(0, 1) : phones.slice(0, 2);

  return (
    <div
      className={`showcase showcase--${layout}${compact ? " showcase--compact" : ""}${active ? " is-active" : ""}`}
      style={{ "--showcase-glow": meta.glow, "--showcase-accent": meta.color }}
    >
      {layout === "phones" && <div className="showcase__stage" aria-hidden="true" />}

      {desktop && (
        <div className="showcase__desktop">
          <Screen
            image={desktop}
            video={desktopVideo}
            active={active}
            alt={`${title} website`}
            className="showcase__desktop-screen"
          />
        </div>
      )}

      {visiblePhones.length > 0 && (
        <motion.div className="showcase__phones" style={parallax}>
          {visiblePhones.map((src, i) => (
            <Phone
              key={src}
              image={src}
              video={i === 0 ? phoneVideo : undefined}
              active={active}
              alt={`${title} app screen`}
              className={visiblePhones.length > 1 ? `showcase__phone--${i === 0 ? "back" : "front"}` : ""}
            />
          ))}
        </motion.div>
      )}

      {logo && (
        <span className={`showcase__logo${logoBadge === "light" ? " showcase__logo--light" : ""}`}>
          <img src={logo} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        </span>
      )}
    </div>
  );
};

export default ProjectShowcase;
