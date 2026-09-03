// Content metadata for the CS module "Réseaux" — the Paris-Saclay L2
// networking module rebuilt from the course's own slides, corrected TDs and
// past papers (see ../../../RESOURCES-reseaux.md; spec:
// ../../../codex-reseaux-rewrite.md). Single source of truth consumed by the
// hub, LessonMeta, ExerciseView and the mock exams; prose lives in
// content.fr.mdx (en/es siblings).
//
// Provenance is "cours" throughout: real course material, but our pages are a
// rewrite — never present them as official university documents.

import type { ExamMetaData, LessonMetaData, TdMetaData } from "./types";

export const RESEAUX_MODULE_SLUG = "reseaux";
const M = RESEAUX_MODULE_SLUG;

export const RESEAUX_LESSONS: LessonMetaData[] = [
  {
    id: "cs-net-c00",
    slug: "00-boite-a-outils",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Boîte à outils — binaire, hexadécimal et ordres de grandeur",
      en: "Toolbox — binary, hexadecimal, and orders of magnitude",
      es: "Caja de herramientas — binario, hexadecimal y órdenes de magnitud",
    },
    provenance: "cours",
    difficulty: 1,
    timeMinutes: 40,
    objectives: [
      {
        fr: "Convertir sans erreur entre binaire, décimal et hexadécimal, dans les deux sens",
        en: "Convert between binary, decimal, and hexadecimal in both directions without mistakes",
        es: "Convertir sin errores entre binario, decimal y hexadecimal, en ambos sentidos",
      },
      {
        fr: "Distinguer bits et octets, et savoir que pour les débits k = 1000 (jamais 1024)",
        en: "Tell bits from bytes, and know that for data rates k = 1000 (never 1024)",
        es: "Distinguir bits de octetos y saber que en los caudales k = 1000 (nunca 1024)",
      },
      {
        fr: "Estimer un logarithme en base 2 et lire un chronogramme simple",
        en: "Estimate a base-2 logarithm and read a simple timing diagram",
        es: "Estimar un logaritmo en base 2 y leer un cronograma sencillo",
      },
    ],
    relatedExercises: [],
  },
  {
    id: "cs-net-c01",
    slug: "01-reseaux-et-commutation",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Relier des machines — circuits, messages ou paquets",
      en: "Connecting machines — circuits, messages, or packets",
      es: "Conectar máquinas — circuitos, mensajes o paquetes",
    },
    provenance: "cours",
    difficulty: 2,
    timeMinutes: 80,
    objectives: [
      {
        fr: "Classer un réseau par taille, mode de transmission et topologie",
        en: "Classify a network by size, transmission mode, and topology",
        es: "Clasificar una red por tamaño, modo de transmisión y topología",
      },
      {
        fr: "Comparer commutation de circuits, de messages, de paquets et de cellules avec leurs avantages et défauts",
        en: "Compare circuit, message, packet, and cell switching with their pros and cons",
        es: "Comparar la conmutación de circuitos, mensajes, paquetes y celdas con sus ventajas e inconvenientes",
      },
      {
        fr: "Distinguer mode connecté (circuit virtuel) et mode non connecté (datagramme) et savoir ce que chacun met dans les paquets",
        en: "Distinguish connection-oriented (virtual circuit) from connectionless (datagram) mode and know what each puts in the packets",
        es: "Distinguir el modo conectado (circuito virtual) del no conectado (datagrama) y saber qué pone cada uno en los paquetes",
      },
    ],
    prerequisites: ["cs-net-c00"],
    relatedExercises: ["cs-net-td4-01"],
  },
  {
    id: "cs-net-c02",
    slug: "02-delais-et-debits",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Combien de temps met un fichier ? Délais, débits, chronogrammes",
      en: "How long does a file take? Delays, rates, timing diagrams",
      es: "¿Cuánto tarda un archivo? Retardos, caudales, cronogramas",
    },
    provenance: "cours",
    difficulty: 2,
    timeMinutes: 100,
    objectives: [
      {
        fr: "Calculer un temps de transmission (taille/débit) et un temps de propagation (distance/vitesse) sans les confondre",
        en: "Compute a transmission time (size/rate) and a propagation delay (distance/speed) without mixing them up",
        es: "Calcular un tiempo de transmisión (tamaño/caudal) y uno de propagación (distancia/velocidad) sin confundirlos",
      },
      {
        fr: "Construire le chronogramme d'un transfert à travers un routeur store-and-forward, file d'attente comprise",
        en: "Build the timing diagram of a transfer through a store-and-forward router, queueing included",
        es: "Construir el cronograma de una transferencia a través de un router store-and-forward, cola incluida",
      },
      {
        fr: "Chiffrer le gain du découpage en paquets et calculer un débit effectif de bout en bout",
        en: "Quantify the gain of packetization and compute an end-to-end effective throughput",
        es: "Cuantificar la ganancia del troceo en paquetes y calcular un caudal efectivo extremo a extremo",
      },
    ],
    prerequisites: ["cs-net-c01"],
    relatedExercises: ["cs-net-td4-01"],
  },
  {
    id: "cs-net-c03",
    slug: "03-couches-et-encapsulation",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Découper la complexité — couches, services et encapsulation",
      en: "Slicing the complexity — layers, services, encapsulation",
      es: "Trocear la complejidad — capas, servicios y encapsulación",
    },
    provenance: "cours",
    difficulty: 2,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Expliquer ce qu'est une couche, un service, un protocole, et la différence service/protocole",
        en: "Explain what a layer, a service, and a protocol are, and the service/protocol difference",
        es: "Explicar qué es una capa, un servicio y un protocolo, y la diferencia servicio/protocolo",
      },
      {
        fr: "Suivre un message à travers l'encapsulation (SDU + en-tête = PDU) et compter les octets réellement transmis",
        en: "Follow a message through encapsulation (SDU + header = PDU) and count the bytes actually transmitted",
        es: "Seguir un mensaje a través de la encapsulación (SDU + cabecera = PDU) y contar los octetos realmente transmitidos",
      },
      {
        fr: "Situer les 7 couches OSI et les 4 couches TCP/IP, et placer IP, TCP et UDP au bon étage",
        en: "Place the 7 OSI layers and the 4 TCP/IP layers, and put IP, TCP, and UDP on the right floor",
        es: "Situar las 7 capas OSI y las 4 capas TCP/IP, y colocar IP, TCP y UDP en el piso correcto",
      },
    ],
    prerequisites: ["cs-net-c01"],
    relatedExercises: ["cs-net-td5-08"],
  },
  {
    id: "cs-net-c04",
    slug: "04-transmission-physique",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Faire passer des bits dans un fil — codage, valence, Shannon",
      en: "Getting bits through a wire — line coding, valence, Shannon",
      es: "Pasar bits por un cable — codificación, valencia, Shannon",
    },
    provenance: "cours",
    difficulty: 3,
    timeMinutes: 100,
    objectives: [
      {
        fr: "Tracer une séquence binaire en NRZ, Manchester et Manchester différentiel",
        en: "Draw a binary sequence in NRZ, Manchester, and differential Manchester",
        es: "Trazar una secuencia binaria en NRZ, Manchester y Manchester diferencial",
      },
      {
        fr: "Relier rapidité de modulation (bauds) et débit binaire par la valence : D = R × log2 V",
        en: "Relate modulation rate (bauds) and bit rate through the valence: D = R × log2 V",
        es: "Relacionar rapidez de modulación (baudios) y caudal binario mediante la valencia: D = R × log2 V",
      },
      {
        fr: "Vérifier qu'un canal accepte un débit avec la capacité de Shannon, décibels compris",
        en: "Check that a channel can carry a rate using Shannon capacity, decibels included",
        es: "Verificar que un canal admite un caudal con la capacidad de Shannon, decibelios incluidos",
      },
    ],
    prerequisites: ["cs-net-c00"],
    relatedExercises: ["cs-net-td1-01", "cs-net-td1-02", "cs-net-td1-03", "cs-net-td1-04"],
  },
  {
    id: "cs-net-c05",
    slug: "05-detection-des-erreurs",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Prouver qu'une trame est intacte — parité, Hamming, CRC",
      en: "Proving a frame is intact — parity, Hamming, CRC",
      es: "Probar que una trama está intacta — paridad, Hamming, CRC",
    },
    provenance: "cours",
    difficulty: 3,
    timeMinutes: 90,
    objectives: [
      {
        fr: "Poser des bits de parité (ligne et colonne) et dire ce qu'ils détectent — et ce qu'ils ratent",
        en: "Set parity bits (row and column) and state what they catch — and what they miss",
        es: "Colocar bits de paridad (fila y columna) y decir qué detectan — y qué se les escapa",
      },
      {
        fr: "Utiliser la distance de Hamming pour connaître le pouvoir détecteur et correcteur d'un code",
        en: "Use the Hamming distance to derive a code's detection and correction power",
        es: "Usar la distancia de Hamming para conocer la capacidad detectora y correctora de un código",
      },
      {
        fr: "Dérouler une division polynomiale de CRC à la main, côté émetteur et côté récepteur",
        en: "Run a CRC polynomial division by hand, on the sender and the receiver side",
        es: "Ejecutar a mano una división polinómica de CRC, del lado emisor y del receptor",
      },
    ],
    prerequisites: ["cs-net-c04"],
    relatedExercises: ["cs-net-td1-05", "cs-net-td1-06", "cs-net-td1-07"],
  },
  {
    id: "cs-net-c06",
    slug: "06-liaison-de-donnees",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Fiabiliser un fil — acquittements, fenêtres et HDLC",
      en: "Making a wire reliable — acknowledgements, windows, HDLC",
      es: "Fiabilizar un cable — acuses, ventanas y HDLC",
    },
    provenance: "cours",
    difficulty: 3,
    timeMinutes: 110,
    objectives: [
      {
        fr: "Dérouler un échange stop-and-wait avec temporisateur et en calculer l'efficacité",
        en: "Run a stop-and-wait exchange with its timer and compute its efficiency",
        es: "Desarrollar un intercambio stop-and-wait con temporizador y calcular su eficiencia",
      },
      {
        fr: "Faire fonctionner une fenêtre d'anticipation et les compteurs N(S)/N(R) de HDLC",
        en: "Operate a sliding window and HDLC's N(S)/N(R) counters",
        es: "Manejar una ventana de anticipación y los contadores N(S)/N(R) de HDLC",
      },
      {
        fr: "Construire les chronogrammes de reprise sur erreur en rejet simple (REJ) et en rejet sélectif (SREJ)",
        en: "Build the error-recovery timing diagrams for go-back-N (REJ) and selective reject (SREJ)",
        es: "Construir los cronogramas de recuperación con rechazo simple (REJ) y selectivo (SREJ)",
      },
    ],
    prerequisites: ["cs-net-c05"],
    relatedExercises: ["cs-net-td2-01", "cs-net-td2-02", "cs-net-td2-03", "cs-net-td2-04"],
  },
  {
    id: "cs-net-c07",
    slug: "07-reseaux-locaux",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Partager un câble — CSMA/CD, Ethernet et l'anneau à jeton",
      en: "Sharing a cable — CSMA/CD, Ethernet, and the token ring",
      es: "Compartir un cable — CSMA/CD, Ethernet y el anillo con testigo",
    },
    provenance: "cours",
    difficulty: 3,
    timeMinutes: 100,
    objectives: [
      {
        fr: "Expliquer CSMA/CD et démontrer la taille minimale de trame L ≥ 2 × tp × D",
        en: "Explain CSMA/CD and derive the minimum frame size L ≥ 2 × tp × D",
        es: "Explicar CSMA/CD y demostrar el tamaño mínimo de trama L ≥ 2 × tp × D",
      },
      {
        fr: "Lire et remplir une trame Ethernet champ par champ, bourrage compris",
        en: "Read and fill an Ethernet frame field by field, padding included",
        es: "Leer y rellenar una trama Ethernet campo a campo, relleno incluido",
      },
      {
        fr: "Dérouler le backoff exponentiel binaire et un tour d'anneau à jeton chronométré",
        en: "Run binary exponential backoff and a timed token-ring rotation",
        es: "Desarrollar el backoff exponencial binario y una vuelta cronometrada del anillo con testigo",
      },
    ],
    prerequisites: ["cs-net-c06"],
    relatedExercises: ["cs-net-td3-01", "cs-net-td3-02", "cs-net-td3-04"],
  },
  {
    id: "cs-net-c08",
    slug: "08-adressage-ip",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Nommer chaque machine — adresses IP, masques et sous-réseaux",
      en: "Naming every machine — IP addresses, masks, subnets",
      es: "Nombrar cada máquina — direcciones IP, máscaras y subredes",
    },
    provenance: "cours",
    difficulty: 3,
    timeMinutes: 120,
    objectives: [
      {
        fr: "Lire une adresse IP en binaire, retrouver sa classe historique et son masque par défaut",
        en: "Read an IP address in binary, recover its historical class and default mask",
        es: "Leer una dirección IP en binario y recuperar su clase histórica y su máscara por defecto",
      },
      {
        fr: "Découper un site en sous-réseaux : masque, adresse de sous-réseau, diffusion, plage et nombre de machines",
        en: "Subnet a site: mask, subnet address, broadcast, range, and host count",
        es: "Dividir un sitio en subredes: máscara, dirección de subred, difusión, rango y número de máquinas",
      },
      {
        fr: "Manier la notation CIDR /n, les sous-sous-réseaux et l'agrégation de blocs contigus",
        en: "Handle /n CIDR notation, nested subnets, and aggregation of contiguous blocks",
        es: "Manejar la notación CIDR /n, las subsubredes y la agregación de bloques contiguos",
      },
      {
        fr: "Écrire une adresse IPv6 abrégée et le plongement ::ffff d'une adresse IPv4",
        en: "Write an abbreviated IPv6 address and the ::ffff embedding of an IPv4 address",
        es: "Escribir una dirección IPv6 abreviada y la inmersión ::ffff de una IPv4",
      },
    ],
    prerequisites: ["cs-net-c00", "cs-net-c03"],
    relatedExercises: ["cs-net-td5-01", "cs-net-td5-05", "cs-net-td5-06", "cs-net-td5-07", "cs-net-td5-10"],
  },
  {
    id: "cs-net-c09",
    slug: "09-datagramme-ip",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Le colis IP — datagramme, fragmentation, ARP et ICMP",
      en: "The IP parcel — datagram, fragmentation, ARP, ICMP",
      es: "El paquete IP — datagrama, fragmentación, ARP e ICMP",
    },
    provenance: "cours",
    difficulty: 4,
    timeMinutes: 120,
    objectives: [
      {
        fr: "Lire l'en-tête IPv4 champ par champ et savoir ce qu'un routeur modifie au passage",
        en: "Read the IPv4 header field by field and know what a router changes in transit",
        es: "Leer la cabecera IPv4 campo a campo y saber qué modifica un router al pasar",
      },
      {
        fr: "Fragmenter un datagramme à travers une chaîne de MTU : longueurs, drapeau MF, décalages en unités de 8 octets",
        en: "Fragment a datagram through a chain of MTUs: lengths, MF flag, offsets in 8-byte units",
        es: "Fragmentar un datagrama a través de una cadena de MTU: longitudes, bandera MF, desplazamientos en unidades de 8 octetos",
      },
      {
        fr: "Dérouler une résolution ARP à travers un routeur, trames et adresses MAC comprises",
        en: "Run an ARP resolution across a router, frames and MAC addresses included",
        es: "Desarrollar una resolución ARP a través de un router, con tramas y direcciones MAC",
      },
      {
        fr: "Expliquer ping et traceroute par les messages ICMP qui les font fonctionner",
        en: "Explain ping and traceroute through the ICMP messages that power them",
        es: "Explicar ping y traceroute mediante los mensajes ICMP que los hacen funcionar",
      },
    ],
    prerequisites: ["cs-net-c08"],
    relatedExercises: ["cs-net-td5-03", "cs-net-td5-04", "cs-net-td5-09", "cs-net-td5-12", "cs-net-td5-13"],
  },
  {
    id: "cs-net-c10",
    slug: "10-routage",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Trouver le chemin — tables, vecteurs de distances et Dijkstra",
      en: "Finding the path — tables, distance vectors, Dijkstra",
      es: "Encontrar el camino — tablas, vectores de distancias y Dijkstra",
    },
    provenance: "cours",
    difficulty: 4,
    timeMinutes: 130,
    objectives: [
      {
        fr: "Consulter une table de routage comme un routeur : ET logique, plus long préfixe, route par défaut",
        en: "Look up a routing table like a router: logical AND, longest prefix, default route",
        es: "Consultar una tabla de enrutamiento como un router: AND lógico, prefijo más largo, ruta por defecto",
      },
      {
        fr: "Itérer des vecteurs de distances à la main et remplir les tables successives de chaque routeur",
        en: "Iterate distance vectors by hand and fill each router's successive tables",
        es: "Iterar vectores de distancias a mano y rellenar las tablas sucesivas de cada router",
      },
      {
        fr: "Provoquer puis corriger un comptage à l'infini avec l'horizon partagé (avec antidote)",
        en: "Trigger then fix a count-to-infinity with split horizon (and poisoned reverse)",
        es: "Provocar y corregir un conteo al infinito con el horizonte dividido (con antídoto)",
      },
      {
        fr: "Dérouler Dijkstra avec ses étiquettes (coût, via) et en tirer la table de routage finale",
        en: "Run Dijkstra with its (cost, via) labels and derive the final routing table",
        es: "Ejecutar Dijkstra con sus etiquetas (coste, vía) y obtener la tabla de enrutamiento final",
      },
    ],
    prerequisites: ["cs-net-c08", "cs-net-c09"],
    relatedExercises: ["cs-net-td4-02", "cs-net-td4-03", "cs-net-td4-04", "cs-net-td5-11"],
  },
  {
    id: "cs-net-c11",
    slug: "11-transport-et-tcp",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Parler de processus à processus — ports, UDP et la connexion TCP",
      en: "Talking process to process — ports, UDP, and the TCP connection",
      es: "Hablar de proceso a proceso — puertos, UDP y la conexión TCP",
    },
    provenance: "cours",
    difficulty: 4,
    timeMinutes: 120,
    objectives: [
      {
        fr: "Expliquer le multiplexage par ports et choisir entre UDP et TCP selon le besoin",
        en: "Explain port-based multiplexing and choose between UDP and TCP for a given need",
        es: "Explicar la multiplexación por puertos y elegir entre UDP y TCP según la necesidad",
      },
      {
        fr: "Calculer les numéros de séquence et d'acquittement d'un échange TCP, octet par octet",
        en: "Compute the sequence and acknowledgement numbers of a TCP exchange, byte by byte",
        es: "Calcular los números de secuencia y de acuse de un intercambio TCP, octeto a octeto",
      },
      {
        fr: "Justifier l'ouverture en trois temps et l'ISN tiré d'une horloge, puis dérouler la fermeture en quatre temps",
        en: "Justify the three-way handshake and the clock-drawn ISN, then run the four-step close",
        es: "Justificar la apertura en tres fases y el ISN sacado de un reloj, y desarrollar el cierre en cuatro fases",
      },
    ],
    prerequisites: ["cs-net-c06", "cs-net-c09"],
    relatedExercises: ["cs-net-td6-01", "cs-net-td6-02", "cs-net-td6-03", "cs-net-td6-07", "cs-net-td7-01"],
  },
  {
    id: "cs-net-c12",
    slug: "12-fenetres-et-fiabilite-tcp",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Remplir le tuyau sans le faire déborder — fenêtres, RTT et RTO",
      en: "Filling the pipe without overflowing it — windows, RTT, RTO",
      es: "Llenar la tubería sin desbordarla — ventanas, RTT y RTO",
    },
    provenance: "cours",
    difficulty: 4,
    timeMinutes: 110,
    objectives: [
      {
        fr: "Faire vivre la fenêtre glissante : octets en vol, fenêtre annoncée, équations des buffers",
        en: "Operate the sliding window: bytes in flight, advertised window, buffer equations",
        es: "Hacer funcionar la ventana deslizante: octetos en vuelo, ventana anunciada, ecuaciones de los búferes",
      },
      {
        fr: "Estimer le RTT (moyenne lissée puis variance de Jacobson) et en déduire le RTO, règle de Karn comprise",
        en: "Estimate the RTT (smoothed mean, then Jacobson's variance) and derive the RTO, Karn's rule included",
        es: "Estimar el RTT (media suavizada y varianza de Jacobson) y deducir el RTO, con la regla de Karn",
      },
      {
        fr: "Borner le débit par fenêtre/RTT, calculer un produit délai × bande passante et dimensionner le facteur d'échelle",
        en: "Bound throughput by window/RTT, compute a bandwidth-delay product, and size the window-scale factor",
        es: "Acotar el caudal por ventana/RTT, calcular un producto retardo × ancho de banda y dimensionar el factor de escala",
      },
    ],
    prerequisites: ["cs-net-c11"],
    relatedExercises: ["cs-net-td6-04", "cs-net-td6-05", "cs-net-td6-06", "cs-net-td6-08"],
  },
  {
    id: "cs-net-c13",
    slug: "13-controle-de-congestion",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "Quand le réseau sature — slow start, AIMD et les pertes",
      en: "When the network saturates — slow start, AIMD, and losses",
      es: "Cuando la red se satura — slow start, AIMD y las pérdidas",
    },
    provenance: "cours",
    difficulty: 4,
    timeMinutes: 110,
    objectives: [
      {
        fr: "Distinguer contrôle de flux et contrôle de congestion, et composer wnd = min(rwnd, cwnd)",
        en: "Distinguish flow control from congestion control, and compose wnd = min(rwnd, cwnd)",
        es: "Distinguir control de flujo y control de congestión, y componer wnd = min(rwnd, cwnd)",
      },
      {
        fr: "Tracer cwnd au fil des RTT : démarrage lent, seuil, évitement, réaction au timeout et aux 3 ACK dupliqués",
        en: "Plot cwnd across RTTs: slow start, threshold, avoidance, reaction to a timeout and to 3 duplicate ACKs",
        es: "Trazar cwnd a lo largo de los RTT: arranque lento, umbral, evitación, reacción al timeout y a 3 ACK duplicados",
      },
      {
        fr: "Calculer en combien de RTT le démarrage lent remplit une fenêtre donnée (log2), sur les chiffres du cours",
        en: "Compute in how many RTTs slow start fills a given window (log2), on the course's own numbers",
        es: "Calcular en cuántos RTT el arranque lento llena una ventana dada (log2), con los números del curso",
      },
    ],
    prerequisites: ["cs-net-c12"],
    relatedExercises: ["cs-net-td6-09", "cs-net-td6-10"],
  },
];

// ── TD ────────────────────────────────────────────────────────────────────

export const RESEAUX_TDS: TdMetaData[] = [
  {
    id: "cs-net-td1",
    slug: "td-1",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "TD 1 — Codage, capacité et contrôle d'erreurs",
      en: "TD 1 — Coding, capacity, and error control",
      es: "TD 1 — Codificación, capacidad y control de errores",
    },
    provenance: "cours",
    exercises: [
      {
        id: "cs-net-td1-01",
        tdId: "cs-net-td1",
        title: {
          fr: "Tracer NRZ, Manchester et Manchester différentiel",
          en: "Drawing NRZ, Manchester, and differential Manchester",
          es: "Trazar NRZ, Manchester y Manchester diferencial",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c04"],
      },
      {
        id: "cs-net-td1-02",
        tdId: "cs-net-td1",
        title: {
          fr: "Valence, bauds et débit binaire",
          en: "Valence, bauds, and bit rate",
          es: "Valencia, baudios y caudal binario",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c04"],
      },
      {
        id: "cs-net-td1-03",
        tdId: "cs-net-td1",
        title: {
          fr: "Capacité d'un canal bruité (Shannon)",
          en: "Capacity of a noisy channel (Shannon)",
          es: "Capacidad de un canal ruidoso (Shannon)",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c04"],
      },
      {
        id: "cs-net-td1-04",
        tdId: "cs-net-td1",
        title: {
          fr: "Numériser la voix — échantillonnage MIC",
          en: "Digitizing voice — PCM sampling",
          es: "Digitalizar la voz — muestreo MIC",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c04"],
      },
      {
        id: "cs-net-td1-05",
        tdId: "cs-net-td1",
        title: {
          fr: "Bits de parité en ligne et en colonne",
          en: "Row and column parity bits",
          es: "Bits de paridad en fila y columna",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c05"],
      },
      {
        id: "cs-net-td1-06",
        tdId: "cs-net-td1",
        title: {
          fr: "Distance de Hamming d'un code",
          en: "Hamming distance of a code",
          es: "Distancia de Hamming de un código",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c05"],
      },
      {
        id: "cs-net-td1-07",
        tdId: "cs-net-td1",
        title: {
          fr: "CRC — division polynomiale complète",
          en: "CRC — full polynomial division",
          es: "CRC — división polinómica completa",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c05"],
      },
    ],
  },
  {
    id: "cs-net-td2",
    slug: "td-2",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "TD 2 — Liaison de données et HDLC",
      en: "TD 2 — Data link and HDLC",
      es: "TD 2 — Enlace de datos y HDLC",
    },
    provenance: "cours",
    exercises: [
      {
        id: "cs-net-td2-01",
        tdId: "cs-net-td2",
        title: {
          fr: "Ouvrir et fermer une liaison HDLC",
          en: "Opening and closing an HDLC link",
          es: "Abrir y cerrar un enlace HDLC",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c06"],
      },
      {
        id: "cs-net-td2-02",
        tdId: "cs-net-td2",
        title: {
          fr: "Chronogramme bidirectionnel avec piggybacking",
          en: "Bidirectional timing diagram with piggybacking",
          es: "Cronograma bidireccional con piggybacking",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c06"],
      },
      {
        id: "cs-net-td2-03",
        tdId: "cs-net-td2",
        title: {
          fr: "Reprise sur erreur en rejet simple (REJ)",
          en: "Error recovery with go-back-N (REJ)",
          es: "Recuperación con rechazo simple (REJ)",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c06"],
      },
      {
        id: "cs-net-td2-04",
        tdId: "cs-net-td2",
        title: {
          fr: "Reprise sur erreur en rejet sélectif (SREJ)",
          en: "Error recovery with selective reject (SREJ)",
          es: "Recuperación con rechazo selectivo (SREJ)",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c06"],
      },
      {
        id: "cs-net-td2-05",
        tdId: "cs-net-td2",
        title: {
          fr: "Fenêtre d'anticipation qui se bloque",
          en: "A sliding window that stalls",
          es: "Una ventana de anticipación que se bloquea",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c06"],
      },
      {
        id: "cs-net-td2-06",
        tdId: "cs-net-td2",
        title: {
          fr: "Transparence — bit stuffing à la main",
          en: "Transparency — bit stuffing by hand",
          es: "Transparencia — bit stuffing a mano",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c06"],
      },
    ],
  },
  {
    id: "cs-net-td3",
    slug: "td-3",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "TD 3 — Réseaux locaux : CSMA/CD et anneau à jeton",
      en: "TD 3 — Local networks: CSMA/CD and token ring",
      es: "TD 3 — Redes locales: CSMA/CD y anillo con testigo",
    },
    provenance: "cours",
    exercises: [
      {
        id: "cs-net-td3-01",
        tdId: "cs-net-td3",
        title: {
          fr: "Taille minimale d'une trame CSMA/CD",
          en: "Minimum CSMA/CD frame size",
          es: "Tamaño mínimo de una trama CSMA/CD",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c07", "cs-net-c02"],
      },
      {
        id: "cs-net-td3-02",
        tdId: "cs-net-td3",
        title: {
          fr: "Backoff exponentiel binaire pas à pas",
          en: "Binary exponential backoff step by step",
          es: "Backoff exponencial binario paso a paso",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c07"],
      },
      {
        id: "cs-net-td3-03",
        tdId: "cs-net-td3",
        title: {
          fr: "Probabilité de collision sur un bus chargé",
          en: "Collision probability on a busy bus",
          es: "Probabilidad de colisión en un bus cargado",
        },
        difficulty: 4,
        lessonIds: ["cs-net-c07"],
      },
      {
        id: "cs-net-td3-04",
        tdId: "cs-net-td3",
        title: {
          fr: "Temps de rotation d'un anneau à jeton",
          en: "Token-ring rotation time",
          es: "Tiempo de rotación de un anillo con testigo",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c07", "cs-net-c02"],
      },
      {
        id: "cs-net-td3-05",
        tdId: "cs-net-td3",
        title: {
          fr: "Scénario complet sur l'anneau — chronogramme",
          en: "Full token-ring scenario — timing diagram",
          es: "Escenario completo en el anillo — cronograma",
        },
        difficulty: 4,
        lessonIds: ["cs-net-c07"],
      },
    ],
  },
  {
    id: "cs-net-td4",
    slug: "td-4",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "TD 4 — Commutation et routage",
      en: "TD 4 — Switching and routing",
      es: "TD 4 — Conmutación y enrutamiento",
    },
    provenance: "cours",
    exercises: [
      {
        id: "cs-net-td4-01",
        tdId: "cs-net-td4",
        title: {
          fr: "La taille de paquet qui minimise le temps de transfert",
          en: "The packet size that minimizes transfer time",
          es: "El tamaño de paquete que minimiza el tiempo de transferencia",
        },
        difficulty: 4,
        lessonIds: ["cs-net-c02"],
      },
      {
        id: "cs-net-td4-02",
        tdId: "cs-net-td4",
        title: {
          fr: "Dijkstra sur un graphe de six routeurs",
          en: "Dijkstra on a six-router graph",
          es: "Dijkstra sobre un grafo de seis routers",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c10"],
      },
      {
        id: "cs-net-td4-03",
        tdId: "cs-net-td4",
        title: {
          fr: "Vecteurs de distances — construire les tables",
          en: "Distance vectors — building the tables",
          es: "Vectores de distancias — construir las tablas",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c10"],
      },
      {
        id: "cs-net-td4-04",
        tdId: "cs-net-td4",
        title: {
          fr: "Rupture de lien, effet rebond et horizon partagé",
          en: "Link failure, bouncing effect, split horizon",
          es: "Ruptura de enlace, efecto rebote y horizonte dividido",
        },
        difficulty: 4,
        lessonIds: ["cs-net-c10"],
      },
    ],
  },
  {
    id: "cs-net-td5",
    slug: "td-5",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "TD 5 — Le protocole IP : adresses, fragments, ARP",
      en: "TD 5 — The IP protocol: addresses, fragments, ARP",
      es: "TD 5 — El protocolo IP: direcciones, fragmentos, ARP",
    },
    provenance: "cours",
    exercises: [
      {
        id: "cs-net-td5-01",
        tdId: "cs-net-td5",
        title: {
          fr: "Ce qu'une adresse doit garantir",
          en: "What an address must guarantee",
          es: "Lo que una dirección debe garantizar",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c08"],
      },
      {
        id: "cs-net-td5-02",
        tdId: "cs-net-td5",
        title: {
          fr: "Du nom à la trame — DNS, routage, ARP",
          en: "From name to frame — DNS, routing, ARP",
          es: "Del nombre a la trama — DNS, enrutamiento, ARP",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c09"],
      },
      {
        id: "cs-net-td5-03",
        tdId: "cs-net-td5",
        title: {
          fr: "Ce qu'un routeur modifie dans l'en-tête",
          en: "What a router changes in the header",
          es: "Lo que un router modifica en la cabecera",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c09"],
      },
      {
        id: "cs-net-td5-04",
        tdId: "cs-net-td5",
        title: {
          fr: "Première fragmentation — 129 octets, MTU 128",
          en: "First fragmentation — 129 bytes, MTU 128",
          es: "Primera fragmentación — 129 octetos, MTU 128",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c09"],
      },
      {
        id: "cs-net-td5-05",
        tdId: "cs-net-td5",
        title: {
          fr: "Lire des adresses — hexadécimal, classes, interfaces",
          en: "Reading addresses — hexadecimal, classes, interfaces",
          es: "Leer direcciones — hexadecimal, clases, interfaces",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c08", "cs-net-c00"],
      },
      {
        id: "cs-net-td5-06",
        tdId: "cs-net-td5",
        title: {
          fr: "Choisir un masque — 254 machines, puis 12 sous-réseaux",
          en: "Choosing a mask — 254 hosts, then 12 subnets",
          es: "Elegir una máscara — 254 máquinas, luego 12 subredes",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c08"],
      },
      {
        id: "cs-net-td5-07",
        tdId: "cs-net-td5",
        title: {
          fr: "Trois segments Ethernet, trois solutions d'adressage",
          en: "Three Ethernet segments, three addressing designs",
          es: "Tres segmentos Ethernet, tres soluciones de direccionamiento",
        },
        difficulty: 4,
        lessonIds: ["cs-net-c08"],
      },
      {
        id: "cs-net-td5-08",
        tdId: "cs-net-td5",
        title: {
          fr: "Une passerelle vue en couches — encapsulations et ARP",
          en: "A gateway seen in layers — encapsulations and ARP",
          es: "Una pasarela vista en capas — encapsulaciones y ARP",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c03", "cs-net-c09"],
      },
      {
        id: "cs-net-td5-09",
        tdId: "cs-net-td5",
        title: {
          fr: "Fragmentation en cascade — 2000 octets, MTU 1024 puis 512",
          en: "Cascade fragmentation — 2000 bytes, MTU 1024 then 512",
          es: "Fragmentación en cascada — 2000 octetos, MTU 1024 y luego 512",
        },
        difficulty: 4,
        lessonIds: ["cs-net-c09"],
      },
      {
        id: "cs-net-td5-10",
        tdId: "cs-net-td5",
        title: {
          fr: "Sous-adressage — 60 sous-réseaux et tests d'appartenance",
          en: "Subnetting — 60 subnets and membership tests",
          es: "Subdireccionamiento — 60 subredes y pruebas de pertenencia",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c08"],
      },
      {
        id: "cs-net-td5-11",
        tdId: "cs-net-td5",
        title: {
          fr: "La table de routage d'une passerelle",
          en: "A gateway's routing table",
          es: "La tabla de enrutamiento de una pasarela",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c10"],
      },
      {
        id: "cs-net-td5-12",
        tdId: "cs-net-td5",
        title: {
          fr: "Décoder deux trames ARP octet par octet",
          en: "Decoding two ARP frames byte by byte",
          es: "Decodificar dos tramas ARP octeto a octeto",
        },
        difficulty: 4,
        lessonIds: ["cs-net-c09", "cs-net-c07"],
      },
      {
        id: "cs-net-td5-13",
        tdId: "cs-net-td5",
        title: {
          fr: "Commenter trois traceroutes réels",
          en: "Commenting three real traceroutes",
          es: "Comentar tres traceroutes reales",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c09"],
      },
    ],
  },
  {
    id: "cs-net-td6",
    slug: "td-6",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "TD 6 — Protocoles de transport",
      en: "TD 6 — Transport protocols",
      es: "TD 6 — Protocolos de transporte",
    },
    provenance: "cours",
    exercises: [
      {
        id: "cs-net-td6-01",
        tdId: "cs-net-td6",
        title: {
          fr: "Ce qu'UDP fait — et ne fait pas",
          en: "What UDP does — and does not",
          es: "Lo que UDP hace — y no hace",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c11"],
      },
      {
        id: "cs-net-td6-02",
        tdId: "cs-net-td6",
        title: {
          fr: "L'ouverture en trois temps, justifiée",
          en: "The three-way handshake, justified",
          es: "La apertura en tres fases, justificada",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c11"],
      },
      {
        id: "cs-net-td6-03",
        tdId: "cs-net-td6",
        title: {
          fr: "L'arsenal de fiabilité de TCP",
          en: "TCP's reliability arsenal",
          es: "El arsenal de fiabilidad de TCP",
        },
        difficulty: 2,
        lessonIds: ["cs-net-c11"],
      },
      {
        id: "cs-net-td6-04",
        tdId: "cs-net-td6",
        title: {
          fr: "Dimensionner le temporisateur — SRTT, Jacobson, Karn",
          en: "Sizing the timer — SRTT, Jacobson, Karn",
          es: "Dimensionar el temporizador — SRTT, Jacobson, Karn",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c12"],
      },
      {
        id: "cs-net-td6-05",
        tdId: "cs-net-td6",
        title: {
          fr: "Une fenêtre trop petite pour un lien T3",
          en: "A window too small for a T3 link",
          es: "Una ventana demasiado pequeña para un enlace T3",
        },
        difficulty: 4,
        lessonIds: ["cs-net-c12"],
      },
      {
        id: "cs-net-td6-06",
        tdId: "cs-net-td6",
        title: {
          fr: "Débit maximal d'une connexion — fenêtre / RTT",
          en: "A connection's maximum throughput — window / RTT",
          es: "Caudal máximo de una conexión — ventana / RTT",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c12"],
      },
      {
        id: "cs-net-td6-07",
        tdId: "cs-net-td6",
        title: {
          fr: "Chronogramme TCP avec perte — MSS 512",
          en: "TCP timing diagram with a loss — MSS 512",
          es: "Cronograma TCP con pérdida — MSS 512",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c11", "cs-net-c12"],
      },
      {
        id: "cs-net-td6-08",
        tdId: "cs-net-td6",
        title: {
          fr: "Pourquoi deux checksums ? TCP, IP et IPv6",
          en: "Why two checksums? TCP, IP, and IPv6",
          es: "¿Por qué dos checksums? TCP, IP e IPv6",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c11", "cs-net-c05"],
      },
      {
        id: "cs-net-td6-09",
        tdId: "cs-net-td6",
        title: {
          fr: "Si le réseau devenait fiable…",
          en: "If the network became reliable…",
          es: "Si la red fuera fiable…",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c13", "cs-net-c11"],
      },
      {
        id: "cs-net-td6-10",
        tdId: "cs-net-td6",
        title: {
          fr: "Un client UDP qui ne se bloque jamais",
          en: "A UDP client that never blocks",
          es: "Un cliente UDP que nunca se bloquea",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c13", "cs-net-c12"],
      },
    ],
  },
  {
    id: "cs-net-td7",
    slug: "td-7",
    moduleSlug: M,
    subject: "cs",
    title: {
      fr: "TD 7 — TP guidé : sockets en C (UDP puis TCP)",
      en: "TD 7 — Guided lab: C sockets (UDP then TCP)",
      es: "TD 7 — Práctica guiada: sockets en C (UDP y TCP)",
    },
    provenance: "cours",
    exercises: [
      {
        id: "cs-net-td7-01",
        tdId: "cs-net-td7",
        title: {
          fr: "Client / serveur UDP (SOCK_DGRAM)",
          en: "UDP client / server (SOCK_DGRAM)",
          es: "Cliente / servidor UDP (SOCK_DGRAM)",
        },
        difficulty: 3,
        lessonIds: ["cs-net-c11"],
      },
      {
        id: "cs-net-td7-02",
        tdId: "cs-net-td7",
        title: {
          fr: "Client / serveur TCP (SOCK_STREAM)",
          en: "TCP client / server (SOCK_STREAM)",
          es: "Cliente / servidor TCP (SOCK_STREAM)",
        },
        difficulty: 4,
        lessonIds: ["cs-net-c11"],
      },
    ],
  },
];

// ── Examens blancs ────────────────────────────────────────────────────────

export const RESEAUX_EXAMS: ExamMetaData[] = [
  {
    id: "cs-net-exam-cc",
    slug: "cc",
    moduleSlug: M,
    subject: "cs",
    kind: "cc",
    title: {
      fr: "Partiel 1 h — couches basses (codage et HDLC)",
      en: "1-hour midterm — lower layers (coding and HDLC)",
      es: "Parcial de 1 h — capas bajas (codificación y HDLC)",
    },
    durationMinutes: 60,
    totalPoints: 20,
    topics: ["cs-net-c04", "cs-net-c05", "cs-net-c06"],
    provenance: "cours",
  },
  {
    id: "cs-net-exam-partiel",
    slug: "partiel",
    moduleSlug: M,
    subject: "cs",
    kind: "partiel",
    title: {
      fr: "Partiel 2 h — commutation, adressage, routage et QCM",
      en: "2-hour midterm — switching, addressing, routing, and MCQ",
      es: "Parcial de 2 h — conmutación, direccionamiento, enrutamiento y test",
    },
    durationMinutes: 120,
    totalPoints: 20,
    topics: ["cs-net-c01", "cs-net-c02", "cs-net-c03", "cs-net-c08", "cs-net-c10"],
    provenance: "cours",
  },
  {
    id: "cs-net-exam-final",
    slug: "final",
    moduleSlug: M,
    subject: "cs",
    kind: "final",
    title: {
      fr: "Examen final — CIDR, fragmentation, tables de routage",
      en: "Final exam — CIDR, fragmentation, routing tables",
      es: "Examen final — CIDR, fragmentación, tablas de enrutamiento",
    },
    durationMinutes: 120,
    totalPoints: 20,
    topics: ["cs-net-c08", "cs-net-c09", "cs-net-c10", "cs-net-c11", "cs-net-c12", "cs-net-c13"],
    provenance: "cours",
  },
];
