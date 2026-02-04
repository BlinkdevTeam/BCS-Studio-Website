"use client";

import WorksSection from "./WorkSection";

export default function WorksPage() {
  return (
    <section className="bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#161616] text-white py-28">
        <div className="max-w-125 w-full flex flex-col justify-center items-center mx-auto text-center">
          <h1 className="text-[48px] md:text-[96px] font-bold">Our Works</h1>
          <div className="w-fit">
            <p className="text-[18px] md:text-[24px]">
              A collection of moments captured, stories told, and visions
              brought to life
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white py-24 px-24">
        <div className="w-full flex flex-col justify-center items-center mx-auto text-center">
          <h1 className="text-[#A30A24] text-[48px] md:text-[72px] font-bold">
            Lorem Ipsum
          </h1>
          <div className="w-fit flex flex-col gap-8 text-[#6E6E6E]">
            <p className="text-[18px] md:text-[24px]">
              Aperture Studio is more than just a photography studio—we are
              storytellers, artists, and memory makers. For over 15 years,
              we&apos;ve been dedicated to capturing the moments that matter
              most, transforming ordinary occasions into extraordinary visual
              narratives.
            </p>
            <p className="text-[18px] md:text-[24px]">
              Aperture Studio is more than just a photography studio—we are
              storytellers, artists, and memory makers. For over 15 years,
              we&apos;ve been dedicated to capturing the moments that matter
              most, transforming ordinary occasions into extraordinary visual
              narratives.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#F2F2F2] py-24 px-24">
        <div className="w-full flex flex-col justify-center items-center gap-12 mx-auto text-center">
          <div className="w-fit flex flex-col gap-2 text-[#161616]">
            <h1 className="text-[#A30A24] text-[48px] md:text-[72px] font-bold">
              Behind the Lens
            </h1>
            <p className="text-[18px] md:text-[24px]">
              Take a glimpse into our creative process and studio environment
            </p>
          </div>
          <div className="flex-1 w-full lg:w-[1620px] h-auto bg-[#A30A24] overflow-hidden">
            <video autoPlay muted loop className="w-full h-full object-cover">
              <source
                src="/assets/blinkworks/bcs_ad_10_things.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      <WorksSection />
    </section>
  );
}
