import type { DsOverviewPageSlug } from "@/lib/portal/ds-pages/paths";
import { dsPageDocumentation, type DsPageDocumentation } from "@/lib/payload/ds-pages-documentation";

export type { DsPageDocumentation };

export type DsPageSeedNode = {
  title: string;
  slug: string;
  description: string;
  documentation: DsPageDocumentation;
  children?: DsPageSeedNode[];
};

export type DsOverviewSeedTree = Record<DsOverviewPageSlug, DsPageSeedNode>;

export const dsOverviewSeedTree: DsOverviewSeedTree = {
  introduction: {
    title: "Введение",
    slug: "introduction",
    description:
      "Добро пожаловать в портал дизайн-системы Finam — Radix Themes, Payload CMS и документация для продуктовых команд.",
    documentation: dsPageDocumentation.introductionRoot,
    children: [
      {
        title: "Что такое Finam DS",
        slug: "what-is-finam-ds",
        description: "Зачем нужна дизайн-система и как портал встроен в процесс разработки продукта.",
        documentation: dsPageDocumentation.whatIsFinamDs,
      },
      {
        title: "Навигация портала",
        slug: "portal-navigation",
        description: "Как устроены разделы Обзор, Компоненты, Brand и Text в боковой панели.",
        documentation: dsPageDocumentation.portalNavigation,
      },
      {
        title: "Для кого портал",
        slug: "audiences",
        description: "Что ждать от портала дизайнерам, разработчикам и PM.",
        documentation: dsPageDocumentation.audiences,
      },
    ],
  },
  "quick-start": {
    title: "Быстрый старт",
    slug: "quick-start",
    description: "Установка зависимостей, локальный запуск портала и вход в Payload Admin.",
    documentation: dsPageDocumentation.quickStartRoot,
    children: [
      {
        title: "Установка и запуск",
        slug: "install-and-run",
        description: "Клонирование репозитория, установка пакетов и старт dev-сервера.",
        documentation: dsPageDocumentation.installAndRun,
      },
      {
        title: "Окружение",
        slug: "environment",
        description: "PAYLOAD_SECRET, DATABASE_URI и сценарии local vs Turso.",
        documentation: dsPageDocumentation.environment,
      },
      {
        title: "Первая правка в CMS",
        slug: "first-payload-edit",
        description: "Вход в Admin и публикация изменения на странице Обзора.",
        documentation: dsPageDocumentation.firstPayloadEdit,
      },
    ],
  },
  "design-principles": {
    title: "Принципы дизайна",
    slug: "design-principles",
    description: "Правила, по которым строятся компоненты, документация и agent-assisted UI.",
    documentation: dsPageDocumentation.designPrinciplesRoot,
    children: [
      {
        title: "Единообразие",
        slug: "consistency",
        description: "Переиспользуйте примитивы и паттерны вместо разовой вёрстки.",
        documentation: dsPageDocumentation.consistency,
      },
      {
        title: "Доступность",
        slug: "accessibility",
        description: "Семантика, клавиатура и проверки a11y в Storybook.",
        documentation: dsPageDocumentation.accessibility,
      },
      {
        title: "Контент в CMS",
        slug: "cms-driven-ui",
        description: "Редакторы владеют контентом, код — представлением.",
        documentation: dsPageDocumentation.cmsDrivenUi,
      },
    ],
  },
  frameworks: {
    title: "Фреймворки",
    slug: "frameworks",
    description: "Стек: Next.js App Router, Payload 3, Radix Themes и Storybook.",
    documentation: dsPageDocumentation.frameworksRoot,
    children: [
      {
        title: "Next.js",
        slug: "nextjs",
        description: "App Router, RSC, кеширование и роуты портала в app/(portal).",
        documentation: dsPageDocumentation.nextjs,
      },
      {
        title: "Payload CMS",
        slug: "payload-cms",
        description: "Коллекции, nested docs, page tree plugin и MCP.",
        documentation: dsPageDocumentation.payloadCms,
      },
      {
        title: "Radix и Storybook",
        slug: "radix-storybook",
        description: "Обёртки ui-kit и визуальный каталог компонентов.",
        documentation: dsPageDocumentation.radixStorybook,
      },
    ],
  },
  cli: {
    title: "CLI",
    slug: "cli",
    description: "npm-скрипты для миграций, сидов, Storybook и compose.",
    documentation: dsPageDocumentation.cliRoot,
    children: [
      {
        title: "Разработка",
        slug: "development",
        description: "dev, lint, typecheck и Storybook.",
        documentation: dsPageDocumentation.development,
      },
      {
        title: "Миграции и сиды",
        slug: "migrations-seed",
        description: "Payload migrate и sync для страниц Обзора.",
        documentation: dsPageDocumentation.migrationsSeed,
      },
      {
        title: "Storybook и Compose",
        slug: "storybook-compose",
        description: "Тесты compose и скриншоты related previews.",
        documentation: dsPageDocumentation.storybookCompose,
      },
    ],
  },
  showcase: {
    title: "Витрина",
    slug: "showcase",
    description: "Интерактивные демо и внутренние инструменты поверх обычной документации компонентов.",
    documentation: dsPageDocumentation.showcaseRoot,
    children: [
      {
        title: "Блоки документации",
        slug: "doc-blocks-overview",
        description: "Обзор живой страницы со всеми типами CMS-блоков.",
        documentation: dsPageDocumentation.docBlocksOverview,
      },
      {
        title: "Сборка из Figma",
        slug: "figma-compose-overview",
        description: "Демо workflow Figma → Radix через MCP.",
        documentation: dsPageDocumentation.figmaComposeOverview,
      },
    ],
  },
};

function collectDsPageTitles(node: DsPageSeedNode, into: Record<string, string>): void {
  into[node.slug] = node.title;
  for (const child of node.children ?? []) {
    collectDsPageTitles(child, into);
  }
}

function collectDsPageDocumentation(
  node: DsPageSeedNode,
  into: Record<string, DsPageDocumentation>,
): void {
  into[node.slug] = node.documentation;
  for (const child of node.children ?? []) {
    collectDsPageDocumentation(child, into);
  }
}

function collectDsPageDescriptions(node: DsPageSeedNode, into: Record<string, string>): void {
  into[node.slug] = node.description;
  for (const child of node.children ?? []) {
    collectDsPageDescriptions(child, into);
  }
}

/** Русские названия страниц по slug — для навигации и хлебных крошек. */
export const dsPageTitleBySlug: Record<string, string> = {};
/** Контент страниц из сидов — для портала до/без sync в CMS. */
export const dsPageDocumentationBySlug: Record<string, DsPageDocumentation> = {};
/** Описания страниц из сидов. */
export const dsPageDescriptionBySlug: Record<string, string> = {};
for (const root of Object.values(dsOverviewSeedTree)) {
  collectDsPageTitles(root, dsPageTitleBySlug);
  collectDsPageDocumentation(root, dsPageDocumentationBySlug);
  collectDsPageDescriptions(root, dsPageDescriptionBySlug);
}

export function resolveDsPageTitle(slug: string, cmsTitle?: string | null): string {
  const fromSeed = dsPageTitleBySlug[slug.trim()];
  if (fromSeed) return fromSeed;
  return cmsTitle?.trim() ?? "";
}
