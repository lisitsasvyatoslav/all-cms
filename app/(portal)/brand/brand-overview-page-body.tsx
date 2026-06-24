import { BrandOverviewPageView } from "@/components/portal/brand/brand-foundation-page";
import { loadBrandNavItems, loadBrandOverview } from "@/lib/portal/brand/load-pages";

export async function BrandOverviewPageBody() {
  const [overview, navItems] = await Promise.all([loadBrandOverview(), loadBrandNavItems()]);
  return <BrandOverviewPageView overview={overview} navItems={navItems} />;
}
