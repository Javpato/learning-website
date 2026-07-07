import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { homeCrumb, mathCrumb } from "@/lib/nav";
import ContentFr from "./content.fr.mdx";
import ContentEs from "./content.es.mdx";
import ContentEn from "./content.en.mdx";

export const metadata = {
  title: "Théorème de la boule chevelue — Learning",
};

const CONTENT: Record<Locale, typeof ContentFr> = { fr: ContentFr, es: ContentEs, en: ContentEn };
const CRUMBS: Record<Locale, { module: string; leaf: string }> = {
  fr: { module: "Topologie & calcul différentiel", leaf: "Théorème de la boule chevelue" },
  es: { module: "Topología y cálculo diferencial", leaf: "Teorema de la bola peluda" },
  en: { module: "Topology & differential calculus", leaf: "The hairy ball theorem" },
};

export default function BouleChevelePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const base = `/${locale}`;
  const Content = CONTENT[locale] ?? CONTENT.fr;
  const c = CRUMBS[locale] ?? CRUMBS.fr;

  return (
    <>
      <Breadcrumbs
        items={[
          homeCrumb(locale),
          mathCrumb(locale),
          { label: c.module, href: `${base}/math/topologie-calcul-differentiel` },
          { label: c.leaf },
        ]}
      />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
