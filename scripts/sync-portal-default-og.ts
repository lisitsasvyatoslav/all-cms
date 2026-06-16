/**
 * Генерирует public/og/portal-site.webp — нейтральная OG для главной и каталога.
 * Запуск: npm run generate:portal-site-og
 */
import "./load-env.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { generatePortalSiteOgImage } from "../lib/portal/portal-default-og.js";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  await generatePortalSiteOgImage(projectRoot);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
