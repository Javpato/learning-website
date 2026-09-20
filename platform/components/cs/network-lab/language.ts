"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  courseLanguage,
  isFrenchWorkshop,
  LANGUAGE_KEY,
  type SiteLanguage,
} from "@/lib/cs/networkLanguage";
export function useReturnLanguage() {
  const path = usePathname() || "";
  const [locale, setLocale] = useState<SiteLanguage>("fr");
  useEffect(() => {
    if (!isFrenchWorkshop(path)) return;
    const read = () => {
      let stored: string | null = null;
      try {
        stored = sessionStorage.getItem(LANGUAGE_KEY);
      } catch {}
      const source = new URLSearchParams(window.location.search).get("from");
      const value = courseLanguage(source, stored);
      setLocale(value);
      try {
        sessionStorage.setItem(LANGUAGE_KEY, value);
      } catch {}
    };
    read();
    window.addEventListener("reseaux-language", read);
    return () => window.removeEventListener("reseaux-language", read);
  }, [path]);
  return locale;
}
export function rememberLanguage(locale: SiteLanguage) {
  try {
    sessionStorage.setItem(LANGUAGE_KEY, locale);
  } catch {}
}
