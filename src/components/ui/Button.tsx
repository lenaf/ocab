"use client";

import Link from "next/link";

export function Button({
  classNames,
  size,
  children,
  href,
  isExternal,
  onClick,
}: {
  classNames: string;
  size?: "xs" | "sm" | "md" | "lg";
  children: React.ReactNode;
  href?: string;
  isExternal?: boolean;
  onClick?: () => void;
}) {
  const sizeClass = size ? `btn-${size}` : "";
  const buttonClass = `btn ${classNames} ${sizeClass}`.trim();

  if (href && isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
}
