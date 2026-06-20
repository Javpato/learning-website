import Link from "next/link";
import { Fragment } from "react";

// `external: true` links out of the Next app (e.g. back to the main static site
// at /learning-website/…) and must use a plain <a> so the basePath
// (/learning-website/platform) is NOT prepended.
export type Crumb = { label: string; href?: string; external?: boolean };

/** Breadcrumb trail mirroring the legacy `.crumbs` look. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-8 text-sm text-fg-muted" aria-label="breadcrumb">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="px-2 text-fg-dim">/</span>}
          {item.href ? (
            item.external ? (
              <a href={item.href} className="text-fg-muted hover:text-accent">
                {item.label}
              </a>
            ) : (
              <Link href={item.href} className="text-fg-muted hover:text-accent">
                {item.label}
              </Link>
            )
          ) : (
            <span>{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
