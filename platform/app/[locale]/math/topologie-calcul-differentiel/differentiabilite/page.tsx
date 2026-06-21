import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import ContentFr from "./content.fr.mdx";
import ContentEs from "./content.es.mdx";
import ContentEn from "./content.en.mdx";

export const metadata = {
  title: "Différentiabilité — Learning",
};

const CONTENT: Record<Locale, typeof ContentFr> = { fr: ContentFr, es: ContentEs, en: ContentEn };
const CRUMBS: Record<Locale, { module: string; leaf: string }> = {
  fr: { module: "Topologie & calcul différentiel", leaf: "Différentiabilité" },
  es: { module: "Topología y cálculo diferencial", leaf: "Diferenciabilidad" },
  en: { module: "Topology & differential calculus", leaf: "Differentiability" },
};

export default function DifferentiabilitePage({
  params,
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const Content = CONTENT[locale] ?? CONTENT.fr;
  const c = CRUMBS[locale] ?? CRUMBS.fr;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t.home, href: "/learning-website/", external: true },
          { label: t.math, href: "/learning-website/math/", external: true },
          {
            label: c.module,
            href: `${base}/math/topologie-calcul-differentiel`,
          },
          { label: c.leaf },
        ]}
      />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
