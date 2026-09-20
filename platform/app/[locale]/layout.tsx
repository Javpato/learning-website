import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { NetworkHeader } from "@/components/cs/network-lab/NetworkHeader";

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

  return (
    <div lang={locale}>
      <NetworkHeader locale={locale} />
      <main className="mx-auto max-w-page px-4 pb-20 pt-8 sm:px-6 sm:pt-10">{children}</main>
    </div>
  );
}
