import { NextRequest, NextResponse } from "next/server";

const WWW_HOST = "www.autoesperto.it";
const CANONICAL_HOST = "autoesperto.it";

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0];
  if (host === WWW_HOST) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }
  if (request.nextUrl.pathname.startsWith("/og/")) {
    return NextResponse.redirect(new URL("/og-image.png", request.nextUrl.origin), 302);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
