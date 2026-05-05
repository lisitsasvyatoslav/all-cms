# Astro CMS (Content Layer)

Подпроект на [Astro](https://astro.build/) с официальными **Content Collections**: те же JSON в корне репозитория — `content/`, что читает Next (`lib/content/`).

## Зачем

- Проверка схем при `astro build`
- Простой HTML-предпросмотр списков компонентов / цветов / иконок
- Редактирование по-прежнему в файлах в `content/` (git как CMS)

## Команды

Из этой папки:

```bash
npm install
npm run dev    # http://localhost:4321
npm run build
```

Из корня монорепозитория:

```bash
npm run dev:cms
npm run build:cms
```

Конфигурация коллекций: `src/content.config.ts`.
