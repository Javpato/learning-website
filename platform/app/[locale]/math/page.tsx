import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { homeCrumb } from "@/lib/nav";

export default function MathHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
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

        <div className="sub-card opacity-55 [cursor:default]">
          <div className="glyph">λ</div>
          <h3>Algèbre linéaire</h3>
          <p>
            À porter depuis le site historique — nilpotence, diagonalisabilité,
            trace &amp; déterminant, rang.
          </p>
        </div>
      </div>
    </>
  );
}
