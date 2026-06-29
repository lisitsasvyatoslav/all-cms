---
name: design-system-compose
description: >-
  Compose @radix-ui/themes via design-system-portal MCP. Triggers: figma.com URL,
  «собери макет», or «Через design-system-portal». Never hand-write HTML.
---

# Design-system compose

## User prompt (enough for any chat)

```
https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=1-25110
Собери макет.
Через design-system-portal
```

One server name — no tool names, no «compose», no Radix charter. MCP tools imply Radix Themes compose.

## Agent pipeline

1. design-system-portal `resolveComposeIntent` (optional)
2. Figma MCP if URL
3. design-system-portal `composeUi`
4. TSX in chat — **never** substitute manual markup

If MCP missing → ask user to connect design-system-portal, stop.
