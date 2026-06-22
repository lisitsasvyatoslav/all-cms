import fs from "fs";

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if (!inputPath || !outputPath) {
  console.error("Usage: node extract-brand-migration.mjs <input.ts> <output.ts>");
  process.exit(1);
}

const src = fs.readFileSync(inputPath, "utf8");

function extractRunBlocks(source) {
  const lines = source.split("\n");
  const blocks = [];
  let current = "";

  for (const line of lines) {
    if (!current && line.includes("await db.run(sql`")) {
      current = line;
    } else if (current) {
      current += `\n${line}`;
    }

    if (
      current &&
      (/`\)$/.test(line.trim()) || /`\);$/.test(line.trim()))
    ) {
      blocks.push(current.trim());
      current = "";
    }
  }

  return blocks;
}

const blocks = extractRunBlocks(src);
const brandBlocks = blocks.filter(
  (block) =>
    block.includes("brand_") &&
    !block.includes("related_preview") &&
    !block.includes("components_design_checklist") &&
    !block.includes("design_checklist_items") &&
    !block.includes("glossary_terms") &&
    !block.includes("portal_seo") &&
    !block.includes("text_glossary") &&
    !block.includes("design_checklist_items_id"),
);

const alterBlocks = brandBlocks.filter(
  (block) =>
    block.includes("ALTER TABLE") &&
    (block.includes("brand_pages") ||
      block.includes("brand_overview") ||
      block.includes("brand_color")),
);
const createBlocks = brandBlocks
  .filter((block) => !block.includes("ALTER TABLE"))
  .map((block) =>
    block
      .replace(/CREATE TABLE `/g, "CREATE TABLE IF NOT EXISTS `")
      .replace(/CREATE UNIQUE INDEX `/g, "CREATE UNIQUE INDEX IF NOT EXISTS `")
      .replace(/CREATE INDEX `/g, "CREATE INDEX IF NOT EXISTS `"),
  );

const out = `import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-sqlite';

/** brand-pages collection + brand-overview + brand-color globals. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
${createBlocks.map((block) => `  ${block}`).join("\n")}

  for (const stmt of [
${alterBlocks
  .map((block) => {
    const inner = block.replace(/^await db\.run\(/, "").replace(/\);$/, "");
    return `    ${inner},`;
  })
  .join("\n")}
  ]) {
    try {
      await db.run(stmt);
    } catch {
      /* column already exists */
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  /* SQLite: отkат вручную при необходимости. */
}
`;

fs.writeFileSync(outputPath, out);
console.log(`Wrote ${createBlocks.length} create + ${alterBlocks.length} alter statements to ${outputPath}`);
