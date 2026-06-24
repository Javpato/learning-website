import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import ContentFr from "./content.fr.mdx";
import ContentEs from "./content.es.mdx";
import ContentEn from "./content.en.mdx";

export const metadata = { title: "Querying data (SELECT) — Learning" };

const CONTENT: Record<Locale, typeof ContentEn> = { fr: ContentFr, es: ContentEs, en: ContentEn };
const LEAF: Record<Locale, string> = {
  fr: "1 · Interroger les données",
  es: "1 · Consultar datos",
  en: "1 · Querying data",
};

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const Content = CONTENT[locale] ?? CONTENT.en;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t.home, href: "/learning-website/", external: true },
          { label: t.cs, href: `${base}/cs` },
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
