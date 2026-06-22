import React from "react";
import PageBackground from "../components/layout/PageBackground";
import TopSpeedCaseStudy from "../components/project/TopSpeedCaseStudy";

const TopSpeedPage = () => (
  <div className="relative min-h-screen dot-grid">
    <PageBackground />
    <div className="relative z-[1]">
      <main className="w-full pb-24">
        <TopSpeedCaseStudy />
      </main>
    </div>
  </div>
);

export default TopSpeedPage;
