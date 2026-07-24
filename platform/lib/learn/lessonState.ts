// Client-only, per-browser lesson states for the L2 Chimie tracks. Modeled on
// lib/progress.ts (localStorage + same-tab custom event). States are chosen by
// the learner, purely organizational, freely changeable — they NEVER gate
// access to any content.

export const LESSON_STATES = [
  "not-explored",
  "exploring",
  "understood",
  "review-later",
  "favorite",
] as const;
export type LessonState = (typeof LESSON_STATES)[number];

export const LESSON_STATE_LABELS: Record<LessonState, string> = {
  "not-explored": "Pas exploré",
  exploring: "En cours",
  understood: "Compris",
  "review-later": "À revoir",
  favorite: "Favori ⭐",
};

const KEY = "learn-state-v1";
const EVENT = "learn-state-change";

type StateMap = Record<string, LessonState>;

function read(): StateMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const obj = raw ? (JSON.parse(raw) as unknown) : {};
    if (!obj || typeof obj !== "object") return {};
    const out: StateMap = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (typeof v === "string" && (LESSON_STATES as readonly string[]).includes(v)) {
        out[k] = v as LessonState;
      }
    }
    return out;
  } catch {
    return {};
  }
}

function write(map: StateMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* storage full / disabled — states are best-effort */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function getState(id: string): LessonState {
  return read()[id] ?? "not-explored";
}

export function setState(id: string, state: LessonState) {
  const map = read();
  if (state === "not-explored") delete map[id];
  else map[id] = state;
  write(map);
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
