"use client";

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

export function DesktopNav({ navigation }: { navigation: Navigation }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return (
    <nav className="hidden lg:flex gap-8 items-center" style={{ fontSize: '15px', fontWeight: 400, color: '#1A1A1A' }}>
      {navigation.navItems?.map((item, i) => {
        const href = getNavHref(item);
        const label = getNavLabel(item);
        const active = isActive(href);
        const isExternal = item.linkType === "url";

        if (item.subItems && item.subItems.length > 0) {
          return (
            <div key={i} className="relative group">
              {isExternal ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:text-accent transition-colors flex items-center gap-2 ${
                    active ? "text-primary border-b-2 border-primary pb-1" : ""
                  }`}
                >
                  {label}
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              ) : (
                <Link
                  href={href}
                  className={`hover:text-accent transition-colors flex items-center gap-2 ${
                    active ? "text-primary border-b-2 border-primary pb-1" : ""
                  }`}
                >
                  {label}
                  <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              )}
              <div className="absolute left-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white text-base-content shadow-2xl overflow-hidden border border-gray-100 transform scale-95 group-hover:scale-100">
                <div className="py-2">
                  {item.subItems.map((subItem, j) => {
                    const subHref = getNavHref(subItem);
                    const subLabel = getNavLabel(subItem);
                    const subActive = isActive(subHref);
                    const subExternal = subItem.linkType === "url";

                    return subExternal ? (
                      <a
                        key={j}
                        href={subHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-5 py-3 hover:bg-primary hover:text-primary-content transition-all duration-200 text-sm font-medium hover:pl-6"
                      >
                        {subLabel}
                      </a>
                    ) : (
                      <Link
                        key={j}
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

        return isExternal ? (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-accent transition-colors ${
              active ? "text-primary border-b-2 border-primary pb-1" : ""
            }`}
          >
            {label}
          </a>
        ) : (
          <Link
            key={i}
            href={href}
            className={`hover:text-accent transition-colors ${
              active ? "text-primary border-b-2 border-primary pb-1" : ""
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
