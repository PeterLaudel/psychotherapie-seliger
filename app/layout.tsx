import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Psychologische Psychotherapeutin | Verhaltentherapie | Ute Seliger",
  description:
    "Psychotherapie (Verhaltenstherapie) in Leipzig/Waldstraßenviertel für Selbstzahler und Privatversicherte",
  keywords: [
    "Psychotherapie",
    "Psychotherapeut",
    "Psychotherapeutin",
    "Psychologische Psychotherapeutin",
    "Psychologischer Psychotherapeut",
    "Einzeltherapie",
    "Ute Seliger",
    "Psychotherapie Seliger",
    "Praxis für Psychotherapie",
    "Verhaltenstherapie",
    "VT",
    "Leipzig",
    "Waldstraßenviertel",
    "Selbstzahler",
    "Privatversicherte",
    "Depression",
    "Angst",
    "Zwang",
    "Essstörung",
    "Trauma",
    "Burnout",
    "Stress",
    "Schlafstörung",
    "Schmerz",
    "Sucht",
    "Krisenintervention",
    "Psychotherapie Praxis",
    "Psychologische Beratung",
    "Therapie",
    "Psychische Gesundheit",
    "Gesprächstherapie",
    "Kognitive Verhaltenstherapie",
    "Traumatherapie",
    "Angststörungen",
    "Depressive Störungen",
    "Stressbewältigung",
    "Burnout Prävention",
    "Psychologische Unterstützung",
    "Psychologische Hilfe",
    "Psychologische Beratung Leipzig",
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
