/** Ordered coverage of IP.pdf: two numbered slides per physical PDF page. */
export const IP_SECTIONS = [
  { id: "ip-plan", title: "Le trajet que nous allons comprendre", slides: [1, 2] },
  { id: "ip-internet", title: "Internet : relier des réseaux différents", slides: [3, 5] },
  { id: "ip-couches", title: "Du message de l’application à la trame", slides: [6, 8] },
  { id: "ip-header", title: "Lire la fiche de route IPv4", slides: [9, 12] },
  { id: "ip-fragment", title: "Faire passer un datagramme dans une liaison plus étroite", slides: [13, 15] },
  { id: "ip-ttl-options", title: "Limiter le trajet et interpréter les options", slides: [16, 17] },
  { id: "ip-adresses", title: "Identifier une interface et son réseau", slides: [18, 22] },
  { id: "ip-subnet", title: "Découper un site sans perdre ses machines", slides: [23, 25] },
  { id: "ip-cidr", title: "Économiser les adresses et les lignes de routage", slides: [26, 28] },
  { id: "ip-ipv6", title: "IPv6 : agrandir et simplifier", slides: [29, 31] },
  { id: "ip-forward", title: "Livrer directement ou passer par un routeur", slides: [32, 36] },
  { id: "ip-table", title: "Choisir la bonne ligne de la table de routage", slides: [37, 38] },
  { id: "ip-arp", title: "ARP : trouver la bonne carte réseau", slides: [39, 46] },
  { id: "ip-icmp", title: "ICMP : comprendre les réponses et les silences", slides: [47, 50] },
  { id: "ip-static", title: "Qui remplit la table de routage ?", slides: [51, 52] },
  { id: "ip-as", title: "Organiser le routage entre domaines", slides: [53, 55] },
  { id: "ip-rip", title: "RIP : apprendre les distances de ses voisins", slides: [56, 57] },
  { id: "ip-ospf", title: "OSPF : partager une carte, calculer ses routes", slides: [58, 60] },
] as const;

export type IPSectionId = (typeof IP_SECTIONS)[number]["id"];
