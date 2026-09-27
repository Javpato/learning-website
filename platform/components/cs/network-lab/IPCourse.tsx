"use client";

import type { ReactNode } from "react";
import { IP_SECTIONS, type IPSectionId } from "@/lib/cs/ipCourseContent";
import { IP_EXERCISES } from "@/lib/cs/ipTutorialContent";
import { CourseLink } from "./CourseSources";
import { CourseParagraph } from "./Definitions";
import { IPActivity } from "./IPActivities";
import { Choice, Explain, Lesson, Numeric } from "./shared";

function Section({ id, children }: { id: IPSectionId; children: ReactNode }) {
  const section = IP_SECTIONS.find((item) => item.id === id)!;
  const exercises = IP_EXERCISES.filter((exercise) => exercise.courseSection === id);
  return (
    <Lesson id={id} kicker={`Protocole IP · diapositives ${section.slides[0]}–${section.slides[1]}`} title={section.title}>
      <p className="nl-source">
        Support IP.pdf · {Array.from({ length: Math.ceil(section.slides[1] / 2) - Math.ceil(section.slides[0] / 2) + 1 }, (_, i) => {
          const page = Math.ceil(section.slides[0] / 2) + i;
          return <span key={page}><CourseLink doc="IP" page={page}>Page PDF {page}</CourseLink>{" "}</span>;
        })}
      </p>
      {children}
      {exercises.length > 0 && <aside className="nl-course-help" aria-label="Exercices liés à cette explication">
        <h3>Appliquer cette partie du cours</h3>
        <ul>{exercises.map((exercise) => <li key={exercise.id}><a href={`#td-ip/${exercise.id}`}>Exercice {Number(exercise.id.slice(-2))} — {exercise.title}</a></li>)}</ul>
      </aside>}
    </Lesson>
  );
}

function Transfer({ question, children }: { question: string; children: ReactNode }) {
  return <Explain title={`À toi — ${question}`}>{children}</Explain>;
}

export function IPCourse() {
  return <>
    <Section id="ip-plan">
      <CourseParagraph>Tu sais déjà qu’un routeur choisit une sortie. Maintenant, suivons ce qu’il reçoit vraiment : un paquet avec des adresses, une longueur, un compteur de vie et parfois des fragments à transporter. Le but est de pouvoir raconter son trajet, puis remplir sans deviner les tableaux du TD et des partiels.</CourseParagraph>
      <p><strong>Notre mission, avec les nombres du cours.</strong> Un message de 1400 octets doit traverser une liaison qui accepte seulement 620 octets par paquet. Comment le découper, retrouver ses morceaux et choisir le prochain équipement auquel les confier ? Nous allons construire la réponse dans l’ordre exact du support.</p>
      <p>Les diapositives 1–2 présentent le cours de Lila Boukhatem et son plan. Chaque section ci-dessous donne les pages originales et ajoute l’explication orale qui relie les idées. Les répétitions du plan, aux diapositives 9, 18 et 32, marquent les transitions ; elles ne sont pas des notions supplémentaires.</p>
      <ol>{IP_SECTIONS.slice(1).map((section) => <li key={section.id}><a href={`#ip/${section.id}`}>{section.title}</a> <small>· diapos {section.slides[0]}–{section.slides[1]}</small></li>)}</ol>
      <p className="nl-source">Reconstruction pédagogique non officielle à partir du support fourni. Les documents originaux restent lisibles ; les éventuelles coquilles sont signalées séparément. Aucun exercice, indice ou corrigé n’exige de score préalable.</p>
    </Section>

    <Section id="ip-internet">
      <h3>Diapositives 3–4 · Le problème avant le protocole</h3>
      <CourseParagraph>Deux ordinateurs sur un même Ethernet peuvent échanger des trames. Mais Internet assemble des réseaux dont les techniques, les tailles et les administrations diffèrent. Il nous faut une convention commune au-dessus de ces différences : IP. Un routeur possède une interface sur plusieurs réseaux et fait passer les paquets de l’un à l’autre. Le dessin de la diapositive 4 représente donc un réseau de réseaux, pas un immense réseau local.</CourseParagraph>
      <p>Le cours situe cette architecture dans les projets DARPA des années 1970 et son évolution vers 1977–1979. Les croissances de 15 % en 1987 et de 60 % en 1997 sont des repères historiques du support. Leur intérêt ici est de comprendre pourquoi une architecture extensible et des tables de routage maîtrisables deviennent essentielles.</p>
      <h3>Diapositive 5 · Qui écrit les conventions communes ?</h3>
      <p>Pour qu’un ordinateur et un routeur construits par deux fabricants se comprennent, leur format de paquet doit être décrit publiquement. Le support présente l’ISOC pour le développement d’Internet, l’IAB pour l’architecture et l’orientation technique, puis deux branches : l’IESG et l’IETF pour les travaux d’ingénierie et de standardisation ; l’IRSG et l’IRTF pour la recherche à plus long terme. Les WG sont des groupes de travail ; les RG, des groupes de recherche. Lis ce schéma comme le cadre institutionnel présenté dans le cours.</p>
      <p>Une RFC est un document numéroté qui décrit une proposition, une pratique ou un protocole. <strong>RFC ne signifie pas automatiquement standard.</strong> Il faut lire son statut. La RFC 5000 citée par le support est un état historique des standards ; elle n’est pas un catalogue tenu à jour dans cette page. Pour nos calculs, les RFC servent surtout à lever une ambiguïté de format ou à vérifier une coquille.</p>
      <Transfer question="Pourquoi relier deux réseaux exige-t-il plus qu’une adresse MAC ?"><p>La MAC permet la livraison sur une liaison locale. Il faut aussi une adresse exploitable entre réseaux et des équipements capables de choisir le réseau suivant : les adresses IP et les routeurs apportent ces deux éléments.</p></Transfer>
    </Section>

    <Section id="ip-couches">
      <h3>Diapositive 6 · Quatre niveaux, quatre responsabilités</h3>
      <p>L’application définit l’échange utile à l’utilisateur : FTP pour des fichiers, HTTP pour le Web, ou les exemples Telnet, SNMP et courrier du support. Le transport, TCP ou UDP, relie les processus. La couche réseau, IP avec les mécanismes de contrôle associés, achemine entre machines. La couche interface réalise l’envoi sur la liaison ; elle regroupe ici les rôles physique et liaison du modèle OSI. Les sept étages OSI du dessin ne deviennent donc pas sept protocoles successivement ajoutés dans TCP/IP.</p>
      <h3>Diapositive 7 · Ce que fait le routeur intermédiaire</h3>
      <CourseParagraph>Le client FTP remet ses données à TCP, qui les remet à IP. Sur le premier réseau, le paquet IP voyage dans une trame Ethernet. Le routeur retire cette enveloppe locale, lit IP pour choisir la sortie, puis fabrique une enveloppe adaptée au second réseau — Token Ring dans le dessin. Il n’a pas à exécuter le serveur FTP pour transférer le paquet. Les échanges FTP et TCP dessinés horizontalement sont des relations entre extrémités ; les bits, eux, passent réellement par chaque liaison.</CourseParagraph>
      <h3>Diapositive 8 · Compter les enveloppes sans les mélanger</h3>
      <p>Avec les en-têtes minimaux du schéma, TCP ajoute 20 octets, IP ajoute 20 octets, Ethernet ajoute 14 octets devant et 4 octets de contrôle à la fin. Pour une donnée applicative de L octets, le segment TCP mesure L + 20, le paquet IP L + 40, et la trame dessinée L + 58. Ce calcul suit le schéma : il ne compte pas le préambule Ethernet ni l’intervalle entre trames.</p>
      <p><strong>Exemple expliqué.</strong> Avec 100 octets applicatifs, TCP transmet 120 octets à IP ; IP transmet 140 octets à Ethernet ; la trame compte 158 octets. Pourquoi ajouter les 4 octets à la fin ? Parce qu’ils appartiennent à la trame, même s’ils ne sont pas dans son en-tête. Pourquoi ne pas les inclure dans la longueur IP ? Parce qu’IP ne mesure que son propre paquet.</p>
      <Numeric question="Dans le schéma de la diapositive 8, quelle longueur IP pour 400 octets applicatifs, sans options ?" answer={440} unit="octets" why="IP transporte le segment TCP : 400 + 20 TCP + 20 IP = 440. Ethernet se compte à l’extérieur." />
    </Section>

    <Section id="ip-header">
      <h3>Diapositives 9–10 · Ce qu’IP promet réellement</h3>
      <p>Après le rappel du plan, trois expressions décrivent le service. <strong>Sans connexion</strong> : pas de réservation préalable d’un chemin IP ; chaque datagramme porte ce qui permet son acheminement. <strong>Non fiable</strong> : IP ne garantit ni la livraison, ni l’absence de duplication, ni l’ordre ou le délai d’arrivée. <strong>Best effort</strong> : les équipements tentent d’acheminer avec leurs ressources et leurs routes disponibles. Une panne ou une file saturée peut faire perdre un paquet. « Non fiable » n’interdit donc pas qu’un réseau fonctionne très bien ; cela décrit l’absence de garantie offerte par IP.</p>
      <p>Une application qui a besoin de tout recevoir dans l’ordre doit s’appuyer sur un mécanisme adapté aux extrémités, par exemple TCP. IP n’acquitte pas systématiquement chaque paquet et n’organise pas lui-même sa retransmission.</p>
      <h3>Diapositives 11–12 · Lire le dessin de gauche à droite</h3>
      <p>Chaque ligne du dessin fait 32 bits, soit 4 octets. Les cinq premières lignes forment les 20 octets d’en-tête IPv4 minimum. Les adresses source et destination occupent chacune une ligne. Des options et leur bourrage peuvent allonger l’en-tête ; les données commencent seulement après cet ensemble.</p>
      <table><caption>Les champs introduits aux diapositives 11–12</caption><thead><tr><th>Champ</th><th>Taille</th><th>Ce qu’il faut en faire</th></tr></thead><tbody>
        <tr><td>Version</td><td>4 bits</td><td>Reconnaître le format : 4 ici. Le format IPv6 est différent.</td></tr>
        <tr><td>IHL</td><td>4 bits</td><td>Multiplier par 4 pour obtenir les octets d’en-tête : de 5 × 4 = 20 à 15 × 4 = 60.</td></tr>
        <tr><td>TOS</td><td>8 bits</td><td>Dans la présentation historique du cours : priorité sur 3 bits, puis indicateurs Delay, Throughput, Reliability, Cost et bit restant réservé.</td></tr>
        <tr><td>Total length</td><td>16 bits</td><td>Longueur de tout le paquet IP, en-tête compris ; maximum 65 535 octets.</td></tr>
      </tbody></table>
      <p><strong>Méthode.</strong> Lis IHL avant de soustraire un en-tête : données IP = longueur totale − 4 × IHL. Si IHL = 6 et longueur totale = 140, l’en-tête fait 24 octets et les données 116. Soustraire 20 automatiquement ferait apparaître quatre octets de données qui sont en réalité des options ou du bourrage.</p>
      <p>Les indicateurs TOS expriment le type d’acheminement souhaité ; ils ne transforment pas IP en service à livraison garantie. Le cours emploie ici le format historique TOS. Cette notation doit être reconnue dans le support sans la confondre avec les interprétations ultérieures de ce même octet.</p>
      <p><strong>Prédis → agis → observe → relie.</strong> Prévois l’effet d’une hausse de IHL à longueur totale constante, change la valeur dans l’atelier, observe les octets encore disponibles et relie le résultat à la soustraction précédente.</p>
      <IPActivity kind="header" />
      <Transfer question="Un paquet de 1500 octets avec IHL = 5 transporte-t-il 1500 octets applicatifs ?"><p>Non : il transporte 1480 octets de données IP. Ces données contiennent encore l’en-tête de transport éventuel. Avec TCP sans options, il reste 1460 octets applicatifs.</p></Transfer>
    </Section>

    <Section id="ip-fragment">
      <h3>Diapositive 13 · Une contrainte locale, une reconstruction finale</h3>
      <CourseParagraph>Une liaison n’accepte pas une quantité arbitraire de données par trame. Sa MTU borne la taille du paquet IP qu’elle peut emporter : 1500 octets pour l’Ethernet du cours. Quand un routeur doit utiliser une liaison plus étroite, il peut découper un datagramme IPv4 si la fragmentation est autorisée. Chaque morceau reçoit un en-tête IP ; ce n’est pas une simple coupure d’une trame Ethernet.</CourseParagraph>
      <p>Le réassemblage se fait seulement à la destination finale. Pourquoi ne pas recoller dès le routeur suivant ? Les fragments peuvent arriver à des moments différents ou suivre des chemins différents ; attendre tous les morceaux chargerait les routeurs d’un travail supplémentaire. Le destinataire, lui, attend les morceaux avec un temporisateur. Si un fragment manque à l’expiration, le datagramme complet ne peut pas être livré. Plus il y a de fragments nécessaires, plus il y a d’occasions d’en perdre un.</p>
      <h3>Diapositive 14 · Trois informations pour retrouver les morceaux</h3>
      <ul>
        <li><strong>Identification, 16 bits.</strong> Les fragments issus du même datagramme portent la même valeur. La destination utilise aussi les adresses et le protocole pour distinguer les réassemblages.</li>
        <li><strong>Drapeaux, 3 bits.</strong> Un bit réservé, DF (« ne pas fragmenter »), MF (« d’autres fragments suivent »). MF = 0 ne signifie pas « petit fragment » : il marque la fin des données du datagramme d’origine.</li>
        <li><strong>Fragment offset, 13 bits.</strong> La position se compte en unités de 8 octets de données depuis le début du datagramme d’origine. Ce sont les <em>données</em> des fragments non finaux, pas leur longueur totale avec en-tête, qui doivent être un multiple de 8.</li>
      </ul>
      <h3>Diapositive 15 · Le calcul du cours, sans saut de ligne implicite</h3>
      <p>Le datagramme contient 1400 octets de données et 20 d’en-tête, donc sa longueur totale est 1420. Le réseau 1 accepte 1500 ; rien à découper. Le réseau 2 accepte seulement 620. Pour chaque morceau, réservons d’abord 20 octets d’en-tête : il reste 600, déjà multiple de 8. Nous découpons donc 1400 en 600 + 600 + 200. Le réseau 3 accepte à nouveau 1500, mais R2 <strong>ne réassemble pas</strong>.</p>
      <table><caption>Identification 12345 ; en-tête de 20 octets pour chaque fragment</caption><thead><tr><th>Fragment</th><th>Données</th><th>Longueur totale</th><th>DF</th><th>MF</th><th>Décalage</th></tr></thead><tbody>
        <tr><td>1</td><td>600</td><td>620</td><td>0</td><td>1</td><td>0</td></tr>
        <tr><td>2</td><td>600</td><td>620</td><td>0</td><td>1</td><td>75</td></tr>
        <tr><td>3</td><td>200</td><td>220</td><td>0</td><td>0</td><td>150</td></tr>
      </tbody></table>
      <p><strong>Pourquoi 75 ?</strong> Le deuxième commence après 600 octets de données : 600 ÷ 8 = 75. Le troisième commence après 1200 : 1200 ÷ 8 = 150. Les en-têtes ajoutés aux fragments ne font pas avancer ce compteur. Vérifie enfin 600 + 600 + 200 = 1400 et un seul MF nul.</p>
      <p><strong>Méthode transférable au TD.</strong> Charge non finale = 8 × partie entière de ((MTU − longueur d’en-tête) ÷ 8). Pour une cascade, conserve l’origine des décalages : un sous-fragment commence au décalage de son parent plus son déplacement interne divisé par 8. Le dernier morceau d’un parent qui avait MF = 1 garde MF = 1.</p>
      <p><strong>Prédis → agis → observe → relie.</strong> Prévois les trois longueurs du support, retrouve-les dans l’atelier, puis diminue la MTU. Observe les changements par paliers de 8 et explique-les par l’unité du décalage.</p>
      <IPActivity kind="fragment" />
      <Numeric question="Le TD donne un paquet de 129 octets, en-tête 20, MTU 128. Quelle longueur totale pour son premier fragment ?" answer={124} unit="octets" why="109 octets de données ; capacité brute 108, arrondie à 104. Premier fragment 104 + 20 = 124 ; le second contient 5 + 20 = 25 octets, décalage 13." />
    </Section>

    <Section id="ip-ttl-options">
      <h3>Diapositive 16 · Un paquet ne doit pas tourner indéfiniment</h3>
      <p>Une mauvaise table peut créer une boucle. Le TTL est un compteur sur 8 bits qui décroît à chaque routeur ; quand le prochain transfert l’épuiserait, le routeur détruit le paquet et peut avertir la source par ICMP. Dans les exercices, compte les passages de routeurs, pas les ordinateurs ni les commutateurs Ethernet. Avec TTL = 1, le premier routeur ne transmet pas le paquet au deuxième.</p>
      <p>Le champ protocole, sur 8 bits, indique à qui remettre les données après IP : 6 pour TCP, 17 pour UDP, 1 pour ICMP. Ce nombre n’est ni un numéro de port ni une adresse. Le checksum, sur 16 bits, contrôle l’en-tête IPv4, pas sa charge utile. Puisque TTL change, le contrôle d’en-tête doit être mis à jour.</p>
      <p><strong>Réponse de partiel bien délimitée.</strong> En acheminement ordinaire, sans fragmentation, options particulières ni NAT, le routeur modifie TTL et checksum ; les adresses IP de bout en bout restent les mêmes. En cas de fragmentation, longueur, MF et décalage changent aussi. Avec NAT, certaines adresses sont traduites. Dire « seulement deux champs, toujours » oublierait ces cas.</p>
      <h3>Diapositive 17 · Les options occupent de vrais octets</h3>
      <p>Une option commence par un octet d’identification : un bit C, deux bits de classe et cinq bits de numéro. C = 1 demande de copier l’option dans tous les fragments ; C = 0 la conserve seulement dans le premier. La longueur des options et le bourrage expliquent pourquoi IHL peut dépasser 5.</p>
      <p>Le support donne deux exemples de classe 0. <strong>Enregistrement de route, numéro 7</strong> : les routeurs inscrivent leur adresse dans l’espace prévu, ce qui aide à diagnostiquer le trajet. <strong>Routage strict, numéro 9</strong> : l’émetteur prescrit les étapes à suivre ; un chemin imposé est différent d’une simple liste de routeurs observés. Le cours précise que toutes les options ne sont pas acceptées par tous les routeurs. Ce sont des mécanismes à comprendre, pas une promesse qu’on peut les imposer partout.</p>
      <Choice question="Après un transfert ordinaire sans fragmentation, pourquoi le checksum IPv4 change-t-il ?" options={["Le routeur a diminué TTL dans l’en-tête", "Il faut vérifier les données applicatives", "L’adresse du destinataire devient celle du routeur"]} answer={0} why="Le checksum porte sur l’en-tête. Une modification du TTL impose sa mise à jour ; le destinataire final reste indiqué dans IP." />
    </Section>

    <Section id="ip-adresses">
      <h3>Diapositives 18–20 · Une adresse pour une interface</h3>
      <p>Après le rappel du plan, le cours introduit un identifiant hiérarchique de 32 bits : Net-Id pour la partie réseau, Host-Id pour la partie machine dans ce réseau. Deux interfaces du même sous-réseau partagent le préfixe, mais pas la partie hôte. Un routeur connecté à plusieurs réseaux a donc plusieurs adresses. L’unicité demandée s’entend dans le domaine concerné : les adresses privées seront réutilisées dans des sites indépendants.</p>
      <p>Le décimal pointé coupe les 32 bits en quatre octets, de 0 à 255. L’exemple du support, <code>10000000 00001010 00000010 00011110</code>, devient <code>128.10.2.30</code>. La notation est plus lisible mais elle ne donne pas, à elle seule, la frontière réseau/hôte. Dans l’exemple <code>192.23.19.1</code> du cours, avec la frontière de classe C alors utilisée, mettre Host-Id à zéro donne le réseau <code>192.23.19.0</code>.</p>
      <p>Le support mentionne l’ICANN, la délégation aux organismes régionaux RIR et la gestion des identifiants globaux. À l’intérieur du bloc obtenu, l’administrateur construit son plan d’adressage : quelle plage pour chaque réseau, quelle adresse pour chaque interface ? L’allocation globale et l’attribution locale sont deux échelles différentes.</p>
      <h3>Diapositive 21 · Les classes historiques</h3>
      <table><caption>Reconnaître les classes demandées dans les exercices</caption><thead><tr><th>Classe</th><th>Début binaire</th><th>Premier octet</th><th>Usage / masque historique</th></tr></thead><tbody>
        <tr><td>A</td><td>0</td><td>1–126 pour les réseaux ordinaires</td><td>/8 · 255.0.0.0</td></tr>
        <tr><td>B</td><td>10</td><td>128–191</td><td>/16 · 255.255.0.0</td></tr>
        <tr><td>C</td><td>110</td><td>192–223</td><td>/24 · 255.255.255.0</td></tr>
        <tr><td>D</td><td>1110</td><td>224–239</td><td>Groupes multicast, pas un découpage réseau/hôte ordinaire</td></tr>
        <tr><td>E</td><td>1111</td><td>240–255</td><td>Espace historiquement réservé, pas une plage à distribuer aux machines du TD</td></tr>
      </tbody></table>
      <p>Le mot <strong>obsolètes</strong> est dans le titre de la diapositive : on apprend les classes pour lire les énoncés et comprendre leur limite, mais une adresse assortie d’un /n se traite avec ce préfixe fourni. Une adresse de classe B peut ainsi appartenir à un site /17 et être redécoupée en /23.</p>
      <Explain title="Coquille du support — la borne de classe E"><p>La diapositive 21 dessine 11110 et s’arrête à 247. La définition historique de classe E utilise les quatre bits 1111, soit 240.0.0.0–255.255.255.255, avec des adresses particulières à l’intérieur. Le tableau explicatif suit cette définition ; le support original reste inchangé. Référence : <a href="https://www.rfc-editor.org/rfc/rfc1112.html#section-4" target="_blank" rel="noopener noreferrer">RFC 1112, section 4</a>.</p></Explain>
      <h3>Diapositive 22 · Les adresses qu’on ne distribue pas comme des hôtes ordinaires</h3>
      <ul>
        <li><strong>0.0.0.0</strong> peut représenter une adresse encore non configurée ; dans une table, le préfixe 0.0.0.0/0 aura le rôle distinct de route par défaut.</li>
        <li><strong>Host-Id tout à zéro</strong> nomme le réseau ; <strong>Host-Id tout à un</strong> donne sa diffusion. Pour les sous-réseaux usuels du TD, on retire donc deux adresses au nombre total.</li>
        <li><strong>127.0.0.0/8</strong> est le rebouclage local, dont l’exemple 127.0.0.1 : on parle à sa propre machine.</li>
        <li><strong>Privées RFC 1918</strong> : 10.0.0.0–10.255.255.255 ; 172.16.0.0–172.31.255.255 ; 192.168.0.0–192.168.255.255. Elles n’ont pas une signification unique entre sites indépendants. Le cours cite NAT pour traduire les adresses lors d’un accès externe.</li>
      </ul>
      <Transfer question="172.32.0.1 appartient-elle à la plage privée commençant par 172 ?"><p>Non : elle s’arrête à 172.31.255.255. Regarder seulement le premier octet ferait confondre la classe historique B et la plage privée 172.16.0.0/12.</p></Transfer>
    </Section>

    <Section id="ip-subnet">
      <h3>Diapositive 23 · Emprunter des bits à la partie hôte</h3>
      <p>Un site possède plusieurs réseaux physiques mais veut présenter un bloc unique à l’extérieur. Il divise la partie Host-Id en un identifiant de sous-réseau et un identifiant de machine. À l’extérieur, une route peut toujours désigner le bloc global ; à l’intérieur, les routeurs utilisent des préfixes plus longs. « Invisible de l’extérieur » signifie que le détail du découpage n’a pas à être annoncé partout, pas qu’il est secret ou impossible à router.</p>
      <h3>Diapositive 24 · Le masque est la frontière écrite en bits</h3>
      <p>Un masque a 32 bits : des 1 dans la partie réseau, des 0 dans la partie hôte. Le ET logique conserve un bit lorsque les deux bits comparés valent 1. Ainsi <strong>adresse réseau = adresse IP ET masque</strong>. Un /n est simplement un masque dont les n premiers bits valent 1.</p>
      <pre>{`Exemple du support : 143.27.4.101 /16
Adresse : 10001111 00011011 00000100 01100101
Masque  : 11111111 11111111 00000000 00000000
ET      : 10001111 00011011 00000000 00000000
Réseau  : 143.27.0.0`}</pre>
      <p>Pourquoi le 4 et le 101 disparaissent-ils ? Les bits correspondants sont multipliés logiquement par zéro. Pour trouver la diffusion, on conserve le résultat réseau et on met tous les bits hôte à 1. Dans les sous-réseaux ordinaires du cours, les machines se placent entre ces deux bornes.</p>
      <h3>Diapositive 25 · Deux réseaux dans 137.10.45.0/24</h3>
      <p>Le routeur R sépare deux réseaux /25, masque 255.255.255.128. Sur le premier : R = .1, A = .4, B = .2, C = .3 ; sur le second : R = .129, D = .131, E = .139, F = .138. Les trois premiers octets sont toujours 137.10.45. Le premier sous-réseau couvre .0–.127, le deuxième .128–.255 ; .0 et .128 désignent les réseaux, .127 et .255 leurs diffusions.</p>
      <p>La destination du paquet du dessin est <strong>137.10.45.126</strong>. Fais le calcul sur le dernier octet : 126 = 01111110 ; 128 = 10000000 ; le ET vaut 00000000. Elle appartient donc au premier sous-réseau, même si .126 n’est pas une machine nommée dans le dessin. Le critère est le masque, pas la proximité du numéro avec celui d’une autre machine.</p>
      <p><strong>Méthode de partiel.</strong> Pars du préfixe réellement donné au site. Pour au moins N sous-réseaux, cherche b tel que 2 puissance b soit au moins N. Le nouveau préfixe est ancien préfixe + b. Il reste h = 32 − nouveau préfixe bits hôte, soit 2 puissance h − 2 machines dans les cas ordinaires du TD. Écris ensuite réseau, première machine, dernière machine, diffusion : ces quatre nombres contrôlent ton découpage.</p>
      <p><strong>Prédis → agis → observe → relie.</strong> Prévois de quel côté tombe .126, puis .139. Manipule adresse et masque, observe les bits conservés et relie les deux réseaux obtenus au seul bit emprunté au /24.</p>
      <IPActivity kind="subnet" />
      <Transfer question="Pourquoi A ne peut-il pas livrer directement à D, même si les deux adresses commencent par 137.10.45 ?"><p>Avec /25, A (.4) obtient le réseau .0 et D (.131) le réseau .128. Ce sont deux sous-réseaux et deux liaisons physiques distinctes. A remet donc le paquet à l’interface locale de R ; l’adresse IP finale reste celle de D.</p></Transfer>
    </Section>

    <Section id="ip-cidr">
      <h3>Diapositive 26 · Deux pénuries différentes</h3>
      <p>Il manque des adresses, mais il manque aussi de la place et du temps pour traiter des tables de routage toujours plus grandes. Les solutions du support n’agissent pas toutes sur le même problème. DHCP attribue temporairement et automatiquement des paramètres IP aux machines ; il ne rallonge pas une adresse. Les adresses privées et NAT permettent de réutiliser des espaces internes et de traduire les échanges avec l’extérieur. CIDR distribue et agrège des blocs mieux dimensionnés. IPv6 agrandit l’espace d’adressage lui-même.</p>
      <h3>Diapositive 27 · Pourquoi abandonner les boîtes A, B et C ?</h3>
      <p>Une organisation de quelques milliers de machines est trop grande pour un /24 mais gaspille beaucoup d’un /16. Donner plusieurs /24 dispersés réduit parfois le gaspillage d’adresses, mais oblige à conserver plusieurs lignes de routage. CIDR remplace la classe implicite par un <strong>préfixe et sa longueur explicite</strong>. Le sous-réseautage allonge un préfixe pour séparer ; le supernetting, ou agrégation, raccourcit un préfixe pour résumer des blocs compatibles.</p>
      <h3>Diapositive 28 · Comprendre 194.18.16.0/21</h3>
      <p>Le support oppose des réseaux de classe C dispersés (193.18.49.0, 194.40.27.0, 194.45.32.0, 195.32.24.0, 195.35.35.0, 195.75.35.0) à un bloc contigu. Pour un /21, les 16 premiers bits sont 194.18, puis les cinq premiers bits du troisième octet sont fixes. Les trois bits restants de cet octet varient, ainsi que le quatrième octet.</p>
      <pre>{`16 = 00010 000     17 = 00010 001
18 = 00010 010     19 = 00010 011
20 = 00010 100     21 = 00010 101
22 = 00010 110     23 = 00010 111
     préfixe commun de 5 bits`}</pre>
      <p>La route 194.18.16.0/21 résume donc huit /24 : .16.0 à .23.255, masque 255.255.248.0. Les valeurs 15 et 24 du dessin montrent les voisins qui ne partagent pas ce préfixe. La liste centrale du transparent n’affiche que .16 à .21 ; le /21 et le tableau binaire incluent bien aussi .22 et .23. Ce détail compte : agréger n’autorise pas à ignorer une partie du bloc annoncé.</p>
      <p><strong>Pourquoi faut-il l’alignement ?</strong> Huit /24 de .17 à .24 sont contigus mais ne partagent pas les mêmes cinq bits. On ne les remplace donc pas exactement par un seul /21. Une agrégation valide doit couvrir le bloc voulu sans annoncer involontairement des réseaux extérieurs.</p>
      <Numeric question="Combien d’adresses contient le bloc 194.18.16.0/21, avant toute attribution aux machines ?" answer={2048} unit="adresses" why="32 − 21 = 11 bits variables ; 2 puissance 11 = 2048. Il s’agit de la taille du bloc, pas de la somme des capacités hôtes après découpage en /24." />
    </Section>

    <Section id="ip-ipv6">
      <h3>Diapositive 29 · Les objectifs annoncés</h3>
      <p>IPv6 vise un espace d’adressage beaucoup plus grand, une organisation hiérarchique des routes, un traitement simplifié et l’autoconfiguration. Le transparent cite aussi sécurité, qualité de service, mobilité et multicast. Ce sont des objectifs et des mécanismes possibles, pas des garanties automatiques : une adresse IPv6 ne chiffre pas à elle seule les communications et ne garantit pas un délai d’arrivée.</p>
      <h3>Diapositive 30 · Un en-tête de base fixe de 40 octets</h3>
      <table><caption>Lire les champs IPv6 du support</caption><thead><tr><th>Champ</th><th>Rôle</th></tr></thead><tbody>
        <tr><td>Version</td><td>Vaut 6 ; ce n’est pas un IPv4 à adresses plus longues.</td></tr>
        <tr><td>Traffic Class</td><td>Classe de trafic et indication de traitement souhaité.</td></tr>
        <tr><td>Flow Label</td><td>Étiquette de flux posée par la source pour identifier un ensemble de paquets à traiter de façon cohérente.</td></tr>
        <tr><td>Payload Length</td><td>Longueur après l’en-tête de base, donc contrairement à IPv4 elle n’inclut pas les 40 octets.</td></tr>
        <tr><td>Next Header</td><td>Indique le type de l’en-tête suivant : extension ou protocole supérieur.</td></tr>
        <tr><td>Hop Limit</td><td>Limite les sauts comme le TTL dans nos exercices IPv4.</td></tr>
        <tr><td>Source / destination</td><td>128 bits chacune, soit 16 octets par adresse.</td></tr>
      </tbody></table>
      <p>Les options passent par des en-têtes d’extension. Les routeurs ne fragmentent pas IPv6 : une fragmentation éventuelle relève de la source. Il n’y a pas de checksum dans l’en-tête de base, donc pas de recalcul d’un contrôle d’en-tête à chaque saut. Le support écrit « pas de calcul de CRC » ; le contrôle IPv4 comparé ici est plus précisément une somme de contrôle, pas un CRC.</p>
      <p>Le champ Payload Length ordinaire tient sur 16 bits, donc jusqu’à 65 535 octets après l’en-tête de base. Le cas spécial des jumbogrammes cité par la diapositive utilise une valeur zéro et une option qui porte une longueur étendue. Il n’est pas nécessaire pour les calculs de fragmentation IPv4 du TD.</p>
      <h3>Diapositive 31 · Lire puis raccourcir, sans perdre de bits</h3>
      <p>128 bits donnent huit groupes de 16 bits, écrits chacun avec quatre chiffres hexadécimaux. Exemple exact : <code>2001:0000:0000:0000:0237:0067:A9CB:12EC</code>. Supprimer les zéros initiaux de chaque groupe donne <code>2001:0:0:0:237:67:A9CB:12EC</code>. Remplacer une suite de groupes nuls par <code>::</code> donne <code>2001::237:67:A9CB:12EC</code>. On ne peut employer <code>::</code> qu’une fois, sinon on ne saurait plus répartir les groupes manquants.</p>
      <p>Le réseau <code>2001:CDAB:9862:A435::/64</code> fixe les quatre premiers groupes. L’écriture mappée <code>::FFFF:196.22.16.134</code> représente une IPv4 dans une structure IPv6 : elle ne signifie pas qu’un routeur peut transformer arbitrairement tout paquet IPv4 en IPv6. La coexistence exige des mécanismes adaptés ; les formats ne sont pas directement interchangeables.</p>
      <Transfer question="Dans 2001::237:67:A9CB:12EC, combien de groupes :: remplace-t-il ?"><p>Cinq groupes sont écrits : 2001, 237, 67, A9CB, 12EC. Il en faut huit ; :: représente donc trois groupes nuls. Cette vérification évite de deviner à l’œil.</p></Transfer>
    </Section>

    <Section id="ip-forward">
      <h3>Diapositives 32–34 · L’adresse finale et le prochain saut</h3>
      <p>La diapositive 32 annonce le routage IP ; la 33 rappelle qu’un routeur a des interfaces et donc des adresses sur différents réseaux, avec éventuellement des technologies de liaison différentes. Il faut maintenant distinguer deux questions : « à qui le paquet est-il destiné ? » et « à quel voisin puis-je le confier maintenant ? »</p>
      <p>Dans la diapositive 33, R porte 193.49.60.1 sur Ethernet, face aux machines 193.49.60.41 et .43, et 192.100.1.1 sur Token Ring, face aux machines 192.100.1.2 et .7. Ce sont deux adresses d’un même routeur, chacune localisant une interface. La gateway du support est cet équipement d’interconnexion entre les réseaux physiques.</p>
      <p>La remise <strong>directe</strong> transmet à une destination sur le même réseau local, sans routeur intermédiaire. La remise <strong>indirecte</strong> confie le datagramme à un routeur qui pourra progresser vers un autre réseau. Une machine ordinaire consulte elle aussi des routes ; le routage n’est pas une décision réservée aux seuls routeurs.</p>
      <h3>Diapositive 35 · bsdi parle directement à sun</h3>
      <p>Sur l’Ethernet 140.252.13 du schéma, bsdi a l’adresse 140.252.13.35 et sun 140.252.13.33. Le paquet porte IP destination = 140.252.13.33 ; la trame Ethernet porte la MAC de sun. Dans ce cas, le destinataire final est également le destinataire de la trame locale. Il reste à découvrir cette MAC : c’est précisément le rôle d’ARP, étudié après les tables.</p>
      <h3>Diapositive 36 · bsdi vise 192.48.96.9, loin du réseau local</h3>
      <p>bsdi confie d’abord le paquet à sun (140.252.13.33). La trame a donc la MAC de sun comme destination, mais <strong>IP destination reste 192.48.96.9</strong>. sun rejoint ensuite netb (140.252.1.183) par la liaison SLIP du dessin. Cette liaison point à point n’emploie pas l’enveloppe Ethernet du premier segment. Puis netb, sur l’Ethernet 140.252.1, confie une nouvelle trame à gateway (140.252.1.4), toujours pour joindre 192.48.96.9.</p>
      <p>Le chemin se construit ainsi par décisions locales. Le champ IP destination ne devient pas successivement sun, netb, gateway. Les adresses de liaison, lorsqu’il y en a, changent avec le saut ; l’adresse finale IP décrit le but de bout en bout, hors traduction NAT.</p>
      <Choice question="bsdi envoie vers 192.48.96.9 via sun. Quelle destination est dans le premier en-tête IP ?" options={["140.252.13.33, l’adresse de sun", "192.48.96.9, la destination finale", "La MAC de gateway"]} answer={1} why="Le prochain saut détermine l’enveloppe locale et la sortie, pas la destination finale du datagramme." />
    </Section>

    <Section id="ip-table">
      <h3>Diapositive 37 · Transformer le dessin en décision écrite</h3>
      <p>Une route associe une destination, une voie et un coût. La destination peut être une machine complète (le drapeau H historique l’indique) ou un réseau. La voie précise l’interface de sortie et, si nécessaire, l’adresse du routeur prochain saut. Le coût dépend de la métrique choisie : nombre de routeurs, délai ou autre mesure. Ne confonds pas ce coût avec la longueur du préfixe, qui sert à choisir la destination la plus précise parmi les routes installées.</p>
      <h3>Diapositive 38 · La vraie table de R1 dans le support</h3>
      <table><caption>Table de R1 — mêmes réseaux, masques et prochains sauts que la diapositive 38</caption><thead><tr><th>Destination</th><th>Masque</th><th>Prochain saut</th><th>Voie</th></tr></thead><tbody>
        <tr><td>193.52.72.0</td><td>255.255.255.0</td><td>Direct</td><td>Eth 2</td></tr>
        <tr><td>193.52.71.0</td><td>255.255.255.0</td><td>193.52.74.2 (R2)</td><td>Eth 1</td></tr>
        <tr><td>193.52.74.0</td><td>255.255.255.0</td><td>Direct</td><td>Eth 1</td></tr>
        <tr><td>0.0.0.0</td><td>0.0.0.0</td><td>193.52.72.1 (R3)</td><td>Eth 2</td></tr>
      </tbody></table>
      <p><strong>Méthode, étape 1.</strong> Pour chaque ligne, calcule destination du paquet ET masque. Si le résultat vaut le réseau de cette ligne, elle correspond. <strong>Étape 2.</strong> Parmi les correspondances, choisis le plus long préfixe : davantage de bits fixes, donc une destination plus précise. <strong>Étape 3.</strong> Lis voie et prochain saut. Une route directe envoie vers le destinataire lui-même sur la liaison ; une route indirecte envoie vers le routeur indiqué.</p>
      <p><strong>Exemple.</strong> Pour 193.52.71.9, la route .71.0/24 et la route par défaut /0 correspondent. Le /24 gagne ; sortie Eth 1, prochain saut 193.52.74.2. Pourquoi ce prochain saut est-il en .74 et pas en .71 ? Parce que R1 doit pouvoir joindre R2 sur son réseau directement connecté .74. Pour 193.52.72.9, livraison directe par Eth 2. Pour 8.8.8.8, seule la route par défaut reste : Eth 2 vers 193.52.72.1.</p>
      <p>Le « plus long préfixe » ne signifie ni l’adresse numériquement la plus grande ni la première ligne affichée. Une route par défaut correspond à tout, mais elle perd face à toute route plus spécifique qui correspond. Sans aucune route correspondante, le paquet ne peut pas être transmis.</p>
      <p><strong>Prédis → agis → observe → relie.</strong> Choisis d’abord la ligne sur papier. Envoie ensuite le paquet dans le réseau de l’atelier, observe la ligne retenue et vérifie séparément destination IP, prochain saut et sortie. Change de destination pour passer du direct à l’indirect puis au défaut.</p>
      <IPActivity kind="forward" />
      <Transfer question="Une route /25 et une route /24 correspondent toutes deux. Faut-il prendre le plus petit nombre de sauts ?"><p>Pour sélectionner le préfixe de destination, le /25 gagne : il est plus spécifique. Les métriques servent notamment à départager ou construire des routes vers un même préfixe, pas à remplacer la règle de correspondance la plus longue.</p></Transfer>
    </Section>

    <Section id="ip-arp">
      <h3>Diapositives 39–40 · L’information qui manque encore</h3>
      <CourseParagraph>La table de routage donne une adresse IP à joindre sur la liaison locale. Ethernet exige pourtant une adresse matérielle MAC. ARP résout cette correspondance : pour une IPv4 locale connue, demander quelle MAC l’utilise. ARP ne recherche pas un nom de domaine et ne découvre pas l’adresse MAC d’une machine à l’autre bout d’Internet. Si la destination est distante, on résout l’IP du prochain routeur.</CourseParagraph>
      <p>La requête est diffusée sur le réseau local. Chaque interface peut la recevoir ; seule celle qui reconnaît l’adresse demandée répond dans le cas ordinaire. La réponse revient en unicast au demandeur. Un cache conserve la correspondance pour éviter une nouvelle diffusion à chaque paquet ; les entrées vieillissent et peuvent être renouvelées. La commande historique <code>arp -a</code> du support permet d’afficher cette table.</p>
      <h3>Diapositives 41–45 · Rejouer la séquence exacte</h3>
      <ol>
        <li><strong>41 — besoin.</strong> Le routeur 137.194.161.1, MAC 08:00:20:12:34:56, doit remettre un paquet à 137.194.161.5. La MAC de la destination est encore inconnue.</li>
        <li><strong>42 — requête.</strong> Il émet une trame destination FF:FF:FF:FF:FF:FF, source 08:00:20:12:34:56. Dans le message ARP, il demande l’adresse matérielle associée à 137.194.161.5.</li>
        <li><strong>43 — sélection.</strong> A reconnaît son IP 137.194.161.5. B et C ne répondent pas à cette demande qui ne les désigne pas.</li>
        <li><strong>44 — réponse.</strong> A répond depuis 08:00:20:08:08:00 vers 08:00:20:12:34:56, en annonçant sa correspondance IP/MAC.</li>
        <li><strong>45 — paquet utile.</strong> Le routeur peut maintenant envoyer la trame portant IP vers A : MAC source = interface du routeur, MAC destination = A. L’échange ARP a préparé cet envoi ; il n’a pas transporté les données applicatives.</li>
      </ol>
      <Explain title="Précision sur la source IP dans le dessin"><p>Les premiers dessins indiquent une source IP x.x.x.x ; le dernier affiche 137.194.161.1. Si le routeur relaie un paquet reçu, il conserve normalement la source x.x.x.x. Le dernier dessin est cohérent avec un paquet émis par le routeur lui-même. L’activité distingue ces cas : ARP n’est pas une opération de traduction de l’adresse source.</p></Explain>
      <h3>Diapositive 46 · ARP n’est pas à l’intérieur d’IP</h3>
      <p>Dans Ethernet, le champ de type identifie la charge transportée : 0x0800 pour IPv4, 0x0806 pour ARP. On peut donc avoir une trame Ethernet portant directement ARP, puis une autre portant IP. Le schéma de service place leurs points d’accès côte à côte ; cela explique pourquoi un message ARP n’a ni TTL IPv4 ni numéro de protocole IP. Son domaine de diffusion reste la liaison locale.</p>
      <p><strong>Prédis → agis → observe → relie.</strong> Avec le cache vide, prévois qui reçoit la requête et qui répond. Lance la séquence, puis renvoie un paquet avec le cache rempli. Observe la requête devenue inutile et relie ce changement au rôle de mémorisation du cache.</p>
      <IPActivity kind="arp" />
      <Transfer question="Tu connais le nom du serveur, mais pas son IP ni la MAC de ta passerelle : faut-il demander les deux à ARP ?"><p>Non. La résolution de nom vers IP relève de DNS. ARP sert ensuite à trouver la MAC du voisin local choisi pour le prochain saut. DNS et ARP ne résolvent pas le même type d’identifiant.</p></Transfer>
    </Section>

    <Section id="ip-icmp">
      <h3>Diapositives 47–48 · Signaler sans rendre IP fiable</h3>
      <p>IP peut abandonner un paquet. ICMP apporte des messages de contrôle : certains signalent une erreur, d’autres demandent ou fournissent une information. Ils sont eux-mêmes transportés par IP, avec champ protocole = 1. Un message d’erreur revient vers l’émetteur du datagramme qui a posé problème, pas vers sa destination initiale. Il peut lui aussi être perdu : l’absence de réponse ne prouve donc pas une livraison réussie.</p>
      <p>Le dessin oppose ICMP, contenu dans IP, à ARP et RARP, directement identifiés par des types Ethernet. RARP est le mécanisme historique de résolution inverse représenté dans le support ; il ne faut pas le confondre avec la réponse à une requête ARP.</p>
      <p>Le support résume la prévention des boucles par « pas d’ICMP sur ICMP ». La règle précise utile est : <strong>ne pas produire d’erreur ICMP en réaction à une autre erreur ICMP</strong>. Les messages d’information, comme la demande d’écho, sont distincts. Cela évite une chaîne d’erreurs sur des erreurs. Voir <a href="https://www.rfc-editor.org/rfc/rfc1812.html#section-4.3.2.7" target="_blank" rel="noopener noreferrer">RFC 1812, section 4.3.2.7</a>.</p>
      <h3>Diapositives 49–50 · Type, code et situation observée</h3>
      <p>Le début du message comporte Type sur 8 bits, Code sur 8 bits, puis Checksum sur 16 bits. Le type donne la famille ; le code précise le cas. Les données complémentaires dépendent du message. On ne peut donc pas déduire le sens d’un « code 0 » sans lire le type.</p>
      <table><caption>Messages du support et précision pour la fragmentation</caption><thead><tr><th>Type / code</th><th>Situation</th><th>Ce que tu conclus</th></tr></thead><tbody>
        <tr><td>3 / selon la cause</td><td>Destination inaccessible</td><td>Le routeur ou l’hôte ne peut pas remettre le paquet.</td></tr>
        <tr><td>3 / 4</td><td>Fragmentation nécessaire, DF = 1</td><td>La taille empêche le transfert et la fragmentation est interdite.</td></tr>
        <tr><td>11 / 0</td><td>TTL expiré en route</td><td>Le compteur a été épuisé sur un routeur.</td></tr>
        <tr><td>8 / 0 puis 0 / 0</td><td>Demande puis réponse d’écho</td><td>Les messages utilisés par ping.</td></tr>
        <tr><td>17 / 0 puis 18 / 0</td><td>Demande puis réponse de masque</td><td>Mécanisme historique de configuration présenté dans le support.</td></tr>
      </tbody></table>
      <Explain title="Coquille vérifiée — type 3, code 4 et non code 3"><p>La diapositive 49 associe « code 3 » à la fragmentation nécessaire avec DF = 1. La <a href="https://www.rfc-editor.org/rfc/rfc792.html" target="_blank" rel="noopener noreferrer">RFC 792, Destination Unreachable</a> donne code 4 pour ce cas et code 3 pour un port inaccessible. Le PDF reste identique ; l’explication et les activités utilisent le code correct.</p></Explain>
      <p><strong>Ping.</strong> Une demande d’écho part vers l’hôte ; une réponse permet de mesurer l’aller-retour. Un silence peut venir de pertes, de filtrage ou d’une absence de réponse ; ce n’est pas une preuve unique que la machine est éteinte.</p>
      <p><strong>Traceroute.</strong> Des sondes avec TTL = 1, puis 2, puis 3 font expirer successivement le compteur sur les routeurs du chemin. Chaque ICMP temps dépassé révèle un saut. Dans la variante UDP classique du TD, l’arrivée à la destination peut être reconnue par un port inaccessible ; d’autres variantes utilisent d’autres sondes. Une étoile représente une sonde sans réponse à temps, pas forcément un câble cassé. Les trois temps sur une ligne sont trois mesures de sondes, pas trois durées de liaisons à additionner.</p>
      <p><strong>Prédis → agis → observe → relie.</strong> Choisis où une sonde TTL = 1 doit s’arrêter, fais avancer l’échange puis augmente TTL. Observe qui répond et relie l’adresse de la réponse au routeur où le compteur s’est épuisé.</p>
      <IPActivity kind="icmp" />
      <Transfer question="Un paquet trop grand porte DF = 1. Le routeur peut-il l’envoyer en deux morceaux pour rendre service ?"><p>Non : DF interdit la fragmentation. Le transfert échoue ; le message d’erreur correspondant est ICMP type 3, code 4. Best effort ne signifie pas ignorer les champs du protocole.</p></Transfer>
    </Section>

    <Section id="ip-static">
      <h3>Diapositive 51 · Acheminer et construire la table sont deux tâches</h3>
      <p>Jusqu’ici, nous avons utilisé une table déjà remplie. Un protocole de routage sert à <strong>construire et mettre à jour ces routes</strong>. Le transfert d’un paquet consulte le résultat. Cette distinction explique qu’un routeur puisse continuer à acheminer entre deux échanges de mises à jour.</p>
      <p>En routage statique, l’administrateur écrit les routes. En routage dynamique, les équipements échangent des informations, apprennent l’accessibilité des réseaux et réagissent aux changements. Plus la topologie devient complexe, plus maintenir manuellement toutes les routes devient fragile. « Dynamique » ne veut pas dire que les tables changent arbitrairement à chaque paquet : elles évoluent selon les annonces et événements du protocole.</p>
      <h3>Diapositive 52 · Lire les commandes du cours</h3>
      <pre>{`ifconfig eth0 137.194.192.31 netmask 255.255.255.0
route add [-net] [-host] target
route del target`}</pre>
      <p>La première commande configure une interface : adresse et masque. Les suivantes représentent l’ajout et la suppression de routes ; les détails de passerelle et d’interface complètent la route selon le système. <code>-net</code> désigne un réseau, <code>-host</code> une machine. Ces commandes sont la syntaxe historique du support, présentée pour lecture ; les ateliers ne modifient pas les paramètres de ton ordinateur.</p>
      <p>La mise en œuvre statique est simple dans un petit site. Mais si A envoie vers B et B renvoie vers A pour la même destination, on a créé une boucle ; TTL finira par l’arrêter sans réparer les tables. Si un lien tombe et qu’aucune route de remplacement n’est installée, une route statique devenue fausse ne découvre pas automatiquement un détour.</p>
      <Transfer question="Modifier l’adresse d’eth0 suffit-il à annoncer un nouveau réseau à tous les autres routeurs ?"><p>Non. Configurer une interface et diffuser l’information de routage sont deux opérations différentes. Il faut des routes adaptées chez les autres équipements, obtenues manuellement ou par un protocole dynamique.</p></Transfer>
    </Section>

    <Section id="ip-as">
      <h3>Diapositive 53 · Le problème de l’échelle et de l’administration</h3>
      <p>Internet ne possède pas un point central qui calcule toutes les routes de tous les équipements. Un système autonome, AS, regroupe des réseaux sous une administration de routage commune : fournisseur, entreprise ou autre organisation. Il est identifié par un numéro. La hiérarchie permet de distinguer le détail interne d’un domaine et la manière de joindre d’autres domaines. Le support cite whois comme outil de consultation de renseignements publics d’enregistrement ; ce n’est pas un protocole qui transfère nos paquets.</p>
      <h3>Diapositive 54 · Trois rôles d’AS</h3>
      <ul>
        <li><strong>Stub.</strong> Une seule connexion vers le reste d’Internet dans le modèle du cours ; une sortie par défaut suffit à exprimer où envoyer le trafic externe.</li>
        <li><strong>Multihomed.</strong> Plusieurs connexions externes, mais pas de transport de trafic de transit entre d’autres AS. Avoir deux sorties ne fait pas automatiquement de l’organisation un fournisseur de transit.</li>
        <li><strong>Transit.</strong> Relie d’autres AS et transporte des communications dont il n’est ni l’origine ni la destination finale.</li>
      </ul>
      <h3>Diapositive 55 · IGP dedans, EGP entre domaines</h3>
      <p>Un IGP organise le routage interne : le cours cite RIP, RIP-2, OSPF et EIGRP. Entre AS, la famille des protocoles externes, EGP au sens générique du transparent, est illustrée par BGP. Le dessin veut surtout éviter une confusion d’échelle : les voisins d’un calcul interne et les politiques d’interconnexion entre administrations ne sont pas la même question.</p>
      <p>Dans le modèle présenté, les routeurs d’un domaine participent à un protocole interne commun ; les passerelles extérieures permettent d’atteindre les réseaux d’autres AS. Cela ne signifie pas qu’une carte exhaustive de tous les liens internes d’Internet est diffusée mondialement.</p>
      <Choice question="Une entreprise possède deux fournisseurs d’accès mais n’achemine pas de trafic de l’un vers l’autre. Quel rôle du support correspond ?" options={["Stub à une seule sortie", "Multihomed", "Transit"]} answer={1} why="Les connexions multiples définissent ici multihomed ; le rôle transit exige de relayer du trafic entre d’autres domaines." />
    </Section>

    <Section id="ip-rip">
      <h3>Diapositive 56 · Transformer les vecteurs de distances en protocole</h3>
      <p>RIP applique l’idée déjà étudiée en routage : un voisin annonce sa distance vers une destination, et je considère le coût pour l’atteindre via ce voisin. La métrique est le nombre de sauts. Dans le modèle simple à un saut par lien, candidat via V = 1 + distance annoncée par V. Une bonne table indique à la fois la distance choisie et le voisin par lequel passer.</p>
      <p>Le support donne les constantes à reconnaître : échange périodique toutes les <strong>30 secondes</strong>, route déclarée invalide après <strong>180 secondes</strong> sans mise à jour valable, distances utilisables jusqu’à <strong>15 sauts</strong>, et <strong>16 = infini</strong>. Pourquoi choisir un infini si petit ? Pour borner les mauvaises nouvelles qui remontent progressivement dans un protocole à vecteurs de distances. En contrepartie, RIP n’est pas adapté à de très grands diamètres.</p>
      <p>Les messages passent dans UDP, port 520. C’est un échange de contrôle entre équipements, qui aide à construire les routes ; les données utilisateur n’ont pas besoin d’être encapsulées dans RIP. Les versions RIPv1 et RIPv2 citées dans le support appartiennent à cette même famille. Les références RFC du transparent sont des repères historiques.</p>
      <h3>Diapositive 57 · Demander ou annoncer</h3>
      <p>La commande 1 est une requête : un routeur qui démarre peut demander de l’information sans attendre la prochaine période. La commande 2 est une réponse contenant des routes. Le mot « réponse » est un nom de message : il peut répondre à une requête, être émis périodiquement ou suivre une modification de table. Toute réponse n’implique donc pas qu’une question vient juste d’être reçue.</p>
      <p><strong>Exemple de raisonnement.</strong> V annonce une destination à distance 4 : elle est candidate à 5 via V. S’il l’annonce à 16, ajouter 1 ne donne pas une route utilisable à 17 : on reste à l’infini RIP. Si une route dépend d’un voisin qui ne fournit plus de mise à jour, l’expiration révèle sa disparition, parfois plus tard que la panne réelle. C’est pourquoi le cours parle d’une convergence pouvant prendre des minutes.</p>
      <p><strong>Prédis → agis → observe → relie.</strong> Anticipe la distance obtenue à partir d’une annonce voisine. Reçois cette annonce dans l’atelier, puis observe l’évolution après perte d’information. Relie le résultat à la métrique et aux temporisateurs ; les 30 secondes ne sont pas le délai de transmission d’un paquet utilisateur.</p>
      <IPActivity kind="rip" />
      <p><a href="#routage/distance-discovery">Reprendre la construction des vecteurs de distances</a> · <a href="#routage/dv-failure">Comprendre la panne et le comptage à l’infini</a></p>
      <Transfer question="Un voisin annonce une destination à distance 15. Est-elle atteignable pour moi via ce voisin ?"><p>Non dans RIP : ajouter un saut donne 16, la valeur d’inaccessibilité. Le maximum de 15 concerne la distance totale de la route installée chez le routeur considéré.</p></Transfer>
    </Section>

    <Section id="ip-ospf">
      <h3>Diapositive 58 · Une carte commune plutôt que des distances seulement</h3>
      <p>OSPF utilise l’état de liens. Les routeurs échangent des descriptions de la topologie, construisent une carte de leur aire, puis calculent localement des plus courts chemins. Retrouve la différence avec RIP : apprendre « mon voisin est à quatre sauts » ne décrit pas tous les liens ; recevoir une annonce d’état de liens apporte des éléments de carte sur lesquels appliquer Dijkstra.</p>
      <p>Le support introduit deux niveaux pour limiter la portée des changements. L’AS est découpé en aires ; l’aire centrale est le backbone, <strong>Area 0</strong>. Les annonces d’état de liens pertinentes sont diffusées dans leur aire. Le mot « broadcast » du support décrit ici la diffusion d’information de routage ; ne le confonds pas avec une unique trame Ethernet qui traverserait tous les routeurs.</p>
      <h3>Diapositive 59 · Relier les aires par le backbone</h3>
      <p>Les routeurs de bordure d’aire relient une aire au backbone et annoncent des informations d’accessibilité vers les autres aires. Dans le dessin, Areas 1, 2, 3 et 4 sont organisées autour d’Area 0. Une modification locale n’exige pas de recopier chaque détail de chaque lien dans toutes les aires ; les informations inter-aires permettent de joindre les destinations tout en conservant cette séparation.</p>
      <p>Pour lire le schéma, distingue donc trois objets : l’aire qui contient un réseau, le routeur de bordure qui permet d’en sortir, et le backbone qui assure l’organisation inter-aires. L’aire n’est pas un routeur et son numéro n’est pas un coût de liaison.</p>
      <h3>Diapositive 60 · Hello et LSA n’ont pas le même travail</h3>
      <p>Les <strong>Hello</strong> servent à découvrir et surveiller les voisins directs. Le support retient un intervalle de 10 secondes et un voisin déclaré mort après 40 secondes sans Hello. Les <strong>LSA</strong> décrivent l’état nécessaire à la base topologique : le cours donne un rafraîchissement périodique de 30 minutes, avec diffusion aussi après un changement de topologie. Ces valeurs sont les paramètres du scénario enseigné ; les temporisateurs Hello et mort peuvent dépendre de la configuration et du type de réseau.</p>
      <p>Pourquoi ne pas attendre trente minutes après une panne ? Parce que ce nombre est une période de rafraîchissement, pas une interdiction d’annoncer avant. La détection d’un voisin mort peut entraîner une mise à jour d’état de liens, sa diffusion, puis un nouveau calcul des routes. Hello observe le voisinage ; LSA informe la carte ; Dijkstra exploite cette carte.</p>
      <p><strong>Prédis → agis → observe → relie.</strong> L’atelier isole une seule aire. Prévois quels voisins recevront d’abord l’annonce de A, diffuse-la puis observe comment tous les routeurs finissent par la connaître sans répétition infinie. Relie cette expérience à la construction de la carte. Reviens ensuite au schéma de la diapositive 59 pour placer cette aire, son routeur de bordure et l’Area 0 : le jeu ne simule pas les échanges entre aires.</p>
      <IPActivity kind="ospf" />
      <p><a href="#routage/dijkstra-discovery">Reprendre Dijkstra pas à pas</a> · <a href="#routage/routage-dijkstra">Relier le calcul à l’état de liens</a></p>
      <Transfer question="Hello annonce-t-il directement ma meilleure route vers toutes les destinations ?"><p>Non : Hello découvre et surveille les voisins. Les annonces d’état de liens alimentent la base topologique ; le calcul local construit les routes. C’est justement la séparation entre observation, information et décision.</p></Transfer>
      <h3>Mission résolue · Du paquet au bon voisin</h3>
      <p>Les 1400 octets de données deviennent trois fragments de données 600, 600 et 200 lorsque la MTU vaut 620. Les longueurs IP sont 620, 620 et 220 ; les décalages 0, 75 et 150 ; MF vaut 1, 1, 0. Chaque routeur consulte la route la plus spécifique, choisit une sortie et un prochain saut. Sur Ethernet, ARP peut fournir la MAC de ce voisin ; TTL limite la durée du trajet. Seule la destination réassemble. RIP ou OSPF expliquent comment les tables consultées ont été obtenues.</p>
      <h3>Ce que tu dois maintenant savoir écrire au partiel</h3>
      <ul>
        <li>Une adresse et un masque donnent réseau, diffusion, plage de machines et appartenance à un sous-réseau.</li>
        <li>Un tableau de fragmentation distingue données, longueur totale, identification, MF et décalage en unités de 8.</li>
        <li>Une décision de routage indique le préfixe choisi, le prochain saut et l’interface ; une trame distingue MAC locales et IP de bout en bout.</li>
        <li>Une réponse ICMP se lit avec type et code ; un silence de traceroute reste une observation à interpréter.</li>
        <li>RIP échange des distances ; OSPF diffuse des états de liens dans une organisation en aires. Leurs annonces construisent les tables, leur consultation transfère les paquets.</li>
      </ul>
      <p><a href="#td-ip">Passer aux exercices du TD IP, avec leurs corrections et les liens vers chaque explication</a> · <a href="#annales">Retrouver les exercices d’annales classés par thème</a></p>
    </Section>
  </>;
}
