import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    provider: string;
    user: {
      name: string;
      email: string;
    };
  }

  interface Account {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    provider: string;
  }
}
