import Link from "next/link";
import {
  getColors,
  getComponents,
  getIcons,
  getPortalSource,
  sanityConfigured,
  sanityStudioUrl,
} from "@/lib/sanity/content";

/** CMS-backed page: do not bake content into the static shell at build time. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    sources,
    components,
    colors,
    icons,
  ] = await Promise.all([
    getPortalSource(),
    getComponents(),
    getColors(),
    getIcons(),
  ]);

  const figma = sources?.figmaLibraryUrl;
  const storybook = sources?.storybookUrl;
  const docsUrl = sources?.documentationUrl;
  const repo = sources?.repositoryUrl;

  return (
    <div className="bg-white dark:bg-black">
      <main className="mx-auto flex max-w-3xl flex-col gap-14 px-8 py-12 lg:py-16">
        <section
          id="overview"
          className="scroll-mt-24 flex flex-col gap-3 border-b border-zinc-100 pb-12 dark:border-zinc-900"
        >
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Тестовый портал · Sanity + Next.js
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Дизайн-система
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Данные ниже из документов Sanity. Редактирование в{" "}
            <a
              className="font-medium underline"
              href={sanityStudioUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sanity Studio
            </a>
            . Навигация слева — якоря по разделам (как в доках Radix).
          </p>
        </section>

        <section id="sources" className="scroll-mt-24 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Источники
          </h2>
          <nav className="flex flex-wrap gap-2">
            {figma ? (
              <SourceChip href={figma} label="Figma" />
            ) : null}
            {storybook ? (
              <SourceChip href={storybook} label="Storybook" />
            ) : null}
            {docsUrl ? (
              <SourceChip href={docsUrl} label="Документация" />
            ) : null}
            {repo ? <SourceChip href={repo} label="Репозиторий" /> : null}
            {!figma && !storybook && !docsUrl && !repo ? (
              <span className="text-sm text-zinc-500">
                {sanityConfigured
                  ? "Заполните документ `Portal Sources` в Sanity Studio."
                  : "Укажите SANITY_PROJECT_ID и SANITY_DATASET в .env."}
              </span>
            ) : null}
          </nav>
        </section>

        <section id="components" className="scroll-mt-24 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Компоненты
          </h2>
          {components.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {sanityConfigured
                ? "Пусто. Добавьте документы в Sanity (`component`)."
                : "Sanity не настроен: добавьте SANITY_PROJECT_ID и SANITY_DATASET."}
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {components.map((c) => (
                <li
                  key={c._id}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {c.name}
                    </p>
                    <code className="rounded bg-zinc-200/80 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {c.slug}
                    </code>
                  </div>
                  {c.description ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                      {c.description}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <Link
                      href={`/components/${c.slug}`}
                      className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500 dark:text-zinc-100"
                    >
                      Документация и превью →
                    </Link>
                    <OptionalLink href={c.figmaUrl} label="Figma" />
                    <OptionalLink href={c.storybookUrl} label="Storybook" />
                    <OptionalLink href={c.docsUrl} label="Доки" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="colors" className="scroll-mt-24 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Цвета
          </h2>
          {colors.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Пусто. Добавьте документы `color` в Sanity.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {colors.map((color) => (
                <li
                  key={color._id}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-950/50"
                >
                  <span
                    className="size-10 shrink-0 rounded-lg border border-zinc-200 shadow-inner dark:border-zinc-700"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                      {color.name}
                    </p>
                    <p className="truncate font-mono text-xs text-zinc-500">
                      {color.hex}
                      {color.tokenKey ? ` · ${color.tokenKey}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="icons" className="scroll-mt-24 flex flex-col gap-4 pb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Иконки
          </h2>
          {icons.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Пусто. Добавьте документы `icon` в Sanity.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {icons.map((icon) => {
                const prev = icon.previewUrl ?? null;

                return (
                  <li
                    key={icon._id}
                    className="flex gap-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50"
                  >
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                      {prev ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prev}
                          alt=""
                          className="size-full object-contain p-1"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center text-xs text-zinc-400">
                          —
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {icon.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <OptionalLink href={icon.figmaUrl} label="Figma" />
                        <OptionalLink href={icon.storybookUrl} label="Storybook" />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function SourceChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex rounded-full border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-900"
    >
      {label}
    </a>
  );
}

function OptionalLink({
  href,
  label,
}: {
  href: string | null | undefined;
  label: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
    >
      {label}
    </a>
  );
}
