import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import { syncDsPages } from "../lib/payload/sync-ds-pages";

async function main() {
  const payload = await getPayload({ config });
  await syncDsPages(payload);
  console.log("ds-pages: overview tree with nested pages synced.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
