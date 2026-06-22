const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const EXT = new Set([".ts", ".tsx", ".js", ".mjs"]);
const SKIP = new Set(["node_modules", ".next", ".git"]);
const VALID = new Set(["brand", "components", "core", "documentation", "glossary", "seo"]);

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (EXT.has(path.extname(ent.name))) files.push(p);
  }
  return files;
}

const re = /lib\/portal\/([A-Za-z0-9_./-]+)/g;
const bad = new Map();

for (const file of walk(ROOT)) {
  const content = fs.readFileSync(file, "utf8");
  let m;
  while ((m = re.exec(content))) {
    const rest = m[1].replace(/\.js$/, "");
    const top = rest.split("/")[0];
    if (VALID.has(top)) continue;
    const portalRoot = path.join(ROOT, "lib/portal");
    const candidates = [
      path.join(portalRoot, rest + ".ts"),
      path.join(portalRoot, rest + ".tsx"),
      path.join(portalRoot, rest + ".js"),
    ];
    if (candidates.some((c) => fs.existsSync(c))) continue;
    const key = "lib/portal/" + m[1];
    if (!bad.has(key)) bad.set(key, []);
    bad.get(key).push(path.relative(ROOT, file));
  }
}

console.log("BAD_LIB_PORTAL_COUNT:", bad.size);
for (const [spec, files] of [...bad.entries()].sort()) {
  console.log(spec);
  files.forEach((f) => console.log("  ", f));
}
