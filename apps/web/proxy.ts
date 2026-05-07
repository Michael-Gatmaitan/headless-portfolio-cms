import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const session = await auth();

  if (!session?.user.id) {
    if (req.url.includes("/login")) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.url.includes("/login"))
    return NextResponse.redirect(new URL("/dashboard", req.url));

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
  ],
};
