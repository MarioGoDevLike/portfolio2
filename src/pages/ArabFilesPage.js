import React from "react";
import PageBackground from "../components/layout/PageBackground";
import ArabFilesCaseStudy from "../components/project/ArabFilesCaseStudy";

const ArabFilesPage = () => (
  <div className="relative min-h-screen dot-grid overflow-x-hidden max-w-full">
    <PageBackground />
    <div className="relative z-[1] max-w-full overflow-x-hidden">
      <main className="w-full max-w-full overflow-x-hidden pb-24">
        <ArabFilesCaseStudy />
      </main>
    </div>
  </div>
);

export default ArabFilesPage;
