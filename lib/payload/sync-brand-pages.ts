import type { Payload } from "payload";

import type { BrandPage } from "@/payload-types";

import { brandColorDataToPayload } from "@/lib/payload/normalize-brand-color";
import { brandSectionsToPayload } from "@/lib/payload/normalize-brand-page";
import {
  BRAND_COLOR_SEED,
  BRAND_OVERVIEW_SEED,
  BRAND_PAGES_SEED,
  BRAND_PAGE_ORDER,
} from "@/lib/portal/brand/seed-data";

/** Заполняет brand-overview и коллекцию brand-pages (включая данные палитры на странице color). */
export async function syncBrandPages(payload: Payload): Promise<{ pagesUpserted: number }> {
  await payload.updateGlobal({
    slug: "brand-overview",
    data: BRAND_OVERVIEW_SEED,
    overrideAccess: true,
  });

  let pagesUpserted = 0;

  for (const [index, slug] of BRAND_PAGE_ORDER.entries()) {
    const seed = BRAND_PAGES_SEED[slug];
    const data = {
      slug,
      sortOrder: index,
      title: seed.title,
      description: seed.description,
      intro: seed.intro,
      sections: brandSectionsToPayload(seed.sections) as BrandPage["sections"],
      shareTitle: seed.title,
      shareDescription: seed.description,
      ...(slug === "color" ? brandColorDataToPayload(BRAND_COLOR_SEED) : {}),
    };

    const { docs } = await payload.find({
      collection: "brand-pages",
      where: { slug: { equals: slug } },
      depth: 0,
      limit: 1,
      overrideAccess: true,
    });

    if (docs[0]) {
      await payload.update({
        collection: "brand-pages",
        id: docs[0].id,
        data,
        overrideAccess: true,
      });
    } else {
      await payload.create({
        collection: "brand-pages",
        data,
        overrideAccess: true,
      });
    }

    pagesUpserted += 1;
  }

  return { pagesUpserted };
}
