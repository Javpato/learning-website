"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLocale, localeLabels, type Locale } from "@/lib/i18n/config";

// Single toggle that cycles EN → FR → ES → EN, matching the legacy site's
// .lang-switch pill. The label always names the language you will switch TO.
const nextLocale: Record<Locale, Locale> = { en: "fr", fr: "es", es: "en" };

const localeNames: Record<Locale, string> = {
  fr: "Version française",
  es: "Versión en español",
  en: "English version",
};

/**
 * Swaps the leading /[locale] segment of the current path, preserving the rest
 * so the reader stays on the same page when switching languages.
 */
export function LocaleSwitch({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;
  const target = nextLocale[current];

  const segments = pathname.split("/");
  // segments[0] === "" (leading slash); segments[1] is the locale.
  if (segments.length > 1 && isLocale(segments[1])) {
    segments[1] = target;
  } else {
    segments.splice(1, 0, target);
  }
  const href = segments.join("/") || `/${target}`;

  return (
    <Link
      href={href}
      title={localeNames[target]}
      className="ml-6 inline-block rounded-full border border-fg-dim/30 px-3 py-0.5 text-xs tracking-[0.08em] text-fg-dim transition-colors hover:border-accent hover:text-accent"
    >
      {localeLabels[target]}
    </Link>
  );
}
