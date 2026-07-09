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

const componentAuditFindingSchema = z.object({
  ruleComponentId: z
    .string()
    .min(1)
    .describe("Component id whose Payload Do/Don't rule was applied, e.g. Dialog.Root"),
  changedComponentId: z
    .string()
    .min(1)
    .describe("Concrete component that was changed, e.g. Button"),
  path: z.string().min(1).describe("Path of the changed component in the composition"),
  rule: z.string().min(1).describe("Exact Do/Don't rule returned in componentGuidance"),
  detected: z.string().min(1).describe("Concrete anti-pattern found in the original mockup"),
  before: z.string().min(1).describe("Original component or props, e.g. Button variant=solid"),
  after: z.string().min(1).describe("Corrected component or props, e.g. Button variant=ghost"),
  correction: z.string().min(1).describe("Why and how the component was corrected"),
});

const componentAuditSchema = z.object({
  reviewed: z.literal(true).describe("Confirms that every returned Do/Don't rule was reviewed"),
  ruleReviews: z
    .array(
      z.object({
        guidelineSlug: z.string().min(1).describe("Slug from componentGuidance.guidelines"),
        ruleType: z.enum(["do", "dont"]),
        rule: z.string().min(1).describe("Exact rule text returned by Payload"),
        outcome: z.enum(["compliant", "violation", "not-applicable"]),
        evidence: z.string().min(1).describe("Concrete evidence from the original mockup"),
      }),
    )
    .describe("Exactly one review for every Do and Don't rule returned by Payload"),
  findings: z
    .array(componentAuditFindingSchema)
    .describe("One item for every component correction made because of a Do/Don't rule"),
});

type ComponentAudit = z.infer<typeof componentAuditSchema>;

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

export function validateComponentAudit(
  value: unknown,
  componentGuidance: Awaited<ReturnType<typeof loadCompositionComponentGuidance>>,
): { success: true; audit: ComponentAudit } | { success: false; errors: string[] } {
  const parsed = componentAuditSchema.safeParse(value);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
    };
  }

  const rulesByComponent = new Map<string, Set<string>>();
  for (const guideline of componentGuidance.guidelines) {
    const rules = [...guideline.dos, ...guideline.donts];
    for (const componentId of guideline.componentIds) {
      const bucket = rulesByComponent.get(componentId) ?? new Set<string>();
      rules.forEach((rule) => bucket.add(rule));
      rulesByComponent.set(componentId, bucket);
    }
  }
  const usedComponentIds = new Set(componentGuidance.usedComponentIds);
  const errors: string[] = [];

  const expectedReviews = new Map<string, { slug: string; type: "do" | "dont"; rule: string }>();
  for (const guideline of componentGuidance.guidelines) {
    guideline.dos.forEach((rule) =>
      expectedReviews.set(`${guideline.slug}\u0000do\u0000${rule}`, {
        slug: guideline.slug,
        type: "do",
        rule,
      }),
    );
    guideline.donts.forEach((rule) =>
      expectedReviews.set(`${guideline.slug}\u0000dont\u0000${rule}`, {
        slug: guideline.slug,
        type: "dont",
        rule,
      }),
    );
  }

  const receivedReviewKeys = new Set<string>();
  parsed.data.ruleReviews.forEach((review, index) => {
    const key = `${review.guidelineSlug}\u0000${review.ruleType}\u0000${review.rule}`;
    if (!expectedReviews.has(key)) {
      errors.push(`ruleReviews[${index}]: rule is not present in Payload componentGuidance`);
      return;
    }
    if (receivedReviewKeys.has(key)) {
      errors.push(`ruleReviews[${index}]: duplicate review`);
    }
    receivedReviewKeys.add(key);
    if (
      review.outcome === "violation" &&
      !parsed.data.findings.some((finding) => finding.rule === review.rule)
    ) {
      errors.push(`ruleReviews[${index}]: violation requires a matching correction in findings`);
    }
  });
  for (const [key, expected] of expectedReviews) {
    if (!receivedReviewKeys.has(key)) {
      errors.push(`ruleReviews: missing ${expected.type} rule for ${expected.slug}: ${expected.rule}`);
    }
  }

  parsed.data.findings.forEach((finding, index) => {
    if (!usedComponentIds.has(finding.changedComponentId)) {
      errors.push(
        `findings[${index}].changedComponentId: ${finding.changedComponentId} is not used in the composition`,
      );
    }
    if (!rulesByComponent.get(finding.ruleComponentId)?.has(finding.rule)) {
      errors.push(
        `findings[${index}].rule: rule is not present in Payload guidance for ${finding.ruleComponentId}`,
      );
    }
  });

  return errors.length ? { success: false, errors } : { success: true, audit: parsed.data };
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
            "Apply componentGuidance.guidelines to the Design Brief, correcting any Figma anti-patterns instead of reproducing them, then call composeUi again with componentGuidanceRevision.",
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
          componentAuditRequirements: {
            requiredOnNextCall: true,
            instruction:
              "Add exactly one ruleReviews entry for every returned Do and Don't rule, based on the original mockup. Mark each compliant, violation, or not-applicable and provide concrete evidence. Payload Do/Don't rules override Figma fidelity: if the mockup violates a rule, do not reproduce the anti-pattern; revise the Design Brief and build the corrected UI immediately. Every violation must have a matching finding with the exact component, before and after values, correction, and Payload rule.",
            example: {
              reviewed: true,
              ruleReviews: [
                {
                  guidelineSlug: "modal",
                  ruleType: "dont",
                  rule: "Exact rule from componentGuidance",
                  outcome: "violation",
                  evidence: "The original modal has two visually primary buttons.",
                },
              ],
              findings: [
                {
                  ruleComponentId: "Dialog.Root",
                  changedComponentId: "Button",
                  path: "root.children[1].children[2]",
                  rule: "Exact rule from componentGuidance",
                  detected: "The modal contained two primary actions.",
                  before: "Button variant=solid",
                  after: "Button variant=ghost",
                  correction: "Kept one primary action and reduced the second action's emphasis.",
                },
              ],
            },
          },
          cmsGuidance,
        },
        null,
        2,
      ),
    );
  }

  const componentAuditResult = validateComponentAudit(args.componentAudit, componentGuidance);
  if (!componentAuditResult.success) {
    return mcpText(
      JSON.stringify(
        {
          success: false,
          stage: "component-audit",
          message:
            "Review every Payload Do/Don't rule against the original mockup and report every component correction.",
          errors: componentAuditResult.errors,
          retryHint:
            "Call composeUi again with one ruleReviews item per returned rule and one finding per violation. Do not preserve a known anti-pattern for Figma fidelity. findings=[] is valid only when every rule review is compliant or not-applicable.",
          componentGuidanceRevision: componentGuidance.revision,
        },
        null,
        2,
      ),
    );
  }

  const componentAudit = componentAuditResult.audit;
  const componentCorrectionReport = componentAudit.findings.map(
    (finding) =>
      `${finding.changedComponentId} (${finding.path}): ${finding.before} → ${finding.after}. ${finding.correction}`,
  );

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
        componentAudit: {
          ...componentAudit,
          changed: componentAudit.findings.length > 0,
          reportLines: componentCorrectionReport,
          responseInstruction:
            "MANDATORY: include a separate final-response section listing every reportLines item. Name the exact component and state what it was changed from and to. Do not replace this with a generic statement about applying guidelines.",
        },
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
            "Compare the original Figma design with every returned Do/Don't rule. Payload Do/Don't rules override Figma fidelity: build the corrected UI, not the violating mockup. Explicitly tell the user which anti-patterns you found and how your revised Design Brief corrected them. Do not infer rules that are absent from componentGuidance.",
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
        "MANDATORY FIRST CALL when user asks to build UI through finam-design-system. Returns the current /ds CMS usage guide, planningPolicy, and guidanceRevision. Apply planningPolicy before showing any plan: never promise to reproduce a detected or suspected anti-pattern as-is; say the UI will be corrected through Payload Do/Don't rules. Read and apply guidance before creating Design Brief and calling composeUi.",
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
      "PRIMARY after resolveComposeIntent. Loads component Do/Don't rules and UI terminology from Payload. First response returns rules; revise the Design Brief, correcting Figma anti-patterns instead of reproducing them, then repeat with componentGuidanceRevision and mandatory componentAudit describing every corrected component as before → after. Final report lines must be disclosed to the user.",
    parameters: {
      guidanceRevision: z
        .string()
        .describe("Exact cmsGuidance.revision returned by resolveComposeIntent"),
      componentGuidanceRevision: z
        .string()
        .optional()
        .describe("Revision returned by the first composeUi component-guidance response"),
      componentAudit: componentAuditSchema
        .optional()
        .describe("Required on the second call: exact report of components corrected by Do/Don't rules"),
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
      "Alias of composeUi — prefer composeUi. Uses the same two-pass Payload guidance, corrects Figma anti-patterns instead of reproducing them, and requires mandatory componentAudit report.",
    parameters: {
      guidanceRevision: z
        .string()
        .describe("Exact cmsGuidance.revision returned by resolveComposeIntent"),
      componentGuidanceRevision: z
        .string()
        .optional()
        .describe("Revision returned by the first composeUi component-guidance response"),
      componentAudit: componentAuditSchema
        .optional()
        .describe("Required on the second call: exact report of components corrected by Do/Don't rules"),
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
