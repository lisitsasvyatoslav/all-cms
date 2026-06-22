/**
 * Группы компонентов на портале — как в HeroUI
 * https://www.heroui.com/docs/react/components
 */
export const COMPONENT_FOLDER_ORDER = [
  "Buttons",
  "Collections",
  "Controls",
  "Data Display",
  "Feedback",
  "Forms",
  "Layout",
  "Navigation",
  "Overlays",
  "Typography",
] as const;

export type ComponentFolder = (typeof COMPONENT_FOLDER_ORDER)[number];

export const COMPONENT_FOLDER_BY_SLUG: Record<string, ComponentFolder> = {
  button: "Buttons",

  card: "Collections",
  table: "Collections",
  tabs: "Collections",

  checkbox: "Controls",
  radio: "Controls",
  slider: "Controls",
  switch: "Controls",

  avatar: "Data Display",
  badge: "Data Display",
  "legacy-chip": "Data Display",
  progress: "Data Display",

  spinner: "Feedback",

  input: "Forms",
  select: "Forms",

  container: "Layout",
  section: "Layout",
  "scroll-area": "Layout",

  "context-menu": "Navigation",
  "dropdown-menu": "Navigation",

  "alert-dialog": "Overlays",
  modal: "Overlays",

  blockquote: "Typography",
  em: "Typography",
  heading: "Typography",
  link: "Typography",
  strong: "Typography",
  text: "Typography",
};

export function componentFolderForSlug(slug: string): ComponentFolder | undefined {
  return COMPONENT_FOLDER_BY_SLUG[slug];
}

export function folderSectionId(name: string): string {
  return `folder-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}
