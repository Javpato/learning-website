import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import type { Crumb } from "@/components/ui/Breadcrumbs";

// Links from the platform (Next app, served under /learning-website/platform)
// back out to the legacy static site (/learning-website/…) must be locale-aware
// so clicking "Home / Math / Informatique" keeps the reader in their current
// language instead of dumping them on another language's pages. They are
// external links (plain <a>) that escape the Next basePath.
//
// The legacy static site is split across directories rather than a single root
// per language, because it was migrated piecemeal:
// English at the root, Spanish under /es, French under /fr (since the
// three-tree i18n migration, every section follows this layout).
const LEGACY_HOME: Record<Locale, string> = {
  fr: "/learning-website/fr/",
  es: "/learning-website/es/",
  en: "/learning-website/",
};
const LEGACY_MATH: Record<Locale, string> = {
  fr: "/learning-website/fr/math/",
  es: "/learning-website/es/math/",
  en: "/learning-website/math/",
};
const LEGACY_CS: Record<Locale, string> = {
  fr: "/learning-website/fr/computer-science/",
  es: "/learning-website/es/computer-science/",
  en: "/learning-website/computer-science/",
};
const LEGACY_PHYSICS: Record<Locale, string> = {
  fr: "/learning-website/fr/physics/",
  es: "/learning-website/es/physics/",
  en: "/learning-website/physics/",
};

/** URL of the legacy site home for a locale. */
export function legacyHomeHref(locale: Locale): string {
  return LEGACY_HOME[locale] ?? LEGACY_HOME.en;
}

/** URL of the legacy Math landing page for a locale. */
export function legacyMathHref(locale: Locale): string {
  return LEGACY_MATH[locale] ?? LEGACY_MATH.en;
}

/** URL of the legacy CS/Informatique landing page for a locale. */
export function legacyCsHref(locale: Locale): string {
  return LEGACY_CS[locale] ?? LEGACY_CS.en;
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

/** URL of the legacy Physics landing page for a locale. */
export function legacyPhysicsHref(locale: Locale): string {
  return LEGACY_PHYSICS[locale] ?? LEGACY_PHYSICS.en;
}

/** Breadcrumb pointing back to the legacy Physics landing page (localized). */
export function physicsCrumb(locale: Locale): Crumb {
  return { label: getDictionary(locale).physics, href: legacyPhysicsHref(locale), external: true };
}
