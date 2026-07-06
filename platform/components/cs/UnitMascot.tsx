"use client";

// A floating "companion" sprite in the corner of every Python-course page — the
// current unit's Pokémon (or Pikachu on the hub). Purely decorative
// (pointer-events: none), it idles with a gentle bob. Rendered by the course
// layout so it follows the learner through the whole course.

import { usePathname } from "next/navigation";
import { unitBySlug } from "@/lib/python/course";
import { PokemonSprite } from "./PokemonSprite";

export function UnitMascot() {
  const pathname = usePathname() ?? "";
  const parts = pathname.split("/").filter(Boolean);
  const i = parts.indexOf("python");
  const slug = i >= 0 ? parts[i + 1] : undefined;
  const unit = slug ? unitBySlug(slug) : undefined;
  const pokemon = unit?.pokemon ?? "pikachu";

  return (
    <div className="unit-mascot" aria-hidden="true">
      <PokemonSprite pokemon={pokemon} size={72} />
    </div>
  );
}
