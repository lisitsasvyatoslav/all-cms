import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Global portal-seo: OG title/description для главной, каталога, showcase. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`portal_seo\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'Design System',
  	\`title_default\` text DEFAULT 'Design System · Portal',
  	\`title_template\` text DEFAULT '%s · Design System',
  	\`default_description\` text DEFAULT 'Портал дизайн-системы: компоненты, документация, Storybook.',
  	\`locale\` text DEFAULT 'ru_RU',
  	\`default_og_image_id\` integer,
  	\`home_share_title\` text DEFAULT 'Дизайн-система',
  	\`home_share_description\` text DEFAULT 'Портал дизайн-системы: компоненты, документация, Storybook и ссылки на источники.',
  	\`home_share_image_id\` integer,
  	\`catalog_web_share_title\` text DEFAULT 'Components',
  	\`catalog_web_share_description\` text DEFAULT 'Каталог компонентов дизайн-системы для Web.',
  	\`catalog_web_share_image_id\` integer,
  	\`showcase_share_title\` text DEFAULT 'Блоки документации',
  	\`showcase_share_description\` text DEFAULT 'Демо 13 блоков вкладки «Документация» коллекции components — как на реальной странице компонента.',
  	\`showcase_share_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`default_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`home_share_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`catalog_web_share_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`showcase_share_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`);

  for (const stmt of [
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`portal_seo_id\` integer REFERENCES portal_seo(id);`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`portal_seo_find\` integer DEFAULT 0;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`portal_seo_update\` integer DEFAULT 0;`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* колонка уже есть */
    }
  }

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_portal_seo_id_idx\` ON \`payload_locked_documents_rels\` (\`portal_seo_id\`);`,
  );
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: откат вручную при необходимости. */
}
