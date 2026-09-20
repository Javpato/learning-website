"use client";
import { useState } from "react";
import { PacketSwitchWidget } from "@/components/cs/scenes/PacketSwitchWidget";
import {
  TD4_DIRECTED,
  TD4_DV,
  TD4_EVENTS,
  shortestSteps,
  pathTo,
  dvState,
  receiveVectors,
  td4FailureSteps,
  switchingTime,
  type Tables,
} from "@/lib/cs/networkLab";
import {
  Choice,
  Explain,
  GraphView,
  Lesson,
  Numeric,
  Source,
  TermMap,
} from "./shared";
import { NetworkBuilder } from "./Introduction";
const fmt = (v: number) => (Number.isFinite(v) ? String(v) : "∞");
function ServiceLab() {
  const [connected, setConnected] = useState(true);
  const [stage, setStage] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const send = () => {
    if (connected && stage !== 4)
      setLog((s) => [
        ...s,
        "Envoi refusé : le service connecté exige une connexion établie.",
      ]);
    else
      setLog((s) => [
        ...s,
        connected
          ? "N-DATA.request → N-DATA.indication : données transférées dans la connexion."
          : "Datagramme envoyé avec sa destination : acheminement indépendant, sans garantie de livraison.",
      ]);
  };
  const events = [
    "N-CONNECT.request : A demande une connexion",
    "N-CONNECT.indication : B reçoit la demande",
    "N-CONNECT.response : B accepte",
    "N-CONNECT.confirmation : A est informé",
  ];
  return (
    <div className="nl-workbench">
      <div className="nl-options">
        <button
          aria-pressed={connected}
          onClick={() => {
            setConnected(true);
            setStage(0);
            setLog([]);
          }}
        >
          Service connecté
        </button>
        <button
          aria-pressed={!connected}
          onClick={() => {
            setConnected(false);
            setStage(0);
            setLog([]);
          }}
        >
          Datagrammes
        </button>
      </div>
      <p>
        Prédis : peut-on envoyer avant d'établir la connexion ? Essaie les deux
        services.
      </p>
      <div className="nl-service">
        <span>A · utilisateur</span>
        <span>
          Réseau{" "}
          {connected
            ? stage === 4
              ? "· connexion établie"
              : "· non établi"
            : "· sans connexion"}
        </span>
        <span>B · utilisateur</span>
      </div>
      <div className="nl-inline">
        {connected && (
          <button
            disabled={stage === 4}
            onClick={() => {
              setLog((s) => [...s, events[stage]]);
              setStage(stage + 1);
            }}
          >
            Étape suivante de connexion
          </button>
        )}
        <button onClick={send}>Envoyer les données</button>
        {connected && (
          <button
            onClick={() => {
              setStage(0);
              setLog((s) => [
                ...s,
                "N-DISCONNECT.request → indication : la connexion est libérée.",
              ]);
            }}
          >
            Libérer
          </button>
        )}
        <button
          onClick={() => {
            setStage(0);
            setLog([]);
          }}
        >
          Recommencer
        </button>
      </div>
      <ol aria-live="polite" className="nl-log">
        {log.slice(-5).map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ol>
      <Explain>
        <p>
          Une primitive est une interaction usager/service : request part de
          l'utilisateur, indication arrive à l'autre utilisateur, response en
          repart, confirmation revient au demandeur. Ce sont des interfaces de
          service, pas quatre types de paquets obligatoires. Le protocole entre
          nœuds réalise ce service.
        </p>
        <p>
          Un circuit virtuel maintient un contexte de connexion ; cela
          n'implique pas de réserver un fil physique de bout en bout. Un
          datagramme transporte l'adresse de destination à chaque envoi. Dans le
          modèle non connecté du cours, il n'existe pas de garantie de
          livraison, d'ordre ou d'absence de doublons. Fiabilité et mode de
          connexion sont des propriétés à préciser, pas des synonymes
          universels.
        </p>
      </Explain>
      <Choice
        question="N-CONNECT.request décrit surtout…"
        options={[
          "une interaction entre usager et service",
          "un câble réservé",
          "le calcul de Dijkstra",
        ]}
        answer={0}
        why="Le cours distingue le point de vue usager/réseau du protocole entre nœuds (page 9)."
      />
    </div>
  );
}
function SwitchingLab() {
  const [size, setSize] = useState(2000);
  const [header, setHeader] = useState(40);
  const [links, setLinks] = useState(3);
  const [fixed, setFixed] = useState(false);
  const [setup, setSetup] = useState(10);
  const result = switchingTime(
    24000,
    size,
    header,
    links,
    1000000,
    0.001,
    fixed,
  );
  const message = switchingTime(24000, 24000, header, links, 1000000, 0.001);
  const cells = switchingTime(24000, 384, 40, links, 1000000, 0.001, true);
  const circuit = setup / 1000 + 0.024 + links * 0.001;
  return (
    <div className="nl-workbench">
      <h3>Le même fichier, quatre façons de le transporter</h3>
      <p>
        Illustration : 24 000 bits utiles, liens à 1 Mbit/s, propagation de 1 ms
        par lien. Stockage puis retransmission pour messages/paquets/cellules ;
        pas de trafic concurrent. Pour le circuit, la réservation est supposée
        réussie.
      </p>
      <div className="nl-controls">
        <label>
          Liaisons : {links}
          <input
            type="range"
            min="1"
            max="5"
            value={links}
            onChange={(e) => setLinks(Number(e.target.value))}
          />
        </label>
        <label>
          Charge utile par paquet
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            {[24000, 8000, 2000, 384, 128].map((x) => (
              <option key={x} value={x}>
                {x} bits
              </option>
            ))}
          </select>
        </label>
        <label>
          En-tête : {header} bits
          <input
            type="range"
            min="0"
            max="320"
            step="8"
            value={header}
            onChange={(e) => setHeader(Number(e.target.value))}
          />
        </label>
        <label>
          Établissement du circuit : {setup} ms
          <input
            type="range"
            min="0"
            max="100"
            value={setup}
            onChange={(e) => setSetup(Number(e.target.value))}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={fixed}
            onChange={(e) => setFixed(e.target.checked)}
          />{" "}
          Taille fixe : compléter le dernier paquet
        </label>
      </div>
      <table>
        <caption>
          Temps de réception du dernier bit, mêmes données et liens
        </caption>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Temps total</th>
            <th>Compromis</th>
          </tr>
        </thead>
        <tbody>
          {[
            [
              "Circuit",
              circuit,
              "Réservation + envoi continu ; ressource réservée même pendant un silence",
            ],
            ["Message", message.total, "Un message entier reçu avant relais"],
            [
              "Paquets",
              result.total,
              `${result.count} paquets ; ${result.overhead} bits ajoutés (en-têtes + remplissage)`,
            ],
            [
              "Cellules 53 octets",
              cells.total,
              `${cells.count} cellules : 48 octets utiles + 5 d’en-tête`,
            ],
          ].map(([name, time, why]) => (
            <tr key={String(name)}>
              <td>{name}</td>
              <td>{(Number(time) * 1000).toFixed(3)} ms</td>
              <td>{why}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="nl-bars">
        {[
          ["Message", message.total],
          ["Paquets", result.total],
          ["Cellules", cells.total],
        ].map(([n, t]) => (
          <div key={String(n)}>
            <span>{n}</span>
            <meter
              min={0}
              max={Math.max(message.total, result.total, cells.total)}
              value={Number(t)}
            />
            <span>{(Number(t) * 1000).toFixed(2)} ms</span>
          </div>
        ))}
      </div>
      <p role="status">
        Premier paquet reçu en {(result.first * 1000).toFixed(3)} ms ; dernier
        en {(result.total * 1000).toFixed(3)} ms. Débit utile :{" "}
        {(24000 / result.total / 1000).toFixed(1)} kbit/s.
      </p>
      <Explain>
        <p>
          Les petits paquets permettent aux liens de travailler en parallèle :
          pendant que le premier avance, le suivant entre dans le réseau. C'est
          le pipeline. Mais multiplier les paquets multiplie les en-têtes. Avec
          une taille fixe, le traitement est régulier ; le dernier bloc peut
          gaspiller du remplissage. Aucun mode ne gagne pour toute taille, tout
          trafic et toute contrainte de délai.
        </p>
        <p>
          Pour n paquets identiques sur k+1 liens identiques sans propagation, T
          = (k+n)(p+h)/D. Avec x bits utiles et n ≈ x/p, minimiser cette
          expression donne p ≈ √(xh/k) si k et h sont positifs. C'est une
          approximation, pas une règle universelle.
        </p>
      </Explain>
      <Choice
        question="Je réduis encore la taille des paquets. Le transfert sera-t-il toujours plus rapide ?"
        options={[
          "Oui, sans limite",
          "Non : les en-têtes et le remplissage peuvent coûter plus que le gain du pipeline",
        ]}
        answer={1}
        why="Compare en gardant le même fichier, le même débit et le même nombre de liens. Ne change qu’un paramètre à la fois."
      />
    </div>
  );
}
function DijkstraLab() {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [target, setTarget] = useState("F");
  const steps = shortestSteps(TD4_DIRECTED, "A");
  const current = steps[step];
  const labels = current.labels;
  const choose = (node: string) => {
    const minimum = Math.min(
      ...Object.values(labels)
        .filter((x) => !x.fixed)
        .map((x) => x.cost),
    );
    if (labels[node].fixed) {
      setFeedback(
        `${node} est déjà fixé : sa distance a été démontrée minimale.`,
      );
      return;
    }
    if (labels[node].cost !== minimum) {
      setFeedback(
        `Pas encore : ${node} coûte ${fmt(labels[node].cost)}, alors qu’un sommet provisoire est à ${fmt(minimum)}. Choisis le coût minimal, pas le lien isolé le plus court.`,
      );
      return;
    }
    if (step >= steps.length - 1) return;
    const actual = steps[step + 1].active;
    setStep(step + 1);
    setFeedback(
      actual === node
        ? `${node} est fixé. Pour chaque arc sortant, on compare coût actuel et coût via ${node}.`
        : `Même coût minimal : ${node} convient aussi. Pour garder une trace reproductible, ce tableau départage alphabétiquement et fixe ${actual}.`,
    );
  };
  return (
    <div className="nl-workbench">
      <h3>Reconstruire Dijkstra, depuis A</h3>
      <p>
        Besoin : choisir un chemin de coût total minimal, pas simplement le plus
        petit nombre de liens. On connaît la carte complète et les coûts sont
        positifs. A commence à 0 ; les autres à ∞.
      </p>
      <GraphView
        graph={TD4_DIRECTED}
        directed
        active={current.active}
        path={pathTo(labels, "A", target)}
      />
      <div className="nl-inline">
        <label>
          Montrer le chemin connu vers{" "}
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            {TD4_DIRECTED.nodes.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <button
          onClick={() => {
            setStep(0);
            setFeedback("");
          }}
        >
          Recommencer
        </button>
        <button
          onClick={() => {
            setStep(steps.length - 1);
            setFeedback(
              "Table finale affichée. Tu peux revenir à chaque étape.",
            );
          }}
        >
          Voir la solution
        </button>
      </div>
      <p>
        Étape {step}/{steps.length - 1} ·{" "}
        {current.active
          ? `Dernier sommet fixé : ${current.active}`
          : "Initialisation"}
        . Choisis le prochain sommet de coût provisoire minimal.
      </p>
      <div className="nl-options">
        {TD4_DIRECTED.nodes.map((n) => (
          <button
            key={n}
            aria-pressed={labels[n].fixed}
            onClick={() => choose(n)}
          >
            {n} · {fmt(labels[n].cost)} {labels[n].fixed ? "✓" : ""}
          </button>
        ))}
      </div>
      <p role="status">{feedback}</p>
      <table>
        <caption>Étiquettes : coût, prédécesseur, état</caption>
        <thead>
          <tr>
            <th>Sommet</th>
            <th>Coût</th>
            <th>Prédécesseur</th>
            <th>État</th>
            <th>Prochain saut depuis A</th>
          </tr>
        </thead>
        <tbody>
          {TD4_DIRECTED.nodes.map((n) => (
            <tr key={n}>
              <th>{n}</th>
              <td>{fmt(labels[n].cost)}</td>
              <td>{labels[n].via ?? "—"}</td>
              <td>{labels[n].fixed ? "Définitif" : "Provisoire"}</td>
              <td>{pathTo(labels, "A", n)[1] ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <label>
        Revoir une étape
        <input
          type="range"
          min="0"
          max={steps.length - 1}
          value={step}
          onChange={(e) => {
            setStep(Number(e.target.value));
            setFeedback("");
          }}
        />
      </label>
      <Explain title="Pourquoi fixer le plus petit coût fonctionne">
        <p>
          Tout détour par un sommet provisoire a un coût au moins égal au
          minimum provisoire, car les arcs ne sont pas négatifs. Aucun tel
          détour ne peut améliorer le minimum sélectionné : on peut le fixer.
          Puis on « relâche » ses arcs sortants : nouveau coût candidat =
          distance jusqu'au sommet + coût de l'arc.
        </p>
        <p>
          Depuis A : fixer A donne B=10, E=5 ; fixer E améliore B à 7 et donne
          C=9 ; fixer B donne D=10 ; fixer C donne F=10. Les coûts finaux sont
          A=0, E=5, B=7, C=9, D=10, F=10. Le prochain saut vers toutes ces
          destinations est E. Le prédécesseur de F est C, mais le premier saut
          depuis A est E : ce sont deux colonnes différentes.
        </p>
        <p>
          Le graphe du TD est orienté : C→D coûte 3, D→C coûte 2. Les arcs
          absents ne sont pas automatiquement ajoutés. Dijkstra ne convient pas
          tel quel à des arcs de coût négatif.
        </p>
      </Explain>
      <Numeric
        question="TD4 Q1.1 : coût minimal de A à F ?"
        answer={10}
        why="A → E → C → F : 5 + 4 + 1. A → E → B → C → F a aussi ce coût."
      />
      <Choice
        question="TD4 Q1.2 : quel problème reste à résoudre dans un réseau réel ?"
        options={[
          "Rendre la carte de chaque routeur cohérente et à jour",
          "Ajouter toujours mille nœuds",
          "Éviter tout échange entre routeurs",
        ]}
        answer={0}
        why="Il faut découvrir les voisins, mesurer les coûts, diffuser les changements et retirer les informations périmées."
      />
      <Explain title="De Dijkstra au protocole à états de liens">
        <p>
          Chaque nœud découvre ses voisins, mesure ses liaisons et diffuse un
          état de liens. L'inondation transporte l'information ; identifiant
          d'origine, numéros de séquence et durée de vie évitent de conserver
          indéfiniment doublons et annonces périmées. Chaque routeur reconstruit
          la carte puis exécute Dijkstra localement. Les pannes, coûts
          variables, mémoire, trafic de contrôle et convergence restent à gérer.
        </p>
      </Explain>
    </div>
  );
}
function RoutingTables({ tables }: { tables: Tables }) {
  return (
    <div className="nl-tables">
      {Object.entries(tables).map(([node, rows]) => (
        <table key={node}>
          <caption>Routeur {node}</caption>
          <thead>
            <tr>
              <th>Vers</th>
              <th>Via</th>
              <th>Coût</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rows).map(([d, r]) => (
              <tr key={d}>
                <th>{d}</th>
                <td>{r.next}</td>
                <td>{fmt(r.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
function DistanceLab() {
  const [learn, setLearn] = useState(() => dvState(TD4_DV));
  const [notice, setNotice] = useState(
    "Au départ, chacun ne connaît que ses voisins.",
  );
  const [failure, setFailure] = useState(0);
  const states = td4FailureSteps();
  const state = states[failure];
  return (
    <>
      <div className="nl-workbench">
        <h3>Reconstruire le vecteur de distances</h3>
        <p>
          Un routeur n'a pas besoin de connaître toute la carte pour demander à
          ses voisins : « à quelle distance es-tu de D ? ». Si B est à 2 et
          annonce D à 3, le chemin via B coûte 5.
        </p>
        <GraphView graph={TD4_DV} />
        <p>
          Règle : distance(u,d) = min sur les voisins v de [coût(u,v) + distance
          annoncée(v,d)]. La destination locale coûte 0. Les annonces reçues
          sont mémorisées ; les égalités gardent le prochain saut actuel.
        </p>
        <div className="nl-options">
          {TD4_DV.nodes.map((n) => (
            <button
              key={n}
              onClick={() => {
                const peers = TD4_DV.edges
                  .filter(([a]) => a === n)
                  .map(([, b]) => b);
                setLearn((s) => receiveVectors(s, n, peers));
                setNotice(
                  `${n} reçoit les vecteurs de ${peers.join(", ")} et recalcule ses minima.`,
                );
              }}
            >
              {n} reçoit ses voisins
            </button>
          ))}
        </div>
        <div className="nl-inline">
          <button
            onClick={() => {
              setLearn(dvState(TD4_DV));
              setNotice("Retour à la connaissance locale.");
            }}
          >
            État initial
          </button>
          <button
            onClick={() => {
              setLearn(dvState(TD4_DV, true));
              setNotice(
                "Solution convergée affichée, sans condition de progression.",
              );
            }}
          >
            Voir les tables convergées
          </button>
        </div>
        <p role="status">{notice}</p>
        <RoutingTables tables={learn.tables} />
        <Explain title="TD4 Q2.1 — tables convergées">
          <p>
            A : B=2 via B, C=3 via C, D=5 via B. B : A=2 via A, C=2 via C, D=3
            via D. C : A=3 via A, B=2 via B, D=3 via D. D : A=5 via B, B=3 via
            B, C=3 via C.
          </p>
          <p>
            L'énoncé appelle cet algorithme « Ford-Fulkerson ». Le mécanisme
            enseigné ici est l'actualisation de vecteurs de distances (règle de
            Bellman-Ford distribuée), pas un calcul de flot maximal.
          </p>
        </Explain>
      </div>
      <div className="nl-workbench">
        <h3>TD4 Q2.2 · La liaison C–D tombe en panne</h3>
        <p>
          Le réseau part des tables convergées. Les deux extrémités détectent la
          coupure ; les autres ne la connaissent pas encore. Suis exactement les
          annonces t1–t4 du TD.
        </p>
        <div className="nl-options">
          {[
            "Avant panne",
            "Panne détectée",
            "t1 : D reçoit B",
            "t2 : B reçoit A, C, D",
            "t3 : C reçoit A, B",
            "t4 : A reçoit B, C",
          ].map((name, i) => (
            <button
              key={name}
              aria-pressed={failure === i}
              onClick={() => setFailure(i)}
            >
              {name}
            </button>
          ))}
        </div>
        <GraphView graph={state.graph} />
        <RoutingTables tables={state.tables} />
        {failure >= 2 && (
          <div className="nl-explain">
            <h4>Vecteurs reçus à cette étape</h4>
            <p>
              {TD4_EVENTS[failure - 2][0]} reçoit les annonces de l'état
              précédent :
            </p>
            <ul>
              {TD4_EVENTS[failure - 2][1].map((sender) => (
                <li key={sender}>
                  {sender} :{" "}
                  {Object.entries(states[failure - 1].tables[sender])
                    .map(([d, r]) => `${d}=${fmt(r.cost)}`)
                    .join(" ; ")}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p role="status">
          {
            [
              "Avant panne, C et D se joignent directement pour un coût 3.",
              "C invalide sa route vers D ; D invalide sa route vers C. Les annonces mémorisées restent locales jusqu’aux échanges.",
              "D apprend via B une route vers C de coût 3 + 2 = 5.",
              "B reçoit les trois vecteurs ; ses minima restent inchangés.",
              "C retrouve D via B : 2 + 3 = 5.",
              "A reçoit B et C ; sa route vers D reste de coût 5 via B.",
            ][failure]
          }
        </p>
        <Numeric
          question="Après convergence suivant la panne, quel coût de C à D ?"
          answer={5}
          why="La liaison directe est coupée. C → B → D coûte 2 + 3."
        />
        <Explain title="Convergence et limites">
          <p>
            Un changement n'est pas instantanément connu partout. Des annonces
            périmées peuvent créer des boucles et un comptage à l'infini.
            L'horizon partagé évite d'annoncer au voisin une route apprise de
            lui ; avec antidote (poisoned reverse), on l'annonce à l'infini.
            Cela atténue certains cas, sans supprimer toutes les boucles
            possibles.
          </p>
          <p>
            États de liens : davantage de mémoire et une carte complète, calcul
            local des chemins. Vecteurs de distances : échanges de distances
            avec les voisins et connaissance partielle, convergence parfois
            lente. La qualité dépend des coûts, temporisations et règles du
            protocole, pas seulement du nom de l'algorithme.
          </p>
        </Explain>
      </div>
    </>
  );
}
export function Routing() {
  return (
    <>
      <Lesson
        id="routage-besoin"
        kicker="Routage · pages 3–9"
        title="Quand le destinataire n’est plus un voisin"
      >
        <p className="nl-lead">
          La liaison du TD1 sait transmettre. Maintenant, plusieurs liaisons
          doivent coopérer pour atteindre B.
        </p>
        <TermMap
          goal="Choisir un chemin et transporter le message jusqu’au bon destinataire"
          terms={[
            "topologie",
            "acheminement",
            "table-de-routage",
            "circuit-virtuel",
            "datagramme",
            "service",
          ]}
        />
        <NetworkBuilder />
        <p>
          Un <strong>nœud d'accès</strong> raccorde une station ; un{" "}
          <strong>nœud interne</strong> relaie le trafic. Le réseau assure
          adressage, routage et contrôle de congestion. Il transporte les
          données sans avoir à comprendre leur contenu ; il doit préciser les
          garanties de qualité de service offertes.
        </p>
        <ServiceLab />
        <Source>Cours/Routage.pdf, p. 3–9</Source>
      </Lesson>
      <Lesson
        id="routage-commutation"
        kicker="Routage · pages 11–25"
        title="Découper, attendre, transmettre"
      >
        <TermMap
          goal="Réduire le délai sans gaspiller les ressources"
          terms={[
            "temps-de-transmission",
            "temps-de-propagation",
            "store-and-forward",
            "commutation-de-circuits",
            "commutation-de-messages",
            "commutation-de-paquets",
            "commutation-de-cellules",
          ]}
        />
        <p>
          Transmission : L/D, temps pour pousser L bits sur un lien de débit D.
          Propagation : distance/vitesse, temps de voyage du signal. À cela
          peuvent s'ajouter traitement et attente. Dans ce cours, k = 1 000 ; un
          octet contient 8 bits.
        </p>
        <SwitchingLab />
        <h3>Partiel 2023 · le routeur attend le paquet entier</h3>
        <p>
          A → R à 10 Mbit/s, R → B à 5 Mbit/s ; deux liens de 6 600 km, fichier
          30 k octets, paquets de 10 k et 20 k octets. L'extrait ne précise pas
          la vitesse de propagation : le simulateur prend 300 000 km/s, soit 22
          ms par lien (hypothèse simplifiée conservée dans ce chronogramme). Ne
          présente pas une durée numérique comme indépendante de cette
          hypothèse.
        </p>
        <PacketSwitchWidget preset="partiel" />
        <Numeric
          question="Quel écart entre les arrivées des derniers bits des deux paquets à B ?"
          answer={32}
          unit="ms"
          why="R émet le premier en 16 ms, puis le second en 32 ms. L’écart final est 32 ms ; la propagation identique s’annule dans la différence."
        />
        <Explain title="Calcul du total et du débit utile">
          <p>
            Le premier paquet est émis par A de 0 à 8 ms ; le second de 8 à 24
            ms. Avec t de propagation sur chaque lien, le premier part de R à
            8+t et finit d'y être émis à 24+t. Le second arrive précisément à
            24+t ; il finit d'être émis à 56+t. Dernier bit chez B à 56+2t ms.
            Pour t=22 ms, total 100 ms et débit utile 240 000/0,100 = 2,4
            Mbit/s. Faire la moyenne de 10 et 5 Mbit/s ne donne pas ce débit.
          </p>
        </Explain>
        <Source>
          Cours/Routage.pdf, p. 11–25 ; partiel-L2Info-2023.pdf, p. PDF 1,
          exercice 1
        </Source>
      </Lesson>
      <Lesson
        id="routage-fonctions"
        kicker="Routage · pages 27–39"
        title="Une adresse, une table, une décision"
      >
        <p>
          L'adresse désigne la destination ; le chemin indique comment y
          parvenir. Un adressage plat identifie sans structure géographique, un
          adressage hiérarchique permet d'agréger des destinations. Nous restons
          ici au niveau conceptuel ; les masques IP appartiennent à la partie
          suivante du cours.
        </p>
        <div className="nl-two">
          <div className="nl-explain">
            <h3>Acheminement</h3>
            <p>
              Pour chaque paquet, consulter la table et choisir une sortie. En
              datagrammes, on utilise la destination. En circuit virtuel, une
              étiquette locale peut être remplacée par une autre à chaque nœud
              (exemple du cours : 26 → 11 → 8 → 3).
            </p>
          </div>
          <div className="nl-explain">
            <h3>Adaptation des chemins</h3>
            <p>
              Construire et mettre à jour les tables selon la topologie et les
              coûts. Routage statique : décisions configurées ; dynamique :
              informations échangées. Les calculs peuvent être centralisés ou
              distribués.
            </p>
          </div>
        </div>
        <Choice
          question="Un routeur consulte une table déjà calculée pour envoyer un paquet. Quelle fonction exerce-t-il ?"
          options={["Acheminement", "Adaptation des chemins"]}
          answer={0}
          why="L’adaptation modifie les routes ; l’acheminement applique la route retenue au paquet."
        />
        <Explain title="Les qualités recherchées">
          <p>
            Simplicité, robustesse, convergence, absence de boucles et
            adaptation à la charge doivent être conciliées. Une métrique peut
            représenter délai, coût ou nombre de sauts. Un chemin minimal pour
            une métrique n'est pas nécessairement le plus rapide si cette
            métrique ne mesure pas le délai. Une file d'attente qui se remplit
            peut accroître le délai sans changer la longueur physique du lien.
          </p>
        </Explain>
        <Source>Cours/Routage.pdf, p. 27–39</Source>
      </Lesson>
      <Lesson
        id="routage-dijkstra"
        kicker="Routage · graphes et TD4 exercice 1"
        title="Reconstruire le plus court chemin"
      >
        <TermMap
          goal="Trouver le coût minimal et le prochain saut"
          terms={[
            "algorithme-de-dijkstra",
            "etat-de-liens",
            "inondation",
            "table-de-routage",
          ]}
        />
        <p>
          Un graphe représente les nœuds par des sommets, les liaisons par des
          arcs (orientés) ou arêtes (non orientées). Le coût d'un chemin est la
          somme des coûts de ses liaisons.
        </p>
        <DijkstraLab />
        <Source>
          Cours/Routage.pdf, p. 40 et 44–48 ; TD/TD456-correction.pdf, p. 1,
          Q1.1–Q1.2
        </Source>
      </Lesson>
      <Lesson
        id="routage-vecteurs"
        kicker="Routage · TD4 exercice 2"
        title="Apprendre le réseau par ses voisins"
      >
        <DistanceLab />
        <Source>
          Cours/Routage.pdf, p. 41–43 ; TD/TD456-correction.pdf, p. 2, Q2.1–Q2.2
        </Source>
      </Lesson>
      <Lesson
        id="routage-transfert"
        kicker="Sans aide · annales"
        title="Passer du jeu à la copie"
      >
        <p>
          Partiel 2021 : A–B, A–D, B–C, B–E, C–E et D–E sont des liens
          symétriques de coût 1. Au départ, chacun ne connaît que ses voisins. À
          t1, B et D reçoivent le vecteur de A.
        </p>
        <Numeric
          question="Après cet échange, quel coût B apprend-il vers D ?"
          answer={2}
          why="B → A coûte 1 ; A annonce D à 1. B apprend D à 2 via A."
        />
        <Choice
          question="Une table contient destination D, coût 2, prochain saut A. Cela signifie…"
          options={[
            "Envoyer directement à D",
            "Envoyer à A, qui poursuivra l’acheminement",
          ]}
          answer={1}
          why="Une table d’acheminement donne une décision locale ; elle n’énumère pas nécessairement tous les nœuds du chemin."
        />
        <Explain title="Ce qui doit apparaître sur ta copie">
          <p>
            Dijkstra : étiquettes coût/prédécesseur, ordre des sommets fixés,
            relâchements puis table destination/prochain saut/coût. Vecteurs de
            distances : annonces effectivement reçues, coût du lien vers le
            voisin, comparaison des candidats et seules modifications de table
            demandées. Après une panne, préciser quel routeur sait quoi à chaque
            instant.
          </p>
          <p>
            Le final demande également de lire une table « destination, masque,
            prochain saut, interface ». Le prochain saut se comprend déjà ici ;
            calculs de masques et fragmentation restent réservés au chapitre IP.
          </p>
        </Explain>
        <Source>
          partiel-2021.pdf, p. PDF 1, exercice 1 ; Annale_Exam_Corr.pdf, p. 3,
          table de R1
        </Source>
      </Lesson>
    </>
  );
}
