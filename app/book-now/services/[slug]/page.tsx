"use client";

import { useState, useMemo, useEffect } from "react";
import { notFound } from "next/navigation";
import { SERVICES } from "@/data/service";
import ServiceAddons from "@/components/ui/checkbox/ServiceAddons";
import BookingForm from "@/components/ui/forms/BookingForm";
import type { ServiceAddon } from "@/data/service";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ServicePage({ params }: Props) {
  const [service, setService] = useState<(typeof SERVICES)[0] | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([]);

  useEffect(() => {
    params.then(({ slug }) => {
      const found = SERVICES.find((s) => s.slug === slug);
      if (!found) return notFound();
      setService(found);
    });
  }, [params]);

  const addonsTotal = useMemo(
    () => selectedAddons.reduce((sum, a) => sum + a.price, 0),
    [selectedAddons],
  );

  const totalPrice = service ? service.price + addonsTotal : 0;

  if (!service) return null;

  return (
    <section className="px-6 lg:px-24 py-24 bg-white">
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-[#A30A24] w-full h-fit p-8 text-[#161616]">
          <h1 className="text-[24px] md:text-[36px] font-bold mb-6">
            {service.title}
          </h1>

          <p className="text-[18px] md:text-[24px] font-bold text-[#A30A24]">
            ₱{service.price}
          </p>

          <p className="text-[16px] md:text-[18px] mb-4">{service.desc}</p>

          <p className="text-[18px] md:text-[24px] font-bold text-[#A30A24]">
            INCLUSIONS
          </p>

          <ul className="mt-6 space-y-2">
            {service.inclusions.map((item, index) => (
              <li key={index} className="flex gap-2">
                {item}
              </li>
            ))}
          </ul>

          <ServiceAddons
            addons={service.addons}
            selectedAddons={selectedAddons}
            onChange={setSelectedAddons}
          />

          <p className="mt-6 text-[20px] font-bold text-[#A30A24]">
            Total: ₱{totalPrice}
          </p>
        </div>

        <BookingForm
          service={service}
          selectedAddons={selectedAddons}
          totalPrice={totalPrice}
        />
      </div>
    </section>
  );
}
