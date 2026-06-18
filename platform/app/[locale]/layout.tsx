import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LocaleSwitch } from "@/components/ui/LocaleSwitch";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
          <Link href={`/${locale}`} className="text-inherit hover:text-accent">
            {t.brand}
          </Link>
        </div>
        <nav className="flex items-center">
          <Link href={`/${locale}`} className="ml-6 text-sm text-fg-muted hover:text-fg">
            {t.navThemes}
          </Link>
          <Link
            href={`/${locale}/math`}
            className="ml-6 text-sm text-fg-muted hover:text-fg"
          >
            {t.navMath}
          </Link>
          <LocaleSwitch current={locale} />
        </nav>
      </header>
      <main className="mx-auto max-w-page px-6 pb-20 pt-10">{children}</main>
    </div>
  );
}
