"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import SkewButton from "../ui/buttons/SkewButton";

const NAV_ITEMS = [
  { label: "ABOUT", href: "/" },
  { label: "WORKS", href: "/works" },
  { label: "PROMOTIONS", href: "/promotions" },
  { label: "FAQs", href: "/faqs" },
];

export default function Header() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-full px-6 md:px-12 lg:px-24 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="h-12 w-auto">
            {" "}
            {/* max height for responsiveness */}
            <svg
              viewBox="0 0 43 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-auto"
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M8.47533 54.6794L0.0496521 56.9615V11.6663L8.47533 9.3842V54.6794Z"
                  fill="#A30A24"
                />
                <path
                  d="M21.1144 17.8968V15.4441L42.9641 9.52566V0.0405731L11.4146 8.58745V30.0093L42.9641 21.4624V11.9783L21.1144 17.8968Z"
                  fill="#A30A24"
                />
                <path
                  d="M33.2643 38.4802V36.0275L11.4146 41.946V32.4619L42.9641 23.915V45.3368L11.4146 53.8827V44.3986L33.2643 38.4802Z"
                  fill="#A30A24"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="43" height="57" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </Link>

        {/* Desktop Navbar + Book Now */}
        <div className="hidden lg:flex items-center gap-12">
          <ul className="flex gap-12 text-[18px]">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`px-4 py-3 transition-colors border-b-4 font-medium ${
                      isActive
                        ? "text-[#161616] border-[#A30A24]"
                        : "text-[#6E6E6E] border-transparent hover:text-[#A30A24] hover:border-[#A30A24]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <SkewButton href="/about">BOOK NOW</SkewButton>
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[36px] md:text-[48px] focus:outline-none"
          >
            <HiMenu />
          </button>

          {/* Mobile Sidebar */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
              sidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-3xl focus:outline-none"
              >
                <HiX />
              </button>
            </div>

            <ul className="flex flex-col mt-8 gap-6 text-[18px] px-6">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`block px-2 py-2 transition-colors font-medium ${
                        isActive
                          ? "text-[#161616] border-l-4 border-[#A30A24]"
                          : "text-[#6E6E6E] hover:text-[#A30A24] hover:border-l-4 hover:border-[#A30A24]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="px-6 mt-6">
              <SkewButton href="/about" onClick={() => setSidebarOpen(false)}>
                BOOK NOW
              </SkewButton>
            </div>
          </div>

          {/* Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
        </div>
      </div>
    </header>
  );
}
