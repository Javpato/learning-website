import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { csCrumb } from "@/lib/nav";
import { CourseProgress } from "@/components/cs/CourseProgress";
import { CourseGrid } from "@/components/cs/CourseGrid";

export const metadata = { title: "Python — Learning" };

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
      <h1 className="text-5xl">{t.pyHubTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">{t.pyHubIntro}</p>

      <CourseProgress locale={locale} />
      <CourseGrid base={mod} locale={locale} />
    </>
  );
}
