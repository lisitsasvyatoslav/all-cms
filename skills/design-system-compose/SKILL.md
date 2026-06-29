---
name: design-system-compose
description: >-
  Automatically compose @radix-ui/themes TSX when user sends a Figma URL and/or
  asks in plain language («собери макет», «собери форму») with «Через design-system-portal».
  Requires design-system-portal MCP; Figma URL also needs Figma MCP.
---

# Design-system compose (plain-language prompts)

Copy to `~/.cursor/skills/design-system-compose/SKILL.md` for all projects, or use `.cursor/skills/design-system-compose/SKILL.md` in this repo.

User examples:

- Figma URL + «Собери макет.» + «Через design-system-portal»
- «Собери форму регистрации: email, пароль, кнопки Регистрация / Войти.» + «Через design-system-portal»

Agent runs `composeUi` automatically. User names only the MCP server — not individual tools.
