import Link from "next/link";
import Image from "next/image";
import { themeConfig } from "@/config/theme";
import { getPayload } from "payload";
import config from "@/payload.config";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";
import type { Media, Navigation, SiteSetting } from "@/payload-types";

const BUTTON_STYLES: Record<string, string> = {
  primary: "bg-primary text-primary-content",
  accent: "bg-accent text-accent-content",
  success: "bg-success text-success-content",
  neutral: "bg-neutral text-neutral-content",
  outline: "border-2 border-current bg-transparent",
};

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

  const isWhite = navigation.style === "white";
  const logoUrl = getMediaUrl(siteSettings.logo) || themeConfig.logo.src;
  const logoAlt = siteSettings.siteName || themeConfig.logo.alt;

  return (
    <header
      className={`
        ${isWhite ? "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl text-base-content shadow-md" : "relative bg-neutral text-neutral-content shadow-sm"}
        border-b border-gray-200/20 transition-all duration-300
      `}
    >
      <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          {logoUrl && logoUrl !== "/logo.png" ? (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={180}
              height={60}
              priority
              className="drop-shadow-lg h-12 w-auto object-contain"
            />
          ) : (
            <span className="font-extrabold text-lg uppercase tracking-tight">
              {siteSettings.siteName || "Our City Action Buffalo"}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav navigation={navigation} />

        {/* CTA Buttons */}
        {navigation.ctaButtons && navigation.ctaButtons.length > 0 && (
          <div className="hidden lg:flex items-center gap-3">
            {navigation.ctaButtons.map((btn, i) => {
              const href = btn.linkType === "url"
                ? btn.url || "#"
                : typeof btn.page === "object" && btn.page
                  ? `/${btn.page.slug === "home" ? "" : btn.page.slug}`
                  : "#";
              const isExternal = href.startsWith("http://") || href.startsWith("https://");
              const style = BUTTON_STYLES[btn.style || "primary"] || BUTTON_STYLES.primary;

              return isExternal ? (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${style} px-5 py-3 font-bold text-sm uppercase hover:opacity-90 transition-opacity`}
                >
                  {btn.label}
                </a>
              ) : (
                <Link
                  key={i}
                  href={href}
                  className={`${style} px-5 py-3 font-bold text-sm uppercase hover:opacity-90 transition-opacity`}
                >
                  {btn.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile Navigation */}
        <MobileNav navigation={navigation} />
      </div>
    </header>
  );
}
