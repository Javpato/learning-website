import type { MDXComponents } from "mdx/types";
import { Collapsible } from "@/components/ui/Collapsible";
import { Pitfall } from "@/components/ui/Pitfall";
import { Accroche } from "@/components/ui/Accroche";
import { DiffWidget } from "@/components/math/scenes/DiffWidget";
import { FittingWidget } from "@/components/math/scenes/FittingWidget";

// Components available in every .mdx page without an explicit import, plus
// element overrides so raw Markdown picks up the prose styling.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Collapsible,
    Pitfall,
    Accroche,
    DiffWidget,
    FittingWidget,
    ...components,
  };
}
