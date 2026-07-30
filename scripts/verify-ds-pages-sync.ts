import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import { verifyDsPagesSync } from "../lib/payload/verify-ds-pages-sync";

async function main() {
  const payload = await getPayload({ config });
  const result = await verifyDsPagesSync(payload);

  if (result.ok) {
    console.log(`ds-pages sync OK: ${result.total} published pages match seeds.`);
    return;
  }

  console.error(`ds-pages sync issues: ${result.issues.length} of ${result.total} pages`);
  for (const row of result.issues) {
    console.error(`\n[${row.slug}] ${row.path ?? "no path"}`);
    for (const issue of row.issues) {
      console.error(`  - ${issue}`);
    }
  }
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
