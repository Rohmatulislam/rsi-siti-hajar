import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/backend(.*)", 
  "/profile(.*)",
  "/appointment(.*)",
  "/admin(.*)"
]);

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)", 
  "/sign-up(.*)", 
  "/",
  "/doctors(.*)",
  "/articles(.*)",
  "/faq(.*)",
  "/information(.*)",
  "/jobs(.*)",
  "/services(.*)",
  "/api(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // Biarkan rute publik dan API tidak dilindungi
  if (isPublicRoute(req)) {
    return;
  }
  
  // Lindungi rute yang memerlukan autentikasi
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
