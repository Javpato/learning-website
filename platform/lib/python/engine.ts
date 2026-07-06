// Client-only Python runner. Wraps the Pyodide Web Worker (public/pyodide/
// worker.js) so that all execution happens off the main thread, sandboxed and
// interruptible — the exact counterpart of lib/sql/engine.ts for the SQL course:
//
//   * Security/robustness — a learner can run ANY Python (that is the point). It
//     runs in a throwaway namespace inside a Worker in their own browser. A
//     runaway loop cannot freeze the page: we race each run against a timeout
//     and TERMINATE the worker if it overruns, then boot a fresh Pyodide.
//
//   * The worker + Pyodide runtime are self-hosted under public/pyodide/ (no
//     runtime CDN), addressed via NEXT_PUBLIC_BASE_PATH so they resolve under
//     the GitHub Pages basePath.
//
// Never construct a PyRunner at module scope — `Worker` is browser-only.

export type ExecOutcome =
  | { ok: true; stdout: string } // Python printed output (stderr folded in)
  | { ok: false; error: string }; // a Python traceback or an engine error

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const WORKER_URL = `${BASE}/pyodide/worker.js`;
// Per-RUN budget (boot time is awaited separately and not charged here). Plain
// beginner snippets finish in well under a second; this only catches runaways.
const DEFAULT_TIMEOUT_MS = 10000;

type Pending = {
  resolve: (v: ExecOutcome) => void;
  timer: ReturnType<typeof setTimeout>;
};

export class PyRunner {
  private worker: Worker | null = null;
  private seq = 1;
  private pending = new Map<number, Pending>();
  private readyResolve: (() => void) | null = null;
  private readyReject: ((e: Error) => void) | null = null;
  /** Resolves once Pyodide has finished loading in the worker. */
  ready: Promise<void>;

  constructor() {
    this.ready = this.boot();
  }

  private spawn() {
    const w = new Worker(WORKER_URL);
    w.onmessage = (e: MessageEvent) => {
      const msg = e.data ?? {};
      if (msg.type === "ready") {
        this.readyResolve?.();
        return;
      }
      if (msg.type === "fatal") {
        this.readyReject?.(new Error(msg.error || "Pyodide failed to load"));
        return;
      }
      if (msg.type === "result") {
        const p = this.pending.get(msg.id);
        if (!p) return;
        clearTimeout(p.timer);
        this.pending.delete(msg.id);
        p.resolve(
          msg.error
            ? { ok: false, error: String(msg.error) }
            : { ok: true, stdout: String(msg.stdout ?? "") },
        );
      }
    };
    w.onerror = (e) => {
      this.readyReject?.(new Error(e.message || "Python worker error"));
      this.failAll("The Python worker crashed. Try running again.");
    };
    this.worker = w;
  }

  private failAll(error: string) {
    for (const [, p] of this.pending) {
      clearTimeout(p.timer);
      p.resolve({ ok: false, error });
    }
    this.pending.clear();
  }

  private boot(): Promise<void> {
    this.spawn();
    return new Promise<void>((resolve, reject) => {
      this.readyResolve = resolve;
      this.readyReject = reject;
    });
  }

  /** Run learner Python. Returns captured stdout, or a traceback string. */
  async exec(
    code: string,
    opts: { stdin?: string[]; timeoutMs?: number } = {},
  ): Promise<ExecOutcome> {
    const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    try {
      await this.ready;
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
    if (!this.worker) this.spawn();
    const id = this.seq++;
    return new Promise<ExecOutcome>((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        // The worker is stuck in the learner's code — terminate and rebuild.
        this.worker?.terminate();
        this.worker = null;
        this.failAll("timeout");
        this.ready = this.boot();
        resolve({
          ok: false,
          error:
            `Se agotó el tiempo (${timeoutMs / 1000}s) y se detuvo la ejecución. ` +
            `¿Hay un bucle infinito? (por ejemplo, un while que nunca termina).`,
        });
      }, timeoutMs);
      this.pending.set(id, { resolve, timer });
      this.worker!.postMessage({ type: "run", id, code, stdin: opts.stdin ?? [] });
    });
  }

  /** No persistent state survives a run (fresh namespace each time), so reset
   *  is a no-op kept for API symmetry with the editor's "Reset" control. */
  async reset(): Promise<void> {
    await this.ready.catch(() => {});
  }

  close() {
    this.failAll("closed");
    this.worker?.terminate();
    this.worker = null;
  }
}

/** Compare captured output to an expected string, tolerant of trailing
 *  whitespace: right-strip every line and drop trailing blank lines. */
export function sameOutput(actual: string, expected: string): boolean {
  const norm = (s: string) =>
    s
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.replace(/\s+$/, ""))
      .join("\n")
      .replace(/\n+$/, "");
  return norm(actual) === norm(expected);
}
