import { getServerSession } from "next-auth";
import Provider from "./provider";
import Navbar from "./navbar";
import { authOptions } from "../api/auth/[...nextauth]/config";

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
