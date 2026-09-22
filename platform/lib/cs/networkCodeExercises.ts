export type CExercise = {
  id: string;
  title: string;
  source: string;
  task: string;
  signature: string;
  starter: string;
  solution: string;
  tests: string;
  hint: string;
  expected: string;
};
const prelude =
  "#include <stdio.h>\n#include <assert.h>\n#define INF 1000000\n";
export const C_EXERCISES: CExercise[] = [
  {
    id: "bellman-reception",
    title: "Coder la réception d’une annonce — exercice 4",
    source: "Guide Bellman-Ford, sections 4.3 et 12",
    task: "Complète recevoir : mets à jour les cinq destinations à partir d’un seul vecteur. Garde ta distance à 0 ; accepte toute actualisation de ton prochain saut courant, sinon seulement une amélioration stricte. −1 représente un prochain saut absent. Les indices 0…4 représentent A…E. Le voisin émetteur est supposé actif.",
    signature:
      "void recevoir(int moi, int voisin, const int v[5], int d[5], int saut[5])",
    starter: `void recevoir(int moi, int voisin, const int v[5], int d[5], int saut[5]) {
    /* Pour chaque destination sauf moi : calculer le candidat. */
    /* Actualiser si saut actuel == voisin OU candidat strictement meilleur. */
    /* INF signifie route inconnue ; dans ce cas, saut = -1. */
    (void)moi; (void)voisin; (void)v; (void)d; (void)saut;
}`,
    solution: `void recevoir(int moi, int voisin, const int v[5], int d[5], int saut[5]) {
    for (int z = 0; z < 5; ++z) {
        if (z == moi) continue;
        int q = v[z] >= INF ? INF : 1 + v[z];
        if (saut[z] == voisin || q < d[z]) {
            d[z] = q;
            saut[z] = q >= INF ? -1 : voisin;
        }
    }
}`,
    tests: `int main(void) {
    /* F2, D recoit VA : perd B mais conserve C via E. */
    int d[5] = {1,2,2,0,1}, saut[5] = {0,0,4,-1,4};
    const int va[5] = {0,INF,INF,1,INF};
    recevoir(3,0,va,d,saut);
    assert(d[1] == INF && saut[1] == -1);
    assert(d[2] == 2 && saut[2] == 4);
    assert(d[3] == 0 && saut[3] == -1);
    /* S3 : egalite, A conserve E via B. */
    int a[5] = {0,1,2,1,2}, sa[5] = {-1,1,1,3,1};
    const int vd[5] = {1,2,INF,0,1};
    recevoir(0,3,vd,a,sa);
    assert(a[4] == 2 && sa[4] == 1);
    /* Une augmentation finie du prochain saut doit aussi etre acceptee. */
    const int vb[5] = {1,0,4,2,1};
    recevoir(0,1,vb,a,sa);
    assert(a[2] == 5 && sa[2] == 1);
    puts("Reception Bellman-Ford : OK");
    return 0;
}`,
    hint: "Ne fais pas seulement min(ancien, candidat) : une route dépendant de l’émetteur doit être actualisée même si elle se dégrade. Protège la sentinelle INF avant l’addition.",
    expected: "Reception Bellman-Ford : OK",
  },
  {
    id: "parite",
    title: "TD1 · Exercice 5 — calculer le bit de parité",
    source: "TD123-correction.pdf, p. 4, exercice 5",
    task: "Écris parite : elle reçoit une chaîne de 0 et de 1 et renvoie le bit à ajouter pour obtenir un nombre pair de 1. Ne modifie pas la chaîne.",
    signature: "int parite(const char *bits)",
    starter:
      "int parite(const char *bits) {\n    /* TODO : parcourir les caractères et garder la parité */\n    return 0;\n}",
    solution:
      "int parite(const char *bits) {\n    int p = 0;\n    for (int i = 0; bits[i] != '\\0'; ++i) {\n        if (bits[i] == '1') p ^= 1;\n    }\n    return p;\n}",
    tests:
      'int main(void) {\n    assert(parite("0001111") == 0);\n    assert(parite("1101010") == 0);\n    assert(parite("1110000") == 1);\n    assert(parite("") == 0);\n    assert(parite("1") == 1);\n    assert(parite("11111111") == 0);\n    puts("Parite : 6 tests reussis");\n}',
    hint: "Un bit de parité commence à 0. Chaque caractère 1 inverse ce bit : p ^= 1. La chaîne se termine par le caractère nul, pas par le chiffre 0.",
    expected: "Parite : 6 tests reussis",
  },
  {
    id: "dijkstra",
    title: "TD4 · Q1.1 — programmer ta boucle de Dijkstra",
    source: "TD456-correction.pdf, p. 1, Q1.1 ; Routage.pdf p. 40 et 47",
    task: "Complète la fonction pour des matrices 6×6 à coûts non négatifs. g[u][v] vaut INF si aucun arc n’existe. Remplis les distances d et les prédécesseurs pred ; utilise −1 pour la source et les sommets inaccessibles. Le tableau used note les sommets définitifs.",
    signature: "void dijkstra(int g[6][6], int source, int d[6], int pred[6])",
    starter:
      "void dijkstra(int g[6][6], int source, int d[6], int pred[6]) {\n    /* TODO 1 : initialiser d, pred et used */\n    /* TODO 2 : choisir le minimum provisoire accessible */\n    /* TODO 3 : fixer ce sommet et relacher ses arcs */\n    /* TODO 4 : recommencer ; arreter si aucun sommet accessible */\n    (void)g; (void)source; (void)d; (void)pred;\n}",
    solution:
      "void dijkstra(int g[6][6], int source, int d[6], int pred[6]) {\n    int used[6] = {0};\n    for (int i = 0; i < 6; ++i) { d[i] = INF; pred[i] = -1; }\n    d[source] = 0;\n    for (int step = 0; step < 6; ++step) {\n        int u = -1;\n        for (int i = 0; i < 6; ++i)\n            if (!used[i] && d[i] < INF && (u == -1 || d[i] < d[u])) u = i;\n        if (u == -1) break;\n        used[u] = 1;\n        for (int v = 0; v < 6; ++v) {\n            if (!used[v] && g[u][v] < INF && d[u] + g[u][v] < d[v]) {\n                d[v] = d[u] + g[u][v];\n                pred[v] = u;\n            }\n        }\n    }\n}",
    tests:
      'int main(void) {\n    /* Indices : A=0, B=1, C=2, D=3, E=4, F=5. Graphe oriente du TD. */\n    int g[6][6] = {\n        {0,10,INF,INF,5,INF},{INF,0,2,3,INF,INF},\n        {INF,INF,0,3,INF,1},{INF,INF,2,0,INF,1},\n        {INF,2,4,INF,0,INF},{INF,INF,INF,1,INF,0}\n    };\n    int d[6]={0}, pred[6]={0};\n    int expected[6] = {0,7,9,10,5,10};\n    dijkstra(g,0,d,pred);\n    for (int i=0;i<6;++i) assert(d[i]==expected[i]);\n    assert(pred[0]==-1); assert(pred[5]==2);\n    dijkstra(g,5,d,pred);\n    assert(d[0]==INF && pred[0]==-1); assert(d[3]==1 && d[2]==3);\n    /* Variante : poids nul, sommets inaccessibles et autre source. */\n    for(int i=0;i<6;++i) for(int j=0;j<6;++j) g[i][j]=(i==j?0:INF);\n    g[3][1]=0; g[1][4]=2; g[3][4]=9;\n    dijkstra(g,3,d,pred);\n    assert(d[1]==0 && d[4]==2 && pred[4]==1 && d[0]==INF);\n    puts("Dijkstra : TD, source F et variante reussis");\n}',
    hint: "Après avoir choisi u, teste d[u] + g[u][v] < d[v]. Attention aux arcs absents et au cas u = −1. La source n’est pas toujours A ; les sommets inaccessibles restent à INF.",
    expected: "Dijkstra : TD, source F et variante reussis",
  },
  {
    id: "vecteur",
    title: "TD4 · Q2 — recalculer à partir des annonces",
    source: "TD456-correction.pdf, p. 2, Q2.1–Q2.2 ; Routage.pdf p. 41–43",
    task: "Écris recalcule pour un routeur parmi A=0, B=1, C=2, D=3. liens[v] donne le coût vers un voisin ou INF. annonces[v][d] est la dernière distance annoncée par v vers d. Recalcule tous les minima depuis zéro : conserver seulement les anciens minima empêcherait de réagir aux pannes. En cas d’égalité, garde le lien direct puis le premier voisin rencontré.",
    signature:
      "void recalcule(int moi, int liens[4], int annonces[4][4], int d[4], int via[4])",
    starter:
      "void recalcule(int moi, int liens[4], int annonces[4][4], int d[4], int via[4]) {\n    /* TODO : pour chaque destination, comparer lien direct et chemins via voisins */\n    (void)moi; (void)liens; (void)annonces; (void)d; (void)via;\n}",
    solution:
      "void recalcule(int moi, int liens[4], int annonces[4][4], int d[4], int via[4]) {\n    for (int dest=0; dest<4; ++dest) {\n        d[dest] = dest==moi ? 0 : liens[dest];\n        via[dest] = dest==moi || d[dest]>=INF ? -1 : dest;\n        if (dest==moi) continue;\n        for (int v=0; v<4; ++v) {\n            if (v==moi || liens[v]>=INF || annonces[v][dest]>=INF) continue;\n            int candidat=liens[v]+annonces[v][dest];\n            if (candidat<d[dest]) { d[dest]=candidat; via[dest]=v; }\n        }\n    }\n}",
    tests:
      'int main(void) {\n    int liens[4]={0,2,3,INF};\n    int annonces[4][4]={{0,2,3,INF},{2,0,2,3},{3,2,0,3},{INF,INF,INF,0}};\n    int d[4]={0},via[4]={0};\n    recalcule(0,liens,annonces,d,via);\n    assert(d[3]==5 && via[3]==1);\n    /* TD : C apres panne C-D, puis annonces de A et B. */\n    int liensC[4]={3,2,0,INF};\n    annonces[0][3]=5;\n    recalcule(2,liensC,annonces,d,via);\n    assert(d[3]==5 && via[3]==1 && d[2]==0);\n    /* Variante : aucun voisin accessible. Une ancienne route ne doit pas survivre. */\n    int isole[4]={INF,INF,0,INF};\n    recalcule(2,isole,annonces,d,via);\n    assert(d[3]==INF && via[3]==-1);\n    puts("Vecteurs : annonce, panne et isolement reussis");\n}',
    hint: "Pour chaque destination, compare liens[v] + annonces[v][destination]. Ignore les voisins inaccessibles et leurs annonces infinies. Un calcul local ne remplace pas la simulation des messages : une annonce peut être périmée.",
    expected: "Vecteurs : annonce, panne et isolement reussis",
  },
];
export function cProgram(ex: CExercise, code: string) {
  return `${prelude}\n/* Exercice pedagogique ajoute, derive de ${ex.source}. */\n${code}\n\n${ex.tests}\n`;
}
