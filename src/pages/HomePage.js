import React from "react";
import Header from "../components/layout/Header";
import MobileNav from "../components/layout/MobileNav";
import PageBackground from "../components/layout/PageBackground";
import AboutSection from "../components/sections/AboutSection";
import ContactSection from "../components/sections/ContactSection";
import HeroSection from "../components/sections/HeroSection";
import MarqueeSection from "../components/sections/MarqueeSection";
import ServicesSection from "../components/sections/ServicesSection";
import WorkSection from "../components/sections/WorkSection";

const HomePage = () => (
  <div className="relative min-h-screen dot-grid">
    <PageBackground />

    <div className="relative z-[1]">
      <Header />
      <main>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <WorkSection />
        <ContactSection />
      </main>
    </div>

    <MobileNav />
  </div>
);

export default HomePage;
