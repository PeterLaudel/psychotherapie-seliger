import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./footer";
import Navbar from "./navbar";

export const dynamic = "force-static";

// display "optional": paint with the size-adjusted fallback if Inter isn't
// ready within the block period — never swap mid-view (no text flicker)
const inter = Inter({ subsets: ["latin"], display: "optional" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.psychotherapie-seliger.de"),
  title:
    "Psychotherapie in Leipzig | Privatpraxis Ute Seliger – Verhaltenstherapie",
  description:
    "Privatpraxis für Psychotherapie im Waldstraßenviertel in Leipzig: Verhaltenstherapie für Erwachsene. Termine für Privatversicherte, Beihilfeberechtigte und Selbstzahler.",
  keywords: [
    "Psychotherapie Leipzig",
    "Psychologe Leipzig",
    "Therapeut Leipzig",
    "Privatpraxis Psychotherapie",
    "Praxis für Psychotherapie",
    "Verhaltenstherapie",
    "Psychologin Leipzig",
    "Psychologische Beratung",
    "Psychische Gesundheit",
    "Psychotherapeut Leipzig",
    "Selbstzahler",
    "Privatpatient",
  ],
  alternates: {
    canonical: "https://www.psychotherapie-seliger.de/home",
  },
  openGraph: {
    title: "Psychotherapie in Leipzig | Privatpraxis Ute Seliger",
    description:
      "Privatpraxis für Psychotherapie im Waldstraßenviertel in Leipzig: Verhaltenstherapie für Erwachsene – für Privatversicherte, Beihilfeberechtigte und Selbstzahler.",
    url: "https://www.psychotherapie-seliger.de/home",
    siteName: "Psychotherapie Seliger",
    locale: "de_DE",
    type: "website",
    images: [
      {
        url: "/raum.jpeg",
        alt: "Praxisraum der Privatpraxis für Psychotherapie Seliger in Leipzig",
      },
    ],
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
