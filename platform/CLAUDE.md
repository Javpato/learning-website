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

## Commands
- `npm run dev` — dev server (http://localhost:3000, `/` → `/fr`).
- `npm run build` — production build; must pass with no TS/MDX errors. r3f/Mafs scenes
  are client components (`"use client"`); keep `window`/DOM access out of module scope.

## Status
- ✅ Scaffold, app shell, i18n (fr/es/en), ported tokens.
- ✅ `topologie-calcul-differentiel` module hub + full **differentiabilite** page
  (Mafs 2D + r3f 3D + mathjs + KaTeX proofs).
- ⬜ Port legacy `algebre-lineaire` (4 concepts + 2 exercises) into MDX.
- ⬜ Split per-locale content; promote `platform/` to repo root; choose deploy host.
