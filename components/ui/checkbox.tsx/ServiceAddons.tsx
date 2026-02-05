"use client";

import { useState } from "react";
import { ServiceAddon } from "@/data/service";

interface Props {
  addons: ServiceAddon[];
}

export default function ServiceAddons({ addons }: Props) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  return (
    <div className="mt-8 text-[#161616]">
      <h3 className="text-[20px] md:text-[24px] font-bold mb-4">
        Add-ons (optional)
      </h3>
      <div className="flex flex-col gap-3">
        {addons.map((addon) => (
          <label
            key={addon.id}
            className="w-full flex items-center gap-2 text-[16px] md:text-[18px]"
          >
            <input
              type="checkbox"
              checked={selectedAddons.includes(addon.id)}
              onChange={() => toggleAddon(addon.id)}
              className="w-5 h-5 rounded border-2 border-[#A30A24] appearance-none
             checked:bg-[#A30A24] checked:border-[#A30A24] checked:after:content-['✔'] 
             checked:after:text-white checked:after:block checked:after:text-center
             checked:after:text-[12px] cursor-pointer"
            />

            <div className="w-full flex justify-between">
              <p>{addon.label}</p>
              <p className="text-[#A30A24] font-bold">+{addon.price}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
