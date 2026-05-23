import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

function isWikiHost(hostname: string): boolean {
  return hostname === "wiki.localhost" || hostname.startsWith("wiki.");
}

export function proxy(request: NextRequest) {
  const hostHeader = request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (!isWikiHost(hostname)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/wiki" || pathname.startsWith("/wiki/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/wiki" : `/wiki${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/:path*",
};
