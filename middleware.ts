import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { PORTAL_BASE_PATH } from "@/lib/portal/core/portal-base-path";
import { isPortalHtmlPath, PORTAL_MD_SUFFIX } from "@/lib/markdown/portal-path";

function redirectToPortalBase(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? PORTAL_BASE_PATH : `${PORTAL_BASE_PATH}${pathname}`;
  return NextResponse.redirect(url);
}

function rewritePortalMarkdown(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (!pathname.endsWith(PORTAL_MD_SUFFIX)) return null;

  const htmlPath = pathname.slice(0, -PORTAL_MD_SUFFIX.length) || "/";
  if (!isPortalHtmlPath(htmlPath)) return null;

  const url = request.nextUrl.clone();
  url.pathname = "/api/portal/markdown";
  url.searchParams.set("path", htmlPath);
  return NextResponse.rewrite(url);
}

/** Legacy /components/... → /ds/...; .md URL → API markdown. */
export function middleware(request: NextRequest) {
  const markdownRewrite = rewritePortalMarkdown(request);
  if (markdownRewrite) return markdownRewrite;

  const { pathname } = request.nextUrl;

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
  matcher: [
    "/",
    "/components/:path*",
    "/colors/:path*",
    "/showcase/:path*",
    "/ds.md",
    "/text.md",
    "/brand.md",
    "/ds/:path*",
    "/text/:path*",
    "/brand/:path*",
  ],
};
