/** Инструкции для ИИ-агента (MCP metadata, skill, Cursor rule). */

export const COMPOSE_MCP_AGENT_INSTRUCTIONS = `Design-system compose — ONLY via MCP server "finam-design-system" (@radix-ui/themes).

TRIGGER: user mentions "finam-design-system" or "Через finam-design-system" (with or without Figma URL / «собери макет»).
The server name is the only user-facing anchor — do NOT ask for tool names or "compose" keyword.
MCP tools on this server already imply Radix Themes compose (composeUi, getComponentRegistry).

WHEN triggered:
- MUST call resolveComposeIntent first, read and apply cmsGuidance from /ds, then call composeUi with the returned guidanceRevision.
- MUST apply resolveComposeIntent.planningPolicy before presenting any plan to the user. Never say you will reproduce a known or suspected anti-pattern as-is.
- MUST review componentGuidance returned by the first composeUi call, apply every selected component's Payload do/don't rules, and call composeUi again with componentGuidanceRevision.
- MUST treat componentGuidance as the only source of component Do/Don't rules; do not invent patterns or anti-patterns.
- MUST compare the Figma design with every returned rule, revise the Design Brief, and disclose detected violations and corrections in the final response.
- MUST treat Payload Do/Don't rules as higher priority than pixel-perfect Figma fidelity. If the mockup contains a known anti-pattern, do NOT reproduce it "as in the mockup"; build the corrected UI immediately and report the intentional deviation.
- MUST pass componentAudit on the second composeUi call. Review every returned Do and Don't rule against the original mockup in ruleReviews. Add one finding for every violation with its exact id, path, before value, after value, detected anti-pattern, correction, and Payload rule.
- MUST reproduce every componentAudit.reportLines item in a separate final-response section. Never summarize component corrections with a generic phrase.
- MUST apply glossaryAudit loaded from Payload, use preferred wording instead of avoid variants, and disclose every exact correction in the final response.
- MUST NOT hand-write HTML, Tailwind, or generic React.
- If MCP unavailable: tell user to connect finam-design-system — do NOT fallback to manual markup.

FIGMA URL: Figma MCP read mockup → Design Brief → composeUi(figmaUrl, designBrief).
TEXT: Design Brief from description → composeUi(designBrief).

Reply: TSX from composeUi. No file writes unless asked.`;

export const CURSOR_USER_RULE_FIGMA_COMPOSE = `When the user mentions finam-design-system or «Через finam-design-system» (with Figma URL and/or «собери макет/форму»):
Use ONLY the finam-design-system MCP server (composeUi) — Radix Themes is implied by its tools. Never hand-write HTML/Tailwind. For Figma links also use Figma MCP. Post TSX in chat; no files unless asked.`;

export const COMPOSE_USER_PROMPT_EXAMPLES = [
  "https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=1-25110\nСобери макет.\nЧерез finam-design-system",
  "Собери форму регистрации: email, пароль, primary «Регистрация», secondary «Войти».\nЧерез finam-design-system",
] as const;

export function getMcpAgentInstructions() {
  return {
    title: "Design-system compose (finam-design-system MCP → Radix Themes)",
    instructions: COMPOSE_MCP_AGENT_INSTRUCTIONS,
    primaryTool: "composeUi",
    mcpServer: "finam-design-system",
    intentTool: "resolveComposeIntent",
    prerequisiteMcpServers: ["finam-design-system (required)", "Figma MCP (figma URLs only)"],
    userPromptExamples: [...COMPOSE_USER_PROMPT_EXAMPLES],
    composeAnchorPhrase: "Через finam-design-system",
    impliedStack: "@radix-ui/themes via composeUi — user does not name Radix or compose explicitly",
    doNotAskUserFor: ["MCP tool names", "compose keyword", "Radix setup unless troubleshooting"],
  };
}
