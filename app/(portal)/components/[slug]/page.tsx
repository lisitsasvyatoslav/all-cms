import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/** Старые URL /components/:slug → /components/web/:slug */
export default async function LegacyComponentRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/components/web/${slug}`);
}
