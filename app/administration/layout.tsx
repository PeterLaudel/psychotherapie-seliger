import { getServerSession } from "next-auth";
import Provider from "./provider";
import Test from "./test";
import { authOptions } from "../api/auth/[...nextauth]/config";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <Provider>
      <div className="bg-gray-100 h-[100vh]">
        <Test />
        {session && children}
      </div>
    </Provider>
  );
}
