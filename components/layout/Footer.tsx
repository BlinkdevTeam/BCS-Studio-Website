import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>

        {/* Right */}
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="hover:underline">
            About
          </Link>
          <Link href="/works" className="hover:underline">
            Works
          </Link>
          <Link href="/promotions" className="hover:underline">
            Promotions
          </Link>
          <Link href="/faqs" className="hover:underline">
            FAQs
          </Link>
          <Link href="/book-now" className="font-medium hover:underline">
            Book Now
          </Link>
        </nav>
      </div>
    </footer>
  );
}
