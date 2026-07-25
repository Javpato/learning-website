# Formules Vivantes — platform/

Interactive, rigorous mathematics platform. The goal: make formulas **feel alive**
through interactive visualization **without sacrificing rigor** — definitions, theorems,
and *proofs* stay; they are illustrated, not dropped.

This `platform/` app is the new home of the project. It is **additive**: the legacy
no-build static site still lives at the repository root (`../index.html`, `../math/`,
`../es/`, etc.), untouched and still deployable, with its original `../DESIGN.md` as
historical reference. Content migrates into `platform/` incrementally; once mature,
`platform/` is promoted to the repo root.

## Stack (and why)

| Piece | Why |
| --- | --- |
| **Next.js (App Router) + TypeScript** | SSR/SEO for a public resource; file routing; i18n via `[locale]` segments. |
| **MDX** | Rigorous prose + KaTeX proofs in Markdown with **inline React widgets** — the keystone uniting rigor and interactivity. |
| **Mafs** | React-native 2D math plane (plots, points, segments, vectors). |
| **react-three-fiber + drei** | Declarative 3D (surface, tangent plane); shares React state with the 2D scene. |
| **KaTeX** (`remark-math` + `rehype-katex`) | Math typesetting, configured in `next.config.mjs`. |
| **mathjs** | Live symbolic/numeric compute (gradients, residuals) in `lib/math/`. |
| **Tailwind** | Dark-theme UI shell; tokens ported from the legacy site for visual continuity. |

## The 8-part page method (pedagogical contract)

Every concept page follows this spine (extends the legacy `algebre-lineaire` template):

1. **Accroche** — one-sentence intuitive tagline (`<Accroche>`).
2. **Intuition** — geometric/operational picture.
3. **Définition formelle** — rigorous, no hand-waving.
4. **Exemple calculé** — fully worked.
5. **Visualisation interactive** — the live 2D/3D widget.
6. **Démonstration** — the actual proof, in `<Collapsible>` steps, with a visual companion where possible.
7. **Pièges classiques** — mistakes / counterexamples (`<Pitfall>`).
8. **Mini-exercices** — collapsible Q&A (`<Collapsible>`).

**Principle:** the interactive widget and the proof live in the *same* MDX document.

## Layout & conventions

```
app/
  layout.tsx                    # <html>, next/font, globals.css
  globals.css                   # ported design tokens + component classes (.prose-page, .sub-card, .accroche, .pitfall, .collapsible)
  page.tsx                      # redirects / -> /<defaultLocale>
  [locale]/
    layout.tsx                  # header, nav, locale switch; generateStaticParams -> fr/es/en
    page.tsx                    # platform home
    math/
      page.tsx                  # math hub (cards)
      <module>/
        page.tsx                # module hub (cards)
        <concept>/
          page.tsx              # server wrapper: locale-aware <Breadcrumbs> + imports ./content.mdx
          content.mdx           # the 8-section prose, KaTeX, and <Widget/> (NOT named page.* so it is not a route)
components/
  ui/                           # Accroche, Pitfall, Collapsible, Breadcrumbs, LocaleSwitch
  math/
    scenes/                     # one component per interactive widget (client components)
    primitives/                 # shared Mafs/r3f helpers (add as they recur)
lib/
  i18n/                         # config (locales, default 'fr') + dictionaries (fr base; es/en override + fall back to fr)
  math/                         # mathjs-backed engines (e.g. calculus.ts: ScalarField2D)
mdx-components.tsx              # global MDX component map; register new widgets here so they work unqualified in .mdx
```

### Why concept pages are `page.tsx` + `content.mdx` (not bare `page.mdx`)
A bare `page.mdx` can't read the `locale` param, so its breadcrumbs/links couldn't be
locale-aware. The thin `page.tsx` wrapper reads `params.locale`, renders `<Breadcrumbs>`,
and renders the shared `content.mdx`. Hubs are plain `.tsx` (cards need the locale too).

### Design tokens
Ported from `../styles/theme.css` into `tailwind.config.ts` (colors, fonts) and mirrored
as CSS variables in `globals.css`. Key tokens: `bg #0e1116`, `bg-elevated #161a22`,
`fg #e8e6e3`, `fg-muted #9aa0a6`, `accent #58a6ff`, `accent-warm #f5b942`. Fonts:
EB Garamond (headings), Inter (body), JetBrains Mono (code/numbers), loaded via
`next/font` as `--font-serif/-sans/-mono`.

### i18n rules
- `locales = ['fr','es','en']`, default `fr` (`lib/i18n/config.ts`).
- **Author in French first.** `content.mdx` is shared across locales for now, so all three
  routes render the FR content until per-locale content is split out.
- UI strings live in `lib/i18n/dictionaries.ts`: `fr` is the base; `es`/`en` provide
  partial overrides and **fall back to fr** for any missing key (`getDictionary`).
- Keep math notation locale-neutral.

## How to add a new concept page
1. `app/[locale]/math/<module>/<concept>/content.mdx` — write the 8 sections (FR), `$...$`
   / `$$...$$` for math, `<Accroche>`, `<Pitfall>`, `<Collapsible>` for structure.
2. `app/[locale]/math/<module>/<concept>/page.tsx` — copy the differentiabilite wrapper;
   adjust the `<Breadcrumbs>` items and `metadata.title`.
3. Add a card linking to it in the module hub `page.tsx`.

## How to add a new interactive scene
- **2D → Mafs** (`components/math/scenes/Foo2D.tsx`, `"use client"`): use `Mafs`,
  `Coordinates.Cartesian`, `Plot.OfX`, `Point`, `Line.Segment`, `Vector`, `Text`, `Theme`.
- **3D → react-three-fiber** (`components/math/scenes/Foo3D.tsx`, `"use client"`): a
  `<Canvas>` with `OrbitControls`; build geometry from `BufferGeometry`; animate with
  `useFrame`. Coordinate convention used here: three `x` = math x, three `z` = math y,
  three `y` = function height.
- **Shared state**: a parent widget (e.g. `DiffWidget`) owns the single state object and
  passes it to both scenes + the `lib/math` engine, so manipulation, picture, and number
  stay in sync. Register the parent widget in `mdx-components.tsx`.
- Put math (gradients, residuals, evaluation) in `lib/math/`, never inline in scenes.

## Security (non-negotiable)

This is a public, **static** site (`output: 'export'` on GitHub Pages — no server, no
backend, no shared database). **Design every page and widget to be secure by default.** The
threat model is a static, client-side one, so the rules below — not classic server-side
SQL-injection defence — are what matter here.

- **Treat all learner input as untrusted.** The SQL editor, URL/query params, anything a
  user can type. Render it **only** through React's automatic escaping. **Never**
  `dangerouslySetInnerHTML` with dynamic/user content — if you reach for it, stop and find
  another way. (MDX prose is author-trusted; user-supplied values are not.)
- **Sandbox any code execution.** SQL runs in real in-browser SQLite (`sql.js`), so arbitrary
  SQL is *expected* — it only touches a throwaway in-memory DB in the user's own tab, reset
  on reload. Run it in a **Web Worker** with a **query timeout** (terminate + reseed on
  overrun) and a **row cap** so a runaway query can't freeze the page or exhaust memory. See
  `lib/sql/engine.ts`.
- **No third-party runtime origins.** Self-host runtime assets (the `sql.js` wasm + worker
  live in `public/sql/`, addressed via `NEXT_PUBLIC_BASE_PATH`). Pin dependency versions and
  keep `npm audit` clean. Adding a CDN/script/style/font/connect origin means widening the
  CSP — justify it first.
- **Keep the CSP tight.** Delivered as a `<meta http-equiv>` in `app/layout.tsx` (GitHub
  Pages can't set headers). It locks everything to `'self'` plus the minimum needed
  (`'wasm-unsafe-eval'` for SQLite wasm; `'unsafe-inline'` for Next's inline bootstrap and
  KaTeX/Mafs inline styles — unavoidable on a nonce-less static export). Don't loosen it
  without cause. Known gaps (cannot be set via `<meta>` / on GitHub Pages): `frame-ancestors`,
  HSTS, `X-Frame-Options`, `X-Content-Type-Options`.
- **No secrets in the client bundle.** Everything ships to the browser; there is nowhere to
  hide a key.
- **Verify before shipping data-driven content.** `node scripts/verify-sql.cjs` runs every
  `expected` query in the SQL course against the seed to catch SQL errors.

## Computer Science / SQL course

`app/[locale]/cs/` is the CS subject (sibling of `math/`). Its first module, `cs/sql/`, is an
interactive SQL course (6 chapters + a cumulative project each, following the Data-with-Baraa
ordering). Exercises use `<SqlExercise>` (in-browser SQLite) and `<SqlSchema>`; the shared
sample DB is `lib/sql/seed.ts`, the engine `lib/sql/engine.ts`. Content is English-first
(`content.en.mdx`); fr/es routes fall back to English until translated.

## Computer Science / Python course

`cs/python/` is a Codédex-style interactive Python course — **Spanish-first** (authored
`content.es.mdx`; every locale renders the ES content). It is surfaced on **every** locale's CS hub
(`cs/page.tsx`, with an "· en español" note off-`es`) and bridged from the legacy static CS pages
(`computer-science/index.html`, `es/computer-science/index.html`). Structure mirrors the SQL course:
interactive chapters (fundamentals → advanced Python) interleaved with **guided projects the learner
codes on their own machine and pushes to GitHub** (the project page guides — spec, steps, hints,
README template — but never ships the full solution). Full course: 8 modules (~23 chapters + 11
projects, incl. a Pygame module) ending in a Pygame platformer capstone (`project-capstone-plataformas`).
Pygame chapters are concept lessons (Pyodide can't run pygame) with browser-runnable *logic* exercises;
other chapters stay pure Python.

- **Course map + Pokémon theme:** the single source of truth is `lib/python/course.ts` (`MODULES` →
  units, each tagged with a Pokémon sprite — chapters = first-stage evolutions, projects = final-stage,
  capstone = legendaries). Sprites are self-hosted animated GIFs in `public/pokemon/` (no CDN;
  `img-src 'self'` already allows them). The hub (`cs/python/page.tsx`) renders `<CourseGrid>` +
  `<CourseProgress>`; each unit page gets a "¡Completar nivel!" button + congrats animation via
  `<UnitFooter>` (mounted once in `app/[locale]/cs/python/layout.tsx`). **Progress** is per-browser in
  `localStorage` (`lib/progress.ts`) — no account/backend, matching the static model. Theme CSS
  (`.pkmn*`, `.congrats*`, `.course-progress*`) lives at the end of `globals.css`.

- **Runner:** `<PyExercise>` (`components/cs/PyExercise.tsx`) runs **real CPython** via **Pyodide
  (WASM)** in a Web Worker — the exact counterpart of `<SqlExercise>`. Engine:
  `lib/python/engine.ts` (`PyRunner`, same timeout-terminate-and-reboot robustness as `SqlRunner`).
  Worker: `public/pyodide/worker.js` (fresh namespace per run, captures stdout/stderr, feeds
  `input()` from a preset `stdin` prop, returns tracebacks instead of throwing). Checking compares
  captured stdout to `expected_output` (order-sensitive; `sameOutput` trims trailing whitespace).
- **Self-hosted runtime:** Pyodide is pinned (`pyodide` in `package.json`) and its base interpreter
  is vendored into `public/pyodide/` by `npm run vendor:pyodide` (no numpy/pandas wheels — beginner
  course doesn't need them; ~13 MB). No runtime CDN.
- **CSP:** Pyodide **requires `'unsafe-eval'`** (its WASM runtime evaluates generated JS at load —
  verified: without it the worker throws and Python never boots). `script-src` in `app/layout.tsx`
  was widened to include it; the real XSS defence remains React output escaping (never
  `dangerouslySetInnerHTML`), and learner code runs sandboxed in the Worker. See the comment there.
- **Verify:** `npm run verify:python` boots Pyodide in Node, walks every `content.es.mdx`, and for
  each checkable `<PyExercise>` runs the reference solution authored just above it in a
  `{/* sol: … */}` MDX comment, asserting its stdout matches `expected_output` (analog of
  `verify-sql.cjs`). Authoring rule: every `<PyExercise>` with an `expected_output` needs a `sol:`
  block immediately before it; free-run exercises (no `expected_output`) don't.

## L2 Chimie learning tracks (math FMV + physics EM)

Two course tracks reconstruct the Paris-Saclay **L2 Chimie** maths/physics UEs
(source blueprint: `../L2_Chimie_Paris_Saclay_Maths_Physics_Reconstruction.md`):

- **Math** `app/[locale]/math/fonctions-plusieurs-variables/` — 11 lessons
  (00–10), TD 1–7, 3 mock exams (`examens/{cc,partiel,final}`), `formulaire/`,
  `plan-de-travail/`.
- **Physics** `app/[locale]/physics/` — hub + 4 theme modules
  (`electrostatique/`, `magnetostatique/`, `multipoles-interactions/`,
  `particules-chargees/`), each with lessons + TDs; shared `examens/` and
  `formulaire/`. Physics is NOT a top-level card on the legacy home — its
  theme cards live inside the legacy `../physics/index.html` hub (all three
  locale trees).

Conventions specific to these tracks:

- **Metadata is data, prose is MDX.** IDs/titles/difficulty/provenance live in
  `lib/content/{types,math-fmv,physics-em,registry}.ts`; MDX references them
  by id only (`<LessonMeta id="math-fmv-c04" />`, `<ExerciseView
  id="phys-em-td1-01">`). Run `npm run verify:content` after editing either
  side.
- **Open access is a hard rule.** No score, state, or completion flag may ever
  gate content. Timers (MockExamView) are optional and pausable. Solutions and
  hints are always reachable; hints carry no penalty.
- **Provenance is displayed** (`ProvenanceBadge`): officiel / historique /
  reconstruction / probable / extension — mirroring the source document's
  tags. Never present reconstructed exams as official Paris-Saclay papers.
- Shared components live in `components/learn/` (LessonMeta, ExerciseView +
  slots, HintLadder, Quiz family, MockExamView, LessonStateSelector, Toc,
  KeyResults, ProvenanceBadge, hub card renderers); learner-chosen lesson
  states persist via `lib/learn/lessonState.ts` (localStorage, organizational
  only). Page wrappers use `lib/learn/lessonPage.tsx` (`renderLearnPage` +
  crumb helpers).
- Widgets: math scenes (SurfaceLevel, Gradient, CriticalPoints, PhasePortrait,
  TraceDet, Oscillator) in `components/math/scenes/`; physics scenes
  (FieldMap, GaussSymmetry, DipoleTorque, BiotSavart, MultipoleFarField,
  Cyclotron) in `components/physics/scenes/`; engines in `lib/math/{contours,
  odes,extrema,linearSystems}.ts` and `lib/physics/*.ts`.
- Content is **trilingual**: authored in French (`content.fr.mdx`), with
  `content.en.mdx` / `content.es.mdx` siblings kept structurally identical
  (`verify:content` enforces id + Def/Terme parity vs fr). MDX gotchas:
  inline `$...$` must not span a line break, and multi-line `$$` blocks must
  have each `$$` alone on its own line (an attached fence silently swallows
  the rest of the page — the verifier checks this).
- **Before writing or overhauling ANY course content, read
  `../COURSE_PLAYBOOK.md`** — the pedagogy rules, the orchestration process,
  the verification gates and the hard-won technical gotchas (RSC child
  identity, `$$` fences, canaries) that produced the FMV quality bar.
- **Maths FMV lessons follow the cours template** (spec: `../codex-fmv-rewrite.md`):
  4-part Mission (situation → question précise → obstacle → contrat) → plan
  de bataille → numbered Définition/Exemple/Remarque/Méthode blocks with
  motivation before every definition → per-step *Pourquoi ?* worked examples
  → scripted Visualisation guidée (Prédis/Agis/Observe/Relie cycles on the
  lesson's fil rouge system) → Pièges → Quiz → MissionSolved (solves the
  mission's numbers) → Résumé. Chemistry is the driving thread, not a tail
  section.
- **Glossary**: `lib/content/glossaire-fmv.ts` maps term ids to their
  definition lesson. `<Def id>` marks THE definition site (anchor
  `#def-<id>`, once per term, in the lesson the glossary names); `<Terme id>`
  deep-links any other mention (TDs, exams, other lessons) with a hover
  gloss. `verify:content` enforces resolution, uniqueness, placement and
  locale parity; `VERIFY_STRICT_GLOSSARY=1` additionally requires every
  entry's `<Def>` to exist (`VERIFY_SKIP_PARITY=1` relaxes locale parity
  during FR-first rewrites).

## Commands
- `npm run dev` — dev server (http://localhost:3000, `/` → `/fr`).
- `npm run build` — production build; must pass with no TS/MDX errors. r3f/Mafs scenes
  are client components (`"use client"`); keep `window`/DOM access out of module scope.
- `node scripts/verify-sql.cjs` — run every SQL-course `expected` query against the seed.
- `npm run vendor:pyodide` — copy the pinned Pyodide base runtime into `public/pyodide/`
  (re-run after bumping the `pyodide` version).
- `npm run verify:python` — boot Pyodide in Node and check the Python-course exercises.
- `npm run verify:content` — check the L2 Chimie tracks: MDX↔registry id integrity, math-delimiter balance, quiz correctness flags.

## Status
- ✅ Scaffold, app shell, i18n (fr/es/en), ported tokens.
- ✅ `topologie-calcul-differentiel` module hub + full **differentiabilite** page
  (Mafs 2D + r3f 3D + mathjs + KaTeX proofs).
- ✅ Legacy `algebre-lineaire` ported as an isolated localized MDX route:
  4 concepts, 2 fully corrected exercises, and shared interactive views.
- ⬜ Split per-locale content; promote `platform/` to repo root; choose deploy host.
