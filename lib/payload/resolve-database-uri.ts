import fs from "node:fs";
import path from "node:path";

import type { Config } from "@libsql/client";

const LOCAL_DATABASE_URI = "file:./payload.sqlite";
const VERCEL_DATABASE_PATH = "/tmp/payload.sqlite";
const SEED_DATABASE_RELATIVE_PATH = path.join("data", "payload.seed.sqlite");

export function isRemoteLibsqlDatabaseUri(url: string): boolean {
  return url.startsWith("libsql://") || url.startsWith("https://") || url.startsWith("http://");
}

/** Копирует закоммиченный seed в /tmp на Vercel (FS read-only, кроме /tmp). */
function ensureVercelSqliteFromSeed(): string {
  const seedPath = path.join(process.cwd(), SEED_DATABASE_RELATIVE_PATH);
  const tmpPath = VERCEL_DATABASE_PATH;

  if (!fs.existsSync(tmpPath) && fs.existsSync(seedPath)) {
    fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
    fs.copyFileSync(seedPath, tmpPath);
  }

  if (!fs.existsSync(tmpPath)) {
    throw new Error(
      `Vercel: нет БД в ${tmpPath} и нет seed ${seedPath}. ` +
        "Закоммитьте data/payload.seed.sqlite или задайте DATABASE_URI + DATABASE_AUTH_TOKEN (Turso).",
    );
  }

  return `file:${tmpPath}`;
}

/**
 * URI SQLite для Payload.
 * - DATABASE_URI из env — как есть (Turso libsql://, file:…)
 * - Vercel без DATABASE_URI — копия data/payload.seed.sqlite → /tmp/payload.sqlite (не персистентно)
 * - локально — file:./payload.sqlite
 */
export function resolvePayloadDatabaseUri(): string {
  const fromEnv = process.env.DATABASE_URI?.trim();
  if (fromEnv) return fromEnv;

  if (process.env.VERCEL) {
    return ensureVercelSqliteFromSeed();
  }

  return LOCAL_DATABASE_URI;
}

/**
 * Конфиг @libsql/client для sqliteAdapter.
 * Turso: DATABASE_URI=libsql://… + DATABASE_AUTH_TOKEN=…
 */
export function resolvePayloadSqliteClientConfig(): Config {
  const url = resolvePayloadDatabaseUri();
  const authToken = process.env.DATABASE_AUTH_TOKEN?.trim();

  if (isRemoteLibsqlDatabaseUri(url) && !authToken) {
    throw new Error(
      "DATABASE_AUTH_TOKEN обязателен для удалённой libSQL (Turso). " +
        "Создайте токен: turso db tokens create <имя-бд>",
    );
  }

  if (authToken) {
    return { url, authToken };
  }

  return { url };
}
