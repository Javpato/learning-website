import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { csCrumb, homeCrumb } from "@/lib/nav";
import { pick, unitBySlug } from "@/lib/python/course";
import ContentFr from "./content.fr.mdx";
import ContentEs from "./content.es.mdx";
import ContentEn from "./content.en.mdx";

export const metadata = { title: "Clases y objetos — Learning" };

const CONTENT: Record<Locale, typeof ContentEn> = { fr: ContentFr, es: ContentEs, en: ContentEn };

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const base = `/${locale}`;
  const Content = CONTENT[locale] ?? CONTENT.es;
  const unit = unitBySlug("11-clases-y-objetos");

  return (
    <>
      <Breadcrumbs
        items={[
          homeCrumb(locale),
          csCrumb(locale),
          { label: "Python", href: `${base}/cs/python` },
          { label: unit ? pick(unit.title, locale) : "11 · Clases y objetos" },
        ]}
      />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
