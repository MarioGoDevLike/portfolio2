import React from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { PROJECTS } from "../constants";
import PageBackground from "../components/layout/PageBackground";
import ProjectCard from "../components/project/ProjectCard";
import AnimatedSection from "../components/ui/AnimatedSection";

const ProjectsPage = () => (
  <div className="relative min-h-screen dot-grid">
    <PageBackground />

    <div className="relative z-[1]">
      <header className="projects-page__header">
        <div className="container">
          <Link to="/" className="projects-page__back">
            <BsArrowLeft size={20} />
            <span>Back to home</span>
          </Link>
        </div>
      </header>

      <main className="section pb-24">
        <div className="container">
          <AnimatedSection delay={0.1} className="mb-12">
            <span className="label">Full archive</span>
            <h1 className="h2">
              All <span className="text-gradient">Projects.</span>
            </h1>
            <p className="text-body-sm text-white/30 max-w-xl">
              A complete look at websites, mobile apps, and experiments across
              web and native platforms.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {PROJECTS.map((project, index) => (
              <AnimatedSection key={project.id} delay={0.15 + index * 0.08}>
                <ProjectCard {...project} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </main>
    </div>
  </div>
);

export default ProjectsPage;
