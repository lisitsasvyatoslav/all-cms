import { DsHomePageView } from "@/components/portal/layout/ds-home-page";
import { loadDsOverviewPage } from "@/lib/portal/components/load-ds-overview";

export async function DsHomePageBody() {
  const page = await loadDsOverviewPage();
  return <DsHomePageView page={page} />;
}
