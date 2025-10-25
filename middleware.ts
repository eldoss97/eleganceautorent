// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isAdmin = req.cookies.get("admin_auth")?.value === "1";
  const { pathname } = req.nextUrl;

  // Защищаем всё под /admin (и не трогаем саму страницу логина /login)
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
