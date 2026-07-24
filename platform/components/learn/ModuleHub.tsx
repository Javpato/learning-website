// Server-side card sections shared by the L2 Chimie hub pages (math module,
// physics themes). Everything is data-driven from lib/content and always
// linked — no card is ever disabled by progress or score.

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { ExamMetaData, LessonMetaData, TdMetaData } from "@/lib/content/types";
import { DIFFICULTY_LABELS, PROVENANCE_LABELS, l10n } from "@/lib/content/types";
import { learnUi } from "@/lib/learn/ui";
import { examHref, lessonHref, tdHref } from "@/lib/content/registry";

export function LessonCards({
  locale,
  lessons,
  numbered = true,
}: {
  locale: Locale;
  lessons: LessonMetaData[];
  numbered?: boolean;
}) {
  return (
    <div className="sub-grid">
      {lessons.map((l, i) => (
        <Link key={l.id} className="sub-card" href={lessonHref(locale, l)}>
          <div className="glyph">{numbered ? String(i).padStart(2, "0") : "§"}</div>
          <h3>{l10n(locale, l.title)}</h3>
          <p>
            {l10n(locale, DIFFICULTY_LABELS[l.difficulty])} · ~{l.timeMinutes} min ·{" "}
            {l10n(locale, PROVENANCE_LABELS[l.provenance])}
          </p>
        </Link>
      ))}
    </div>
  );
}

export function TdCards({ locale, tds }: { locale: Locale; tds: TdMetaData[] }) {
  return (
    <div className="sub-grid">
      {tds.map((td) => (
        <Link key={td.id} className="sub-card" href={tdHref(locale, td)}>
          <div className="glyph">✏️</div>
          <h3>{l10n(locale, td.title)}</h3>
          <p>{learnUi(locale).tdCardText(td.exercises.length)}</p>
        </Link>
      ))}
    </div>
  );
}

export function ExamCards({ locale, exams }: { locale: Locale; exams: ExamMetaData[] }) {
  return (
    <div className="sub-grid">
      {exams.map((e) => (
        <Link key={e.id} className="sub-card" href={examHref(locale, e)}>
          <div className="glyph">🎓</div>
          <h3>{l10n(locale, e.title)}</h3>
          <p>
            {e.durationMinutes} {learnUi(locale).suggestedMinutes} · {e.totalPoints}{" "}
            {learnUi(locale).points} · {learnUi(locale).examCardText}
          </p>
        </Link>
      ))}
    </div>
  );
}
