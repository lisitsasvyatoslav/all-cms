import type { MCPPluginConfig } from "@payloadcms/plugin-mcp";
import type { PayloadRequest } from "payload";
import { z } from "zod";

import {
  composeFromFigmaContext,
  getComposeGuide,
  getFigmaComposeWorkflow,
  getRegistrySummary,
  getComposeProjectSetup,
  getMcpAgentInstructions,
  planCompositionFromBrief,
  renderComposition,
  resolveComposeIntent,
  validateComposition,
  getComposeUserPromptGuide,
} from "@/lib/compose";

type McpTools = NonNullable<NonNullable<MCPPluginConfig["mcp"]>["tools"]>;

function mcpText(text: string) {
  return {
    content: [{ type: "text" as const, text }],
  };
}

function parseJsonArg(value: unknown, label: string):
  | { success: true; data: unknown }
  | { success: false; error: string } {
  if (value === undefined || value === null || value === "") {
    return { success: false, error: `Provide ${label} (JSON object).` };
  }

  if (typeof value === "object") {
    return { success: true, data: value };
  }

  if (typeof value === "string") {
    try {
      return { success: true, data: JSON.parse(value) as unknown };
    } catch {
      return { success: false, error: `${label} must be valid JSON.` };
    }
  }

  return { success: false, error: `${label} must be a JSON object or JSON string.` };
}

async function handleComposeUi(args: Record<string, unknown>) {
  const parsedBrief = parseJsonArg(args.designBrief, "designBrief");
  if (!parsedBrief.success) {
    return mcpText(
      JSON.stringify(
        {
          success: false,
          message: parsedBrief.error,
          retryHint:
            "Build Design Brief from the user request or Figma mockup, then call composeUi again.",
          agentInstructions: getMcpAgentInstructions(),
        },
        null,
        2,
      ),
    );
  }

  const figmaUrl =
    typeof args.figmaUrl === "string" && args.figmaUrl.trim()
      ? args.figmaUrl.trim()
      : undefined;
  const designContextNote =
    typeof args.designContextNote === "string" && args.designContextNote.trim()
      ? args.designContextNote.trim()
      : undefined;
  const componentName =
    typeof args.componentName === "string" && args.componentName.trim()
      ? args.componentName.trim()
      : undefined;
  const useClient =
    typeof args.useClient === "boolean" ? args.useClient : undefined;

  const result = composeFromFigmaContext({
    figmaUrl,
    designBrief: parsedBrief.data,
    designContextNote,
    componentName,
    useClient,
  });

  return mcpText(JSON.stringify(result, null, 2));
}

export const composeAgentMcpTools: McpTools = [
  {
    name: "getComposeUserPromptGuide",
    description:
      "For humans/docs: minimal user prompts — only «Через design-system-portal» anchor, no MCP tool names. Call when user asks what to paste in a new Cursor chat.",
    parameters: {},
    handler: async () => {
      return mcpText(JSON.stringify(getComposeUserPromptGuide(), null, 2));
    },
  },
  {
    name: "resolveComposeIntent",
    description:
      "Call when user mentions design-system-portal or «Через design-system-portal» (with Figma URL and/or «собери макет»). Returns pipeline + workflow. MCP server name alone implies Radix compose — user must not list tool names.",
    parameters: {
      userMessage: z
        .string()
        .describe("Full user message, e.g. Figma URL + «собери макет» or text form description"),
    },
    handler: async (args: Record<string, unknown>, _req: PayloadRequest) => {
      const userMessage =
        typeof args.userMessage === "string" ? args.userMessage : "";
      const intent = resolveComposeIntent(userMessage);
      return mcpText(
        JSON.stringify(
          {
            ...intent,
            agentInstructions: getMcpAgentInstructions(),
          },
          null,
          2,
        ),
      );
    },
  },
  {
    name: "composeUi",
    description:
      "PRIMARY on design-system-portal MCP. Use when user says «Через design-system-portal» or mentions this server + UI/Figma request. designBrief required; figmaUrl if in message. Output: @radix-ui/themes TSX only — never hand-write HTML/Tailwind. If MCP missing, stop and ask to connect design-system-portal.",
    parameters: {
      figmaUrl: z
        .string()
        .optional()
        .describe("Figma URL from the user message, if any"),
      designBrief: z
        .unknown()
        .describe(
          'Design Brief JSON: { "version": "1", "root": { "kind": "card", "children": [...] } }',
        ),
      designContextNote: z
        .string()
        .optional()
        .describe("Optional one-line note from Figma analysis"),
      componentName: z.string().optional().describe("Exported React function name"),
      useClient: z.boolean().optional().describe('"use client" directive (default true)'),
    },
    handler: async (args: Record<string, unknown>, _req: PayloadRequest) => {
      return handleComposeUi(args);
    },
  },
  {
    name: "composeFromFigmaContext",
    description:
      "Alias of composeUi — prefer composeUi. Same parameters and behavior.",
    parameters: {
      figmaUrl: z.string().optional().describe("Figma URL from the user message"),
      designBrief: z
        .unknown()
        .describe(
          'Design Brief JSON from Figma analysis: { "version": "1", "root": { "kind": "card", "children": [...] } }',
        ),
      designContextNote: z
        .string()
        .optional()
        .describe("Optional one-line note from get_design_context for traceability"),
      componentName: z.string().optional().describe("Exported React function name (default ComposedUI)"),
      useClient: z.boolean().optional().describe('"use client" directive (default true)'),
    },
    handler: async (args: Record<string, unknown>, _req: PayloadRequest) => {
      return handleComposeUi(args);
    },
  },
  {
    name: "getComposeGuide",
    description:
      "Compose guide for troubleshooting. For user requests (Figma URL or plain-language UI) use resolveComposeIntent → composeUi automatically — never ask user to name tools.",
    parameters: {},
    handler: async () => {
      return mcpText(JSON.stringify(getComposeGuide(), null, 2));
    },
  },
  {
    name: "getFigmaComposeWorkflow",
    description:
      "Reference for Figma → compose kinds and parsed fileKey/nodeId. Prefer resolveComposeIntent + composeUi for user-facing requests.",
    parameters: {
      figmaUrl: z
        .string()
        .optional()
        .describe(
          "Figma URL from the user, e.g. https://www.figma.com/design/FILE_KEY/Name?node-id=1-2",
        ),
    },
    handler: async (args: Record<string, unknown>, _req: PayloadRequest) => {
      const figmaUrl =
        typeof args.figmaUrl === "string" && args.figmaUrl.trim()
          ? args.figmaUrl.trim()
          : undefined;
      return mcpText(JSON.stringify(getFigmaComposeWorkflow(figmaUrl), null, 2));
    },
  },
  {
    name: "planCompositionFromBrief",
    description:
      "Lower-level: Design Brief → Composition JSON only. Prefer composeUi for full TSX output.",
    parameters: {
      brief: z
        .unknown()
        .describe(
          'Design Brief: { "version": "1", "figmaUrl"?: string, "root": { "kind": "card", "children": [...] } } — see getFigmaComposeWorkflow',
        ),
    },
    handler: async (args: Record<string, unknown>, _req: PayloadRequest) => {
      const parsed = parseJsonArg(args.brief, "brief");
      if (!parsed.success) {
        return mcpText(parsed.error);
      }

      const planned = planCompositionFromBrief(parsed.data);
      if (!planned.success) {
        return mcpText(JSON.stringify({ success: false, issues: planned.issues }, null, 2));
      }

      const validation = validateComposition(planned.composition);
      return mcpText(
        JSON.stringify(
          {
            success: true,
            composition: planned.composition,
            warnings: planned.warnings,
            validation,
          },
          null,
          2,
        ),
      );
    },
  },
  {
    name: "getComponentRegistry",
    description:
      "Registry of @radix-ui/themes components for compose: ids, props, types, defaults. Call getComposeGuide first. Use field `id` as CompositionNode.component. Target package: @radix-ui/themes only.",
    parameters: {},
    handler: async () => {
      return mcpText(JSON.stringify(getRegistrySummary(), null, 2));
    },
  },
  {
    name: "validateComposition",
    description:
      'Validate Composition JSON before render. Returns { valid, issues[] } with JSON paths. Schema: { version: "1", root: { component, props?, text?, children? } }.',
    parameters: {
      composition: z
        .unknown()
        .describe(
          'Composition JSON object, e.g. { "version": "1", "root": { "component": "Card", "props": { "title": "Hello" } } }',
        ),
    },
    handler: async (args: Record<string, unknown>, _req: PayloadRequest) => {
      const parsed = parseJsonArg(args.composition, "composition");
      if (!parsed.success) {
        return mcpText(parsed.error);
      }

      const result = validateComposition(parsed.data);
      return mcpText(JSON.stringify(result, null, 2));
    },
  },
  {
    name: "renderComposition",
    description:
      "Turn valid Composition JSON into TSX importing only @radix-ui/themes. Always run validateComposition first. Returns tsx, imports, componentName, and projectSetup. Agent should post tsx in chat — do not write project files unless the user asks. Do not hand-write Radix JSX.",
    parameters: {
      composition: z
        .unknown()
        .describe(
          "Composition JSON — see getComposeGuide for examples, e.g. login form: Card > Input, Input, Button",
        ),
      componentName: z
        .string()
        .optional()
        .describe("Exported React function name (default ComposedUI)"),
      useClient: z
        .boolean()
        .optional()
        .describe('Include "use client" directive (default true)'),
    },
    handler: async (args: Record<string, unknown>, _req: PayloadRequest) => {
      const parsed = parseJsonArg(args.composition, "composition");
      if (!parsed.success) {
        return mcpText(parsed.error);
      }

      const componentName =
        typeof args.componentName === "string" && args.componentName.trim()
          ? args.componentName.trim()
          : undefined;
      const useClient =
        typeof args.useClient === "boolean" ? args.useClient : undefined;

      const validation = validateComposition(parsed.data);
      if (!validation.valid) {
        return mcpText(
          JSON.stringify(
            {
              error: "Composition invalid — fix issues before render.",
              validation,
            },
            null,
            2,
          ),
        );
      }

      try {
        const rendered = renderComposition(parsed.data, {
          componentName,
          useClient,
        });
        return mcpText(
          JSON.stringify(
            {
              componentName: componentName ?? "ComposedUI",
              imports: rendered.imports,
              tsx: rendered.tsx,
              projectSetup: getComposeProjectSetup(),
            },
            null,
            2,
          ),
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return mcpText(`renderComposition failed: ${message}`);
      }
    },
  },
];
