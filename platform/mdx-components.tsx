import type { MDXComponents } from "mdx/types";
import { Collapsible } from "@/components/ui/Collapsible";
import { Pitfall } from "@/components/ui/Pitfall";
import { Accroche } from "@/components/ui/Accroche";
import { DiffWidget } from "@/components/math/scenes/DiffWidget";
import { FittingWidget } from "@/components/math/scenes/FittingWidget";
import { NormBallWidget } from "@/components/math/scenes/NormBallWidget";
import { FunctionNormWidget } from "@/components/math/scenes/FunctionNormWidget";
import { BallWidget } from "@/components/math/scenes/BallWidget";
import { OpenSetWidget } from "@/components/math/scenes/OpenSetWidget";
import { ConvergenceWidget } from "@/components/math/scenes/ConvergenceWidget";
import { HairyBallWidget } from "@/components/math/scenes/HairyBallWidget";
import { FlagWidget } from "@/components/math/scenes/FlagWidget";

// Components available in every .mdx page without an explicit import, plus
// element overrides so raw Markdown picks up the prose styling.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Collapsible,
    Pitfall,
    Accroche,
    DiffWidget,
    FittingWidget,
    NormBallWidget,
    FunctionNormWidget,
    BallWidget,
    OpenSetWidget,
    ConvergenceWidget,
    HairyBallWidget,
    FlagWidget,
    ...components,
  };
}
