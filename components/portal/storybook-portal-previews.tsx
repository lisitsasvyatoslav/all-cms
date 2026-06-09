"use client";

import { Card, Callout, Flex, Text } from "@radix-ui/themes";
import { composeStories } from "@storybook/react";
import { useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";

import { portalClass } from "@/lib/portal/classes";
import { PORTAL_STORYBOOK_REGISTRY } from "@/lib/storybook/portal-registry";

function DemoSurface({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card size="2" variant="surface">
      <Text
        size="1"
        weight="medium"
        color="gray"
        mb="4"
        className={portalClass.demoTitle}
      >
        {title}
      </Text>
      {children}
    </Card>
  );
}

/** Превью по slug — stories подгружаются динамически (меньше work при первом compile в dev). */
export function StorybookPortalPreviews({ slug }: { slug: string }) {
  const entry = PORTAL_STORYBOOK_REGISTRY[slug];
  const [composed, setComposed] = useState<ReturnType<typeof composeStories> | null>(null);

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
      <Text size="2" color="gray" aria-busy="true">
        Загрузка превью…
      </Text>
    );
  }

  const { catalog } = entry;

  return (
    <Flex direction="column" gap="6">
      {catalog.map(({ storyId, title }) => {
        const Story = composed[storyId as keyof typeof composed];
        if (!Story) {
          return (
            <Callout.Root key={storyId} color="amber">
              <Callout.Text>
                Story «{storyId}» не найдена в{" "}
                <Text as="span" className={portalClass.codeFont}>
                  *.stories.tsx
                </Text>
                .
              </Callout.Text>
            </Callout.Root>
          );
        }
        const Render = Story as ComponentType;
        return (
          <DemoSurface key={storyId} title={title}>
            <Render />
          </DemoSurface>
        );
      })}
    </Flex>
  );
}
