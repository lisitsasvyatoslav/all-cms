import type { Color, Component } from "@/payload-types";

export type DocumentationBlock =
  | NonNullable<Component["documentation"]>[number]
  | NonNullable<Color["documentation"]>[number];
