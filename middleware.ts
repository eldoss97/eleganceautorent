// middleware.ts
import { NextResponse } from 'next/server';

// Блокируем всё под /admin без каких-либо условий
export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin Test"' },
  });
}
