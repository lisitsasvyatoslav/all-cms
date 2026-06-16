import { RELATED_PREVIEW_HEIGHT, RELATED_PREVIEW_WIDTH } from "@/lib/portal/related-preview-layout";
import { PORTAL_EMBED_QUERY_PARAM } from "@/lib/storybook/portal-embed-mode";
import { portalPreviewCatalogBySlug } from "@/lib/storybook/portal-preview-catalog";
import { storybookStoryId } from "@/lib/storybook/portal-preview-config";
import { RELATED_PREVIEW_STORY_ID } from "@/lib/storybook/storybook-related-preview-url";

export type RelatedPreviewTheme = "light" | "dark";

/** Доля кадра 1200×630, которую занимает компонент (остальное — поля). */
export const RELATED_PREVIEW_FRAME_FILL_RATIO = 0.72;

export const RELATED_PREVIEW_CAPTURE = {
  viewport: { width: RELATED_PREVIEW_WIDTH, height: RELATED_PREVIEW_HEIGHT },
  outputWidth: RELATED_PREVIEW_WIDTH,
  outputHeight: RELATED_PREVIEW_HEIGHT,
  deviceScaleFactor: 1,
  webpQuality: 92,
  settleMs: 600,
  frameFillRatio: RELATED_PREVIEW_FRAME_FILL_RATIO,
  minScale: 0.5,
  maxScale: 8,
  themes: {
    light: "backgrounds.value:!hex(ffffff)",
    dark: "backgrounds.value:!hex(0a0a0a)",
  } satisfies Record<RelatedPreviewTheme, string>,
} as const;

export const RELATED_PREVIEW_OUTPUT_DIR = "public/related-previews";

/** Slug'и DS-компонентов с канонической стори RelatedPreview. */
export function relatedPreviewSlugsFromCatalog(): string[] {
  return Object.entries(portalPreviewCatalogBySlug)
    .filter(([, entries]) => entries.some((entry) => entry.storyId === RELATED_PREVIEW_STORY_ID))
    .map(([slug]) => slug);
}

export function relatedPreviewOutputFilename(slug: string, theme: RelatedPreviewTheme): string {
  return `${slug}-${theme}.webp`;
}

/** URL iframe.html для скриншота RelatedPreview в static Storybook. */
export function relatedPreviewIframeCaptureUrl(
  baseUrl: string,
  componentSlug: string,
  theme: RelatedPreviewTheme,
): string {
  const origin = baseUrl.replace(/\/$/, "");
  const url = new URL("/iframe.html", `${origin}/`);
  url.searchParams.set("viewMode", "story");
  url.searchParams.set("id", storybookStoryId(componentSlug, RELATED_PREVIEW_STORY_ID));
  url.searchParams.set("globals", RELATED_PREVIEW_CAPTURE.themes[theme]);
  url.searchParams.set(PORTAL_EMBED_QUERY_PARAM, "1");
  return url.toString();
}

export type RelatedPreviewScaleOptions = {
  viewportWidth: number;
  viewportHeight: number;
  fillRatio: number;
  minScale: number;
  maxScale: number;
};

/** Подгоняет масштаб стори под кадр: крупные компоненты уменьшаются, мелкие увеличиваются. */
export function relatedPreviewScaleScript(opts: RelatedPreviewScaleOptions): void {
  const stage = document.querySelector(".portal-related-preview-capture__stage") as HTMLElement | null;
  if (!stage) return;

  stage.style.transform = "none";

  const content = stage.firstElementChild as HTMLElement | null;
  if (!content) return;

  const rect = content.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return;

  const targetW = opts.viewportWidth * opts.fillRatio;
  const targetH = opts.viewportHeight * opts.fillRatio;
  const scale = Math.min(targetW / rect.width, targetH / rect.height);
  const clamped = Math.min(opts.maxScale, Math.max(opts.minScale, scale));

  stage.style.transform = `scale(${clamped})`;
  stage.style.transformOrigin = "center center";
}
