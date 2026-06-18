import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Удаляет sort_order из glossary_terms — порядок только по алфавиту. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  try {
    await db.run(sql`ALTER TABLE \`glossary_terms\` DROP COLUMN \`sort_order\`;`);
  } catch {
    /* колонка уже удалена или SQLite без DROP COLUMN */
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: откат вручную при необходимости. */
}
