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
  /** Пользователь явно потребовал MCP compose (якорь finam-design-system / compose). */
  requiresMcpCompose: boolean;
  pipeline: ComposeIntentPipeline;
  figmaUrl?: string;
  figmaUrlParsing?: ReturnType<typeof parseFigmaUrl>;
  userRequest: string;
  primaryTool: string;
  mcpServer: "finam-design-system";
  forbiddenApproaches: string[];
  planningPolicy: {
    doNotPromiseToReproduceAntiPatterns: true;
    rulePriority: "Payload component Do/Don't rules override Figma fidelity";
    requiredPlanLanguage: string;
  };
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
        "Generic React components not from finam-design-system composeUi output",
        "Reproducing a detected or suspected UI anti-pattern just because it exists in Figma",
        "Promising in the plan that a known anti-pattern will be implemented as-is and only mentioned in the report",
      ]
    : [];

  const planningPolicy: ComposeIntent["planningPolicy"] = {
    doNotPromiseToReproduceAntiPatterns: true,
    rulePriority: "Payload component Do/Don't rules override Figma fidelity",
    requiredPlanLanguage:
      "If the Figma mockup contains or appears to contain a component anti-pattern, state that the generated UI will correct it according to Payload Do/Don't rules. Example: «Распознал анти-паттерн: две primary-кнопки в одной модалке. Соберу исправленный вариант: одна primary-кнопка, второе действие — ghost/soft/link.» Never say that you will reproduce the anti-pattern as-is.",
  };

  const warningIfMissingAnchor =
    shouldCompose && !requiresMcp
      ? "Prompt has no finam-design-system anchor. Outside this repo the agent may hand-code UI. Recommend appending: «Через finam-design-system»."
      : undefined;

  const agentWorkflow =
    pipeline === "figma"
      ? [
          "REQUIRED: finam-design-system MCP must be connected",
          "Read cmsGuidance from this resolveComposeIntent response and apply every /ds principle",
          "Figma MCP: read mockup (fileKey + nodeId from URL)",
          "Before presenting any plan, apply planningPolicy: do not promise to reproduce detected or suspected anti-patterns; say you will correct them through Payload Do/Don't rules",
          `finam-design-system ${info.primaryTool}: guidanceRevision + figmaUrl + CMS-aware designBrief → TSX`,
          "NEVER substitute with hand-written HTML/Tailwind",
        ]
      : [
          "REQUIRED: finam-design-system MCP must be connected",
          "Read cmsGuidance from this response, then map user text to a Design Brief that follows every /ds principle",
          `finam-design-system ${info.primaryTool}: guidanceRevision + CMS-aware designBrief → TSX`,
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
    mcpServer: "finam-design-system",
    forbiddenApproaches,
    planningPolicy,
    agentWorkflow,
    userPromptExamples: info.userPromptExamples,
    warningIfMissingAnchor,
  };
}
