"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { Navigation } from "@/payload-types";

interface MobileNavProps {
  navigation: Navigation;
}

export function MobileNav({ navigation }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = (pageId: string) => {
    setOpenDropdown(openDropdown === pageId ? null : pageId);
  };

  const isActive = (slug: string) => {
    const href = `/${slug === "home" ? "" : slug}`;
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-2">
              {navigation.navItems?.map((item) => {
                if (typeof item.page === "string") return null;
                const page = item.page;
                const label = item.label || page.title;
                const href = `/${page.slug === "home" ? "" : page.slug}`;

                const active = isActive(page.slug);

                // Item with dropdown
                if (item.subItems && item.subItems.length > 0) {
                  return (
                    <li key={page.id}>
                      <button
                        onClick={() => toggleDropdown(page.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium ${
                          active ? "bg-primary/10 text-primary border-l-4 border-primary" : ""
                        }`}
                      >
                        <span>{label}</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            openDropdown === page.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openDropdown === page.id && (
                        <ul className="mt-2 ml-4 space-y-1">
                          {item.subItems.map((subItem) => {
                            if (typeof subItem.page === "string") return null;
                            const subPage = subItem.page;
                            const subLabel = subItem.label || subPage.title;
                            const subHref = `/${subPage.slug === "home" ? "" : subPage.slug}`;
                            const subActive = isActive(subPage.slug);
                            return (
                              <li key={subPage.id}>
                                <Link
                                  href={subHref}
                                  onClick={toggleMenu}
                                  className={`block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors ${
                                    subActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary" : ""
                                  }`}
                                >
                                  {subLabel}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                // Regular item
                return (
                  <li key={page.id}>
                    <Link
                      href={href}
                      onClick={toggleMenu}
                      className={`block px-4 py-3 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium ${
                        active ? "bg-primary/10 text-primary border-l-4 border-primary" : ""
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA Button */}
          {navigation.ctaButton?.enabled &&
            navigation.ctaButton.page &&
            typeof navigation.ctaButton.page !== "string" && (
              <div className="p-6 border-t">
                <Link
                  href={`/${navigation.ctaButton.page.slug === "home" ? "" : navigation.ctaButton.page.slug}`}
                  onClick={toggleMenu}
                  className="block w-full text-center bg-primary text-primary-content px-6 py-3 rounded-lg font-bold hover:bg-accent hover:text-accent-content transition-all shadow-lg"
                >
                  {navigation.ctaButton.label}
                </Link>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
