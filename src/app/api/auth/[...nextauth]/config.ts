import { OAuth2Client } from "google-auth-library";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

const refreshToken = async (token: JWT): Promise<JWT> => {
  const oAuthClient = new OAuth2Client();
  oAuthClient.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
  });

  const {
    credentials: { access_token, expiry_date, refresh_token },
  } = await oAuthClient.refreshAccessToken();

  if (!access_token || !expiry_date)
    throw new Error("Failed to refresh access token");

  return {
    ...token,
    accessToken: access_token,
    expiresAt: expiry_date,
    refreshToken: refresh_token ?? token.refreshToken,
  };
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: `openid profile email https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://mail.google.com/`,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          provider: account.provider,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        };
      }
      if (token.expiresAt && token.expiresAt < Date.now() / 1000) {
        return await refreshToken(token);
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        provider: token.provider,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
    },
  },
};
