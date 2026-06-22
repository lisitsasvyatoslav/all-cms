import type { TypographyScaleGroup } from "@/components/portal/brand/brand-typography-scale";
import type { BrandYesNoDemoKey } from "@/components/portal/brand/brand-spotify-blocks";
import type { BrandPageSlug } from "@/lib/portal/brand/nav";

export type BrandYesNoItem = {
  variant: "yes" | "no";
  text: string;
  demo?: BrandYesNoDemoKey;
};

export type BrandSection =
  | {
      type: "prose";
      id: string;
      heading?: string;
      body: string;
    }
  | {
      type: "logo-lockup";
      id: string;
      intro: string;
      fullLogoSrc: string;
      iconSrc: string;
      downloads: { label: string; href: string }[];
    }
  | {
      type: "subsection";
      id: string;
      heading: string;
      body?: string;
      whenApplies?: string;
      items?: string[];
      guidanceGroups?: { title: string; items: string[] }[];
      considerations?: { label: string; value: string }[];
    }
  | {
      type: "yes-no-grid";
      id: string;
      heading?: string;
      intro?: string;
      items: BrandYesNoItem[];
      columns?: 2 | 3 | 4;
    }
  | {
      type: "logo-color-guide";
      id: string;
      heading: string;
      intro?: string;
      rules: {
        backgroundLabel: string;
        surface: "light" | "dark" | "color";
        logoSrc: string;
        logoLabel: string;
      }[];
    }
  | {
      type: "logo-background-grid";
      id: string;
      heading: string;
      rules: { label: string; surface: "light" | "dark"; logoSrc: string }[];
    }
  | {
      type: "logo-clearspace";
      id: string;
      heading: string;
      items: string[];
    }
  | {
      type: "logo-misuse-grid";
      id: string;
      heading: string;
      intro?: string;
      items: { imageSrc: string; text: string }[];
    }
  | {
      type: "exclusion-zone";
      id: string;
      heading: string;
      intro?: string;
    }
  | {
      type: "minimum-size";
      id: string;
      heading: string;
      intro?: string;
      items: { label: string; digital: string; print?: string }[];
    }
  | {
      type: "font-recommendation";
      id: string;
      heading: string;
      subheading?: string;
      intro?: string;
      fonts: string[];
    }
  | {
      type: "accent-color";
      id: string;
      heading?: string;
      intro: string;
      hex: string;
      name: string;
    }
  | {
      type: "principles";
      id: string;
      heading: string;
      intro?: string;
      principles: { title: string; body: string }[];
    }
  | {
      type: "guidance";
      id: string;
      heading: string;
      intro?: string;
      items: string[];
    }
  | {
      type: "content-blocks";
      id: string;
      heading?: string;
      blocks: BrandContentBlock[];
    }
  | {
      type: "content-accordion";
      id: string;
      items: { id: string; heading: string; blocks: BrandContentBlock[] }[];
    }
  | {
      type: "typography-scale";
      id: string;
      heading: string;
      groups: TypographyScaleGroup[];
    }
  | {
      type: "font-setup";
      id: string;
      heading: string;
      desktopLabel: string;
      downloadHref: string;
      downloadLabel: string;
      cssLabel: string;
      cssCode: string;
    }
  | {
      type: "color-system";
      id: string;
      heading: string;
    }
  | {
      type: "color-gradients";
      id: string;
      heading: string;
    }
  | {
      type: "color-chart-palette";
      id: string;
      heading: string;
    };

export type BrandContentBlock =
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "figure"; src: string; alt: string };

export type BrandPageContent = {
  slug: BrandPageSlug;
  title: string;
  description: string;
  intro: string;
  sections: BrandSection[];
};

export function getBrandPageToc(sections: BrandSection[]): { id: string; label: string }[] {
  return sections
    .flatMap((section) => {
      switch (section.type) {
        case "logo-lockup":
          return [{ id: section.id, label: "Логотип и иконка" }];
        case "logo-background-grid":
        case "logo-clearspace":
        case "logo-misuse-grid":
        case "logo-color-guide":
          return [{ id: section.id, label: section.heading }];
        case "yes-no-grid":
          return section.heading
            ? [{ id: section.id, label: section.heading }]
            : [];
        case "subsection":
          return [{ id: section.id, label: section.heading }];
        case "font-recommendation":
          return [{ id: section.id, label: section.heading }];
        case "accent-color":
          return [{ id: section.id, label: "Фирменный цвет" }];
        case "content-blocks":
          return section.heading
            ? [{ id: section.id, label: section.heading }]
            : [];
        case "content-accordion":
          return section.items.map((item) => ({
            id: item.id,
            label: item.heading,
          }));
        case "typography-scale":
        case "font-setup":
        case "color-system":
        case "color-gradients":
        case "color-chart-palette":
          return [{ id: section.id, label: section.heading }];
        default:
          if ("heading" in section && section.heading?.trim()) {
            return [{ id: section.id, label: section.heading.trim() }];
          }
          return [];
      }
    })
    .filter((item): item is { id: string; label: string } => item != null);
}
