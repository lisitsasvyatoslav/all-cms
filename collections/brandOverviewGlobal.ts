import type { GlobalConfig } from "payload";

import { accessHasRole } from "@/lib/payload/access";

/** Тексты страницы /brand (обзор). */
export const BrandOverviewGlobal: GlobalConfig = {
  slug: "brand-overview",
  label: "Brand · Обзор",
  admin: {
    group: "Brand",
    description: "Заголовок и вводный текст на странице /brand. Карточки разделов — из коллекции «Brand · Страницы».",
  },
  access: {
    read: () => true,
    update: accessHasRole(["admin", "pm", "designer"]),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Страница",
          fields: [
            { name: "title", type: "text", label: "Заголовок", defaultValue: "Brand" },
            {
              name: "intro",
              type: "textarea",
              label: "Вводный текст",
              defaultValue:
                "Бренд-гайдлайны задают узнаваемый визуальный язык: логотипы, иконки, типографика, палитра и принципы оформления.",
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            { name: "shareTitle", type: "text", label: "og:title", defaultValue: "Brand" },
            {
              name: "shareDescription",
              type: "textarea",
              label: "og:description",
              defaultValue:
                "Бренд-гайдлайны: логотипы, иконки, шрифты, палитра и визуальный стиль.",
            },
          ],
        },
      ],
    },
  ],
};
