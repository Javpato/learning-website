import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { csReseauxCrumbs, renderLearnPage } from "@/lib/learn/lessonPage";
import ContentFr from "./content.fr.mdx";
import ContentEn from "./content.en.mdx";
import ContentEs from "./content.es.mdx";

export const metadata = { title: "TD 3 — Local networks — Learning" };

const CONTENT: Record<Locale, typeof ContentFr> = {
  fr: ContentFr,
  en: ContentEn,
  es: ContentEs,
};

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  return renderLearnPage({
    locale,
    Content: CONTENT[locale] ?? ContentFr,
    crumbs: csReseauxCrumbs(locale, {
      fr: "TD 3 — Réseaux locaux",
      en: "TD 3 — Local networks",
      es: "TD 3 — Redes locales",
    }),
  });
}
