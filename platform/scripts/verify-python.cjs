// Verifies the Python-course runner semantics against REAL Pyodide (Node), the
// analog of verify-sql.cjs. It boots Pyodide, loads the exact harness used by
// public/pyodide/worker.js, and asserts that reference solutions to the
// checkable exercises produce precisely the `expected_output` embedded in the
// MDX — catching any drift between the lesson and how CPython actually behaves
// (print spacing, input() prompt-without-echo, int() conversion, while output).
//
//   node scripts/verify-python.cjs
const path = require("path");
const { loadPyodide } = require("pyodide");

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

// Reference solution + the expected_output copied from each checkable exercise.
const CASES = [
  {
    name: "01 · print ¡Hola, mundo!",
    code: `print("¡Hola, mundo!")`,
    expected: "¡Hola, mundo!",
  },
  {
    name: "01 · variables + print spacing",
    code: `lenguaje = "Python"\nprint("Estoy aprendiendo", lenguaje)`,
    expected: "Estoy aprendiendo Python",
  },
  {
    name: "01 · input() prompt without echo",
    code: `nombre = input("¿Cómo te llamas? ")\nprint("¡Hola, " + nombre + "!")`,
    stdin: ["Ana"],
    expected: "¿Cómo te llamas? ¡Hola, Ana!",
  },
  {
    name: "01 · int(input()) arithmetic",
    code: `n = int(input("Dame un número: "))\nprint(n * 2)`,
    stdin: ["8"],
    expected: "Dame un número: 16",
  },
  {
    name: "01 · if/else",
    code: `edad = 20\nif edad >= 18:\n    print("Mayor de edad")\nelse:\n    print("Menor de edad")`,
    expected: "Mayor de edad",
  },
  {
    name: "01 · while 1..5",
    code: `i = 1\nwhile i <= 5:\n    print(i)\n    i += 1`,
    expected: "1\n2\n3\n4\n5",
  },
];

(async () => {
  const pyodide = await loadPyodide({
    indexURL: path.dirname(require.resolve("pyodide/package.json")),
  });
  await pyodide.runPythonAsync(HARNESS);
  const run = pyodide.globals.get("__run__");

  let failures = 0;

  for (const c of CASES) {
    const res = run(c.code, c.stdin ?? []);
    const [stdout, error] = res.toJs();
    res.destroy();
    if (error) {
      failures++;
      console.error(`✗ ${c.name}\n  raised:\n${error}`);
    } else if (!sameOutput(stdout, c.expected)) {
      failures++;
      console.error(
        `✗ ${c.name}\n  expected: ${JSON.stringify(c.expected)}\n  got:      ${JSON.stringify(stdout)}`,
      );
    } else {
      console.log(`✓ ${c.name}`);
    }
  }

  // A Python error must be RETURNED as a traceback, never thrown to JS.
  {
    const res = run(`print(1 / 0)`, []);
    const [stdout, error] = res.toJs();
    res.destroy();
    if (error && /ZeroDivisionError/.test(error) && stdout === "") {
      console.log("✓ error path · ZeroDivisionError returned as traceback");
    } else {
      failures++;
      console.error(`✗ error path · expected a ZeroDivisionError traceback, got`, { stdout, error });
    }
  }

  run.destroy();
  if (failures) {
    console.error(`\n${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${CASES.length + 1} checks passed.`);
})();
