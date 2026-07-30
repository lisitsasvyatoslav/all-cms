import type { CollectionConfig } from "payload";

import { accessHasRole, accessIsAdmin } from "@/lib/payload/access";

export const IconsCollection: CollectionConfig = {
  slug: "icons",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt"],
    description: "Иконки: метаданные и ссылки; превью — через Media.",
  },
  access: {
    read: () => true,
    create: accessHasRole(["admin", "designer"]),
    update: accessHasRole(["admin", "designer"]),
    delete: accessIsAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Название",
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
    },
    {
      name: "preview",
      type: "upload",
      relationTo: "media",
      label: "Превью (PNG/SVG в Media)",
    },
    {
      name: "figmaUrl",
      type: "text",
      label: "Ссылка на Figma",
    },
    {
      name: "storybookUrl",
      type: "text",
      label: "Ссылка на Storybook",
    },
    {
      name: "notes",
      type: "textarea",
      label: "Заметки",
    },
  ],
};
