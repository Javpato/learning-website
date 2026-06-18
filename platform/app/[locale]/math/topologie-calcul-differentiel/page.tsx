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
        Calcul différentiel dans les espaces vectoriels normés : différentiabilité,
        différentielle, lien avec les dérivées partielles. Chaque notion est
        d&apos;abord <em>manipulée</em>, puis <em>démontrée</em>.
      </p>

      <div className="sub-grid">
        <Link className="sub-card" href={`${mod}/differentiabilite`}>
          <div className="glyph">df</div>
          <h3>Différentiabilité</h3>
          <p>
            De près, une fonction différentiable <em>est</em> une application
            linéaire. Visualisation 2D/3D du zoom et de l&apos;approximation
            tangente, puis la démonstration.
          </p>
        </Link>
      </div>
    </>
  );
}
