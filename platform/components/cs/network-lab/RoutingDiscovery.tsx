"use client";
import { CourseParagraph } from "./Definitions";
import { useEffect, useState } from "react";
import {
  TD4_DIRECTED,
  TD4_DV,
  shortestSteps,
  dvState,
  receiveVectors,
  type Label,
} from "@/lib/cs/networkLab";
import {
  initialLabels,
  settleMinimum,
  relax,
  waveProgress,
} from "@/lib/cs/routingDiscovery";
import { DragGraph } from "./DragGraph";
import { Term } from "./Definitions";
import { Explain, Choice } from "./shared";
const f = (n: number) => (Number.isFinite(n) ? String(n) : "∞");
const RULES = [
  "Initialiser : source à 0, autres à ∞",
  "Choisir le minimum provisoire",
  "Fixer sa distance",
  "Relâcher ses arcs sortants",
  "Recommencer tant qu’un sommet est accessible",
];
function RebuildRules() {
  const [order, setOrder] = useState([3, 0, 4, 2, 1]);
  const [from, setFrom] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  function move(to: number, start = from) {
    if (start === null) return;
    setOrder((s) => {
      const a = [...s];
      a.splice(to, 0, a.splice(start, 1)[0]);
      return a;
    });
    setFrom(null);
    setFeedback("");
  }
  return (
    <div className="nl-rule-builder">
      <h4>Écris d’abord ta méthode</h4>
      <CourseParagraph>
        Tu dois mémoriser les meilleurs coûts, choisir ce qui est sûr, puis
        propager cette information. Glisse ces instructions dans l’ordre ; les
        flèches offrent la même action au clavier et sur mobile.
      </CourseParagraph>
      <ol>
        {order.map((r, i) => (
          <li
            key={r}
            draggable
            onDragStart={(e) => {
              setFrom(i);
              e.dataTransfer.setData("text/plain", String(i));
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const raw = e.dataTransfer.getData("text/plain");
              const from = Number(raw);
              if (raw !== "" && Number.isInteger(from) && from >= 0 && from < 5)
                move(i, from);
            }}
          >
            <span>{RULES[r]}</span>
            <button
              disabled={!i}
              aria-label={`Monter : ${RULES[r]}`}
              onClick={() => move(i - 1, i)}
            >
              ↑
            </button>
            <button
              disabled={i === 4}
              aria-label={`Descendre : ${RULES[r]}`}
              onClick={() => move(i + 1, i)}
            >
              ↓
            </button>
          </li>
        ))}
      </ol>
      <button
        onClick={() =>
          setFeedback(
            order.every((n, i) => n === i)
              ? "Ta boucle est correcte. Tu vas maintenant effectuer toi-même les relaxations."
              : "Il faut connaître les coûts avant de choisir ; fixer avant de propager ; répéter après les comparaisons.",
          )
        }
      >
        Vérifier ma méthode
      </button>
      <button
        onClick={() => {
          setOrder([0, 1, 2, 3, 4]);
          setFeedback(
            "Méthode affichée. Chaque instruction correspond à une action dans le graphe.",
          );
        }}
      >
        Voir l’ordre expliqué
      </button>
      <CourseParagraph role="status">{feedback}</CourseParagraph>
    </div>
  );
}
export function DijkstraDiscovery() {
  const [labels, setLabels] = useState(() => initialLabels(TD4_DIRECTED, "A"));
  const [active, setActive] = useState<string | null>(null);
  const [pending, setPending] = useState<[string, string, number][]>([]);
  const [value, setValue] = useState("");
  const [notice, setNotice] = useState(
    "À A, le coût est nul : aucun arc n’a encore été parcouru.",
  );
  const [history, setHistory] = useState<Record<string, Label>[]>([]);
  const edge = pending[0];
  function choose(n: string) {
    if (pending.length) {
      setNotice(
        "Termine les comparaisons des arcs sortants avant de fixer un autre sommet. La solution reste accessible.",
      );
      return;
    }
    try {
      const next = settleMinimum(labels, n);
      setHistory((h) => [...h, labels]);
      setLabels(next);
      setActive(n);
      setPending(
        TD4_DIRECTED.edges.filter(([a, b]) => a === n && !next[b].fixed),
      );
      setValue("");
      setNotice(
        `${n} devient définitif : examine maintenant chaque arc sortant.`,
      );
    } catch {
      setNotice(
        `${n} ne peut pas encore être fixé : compare tous les coûts provisoires. Un chemin direct n’est pas nécessairement le moins cher.`,
      );
    }
  }
  function compare(keep: boolean) {
    if (!edge) return;
    const [a, b, w] = edge,
      candidate = labels[a].cost + w,
      improves = candidate < labels[b].cost;
    if (!value.trim() || Number(value) !== candidate) {
      setNotice(
        `Calcule la longueur du chemin complet : ${f(labels[a].cost)} jusqu’à ${a}, puis ${w} pour ${a} → ${b}.`,
      );
      return;
    }
    if (keep === improves) {
      setNotice(
        `Compare ${candidate} à ${f(labels[b].cost)} : ${improves ? "le candidat améliore la distance." : "l’ancienne distance est déjà au moins aussi bonne."}`,
      );
      return;
    }
    setLabels((s) => relax(s, a, b, w));
    setPending((s) => s.slice(1));
    setValue("");
    setNotice(
      improves
        ? `${b} passe à ${candidate}, avec ${a} comme prédécesseur. C’est une relaxation.`
        : `On garde ${b} à ${f(labels[b].cost)}. Ce détour n’améliore rien.`,
    );
  }
  const fixed = Object.keys(labels).filter((n) => labels[n].fixed);
  const allDone = fixed.length === TD4_DIRECTED.nodes.length;
  return (
    <div className="nl-workbench" id="dijkstra-discovery">
      <h3>Construire Dijkstra à partir d’un trajet</h3>
      <CourseParagraph>
        Le fichier doit aller de A à F. Chaque <Term id="arc" /> consomme un
        coût ; on additionne les coûts du chemin. Regarder seulement le dernier
        arc ne suffit pas : atteindre B directement coûte 10, mais passer par E
        coûte 5 + 2 = 7. Il nous faut une mémoire des meilleurs trajets, puis
        une règle pour savoir quand un coût ne peut plus diminuer.
      </CourseParagraph>
      <RebuildRules />
      <div className="nl-discovery-grid">
        <DragGraph
          graph={TD4_DIRECTED}
          labels={Object.fromEntries(
            Object.entries(labels).map(([n, l]) => [n, f(l.cost)]),
          )}
          active={active}
          selected={fixed}
          onNode={choose}
          edgeProgress={edge ? { [`${edge[0]}-${edge[1]}`]: 1 } : {}}
        />
        <div>
          <h4>À toi d’exécuter ta méthode</h4>
          <div className="nl-options">
            {TD4_DIRECTED.nodes
              .filter((n) => !labels[n].fixed)
              .map((n) => (
                <button
                  key={n}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", n)}
                  onClick={() => choose(n)}
                >
                  {n} · {f(labels[n].cost)}
                </button>
              ))}
          </div>
          <div
            className="nl-dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const n = e.dataTransfer.getData("text/plain");
              if (TD4_DIRECTED.nodes.includes(n)) choose(n);
            }}
          >
            Dépose ici le sommet dont la distance est sûre.
            <br />
            Définitifs : {fixed.join(", ") || "aucun"}
          </div>
          {edge && (
            <div className="nl-relaxation">
              <CourseParagraph>
                Arc{" "}
                <strong>
                  {edge[0]} → {edge[1]}
                </strong>{" "}
                de coût {edge[2]}.
              </CourseParagraph>
              <CourseParagraph>
                Ancien coût de {edge[1]} : {f(labels[edge[1]].cost)}.
              </CourseParagraph>
              <label>
                Coût candidat = {f(labels[edge[0]].cost)} + {edge[2]}
                <input
                  inputMode="numeric"
                  aria-label="Coût du chemin candidat"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </label>
              <div className="nl-inline">
                <button onClick={() => compare(false)}>
                  Remplacer par le candidat
                </button>
                <button onClick={() => compare(true)}>
                  Garder l’ancien coût
                </button>
              </div>
            </div>
          )}
          {allDone && (
            <CourseParagraph className="nl-good">
              Toutes les distances accessibles sont définitives. Tu as exécuté
              chaque addition et comparaison.
            </CourseParagraph>
          )}
          <CourseParagraph role="status">{notice}</CourseParagraph>
          <button
            disabled={!history.length}
            onClick={() => {
              setLabels(history[history.length - 1]);
              setHistory((h) => h.slice(0, -1));
              setPending([]);
              setActive(null);
              setNotice("Retour avant la dernière fixation.");
            }}
          >
            Revenir avant la dernière fixation
          </button>
          <button
            onClick={() => {
              setLabels(initialLabels(TD4_DIRECTED, "A"));
              setPending([]);
              setHistory([]);
              setActive(null);
              setNotice("Source à 0, autres à ∞.");
            }}
          >
            Repartir de zéro
          </button>
          <button
            onClick={() => {
              setLabels(shortestSteps(TD4_DIRECTED, "A").slice(-1)[0].labels);
              setPending([]);
              setNotice("Solution affichée : A=0, E=5, B=7, C=9, D=10, F=10.");
            }}
          >
            Afficher la solution Dijkstra
          </button>
        </div>
      </div>
      <div className="nl-table-scroll">
        <table>
          <caption>La mémoire que tu construis</caption>
          <thead>
            <tr>
              <th>Sommet</th>
              <th>Coût</th>
              <th>Prédécesseur</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(labels).map(([n, l]) => (
              <tr key={n}>
                <th>{n}</th>
                <td>{f(l.cost)}</td>
                <td>{l.via || "—"}</td>
                <td>{l.fixed ? "Définitif" : "Provisoire"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DijkstraProof />
    </div>
  );
}
function DijkstraProof() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [negative, setNegative] = useState(false);
  const labels = shortestSteps(TD4_DIRECTED, "A").slice(-1)[0].labels;
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setTime((t) => {
          if (t >= 12) {
            setPlaying(false);
            return 12;
          }
          return Math.min(12, t + 0.1);
        }),
      100,
    );
    return () => clearInterval(timer);
  }, [playing]);
  return (
    <section id="dijkstra-proof" className="nl-proof">
      <h3>Pourquoi le premier arrivé a-t-il le coût minimal ?</h3>
      <CourseParagraph>
        Imagine une onde qui part de A et emprunte tous les arcs. Traverser un
        arc de poids 5 demande cinq unités de budget. Elle atteint E à 5, puis B
        à 7 par E, avant la route directe de coût 10. Déplace les points : ce
        calendrier ne change pas. Cette animation représente des{" "}
        <strong>coûts accumulés</strong>, pas les distances en pixels ni les
        délais réels d’un protocole.
      </CourseParagraph>
      <DragGraph
        graph={TD4_DIRECTED}
        labels={Object.fromEntries(
          Object.entries(labels).map(([n, l]) => [
            n,
            time >= l.cost ? `arrivée ${l.cost}` : "pas encore",
          ]),
        )}
        selected={Object.keys(labels).filter((n) => labels[n].cost <= time)}
        edgeProgress={waveProgress(TD4_DIRECTED, labels, time)}
      />
      <label>
        Budget de l’onde : {time.toFixed(1)}
        <input
          aria-label="Budget de l’onde"
          type="range"
          min="0"
          max="12"
          step="0.1"
          value={time}
          onChange={(e) => {
            setPlaying(false);
            setTime(Number(e.target.value));
          }}
        />
      </label>
      <button
        onClick={() => {
          if (time >= 12) setTime(0);
          setPlaying(!playing);
        }}
      >
        {playing ? "Pause" : "Animer l’onde"}
      </button>
      <button
        onClick={() => {
          setPlaying(false);
          setTime(0);
        }}
      >
        Revenir à A
      </button>
      <h4>La frontière : l’argument qui vaut pour tous les graphes</h4>
      <CourseParagraph>
        Les sommets déjà fixés forment un ensemble S. Tout chemin vers un sommet
        encore dehors doit traverser une première fois la{" "}
        <Term id="frontiere" />. Le coût connu du premier sommet dehors est au
        moins le minimum provisoire choisi. Les arcs qui restent à parcourir
        sont non négatifs : ils ne peuvent pas le rendre plus petit.
      </CourseParagraph>
      <div className="nl-proof-strip">
        <span>S : distances prouvées</span>
        <span>
          → premier passage dehors
          <br />≥ minimum provisoire
        </span>
        <span>
          → reste du chemin
          <br />+ coût ≥ 0
        </span>
      </div>
      <CourseParagraph>
        Donc aucun chemin encore inconnu ne peut battre ce minimum. C’est l’
        <Term id="invariant" /> : chaque sommet fixé possède sa vraie distance
        minimale.
      </CourseParagraph>
      <Explain title="Démonstration par induction, sans sauter l’étape clé">
        <CourseParagraph>
          Initialement, d(A)=0 est minimal car tous les coûts sont non négatifs.
          Supposons les distances de S exactes et choisissons u hors de S de
          plus petite étiquette d(u). Pour un chemin quelconque A→u, soit x son
          premier sommet hors de S et y le sommet précédent dans S. L’arc y→x a
          été relâché lorsque y a été fixé : d(x) ≤ δ(A,y)+w(y,x), donc d(x) est
          au plus le coût du préfixe de ce chemin. Par choix de u, d(u) ≤ d(x).
          Comme le suffixe x→u a un coût non négatif, d(u) est au plus le coût
          du chemin entier. Cela vaut pour tout chemin. Réciproquement, chaque
          étiquette finie vient d’un chemin réellement construit, donc d(u) ne
          sous-estime pas le minimum. Il y a égalité : fixer u préserve
          l’invariant.
        </CourseParagraph>
      </Explain>
      <label>
        <input
          type="checkbox"
          checked={negative}
          onChange={(e) => setNegative(e.target.checked)}
        />{" "}
        Retirer l’hypothèse « coûts non négatifs »
      </label>
      {negative && (
        <CourseParagraph role="status" className="nl-feedback">
          Contre-exemple : A→U vaut 2, A→V vaut 5, V→U vaut −4. Fixer U à 2
          serait faux : A→V→U coûte 1. Le suffixe négatif peut réduire le coût
          après la frontière ; la preuve précédente ne tient plus.
        </CourseParagraph>
      )}
      <Choice
        question="Déplacer B plus près de A dans ce dessin peut-il réduire le coût du trajet ?"
        options={[
          "Oui, les pixels définissent le coût",
          "Non, seuls les poids des arcs interviennent",
        ]}
        answer={1}
        why="Le graphe est pondéré. La géométrie est une aide à lire les connexions ; elle ne remplace pas les poids."
      />
    </section>
  );
}
export function DistanceDiscovery() {
  const [state, setState] = useState(() => dvState(TD4_DV));
  const [receiver, setReceiver] = useState("A");
  const [sender, setSender] = useState("B");
  const [dest, setDest] = useState("D");
  const [guess, setGuess] = useState("");
  const [notice, setNotice] = useState(
    "A ne connaît pas D. B peut-il lui apprendre quelque chose ?",
  );
  const [packet, setPacket] = useState<string | null>(null);
  const peers = state.graph.edges
    .filter(([a]) => a === receiver)
    .map(([, b]) => b);
  const weight = state.graph.edges.find(
    ([a, b]) => a === receiver && b === sender,
  )?.[2];
  const announced = state.tables[sender][dest].cost;
  const candidate = weight === undefined ? Infinity : weight + announced;
  function deliver(from: string) {
    if (!peers.includes(from)) {
      setNotice(
        "Une annonce ne traverse ici qu’une liaison directe : choisis un voisin.",
      );
      return;
    }
    if (from !== sender) {
      setSender(from);
      setGuess("");
      setNotice(
        `Annonce de ${from} sélectionnée. Calcule son coût candidat avant de la transmettre.`,
      );
      return;
    }
    const numeric =
      guess.trim() === "∞" || guess.trim().toLowerCase() === "inf"
        ? Infinity
        : Number(guess);
    if (!guess.trim() || numeric !== candidate) {
      setNotice(
        `Avant d’utiliser l’annonce : ajoute le coût du lien (${weight}) au coût annoncé (${f(announced)}). ∞ reste ∞.`,
      );
      return;
    }
    const next = receiveVectors(state, receiver, [from]);
    setState(next);
    setPacket(`${from}-${receiver}`);
    setNotice(
      `${from} annonce ${dest} à ${f(announced)} ; via ${from}, candidat ${f(candidate)}. ${receiver} compare aussi ses autres routes : il retient ${f(next.tables[receiver][dest].cost)} via ${next.tables[receiver][dest].next}.`,
    );
    setGuess("");
  }
  useEffect(() => {
    if (!packet) return;
    const t = setTimeout(() => setPacket(null), 1500);
    return () => clearTimeout(t);
  }, [packet]);
  return (
    <div id="distance-discovery" className="nl-workbench">
      <h3>Inventer la règle avec les voisins</h3>
      <CourseParagraph>
        Sans carte complète, A pose une question à B : « combien te coûte D ? ».
        Une réponse n’est pas un chemin gratuit : A doit d’abord payer le lien
        A–B. Tu vas reconstruire{" "}
        <strong>additionner, comparer, mémoriser, annoncer de nouveau</strong>.
        Chaque message transporte un vecteur entier ; on détaille ici le calcul
        pour une destination.
      </CourseParagraph>
      <DragGraph
        graph={state.graph}
        directed={false}
        travelling={packet}
        active={receiver}
        labels={Object.fromEntries(
          state.graph.nodes.map((n) => [
            n,
            `vers ${dest} : ${f(state.tables[n][dest].cost)}`,
          ]),
        )}
        onNode={(n) => {
          setReceiver(n);
          setSender(state.graph.edges.find(([a]) => a === n)![1]);
          setGuess("");
        }}
        edgeProgress={
          packet
            ? { [packet]: 1, [packet.split("-").reverse().join("-")]: 1 }
            : {}
        }
      />
      <div className="nl-inline">
        <label>
          Routeur qui apprend{" "}
          <select
            value={receiver}
            onChange={(e) => {
              const n = e.target.value;
              setReceiver(n);
              setSender(state.graph.edges.find(([a]) => a === n)![1]);
              setGuess("");
            }}
          >
            {state.graph.nodes.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          Destination observée{" "}
          <select
            value={dest}
            onChange={(e) => {
              setDest(e.target.value);
              setGuess("");
            }}
          >
            {state.graph.nodes.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="nl-options">
        {peers.map((n) => (
          <button
            key={n}
            draggable
            aria-pressed={sender === n}
            onClick={() => {
              setSender(n);
              setGuess("");
            }}
            onDragStart={(e) => e.dataTransfer.setData("text/plain", n)}
          >
            Annonce de {n} : {dest} à {f(state.tables[n][dest].cost)}
          </button>
        ))}
      </div>
      <CourseParagraph>
        Via {sender} : lien {receiver}–{sender} de coût {weight}, puis distance
        annoncée {f(announced)}. Route actuellement retenue :{" "}
        {f(state.tables[receiver][dest].cost)}.
      </CourseParagraph>
      <label>
        Mon coût candidat (ou ∞)
        <input
          aria-label="Coût candidat par le voisin"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
      </label>
      <div
        className={`nl-dropzone ${packet ? "nl-announcement" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          deliver(e.dataTransfer.getData("text/plain"));
        }}
      >
        Glisse l’annonce choisie jusqu’à {receiver}.
        <button onClick={() => deliver(sender)}>
          Transmettre {sender} → {receiver}
        </button>
      </div>
      <CourseParagraph role="status">{notice}</CourseParagraph>
      <button
        onClick={() => {
          setGuess(f(candidate));
          setNotice(
            `Le calcul est ${weight} + ${f(announced)} = ${f(candidate)}. Transmets ensuite l’annonce.`,
          );
        }}
      >
        Voir le calcul candidat
      </button>
      <button
        onClick={() => {
          setState(dvState(TD4_DV));
          setGuess("");
          setNotice(
            "Chaque routeur ne connaît de nouveau que lui-même et ses voisins.",
          );
        }}
      >
        Recommencer les annonces
      </button>
      <div className="nl-table-scroll">
        <table>
          <caption>Les connaissances locales, destination {dest}</caption>
          <thead>
            <tr>
              <th>Routeur</th>
              <th>Coût</th>
              <th>Prochain saut</th>
            </tr>
          </thead>
          <tbody>
            {state.graph.nodes.map((n) => (
              <tr key={n}>
                <th>{n}</th>
                <td>{f(state.tables[n][dest].cost)}</td>
                <td>{state.tables[n][dest].next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Explain title="Toutes les tables que tu as construites">
        <div className="nl-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Routeur</th>
                <th>Destination</th>
                <th>Coût</th>
                <th>Via</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(state.tables).flatMap(([router, table]) =>
                Object.entries(table).map(([destination, r]) => (
                  <tr key={`${router}-${destination}`}>
                    <th>{router}</th>
                    <td>{destination}</td>
                    <td>{f(r.cost)}</td>
                    <td>{r.next}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      </Explain>
      <button
        onClick={() => {
          setState(dvState(TD4_DV, true));
          setNotice(
            "Tables convergées affichées. Recommence les annonces pour les reconstruire toi-même.",
          );
        }}
      >
        Voir les tables convergées
      </button>
      <Explain title="Pourquoi la répétition retrouve les plus courts chemins">
        <CourseParagraph>
          Sur une topologie fixe, partons de D₀(u,u)=0, des coûts directs vers
          les voisins et de ∞ ailleurs. Après un tour synchrone d’échanges,
          chaque routeur peut prolonger d’un arc les routes déjà connues :
          Dₖ₊₁(u,d)=min(Dₖ(u,d), minᵥ[c(u,v)+Dₖ(v,d)]). Par induction, on
          connaît les meilleurs chemins utilisant de plus en plus d’arcs. Sans
          cycle négatif, un plus court chemin peut être simple, donc utiliser au
          plus |V|−1 arcs. Les échanges répétés finissent par le découvrir. Dans
          ce jeu asynchrone, un clic n’est pas un tour complet : chaque routeur
          doit effectivement recevoir les nouvelles informations.
        </CourseParagraph>
        <CourseParagraph>
          Après une panne, les anciennes valeurs ne sont plus forcément valides.
          Les annonces locales peuvent même former temporairement des boucles.
          Contrairement à Dijkstra, un petit coût annoncé n’est donc pas « fixé
          pour toujours ». Le TD ci-dessous montre cette propagation dans
          l’ordre exact t1–t4.
        </CourseParagraph>
      </Explain>
    </div>
  );
}
