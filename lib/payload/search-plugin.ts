import { searchPlugin } from "@payloadcms/plugin-search";

import {
  buildPortalSearchRecord,
  PORTAL_SEARCH_COLLECTIONS,
} from "@/lib/payload/search/build-search-record";
import { normalizePortalSearchWhere } from "@/lib/payload/search/normalize-search-where";
import { portalSearchMatchScopeLabel } from "@/lib/payload/search/search-config";

export const portalSearchPlugin = searchPlugin({
  collections: [...PORTAL_SEARCH_COLLECTIONS],
  syncDrafts: false,
  deleteDrafts: true,
  localize: false,
  defaultPriorities: {
    "ds-pages": 100,
    components: 90,
    "brand-pages": 80,
    "glossary-terms": 70,
    colors: 60,
  },
  skipSync: ({ collectionSlug, doc }) => {
    if (collectionSlug === "ds-pages" && doc?._status === "draft") {
      return true;
    }
    return false;
  },
  beforeSync: buildPortalSearchRecord,
  searchOverrides: {
    labels: {
      singular: "Результат поиска",
      plural: "Поиск по порталу",
    },
    admin: {
      group: "Портал",
      defaultColumns: ["title", "area", "portalUrl", "priority"],
      listSearchableFields: ["searchText"],
      description:
        `Индекс для быстрого поиска по документации портала (${portalSearchMatchScopeLabel()}). Записи создаются автоматически при Publish/сохранении исходных коллекций. Кнопка Reindex — для первичной индексации.`,
    },
    hooks: {
      beforeOperation: [normalizePortalSearchWhere],
    },
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: "searchText",
        type: "textarea",
        index: true,
        admin: {
          hidden: true,
          readOnly: true,
          description: "Нормализованный текст для поиска (см. PORTAL_SEARCH_MATCH_SCOPE).",
        },
      },
      {
        name: "excerpt",
        type: "textarea",
        label: "Текст для поиска",
        admin: {
          readOnly: true,
          description: "Заголовки, описания и контент блоков документации.",
        },
      },
      {
        name: "portalUrl",
        type: "text",
        label: "URL на портале",
        admin: { readOnly: true },
      },
      {
        name: "area",
        type: "select",
        label: "Раздел",
        admin: { readOnly: true, position: "sidebar" },
        options: [
          { label: "DS · Overview", value: "ds" },
          { label: "Компоненты", value: "components" },
          { label: "Brand", value: "brand" },
          { label: "Text", value: "text" },
          { label: "Colors", value: "colors" },
        ],
      },
    ],
  },
});
