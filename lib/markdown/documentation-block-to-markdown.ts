import type { Component, Media } from "@/payload-types";

import { componentWebPagePath } from "@/lib/portal/components/routes";

import {
  mdBulletList,
  mdFence,
  mdGfmTable,
  mdHeading,
  mdJoin,
  mdLink,
  mdParagraph,
} from "./md-utils";

export type DocumentationBlock = NonNullable<Component["documentation"]>[number];

function mediaAbsoluteUrl(
  image: number | Media | null | undefined,
  baseUrl: string,
): string | null {
  if (!image || typeof image !== "object" || !image.url) return null;
  const url = image.url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = baseUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

function blockToMarkdown(block: DocumentationBlock, baseUrl: string): string | null {
  switch (block.blockType) {
    case "section":
      return mdJoin([
        mdHeading(2, block.heading),
        block.body ? mdParagraph(block.body) : null,
        block.items?.length
          ? mdBulletList(
              block.items
                .filter((i) => i?.label)
                .map((i) =>
                  i.description ? `**${i.label}** — ${i.description}` : i.label!,
                ),
            )
          : null,
      ]);

    case "doDont": {
      const dos = block.dos?.map((r) => r.text).filter(Boolean) ?? [];
      const donts = block.donts?.map((r) => r.text).filter(Boolean) ?? [];
      if (!dos.length && !donts.length && !block.heading && !block.intro) return null;
      return mdJoin([
        block.heading ? mdHeading(2, block.heading) : mdHeading(2, "Do / Don't"),
        block.intro ? mdParagraph(block.intro) : null,
        dos.length ? mdJoin([mdHeading(3, "Do"), mdBulletList(dos)]) : null,
        donts.length ? mdJoin([mdHeading(3, "Don't"), mdBulletList(donts)]) : null,
      ]);
    }

    case "codeExample":
      return mdJoin([
        block.title ? mdHeading(2, block.title) : null,
        mdFence(block.code ?? "", "tsx"),
      ]);

    case "propsTable":
      return null;

    case "resourceLinks": {
      const links = block.links?.filter((l) => l?.url && l?.label) ?? [];
      if (!links.length) return null;
      return mdJoin([
        mdHeading(2, "Ссылки"),
        mdBulletList(links.map((l) => mdLink(l.label, l.url))),
      ]);
    }

    case "storybookEmbed":
      return mdJoin([
        mdHeading(2, block.title ?? "Превью"),
        mdParagraph(mdLink("Storybook", block.storybookUrl)),
      ]);

    case "accessibility": {
      const keyboardRows = block.keyboardRows?.filter((r) => r?.keys) ?? [];
      return mdJoin([
        mdHeading(2, "Accessibility"),
        block.intro ? mdParagraph(block.intro) : null,
        block.patternLinkUrl && block.patternLinkLabel
          ? mdParagraph(mdLink(block.patternLinkLabel, block.patternLinkUrl))
          : null,
        keyboardRows.length
          ? mdJoin([
              mdHeading(3, "Keyboard Interactions"),
              mdGfmTable(
                ["Key", "Description"],
                keyboardRows.map((r) => [r.keys, r.description ?? ""]),
              ),
            ])
          : null,
      ]);
    }

    case "relComponents": {
      const comps =
        block.components?.filter((c) => typeof c === "object" && c?.slug) ?? [];
      if (!comps.length) return null;
      return mdJoin([
        mdHeading(2, block.title?.trim() || "Related Components"),
        mdBulletList(
          comps.map((c) => {
            const comp = c as { name?: string; slug?: string };
            return mdLink(comp.name ?? comp.slug!, componentWebPagePath(comp.slug!));
          }),
        ),
      ]);
    }

    case "designTokens": {
      const groups = block.groups?.filter((g) => g?.groupTitle) ?? [];
      if (!groups.length) return null;
      return mdJoin([
        mdHeading(2, block.title?.trim() || "Design Tokens"),
        ...groups.flatMap((g) => {
          const rows = g.rows?.filter((r) => r?.name) ?? [];
          return [
            mdHeading(3, g.groupTitle!),
            rows.length
              ? mdGfmTable(
                  ["Token", "Description", "Type", "Default"],
                  rows.map((r) => [
                    r.name!,
                    r.description ?? "—",
                    r.valueType ?? "string",
                    r.defaultValue ?? "—",
                  ]),
                )
              : null,
          ];
        }),
      ]);
    }

    case "changelog": {
      const entries = block.entries?.filter((e) => e?.version) ?? [];
      if (!entries.length) return null;
      return mdJoin([
        mdHeading(2, "Changelog"),
        ...entries.flatMap((e) => {
          const changes = e.changes?.map((c) => c?.text).filter(Boolean) ?? [];
          return [
            mdHeading(3, e.version!),
            changes.length ? mdBulletList(changes as string[]) : null,
          ];
        }),
      ]);
    }

    case "anatomy": {
      const src = mediaAbsoluteUrl(block.image, baseUrl);
      const parts = block.parts?.map((p) => p.label).filter(Boolean) ?? [];
      if (!src) return null;
      return mdJoin([
        mdHeading(2, block.title?.trim() || "Anatomy"),
        `![${block.title ?? "Anatomy"}](${src})`,
        parts.length ? mdBulletList(parts as string[]) : null,
      ]);
    }

    case "checklist": {
      const items = block.items?.filter((i) => i?.title) ?? [];
      if (!items.length) return null;
      return mdJoin([
        mdHeading(2, block.title?.trim() || "Design checklist"),
        mdBulletList(
          items.map((i) =>
            `${i.done ? "[x]" : "[ ]"} **${i.title}**${i.description ? ` — ${i.description}` : ""}`,
          ),
        ),
      ]);
    }

    case "motion": {
      const tokens = block.tokens?.filter((t) => t?.name) ?? [];
      if (!tokens.length && !block.intro) return null;
      return mdJoin([
        mdHeading(2, block.title?.trim() || "Motion"),
        block.intro ? mdParagraph(block.intro) : null,
        tokens.length
          ? mdGfmTable(
              ["Name", "Description", "Value", "Duration"],
              tokens.map((t) => [
                t.name!,
                t.description ?? "—",
                t.value ?? "—",
                t.durationMs != null ? `${t.durationMs}ms` : "—",
              ]),
            )
          : null,
      ]);
    }

    default: {
      const legacy = (block as { blockType?: string }).blockType;
      return legacy ? `> [Устаревший или неизвестный блок: ${legacy}]` : null;
    }
  }
}

export function documentationToMarkdown(
  blocks: Component["documentation"] | null | undefined,
  baseUrl: string,
): string {
  const parts =
    blocks
      ?.map((block) => blockToMarkdown(block, baseUrl))
      .filter((part): part is string => Boolean(part?.trim())) ?? [];
  return parts.join("\n\n");
}
