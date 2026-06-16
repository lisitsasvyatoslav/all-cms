import fs from "node:fs";
import path from "node:path";

import ts from "typescript";

function formatTypeForDisplay(typeStr: string): string {
  return typeStr.replace(/\s+/g, " ").trim();
}

function resolveTypeString(typeStr: string, aliasMap: Map<string, string>, depth = 0): string {
  if (depth > 8) return typeStr;

  const trimmed = typeStr.trim();
  if (!trimmed) return "unknown";

  const arrayMatch = trimmed.match(/^(.+)\[\]$/);
  if (arrayMatch) {
    const inner = resolveTypeString(arrayMatch[1], aliasMap, depth + 1);
    return `${inner}[]`;
  }

  if (aliasMap.has(trimmed)) {
    return resolveTypeString(aliasMap.get(trimmed)!, aliasMap, depth + 1);
  }

  return trimmed;
}

function collectExportedTypeAliases(srcDir: string): Map<string, string> {
  const aliasMap = new Map<string, string>();

  for (const entry of fs.readdirSync(srcDir)) {
    if (!entry.endsWith(".ts") && !entry.endsWith(".tsx")) continue;

    const filePath = path.join(srcDir, entry);
    const content = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      entry.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );

    for (const stmt of sourceFile.statements) {
      if (!ts.isTypeAliasDeclaration(stmt)) continue;
      if (!stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;

      aliasMap.set(stmt.name.text, formatTypeForDisplay(stmt.type.getText(sourceFile)));
    }
  }

  return aliasMap;
}

/** Разворачивает export type ButtonSize → "sm" | "md" | "lg" для props-manifest. */
export function createUiKitTypeResolver(packageRoot: string): (typeStr: string) => string {
  const aliasMap = collectExportedTypeAliases(path.join(packageRoot, "src"));
  return (typeStr: string) => resolveTypeString(typeStr, aliasMap);
}

export function formatDocgenPropType(
  prop: { type: { name: string; raw?: string } },
  resolveType: (typeStr: string) => string,
): string {
  const raw = prop.type.raw?.trim();
  const name = prop.type.name?.trim();

  if (raw) return resolveType(raw);
  if (name) return resolveType(name);
  return "unknown";
}
