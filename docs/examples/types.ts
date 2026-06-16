import type { Component as CmsComponent } from "@/payload-types";

/** Платформа реализации компонента */
export type ComponentFramework = "react" | "kotlin" | "swift" | "flutter";

/** Статус страницы реализации */
export type ComponentStatus = "stable" | "beta" | "deprecated";

type ComponentDocumentationBlock = NonNullable<CmsComponent["documentation"]>[number];

/**
 * Одна запись коллекции `components` =
 * одна страница портала /components/[slug] для одного фреймворка.
 */
export type Component = {
  id: number;

  /** Общий ключ концепта для группировки в sidebar (modal, button, snackbar) */
  familySlug: string;

  /** Платформа этой реализации */
  framework: ComponentFramework;

  /** Заголовок H1 на странице (может отличаться между платформами: Toast vs Snackbar) */
  name: string;

  /** Уникальный URL-сегмент: modal-react, toast-swift */
  slug: string;

  /** Лид под заголовком */
  description: string;

  status?: ComponentStatus | null;
  statusNote?: string | null;

  sortOrder?: number | null;

  figmaUrl?: string | null;
  storybookUrl?: string | null;
  docsUrl?: string | null;

  showTOC?: boolean | null;

  /** Связи — обычно в рамках того же framework */
  parentComponent?: number | Component | null;
  subcomponents?: (number | Component)[] | null;
  relatedComponents?: (number | Component)[] | null;
  replacedBy?: number | Component | null;

  /** Блоки документации (контент своей платформы) */
  documentation?: ComponentDocumentationBlock[] | null;

  folder?: number | null;
  updatedAt: string;
  createdAt: string;
};

/** Опционально: каноническое имя концепта, если name различается по платформам */
export type ComponentWithCanonicalName = Component & {
  canonicalName?: string | null;
};

/** Производный тип для sidebar (не хранится в CMS) */
export type SidebarComponentConcept = {
  familySlug: string;
  /** Имя в навигации */
  label: string;
  implementations: Array<{
    framework: ComponentFramework;
    slug: string;
    name: string;
    status: ComponentStatus;
  }>;
  aggregatedStatus: ComponentStatus | null;
  statusTooltip?: string;
};
