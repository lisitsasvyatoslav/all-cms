const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const EXT = new Set([".ts", ".tsx", ".js", ".mjs"]);
const SKIP = new Set(["node_modules", ".next", ".git"]);
const VALID_TOP = new Set(["brand", "components", "core", "documentation", "glossary", "seo"]);

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (EXT.has(path.extname(ent.name))) files.push(p);
  }
  return files;
}

const re = /@\/lib\/portal\/([^"'`\s]+)/g;
const flat = new Map();

for (const file of walk(ROOT)) {
  const content = fs.readFileSync(file, "utf8");
  let m;
  while ((m = re.exec(content))) {
    const rest = m[1].replace(/\.js$/, "");
    const top = rest.split("/")[0];
    if (!VALID_TOP.has(top)) {
      const key = "@/lib/portal/" + m[1];
      if (!flat.has(key)) flat.set(key, []);
      flat.get(key).push(path.relative(ROOT, file));
    }
  }
}

console.log("FLAT_ALIAS_COUNT:", flat.size);
for (const [spec, files] of [...flat.entries()].sort()) {
  console.log(spec);
  files.forEach((f) => console.log("  ", f));
}
