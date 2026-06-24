import { cache } from "react";
import { unstable_cache } from "next/cache";

import type { Color } from "@/payload-types";

import { getCachedPayload } from "@/lib/payload/get-cached-payload";
import { PORTAL_CACHE_REVALIDATE_SECONDS } from "@/lib/portal/cache/tags";

async function fetchColorById(id: number): Promise<Color | null> {
  try {
    const payload = await getCachedPayload();
    return await payload.findByID({
      collection: "colors",
      id,
      depth: 2,
    });
  } catch {
    return null;
  }
}

const getCachedColorById = unstable_cache(fetchColorById, ["portal-color"], {
  revalidate: PORTAL_CACHE_REVALIDATE_SECONDS,
  tags: ["portal:colors"],
});

export const loadColorById = cache(async (id: number): Promise<Color | null> => {
  return getCachedColorById(id);
});
