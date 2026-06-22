import { Flex, Text } from "@radix-ui/themes";

import type { Component } from "@/payload-types";
import { portalClass } from "@/lib/portal/core/classes";

import { PortalComponentStatusBadge } from "./portal-component-status-badge";

export function PortalComponentTitle({
  name,
  status,
  weight = "medium",
  size = "2",
}: {
  name: string;
  status?: Component["status"] | null;
  weight?: "medium" | "bold";
  size?: "2" | "3" | "4";
}) {
  return (
    <Flex align="center" gap="2" wrap="wrap" className={portalClass.componentTitle}>
      <Text size={size} weight={weight}>
        {name}
      </Text>
      <PortalComponentStatusBadge status={status} />
    </Flex>
  );
}
