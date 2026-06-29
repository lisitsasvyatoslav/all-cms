import type { ManifestProp } from "./types";

export const CLASS_NAME: ManifestProp = {
  name: "className",
  type: "string",
  required: false,
  description: "Дополнительные CSS-классы.",
};

export const SIZE_1234: ManifestProp = {
  name: "size",
  type: '"1" | "2" | "3" | "4"',
  required: false,
  description: "Размер Radix Themes (1 — smallest).",
};

export const RADIX_COLORS =
  '"gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky"';

export const BUTTON_VARIANT: ManifestProp = {
  name: "variant",
  type: '"classic" | "solid" | "soft" | "surface" | "outline" | "ghost"',
  required: false,
  defaultValue: "solid",
  description: "Визуальный стиль кнопки.",
};

export const CARD_VARIANT: ManifestProp = {
  name: "variant",
  type: '"surface" | "classic" | "ghost"',
  required: false,
  description: "Стиль поверхности карточки.",
};

export const FLEX_DIRECTION: ManifestProp = {
  name: "direction",
  type: '"row" | "column" | "row-reverse" | "column-reverse"',
  required: false,
};

export const FLEX_ALIGN: ManifestProp = {
  name: "align",
  type: '"start" | "center" | "end" | "baseline" | "stretch"',
  required: false,
};

export const FLEX_JUSTIFY: ManifestProp = {
  name: "justify",
  type: '"start" | "center" | "end" | "between"',
  required: false,
};

export const FLEX_GAP: ManifestProp = {
  name: "gap",
  type: '"0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"',
  required: false,
};

export const TEXT_SIZE: ManifestProp = {
  name: "size",
  type: '"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"',
  required: false,
};

export const TEXT_COLOR: ManifestProp = {
  name: "color",
  type: RADIX_COLORS,
  required: false,
};

export const TEXT_WEIGHT: ManifestProp = {
  name: "weight",
  type: '"light" | "regular" | "medium" | "bold"',
  required: false,
};

export const TEXT_AS: ManifestProp = {
  name: "as",
  type: '"span" | "div" | "label" | "p"',
  required: false,
};

export const HEADING_AS: ManifestProp = {
  name: "as",
  type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"',
  required: false,
};

export const CHILDREN: ManifestProp = {
  name: "children",
  type: "ReactNode",
  required: false,
};

export const VALUE_REQUIRED: ManifestProp = {
  name: "value",
  type: "string",
  required: true,
  description: "Уникальное значение элемента.",
};

export const DEFAULT_VALUE: ManifestProp = {
  name: "defaultValue",
  type: "string",
  required: false,
};

export const PLACEHOLDER: ManifestProp = {
  name: "placeholder",
  type: "string",
  required: false,
};

export const DISABLED: ManifestProp = {
  name: "disabled",
  type: "boolean",
  required: false,
};

export const TYPE_INPUT: ManifestProp = {
  name: "type",
  type: '"text" | "email" | "password" | "number" | "tel" | "url" | "search"',
  required: false,
  defaultValue: "text",
};

export function compound(
  id: string,
  exportName: string,
  member: string,
  props: ManifestProp[],
) {
  return { id, exportName, member, props };
}
