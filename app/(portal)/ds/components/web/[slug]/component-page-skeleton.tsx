import { Box, Flex, Skeleton } from "@radix-ui/themes";

import { PortalPageContainer } from "@/components/portal/layout/portal-shell";

export function ComponentPageSkeleton() {
  return (
    <PortalPageContainer wide>
      <Flex direction="column" gap="4" aria-busy="true" aria-label="Загрузка страницы компонента">
        <Skeleton height="20px" width="240px" />
        <Skeleton height="40px" width="min(320px, 80%)" />
        <Skeleton height="64px" />
        <Box mt="4">
          <Skeleton height="280px" />
        </Box>
        <Skeleton height="200px" />
      </Flex>
    </PortalPageContainer>
  );
}
