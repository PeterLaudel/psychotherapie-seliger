import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

export const dynamic = "force-static";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Psychotherapie Seliger | Psychotherapie in Leipzig | Verhaltenstherapie",
  description:
    "Lernen Sie meine Praxis für Psychotherapie in Leipzig kennen. Ich biete Verhaltenstherapie und psychologische Beratung für Ihre psychische Gesundheit.",
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
