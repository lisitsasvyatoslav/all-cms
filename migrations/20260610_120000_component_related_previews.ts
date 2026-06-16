import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Превью Related Components на записи components (upload → media). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const stmt of [
    sql`ALTER TABLE \`components\` ADD \`related_preview_light_id\` integer REFERENCES media(id);`,
    sql`ALTER TABLE \`components\` ADD \`related_preview_dark_id\` integer REFERENCES media(id);`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* колонка уже добавлена push-режимом или повторным прогоном */
    }
  }

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`components_related_preview_light_idx\` ON \`components\` (\`related_preview_light_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`components_related_preview_dark_idx\` ON \`components\` (\`related_preview_dark_id\`);`,
  );
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: DROP COLUMN не используем — откат вручную при необходимости. */
}
