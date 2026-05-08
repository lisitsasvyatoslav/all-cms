import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { ru } from "@payloadcms/translations/languages/ru";
import path from "path";
import type { CollectionConfig, GlobalConfig } from "payload";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

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

/** Демо-портал: карточка компонента + ссылки на артефакты. */
const Components: CollectionConfig = {
  slug: "components",
  folders: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
    description:
      "Компоненты UI-kit: описание и ссылки на Figma / Storybook / доку.",
  },
  access: {
    read: () => true,
    create: hasRole(["admin", "designer", "developer", "pm"]),
    update: hasRole(["admin", "designer", "developer", "pm"]),
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
      required: true,
      unique: true,
      label: "Slug (URL)",
      admin: { description: "Латиница, без пробелов — для будущих страниц /components/[slug]" },
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание",
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
      name: "docsUrl",
      type: "text",
      label: "Документация (внешняя или внутренняя)",
    },
  ],
};

const Colors: CollectionConfig = {
  slug: "colors",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "hex", "sortOrder"],
    description: "Цветовые токены / образцы палитры для портала.",
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
  collections: [Users, Media, Components, Colors, Icons, Notes],
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
  }),
  sharp,
  plugins: [],
});
