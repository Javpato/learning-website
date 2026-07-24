// Second-derivative machinery for the critical-points widget: symbolic
// Hessian via mathjs, discriminant classification, and preset landscapes.

import { compile, derivative, parse, type EvalFunction } from "mathjs";

export class Field2WithHessian {
  readonly expr: string;
  private readonly f: EvalFunction;
  private readonly fx: EvalFunction;
  private readonly fy: EvalFunction;
  private readonly fxx: EvalFunction;
  private readonly fxy: EvalFunction;
  private readonly fyy: EvalFunction;

  constructor(expr: string) {
    this.expr = expr;
    const node = parse(expr);
    const dx = derivative(node, "x");
    const dy = derivative(node, "y");
    this.f = compile(expr);
    this.fx = dx.compile();
    this.fy = dy.compile();
    this.fxx = derivative(dx, "x").compile();
    this.fxy = derivative(dx, "y").compile();
    this.fyy = derivative(dy, "y").compile();
  }

  value(x: number, y: number): number {
    return this.f.evaluate({ x, y }) as number;
  }
  gradient(x: number, y: number): [number, number] {
    return [this.fx.evaluate({ x, y }) as number, this.fy.evaluate({ x, y }) as number];
  }
  hessian(x: number, y: number): { fxx: number; fxy: number; fyy: number } {
    return {
      fxx: this.fxx.evaluate({ x, y }) as number,
      fxy: this.fxy.evaluate({ x, y }) as number,
      fyy: this.fyy.evaluate({ x, y }) as number,
    };
  }
}

export type CriticalKind = "minimum" | "maximum" | "selle" | "dégénéré";

/** Second-derivative test at a point (assumed critical). */
export function classify(fxx: number, fxy: number, fyy: number): {
  D: number;
  kind: CriticalKind;
} {
  const D = fxx * fyy - fxy * fxy;
  if (Math.abs(D) < 1e-9) return { D, kind: "dégénéré" };
  if (D < 0) return { D, kind: "selle" };
  return { D, kind: fxx > 0 ? "minimum" : "maximum" };
}
