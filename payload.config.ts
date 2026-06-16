import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { ru } from "@payloadcms/translations/languages/ru";
import path from "path";
import type { CollectionConfig, GlobalConfig } from "payload";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import {
  documentationBlocksForColors,
  documentationBlocksForComponents,
} from "./collections/componentDocumentationBlocks";
import { DesignChecklistItemsCollection } from "./collections/designChecklistItems";
import {
  syncAllComponentsAfterChecklistItemChange,
  syncComponentDesignChecklistAfterRead,
  syncComponentDesignChecklistBeforeChange,
} from "./lib/payload/component-design-checklist-hooks";
import { isPortalDocumentationReadable } from "./lib/payload/documentation-access";
import { FieldShowcaseCollection } from "./collections/fieldShowcase";
import { componentAgentMcpTools } from "./lib/mcp/components-agent";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

type UserRole = "admin" | "viewer" | "designer" | "developer" | "pm";

const isAdmin = ({ req }: any) =>
  // Backward compatibility: old users may not have `role` yet.
  req.user?.role === "admin" || (!!req.user && !req.user.role);

const hasRole =
  (roles: UserRole[]) =>
  ({ req }: any) =>
    roles.includes(req.user?.role);

const isLoggedIn = ({ req }: any) => !!req.user;

const isAdminOrSelf = ({ req }: any) => {
  if (isAdmin({ req })) return true;
  if (!req.user?.id) return false;
  return { id: { equals: req.user.id } };
};

const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    // Any authenticated role can access /admin.
    admin: isLoggedIn,
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
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

const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: hasRole(["admin", "designer", "developer"]),
    update: hasRole(["admin", "designer", "developer"]),
    delete: isAdmin,
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

const Notes: CollectionConfig = {
  slug: "notes",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
  },
  access: {
    read: () => true,
    create: hasRole(["admin", "pm", "developer"]),
    update: hasRole(["admin", "pm", "developer"]),
    delete: isAdmin,
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

/** Демо-портал: карточка компонента + ссылки; вкладка с блоками документации (как в Notion / Uber Base). */
const Components: CollectionConfig = {
  slug: "components",
  folders: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "status", "updatedAt"],
    description:
      "Карточка и ссылки; вкладка «Документация» — блоки для портала (визуал на сайте). Все типы полей Payload — коллекция «Справочник полей».",
  },
  access: {
    read: hasRole(["admin", "pm"]),
    create: hasRole(["admin","pm"]),
    update: hasRole(["admin", "pm"]),
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [syncComponentDesignChecklistBeforeChange],
    afterRead: [syncComponentDesignChecklistAfterRead],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Карточка",
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
              required: true,
              unique: true,
              label: "Slug (URL)",
              admin: {
                description:
                  "Латиница, без пробелов — страница портала /components/[slug]",
              },
            },
            {
              name: "description",
              type: "textarea",
              label: "Краткое описание",
              admin: { description: "Лид под заголовком на портале." },
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
              name: "relatedPreviewLight",
              type: "upload",
              relationTo: "media",
              label: "Превью Related (светлая тема)",
              admin: {
                description:
                  "Скриншот для карточек Related Components. Генерация: npm run capture:related-previews",
              },
            },
            {
              name: "relatedPreviewDark",
              type: "upload",
              relationTo: "media",
              label: "Превью Related (тёмная тема)",
              admin: {
                description:
                  "Скриншот для карточек Related Components в тёмной теме портала.",
              },
            },
            {
              name: "docsUrl",
              type: "text",
              label: "Документация (внешняя или внутренняя)",
            },
            {
              name: "status",
              type: "select",
              label: "Статус",
              defaultValue: "stable",
              options: [
                { label: "Stable", value: "stable" },
                { label: "Preview (beta)", value: "beta" },
                { label: "Deprecated", value: "deprecated" },
              ],
              admin: {
                description:
                  "Не заполнены обязательные поля карточки — запись не попадает на портал (черновик в CMS без отдельного статуса).",
              },
            },
            {
              name: "statusNote",
              type: "textarea",
              label: "Примечание к статусу",
              admin: {
                description: "Текст бейджа или предупреждения на портале.",
              },
            },
            {
              name: "parentComponent",
              type: "relationship",
              relationTo: "components",
              label: "Родительский компонент",
              admin: {
                description: "Вариант или часть семейства (отдельная страница-родитель).",
              },
              filterOptions: ({ id }) =>
                id ? { id: { not_equals: id } } : true,
            },
            {
              name: "subcomponents",
              type: "relationship",
              relationTo: "components",
              hasMany: true,
              label: "Состоит из",
              admin: {
                description: "Дочерние компоненты со своими страницами в портале.",
              },
              filterOptions: ({ id }) =>
                id ? { id: { not_equals: id } } : true,
            },
            {
              name: "relatedComponents",
              type: "relationship",
              relationTo: "components",
              hasMany: true,
              label: "Связанные компоненты",
              admin: {
                description: "Смежные компоненты (часто используют вместе).",
              },
              filterOptions: ({ id }) =>
                id ? { id: { not_equals: id } } : true,
            },
            {
              name: "replacedBy",
              type: "relationship",
              relationTo: "components",
              label: "Заменён на",
              admin: {
                description: "Для deprecated — куда перейти вместо этого компонента.",
              },
              filterOptions: ({ id }) =>
                id ? { id: { not_equals: id } } : true,
            },
            {
              name: "showTOC",
              type: "checkbox",
              label: "Показывать оглавление",
              defaultValue: true,
              admin: {
                position: "sidebar",
                description:
                  "Правая колонка «На этой странице». Список строится из заголовков H2 на странице.",
              },
            },
          ],
        },
        {
          label: "Design checklist",
          description:
            "Отметьте галочками выполненные требования. Все пункты подставляются автоматически из коллекции «Design checklist».",
          fields: [
            {
              name: "designChecklist",
              type: "array",
              label: "Статусы требований",
              labels: { singular: "Пункт", plural: "Пункты" },
              admin: {
                description:
                  "Список заполняется автоматически. Редактору нужно только включить «Выполнено».",
                initCollapsed: false,
                isSortable: false,
              },
              fields: [
                {
                  name: "item",
                  type: "relationship",
                  relationTo: "design-checklist-items",
                  required: true,
                  label: "Пункт",
                  admin: {
                    readOnly: true,
                    description: "Подставляется из справочника автоматически.",
                  },
                },
                {
                  name: "done",
                  type: "checkbox",
                  label: "Выполнено",
                  defaultValue: false,
                },
                {
                  name: "note",
                  type: "textarea",
                  label: "Комментарий",
                },
              ],
            },
          ],
        },
        {
          label: "Документация",
          description:
            "Здесь — только данные (формы). Красивый макет рисуется на портале /components/[slug]. Справочник по типам полей Payload — коллекция «Справочник полей».",
          fields: [
            {
              name: "documentation",
              type: "blocks",
              label: "Контент со страницы",
              blocks: documentationBlocksForComponents,
              access: {
                read: isPortalDocumentationReadable,
              },
              admin: {
                initCollapsed: false,
                description:
                  "13 типов контент-блоков (14-й слот — Markdown export на странице). Порядок = порядок на портале.",
              },
            },
          ],
        },
      ],
    },
  ],
};

const Colors: CollectionConfig = {
  slug: "colors",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "hex", "sortOrder"],
    description:
      "Цветовые токены / образцы палитры; вкладка «Документация» — те же 24 блока, что у components.",
  },
  access: {
    read: () => true,
    create: hasRole(["admin", "designer"]),
    update: hasRole(["admin", "designer"]),
    delete: isAdmin,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Карточка",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              label: "Название",
            },
            {
              name: "tokenKey",
              type: "text",
              label: "Ключ в коде",
              admin: { description: "Например color.primary или palette.blue.500" },
            },
            {
              name: "hex",
              type: "text",
              required: true,
              label: "HEX",
              admin: { description: "#RRGGBB" },
            },
            {
              name: "sortOrder",
              type: "number",
              label: "Порядок сортировки",
              defaultValue: 0,
            },
            {
              name: "caption",
              type: "textarea",
              label: "Подпись",
            },
          ],
        },
        {
          label: "Документация",
          description:
            "Те же типы контент-блоков, что у components. Макет на портале — /colors/[id].",
          fields: [
            {
              name: "documentation",
              type: "blocks",
              label: "Контент со страницы",
              blocks: documentationBlocksForColors,
              access: {
                read: isPortalDocumentationReadable,
              },
              admin: {
                initCollapsed: false,
                description:
                  "8 типов блоков для документации цвета (секция, заметка, rich text, код, Do/Don't, ссылки, изображение, связанный цвет).",
              },
            },
          ],
        },
      ],
    },
  ],
};

const Icons: CollectionConfig = {
  slug: "icons",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt"],
    description: "Иконки: метаданные и ссылки; превью — через Media.",
  },
  access: {
    read: () => true,
    create: hasRole(["admin", "designer"]),
    update: hasRole(["admin", "designer"]),
    delete: isAdmin,
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

/** Общие ссылки в шапке/подвале портала (один документ). */
const PortalSources: GlobalConfig = {
  slug: "portal-sources",
  label: "Ссылки на источники",
  admin: {
    description:
      "Общие URL: библиотека Figma, Storybook, репозиторий, внешняя документация.",
  },
  access: {
    read: () => true,
    update: hasRole(["admin", "pm"]),
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

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: "ru",
    supportedLanguages: {
      ru,
      en,
    },
  },
  folders: {
    browseByFolder: true,
  },
  collections: [
    Users,
    Media,
    Components,
    DesignChecklistItemsCollection,
    Colors,
    Icons,
    Notes,
    FieldShowcaseCollection,
  ],
  globals: [PortalSources],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./payload.sqlite",
    },
    // Dev push дублирует индексы после частичного push — только миграции.
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    mcpPlugin({
      mcp: {
        tools: componentAgentMcpTools,
      },
      collections: {
        components: {
          description:
            "UI-kit: getComponent / listComponents — карточка; listComponentsFull — все поля и documentation.",
          enabled: { find: false, create: false, update: false, delete: false },
        },
        colors: {
          description: "Цветовые токены портала.",
          enabled: { find: true, create: true, update: true, delete: false },
        },
        icons: {
          description: "Иконки и превью (Media).",
          enabled: { find: true, create: true, update: true, delete: false },
        },
        media: {
          description: "Загрузки (превью иконок и др.).",
          enabled: { find: true, create: true, update: true, delete: false },
        },
        notes: {
          description: "Заметки / черновики.",
          enabled: { find: true, create: true, update: true, delete: false },
        },
      },
      globals: {
        "portal-sources": {
          description: "Глобальные ссылки: Figma library, Storybook, документация, репозиторий.",
          enabled: { find: true, update: true },
        },
      },
    }),
  ],
});
