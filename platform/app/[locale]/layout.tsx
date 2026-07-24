import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legacyHomeHref, legacyMathHref, legacyPhysicsHref } from "@/lib/nav";
import { LocaleSwitch } from "@/components/ui/LocaleSwitch";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// The platform lives under the main "Learning" site on GitHub Pages
// (/learning-website/). The header links back out to it with plain <a> tags so
// they escape the Next basePath (/learning-website/platform), and the targets
// are locale-aware (lib/nav) so the reader stays in their current language.

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);

  return (
    <div lang={locale}>
      <header className="flex flex-wrap items-center justify-between gap-y-2 border-b border-border px-4 py-4 sm:px-8 sm:py-6">
        <div className="font-serif text-xl">
          <a href={legacyHomeHref(locale)} className="text-inherit hover:text-accent">
            {t.brand}
          </a>
        </div>
        <nav className="flex flex-wrap items-center gap-y-1">
          <a href={legacyHomeHref(locale)} className="ml-4 py-1 text-sm text-fg-muted hover:text-fg sm:ml-6">
            {t.navThemes}
          </a>
          <a href={legacyMathHref(locale)} className="ml-4 py-1 text-sm text-fg-muted hover:text-fg sm:ml-6">
            {t.navMath}
          </a>
          <a href={legacyPhysicsHref(locale)} className="ml-4 py-1 text-sm text-fg-muted hover:text-fg sm:ml-6">
            {t.navPhysics}
          </a>
          <LocaleSwitch current={locale} />
        </nav>
      </header>
      <main className="mx-auto max-w-page px-4 pb-20 pt-8 sm:px-6 sm:pt-10">{children}</main>
    </div>
  );
}
