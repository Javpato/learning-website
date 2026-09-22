const assert = require("node:assert/strict");
const m = require(process.env.RESEAUX_BUILD + "/bellmanGuide");
const reference = require("../lib/cs/fixtures/bellmanGuide.json");
const frames = m.history();
assert.equal(frames.length, 13);
for (const s of frames) {
  const actual = JSON.parse(
    JSON.stringify(s.tables, (_, v) => (v === Infinity ? "INF" : v)),
  );
  assert.deepEqual(
    actual,
    reference[s.id],
    s.id + " exact distances AND next hops",
  );
  for (const a of m.NODES)
    for (const z of m.NODES) {
      const e = s.tables[a][z];
      if (a === z) assert.deepEqual(e, { cost: 0, next: null });
      else if (Number.isFinite(e.cost))
        assert.ok(m.neighbors(s.links, a).includes(e.next));
      else assert.equal(e.next, null);
    }
}
for (const s of [frames[7], frames[12]]) {
  for (const a of m.NODES) {
    const distances = m.bfs(s.links, a);
    for (const z of m.NODES) {
      const r = m.trace(s, a, z);
      assert.equal(s.tables[a][z].cost, distances[z]);
      assert.ok(r.reached);
      assert.equal(r.path.length - 1, distances[z]);
    }
  }
  assert.deepEqual(m.broadcast(s).tables, s.tables);
}
const s4 = frames[4].changes.filter(
  (c) => c.receiver === "D" && c.dest === "C",
);
assert.deepEqual(
  s4.map((c) => c.entry),
  [
    { cost: 3, next: "A" },
    { cost: 2, next: "E" },
  ],
);
assert.equal(m.trace(frames[8], "D", "B").reached, false);
assert.deepEqual(m.update({ cost: 2, next: "A" }, "A", 4).entry, {
  cost: 5,
  next: "A",
});
// Incoming vectors really are frozen before any delivery in the same event.
const frozen = m.step(m.initial(), {
  id: "test",
  title: "copies",
  deliveries: [
    ["A", "B"],
    ["B", "C"],
  ],
});
assert.equal(frozen.messages[1].vector.D, Infinity);
assert.throws(() =>
  m.step(frames[8], { id: "bad", title: "bad", deliveries: [["A", "B"]] }),
);
const variantLinks = m.LINKS.filter(([a, b]) => !(a === "B" && b === "E"));
let variant = m.initial(variantLinks);
for (let i = 0; i < 5; i++) variant = m.broadcast(variant);
for (const a of m.NODES)
  for (const z of m.NODES) {
    assert.equal(variant.tables[a][z].cost, m.bfs(variantLinks, a)[z]);
    assert.ok(m.trace(variant, a, z).reached);
  }
console.log(
  "Bellman guide: all 13 source tables, frozen messages, failure, BFS, paths and transfer verified",
);
