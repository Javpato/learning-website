# Prototype TD1 — scénario initial retenu

Statut : implémenté et étendu au parcours complet à la demande de l’utilisateur.
Sources : TD/TD123-correction.pdf, pages PDF 1–2, exercices 1–2.
Le scénario reste français, librement accessible et utilisable au clavier.

## Mission : faire passer un message entre deux machines

Au centre, deux machines A et B et leur liaison. A possède `101001001`.
L'élève doit construire le signal qui permettra à B de retrouver ces bits.
La carte centrale indique le but ; à gauche, un panneau explique les termes
cliquables (bit, signal, horloge, codage), sans bloquer la manipulation.
Sur mobile, le panneau devient un volet accessible à proximité du contenu.

## 1. Observer et essayer

Afficher les bits et une horloge alignés. Inviter à représenter les premiers
bits en niveaux haut/bas, sans exiger d'emblée un vocabulaire nouveau.
Un bouton permet de voir l'exemple ; tout le parcours reste accessible.
Après l'essai, expliquer NRZ et la convention 1 = +a, 0 = −a utilisée ici.
L'élève termine les neuf intervalles, avec boutons clavier plutôt qu'un
tracé à main levée obligatoire.

Lors de l'envoi, B affiche les bits réellement décodés et les positions
qui diffèrent. Relier explicitement l'erreur au niveau choisi. Pas de bruit
aléatoire ajouté au prototype : isoler la relation bits/signal.

## 2. Même message, trois représentations

Conserver les neuf bits et aligner les trois traces sur la même horloge.
Pour Manchester, guider le premier bit, faire compléter quelques demi-bits,
puis permettre l'essai sur toute la suite. Convention du TD : 1 descendant,
0 montant au milieu du bit. Une transition centrale absente produit une
violation du codage, pas un bit décodé arbitrairement.

Pour Manchester différentiel, rendre visibles le niveau précédent et les
transitions de début/milieu d'intervalle. Vérifier le tracé et l'initialisation
sur la figure du TD avant l'implémentation. Ne pas reprendre aveuglément le
preset de l'annale, dont le premier bit est explicitement un bit d'initialisation.

Faire prédire ce qui change et ce qui reste identique lorsqu'on change de
codage : représentation du signal différente, information binaire conservée.
Finir par alphabet et valence, conformément à la question 1.3 du TD.

## 3. Seize symboles : retrouver le débit

Présenter l'énoncé exact de l'exercice 2 : 16 symboles, chacun dure T.
Un atelier associé à la liaison montre comment un symbole représente un
groupe de 4 bits. Il ne transforme pas silencieusement NRZ binaire en ce
nouveau code et n'ajoute pas des bits de bourrage aux neuf bits du premier jeu.

L'élève répond à trois questions : valence, rapidité en bauds, débit binaire.
Le raisonnement apparaît après l'essai : 16 possibilités = 4 bits/symbole,
R = 1/T et D = 4/T si T est en secondes. Conserver la réponse symbolique.
Un réglage numérique de T sert ensuite à explorer, explicitement présenté
comme illustration ajoutée au TD.

Erreur « 16 bits par symbole » : montrer que 4 positions binaires suffisent
à coder 16 possibilités. Erreur « 1/T bit/s » : comparer symboles et bits
transportés, sans modifier artificiellement le comportement de la liaison.
Proposer des indices progressifs, puis un nouvel essai sans pénalité.

## 4. Réinvestir et retrouver son réseau

Le réseau commun conserve deux capacités visibles : représenter les bits
sur une liaison et calculer son débit à partir de la durée des symboles.
Il ne dépend pas d'une réussite pour être consultable ou manipulable.

Terminer par une question sans indice sur un autre alphabet, par exemple
8 symboles de durée T : 3 bits/symbole et 3/T bit/s. L'identifier comme
variante d'entraînement, puis proposer une courte auto-explication :
« Pourquoi les bauds et les bits/s peuvent-ils être différents ? »
Réponse modèle accessible ; pas de notation automatique d'un texte libre.

## Vérification

Comparer une bonne réponse, un signal incorrect, une violation Manchester,
un indice puis nouvel essai. Vérifier aussi clavier, mobile, accès direct,
conventions du TD et retours de langue en→fr→en et es→fr→es.

Choix retenu : le parcours combine construction guidée de quelques
intervalles et comparaison libre. L'alternative est un simulateur surtout
exploratoire avec questions de prédiction, si la construction paraît trop lente.
