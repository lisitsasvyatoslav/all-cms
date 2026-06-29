export type ParsedFigmaUrl = {
  fileKey: string;
  nodeId?: string;
  rawUrl: string;
};

/**
 * Parse figma.com/design and figma.com/board URLs.
 * node-id query uses "-" in URL; MCP expects ":" in nodeId.
 */
export function parseFigmaUrl(rawUrl: string): ParsedFigmaUrl | { error: string } {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { error: "Invalid URL." };
  }

  if (!url.hostname.endsWith("figma.com")) {
    return { error: "URL must be a figma.com link." };
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const designIdx = parts.indexOf("design");
  const boardIdx = parts.indexOf("board");
  const branchIdx = parts.indexOf("branch");

  let fileKey: string | undefined;

  if (designIdx >= 0) {
    if (branchIdx === designIdx + 1 && parts[designIdx + 2]) {
      fileKey = parts[designIdx + 2];
    } else if (parts[designIdx + 1]) {
      fileKey = parts[designIdx + 1];
    }
  } else if (boardIdx >= 0 && parts[boardIdx + 1]) {
    fileKey = parts[boardIdx + 1];
  }

  if (!fileKey) {
    return { error: "Could not extract fileKey from Figma URL." };
  }

  const nodeIdParam = url.searchParams.get("node-id");
  const nodeId = nodeIdParam ? nodeIdParam.replace(/-/g, ":") : undefined;

  return { fileKey, nodeId, rawUrl: rawUrl.trim() };
}
