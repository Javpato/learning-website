import { PhysicsThemeHub } from "@/components/learn/PhysicsThemeHub";

export const metadata = {
  title: "Magnétostatique — Learning",
};

export default function Page({ params }: { params: { locale: string } }) {
  return (
    <PhysicsThemeHub
      localeParam={params.locale}
      themeSlug="magnetostatique"
      intro={{
        fr: "Champs magnétiques créés par les courants permanents : Biot–Savart pour intégrer, Ampère pour exploiter la symétrie, puis le potentiel vecteur et le dipôle magnétique — l'analogue magnétique du dipôle électrique.",
        en: "Magnetic fields created by steady currents: Biot–Savart for integration, Ampère's theorem for exploiting symmetry, then the vector potential and magnetic dipole—the magnetic analogue of the electric dipole.",
        es: "Campos magnéticos creados por corrientes estacionarias: Biot–Savart para integrar, el teorema de Ampère para aprovechar la simetría y, después, el potencial vector y el dipolo magnético, análogo magnético del dipolo eléctrico.",
      }}
      filLine={{
        fr: "Fil rouge — « D'une charge isolée à la liaison hydrogène » : les courants forment l'autre moitié de l'électromagnétisme et préparent le magnétisme moléculaire.",
        en: "Guiding thread—“From an isolated charge to the hydrogen bond”: currents form the other half of electromagnetism and prepare you for molecular magnetism.",
        es: "Hilo conductor: «De una carga aislada al enlace de hidrógeno»; las corrientes forman la otra mitad del electromagnetismo y preparan el magnetismo molecular.",
      }}
    />
  );
}
