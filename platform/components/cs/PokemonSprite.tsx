import { spriteUrl } from "@/lib/python/course";

// A self-hosted animated Pokémon sprite (public/pokemon/<name>.gif), rendered
// crisp (pixelated). Plain <img> so it works in server and client components.
export function PokemonSprite({
  pokemon,
  size = 56,
  className = "",
}: {
  pokemon: string;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={spriteUrl(pokemon)}
      alt={pokemon}
      height={size}
      loading="lazy"
      className={`pkmn ${className}`}
      style={{ height: size, width: "auto" }}
    />
  );
}
