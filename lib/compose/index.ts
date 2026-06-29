export { COMPOSITION_VERSION } from "./types";
export type {
  CompositionDocument,
  CompositionNode,
  CompositionRenderOptions,
  CompositionRenderResult,
  CompositionValidationIssue,
  CompositionValidationResult,
  ComponentRegistry,
  RegistryComponent,
} from "./types";

export { getComponentRegistry, getRegistryComponent, getRegistrySummary, listRegistryComponentIds } from "./registry";
export { getComposeGuide, getComposeProjectSetup, getUiKitProjectSetup, getRegistryQuickStart } from "./guide";
export { getFigmaComposeWorkflow } from "./figma-workflow";
export { parseFigmaUrl } from "./figma-url";
export {
  DESIGN_BRIEF_VERSION,
  DESIGN_BRIEF_KINDS,
  designBriefSchema,
  planCompositionFromBrief,
} from "./design-brief";
export type { DesignBrief, BriefPlanResult, BriefPlanIssue } from "./design-brief";
export { parseCompositionDocument, compositionDocumentSchema } from "./schema";
export { validateComposition, assertValidComposition } from "./validate";
export { renderComposition } from "./render";
export { composeFromFigmaContext } from "./compose-from-figma-context";
export { resolveComposeIntent, COMPOSE_TRIGGER_PHRASES } from "./resolve-compose-intent";
export {
  buildRecommendedComposePrompt,
  getComposeUserPromptGuide,
  COMPOSE_CHARTER_LINE,
  COMPOSE_CHARTER_SHORT,
} from "./user-prompts";
export type {
  ComposeFromFigmaContextOptions,
  ComposeFromFigmaContextResult,
} from "./compose-from-figma-context";
export { getMcpAgentInstructions, COMPOSE_MCP_AGENT_INSTRUCTIONS } from "./agent-instructions";
