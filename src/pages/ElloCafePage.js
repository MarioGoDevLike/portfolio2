import React from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import PageBackground from "../components/layout/PageBackground";
import ElloCafeCaseStudy from "../components/project/ElloCafeCaseStudy";

const ElloCafePage = () => (
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
          <ElloCafeCaseStudy />
        </div>
      </main>
    </div>
  </div>
);

export default ElloCafePage;
