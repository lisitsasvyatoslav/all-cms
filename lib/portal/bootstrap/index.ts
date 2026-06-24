/**
 * Bootstrap-only данные портала: seed, codegen, Storybook.
 *
 * Runtime (страницы, markdown API, MCP-ответы с сайта):
 * - контент компонентов → Payload CMS (`components`)
 * - API Reference props → `packages/ui-kit/props-manifest.json`
 *
 * Не импортировать этот модуль из `app/(portal)/`, `components/portal/` и runtime loaders.
 */

export {
  componentCodeSnippetsBySlug,
  type BootstrapPropRow,
  type ComponentCodeSnippets,
} from "./component-code-snippets";
export {
  codeSnippetDocumentationBlocks,
  propsTableRowsForSlug,
  propsTableRowsFromSnippets,
} from "./code-snippets-to-blocks";
export {
  buildRadixComponentSeeds,
  componentFolderNameForSlug,
  type ComponentSeedRow,
} from "./component-seeds";
export {
  RADIX_THEMES_CATALOG,
  radixThemesDocsUrl,
  type RadixThemesCatalogEntry,
} from "./radix-themes-catalog";
