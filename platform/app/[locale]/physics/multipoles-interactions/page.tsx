import { PhysicsThemeHub } from "@/components/learn/PhysicsThemeHub";

export const metadata = {
  title: "Multipôles & interactions moléculaires — Learning",
};

export default function Page({ params }: { params: { locale: string } }) {
  return (
    <PhysicsThemeHub
      localeParam={params.locale}
      themeSlug="multipoles-interactions"
      intro={{
        fr: "Le pont chimie–physique du semestre dynamique (S4) : comprimer une distribution de charges en monopôle, dipôle et quadrupôle, puis en déduire les forces intermoléculaires — permanentes, induites et leurs lois d'échelle.",
        en: "The chemistry–physics bridge in the dynamics semester (S4): compress a charge distribution into a monopole, dipole, and quadrupole, then deduce the intermolecular forces—permanent and induced—and their scaling laws.",
        es: "El puente entre química y física del semestre de dinámica (S4): condensar una distribución de cargas en monopolo, dipolo y cuadrupolo, y deducir después las fuerzas intermoleculares, permanentes e inducidas, y sus leyes de escala.",
      }}
      filLine={{
        fr: "Fil rouge — « D'une charge isolée à la liaison hydrogène » : comprimer une molécule en quelques moments pour expliquer ses interactions, son induction et ses forces de van der Waals.",
        en: "Guiding thread—“From an isolated charge to the hydrogen bond”: compress a molecule into a few moments to explain its interactions, induction, and van der Waals forces.",
        es: "Hilo conductor: «De una carga aislada al enlace de hidrógeno»; condensa una molécula en unos pocos momentos para explicar sus interacciones, su inducción y sus fuerzas de van der Waals.",
      }}
    />
  );
}
