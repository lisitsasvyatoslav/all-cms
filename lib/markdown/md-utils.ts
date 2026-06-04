export function mdEscapeTableCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function mdParagraph(text: string | null | undefined): string {
  if (!text?.trim()) return "";
  return text.trim().replace(/\n{3,}/g, "\n\n");
}

export function mdJoin(parts: (string | null | undefined)[], gap = "\n\n"): string {
  return parts.filter((p) => p?.trim()).join(gap);
}

export function mdHeading(level: 1 | 2 | 3 | 4, text: string): string {
  return `${"#".repeat(level)} ${text.trim()}`;
}

export function mdFence(code: string, lang = "tsx"): string {
  const body = code.trimEnd();
  return `\`\`\`${lang}\n${body}\n\`\`\``;
}

export function mdBulletList(items: string[]): string {
  return items.filter(Boolean).map((item) => `- ${item}`).join("\n");
}

export function mdOrderedList(items: string[]): string {
  return items
    .filter(Boolean)
    .map((item, i) => `${i + 1}. ${item}`)
    .join("\n");
}

export function mdGfmTable(
  headers: string[],
  rows: string[][],
): string {
  const head = `| ${headers.map(mdEscapeTableCell).join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows
    .map((row) => `| ${row.map(mdEscapeTableCell).join(" | ")} |`)
    .join("\n");
  return [head, sep, body].join("\n");
}

export function mdLink(label: string, href: string): string {
  return `[${label}](${href})`;
}

export function mdCheckbox(checked: boolean, label: string): string {
  return `- [${checked ? "x" : " "}] ${label}`;
}
