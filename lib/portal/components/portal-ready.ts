import type { Component } from "@/payload-types";

/**
 * Поля, без которых карточка не попадает на портал.
 * `name` и `slug` — required в Payload; `description` — лид страницы.
 */
export const COMPONENT_PORTAL_REQUIRED_FIELDS = [
  "name",
  "slug",
  "description",
] as const;

export type ComponentPortalRequiredField =
  (typeof COMPONENT_PORTAL_REQUIRED_FIELDS)[number];

export type ComponentPortalReadiness = Pick<
  Component,
  ComponentPortalRequiredField
>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function getComponentPortalMissingFields(
  doc: ComponentPortalReadiness,
): ComponentPortalRequiredField[] {
  return COMPONENT_PORTAL_REQUIRED_FIELDS.filter(
    (field) => !isNonEmptyString(doc[field]),
  );
}

/** Запись готова к публикации на портале (все обязательные поля заполнены). */
export function isComponentPortalReady(
  doc: ComponentPortalReadiness,
): boolean {
  return getComponentPortalMissingFields(doc).length === 0;
}
