import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { homeCrumb, physicsCrumb } from "@/lib/nav";
import { PHYS_THEMES, PHYS_EXAMS } from "@/lib/content/physics-em";
import { l10n } from "@/lib/content/types";
import { ExamCards } from "@/components/learn/ModuleHub";

export const metadata = {
  title: "Électromagnétisme — Learning",
};

const T: Record<
  Locale,
  {
    examsTitle: string;
    examsIntro: string;
    formulaTitle: string;
    formulaText: string;
    planTitle: string;
    planText: string;
  }
> = {
  fr: {
    examsTitle: "Examens d'entraînement",
    examsIntro:
      "Sujets reconstruits — des outils de préparation, jamais des jugements. Chronomètre optionnel, corrigés toujours accessibles.",
    formulaTitle: "Formulaire",
    formulaText: "Toutes les lois et formules clés du parcours, sur une seule page de révision.",
    planTitle: "Plan de travail sur 12 semaines",
    planText:
      "Le programme intégré maths + physique, purement indicatif — explore dans l'ordre que tu veux.",
  },
  en: {
    examsTitle: "Practice exams",
    examsIntro:
      "Reconstructed papers—preparation tools, never judgments. The timer is optional, and the corrigés (solutions) are always accessible.",
    formulaTitle: "Formula sheet",
    formulaText: "All the track's key laws and formulas on a single revision page.",
    planTitle: "12-week study plan",
    planText:
      "The integrated mathematics + physics programme is purely indicative—explore it in any order you choose.",
  },
  es: {
    examsTitle: "Exámenes de práctica",
    examsIntro:
      "Pruebas reconstruidas: herramientas de preparación, nunca juicios. El cronómetro es opcional y los corrigés (solucionarios) están siempre disponibles.",
    formulaTitle: "Formulario",
    formulaText: "Todas las leyes y fórmulas clave del itinerario en una sola página de repaso.",
    planTitle: "Plan de trabajo de 12 semanas",
    planText:
      "El programa integrado de matemáticas + física es puramente orientativo: explóralo en el orden que tú quieras.",
  },
};

export default function PhysicsHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const copy = T[locale] ?? T.fr;
  const base = `/${locale}`;

  return (
    <>
      <Breadcrumbs items={[homeCrumb(locale), physicsCrumb(locale), { label: t.physicsHubTitle }]} />
      <h1 className="text-5xl">{t.physicsHubTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{t.physicsHubSub}</p>

      <div className="sub-grid">
        {PHYS_THEMES.map((theme) => (
          <Link key={theme.slug} className="sub-card" href={`${base}/physics/${theme.slug}`}>
            <div className="glyph">{theme.glyph}</div>
            <h3>{l10n(locale, theme.title)}</h3>
            <p>{l10n(locale, theme.description)}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 font-serif text-2xl text-accent">{copy.examsTitle}</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        {copy.examsIntro}
      </p>
      <ExamCards locale={locale} exams={PHYS_EXAMS} />

      <div className="sub-grid">
        <Link className="sub-card" href={`${base}/physics/formulaire`}>
          <div className="glyph">📋</div>
          <h3>{copy.formulaTitle}</h3>
          <p>{copy.formulaText}</p>
        </Link>
        <Link className="sub-card" href={`${base}/math/fonctions-plusieurs-variables/plan-de-travail`}>
          <div className="glyph">🗓</div>
          <h3>{copy.planTitle}</h3>
          <p>{copy.planText}</p>
        </Link>
      </div>
    </>
  );
}
