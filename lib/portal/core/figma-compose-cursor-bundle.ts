import {
  buildDesignSystemPortalMcpDeeplink,
  CURSOR_MCP_SERVER_NAME,
  readDefaultMcpApiKey,
} from "@/lib/portal/core/cursor-mcp-install";
import {
  COMPOSE_MCP_AGENT_INSTRUCTIONS,
  CURSOR_USER_RULE_FIGMA_COMPOSE,
} from "@/lib/compose/agent-instructions";
import { buildRecommendedComposePrompt } from "@/lib/compose/user-prompts";

/** Демо-макет Figma-to-Code showcase. */
export const FIGMA_COMPOSE_EXAMPLE_URL =
  "https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=0-1";

export function buildFigmaComposeExamplePrompt(
  figmaUrl = FIGMA_COMPOSE_EXAMPLE_URL,
): string {
  return buildRecommendedComposePrompt({
    figmaUrl,
    task: "Собери макет.",
  });
}

export function buildTextComposeExamplePrompt(): string {
  return buildRecommendedComposePrompt({
    task:
      "Собери форму регистрации: email, пароль, primary «Регистрация», secondary «Войти».",
  });
}

export function buildFigmaComposeSetupChecklist(): string {
  return [
    "Design-system compose: one-time setup in Cursor",
    "",
    "1. Install finam-design-system MCP (Add to Cursor on portal or deeplink).",
    "2. For Figma mockups: enable Figma MCP in Cursor Settings.",
    "3. Cursor Settings → Rules: paste User Rule from buildCursorUserRuleForFigmaCompose() — REQUIRED outside this repo.",
    "4. Optional: project rule .cursor/rules/design-system-compose.mdc (only when repo is open).",
    "5. Restart MCP servers in Cursor.",
    "",
    "Then paste in chat (no MCP tool names):",
    "",
    "Example A (Figma):",
    buildFigmaComposeExamplePrompt(),
    "",
    "Example B (text):",
    buildTextComposeExamplePrompt(),
    "",
    "Agent runs compose via MCP — user adds one anchor line, not tool names.",
  ].join("\n");
}

export function buildCursorUserRuleForFigmaCompose(): string {
  return CURSOR_USER_RULE_FIGMA_COMPOSE;
}

export function buildFigmaComposeCursorBundleText(apiKey?: string): string {
  const key = apiKey?.trim() || readDefaultMcpApiKey();
  const deeplink = buildDesignSystemPortalMcpDeeplink(key);

  return [
    buildFigmaComposeSetupChecklist(),
    "",
    "--- MCP install ---",
    `Server: ${CURSOR_MCP_SERVER_NAME}`,
    `Deeplink: ${deeplink}`,
    "",
    "--- Agent instructions (for reference) ---",
    COMPOSE_MCP_AGENT_INSTRUCTIONS,
    "",
    "--- User rule (optional, Cursor Settings → Rules) ---",
    CURSOR_USER_RULE_FIGMA_COMPOSE,
  ].join("\n");
}
