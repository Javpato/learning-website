"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabels, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Swaps the leading /[locale] segment of the current path, preserving the rest
 * so the reader stays on the same page when switching languages.
 */
export function LocaleSwitch({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;
  const segments = pathname.split("/");
  // segments[0] === "" (leading slash); segments[1] is the locale.

  return (
    <span className="ml-6 inline-flex gap-2 text-sm">
      {locales.map((loc) => {
        const next = [...segments];
        if (next.length > 1 && isLocale(next[1])) {
          next[1] = loc;
        } else {
          next.splice(1, 0, loc);
        }
        const href = next.join("/") || `/${loc}`;
        return (
          <Link
            key={loc}
            href={href}
            aria-current={loc === current ? "true" : undefined}
            className={
              loc === current
                ? "text-accent"
                : "text-fg-dim hover:text-fg"
            }
          >
            {localeLabels[loc]}
          </Link>
        );
      })}
    </span>
  );
}
