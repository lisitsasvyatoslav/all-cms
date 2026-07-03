import { Fragment, type ReactNode } from "react";

import { portalClass } from "@/lib/portal/core/classes";

const TSX_LINE_RE =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:import|export|from|function|return|const|let|var|type|interface|npm|npx|pnpm|yarn|bun)\b)|(<\/?[A-Za-z][\w.-]*)|(\{|\})|(@[\w.-]+\/[\w.-]+|--[\w-]+)/g;

function tokenClass(match: RegExpExecArray): string {
  if (match[1]) return portalClass.codeTokenString;
  if (match[2]) return portalClass.codeTokenKeyword;
  if (match[3]) return portalClass.codeTokenTag;
  if (match[4]) return portalClass.codeTokenPunct;
  if (match[5]) return portalClass.codeTokenString;
  return portalClass.codeTokenPlain;
}

export function highlightCodeLine(line: string): ReactNode {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of line.matchAll(TSX_LINE_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(
        <span key={key++} className={portalClass.codeTokenPlain}>
          {line.slice(lastIndex, index)}
        </span>,
      );
    }
    nodes.push(
      <span key={key++} className={tokenClass(match)}>
        {match[0]}
      </span>,
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < line.length) {
    nodes.push(
      <span key={key++} className={portalClass.codeTokenPlain}>
        {line.slice(lastIndex)}
      </span>,
    );
  }

  if (!nodes.length) {
    return line.length ? line : "\u00a0";
  }

  return <Fragment>{nodes}</Fragment>;
}
