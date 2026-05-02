// On-screen pinyin tone keyboard. Inserts diacritic vowels at the input's caret.
// Stand-alone so it can be reused outside the exercises page.

import { TONE_MAP, insertAtCaret, backspaceAtCaret } from "./pinyin-utils.js";

const VOWELS = ["a", "e", "i", "o", "u", "ü"];

export function mountPinyinKeyboard(targetInputEl, mountEl) {
  mountEl.innerHTML = "";
  mountEl.classList.add("tone-keyboard");

  for (const v of VOWELS) {
    for (let tone = 1; tone <= 4; tone++) {
      mountEl.appendChild(makeKey(targetInputEl, TONE_MAP[v][tone - 1]));
    }
    mountEl.appendChild(makeKey(targetInputEl, v));
  }

  // Backspace key
  const bs = document.createElement("button");
  bs.type = "button";
  bs.className = "tone-key tone-key-bs";
  bs.textContent = "⌫";
  bs.setAttribute("aria-label", "Backspace");
  bs.addEventListener("mousedown", (e) => e.preventDefault());
  bs.addEventListener("click", () => {
    const start = targetInputEl.selectionStart ?? targetInputEl.value.length;
    const end = targetInputEl.selectionEnd ?? targetInputEl.value.length;
    const next = backspaceAtCaret(targetInputEl.value, start, end);
    targetInputEl.value = next.value;
    targetInputEl.setSelectionRange(next.caret, next.caret);
    targetInputEl.focus();
    targetInputEl.dispatchEvent(new Event("input", { bubbles: true }));
  });
  mountEl.appendChild(bs);
}

function makeKey(input, ch) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tone-key";
  btn.textContent = ch;
  // Prevent the click stealing focus from the input before we read selection.
  btn.addEventListener("mousedown", (e) => e.preventDefault());
  btn.addEventListener("click", () => {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const next = insertAtCaret(input.value, start, end, ch);
    input.value = next.value;
    input.setSelectionRange(next.caret, next.caret);
    input.focus();
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  return btn;
}
