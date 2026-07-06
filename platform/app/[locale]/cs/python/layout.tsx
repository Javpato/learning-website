import { UnitFooter } from "@/components/cs/UnitFooter";

// Wraps every Python-course page. UnitFooter appends the "complete this level"
// button + congrats animation on unit pages, and renders nothing on the hub.
export default function PythonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <UnitFooter />
    </>
  );
}
