import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check for auth cookie set after password entry
  const auth = request.cookies.get("admin_auth")?.value;
  if (auth === process.env.ADMIN_PASSWORD) {
    return NextResponse.next();
  }

  // Allow POST to /admin/login to process the password form
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Redirect to login page
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};