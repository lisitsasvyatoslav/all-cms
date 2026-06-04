import { mdJoin, mdParagraph } from "./md-utils";

type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  format?: number;
  url?: string;
  listType?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 8;
const IS_CODE = 16;

function formatInlineText(text: string, format = 0): string {
  if (!text) return "";
  let out = text;
  if (format & IS_CODE) out = `\`${out.replace(/`/g, "\\`")}\``;
  if (format & IS_STRIKETHROUGH) out = `~~${out}~~`;
  if (format & IS_ITALIC) out = `*${out}*`;
  if (format & IS_BOLD) out = `**${out}**`;
  return out;
}

function nodeToMarkdown(node: LexicalNode, listDepth = 0): string {
  const type = node.type ?? "unknown";
  const children = node.children ?? [];

  switch (type) {
    case "root":
      return mdJoin(children.map((c) => nodeToMarkdown(c, listDepth)));
    case "paragraph":
      return mdParagraph(
        children.map((c) => nodeToMarkdown(c, listDepth)).join(""),
      );
    case "text":
      return formatInlineText(node.text ?? "", node.format as number);
    case "linebreak":
      return "\n";
    case "heading": {
      const level = Math.min(
        6,
        Math.max(1, Number.parseInt(String(node.tag ?? "h2").replace("h", ""), 10) || 2),
      );
      const inner = children.map((c) => nodeToMarkdown(c, listDepth)).join("");
      return `${"#".repeat(level)} ${inner.trim()}`;
    }
    case "quote":
      return children
        .map((c) => nodeToMarkdown(c, listDepth))
        .join("")
        .split("\n")
        .filter(Boolean)
        .map((line) => `> ${line}`)
        .join("\n");
    case "link": {
      const inner = children.map((c) => nodeToMarkdown(c, listDepth)).join("");
      const url = typeof node.url === "string" ? node.url : "";
      return url ? `[${inner || url}](${url})` : inner;
    }
    case "list": {
      const isNumber = node.listType === "number";
      const items = children
        .map((c) => nodeToMarkdown(c, listDepth + 1))
        .filter(Boolean);
      if (isNumber) {
        return items.map((item, i) => `${i + 1}. ${item.replace(/^\d+\.\s/, "")}`).join("\n");
      }
      const indent = "  ".repeat(listDepth);
      return items.map((item) => `${indent}- ${item.replace(/^- /, "")}`).join("\n");
    }
    case "listitem":
      return mdJoin(children.map((c) => nodeToMarkdown(c, listDepth)));
    default:
      if (children.length) {
        return mdJoin(children.map((c) => nodeToMarkdown(c, listDepth)));
      }
      return "";
  }
}

/** Lexical JSON (Payload richText) → Markdown. */
export function lexicalToMarkdown(data: unknown): string {
  if (!data || typeof data !== "object" || !("root" in data)) return "";
  const root = (data as { root?: LexicalNode }).root;
  if (!root) return "";
  const md = nodeToMarkdown(root).trim();
  return md || "";
}
