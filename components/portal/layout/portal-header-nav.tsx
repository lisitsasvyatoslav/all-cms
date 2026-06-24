"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { portalClass } from "@/lib/portal/core/classes";
import {
  PORTAL_BASE_PATH,
  PORTAL_BRAND_PATH,
  PORTAL_TEXT_PATH,
  portalAreaFromPathname,
  type PortalAreaId,
} from "@/lib/portal/core/portal-base-path";

const PORTAL_AREAS: { id: PortalAreaId; label: string; href: string }[] = [
  { id: "ds", label: "DS", href: PORTAL_BASE_PATH },
  { id: "text", label: "Text", href: PORTAL_TEXT_PATH },
  { id: "brand", label: "Brand", href: PORTAL_BRAND_PATH },
];

/** Только подсветка активного раздела — минимальный client island в шапке. */
export function PortalHeaderNav() {
  const pathname = usePathname();
  const activeArea = portalAreaFromPathname(pathname);

  return (
    <nav
      className={portalClass.headerNav}
      role="navigation"
      aria-label="Разделы портала"
    >
      {PORTAL_AREAS.map((area) => (
        <NextLink
          key={area.id}
          href={area.href}
          className={portalClass.headerNavLink}
          data-active={activeArea === area.id ? "true" : undefined}
          aria-current={activeArea === area.id ? "page" : undefined}
        >
          {area.label}
        </NextLink>
      ))}
    </nav>
  );
}
