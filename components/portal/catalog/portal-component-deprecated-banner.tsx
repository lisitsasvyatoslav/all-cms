import { Callout, Link, Text } from "@radix-ui/themes";
import NextLink from "next/link";
import { componentWebPagePath } from "@/lib/portal/components/routes";

import type { Component } from "@/payload-types";
import {
  getDeprecatedBannerMessage,
  isComponentDeprecated,
  resolveReplacedByComponent,
} from "@/lib/portal/components/status";
import { portalClass } from "@/lib/portal/core/classes";

import { PortalCalloutContent } from "@/components/portal/documentation/portal-callout-content";

type Props = Pick<Component, "status" | "statusNote" | "replacedBy">;

export function PortalComponentDeprecatedBanner({ doc }: { doc: Props }) {
  if (!isComponentDeprecated(doc.status)) return null;

  const replacement = resolveReplacedByComponent(doc.replacedBy);
  const message = getDeprecatedBannerMessage(doc.statusNote);

  return (
    <Callout.Root
      color="red"
      variant="soft"
      role="status"
      className={portalClass.statusBanner}
    >
      <Callout.Icon>!</Callout.Icon>
      <PortalCalloutContent>
        <Text as="p" size="3" weight="bold" mb="1">
          Deprecated
        </Text>
        <Text as="p" size="2">
          {message}
        </Text>
        {replacement ? (
          <Text as="p" size="2" mt="2">
            Используйте{" "}
            <Link asChild weight="medium">
              <NextLink href={componentWebPagePath(replacement.slug)}>{replacement.name}</NextLink>
            </Link>
            .
          </Text>
        ) : null}
      </PortalCalloutContent>
    </Callout.Root>
  );
}
