import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const session = await auth();
  const isLoginPage = req.url.includes("/login");

  // 1. Check if user is logged in
  if (!session?.user) {
    if (isLoginPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2. Check if the token has expired
  const isExpired = session?.expiresAt && Date.now() >= session.expiresAt;
  if (isExpired) {
    // Redirect to login. NextAuth will automatically require them to re-authenticate.
    // If you want to wipe the session entirely, redirect them to a custom route
    // that calls `signOut()` on the client, or simply let them log in again.
    return NextResponse.redirect(
      new URL("/login?error=SessionExpired", req.url),
    );
  }

  // 3. Prevent logged-in users from accessing the login page
  if (isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/profile/:path*",
    "/projects/:path*",
    "/skills/:path*",
    "/awards/:path*",
    "/api-keys/:path*",
  ],
};
