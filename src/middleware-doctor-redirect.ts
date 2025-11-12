import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware untuk redirect dari rute berbasis ID ke rute berbasis slug
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  
  // Cek apakah ini adalah rute dokter berbasis ID
  const doctorIdRegex = /^\/doctors\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(\?.*)?$/i;
  const match = pathname.match(doctorIdRegex);
  
  if (match) {
    const doctorId = match[1];
    // Redirect ke halaman detail dokter yang akan menangani redirect ke slug
    url.pathname = `/doctors/${doctorId}`;
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Konfigurasi middleware untuk hanya berjalan pada rute tertentu
export const config = {
  matcher: [
    '/doctors/:path*',
  ],
};