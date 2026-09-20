// Independent fixtures from TD1/TD4, plus invariants for the new workshop.
const assert = require("node:assert/strict");
const p = process.env.RESEAUX_BUILD;
const m = require(p + "/networkLab");
const lang = require(p + "/networkLanguage");
let checks = 0;
function equal(actual, expected) {
  assert.deepEqual(actual, expected);
  checks++;
}
function near(actual, expected, tol = 1e-9) {
  assert.ok(Math.abs(actual - expected) < tol, `${actual} != ${expected}`);
  checks++;
}
// Source figure TD1 p1: compare actual half-bit levels, not point counts.
equal(m.encodeSignal("101001001", "nrz"), [1, -1, 1, -1, -1, 1, -1, -1, 1]);
equal(
  m.encodeSignal("101001001", "manchester"),
  [1, -1, -1, 1, 1, -1, -1, 1, -1, 1, 1, -1, -1, 1, -1, 1, 1, -1],
);
equal(
  m.encodeSignal("101001001", "differential"),
  [1, -1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, 1, -1, -1, 1],
);
for (let length = 1; length <= 8; length++)
  for (let value = 0; value < 2 ** length; value++) {
    const bits = value.toString(2).padStart(length, "0");
    for (const code of ["nrz", "manchester", "differential"])
      equal(m.decodeSignal(m.encodeSignal(bits, code), code), bits);
  }
equal(m.decodeSignal([1, 1, -1, 1], "manchester"), "?0");
equal(["0001111", "1101010", "1110000"].map(m.parity), [0, 0, 1]);
for (let a = 0; a < 8; a++)
  for (let b = a + 1; b < 8; b++) {
    const word = Array(8).fill("0");
    word[a] = "1";
    word[b] = "1";
    equal(m.parity(word.join("")), 0);
  }
equal(
  m.HAMMING_WORDS.map((w) => m.hamming("0000000111", w)),
  [3, 2, 8, 7],
);
equal(m.polynomialProduct(14, 13), 0b1000110);
equal(m.polynomialDivision(0b1001110, 13).remainder, 0b101);
equal(m.polynomialDivision(m.polynomialProduct(14, 13), 13).remainder, 0);
near(m.shannon(48000, 30), 478426.8604241277, 1e-6);
near(m.parityResidual(0.0001), 2.798320489916009e-7, 1e-15);
const final = m.shortestSteps(m.TD4_DIRECTED, "A").at(-1).labels;
equal(Object.fromEntries(Object.entries(final).map(([n, l]) => [n, l.cost])), {
  A: 0,
  B: 7,
  C: 9,
  D: 10,
  E: 5,
  F: 10,
});
equal(m.pathTo(final, "A", "F"), ["A", "E", "C", "F"]);
equal(m.shortestSteps(m.TD4_DIRECTED, "F").at(-1).labels.A.cost, Infinity);
equal(
  m.pathTo(
    m.shortestSteps({ nodes: ["A", "B"], edges: [] }, "A").at(-1).labels,
    "A",
    "B",
  ),
  [],
);
assert.throws(() =>
  m.shortestSteps({ nodes: ["A", "B"], edges: [["A", "B", -1]] }, "A"),
);
checks++;
const steps = m.td4FailureSteps();
equal(steps[0].tables.A.D, { cost: 5, next: "B" });
equal(steps[0].tables.C.D, { cost: 3, next: "D" });
equal(steps[1].tables.C.D.cost, Infinity);
equal(steps[1].tables.D.C.cost, Infinity);
equal(steps[2].tables.D.C, { cost: 5, next: "B" });
equal(steps[3].tables.B, steps[0].tables.B);
equal(steps[4].tables.C.D, { cost: 5, next: "B" });
equal(steps[5].tables.A, steps[0].tables.A);
let state = m.dvState(m.TD4_DV);
for (let round = 0; round < 4; round++)
  for (const n of m.TD4_DV.nodes)
    state = m.receiveVectors(
      state,
      n,
      m.TD4_DV.edges.filter((e) => e[0] === n).map((e) => e[1]),
    );
equal(state.tables, m.initialTables(m.TD4_DV, true));
near(m.switchingTime(24000, 24000, 40, 3, 1e6, 0.001).total, 0.07512);
near(m.switchingTime(24000, 2000, 40, 3, 1e6, 0.001).total, 0.03156);
equal(m.switchingTime(1000, 384, 40, 1, 1e6, 0, true).overhead, 272);
for (const [source, stored, expected] of [
  ["en", "fr", "en"],
  ["es", "en", "es"],
  [null, "es", "es"],
  [null, null, "fr"],
  ["bad", "bad", "fr"],
])
  equal(lang.courseLanguage(source, stored), expected);
equal(
  lang.isFrenchWorkshop("/learning-website/platform/fr/cs/reseaux/atelier/"),
  true,
);
equal(lang.isFrenchWorkshop("/fr/math"), false);
equal(lang.isFrenchWorkshop("/fr/cs/reseaux/td-1"), false);
console.log(
  `network workshop: ${checks} source fixtures and invariants passed`,
);
