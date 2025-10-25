// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") || "");
  const remember = form.get("remember") === "on";

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD is not set" },
      { status: 500 }
    );
  }
  if (password !== expected) {
    return NextResponse.json({ ok: false, error: "Неверный пароль" }, { status: 401 });
  }

  // Успех: ставим httpOnly-куку и ведём в /admin
  const res = NextResponse.redirect(new URL("/admin", req.url));

  // По умолчанию — СЕССИОННАЯ кука (до закрытия браузера).
  // Если включено "Запомнить меня" — живёт 7 дней.
  const cookieOpts: Parameters<typeof res.cookies.set>[2] = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { maxAge: 60 * 60 * 24 * 7 } : {}), // 7 дней
  };

  res.cookies.set("admin_auth", "1", cookieOpts);
  return res;
}

