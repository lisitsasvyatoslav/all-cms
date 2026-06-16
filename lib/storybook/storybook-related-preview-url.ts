import { storybookStoryUrl } from "@/lib/storybook/portal-preview-config";
import { storybookUrlToIframeSrc } from "@/lib/storybook/storybook-embed-url";

export const RELATED_PREVIEW_STORY_ID = "RelatedPreview";

/** URL стори RelatedPreview для карточки Related Components. */
export function storybookRelatedPreviewStoryUrl(
  baseUrl: string,
  componentSlug: string,
): string {
  return storybookStoryUrl(baseUrl, componentSlug, RELATED_PREVIEW_STORY_ID);
}

/** iframe.html для превью в карточке Related Components. */
export function storybookRelatedPreviewIframeSrc(storybookUrl: string): string | null {
  return storybookUrlToIframeSrc(storybookUrl);
}
