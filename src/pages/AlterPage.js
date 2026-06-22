import React from "react";
import PageBackground from "../components/layout/PageBackground";
import AlterCaseStudy from "../components/project/AlterCaseStudy";

const AlterPage = () => (
  <div className="relative min-h-screen dot-grid">
    <PageBackground />
    <div className="relative z-[1]">
      <main className="w-full pb-24">
        <AlterCaseStudy />
      </main>
    </div>
  </div>
);

export default AlterPage;
