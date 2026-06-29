import { getComposeProjectSetup } from "./guide";
import { parseFigmaUrl } from "./figma-url";
import { getFigmaComposeWorkflow } from "./figma-workflow";
import { planCompositionFromBrief } from "./design-brief";
import { renderComposition } from "./render";
import { validateComposition } from "./validate";
import type { CompositionDocument } from "./types";

export type ComposeFromFigmaContextOptions = {
  figmaUrl?: string;
  designBrief: unknown;
  /** Краткая выжимка из Figma get_design_context — только для traceability в ответе. */
  designContextNote?: string;
  componentName?: string;
  useClient?: boolean;
};

export type ComposeFromFigmaContextSuccess = {
  success: true;
  componentName: string;
  tsx: string;
  imports: string[];
  composition: CompositionDocument;
  validation: { valid: true; issues: [] };
  warnings: string[];
  projectSetup: ReturnType<typeof getComposeProjectSetup>;
  figmaUrlParsing?: ReturnType<typeof parseFigmaUrl>;
  workflowHints?: ReturnType<typeof getFigmaComposeWorkflow>;
};

export type ComposeFromFigmaContextFailure = {
  success: false;
  stage: "brief" | "validate" | "render";
  issues?: Array<{ path: string; message: string; code?: string }>;
  validation?: ReturnType<typeof validateComposition>;
  message: string;
  retryHint: string;
};

export type ComposeFromFigmaContextResult =
  | ComposeFromFigmaContextSuccess
  | ComposeFromFigmaContextFailure;

function mergeFigmaUrlIntoBrief(
  designBrief: unknown,
  figmaUrl?: string,
): unknown {
  if (!figmaUrl || typeof designBrief !== "object" || designBrief === null) {
    return designBrief;
  }

  const brief = designBrief as Record<string, unknown>;
  if (typeof brief.figmaUrl === "string" && brief.figmaUrl.trim()) {
    return designBrief;
  }

  return { ...brief, figmaUrl };
}

export function composeFromFigmaContext(
  options: ComposeFromFigmaContextOptions,
): ComposeFromFigmaContextResult {
  const figmaUrl = options.figmaUrl?.trim() || undefined;
  const figmaUrlParsing = figmaUrl ? parseFigmaUrl(figmaUrl) : undefined;
  const workflowHints = figmaUrl ? getFigmaComposeWorkflow(figmaUrl) : undefined;

  const briefInput = mergeFigmaUrlIntoBrief(options.designBrief, figmaUrl);
  const planned = planCompositionFromBrief(briefInput);

  if (!planned.success) {
    return {
      success: false,
      stage: "brief",
      issues: planned.issues,
      message: "Design Brief could not be converted to Composition JSON.",
      retryHint:
        "Fix Design Brief kinds/props and call composeUi again.",
    };
  }

  const validation = validateComposition(planned.composition);
  if (!validation.valid) {
    return {
      success: false,
      stage: "validate",
      validation,
      issues: validation.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
        code: issue.code,
      })),
      message: "Composition JSON failed validation.",
      retryHint:
        "Adjust Design Brief props to match registry enums, then call composeUi again.",
    };
  }

  try {
    const rendered = renderComposition(planned.composition, {
      componentName: options.componentName,
      useClient: options.useClient,
    });

    const componentName = options.componentName?.trim() || "ComposedUI";

    return {
      success: true,
      componentName,
      tsx: rendered.tsx,
      imports: rendered.imports,
      composition: planned.composition,
      validation: { valid: true, issues: [] },
      warnings: [
        ...planned.warnings,
        ...(options.designContextNote
          ? [`designContextNote: ${options.designContextNote.slice(0, 200)}`]
          : []),
        ...(figmaUrlParsing && "error" in figmaUrlParsing
          ? [`figmaUrl warning: ${figmaUrlParsing.error}`]
          : []),
      ],
      projectSetup: getComposeProjectSetup(),
      figmaUrlParsing,
      workflowHints,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      stage: "render",
      message: `renderComposition failed: ${message}`,
      retryHint: "Fix composition structure and retry composeUi.",
    };
  }
}
