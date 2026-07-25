# Rules for coding agents (Codex, etc.)

This repo has two systems: the legacy no-build static site at the root
(contract: `DESIGN.md`) and the Next.js platform in `platform/` (contract:
`platform/CLAUDE.md`). Read the relevant contract before editing.

## Hard guardrails

- **Never lock content.** No score, quiz result, completion flag, or lesson
  state may ever gate access to any lesson, exercise, solution, or exam.
  Timers stay optional and pausable. Hints carry no penalty.
- **Design tokens only.** No hardcoded hex colors outside
  `styles/theme.css` / `platform/tailwind.config.ts` / `platform/app/globals.css`.
  Dark theme only. Reuse existing component classes (`.sub-card`, `.prose-page`,
  `.btn`, learn-track classes) before inventing new ones.
- **No CDN / third-party runtime origins** in `platform/` (tight CSP).
  Never `dangerouslySetInnerHTML` with dynamic content.
- **KaTeX, never MathJax.** In platform MDX, math flows through
  remark-math/rehype-katex: inline `$...$` must NOT span a line break;
  long formulas go in `$$ ... $$` display blocks with blank lines around.
- **Provenance stays visible.** Reconstructed exams/lessons are never
  presented as official Paris-Saclay material.
- **Do not revert these deliberate changes** (they have been accidentally
  clobbered before):
  - `platform/app/[locale]/layout.tsx` — the header "Physique" link
    (`legacyPhysicsHref`).
  - `platform/app/[locale]/math/page.tsx` — the active cards for
    "Fonctions de plusieurs variables" and "Algèbre linéaire".
  - The four electromagnetism cards in `physics/index.html`,
    `fr/physics/index.html`, `es/physics/index.html`, and the
    fonctions-plusieurs-variables cards in the three `math/index.html` files.

## L2 Chimie learning tracks (platform)

- Metadata (ids, titles, difficulty, provenance) lives in
  `platform/lib/content/*.ts`; MDX references it by id only
  (`<LessonMeta id="…" />`, `<ExerciseView id="…">`). Keep both sides in sync.
- Shared components live in `platform/components/learn/` and are registered in
  `platform/mdx-components.tsx`. Available in MDX without import: Accroche,
  Pitfall, Collapsible, LessonMeta, RelatedExercises, KeyResults, Toc,
  LessonStateSelector, ProvenanceBadge, ExerciseView, Statement, FinalAnswer,
  Solution, CommonErrors, HintLadder, Hint, Quiz, QItem, QOption, QFeedback,
  QExplain, QNumeric, MockExamView, ExamProblem, Mission, MissionSolved,
  Rappel, and the interactive widgets (SurfaceLevelWidget, GradientWidget,
  CriticalPointsWidget, PhasePortraitWidget, TraceDetWidget, OscillatorWidget,
  FieldMapWidget, GaussSymmetryWidget, DipoleTorqueWidget, BiotSavartWidget,
  MultipoleFarFieldWidget, CyclotronWidget, LinearAlgebraWidget).
- Content language: authored in French first (`content.fr.mdx`), with `content.en.mdx` and `content.es.mdx` per-locale siblings kept structurally identical (checked by `verify:content`).

- Course content authoring/rewrites: follow `COURSE_PLAYBOOK.md` (pedagogy rules, process, gates, MDX gotchas) and the `codex-*.md` work orders.

## Verify before you finish

From `platform/`:

```
npm run verify:content   # MDX ↔ registry integrity, math delimiters, quizzes
npx tsc --noEmit
npm run build            # must pass with zero errors
```
