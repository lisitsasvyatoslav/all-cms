/**
 * Первичная настройка Turso: миграции + демо-данные (если БД пустая).
 *
 * 1. turso db create next-app-portal
 * 2. turso db show next-app-portal --url
 * 3. turso db tokens create next-app-portal
 * 4. DATABASE_URI и DATABASE_AUTH_TOKEN в .env.local
 * 5. npm run turso:setup
 */
import "./load-env.js";
import { execSync } from "node:child_process";
import { getPayload } from "payload";

import config from "../payload.config";
import {
  isRemoteLibsqlDatabaseUri,
  resolvePayloadDatabaseUri,
} from "../lib/payload/resolve-database-uri";

async function main() {
  const url = resolvePayloadDatabaseUri();

  if (!isRemoteLibsqlDatabaseUri(url)) {
    console.error(
      "turso:setup ожидает удалённую libSQL.\n" +
        "Задайте DATABASE_URI=libsql://… и DATABASE_AUTH_TOKEN в .env.local",
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_AUTH_TOKEN?.trim()) {
    console.error("DATABASE_AUTH_TOKEN не задан.");
    process.exit(1);
  }

  console.log("→ Миграции…");
  execSync("npm run payload:migrate", { stdio: "inherit" });

  const payload = await getPayload({ config });
  const { totalDocs } = await payload.find({
    collection: "users",
    limit: 0,
    overrideAccess: true,
  });

  if (totalDocs > 0) {
    console.log(`Turso OK: в БД уже есть пользователи (${totalDocs}). Seed пропущен.`);
    process.exit(0);
  }

  console.log("→ БД пустая, запуск seed:portal…");
  execSync("npm run seed:portal", { stdio: "inherit" });
  console.log("Turso OK: миграции и seed выполнены.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
