import NextLink from "next/link";

import { portalClass } from "@/lib/portal/core/classes";
import { brandOverviewImagePath } from "@/lib/portal/brand/images/overview";
import type { BrandNavItem } from "@/lib/portal/brand/nav";

type Props = {
  item: BrandNavItem;
};

export function BrandOverviewCard({ item }: Props) {
  if (!item.slug) return null;

  return (
    <NextLink href={item.href} className={portalClass.brandOverviewCardLink}>
      <article className={portalClass.brandOverviewCard}>
        <div className={portalClass.brandOverviewCardVisual}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand overview previews from /public */}
          <img
            src={brandOverviewImagePath(item.slug)}
            alt=""
            className={portalClass.brandOverviewCardImage}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className={portalClass.brandOverviewCardBody}>
          <h3 className={portalClass.brandOverviewCardTitle}>{item.label}</h3>
          <p className={portalClass.brandOverviewCardDescription}>{item.description}</p>
        </div>
      </article>
    </NextLink>
  );
}
