import { loadBrandNavItems } from "@/lib/portal/brand/load-pages";
import { loadComponentNavGroups } from "@/lib/portal/components/load-nav-groups";

import { PortalSidebar } from "./portal-sidebar";

export async function PortalSidebarAsync() {
  const [componentNavGroups, brandNavItems] = await Promise.all([
    loadComponentNavGroups(),
    loadBrandNavItems(),
  ]);

  return (
    <PortalSidebar componentGroups={componentNavGroups} brandNavItems={brandNavItems} />
  );
}
