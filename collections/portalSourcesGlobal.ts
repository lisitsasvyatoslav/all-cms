import type { GlobalConfig } from "payload";

import { accessHasRole } from "@/lib/payload/access";
import { revalidatePortalSourcesAfterChange } from "@/lib/payload/portal-cache-hooks";

/** Общие ссылки в шапке/подвале портала (один документ). */
export const PortalSourcesGlobal: GlobalConfig = {
  slug: "portal-sources",
  label: "Ссылки на источники",
  admin: {
    description:
      "Общие URL: библиотека Figma, Storybook, репозиторий, внешняя документация.",
  },
  access: {
    read: () => true,
    update: accessHasRole(["admin", "pm"]),
  },
  hooks: {
    afterChange: [revalidatePortalSourcesAfterChange],
  },
  fields: [
    {
      name: "figmaLibraryUrl",
      type: "text",
      label: "Figma — библиотека",
    },
    {
      name: "storybookUrl",
      type: "text",
      label: "Storybook",
    },
    {
      name: "documentationUrl",
      type: "text",
      label: "Документация (Confluence / Notion / …)",
    },
    {
      name: "repositoryUrl",
      type: "text",
      label: "Репозиторий (Git)",
    },
  ],
};
