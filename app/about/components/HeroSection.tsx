"use client";

import { motion, Variants } from "framer-motion";

// Motion variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HeroSection() {
  return (
    <section className="w-full">
      {/* Background video */}
      <motion.div
        className="w-full overflow-hidden" // clips the video for rounded corners
        initial={{ opacity: 0, scale: 0.8, borderRadius: "12rem" }}
        whileInView={{ opacity: 1, scale: 1, borderRadius: "0rem" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.3 }} // <--- animation only happens once
      >
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source
            src="/assets/blinkworks/bcs_ad_10_things.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </motion.div>

      {/* Text content below video */}
      <motion.div
        className="max-w-full mx-auto px-6 md:px-12 lg:px-24 py-16 text-start"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }} // <--- animation only happens once
      >
        <motion.h1
          className="text-[#191919] text-[48px] md:text-[96px] font-bold mb-6"
          variants={fadeUp}
        >
          Lorem Ipsum
        </motion.h1>
        <motion.p
          className="text-[#808080] text-[24px] md:text-[36px]"
          variants={fadeUp}
        >
          Aperture Studio is more than just a photography studio—we are
          storytellers, artists, and memory makers. For over 15 years,
          we&apos;ve been dedicated to capturing the moments that matter most,
          transforming ordinary occasions into extraordinary visual narratives.
        </motion.p>
      </motion.div>
    </section>
  );
}
