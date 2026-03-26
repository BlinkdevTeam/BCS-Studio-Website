"use client";

import { motion, Variants } from "framer-motion";
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

// Framer Motion Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ServicesSection() {
  return (
    <div className="max-w-full mx-auto text-[#191919]">
      {/* Page Title */}
      <motion.h2
        className="text-[36px] md:text-[48px] font-bold text-center my-12"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        Our Services
      </motion.h2>

      {/* Portraits Section */}
      <motion.section
        className="bg-[#F2F2F2] flex flex-col lg:flex-row px-8 lg:px-24 py-24 gap-12 items-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Service Info */}
        <motion.div
          className="flex-1 flex flex-col gap-6 order-2 lg:order-1"
          variants={fadeUp}
        >
          <motion.div variants={fadeUp}>
            <motion.h3
              className="text-[48px] md:text-[72px] font-bold"
              variants={fadeUp}
            >
              Portraits
            </motion.h3>
            <motion.h4
              className="text-[24px] md:text-[36px] font-bold"
              variants={fadeUp}
            >
              Professional Studio Space
            </motion.h4>
            <motion.p
              className="text-[18px] md:text-[24px] text-[#808080]"
              variants={fadeUp}
            >
              Rent our state-of-the-art studio facilities for your creative
              projects. Our versatile spaces are equipped with professional
              lighting, backdrops, and all the amenities you need for a
              successful shoot.
            </motion.p>
          </motion.div>

          {/* Features List */}
          <motion.ul className="flex flex-col gap-2" variants={fadeUp}>
            {PORTRAITS_FEATURES.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-3"
                variants={fadeUp}
              >
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
                <span className="text-[18px] md:text-[24px] text-[#808080]">
                  {feature}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp}>
            <SkewButton href="/about">LEARN MORE</SkewButton>
          </motion.div>
        </motion.div>

        {/* Swiper Slider */}
        <motion.div className="flex-1 order-1 lg:order-2" variants={fadeUp}>
          <Swiper
            effect={"cards"}
            grabCursor={true}
            loop={true}
            modules={[EffectCards, Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
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
        </motion.div>
      </motion.section>

      {/* Studio Rental Section */}
      <motion.section
        className="py-24 md:py-40 px-8 lg:px-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="flex justify-center items-center my-12"
          variants={fadeUp}
        >
          <motion.h3
            className="text-[48px] md:text-[72px] font-bold"
            variants={fadeUp}
          >
            Studio Rental
          </motion.h3>
        </motion.div>

        <motion.div
          className="flex flex-col lg:flex-row gap-12 items-center"
          variants={fadeUp}
        >
          <motion.div
            className="flex-1 w-full lg:w-[820px] h-auto bg-[#A30A24] overflow-hidden"
            variants={fadeUp}
          >
            <video autoPlay muted loop className="w-full h-full object-cover">
              <source
                src="/assets/blinkworks/bcs_ad_10_things.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </motion.div>

          <motion.div className="flex-1 flex flex-col gap-6" variants={fadeUp}>
            <motion.div className="flex flex-col gap-2" variants={fadeUp}>
              <motion.h4
                className="text-[24px] md:text-[36px] font-bold"
                variants={fadeUp}
              >
                Professional Studio Space
              </motion.h4>
              <motion.h4
                className="text-[24px] md:text-[36px] text-[#A30A24] font-bold"
                variants={fadeUp}
              >
                P 650/hr
              </motion.h4>
              <motion.p
                className="text-[18px] md:text-[24px] text-[#808080]"
                variants={fadeUp}
              >
                Rent our studio for your creative projects. Equipped with
                professional lighting, backdrops, and all the amenities you need
                for a successful shoot.
              </motion.p>
            </motion.div>

            <motion.ul className="flex flex-col gap-2" variants={fadeUp}>
              {PORTRAITS_FEATURES.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3"
                  variants={fadeUp}
                >
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
                  <span className="text-[18px] md:text-[24px] text-[#808080]">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp}>
              <SkewButton href="/about">LEARN MORE</SkewButton>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Event Coverage Section */}
      <motion.section
        className="bg-[#191919] text-white py-20 md:py-28 px-8 lg:px-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="flex flex-col gap-16 items-center text-center"
          variants={fadeUp}
        >
          <motion.div className="flex flex-col gap-8" variants={fadeUp}>
            <motion.h3
              className="text-[48px] md:text-[72px] font-bold"
              variants={fadeUp}
            >
              Event Coverage
            </motion.h3>
            <motion.p
              className="text-[#808080] text-[24px] md:text-[36px]"
              variants={fadeUp}
            >
              From weddings to corporate events, we provide comprehensive
              photography coverage that captures every important moment with
              professional expertise and artistic vision.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col lg:flex-row gap-10 text-center"
            variants={fadeUp}
          >
            {["Weddings", "Special events", "Corporate Events"].map(
              (title, index) => (
                <motion.div
                  key={index}
                  className="bg-[#A30A24] hover:bg-white hover:text-[#A30A24] border-3 border-[#A30A24] py-24 px-14"
                  variants={fadeUp}
                >
                  <motion.h6
                    className="text-[24px] md:text-[36px] font-bold"
                    variants={fadeUp}
                  >
                    {title}
                  </motion.h6>
                  <motion.p
                    className="text-[18px] md:text-[24px]"
                    variants={fadeUp}
                  >
                    {index === 0 &&
                      "Complete wedding day coverage from preparation to reception"}
                    {index === 1 &&
                      "Birthdays, anniversaries, and milestone celebrations"}
                    {index === 2 &&
                      "Conferences, product launches, and business functions"}
                  </motion.p>
                </motion.div>
              ),
            )}
          </motion.div>

          <motion.div variants={fadeUp}>
            <SkewButton href="/about">LEARN MORE</SkewButton>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Numbers Section */}
      <motion.section
        className="bg-[#A30A24] py-16 px-8 lg:px-24"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="flex flex-col lg:flex-row justify-between gap-12 text-center text-white"
          variants={fadeUp}
        >
          {[
            { number: "2,500", label: "HAPPY CLIENTS" },
            { number: "10", label: "YEARS IN THE INDUSTRY" },
            { number: "4", label: ["UNIVERSITIES OFFICIAL", "PHOTOGRAPHER"] },
            { number: "98%", label: "SATISFACTORY RATE" },
          ].map((item, index) => (
            <motion.div key={index} className="text-center" variants={fadeUp}>
              <motion.h3
                className="text-[48px] md:text-[72px] font-bold"
                variants={fadeUp}
              >
                {item.number}
              </motion.h3>
              <motion.p
                className="text-[18px] md:text-[24px]"
                variants={fadeUp}
              >
                {Array.isArray(item.label)
                  ? item.label.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))
                  : item.label}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
