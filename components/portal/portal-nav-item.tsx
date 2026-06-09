"use client";

import { Box } from "@radix-ui/themes";
import type { ReactNode } from "react";

import { portalClass } from "@/lib/portal/classes";

export function PortalNavItem({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Box
      px="2"
      py="1"
      className={active ? `${portalClass.navItem} ${portalClass.navItemActive}` : portalClass.navItem}
    >
      {children}
    </Box>
  );
}
