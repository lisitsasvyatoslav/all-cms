import type { CollectionConfig } from "payload";

import { syncAllComponentsAfterChecklistItemChange } from "@/lib/payload/component-design-checklist-hooks";

export const DesignChecklistItemsCollection: CollectionConfig = {
  slug: "design-checklist-items",
  labels: {
    singular: "Пункт checklist",
    plural: "Design checklist",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "sortOrder", "isActive", "updatedAt"],
    description:
      "Общие требования к компонентам. На карточке каждого компонента отмечайте выполнение.",
  },
  access: {
    read: () => true,
    create: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "pm" || req.user?.role === "designer",
    update: ({ req }) =>
      req.user?.role === "admin" || req.user?.role === "pm" || req.user?.role === "designer",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Название",
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание",
    },
    {
      name: "category",
      type: "select",
      label: "Категория",
      options: [
        { label: "States", value: "states" },
        { label: "Accessibility", value: "accessibility" },
        { label: "Layout", value: "layout" },
        { label: "Content", value: "content" },
      ],
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Порядок",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Активен",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Снято — пункт скрыт на всех страницах компонентов.",
      },
    },
  ],
  hooks: {
    afterChange: [syncAllComponentsAfterChecklistItemChange],
  },
};
