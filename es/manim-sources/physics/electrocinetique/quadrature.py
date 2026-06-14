"""Quadrature intuition for Exercice 4 — Électrocinétique.

Visualizes why adding a capacitor in series with an RL branch rotates the
current phasor 90 degrees in the complex plane, achieving "mise en quadrature"
of two currents in identical RL bobinages.

Render:
    cd learning-website
    ../JAVICOSAS/manim/.venv/bin/manimgl manim-sources/physics/electrocinetique/quadrature.py QuadratureIntro -w

Output: media/clips/QuadratureIntro.mp4
"""
from manimlib import *

# Site palette — keep clips visually consistent with the Learning theme.
BG       = "#0e1116"
FG       = "#e8e6e3"
FG_MUTED = "#9aa0a6"
ACCENT   = "#58a6ff"
WARM     = "#f5b942"
SUCCESS  = "#6ee7b7"


class QuadratureIntro(Scene):
    def construct(self):
        # --- Title ---------------------------------------------------------
        title = Text("Mise en quadrature", font="Inter", weight="MEDIUM").scale(0.9)
        sub = Text(
            "pourquoi un condensateur en série fait tourner le courant de 90°",
            font="Inter",
        ).scale(0.45).set_color(FG_MUTED)
        title_group = VGroup(title, sub).arrange(DOWN, buff=0.25).to_edge(UP, buff=0.5)
        self.play(Write(title), FadeIn(sub, shift=0.2 * UP))
        self.wait(0.5)

        # --- Complex plane -------------------------------------------------
        plane = ComplexPlane(
            x_range=(-3.5, 3.5, 1),
            y_range=(-2.5, 2.5, 1),
            background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.4},
        ).scale(0.85).shift(0.4 * DOWN)
        plane.add_coordinate_labels(font_size=18)

        re_label = Tex(r"\Re").scale(0.7).set_color(FG_MUTED)
        im_label = Tex(r"\Im").scale(0.7).set_color(FG_MUTED)
        re_label.next_to(plane.x_axis.get_end(), RIGHT, buff=0.15)
        im_label.next_to(plane.y_axis.get_end(), UP, buff=0.15)

        self.play(ShowCreation(plane), FadeIn(re_label), FadeIn(im_label))

        # --- Reference current I_1 (RL branch alone) -----------------------
        origin = plane.n2p(0)
        i1_tip = plane.n2p(2.2 + 0j)
        i1 = Arrow(origin, i1_tip, buff=0, color=ACCENT, thickness=4)
        i1_label = Tex(r"\underline{I}_1", color=ACCENT).scale(0.9)
        i1_label.next_to(i1.get_end(), DOWN, buff=0.15)

        caption_1 = Text("Branche 1 : R, L seuls.", font="Inter").scale(0.45).set_color(FG_MUTED)
        caption_1.to_edge(DOWN, buff=0.8)

        self.play(GrowArrow(i1), Write(i1_label), FadeIn(caption_1))
        self.wait(0.8)

        # --- Second current I_2 starts equal, then rotates ----------------
        i2 = Arrow(origin, i1_tip, buff=0, color=WARM, thickness=4)
        i2_label = Tex(r"\underline{I}_2", color=WARM).scale(0.9)
        i2_label.next_to(i2.get_end(), UP, buff=0.15)

        caption_2 = Text(
            "Branche 2 : R, L + condensateur C en série.",
            font="Inter",
        ).scale(0.45).set_color(FG_MUTED)
        caption_2.to_edge(DOWN, buff=0.8)

        self.play(
            GrowArrow(i2),
            Write(i2_label),
            FadeTransform(caption_1, caption_2),
        )
        self.wait(0.5)

        # --- The capacitor "tunes" Z_2 -> rotation by +90 degrees ---------
        # Hint formula in the corner
        impedance_box = VGroup(
            Tex(r"\underline{Z}_1 = R + jL\omega", color=ACCENT),
            Tex(r"\underline{Z}_2 = R + jL\omega - \frac{j}{C\omega}", color=WARM),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.25).scale(0.6)
        impedance_box.to_corner(UR, buff=0.7).shift(0.4 * DOWN)
        self.play(FadeIn(impedance_box, shift=0.3 * LEFT))
        self.wait(0.4)

        # Track the I_2 label to the arrow tip so the rotation reads cleanly.
        i2_label.add_updater(lambda m: m.next_to(i2.get_end(), normalize(i2.get_vector()) + 0.6 * UP, buff=0.15))

        # Rotate I_2 by +90 degrees about the origin — this is what tuning C
        # to the right value does: I_2 ends up perpendicular to I_1, in advance.
        self.play(
            Rotate(i2, angle=PI / 2, about_point=origin),
            run_time=2.5,
            rate_func=smooth,
        )
        i2_label.clear_updaters()
        self.wait(0.5)

        # Right-angle marker between the two phasors.
        right_angle = Square(side_length=0.25, color=SUCCESS, stroke_width=2)
        right_angle.move_to(origin + 0.18 * RIGHT + 0.18 * UP)
        self.play(ShowCreation(right_angle))

        # --- Final relation ------------------------------------------------
        relation = Tex(
            r"\frac{\underline{I}_1}{\underline{I}_2} = -j\,k,\qquad k > 0",
            color=SUCCESS,
        ).scale(0.9)
        relation.next_to(caption_2, UP, buff=0.4)

        caption_3 = Text(
            "I_2 est en avance de 90° sur I_1 — quadrature obtenue.",
            font="Inter",
        ).scale(0.45).set_color(SUCCESS)
        caption_3.to_edge(DOWN, buff=0.8)

        self.play(Write(relation), FadeTransform(caption_2, caption_3))
        self.wait(2.0)

        # Hold the final frame for a beat.
        self.wait(0.5)
