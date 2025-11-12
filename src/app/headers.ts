import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function middleware() {
  const requestHeaders = new Headers(await headers());
  
  // Tambahkan header keamanan
  requestHeaders.set('Content-Security-Policy', 
    `default-src 'self' 'unsafe-inline' data: blob:; 
     script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fresh-mule-30.accounts.dev https://fresh-mule-30.clerk.accounts.dev https://cdn.jsdelivr.net https://js.sentry-cdn.com https://browser.sentry-cdn.com https://*.sentry.io https://challenges.cloudflare.com https://scdn.clerk.com https://segapi.clerk.com https://clerk-telemetry.com https://clerk.com https://api.stripe.com https://maps.googleapis.com https://*.js.stripe.com https://js.stripe.com; 
     style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
     font-src 'self' https://fonts.gstatic.com; 
     img-src 'self' blob: data: https:; 
     connect-src 'self' https://clerk.vercel.pub https://api.clerk.dev https://*.clerk.com https://*.clerkstage.dev https://*.clerk.dev https://*.accounts.dev https://*.clerk.app https://*.clerkstage.app https://*.accountsstage.dev https://*.accountsstage.app https://*.clerk-dns.com https://*.clerk-dns.dev https://*.clerk-dns.stage https://*.clerk-dns.internal https://*.clerk-dns.local https://*.clerk-dns.localhost https://*.clerk-dns.127.0.0.1.xip.io https://*.clerk-dns.nip.io https://*.clerk-dns.localhost; 
     frame-src https://*.clerk.com https://*.clerkstage.dev https://*.clerk.dev https://*.accounts.dev https://*.clerk.app https://*.clerkstage.app https://*.accountsstage.dev https://*.accountsstage.app https://challenges.cloudflare.com; 
     child-src https://challenges.cloudflare.com; 
     object-src 'none'; 
     base-uri 'self'; 
     form-action 'self'; 
     frame-ancestors 'none'; 
     report-uri https://o123456.ingest.sentry.io/api/security/;`
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};