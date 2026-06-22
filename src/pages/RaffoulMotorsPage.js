import React from "react";
import PageBackground from "../components/layout/PageBackground";
import RaffoulMotorsCaseStudy from "../components/project/RaffoulMotorsCaseStudy";

const RaffoulMotorsPage = () => (
  <div className="relative min-h-screen dot-grid">
    <PageBackground />
    <div className="relative z-[1]">
      <main className="w-full pb-24">
        <RaffoulMotorsCaseStudy />
      </main>
    </div>
  </div>
);

export default RaffoulMotorsPage;
