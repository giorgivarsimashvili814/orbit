import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (!refreshToken && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/create-workspace", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};