// Shared server-side wrapper for the ~50 L2 Chimie leaf pages (lessons, TDs,
// exams, formulaires). Each page.tsx stays tiny: import its content.fr.mdx,
// declare its crumbs, call renderLearnPage. The FR content is served to every
// locale (i18n rule: author French first; translations can be split out later
// by upgrading a page to a per-locale Record like differentiabilite/page.tsx).

import type { ComponentType } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import type { Locale } from "@/lib/i18n/config";
import { homeCrumb, mathCrumb, physicsCrumb } from "@/lib/nav";
import { l10n, type L10nString } from "@/lib/content/types";
import { PHYS_THEMES } from "@/lib/content/physics-em";
import { learnUi } from "@/lib/learn/ui";

/** Crumb trail for a page of the math FMV module. */
export function mathFmvCrumbs(locale: Locale, leaf: L10nString): Crumb[] {
  return [
    homeCrumb(locale),
    mathCrumb(locale),
    {
      label: learnUi(locale).fmvCrumb,
      href: `/${locale}/math/fonctions-plusieurs-variables`,
    },
    { label: l10n(locale, leaf) },
  ];
}

/** Crumb trail for a page of the math "Analyse & convergence" module. */
export function mathAnalyseCrumbs(locale: Locale, leaf: L10nString): Crumb[] {
  return [
    homeCrumb(locale),
    mathCrumb(locale),
    {
      label: learnUi(locale).analyseCrumb,
      href: `/${locale}/math/analyse-convergence`,
    },
    { label: l10n(locale, leaf) },
  ];
}

/** Crumb trail for a page of a physics theme module. */
export function physicsThemeCrumbs(
  locale: Locale,
  themeSlug: string,
  themeLabel: L10nString,
  leaf: L10nString,
): Crumb[] {
  const theme = PHYS_THEMES.find((th) => th.slug === themeSlug);
  return [
    homeCrumb(locale),
    physicsCrumb(locale),
    { label: learnUi(locale).emCrumb, href: `/${locale}/physics` },
    {
      label: l10n(locale, theme?.title ?? themeLabel),
      href: `/${locale}/physics/${themeSlug}`,
    },
    { label: l10n(locale, leaf) },
  ];
}

/** Crumb trail for a physics exam / formulaire page (no theme level). */
export function physicsCrumbs(locale: Locale, leaf: L10nString): Crumb[] {
  return [
    homeCrumb(locale),
    physicsCrumb(locale),
    { label: learnUi(locale).emCrumb, href: `/${locale}/physics` },
    { label: l10n(locale, leaf) },
  ];
}

export function renderLearnPage({
  Content,
  crumbs,
}: {
  locale: Locale;
  Content: ComponentType;
  crumbs: Crumb[];
}) {
  return (
    <>
      <Breadcrumbs items={crumbs} />
      <article className="prose-page">
        <Content />
      </article>
    </>
  );
}
