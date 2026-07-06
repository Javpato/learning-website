import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = { title: "Python — Learning" };

// Spanish-first course (authored es only for now). Each chapter is hands-on in
// the browser; every big milestone unlocks a guided PROJECT you build on your
// own machine and push to GitHub. The array is ordered and grows chapter by
// chapter, exactly like the SQL course's ITEMS list.
type Item = { slug: string; kind: "chapter" | "project"; glyph: string; title: string; desc: string };

const ITEMS: Item[] = [
  {
    slug: "01-fundamentos",
    kind: "chapter",
    glyph: "1",
    title: "Fundamentos de Python",
    desc: "print, variables y tipos, input, operadores, if/elif/else, bucles while y random.",
  },
  {
    slug: "project-1-adivina-el-numero",
    kind: "project",
    glyph: "★",
    title: "Proyecto 1 — Adivina el número",
    desc: "Tu primer proyecto para GitHub: un juego de adivinanzas en la terminal, escrito en tu máquina.",
  },
];

const H1 = "Python — De cero a programador";
const INTRO =
  "Un viaje práctico e interactivo, al estilo Codédex. Cada capítulo ejecuta Python de verdad en tu navegador — no se instala nada. Al terminar cada gran bloque, desbloqueas un proyecto guiado que escribes en tu propia máquina y subes a tu GitHub.";

export default function PythonHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const mod = `${base}/cs/python`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t.home, href: "/learning-website/", external: true },
          { label: t.cs, href: `${base}/cs` },
          { label: "Python" },
        ]}
      />
      <h1 className="text-5xl">{H1}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{INTRO}</p>

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
