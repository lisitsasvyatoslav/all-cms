import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { nestedDocsPageTreePlugin } from "payload-nested-docs-page-tree";

import { portalSearchPlugin } from "@/lib/payload/search-plugin";

import { PORTAL_BASE_PATH } from "@/lib/portal/core/portal-base-path";
import { DS_INTRODUCTION_SLUG } from "@/lib/portal/ds-pages/paths";
import { componentAgentMcpTools } from "@/lib/mcp/components-agent";
import { composeAgentMcpTools } from "@/lib/mcp/compose-agent";
import { createMcpOverrideAuth } from "@/lib/mcp/demo-mcp-access";

export const payloadPlugins = [
  portalSearchPlugin,
  nestedDocsPlugin({
    collections: ["ds-pages"],
    generateLabel: (_, doc) => String(doc.title ?? doc.slug ?? "Страница"),
    generateURL: (docs) => {
      if (docs.length === 1 && docs[0]?.slug === DS_INTRODUCTION_SLUG) {
        return PORTAL_BASE_PATH;
      }
      return docs.reduce((url, doc) => `${url}/${String(doc.slug)}`, PORTAL_BASE_PATH);
    },
  }),
  nestedDocsPageTreePlugin({
    collections: ["ds-pages"],
    homeIndicator: false,
  }),
  mcpPlugin({
    overrideAuth: createMcpOverrideAuth(),
    mcp: {
      tools: [...componentAgentMcpTools, ...composeAgentMcpTools],
      handlerOptions: {
        verboseLogs: process.env.NODE_ENV === "development",
      },
    },
    collections: {
      components: {
        description:
          "Radix Themes UI compose. User says «Через finam-design-system» or Figma URL + «собери макет» with this server → agent uses composeUi (Radix only). No manual HTML. Docs → getComponent / listComponentsFull.",
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
      "glossary-terms": {
        description: "Термины глоссария для страницы /text/glossary.",
        enabled: { find: true, create: true, update: true, delete: true },
      },
      "brand-pages": {
        description:
          "Страницы раздела /brand: логотипы, иконки, типографика, палитра, визуальный стиль.",
        enabled: { find: true, create: true, update: true, delete: true },
      },
      "ds-pages": {
        description: "Вложенные страницы /ds/* с деревом в админке.",
        enabled: { find: true, create: true, update: true, delete: true },
      },
    },
    globals: {
      "portal-sources": {
        description: "Глобальные ссылки: Figma library, Storybook, документация, репозиторий.",
        enabled: { find: true, update: true },
      },
      "portal-seo": {
        description: "SEO и Open Graph: title, description, og:image для страниц портала.",
        enabled: { find: true, update: true },
      },
      "text-glossary": {
        description: "Тексты страницы /text/glossary: заголовок, принципы, SEO.",
        enabled: { find: true, update: true },
      },
      "brand-overview": {
        description: "Тексты страницы /brand (обзор): заголовок, intro, SEO.",
        enabled: { find: true, update: true },
      },
      "ds-overview": {
        description: "Тексты главной /ds: обзор PoC и карточки источников.",
        enabled: { find: true, update: true },
      },
    },
  }),
];
