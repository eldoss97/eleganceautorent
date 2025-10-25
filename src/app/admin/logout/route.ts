// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  cookies().delete("admin_auth");
  return NextResponse.redirect(new URL("/", req.url));
}
