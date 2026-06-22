import type { BrandSection } from "@/lib/portal/brand/content";

import {
  mdBulletList,
  mdHeading,
  mdJoin,
  mdLink,
  mdParagraph,
} from "./md-utils";
import type { BrandContentBlock } from "@/lib/portal/brand/content";

function brandContentBlocksToMarkdown(blocks: BrandContentBlock[]): string {
  return mdJoin(
    blocks.map((block) => {
      switch (block.type) {
        case "subheading":
          return mdHeading(3, block.text);
        case "paragraph":
          return mdParagraph(block.text);
        case "list":
          return block.items.length ? mdBulletList(block.items) : null;
        case "figure":
          return mdParagraph(`![${block.alt}](${block.src})`);
        default:
          return null;
      }
    }),
  );
}

function brandSectionToMarkdown(section: BrandSection): string | null {
  switch (section.type) {
    case "prose":
      return mdJoin([
        section.heading ? mdHeading(2, section.heading) : null,
        mdParagraph(section.body),
      ]);

    case "subsection":
      return mdJoin([
        mdHeading(2, section.heading),
        section.body ? mdParagraph(section.body) : null,
        section.whenApplies ? mdParagraph(`*Когда применять:* ${section.whenApplies}`) : null,
        section.items?.length ? mdBulletList(section.items) : null,
        ...(section.guidanceGroups?.map((group) =>
          mdJoin([
            mdHeading(3, group.title),
            group.items.length ? mdBulletList(group.items) : null,
          ]),
        ) ?? []),
        section.considerations?.length
          ? mdBulletList(
              section.considerations.map((item) => `**${item.label}:** ${item.value}`),
            )
          : null,
      ]);

    case "yes-no-grid":
      return mdJoin([
        section.heading ? mdHeading(2, section.heading) : mdHeading(2, "Do / Don't"),
        section.intro ? mdParagraph(section.intro) : null,
        mdBulletList(
          section.items.map((item) =>
            item.variant === "yes"
              ? `✓ ${item.text}`
              : `✗ ${item.text}`,
          ),
        ),
      ]);

    case "logo-lockup":
      return mdJoin([
        mdHeading(2, "Логотип"),
        mdParagraph(section.intro),
        section.downloads.length
          ? mdBulletList(section.downloads.map((item) => mdLink(item.label, item.href)))
          : null,
      ]);

    case "logo-color-guide":
      return mdJoin([
        mdHeading(2, section.heading),
        section.intro ? mdParagraph(section.intro) : null,
        mdBulletList(
          section.rules.map((rule) => `${rule.backgroundLabel}: ${rule.logoLabel}`),
        ),
      ]);

    case "logo-background-grid":
      return mdJoin([
        mdHeading(2, section.heading),
        mdBulletList(section.rules.map((rule) => rule.label)),
      ]);

    case "logo-clearspace":
      return mdJoin([
        mdHeading(2, section.heading),
        section.items.length ? mdBulletList(section.items) : null,
      ]);

    case "logo-misuse-grid":
      return mdJoin([
        mdHeading(2, section.heading),
        section.intro ? mdParagraph(section.intro) : null,
        mdBulletList(section.items.map((item) => item.text)),
      ]);

    case "exclusion-zone":
      return mdJoin([
        mdHeading(2, section.heading),
        section.intro ? mdParagraph(section.intro) : null,
      ]);

    case "minimum-size":
      return mdJoin([
        mdHeading(2, section.heading),
        section.intro ? mdParagraph(section.intro) : null,
        section.items.length
          ? mdBulletList(
              section.items.map(
                (item) =>
                  `**${item.label}:** ${item.digital}${item.print ? ` / ${item.print}` : ""}`,
              ),
            )
          : null,
      ]);

    case "font-recommendation":
      return mdJoin([
        mdHeading(2, section.heading),
        section.subheading ? mdParagraph(section.subheading) : null,
        section.intro ? mdParagraph(section.intro) : null,
        section.fonts.length ? mdBulletList(section.fonts) : null,
      ]);

    case "accent-color":
      return mdJoin([
        section.heading ? mdHeading(2, section.heading) : mdHeading(2, "Фирменный цвет"),
        mdParagraph(section.intro),
        mdParagraph(`**${section.name}** — \`${section.hex}\``),
      ]);

    case "principles":
      return mdJoin([
        mdHeading(2, section.heading),
        section.intro ? mdParagraph(section.intro) : null,
        ...section.principles.map((item) =>
          mdJoin([mdHeading(3, item.title), mdParagraph(item.body)]),
        ),
      ]);

    case "guidance":
      return mdJoin([
        mdHeading(2, section.heading),
        section.intro ? mdParagraph(section.intro) : null,
        section.items.length ? mdBulletList(section.items) : null,
      ]);

    case "content-blocks":
      return mdJoin([
        section.heading ? mdHeading(2, section.heading) : null,
        brandContentBlocksToMarkdown(section.blocks),
      ]);

    case "content-accordion":
      return mdJoin(
        section.items.map((item) =>
          mdJoin([
            mdHeading(2, item.heading),
            brandContentBlocksToMarkdown(item.blocks),
          ]),
        ),
      );

    case "typography-scale":
    case "font-setup":
    case "color-system":
    case "color-gradients":
    case "color-chart-palette":
      return mdJoin([
        mdHeading(2, section.heading),
        `> [Интерактивный блок: ${section.type}]`,
      ]);

    default:
      return `> [${(section as { type: string }).type}]`;
  }
}

export function brandSectionsToMarkdown(sections: BrandSection[]): string {
  return mdJoin(sections.map((section) => brandSectionToMarkdown(section)));
}
