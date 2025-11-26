import Link from "next/link";
import { client } from "@/lib/sanity";
import { SanityImage } from "./ui/sanity-image";

export async function Header() {
  const settings = await client.fetch(
    `*[_type == "siteSettings"][0]{logo, siteName}`
  );

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {settings?.logo?.asset?._ref ? (
            <SanityImage
              asset={settings.logo.asset}
              alt={settings.siteName || "Our City Action Buffalo"}
              className="h-12 w-auto"
              width={200}
            />
          ) : (
            <span className="text-xl font-bold uppercase tracking-tight">
              {settings?.siteName || "Our City Action Buffalo"}
            </span>
          )}
        </Link>
        <nav className="flex gap-8 text-sm font-bold uppercase tracking-wide">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-red-600 transition-colors">
            About
          </Link>
          <Link href="/events" className="hover:text-red-600 transition-colors">
            Events
          </Link>
          <Link
            href="/join"
            className="bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-colors"
          >
            Join
          </Link>
        </nav>
      </div>
    </header>
  );
}
