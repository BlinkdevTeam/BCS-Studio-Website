"use client";

import HeroSection from "./about/components/HeroSection";
import ServicesSection from "./about/components/ServiceSection";

export default function AboutPage() {
  return (
    <div className="bg-white overflow-hidden">
      <HeroSection />

      <ServicesSection />
    </div>
  );
}
