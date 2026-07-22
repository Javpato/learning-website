# Learning Website — Design Reference

A complete description of what this site is, how it is built, how it works, and what conventions any new code must follow. Written for an AI assistant working on this codebase.

---

## 1. What this site is

A personal, static, no-framework educational platform. There are four subject areas (Languages, Physics, Computer Science, Mathematics). Each subject contains modules (e.g. Mandarin Chinese, Thermodynamics, ASD algorithms). Each module has some combination of:

- **Animated step-by-step corrections** for exercises (physics, CS)
- **Spaced-repetition flashcards** (Chinese vocabulary)
- **Interactive exercises** (Chinese translation, grammar, pinyin)
- **Prose corrections** with KaTeX math (physics write-ups)
- **Course material pages** (embedded PDFs, project showcases)

The site has zero build tools, zero npm, zero framework. It is plain HTML + CSS + vanilla ES6 modules served from the filesystem. There is no server-side logic.

---

## 2. Directory layout

```
learning-website/
├── index.html                 # Root home page
├── styles/
│   ├── theme.css              # Design tokens + all shared component styles
│   ├── home.css               # Home page only
│   ├── presentation.css       # Animated step-presenter UI
│   ├── chinese.css            # Chinese learning UI (flashcards, exercises)
│   ├── cs.css                 # CS memory diagram UI
│   ├── thermodynamique.css    # Thermodynamics SVG styles
│   ├── electrocinetique.css   # Electronics SVG styles
│   └── algebre-lineaire.css   # Linear algebra concept pages + demo widgets
├── scripts/
│   ├── storage.js             # localStorage wrapper
│   ├── sr.js                  # SM-2 spaced repetition algorithm
│   ├── flashcards.js          # Flashcard deck UI + SR integration
│   ├── exercises.js           # Multi-type exercise rendering + scoring
│   ├── pinyin-utils.js        # Tone composition helpers
│   ├── pinyin-keyboard.js     # On-screen tone keyboard
│   ├── shared/
│   │   ├── animator.js        # Generic step-presenter engine
│   │   └── katex-loader.js    # Lazy KaTeX CDN loader
│   ├── thermo/                # Thermodynamics scene builders
│   ├── electro/               # Electronics scene builders
│   ├── cs/                    # CS memory diagram scene builders
│   └── math/                  # Linear algebra demos + scene builders
├── data/
│   └── chinese.js             # All Chinese vocabulary/exercise data
├── physics/                   # Physics section
│   ├── index.html
│   ├── thermodynamique/       # Module: Thermodynamics
│   └── electrocinetique/      # Module: Electronics
├── computer-science/          # CS section
│   ├── index.html
│   └── asd/                   # Module: Algorithms & Data Structures
├── languages/                 # Languages section
│   ├── index.html
│   └── chinese/               # Module: Mandarin Chinese
├── math/                      # Mathematics section
│   ├── index.html
│   └── algebre-lineaire/      # Module: Linear algebra (concept pages + exercises)
└── manim-sources/             # Python Manim source files (not served)
```

---

## 3. Design system

### 3.1 CSS variables (theme.css :root)

Every color, font, radius, and transition is a CSS variable defined in `styles/theme.css`. Never hardcode values in page-specific stylesheets.

| Variable | Value | Purpose |
|---|---|---|
| `--bg` | `#0e1116` | Page background (dark navy) |
| `--bg-elevated` | `#161a22` | Cards, panels |
| `--bg-elevated-2` | `#1d222c` | Nested elevated surfaces |
| `--fg` | `#e8e6e3` | Primary text |
| `--fg-muted` | `#9aa0a6` | Secondary text, descriptions |
| `--fg-dim` | `#6b7280` | Tags, metadata, very low contrast |
| `--border` | `rgba(154,160,166,0.2)` | Default border |
| `--border-strong` | `rgba(154,160,166,0.4)` | Focused/active border |
| `--accent` | `#58a6ff` | Interactive blue — links, active states |
| `--accent-soft` | `rgba(88,166,255,0.15)` | Accent tinted background |
| `--accent-warm` | `#f5b942` | Golden yellow — animated mode, sub-headings |
| `--success` | `#6ee7b7` | Correct answer feedback |
| `--success-soft` | `rgba(110,231,183,0.12)` | Success tinted background |
| `--danger` | `#f87171` | Wrong answer feedback |
| `--danger-soft` | `rgba(248,113,113,0.12)` | Danger tinted background |
| `--serif` | `"EB Garamond", Georgia, serif` | Headings, display text |
| `--sans` | `"Inter", system-ui, sans-serif` | Body, UI |
| `--radius` | `10px` | Default border-radius |
| `--radius-lg` | `14px` | Cards |
| `--transition` | `0.25s ease` | All hover/focus transitions |
| `--shadow` | `0 8px 24px rgba(0,0,0,0.35)` | Elevated element shadow |

**Rule:** only `theme.css` is allowed to define `:root` variables. Subject stylesheets may add subject-specific variables locally but must not redefine theme tokens.

### 3.2 Typography

- **Headings** (`h1`–`h4`): EB Garamond serif, weight 500, `letter-spacing: -0.01em`
- **Body / UI**: Inter sans-serif
- `h1` uses `clamp(2.4rem, 5vw, 3.6rem)` — fluid
- `h2` uses `clamp(1.8rem, 3.5vw, 2.4rem)` — fluid
- `h3`: `1.4rem` fixed
- Base font size: `16px`, line-height `1.6`
- Antialiasing: `-webkit-font-smoothing: antialiased`

### 3.3 Layout containers

| Class | Behavior |
|---|---|
| `.page` | `max-width: 1100px`, centered, horizontal padding `1.5rem` |
| `.page-wide` | `max-width: 1280px` variant |
| `.site-header` | Full-width flex bar: brand left, nav right |
| `.crumbs` | Breadcrumb row, `font-size: 0.9rem`, `--fg-muted` |
| `.sub-grid` | `auto-fit` grid, `minmax(260px, 1fr)` — hub index cards |
| `.exo-list` | `auto-fit` grid, `minmax(320px, 1fr)` — exercise list cards |
| `.mode-grid` | `auto-fit` grid, `minmax(280px, 1fr)` — written vs animated choice |

### 3.4 Card components

**`.sub-card`** — hub navigation card (blue hover)  
**`.exo-card`** — exercise list card; `.disabled` variant mutes it  
**`.mode-card`** — correction mode choice card; `.animated` variant uses `--accent-warm` hover  
**`.prose`** — long-form text correction block (elevated bg, KaTeX support)  
**`.exo-statement`** — problem statement panel  

All cards share the same hover pattern: `border-color → --accent`, `transform: translateY(-2px)`, `transition: 0.25s ease`.

### 3.5 Button system

`.btn` — base: elevated bg, border, padding, hover raises with accent border  
`.btn-accent` — accent-soft bg, accent border, accent text  
`.btn-ghost` — transparent bg  

---

## 4. Page architecture

### 4.1 Every page

Every HTML page:
- `<!doctype html>` with `lang="en"` (or `lang="fr"` for French-primary pages)
- Loads Google Fonts (EB Garamond + Inter) via `<link rel="preconnect">`
- Loads `styles/theme.css` (always, first)
- Loads one or more subject-specific stylesheets
- Has `.site-header` with brand "Learning" linking to `/index.html` and nav links
- Has `.crumbs` breadcrumb trail matching the folder hierarchy
- Wraps content in `.page` (or `.page-wide` for animation pages)
- Loads JS as `type="module"`

### 4.2 Hub/index pages

Structure: header → crumbs → section heading → `.sub-grid` of `.sub-card` links → optional descriptive paragraphs.

Glyphs identify sections:
- Languages → 語
- Physics → ψ
- Mathematics → ∫
- Computer Science → { }

Badges: `<span class="badge">Open</span>` or `<span class="badge">Soon</span>`.

### 4.3 Exercise landing pages

Structure: header → crumbs → `.exo-statement` (problem text + KaTeX) → optional figure/video → `.mode-grid` with two `.mode-card` links:
1. "Correction écrite" (written solution) — icon ✏️, blue accent
2. "Correction animée" (animated walkthrough) — icon ▶, warm/yellow accent

### 4.4 Written correction pages (`.prose`)

Structure: header → crumbs → `.prose` block with `h2` (blue) for major sections, `h3` (warm yellow) for sub-sections, KaTeX math throughout → `.bottom-nav` with previous/next buttons.

### 4.5 Animated correction pages

Structure: header → crumbs → `<div id="app">` mounted by `mountPresentation()`. The animator takes over the entire `#app` div.

---

## 5. The animator engine (`scripts/shared/animator.js`)

The core interactive component. Used on all animated correction pages.

### 5.1 Data structure

```js
const presentation = {
  chapters: [
    {
      label: "Partie A",          // tab label
      defaultFigure: (step) => svgNode,  // optional: shared figure builder per step
      steps: [
        {
          title: "Étape 1",
          note: "<p>HTML explanation text</p>",
          math: ["W = \\int P\\,dV", "= P_0(V_B - V_A)"],  // KaTeX strings
          highlightLine: 1,        // index in math[] to highlight
          figure: () => svgNode,   // optional: per-step figure override
          useChapterFigure: true,  // default true: use defaultFigure if no figure
          roadmap: {               // optional: mini step-tracker
            question: "What are we finding?",
            stages: ["Setup", "Integrate", "Apply"],
            current: 1,            // 0-indexed current stage
            completedNote: "<p>HTML</p>"  // shown when done
          },
          whyStep: {               // optional: strategic context panel
            summary: "Rappel — pourquoi cette étape ?",
            body: "<p>HTML</p>",
            math: ["formula"],
            openByDefault: false
          },
          subSteps: [              // optional: "Pourquoi ?" drill-down
            { text: "<p>HTML</p>", math: ["formula"] }
          ]
        }
      ]
    }
  ]
};
```

### 5.2 Layout

Two-column layout inside `.pres-stage`:
- **Left (`.pres-side`)**: step position label, roadmap widget, step title, note text, whyStep panel, subSteps panel
- **Right (`.pres-main`)**: figure area (SVG) + math area (KaTeX lines)

Controls row: ← Précédent | ▶ Lecture auto | Suivant → | progress indicator

### 5.3 Navigation

- Previous / Next buttons
- Chapter tab row (numbered tabs)
- Keyboard: `→` or `Space` = next, `←` = prev, `Escape` = stop autoplay
- Autoplay: 3500ms per step interval

### 5.4 Rules for new scene files

- Export a `presentation` object matching the structure above
- Each step should have a `title` (short, imperative), a `note` (HTML, explains the concept in French), and `math` (array of KaTeX strings showing the derivation)
- Use `roadmap` when a chapter has more than 3 steps and it helps track progress
- Use `whyStep` to explain *why* we're doing something (strategic), use `subSteps` to show *how* a transformation works (tactical detail)
- Figure builders return an SVG DOM node or null; they must be pure functions (no side effects, called on every render)
- Chapter labels are in French (this is a French-language physics/CS course)

---

## 6. Spaced repetition system (`scripts/sr.js`)

Pure SM-2 implementation. No DOM, no storage — only pure functions.

### 6.1 Card state shape

```js
{
  ef: 2.5,         // easiness factor (min 1.3)
  interval: 0,     // days until next review
  repetitions: 0,  // consecutive correct answers
  dueDay: N        // absolute day number (Math.floor(Date.now() / 86_400_000))
}
```

### 6.2 Quality ratings

| Value | Meaning | Button label |
|---|---|---|
| 1 | Again — complete failure | "Again" |
| 3 | Hard — significant difficulty | "Hard" |
| 4 | Good — correct with effort | "Good" |
| 5 | Easy — perfect recall | "Easy" |

Quality < 3 resets repetitions and schedules next review in 1 day. Quality ≥ 3 advances the interval (1 → 6 → `prev × ef`).

### 6.3 Scheduling logic

- `newCardState()` — creates a fresh card due today
- `review(state, quality)` — returns updated state (pure, no mutation)
- `isDue(state)` — true if `dueDay <= today`
- `pickNext(items, stateMap)` — returns `{ card, dueCount, mode }` where mode is `"due"` or `"ahead"`. Always returns a card (never null) — falls back to soonest upcoming if nothing is due today.
- `ensureStates(items, savedMap)` — merges saved progress, removes orphans for deleted cards

### 6.4 Storage

`scripts/storage.js` wraps localStorage with `get(key, fallback)` / `set(key, value)`. SR state is stored per-deck, keyed by deck ID.

---

## 7. Chinese learning module (`languages/chinese/`)

The most complex module. Four pages:

| Page | Purpose |
|---|---|
| `index.html` | Dashboard: deck progress bars, links to all tools |
| `flashcards.html` | Spaced-repetition card drills |
| `exercises.html` | Four exercise types, scored per session |
| `vocabulary.html` | Full vocabulary table with search + filter |

### 7.1 Data (`data/chinese.js`)

Single JS module exporting:
- `vocabulary` — array of `{id, chinese, pinyin, english, type, example}` entries
- `characters` — array of `{id, chinese, pinyin, english}` for character-level drilling
- `decks` — array of deck configs with `{id, label, items[], type}` where type is one of `vocabulary | characters | exercises`
- `exerciseSentences` — array of `{id, chinese, pinyin, english, type}` where exercise type is one of:
  - `translate` — type a translation from Chinese
  - `recognize` — multiple-choice: pick the correct Chinese for an English sentence
  - `pinyin` — type the pinyin (with tones) for a Chinese sentence
  - `syntax` — reorder shuffled Chinese tokens to form the correct sentence

### 7.2 Flashcard UI

- Deck selector tabs (with due-count badge)
- Card face: Chinese characters (large serif, front) / Pinyin + English (back)
- 3D CSS flip animation on click
- Rating buttons (Again / Hard / Good / Easy) appear after flip
- Previous / Next skip buttons (do not affect SR rating)
- Progress persisted to localStorage

### 7.3 Exercise types

All share: a question display, an answer area, submit → reveal → next flow.

| Type | Input method | Validation |
|---|---|---|
| `translate` | Text input | Normalized string comparison |
| `recognize` | 4 multiple-choice buttons | Exact match |
| `pinyin` | Text input + on-screen tone keyboard | Normalized pinyin comparison (tone marks or numbers) |
| `syntax` | Clickable token tiles to reorder | Array equality after joining |

Scoring: correct / total shown per session, with color feedback (green success, red danger, orange reveal).

### 7.4 Pinyin keyboard

On-screen keyboard (`scripts/pinyin-keyboard.js`) injects tone-marked vowels at the caret position. Five vowel rows: a/e/i/o/u, each with 4 tone variants + backspace. Handles `<input>` caret positioning correctly.

---

## 8. SVG visualization system

Physics and CS use programmatic SVG builders (no external charting library).

### 8.1 Thermodynamics

**`scripts/thermo/clapeyron.js`** — builds P-V diagrams (Clapeyron diagrams):
- Axes with grid, labels, tick marks
- Named points as dots with labels
- Curves between points by type: `isotherm` (blue), `isobar` (yellow), `isochor` (green), `adiabatic` (purple), `line` (red)
- Shaded area under curves for work visualization
- Returns an SVG DOM node

**`scripts/thermo/piston.js`** — builds piston schematic SVGs:
- Cylinder walls, piston head, gas region
- Heat arrows (in/out)
- Temperature indicator
- Insulation hatching (for adiabatic)
- Volume fraction control

CSS for these lives in `styles/thermodynamique.css`.

### 8.2 Electronics

**`scripts/electro/circuits.js`** — builds circuit diagrams and phasor diagrams:
- Component symbols: resistor, inductor, capacitor, AC source
- Current arrow annotations
- Phasor arrows with phase angles and labels

CSS in `styles/electrocinetique.css`.

### 8.3 Computer Science memory diagrams

**`scripts/cs/memory.js`** — builds stack/heap memory diagrams:
- Stack frames with named variable slots
- Heap blocks
- Pointer arrows between slots and blocks
- Highlight/fade states for instruction tracing

CSS in `styles/cs.css`. Color convention: **blue = pile (stack)**, **green = tas (heap)**.

---

## 9. KaTeX integration

`scripts/shared/katex-loader.js` lazy-loads KaTeX from CDN on first use, caches the promise. Usage:

```js
import { renderKatex } from "../shared/katex-loader.js";
renderKatex("W = \\int P\\,dV", domElement, true);  // true = display mode
```

All math is rendered client-side at display time, not at page load. KaTeX color is forced to `--fg` via `styles/theme.css`:

```css
.katex { color: var(--fg); }
```

Inline math in HTML uses `.km` wrapper (inline) or `.kb` wrapper (block). These classes normalize KaTeX sizing relative to surrounding text.

---

## 10. Conventions and rules

### 10.1 Language / i18n

The site ships in three complete language versions, as three parallel static trees:

- **`/` (repo root) — English.** The canonical structure.
- **`/fr/` — French.** Full mirror of the root (pages, `scripts/`, `styles/`, `data/`).
- **`/es/` — Spanish.** Full mirror of the root (pages, `scripts/`, `styles/`, `data/`).

Rules:

- The three trees are structurally identical: same file names (French-era names like
  `algebre-lineaire/` and `exercice-1.html` are kept in all locales — never rename per
  locale), same relative paths, same DOM structure. Only human-visible strings differ.
- Every page carries **exactly one** language toggle in the header nav: a single
  `.lang-switch` pill that cycles **EN → FR → ES → EN**. Its label names the language it
  switches TO, and it links to the *same page* in the next locale
  (e.g. `languages/chinese/flashcards.html` → `../../fr/languages/chinese/flashcards.html`).
  When adding a page, add it to all three trees and give each copy its toggle.
- Variable names, function names, CSS classes, ids, `data-*` attributes, and
  localStorage keys are in **English** in every locale — only string *values* are
  translated. In `data/chinese.js` the gloss field is named `english:` in all three
  locales; only its value is translated.
- The `platform/` Next.js app handles i18n separately via `[locale]` routes; its
  `LocaleSwitch` component implements the same single-pill EN → FR → ES cycle.

### 10.2 JavaScript

- All JS is **ES6 modules** (`type="module"` on script tags, `import`/`export` syntax)
- No build step — imports must be relative paths (`./`, `../`) or CDN URLs
- No npm, no bundler, no TypeScript
- Functions are pure where possible; side effects are isolated to UI modules
- localStorage access always goes through `scripts/storage.js` — never call `localStorage` directly
- No global variables; everything is exported/imported explicitly

### 10.3 CSS

- All CSS custom properties are defined in `theme.css :root` — never hardcode colors or font names in other stylesheets
- Subject stylesheets add only subject-specific rules; they import nothing (just included via `<link>`)
- No CSS preprocessors, no utility-class frameworks (no Tailwind etc.)
- Hover states always use the `--accent` color (or `--accent-warm` for animated/warm contexts) and `transform: translateY(-2px)`
- Transitions always use `var(--transition)` (`0.25s ease`)

### 10.4 HTML structure

Every page must have, in order:
1. `<head>` with charset, viewport, title, Google Fonts, `theme.css`, then page-specific CSS
2. `<header class="site-header">` with brand + nav
3. `<main class="page">` (or `page page-wide`) with `.crumbs` as first child
4. Content
5. `<script type="module">` at the bottom of `<body>`

### 10.5 Adding a new exercise page

1. Create `exercice-N.html` (problem statement + mode-grid)
2. Create `exercice-N-correction.html` (prose with KaTeX)
3. Create `exercice-N-animation.html` (mounts `mountPresentation()`)
4. Create `scripts/<subject>/exercice-N-scenes.js` (exports `presentation` object)
5. Add an `.exo-card` to `exercices.html`

### 10.6 Adding a new subject module

1. Create the directory under the subject folder
2. Create `index.html` following hub structure (crumbs, `.sub-grid`)
3. Add a `.sub-card` link to the subject's `index.html`
4. Add subject-specific CSS to `styles/<module>.css`
5. Add subject-specific scripts to `scripts/<module>/`

### 10.7 Accessibility

- Interactive elements have appropriate `role` and `aria-label` attributes (chapter tablist, progress live region)
- Keyboard navigation is supported on all animated pages (arrow keys, space, escape)
- Color is never the only indicator of state — shape/text also changes

### 10.8 Performance

- No external JS libraries except KaTeX (lazy-loaded on first use)
- Google Fonts loaded with `rel="preconnect"` + `display=swap`
- SVG figures are generated in JS and injected into the DOM — not loaded as separate files
- No images on functional pages (except the project showcase page)
- localStorage is the only persistence mechanism

---

## 11. What the site should never do

- Use a JS framework (React, Vue, Svelte, etc.)
- Use a CSS framework (Tailwind, Bootstrap, etc.)
- Require a build step or bundler
- Store any user data on a server (no backend, no accounts)
- Track users or load analytics
- Use hardcoded hex values outside of `theme.css`
- Break the dark theme (never force a white background except inside PDF iframes)
- Add English UI text (all visible strings must be French)
- Use `localStorage` directly — always use `scripts/storage.js`

---

## 12. Current content inventory

| Section | Status | Modules |
|---|---|---|
| Languages | Open | Chinese: flashcards, exercises, vocabulary |
| Physics | Open | Thermodynamique (2 exercises), Électrocinétique (1 exercise) |
| Computer Science | Open | ASD: 1 course + 5 exercises; Spoon-knives project |
| Mathematics | Open | Algèbre linéaire: 4 concept pages + 2 exercises |

The ASD module covers: stack/heap/pointers course, reference exchange, pointer exchange, alias vs copy, factorial recursion, recursive array sum — all in C/C++.

The Algèbre linéaire module has four concept pages (nilpotence, diagonalisation, trace-determinant, rang), each following a fixed order: phrase d'accroche → intuition → définition formelle → exemple calculé → visualisation interactive → pièges classiques → mini-exercices (collapsible `<details>`). Each page embeds an interactive vanilla-JS demo from `scripts/math/` (derivative-demo, eigen-demo, transpose-demo, rank-demo) built on two shared helpers: `svg-utils.js` (2D plane/grid SVG with matrix-transformed grids, subspace staircase, monomial shift row) and `matrix-grid.js` (HTML matrix renderer with bracket styling, cell tints and flash/flip animations). Interactive demos and animator figures render math exclusively via `renderKatex` from `katex-loader.js`; static prose uses the KaTeX CDN auto-render scripts (with `ignoredClasses: ['la-demo']`). Two exercises follow the standard triple pattern (statement / written correction / animated correction): Exercice 1 — trace and determinant of the transposition operator φ(M)=Mᵀ on Mₙ(ℝ); Exercice 2 — nilpotence of the derivative operator D on ℝₙ[X].
