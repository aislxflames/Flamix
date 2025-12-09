import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/login(.*)'])
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn } = await auth();
  const path = req.nextUrl.pathname;

  if (!isAuthenticated && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting
    return redirectToSignIn()
  }
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL('/dashboard', req.url))
  } 
    if (!isPublicRoute(req)) {
    await auth.protect()
  }

});


export const config = {
  matcher: [
    // Run on all routes except static files
    "/((?!_next|.*\\..*).*)",
    "/",
  ],
};
