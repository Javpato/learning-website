import { compile, derivative, parse, type EvalFunction } from "mathjs";

/**
 * A scalar field f: R^2 -> R, defined by a mathjs expression in x and y.
 * Partial derivatives are computed symbolically once and cached, so the
 * differential, tangent plane, and o(‖h‖) residual all come from one source.
 */
export class ScalarField2D {
  readonly expr: string;
  readonly label: string;
  private readonly f: EvalFunction;
  private readonly fx: EvalFunction;
  private readonly fy: EvalFunction;

  constructor(expr: string, label: string) {
    this.expr = expr;
    this.label = label;
    const node = parse(expr);
    this.f = compile(expr);
    this.fx = derivative(node, "x").compile();
    this.fy = derivative(node, "y").compile();
  }

  /** f(x, y) */
  value(x: number, y: number): number {
    return this.f.evaluate({ x, y }) as number;
  }

  /** ∇f(a) = (∂f/∂x, ∂f/∂y) at a = (x, y) */
  gradient(x: number, y: number): [number, number] {
    return [
      this.fx.evaluate({ x, y }) as number,
      this.fy.evaluate({ x, y }) as number,
    ];
  }

  /** df_a(h, k) = ∂f/∂x · h + ∂f/∂y · k — the linear approximation's slope part. */
  differential(a: [number, number], h: [number, number]): number {
    const [gx, gy] = this.gradient(a[0], a[1]);
    return gx * h[0] + gy * h[1];
  }

  /** Affine tangent approximation T(a+h) = f(a) + df_a(h). */
  tangentValue(a: [number, number], h: [number, number]): number {
    return this.value(a[0], a[1]) + this.differential(a, h);
  }

  /**
   * Residual r(h) = f(a+h) − f(a) − df_a(h). For a differentiable f this is
   * o(‖h‖): r(h)/‖h‖ → 0. That ratio is what the widgets render "shrinking".
   */
  residual(a: [number, number], h: [number, number]): number {
    return this.value(a[0] + h[0], a[1] + h[1]) - this.tangentValue(a, h);
  }
}

export function norm2([x, y]: [number, number]): number {
  return Math.hypot(x, y);
}

/** |r(h)| / ‖h‖ — the quantity that must tend to 0 for differentiability. */
export function residualRatio(
  field: ScalarField2D,
  a: [number, number],
  h: [number, number],
): number {
  const n = norm2(h);
  if (n === 0) return 0;
  return Math.abs(field.residual(a, h)) / n;
}

// The example field used on the differentiability page: f(x,y) = x² + y².
export const EXAMPLE_FIELD = new ScalarField2D("x^2 + y^2", "x^2 + y^2");
