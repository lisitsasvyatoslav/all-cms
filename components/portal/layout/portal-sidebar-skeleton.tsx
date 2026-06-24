import { Box, Flex, Skeleton } from "@radix-ui/themes";

import { portalClass } from "@/lib/portal/core/classes";

export function PortalSidebarSkeleton() {
  return (
    <Flex
      direction="column"
      className="portal-sidebar"
      aria-busy="true"
      aria-label="Загрузка навигации"
    >
      <Box px="4" pt="3" pb="2">
        <Flex gap="2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} height="32px" width="32px" />
          ))}
        </Flex>
      </Box>
      <Box px="4" py="2" className={portalClass.sidebarScroll}>
        <Flex direction="column" gap="3">
          <Skeleton height="16px" width="72px" />
          <Skeleton height="20px" width="100%" />
          <Skeleton height="20px" width="88%" />
          <Skeleton height="16px" width="96px" mt="2" />
          <Skeleton height="20px" width="92%" />
          <Skeleton height="20px" width="80%" />
          <Skeleton height="20px" width="84%" />
        </Flex>
      </Box>
      <Box p="3" className={portalClass.sidebarFooter}>
        <Skeleton height="20px" width="120px" />
      </Box>
    </Flex>
  );
}
