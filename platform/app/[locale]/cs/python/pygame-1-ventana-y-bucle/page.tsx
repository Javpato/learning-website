import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { csCrumb } from "@/lib/nav";
// Spanish-only for now: every locale renders the ES content until translated.
import Content from "./content.es.mdx";

export const metadata = { title: "Ventana y bucle de juego (Pygame) — Learning" };

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
          csCrumb(locale),
          { label: "Python", href: `${base}/cs/python` },
          { label: "Pygame 1 · Ventana y bucle" },
        ]}
      />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
