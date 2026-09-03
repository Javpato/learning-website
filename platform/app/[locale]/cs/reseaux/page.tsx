import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { csCrumb, homeCrumb } from "@/lib/nav";
import { RESEAUX_EXAMS, RESEAUX_LESSONS, RESEAUX_TDS } from "@/lib/content/cs-reseaux";
import { ExamCards, LessonCards, TdCards } from "@/components/learn/ModuleHub";

export const metadata = {
  title: "Réseaux — Learning",
};

const T: Record<
  Locale,
  {
    title: string;
    filLine: string;
    intro: string;
    tdFirstQuestion: string;
    tdFirstLink: string;
    tdFirstRest: string;
    arc1Title: string;
    arc1Promise: string;
    arc2Title: string;
    arc2Promise: string;
    arc3Title: string;
    arc3Promise: string;
    arc4Title: string;
    arc4Promise: string;
    tdTitle: string;
    examsTitle: string;
    examsIntro: string;
    toolboxTitle: string;
    toolboxIntro: string;
    formulaTitle: string;
    formulaText: string;
    planTitle: string;
    planText: string;
  }
> = {
  fr: {
    title: "Réseaux",
    filLine:
      "Une seule question, du câble jusqu'au navigateur : comment deux programmes séparés par des milliers de kilomètres échangent-ils des octets sans se tromper ? Chaque mécanisme se calcule à la main.",
    intro:
      "Commutation, couches, codage, liaison, IP, routage, TCP — le module Réseaux de L2 reconstruit à partir des transparents du cours, de ses TD corrigés et de ses annales. Chaque leçon part d'un problème chiffré d'annale, donne les définitions numérotées, déroule les calculs pas à pas, et se manipule dans un simulateur. TD corrigés et sujets d'entraînement inclus ; tout est librement accessible, dans l'ordre que tu veux.",
    tdFirstQuestion: "Tu préfères apprendre en résolvant ?",
    tdFirstLink: "Commence par les TD",
    tdFirstRest: "— chaque exercice indique la théorie utile et la forme de rédaction attendue.",
    arc1Title: "Partie A — Le voyage d'un message",
    arc1Promise:
      "À la fin de cette partie, tu sais choisir entre circuits et paquets, construire un chronogramme de bout en bout, calculer un débit effectif, et suivre un message à travers les couches.",
    arc2Title: "Partie B — Les couches basses",
    arc2Promise:
      "À la fin de cette partie, tu sais tracer un signal codé, vérifier une capacité de Shannon, poser un CRC, dérouler une reprise REJ/SREJ et justifier les 64 octets minimum d'Ethernet.",
    arc3Title: "Partie C — IP et le routage",
    arc3Promise:
      "À la fin de cette partie, tu sais découper un site en sous-réseaux, fragmenter un datagramme à travers plusieurs MTU, itérer des vecteurs de distances et dérouler Dijkstra — les quatre exercices qui reviennent à chaque partiel.",
    arc4Title: "Partie D — Le transport",
    arc4Promise:
      "À la fin de cette partie, tu sais calculer les SEQ/ACK d'un échange TCP, dimensionner un temporisateur, borner un débit par fenêtre/RTT et tracer la fenêtre de congestion RTT par RTT.",
    tdTitle: "TD — exercices corrigés",
    examsTitle: "Sujets d'entraînement",
    examsIntro:
      "Sujets assemblés d'après les annales du module (partiel d'1 h, partiel de 2 h, examen final) — des outils de préparation, jamais des jugements. Aucun n'est un sujet officiel.",
    toolboxTitle: "Boîte à outils",
    toolboxIntro:
      "À consulter ponctuellement : la remise à niveau et le formulaire ne sont jamais des prérequis pour ouvrir un cours ou un TD.",
    formulaTitle: "Formulaire",
    formulaText:
      "Formules de délais, masques, recette de fragmentation, règles DV/Dijkstra, RTO et fenêtres — avec, pour chaque question type, la phrase à écrire.",
    planTitle: "Plan de travail",
    planText: "Un parcours conseillé sur six semaines, du binaire au contrôle de congestion.",
  },
  en: {
    title: "Networks",
    filLine:
      "One question, from the cable to the browser: how do two programs thousands of kilometres apart exchange bytes without getting them wrong? Every mechanism is computed by hand.",
    intro:
      "Switching, layers, coding, data link, IP, routing, TCP — the L2 networking module rebuilt from the course's own slides, corrected TDs (tutorial sheets), and past papers. Every lesson starts from a numbered past-paper problem, gives the numbered definitions, walks the computations step by step, and can be manipulated in a simulator. Corrected TDs and practice papers included; everything is freely accessible, in any order you choose.",
    tdFirstQuestion: "Would you rather learn by solving problems?",
    tdFirstLink: "Start with the TDs",
    tdFirstRest: "— each exercise names the theory you need and the write-up form examiners expect.",
    arc1Title: "Part A — A message's journey",
    arc1Promise:
      "By the end of this part, you can choose between circuits and packets, build an end-to-end timing diagram, compute an effective throughput, and follow a message through the layers.",
    arc2Title: "Part B — The lower layers",
    arc2Promise:
      "By the end of this part, you can draw a coded signal, check a Shannon capacity, run a CRC, play out a REJ/SREJ recovery, and justify Ethernet's 64-byte minimum.",
    arc3Title: "Part C — IP and routing",
    arc3Promise:
      "By the end of this part, you can subnet a site, fragment a datagram across several MTUs, iterate distance vectors, and run Dijkstra — the four exercises that come back on every midterm.",
    arc4Title: "Part D — Transport",
    arc4Promise:
      "By the end of this part, you can compute a TCP exchange's SEQ/ACK numbers, size a retransmission timer, bound throughput by window/RTT, and plot the congestion window RTT by RTT.",
    tdTitle: "TDs — corrected exercises",
    examsTitle: "Practice papers",
    examsIntro:
      "Papers assembled from the module's past exams (1-hour midterm, 2-hour midterm, final) — preparation tools, never judgments. None of them is an official paper.",
    toolboxTitle: "Toolbox",
    toolboxIntro:
      "Dip in when useful: the refresher and the formula sheet are never prerequisites for opening a lesson or a TD.",
    formulaTitle: "Formula sheet",
    formulaText:
      "Delay formulas, masks, the fragmentation recipe, DV/Dijkstra rules, RTO and windows — with, for each question type, the sentence to write.",
    planTitle: "Study plan",
    planText: "A suggested six-week path, from binary to congestion control.",
  },
  es: {
    title: "Redes",
    filLine:
      "Una sola pregunta, del cable al navegador: ¿cómo intercambian octetos sin equivocarse dos programas separados por miles de kilómetros? Cada mecanismo se calcula a mano.",
    intro:
      "Conmutación, capas, codificación, enlace, IP, enrutamiento, TCP — el módulo de Redes de L2 reconstruido a partir de las transparencias del curso, sus TD corregidos y sus exámenes anteriores. Cada lección parte de un problema con números de examen, da las definiciones numeradas, desarrolla los cálculos paso a paso y se manipula en un simulador. Incluye TD resueltos y exámenes de práctica; todo es de libre acceso, en el orden que prefieras.",
    tdFirstQuestion: "¿Prefieres aprender resolviendo?",
    tdFirstLink: "Empieza por los TD",
    tdFirstRest: "— cada ejercicio indica la teoría útil y la forma de redacción esperada.",
    arc1Title: "Parte A — El viaje de un mensaje",
    arc1Promise:
      "Al final de esta parte sabrás elegir entre circuitos y paquetes, construir un cronograma de extremo a extremo, calcular un caudal efectivo y seguir un mensaje a través de las capas.",
    arc2Title: "Parte B — Las capas bajas",
    arc2Promise:
      "Al final de esta parte sabrás trazar una señal codificada, verificar una capacidad de Shannon, calcular un CRC, desarrollar una recuperación REJ/SREJ y justificar los 64 octetos mínimos de Ethernet.",
    arc3Title: "Parte C — IP y el enrutamiento",
    arc3Promise:
      "Al final de esta parte sabrás dividir un sitio en subredes, fragmentar un datagrama a través de varias MTU, iterar vectores de distancias y ejecutar Dijkstra: los cuatro ejercicios que vuelven en cada parcial.",
    arc4Title: "Parte D — El transporte",
    arc4Promise:
      "Al final de esta parte sabrás calcular los SEQ/ACK de un intercambio TCP, dimensionar un temporizador, acotar el caudal por ventana/RTT y trazar la ventana de congestión RTT a RTT.",
    tdTitle: "TD — ejercicios resueltos",
    examsTitle: "Exámenes de práctica",
    examsIntro:
      "Pruebas montadas a partir de los exámenes del módulo (parcial de 1 h, parcial de 2 h, examen final): herramientas de preparación, nunca juicios. Ninguna es un examen oficial.",
    toolboxTitle: "Caja de herramientas",
    toolboxIntro:
      "Consúltalos cuando te ayuden: la puesta al día y el formulario nunca son requisitos previos para abrir una lección o un TD.",
    formulaTitle: "Formulario",
    formulaText:
      "Fórmulas de retardos, máscaras, receta de fragmentación, reglas DV/Dijkstra, RTO y ventanas — con la frase que hay que escribir para cada tipo de pregunta.",
    planTitle: "Plan de trabajo",
    planText: "Un recorrido sugerido de seis semanas, del binario al control de congestión.",
  },
};

const num = (slug: string) => Number(slug.slice(0, 2));

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = T[locale] ?? T.fr;

  const arcA = RESEAUX_LESSONS.filter((l) => num(l.slug) >= 1 && num(l.slug) <= 3);
  const arcB = RESEAUX_LESSONS.filter((l) => num(l.slug) >= 4 && num(l.slug) <= 7);
  const arcC = RESEAUX_LESSONS.filter((l) => num(l.slug) >= 8 && num(l.slug) <= 10);
  const arcD = RESEAUX_LESSONS.filter((l) => num(l.slug) >= 11);
  const toolbox = RESEAUX_LESSONS.filter((l) => num(l.slug) === 0);

  return (
    <>
      <Breadcrumbs items={[homeCrumb(locale), csCrumb(locale), { label: t.title }]} />
      <h1>{t.title}</h1>
      <p className="accroche">{t.filLine}</p>
      <p style={{ maxWidth: "46rem", color: "var(--fg-muted)" }}>{t.intro}</p>
      <p style={{ maxWidth: "46rem" }}>
        {t.tdFirstQuestion} <Link href={`/${locale}/cs/reseaux/td-1`}>{t.tdFirstLink}</Link> {t.tdFirstRest}
      </p>

      <h2>{t.arc1Title}</h2>
      <p style={{ maxWidth: "46rem", color: "var(--fg-muted)" }}>{t.arc1Promise}</p>
      <LessonCards locale={locale} lessons={arcA} />

      <h2>{t.arc2Title}</h2>
      <p style={{ maxWidth: "46rem", color: "var(--fg-muted)" }}>{t.arc2Promise}</p>
      <LessonCards locale={locale} lessons={arcB} />

      <h2>{t.arc3Title}</h2>
      <p style={{ maxWidth: "46rem", color: "var(--fg-muted)" }}>{t.arc3Promise}</p>
      <LessonCards locale={locale} lessons={arcC} />

      <h2>{t.arc4Title}</h2>
      <p style={{ maxWidth: "46rem", color: "var(--fg-muted)" }}>{t.arc4Promise}</p>
      <LessonCards locale={locale} lessons={arcD} />

      <h2>{t.tdTitle}</h2>
      <TdCards locale={locale} tds={RESEAUX_TDS} />

      <h2>{t.examsTitle}</h2>
      <p style={{ maxWidth: "46rem", color: "var(--fg-muted)" }}>{t.examsIntro}</p>
      <ExamCards locale={locale} exams={RESEAUX_EXAMS} />

      <h2>{t.toolboxTitle}</h2>
      <p style={{ maxWidth: "46rem", color: "var(--fg-muted)" }}>{t.toolboxIntro}</p>
      <LessonCards locale={locale} lessons={toolbox} numbered={false} />
      <div className="sub-grid">
        <Link className="sub-card" href={`/${locale}/cs/reseaux/formulaire`}>
          <div className="glyph">∑</div>
          <h3>{t.formulaTitle}</h3>
          <p>{t.formulaText}</p>
        </Link>
        <Link className="sub-card" href={`/${locale}/cs/reseaux/plan-de-travail`}>
          <div className="glyph">🗺</div>
          <h3>{t.planTitle}</h3>
          <p>{t.planText}</p>
        </Link>
      </div>
    </>
  );
}
