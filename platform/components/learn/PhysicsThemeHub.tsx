// Shared hub renderer for the four physics theme modules. Cards are always
// active — suggested order, never a requirement. Localized: theme titles and
// descriptions come from the (L10n-aware) data layer, section chrome from
// the learn UI dictionary, and intro/filLine accept per-locale strings.

import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { homeCrumb, physicsCrumb } from "@/lib/nav";
import { PHYS_LESSONS, PHYS_TDS, PHYS_THEMES } from "@/lib/content/physics-em";
import { l10n, type L10nString } from "@/lib/content/types";
import { learnUi } from "@/lib/learn/ui";
import { LessonCards, TdCards } from "./ModuleHub";

export function PhysicsThemeHub({
  localeParam,
  themeSlug,
  intro,
  filLine,
}: {
  localeParam: string;
  themeSlug: string;
  intro: L10nString;
  filLine?: L10nString;
}) {
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const t = learnUi(locale);
  const theme = PHYS_THEMES.find((th) => th.slug === themeSlug);
  if (!theme) notFound();

  const lessons = PHYS_LESSONS.filter((l) => l.moduleSlug === themeSlug);
  const tds = PHYS_TDS.filter((td) => td.moduleSlug === themeSlug);

  return (
    <>
      <Breadcrumbs
        items={[
          homeCrumb(locale),
          physicsCrumb(locale),
          { label: t.emCrumb, href: `/${locale}/physics` },
          { label: l10n(locale, theme!.title) },
        ]}
      />
      <h1 className="text-5xl">{l10n(locale, theme!.title)}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{l10n(locale, intro)}</p>
      {filLine && (
        <p className="mt-3 max-w-2xl text-base text-accent">{l10n(locale, filLine)}</p>
      )}

      <h2 className="mt-8 font-serif text-2xl text-accent">{t.coursesTitle}</h2>
      <LessonCards locale={locale} lessons={lessons} numbered={false} />

      {tds.length > 0 && (
        <>
          <p className="sub-card mt-8 max-w-2xl">
            {t.tdFirstQ} <Link href="#td">{t.tdFirstLink}</Link> {t.tdFirstRest}
          </p>
          <h2 id="td" className="mt-10 scroll-mt-24 font-serif text-2xl text-accent">
            {t.tdSectionTitle}
          </h2>
          <TdCards locale={locale} tds={tds} />
        </>
      )}
    </>
  );
}
