import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

import { LAYOUT_GUIDE_MARKDOWN } from "../lib/portal/components/layout-guide-seed";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`ds_overview\` ADD \`usage_guide_markdown\` text;`);
  await db.run(sql`UPDATE \`ds_overview\`
    SET \`usage_guide_markdown\` = ${LAYOUT_GUIDE_MARKDOWN}
    WHERE \`id\` = (SELECT \`id\` FROM \`ds_overview\` LIMIT 1);`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`ds_overview\` DROP COLUMN \`usage_guide_markdown\`;`);
}
