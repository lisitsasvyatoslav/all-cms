import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Колонка design_checklist_items в payload_locked_documents_rels. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  try {
    await db.run(
      sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`design_checklist_items_id\` integer REFERENCES design_checklist_items(id);`,
    );
  } catch {
    /* колонка уже есть */
  }

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_design_checklist_items_id_idx\` ON \`payload_locked_documents_rels\` (\`design_checklist_items_id\`);`,
  );
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: откат вручную при необходимости. */
}
