import type { Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import type { Crumb } from "@/components/ui/Breadcrumbs";

// The canonical "Informática / Computer Science" landing page is the legacy
// static-site page (the one linked from the home page and themed like the rest
// of the site), NOT the platform's own /<locale>/cs hub. Course breadcrumbs
// point back there so clicking "Informática" returns users to the same page
// they came from — an external link (plain <a>) that escapes the Next basePath,
// mirroring how the "Inicio / Home" crumb links out to /learning-website/.
// (There is no French legacy CS page yet, so fr falls back to the English one.)
const LEGACY_CS: Record<Locale, string> = {
  es: "/learning-website/es/computer-science/",
  en: "/learning-website/computer-science/",
  fr: "/learning-website/computer-science/",
};

/** URL of the legacy CS/Informática landing page for a locale. */
export function legacyCsHref(locale: Locale): string {
  return LEGACY_CS[locale] ?? LEGACY_CS.en;
}

/** Breadcrumb pointing back to the legacy CS/Informática landing page. */
export function csCrumb(locale: Locale): Crumb {
  const t = getDictionary(locale);
  return { label: t.cs, href: legacyCsHref(locale), external: true };
}
