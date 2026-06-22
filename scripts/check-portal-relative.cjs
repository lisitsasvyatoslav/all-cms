const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "../lib/portal");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (/\.(ts|tsx)$/.test(e.name)) a.push(p);
  }
  return a;
}

const re = /from\s+["'](\.[^"']+)["']/g;

for (const f of walk(root)) {
  const c = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(c))) {
    const imp = m[1];
    const dir = path.dirname(f);
    const resolved = path.normalize(path.join(dir, imp));
    const tryExt = [".ts", ".tsx", ".js"];
    const exists = tryExt.some((ext) => fs.existsSync(resolved + ext)) || fs.existsSync(path.join(resolved, "index.ts"));
    if (!exists) {
      console.log(path.relative(path.join(__dirname, ".."), f) + " -> " + imp);
    }
  }
}
