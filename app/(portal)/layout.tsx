import { getPayload } from "payload";

import config from "@payload-config";

import { PortalSidebar } from "./portal-sidebar";

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
    <div className="flex min-h-full flex-1 flex-row bg-zinc-50 dark:bg-black">
      <PortalSidebar components={componentNav} />
      <div className="min-h-full min-w-0 flex-1">{children}</div>
    </div>
  );
}
