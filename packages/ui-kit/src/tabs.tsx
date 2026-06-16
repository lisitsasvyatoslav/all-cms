import { Tabs as RadixTabs } from "@radix-ui/themes";
import type { ComponentProps } from "react";

import { WithoutRadixLayout } from "./without-radix-layout";

type TabsRootRadixProps = WithoutRadixLayout<ComponentProps<typeof RadixTabs.Root>>;

/** Пропсы Tabs.Root — корневой контейнер вкладок. */
export interface TabsRootProps extends Pick<
  TabsRootRadixProps,
  "asChild" | "className" | "defaultValue" | "title" | "value"
> {
  /** Рендерит дочерний элемент вместо корня. */
  asChild?: TabsRootRadixProps["asChild"];
  /** Дополнительные CSS-классы. */
  className?: TabsRootRadixProps["className"];
  /** value вкладки по умолчанию (неконтролируемый режим). */
  defaultValue?: TabsRootRadixProps["defaultValue"];
  /** Всплывающая подсказка (HTML title). */
  title?: TabsRootRadixProps["title"];
  /** value активной вкладки (контролируемый режим). */
  value?: TabsRootRadixProps["value"];
}

export type TabsListProps = WithoutRadixLayout<ComponentProps<typeof RadixTabs.List>>;
export type TabsTriggerProps = WithoutRadixLayout<ComponentProps<typeof RadixTabs.Trigger>>;
export type TabsContentProps = WithoutRadixLayout<ComponentProps<typeof RadixTabs.Content>>;

export const Tabs = {
  Root: RadixTabs.Root,
  List: RadixTabs.List,
  Trigger: RadixTabs.Trigger,
  Content: RadixTabs.Content,
};
