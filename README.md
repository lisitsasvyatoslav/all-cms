# Design System Portal (Next.js + Payload CMS)

Локальный портал дизайн-системы: Next.js, Payload CMS (SQLite), Storybook.

## Требования

- **Node.js** 20 или новее
- **npm** (идёт с Node.js)
- **Git**

## 1. Клонирование

```bash
git clone https://github.com/lisitsasvyatoslav/all-cms.git
cd all-cms
```

## 2. Зависимости

```bash
npm install
```

## 3. База и демо-данные

Первый запуск создаёт файл `payload.sqlite` в корне проекта.

**Рекомендуемый путь для чистой локальной установки:**

```bash
npm run seed:portal
```

Скрипт подтянет схему БД и заполнит демо: компоненты, цвета, иконки, глобальные ссылки.

Если Drizzle спросит про новые таблицы (`Is … created or renamed?`), на каждый вопрос выбирайте **`+ create table`**, не *rename*.

Если миграция «застряла» или схема в неконсистентном состоянии (типично после смены блоков документации), проще начать с пустой БД:

```powershell
# Windows (PowerShell)
Remove-Item payload.sqlite -ErrorAction SilentlyContinue
npm run seed:portal
```

```bash
# macOS / Linux
rm -f payload.sqlite
npm run seed:portal
```

## 4. Запуск приложения

```bash
npm run dev
```

Откройте в браузере:

| URL | Что это |
|-----|---------|
| [http://127.0.0.1:3000](http://127.0.0.1:3000) | Портал дизайн-системы |
| [http://127.0.0.1:3000/admin](http://127.0.0.1:3000/admin) | Payload Admin (CMS) |
| [http://127.0.0.1:3000/components/button](http://127.0.0.1:3000/components/button) | Пример страницы компонента |

При первом заходе в **Admin** создайте пользователя — первый аккаунт автоматически получит роль **admin**.

## 5. Storybook (опционально)

Превью компонентов на портале ссылается на Storybook. В **отдельном** терминале:

```bash
npm run storybook
```

Storybook: [http://127.0.0.1:6006](http://127.0.0.1:6006)

## 6. MCP в Cursor

MCP-сервер портала даёт агенту в Cursor доступ к документации компонентов через Payload.

### Быстрая установка

1. **Откройте страницу компонента** на портале, например [Button](http://127.0.0.1:3000/ds/components/web/button).
2. В шапке страницы нажмите **Copy Markdown**, затем в меню (стрелка справа) — **Add to Cursor**.
3. Cursor откроет установку MCP-сервера `design-system-portal` — подтвердите установку. **Вводить API key не нужно** — портал подставляет демо-ключ автоматически.
4. Для **других агентов** (Claude, VS Code и т.д.) в том же меню выберите **MCP API key** — откроется окно с ключом и кнопкой копирования.

### Ручная настройка (`mcp.json`)

Если нужно добавить сервер вручную (Cursor Settings → MCP или `~/.cursor/mcp.json`), используйте конфиг ниже. Ключ можно скопировать на странице компонента через **MCP API key** или создать свой в [Payload Admin → MCP → API Keys](http://127.0.0.1:3000/admin/collections/payload-mcp-api-keys/create) (tools: `getComponent`, `listComponents`, `listComponentsFull`).

```json
{
  "mcpServers": {
    "design-system-portal": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://all-cms.vercel.app/api/mcp",
        "--header",
        "Authorization: Bearer API_KEY"
      ],
      "env": {
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

Для локального dev-сервера замените URL на `http://127.0.0.1:3000/api/mcp`.

### MCP tools

| Tool | Назначение |
|------|------------|
| `getComponent` | Документация одного компонента по `slug` |
| `listComponents` | Краткий список компонентов (карточки) |
| `listComponentsFull` | Полный список с описаниями и связями |

## Полезные команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер Next.js (порт 3000) |
| `npm run build` | Production-сборка |
| `npm run start` | Запуск после `build` |
| `npm run seed:portal` | Демо-данные и синхронизация схемы SQLite |
| `npm run turso:setup` | Миграции + seed на Turso (нужны DATABASE_URI и DATABASE_AUTH_TOKEN) |
| `npm run storybook` | Storybook на порту 6006 |
| `npm run generate:types` | Перегенерация `payload-types.ts` после смены схемы CMS |
| `npm run lint` | ESLint |
