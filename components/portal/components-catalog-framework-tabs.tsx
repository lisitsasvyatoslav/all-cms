"use client";

import { Flex, Tabs, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

import { portalClass } from "@/lib/portal/classes";
import {
  PORTAL_COMPONENT_FRAMEWORKS,
  type PortalComponentFrameworkId,
} from "@/lib/portal/component-frameworks";

type Props = {
  activeFrameworkId: PortalComponentFrameworkId;
};

export function ComponentsCatalogFrameworkTabs({ activeFrameworkId }: Props) {
  const router = useRouter();

  return (
    <Tabs.Root
      value={activeFrameworkId}
      onValueChange={(value) => {
        const framework = PORTAL_COMPONENT_FRAMEWORKS.find((item) => item.id === value);
        if (framework?.enabled) {
          router.push(framework.href);
        }
      }}
      className={portalClass.componentsCatalogFrameworkTabs}
    >
      <Tabs.List aria-label="Платформы компонентов">
        {PORTAL_COMPONENT_FRAMEWORKS.map((framework) => (
          <Tabs.Trigger
            key={framework.id}
            value={framework.id}
            disabled={!framework.enabled}
            title={framework.enabled ? undefined : "Скоро"}
          >
            <Flex align="center" gap="2" as="span">
              <img
                src={framework.iconSrc}
                alt=""
                className={portalClass.componentsCatalogFrameworkTabIcon}
                width={16}
                height={16}
                draggable={false}
              />
              <Text as="span" size="2">
                {framework.label}
              </Text>
            </Flex>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
