import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { homeCrumb } from "@/lib/nav";

const FMV_CARD: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Fonctions de plusieurs variables",
    description:
      "Les mathématiques pour la chimie — l'UE officielle L2 Chimie Paris-Saclay : surfaces, gradient, extrema, systèmes différentiels et oscillateur harmonique — cours, TD corrigés et examens d'entraînement.",
  },
  en: {
    title: "Functions of several variables",
    description:
      "Mathematics for chemistry—the official Paris-Saclay L2 Chimie course unit: surfaces, gradients, extrema, differential systems, and the harmonic oscillator—lessons, corrected TDs (tutorial sheets), and practice exams.",
  },
  es: {
    title: "Funciones de varias variables",
    description:
      "Matemáticas para química: la unidad curricular oficial de L2 Chimie en Paris-Saclay; superficies, gradiente, extremos, sistemas diferenciales y oscilador armónico, con lecciones, TD (trabajos dirigidos) resueltos y exámenes de práctica.",
  },
};

export default function MathHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const fmvCard = FMV_CARD[locale] ?? FMV_CARD.fr;
  const base = `/${locale}`;

  return (
    <>
      <Breadcrumbs
        items={[homeCrumb(locale), { label: t.math }]}
      />
      <h1 className="text-5xl">{t.mathHubTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{t.mathHubSub}</p>

      <div className="sub-grid">
        <Link
          className="sub-card"
          href={`${base}/math/topologie-calcul-differentiel`}
        >
          <div className="glyph">∂</div>
          <h3>Topologie &amp; calcul différentiel</h3>
          <p>
            Différentiabilité dans les espaces vectoriels, différentielle,
            plan tangent — vus par le zoom et la linéarisation, avec
            démonstrations.
          </p>
        </Link>

        <Link
          className="sub-card"
          href={`${base}/math/fonctions-plusieurs-variables`}
        >
          <div className="glyph">∇</div>
          <h3>{fmvCard.title}</h3>
          <p>{fmvCard.description}</p>
        </Link>

        <Link className="sub-card" href={`${base}/math/algebre-lineaire`}>
          <div className="glyph">λ</div>
          <h3>Algèbre linéaire</h3>
          <p>
            Nilpotence, diagonalisabilité, trace &amp; déterminant, rang —
            quatre notions vues par l&apos;intuition géométrique, avec démos
            interactives et exercices corrigés.
          </p>
        </Link>
      </div>
    </>
  );
}
