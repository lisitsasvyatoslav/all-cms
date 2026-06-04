# Radix Themes в проекте

Краткое описание того, как подключены [@radix-ui/themes](https://www.radix-ui.com/themes), где настраивается тема и чем файлы отличаются друг от друга.

**Зависимость:** `@radix-ui/themes` в `package.json`.

**Где используется UI Themes на портале:** пока только обёртка `<Theme>` (провайдер). Отдельные компоненты Radix (`Button`, `Text` …) на маршрутах портала не рендерятся — пример есть в Storybook (`components/ds/radix-button.stories.tsx`).

---

## Схема подключения

```
portal-theme-config.ts     →  props для <Theme>
        ↓
portal-radix-theme.tsx     →  <Theme {...props}>
        ↓
(portal)/layout.tsx        →  стили + обёртка всего портала

radix-themes.css             →  CSS-переменные поверх пресета Themes

.storybook/preview.tsx      →  те же props + переключение light/dark
```

| Уровень | Файл | Способ настройки |
|---------|------|------------------|
| Пресет темы | `lib/radix/portal-theme-config.ts` | props `<Theme>` |
| Тонкая подгонка | `app/radix-themes.css` | CSS-переменные |
| Подключение на портале | `app/(portal)/layout.tsx` | импорты + `<PortalRadixTheme>` |
| Storybook | `.storybook/preview.tsx` | decorator + backgrounds |
| Пример компонента | `components/ds/radix-button.tsx` | обёртка над `Button` |

---

## `lib/radix/portal-theme-config.ts`

Единый объект **`portalRadixThemeProps`** для портала и Storybook. Меняя его, вы меняете глобальную тему Radix везде, где spread в `<Theme {...portalRadixThemeProps}>`.

Экспортируется тип **`PortalRadixThemeConfig`** — все допустимые props корневого `<Theme>` (не отдельных `Button` / `Dialog`).

### Props (полный список для `<Theme>`)

| Prop | Значение в проекте | Назначение |
|------|-------------------|------------|
| `appearance` | `inherit` | `light` \| `dark` \| `inherit`. На портале фон даёт Tailwind; в Storybook переопределяется на `light` / `dark`. |
| `accentColor` | `blue` | Акцентная палитра (кнопки solid, ссылки, focus). Варианты: `indigo`, `violet`, `jade`, `crimson` и др. — см. [Colors](https://www.radix-ui.com/themes/docs/theme/color). |
| `grayColor` | `slate` | Нейтральная палитра (фон, текст, границы). Варианты: `auto`, `gray`, `mauve`, `slate`, `sage`, `olive`, `sand`. |
| `panelBackground` | `solid` | Фон панелей (`Card`, `Dialog`, `Table`): `solid` \| `translucent`. |
| `radius` | `medium` | Скругление: `none` \| `small` \| `medium` \| `large` \| `full`. |
| `scaling` | `100%` | Плотность UI: `90%` \| `95%` \| `100%` \| `105%` \| `110%`. |
| `hasBackground` | `false` | Не красить фон у корня `<Theme>` — фон страницы остаётся у Tailwind в layout. |

### Чего нет в этом файле

- **`asChild`** — служебный prop для композиции, не настройка темы.
- **`onAppearanceChange`**, **`onAccentColorChange`** и т.д. — колбэки для интерактивного переключателя темы; нужен client-компонент, не статический конфиг.
- Точные **hex**, отдельные отступы — в `app/radix-themes.css`.

---

## `app/radix-themes.css`

Слой **ниже** `portal-theme-config.ts`: пресеты выбирают палитру (`blue`, `slate`), этот файл **переопределяет конкретные токены** CSS.

Подключается **после** `@radix-ui/themes/styles.css` в `(portal)/layout.tsx` и в `.storybook/preview.tsx`.

### Селектор `.radix-themes-portal.radix-themes`

Классы задаются в `components/providers/portal-radix-theme.tsx`. Переопределения действуют только внутри обёртки Themes (портал + Storybook), не в Payload admin.

### Сейчас настроено

| Переменная | Назначение |
|------------|------------|
| `--default-font-family` | Текст в компонентах Radix; привязка к `--font-geist-sans` из `(portal)/layout.tsx`. |
| `--code-font-family` | Моноширинный текст; привязка к `--font-geist-mono`. |

### Что можно добавить позже

**Типографика:** `--heading-font-family`, `--em-font-family`, `--quote-font-family`.

**Цвета (если пресета мало):**

```css
.radix-themes-portal.radix-themes {
  --accent-9: #2563eb;
  --accent-11: #1e40af;
}
```

Шкалы `--accent-1`…`--accent-12`, нейтрали `--gray-*` или `--slate-*` (при `grayColor: "slate"`), семантика `--color-background`, `--color-surface`.

**Форма и плотность:** `--radius-1`…`--radius-6`, `--space-1`…`--space-9` — уточнение после props `radius` и `scaling`.

**Не настраивается здесь:** layout портала (Tailwind), порядок блоков CMS, props отдельных кнопок (`size`, `variant`).

---

## `components/providers/portal-theme-provider.tsx`

Client-провайдер портала:

- `<Theme appearance={light|dark} onAppearanceChange={…}>` — управляемая тема Radix
- `localStorage` (`portal-appearance`) + системная тема при первом визите
- класс `dark` на `<html>` для Tailwind `dark:` и `--background` в `globals.css`
- `PortalAppearanceToggle` — кнопка в сайдбаре (солнце / луна)

Скрипт без мигания: `lib/radix/portal-appearance.ts` → `portalAppearanceInitScript` в `<head>` layout.

`portal-radix-theme.tsx` — устаревший реэкспорт, используйте `PortalThemeProvider`.

---

## `app/(portal)/layout.tsx`

- `import "@radix-ui/themes/styles.css"`
- `import "../radix-themes.css"`
- `<PortalRadixTheme>` вокруг контента (sidebar + страницы)

Payload admin (`(payload)/layout`) **не** подключает Radix Themes.

---

## `.storybook/preview.tsx`

Глобальная обёртка для всех `*.stories.tsx`.

### Импорты стилей

Те же три слоя, что на портале: Radix `styles.css`, `globals.css`, `radix-themes.css`.

### `parameters`

| Параметр | Назначение |
|----------|------------|
| `layout: "padded"` | Отступы вокруг story на canvas. |
| `controls.matchers` | Color picker для props с `color`/`background`; date picker для `Date`. |
| `backgrounds` | Тулбар Storybook: light `#ffffff` (default), dark `#0a0a0a`. |

### `decorators`

Каждая story:

```
<Theme {...portalRadixThemeProps} appearance={light|dark}>
  <div style={{ padding, background: var(--background) }} className={dark?}>
    <Story />
  </div>
</Theme>
```

| Часть | Поведение |
|-------|-----------|
| `portalRadixThemeProps` | Общий конфиг из `portal-theme-config.ts`. |
| `appearance` | **Переопределяет** `inherit` → `light` или `dark` по фону Storybook. |
| `radix-themes-portal` | Те же правила, что в `radix-themes.css`. |
| Внутренний `div` | Tailwind `dark`, цвета из `globals.css`. |

**Отличие от портала:** на сайте `appearance: "inherit"`; в Storybook тема Radix явно переключается с Backgrounds.

### Чего нет в `preview.tsx`

- Список stories, Vite, alias `@/` — в `.storybook/main.ts`.
- Параметры конкретных stories — в `*.stories.tsx`.

---

## Связанные файлы

| Файл | Роль |
|------|------|
| `components/ds/radix-button.tsx` | Обёртка `RadixDsButton` над Themes `Button`. |
| `components/ds/radix-button.stories.tsx` | Примеры в Storybook, раздел «Radix Themes/Button». |
| `components/ds/button.tsx`, `input.tsx` | Собственные компоненты на Tailwind; **не** Radix Themes. |

---

## Куда смотреть при изменении

| Задача | Файл |
|--------|------|
| Сменить акцент / серый / радиус / плотность | `lib/radix/portal-theme-config.ts` |
| Брендовые hex, шрифты | `app/radix-themes.css` |
| Включить фон Themes на весь экран | `hasBackground: true` в конфиге |
| Переключить light/dark на портале | кнопка в сайдбаре → `PortalThemeProvider` + `portal-appearance.ts` |
| Проверить компонент в изоляции | Storybook + `radix-button.stories.tsx` |

---

## Ссылки

- [Theme overview](https://www.radix-ui.com/themes/docs/theme/overview)
- [Dark mode](https://www.radix-ui.com/themes/docs/theme/dark-mode)
- [Color](https://www.radix-ui.com/themes/docs/theme/color)
- [Visual style](https://www.radix-ui.com/themes/docs/theme/visual-style)
- [Layout / scaling](https://www.radix-ui.com/themes/docs/theme/layout)
