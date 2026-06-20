import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function ModuleHub({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const mod = `${base}/math/topologie-calcul-differentiel`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t.home, href: base },
          { label: t.math, href: `${base}/math` },
          { label: "Topologie & calcul différentiel" },
        ]}
      />
      <h1 className="text-5xl">Topologie &amp; calcul différentiel</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">
        Topologie des espaces vectoriels normés puis calcul différentiel : des normes
        et des boules aux ouverts, fermés et suites, jusqu&apos;à la différentiabilité.
        Chaque notion est d&apos;abord <em>manipulée</em>, puis <em>démontrée</em>.
      </p>

      <div className="sub-grid">
        <Link className="sub-card" href={`${mod}/normes`}>
          <div className="glyph">‖·‖</div>
          <h3>Normes</h3>
          <p>
            Mesurer la taille d&apos;un vecteur — boules unités p, norme
            intégrale sur les fonctions, et pourquoi la dimension finie est
            spéciale (équivalence des normes).
          </p>
        </Link>

        <Link className="sub-card" href={`${mod}/boules`}>
          <div className="glyph">B</div>
          <h3>Boules ouvertes &amp; fermées</h3>
          <p>
            <em>B(x, r)</em> selon la norme, ouverte ou fermée, et le zoom
            infini : de près, une boule ne change pas de forme.
          </p>
        </Link>

        <Link className="sub-card" href={`${mod}/ouverts-fermes`}>
          <div className="glyph">O</div>
          <h3>Ouverts &amp; fermés</h3>
          <p>
            <em>O</em> ouvert ⟺ tout point a une boule entièrement dans <em>O</em>.
            Intérieur, adhérence, frontière — la définition rendue visible.
          </p>
        </Link>

        <Link className="sub-card" href={`${mod}/suites-convergence`}>
          <div className="glyph">uₙ</div>
          <h3>Suites &amp; convergence</h3>
          <p>
            <em>uₙ → ℓ</em> ⟺ <em>‖uₙ − ℓ‖ → 0</em>. Unicité de la limite,
            fermés caractérisés par les suites, complétude.
          </p>
        </Link>

        <Link className="sub-card" href={`${mod}/differentiabilite`}>
          <div className="glyph">df</div>
          <h3>Différentiabilité</h3>
          <p>
            De près, une fonction différentiable <em>est</em> une application
            linéaire. Visualisation 2D/3D du zoom et de l&apos;approximation
            tangente, puis la démonstration.
          </p>
        </Link>

        <Link className="sub-card" href={`${mod}/stabilisation-noyau-image`}>
          <div className="glyph">ker</div>
          <h3>Stabilisation noyau / image</h3>
          <p>
            <em>ker f = ker f²</em> ⟺ <em>im f = im f²</em>. On itère, le noyau
            gonfle, l&apos;image rétrécit — visualisation interactive et
            démonstration par le théorème du rang.
          </p>
        </Link>

        <Link className="sub-card" href={`${mod}/boule-chevelue`}>
          <div className="glyph">🦔</div>
          <h3>Théorème de la boule chevelue</h3>
          <p>
            On ne peut pas coiffer une sphère sans épi : tout champ tangent
            continu sur <em>S²</em> s&apos;annule quelque part. Visualisation 3D.
          </p>
        </Link>

        <Link className="sub-card" href={`${mod}/drapeaux`}>
          <div className="glyph">⚑</div>
          <h3>Drapeaux</h3>
          <p>
            Une suite emboîtée de sous-espaces {`{0} ⊂ D₁ ⊂ ⋯ ⊂ E`}. Drapeau
            complet, lien avec la triangulation. Visualisation 3D.
          </p>
        </Link>
      </div>
    </>
  );
}
