/** Инструкции для ИИ-агента (MCP metadata, skill, Cursor rule). */

export const COMPOSE_MCP_AGENT_INSTRUCTIONS = `Design-system compose — ONLY via MCP server "design-system-portal" (@radix-ui/themes).

TRIGGER: user mentions "design-system-portal" or "Через design-system-portal" (with or without Figma URL / «собери макет»).
The server name is the only user-facing anchor — do NOT ask for tool names or "compose" keyword.
MCP tools on this server already imply Radix Themes compose (composeUi, getComponentRegistry).

WHEN triggered:
- MUST call design-system-portal MCP (resolveComposeIntent optional → composeUi).
- MUST NOT hand-write HTML, Tailwind, or generic React.
- If MCP unavailable: tell user to connect design-system-portal — do NOT fallback to manual markup.

FIGMA URL: Figma MCP read mockup → Design Brief → composeUi(figmaUrl, designBrief).
TEXT: Design Brief from description → composeUi(designBrief).

Reply: TSX from composeUi. No file writes unless asked.`;

export const CURSOR_USER_RULE_FIGMA_COMPOSE = `When the user mentions design-system-portal or «Через design-system-portal» (with Figma URL and/or «собери макет/форму»):
Use ONLY the design-system-portal MCP server (composeUi) — Radix Themes is implied by its tools. Never hand-write HTML/Tailwind. For Figma links also use Figma MCP. Post TSX in chat; no files unless asked.`;

export const COMPOSE_USER_PROMPT_EXAMPLES = [
  "https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=1-25110\nСобери макет.\nЧерез design-system-portal",
  "Собери форму регистрации: email, пароль, primary «Регистрация», secondary «Войти».\nЧерез design-system-portal",
] as const;

export function getMcpAgentInstructions() {
  return {
    title: "Design-system compose (design-system-portal MCP → Radix Themes)",
    instructions: COMPOSE_MCP_AGENT_INSTRUCTIONS,
    primaryTool: "composeUi",
    mcpServer: "design-system-portal",
    intentTool: "resolveComposeIntent",
    prerequisiteMcpServers: ["design-system-portal (required)", "Figma MCP (figma URLs only)"],
    userPromptExamples: [...COMPOSE_USER_PROMPT_EXAMPLES],
    composeAnchorPhrase: "Через design-system-portal",
    impliedStack: "@radix-ui/themes via composeUi — user does not name Radix or compose explicitly",
    doNotAskUserFor: ["MCP tool names", "compose keyword", "Radix setup unless troubleshooting"],
  };
}
