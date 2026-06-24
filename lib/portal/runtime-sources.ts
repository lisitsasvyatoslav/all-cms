/**
 * Runtime-источники данных портала.
 *
 * | Данные | Источник |
 * |--------|----------|
 * | Nav, каталог, documentation blocks, brand, glossary | Payload CMS |
 * | API Reference (props) | `@next-app/ui-kit/props-manifest.json` |
 *
 * Bootstrap (`lib/portal/bootstrap/`) — только seed и codegen, не для страниц.
 */

export const PORTAL_RUNTIME_DATA_SOURCES = {
  cms: "payload",
  componentProps: "ui-kit-props-manifest",
} as const;
