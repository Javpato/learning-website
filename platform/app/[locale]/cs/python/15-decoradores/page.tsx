import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
// Spanish-only for now: every locale renders the ES content until translated.
import Content from "./content.es.mdx";

export const metadata = { title: "Decoradores — Learning" };

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t.home, href: "/learning-website/", external: true },
          { label: t.cs, href: `${base}/cs` },
          { label: "Python", href: `${base}/cs/python` },
          { label: "15 · Decoradores" },
        ]}
      />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
