import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for authentication and route protection.
 * 
 * Flow:
 * - If user has valid refresh_token cookie, they're authenticated
 * - Authenticated users on /login or /register get redirected to /dashboard
 * - Unauthenticated users on protected routes get redirected to /login
 * - Special handling: ?force=true clears the refresh_token cookie (used when token is revoked)
 */
export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isAuthenticated = !!refreshToken;
  const forceLogout = request.nextUrl.searchParams.get("force") === "true";

  const { pathname } = request.nextUrl;

  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);

  if (forceLogout) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("refresh_token", "", { maxAge: 0 });
    return response;
  }

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/management/:path*",
    "/materials/:path*",
  ],
};
