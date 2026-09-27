import { decks } from "../data/chinese.js";
import { get, set } from "./storage.js";
import { categories } from "../data/chinese.js";

const LAST_DECK_KEY = "lw.chinese.lastDeck";
const T = {"due": "pendientes", "all": "Todo", "restart": "Reiniciar", "previous": "← Anterior", "next": "Siguiente →", "hint": "toca la tarjeta o pulsa espacio", "again": "Otra vez", "hard": "Difícil", "good": "Bien", "easy": "Fácil", "empty": "Este mazo está vacío.", "try": "Prueba otro mazo arriba.", "choose": "Elige una categoría de vocabulario", "any": "Todas las categorías", "done": "Sesión terminada", "doneText": "Elige una pila para repasar o termina por ahora.", "review": "Repasar", "finish": "Terminar", "cards": "tarjetas", "dueCount": "tarjetas pendientes en este mazo", "ahead": "Nada pendiente — repasando por adelantado", "reset": "¿Reiniciar esta sesión? Se borrarán las pilas temporales Fácil, Bien y Difícil.", "confirm": "Reiniciar sesión", "cancel": "Cancelar", "cat": "categoría"};
let currentDeckId = get(LAST_DECK_KEY, "vocabulary");
if (!decks[currentDeckId]) currentDeckId = "vocabulary";
let activeCategory = "all";
let currentCard = null;
let history = [];
let decisions = {};
let piles = { 3: [], 4: [], 5: [] };
let queue = [];
let queueMode = "main";
const tabsEl = document.getElementById("deck-tabs");
const areaEl = document.getElementById("card-area");
const metaEl = document.getElementById("meta");

function renderTabs() {
  tabsEl.innerHTML = "";
  for (const [id, deck] of Object.entries(decks)) {
    const count = deck.items.length;
    const btn = document.createElement("button");
    btn.className = "deck-tab" + (id === currentDeckId ? " active" : "");
    btn.innerHTML = `${deck.label}<span class="count">${count} ${T.items}</span>`;
    btn.addEventListener("click", () => { currentDeckId = id; set(LAST_DECK_KEY, id); activeCategory = "all"; resetPiles(); renderTabs(); renderCategories(); renderNext(); });
    tabsEl.appendChild(btn);
  }
}
function renderCategories() {
  let row = document.getElementById("category-tabs");
  if (!row) { row = document.createElement("div"); row.id = "category-tabs"; row.className = "deck-tabs category-tabs"; tabsEl.after(row); }
  row.innerHTML = "";
  row.hidden = currentDeckId !== "vocabulary";
  if (row.hidden) return;
  const all = [{ id: "all", label: T.any }, ...categories];
  for (const category of all) {
    const count = category.id === "all" ? decks.vocabulary.items.length : decks.vocabulary.items.filter((item) => item.category === category.id).length;
    const button = document.createElement("button");
    button.className = "deck-tab" + (activeCategory === category.id ? " active" : "");
    button.textContent = `${category.label} (${count})`;
    button.addEventListener("click", () => { activeCategory = category.id; resetPiles(); renderCategories(); renderNext(); });
    row.appendChild(button);
  }
}
function resetPiles() { decisions = {}; piles = { 3: [], 4: [], 5: [] }; queue = []; history = []; queueMode = "main"; }
function renderNext() {
  const items = itemsForDeck();
  if (!items.length) { areaEl.innerHTML = `<div class="empty-state"><h3>${T.empty}</h3><p>${T.try}</p></div>`; metaEl.textContent = ""; return; }
  if (queueMode === "main") {
    const unresolved = items.filter((it) => !decisions[it.id] || decisions[it.id] === 1);
    if (!unresolved.length) { renderComplete(); return; }
    const retry = unresolved.find((it) => decisions[it.id] === 1);
    currentCard = retry || unresolved[0];
  } else {
    if (!queue.length) { renderComplete(); return; }
    currentCard = items.find((it) => it.id === queue[0]) || null;
    if (!currentCard) { renderComplete(); return; }
  }
  history.push(currentCard.id);
  renderCard(currentCard);
}
function renderComplete() {
  currentCard = null;
  const available = [5,4,3].filter((q) => piles[q].length);
  areaEl.innerHTML = `<div class="empty-state session-complete"><h3>${T.done}</h3><p>${T.doneText}</p><div class="completion-actions">${available.map((q) => `<button class="btn btn-accent" data-pile="${q}">${T.review} ${q === 5 ? T.easy : q === 4 ? T.good : T.hard} (${piles[q].length})</button>`).join("")}<button class="btn btn-ghost" data-finish>${T.finish}</button></div></div>`;
  metaEl.textContent = "";
  areaEl.querySelectorAll("[data-pile]").forEach((button) => button.addEventListener("click", () => {
    const selectedPile = piles[Number(button.dataset.pile)].slice();
    resetPiles();
    queue = selectedPile;
    queueMode = "pile";
    renderNext();
  }));
  areaEl.querySelector("[data-finish]").addEventListener("click", () => { resetPiles(); renderNext(); });
}
function commit(q) {
  if (!currentCard) return;
  const id = currentCard.id;
  if (decisions[id] > 1) piles[decisions[id]] = piles[decisions[id]].filter((cardId) => cardId !== id);
  decisions[id] = q;
  if (q !== 1) piles[q] = [...piles[q].filter((cardId) => cardId !== id), id];
  if (queueMode === "pile" && q !== 1) queue.shift();
  renderTabs();
  renderNext();
}
function onPrev() {
  if (history.length < 2) return;
  history.pop();
  const id = history.pop();
  const card = itemsForDeck().find((it) => it.id === id);
  if (!card) return;
  if (queueMode === "pile" && !queue.includes(id)) queue.unshift(id);
  if (decisions[id]) { if (decisions[id] > 1) piles[decisions[id]] = piles[decisions[id]].filter((cardId) => cardId !== id); delete decisions[id]; }
  currentCard = card;
  history.push(id);
  renderTabs();
  renderCard(card);
}
function backHTML(card) {
  const back = decks[currentDeckId].cardBack(card), ex = back.example;
  return `<div class="pinyin">${back.pinyin}</div><div class="english">${back.english}</div>${ex ? `<div class="example"><div class="ex-zh">${ex.chinese}</div><div class="ex-py">${ex.pinyin}</div><div>${ex.english}</div></div>` : ""}${back.notes ? `<div class="notes">${back.notes}</div>` : ""}${card.ruleTitle ? `<div class="notes">${card.ruleTitle}</div>` : ""}`;
}
function renderCard(card) {
  const front = decks[currentDeckId].cardFront(card);
  areaEl.innerHTML = `<div class="flashcard-stage"><div class="flashcard" id="flashcard"><div class="face front"><div class="hanzi">${front}</div><div class="hint">${T.hint}</div></div><div class="face back">${backHTML(card)}</div></div></div><div class="flashcard-nav"><button class="nav-btn prev" type="button">${T.previous}</button><button class="nav-btn restart" type="button">${T.restart}</button></div><div class="rate-row" id="rate-row" style="opacity:.45;pointer-events:none"><button class="rate-btn again" data-q="1">${T.again}<span class="key">1</span></button><button class="rate-btn hard" data-q="3">${T.hard}<span class="key">2</span></button><button class="rate-btn good" data-q="4">${T.good}<span class="key">3</span></button><button class="rate-btn easy" data-q="5">${T.easy}<span class="key">4</span></button></div>`;
  const fc = document.getElementById("flashcard"), rateRow = document.getElementById("rate-row");
  fc.addEventListener("click", () => { fc.classList.toggle("flipped"); rateRow.style.opacity = "1"; rateRow.style.pointerEvents = "auto"; });
  rateRow.querySelectorAll(".rate-btn").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); commit(Number(button.dataset.q)); }));
  const prev = areaEl.querySelector(".prev"); prev.disabled = history.length < 2; prev.addEventListener("click", onPrev);
  areaEl.querySelector(".restart").addEventListener("click", () => { if (confirm(T.reset)) { resetPiles(); renderNext(); } });
  metaEl.textContent = `${Object.keys(decisions).length} / ${itemsForDeck().length} ${T.cards}`;
}
document.addEventListener("keydown", (event) => {
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") return;
  const fc = document.getElementById("flashcard"); if (!fc) return;
  if (event.key === " " || event.code === "Space") { event.preventDefault(); fc.click(); }
  const map = { "1": 1, "2": 3, "3": 4, "4": 5 };
  if (map[event.key] && document.getElementById("rate-row").style.pointerEvents === "auto") document.querySelector(`.rate-btn[data-q="${map[event.key]}"]`).click();
});
renderTabs(); renderCategories(); renderNext();
