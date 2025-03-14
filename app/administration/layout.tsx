import "./globals.css";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import Navbar from "./navbar";
import Provider from "./provider";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="de" className="scroll-smooth scroll-pt-12 md:scroll-pt-16">
      <body className={inter.className}>
        <Provider>
          <div className="flex flex-col bg-gray-100 h-screen overflow-auto">
            <div className="sticky top-0 left-0 z-10">
              <Navbar />
            </div>
            {session && children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
