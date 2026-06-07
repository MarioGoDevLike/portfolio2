import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { Link } from "react-scroll";
import { SERVICES } from "../../constants";
import AnimatedSection from "../ui/AnimatedSection";
import Tag from "../ui/Tag";

const ServicesSection = () => (
  <section className="section" id="services">
    <div className="container">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 lg:mb-16 gap-6">
        <AnimatedSection direction="right" delay={0.2}>
          <span className="label">Services</span>
          <h2 className="h2 max-w-lg">
            I create <span className="text-gradient">cross-platform</span> apps
            and intuitive websites
          </h2>
        </AnimatedSection>

        <AnimatedSection direction="left" delay={0.3}>
          <Link to="work" smooth className="cursor-pointer">
            <button type="button" className="btn btn-outline">See my work</button>
          </Link>
        </AnimatedSection>
      </div>

      <div>
        {SERVICES.map((service, index) => (
          <AnimatedSection key={service.id} delay={0.2 + index * 0.12}>
            <article className="service-item group">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-12">
                <span className="service-item__number">{service.number}</span>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="service-item__title">{service.name}</h3>
                    <BsArrowUpRight
                      size={18}
                      className="service-item__arrow"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="service-item__description">{service.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
