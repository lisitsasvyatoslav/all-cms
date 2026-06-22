import { Box, Code, Heading, Text } from "@radix-ui/themes";

import { PortalPropsTable } from "@/components/portal/documentation/portal-props-table";
import { PortalSection } from "@/components/portal/layout/portal-shell";
import { portalClass } from "@/lib/portal/core/classes";
import {
  getUiKitExportName,
  getUiKitPropsForSlug,
  UI_KIT_PACKAGE_NAME,
} from "@/lib/ui-kit/props-from-manifest";

type Props = {
  slug: string;
};

/** Таблица пропсов из @next-app/ui-kit/props-manifest.json (имитация внешнего пакета). */
export function ComponentApiFromUiKit({ slug }: Props) {
  const rows = getUiKitPropsForSlug(slug);
  if (!rows.length) return null;

  const exportName = getUiKitExportName(slug);

  return (
    <PortalSection>
      <Heading as="h2" size="4" mb="2" id="props-reference" className={portalClass.scrollTarget}>
        API Reference
      </Heading>
      {exportName ? (
        <Heading as="h3" size="3" mb="2" weight="medium">
          {exportName} Props
        </Heading>
      ) : null}
      <Text as="p" size="2" color="gray" mb="4">
        Источник:{" "}
        <Code size="1" variant="soft">
          {UI_KIT_PACKAGE_NAME}/props-manifest.json
        </Code>
      </Text>
      <PortalPropsTable rows={rows} />
    </PortalSection>
  );
}
