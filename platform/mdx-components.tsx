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
import { GradientWidget } from "@/components/math/scenes/GradientWidget";
import { SurfaceLevelWidget } from "@/components/math/scenes/SurfaceLevelWidget";
import { CriticalPointsWidget } from "@/components/math/scenes/CriticalPointsWidget";
import { PhasePortraitWidget } from "@/components/math/scenes/PhasePortraitWidget";
import { TraceDetWidget } from "@/components/math/scenes/TraceDetWidget";
import { OscillatorWidget } from "@/components/math/scenes/OscillatorWidget";
import { LinearAlgebraWidget } from "@/components/math/scenes/LinearAlgebraWidget";
import { FieldMapWidget } from "@/components/physics/scenes/FieldMapWidget";
import { GaussSymmetryWidget } from "@/components/physics/scenes/GaussSymmetryWidget";
import { DipoleTorqueWidget } from "@/components/physics/scenes/DipoleTorqueWidget";
import { BiotSavartWidget } from "@/components/physics/scenes/BiotSavartWidget";
import { MultipoleFarFieldWidget } from "@/components/physics/scenes/MultipoleFarFieldWidget";
import { CyclotronWidget } from "@/components/physics/scenes/CyclotronWidget";
import { SqlExercise } from "@/components/cs/SqlExercise";
import { SqlSchema } from "@/components/cs/SqlSchema";
import { PyExercise } from "@/components/cs/PyExercise";
import { Tabs, Tab } from "@/components/cs/Tabs";
import { ProvenanceBadge } from "@/components/learn/ProvenanceBadge";
import { LessonMeta, RelatedExercises } from "@/components/learn/LessonMeta";
import { KeyResults } from "@/components/learn/KeyResults";
import { HintLadder, Hint } from "@/components/learn/HintLadder";
import {
  ExerciseView,
  Statement,
  FinalAnswer,
  Solution,
  CommonErrors,
} from "@/components/learn/ExerciseView";
import { Quiz, QItem, QOption, QFeedback, QExplain, QNumeric } from "@/components/learn/Quiz";
import { MockExamView, ExamProblem } from "@/components/learn/MockExamView";
import { LessonStateSelector } from "@/components/learn/LessonStateSelector";
import { Toc } from "@/components/learn/Toc";
import { Mission, MissionSolved } from "@/components/learn/Mission";
import { Rappel } from "@/components/learn/Rappel";

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
    GradientWidget,
    SurfaceLevelWidget,
    CriticalPointsWidget,
    PhasePortraitWidget,
    TraceDetWidget,
    OscillatorWidget,
    LinearAlgebraWidget,
    FieldMapWidget,
    GaussSymmetryWidget,
    DipoleTorqueWidget,
    BiotSavartWidget,
    MultipoleFarFieldWidget,
    CyclotronWidget,
    SqlExercise,
    SqlSchema,
    PyExercise,
    Tabs,
    Tab,
    ProvenanceBadge,
    LessonMeta,
    RelatedExercises,
    KeyResults,
    HintLadder,
    Hint,
    ExerciseView,
    Statement,
    FinalAnswer,
    Solution,
    CommonErrors,
    Quiz,
    QItem,
    QOption,
    QFeedback,
    QExplain,
    QNumeric,
    MockExamView,
    ExamProblem,
    LessonStateSelector,
    Toc,
    Mission,
    MissionSolved,
    Rappel,
    ...components,
  };
}
