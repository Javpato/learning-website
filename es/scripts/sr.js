// SM-2 spaced repetition. Pure functions, no DOM, no storage.

const MS_PER_DAY = 86_400_000;

function todayDayNumber() {
  return Math.floor(Date.now() / MS_PER_DAY);
}

export function newCardState() {
  return {
    ef: 2.5,
    interval: 0,       // in days
    repetitions: 0,
    dueDay: todayDayNumber(),  // due today on first creation
  };
}

// quality: 0..5 (we use 1=Again, 3=Hard, 4=Good, 5=Easy)
export function review(state, quality) {
  const s = { ...state };

  if (quality < 3) {
    s.repetitions = 0;
    s.interval = 1;
  } else {
    s.repetitions += 1;
    if (s.repetitions === 1)      s.interval = 1;
    else if (s.repetitions === 2) s.interval = 6;
    else                          s.interval = Math.round(s.interval * s.ef);
  }

  s.ef = Math.max(
    1.3,
    s.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  s.dueDay = todayDayNumber() + s.interval;
  return s;
}

export function isDue(state) {
  return state.dueDay <= todayDayNumber();
}

export function daysUntilDue(state) {
  return state.dueDay - todayDayNumber();
}

// Build per-card state for an array of items, merging in any saved progress.
export function ensureStates(items, savedMap) {
  const out = { ...savedMap };
  for (const it of items) {
    if (!out[it.id]) out[it.id] = newCardState();
  }
  // Drop any orphan ids (items removed from the deck since last save).
  for (const id of Object.keys(out)) {
    if (!items.find((it) => it.id === id)) delete out[id];
  }
  return out;
}

// Pick the next card to study. Prefer due cards (oldest dueDay first), then unseen,
// then the soonest upcoming card if nothing else is due.
export function pickNext(items, stateMap) {
  const due = items
    .filter((it) => isDue(stateMap[it.id]))
    .sort((a, b) => stateMap[a.id].dueDay - stateMap[b.id].dueDay);
  if (due.length) return { card: due[0], dueCount: due.length, mode: "due" };

  // Nothing due today: surface the soonest upcoming card so user can review ahead.
  const sorted = [...items].sort((a, b) => stateMap[a.id].dueDay - stateMap[b.id].dueDay);
  return { card: sorted[0], dueCount: 0, mode: "ahead" };
}

export function dueCount(items, stateMap) {
  return items.filter((it) => isDue(stateMap[it.id])).length;
}
