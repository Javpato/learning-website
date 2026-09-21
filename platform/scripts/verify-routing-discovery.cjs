const assert = require("node:assert/strict");
const m = require(process.env.RESEAUX_BUILD + "/networkLab");
const d = require(process.env.RESEAUX_BUILD + "/routingDiscovery");
const exercises = require(process.env.RESEAUX_BUILD + "/networkCodeExercises");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs"),
  os = require("node:os"),
  path = require("node:path");
let labels = d.initialLabels(m.TD4_DIRECTED, "A");
assert.throws(() => d.settleMinimum(labels, "B"));
for (const n of ["A", "E", "B", "C", "D", "F"]) {
  labels = d.settleMinimum(labels, n);
  for (const [a, b, w] of m.TD4_DIRECTED.edges.filter((e) => e[0] === n))
    labels = d.relax(labels, a, b, w);
}
assert.deepEqual(labels, m.shortestSteps(m.TD4_DIRECTED, "A").at(-1).labels);
assert.throws(() => d.settleMinimum(labels, "A"));
assert.throws(() => d.relax(labels, "A", "B", -1));
const wave = d.waveProgress(m.TD4_DIRECTED, labels, 6);
assert.equal(wave["A-E"], 1);
assert.equal(wave["E-B"], 0.5);
assert.equal(wave["C-F"], 0);
// A finite minimum is valid even when several vertices tie.
assert.equal(
  d.settleMinimum(
    {
      A: { cost: 1, via: null, fixed: false },
      B: { cost: 1, via: null, fixed: false },
    },
    "B",
  ).B.fixed,
  true,
);
console.log(
  "routing discovery: manual relaxations, minimum selection and wave verified",
);
// Compile real authored C; execute independent TD fixtures plus disconnected/zero-weight cases.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "reseaux-c-"));
try {
  for (const ex of exercises.C_EXERCISES) {
    const source = path.join(dir, ex.id + ".c"),
      binary = path.join(dir, ex.id);
    fs.writeFileSync(source, exercises.cProgram(ex, ex.solution));
    execFileSync("cc", [
      "-std=c11",
      "-Wall",
      "-Wextra",
      "-Werror",
      "-pedantic",
      source,
      "-o",
      binary,
    ]);
    assert.equal(
      execFileSync(binary, { encoding: "utf8", timeout: 2000 }).trim(),
      ex.expected,
    );
  }
  console.log(
    "C exercises: all 3 solutions compile and pass TD + variant tests",
  );
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
