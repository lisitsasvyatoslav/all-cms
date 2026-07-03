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
  loadComposePayloadGuidance,
  loadCompositionComponentGuidance,
  auditAndCorrectGlossary,
  loadComposeGlossaryGuidance,
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

async function handleComposeUi(args: Record<string, unknown>, req: PayloadRequest) {
  const cmsGuidance = await loadComposePayloadGuidance(req.payload);
  const guidanceRevision =
    typeof args.guidanceRevision === "string" ? args.guidanceRevision.trim() : "";

  if (guidanceRevision !== cmsGuidance.revision) {
    return mcpText(
      JSON.stringify(
        {
          success: false,
          stage: "guidance",
          message:
            "Read and apply the current /ds usage guide before creating the Design Brief.",
          retryHint:
            "Review cmsGuidance.usageGuideMarkdown, rebuild the Design Brief if necessary, then call composeUi again with guidanceRevision.",
          cmsGuidance,
        },
        null,
        2,
      ),
    );
  }

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

  if (!result.success) {
    return mcpText(JSON.stringify({ ...result, cmsGuidance }, null, 2));
  }

  const glossaryGuidance = await loadComposeGlossaryGuidance(req.payload);
  const glossaryAudit = auditAndCorrectGlossary(result.composition, glossaryGuidance);

  const componentGuidance = await loadCompositionComponentGuidance(
    req.payload,
    result.composition,
  );
  const componentGuidanceRevision =
    typeof args.componentGuidanceRevision === "string"
      ? args.componentGuidanceRevision.trim()
      : "";

  if (componentGuidanceRevision !== componentGuidance.revision) {
    return mcpText(
      JSON.stringify(
        {
          success: false,
          stage: "component-guidance",
          message:
            "Review the Payload do/don't rules for every component selected by the preliminary composition.",
          retryHint:
            "Apply componentGuidance.guidelines to the Design Brief, then call composeUi again with componentGuidanceRevision.",
          preliminaryComposition: glossaryAudit.composition,
          componentGuidance,
          glossaryAudit: {
            source: "Payload glossary-terms",
            revision: glossaryGuidance.revision,
            corrections: glossaryAudit.corrections,
            ambiguousMatches: glossaryAudit.ambiguousMatches,
            responseInstruction:
              "Apply glossary corrections to the revised Design Brief. Resolve ambiguous matches from context using only preferredCandidates. Tell the user exactly which UI words were corrected.",
          },
          cmsGuidance,
        },
        null,
        2,
      ),
    );
  }

  const rendered = renderComposition(glossaryAudit.composition, { componentName, useClient });

  return mcpText(
    JSON.stringify(
      {
        ...result,
        composition: glossaryAudit.composition,
        tsx: rendered.tsx,
        imports: rendered.imports,
        projectSetup: cmsGuidance,
        cmsGuidance,
        componentGuidance,
        glossaryAudit: {
          source: "Payload glossary-terms",
          revision: glossaryGuidance.revision,
          corrections: glossaryAudit.corrections,
          ambiguousMatches: glossaryAudit.ambiguousMatches,
          changed: glossaryAudit.corrections.length > 0,
          responseInstruction:
            "Explicitly tell the user every UI wording correction using glossaryAudit.corrections. If ambiguousMatches remain, disclose them and do not invent a replacement outside preferredCandidates.",
        },
        guidelineCompliance: {
          source: "Payload components.documentation doDont blocks",
          rules: componentGuidance.guidelines,
          responseInstruction:
            "Compare the original Figma design with every returned Do/Don't rule. Explicitly tell the user which anti-patterns you found and how your revised Design Brief corrected them. Do not infer rules that are absent from componentGuidance.",
        },
      },
      null,
      2,
    ),
  );
}

export const composeAgentMcpTools: McpTools = [
  {
    name: "getComposeUserPromptGuide",
    description:
      "For humans/docs: minimal user prompts — only «Через finam-design-system» anchor, no MCP tool names. Call when user asks what to paste in a new Cursor chat.",
    parameters: {},
    handler: async () => {
      return mcpText(JSON.stringify(getComposeUserPromptGuide(), null, 2));
    },
  },
  {
    name: "resolveComposeIntent",
    description:
        "MANDATORY FIRST CALL when user asks to build UI through finam-design-system. Returns the current /ds CMS usage guide and guidanceRevision. Read and apply it before creating Design Brief and calling composeUi.",
    parameters: {
      userMessage: z
        .string()
        .describe("Full user message, e.g. Figma URL + «собери макет» or text form description"),
    },
    handler: async (args: Record<string, unknown>, req: PayloadRequest) => {
      const userMessage =
        typeof args.userMessage === "string" ? args.userMessage : "";
      const intent = resolveComposeIntent(userMessage);
      const cmsGuidance = await loadComposePayloadGuidance(req.payload);
      return mcpText(
        JSON.stringify(
          {
            ...intent,
            cmsGuidance,
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
      "PRIMARY after resolveComposeIntent. Loads component Do/Don't rules and UI terminology from Payload. First response returns the rules and exact glossary corrections; revise the Design Brief and repeat with componentGuidanceRevision. Do not invent rules or wording outside Payload.",
    parameters: {
      guidanceRevision: z
        .string()
        .describe("Exact cmsGuidance.revision returned by resolveComposeIntent"),
      componentGuidanceRevision: z
        .string()
        .optional()
        .describe("Revision returned by the first composeUi component-guidance response"),
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
    handler: async (args: Record<string, unknown>, req: PayloadRequest) => {
      return handleComposeUi(args, req);
    },
  },
  {
    name: "composeFromFigmaContext",
    description:
      "Alias of composeUi — prefer composeUi. Uses the same two-pass guidance loaded from Payload documentation Do/Don't blocks.",
    parameters: {
      guidanceRevision: z
        .string()
        .describe("Exact cmsGuidance.revision returned by resolveComposeIntent"),
      componentGuidanceRevision: z
        .string()
        .optional()
        .describe("Revision returned by the first composeUi component-guidance response"),
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
    handler: async (args: Record<string, unknown>, req: PayloadRequest) => {
      return handleComposeUi(args, req);
    },
  },
  {
    name: "getComposeGuide",
    description:
      "Compose guide for troubleshooting. For user requests (Figma URL or plain-language UI) use resolveComposeIntent → composeUi automatically — never ask user to name tools.",
    parameters: {},
    handler: async (_args: Record<string, unknown>, req: PayloadRequest) => {
      const cmsGuidance = await loadComposePayloadGuidance(req.payload);
      return mcpText(
        JSON.stringify(
          { ...getComposeGuide(), projectSetup: cmsGuidance, cmsGuidance },
          null,
          2,
        ),
      );
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
