"use client";
import { CourseParagraph } from "./Definitions";
import { useState } from "react";
import { shortestSteps, pathTo, symmetric } from "@/lib/cs/networkLab";
import {
  Choice,
  Explain,
  GraphView,
  Lesson,
  LINKS,
  Numeric,
  Source,
  TermMap,
  useLab,
} from "./shared";

export function NetworkBuilder({ final = false }: { final?: boolean }) {
  const { state, setState } = useLab();
  const [sent, setSent] = useState(false);
  const graph = symmetric(
    ["A", "N1", "N2", "B"],
    LINKS.filter(([a, b]) => state.links.includes(`${a}-${b}`)),
  );
  const labels = shortestSteps(graph, "A").slice(-1)[0].labels;
  const path = pathTo(labels, "A", "B");
  const toggle = (key: string) => {
    setState((s) => ({
      ...s,
      links: s.links.includes(key)
        ? s.links.filter((k) => k !== key)
        : [...s.links, key],
    }));
    setSent(false);
  };
  return (
    <div className="nl-workbench">
      <div className="nl-two">
        <div>
          <GraphView graph={graph} path={sent ? path : []} />
          <CourseParagraph className="nl-source">
            A et B : équipements terminaux. N1 et N2 : nœuds relais. Coûts
            abstraits positifs, liaisons bidirectionnelles.
          </CourseParagraph>
        </div>
        <div>
          <h3>{final ? "Ton réseau, tes choix" : "Relie A à B"}</h3>
          <CourseParagraph>
            {final
              ? "Retire une liaison, prédis le nouveau chemin, puis envoie ton message."
              : "Ajoute des liaisons. Peux-tu transmettre sans tout relier à tout ?"}
          </CourseParagraph>
          <div className="nl-options">
            {LINKS.map(([a, b, c]) => (
              <button
                key={a + b}
                aria-pressed={state.links.includes(`${a}-${b}`)}
                onClick={() => toggle(`${a}-${b}`)}
              >
                {a} ↔ {b} · coût {c}
              </button>
            ))}
          </div>
          <button className="nl-primary" onClick={() => setSent(true)}>
            Envoyer A → B
          </button>
          <CourseParagraph role="status">
            {sent
              ? path.length
                ? `Reçu ! ${path.join(" → ")}. Coût total ${labels.B.cost}.`
                : "Impossible : aucun chemin ne relie A à B. Un nœud isolé ne transmet rien."
              : "Choisis les liaisons puis teste le trajet."}
          </CourseParagraph>
          <CourseParagraph>
            {state.links.length} liaison(s) · coût d'installation{" "}
            {graph.edges.reduce((s, e) => s + e[2], 0) / 2}
          </CourseParagraph>
          <button
            onClick={() => {
              setState((s) => ({ ...s, links: [] }));
              setSent(false);
            }}
          >
            Retirer les liaisons
          </button>
        </div>
      </div>
      <Explain title="Pourquoi plus de nœuds ne signifie pas toujours mieux">
        <CourseParagraph>
          Un relais permet de partager les liaisons et de joindre des
          destinations éloignées. Il ajoute aussi un coût, des délais et un
          point de panne. La route A–N1–N2–B coûte 5, contre 8 pour A–N1–B.
          Ajouter A–N2 donne une alternative si A–N1 tombe en panne, mais coûte
          davantage à installer. Efficacité et robustesse sont deux critères
          différents.
        </CourseParagraph>
      </Explain>
    </div>
  );
}
const LAYERS = [
  [
    "Application",
    "Ce que veut le programme : échanger un message, demander une page.",
  ],
  [
    "Présentation",
    "Représenter les données : encodage, compression, chiffrement.",
  ],
  ["Session", "Organiser le dialogue entre applications."],
  ["Transport", "Échange de bout en bout entre processus."],
  ["Réseau", "Trouver un chemin et acheminer vers la destination."],
  ["Liaison", "Échanger des trames entre voisins sur un lien."],
  ["Physique", "Transporter des signaux sur un support."],
];
function LayersWorkshop() {
  const [layer, setLayer] = useState(0);
  const [depth, setDepth] = useState(0);
  const [native, setNative] = useState(false);
  const headers = ["Transport", "Réseau", "Liaison"];
  return (
    <div className="nl-workbench">
      <h3>Un message, plusieurs responsabilités</h3>
      <CourseParagraph>
        Le message doit traverser des supports différents. Au lieu de tout
        résoudre d'un coup, chaque couche rend un service à celle du dessus.
      </CourseParagraph>
      <div className="nl-two">
        <div className="nl-stack">
          {LAYERS.map(([name], i) => (
            <button
              key={name}
              aria-pressed={layer === i}
              onClick={() => setLayer(i)}
            >
              <span>{7 - i}</span>
              {name}
            </button>
          ))}
        </div>
        <div aria-live="polite">
          <h3>{LAYERS[layer][0]}</h3>
          <CourseParagraph>{LAYERS[layer][1]}</CourseParagraph>
          <CourseParagraph className="nl-source">
            Modèle de référence OSI. TCP/IP regroupe les trois couches hautes
            dans « application », et liaison/physique dans « accès réseau ».
          </CourseParagraph>
          <button aria-pressed={native} onClick={() => setNative(!native)}>
            Voir {native ? "OSI" : "TCP/IP"}
          </button>
          <CourseParagraph>
            {native
              ? "Application → Transport → Internet → Accès réseau"
              : "Application → Présentation → Session → Transport → Réseau → Liaison → Physique"}
          </CourseParagraph>
        </div>
      </div>
      <h3>Prédis ce qui voyage réellement</h3>
      <CourseParagraph>
        L'information applicative descend dans les couches. Chacune peut ajouter
        ses informations de contrôle.
      </CourseParagraph>
      <div className="nl-envelope">
        {headers
          .slice(0, depth)
          .reverse()
          .map((h) => (
            <span key={h}>En-tête {h}</span>
          ))}
        <strong>Message A → B</strong>
        {depth === 3 && <span>Fin de trame</span>}
      </div>
      <div className="nl-inline">
        <button disabled={depth === 3} onClick={() => setDepth(depth + 1)}>
          Encapsuler une couche ↓
        </button>
        <button disabled={depth === 0} onClick={() => setDepth(depth - 1)}>
          Décapsuler une couche ↑
        </button>
      </div>
      <CourseParagraph role="status">
        {depth === 0
          ? "Données de l’application."
          : `Après ${headers[depth - 1]} : les données reçues (SDU) deviennent une PDU avec les informations de contrôle (PCI).`}
      </CourseParagraph>
      <Explain>
        <CourseParagraph>
          Une <strong>entité</strong> est l'élément actif d'une couche. Les
          entités homologues suivent un <strong>protocole</strong> (règles
          horizontales). Une couche offre un <strong>service</strong> à la
          couche supérieure via un point d'accès <strong>SAP</strong> (relation
          verticale). La communication entre pairs est logique : physiquement,
          les données descendent, traversent le support puis remontent. Comme
          les philosophes du cours : les interlocuteurs échangent des idées, les
          traducteurs adaptent la représentation, les secrétaires assurent
          l'envoi.
        </CourseParagraph>
        <CourseParagraph>
          <strong>PDU = SDU + PCI.</strong> La PCI peut inclure un en-tête et
          une fin. Segmentation/réassemblage : une SDU devient plusieurs PDU ;
          groupage/dégroupage : plusieurs SDU sont regroupées dans une PDU ;
          concaténation/séparation : plusieurs PDU partagent une unité de
          transmission inférieure. Ne confonds pas ces opérations avec un
          changement du sens du message.
        </CourseParagraph>
      </Explain>
      <Choice
        question="Une machine change son support radio pour une fibre. Doit-on réécrire chaque application ?"
        options={[
          "Oui, chaque application pilote le câble",
          "Non, si le service offert aux couches supérieures reste compatible",
        ]}
        answer={1}
        why="La séparation en couches isole les responsabilités. L’interface de service permet de remplacer une réalisation sans refaire toute l’application."
      />
    </div>
  );
}
export function Introduction() {
  return (
    <>
      <Lesson
        id="intro-but"
        kicker="Introduction · pages PDF 1–5"
        title="Pourquoi relier des machines ?"
      >
        <CourseParagraph className="nl-lead">
          A possède un fichier. B en a besoin. Leur premier outil commun sera
          une liaison, puis un réseau capable de transporter ce message.
        </CourseParagraph>
        <TermMap
          goal="Échanger des informations et partager des ressources"
          terms={["reseau-informatique", "topologie", "protocole", "service"]}
        />
        <CourseParagraph>
          Un réseau informatique relie des équipements autonomes pour échanger
          des données. On partage des fichiers, des imprimantes ou des capacités
          de calcul ; on répartit les services, les coûts et les risques de
          panne. La fiabilité suppose toutefois de la redondance : connecter
          deux machines à un unique relais ne rend pas ce relais infaillible.
        </CourseParagraph>
        <Source>Cours/Intro.pdf, p. 1–5</Source>
        <Explain title="Repères historiques et acteurs — pour situer les idées">
          <CourseParagraph>
            Le cours relie télégraphe, téléphone et radio à l'apparition des
            ordinateurs, des réseaux de paquets et du Web. Les opérateurs de
            télécommunications privilégiaient une communication vocale synchrone
            par circuits ; l'informatique a développé les échanges de données
            par paquets ; les câblo-opérateurs apportent une autre
            infrastructure de diffusion. Ces héritages se rencontrent dans les
            réseaux actuels.
          </CourseParagraph>
          <CourseParagraph>
            ARPANET relie ses premiers sites en 1969. Internet interconnecte
            ensuite des réseaux différents ; le Web est un service qui
            fonctionne sur Internet, pas un autre nom du réseau.
          </CourseParagraph>
          <CourseParagraph>
            <a
              href="https://www.internetsociety.org/internet/history-internet/brief-history-internet/"
              target="_blank"
              rel="noreferrer"
            >
              Approfondir : histoire de l’Internet, par ses acteurs ↗
            </a>
          </CourseParagraph>
          <CourseParagraph>
            Une norme <strong>de jure</strong> est formalisée par un organisme ;
            un standard <strong>de facto</strong> s'impose par son usage. ISO,
            UIT/ITU, IEEE et IETF ont des rôles distincts ; AFNOR, ETSI et ANSI
            interviennent aussi dans la normalisation. L'IETF signifie Internet
            Engineering Task Force : ses travaux ouverts portent notamment sur
            les standards Internet.
          </CourseParagraph>
          <CourseParagraph>
            <a
              href="https://www.ietf.org/about/introduction/"
              target="_blank"
              rel="noreferrer"
            >
              Comprendre le rôle de l’IETF ↗
            </a>
          </CourseParagraph>
        </Explain>
      </Lesson>
      <Lesson
        id="intro-construire"
        kicker="Introduction · pages PDF 6–7"
        title="Quelques liens suffisent-ils ?"
      >
        <NetworkBuilder />
        <Choice
          question="Tu veux garder un chemin si une liaison tombe en panne. Que dois-tu rechercher ?"
          options={[
            "Le plus de machines possible",
            "Un chemin alternatif réellement connecté",
            "Un nom de réseau plus long",
          ]}
          answer={1}
          why="La redondance des chemins, et non le nombre brut de nœuds, permet de contourner une panne."
        />
        <Numeric
          question="Pour relier directement chaque paire de 5 machines, combien de liaisons faut-il ?"
          answer={10}
          why="Chaque machine a 4 voisines, mais une liaison relie deux machines : 5 × 4 / 2."
        />
        <Explain title="Classer les réseaux sans confondre les critères">
          <CourseParagraph>
            <strong>Étendue :</strong> PAN autour d'une personne, LAN local
            (salle ou site), MAN métropolitain, WAN à grande distance. Ces
            catégories ne garantissent pas un débit précis.
          </CourseParagraph>
          <CourseParagraph>
            <strong>Transmission :</strong> un lien point à point relie deux
            extrémités ; un support à diffusion est partagé. Unicast vise un
            destinataire, multicast un groupe, broadcast tous les destinataires
            du domaine concerné.
          </CourseParagraph>
          <CourseParagraph>
            <strong>Topologie :</strong> bus (support commun), anneau (chaîne
            fermée), étoile (élément central), maillage (plusieurs chemins). La
            topologie physique décrit les câbles ; la topologie logique décrit
            la circulation des données. Elles peuvent différer.
          </CourseParagraph>
        </Explain>
        <Choice
          question="Des ordinateurs disposés en étoile autour d'un équipement central utilisent tous le même support logique partagé. Que peut-on conclure ?"
          options={[
            "Topologie physique et logique sont toujours identiques",
            "Il faut distinguer câblage et circulation des données",
          ]}
          answer={1}
          why="La forme du câblage seule ne décrit pas le protocole d’accès au support."
        />
        <Source>
          Cours/Intro.pdf, p. 6–7 ; atelier de construction ajouté
        </Source>
      </Lesson>
      <Lesson
        id="intro-couches"
        kicker="Introduction · pages PDF 8–18"
        title="Décomposer pour mieux communiquer"
      >
        <TermMap
          goal="Donner à chaque couche une responsabilité précise"
          terms={[
            "couche",
            "service",
            "protocole",
            "sap",
            "sdu",
            "pdu",
            "encapsulation",
            "modele-osi",
            "modele-tcp-ip",
          ]}
        />
        <LayersWorkshop />
        <Choice
          question="Un protocole règle les échanges…"
          options={[
            "entre entités homologues",
            "uniquement entre couches voisines d’une même machine",
          ]}
          answer={0}
          why="Le service relie verticalement des couches voisines ; le protocole règle logiquement le dialogue entre pairs."
        />
        <Source>Cours/Intro.pdf, p. 8–18</Source>
        <CourseParagraph className="nl-takeaway">
          Tu as construit la carte du réseau et séparé ses responsabilités.
          Prochaine étape : fabriquer le signal qui porte réellement ton
          message.
        </CourseParagraph>
      </Lesson>
    </>
  );
}
