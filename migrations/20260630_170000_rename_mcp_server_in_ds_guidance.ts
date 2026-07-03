import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`UPDATE \`ds_overview\`
    SET \`principles_intro\` = replace(
      \`principles_intro\`,
      'design-system-portal',
      'finam-design-system'
    )
    WHERE \`principles_intro\` LIKE '%design-system-portal%';`);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Keep CMS-authored copy unchanged on rollback.
}
