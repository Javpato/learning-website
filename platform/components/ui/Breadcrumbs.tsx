import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

/** Breadcrumb trail mirroring the legacy `.crumbs` look. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-8 text-sm text-fg-muted" aria-label="breadcrumb">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="px-2 text-fg-dim">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-fg-muted hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
