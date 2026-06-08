import React from "react";
import { Link } from "react-scroll";
import { SITE } from "../../constants";
import AnimatedSection from "../ui/AnimatedSection";
import TagCloud3D from "../ui/TagCloud3D";

const AboutSection = () => (
    <section className="section" id="about">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16 lg:gap-24">

          {/* ── Left: 3D sphere — desktop only ── */}
          <AnimatedSection
            direction="right"
            delay={0.2}
            className="hidden lg:block flex-shrink-0"
          >
            <TagCloud3D width={380} height={460} radius={152} />
          </AnimatedSection>

          {/* ── Right: text content ── */}
          <AnimatedSection
            direction="left"
            delay={0.3}
            className="flex-1"
          >
            <span className="label">About me</span>

            <h2 className="h2 mb-6">
              Freelance <span className="text-gradient">Front-end Developer</span>
              <br />
              with 3+ years of experience
            </h2>

            <p className="text-body text-white/40 mb-8 max-w-[480px]">
              I'm a passionate creator dedicated to crafting digital experiences
              that blend aesthetics with functionality. With a keen eye for
              design and a love for coding, I specialize in transforming ideas
              into captivating websites and applications that resonate.
            </p>

            {/* ── Mobile 3D sphere — below bio on small screens ── */}
            <div className="flex justify-center lg:hidden mb-12">
              <TagCloud3D width={320} height={320} radius={118} />
            </div>

            <div className="divider mb-10" />

            {/* <div className="flex items-center flex-wrap gap-4">
              <Link to="services" smooth className="cursor-pointer">
                <button type="button" className="btn btn-primary">What I Do</button>
              </Link>
              <a href={SITE.portfolioUrl} className="btn btn-outline">
                My Portfolio
              </a>
            </div> */}
          </AnimatedSection>
        </div>
      </div>
    </section>
);

export default AboutSection;
