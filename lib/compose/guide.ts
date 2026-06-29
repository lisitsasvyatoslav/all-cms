import { getMcpAgentInstructions } from "./agent-instructions";
import { getComponentRegistry, getRegistrySummary } from "./registry";
import { COMPOSITION_VERSION } from "./types";

const EXAMPLE_LOGIN_CARD = {
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
        text: "Sign in",
      },
      {
        component: "Text",
        props: { size: "2", color: "gray", as: "p" },
        text: "Enter your credentials",
      },
      {
        component: "TextField.Root",
        props: { placeholder: "Email", type: "email" },
      },
      {
        component: "TextField.Root",
        props: { placeholder: "Password", type: "password" },
      },
      {
        component: "Button",
        props: { variant: "solid" },
        text: "Sign in",
      },
    ],
  },
} as const;

const EXAMPLE_TABS = {
  version: COMPOSITION_VERSION,
  root: {
    component: "Tabs.Root",
    props: { defaultValue: "profile" },
    children: [
      {
        component: "Tabs.List",
        children: [
          {
            component: "Tabs.Trigger",
            props: { value: "profile" },
            text: "Profile",
          },
          {
            component: "Tabs.Trigger",
            props: { value: "settings" },
            text: "Settings",
          },
        ],
      },
      {
        component: "Tabs.Content",
        props: { value: "profile" },
        text: "Profile content",
      },
      {
        component: "Tabs.Content",
        props: { value: "settings" },
        text: "Settings content",
      },
    ],
  },
} as const;

/** Instructions for using generated TSX in the user's project (agent may not see the repo). */
export function getComposeProjectSetup() {
  const registry = getComponentRegistry();

  return {
    packageName: registry.package,
    packageVersion: registry.version,
    peerDependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
    install: {
      note: "@radix-ui/themes is published on npm — no private registry required.",
      commands: ["npm install @radix-ui/themes react react-dom"],
    },
    css: {
      required: ['import "@radix-ui/themes/styles.css";'],
      optional: [
        "Project-specific theme overrides via CSS variables or Theme props.",
      ],
    },
    appWrapper: {
      description:
        "Wrap the app (or Storybook preview) in Radix Theme so tokens resolve.",
      example: [
        'import { Theme } from "@radix-ui/themes";',
        "",
        "export function AppProviders({ children }: { children: React.ReactNode }) {",
        '  return <Theme accentColor="indigo">{children}</Theme>;',
        "}",
      ].join("\n"),
    },
    generatedFileHints: [
      'renderComposition adds "use client" by default — suitable for Next.js App Router client components.',
      "Default: paste generated TSX in the chat reply (Design Brief + Composition JSON + validation + tsx).",
      "Write files to the user's project only when they explicitly ask to save or scaffold.",
      "Do not hand-write Radix JSX — always use validateComposition + renderComposition.",
      "Only @radix-ui/themes imports — not @next-app/ui-kit.",
    ],
  };
}

/** @deprecated Use getComposeProjectSetup */
export const getUiKitProjectSetup = getComposeProjectSetup;

export function getComposeGuide() {
  const registry = getRegistrySummary();

  return {
    title: "Radix Themes Compose — agent workflow (no repo access required)",
    summary:
      "Build UI blocks/pages by planning a Composition JSON tree, validating it, and rendering deterministic TSX from @radix-ui/themes only.",
    workflow: [
      {
        step: 0,
        tool: "resolveComposeIntent",
        action:
          "User mentions design-system-portal or «Через design-system-portal» (Figma URL, «собери макет», form text) — call with full user message. Server name implies Radix compose; do not ask for tool names.",
      },
      {
        step: 1,
        tool: "composeUi",
        action:
          "After Design Brief is ready (from Figma MCP or user text): pass designBrief (+ figmaUrl if any) → TSX in one call.",
      },
      {
        step: 2,
        tool: "getComposeGuide",
        action: "Troubleshooting or text-only compose reference.",
      },
    ],
    compositionSchema: {
      version: COMPOSITION_VERSION,
      description: "Root document shape",
      shape: {
        version: `"${COMPOSITION_VERSION}" (required)`,
        root: "CompositionNode (required)",
      },
      node: {
        component:
          "string — registry id, e.g. Button, Card, TextField.Root, Tabs.Trigger, Dialog.Content",
        props: "optional object — only keys listed in registry for that component",
        text: "optional string — text child (maps to JSX text content)",
        children: "optional CompositionNode[] — nested components",
      },
      rules: [
        "Target package: @radix-ui/themes only — never @next-app/ui-kit.",
        "Use ids from getComponentRegistry (field id), e.g. TextField.Root not Input.",
        "Button variant: solid | soft | outline | ghost (not ui-kit primary/secondary).",
        "Card has no title prop — use Heading + Text children.",
        "Do not invent props or enum values — validateComposition will reject them.",
        "Compound tabs: Tabs.Root → Tabs.List → Tabs.Trigger[]; Tabs.Content siblings with matching value.",
        "Select: Select.Root → Select.Trigger + Select.Content → Select.Item[] (or use Design Brief kind select with options).",
        "Dialog (modal): Dialog.Root → Dialog.Content → Dialog.Title, Dialog.Description, …",
        "Do not use bare Tabs or Select — use Tabs.Root / Select.Root.",
      ],
    },
    examples: {
      loginCard: EXAMPLE_LOGIN_CARD,
      tabs: EXAMPLE_TABS,
    },
    mcpTools: {
      resolveComposeIntent:
        "FIRST for plain-language user requests: pass userMessage → pipeline + workflow. Never ask user to name tools.",
      composeUi:
        "PRIMARY: Design Brief → validate → render TSX in one call. Use after Figma analysis or text description.",
      composeFromFigmaContext: "Alias of composeUi.",
      getComposeGuide: "Troubleshooting or advanced text-only compose.",
      getFigmaComposeWorkflow: "Figma URL parsing + kind mapping reference.",
      planCompositionFromBrief: "Design Brief → Composition JSON (prefer composeUi).",
      getComponentRegistry: "Allowed Radix Themes components and props.",
      validateComposition: "Validate JSON before render.",
      renderComposition: "JSON → TSX + project setup hints.",
      getComponent: "CMS docs for one portal component (slug: button, input, …).",
      listComponentsFull: "All portal components with showLLM documentation blocks.",
    },
    figmaCompose: {
      primaryTool: "composeUi",
      intentTool: "resolveComposeIntent",
      agentInstructions: getMcpAgentInstructions(),
      userPromptExamples: getMcpAgentInstructions().userPromptExamples,
    },
    projectSetup: getComposeProjectSetup(),
    registry,
  };
}

/** Short pointer embedded in getComponentRegistry for agents that skip the guide. */
export function getRegistryQuickStart() {
  return {
    firstCall: "getComposeGuide",
    compositionVersion: COMPOSITION_VERSION,
    targetPackage: "@radix-ui/themes",
    workflow: "getComposeGuide → getComponentRegistry → validateComposition → renderComposition",
    allowedComponentIds: Object.keys(getComponentRegistry().components).sort(),
  };
}
