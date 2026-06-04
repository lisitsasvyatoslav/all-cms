# MCP: ограничение полей коллекции `components` для агента

Документ фиксирует выбранный подход к тому, как Cursor (и другие MCP-клиенты) читают компоненты дизайн-системы из Payload **без** тяжёлого `documentation` (blocks) и служебных данных.

Связанные материалы: архитектура RAG (`payload_rag_architecture.docx`), конфиг `payload.config.ts` (коллекция `components`, `mcpPlugin`).

---

## Суть

**Ограничение на этапе запроса**, а не только на выходе MCP.

Агент вызывает **кастомные MCP-tools** (`getComponent`, `listComponents`), внутри которых `payload.find` выполняется с жёстким `select` — только поля карточки (`name`, `slug`, `description`, ссылки). Поле `documentation` дополнительно закрыто для MCP через `access.read` на поле.

Стандартный `findComponents` для коллекции `components` **отключается**, чтобы нельзя было обойти узкий контракт.

```
Cursor → getComponent({ slug })
      → payload.find({ select: { name, slug, … } })  // запрос урезан
      → access.read: documentation недоступно для MCP
      → JSON только карточки → агент
```

Портал (`/components/[slug]`) и админка по-прежнему читают полный документ с blocks — условие `req.payloadAPI !== 'MCP'`.

---

## Почему именно такой способ (контекст нашей задачи)

### Что у нас есть

| Часть системы | Роль |
|---------------|------|
| Коллекция `components` | Карточка (name, slug, описание, ссылки) + вкладка `documentation` (много blocks) |
| Портал Next.js | Рендер полной документации на сайте |
| Payload MCP | Агент в Cursor отвечает на вопросы по UI-kit |
| Планируемый RAG | Отдельный pipeline (sync, chunking, vector DB) — **не через сырой MCP find** |

### Проблема

Сырой `findComponents` отдаёт весь документ: blocks JSON, внутренние id блоков, большой объём. Это:

- сжигает контекст модели;
- усложняет ответы («варианты кнопок» теряются в шуме);
- не совпадает с архитектурным документом RAG: агенту нужен **отдельный контракт**, а не копия CMS.

### Почему не другие варианты

| Вариант | Почему не основной для нас |
|---------|----------------------------|
| Только `select` в arguments `findComponents` | Модель может не передать — нет гарантии |
| Только `overrideResponse` | Документ уже прочитан из БД целиком; это ограничение **на выходе**, не на запросе |
| `afterRead` без условия | Режет данные и для портала/API |
| Один `findComponents` + промпт «не читай documentation» | Не enforcement |
| Whitelist в `mcpPlugin({ fields: [...] })` | В текущей версии плагина такой опции нет |
| Сразу RAG вместо MCP | RAG — для семантического поиска по чанкам; Cursor MCP — для структурированных карточек и CMS-фактов |

### Почему кастомный tool + `select` + `access.read`

1. **Совпадает с docx по RAG/агенту** — отдельная «поверхность для агента» (аналог `/for-agent`), а не полная схема CMS.
2. **Ограничение на запросе** — `documentation` не загружается в память при корректном `select` и field access.
3. **Предсказуемый контракт** — агент видит только карточку; вопросы вроде «какие варианты кнопок» опираются на `description` и код, не на мегабайт blocks.
4. **Портал не ломается** — условие только для `payloadAPI === 'MCP'`.
5. **Просто сопровождать** — один файл с `MCP_COMPONENT_SELECT`, два tool, `find: false` для `components`.

---

## Реализация (план)

Код в репозитории может быть ещё не внедрён; ниже — целевая структура.

### 1. Константа полей

Файл: `lib/mcp/components-agent.ts`

```ts
export const MCP_COMPONENT_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  figmaUrl: true,
  storybookUrl: true,
  docsUrl: true,
} as const;
```

### 2. Field access на `documentation`

В `Components`, на поле `documentation`:

```ts
access: {
  read: ({ req }) => req.payloadAPI !== "MCP",
},
```

### 3. Кастомные MCP-tools

В `mcpPlugin({ mcp: { tools: [...] } })`:

- `getComponent` — `find` по `slug` или `id`, `select: MCP_COMPONENT_SELECT`, `depth: 0`, `overrideAccess: false`.
- `listComponents` — список с тем же `select` и лимитом.

Для `components` в `collections`:

```ts
enabled: { find: false, create: false, update: false, delete: false },
description: "Используй getComponent / listComponents.",
```

### 4. API key (админка)

- **MCP → API Keys** — включить custom tools `getComponent`, `listComponents`.
- Пользователь ключа — роль с `read` на `components` (`admin` / `pm` по текущему `access`).

### 5. Проверка

1. Перезапуск dev-сервера.
2. Вызов `getComponent` с `slug: "button"`.
3. В ответе нет `documentation`, есть только поля из whitelist.

### Опциональная подстраховка

Если позже снова включить `findComponents`:

- `beforeOperation` при `req.payloadAPI === 'MCP'` — принудительный `select`;
- `overrideResponse` с тем же whitelist.

Для выбранного оптимума **не обязательно**, если `find` для `components` выключен.

---

## Плюсы и минусы

### Плюсы

| Плюс | Пояснение |
|------|-----------|
| Ограничение на запросе | Меньше данных из БД и RAM, не тянем blocks |
| Жёсткий контракт | Агент не обходит через `findComponents` |
| Согласованность с RAG-doc | Отдельная поверхность для агента, не сырая CMS |
| Портал целый | Полный `documentation` только вне MCP |
| Двойная защита | `select` + `access.read` на `documentation` |
| Меньше токенов | Ответы MCP компактные |
| Без форка плагина | Стандартный `mcpPlugin` + tools |

### Минусы

| Минус | Пояснение |
|-------|-----------|
| Дополнительный код | Константа, два tool, настройка API key |
| Нет documentation в MCP | Агент не видит blocks; для глубокой доки — портал или будущий RAG |
| Отдельный tool на коллекцию | Для `colors` / `icons` — свои tools или общий паттерн |
| Синхрон whitelist | Список полей в константе нужно обновлять при изменении схемы |
| Custom tools в ключе | Нужно не забыть включить в MCP API Key |
| `select` и blocks | Поведение Select API стоит проверить на реальных данных после внедрения |

---

## Запрос vs выход MCP

| Слой | Механизм | В нашем решении |
|------|----------|-----------------|
| **Запрос** | `select` в `payload.find`, `access.read` на поле | **Основа** |
| **Выход** | `overrideResponse` | Только опционально, если останется `findComponents` |

**Итог:** оптимальная реализация для нашей задачи — **на этапе запроса** через кастомные MCP-tools.

---

## Связь с RAG (отдельный канал)

| Канал | Назначение | Как |
|-------|------------|-----|
| **MCP (Cursor)** | Карточки, slug, краткое описание, ссылки | Кастомные tools + `select` |
| **RAG** | Семантический поиск по полной документации | Sync из Payload, chunking, vector DB, endpoint/ingest — **не** сырой `findComponents` |

Не смешивать: MCP не заменяет RAG и наоборот.

---

## Чеклист внедрения

- [x] Создать `lib/mcp/components-agent.ts` с `MCP_COMPONENT_SELECT`
- [x] Добавить `access.read` на `documentation` для MCP
- [x] Добавить `getComponent` и `listComponents` в `mcpPlugin`
- [x] Выставить `components.enabled.find: false` (и create/update при необходимости)
- [x] Обновить `description` коллекции в MCP
- [ ] Включить custom tools в MCP API Key (вручную в админке)
- [ ] Проверить ответ для `button` / `input`

---

