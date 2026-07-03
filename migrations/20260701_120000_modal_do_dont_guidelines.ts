import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

import { MODAL_DO_DONT_SEED } from "../lib/portal/components/modal-do-dont-seed";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`UPDATE \`components_blocks_do_dont\`
    SET \`heading\` = ${MODAL_DO_DONT_SEED.heading}, \`show_l_l_m\` = 1
    WHERE \`_parent_id\` = (SELECT \`id\` FROM \`components\` WHERE \`slug\` = 'modal' LIMIT 1)
      AND \`_path\` = 'documentation';`);

  await db.run(sql`DELETE FROM \`components_blocks_do_dont_dos\`
    WHERE \`_parent_id\` = (
      SELECT \`id\` FROM \`components_blocks_do_dont\`
      WHERE \`_parent_id\` = (SELECT \`id\` FROM \`components\` WHERE \`slug\` = 'modal' LIMIT 1)
        AND \`_path\` = 'documentation' LIMIT 1
    );`);
  await db.run(sql`DELETE FROM \`components_blocks_do_dont_donts\`
    WHERE \`_parent_id\` = (
      SELECT \`id\` FROM \`components_blocks_do_dont\`
      WHERE \`_parent_id\` = (SELECT \`id\` FROM \`components\` WHERE \`slug\` = 'modal' LIMIT 1)
        AND \`_path\` = 'documentation' LIMIT 1
    );`);

  for (const [index, item] of MODAL_DO_DONT_SEED.dos.entries()) {
    await db.run(sql`INSERT INTO \`components_blocks_do_dont_dos\`
      (\`_order\`, \`_parent_id\`, \`id\`, \`text\`)
      SELECT ${index}, \`id\`, ${`modal-do-${index + 1}`}, ${item.text}
      FROM \`components_blocks_do_dont\`
      WHERE \`_parent_id\` = (SELECT \`id\` FROM \`components\` WHERE \`slug\` = 'modal' LIMIT 1)
        AND \`_path\` = 'documentation' LIMIT 1;`);
  }
  for (const [index, item] of MODAL_DO_DONT_SEED.donts.entries()) {
    await db.run(sql`INSERT INTO \`components_blocks_do_dont_donts\`
      (\`_order\`, \`_parent_id\`, \`id\`, \`text\`)
      SELECT ${index}, \`id\`, ${`modal-dont-${index + 1}`}, ${item.text}
      FROM \`components_blocks_do_dont\`
      WHERE \`_parent_id\` = (SELECT \`id\` FROM \`components\` WHERE \`slug\` = 'modal' LIMIT 1)
        AND \`_path\` = 'documentation' LIMIT 1;`);
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Preserve CMS-authored documentation on rollback.
}
