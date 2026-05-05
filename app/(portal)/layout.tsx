import { getComponents } from "@/lib/content";

import { PortalSidebar } from "./portal-sidebar";

export default async function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const docs = await getComponents();
  const componentNav = docs.map((d) => ({
    slug: String(d.slug),
    name: String(d.name),
  }));

  return (
    <div className="flex min-h-full flex-1 flex-row bg-zinc-50 dark:bg-black">
      <PortalSidebar components={componentNav} />
      <div className="min-h-full min-w-0 flex-1">{children}</div>
    </div>
  );
}
