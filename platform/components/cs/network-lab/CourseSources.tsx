"use client";
import { useEffect, useState } from "react";
import { CourseParagraph } from "./Definitions";
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export function CourseLink({
  doc = "Routage",
  page,
  children,
}: {
  doc?: string;
  page: number;
  children: React.ReactNode;
}) {
  return <a href={`#cours/${doc}/${page}`}>{children} →</a>;
}
const counts: Record<string, number> = {
  Intro: 18,
  Routage: 48,
  IP: 30,
  TCP: 40,
};
export function CourseLibrary() {
  const [doc, setDoc] = useState("Routage");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState<string[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    const read = () => {
      const [, d, p] = location.hash.slice(1).split("/");
      if (d && Object.hasOwn(counts, d)) {
        setDoc(d);
        setPage(Math.max(1, Math.min(counts[d], Math.floor(Number(p)) || 1)));
      }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  useEffect(() => {
    const control = new AbortController();
    setPages([]);
    setError(false);
    fetch(`${base}/reseaux/cours/${doc}/pages.json`, { signal: control.signal })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setPages(data.pages))
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });
    return () => control.abort();
  }, [doc]);
  function navigate(d: string, p: number) {
    window.location.hash = `cours/${d}/${p}`;
    setDoc(d);
    setPage(p);
  }
  return (
    <section className="nl-lesson">
      <p className="nl-eyebrow">Les documents fournis</p>
      <h2>Lire le cours original</h2>
      <CourseParagraph>
        Les quatre supports sont disponibles intégralement. L’introduction et le
        routage accompagnent les ateliers actuels ; IP et TCP restent des
        références pour la suite. Chaque image reproduit une page du PDF. Sous
        l’image, son texte est sélectionnable et les termes connus sont
        cliquables. Le numéro de page PDF peut différer du numéro de diapositive
        (deux diapositives par page dans l’introduction).
      </CourseParagraph>
      <div className="nl-options">
        {Object.keys(counts).map((d) => (
          <button
            key={d}
            aria-pressed={doc === d}
            onClick={() => navigate(d, 1)}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="nl-inline">
        <button disabled={page <= 1} onClick={() => navigate(doc, page - 1)}>
          Page précédente
        </button>
        <label>
          Page PDF{" "}
          <select
            value={page}
            onChange={(e) => navigate(doc, Number(e.target.value))}
          >
            {Array.from({ length: counts[doc] }, (_, i) => (
              <option key={i + 1}>{i + 1}</option>
            ))}
          </select>{" "}
          / {counts[doc]}
        </label>
        <button
          disabled={page >= counts[doc]}
          onClick={() => navigate(doc, page + 1)}
        >
          Page suivante
        </button>
        <a
          href={`${base}/reseaux/cours/${doc}.pdf#page=${page}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ouvrir le PDF original ↗
        </a>
      </div>
      <figure className="nl-course-page">
        <img
          src={`${base}/reseaux/cours/${doc}/${page}.webp`}
          alt={`${doc} — page PDF ${page}. Texte disponible juste après l’image.`}
        />
        <figcaption>
          {doc}.pdf · page PDF {page} / {counts[doc]}
        </figcaption>
      </figure>
      <details className="nl-explain">
        <summary>Texte de cette page et définitions</summary>
        {error ? (
          <p>
            Le texte n’a pas pu être chargé. Le PDF original reste disponible.
          </p>
        ) : (
          <CourseParagraph style={{ whiteSpace: "pre-wrap" }}>
            {pages[page - 1] || "Chargement du texte…"}
          </CourseParagraph>
        )}
        <p className="nl-source">
          Extraction textuelle : les diagrammes et leur disposition sont à lire
          dans l’image ou le PDF.
        </p>
      </details>
      <p>
        Support original fourni par l’utilisateur ; les ateliers restent une
        adaptation pédagogique non officielle.
      </p>
    </section>
  );
}
const helpers: Record<
  string,
  { text: string; links: [string, string][]; pdf?: number }[]
> = {
  "td1-codage": [
    {
      text: "Exercice 1 — niveaux, transitions et alphabet",
      links: [["td1/td1-codage", "Revoir les trois conventions et l’horloge"]],
    },
  ],
  "td1-debit": [
    {
      text: "Exercice 2 — distinguer symboles et bits",
      links: [["td1/td1-debit", "16 symboles, log₂(V), bauds et bit/s"]],
    },
  ],
  "td1-modulation": [
    {
      text: "Exercice 3 — constellation et débit utile",
      links: [["td1/td1-ex3-theorie", "Amplitudes, phases et redondance"]],
    },
    {
      text: "Exercice 4 — canal, Shannon et QPSK",
      links: [["td1/td1-ex4-theorie", "Capacité du canal et modulation"]],
    },
  ],
  "td1-erreurs": [
    {
      text: "Exercice 5 — détection par parité",
      links: [["td1/td1-ex5-theorie", "Parité paire et erreurs non détectées"]],
    },
    {
      text: "Exercice 6 — distance minimale",
      links: [["td1/td1-ex6-theorie", "Comparer les mots de code"]],
    },
    {
      text: "Exercice 7 — polynômes binaires",
      links: [["td1/td1-ex7-theorie", "Multiplication et division XOR"]],
    },
  ],
  "routage-dijkstra": [
    {
      text: "TD4 Q1.1 — calculer les routes",
      links: [
        ["routage/dijkstra-discovery", "Construire Dijkstra pas à pas"],
        ["routage/dijkstra-proof", "Pourquoi le minimum devient définitif"],
      ],
      pdf: 40,
    },
    {
      text: "TD4 Q1.2 — mettre l’algorithme en réseau",
      links: [
        ["routage/routage-dijkstra", "État de liens et diffusion de la carte"],
      ],
      pdf: 44,
    },
  ],
  "routage-vecteurs": [
    {
      text: "TD4 Q2.1 — construire les tables",
      links: [
        ["routage/distance-discovery", "Annonces locales et minimum des coûts"],
      ],
      pdf: 41,
    },
    {
      text: "TD4 Q2.2 — gérer la panne C–D",
      links: [["routage/dv-failure", "Suivre exactement t1 à t4"]],
      pdf: 42,
    },
  ],
};
export function ExerciseCourseLinks({ id }: { id: string }) {
  const items = helpers[id];
  return items ? (
    <aside className="nl-course-help" aria-label="Liens vers les explications">
      <h3>Le cours utile pour cet exercice</h3>
      {items.map((item) => (
        <div key={item.text}>
          <strong>{item.text}</strong>
          <ul>
            {item.links.map(([target, label]) => (
              <li key={target}>
                <a href={`#${target}`}>{label}</a>
              </li>
            ))}
            {item.pdf && (
              <li>
                <CourseLink page={item.pdf}>
                  Support original · p. PDF {item.pdf}
                </CourseLink>
              </li>
            )}
          </ul>
        </div>
      ))}
      {id.startsWith("td1") && (
        <p>
          Le corpus fourni ne contient pas de chapitre de cours détaillé sur le
          codage : les explications ici sont reconstruites à partir du TD1
          corrigé, pas attribuées à Intro.pdf.
        </p>
      )}
    </aside>
  ) : null;
}
