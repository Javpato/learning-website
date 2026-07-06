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
import { DiffProofFigure } from "@/components/math/scenes/DiffProofFigure";
import { SqlExercise } from "@/components/cs/SqlExercise";
import { SqlSchema } from "@/components/cs/SqlSchema";
import { PyExercise } from "@/components/cs/PyExercise";
import { Tabs, Tab } from "@/components/cs/Tabs";

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
    DiffProofFigure,
    SqlExercise,
    SqlSchema,
    PyExercise,
    Tabs,
    Tab,
    ...components,
  };
}
