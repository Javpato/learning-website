import ContentFr from "./content.fr.mdx";
import ContentEs from "./content.es.mdx";
import ContentEn from "./content.en.mdx";
import { LinearAlgebraPage } from "../_shared";

export const metadata = { title: "Trace et déterminant — Learning" };

export default function Page({ params }: { params: { locale: string } }) {
  return <LinearAlgebraPage localeParam={params.locale} contents={{ fr: ContentFr, es: ContentEs, en: ContentEn }} labels={{ fr: "Trace et déterminant", es: "Traza y determinante", en: "Trace and determinant" }} />;
}
