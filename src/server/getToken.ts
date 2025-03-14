import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/config";

export const getToken = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("No session found");
  }
  return session.accessToken;
};
