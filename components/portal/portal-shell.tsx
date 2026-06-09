import { Box, Container, Flex, Grid, Separator } from "@radix-ui/themes";
import type { ReactNode } from "react";

import { portalClass } from "@/lib/portal/classes";

export function PortalAppShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <Flex minHeight="100vh" width="100%">
      {sidebar}
      <Box flexGrow="1" minWidth="0">
        {children}
      </Box>
    </Flex>
  );
}

export function PortalPageContainer({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Container
      size="4"
      px="6"
      py="6"
      className={wide ? portalClass.pageWide : portalClass.page}
    >
      {children}
    </Container>
  );
}

export function PortalPageWithToc({
  main,
  toc,
}: {
  main: ReactNode;
  toc: ReactNode;
}) {
  return (
    <Grid columns={{ initial: "1", lg: "1fr 11rem" }} gap="6">
      <Box minWidth="0">{main}</Box>
      <Box minWidth="0" className="portal-toc-aside">
        {toc}
      </Box>
    </Grid>
  );
}

export function PortalSection({
  children,
  id,
}: {
  children: ReactNode;
  id?: string;
}) {
  return (
    <Box mb="6" id={id}>
      {children}
    </Box>
  );
}

export function PortalHeaderDivider() {
  return <Separator size="4" mt="4" mb="5" />;
}
