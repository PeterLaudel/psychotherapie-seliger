import type { Metadata } from "next";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export const dynamic = "force-static";

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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="sticky top-0 left-0 z-10">
        <Navbar />
      </div>
      {children}
      <Footer />
    </>
  );
}
