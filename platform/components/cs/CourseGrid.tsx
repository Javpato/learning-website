"use client";

// The Python hub's card grid, grouped by module, each card carrying its Pokémon
// sprite and a "✓ Completado" badge driven by localStorage progress. Client-side
// so completion badges stay live as the learner finishes levels.

import Link from "next/link";
import { useEffect, useState } from "react";
import { MODULES, LEGENDARIES } from "@/lib/python/course";
import { getCompleted, subscribe } from "@/lib/progress";
import { PokemonSprite } from "./PokemonSprite";

export function CourseGrid({ base }: { base: string }) {
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    const update = () => setDone(getCompleted());
    update();
    return subscribe(update);
  }, []);

  return (
    <>
      {MODULES.map((m) => (
        <section key={m.title} className="mt-10">
          <h2 className="module-head text-2xl text-accent-warm">
            <span className="pokeball" aria-hidden="true" />
            {m.title}
          </h2>
          <div className="sub-grid">
            {m.units.map((u) => {
              const isDone = done.has(u.slug);
              const isCapstone = u.slug === "project-capstone-plataformas";
              return (
                <Link
                  key={u.slug}
                  href={`${base}/${u.slug}`}
                  className={`sub-card pkmn-card${u.kind === "project" ? " is-project" : ""}`}
                >
                  {isDone && <span className="done-badge">✓ Completado</span>}
                  <div className="pkmn-art">
                    <PokemonSprite pokemon={u.pokemon} size={64} />
                  </div>
                  <div className="pkmn-body">
                    <h3>{u.title}</h3>
                    <p>{u.desc}</p>
                    {isCapstone && (
                      <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.5rem" }}>
                        {LEGENDARIES.filter((p) => p !== u.pokemon).map((p) => (
                          <PokemonSprite key={p} pokemon={p} size={28} />
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
