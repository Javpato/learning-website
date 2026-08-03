import type { ReactNode } from "react";

/** A short, sourced quotation opening a lesson. */
export function Epigraph({
  author,
  work,
  href,
  translated = false,
  children,
}: {
  author: string;
  work: string;
  href: string;
  translated?: boolean;
  children: ReactNode;
}) {
  return (
    <figure className="epigraph">
      <blockquote>{children}</blockquote>
      <figcaption>
        — {author}, {" "}
        <a href={href} rel="noreferrer">
          <cite>{work}</cite>
        </a>
        {translated ? " (traduction française)" : ""}
      </figcaption>
    </figure>
  );
}
