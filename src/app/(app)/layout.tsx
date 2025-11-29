import { draftMode } from "next/headers";
import { VisualEditingClient } from "./VisualEditingClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Poppins } from "next/font/google";
import "./globals.css";

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

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en">
      <body className={`${poppinsLight.variable} ${poppinsRegular.variable} ${poppinsSemiBold.variable} ${poppinsBold.variable} ${poppinsExtraBold.variable} ${poppinsBlack.variable} font-sans`}>
        <Header />
        {children}
        <Footer />
        {isEnabled && <VisualEditingClient />}
      </body>
    </html>
  );
}
