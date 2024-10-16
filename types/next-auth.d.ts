import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
  }

  interface Account {
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken: string;
  }
}
