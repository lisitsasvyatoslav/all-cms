import fs from "node:fs";
import path from "node:path";

const LOCAL_DATABASE_URI = "file:./payload.sqlite";
const VERCEL_DATABASE_PATH = "/tmp/payload.sqlite";
const SEED_DATABASE_RELATIVE_PATH = path.join("data", "payload.seed.sqlite");

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
        "Закоммитьте data/payload.seed.sqlite или задайте DATABASE_URI (Turso/Postgres).",
    );
  }

  return `file:${tmpPath}`;
}

/**
 * URI SQLite для Payload.
 * - DATABASE_URI из env — как есть (Turso libsql://, file:…)
 * - Vercel без DATABASE_URI — копия data/payload.seed.sqlite → /tmp/payload.sqlite
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
