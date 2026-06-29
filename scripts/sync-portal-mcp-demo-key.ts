/**
 * Создаёт или обновляет демо MCP API key для локального Cursor.
 * Запуск: npm run sync:mcp-demo-key
 */
import "./load-env.js";

import { getPayload } from "payload";

import config from "../payload.config";
import { syncPortalMcpDemoKey } from "../lib/payload/sync-portal-mcp-demo-key";

async function main() {
  const payload = await getPayload({ config });
  const result = await syncPortalMcpDemoKey(payload);
  console.log(`MCP demo key ${result.action} (id=${result.id}).`);
  console.log(`Use in mcp.json Authorization: Bearer ${result.apiKey}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
