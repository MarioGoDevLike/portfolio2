import React from "react";
import PageBackground from "../components/layout/PageBackground";
import RaffoulMotorsCaseStudy from "../components/project/RaffoulMotorsCaseStudy";

const RaffoulMotorsPage = () => (
  <div className="relative min-h-screen dot-grid overflow-x-hidden max-w-full">
    <PageBackground />
    <div className="relative z-[1] max-w-full overflow-x-hidden">
      <main className="w-full max-w-full overflow-x-hidden pb-24">
        <RaffoulMotorsCaseStudy />
      </main>
    </div>
  </div>
);

export default RaffoulMotorsPage;
