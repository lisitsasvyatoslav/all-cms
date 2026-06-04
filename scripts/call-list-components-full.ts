/**
 * Локальный вызов логики listComponentsFull (тот же JSON, что MCP tool).
 * Запуск: npx tsx scripts/call-list-components-full.ts
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";

import config from "../payload.config";
import { filterDocumentationForLlm } from "../lib/mcp/filter-documentation-for-llm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env.local"), override: true });

const payload = await getPayload({ config });

const result = await payload.find({
  collection: "components",
  limit: 50,
  page: 1,
  depth: 1,
  overrideAccess: true,
});

const docs = result.docs.map((doc) => filterDocumentationForLlm(doc));

console.log(
  JSON.stringify(
    {
      totalDocs: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      docs,
    },
    null,
    2,
  ),
);

process.exit(0);
