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
 *   5. every <QItem> block contains at least one <QOption ... correct>.
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

const exerciseUse = new Map();
const lessonUse = new Map();
const examUse = new Map();
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
  idSetByFile.set(file, fileIds);

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

// Translated files must reference exactly the same structural ids as their
// French sibling (same exercises, same lesson/exam anchors).
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
