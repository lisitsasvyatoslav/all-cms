/**
 * Промпты для пользователей: якорь = только имя MCP-сервера.
 * Инструменты finam-design-system сами подразумевают compose → @radix-ui/themes.
 */

/** Минимальный якорь — достаточно для внешнего чата. */
export const COMPOSE_CHARTER_LINE = "Через finam-design-system";

/** Синонимы в тексте → обязательно MCP compose, запрет hand-code. */
export const COMPOSE_CHARTER_TRIGGERS = [
  "finam-design-system",
  "finam design system",
  "дизайн-система финама",
  "дизайн система финама",
  "дизайн-систему финама",
  "дизайн систему финама",
  "дизайн-система finam",
  "дизайн система finam",
  "design-system-portal",
  "design system portal",
  "через finam-design-system",
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
  /** default: include «Через finam-design-system» */
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
      "Достаточно упомянуть MCP finam-design-system. Слово compose и перечень tools не нужны — сервер отдаёт composeUi и registry Radix Themes.",
    whyPlainPromptFailsOutsideRepo:
      "«Собери макет» + Figma URL без «finam-design-system» → агент часто пишет HTML вручную. Добавьте строку «Через finam-design-system» и подключите MCP.",
    prerequisites: [
      "Cursor Settings → MCP → finam-design-system (зелёный)",
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
    copyPasteUserRule: `Если пользователь упоминает finam-design-system или «Через finam-design-system» — используй только MCP этого сервера (composeUi). Не пиши HTML/Tailwind вручную. Radix Themes подразумевается инструментами MCP.`,
    doNotUseAlone: [
      "Только «Собери макет» + URL без finam-design-system",
      "Перечисление имён MCP tools (composeUi, validateComposition, …)",
    ],
  };
}
