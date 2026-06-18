"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { portalClass } from "@/lib/portal/classes";
import {
  PORTAL_BASE_PATH,
  PORTAL_BRAND_PATH,
  PORTAL_TEXT_PATH,
  portalAreaFromPathname,
  type PortalAreaId,
} from "@/lib/portal/portal-base-path";

const PORTAL_AREAS: { id: PortalAreaId; label: string; href: string }[] = [
  { id: "ds", label: "DS", href: PORTAL_BASE_PATH },
  { id: "text", label: "Text", href: PORTAL_TEXT_PATH },
  { id: "brand", label: "Brand", href: PORTAL_BRAND_PATH },
];

export function PortalSidebarAreaNav() {
  const pathname = usePathname();
  const activeArea = portalAreaFromPathname(pathname);

  return (
    <div className={portalClass.sidebarAreaNav} role="navigation" aria-label="Разделы портала">
      {PORTAL_AREAS.map((area) => (
        <NextLink
          key={area.id}
          href={area.href}
          className={portalClass.sidebarAreaNavLink}
          data-active={activeArea === area.id ? "true" : undefined}
          aria-current={activeArea === area.id ? "page" : undefined}
        >
          {area.label}
        </NextLink>
      ))}
    </div>
  );
}
