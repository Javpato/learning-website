# L2 Chimie Paris-Saclay — Mathematics and Physics Reconstruction

**Research-based course, TD, and exam blueprint**  
**Prepared:** 23 July 2026  
**Language:** English explanations with the official French UE names and standard French exam terminology

> **Important reliability statement**
>
> This is not a leaked or copied eCampus course. The current detailed lecture notes, TD sheets, and exact exams for the 2026–2027 L2 Chimie cohort are not publicly accessible. This document reconstructs the most probable complete teaching sequence from:
>
> 1. the current official Université Paris-Saclay L2 Chimie syllabus;
> 2. historical material from the exact Paris-Saclay L2 Chimie mathematics course;
> 3. public Paris-Saclay mathematics and electromagnetism courses, TDs, corrections, and exams;
> 4. neighboring Paris-Saclay L2 Physics / Interface Physique-Chimie syllabi;
> 5. standard first-cycle university references.
>
> Every module is marked:
>
> - **[OFFICIAL]** explicitly named in the current L2 Chimie syllabus;
> - **[HISTORICAL-EXACT]** found in an older course taught specifically to Paris-Saclay L2 Chimie;
> - **[HIGH-CONFIDENCE]** required to connect the official topics coherently and supported by closely related Paris-Saclay material;
> - **[PROBABLE]** a plausible L2 Chimie treatment, but the exact current order or depth is not public;
> - **[EXTENSION]** harder material useful for preparation, not claimed as compulsory.

---

## 0. What the complete L2 Chimie year contains

The official programme describes L2 Chimie as a chemistry-centred year supported by mathematics, physics, language, experimental work, and ecological-transition teaching. Mathematics and physics are explicitly used as tools for modelling and solving chemistry problems.

### Semester 3 / first semester: principal units

- Réactivité en chimie organique I
- Orbitales atomiques et moléculaires
- Introduction aux techniques de séparation et d’analyse moléculaire
- Structure et propriétés des solides cristallins
- Thermochimie : spontanéité et équilibres
- **Fonctions de plusieurs variables**
- **Électromagnétisme et interactions : statique**
- Enjeux de la transition écologique

### Semester 4 / second semester: principal units

- Cinétique et catalyse
- Réactivité en chimie organique II
- Physicochimie des solutions aqueuses et analyse
- Chimie inorganique : complexes de métaux de transition
- **Électromagnétisme et interactions : dynamique**
- Comment consolider son apprentissage de la chimie par l’IA ?
- one disciplinary-colour option, English, and a pathway-dependent free unit or stage

### Exact official mathematics and physics volume

| UE | Semester | ECTS | Lecture | TD |
|---|---:|---:|---:|---:|
| Fonctions de plusieurs variables | S3 | 5 | 18 h | 27 h |
| Électromagnétisme et interactions : statique | S3 | 2.5 | 10.5 h | 12 h |
| Électromagnétisme et interactions : dynamique | S4 | 2.5 | 10.5 h | 12 h |

The mathematics UE officially uses weekly lectures and TDs, with continuous assessment, a **partiel**, and a final examination. The physics UEs use lectures and TDs, with active board work and continuous assessment.

---

## How to use this reconstruction

A strong student should not read this linearly once. For every lesson:

1. attempt the diagnostic questions without notes;
2. study the compact theory;
3. reproduce the main derivation from memory;
4. complete the “core” exercise;
5. complete one “transfer to chemistry” problem;
6. return 48 hours later for a mixed retrieval problem;
7. complete the hard TD only after the basic mechanisms are automatic.

A realistic rhythm is:

- **Mathematics:** two 90-minute blocks plus one 2-hour TD block each week;
- **Physics:** one 90-minute theory block plus one 2-hour problem block each week;
- **Cumulative review:** 30–45 minutes every weekend.

---

# Part I — All Mathematics Courses

## Official UE: *Fonctions de plusieurs variables*

### Official programme

1. Geometry of the plane and space: equations of lines and planes; Cartesian, polar, cylindrical, and spherical coordinates.
2. Representation of multivariable functions: surfaces, level curves, and partial functions.
3. Continuity and differentiability: partial derivatives, gradient, and uncertainty calculations.
4. Critical points and extrema of functions of two variables.
5. Connection with differential systems: trajectories, phase portraits, conservative systems, and Hamiltonian systems.
6. Linear differential systems: similarity classes, eigenvalues, and application to the harmonic oscillator.

### Prerequisites

- elementary functions and one-variable graph analysis;
- Cartesian coordinates;
- first-order ordinary differential equations;
- algebraic manipulation, trigonometry, exponentials, and logarithms.

---

## Mathematics Course 0 — Diagnostic bridge

**Status:** [HIGH-CONFIDENCE prerequisite bridge]

### Required automatic skills

You should be able to:

- solve `ax+b=0` and a `2×2` linear system;
- differentiate exponentials, logarithms, trigonometric functions, and compositions;
- integrate simple powers, exponentials, and trigonometric functions;
- solve `y'=ay`, `y'+ay=b`, and separable ODEs;
- manipulate vectors, dot products, norms, and `2×2` determinants;
- factor a quadratic and interpret its discriminant.

### Minimal diagnostic

Without notes, solve:

1. \(y'+3y=6,\ y(0)=5\).
2. Find the eigenvalues of \(\begin{pmatrix}2&1\\1&2\end{pmatrix}\).
3. Compute the tangent line to \(f(x)=\ln(1+x^2)\) at \(x=1\).
4. Convert \((x,y)=(-\sqrt3,1)\) to polar coordinates.
5. Classify \(x^2-4xy+5y^2\) as a quadratic form.

**Answers:**  
1. \(y=2+3e^{-3t}\).  
2. \(1,3\).  
3. \(y=\ln2+(x-1)\).  
4. \(r=2,\theta=5\pi/6\) modulo \(2\pi\).  
5. Positive definite because the first leading minor is positive and the determinant is \(1\).

---

## Mathematics Course 1 — Geometry of the plane and space

**Status:** [OFFICIAL]

### 1.1 Vectors, lines, and planes

For \(A,B\in\mathbb R^3\),
\[
\overrightarrow{AB}=B-A.
\]

A parametric line is
\[
\ell:\quad \mathbf r(t)=\mathbf r_0+t\mathbf u.
\]

A plane with normal vector \(\mathbf n=(a,b,c)\) through \(P_0=(x_0,y_0,z_0)\) is
\[
\mathbf n\cdot(\mathbf r-\mathbf r_0)=0,
\]
or
\[
a(x-x_0)+b(y-y_0)+c(z-z_0)=0.
\]

The distance from \(P=(x_0,y_0,z_0)\) to \(ax+by+cz+d=0\) is
\[
d(P,\Pi)=\frac{|ax_0+by_0+cz_0+d|}{\sqrt{a^2+b^2+c^2}}.
\]

### 1.2 Cartesian, polar, cylindrical, spherical coordinates

#### Polar coordinates
\[
x=r\cos\theta,\qquad y=r\sin\theta,\qquad r\ge0.
\]
\[
\mathbf e_r=(\cos\theta,\sin\theta),\qquad
\mathbf e_\theta=(-\sin\theta,\cos\theta).
\]

#### Cylindrical coordinates
\[
x=r\cos\theta,\quad y=r\sin\theta,\quad z=z.
\]

- \(r=R\): circular cylinder;
- \(z=z_0\): horizontal plane;
- \(\theta=\theta_0\): vertical half-plane.

#### Spherical coordinates — physics convention
\[
x=r\sin\theta\cos\varphi,\quad
y=r\sin\theta\sin\varphi,\quad
z=r\cos\theta.
\]

- \(r=R\): sphere;
- \(\theta=\theta_0\): cone;
- \(\varphi=\varphi_0\): half-plane through the `z`-axis.

### 1.3 Differential elements

These geometric factors are indispensable in electromagnetism:
\[
d\ell_r=dr,\quad d\ell_\theta=r\,d\theta,\quad d\ell_\varphi=r\sin\theta\,d\varphi.
\]
\[
dS_{\text{polar}}=r\,dr\,d\theta,
\]
\[
dV_{\text{cyl}}=r\,dr\,d\theta\,dz,
\]
\[
dV_{\text{sph}}=r^2\sin\theta\,dr\,d\theta\,d\varphi.
\]

### 1.4 Chemistry connection

Coordinate choice encodes symmetry:

- atom or ion: spherical;
- long charged polymer or ideal wire: cylindrical;
- membrane or interface: planar;
- molecular dipole: spherical far-field description;
- reaction surface \(E(x,y)\): Cartesian or transformed normal-mode coordinates.

### Common errors

- using \(\arctan(y/x)\) without correcting the quadrant;
- treating \(\mathbf e_r,\mathbf e_\theta\) as constant vectors;
- forgetting the `r` or \(r^2\sin\theta\) geometric factor;
- confusing a direction vector with a normal vector.

### Dynamic lesson design

1. Begin with 3D molecular geometry images.
2. Ask the student to choose a coordinate system before calculating.
3. Reveal the same object in all three coordinate systems.
4. Make the student explain which variables remain constant on each surface.
5. End with one electrostatic geometry whose solution becomes easy only after the right coordinate choice.

**Connected resources:** MIT OCW 18.02SC coordinate-system lessons; Paris-Saclay public L1 electromagnetism “C1 — outils mathématiques”; OpenStax vector review.

---

## Mathematics Course 2 — Multivariable functions, surfaces, and level sets

**Status:** [OFFICIAL]

A scalar field is a function
\[
f:D\subset\mathbb R^n\to\mathbb R.
\]
For \(f(x,y)\), its graph is \(z=f(x,y)\). A level curve of value \(c\) is
\[
L_c=\{(x,y):f(x,y)=c\}.
\]
A partial function freezes all but one variable.

### Useful prototypes

- plane: \(f(x,y)=ax+by+c\);
- elliptic paraboloid: \(x^2/a^2+y^2/b^2\);
- hyperbolic paraboloid: \(x^2/a^2-y^2/b^2\);
- Gaussian hill: \(Ae^{-Q(x,y)}\);
- radial potential: \(f(x,y)=g(\sqrt{x^2+y^2})\);
- reaction-energy surface: local minima, saddle points, and valleys.

### Level-set method

1. determine the domain;
2. exploit symmetry;
3. solve \(f(x,y)=c\);
4. identify how geometry changes with \(c\);
5. inspect partial functions;
6. locate singular or non-smooth points.

Example: \(f=x^2+4y^2\). Its positive level curves are ellipses.

### Chemistry connection: potential-energy surfaces

For molecular coordinates \(q_1,q_2\), minima of \(V(q_1,q_2)\) model stable structures, saddles model transition-state directions, steep directions correspond to stiff modes, and shallow directions to soft modes.

### Dynamic lesson design

Use an interactive surface with sliders in
\[
f(x,y)=ax^2+bxy+cy^2.
\]
The student predicts the contour topology before seeing the surface, then reconstructs the surface from contours alone.

---

## Mathematics Course 3 — Limits and continuity in several variables

**Status:** [OFFICIAL, with limit machinery required by continuity]

\[
\lim_{(x,y)\to(a,b)}f(x,y)=L
\]
means that every sufficiently close point gives a value close to \(L\), independently of the path.

### Path tests

If two paths yield different limits, the limit does not exist. Useful paths include \(y=mx\), \(y=x^p\), polar substitution, or an engineered path matching a denominator.

Obtaining the same result along many paths does **not** prove existence.

### Bounding and polar estimates

At the origin, try to prove
\[
|f(x,y)|\le Cr^\alpha,\qquad r=\sqrt{x^2+y^2},\quad \alpha>0.
\]

Example:
\[
f(x,y)=\frac{x^2y}{x^2+y^2}.
\]
Since \(|x|,|y|\le r\), \(|f|\le r\), so the limit is zero.

### Chemistry connection

Continuity is the local mathematical expression of robustness: small changes in temperature, concentration, or geometry produce small changes in a model output. Singularities can indicate an idealization, a forbidden domain, or a failed model.

### Dynamic lesson design

Give visually similar functions near the origin. The learner must choose between a destructive path, a polar bound, or a continuity theorem. Feedback should name the proof strategy, not merely the answer.

---

## Mathematics Course 4 — Partial derivatives, differential, tangent plane, and gradient

**Status:** [OFFICIAL]

### Partial derivatives and differentiability

\[
\frac{\partial f}{\partial x}(a,b)
=\lim_{h\to0}\frac{f(a+h,b)-f(a,b)}{h}.
\]

Differentiability means
\[
f(\mathbf a+\mathbf h)
=f(\mathbf a)+L(\mathbf h)+o(\|\mathbf h\|),
\]
where \(L\) is linear. For two variables,
\[
df=f_x\,dx+f_y\,dy.
\]
Continuous partial derivatives near a point are a standard sufficient condition for differentiability there.

### Tangent plane

\[
z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b).
\]

### Gradient and directional derivative

\[
\nabla f=(f_x,f_y),\qquad
D_{\mathbf u}f=\nabla f\cdot\mathbf u
\]
for a unit vector \(\mathbf u\).

The gradient is normal to a regular level set and points in the direction of maximum increase.

### Chain rule

If \(x=x(t),y=y(t)\), then
\[
\frac{d}{dt}f(x(t),y(t))
=\nabla f\cdot\mathbf r'(t).
\]
For vector maps, \(D(f\circ g)=Df(g)Dg\).

### Chemistry connection

For a state function \(G(T,P)\),
\[
dG=G_T\,dT+G_P\,dP.
\]
This is the same local-linear structure as any differentiable scalar field.

### Common errors

- using a non-unit vector for a directional derivative;
- assuming partial derivatives imply differentiability;
- forgetting the evaluation point in the tangent plane;
- confusing a gradient vector with a scalar slope.

### Dynamic lesson design

On a contour map, ask the student to draw the tangent, gradient, steepest descent, and a zero-directional-derivative direction before revealing numbers.

---

## Mathematics Course 5 — Uncertainty propagation

**Status:** [OFFICIAL application of the gradient]

For \(z=f(x_1,\ldots,x_n)\), a conservative first-order bound is
\[
|\Delta z|\lesssim\sum_i\left|\frac{\partial f}{\partial x_i}\right|\Delta x_i.
\]

For independent standard uncertainties,
\[
\sigma_z^2\approx\sum_i
\left(\frac{\partial f}{\partial x_i}\right)^2\sigma_i^2.
\]
With covariance matrix \(\Sigma\),
\[
\sigma_z^2\approx\nabla f^\top\Sigma\nabla f.
\]

For \(z=Cx^ay^b\),
\[
\frac{dz}{z}=a\frac{dx}{x}+b\frac{dy}{y}.
\]

### Chemistry examples

Density:
\[
\rho=\frac mV,
\qquad
\left(\frac{\sigma_\rho}{\rho}\right)^2
\approx
\left(\frac{\sigma_m}{m}\right)^2+
\left(\frac{\sigma_V}{V}\right)^2.
\]

Beer–Lambert concentration:
\[
c=\frac A{\varepsilon\ell}.
\]
Independent relative uncertainties add in quadrature.

### Dynamic lesson design

Use a virtual laboratory dataset. Require symbolic propagation, numerical evaluation, ranking of dominant uncertainty sources, an improved experimental design, and comparison with Monte Carlo propagation.

---

## Mathematics Course 6 — Critical points and extrema in two variables

**Status:** [OFFICIAL]

An interior differentiable extremum satisfies \(\nabla f=0\). The Hessian is
\[
H_f=
\begin{pmatrix}
f_{xx}&f_{xy}\\
f_{yx}&f_{yy}
\end{pmatrix}.
\]
At a critical point let \(D=f_{xx}f_{yy}-f_{xy}^2\).

- \(D>0,f_{xx}>0\): local minimum;
- \(D>0,f_{xx}<0\): local maximum;
- \(D<0\): saddle;
- \(D=0\): inconclusive.

For global extrema on a compact domain, inspect interior critical points, boundary curves, and corners.

### Constrained extrema

**Status:** [EXTENSION]

For \(g(x,y)=c\), regular constrained extrema satisfy
\[
\nabla f=\lambda\nabla g.
\]

### Chemistry connection

Near an equilibrium \(\mathbf q_0\),
\[
V(\mathbf q_0+\mathbf h)
\approx V(\mathbf q_0)+\frac12\mathbf h^\top H_V(\mathbf q_0)\mathbf h.
\]
Positive Hessian eigenvalues model stable quadratic directions; a first-order saddle has one negative eigenvalue.

### Dynamic lesson design

Vary coefficients in a quartic landscape and have the student predict when the number/type of stationary points changes, then verify numerically.

---

## Mathematics Course 7 — Differential systems, trajectories, and phase portraits

**Status:** [OFFICIAL]

\[
\begin{cases}
x'=f(x,y),\\
y'=g(x,y).
\end{cases}
\]
The vector field is \(F=(f,g)\). Equilibria satisfy \(f=g=0\).

### Nullclines

- \(x'=0\): horizontal-component nullcline;
- \(y'=0\): vertical-component nullcline.

Their intersections are equilibria; sign analysis gives flow directions.

### Linearization

Near equilibrium \(X_*\),
\[
u'\approx J_F(X_*)u,
\qquad
J_F=
\begin{pmatrix}f_x&f_y\\g_x&g_y\end{pmatrix}.
\]
If no eigenvalue has zero real part, the linear classification usually determines the nonlinear local behavior.

### Chemistry connection

Reaction networks, competing species, reversible reactions, autocatalysis, and enzyme models naturally produce linear or nonlinear differential systems.

### Dynamic lesson design

The student places nullclines, predicts arrows, locates and classifies equilibria, varies a kinetic parameter, and explains the chemistry of the stability change.

**Connected resources:** MIT OCW 18.03SC phase portraits; historical Paris-Saclay Math 250 differential-systems TD.

---

## Mathematics Course 8 — Conservative and Hamiltonian systems

**Status:** [OFFICIAL]

A first integral \(H\) satisfies
\[
\frac{dH}{dt}=\nabla H\cdot F=0.
\]
Trajectories lie on \(H=C\).

A planar Hamiltonian system is
\[
x'=H_y,\qquad y'=-H_x,
\]
so \(dH/dt=0\).

For position \(q\) and momentum \(p\),
\[
H(q,p)=\frac{p^2}{2m}+V(q),
\quad
q'=\frac pm,
\quad
p'=-V'(q).
\]

A gradient flow \(X'=-\nabla V\) instead satisfies
\[
\frac{dV}{dt}=-\|\nabla V\|^2\le0.
\]
Thus Hamiltonian motion follows level sets, while gradient flow descends them.

### Dynamic lesson design

Compare dissipative \(q'=-V'(q)\) with conservative \(q'=p/m,p'=-V'(q)\) for the same potential. Display time graphs, phase portraits, and energy.

---

## Mathematics Course 9 — Linear differential systems and similarity classes

**Status:** [OFFICIAL] and [HISTORICAL-EXACT]

The exact historical Paris-Saclay L2 Chimie course *Matrices et équations différentielles (Math 250)* used TDs on linear systems, determinants, polynomial roots, eigenvalues/eigenvectors, and differential systems, with corrected midterms and finals.

### Matrix form and diagonalization

\[
X'=AX.
\]
If \(A=PDP^{-1}\), then with \(Y=P^{-1}X\), \(Y'=DY\).

If \(Av=\lambda v\), then \(e^{\lambda t}v\) is a solution. With two independent eigenvectors,
\[
X(t)=c_1e^{\lambda_1t}v_1+c_2e^{\lambda_2t}v_2.
\]

For a Jordan block,
\[
e^{t\begin{psmallmatrix}\lambda&1\\0&\lambda\end{psmallmatrix}}
=e^{\lambda t}
\begin{pmatrix}1&t\\0&1\end{pmatrix}.
\]

### Trace–determinant classification

Let \(\tau=\operatorname{tr}A\), \(\Delta=\det A\), and \(\mathcal D=\tau^2-4\Delta\).

- \(\Delta<0\): saddle;
- \(\Delta>0,\mathcal D>0,\tau<0\): stable node;
- \(\Delta>0,\mathcal D>0,\tau>0\): unstable node;
- \(\Delta>0,\mathcal D<0,\tau<0\): stable spiral;
- \(\Delta>0,\mathcal D<0,\tau>0\): unstable spiral;
- \(\tau=0,\Delta>0,\mathcal D<0\): linear centre;
- repeated eigenvalue: inspect diagonalizability.

For \(X'=AX+b\), find equilibrium \(X_*\) and set \(U=X-X_*\).

### Chemistry connection

For \(A\to B\to C\), the `A,B` subsystem is triangular and its eigenvalues encode kinetic timescales.

### Dynamic lesson design

Use a trace–determinant plane. The student drags \((\tau,\Delta)\), predicts the portrait, then receives a matrix with those invariants to solve.

---

## Mathematics Course 10 — Harmonic oscillator and normal modes

**Status:** [OFFICIAL]

\[
mx''+\gamma x'+kx=0.
\]
Set \(v=x'\):
\[
\begin{pmatrix}x\\v\end{pmatrix}'
=
\begin{pmatrix}0&1\\-k/m&-\gamma/m\end{pmatrix}
\begin{pmatrix}x\\v\end{pmatrix}.
\]
Characteristic equation:
\[
m\lambda^2+\gamma\lambda+k=0.
\]

Let \(\omega_0=\sqrt{k/m}\) and \(\zeta=\gamma/(2\sqrt{mk})\).

- \(\zeta<1\): underdamped;
- \(\zeta=1\): critically damped;
- \(\zeta>1\): overdamped;
- \(\gamma=0\): conservative oscillator.

For \(\gamma=0\),
\[
x=A\cos(\omega_0t)+B\sin(\omega_0t).
\]

### Forced oscillator — extension

\[
mx''+\gamma x'+kx=F_0\cos\omega t,
\]
with steady-state amplitude
\[
A(\omega)=\frac{F_0}{\sqrt{(k-m\omega^2)^2+\gamma^2\omega^2}}.
\]

### Coupled oscillators — extension

For \(M q''+Kq=0\), normal modes satisfy
\[
(K-\omega^2M)v=0.
\]

### Dynamic lesson design

Provide sliders for \(m,k,\gamma\), simultaneous \(x(t),v(t)\), phase portrait and energy, a prediction step, and an inverse problem asking the learner to infer parameters from a trace.

---

## Mathematics resource map by official lesson

| Official topic | Best exact/near-exact source to search | Use |
|---|---|---|
| Geometry and coordinate systems | MIT OCW 18.02SC; Paris-Saclay public EM C1 | visual explanation and exercises |
| Surfaces and level curves | MIT OCW 18.02SC; Paris-Saclay WIMS | interactive contours |
| Partial derivatives and gradient | MIT OCW 18.02SC | lectures, recitations, problems, exams |
| Uncertainty propagation | chemistry laboratory manuals; OpenStax measurement material | applied practice |
| Critical points and Hessian | MIT OCW 18.02SC | worked examples and exams |
| Phase portraits | MIT OCW 18.03SC Unit IV | notes, videos, Mathlets, problems |
| Conservative/Hamiltonian systems | MIT OCW 18.03SC; mechanics notes | phase-plane interpretation |
| Eigenvalues and differential systems | historical Paris-Saclay Math 250 L2 Chimie | closest exact precedent |
| Harmonic oscillator | MIT OCW 18.03SC | derivations and problems |

---

## Guide: how to create a dynamic mathematics course

### Student-state variables

- mastery score for each prerequisite;
- most recent error type;
- time since last successful retrieval;
- speed versus accuracy;
- confidence calibration;
- preferred representation: algebraic, graphical, verbal, or numerical.

### Six-stage lesson engine

1. **Retrieval (5 min):** three prerequisite questions.
2. **Prediction (5 min):** a graph or outcome before calculation.
3. **Construction (15 min):** derive one formula from definitions.
4. **Guided practice (20 min):** worked example with fading hints.
5. **Transfer (20 min):** chemistry-context problem.
6. **Challenge and reflection (15 min):** non-routine task plus error log.

### Difficulty controls

Increase difficulty by changing one dimension at a time: algebraic complexity, variables, coordinate system, implicit representation, proof demand, incomplete data, method choice, topic coupling, numerical conditioning, or chemistry interpretation.

### Generator quality checks

Before an exercise is shown:

- domain is nonempty;
- critical points can be classified;
- matrix parameters avoid accidental ambiguity unless intended;
- units are coherent;
- requested precision is feasible;
- the final answer is independently verified;
- hints do not reveal the method too early.


# Part II — Mathematics Exercises and Reconstructed Exams

> These are **not claimed to be the current Paris-Saclay sheets**. They match the official syllabus, the historical exact L2 Chimie course, and public Paris-Saclay/MIT material. Difficulty is deliberately high.

Difficulty key: ★ core, ★★ standard L2, ★★★ hard, ★★★★ very hard.

---

## TD 1 — Geometry and coordinate systems

### Exercise M1.1 — Intersecting planes ★★

Let
\[
\Pi_1:x+2y-z=3,\qquad \Pi_2:2x-y+z=1.
\]

1. Find a direction vector of their intersection.
2. Give a parametric equation.
3. Find the point on the line nearest the origin.

**Solution sketch**

Normals are \(n_1=(1,2,-1)\), \(n_2=(2,-1,1)\). A direction is
\[
u=n_1\times n_2=(1,-3,-5).
\]
Setting \(z=0\) gives the point \((1,1,0)\), hence
\[
r(t)=(1,1,0)+t(1,-3,-5).
\]
Minimizing \(\|r(t)\|^2\) gives \(t=2/35\).

### Exercise M1.2 — Coordinate-choice proof ★★

Describe
\[
x^2+y^2=z^2,\qquad z\ge0
\]
in Cartesian, cylindrical, and spherical coordinates.

**Answer:** Cylindrical: \(z=r\). Spherical: \(\theta=\pi/4\). It is the upper cone of half-angle \(\pi/4\).

### Exercise M1.3 — Distance between skew lines ★★★

\[
\ell_1:r=(1,0,1)+s(1,2,-1),
\quad
\ell_2:r=(0,1,2)+t(2,-1,1).
\]

Prove they are skew and find their shortest distance.

**Solution:** With \(u=(1,2,-1),v=(2,-1,1),w=(-1,1,1)\),
\[
u\times v=(1,-3,-5),
\quad
w\cdot(u\times v)=-9.
\]
Therefore
\[
d=\frac9{\sqrt{35}}.
\]
Closest points follow from orthogonality to both direction vectors.

### Exercise M1.4 — Spherical Jacobian ★★★

Derive \(dV=r^2\sin\theta\,dr\,d\theta\,d\varphi\) using local scale factors.

**Solution:** The three local lengths are \(dr\), \(r\,d\theta\), and \(r\sin\theta\,d\varphi\); multiply them.

### Exercise M1.5 — Molecular geometry ★★★

Atoms occupy
\[
A=(a,0,0),\quad B=(-a/2,\sqrt3a/2,0),\quad C=(-a/2,-\sqrt3a/2,0).
\]
Show the triangle is equilateral. A fourth atom lies at equal distance \(L\) from all three on the positive-normal side. Find its coordinates.

**Answer:** The centroid is the origin and the plane is \(z=0\). The fourth atom is
\[
D=(0,0,\sqrt{L^2-a^2}),\qquad L\ge a.
\]

---

## TD 2 — Surfaces, level curves, and limits

### Exercise M2.1 — Reconstruct a surface ★★

For \(f=x^2/4-y^2\), draw representative partial functions and level curves \(f=-1,0,1\). Identify the surface.

**Answer:** Hyperbolic paraboloid; level zero is \(y=\pm x/2\).

### Exercise M2.2 — Path failure ★★

Study
\[
f(x,y)=\frac{x^2y}{x^4+y^2}
\]
at the origin.

**Solution:** Along \(y=mx^2\),
\[
f=\frac{m}{1+m^2},
\]
which depends on \(m\); no limit.

### Exercise M2.3 — A limit requiring a bound ★★★

Prove
\[
\lim_{(x,y)\to0}\frac{x^3y^2}{x^4+y^4}=0.
\]

**Solution:** Since \(2x^2y^2\le x^4+y^4\),
\[
\left|\frac{x^3y^2}{x^4+y^4}\right|
\le\frac{|x|}{2}\to0.
\]

### Exercise M2.4 — Continuous but not differentiable ★★★

Define
\[
f(x,y)=\begin{cases}
\dfrac{x^2y}{x^2+y^2},&(x,y)\ne0,\\
0,&(x,y)=0.
\end{cases}
\]
Prove continuity, compute partial derivatives at zero, and decide differentiability.

**Solution:** \(|f|\le|y|\), so it is continuous. Both partial derivatives are zero. Along \(y=x\), \(|f|/\sqrt{x^2+y^2}\to1/(2\sqrt2)\), so it is not differentiable.

### Exercise M2.5 — Gaussian landscape ★★★

\[
V(x,y)=3e^{-(x^2+2y^2)}-2e^{-((x-2)^2+2y^2)}.
\]
Without fully solving the critical equations, describe symmetry, asymptotic behavior, hill/well locations, and how a saddle appears in contour topology.

**Expected reasoning:** \(V\to0\), symmetry under \(y\mapsto-y\), positive hill near \((0,0)\), negative well near \((2,0)\), and a transition region where contour topology changes.

---

## TD 3 — Differential, gradient, and uncertainty

### Exercise M3.1 — Tangent plane ★★

For \(f(x,y)=\ln(x^2+y^2)\), find the tangent plane at \((1,1)\) and estimate \(f(1.02,0.97)\).

**Answer:** \(\nabla f(1,1)=(1,1)\), so
\[
f\approx\ln2+(x-1)+(y-1),
\]
and the estimate is \(\ln2-0.01\).

### Exercise M3.2 — Gradient and level surface ★★

Let \(F=x^2+2y^2+3z^2\). At \(P=(1,1,1)\), find the tangent plane to \(F=6\), fastest-increase direction, and derivative toward \(Q=(2,0,1)\).

**Answer:** \(\nabla F(P)=(2,4,6)\). Tangent plane:
\[
2(x-1)+4(y-1)+6(z-1)=0.
\]
Fastest unit direction is \((1,2,3)/\sqrt{14}\). The requested directional derivative is \(-\sqrt2\).

### Exercise M3.3 — Composition and Jacobian ★★★

Let \(u=x^2-y^2\), \(v=2xy\), \(f(u,v)=e^u\cos v\). Compute \(\nabla_{x,y}(f\circ g)\) and evaluate at \((1,0)\).

**Answer:**
\[
f_x=2xe^u\cos v-2ye^u\sin v,
\]
\[
f_y=-2ye^u\cos v-2xe^u\sin v.
\]
At \((1,0)\): \((2e,0)\).

### Exercise M3.4 — Density uncertainty ★★

A cylinder has
\[
m=12.500\pm0.005\text{ g},\quad
R=0.800\pm0.003\text{ cm},\quad
h=2.000\pm0.005\text{ cm}.
\]
Find \(\rho=m/(\pi R^2h)\) and independent uncertainty.

**Answer:** \(\rho\approx3.108\text{ g cm}^{-3}\). Relative variance:
\[
\left(\frac{\sigma_\rho}{\rho}\right)^2=
\left(\frac{0.005}{12.5}\right)^2+
4\left(\frac{0.003}{0.8}\right)^2+
\left(\frac{0.005}{2}\right)^2.
\]
Thus \(\sigma_\rho\approx0.0246\text{ g cm}^{-3}\).

### Exercise M3.5 — Correlated calibration ★★★★

For \(c=(A-b)/m\), derive the covariance-aware uncertainty from uncertain \(A,m,b\).

**Solution formula:**
\[
c_A=1/m,\quad c_b=-1/m,\quad c_m=-(A-b)/m^2,
\]
\[
\sigma_c^2=c_A^2\sigma_A^2+c_b^2\sigma_b^2+c_m^2\sigma_m^2
+2c_mc_b\operatorname{Cov}(m,b),
\]
plus any other nonzero covariance terms.

---

## TD 4 — Critical points and extrema

### Exercise M4.1 — Full classification ★★

Classify all critical points of \(f=x^3-3x+y^2\).

**Answer:** Critical points \((1,0),(-1,0)\). The first is a local minimum; the second a saddle.

### Exercise M4.2 — Degenerate points ★★★

Classify the origin for \(x^4+y^4\), \(x^4-y^4\), and \((y-x^2)^2\).

**Answer:** strict global minimum; saddle; non-strict global minimum. All Hessians vanish, so higher-order reasoning is required.

### Exercise M4.3 — Coupled quadratic energy ★★★

For
\[
V=\frac12(ax^2+2bxy+cy^2),
\]
find necessary and sufficient conditions for a strict minimum at zero.

**Answer:** \(a>0\) and \(ac-b^2>0\), equivalently both Hessian eigenvalues positive.

### Exercise M4.4 — Constrained minimum ★★★

Minimize \(x^2+4y^2\) subject to \(x+y=3\).

**Answer:** \((x,y)=(12/5,3/5)\), minimum \(36/5\).

### Exercise M4.5 — Transition-state landscape ★★★★

Let
\[
V=x^4-2x^2+y^2+\alpha xy.
\]
Find and classify all critical points.

**Solution skeleton:** \(y=-\alpha x/2\), and
\[
x\left(4x^2-4-\frac{\alpha^2}{2}\right)=0.
\]
The origin is always a saddle because the Hessian determinant is \(-8-\alpha^2\). The two nonzero points are minima.

---

## TD 5 — Phase portraits and nonlinear systems

### Exercise M5.1 — Nullclines ★★

\[
x'=x(1-x-y),\qquad y'=y(2-x-2y).
\]
Find first-quadrant equilibria, draw nullclines, and classify using the Jacobian.

**Core data:** Nullclines are \(x=0\), \(x+y=1\), \(y=0\), and \(x+2y=2\). Equilibria are \((0,0),(1,0),(0,1)\).

### Exercise M5.2 — First integral ★★★

For \(x'=y,\ y'=-x-x^3\), prove
\[
H=\frac12y^2+\frac12x^2+\frac14x^4
\]
is conserved and describe non-equilibrium phase curves.

**Answer:** \(\dot H=0\); positive-energy curves are closed, so motion is periodic.

### Exercise M5.3 — Gradient flow ★★★

For \(X'=-\nabla V\) with
\[
V=\frac14(x^2-1)^2+\frac12y^2,
\]
find equilibria and prove \(V\) decreases.

**Answer:** \((\pm1,0)\) are minima; \((0,0)\) is a saddle; \(\dot V=-\|\nabla V\|^2\le0\).

### Exercise M5.4 — Linearization trap ★★★★

\[
x'=y,\qquad y'=-x^3.
\]
Show linearization is inconclusive and determine stability.

**Answer:** The Jacobian has zero eigenvalues. The conserved positive-definite function
\[
H=\frac12y^2+\frac14x^4
\]
proves Lyapunov stability, but not asymptotic stability.

---

## TD 6 — Linear systems and similarity

### Exercise M6.1 — Diagonalization ★★

Solve
\[
X'=\begin{pmatrix}4&1\\2&3\end{pmatrix}X,
\quad X(0)=\binom10.
\]

**Answer:** Eigenpairs: \(2,(1,-2)\) and \(5,(1,1)\). Therefore
\[
X(t)=\frac13e^{2t}\binom1{-2}+\frac23e^{5t}\binom11.
\]

### Exercise M6.2 — Jordan block ★★★

Solve
\[
X'=\begin{pmatrix}-1&1\\0&-1\end{pmatrix}X,
\quad X(0)=\binom ab.
\]

**Answer:**
\[
X(t)=e^{-t}\binom{a+bt}{b}.
\]

### Exercise M6.3 — Inverse design ★★★

Construct matrices representing a stable spiral, unstable node, saddle with invariant lines \(y=\pm x\), and defective stable node.

**Examples:**
\[
\begin{pmatrix}-1&-2\\2&-1\end{pmatrix},
\quad
\begin{pmatrix}1&0\\0&3\end{pmatrix},
\quad
\begin{pmatrix}0&1\\1&0\end{pmatrix},
\quad
\begin{pmatrix}-1&1\\0&-1\end{pmatrix}.
\]

### Exercise M6.4 — Sequential reaction ★★★

For \(A\xrightarrow{k_1}B\xrightarrow{k_2}C\), \(A(0)=A_0,B(0)=0\), derive \(A,B\) and the time of maximum \(B\).

**Answer:**
\[
A=A_0e^{-k_1t},
\]
\[
B=\frac{k_1A_0}{k_2-k_1}(e^{-k_1t}-e^{-k_2t}),
\]
\[
t_{\max}=\frac{\ln(k_2/k_1)}{k_2-k_1}.
\]

### Exercise M6.5 — Matrix exponential ★★★★

For \(A=\begin{psmallmatrix}a&-b\\b&a\end{psmallmatrix}\), prove
\[
e^{At}=e^{at}\begin{pmatrix}\cos bt&-\sin bt\\\sin bt&\cos bt\end{pmatrix}.
\]

**Method:** Write \(A=aI+bJ\), use \(J^2=-I\), and expand the exponential series.

---

## TD 7 — Harmonic oscillator and normal modes

### Exercise M7.1 — Damping regimes ★★

Classify \(x''+4x'+\omega_0^2x=0\) for \(\omega_0=1,2,3\).

**Answer:** overdamped, critical, underdamped respectively.

### Exercise M7.2 — Energy decay ★★★

For \(mx''+\gamma x'+kx=0\), prove
\[
E'= -\gamma x'^2,
\quad
E=\frac12mx'^2+\frac12kx^2.
\]

### Exercise M7.3 — Two coupled oscillators ★★★★

Two equal masses satisfy
\[
mx_1''=-(k+\kappa)x_1+\kappa x_2,
\quad
mx_2''=\kappa x_1-(k+\kappa)x_2.
\]
Find normal modes.

**Answer:** symmetric \((1,1)\), \(\omega^2=k/m\); antisymmetric \((1,-1)\), \(\omega^2=(k+2\kappa)/m\).

### Exercise M7.4 — Isotope shift ★★★

For a diatomic oscillator with reduced mass \(\mu\), derive the frequency ratio after isotope substitution.

**Answer:**
\[
\omega=\sqrt{k/\mu},
\qquad
\frac{\omega'}{\omega}=\sqrt{\frac\mu{\mu'}}.
\]

---

## Reconstructed mathematics assessments

### Continuous assessment — 45 minutes / 20 points

1. Convert \(x^2+y^2=2x\) to polar form and identify the curve. **(4)**
2. Study continuity and differentiability at zero of \(xy^2/(x^2+y^2)\), extended by zero. **(6)**
3. For \(K=c^2T^{-1}e^{-E/(RT)}\), derive \(dK/K\). **(4)**
4. Classify the origin for \(f=x^2+2axy+y^2\) as a function of \(a\). **(6)**

**Key results:**

- `r=2 cos θ`, circle centre `(1,0)`, radius `1`.
- Continuous with zero partials but not differentiable.
- \(dK/K=2dc/c-dT/T-dE/(RT)+E\,dT/(RT^2)\).
- minimum if \(|a|<1\), saddle if \(|a|>1\), degenerate if \(|a|=1\).

### Partiel — 90 minutes / 20 points

#### Exercise 1 — Surface and gradient (7)

For \(f=xe^{-(x^2+y^2)}\), find symmetries, critical points and classifications, tangent plane at \((1,0)\), and level set \(f=0\).

**Key:** Critical points \((\pm1/\sqrt2,0)\); positive point maximum, negative point minimum; \(f=0\) iff \(x=0\).

#### Exercise 2 — Arrhenius uncertainty (5)

For \(k=Ae^{-E/(RT)}\), derive covariance-aware uncertainty in \(\ln k\).

**Key:**
\[
d\ln k=\frac{dA}{A}-\frac{dE}{RT}+\frac{E}{RT^2}dT,
\quad
\sigma^2=\mathbf g^\top\Sigma\mathbf g.
\]

#### Exercise 3 — Differential system (8)

\[
X'=\begin{pmatrix}-2&1\\-5&-2\end{pmatrix}X.
\]
Find eigenvalues, real general solution, stability, and rotation direction.

**Key:** \(-2\pm i\sqrt5\), stable clockwise spiral.

### Final examination — 2 hours / 40 points

#### Problem A — Energy landscape (12)

\[
V=\frac14x^4-\frac a2x^2+\frac12y^2+bxy.
\]
Find/classify all critical points and diagonalize the Hessian at a nonzero minimum.

**Core solution:** \(y=-bx\), \(x(x^2-a-b^2)=0\). Nonzero points exist if \(a+b^2>0\); then the origin is a saddle and the nonzero points are minima.

#### Problem B — Coupled kinetics (14)

\[
A\underset{k_{-1}}{\stackrel{k_1}{\rightleftharpoons}}B,
\qquad B\xrightarrow{k_2}C.
\]
Write the `A,B` system, prove stability, solve through eigenvalues, and interpret fast/slow timescales.

**Matrix:**
\[
M=\begin{pmatrix}-k_1&k_{-1}\\k_1&-(k_{-1}+k_2)\end{pmatrix},
\]
with negative trace and positive determinant \(k_1k_2\).

#### Problem C — Hamiltonian versus damping (14)

\[
x'=v,\qquad v'=-\omega_0^2x-\gamma v.
\]
Classify damping regimes, find Hamiltonian at \(\gamma=0\), prove energy decay for \(\gamma>0\), exclude nontrivial periodic orbits, and write the underdamped solution.

---

## Guide: dynamic mathematics exercise generator

```text
TOPIC:
PREREQUISITES:
TARGET SKILL:
REPRESENTATION: symbolic / graph / numerical / verbal
CHEMISTRY CONTEXT:
DIFFICULTY: 1–5
PARAMETERS:
CONSTRAINTS GUARANTEEING A VALID ANSWER:
HINT LADDER:
INDEPENDENT ANSWER CHECK:
COMMON WRONG ANSWERS AND FEEDBACK:
FOLLOW-UP VARIATION:
```

### Example: classifiable quadratic energy

Generate
\[
V(x,y)=\tfrac12(ax^2+2bxy+cy^2)+dx+ey.
\]
Use \(ac-b^2\ne0\) for one critical point; \(a>0,ac-b^2>0\) for a minimum; \(ac-b^2<0\) for a saddle. Verify the symbolic gradient, solve the critical point, classify from eigenvalues, sample nearby points numerically, and generate feedback for the common mistake of inspecting only \(f_{xx}\).


# Part III — All Physics Courses

## Official UE A: *Électromagnétisme et interactions : statique*

The official programme explicitly includes:

- vectors, coordinate systems, associated frames, and standard geometries;
- surface charge distributions and their symmetries;
- electric-field calculation from a distribution and Gauss’s theorem;
- electrostatic potential;
- electric dipole;
- symmetries of current distributions;
- magnetic field from Biot–Savart and Ampère;
- magnetic vector potential;
- magnetic dipole.

## Official UE B: *Électromagnétisme et interactions : dynamique*

The public description states the objective of linking chemistry questions, including intramolecular forces, to **electric multipoles**, with special attention to the physics–chemistry connection. It recommends standard electromagnetism references, especially Jackson.

Therefore:

- electric multipoles and molecular interactions are **confirmed**;
- the exact lecture order is not public;
- induction, variable Maxwell equations, and waves belong to neighboring Paris-Saclay L2 physics programmes, but are included only as an **optional bridge**.

---

## Physics Course 0 — Mathematical toolkit for fields

**Status:** [OFFICIAL prerequisite]

### Vector products

\[
\mathbf a\cdot\mathbf b=ab\cos\theta,
\qquad
|\mathbf a\times\mathbf b|=ab\sin\theta.
\]

### Scalar and vector fields

- electric potential \(V(\mathbf r)\): scalar;
- electric field \(\mathbf E(\mathbf r)\): vector;
- magnetic vector potential \(\mathbf A(\mathbf r)\): vector;
- magnetic field \(\mathbf B(\mathbf r)\): vector.

### Differential operators — Cartesian coordinates

\[
\nabla V=(\partial_xV,\partial_yV,\partial_zV),
\]
\[
\nabla\cdot\mathbf F=\partial_xF_x+\partial_yF_y+\partial_zF_z,
\]
\[
\nabla\times\mathbf F=
\begin{vmatrix}
\mathbf e_x&\mathbf e_y&\mathbf e_z\\
\partial_x&\partial_y&\partial_z\\
F_x&F_y&F_z
\end{vmatrix}.
\]

Electrostatics:
\[
\mathbf E=-\nabla V.
\]
Magnetostatics:
\[
\mathbf B=\nabla\times\mathbf A.
\]

### Symmetry protocol

Before any integral:

1. identify transformations leaving the source unchanged;
2. determine how a vector at the observation point transforms;
3. eliminate impossible components;
4. identify coordinates on which the magnitude may depend;
5. only then choose Coulomb, Gauss, Biot–Savart, or Ampère.

---

## Physics Course 1 — Charge distributions, Coulomb law, and superposition

**Status:** [OFFICIAL]

For point charges,
\[
\mathbf E(\mathbf r)=\frac1{4\pi\varepsilon_0}
\sum_iq_i\frac{\mathbf r-\mathbf r_i}{|\mathbf r-\mathbf r_i|^3}.
\]
Force on charge \(q\): \(\mathbf F=q\mathbf E\).

Continuous sources:
\[
dq=\lambda\,d\ell,\qquad dq=\sigma\,dS,\qquad dq=\rho\,dV.
\]
Then
\[
d\mathbf E=\frac1{4\pi\varepsilon_0}\frac{dq}{R^2}\widehat{\mathbf R}.
\]

### Superposition strategy

1. define source coordinate \(\mathbf r'\);
2. define observation point \(\mathbf r\);
3. write \(\mathbf R=\mathbf r-\mathbf r'\);
4. write \(dq\);
5. cancel components by symmetry;
6. integrate surviving components;
7. test units, limits, and direction.

### Charged ring on its axis

For radius \(a\), total charge \(Q\), and axis coordinate \(z\),
\[
E_z(z)=\frac1{4\pi\varepsilon_0}
\frac{Qz}{(z^2+a^2)^{3/2}}.
\]
Checks: zero at the centre, point-charge limit far away, and sign reversal with \(Q\) or \(z\).

### Chemistry connection

Partial atomic charges model molecular charge distributions. Nearby, detailed geometry matters; far away, the first nonzero multipole dominates.

### Dynamic lesson design

Hide the source and display only a field map. Ask the student to infer source symmetry, net sign, and likely dipole character. Then reverse the task.

---

## Physics Course 2 — Gauss’s theorem and electrostatic symmetry

**Status:** [OFFICIAL]

\[
\Phi_E=\iint_S\mathbf E\cdot d\mathbf S,
\qquad
\oiint_S\mathbf E\cdot d\mathbf S=\frac{Q_{\rm enc}}{\varepsilon_0}.
\]

Gauss’s law directly calculates \(E\) only when symmetry fixes field direction and makes magnitude constant on suitable surface pieces.

### Uniform solid sphere

Inside:
\[
E(r)=\frac{\rho r}{3\varepsilon_0}.
\]
Outside:
\[
E(r)=\frac1{4\pi\varepsilon_0}\frac Q{r^2}.
\]

### Infinite line

\[
E(r)=\frac{\lambda}{2\pi\varepsilon_0r}.
\]

### Infinite sheet

\[
E=\frac{\sigma}{2\varepsilon_0}.
\]

### Local form — high-confidence extension

\[
\nabla\cdot\mathbf E=\frac\rho{\varepsilon_0}.
\]

### Common errors

- selecting a Gaussian surface only because it encloses charge;
- replacing enclosed charge by total charge;
- forgetting both sides/caps;
- assuming the field is zero inside every charged body.

### Dynamic lesson design

Require a symmetry–field–surface table before the flux calculation unlocks.

---

## Physics Course 3 — Electrostatic potential and energy

**Status:** [OFFICIAL]

\[
V(B)-V(A)=-\int_A^B\mathbf E\cdot d\boldsymbol\ell,
\qquad
\mathbf E=-\nabla V.
\]

Point charge:
\[
V=\frac1{4\pi\varepsilon_0}\frac qR.
\]
Discrete and continuous distributions:
\[
V=\frac1{4\pi\varepsilon_0}\sum_i\frac{q_i}{R_i},
\qquad
V=\frac1{4\pi\varepsilon_0}\int\frac{dq}{R}.
\]

Potential energy:
\[
U=qV,
\qquad
U=\frac1{4\pi\varepsilon_0}\sum_{i<j}\frac{q_iq_j}{r_{ij}},
\qquad
\mathbf F=-\nabla U.
\]

Equipotentials are orthogonal to \(\mathbf E\); the field points toward decreasing \(V\).

### Poisson and Laplace — high-confidence extension

\[
\nabla^2V=-\frac\rho{\varepsilon_0},
\qquad
\nabla^2V=0\quad\text{where }\rho=0.
\]

### Chemistry connection

Molecular electrostatic-potential maps support qualitative reasoning about electron-rich and electron-poor regions, but they are model-dependent and are not identical to electron density.

---

## Physics Course 4 — Electric dipole

**Status:** [OFFICIAL]

For charges \(\pm q\) separated by vector \(\mathbf d\) from negative to positive,
\[
\mathbf p=q\mathbf d.
\]
For a neutral distribution,
\[
\mathbf p=\int\mathbf r'\rho(\mathbf r')\,dV'.
\]

### Far-field potential and field

\[
V=\frac1{4\pi\varepsilon_0}\frac{\mathbf p\cdot\widehat{\mathbf r}}{r^2}.
\]
\[
\mathbf E=\frac1{4\pi\varepsilon_0r^3}
\left[3(\mathbf p\cdot\widehat{\mathbf r})\widehat{\mathbf r}-\mathbf p\right].
\]

### Dipole in an external field

\[
\boldsymbol\tau=\mathbf p\times\mathbf E,
\qquad
U=-\mathbf p\cdot\mathbf E.
\]
In a nonuniform field, under the fixed-dipole approximation,
\[
\mathbf F=\nabla(\mathbf p\cdot\mathbf E).
\]

### Molecular polarity

For point partial charges,
\[
\mathbf p=\sum_iq_i\mathbf r_i.
\]
Polar bonds can cancel by symmetry; geometry is essential.

### Dynamic lesson design

Use PhET *Molecule Polarity*: predict bond and molecular dipoles, vary bond angle, rotate in an external field, and compare electrostatic-potential and electron-density views.

---

## Physics Course 5 — Current distributions and Biot–Savart law

**Status:** [OFFICIAL]

\[
d\mathbf B=\frac{\mu_0}{4\pi}
\frac{I\,d\boldsymbol\ell'\times\widehat{\mathbf R}}{R^2}.
\]

Infinite straight wire:
\[
B(r)=\frac{\mu_0I}{2\pi r}.
\]

Circular loop centre:
\[
B=\frac{\mu_0I}{2R}.
\]

Circular loop axis:
\[
B_z(z)=\frac{\mu_0IR^2}{2(R^2+z^2)^{3/2}}.
\]

### Symmetry warning

Current is directed. Reflections transform both geometry and current direction. Determine which components cancel before integrating.

### Dynamic lesson design

Use direction-only rounds: current geometry plus observation point; the learner determines field direction from cross products and symmetry before magnitude.

---

## Physics Course 6 — Ampère’s theorem

**Status:** [OFFICIAL]

\[
\oint_C\mathbf B\cdot d\boldsymbol\ell=\mu_0I_{\rm enc}.
\]

- Infinite wire: \(B=\mu_0I/(2\pi r)\).
- Long ideal solenoid: \(B\approx\mu_0nI\) inside.
- Toroid, within windings: \(B(r)=\mu_0NI/(2\pi r)\).

Use Biot–Savart when symmetry is insufficient but source integration is manageable. Use Ampère only when symmetry makes the circulation integral algebraic.

---

## Physics Course 7 — Magnetic vector potential and magnetic dipole

**Status:** [OFFICIAL]

Because \(\nabla\cdot\mathbf B=0\),
\[
\mathbf B=\nabla\times\mathbf A.
\]
For a thin steady current,
\[
\mathbf A(\mathbf r)=\frac{\mu_0I}{4\pi}
\int\frac{d\boldsymbol\ell'}{|\mathbf r-\mathbf r'|}.
\]
Gauge freedom:
\[
\mathbf A\to\mathbf A+\nabla\chi.
\]

For a planar loop,
\[
\mathbf m=IS\mathbf n.
\]
\[
\boldsymbol\tau=\mathbf m\times\mathbf B,
\qquad
U=-\mathbf m\cdot\mathbf B.
\]
Far field:
\[
\mathbf B=\frac{\mu_0}{4\pi r^3}
\left[3(\mathbf m\cdot\widehat{\mathbf r})\widehat{\mathbf r}-\mathbf m\right].
\]

### Chemistry connection

The current-loop moment is the classical model leading toward orbital and spin magnetic moments. The official static UE likely remains classical.

### Dynamic lesson design

Build an electric/magnetic analogy table for moment, energy, torque, and far-field angular pattern; then ask where the analogy fails.

---

## Physics Course 8 — Electric multipole expansion

**Status:** [OFFICIAL objective; detailed sequence HIGH-CONFIDENCE]

For a localized source observed at \(r\gg a\), expand
\[
\frac1{|\mathbf r-\mathbf r'|}
=\frac1r+
\frac{\mathbf r'\cdot\widehat{\mathbf r}}{r^2}+
\frac{3(\mathbf r'\cdot\widehat{\mathbf r})^2-r'^2}{2r^3}+\cdots.
\]

Thus
\[
V=\frac1{4\pi\varepsilon_0}
\left[
\frac Qr+
\frac{\mathbf p\cdot\widehat{\mathbf r}}{r^2}+
\frac1{2r^3}\sum_{ij}Q_{ij}\hat r_i\hat r_j+\cdots
\right],
\]
where
\[
Q=\int\rho\,dV,
\quad
\mathbf p=\int\mathbf r'\rho\,dV',
\]
\[
Q_{ij}=\int\rho(\mathbf r')
(3x_i'x_j'-r'^2\delta_{ij})\,dV'.
\]

### Origin dependence

- \(Q\) is origin independent;
- if \(Q=0\), \(\mathbf p\) is origin independent;
- if \(Q\ne0\), shifting origin changes \(\mathbf p\);
- quadrupole conventions must be stated.

### Symmetry deductions

- inversion symmetry kills the dipole;
- spherical symmetry leaves only the monopole outside;
- a neutral symmetric linear molecule may have zero dipole but nonzero quadrupole.

### Chemistry connection

Ions are monopolar, polar neutral molecules have dipolar far fields, and neutral nonpolar anisotropic molecules can be quadrupolar. Multipoles compress a complicated charge distribution into interpretable long-range descriptors.

### Dynamic lesson design

Ask for the first nonzero moment before calculation. Reflect or rotate the source and require prediction of vanishing tensor components.

---

## Physics Course 9 — Multipole interaction energies and molecular forces

**Status:** [OFFICIAL objective; HIGH-CONFIDENCE]

Charge–dipole energy:
\[
U_{q-p}=\frac1{4\pi\varepsilon_0}
\frac{q\,\mathbf p\cdot\widehat{\mathbf r}}{r^2}.
\]

Dipole–dipole energy:
\[
U_{dd}=\frac1{4\pi\varepsilon_0r^3}
\left[
\mathbf p_1\cdot\mathbf p_2
-3(\mathbf p_1\cdot\widehat{\mathbf r})
(\mathbf p_2\cdot\widehat{\mathbf r})
\right].
\]

For fixed orientation,
\[
\mathbf F=-\nabla U,
\qquad
\boldsymbol\tau_2=\mathbf p_2\times\mathbf E_1.
\]

Scaling of energies:

- charge–charge: \(r^{-1}\);
- charge–dipole: \(r^{-2}\);
- dipole–dipole: \(r^{-3}\).

### Interpretation boundary

Within molecules, accurate forces require quantum chemistry. Multipole electrostatics is a long-range approximation and force-field component, not an exact electron-dynamics theory.

---

## Physics Course 10 — Induced dipoles and polarizability

**Status:** [PROBABLE, strongly connected to the official objective]

For isotropic linear response,
\[
\mathbf p_{\rm ind}=\alpha\mathbf E.
\]
For anisotropic response,
\[
\mathbf p_{\rm ind}=\boldsymbol\alpha\mathbf E.
\]

The induced-dipole energy is
\[
U_{\rm ind}=-\frac12\alpha E^2.
\]
The factor `1/2` appears because the dipole is built gradually by the field.

For a charge-induced dipole,
\[
U\propto-r^{-4}.
\]
For a dipole-induced dipole,
\[
U\propto-r^{-6}.
\]
London dispersion also scales as \(r^{-6}\), but has a distinct quantum origin.

### Dynamic polarizability — extension

\[
\mathbf p(\omega)=\boldsymbol\alpha(\omega)\mathbf E(\omega),
\]
which connects to absorption, refractive index, and spectroscopy.

---

## Physics Course 11 — Charged-particle dynamics

**Status:** [PROBABLE bridge, supported by public Paris-Saclay EM teaching; not explicit in the L2 Chimie page]

Lorentz force:
\[
\mathbf F=q(\mathbf E+\mathbf v\times\mathbf B).
\]

For \(\mathbf v\perp\mathbf B\):
\[
R=\frac{mv}{|q|B},
\qquad
\omega_c=\frac{|q|B}{m}.
\]
A parallel velocity component produces a helix. Magnetic force does no work.

Crossed-field selector:
\[
v=\frac EB.
\]
This leads naturally to mass-spectrometry exercises, a style present in public Paris-Saclay electromagnetism material.

---

## Physics Course 12 — Optional induction and Maxwell bridge

**Status:** [EXTENSION — neighboring L2 Physics/Interface content, not confirmed L2 Chimie core]

\[
\mathcal E=-\frac{d\Phi_B}{dt}.
\]

Maxwell equations:
\[
\nabla\cdot\mathbf E=\rho/\varepsilon_0,
\quad
\nabla\cdot\mathbf B=0,
\]
\[
\nabla\times\mathbf E=-\partial_t\mathbf B,
\quad
\nabla\times\mathbf B=\mu_0\mathbf J+
\mu_0\varepsilon_0\partial_t\mathbf E.
\]

In source-free vacuum,
\[
\nabla^2\mathbf E-\frac1{c^2}\partial_t^2\mathbf E=0,
\qquad c=(\mu_0\varepsilon_0)^{-1/2}.
\]

Study this only after confirmed multipole material if preparing for later optics/spectroscopy.

---

## Physics resource map

| Topic | Closest public resource | Role |
|---|---|---|
| Vectors, gradient, coordinates | Paris-Saclay public 2025–2026 L1 EM C1–C2 | prerequisite style |
| Coulomb, field, potential | MIT OCW 8.02; OpenStax University Physics vol. 2 | complete lessons/problems |
| Symmetry and dipoles | Paris-Saclay public L1 C3–C5 and TD poly | institutional style |
| Water-molecule dipole | Paris-Saclay public 7 May 2026 EM exam | chemistry-linked exam archetype |
| Gauss | OpenStax Ch. 6; MIT 8.02 | canonical geometries |
| Biot–Savart and Ampère | OpenStax Ch. 12; MIT 8.02 | derivations and applications |
| Electric/magnetic multipoles | MIT OCW 8.07; Jackson | advanced reference |
| Molecular polarity | PhET Molecule Polarity | interactive lab |
| Fields and equipotentials | PhET Charges and Fields | interactive map |
| Induction/Maxwell extension | official Paris-Saclay L2 Physics/Interface syllabus | neighboring progression |

---

## Guide: how to create a dynamic physics course

### Lesson cycle

1. **Phenomenon:** field map, molecular orientation, or ion trajectory.
2. **Prediction:** direction, sign, scaling, and limiting behavior.
3. **Symmetry:** allowed vector components.
4. **Model:** source, observation point, assumptions.
5. **Derivation:** shortest valid integral or theorem.
6. **Checks:** units, symmetry, near/far limit, sign.
7. **Chemistry transfer:** molecule, ion, spectroscopy, or material.
8. **Model critique:** what the classical approximation omits.

### Multiple representations

Exercise each concept as an equation, vector diagram, field/equipotential map, verbal symmetry argument, numerical estimate, and chemistry interpretation.

### Dynamic hint ladder

1. identify symmetry;
2. choose coordinates;
3. identify surviving component;
4. write `dq` or `I dℓ`;
5. write the distance vector;
6. suggest the theorem;
7. reveal one algebraic intermediate;
8. show a final check rather than the full solution.


# Part IV — Physics Exercises and Reconstructed Exams

> These TDs combine the exact official static topics with a high-confidence reconstruction of the electric-multipole and molecular-interaction semester.

---

## TD P1 — Symmetry and electric fields

### Exercise P1.1 — Two equal charges ★

Charges \(q\) are at \((\pm a,0)\). Find the field on the `y`-axis and its far-field limit.

**Answer:**
\[
\mathbf E(0,y)=\frac1{4\pi\varepsilon_0}
\frac{2qy}{(a^2+y^2)^{3/2}}\mathbf e_y.
\]
For \(|y|\gg a\), this becomes the field of total charge \(2q\).

### Exercise P1.2 — Charged semicircle ★★★

A semicircular wire of radius \(R\), \(0\le\theta\le\pi\), has uniform line density \(\lambda\). Find the field at the centre.

**Solution:** Horizontal components cancel and the field points downward:
\[
\mathbf E=-\frac{2\lambda}{4\pi\varepsilon_0R}\mathbf e_y
=-\frac{Q}{2\pi^2\varepsilon_0R^2}\mathbf e_y,
\quad Q=\lambda\pi R.
\]

### Exercise P1.3 — Model-check trap ★★★

A ring of charge \(Q\) is centred at the origin and a point charge \(-q\) is also at the origin. Find \(V(z)\), then expand it near \(z=0\).

**Correct response:**
\[
V(z)=\frac1{4\pi\varepsilon_0}
\left(\frac Q{\sqrt{a^2+z^2}}-\frac q{|z|}\right).
\]
The point charge creates a singularity, so a Taylor expansion at zero is impossible. Reject the ill-posed request instead of manipulating blindly.

### Exercise P1.4 — Charged disk ★★★★

A disk radius \(R\) has uniform density \(\sigma\). Derive the axial field at height \(z>0\).

**Solution:** Integrating rings,
\[
E_z=\frac{\sigma}{2\varepsilon_0}
\left(1-\frac z{\sqrt{z^2+R^2}}\right).
\]
The limit \(R\to\infty\) gives the infinite-sheet field.

---

## TD P2 — Gauss, potential, and energy

### Exercise P2.1 — Nonuniform sphere ★★★

A sphere radius \(R\) has \(\rho(r)=\rho_0r/R\). Find \(E\) inside and outside, total charge, and continuity at \(R\).

**Solution:**
\[
Q_{\rm enc}(r)=\frac{\pi\rho_0r^4}{R},
\quad
E_{\rm in}=\frac{\rho_0r^2}{4\varepsilon_0R}.
\]
\[
Q=\pi\rho_0R^3,
\quad
E_{\rm out}=\frac{\rho_0R^3}{4\varepsilon_0r^2}.
\]

### Exercise P2.2 — Potential of the sphere ★★★

Using \(V(\infty)=0\), find \(V\) for Exercise P2.1.

**Answer:**
\[
V_{\rm out}=\frac{\rho_0R^3}{4\varepsilon_0r}.
\]
\[
V_{\rm in}=\frac{\rho_0R^2}{4\varepsilon_0}
+\frac{\rho_0}{12\varepsilon_0R}(R^3-r^3).
\]

### Exercise P2.3 — Coaxial geometry ★★★

A solid cylinder \(r<a\) has uniform density \(\rho\). A shell at \(r=b>a\) carries charge making total charge per length zero. Find shell density, all field regions, and \(V(r)-V(a)\) for \(a<r<b\).

**Answer:**
\[
\sigma=-\frac{\rho a^2}{2b}.
\]
\[
E=\frac{\rho r}{2\varepsilon_0}\ (r<a),
\quad
E=\frac{\rho a^2}{2\varepsilon_0r}\ (a<r<b),
\quad
E=0\ (r>b).
\]
\[
V(r)-V(a)=-\frac{\rho a^2}{2\varepsilon_0}\ln\frac ra.
\]

### Exercise P2.4 — Square assembly energy ★★★

Four charges alternate \(+q,-q,+q,-q\) around a square side \(a\). Find total energy.

**Answer:**
\[
U=\frac{kq^2}{a}(-4+\sqrt2),
\quad k=\frac1{4\pi\varepsilon_0}.
\]

---

## TD P3 — Electric dipoles and molecular polarity

### Exercise P3.1 — Exact versus dipole potential ★★★

Charges \(+q\) and \(-q\) lie at \(z=\pm a\). Write exact spherical potential, expand for \(r\gg a\), and identify the moment.

**Core result:**
\[
V=kq\left[
(r^2+a^2-2ar\cos\theta)^{-1/2}
-(r^2+a^2+2ar\cos\theta)^{-1/2}
\right],
\]
with leading dipole moment \(\mathbf p=2qa\mathbf e_z\). Odd source symmetry leaves dipole, then octupole; the quadrupole vanishes.

### Exercise P3.2 — Water point-charge model ★★★

Model water by `+q` on each H at bond length \(\ell\), angle \(\theta\), and `−2q` on O. Find the molecular dipole.

**Answer:** It lies on the angle bisector with magnitude
\[
p=2q\ell\cos(\theta/2).
\]
For numerical work convert with \(1\text{ D}=3.33564\times10^{-30}\text{ C m}\).

### Exercise P3.3 — Rotational oscillation ★★★

A dipole \(p\), moment of inertia \(I\), rotates in uniform field \(E\). Derive its equation and small-oscillation frequency.

**Answer:**
\[
I\theta''=-pE\sin\theta,
\qquad
\omega=\sqrt{pE/I}
\]
near stable alignment.

### Exercise P3.4 — Dipole in point-charge field ★★★★

A fixed dipole \(p\mathbf e_z\) lies on the positive axis of charge \(Q\). Find energy and force.

**Answer:**
\[
U=-\frac{kQp}{z^2},
\qquad
F_z=-\frac{2kQp}{z^3}.
\]

---

## TD P4 — Magnetostatics and magnetic dipoles

### Exercise P4.1 — Finite wire ★★★

A wire from \(z=-L\) to \(z=L\) carries current \(I\). Find the field distance \(a\) from its midpoint.

**Answer:**
\[
B=\frac{\mu_0I}{2\pi a}\frac L{\sqrt{L^2+a^2}}.
\]

### Exercise P4.2 — Loop axis and far field ★★★

Derive
\[
B_z(z)=\frac{\mu_0IR^2}{2(R^2+z^2)^{3/2}}
\]
and show the far field equals that of \(m=I\pi R^2\).

### Exercise P4.3 — Nonuniform current cylinder ★★★

A cylinder radius \(R\) carries \(J(r)=J_0(1-r^2/R^2)\) and total current \(I\). Find \(J_0\) and \(B(r)\).

**Solution core:**
\[
J_0=\frac{2I}{\pi R^2},
\]
\[
I_{\rm enc}(r)=2\pi J_0\left(\frac{r^2}{2}-\frac{r^4}{4R^2}\right),
\quad
B=\frac{\mu_0I_{\rm enc}}{2\pi r}
\]
inside, and \(B=\mu_0I/(2\pi r)\) outside.

### Exercise P4.4 — Magnetic-dipole force ★★★

A loop moment \(m\) is in \(B(z)=B_0(1+\alpha z)\mathbf e_z\). Find stable orientation and force when aligned.

**Answer:** aligned is stable for positive field; \(F_z=mB_0\alpha\). A uniform field gives torque but no net translational force.

---

## TD P5 — Electric multipoles

### Exercise P5.1 — First nonzero moment ★★

Determine the leading far field for:

1. one ion;
2. a separated \(+q,-q\) pair;
3. \(+q\) at \(\pm a\mathbf e_x\), \(-2q\) at zero;
4. four equal positive charges at tetrahedron vertices.

**Answers:** monopole; dipole; quadrupole; monopole.

### Exercise P5.2 — Linear quadrupole ★★★

Charges \(+q\) are at \(z=\pm a\), \(-2q\) at zero. Show \(Q=p=0\) and derive leading potential.

**Answer:**
\[
V\sim\frac1{4\pi\varepsilon_0}
\frac{2qa^2}{r^3}P_2(\cos\theta),
\quad
P_2(u)=\frac12(3u^2-1).
\]

### Exercise P5.3 — Origin shift ★★★

Prove for discrete charges and new coordinates \(r_i'=r_i-a\),
\[
p'=p-Qa.
\]
Conclude origin independence for neutral systems.

### Exercise P5.4 — Tensor symmetry ★★★★

A planar distribution lies in \(z=0\) and is invariant under \(x\to-x\) and \(y\to-y\). Determine vanishing dipole/quadrupole components.

**Answer:** all dipole components vanish; all off-diagonal quadrupole components vanish; diagonal terms may remain and satisfy tracelessness in the stated convention.

---

## TD P6 — Molecular interaction forces

### Exercise P6.1 — Dipole orientations ★★★

Two equal dipoles separated along `x` are (i) parallel to `x`, (ii) antiparallel along `x`, (iii) parallel to `y`, (iv) antiparallel along `y`. Find energies.

**Answers:**
\[
-2kp^2/r^3,\quad +2kp^2/r^3,\quad +kp^2/r^3,\quad -kp^2/r^3.
\]

### Exercise P6.2 — Rotational equilibrium ★★★★

A second dipole rotates at a fixed point in the field of a first. Derive equilibrium and small oscillation frequency.

**Method:** \(U=-p_2\cdot E_1\); stable alignment is with the local field; near equilibrium
\[
U\approx U_{\min}+\frac12p_2E_1\delta\theta^2,
\quad
\omega=\sqrt{p_2E_1/I}.
\]

### Exercise P6.3 — Charge-induced dipole ★★★

An ion \(q\) approaches an isotropic molecule of polarizability \(\alpha\). Derive energy and force.

**Answer:**
\[
U=-\frac12\alpha k^2\frac{q^2}{r^4},
\quad
F_r=-2\alpha k^2\frac{q^2}{r^5}.
\]
Always attractive in this model.

### Exercise P6.4 — Anisotropic polarizability ★★★★

A linear molecule has \(\alpha=\operatorname{diag}(\alpha_\perp,\alpha_\perp,\alpha_\parallel)\) and angle \(\theta\) to a field. Find energy, torque, and preferred orientation.

**Answer:**
\[
U=-\frac12E^2(\alpha_\perp\sin^2\theta+\alpha_\parallel\cos^2\theta),
\]
\[
\tau_\theta=-\frac12E^2(\alpha_\parallel-\alpha_\perp)\sin2\theta.
\]
If \(\alpha_\parallel>\alpha_\perp\), the molecular axis aligns with the field.

---

## TD P7 — Charged-particle dynamics and mass spectrometry

### Exercise P7.1 — Helical motion ★★★

A particle enters \(B\mathbf e_z\) with perpendicular and parallel velocity components. Find cyclotron frequency, radius, and pitch.

**Answer:**
\[
\omega_c=|q|B/m,
\quad
R=mv_\perp/(|q|B),
\quad
\text{pitch}=2\pi mv_\parallel/(|q|B).
\]

### Exercise P7.2 — Bainbridge selector ★★★

Ions pass crossed fields, then a magnetic analyser. Derive selected speed and landing radius.

**Answer:**
\[
v=E/B_1,
\qquad
R=\frac{mE}{|q|B_1B_2}.
\]

### Exercise P7.3 — Work theorem ★★

Prove
\[
\frac d{dt}\left(\frac12mv^2\right)=q\mathbf E\cdot\mathbf v
\]
and that the magnetic part performs no work.

### Exercise P7.4 — Time of flight ★★★

Singly charged ions accelerated through \(\Delta V\) cross a tube length \(L\). Find flight time.

**Answer:**
\[
t=L\sqrt{\frac m{2q\Delta V}}.
\]

---

## Reconstructed physics assessments

### Static electromagnetism CC — 60 minutes / 20 points

1. Deduce the field form of an infinite charged plane from symmetry. **(4)**
2. Given \(V=V_0e^{-az}\cos bx\), find \(E\) and implied \(\rho\). **(5)**
3. Derive the charged-ring axial field and far limit. **(5)**
4. A cylinder has \(J(r)=Cr\). Determine `C` from total current and find `B` inside/outside. **(6)**

**Key for Question 2:**
\[
\mathbf E=V_0e^{-az}(b\sin bx\,\mathbf e_x+a\cos bx\,\mathbf e_z),
\]
\[
\rho=-\varepsilon_0(a^2-b^2)V.
\]

### Dynamic/multipole partiel — 90 minutes / 20 points

#### Exercise 1 — Molecular multipoles (10)

Charges \(+q\) at \((\pm a,0)\) and \(-q\) at \((0,\pm b)\): find total charge, dipole, quadrupole components, leading far term, and special case \(a=b\).

**Key:** total charge and dipole vanish by inversion symmetry; quadrupole generally leads. State and consistently apply the tensor convention.

#### Exercise 2 — Ion–molecule interaction (10)

An ion \(Q\) lies on the axis of a molecule with permanent dipole \(p\) and isotropic polarizability \(\alpha\). Find total energy, preferred orientation, radial force, and crossover between permanent and induced terms.

**Key:**
\[
U=-\frac{kQp\cos\theta}{r^2}
-\frac12\alpha\frac{k^2Q^2}{r^4}.
\]
For optimal attractive orientation, equality of magnitudes gives
\[
r_c^2=\frac{\alpha k|Q|}{2p}.
\]

### Comprehensive final — 2 hours / 40 points

#### Problem A — Nonuniform charged sphere (10)

A sphere radius \(R\) has \(\rho(r)=\rho_0(1-r/R)\). Find total charge, field, potential, continuity, and location of maximum interior field.

**Core results:**
\[
Q(r)=4\pi\rho_0\left(\frac{r^3}{3}-\frac{r^4}{4R}\right),
\]
\[
E_{\rm in}=\frac{\rho_0}{\varepsilon_0}
\left(\frac r3-\frac{r^2}{4R}\right),
\quad
Q(R)=\frac{\pi\rho_0R^3}{3},
\]
maximum at \(r=2R/3\).

#### Problem B — Current loop and magnetic dipole (8)

Derive loop-axis field and far expansion, identify \(m\), then find leading energy and force for a second aligned axial loop.

**Key:**
\[
B_z\sim\frac{\mu_0}{4\pi}\frac{2m_1}{z^3},
\quad
U=-\frac{\mu_0m_1m_2}{2\pi z^3},
\quad
F_z=-\frac{3\mu_0m_1m_2}{2\pi z^4}.
\]

#### Problem C — Quadrupolar molecule (12)

For \(+q\) at \(z=\pm a\), \(-2q\) at zero, prove monopole/dipole cancellation, derive exact axial potential, far expansion, field, decay comparison, and interaction with charge \(Q\).

**Key:** for \(z>a\),
\[
V=kq\left(\frac1{z-a}+\frac1{z+a}-\frac2z\right)
\sim\frac{2kqa^2}{z^3},
\]
\[
E_z\sim\frac{6kqa^2}{z^4}.
\]

#### Problem D — Polarizable molecule in an ion field (10)

For anisotropic polarizability and no permanent dipole, derive orientation energy, stable orientation, radial force, and two short-range limitations.

**Expected limitations:** charge penetration, nonlinear polarization, exchange repulsion, quantum dispersion/electronic rearrangement, and breakdown of point models.

---

## Guide: dynamic physics exercise generator

```text
SOURCE GEOMETRY:
OBSERVATION REGION:
SYMMETRY OPERATIONS:
TARGET FIELD / POTENTIAL / ENERGY / FORCE:
METHOD CANDIDATES:
WHY ONE METHOD IS BEST:
CHEMISTRY INTERPRETATION:
PARAMETER RANGE:
LIMIT CHECKS:
UNIT CHECK:
VECTOR-DIRECTION CHECK:
NUMERICAL VERIFICATION:
HINT LADDER:
MISCONCEPTION FEEDBACK:
TRANSFER VARIANT:
```

### Geometry families

- finite discrete charges;
- ring, arc, disk;
- sphere with \(\rho(r)=\rho_0(r/R)^n\);
- cylinder with radial density;
- wire, loop, solenoid, toroid;
- neutral molecular point-charge model;
- permanent plus induced dipole;
- linear quadrupole.

### Difficulty levers

- **Level 1:** symmetry and formula selection;
- **Level 2:** one integral and standard limits;
- **Level 3:** nonuniform density or combined sources;
- **Level 4:** multipole expansion, tensor symmetry, coupled energy/force;
- **Level 5:** model critique, parameter inference, uncertainty, comparison with molecular data.

### Verification rules

1. dimensional test;
2. source-sign reversal;
3. symmetry-forbidden components vanish;
4. far field matches total charge/multipole;
5. boundary continuity or jump is correct;
6. finite-difference check of \(E=-\nabla V\);
7. energy-force check \(F=-\nabla U\);
8. no hidden singularity in the requested domain.

### Adaptive feedback examples

- **Integrated before using symmetry:** “Which transformations leave the source unchanged, and which vector components change sign?”
- **Used Gauss without enough symmetry:** “Gauss’s law is valid, but can the magnitude of `E` be taken outside the flux integral?”
- **Forgot origin dependence:** “Is total charge zero? Only then is the dipole moment translation invariant.”
- **Used `−pE` for an induced dipole:** “Was the dipole pre-existing or gradually created by the field?”
- **Wrong force sign:** “Differentiate the energy first and explicitly define positive radial direction.”

---

## Integrated 12-week study plan

| Week | Mathematics | Physics | Cumulative challenge |
|---:|---|---|---|
| 1 | vectors, lines, planes | field vectors, symmetry | coordinate choice for six sources |
| 2 | polar/cylindrical/spherical | Coulomb and distributions | charged ring |
| 3 | surfaces and level sets | Gauss | reconstruct field from symmetry |
| 4 | limits and continuity | potential | compare direct `E` with `−grad V` |
| 5 | partial derivatives | electric dipole | contour and field map |
| 6 | gradient and uncertainty | Biot–Savart | uncertainty in field measurement |
| 7 | Hessian and extrema | Ampère | energy minimum and stable orientation |
| 8 | nonlinear systems | vector potential, magnetic dipole | electric–magnetic analogy |
| 9 | conservative/Hamiltonian | multipole expansion | first nonzero moment |
| 10 | eigenvalues/similarity | molecular interactions | orientation stability |
| 11 | harmonic oscillator | polarizability | induced response model |
| 12 | mixed review | Lorentz / optional Maxwell | two-hour mock exam |

---

## Research base and provenance

### Current official Paris-Saclay sources

1. **Université Paris-Saclay / Polytech Paris-Saclay — “L2 Chimie”**  
   Current programme containing UE names, ECTS, hours, prerequisites, exact mathematics syllabus, full static-electromagnetism list, and dynamic-electromagnetism multipole objective.

2. **Université Paris-Saclay — “L2 Physique” and “L2 Interface Physique-Chimie”**  
   Used only to identify neighboring induction/Maxwell progression. Those topics are not presented as confirmed L2 Chimie core.

### Exact historical Paris-Saclay source

3. **Stéphane Fischler — “Matrices et équations différentielles (Math 250), L2 Chimie, Parcours Chimie”**  
   Public TDs on matrices, determinants, eigenvalues/eigenvectors, differential systems, with corrected midterms and final exams.

### Current/near-current Paris-Saclay teaching evidence

4. **Public eCampus electromagnetism folder, 2025–2026**  
   Lecture PDFs, TD collection, corrections, continuous assessments, partiels, and a 7 May 2026 exam. This is L1, not L2 Chimie, and is used only for prerequisite level, institutional problem style, dipole/molecular links, and charged-particle archetypes.

5. **Paris-Saclay WIMS and public mathematics pages**  
   Interactive multivariable functions, gradients, systems, and matrix-reduction exercises.

### Open university companions

6. **MIT OpenCourseWare 18.02SC — Multivariable Calculus**  
   Lectures, recitations, problem sets, solutions, exams, and Mathlets.

7. **MIT OpenCourseWare 18.03SC — Differential Equations**  
   Linear systems, eigenvalue methods, phase portraits, stability, and harmonic oscillators.

8. **MIT OpenCourseWare 8.02 / 8.022 — Electricity and Magnetism**  
   Electrostatics, magnetostatics, dipoles, continuous distributions, and difficult problems.

9. **MIT OpenCourseWare 8.07 — Electromagnetism II**  
   Multipole expansions and advanced reference material.

10. **OpenStax University Physics, Volume 2**  
    Gauss, potential, Biot–Savart, Ampère, Maxwell equations, worked examples, and problems.

11. **PhET — Charges and Fields; Molecule Polarity**  
    Interactive fields, equipotentials, bond dipoles, molecular dipoles, geometry, and external-field response.

---

## Final accuracy boundary

### Reconstructed with greatest confidence

- every mathematics headline and its prerequisite chain;
- matrix/eigenvalue/differential-system level, supported by the exact historical L2 Chimie course;
- every static-electromagnetism headline;
- the central role of electric multipoles and chemistry-linked interactions in S4;
- likely exercise families: symmetry, distributions, potential, dipoles, multipoles, molecular point-charge models, interaction energy.

### Not publicly knowable with certainty

- exact 2026–2027 weekly order;
- lecturer notation;
- exact current TD statements and marking schemes;
- whether charged-particle dynamics is retained in the L2 version;
- how far the dynamic course goes into time-dependent fields;
- exact weights of continuous assessment, partiel, and final.

Use this document as a difficult preparatory course and dynamic-course blueprint, not as a claim to possess private Paris-Saclay files.
