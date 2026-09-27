/* Source coverage and bidirectional course/TD navigation. Run after the standalone TS compilation. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

assert.ok(process.env.RESEAUX_BUILD, "verify-ip-course requires RESEAUX_BUILD from verify-reseaux.cjs");
const { IP_SECTIONS } = require(path.join(process.env.RESEAUX_BUILD, "ipCourseContent"));
const { IP_EXERCISES } = require(path.join(process.env.RESEAUX_BUILD, "ipTutorialContent"));
const root = path.join(__dirname, "..");
const componentRoot = path.join(root, "components", "cs", "network-lab");
const course = fs.readFileSync(path.join(componentRoot, "IPCourse.tsx"), "utf8");
const tutorial = fs.readFileSync(path.join(componentRoot, "IPTutorial.tsx"), "utf8");
let checks = 0;
function check(condition, message) {
  assert.ok(condition, message);
  checks++;
}
function equal(actual, expected, message) {
  assert.deepEqual(actual, expected, message);
  checks++;
}
function asset(relative) {
  const file = path.join(root, "public", "reseaux", relative);
  check(fs.existsSync(file) && fs.statSync(file).size > 0, `Missing or empty source asset: ${relative}`);
}

// An independent inventory: the supplied PDF has 60 slides on 30 pages.
let expectedSlide = 1;
const sectionIds = new Set();
for (const section of IP_SECTIONS) {
  check(/^ip-[a-z0-9-]+$/.test(section.id), `Invalid course anchor ${section.id}`);
  check(!sectionIds.has(section.id), `Duplicate course anchor ${section.id}`);
  sectionIds.add(section.id);
  check(section.title.trim().length > 0, `Untitled section ${section.id}`);
  const [first, last] = section.slides;
  check(Number.isInteger(first) && Number.isInteger(last) && first <= last, `Invalid slide interval ${section.id}`);
  equal(first, expectedSlide, `Slide omission, overlap or reordering before ${section.id}`);
  expectedSlide = last + 1;
}
equal(expectedSlide, 61, "Course must explain all 60 source slides");
const renderedSections = [...course.matchAll(/<Section\s+id="([^"]+)"/g)].map((match) => match[1]);
equal(renderedSections, IP_SECTIONS.map((section) => section.id), "Rendered CM must contain each indexed section once, in source order");

asset("cours/IP.pdf");
const extractedPages = JSON.parse(fs.readFileSync(path.join(root, "public", "reseaux", "cours", "IP", "pages.json"), "utf8"));
equal(extractedPages.pages.length, 30, "IP original source text must retain all 30 PDF pages");
for (let page = 1; page <= 30; page++) {
  asset(`cours/IP/${page}.webp`);
  check(typeof extractedPages.pages[page - 1] === "string" && extractedPages.pages[page - 1].trim().length > 0, `Empty IP source text page ${page}`);
}

// Every source exercise must remain independently reachable and fully documented.
equal(IP_EXERCISES.length, 13, "The supplied TD IP has 13 exercises");
const exerciseIds = new Set();
const legacyIds = new Set();
for (const [index, exercise] of IP_EXERCISES.entries()) {
  const number = String(index + 1).padStart(2, "0");
  equal(exercise.id, `ip-td-${number}`, "TD exercise numbering must be preserved");
  equal(exercise.legacyId, `cs-net-td5-${number}`, "Classic TD deep link must remain associated with the same question");
  check(!exerciseIds.has(exercise.id) && !legacyIds.has(exercise.legacyId), `Duplicate exercise link ${exercise.id}`);
  exerciseIds.add(exercise.id);
  legacyIds.add(exercise.legacyId);
  for (const field of ["title", "statement", "correction"]) {
    check(typeof exercise[field] === "string" && exercise[field].trim().length > 0, `${exercise.id}: missing ${field}`);
  }
  check(Array.isArray(exercise.solution) && exercise.solution.length > 0 && exercise.solution.every((step) => typeof step === "string" && step.trim().length > 0), `${exercise.id}: missing explanatory solution`);
  check(sectionIds.has(exercise.courseSection), `${exercise.id}: broken course backlink ${exercise.courseSection}`);
  for (const [field, folder, maxPage] of [["sourcePages", "ip-statement", 12], ["correctionPages", "ip-correction", 11]]) {
    const pages = exercise[field];
    check(Array.isArray(pages) && pages.length > 0, `${exercise.id}: missing ${field}`);
    check(new Set(pages).size === pages.length, `${exercise.id}: duplicate ${field}`);
    for (const page of pages) {
      check(Number.isInteger(page) && page >= 1 && page <= maxPage, `${exercise.id}: invalid ${field} page ${page}`);
      asset(`td/${folder}/page-${String(page).padStart(2, "0")}.jpg`);
    }
  }
}
asset("td/TD456-correction.pdf");
asset("td/TD_IP-correction.pdf");

// Check actual link expressions, not a second hand-maintained exercise index.
check(/IP_EXERCISES\.filter\(\s*\(exercise\)\s*=>\s*exercise\.courseSection\s*===\s*id\s*,?\s*\)/.test(course), "Course must derive its related exercises from the shared registry");
check(course.includes("#td-ip/${exercise.id}"), "Course-to-TD links must address the exercise anchor");
check(tutorial.includes("#ip/${exercise.courseSection}"), "TD-to-course links must address the explanation anchor");
check(tutorial.includes("id={exercise.id}"), "Selected TD exercise must render its deep-link anchor");
for (const match of course.matchAll(/href="#ip\/([^"]+)"/g)) {
  check(sectionIds.has(match[1]), `Broken static course hash #ip/${match[1]}`);
}
check(!course.includes("#tdip"), "Old draft TD hash must not be shipped");
console.log(`IP source coverage and navigation: ${checks} checks passed.`);
