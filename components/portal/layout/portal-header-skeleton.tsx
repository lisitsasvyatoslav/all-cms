import { Flex, Skeleton } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/core/classes";

export function PortalHeaderSkeleton() {
  return (
    <header className={portalClass.header} aria-busy="true" aria-label="Загрузка шапки">
      <Flex align="center" justify="between" width="100%" px="4" py="3" gap="4">
        <Skeleton height="24px" width="160px" />
        <Flex gap="3" display={{ initial: "none", sm: "flex" }}>
          <Skeleton height="32px" width="56px" />
          <Skeleton height="32px" width="56px" />
          <Skeleton height="32px" width="56px" />
        </Flex>
        <Flex gap="2">
          <Skeleton height="32px" width="32px" />
          <Skeleton height="32px" width="32px" />
          <Skeleton height="32px" width="32px" />
        </Flex>
      </Flex>
    </header>
  );
}
