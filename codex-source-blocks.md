# Work order — reshape a course source into pasteable blocks

**Give this whole file to the other AI, followed by the source material.**

Your job is mechanical, not editorial. You are converting a course source
(polycopié, annales, textbook scan, lecture notes) into a *block file* plus a
*manifest*. A second assistant will then decide the pedagogy and assemble the
final lesson. You are not that assistant. You write no lesson, no components,
no commentary.

The point of this format is that the downstream assistant never has to retype
your content. It will refer to your blocks **by id**. So every block must be
final, correct, and directly usable as-is.

---

## Hard rules

1. **Verbatim.** Reproduce the source's wording exactly. Do not summarise,
   compress, expand, modernise, reorder, merge or split ideas, or "improve"
   phrasing. If the source is clumsy, it stays clumsy.
2. **Keep the source's order.** Blocks are numbered in the order they appear.
   The ordering carries pedagogical intent that is not yours to change.
3. **Never invent.** No formula, constant, hypothesis, numeric answer or
   citation may appear that is not in the source. If something is illegible,
   truncated or ambiguous, emit the block with `status=unclear` and put
   `@@UNCLEAR: <what you cannot read>` on its own line at that exact spot.
   Guessing here is the single worst thing you can do.
4. **Stay in the source language.** No translation. French stays French.
5. **Mechanical repair is allowed, and only this:** rejoin words broken by
   end-of-line hyphenation, remove PDF line-wrap artifacts, drop page headers,
   footers, running titles and page numbers, fix obvious OCR character
   confusions in *math* (`l`↔`1`, `O`↔`0`, `−`↔`-`) where the surrounding
   maths makes the correct reading certain. Mark any block you touched this
   way `status=repaired`. Everything else is `status=verbatim`.

## Maths — this is where content gets silently destroyed

The target platform renders with **KaTeX**. These rules are not stylistic;
breaking them produces a blank or corrupted page behind a passing build.

- Inline maths is `$…$` and **must not span a line break**. If it would, keep
  the whole expression on one line however long that line gets.
- Display maths is `$$` with **each `$$` alone on its own line**, nothing
  before or after it on that line:

  ```
  $$
  R = \sup\{r \ge 0 : (|a_n|\,r^n)_n \text{ bornée}\}.
  $$
  ```

  A `$$` with content welded to it swallows the rest of the document.
- **Preserve every spacing macro exactly**: `\,` `\;` `\:` `\!` `\quad`
  `\qquad`. They are load-bearing and are the most common thing to get
  stripped. Same for `\left`/`\right`, primes, hats, `\boldsymbol`, `\mathbf`.
- KaTeX-compatible only. Use `\begin{aligned}…\end{aligned}` inside `$$` for
  multi-line derivations. No `\begin{equation}`, `\label`, `\ref`, `\eqref`,
  `\newcommand`, no custom macros — expand any macro the source defines.
- **French decimals keep their comma** (`0,5` not `0.5`), inside and outside
  maths. Units keep their non-breaking space and stay in `\text{}`.
- Preserve French typography: « » guillemets, and the spaces before `;` `:`
  `?` `!` as the source has them.
- Never put `$` inside a `label=` or any other attribute value in the block
  header. Attribute values are plain text.

## Block types

Use exactly one of these per block. Pick by what the source *is*, not by what
you think it should become:

`definition` `theorem` `proposition` `lemma` `corollary` `proof` `example`
`counterexample` `remark` `method` `formula` `figure` `exercise` `solution`
`hint` `prose`

- `prose` is connective explanation that is none of the above.
- `formula` is a bare displayed result with no surrounding argument.
- `figure` is a described diagram — transcribe the caption verbatim and
  describe the drawing in one sentence prefixed `FIGURE:`.
- Keep blocks **atomic**: one definition, one example, one proof. A proof with
  five steps is one block unless the source itself numbers the steps as
  separable units.

## Output — two artifacts

### 1. The block file

Emit this as a single fenced code block so it can be saved to a file
unmodified. It is a **data file, not MDX** — do not add MDX components, do not
add HTML comments, do not add a title or any prose of your own.

```
@@BLOCK id=b001 type=definition label="série entière" defines=serie-entiere status=verbatim src="poly §4.1 p.28"
Une **série entière** est une série de fonctions de la forme $\sum_{n\ge 0} a_n z^n$,
où $(a_n)$ est une suite de nombres complexes et $z \in \mathbb{C}$.
@@END

@@BLOCK id=b002 type=theorem label="lemme d'Abel" status=verbatim src="poly §4.2 p.29"
Si la suite $(|a_n|\,r_0^n)_n$ est bornée pour un $r_0 > 0$, alors la série
$\sum a_n z^n$ converge absolument pour tout $z$ tel que $|z| < r_0$.
@@END
```

Header attributes, in this order:

| key | required | meaning |
| --- | --- | --- |
| `id` | yes | `b001`, `b002`, … strictly sequential, zero-padded to 3 |
| `type` | yes | one of the types above |
| `label` | yes | ≤ 8 words, in the source language, from the source's own wording |
| `defines` | only for `definition` | the term being defined, ASCII kebab-case, accents stripped (`série entière` → `serie-entiere`) |
| `status` | yes | `verbatim` \| `repaired` \| `unclear` |
| `src` | yes | where it came from — section and page, or `annales 2019 ex.3` |

Rules: `@@BLOCK` and `@@END` each alone on their own line, at column 0. Body is
everything between them, preserved exactly. Never nest blocks. If a body line
would itself start with `@@`, indent it by one space.

### 2. The manifest

Emit this as a second fenced code block. This is the part that gets pasted
into the downstream assistant, so it must be **compact** — one line per block,
no prose, no blank lines, no restating of content.

```
@@MANIFEST source="polycopié analyse ch.4, pp.28-41" lang=fr blocks=42
b001 definition   "série entière"          defines=serie-entiere  L2
b002 theorem      "lemme d'Abel"                                  L3
b003 proof        "preuve du lemme d'Abel"                        L11
b004 definition   "rayon de convergence"   defines=rayon-de-convergence L4
b005 example      "rayon de exp, série géométrique"               L7
b006 remark       "cas |z| = R indécidable"                       L3  !unclear
@@END
```

`L<n>` is the block's line count. Append `!unclear` or `!repaired` when the
status is not `verbatim`. Nothing else goes on the line.

## Finally, report

After the two code blocks, in **at most six lines** of plain prose:

- total blocks, and the count by status;
- every `@@UNCLEAR` you emitted, with its block id;
- anything in the source you deliberately dropped (page furniture, an index,
  a table of contents) — say what and why;
- anything the source references but does not contain (a figure you could not
  see, a theorem it cites from elsewhere).

Nothing else. No summary of the mathematics, no suggestions, no offer to
continue.

---

## Self-check before you answer

- [ ] Every `$$` sits alone on its own line.
- [ ] No inline `$…$` crosses a line break.
- [ ] Every `\,` `\;` `\quad` `\qquad` from the source is still present.
- [ ] No macro I invented; every source macro expanded.
- [ ] Decimal commas intact.
- [ ] Block ids sequential with no gaps; every `@@BLOCK` has its `@@END`.
- [ ] I summarised nothing and added no sentence of my own.
- [ ] Every uncertainty is an `@@UNCLEAR` marker, not a guess.

---

## How this gets used (context, not instructions to you)

The user saves your block file into the repo and pastes only the **manifest**
to the downstream assistant. That assistant writes an assembly plan — which
block goes inside which platform component, in what order, plus the genuinely
new pedagogical prose the source lacks. Your blocks are then spliced in
mechanically, so they are never retyped by a model.

That is why verbatim accuracy matters more than anything else here: nothing
downstream will re-read the original to catch your mistakes.
