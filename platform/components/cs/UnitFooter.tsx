"use client";

// Per-unit footer for the Python course: a "complete this level" button that
// saves progress to localStorage and plays a celebratory Pokémon animation with
// a link to the next level. Rendered by app/[locale]/cs/python/layout.tsx, so it
// appears on every unit page automatically (and renders nothing on the hub).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { unitBySlug, nextUnit, prevUnit, pick } from "@/lib/python/course";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { isDone, setDone, subscribe } from "@/lib/progress";
import { PokemonSprite } from "./PokemonSprite";

export function UnitFooter() {
  const pathname = usePathname() ?? "";
  const parts = pathname.split("/").filter(Boolean);
  const i = parts.indexOf("python");
  const slug = i >= 0 ? parts[i + 1] : undefined;
  const unit = slug ? unitBySlug(slug) : undefined;
  // Path is /<locale>/cs/python/<slug>; locale sits two segments before "python".
  const localeSeg = parts[i - 2];
  const locale = isLocale(localeSeg) ? localeSeg : defaultLocale;

  const [done, setDoneState] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setDoneState(isDone(slug));
    return subscribe(() => setDoneState(isDone(slug)));
  }, [slug]);

  // Not a unit page (e.g. the hub) or unknown slug → render nothing.
  if (!slug || !unit) return null;

  const prefix = "/" + parts.slice(0, i + 1).join("/"); // …/cs/python
  const next = nextUnit(slug);
  const prev = prevUnit(slug);

  function complete() {
    setDone(slug!, true);
    setCelebrating(true);
  }

  return (
    <>
    <div className="unit-footer">
      {!done ? (
        <button type="button" className="complete-btn" onClick={complete}>
          <PokemonSprite pokemon={unit.pokemon} size={48} />
          <span>¡Completar nivel! ⚡</span>
        </button>
      ) : (
        <div className={`congrats${celebrating ? " celebrate" : ""}`}>
          <PokemonSprite pokemon={unit.pokemon} size={72} className="congrats-sprite" />
          <div className="congrats-bubble">
            <p className="congrats-title">¡Nivel completado! 🎉</p>
            <p className="congrats-text">
              {next
                ? "¡Bien hecho, entrenador! Sigamos con el siguiente nivel."
                : "¡Increíble! Has completado todo el curso. 🏆"}
            </p>
            <div className="congrats-actions">
              {next && (
                <Link className="next-btn" href={`${prefix}/${next.slug}`}>
                  Ir al siguiente nivel →
                </Link>
              )}
              <button
                type="button"
                className="undo-btn"
                onClick={() => {
                  setDone(slug!, false);
                  setCelebrating(false);
                }}
              >
                Desmarcar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <nav className="unit-nav" aria-label="Navegación del curso">
      {prev ? (
        <Link className="prev" href={`${prefix}/${prev.slug}`}>
          ← {pick(prev.title, locale)}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="next" href={`${prefix}/${next.slug}`}>
          {pick(next.title, locale)} →
        </Link>
      ) : (
        <span />
      )}
    </nav>
    </>
  );
}
