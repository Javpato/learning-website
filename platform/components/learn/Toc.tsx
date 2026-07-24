"use client";

// "Sommaire" — lesson table of contents built client-side from the rendered
// article's h2/h3 ids (provided at build time by rehype-slug). Lets the
// learner jump straight to any subsection. Title localized unless overridden.

import { useEffect, useState } from "react";
import { learnUi } from "@/lib/learn/ui";
import { useLocale } from "./useLocale";

type Entry = { id: string; text: string; level: 2 | 3 };

export function Toc({ title }: { title?: string }) {
  const t = learnUi(useLocale());
  const heading = title ?? t.tocTitle;
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const article = document.querySelector("article.prose-page");
    if (!article) return;
    const found: Entry[] = [];
    article.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]").forEach((h) => {
      found.push({
        id: h.id,
        text: h.textContent ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      });
    });
    setEntries(found);
  }, []);

  if (entries.length < 2) return null;

  return (
    <nav className="toc" aria-label={heading}>
      <div className="toc-title">{heading}</div>
      <ul>
        {entries.map((e) => (
          <li key={e.id} className={e.level === 3 ? "toc-sub" : undefined}>
            <a href={`#${e.id}`}>{e.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
