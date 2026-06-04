"use client";

import { composeStories } from "@storybook/react";
import { useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";

import { PORTAL_STORYBOOK_REGISTRY } from "@/lib/storybook/portal-registry";

function DemoSurface({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
        {title}
      </p>
      {children}
    </div>
  );
}

/** Превью по slug — stories подгружаются динамически (меньше work при первом compile в dev). */
export function StorybookPortalPreviews({ slug }: { slug: string }) {
  const entry = PORTAL_STORYBOOK_REGISTRY[slug];
  const [composed, setComposed] = useState<ReturnType<typeof composeStories> | null>(
    null,
  );

  useEffect(() => {
    if (!entry) {
      setComposed(null);
      return;
    }

    let cancelled = false;
    setComposed(null);

    void entry.loadStories().then((mod) => {
      if (!cancelled) setComposed(composeStories(mod));
    });

    return () => {
      cancelled = true;
    };
  }, [entry, slug]);

  if (!entry) return null;

  if (!composed) {
    return (
      <p className="text-sm text-zinc-500" aria-busy="true">
        Загрузка превью…
      </p>
    );
  }

  const { catalog, layoutClassName = "" } = entry;

  return (
    <div className={`flex flex-col gap-8 ${layoutClassName}`.trim()}>
      {catalog.map(({ storyId, title }) => {
        const Story = composed[storyId as keyof typeof composed];
        if (!Story) {
          return (
            <p key={storyId} className="text-sm text-amber-700 dark:text-amber-300">
              Story «{storyId}» не найдена в{" "}
              <code className="font-mono text-xs">*.stories.tsx</code>.
            </p>
          );
        }
        const Render = Story as ComponentType;
        return (
          <DemoSurface key={storyId} title={title}>
            <Render />
          </DemoSurface>
        );
      })}
    </div>
  );
}
