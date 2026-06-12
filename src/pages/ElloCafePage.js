import React from "react";
import PageBackground from "../components/layout/PageBackground";
import ElloCafeCaseStudy from "../components/project/ElloCafeCaseStudy";

const ElloCafePage = () => (
  <div className="relative min-h-screen dot-grid">
    <PageBackground />

    <div className="relative z-[1]">
      <main className="w-full pb-24">
        <ElloCafeCaseStudy />
      </main>
    </div>
  </div>
);

export default ElloCafePage;
