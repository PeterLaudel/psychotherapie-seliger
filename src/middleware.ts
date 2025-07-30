import { NextRequest, NextResponse } from "next/server";
import withAuth from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

const isDevMode = process.env.NODE_ENV !== "production";

const auth_Middleware = withAuth(
  async (req: NextRequest) => {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if token exists and is expired
    if (
      !token ||
      (typeof token.exp === "number" && Date.now() / 1000 > token.exp)
    ) {
      const signinUrl = new URL("/api/auth/signin", req.url);
      signinUrl.searchParams.set("callbackUrl", req.nextUrl.href);
      return NextResponse.redirect(signinUrl);
    }
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/api/auth/signin",
    },
  }
);

const default_Middleware = () => {
  return NextResponse.next();
};

// const middleware = isDevMode ? default_Middleware : auth_Middleware;
export default default_Middleware;

// export const config = {
//   matcher: ["/administration/:path*"],
// };
