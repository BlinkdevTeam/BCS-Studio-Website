"use client";

export default function HeroSection() {
  return (
    <section className="w-full">
      {/* Background video */}
      <div className="w-full">
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source
            src="/assets/blinkworks/bcs_ad_10_things.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Text content below video */}
      <div className="max-w-full mx-auto px-6 md:px-12 lg::px-24 py-16 text-start">
        <h1 className="text-[#161616] text-[48px] md:text-[96px] font-bold mb-6">
          Lorem Ipsum
        </h1>
        <p className="text-[#6E6E6E] text-[24px] md:text-[36px]">
          Aperture Studio is more than just a photography studio—we are
          storytellers, artists, and memory makers. For over 15 years,
          we&apos;ve been dedicated to capturing the moments that matter most,
          transforming ordinary occasions into extraordinary visual narratives.
        </p>
      </div>
    </section>
  );
}
