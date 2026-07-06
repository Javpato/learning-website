// Pyodide runner Web Worker (hand-written — Pyodide ships no ready-made worker).
//
// Runs learner Python OFF the main thread so a runaway loop can't freeze the
// page: the engine (lib/python/engine.ts) races each run against a timeout and
// TERMINATEs this worker on overrun, then boots a fresh one. See platform/
// CLAUDE.md › Security. All runtime assets are self-hosted next to this file
// (public/pyodide/); nothing is fetched from a CDN.
//
// Protocol
//   main → worker : { type: "run", id, code, stdin }   (stdin: string[])
//   worker → main : { type: "ready" }                  once Pyodide has loaded
//                   { type: "result", id, stdout, error }
//                   { type: "fatal", error }            if Pyodide fails to load

// Resolve our own directory so both dev (/pyodide/) and the GitHub Pages
// subpath (/learning-website/platform/pyodide/) work with no build-time config.
const HERE = self.location.href.replace(/[^/]*$/, "");
importScripts(HERE + "pyodide.js");

// A Python harness that runs the learner's source in a FRESH namespace with
// stdout/stderr captured and input() fed from a preset list — never touching
// the real streams, and never throwing back into JS (a Python error is returned
// as a formatted traceback string instead).
const HARNESS = `
import sys, io, builtins, traceback

def __run__(src, stdin_lines):
    buf = io.StringIO()
    old_out, old_err, old_in = sys.stdout, sys.stderr, builtins.input
    lines = iter(list(stdin_lines) if stdin_lines is not None else [])

    def _input(prompt=""):
        # Match real input(): write the prompt to stdout (no newline), return
        # the next preset line WITHOUT echoing it (echo is a terminal behaviour,
        # not Python's). Exhausted input raises EOFError, like a real EOF.
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
        # Hide our harness frames: show only the traceback below <tu-codigo>.
        err = traceback.format_exc()
    finally:
        sys.stdout, sys.stderr, builtins.input = old_out, old_err, old_in
    return buf.getvalue(), err
`;

let runFn = null;

const ready = (async () => {
  const pyodide = await loadPyodide({ indexURL: HERE });
  await pyodide.runPythonAsync(HARNESS);
  runFn = pyodide.globals.get("__run__");
  self.postMessage({ type: "ready" });
  return pyodide;
})().catch((e) => {
  self.postMessage({ type: "fatal", error: String((e && e.message) || e) });
  throw e;
});

self.onmessage = async (e) => {
  const msg = e.data || {};
  if (msg.type !== "run") return;
  const { id, code, stdin } = msg;
  try {
    await ready;
    // runFn returns a Python tuple (stdout, error|None); convert to JS.
    const res = runFn(code, stdin ?? []);
    const [stdout, error] = res.toJs();
    res.destroy();
    self.postMessage({ type: "result", id, stdout, error: error ?? null });
  } catch (err) {
    self.postMessage({
      type: "result",
      id,
      stdout: "",
      error: String((err && err.message) || err),
    });
  }
};
