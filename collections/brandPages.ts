import type { CollectionConfig } from "payload";

import { brandColorPaletteTab } from "@/collections/brandColorFields";
import { brandSectionBlocks } from "@/collections/brandSectionBlocks";
import { accessHasRole } from "@/lib/payload/access";
import { BRAND_PAGE_SLUGS } from "@/lib/portal/brand/nav";

/** Страницы раздела /brand — контент из Payload Admin. */
export const BrandPagesCollection: CollectionConfig = {
  slug: "brand-pages",
  labels: {
    singular: "Страница Brand",
    plural: "Brand · Страницы",
  },
  admin: {
    useAsTitle: "title",
    group: "Brand",
    defaultColumns: ["slug", "title", "sortOrder", "updatedAt"],
    description: "Контент страниц /brand/*: логотипы, иконки, типографика, палитра.",
  },
  access: {
    read: () => true,
    create: accessHasRole(["admin", "pm", "designer"]),
    update: accessHasRole(["admin", "pm", "designer"]),
    delete: accessHasRole(["admin"]),
  },
  fields: [
    {
      name: "slug",
      type: "select",
      required: true,
      unique: true,
      label: "Slug",
      options: BRAND_PAGE_SLUGS.map((slug) => ({ label: slug, value: slug })),
      admin: { position: "sidebar" },
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Порядок в навигации",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Страница",
          fields: [
            { name: "title", type: "text", required: true, label: "Заголовок" },
            { name: "description", type: "textarea", required: true, label: "Описание (карточка и meta)" },
            { name: "intro", type: "textarea", required: true, label: "Вводный текст" },
            {
              name: "sections",
              type: "blocks",
              label: "Секции",
              blocks: brandSectionBlocks,
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "shareTitle",
              type: "text",
              label: "og:title",
              admin: { description: "Если пусто — используется заголовок страницы." },
            },
            {
              name: "shareDescription",
              type: "textarea",
              label: "og:description",
              admin: { description: "Если пусто — используется описание страницы." },
            },
          ],
        },
        brandColorPaletteTab,
      ],
    },
  ],
};
