import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth scroll-pt-12 md:scroll-pt-16">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
