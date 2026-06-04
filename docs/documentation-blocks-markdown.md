# Блоки документации компонента → Markdown

Справочник по **24 типам blocks** поля `documentation` коллекций **`components`** и **`colors`** и тому, как каждый тип должен попадать в Markdown при экспорте (страница `.md`, API, MCP и т.д.).

**Сводная таблица (blockType · портал · Markdown):** [`documentation-blocks-reference.md`](documentation-blocks-reference.md)

**Источник схемы:** `collections/componentDocumentationBlocks.ts`  
**Аналог рендера на портале:** `app/(portal)/components/[slug]/documentation.tsx` (`switch` по `blockType`, ~стр. 57–548)

Принцип: **у каждого `blockType` свой маппер** — как в `documentation.tsx`, только выход — строка Markdown (GFM), а не JSX.

---

## Легенда покрытия

| Символ | Значение |
|--------|----------|
| ✅ | Полностью — все поля блока осмысленно переносятся в MD |
| ⚠️ | Частично — нужен доп. конвертер или упрощённый fallback |
| ❌ | Не задано / не реализовано |

---

## Сводная таблица (24 блока + вложенный `nestLine`)

| # | `blockType` | Покрытие | В Markdown | Комментарий |
|---|-------------|----------|------------|-------------|
| 1 | `section` | ✅ | `## heading` + абзац из `body` | Секция с вертикальной полосой на портале → обычный заголовок H2 |
| 2 | `doDont` | ✅ | `### Do` / списки `dos`, `### Don't` / `donts` | Два столбца на портале → два подзаголовка и маркированные списки |
| 3 | `callout` | ✅ | `> **{tone}:** {text}` | Blockquote; `tone`: `info` \| `warning` \| `success` |
| 4 | `codeExample` | ✅ | подпись + ` ```tsx ` | `caption` перед fence, `code` внутри |
| 5 | `codeMonaco` | ✅ | как code block из `snippet` | Язык по умолчанию `tsx`, если в CMS не задан |
| 6 | `richTextSection` | ⚠️ | Lexical JSON → MD | Нужен обход дерева Lexical (Payload или свой); без конвертера — plain text из узлов или `> [rich text]` |
| 7 | `propsTable` | ✅ | GFM-таблица `\| name \| type \| default \| description \|` | Опциональный `title` → `### {title}` |
| 8 | `resourceLinks` | ✅ | `- [label](url)` | Пустые `label`/`url` пропускать |
| 9 | `mediaFigure` | ✅ | `![caption](absoluteUrl)` + подпись | URL только после populate `image`; иначе пропуск или placeholder |
| 10 | `relColor` | ✅ | строка: имя, `tokenKey`, `#hex` | Связь с коллекцией цветов; swatch в MD опционально (`#hex` в тексте) |
| 11 | `relIcon` | ✅ | имя, slug, ссылки; `![](url)` если populate | Без `preview` — только текстовые поля |
| 12 | `geoPoint` | ✅ | `label` + координаты + ссылка OSM | `[lng, lat]` → ссылка `https://www.openstreetmap.org/...` |
| 13 | `calendarDate` | ✅ | `title` + ISO date | Поле `at` → ISO 8601 или локализованная строка + `<time>` в HTML-экспорте |
| 14 | `emailLine` | ✅ | `[email](mailto:…)` | Опциональный `label` перед ссылкой |
| 15 | `numberStat` | ✅ | `{label}: {value}` | Одна строка или definition list |
| 16 | `radioPick` | ✅ | `mode`, `hint` текстом | На портале подписи `fast`/`normal`/`precise` — в MD можно те же labels |
| 17 | `multiSelect` | ✅ | `tags` списком | Маркированный список или `` `tag` `` через запятую; `note` — абзац ниже |
| 18 | `flagBox` | ✅ | `- [x] label` или текст | `enabled` → checkbox GFM `- [x]` / `- [ ]` |
| 19 | `jsonBlock` | ✅ | ` ```json ` | `safeJsonStringify(payload)`; опциональный `title` → `###` |
| 20 | `groupStrip` | ✅ | поля `bundle` списком | `gTitle`, `gCount`, `gOn` — definition list или таблица 2 колонки |
| 21 | `nestedStack` | ✅ | `intro` + вложенные `nestLine` | См. вложенный тип ниже |
| 22 | `namedTabsStrip` | ✅ | `### Кратко` / `### Подробно` | `tabSummary.brief`, `tabDetail.detail` |
| 23 | `divider` | ✅ | `---` + optional caption | `caption` — строка над/под `---` курсивом |
| 24 | `quote` | ✅ | `> body` + attribution | `attribution` — строка `— author` под цитатой |

### Вложенный block (не отдельный тип в корневом массиве)

| `blockType` | Родитель | Покрытие | В Markdown | Комментарий |
|-------------|----------|----------|------------|-------------|
| `nestLine` | `nestedStack.items[]` | ✅ | нумерованный список | Каждый элемент: `1. {line}`; только внутри `nestedStack` |

---

## Примеры Markdown по типам

### 1. `section`

```markdown
## Заголовок секции

Текст body одним или несколькими абзацами (whitespace-pre-wrap как на портале).
```

### 2. `doDont`

```markdown
### Do

- Первый пункт
- Второй пункт

### Don't

- Антипаттерн
```

### 3. `callout`

```markdown
> **warning:** Не используйте устаревший API.
```

### 4. `codeExample`

```markdown
Базовый пример

```tsx
<Button variant="primary">Отправить</Button>
```
```

### 5. `codeMonaco`

```markdown
```tsx
// содержимое поля snippet
```
```

### 6. `richTextSection` ⚠️

Целевой вариант (после Lexical → MD):

```markdown
### Заголовок rich text

Абзац с **жирным** и [ссылкой](https://example.com).

- пункт списка
```

Fallback без конвертера:

```markdown
### Заголовок rich text

> [rich text — требуется конвертер Lexical]
```

### 7. `propsTable`

```markdown
### API

| Имя | Тип | По умолч. | Описание |
|-----|-----|-----------|----------|
| variant | `"primary" \| "secondary"` | `"primary"` | Визуальный стиль |
| disabled | `boolean` | `false` | Блокирует клик |
```

### 8. `resourceLinks`

```markdown
### Ссылки

- [Figma](https://figma.com/...)
- [Storybook](https://storybook.example/...)
```

### 9. `mediaFigure`

```markdown
![Подпись к изображению](https://example.com/media/photo.jpg)

*Подпись к изображению*
```

### 10. `relColor`

```markdown
**Primary** · token: `color.primary` · `#2563eb`
```

### 11. `relIcon`

```markdown
**ArrowRight** · `arrow-right`

![ArrowRight](https://example.com/icons/arrow-right.svg)
```

### 12. `geoPoint`

```markdown
**Офис**

Координаты: `37.61730, 55.75583` (lng, lat)

[Открыть на карте](https://www.openstreetmap.org/?mlat=55.75583&mlon=37.61730#map=14/55.75583/37.61730)
```

### 13. `calendarDate`

```markdown
**Релиз**

2026-05-19T14:00:00.000Z
```

### 14. `emailLine`

```markdown
Поддержка: [support@example.com](mailto:support@example.com)
```

### 15. `numberStat`

```markdown
Покрытие тестами: **87%**
```

### 16. `radioPick`

```markdown
**Режим:** Нормально (`normal`)

Подсказка: выберите скорость обработки.
```

### 17. `multiSelect`

```markdown
Теги:

- `react`
- `typescript`

Примечание: можно выбрать несколько.
```

### 18. `flagBox`

```markdown
- [x] Включить аналитику
```

или при `enabled: false`:

```markdown
- [ ] Включить аналитику
```

### 19. `jsonBlock`

```markdown
### Конфиг

```json
{
  "version": 1,
  "features": ["a", "b"]
}
```
```

### 20. `groupStrip`

```markdown
**Group**

- Название: Пакет A
- Счётчик: 42
- Активно: Да
```

### 21. `nestedStack` + `nestLine`

```markdown
Вводный текст блока.

1. Первая вложенная строка
2. Вторая вложенная строка
```

### 22. `namedTabsStrip`

```markdown
### Кратко

Краткое описание из tabSummary.brief.

### Подробно

Развёрнутое описание из tabDetail.detail.
```

### 23. `divider`

```markdown
*Раздел секций*

---
```

### 24. `quote`

```markdown
> Текст цитаты без кавычек-ёлочек в MD.

— Автор / источник
```

---

## Реализация (когда понадобится экспорт)

| Слой | Файл / место | Назначение |
|------|----------------|------------|
| Схема blocks | `collections/componentDocumentationBlocks.ts` | 24 slug + `nestLine` внутри `nestedStack` |
| Портал (HTML) | `documentation.tsx` | Эталон полей и поведения |
| Markdown | `lib/markdown/documentation-block-to-markdown.ts` (план) | `documentationToMarkdown(blocks)` + `lexicalToMarkdown` для #6 |
| Сборка страницы | `lib/markdown/component-to-markdown.ts` (план) | Метаданные компонента + blocks + опционально Storybook |

Порядок обхода: тот же, что в `documentation.tsx` — `blocks.map`, для каждого блока `switch (block.blockType)`, для `nestedStack` — рекурсия только по `items` с `blockType === "nestLine"`.

Неизвестный `blockType` в MD (как `default` на портале):

```markdown
> ⚠️ Блок `{blockType}` не поддержан в Markdown-экспорте.
```

---

## Связь с MCP и `showLLM`

- На портале и в админке рендерятся **все** blocks.
- Для MCP/LLM blocks с `showLLM: false` отфильтровываются (`lib/mcp/filter-documentation-for-llm.ts`) — в Markdown-экспорт для агента применять ту же фильтрацию, если экспорт предназначен для LLM.

---

## Чеклист при добавлении нового block

1. Добавить block в `componentDocumentationBlocks.ts` с `showLLM` (по умолчанию `true`).
2. Добавить ветку в `documentation.tsx`.
3. Добавить строку в таблицу этого файла + пример Markdown.
4. Добавить case в `documentation-block-to-markdown.ts` (когда модуль появится).
