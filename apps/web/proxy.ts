import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const session = await auth();

  if (!session?.user.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/projects/:path*",
    "/skills/:path*",
    "/awards/:path*",
  ],
};
