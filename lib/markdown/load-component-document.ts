import { getPayload } from "payload";

import config from "@payload-config";
import type { Component } from "@/payload-types";

export async function loadComponentDocument(
  componentSlug: string,
): Promise<Component | null> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "components",
    where: { slug: { equals: componentSlug } },
    limit: 1,
    depth: 2,
  });
  return docs[0] ?? null;
}
