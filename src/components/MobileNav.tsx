"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Navigation, Page } from "@/payload-types";

const BUTTON_STYLES: Record<string, string> = {
  primary: "bg-primary text-primary-content",
  accent: "bg-accent text-accent-content",
  success: "bg-success text-success-content",
  neutral: "bg-neutral text-neutral-content",
  outline: "border-2 border-current bg-transparent",
};

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

type CtaButton = NonNullable<Navigation["ctaButtons"]>[number];

interface MobileNavProps {
  navigation: Navigation;
  ctaButtons: CtaButton[];
}

export function MobileNav({ navigation, ctaButtons }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-neutral-content"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-overlay"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          id="mobile-nav-overlay"
          className="fixed inset-0 z-[100] bg-white flex flex-col lg:hidden"
        >
          {/* Top bar with close */}
          <div className="flex items-center justify-end px-6" style={{ height: "64px" }}>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-[#1A1A1A]"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto">
            {navigation.navItems?.map((item, i) => {
              const href = getNavHref(item);
              const label = getNavLabel(item);
              const active = isActive(href);
              const isExternal = item.linkType === "url";
              const hasDropdown = item.subItems && item.subItems.length > 0;

              return (
                <div key={i} className="border-b border-[#E5E5E5]">
                  {hasDropdown ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                        className={`w-full flex items-center justify-between px-6 py-4 text-[18px] font-semibold uppercase text-[#1A1A1A] ${
                          active ? "text-primary" : ""
                        }`}
                      >
                        {label}
                        <svg
                          className={`w-5 h-5 transition-transform ${openDropdown === i ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openDropdown === i && (
                        <div className="bg-[#FAF9F5]">
                          {item.subItems!.map((subItem, j) => {
                            const subHref = getNavHref(subItem);
                            const subLabel = getNavLabel(subItem);
                            const subExternal = subItem.linkType === "url";

                            return subExternal ? (
                              <a
                                key={j}
                                href={subHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="block px-10 py-3 text-[16px] font-medium text-[#1A1A1A]"
                              >
                                {subLabel}
                              </a>
                            ) : (
                              <Link
                                key={j}
                                href={subHref}
                                onClick={() => setIsOpen(false)}
                                className="block px-10 py-3 text-[16px] font-medium text-[#1A1A1A]"
                              >
                                {subLabel}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-4 text-[18px] font-semibold uppercase text-[#1A1A1A] ${
                        active ? "text-primary" : ""
                      }`}
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-4 text-[18px] font-semibold uppercase text-[#1A1A1A] ${
                        active ? "text-primary" : ""
                      }`}
                      {...(active ? { "aria-current": "page" as const } : {})}
                    >
                      {label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom CTA */}
          {ctaButtons.length > 0 && (
            <div className="p-6 border-t border-[#E5E5E5] space-y-3">
              {ctaButtons.map((btn, i) => {
                const href = btn.linkType === "url"
                  ? btn.url || "#"
                  : typeof btn.page === "object" && btn.page
                    ? `/${btn.page.slug === "home" ? "" : btn.page.slug}`
                    : "#";
                const isExternal = btn.linkType === "url";
                const style = BUTTON_STYLES[btn.style || "primary"] || BUTTON_STYLES.primary;

                const className = `block w-full text-center ${style} font-bold text-[15px] transition-opacity hover:opacity-90`;
                const inlineStyle = { padding: "14px 24px" };

                return isExternal ? (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className={className} style={inlineStyle}>
                    {btn.label}
                  </a>
                ) : (
                  <Link key={i} href={href} onClick={() => setIsOpen(false)} className={className} style={inlineStyle}>
                    {btn.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
