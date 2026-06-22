import { portalRouteToMarkdown } from "./portal-page-to-markdown";
import { parsePortalMarkdownPath } from "./portal-path";
import { markdownResponse } from "./render-component-markdown";

export async function renderPortalMarkdownResponse(pathname: string): Promise<Response> {
  const route = parsePortalMarkdownPath(pathname);
  if (!route) {
    return new Response("Not Found", { status: 404 });
  }

  const markdown = await portalRouteToMarkdown(route);
  if (markdown == null) {
    return new Response("Not Found", { status: 404 });
  }

  return markdownResponse(markdown);
}
