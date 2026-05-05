import Link from "next/link";
import { notFound } from "next/navigation";

import { getComponentBySlug } from "@/lib/content";

import { getComponentDoc } from "@/lib/component-docs";

import { ComponentLiveDemos } from "./live-demos";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const doc = await getComponentBySlug(slug);
  return {
    title: doc ? `${doc.name} · Design System` : "Компонент",
    description: doc?.description ?? "",
  };
}

export default async function ComponentDocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getComponentBySlug(slug);
  if (!doc) notFound();

  const staticDoc = getComponentDoc(slug);

  return (
    <div className="min-h-full bg-white dark:bg-black">
      <article className="mx-auto max-w-3xl px-8 py-12 lg:py-16">
        <nav className="mb-8 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-300">
            Главная
          </Link>
          <span className="mx-2 text-zinc-300">/</span>
          <span className="text-zinc-800 dark:text-zinc-200">Components</span>
          <span className="mx-2 text-zinc-300">/</span>
          <span className="font-mono text-zinc-600 dark:text-zinc-400">{slug}</span>
        </nav>

        <header className="mb-10 border-b border-zinc-100 pb-10 dark:border-zinc-900">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {doc.name}
          </h1>
          {doc.description ? (
            <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {doc.description}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {doc.figmaUrl ? (
              <SourceLink href={doc.figmaUrl}>Figma</SourceLink>
            ) : null}
            {doc.storybookUrl ? (
              <SourceLink href={doc.storybookUrl}>Storybook</SourceLink>
            ) : null}
            {doc.docsUrl ? (
              <SourceLink href={doc.docsUrl}>Документация</SourceLink>
            ) : null}
          </div>
        </header>

        <section className="mb-14">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Превью
          </h2>
          <ComponentLiveDemos slug={slug} />
        </section>

        {staticDoc ? (
          <>
            <section className="mb-14">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Пропсы
              </h2>
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                      <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                        Имя
                      </th>
                      <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                        Тип
                      </th>
                      <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                        По умолч.
                      </th>
                      <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                        Описание
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {staticDoc.props.map((row) => (
                      <tr
                        key={row.name}
                        className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-zinc-800 dark:text-zinc-200">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                          {row.type}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                          {row.default ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                          {row.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-14">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Установка
              </h2>
              <CodeBlock title="Импорт" code={staticDoc.importSnippet} />
              <div className="mt-6">
                <CodeBlock title="Базовый пример" code={staticDoc.basicSnippet} />
              </div>
            </section>

            <section className="mb-10">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Примеры кода
              </h2>
              <div className="flex flex-col gap-8">
                {staticDoc.variantSnippets.map((block) => (
                  <div key={block.label}>
                    <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {block.label}
                    </p>
                    <CodeBlock code={block.code} />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <p className="text-sm text-zinc-500">
            Для компонента «{slug}» пока нет статической таблицы пропсов — добавьте запись в{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-800">
              lib/component-docs.ts
            </code>
            .
          </p>
        )}
      </article>
    </div>
  );
}

function SourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex rounded-full border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
    >
      {children}
    </a>
  );
}

function CodeBlock({ title, code }: { title?: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      {title ? (
        <div className="border-b border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-500 dark:border-zinc-800">
          {title}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
