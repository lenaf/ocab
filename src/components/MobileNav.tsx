"use client";

import { useState, useEffect } from "react";
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

interface MobileNavProps {
  navigation: Navigation;
}

export function MobileNav({ navigation }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const pathname = usePathname();


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
        <>
          <div
            className="fixed inset-0 z-[99] bg-black/40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            id="mobile-nav-overlay"
            className="fixed top-[64px] right-0 z-[100] bg-neutral flex flex-col lg:hidden w-[280px] max-h-[calc(100vh-64px)] overflow-y-auto shadow-xl"
          >
            {/* Nav links */}
            <nav>
              {navigation.navItems?.map((item, i) => {
                const href = getNavHref(item);
                const label = getNavLabel(item);
                const active = isActive(href);
                const isExternal = item.linkType === "url";
                const hasDropdown = item.subItems && item.subItems.length > 0;

                return (
                  <div key={i} className="border-b border-neutral-content/10">
                    {hasDropdown ? (
                      <>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                          className={`w-full flex items-center justify-between px-6 py-4 text-[14px] font-semibold uppercase tracking-[0.5px] text-neutral-content ${
                            active ? "text-primary" : ""
                          }`}
                        >
                          {label}
                          <svg
                            className={`w-4 h-4 transition-transform ${openDropdown === i ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openDropdown === i && (
                          <div className="bg-neutral-content/5">
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
                                  className="block px-10 py-3 text-[13px] font-medium uppercase tracking-[0.5px] text-neutral-content"
                                >
                                  {subLabel}
                                </a>
                              ) : (
                                <Link
                                  key={j}
                                  href={subHref}
                                  onClick={() => setIsOpen(false)}
                                  className="block px-10 py-3 text-[13px] font-medium uppercase tracking-[0.5px] text-neutral-content"
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
                        className={`block px-6 py-4 text-[14px] font-semibold uppercase tracking-[0.5px] text-neutral-content ${
                          active ? "text-primary" : ""
                        }`}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-6 py-4 text-[14px] font-semibold uppercase tracking-[0.5px] text-neutral-content ${
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

          </div>
        </>
      )}
    </>
  );
}
