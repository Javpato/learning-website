"use client";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { rememberLanguage } from "./language";
export function NetworkEntry({ locale }: { locale: Locale }) {
  const text = {
    fr: {
      tag: "Le laboratoire des réseaux",
      title: "Construis. Transmets. Trouve le chemin.",
      body: "Du premier signal au routage : apprends en construisant un réseau, avec les exercices du cours.",
      note: "Ce parcours est disponible en français.",
      go: "Entrer dans le laboratoire",
      return: "La langue du reste du site sera conservée.",
    },
    en: {
      tag: "The networking laboratory",
      title: "Build. Transmit. Find the route.",
      body: "An interactive journey from your first signal to routing, based on the course exercises.",
      note: "This interactive course is available in French only.",
      go: "Open the French course",
      return: "When you leave, the rest of the site will return to English.",
    },
    es: {
      tag: "El laboratorio de redes",
      title: "Construye. Transmite. Encuentra la ruta.",
      body: "Un recorrido interactivo desde la primera señal hasta el enrutamiento, basado en los ejercicios del curso.",
      note: "Este recorrido interactivo está disponible solo en francés.",
      go: "Abrir el curso en francés",
      return: "Al salir, el resto del sitio volverá al español.",
    },
  }[locale];
  return (
    <section className="nl-entry">
      <p className="nl-eyebrow">{text.tag}</p>
      <h1>{text.title}</h1>
      <p className="nl-lead">{text.body}</p>
      <div className="nl-entry-map" aria-hidden="true">
        <span>A</span>
        <i />
        <span>01</span>
        <i />
        <span>N</span>
        <i />
        <span>B</span>
      </div>
      <div className="nl-entry-chapters">
        <span>01 · Introduction</span>
        <span>02 · TD1</span>
        <span>03 · Routage</span>
      </div>
      <p>
        <strong>{text.note}</strong>
        <br />
        {text.return}
      </p>
      <Link
        className="nl-primary"
        href={`/fr/cs/reseaux/atelier?from=${locale}`}
        onClick={() => rememberLanguage(locale)}
      >
        {text.go} <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
