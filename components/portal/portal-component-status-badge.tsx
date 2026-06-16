import { Badge } from "@radix-ui/themes";

import type { Component } from "@/payload-types";
import { portalClass } from "@/lib/portal/classes";
import {
  getComponentStatusBadgeColor,
  getComponentStatusBadgeLabel,
  shouldShowComponentStatusBadge,
} from "@/lib/portal/component-status";

export function PortalComponentStatusBadge({
  status,
  variant = "default",
}: {
  status: Component["status"] | null | undefined;
  variant?: "default" | "sidebar";
}) {
  if (!shouldShowComponentStatusBadge(status)) return null;

  const label = getComponentStatusBadgeLabel(status);
  if (!label) return null;

  if (variant === "sidebar") {
    return (
      <span className={portalClass.sidebarNavChip} data-slot="chip">
        <span data-slot="chip-label">{label}</span>
      </span>
    );
  }

  return (
    <Badge
      size="1"
      variant="soft"
      color={getComponentStatusBadgeColor(status)}
      className="portal-component-status-badge"
    >
      {label}
    </Badge>
  );
}
