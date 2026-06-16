import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { getPayload } from "payload";

import config from "@payload-config";

import { PortalAppShell } from "@/components/portal/portal-shell";
import { PortalThemeProvider } from "@/components/providers/portal-theme-provider";
import { isComponentVisibleOnPortal } from "@/lib/portal/component-status";
import { portalAppearanceInitScript } from "@/lib/radix/portal-appearance";

import { PortalSidebar } from "./portal-sidebar";

import { portalRootOpenGraphMetadata } from "@/lib/portal/component-open-graph";

import "@radix-ui/themes/styles.css";
import "../globals.css";
import "../radix-themes.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Design System · Portal",
    template: "%s · Design System",
  },
  description: "Портал дизайн-системы: компоненты, документация, Storybook.",
  ...portalRootOpenGraphMetadata(),
};

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "components",
    depth: 0,
    limit: 100,
    sort: "name",
    overrideAccess: true,
  });

  const componentNav = docs
    .filter((d) => isComponentVisibleOnPortal(d))
    .map((d) => ({
      slug: String(d.slug),
      name: String(d.name),
      status: d.status,
    }));

  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Script
          id="portal-appearance-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: portalAppearanceInitScript }}
        />
        <PortalThemeProvider>
          <PortalAppShell sidebar={<PortalSidebar components={componentNav} />}>
            {children}
          </PortalAppShell>
        </PortalThemeProvider>
      </body>
    </html>
  );
}
