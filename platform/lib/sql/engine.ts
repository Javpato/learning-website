// Client-only SQLite runner. Wraps the official sql.js Web Worker so that all
// query execution happens off the main thread, sandboxed and interruptible:
//
//   * Security/robustness — a learner can type ANY SQL (that is the point). It
//     runs against a throwaway in-memory database in their own browser, so a
//     destructive query only affects their tab and is wiped on reload. Running
//     in a Worker means a runaway query (e.g. a recursive CTE) cannot freeze
//     the page: we race each query against a timeout and TERMINATE the worker
//     if it overruns, then rebuild a fresh seeded database.
//
//   * The worker + .wasm are self-hosted under public/sql/ (no runtime CDN),
//     addressed via NEXT_PUBLIC_BASE_PATH so they resolve under the GitHub
//     Pages basePath.
//
// Never construct a SqlRunner at module scope — `Worker` is browser-only.

import { SEED_SQL } from "./seed";

export type QueryResult = { columns: string[]; values: unknown[][] };
export type ExecOutcome =
  | { ok: true; result: QueryResult | null } // null = statement returned no rows
  | { ok: false; error: string };

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const WORKER_URL = `${BASE}/sql/worker.sql-wasm.js`;
const DEFAULT_TIMEOUT_MS = 5000;

type Pending = {
  resolve: (v: unknown) => void;
  reject: (e: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

export class SqlRunner {
  private worker: Worker | null = null;
  private seq = 1;
  private pending = new Map<number, Pending>();
  ready: Promise<void>;

  constructor() {
    this.ready = this.boot();
  }

  private spawn() {
    const w = new Worker(WORKER_URL);
    w.onmessage = (e: MessageEvent) => {
      const { id, error, results } = e.data ?? {};
      const p = this.pending.get(id);
      if (!p) return;
      clearTimeout(p.timer);
      this.pending.delete(id);
      if (error) p.reject(new Error(error));
      else p.resolve(results);
    };
    w.onerror = (e) => {
      // A worker-level error invalidates every in-flight request.
      this.failAll(new Error(e.message || "SQL worker error"));
    };
    this.worker = w;
  }

  private failAll(err: Error) {
    for (const [, p] of this.pending) {
      clearTimeout(p.timer);
      p.reject(err);
    }
    this.pending.clear();
  }

  // Low-level: send one action to the worker, with a hard timeout that kills
  // the worker (a hung query blocks the worker thread irrecoverably).
  private send(
    action: string,
    payload: Record<string, unknown>,
    timeoutMs: number,
  ): Promise<unknown> {
    if (!this.worker) this.spawn();
    const id = this.seq++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        // Terminate and rebuild: the worker is stuck.
        this.worker?.terminate();
        this.worker = null;
        this.failAll(new Error("timeout"));
        // Re-seed in the background so the next query has a fresh DB.
        this.ready = this.boot();
        reject(
          new Error(
            `Query timed out after ${timeoutMs / 1000}s and was cancelled. ` +
              `(Check for an accidental cross join or runaway recursion.)`,
          ),
        );
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.worker!.postMessage({ id, action, ...payload });
    });
  }

  private async boot(): Promise<void> {
    this.spawn();
    // Open an empty in-memory DB, then load the sample schema + data.
    await this.send("open", {}, DEFAULT_TIMEOUT_MS);
    await this.send("exec", { sql: SEED_SQL }, DEFAULT_TIMEOUT_MS);
  }

  /** Reset the database back to the seeded sample state. */
  async reset(): Promise<void> {
    await this.ready;
    await this.send("exec", { sql: SEED_SQL }, DEFAULT_TIMEOUT_MS);
  }

  /** Run learner SQL. Returns the LAST result set, or null for non-SELECT. */
  async exec(sql: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<ExecOutcome> {
    try {
      await this.ready;
      const results = (await this.send("exec", { sql }, timeoutMs)) as
        | QueryResult[]
        | undefined;
      const last = results && results.length ? results[results.length - 1] : null;
      return { ok: true, result: last ?? null };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  close() {
    this.failAll(new Error("closed"));
    this.worker?.terminate();
    this.worker = null;
  }
}

/** Normalize a result set to a comparable string (for "Check" answers). */
export function resultSignature(r: QueryResult | null): string {
  if (!r) return "∅";
  const cells = r.values.map((row) =>
    row.map((c) => (c === null ? "∅" : String(c))).join(""),
  );
  return cells.join("");
}
