import { NextResponse } from "next/server";

import { auth } from "@/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const session = req.auth;

  if (path.startsWith("/account") && !session) {
    const signIn = new URL("/signin", req.url);
    signIn.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signIn);
  }

  if (path.startsWith("/admin")) {
    if (!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
