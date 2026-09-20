"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Introduction, NetworkBuilder } from "./Introduction";
import { Transmission } from "./Transmission";
import { Routing } from "./Routing";
import {
  Explain,
  GraphView,
  INITIAL_LAB,
  LabProvider,
  Lesson,
  LINKS,
  Signal,
  useLab,
} from "./shared";
import {
  decodeSignal,
  encodeSignal,
  parity,
  pathTo,
  shortestSteps,
  symmetric,
} from "@/lib/cs/networkLab";
import { useReturnLanguage } from "./language";
import { NetworkEntry } from "./Entry";
import type { Locale } from "@/lib/i18n/config";
const chapters = [
  ["introduction", "01", "Introduction", "Relier et comprendre"],
  ["td1", "02", "TD1 · Transmission", "Coder et protéger"],
  ["routage", "03", "Routage", "Choisir et adapter"],
  ["mission", "04", "Mon réseau", "Tout faire fonctionner"],
];
function FinalMission() {
  const { state } = useLab();
  const [hop, setHop] = useState(0);
  const [corrupt, setCorrupt] = useState(false);
  const [sent, setSent] = useState(false);
  const graph = symmetric(
    ["A", "N1", "N2", "B"],
    LINKS.filter(([a, b]) => state.links.includes(`${a}-${b}`)),
  );
  const path = pathTo(shortestSteps(graph, "A").slice(-1)[0].labels, "A", "B");
  const payload = state.bits + (state.protection ? parity(state.bits) : "");
  const received = corrupt
    ? (payload[0] === "1" ? "0" : "1") + payload.slice(1)
    : payload;
  const levels = encodeSignal(received, state.coding);
  const decoded = decodeSignal(levels, state.coding);
  useEffect(() => {
    setHop(0);
    setSent(false);
  }, [state, corrupt]);
  return (
    <Lesson
      id="mission-finale"
      kicker="Mission de synthèse"
      title="De A à B, avec ton propre réseau"
    >
      <p>
        Les ateliers ont construit les pièces d'un même système. Combine
        maintenant tes liaisons, ton codage et ton contrôle d'erreur. Les coûts
        de graphe sont abstraits ; la durée de transmission ci-dessous vient
        séparément du réglage de ta liaison.
      </p>
      <NetworkBuilder final />
      <div className="nl-workbench">
        <h3>Prépare puis achemine ton message</h3>
        <p>
          Message : <code>{state.bits}</code> · codage{" "}
          {state.coding === "differential"
            ? "Manchester différentiel"
            : state.coding === "manchester"
              ? "Manchester"
              : "NRZ"}{" "}
          ·{" "}
          {state.protection
            ? "parité paire ajoutée"
            : "sans contrôle de parité"}
          .
        </p>
        <p>
          Réglage d'alphabet conservé : {state.valence} symboles,{" "}
          {state.symbolMs} ms/symbole. Ce débit abstrait multivalent est
          distinct du tracé binaire : ici, le schéma transporte un bit par
          cellule temporelle (deux demi-cellules en Manchester), de durée{" "}
          {state.symbolMs} ms. Durée du mot tracé :{" "}
          {payload.length * state.symbolMs} ms par liaison, hors propagation et
          attente.
        </p>
        <label>
          <input
            type="checkbox"
            checked={corrupt}
            onChange={(e) => setCorrupt(e.target.checked)}
          />{" "}
          Inverser le premier bit pendant la transmission
        </label>
        <GraphView
          graph={graph}
          path={sent ? path.slice(0, hop + 1) : []}
          active={sent ? path[hop] : null}
        />
        <div className="nl-inline">
          <button
            className="nl-primary"
            onClick={() => {
              setSent(true);
              setHop(0);
            }}
          >
            Lancer mon message
          </button>
          <button
            disabled={!sent || !path.length || hop >= path.length - 1}
            onClick={() => setHop(hop + 1)}
          >
            Prochain nœud →
          </button>
          <button
            onClick={() => {
              setSent(false);
              setHop(0);
            }}
          >
            Recommencer
          </button>
        </div>
        <p role="status">
          {sent
            ? path.length
              ? `Le message est à ${path[hop]}. ${hop === path.length - 1 ? "B a reçu le mot." : `Prochain saut : ${path[hop + 1]}.`}`
              : "Aucun chemin. Ajoute les liaisons nécessaires dans le constructeur."
            : "Prédis le chemin puis suis chaque décision locale."}
        </p>
        {sent && path.length > 0 && hop === path.length - 1 && (
          <>
            <Signal
              levels={levels}
              label="Signal reçu sur la dernière liaison"
              halves={state.coding !== "nrz"}
            />
            <p className={corrupt ? "nl-feedback" : "nl-good"}>
              Mot reçu : <code>{decoded}</code>.{" "}
              {state.protection
                ? parity(decoded)
                  ? "La parité détecte l’altération ; le récepteur ne doit pas accepter ce mot comme intact."
                  : "Le contrôle passe. Cela ne prouve pas que toute erreur imaginable serait détectée."
                : corrupt
                  ? "Sans contrôle, le récepteur n’a pas de moyen de détecter cette inversion dans ce modèle."
                  : "Le message est arrivé intact dans cet essai."}
            </p>
          </>
        )}
      </div>
      <Explain title="Faire le bilan sans l’interface">
        <p>
          Dessine ton réseau, indique la suite binaire, explique la convention
          du signal et calcule le débit d'un alphabet de 16 symboles. Donne le
          prochain saut vers B, puis supprime une liaison et recalcule le
          chemin. Termine en expliquant ce que prouve — et ne prouve pas — la
          parité. Tu dois pouvoir refaire ces raisonnements sur une copie.
        </p>
      </Explain>
      <p className="nl-takeaway">
        Tu sais construire une liaison, représenter et contrôler un message,
        comparer les modes de transfert et calculer des routes. L'adressage IP
        et le transport seront les prochaines parties du cours.
      </p>
    </Lesson>
  );
}
function Workspace() {
  const [chapter, setChapter] = useState("introduction");
  const { state, setState, saved } = useLab();
  const origin = useReturnLanguage();
  useEffect(() => {
    const read = () => {
      const part = window.location.hash.slice(1);
      if (chapters.some((c) => c[0] === part)) setChapter(part);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  function select(id: string) {
    setChapter(id);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${id}`,
    );
  }
  return (
    <div className="nl-root" lang="fr">
      <div className="nl-language-banner">
        <span>FR · Ce parcours est disponible en français.</span>
        <Link href={`/${origin}/cs/reseaux`}>
          Retour au site en {origin.toUpperCase()} ↗
        </Link>
      </div>
      <header className="nl-hero">
        <p className="nl-eyebrow">
          Réseaux · L2 informatique · apprendre par l'expérience
        </p>
        <h1>
          Un message.
          <br />
          <em>Tout un réseau.</em>
        </h1>
        <p>
          Construis les liaisons, fabrique le signal, puis trouve le chemin.
          Chaque manipulation prépare un exercice du cours.
        </p>
        <div className="nl-hero-stats">
          <span>
            <strong>3</strong> parties du cours
          </span>
          <span>
            <strong>7</strong> exercices TD1
          </span>
          <span>
            <strong>0</strong> contenu verrouillé
          </span>
        </div>
      </header>
      <nav className="nl-chapters" aria-label="Parties du laboratoire">
        {chapters.map(([id, no, title, sub]) => (
          <button
            key={id}
            aria-current={chapter === id ? "page" : undefined}
            onClick={() => select(id)}
          >
            <span>{no}</span>
            <strong>{title}</strong>
            <small>{sub}</small>
          </button>
        ))}
      </nav>
      <div className="nl-state">
        <span>
          Mon réseau · {state.links.length} liaisons · {state.bits.length} bits
          · {state.protection ? "parité active" : "sans parité"}
        </span>
        <span>
          {saved
            ? "Réglages conservés dans ce navigateur"
            : "Stockage indisponible : la session reste utilisable"}
        </span>
        <button
          onClick={() => {
            setState(() => ({ ...INITIAL_LAB, links: [] }));
          }}
        >
          Réinitialiser mon réseau
        </button>
      </div>
      <div key={chapter} className="nl-content">
        {chapter === "introduction" ? (
          <Introduction />
        ) : chapter === "td1" ? (
          <Transmission />
        ) : chapter === "routage" ? (
          <Routing />
        ) : (
          <FinalMission />
        )}
      </div>
      <footer className="nl-footer">
        <p>
          Reconstruction pédagogique à partir des cours, TD et annales de Lila
          Boukhatem. Ce parcours n'est pas un document officiel de l'université.
        </p>
        <div className="nl-inline">
          {chapters
            .filter((c) => c[0] !== chapter)
            .map(([id, , title]) => (
              <button
                key={id}
                onClick={() => {
                  select(id);
                  window.scrollTo({ top: 0, behavior: "auto" });
                }}
              >
                {title} →
              </button>
            ))}
        </div>
        <details>
          <summary>Sources et préparation aux examens</summary>
          <p>
            Cours : Intro.pdf (18 pages PDF, 35 diapositives), Routage.pdf (48
            pages). Pratique : TD123-correction.pdf p. 1–5, TD456-correction.pdf
            p. 1–2. Trois sujets retenus : partiel 1 h (codage), partiel 2021
            (vecteurs de distances), partiel L2Info 2023 (commutation/délais).
            Le final complète la lecture des tables ; ses calculs IP restent
            hors de ce parcours.
          </p>
          <p>
            Les situations inventées pour explorer sont indiquées comme
            illustrations. Les écarts repérés dans les corrigés sont expliqués à
            côté des calculs.
          </p>
        </details>
        <Link href={`/${origin}/cs/reseaux`}>
          Retrouver tous les cours et exercices classiques →
        </Link>
      </footer>
    </div>
  );
}
export function NetworkLab({ locale }: { locale: Locale }) {
  return locale === "fr" ? (
    <LabProvider>
      <Workspace />
    </LabProvider>
  ) : (
    <NetworkEntry locale={locale} />
  );
}
