import type { BrandContentBlock, BrandSection } from "@/lib/portal/brand/content";

type PayloadContentBlock =
  | { blockType: "subheading"; text: string }
  | { blockType: "paragraph"; text: string }
  | { blockType: "list"; items?: { text: string }[] | null }
  | { blockType: "figure"; src: string; alt: string };

type PayloadSectionBlock =
  | {
      blockType: "contentBlocks";
      sectionId: string;
      heading?: string | null;
      blocks?: PayloadContentBlock[] | null;
    }
  | {
      blockType: "contentAccordion";
      sectionId?: string | null;
      items?: {
        anchorId: string;
        heading: string;
        blocks?: PayloadContentBlock[] | null;
      }[] | null;
    }
  | {
      blockType: "typographyScale";
      sectionId: string;
      heading: string;
      groups?: {
        groupId: string;
        title: string;
        rows?: {
          name: string;
          fontSize: number;
          lineHeight: number;
          letterSpacing: number;
          weight: number;
        }[] | null;
      }[] | null;
    }
  | {
      blockType: "fontSetup";
      sectionId: string;
      heading: string;
      desktopLabel: string;
      downloadHref: string;
      downloadLabel: string;
      cssLabel: string;
      cssCode: string;
    }
  | {
      blockType: "colorSystem";
      sectionId: string;
      heading: string;
    }
  | {
      blockType: "colorGradients";
      sectionId: string;
      heading: string;
    }
  | {
      blockType: "colorChartPalette";
      sectionId: string;
      heading: string;
    }
  | {
      blockType: "logoBackgroundGrid";
      sectionId: string;
      heading: string;
      rules?: { label: string; surface: "light" | "dark"; logoSrc: string }[] | null;
    }
  | {
      blockType: "logoClearspace";
      sectionId: string;
      heading: string;
      items?: { text: string }[] | null;
    }
  | {
      blockType: "logoMisuseGrid";
      sectionId: string;
      heading: string;
      intro?: string | null;
      items?: { imageSrc: string; text: string }[] | null;
    };

function normalizeContentBlocks(
  blocks: PayloadContentBlock[] | null | undefined,
): BrandContentBlock[] {
  if (!blocks?.length) return [];

  const result: BrandContentBlock[] = [];

  for (const block of blocks) {
    switch (block.blockType) {
      case "subheading":
        if (block.text?.trim()) {
          result.push({ type: "subheading", text: block.text.trim() });
        }
        break;
      case "paragraph":
        if (block.text?.trim()) {
          result.push({ type: "paragraph", text: block.text.trim() });
        }
        break;
      case "list":
        result.push({
          type: "list",
          items:
            block.items
              ?.map((item) => item.text?.trim())
              .filter((text): text is string => Boolean(text)) ?? [],
        });
        break;
      case "figure":
        if (block.src?.trim() && block.alt?.trim()) {
          result.push({
            type: "figure",
            src: block.src.trim(),
            alt: block.alt.trim(),
          });
        }
        break;
    }
  }

  return result;
}

export function normalizeBrandSections(
  sections: PayloadSectionBlock[] | null | undefined,
): BrandSection[] {
  if (!sections?.length) return [];

  return sections.flatMap((section): BrandSection[] => {
    switch (section.blockType) {
      case "contentBlocks":
        return [
          {
            type: "content-blocks",
            id: section.sectionId.trim(),
            heading: section.heading?.trim() || undefined,
            blocks: normalizeContentBlocks(section.blocks),
          },
        ];
      case "contentAccordion":
        return [
          {
            type: "content-accordion",
            id: section.sectionId?.trim() || "accordion",
            items:
              section.items?.map((item) => ({
                id: item.anchorId.trim(),
                heading: item.heading.trim(),
                blocks: normalizeContentBlocks(item.blocks),
              })) ?? [],
          },
        ];
      case "typographyScale":
        return [
          {
            type: "typography-scale",
            id: section.sectionId.trim(),
            heading: section.heading.trim(),
            groups:
              section.groups?.map((group) => ({
                id: group.groupId.trim(),
                title: group.title.trim(),
                rows:
                  group.rows?.map((row) => ({
                    name: row.name,
                    fontSize: row.fontSize,
                    lineHeight: row.lineHeight,
                    letterSpacing: row.letterSpacing,
                    weight: row.weight as 400 | 500 | 700,
                  })) ?? [],
              })) ?? [],
          },
        ];
      case "fontSetup":
        return [
          {
            type: "font-setup",
            id: section.sectionId.trim(),
            heading: section.heading.trim(),
            desktopLabel: section.desktopLabel.trim(),
            downloadHref: section.downloadHref.trim(),
            downloadLabel: section.downloadLabel.trim(),
            cssLabel: section.cssLabel.trim(),
            cssCode: section.cssCode,
          },
        ];
      case "colorSystem":
        return [
          {
            type: "color-system",
            id: section.sectionId.trim(),
            heading: section.heading.trim(),
          },
        ];
      case "colorGradients":
        return [
          {
            type: "color-gradients",
            id: section.sectionId.trim(),
            heading: section.heading.trim(),
          },
        ];
      case "colorChartPalette":
        return [
          {
            type: "color-chart-palette",
            id: section.sectionId.trim(),
            heading: section.heading.trim(),
          },
        ];
      case "logoBackgroundGrid":
        return [
          {
            type: "logo-background-grid",
            id: section.sectionId.trim(),
            heading: section.heading.trim(),
            rules:
              section.rules?.map((rule) => ({
                label: rule.label.trim(),
                surface: rule.surface,
                logoSrc: rule.logoSrc.trim(),
              })) ?? [],
          },
        ];
      case "logoClearspace":
        return [
          {
            type: "logo-clearspace",
            id: section.sectionId.trim(),
            heading: section.heading.trim(),
            items:
              section.items
                ?.map((item) => item.text?.trim())
                .filter((text): text is string => Boolean(text)) ?? [],
          },
        ];
      case "logoMisuseGrid":
        return [
          {
            type: "logo-misuse-grid",
            id: section.sectionId.trim(),
            heading: section.heading.trim(),
            intro: section.intro?.trim() || undefined,
            items:
              section.items
                ?.filter((item) => item.imageSrc?.trim() && item.text?.trim())
                .map((item) => ({
                  imageSrc: item.imageSrc.trim(),
                  text: item.text.trim(),
                })) ?? [],
          },
        ];
      default:
        return [];
    }
  });
}

export function brandSectionsToPayload(sections: BrandSection[]): PayloadSectionBlock[] {
  return sections.flatMap((section): PayloadSectionBlock[] => {
    switch (section.type) {
      case "content-blocks":
        return [
          {
            blockType: "contentBlocks",
            sectionId: section.id,
            heading: section.heading ?? null,
            blocks: section.blocks.map((block) => {
              switch (block.type) {
                case "subheading":
                  return { blockType: "subheading" as const, text: block.text };
                case "paragraph":
                  return { blockType: "paragraph" as const, text: block.text };
                case "list":
                  return {
                    blockType: "list" as const,
                    items: block.items.map((text) => ({ text })),
                  };
                case "figure":
                  return {
                    blockType: "figure" as const,
                    src: block.src,
                    alt: block.alt,
                  };
              }
            }),
          },
        ];
      case "content-accordion":
        return [
          {
            blockType: "contentAccordion",
            sectionId: section.id,
            items: section.items.map((item) => ({
              anchorId: item.id,
              heading: item.heading,
              blocks: item.blocks.map((block) => {
                switch (block.type) {
                  case "subheading":
                    return { blockType: "subheading" as const, text: block.text };
                  case "paragraph":
                    return { blockType: "paragraph" as const, text: block.text };
                  case "list":
                    return {
                      blockType: "list" as const,
                      items: block.items.map((text) => ({ text })),
                    };
                  case "figure":
                    return {
                      blockType: "figure" as const,
                      src: block.src,
                      alt: block.alt,
                    };
                }
              }),
            })),
          },
        ];
      case "typography-scale":
        return [
          {
            blockType: "typographyScale",
            sectionId: section.id,
            heading: section.heading,
            groups: section.groups.map((group) => ({
              groupId: group.id,
              title: group.title,
              rows: group.rows.map((row) => ({
                name: row.name,
                fontSize: row.fontSize,
                lineHeight: row.lineHeight,
                letterSpacing: row.letterSpacing,
                weight: row.weight ?? 400,
              })),
            })),
          },
        ];
      case "font-setup":
        return [
          {
            blockType: "fontSetup",
            sectionId: section.id,
            heading: section.heading,
            desktopLabel: section.desktopLabel,
            downloadHref: section.downloadHref,
            downloadLabel: section.downloadLabel,
            cssLabel: section.cssLabel,
            cssCode: section.cssCode,
          },
        ];
      case "color-system":
        return [
          {
            blockType: "colorSystem",
            sectionId: section.id,
            heading: section.heading,
          },
        ];
      case "color-gradients":
        return [
          {
            blockType: "colorGradients",
            sectionId: section.id,
            heading: section.heading,
          },
        ];
      case "color-chart-palette":
        return [
          {
            blockType: "colorChartPalette",
            sectionId: section.id,
            heading: section.heading,
          },
        ];
      case "logo-background-grid":
        return [
          {
            blockType: "logoBackgroundGrid",
            sectionId: section.id,
            heading: section.heading,
            rules: section.rules.map((rule) => ({
              label: rule.label,
              surface: rule.surface,
              logoSrc: rule.logoSrc,
            })),
          },
        ];
      case "logo-clearspace":
        return [
          {
            blockType: "logoClearspace",
            sectionId: section.id,
            heading: section.heading,
            items: section.items.map((text) => ({ text })),
          },
        ];
      case "logo-misuse-grid":
        return [
          {
            blockType: "logoMisuseGrid",
            sectionId: section.id,
            heading: section.heading,
            intro: section.intro ?? null,
            items: section.items.map((item) => ({
              imageSrc: item.imageSrc,
              text: item.text,
            })),
          },
        ];
      default:
        return [];
    }
  });
}
