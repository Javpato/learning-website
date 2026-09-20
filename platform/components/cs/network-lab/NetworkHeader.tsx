"use client";
import { usePathname, useRouter } from "next/navigation";
import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legacyHomeHref, legacyMathHref, legacyPhysicsHref } from "@/lib/nav";
import { LocaleSwitch } from "@/components/ui/LocaleSwitch";
import { isFrenchWorkshop } from "@/lib/cs/networkLanguage";
import { rememberLanguage, useReturnLanguage } from "./language";
export function NetworkHeader({ locale }: { locale: Locale }) {
  const path = usePathname() || "";
  const router = useRouter();
  const origin = useReturnLanguage();
  const workshop = isFrenchWorkshop(path);
  const language = workshop ? origin : locale;
  const t = getDictionary(language);
  return (
    <header className="flex flex-wrap items-center justify-between gap-y-2 border-b border-border px-4 py-4 sm:px-8 sm:py-6">
      <div className="font-serif text-xl">
        <a
          href={legacyHomeHref(language)}
          className="text-inherit hover:text-accent"
        >
          {t.brand}
        </a>
      </div>
      <nav
        aria-label="Navigation principale"
        className="flex flex-wrap items-center gap-y-1"
      >
        <a
          href={legacyHomeHref(language)}
          className="ml-4 py-1 text-sm text-fg-muted hover:text-fg sm:ml-6"
        >
          {t.navThemes}
        </a>
        <a
          href={legacyMathHref(language)}
          className="ml-4 py-1 text-sm text-fg-muted hover:text-fg sm:ml-6"
        >
          {t.navMath}
        </a>
        <a
          href={legacyPhysicsHref(language)}
          className="ml-4 py-1 text-sm text-fg-muted hover:text-fg sm:ml-6"
        >
          {t.navPhysics}
        </a>
        {workshop ? (
          <label className="ml-4 text-sm">
            Retour{" "}
            <select
              className="rounded border border-border bg-bg-elevated px-2 py-1 text-fg"
              aria-label="Langue du reste du site"
              value={language}
              onChange={(e) => {
                const next = e.target.value as Locale;
                rememberLanguage(next);
                router.push(`/${next}/cs/reseaux`);
              }}
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </label>
        ) : (
          <LocaleSwitch current={locale} />
        )}
      </nav>
    </header>
  );
}
