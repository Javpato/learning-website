#!/usr/bin/env node
/*
 * Verify the L2 Chimie learning-track content (analog of verify-sql.cjs).
 * Checks, across every content.fr.mdx under math/fonctions-plusieurs-variables
 * and physics:
 *   1. every <ExerciseView|LessonMeta|RelatedExercises|LessonStateSelector|
 *      MockExamView id="..."> resolves in the content registry;
 *   2. every registry exercise id appears in exactly one MDX file;
 *   3. every lesson id has exactly one lesson page using it in LessonMeta;
 *   4. $ / $$ math delimiters are balanced in every file;
 *   5. every <QItem> block contains at least one <QOption ... correct>;
 *   6. glossary integrity (lib/content/glossaire-fmv.ts): ids are unique
 *      ASCII kebab-case, lessonIds resolve, no `$` anywhere in the file
 *      (`short` renders in a title attribute where KaTeX cannot run);
 *      every <Terme id> / <Def id> in MDX resolves in the glossary; every
 *      <Def id> appears exactly once across fr files and in the lesson file
 *      matching its glossary lessonId.
 *
 * Env flags (used only while the FR-first rewrite is in flight):
 *   VERIFY_SKIP_PARITY=1     skip the en/es-vs-fr structural parity check;
 *   VERIFY_STRICT_GLOSSARY=1 additionally require every glossary entry to
 *                            have its <Def> present (final-state check).
 *
 * The registry lives in TypeScript; rather than compile it, this script
 * re-derives the id inventory from the TS sources with regexes (ids are
 * simple string literals `id: "..."`).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const APP = path.join(ROOT, "app", "[locale]");

function readIds(file, kind) {
  const src = fs.readFileSync(path.join(ROOT, "lib", "content", file), "utf8");
  const ids = [];
  const re = /id:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) ids.push(m[1]);
  return ids;
}

const allIds = new Set([...readIds("math-fmv.ts"), ...readIds("physics-em.ts")]);
const exerciseIds = [...allIds].filter((id) => /-td\d+-\d+$/.test(id));
const lessonIds = [...allIds].filter((id) => /-c\d+$/.test(id));
const examIds = [...allIds].filter((id) => /-exam-/.test(id));

// Glossary (terme id -> lessonId of its definition site)
const glossarySrc = fs.readFileSync(
  path.join(ROOT, "lib", "content", "glossaire-fmv.ts"),
  "utf8",
);
const termeLesson = new Map();
{
  const entryRe = /id:\s*"([^"]+)"[\s\S]*?lessonId:\s*"([^"]+)"/g;
  let m;
  while ((m = entryRe.exec(glossarySrc))) termeLesson.set(m[1], m[2]);
}

// collect mdx files
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/^content\.(fr|en|es)\.mdx$/.test(e.name)) out.push(p);
  }
  return out;
}

function localeOf(file) {
  return path.basename(file).split(".")[1]; // fr | en | es
}

const mdxFiles = [
  ...walk(path.join(APP, "math", "fonctions-plusieurs-variables")),
  ...walk(path.join(APP, "physics")),
];

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error("✗ " + msg);
};

// 6a. glossary self-checks
{
  const seen = new Set();
  for (const [id, lessonId] of termeLesson) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))
      fail(`glossaire-fmv.ts: terme id "${id}" is not ASCII kebab-case`);
    if (seen.has(id)) fail(`glossaire-fmv.ts: duplicate terme id "${id}"`);
    seen.add(id);
    if (!lessonIds.includes(lessonId))
      fail(`glossaire-fmv.ts: terme "${id}" points to unknown lesson "${lessonId}"`);
  }
  if (glossarySrc.includes("$"))
    fail("glossaire-fmv.ts: contains '$' — glossary strings render in title attributes, KaTeX cannot run there");
}

const exerciseUse = new Map();
const lessonUse = new Map();
const examUse = new Map();
const defUse = new Map(); // terme id -> count across fr files
const lessonOfFile = new Map(); // fr file -> lesson id (from <LessonMeta id>)
const defsByFile = new Map(); // fr file -> Set of def ids
const idSetByFile = new Map(); // file -> Set of referenced ids (structure check)

for (const file of mdxFiles) {
  const rel = path.relative(ROOT, file);
  const loc = localeOf(file);
  const src = fs.readFileSync(file, "utf8");

  // 1. id references resolve (fr counts toward the exactly-once inventory)
  const refRe = /<(ExerciseView|LessonMeta|RelatedExercises|LessonStateSelector|MockExamView)\s+id="([^"]+)"/g;
  const fileIds = new Set();
  let m;
  while ((m = refRe.exec(src))) {
    const [, comp, id] = m;
    if (!allIds.has(id)) fail(`${rel}: <${comp} id="${id}"> — unknown id`);
    if (comp === "ExerciseView" || comp === "LessonMeta" || comp === "MockExamView") {
      fileIds.add(`${comp}:${id}`);
    }
    if (loc === "fr") {
      if (comp === "ExerciseView") exerciseUse.set(id, (exerciseUse.get(id) ?? 0) + 1);
      if (comp === "LessonMeta") lessonUse.set(id, (lessonUse.get(id) ?? 0) + 1);
      if (comp === "MockExamView") examUse.set(id, (examUse.get(id) ?? 0) + 1);
    }
  }
  // 6b. glossary references resolve; Def/Terme count toward locale parity
  const termRe = /<(Def|Terme)\s+id="([^"]+)"/g;
  while ((m = termRe.exec(src))) {
    const [, comp, id] = m;
    if (!termeLesson.has(id)) fail(`${rel}: <${comp} id="${id}"> — unknown glossary term`);
    fileIds.add(`${comp}:${id}`);
    if (comp === "Def" && loc === "fr") {
      defUse.set(id, (defUse.get(id) ?? 0) + 1);
      if (!defsByFile.has(file)) defsByFile.set(file, new Set());
      defsByFile.get(file).add(id);
    }
  }
  if (loc === "fr") {
    const lm = src.match(/<LessonMeta\s+id="([^"]+)"/);
    if (lm) lessonOfFile.set(file, lm[1]);
  }
  idSetByFile.set(file, fileIds);

  // 4b. multi-line $$ blocks must have their fences on their own lines —
  // micromark only closes a multi-line math block on a bare "$$" line, so
  // "$$content…" / "…content$$" spanning lines silently swallows the rest
  // of the document (single-line "$$…$$" is fine).
  {
    let inMath = false;
    src.split("\n").forEach((line, i) => {
      const n = (line.match(/\$\$/g) || []).length;
      if (n === 2 && !inMath) return; // single-line $$…$$
      if (n === 1) {
        const s = line.trim();
        if (s === "$$") {
          inMath = !inMath;
        } else {
          fail(`${rel}:${i + 1}: multi-line $$ fence with content attached — put the $$ on its own line`);
          inMath = !inMath;
        }
      } else if (n === 2 && inMath) {
        fail(`${rel}:${i + 1}: unexpected $$…$$ inside an open $$ block`);
      }
    });
  }

  // 4. balanced math delimiters (strip $$ blocks first, then count single $)
  const noDisplay = src.replace(/\$\$/g, "");
  const singles = (noDisplay.match(/(?<!\\)\$/g) || []).length;
  if (singles % 2 !== 0) fail(`${rel}: unbalanced $ math delimiters`);
  const displays = (src.match(/\$\$/g) || []).length;
  if (displays % 2 !== 0) fail(`${rel}: unbalanced $$ math delimiters`);

  // 5. each QItem has a correct option
  const qitems = src.split(/<QItem[\s>]/).slice(1);
  qitems.forEach((block, i) => {
    const end = block.indexOf("</QItem>");
    const body = end >= 0 ? block.slice(0, end) : block;
    if (!/<QOption[^>]*\scorrect/.test(body)) {
      fail(`${rel}: QItem #${i + 1} has no correct <QOption>`);
    }
  });
}

// 2. every exercise appears exactly once
for (const id of exerciseIds) {
  const n = exerciseUse.get(id) ?? 0;
  if (n === 0) fail(`exercise ${id} not present in any MDX`);
  if (n > 1) fail(`exercise ${id} present in ${n} MDX files`);
}
// 3. every lesson has exactly one LessonMeta usage
for (const id of lessonIds) {
  const n = lessonUse.get(id) ?? 0;
  if (n === 0) fail(`lesson ${id} has no page using <LessonMeta>`);
  if (n > 1) fail(`lesson ${id} used by ${n} LessonMeta blocks`);
}
for (const id of examIds) {
  const n = examUse.get(id) ?? 0;
  if (n === 0) fail(`exam ${id} has no MockExamView page`);
  if (n > 1) fail(`exam ${id} used by ${n} MockExamView blocks`);
}

// 6c. each <Def> appears exactly once (fr) and in the lesson its entry names
for (const [id, n] of defUse) {
  if (n > 1) fail(`<Def id="${id}"> appears ${n} times across fr files (must be unique)`);
}
for (const [file, defs] of defsByFile) {
  const inLesson = lessonOfFile.get(file);
  for (const id of defs) {
    const want = termeLesson.get(id);
    if (want && want !== inLesson) {
      fail(
        `${path.relative(ROOT, file)}: <Def id="${id}"> — glossary places this definition in ${want}, not ${inLesson ?? "a non-lesson file"}`,
      );
    }
  }
}
if (process.env.VERIFY_STRICT_GLOSSARY === "1") {
  for (const [id] of termeLesson) {
    if (!defUse.get(id)) fail(`glossary term "${id}" has no <Def> in any fr lesson`);
  }
}

// Translated files must reference exactly the same structural ids as their
// French sibling (same exercises, same lesson/exam anchors, same Def/Terme).
if (process.env.VERIFY_SKIP_PARITY === "1") {
  console.log("⚠ locale-parity check skipped (VERIFY_SKIP_PARITY=1 — FR-first rewrite in flight)");
} else {
  for (const file of mdxFiles) {
    const loc = localeOf(file);
    if (loc === "fr") continue;
    const frSibling = path.join(path.dirname(file), "content.fr.mdx");
    const frIds = idSetByFile.get(frSibling);
    if (!frIds) {
      fail(`${path.relative(ROOT, file)}: translated file has no content.fr.mdx sibling`);
      continue;
    }
    const ids = idSetByFile.get(file);
    for (const k of frIds) if (!ids.has(k)) fail(`${path.relative(ROOT, file)}: missing ${k} present in fr`);
    for (const k of ids) if (!frIds.has(k)) fail(`${path.relative(ROOT, file)}: extra ${k} absent from fr`);
  }
}

const locCounts = { fr: 0, en: 0, es: 0 };
for (const f of mdxFiles) locCounts[localeOf(f)]++;
console.log(`Locales: fr=${locCounts.fr} en=${locCounts.en} es=${locCounts.es}`);
console.log(
  `Checked ${mdxFiles.length} MDX files · ${lessonIds.length} lessons · ${exerciseIds.length} exercises · ${examIds.length} exams`,
);
if (failures) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log("✓ content verification passed");
