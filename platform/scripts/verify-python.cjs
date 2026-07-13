// Verifies every checkable Python-course exercise against REAL Pyodide (Node) —
// the analog of verify-sql.cjs. It walks every content.es.mdx under the Python
// course, pairs each <PyExercise expected_output=…> with the reference solution
// authored just above it in an MDX comment:
//
//     {/* sol:
//     print("¡Hola, mundo!")
//     */}
//     <PyExercise task="…" expected_output="¡Hola, mundo!" />
//
// then runs the solution (feeding any stdin) under the SAME harness the browser
// worker uses, and asserts its stdout matches expected_output. This guarantees
// every exercise is solvable and its expected output is exactly right.
//
//   node scripts/verify-python.cjs   (or: npm run verify:python)
const fs = require("fs");
const path = require("path");
const { loadPyodide } = require("pyodide");

const ROOT = path.join(__dirname, "..");
const PY_DIR = path.join(ROOT, "app", "[locale]", "cs", "python");

// Same harness as public/pyodide/worker.js (kept in sync by hand).
const HARNESS = `
import sys, io, builtins, traceback

def __run__(src, stdin_lines):
    buf = io.StringIO()
    old_out, old_err, old_in = sys.stdout, sys.stderr, builtins.input
    lines = iter(list(stdin_lines) if stdin_lines is not None else [])
    def _input(prompt=""):
        buf.write(str(prompt))
        try:
            return next(lines)
        except StopIteration:
            raise EOFError("EOF when reading a line")
    sys.stdout = buf
    sys.stderr = buf
    builtins.input = _input
    err = None
    try:
        exec(compile(src, "<tu-codigo>", "exec"), {"__name__": "__main__"})
    except SystemExit:
        pass
    except BaseException:
        err = traceback.format_exc()
    finally:
        sys.stdout, sys.stderr, builtins.input = old_out, old_err, old_in
    return buf.getvalue(), err
`;

// Same normalization as lib/python/engine.ts › sameOutput.
function sameOutput(actual, expected) {
  const norm = (s) =>
    s
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((l) => l.replace(/\s+$/, ""))
      .join("\n")
      .replace(/\n+$/, "");
  return norm(actual) === norm(expected);
}

// Every locale is checked: each content.<locale>.mdx is self-contained (its
// sol: blocks, exercise code and expected_output are translated together), so
// translated exercises must run and match their expected_output just like ES.
const CONTENT_RE = /^content\.(es|en|fr)\.mdx$/;
function findContentFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findContentFiles(p));
    else if (CONTENT_RE.test(entry.name)) out.push(p);
  }
  return out;
}

// Pull the value of a JSX attribute in either the "…" or {`…`} form.
function attr(block, name) {
  let m = block.match(new RegExp(name + "=\\{`([\\s\\S]*?)`\\}"));
  if (m) return m[1];
  m = block.match(new RegExp(name + '="([^"]*)"'));
  return m ? m[1] : undefined;
}

// Extract every exercise + its preceding `sol:` block from one MDX file.
function extractCases(file, src) {
  const sols = [];
  const solRe = /\{\/\*\s*sol:\s*([\s\S]*?)\*\/\}/g;
  let m;
  while ((m = solRe.exec(src))) sols.push({ index: m.index, code: m[1].replace(/^\n/, "") });

  const cases = [];
  const exRe = /<PyExercise\b[\s\S]*?\/>/g;
  while ((m = exRe.exec(src))) {
    const block = m[0];
    const expected = attr(block, "expected_output");
    if (expected === undefined) continue; // free-run exercise: nothing to check
    const sol = [...sols].reverse().find((s) => s.index < m.index);
    const rel = path.relative(PY_DIR, file);
    if (!sol) {
      cases.push({ file: rel, index: m.index, missing: true });
      continue;
    }
    let stdin = [];
    const stdinRaw = block.match(/stdin=\{(\[[\s\S]*?\])\}/);
    if (stdinRaw) {
      try {
        stdin = JSON.parse(stdinRaw[1]);
      } catch {
        stdin = stdinRaw[1]
          .replace(/[[\]\s]/g, "")
          .split(",")
          .filter(Boolean)
          .map((s) => s.replace(/^["']|["']$/g, ""));
      }
    }
    cases.push({ file: rel, code: sol.code, stdin, expected });
  }
  return cases;
}

(async () => {
  const files = fs.existsSync(PY_DIR) ? findContentFiles(PY_DIR) : [];
  const cases = files.flatMap((f) => extractCases(f, fs.readFileSync(f, "utf8")));
  if (!cases.length) {
    console.log("No checkable exercises found.");
    return;
  }

  const pyodide = await loadPyodide({
    indexURL: path.dirname(require.resolve("pyodide/package.json")),
  });
  await pyodide.runPythonAsync(HARNESS);
  const run = pyodide.globals.get("__run__");

  let failures = 0;
  let checked = 0;
  for (const c of cases) {
    if (c.missing) {
      failures++;
      console.error(`✗ ${c.file} @${c.index}: <PyExercise> has expected_output but no {/* sol: */} above it`);
      continue;
    }
    checked++;
    const res = run(c.code, c.stdin);
    const [stdout, error] = res.toJs();
    res.destroy();
    if (error) {
      failures++;
      console.error(`✗ ${c.file}: solution raised:\n${error}`);
    } else if (!sameOutput(stdout, c.expected)) {
      failures++;
      console.error(
        `✗ ${c.file}: output mismatch\n  expected: ${JSON.stringify(c.expected)}\n  got:      ${JSON.stringify(stdout)}`,
      );
    }
  }
  run.destroy();

  if (failures) {
    console.error(`\n${failures} check(s) failed (${checked} ran across ${files.length} files).`);
    process.exit(1);
  }
  console.log(`All ${checked} exercise checks passed across ${files.length} files.`);
})();
