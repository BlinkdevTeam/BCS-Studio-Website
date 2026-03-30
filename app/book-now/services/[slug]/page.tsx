"use client";

import { useState, useMemo, useEffect } from "react";
import { notFound } from "next/navigation";
import ServiceAddons from "@/components/ui/checkbox/ServiceAddons";
import BookingForm from "@/components/ui/forms/BookingForm";
import type { Service, ServiceAddon } from "@/data/service";

interface Props {
  params: Promise<{ slug: string }>;
}

// ✅ API type (DB shape)
interface PackageAPI {
  id: string;
  title: string;
  description?: string;
  price: number | string;
  type?: "portrait" | "rental";
  inclusions: { id: string; text: string }[];
  addons: { id: string; label: string; price: number }[];
}

export default function ServicePage({ params }: Props) {
  // ✅ NOW using correct type
  const [service, setService] = useState<Service | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([]);

  // ✅ Fetch + map DB → Service
  useEffect(() => {
    params.then(async ({ slug }) => {
      try {
        const res = await fetch("/api/packages");

        if (!res.ok) throw new Error("Failed to fetch packages");

        const data: PackageAPI[] = await res.json();

        const pkg = data.find((p) => p.id === slug);

        if (!pkg) return notFound();

        // 🔥 MAP DB → UI (THIS FIXES YOUR ERROR)
        const mapped: Service = {
          id: pkg.id,
          slug: pkg.id, // temporary (can replace with real slug later)
          title: pkg.title,
          desc: pkg.description ?? "",
          price: Number(pkg.price),

          // map type → category
          category: pkg.type === "rental" ? "studio" : "portraits",

          image: "",

          inclusions: pkg.inclusions.map((i) => i.text),

          addons: pkg.addons.map((a) => ({
            id: a.id,
            label: a.label,
            price: a.price,
          })),
        };

        setService(mapped);
      } catch (err) {
        console.error("Failed to load service:", err);
      }
    });
  }, [params]);

  // Add-ons total
  const addonsTotal = useMemo(
    () => selectedAddons.reduce((sum, a) => sum + Number(a.price), 0), // ensure number
    [selectedAddons],
  );

  // Total price
  const totalPrice = service ? Number(service.price) + addonsTotal : 0;

  if (!service) return null;

  return (
    <section className="px-6 lg:px-24 py-24 bg-white">
      <div className="grid grid-cols-2 gap-4">
        {/* LEFT SIDE */}
        <div className="border-2 border-[#A30A24] w-full h-fit p-8 text-[#191919]">
          <h1 className="text-[24px] md:text-[36px] font-bold mb-6">
            {service.title}
          </h1>

          <p className="text-[18px] md:text-[24px] font-bold text-[#A30A24]">
            ₱{service.price.toLocaleString()}
          </p>

          {service.desc && (
            <p className="text-[16px] md:text-[18px] mb-4">{service.desc}</p>
          )}

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
            Total: ₱{totalPrice.toLocaleString()}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <BookingForm
          service={service}
          selectedAddons={selectedAddons}
          totalPrice={totalPrice}
        />
      </div>
    </section>
  );
}
