export type SourceLinkIconKind =
  | "figma"
  | "storybook"
  | "github"
  | "react-aria"
  | "radix"
  | "tailwind"
  | "markdown"
  | "docs"
  | "link";

const LABEL_ICON_MAP: Record<string, SourceLinkIconKind> = {
  figma: "figma",
  storybook: "storybook",
  github: "github",
  source: "github",
  "styles source": "github",
  "style source": "github",
  styles: "github",
  "react aria": "react-aria",
  rac: "react-aria",
  radix: "radix",
  "radix ui": "radix",
  tailwind: "tailwind",
  "tailwind css": "tailwind",
  markdown: "markdown",
  documentation: "docs",
  docs: "docs",
  документация: "docs",
  репозиторий: "github",
  repository: "github",
  repo: "github",
};

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, " ");
}

function iconFromUrl(url: string): SourceLinkIconKind | undefined {
  const lower = url.toLowerCase();
  if (lower.includes("figma.com")) return "figma";
  if (lower.includes("storybook")) return "storybook";
  if (lower.includes("github.com") || lower.includes("raw.githubusercontent.com")) return "github";
  if (lower.includes("react-aria.adobe.com")) return "react-aria";
  if (lower.includes("radix-ui.com")) return "radix";
  if (lower.includes("tailwindcss.com")) return "tailwind";
  if (lower.endsWith(".md") || lower.includes("/markdown")) return "markdown";
  return undefined;
}

export function resolveSourceLinkIcon(label: string, href: string): SourceLinkIconKind {
  const normalized = normalizeLabel(label);
  const fromLabel = LABEL_ICON_MAP[normalized];
  if (fromLabel) return fromLabel;

  const partial = Object.entries(LABEL_ICON_MAP).find(([key]) => normalized.includes(key));
  if (partial) return partial[1];

  const fromUrl = iconFromUrl(href);
  if (fromUrl) return fromUrl;

  return "link";
}
