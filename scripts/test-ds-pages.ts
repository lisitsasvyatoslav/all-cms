import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import { loadDsPageBySegments } from "../lib/portal/ds-pages/load-pages";

async function main() {
  const payload = await getPayload({ config });
  const { docs, totalDocs } = await payload.find({
    collection: "ds-pages",
    depth: 1,
    limit: 10,
    overrideAccess: true,
  });

  console.log("ds-pages count:", totalDocs);
  for (const doc of docs) {
    console.log("-", doc.slug, doc.title, doc._status, doc.breadcrumbs);
  }

  const page = await loadDsPageBySegments(["introduction"]);
  console.log("loadDsPageBySegments(['introduction']):", page?.title ?? "NOT FOUND", page?.path);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
