import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = { title: "SQL — Learning" };

type Item = { slug: string; kind: "chapter" | "project"; glyph: string; title: string; desc: string };

// Ordered to follow the source course; a project follows each chapter and is
// cumulative — it reuses everything learned up to that point.
const ITEMS: Item[] = [
  { slug: "01-querying-basics", kind: "chapter", glyph: "1", title: "Querying data — SELECT", desc: "SELECT, FROM, WHERE, ORDER BY, DISTINCT, LIMIT, and a first look at GROUP BY." },
  { slug: "project-1-first-reports", kind: "project", glyph: "★", title: "Project 1 — First reports", desc: "Write a set of read-only reports over the sample store." },
  { slug: "02-defining-changing-data", kind: "chapter", glyph: "2", title: "Defining & changing data — DDL/DML", desc: "CREATE / ALTER / DROP tables; INSERT / UPDATE / DELETE rows." },
  { slug: "project-2-your-schema", kind: "project", glyph: "★", title: "Project 2 — Build a schema", desc: "Design, populate and modify your own small schema." },
  { slug: "03-filtering", kind: "chapter", glyph: "3", title: "Filtering data", desc: "Comparison & logical operators, BETWEEN, IN, LIKE, and NULL checks." },
  { slug: "project-3-targeted-search", kind: "project", glyph: "★", title: "Project 3 — Targeted search", desc: "Combine several filters to answer precise questions." },
  { slug: "04-combining-tables", kind: "chapter", glyph: "4", title: "Combining tables — JOINs & SETs", desc: "INNER / LEFT / RIGHT / FULL / CROSS joins; UNION, EXCEPT, INTERSECT." },
  { slug: "project-4-order-report", kind: "project", glyph: "★", title: "Project 4 — Order report", desc: "Join customers, orders and products into one report." },
  { slug: "05-functions", kind: "chapter", glyph: "5", title: "Functions", desc: "String, numeric, date/time and NULL functions, plus CASE expressions." },
  { slug: "project-5-data-cleaning", kind: "project", glyph: "★", title: "Project 5 — Clean & format", desc: "Produce a tidy, human-readable customer report." },
  { slug: "06-aggregation", kind: "chapter", glyph: "6", title: "Aggregation", desc: "COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING." },
  { slug: "project-6-capstone", kind: "project", glyph: "♛", title: "Project 6 — Capstone analytics", desc: "A store analytics dashboard using every chapter together." },
];

export default function SqlHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const mod = `${base}/cs/sql`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t.home, href: "/learning-website/", external: true },
          { label: t.cs, href: `${base}/cs` },
          { label: "SQL" },
        ]}
      />
      <h1 className="text-5xl">SQL — From Zero to Hero</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">
        Follows the order of Data with Baraa&apos;s SQL course. Every chapter is
        hands-on: run real queries against an in-browser SQLite database, then
        finish with a cumulative project. Nothing is installed — the database
        lives in your browser and resets when you reload.
      </p>

      <div className="sub-grid">
        {ITEMS.map((it) => (
          <Link
            key={it.slug}
            className={`sub-card${it.kind === "project" ? " border-accent-warm/40" : ""}`}
            href={`${mod}/${it.slug}`}
          >
            <div className="glyph">{it.glyph}</div>
            <h3>{it.title}</h3>
            <p>{it.desc}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
