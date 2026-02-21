import Link from "next/link";
import Image from "next/image";
import { themeConfig } from "@/config/theme";
import { getPayload } from "payload";
import config from "@/payload.config";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";
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
        ${isGlass ? "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl text-base-content shadow-md" : "relative bg-neutral text-neutral-content shadow-sm"}
        border-b border-gray-200/20 transition-all duration-300
      `}
    >
      <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center relative h-12 shrink-0">
          <Image
            src={logoUrl}
            alt={logoAlt}
            width={180}
            height={60}
            priority
            className="drop-shadow-lg h-full w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav navigation={navigation} />

        {/* Mobile Navigation */}
        <MobileNav navigation={navigation} />
      </div>
    </header>
  );
}
