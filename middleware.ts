import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** /components/button.md → внутренний API с text/markdown (URL в браузере не меняется). */
export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/components\/([^/]+)\.md$/);
  if (!match) return NextResponse.next();

  const componentSlug = match[1];
  const url = request.nextUrl.clone();
  url.pathname = `/api/components/${componentSlug}/markdown`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/components/:path*"],
};
