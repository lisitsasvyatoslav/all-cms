import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

import { DS_OVERVIEW_PAGE_SEED } from "../lib/portal/components/ds-overview-seed";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const seed = DS_OVERVIEW_PAGE_SEED;

  await db.run(sql`UPDATE \`ds_overview\` SET
    \`installation_heading\` = ${seed.installationHeading},
    \`installation_intro\` = ${seed.installationIntro},
    \`package_name\` = ${seed.packageName},
    \`package_version\` = ${seed.packageVersion},
    \`setup_code\` = ${seed.setupCode},
    \`principles_heading\` = ${seed.principlesHeading},
    \`principles_intro\` = ${seed.principlesIntro}
  WHERE \`id\` = (SELECT \`id\` FROM \`ds_overview\` LIMIT 1);`);

  await db.run(sql`DELETE FROM \`ds_overview_install_commands\`;`);
  for (const [index, item] of seed.installCommands.entries()) {
    await db.run(sql`INSERT INTO \`ds_overview_install_commands\`
      (\`_order\`, \`_parent_id\`, \`id\`, \`command\`)
      SELECT ${index}, \`id\`, ${`install-${index + 1}`}, ${item.command}
      FROM \`ds_overview\` LIMIT 1;`);
  }

  await db.run(sql`DELETE FROM \`ds_overview_principles\`;`);
  for (const [index, principle] of seed.principles.entries()) {
    await db.run(sql`INSERT INTO \`ds_overview_principles\`
      (\`_order\`, \`_parent_id\`, \`id\`, \`title\`, \`description\`, \`agent_rule\`)
      SELECT ${index}, \`id\`, ${`principle-${index + 1}`}, ${principle.title},
        ${principle.description}, ${principle.agentRule}
      FROM \`ds_overview\` LIMIT 1;`);
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Preserve CMS-authored content on rollback.
}
