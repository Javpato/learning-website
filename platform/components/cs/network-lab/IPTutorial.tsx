"use client";

import { useEffect, useState } from "react";
import { IP_EXERCISES, type IPExercise } from "@/lib/cs/ipTutorialContent";
import { IPActivity } from "./IPActivities";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

function OriginalPages({ pages, correction = false }: { pages: number[]; correction?: boolean }) {
  const folder = correction ? "ip-correction" : "ip-statement";
  const pdf = correction ? "TD_IP-correction.pdf" : "TD456-correction.pdf";
  return (
    <details className="nl-explain">
      <summary>Voir les pages originales, figures et tableaux · p. {pages.join(", ")}</summary>
      <p>Les images conservent les figures, la mise en page et les éventuelles coquilles. Le texte sélectionnable est présenté séparément.</p>
      {pages.map((page) => (
        <figure key={page}>
          <a href={`${base}/reseaux/td/${pdf}#page=${page}`} target="_blank" rel="noopener noreferrer">
            {/* Source-document raster: intrinsic aspect ratio, loaded only on demand by browser. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${base}/reseaux/td/${folder}/page-${String(page).padStart(2, "0")}.jpg`} alt={`${correction ? "Corrigé IP" : "Énoncé du TD IP"}, page PDF ${page} : texte, tableaux et figures originaux`} loading="lazy" style={{ width: "100%", height: "auto" }} />
          </a>
          <figcaption>{pdf} · page PDF {page} · ouvrir le PDF pour agrandir.</figcaption>
        </figure>
      ))}
    </details>
  );
}

function Exercise({ exercise }: { exercise: IPExercise }) {
  return (
    <article id={exercise.id} className="nl-lesson" aria-labelledby={`${exercise.id}-title`}>
      <p className="nl-eyebrow">TD IP · exercice {Number(exercise.id.slice(-2))} · source fournie</p>
      <h3 id={`${exercise.id}-title`}>{exercise.title}</h3>
      <p><a href={`#ip/${exercise.courseSection}`}>Comprendre la méthode dans le cours IP →</a>{" · "}<a href={`${base}/reseaux/td/TD456-correction.pdf#page=${exercise.sourcePages[0]}`} target="_blank" rel="noopener noreferrer">Énoncé original p. {exercise.sourcePages.join(", ")}</a></p>
      <h4>Énoncé original — texte sélectionnable</h4>
      <p>Transcription du document fourni, sans réécriture des questions. Pour les schémas et tableaux, consulte les pages originales juste en dessous.</p>
      <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontFamily: "inherit", lineHeight: 1.65 }}>{exercise.statement}</pre>
      <OriginalPages pages={exercise.sourcePages} />
      <aside className="nl-explain" aria-label="Lecture critique de la source">
        <h4>Précision sur le document</h4>
        <p>{exercise.erratum}</p>
      </aside>
      <details className="nl-explain">
        <summary>Solution expliquée — comprendre chaque étape</summary>
        <p>Accompagnement pédagogique rédigé pour ce site ; il ne constitue pas un corrigé officiel.</p>
        {exercise.solution.map((step, index) => <p key={index}>{step}</p>)}
      </details>
      <details className="nl-explain">
        <summary>Corrigé original intégral — texte et pages sources</summary>
        <p><a href={`${base}/reseaux/td/TD_IP-correction.pdf#page=${exercise.correctionPages[0]}`} target="_blank" rel="noopener noreferrer">TD_IP-correction.pdf · p. {exercise.correctionPages.join(", ")}</a>. Les formulations et erreurs du document restent visibles ; les précisions ci-dessus les distinguent de la solution expliquée.</p>
        <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontFamily: "inherit", lineHeight: 1.65 }}>{exercise.correction}</pre>
        <OriginalPages pages={exercise.correctionPages} correction />
      </details>
      {exercise.activityKind && (
        <details className="nl-explain">
          <summary>S’entraîner avec l’activité interactive</summary>
          <p>Atelier complémentaire sur le mécanisme de cet exercice. Ses scénarios peuvent utiliser d’autres nombres ; l’énoncé original reste ci-dessus.</p>
          <IPActivity kind={exercise.activityKind} />
        </details>
      )}
    </article>
  );
}

export function IPTutorial() {
  const [selected, setSelected] = useState(IP_EXERCISES[0].id);
  useEffect(() => {
    const read = () => {
      const target = location.hash.slice(1).split("/").find((part) => IP_EXERCISES.some((e) => e.id === part || e.legacyId === part));
      if (target) setSelected(IP_EXERCISES.find((e) => e.id === target || e.legacyId === target)!.id);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const exercise = IP_EXERCISES.find((e) => e.id === selected) || IP_EXERCISES[0];
  return (
    <section className="nl-lesson">
      <p className="nl-eyebrow">S’exercer · TD 5 du corpus</p>
      <h2>TD IP — 13 exercices, du masque au trajet des paquets</h2>
      <p>Les questions et le corrigé fournis sont conservés, avec leurs figures et leurs traces. Une solution expliquée et des activités complètent chaque thème. Tous les exercices, aides et solutions sont accessibles librement.</p>
      <p><strong>Pour le partiel :</strong> travaille surtout les masques, le sous-adressage et les tables de routage (exercices 6, 7, 10, 11). La fragmentation en cascade prépare aussi l’annale d’examen final. Ces priorités décrivent les sujets disponibles, sans prédire le prochain sujet.</p>
      <nav className="nl-options" aria-label="Choisir un exercice IP">
        {IP_EXERCISES.map((item, index) => (
          <button key={item.id} aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); location.hash = `td-ip/${item.id}`; }}>
            {index + 1}. {item.title}
          </button>
        ))}
      </nav>
      <Exercise key={exercise.id} exercise={exercise} />
    </section>
  );
}
