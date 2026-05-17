"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Navigation, Page } from "@/payload-types";

function getNavHref(item: { linkType?: string | null; page?: string | Page | null; url?: string | null }): string {
  if (item.linkType === "url") return item.url || "#";
  if (typeof item.page === "object" && item.page) {
    return `/${item.page.slug === "home" ? "" : item.page.slug}`;
  }
  return "#";
}

function getNavLabel(item: { label?: string | null; linkType?: string | null; page?: string | Page | null }): string {
  if (item.label) return item.label;
  if (typeof item.page === "object" && item.page) return item.page.title;
  return "";
}

export function DesktopNav({ navigation, variant = "light" }: { navigation: Navigation; variant?: "light" | "dark" }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  const openMenu = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(index);
  };

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpenDropdown(null);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <nav ref={navRef} className="flex items-center gap-0 h-full">
      {navigation.navItems?.map((item, i) => {
        const href = getNavHref(item);
        const label = getNavLabel(item);
        const active = isActive(href);
        const isExternal = item.linkType === "url";
        const hasDropdown = item.subItems && item.subItems.length > 0;
        const isOpen = openDropdown === i;

        const textColor = variant === "dark"
          ? active ? "text-primary" : "text-white/80 hover:text-white"
          : active ? "text-primary" : "text-[#1A1A1A]";
        const linkClasses = `
          h-full px-4 flex items-center gap-1.5 whitespace-nowrap transition-all duration-150
          text-[14px] font-semibold uppercase tracking-[0.5px] ${textColor}
        `.trim();

        if (hasDropdown) {
          return (
            <div
              key={i}
              className="relative"
              onMouseEnter={() => openMenu(i)}
              onMouseLeave={closeMenu}
            >
              {isExternal ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                >
                  {label}
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={href}
                  className={linkClasses}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  {...(active ? { "aria-current": "page" as const } : {})}
                >
                  {label}
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              )}

              {isOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-64 bg-neutral border border-white/10 shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
                  onMouseEnter={() => openMenu(i)}
                  onMouseLeave={closeMenu}
                >
                  {item.subItems!.map((subItem, j) => {
                    const subHref = getNavHref(subItem);
                    const subLabel = getNavLabel(subItem);
                    const subActive = isActive(subHref);
                    const subExternal = subItem.linkType === "url";

                    const subClasses = `block px-5 py-3 text-[14px] font-semibold uppercase tracking-[0.5px] text-white/80 hover:text-white hover:bg-white/10 transition-colors ${
                      subActive ? "text-primary" : ""
                    }`;

                    return subExternal ? (
                      <a key={j} href={subHref} target="_blank" rel="noopener noreferrer" className={subClasses}>
                        {subLabel}
                      </a>
                    ) : (
                      <Link key={j} href={subHref} className={subClasses}>
                        {subLabel}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        const NavTag = isExternal ? "a" : Link;
        const extraProps = isExternal
          ? { href, target: "_blank", rel: "noopener noreferrer" }
          : { href };

        return (
          <NavTag
            key={i}
            {...extraProps}
            className={linkClasses}
            style={{ height: "56px" }}
            {...(active ? { "aria-current": "page" as const } : {})}
          >
            {label}
          </NavTag>
        );
      })}
    </nav>
  );
}
