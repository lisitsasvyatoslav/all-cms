import { renderPortalMarkdownResponse } from "@/lib/markdown/render-portal-markdown";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path?.startsWith("/")) {
    return new Response("Bad Request", { status: 400 });
  }

  return renderPortalMarkdownResponse(`${path}.md`);
}
