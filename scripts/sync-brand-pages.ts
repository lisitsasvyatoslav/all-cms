import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config.js";
import { syncBrandPages } from "../lib/payload/sync-brand-pages.js";

const payload = await getPayload({ config });
const result = await syncBrandPages(payload);
console.log(`Brand: upserted ${result.pagesUpserted} pages and overview global.`);
