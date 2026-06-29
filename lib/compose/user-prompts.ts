/**
 * Промпты для пользователей: якорь = только имя MCP-сервера.
 * Инструменты design-system-portal сами подразумевают compose → @radix-ui/themes.
 */

/** Минимальный якорь — достаточно для внешнего чата. */
export const COMPOSE_CHARTER_LINE = "Через design-system-portal";

/** Синонимы в тексте → обязательно MCP compose, запрет hand-code. */
export const COMPOSE_CHARTER_TRIGGERS = [
  "design-system-portal",
  "design system portal",
  "через design-system-portal",
  "через design-system",
  "через портал",
  "portal compose",
  "compose radix",
  "radix themes compose",
  "через compose",
  "только radix",
  "only radix",
  "без ручной",
  "without hand",
  "no hand-written",
  "не пиши jsx",
  "не верстай",
] as const;

/** @deprecated Use COMPOSE_CHARTER_LINE */
export const COMPOSE_CHARTER_SHORT = COMPOSE_CHARTER_LINE;

export type BuildUserPromptOptions = {
  figmaUrl?: string;
  task?: string;
  /** default: include «Через design-system-portal» */
  includeAnchor?: boolean;
};

export function buildRecommendedComposePrompt(options: BuildUserPromptOptions = {}): string {
  const { figmaUrl, task = "Собери макет.", includeAnchor = true } = options;

  const parts: string[] = [];
  if (figmaUrl?.trim()) parts.push(figmaUrl.trim());
  parts.push(task.trim());
  if (includeAnchor) parts.push(COMPOSE_CHARTER_LINE);

  return parts.join("\n");
}

export function messageRequiresMcpCompose(message: string): boolean {
  const lower = message.toLowerCase();
  return COMPOSE_CHARTER_TRIGGERS.some((phrase) => lower.includes(phrase.toLowerCase()));
}

export function getComposeUserPromptGuide() {
  return {
    summary:
      "Достаточно упомянуть MCP design-system-portal. Слово compose и перечень tools не нужны — сервер отдаёт composeUi и registry Radix Themes.",
    whyPlainPromptFailsOutsideRepo:
      "«Собери макет» + Figma URL без «design-system-portal» → агент часто пишет HTML вручную. Добавьте строку «Через design-system-portal» и подключите MCP.",
    prerequisites: [
      "Cursor Settings → MCP → design-system-portal (зелёный)",
      "Figma URL → также Figma MCP",
      "localhost MCP → dev-сервер портала запущен",
    ],
    recommendedPrompts: {
      figma: buildRecommendedComposePrompt({
        figmaUrl:
          "https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=1-25110",
        task: "Собери макет.",
      }),
      text: buildRecommendedComposePrompt({
        task:
          "Собери форму регистрации: email, пароль, primary «Регистрация», secondary «Войти».",
      }),
    },
    composeAnchorPhrase: COMPOSE_CHARTER_LINE,
    impliedByMcpServer: [
      "composeUi → TSX только @radix-ui/themes",
      "getComponentRegistry → допустимые Radix-компоненты",
      "resolveComposeIntent → pipeline figma/text",
    ],
    copyPasteUserRule: `Если пользователь упоминает design-system-portal или «Через design-system-portal» — используй только MCP этого сервера (composeUi). Не пиши HTML/Tailwind вручную. Radix Themes подразумевается инструментами MCP.`,
    doNotUseAlone: [
      "Только «Собери макет» + URL без design-system-portal",
      "Перечисление имён MCP tools (composeUi, validateComposition, …)",
    ],
  };
}
