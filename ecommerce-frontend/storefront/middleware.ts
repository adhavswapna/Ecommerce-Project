// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/orders/:path*", "/profile/:path*"]
};

