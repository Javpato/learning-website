import { PhysicsThemeHub } from "@/components/learn/PhysicsThemeHub";

export const metadata = {
  title: "Particules chargées — Learning",
};

export default function Page({ params }: { params: { locale: string } }) {
  return (
    <PhysicsThemeHub
      localeParam={params.locale}
      themeSlug="particules-chargees"
      intro={{
        fr: "La force de Lorentz en action : mouvement cyclotron, sélecteurs de vitesse et spectrométrie de masse — l'application chimique par excellence — avec un pont optionnel vers l'induction et les équations de Maxwell.",
        en: "The Lorentz force in action: cyclotron motion, velocity selectors, and mass spectrometry—the quintessential chemistry application—with an optional bridge to induction and Maxwell's equations.",
        es: "La fuerza de Lorentz en acción: movimiento ciclotrón, selectores de velocidad y espectrometría de masas, la aplicación química por excelencia, con un puente opcional hacia la inducción y las ecuaciones de Maxwell.",
      }}
      filLine={{
        fr: "Fil rouge — « D'une charge isolée à la liaison hydrogène » : appliquer les champs à la spectrométrie de masse, l'outil du chimiste, puis ouvrir une extension vers Maxwell.",
        en: "Guiding thread—“From an isolated charge to the hydrogen bond”: apply fields to mass spectrometry, the chemist's tool, then open an extension toward Maxwell.",
        es: "Hilo conductor: «De una carga aislada al enlace de hidrógeno»; aplica los campos a la espectrometría de masas, la herramienta del químico, y abre después una extensión hacia Maxwell.",
      }}
    />
  );
}
