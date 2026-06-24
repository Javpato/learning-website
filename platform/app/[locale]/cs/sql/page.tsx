import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = { title: "SQL — Learning" };

type Loc = Record<Locale, string>;
type Item = { slug: string; kind: "chapter" | "project"; glyph: string; title: Loc; desc: Loc };

// Ordered to follow the source course; a project follows each chapter and is
// cumulative — it reuses everything learned up to that point.
const ITEMS: Item[] = [
  {
    slug: "01-querying-basics", kind: "chapter", glyph: "1",
    title: { en: "Querying data — SELECT", fr: "Interroger les données — SELECT", es: "Consultar datos — SELECT" },
    desc: {
      en: "SELECT, FROM, WHERE, ORDER BY, DISTINCT, LIMIT, and a first look at GROUP BY.",
      fr: "SELECT, FROM, WHERE, ORDER BY, DISTINCT, LIMIT et une première approche de GROUP BY.",
      es: "SELECT, FROM, WHERE, ORDER BY, DISTINCT, LIMIT y una primera mirada a GROUP BY.",
    },
  },
  {
    slug: "project-1-first-reports", kind: "project", glyph: "★",
    title: { en: "Project 1 — First reports", fr: "Projet 1 — Premiers rapports", es: "Proyecto 1 — Primeros informes" },
    desc: {
      en: "Write a set of read-only reports over the sample store.",
      fr: "Rédigez une série de rapports en lecture seule sur la boutique d'exemple.",
      es: "Escribe una serie de informes de solo lectura sobre la tienda de ejemplo.",
    },
  },
  {
    slug: "02-defining-changing-data", kind: "chapter", glyph: "2",
    title: { en: "Defining & changing data — DDL/DML", fr: "Définir et modifier les données — DDL/DML", es: "Definir y modificar datos — DDL/DML" },
    desc: {
      en: "CREATE / ALTER / DROP tables; INSERT / UPDATE / DELETE rows.",
      fr: "CREATE / ALTER / DROP des tables ; INSERT / UPDATE / DELETE des lignes.",
      es: "CREATE / ALTER / DROP de tablas; INSERT / UPDATE / DELETE de filas.",
    },
  },
  {
    slug: "project-2-your-schema", kind: "project", glyph: "★",
    title: { en: "Project 2 — Build a schema", fr: "Projet 2 — Construire un schéma", es: "Proyecto 2 — Crear un esquema" },
    desc: {
      en: "Design, populate and modify your own small schema.",
      fr: "Concevez, remplissez et modifiez votre propre petit schéma.",
      es: "Diseña, llena y modifica tu propio esquema pequeño.",
    },
  },
  {
    slug: "03-filtering", kind: "chapter", glyph: "3",
    title: { en: "Filtering data", fr: "Filtrer les données", es: "Filtrar datos" },
    desc: {
      en: "Comparison & logical operators, BETWEEN, IN, LIKE, and NULL checks.",
      fr: "Opérateurs de comparaison et logiques, BETWEEN, IN, LIKE et tests NULL.",
      es: "Operadores de comparación y lógicos, BETWEEN, IN, LIKE y comprobaciones de NULL.",
    },
  },
  {
    slug: "project-3-targeted-search", kind: "project", glyph: "★",
    title: { en: "Project 3 — Targeted search", fr: "Projet 3 — Recherche ciblée", es: "Proyecto 3 — Búsqueda específica" },
    desc: {
      en: "Combine several filters to answer precise questions.",
      fr: "Combinez plusieurs filtres pour répondre à des questions précises.",
      es: "Combina varios filtros para responder preguntas precisas.",
    },
  },
  {
    slug: "04-combining-tables", kind: "chapter", glyph: "4",
    title: { en: "Combining tables — JOINs & SETs", fr: "Combiner les tables — JOIN et ensembles", es: "Combinar tablas — JOIN y conjuntos" },
    desc: {
      en: "INNER / LEFT / RIGHT / FULL / CROSS joins; UNION, EXCEPT, INTERSECT.",
      fr: "Jointures INNER / LEFT / RIGHT / FULL / CROSS ; UNION, EXCEPT, INTERSECT.",
      es: "Joins INNER / LEFT / RIGHT / FULL / CROSS; UNION, EXCEPT, INTERSECT.",
    },
  },
  {
    slug: "project-4-order-report", kind: "project", glyph: "★",
    title: { en: "Project 4 — Order report", fr: "Projet 4 — Rapport de commandes", es: "Proyecto 4 — Informe de pedidos" },
    desc: {
      en: "Join customers, orders and products into one report.",
      fr: "Joignez clients, commandes et produits en un seul rapport.",
      es: "Une clientes, pedidos y productos en un solo informe.",
    },
  },
  {
    slug: "05-functions", kind: "chapter", glyph: "5",
    title: { en: "Functions", fr: "Fonctions", es: "Funciones" },
    desc: {
      en: "String, numeric, date/time and NULL functions, plus CASE expressions.",
      fr: "Fonctions de chaîne, numériques, de date/heure et NULL, plus les expressions CASE.",
      es: "Funciones de cadena, numéricas, de fecha/hora y NULL, además de expresiones CASE.",
    },
  },
  {
    slug: "project-5-data-cleaning", kind: "project", glyph: "★",
    title: { en: "Project 5 — Clean & format", fr: "Projet 5 — Nettoyer et mettre en forme", es: "Proyecto 5 — Limpiar y formatear" },
    desc: {
      en: "Produce a tidy, human-readable customer report.",
      fr: "Produisez un rapport client clair et lisible.",
      es: "Genera un informe de clientes ordenado y legible.",
    },
  },
  {
    slug: "06-aggregation", kind: "chapter", glyph: "6",
    title: { en: "Aggregation", fr: "Agrégation", es: "Agregación" },
    desc: {
      en: "COUNT, SUM, AVG, MIN, MAX with GROUP BY and HAVING.",
      fr: "COUNT, SUM, AVG, MIN, MAX avec GROUP BY et HAVING.",
      es: "COUNT, SUM, AVG, MIN, MAX con GROUP BY y HAVING.",
    },
  },
  {
    slug: "project-6-capstone", kind: "project", glyph: "♛",
    title: { en: "Project 6 — Capstone analytics", fr: "Projet 6 — Projet final analytique", es: "Proyecto 6 — Analítica final" },
    desc: {
      en: "A store analytics dashboard using every chapter together.",
      fr: "Un tableau de bord analytique réunissant tous les chapitres.",
      es: "Un panel de analítica de la tienda que usa todos los capítulos juntos.",
    },
  },
];

const H1: Record<Locale, string> = {
  en: "SQL — From Zero to Hero",
  fr: "SQL — De zéro à expert",
  es: "SQL — De cero a experto",
};
const INTRO: Record<Locale, string> = {
  en: "Follows the order of Data with Baraa's SQL course. Every chapter is hands-on: run real queries against an in-browser SQLite database, then finish with a cumulative project. Nothing is installed — the database lives in your browser and resets when you reload.",
  fr: "Suit l'ordre du cours SQL de Data with Baraa. Chaque chapitre est pratique : exécutez de vraies requêtes sur une base SQLite dans votre navigateur, puis terminez par un projet cumulatif. Rien à installer — la base vit dans votre navigateur et se réinitialise au rechargement.",
  es: "Sigue el orden del curso de SQL de Data with Baraa. Cada capítulo es práctico: ejecuta consultas reales sobre una base de datos SQLite en tu navegador y termina con un proyecto acumulativo. No se instala nada: la base vive en tu navegador y se reinicia al recargar.",
};

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
      <h1 className="text-5xl">{H1[locale] ?? H1.en}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{INTRO[locale] ?? INTRO.en}</p>

      <div className="sub-grid">
        {ITEMS.map((it) => (
          <Link
            key={it.slug}
            className={`sub-card${it.kind === "project" ? " border-accent-warm/40" : ""}`}
            href={`${mod}/${it.slug}`}
          >
            <div className="glyph">{it.glyph}</div>
            <h3>{it.title[locale] ?? it.title.en}</h3>
            <p>{it.desc[locale] ?? it.desc.en}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
