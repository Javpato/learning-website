import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { homeCrumb, mathCrumb } from "@/lib/nav";
import { MATH_EXAMS, MATH_LESSONS, MATH_TDS } from "@/lib/content/math-fmv";
import { ExamCards, LessonCards, TdCards } from "@/components/learn/ModuleHub";

export const metadata = {
  title: "Fonctions de plusieurs variables — Learning",
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
    title: "Fonctions de plusieurs variables",
    filLine:
      "Ce module suit « la vie d'une réaction sur sa surface d'énergie », de la géométrie moléculaire à la spectroscopie IR.",
    intro:
      "L'UE officielle de mathématiques de la L2 Chimie Paris-Saclay (S3, 5 ECTS) : géométrie et coordonnées, surfaces et gradients, extrema, systèmes différentiels et oscillateur harmonique — avec TD corrigés, examens d'entraînement reconstruits et visualisations interactives. Tout est librement accessible, dans l'ordre que tu veux.",
    tdFirstQuestion: "Tu préfères apprendre en résolvant ?",
    tdFirstLink: "Commence par les TD",
    tdFirstRest: "— chaque exercice relie vers la théorie utile.",
    arc1Title: "Arc 1 — Géométrie et représentation",
    arc1Promise:
      "À la fin de cet arc, tu sais lire une surface d'énergie potentielle et décrire la géométrie qui la paramètre.",
    arc2Title: "Arc 2 — Calcul différentiel et extrema",
    arc2Promise:
      "À la fin de cet arc, tu sais suivre les pentes, mesurer les incertitudes et reconnaître réactifs, produits et états de transition.",
    arc3Title: "Arc 3 — Systèmes dynamiques",
    arc3Promise:
      "À la fin de cet arc, tu sais lire une cinétique comme un flot et relier les vibrations au fond d'un puits à la spectroscopie IR.",
    tdTitle: "TD — exercices corrigés",
    examsTitle: "Examens d'entraînement",
    examsIntro:
      "Sujets reconstruits au format Paris-Saclay (contrôle continu, partiel, examen final) — des outils de préparation, jamais des jugements.",
    toolboxTitle: "Boîte à outils",
    toolboxIntro:
      "À consulter ponctuellement : remise à niveau, formulaire et plan de travail ne sont jamais des prérequis pour ouvrir un cours ou un TD.",
    formulaTitle: "Formulaire",
    formulaText: "Tous les résultats clés de l'UE sur une seule page de révision.",
    planTitle: "Plan de travail sur 12 semaines",
    planText: "Le programme intégré maths + physique — purement indicatif.",
  },
  en: {
    title: "Functions of several variables",
    filLine:
      "This module follows “the life of a reaction on its energy surface,” from molecular geometry to IR spectroscopy.",
    intro:
      "The official mathematics course unit in Paris-Saclay's L2 Chimie programme (S3, 5 ECTS): geometry and coordinates, surfaces and gradients, extrema, differential systems, and the harmonic oscillator—with corrected TDs (tutorial sheets), reconstructed practice exams, and interactive visualizations. Everything is freely accessible, in any order you choose.",
    tdFirstQuestion: "Would you rather learn by solving problems?",
    tdFirstLink: "Start with the TDs",
    tdFirstRest: "—each exercise links back to the theory you need.",
    arc1Title: "Arc 1 — Geometry and representation",
    arc1Promise:
      "By the end of this arc, you can read a potential-energy surface and describe the geometry used to parametrize it.",
    arc2Title: "Arc 2 — Differential calculus and extrema",
    arc2Promise:
      "By the end of this arc, you can follow slopes, measure uncertainties, and identify reactants, products, and transition states.",
    arc3Title: "Arc 3 — Dynamical systems",
    arc3Promise:
      "By the end of this arc, you can read kinetics as a flow and connect vibrations at the bottom of a well to IR spectroscopy.",
    tdTitle: "TDs — corrected exercises",
    examsTitle: "Practice exams",
    examsIntro:
      "Reconstructed Paris-Saclay-style papers (contrôle continu or continuous assessment, partiel or midterm exam, and final exam)—preparation tools, never judgments.",
    toolboxTitle: "Toolbox",
    toolboxIntro:
      "Use these whenever helpful: the refresher, formula sheet, and study plan are never prerequisites for opening a lesson or TD.",
    formulaTitle: "Formula sheet",
    formulaText: "All the course unit's key results on a single revision page.",
    planTitle: "12-week study plan",
    planText: "The integrated mathematics + physics programme—purely indicative.",
  },
  es: {
    title: "Funciones de varias variables",
    filLine:
      "Este módulo sigue «la vida de una reacción sobre su superficie de energía», desde la geometría molecular hasta la espectroscopia IR.",
    intro:
      "La unidad curricular oficial de matemáticas de L2 Chimie en Paris-Saclay (S3, 5 ECTS): geometría y coordenadas, superficies y gradientes, extremos, sistemas diferenciales y oscilador armónico, con TD (trabajos dirigidos) resueltos, exámenes de práctica reconstruidos y visualizaciones interactivas. Todo está disponible libremente, en el orden que tú quieras.",
    tdFirstQuestion: "¿Prefieres aprender resolviendo problemas?",
    tdFirstLink: "Empieza por los TD",
    tdFirstRest: "—cada ejercicio enlaza con la teoría que necesitas.",
    arc1Title: "Arco 1 — Geometría y representación",
    arc1Promise:
      "Al final de este arco, sabrás leer una superficie de energía potencial y describir la geometría que la parametriza.",
    arc2Title: "Arco 2 — Cálculo diferencial y extremos",
    arc2Promise:
      "Al final de este arco, sabrás seguir pendientes, medir incertidumbres y reconocer reactivos, productos y estados de transición.",
    arc3Title: "Arco 3 — Sistemas dinámicos",
    arc3Promise:
      "Al final de este arco, sabrás leer una cinética como un flujo y relacionar las vibraciones en el fondo de un pozo con la espectroscopia IR.",
    tdTitle: "TD — ejercicios resueltos",
    examsTitle: "Exámenes de práctica",
    examsIntro:
      "Pruebas reconstruidas con el formato de Paris-Saclay (contrôle continu o evaluación continua, partiel o parcial y examen final): herramientas de preparación, nunca juicios.",
    toolboxTitle: "Caja de herramientas",
    toolboxIntro:
      "Consúltalos cuando te ayuden: el repaso, el formulario y el plan de trabajo nunca son requisitos previos para abrir una lección o un TD.",
    formulaTitle: "Formulario",
    formulaText: "Todos los resultados clave de la unidad curricular en una sola página de repaso.",
    planTitle: "Plan de trabajo de 12 semanas",
    planText: "El programa integrado de matemáticas + física, puramente orientativo.",
  },
};

export default function FmvHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = T[locale] ?? T.fr;
  const base = `/${locale}/math/fonctions-plusieurs-variables`;

  // Three narrative arcs of the official programme.
  const toolbox = MATH_LESSONS.filter((l) => l.slug.startsWith("00-"));
  const arc1 = MATH_LESSONS.filter((l) => {
    const n = Number(l.slug.slice(0, 2));
    return n >= 1 && n <= 3;
  });
  const arc2 = MATH_LESSONS.filter((l) => {
    const n = Number(l.slug.slice(0, 2));
    return n >= 4 && n <= 6;
  });
  const arc3 = MATH_LESSONS.filter((l) => Number(l.slug.slice(0, 2)) >= 7);

  return (
    <>
      <Breadcrumbs items={[homeCrumb(locale), mathCrumb(locale), { label: t.title }]} />
      <h1 className="text-5xl">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-base text-accent">
        {t.filLine}
      </p>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">
        {t.intro}
      </p>
      <p className="sub-card mt-6 max-w-2xl">
        {t.tdFirstQuestion} <Link href="#td">{t.tdFirstLink}</Link>{" "}
        {t.tdFirstRest}
      </p>

      <h2 className="mt-8 font-serif text-2xl text-accent">
        {t.arc1Title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        {t.arc1Promise}
      </p>
      <LessonCards locale={locale} lessons={arc1} numbered={false} />

      <h2 className="mt-8 font-serif text-2xl text-accent">
        {t.arc2Title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        {t.arc2Promise}
      </p>
      <LessonCards locale={locale} lessons={arc2} numbered={false} />

      <h2 className="mt-8 font-serif text-2xl text-accent">
        {t.arc3Title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        {t.arc3Promise}
      </p>
      <LessonCards locale={locale} lessons={arc3} numbered={false} />

      <h2 id="td" className="mt-10 scroll-mt-24 font-serif text-2xl text-accent">
        {t.tdTitle}
      </h2>
      <TdCards locale={locale} tds={MATH_TDS} />

      <h2 className="mt-10 font-serif text-2xl text-accent">{t.examsTitle}</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        {t.examsIntro}
      </p>
      <ExamCards locale={locale} exams={MATH_EXAMS} />

      <h2 className="mt-10 font-serif text-2xl text-accent">{t.toolboxTitle}</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        {t.toolboxIntro}
      </p>
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
