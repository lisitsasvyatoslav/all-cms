import { Box, Flex, Heading, Text } from "@radix-ui/themes";
import type { Metadata } from "next";

import { AuthShowModalWindow } from "@/components/compose/figma-to-code/auth-show-modal-window";
import { AuthStartPoint } from "@/components/compose/figma-to-code/auth-start-point";
import { LoginModalForm } from "@/components/compose/figma-to-code/login-modal-form";
import { FigmaComposeSetupActions } from "@/components/portal/page-actions/figma-compose-setup-actions";
import { PortalPageContainer, PortalSection } from "@/components/portal/layout/portal-shell";
import { PORTAL_PAGE_REVALIDATE_SECONDS } from "@/lib/portal/cache/page-revalidate";
import { PORTAL_SHOWCASE_FIGMA_TO_CODE_PATH } from "@/lib/portal/components/routes";
import { portalClass } from "@/lib/portal/core/classes";

export const revalidate = PORTAL_PAGE_REVALIDATE_SECONDS;

export const metadata: Metadata = {
  title: "Figma-to-Code — Ai Test flow",
  description:
    "Демо экранов из макета Figma, собранных через compose workflow (@radix-ui/themes).",
  alternates: {
    canonical: PORTAL_SHOWCASE_FIGMA_TO_CODE_PATH,
  },
};

export default function FigmaToCodeShowcasePage() {
  return (
    <PortalPageContainer>
      <PortalSection>
        <Heading size="6" mb="2">
          Figma-to-Code — Ai Test flow
        </Heading>
        <Text size="2" color="gray" mb="4" as="p">
          Собрано через design-system-portal из макета Figma (@radix-ui/themes).
        </Text>

        <FigmaComposeSetupActions />

        <Flex direction="column" gap="8" mt="6">
          <Box>
            <Heading size="4" mb="3">
              Start point
            </Heading>
            <Box className={portalClass.embedPreview} p="6">
              <AuthStartPoint />
            </Box>
          </Box>

          <Box>
            <Heading size="4" mb="3">
              Modal form
            </Heading>
            <Box className={portalClass.embedPreview} p="6">
              <LoginModalForm />
            </Box>
          </Box>

          <Box>
            <Heading size="4" mb="3">
              Show modal window
            </Heading>
            <Box
              className={portalClass.embedPreview}
              p="6"
              style={{ position: "relative", minHeight: 640 }}
            >
              <AuthShowModalWindow />
            </Box>
          </Box>
        </Flex>
      </PortalSection>
    </PortalPageContainer>
  );
}
