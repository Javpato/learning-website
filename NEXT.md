# Next task — physics EM track overhaul

Handoff brief. Written 2026-07-31, after the FMV maths overhaul (PR #31) and the
skills setup. Delete or rewrite this file when the task is done.

## Where things stand

The FMV maths track is at the playbook bar. **The physics EM track is not**, and
it serves the same L2 Chimie student — the other half of the same semester.

Measured across `platform/app/[locale]/`:

| | FMV lessons | Physics EM lessons |
| --- | --- | --- |
| `<Mission>` | 2 per lesson | 2 per lesson ✅ |
| `Pourquoi ?` (Rule 7) | 5–7 per lesson | **0** |
| `<Def>` (Rule 6 / glossary) | 2–8 per lesson | **0** |
| Lines | 450–537 | 179–432 |

Physics has the scaffolding but none of the pedagogy: no self-explanation
chains, no define-before-use, and no `glossaire-em.ts` at all. The thinnest
module is `multipoles-interactions` (~185 lines/lesson, roughly half target)
— which is also the most chemistry-relevant content on the site (molecular
dipoles, van der Waals forces, polarisability).

13 lessons in scope: électrostatique (5), magnétostatique (3),
multipôles-interactions (3), particules-chargées (2). Plus 7 TDs, 3 exams and a
formulaire for the later link pass.

## The plan

**Phase 0 — harden the gates before generating anything.**
The post-build canaries in `COURSE_PLAYBOOK.md` §3/§4 (anchor↔link match,
`lesson-state` truncation canary, quiz/hint greps) exist only as prose. Turn
them into a script and wire it into `.github/workflows/`. Both of the worst
past incidents — L05 losing 90% of its content, 138 quizzes blanking — shipped
behind green builds. Do this first; the `webapp-testing` skill covers the
browser-assertion half.

**Phase 1 — track prep.**
- `RESOURCES.md` for EM: read 2–3 real French EM polycopiés, record which
  sources, which conventions, which gaps. (FMV's sources were never written
  down — do not repeat that.)
- `platform/lib/content/glossaire-em.ts` + generalize `getTerme`/`termeHref` in
  `registry.ts` — `COURSE_PLAYBOOK.md` §5 has the recipe.
- `codex-em-rewrite.md`, adapted from `codex-fmv-rewrite.md`: per-lesson fil
  rouge, assigned `<Def>` ids, widget per lesson.

**Phase 2 — pilot one lesson, full human-level read, then revise the spec.**
Pilot `physics/multipoles-interactions/02-energies-interaction-forces-moleculaires`:
thinnest lesson so the rebuild exercises the whole template, most
chemistry-load-bearing so the fil rouge writes itself, and
`MultipoleFarFieldWidget` already exists.

**Phase 3 — scale in parallel pairs, FR first**, then translate, then the
insertion-only link pass. Gate at each step.

## Design intent worth keeping

Rule 9 permits a story chaining across lessons (FMV ran a double-well PES
across L02→L06→L08→L10). Physics EM has an obvious one that does not currently
exist: a molecular-dipole arc through `électrostatique/04` → `multipôles/01` →
`02` → `03`, one molecule (HCl or water), same symbols throughout, ending in
van der Waals forces. That arc is the chemistry payoff of the physics track.

## Out of scope

- CS Python/SQL — different genre, working, leave it.
- Topologie + algèbre linéaire — pre-playbook but supplementary, not exam-bearing.
- Promoting `platform/` to the repo root — not mid-overhaul.

## Skills that cover this work

`course-authoring` (rules, process, review), `mdx-safety` (read before any
`.mdx` edit), `course-translate` (Phase 3). They are thin wrappers — the source
of truth stays in `COURSE_PLAYBOOK.md` / `AGENTS.md` / the `codex-*.md` work
orders, because Codex reads those files and must not drift from what Claude
reads. Keep it that way: extend the markdown, not the skills.

---

# Update 2026-09-02 — Réseaux track landed (cs/reseaux)

A full new track was built in one session from the learner's own course
material (`/home/javpato/Desktop/documentos/cours/Réseaux/` — 4 slide decks,
6 corrected TDs, socket TP, 7 exam papers, all read; inventory:
`RESOURCES-reseaux.md`, spec: `codex-reseaux-rewrite.md`):

- 14 lessons (00–13) at the playbook bar (Mission from real annale numbers,
  numbered blocks, per-step Pourquoi, guided widget cycles, Pièges from real
  graded copies, QCM items from the annales, MissionSolved, KeyResults);
- TD 1–7 (47 exercises, source-faithful corrigés in exam form; td-7 = the C
  sockets lab as a guided build);
- 3 mock exams (cc 1 h, partiel 2 h, final) assembled from the annales with
  **renewed numbers** (the originals are solved in the lessons);
- formulaire (decision instrument + "erreurs qui coûtent des points" from
  the graded copies) and plan-de-travail;
- 9 interactive widgets (`components/cs/scenes/`) over engines in `lib/cs/`
  — `npm run verify:reseaux` asserts 55 corrigé values (fragment tables, DV
  iterations, Dijkstra labels, REJ/SREJ chronograms, SEQ/ACK…): keep green;
- glossary `glossaire-reseaux.ts` (124 terms, all Defs placed — strict
  glossary check passes), subject `"cs"` + provenance `"cours"` added to the
  registry/types/verify machinery; legacy CS hubs (en/fr/es) got the card.

EN/ES siblings were produced by translation subagents in the same session;
`npm run verify:content` (full parity) is the gate that proves them.

Still open (small): the physics overhaul above remains; the analyse TD
LaTeX corruptions listed below it too.

Bonus repair found while gating the réseaux track: **48 inline math spans
wrapped across line breaks** (rendering as literal dollar text behind a
green build) in 19 files of the physics and FMV tracks — all joined, and
`verify-content.cjs` now fails on any new occurrence ("inline $…$ spans a
line break").
