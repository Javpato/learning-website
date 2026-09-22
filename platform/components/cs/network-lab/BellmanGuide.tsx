"use client";
import { useEffect, useState } from "react";
import {
  NODES,
  LINKS,
  history,
  initial,
  step,
  broadcast,
  bfs,
  trace,
  neighbors,
  cell,
  display,
  type Snapshot,
  type Change,
} from "@/lib/cs/bellmanGuide";
import { DragGraph } from "./DragGraph";
import { CourseParagraph as P } from "./Definitions";
import { Lesson, Explain, Source, Choice, Numeric } from "./shared";
import { CourseLink } from "./CourseSources";
import { CodingPractice } from "./CodingPractice";
const frames = history();
const explanations = [
  "Chaque routeur connaît lui-même à 0 et ses voisins à 1. ∞ signifie « aucune route connue », même si un chemin existe dans le graphe.",
  "B apprend D via A : il paie B–A (1), puis la distance annoncée par A (1). D apprend B de la même façon.",
  "C apprend D à 3 via B. C–E–D coûte réellement 2, mais C n’a pas encore reçu le vecteur de E. Le graphe visible par l’élève n’est pas la connaissance du routeur.",
  "A vers E et E vers A restent via B. Le candidat via D coûte aussi 2 : notre convention garde le prochain saut actuel à égalité.",
  "Même étape S4 : D découvre C via A à 3, puis améliore via E à 2. Les deux annonces ont été copiées au début de S4.",
  "Des annonces sont traitées, même sans modification. Vers D, C annonce 3 : les candidats à 4 chez B et E sont moins bons.",
  "A reçoit un vecteur de B cohérent avec ses routes. Aucune entrée ne change ; cela seul ne prouve pas une convergence globale.",
  "C améliore D de B / 3 à E / 2. Toutes les routes sont maintenant optimales et utilisables.",
  "A invalide B, C et E ; B invalide A et D. Les autres routeurs ignorent encore la panne. Le réseau physique reste connecté.",
  "D perd B : A était son prochain saut et retire sa route. D conserve C via E malgré l’annonce de A. C et E perdent A via B.",
  "E apprend A via D au coût 2. L’annonce ∞ de D vers B n’efface pas la liaison directe E–B.",
  "B retrouve A à 3 et D à 2 via E ; C retrouve A à 3 via E ; D retrouve B à 2 via E.",
  "A retrouve B et C à 3, E à 2, via D. Les routes convergent sans boucle ni comptage à l’infini dans cette séquence.",
];
function Tables({ s }: { s: Snapshot }) {
  return (
    <div className="nl-table-scroll">
      <table className="nl-table">
        <caption>{s.id} · prochain saut / distance</caption>
        <thead>
          <tr>
            <th>Routeur → destination</th>
            {NODES.map((n) => (
              <th key={n}>{n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {NODES.map((n) => (
            <tr key={n}>
              <th>{n}</th>
              {NODES.map((d) => (
                <td key={d}>{cell(s.tables[n][d])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Calculation({ c }: { c: Change }) {
  return (
    <li>
      <strong>
        {c.sender} → {c.receiver}, vers {c.dest}
      </strong>{" "}
      : {cell(c.old)} → {cell(c.entry)}.{" "}
      {c.reason.startsWith("Liaison")
        ? "Rupture locale"
        : `1 + ${display(c.candidate === Infinity ? Infinity : c.candidate - 1)} = ${display(c.candidate)}`}
      . {c.reason}. {c.changed ? "Entrée modifiée." : "Entrée conservée."}
    </li>
  );
}
function Replay() {
  const [index, setIndex] = useState(0),
    [playing, setPlaying] = useState(false),
    [router, setRouter] = useState("A"),
    [dest, setDest] = useState("C"),
    [changesOnly, setChangesOnly] = useState(true),
    [prediction, setPrediction] = useState(true),
    [revealed, setRevealed] = useState(false),
    [guess, setGuess] = useState(""),
    [feedback, setFeedback] = useState(""),
    [message, setMessage] = useState(0),
    [hop, setHop] = useState(0),
    [check, setCheck] = useState("");
  const s = frames[index],
    previous = frames[Math.max(0, index - 1)];
  const visible = prediction && !revealed && index > 0 ? previous : s;
  const route = trace(visible, router, dest),
    m = s.messages[message];
  function select(i: number) {
    setIndex(i);
    setRevealed(false);
    setGuess("");
    setFeedback("");
    setMessage(0);
    setHop(0);
    setCheck("");
  }
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(
      () =>
        setIndex((i) => {
          if (i >= frames.length - 1) {
            setPlaying(false);
            return i;
          }
          return i + 1;
        }),
      4000,
    );
    return () => clearInterval(t);
  }, [playing]);
  useEffect(() => {
    setMessage(0);
    setHop(0);
    setCheck("");
  }, [index]);
  const graph = {
    nodes: NODES,
    edges: visible.links.flatMap(
      ([a, b]) =>
        [
          [a, b, 1],
          [b, a, 1],
        ] as [string, string, number][],
    ),
  };
  return (
    <section id="bellman-replay" className="nl-workbench">
      <h3>3. Rejouer les annonces, puis la rupture</h3>
      <div className="nl-inline">
        <label>
          Étape{" "}
          <select
            value={index}
            onChange={(e) => {
              setPlaying(false);
              select(Number(e.target.value));
            }}
          >
            {frames.map((f, i) => (
              <option key={f.id} value={i}>
                {f.id} — {f.title}
              </option>
            ))}
          </select>
        </label>
        <button
          disabled={index === 0}
          onClick={() => {
            setPlaying(false);
            select(index - 1);
          }}
        >
          Précédent
        </button>
        <button
          disabled={index === 12}
          onClick={() => {
            setPlaying(false);
            select(index + 1);
          }}
        >
          Suivant
        </button>
        <button
          onClick={() => {
            setPrediction(false);
            setPlaying(!playing);
          }}
        >
          {playing ? "Pause" : "Lecture automatique"}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            select(index >= 8 ? 7 : 0);
          }}
        >
          Recommencer la phase
        </button>
      </div>
      <label>
        <input
          type="checkbox"
          checked={prediction}
          onChange={(e) => {
            setPrediction(e.target.checked);
            setPlaying(false);
            setRevealed(false);
          }}
        />{" "}
        Prévoir avant de révéler (facultatif)
      </label>
      <h4>
        {s.id} — {s.title}
      </h4>
      <P>
        Les vecteurs sont copiés au début de l’étape. L’ordre des livraisons
        ci-dessous est celui du guide ; aucune annonce supplémentaire n’est
        ajoutée.
      </P>
      {prediction && !revealed && index > 0 && (
        <div className="nl-course-help">
          <P>
            État affiché : {previous.id}, avant {s.id}. Prédis la distance de{" "}
            {router} vers {dest} après l’événement.
          </P>
          <label>
            Ma prédiction (nombre ou ∞)
            <input value={guess} onChange={(e) => setGuess(e.target.value)} />
          </label>
          <button
            onClick={() => {
              const v =
                guess.trim() === "∞" || guess.trim().toLowerCase() === "inf"
                  ? Infinity
                  : Number(guess);
              setFeedback(
                guess.trim() && v === s.tables[router][dest].cost
                  ? "Distance correcte. Vérifie aussi le prochain saut dans le journal."
                  : "Compare les annonces reçues et le prochain saut actuel. La correction reste accessible.",
              );
            }}
          >
            Vérifier la prédiction
          </button>
          <button onClick={() => setRevealed(true)}>
            Révéler sans condition
          </button>
          <P role="status">{feedback}</P>
        </div>
      )}
      <div className="nl-options">
        {s.messages.map((m, i) => (
          <button
            key={i}
            aria-pressed={message === i}
            onClick={() => setMessage(i)}
          >
            ✉ V{m.sender} : {m.sender} → {m.receiver}
          </button>
        ))}
      </div>
      {m && (
        <P>
          Annonce sélectionnée : V{m.sender} = (
          {NODES.map((n) => display(m.vector[n])).join(", ")}), ordre A, B, C,
          D, E. Le prochain saut n’est pas transmis. Une annonce {m.sender} →{" "}
          {m.receiver} peut apprendre une route de données dans le sens{" "}
          {m.receiver} → {m.sender}.
        </P>
      )}
      <div className="nl-discovery-grid">
        <div>
          <DragGraph
            graph={graph}
            announcement={m ? `${m.sender}-${m.receiver}` : null}
            directed={false}
            brokenEdges={visible.links.length === 5 ? [["A", "B"]] : []}
            active={route.path[Math.min(hop, route.path.length - 1)]}
            onNode={(n) => {
              setRouter(n);
              setHop(0);
              setFeedback("");
            }}
            labels={Object.fromEntries(
              NODES.map((n) => [
                n,
                `vers ${dest} : ${display(visible.tables[n][dest].cost)}`,
              ]),
            )}
            edgeProgress={Object.fromEntries(
              route.path.slice(1, hop + 1).flatMap((n, i) => [
                [`${route.path[i]}-${n}`, 1],
                [`${n}-${route.path[i]}`, 1],
              ]),
            )}
          />
          <P>
            Vue réelle du réseau. Déplace les sommets, ou sélectionne un
            routeur. Le moteur ne consulte pas cette carte pour améliorer ses
            tables.
          </P>
        </div>
        <div>
          <label>
            Routeur observé{" "}
            <select
              value={router}
              onChange={(e) => {
                setRouter(e.target.value);
                setHop(0);
                setFeedback("");
              }}
            >
              {NODES.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label>
            Destination du paquet{" "}
            <select
              value={dest}
              onChange={(e) => {
                setDest(e.target.value);
                setHop(0);
                setFeedback("");
              }}
            >
              {NODES.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <h4>
            Ce que sait {router} à {visible.id}
          </h4>
          <table className="nl-table">
            <thead>
              <tr>
                <th>Destination</th>
                <th>Prochain saut</th>
                <th>Distance</th>
              </tr>
            </thead>
            <tbody>
              {NODES.map((n) => (
                <tr key={n}>
                  <th>{n}</th>
                  <td>{visible.tables[router][n].next || "—"}</td>
                  <td title="∞ : aucune route connue actuellement">
                    {display(visible.tables[router][n].cost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <P>
            Voisins directs : {neighbors(visible.links, router).join(", ")}. Le
            vecteur ne copie que la dernière colonne.
          </P>
          <button
            disabled={hop >= route.path.length - 1}
            onClick={() => setHop((h) => h + 1)}
          >
            ● Paquet : avancer d’un saut
          </button>
          <button onClick={() => setHop(0)}>Replacer le paquet</button>
          <P role="status">
            Paquet vers {dest} : {route.path.slice(0, hop + 1).join(" → ")} ·{" "}
            {hop} saut(s).{" "}
            {hop >= route.path.length - 1
              ? route.status
              : "Le routeur courant consulte sa propre table."}
          </P>
        </div>
      </div>
      {(!prediction || revealed || index === 0) && (
        <>
          <P role="status">{explanations[index]}</P>
          <label>
            <input
              type="checkbox"
              checked={changesOnly}
              onChange={(e) => setChangesOnly(e.target.checked)}
            />{" "}
            Seulement les changements (décocher pour toutes les comparaisons)
          </label>
          <ol className="nl-bf-log">
            {s.changes
              .filter((c) => !changesOnly || c.changed)
              .map((c, i) => (
                <Calculation key={i} c={c} />
              ))}
          </ol>
          {!s.changes.some((c) => c.changed) && (
            <P>
              Pas de modification de table à cette étape. Les comparaisons
              restent consultables.
            </P>
          )}
          <Tables s={s} />
        </>
      )}
      <section className="nl-bf-vectors">
        <h4>Les cinq vecteurs — ordre A, B, C, D, E</h4>
        {NODES.map((n) => (
          <p key={n}>
            V{n} = (
            {NODES.map((z) => display(visible.tables[n][z].cost)).join(", ")})
          </p>
        ))}
      </section>
      <Explain title="Vérificateur global indépendant : BFS et chemins">
        <P>
          BFS explore les distances par nombre de sauts car chaque lien coûte 1.
          Il sert uniquement à contrôler les résultats, jamais à mettre à jour
          les routeurs.
        </P>
        <P>
          Depuis {router}, distances physiques : (
          {NODES.map((n) => display(bfs(visible.links, router)[n])).join(", ")}
          ). Le chemin donné par les tables vers {dest} est{" "}
          {route.path.join(" → ")} : {route.status}.
        </P>
        <button
          onClick={() => {
            const after = broadcast(visible);
            setCheck(
              after.changes.some((c) => c.changed)
                ? "Cette diffusion supplémentaire modifierait des entrées : cet état ne constitue pas un point fixe."
                : "Aucune entrée ne change après toutes les annonces. À S7 et F5, BFS et les chemins confirment aussi les distances optimales.",
            );
          }}
        >
          Tester une diffusion complète, sans modifier le scénario
        </button>
        <P role="status">{check}</P>
      </Explain>
    </section>
  );
}
const tasks = [
  {
    label: "Initialiser A vers C",
    frame: 0,
    router: "A",
    dest: "C",
    why: "Connaissance locale",
    initial: true,
  },
  {
    label: "S1 : B reçoit VA, vers D",
    frame: 1,
    router: "B",
    dest: "D",
    sender: "A",
  },
  {
    label: "S2 : C reçoit VB, vers D",
    frame: 2,
    router: "C",
    dest: "D",
    sender: "B",
  },
  {
    label: "S3 : A reçoit VD, vers E",
    frame: 3,
    router: "A",
    dest: "E",
    sender: "D",
  },
  {
    label: "S7 : C reçoit VE, vers D",
    frame: 7,
    router: "C",
    dest: "D",
    sender: "E",
  },
  {
    label: "F1 : invalidations après rupture AB",
    frame: 8,
    router: "A",
    dest: "B",
    failure: true,
  },
  {
    label: "F2 : D reçoit VA, vers B",
    frame: 9,
    router: "D",
    dest: "B",
    sender: "A",
  },
  {
    label: "F2 : D reçoit VA, vers C",
    frame: 9,
    router: "D",
    dest: "C",
    sender: "A",
  },
  {
    label: "F3 : E reçoit VD, vers A",
    frame: 10,
    router: "E",
    dest: "A",
    sender: "D",
  },
  {
    label: "F5 : A reçoit VD, vers B",
    frame: 12,
    router: "A",
    dest: "B",
    sender: "D",
  },
];
function RepairGame() {
  const [i, setI] = useState(0),
    [cost, setCost] = useState(""),
    [decision, setDecision] = useState(""),
    [next, setNext] = useState(""),
    [why, setWhy] = useState(""),
    [invalid, setInvalid] = useState<string[]>([]),
    [hint, setHint] = useState(0),
    [feedback, setFeedback] = useState(""),
    [scores, setScores] = useState<Record<number, string>>({});
  const t = tasks[i],
    s = frames[t.frame],
    c = s.changes.find(
      (c) =>
        c.receiver === t.router && c.sender === t.sender && c.dest === t.dest,
    ),
    entry = s.tables[t.router][t.dest];
  const expectedReason = t.initial ? "Connaissance locale" : c?.reason || "";
  const expectedDecision = t.initial
    ? "Initialiser"
    : !c?.changed
      ? "Conserver"
      : Number.isFinite(entry.cost)
        ? "Adopter"
        : "Invalider";
  const choices = [
    "Connaissance locale",
    "Plus court",
    "Même prochain saut : mise à jour obligatoire",
    "Égalité : conservation",
    "Moins bon depuis un autre voisin",
  ];
  const expectedInvalid = frames[8].changes.map(
    (c) => `${c.receiver}→${c.dest}`,
  );
  function reset(j: number) {
    setI(j);
    setCost("");
    setDecision("");
    setNext("");
    setWhy("");
    setInvalid([]);
    setHint(0);
    setFeedback("");
  }
  function verify() {
    if (t.failure) {
      const ok =
        invalid.length === expectedInvalid.length &&
        expectedInvalid.every((v) => invalid.includes(v));
      setFeedback(
        ok
          ? "Correct : toutes les routes dépendantes sont invalidées."
          : "Inspecte le prochain saut, pas seulement la destination : A dépend de B pour B, C, E ; B dépend de A pour A, D.",
      );
      if (ok) setScores((p) => ({ ...p, [i]: "Invalidations réussies" }));
      return;
    }
    const numeric =
      cost.trim() === "∞" || cost.trim().toLowerCase() === "inf"
        ? Infinity
        : Number(cost);
    const checks = [
      Boolean(cost.trim()) && numeric === (c?.candidate ?? entry.cost),
      decision === expectedDecision,
      next === (entry.next || "—"),
      why === expectedReason,
    ];
    setScores((p) => ({
      ...p,
      [i]: `${checks.filter(Boolean).length}/4 : coût ${checks[0] ? "✓" : "à revoir"}, décision ${checks[1] ? "✓" : "à revoir"}, saut ${checks[2] ? "✓" : "à revoir"}, justification ${checks[3] ? "✓" : "à revoir"}`,
    }));
    setFeedback(
      checks.every(Boolean)
        ? "Tout est correct. Tu as justifié la décision locale."
        : !checks[0]
          ? "Ajoute le premier lien au coût annoncé. ∞ reste ∞ ; ne compte pas les nœuds."
          : !checks[1]
            ? "Une annonce du prochain saut actuel impose la mise à jour, même vers ∞. Une annonce moins bonne d’un autre voisin ne retire rien."
            : !checks[2]
              ? "Le prochain saut est un voisin direct. À égalité on conserve celui déjà choisi ; une route inconnue n’a pas de prochain saut."
              : "Compare le prochain saut actuel et l’émetteur, puis les deux coûts.",
    );
  }
  return (
    <section className="nl-workbench" id="bellman-game">
      <h3>4. Répare le réseau</h3>
      <P>
        Chaque mission reprend l’état de référence. Une erreur ne modifie pas
        les suivantes. Toutes les missions, aides et solutions restent
        accessibles.
      </P>
      <label>
        Mission{" "}
        <select value={i} onChange={(e) => reset(Number(e.target.value))}>
          {tasks.map((t, j) => (
            <option key={j} value={j}>
              {j + 1}. {t.label}
            </option>
          ))}
        </select>
      </label>
      <h4>{t.label}</h4>
      {t.failure ? (
        <>
          <P>
            Sélectionne toutes les entrées invalidées à F1. Notation : routeur →
            destination.
          </P>
          <div className="nl-options">
            {["A", "B"].flatMap((r) =>
              NODES.filter((d) => d !== r).map((d) => {
                const key = `${r}→${d}`;
                return (
                  <button
                    key={key}
                    aria-pressed={invalid.includes(key)}
                    onClick={() =>
                      setInvalid((v) =>
                        v.includes(key)
                          ? v.filter((x) => x !== key)
                          : [...v, key],
                      )
                    }
                  >
                    {key}
                  </button>
                );
              }),
            )}
          </div>
        </>
      ) : (
        <>
          <P>
            {c
              ? `Ancienne entrée : ${cell(c.old)}. ${t.sender} annonce ${display(c.candidate === Infinity ? Infinity : c.candidate - 1)} vers ${t.dest}. Le lien vers ${t.sender} coûte 1.`
              : "A connaît uniquement B et D comme voisins directs. Le graphe visible ne remplit pas les autres cases."}
          </P>
          <div className="nl-inline">
            <label>
              {t.initial ? "Distance initiale" : "Coût candidat"}
              <input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="nombre ou ∞"
              />
            </label>
            <label>
              Décision
              <select
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
              >
                <option value="">Choisir</option>
                {["Initialiser", "Adopter", "Conserver", "Invalider"].map(
                  (v) => (
                    <option key={v}>{v}</option>
                  ),
                )}
              </select>
            </label>
            <label>
              Prochain saut après traitement
              <select value={next} onChange={(e) => setNext(e.target.value)}>
                <option value="">Choisir</option>
                {["—", ...NODES].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Pourquoi ?
              <select value={why} onChange={(e) => setWhy(e.target.value)}>
                <option value="">Choisir</option>
                {choices.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          </div>
        </>
      )}
      <button onClick={verify}>Vérifier ma mission</button>
      <button disabled={hint >= 3} onClick={() => setHint((h) => h + 1)}>
        Indice progressif
      </button>
      <P role="status">{feedback}</P>
      {hint > 0 && (
        <P>
          {t.failure
            ? "Regarde toutes les cases dont le prochain saut utilise AB."
            : t.initial
              ? "C n’est pas un voisin de A."
              : `Valeur annoncée par ${t.sender} : ${display(c!.candidate === Infinity ? Infinity : c!.candidate - 1)}.`}{" "}
          {hint > 1 &&
            !t.failure &&
            !t.initial &&
            `Le premier lien coûte 1 : candidat = 1 + annonce = ${display(c!.candidate)}.`}{" "}
          {hint > 2 &&
            `Résultat : ${t.failure ? expectedInvalid.join(", ") : `${cell(entry)} ; ${expectedReason}`}.`}
        </P>
      )}
      <Explain title="Solution de cette mission">
        {t.failure ? (
          <P>
            {expectedInvalid.join(", ")} : toutes ces entrées utilisaient la
            liaison AB comme premier saut.
          </P>
        ) : (
          <P>
            {c && `Candidat ${display(c.candidate)} ; `}
            {expectedDecision} ; résultat {cell(entry)} ; {expectedReason}.
          </P>
        )}
      </Explain>
      <details>
        <summary>Mes réussites par notion</summary>
        <ul>
          {tasks.map((t, j) => (
            <li key={j}>
              {t.label} : {scores[j] || "Pas encore vérifié"}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
function Transfer() {
  const [count, setCount] = useState(0),
    [guess, setGuess] = useState(""),
    [feedback, setFeedback] = useState("");
  const links = LINKS.filter(([a, b]) => !(a === "B" && b === "E"));
  let s = initial(links);
  for (let i = 0; i < count; i++) s = broadcast(s);
  const route = trace(s, "A", "E");
  return (
    <section className="nl-workbench">
      <h3>Transfert : une autre liaison manque</h3>
      <P>
        Variante indépendante : AB existe, BE est retirée dès le démarrage. Tous
        les coûts restent à 1. À chaque tour, tous les vecteurs sont copiés puis
        livrés. Prédis le coût final de A vers E et son prochain saut.
      </P>
      <label>
        Coût prédit
        <input value={guess} onChange={(e) => setGuess(e.target.value)} />
      </label>
      <button
        onClick={() =>
          setFeedback(
            guess.trim() && Number(guess) === bfs(links, "A").E
              ? "Coût correct : 2. Le chemin est A–D–E, prochain saut D."
              : "Cherche le premier voisin de A permettant deux sauts vers E.",
          )
        }
      >
        Vérifier le transfert
      </button>
      <P role="status">{feedback}</P>
      <button disabled={count >= 5} onClick={() => setCount((n) => n + 1)}>
        Diffuser tous les vecteurs · tour {count}
      </button>
      <button
        onClick={() => {
          setCount(0);
          setFeedback("");
        }}
      >
        Recommencer la variante
      </button>
      <Tables s={s} />
      <P>
        Chemin d’après les tables : {route.path.join(" → ")}. {route.status}.
        BFS indépendant : A→E coûte {bfs(links, "A").E}.
      </P>
    </section>
  );
}
export function BellmanGuide() {
  return (
    <Lesson
      id="bellman-guide"
      kicker="Exercice 4 · guide fourni · cinq routeurs"
      title="Bellman-Ford : comprendre les annonces et réparer le réseau"
    >
      <P>
        Une liaison disparaît. Le réseau reste connecté, mais certains routeurs
        ne savent plus comment joindre les autres. Ta mission : reconstruire
        leurs tables à partir des seuls messages reçus, puis expliquer comment
        un paquet retrouve sa destination.
      </P>
      <P>
        Parcours : lire une table et un vecteur → comprendre la règle → rejouer
        les deux séquences → réparer puis transférer.{" "}
        <a href="#routage/bellman-replay">Accéder au rejeu</a> ·{" "}
        <a href="#routage/bellman-game">Accéder au mini-jeu</a> ·{" "}
        <CourseLink page={41}>Cours original, p. 41</CourseLink>.
      </P>
      <h3>1. Ce que connaît un routeur</h3>
      <P>
        Un voisin est directement relié : A a B et D pour voisins. La
        destination est l’arrivée souhaitée. Le prochain saut est le voisin
        auquel remettre le paquet : chez A, « C, B, 2 » signifie aller vers B
        pour rejoindre C à un coût estimé de 2. Le vecteur VA ne transmet que
        les distances, dans l’ordre A, B, C, D, E ; il ne donne ni les prochains
        sauts ni le chemin complet.
      </P>
      <P>
        Un lien coûte 1 : A–B–C compte deux sauts, malgré ses trois nœuds. ∞
        signifie qu’aucune route n’est actuellement connue, pas que C est
        physiquement inaccessible. La distance vers soi est 0, sans prochain
        saut.
      </P>
      <Choice
        question="Quels sont les voisins directs de A ?"
        options={["B et D", "B, C et D", "Tous les routeurs atteignables"]}
        answer={0}
        why="AB et AD sont les seuls liens incidents à A. C est atteignable, mais ne lui est pas directement relié."
      />
      <Numeric
        question="Combien de sauts comporte A–B–C ?"
        answer={2}
        why="Un saut par liaison : AB puis BC."
      />
      <Explain title="Construire la table initiale de A, ligne par ligne">
        {NODES.map((n) => (
          <p key={n}>
            {n} :{" "}
            {n === "A"
              ? "moi-même"
              : neighbors(LINKS, "A").includes(n)
                ? "voisin direct"
                : "pas encore appris"}{" "}
            → {cell(frames[0].tables.A[n])}.
          </p>
        ))}
        <P>On copie seulement les distances : VA = (0, 1, ∞, 1, ∞).</P>
      </Explain>
      <h3>2. Pourquoi additionner puis comparer ?</h3>
      <P>
        Tout chemin de X vers Z commence par un voisin Y. Son coût comprend X–Y,
        puis la suite depuis Y. À l’optimum : δ(X,Z) = min des [c(X,Y) + δ(Y,Z)]
        sur les voisins Y. Dans cet exercice, c(X,Y) = 1. À S1, A annonce D à 1
        : B doit encore payer B–A, donc son candidat vaut 1 + 1 = 2.
      </P>
      <Explain title="Justifier l’égalité de Bellman-Ford">
        <P>
          Choisir un voisin puis un plus court chemin depuis lui fournit une
          marche réalisable : δ(X,Z) ne dépasse pas ce coût. Inversement, le
          premier voisin d’un plus court chemin donne une suite dont le coût est
          au moins δ(Y,Z). Les deux inégalités donnent l’égalité. Les coûts
          positifs permettent d’éliminer les cycles d’un chemin optimal. Pendant
          l’apprentissage, les annonces sont encore des estimations : elles ne
          sont pas automatiquement les distances optimales.
        </P>
      </Explain>
      <ol>
        <li>Calculer q = 1 + distance annoncée ; 1 + ∞ = ∞.</li>
        <li>
          Si l’émetteur est le prochain saut actuel, actualiser même si le coût
          augmente.
        </li>
        <li>
          Sinon, adopter uniquement un coût strictement meilleur ; à égalité
          conserver la route.
        </li>
        <li>
          Un résultat infini retire le prochain saut. Une rupture invalide
          toutes les routes utilisant le voisin perdu.
        </li>
      </ol>
      <Explain title="Conventions de cet exercice — à distinguer de l’atelier TD4">
        <P>
          Une seule meilleure route est conservée. Pas de cache de tous les
          anciens vecteurs, pas de split horizon, poisoned reverse,
          temporisateur ou messages automatiques. Chaque étape copie tous ses
          vecteurs avant les réceptions. S4 livre VA puis VE. Le scénario
          principal n’est pas une simulation complète de RIP. La règle
          d’actualisation du prochain saut est décrite au{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc1058.html#section-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            RFC 1058, §2
          </a>
          .
        </P>
        <P>
          L’atelier TD4 précédent utilise une autre convention de stockage. On
          ne mélange pas ses états transitoires avec ceux de ce guide. Avec un
          cache, B pourrait choisir A via C alors que C utilise B : une boucle
          conditionnelle B–C–B est possible. Ce n’est ni un état de la séquence
          présente, ni une preuve de comptage à l’infini.
        </P>
      </Explain>
      <Replay />
      <RepairGame />
      <Transfer />
      <CodingPractice id="bellman-reception" />
      <Explain title="Lecture sans animation : toute la correction">
        {frames.map((s, i) => (
          <section key={s.id}>
            <h4>
              {s.id} — {s.title}
            </h4>
            <P>{explanations[i]}</P>
            <Tables s={s} />
          </section>
        ))}
      </Explain>
      <Explain title="Bilan : ce qu’il faut expliquer sur la copie">
        <P>
          La panne est détectée localement ; ses conséquences se propagent
          ensuite. À F1, D croit encore atteindre B via A, mais A n’a plus de
          route. À F5, A rejoint B par A–D–E–B et C rejoint A par C–E–D–A, en
          trois sauts. B vers D reste à 2 mais passe désormais par E. ∞
          décrivait une perte de connaissance, pas une déconnexion réelle.
          Garder toujours min(ancien, candidat) empêcherait de retirer les
          routes périmées.
        </P>
      </Explain>
      <Source>
        Guide_exercice_4_Bellman_Ford (1).md, fourni le 22 septembre 2026,
        sections 1–14. Adaptation pédagogique ; conventions explicites, non
        document officiel.
      </Source>
    </Lesson>
  );
}
