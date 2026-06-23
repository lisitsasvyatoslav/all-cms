## MCP в Cursor

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
