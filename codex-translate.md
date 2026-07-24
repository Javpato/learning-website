# Work order — Translate the L2 Chimie tracks to English and Spanish

Read `AGENTS.md` first; every rule there applies. This work order is executed
in PHASES — do ONLY the phase named in your prompt, nothing from other phases.

Scope: ONLY the L2 Chimie tracks (`platform/app/[locale]/math/
fonctions-plusieurs-variables/**` and `platform/app/[locale]/physics/**`,
plus the two metadata files). Do not touch topologie, algebre-lineaire, cs,
or legacy pages unless a phase explicitly names them.

## Background (already built — use, don't modify)

- `lib/content/types.ts` exports `L10nString` (`string | { fr, en?, es? }`)
  and `l10n(locale, s)`. All metadata title/objective/description fields are
  typed `L10nString`. Plain strings mean French.
- All learn components (LessonMeta, ExerciseView, Quiz, MockExamView, hubs,
  crumbs…) are already fully localized — component chrome needs NO work.
- `mathFmvCrumbs`, `physicsThemeCrumbs`, `physicsCrumbs` now accept an
  `L10nString` leaf. `PhysicsThemeHub` accepts `L10nString` intro/filLine.
- `scripts/verify-content.cjs` now checks that every `content.en.mdx` /
  `content.es.mdx` references EXACTLY the same component ids as its
  `content.fr.mdx` sibling.

## Translation rules (all phases)

- Translate ALL prose: paragraphs, list items, table cells, quiz options and
  feedback, and the text-valued component props (`<Collapsible title="…">`,
  `<KeyResults title="…">`, `<Rappel title="…">`, `<ExamProblem title="…">`,
  `<Mission fil="…">`, `<Quiz title="…">`, `<Hint title="…">` if present).
- NEVER change: component names/structure, `id="…"` props, numeric props,
  LaTeX math content, numbers, units, URLs/relative links (except visible
  link TEXT, which is translated).
- Keep French university terms (TD, partiel, contrôle continu, corrigé,
  barème) in EN/ES text, with a short gloss in parentheses at FIRST use per
  page — e.g. EN "the partiel (midterm exam)", ES "el partiel (parcial)".
- Tone: same warm, encouraging tu/you/tú register as the French.
- MDX safety: inline `$...$` must never span a line break (re-wrap prose
  freely, but keep each inline math span on one line); long math stays in
  `$$` blocks with blank lines around; no raw `{ } < >` in prose outside
  math; blank line after opening / before closing component tags.
- Academic precision beats fluency: translate terminology correctly
  (lignes de niveau → level curves / curvas de nivel; portrait de phase →
  phase portrait / retrato de fase; valeur propre → eigenvalue / valor
  propio; développement multipolaire → multipole expansion / desarrollo
  multipolar; moment dipolaire → dipole moment / momento dipolar).

## Wrapper pattern (used whenever a phase creates en+es files for a dir)

Replace the single-import `page.tsx` with:

```tsx
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { mathFmvCrumbs, renderLearnPage } from "@/lib/learn/lessonPage";
import ContentFr from "./content.fr.mdx";
import ContentEn from "./content.en.mdx";
import ContentEs from "./content.es.mdx";

export const metadata = { title: "<English title> — Learning" };

const CONTENT: Record<Locale, typeof ContentFr> = { fr: ContentFr, en: ContentEn, es: ContentEs };

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  return renderLearnPage({
    locale,
    Content: CONTENT[locale] ?? ContentFr,
    crumbs: mathFmvCrumbs(locale, { fr: "…", en: "…", es: "…" }),
  });
}
```

(Physics pages keep their `physicsThemeCrumbs(locale, "<slug>", …, leaf)` /
`physicsCrumbs(locale, leaf)` call — just make the leaf an `{ fr, en, es }`
object. The themeLabel argument may stay as it is; it is overridden from
data.)

## Phase 0 — Metadata + hub pages

1. `platform/lib/content/math-fmv.ts` and `platform/lib/content/physics-em.ts`:
   convert every French `title`, `objectives` entry, TD `title`, exam `title`,
   and `PHYS_THEMES` `title`/`description` into `{ fr: "<existing>", en: "…",
   es: "…" }` objects. Keep ids/slugs/numbers untouched.
2. `platform/app/[locale]/math/fonctions-plusieurs-variables/page.tsx` (module
   hub): move ALL hardcoded French prose (intro, fil-rouge line, arc promises,
   TD-first strip, section headings, boîte-à-outils card texts) into a local
   `const T: Record<Locale, {…}>` and render `T[locale] ?? T.fr`. Provide
   full en/es translations.
3. The four physics theme pages (`electrostatique/page.tsx` etc.): their
   `intro` and `filLine` props become `{ fr, en, es }` objects (translate).
4. `platform/app/[locale]/physics/page.tsx`: localize the remaining
   hardcoded French (section heading "Examens d'entraînement" and the
   formulaire / plan-de-travail card texts) with the same local `T` record
   pattern; REMOVE the `note`/`inFrenchNote` suffix from theme card titles
   (content is now being translated).
5. `platform/app/[locale]/math/page.tsx`: localize the
   "Fonctions de plusieurs variables" card (title/description per locale via
   a local record). Leave the other cards exactly as they are.
6. Verify: `npx tsc --noEmit` and `npm run build` from `platform/` must pass.

## Phase 1 — Math lessons EN+ES

For each of the 11 lesson dirs `00-remise-a-niveau` … `10-oscillateur-…`
under `platform/app/[locale]/math/fonctions-plusieurs-variables/`:
create `content.en.mdx` and `content.es.mdx` (full translations of
`content.fr.mdx`) and update `page.tsx` to the wrapper pattern with a
localized crumb leaf. Verify: `npm run verify:content`, `npx tsc --noEmit`,
`npm run build`.

## Phase 2 — Math TDs + exams + formulaire + plan EN+ES

Same treatment for: `td-1` … `td-7`, `examens/cc`, `examens/partiel`,
`examens/final`, `formulaire`, `plan-de-travail` (13 dirs). Verify as above.

## Phase 3 — Physics lessons EN+ES

Same treatment for the 13 physics lesson dirs under `electrostatique/`,
`magnetostatique/`, `multipoles-interactions/`, `particules-chargees/`.
Verify as above.

## Phase 4 — Physics TDs + exams + formulaire EN+ES

Same treatment for: `electrostatique/td-1..3`, `magnetostatique/td-4`,
`multipoles-interactions/td-5..6`, `particules-chargees/td-7`,
`examens/cc-electrostatique`, `examens/partiel-multipoles`, `examens/final`,
`formulaire` (11 dirs). Verify as above.
