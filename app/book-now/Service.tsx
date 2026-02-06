//app/book-now/Service.tsx

"use client";

import { useState } from "react";
import { SERVICES, ServiceCategory } from "@/data/service";
import SkewButton from "@/components/ui/buttons/SkewButton";

// Include event in filters
const FILTERS = [
  { label: "Portraits", value: "portraits" },
  { label: "Studio Rental", value: "studio" },
  { label: "Event Coverage", value: "event" },
] as const;

export default function ServiceSection() {
  const [activeFilter, setActiveFilter] =
    useState<ServiceCategory>("portraits");

  // Displayed works depending on filter
  const displayedServices =
    activeFilter === "event"
      ? []
      : SERVICES.filter((service) => service.category === activeFilter);

  return (
    <section className="px-6 lg:px-24 py-24 bg-white">
      {/* Header */}
      <div className="flex flex-col mb-12">
        <div className="mb-6 text-start">
          <h2 className="text-[#A30A24] text-[48px] md:text-[72px] font-bold">
            Select Service
          </h2>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap mb-12">
          {FILTERS.map((filter) => (
            <SkewButton
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              isActive={activeFilter === filter.value} // <--- key change
            >
              <span className="text-[18px] md:text-[24px]">{filter.label}</span>
            </SkewButton>
          ))}
        </div>
      </div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Render filtered SERVICE */}
        {displayedServices.map((service) => (
          <div
            key={service.id}
            className="border overflow-hidden shadow-md bg-white rounded-xl"
          >
            {service.image.endsWith(".mp4") ? (
              <video
                src={service.image}
                autoPlay
                muted
                loop
                className="w-full h-[320px] object-cover"
              />
            ) : (
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-[320px] object-cover"
              />
            )}

            <div className="flex flex-col gap-4 p-8">
              <div className="flex flex-row justify-between">
                <h4 className="text-[24px] md:text-[36px] text-[#161616] font-bold">
                  {service.title}
                </h4>
                {service.price && (
                  <h4 className="text-[24px] md:text-[36px] text-[#A30A24] font-bold">
                    {service.price}
                  </h4>
                )}
              </div>
              {service.desc && (
                <p className="text-[18px] md:text-[24px] text-[#6E6E6E] mt-2">
                  {service.desc}
                </p>
              )}
              <SkewButton href={`/book-now/services/${service.slug}`}>
                Book Now
              </SkewButton>
            </div>
          </div>
        ))}
      </div>
      {/* Static Event Coverage card */}
      {activeFilter === "event" && (
        <div className="bg-white border overflow-hidden shadow-md rounded-xl p-8 flex flex-col gap-6 text-[#A30A24]">
          <h5 className="text-[24px] md:text-[36px] font-bold">
            TALK TO OUR TEAM
          </h5>

          {/* Contact Form */}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Full Name */}
              <div className="flex flex-col w-full">
                <label className="text-[16px] md:text-[18px] font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24]"
                />
              </div>

              {/* Contact Number */}
              <div className="flex flex-col w-full">
                <label className="text-[16px] md:text-[18px] font-medium mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 09123456789"
                  onInput={(e) => {
                    const input = e.currentTarget;
                    input.value = input.value.replace(/\D/g, "");
                  }}
                  className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24]"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col w-full">
                <label className=" text-[16px] md:text-[18px] font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className=" text-[16px] md:text-[18px] font-medium mb-1">
                Please provide any additional details, ideas, specifications, or
                requirements that will assist us in better understanding and
                visualizing your vision.
              </label>
              <textarea
                placeholder="Tell us about your event..."
                rows={5}
                className="border border-gray-300 rounded-md px-4 py-2 text-[16px] md:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#A30A24] resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <SkewButton href="#">Submit</SkewButton>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {activeFilter !== "event" && displayedServices.length === 0 && (
        <p className="text-center  mt-12">
          No works available for this category.
        </p>
      )}
    </section>
  );
}
