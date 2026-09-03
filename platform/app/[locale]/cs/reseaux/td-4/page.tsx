import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { csReseauxCrumbs, renderLearnPage } from "@/lib/learn/lessonPage";
import ContentFr from "./content.fr.mdx";
import ContentEn from "./content.en.mdx";
import ContentEs from "./content.es.mdx";

export const metadata = { title: "TD 4 — Switching & routing — Learning" };

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
      fr: "TD 4 — Commutation et routage",
      en: "TD 4 — Switching and routing",
      es: "TD 4 — Conmutación y enrutamiento",
    }),
  });
}
