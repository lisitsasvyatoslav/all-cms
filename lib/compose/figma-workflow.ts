import { DESIGN_BRIEF_KINDS, DESIGN_BRIEF_VERSION } from "./design-brief";
import { parseFigmaUrl } from "./figma-url";
import { getRegistrySummary } from "./registry";
import { COMPOSITION_VERSION } from "./types";

const EXAMPLE_BRIEF_FROM_FIGMA = {
  version: DESIGN_BRIEF_VERSION,
  figmaUrl: "https://www.figma.com/design/FILE_KEY/File?node-id=1-234",
  root: {
    kind: "card",
    props: { title: "Sign in", variant: "surface" },
    figmaName: "Login card",
    children: [
      {
        kind: "input",
        props: { placeholder: "Email", type: "email" },
        figmaName: "Email field",
      },
      {
        kind: "input",
        props: { placeholder: "Password", type: "password" },
        figmaName: "Password field",
      },
      {
        kind: "button",
        props: { variant: "primary" },
        text: "Sign in",
        figmaName: "Primary button",
      },
    ],
  },
} as const;

export function getFigmaComposeWorkflow(figmaUrl?: string) {
  const parsedUrl = figmaUrl ? parseFigmaUrl(figmaUrl) : undefined;

  return {
    title: "Figma → Radix Themes compose (dual MCP workflow)",
    summary:
      "Use the user's Figma MCP to read the mockup, map it to a Design Brief, then planCompositionFromBrief → validateComposition → renderComposition. Never copy raw HTML/Tailwind from Figma into the project.",
    prerequisites: {
      mcpServers: [
        "Figma MCP (plugin-figma / user-Figma) — get_design_context, get_screenshot",
        "design-system-portal — getFigmaComposeWorkflow, planCompositionFromBrief, validateComposition, renderComposition",
      ],
    },
    workflow: [
      {
        step: 1,
        tool: "getFigmaComposeWorkflow",
        action: "Read this guide (optionally pass figmaUrl for parsed fileKey/nodeId).",
      },
      {
        step: 2,
        mcp: "Figma MCP",
        tool: "get_design_context",
        action:
          "Call with fileKey + nodeId from parsed URL. Use screenshot for layout hierarchy if needed.",
      },
      {
        step: 3,
        mcp: "Figma MCP",
        tool: "get_screenshot",
        action: "Optional visual reference for spacing and grouping.",
      },
      {
        step: 4,
        action:
          "Map frames/text/buttons/inputs to Design Brief kinds (table below). Ignore Tailwind/CSS from Figma reference code.",
      },
      {
        step: 5,
        tool: "getComponentRegistry",
        action: "Confirm props and enums for mapped components.",
      },
      {
        step: 6,
        tool: "planCompositionFromBrief",
        action: "Convert Design Brief → Composition JSON.",
      },
      {
        step: 7,
        tool: "validateComposition",
        action: "Fix until valid: true.",
      },
      {
        step: 8,
        tool: "renderComposition",
        action: "Get TSX + projectSetup; post in chat (Design Brief, Composition JSON, validation, tsx). Do not write project files unless user asks.",
      },
    ],
    figmaUrlParsing: {
      input: figmaUrl,
      parsed: parsedUrl && "error" in parsedUrl ? parsedUrl : parsedUrl ?? null,
      rules: [
        "figma.com/design/:fileKey/...?node-id=1-2 → nodeId \"1:2\" for Figma MCP",
        "figma.com/design/:fileKey/branch/:branchKey/... → use branchKey as fileKey",
        "Always pass node-id from the URL the user shared when calling get_design_context",
      ],
      figmaMcpCallExample:
        parsedUrl && !("error" in parsedUrl)
          ? {
              tool: "get_design_context",
              fileKey: parsedUrl.fileKey,
              nodeId: parsedUrl.nodeId ?? "(select a frame node in URL)",
            }
          : null,
    },
    figmaToKindMapping: [
      { figmaPattern: "Primary / CTA button", kind: "button", propsHint: { variant: "primary" } },
      { figmaPattern: "Secondary / outline button", kind: "button", propsHint: { variant: "outline" } },
      { figmaPattern: "Text field / input", kind: "input", propsHint: { placeholder: "..." } },
      { figmaPattern: "Dropdown", kind: "select", propsHint: { options: [{ value: "a", label: "A" }] } },
      { figmaPattern: "Checkbox", kind: "checkbox", propsHint: {} },
      { figmaPattern: "Card / panel / form container", kind: "card", propsHint: { title: "...", variant: "surface" } },
      { figmaPattern: "Alert / callout", kind: "alert", propsHint: { alertVariant: "info" } },
      { figmaPattern: "Badge / tag", kind: "badge", propsHint: {} },
      { figmaPattern: "Link", kind: "link", propsHint: {} },
      { figmaPattern: "Modal / dialog frame", kind: "modal", propsHint: { title: "...", preview: true } },
      { figmaPattern: "Tabs row + panels", kind: "tabs", propsHint: { defaultValue: "tab1" } },
      { figmaPattern: "Illustration / hero image", kind: "illustration", propsHint: { src: "...", alt: "..." } },
      { figmaPattern: "Password field with visibility toggle", kind: "passwordInput", propsHint: { placeholder: "..." } },
      { figmaPattern: "Icon button / dismiss", kind: "button", propsHint: { variant: "ghost" } },
      { figmaPattern: "Generic vertical stack inside card", kind: "group", propsHint: {} },
    ],
    designBriefSchema: {
      version: DESIGN_BRIEF_VERSION,
      allowedKinds: DESIGN_BRIEF_KINDS,
      shape: {
        version: `"${DESIGN_BRIEF_VERSION}"`,
        figmaUrl: "optional string",
        root: "{ kind, props?, text?, figmaName?, children? }",
      },
      kindToComponent: {
        card: "Card (+ Heading/Text for title from props.title)",
        flex: "Flex",
        button: "Button (variant primary→solid mapped automatically)",
        input: "TextField.Root",
        select: "Select.Root (+ options → Select.Item children)",
        checkbox: "Checkbox",
        badge: "Badge",
        link: "Link",
        alert: "Callout.Root",
        modal: "Dialog.Root (+ Dialog.Content/Title/Description)",
        illustration: "Avatar (props.src, props.alt)",
        passwordInput: "TextField.Root type=password",
        heading: "Heading",
        text: "Text",
        tabs: "Tabs.Root (+ tabList/tab/tabPanel children)",
        tabList: "Tabs.List",
        tab: "Tabs.Trigger (props.value required)",
        tabPanel: "Tabs.Content (props.value required)",
        group: "transparent — flattens children (use inside card)",
      },
      rules: [
        "Only use kinds listed in allowedKinds.",
        "Target: @radix-ui/themes only — not @next-app/ui-kit.",
        "Do not put HTML/CSS from Figma reference code into the brief.",
        "Use figmaName for traceability (Figma layer name).",
        "For buttons, set props.variant or props.figmaStyle (primary/outline/ghost/danger) — mapped to Radix variants.",
        "Select requires props.options array.",
        "If a Figma element has no Radix equivalent, omit it or approximate with the closest kind.",
      ],
    },
    exampleBrief: EXAMPLE_BRIEF_FROM_FIGMA,
    compositionVersion: COMPOSITION_VERSION,
    registryComponentCount: getRegistrySummary().componentCount,
  };
}
