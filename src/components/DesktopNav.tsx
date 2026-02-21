"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Navigation } from "@/payload-types";

export function DesktopNav({ navigation }: { navigation: Navigation }) {
  const pathname = usePathname();

  const isActive = (slug: string) => {
    const href = `/${slug === "home" ? "" : slug}`;
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <nav className="hidden lg:flex gap-8 text-sm font-bold uppercase tracking-wide items-center">
      {navigation.navItems?.map((item) => {
        if (typeof item.page === "string") return null;
        const page = item.page;
        const label = item.label || page.title;
        const href = `/${page.slug === "home" ? "" : page.slug}`;
        const active = isActive(page.slug);

        // If this nav item has subItems, render a dropdown
        if (item.subItems && item.subItems.length > 0) {
          return (
            <div key={page.id} className="relative group">
              <Link
                href={href}
                className={`hover:text-accent transition-colors flex items-center gap-2 ${
                  active ? "text-primary border-b-2 border-primary pb-1" : ""
                }`}
              >
                {label}
                <svg
                  className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180"
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
              </Link>
              {/* Dropdown menu */}
              <div className="absolute left-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white text-base-content shadow-2xl rounded-xl overflow-hidden border border-gray-100 transform scale-95 group-hover:scale-100">
                <div className="py-2">
                  {item.subItems.map((subItem) => {
                    if (typeof subItem.page === "string") return null;
                    const subPage = subItem.page;
                    const subLabel = subItem.label || subPage.title;
                    const subHref = `/${subPage.slug === "home" ? "" : subPage.slug}`;
                    const subActive = isActive(subPage.slug);
                    return (
                      <Link
                        key={subPage.id}
                        href={subHref}
                        className={`block px-5 py-3 hover:bg-primary hover:text-primary-content transition-all duration-200 text-sm font-medium hover:pl-6 ${
                          subActive ? "bg-primary/10 text-primary font-bold" : ""
                        }`}
                      >
                        {subLabel}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        // Regular nav item without dropdown
        return (
          <Link
            key={page.id}
            href={href}
            className={`hover:text-accent transition-colors ${
              active ? "text-primary border-b-2 border-primary pb-1" : ""
            }`}
          >
            {label}
          </Link>
        );
      })}
      {navigation.ctaButton?.enabled &&
        navigation.ctaButton.page &&
        typeof navigation.ctaButton.page !== "string" && (
          <Link
            href={`/${navigation.ctaButton.page.slug === "home" ? "" : navigation.ctaButton.page.slug}`}
            className="bg-primary text-primary-content px-6 py-2 hover:bg-accent hover:text-accent-content transition-all rounded shadow-lg hover:shadow-xl"
          >
            {navigation.ctaButton.label}
          </Link>
        )}
    </nav>
  );
}
