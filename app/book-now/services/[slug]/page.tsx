import { notFound } from "next/navigation";
import { SERVICES } from "@/data/service";
import ServiceAddons from "@/components/ui/checkbox.tsx/ServiceAddons";
import BookingForm from "@/components/ui/forms/BookingForm";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;

  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <section className="px-6 lg:px-24 py-24 bg-white">
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-[#A30A24] w-full h-fit p-8 text-[#161616]">
          <h1 className="text-[24px] md:text-[36px] font-bold mb-6">
            {service.title}
          </h1>

          <p className="text-[18px] md:text-[24px] font-bold text-[#A30A24]">
            {service.price}
          </p>
          <p className="text-[16px] md:text-[18px] mb-4">{service.desc}</p>
          <p className="text-[18px] md:text-[24px] font-bold text-[#A30A24]">
            INCLUSIONS
          </p>
          <ul className="mt-6 space-y-2">
            {service.inclusions.map((item, index) => (
              <li
                key={index}
                className="text-[16px] md:text-[18px] text-[#161616] flex items-start gap-2"
              >
                <span className="text-[#A30A24] font-bold">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.6668 8L12.0002 22.6667L5.3335 16"
                      stroke="#A20C23"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <ServiceAddons addons={service.addons} />
        </div>
        <div>
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
