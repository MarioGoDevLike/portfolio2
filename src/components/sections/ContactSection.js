import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsGlobe, BsLayers, BsPhone } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import {
  HiArrowRight,
  HiArrowUpRight,
  HiCheck,
  HiClock,
  HiEnvelope,
  HiExclamationCircle,
  HiMapPin,
  HiOutlineDocumentDuplicate,
} from "react-icons/hi2";
import { SITE } from "../../constants";
import { submitInquiry } from "../../firebase";
import AnimatedSection from "../ui/AnimatedSection";
import SocialLinks from "../ui/SocialLinks";
import "./contact.css";

const EASE = [0.22, 1, 0.36, 1];

/* Ids are stored in Firestore and read by the admin dashboard — keep them stable. */
const PROJECT_TYPES = [
  { id: "mobile", label: "Mobile app", sub: "iOS & Android", Icon: BsPhone },
  { id: "web", label: "Website", sub: "Sites & web apps", Icon: BsGlobe },
  { id: "both", label: "Both", sub: "Web + mobile", Icon: BsLayers },
];
const BUDGETS = ["< $1k", "$1k–$5k", "$5k–$15k", "$15k+", "Not sure yet"];
const TIMELINES = ["ASAP", "1–2 months", "3–6 months", "Flexible"];

const LIMITS = { name: 100, email: 200, message: 2000 };
/* Offline, Firestore queues writes and never settles the promise — cap the wait. */
const SUBMIT_TIMEOUT_MS = 15000;
const EMPTY_FORM = { projectType: "", name: "", email: "", budget: "", timeline: "", message: "", company: "" };

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function validate(form) {
  const errors = {};
  if (!form.projectType) errors.projectType = "Choose what you need.";
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!isEmail(form.email.trim())) errors.email = "Enter a valid email so I can reply.";
  if (form.message.trim().length < 10) errors.message = "A sentence or two about the project helps.";
  return errors;
}

/* ─── Direct channels ────────────────────────────── */

const CopyEmailButton = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  return (
    <button type="button" className="ct-copy" onClick={copy} aria-label={copied ? "Email copied" : "Copy email address"}>
      {copied ? <HiCheck aria-hidden="true" /> : <HiOutlineDocumentDuplicate aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
};

const DirectChannels = () => (
  <ul className="ct-channels">
    <li className="ct-channel">
      <HiEnvelope className="ct-channel__icon" aria-hidden="true" />
      <div className="ct-channel__body">
        <span className="ct-channel__label">Email</span>
        <a className="ct-channel__value" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
      </div>
      <CopyEmailButton />
    </li>
    <li className="ct-channel">
      <FaWhatsapp className="ct-channel__icon" aria-hidden="true" />
      <div className="ct-channel__body">
        <span className="ct-channel__label">WhatsApp</span>
        <a className="ct-channel__value" href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">
          {SITE.whatsappDisplay}
        </a>
      </div>
      <a
        className="ct-copy"
        href={SITE.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open WhatsApp chat"
      >
        <span>Chat</span>
        <HiArrowUpRight aria-hidden="true" />
      </a>
    </li>
    <li className="ct-channel">
      <HiMapPin className="ct-channel__icon" aria-hidden="true" />
      <div className="ct-channel__body">
        <span className="ct-channel__label">Based in</span>
        <span className="ct-channel__value">{SITE.location}</span>
      </div>
    </li>
    <li className="ct-channel">
      <HiClock className="ct-channel__icon" aria-hidden="true" />
      <div className="ct-channel__body">
        <span className="ct-channel__label">Reply time</span>
        <span className="ct-channel__value">{SITE.responseTime}</span>
      </div>
    </li>
  </ul>
);

/* ─── Form pieces ────────────────────────────────── */

const Field = ({ id, label, error, counter, children }) => (
  <div className={`ct-field${error ? " has-error" : ""}`}>
    <div className="ct-field__top">
      <label htmlFor={id} className="ct-field__label">
        {label}
      </label>
      {counter}
    </div>
    {children}
    {error && (
      <p id={`${id}-error`} className="ct-field__error">
        <HiExclamationCircle aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
);

/** Native radio group styled as chips — keeps keyboard arrows and screen-reader semantics. */
const ChoiceGroup = ({ name, legend, options, value, onChange, optional, error, variant = "chip" }) => (
  <fieldset
    className={`ct-choices ct-choices--${variant}${error ? " has-error" : ""}`}
    aria-describedby={error ? `${name}-error` : undefined}
  >
    <legend className="ct-field__label">
      {legend}
      {optional && <span className="ct-optional"> (optional)</span>}
    </legend>
    <div className="ct-choices__list">
      {options.map((opt) => {
        const id = typeof opt === "string" ? opt : opt.id;
        const Icon = opt.Icon;
        return (
          <label key={id} className={`ct-choice${value === id ? " is-selected" : ""}`}>
            <input
              type="radio"
              name={name}
              value={id}
              checked={value === id}
              onChange={() => onChange(id)}
              className="ct-sr"
            />
            {Icon && <Icon className="ct-choice__icon" aria-hidden="true" />}
            <span className="ct-choice__text">
              <span className="ct-choice__label">{typeof opt === "string" ? opt : opt.label}</span>
              {opt.sub && <span className="ct-choice__sub">{opt.sub}</span>}
            </span>
          </label>
        );
      })}
    </div>
    {error && (
      <p id={`${name}-error`} className="ct-field__error">
        <HiExclamationCircle aria-hidden="true" />
        {error}
      </p>
    )}
  </fieldset>
);

const SuccessPanel = ({ name, email, refId, onReset }) => {
  const headingRef = useRef(null);
  useEffect(() => headingRef.current?.focus({ preventScroll: true }), []);
  const firstName = name.trim().split(/\s+/)[0];

  return (
    <motion.div
      className="ct-success"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <span className="ct-success__icon" aria-hidden="true">
        <HiCheck />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="ct-success__title">
        Thanks, {firstName} — message sent.
      </h3>
      <p className="ct-success__text">
        I'll reply to <strong>{email}</strong> {SITE.responseTime.toLowerCase()}.
        {refId && (
          <>
            {" "}
            If you follow up, mention reference <strong className="ct-ref">{refId}</strong>.
          </>
        )}
      </p>
      <button type="button" className="ct-btn ct-btn--ghost" onClick={onReset}>
        Send another message
      </button>
    </motion.div>
  );
};

/* ─── Inquiry form ───────────────────────────────── */

const InquiryForm = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [refId, setRefId] = useState(null);
  const formRef = useRef(null);

  const update = (key) => (value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    // After the first submit attempt, re-check as the visitor fixes things.
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setSubmitted(true);

    const found = validate(form);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Honeypot: bots fill every field; people never see this one.
    if (form.company) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    let timer;
    try {
      const id = await Promise.race([
        submitInquiry({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          projectType: form.projectType,
          budget: form.budget || "Not specified",
          timeline: form.timeline || "Not specified",
          message: form.message.trim(),
        }),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error("Submission timed out")), SUBMIT_TIMEOUT_MS);
        }),
      ]);
      setRefId(id);
      setStatus("sent");
    } catch (err) {
      console.error("Inquiry submission failed:", err);
      setStatus("error");
    } finally {
      clearTimeout(timer);
    }
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
    setRefId(null);
    setStatus("idle");
  };

  const invalid = (key) => (errors[key] ? { "aria-invalid": true, "aria-describedby": `${key}-error` } : {});
  const messageLeft = LIMITS.message - form.message.length;

  return (
    <div className="ct-card">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <SuccessPanel key="success" name={form.name} email={form.email.trim()} refId={refId} onReset={reset} />
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            className="ct-form"
            onSubmit={handleSubmit}
            noValidate
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="ct-form__head">
              <h3 className="ct-form__title">Start a project</h3>
              <p className="ct-form__sub">Takes about a minute.</p>
            </div>

            <ChoiceGroup
              name="projectType"
              legend="What do you need?"
              options={PROJECT_TYPES}
              value={form.projectType}
              onChange={update("projectType")}
              error={errors.projectType}
              variant="card"
            />

            <div className="ct-row">
              <Field id="name" label="Name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  className="ct-input"
                  value={form.name}
                  onChange={(e) => update("name")(e.target.value)}
                  autoComplete="name"
                  maxLength={LIMITS.name}
                  placeholder="Your name"
                  {...invalid("name")}
                />
              </Field>
              <Field id="email" label="Email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="ct-input"
                  value={form.email}
                  onChange={(e) => update("email")(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  maxLength={LIMITS.email}
                  placeholder="you@company.com"
                  {...invalid("email")}
                />
              </Field>
            </div>

            <ChoiceGroup
              name="budget"
              legend="Budget"
              options={BUDGETS}
              value={form.budget}
              onChange={update("budget")}
              optional
            />
            <ChoiceGroup
              name="timeline"
              legend="Timeline"
              options={TIMELINES}
              value={form.timeline}
              onChange={update("timeline")}
              optional
            />

            <Field
              id="message"
              label="Project details"
              error={errors.message}
              counter={
                messageLeft < 200 && (
                  <span className="ct-counter" aria-live="polite">
                    {messageLeft} left
                  </span>
                )
              }
            >
              <textarea
                id="message"
                name="message"
                className="ct-input ct-input--area"
                value={form.message}
                onChange={(e) => update("message")(e.target.value)}
                maxLength={LIMITS.message}
                rows={5}
                placeholder="What are you building, who is it for, and what should it do?"
                {...invalid("message")}
              />
            </Field>

            {/* Honeypot — hidden from people and assistive tech. */}
            <div className="ct-hp" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={(e) => update("company")(e.target.value)}
              />
            </div>

            {status === "error" && (
              <div className="ct-alert" role="alert">
                <HiExclamationCircle aria-hidden="true" />
                <p>
                  Your message couldn't be sent. Please try again, or email me at{" "}
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                </p>
              </div>
            )}

            <div className="ct-form__foot">
              <button type="submit" className="ct-btn ct-btn--primary" disabled={status === "sending"}>
                {status === "sending" ? (
                  <>
                    <span className="ct-spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <HiArrowRight aria-hidden="true" />
                  </>
                )}
              </button>
              <p className="ct-form__note">No spam, no newsletters — just a reply.</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Section ────────────────────────────────────── */

const ContactSection = () => (
  <section className="section pb-28 md:pb-24 lg:pb-28" id="contact" data-tour="contact">
    <div className="container">
      <div className="divider mb-12 lg:mb-16" />

      <div className="ct-grid">
        <AnimatedSection direction="right" delay={0.15} className="ct-info">
          <span className="label">Contact</span>
          <h2 className="text-display-sm ct-heading">
            Let's build <span className="text-gradient">something great.</span>
          </h2>
          <p className="ct-lead">
            Tell me about your project and I'll get back to you {SITE.responseTime.toLowerCase()} — usually sooner.
          </p>

          <p className="ct-status">
            <span className="ct-status__dot" aria-hidden="true" />
            {SITE.availability}
          </p>

          <DirectChannels />
          <SocialLinks className="ct-socials" />
        </AnimatedSection>

        <AnimatedSection direction="left" delay={0.25} className="ct-main">
          <InquiryForm />
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default ContactSection;
