# Sanity: базовый запуск в проекте

## 1) Установить переменные окружения

Скопируйте `.env.example` в `.env` и заполните:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (обычно `production`)
- `SANITY_API_VERSION` (можно оставить `2025-01-01`)
- `NEXT_PUBLIC_SANITY_STUDIO_URL` (по умолчанию `http://localhost:3333`)
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`

Если dataset приватный, добавьте `SANITY_API_READ_TOKEN`.

Если Studio показывает `Trying to connect` и в CLI есть ошибки сертификата
(`unable to verify the first certificate`), для локальной разработки можно
включить `NODE_TLS_REJECT_UNAUTHORIZED=0` (уже добавлено в `sanity:*` скрипты).

## 2) Подключить проект Sanity (один раз)

```bash
npx sanity login
npx sanity init
```

`sanity.config.ts` уже содержит схемы:

- `component`
- `color`
- `icon`
- `portalSource`

## 3) Запуск

- Портал: `npm run dev`
- Studio: `npm run sanity:dev`

Портал читает данные напрямую из Sanity и даёт ссылку на Studio в интерфейсе.
