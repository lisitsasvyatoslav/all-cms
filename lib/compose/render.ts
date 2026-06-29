import { getComponentRegistry, getRegistryComponent } from "./registry";
import { parseCompositionDocument } from "./schema";
import type {
  CompositionNode,
  CompositionRenderOptions,
  CompositionRenderResult,
} from "./types";

/** Self-closing Radix components (no text/children in typical compose usage). */
const VOID_COMPONENTS = new Set([
  "TextField.Root",
  "TextArea",
  "Switch",
  "Separator",
  "Progress",
  "Skeleton",
  "Spinner",
  "Select.Trigger",
  "Select.Separator",
  "RadioGroup.Item",
  "Avatar",
]);

function jsxTagName(componentId: string): string {
  const entry = getRegistryComponent(componentId);
  if (entry?.member) {
    return `${entry.exportName}.${entry.member}`;
  }
  return componentId;
}

function escapeJsxText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

function serializePropValue(value: unknown): string {
  if (typeof value === "string") {
    if (value.includes('"') || value.includes("\n") || value.includes("\\")) {
      return `{${JSON.stringify(value)}}`;
    }
    return `"${value}"`;
  }

  if (typeof value === "boolean") {
    return value ? "" : "={false}";
  }

  if (typeof value === "number") {
    return `{${value}}`;
  }

  if (value === null) {
    return "={null}";
  }

  return `{${JSON.stringify(value)}}`;
}

function renderProps(props: Record<string, unknown> | undefined): string {
  if (!props || Object.keys(props).length === 0) {
    return "";
  }

  return Object.entries(props)
    .filter(([name, value]) => name !== "children" && !(typeof value === "boolean" && value === false))
    .map(([name, value]) => {
      if (typeof value === "boolean" && value) {
        return ` ${name}`;
      }
      return ` ${name}=${serializePropValue(value)}`;
    })
    .join("");
}

function renderNode(node: CompositionNode, depth: number): string {
  const indent = "  ".repeat(depth);
  const childIndent = "  ".repeat(depth + 1);
  const tag = jsxTagName(node.component);
  const propsStr = renderProps(node.props);

  const childLines: string[] = [];

  if (node.text !== undefined && node.text !== "") {
    childLines.push(`${childIndent}${escapeJsxText(node.text)}`);
  }

  if (node.props?.children !== undefined && typeof node.props.children === "string") {
    childLines.push(`${childIndent}${escapeJsxText(node.props.children)}`);
  }

  if (node.children) {
    for (const child of node.children) {
      childLines.push(renderNode(child, depth + 1));
    }
  }

  const isVoid = VOID_COMPONENTS.has(node.component);

  if (childLines.length === 0) {
    if (isVoid) {
      return `${indent}<${tag}${propsStr} />`;
    }
    return `${indent}<${tag}${propsStr}></${tag}>`;
  }

  return [
    `${indent}<${tag}${propsStr}>`,
    ...childLines,
    `${indent}</${tag}>`,
  ].join("\n");
}

function collectImports(root: CompositionNode): string[] {
  const registry = getComponentRegistry();
  const usedExportNames = new Set<string>();

  function walk(node: CompositionNode) {
    const entry = registry.components[node.component];
    if (entry) {
      usedExportNames.add(entry.exportName);
    }
    node.children?.forEach(walk);
  }

  walk(root);

  return [...usedExportNames].sort();
}

export function renderComposition(
  input: unknown,
  options: CompositionRenderOptions = {},
): CompositionRenderResult {
  const parsed = parseCompositionDocument(input);
  if (!parsed.success) {
    throw new Error(parsed.error);
  }

  const { package: packageName } = getComponentRegistry();
  const componentName = options.componentName ?? "ComposedUI";
  const useClient = options.useClient ?? true;
  const imports = collectImports(parsed.data.root);
  const importLine = `import { ${imports.join(", ")} } from "${packageName}";`;

  const body = renderNode(parsed.data.root, 2);
  const lines = [
    ...(useClient ? ['"use client";', ""] : []),
    importLine,
    "",
    `export function ${componentName}() {`,
    "  return (",
    body,
    "  );",
    "}",
    "",
  ];

  return {
    tsx: lines.join("\n"),
    imports,
  };
}
