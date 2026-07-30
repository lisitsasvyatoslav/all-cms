import type { CollectionConfig } from "payload";

import { accessHasRole, accessIsAdmin } from "@/lib/payload/access";

export const NotesCollection: CollectionConfig = {
  slug: "notes",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
  },
  access: {
    read: () => true,
    create: accessHasRole(["admin", "pm", "developer"]),
    update: accessHasRole(["admin", "pm", "developer"]),
    delete: accessIsAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
    },
  ],
};
