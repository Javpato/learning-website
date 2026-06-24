import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = { title: "Computer Science — Learning" };

export default function CsHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <>
      <Breadcrumbs
        items={[{ label: t.home, href: "/learning-website/", external: true }, { label: t.cs }]}
      />
      <h1 className="text-5xl">{t.csHubTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{t.csHubSub}</p>

      <div className="sub-grid">
        <Link className="sub-card" href={`${base}/cs/sql`}>
          <div className="glyph">SQL</div>
          <h3>SQL — From Zero to Hero</h3>
          <p>
            Query, filter, join and aggregate data with a real in-browser SQLite
            engine. Six chapters, each ending in a hands-on project.
          </p>
        </Link>
      </div>
    </>
  );
}
