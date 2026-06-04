import { componentDocToMarkdown } from "./component-to-markdown";
import { loadComponentDocument } from "./load-component-document";

export async function getComponentMarkdownText(
  componentSlug: string,
): Promise<string | null> {
  const doc = await loadComponentDocument(componentSlug);
  if (!doc) return null;
  return componentDocToMarkdown(doc);
}

export function markdownResponse(markdown: string): Response {
  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function renderComponentMarkdownResponse(
  componentSlug: string,
): Promise<Response> {
  const markdown = await getComponentMarkdownText(componentSlug);
  if (markdown == null) {
    return new Response("Not Found", { status: 404 });
  }
  return markdownResponse(markdown);
}
