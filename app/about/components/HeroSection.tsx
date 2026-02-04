"use client";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background video loop */}
      <video
        autoPlay
        muted
        loop
        className="absolute w-full h-full object-cover"
      >
        <source src="/assets/hero-loop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Our Studio
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl">
          Cinematic experiences, professional studio rental, and event coverage
        </p>
      </div>
    </section>
  );
}
