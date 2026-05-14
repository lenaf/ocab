"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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

export function MobileNav({ navigation }: { navigation: Navigation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMenu} />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-base-content">Menu</h2>
            <button onClick={toggleMenu} className="p-2 hover:bg-base-200 rounded-lg transition-colors" aria-label="Close menu">
              <X className="w-6 h-6 text-base-content" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-2">
              {navigation.navItems?.map((item, i) => {
                const href = getNavHref(item);
                const label = getNavLabel(item);
                const active = isActive(href);
                const isExternal = item.linkType === "url";

                if (item.subItems && item.subItems.length > 0) {
                  return (
                    <li key={i}>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-base-content hover:bg-base-200 rounded-lg transition-colors font-medium ${
                          active ? "bg-primary/10 text-primary border-l-4 border-primary" : ""
                        }`}
                      >
                        <span>{label}</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${openDropdown === i ? "rotate-180" : ""}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openDropdown === i && (
                        <ul className="mt-2 ml-4 space-y-1">
                          {item.subItems.map((subItem, j) => {
                            const subHref = getNavHref(subItem);
                            const subLabel = getNavLabel(subItem);
                            const subActive = isActive(subHref);
                            const subExternal = subItem.linkType === "url";

                            return (
                              <li key={j}>
                                {subExternal ? (
                                  <a
                                    href={subHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={toggleMenu}
                                    className="block px-4 py-2 text-base-content/80 hover:bg-base-200/50 rounded-lg transition-colors"
                                  >
                                    {subLabel}
                                  </a>
                                ) : (
                                  <Link
                                    href={subHref}
                                    onClick={toggleMenu}
                                    className={`block px-4 py-2 text-base-content/80 hover:bg-base-200/50 rounded-lg transition-colors ${
                                      subActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary" : ""
                                    }`}
                                  >
                                    {subLabel}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={i}>
                    {isExternal ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={toggleMenu}
                        className="block px-4 py-3 text-base-content hover:bg-base-200 rounded-lg transition-colors font-medium"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        onClick={toggleMenu}
                        className={`block px-4 py-3 text-base-content hover:bg-base-200 rounded-lg transition-colors font-medium ${
                          active ? "bg-primary/10 text-primary border-l-4 border-primary" : ""
                        }`}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA Buttons */}
          {navigation.ctaButtons && navigation.ctaButtons.length > 0 && (
            <div className="p-6 border-t space-y-3">
              {navigation.ctaButtons.map((btn, i) => {
                const href = btn.linkType === "url"
                  ? btn.url || "#"
                  : typeof btn.page === "object" && btn.page
                    ? `/${btn.page.slug === "home" ? "" : btn.page.slug}`
                    : "#";
                const isExternal = btn.linkType === "url";
                const style = BUTTON_STYLES[btn.style || "primary"] || BUTTON_STYLES.primary;

                return isExternal ? (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={toggleMenu}
                    className={`block w-full text-center ${style} px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity`}
                  >
                    {btn.label}
                  </a>
                ) : (
                  <Link
                    key={i}
                    href={href}
                    onClick={toggleMenu}
                    className={`block w-full text-center ${style} px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity`}
                  >
                    {btn.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
