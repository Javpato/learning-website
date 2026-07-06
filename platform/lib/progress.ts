// Client-only progress store for the Python course. Persists which units the
// learner has completed in the browser's localStorage — no account, no backend
// (matches the static-site model). It's per-browser by design: same computer +
// same site = same progress; it does not sync across devices.

const KEY = "python-progress-v1";
const EVENT = "python-progress-change";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : []);
  } catch {
    return new Set();
  }
}

function write(set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* storage full / disabled — progress is best-effort */
  }
  // Notify subscribers in this tab (the native "storage" event only fires in others).
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getCompleted(): Set<string> {
  return read();
}

export function isDone(slug: string): boolean {
  return read().has(slug);
}

export function setDone(slug: string, done: boolean) {
  const set = read();
  if (done) set.add(slug);
  else set.delete(slug);
  write(set);
}

export function toggle(slug: string): boolean {
  const set = read();
  const now = !set.has(slug);
  if (now) set.add(slug);
  else set.delete(slug);
  write(set);
  return now;
}

/** Subscribe to any change (this tab or another). Returns an unsubscribe fn. */
export function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}
