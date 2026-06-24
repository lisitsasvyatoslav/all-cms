import { Box, Flex, Skeleton } from "@radix-ui/themes";

import { PortalPageContainer } from "@/components/portal/layout/portal-shell";

export function PortalMainLoadingSkeleton() {
  return (
    <PortalPageContainer>
      <Flex direction="column" gap="4" aria-busy="true" aria-label="Загрузка страницы">
        <Skeleton height="20px" width="200px" />
        <Skeleton height="40px" width="min(360px, 70%)" />
        <Skeleton height="56px" />
        <Box mt="2">
          <Skeleton height="240px" />
        </Box>
      </Flex>
    </PortalPageContainer>
  );
}
