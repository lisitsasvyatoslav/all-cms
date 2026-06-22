"use client";

import NextLink from "next/link";
import type { ReactNode } from "react";

import { portalClass } from "@/lib/portal/core/classes";

type Props = {
  href: string;
  active: boolean;
  children: ReactNode;
  badge?: ReactNode;
};

export function PortalSidebarLink({ href, active, children, badge }: Props) {
  return (
    <NextLink
      href={href}
      className={portalClass.sidebarLink}
      data-active={active ? "true" : undefined}
    >
      <span className={portalClass.sidebarLinkContent}>
        <span className={portalClass.sidebarLinkLabel}>{children}</span>
        {badge}
      </span>
    </NextLink>
  );
}

/** @deprecated Use PortalSidebarLink */
export function PortalNavItem({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={active ? `${portalClass.navItem} ${portalClass.navItemActive}` : portalClass.navItem}
      data-active={active ? "true" : undefined}
    >
      {children}
    </div>
  );
}
