/** Порядок и подписи превью на портале — привязаны к export-именам stories в *.stories.tsx */
export type PortalPreviewEntry = {
  storyId: string;
  title: string;
};

export function storybookStoryPath(componentSlug: string, storyId: string): string {
  const storySlug = storyId.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return `/story/design-system-${componentSlug}--${storySlug}`;
}

export function storybookStoryUrl(
  baseUrl: string,
  componentSlug: string,
  storyId: string,
  args?: string,
): string {
  const base = baseUrl.replace(/\/$/, "");
  const url = new URL(`${base}/`);
  url.searchParams.set("path", storybookStoryPath(componentSlug, storyId));
  if (args) url.searchParams.set("args", args);
  return url.toString();
}

export function defaultStorybookBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_STORYBOOK_URL?.trim().replace(/\/$/, "") ||
    "http://127.0.0.1:6006"
  );
}
