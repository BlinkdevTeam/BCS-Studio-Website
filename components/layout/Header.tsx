import Link from "next/link";
import Navbar from "./Navbar";
import SkewButton from "../ui/buttons/SkewButton";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-full px-24 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <svg
            width="30"
            height="40"
            viewBox="0 0 43 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        </Link>

        {/* Navbar + Book Now */}
        <div className="flex items-center gap-12">
          <Navbar />
          <SkewButton href="/about">BOOK NOW</SkewButton>
        </div>
      </div>
    </header>
  );
}
