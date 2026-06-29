/**
 * Загрузить .env до импорта payload.config (ESM выполняет import раньше тела модуля).
 *
 * Скрипты `:local` задают DATABASE_URI= и DATABASE_AUTH_TOKEN= через cross-env —
 * не перезаписываем их из .env.local (иначе sync/migrate попадут в Turso).
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

/** cross-env DATABASE_URI= DATABASE_AUTH_TOKEN= → локальный file:./payload.sqlite */
function isForcedLocalPayloadDb(): boolean {
  return (
    process.env.USE_LOCAL_PAYLOAD_DB === "1" ||
    (process.env.DATABASE_URI === "" && process.env.DATABASE_AUTH_TOKEN === "")
  );
}

const forceLocalSqlite = isForcedLocalPayloadDb();

dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({
  path: path.join(projectRoot, ".env.local"),
  override: !forceLocalSqlite,
});

if (forceLocalSqlite) {
  delete process.env.DATABASE_URI;
  delete process.env.DATABASE_AUTH_TOKEN;
}

