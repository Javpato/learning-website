---
name: course-authoring
description: Use when writing, rewriting, reviewing or specifying course lesson content for the platform — new tracks, lesson overhauls, missions, worked examples, guided visualisations, mini-exercises, glossary Def/Terme assignment, or when producing a per-track Codex rewrite work order. Covers the 12 pedagogy rules, the pilot-then-scale process, the review-at-scale audit, and the verification gates. Invoke before authoring or judging any lesson MDX prose.
---

# Course authoring

The quality bar and the process that produced it are in **`COURSE_PLAYBOOK.md`**
— read it now. This skill does not restate the rules; it tells you how to apply
them, and it deliberately keeps the source of truth in one file because Codex
reads the repo markdown and would otherwise drift from what Claude reads.

Read in this order:

1. `COURSE_PLAYBOOK.md` — §1 the 12 pedagogy rules, §2 the process, §3 technical
   gotchas, §4 gates, §5 the glossary mechanism for a new track.
2. `AGENTS.md` — hard guardrails. **Never lock content** is the one that most
   often gets violated by well-meaning "progression" ideas.
3. `codex-fmv-rewrite.md` — the reference work order. This is the *shape* to
   copy for a new track, not content to reuse.
4. The `mdx-safety` skill — before touching any `.mdx`.

## Division of labour

Claude specs and reviews; Codex writes bulk content under those specs. Keep it
that way — the work order is the interface between them.

- **The skill holds** the rules, the process, the review procedure.
- **The work order holds** the per-track specifics: the per-lesson table
  (fil rouge system + assigned `<Def>` ids + widget), the writable-file list,
  the forbidden-file list, the acceptance checklist.
- **The glossary** (`platform/lib/content/glossaire-<track>.ts`) is the single
  source of term ids. Writers may never invent ids — only report missing ones,
  after which you extend the glossary and run a follow-up link pass.

## Producing a work order for a new track

Follow `COURSE_PLAYBOOK.md` §2 steps 1–2, and §5 for the glossary wiring.
The order must contain, in this sequence:

1. Read-`AGENTS.md`-first instruction and the batch scoping ("do ONLY the
   lessons named in your prompt").
2. The skeleton in exact order, and the 12 rules restated as writer-facing
   instructions with the learner complaint each one answers.
3. The per-lesson table: fil rouge domain system, assigned `<Def>` ids, widget.
4. MDX safety rules (point at the `mdx-safety` skill's content; do not
   paraphrase loosely — the `$$` fence rule must be verbatim).
5. Writable files, forbidden files.
6. A self-verifiable acceptance checklist ending in the `verify:content` gate.

**Record the research.** `COURSE_PLAYBOOK.md` §2 step 1 says to read 2–3 real
polycopiés before writing the spec. Write what you found into a
`RESOURCES.md` for the track — which sources, which conventions extracted,
which gaps the genre leaves. FMV's sources exist only as a sentence of prose;
do not repeat that.

## Reviewing content

Full human-level reads are for the **pilot only**. At scale, per
`COURSE_PLAYBOOK.md` §2 step 5, use a structural audit plus targeted reads:

- `<Def>` ids exactly as assigned in the table; no invented ids.
- 4 mission markers present; the mission is statable with **zero chapter
  vocabulary** (Rule 1's test — apply it literally).
- `Étape` count == `Pourquoi ?` count, and each *Pourquoi* names a goal or
  cites a numbered block rather than paraphrasing the action (Rule 7).
- ids unchanged, widget tag intact, guided-visualisation cycle count ≤ 3.
- Spot-read Mission and MissionSolved; **check the mission's arithmetic** —
  MissionSolved must solve the mission's actual numbers (Rule 12).

## Scaling

Pilot the most-criticised lesson first, review it fully, revise the spec from
what you learn, then scale in parallel pairs — each run reading the accepted
pilot for voice continuity. **Forbid `npm run build` inside parallel content
jobs** (`.next` collides); the orchestrator runs builds. Commit per reviewed
unit with explicit file paths.

FR first, always. Translation and link passes come after, via the
`course-translate` skill.

## Gates

`COURSE_PLAYBOOK.md` §4. Content is not done until `verify:content` passes
without flags, `tsc --noEmit` is clean, the static export builds, and the
post-build canaries pass in all three locales.
