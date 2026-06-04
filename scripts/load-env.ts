/**
 * Загрузить .env до импорта payload.config (ESM выполняет import раньше тела модуля).
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env.local"), override: true });
