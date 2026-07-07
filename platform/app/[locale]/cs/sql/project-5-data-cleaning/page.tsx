import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { csCrumb, homeCrumb } from "@/lib/nav";
import ContentFr from "./content.fr.mdx";
import ContentEs from "./content.es.mdx";
import ContentEn from "./content.en.mdx";

export const metadata = { title: "Project 5 · Clean & format — Learning" };

const CONTENT: Record<Locale, typeof ContentEn> = { fr: ContentFr, es: ContentEs, en: ContentEn };
const LEAF: Record<Locale, string> = {
  fr: "Projet 5 · Nettoyer et mettre en forme",
  es: "Proyecto 5 · Limpiar y formatear",
  en: "Project 5 · Clean & format",
};

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const base = `/${locale}`;
  const Content = CONTENT[locale] ?? CONTENT.en;

  return (
    <>
      <Breadcrumbs
        items={[
          homeCrumb(locale),
          csCrumb(locale),
          { label: "SQL", href: `${base}/cs/sql` },
          { label: LEAF[locale] ?? LEAF.en },
        ]}
      />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
