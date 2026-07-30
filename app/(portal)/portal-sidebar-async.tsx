import { loadBrandNavItems } from "@/lib/portal/brand/load-pages";
import { loadDsOverviewNavItems } from "@/lib/portal/ds-pages/load-pages";
import { loadComponentNavGroups } from "@/lib/portal/components/load-nav-groups";

import { PortalSidebar } from "./portal-sidebar";

export async function PortalSidebarAsync() {
  const [componentNavGroups, brandNavItems, dsPageNavItems] = await Promise.all([
    loadComponentNavGroups(),
    loadBrandNavItems(),
    loadDsOverviewNavItems(),
  ]);

  return (
    <PortalSidebar
      componentGroups={componentNavGroups}
      brandNavItems={brandNavItems}
      dsPageNavItems={dsPageNavItems}
    />
  );
}
