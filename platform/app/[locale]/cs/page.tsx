import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = { title: "Computer Science — Learning" };

const SQL_CARD: Record<Locale, { title: string; desc: string }> = {
  en: {
    title: "SQL — From Zero to Hero",
    desc: "Query, filter, join and aggregate data with a real in-browser SQLite engine. Six chapters, each ending in a hands-on project.",
  },
  fr: {
    title: "SQL — De zéro à expert",
    desc: "Interrogez, filtrez, joignez et agrégez des données avec un vrai moteur SQLite dans le navigateur. Six chapitres, chacun se terminant par un projet pratique.",
  },
  es: {
    title: "SQL — De cero a experto",
    desc: "Consulta, filtra, une y agrega datos con un motor SQLite real en el navegador. Seis capítulos, cada uno con un proyecto práctico al final.",
  },
};

export default function CsHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const card = SQL_CARD[locale] ?? SQL_CARD.en;

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
          <h3>{card.title}</h3>
          <p>{card.desc}</p>
        </Link>
        {/* Python course is Spanish-first — only surfaced on /es for now. */}
        {locale === "es" && (
          <Link className="sub-card" href={`${base}/cs/python`}>
            <div className="glyph">Py</div>
            <h3>Python — De cero a programador</h3>
            <p>
              Aprende a programar con Python ejecutándolo en tu navegador. Cada gran hito desbloquea
              un proyecto guiado que subes a tu GitHub.
            </p>
          </Link>
        )}
      </div>
    </>
  );
}
