import { test as baseTest } from "@playwright/test";
import { encode } from "next-auth/jwt";
import { db } from "@/initialize";
import { clearSqliteDatabase } from "tasks/dbUtils";

export const test = baseTest.extend<NonNullable<unknown>>({
  page: async ({ page, context }, use) => {
    const secret = process.env.NEXTAUTH_SECRET || "";
    const token = await encode({
      secret,
      token: {
        name: "Max Mustermann",
        email: "max.mustermann@example.com",
        picture: "https://example.com/avatar.png",
        sub: "google-oauth2|1234567890",
        accessToken: "dummy-access-token",
        refreshToken: "dummy-refresh-token",
        expiresAt: Math.floor(Date.now() / 1000) + 3600, // expires in 1 hour
      },
    });

    await context.addCookies([
      {
        name: "next-auth.session-token", // <-- Change this!
        value: token,
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        expires: -1,
      },
    ]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);

    await clearSqliteDatabase(db);
  },
});

export { expect } from "@playwright/test";
