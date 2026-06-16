/**
 * Загружает public/related-previews/*.webp в Payload Media и привязывает к components.
 *
 * Запуск: npm run upload:related-previews
 * Требует PAYLOAD_SECRET в .env / .env.local
 */
import "./load-env.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getPayload } from "payload";

import config from "../payload.config.js";
import { syncRelatedPreviewsForSlugs } from "../lib/payload/sync-related-preview-media.js";
import { relatedPreviewSlugsFromCatalog } from "../lib/storybook/related-preview-capture.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

async function main() {
  const payload = await getPayload({ config });
  const slugs = relatedPreviewSlugsFromCatalog();

  console.log(`Uploading ${slugs.length} components to Payload Media…`);
  await syncRelatedPreviewsForSlugs(payload, projectRoot, slugs);
  console.log("Upload complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
