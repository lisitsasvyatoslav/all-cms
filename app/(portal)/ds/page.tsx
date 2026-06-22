import type { Metadata } from "next";

import { DsHomePageView } from "@/components/portal/layout/ds-home-page";
import { buildHomeOpenGraphMetadata } from "@/lib/portal/components/open-graph";
import { loadDsOverviewPage } from "@/lib/portal/components/load-ds-overview";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeOpenGraphMetadata();
}

export default async function Home() {
  const page = await loadDsOverviewPage();

  return <DsHomePageView page={page} />;
}
