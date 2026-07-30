import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`search\` ADD \`search_text\` text;`);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`search_search_text_idx\` ON \`search\` (\`search_text\`);`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`);
  await db.run(sql`
    CREATE TABLE \`__new_search\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`title\` text,
      \`priority\` numeric,
      \`excerpt\` text,
      \`portal_url\` text,
      \`area\` text,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    );
  `);
  await db.run(sql`
    INSERT INTO \`__new_search\` ("id", "title", "priority", "excerpt", "portal_url", "area", "updated_at", "created_at")
    SELECT "id", "title", "priority", "excerpt", "portal_url", "area", "updated_at", "created_at"
    FROM \`search\`;
  `);
  await db.run(sql`DROP TABLE \`search\`;`);
  await db.run(sql`ALTER TABLE \`__new_search\` RENAME TO \`search\`;`);
  await db.run(sql`PRAGMA foreign_keys=ON;`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_updated_at_idx\` ON \`search\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX IF NOT EXISTS \`search_created_at_idx\` ON \`search\` (\`created_at\`);`);
}
