import { Box, Grid, Heading } from "@radix-ui/themes";

import { RelatedComponentCard } from "@/components/portal/catalog/related-component-card";
import { portalClass } from "@/lib/portal/core/classes";
import type { PortalComponentCatalogGroup } from "@/lib/portal/components/group-by-folder";

type Props = {
  groups: PortalComponentCatalogGroup[];
};

export function ComponentsCatalog({ groups }: Props) {
  if (!groups.length) {
    return null;
  }

  return (
    <Box className={portalClass.componentsCatalog}>
      {groups.map((group) => (
        <section
          key={group.id}
          id={group.id}
          aria-labelledby={`${group.id}-heading`}
          className={portalClass.componentsCatalogSection}
        >
          <Heading
            as="h2"
            size="6"
            weight="bold"
            mb="4"
            id={`${group.id}-heading`}
            className={portalClass.componentsCatalogSectionTitle}
          >
            {group.name}
          </Heading>
          <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="5">
            {group.items.map((item) => (
              <RelatedComponentCard key={item.slug} {...item} />
            ))}
          </Grid>
        </section>
      ))}
    </Box>
  );
}
