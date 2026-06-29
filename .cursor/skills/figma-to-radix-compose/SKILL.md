---
name: figma-to-radix-compose
description: >-
  Alias for design-system-compose when message contains figma.com URL.
  Prefer skill design-system-compose — covers Figma and text-only requests.
---

# Figma → Radix (use design-system-compose)

This skill is superseded by **`design-system-compose`**. Follow that skill.

User prompt example:

```
https://www.figma.com/design/FILE/Name?node-id=1-2
Собери макет.
```

Pipeline: Figma MCP → Design Brief → `composeUi`. No tool names for the user.
