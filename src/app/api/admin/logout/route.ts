// src/app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("admin_auth", "", { path: "/", maxAge: 0 });
  return res;
}
