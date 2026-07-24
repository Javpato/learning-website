import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { homeCrumb, mathCrumb } from "@/lib/nav";
import { isLocale, type Locale } from "@/lib/i18n/config";

type Content = ComponentType;

export function LinearAlgebraPage({
  localeParam,
  contents,
  labels,
}: {
  localeParam: string;
  contents: Record<Locale, Content>;
  labels: Record<Locale, string>;
}) {
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const Content = contents[locale];

  return (
    <>
      <Breadcrumbs
        items={[
          homeCrumb(locale),
          mathCrumb(locale),
          { label: locale === "fr" ? "Algèbre linéaire" : locale === "es" ? "Álgebra lineal" : "Linear algebra", href: `/${locale}/math/algebre-lineaire` },
          { label: labels[locale] },
        ]}
      />
      <article className="prose-page"><Content /></article>
    </>
  );
}
