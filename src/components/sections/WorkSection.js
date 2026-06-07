import React from "react";
import { Link } from "react-router-dom";
import { HOME_PROJECTS } from "../../constants";
import AnimatedSection from "../ui/AnimatedSection";
import ProjectCard from "../project/ProjectCard";

const WorkSection = () => {
  const [featured, ...rest] = HOME_PROJECTS;

  return (
    <section className="section" id="work">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6">
          <AnimatedSection direction="right" delay={0.2}>
            <span className="label">Portfolio</span>
            <h2 className="h2">
              My Latest <span className="text-gradient">Work.</span>
            </h2>
            <p className="text-body-sm text-white/30 max-w-md">
              From visually stunning websites to cutting-edge mobile applications
              — a collection committed to craft and excellence.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="left" delay={0.3}>
            <Link to="/projects">
              <button type="button" className="btn btn-outline">View all projects</button>
            </Link>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3} viewport={{ once: true, amount: 0.15 }}>
          <div className="mb-4 lg:mb-5">
            <ProjectCard {...featured} featured />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {rest.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default WorkSection;
