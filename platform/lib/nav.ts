import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import type { Crumb } from "@/components/ui/Breadcrumbs";

// Links from the platform (Next app, served under /learning-website/platform)
// back out to the legacy static site (/learning-website/…) must be locale-aware
// so clicking "Home / Math / Informática" keeps the reader in their current
// language instead of dumping them on the English pages. They are external links
// (plain <a>) that escape the Next basePath.
//
// The legacy static site exists in English (root) and Spanish (/es). There is no
// French legacy site yet, so `fr` falls back to the English pages.
const LEGACY_ROOT: Record<Locale, string> = {
  es: "/learning-website/es",
  en: "/learning-website",
  fr: "/learning-website",
};

function legacyRoot(locale: Locale): string {
  return LEGACY_ROOT[locale] ?? LEGACY_ROOT.en;
}

/** URL of the legacy site home for a locale. */
export function legacyHomeHref(locale: Locale): string {
  return `${legacyRoot(locale)}/`;
}

/** URL of the legacy Math landing page for a locale. */
export function legacyMathHref(locale: Locale): string {
  return `${legacyRoot(locale)}/math/`;
}

/** URL of the legacy CS/Informática landing page for a locale. */
export function legacyCsHref(locale: Locale): string {
  return `${legacyRoot(locale)}/computer-science/`;
}

/** Breadcrumb pointing back to the legacy site home (localized). */
export function homeCrumb(locale: Locale): Crumb {
  return { label: getDictionary(locale).home, href: legacyHomeHref(locale), external: true };
}

/** Breadcrumb pointing back to the legacy Math landing page (localized). */
export function mathCrumb(locale: Locale): Crumb {
  return { label: getDictionary(locale).math, href: legacyMathHref(locale), external: true };
}

/** Breadcrumb pointing back to the legacy CS/Informática landing page (localized). */
export function csCrumb(locale: Locale): Crumb {
  return { label: getDictionary(locale).cs, href: legacyCsHref(locale), external: true };
}
