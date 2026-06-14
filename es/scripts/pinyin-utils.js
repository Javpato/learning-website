// Pinyin utilities: tone composition, validation normalization, caret-aware insertion.
// Used by the on-screen tone keyboard and the pinyin exercise validator.

// vowel base -> [tone1, tone2, tone3, tone4]
export const TONE_MAP = {
  a: ["ā", "á", "ǎ", "à"],
  e: ["ē", "é", "ě", "è"],
  i: ["ī", "í", "ǐ", "ì"],
  o: ["ō", "ó", "ǒ", "ò"],
  u: ["ū", "ú", "ǔ", "ù"],
  "ü": ["ǖ", "ǘ", "ǚ", "ǜ"],
};

// Reverse lookup: marked vowel -> { base, tone }
const MARKED_TO_BASE = {};
for (const [base, marks] of Object.entries(TONE_MAP)) {
  marks.forEach((ch, idx) => {
    MARKED_TO_BASE[ch] = { base, tone: idx + 1 };
  });
}

// Compose a vowel + tone into the diacritic form. tone 0 = bare vowel.
export function compose(vowel, tone) {
  const v = vowel === "v" ? "ü" : vowel.toLowerCase();
  if (!TONE_MAP[v]) return vowel;
  if (!tone) return v;
  return TONE_MAP[v][tone - 1] ?? v;
}

// Convert tone-marked pinyin to numeric form: "wǒ" -> "wo3", "Nǐmen" -> "ni3men".
// The tone digit is placed inline immediately after the vowel that carried the mark.
export function toNumeric(marked) {
  if (!marked) return "";
  let out = "";
  for (const ch of marked) {
    const lower = ch.toLowerCase();
    const hit = MARKED_TO_BASE[lower];
    if (hit) {
      out += hit.base + hit.tone;
    } else {
      out += lower;
    }
  }
  return out;
}

// Convert numeric pinyin to a marked form: "wo3" -> "wǒ".
// Simple beginner-grade rule: place the tone on the FIRST eligible vowel found in the
// preceding run (a > o > e > i > u > ü). Good enough for this exam content.
export function toMarked(numeric) {
  if (!numeric) return "";
  const s = numeric.toLowerCase().replace(/v/g, "ü");
  let out = "";
  let buffer = "";
  for (const ch of s) {
    if (ch >= "1" && ch <= "4") {
      const tone = Number(ch);
      out += applyToneToBuffer(buffer, tone);
      buffer = "";
    } else if (ch >= "0" && ch <= "9") {
      out += buffer;
      buffer = "";
    } else {
      buffer += ch;
    }
  }
  out += buffer;
  return out;
}

function applyToneToBuffer(buf, tone) {
  const priority = ["a", "o", "e", "i", "u", "ü"];
  for (const v of priority) {
    const idx = buf.lastIndexOf(v);
    if (idx >= 0) {
      return buf.slice(0, idx) + compose(v, tone) + buf.slice(idx + 1);
    }
  }
  return buf;
}

// Canonical form for validation comparison.
// Lowercases, strips spaces and punctuation, converts marked vowels inline to numeric,
// converts "v" -> "v" (kept) so users may also type "nv3" for "nǚ".
export function normalizePinyin(s) {
  if (!s) return "";
  let lowered = "";
  for (const ch of s) {
    const lower = ch.toLowerCase();
    const hit = MARKED_TO_BASE[lower];
    if (hit) {
      lowered += hit.base + hit.tone;
    } else {
      lowered += lower;
    }
  }
  // ü -> v so "nǚ" (-> "nü3") and "nv3" both reduce to "nv3"
  lowered = lowered.replace(/ü/g, "v");
  // Strip whitespace and any non-letter/non-digit punctuation.
  lowered = lowered.replace(/[\s.,!?;:。，！？；：、""''""''…—\-]/g, "");
  // Canonicalize tone-digit position: move every digit past following vowels in the
  // same syllable. Tone-marked input emits the digit at the marked vowel ("hǎo" → "ha3o"),
  // while numeric typing puts it at the end of the syllable ("hao3"). Sweep until stable.
  for (let prev = ""; prev !== lowered; ) {
    prev = lowered;
    lowered = lowered.replace(/([1-4])([aeiov]+)/g, "$2$1");
  }
  return lowered;
}

// Insert `chunk` into `value` at caret `start..end`, return { value, caret }.
export function insertAtCaret(value, start, end, chunk) {
  const before = value.slice(0, start);
  const after = value.slice(end);
  return {
    value: before + chunk + after,
    caret: before.length + chunk.length,
  };
}

// Remove one character before the caret. Returns { value, caret }.
export function backspaceAtCaret(value, start, end) {
  if (start !== end) {
    return {
      value: value.slice(0, start) + value.slice(end),
      caret: start,
    };
  }
  if (start === 0) return { value, caret: 0 };
  return {
    value: value.slice(0, start - 1) + value.slice(start),
    caret: start - 1,
  };
}
