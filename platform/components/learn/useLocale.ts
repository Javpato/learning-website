"use client";

import { usePathname } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Locale of the current page, read from the URL (same technique as
 * LocaleSwitch). Lets globally-registered MDX components build locale-aware
 * links without threading a locale prop through every .mdx file.
 */
export function useLocale(): Locale {
  const pathname = usePathname() ?? "";
  const seg = pathname.split("/")[1] ?? "";
  return isLocale(seg) ? seg : defaultLocale;
}
