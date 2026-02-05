import Link from "next/link";
import React from "react";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

// Add `type` for button variant
type SkewButtonProps =
  | (BaseProps & {
      href: string;
      onClick?: () => void;
      type?: never; // link cannot have type
    })
  | (BaseProps & {
      href?: never;
      onClick?: () => void;
      type?: "button" | "submit" | "reset"; // button can have type
      disabled?: boolean;
    });

export default function SkewButton(props: SkewButtonProps) {
  const { children, className, isActive } = props;

  const bgColor = isActive ? "bg-white" : "bg-[#A30A24] hover:bg-white";
  const textColor = isActive
    ? "text-[#A30A24]"
    : "text-white hover:text-[#A30A24]";
  const borderColor = "border-[#A30A24]";

  const commonClasses = `w-fit border-2 px-4 md:px-8 py-2
    inline-block text-[18px] transition transform
    ${bgColor} ${textColor} ${borderColor} ${className ?? ""}`;

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
      type={props.type || "button"} // default to "button"
      onClick={props.onClick}
      disabled={props.disabled}
      className={commonClasses}
      style={{ transform: "skewX(-30deg)" }}
    >
      {content}
    </button>
  );
}
