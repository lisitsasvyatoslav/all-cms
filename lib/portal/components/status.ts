import type { Component } from "@/payload-types";

import {
  isComponentPortalReady,
  type ComponentPortalReadiness,
} from "./portal-ready";

export type ComponentLifecycleStatus = NonNullable<Component["status"]>;

export function normalizeComponentStatus(
  status: Component["status"] | null | undefined,
): ComponentLifecycleStatus {
  return status ?? "stable";
}

/** Показывать на портале: все обязательные поля заполнены (статус draft убран). */
export function isComponentVisibleOnPortal(
  doc: ComponentPortalReadiness,
): boolean {
  return isComponentPortalReady(doc);
}

/** Бейдж в навигации: preview (beta) и deprecated. */
export function shouldShowComponentStatusBadge(
  status: Component["status"] | null | undefined,
): boolean {
  const normalized = normalizeComponentStatus(status);
  return normalized === "beta" || normalized === "deprecated";
}

export function getComponentStatusBadgeLabel(
  status: Component["status"] | null | undefined,
): string | null {
  const normalized = normalizeComponentStatus(status);
  if (normalized === "beta") return "Preview";
  if (normalized === "deprecated") return "Deprecated";
  return null;
}

export function getComponentStatusBadgeColor(
  status: Component["status"] | null | undefined,
): "green" | "red" {
  return normalizeComponentStatus(status) === "deprecated" ? "red" : "green";
}

export function isComponentDeprecated(
  status: Component["status"] | null | undefined,
): boolean {
  return normalizeComponentStatus(status) === "deprecated";
}

export function getDeprecatedBannerMessage(
  statusNote: Component["statusNote"] | null | undefined,
): string {
  const note = statusNote?.trim();
  if (note) return note;
  return "Этот компонент устарел и будет удалён в будущем релизе. Не используйте его в новом коде.";
}

export function resolveReplacedByComponent(
  replacedBy: Component["replacedBy"],
): { slug: string; name: string } | null {
  if (!replacedBy || typeof replacedBy !== "object") return null;
  const slug = replacedBy.slug;
  const name = replacedBy.name;
  if (typeof slug !== "string" || typeof name !== "string") return null;
  return { slug, name };
}
