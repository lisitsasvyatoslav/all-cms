import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import {
  buildPortalSearchIndexText,
  portalSearchMatchScopeLabel,
} from "../lib/payload/search/search-config";

async function main() {
  const payload = await getPayload({ config });
  const { docs, totalDocs } = await payload.find({
    collection: "search",
    depth: 0,
    limit: 500,
    overrideAccess: true,
  });

  let updated = 0;
  for (const doc of docs) {
    if (typeof doc.id !== "number") continue;

    const title = typeof doc.title === "string" ? doc.title.trim() : "";
    const excerpt = typeof doc.excerpt === "string" ? doc.excerpt.trim() : "";
    const searchText = buildPortalSearchIndexText(title, excerpt);

    if (doc.searchText === searchText) continue;

    await payload.update({
      collection: "search",
      id: doc.id,
      data: { searchText },
      overrideAccess: true,
      context: { skipPortalRevalidate: true },
    });
    updated += 1;

    if (updated % 20 === 0) {
      console.log(`searchText backfill: ${updated} records updated…`);
    }
  }

  console.log(
    `searchText backfill (${portalSearchMatchScopeLabel()}): ${updated}/${totalDocs} records updated`,
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
