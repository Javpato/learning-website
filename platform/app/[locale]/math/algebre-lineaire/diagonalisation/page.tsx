import ContentFr from "./content.fr.mdx";
import ContentEs from "./content.es.mdx";
import ContentEn from "./content.en.mdx";
import { LinearAlgebraPage } from "../_shared";

export const metadata = { title: "Diagonalisabilité — Learning" };

export default function Page({ params }: { params: { locale: string } }) {
  return <LinearAlgebraPage localeParam={params.locale} contents={{ fr: ContentFr, es: ContentEs, en: ContentEn }} labels={{ fr: "Diagonalisabilité", es: "Diagonalizabilidad", en: "Diagonalizability" }} />;
}
