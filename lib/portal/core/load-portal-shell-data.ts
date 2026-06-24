import { cache } from "react";

import { loadBrandNavItems } from "@/lib/portal/brand/load-pages";
import { loadComponentNavGroups } from "@/lib/portal/components/load-nav-groups";
import { loadPortalSources } from "@/lib/portal/core/load-portal-sources";
import type { PortalComponentNavGroup } from "@/lib/portal/components/load-nav-groups";
import type { BrandNavItem } from "@/lib/portal/brand/nav";
import type { PortalSourcesLinks } from "@/lib/portal/core/load-portal-sources";

export type PortalShellData = {
  componentNavGroups: PortalComponentNavGroup[];
  brandNavItems: BrandNavItem[];
  sources: PortalSourcesLinks;
};

/** Сайдбар и шапка — те же кэши, что nav/catalog (без дублирующего запроса components). */
export const loadPortalShellData = cache(async (): Promise<PortalShellData> => {
  const [componentNavGroups, brandNavItems, sources] = await Promise.all([
    loadComponentNavGroups(),
    loadBrandNavItems(),
    loadPortalSources(),
  ]);

  return { componentNavGroups, brandNavItems, sources };
});
