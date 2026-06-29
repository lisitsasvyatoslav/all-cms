import { z } from "zod";

import { COMPOSITION_VERSION } from "./types";
import type { CompositionDocument, CompositionNode } from "./types";

export const DESIGN_BRIEF_VERSION = "1" as const;

/** Semantic block kinds the agent maps from Figma (via Figma MCP + screenshot). */
export const DESIGN_BRIEF_KINDS = [
  "card",
  "group",
  "flex",
  "button",
  "input",
  "select",
  "checkbox",
  "badge",
  "link",
  "alert",
  "modal",
  "tabs",
  "tabList",
  "tab",
  "tabPanel",
  "heading",
  "text",
  "illustration",
  "passwordInput",
] as const;

export type DesignBriefKind = (typeof DESIGN_BRIEF_KINDS)[number];

const designBriefNodeSchema: z.ZodType<{
  kind: string;
  props?: Record<string, unknown>;
  text?: string;
  figmaName?: string;
  children?: Array<{
    kind: string;
    props?: Record<string, unknown>;
    text?: string;
    figmaName?: string;
    children?: unknown[];
  }>;
}> = z.lazy(() =>
  z.object({
    kind: z.string().min(1),
    props: z.record(z.unknown()).optional(),
    text: z.string().optional(),
    figmaName: z.string().optional(),
    children: z.array(designBriefNodeSchema).optional(),
  }),
);

export const designBriefSchema = z.object({
  version: z.literal(DESIGN_BRIEF_VERSION),
  figmaUrl: z.string().url().optional(),
  root: designBriefNodeSchema,
});

export type DesignBrief = z.infer<typeof designBriefSchema>;

export type BriefPlanIssue = {
  path: string;
  message: string;
  code: "unknown_kind" | "invalid_brief" | "unsupported_structure";
};

export type BriefPlanResult =
  | {
      success: true;
      composition: CompositionDocument;
      warnings: string[];
    }
  | {
      success: false;
      issues: BriefPlanIssue[];
    };

const KIND_TO_COMPONENT: Record<string, string> = {
  card: "Card",
  flex: "Flex",
  button: "Button",
  input: "TextField.Root",
  select: "Select.Root",
  checkbox: "Checkbox",
  badge: "Badge",
  link: "Link",
  alert: "Callout.Root",
  modal: "Dialog.Root",
  illustration: "Avatar",
  passwordInput: "TextField.Root",
  heading: "Heading",
  text: "Text",
  tabList: "Tabs.List",
  tab: "Tabs.Trigger",
  tabPanel: "Tabs.Content",
};

type ButtonRadixProps = { variant?: string; color?: string };

function mapUiKitButtonStyle(style?: unknown): ButtonRadixProps | undefined {
  if (typeof style !== "string") return undefined;
  const normalized = style.toLowerCase();
  if (normalized.includes("danger") || normalized.includes("destruct")) {
    return { variant: "solid", color: "red" };
  }
  if (normalized.includes("ghost") || normalized.includes("text")) {
    return { variant: "ghost", color: "gray" };
  }
  if (normalized.includes("outline")) {
    return { variant: "outline", color: "gray" };
  }
  if (normalized.includes("secondary") || normalized.includes("soft")) {
    return { variant: "soft", color: "gray" };
  }
  if (normalized.includes("primary") || normalized.includes("solid")) {
    return { variant: "solid" };
  }
  return undefined;
}

function normalizeButtonProps(props: Record<string, unknown>): Record<string, unknown> {
  const next = { ...props };
  const fromStyle =
    next.variant === undefined ? mapUiKitButtonStyle(next.figmaStyle) : undefined;
  delete next.figmaStyle;

  if (typeof next.variant === "string") {
    const mapped = mapUiKitButtonStyle(next.variant);
    if (mapped) {
      if (mapped.variant) next.variant = mapped.variant;
      if (mapped.color && next.color === undefined) next.color = mapped.color;
    }
  } else if (fromStyle) {
    if (fromStyle.variant) next.variant = fromStyle.variant;
    if (fromStyle.color && next.color === undefined) next.color = fromStyle.color;
  }

  return next;
}

function expandSelectOptions(
  props: Record<string, unknown>,
  path: string,
  issues: BriefPlanIssue[],
): CompositionNode | null {
  const options = props.options;
  if (!Array.isArray(options) || options.length === 0) {
    issues.push({
      path: `${path}.props.options`,
      message: "Select kind requires props.options: [{ value, label }, ...].",
      code: "unsupported_structure",
    });
    return null;
  }

  const { placeholder, defaultValue, selectSize, options: _options, ...rootProps } = props;
  const sizeMap: Record<string, string> = { sm: "1", md: "2", lg: "3" };
  const rootSelectProps: Record<string, unknown> = { ...rootProps };
  if (typeof defaultValue === "string") rootSelectProps.defaultValue = defaultValue;
  if (typeof selectSize === "string" && sizeMap[selectSize]) {
    rootSelectProps.size = sizeMap[selectSize];
  }

  const items: CompositionNode[] = [];
  for (const [index, option] of options.entries()) {
    if (
      typeof option !== "object" ||
      option === null ||
      typeof (option as { value?: unknown }).value !== "string"
    ) {
      issues.push({
        path: `${path}.props.options[${index}]`,
        message: "Each option must be { value: string, label?: string }.",
        code: "unsupported_structure",
      });
      return null;
    }
    const { value, label } = option as { value: string; label?: string };
    items.push({
      component: "Select.Item",
      props: { value },
      text: typeof label === "string" ? label : value,
    });
  }

  const triggerProps: Record<string, unknown> = {};
  if (typeof placeholder === "string") triggerProps.placeholder = placeholder;

  return {
    component: "Select.Root",
    props: Object.keys(rootSelectProps).length > 0 ? rootSelectProps : undefined,
    children: [
      { component: "Select.Trigger", props: triggerProps },
      {
        component: "Select.Content",
        children: items,
      },
    ],
  };
}

function expandCardNode(
  node: z.infer<typeof designBriefNodeSchema>,
  compositionChildren: CompositionNode[],
): CompositionNode {
  const props = { ...(node.props ?? {}) };
  const headerChildren: CompositionNode[] = [];

  const title =
    typeof props.title === "string"
      ? props.title
      : node.text && props.title === undefined
        ? node.text
        : undefined;
  const description = typeof props.description === "string" ? props.description : undefined;
  delete props.title;
  delete props.description;

  if (title) {
    headerChildren.push({
      component: "Heading",
      props: { size: "3" },
      text: title,
    });
  }
  if (description) {
    headerChildren.push({
      component: "Text",
      props: { size: "2", color: "gray", as: "p" },
      text: description,
    });
  }

  return {
    component: "Card",
    props: Object.keys(props).length > 0 ? props : undefined,
    children: [...headerChildren, ...compositionChildren],
  };
}

function expandModalNode(
  node: z.infer<typeof designBriefNodeSchema>,
  compositionChildren: CompositionNode[],
): CompositionNode {
  const props = { ...(node.props ?? {}) };
  const title = typeof props.title === "string" ? props.title : node.text;
  const description = typeof props.description === "string" ? props.description : undefined;
  const preview = props.preview === true;
  delete props.title;
  delete props.description;
  delete props.preview;

  const contentChildren: CompositionNode[] = [];
  if (title) {
    contentChildren.push({
      component: "Dialog.Title",
      props: { size: "5" },
      text: title,
    });
  }
  if (description) {
    contentChildren.push({
      component: "Dialog.Description",
      props: { size: "2" },
      text: description,
    });
  }
  contentChildren.push(...compositionChildren);

  const dialogContent: CompositionNode = {
    component: "Dialog.Content",
    props: preview ? { maxWidth: "456px" } : undefined,
    children: contentChildren,
  };

  return {
    component: "Dialog.Root",
    props: Object.keys(props).length > 0 ? props : undefined,
    children: [dialogContent],
  };
}

function expandAlertNode(
  node: z.infer<typeof designBriefNodeSchema>,
  compositionChildren: CompositionNode[],
): CompositionNode {
  const props = { ...(node.props ?? {}) };
  const alertVariant = props.alertVariant ?? props.variant;
  delete props.alertVariant;

  const colorMap: Record<string, string> = {
    info: "blue",
    success: "green",
    warning: "yellow",
    error: "red",
    danger: "red",
  };
  if (typeof alertVariant === "string" && colorMap[alertVariant] && props.color === undefined) {
    props.color = colorMap[alertVariant];
  }

  const textContent = node.text;
  const calloutChildren =
    compositionChildren.length > 0
      ? compositionChildren
      : textContent
        ? [{ component: "Callout.Text", text: textContent } satisfies CompositionNode]
        : [];

  return {
    component: "Callout.Root",
    props: Object.keys(props).length > 0 ? props : undefined,
    children: calloutChildren,
  };
}

function briefNodeToComposition(
  node: z.infer<typeof designBriefNodeSchema>,
  path: string,
  issues: BriefPlanIssue[],
  warnings: string[],
): CompositionNode | CompositionNode[] | null {
  const kind = node.kind.trim();

  if (kind === "group" || kind === "flex") {
    if (kind === "flex") {
      const compositionChildren: CompositionNode[] = [];
      for (const [index, child] of (node.children ?? []).entries()) {
        const mapped = briefNodeToComposition(
          child,
          `${path}.children[${index}]`,
          issues,
          warnings,
        );
        if (!mapped) continue;
        if (Array.isArray(mapped)) compositionChildren.push(...mapped);
        else compositionChildren.push(mapped);
      }
      return {
        component: "Flex",
        props: { ...(node.props ?? {}), direction: node.props?.direction ?? "column", gap: node.props?.gap ?? "3" },
        children: compositionChildren.length > 0 ? compositionChildren : undefined,
      };
    }

    if (!node.children?.length) {
      warnings.push(`${path}: empty group skipped`);
      return null;
    }
    const nested = node.children.flatMap((child, index) => {
      const mapped = briefNodeToComposition(child, `${path}.children[${index}]`, issues, warnings);
      if (!mapped) return [];
      return Array.isArray(mapped) ? mapped : [mapped];
    });
    return nested.length === 1 ? nested[0]! : nested;
  }

  if (kind === "tabs") {
    const children: CompositionNode[] = [];
    for (const [index, child] of (node.children ?? []).entries()) {
      const mapped = briefNodeToComposition(
        child,
        `${path}.children[${index}]`,
        issues,
        warnings,
      );
      if (!mapped) continue;
      if (Array.isArray(mapped)) children.push(...mapped);
      else children.push(mapped);
    }

    return {
      component: "Tabs.Root",
      props: node.props,
      children,
    };
  }

  if (kind === "select") {
    return expandSelectOptions({ ...(node.props ?? {}) }, path, issues);
  }

  const component = KIND_TO_COMPONENT[kind];
  if (!component) {
    issues.push({
      path,
      message: `Unknown kind "${kind}". Use getFigmaComposeWorkflow for allowed kinds.`,
      code: "unknown_kind",
    });
    return null;
  }

  const props = { ...(node.props ?? {}) };

  if (kind === "button") {
    Object.assign(props, normalizeButtonProps(props));
  }

  if (kind === "passwordInput") {
    props.type = "password";
  }

  if (kind === "input" && props.inputSize !== undefined) {
    const sizeMap: Record<string, string> = { sm: "1", md: "2", lg: "3" };
    if (typeof props.inputSize === "string" && sizeMap[props.inputSize]) {
      props.size = sizeMap[props.inputSize];
    }
    delete props.inputSize;
  }

  const compositionChildren: CompositionNode[] = [];

  for (const [index, child] of (node.children ?? []).entries()) {
    const mapped = briefNodeToComposition(
      child,
      `${path}.children[${index}]`,
      issues,
      warnings,
    );
    if (!mapped) continue;
    if (Array.isArray(mapped)) compositionChildren.push(...mapped);
    else compositionChildren.push(mapped);
  }

  if (kind === "card") {
    return expandCardNode(node, compositionChildren);
  }

  if (kind === "modal") {
    return expandModalNode(node, compositionChildren);
  }

  if (kind === "alert") {
    return expandAlertNode(node, compositionChildren);
  }

  const nodeProps = Object.keys(props).length > 0 ? props : undefined;

  if (compositionChildren.length === 0) {
    return {
      component,
      props: nodeProps,
      ...(node.text && kind !== "card" ? { text: node.text } : {}),
    };
  }

  return {
    component,
    props: nodeProps,
    children: compositionChildren,
  };
}

export function planCompositionFromBrief(input: unknown): BriefPlanResult {
  const parsed = designBriefSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      issues: [
        {
          path: "root",
          message: parsed.error.issues.map((i) => i.message).join("; "),
          code: "invalid_brief",
        },
      ],
    };
  }

  const issues: BriefPlanIssue[] = [];
  const warnings: string[] = [];

  const rootMapped = briefNodeToComposition(parsed.data.root, "root", issues, warnings);

  if (issues.length > 0) {
    return { success: false, issues };
  }

  if (!rootMapped) {
    return {
      success: false,
      issues: [
        {
          path: "root",
          message: "Could not map root to a composition node.",
          code: "unsupported_structure",
        },
      ],
    };
  }

  let root: CompositionNode;
  if (Array.isArray(rootMapped)) {
    if (rootMapped.length === 0) {
      return {
        success: false,
        issues: [
          {
            path: "root",
            message: "Root mapped to empty list.",
            code: "unsupported_structure",
          },
        ],
      };
    }
    root =
      rootMapped.length === 1
        ? rootMapped[0]!
        : {
            component: "Card",
            props: { variant: "surface" },
            children: rootMapped,
          };
  } else {
    root = rootMapped;
  }

  return {
    success: true,
    composition: {
      version: COMPOSITION_VERSION,
      root,
    },
    warnings,
  };
}
