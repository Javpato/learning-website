import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { csCrumb, homeCrumb } from "@/lib/nav";
// Spanish-only for now: every locale renders the ES content until translated.
import Content from "./content.es.mdx";

export const metadata = { title: "Proyecto 2 — Piedra, papel o tijera — Learning" };

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const base = `/${locale}`;

  return (
    <>
      <Breadcrumbs
        items={[
          homeCrumb(locale),
          csCrumb(locale),
          { label: "Python", href: `${base}/cs/python` },
          { label: "Proyecto 2 · Piedra, papel o tijera" },
        ]}
      />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
