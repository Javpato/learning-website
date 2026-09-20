import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { NetworkLab } from "@/components/cs/network-lab/NetworkLab";
export const metadata = {
  title: "Construire un réseau — Introduction, TD1 et Routage",
  description:
    "Un parcours interactif en français : construire des liaisons, coder un signal, détecter des erreurs et calculer les routes.",
};
export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  return <NetworkLab locale={params.locale} />;
}
