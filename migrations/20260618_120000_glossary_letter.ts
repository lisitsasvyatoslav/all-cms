import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Поле letter для группировки glossary-terms в админке. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  try {
    await db.run(sql`ALTER TABLE \`glossary_terms\` ADD \`letter\` text;`);
  } catch {
    /* колонка уже есть */
  }

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`glossary_terms_letter_idx\` ON \`glossary_terms\` (\`letter\`);`,
  );
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: откат вручную при необходимости. */
}
