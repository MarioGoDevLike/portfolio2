import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { SITE, SOCIAL_LINKS } from "../constants";

const EASE_EXPO = [0.22, 1, 0.36, 1];

const ICON_MAP = { github: FaGithub, linkedin: FaLinkedin, instagram: FaInstagram };

/* staggered children */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
};

/* live clock */
const useClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const MaintenancePage = () => {
  const clock = useClock();

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden dot-grid"
      style={{ background: "#050505", color: "#f1f5f9" }}
    >
      {/* ── ambient orbs ── */}
      <div className="orb orb-violet" aria-hidden="true" />
      <div className="orb orb-cyan"   aria-hidden="true" />

      {/* ── top bar ── */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-6 md:px-12 pt-7"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_EXPO }}
      >
        {/* monogram */}
        <div
          className="flex items-center justify-center rounded-[10px] font-primary font-bold text-[11px] select-none"
          style={{
            width: 36, height: 36,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <span className="text-white">M</span>
          <span style={{ color: "#7B96FF" }}>N</span>
        </div>

        {/* live clock */}
        <span
          className="font-primary text-[11px] tracking-[3px] tabular-nums"
          style={{ color: "rgba(255,255,255,0.18)" }}
        >
          {clock}
        </span>
      </motion.header>

      {/* ── main content ── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-12">
        <motion.div
          className="max-w-[600px] w-full"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* status badge */}
          <motion.div variants={item} className="flex items-center gap-2.5 mb-10">
            <span
              className="relative flex items-center justify-center w-[7px] h-[7px] flex-shrink-0"
              aria-hidden="true"
            >
              {/* ping ring */}
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{
                  background: "rgba(129,140,248,0.5)",
                  animation: "ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
              <span
                className="relative inline-flex rounded-full w-[7px] h-[7px]"
                style={{ background: "#818cf8" }}
              />
            </span>
            <span
              className="font-primary text-[10px] uppercase tracking-[5px]"
              style={{ color: "rgba(129,140,248,0.75)" }}
            >
              Under Maintenance
            </span>
          </motion.div>

          {/* headline */}
          <motion.h1 variants={item} className="font-primary font-bold leading-none tracking-tight mb-6"
            style={{ fontSize: "clamp(52px, 10vw, 96px)" }}
          >
            We'll be
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              back soon.
            </span>
          </motion.h1>

          {/* body copy */}
          <motion.p
            variants={item}
            className="font-secondary leading-relaxed mb-12 max-w-[420px]"
            style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "rgba(255,255,255,0.38)" }}
          >
            We're currently polishing things up to give you a better experience.
            Sit tight — something great is almost ready.
          </motion.p>

          {/* progress bar */}
          <motion.div variants={item} className="mb-3">
            <div
              className="relative h-px w-full overflow-hidden rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #818cf8 0%, #22d3ee 100%)",
                  boxShadow: "0 0 10px rgba(129,140,248,0.5)",
                }}
                animate={{ width: ["0%", "72%", "72%", "0%"] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: ["easeInOut", "linear", "easeInOut"],
                  times: [0, 0.55, 0.75, 1],
                }}
              />
            </div>
          </motion.div>

          <motion.div variants={item} className="flex items-center justify-between mb-16">
            <span
              className="font-primary text-[10px] uppercase tracking-[4px]"
              style={{ color: "rgba(255,255,255,0.16)" }}
            >
              Work in progress
            </span>
            <span
              className="font-primary text-[10px] tabular-nums"
              style={{ color: "rgba(255,255,255,0.14)" }}
            >
              72%
            </span>
          </motion.div>

          {/* divider */}
          <motion.div
            variants={item}
            className="mb-10"
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.07) 40%, rgba(255,255,255,0.07) 60%, transparent)",
            }}
          />

          {/* socials + contact */}
          <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ id, label, href }) => {
                const Icon = ICON_MAP[id];
                if (!Icon) return null;
                return (
                  <motion.a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 40, height: 40,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.3)",
                    }}
                    whileHover={{ scale: 1.1, color: "#f1f5f9", borderColor: "rgba(255,255,255,0.18)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <Icon size={15} />
                  </motion.a>
                );
              })}
            </div>

            <a
              href={`mailto:${SITE.email}`}
              className="font-primary text-[12px] tracking-wide transition-colors duration-300"
              style={{ color: "rgba(255,255,255,0.22)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
            >
              {SITE.email}
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* ── footer ── */}
      <motion.footer
        className="relative z-10 flex items-center justify-between px-6 md:px-12 pb-7 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span
          className="font-secondary text-[11px]"
          style={{ color: "rgba(255,255,255,0.12)" }}
        >
          © {new Date().getFullYear()} {SITE.name}
        </span>
        <span
          className="font-primary text-[9px] uppercase tracking-[4px]"
          style={{ color: "rgba(255,255,255,0.10)" }}
        >
          {SITE.role}
        </span>
      </motion.footer>

      {/* inline keyframes for the ping animation */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MaintenancePage;
