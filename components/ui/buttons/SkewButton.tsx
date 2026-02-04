import Link from "next/link";
import React from "react";

interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

interface LinkProps extends BaseProps {
  href: string;
  onClick?: never;
}

interface ButtonProps extends BaseProps {
  onClick: () => void;
  href?: never;
}

type SkewButtonProps = LinkProps | ButtonProps;

export default function SkewButton(props: SkewButtonProps) {
  const commonClasses = `w-fit bg-[#A30A24] hover:bg-white border-3 border-[#A30A24]
    text-white hover:text-[#A30A24] text-[18px] px-8 py-2 transition transform
    inline-block ${props.className ?? ""}`;

  const content = (
    <span className="block" style={{ transform: "skewX(30deg)" }}>
      {props.children}
    </span>
  );

  // ✅ Button
  if ("onClick" in props) {
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

  // ✅ Link
  return (
    <Link
      href={props.href}
      className={commonClasses}
      style={{ transform: "skewX(-30deg)" }}
    >
      {content}
    </Link>
  );
}
