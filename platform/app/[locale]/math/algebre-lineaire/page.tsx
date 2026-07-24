import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { homeCrumb, mathCrumb } from "@/lib/nav";
import { isLocale, type Locale } from "@/lib/i18n/config";

const copy = {
  fr: {
    title: "Algèbre linéaire",
    intro: "Quatre invariants et structures fondamentales, rendus manipulables sans perdre les démonstrations.",
    cards: [
      ["nilpotence", "N", "Nilpotence", "Une transformation qui efface l'information par étapes."],
      ["diagonalisation", "λ", "Diagonalisabilité", "Trouver les directions que l'application ne fait qu'étirer."],
      ["trace-determinant", "tr", "Trace & déterminant", "Somme, produit et interprétation géométrique des valeurs propres."],
      ["rang", "r", "Rang", "Mesurer la dimension réellement atteinte par une application."],
      ["exercices", "∑", "Exercices corrigés", "Transposition et dérivation sur les polynômes, intégralement corrigées."],
    ],
  },
  es: {
    title: "Álgebra lineal",
    intro: "Cuatro invariantes y estructuras fundamentales, manipulables sin renunciar a las demostraciones.",
    cards: [
      ["nilpotence", "N", "Nilpotencia", "Una transformación que borra información por etapas."],
      ["diagonalisation", "λ", "Diagonalizabilidad", "Encontrar las direcciones que la aplicación solo estira."],
      ["trace-determinant", "tr", "Traza y determinante", "Suma, producto e interpretación geométrica de los valores propios."],
      ["rang", "r", "Rango", "Medir la dimensión realmente alcanzada por una aplicación."],
      ["exercices", "∑", "Ejercicios resueltos", "Transposición y derivación de polinomios, completamente resueltas."],
    ],
  },
  en: {
    title: "Linear algebra",
    intro: "Four fundamental invariants and structures, made tangible without dropping the proofs.",
    cards: [
      ["nilpotence", "N", "Nilpotency", "A transformation that erases information in stages."],
      ["diagonalisation", "λ", "Diagonalizability", "Find the directions that the map merely stretches."],
      ["trace-determinant", "tr", "Trace & determinant", "Sum, product, and geometry of the eigenvalues."],
      ["rang", "r", "Rank", "Measure the dimension actually reached by a linear map."],
      ["exercices", "∑", "Solved exercises", "Transposition and polynomial differentiation, fully solved."],
    ],
  },
} as const;

export default function LinearAlgebraHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const text = copy[locale];

  return (
    <>
      <Breadcrumbs items={[homeCrumb(locale), mathCrumb(locale), { label: text.title }]} />
      <h1 className="text-5xl">{text.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{text.intro}</p>
      <div className="sub-grid">
        {text.cards.map(([slug, glyph, title, description]) => (
          <Link key={slug} className="sub-card" href={`/${locale}/math/algebre-lineaire/${slug}`}>
            <div className="glyph">{glyph}</div>
            <h3>{title}</h3>
            <p>{description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
