import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { homeCrumb, mathCrumb } from "@/lib/nav";
import { ANALYSE_EXAMS, ANALYSE_LESSONS, ANALYSE_TDS } from "@/lib/content/math-analyse";
import { ExamCards, LessonCards, TdCards } from "@/components/learn/ModuleHub";

export const metadata = {
  title: "Analyse & convergence — Learning",
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
    title: "Analyse & convergence",
    filLine:
      "Un fil rouge : un signal qu'on échantillonne, qu'on somme, qu'on approche — et la question « ai-je le droit ? » posée à chaque étape.",
    intro:
      "Séries numériques, suites et séries de fonctions, séries entières, intégrales à paramètre et intégrales doubles — reconstruits à partir du polycopié du cours et de ses annales. Chaque leçon enseigne d'abord l'intuition, puis la définition, puis la façon de choisir le théorème et de rédiger la justification. TD corrigés et sujets d'entraînement inclus, tout est librement accessible, dans l'ordre que tu veux.",
    tdFirstQuestion: "Tu préfères apprendre en résolvant ?",
    tdFirstLink: "Commence par les TD",
    tdFirstRest: "— chaque exercice relie vers la théorie utile.",
    arc1Title: "Arc 1 — Séries numériques : décider de la nature",
    arc1Promise:
      "À la fin de cet arc, tu sais choisir un critère, vérifier ses hypothèses, reconnaître un cas où il ne conclut pas, et majorer un reste.",
    arc2Title: "Arc 2 — Convergence de fonctions : simple, uniforme, normale",
    arc2Promise:
      "À la fin de cet arc, tu sais calculer une norme uniforme, réfuter l'uniformité par une suite témoin, et justifier un échange limite-intégrale-dérivée.",
    arc3Title: "Arc 3 — Séries entières, intégrales à paramètre, synthèse",
    arc3Promise:
      "À la fin de cet arc, tu sais trouver un rayon, traiter le bord à part, dériver sous une intégrale avec domination, et construire la fonction auxiliaire qui démontre une identité.",
    tdTitle: "TD — exercices corrigés",
    examsTitle: "Sujets d'entraînement",
    examsIntro:
      "Sujets reconstruits d'après les annales du cours (contrôle continu, partiel, examen final) — des outils de préparation, jamais des jugements. Aucun n'est un sujet officiel.",
    toolboxTitle: "Boîte à outils",
    toolboxIntro:
      "À consulter ponctuellement : la remise à niveau, le formulaire et le plan de travail ne sont jamais des prérequis pour ouvrir un cours ou un TD.",
    formulaTitle: "Formulaire",
    formulaText:
      "Séries de référence, critères, théorèmes d'échange et modèles de rédaction sur une seule page.",
    planTitle: "Plan de travail sur 14 semaines",
    planText: "Une progression indicative, avec les mini-tests de révision espacée.",
  },
  en: {
    title: "Analysis & convergence",
    filLine:
      "One running thread: a signal you sample, sum, and approximate—with the question “am I allowed to?” asked at every step.",
    intro:
      "Numerical series, sequences and series of functions, power series, parameter-dependent integrals, and double integrals—rebuilt from the course's own lecture notes and past papers. Every lesson teaches the intuition first, then the definition, then how to choose the theorem and write the justification. Corrected TDs (tutorial sheets) and practice papers included; everything is freely accessible, in any order you choose.",
    tdFirstQuestion: "Would you rather learn by solving problems?",
    tdFirstLink: "Start with the TDs",
    tdFirstRest: "—each exercise links back to the theory you need.",
    arc1Title: "Arc 1 — Numerical series: settling the behaviour",
    arc1Promise:
      "By the end of this arc, you can choose a test, check its hypotheses, recognize a case where it concludes nothing, and bound a remainder.",
    arc2Title: "Arc 2 — Convergence of functions: pointwise, uniform, normal",
    arc2Promise:
      "By the end of this arc, you can compute a uniform norm, disprove uniformity with a witness sequence, and justify swapping a limit, an integral, or a derivative.",
    arc3Title: "Arc 3 — Power series, parameter integrals, synthesis",
    arc3Promise:
      "By the end of this arc, you can find a radius, treat the boundary separately, differentiate under an integral with a domination bound, and build the auxiliary function that proves an identity.",
    tdTitle: "TDs — corrected exercises",
    examsTitle: "Practice papers",
    examsIntro:
      "Papers reconstructed from the course's past exams (continuous assessment, midterm, final)—preparation tools, never judgments. None of them is an official paper.",
    toolboxTitle: "Toolbox",
    toolboxIntro:
      "Dip in when useful: the refresher, the formula sheet, and the study plan are never prerequisites for opening a lesson or a TD.",
    formulaTitle: "Formula sheet",
    formulaText:
      "Reference series, tests, interchange theorems, and writing templates on a single page.",
    planTitle: "14-week study plan",
    planText: "An indicative progression, with the spaced-recall mini-tests.",
  },
  es: {
    title: "Análisis y convergencia",
    filLine:
      "Un hilo conductor: una señal que se muestrea, se suma y se aproxima, con la pregunta «¿tengo derecho a hacerlo?» en cada paso.",
    intro:
      "Series numéricas, sucesiones y series de funciones, series enteras, integrales con parámetro e integrales dobles, reconstruidos a partir del polycopié del curso y de sus exámenes anteriores. Cada lección enseña primero la intuición, luego la definición y después cómo elegir el teorema y redactar la justificación. Incluye TD (trabajos dirigidos) resueltos y exámenes de práctica; todo es de libre acceso, en el orden que prefieras.",
    tdFirstQuestion: "¿Prefieres aprender resolviendo?",
    tdFirstLink: "Empieza por los TD",
    tdFirstRest: "— cada ejercicio enlaza con la teoría necesaria.",
    arc1Title: "Arco 1 — Series numéricas: decidir la naturaleza",
    arc1Promise:
      "Al final de este arco sabrás elegir un criterio, verificar sus hipótesis, reconocer un caso en el que no concluye y acotar un resto.",
    arc2Title: "Arco 2 — Convergencia de funciones: simple, uniforme, normal",
    arc2Promise:
      "Al final de este arco sabrás calcular una norma uniforme, refutar la uniformidad con una sucesión testigo y justificar un intercambio de límite, integral o derivada.",
    arc3Title: "Arco 3 — Series enteras, integrales con parámetro, síntesis",
    arc3Promise:
      "Al final de este arco sabrás hallar un radio, tratar el borde aparte, derivar bajo una integral con dominación y construir la función auxiliar que demuestra una identidad.",
    tdTitle: "TD — ejercicios resueltos",
    examsTitle: "Exámenes de práctica",
    examsIntro:
      "Pruebas reconstruidas a partir de los exámenes anteriores del curso (control continuo, parcial, examen final): herramientas de preparación, nunca juicios. Ninguna es un examen oficial.",
    toolboxTitle: "Caja de herramientas",
    toolboxIntro:
      "Consúltalos cuando te ayuden: la puesta al día, el formulario y el plan de trabajo nunca son requisitos previos para abrir una lección o un TD.",
    formulaTitle: "Formulario",
    formulaText:
      "Series de referencia, criterios, teoremas de intercambio y modelos de redacción en una sola página.",
    planTitle: "Plan de trabajo de 14 semanas",
    planText: "Una progresión orientativa, con los minitests de repaso espaciado.",
  },
};

export default function AnalyseHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = T[locale] ?? T.fr;
  const base = `/${locale}/math/analyse-convergence`;

  const n = (slug: string) => Number(slug.slice(0, 2));
  const toolbox = ANALYSE_LESSONS.filter((l) => n(l.slug) === 0);
  const arc1 = ANALYSE_LESSONS.filter((l) => n(l.slug) >= 1 && n(l.slug) <= 4);
  const arc2 = ANALYSE_LESSONS.filter((l) => n(l.slug) >= 5 && n(l.slug) <= 7);
  const arc3 = ANALYSE_LESSONS.filter((l) => n(l.slug) >= 8);

  return (
    <>
      <Breadcrumbs items={[homeCrumb(locale), mathCrumb(locale), { label: t.title }]} />
      <h1 className="text-5xl">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-base text-accent">{t.filLine}</p>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{t.intro}</p>
      <p className="sub-card mt-6 max-w-2xl">
        {t.tdFirstQuestion} <Link href="#td">{t.tdFirstLink}</Link> {t.tdFirstRest}
      </p>

      <h2 className="mt-8 font-serif text-2xl text-accent">{t.arc1Title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">{t.arc1Promise}</p>
      <LessonCards locale={locale} lessons={arc1} numbered={false} />

      <h2 className="mt-8 font-serif text-2xl text-accent">{t.arc2Title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">{t.arc2Promise}</p>
      <LessonCards locale={locale} lessons={arc2} numbered={false} />

      <h2 className="mt-8 font-serif text-2xl text-accent">{t.arc3Title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">{t.arc3Promise}</p>
      <LessonCards locale={locale} lessons={arc3} numbered={false} />

      <h2 id="td" className="mt-10 scroll-mt-24 font-serif text-2xl text-accent">
        {t.tdTitle}
      </h2>
      <TdCards locale={locale} tds={ANALYSE_TDS} />

      <h2 className="mt-10 font-serif text-2xl text-accent">{t.examsTitle}</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">{t.examsIntro}</p>
      <ExamCards locale={locale} exams={ANALYSE_EXAMS} />

      <h2 className="mt-10 font-serif text-2xl text-accent">{t.toolboxTitle}</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">{t.toolboxIntro}</p>
      <LessonCards locale={locale} lessons={toolbox} numbered={false} />
      <div className="sub-grid">
        <Link className="sub-card" href={`${base}/formulaire`}>
          <div className="glyph">📋</div>
          <h3>{t.formulaTitle}</h3>
          <p>{t.formulaText}</p>
        </Link>
        <Link className="sub-card" href={`${base}/plan-de-travail`}>
          <div className="glyph">🗓</div>
          <h3>{t.planTitle}</h3>
          <p>{t.planText}</p>
        </Link>
      </div>
    </>
  );
}
