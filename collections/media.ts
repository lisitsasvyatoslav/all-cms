import type { CollectionConfig } from "payload";

import { accessHasRole, accessIsAdmin } from "@/lib/payload/access";

export const MediaCollection: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: accessHasRole(["admin", "designer", "developer"]),
    update: accessHasRole(["admin", "designer", "developer"]),
    delete: accessIsAdmin,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: true,
};
