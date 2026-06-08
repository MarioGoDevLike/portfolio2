import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsArrowRight, BsCheckLg, BsPhone, BsGlobe, BsLayers } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi2";
import { SITE } from "../../constants";
import AnimatedSection from "../ui/AnimatedSection";
import SocialLinks from "../ui/SocialLinks";
import { submitInquiry } from "../../firebase";

/* ─── constants ──────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1];

const PROJECT_TYPES = [
  {
    id: "mobile",
    label: "Mobile App",
    sub: "Flutter · React Native · Android",
    Icon: BsPhone,
    accent: "#818cf8",
    glow: "rgba(129,140,248,0.22)",
    border: "rgba(129,140,248,0.30)",
  },
  {
    id: "web",
    label: "Web Project",
    sub: "React · WordPress · Tailwind",
    Icon: BsGlobe,
    accent: "#22d3ee",
    glow: "rgba(34,211,238,0.22)",
    border: "rgba(34,211,238,0.30)",
  },
  {
    id: "both",
    label: "Full-Stack",
    sub: "Mobile + Web combined",
    Icon: BsLayers,
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.22)",
    border: "rgba(167,139,250,0.30)",
  },
];

const BUDGETS = ["< $1k", "$1k–$5k", "$5k–$15k", "$15k+", "Let's discuss"];
const TIMELINES = ["ASAP", "1–2 months", "3–6 months", "Flexible"];

const PIPELINE_STEPS = [
  "Validating",
  "Securing",
  "Transmitting",
  "Confirming",
];

/* ─── tiny helpers ───────────────────────────────────────── */
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ─── TypeCard — 3-D tilt project type card ─────────────── */
const TypeCard = ({ item, selected, onSelect }) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -y * 14, ry: x * 14 });
  }, []);

  const onLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
    setHovered(false);
  }, []);

  const active = selected === item.id;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onSelect(item.id)}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      style={{
        perspective: 800,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        flex: 1,
        minWidth: 0,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <motion.div
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          transformStyle: "preserve-3d",
          borderRadius: 20,
          padding: "20px 18px",
          background: active
            ? `linear-gradient(145deg, ${item.glow.replace("0.22", "0.18")}, rgba(0,0,0,0))`
            : "rgba(255,255,255,0.025)",
          border: `1px solid ${active ? item.border : "rgba(255,255,255,0.07)"}`,
          boxShadow: active
            ? `0 0 32px ${item.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
            : hovered
            ? "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "background 0.3s, border 0.3s, box-shadow 0.3s",
          textAlign: "left",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* glare layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%)",
            borderRadius: 20,
            pointerEvents: "none",
          }}
        />

        {/* icon */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: 11,
            marginBottom: 14,
            background: active ? `${item.glow}` : "rgba(255,255,255,0.05)",
            border: `1px solid ${active ? item.border : "rgba(255,255,255,0.07)"}`,
            color: active ? item.accent : "rgba(255,255,255,0.4)",
            transition: "all 0.3s",
          }}
        >
          <item.Icon size={17} />
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: active ? "#fff" : "rgba(255,255,255,0.72)",
            transition: "color 0.3s",
            lineHeight: 1.2,
            marginBottom: 5,
          }}
        >
          {item.label}
        </p>
        <p
          style={{
            margin: 0,
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.28)",
            lineHeight: 1.4,
          }}
        >
          {item.sub}
        </p>

        {/* selected check */}
        <AnimatePresence>
          {active && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: item.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 12px ${item.glow}`,
              }}
            >
              <BsCheckLg size={10} color="#000" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

/* ─── Chip — budget / timeline selector ─────────────────── */
const Chip = ({ label, selected, onSelect }) => (
  <motion.button
    type="button"
    onClick={() => onSelect(label)}
    whileTap={{ scale: 0.94 }}
    style={{
      background: selected ? "rgba(129,140,248,0.16)" : "rgba(255,255,255,0.04)",
      border: selected ? "1px solid rgba(129,140,248,0.40)" : "1px solid rgba(255,255,255,0.07)",
      borderRadius: 999,
      padding: "7px 15px",
      cursor: "pointer",
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: 12,
      fontWeight: 500,
      color: selected ? "#818cf8" : "rgba(255,255,255,0.42)",
      transition: "all 0.22s ease",
      boxShadow: selected ? "0 0 16px rgba(129,140,248,0.18)" : "none",
      WebkitTapHighlightColor: "transparent",
    }}
  >
    {label}
  </motion.button>
);

/* ─── InlineInput ────────────────────────────────────────── */
const InlineInput = ({ label, type = "text", value, onChange, error, placeholder, as = "input" }) => {
  const Tag = as;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: error ? "#f87171" : "rgba(255,255,255,0.22)",
        }}
      >
        {error || label}
      </label>
      <Tag
        type={as === "input" ? type : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={as === "textarea" ? 4 : undefined}
        style={{
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.10)"}`,
          padding: "12px 0",
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: "rgba(255,255,255,0.9)",
          outline: "none",
          resize: "none",
          width: "100%",
          lineHeight: 1.6,
          transition: "border-color 0.25s",
        }}
        onFocus={(e) => {
          e.target.style.borderBottomColor = "rgba(129,140,248,0.55)";
        }}
        onBlur={(e) => {
          e.target.style.borderBottomColor = error
            ? "rgba(248,113,113,0.5)"
            : "rgba(255,255,255,0.10)";
        }}
      />
    </div>
  );
};

/* ─── PipelineBar — animated transmit states ────────────── */
const PipelineBar = ({ step }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "40px 0" }}>
    <div style={{ position: "relative" }}>
      {/* outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          border: "1px solid rgba(129,140,248,0.28)",
          borderTopColor: "#818cf8",
          position: "absolute",
          inset: -8,
        }}
      />
      {/* inner dot */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(129,140,248,0.28) 0%, transparent 70%)",
          border: "1px solid rgba(129,140,248,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 20 }}>📡</span>
      </motion.div>
    </div>

    {/* step labels */}
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
          transition={{ duration: 0.3 }}
          style={{
            margin: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#818cf8",
          }}
        >
          {PIPELINE_STEPS[step]}…
        </motion.p>
      </AnimatePresence>
      <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em" }}>
        Securing your transmission
      </p>
    </div>

    {/* progress dots */}
    <div style={{ display: "flex", gap: 6 }}>
      {PIPELINE_STEPS.map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: i <= step ? 1 : 0.2, scale: i === step ? 1.3 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: i <= step ? "#818cf8" : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  </div>
);

/* ─── SuccessScreen ──────────────────────────────────────── */
const SuccessScreen = ({ refId, projectType, onReset }) => {
  const typeObj = PROJECT_TYPES.find((t) => t.id === projectType);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ textAlign: "center", padding: "32px 16px" }}
    >
      {/* Checkmark burst */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 340, damping: 22, delay: 0.15 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(129,140,248,0.24), rgba(34,211,238,0.16))",
          border: "1px solid rgba(129,140,248,0.40)",
          boxShadow: "0 0 48px rgba(129,140,248,0.28)",
          marginBottom: 28,
        }}
      >
        <BsCheckLg size={28} color="#818cf8" />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.25 }}
        style={{
          margin: "0 0 8px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 22,
          color: "#fff",
        }}
      >
        Transmission Received
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={{
          margin: "0 0 28px",
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: "rgba(255,255,255,0.38)",
        }}
      >
        Your {typeObj?.label} inquiry has been secured and delivered.
        <br />I'll be in touch within 24 hours.
      </motion.p>

      {/* Reference ID card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.45 }}
        style={{
          display: "inline-block",
          background: "rgba(129,140,248,0.08)",
          border: "1px solid rgba(129,140,248,0.22)",
          borderRadius: 14,
          padding: "18px 30px",
          marginBottom: 32,
        }}
      >
        <p style={{ margin: "0 0 5px", fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", color: "rgba(129,140,248,0.7)", textTransform: "uppercase" }}>
          Reference ID
        </p>
        <p style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "#818cf8", letterSpacing: "0.05em" }}>
          {refId}
        </p>
        <p style={{ margin: "6px 0 0", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.24)" }}>
          Save this ID to track your inquiry status
        </p>
      </motion.div>

      {/* Status trail */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 32, flexWrap: "wrap" }}
      >
        {["Received ✓", "Under Review", "Replied"].map((s, i) => (
          <React.Fragment key={s}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 11,
              color: i === 0 ? "#34d399" : "rgba(255,255,255,0.22)",
              fontWeight: i === 0 ? 600 : 400,
            }}>
              {s}
            </span>
            {i < 2 && <span style={{ color: "rgba(255,255,255,0.14)", fontSize: 11 }}>→</span>}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Reset */}
      <motion.button
        type="button"
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.65 }}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 999,
          padding: "9px 22px",
          cursor: "pointer",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 12,
          color: "rgba(255,255,255,0.38)",
          transition: "all 0.2s",
        }}
        whileHover={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.18)" }}
      >
        Send another inquiry
      </motion.button>
    </motion.div>
  );
};

/* ─── STEP PANELS ────────────────────────────────────────── */
const STEP_VARIANTS = {
  enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40, filter: "blur(8px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, filter: "blur(8px)" }),
};

/* ─── MissionConsole — the form console panel ───────────── */
const MissionConsole = () => {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [pipelineStep, setPipelineStep] = useState(-1); // -1 = idle
  const [refId, setRefId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // form state
  const [projectType, setProjectType] = useState(null);
  const [budget, setBudget] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({});

  const go = useCallback((next) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }, [step]);

  const validateStep = (s) => {
    const errs = {};
    if (s === 0 && !projectType) errs.projectType = "Please pick a project type";
    if (s === 1 && !message.trim()) errs.message = "Please describe your project";
    if (s === 2) {
      if (!name.trim()) errs.name = "Name is required";
      if (!validateEmail(email)) errs.email = "Enter a valid email";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    go(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setSubmitError(null);

    // run pipeline animation
    let s = 0;
    setPipelineStep(0);
    const tick = () => {
      s++;
      if (s < PIPELINE_STEPS.length) {
        setPipelineStep(s);
        setTimeout(tick, 800);
      }
    };
    setTimeout(tick, 800);

    const totalDelay = PIPELINE_STEPS.length * 800 + 200;

    try {
      const id = await submitInquiry({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        projectType,
        budget: budget || "Not specified",
        timeline: timeline || "Not specified",
        message: message.trim(),
      });

      setTimeout(() => {
        setRefId(id);
        setPipelineStep(-1);
      }, totalDelay);
    } catch (err) {
      console.error("Inquiry submission failed:", err);
      setTimeout(() => {
        setPipelineStep(-1);
        setSubmitError("Submission failed — please email me directly.");
      }, totalDelay);
    }
  };

  const reset = () => {
    setStep(0); setDir(1); setPipelineStep(-1); setRefId(null); setSubmitError(null);
    setProjectType(null); setBudget(null); setTimeline(null);
    setMessage(""); setName(""); setEmail(""); setErrors({});
  };

  /* ── rendering ── */
  const transmitting = pipelineStep >= 0;

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(10,10,13,0.75)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 24,
        padding: "32px 28px",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
        overflow: "hidden",
        minHeight: 360,
      }}
    >
      {/* top-right corner glare */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle at 100% 0%, rgba(129,140,248,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* HUD corners */}
      {[{ top: 10, left: 10 }, { top: 10, right: 10, transform: "rotate(90deg)" }, { bottom: 10, right: 10, transform: "rotate(180deg)" }, { bottom: 10, left: 10, transform: "rotate(270deg)" }].map((s, i) => (
        <div key={i} aria-hidden="true" style={{ position: "absolute", width: 14, height: 14, ...s, pointerEvents: "none" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7 L1 1 L7 1" stroke="rgba(129,140,248,0.25)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      ))}

      {/* mission tag */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(129,140,248,0.7)" }}>
            Mission Brief
          </span>
          <span style={{ width: 1, height: 10, background: "rgba(255,255,255,0.1)" }} />
          {!transmitting && !refId && (
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.24)", letterSpacing: "0.1em" }}>
              STEP {step + 1} / 3
            </span>
          )}
        </div>
        {!transmitting && !refId && (
          <div style={{ display: "flex", gap: 5 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: i <= step ? 16 : 6, height: 4, borderRadius: 999, background: i <= step ? "linear-gradient(90deg,#818cf8,#22d3ee)" : "rgba(255,255,255,0.1)", transition: "all 0.4s ease" }} />
            ))}
          </div>
        )}
      </div>

      {/* ── success ── */}
      {refId && <SuccessScreen refId={refId} projectType={projectType} onReset={reset} />}

      {/* ── transmitting ── */}
      {transmitting && <PipelineBar step={pipelineStep} />}

      {/* ── error fallback ── */}
      {submitError && !transmitting && !refId && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#f87171", fontSize: 13, fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>
          ⚠ {submitError}
        </motion.p>
      )}

      {/* ── form steps ── */}
      {!transmitting && !refId && (
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={STEP_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: EASE }}
          >
            {/* ── STEP 0: Project Type ── */}
            {step === 0 && (
              <div>
                <h3 style={{ margin: "0 0 6px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>
                  What are you building?
                </h3>
                <p style={{ margin: "0 0 20px", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.36)" }}>
                  Select the type of project you have in mind.
                </p>
                {errors.projectType && (
                  <p style={{ margin: "0 0 12px", color: "#f87171", fontSize: 12, fontFamily: "'Inter',sans-serif" }}>{errors.projectType}</p>
                )}
                <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                  {PROJECT_TYPES.map((t) => (
                    <TypeCard key={t.id} item={t} selected={projectType} onSelect={(id) => { setProjectType(id); setErrors((e) => ({ ...e, projectType: null })); }} />
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 1: Scope ── */}
            {step === 1 && (
              <div>
                <h3 style={{ margin: "0 0 6px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>
                  Tell me about the scope
                </h3>
                <p style={{ margin: "0 0 20px", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.36)" }}>
                  Budget, timeline, and a brief description.
                </p>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", display: "block", marginBottom: 10 }}>
                    Budget
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {BUDGETS.map((b) => <Chip key={b} label={b} selected={budget === b} onSelect={setBudget} />)}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", display: "block", marginBottom: 10 }}>
                    Timeline
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {TIMELINES.map((t) => <Chip key={t} label={t} selected={timeline === t} onSelect={setTimeline} />)}
                  </div>
                </div>

                <InlineInput
                  label="Project Brief"
                  as="textarea"
                  value={message}
                  onChange={(v) => { setMessage(v); setErrors((e) => ({ ...e, message: null })); }}
                  placeholder="Describe your project, goals, features you need…"
                  error={errors.message}
                />
              </div>
            )}

            {/* ── STEP 2: Identity ── */}
            {step === 2 && (
              <div>
                <h3 style={{ margin: "0 0 6px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>
                  Who's transmitting?
                </h3>
                <p style={{ margin: "0 0 20px", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.36)" }}>
                  So I can reply directly to you.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px", marginBottom: 8 }}>
                  <InlineInput label="Your Name" value={name} onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: null })); }} placeholder="Alex Johnson" error={errors.name} />
                  <InlineInput label="Email Address" type="email" value={email} onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: null })); }} placeholder="you@domain.com" error={errors.email} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Navigation buttons ── */}
      {!transmitting && !refId && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
          {step > 0 ? (
            <motion.button
              type="button"
              onClick={() => go(step - 1)}
              whileHover={{ x: -2 }}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.36)", padding: 0 }}
            >
              <HiArrowLeft size={15} />
              Back
            </motion.button>
          ) : <div />}

          {step < 2 ? (
            <motion.button
              type="button"
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)",
                border: "none", borderRadius: 999, padding: "10px 22px",
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#000",
                cursor: "pointer",
                boxShadow: "0 6px 24px rgba(129,140,248,0.28)",
              }}
            >
              Continue <BsArrowRight size={13} />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)",
                border: "none", borderRadius: 999, padding: "10px 22px",
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#000",
                cursor: "pointer",
                boxShadow: "0 6px 24px rgba(129,140,248,0.28)",
              }}
            >
              Transmit <BsArrowRight size={13} />
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── ContactSection ─────────────────────────────────────── */
const ContactSection = () => (
  <section className="section pb-28 md:pb-24 lg:pb-28" id="contact">
    <div className="container">
      <div className="divider mb-12 lg:mb-16" />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-24">
        {/* left column */}
        <AnimatedSection direction="right" delay={0.2} className="flex-1">
          <span className="label">Mission Brief</span>

          <h2 className="text-display-sm mb-7">
            Let's build
            <br />
            <span className="text-gradient">something great.</span>
          </h2>

          <p className="text-body text-white/40 mb-5 max-w-[340px]">
            Select your project type, describe your scope, and transmit — I'll
            be back within 24 hours.
          </p>

          <SocialLinks email={SITE.email} className="mb-0" />
        </AnimatedSection>

        {/* right column — console */}
        <AnimatedSection direction="left" delay={0.3} className="flex-1">
          <MissionConsole />
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default ContactSection;
