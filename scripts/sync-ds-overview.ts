import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import { syncDsOverview } from "../lib/payload/sync-ds-overview";

async function main() {
  const payload = await getPayload({ config });
  await syncDsOverview(payload);
  console.log("ds-overview global updated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
