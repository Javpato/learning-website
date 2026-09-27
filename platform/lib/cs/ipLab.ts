import { parseIp, maskFromPrefix, fragmentChain, type Fragment } from './ipv4';

export type IpRoute = { network: string; prefix: number; via: string | null; iface: string };
export const COURSE_ROUTES: IpRoute[] = [
  { network: '193.52.72.0', prefix: 24, via: null, iface: 'Eth 2' },
  { network: '193.52.71.0', prefix: 24, via: '193.52.74.2', iface: 'Eth 1' },
  { network: '193.52.74.0', prefix: 24, via: null, iface: 'Eth 1' },
  { network: '0.0.0.0', prefix: 0, via: '193.52.72.1', iface: 'Eth 2' },
];
export const TD_ROUTES: IpRoute[] = [
  { network: '10.0.0.0', prefix: 8, via: '20.0.0.10', iface: '20.0.0.20' },
  { network: '20.0.0.0', prefix: 8, via: null, iface: '20.0.0.20' },
  { network: '30.0.0.0', prefix: 8, via: null, iface: '30.0.0.20' },
  { network: '40.0.0.0', prefix: 8, via: '30.0.0.10', iface: '30.0.0.20' },
];
export function matchingRoutes(destination: string, routes: IpRoute[]): number[] {
  const ip = parseIp(destination);
  if (ip === null) return [];
  return routes.flatMap((route, index) => {
    const net = parseIp(route.network);
    if (net === null || !Number.isInteger(route.prefix) || route.prefix < 0 || route.prefix > 32) return [];
    const mask = maskFromPrefix(route.prefix);
    return (ip & mask) === (net & mask) ? [index] : [];
  }).sort((a,b) => routes[b].prefix - routes[a].prefix);
}
export function sameSubnet(a: string, b: string, prefix: number): boolean {
  const x = parseIp(a), y = parseIp(b);
  return x !== null && y !== null && Number.isInteger(prefix) && prefix >= 0 && prefix <= 32 && (x & maskFromPrefix(prefix)) === (y & maskFromPrefix(prefix));
}
export type DeliveryEvent = { title: string; detail: string; from: string; to: string; protocol: string };
export function deliveryEvents(remote: boolean, warmCache: boolean): DeliveryEvent[] {
  const peer = remote ? 'Passerelle R' : 'Ordinateur B';
  const events: DeliveryEvent[] = [];
  if (!warmCache) events.push(
    { title: 'Requête ARP', detail: `A connaît l’IP de ${peer}, mais pas sa MAC. La demande est diffusée sur le LAN ; elle ne traverse pas R.`, from: 'A', to: 'Tout le LAN', protocol: 'ARP · broadcast' },
    { title: 'Réponse ARP', detail: `${peer} reconnaît son adresse IP et répond à A. A mémorise l’association IP → MAC.`, from: peer, to: 'A', protocol: 'ARP · unicast' },
  );
  events.push({ title: 'Première trame', detail: `IP source = A, IP destination = B. MAC source = A ; MAC destination = ${peer}. La destination finale IP n’est pas remplacée par la passerelle.`, from: 'A', to: peer, protocol: 'Ethernet · IPv4' });
  if (remote) events.push(
    { title: 'Décision du routeur', detail: 'R retire l’enveloppe Ethernet, décrémente le TTL, met à jour le checksum IPv4 et consulte sa table. Ici B est sur son second LAN.', from: 'R entrée', to: 'R sortie', protocol: 'IPv4 · acheminement' },
    { title: 'ARP sur le second LAN', detail: 'Si nécessaire, R résout la MAC de B par une nouvelle requête locale et une réponse. Le cache de A ne renseigne pas celui de R.', from: 'R sortie', to: 'B', protocol: 'ARP · second LAN' },
    { title: 'Nouvelle trame', detail: 'MAC source = interface de sortie de R ; MAC destination = B. Les IP restent A → B dans cet exemple sans NAT. B remet les données au protocole indiqué.', from: 'R sortie', to: 'B', protocol: 'Ethernet · IPv4' },
  );
  return events;
}
export function safeFragments(data: number, mtus: number[], header = 20): Fragment[][] | null {
  if (!Number.isInteger(data) || data < 1 || data > 65535 - header || !Number.isInteger(header) || header < 20 || header > 60 || header % 4 || mtus.some(m => !Number.isInteger(m) || m < header + 8 || m > 65535)) return null;
  return fragmentChain(data, mtus, header);
}
export function probeResult(ttl: number, routers = 3, silentHop = 0) {
  if (!Number.isInteger(ttl) || ttl < 1 || ttl > 255) return null;
  if (ttl <= routers) return { at: `R${ttl}`, type: 11, code: 0, reply: ttl !== silentHop, arrived: false };
  return { at: 'B', type: 0, code: 0, reply: true, arrived: true };
}
export const ARP_FIELDS = [
  ['Matériel Ethernet', '00 01', 'HTYPE = 1 : Ethernet.'],
  ['Protocole IPv4', '08 00', 'PTYPE = 0x0800 : les adresses de protocole sont IPv4.'],
  ['Longueurs', '06 04', 'HLEN = 6 octets de MAC ; PLEN = 4 octets d’IPv4.'],
  ['Opération', '00 01', 'OPER = 1 : requête ; 00 02 serait une réponse.'],
] as const;
