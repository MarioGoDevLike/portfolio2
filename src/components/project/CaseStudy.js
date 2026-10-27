import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion, useScroll } from "framer-motion";
import { HiArrowLeft, HiArrowRight, HiArrowUpRight, HiArrowsPointingOut, HiLockClosed, HiXMark } from "react-icons/hi2";
import LazyVideo from "../ui/LazyVideo";
import OptimizedImage from "../ui/OptimizedImage";
import { CASE_STUDIES } from "../../constants/caseStudies";
import { getHomeBackLink, getHomeBackState } from "../../utils/homeScroll";
import "./case-study.css";

const EASE = [0.22, 1, 0.36, 1];
const AUTOPLAY_MS = 4200;
const SWIPE_PX = 48;

const pad = (n) => String(n).padStart(2, "0");

const scrollToId = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/* ─── Primitives ─────────────────────────────────── */

const Reveal = ({ as = "div", delay = 0, className, children }) => {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
};

/** Image or looping video, filling its frame. */
const Media = ({ screen, video, priority = false }) =>
  video ? (
    <LazyVideo className="cs-media" src={video.src} poster={video.poster} eager={priority} />
  ) : (
    <OptimizedImage className="cs-media" src={screen.src} alt={screen.label} priority={priority} draggable={false} />
  );

/** Crossfades between gallery screens; plain media for video. */
const Screen = ({ showcase, index, priority }) => {
  if (showcase.video) return <Media video={showcase.video} priority={priority} />;
  const screen = showcase.screens[index];
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={screen.src}
        className="cs-slide"
        initial={{ opacity: 0, scale: 1.015 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <Media screen={screen} priority={priority} />
      </motion.div>
    </AnimatePresence>
  );
};

const ExpandButton = ({ onClick, label }) => (
  <button type="button" className="cs-expand" onClick={onClick} aria-label={label}>
    <HiArrowsPointingOut aria-hidden="true" />
  </button>
);

const BrowserFrame = ({ url, onExpand, expandLabel, children }) => (
  <div className="cs-browser">
    <div className="cs-browser__bar" aria-hidden="true">
      <span className="cs-browser__lights"><i /><i /><i /></span>
      {url && (
        <span className="cs-browser__url">
          <HiLockClosed />
          {url}
        </span>
      )}
    </div>
    <div className="cs-browser__view">
      {children}
      {onExpand && <ExpandButton onClick={onExpand} label={expandLabel} />}
    </div>
  </div>
);

const PhoneFrame = ({ className = "", onExpand, expandLabel, children }) => (
  <div className={`cs-phone ${className}`}>
    <div className="cs-phone__screen">
      {children}
      <span className="cs-phone__island" aria-hidden="true" />
      {onExpand && <ExpandButton onClick={onExpand} label={expandLabel} />}
    </div>
  </div>
);

/* ─── Gallery state ──────────────────────────────── */

/**
 * Index + autoplay for a screen gallery. Autoplay runs only while the
 * gallery is on screen, stops for good once the visitor takes control,
 * and never runs under prefers-reduced-motion.
 */
function useGallery(count, inView) {
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const autoplay = count > 1 && inView && !touched && !paused && !reduceMotion;

  useEffect(() => {
    if (!autoplay) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoplay, count]);

  const go = useCallback((i) => {
    setTouched(true);
    setIndex(((i % count) + count) % count);
  }, [count]);

  const step = useCallback((d) => {
    setTouched(true);
    setIndex((i) => (i + d + count) % count);
  }, [count]);

  return { index, go, step, setPaused };
}

const GalleryControls = ({ screens, index, step }) => (
  <div className="cs-controls">
    <p className="cs-controls__caption" aria-live="polite">
      <span className="cs-controls__count">{pad(index + 1)} / {pad(screens.length)}</span>
      <span className="cs-controls__label">{screens[index].label}</span>
    </p>
    <div className="cs-controls__buttons">
      <button type="button" className="cs-icon-btn" onClick={() => step(-1)} aria-label="Previous screen">
        <HiArrowLeft aria-hidden="true" />
      </button>
      <button type="button" className="cs-icon-btn" onClick={() => step(1)} aria-label="Next screen">
        <HiArrowRight aria-hidden="true" />
      </button>
    </div>
  </div>
);

const Filmstrip = ({ screens, index, go }) => (
  <div className="cs-filmstrip" role="group" aria-label="Screens">
    {screens.map((s, i) => (
      <button
        key={s.src}
        type="button"
        className="cs-filmstrip__item"
        onClick={() => go(i)}
        aria-label={s.label}
        aria-current={i === index ? "true" : undefined}
      >
        <OptimizedImage src={s.src} alt="" draggable={false} />
      </button>
    ))}
  </div>
);

/* ─── Lightbox ───────────────────────────────────── */

const Lightbox = ({ showcase, index, step, onClose }) => {
  const closeRef = useRef(null);
  const screens = showcase.screens;
  const isBrowser = showcase.device === "browser";

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (screens && e.key === "ArrowLeft") step(-1);
      if (screens && e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose, screens, step]);

  const onDragEnd = (_, info) => {
    if (!screens) return;
    if (info.offset.x < -SWIPE_PX) step(1);
    else if (info.offset.x > SWIPE_PX) step(-1);
  };

  const frame = isBrowser ? (
    <BrowserFrame url={showcase.url}>
      <Screen showcase={showcase} index={index} priority />
    </BrowserFrame>
  ) : (
    <PhoneFrame className="cs-phone--lightbox">
      <Screen showcase={showcase} index={index} priority />
    </PhoneFrame>
  );

  return (
    <motion.div
      className="cs-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${showcase.title} — fullscreen preview`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="cs-lightbox__top">
        <span>
          {showcase.title}
          {screens && <em> — {screens[index].label}</em>}
        </span>
        <button ref={closeRef} type="button" className="cs-icon-btn" onClick={onClose} aria-label="Close preview">
          <HiXMark aria-hidden="true" />
        </button>
      </div>

      <motion.div
        className={`cs-lightbox__stage ${isBrowser ? "is-browser" : "is-phone"}`}
        drag={screens ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={onDragEnd}
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {frame}
      </motion.div>

      {screens && (
        <div className="cs-lightbox__bottom">
          <GalleryControls screens={screens} index={index} step={step} />
        </div>
      )}
    </motion.div>
  );
};

/* ─── Sections ───────────────────────────────────── */

const Section = ({ id, number, eyebrow, title, description, children }) => (
  <section id={id} className="cs-section" aria-labelledby={`${id}-title`}>
    <Reveal className="cs-section__head">
      <p className="cs-section__index">
        <span className="cs-section__number">{pad(number)}</span>
        <span className="cs-section__eyebrow">{eyebrow}</span>
      </p>
      <h2 id={`${id}-title`} className="cs-h2">{title}</h2>
      {description && <p className="cs-section__desc">{description}</p>}
    </Reveal>
    {children}
  </section>
);

const Highlights = ({ items, activeIndex, onSelect }) => (
  <ol className="cs-highlights">
    {items.map((item, i) => {
      const interactive = typeof item.idx === "number" && onSelect;
      const active = interactive && item.idx === activeIndex;
      const body = (
        <>
          <span className="cs-highlights__num">{pad(i + 1)}</span>
          <span className="cs-highlights__text">
            <span className="cs-highlights__label">{item.label}</span>
            <span className="cs-highlights__desc">{item.desc}</span>
          </span>
        </>
      );
      return (
        <Reveal as="li" key={item.label} delay={i * 0.06} className={`cs-highlights__item${active ? " is-active" : ""}`}>
          {interactive ? (
            <button type="button" onClick={() => onSelect(item.idx)} aria-pressed={active}>
              {body}
            </button>
          ) : (
            <div>{body}</div>
          )}
        </Reveal>
      );
    })}
  </ol>
);

const Showcase = ({ showcase, number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const screens = showcase.screens;
  const { index, go, step, setPaused } = useGallery(screens?.length ?? 0, inView);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const expandLabel = `Open ${showcase.title} fullscreen`;
  const isBrowser = showcase.device === "browser";

  const device = isBrowser ? (
    <BrowserFrame url={showcase.url} onExpand={() => setOpen(true)} expandLabel={expandLabel}>
      <Screen showcase={showcase} index={index} />
    </BrowserFrame>
  ) : (
    <PhoneFrame onExpand={() => setOpen(true)} expandLabel={expandLabel}>
      <Screen showcase={showcase} index={index} />
    </PhoneFrame>
  );

  return (
    <Section
      id={showcase.id}
      number={number}
      eyebrow={showcase.eyebrow}
      title={showcase.title}
      description={showcase.description}
    >
      <div
        ref={ref}
        className={isBrowser ? "cs-showcase cs-showcase--browser" : "cs-showcase cs-showcase--phone"}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {isBrowser ? (
          <Reveal delay={0.1}>
            <div className="cs-stage">{device}</div>
            {screens && (
              <>
                <GalleryControls screens={screens} index={index} step={step} />
                <Filmstrip screens={screens} index={index} go={go} />
              </>
            )}
          </Reveal>
        ) : (
          <>
            {showcase.highlights && (
              <Highlights items={showcase.highlights} activeIndex={index} onSelect={screens ? go : undefined} />
            )}
            <Reveal delay={0.1} className="cs-stage cs-stage--phone">
              {device}
              {screens && <GalleryControls screens={screens} index={index} step={step} />}
            </Reveal>
          </>
        )}
      </div>

      <AnimatePresence>
        {open && <Lightbox showcase={showcase} index={index} step={step} onClose={close} />}
      </AnimatePresence>
    </Section>
  );
};

const ENGINEERING_ID = "engineering";

const hasEngineering = (stack) => Boolean(stack.description || stack.capabilities);

const Engineering = ({ stack, number }) => (
  <Section
    id={ENGINEERING_ID}
    number={number}
    eyebrow={stack.eyebrow || "Engineering"}
    title={stack.title}
    description={stack.description}
  >
    {stack.capabilities && (
      <Reveal delay={0.1} className="cs-capabilities">
        <h3 className="cs-aside__label">Key capabilities</h3>
        <ul>
          {stack.capabilities.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </Reveal>
    )}
  </Section>
);

/* ─── Sidebar ────────────────────────────────────── */

/** Id of the section crossing the upper-middle of the viewport. */
function useActiveSection(ids) {
  const key = ids.join("|");
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = key.split("|").map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [key]);

  return active;
}

const SectionNav = ({ sections, active }) => {
  const listRef = useRef(null);

  // On narrow screens the nav is a horizontal chip row — keep the active chip in view.
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector('[aria-current="location"]');
    if (!chip || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: chip.offsetLeft - 20, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="cs-toc" aria-label="On this page">
      <p className="cs-aside__label">On this page</p>
      <ol ref={listRef}>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(s.id);
              }}
            >
              <span className="cs-toc__num">{pad(i + 1)}</span>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

const Facts = ({ study }) => (
  <div className="cs-facts">
    <dl className="cs-facts__list">
      {study.meta.map((m) => (
        <div key={m.label} className="cs-facts__item">
          <dt>{m.label}</dt>
          <dd>{m.value}</dd>
        </div>
      ))}
    </dl>

    <div className="cs-facts__stack">
      <p className="cs-aside__label">Tech stack</p>
      {study.stack.groups.map((group) => (
        <div key={group.category} className="cs-facts__group">
          <span className="cs-facts__category">{group.category}</span>
          <ul className="cs-chips">
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>

    {study.liveUrl && (
      <a className="cs-btn cs-btn--primary cs-facts__cta" href={study.liveUrl} target="_blank" rel="noopener noreferrer">
        {study.liveLabel || "Visit live site"}
        <HiArrowUpRight aria-hidden="true" />
      </a>
    )}
  </div>
);

/* ─── Hero ───────────────────────────────────────── */

/** Cover composition: the first browser view plus up to two phones. */
const HeroStage = ({ study }) => {
  const browser = study.showcases.find((s) => s.device === "browser");
  const phones = study.showcases.filter((s) => s.device === "phone").slice(0, 2);
  const layout = browser ? (phones.length ? "combo" : "browser") : `phones-${phones.length}`;

  return (
    <motion.div
      className={`cs-cover cs-cover--${layout}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.35 }}
    >
      {browser && (
        <div className="cs-cover__browser">
          <BrowserFrame url={browser.url}>
            <Screen showcase={browser} index={0} priority />
          </BrowserFrame>
        </div>
      )}
      {phones.map((phone, i) => (
        <div key={phone.id} className={`cs-cover__phone cs-cover__phone--${i + 1}`}>
          <PhoneFrame>
            <Screen showcase={phone} index={0} priority />
          </PhoneFrame>
        </div>
      ))}
    </motion.div>
  );
};

const Hero = ({ study, position, total }) => {
  const firstSection = study.showcases[0]?.id;
  const rise = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <header className="cs-hero">
      <div className="cs-container">
        <motion.div className="cs-hero__kicker" {...rise(0)}>
          <span>Case study {pad(position)} / {pad(total)}</span>
          <span className="cs-hero__rule" aria-hidden="true" />
          <span>{study.category}</span>
        </motion.div>

        <div className="cs-hero__headline">
          <motion.h1 className="cs-h1" {...rise(0.08)}>{study.title}</motion.h1>
          {study.logo && (
            <motion.div
              {...rise(0.16)}
              className={`cs-hero__brand${study.logo.surface === "light" ? " is-light" : ""}`}
            >
              <img
                className={study.logo.blend ? "is-blend" : undefined}
                src={study.logo.src}
                alt={`${study.title} logo`}
                decoding="async"
              />
            </motion.div>
          )}
        </div>

        <div className="cs-hero__intro">
          <motion.p className="cs-hero__summary" {...rise(0.16)}>{study.summary}</motion.p>
          <motion.div className="cs-hero__actions" {...rise(0.24)}>
            {study.liveUrl && (
              <a className="cs-btn cs-btn--primary" href={study.liveUrl} target="_blank" rel="noopener noreferrer">
                {study.liveLabel || "Visit live site"}
                <HiArrowUpRight aria-hidden="true" />
              </a>
            )}
            {firstSection && (
              <button type="button" className="cs-btn cs-btn--ghost" onClick={() => scrollToId(firstSection)}>
                Explore the work
                <HiArrowRight aria-hidden="true" className="cs-btn__down" />
              </button>
            )}
          </motion.div>
        </div>

        <HeroStage study={study} />
      </div>
    </header>
  );
};

/* ─── Page ───────────────────────────────────────── */

const TopBar = ({ study }) => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`cs-topbar${scrolled ? " is-scrolled" : ""}`} aria-label="Case study">
      <div className="cs-container cs-topbar__inner">
        <Link to={getHomeBackLink()} state={getHomeBackState()} className="cs-topbar__back">
          <HiArrowLeft aria-hidden="true" />
          <span>Back to work</span>
        </Link>
        <span className="cs-topbar__title" aria-hidden={!scrolled}>{study.title}</span>
        {study.liveUrl ? (
          <a className="cs-topbar__live" href={study.liveUrl} target="_blank" rel="noopener noreferrer">
            Live <HiArrowUpRight aria-hidden="true" />
          </a>
        ) : (
          <span className="cs-topbar__spacer" />
        )}
      </div>
      <motion.span className="cs-topbar__progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </nav>
  );
};

const NextProject = ({ next }) => (
  <section className="cs-next" style={{ "--cs-accent": next.accent }}>
    <div className="cs-container">
      <Link to={`/projects/${next.slug}`} className="cs-next__link">
        <span className="cs-next__label">Next case study</span>
        <span className="cs-next__title">
          {next.title}
          <HiArrowRight aria-hidden="true" />
        </span>
        <span className="cs-next__category">{next.category}</span>
      </Link>
      <div className="cs-next__footer">
        <Link to="/projects">View all projects</Link>
        <Link to={getHomeBackLink()} state={getHomeBackState()}>Back to home</Link>
      </div>
    </div>
  </section>
);

const CaseStudy = ({ study }) => {
  const position = CASE_STUDIES.findIndex((c) => c.slug === study.slug);
  const next = CASE_STUDIES[(position + 1) % CASE_STUDIES.length];
  const showEngineering = hasEngineering(study.stack);
  const sections = [
    ...study.showcases.map((s) => ({ id: s.id, label: s.navLabel || s.eyebrow })),
    ...(showEngineering ? [{ id: ENGINEERING_ID, label: study.stack.eyebrow || "Engineering" }] : []),
  ];
  const active = useActiveSection(sections.map((s) => s.id));

  useEffect(() => {
    const previous = document.title;
    document.title = `${study.title} — Case Study`;
    return () => { document.title = previous; };
  }, [study.title]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="cs-page" style={{ "--cs-accent": study.accent }}>
        <TopBar study={study} />
        <main>
          <Hero study={study} position={position + 1} total={CASE_STUDIES.length} />
          <div className="cs-container cs-body">
            <aside className="cs-aside" aria-label="Project details">
              <SectionNav sections={sections} active={active} />
              <Facts study={study} />
            </aside>
            <div className="cs-main">
              {study.showcases.map((showcase, i) => (
                <Showcase key={showcase.id} showcase={showcase} number={i + 1} />
              ))}
              {showEngineering && <Engineering stack={study.stack} number={study.showcases.length + 1} />}
            </div>
          </div>
        </main>
        <NextProject next={next} />
      </div>
    </MotionConfig>
  );
};

export default CaseStudy;
