# Work order — track « Réseaux » (cs/reseaux), un vrai cours d'ingénierie guidé par le calcul

Read `AGENTS.md`, `platform/CLAUDE.md`, `COURSE_PLAYBOOK.md` and
`RESOURCES-reseaux.md` first; every rule there applies. Work on the unit named
in your prompt only.

Audience: L2 informatique. Prerequisites: binary/hex arithmetic (recalled in
L00), no networking at all. Authoring language: **French first**; en/es
siblings are regenerated afterwards (course-translate conventions).

This track uses the **FMV Mission template**, not the analyse GuidingQuestion
template: networking is an engineering course — every chapter exists to answer
a quantitative question (how long, how many addresses, which route, what
throughput), and the annales ARE such questions. **No invented storytelling**:
every Mission is a real course/TD/annale problem with its actual numbers.
The recurring systems that thread the course (use them, never invent new ones):

- the two-machine + store-and-forward router link (10 / 5 Mbit/s, 6600 km) —
  partiel 2023;
- the site 132.174.0.0/17 and its 62 sous-réseaux — partiel 2021;
- the router graph A-B-C-D-E (all costs 1, A-B, A-D, B-C, B-E, C-E, D-E) —
  partiel 2021, and the 7-node graph of the Préparation for Dijkstra;
- the TCP transfer at MSS 512 / RTT 300 ms / 10 Mbit/s — TD6.

## Canonical lesson skeleton (exact order)

```mdx
# <Titre orienté but>

<LessonMeta id="cs-net-cNN" />

<Toc depth={2} />

<Accroche>…</Accroche>                       ← 1 phrase intuitive

<Mission fil="…">                            ← 4 parts, ≤8 lines, real numbers
**Situation.** … **Question.** … **L'obstacle.** … **Le contrat.** N outils…
</Mission>

*Tu te sens à l'aise ? [Attaque directement le TD N](../td-N/)…*

## Le plan de bataille                        ← the N tools, 1 line each

## 1. <Outil 1 — titre but>
   problème → **Définition n (…).** → exemple immédiat → **Remarque.** →
   **Méthode (…).** where a written exam procedure exists → ### Mini-exercices

## 2. …

## Exemple calculé — <ce qu'on en tire>
   **Étape k — action.** … *Pourquoi ?* … (goal or numbered block, never a
   paraphrase) ; ends with <Collapsible title="Question de compréhension — réponse">

## Visualisation guidée                       ← only if the lesson has a widget
   <XxxWidget preset="…" /> + 2-3 cycles Prédis/Agis/Observe/Relie + free play

## Pièges classiques                          ← <Pitfall> from real graded-copy errors

## Vérification rapide                        ← <Quiz> (reuse real QCM items + explains)

<MissionSolved>…</MissionSolved>              ← solves THE mission's numbers, cites blocks

## Résumé — <fonction>
<KeyResults title="…">decision table + réflexes</KeyResults>

<RelatedExercises id="cs-net-cNN" />
<LessonStateSelector id="cs-net-cNN" />
```

L00 is a diagnostic toolbox (no Mission, no RelatedExercises — same framing as
the analyse L00). 300–500 lines per lesson; density over bloat; warm « tu ».

## The 12 rules (all mandatory — see COURSE_PLAYBOOK.md §1)

1. Mission = 4 labeled parts, ≤8 lines, concrete numbers, **zero chapter
   vocabulary**, taken from the corpus.
2. Plan de bataille right after; each section opens naming its tool.
3. No cold definitions — one "Problème : …" sentence before every Définition.
4. Numbered blocks with per-type counters (**Définition n**, **Exemple n**,
   **Remarque**, **Méthode (…)**, **Proposition n** for provable facts like
   the efficiency formulas); cite by number later.
5. Définition → exemple immédiat → contre-exemple/Remarque.
6. Define-before-use: `<Def id>` once at the definition site (never in a
   heading), `<Terme id>` at first use elsewhere; informal gloss in
   parentheses at the definition. Ids come from `glossaire-reseaux.ts` ONLY.
7. Worked examples: every **Étape** has its *Pourquoi ?* naming a goal or a
   numbered block. One self-explanation Collapsible at the end.
8. Fading: annotated example → « À toi » partial → bare quiz/TD.
9. The mission's system reappears in ≥1 numbered example per major section,
   in the visualisation and in MissionSolved. No decorative scenarios.
10. Visualisation guidée: ≤3 cycles, phrased on content, each closing by
    citing the block illustrated; end with free-play invitation.
11. Mini-exercices close each tool section (2-4 items, ≤2 min; first one on
    the mission's system; Quiz/QNumeric when checkable).
12. MissionSolved solves the mission's numbers citing tools by block number;
    Résumé restates the plan as « ce que tu sais faire ».

Rigor rule (from the analyse spec, kept): a formula used must be derived or
justified where feasible (efficiency of stop-and-wait, T=(k+n)·tt, minimal
Ethernet frame 2·tp·D, Shannon stated with its meaning, p=√(xh/k) in TD);
finite chronogrammes before general formulas; every criterion/table states
its blind case (e.g. « l'équivalence DV/LS dépend de la métrique », « un
checksum ne détecte pas tout »).

## Per-lesson assignments

| Lesson | Mission (real source) | `<Def>` ids (exactly these) | Widget |
| --- | --- | --- | --- |
| L00 `00-boite-a-outils` | — (diagnostic bridge: binaire/hexa/puissances, bits vs octets, k=10³ vs Ki=2¹⁰, ordres de grandeur ms/µs, log₂, lire un chronogramme) | `notation-binaire` `notation-hexadecimale` `bit` `octet` | — |
| L01 `01-reseaux-et-commutation` | relier 2 machines via un réseau : circuit, message ou paquets ? (déroulé qualitatif du partiel 2023 Ex1) | `reseau-informatique` `commutation` `commutation-de-circuits` `commutation-de-messages` `commutation-de-paquets` `commutation-de-cellules` `store-and-forward` `topologie` `mode-connecte` `mode-non-connecte` `circuit-virtuel` `datagramme` | — |
| L02 `02-delais-et-debits` | partiel 2023 Ex1 : 30 KB en p1=10 KB + p2=20 KB via R (10 puis 5 Mbit/s, 6600 km) — écarts d'arrivée, temps total, débit effectif | `debit-binaire` `temps-de-transmission` `temps-de-propagation` `temps-de-transfert` `debit-effectif` `file-d-attente` | `PacketSwitchWidget` (preset "partiel") |
| L03 `03-couches-et-encapsulation` | 1 Ko de données HTTP : combien d'octets sur le câble ? (en-têtes réels TCP 20 + IP 20 + Ethernet 14+4 du cours) | `couche` `protocole` `service` `primitive-de-service` `pdu` `sdu` `encapsulation` `modele-osi` `modele-tcp-ip` `sap` | `EncapsulationWidget` |
| L04 `04-transmission-physique` | annale 1 h Ex1 : « 011110011001100 » en Manchester diff. puis NRZ valence 8 (5 ms/symbole) — passe-t-il dans 50 kHz à 30 dB ? | `signal` `codage-en-bande-de-base` `codage-nrz` `codage-manchester` `valence` `rapidite-de-modulation` `bande-passante` `capacite-de-shannon` `echantillonnage` | `LineCodingWidget` (preset "annale") |
| L05 `05-detection-des-erreurs` | TD1 : parité + CRC — le récepteur peut-il *prouver* qu'une trame est intacte ? (division de 10011010 par x³+x+1 type TD) | `bit-de-parite` `distance-de-hamming` `code-detecteur` `crc` `polynome-generateur` `somme-de-controle` | — (CRC pas-à-pas en Exemple calculé) |
| L06 `06-liaison-de-donnees` | annale 1 h Ex2 : A envoie 4 trames (la n°2 erronée), B en envoie 2 — chronogramme REJ vs SREJ, coût de chaque reprise | `trame` `acquittement` `temporisateur` `arq` `fenetre-d-anticipation` `rejet-simple` `rejet-selectif` `piggybacking` `transparence` `hdlc` | `ArqWidget` (preset "annale") |
| L07 `07-reseaux-locaux` | TD3 : bus 10 Mbit/s, 2,5 km, v=200 000 km/s — pourquoi une trame Ethernet doit faire ≥ 64 octets | `reseau-local` `acces-multiple` `csma-cd` `collision` `trame-ethernet` `adresse-mac` `backoff` `anneau-a-jeton` | — (chronogramme de collision en figures + calcul) |
| L08 `08-adressage-ip` | partiel 2021 Ex2 : site 132.174.0.0/17, 62 sous-réseaux — masque, sous-réseau 55, diffusion, plage, 510 machines | `adresse-ip` `classe-d-adresses` `masque` `sous-reseau` `adresse-de-reseau` `adresse-de-diffusion` `cidr` `adresse-privee` `agregation` `adresse-ipv6` | `SubnetWidget` (preset "partiel") |
| L09 `09-datagramme-ip` | annale exam Ex2 : 2000 octets TCP traversent MTU 1024 puis 512 — la table des 7 fragments reçus par B | `datagramme-ip` `mtu` `fragmentation` `decalage-de-fragment` `ttl` `arp` `icmp` `ping` `traceroute` | `FragmentationWidget` (preset "annale") |
| L10 `10-routage` | partiel 2024-25 Ex1 : R (table donnée) reçoit DV₁ puis DV₂ — nouvelles tables, puis vecteurs « horizon partagé avec antidote » par lien | `table-de-routage` `plus-long-prefixe` `route-par-defaut` `remise-directe` `acheminement` `vecteur-de-distances` `etat-de-liens` `inondation` `algorithme-de-dijkstra` `comptage-a-l-infini` `horizon-partage` `systeme-autonome` | `RoutingWidget` (presets "dv", "dijkstra") |
| L11 `11-transport-et-tcp` | TD6 Ex7 : MSS 512, A pousse 300+200+12 octets (ISN donnés) — SEQ/ACK de chaque segment, et que fait le temporisateur si le 1ᵉʳ se perd ? | `port` `multiplexage` `socket` `udp` `pseudo-en-tete` `tcp` `segment-tcp` `numero-de-sequence` `acquittement-cumulatif` `ouverture-en-trois-temps` `mss` `isn` | `TcpSeqWidget` (preset "td6") |
| L12 `12-fenetres-et-fiabilite-tcp` | TD6 Ex5 : T3 à 44,736 Mbit/s, RTT 50 ms, fenêtre 16 bits — quelle fraction du temps l'émetteur est-il bloqué ? | `fenetre-glissante` `controle-de-flux` `fenetre-annoncee` `rto` `rtt` `algorithme-de-karn` `produit-delai-bande-passante` `facteur-d-echelle` | — (tables numériques guidées) |
| L13 `13-controle-de-congestion` | exercice du cours : 1 Gbit/s, RTT 20 ms, segments de 1000 octets, fenêtre = 80 % du BDP — combien de RTT de slow start pour la remplir ? | `congestion` `fenetre-de-congestion` `demarrage-lent` `seuil-de-demarrage` `evitement-de-congestion` `retransmission-rapide` `recuperation-rapide` `aimd` | `CongestionWidget` (preset "cours") |

Lessons cite their TD by real number: td-1 ↔ L04+L05, td-2 ↔ L06, td-3 ↔ L07,
td-4 ↔ L02+L10, td-5 ↔ L08+L09, td-6 ↔ L11+L12+L13, td-7 (TP sockets) ↔ L11.

## TD pages (source-faithful, exam-form corrigés)

One page per TD, `td-1` … `td-7`, FMV/analyse format: intro line, `<Toc />`,
one `<ExerciseView id="cs-net-tdN-MM">` per source exercise with `<Statement>`
(the real questions, all sub-questions kept), `<HintLadder>` (2-3 hints),
`<FinalAnswer>`, `<Solution>` (the official correction rewritten in the exam
form, per-step, with the tables/chronogrammes as markdown tables), and
`<CommonErrors>` where a graded copy or the correction shows a classic error.
Nothing from the source corrections may be dropped — deepen, never thin.
td-7 is the socket TP as a guided build (steps + skeleton + folded reference
solution); its 2 exercises are the UDP pair and the TCP pair.

## Mock exams (examens/cc, examens/partiel, examens/final)

- `cc` — « Partiel 1 h » : codage + HDLC (the 1 h annale, corrigé included).
- `partiel` — « Partiel 2 h » : commutation/délais + adressage + routage DV +
  QCM 20 questions (assembled from the real 2021/2023/2024-25 papers).
- `final` — « Examen final » : CIDR allocation + fragmentation en cascade +
  sous-adressage avec table de routage + QCM (from Annale_Exam + QCM v2).

`<MockExamView id="cs-net-exam-…">` + `<ExamProblem title points>` blocks,
corrigé + barème in a `<Collapsible>` per problem, exactly like the analyse
exam pages. QCM inside exams uses `<Quiz>` with per-option `<QExplain>`.

## formulaire/ and plan-de-travail/

- `formulaire` — decision instrument: units table (k=10³), delay formulas,
  D=R·log₂V, Shannon, parité/Hamming/CRC recipe, ARQ efficiency, L≥2·tp·D,
  masks /17→/30 table (subnets/hosts), the 6-step subnetting Méthode, the
  fragment recipe (multiple of 8!), DV update rule + horizon partagé, the
  Dijkstra label loop, SEQ/ACK arithmetic, SRTT/RTO Jacobson, W/RTT, BDP,
  slow start doubling; ends with « erreurs qui coûtent des points » (from the
  graded copies) and a map « type de question → outil → phrase à écrire ».
  `<Terme>` links only, no `<Def>`.
- `plan-de-travail` — 6-week path lessons+TD → cc → partiel → final; always
  optional, nothing gates anything.

## Widgets (components/cs/scenes/, engines in lib/cs/)

All pure client React + SVG, design tokens only, no third-party origins.
Every widget: compact, keyboard-usable controls, values always visible as
numbers (the learner must be able to copy them onto paper).

| Widget | Engine | Behaviour |
| --- | --- | --- |
| `PacketSwitchWidget` | `lib/cs/delays.ts` | chronogramme A—R—B : sliders débit₁/débit₂/tailles/nb paquets, modes message vs paquets, affiche tt/tp par segment, temps total, débit effectif. Presets "partiel" (10/5 Mbit/s, 30 KB), "pipeline". |
| `EncapsulationWidget` | — | pile OSI/TCP-IP cliquable : un SDU descend, chaque couche ajoute son en-tête (tailles réelles), total sur le câble + % d'overhead ; sens inverse à la remontée. |
| `LineCodingWidget` | `lib/cs/lineCoding.ts` | saisie d'une suite binaire → tracés NRZ / Manchester / Manchester différentiel / NRZ multi-niveaux (valence 4/8) ; affiche R (bauds) et D (bit/s). Preset "annale". |
| `ArqWidget` | `lib/cs/arq.ts` | chronogramme émetteur/récepteur pas-à-pas : stop-and-wait, rejet simple, rejet sélectif ; clic sur une trame pour la corrompre ; fenêtre réglable ; compte les trames émises. Preset "annale". |
| `SubnetWidget` | `lib/cs/ipv4.ts` | adresse + /n slider : vue binaire colorée (réseau/sous-réseau/hôte), adresse réseau, diffusion, plage, 2^h−2 ; mode « découpe » (nb de sous-réseaux voulu → bits nécessaires). Preset "partiel". |
| `FragmentationWidget` | `lib/cs/ipv4.ts` | taille de données + chaîne de MTU (1 ou 2 routeurs) → table des fragments (longueur totale, MF, décalage) recalculée en direct, avec la règle du multiple de 8 apparente. Preset "annale". |
| `RoutingWidget` | `lib/cs/routing.ts` | preset "dv" : graphe A-E du partiel 2021, tables par nœud, bouton « échange suivant », panne de lien → comptage à l'infini, case « horizon partagé » ; preset "dijkstra" : graphe de la Préparation, étiquettes (coût, via) pas-à-pas, table finale. |
| `TcpSeqWidget` | `lib/cs/tcp.ts` | échange TCP : ouverture 3 temps (ISN réglables) puis segments de tailles choisies ; SEQ/ACK calculés et affichés ; perte d'un segment → temporisateur + retransmission (Go-Back-N du TD6). Preset "td6". |
| `CongestionWidget` | `lib/cs/tcp.ts` | courbe cwnd(RTT) : slow start / évitement ; boutons « timeout » et « 3 ACK dupliqués » ; Tahoe vs Reno ; ss_thresh visible ; lecture des valeurs point par point. Preset "cours" et preset "tanenbaum" (l'Ex2 du cours : MSS 1024, ss 64K, timeout au RTT 9). |

## MDX safety (build breaks or silently blanks otherwise)

- Multi-line `$$` fences ALONE on their lines; single-line `$$…$$` fine.
- Inline `$…$` never spans a line break; no `|` inside `$…$` in table cells
  (use `\lvert x\rvert `); no `$`/KaTeX in component string props (`fil=`,
  `title=`) — unicode (×, ≥, µ) is fine there.
- Blank line after every opening / before every closing component tag; blank
  line between a QItem prompt and its first `<QOption>`.
- Every `<QItem>` has ≥1 `correct` option; only QOption/QFeedback/QExplain
  inside QItem; only Hint inside HintLadder.
- `<Def>`/`<Terme>` ids from `glossaire-reseaux.ts` only; `<Def>` never in a
  heading; report missing terms, never invent ids.
- `<LessonStateSelector>` is the last line of every lesson.
- Binary strings and hex dumps go in backticks or fenced code blocks, never
  in math mode.

## Files

Writable: `platform/app/[locale]/cs/reseaux/**`, `platform/lib/content/{cs-reseaux,glossaire-reseaux}.ts`,
`platform/lib/cs/**`, `platform/components/cs/scenes/**`, registry/types/verify
extensions, `platform/lib/learn/{lessonPage.tsx,ui.ts}` (crumb additions),
legacy `computer-science/index.html` + `fr/`+`es/` siblings (one card each).
Forbidden: everything in the AGENTS.md do-not-revert list, all math/physics
content, sql/python courses.

## Acceptance checklist (per unit)

- [ ] Skeleton complete and in order; ids match `cs-reseaux.ts`.
- [ ] Mission = 4 parts, real numbers, zero chapter vocabulary.
- [ ] Every Étape has a *Pourquoi ?* that names a goal or cites a block.
- [ ] Assigned `<Def>` ids placed exactly once; wording agrees with the
      glossary `short`.
- [ ] Widget tag + preset exactly as the table says.
- [ ] MissionSolved recomputes the mission's numbers, citing blocks.
- [ ] Pièges grounded in the real errors (RESOURCES-reseaux.md list).
- [ ] `VERIFY_SKIP_PARITY=1 npm run verify:content` passes from `platform/`.
- [ ] Final gates: strict glossary, tsc, full build + canaries (playbook §4).
