# Sources — track « Réseaux » (cs/reseaux)

The track rebuilds the Université Paris-Saclay L2 **Module Réseaux** (L2 Info /
LDD2 Info-Math / MNSI; lecturer on the papers: L. Boukhatem) from the learner's
own copy of the course material at
`/home/javpato/Desktop/documentos/cours/Réseaux/`. Every file was read in full
before the spec was written. Provenance tag: **`cours`** — real course
material, but our pages are a rewrite, never an official document.

## Corpus inventory (all read, 2026-09-01)

### Cours (4 slide decks, 222 slides)

| Deck | Slides | Content |
| --- | --- | --- |
| `Cours/Intro.pdf` | 35 | course plan (A intro, B réseaux commutés, C IP, D transport) ; définitions & intérêts des réseaux ; historique ; acteurs (télécoms=circuits, informatique=paquets) ; normalisation (de facto/de jure, ISO/UIT/IETF/IEEE) ; classification par taille (PAN/LAN/MAN/WAN + débits), par transmission (diffusion vs point-à-point), par topologie (bus/anneau/étoile, physique vs logique) ; architecture en couches : couches/entités/services/primitives (request/indication/response/confirmation), protocole, SAP, SDU+PCI=PDU, segmentation/concaténation/groupage ; encapsulation ; communication virtuelle vs réelle (analogie des philosophes) ; modèle OSI 7 couches (rôle de chacune) ; architecture TCP/IP 4 couches + graphe de protocoles. |
| `Cours/Routage.pdf` | 48 | rôle de la couche réseau (adressage, routage, contrôle de congestion) ; services réseau ; mode connecté (circuit virtuel, 3 phases, N-CONNECT/N-DATA/N-DISCONNECT) vs non connecté (datagramme, best effort) + table comparative ; unités (bit, octet, **K=10³**), débit binaire, temps de transmission tt=L/D (ex. 10 000 bits à 10 Mbit/s = 1 ms), temps de propagation tp=d/v (satellite 250 ms, coax 5 µs/km), temps de transfert tr=tt+tp ; commutation : circuits / messages (store-and-forward) / paquets (gain du pipeline, schéma temporel) / cellules (53 octets) + avantages-inconvénients de chaque ; adressage plat vs hiérarchique, unicast/broadcast/multicast ; routage = acheminement (consultation de table) + adaptation des chemins ; voie logique (étiquettes, tables de translation, ex. 26→11→8→3) vs datagramme ; objectifs d'un protocole de routage (simplicité, robustesse — trous/boucles/oscillations, convergence…) ; classification (centralisé/distribué, statique/dynamique…) ; routage = plus court chemin dans un graphe ; **vecteur de distances** (Bellman-Ford distribué, échanges périodiques voisins, panne → métrique infinie, boucles → comptage à l'infini, 16=∞ façon RIP, horizon partagé) ; **état de liens** (HELLO, LSP {id, voisins, coûts}, inondation, carte complète, Dijkstra local) + tableau comparatif DV/LS (CPU, mémoire, signalisation, convergence). |
| `Cours/IP.pdf` | 60 | Internet/IETF/RFC ; interconnexion par routeurs ; encapsulation avec tailles réelles (Ethernet 14+4, IP 20, TCP 20) ; service IP (non fiable, sans connexion, best effort) ; **datagramme IPv4 champ par champ** (version, IHL en mots de 32 bits, TOS, longueur totale 16 bits, identification, DF/MF, décalage en unités de 8 octets, TTL, protocole 6/17/1, checksum d'en-tête, options — enregistrement de route, routage strict) ; **fragmentation** (MTU Ethernet 1500 ; ex. 1400 octets → MTU 620 → 3 fragments 600/600/200, offsets 0/75/150, MF 1/1/0 ; réassemblage uniquement à destination, temporisateur, perte d'un fragment = perte de tout) ; **adresse IP** 32 bits Net-Id+Host-Id, notation pointée, classes A-E (obsolètes), adresses spéciales (0.0.0.0, host tout à 0/1, 127, privées RFC 1918) ; **sous-adressage** (subnet-id invisible de l'extérieur), masques (ET logique ; défauts 255.0.0.0/255.255.0.0/255.255.255.0 ; ex. 137.10.45.126 masque .128 → 2 sous-réseaux) ; pénurie IPv4 → DHCP/CIDR/NAT/IPv6 ; **CIDR** (préfixes /n, agrégation de blocs classe C contigus, ex. 194.18.16.0/21) ; **IPv6** (en-tête 40 octets fixes, pas de fragmentation routeur, pas de checksum ; notation hexa, abréviations ::, ::FFFF:IPv4) ; routage IP (remise directe vs indirecte, exemple bsdi/sun/gateway), table de routage réelle (Destination/Masque/Prochain saut/Voie + défaut 0.0.0.0, plus long préfixe) ; **ARP** (requête broadcast / réponse unicast, cache, exemple complet avec MAC à travers un routeur) ; **ICMP** (type/code : inaccessible 3, TTL expiré 11 → traceroute, écho 8/0 → ping, masque 17/18 ; jamais d'ICMP sur ICMP) ; routage statique (route add) vs dynamique ; AS (stub/multihomed/transit), IGP (RIP : DV, 30 s, invalide 180 s, 15 sauts max, UDP 520 ; OSPF : LS, aires, backbone 0, Hello 10 s/mort 40 s, LSA 30 min) vs EGP (BGP). |
| `Cours/TCP.pdf` | 79 | rôle du transport (processus↔processus, corriger les défauts du réseau) ; **UDP** (RFC 768 : non fiable, non connecté, multiplexage seul ; datagramme 4 champs ; checksum optionnel IPv4 + pseudo-en-tête ; ports 0-1023 réservés — table DNS 53, HTTP 80… ; file de messages) ; **TCP** : flux d'octets fiable connecté point-à-point full-duplex ; différences avec la couche liaison (RTT variable, vieux segments errants, buffers partagés, congestion) ; segmentation, MSS = MTU−40 ; **format du segment** (ports, SEQ, ACK, longueur d'en-tête, drapeaux URG/ACK/PSH/RST/SYN/FIN, fenêtre, checksum, pointeur urgent, options) ; SEQ = n° du premier octet, ACK cumulatif = prochain octet attendu ; connexion = quadruplet (@IP,port)² ; **ouverture en 3 temps** (SYN x / SYN y ACK x+1 / ACK y+1 ; ISN horloge 4 µs ; états SYN_SENT…) ; **fermeture** en 4 temps semi-fermetures indépendantes (FIN/ACK ×2, TIME_WAIT = 2·MSL) ; fiabilité = ACK + temporisateur + retransmission ; numérotation en octets (ex. SN=25(5) → ACK 30) ; piggybacking ; **fenêtre glissante** ; **contrôle de flux** (fenêtre annoncée rwnd, EffectiveWindow = rwnd − (LastByteSent−LastByteAcked), équations des buffers émission/réception, réouverture par sonde 1 octet) ; **temporisateur adaptatif** : RFC 793 SRTT=α·SRTT+(1−α)·RTT, RTO=min(UBOUND,max(LBOUND,β·SRTT)) ; Jacobson (moyenne α=1/8 + variance β=1/4, RTO=RTT+4·D) ; Karn (ignorer les segments retransmis, doubler le RTO) ; **contrôle de congestion** : effondrement 1986, Van Jacobson 88 ; cwnd, wnd=min(rwnd,cwnd) ; **slow start** (cwnd=1, +1 par ACK → doublement par RTT), seuil ss_thresh, **congestion avoidance** (+1/cwnd par ACK), timeout → ss_thresh=max(cwnd/2, 2 MSS), cwnd=1 ; **fast retransmit** (3 ACK dupliqués) + **fast recovery** (Reno : cwnd=ss_thresh+3…) ; Tahoe vs Reno ; panorama des évolutions (NewReno, SACK, Vegas, CUBIC, ECN…) ; 3 exercices intégrés corrigés (échange 2×100+300 octets ISN 100/600 ; lecture de courbe cwnd MSS 1024/ss 64K ; produit délai×bande passante 1 Gbit/s RTT 20 ms → fenêtre 2000 segments, remplissage en ⌈log₂ 2000⌉=11 RTT=0,22 s). |

### TD (6 énoncés + corrigés, 59 p.)

| Fichier | Contenu |
| --- | --- |
| `TD/TD123-correction.pdf` (16 p.) | **TD1 codage & erreurs** : NRZ, Manchester, Manchester différentiel ; valence/bauds, D=R·log₂V ; capacité de Shannon (dB) ; échantillonnage MIC (8 kHz × 8 bits = 64 kbit/s) ; bits de parité VRC/LRC + probabilité binomiale d'erreur non détectée ; distance de Hamming (détecte d−1, corrige ⌊(d−1)/2⌋) ; codes polynomiaux/CRC (division XOR). **TD2 liaison HDLC** : SABM/UA, trames I N(S)/N(R), RR/REJ/SREJ, fenêtre d'anticipation, piggybacking, transparence (bit stuffing), chronogrammes complets. **TD3 réseaux locaux** : CSMA/CD (trame minimale L ≥ 2·C·d/v, tranches de temps, backoff), anneau à jeton (THT, temps de rotation). |
| `TD/TD456-correction.pdf` (12 p., énoncés) | **TD4 routage** : Dijkstra pas à pas ; vecteurs de distances + rupture de lien (chronologie T1…T4). **TD5 IP** : propriétés des adresses ; routeur = N adresses ; résolution (DNS/ARP) ; champs modifiés par un routeur (TTL, checksum) ; fragmentation 129 octets/MTU 128 ; classes ; masques ; 12 sous-réseaux × 12 machines ; découpe de 132.227.0.0 (R1/R2/R3, proxy ARP vs sous-réseaux vs nouveau masque) ; architecture en couches d'une passerelle + encapsulations ; **fragmentation complète 2000 octets à travers MTU 4096→1024→512 avec tables d'en-têtes** ; plages/broadcast ; table de routage d'une passerelle dans une chaîne ; **décodage hexa de 2 trames Ethernet+ARP** ; **3 sorties traceroute commentées**. **TD6 transport** : fonctions UDP ; ouverture TCP en 3 temps (pourquoi 3, pourquoi ISN≠0) ; mécanismes de fiabilité ; RFC 793 RTO (α, β) + Jacobson + Karn ; **T3 44,736 Mbit/s RTT 50 ms fenêtre 16 bits → bloqué 76,6 %** ; fenêtre/RTT → débit max 1,75 Mbit/s, window scale ; schéma de retransmission MSS 512 (Go-Back-N) ; checksums TCP vs IP, IPv6 ; réseau fiable → quoi supprimer ; client UDP bloquant. |
| `TD/TD-routage-correction.pdf` (5 p.) | corrigé TD4 : taille optimale de paquet p=√(xh/k) (dérivée de T=(k+n)·tt) ; **Dijkstra complet avec étiquettes (provisoire/permanent) sur le graphe A-E, table finale de A (tout via E)** ; problèmes des bases LS (inondation, resynchronisation) ; **vecteurs de distances : itérations, rupture Vcd, effet rebond (comptage à l'infini), horizon partagé**. |
| `TD/TD_IP-correction.pdf` (11 p.) | corrigé TD5 intégral (dont : fragments 124+25 octets ; masque 12 sous-réseaux = .240 ; découpe .224 avec table adresses/diffusions ; les 6 fragments 508/508/44/508/508/44 offsets 0/61/122/125/186/247 ; trames ARP décodées octet par octet ; traceroutes commentés). |
| `TD/TD_transport-correction.pdf` (6 p.) | corrigé TD6 intégral (SRTT 29,6/29,84/29,256 ms ; fenêtre 65 536 octets émise en 11,7 ms vs RTT 50 ms → 76,6 % bloqué ; BDP 2,2 Mbit ; scale n=2 → 7 Mbit/s, n≥3 → lien plein ; GBN octets 1324:1535 reçus 2 fois…). |
| `TD/TP2v2.pdf` (9 p.) | TP sockets C : client/serveur UDP (SOCK_DGRAM) et TCP (SOCK_STREAM, fork), API socket/bind/listen/accept/connect/sendto/recvfrom/gethostbyname, squelettes fournis. |

### Annales (7 sujets)

| Fichier | Contenu |
| --- | --- |
| `partiel-2021(-correction)` | **DV sur le graphe A-B-C-D-E : 8 itérations de tables complètes (dest/next/dist)** ; sous-adressage 132.174.0.0/17, 62 sous-réseaux → /23, sous-réseau 55 (adresse .110.0, diffusion .111.255, 510 machines, plage), sous-sous-réseaux du 34 (/25). |
| `partiel.pdf` + `partiel_corr.pdf` (1 h) | Manchester différentiel sur « 011110011001100 » ; NRZ valence 8 (paliers ±1/3/5/8 V), R=200 bauds, D=600 bit/s ; Shannon 50 kHz/30 dB → C≈500 kbit/s > D ; **HDLC bidirectionnel : reprise REJ vs SREJ, chronogrammes corrigés (I00 I10 I20✗ I31 / I01 I12 REJ2 / I22 I32…)**. |
| `partiel-L2Info-2023` (copie notée 5,25/20) | commutation de paquets (fichier 30 KB, p1 10 KB + p2 20 KB, 10 puis 5 Mbit/s, 6600 km) ; adressage 132.214.0.0/18, 29 sous-réseaux ; **QCM ~24 questions** (PDU, TCP/IP, encapsulation, temps de transfert/transmission, datagramme, LS/DV, Dijkstra, max sous-réseaux classe C=64, /22 pour 40 sous-réseaux classe B, table (128.96.40.0, .128, R2) vs 128.96.40.129 → non…). |
| `partiel-ldd-2023` (copie notée 8/20) | même squelette + **Q4 : 6 paquets avec ACK par paquet (stop-and-wait)** ; adressage 152.214.0.0/19, 63 sous-réseaux ; même QCM. |
| `Partiel 2024-25` (copie notée 19/20) | **DV : table de R + réception DV1/DV2, mise à jour ; horizon partagé avec antidote (poisoned reverse) : les 3 vecteurs par lien** ; **3 paquets simultanés via routeur D FIFO (10/50/1 Mbit/s entrée, 5 Mbit/s sortie) : premiers/derniers bits à 3/23/25 ms** ; adressage 166.113.128.0/17, 64 sous-réseaux → /23, sous-réseau 19, figure à 4 sous-sous-réseaux + adresses machines ; **QCM v2** (PDU=SDU+en-tête, décapsulation, durée d'un bit à 1 Mbit/s=10⁻⁶ s, Identification=réassemblage, TTL…). |
| `Preparation_Partiel (Selon Lila Boukhatem)` | adressage 132.174.0.0, 45 sous-réseaux → /22, sous-réseau 34, Host-Id 357 ; **Dijkstra depuis D sur le graphe A…G (métrique=coûts), tableau d'étiquettes complet + table de routage de D** ; rappel de l'algorithme en 6 points. |
| `Annales/Exam/Annale_Exam(_Corr)` | **CIDR : un FAI alloue 36 blocs classe C contigus (192.24.0.0–192.24.35.0) à 6 clients, efficacité vs classe B = 14 %** (exercice type Tanenbaum) ; **fragmentation en cascade MTU 1024 puis 512 : les 7 fragments (500/500/44/500/500/44/100, offsets 0/60/120/123/183/243/246)** ; sous-adressage 128.175.0.0 → /19 puis /22, table de routage de R1 avec prochains sauts calculés (Host-Id 292→.197.36), plage/diffusion de .211.71. |

## Genre conventions extracted (what a réseaux course expects)

1. **Everything is computed on paper**: chronogrammes (time diagrams), routing
   tables iterated by hand, masks in binary, fragment tables. The written form
   is graded — our Méthode blocks must teach the exact layout of these tables.
2. Exam ratio is stable across years: 1 routing exercise (DV tables or
   Dijkstra labels), 1 addressing/subnetting exercise (8 pts, always), 1
   commutation/delays exercise, 1 QCM (5-6 pts, 0,25-0,33/question). The final
   adds CIDR allocation + cascade fragmentation.
3. Lower layers (codage, HDLC, LANs) live in TD + the 1 h partiel, not in the
   provided decks — the track must still teach them (TDs are part of the
   course; "cannot be less information than the source").
4. Real graded copies show the recurring failure modes (they feed our
   Pièges): K=2¹⁰ vs 10³ confusions; KB→bits forgotten (×8); subnet bits
   counted from the wrong boundary (site prefix /18 vs class default);
   "effective throughput = average of link rates" (wrong: it is total
   bits / total time); offset not divided by 8; 2^h−2 forgotten; ⌈log₂N⌉
   bits for "at least N subnets"; REJ vs SREJ retransmission sets.
5. The lecturer's own vocabulary is used throughout our track: acheminement /
   adaptation des chemins, voie logique, fenêtre d'anticipation, horizon
   partagé (avec antidote), remise directe/indirecte, temporisateur.

## What the genre leaves out (our upgrades, evidence-based)

- Slides state mechanisms but rarely *why this design* (why 3-way and not 2,
  why offsets are in units of 8, why a checksum only on the header, why 64
  octets minimum on Ethernet). Every lesson motivates before defining
  (advance organizers; "no cold definitions").
- No worked arithmetic on slides — corrections exist but unannotated. We do
  per-step *Pourquoi ?* worked examples (worked-example effect, Renkl/Sweller)
  and fading toward the TD.
- Nothing is manipulable. Each core mechanism gets an interactive widget
  scripted by Prédis→Agis→Observe→Relie cycles on the mission's numbers
  (PhET-style guided inquiry): chronogrammes, encapsulation, codage en ligne,
  ARQ, sous-adressage, DV/Dijkstra, fragmentation, congestion.
- QCM feedback: real QCM items are reused in per-lesson quizzes with
  per-option explanations (retrieval practice + immediate feedback).

Never copy student names from the graded copies into any content.
