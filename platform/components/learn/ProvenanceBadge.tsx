"use client";

import { l10n, PROVENANCE_HELP, PROVENANCE_LABELS, type Provenance } from "@/lib/content/types";
import { useLocale } from "./useLocale";

/**
 * Discreet provenance pill (Programme officiel / Reconstruction fiable / …).
 * Transparency without intimidation: small, muted, with the full explanation
 * in a native tooltip. Localized via the URL locale.
 */
export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  const locale = useLocale();
  return (
    <span
      className={`provenance-badge${provenance === "extension" ? " provenance-extension" : ""}`}
      title={l10n(locale, PROVENANCE_HELP[provenance])}
    >
      {l10n(locale, PROVENANCE_LABELS[provenance])}
    </span>
  );
}
