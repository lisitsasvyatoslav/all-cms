import type { Component } from "@/payload-types";

import {
  componentCodeSnippetsBySlug,
  type BootstrapPropRow,
  type ComponentCodeSnippets,
} from "./component-code-snippets";

type Documentation = NonNullable<Component["documentation"]>;

export function propsTableRowsFromSnippets(props: BootstrapPropRow[]) {
  return props.map((row) => ({
    name: row.name,
    type: row.type,
    defaultValue: row.default ?? "—",
    description: row.description,
  }));
}

export function propsTableRowsForSlug(slug: string) {
  const snippets = componentCodeSnippetsBySlug[slug];
  if (!snippets) return [];
  return propsTableRowsFromSnippets(snippets.props);
}

function blocksFromSnippets(snippets: ComponentCodeSnippets): Documentation {
  return [
    {
      blockType: "section",
      showLLM: true,
      heading: "Установка",
    },
    {
      blockType: "codeExample",
      showLLM: true,
      title: "Импорт",
      code: snippets.importSnippet,
    },
    {
      blockType: "codeExample",
      showLLM: true,
      title: "Базовый пример",
      code: snippets.basicSnippet,
    },
    {
      blockType: "section",
      showLLM: true,
      heading: "Примеры кода",
    },
    ...snippets.variantSnippets.map((variant) => ({
      blockType: "codeExample" as const,
      showLLM: true,
      title: variant.label,
      code: variant.code,
    })),
  ];
}

/** Блоки documentation для seed: переносит сниппеты в CMS. */
export function codeSnippetDocumentationBlocks(slug: string): Documentation {
  const snippets = componentCodeSnippetsBySlug[slug];
  if (!snippets) return [];
  return blocksFromSnippets(snippets);
}
