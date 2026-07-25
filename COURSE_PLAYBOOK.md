# Course quality playbook

How the FMV maths overhaul (PR #31) reached its quality level, written so the
next course (physics, chemistry, anything) can reproduce it. Composable with
`codex-fmv-rewrite.md` (the concrete lesson spec born from this playbook —
copy and adapt it per track).

## 1. The pedagogy (what makes it feel like a real cours)

Grounded in real French polycopiés (Exo7 « Fonctions de plusieurs variables »,
Poitiers CoursPC, Toulouse III L2PS) and evidence from learning science
(worked-example effect — Renkl/Sweller; self-explanation — Chi; advance
organizers — Ausubel; anchored instruction; PhET guided-inquiry).

The canonical chapter rhythm of a real polycopié: short motivating intro →
numbered **Définition → Exemple(s) immédiats → Remarque → Proposition/Théorème
→ Démonstration** → Mini-exercices per section. Terms are never used before
their Définition. The genre's one defect (applications mentioned once, then a
tail section) is exactly what we fix.

The 12 rules (all mandatory; the learner complaints each rule answers are in
`codex-fmv-rewrite.md`):

1. **Mission = 4 labeled parts, ≤8 lines, concrete numbers**: Situation
   (quantitative domain scenario) → Question précise (a number or decision at
   stake) → Obstacle nommé (why the previous toolbox fails) → Contrat ("N
   outils; à la fin on résout ce problème, chiffres à l'appui").
   **Test: the mission must be statable with ZERO chapter vocabulary.**
2. **Plan de bataille** right after: the N tools as capabilities, one line
   each; each section opens by naming the tool it delivers.
3. **No cold definitions** — every Définition preceded by one sentence
   "Problème : … Il nous faut donc un mot/outil pour …".
4. **Numbered blocks, Exo7 style** (bold labels in prose, per-type counters);
   cite blocks by number when used later ("d'après la Définition 2").
5. **Définition → exemple immédiat → contre-exemple/Remarque** within lines.
6. **Define-before-use, mechanically**: first appearance = `<Def>` site or a
   `<Terme>` link; informal gloss in parentheses at the definition itself.
7. **Worked examples: action + « Pourquoi ? » per step** — the Pourquoi names
   a goal or cites a numbered block, never paraphrases the action. One
   self-explanation prompt (collapsible answer) at the end.
8. **Fading**: fully annotated example → "à toi" partial → bare exercise.
9. **One fil rouge domain system per lesson**, present in 5 fixed slots:
   mission, ≥1 "Exemple (chimie)" per section, notation-translation Remarque,
   visualisation, MissionSolved. Same symbols throughout. Stories may chain
   across lessons (FMV: the double-well PES spans L02→L06→L08→L10).
10. **Visualisation guidée, not posée**: 2-3 Prédis→Agis→Observe→Relie cycles
    max, phrased on content ("amène le niveau juste au-dessus de 1") never on
    UI ("clique le curseur"); each cycle closes citing the block illustrated;
    end with an invitation to free play.
11. **Mini-exercices close each tool section** (2-4 items ≤2 min, first one on
    the fil rouge; `<Quiz>`/`<QNumeric>` when checkable).
12. **MissionSolved solves THE mission's numbers**, citing tools by block
    number; the Résumé restates the plan de bataille as "ce que tu sais faire".

Tone: warm « tu », encouraging. No cultural references without a gloss
("carte topographique (carte de randonnée)", never "carte IGN"). 300–500
lines per lesson; rigor is folded into `<Collapsible>`, never deleted.

## 2. The process (how to run it)

1. **Research first**: read 2-3 real polycopiés of the target course before
   writing any spec; extract the genre's conventions and its gaps.
2. **Write the spec as a Codex work order** (`codex-<track>-rewrite.md`):
   skeleton in exact order, the 12 rules, a per-lesson table (fil rouge
   system + assigned `<Def>` ids + widget), MDX safety rules, forbidden
   files, acceptance checklist. The glossary (`lib/content/glossaire-*.ts`)
   is the single source of term ids — writers may never invent ids, only
   report missing ones (then extend the glossary and run a follow-up pass).
3. **Pilot one lesson** — the most criticized one — and review it fully
   (human-level read) before scaling. Revise the spec from the pilot.
4. **Scale in parallel pairs**, each run reading the accepted pilot for voice
   continuity. Forbid `npm run build` inside parallel content jobs (`.next`
   collides); the orchestrator runs builds.
5. **Review at scale** = structural audit script (Def ids exactly as
   assigned, 4 mission markers, `Étape` count == `Pourquoi ?` count, ids
   unchanged, widget tag intact, cycles count) + spot-read of Mission and
   MissionSolved + arithmetic check of the mission's numbers. Full reads
   only for the pilot.
6. **FR first, translate after** (`codex-fmv-translate.md` conventions:
   battle plan / Predict.-Act.-Observe.-Connect. / Predice.-Actúa.-Observa.-
   Relaciona., Definition/Definición…, TD glossed at first use, British EN
   matches glossary labels, decimal-comma math kept byte-identical).
   Link passes (`codex-fmv-links.md`) are insertion-only and verified so:
   strip `<Terme>` tags from added diff lines → must equal removed lines as
   a multiset.
7. **Gate everything** (see §4) and commit per reviewed unit with explicit
   file paths — never `git add` a directory while a parallel job writes in it.

## 3. Technical gotchas (each cost real debugging)

- **RSC child-identity trap**: a `"use client"` component can NEVER match MDX
  children with `c.type === SomeComponent` — across the server/client
  boundary `.type` is a lazy reference. This silently blanked all 138 quizzes
  and every hint ladder. Discriminate on props shape (`typeof c.type ===
  "string"` → host/prompt; else `props.of` / `props.id` / fallback), and
  recurse into host elements because authors sometimes omit the blank line
  before `<QOption>` (MDX then nests options inside the prompt `<p>`).
  Any new compound component must use props-only APIs.
- **`$$` fences**: micromark closes a multi-line math block ONLY on a bare
  `$$` line. `$$content…\n…content$$` silently swallows the rest of the page
  (lesson 05 lost 90% of its content with a green build). Single-line
  `$$…$$` is fine. `verify-content.cjs` now enforces this.
- **No `$`/KaTeX in component string props** (`title=`, `fil=`, glossary
  `short`) — they render as plain attributes. Unicode (q₁, ∂, ±) is fine.
- **Anchors**: never deep-link rehype-slug heading ids (accented, encode
  badly). Mint ASCII anchors by convention (`def-<id>`) via a component.
- **`glob` in Python treats `[locale]` as a character class** — always
  `glob.escape()` the app-dir path segment (a silent zero-file scan "passed"
  once).
- **Build**: `out/` only regenerates with `GITHUB_PAGES=true`; needs
  `NODE_OPTIONS=--max-old-space-size=8192`. Never trust a stale `out/`.
- **Canaries after build** (all three locales): every `#def-x` href has a
  matching `id="def-x"`; every lesson page contains `lesson-state` (the last
  component — catches silent truncation); grep counts of `quiz-option` and
  `hint-toggle` > 0.
- **Codex CLI**: run it with the harness sandbox disabled (it needs repo
  writes); usage limits can reset within hours despite the error's date;
  probe with a trivial `codex exec` before declaring it down. Claude
  subagents can substitute for mechanical phases (translation, link passes)
  using the same work orders.

## 4. Verification gates

| Gate | Command |
| --- | --- |
| Content integrity + parity | `npm run verify:content` (platform/) |
| During FR-first window | `VERIFY_SKIP_PARITY=1 npm run verify:content` |
| Final: every glossary entry has its Def | `VERIFY_STRICT_GLOSSARY=1 npm run verify:content` |
| Static export | `GITHUB_PAGES=true NODE_OPTIONS=--max-old-space-size=8192 npm run build` |
| Post-build canaries | anchor↔link match, truncation canary, quiz/hint greps (§3) |

## 5. Reusing the glossary mechanism for a new track

1. Data module `platform/lib/content/glossaire-<track>.ts` (`id` ASCII kebab,
   `label`/`short` trilingual, `lessonId`); wire into `registry.ts`
   (`getTerme`, `termeHref`) — or generalize the existing ones.
2. `<Def id>` once, at the definition site, never in a heading; `<Terme id>`
   everywhere else (first occurrence per exercise/problem/section).
3. Extend `verify-content.cjs`'s glossary block to the new file, keep the
   `Def:`/`Terme:` tokens in the locale-parity sets.
