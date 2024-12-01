import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

export const dynamic = "force-static";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Psychologische Psychotherapeutin | Verhaltenstherapie | Ute Seliger",
  description:
    "Psychotherapie (Verhaltenstherapie) in Leipzig/Waldstraßenviertel für Selbstzahler und Privatversicherte",
  keywords: [
    "Psychotherapie",
    "Psychotherapeut",
    "Psychologischer Psychotherapeut",
    "Einzeltherapie",
    "Praxis für Psychotherapie",
    "Verhaltenstherapie",
    "Psychotherapie Praxis",
    "Psychologische Beratung",
    "Psychische Gesundheit",
    "Psychotherapie Leipzig",
    "Psychotherapeut Leipzig",
    "Psychologe Leipzig",
    "Psychologin Leipzig",
    "Therapeut Leipzig",
    "Therapeutin Leipzig",
  ],
  alternates: {
    canonical: "https://www.psychotherapie-seliger.de/home",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth scroll-pt-12 lg:scroll-pt-16">
      <body className={inter.className}>
        <div className="sticky top-0 left-0 z-10">
          <Navbar />
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
