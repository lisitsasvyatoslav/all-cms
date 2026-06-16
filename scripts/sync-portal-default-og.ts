/**
 * Копирует related-previews/*-light.webp → public/og/portal-default.webp
 * Запуск: npm run sync:portal-default-og
 */
import "./load-env.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { syncPortalDefaultOgImage } from "../lib/portal/portal-default-og.js";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const ok = await syncPortalDefaultOgImage(projectRoot);
  process.exit(ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
