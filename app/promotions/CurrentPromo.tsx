import SkewButton from "@/components/ui/buttons/SkewButton";

const PROMOS = [
  {
    title: "First Session Discount",
    description:
      "Individual portrait sessions that capture your unique personality with professional lighting and artistic direction.",
    discount: "20% OFF",
    validUntil: "Valid until Mar 31, 2026",
    href: "/promotions/first-session",
    cta: "LEARN MORE",
  },
  {
    title: "Family Bundle Package",
    description:
      "Individual portrait sessions that capture your unique personality with professional lighting and artistic direction.",
    discount: "P299",
    validUntil: "Valid unti Mar 31, 2026",
    href: "/promotions/first-session",
    cta: "CLAIM OFFER",
  },
  {
    title: "Studio Rental",
    description:
      "Individual portrait sessions that capture your unique personality with professional lighting and artistic direction.",
    discount: "20% OFF",
    validUntil: "Valid unti Mar 31, 2026",
    href: "/promotions/first-session",
    cta: "LEARN MORE",
  },
  {
    title: "Graduation Special",
    description:
      "Individual portrait sessions that capture your unique personality with professional lighting and artistic direction.",
    discount: "P199",
    validUntil: "Valid unti Mar 31, 2026",
    href: "/promotions/first-session",
    cta: "LEARN MORE",
  },
];

export default function CurrentPromo() {
  return (
    <section className="bg-white px-6 md:px-24 py-24 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-6 mb-20">
        <h1 className="text-[48px] md:text-[72px] text-[#A30A24] font-bold">
          Current Promotions
        </h1>
        <p className="max-w-4xl text-[20px] md:text-[32px] text-[#6E6E6E]">
          Take a glimpse into our creative process and studio environment
        </p>
      </div>

      {/* Promo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {PROMOS.map((promo, index) => (
          <div
            key={index}
            className="border overflow-hidden shadow-md bg-white"
          >
            {/* Image Placeholder */}
            <div className="bg-[#A30A24] w-full h-[320px]" />

            {/* Content */}
            <div className="flex flex-col gap-6 p-12">
              <div>
                <h4 className="text-[36px] md:text-[48px] text-[#161616] font-bold">
                  {promo.title}
                </h4>
                <p className="text-[18px] md:text-[24px] text-[#6E6E6E] mt-2">
                  {promo.description}
                </p>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4">
                <h4 className="text-[36px] md:text-[48px] font-bold text-[#A30A24]">
                  {promo.discount}
                </h4>
                <p className="text-[18px] md:text-[24px] text-[#6E6E6E]">
                  {promo.validUntil}
                </p>
              </div>

              {/* CTA from data */}
              <SkewButton href={promo.href}>{promo.cta}</SkewButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
