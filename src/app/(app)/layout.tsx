import { draftMode } from "next/headers";
import { VisualEditingClient } from "./VisualEditingClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Header />
        {children}
        <Footer />
        {isEnabled && <VisualEditingClient />}
      </body>
    </html>
  );
}
