import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getPayload } from "payload";

import config from "@payload-config";

import { PortalSidebar } from "./portal-sidebar";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Design System · Portal",
  description: "Тестовый портал дизайн-системы (Payload + Next.js)",
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

  const componentNav = docs.map((d) => ({
    slug: String(d.slug),
    name: String(d.name),
  }));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-full flex-1 flex-row bg-zinc-50 dark:bg-black">
          <PortalSidebar components={componentNav} />
          <div className="min-h-full min-w-0 flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
