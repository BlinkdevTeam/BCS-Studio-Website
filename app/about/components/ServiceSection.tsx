"use client";

import SkewButton from "../../../components/ui/buttons/SkewButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

const PORTRAITS_FEATURES = [
  "Professional lighting equipment included",
  "Props and furniture available",
  "White Infinity wall",
];

const PORTRAITS_IMAGES = [
  "8R 0.jpg",
  "8R 4.jpg",
  "8R 1.jpg",
  "8R 2.jpg",
  "8R 3.jpg",
  "8R 5.jpg",
  "8R 6.jpg",
  "8R 7.jpg",
  "8R 8.jpg",
  "8R 9.jpg",
];

export default function ServicesSection() {
  return (
    <div className="max-w-full mx-auto text-[#161616]">
      {/* Page Title */}
      <h2 className="text-[36px] md:text-[48px] font-bold text-center my-12">
        Our Services
      </h2>

      {/* Portraits Section */}
      <section className="bg-[#F2F2F2] flex flex-col lg:flex-row px-8 lg:px-24 py-24 gap-12 items-center">
        {/* Service Info */}
        <div className="flex-1 flex flex-col gap-6 order-2 lg:order-1">
          <div>
            <h3 className="text-[48px] md:text-[72px] font-bold">Portraits</h3>
            <h4 className="text-[24px] md:text-[36px] font-bold">
              Professional Studio Space
            </h4>
            <p className="text-[18px] md:text-[24px] text-[#6E6E6E]">
              Rent our state-of-the-art studio facilities for your creative
              projects. Our versatile spaces are equipped with professional
              lighting, backdrops, and all the amenities you need for a
              successful shoot.
            </p>
          </div>

          {/* Features List */}
          <ul className="flex flex-col gap-2">
            {PORTRAITS_FEATURES.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.6666 8L11.9999 22.6667L5.33325 16"
                    stroke="#A20C23"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[18px] md:text-[24px] text-[#6E6E6E]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <SkewButton href="/about">LEARN MORE</SkewButton>
        </div>

        {/* Swiper Slider */}
        <div className="flex-1 order-1 lg:order-2">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            loop={true}
            modules={[EffectCards, Autoplay]}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            className="mySwiper w-[280px] md:w-[360px] xl:w-[460px] h-auto mx-auto"
          >
            {PORTRAITS_IMAGES.map((img, index) => (
              <SwiperSlide
                key={index}
                className="flex justify-center items-center bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={`/assets/portraits/${img}`}
                  alt={`Portrait ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Studio Rental Section */}
      <section className="py-24 md:py-40 px-8 lg:px-24">
        <div className="flex justify-center items-center my-12">
          <h3 className="text-[48px] md:text-[72px] font-bold">
            Studio Rental
          </h3>
        </div>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 w-full lg:w-[820px] h-auto bg-[#A30A24] overflow-hidden">
            <video autoPlay muted loop className="w-full h-full object-cover">
              <source
                src="/assets/blinkworks/bcs_ad_10_things.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h4 className="text-[24px] md:text-[36px] font-bold">
                Professional Studio Space
              </h4>
              <h4 className="text-[24px] md:text-[36px] text-[#A30A24] font-bold">
                P 650/hr
              </h4>
              <p className="text-[18px] md:text-[24px] text-[#6E6E6E]">
                Rent our studio for your creative projects. Equipped with
                professional lighting, backdrops, and all the amenities you need
                for a successful shoot.
              </p>
            </div>

            <ul className="flex flex-col gap-2">
              {PORTRAITS_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.6666 8L11.9999 22.6667L5.33325 16"
                      stroke="#A20C23"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[18px] md:text-[24px] text-[#6E6E6E]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <SkewButton href="/about">LEARN MORE</SkewButton>
          </div>
        </div>
      </section>

      {/* Event Coverage Section */}
      <section className="bg-[#161616] text-white py-20 md:py-28 px-8 lg:px-24">
        <div className="flex flex-col gap-16 items-center text-center">
          <div className="flex flex-col gap-8">
            <h3 className="text-[48px] md:text-[72px] font-bold">
              Event Coverage
            </h3>
            <p className="text-[#6E6E6E] text-[24px] md:text-[36px]">
              From weddings to corporate events, we provide comprehensive
              photography coverage that captures every important moment with
              professional expertise and artistic vision.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 text-center">
            {["Weddings", "Special events", "Corporate Events"].map(
              (title, index) => (
                <div
                  key={index}
                  className="bg-[#A30A24] hover:bg-white hover:text-[#A30A24] border-3 border-[#A30A24] py-24 px-14"
                >
                  <h6 className="text-[24px] md:text-[36px] font-bold">
                    {title}
                  </h6>
                  <p className="text-[18px] md:text-[24px]">
                    {index === 0 &&
                      "Complete wedding day coverage from preparation to reception"}
                    {index === 1 &&
                      "Birthdays, anniversaries, and milestone celebrations"}
                    {index === 2 &&
                      "Conferences, product launches, and business functions"}
                  </p>
                </div>
              ),
            )}
          </div>

          <SkewButton href="/about">LEARN MORE</SkewButton>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="bg-[#A30A24] py-16 px-8 lg:px-24">
        <div className="flex flex-col lg:flex-row justify-between gap-12 text-center text-white">
          {[
            { number: "2,500", label: "HAPPY CLIENTS" },
            { number: "10", label: "YEARS IN THE INDUSTRY" },
            { number: "4", label: ["UNIVERSITIES OFFICIAL", "PHOTOGRAPHER"] },
            { number: "98%", label: "SATISFACTORY RATE" },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <h3 className="text-[48px] md:text-[72px] font-bold">
                {item.number}
              </h3>
              <p className="text-[18px] md:text-[24px]">
                {Array.isArray(item.label)
                  ? item.label.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))
                  : item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
