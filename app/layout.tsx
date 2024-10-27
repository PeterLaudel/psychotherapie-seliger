import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
