/**
 * Подставляет все активные пункты design checklist во все компоненты.
 * Запуск: npm run sync:design-checklist
 */
import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import { syncDesignChecklistOnAllComponents } from "../lib/payload/sync-component-design-checklist";

async function main() {
  if (!process.env.PAYLOAD_SECRET?.trim()) {
    console.error("Нужен PAYLOAD_SECRET в .env / .env.local");
    process.exit(1);
  }

  const payload = await getPayload({ config });
  const count = await syncDesignChecklistOnAllComponents(payload);
  console.log(`Design checklist синхронизирован для ${count} компонент(ов).`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
