# Справочник: 24 блока документации

Таблица всех типов контент-блоков поля `documentation`: **`blockType`**, вид на портале (HTML) и реализация в Markdown (экспорт `/components/[slug].md`).

| Источник | Файл |
|----------|------|
| Схема blocks (Payload) | `collections/componentDocumentationBlocks.ts` |
| Рендер на портале | `app/(portal)/components/[slug]/documentation.tsx` → `DocumentationBlock` / `switch` |
| Markdown | `lib/markdown/documentation-block-to-markdown.ts` → `blockToMarkdown` / `documentationToMarkdown` |
| Lexical → MD | `lib/markdown/lexical-to-markdown.ts` |
| Сборка страницы `.md` | `lib/markdown/component-to-markdown.ts` |

**Коллекции:** полный набор (24) — `components`; подмножество (8) — `colors` ([`docs/collection-documentation-blocks.md`](collection-documentation-blocks.md)).

---

## Основная таблица (24 блока)

| # | `blockType` | Название в CMS | Как выглядит на портале | Реализация в Markdown |
|---|-------------|----------------|-------------------------|------------------------|
| 1 | `section` | Секция | Заголовок H3 с вертикальной полосой слева + абзац `body` (pre-wrap) | `mdHeading(2, heading)` + `mdParagraph(body)` → `## …` и текст |
| 2 | `doDont` | Do / Don't | Две карточки в сетке: зелёная «Делайте» (✓) и розовая «Не делайте» (×), списки пунктов | `### Do` + `mdBulletList(dos)`; `### Don't` + `mdBulletList(donts)` |
| 3 | `callout` | Заметка | Цветная плашка (info / warning / success), иконка, подпись тона и текст | Blockquote: ``> **{tone}:** {text}`` |
| 4 | `codeExample` | Пример кода (textarea) | «Окно» с точками macOS, подпись, `<pre><code>` с TSX из textarea | Опциональный абзац `title` + `mdFence(code, "tsx")` |
| 5 | `codeMonaco` | Код (Monaco / поле Code) | То же оформление, код из поля Payload `code` (`snippet`) | Опциональный `title` + `mdFence(snippet, "tsx")` |
| 6 | `richTextSection` | Rich Text (Lexical) | Заголовок блока + `<RichText>` (параграфы, списки, ссылки, жирный и т.д.) | `### title` + `lexicalToMarkdown(body)`; если пусто → `> [rich text]` |
| 7 | `propsTable` | Таблица пропсов | HTML-таблица: Имя, Тип, По умолч., Описание; опциональный заголовок H3 | `### title` + `mdGfmTable` с колонками как на портале |
| 8 | `resourceLinks` | Ссылки (array) | Заголовок «Ссылки», pill-кнопки с внешней ссылкой ↗ | `### Ссылки` + список `- [label](url)` |
| 9 | `mediaFigure` | Изображение (Upload) | `<figure>`: картинка на всю ширину, подпись в `figcaption` | `![caption](absoluteUrl)` + курсив `*caption*`; без populate URL — блок пропускается |
| 10 | `relColor` | Связь → Color | Карточка: цветной квадрат (hex), имя, monospace hex | `**name** · token: \`key\` · \`#hex\`` (без swatch-картинки) |
| 11 | `relIcon` | Связь → Icon | Карточка: превью 40×40 (Media), имя, slug | `**name** · \`slug\`` + при populate `![name](url)` |
| 12 | `geoPoint` | Point (координаты) | Подпись, координаты lng/lat, ссылка «Открыть на карте ↗» (OSM) | `**label`**, строка координат в backticks, `mdLink` на OpenStreetMap |
| 13 | `calendarDate` | Date | Карточка: заголовок + `<time>` в локали ru-RU или «Дата не задана» | `**title**` + ISO 8601 из `at` |
| 14 | `emailLine` | Email | Подпись (uppercase) + `mailto:` ссылка | `{label}: [email](mailto:…)` или только ссылка |
| 15 | `numberStat` | Number | Компактная метрика: метка + крупное число (tabular-nums) | `**label:** value` или только `value` |
| 16 | `radioPick` | Radio | Блок «Radio»: подпись режима (Быстро / Нормально / Точно) + hint | `**Режим:** {label} (\`mode\`)` + абзац hint |
| 17 | `multiSelect` | Select (несколько) | Теги в rounded pills + опциональная заметка | `Теги:` + `mdBulletList(tags)` + `note` |
| 18 | `flagBox` | Checkbox | Бейдж Да/Нет (зелёный/серый) + текст флага | GFM-task: `mdCheckbox(enabled, flagLabel)` → `- [x]` / `- [ ]` |
| 19 | `jsonBlock` | JSON | Заголовок + тёмный `<pre>` с JSON (emerald) | `### title` + `mdFence(safeJsonStringify(payload), "json")` |
| 20 | `groupStrip` | Group (вложенный объект) | Definition list: Название, Счётчик, Активно (Да/Нет) из `bundle` | `**Group**` + маркированный список трёх полей `gTitle`, `gCount`, `gOn` |
| 21 | `nestedStack` | Blocks внутри блока | «Вложенные blocks»: intro + нумерованный список строк | `mdParagraph(intro)` + `mdOrderedList` из дочерних `nestLine` |
| 22 | `namedTabsStrip` | Tabs (именованные) | Две колонки: «tabSummary.brief» и «tabDetail.detail» | `### Кратко` + brief; `### Подробно` + detail (tabs в MD развернуты в заголовки) |
| 23 | `divider` | Разделитель | Опциональная подпись (uppercase) + `<hr>` | Курсив `*caption*` + горизонтальная линия `---` |
| 24 | `quote` | Цитата | Блокquote с «ёлочками», текст и footer «— attribution» | `> body` + строка `— attribution` |
| 25 | `storybookEmbed` | Storybook (URL) | iframe с story (+ args из URL), ссылка «Открыть в Storybook» | `###` + ссылка; на портале не дублируется iframe в `.md` |

---

## Вложенный block (внутри `nestedStack`)

| `blockType` | Где используется | Название в CMS | Как выглядит на портале | Реализация в Markdown |
|-------------|------------------|----------------|-------------------------|------------------------|
| `nestLine` | Только внутри `nestedStack.items[]` | (без отдельной карточки в корневом Add) | Элемент `<ol><li>{line}</li></ol>` | Одна строка в `mdOrderedList` → `1. line` |

---

## Детали реализации Markdown

### Общие хелперы (`lib/markdown/md-utils.ts`)

| Функция | Назначение |
|---------|------------|
| `mdHeading` | Заголовки `#` … `####` |
| `mdParagraph` | Абзац, нормализация переносов |
| `mdJoin` | Склейка секций через `\n\n` |
| `mdFence` | Блок кода ` ```lang ` |
| `mdBulletList` / `mdOrderedList` | Списки |
| `mdGfmTable` | GFM-таблица с экранированием `\|` |
| `mdLink` | `[text](url)` |
| `mdCheckbox` | `- [x]` / `- [ ]` |

### Медиа и URL

- Абсолютные URL: `mediaAbsoluteUrl()` + `NEXT_PUBLIC_SITE_URL` (см. `.env.example`).
- Экспорт страницы: `GET /components/{slug}.md` → `middleware.ts` rewrite → `app/api/components/[slug]/markdown/route.ts`.

### `richTextSection` (⚠️)

Конвертер обходит дерево Lexical (`lib/markdown/lexical-to-markdown.ts`): paragraph, heading, text (bold/italic/code/strike), link, quote, list, linebreak. Сложная вёрстка без прямого аналога в MD может упроститься до текста дочерних узлов.

### Неизвестный `blockType`

| Портал | Markdown |
|--------|----------|
| Жёлтая плашка «Блок не отображается…» | ``> ⚠️ Блок `{blockType}` не поддержан в Markdown-экспорте.`` |

---

## Примеры фрагментов Markdown (кратко)

<details>
<summary><code>section</code></summary>

```markdown
## Заголовок

Текст секции.
```
</details>

<details>
<summary><code>callout</code></summary>

```markdown
> **warning:** Не используйте устаревший токен.
```
</details>

<details>
<summary><code>propsTable</code></summary>

```markdown
### API

| Имя | Тип | По умолч. | Описание |
|-----|-----|-----------|----------|
| variant | string | primary | Стиль |
```
</details>

<details>
<summary><code>flagBox</code></summary>

```markdown
- [x] Включить аналитику
```
</details>

---

## Связанные документы

- [`documentation-blocks-markdown.md`](documentation-blocks-markdown.md) — расширенные примеры и чеклист при добавлении block
- [`collection-documentation-blocks.md`](collection-documentation-blocks.md) — какие blocks доступны в `components` vs `colors`
