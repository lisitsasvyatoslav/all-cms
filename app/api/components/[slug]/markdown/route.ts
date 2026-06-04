import { renderComponentMarkdownResponse } from "@/lib/markdown/render-component-markdown";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  return renderComponentMarkdownResponse(slug);
}
