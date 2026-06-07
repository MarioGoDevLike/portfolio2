import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  SiReact,
  SiFlutter,
  SiTypescript,
  SiWordpress,
  SiNodedotjs,
  SiTailwindcss,
  SiAndroidstudio,
  SiFirebase,
  SiFigma,
  SiJavascript,
} from "react-icons/si";
import { FaMobileAlt } from "react-icons/fa";

/* ─── skill data ──────────────────────────────── */
const SKILLS = [
  { name: "React",          Icon: SiReact,          color: "#61DAFB", glow: "rgba(97,218,251,0.22)",   bg: "rgba(97,218,251,0.10)",   border: "rgba(97,218,251,0.32)"  },
  { name: "Flutter",        Icon: SiFlutter,        color: "#54C5F8", glow: "rgba(84,197,248,0.22)",   bg: "rgba(84,197,248,0.10)",   border: "rgba(84,197,248,0.32)"  },
  { name: "TypeScript",     Icon: SiTypescript,     color: "#60A5FA", glow: "rgba(96,165,250,0.22)",   bg: "rgba(96,165,250,0.10)",   border: "rgba(96,165,250,0.32)"  },
  { name: "JavaScript",     Icon: SiJavascript,     color: "#FDE047", glow: "rgba(253,224,71,0.18)",   bg: "rgba(253,224,71,0.08)",   border: "rgba(253,224,71,0.28)"  },
  { name: "WordPress",      Icon: SiWordpress,      color: "#7DD3FC", glow: "rgba(125,211,252,0.20)",  bg: "rgba(125,211,252,0.08)",  border: "rgba(125,211,252,0.30)" },
  { name: "Node.js",        Icon: SiNodedotjs,      color: "#4ADE80", glow: "rgba(74,222,128,0.20)",   bg: "rgba(74,222,128,0.08)",   border: "rgba(74,222,128,0.30)"  },
  { name: "Tailwind CSS",   Icon: SiTailwindcss,    color: "#22D3EE", glow: "rgba(34,211,238,0.22)",   bg: "rgba(34,211,238,0.10)",   border: "rgba(34,211,238,0.32)"  },
  { name: "React Native",   Icon: SiReact,          color: "#818CF8", glow: "rgba(129,140,248,0.22)",  bg: "rgba(129,140,248,0.10)",  border: "rgba(129,140,248,0.32)" },
  { name: "Firebase",       Icon: SiFirebase,       color: "#FCD34D", glow: "rgba(252,211,77,0.18)",   bg: "rgba(252,211,77,0.08)",   border: "rgba(252,211,77,0.28)"  },
  { name: "Android Studio", Icon: SiAndroidstudio,  color: "#34D399", glow: "rgba(52,211,153,0.20)",   bg: "rgba(52,211,153,0.08)",   border: "rgba(52,211,153,0.30)"  },
  { name: "Figma",          Icon: SiFigma,          color: "#F87171", glow: "rgba(248,113,113,0.20)",  bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.30)" },
  { name: "Mobile Dev",     Icon: FaMobileAlt,      color: "#C084FC", glow: "rgba(192,132,252,0.20)",  bg: "rgba(192,132,252,0.09)",  border: "rgba(192,132,252,0.30)" },
];

/* ─── maths ───────────────────────────────────── */

/** Fibonacci sphere — even distribution of N points on a unit sphere */
function genSpherePoints(n) {
  const phi = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = phi * i;
    return [r * Math.cos(t), y, r * Math.sin(t)];
  });
}

/** Rotate a point [x,y,z] by rx (pitch) then ry (yaw) */
function rotatePoint([x, y, z], rx, ry) {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cx2 = Math.cos(rx), sx2 = Math.sin(rx);
  const y1 = y * cx2 - z1 * sx2;
  const z2 = y * sx2 + z1 * cx2;
  return [x1, y1, z2];
}

const BASE_POINTS = genSpherePoints(SKILLS.length);

/* ─── component ───────────────────────────────── */
const TagCloud3D = ({ width = 380, height = 460, radius = 152 }) => {
  const wrapRef    = useRef(null);
  const inView     = useInView(wrapRef, { once: true, margin: "0px 0px -60px 0px" });
  const rotRef     = useRef({ x: 0.22, y: 0 });
  const dragRef    = useRef({ on: false, lastX: 0, lastY: 0 });
  const pausedRef  = useRef(false);
  const rafRef     = useRef(null);
  const [, forceRender] = useState(0);
  const [hovered, setHovered]   = useState(null);
  const [visible, setVisible]   = useState(false);

  /* entrance reveal */
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setVisible(true), 80);
      return () => clearTimeout(t);
    }
  }, [inView]);

  /* auto-rotation RAF loop */
  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current && !dragRef.current.on) {
        rotRef.current.y += 0.0045;
        forceRender(n => n + 1);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* pause on hover */
  useEffect(() => {
    pausedRef.current = hovered !== null;
  }, [hovered]);

  /* ── pointer handlers (mouse + touch unified) ── */
  const onPointerDown = useCallback((e) => {
    wrapRef.current?.setPointerCapture(e.pointerId);
    dragRef.current = { on: true, lastX: e.clientX, lastY: e.clientY };
    pausedRef.current = true;
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current.on) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    rotRef.current.y += dx * 0.007;
    rotRef.current.x = Math.max(-0.65, Math.min(0.65, rotRef.current.x + dy * 0.007));
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    forceRender(n => n + 1);
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current.on = false;
    pausedRef.current = hovered !== null;
  }, [hovered]);

  /* ── compute 2D projections ── */
  const cx = width  / 2;
  const cy = height / 2;

  const nodes = SKILLS.map((skill, i) => {
    const [sx, sy, sz] = rotatePoint(BASE_POINTS[i], rotRef.current.x, rotRef.current.y);
    const depth  = (sz + 1) / 2;                  // 0=back, 1=front
    const scale  = 0.46 + depth * 0.72;
    const opac   = depth < 0.08 ? 0 : Math.min(1, 0.14 + depth * 0.86);
    const blur   = depth < 0.32 ? (0.32 - depth) * 10 : 0;
    const size   = Math.round((36 + depth * 24) * scale);
    const iSize  = Math.round((11 + depth * 13) * scale);
    return { ...skill, px: cx + sx * radius, py: cy + sy * radius, depth, opac, blur, size, iSize, z: Math.round(depth * 100) };
  }).sort((a, b) => a.depth - b.depth); // render back→front

  /* orbital ring helpers */
  const eqRy  = Math.max(2, radius * Math.abs(Math.sin(rotRef.current.x)));
  const merRx = Math.max(2, radius * Math.abs(Math.cos(rotRef.current.y + 0.9)));

  return (
    <motion.div
      ref={wrapRef}
      style={{
        width,
        height,
        position: "relative",
        touchAction: "none",
        cursor: dragRef.current.on ? "grabbing" : "grab",
      }}
      initial={{ opacity: 0, scale: 0.88, y: 24 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* ── glass frame ── */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: "rgba(10,10,14,0.55)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(2px)",
        }}
        aria-hidden="true"
      />

      {/* ── deep ambient glow ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 260, height: 260,
          left: cx - 130, top: cy - 130,
          background:
            "radial-gradient(circle, rgba(129,140,248,0.11) 0%, rgba(34,211,238,0.05) 52%, transparent 72%)",
          filter: "blur(1px)",
        }}
        aria-hidden="true"
      />

      {/* ── SVG: orbital rings ── */}
      <svg
        style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
        width={width}
        height={height}
        aria-hidden="true"
      >
        {/* equatorial ring */}
        <ellipse
          cx={cx} cy={cy}
          rx={radius + 8} ry={eqRy}
          fill="none"
          stroke="rgba(129,140,248,0.14)"
          strokeWidth={0.75}
          strokeDasharray="5 8"
        />
        {/* meridian ring */}
        <ellipse
          cx={cx} cy={cy}
          rx={merRx} ry={radius + 8}
          fill="none"
          stroke="rgba(34,211,238,0.09)"
          strokeWidth={0.75}
          strokeDasharray="3 10"
        />
        {/* outer halo circle */}
        <circle
          cx={cx} cy={cy}
          r={radius + 28}
          fill="none"
          stroke="rgba(255,255,255,0.035)"
          strokeWidth={0.75}
        />
        {/* inner subtle circle */}
        <circle
          cx={cx} cy={cy}
          r={radius - 20}
          fill="none"
          stroke="rgba(255,255,255,0.025)"
          strokeWidth={0.5}
          strokeDasharray="2 12"
        />
      </svg>

      {/* ── corner label ── */}
      <span
        className="absolute font-primary uppercase select-none pointer-events-none"
        style={{ top: 16, right: 18, fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.11)" }}
      >
        Tech Stack
      </span>

      {/* ── drag hint ── */}
      <span
        className="absolute left-1/2 -translate-x-1/2 font-primary uppercase select-none pointer-events-none"
        style={{ bottom: 13, fontSize: 8, letterSpacing: "0.22em", color: "rgba(255,255,255,0.09)" }}
      >
        drag to explore
      </span>

      {/* ── skill nodes ── */}
      {nodes.map((node) => {
        const isHov = hovered === node.name;
        return (
          <div
            key={node.name}
            style={{
              position: "absolute",
              left:    node.px - node.size / 2,
              top:     node.py - node.size / 2,
              width:   node.size,
              height:  node.size,
              zIndex:  isHov ? 200 : node.z,
              opacity: node.opac,
              filter:  node.blur > 0 ? `blur(${node.blur.toFixed(1)}px)` : undefined,
              pointerEvents: node.opac < 0.12 ? "none" : "auto",
            }}
          >
            {/* tooltip */}
            <AnimatePresence>
              {isHov && (
                <motion.span
                  className="absolute left-1/2 whitespace-nowrap font-primary font-semibold pointer-events-none select-none"
                  style={{
                    bottom: "calc(100% + 8px)",
                    transform: "translateX(-50%)",
                    fontSize: 11,
                    padding: "5px 12px",
                    borderRadius: 999,
                    background: "rgba(6,6,10,0.95)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: node.color,
                    boxShadow: `0 4px 20px ${node.glow}`,
                    zIndex: 300,
                  }}
                  initial={{ opacity: 0, y: 6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={  { opacity: 0, y: 6, scale: 0.85 }}
                  transition={{ duration: 0.13, ease: "easeOut" }}
                >
                  {node.name}
                </motion.span>
              )}
            </AnimatePresence>

            {/* bubble */}
            <div
              style={{
                width: "100%", height: "100%",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isHov
                  ? node.bg
                  : `rgba(255,255,255,${(0.022 + node.depth * 0.068).toFixed(3)})`,
                border: isHov
                  ? `1px solid ${node.border}`
                  : `1px solid rgba(255,255,255,${(0.04 + node.depth * 0.12).toFixed(2)})`,
                boxShadow: isHov
                  ? `0 0 32px ${node.glow}, 0 0 8px ${node.glow}, inset 0 1px 0 rgba(255,255,255,0.14)`
                  : `inset 0 1px 0 rgba(255,255,255,${(0.04 + node.depth * 0.07).toFixed(2)})`,
                transform: isHov ? "scale(1.24)" : "scale(1)",
                transition:
                  "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), background 0.2s, border-color 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHovered(node.name)}
              onMouseLeave={() => setHovered(null)}
              onTouchEnd={(e) => {
                e.stopPropagation();
                setHovered(h => (h === node.name ? null : node.name));
              }}
            >
              <node.Icon
                size={node.iSize}
                style={{
                  color: isHov
                    ? node.color
                    : `rgba(255,255,255,${(0.18 + node.depth * 0.58).toFixed(2)})`,
                  transition: "color 0.2s",
                  pointerEvents: "none",
                  flexShrink: 0,
                }}
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default TagCloud3D;
