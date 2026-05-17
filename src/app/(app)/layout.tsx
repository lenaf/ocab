import "@/app/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Poppins, Nunito_Sans } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
});

const nunitoSans = Nunito_Sans({
  weight: ["300", "400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${nunitoSans.variable}`}
        style={{
          fontFamily: 'var(--font-sans), "Nunito Sans", sans-serif',
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
