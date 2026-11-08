# J6: blind judgment, text_A vs text_B (K1:29–44, §3 Geometry, §4 Arithmetic and geometry)

Sizes: A is 139 KB / ~4350 words (wc), B is 73 KB / ~2630 words. A is about 1.9x longer.

## 1. Coverage against the source

| # | Source idea (page) | A | B |
|---|---|---|---|
| 1 | Bridge from §2: practice and abstraction interact, abstraction runs ahead of need (million, imaginary numbers) (29) | yes, "גשר" | no. Its coverage block says this was taught in lesson 1, and its plan includes K1:29 in lesson 1. Fine |
| 2 | Geometric form comes from making things: form is first put into material, then recognised (29–30) | yes | yes, shorter |
| 3 | Rectangle area rule, farmer, length/area/volume from practice (30) | yes | yes |
| 4 | Eudemus and the Nile; geo+metron (30) | yes | partly: etymology only, quote deferred to a "depth layer" |
| 5 | Ahmes manual; Egyptians and Babylonians had rules but no proofs; geometry not yet separate from arithmetic (30–31) | yes, plus π of Ahmes | yes, plus π of Ahmes and Babylon |
| 6 | Thales, Democritus, Pythagoreans; relations become deductions, giving theorem/proof and axioms (31) | yes | partly: mechanism yes, names deferred |
| 7 | Euclid's Elements, nothing essential added until Lobachevsky; Kiselev (31–32) | yes | yes (Kiselev deferred); adds Lobachevsky/Beltrami |
| 8 | Definitions of geometric body and figure, dimensions, point (32) | yes (prose) | yes (formal `definition` block) |
| 9 | Geometry vs astronomy/geodesy/crystallography: the difference is level of abstraction (32) | **no** | yes |
| 10 | No experiments on breadthless lines, so proof (32) | yes | yes |
| 11 | Axioms abstracted from experience: line through two points, superposition/congruence (32–33) | yes | yes |
| 12 | Generality: sphere volume, workers who use geometry (33) | yes | yes (no list of workers) |
| 13 | Fedorov and the 230 groups; practice and abstraction as the driving force; theory guided crystallography (33) | yes | yes |
| 14 | Arithmetic and geometry as two roots; measuring = apply + count; liquids, pendulum (34) | yes | yes |
| 15 | Fractions come from measurement, not from dividing whole numbers; arrow example (34–35) | yes | yes |
| 16 | Definition of incommensurable (35) | yes (prose) | yes (formal, with iff proof) |
| 17 | Dropping tiny remainders; Democritus atoms; cone; prototype of the integral (35) | yes (cone in §4.5) | yes (cone computed here) |
| 18 | Atoms contradict Pythagoras (35) | yes | yes |
| 19 | Proof that √2 is irrational (35–36) | yes | yes |
| 20 | Impact on the Greeks; no √2 symbol (36) | yes | yes |
| 21 | Paradox of continuity; Zeno (36) | yes | **no** (deferred layer) |
| 22 | Eudoxus' theory of ratios (36) | yes | yes |
| 23 | Ratio not seen as a number; mathematicians of the East; 1870s Weierstrass/Dedekind/Cantor (36–37) | yes | yes |
| 24 | Footnote: geometry swallowed arithmetic; quadratics solved geometrically; Descartes; "square"/"cube" (36–37) | yes | **no** (deferred layer) |
| 25 | Newton's definition of number (37) | yes | yes |
| 26 | Real = ratio of magnitudes; content lies in the system; operations reflect operations on magnitudes (37) | yes | yes |
| 27 | Continuity as the key property; image of a continuously varying magnitude; wide applicability (38) | yes | yes |
| 28 | Measurement process, Fig 1, decimal n0.n1n2… (38–39) | yes | yes |
| 29 | Footnote on 0.1399… = 0.14 (39) | yes | yes (explains why) |
| 30 | Addition through truncation, error under 2·10⁻⁶ (39) | yes | yes |
| 31 | Order defined by a = b + c (39) | yes | yes |
| 32 | Continuity as nested sequences, Fig 2 (39–40) | yes | yes |
| 33 | List of conflicting opposites (40) | yes | partly (deferred) |
| 34 | No absolute precision: atomic length, gas pressure, electron charge; √2 has no exact meaning for a real square (40–41) | yes | yes |
| 35 | Incommensurability is a theoretical conclusion beyond experience; why mathematics assumes unlimited precision (41) | yes | yes |
| 36 | Applicability must be checked; continuum only under conditions (41) | yes | yes |
| 37 | Reals are reliable but not absolute; the concept is still developing (41–42) | yes | yes, and critiqued |
| 38 | Discrete vs continuous; mashed potatoes (42) | yes | yes |
| 39 | Unit vs line as models; measurement unites them (42–43) | yes | yes |
| 40 | Democritus, then atoms dropped after incommensurables (43) | yes | yes |
| 41 | 17th-century indivisibles, Fig 3 (43) | yes | yes |
| 42 | Newton's continuous variable; theory of limits (43–44) | yes | yes |
| 43 | 1870s set of points; difficulties; attempts to return to pure continuity (44) | yes | yes (critiqued) |
| 44 | Negative and complex numbers, vectors, tensors (44) | yes | yes (adds multiplication by i as rotation) |
| 45 | Union of theories: analytic geometry, calculus, complex functions, functional analysis, analytic number theory, geometry of numbers (44) | yes (links to the lattice) | **no** (deferred layer) |

Net coverage: A covers 44 of 45 and misses #9. B leaves out #21, #24 and #45, and part of #4, #6 and #33. It sends all of them to on-demand "depth layers" and says so in its coverage block. That is transparent, but those ideas are still missing from the text.

## 2. Level-2.5 depth inventory

### Depth only in A (or much deeper in A)
1. ADC quantization: the derivation of e_rms = q/√12, SNR = 6.02N + 1.76 dB, and the uniform/independent assumption, with dither when it breaks. **Real**
2. SAR vs flash trade-off (2^N − 1 comparators, time vs hardware, pipeline as an intermediate base), plus a 16-bit DMM exercise and the dual-slope/sigma-delta answer. **Real**
3. Fixed vs floating point as "a unit that changes per number", with ULP near 10^15 = 0.125. B has a short version. **Partly real**
4. Meaningful digits of a physical length: the Si lattice constant gives 9.27 digits, so 6.7 digits of a double are meaningless. **Real**
5. Pressure as a count of wall impacts: flux nv̄/4 and δp/p = 1/√N for sensor area × time; kT/C noise; shot noise; the same 1/√N across domains. B has only the molecules-per-volume version. **Real**
6. Knudsen model: the λ formula with a units check, regime thresholds (0.01 / 0.1 / 10, slip, DSMC), HDD head at Kn 21.5, MEMS. B gives Kn ≪ 1 only. **Real**
7. Heat equation and Navier–Stokes: Fourier's law needs many collisions; phonon mean free path vs transistor size; infinite propagation speed and Cattaneo; Boltzmann as the parent model. **Real**
8. Three discretization budgets (sampling, time step, quantization). Explicit stability: halving Δx costs ×8/×16/×32. Balance the budgets. FIR as discrete convolution. **Real**
9. Crystallography practitioner facts: diamond/FCC/BCC 3D scene; piezoelectricity needs no inversion centre (quartz oscillators). **Real**
10. Quasicrystal as a projection of a 6D lattice ("the abstraction was extended one dimension up"); Pauling. **Real, moderate**
11. 2-adic count, giving √n rational iff n is a square (worked out), and a fake proof that √4 is irrational. B states the factor-count idea in one line and mentions √3. **Real**
12. Babylonian Newton iteration 3/2 → 17/12 → 577/408, quadratic convergence. **Real, small**
13. Patriot as a full spine: GAO numbers, Skeel analysis, a "just use double" critique with three failures (float32, 787 at 248.55 days, Win95 at 49.7 days), and the rule "when does the representation run out?". B has the core. **Partly real** (787/Win95 add the overflow-vs-precision distinction)
14. "Is the heat equation wrong?": a model is valid inside its assumptions; continuum as the limit of the discrete model. **Real**
15. "Today" block: bf16/FP8/FP4/MX, ENOB from (8), jitter SNR 60.5 dB, optical clocks and GR at 1 cm, helium HDDs. B's version is short. **Mostly practitioner depth**
16. Footnote material (geometric algebra, Descartes, square/cube), Zeno, union of theories (geometry of numbers linked to Fedorov's lattice). **Source depth**

### Depth only in B (or much deeper in B)
1. Formal definitions before examples: body/figure, commensurable (with an iff proof of "commensurable ⇔ rational ratio"), real number. **Real (rigour)**
2. A-series paper: r² = 2 realised as 99/70 and 41/29. **Real practitioner/cross-domain**
3. Hidden assumption in an empirical rule: Edfu quadrilateral formula, with a 60° rhombus +15.5% and a trapezoid +9.1%. **Real**
4. Lobachevsky 1829 and Beltrami 1868 consistency: the parallel axiom is a choice experience cannot settle. **Real**
5. Cone outer-radius vs midpoint: 1/n vs 1/n² error, 151 vs 5 layers; the Democritus dilemma (equal or unequal adjacent layers). A has the outer-radius version and only names the midpoint rule. **Real**
6. Exact inequality form of the √2 bound and when the approximation fails (q = 2: 3%). **Real**
7. A measurement to 10⁻⁹ cannot prove irrationality: the minimum denominator is 18803, and 47321/33461 fits. A says this only qualitatively. **Real**
8. Mils: 6400 vs 6000, −1.8% vs +4.7%, divisibility trade-off. **Real trade-off**
9. Spherical-Earth limit of step 1 in numbers (1411.3 km, −0.21%; 100 km gives 0.002%), and what exactly fails. A is qualitative. **Real**
10. Critique of `x*x == 2`: every float is rational, so by (1) it never holds. **Real practitioner**
11. Signals domain: two flashers resynchronise iff the ratio is rational, with misses at convergents; fieldmap with Lissajous and the Pythagorean comma 3^12 ≠ 2^19. **Real cross-domain**
12. Archimedean property as the hidden assumption of measurement step 1; an actual infinitesimal breaks it, while Newton's variable keeps it. **Real**
13. Digit-wise addition is not computable (0.333… + 0.666…); addition is a limit of shrinking intervals. **Real**
14. Truncation Nε/2 vs rounding ε√(N/12); Vancouver index (524.811 vs 1098.892); multiplication error (|a| + |b|)·10⁻ᵏ, so the natural error is relative. A has Nε vs √N·ε without the case or the multiplication part. **Real**
15. Rational iff eventually periodic, both directions. A has the 0.1 case via pigeonhole and a general remark. **Partly real**
16. Euclid I.1 needs continuity: in a rational plane the circles do not meet; Hilbert 1899. **Real (strong hidden-assumption result)**
17. Rationals have measure zero; uncountability (Cantor 1874). **Real**
18. Torricelli's indivisibles paradox (horizontal vs vertical lines). A gives only the "sum of zeros" objection. **Real**
19. Critique of Kolmogorov's "still far from complete": categoricity of a complete ordered Archimedean field; CH independent (Gödel 1940, Cohen 1963). **Real**
20. Ariane 5 overflow. A uses 787/Win95 for the same lesson. **Equivalent**
21. Babylonian YBC 7289 as truncation in base 60 (1;24,51,10,7,46), error 8x smaller than the last digit. Both have YBC; B adds the next digits. **Small**

### Non-essential differences
- A's Dhahran story opening vs B's A4 story opening. Both are hooks.
- A's animation and 3D scenes vs B's tables and charts.
- A's broader "today" block.
- A's links to the course (seL4, Zhukovsky, notebook ideas).
- B's long errata list (spelling).

## 3. Exam questions

### 20 questions from A. Can B alone answer them?
1. Why is 1/10 non-terminating in base 2 and 1/3 terminating in base 60? **Yes** (B gives the base-2/5 rule; the base-60 case follows)
2. Derive the crystallographic restriction from the trace. Where does periodicity enter? **Yes**
3. Geometric two-point argument against order 5 (0.382a). **Yes**
4. Why doesn't Shechtman refute the theorem, and what model replaced periodicity? **Partly** (no 6D projection)
5. Which symmetry property permits piezoelectricity, and why does it matter for clocks? **No**
6. Prove √n is irrational iff n is not a square, by counting factors of 2/p. **Partly**
7. Anthyphairesis on the square: why does the remainder ratio repeat, and what is the continued fraction? **Yes**
8. Babylonian iteration: what sequence does it give, and how fast does it converge? **No**
9. Patriot: derive 0.3433 s, 575 m, and the 8-hour value. **Yes**
10. Explain the 687 m vs 575 m discrepancy. **Yes**
11. Why would consistent truncation have cancelled, and how large would the residual be? **Yes**
12. Derive q²/12 and SNR = 6.02N + 1.76. Which assumption is used, and when does dither help? **No**
13. 16-bit DMM: SAR or flash? Use comparator count, offset relative to the LSB, and latency. **No**
14. Why does a float32 counter with += 0.1 stop at 24.3 days? **Yes**
15. Distinguish integer overflow (787, Win95) from precision loss. Would double help? **Partly** (Ariane only)
16. How many decimal digits of a 1 m length are physically meaningful? **No**
17. Pressure-sensor fluctuation for 1 µm² over 1 µs; kT/C on 1 fF; shot noise at 1 mA. **Partly**
18. Kn regimes and thresholds; is a 10 µm channel at 0.1 atm continuum? **Partly**
19. Why does Fourier's law fail in a modern transistor, and what replaces it? **No**
20. Explicit 3D heat simulation: what does halving Δx cost, and how do you balance three error budgets? **No**

Tally: Yes 8, Partly 5, No 7.

### 20 questions from B. Can A alone answer them?
1. Why must A-paper have r² = 2, and how close are A4 and A0 to it? **No**
2. Edfu rule: what is the hidden assumption, and what is the error on a 60° rhombus? **No**
3. Is the parallel axiom forced by experience? (Lobachevsky, Beltrami) **No**
4. Prove "commensurable ⇔ rational ratio" from the formal definition. **Partly**
5. Cone with outer vs midpoint radius: error order, and n for 1%. **Yes** (orders given; the n follows)
6. Democritus' dilemma about adjacent layers. **No**
7. What does "take it reduced" rest on: well-ordering or unique factorisation? **Yes**
8. Can a 10⁻⁹ measurement show irrationality? What is the minimum q? **Partly**
9. Exact vs approximate form of the √2 bound; how large is the error at q = 2? **Partly**
10. Mils 6400 vs 6000: errors and what each choice buys. **No**
11. Spherical right triangle with 1000 km legs: ratio, and what fails? **Partly** (qualitative)
12. Why is `x*x == 2` false for every float? **No**
13. When do two flashers with period ratio √2 resynchronise, and what are the misses at convergents? **No**
14. What hidden property does measurement step 1 need, and what breaks it? **No**
15. Can you compute the digits of a + b left to right? **No**
16. Truncation vs rounding error growth; Vancouver index. **Partly**
17. Error bound for multiplication of truncated reals; why it is relative. **No**
18. What hidden assumption does Euclid I.1 use, and what is the counterexample? **No**
19. Measure of the rationals in [0,1]; can [0,1] be listed? **No**
20. Is "the real number concept is still far from complete" still true? (categoricity, CH) **Partly**

Tally: Yes 2, Partly 6, No 12.

B's unique depth is denser per word and sits closer to the source's core (number, continuity, hidden axioms). A's unique depth sits in engineering applications (ADC, rarefied gas, heat transfer, discretization).

## 4. Numerical checks (recomputed in Python)

**A, all correct:**
- π of Ahmes 256/81 = 3.1605 (+0.60%); (4/3)π = 4.18879; inscribed octahedron 4/3.
- 2cos72° = 0.618; 2cos45° = 1.414; distance 0.382a.
- 372 = 101110100₂; 93² = 10000111001001₂; 2·93² = 100001110010010₂.
- YBC 7289 = 1.41421296 (error −5.99e−7); 1/216000 = 4.6e−6.
- Error of 99/70 = 7.2e−5; error of 577/408 = 2.124e−6, matching (3).
- ε for double 2.2e−16; 15.95 digits; float32 1.19e−7.
- ADC: 0.806 mV, 0.233 mV; SNR 74.0, 98.1 and 146.2 dB.
- 838860/2²³ = 0.0999999046; δ = 9.537e−8; 0.3433 s; 0.0275 s; 575 m; 46 m; 687/0.3433 = 2001; 1.6 mm.
- 2²¹ s = 24.27 days; 2³¹ cs = 248.55 days; 2³² ms = 49.7 days.
- Si 10^9.27 and 6.7 digits.
- n = 2.55e25; v̄ = 459 m/s (288 K) and 467 m/s (298 K); flux 2.92e27; N = 2.92e18 → 5.8e−10; N = 2.92e9 → 1.8e−5.
- 6242 electrons; kT/C 2.0 mV; shot noise 17.9 nA.
- λ = 64.5 nm and 0.14 m; Kn = 21.5, 0.032, 0.00645, 0.0645, 32 (2 nm).
- Cone (12): 0.385, 0.33835, 0.33383, 0.351 (n = 30), gap 0.0084 (n = 60).
- 1.41 Mbit/s; heat-equation cost ×8/×16/×32.
- 20-hour exercise: 0.0687 s and 115 m; LSB 76.3 µV; Unix-epoch ULP 2.38e−7 s; 2⁶⁴ as = 18.4 s; 2⁶⁴ ns = 585 years.
- bf16 7.8e−3; FP16 9.8e−4; E4M3 0.125; E5M2 0.25; E2M1 0.5; ENOB 9.7; jitter 60.5 dB → 9.8 bits.

**A, problems:**
1. Line 144: "השברים המתכנסים: 7/5, 17/12, 41/29, 99/70, 577/408" skips 239/169 while reading as the consecutive list. Minor.
2. Line 43: the Rhind papyrus is said to be "usually dated to the 17th c. BCE". The usual dating is about 1550 BCE as a copy of a text from about 1850 BCE. The claim is hedged as medium certainty. Minor.

No real numerical errors in A.

**B, all correct:**
- 297/210 = 99/70 (+0.005%); 1189/841 = 41/29 (−0.029%); 210/148 (+0.33%).
- Babylonian π 3.125 (−0.53%).
- Edfu: 86.6 → +15.5%; trapezoid 36.66 → +9.1%.
- Cone: 15.5% at n = 10; 151 layers for 1%; 5 layers with the midpoint rule.
- Exercise: 1501 and 16 layers for 0.1%, ratio 94.
- q = 2 approximation 3%; 0.35/q²; 18803; 47321/33461 error 3.16e−10.
- Table ratio about 5.83.
- Mils: 6283.19; 0.982 (−1.8%) and 1.047 (+4.7%); 6400 = 2⁸·25.
- Sphere: 1411.30 km, −0.206%; 100 km legs give −0.002%.
- Base 60: 1;24,51,10,7,46; YBC 7.7x the last digit.
- Flashers: misses 7%, 2.9% and 0.5%; 3¹² ≠ 2¹⁹.
- 24 bits = 7.2 digits.
- Truncation 0.5; rounding expectation 2.9e−4; chart ratios 17 and 170.
- Vancouver 574 points, about 1.2 per day.
- Multiplication: actual 1.055e−3, bound 2.83e−3.
- 2²⁴·0.1 s = 19.4 days; float32 += 0.1 gives 3601.16 after 1 hour and 347,024.8 after 100 hours (simulated, matches).
- Patriot 0.3433 s, 575 m, 0.027 s / 46 m, 2001, 1.6 mm.
- 6.24e9 electrons per second; Kn 6.5e−9 and 0.065; λ(100 km) 0.14 m.
- Molecule counts 2.5e7 → 2e−4 and 25 → 20%.
- 1393/985 error 3.64e−7, equal to the bound; −604; 2.14e−4.
- float32 += 0.01 stops at 2¹⁸ s = 3.03 days; 22% slowdown; 3603.20 after 1 hour and 85,055.9 after 1 day (simulated, matches).
- 584 years.

**B, problems:**
1. Line 270 says "סטיית התקן … באותה סימולציה 4.6·10⁻⁴ מול צפי של 2.9·10⁻⁴". One simulation run cannot give a standard deviation. 4.6e−4 is a single realization at about 1.6σ, and calling it the std is misleading. Minor.

No real numerical errors in B.

## 5. Pedagogy (strong adult, weaker formal math)

| Criterion | A | B |
|---|---|---|
| Definition before example | Mostly in prose; incommensurable is defined before use; the real number is defined inside running text | Strong: formal `definition` blocks, then "איך זה בנוי", then a separate example, consistently |
| Key result vs illustration | Key results marked ("תוצאה מרכזית א/ב/ג"), but buried in long paragraphs. Engineering blocks are partly illustration and partly key result | `formula` blocks and a `keep` summary separate what to remember; tangents (mils, music, Vancouver) are clearly side items |
| One thread | Strong narrative spine (Patriot → "error that is bounded but not bounded by anyone"), carried through three key results (machine / world / grid) | Thread question per part ("can integers give the ratio exactly?", "which number, and how to compute with it?"); more episodic |
| Commit before reveal | `think` blocks are open questions with reveals; no forced commitment | MCQs with "התחייבו לפני שתפתחו" and "נחשו, ואז גזרו": real commitment |
| Cognitive load | Very high: long dense paragraphs, ADC + Kn + heat + discretization + "today" in one lesson; many forward references | High but chunked: short labelled paragraphs, tooltips for terms ([[מונח]]); some paragraphs are telegraphic and over-compressed |
| Engagement | Dhahran story, animation, two 3D scenes, chart, rich case study | A4 hook, tables, charts, MCQs, crisp critiques |
| Length vs value | About 1.9x longer. Its extra length buys real engineering depth, but also restated source prose and many course links | Higher depth per word. Defers several source passages to on-demand layers |

## 6. Verdict

**Under a strict "no loss of real depth" rule, both texts lose real depth relative to the other.**

**What B loses relative to A:**
- The ADC quantization noise derivation (q²/12, 6.02N + 1.76 dB, dither).
- The SAR vs flash trade-off.
- Knudsen regime thresholds and the λ formula.
- Fourier's law and heat-equation breakdown (phonons, Cattaneo, Boltzmann as the limit model).
- The three discretization budgets and the cost scaling of explicit stability.
- Meaningful digits of a physical length.
- Wall-flux pressure fluctuation, kT/C and shot noise.
- The piezoelectricity/symmetry practitioner fact; quasicrystals as a 6D projection.
- The √n generalization; the Babylonian Newton iteration; the overflow-vs-precision distinction (787/Win95).
- Source content: Zeno, the square/cube footnote on geometric algebra, the catalogue of unified theories, and the Eudemus quote.

**What A loses relative to B:**
- Formal definitions, including the commensurable ⇔ rational proof.
- The Edfu hidden-assumption case.
- Non-Euclidean consistency: the parallel axiom is a choice.
- The Archimedean property as the hidden assumption of measurement.
- Non-computability of digit-wise addition.
- The multiplication error bound and why error is relative.
- Euclid I.1's hidden continuity and Hilbert's axiom.
- Measure zero of the rationals and uncountability.
- Categoricity and CH as a critique of Kolmogorov's "incomplete".
- Torricelli's paradox and the Democritus layer dilemma.
- Quantified "measurement cannot prove irrationality" (18803).
- Exact vs approximate form of the √2 bound.
- The mils trade-off; the `x*x == 2` critique; the flashers/Lissajous/comma cross-domain map; the Vancouver index case.
- Source point #9: geometry vs astronomy/geodesy.

**Better overall:** B, narrowly. It answers more of A's hard questions (8 yes + 5 partly) than A answers of B's (2 yes + 6 partly). Its added depth sits on this source's own subject: number, continuity and the hidden axioms of measurement. Its pedagogy is also clearly better: definitions first, real commit-before-reveal, a `keep` summary, and chunked reading. A is the stronger engineering-application lesson, with an excellent single narrative thread. But it is about 1.9x longer, denser, and weaker on mathematical rigour and on the hidden-assumption analysis.

**Is B's brevity free?** No. Part of it is free: A restates source prose and links widely to the course. But B also drops a real block of engineering depth (ADC, Kn regimes, heat-equation limits, discretization budgets, physical-digit limits) and four source passages it pushes to optional layers.

**Recommendation:** use B as the base. Port A's quantization/SNR derivation, its Kn regime thresholds with the heat-equation limit, the discretization-budget trade-off, and the Si-digits estimate. Restore Zeno, the square/cube footnote and the union-of-theories paragraph inline, briefly.
