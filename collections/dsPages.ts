import type { CollectionConfig } from "payload";

import { documentationBlocksForComponents } from "@/collections/componentDocumentationBlocks";
import { accessHasRole } from "@/lib/payload/access";
import { isPortalDocumentationReadable } from "@/lib/payload/documentation-access";
import {
  revalidatePortalDsPagesAfterChange,
  revalidatePortalDsPagesAfterDelete,
} from "@/lib/payload/portal-cache-hooks";

/** Вложенные страницы портала /ds/* — дерево в админке через payload-nested-docs-page-tree. */
export const DsPagesCollection: CollectionConfig = {
  slug: "ds-pages",
  labels: {
    singular: "Страница DS",
    plural: "DS · Страницы",
  },
  orderable: true,
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: "title",
    group: "DS",
    defaultColumns: ["title", "slug", "updatedAt"],
    description:
      "Вложенные страницы /ds/* (например /ds/introduction). Дерево и drag-and-drop — в списке коллекции.",
  },
  access: {
    read: () => true,
    create: accessHasRole(["admin", "pm", "designer"]),
    update: accessHasRole(["admin", "pm", "designer"]),
    delete: accessHasRole(["admin"]),
  },
  hooks: {
    afterChange: [revalidatePortalDsPagesAfterChange],
    afterDelete: [revalidatePortalDsPagesAfterDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Заголовок",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      label: "Slug (сегмент URL)",
      admin: {
        description:
          "Латиница, без слэшей. Итоговый путь строится из цепочки родителей: /ds/introduction или /ds/guides/basics.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание (лид и meta)",
    },
    {
      name: "documentation",
      type: "blocks",
      label: "Контент страницы",
      blocks: documentationBlocksForComponents,
      access: {
        read: isPortalDocumentationReadable,
      },
      admin: {
        initCollapsed: false,
        description: "Блоки документации — тот же набор, что у components.",
      },
    },
  ],
};
