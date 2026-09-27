"use client";
import { useState } from "react";
import { CourseLink } from "./CourseSources";
import { CourseParagraph as P } from "./Definitions";
import { Choice, Explain } from "./shared";

export function RoutingContents() {
  const items = [
    ["routage-besoin", "1–9 · Rôle et services du réseau"],
    ["routage-commutation", "10–25 · Transmission et commutation"],
    ["routage-fonctions", "26–39 · Adresses, acheminement et tables"],
    ["routage-vecteurs", "40–43 · Graphes et vecteurs de distances"],
    ["routage-dijkstra", "44–48 · État de liens et Dijkstra"],
    ["bellman-guide", "Entraînement · Guide Bellman-Ford"],
    ["routage-transfert", "Annales · Passer du jeu à la copie"],
  ];
  return <nav className="nl-explain" aria-label="Sommaire du cours de routage">
    <h2>Communication dans un réseau · cours expliqué</h2>
    <P>Le fil du CM suit les 48 diapositives de Lila Boukhatem : rôle du réseau, commutation, puis adressage et routage. Les pages 2, 10 et 26 annoncent ces parties. Les TD et annales prolongent les notions ; ils ne remplacent pas les diapositives. Le contrôle de congestion est annoncé dans le plan, mais ce support se termine à la comparaison des algorithmes page 48.</P>
    <ul>{items.map(([id, label]) => <li key={id}><a href={`#routage/${id}`}>{label}</a></li>)}</ul>
    <CourseLink page={1}>Support original, titre et plan</CourseLink>
  </nav>;
}

export function NetworkServicesCM() {
  return <>
    <h3>Du lien entre deux machines au service de réseau · p. 3–5</h3>
    <P>ETTD signifie équipement terminal de traitement de données : les machines A et B aux extrémités. Avec une seule liaison, il suffit de joindre deux extrémités. Avec plusieurs machines, des nœuds d’accès les raccordent au réseau, et des nœuds internes relaient les données. La topologie décrit ces nœuds et leurs liaisons. Sur A–N1–N2–B, chaque liaison de données rend un service local ; la couche réseau coordonne le trajet d’entrée à sortie.</P>
    <P>Le réseau transporte sans interpréter le sens du message. Il assure l’indépendance vis-à-vis des supports, le transfert de bout en bout entre ses points d’accès, la transparence des informations et un service d’adressage. La qualité de service (QoS) exprime les garanties proposées. « Assurer un transfert » ne veut pas encore dire « garantir une livraison fiable » : c’est la question qui sépare les deux services suivants.</P>
    <h3>Les primitives racontent un dialogue · p. 6–8</h3>
    <P>Dans le service connecté présenté ici, on établit un circuit virtuel, on transfère les données, puis on libère la connexion. Une primitive est une interaction entre l’utilisateur du service et le réseau, pas nécessairement le nom d’un paquet sur un câble. Pour N-CONNECT, request est la demande de A à son réseau ; indication informe B ; response est la réponse de B ; confirmation revient à A. N-DATA transporte les données, avec request et indication (éventuellement confirmation). N-DISCONNECT termine la relation.</P>
    <P>Dans le service non connecté, chaque datagramme est indépendant : N-UNITDATA request demande un envoi, indication signale sa remise. A n’attend pas d’établissement de connexion. Le service est best effort : il fait au mieux, sans garantir à lui seul livraison, ordre ni absence de doublons. Le cours oppose le transfert fiable de son modèle de circuit virtuel au datagramme Internet ; il faut distinguer cette offre de service de la technique physique de commutation.</P>
    <h3>Deux points de vue, deux extrémités du dialogue · p. 9</h3>
    <P>Entre usager et réseau, on décrit ce que le réseau promet et les opérations offertes. Entre deux nœuds du réseau, on décrit comment les protocoles coopèrent. Sous les paquets de la couche réseau, la liaison transporte des trames ; le circuit de données transporte des signaux sur un support physique. Une même communication se décrit donc à plusieurs niveaux : aucun schéma n’efface le niveau inférieur.</P>
    <p><CourseLink page={6}>Revoir les primitives du mode connecté</CourseLink>{" · "}<CourseLink page={9}>Lire les deux points de vue</CourseLink></p>
  </>;
}

export function SwitchingCM() {
  return <>
    <h3>Lire les unités et les chronogrammes · p. 11–14</h3>
    <P>Un bit est une valeur binaire ; un octet (Byte) contient huit bits. Ici Kbit, Mbit et Gbit correspondent à 10³, 10⁶ et 10⁹ bits. Le débit compte les bits injectés par seconde : 10 000 bits à 10 Mbit/s demandent 1 ms de transmission. La propagation commence dès le premier bit et dépend du support et de la distance : augmenter le débit ne fait pas voyager le signal plus vite.</P>
    <P>Le temps de transfert se mesure entre l’émission du premier bit et la réception du dernier. Sur une liaison sans attente, c’est transmission + propagation ; sur plusieurs liaisons, il faut suivre les émissions, réceptions et attentes. La page 13 donne des ordres de grandeur : les valeurs « 250 000 km/s » et « 5 µs/km » pour le coaxial ne sont pas exactement réciproques (la première donne 4 µs/km). Utilise la donnée imposée par l’exercice et indique ton hypothèse.</P>
    <h3>Quatre façons d’aiguiller les données · p. 15–25</h3>
    <P>Commuter, c’est diriger ce qui arrive sur un port d’entrée vers un port de sortie. En commutation de circuits, une ressource est réservée avant le transfert et pendant toute la connexion. Le délai devient prévisible et l’ordre est conservé ; les ressources réservées évitent la congestion pendant le transfert dans ce modèle, mais l’établissement peut être refusé. Une source silencieuse conserve sa réservation : c’est peu efficace pour un trafic sporadique.</P>
    <P>En commutation de messages, chaque nœud reçoit le message entier avant de le retransmettre : store-and-forward. Les ressources ne servent que lorsque nécessaire, mais les grands messages exigent du stockage, attendent longtemps et exposent à congestion et erreurs. En paquets, le message est découpé : le premier paquet avance pendant que les suivants arrivent. Les en-têtes permettent notamment l’acheminement ; les nœuds gardent des tampons et partagent leurs ressources. Le délai diminue grâce au recouvrement, sans devenir constant : attentes, pertes et déséquencement restent possibles.</P>
    <P>Les cellules de la page 23 sont des paquets courts de taille fixe (53 octets), en mode connecté. Petite taille : constitution et attente plus courtes, petits tampons et meilleur entrelacement des flux ; le trafic régulier attend moins derrière un gros message, ce qui réduit la gigue (variation du délai). En contrepartie, on traite plus d’en-têtes et leur poids relatif augmente. Taille fixe : délimitation implicite, mémoire et traitement matériel simplifiés ; le bourrage gaspille une partie de la bande passante.</P>
    <P>La synthèse page 25 sépare réseaux à commutation de circuits (multiplexage fréquentiel ou temporel) et réseaux à commutation de paquets (circuits virtuels ou datagrammes). « Connecté » n’est donc pas synonyme de « circuit physique réservé » : un circuit virtuel reste un mécanisme de commutation de paquets.</P>
    <Choice question="Sur deux liaisons, pourquoi découper un grand message peut-il avancer l’arrivée du dernier bit ?" options={["Le signal se propage plus vite", "Le premier paquet utilise la deuxième liaison pendant que le suivant utilise la première", "Les en-têtes disparaissent"]} answer={1} why="C’est le recouvrement des transmissions illustré page 21. Le débit et la vitesse de propagation de chaque liaison restent les mêmes." />
    <p><CourseLink page={21}>Comparer les chronogrammes message/paquets</CourseLink>{" · "}<CourseLink page={24}>Lire les compromis des cellules</CourseLink></p>
  </>;
}

export function AddressingCM() {
  return <>
    <h3>Identifier avant de choisir un chemin · p. 27–30</h3>
    <P>À plus de deux équipements, il faut identifier le destinataire sans ambiguïté. Une adresse plate (exemple du cours : Ethernet) identifie sans décrire une hiérarchie de réseaux ; une adresse hiérarchique (adresse postale, téléphone, IP) facilite le regroupement des destinations. Unicast vise un destinataire, broadcast tous les équipements du domaine concerné, multicast un groupe. Ces trois usages ne disent pas quel chemin sera suivi.</P>
    <P>La « meilleure » route dépend d’une métrique : distance, nombre de nœuds, temps de réponse, débit, fiabilité ou coût financier. Deux métriques peuvent préférer des routes différentes. Le routage construit et adapte les tables ; l’acheminement les consulte localement. Page 30, un paquet vient de k et vise l : la table associe l à L2, donc le nœud choisit L2. Ce n’est ni l’origine k ni une vue du chemin complet qui détermine cette sortie.</P>
    <Choice question="La table indique a → L1, l → L2 et N → L3. Un paquet vient de k et vise l : quelle sortie choisir ?" options={["L1", "L2", "L3"]} answer={1} why="On recherche la destination l ; la table associe l à L2. La consultation est une décision locale d’acheminement (p. 30)." />
    <p><CourseLink page={27}>Adresses et types de destinataires</CourseLink>{" · "}<CourseLink page={30}>Table du nœud de commutation</CourseLink></p>
  </>;
}

const translations = [
  { node: "N1", input: "a", before: 26, output: "e", after: 11 },
  { node: "N2", input: "b", before: 11, output: "g", after: 8 },
  { node: "N3", input: "h", before: 8, output: "d", after: 3 },
];
export function VirtualCircuitCM() {
  const [step, setStep] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const row = translations[step];
  return <section id="routage-voies-logiques">
    <h3>Une étiquette locale à chaque tronçon · p. 31–36</h3>
    <P>L’étiquette est l’information de contrôle utilisée pour acheminer. En voie logique, c’est un numéro dont la signification est locale au tronçon : on consulte une correspondance (port entrant, numéro entrant) → (port sortant, numéro sortant). Le numéro peut changer au passage d’un nœud. Le chemin est établi auparavant ; ses tables temporaires sont créées à l’établissement, supprimées à la libération, et tous les paquets de cette connexion suivent le circuit virtuel.</P>
    <P>Dans le datagramme, l’étiquette est l’adresse du destinataire et chaque paquet fait l’objet d’une décision. Pas d’accord préalable exigé, mais une adresse plus longue à transporter, avec pertes et déséquencement possibles. Attention page 36 : le circuit virtuel ne supprime pas toute consultation ! Le choix de route a lieu à l’établissement ; chaque paquet de données consulte ensuite la table de translation.</P>
    <div className="nl-workbench">
      <h4>À toi · Traduire l’étiquette 26 → 11 → 8 → 3</h4>
      <P>Reprends les trois correspondances de la page 34. On nomme ici les trois nœuds N1, N2 et N3 pour les distinguer ; ces noms sont ajoutés pour la lecture. Prédis l’étiquette qui quitte le nœud courant, puis observe le tronçon suivant.</P>
      <div className="nl-inline">{translations.map((t, i) => <button key={t.node} aria-pressed={step === i} onClick={() => { setStep(i); setGuess(""); setFeedback(""); }}>{t.node}</button>)}</div>
      <table><caption>Table de translation du nœud {row.node}</caption><thead><tr><th>Port entrant</th><th>Étiquette entrante</th><th>Port sortant</th><th>Étiquette sortante</th></tr></thead><tbody><tr><td>{row.input}</td><td>{row.before}</td><td>{row.output}</td><td>{row.after}</td></tr></tbody></table>
      <label>Le paquet arrive par {row.input} avec {row.before}. Quelle étiquette repart ? <input inputMode="numeric" value={guess} onChange={e => setGuess(e.target.value)} /></label>
      <div className="nl-inline"><button onClick={() => setFeedback(guess.trim() === String(row.after) ? `Oui : sortie ${row.output}, étiquette ${row.after}. Le destinataire de la communication n’a pas changé ; seul l’identifiant local est traduit.` : `Lis la même ligne jusqu’aux colonnes de sortie : port ${row.output}, étiquette ${row.after}. ${row.before} identifie le tronçon d’entrée, pas tous les tronçons.`)}>Vérifier ma lecture</button><button onClick={() => { setStep((step + 1) % translations.length); setGuess(""); setFeedback(""); }}>Tronçon suivant</button></div>
      <P role="status">{feedback}</P>
      <Explain title="Solution complète et transfert sans aide"><P>N1 : (a,26) → (e,11). N2 : (b,11) → (g,8). N3 : (h,8) → (d,3). Sur ta copie, explique pourquoi remplacer partout 26 par 11 serait faux : une étiquette ne suffit pas sans le port et le nœud où on la lit. Deux communications peuvent réutiliser un numéro sur des tronçons distincts.</P></Explain>
    </div>
    <CourseLink page={34}>Voir les trois tables et le circuit virtuel original</CourseLink>
  </section>;
}

export function RoutingClassificationCM() {
  return <>
    <h3>Construire et maintenir les tables · p. 37–40</h3>
    <P>La table contient au moins une destination (ou un réseau destination) et le prochain saut vers elle. Pour prendre cette décision locale, les protocoles doivent faire circuler de l’information sur une topologie globale volumineuse et changeante. Les objectifs page 38 sont parfois en tension : peu de messages de contrôle, petites tables, robustesse sans trous ni boucles ni oscillations, meilleur chemin, convergence rapide et adaptation aux changements.</P>
    <table><caption>Les cinq axes de classification de la page 39</caption><thead><tr><th>Axe</th><th>Premier choix</th><th>Second choix</th></tr></thead><tbody>
      <tr><th>Lieu du calcul</th><td>Centralisé : un nœud collecte l’état des liens et calcule les tables.</td><td>Distribué : les routeurs coopèrent pour construire des tables cohérentes.</td></tr>
      <tr><th>Décision du trajet</th><td>À la source : le paquet peut transporter sa route entière.</td><td>Saut par saut : le paquet porte la destination ; chaque nœud décide.</td></tr>
      <tr><th>Choix du prochain saut</th><td>Déterministe : même nœud suivant pour une destination dans un état donné.</td><td>Stochastique : plusieurs nœuds aval possibles ; le choix peut varier.</td></tr>
      <tr><th>Nombre de chemins</th><td>Unique : une route retenue.</td><td>Multiple : route principale et alternatives, notamment en cas de panne.</td></tr>
      <tr><th>Adaptation</th><td>Statique : ne dépend pas des mesures actuelles de l’état du réseau.</td><td>Dynamique : dépend de cet état mesuré.</td></tr>
    </tbody></table>
    <P>Ce sont des axes distincts : « distribué » ne signifie pas « plusieurs chemins ». Le modèle de graphe page 40 représente chaque liaison par un coût ; le coût d’un chemin est la somme des liens parcourus. Chaque routeur connaît d’abord ses voisins et le coût pour les atteindre. Les deux familles qui suivent exploitent cette connaissance différemment : vecteurs de distances, puis états de liens.</P>
    <p><CourseLink page={39}>Relire les classifications</CourseLink>{" · "}<CourseLink page={40}>Le problème de graphe et ses deux familles</CourseLink></p>
  </>;
}

export function DistanceCM() {
  return <>
    <h3>Des annonces locales à une route stable · p. 41–43</h3>
    <P>Un vecteur annonce, pour chaque destination, une distance ; la table locale garde aussi l’interface ou le prochain saut. Quand ton voisin annonce une distance, il faut ajouter le coût pour le rejoindre, puis comparer les candidats. Les échanges périodiques, et les annonces provoquées par les modifications dans le modèle du cours, propagent les informations jusqu’à la convergence : les tables ne changent plus.</P>
    <P>Pourquoi ne pas annoncer sans arrêt ? Une période courte détecte plus vite les changements, mais charge le réseau. Une période longue économise des messages, mais laisse plus longtemps des informations anciennes. Un routeur qui cesse d’annoncer est finalement considéré injoignable : sa métrique devient infinie, pas nulle. Les ateliers de panne précisent à quel instant chaque routeur apprend cette information.</P>
    <P>Une convergence lente peut créer des tables incohérentes : A envoie vers B alors que B renvoie vers A. Le plafond 16 présenté page 43 rend une route injoignable avant qu’un comptage n’augmente indéfiniment ; il ne transforme pas une boucle en route valide. L’horizon partagé évite de renvoyer vers un voisin une route apprise par ce voisin. L’antidote est une variante distincte qui annonce explicitement l’infini sur ce lien ; elle sera signalée dans les exercices qui l’utilisent.</P>
    <CourseLink page={41}>Vecteurs, periodicité et boucles · pages 41–43</CourseLink>
  </>;
}

export function LinkStateCM() {
  return <>
    <h3>Construire la carte avant de calculer · p. 44–47</h3>
    <P>Le routeur commence par découvrir ses voisins : HELLO demande qui est directement accessible. Il construit un LSP, paquet décrivant son identité, ses voisins et les coûts des liens. Périodiquement ou après un événement, ces informations sont diffusées. À partir de tous les LSP reçus, chaque routeur reconstruit une carte complète, puis calcule ses routes localement avec Dijkstra. HELLO, diffusion et calcul sont trois tâches différentes.</P>
    <P>Page 46, le nœud A annonce B à 5 et E à 3. B annonce A à 5, C à 2 et F à 5. Ce ne sont pas encore les distances minimales vers toutes les destinations : chaque LSP décrit seulement le voisinage de son émetteur. C’est leur réunion qui donne la carte complète.</P>
    <aside className="nl-explain"><h4>Écart dans le support · page 46</h4><P>Le dessin indique C–E de coût 1, et la table de E indique C à 1 ; la table de C indique pourtant E à 5. Ces valeurs se contredisent pour le lien non orienté dessiné. Pour expliquer ce schéma, nous retenons C–E = 1, cohérent avec le dessin et la table de E. Le PDF original est conservé tel quel. Le TD4 possède son propre graphe orienté : il ne faut pas lui appliquer cette correction.</P><CourseLink page={46}>Comparer le dessin et les LSP originaux</CourseLink></aside>
    <Choice question="Un LSP arrive de B sur un nœud relié à A, B et C. Selon la règle d’inondation page 47, sur quels liens le réémettre ?" options={["Vers B seulement", "Vers A et C", "Vers tous les nœuds directement, même sans lien"]} answer={1} why="On utilise toutes les lignes sauf la ligne d’entrée : A et C. Les autres nœuds répètent ensuite la diffusion. En pratique, identifier les annonces déjà reçues évite de faire circuler les doublons sans fin ; ce détail complète la règle simplifiée de la diapositive." />
    <P>Prédis maintenant ce que sait un routeur après un seul LSP : uniquement les liens annoncés, pas encore toute la carte. Relie ensuite le graphe complet aux étiquettes de Dijkstra dans l’activité : l’algorithme exploite la carte, il ne la découvre pas lui-même.</P>
    <CourseLink page={47}>Inondation, carte et calcul local</CourseLink>
  </>;
}

export function RoutingComparisonCM() {
  return <section id="routage-comparaison"><h3>Comparer les deux familles · p. 48</h3>
    <table><caption>Comparaison qualitative du support de cours</caption><thead><tr><th>Critère</th><th>Vecteurs de distances</th><th>États de liens</th></tr></thead><tbody><tr><th>Complexité CPU</th><td>Simple</td><td>Grande</td></tr><tr><th>Mémoire</th><td>Peu</td><td>Beaucoup</td></tr><tr><th>Signalisation</th><td>Petite</td><td>Grande</td></tr><tr><th>Convergence</th><td>Lente</td><td>Rapide</td></tr></tbody></table>
    <P>Cette comparaison décrit les familles dans le modèle du cours, pas une mesure universelle indépendante de la taille du réseau. Sur ta copie, justifie : les vecteurs échangent des résumés locaux et peuvent propager lentement une mauvaise nouvelle ; l’état de liens conserve une carte et diffuse les changements avant de recalculer. « Plus rapide à converger » n’implique pas « moins de calcul ».</P>
    <CourseLink page={48}>Tableau original de synthèse</CourseLink>
  </section>;
}
