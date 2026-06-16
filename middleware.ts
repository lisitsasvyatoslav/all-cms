import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** /components/web/button.md → API markdown; /components/button.md → редирект на новый путь. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const legacyMarkdown = pathname.match(/^\/components\/([^/]+)\.md$/);
  if (legacyMarkdown && legacyMarkdown[1] !== "web") {
    const url = request.nextUrl.clone();
    url.pathname = `/components/web/${legacyMarkdown[1]}.md`;
    return NextResponse.redirect(url);
  }

  const webMarkdown = pathname.match(/^\/components\/web\/([^/]+)\.md$/);
  if (webMarkdown) {
    const url = request.nextUrl.clone();
    url.pathname = `/api/components/${webMarkdown[1]}/markdown`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/components/:path*"],
};
