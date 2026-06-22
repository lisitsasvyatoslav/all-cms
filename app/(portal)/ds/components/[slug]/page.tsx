import { redirect } from "next/navigation";

import { componentWebPagePath } from "@/lib/portal/components/routes";

type Props = { params: Promise<{ slug: string }> };

/** Старые URL /ds/components/:slug → /ds/components/web/:slug */
export default async function LegacyComponentRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(componentWebPagePath(slug));
}
