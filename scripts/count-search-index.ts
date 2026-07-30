import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";

async function main() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "search",
    limit: 1,
    overrideAccess: true,
  });
  console.log(`search index: ${result.totalDocs} documents`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
