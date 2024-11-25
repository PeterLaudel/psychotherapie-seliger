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

  const refreshedTokens = await oAuthClient.refreshAccessToken();
  const credentials = refreshedTokens.credentials;

  return {
    ...token,
    accessToken: credentials.access_token as string,
    expiresAt: credentials.expiry_date as number,
    refreshToken: credentials.refresh_token ?? token.refreshToken,
  };
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: `openid email profile https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://mail.google.com/`,
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
        accessToken: token.accessToken,
      };
    },
  },
};
