import { getRegistryComponent } from "./registry";
import { parseCompositionDocument } from "./schema";
import type {
  CompositionNode,
  CompositionValidationIssue,
  CompositionValidationResult,
} from "./types";
import { validatePropValue } from "./validate-props";

function issue(
  path: string,
  message: string,
  code: CompositionValidationIssue["code"],
): CompositionValidationIssue {
  return { path, message, code };
}

function hasChildrenContent(node: CompositionNode): boolean {
  return Boolean(
    (node.children && node.children.length > 0) ||
      (node.text !== undefined && node.text !== "") ||
      node.props?.children !== undefined,
  );
}

function validateNode(
  node: CompositionNode,
  path: string,
  issues: CompositionValidationIssue[],
): void {
  const registryEntry = getRegistryComponent(node.component);

  if (!registryEntry) {
    issues.push(
      issue(
        path,
        `Неизвестный компонент "${node.component}". Вызови getComponentRegistry для списка.`,
        "unknown_component",
      ),
    );
    return;
  }

  const props = node.props ?? {};
  const knownPropNames = new Set(registryEntry.props.map((prop) => prop.name));

  for (const propName of Object.keys(props)) {
    if (!knownPropNames.has(propName)) {
      issues.push(
        issue(
          `${path}.props.${propName}`,
          `Prop "${propName}" не описан для ${node.component}`,
          "unknown_prop",
        ),
      );
      continue;
    }

    const propDef = registryEntry.props.find((prop) => prop.name === propName);
    if (!propDef) continue;

    const result = validatePropValue(propDef.type, props[propName]);
    if (!result.valid) {
      issues.push(
        issue(
          `${path}.props.${propName}`,
          `${propName}: ${result.message} (тип ${propDef.type})`,
          "invalid_prop",
        ),
      );
    }
  }

  for (const propDef of registryEntry.props) {
    if (!propDef.required || propDef.defaultValue !== undefined) {
      continue;
    }

    if (propDef.name === "children") {
      if (!hasChildrenContent(node)) {
        issues.push(
          issue(
            path,
            `Обязательный prop children (или text / children[]) отсутствует у ${node.component}`,
            "missing_required_prop",
          ),
        );
      }
      continue;
    }

    if (!(propDef.name in props)) {
      issues.push(
        issue(
          `${path}.props.${propDef.name}`,
          `Обязательный prop "${propDef.name}" отсутствует у ${node.component}`,
          "missing_required_prop",
        ),
      );
    }
  }

  if (node.children) {
    for (const [index, child] of node.children.entries()) {
      validateNode(child, `${path}.children[${index}]`, issues);
    }
  }
}

export function validateComposition(input: unknown): CompositionValidationResult {
  const parsed = parseCompositionDocument(input);
  if (!parsed.success) {
    return {
      valid: false,
      issues: [
        issue("root", parsed.error, "invalid_document"),
      ],
    };
  }

  const issues: CompositionValidationIssue[] = [];
  validateNode(parsed.data.root, "root", issues);

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function assertValidComposition(input: unknown): CompositionNode {
  const result = validateComposition(input);
  if (!result.valid) {
    const summary = result.issues.map((item) => `${item.path}: ${item.message}`).join("\n");
    throw new Error(`Invalid composition:\n${summary}`);
  }

  const parsed = parseCompositionDocument(input);
  if (!parsed.success) {
    throw new Error(parsed.error);
  }

  return parsed.data.root;
}
