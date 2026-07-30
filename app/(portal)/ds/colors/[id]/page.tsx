import { buildColorPageOpenGraphMetadata } from "@/lib/portal/components/open-graph";
import { colorPagePath } from "@/lib/portal/components/routes";
import { PortalPageSuspense } from "@/components/portal/layout/portal-page-suspense";
import { loadColorById } from "@/lib/portal/colors/load-color";

import { ColorPageBody } from "./color-page-body";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return { title: "Цвет" };

  const doc = await loadColorById(numericId);
  if (!doc) return { title: "Цвет" };

  return buildColorPageOpenGraphMetadata({
    title: `${doc.name} · Colors`,
    description: doc.caption ?? doc.tokenKey ?? doc.hex ?? undefined,
    path: colorPagePath(numericId),
  });
}

export default async function ColorDocPage({ params }: Props) {
  const { id } = await params;

  return (
    <PortalPageSuspense>
      <ColorPageBody id={id} />
    </PortalPageSuspense>
  );
}
