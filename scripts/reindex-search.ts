import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import { PORTAL_SEARCH_COLLECTIONS } from "../lib/payload/search/build-search-record";

async function touchDoc(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: (typeof PORTAL_SEARCH_COLLECTIONS)[number],
  id: number,
  data: Record<string, unknown>,
): Promise<void> {
  await payload.update({
    collection,
    id,
    data,
    overrideAccess: true,
    draft: collection === "ds-pages" ? false : undefined,
    context: { skipPortalRevalidate: true },
  });
}

async function main() {
  const payload = await getPayload({ config });

  for (const collection of PORTAL_SEARCH_COLLECTIONS) {
    const { docs } = await payload.find({
      collection,
      depth: 0,
      limit: 500,
      overrideAccess: true,
      ...(collection === "ds-pages"
        ? {
            draft: false,
            where: { _status: { equals: "published" } },
          }
        : {}),
    });

    let synced = 0;
    for (const doc of docs) {
      if (typeof doc.id !== "number") continue;

      const data: Record<string, unknown> = {};
      if (collection === "components" || collection === "colors") {
        data.name = (doc as { name?: string }).name;
      } else if (collection === "glossary-terms") {
        data.preferred = (doc as { preferred?: string }).preferred;
      } else {
        data.title = (doc as { title?: string }).title;
      }

      await touchDoc(payload, collection, doc.id, data);
      synced += 1;
    }

    console.log(`search reindex: ${collection} — ${synced} docs`);
  }

  console.log("search reindex: done.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
