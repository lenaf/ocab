import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";
import config from "@/payload.config";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import type { Media, Navigation, Page, SiteSetting } from "@/payload-types";

const BUTTON_STYLES: Record<string, string> = {
  primary: "bg-primary text-primary-content",
  accent: "bg-accent text-accent-content",
  success: "bg-success text-success-content",
  neutral: "bg-neutral text-neutral-content",
  outline: "border-2 border-current bg-transparent",
};

function getButtonHref(btn: { linkType?: string | null; page?: string | Page | null; url?: string | null }): string {
  if (btn.linkType === "url") return btn.url || "#";
  if (typeof btn.page === "object" && btn.page) {
    return `/${btn.page.slug === "home" ? "" : btn.page.slug}`;
  }
  return "#";
}

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

  const logoMedia =
    siteSettings.logo && typeof siteSettings.logo === "object"
      ? (siteSettings.logo as Media)
      : null;

  const logoUrl = logoMedia?.url || "";
  const logoAlt = logoMedia?.alt || siteSettings.siteName || "Our City Action Buffalo";
  const logoWidth = logoMedia?.width || 320;
  const logoHeight = logoMedia?.height || 80;

  const logo = logoUrl
    ? { url: logoUrl, alt: logoAlt, width: logoWidth, height: logoHeight }
    : null;

  const siteName = siteSettings.siteName || "OUR CITY ACTION BUFFALO";
  const ctaButtons = navigation.ctaButtons;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral">
      {/* Desktop */}
      <div className="hidden lg:flex items-center pl-8 pr-0" style={{ height: "76px" }}>
        {/* Left: Logo */}
        <Link href="/" aria-label="Our City Action Buffalo home" className="shrink-0">
          {logo ? (
            <Image
              src={logo.url}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              priority
              className="h-14 w-auto object-contain"
            />
          ) : (
            <span className="text-neutral-content" style={{ fontFamily: 'var(--font-heading), Poppins, sans-serif', fontSize: '17px', fontWeight: 700 }}>
              {siteName}
            </span>
          )}
        </Link>

        {/* Center: Nav links */}
        <div className="flex-1 flex items-center justify-center h-full">
          <DesktopNav navigation={navigation} variant="dark" />
        </div>

        {/* Right: CTA buttons */}
        <div className="flex items-stretch h-full shrink-0">
          {ctaButtons?.map((btn, i) => {
            const href = getButtonHref(btn);
            const isExternal = btn.linkType === "url";
            const style = BUTTON_STYLES[btn.style || "primary"] || BUTTON_STYLES.primary;

            const className = `${style} font-bold text-sm uppercase transition-opacity hover:opacity-90 flex items-center px-6`;

            return isExternal ? (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {btn.label}
              </a>
            ) : (
              <Link key={i} href={href} className={className}>
                {btn.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex items-stretch h-[64px]">
        {/* Left: Logo */}
        <Link href="/" aria-label="Our City Action Buffalo home" className="shrink-0 flex items-center pl-4">
          {logo ? (
            <Image
              src={logo.url}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              priority
              className="h-9 w-auto object-contain"
            />
          ) : (
            <span className="text-neutral-content" style={{ fontFamily: 'var(--font-heading), Poppins, sans-serif', fontSize: '15px', fontWeight: 700 }}>
              {siteName}
            </span>
          )}
        </Link>

        <div className="flex-1" />

        {/* Right: CTA buttons + Hamburger */}
        <div className="flex items-stretch shrink-0">
          {ctaButtons?.map((btn, i) => {
            const href = getButtonHref(btn);
            const isExternal = btn.linkType === "url";
            const style = BUTTON_STYLES[btn.style || "primary"] || BUTTON_STYLES.primary;
            const className = `${style} font-bold text-xs uppercase transition-opacity hover:opacity-90 flex items-center px-4`;

            return isExternal ? (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {btn.label}
              </a>
            ) : (
              <Link key={i} href={href} className={className}>
                {btn.label}
              </Link>
            );
          })}
          <div className="flex items-center px-4">
            <MobileNav navigation={navigation} />
          </div>
        </div>
      </div>
    </header>
  );
}
