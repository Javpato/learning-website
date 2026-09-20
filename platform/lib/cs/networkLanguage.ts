/** Scoped language memory: this French-only workshop must not overwrite the surrounding locale. */
export type SiteLanguage = "fr" | "en" | "es";
export const LANGUAGE_KEY = "reseaux-return-language";
export function validLanguage(value: unknown): value is SiteLanguage {
  return value === "fr" || value === "en" || value === "es";
}
export function courseLanguage(source: unknown, stored: unknown): SiteLanguage {
  return validLanguage(source) ? source : validLanguage(stored) ? stored : "fr";
}
export function isFrenchWorkshop(path: string): boolean {
  return /\/(fr|en|es)\/cs\/reseaux\/atelier\/?$/.test(path);
}
