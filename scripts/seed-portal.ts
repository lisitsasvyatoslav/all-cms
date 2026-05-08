/**
 * Заполняет демо-данные: 2 компонента, 8 цветов, 4 иконки (+ файлы SVG в Media), глобальные ссылки.
 * Запуск: `npm run seed:portal` (нужен `.env` с PAYLOAD_SECRET и DATABASE_URI).
 */
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import config from "../payload.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const iconAssetsDir = path.join(projectRoot, "public", "icon-assets");

const demoSources = {
  figmaLibraryUrl: "https://www.figma.com/community/file/1199125538294350451",
  storybookUrl: "https://storybook.js.org/showcase",
  documentationUrl: "https://payloadcms.com/docs",
  repositoryUrl: "https://github.com/payloadcms/payload",
};

const components = [
  {
    name: "Button",
    slug: "button",
    description:
      "Триггер действия: варианты primary / outline / ghost, размеры sm–lg, состояние disabled.",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    docsUrl: "https://payloadcms.com/docs",
  },
  {
    name: "Input",
    slug: "input",
    description:
      "Текстовое поле с label, ошибкой и подсказкой; размеры sm–lg, invalid state.",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    docsUrl: "https://payloadcms.com/docs/getting-started/installation",
  },
];

const componentFolderBySlug: Record<string, string> = {
  button: "Actions",
  input: "Forms",
};

const colors = [
  { name: "Neutral 50", tokenKey: "color.neutral.50", hex: "#fafafa", sortOrder: 0 },
  { name: "Neutral 500", tokenKey: "color.neutral.500", hex: "#71717a", sortOrder: 1 },
  { name: "Neutral 900", tokenKey: "color.neutral.900", hex: "#18181b", sortOrder: 2 },
  { name: "Brand primary", tokenKey: "color.brand.primary", hex: "#2563eb", sortOrder: 3 },
  { name: "Accent", tokenKey: "color.accent", hex: "#f97316", sortOrder: 4 },
  { name: "Success", tokenKey: "color.semantic.success", hex: "#22c55e", sortOrder: 5 },
  { name: "Warning", tokenKey: "color.semantic.warning", hex: "#eab308", sortOrder: 6 },
  { name: "Danger", tokenKey: "color.semantic.danger", hex: "#ef4444", sortOrder: 7 },
];

const iconFileBySlug: Record<string, string> = {
  search: "search.svg",
  close: "close.svg",
  "chevron-right": "chevron-right.svg",
  user: "user.svg",
};

const icons = [
  {
    name: "Search",
    slug: "search",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Иконка поиска, 16–24px",
  },
  {
    name: "Close",
    slug: "close",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Закрытие модалок и тегов",
  },
  {
    name: "Chevron right",
    slug: "chevron-right",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Навигация, аккордеоны",
  },
  {
    name: "User",
    slug: "user",
    figmaUrl: "https://www.figma.com/design/",
    storybookUrl: "https://storybook.js.org/docs",
    notes: "Профиль, аватар-плейсхолдер",
  },
];

async function ensureIconMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  filename: string,
) {
  const alt = `Icon asset: ${slug}`;
  const found = await payload.find({
    collection: "media",
    where: { alt: { equals: alt } },
    limit: 1,
    overrideAccess: true,
  });
  if (found.docs[0]) {
    return Number(found.docs[0].id);
  }
  const filePath = path.join(iconAssetsDir, filename);
  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
    overrideAccess: true,
  });
  return Number(doc.id);
}

async function upsertComponent(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: (typeof components)[number],
  folderId?: number,
) {
  const found = await payload.find({
    collection: "components",
    where: { slug: { equals: data.slug } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  const dataWithFolder = {
    ...data,
    ...(folderId ? { folder: folderId } : {}),
  };
  if (doc) {
    await payload.update({
      collection: "components",
      id: doc.id,
      data: dataWithFolder,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "components",
      data: dataWithFolder,
      overrideAccess: true,
    });
  }
}

async function ensureComponentFolder(
  payload: Awaited<ReturnType<typeof getPayload>>,
  name: string,
): Promise<number> {
  const existing = await payload.find({
    collection: "payload-folders",
    limit: 100,
    overrideAccess: true,
  });

  const found = existing.docs.find(
    (doc: any) =>
      doc.name === name &&
      Array.isArray(doc.folderType) &&
      doc.folderType.includes("components") &&
      !doc.folder,
  );

  if (found) return Number(found.id);

  const created = await payload.create({
    collection: "payload-folders",
    data: {
      name,
      folderType: ["components"],
    },
    overrideAccess: true,
  });

  return Number(created.id);
}

type IconDoc = (typeof icons)[number] & { preview: number };

async function upsertIcon(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: IconDoc,
) {
  const found = await payload.find({
    collection: "icons",
    where: { slug: { equals: data.slug } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  if (doc) {
    await payload.update({
      collection: "icons",
      id: doc.id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "icons",
      data,
      overrideAccess: true,
    });
  }
}

async function upsertColor(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: (typeof colors)[number],
) {
  const found = await payload.find({
    collection: "colors",
    where: { tokenKey: { equals: data.tokenKey } },
    limit: 1,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  if (doc) {
    await payload.update({
      collection: "colors",
      id: doc.id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "colors",
      data,
      overrideAccess: true,
    });
  }
}

async function main() {
  const payload = await getPayload({ config });

  await payload.updateGlobal({
    slug: "portal-sources",
    data: demoSources,
    overrideAccess: true,
  });

  const actionsFolderId = await ensureComponentFolder(payload, "Actions");
  const formsFolderId = await ensureComponentFolder(payload, "Forms");
  await ensureComponentFolder(payload, "Feedback");

  const folderIdByName: Record<string, number> = {
    Actions: actionsFolderId,
    Forms: formsFolderId,
  };

  for (const row of components) {
    const folderName = componentFolderBySlug[row.slug];
    const folderId = folderName ? folderIdByName[folderName] : undefined;
    await upsertComponent(payload, row, folderId);
  }

  for (const row of colors) {
    await upsertColor(payload, row);
  }

  for (const row of icons) {
    const file = iconFileBySlug[row.slug];
    if (!file) {
      throw new Error(`No icon file mapped for slug: ${row.slug}`);
    }
    const preview = await ensureIconMedia(payload, row.slug, file);
    await upsertIcon(payload, { ...row, preview });
  }

  console.log("Seed OK: portal-sources, components×2, colors×8, icons×4 + SVG в Media.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
