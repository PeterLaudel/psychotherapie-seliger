import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/config";
import Navbar from "./navbar";
import Provider from "./provider";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <Provider>
      <div className="flex flex-col bg-gray-100 h-screen">
        <Navbar />
        {session && children}
      </div>
    </Provider>
  );
}
