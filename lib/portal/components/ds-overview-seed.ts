import {
  PORTAL_COMPONENTS_WEB_PATH,
  PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH,
} from "@/lib/portal/components/routes";
export type DsOverviewSourceIcon = "figma" | "github" | "storybook" | "docs" | "markdown" | "link";

export type DsOverviewSourceItemSeed = {
  label: string;
  description: string;
  href: string;
  icon: DsOverviewSourceIcon;
  external: boolean;
};

export const DS_OVERVIEW_PAGE_SEED = {
  eyebrow: "Proof of Concept · внутренний прототип",
  title: "Дизайн-система",
  lead:
    "Внутренний прототип портала документации дизайн-системы. Контент редактируется в Payload; компоненты и превью — на базе Radix Themes и Storybook. Данные на странице — демо для проверки архитектуры, не финальные продуктовые гайды.",
  capabilitiesHeading: "Что уже работает",
  capabilities: [
    {
      text: "Каталог компонентов Web с документацией, Storybook-превью и props из ui-kit.",
    },
    {
      text: "Showcase блоков документации — как на реальной странице компонента.",
    },
    {
      text: "Разделы Text (глоссарий) и Brand с контентом из CMS.",
    },
    {
      text: "MCP для Cursor — документация компонента доступна агенту через Payload.",
    },
  ],
  stackHeading: "Стек",
  stackItems: [
    { label: "Next.js" },
    { label: "Payload CMS" },
    { label: "Radix Themes" },
    { label: "Storybook" },
    { label: "ui-kit" },
  ],
  navigationNote:
    "Навигация слева ведёт в каталог компонентов и справочник блоков документации. Контент редактируется в /admin. Для интерактивных превью запустите Storybook локально на порту 6006.",
  roadmapHeading: "Дальше",
  roadmap: [
    { text: "Подключить реальную Figma-библиотеку вместо демо-ссылки." },
    { text: "Заменить seed-компоненты на продуктовый каталог." },
    { text: "Добавить foundations: типографика, spacing, design tokens." },
    { text: "Вынести гайды по governance и версионированию, когда DS выйдет из PoC." },
  ],
  sourcesHeading: "Источники",
  sourcesIntro:
    "Ссылки на инструменты, с которыми работает команда. На этапе PoC часть URL — заглушки; замените их в Globals → «Ссылки на источники» или отредактируйте карточки ниже.",
  sourceItems: [] as DsOverviewSourceItemSeed[],
};

export function buildDsOverviewSourceItemsSeed(input: {
  figmaLibraryUrl: string;
  storybookUrl: string;
  documentationUrl: string;
  repositoryUrl: string;
}): DsOverviewSourceItemSeed[] {
  return [
    {
      label: "Storybook",
      description: "Интерактивные примеры компонентов.",
      href: input.storybookUrl,
      icon: "storybook",
      external: true,
    },
    {
      label: "GitHub",
      description: "Исходники портала, ui-kit и скриптов.",
      href: input.repositoryUrl,
      icon: "github",
      external: true,
    },
    {
      label: "Figma",
      description: "Демо-библиотека; замените на продуктовую Finam DS.",
      href: input.figmaLibraryUrl,
      icon: "figma",
      external: true,
    },
    {
      label: "Документация",
      description: "Внешние материалы и справочники.",
      href: input.documentationUrl,
      icon: "docs",
      external: true,
    },
    {
      label: "Payload Admin",
      description: "Редактирование контента портала.",
      href: "/admin",
      icon: "link",
      external: false,
    },
    {
      label: "Каталог компонентов",
      description: "Все Web-компоненты дизайн-системы.",
      href: PORTAL_COMPONENTS_WEB_PATH,
      icon: "link",
      external: false,
    },
    {
      label: "Блоки документации",
      description: "Демо всех блоков вкладки «Документация».",
      href: PORTAL_SHOWCASE_DOCUMENTATION_BLOCKS_PATH,
      icon: "link",
      external: false,
    },
  ];
}
