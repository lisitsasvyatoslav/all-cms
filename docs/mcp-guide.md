## MCP в Cursor



MCP-сервер портала даёт агенту доступ к документации компонентов и **сборке UI (compose)** — без клонирования репозитория портала.



### Быстрая установка (localhost)

**Рекомендуется для MCP** (без Turso, стабильное подключение):

```bash
npm run migrate:local
npm run sync:mcp-demo-key:local
npm run dev:local
```

Или с Turso: `npm run dev` — demo-ключ в dev **не ходит в БД** при handshake (см. `PAYLOAD_MCP_DEMO_BYPASS_AUTH`).

1. Запустите dev (**сначала** сервер, потом MCP в Cursor)
2. [Button](http://127.0.0.1:3000/ds/components/web/button) → **Add to Cursor**
3. Restart MCP в Cursor Settings

Демо-ключ: `npm run sync:mcp-demo-key` (или `:local`).

**Не используйте** `all-cms.vercel.app` — deployment удалён.

### Ручная настройка (`mcp.json`)



Если нужно добавить сервер вручную (Cursor Settings → MCP или `~/.cursor/mcp.json`), используйте конфиг ниже. Ключ можно скопировать на странице компонента через **MCP API key** или создать свой в [Payload Admin → MCP → API Keys](http://127.0.0.1:3000/admin/collections/payload-mcp-api-keys/create).



```json

{

  "mcpServers": {

    "finam-design-system": {

      "command": "npx",

      "args": [

        "-y",

        "mcp-remote",

        "http://127.0.0.1:3000/api/mcp",

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



### Claude Desktop (пример)



`claude_desktop_config.json`:



```json

{

  "mcpServers": {

    "finam-design-system": {

      "command": "npx",

      "args": [

        "-y",

        "mcp-remote",

        "https://YOUR-PORTAL-HOST/api/mcp",

        "--header",

        "Authorization: Bearer YOUR_API_KEY"

      ]

    }

  }

}

```



Агент **не видит код портала** — только tools по HTTP.



### MCP tools



| Tool | Назначение |

|------|------------|

| **`resolveComposeIntent`** | **Старт:** plain-language запрос → pipeline figma/text |
| **`composeUi`** | **PRIMARY:** Design Brief → TSX (@radix-ui/themes) |
| **`composeFromFigmaContext`** | Alias `composeUi` |
| **`getComposeGuide`** | Справка / troubleshooting |
| **`getFigmaComposeWorkflow`** | Parsed fileKey/nodeId, kind mapping |
| **`planCompositionFromBrief`** | Brief → Composition JSON (low-level) |

| `getComponentRegistry` | Реестр компонентов и props для Composition JSON |

| `validateComposition` | Проверка JSON перед рендером |

| `renderComposition` | JSON → TSX + `projectSetup` (peer deps, CSS, Theme) |

| `getComponent` | Документация одного компонента по `slug` |

| `listComponents` | Краткий список компонентов |

| `listComponentsFull` | Полный список с documentation (`showLLM`) |



### Сборка UI — промпты для пользователей

**В новом чате без открытого репозитория** агент не видит `.cursor/rules`. Одного «Собери макет» часто **недостаточно** — модель уйдёт в ручную HTML/Tailwind.

Нужно **два условия**:

1. **MCP `finam-design-system` подключён** (Cursor Settings → MCP, статус зелёный).
2. **Якорная строка** — только имя сервера: `Через finam-design-system`. Слово compose и список tools не нужны.

**Рекомендуемый промпт (Figma):**

```
https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=1-25110

Собери макет.

Через finam-design-system
```

**Текстом (без Figma):**

```
Собери форму регистрации: email, пароль, primary «Регистрация», secondary «Войти».

Через finam-design-system
```

**Один раз в Cursor Settings → Rules** (любой проект):

```
Если пользователь упоминает finam-design-system или «Через finam-design-system» —
используй только MCP этого сервера (composeUi), не пиши HTML/Tailwind вручную. Radix Themes подразумевается инструментами MCP.
```

MCP tool `getComposeUserPromptGuide` — полный текст примеров для агента/доков.

### Сборка UI — для разработчиков (MCP tools)



1. Агент вызывает **`getComposeGuide`** (обязательно при отсутствии контекста репозитория).

2. **`getComponentRegistry`** — какие `component` id допустимы.

3. Агент строит Composition JSON (пример в ответе `getComposeGuide`).

4. **`validateComposition`** → исправить ошибки.

5. **`renderComposition`** → вывести в **чате** Design Brief, Composition JSON, `validateComposition`, полный `tsx` и кратко `projectSetup`. **Не создавать файлы в проекте**, если пользователь не попросил явно.



Figma URL и скриншоты — Figma MCP; compose и TSX — finam-design-system.

### Figma → compose (dual MCP) — внутренний workflow для агента

Нужны **оба** MCP: Figma + `finam-design-system`.

1. `resolveComposeIntent(userMessage)` или эвристика по URL
2. Figma MCP: read mockup (если URL)
3. Design Brief
4. `composeUi`
5. TSX в чате

После добавления tools: `npm run payload:migrate` → `npm run sync:mcp-demo-key` → restart MCP.

### Cursor Skill / Rule

- `.cursor/rules/design-system-compose.mdc` — alwaysApply в этом репо
- `skills/design-system-compose/SKILL.md`

### Устаревшие starter prompts (не давать пользователям)

### Troubleshooting

| Симптом | Причина | Решение |
|---------|---------|---------|
| `ECONNREFUSED` | dev не запущен | `npm run dev:local` **до** включения MCP |
| `404` / deployment not found on Vercel | URL `all-cms.vercel.app` | `http://127.0.0.1:3000/api/mcp` |
| `500` / Turso timeout | удалённая БД недоступна | `npm run dev:local` или demo bypass в dev |
| `500` / Something went wrong | нет колонок / нет API key | `migrate:local` → `sync:mcp-demo-key:local` |
| Нет compose tools | старый API key | `npm run sync:mcp-demo-key` + restart MCP |
| `Unauthorized` | неверный Bearer | демо-ключ из `sync:mcp-demo-key` |

В dev демо-ключ (`546cc94a-…`) подключается **без запроса к Turso**. Отключить: `PAYLOAD_MCP_DEMO_BYPASS_AUTH=false`.
