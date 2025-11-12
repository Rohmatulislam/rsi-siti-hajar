import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'rfbsyhpuuptvfeumxnra.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.com https://*.clerk.dev https://*.accounts.dev https://cdn.jsdelivr.net https://js.sentry-cdn.com https://browser.sentry-cdn.com https://*.sentry.io https://clerk-telemetry.com https://clerk.com https://api.stripe.com https://maps.googleapis.com https://*.js.stripe.com https://js.stripe.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' blob: data: https://*.supabase.co https:;
              connect-src 'self' https://*.clerk.com https://*.clerk.dev https://*.accounts.dev https://clerk.vercel.pub https://api.clerk.dev https://api.stripe.com https://maps.googleapis.com https://*.js.stripe.com https://js.stripe.com;
              frame-src 'self' blob: https://*.clerk.com https://*.clerk.dev https://*.accounts.dev https://challenges.cloudflare.com;
              child-src 'self' blob: https://challenges.cloudflare.com;
              worker-src 'self' blob:;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, " ").trim()
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;