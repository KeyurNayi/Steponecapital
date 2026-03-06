import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getHeader, getFooter } from "@/lib/strapi";
import CursorSpotlight from "@/components/CursorSpotlight";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StepOne Capital | Leading Financial Advisory Firm",
  description: "Specializing in capital markets, corporate restructuring, and strategic advisory services.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerData = await getHeader();
  const footerData = await getFooter();

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans bg-white`}
      >
        <CursorSpotlight />
        <Navbar data={headerData} />

        <main className="min-h-screen">
          {children}
        </main>
        <Footer data={footerData} />

      </body>
    </html>
  );
}
