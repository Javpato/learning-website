import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { csCrumb } from "@/lib/nav";
import { CourseProgress } from "@/components/cs/CourseProgress";
import { CourseGrid } from "@/components/cs/CourseGrid";

export const metadata = { title: "Python — Learning" };

const H1 = "Python — De cero a programador";
const INTRO =
  "Un viaje interactivo al estilo Codédex, de los fundamentos a Python avanzado. Cada capítulo ejecuta Python de verdad en tu navegador — no se instala nada — y cada gran hito desbloquea un proyecto guiado que escribes en tu propia máquina y subes a tu GitHub, hasta un juego de plataformas final. Completa cada nivel para conseguir tu medalla. ⚡";

export default function PythonHub({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const mod = `${base}/cs/python`;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: t.home, href: "/learning-website/", external: true },
          csCrumb(locale),
          { label: "Python" },
        ]}
      />
      <h1 className="text-5xl">{H1}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{INTRO}</p>

      <CourseProgress />
      <CourseGrid base={mod} />
    </>
  );
}
