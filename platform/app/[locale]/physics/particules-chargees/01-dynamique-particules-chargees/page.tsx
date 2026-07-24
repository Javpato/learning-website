import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { physicsThemeCrumbs, renderLearnPage } from "@/lib/learn/lessonPage";
import ContentFr from "./content.fr.mdx";
import ContentEn from "./content.en.mdx";
import ContentEs from "./content.es.mdx";

export const metadata = { title: "Charged-particle dynamics — Learning" };

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
      "particules-chargees",
      "Particules chargées",
      {
        fr: "Dynamique des particules chargées",
        en: "Charged-particle dynamics",
        es: "Dinámica de partículas cargadas",
      },
    ),
  });
}
