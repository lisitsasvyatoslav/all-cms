/**
 * Заполняет global text-glossary и термины glossary-terms.
 * Запуск: npm run sync:text-glossary
 */
import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import { syncTextGlossary } from "../lib/payload/sync-text-glossary";

async function main() {
  const payload = await getPayload({ config });
  const { termsCreated } = await syncTextGlossary(payload);
  console.log(`Global text-glossary обновлён. Создано ${termsCreated} терминов glossary-terms.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
