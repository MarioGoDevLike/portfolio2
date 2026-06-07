import React from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { BsArrowDown } from "react-icons/bs";
import avatar from "../../assets/avatar.png";
import { SITE } from "../../constants";
import AnimatedSection from "../ui/AnimatedSection";
import SocialLinks from "../ui/SocialLinks";

const HeroSection = () => (
  <section className="hero-section" id="home">
    <div className="container w-full">

      {/* ── Mobile avatar — visible only below lg ── */}
      <AnimatedSection
        delay={0.1}
        className="flex justify-center mb-10 lg:hidden"
      >
        <div className="relative">
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(129,140,248,0.25) 0%, transparent 70%)",
              filter: "blur(20px)",
              transform: "scale(1.3)",
            }}
            aria-hidden="true"
          />
          {/* Avatar circle */}
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden border border-white/10"
            style={{ background: "rgba(255,255,255,0.025)" }}
          >
            <img
              src={avatar}
              alt={SITE.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* Available badge */}
          <span
            className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-[#050505]"
            style={{ background: "#34d399" }}
            aria-label="Available for work"
          />
        </div>
      </AnimatedSection>

      <div className="flex flex-col lg:flex-row lg:items-center gap-14 lg:gap-20">
        {/* ── Text column ── */}
        <div className="flex-1">
          <AnimatedSection delay={0.15}>
            <span className="label">{SITE.availability} ✦</span>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <h1 className="text-display mb-5">
              Mario <span className="text-gradient">Nassar</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection
            delay={0.35}
            className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-6"
          >
            <span className="text-role-prefix">I'm a</span>
            <TypeAnimation
              sequence={SITE.roles.flatMap((role) => [role, 2000])}
              speed={55}
              wrapper="span"
              repeat={Infinity}
              className="text-role"
            />
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <p className="text-body text-white/40 mb-8 max-w-[420px]">
              {SITE.tagline}
            </p>
          </AnimatedSection>

          {/* CTA Buttons — full-width on mobile, auto on sm+ */}
          <AnimatedSection
            delay={0.55}
            className="flex flex-col sm:flex-row sm:items-center gap-3 mb-10"
          >
            <Link to="contact" smooth className="cursor-pointer">
              <button
                type="button"
                className="btn btn-primary w-full sm:w-auto justify-center"
              >
                Contact me
              </button>
            </Link>
            <a
              href={SITE.portfolioUrl}
              className="btn btn-outline w-full sm:w-auto justify-center"
            >
              My Portfolio
            </a>
          </AnimatedSection>

          <AnimatedSection delay={0.65}>
            <SocialLinks />
          </AnimatedSection>
        </div>

        {/* ── Desktop portrait — hidden on mobile ── */}
        <AnimatedSection
          direction="down"
          delay={0.35}
          viewport={{ once: true, amount: 0.3 }}
          className="hidden lg:block flex-shrink-0"
        >
          <div className="hero-portrait">
            <div className="hero-portrait__glow" aria-hidden="true" />
            <div className="hero-portrait__card">
              <img
                src={avatar}
                alt={SITE.name}
                className="w-full h-auto object-cover block"
              />
              <div className="hero-portrait__caption">
                <p className="font-primary text-[13px] font-semibold text-white">
                  {SITE.name}
                </p>
                <p className="font-secondary text-[11px] text-white/30">
                  {SITE.role}
                </p>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass hero-portrait__badge hero-portrait__badge--top"
            >
              <p className="stat-value">5+</p>
              <p className="stat-label">Projects Done</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="glass hero-portrait__badge hero-portrait__badge--bottom"
            >
              <div className="flex items-center gap-2">
                <span className="status-dot" aria-hidden="true" />
                <p className="font-secondary text-[11px] text-white/50 whitespace-nowrap">
                  {SITE.availability}
                </p>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>

      {/* Scroll hint — desktop only */}
      <AnimatedSection
        delay={0.8}
        className="hidden lg:flex items-center gap-3 mt-16"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/20"
        >
          <BsArrowDown size={14} />
        </motion.div>
        <span className="scroll-hint">Scroll to explore</span>
      </AnimatedSection>
    </div>
  </section>
);

export default HeroSection;
