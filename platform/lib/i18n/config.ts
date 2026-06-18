// Locale configuration. French is authored first; es/en fall back to fr.
export const locales = ["fr", "es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
  fr: "FR",
  es: "ES",
  en: "EN",
};
