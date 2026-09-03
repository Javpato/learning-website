// UI strings of the learn-track components (chrome only — lesson prose lives
// in the per-locale MDX files). French is the base; en/es are complete here.
// Components resolve the locale from the URL via useLocale() or receive it.

import type { Locale } from "@/lib/i18n/config";

export type LearnUi = {
  difficultyHint: string;
  minutesSuffix: string; // "~{n} min"
  objectivesSummary: string;
  relatedTitle: string;
  relatedHint: string;
  theoryUseful: string;
  finalAnswer: string;
  solution: string;
  commonErrors: string;
  hintsIntro: string;
  hintLabel: string; // "Indice {n}"
  quizDefaultTitle: string;
  quizNote: string;
  check: string;
  reset: string;
  showExplain: string;
  hideExplain: string;
  okMsgs: string[];
  retryMsgs: string[];
  numericOk: string;
  numericRetry: string;
  numericNaN: string;
  numericPlaceholder: string;
  suggestedMinutes: string; // "{n} min conseillées"
  points: string;
  examDisclaimer: string;
  topicsCovered: string;
  timerLabel: string;
  timerOptional: string;
  start: string;
  resume: string;
  pause: string;
  stateGroupLabel: string;
  stateLabel: string;
  states: [string, string, string, string, string]; // not-explored, exploring, understood, review-later, favorite
  tocTitle: string;
  missionTitle: string;
  missionSolvedTitle: string;
  rappelPrefix: string;
  keyResultsDefault: string;
  coursesTitle: string;
  tdSectionTitle: string;
  examSectionTitle: string;
  tdFirstQ: string;
  tdFirstLink: string;
  tdFirstRest: string;
  emCrumb: string;
  fmvCrumb: string;
  analyseCrumb: string;
  reseauxCrumb: string;
  tdCardText: (n: number) => string;
  examCardText: string;
};

const fr: LearnUi = {
  difficultyHint: "Niveau indicatif — jamais une barrière : tout reste accessible.",
  minutesSuffix: "min",
  objectivesSummary: "Ce que tu vas explorer",
  relatedTitle: "Exercices liés",
  relatedHint: "À ouvrir dans n'importe quel ordre — les corrigés sont toujours disponibles.",
  theoryUseful: "Théorie utile :",
  finalAnswer: "Réponse finale",
  solution: "Corrigé détaillé",
  commonErrors: "Erreurs fréquentes",
  hintsIntro: "Des indices progressifs sont disponibles — ouvre-en un quand tu en as besoin, sans aucune pénalité.",
  hintLabel: "Indice",
  quizDefaultTitle: "Quiz",
  quizNote: "Essais illimités — les explications sont disponibles à tout moment.",
  check: "Vérifier",
  reset: "Réinitialiser",
  showExplain: "Voir l'explication",
  hideExplain: "Masquer l'explication",
  okMsgs: [
    "Tu as saisi l'idée principale.",
    "Bonne méthode !",
    "Exactement — le raisonnement tient.",
  ],
  retryMsgs: [
    "Pas encore — regarde le retour ci-dessous, puis retente quand tu veux.",
    "Une piste utile se cache dans l'explication — réessaie sans pression.",
    "Ce n'est pas la bonne piste, et c'est une information utile : vois pourquoi ci-dessous.",
  ],
  numericOk: "C'est ça — la valeur est dans la tolérance.",
  numericRetry: "Pas tout à fait — vérifie les unités et les chiffres, puis retente librement.",
  numericNaN: "Entre un nombre (la virgule décimale est acceptée).",
  numericPlaceholder: "ta réponse…",
  suggestedMinutes: "min conseillées",
  points: "points",
  examDisclaimer:
    "Sujet reconstruit à des fins d'entraînement — ce n'est pas une épreuve officielle de Paris-Saclay. Tu peux faire une partie seulement, consulter le corrigé à tout moment, partir et revenir : rien n'est enregistré.",
  topicsCovered: "Sujets couverts :",
  timerLabel: "Chronomètre",
  timerOptional: "optionnel",
  start: "Démarrer",
  resume: "Reprendre",
  pause: "Pause",
  stateGroupLabel: "Où en es-tu sur cette leçon ? (repère personnel, modifiable librement)",
  stateLabel: "Ton repère :",
  states: ["Pas exploré", "En cours", "Compris", "À revoir", "Favori ⭐"],
  tocTitle: "Sommaire",
  missionTitle: "La mission",
  missionSolvedTitle: "La question du départ, résolue",
  rappelPrefix: "↺ Rappel express —",
  keyResultsDefault: "À retenir",
  coursesTitle: "Cours",
  tdSectionTitle: "TD — exercices corrigés",
  examSectionTitle: "Examens d'entraînement",
  tdFirstQ: "Tu préfères apprendre en résolvant ?",
  tdFirstLink: "Commence par les TD",
  tdFirstRest: "— chaque exercice relie vers la théorie utile.",
  emCrumb: "Électromagnétisme",
  fmvCrumb: "Fonctions de plusieurs variables",
  analyseCrumb: "Analyse & convergence",
  reseauxCrumb: "Réseaux",
  tdCardText: (n) =>
    `${n} exercices corrigés, avec indices progressifs — à ouvrir dans n'importe quel ordre.`,
  examCardText:
    "chronomètre optionnel, corrigé toujours accessible.",
};

const en: LearnUi = {
  difficultyHint: "Indicative level — never a barrier: everything stays accessible.",
  minutesSuffix: "min",
  objectivesSummary: "What you will explore",
  relatedTitle: "Related exercises",
  relatedHint: "Open them in any order — solutions are always available.",
  theoryUseful: "Useful theory:",
  finalAnswer: "Final answer",
  solution: "Full solution",
  commonErrors: "Common mistakes",
  hintsIntro: "Progressive hints are available — open one whenever you need it, with no penalty.",
  hintLabel: "Hint",
  quizDefaultTitle: "Quiz",
  quizNote: "Unlimited tries — explanations are available at any time.",
  check: "Check",
  reset: "Reset",
  showExplain: "Show explanation",
  hideExplain: "Hide explanation",
  okMsgs: [
    "You got the main idea.",
    "Good method!",
    "Exactly — the reasoning holds.",
  ],
  retryMsgs: [
    "Not yet — read the feedback below, then try again whenever you like.",
    "A useful clue hides in the explanation — retry without pressure.",
    "Not the right track, and that is useful information: see why below.",
  ],
  numericOk: "That's it — the value is within tolerance.",
  numericRetry: "Not quite — check units and digits, then retry freely.",
  numericNaN: "Enter a number (a decimal comma is accepted).",
  numericPlaceholder: "your answer…",
  suggestedMinutes: "min suggested",
  points: "points",
  examDisclaimer:
    "Reconstructed paper for practice — this is not an official Paris-Saclay exam. You can do only part of it, open the corrigé (solution) at any time, leave and come back: nothing is recorded.",
  topicsCovered: "Topics covered:",
  timerLabel: "Timer",
  timerOptional: "optional",
  start: "Start",
  resume: "Resume",
  pause: "Pause",
  stateGroupLabel: "Where are you on this lesson? (personal marker, freely changeable)",
  stateLabel: "Your marker:",
  states: ["Not explored", "Exploring", "Understood", "Review later", "Favorite ⭐"],
  tocTitle: "Contents",
  missionTitle: "The mission",
  missionSolvedTitle: "The opening question, solved",
  rappelPrefix: "↺ Quick reminder —",
  keyResultsDefault: "Key results",
  coursesTitle: "Lessons",
  tdSectionTitle: "TD — solved problem sets",
  examSectionTitle: "Practice exams",
  tdFirstQ: "Prefer to learn by solving?",
  tdFirstLink: "Start with the TDs",
  tdFirstRest: "— every exercise links back to the useful theory.",
  emCrumb: "Electromagnetism",
  fmvCrumb: "Multivariable functions",
  analyseCrumb: "Analysis & convergence",
  reseauxCrumb: "Networks",
  tdCardText: (n) =>
    `${n} solved exercises with progressive hints — open them in any order.`,
  examCardText: "optional timer, solution always accessible.",
};

const es: LearnUi = {
  difficultyHint: "Nivel indicativo — nunca una barrera: todo sigue accesible.",
  minutesSuffix: "min",
  objectivesSummary: "Lo que vas a explorar",
  relatedTitle: "Ejercicios relacionados",
  relatedHint: "Ábrelos en cualquier orden — las soluciones están siempre disponibles.",
  theoryUseful: "Teoría útil:",
  finalAnswer: "Respuesta final",
  solution: "Solución detallada",
  commonErrors: "Errores frecuentes",
  hintsIntro: "Hay pistas progresivas disponibles — abre una cuando la necesites, sin ninguna penalización.",
  hintLabel: "Pista",
  quizDefaultTitle: "Quiz",
  quizNote: "Intentos ilimitados — las explicaciones están disponibles en todo momento.",
  check: "Comprobar",
  reset: "Reiniciar",
  showExplain: "Ver la explicación",
  hideExplain: "Ocultar la explicación",
  okMsgs: [
    "Captaste la idea principal.",
    "¡Buen método!",
    "Exacto — el razonamiento se sostiene.",
  ],
  retryMsgs: [
    "Aún no — mira el comentario de abajo y vuelve a intentarlo cuando quieras.",
    "Una pista útil se esconde en la explicación — reintenta sin presión.",
    "No es la buena pista, y eso es información útil: mira por qué abajo.",
  ],
  numericOk: "Eso es — el valor está dentro de la tolerancia.",
  numericRetry: "No del todo — revisa unidades y cifras, y reintenta libremente.",
  numericNaN: "Introduce un número (se acepta la coma decimal).",
  numericPlaceholder: "tu respuesta…",
  suggestedMinutes: "min recomendados",
  points: "puntos",
  examDisclaimer:
    "Examen reconstruido para practicar — no es una prueba oficial de Paris-Saclay. Puedes hacer solo una parte, consultar la solución en cualquier momento, salir y volver: no se registra nada.",
  topicsCovered: "Temas cubiertos:",
  timerLabel: "Cronómetro",
  timerOptional: "opcional",
  start: "Iniciar",
  resume: "Reanudar",
  pause: "Pausa",
  stateGroupLabel: "¿Dónde estás en esta lección? (marcador personal, modificable libremente)",
  stateLabel: "Tu marcador:",
  states: ["Sin explorar", "En curso", "Entendido", "Repasar luego", "Favorito ⭐"],
  tocTitle: "Índice",
  missionTitle: "La misión",
  missionSolvedTitle: "La pregunta inicial, resuelta",
  rappelPrefix: "↺ Recordatorio exprés —",
  keyResultsDefault: "Para recordar",
  coursesTitle: "Cursos",
  tdSectionTitle: "TD — ejercicios corregidos",
  examSectionTitle: "Exámenes de práctica",
  tdFirstQ: "¿Prefieres aprender resolviendo?",
  tdFirstLink: "Empieza por los TD",
  tdFirstRest: "— cada ejercicio enlaza con la teoría útil.",
  emCrumb: "Electromagnetismo",
  fmvCrumb: "Funciones de varias variables",
  analyseCrumb: "Análisis y convergencia",
  reseauxCrumb: "Redes",
  tdCardText: (n) =>
    `${n} ejercicios corregidos con pistas progresivas — ábrelos en cualquier orden.`,
  examCardText: "cronómetro opcional, solución siempre accesible.",
};

const ALL: Record<Locale, LearnUi> = { fr, en, es };

export function learnUi(locale: Locale): LearnUi {
  return ALL[locale] ?? fr;
}
