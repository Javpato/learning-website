// Tiny localStorage wrappers. Returns defaults on parse failure or missing keys.

export function get(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage disabled or full — silently no-op so the UI keeps working.
  }
}

export function remove(key) {
  try { localStorage.removeItem(key); } catch {}
}
