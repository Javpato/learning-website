import { exercises } from "../data/chinese.js";
import { get, set, remove } from "./storage.js";
import { normalizePinyin, toNumeric } from "./pinyin-utils.js";
import { mountPinyinKeyboard } from "./pinyin-keyboard.js";

const SCORE_KEY   = "lw.chinese.exercises.score";    // { correct, total }
const RESULTS_KEY = "lw.chinese.exercises.results";  // { [exId]: "correct" | "incorrect" | "shown" }
const POS_KEY     = "lw.chinese.exercises.pos";      // index inside the active filter view
const FILTER_KEY  = "lw.chinese.exercises.filter";   // "all" | "translate" | "recognize" | "pinyin" | "syntax"

const TYPE_LABELS = {
  translate: "Traduce al chino",
  recognize: "Elige el significado",
  pinyin:    "Escribe el pinyin",
  syntax:    "Construye la frase",
};

const FILTERS = [
  { id: "all",       label: "Todos" },
  { id: "translate", label: "Traducir" },
  { id: "recognize", label: "Reconocer" },
  { id: "pinyin",    label: "Pinyin" },
  { id: "syntax",    label: "Sintaxis" },
];

// ----- DOM refs (page-level only — per-type widgets live inside #exercise-stage) -----
const promptHeaderEl = document.getElementById("prompt-header");
const promptEl       = document.getElementById("english-prompt");
const stageEl        = document.getElementById("exercise-stage");
const feedbackEl     = document.getElementById("feedback");
const scoreEl        = document.getElementById("score");
const totalEl        = document.getElementById("total");
const qposEl         = document.getElementById("qpos");
const resetBtn       = document.getElementById("reset-btn");
const nextBtn        = document.getElementById("next-btn");
const prevBtn        = document.getElementById("prev-btn");
const filterRowEl    = document.getElementById("filter-row");

// ----- Persistent state -----
let results = get(RESULTS_KEY, {});
let filter  = get(FILTER_KEY, "all");
let pos     = clampPos(get(POS_KEY, 0));

// Active mount returned by the renderer's mount() — holds { validate, showAnswer, dispose? }
let activeWidget = null;

function getView() {
  if (filter === "all") return exercises;
  return exercises.filter((ex) => (ex.type ?? "translate") === filter);
}

function clampPos(n) {
  const view = getView();
  if (!view.length) return 0;
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(view.length - 1, n));
}

function currentExercise() {
  const view = getView();
  return view[clampPos(pos)] ?? null;
}

// ----- Scoreboard / position display -----
function renderScore() {
  const correct = Object.values(results).filter((v) => v === "correct").length;
  scoreEl.textContent = correct;
  totalEl.textContent = exercises.length;
  const view = getView();
  const total = view.length || 0;
  const human = total ? `Pregunta ${clampPos(pos) + 1} de ${total}` : "No hay ejercicios en este filtro";
  qposEl.textContent = human;
  set(SCORE_KEY, { correct, total: exercises.length });
}

// ----- Feedback panel (shared across types) -----
function clearFeedback() {
  feedbackEl.className = "exercise-feedback";
  feedbackEl.innerHTML = "";
}

function showFeedback(kind, ex) {
  const verdict = {
    correct:   "Correcto.",
    incorrect: "No del todo.",
    shown:     "Respuesta revelada.",
  }[kind];
  const cls = kind === "shown" ? "reveal" : kind;
  feedbackEl.className = `exercise-feedback show ${cls}`;
  const tags = (ex.grammarTested || []).map((g) => `<span>${escapeHtml(g)}</span>`).join("");
  const numeric = (ex.type === "pinyin" && ex.pinyin) ? `<div class="answer-py-num">(${escapeHtml(toNumeric(ex.pinyin))})</div>` : "";
  feedbackEl.innerHTML = `
    <div class="verdict">${verdict}</div>
    <div class="answer-zh">${escapeHtml(ex.chinese)}</div>
    <div class="answer-py">${escapeHtml(ex.pinyin || "")}</div>
    ${numeric}
    <div class="grammar-tags">${tags}</div>
  `;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

// ----- Tiny seeded shuffle so revisits show the same order -----
function seededShuffle(arr, seed) {
  const out = arr.slice();
  let s = 0;
  for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ============================================================================
// Renderers
// ============================================================================

const RENDERERS = {

  // ---------- translate (existing behavior) ----------
  translate: {
    mount(ex, host) {
      host.innerHTML = `
        <div class="answer-row">
          <input type="text" class="answer-input" placeholder="输入中文…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
          <button class="btn btn-accent" data-action="check" type="button">Comprobar</button>
          <button class="btn btn-ghost" data-action="show" type="button">Mostrar</button>
        </div>
      `;
      const input = host.querySelector(".answer-input");
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); commitCheck(); }
      });
      host.querySelector("[data-action=check]").addEventListener("click", commitCheck);
      host.querySelector("[data-action=show]").addEventListener("click", commitShow);
      input.focus();
      return {
        validate() {
          const guess = normalizeText(input.value);
          if (!guess) return null;
          return { ok: guess === normalizeText(ex.chinese), userAnswer: input.value };
        },
        showAnswer() { input.disabled = true; },
        lock() { input.disabled = true; },
      };
    },
  },

  // ---------- recognize (multiple choice ZH→EN) ----------
  recognize: {
    mount(ex, host) {
      const choices = ex.choices && ex.choices.length ? ex.choices : autoChoices(ex);
      const shuffled = seededShuffle(choices, ex.id);
      host.innerHTML = `
        <div class="recognize-prompt">
          <div class="hanzi">${escapeHtml(ex.chinese)}</div>
          <div class="pinyin-hint">${escapeHtml(ex.pinyin || "")}</div>
        </div>
        <div class="mc-options"></div>
        <div class="answer-row">
          <button class="btn btn-ghost" data-action="show" type="button">Mostrar</button>
        </div>
      `;
      const optsEl = host.querySelector(".mc-options");
      let chosen = null;
      let locked = false;
      shuffled.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mc-option";
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          if (locked) return;
          chosen = opt;
          optsEl.querySelectorAll(".mc-option").forEach((b) => b.classList.remove("chosen"));
          btn.classList.add("chosen");
          commitCheck();
        });
        optsEl.appendChild(btn);
      });
      host.querySelector("[data-action=show]").addEventListener("click", commitShow);
      return {
        validate() {
          if (chosen == null) return null;
          return { ok: chosen === ex.english, userAnswer: chosen };
        },
        showAnswer() { revealOptions(); },
        lock() { revealOptions(); },
      };
      function revealOptions() {
        locked = true;
        optsEl.querySelectorAll(".mc-option").forEach((b) => {
          b.disabled = true;
          if (b.textContent === ex.english) b.classList.add("correct");
          else if (b.classList.contains("chosen")) b.classList.add("incorrect");
        });
      }
    },
  },

  // ---------- pinyin (ZH → pinyin with tones) ----------
  pinyin: {
    mount(ex, host) {
      host.innerHTML = `
        <div class="pinyin-prompt">
          <div class="hanzi">${escapeHtml(ex.chinese)}</div>
          <div class="english-hint">${escapeHtml(ex.english || "")}</div>
        </div>
        <div class="answer-row">
          <input type="text" class="answer-input pinyin-input" placeholder="escribe pinyin (ā á ǎ à o wo3)…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
          <button class="btn btn-accent" data-action="check" type="button">Comprobar</button>
          <button class="btn btn-ghost" data-action="show" type="button">Mostrar</button>
        </div>
        <div class="tone-keyboard-mount"></div>
        <div class="pinyin-hint-line">Consejo: escribe los números de tono como <code>wo3</code> o haz clic en una vocal con tono abajo.</div>
      `;
      const input = host.querySelector(".pinyin-input");
      const kbHost = host.querySelector(".tone-keyboard-mount");
      mountPinyinKeyboard(input, kbHost);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); commitCheck(); }
      });
      host.querySelector("[data-action=check]").addEventListener("click", commitCheck);
      host.querySelector("[data-action=show]").addEventListener("click", commitShow);
      input.focus();
      return {
        validate() {
          const guess = input.value.trim();
          if (!guess) return null;
          return { ok: normalizePinyin(guess) === normalizePinyin(ex.pinyin), userAnswer: input.value };
        },
        showAnswer() { input.disabled = true; },
        lock() { input.disabled = true; },
      };
    },
  },

  // ---------- syntax (token-build) ----------
  syntax: {
    mount(ex, host) {
      const tokens = ex.tokens || [];
      const order = seededShuffle(tokens.map((tok, idx) => ({ tok, idx })), ex.id);
      const placed = [];
      const banked = order.map(() => true);
      host.innerHTML = `
        <div class="syntax-tokens">
          <div class="syntax-build" aria-label="Frase"></div>
          <div class="syntax-bank-label">Fichas:</div>
          <div class="syntax-bank"></div>
        </div>
        <div class="answer-row">
          <button class="btn btn-accent" data-action="check" type="button">Comprobar</button>
          <button class="btn btn-ghost" data-action="show" type="button">Mostrar</button>
          <button class="btn btn-ghost" data-action="reset" type="button">Reiniciar fichas</button>
        </div>
      `;
      const bankEl  = host.querySelector(".syntax-bank");
      const buildEl = host.querySelector(".syntax-build");

      function paint() {
        bankEl.innerHTML = "";
        order.forEach((slot, i) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "token";
          btn.textContent = slot.tok;
          if (!banked[i]) btn.classList.add("used");
          btn.disabled = !banked[i];
          btn.addEventListener("click", () => {
            if (!banked[i]) return;
            banked[i] = false;
            placed.push(i);
            paint();
          });
          bankEl.appendChild(btn);
        });
        buildEl.innerHTML = "";
        placed.forEach((bankIdx, position) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "token placed";
          btn.textContent = order[bankIdx].tok;
          btn.addEventListener("click", () => {
            placed.splice(position, 1);
            banked[bankIdx] = true;
            paint();
          });
          buildEl.appendChild(btn);
        });
        if (!placed.length) {
          const ph = document.createElement("span");
          ph.className = "syntax-placeholder";
          ph.textContent = "Haz clic en las fichas de abajo para construir la frase.";
          buildEl.appendChild(ph);
        }
      }
      paint();

      host.querySelector("[data-action=check]").addEventListener("click", commitCheck);
      host.querySelector("[data-action=show]").addEventListener("click", commitShow);
      host.querySelector("[data-action=reset]").addEventListener("click", () => {
        placed.length = 0;
        for (let i = 0; i < banked.length; i++) banked[i] = true;
        paint();
      });
      return {
        validate() {
          if (!placed.length) return null;
          const built = placed.map((i) => order[i].tok).join("");
          const target = tokens.join("");
          return { ok: normalizeText(built) === normalizeText(target), userAnswer: built };
        },
        showAnswer() {
          // Auto-arrange in correct order so the user can see the right answer.
          placed.length = 0;
          for (let i = 0; i < banked.length; i++) banked[i] = false;
          // Walk tokens in target order and pick from the bank.
          const remaining = order.map((s) => ({ ...s, used: false }));
          tokens.forEach((tok) => {
            const idx = remaining.findIndex((s) => !s.used && s.tok === tok);
            if (idx >= 0) {
              remaining[idx].used = true;
              placed.push(remaining[idx].idx);
            }
          });
          paint();
        },
        lock() {/* no-op */},
      };
    },
  },
};

// ----- Auto-distractors for recognize when `choices` is omitted -----
function autoChoices(ex) {
  const pool = exercises
    .filter((e) => e.id !== ex.id && e.english)
    .map((e) => e.english);
  const distractors = [];
  for (let i = 0; i < pool.length && distractors.length < 3; i++) {
    const cand = pool[(i * 7) % pool.length];
    if (cand !== ex.english && !distractors.includes(cand)) distractors.push(cand);
  }
  return [ex.english, ...distractors];
}

function normalizeText(s) {
  return (s || "")
    .replace(/[\s。.，,！!？?；;：:、""''""'']/g, "")
    .trim();
}

// ============================================================================
// Dispatcher / lifecycle
// ============================================================================

function renderQuestion() {
  clearFeedback();
  renderScore();
  const ex = currentExercise();
  if (!ex) {
    promptHeaderEl.textContent = "—";
    promptEl.textContent = "No hay ejercicios que coincidan con el filtro actual.";
    stageEl.innerHTML = "";
    activeWidget = null;
    return;
  }
  const type = ex.type ?? "translate";
  promptHeaderEl.textContent = TYPE_LABELS[type];
  // Prompt content depends on type.
  if (type === "translate" || type === "syntax") {
    promptEl.textContent = ex.english || "—";
  } else if (type === "recognize") {
    promptEl.textContent = "¿Qué significado en español corresponde al chino de abajo?";
  } else if (type === "pinyin") {
    promptEl.textContent = "Escribe el pinyin (con tonos) de este carácter.";
  }
  stageEl.innerHTML = "";
  activeWidget = RENDERERS[type].mount(ex, stageEl);

  // Restore any prior verdict for this exercise.
  const prior = results[ex.id];
  if (prior) {
    showFeedback(prior, ex);
    if (prior === "correct" || prior === "shown") activeWidget?.lock?.();
  }
}

function commitCheck() {
  const ex = currentExercise();
  if (!ex || !activeWidget) return;
  const out = activeWidget.validate();
  if (!out) return; // empty input — silently ignore
  const prior = results[ex.id];
  if (prior !== "correct" && prior !== "shown") {
    results[ex.id] = out.ok ? "correct" : "incorrect";
    set(RESULTS_KEY, results);
  } else if (out.ok && prior === "incorrect") {
    results[ex.id] = "correct";
    set(RESULTS_KEY, results);
  }
  showFeedback(out.ok ? "correct" : "incorrect", ex);
  if (out.ok) activeWidget.lock?.();
  renderScore();
}

function commitShow() {
  const ex = currentExercise();
  if (!ex || !activeWidget) return;
  if (results[ex.id] !== "correct") {
    results[ex.id] = "shown";
    set(RESULTS_KEY, results);
  }
  activeWidget.showAnswer?.();
  showFeedback("shown", ex);
  renderScore();
}

function go(delta) {
  pos = clampPos(pos + delta);
  set(POS_KEY, pos);
  renderQuestion();
}

// ----- Filter chip row -----
function renderFilterRow() {
  filterRowEl.innerHTML = "";
  for (const f of FILTERS) {
    const total = exercises.filter((e) => f.id === "all" || (e.type ?? "translate") === f.id).length;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (filter === f.id ? " active" : "");
    btn.innerHTML = `${escapeHtml(f.label)} <span class="chip-count">${total}</span>`;
    btn.addEventListener("click", () => {
      if (filter === f.id) return;
      filter = f.id;
      pos = 0;
      set(FILTER_KEY, filter);
      set(POS_KEY, pos);
      renderFilterRow();
      renderQuestion();
    });
    filterRowEl.appendChild(btn);
  }
}

nextBtn.addEventListener("click", () => go(1));
prevBtn.addEventListener("click", () => go(-1));
resetBtn.addEventListener("click", () => {
  if (!confirm("¿Reiniciar todo el progreso de los ejercicios?")) return;
  remove(RESULTS_KEY);
  remove(SCORE_KEY);
  remove(POS_KEY);
  remove(FILTER_KEY);
  results = {};
  filter = "all";
  pos = 0;
  renderFilterRow();
  renderQuestion();
});

renderFilterRow();
renderQuestion();
