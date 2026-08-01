import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { mathAnalyseCrumbs, renderLearnPage } from "@/lib/learn/lessonPage";
import ContentFr from "./content.fr.mdx";
import ContentEn from "./content.en.mdx";
import ContentEs from "./content.es.mdx";

export const metadata = { title: "TD 1 — Behaviour of a series — Learning" };

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
    crumbs: mathAnalyseCrumbs(locale, {
      fr: "TD 1 — Nature d'une série",
      en: "TD 1 — Behaviour of a series",
      es: "TD 1 — Naturaleza de una serie",
    }),
  });
}
