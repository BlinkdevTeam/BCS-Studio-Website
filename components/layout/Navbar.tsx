"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "ABOUT", href: "/" },
  { label: "WORKS", href: "/works" },
  { label: "PROMOTIONS", href: "/promotions" },
  { label: "FAQs", href: "/faqs" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex gap-12 text-[18px] mx-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  px-4 py-3 transition-colors border-b-4 font-medium
                  ${
                    isActive
                      ? "text-[#161616] border-[#A30A24]"
                      : "text-[#6E6E6E] border-transparent hover:text-[#A30A24] hover:border-[#A30A24]"
                  }
                `}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
