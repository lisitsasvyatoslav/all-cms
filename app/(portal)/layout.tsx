import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";

import { PortalAppShell } from "@/components/portal/layout/portal-shell";
import { PortalHeaderSkeleton } from "@/components/portal/layout/portal-header-skeleton";
import { PortalSidebarSkeleton } from "@/components/portal/layout/portal-sidebar-skeleton";
import { PortalThemeProvider } from "@/components/providers/portal-theme-provider";
import { PORTAL_PAGE_REVALIDATE_SECONDS } from "@/lib/portal/cache/page-revalidate";
import { portalFontClassName } from "@/lib/portal/core/portal-fonts";
import { portalAppearanceInitScript } from "@/lib/radix/portal-appearance";

import { PortalHeaderAsync } from "./portal-header-async";
import { PortalSidebarAsync } from "./portal-sidebar-async";

import { buildPortalLayoutMetadataFromCms } from "@/lib/portal/components/open-graph";

import "@radix-ui/themes/styles.css";
import "../globals.css";
import "../radix-themes.css";

export const revalidate = PORTAL_PAGE_REVALIDATE_SECONDS;

export async function generateMetadata(): Promise<Metadata> {
  return buildPortalLayoutMetadataFromCms();
}

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={portalFontClassName}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Script
          id="portal-appearance-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: portalAppearanceInitScript }}
        />
        <PortalThemeProvider>
          <PortalAppShell
            header={
              <Suspense fallback={<PortalHeaderSkeleton />}>
                <PortalHeaderAsync />
              </Suspense>
            }
            sidebar={
              <Suspense fallback={<PortalSidebarSkeleton />}>
                <PortalSidebarAsync />
              </Suspense>
            }
          >
            {children}
          </PortalAppShell>
        </PortalThemeProvider>
      </body>
    </html>
  );
}
