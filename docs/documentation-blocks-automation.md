# Автоматизация блоков документации (Payload → портал)

Какие блоки поля `documentation` у коллекции `components` можно убрать из ручного ввода в админке, откуда брать данные и что останется редакторским.

**Схема по умолчанию:** ui-kit / Storybook / репозиторий → CI генерирует JSON-артефакты → портал подставляет на страницу. Payload хранит только то, что нельзя вывести из кода.

| Статус | Значение |
|--------|----------|
| ✅ | Полностью автоматизируется — блок в Payload не нужен |
| 🟡 | Частично — база из кода, в CMS только override |
| ❌ | Не автоматизируется — остаётся ручной контент |

---

## Таблица: 13 блоков `components.documentation`

| # | `blockType` | Статус | Откуда брать автоматически | Что делать в Payload | Почему нельзя на 100% |
|---|-------------|--------|----------------------------|----------------------|------------------------|
| 1 | `propsTable` | ✅ | `props-manifest.json` из ui-kit (`npm run generate:props-manifest`) + JSDoc в TS | **Убрать блок.** Таблица рендерится через `ComponentApiFromUiKit` (`omitPropsTable: true` уже на странице) | — |
| 2 | `codeExample` | ✅ | `stories-manifest.json` из `*.stories.tsx` (`generate:stories-manifest`): код по `storyId`, превью по URL из каталога | **Убрать поле `code`.** Опционально только `storyId` / порядок, если список примеров не из каталога | Сложные story — override через `parameters.docs.source.code` в story-файле |
| 3 | `storybookEmbed` | ✅ | `portalPreviewCatalog` + `storybookStoryUrl()` — те же stories, что и для `codeExample` | **Убрать блок.** Превью+код в одном UI (`ComponentLiveDemos` + `PortalCollapsibleCodeBlock`) | Дублирует `codeExample` с `previewStorybookUrl` |
| 4 | `relComponents` | ✅ | Поле карточки `relatedComponents` (relationship) + превью `relatedPreviewLight/Dark` (`capture:related-previews` → `upload:related-previews`) | **Убрать блок.** Связи задаются один раз на карточке компонента, не в documentation | — |
| 5 | `resourceLinks` | 🟡 | Карточка: `figmaUrl`, `storybookUrl`, `docsUrl`; пакет: ссылка на npm / GitHub из `package.json` ui-kit | В CMS — только **доп.** ссылки (Confluence, RFC), если нет поля на карточке | Внешние URL не всегда есть в коде |
| 6 | `changelog` | 🟡 | `CHANGELOG.md` ui-kit или conventional commits / GitHub Releases в CI | В CMS — **редкие** пояснения к релизу, если CHANGELOG сухой | Смысл записей («breaking для дизайнеров») часто редакторский |
| 7 | `designTokens` | 🟡 | CSS-переменные / theme manifest из ui-kit (`radix-themes.css`, tokens JSON) | В CMS — группировка, «How to use», описания для дизайнеров | Имена токенов в коде ≠ как их объяснять в гайде |
| 8 | `motion` | 🟡 | Motion-токены из theme / CSS (`transition`, `duration`, easing) | В CMS — когда применять, примеры сценариев | Поведение анимации — продуктовый текст |
| 9 | `accessibility` | 🟡 | База: WAI-ARIA pattern URL по типу примитива (Dialog, Tabs…); клавиши — из Radix / React Aria docs | В CMS — **контекст продукта**: что означает для вашего UI, исключения | A11y для обёртки ≠ копипаста из спеки |
| 10 | `section` | ❌ | — | When to use, guidelines, списки с акцентами — **вручную** | Редакторский гайд, не выводится из типов |
| 11 | `doDont` | ❌ | — | Правила + опциональные скриншоты — **вручную** | Дизайн-решения и антипаттерны |
| 12 | `anatomy` | ❌ | — | Диаграмма (upload) + подписи частей — **вручную** (или sync из Figma вручную/полуавтоматом) | Нужен визуал из Figma, не из TS |
| 13 | `checklist` | ❌ | — | Чеклист для дизайнеров/разработчиков — **вручную** | Процесс команды, не API компонента |

> Блоки `propsTable`, `codeExample`, `storybookEmbed`, `relComponents` можно убрать из админки первыми — они дублируют код, stories или поля карточки.

---

## Вне блоков `documentation` (карточка `components`)

| Поле / секция | Статус | Источник | Ручной ввод |
|---------------|--------|----------|-------------|
| Таблица API | ✅ | `props-manifest.json` | Не нужен |
| Live preview + код | ✅ | Storybook + `stories-manifest.json` | Не нужен (только каталог stories в коде) |
| Related preview (картинки) | ✅ | Playwright + Storybook (`capture:related-previews`) | Не нужен |
| `relatedComponents` | 🟡 | Relationship в CMS | **Выбор связей** — автоматизировать нельзя, но без дублирования блока `relComponents` |
| `name`, `slug`, `description` | ❌ | — | Да |
| `status`, `statusNote`, `replacedBy` | ❌ | — | Да |
| `figmaUrl`, `storybookUrl` | 🟡 | Можно подставлять дефолты из catalog | URL Figma — обычно вручную |

---

## Целевой пайплайн (одна схема)

```
ui-kit (TS + JSDoc)     →  props-manifest.json
ui-kit / stories (CSF)  →  stories-manifest.json
Storybook + Playwright  →  related-preview media → Payload Media
CHANGELOG / theme       →  changelog + tokens (опционально)

Портал читает JSON + Media, Payload — только editorial-блоки
```

**В админке остаётся задавать вручную:**

- `section`, `doDont`, `anatomy`, `checklist`
- связи `relatedComponents` (без блока `relComponents`)
- статус, описание, Figma
- опциональные override для 🟡-блоков

**Из админки убирается:**

- `propsTable`
- `storybookEmbed`
- `codeExample` (поле `code`; весь блок — после внедрения manifest)
- `relComponents`

---

## Порядок внедрения

1. **Сделано:** `props-manifest` + игнор `propsTable` на странице.
2. **Следующий шаг:** `stories-manifest` + live demos без ручного кода.
3. **Затем:** Related из `relatedComponents`, без блока `relComponents`.
4. **Потом:** удалить slug’и из `COMPONENT_DOCUMENTATION_BLOCK_SLUGS` и почистить seed.
5. **Долго:** changelog / tokens / motion из репозитория с CMS override.

---

## Связанные файлы

| Что | Файл |
|-----|------|
| Схема блоков | `collections/componentDocumentationBlocks.ts` |
| Props из manifest | `lib/ui-kit/props-from-manifest.ts`, `components/portal/component-api-from-kit.tsx` |
| Live preview | `lib/portal/live-preview-blocks.ts`, `app/(portal)/components/web/[slug]/live-demos.tsx` |
| Каталог stories | `lib/storybook/portal-preview-catalog.ts` |
| Related previews | `scripts/capture-related-previews.ts`, `lib/payload/sync-related-preview-media.ts` |
