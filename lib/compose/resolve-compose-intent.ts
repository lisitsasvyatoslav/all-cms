import { getMcpAgentInstructions } from "./agent-instructions";
import { messageRequiresMcpCompose } from "./user-prompts";
import { parseFigmaUrl } from "./figma-url";

const FIGMA_URL_PATTERN =
  /https?:\/\/(?:www\.)?figma\.com\/(?:design|board)\/[^\s)>\]"']+/gi;

/** Фразы, по которым агент должен запускать compose без технического промпта. */
export const COMPOSE_TRIGGER_PHRASES = [
  "собери макет",
  "собери форму",
  "собери страницу",
  "собери ui",
  "собери интерфейс",
  "сделай форму",
  "сделай макет",
  "сверстай",
  "compose",
  "build ui",
  "build this design",
  "implement this design",
  "from figma",
  "из figma",
] as const;

export type ComposeIntentPipeline = "figma" | "text";

export type ComposeIntent = {
  shouldCompose: boolean;
  /** Пользователь явно потребовал MCP compose (якорь design-system-portal / compose). */
  requiresMcpCompose: boolean;
  pipeline: ComposeIntentPipeline;
  figmaUrl?: string;
  figmaUrlParsing?: ReturnType<typeof parseFigmaUrl>;
  userRequest: string;
  primaryTool: string;
  mcpServer: "design-system-portal";
  forbiddenApproaches: string[];
  agentWorkflow: string[];
  userPromptExamples: string[];
  warningIfMissingAnchor?: string;
};

function extractFigmaUrl(message: string): string | undefined {
  const match = message.match(FIGMA_URL_PATTERN);
  return match?.[0];
}

function matchesComposeTrigger(message: string): boolean {
  const lower = message.toLowerCase();
  if (FIGMA_URL_PATTERN.test(message)) return true;
  return COMPOSE_TRIGGER_PHRASES.some((phrase) => lower.includes(phrase));
}

function looksLikeUiDescription(message: string): boolean {
  const lower = message.toLowerCase();
  const uiKeywords = [
    "кнопк",
    "button",
    "input",
    "инпут",
    "поле",
    "форм",
    "form",
    "card",
    "карточ",
    "modal",
    "модал",
    "вкладк",
    "tabs",
    "регистрац",
    "login",
    "вход",
    "password",
    "парол",
    "email",
  ];
  return uiKeywords.filter((word) => lower.includes(word)).length >= 2;
}

export function resolveComposeIntent(userMessage: string): ComposeIntent {
  const trimmed = userMessage.trim();
  const figmaUrl = extractFigmaUrl(trimmed);
  const figmaUrlParsing = figmaUrl ? parseFigmaUrl(figmaUrl) : undefined;
  const hasFigma = Boolean(figmaUrl);
  const requiresMcp = messageRequiresMcpCompose(trimmed);
  const shouldCompose =
    requiresMcp ||
    hasFigma ||
    matchesComposeTrigger(trimmed) ||
    looksLikeUiDescription(trimmed);

  const pipeline: ComposeIntentPipeline = hasFigma ? "figma" : "text";
  const info = getMcpAgentInstructions();

  const forbiddenApproaches = requiresMcp
    ? [
        "Hand-written HTML/CSS/Tailwind JSX",
        "Generic React components not from design-system-portal composeUi output",
      ]
    : [];

  const warningIfMissingAnchor =
    shouldCompose && !requiresMcp
      ? "Prompt has no design-system-portal anchor. Outside this repo the agent may hand-code UI. Recommend appending: «Через design-system-portal»."
      : undefined;

  const agentWorkflow =
    pipeline === "figma"
      ? [
          "REQUIRED: design-system-portal MCP must be connected",
          "Figma MCP: read mockup (fileKey + nodeId from URL)",
          `design-system-portal ${info.primaryTool}: figmaUrl + designBrief → TSX (@radix-ui/themes)`,
          "NEVER substitute with hand-written HTML/Tailwind",
        ]
      : [
          "REQUIRED: design-system-portal MCP must be connected",
          "Map user text to Design Brief",
          `design-system-portal ${info.primaryTool}: designBrief → TSX (@radix-ui/themes)`,
          "NEVER substitute with hand-written HTML/Tailwind",
        ];

  return {
    shouldCompose,
    requiresMcpCompose: requiresMcp,
    pipeline,
    figmaUrl,
    figmaUrlParsing,
    userRequest: trimmed,
    primaryTool: info.primaryTool,
    mcpServer: "design-system-portal",
    forbiddenApproaches,
    agentWorkflow,
    userPromptExamples: info.userPromptExamples,
    warningIfMissingAnchor,
  };
}
