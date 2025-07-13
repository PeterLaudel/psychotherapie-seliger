import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Navbar from "./navbar";
import Provider from "./provider";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth scroll-pt-12 md:scroll-pt-16">
      <body className={inter.className}>
        <Provider>
          <div className="flex flex-col bg-gray-100 h-screen overflow-auto">
            <div className="sticky top-0 left-0 z-10">
              <Navbar />
            </div>
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
