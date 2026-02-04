import Link from "next/link";

interface SkewButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string; // optional extra classes
}

export default function SkewButton({
  href,
  children,
  className = "",
}: SkewButtonProps) {
  return (
    <Link
      href={href}
      className={`bg-[#A30A24] hover:bg-white border-3 border-[#A30A24] text-white hover:text-[#A30A24] text-[14px] px-4 py-2 transition transform inline-block ${className}`}
      style={{ transform: "skewX(-30deg)" }}
    >
      <span className="block" style={{ transform: "skewX(30deg)" }}>
        {children}
      </span>
    </Link>
  );
}
