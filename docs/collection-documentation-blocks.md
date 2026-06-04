# Блоки «Документация» по коллекциям

В Payload у поля `type: "blocks"` список доступных типов задаётся **отдельным массивом `blocks` на каждую коллекцию** — в модалке «Add Documentation» редактор видит только разрешённые карточки.

Конфиг: `collections/componentDocumentationBlocks.ts`, подключение в `payload.config.ts`.

## `components` — все 24 блока

`documentationBlocksForComponents` (= полный массив `allDocumentationBlocks`).

| # | slug |
|---|------|
| 1–24 | `section`, `doDont`, `callout`, `codeExample`, `codeMonaco`, `richTextSection`, `propsTable`, `resourceLinks`, `mediaFigure`, `relColor`, `relIcon`, `geoPoint`, `calendarDate`, `emailLine`, `numberStat`, `radioPick`, `multiSelect`, `flagBox`, `jsonBlock`, `groupStrip`, `nestedStack` (+ вложенный `nestLine`), `namedTabsStrip`, `divider`, `quote` |

## `colors` — 8 блоков

`documentationBlocksForColors` — подмножество через `COLORS_DOCUMENTATION_BLOCK_SLUGS`:

| # | slug | Зачем для цвета |
|---|------|-----------------|
| 1 | `section` | Заголовок и текст (роль токена, контраст) |
| 2 | `callout` | Заметки (a11y, ограничения) |
| 3 | `richTextSection` | Форматированное описание |
| 4 | `codeExample` | Примеры CSS / theme / Tailwind |
| 5 | `doDont` | Правила использования в UI |
| 6 | `resourceLinks` | Figma, спеки, внешние гайды |
| 7 | `mediaFigure` | Скриншоты, примеры на фоне |
| 8 | `relColor` | Связанные цвета палитры |

## Добавить коллекцию или изменить набор

1. В `componentDocumentationBlocks.ts` объявить константу slug’ов, например `ICONS_DOCUMENTATION_BLOCK_SLUGS`.
2. Экспортировать `documentationBlocksForIcons = pickDocumentationBlocks(...)`.
3. В `payload.config.ts` у поля `documentation` указать `blocks: documentationBlocksForIcons`.

Порядок slug’ов в массиве = порядок карточек в группах админки (группы `admin.group` у каждого block не меняются).

## Портал и старые данные

Рендер на портале (`documentation.tsx`) обрабатывает **все** типы блоков. Если в БД у цвета остался блок, который больше нельзя добавить в админке, он по-прежнему отобразится; новые записи такого типа создать нельзя.

## Новая коллекция с тем же полным набором

```ts
blocks: documentationBlocksForComponents,
```

## Новая коллекция с кастомным набором

```ts
const MY_SLUGS = ["section", "callout", "divider"] as const;
export const documentationBlocksForMyCollection =
  pickDocumentationBlocks(MY_SLUGS);
```

(функция `pickDocumentationBlocks` можно экспортировать из того же файла при необходимости.)
