import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";   // <-- без фигурных скобок
import Footer from "@/components/Footer";   // <-- без фигурных скобок

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300","400","500","600","700","800"],
  variable: "--font-sans",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400","500","600","700","800","900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELEGANCE  AUTO",
  description: "Премиальная аренда авто в Алматы",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="font-sans bg-neutral-950 text-neutral-100 antialiased">
        <Navbar />
        <main className="container-max py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
