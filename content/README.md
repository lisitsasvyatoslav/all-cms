# Контент портала

Общая папка для:

| Потребитель | Роль |
|-------------|------|
| **Next.js** (`npm run dev`) | Основной UI портала — читает JSON через `lib/content/` |
| **Astro CMS** (`npm run dev:cms` в корне или `astro-cms/`) | Официальные [Content Collections](https://docs.astro.build/en/guides/content-collections/) — те же файлы, схемы в `astro-cms/src/content.config.ts`, предпросмотр на http://localhost:4321 |

| Файл / папка | Назначение |
|--------------|------------|
| `portal-sources.json` | Общие ссылки |
| `components/*.json` | По одному файлу на компонент (`slug` → `/components/[slug]` в Next); примеры: Button, Text Field, Card, Dialog, Badge, Select, Switch |
| `colors.json` | Массив токенов (семантика, текст, border, focus, overlay …) |
| `icons.json` | Массив иконок; `previewUrl` — путь из `public/` |

После правок сохраните файл и обновите страницу Next; для Astro перезапустите `dev:cms` при необходимости.
