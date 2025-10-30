// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
  });
}

export function middleware(req: NextRequest) {
  // Включатель. Если переменная отсутствует — считаем включённым.
  const enabled = (process.env.BASIC_AUTH_ENABLE ?? 'true').toLowerCase() !== 'false';
  if (!enabled) return NextResponse.next();

  const pathname = req.nextUrl.pathname;

  // Пропускаем всё, кроме /admin/* и /api/admin/*
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  const user = process.env.BASIC_AUTH_USER ?? 'admin';
  const pass = process.env.BASIC_AUTH_PASS ?? '';

  const auth = req.headers.get('authorization');
  if (!auth) return unauthorized();

  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) return unauthorized();

  // atob доступен в Edge Runtime
  const decoded = atob(encoded);
  const [u, p] = decoded.split(':');

  if (u === user && p === pass) {
    return NextResponse.next();
  }
  return unauthorized();
}

// Ограничиваем работу middleware только нужными путями
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
