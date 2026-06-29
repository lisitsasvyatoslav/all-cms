import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveComposeIntent } from "./resolve-compose-intent";
import {
  buildRecommendedComposePrompt,
  messageRequiresMcpCompose,
} from "./user-prompts";

const CANONICAL_FIGMA_PROMPT = `https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=1-25110
Собери макет.
Через design-system-portal`;

describe("resolveComposeIntent", () => {
  it("detects figma URL + plain «собери макет»", () => {
    const result = resolveComposeIntent(
      "https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=1-25110\n\nСобери макет.",
    );

    assert.equal(result.shouldCompose, true);
    assert.equal(result.pipeline, "figma");
    assert.equal(result.requiresMcpCompose, false);
    assert.ok(result.warningIfMissingAnchor);
  });

  it("canonical prompt: figma + собери макет + design-system-portal", () => {
    const result = resolveComposeIntent(CANONICAL_FIGMA_PROMPT);

    assert.equal(result.shouldCompose, true);
    assert.equal(result.requiresMcpCompose, true);
    assert.equal(result.pipeline, "figma");
    assert.ok(result.forbiddenApproaches.length > 0);
    assert.equal(result.warningIfMissingAnchor, undefined);
    assert.equal(result.primaryTool, "composeUi");
    assert.equal(result.mcpServer, "design-system-portal");
  });

  it("detects text-only registration form request", () => {
    const result = resolveComposeIntent(
      'Собери форму регистрации на сайт из инпутов email и пароль, кнопки primary "Регистрация" и кнопки secondary для перехода на страницу логина',
    );

    assert.equal(result.shouldCompose, true);
    assert.equal(result.pipeline, "text");
  });
});

describe("buildRecommendedComposePrompt", () => {
  it("includes minimal design-system-portal anchor", () => {
    const prompt = buildRecommendedComposePrompt({
      figmaUrl: "https://www.figma.com/design/x/y?node-id=1-2",
      task: "Собери макет.",
    });
    assert.match(prompt, /Через design-system-portal/);
    assert.doesNotMatch(prompt, /compose — только/);
  });

  it("matches canonical figma prompt shape", () => {
    const prompt = buildRecommendedComposePrompt({
      figmaUrl:
        "https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=1-25110",
      task: "Собери макет.",
    });
    assert.equal(prompt, CANONICAL_FIGMA_PROMPT);
  });
});

describe("messageRequiresMcpCompose", () => {
  it("matches design-system-portal anchor only", () => {
    assert.equal(messageRequiresMcpCompose("через design-system-portal"), true);
    assert.equal(messageRequiresMcpCompose(CANONICAL_FIGMA_PROMPT), true);
    assert.equal(messageRequiresMcpCompose("Собери макет"), false);
  });
});
