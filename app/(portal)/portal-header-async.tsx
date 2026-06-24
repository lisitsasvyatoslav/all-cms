import { PortalHeader } from "@/components/portal/layout/portal-header";
import { loadPortalSources } from "@/lib/portal/core/load-portal-sources";

export async function PortalHeaderAsync() {
  const sources = await loadPortalSources();
  return <PortalHeader sources={sources} />;
}
