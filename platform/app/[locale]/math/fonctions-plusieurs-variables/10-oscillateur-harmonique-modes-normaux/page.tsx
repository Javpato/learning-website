import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { mathFmvCrumbs, renderLearnPage } from "@/lib/learn/lessonPage";
import ContentFr from "./content.fr.mdx";
import ContentEn from "./content.en.mdx";
import ContentEs from "./content.es.mdx";

export const metadata = { title: "Harmonic oscillator and normal modes — Learning" };

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
    crumbs: mathFmvCrumbs(locale, {
      fr: "Oscillateur harmonique et modes normaux",
      en: "Harmonic oscillator and normal modes",
      es: "Oscilador armónico y modos normales",
    }),
  });
}
