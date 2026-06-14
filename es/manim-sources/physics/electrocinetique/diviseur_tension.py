"""Voltage divider intuition for Exercice 4 (4b) — Électrocinétique.

Visualizes the formula U_Z2 = U * Z2 / (Z1 + Z2) by showing how the
output voltage shrinks proportionally to |Z2| / (|Z1| + |Z2|) as a
phasor in the complex plane.
"""
from manimlib import *

BG       = "#0e1116"
FG       = "#e8e6e3"
FG_MUTED = "#9aa0a6"
ACCENT   = "#58a6ff"
WARM     = "#f5b942"
SUCCESS  = "#6ee7b7"


class DiviseurTensionIntro(Scene):
    def construct(self):
        # ---- Title -------------------------------------------------------
        title = Text("Diviseur de tension", font="Inter", weight="MEDIUM").scale(0.9)
        sub = Text(
            "la tension se partage proportionnellement à |Z|",
            font="Inter",
        ).scale(0.45).set_color(FG_MUTED)
        title_group = VGroup(title, sub).arrange(DOWN, buff=0.25).to_edge(UP, buff=0.5)
        self.play(Write(title), FadeIn(sub, shift=0.2 * UP))
        self.wait(0.4)

        # ---- Schematic on the left ---------------------------------------
        # Draw two boxes labelled Z_1 and Z_2 connected in series
        box_z1 = Square(side_length=0.7, color=ACCENT).set_fill(ACCENT, opacity=0.15)
        box_z1.shift(LEFT * 4 + DOWN * 0.5)
        z1_label = Tex(r"\underline{Z}_1", color=ACCENT).scale(0.7).move_to(box_z1)

        box_z2 = Square(side_length=0.7, color=WARM).set_fill(WARM, opacity=0.15)
        box_z2.next_to(box_z1, RIGHT, buff=0.1)
        z2_label = Tex(r"\underline{Z}_2", color=WARM).scale(0.7).move_to(box_z2)

        # Source U on the far left, output U_Z2 across Z_2
        wire_top = Line(box_z1.get_corner(UL) + LEFT * 1.5, box_z1.get_corner(UL))
        wire_top_2 = Line(box_z2.get_corner(UR), box_z2.get_corner(UR) + RIGHT * 1.2)
        wire_bot = Line(
            box_z1.get_corner(DL) + LEFT * 1.5,
            box_z2.get_corner(DR) + RIGHT * 1.2,
        )
        wire_bot.set_color(FG_MUTED)
        wire_top.set_color(FG_MUTED)
        wire_top_2.set_color(FG_MUTED)

        u_label = Tex(r"\underline{U}", color=ACCENT).scale(0.7)
        u_label.next_to(wire_top.get_start(), UP, buff=0.15)
        uout_label = Tex(r"\underline{U}_{Z_2}", color=WARM).scale(0.7)
        uout_label.next_to(box_z2, UP, buff=0.4)

        schematic = VGroup(
            wire_top, wire_bot, wire_top_2,
            box_z1, z1_label, box_z2, z2_label, u_label, uout_label,
        )

        self.play(ShowCreation(schematic), run_time=1.6)
        self.wait(0.4)

        # ---- Phasor diagram on the right ---------------------------------
        axes_origin = RIGHT * 2.5 + DOWN * 0.5
        # Reference U phasor (full length)
        u_arrow = Arrow(
            axes_origin, axes_origin + RIGHT * 3, buff=0, color=ACCENT, thickness=4,
        )
        u_arrow_label = Tex(r"\underline{U}", color=ACCENT).scale(0.75)
        u_arrow_label.next_to(u_arrow.get_end(), DOWN, buff=0.15)

        baseline = DashedLine(
            axes_origin, axes_origin + RIGHT * 3.2, dash_length=0.08,
        ).set_color(FG_MUTED)

        self.play(GrowArrow(u_arrow), Write(u_arrow_label), ShowCreation(baseline))
        self.wait(0.4)

        # ---- Output phasor shrinks proportionally ------------------------
        # Show U_Z2 starting equal to U, then shrinking to |Z2|/(|Z1|+|Z2|) of U
        uout_arrow = Arrow(
            axes_origin, axes_origin + RIGHT * 3, buff=0, color=WARM, thickness=4,
        )
        uout_arrow_label = Tex(r"\underline{U}_{Z_2}", color=WARM).scale(0.75)
        uout_arrow_label.next_to(uout_arrow.get_end(), UP, buff=0.18)

        # Track the label to the moving arrow tip
        uout_arrow_label.add_updater(
            lambda m: m.next_to(uout_arrow.get_end(), UP, buff=0.18)
        )

        # Place uout_arrow slightly above u_arrow so they don't overlap
        uout_arrow.shift(UP * 0.4)
        baseline_out = baseline.copy().shift(UP * 0.4)

        self.play(GrowArrow(uout_arrow), Write(uout_arrow_label))
        self.wait(0.3)

        # Formula appears in the upper right corner
        formula = Tex(
            r"\underline{U}_{Z_2} = \underline{U}\,\dfrac{\underline{Z}_2}{\underline{Z}_1 + \underline{Z}_2}",
            color=FG,
        ).scale(0.7).to_corner(UR, buff=0.7).shift(DOWN * 0.4)
        formula[0][0:5].set_color(WARM)            # left side
        self.play(Write(formula))
        self.wait(0.4)

        # Animate the shrink: U_Z2 = U * ratio, where ratio = |Z2| / (|Z1|+|Z2|).
        # Pick a ratio like 0.55 to give a visible difference.
        ratio = 0.55
        new_tip = axes_origin + RIGHT * 3 * ratio + UP * 0.4
        new_arrow = Arrow(
            axes_origin + UP * 0.4, new_tip, buff=0, color=WARM, thickness=4,
        )
        self.play(Transform(uout_arrow, new_arrow), run_time=2.0)
        self.wait(0.4)

        # Ratio annotation
        ratio_label = Tex(
            r"\left|\underline{U}_{Z_2}\right| = \dfrac{|\underline{Z}_2|}{|\underline{Z}_1|+|\underline{Z}_2|}\,|\underline{U}|",
            color=SUCCESS,
        ).scale(0.65)
        ratio_label.next_to(formula, DOWN, buff=0.4, aligned_edge=RIGHT)
        self.play(Write(ratio_label))
        self.wait(2.0)
        self.wait(0.6)
