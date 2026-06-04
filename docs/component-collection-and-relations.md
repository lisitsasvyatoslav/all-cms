# Коллекция `components`: поля и связи с другими объектами

Спецификация для портала дизайн-системы (Payload CMS + Next.js).  
Конфиг: `payload.config.ts`, блоки: `collections/componentDocumentationBlocks.ts`.

---

## 1. Все поля записи `components`

### Вкладка «Карточка» (метаданные страницы)

| Поле | Тип Payload | Обяз. | Статус | Назначение |
|------|-------------|-------|--------|------------|
| `name` | text | да | **есть** | Заголовок H1 на портале |
| `slug` | text (unique) | да | **есть** | URL `/components/[slug]` |
| `description` | textarea | нет | **есть** | Лид под заголовком |
| `figmaUrl` | text | нет | **есть** | Ссылка Figma |
| `storybookUrl` | text | нет | **есть** | Дефолтная story (кнопка в шапке) |
| `docsUrl` | text | нет | **есть** | Внешняя или внутренняя дока |
| `status` | select | нет | **есть** | `stable` \| `beta` \| `deprecated` \| `draft` |
| `statusNote` | textarea | нет | **есть** | Текст бейджа / предупреждения |
| `parentComponent` | relationship → `components` | нет | **есть** | Родитель (отдельная страница) |
| `subcomponents` | relationship → `components` (many) | нет | **есть** | Дочерние страницы («состоит из») |
| `relatedComponents` | relationship → `components` (many) | нет | **есть** | Смежные компоненты |
| `replacedBy` | relationship → `components` | нет | **есть** | Замена при `deprecated` |
| `showTOC` | checkbox | нет | план | Показывать оглавление справа (default `true`) |
| `sortOrder` | number | нет | план | Порядок в каталоге / related |
| `relationsMeta` | json (read-only) | нет | план | Автопредложения связей (источник, дата) |
| `relationsLocked` | checkbox | нет | план | Не перезаписывать связи скриптом |

### Вкладка «Документация»

| Поле | Тип | Статус | Назначение |
|------|-----|--------|------------|
| `documentation` | blocks (25 типов) | **есть** | Контент страницы; порядок = порядок на портале |

Полный список block types: `docs/documentation-blocks-reference.md`, подмножество для `colors`: `docs/collection-documentation-blocks.md`.

### Системное (Payload)

| | |
|--|--|
| `folder` | Папка в админке (`folders: true`) |
| `id`, `createdAt`, `updatedAt` | Служебные |

### Связи с **другими коллекциями** (не component↔component)

Через блоки в `documentation`, не поля карточки:

| Блок | Связь с |
|------|---------|
| `relColor` | `colors` |
| `relIcon` | `icons` |

### Subparts (части одного компонента, не отдельные страницы)

**Не** relationship на `components`. Phase 2:

- поле `partName` в блоке `propsTable`, или
- блок `compositeParts` (Modal.Root, Modal.Dialog…).

---

## 2. Реализация «связи с другими объектами»

### Два типа связей

```
A. Страница ↔ страница     → поля relationship на «Карточке»
B. Части одной страницы    → blocks (propsTable + partName)
```

### MVP (сделано в CMS / seed)

1. Поля `parentComponent`, `subcomponents`, `relatedComponents`, `replacedBy`, `status`, `statusNote` в `payload.config.ts`.
2. В админке — выбор **только** из коллекции `components` (селект / мультиселект).
3. Seed: примеры связей Button ↔ Link, Input, Badge — `scripts/seed-portal.ts` → `applyComponentRelations`.

### Следующие шаги (портал + автоматика)

| Шаг | Что |
|-----|-----|
| Портал | Секции «Состоит из», «Связанные», «Входит в», баннер deprecated + `replacedBy` на `/components/[slug]` |
| Markdown / MCP | Ссылки на связанные slug в `.md` и `listComponentsFull` |
| `sync:relations` | Скрипт: imports + папка → `relatedComponents` только в **пустые** поля; `relationsMeta` |
| Hook | `parentComponent` ↔ `subcomponents` согласовать при save |
| Subparts | `partName` в `propsTable` для составных компонентов |

### Ручная работа vs автоматизация

| Поле / задача | Редактор | Автоматизация |
|---------------|----------|----------------|
| `subcomponents`, `parentComponent` | **да** (смысл DS) | только подсказки / hook после ручного child |
| `relatedComponents` | правка | **imports**, соседи в folder → черновик |
| `replacedBy`, `status: deprecated` | **да** | нет |
| `relColor`, `relIcon` в blocks | **да** | нет |
| subparts (`partName`) | **да** / dev | опционально из TS/Storybook |
| name, slug, 50 записей | минимум | **sync:components** из репо |
| storybookUrl, `storybookEmbed` | минимум | из `*.stories.tsx` |
| propsTable | вычитка | из TypeScript / argTypes |

---

## 3. Референсы дизайн-систем (6 систем)

Матрица (из исследования):

| Система | Subcomponents / иерархия | Related | Alternatives / deprecated | Как задаётся |
|---------|---------------------------|---------|---------------------------|--------------|
| Spectrum | нет явной | нет | в тексте | implicit |
| Ant Design | категории в sidebar | ссылки внизу страницы | variant в API | sidebar + inline |
| Atlassian | **явное дерево** (Button → Icon button…) | нет раздела | legacy рядом | URL + sidebar |
| Radix UI | **subparts** в Anatomy | нет | разные страницы (Dialog vs AlertDialog) | одна страница, части |
| Base UI | subparts + Custom APIs | нет явного | Usage (Dialog vs Drawer) | одна страница |
| HeroUI | subparts + API на part | **карточки внизу** + prev/next | отдельные страницы | Anatomy + related UI |

### Где реализовано **оптимальнее всего**

| Задача | Лучший референс | Что брать |
|--------|-----------------|-----------|
| **Связи между страницами** (родитель, дети, соседи) | **Atlassian** | `parentComponent` + `subcomponents`, дерево в навигации |
| **Related на странице** (карточки) | **HeroUI** | `relatedComponents` + UI внизу страницы |
| **Deprecated → замена** | **Ant Design** + **Atlassian** | `status` + `replacedBy` + баннер |
| **Subparts на одной странице** | **HeroUI** (полнота), **Radix/Base UI** (проще) | `propsTable` + `partName`, не отдельные CMS-страницы |
| **Всё вместе на одной странице** | **HeroUI** | эталон UX; больше всего работы в портале |

**Итог:** для Payload-портала с редакторами — **модель полей как Atlassian + UI related как HeroUI**; subparts — как **Radix/HeroUI** внутри `documentation`.

**Spectrum** для этой темы слабый ориентир.

---

## 4. Пример записи (целевое состояние)

```json
{
  "name": "Button",
  "slug": "button",
  "status": "stable",
  "description": "Триггер действия…",
  "parentComponent": null,
  "subcomponents": [{ "slug": "link", "name": "Link" }],
  "relatedComponents": [
    { "slug": "input", "name": "Input" },
    { "slug": "badge", "name": "Badge" }
  ],
  "replacedBy": null,
  "documentation": [ "…blocks…" ]
}
```

Демо в БД после `npm run seed:portal`: `button`, `input`, `link`, `badge`.

---

## 5. Связанные файлы

| Файл | Роль |
|------|------|
| `payload.config.ts` | Поля коллекции |
| `collections/componentDocumentationBlocks.ts` | Типы blocks |
| `scripts/seed-portal.ts` | Демо-данные и связи |
| `lib/mcp/filter-documentation-for-llm.ts` | MCP без лишних blocks |
| `app/(portal)/components/[slug]/page.tsx` | Страница портала (рендер связей — TODO) |
