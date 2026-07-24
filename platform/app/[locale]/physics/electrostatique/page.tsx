import { PhysicsThemeHub } from "@/components/learn/PhysicsThemeHub";

export const metadata = {
  title: "Électrostatique — Learning",
};

export default function Page({ params }: { params: { locale: string } }) {
  return (
    <PhysicsThemeHub
      localeParam={params.locale}
      themeSlug="electrostatique"
      intro={{
        fr: "Charges, champs, potentiel et dipôle : le cœur officiel de l'UE « Électromagnétisme et interactions : statique » (S3). Commence par la boîte à outils si les opérateurs vectoriels sont flous — ou saute directement où tu veux.",
        en: "Charges, fields, potential, and dipoles: the official core of the “Electromagnetism and interactions: statics” course unit (S3). Start with the toolbox if the vector operators feel hazy—or jump straight to whatever you want.",
        es: "Cargas, campos, potencial y dipolo: el núcleo oficial de la unidad curricular «Electromagnetismo e interacciones: estática» (S3). Empieza por la caja de herramientas si los operadores vectoriales no están claros, o salta directamente adonde quieras.",
      }}
      filLine={{
        fr: "Fil rouge — « D'une charge isolée à la liaison hydrogène » : apprendre le langage des champs, puis passer d'une charge au dipôle de l'eau.",
        en: "Guiding thread—“From an isolated charge to the hydrogen bond”: learn the language of fields, then move from a charge to water's dipole.",
        es: "Hilo conductor: «De una carga aislada al enlace de hidrógeno»; aprende el lenguaje de los campos y pasa después de una carga al dipolo del agua.",
      }}
    />
  );
}
