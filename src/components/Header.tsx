import Link from "next/link";
import Image from "next/image";
import { themeConfig } from "@/config/theme";

// todo: get nav and header data from payload
export function Header() {
  const { logo } = themeConfig;
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            priority
          />
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
