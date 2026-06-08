import React from "react";
import AnimatedSection from "../ui/AnimatedSection";
import ServiceStage3D from "../ui/ServiceStage3D";

const ServicesSection = () => (
  <section className="section" id="services">
    <div className="container">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 lg:mb-16 gap-6">
        <AnimatedSection direction="right" delay={0.2}>
          <span className="label">Services</span>
          <h2 className="h2 max-w-lg">
            I create <span className="text-gradient">cross-platform</span> apps
            and intuitive websites
          </h2>
        </AnimatedSection>

        {/* <AnimatedSection direction="left" delay={0.3}>
          <Link to="work" smooth className="cursor-pointer">
            <button type="button" className="btn btn-outline">
              See my work
            </button>
          </Link>
        </AnimatedSection> */}
      </div>

      <ServiceStage3D />
    </div>
  </section>
);

export default ServicesSection;
