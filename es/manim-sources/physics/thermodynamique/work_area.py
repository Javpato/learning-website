"""Work as area under the P-V curve — exercice 1 thermodynamique.

Shows that W = ∫P dV depends on the path. Plots two paths from A to B
in a (V, P) diagram — an isotherm and a two-leg isobaric-isochoric path —
and animates the shaded area filling under each path side-by-side.
"""
from manimlib import *
import numpy as np

BG       = "#0e1116"
FG       = "#e8e6e3"
FG_MUTED = "#9aa0a6"
ACCENT   = "#58a6ff"
WARM     = "#f5b942"
SUCCESS  = "#6ee7b7"


class WorkAreaIntro(Scene):
    def construct(self):
        # ---- Title -------------------------------------------------------
        title = Text("Le travail dépend du chemin", font="Inter", weight="MEDIUM").scale(0.9)
        sub = Text(
            "W = ∫P dV — l'aire sous la courbe, et donc le chemin choisi",
            font="Inter",
        ).scale(0.45).set_color(FG_MUTED)
        VGroup(title, sub).arrange(DOWN, buff=0.25).to_edge(UP, buff=0.4)
        self.play(Write(title), FadeIn(sub, shift=0.2 * UP))
        self.wait(0.4)

        # ---- Axes (V on x, P on y) ---------------------------------------
        # Endpoints chosen for visual clarity: A = (3, 1), B = (1, 3) so P_B = 3 P_A
        axes = Axes(
            x_range=(0, 4, 1),
            y_range=(0, 4, 1),
            width=7,
            height=4.2,
            axis_config={"stroke_color": FG_MUTED, "include_ticks": True},
        )
        axes.shift(DOWN * 0.6)

        v_label = Tex("V").scale(0.65).next_to(axes.x_axis.get_end(), RIGHT, buff=0.15).set_color(FG_MUTED)
        p_label = Tex("P").scale(0.65).next_to(axes.y_axis.get_end(), UP, buff=0.15).set_color(FG_MUTED)

        # Convert data (V, P) -> screen point
        c2p = axes.c2p
        A = c2p(3, 1)
        B = c2p(1, 3)

        a_dot = Dot(A, color=ACCENT, radius=0.07)
        b_dot = Dot(B, color=ACCENT, radius=0.07)
        a_label = Tex("A").scale(0.6).next_to(a_dot, DR, buff=0.1).set_color(ACCENT)
        b_label = Tex("B").scale(0.6).next_to(b_dot, UR, buff=0.1).set_color(ACCENT)

        self.play(ShowCreation(axes), Write(v_label), Write(p_label))
        self.play(FadeIn(a_dot), FadeIn(b_dot), Write(a_label), Write(b_label))
        self.wait(0.4)

        # ---- Path 1 — Isotherm  P*V = 3 ---------------------------------
        # Parametric curve from (3,1) to (1,3): P = 3 / V
        iso_curve = ParametricCurve(
            lambda t: c2p(t, 3.0 / t),
            t_range=[1.0, 3.0, 0.05],
            stroke_color=WARM,
            stroke_width=3,
        )

        # Path 2 — isobaric then isochoric: (3,1) -> (1,1) -> (1,3)
        path2 = VMobject(stroke_color=SUCCESS, stroke_width=3)
        path2.set_points_as_corners([c2p(3, 1), c2p(1, 1), c2p(1, 3)])

        # Show both paths
        path1_label = Tex(r"\text{Chemin 1 : isotherme}", color=WARM).scale(0.5)
        path1_label.next_to(c2p(2.0, 1.5), UR, buff=0.15)
        path2_label = Tex(r"\text{Chemin 2 : iso. V puis iso. P}", color=SUCCESS).scale(0.5)
        path2_label.next_to(c2p(1.0, 2.0), LEFT, buff=0.15)

        self.play(ShowCreation(iso_curve), Write(path1_label), run_time=1.5)
        self.wait(0.3)
        self.play(ShowCreation(path2), Write(path2_label), run_time=1.5)
        self.wait(0.4)

        # ---- Shade area under each path one after another ---------------
        # Area 1 — under the isotherm from V=1 to V=3 (this is the work
        # exchanged on the path A -> B in absolute terms, modulo sign)
        area1 = self._area_under_curve(axes, lambda v: 3.0 / v, 1.0, 3.0, color=WARM, opacity=0.35)
        area2 = self._area_under_two_legs(axes, color=SUCCESS, opacity=0.35)

        w1_cap = Tex(r"W_1 = nRT_A\,\ln 3", color=WARM).scale(0.55)
        w2_cap = Tex(r"W_2 = 2P_A V_A", color=SUCCESS).scale(0.55)
        w1_cap.to_corner(DR, buff=0.7).shift(UP * 0.6 + LEFT * 0.2)
        w2_cap.next_to(w1_cap, DOWN, buff=0.15, aligned_edge=RIGHT)

        self.play(FadeIn(area1), Write(w1_cap), run_time=1.5)
        self.wait(0.4)
        self.play(FadeIn(area2), Write(w2_cap), run_time=1.5)
        self.wait(0.6)

        # ---- Punchline ---------------------------------------------------
        punchline = Text(
            "W dépend du chemin — ce n'est pas une fonction d'état.",
            font="Inter",
        ).scale(0.5).set_color(SUCCESS).to_edge(DOWN, buff=0.4)
        self.play(Write(punchline))
        self.wait(2.2)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _area_under_curve(self, axes, fn, v_start, v_end, color=WARM, opacity=0.35):
        """Build a filled polygon under a curve from (V, fn(V)) down to (V, 0)."""
        pts = []
        steps = 40
        for i in range(steps + 1):
            v = v_start + (v_end - v_start) * i / steps
            pts.append(axes.c2p(v, fn(v)))
        # close along the V-axis
        pts.append(axes.c2p(v_end, 0))
        pts.append(axes.c2p(v_start, 0))
        poly = Polygon(*pts, stroke_width=0, fill_color=color, fill_opacity=opacity)
        return poly

    def _area_under_two_legs(self, axes, color=SUCCESS, opacity=0.35):
        """Two-leg path: (3,1) → (1,1) → (1,3). Area under = rectangle (1..3) × 1
        plus rectangle (1,1) → (1,3) which is a vertical line — zero area there.
        So the work integral is just the area under the horizontal leg P=1
        from V=1 to V=3, i.e. a rectangle 2×1."""
        pts = [
            axes.c2p(1, 1),
            axes.c2p(3, 1),
            axes.c2p(3, 0),
            axes.c2p(1, 0),
        ]
        return Polygon(*pts, stroke_width=0, fill_color=color, fill_opacity=opacity)
