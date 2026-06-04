import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

import config from "@payload-config";

import { ComponentDocumentation } from "@/app/(portal)/components/[slug]/documentation";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return { title: "Цвет" };

  const payload = await getPayload({ config });
  const doc = await payload.findByID({
    collection: "colors",
    id: numericId,
    depth: 2,
  });

  return {
    title: doc ? `${doc.name} · Colors` : "Цвет",
    description: doc?.caption ?? doc?.tokenKey ?? doc?.hex ?? "",
  };
}

export default async function ColorDocPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const payload = await getPayload({ config });
  let doc;
  try {
    doc = await payload.findByID({
      collection: "colors",
      id: numericId,
      depth: 2,
    });
  } catch {
    notFound();
  }

  return (
    <div className="min-h-full bg-white dark:bg-black">
      <article className="mx-auto max-w-3xl px-8 py-12 lg:py-16">
        <nav className="mb-8 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-300">
            Главная
          </Link>
          <span className="mx-2 text-zinc-300">/</span>
          <Link href="/#colors" className="hover:text-zinc-800 dark:hover:text-zinc-300">
            Colors
          </Link>
          <span className="mx-2 text-zinc-300">/</span>
          <span className="font-mono text-zinc-600 dark:text-zinc-400">{id}</span>
        </nav>

        <header className="mb-10 flex items-start gap-5 border-b border-zinc-100 pb-10 dark:border-zinc-900">
          <span
            className="size-16 shrink-0 rounded-2xl border border-zinc-200 shadow-inner dark:border-zinc-700"
            style={{ backgroundColor: doc.hex }}
            title={doc.hex}
          />
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {doc.name}
            </h1>
            <p className="mt-2 font-mono text-sm text-zinc-600 dark:text-zinc-400">
              {doc.hex}
              {doc.tokenKey ? ` · ${doc.tokenKey}` : ""}
            </p>
            {doc.caption ? (
              <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                {doc.caption}
              </p>
            ) : null}
          </div>
        </header>

        <ComponentDocumentation blocks={doc.documentation} />
      </article>
    </div>
  );
}
