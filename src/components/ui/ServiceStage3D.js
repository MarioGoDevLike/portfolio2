import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import {
  SiFlutter,
  SiReact,
  SiWordpress,
  SiTailwindcss,
  SiAndroid,
} from "react-icons/si";
import { FaMobileAlt } from "react-icons/fa";
import { SERVICES } from "../../constants";

const EASE_EXPO = [0.22, 1, 0.36, 1];

const SERVICE_META = {
  mobile: {
    accent: "#54C5F8",
    glow: "rgba(84,197,248,0.28)",
    bg: "rgba(84,197,248,0.06)",
    border: "rgba(84,197,248,0.22)",
    gradient: "linear-gradient(145deg, rgba(129,140,248,0.14) 0%, rgba(84,197,248,0.08) 100%)",
    orbitIcons: [SiFlutter, SiReact, FaMobileAlt, SiAndroid],
  },
  web: {
    accent: "#818CF8",
    glow: "rgba(129,140,248,0.28)",
    bg: "rgba(129,140,248,0.06)",
    border: "rgba(129,140,248,0.22)",
    gradient: "linear-gradient(145deg, rgba(129,140,248,0.14) 0%, rgba(34,211,238,0.08) 100%)",
    orbitIcons: [SiReact, SiWordpress, SiTailwindcss],
  },
};

const ORBIT_POSITIONS = [
  { x: -42, y: -28, delay: 0 },
  { x: 48, y: -36, delay: 0.4 },
  { x: -38, y: 42, delay: 0.8 },
  { x: 52, y: 38, delay: 1.2 },
];

/* ─── single 3D service monolith ─── */
const ServiceMonolith = ({ service, index, baseRotateY = 0 }) => {
  const meta = SERVICE_META[service.id] ?? SERVICE_META.web;
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 260,
    damping: 22,
  });
  const glareX = useSpring(useTransform(mx, [-0.5, 0.5], [0, 100]), {
    stiffness: 200,
    damping: 26,
  });
  const glareY = useSpring(useTransform(my, [-0.5, 0.5], [0, 100]), {
    stiffness: 200,
    damping: 26,
  });

  const onPointerMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mx, my]);

  const onPointerLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  return (
    <motion.article
      ref={cardRef}
      className="relative w-full"
      style={{
        perspective: 1100,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 48, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.15 + index * 0.14 }}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        className="relative rounded-[28px] overflow-hidden select-none"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transform: hovered
            ? "translateZ(28px)"
            : `rotateY(${baseRotateY}deg) translateZ(0px)`,
          transition: "transform 0.35s ease",
          minHeight: 340,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        {/* glass shell */}
        <div
          className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{
            background: meta.gradient,
            border: `1px solid ${hovered ? meta.border : "rgba(255,255,255,0.08)"}`,
            boxShadow: hovered
              ? `0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px ${meta.border}, 0 0 60px ${meta.glow}`
              : "0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        />

        {/* grid plane */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            transform: "perspective(400px) rotateX(58deg) scale(1.6) translateY(18%)",
            transformOrigin: "center bottom",
            maskImage: "linear-gradient(to top, black 0%, transparent 75%)",
          }}
          aria-hidden="true"
        />

        {/* cursor glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[28px]"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.14) 0%, transparent 55%)`,
            opacity: hovered ? 1 : 0.35,
          }}
        />

        {/* watermark number */}
        <span
          className="absolute font-primary font-bold leading-none pointer-events-none select-none"
          style={{
            right: 20,
            top: 12,
            fontSize: "clamp(72px, 14vw, 120px)",
            color: "rgba(255,255,255,0.025)",
            transform: "translateZ(-20px)",
            letterSpacing: "-0.04em",
          }}
          aria-hidden="true"
        >
          {service.number}
        </span>

        {/* HUD corners */}
        {["tl", "tr", "bl", "br"].map((corner) => (
          <span
            key={corner}
            className="absolute w-5 h-5 pointer-events-none"
            style={{
              ...(corner.includes("t") ? { top: 18 } : { bottom: 18 }),
              ...(corner.includes("l") ? { left: 18 } : { right: 18 }),
              borderColor: meta.accent,
              borderStyle: "solid",
              borderWidth: 0,
              ...(corner === "tl" && { borderTopWidth: 1, borderLeftWidth: 1 }),
              ...(corner === "tr" && { borderTopWidth: 1, borderRightWidth: 1 }),
              ...(corner === "bl" && { borderBottomWidth: 1, borderLeftWidth: 1 }),
              ...(corner === "br" && { borderBottomWidth: 1, borderRightWidth: 1 }),
              opacity: hovered ? 0.7 : 0.25,
              transition: "opacity 0.3s",
            }}
            aria-hidden="true"
          />
        ))}

        {/* orbiting icons */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 120,
            height: 120,
            right: 24,
            top: "38%",
            transform: "translateZ(40px)",
          }}
          aria-hidden="true"
        >
          {meta.orbitIcons.map((Icon, i) => {
            const pos = ORBIT_POSITIONS[i % ORBIT_POSITIONS.length];
            return (
              <motion.div
                key={i}
                className="absolute flex items-center justify-center rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  left: "50%",
                  top: "50%",
                  marginLeft: -18,
                  marginTop: -18,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: `0 0 20px ${meta.glow}`,
                }}
                animate={{
                  x: [pos.x, pos.x * 1.15, pos.x],
                  y: [pos.y, pos.y - 8, pos.y],
                  rotate: [0, 8, 0],
                }}
                transition={{
                  duration: 4 + i * 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: pos.delay,
                }}
              >
                <Icon size={15} style={{ color: meta.accent, opacity: 0.85 }} />
              </motion.div>
            );
          })}
        </div>

        {/* content */}
        <div className="relative z-10 p-7 md:p-9 flex flex-col h-full min-h-[340px]">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="font-primary text-[10px] uppercase tracking-[4px]"
              style={{ color: meta.accent }}
            >
              {service.number}
            </span>
            <span
              className="h-px flex-1 max-w-[48px]"
              style={{ background: `linear-gradient(90deg, ${meta.accent}, transparent)` }}
            />
          </div>

          <h3
            className="font-primary font-semibold text-white/90 mb-4 pr-16"
            style={{ fontSize: "clamp(20px, 2.8vw, 28px)" }}
          >
            {service.name}
          </h3>

          <p className="font-secondary text-white/35 leading-relaxed text-[14px] mb-8 flex-1 max-w-[92%]">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {service.tags.map((tag, i) => (
              <motion.span
                key={tag}
                className="font-primary rounded-full text-[10px] tracking-[2px] uppercase px-3 py-[6px]"
                style={{
                  color: hovered ? meta.accent : "rgba(255,255,255,0.35)",
                  background: hovered ? meta.bg : "rgba(255,255,255,0.03)",
                  border: `1px solid ${hovered ? meta.border : "rgba(255,255,255,0.07)"}`,
                  transition: "all 0.25s ease",
                }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 + i * 0.06 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* scan line */}
          <motion.div
            className="absolute left-6 right-6 h-px pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
              opacity: 0.5,
              top: "50%",
            }}
            animate={{ top: ["22%", "78%", "22%"], opacity: [0, 0.6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
            aria-hidden="true"
          />
        </div>

        {/* arrow affordance */}
        <motion.div
          className="absolute bottom-7 right-7 flex items-center justify-center rounded-full"
          style={{
            width: 40,
            height: 40,
            background: hovered ? meta.bg : "rgba(255,255,255,0.04)",
            border: `1px solid ${hovered ? meta.border : "rgba(255,255,255,0.08)"}`,
            transform: "translateZ(50px)",
          }}
          animate={{ rotate: hovered ? 0 : -45 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <HiArrowUpRight size={16} style={{ color: hovered ? meta.accent : "rgba(255,255,255,0.35)" }} />
        </motion.div>
      </motion.div>
    </motion.article>
  );
};

/* ─── stage wrapper ─── */
const ServiceStage3D = () => (
  <div
    className="relative"
    style={{ perspective: 1400, perspectiveOrigin: "50% 40%" }}
  >
    {/* ambient floor glow */}
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-full"
      style={{
        bottom: -40,
        width: "70%",
        height: 80,
        background: "radial-gradient(ellipse, rgba(129,140,248,0.12) 0%, transparent 70%)",
        filter: "blur(24px)",
      }}
      aria-hidden="true"
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 relative z-10">
      {SERVICES.map((service, index) => (
        <ServiceMonolith
          key={service.id}
          service={service}
          index={index}
          baseRotateY={index === 0 ? -4 : 4}
        />
      ))}
    </div>
  </div>
);

export default ServiceStage3D;
