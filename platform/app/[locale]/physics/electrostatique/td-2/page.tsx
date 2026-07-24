import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { physicsThemeCrumbs, renderLearnPage } from "@/lib/learn/lessonPage";
import ContentFr from "./content.fr.mdx";
import ContentEn from "./content.en.mdx";
import ContentEs from "./content.es.mdx";

export const metadata = { title: "TD P2 — Gauss, potential, and energy — Learning" };

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
    crumbs: physicsThemeCrumbs(
      locale,
      "electrostatique",
      "Électrostatique",
      {
        fr: "TD P2",
        en: "TD P2 · Gauss, potential, and energy",
        es: "TD P2 · Gauss, potencial y energía",
      },
    ),
  });
}
