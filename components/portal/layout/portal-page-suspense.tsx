import { Suspense, type ReactNode } from "react";

import { PortalMainLoadingSkeleton } from "@/components/portal/layout/portal-main-loading-skeleton";

/** Оборачивает async server page body — streaming при навигации. */
export function PortalPageSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PortalMainLoadingSkeleton />}>{children}</Suspense>;
}
