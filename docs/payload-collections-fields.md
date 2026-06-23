# Payload: поля коллекций и globals

Справочник полей документов Payload CMS в проекте портала дизайн-системы.

Источник схемы: `payload.config.ts`, `collections/*.ts`. Типы: `payload-types.ts`.

В колонке **Ghost** указано ближайшее поле из [Ghost Content API](https://ghost.org/docs/content-api/) (`Post`, `Page`, `User`, `Tag`, `Settings`). `—` — прямого аналога нет.

---

## Сопоставление с Ghost.org: принцип нейминга

Ghost отдаёт JSON в **snake_case** — стиль Ruby/REST, не JavaScript. Payload в схеме и типах использует **camelCase**.

| Паттерн Ghost | Примеры | Смысл |
|---------------|---------|--------|
| Суффикс `_at` | `created_at`, `updated_at`, `published_at` | ISO-дата/время события |
| Префикс `feature_` | `feature_image`, `feature_image_alt`, `feature_image_caption` | Обложка и подписи к ней |
| Префикс `meta_` | `meta_title`, `meta_description` | SEO в `<head>` |
| Префикс `og_` | `og_title`, `og_description`, `og_image` | Open Graph (соцсети) |
| Префикс `twitter_` | `twitter_title`, `twitter_image` | Twitter Card (отдельно от OG) |
| Префикс `custom_` | `custom_excerpt`, `custom_template` | Ручное переопределение автогенерируемого |
| Составные через `_` | `codeinjection_head`, `reading_time`, `canonical_url` | Одно понятие = одно имя, без вложенности |
| Булевы без `is_` | `featured`, `access` | Флаги без префикса |
| Контент одной строкой | `html`, `excerpt` | Тело поста/страницы — HTML, не blocks |

**Главное отличие моделей:** у Ghost основной контент — поле `html` (или `lexical` / `mobiledoc` в Admin API). У нас — типизированные `blocks[]` и relationship-поля под дизайн-систему; большая часть полей Ghost для блога/SEO не имеет прямых аналогов.

### Системные поля (общие для всех коллекций Payload)

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `id` | number/string | `id` | Post, Page, User, Tag |
| `createdAt` | datetime | `created_at` | Post, Page, User, Tag |
| `updatedAt` | datetime | `updated_at` | Post, Page, User, Tag |
| — | — | `uuid` | Post *(вторичный идентификатор, в Payload нет)* |
| — | — | `published_at` | Post, Page *(отдельная дата публикации)* |
| — | — | `url` | Post, Page, User, Tag *(канонический URL на фронте Ghost)* |

---

## Коллекции (10)

### 1. `users` — пользователи CMS

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `email` | text *(auth)* | `email` | User |
| `password` | password *(auth)* | — | *(не отдаётся в Content API)* |
| `firstName` | text | `name` | User *(у Ghost одно поле `name`)* |
| `lastName` | text | `name` | User |
| `role` | select | `roles` | User *(в Admin API; массив ролей)* |

---

### 2. `media` — файлы

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `alt` | text | `feature_image_alt` | Post, Page *(alt обложки, не отдельной сущности)* |
| `filename` | upload | — | *(внутреннее имя файла)* |
| `mimeType` | upload | — | — |
| `filesize` | upload | — | — |
| `width` | upload | — | — |
| `height` | upload | — | — |
| `url` | upload | `feature_image` / `og_image` / `profile_image` | Post, Page, User *(URL картинки на сущности)* |

---

### 3. `components` — карточки компонентов

Ближайшая сущность Ghost: **Post** (документ со slug, заголовком, excerpt и телом). Часть полей — только наш домен.

#### Вкладка «Карточка»

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `name` | text | `title` | Post |
| `slug` | text (unique) | `slug` | Post |
| `description` | textarea | `custom_excerpt` / `excerpt` | Post |
| `figmaUrl` | text | — | — |
| `storybookUrl` | text | — | — |
| `relatedPreviewLight` | upload → `media` | `feature_image` | Post *(обложка; у нас — превью related)* |
| `relatedPreviewDark` | upload → `media` | — | — |
| `docsUrl` | text | `canonical_url` | Post *(внешний канонический URL)* |
| `status` | select | `visibility` | Post *(другая семантика: public/members/paid)* |
| `statusNote` | textarea | — | — |
| `parentComponent` | relationship | — | — |
| `subcomponents` | relationship (many) | — | — |
| `relatedComponents` | relationship (many) | `tags` | Post *(слабая аналогия: связанные сущности)* |
| `replacedBy` | relationship | — | — |
| `showTOC` | checkbox | — | — |

#### Вкладка «Design checklist» → `designChecklist[]`

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `item` | relationship | — | — |
| `done` | checkbox | — | — |
| `note` | textarea | — | — |

#### Вкладка «Документация» → `documentation` (blocks)

Контейнер в Ghost: **`html`** (или `lexical` в новых версиях). Отдельных blockType в API нет.

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `showLLM` *(у каждого блока)* | checkbox | — | — |

| blockType | Поля Payload | Поле Ghost | Сущность Ghost |
|-----------|--------------|------------|----------------|
| `section` | `heading` | — *(заголовок внутри `html`)* | Post |
| `section` | `body` | `html` | Post |
| `section` | `items[]` → `label`, `description`, `accentColor`, `labelAsBadge` | `html` | Post |
| `propsTable` | `title`, `subtitle`, `rows[]` | — | — |
| `storybookEmbed` | `title`, `storybookUrl`, `frameHeight` | — | — |
| `codeExample` | `title`, `previewStorybookUrl`, `previewHeight`, `code`, `defaultCollapsed` | `codeinjection_head` / `codeinjection_foot` | Post *(инъекция кода, другая цель)* |
| `doDont` | `heading`, `intro`, `dos[]`, `donts[]` | `html` | Post |
| `accessibility` | `intro`, `patternLinkLabel`, `patternLinkUrl`, `keyboardRows[]` | `html` | Post |
| `relComponents` | `title`, `components` | `tags` / `primary_tag` | Post *(слабая аналогия)* |
| `designTokens` | `title`, `groups[]`, `rows[]` | — | — |
| `changelog` | `entries[]` | — | — |
| `anatomy` | `title`, `image`, `parts[]` | `html` + `feature_image` | Post |
| `checklist` | `title`, `items[]` | — | — |
| `resourceLinks` | `links[]` → `label`, `url` | `html` *(ссылки в разметке)* | Post |
| `motion` | `title`, `intro`, `tokens[]` | — | — |

---

### 4. `design-checklist-items` — справочник чеклиста

Ближайшая сущность Ghost: **Tag** (справочник с name/description).

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `title` | text | `name` | Tag |
| `description` | textarea | `description` | Tag |
| `category` | select | — | — |
| `sortOrder` | number | — | — |
| `isActive` | checkbox | — | *(у Tag есть `visibility`, другая семантика)* |

---

### 5. `colors` — цвета

Прямого типа в Ghost нет. Слабая аналогия — **Tag** (именованная сущность каталога).

#### Вкладка «Карточка»

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `name` | text | `name` | Tag |
| `tokenKey` | text | `slug` | Tag |
| `hex` | text | — | — |
| `sortOrder` | number | — | — |
| `caption` | textarea | `description` | Tag |

#### Вкладка «Документация» → `documentation` (blocks)

Те же 6 типов, что у `components`. Маппинг блоков — как в таблице `documentation` выше (`html` / `—`).

---

### 6. `icons` — иконки

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `name` | text | `name` | Tag |
| `slug` | text | `slug` | Tag |
| `preview` | upload → `media` | `feature_image` | Tag |
| `figmaUrl` | text | — | — |
| `storybookUrl` | text | — | — |
| `notes` | textarea | `description` | Tag |

---

### 7. `glossary-terms` — термины глоссария

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `preferred` | text | `name` | Tag *(предпочитаемый термин ≈ имя)* |
| `avoid` | text | — | — |
| `letter` | text *(auto)* | `slug` | Tag *(слабая аналогия: ключ группировки)* |

---

### 8. `brand-pages` — страницы `/brand/*`

Ближайшая сущность Ghost: **Page** (статическая страница со slug и SEO).

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `slug` | select | `slug` | Page |
| `sortOrder` | number | — | — |
| `title` | text | `title` | Page |
| `description` | textarea | `custom_excerpt` | Page |
| `intro` | textarea | `excerpt` | Page |
| `sections` | blocks | `html` | Page |
| `shareTitle` | text | `meta_title` / `og_title` | Page |
| `shareDescription` | textarea | `meta_description` / `og_description` | Page |

#### Вкладка «Палитра» *(только `slug === "color"`)*

| Поле Payload | Поле Ghost | Сущность Ghost |
|--------------|------------|----------------|
| `hierarchyBase.title` | — | — |
| `hierarchyBase.description` | `excerpt` | Page |
| `hierarchyBase.tokens[]` → `name`, `hex` | — | — |
| `hierarchySemantic.*` | — | — |
| `hierarchyComponent.*` | — | — |
| `hierarchyMappings[]` → `from`, `to` | — | — |
| `semanticsSections[]` → `title`, `body`, `items[]` | `html` | Page |
| `semanticsNamingParts[]` | — | — |
| `semanticsExamples[]` | — | — |
| `componentTokensIntro[]` | `html` | Page |
| `componentTokensNamingParts[]` | — | — |
| `componentTokensExamples[]` | — | — |
| `gradients[]` → `gradientId`, `title`, `angle`, `stops[]` | — | — |
| `chartPaletteLightLabel` | — | — |
| `chartPaletteLight[]` → `hex`, `rgb`, `name` | — | — |
| `chartPaletteDarkLabel` | — | — |
| `chartPaletteDark[]` | — | — |

#### Блоки `sections` (brand-pages)

| blockType | Поля Payload | Поле Ghost | Сущность Ghost |
|-----------|--------------|------------|----------------|
| `contentBlocks` | `sectionId`, `heading`, `blocks[]` | `html` | Page |
| `contentAccordion` | `sectionId`, `items[]` | `html` | Page |
| `typographyScale` | `sectionId`, `heading`, `groups[]` | `html` | Page |
| `fontSetup` | `sectionId`, `heading`, `downloadHref`, `cssCode`… | `html` + `codeinjection_head` | Page |
| `colorSystem` | `sectionId`, `heading` | `html` | Page |
| `colorGradients` | `sectionId`, `heading` | `html` | Page |
| `colorChartPalette` | `sectionId`, `heading` | `html` | Page |
| `logoBackgroundGrid` | `sectionId`, `heading`, `rules[]` | `html` + `feature_image` | Page |
| `logoClearspace` | `sectionId`, `heading`, `items[]` | `html` | Page |
| `logoMisuseGrid` | `sectionId`, `heading`, `intro`, `items[]` | `html` + `feature_image` | Page |

#### Вложенные `blocks[]` (контент)

| blockType | Поля Payload | Поле Ghost | Сущность Ghost |
|-----------|--------------|------------|----------------|
| `subheading` | `text` | `html` *(`<h3>` и т.д.)* | Page |
| `paragraph` | `text` | `html` *(`<p>`)* | Page |
| `list` | `items[]` → `text` | `html` *(`<ul>`/`<li>`)* | Page |
| `figure` | `src`, `alt` | `feature_image`, `feature_image_alt` | Page |

---

### 9. `notes` — заметки (демо)

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `title` | text | `title` | Post |
| `body` | textarea | `html` | Post |

---

### 10. `field-showcase` — справочник типов полей Payload

Демо-коллекция Payload; в Ghost аналога нет.

| Поле Payload | Тип | Поле Ghost | Сущность Ghost |
|--------------|-----|------------|----------------|
| `title` | text | `title` | Post *(формально)* |
| `demoText` | text | `title` | Post |
| `demoTextarea` | textarea | `custom_excerpt` | Post |
| `demoNumber` | number | `reading_time` | Post *(число, другая семантика)* |
| `demoCheckbox` | checkbox | `featured` | Post |
| `demoEmail` | email | `email` | User |
| `demoDate` | date | `published_at` | Post |
| `demoRadio` | radio | — | — |
| `demoSelect` | select (hasMany) | `visibility` | Post |
| `demoCode` | code | `codeinjection_head` | Post |
| `demoJson` | json | — | — |
| `demoPoint` | point | — | — |
| `demoRichText` | richText | `html` / `lexical` | Post |
| `demoRelationship` | relationship → `colors` | `primary_tag` / `tags` | Post |
| `demoUpload` | upload → `media` | `feature_image` | Post |
| `demoArray[]` → `label`, `count` | array | — | — |
| `demoGroup` → `groupTitle`, `groupNote` | group | — | — |
| `demoBlocks[]` | blocks | `html` / `mobiledoc` | Post |
| `tabMeta` → `metaSlug` | group | `slug` | Post |
| `tabMetrics` → `score` | group | — | — |

---

## Globals (5)

В Ghost ближе всего **Settings** (единый объект настроек сайта) и SEO-поля на **Post** / **Page**.

### `portal-sources` — ссылки в шапке

| Поле Payload | Поле Ghost | Сущность Ghost |
|--------------|------------|----------------|
| `figmaLibraryUrl` | — | — |
| `storybookUrl` | — | — |
| `documentationUrl` | — | — |
| `repositoryUrl` | — | *(у Settings есть `url` сайта, не произвольные ссылки)* |

### `portal-seo` — SEO / OG

| Поле Payload | Поле Ghost | Сущность Ghost |
|--------------|------------|----------------|
| `siteName` | `title` | Settings |
| `titleDefault` | `meta_title` | Settings |
| `titleTemplate` | — | — |
| `defaultDescription` | `description` | Settings |
| `locale` | `lang` | Settings |
| `defaultOgImage` | `cover_image` / `og_image` | Settings, Post |
| `homeShareTitle` | `og_title` | Post *(для главной)* |
| `homeShareDescription` | `og_description` | Post |
| `homeShareImage` | `og_image` | Post |
| `catalogWebShareTitle` | `og_title` | Page |
| `catalogWebShareDescription` | `og_description` | Page |
| `catalogWebShareImage` | `og_image` | Page |
| `showcaseShareTitle` | `og_title` | Page |
| `showcaseShareDescription` | `og_description` | Page |
| `showcaseShareImage` | `og_image` | Page |

### `text-glossary` — тексты `/text/glossary`

| Поле Payload | Поле Ghost | Сущность Ghost |
|--------------|------------|----------------|
| `title` | `title` | Page |
| `intro` | `excerpt` | Page |
| `principlesHeading` | — *(заголовок в `html`)* | Page |
| `principles[]` → `text` | `html` | Page |
| `principlesFooter` | `html` | Page |
| `termsSectionHeading` | — *(заголовок в `html`)* | Page |
| `shareTitle` | `meta_title` | Page |
| `shareDescription` | `meta_description` | Page |

### `brand-overview` — тексты `/brand`

| Поле Payload | Поле Ghost | Сущность Ghost |
|--------------|------------|----------------|
| `title` | `title` | Page |
| `intro` | `excerpt` | Page |
| `shareTitle` | `meta_title` | Page |
| `shareDescription` | `meta_description` | Page |

### `ds-overview` — тексты `/ds`

| Поле Payload | Поле Ghost | Сущность Ghost |
|--------------|------------|----------------|
| `eyebrow` | — *(надзаголовок в `html`)* | Page |
| `title` | `title` | Page |
| `lead` | `excerpt` | Page |
| `capabilitiesHeading` | — | Page |
| `capabilities[]` → `text` | `html` | Page |
| `stackHeading` | — | Page |
| `stackItems[]` → `label` | `html` | Page |
| `navigationNote` | `html` | Page |
| `roadmapHeading` | — | Page |
| `roadmap[]` → `text` | `html` | Page |
| `sourcesHeading` | — | Page |
| `sourcesIntro` | `excerpt` | Page |
| `sourceItems[]` → `label`, `description`, `href` | `html` | Page |
| `sourceItems[]` → `icon` | — | — |
| `sourceItems[]` → `external` | — | — |

---

## Сводка: сущность → портал

| Сущность | slug | Где на портале | Ближайший тип Ghost |
|----------|------|----------------|---------------------|
| Коллекция | `users` | `/admin` | User |
| Коллекция | `media` | превью, OG, upload | URL на Post/Page/User |
| Коллекция | `components` | `/ds/components/web/[slug]` | Post |
| Коллекция | `design-checklist-items` | чеклист на странице компонента | Tag |
| Коллекция | `colors` | `/ds/colors/[id]` | Tag *(слабо)* |
| Коллекция | `icons` | (задел) | Tag *(слабо)* |
| Коллекция | `glossary-terms` | `/text/glossary` | Tag *(слабо)* |
| Коллекция | `brand-pages` | `/brand/[slug]` | Page |
| Коллекция | `notes` | демо | Post |
| Коллекция | `field-showcase` | только админка | — |
| Global | `portal-sources` | шапка портала | Settings *(частично)* |
| Global | `portal-seo` | meta / OG | Settings + Post/Page SEO |
| Global | `text-glossary` | тексты глоссария | Page |
| Global | `brand-overview` | `/brand` | Page |
| Global | `ds-overview` | `/ds` | Page |
