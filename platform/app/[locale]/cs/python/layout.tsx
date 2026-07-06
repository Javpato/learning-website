import { UnitFooter } from "@/components/cs/UnitFooter";
import { UnitMascot } from "@/components/cs/UnitMascot";

// Wraps every Python-course page in the Pokémon theme (.pkmn-course scopes the
// heading/banner styling), adds a floating companion sprite, and appends the
// "complete this level" footer (which renders nothing on the hub).
export default function PythonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pkmn-course">
      <UnitMascot />
      {children}
      <UnitFooter />
    </div>
  );
}
