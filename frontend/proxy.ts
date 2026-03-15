import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  if (!refreshToken && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
