import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = { title: "Python — Learning" };

// Spanish-first course (authored es only for now). Interactive chapters run real
// Python in the browser; every milestone unlocks a guided PROJECT you build on
// your own machine and push to GitHub, up to an ambitious final capstone.
type Item = { slug: string; kind: "chapter" | "project"; glyph: string; title: string; desc: string };
type Module = { title: string; items: Item[] };

const MODULES: Module[] = [
  {
    title: "Módulo 1 · Fundamentos",
    items: [
      { slug: "01-fundamentos", kind: "chapter", glyph: "1", title: "Fundamentos", desc: "print, variables, input, condicionales, bucles while y random." },
      { slug: "project-1-adivina-el-numero", kind: "project", glyph: "★", title: "Proyecto 1 · Adivina el número", desc: "Tu primer juego en la terminal, subido a GitHub." },
      { slug: "02-listas-y-bucles", kind: "chapter", glyph: "2", title: "Listas y bucles", desc: "Listas, indexación, slicing, for y range." },
      { slug: "03-cadenas", kind: "chapter", glyph: "3", title: "Cadenas de texto", desc: "Métodos de texto, f-strings, split y join." },
      { slug: "04-funciones", kind: "chapter", glyph: "4", title: "Funciones", desc: "def, return, parámetros y alcance." },
      { slug: "project-2-piedra-papel-tijera", kind: "project", glyph: "★", title: "Proyecto 2 · Piedra, papel o tijera", desc: "Un juego con funciones, random y marcador." },
    ],
  },
  {
    title: "Módulo 2 · Estructuras de datos",
    items: [
      { slug: "05-diccionarios-y-conjuntos", kind: "chapter", glyph: "5", title: "Diccionarios y conjuntos", desc: "dict, set, get y el patrón de conteo." },
      { slug: "06-comprensiones", kind: "chapter", glyph: "6", title: "Comprensiones", desc: "Crear listas, dicts y sets en una sola línea." },
      { slug: "07-tuplas-e-iteracion", kind: "chapter", glyph: "7", title: "Tuplas e iteración", desc: "Tuplas, desempaquetado, enumerate y zip." },
      { slug: "project-3-quiz", kind: "project", glyph: "★", title: "Proyecto 3 · Quiz", desc: "Cuestionario con puntuación y porcentaje." },
      { slug: "project-4-lista-de-tareas", kind: "project", glyph: "★", title: "Proyecto 4 · Lista de tareas", desc: "Una app de tareas con menú." },
    ],
  },
  {
    title: "Módulo 3 · Código robusto",
    items: [
      { slug: "08-errores-y-excepciones", kind: "chapter", glyph: "8", title: "Errores y excepciones", desc: "try/except, raise y validación de entradas." },
      { slug: "09-archivos-y-json", kind: "chapter", glyph: "9", title: "Archivos y JSON", desc: "Leer y escribir archivos; guardar datos en JSON." },
      { slug: "10-modulos-y-biblioteca-estandar", kind: "chapter", glyph: "10", title: "Módulos y biblioteca estándar", desc: "import, math, datetime, collections, itertools." },
      { slug: "project-5-registro-de-gastos", kind: "project", glyph: "★", title: "Proyecto 5 · Registro de gastos", desc: "Gastos por categoría, guardados en JSON." },
    ],
  },
  {
    title: "Módulo 4 · Orientación a objetos",
    items: [
      { slug: "11-clases-y-objetos", kind: "chapter", glyph: "11", title: "Clases y objetos", desc: "class, __init__, self y métodos." },
      { slug: "12-herencia-y-metodos-especiales", kind: "chapter", glyph: "12", title: "Herencia y métodos especiales", desc: "super(), polimorfismo y métodos dunder." },
      { slug: "13-diseno-con-clases", kind: "chapter", glyph: "13", title: "Diseño con clases", desc: "Composición, @property y dataclasses." },
      { slug: "project-6-ahorcado", kind: "project", glyph: "★", title: "Proyecto 6 · El ahorcado", desc: "Adivina la palabra con conjuntos y estado." },
      { slug: "project-7-tres-en-raya", kind: "project", glyph: "★", title: "Proyecto 7 · Tres en raya", desc: "Tablero, turnos y condiciones de victoria." },
    ],
  },
  {
    title: "Módulo 5 · Python avanzado",
    items: [
      { slug: "14-iteradores-y-generadores", kind: "chapter", glyph: "14", title: "Iteradores y generadores", desc: "yield, next y evaluación perezosa." },
      { slug: "15-decoradores", kind: "chapter", glyph: "15", title: "Decoradores", desc: "Funciones que envuelven a otras funciones." },
      { slug: "16-context-managers-y-tipado", kind: "chapter", glyph: "16", title: "Context managers y tipado", desc: "with propio y anotaciones de tipo." },
      { slug: "17-pruebas", kind: "chapter", glyph: "17", title: "Pruebas", desc: "assert y unittest para programar con confianza." },
      { slug: "project-8-aventura-de-texto", kind: "project", glyph: "★", title: "Proyecto 8 · Aventura de texto", desc: "Un mundo explorable con clases y comandos." },
    ],
  },
  {
    title: "Módulo 6 · Mundo real",
    items: [
      { slug: "project-9-mini-base-de-datos", kind: "project", glyph: "★", title: "Proyecto 9 · Mini base de datos", desc: "CRUD desde cero con persistencia en JSON." },
      { slug: "project-10-snake", kind: "project", glyph: "★", title: "Proyecto 10 · Snake (Pygame)", desc: "Tu primer juego con gráficos." },
    ],
  },
  {
    title: "Proyecto final",
    items: [
      { slug: "18-prepara-tu-proyecto", kind: "chapter", glyph: "18", title: "Prepara tu proyecto", desc: "Estructura, entorno y la física del movimiento." },
      { slug: "project-capstone-plataformas", kind: "project", glyph: "♛", title: "Capstone · Plataformas", desc: "Tu propio mini-Mario: el proyecto final." },
    ],
  },
];

const H1 = "Python — De cero a programador";
const INTRO =
  "Un viaje interactivo al estilo Codédex, de los fundamentos a Python avanzado. Cada capítulo ejecuta Python de verdad en tu navegador — no se instala nada — y cada gran hito desbloquea un proyecto guiado que escribes en tu propia máquina y subes a tu GitHub, hasta un juego de plataformas final.";

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

      {MODULES.map((m) => (
        <section key={m.title} className="mt-10">
          <h2 className="text-2xl text-accent-warm">{m.title}</h2>
          <div className="sub-grid">
            {m.items.map((it) => (
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
        </section>
      ))}
    </>
  );
}
