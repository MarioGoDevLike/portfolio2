import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Link } from "react-scroll";
import workspaceImage from "../../assets/computer.jpeg";
import { ABOUT_STATS, SITE } from "../../constants";
import AnimatedSection from "../ui/AnimatedSection";

const AboutSection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16 lg:gap-24">
          <AnimatedSection
            direction="right"
            delay={0.2}
            className="hidden lg:block flex-shrink-0"
          >
            <div className="about-visual">
              <div className="about-visual__accent" aria-hidden="true" />
              <div className="about-visual__frame">
                <img
                  src={workspaceImage}
                  alt="Development workspace"
                  className="about-visual__image"
                />
                <div className="about-visual__fade" aria-hidden="true" />
              </div>
              <div className="about-visual__dot" aria-hidden="true" />
            </div>
          </AnimatedSection>

          <AnimatedSection
            ref={ref}
            direction="left"
            delay={0.3}
            className="flex-1"
          >
            <span className="label">About me</span>

            <h2 className="h2 mb-6">
              Freelance <span className="text-gradient">Front-end Developer</span>
              <br />
              with 2+ years of experience
            </h2>

            <p className="text-body text-white/40 mb-10 max-w-[480px]">
              I'm a passionate creator dedicated to crafting digital experiences
              that blend aesthetics with functionality. With a keen eye for
              design and a love for coding, I specialize in transforming ideas
              into captivating websites and applications that resonate.
            </p>

            <div className="flex gap-8 lg:gap-12 mb-12">
              {ABOUT_STATS.map(({ value, suffix, label, decimals }) => (
                <div key={label}>
                  <div className="stat-value mb-2">
                    {inView ? (
                      <CountUp
                        start={0}
                        end={value}
                        decimals={decimals}
                        duration={2.4}
                      />
                    ) : (
                      "0"
                    )}
                    {suffix}
                  </div>
                  <div className="stat-label whitespace-pre-line">{label}</div>
                </div>
              ))}
            </div>

            <div className="divider mb-10" />

            <div className="flex items-center flex-wrap gap-4">
              <Link to="services" smooth className="cursor-pointer">
                <button type="button" className="btn btn-primary">What I Do</button>
              </Link>
              <a href={SITE.portfolioUrl} className="btn btn-outline">
                My Portfolio
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
