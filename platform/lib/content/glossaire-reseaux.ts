// Glossary for the CS track "Réseaux" — same contract as glossaire-fmv.ts:
// every technical term is DEFINED in exactly one lesson (its `lessonId`), at
// the anchor `#def-<id>` minted by the <Def> component; every other mention
// links to it with <Terme id="…">.
//
// Rules (enforced by scripts/verify-content.cjs):
//  - `id` is stable, ASCII kebab-case (it becomes part of a URL fragment);
//  - `short` is plain text — no dollar-delimited math (it renders inside a
//    title attribute, where KaTeX cannot run); unicode (×, ≥, µ, ⁿ) is fine;
//  - each entry's <Def> lives in the lesson matching `lessonId`, exactly once.

import type { TermeEntry } from "./glossaire-fmv";

export const RESEAUX_TERMES: TermeEntry[] = [
  // ── c00 · Boîte à outils ────────────────────────────────────────────────
  {
    id: "bit",
    label: { fr: "bit", en: "bit", es: "bit" },
    short: {
      fr: "La plus petite unité d'information : un 0 ou un 1. Les débits se mesurent en bits par seconde.",
      en: "The smallest unit of information: a 0 or a 1. Data rates are measured in bits per second.",
      es: "La unidad de información más pequeña: un 0 o un 1. Los caudales se miden en bits por segundo.",
    },
    lessonId: "cs-net-c00",
  },
  {
    id: "octet",
    label: { fr: "octet", en: "byte (octet)", es: "octeto (byte)" },
    short: {
      fr: "Groupe de 8 bits. Les tailles de messages et d'en-têtes se comptent en octets ; 1 octet = 8 bits.",
      en: "A group of 8 bits. Message and header sizes are counted in bytes; 1 byte = 8 bits.",
      es: "Grupo de 8 bits. Los tamaños de mensajes y cabeceras se cuentan en octetos; 1 octeto = 8 bits.",
    },
    lessonId: "cs-net-c00",
  },
  {
    id: "notation-binaire",
    label: { fr: "notation binaire", en: "binary notation", es: "notación binaria" },
    short: {
      fr: "Écriture d'un nombre en base 2, avec seulement des 0 et des 1 ; chaque position vaut une puissance de 2.",
      en: "Writing a number in base 2, using only 0s and 1s; each position is worth a power of 2.",
      es: "Escritura de un número en base 2, solo con 0 y 1; cada posición vale una potencia de 2.",
    },
    lessonId: "cs-net-c00",
  },
  {
    id: "notation-hexadecimale",
    label: { fr: "notation hexadécimale", en: "hexadecimal notation", es: "notación hexadecimal" },
    short: {
      fr: "Écriture en base 16 (chiffres 0-9 puis A-F) ; un chiffre hexa code exactement 4 bits, deux chiffres codent un octet.",
      en: "Base-16 writing (digits 0-9 then A-F); one hex digit encodes exactly 4 bits, two digits encode one byte.",
      es: "Escritura en base 16 (cifras 0-9 y A-F); una cifra hexa codifica exactamente 4 bits, dos cifras un octeto.",
    },
    lessonId: "cs-net-c00",
  },
  // ── c01 · Réseaux et commutation ────────────────────────────────────────
  {
    id: "reseau-informatique",
    label: { fr: "réseau informatique", en: "computer network", es: "red informática" },
    short: {
      fr: "Ensemble d'équipements autonomes interconnectés capables d'échanger de l'information.",
      en: "A set of interconnected autonomous machines able to exchange information.",
      es: "Conjunto de equipos autónomos interconectados capaces de intercambiar información.",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "topologie",
    label: { fr: "topologie", en: "topology", es: "topología" },
    short: {
      fr: "Forme du câblage (topologie physique) ou du parcours de l'information (topologie logique) : bus, anneau, étoile…",
      en: "Shape of the wiring (physical) or of the information flow (logical): bus, ring, star…",
      es: "Forma del cableado (física) o del recorrido de la información (lógica): bus, anillo, estrella…",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "commutation",
    label: { fr: "commutation", en: "switching", es: "conmutación" },
    short: {
      fr: "Fonction d'un nœud intermédiaire : aiguiller ce qui arrive sur une entrée vers la bonne sortie.",
      en: "What an intermediate node does: steer what arrives on one input toward the right output.",
      es: "Función de un nodo intermedio: dirigir lo que llega por una entrada hacia la salida correcta.",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "commutation-de-circuits",
    label: { fr: "commutation de circuits", en: "circuit switching", es: "conmutación de circuitos" },
    short: {
      fr: "Un chemin physique est réservé de bout en bout avant l'échange, puis libéré (modèle du téléphone).",
      en: "A physical path is reserved end to end before the exchange, then released (the telephone model).",
      es: "Se reserva un camino físico de extremo a extremo antes del intercambio y luego se libera (modelo telefónico).",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "commutation-de-messages",
    label: { fr: "commutation de messages", en: "message switching", es: "conmutación de mensajes" },
    short: {
      fr: "Le message entier est stocké puis retransmis de nœud en nœud, sans réservation de chemin.",
      en: "The whole message is stored then forwarded node by node, with no path reservation.",
      es: "El mensaje entero se almacena y se reenvía de nodo en nodo, sin reservar camino.",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "commutation-de-paquets",
    label: { fr: "commutation de paquets", en: "packet switching", es: "conmutación de paquetes" },
    short: {
      fr: "Le message est découpé en paquets envoyés indépendamment ; les nœuds les relaient dès réception complète.",
      en: "The message is cut into packets sent independently; nodes relay each one as soon as it is fully received.",
      es: "El mensaje se corta en paquetes enviados de forma independiente; los nodos los reenvían al recibirlos completos.",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "commutation-de-cellules",
    label: { fr: "commutation de cellules", en: "cell switching", es: "conmutación de celdas" },
    short: {
      fr: "Commutation de paquets à taille fixe et petite (cellules de 53 octets en ATM), pour des délais réguliers.",
      en: "Packet switching with small fixed-size units (53-byte ATM cells), for regular delays.",
      es: "Conmutación de paquetes de tamaño fijo y pequeño (celdas de 53 octetos en ATM), para retardos regulares.",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "store-and-forward",
    label: { fr: "store-and-forward", en: "store-and-forward", es: "store-and-forward" },
    short: {
      fr: "Un nœud attend d'avoir reçu la dernière unité en entier avant de commencer à la retransmettre.",
      en: "A node waits until it has received the whole unit before it starts retransmitting it.",
      es: "Un nodo espera a recibir la unidad completa antes de empezar a retransmitirla.",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "mode-connecte",
    label: { fr: "mode connecté", en: "connection-oriented mode", es: "modo conectado" },
    short: {
      fr: "Trois phases : établir la connexion, échanger, libérer. Les données suivent le chemin négocié.",
      en: "Three phases: establish the connection, exchange, release. Data follow the negotiated path.",
      es: "Tres fases: establecer la conexión, intercambiar, liberar. Los datos siguen el camino negociado.",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "mode-non-connecte",
    label: { fr: "mode non connecté", en: "connectionless mode", es: "modo no conectado" },
    short: {
      fr: "Chaque envoi est autonome et porte l'adresse complète du destinataire ; aucune connexion préalable.",
      en: "Each transmission stands alone and carries the full destination address; no prior connection.",
      es: "Cada envío es autónomo y lleva la dirección completa del destinatario; sin conexión previa.",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "circuit-virtuel",
    label: { fr: "circuit virtuel", en: "virtual circuit", es: "circuito virtual" },
    short: {
      fr: "Chemin marqué à l'ouverture d'une connexion : les paquets suivent tous cette voie logique, identifiée par une étiquette.",
      en: "Path marked when a connection opens: every packet follows this logical route, identified by a label.",
      es: "Camino marcado al abrir una conexión: todos los paquetes siguen esa vía lógica, identificada por una etiqueta.",
    },
    lessonId: "cs-net-c01",
  },
  {
    id: "datagramme",
    label: { fr: "datagramme", en: "datagram", es: "datagrama" },
    short: {
      fr: "Paquet routé indépendamment des autres, avec l'adresse complète du destinataire dans son en-tête.",
      en: "A packet routed independently of the others, carrying the full destination address in its header.",
      es: "Paquete encaminado con independencia de los demás, con la dirección completa del destinatario en su cabecera.",
    },
    lessonId: "cs-net-c01",
  },
  // ── c02 · Délais et débits ──────────────────────────────────────────────
  {
    id: "debit-binaire",
    label: { fr: "débit binaire", en: "bit rate", es: "caudal binario" },
    short: {
      fr: "Nombre de bits qu'un lien transmet par seconde (bit/s). Attention : ici k = 1000, pas 1024.",
      en: "Number of bits a link transmits per second (bit/s). Careful: here k = 1000, not 1024.",
      es: "Número de bits que un enlace transmite por segundo (bit/s). Ojo: aquí k = 1000, no 1024.",
    },
    lessonId: "cs-net-c02",
  },
  {
    id: "temps-de-transmission",
    label: { fr: "temps de transmission", en: "transmission time", es: "tiempo de transmisión" },
    short: {
      fr: "Temps pour pousser tous les bits sur le lien : taille divisée par débit. Il ne dépend pas de la distance.",
      en: "Time to push all the bits onto the link: size divided by rate. It does not depend on distance.",
      es: "Tiempo para empujar todos los bits al enlace: tamaño entre caudal. No depende de la distancia.",
    },
    lessonId: "cs-net-c02",
  },
  {
    id: "temps-de-propagation",
    label: { fr: "temps de propagation", en: "propagation delay", es: "tiempo de propagación" },
    short: {
      fr: "Temps de voyage d'un bit le long du lien : distance divisée par vitesse du signal. Il ne dépend pas du débit.",
      en: "Travel time of one bit along the link: distance divided by signal speed. It does not depend on the rate.",
      es: "Tiempo de viaje de un bit por el enlace: distancia entre velocidad de la señal. No depende del caudal.",
    },
    lessonId: "cs-net-c02",
  },
  {
    id: "temps-de-transfert",
    label: { fr: "temps de transfert", en: "transfer time", es: "tiempo de transferencia" },
    short: {
      fr: "Temps total entre le premier bit émis et le dernier bit reçu : transmission plus propagation, cumulées à chaque nœud traversé.",
      en: "Total time between the first bit sent and the last bit received: transmission plus propagation, accumulated at every hop.",
      es: "Tiempo total entre el primer bit emitido y el último recibido: transmisión más propagación, acumuladas en cada salto.",
    },
    lessonId: "cs-net-c02",
  },
  {
    id: "debit-effectif",
    label: { fr: "débit effectif", en: "effective throughput", es: "caudal efectivo" },
    short: {
      fr: "Quantité utile réellement transférée divisée par le temps total — jamais la moyenne des débits des liens.",
      en: "Useful data actually transferred divided by total time — never the average of the link rates.",
      es: "Datos útiles realmente transferidos divididos por el tiempo total; nunca la media de los caudales de los enlaces.",
    },
    lessonId: "cs-net-c02",
  },
  {
    id: "file-d-attente",
    label: { fr: "file d'attente", en: "queue", es: "cola de espera" },
    short: {
      fr: "Mémoire d'un nœud où patientent les unités en attendant que la ligne de sortie se libère (politique FIFO : premier arrivé, premier servi).",
      en: "Memory in a node where units wait for the output line to free up (FIFO policy: first come, first served).",
      es: "Memoria de un nodo donde esperan las unidades a que se libere la línea de salida (política FIFO: primero en llegar, primero servido).",
    },
    lessonId: "cs-net-c02",
  },
  // ── c03 · Couches et encapsulation ──────────────────────────────────────
  {
    id: "couche",
    label: { fr: "couche", en: "layer", es: "capa" },
    short: {
      fr: "Étage d'une architecture réseau : il rend un service à l'étage du dessus en utilisant celui du dessous.",
      en: "One level of a network architecture: it serves the level above by using the one below.",
      es: "Nivel de una arquitectura de red: sirve al nivel superior usando el inferior.",
    },
    lessonId: "cs-net-c03",
  },
  {
    id: "protocole",
    label: { fr: "protocole", en: "protocol", es: "protocolo" },
    short: {
      fr: "Règles de dialogue entre deux entités de même niveau sur deux machines : format des messages et comportement.",
      en: "Dialogue rules between two same-level entities on two machines: message formats and behaviour.",
      es: "Reglas de diálogo entre dos entidades del mismo nivel en dos máquinas: formato de mensajes y comportamiento.",
    },
    lessonId: "cs-net-c03",
  },
  {
    id: "service",
    label: { fr: "service", en: "service", es: "servicio" },
    short: {
      fr: "Ce qu'une couche offre à la couche supérieure, décrit par des primitives — indépendamment de comment elle le réalise.",
      en: "What a layer offers the layer above, described by primitives — independent of how it is achieved.",
      es: "Lo que una capa ofrece a la capa superior, descrito por primitivas, con independencia de cómo lo logra.",
    },
    lessonId: "cs-net-c03",
  },
  {
    id: "primitive-de-service",
    label: { fr: "primitive de service", en: "service primitive", es: "primitiva de servicio" },
    short: {
      fr: "Opération élémentaire d'un service : request, indication, response, confirmation.",
      en: "Elementary operation of a service: request, indication, response, confirmation.",
      es: "Operación elemental de un servicio: request, indication, response, confirmation.",
    },
    lessonId: "cs-net-c03",
  },
  {
    id: "pdu",
    label: { fr: "PDU", en: "PDU", es: "PDU" },
    short: {
      fr: "Protocol Data Unit : l'unité échangée entre deux entités de même niveau — l'en-tête de la couche plus les données reçues d'au-dessus.",
      en: "Protocol Data Unit: what two same-level entities exchange — the layer's header plus the data received from above.",
      es: "Protocol Data Unit: la unidad intercambiada entre dos entidades del mismo nivel — la cabecera de la capa más los datos recibidos de arriba.",
    },
    lessonId: "cs-net-c03",
  },
  {
    id: "sdu",
    label: { fr: "SDU", en: "SDU", es: "SDU" },
    short: {
      fr: "Service Data Unit : les données que la couche supérieure confie telles quelles à la couche du dessous.",
      en: "Service Data Unit: the data the upper layer hands down to be carried as-is.",
      es: "Service Data Unit: los datos que la capa superior entrega tal cual a la capa inferior.",
    },
    lessonId: "cs-net-c03",
  },
  {
    id: "encapsulation",
    label: { fr: "encapsulation", en: "encapsulation", es: "encapsulación" },
    short: {
      fr: "À la descente, chaque couche ajoute son en-tête devant les données de la couche du dessus ; à la remontée, chacune retire le sien.",
      en: "On the way down each layer adds its header in front of the upper layer's data; on the way up each removes its own.",
      es: "Al bajar, cada capa añade su cabecera delante de los datos de la capa superior; al subir, cada una retira la suya.",
    },
    lessonId: "cs-net-c03",
  },
  {
    id: "sap",
    label: { fr: "SAP", en: "SAP", es: "SAP" },
    short: {
      fr: "Service Access Point : la porte par laquelle une couche accède au service de la couche inférieure (exemple : un numéro de port).",
      en: "Service Access Point: the doorway through which a layer reaches the service below (example: a port number).",
      es: "Service Access Point: la puerta por la que una capa accede al servicio de la capa inferior (ejemplo: un número de puerto).",
    },
    lessonId: "cs-net-c03",
  },
  {
    id: "modele-osi",
    label: { fr: "modèle OSI", en: "OSI model", es: "modelo OSI" },
    short: {
      fr: "Modèle de référence à 7 couches (physique, liaison, réseau, transport, session, présentation, application).",
      en: "The 7-layer reference model (physical, data link, network, transport, session, presentation, application).",
      es: "Modelo de referencia de 7 capas (física, enlace, red, transporte, sesión, presentación, aplicación).",
    },
    lessonId: "cs-net-c03",
  },
  {
    id: "modele-tcp-ip",
    label: { fr: "modèle TCP/IP", en: "TCP/IP model", es: "modelo TCP/IP" },
    short: {
      fr: "Architecture réelle d'Internet en 4 couches : accès réseau, IP, transport (TCP/UDP), application.",
      en: "The Internet's actual 4-layer architecture: network access, IP, transport (TCP/UDP), application.",
      es: "Arquitectura real de Internet en 4 capas: acceso a red, IP, transporte (TCP/UDP), aplicación.",
    },
    lessonId: "cs-net-c03",
  },
  // ── c04 · Transmission physique ─────────────────────────────────────────
  {
    id: "signal",
    label: { fr: "signal", en: "signal", es: "señal" },
    short: {
      fr: "Grandeur physique (tension, lumière, onde) qui varie au cours du temps pour transporter les bits.",
      en: "A physical quantity (voltage, light, wave) varying over time to carry the bits.",
      es: "Magnitud física (tensión, luz, onda) que varía en el tiempo para transportar los bits.",
    },
    lessonId: "cs-net-c04",
  },
  {
    id: "codage-en-bande-de-base",
    label: { fr: "codage en bande de base", en: "baseband coding", es: "codificación en banda base" },
    short: {
      fr: "Transmettre les bits directement par des paliers de tension sur le câble, sans onde porteuse.",
      en: "Sending bits directly as voltage levels on the wire, with no carrier wave.",
      es: "Transmitir los bits directamente como niveles de tensión en el cable, sin onda portadora.",
    },
    lessonId: "cs-net-c04",
  },
  {
    id: "codage-nrz",
    label: { fr: "codage NRZ", en: "NRZ coding", es: "codificación NRZ" },
    short: {
      fr: "Non Return to Zero : un niveau haut pour 1, un niveau bas pour 0, maintenus pendant tout le temps bit.",
      en: "Non Return to Zero: a high level for 1, a low level for 0, held for the whole bit time.",
      es: "Non Return to Zero: nivel alto para 1, nivel bajo para 0, mantenidos todo el tiempo de bit.",
    },
    lessonId: "cs-net-c04",
  },
  {
    id: "codage-manchester",
    label: { fr: "codage Manchester", en: "Manchester coding", es: "codificación Manchester" },
    short: {
      fr: "Une transition au milieu de chaque bit (montante ou descendante selon le bit) : l'horloge voyage avec les données.",
      en: "A transition in the middle of every bit (rising or falling with the bit value): the clock travels with the data.",
      es: "Una transición en medio de cada bit (subida o bajada según el bit): el reloj viaja con los datos.",
    },
    lessonId: "cs-net-c04",
  },
  {
    id: "valence",
    label: { fr: "valence", en: "valence (number of levels)", es: "valencia" },
    short: {
      fr: "Nombre d'états distincts du signal ; avec V niveaux, chaque symbole transporte log2 de V bits.",
      en: "Number of distinct signal states; with V levels, each symbol carries log2 of V bits.",
      es: "Número de estados distintos de la señal; con V niveles, cada símbolo transporta log2 de V bits.",
    },
    lessonId: "cs-net-c04",
  },
  {
    id: "rapidite-de-modulation",
    label: { fr: "rapidité de modulation", en: "modulation rate (baud)", es: "rapidez de modulación" },
    short: {
      fr: "Nombre de symboles émis par seconde, en bauds : l'inverse de la durée d'un symbole.",
      en: "Symbols sent per second, in bauds: the inverse of one symbol's duration.",
      es: "Símbolos emitidos por segundo, en baudios: el inverso de la duración de un símbolo.",
    },
    lessonId: "cs-net-c04",
  },
  {
    id: "bande-passante",
    label: { fr: "bande passante", en: "bandwidth", es: "ancho de banda" },
    short: {
      fr: "Largeur de la plage de fréquences que le canal laisse passer, en hertz — elle borne le débit possible.",
      en: "Width of the frequency range the channel lets through, in hertz — it bounds the achievable rate.",
      es: "Anchura del rango de frecuencias que deja pasar el canal, en hercios; acota el caudal posible.",
    },
    lessonId: "cs-net-c04",
  },
  {
    id: "capacite-de-shannon",
    label: { fr: "capacité de Shannon", en: "Shannon capacity", es: "capacidad de Shannon" },
    short: {
      fr: "Débit maximal théorique d'un canal bruité : W × log2(1 + S/B), où S/B est le rapport signal sur bruit.",
      en: "Theoretical maximum rate of a noisy channel: W × log2(1 + S/N), where S/N is the signal-to-noise ratio.",
      es: "Caudal máximo teórico de un canal ruidoso: W × log2(1 + S/R), con S/R la relación señal-ruido.",
    },
    lessonId: "cs-net-c04",
  },
  {
    id: "echantillonnage",
    label: { fr: "échantillonnage", en: "sampling", es: "muestreo" },
    short: {
      fr: "Mesurer un signal analogique à intervalles réguliers pour le numériser (MIC : 8000 mesures de 8 bits par seconde).",
      en: "Measuring an analog signal at regular intervals to digitize it (PCM: 8000 8-bit samples per second).",
      es: "Medir una señal analógica a intervalos regulares para digitalizarla (MIC: 8000 muestras de 8 bits por segundo).",
    },
    lessonId: "cs-net-c04",
  },
  // ── c05 · Détection des erreurs ─────────────────────────────────────────
  {
    id: "bit-de-parite",
    label: { fr: "bit de parité", en: "parity bit", es: "bit de paridad" },
    short: {
      fr: "Bit ajouté pour rendre pair (ou impair) le nombre de 1 : il révèle toute erreur portant sur un nombre impair de bits.",
      en: "A bit added to make the count of 1s even (or odd): it exposes any error touching an odd number of bits.",
      es: "Bit añadido para que el número de unos sea par (o impar): revela todo error que afecte a un número impar de bits.",
    },
    lessonId: "cs-net-c05",
  },
  {
    id: "distance-de-hamming",
    label: { fr: "distance de Hamming", en: "Hamming distance", es: "distancia de Hamming" },
    short: {
      fr: "Nombre de bits qui diffèrent entre deux mots ; un code de distance d détecte d−1 erreurs et en corrige la moitié.",
      en: "Number of differing bits between two words; a distance-d code detects d−1 errors and corrects half as many.",
      es: "Número de bits distintos entre dos palabras; un código de distancia d detecta d−1 errores y corrige la mitad.",
    },
    lessonId: "cs-net-c05",
  },
  {
    id: "code-detecteur",
    label: { fr: "code détecteur", en: "error-detecting code", es: "código detector" },
    short: {
      fr: "Redondance calculée ajoutée au message pour que le récepteur puisse vérifier son intégrité.",
      en: "Computed redundancy added to a message so the receiver can check its integrity.",
      es: "Redundancia calculada añadida al mensaje para que el receptor verifique su integridad.",
    },
    lessonId: "cs-net-c05",
  },
  {
    id: "crc",
    label: { fr: "CRC", en: "CRC", es: "CRC" },
    short: {
      fr: "Contrôle par division polynomiale : le reste de la division du message par un polynôme générateur est joint à la trame.",
      en: "Check by polynomial division: the remainder of dividing the message by a generator polynomial is appended to the frame.",
      es: "Control por división polinómica: el resto de dividir el mensaje por un polinomio generador se añade a la trama.",
    },
    lessonId: "cs-net-c05",
  },
  {
    id: "polynome-generateur",
    label: { fr: "polynôme générateur", en: "generator polynomial", es: "polinomio generador" },
    short: {
      fr: "Polynôme convenu entre émetteur et récepteur qui sert de diviseur dans le calcul du CRC.",
      en: "The polynomial agreed by sender and receiver, used as the divisor in the CRC computation.",
      es: "Polinomio acordado entre emisor y receptor que sirve de divisor en el cálculo del CRC.",
    },
    lessonId: "cs-net-c05",
  },
  {
    id: "somme-de-controle",
    label: { fr: "somme de contrôle (checksum)", en: "checksum", es: "suma de control (checksum)" },
    short: {
      fr: "Addition en complément à 1 des mots de 16 bits du message ; plus faible qu'un CRC mais rapide à calculer en logiciel.",
      en: "One's-complement addition of the message's 16-bit words; weaker than a CRC but fast to compute in software.",
      es: "Suma en complemento a 1 de las palabras de 16 bits del mensaje; más débil que un CRC pero rápida en software.",
    },
    lessonId: "cs-net-c05",
  },
  // ── c06 · Liaison de données ────────────────────────────────────────────
  {
    id: "trame",
    label: { fr: "trame", en: "frame", es: "trama" },
    short: {
      fr: "Unité de la couche liaison : un bloc de bits délimité, avec en-tête, données et champ de contrôle d'erreur.",
      en: "The data-link unit: a delimited block of bits with header, data, and an error-check field.",
      es: "Unidad de la capa de enlace: bloque de bits delimitado, con cabecera, datos y campo de control de error.",
    },
    lessonId: "cs-net-c06",
  },
  {
    id: "acquittement",
    label: { fr: "acquittement", en: "acknowledgement", es: "acuse de recibo" },
    short: {
      fr: "Message court du récepteur confirmant ce qu'il a bien reçu ; l'absence d'acquittement déclenche une retransmission.",
      en: "A short receiver message confirming what arrived; a missing acknowledgement triggers retransmission.",
      es: "Mensaje corto del receptor confirmando lo recibido; su ausencia provoca una retransmisión.",
    },
    lessonId: "cs-net-c06",
  },
  {
    id: "temporisateur",
    label: { fr: "temporisateur", en: "timer", es: "temporizador" },
    short: {
      fr: "Compte à rebours armé à l'émission : s'il expire avant l'acquittement, l'émetteur retransmet.",
      en: "A countdown armed at transmission: if it expires before the acknowledgement, the sender retransmits.",
      es: "Cuenta atrás armada al emitir: si expira antes del acuse, el emisor retransmite.",
    },
    lessonId: "cs-net-c06",
  },
  {
    id: "arq",
    label: { fr: "ARQ", en: "ARQ", es: "ARQ" },
    short: {
      fr: "Automatic Repeat reQuest : fiabiliser une liaison par numérotation, acquittements, temporisateurs et retransmissions.",
      en: "Automatic Repeat reQuest: making a link reliable with numbering, acknowledgements, timers, and retransmissions.",
      es: "Automatic Repeat reQuest: fiabilizar un enlace con numeración, acuses, temporizadores y retransmisiones.",
    },
    lessonId: "cs-net-c06",
  },
  {
    id: "fenetre-d-anticipation",
    label: { fr: "fenêtre d'anticipation", en: "sliding window (link layer)", es: "ventana de anticipación" },
    short: {
      fr: "Nombre maximal de trames qu'un émetteur peut envoyer sans attendre d'acquittement.",
      en: "Maximum number of frames a sender may transmit before it must wait for an acknowledgement.",
      es: "Número máximo de tramas que un emisor puede enviar sin esperar acuse.",
    },
    lessonId: "cs-net-c06",
  },
  {
    id: "rejet-simple",
    label: { fr: "rejet simple (REJ)", en: "go-back-N reject (REJ)", es: "rechazo simple (REJ)" },
    short: {
      fr: "Reprise sur erreur où le récepteur redemande la trame fautive et tout ce qui la suit (Go-Back-N).",
      en: "Error recovery where the receiver asks again for the bad frame and everything after it (Go-Back-N).",
      es: "Recuperación en la que el receptor vuelve a pedir la trama errónea y todo lo que la sigue (Go-Back-N).",
    },
    lessonId: "cs-net-c06",
  },
  {
    id: "rejet-selectif",
    label: { fr: "rejet sélectif (SREJ)", en: "selective reject (SREJ)", es: "rechazo selectivo (SREJ)" },
    short: {
      fr: "Reprise sur erreur où seule la trame fautive est retransmise ; le récepteur garde les suivantes en mémoire.",
      en: "Error recovery where only the bad frame is resent; the receiver buffers the later ones.",
      es: "Recuperación en la que solo se retransmite la trama errónea; el receptor guarda las siguientes.",
    },
    lessonId: "cs-net-c06",
  },
  {
    id: "piggybacking",
    label: { fr: "piggybacking", en: "piggybacking", es: "piggybacking" },
    short: {
      fr: "Glisser l'acquittement dans l'en-tête d'une trame de données qui partait de toute façon dans l'autre sens.",
      en: "Slipping the acknowledgement into the header of a data frame already going the other way.",
      es: "Colar el acuse en la cabecera de una trama de datos que ya viajaba en sentido contrario.",
    },
    lessonId: "cs-net-c06",
  },
  {
    id: "transparence",
    label: { fr: "transparence (bit stuffing)", en: "transparency (bit stuffing)", es: "transparencia (bit stuffing)" },
    short: {
      fr: "Insérer un 0 après cinq 1 consécutifs des données pour qu'aucune suite ne soit confondue avec le fanion 01111110.",
      en: "Inserting a 0 after five consecutive 1s of data so no sequence can be mistaken for the 01111110 flag.",
      es: "Insertar un 0 tras cinco unos consecutivos de datos para que ninguna secuencia se confunda con la bandera 01111110.",
    },
    lessonId: "cs-net-c06",
  },
  {
    id: "hdlc",
    label: { fr: "HDLC", en: "HDLC", es: "HDLC" },
    short: {
      fr: "Protocole de liaison normalisé : trames I (données numérotées), S (supervision : RR, REJ, SREJ) et U (gestion : SABM, UA).",
      en: "Standardized link protocol: I frames (numbered data), S frames (supervision: RR, REJ, SREJ), U frames (management: SABM, UA).",
      es: "Protocolo de enlace normalizado: tramas I (datos numerados), S (supervisión: RR, REJ, SREJ) y U (gestión: SABM, UA).",
    },
    lessonId: "cs-net-c06",
  },
  // ── c07 · Réseaux locaux ────────────────────────────────────────────────
  {
    id: "reseau-local",
    label: { fr: "réseau local (LAN)", en: "local area network (LAN)", es: "red local (LAN)" },
    short: {
      fr: "Réseau d'un bâtiment ou d'un campus (jusqu'à quelques kilomètres), à support souvent partagé entre stations.",
      en: "A building- or campus-scale network (up to a few kilometres), often with a medium shared by the stations.",
      es: "Red de un edificio o campus (hasta unos kilómetros), a menudo con un medio compartido entre estaciones.",
    },
    lessonId: "cs-net-c07",
  },
  {
    id: "acces-multiple",
    label: { fr: "accès multiple", en: "multiple access", es: "acceso múltiple" },
    short: {
      fr: "Problème d'un support partagé : décider qui a le droit d'émettre, et quand, pour éviter que tout le monde parle en même temps.",
      en: "The shared-medium problem: deciding who may transmit, and when, so everyone does not talk at once.",
      es: "El problema del medio compartido: decidir quién puede emitir y cuándo, para que no hablen todos a la vez.",
    },
    lessonId: "cs-net-c07",
  },
  {
    id: "csma-cd",
    label: { fr: "CSMA/CD", en: "CSMA/CD", es: "CSMA/CD" },
    short: {
      fr: "Écouter avant d'émettre, détecter les collisions pendant l'émission, puis réessayer après un délai aléatoire.",
      en: "Listen before transmitting, detect collisions while transmitting, then retry after a random delay.",
      es: "Escuchar antes de emitir, detectar colisiones durante la emisión y reintentar tras un retardo aleatorio.",
    },
    lessonId: "cs-net-c07",
  },
  {
    id: "collision",
    label: { fr: "collision", en: "collision", es: "colisión" },
    short: {
      fr: "Superposition de deux émissions sur le support partagé : les deux trames sont détruites et devront être réémises.",
      en: "Two transmissions overlapping on the shared medium: both frames are destroyed and must be resent.",
      es: "Superposición de dos emisiones en el medio compartido: ambas tramas se destruyen y deberán reenviarse.",
    },
    lessonId: "cs-net-c07",
  },
  {
    id: "trame-ethernet",
    label: { fr: "trame Ethernet", en: "Ethernet frame", es: "trama Ethernet" },
    short: {
      fr: "Préambule + fanion, adresses destination et source (6 octets), longueur, données (46 à 1500 octets, bourrage inclus), FCS.",
      en: "Preamble + start delimiter, destination and source addresses (6 bytes), length, data (46 to 1500 bytes, padding included), FCS.",
      es: "Preámbulo + delimitador, direcciones destino y origen (6 octetos), longitud, datos (46 a 1500 octetos, relleno incluido), FCS.",
    },
    lessonId: "cs-net-c07",
  },
  {
    id: "adresse-mac",
    label: { fr: "adresse MAC", en: "MAC address", es: "dirección MAC" },
    short: {
      fr: "Identifiant de 6 octets gravé dans la carte réseau, unique au monde, utilisé par les trames du réseau local.",
      en: "A 6-byte identifier burned into the network card, globally unique, used by local-network frames.",
      es: "Identificador de 6 octetos grabado en la tarjeta de red, único en el mundo, usado por las tramas de la red local.",
    },
    lessonId: "cs-net-c07",
  },
  {
    id: "backoff",
    label: { fr: "backoff (repli aléatoire)", en: "backoff", es: "backoff (retroceso aleatorio)" },
    short: {
      fr: "Après une collision, chaque station tire un délai aléatoire parmi un nombre de tranches qui double à chaque échec.",
      en: "After a collision each station draws a random delay from a slot count that doubles after every failure.",
      es: "Tras una colisión, cada estación sortea un retardo aleatorio entre un número de ranuras que se duplica en cada fallo.",
    },
    lessonId: "cs-net-c07",
  },
  {
    id: "anneau-a-jeton",
    label: { fr: "anneau à jeton", en: "token ring", es: "anillo con testigo" },
    short: {
      fr: "Les stations forment un anneau et seule celle qui détient le jeton émet : aucune collision, temps d'accès borné.",
      en: "Stations form a ring and only the token holder transmits: no collisions, bounded access time.",
      es: "Las estaciones forman un anillo y solo emite la que posee el testigo: sin colisiones, tiempo de acceso acotado.",
    },
    lessonId: "cs-net-c07",
  },
  // ── c08 · Adressage IP ──────────────────────────────────────────────────
  {
    id: "adresse-ip",
    label: { fr: "adresse IP", en: "IP address", es: "dirección IP" },
    short: {
      fr: "Numéro de 32 bits (notation pointée a.b.c.d) identifiant une interface : une partie réseau suivie d'une partie machine.",
      en: "A 32-bit number (dotted notation a.b.c.d) identifying an interface: a network part followed by a host part.",
      es: "Número de 32 bits (notación punteada a.b.c.d) que identifica una interfaz: parte de red seguida de parte de máquina.",
    },
    lessonId: "cs-net-c08",
  },
  {
    id: "classe-d-adresses",
    label: { fr: "classe d'adresses", en: "address class", es: "clase de direcciones" },
    short: {
      fr: "Découpage historique : classe A (préfixe 0, /8), B (10, /16), C (110, /24), D multicast, E réservée.",
      en: "The historical split: class A (prefix 0, /8), B (10, /16), C (110, /24), D multicast, E reserved.",
      es: "División histórica: clase A (prefijo 0, /8), B (10, /16), C (110, /24), D multidifusión, E reservada.",
    },
    lessonId: "cs-net-c08",
  },
  {
    id: "masque",
    label: { fr: "masque de sous-réseau", en: "subnet mask", es: "máscara de subred" },
    short: {
      fr: "Mot de 32 bits : des 1 sur la partie réseau et sous-réseau, des 0 sur la partie machine ; adresse ET masque = adresse du réseau.",
      en: "A 32-bit word: 1s over the network and subnet part, 0s over the host part; address AND mask = network address.",
      es: "Palabra de 32 bits: unos en la parte de red y subred, ceros en la de máquina; dirección AND máscara = dirección de red.",
    },
    lessonId: "cs-net-c08",
  },
  {
    id: "sous-reseau",
    label: { fr: "sous-réseau", en: "subnet", es: "subred" },
    short: {
      fr: "Subdivision interne d'un site : des bits pris sur la partie machine identifient le sous-réseau, invisible de l'extérieur.",
      en: "An internal subdivision of a site: bits taken from the host part identify the subnet, invisible from outside.",
      es: "Subdivisión interna de un sitio: bits tomados de la parte de máquina identifican la subred, invisible desde fuera.",
    },
    lessonId: "cs-net-c08",
  },
  {
    id: "adresse-de-reseau",
    label: { fr: "adresse de réseau", en: "network address", es: "dirección de red" },
    short: {
      fr: "L'adresse dont la partie machine est toute à 0 : elle désigne le réseau lui-même et n'est jamais donnée à une machine.",
      en: "The address whose host part is all 0s: it names the network itself and is never assigned to a host.",
      es: "La dirección con la parte de máquina toda a 0: designa la red misma y nunca se asigna a una máquina.",
    },
    lessonId: "cs-net-c08",
  },
  {
    id: "adresse-de-diffusion",
    label: { fr: "adresse de diffusion", en: "broadcast address", es: "dirección de difusión" },
    short: {
      fr: "L'adresse dont la partie machine est toute à 1 : un envoi vers elle atteint toutes les machines du sous-réseau.",
      en: "The address whose host part is all 1s: sending to it reaches every host of the subnet.",
      es: "La dirección con la parte de máquina toda a 1: un envío a ella alcanza todas las máquinas de la subred.",
    },
    lessonId: "cs-net-c08",
  },
  {
    id: "cidr",
    label: { fr: "CIDR", en: "CIDR", es: "CIDR" },
    short: {
      fr: "Adressage sans classes : un préfixe de longueur libre, noté /n, remplace les classes et permet d'agréger les routes.",
      en: "Classless addressing: a free-length prefix written /n replaces the classes and lets routes aggregate.",
      es: "Direccionamiento sin clases: un prefijo de longitud libre, escrito /n, sustituye a las clases y permite agregar rutas.",
    },
    lessonId: "cs-net-c08",
  },
  {
    id: "adresse-privee",
    label: { fr: "adresse privée", en: "private address", es: "dirección privada" },
    short: {
      fr: "Plages réservées à un usage interne (10.0.0.0/8, 172.16-31, 192.168.x) : jamais routées sur l'Internet public.",
      en: "Ranges reserved for internal use (10.0.0.0/8, 172.16-31, 192.168.x): never routed on the public Internet.",
      es: "Rangos reservados a uso interno (10.0.0.0/8, 172.16-31, 192.168.x): nunca se enrutan en la Internet pública.",
    },
    lessonId: "cs-net-c08",
  },
  {
    id: "agregation",
    label: { fr: "agrégation de routes", en: "route aggregation", es: "agregación de rutas" },
    short: {
      fr: "Résumer un bloc de préfixes contigus par un préfixe plus court unique (supernetting), pour raccourcir les tables.",
      en: "Summarizing a block of contiguous prefixes by one shorter prefix (supernetting), to shrink routing tables.",
      es: "Resumir un bloque de prefijos contiguos con un único prefijo más corto (supernetting), para acortar las tablas.",
    },
    lessonId: "cs-net-c08",
  },
  {
    id: "adresse-ipv6",
    label: { fr: "adresse IPv6", en: "IPv6 address", es: "dirección IPv6" },
    short: {
      fr: "Adresse de 128 bits en 8 groupes hexadécimaux ; les zéros se compressent (::), et ::ffff:a.b.c.d plonge une adresse IPv4.",
      en: "A 128-bit address as 8 hexadecimal groups; zeros compress (::), and ::ffff:a.b.c.d embeds an IPv4 address.",
      es: "Dirección de 128 bits en 8 grupos hexadecimales; los ceros se comprimen (::), y ::ffff:a.b.c.d incrusta una IPv4.",
    },
    lessonId: "cs-net-c08",
  },
  // ── c09 · Datagramme IP ─────────────────────────────────────────────────
  {
    id: "datagramme-ip",
    label: { fr: "datagramme IP", en: "IP datagram", es: "datagrama IP" },
    short: {
      fr: "L'unité du protocole IP : en-tête de 20 octets minimum (version, longueurs, identification, drapeaux, TTL, protocole, checksum, adresses) plus les données.",
      en: "The IP protocol's unit: a header of at least 20 bytes (version, lengths, identification, flags, TTL, protocol, checksum, addresses) plus the data.",
      es: "La unidad del protocolo IP: cabecera de al menos 20 octetos (versión, longitudes, identificación, banderas, TTL, protocolo, checksum, direcciones) más los datos.",
    },
    lessonId: "cs-net-c09",
  },
  {
    id: "mtu",
    label: { fr: "MTU", en: "MTU", es: "MTU" },
    short: {
      fr: "Maximum Transfer Unit : la plus grande charge utile qu'une trame du réseau traversé peut emporter (1500 octets sur Ethernet).",
      en: "Maximum Transfer Unit: the largest payload a frame of the crossed network can carry (1500 bytes on Ethernet).",
      es: "Maximum Transfer Unit: la mayor carga útil que puede llevar una trama de la red atravesada (1500 octetos en Ethernet).",
    },
    lessonId: "cs-net-c09",
  },
  {
    id: "fragmentation",
    label: { fr: "fragmentation", en: "fragmentation", es: "fragmentación" },
    short: {
      fr: "Découpe d'un datagramme trop grand pour la MTU en fragments (données multiples de 8 octets sauf le dernier), réassemblés seulement à destination.",
      en: "Cutting a datagram too big for the MTU into fragments (data a multiple of 8 bytes except the last), reassembled only at the destination.",
      es: "Corte de un datagrama demasiado grande para la MTU en fragmentos (datos múltiplos de 8 octetos salvo el último), reensamblados solo en destino.",
    },
    lessonId: "cs-net-c09",
  },
  {
    id: "decalage-de-fragment",
    label: { fr: "décalage de fragment", en: "fragment offset", es: "desplazamiento de fragmento" },
    short: {
      fr: "Position des données du fragment dans le datagramme d'origine, exprimée en unités de 8 octets.",
      en: "Position of the fragment's data within the original datagram, in units of 8 bytes.",
      es: "Posición de los datos del fragmento en el datagrama original, en unidades de 8 octetos.",
    },
    lessonId: "cs-net-c09",
  },
  {
    id: "ttl",
    label: { fr: "TTL", en: "TTL", es: "TTL" },
    short: {
      fr: "Time To Live : compteur décrémenté par chaque routeur ; à zéro le datagramme est détruit et un message ICMP est renvoyé.",
      en: "Time To Live: a counter decremented by every router; at zero the datagram is destroyed and an ICMP message is returned.",
      es: "Time To Live: contador decrementado por cada router; a cero el datagrama se destruye y se devuelve un mensaje ICMP.",
    },
    lessonId: "cs-net-c09",
  },
  {
    id: "arp",
    label: { fr: "ARP", en: "ARP", es: "ARP" },
    short: {
      fr: "Address Resolution Protocol : requête diffusée « qui a cette adresse IP ? », réponse unicast avec l'adresse MAC, résultat mis en cache.",
      en: "Address Resolution Protocol: a broadcast asking “who has this IP address?”, a unicast reply with the MAC address, cached afterwards.",
      es: "Address Resolution Protocol: difusión «¿quién tiene esta IP?», respuesta unicast con la dirección MAC, guardada en caché.",
    },
    lessonId: "cs-net-c09",
  },
  {
    id: "icmp",
    label: { fr: "ICMP", en: "ICMP", es: "ICMP" },
    short: {
      fr: "Protocole de contrôle d'IP : messages d'erreur (destination inaccessible, TTL expiré) et de test (écho), transportés dans IP.",
      en: "IP's control protocol: error messages (destination unreachable, TTL expired) and probes (echo), carried inside IP.",
      es: "Protocolo de control de IP: mensajes de error (destino inaccesible, TTL expirado) y de prueba (eco), transportados en IP.",
    },
    lessonId: "cs-net-c09",
  },
  {
    id: "ping",
    label: { fr: "ping", en: "ping", es: "ping" },
    short: {
      fr: "Outil qui envoie un écho ICMP (type 8) et mesure l'aller-retour grâce à la réponse (type 0).",
      en: "Tool that sends an ICMP echo request (type 8) and times the round trip via the reply (type 0).",
      es: "Herramienta que envía un eco ICMP (tipo 8) y mide la ida y vuelta con la respuesta (tipo 0).",
    },
    lessonId: "cs-net-c09",
  },
  {
    id: "traceroute",
    label: { fr: "traceroute", en: "traceroute", es: "traceroute" },
    short: {
      fr: "Outil qui découvre les routeurs du chemin en envoyant des paquets à TTL croissant : chaque routeur qui détruit répond en ICMP.",
      en: "Tool that discovers the routers on a path by sending packets with growing TTL: each router that kills one answers in ICMP.",
      es: "Herramienta que descubre los routers del camino enviando paquetes con TTL creciente: cada router que destruye responde en ICMP.",
    },
    lessonId: "cs-net-c09",
  },
  // ── c10 · Routage ───────────────────────────────────────────────────────
  {
    id: "acheminement",
    label: { fr: "acheminement (forwarding)", en: "forwarding", es: "encaminamiento (forwarding)" },
    short: {
      fr: "Le geste local et rapide d'un routeur : consulter sa table et pousser le paquet vers le prochain saut.",
      en: "A router's fast local gesture: look up the table and push the packet to the next hop.",
      es: "El gesto local y rápido de un router: consultar su tabla y empujar el paquete hacia el siguiente salto.",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "table-de-routage",
    label: { fr: "table de routage", en: "routing table", es: "tabla de enrutamiento" },
    short: {
      fr: "Table (destination, masque, prochain saut, interface) qui dit vers où relayer chaque préfixe ; entretenue à la main ou par un protocole.",
      en: "The (destination, mask, next hop, interface) table saying where to relay each prefix; maintained by hand or by a protocol.",
      es: "Tabla (destino, máscara, siguiente salto, interfaz) que dice hacia dónde reenviar cada prefijo; mantenida a mano o por un protocolo.",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "plus-long-prefixe",
    label: { fr: "règle du plus long préfixe", en: "longest-prefix match", es: "prefijo más largo" },
    short: {
      fr: "Quand plusieurs lignes de la table correspondent, le routeur choisit celle dont le préfixe (masque) est le plus long.",
      en: "When several table rows match, the router picks the one with the longest prefix (mask).",
      es: "Cuando varias filas de la tabla coinciden, el router elige la de prefijo (máscara) más largo.",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "route-par-defaut",
    label: { fr: "route par défaut", en: "default route", es: "ruta por defecto" },
    short: {
      fr: "L'entrée 0.0.0.0 : le prochain saut utilisé quand aucune autre ligne ne correspond à la destination.",
      en: "The 0.0.0.0 entry: the next hop used when no other row matches the destination.",
      es: "La entrada 0.0.0.0: el siguiente salto usado cuando ninguna otra fila coincide con el destino.",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "remise-directe",
    label: { fr: "remise directe", en: "direct delivery", es: "entrega directa" },
    short: {
      fr: "Livraison sans routeur, quand destinataire et émetteur partagent le même préfixe réseau ; sinon la remise est indirecte, via une passerelle.",
      en: "Delivery without a router, when sender and destination share the same network prefix; otherwise delivery is indirect, via a gateway.",
      es: "Entrega sin router, cuando emisor y destino comparten el mismo prefijo de red; si no, la entrega es indirecta, vía una pasarela.",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "vecteur-de-distances",
    label: { fr: "routage à vecteurs de distances", en: "distance-vector routing", es: "enrutamiento por vector de distancias" },
    short: {
      fr: "Chaque routeur n'annonce qu'à ses voisins ses distances vers chaque destination ; on met à jour par « coût du voisin + coût du lien ».",
      en: "Each router announces only to its neighbours its distances to every destination; updates take “neighbour's cost + link cost”.",
      es: "Cada router anuncia solo a sus vecinos sus distancias a cada destino; se actualiza con «coste del vecino + coste del enlace».",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "etat-de-liens",
    label: { fr: "routage à état de liens", en: "link-state routing", es: "enrutamiento por estado de enlaces" },
    short: {
      fr: "Chaque routeur diffuse à tout le réseau l'état de ses liens (LSP) ; chacun reconstruit la carte complète et y exécute Dijkstra.",
      en: "Each router floods the state of its links (LSP) to the whole network; everyone rebuilds the full map and runs Dijkstra on it.",
      es: "Cada router difunde a toda la red el estado de sus enlaces (LSP); cada uno reconstruye el mapa completo y ejecuta Dijkstra.",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "inondation",
    label: { fr: "inondation", en: "flooding", es: "inundación" },
    short: {
      fr: "Diffusion où chaque nœud réémet le paquet reçu sur toutes ses lignes sauf celle d'arrivée, avec numérotation contre les doublons.",
      en: "Broadcast where each node re-emits a received packet on every line except the incoming one, numbered against duplicates.",
      es: "Difusión en la que cada nodo reemite el paquete recibido por todas sus líneas salvo la de llegada, numerado contra duplicados.",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "algorithme-de-dijkstra",
    label: { fr: "algorithme de Dijkstra", en: "Dijkstra's algorithm", es: "algoritmo de Dijkstra" },
    short: {
      fr: "Calcul des plus courts chemins depuis une source : étiquettes (coût, via) provisoires, la plus petite devient permanente à chaque tour.",
      en: "Shortest paths from a source: provisional (cost, via) labels, the smallest becoming permanent at each round.",
      es: "Caminos más cortos desde una fuente: etiquetas provisionales (coste, vía); la menor se vuelve permanente en cada vuelta.",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "comptage-a-l-infini",
    label: { fr: "comptage à l'infini", en: "count to infinity", es: "conteo al infinito" },
    short: {
      fr: "Pathologie des vecteurs de distances après une panne : deux routeurs se renvoient une route morte en gonflant son coût de 1 à chaque échange.",
      en: "Distance-vector pathology after a failure: two routers bounce a dead route between them, inflating its cost by 1 per exchange.",
      es: "Patología del vector de distancias tras una avería: dos routers se devuelven una ruta muerta inflando su coste de 1 en 1.",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "horizon-partage",
    label: { fr: "horizon partagé", en: "split horizon", es: "horizonte dividido" },
    short: {
      fr: "Ne jamais annoncer une route sur le lien par lequel on l'a apprise ; avec antidote, on l'annonce à coût infini (poisoned reverse).",
      en: "Never advertise a route on the link it was learned from; with poisoned reverse it is advertised there at infinite cost.",
      es: "No anunciar nunca una ruta por el enlace del que se aprendió; con antídoto se anuncia allí con coste infinito (poisoned reverse).",
    },
    lessonId: "cs-net-c10",
  },
  {
    id: "systeme-autonome",
    label: { fr: "système autonome (AS)", en: "autonomous system (AS)", es: "sistema autónomo (AS)" },
    short: {
      fr: "Domaine sous une même autorité administrative ; à l'intérieur un IGP (RIP, OSPF), entre AS un EGP (BGP).",
      en: "A domain under one administrative authority; inside runs an IGP (RIP, OSPF), between ASes an EGP (BGP).",
      es: "Dominio bajo una misma autoridad administrativa; dentro corre un IGP (RIP, OSPF), entre AS un EGP (BGP).",
    },
    lessonId: "cs-net-c10",
  },
  // ── c11 · Transport et TCP ──────────────────────────────────────────────
  {
    id: "port",
    label: { fr: "port", en: "port", es: "puerto" },
    short: {
      fr: "Numéro de 16 bits qui identifie une application sur une machine ; 0-1023 sont réservés aux services connus (80 HTTP, 53 DNS).",
      en: "A 16-bit number identifying an application on a machine; 0-1023 are reserved for well-known services (80 HTTP, 53 DNS).",
      es: "Número de 16 bits que identifica una aplicación en una máquina; 0-1023 se reservan a servicios conocidos (80 HTTP, 53 DNS).",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "multiplexage",
    label: { fr: "(dé)multiplexage", en: "(de)multiplexing", es: "(de)multiplexación" },
    short: {
      fr: "Partager la couche réseau entre plusieurs applications à l'envoi, puis redistribuer chaque segment au bon processus grâce aux ports.",
      en: "Sharing the network layer among applications when sending, then handing each segment to the right process via the ports.",
      es: "Compartir la capa de red entre aplicaciones al enviar, y repartir cada segmento al proceso correcto gracias a los puertos.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "socket",
    label: { fr: "socket", en: "socket", es: "socket" },
    short: {
      fr: "Extrémité de communication (adresse IP, port) ; une connexion TCP est identifiée par le quadruplet des deux sockets.",
      en: "A communication endpoint (IP address, port); a TCP connection is identified by the quadruple of both sockets.",
      es: "Extremo de comunicación (dirección IP, puerto); una conexión TCP se identifica por el cuádruple de ambos sockets.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "udp",
    label: { fr: "UDP", en: "UDP", es: "UDP" },
    short: {
      fr: "Transport minimal : multiplexage par ports et checksum optionnel, sans connexion, sans fiabilité, sans contrôle de flux.",
      en: "Minimal transport: port multiplexing and an optional checksum, with no connection, reliability, or flow control.",
      es: "Transporte mínimo: multiplexación por puertos y checksum opcional, sin conexión, sin fiabilidad, sin control de flujo.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "pseudo-en-tete",
    label: { fr: "pseudo-en-tête", en: "pseudo-header", es: "pseudocabecera" },
    short: {
      fr: "Bloc fictif (adresses IP, protocole, longueur) préfixé au segment pour le calcul du checksum : il lie le segment à ses adresses.",
      en: "A fictitious block (IP addresses, protocol, length) prefixed to the segment for the checksum: it ties the segment to its addresses.",
      es: "Bloque ficticio (direcciones IP, protocolo, longitud) antepuesto al segmento para el checksum: liga el segmento a sus direcciones.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "tcp",
    label: { fr: "TCP", en: "TCP", es: "TCP" },
    short: {
      fr: "Transport fiable en mode connecté : flux d'octets ordonné, contrôle d'erreur, de flux et de congestion, point à point full duplex.",
      en: "Reliable connection-oriented transport: ordered byte stream, error, flow, and congestion control, point-to-point full duplex.",
      es: "Transporte fiable en modo conectado: flujo de octetos ordenado, control de errores, de flujo y de congestión, punto a punto full duplex.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "segment-tcp",
    label: { fr: "segment TCP", en: "TCP segment", es: "segmento TCP" },
    short: {
      fr: "Unité de TCP : ports, numéro de séquence, numéro d'acquittement, drapeaux (SYN, ACK, FIN…), fenêtre, checksum, options.",
      en: "TCP's unit: ports, sequence number, acknowledgement number, flags (SYN, ACK, FIN…), window, checksum, options.",
      es: "Unidad de TCP: puertos, número de secuencia, número de acuse, banderas (SYN, ACK, FIN…), ventana, checksum, opciones.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "numero-de-sequence",
    label: { fr: "numéro de séquence", en: "sequence number", es: "número de secuencia" },
    short: {
      fr: "Numéro du premier octet de données du segment dans le flux : TCP numérote les octets, pas les segments.",
      en: "The number of the segment's first data byte in the stream: TCP numbers bytes, not segments.",
      es: "Número del primer octeto de datos del segmento en el flujo: TCP numera octetos, no segmentos.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "acquittement-cumulatif",
    label: { fr: "acquittement cumulatif", en: "cumulative acknowledgement", es: "acuse acumulativo" },
    short: {
      fr: "Le numéro d'acquittement désigne le prochain octet attendu : tout ce qui précède est confirmé d'un coup.",
      en: "The acknowledgement number names the next byte expected: everything before it is confirmed at once.",
      es: "El número de acuse designa el siguiente octeto esperado: todo lo anterior queda confirmado de una vez.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "ouverture-en-trois-temps",
    label: { fr: "ouverture en trois temps", en: "three-way handshake", es: "apertura en tres fases" },
    short: {
      fr: "SYN, puis SYN+ACK, puis ACK : chaque camp choisit son numéro initial et acquitte celui de l'autre avant toute donnée.",
      en: "SYN, then SYN+ACK, then ACK: each side picks its initial number and acknowledges the other's before any data.",
      es: "SYN, luego SYN+ACK, luego ACK: cada lado elige su número inicial y acusa el del otro antes de cualquier dato.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "mss",
    label: { fr: "MSS", en: "MSS", es: "MSS" },
    short: {
      fr: "Maximum Segment Size : la plus grande charge de données d'un segment, typiquement MTU moins 40 octets d'en-têtes IP et TCP.",
      en: "Maximum Segment Size: the largest data load of a segment, typically the MTU minus 40 bytes of IP and TCP headers.",
      es: "Maximum Segment Size: la mayor carga de datos de un segmento, típicamente la MTU menos 40 octetos de cabeceras IP y TCP.",
    },
    lessonId: "cs-net-c11",
  },
  {
    id: "isn",
    label: { fr: "ISN", en: "ISN", es: "ISN" },
    short: {
      fr: "Initial Sequence Number : numéro de départ tiré d'une horloge (pas de zéro !) pour que les segments d'anciennes connexions ne soient pas confondus.",
      en: "Initial Sequence Number: a starting number drawn from a clock (never zero!) so segments of old connections cannot be confused.",
      es: "Initial Sequence Number: número inicial sacado de un reloj (¡nunca cero!) para no confundir segmentos de conexiones antiguas.",
    },
    lessonId: "cs-net-c11",
  },
  // ── c12 · Fenêtres et fiabilité TCP ─────────────────────────────────────
  {
    id: "fenetre-glissante",
    label: { fr: "fenêtre glissante", en: "sliding window (TCP)", es: "ventana deslizante" },
    short: {
      fr: "Plage d'octets que TCP peut avoir en vol sans acquittement ; elle glisse vers la droite à mesure que les ACK arrivent.",
      en: "The range of bytes TCP may have in flight unacknowledged; it slides right as ACKs arrive.",
      es: "Rango de octetos que TCP puede tener en vuelo sin acuse; se desliza a la derecha según llegan los ACK.",
    },
    lessonId: "cs-net-c12",
  },
  {
    id: "controle-de-flux",
    label: { fr: "contrôle de flux", en: "flow control", es: "control de flujo" },
    short: {
      fr: "Empêcher l'émetteur de noyer le récepteur : la fenêtre annoncée dit combien d'octets le récepteur peut encore accueillir.",
      en: "Keeping the sender from drowning the receiver: the advertised window says how many bytes the receiver can still take.",
      es: "Evitar que el emisor ahogue al receptor: la ventana anunciada dice cuántos octetos puede aceptar aún el receptor.",
    },
    lessonId: "cs-net-c12",
  },
  {
    id: "fenetre-annoncee",
    label: { fr: "fenêtre annoncée (rwnd)", en: "advertised window (rwnd)", es: "ventana anunciada (rwnd)" },
    short: {
      fr: "Valeur du champ fenêtre des segments du récepteur : la place restante dans son buffer de réception.",
      en: "The value of the window field in the receiver's segments: the space left in its receive buffer.",
      es: "Valor del campo ventana en los segmentos del receptor: el espacio libre en su búfer de recepción.",
    },
    lessonId: "cs-net-c12",
  },
  {
    id: "rtt",
    label: { fr: "RTT", en: "RTT", es: "RTT" },
    short: {
      fr: "Round Trip Time : le temps aller-retour entre l'émission d'un segment et le retour de son acquittement.",
      en: "Round Trip Time: the delay between sending a segment and getting its acknowledgement back.",
      es: "Round Trip Time: el tiempo entre emitir un segmento y recibir de vuelta su acuse.",
    },
    lessonId: "cs-net-c12",
  },
  {
    id: "rto",
    label: { fr: "RTO", en: "RTO", es: "RTO" },
    short: {
      fr: "Retransmission TimeOut : durée du temporisateur de retransmission, recalculée en continu à partir du RTT mesuré (moyenne lissée puis variance).",
      en: "Retransmission TimeOut: the retransmission timer's duration, continuously recomputed from measured RTT (smoothed mean, then variance).",
      es: "Retransmission TimeOut: duración del temporizador de retransmisión, recalculada de continuo a partir del RTT medido (media suavizada y varianza).",
    },
    lessonId: "cs-net-c12",
  },
  {
    id: "algorithme-de-karn",
    label: { fr: "algorithme de Karn", en: "Karn's algorithm", es: "algoritmo de Karn" },
    short: {
      fr: "Ne jamais mesurer le RTT sur un segment retransmis (ACK ambigu) et doubler le RTO à chaque retransmission.",
      en: "Never sample RTT on a retransmitted segment (its ACK is ambiguous) and double the RTO on every retransmission.",
      es: "No medir nunca el RTT en un segmento retransmitido (su ACK es ambiguo) y duplicar el RTO en cada retransmisión.",
    },
    lessonId: "cs-net-c12",
  },
  {
    id: "produit-delai-bande-passante",
    label: { fr: "produit délai × bande passante", en: "bandwidth-delay product", es: "producto retardo × ancho de banda" },
    short: {
      fr: "RTT × débit : le volume de données qui remplit le tuyau — la fenêtre nécessaire pour émettre sans jamais s'arrêter.",
      en: "RTT × rate: the data volume that fills the pipe — the window needed to transmit without ever stalling.",
      es: "RTT × caudal: el volumen de datos que llena la tubería; la ventana necesaria para emitir sin detenerse.",
    },
    lessonId: "cs-net-c12",
  },
  {
    id: "facteur-d-echelle",
    label: { fr: "facteur d'échelle (window scale)", en: "window scale factor", es: "factor de escala (window scale)" },
    short: {
      fr: "Option TCP négociée à l'ouverture : décale la fenêtre de n bits (n ≤ 16), la portant de 2¹⁶ à 2³² octets.",
      en: "TCP option negotiated at open: shifts the window by n bits (n ≤ 16), extending it from 2¹⁶ to 2³² bytes.",
      es: "Opción TCP negociada en la apertura: desplaza la ventana n bits (n ≤ 16), llevándola de 2¹⁶ a 2³² octetos.",
    },
    lessonId: "cs-net-c12",
  },
  // ── c13 · Contrôle de congestion ────────────────────────────────────────
  {
    id: "congestion",
    label: { fr: "congestion", en: "congestion", es: "congestión" },
    short: {
      fr: "Saturation des files d'attente du réseau : les paquets s'entassent, les délais explosent, puis les pertes s'enchaînent.",
      en: "Saturation of the network's queues: packets pile up, delays explode, then losses cascade.",
      es: "Saturación de las colas de la red: los paquetes se amontonan, los retardos explotan y llegan las pérdidas en cadena.",
    },
    lessonId: "cs-net-c13",
  },
  {
    id: "fenetre-de-congestion",
    label: { fr: "fenêtre de congestion (cwnd)", en: "congestion window (cwnd)", es: "ventana de congestión (cwnd)" },
    short: {
      fr: "Limite que l'émetteur s'impose à lui-même d'après l'état du réseau ; la fenêtre réelle est min(rwnd, cwnd).",
      en: "The cap the sender imposes on itself from the network's state; the real window is min(rwnd, cwnd).",
      es: "Límite que el emisor se impone según el estado de la red; la ventana real es min(rwnd, cwnd).",
    },
    lessonId: "cs-net-c13",
  },
  {
    id: "demarrage-lent",
    label: { fr: "démarrage lent (slow start)", en: "slow start", es: "arranque lento (slow start)" },
    short: {
      fr: "Partir de cwnd = 1 MSS et ajouter 1 MSS par ACK reçu : la fenêtre double à chaque RTT (croissance exponentielle).",
      en: "Start at cwnd = 1 MSS and add 1 MSS per ACK: the window doubles every RTT (exponential growth).",
      es: "Partir de cwnd = 1 MSS y añadir 1 MSS por ACK: la ventana se duplica en cada RTT (crecimiento exponencial).",
    },
    lessonId: "cs-net-c13",
  },
  {
    id: "seuil-de-demarrage",
    label: { fr: "seuil ss_thresh", en: "ss_thresh threshold", es: "umbral ss_thresh" },
    short: {
      fr: "Frontière entre démarrage lent et évitement : fixé à la moitié de la fenêtre en vol à chaque détection de perte.",
      en: "The border between slow start and avoidance: set to half the in-flight window each time a loss is detected.",
      es: "Frontera entre arranque lento y evitación: fijado a la mitad de la ventana en vuelo en cada pérdida detectada.",
    },
    lessonId: "cs-net-c13",
  },
  {
    id: "evitement-de-congestion",
    label: { fr: "évitement de congestion", en: "congestion avoidance", es: "evitación de congestión" },
    short: {
      fr: "Au-dessus du seuil, croissance linéaire : environ 1 MSS de plus par RTT (1/cwnd par ACK), pour sonder prudemment.",
      en: "Above the threshold, linear growth: about 1 MSS more per RTT (1/cwnd per ACK), probing carefully.",
      es: "Por encima del umbral, crecimiento lineal: aproximadamente 1 MSS más por RTT (1/cwnd por ACK), sondeando con prudencia.",
    },
    lessonId: "cs-net-c13",
  },
  {
    id: "retransmission-rapide",
    label: { fr: "retransmission rapide", en: "fast retransmit", es: "retransmisión rápida" },
    short: {
      fr: "Trois ACK dupliqués valent perte : l'émetteur retransmet le segment manquant sans attendre le temporisateur.",
      en: "Three duplicate ACKs mean a loss: the sender resends the missing segment without waiting for the timer.",
      es: "Tres ACK duplicados equivalen a pérdida: el emisor reenvía el segmento que falta sin esperar al temporizador.",
    },
    lessonId: "cs-net-c13",
  },
  {
    id: "recuperation-rapide",
    label: { fr: "récupération rapide", en: "fast recovery", es: "recuperación rápida" },
    short: {
      fr: "Après une retransmission rapide (Reno), repartir de ss_thresh en évitement au lieu de retomber à cwnd = 1.",
      en: "After a fast retransmit (Reno), resume from ss_thresh in avoidance instead of falling back to cwnd = 1.",
      es: "Tras una retransmisión rápida (Reno), retomar desde ss_thresh en evitación en vez de caer a cwnd = 1.",
    },
    lessonId: "cs-net-c13",
  },
  {
    id: "aimd",
    label: { fr: "AIMD", en: "AIMD", es: "AIMD" },
    short: {
      fr: "Additive Increase, Multiplicative Decrease : monter doucement (+1 par RTT), diviser par 2 à la perte — la dent de scie de TCP.",
      en: "Additive Increase, Multiplicative Decrease: climb gently (+1 per RTT), halve on loss — TCP's sawtooth.",
      es: "Additive Increase, Multiplicative Decrease: subir despacio (+1 por RTT), dividir por 2 en la pérdida — el diente de sierra de TCP.",
    },
    lessonId: "cs-net-c13",
  },
];
