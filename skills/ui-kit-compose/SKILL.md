---
name: ui-kit-compose
description: >-
  Build UI via design-system-portal MCP from Figma URLs or plain-language requests.
  Prefer skill design-system-compose — automatic pipeline, no tool names for users.
---

# Compose (Radix Themes via MCP)

For all compose requests use **`design-system-compose`** skill.

Users paste plain prompts only, e.g.:

- `https://figma.com/design/...?node-id=1-2` + «Собери макет.»
- «Собери форму входа: email, password, кнопка Войти.»

Agent runs MCP automatically. Result in chat (TSX), not project files unless asked.
