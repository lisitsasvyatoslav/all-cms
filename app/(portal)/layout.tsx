import {
  getComponents,
  getStrapiAdminUrl,
} from "@/lib/strapi";

import { PortalSidebar } from "./portal-sidebar";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let componentNav: { slug: string; name: string }[] = [];
  try {
    const docs = await getComponents();
    componentNav = docs.map((d) => ({
      slug: String(d.slug),
      name: String(d.name),
    }));
  } catch {
    componentNav = [];
  }

  return (
    <div className="flex min-h-full flex-1 flex-row bg-zinc-50 dark:bg-black">
      <PortalSidebar
        components={componentNav}
        adminHref={getStrapiAdminUrl()}
      />
      <div className="min-h-full min-w-0 flex-1">{children}</div>
    </div>
  );
}
