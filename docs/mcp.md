## MCP в Cursor

MCP-сервер портала даёт агенту в Cursor доступ к документации компонентов через Payload.

### Быстрая установка

1. **API KEY** - f85f586f-cb0f-4c30-85ea-4647f81bd4d2
2. **Откройте страницу компонента** на портале, например [Button](https://all-cms.vercel.app/ds/components/web/button).
3. В шапке страницы нажмите **Copy Markdown**, затем в меню (стрелка справа) — **Add to Cursor**.
4. В модальном окне вставьте **MCP API key** и нажмите **Установить в Cursor**.
5. Cursor предложит установить MCP-сервер `design-system-portal` — подтвердите установку.

### Ручная настройка (`mcp.json`)

Если нужно добавить сервер вручную (Cursor Settings → MCP или `~/.cursor/mcp.json`), используйте конфиг ниже. В `Authorization: Bearer …` подставьте свой ключ из админки.

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

### MCP tools

| Tool | Назначение |
|------|------------|
| `getComponent` | Документация одного компонента по `slug` |
| `listComponents` | Краткий список компонентов (карточки) |
| `listComponentsFull` | Полный список с описаниями и связями |
