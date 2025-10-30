// middleware.ts
import { NextResponse } from 'next/server';

// ЯВНО укажем пути, включая сам /admin без хвоста
export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};

export function middleware() {
  // Добавим отладочный заголовок, чтобы видеть, что middleware сработал
  return new NextResponse('Unauthorized (MW HIT)', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Test"',
      'x-mw-hit': 'yes',
    },
  });
}
