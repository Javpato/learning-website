import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Content from "./content.en.mdx";

export const metadata = { title: "Project 5 · Clean & format — Learning" };

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
          { label: "SQL", href: `${base}/cs/sql` },
          { label: "Project 5 · Clean & format" },
        ]}
      />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
