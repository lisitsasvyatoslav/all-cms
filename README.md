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

## Типичные проблемы

**Пустой каталог компонентов на портале** — выполните `npm run seed:portal` или проверьте, что у записей в CMS заполнены обязательные поля (`name`, `slug`, `description`).

**Превью Storybook не встраивается** — запущен ли `npm run storybook` на порту 6006.

## Деплой на Vercel

### Обязательные переменные

В **Settings → Environment Variables** (Production + Preview):

| Переменная | Описание |
|------------|----------|
| `PAYLOAD_SECRET` | Случайная строка ≥ 32 символов |
| `NEXT_PUBLIC_SITE_URL` | `https://ваш-проект.vercel.app` |
| `DATABASE_URI` | URL Turso: `libsql://…` |
| `DATABASE_AUTH_TOKEN` | Токен Turso |

Без `DATABASE_URI` + `DATABASE_AUTH_TOKEN` Admin пишет в эфемерный `/tmp` — **MCP API keys и другие изменения пропадают** после cold start или смены serverless-инстанса.

### Turso (персистентная SQLite)

1. Установите [Turso CLI](https://docs.turso.tech/cli/installation) и войдите: `turso auth login`

2. Создайте базу:
   ```bash
   turso db create next-app-portal
   ```

3. Получите URL и токен:
   ```bash
   turso db show next-app-portal --url
   turso db tokens create next-app-portal
   ```

4. Локально в `.env.local`:
   ```env
   DATABASE_URI=libsql://next-app-portal-….turso.io
   DATABASE_AUTH_TOKEN=eyJhbG…
   PAYLOAD_SECRET=…
   ```

5. Первичная настройка (миграции + seed, если БД пустая):
   ```bash
   npm run turso:setup
   ```

6. Те же `DATABASE_URI` и `DATABASE_AUTH_TOKEN` добавьте в Vercel → **Redeploy**.

**Импорт локальной БД** (если уже есть `payload.sqlite` с данными):
```bash
turso db import next-app-portal --from-file payload.sqlite
```

### Seed для preview без Turso (только демо)

`payload.sqlite` в git не попадает. На Vercel без Turso — **`data/payload.seed.sqlite`**. Обновить после локального `seed:portal`:
```powershell
Copy-Item payload.sqlite data/payload.seed.sqlite -Force
```
OG главной — **`public/og/portal-site.webp`**: `npm run generate:portal-site-og`

Закоммитьте `data/payload.seed.sqlite` и `public/og/portal-site.webp` только если используете demo-режим без Turso.
