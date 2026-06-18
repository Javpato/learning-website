import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";

export default function Home({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);

  return (
    <>
      <h1 className="text-5xl">{t.brand}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{t.tagline}</p>

      <div className="sub-grid">
        <Link className="sub-card" href={`/${locale}/math`}>
          <div className="glyph">∑</div>
          <h3>{t.math}</h3>
          <p>
            Topologie, calcul différentiel, algèbre linéaire — l&apos;intuition
            géométrique, des démos interactives et les démonstrations complètes.
          </p>
        </Link>
      </div>
    </>
  );
}
