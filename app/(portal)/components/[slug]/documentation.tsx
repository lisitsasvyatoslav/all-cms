import type { Component, Media } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";

type DocBlock = NonNullable<Component["documentation"]>[number];

function mediaPublicUrl(image: number | Media): string | null {
  if (typeof image === "object" && image?.url) return image.url;
  return null;
}

function safeJsonStringify(payload: unknown): string {
  try {
    return JSON.stringify(payload ?? null, null, 2);
  } catch {
    return String(payload);
  }
}

/** Рендер блоков из Payload: админка = ввод данных, здесь — «док-сайт» (типографика, таблицы, карточки). */
export function ComponentDocumentation({
  blocks,
}: {
  blocks: NonNullable<Component["documentation"]> | null | undefined;
}) {
  if (!blocks?.length) return null;

  return (
    <section
      className="mb-16 scroll-mt-8"
      aria-labelledby="cms-docs-heading"
    >
      <header className="mb-10 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
          Документация
        </p>
        <h2
          id="cms-docs-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          Из контентной модели
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Ниже — то же содержимое, что вы настраиваете во вкладке «Документация» в Payload: здесь оно оформлено для чтения. В
          админке специально формы, а не макет страницы.
        </p>
      </header>

      <div className="flex flex-col gap-14">
        {blocks.map((block, i) => (
          <DocumentationBlock key={block.id ?? `doc-${i}`} block={block} />
        ))}
      </div>
    </section>
  );
}

function DocumentationBlock({ block }: { block: DocBlock }) {
  switch (block.blockType) {
    case "section":
      return (
        <div className="relative pl-5">
          <span
            className="absolute left-0 top-1.5 h-[calc(100%-0.25rem)] w-0.5 rounded-full bg-zinc-900 dark:bg-zinc-100"
            aria-hidden
          />
          <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {block.heading}
          </h3>
          {block.body ? (
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-[15px] leading-7 text-zinc-600 dark:text-zinc-400">
              {block.body}
            </p>
          ) : null}
        </div>
      );
    case "doDont": {
      const dos = block.dos?.filter(Boolean) ?? [];
      const donts = block.donts?.filter(Boolean) ?? [];
      if (!dos.length && !donts.length) return null;
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          {dos.length ? (
            <div className="overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/90 to-white shadow-sm dark:border-emerald-900/50 dark:from-emerald-950/50 dark:to-zinc-950">
              <div className="border-b border-emerald-200/80 bg-emerald-100/60 px-4 py-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/80">
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-900 dark:text-emerald-200">
                  Делайте
                </span>
              </div>
              <ul className="space-y-3 p-4 text-[15px] leading-relaxed text-emerald-950 dark:text-emerald-50/95">
                {dos.map((row, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{row.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {donts.length ? (
            <div className="overflow-hidden rounded-2xl border border-rose-200/90 bg-gradient-to-b from-rose-50/90 to-white shadow-sm dark:border-rose-900/50 dark:from-rose-950/50 dark:to-zinc-950">
              <div className="border-b border-rose-200/80 bg-rose-100/60 px-4 py-2.5 dark:border-rose-900/40 dark:bg-rose-950/80">
                <span className="text-xs font-semibold uppercase tracking-wide text-rose-900 dark:text-rose-200">
                  Не делайте
                </span>
              </div>
              <ul className="space-y-3 p-4 text-[15px] leading-relaxed text-rose-950 dark:text-rose-50/95">
                {donts.map((row, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white"
                      aria-hidden
                    >
                      ×
                    </span>
                    <span>{row.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      );
    }
    case "callout": {
      const tone =
        block.tone === "warning"
          ? {
              wrap: "border-amber-200/90 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/35",
              label: "Внимание",
            }
          : block.tone === "success"
            ? {
                wrap: "border-emerald-200/90 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/35",
                label: "Совет",
              }
            : {
                wrap: "border-sky-200/90 bg-sky-50/80 dark:border-sky-900/50 dark:bg-sky-950/35",
                label: "Инфо",
              };
      return (
        <aside
          className={`flex gap-4 rounded-2xl border px-5 py-4 text-[15px] leading-7 shadow-sm ${tone.wrap}`}
        >
          <span className="select-none text-lg opacity-70" aria-hidden>
            {block.tone === "warning" ? "!" : block.tone === "success" ? "✓" : "i"}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
              {tone.label}
            </p>
            <p className="mt-1 text-zinc-900 dark:text-zinc-100">{block.text}</p>
          </div>
        </aside>
      );
    }
    case "codeExample":
      return (
        <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <figcaption className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/80">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            </span>
            <span className="truncate text-xs font-medium text-zinc-500">
              {block.title ?? "tsx"}
            </span>
          </figcaption>
          <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-200">
            <code>{(block.code ?? "").trim()}</code>
          </pre>
        </figure>
      );
    case "codeMonaco":
      return (
        <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <figcaption className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/80">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
            </span>
            <span className="truncate text-xs font-medium text-zinc-500">
              {block.title ?? "Monaco (поле Code)"}
            </span>
          </figcaption>
          <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-200">
            <code>{(block.snippet ?? "").trim()}</code>
          </pre>
        </figure>
      );
    case "richTextSection":
      if (!block.body) return null;
      return (
        <div>
          {block.title ? (
            <h3 className="mb-3 text-lg font-semibold text-zinc-950 dark:text-zinc-50">{block.title}</h3>
          ) : null}
          <div className="max-w-none text-[15px] leading-7 text-zinc-800 dark:text-zinc-200 [&_a]:text-blue-600 [&_a]:underline dark:[&_a]:text-blue-400 [&_p]:mb-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
            <RichText data={block.body} />
          </div>
        </div>
      );
    case "propsTable": {
      const rows = block.rows?.filter(Boolean) ?? [];
      if (!rows.length) return null;
      return (
        <div>
          {block.title ? (
            <h3 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              {block.title}
            </h3>
          ) : null}
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Имя</th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Тип</th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">По умолч.</th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">Описание</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-100">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {row.type}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      {row.defaultValue?.trim() ? row.defaultValue : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {row.description ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    case "resourceLinks": {
      const links = block.links?.filter((l) => l?.url && l?.label) ?? [];
      if (!links.length) return null;
      return (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">Ссылки</h3>
          <ul className="flex flex-wrap gap-3">
            {links.map((link, i) => (
              <li key={i}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  {link.label}
                  <span className="text-zinc-400" aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case "divider":
      return (
        <div className="flex flex-col items-center gap-3 py-2">
          {block.caption ? (
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
              {block.caption}
            </span>
          ) : null}
          <hr className="w-full border-zinc-200 dark:border-zinc-800" />
        </div>
      );
    case "quote":
      return (
        <blockquote className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-[17px] font-medium leading-8 text-zinc-900 dark:text-zinc-100">
            «{block.body}»
          </p>
          {block.attribution ? (
            <footer className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              — {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );
    case "mediaFigure": {
      const src = mediaPublicUrl(block.image);
      if (!src) return null;
      return (
        <figure className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={block.caption || ""} className="w-full object-cover" />
          {block.caption ? (
            <figcaption className="border-t border-zinc-200 px-4 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "relColor": {
      const c = block.color;
      if (!c || typeof c !== "object") return null;
      return (
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <span
            className="h-10 w-10 shrink-0 rounded-lg border border-zinc-200 shadow-inner dark:border-zinc-700"
            style={{ backgroundColor: c.hex }}
            title={c.hex}
          />
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{c.name}</p>
            <p className="font-mono text-xs text-zinc-500">{c.hex}</p>
          </div>
        </div>
      );
    }
    case "relIcon": {
      const ic = block.icon;
      if (!ic || typeof ic !== "object") return null;
      const prev = ic.preview;
      const prevUrl =
        prev && typeof prev === "object" && prev.url ? prev.url : null;
      return (
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
          {prevUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={prevUrl} alt={ic.name} className="h-10 w-10 object-contain" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-800">
              —
            </span>
          )}
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{ic.name}</p>
            {ic.slug ? (
              <p className="font-mono text-xs text-zinc-500">{ic.slug}</p>
            ) : null}
          </div>
        </div>
      );
    }
    case "geoPoint": {
      const loc = block.location;
      if (!loc || loc.length < 2) return null;
      const [lng, lat] = loc;
      const href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;
      return (
        <div className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm dark:border-zinc-800">
          {block.label ? <p className="mb-2 font-medium text-zinc-800 dark:text-zinc-200">{block.label}</p> : null}
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
            {lng.toFixed(5)}, {lat.toFixed(5)} <span className="text-zinc-400">(lng, lat)</span>
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Открыть на карте ↗
          </a>
        </div>
      );
    }
    case "calendarDate":
      return (
        <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
          {block.title ? <p className="font-medium text-zinc-900 dark:text-zinc-100">{block.title}</p> : null}
          {block.at ? (
            <time className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
              {new Date(block.at).toLocaleString("ru-RU", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
          ) : (
            <span className="text-sm text-zinc-400">Дата не задана</span>
          )}
        </div>
      );
    case "emailLine":
      return (
        <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
          {block.label ? <p className="text-xs uppercase tracking-wide text-zinc-500">{block.label}</p> : null}
          {block.address ? (
            <a href={`mailto:${block.address}`} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              {block.address}
            </a>
          ) : null}
        </div>
      );
    case "numberStat":
      return (
        <div className="inline-flex min-w-[8rem] flex-col rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          {block.label ? <span className="text-xs text-zinc-500">{block.label}</span> : null}
          <span className="text-2xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
            {block.value ?? "—"}
          </span>
        </div>
      );
    case "radioPick": {
      const labels: Record<string, string> = { fast: "Быстро", normal: "Нормально", precise: "Точно" };
      const m = block.mode ?? "normal";
      return (
        <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Radio</p>
          <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">{labels[m] ?? m}</p>
          {block.hint ? (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{block.hint}</p>
          ) : null}
        </div>
      );
    }
    case "multiSelect": {
      const tags = block.tags?.filter(Boolean) ?? [];
      return (
        <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Select (несколько)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.length ? (
              tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {t}
                </span>
              ))
            ) : (
              <span className="text-sm text-zinc-400">—</span>
            )}
          </div>
          {block.note ? <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{block.note}</p> : null}
        </div>
      );
    }
    case "flagBox":
      return (
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${block.enabled ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}
          >
            {block.enabled ? "Да" : "Нет"}
          </span>
          <span className="text-sm text-zinc-800 dark:text-zinc-200">{block.flagLabel ?? "Checkbox"}</span>
        </div>
      );
    case "jsonBlock":
      return (
        <div>
          {block.title ? (
            <h3 className="mb-2 text-lg font-semibold text-zinc-950 dark:text-zinc-50">{block.title}</h3>
          ) : null}
          <pre className="overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-950 p-4 text-xs leading-relaxed text-emerald-100/90 dark:border-zinc-800">
            <code>{safeJsonStringify(block.payload)}</code>
          </pre>
        </div>
      );
    case "groupStrip": {
      const b = block.bundle;
      if (!b) return null;
      return (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Group</p>
          <dl className="mt-2 grid gap-1 text-sm text-zinc-800 dark:text-zinc-200">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Название</dt>
              <dd>{b.gTitle ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Счётчик</dt>
              <dd className="tabular-nums">{b.gCount ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500">Активно</dt>
              <dd>{b.gOn ? "Да" : "Нет"}</dd>
            </div>
          </dl>
        </div>
      );
    }
    case "nestedStack": {
      const items = block.items?.filter((x): x is NonNullable<typeof x> & { blockType: "nestLine" } => x?.blockType === "nestLine") ?? [];
      return (
        <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Вложенные blocks</p>
          {block.intro ? <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{block.intro}</p> : null}
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-900 dark:text-zinc-100">
            {items.map((it, i) => (
              <li key={it.id ?? i}>{it.line}</li>
            ))}
          </ol>
        </div>
      );
    }
    case "namedTabsStrip":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">tabSummary.brief</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200">
              {block.tabSummary?.brief ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">tabDetail.detail</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200">
              {block.tabDetail?.detail ?? "—"}
            </p>
          </div>
        </div>
      );
    default: {
      const b = block as { blockType?: string; id?: string | null };
      return (
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          <p className="font-semibold">Блок не отображается на портале</p>
          <p className="mt-1 text-xs opacity-90">
            Тип <code className="rounded bg-amber-100/80 px-1 font-mono dark:bg-amber-900/50">{String(b.blockType)}</code> не
            обработан в <code className="font-mono">documentation.tsx</code> — добавьте ветку{" "}
            <code className="font-mono">switch</code> для этого <code className="font-mono">blockType</code>.
          </p>
        </div>
      );
    }
  }
}
