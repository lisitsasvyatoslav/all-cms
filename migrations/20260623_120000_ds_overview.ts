import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-sqlite";

/** Global ds-overview для главной страницы /ds. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_overview\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT 'Proof of Concept · внутренний прототип',
  	\`title\` text DEFAULT 'Дизайн-система',
  	\`lead\` text DEFAULT 'Внутренний прототип портала документации дизайн-системы. Контент редактируется в Payload; компоненты и превью — на базе Radix Themes и Storybook. Данные на странице — демо для проверки архитектуры, не финальные продуктовые гайды.',
  	\`capabilities_heading\` text DEFAULT 'Что уже работает',
  	\`stack_heading\` text DEFAULT 'Стек',
  	\`navigation_note\` text DEFAULT 'Навигация слева ведёт в каталог компонентов и справочник блоков документации. Для интерактивных превью запустите Storybook локально на порту 6006.',
  	\`roadmap_heading\` text DEFAULT 'Дальше',
  	\`sources_heading\` text DEFAULT 'Источники',
  	\`sources_intro\` text DEFAULT 'Ссылки на инструменты, с которыми работает команда. На этапе PoC часть URL — заглушки; замените их в Globals → «Ссылки на источники» или отредактируйте карточки ниже.',
  	\`updated_at\` text,
  	\`created_at\` text
  );`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_overview_capabilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`ds_overview_capabilities_order_idx\` ON \`ds_overview_capabilities\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`ds_overview_capabilities_parent_id_idx\` ON \`ds_overview_capabilities\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_overview_roadmap\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`ds_overview_roadmap_order_idx\` ON \`ds_overview_roadmap\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`ds_overview_roadmap_parent_id_idx\` ON \`ds_overview_roadmap\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_overview_stack_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`ds_overview_stack_items_order_idx\` ON \`ds_overview_stack_items\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`ds_overview_stack_items_parent_id_idx\` ON \`ds_overview_stack_items\` (\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE IF NOT EXISTS \`ds_overview_source_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`description\` text,
  	\`href\` text,
  	\`icon\` text DEFAULT 'link',
  	\`external\` integer DEFAULT true,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ds_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`ds_overview_source_items_order_idx\` ON \`ds_overview_source_items\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`ds_overview_source_items_parent_id_idx\` ON \`ds_overview_source_items\` (\`_parent_id\`);`,
  );

  for (const stmt of [
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`ds_overview_id\` integer REFERENCES ds_overview(id);`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`ds_overview_find\` integer DEFAULT 0;`,
    sql`ALTER TABLE \`payload_mcp_api_keys\` ADD \`ds_overview_update\` integer DEFAULT 0;`,
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* колонка уже есть */
    }
  }

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`payload_locked_documents_rels_ds_overview_id_idx\` ON \`payload_locked_documents_rels\` (\`ds_overview_id\`);`,
  );
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: откат вручную при необходимости. */
}
