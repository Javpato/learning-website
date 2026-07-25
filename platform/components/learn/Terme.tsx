"use client";

// Keyword ↔ definition linking for the learn tracks.
//
//  - <Def id="gradient">le **gradient**</Def> marks THE definition site of a
//    glossary term inside its lesson (anchor #def-gradient). One per term,
//    in the lesson declared by the glossary entry — checked by
//    scripts/verify-content.cjs. Never place it inside a heading (heading ids
//    belong to rehype-slug / <Toc>).
//  - <Terme id="gradient">gradient</Terme> is the inline link used everywhere
//    else (TDs, exams, later lessons): it deep-links to the definition and
//    shows the one-line gloss on hover.
//
// Both take data through PROPS only — child-type inspection would break
// across the RSC boundary (see Quiz.tsx).

import Link from "next/link";
import type { ReactNode } from "react";
import { getTerme, termeHref } from "@/lib/content/registry";
import { l10n } from "@/lib/content/types";
import { useLocale } from "./useLocale";

export function Def({ id, children }: { id: string; children: ReactNode }) {
  return (
    <dfn id={`def-${id}`} className="term-def">
      {children}
    </dfn>
  );
}

export function Terme({ id, children }: { id: string; children: ReactNode }) {
  const locale = useLocale();
  const entry = getTerme(id);
  const href = termeHref(locale, id);
  if (!entry || !href) return <span>{children}</span>; // verifier reports the bad id
  return (
    <Link href={href} className="term-link" title={l10n(locale, entry.short)}>
      {children}
    </Link>
  );
}
