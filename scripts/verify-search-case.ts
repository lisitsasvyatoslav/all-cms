import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import { normalizePortalSearchText } from "../lib/payload/search/normalize-search-text";

async function searchLike(query: string, normalizeQuery = true) {
  const payload = await getPayload({ config });
  const value = normalizeQuery ? normalizePortalSearchText(query) : query;

  const result = await payload.find({
    collection: "search",
    depth: 0,
    limit: 10,
    overrideAccess: true,
    where: {
      searchText: { like: value },
    },
  });

  return result.docs.map((doc) => doc.title);
}

async function main() {
  const lower = await searchLike("установка", false);
  const upper = await searchLike("Установка", false);

  console.log("query=установка:", lower);
  console.log("query=Установка:", upper);

  const ok =
    lower.some((title) => String(title).includes("Установка")) &&
    upper.some((title) => String(title).includes("Установка"));

  if (!ok) {
    console.error("case-insensitive search verification failed");
    process.exit(1);
  }

  console.log("case-insensitive search: ok");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
