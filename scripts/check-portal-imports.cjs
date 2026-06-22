const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const EXT = new Set([".ts", ".tsx", ".js", ".mjs"]);
const SKIP = new Set(["node_modules", ".next", ".git"]);
const VALID_PREFIXES = ["brand/", "components/", "core/", "documentation/", "glossary/", "seo/"];

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (EXT.has(path.extname(ent.name))) files.push(p);
  }
  return files;
}

const reAlias = /@\/lib\/portal\/([^'"`\s]+)/g;
const reRel = /(?:from|import)\s*(?:\()?["']([^"']*lib\/portal\/[^"']+)["']/g;

const unresolved = new Map();

function checkSpecifier(spec, file) {
  let sub = null;
  if (spec.startsWith("@/lib/portal/")) {
    sub = spec.slice("@/lib/portal/".length).replace(/\.js$/, "");
  } else if (spec.includes("lib/portal/")) {
    const m = spec.match(/lib\/portal\/(.+)$/);
    if (m) sub = m[1].replace(/\.js$/, "");
  }
  if (!sub) return;
  if (VALID_PREFIXES.some((p) => sub.startsWith(p))) return;
  const portalRoot = path.join(ROOT, "lib/portal");
  const candidates = [
    path.join(portalRoot, sub + ".ts"),
    path.join(portalRoot, sub + ".tsx"),
    path.join(portalRoot, sub + ".js"),
    path.join(portalRoot, sub, "index.ts"),
  ];
  if (candidates.some((c) => fs.existsSync(c))) return;
  if (!unresolved.has(spec)) unresolved.set(spec, []);
  unresolved.get(spec).push(path.relative(ROOT, file));
}

for (const file of walk(ROOT)) {
  const content = fs.readFileSync(file, "utf8");
  for (const re of [reAlias, reRel]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(content))) checkSpecifier(m[1], file);
  }
}

console.log("UNRESOLVED_COUNT:", unresolved.size);
for (const [spec, files] of [...unresolved.entries()].sort()) {
  console.log(spec);
  files.slice(0, 8).forEach((f) => console.log("  ", f));
  if (files.length > 8) console.log("  ... +" + (files.length - 8));
}
