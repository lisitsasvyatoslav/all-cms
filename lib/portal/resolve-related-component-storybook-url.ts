import { defaultStorybookBaseUrl } from "@/lib/storybook/portal-preview-config";
import { storybookRelatedPreviewStoryUrl } from "@/lib/storybook/storybook-related-preview-url";
import type { Component } from "@/payload-types";

/** Story URL для превью карточки Related Components — всегда стори RelatedPreview. */
export function resolveRelatedComponentStorybookUrl(
  component: Pick<Component, "slug">,
): string | null {
  if (!component.slug) return null;
  return storybookRelatedPreviewStoryUrl(defaultStorybookBaseUrl(), component.slug);
}
