import Link from "next/link";

interface SkewButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string; 
  onClick?: () => void;
}

export default function SkewButton({
  href,
  children,
  className = "",
  onClick,
}: SkewButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick} 
      className={`w-fit bg-[#A30A24] hover:bg-white border-3 border-[#A30A24] text-white hover:text-[#A30A24] text-[18px] px-8 py-2 transition transform inline-block ${className}`}
      style={{ transform: "skewX(-30deg)" }}
    >
      <span className="block" style={{ transform: "skewX(30deg)" }}>
        {children}
      </span>
    </Link>
  );
}
