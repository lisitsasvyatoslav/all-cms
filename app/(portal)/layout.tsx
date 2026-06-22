import type { Metadata } from "next";
import { Geist_Mono, Inter, Montserrat } from "next/font/google";
import Script from "next/script";

import { PortalAppShell } from "@/components/portal/layout/portal-shell";
import { PortalThemeProvider } from "@/components/providers/portal-theme-provider";
import { loadComponentNavGroups } from "@/lib/portal/components/load-nav-groups";
import { loadBrandNavItems } from "@/lib/portal/brand/load-pages";
import { loadPortalSources } from "@/lib/portal/core/load-portal-sources";
import { portalAppearanceInitScript } from "@/lib/radix/portal-appearance";

import { PortalSidebar } from "./portal-sidebar";

import { buildPortalLayoutMetadataFromCms } from "@/lib/portal/components/open-graph";

import "@radix-ui/themes/styles.css";
import "../globals.css";
import "../radix-themes.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  return buildPortalLayoutMetadataFromCms();
}

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [componentNavGroups, brandNavItems, sources] = await Promise.all([
    loadComponentNavGroups(),
    loadBrandNavItems(),
    loadPortalSources(),
  ]);

  return (
    <html
      lang="ru"
      className={`${montserrat.variable} ${inter.variable} ${geistMono.variable}`}
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
            sidebar={
              <PortalSidebar componentGroups={componentNavGroups} brandNavItems={brandNavItems} />
            }
            sources={sources}
          >
            {children}
          </PortalAppShell>
        </PortalThemeProvider>
      </body>
    </html>
  );
}
