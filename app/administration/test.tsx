"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Test() {
  const { data: session } = useSession();
  if (!session) {
    return <button onClick={() => signIn()}>Sign In</button>;
  }

  return <button onClick={() => signOut()}>Sign Out</button>;
}