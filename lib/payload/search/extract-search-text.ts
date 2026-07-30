type LooseBlock = Record<string, unknown>;

function pushText(parts: string[], value: unknown): void {
  if (typeof value !== "string") return;
  const trimmed = value.trim();
  if (trimmed) parts.push(trimmed);
}

function extractDocumentationBlocks(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";

  const parts: string[] = [];

  for (const raw of blocks) {
    if (!raw || typeof raw !== "object") continue;
    const block = raw as LooseBlock;
    const blockType = String(block.blockType ?? "");

    switch (blockType) {
      case "section":
        pushText(parts, block.heading);
        pushText(parts, block.body);
        if (Array.isArray(block.items)) {
          for (const item of block.items) {
            if (!item || typeof item !== "object") continue;
            pushText(parts, (item as LooseBlock).label);
            pushText(parts, (item as LooseBlock).description);
          }
        }
        break;
      case "codeExample":
        pushText(parts, block.title);
        pushText(parts, block.code);
        break;
      case "propsTable":
        pushText(parts, block.title);
        pushText(parts, block.subtitle);
        if (Array.isArray(block.rows)) {
          for (const row of block.rows) {
            if (!row || typeof row !== "object") continue;
            const r = row as LooseBlock;
            pushText(parts, r.name);
            pushText(parts, r.type);
            pushText(parts, r.description);
          }
        }
        break;
      case "doDont":
        pushText(parts, block.heading);
        pushText(parts, block.intro);
        for (const key of ["dos", "donts"] as const) {
          if (!Array.isArray(block[key])) continue;
          for (const row of block[key]) {
            if (row && typeof row === "object") pushText(parts, (row as LooseBlock).text);
          }
        }
        break;
      case "accessibility":
        pushText(parts, block.intro);
        if (Array.isArray(block.keyboardRows)) {
          for (const row of block.keyboardRows) {
            if (!row || typeof row !== "object") continue;
            pushText(parts, (row as LooseBlock).keys);
            pushText(parts, (row as LooseBlock).description);
          }
        }
        break;
      case "designTokens":
        pushText(parts, block.title);
        if (Array.isArray(block.groups)) {
          for (const group of block.groups) {
            if (!group || typeof group !== "object") continue;
            pushText(parts, (group as LooseBlock).groupTitle);
          }
        }
        break;
      case "changelog":
        if (Array.isArray(block.entries)) {
          for (const entry of block.entries) {
            if (!entry || typeof entry !== "object") continue;
            pushText(parts, (entry as LooseBlock).version);
          }
        }
        break;
      case "checklist":
        pushText(parts, block.title);
        if (Array.isArray(block.items)) {
          for (const item of block.items) {
            if (!item || typeof item !== "object") continue;
            pushText(parts, (item as LooseBlock).title);
            pushText(parts, (item as LooseBlock).description);
          }
        }
        break;
      case "resourceLinks":
        if (Array.isArray(block.links)) {
          for (const link of block.links) {
            if (!link || typeof link !== "object") continue;
            pushText(parts, (link as LooseBlock).label);
          }
        }
        break;
      case "motion":
        pushText(parts, block.title);
        pushText(parts, block.intro);
        break;
      case "storybookEmbed":
        pushText(parts, block.title);
        break;
      default:
        break;
    }
  }

  return parts.join("\n");
}

function extractBrandContentBlocks(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  const parts: string[] = [];

  for (const raw of blocks) {
    if (!raw || typeof raw !== "object") continue;
    const block = raw as LooseBlock;
    switch (block.blockType) {
      case "subheading":
      case "paragraph":
        pushText(parts, block.text);
        break;
      case "list":
        if (Array.isArray(block.items)) {
          for (const item of block.items) {
            if (item && typeof item === "object") pushText(parts, (item as LooseBlock).text);
          }
        }
        break;
      case "figure":
        pushText(parts, block.alt);
        break;
      default:
        break;
    }
  }

  return parts.join("\n");
}

function extractBrandSections(sections: unknown): string {
  if (!Array.isArray(sections)) return "";
  const parts: string[] = [];

  for (const raw of sections) {
    if (!raw || typeof raw !== "object") continue;
    const section = raw as LooseBlock;
    pushText(parts, section.heading);
    pushText(parts, section.sectionId);

    if (section.blockType === "contentBlocks" && section.blocks) {
      parts.push(extractBrandContentBlocks(section.blocks));
    }

    if (section.blockType === "contentAccordion" && Array.isArray(section.items)) {
      for (const item of section.items) {
        if (!item || typeof item !== "object") continue;
        const row = item as LooseBlock;
        pushText(parts, row.title);
        if (row.blocks) parts.push(extractBrandContentBlocks(row.blocks));
      }
    }
  }

  return parts.join("\n");
}

export function joinSearchText(...chunks: Array<string | null | undefined>): string {
  return chunks
    .map((chunk) => chunk?.trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, 12_000);
}

export function extractPortalSearchExcerpt(
  collectionSlug: string,
  doc: Record<string, unknown>,
): string {
  const base = joinSearchText(
    typeof doc.description === "string" ? doc.description : undefined,
    typeof doc.intro === "string" ? doc.intro : undefined,
    typeof doc.avoid === "string" ? doc.avoid : undefined,
    typeof doc.tokenKey === "string" ? doc.tokenKey : undefined,
    typeof doc.caption === "string" ? doc.caption : undefined,
  );

  if (collectionSlug === "brand-pages") {
    return joinSearchText(base, extractBrandSections(doc.sections));
  }

  if (Array.isArray(doc.documentation)) {
    return joinSearchText(base, extractDocumentationBlocks(doc.documentation));
  }

  return base;
}
