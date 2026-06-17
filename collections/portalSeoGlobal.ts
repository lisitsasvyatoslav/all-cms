import type { GlobalConfig } from "payload";

import { accessHasRole } from "@/lib/payload/access";

/** SEO / Open Graph портала — title, description, image для шаринга ссылок. */
export const PortalSeoGlobal: GlobalConfig = {
  slug: "portal-seo",
  label: "SEO и шаринг",
  admin: {
    description:
      "Заголовки, описания и OG-картинки для главной, каталога и дефолтов портала. Пустые поля — встроенные значения по умолчанию.",
  },
  access: {
    read: () => true,
    update: accessHasRole(["admin", "pm"]),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Сайт",
          fields: [
            {
              name: "siteName",
              type: "text",
              label: "Название сайта (og:site_name)",
              defaultValue: "Design System",
            },
            {
              name: "titleDefault",
              type: "text",
              label: "Title по умолчанию",
              defaultValue: "Design System · Portal",
              admin: {
                description: "Когда у страницы нет своего title.",
              },
            },
            {
              name: "titleTemplate",
              type: "text",
              label: "Шаблон title",
              defaultValue: "%s · Design System",
              admin: {
                description: "Next.js metadata template, %s — title страницы.",
              },
            },
            {
              name: "defaultDescription",
              type: "textarea",
              label: "Description по умолчанию",
              defaultValue:
                "Портал дизайн-системы: компоненты, документация, Storybook.",
            },
            {
              name: "locale",
              type: "text",
              label: "og:locale",
              defaultValue: "ru_RU",
            },
            {
              name: "defaultOgImage",
              type: "upload",
              relationTo: "media",
              label: "OG-картинка по умолчанию",
              admin: {
                description:
                  "Статический файл public/og/portal-site.webp (npm run generate:portal-site-og). Поле не влияет на OG — картинка всегда portal-site.webp.",
              },
            },
          ],
        },
        {
          label: "Главная /",
          fields: [
            {
              name: "homeShareTitle",
              type: "text",
              label: "og:title",
              defaultValue: "Дизайн-система",
            },
            {
              name: "homeShareDescription",
              type: "textarea",
              label: "og:description",
              defaultValue:
                "Портал дизайн-системы: компоненты, документация, Storybook и ссылки на источники.",
            },
            {
              name: "homeShareImage",
              type: "upload",
              relationTo: "media",
              label: "og:image (опционально)",
              admin: {
                description: "Не используется — OG-картинка всегда public/og/portal-site.webp.",
              },
            },
          ],
        },
        {
          label: "Каталог /components/web",
          fields: [
            {
              name: "catalogWebShareTitle",
              type: "text",
              label: "og:title",
              defaultValue: "Components",
            },
            {
              name: "catalogWebShareDescription",
              type: "textarea",
              label: "og:description",
              defaultValue: "Каталог компонентов дизайн-системы для Web.",
            },
            {
              name: "catalogWebShareImage",
              type: "upload",
              relationTo: "media",
              label: "og:image (опционально)",
              admin: {
                description: "Не используется — OG-картинка всегда public/og/portal-site.webp.",
              },
            },
          ],
        },
        {
          label: "Showcase",
          fields: [
            {
              name: "showcaseShareTitle",
              type: "text",
              label: "og:title",
              defaultValue: "Блоки документации",
            },
            {
              name: "showcaseShareDescription",
              type: "textarea",
              label: "og:description",
              defaultValue:
                "Демо 13 блоков вкладки «Документация» коллекции components — как на реальной странице компонента.",
            },
            {
              name: "showcaseShareImage",
              type: "upload",
              relationTo: "media",
              label: "og:image (опционально)",
              admin: {
                description: "Не используется — OG-картинка всегда public/og/portal-site.webp.",
              },
            },
          ],
        },
      ],
    },
  ],
};
