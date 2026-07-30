import type { CollectionConfig } from "payload";

import {
  accessIsAdmin,
  accessIsAdminOrSelf,
  accessIsLoggedIn,
} from "@/lib/payload/access";

export const UsersCollection: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    // Any authenticated role can access /admin.
    admin: accessIsLoggedIn,
    create: accessIsAdmin,
    read: accessIsAdminOrSelf,
    update: accessIsAdminOrSelf,
    delete: accessIsAdmin,
  },
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
      label: "Имя",
    },
    {
      name: "lastName",
      type: "text",
      required: true,
      label: "Фамилия",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "viewer",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Viewer", value: "viewer" },
        { label: "Designer", value: "designer" },
        { label: "Developer", value: "developer" },
        { label: "PM", value: "pm" },
      ],
      admin: {
        description: "Права пользователя в CMS.",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Bootstrap: the first user created without authenticated req becomes admin.
        if (operation === "create" && !req.user) {
          return {
            ...data,
            role: "admin",
          };
        }
        return data;
      },
    ],
  },
};
