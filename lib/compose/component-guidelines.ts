import { createHash } from "node:crypto";
import type { Payload } from "payload";

import { getRegistryComponent } from "./registry";
import type { CompositionDocument, CompositionNode } from "./types";

const EXPORT_TO_PORTAL_SLUG: Record<string, string> = {
  Button: "button",
  Dialog: "modal",
  Flex: "flex",
  Heading: "heading",
  IconButton: "icon-button",
  Text: "text",
  TextField: "input",
};

export type ComponentDoDontGuideline = {
  componentIds: string[];
  slug: string;
  heading: string;
  intro: string;
  dos: string[];
  donts: string[];
};

export type CompositionComponentGuidance = {
  revision: string;
  usedComponentIds: string[];
  requestedSlugs: string[];
  loadedSlugs: string[];
  slugsWithoutDoDont: string[];
  guidelines: ComponentDoDontGuideline[];
};

function collectComponentIds(node: CompositionNode, ids: Set<string>): void {
  ids.add(node.component);
  node.children?.forEach((child) => collectComponentIds(child, ids));
}

export async function loadCompositionComponentGuidance(
  payload: Payload,
  composition: CompositionDocument,
): Promise<CompositionComponentGuidance> {
  const ids = new Set<string>();
  collectComponentIds(composition.root, ids);
  const usedComponentIds = [...ids].sort();

  const idsBySlug = new Map<string, string[]>();
  for (const id of usedComponentIds) {
    const entry = getRegistryComponent(id);
    const slug = entry ? EXPORT_TO_PORTAL_SLUG[entry.exportName] : undefined;
    if (!slug) continue;
    idsBySlug.set(slug, [...(idsBySlug.get(slug) ?? []), id]);
  }

  const slugs = [...idsBySlug.keys()].sort();
  if (!slugs.length) {
    return {
      revision: "empty",
      usedComponentIds,
      requestedSlugs: [],
      loadedSlugs: [],
      slugsWithoutDoDont: [],
      guidelines: [],
    };
  }

  const result = await payload.find({
    collection: "components",
    where: { slug: { in: slugs } },
    limit: slugs.length,
    depth: 0,
    overrideAccess: true,
  });

  const guidelines: ComponentDoDontGuideline[] = [];
  const loadedSlugs = result.docs.map((doc) => doc.slug).sort();
  const slugsWithDoDont = new Set<string>();
  for (const doc of result.docs) {
    for (const block of doc.documentation ?? []) {
      if (block.blockType !== "doDont" || block.showLLM === false) continue;
      slugsWithDoDont.add(doc.slug);
      guidelines.push({
        componentIds: idsBySlug.get(doc.slug) ?? [],
        slug: doc.slug,
        heading: block.heading?.trim() || "Do / Don't",
        intro: block.intro?.trim() || "",
        dos: block.dos?.map((item) => item.text.trim()).filter(Boolean) ?? [],
        donts: block.donts?.map((item) => item.text.trim()).filter(Boolean) ?? [],
      });
    }
  }
  guidelines.sort((a, b) => a.slug.localeCompare(b.slug));
  const slugsWithoutDoDont = loadedSlugs.filter((slug) => !slugsWithDoDont.has(slug));

  const revision = createHash("sha256")
    .update(JSON.stringify({ usedComponentIds, slugs, loadedSlugs, slugsWithoutDoDont, guidelines }))
    .digest("hex")
    .slice(0, 16);

  return {
    revision,
    usedComponentIds,
    requestedSlugs: slugs,
    loadedSlugs,
    slugsWithoutDoDont,
    guidelines,
  };
}
