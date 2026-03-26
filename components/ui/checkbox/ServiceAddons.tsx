//components/ui/checkbox/ServiceAddons.tsx

"use client";

import { ServiceAddon } from "@/data/service";

interface Props {
  addons: ServiceAddon[];
  selectedAddons: ServiceAddon[];
  onChange: (addons: ServiceAddon[]) => void;
}

export default function ServiceAddons({
  addons,
  selectedAddons,
  onChange,
}: Props) {
  const toggleAddon = (addon: ServiceAddon) => {
    const exists = selectedAddons.some((a) => a.id === addon.id);
    if (exists) {
      onChange(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      onChange([...selectedAddons, addon]);
    }
  };

  return (
    <div className="mt-8 text-[#191919]">
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
              checked={selectedAddons.some((a) => a.id === addon.id)}
              onChange={() => toggleAddon(addon)}
              className="w-5 h-5 rounded border-2 border-[#A30A24]"
            />

            <div className="w-full flex justify-between">
              <p>{addon.label}</p>
              <p className="text-[#A30A24] font-bold">+₱{addon.price}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
