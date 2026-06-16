"use client";

import { useCallback, useState } from "react";

import { portalClass } from "@/lib/portal/classes";
import {
  PORTAL_SIDEBAR_FRAMEWORKS,
  type PortalSidebarFrameworkId,
} from "@/lib/portal/sidebar-frameworks";

export function PortalSidebarFrameworkFilter() {
  const [selected, setSelected] = useState<Set<PortalSidebarFrameworkId>>(
    () => new Set(),
  );

  const toggle = useCallback((id: PortalSidebarFrameworkId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div
      className={portalClass.sidebarFrameworkFilter}
      role="group"
      aria-label="Фильтр по фреймворкам"
    >
      {PORTAL_SIDEBAR_FRAMEWORKS.map((framework) => {
        const isSelected = selected.has(framework.id);

        return (
          <button
            key={framework.id}
            type="button"
            className={portalClass.sidebarFrameworkFilterButton}
            data-selected={isSelected ? "true" : undefined}
            aria-pressed={isSelected}
            aria-label={framework.label}
            title={framework.label}
            onClick={() => toggle(framework.id)}
          >
            <img
              src={framework.iconSrc}
              alt=""
              className={portalClass.sidebarFrameworkFilterIcon}
              width={16}
              height={16}
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}
