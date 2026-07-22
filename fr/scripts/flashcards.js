import { decks } from "../data/chinese.js";
import { get, set } from "./storage.js";
import { ensureStates, pickNext, review, dueCount } from "./sr.js";

const SR_KEY = (deckId) => `lw.chinese.sr.${deckId}`;
const LAST_DECK_KEY = "lw.chinese.lastDeck";

let currentDeckId = get(LAST_DECK_KEY, "vocabulary");
if (!decks[currentDeckId]) currentDeckId = "vocabulary";

let states = {};
let currentCard = null;
let currentMode = "due";
let history = [];
let originalStates = {};

const tabsEl = document.getElementById("deck-tabs");
const areaEl = document.getElementById("card-area");
const metaEl = document.getElementById("meta");

function loadStates(deckId) {
  const saved = get(SR_KEY(deckId), {});
  return ensureStates(decks[deckId].items, saved);
}

function saveStates(deckId, stateMap) {
  set(SR_KEY(deckId), stateMap);
}

function renderTabs() {
  tabsEl.innerHTML = "";
  for (const [id, deck] of Object.entries(decks)) {
    const tabStates = loadStates(id);
    const due = dueCount(deck.items, tabStates);
    const btn = document.createElement("button");
    btn.className = "deck-tab" + (id === currentDeckId ? " active" : "");
    btn.innerHTML = `${deck.label}<span class="count">${due} à revoir</span>`;
    btn.addEventListener("click", () => {
      currentDeckId = id;
      set(LAST_DECK_KEY, id);
      states = loadStates(id);
      history = [];
      originalStates = {};
      renderTabs();
      renderNext();
    });
    tabsEl.appendChild(btn);
  }
}

function renderNext() {
  const items = decks[currentDeckId].items;
  if (!items.length) {
    areaEl.innerHTML = `
      <div class="empty-state">
        <h3>Ce paquet est vide.</h3>
        <p>Essaie un autre paquet ci-dessus.</p>
      </div>`;
    metaEl.textContent = "";
    return;
  }
  const pick = pickNext(items, states);
  currentCard = pick.card;
  currentMode = pick.mode;
  if (history[history.length - 1] !== currentCard.id) history.push(currentCard.id);
  renderCard(currentCard, pick);
}

// Apply a rating, snapshotting the pre-rate state so re-rating overwrites
// instead of compounding on top of the previous rating.
function rateCard(id, q) {
  if (!(id in originalStates)) originalStates[id] = states[id];
  states[id] = review(originalStates[id], q);
  saveStates(currentDeckId, states);
}

function onNext() {
  if (!currentCard) return;
  rateCard(currentCard.id, 5);
  renderTabs();
  renderNext();
}

function onPrev() {
  if (history.length < 2) return;
  history.pop();
  const prevId = history.pop();
  const items = decks[currentDeckId].items;
  const card = items.find((it) => it.id === prevId);
  if (!card) { renderNext(); return; }
  currentCard = card;
  history.push(prevId);
  renderTabs();
  renderCard(card, { mode: currentMode, dueCount: dueCount(items, states) });
}

function backHTML(card) {
  const back = decks[currentDeckId].cardBack(card);
  const ex = back.example;
  const exHTML = ex
    ? `<div class="example">
         <div class="ex-zh">${ex.chinese}</div>
         <div class="ex-py">${ex.pinyin}</div>
         <div>${ex.english}</div>
       </div>`
    : "";
  const notesHTML = back.notes ? `<div class="notes">${back.notes}</div>` : "";
  const ruleHTML = card.ruleTitle ? `<div class="notes">${card.ruleTitle}</div>` : "";
  return `
    <div class="pinyin">${back.pinyin}</div>
    <div class="english">${back.english}</div>
    ${exHTML}
    ${notesHTML}
    ${ruleHTML}
  `;
}

function renderCard(card, pick) {
  const front = decks[currentDeckId].cardFront(card);
  areaEl.innerHTML = `
    <div class="flashcard-stage">
      <div class="flashcard" id="flashcard">
        <div class="face front">
          <div class="hanzi">${front}</div>
          <div class="hint">touche la carte ou appuie sur espace</div>
        </div>
        <div class="face back">
          ${backHTML(card)}
        </div>
      </div>
    </div>
    <div class="flashcard-nav">
      <button class="nav-btn prev" type="button">← Précédente</button>
      <button class="nav-btn next" type="button">Suivante (Facile) →</button>
    </div>
    <div class="rate-row" id="rate-row" style="opacity:0.45; pointer-events:none;">
      <button class="rate-btn again" data-q="1">Encore<span class="key">1</span></button>
      <button class="rate-btn hard"  data-q="3">Difficile<span class="key">2</span></button>
      <button class="rate-btn good"  data-q="4">Bien<span class="key">3</span></button>
      <button class="rate-btn easy"  data-q="5">Facile<span class="key">4</span></button>
    </div>
  `;
  metaEl.innerHTML = pick.mode === "due"
    ? `${pick.dueCount} cartes à revoir dans ce paquet`
    : `Rien à revoir — révision en avance`;

  const fc = document.getElementById("flashcard");
  const rateRow = document.getElementById("rate-row");

  function flip() {
    fc.classList.toggle("flipped");
    rateRow.style.opacity = "1";
    rateRow.style.pointerEvents = "auto";
  }
  fc.addEventListener("click", flip);

  rateRow.querySelectorAll(".rate-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const q = parseInt(btn.dataset.q, 10);
      rateCard(currentCard.id, q);
      renderTabs();
      renderNext();
    });
  });

  const prevBtn = areaEl.querySelector(".nav-btn.prev");
  const nextBtn = areaEl.querySelector(".nav-btn.next");
  prevBtn.disabled = history.length < 2;
  prevBtn.addEventListener("click", (e) => { e.stopPropagation(); onPrev(); });
  nextBtn.addEventListener("click", (e) => { e.stopPropagation(); onNext(); });
}

// Keyboard shortcuts: space to flip; 1/2/3/4 to rate.
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  const fc = document.getElementById("flashcard");
  if (!fc) return;

  if (e.key === " " || e.code === "Space") {
    e.preventDefault();
    fc.click();
    return;
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    onNext();
    return;
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    onPrev();
    return;
  }
  const rateRow = document.getElementById("rate-row");
  if (rateRow && rateRow.style.pointerEvents === "auto") {
    const map = { "1": "1", "2": "3", "3": "4", "4": "5" };
    if (map[e.key]) {
      const btn = document.querySelector(`.rate-btn[data-q="${map[e.key]}"]`);
      if (btn) btn.click();
    }
  }
});

states = loadStates(currentDeckId);
renderTabs();
renderNext();
