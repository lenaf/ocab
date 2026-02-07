import "@/app/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Poppins } from "next/font/google";

const poppinsLight = Poppins({
  weight: "300",
  subsets: ["latin"],
  variable: "--font-poppins-light",
});

const poppinsRegular = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins",
});

const poppinsSemiBold = Poppins({
  weight: "600",
  subsets: ["latin"],
  variable: "--font-poppins-semibold",
});

const poppinsBold = Poppins({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-poppins-bold",
});

const poppinsExtraBold = Poppins({
  weight: "800",
  subsets: ["latin"],
  variable: "--font-poppins-extrabold",
});

const poppinsBlack = Poppins({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-poppins-black",
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${poppinsLight.variable} ${poppinsRegular.variable} ${poppinsSemiBold.variable} ${poppinsBold.variable} ${poppinsExtraBold.variable} ${poppinsBlack.variable} font-sans`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
