import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { PORTAL_BASE_PATH } from "@/lib/portal/portal-base-path";

function redirectToPortalBase(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? PORTAL_BASE_PATH : `${PORTAL_BASE_PATH}${pathname}`;
  return NextResponse.redirect(url);
}

/** /ds/components/web/button.md и legacy /components/... → API markdown. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const dsWebMarkdown = pathname.match(
    new RegExp(`^${PORTAL_BASE_PATH}/components/web/([^/]+)\\.md$`),
  );
  if (dsWebMarkdown) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/components/${dsWebMarkdown[1]}/markdown`;
    return NextResponse.rewrite(url);
  }

  const legacyMarkdown = pathname.match(/^\/components\/([^/]+)\.md$/);
  if (legacyMarkdown && legacyMarkdown[1] !== "web") {
    const url = request.nextUrl.clone();
    url.pathname = `${PORTAL_BASE_PATH}/components/web/${legacyMarkdown[1]}.md`;
    return NextResponse.redirect(url);
  }

  const webMarkdown = pathname.match(/^\/components\/web\/([^/]+)\.md$/);
  if (webMarkdown) {
    const url = request.nextUrl.clone();
    url.pathname = `${PORTAL_BASE_PATH}/components/web/${webMarkdown[1]}.md`;
    return NextResponse.redirect(url);
  }

  if (pathname === "/") {
    return redirectToPortalBase(request, pathname);
  }

  if (
    pathname.startsWith("/components") ||
    pathname.startsWith("/colors") ||
    pathname.startsWith("/showcase")
  ) {
    return redirectToPortalBase(request, pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/components/:path*", "/colors/:path*", "/showcase/:path*", "/ds/components/:path*"],
};
