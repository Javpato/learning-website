import { exercises } from "../data/chinese.js";
import { get, set, remove } from "./storage.js";

const SCORE_KEY    = "lw.chinese.exercises.score";    // { correct, total }
const RESULTS_KEY  = "lw.chinese.exercises.results";  // { [exId]: "correct" | "incorrect" | "shown" }
const POS_KEY      = "lw.chinese.exercises.pos";

let pos = clampPos(get(POS_KEY, 0));
let results = get(RESULTS_KEY, {});

const promptEl    = document.getElementById("english-prompt");
const inputEl     = document.getElementById("answer-input");
const checkBtn    = document.getElementById("check-btn");
const showBtn     = document.getElementById("show-btn");
const nextBtn     = document.getElementById("next-btn");
const prevBtn     = document.getElementById("prev-btn");
const feedbackEl  = document.getElementById("feedback");
const scoreEl     = document.getElementById("score");
const totalEl     = document.getElementById("total");
const qposEl      = document.getElementById("qpos");
const resetBtn    = document.getElementById("reset-btn");

function clampPos(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(exercises.length - 1, n));
}

// Strip whitespace and ASCII / Chinese punctuation so trailing 。 or spaces don't fail a match.
function normalize(s) {
  return (s || "")
    .replace(/[\s。.，,！!？?；;：:、""''""'']/g, "")
    .trim();
}

function renderScore() {
  const correct = Object.values(results).filter((v) => v === "correct").length;
  scoreEl.textContent = correct;
  totalEl.textContent = exercises.length;
  qposEl.textContent = `Question ${pos + 1} of ${exercises.length}`;
  set(SCORE_KEY, { correct, total: exercises.length });
}

function clearFeedback() {
  feedbackEl.className = "exercise-feedback";
  feedbackEl.innerHTML = "";
}

function renderQuestion() {
  const ex = exercises[pos];
  promptEl.textContent = ex.english;
  inputEl.value = "";
  inputEl.disabled = false;
  checkBtn.disabled = false;
  clearFeedback();
  renderScore();

  // If we've already answered this one, restore the visible verdict.
  const prior = results[ex.id];
  if (prior) showFeedback(prior, ex);

  inputEl.focus();
}

function showFeedback(kind, ex) {
  const verdict = {
    correct:   "Correct.",
    incorrect: "Not quite.",
    shown:     "Answer revealed.",
  }[kind];
  feedbackEl.className = `exercise-feedback show ${kind === "shown" ? "reveal" : kind}`;
  feedbackEl.innerHTML = `
    <div class="verdict">${verdict}</div>
    <div class="answer-zh">${ex.chinese}</div>
    <div class="answer-py">${ex.pinyin}</div>
    <div class="grammar-tags">${ex.grammarTested.map((g) => `<span>${g}</span>`).join("")}</div>
  `;
}

function check() {
  const ex = exercises[pos];
  const guess = normalize(inputEl.value);
  if (!guess) return;
  const expected = normalize(ex.chinese);
  const ok = guess === expected;

  // Don't downgrade an already-correct or shown result if user re-attempts.
  const prior = results[ex.id];
  if (prior !== "correct" && prior !== "shown") {
    results[ex.id] = ok ? "correct" : "incorrect";
    set(RESULTS_KEY, results);
  } else if (ok && prior === "incorrect") {
    results[ex.id] = "correct";
    set(RESULTS_KEY, results);
  }

  showFeedback(ok ? "correct" : "incorrect", ex);
  renderScore();
  if (ok) inputEl.disabled = true;
}

function show() {
  const ex = exercises[pos];
  if (results[ex.id] !== "correct") {
    results[ex.id] = "shown";
    set(RESULTS_KEY, results);
  }
  showFeedback("shown", ex);
  renderScore();
}

function go(delta) {
  pos = clampPos(pos + delta);
  set(POS_KEY, pos);
  renderQuestion();
}

checkBtn.addEventListener("click", check);
showBtn.addEventListener("click", show);
nextBtn.addEventListener("click", () => go(1));
prevBtn.addEventListener("click", () => go(-1));

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    check();
  }
});

resetBtn.addEventListener("click", () => {
  if (!confirm("Reset all exercise progress?")) return;
  remove(RESULTS_KEY);
  remove(SCORE_KEY);
  remove(POS_KEY);
  results = {};
  pos = 0;
  renderQuestion();
});

renderQuestion();
