"use client";

// Interactive Python exercise. Renders a task, an editable code box, and a
// terminal-styled output pane backed by real in-browser CPython (Pyodide — see
// lib/python/engine.ts). Counterpart of components/cs/SqlExercise.tsx.
//
// Security note: captured stdout and every error string are rendered as React
// text (auto-escaped) — never via dangerouslySetInnerHTML — so program output
// can never inject markup. See platform/CLAUDE.md › Security.

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PyRunner, sameOutput } from "@/lib/python/engine";

// Cap rendered output so a `while True: print(...)` that slips under the time
// budget can't blow up the DOM.
const OUTPUT_CAP = 20000;

type Verdict = "correct" | "wrong" | null;

export function PyExercise({
  task,
  starter = "",
  expected_output,
  stdin,
  hint,
}: {
  task: ReactNode;
  starter?: string;
  /** Expected captured stdout; when set, enables the "Check" button. */
  expected_output?: string;
  /** Lines fed to input() in order (one per call). */
  stdin?: string[];
  hint?: ReactNode;
}) {
  const runnerRef = useRef<PyRunner | null>(null);
  const [code, setCode] = useState(starter);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [booting, setBooting] = useState(true);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const runner = new PyRunner();
    runnerRef.current = runner;
    runner.ready.then(
      () => setBooting(false),
      () => setBooting(false), // a load failure surfaces on the first Run
    );
    return () => runner.close();
  }, []);

  function present(outcome: Awaited<ReturnType<PyRunner["exec"]>>) {
    if (outcome.ok) {
      setError(null);
      setOutput(outcome.stdout);
      setMessage(
        outcome.stdout.length === 0 ? "El programa no imprimió nada." : null,
      );
    } else {
      setOutput(null);
      setMessage(null);
      setError(outcome.error);
    }
  }

  async function run() {
    const runner = runnerRef.current;
    if (!runner || busy || !code.trim()) return;
    setBusy(true);
    setVerdict(null);
    present(await runner.exec(code, { stdin }));
    setBusy(false);
  }

  async function check() {
    const runner = runnerRef.current;
    if (!runner || busy || expected_output === undefined || !code.trim()) return;
    setBusy(true);
    setVerdict(null);
    const mine = await runner.exec(code, { stdin });
    present(mine);
    setVerdict(mine.ok && sameOutput(mine.stdout, expected_output) ? "correct" : "wrong");
    setBusy(false);
  }

  function reset() {
    if (busy) return;
    setCode(starter);
    setOutput(null);
    setError(null);
    setMessage(null);
    setVerdict(null);
  }

  const shown = output === null ? null : output.slice(0, OUTPUT_CAP);
  const truncated = output !== null && output.length > OUTPUT_CAP;

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border bg-bg-elevated">
      <div className="border-b border-border bg-bg-elevated-2 px-4 py-3 text-sm text-fg">
        <span className="mr-2 font-mono text-xs uppercase tracking-wide text-accent-warm">
          Ejercicio
        </span>
        {task}
      </div>

      <textarea
        className="block w-full resize-y bg-transparent px-4 py-3 font-mono text-sm leading-relaxed text-fg outline-none"
        rows={Math.max(4, code.split("\n").length)}
        value={code}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Escribe tu código Python aquí…"
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            void run();
          }
        }}
      />

      <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2">
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy || booting}
          className="rounded bg-accent px-3 py-1 text-sm font-medium text-[#0e1116] disabled:opacity-50"
        >
          {booting ? "Cargando Python…" : busy ? "Ejecutando…" : "Ejecutar ▸"}
        </button>
        {expected_output !== undefined && (
          <button
            type="button"
            onClick={() => void check()}
            disabled={busy || booting}
            className="rounded border border-border-strong px-3 py-1 text-sm text-fg disabled:opacity-50"
          >
            Comprobar
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          disabled={busy}
          className="rounded px-3 py-1 text-sm text-fg-muted hover:text-fg disabled:opacity-50"
        >
          Reiniciar
        </button>
        {hint && (
          <button
            type="button"
            onClick={() => setShowHint((s) => !s)}
            className="ml-auto rounded px-3 py-1 text-sm text-fg-muted hover:text-fg"
          >
            {showHint ? "Ocultar pista" : "Pista"}
          </button>
        )}
        <span className="font-mono text-xs text-fg-muted">⌘/Ctrl+↵</span>
      </div>

      {showHint && hint && (
        <div className="border-t border-border px-4 py-2 text-sm text-fg-muted">{hint}</div>
      )}

      {verdict && (
        <div
          className={`border-t border-border px-4 py-2 text-sm font-medium ${
            verdict === "correct" ? "text-[#3fb950]" : "text-danger"
          }`}
        >
          {verdict === "correct"
            ? "✓ ¡Correcto! La salida coincide con lo esperado."
            : "✗ Todavía no — la salida no coincide. Sigue intentándolo."}
        </div>
      )}

      {error && (
        <div className="border-t border-border px-4 py-3 font-mono text-sm whitespace-pre-wrap text-danger">
          {error}
        </div>
      )}

      {shown !== null && (
        <div className="border-t border-border">
          <div className="max-h-80 overflow-auto bg-[#0b0e13] px-4 py-3 font-mono text-sm leading-relaxed text-fg">
            {shown.length === 0 ? (
              <span className="italic text-fg-muted">— sin salida —</span>
            ) : (
              <pre className="whitespace-pre-wrap break-words">{shown}</pre>
            )}
          </div>
        </div>
      )}

      {(message || truncated) && (
        <div className="border-t border-border px-4 py-2 text-xs text-fg-muted">
          {message}
          {truncated && ` Salida recortada a ${OUTPUT_CAP} caracteres.`}
        </div>
      )}
    </div>
  );
}
