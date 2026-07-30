import {
  PORTAL_COMPONENTS_WEB_PATH,
  PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH,
  PORTAL_SHOWCASE_FIGMA_TO_CODE_PATH,
} from "@/lib/portal/components/routes";
import { defaultStorybookBaseUrl, storybookStoryUrl } from "@/lib/storybook/portal-preview-config";
import type { DsPage } from "@/payload-types";

export type DsPageDocumentation = NonNullable<DsPage["documentation"]>;

type SectionItem = {
  label: string;
  description?: string | null;
  accentColor?: string | null;
  labelAsBadge?: boolean | null;
};

const sb = () => defaultStorybookBaseUrl();

function story(component: string, storyId: string, args?: string): string {
  return storybookStoryUrl(sb(), component, storyId, args);
}

function section(heading: string, body: string, items?: SectionItem[]): DsPageDocumentation[number] {
  return {
    blockType: "section",
    showLLM: true,
    heading,
    body,
    ...(items ? { items } : {}),
  };
}

function code(
  codeText: string,
  opts?: {
    title?: string;
    previewComponent?: string;
    previewStory?: string;
    previewArgs?: string;
    previewHeight?: number;
    collapsed?: boolean;
  },
): DsPageDocumentation[number] {
  return {
    blockType: "codeExample",
    showLLM: true,
    title: opts?.title,
    code: codeText,
    defaultCollapsed: opts?.collapsed ?? true,
    previewHeight: opts?.previewHeight ?? 220,
    ...(opts?.previewComponent && opts.previewStory
      ? { previewStorybookUrl: story(opts.previewComponent, opts.previewStory, opts.previewArgs) }
      : {}),
  };
}

function embed(
  title: string,
  component: string,
  storyId: string,
  height = 280,
  args?: string,
): DsPageDocumentation[number] {
  return {
    blockType: "storybookEmbed",
    showLLM: true,
    title,
    storybookUrl: story(component, storyId, args),
    frameHeight: height,
  };
}

function links(
  entries: Array<{ label: string; url: string }>,
): DsPageDocumentation[number] {
  return {
    blockType: "resourceLinks",
    showLLM: true,
    links: entries,
  };
}

function envTable(): DsPageDocumentation[number] {
  return {
    blockType: "propsTable",
    showLLM: true,
    title: "Переменные окружения",
    subtitle: ".env.local",
    rows: [
      {
        name: "PAYLOAD_SECRET",
        type: "string",
        defaultValue: "—",
        description: "Секрет для сессий Payload Admin. Обязателен в любом окружении.",
      },
      {
        name: "DATABASE_URI",
        type: "string",
        defaultValue: "file:./payload.sqlite",
        description: "libSQL / Turso URL. Пустое значение + dev:local → локальный SQLite.",
      },
      {
        name: "DATABASE_AUTH_TOKEN",
        type: "string",
        defaultValue: "—",
        description: "Токен Turso. Не нужен для file: SQLite.",
      },
      {
        name: "NEXT_PUBLIC_STORYBOOK_URL",
        type: "string",
        defaultValue: "http://127.0.0.1:6006",
        description: "Базовый URL Storybook для embed-превью на портале.",
      },
    ],
  };
}

/** Hero UI-style reference links + Finam portal assets in /public. */
const HEROUI_REF = {
  quickStart: "https://www.heroui.com/docs/react/getting-started/quick-start",
  frameworks: "https://www.heroui.com/docs/react/getting-started/frameworks",
  nextjs: "https://www.heroui.com/docs/react/getting-started/frameworks/nextjs",
  cli: "https://www.heroui.com/docs/react/getting-started/cli",
  theming: "https://www.heroui.com/docs/react/getting-started/theming",
  designPrinciples: "https://www.heroui.com/docs/react/getting-started/design-principles",
} as const;

const FINAM_RADIX_SETUP = `import "@radix-ui/themes/styles.css";

import { Theme } from "@radix-ui/themes";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Theme accentColor="indigo" grayColor="slate" radius="medium">
      {children}
    </Theme>
  );
}`;

const FINAM_DS_PAGE = `import { loadDsPageBySegments } from "@/lib/portal/ds-pages/load-pages";
import { DsPageBody } from "@/app/(portal)/ds/[...slug]/ds-page-body";

export default async function DsNestedPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <DsPageBody segments={slug} />;
}`;

export const dsPageDocumentation = {
  introductionRoot: [
    section(
      "Обзор раздела",
      "Getting Started портала Finam DS — как у Hero UI: установка, принципы, стек, CLI и витрина. Каждая тема — отдельная страница с кодом, превью и таблицами.",
      [
        { label: "React 19+", description: "App Router, Server Components.", accentColor: "#61dafb", labelAsBadge: true },
        { label: "Payload 3", description: "CMS + nested docs + MCP.", accentColor: "#0070f3", labelAsBadge: true },
        { label: "Radix Themes", description: "UI kit и Storybook.", accentColor: "#8b5cf6", labelAsBadge: true },
      ],
    ),
    links([
      { label: "Hero UI — Quick Start (референс UX)", url: HEROUI_REF.quickStart },
      { label: "Каталог компонентов Finam DS", url: PORTAL_COMPONENTS_WEB_PATH },
      { label: "Showcase блоков документации", url: PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH },
    ]),
  ] satisfies DsPageDocumentation,

  whatIsFinamDs: [
    section(
      "Область дизайн-системы",
      "Finam DS охватывает UI-компоненты, паттерны документации, бренд-гайдлайны и MCP-сборку интерфейсов. Портал — единый источник правды для дизайнеров, разработчиков и PM.",
    ),
    embed("Button — базовый пример", "button", "Default", 200),
    section(
      "Что уже работает",
      "PoC-портал проверяет архитектуру «контент в CMS → рендер в Next.js → превью в Storybook».",
      [
        { label: "Каталог", description: "Документация, props, embed stories.", accentColor: "#22c55e" },
        { label: "Overview", description: "Nested pages с reorder в Admin.", accentColor: "#3b82f6" },
        { label: "Compose MCP", description: "Radix TSX из Figma или брифа.", accentColor: "#a855f7" },
        { label: "Brand / Text", description: "Отдельные области портала.", accentColor: "#f59e0b" },
      ],
    ),
    links([
      { label: "Hero UI — Design Principles", url: HEROUI_REF.designPrinciples },
      { label: "Payload — Nested Docs", url: "https://payloadcms.com/docs/plugins/nested-docs" },
    ]),
  ] satisfies DsPageDocumentation,

  portalNavigation: [
    section(
      "Разделы портала",
      "Сайдбар меняется по области URL — как секции документации Hero UI.",
      [
        { label: "/ds", description: "Дизайн-система: Обзор, Компоненты, Справочник.", accentColor: "#1677ff", labelAsBadge: true },
        { label: "/brand", description: "Логотип, цвет, типографика.", accentColor: "#eb2f96", labelAsBadge: true },
        { label: "/text", description: "Глоссарий и редакционный контент.", accentColor: "#52c41a", labelAsBadge: true },
      ],
    ),
    {
      blockType: "doDont",
      showLLM: true,
      heading: "Навигация Overview",
      intro: "Дерево страниц в Payload Admin должно отражать логику сайдбара, а не дублировать статические роуты.",
      dos: [
        { text: "Корневая «Введение» → URL /ds (slug introduction)." },
        { text: "Reorder в Admin меняет порядок в сайдбаре без деплоя." },
        { text: "Зарезервированные сегменты: components, colors — не перекрывайте catch-all." },
      ],
      donts: [
        { text: "Не создавайте slug showcase/documentation-blocks — конфликт со статическим роутом." },
        { text: "Не вставляйте HTML в CMS — только typed blocks." },
      ],
    },
  ] satisfies DsPageDocumentation,

  audiences: [
    section(
      "Дизайнеры",
      "Компоненты, Do/Don't, Figma через global portal-sources. Витрина показывает все типы CMS-блоков на одной странице.",
    ),
    section(
      "Разработчики",
      "Примеры кода, props из ui-kit, Storybook локально. MCP composeUi — аналог Hero UI MCP для генерации UI.",
    ),
    section(
      "PM и контент",
      "Редактирование Overview и docs компонентов в Payload. Дерево страниц — drag-and-drop и смена родителя.",
    ),
    {
      blockType: "checklist",
      showLLM: true,
      title: "Чеклист онбординга",
      items: [
        { title: "Запустить портал", description: "npm run dev → /ds", done: true },
        { title: "Открыть Storybook", description: "npm run storybook → :6006", done: false },
        { title: "Правка в Admin", description: "Publish страницы Overview", done: false },
        { title: "Подключить MCP", description: "design-system-portal в Cursor", done: false },
      ],
    },
  ] satisfies DsPageDocumentation,

  quickStartRoot: [
    section(
      "С чего начать",
      "Три шага — как Quick Start у Hero UI: установка, окружение, первая правка в CMS.",
    ),
    code(`# Клонирование и установка
git clone <repo-url> next-app
cd next-app
npm install`, { title: "Requirements", collapsed: false }),
  ] satisfies DsPageDocumentation,

  installAndRun: [
    section(
      "Требования",
      "Node.js 22+, npm. Для Turso — аккаунт libSQL; для локальной разработки достаточно SQLite.",
      [
        { label: "Node 22+", description: "LTS или Current.", accentColor: "#339933", labelAsBadge: true },
        { label: "npm", description: "Менеджер пакетов по умолчанию.", accentColor: "#cb3837", labelAsBadge: true },
      ],
    ),
    code(`npm install`, { title: "Install dependencies", collapsed: false }),
    code(`npm run dev
# → http://127.0.0.1:3000/ds

npm run dev:local
# → локальный payload.sqlite, без Turso`, { title: "Start dev server", collapsed: false }),
    embed("Превью после установки — Button", "button", "Default", 220),
    links([
      { label: "Hero UI — Quick Install", url: HEROUI_REF.quickStart },
      { label: "Next.js — Installation", url: "https://nextjs.org/docs/app/getting-started/installation" },
    ]),
  ] satisfies DsPageDocumentation,

  environment: [
    section(
      "Local vs Turso",
      "PoC поддерживает удалённую libSQL (Turso) и локальный file: SQLite. Выберите сценарий до первого migrate.",
    ),
    envTable(),
    code(`# .env.local — локальная разработка
PAYLOAD_SECRET=your-secret-min-32-chars
DATABASE_URI=
DATABASE_AUTH_TOKEN=

# Turso (remote)
# DATABASE_URI=libsql://...
# DATABASE_AUTH_TOKEN=...`, { title: ".env.local", collapsed: false }),
  ] satisfies DsPageDocumentation,

  firstPayloadEdit: [
    section(
      "Workflow редактора",
      "1. Откройте /admin → DS · Страницы. 2. Выберите страницу Обзора. 3. Добавьте block (section, codeExample, doDont…). 4. Publish.",
    ),
    code(`// После Publish хук сбрасывает cache tag portal:ds-pages
// Обновите /ds — изменения видны без redeploy`, {
      title: "Revalidation",
      collapsed: true,
    }),
    links([
      { label: "Payload Admin", url: "/admin" },
      { label: "Hero UI — Theming (референс blocks)", url: HEROUI_REF.theming },
    ]),
  ] satisfies DsPageDocumentation,

  designPrinciplesRoot: [
    section(
      "Три опоры",
      "Единообразие, доступность и CMS-driven UI — аналог Design Principles в Hero UI, адаптированный под Finam DS и Payload.",
    ),
    links([{ label: "Hero UI — Design Principles", url: HEROUI_REF.designPrinciples }]),
  ] satisfies DsPageDocumentation,

  consistency: [
    section(
      "Одна система",
      "Layout-примитивы Radix Themes и блоки портала. Do/Don't компонента важнее Figma при конфликте.",
    ),
    {
      blockType: "doDont",
      showLLM: true,
      heading: "Компоненты vs разовая вёрстка",
      dos: [
        { text: "Flex, Box, Section, Heading из @radix-ui/themes." },
        { text: "Копируйте codeExample со страницы компонента." },
        { text: "composeUi для новых экранов — не raw HTML." },
      ],
      donts: [
        { text: "Tailwind-only разметка в продуктовых экранах DS." },
        { text: "Inline-стили вместо tokens / Theme." },
      ],
    },
    embed("Единый Button из ui-kit", "button", "Variants", 260, "variant:soft"),
  ] satisfies DsPageDocumentation,

  accessibility: [
    section(
      "Из коробки",
      "Radix Themes наследует accessible primitives. Storybook addon-a11y — npm run storybook.",
    ),
    {
      blockType: "accessibility",
      showLLM: true,
      intro: "Интерактивные элементы портала следуют WAI-ARIA Button pattern там, где применимо.",
      patternLinkLabel: "Button pattern (WAI-ARIA APG)",
      patternLinkUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
      keyboardRows: [
        { keys: "Tab", description: "Перемещение фокуса между интерактивными элементами." },
        { keys: "Enter / Space", description: "Активация кнопок и ссылок." },
        { keys: "Esc", description: "Закрытие modal, dropdown, dialog." },
      ],
    },
    links([{ label: "Hero UI — Accessibility", url: "https://www.heroui.com/docs/react/getting-started/accessibility" }]),
  ] satisfies DsPageDocumentation,

  cmsDrivenUi: [
    section(
      "Разделение контента и UI",
      "Payload хранит blocks; React мапит blockType → layout. Редакторы не вставляют HTML.",
    ),
    code(`{
  blockType: "codeExample",
  showLLM: true,
  title: "Default",
  code: "import { Button } from '@next-app/ui-kit';\\n...",
  previewStorybookUrl: "http://127.0.0.1:6006/?path=/story/..."
}`, { title: "Пример block в CMS", collapsed: false }),
    {
      blockType: "designTokens",
      showLLM: true,
      title: "Portal tokens",
      groups: [
        {
          groupTitle: "Theme",
          helpUrl: HEROUI_REF.theming,
          rows: [
            { name: "accentColor", description: "Акцент Radix Theme", valueType: "string", defaultValue: "indigo" },
            { name: "grayColor", description: "Нейтральная шкала", valueType: "string", defaultValue: "slate" },
            { name: "radius", description: "Скругление", valueType: "string", defaultValue: "medium" },
          ],
        },
      ],
    },
  ] satisfies DsPageDocumentation,

  frameworksRoot: [
    section(
      "Стек",
      "Hero UI документирует Next.js, Vite, Laravel и др. Finam DS фокусируется на Next.js + Payload + Radix + Storybook.",
      [
        { label: "Next.js", description: "App Router, RSC, /ds routes.", accentColor: "#000" },
        { label: "Payload", description: "CMS, MCP, nested pages.", accentColor: "#0070f3" },
        { label: "Radix", description: "@radix-ui/themes + ui-kit.", accentColor: "#8b5cf6" },
        { label: "Storybook", description: "Каталог и embed-превью.", accentColor: "#ff4785" },
      ],
    ),
    links([
      { label: "Hero UI — Frameworks", url: HEROUI_REF.frameworks },
      { label: "React (иконка /public/react.svg)", url: HEROUI_REF.nextjs },
    ]),
  ] satisfies DsPageDocumentation,

  nextjs: [
    section(
      "App Router",
      "Server Components загружают Payload. Overview — /ds и /ds/[...slug]. unstable_cache + revalidateTag.",
    ),
    code(FINAM_DS_PAGE, { title: "Страница Overview", collapsed: false }),
    code(`export const revalidate = 3600;

export async function generateStaticParams() {
  const paths = await loadPublishedDsPagePathSegments();
  return paths.map((slug) => ({ slug }));
}`, { title: "SSG + ISR", collapsed: true }),
    links([
      { label: "Hero UI — Next.js guide", url: HEROUI_REF.nextjs },
      { label: "Next.js App Router", url: "https://nextjs.org/docs/app" },
    ]),
  ] satisfies DsPageDocumentation,

  payloadCms: [
    section(
      "Модель контента",
      "components, ds-pages, brand-pages, globals. plugin-nested-docs + page-tree для иерархии Overview.",
    ),
    {
      blockType: "propsTable",
      showLLM: true,
      title: "Коллекции портала",
      subtitle: "Payload",
      rows: [
        { name: "components", type: "collection", defaultValue: "—", description: "Каталог UI + documentation blocks." },
        { name: "ds-pages", type: "collection", defaultValue: "—", description: "Nested Overview /ds/*." },
        { name: "brand-pages", type: "collection", defaultValue: "—", description: "Бренд-раздел /brand/*." },
        { name: "portal-sources", type: "global", defaultValue: "—", description: "Figma, Storybook, GitHub URLs." },
      ],
    },
    links([{ label: "Payload Docs", url: "https://payloadcms.com/docs" }]),
  ] satisfies DsPageDocumentation,

  radixStorybook: [
    section(
      "UI kit + Storybook",
      "packages/ui-kit оборачивает Radix. Storybook :6006 — embed на страницах docs.",
    ),
    code(FINAM_RADIX_SETUP, {
      title: "Подключение Theme",
      collapsed: false,
      previewComponent: "button",
      previewStory: "Default",
    }),
    embed("Live — Button variants", "button", "Variants", 300),
    links([
      { label: "Radix Themes", url: "https://www.radix-ui.com/themes/docs/overview/getting-started" },
      { label: "Storybook", url: "https://storybook.js.org/docs" },
    ]),
  ] satisfies DsPageDocumentation,

  cliRoot: [
    section(
      "npm scripts",
      "Finam DS использует npm-скрипты вместо heroui-cli — но структура документации как у Hero UI CLI.",
    ),
    links([{ label: "Hero UI — CLI", url: HEROUI_REF.cli }]),
  ] satisfies DsPageDocumentation,

  development: [
    code(`npm run dev          # портал :3000/ds
npm run storybook    # каталог :6006
npm run lint         # ESLint
npm run typecheck:stories`, { title: "Daily commands", collapsed: false }),
    embed("Storybook — Button", "button", "Default", 200),
  ] satisfies DsPageDocumentation,

  migrationsSeed: [
    code(`npm run payload:migrate   # Turso
npm run migrate:local       # SQLite
npm run sync:ds-pages       # сид Overview
npm run generate:types      # payload-types.ts`, {
      title: "Database & seed",
      collapsed: false,
    }),
    {
      blockType: "changelog",
      showLLM: true,
      entries: [
        { version: "ds-pages tree", kind: "minor", changes: [{ text: "Nested Overview + page tree plugin." }] },
        { version: "compose MCP", kind: "minor", changes: [{ text: "composeUi, Figma workflow tools." }] },
      ],
    },
  ] satisfies DsPageDocumentation,

  storybookCompose: [
    code(`npm run test:compose
npm run capture:related-previews`, { title: "Compose & previews", collapsed: false }),
    {
      blockType: "motion",
      showLLM: true,
      title: "Motion tokens (пример)",
      intro: "Анимации Radix / CSS transitions — документируйте в motion-блоках компонентов.",
      tokens: [
        { name: "duration-fast", description: "Hover, focus ring", value: "150ms", durationMs: 150 },
        { name: "duration-normal", description: "Modal, dropdown", value: "250ms", durationMs: 250 },
      ],
    },
  ] satisfies DsPageDocumentation,

  showcaseRoot: [
    section(
      "Живые демо",
      "Showcase-роуты — полноэкранные примеры поверх CMS-документации, как интерактивные разделы Hero UI.",
    ),
    links([
      { label: PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH, url: PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH },
      { label: PORTAL_SHOWCASE_FIGMA_TO_CODE_PATH, url: PORTAL_SHOWCASE_FIGMA_TO_CODE_PATH },
    ]),
  ] satisfies DsPageDocumentation,

  docBlocksOverview: [
    section(
      "Все 13 block types",
      "Страница showcase собирает section, codeExample, doDont, propsTable, storybookEmbed, accessibility, designTokens, changelog, anatomy, checklist, resourceLinks, motion, relComponents.",
    ),
    embed("Пример embed на showcase", "button", "Default", 240),
    links([{ label: "Открыть showcase", url: PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH }]),
  ] satisfies DsPageDocumentation,

  figmaComposeOverview: [
    section(
      "Figma → Radix",
      "MCP design-system-portal: composeUi, get_compose_guide. Не пишите HTML для DS-компонентов вручную.",
    ),
    code(`# Cursor: подключите design-system-portal MCP
# Промпт:
# https://figma.com/design/...
# Собери макет. Через design-system-portal`, {
      title: "Workflow",
      collapsed: false,
    }),
    links([
      { label: "Figma-to-Code showcase", url: PORTAL_SHOWCASE_FIGMA_TO_CODE_PATH },
      { label: "Hero UI — MCP (референс)", url: "https://www.heroui.com/docs/react/getting-started/mcp-server" },
    ]),
  ] satisfies DsPageDocumentation,
} as const;
