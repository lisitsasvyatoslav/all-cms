import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Global text-glossary + коллекция glossary-terms для /text/glossary. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`text_glossary\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text DEFAULT 'Глоссарий',
  	\`intro\` text DEFAULT 'Слова, которые нужно использовать в общении с пользователями — в интерфейсе, в новостях и в разговоре с клиентами.',
  	\`principles_heading\` text DEFAULT 'Как мы выбираем слова',
  	\`principles_footer\` text DEFAULT 'Из двух равнозначных слов и в спорных случаях транслитерации мы выбираем более распространённый вариант. Распространённость проверяем по словарям и, если это не помогло, по цитируемости в интернете. Например, мы пишем «Лендинг», а не «Лэндинг», потому что так пишут на порядок чаще.',
  	\`terms_section_heading\` text DEFAULT 'Словарь',
  	\`share_title\` text DEFAULT 'Глоссарий',
  	\`share_description\` text DEFAULT 'Слова для интерфейса и коммуникации с пользователями: что использовать и чего избегать.',
  	\`updated_at\` text,
  	\`created_at\` text
  );`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`text_glossary_principles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`text_glossary\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`text_glossary_principles_order_idx\` ON \`text_glossary_principles\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`text_glossary_principles_parent_id_idx\` ON \`text_glossary_principles\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`glossary_terms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`preferred\` text NOT NULL,
  	\`avoid\` text,
  	\`comment\` text,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text NOT NULL,
  	\`created_at\` text NOT NULL
  );`);

  for (const stmt of [
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`text_glossary_id\` integer REFERENCES text_glossary(id);`,
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`glossary_terms_id\` integer REFERENCES glossary_terms(id);`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`text_glossary_find\` integer DEFAULT 0;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`text_glossary_update\` integer DEFAULT 0;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`glossary_terms_find\` integer DEFAULT 0;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`glossary_terms_create\` integer DEFAULT 0;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`glossary_terms_update\` integer DEFAULT 0;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`glossary_terms_delete\` integer DEFAULT 0;`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* колонка уже есть */
    }
  }

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_text_glossary_id_idx\` ON \`payload_locked_documents_rels\` (\`text_glossary_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_glossary_terms_id_idx\` ON \`payload_locked_documents_rels\` (\`glossary_terms_id\`);`,
  );
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: откат вручную при необходимости. */
}
