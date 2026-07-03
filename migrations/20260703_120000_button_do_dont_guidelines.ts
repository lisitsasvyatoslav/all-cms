import { MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

import {
  BUTTON_DO_DONT_BLOCK_ID,
  BUTTON_DO_DONT_SEED,
} from "../lib/portal/components/button-do-dont-seed";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`INSERT OR IGNORE INTO \`components_blocks_do_dont\`
    (\`_order\`, \`_parent_id\`, \`_path\`, \`id\`, \`show_l_l_m\`, \`heading\`)
    SELECT
      COALESCE((SELECT MAX(\`_order\`) + 1 FROM \`components_blocks_do_dont\`
        WHERE \`_parent_id\` = \`components\`.\`id\` AND \`_path\` = 'documentation'), 0),
      \`id\`, 'documentation', ${BUTTON_DO_DONT_BLOCK_ID}, 1, ${BUTTON_DO_DONT_SEED.heading}
    FROM \`components\` WHERE \`slug\` = 'button' LIMIT 1;`);

  await db.run(sql`UPDATE \`components_blocks_do_dont\`
    SET \`heading\` = ${BUTTON_DO_DONT_SEED.heading}, \`show_l_l_m\` = 1
    WHERE \`id\` = ${BUTTON_DO_DONT_BLOCK_ID};`);
  await db.run(sql`DELETE FROM \`components_blocks_do_dont_dos\`
    WHERE \`_parent_id\` = ${BUTTON_DO_DONT_BLOCK_ID};`);
  await db.run(sql`DELETE FROM \`components_blocks_do_dont_donts\`
    WHERE \`_parent_id\` = ${BUTTON_DO_DONT_BLOCK_ID};`);

  for (const [index, item] of BUTTON_DO_DONT_SEED.dos.entries()) {
    await db.run(sql`INSERT INTO \`components_blocks_do_dont_dos\`
      (\`_order\`, \`_parent_id\`, \`id\`, \`text\`)
      VALUES (${index}, ${BUTTON_DO_DONT_BLOCK_ID}, ${`button-do-${index + 1}`}, ${item.text});`);
  }
  for (const [index, item] of BUTTON_DO_DONT_SEED.donts.entries()) {
    await db.run(sql`INSERT INTO \`components_blocks_do_dont_donts\`
      (\`_order\`, \`_parent_id\`, \`id\`, \`text\`)
      VALUES (${index}, ${BUTTON_DO_DONT_BLOCK_ID}, ${`button-dont-${index + 1}`}, ${item.text});`);
  }
}

export async function down(): Promise<void> {
  // Preserve CMS-authored documentation on rollback.
}
