import "@/app/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Source_Sans_3, Barlow_Condensed } from "next/font/google";

const sourceSans = Source_Sans_3({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} ${barlowCondensed.variable} font-sans`}
        style={{
          fontFamily: 'var(--font-source-sans), sans-serif',
        }}
      >
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
