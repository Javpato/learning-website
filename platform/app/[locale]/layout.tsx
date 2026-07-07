import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legacyHomeHref, legacyMathHref } from "@/lib/nav";
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
      <header className="flex items-center justify-between border-b border-border px-8 py-6">
        <div className="font-serif text-xl">
          <a href={legacyHomeHref(locale)} className="text-inherit hover:text-accent">
            {t.brand}
          </a>
        </div>
        <nav className="flex items-center">
          <a href={legacyHomeHref(locale)} className="ml-6 text-sm text-fg-muted hover:text-fg">
            {t.navThemes}
          </a>
          <a href={legacyMathHref(locale)} className="ml-6 text-sm text-fg-muted hover:text-fg">
            {t.navMath}
          </a>
          <LocaleSwitch current={locale} />
        </nav>
      </header>
      <main className="mx-auto max-w-page px-6 pb-20 pt-10">{children}</main>
    </div>
  );
}
