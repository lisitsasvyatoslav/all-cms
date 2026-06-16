import path from "node:path";

import { RADIX_THEME_LAYOUT_PROP_NAMES } from "../src/without-radix-layout";

const LAYOUT_PROP_SET = new Set<string>(RADIX_THEME_LAYOUT_PROP_NAMES);

/** Наследуемые и кастомные пропсы DS для таблицы. */
const ALLOWED_INHERITED_PROP_NAMES = new Set([
  "alertVariant",
  "asChild",
  "badgeVariant",
  "checked",
  "children",
  "className",
  "defaultChecked",
  "defaultValue",
  "description",
  "disabled",
  "highContrast",
  "href",
  "inputSize",
  "invalid",
  "label",
  "loading",
  "open",
  "options",
  "placeholder",
  "radius",
  "readOnly",
  "required",
  "selectSize",
  "size",
  "target",
  "title",
  "trigger",
  "type",
  "value",
  "variant",
]);

type DocgenProp = {
  name: string;
  type: { name: string; raw?: string };
  parent?: { fileName: string };
  declarations?: { fileName: string }[];
};

function isLayoutUtilityType(prop: DocgenProp): boolean {
  const raw = prop.type.raw ?? "";
  const name = prop.type.name ?? "";
  return raw.includes("Responsive<") || name.includes("Responsive<");
}

/** Проп связан с файлом компонента (в т.ч. поля inline-типа ModalProps). */
export function isPropDeclaredInSource(prop: DocgenProp, componentSourcePath: string): boolean {
  const sourceBase = path.basename(componentSourcePath).toLowerCase();
  const relatedFiles = [
    prop.parent?.fileName,
    ...(prop.declarations?.map((d) => d.fileName) ?? []),
  ].filter(Boolean) as string[];

  return relatedFiles.some((fileName) => path.basename(fileName).toLowerCase() === sourceBase);
}

/** Публичный API для портала: свои пропсы + осмысленные наследуемые, без layout Radix. */
export function shouldIncludeManifestProp(prop: DocgenProp, componentSourcePath: string): boolean {
  if (prop.name.startsWith("aria-")) return false;
  if (LAYOUT_PROP_SET.has(prop.name)) return false;
  if (isLayoutUtilityType(prop)) return false;
  if (isPropDeclaredInSource(prop, componentSourcePath)) return true;
  if (ALLOWED_INHERITED_PROP_NAMES.has(prop.name)) return true;
  return false;
}
