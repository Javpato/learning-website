import { IP_EXERCISES } from "./ipTutorialContent";
import { IP_EXAMS } from "./ipExamContent";
import { RESEAUX_LESSONS, RESEAUX_TDS, RESEAUX_EXAMS } from '../content/cs-reseaux';
import { l10n } from '../content/types';
export const NETWORK_THEMES = [
  ['bases', 'Introduction et couches'], ['transmission', 'Transmission, codage et erreurs'],
  ['commutation', 'Commutation et délais'], ['ip', 'Adressage et protocole IP'],
  ['routage', 'Routage'], ['transport', 'Transport TCP/UDP'], ['outils', 'Méthodes et révisions'],
] as const;
export type ResourceKind = 'cours'|'exercice'|'jeu'|'annale'|'fiche'|'source';
export type NetworkResource = { id:string; title:string; theme:string; kind:ResourceKind; href:string; note?:string; french?:boolean };
const lessonTheme=(n:number)=>n===0?'outils':n===3?'bases':n<4?'commutation':n<8?'transmission':n<10?'ip':n===10?'routage':'transport';
const tdThemes=['transmission','transmission','commutation','routage','ip','transport','transport'];
const workshop:NetworkResource[]=[
  {id:'atelier-bellman-guide',title:'Guide Bellman-Ford — annonces, panne et dix missions',theme:'routage',kind:'jeu',href:'#routage/bellman-guide',french:true},
  ...[['parite','transmission','td1','Programmer un contrôle de parité'],['dijkstra','routage','routage','Programmer Dijkstra'],['vecteur','routage','routage','Programmer la réception de vecteurs'],['bellman-reception','routage','routage','Programmer une mise à jour Bellman-Ford']].map(([id,theme,chapter,title]):NetworkResource=>({id:`code-${id}`,title,theme,kind:'exercice',href:`#${chapter}/code-${id}`,note:'Exercice C avec tests et solution',french:true})),
  {id:'atelier-intro',title:'Comprendre les réseaux et les couches',theme:'bases',kind:'cours',href:'#introduction',french:true},
  {id:'atelier-transmission',title:'Transmission : cours et TD1 guidé',theme:'transmission',kind:'cours',href:'#td1',french:true},
  {id:'atelier-ip',title:'Protocole IP — le CM, dans l’ordre des 60 diapositives',theme:'ip',kind:'cours',href:'#ip',french:true},
  {id:'atelier-routage',title:'Communication et routage — cours expliqué',theme:'routage',kind:'cours',href:'#routage',french:true},
  {id:'atelier-commutation',title:'Circuits, messages, paquets et cellules',theme:'commutation',kind:'jeu',href:'#routage/routage-commutation',french:true},
  ...[['td1-codage','Ex. 1 — Dessiner les trois codages'],['td1-debit','Ex. 2 — Symboles, bauds et bits'],['td1-ex3-theorie','Ex. 3 — Modulation et alphabet'],['td1-ex4-theorie','Ex. 4 — Capacité et QPSK'],['td1-ex5-theorie','Ex. 5 — Contrôle de parité'],['td1-ex6-theorie','Ex. 6 — Distance de Hamming'],['td1-ex7-theorie','Ex. 7 — Polynômes et CRC']].map(([id,title]):NetworkResource=>({id:`atelier-${id}`,title:`TD1 · ${title}`,theme:'transmission',kind:'exercice',href:`#td1/${id}`,french:true})),
  {id:'atelier-dv',title:'TD4 · Ex. 2 — Vecteurs de distances et panne C–D',theme:'routage',kind:'exercice',href:'#routage/routage-vecteurs',french:true},
  {id:'atelier-dijkstra',title:'TD4 · Ex. 1 — Dijkstra et mise en œuvre',theme:'routage',kind:'exercice',href:'#routage/routage-dijkstra',french:true},
  {id:'atelier-ip-td',title:'TD IP complet — 13 énoncés et corrigés originaux',theme:'ip',kind:'exercice',href:'#td-ip',french:true},
  {id:'atelier-ip-annales',title:'Questions IP des partiels et du final',theme:'ip',kind:'annale',href:'#annales',french:true},
  ...['Intro','IP','Routage','TCP'].map((doc):NetworkResource=>({id:`source-${doc}`,title:`${doc}.pdf — support original`,theme:doc==='Intro'?'bases':doc==='IP'?'ip':doc==='Routage'?'routage':'transport',kind:'source',href:`#cours/${doc}/1`,french:true})),
];
export function networkResources(locale:string):NetworkResource[]{
  const base=`/${locale}/cs/reseaux`;
  return [...workshop,
    ...IP_EXERCISES.map((ex,i)=>({id:ex.id,title:`TD IP · Ex. ${i+1} — ${ex.title}`,theme:'ip',kind:'exercice' as const,href:`#td-ip/${ex.id}`,note:'Énoncé et corrigé originaux + solution expliquée',french:true})),
    ...IP_EXAMS.map(ex=>({id:ex.id,title:ex.title,theme:'ip',kind:'annale' as const,href:`#annales/${ex.id}`,note:ex.kind,french:true})),
    ...[['ip-header','Lire un en-tête IPv4'],['ip-subnet','Découper un réseau'],['ip-table','Choisir le prochain saut'],['ip-arp','Faire voyager un paquet avec ARP'],['ip-fragment','Compléter les fragments'],['ip-icmp','Explorer un chemin avec le TTL'],['ip-rip','Comprendre une panne RIP'],['ip-ospf','Diffuser un état de liens']].map(([id,title])=>({id:`jeu-${id}`,title,theme:'ip',kind:'jeu' as const,href:`#ip/${id}`,french:true})),
    ...RESEAUX_LESSONS.map(l=>({id:l.id,title:l10n(locale,l.title),theme:lessonTheme(Number(l.slug.slice(0,2))),kind:'cours' as const,href:`${base}/${l.slug}`,note:'Leçon classique'})),
    ...RESEAUX_TDS.flatMap((td,i)=>td.exercises.map((ex,j)=>({id:ex.id,title:`TD${i+1} · Ex. ${j+1} — ${l10n(locale,ex.title)}`,theme:tdThemes[i],kind:'exercice' as const,href:`${base}/${td.slug}#${ex.id}`,note:'Parcours classique'}))),
    ...RESEAUX_EXAMS.map(ex=>({id:ex.id,title:l10n(locale,ex.title),theme:'outils',kind:'annale' as const,href:`${base}/examens/${ex.slug}`,note:'Sujet d’entraînement reconstruit ; pas une annale originale'})),
    {id:'formulaire',title:'Formulaire et méthodes de rédaction',theme:'outils',kind:'fiche',href:`${base}/formulaire`},
    {id:'plan',title:'Plan de travail',theme:'outils',kind:'fiche',href:`${base}/plan-de-travail`},
  ];
}
export { COURSE_DOCUMENTS, CHAPTER_IDS, parseWorkshopHash, type CourseDocument } from "./networkNavigation";
