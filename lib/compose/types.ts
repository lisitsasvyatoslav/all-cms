/** Версия формата Composition JSON. */
export const COMPOSITION_VERSION = "1" as const;

/** Узел дерева композиции (@radix-ui/themes). */
export type CompositionNode = {
  /** Export name: Button, Card, Tabs.Root, … */
  component: string;
  props?: Record<string, unknown>;
  /** Текстовое содержимое (children как строка). */
  text?: string;
  children?: CompositionNode[];
};

export type CompositionDocument = {
  version: typeof COMPOSITION_VERSION;
  root: CompositionNode;
};

export type CompositionValidationIssue = {
  path: string;
  message: string;
  code:
    | "unknown_component"
    | "unknown_prop"
    | "invalid_prop"
    | "missing_required_prop"
    | "invalid_structure"
    | "invalid_document";
};

export type CompositionValidationResult = {
  valid: boolean;
  issues: CompositionValidationIssue[];
};

export type CompositionRenderOptions = {
  /** Имя экспортируемой React-функции (по умолчанию ComposedUI). */
  componentName?: string;
  /** Добавить "use client" (по умолчанию true). */
  useClient?: boolean;
};

export type CompositionRenderResult = {
  tsx: string;
  imports: string[];
};

export type ManifestProp = {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  defaultValue?: unknown;
};

export type RegistryComponent = {
  id: string;
  exportName: string;
  importPath: string;
  /** Для compound: Tabs.Root → member Root на объекте Tabs. */
  member?: string;
  props: ManifestProp[];
  sourceFile?: string;
};

export type ComponentRegistry = {
  version: string;
  package: string;
  generatedAt: string;
  components: Record<string, RegistryComponent>;
};
