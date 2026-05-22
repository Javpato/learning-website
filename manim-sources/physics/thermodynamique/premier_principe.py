"""Premier principe — energy flow visualization (exercice 2 thermo).

Shows the sign convention for W and Q applied to a closed system:
arrows in/out of a box labeled "Système", with an interior "ΔU" meter
that rises and falls accordingly.

Ends on the final relation: ΔU = W + Q.
"""
from manimlib import *

BG       = "#0e1116"
FG       = "#e8e6e3"
FG_MUTED = "#9aa0a6"
ACCENT   = "#58a6ff"
WARM     = "#f5b942"
SUCCESS  = "#6ee7b7"
DANGER   = "#f87171"


class PremierPrincipeIntro(Scene):
    def construct(self):
        # ---- Title -------------------------------------------------------
        title = Text("Premier principe — flux d'énergie", font="Inter", weight="MEDIUM").scale(0.85)
        sub = Text(
            "ΔU = W + Q  —  on compte ce qui entre dans le système",
            font="Inter",
        ).scale(0.45).set_color(FG_MUTED)
        VGroup(title, sub).arrange(DOWN, buff=0.25).to_edge(UP, buff=0.4)
        self.play(Write(title), FadeIn(sub, shift=0.2 * UP))
        self.wait(0.3)

        # ---- The system box ---------------------------------------------
        system = RoundedRectangle(
            width=3.2, height=2.2, corner_radius=0.18,
            stroke_color=FG_MUTED, fill_color="#1d222c", fill_opacity=1.0,
        ).shift(DOWN * 0.3)
        system_label = Text("Système", font="Inter").scale(0.55).set_color(FG_MUTED)
        system_label.move_to(system).shift(UP * 0.75)

        # Interior ΔU meter (a vertical bar that grows / shrinks)
        meter_track = Rectangle(
            width=0.4, height=1.2,
            stroke_color=FG_MUTED, stroke_width=1,
            fill_color="#0e1116", fill_opacity=1.0,
        ).move_to(system).shift(DOWN * 0.1)

        # Meter fill — anchored at the bottom of the track so growth is upward.
        meter_fill_height = ValueTracker(0.5)  # start half-filled
        meter_fill = always_redraw(
            lambda: Rectangle(
                width=0.36, height=meter_fill_height.get_value(),
                stroke_width=0, fill_color=ACCENT, fill_opacity=0.85,
            ).move_to(meter_track.get_bottom() + UP * meter_fill_height.get_value() / 2)
        )

        u_label = Tex(r"\Delta U", color=ACCENT).scale(0.5)
        u_label.next_to(meter_track, RIGHT, buff=0.15)

        self.play(
            ShowCreation(system),
            FadeIn(system_label),
            ShowCreation(meter_track),
            FadeIn(meter_fill),
            Write(u_label),
        )
        self.wait(0.3)

        # ---- Arrow factory ----------------------------------------------
        def in_arrow(start, end, color, label_tex):
            arrow = Arrow(start, end, buff=0.05, color=color, thickness=4.5)
            lab = Tex(label_tex, color=color).scale(0.7)
            lab.next_to(arrow, UP if abs(end[1] - start[1]) < 0.1 else RIGHT, buff=0.15)
            return arrow, lab

        # ---- W in from the left -----------------------------------------
        w_arrow = Arrow(
            system.get_left() + LEFT * 1.8, system.get_left() + LEFT * 0.05,
            buff=0, color=ACCENT, thickness=5,
        )
        w_label = Tex("W > 0", color=ACCENT).scale(0.7)
        w_label.next_to(w_arrow, UP, buff=0.18)
        w_caption = Text("Travail reçu par le système", font="Inter").scale(0.42).set_color(FG_MUTED)
        w_caption.next_to(w_arrow, DOWN, buff=0.2)

        self.play(GrowArrow(w_arrow), Write(w_label), FadeIn(w_caption))
        self.play(meter_fill_height.animate.set_value(0.9), run_time=1.2)
        self.wait(0.3)

        # ---- Q in from the right ----------------------------------------
        q_arrow = Arrow(
            system.get_right() + RIGHT * 1.8, system.get_right() + RIGHT * 0.05,
            buff=0, color=WARM, thickness=5,
        )
        q_label = Tex("Q > 0", color=WARM).scale(0.7)
        q_label.next_to(q_arrow, UP, buff=0.18)
        q_caption = Text("Chaleur reçue par le système", font="Inter").scale(0.42).set_color(FG_MUTED)
        q_caption.next_to(q_arrow, DOWN, buff=0.2)

        self.play(GrowArrow(q_arrow), Write(q_label), FadeIn(q_caption))
        self.play(meter_fill_height.animate.set_value(1.15), run_time=1.2)
        self.wait(0.5)

        # ---- Flip W to negative — system gives work ---------------------
        flip_caption = Text(
            "Si le système rend du travail à l'extérieur, on inverse la flèche.",
            font="Inter",
        ).scale(0.42).set_color(DANGER)
        flip_caption.to_edge(DOWN, buff=0.6)
        self.play(FadeIn(flip_caption))

        w_arrow_neg = Arrow(
            system.get_left() + LEFT * 0.05, system.get_left() + LEFT * 1.8,
            buff=0, color=DANGER, thickness=5,
        )
        w_label_neg = Tex("W < 0", color=DANGER).scale(0.7)
        w_label_neg.next_to(w_arrow_neg, UP, buff=0.18)

        self.play(
            Transform(w_arrow, w_arrow_neg),
            Transform(w_label, w_label_neg),
            FadeOut(w_caption),
        )
        self.play(meter_fill_height.animate.set_value(0.55), run_time=1.0)
        self.wait(0.4)

        # ---- Final relation ---------------------------------------------
        relation = Tex(
            r"\Delta U \;=\; W \;+\; Q",
            color=SUCCESS,
        ).scale(0.95)
        relation.to_corner(UR, buff=0.7).shift(DOWN * 0.2)
        self.play(Write(relation))
        self.wait(2.0)
        self.wait(0.5)
