import { Code, Link, Text } from "@radix-ui/themes";

import {
  storybookStoryPath,
  storybookStoryUrl,
} from "@/lib/storybook/portal-preview-config";

export function StorybookOpenLink({
  componentSlug,
  storyId = "Default",
}: {
  componentSlug: string;
  storyId?: string;
}) {
  const base = process.env.NEXT_PUBLIC_STORYBOOK_URL?.trim();
  if (!base) return null;

  const href = storybookStoryUrl(base, componentSlug, storyId);
  const path = storybookStoryPath(componentSlug, storyId);

  return (
    <Text as="p" size="1" color="gray" mt="4">
      Превью синхронизировано со Storybook (
      <Link href={href} target="_blank" rel="noopener noreferrer" size="1" weight="medium">
        открыть story
      </Link>
      , путь <Code size="1" variant="ghost">{path}</Code>
      ).
    </Text>
  );
}
