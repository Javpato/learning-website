// Verifies that every `expected` query in the SQL course content actually runs
// against the seeded sample database (catches typos / dialect mistakes).
const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const ROOT = path.join(__dirname, "..");
const SQL_DIR = path.join(ROOT, "app", "[locale]", "cs", "sql");

// Extract SEED_SQL from seed.ts (single backtick template literal).
const seedTs = fs.readFileSync(path.join(ROOT, "lib", "sql", "seed.ts"), "utf8");
const seedMatch = seedTs.match(/SEED_SQL\s*=\s*\/\* sql \*\/\s*`([\s\S]*?)`/);
if (!seedMatch) throw new Error("Could not extract SEED_SQL from seed.ts");
const SEED_SQL = seedMatch[1];

function findContentFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findContentFiles(p));
    else if (entry.name === "content.en.mdx") out.push(p);
  }
  return out;
}

// Pull every `expected` value out of an MDX file (both "..." and {`...`} forms).
function extractExpected(src) {
  const results = [];
  // expected={`...`}
  const tmpl = /expected=\{`([\s\S]*?)`\}/g;
  let m;
  while ((m = tmpl.exec(src))) results.push(m[1].replace(/\\n/g, "\n"));
  // expected="..." (no escaped quotes used in our content)
  const dq = /expected="([^"]*)"/g;
  while ((m = dq.exec(src))) results.push(m[1]);
  return results;
}

(async () => {
  const SQL = await initSqlJs();
  const files = findContentFiles(SQL_DIR).sort();
  let total = 0;
  let failures = 0;

  for (const file of files) {
    const rel = path.relative(SQL_DIR, file);
    const queries = extractExpected(fs.readFileSync(file, "utf8"));
    for (let i = 0; i < queries.length; i++) {
      total++;
      const db = new SQL.Database();
      try {
        db.run(SEED_SQL);
        db.run(queries[i]); // throws on any SQL error
      } catch (e) {
        failures++;
        console.log(`\n❌ ${rel} [expected #${i + 1}]`);
        console.log(`   ${queries[i].replace(/\s+/g, " ").slice(0, 120)}`);
        console.log(`   → ${e.message}`);
      } finally {
        db.close();
      }
    }
  }

  console.log(`\n${total - failures}/${total} expected queries ran cleanly.`);
  if (failures) {
    console.log(`${failures} FAILED — see above.`);
    process.exit(1);
  }
  console.log("All expected queries are valid SQLite. ✓");
})();
