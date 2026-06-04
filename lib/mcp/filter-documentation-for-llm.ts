type DocBlock = Record<string, unknown>;

/** Блок отдаётся LLM, если showLLM не false (undefined = включено для старых записей). */
export function isDocumentationBlockVisibleToLlm(block: DocBlock): boolean {
  return block.showLLM !== false;
}

export function filterDocBlockForLlm(block: DocBlock): DocBlock | null {
  if (!isDocumentationBlockVisibleToLlm(block)) {
    return null;
  }

  if (block.blockType === "nestedStack" && Array.isArray(block.items)) {
    const items = block.items
      .map((item) =>
        item && typeof item === "object"
          ? filterDocBlockForLlm(item as DocBlock)
          : null,
      )
      .filter((item): item is DocBlock => item != null);

    return { ...block, items };
  }

  return block;
}

export function filterDocumentationForLlm<T extends { documentation?: unknown }>(
  doc: T,
): T {
  const documentation = doc.documentation;
  if (!Array.isArray(documentation) || documentation.length === 0) {
    return doc;
  }

  const filtered = documentation
    .map((block) =>
      block && typeof block === "object"
        ? filterDocBlockForLlm(block as DocBlock)
        : null,
    )
    .filter((block): block is DocBlock => block != null);

  return { ...doc, documentation: filtered };
}
