import type { ReactNode } from "react";

import { PortalCodeBlock } from "./portal-code-block";
import { portalClass } from "@/lib/portal/core/classes";

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; code: string }
  | { type: "table"; rows: string[][] };

function parseMarkdown(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim() || /^<!--.*-->$/.test(line.trim())) {
      index += 1;
      continue;
    }

    const fence = line.match(/^```/);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      blocks.push({ type: "code", code: code.join("\n") });
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text: heading[2].replace(/^\[(.+)]\(.+\)$/, "$1"),
      });
      index += 1;
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*-\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*-\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    if (line.trim().startsWith("|") && lines[index + 1]?.match(/^\s*\|?[\s:|-]+\|\s*$/)) {
      const rows: string[][] = [];
      rows.push(splitTableRow(line));
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !/^```/.test(lines[index]) &&
      !/^\s*-\s+/.test(lines[index]) &&
      !lines[index].trim().startsWith("|")
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.replace(/\\\|/g, "|").trim());
}

function inline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\[[^\]]+]\([^)]+\)|_[^_]+_)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)]\(([^)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]}>{link[1]}</a>;
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

export function PortalMarkdown({ markdown }: { markdown: string }) {
  const blocks = parseMarkdown(markdown);

  return (
    <article className={portalClass.markdown}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const id = block.text.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-|-$/g, "");
          if (block.level === 1) return <h2 id={id} key={index}>{inline(block.text)}</h2>;
          if (block.level === 2) return <h3 id={id} key={index}>{inline(block.text)}</h3>;
          return <h4 id={id} key={index}>{inline(block.text)}</h4>;
        }
        if (block.type === "paragraph") return <p key={index}>{inline(block.text)}</p>;
        if (block.type === "list") {
          return <ul key={index}>{block.items.map((item) => <li key={item}>{inline(item)}</li>)}</ul>;
        }
        if (block.type === "code") return <PortalCodeBlock key={index} code={block.code} />;
        return (
          <div key={index} className={portalClass.propsTableWrap}>
            <table className={portalClass.propsTable}>
              <thead><tr>{block.rows[0]?.map((cell) => <th key={cell}>{inline(cell)}</th>)}</tr></thead>
              <tbody>{block.rows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inline(cell)}</td>)}</tr>
              ))}</tbody>
            </table>
          </div>
        );
      })}
    </article>
  );
}
