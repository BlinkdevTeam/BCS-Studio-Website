import Link from "next/link";
import React from "react";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

type SkewButtonProps =
  | (BaseProps & {
      href: string;
      onClick?: () => void;
    })
  | (BaseProps & {
      href?: never;
      onClick: () => void;
    });

export default function SkewButton(props: SkewButtonProps) {
  const { children, className } = props;

  // Adjust padding for mobile so skew doesn't overflow
  const commonClasses = `w-fit bg-[#A30A24] hover:bg-white border-3 border-[#A30A24]
    text-white hover:text-[#A30A24] text-[18px] px-4 md:px-8 py-2 transition transform
    inline-block ${className ?? ""}`;

  const content = (
    <span className="block" style={{ transform: "skewX(30deg)" }}>
      {children}
    </span>
  );

  if (typeof props.href === "string") {
    return (
      <Link
        href={props.href}
        onClick={props.onClick}
        className={commonClasses}
        style={{ transform: "skewX(-30deg)" }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      className={commonClasses}
      style={{ transform: "skewX(-30deg)" }}
    >
      {content}
    </button>
  );
}
