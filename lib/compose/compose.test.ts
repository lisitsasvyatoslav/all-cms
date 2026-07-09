import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COMPOSITION_VERSION,
  auditAndCorrectGlossary,
  getComposeGuide,
  getComposeProjectSetup,
  getRegistrySummary,
  renderComposition,
  validateComposition,
} from "./index";
import { validateComponentAudit } from "../mcp/compose-agent";

const loginCard = {
  version: COMPOSITION_VERSION,
  root: {
    component: "Card",
    props: {
      variant: "surface",
    },
    children: [
      {
        component: "Heading",
        props: { size: "3" },
        text: "Вход",
      },
      {
        component: "Text",
        props: { size: "2", color: "gray", as: "p" },
        text: "Введите email и пароль",
      },
      {
        component: "TextField.Root",
        props: { placeholder: "Email", type: "email" },
      },
      {
        component: "TextField.Root",
        props: { placeholder: "Пароль", type: "password" },
      },
      {
        component: "Button",
        props: { variant: "solid" },
        text: "Войти",
      },
    ],
  },
};

describe("compose registry", () => {
  it("includes Radix Themes components and compound parts", () => {
    const summary = getRegistrySummary();
    assert.ok(summary.componentCount >= 40);
    assert.equal(summary.package, "@radix-ui/themes");
    assert.ok(summary.components.some((entry) => entry.id === "Button"));
    assert.ok(summary.components.some((entry) => entry.id === "TextField.Root"));
    assert.ok(summary.components.some((entry) => entry.id === "Tabs.Root"));
    assert.ok(summary.components.some((entry) => entry.id === "Tabs.Trigger"));
    assert.ok(summary.components.some((entry) => entry.id === "Flex"));
    assert.equal(summary.compose.callFirst, "getComposeGuide");
  });
});

describe("getComposeGuide", () => {
  it("is self-contained for agents without repo access", () => {
    const guide = getComposeGuide();
    assert.match(guide.title, /Radix Themes/i);
    assert.match(guide.summary, /@radix-ui\/themes/);
    assert.equal(guide.compositionSchema.version, COMPOSITION_VERSION);
    assert.ok(guide.examples.loginCard);
    assert.ok(guide.registry.componentCount >= 40);
  });

  it("includes Radix install hints", () => {
    const setup = getComposeProjectSetup();
    assert.equal(setup.packageName, "@radix-ui/themes");
    assert.ok(setup.css.required[0]?.includes("@radix-ui/themes/styles.css"));
    assert.ok(setup.install.commands[0]?.includes("@radix-ui/themes"));
  });
});

describe("validateComposition", () => {
  it("accepts a valid login card", () => {
    const result = validateComposition(loginCard);
    assert.equal(result.valid, true);
    assert.equal(result.issues.length, 0);
  });

  it("rejects unknown components", () => {
    const result = validateComposition({
      version: COMPOSITION_VERSION,
      root: { component: "NotAComponent" },
    });
    assert.equal(result.valid, false);
    assert.match(result.issues[0]?.message ?? "", /Неизвестный компонент/);
  });

  it("rejects ui-kit-only component ids", () => {
    const result = validateComposition({
      version: COMPOSITION_VERSION,
      root: { component: "Input", props: { placeholder: "x" } },
    });
    assert.equal(result.valid, false);
    assert.equal(result.issues[0]?.code, "unknown_component");
  });

  it("rejects invalid enum props", () => {
    const result = validateComposition({
      version: COMPOSITION_VERSION,
      root: {
        component: "Button",
        props: { variant: "neon" },
        text: "Go",
      },
    });
    assert.equal(result.valid, false);
    assert.equal(result.issues[0]?.code, "invalid_prop");
  });

  it("requires Select.Item value", () => {
    const result = validateComposition({
      version: COMPOSITION_VERSION,
      root: {
        component: "Select.Root",
        children: [
          { component: "Select.Trigger" },
          {
            component: "Select.Content",
            children: [{ component: "Select.Item", props: {} }],
          },
        ],
      },
    });
    assert.equal(result.valid, false);
    assert.equal(result.issues[0]?.code, "missing_required_prop");
  });
});

describe("renderComposition", () => {
  it("renders TSX with @radix-ui/themes imports", () => {
    const { tsx, imports } = renderComposition(loginCard, {
      componentName: "LoginCard",
    });

    assert.deepEqual(
      imports.sort(),
      ["Button", "Card", "Heading", "Text", "TextField"].sort(),
    );
    assert.match(tsx, /import \{ Button, Card, Heading, Text, TextField \} from "@radix-ui\/themes"/);
    assert.match(tsx, /export function LoginCard\(\)/);
    assert.match(tsx, /<Heading size="3">/);
    assert.match(tsx, /<TextField\.Root placeholder="Email" type="email" \/>/);
    assert.match(tsx, /Войти/);
  });

  it("renders compound Tabs", () => {
    const composition = {
      version: COMPOSITION_VERSION,
      root: {
        component: "Tabs.Root",
        props: { defaultValue: "one" },
        children: [
          {
            component: "Tabs.List",
            children: [
              {
                component: "Tabs.Trigger",
                props: { value: "one" },
                text: "One",
              },
              {
                component: "Tabs.Trigger",
                props: { value: "two" },
                text: "Two",
              },
            ],
          },
          {
            component: "Tabs.Content",
            props: { value: "one" },
            text: "Panel one",
          },
        ],
      },
    };

    const result = validateComposition(composition);
    assert.equal(result.valid, true);

    const { tsx } = renderComposition(composition);
    assert.match(tsx, /import \{ Tabs \}/);
    assert.match(tsx, /<Tabs\.Root defaultValue="one">/);
    assert.match(tsx, /<Tabs\.Trigger value="one">/);
  });
});

describe("Payload component rule audit", () => {
  const guidance = {
    revision: "rules-v1",
    usedComponentIds: ["Button"],
    requestedSlugs: ["button"],
    loadedSlugs: ["button"],
    slugsWithoutDoDont: [],
    guidelines: [
      {
        componentIds: ["Button"],
        slug: "button",
        heading: "Button guidelines",
        intro: "",
        dos: ["Use one primary action."],
        donts: ["Don't use multiple primary actions."],
      },
    ],
  };

  it("rejects a blanket reviewed flag when individual CMS rules were skipped", () => {
    const result = validateComponentAudit(
      { reviewed: true, ruleReviews: [], findings: [] },
      guidance,
    );
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.errors.length, 2);
    assert.match(result.errors[0] ?? "", /missing/);
  });

  it("requires a concrete correction for a detected violation", () => {
    const result = validateComponentAudit(
      {
        reviewed: true,
        ruleReviews: [
          {
            guidelineSlug: "button",
            ruleType: "do",
            rule: "Use one primary action.",
            outcome: "compliant",
            evidence: "Only one primary action is present.",
          },
          {
            guidelineSlug: "button",
            ruleType: "dont",
            rule: "Don't use multiple primary actions.",
            outcome: "violation",
            evidence: "Two primary buttons are present.",
          },
        ],
        findings: [],
      },
      guidance,
    );
    assert.equal(result.success, false);
    if (result.success) return;
    assert.match(result.errors.join("\n"), /requires a matching correction/);
  });
});

describe("Payload glossary audit", () => {
  const guidance = {
    revision: "test",
    terms: [
      { id: 1, preferred: "Email", avoid: ["E-mail", "Имейл"] },
      { id: 2, preferred: "Электронная почта", avoid: ["Почта"] },
      { id: 3, preferred: "Войти", avoid: ["Авторизация"] },
      { id: 4, preferred: "Вход", avoid: ["Авторизация"] },
    ],
  };

  it("corrects visible UI wording from Payload terms", () => {
    const result = auditAndCorrectGlossary(
      {
        version: COMPOSITION_VERSION,
        root: {
          component: "Flex",
          children: [
            { component: "Heading", text: "Введите Имейл" },
            { component: "TextField.Root", props: { placeholder: "Ваш E-mail" } },
          ],
        },
      },
      guidance,
    );

    assert.equal(result.composition.root.children?.[0]?.text, "Введите Email");
    assert.equal(result.composition.root.children?.[1]?.props?.placeholder, "Ваш Email");
    assert.equal(result.corrections.length, 2);
  });

  it("does not replace an avoid word inside an already preferred phrase", () => {
    const result = auditAndCorrectGlossary(
      {
        version: COMPOSITION_VERSION,
        root: { component: "Text", text: "Укажите электронную почту" },
      },
      guidance,
    );

    assert.equal(result.composition.root.text, "Укажите электронную почту");
    assert.equal(result.corrections.length, 0);
  });

  it("reports ambiguous glossary variants without guessing", () => {
    const result = auditAndCorrectGlossary(
      {
        version: COMPOSITION_VERSION,
        root: { component: "Heading", text: "Авторизация" },
      },
      guidance,
    );

    assert.equal(result.composition.root.text, "Авторизация");
    assert.deepEqual(result.ambiguousMatches[0]?.preferredCandidates, ["Войти", "Вход"]);
  });
});
