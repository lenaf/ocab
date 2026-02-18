import Link from "next/link";
import Image from "next/image";
import { themeConfig } from "@/config/theme";
import { getPayload } from "payload";
import config from "@/payload.config";
import { NavIcon } from "./NavIcon";
import type { Media, Navigation, SiteSetting } from "@/payload-types";

export async function Header() {
  const payload = await getPayload({ config });

  const navigation = (await payload.findGlobal({
    // @ts-expect-error - Payload global types are overly strict
    slug: "navigation",
    depth: 2,
  })) as Navigation;
  const siteSettings = (await payload.findGlobal({
    // @ts-expect-error - Payload global types are overly strict
    slug: "site-settings",
    depth: 2,
  })) as SiteSetting;

  const getMediaUrl = (media: string | Media | null | undefined): string => {
    if (!media) return "";
    if (typeof media === "string") return "";
    return media.url || (media.filename ? `/media/${media.filename}` : "");
  };

  const isGlass = navigation.style === "glass";
  const logoUrl = getMediaUrl(siteSettings.logo) || themeConfig.logo.src;
  const logoAlt = siteSettings.siteName || themeConfig.logo.alt;

  return (
    <header
      className={`
        ${isGlass ? "fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg text-base-content" : "relative bg-neutral text-neutral-content"}
        border-b border-gray-200/20 shadow-sm
      `}
    >
      <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center relative h-12">
          <Image
            src={logoUrl}
            alt={logoAlt}
            width={180}
            height={60}
            priority
            className="drop-shadow-lg h-full w-auto object-contain"
          />
        </Link>
        <nav className="flex gap-8 text-sm font-bold uppercase tracking-wide items-center">
          {navigation.navItems?.map((item) => {
            if (typeof item.page === "string") return null;
            const page = item.page;
            const label = item.label || page.title;
            const href = `/${page.slug === "home" ? "" : page.slug}`;

            return (
              <Link
                key={page.id}
                href={href}
                className="hover:text-accent transition-colors flex items-center gap-2"
              >
                {item.icon && <NavIcon icon={item.icon} />}
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
      </div>
    </header>
  );
}
