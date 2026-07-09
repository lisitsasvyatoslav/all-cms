## 1. Что это за проект

Это монолитное Next.js-приложение, внутри которого одновременно работают:

- публичный портал дизайн-системы;
- Payload CMS Admin;
- REST и GraphQL API Payload;
- MCP-сервер `finam-design-system`;
- серверные функции генерации UI;
- локальный пакет `@next-app/ui-kit`;
- интеграция со Storybook.

Payload не запущен отдельным сервером. Он встроен в Next.js через `@payloadcms/next`.

```text
Один процесс Next.js
├── /ds, /brand, /text          — публичный портал
├── /admin                      — Payload Admin
├── /api/*                      — Payload REST API
├── /api/graphql                — GraphQL
├── /api/mcp                    — finam-design-system MCP
└── Payload Local API           — внутренние запросы без HTTP
```

Основная конфигурация находится в [payload.config.ts](C:\Users\Finam\repo\next-app\payload.config.ts).

---

## 2. Как всё работает сейчас локально

### Приложение

Запуск:

```powershell
npm run dev
```

Поднимается Next.js на:

```text
http://127.0.0.1:3000
```

Payload Admin:

```text
http://127.0.0.1:3000/admin
```

MCP:

```text
http://127.0.0.1:3000/api/mcp
```

### Текущая база

Сейчас используется не PostgreSQL, а:

```ts
import { sqliteAdapter } from "@payloadcms/db-sqlite";
```

Конфигурация:

```ts
db: sqliteAdapter({
  client: resolvePayloadSqliteClientConfig(),
  push: false,
  migrationDir: path.resolve(dirname, "migrations"),
  prodMigrations: migrations,
})
```

Адаптер поддерживает два режима.

#### Локальный SQLite

Если `DATABASE_URI` отсутствует:

```text
file:./payload.sqlite
```

Файл базы хранится в корне проекта:

```text
next-app/payload.sqlite
```

Для явного запуска локальной SQLite:

```powershell
npm run dev:local
```

#### Turso

Обычный `npm run dev` читает `.env`. Если там задано:

```env
DATABASE_URI=libsql://...
DATABASE_AUTH_TOKEN=...
```

Payload подключается к удалённой Turso через libSQL.

То есть приложение запускается локально, но данные физически находятся в облачной Turso:

```text
Next.js на компьютере
        │
        │ libSQL/TLS
        ▼
Turso в облаке
```

Выбор подключения реализован в [resolve-database-uri.ts](C:\Users\Finam\repo\next-app\lib\payload\resolve-database-uri.ts).

---

## 3. Как портал получает данные

Публичные страницы не ходят к Payload через HTTP. Серверные React-компоненты используют Payload Local API:

```ts
const payload = await getPayload({ config });

await payload.find({
  collection: "components",
});
```

Local API работает внутри того же Node.js-процесса:

```text
Страница Next.js
    ↓
Payload Local API
    ↓
Database Adapter
    ↓
SQLite / Turso
```

Это быстрее обычного HTTP API и сохраняет Payload hooks, relations и access control.

Получение экземпляра Payload находится в [get-cached-payload.ts](C:\Users\Finam\repo\next-app\lib\payload\get-cached-payload.ts).

---

## 4. Что хранится в базе

Основные Payload-коллекции:

- `users` — пользователи CMS;
- `media` — метаданные загруженных файлов;
- `components` — компоненты дизайн-системы и documentation-блоки;
- `design-checklist-items`;
- `glossary-terms`;
- `brand-pages`;
- `colors`;
- `icons`;
- `notes`;
- `field-showcase`;
- `payload-mcp-api-keys` — ключи MCP.

Globals:

- `portal-sources`;
- `portal-seo`;
- `text-glossary`;
- `brand-overview`;
- `ds-overview`.

Payload автоматически раскладывает массивы и documentation-блоки по связанным SQL-таблицам.

---

## 5. Как хранятся Media

Сейчас база хранит только метаданные:

- имя файла;
- URL;
- MIME type;
- размер;
- ширину и высоту;
- `alt`;
- связи с документами.

Сами файлы лежат локально:

```text
next-app/media/
```

Коллекция настроена просто:

```ts
const Media = {
  slug: "media",
  upload: true,
};
```

Папка `media` исключена из Git.

Это означает, что после запуска в Docker файлы будут записываться внутрь контейнера и исчезнут при его пересоздании, если не подключить постоянное хранилище.

Есть два варианта:

1. Docker volume:

```yaml
volumes:
  - media_data:/app/media
```

2. S3/MinIO/Cloudflare R2 — предпочтительнее для production.

Payload официально поддерживает S3-совместимые хранилища через `@payloadcms/storage-s3`. [Документация Payload Storage](https://payloadcms.com/docs/upload/storage-adapters).

---

# 6. Целевая Docker-архитектура

Payload и PostgreSQL лучше запускать не внутри одного контейнера, а двумя сервисами:

```text
                   HTTPS
                     │
              Nginx / Traefik
                     │
                     ▼
┌──────────────────────────────────┐
│ app                              │
│ Next.js + Payload + MCP          │
│ :3000                            │
└──────────────┬───────────────────┘
               │ DATABASE_URL
               ▼
┌──────────────────────────────────┐
│ postgres                         │
│ PostgreSQL :5432                 │
│ volume: postgres_data            │
└──────────────────────────────────┘

               app
                │
                ▼
     media volume или S3/MinIO
```

PostgreSQL не должен быть доступен из интернета. Порт `5432` нужен только внутри Docker network.

---

## 7. Что нужно изменить для PostgreSQL

### Зависимости

Добавить:

```bash
npm install @payloadcms/db-postgres
```

После миграции можно удалить:

```text
@payloadcms/db-sqlite
@libsql/client
```

### Payload config

Заменить:

```ts
import { sqliteAdapter } from "@payloadcms/db-sqlite";
```

на:

```ts
import { postgresAdapter } from "@payloadcms/db-postgres";
```

И конфигурацию:

```ts
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL,
  },
  push: false,
  migrationDir: path.resolve(dirname, "migrations-postgres"),
}),
```

Официальный Postgres-адаптер Payload использует Drizzle и `node-postgres`. [Payload Postgres](https://payloadcms.com/docs/database/postgres).

Docker connection string:

```env
DATABASE_URL=postgresql://payload:password@postgres:5432/payload
```

Здесь `postgres` — имя Docker Compose-сервиса, не `localhost`.

---

## 8. Важная проблема текущих миграций

Текущие миграции нельзя использовать с PostgreSQL.

Они импортируют:

```ts
@payloadcms/db-sqlite
```

и содержат SQLite SQL:

```sql
CREATE TABLE ...
strftime(...)
INSERT OR IGNORE ...
```

PostgreSQL не понимает часть этого синтаксиса.

Поэтому нельзя сделать просто:

```text
sqliteAdapter → postgresAdapter
npm run payload:migrate
```

Нужен отдельный каталог:

```text
migrations-postgres/
```

И новая initial migration, сгенерированная Payload для PostgreSQL.

Payload предупреждает, что миграции зависят от адаптера и могут отличаться между SQLite и PostgreSQL. [Payload Migrations](https://payloadcms.com/docs/database/migrations).

---

## 9. Варианты переноса данных

### Если текущие данные не нужно сохранять

Самый простой путь:

1. Поднять пустой PostgreSQL.
2. Подключить `postgresAdapter`.
3. Сгенерировать PostgreSQL initial migration.
4. Применить её.
5. Запустить:

```bash
npm run seed:portal
```

6. Создать первого администратора.
7. Повторно создать MCP API keys.

### Если данные Turso нужно сохранить

Нужен перенос через Payload API, не прямое копирование SQL-таблиц.

Последовательность:

```text
Turso
  ↓ Payload Local API
JSON export + media files
  ↓
PostgreSQL
  ↓ Payload Local API
Import
```

Экспортировать нужно:

- globals;
- components и documentation;
- glossary;
- brand pages;
- colors;
- icons;
- checklist;
- media metadata и файлы;
- остальные CMS-данные.

Особые случаи:

- пароли пользователей лучше не переносить обычным JSON — создать пользователей заново или сделать reset;
- MCP API keys следует перевыпустить;
- relations нужно импортировать в правильном порядке;
- старые и новые ID придётся сопоставлять;
- Media нужно сначала загрузить, затем восстанавливать ссылки на них.

---

## 10. Пример `docker-compose.yml`

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: 0.0.0.0

      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      DATABASE_URL: postgresql://payload:${POSTGRES_PASSWORD}@postgres:5432/payload

      NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
      NEXT_PUBLIC_STORYBOOK_URL: ${NEXT_PUBLIC_STORYBOOK_URL}
    ports:
      - "3000:3000"
    volumes:
      - media_data:/app/media

  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: payload
      POSTGRES_USER: payload
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U payload -d payload"]
      interval: 5s
      timeout: 5s
      retries: 20

volumes:
  postgres_data:
  media_data:
```

В production обычно не нужно публиковать:

```yaml
ports:
  - "5432:5432"
```

Приложение и PostgreSQL общаются по внутренней Docker-сети.

---

## 11. Next.js Docker build

Для production Docker Next.js рекомендуется включить standalone output:

```ts
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@storybook/react", "@next-app/ui-kit"],
};
```

Payload также рекомендует multi-stage Docker build и `output: "standalone"`. [Payload Production Deployment](https://payloadcms.com/docs/production/deployment).

Упрощённый процесс:

```text
npm ci
→ npm run build
→ копирование .next/standalone
→ node server.js
```

Но перед этим нужно проверить, может ли текущий `next build` выполняться без подключения к базе. Некоторые страницы используют Payload Local API при генерации metadata. Payload отдельно описывает эту проблему для Docker-сборок. [Building without a DB connection](https://payloadcms.com/docs/production/building-without-a-db-connection).

Надёжный вариант — сделать Payload-зависимые страницы динамическими либо исключить запросы к БД на этапе image build.

---

## 12. Миграции при запуске

Есть два подхода.

### Отдельный migration job — предпочтительно

```text
docker compose run --rm app npm run payload:migrate
docker compose up -d app
```

Или отдельный Compose-сервис `migrate`, использующий тот же image.

Преимущество: приложение не стартует на старой схеме.

### Автомиграции при старте

Payload поддерживает `prodMigrations`, но при нескольких репликах приложения возможна гонка между контейнерами.

Для одного контейнера это допустимо. При масштабировании лучше отдельная миграционная задача.

---

## 13. Storybook

Storybook сейчас не является частью Next.js production server.

Портал использует URL:

```env
NEXT_PUBLIC_STORYBOOK_URL=...
```

Варианты:

- оставить Storybook отдельным опубликованным сервисом;
- собрать `storybook-static` и раздавать через Nginx;
- поднять второй Docker-контейнер.

Для работы самого Payload Storybook не нужен. Без него только не будут работать встроенные live preview.

---

## 14. Переменные production

Минимум:

```env
PAYLOAD_SECRET=очень-длинный-случайный-секрет
POSTGRES_PASSWORD=сложный-пароль
DATABASE_URL=postgresql://payload:пароль@postgres:5432/payload

NEXT_PUBLIC_SITE_URL=https://design.example.ru
NEXT_PUBLIC_STORYBOOK_URL=https://storybook.example.ru

PAYLOAD_MCP_DEMO_BYPASS_AUTH=false
```

Для S3:

```env
S3_BUCKET=...
S3_REGION=...
S3_ENDPOINT=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

Не переносить `.env` внутрь Docker image. Передавать secrets через сервер, Docker secrets или CI/CD.

В текущих локальных `.env` находятся реальные credentials. Перед production-развёртыванием их следует заменить, а токены Turso — отозвать, если Turso больше не используется.

---

## 15. Резервное копирование

PostgreSQL:

```bash
pg_dump -Fc payload > payload.dump
```

Восстановление:

```bash
pg_restore -d payload payload.dump
```

Также отдельно резервировать:

- Docker volume `media_data`;
- либо S3 bucket;
- production `.env`/secrets;
- MCP API keys или процедуру их перевыпуска.

Бэкап PostgreSQL без Media не является полным бэкапом портала.

---

## 16. Рекомендуемый порядок перехода

1. Создать отдельную ветку миграции на PostgreSQL.
2. Добавить `@payloadcms/db-postgres`.
3. Переключить `payload.config.ts`.
4. Создать `migrations-postgres`.
5. Поднять локальный PostgreSQL в Docker.
6. Проверить пустую схему и создание администратора.
7. Написать export из Turso и import в PostgreSQL.
8. Перенести Media в volume или S3.
9. Добавить `output: "standalone"`.
10. Создать Dockerfile и Compose.
11. Проверить `npm run build`.
12. Применить миграции.
13. Запустить приложение.
14. Проверить `/admin`, портал и `/api/mcp`.
15. Настроить HTTPS, backups и health checks.

Главное: текущий проект уже является единым Next.js + Payload приложением. Для Docker не нужен отдельный контейнер Payload — нужен контейнер приложения, контейнер PostgreSQL и постоянное хранилище Media.