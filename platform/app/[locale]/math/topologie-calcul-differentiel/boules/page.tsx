import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Content from "./content.mdx";

export const metadata = {
  title: "Boules ouvertes et fermées — Formules Vivantes",
};

export default function BoulesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t.home, href: base },
          { label: t.math, href: `${base}/math` },
          {
            label: "Topologie & calcul différentiel",
            href: `${base}/math/topologie-calcul-differentiel`,
          },
          { label: "Boules ouvertes et fermées" },
        ]}
      />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
