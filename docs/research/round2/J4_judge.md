# J4 blind judge: text_A vs text_B (K1:29–44, §3 Geometry, §4 Arithmetic and geometry)

Size: A has about 14,000 words in **one** lesson (lesson 2 of 4), with 4 think blocks, 5 exercises and 0 `definition` blocks. B has about 7,560 words in **two** lessons (lessons 2–3 of 3), with 11 think blocks, 8 exercises and 12 `definition` blocks. (`wc -w` undercounts Hebrew, so the counts come from Python `split()`.)

---

## 1. Coverage vs the source

| # | Source idea (page) | A | B |
|---|---|---|---|
| 1 | End of §2: practice and abstraction interact, abstraction runs ahead of need (million, imaginary numbers) (29) | yes ("גשר" bridge section) | yes (one sentence, in the Fedorov paragraph) |
| 2 | Form abstracted from manufacture: bowstring, pottery, thousands of straight edges (29–30) | yes, full | yes, brief |
| 3 | Rectangle area, the farmer (30) | yes | yes |
| 4 | Eudemus quote, Nile, ge-metron (30) | yes (paraphrased) | partly (Nile and the etymology only; Eudemus deferred to a "depth layer") |
| 5 | Ahmes manual, 1700 BC: containers, land, earthworks (30–31) | yes, plus a history block on the Rhind π | no (deferred) |
| 6 | Egypt/Babylon: empirical rules, no proofs, not separated from arithmetic, π (31) | yes | yes, plus the Babylonian 25/8 |
| 7 | Greece, 7th century BC: Thales, Democritus, Pythagoreans (31) | yes | partly (no names) |
| 8 | Relations become deductions, giving theorem/proof and axioms (31) | yes | yes (formal definition block) |
| 9 | Euclid until Lobachevsky, Kiselev and school texts (31–32) | yes | partly (Lobachevsky expanded; school-text lineage deferred) |
| 10 | Geometric body vs figure, dimensions, point (32) | yes (prose) | yes (definition block) |
| 11 | Geometry vs astronomy, geodesy, crystallography (32) | **no** | yes |
| 12 | No experiments on breadthless lines, so proof only (32) | yes | yes |
| 13 | Axioms from experience: two points, superposition/congruence (32–33) | yes | yes |
| 14 | Generality: sphere volume 4/3πR³, users of geometry (33) | yes (plus erratum and limit check) | yes (plus π/6 fill fraction) |
| 15 | Fedorov, 230 symmetries, practice and abstraction (33) | yes, **much deeper** (crystallographic restriction, Shechtman) | yes, brief |
| 16 | §4.1 measuring is geometric laying plus arithmetic counting; steps, liquid, pendulum (34) | yes | yes (no pacing example) |
| 17 | Fractions arise from measurement, not from dividing integers; arrow (34–35) | yes | yes |
| 18 | Incommensurability defined (35) | yes (prose) | yes (formal definition plus equivalence proof) |
| 19 | Democritus' atoms, cone, prototype of the integral (35) | yes, and the cone is **computed** later | yes (mention; computation deferred) |
| 20 | Atoms vs Pythagoras (35) | yes (explicit argument) | yes (think block) |
| 21 | Proof that √2 is irrational (35–36) | yes (6 steps plus assumption audit) | yes (6 steps plus assumption tags) |
| 22 | Greek shock, no √2 symbol, "not a number" (36) | yes | yes |
| 23 | Paradox of continuity, Zeno (36) | yes | partly (paradox yes; Zeno listed as "not learned") |
| 24 | Eudoxus' theory of ratios (36) | yes (definition, link to Dedekind) | yes (same) |
| 25 | Footnote: geometry engulfs algebra, quadratics, Descartes, "square/cube" (36–37) | yes | yes |
| 26 | East, then the 1870s (Weierstrass, Dedekind, Cantor) (37) | yes | yes |
| 27 | Newton's definition of number (37) | yes (quoted) | partly (content without the attribution) |
| 28 | Reals only as a system; operations reflect magnitudes; continuity; wide application (37–38) | yes | yes |
| 29 | Fig. 1, decimal measurement protocol (38–39) | yes (formula, animation, erratum) | yes (formula, derivation with assumptions, digit proof) |
| 30 | Footnote on trailing nines (39) | yes | yes |
| 31 | Addition via truncation, 2 millionths (39) | yes (eq. 5, plus a hidden-assumption audit) | yes (plus a think block and **multiplication error**) |
| 32 | Order: a>b iff a=b+c (39) | yes (erratum) | yes |
| 33 | Continuity, nested sequences, Fig. 2 (39–40) | yes (failure in Q, uniqueness) | yes (failure in Q, uniqueness) |
| 34 | §4.4 no exact value: atoms, gas pressure, electron charge (40) | yes, **quantified** (Si lattice, 1/√N, kT/C, shot noise, Knudsen) | yes, quantified (D≈log10(L/q), D/2, current, pressure) |
| 35 | Incommensurability is a theoretical conclusion; the limit vanishes under abstraction (41) | yes | yes |
| 36 | Check applicability; continuum only if atoms can be ignored (41) | yes | yes |
| 37 | Reals reliable but not absolute; concept still developing (41–42) | yes | partly (reliability yes; "not absolute / still developing" missing) |
| 38 | §4.5 grandmother and mashed potatoes; discrete vs continuous aspects (42) | yes | yes (definition) |
| 39 | Unit vs line; measurement unites them (42–43) | yes | yes |
| 40 | Democritus → incommensurables → indivisibles (Fig. 3) → Newton, limits → 1870s sets → difficulties (43–44) | yes, detailed (and explains *why* indivisibles fail) | yes (compact history block plus Fig. 3 note) |
| 41 | §4.6 negatives, complex numbers via geometry, vectors, tensors, union of theories, analytic number theory and geometry of numbers (44) | yes (plus a lattice callback) | yes (plus Wessel, Argand and Gauss dates, vector definition) |
| 42 | Figures 1–3 | all | all |

Net: A misses one item (11) and treats none of the others thinly. B misses or defers 5, 7, 9 (partly), 23, 27 (partly) and 37 (partly). B says so honestly in its `coverage` block and offers "depth layers on request." **Source coverage: A > B by a small margin.**

---

## 2. Level-2.5 depth inventory

### A (testable ideas)
1. Abstraction ladder: body, then figure, then point. No experiment is possible, so proof is necessary.
2. Ahmes π = (16/9)² = 256/81, +0.60%: an empirical rule with no theorem.
3. Sphere-volume erratum checked by dimensional analysis and bounds (octahedron 4/3 < 4.19 < cube 8).
4. **Crystallographic restriction**: the trace of a lattice rotation is an integer, so 2cosθ ∈ {−2…2} and only orders 1, 2, 3, 4, 6 are possible. Where the assumption enters: the word "integer" comes from periodicity.
5. A geometric version (rotate two nearest lattice points by 72°, distance 0.382a < a).
6. Crystal structures (diamond, FCC, BCC): coordination 4/12/8, shared cubic symmetry; piezoelectricity needs no inversion centre.
7. **Shechtman, quasicrystals**: the theorem is intact and the hidden assumption (periodicity) breaks. IUCr 1992 redefinition, 6-D projection. The model is extended, not discarded.
8. Atomism implies every two segments are commensurable (the atom is a common measure).
9. The √2 proof, with three assumptions located: Pythagoras/parallel postulate (step 1), **well-ordering** (step 2), parity (step 4). It does **not** need unique factorization.
10. Structure: 2-adic valuation parity (binary trailing zeros), generalized to √n.
11. Infinite descent; descent and "take the reduced fraction" are the same argument; it fails in Q⁺ because Q⁺ is not well-ordered.
12. Anthyphairesis / continued fraction [1;2,2,2…], convergents.
13. YBC 7289: 1;24,51,10 = 1.41421296, error −6.0e−7 against a resolution of 4.6e−6.
14. **Eq. (3)**: |p/q−√2| ≈ 1/(2√2 q²). The integer numerator is never 0, which gives a **lower bound for every fraction** (the proof read quantitatively).
15. Babylonian/Newton iteration 3/2 → 17/12 → 577/408, with correct digits doubling each step.
16. Eudoxus' definition ≈ Dedekind cut.
17. Geometry engulfs algebra: application of areas, x²+ax=b².
18. The real number as an indefinitely refinable measurement; decimal protocol (4) with error bound 10⁻ᵏ.
19. Animation exposes the double-precision limit at k≈16 (√2·10¹⁶ > 2⁵³).
20. Addition by truncation (5). **Hidden assumption**: you can always re-truncate further. A machine truncates once, so error after N additions is N times the per-step error.
21. Nested intervals (6) fail in Q; (4) and (6) are the same object.
22. 0.1 in binary: periodic by pigeonhole (at most 10 remainders); terminates only if the denominator's primes divide the base.
23. double/float ε, digit counts (15.95 / 7.2).
24. **Quantization**: e_rms = q/√12 derived from a uniform-error assumption; SNR = 6.02N+1.76 dB; dither when the assumption breaks.
25. Nε vs √Nε (systematic vs random accumulation).
26. SAR = Fig. 1 in base 2; flash = unary with 2ᴺ−1 comparators; pipeline in between (time vs hardware trade-off).
27. Fixed vs floating point (range vs uniform precision). Design rule: time counters are integers; convert only differences.
28. **Patriot** quantified: 838860/2²³, δ = 9.537e−8 s, 0.3433 s, 575 m. The GAO 687 m discrepancy is flagged. The **differencing/cancellation mechanism** (partial fix made the error non-cancelling) is explained, plus a think block computing the 1.6 mm counterfactual.
29. Critique of "just use double": float32 counter stalls at 2²¹ s (24.3 days); Boeing 787 at 248.55 days; Windows 95 at 49.7 days. The test is "when does the representation run out?"
30. Shared structure: INS drift, local vs global integration error, bias vs noise.
31. Length: Si lattice gives 9.27 meaningful digits, and double wastes 6.7.
32. Pressure: n, v̄, flux; δp/p ≈ 1/√N on a diaphragm vs on 1 µm².
33. Charge: 1 fF holds 6242 e; kT/C noise 2.0 mV; shot noise √(2qIB), 17.9 nA.
34. **Knudsen number**: λ formula with a unit check; continuum, slip, transition and free-molecular regimes; HDD head, MEMS, re-entry at 100 km.
35. Heat equation and Navier–Stokes: two assumptions (control volume, Fourier/Newton flux law). Phonon mean free path breaks them; ballistic transport.
36. Heat equation predicts infinite propagation speed (Cattaneo). The continuum model is the Kn→0 limit of Boltzmann, not its contradiction.
37. Discrete/continuous history as a pendulum, where each winner's cost appears one level up. A also says *why* indivisibles fail (a sum of zero-width lines).
38. **Democritus' cone computed**: Σk²/n³ = 1/3 + 1/(2n) + 1/(6n²), error O(1/n), midpoint rule O(1/n²).
39. Shared structure: Riemann sums, finite differences, FIR (13).
40. Three discretizations (sampling/Nyquist, time step, quantization), each with its own error budget. Explicit-scheme stability makes cost grow 8×, 16× and 32× when Δx is halved; balance the budgets.
41. Today: bfloat16, FP8, FP4, MX scaling; ENOB = (SINAD−1.76)/6.02; jitter-limited SNR; optical clocks and gravitational shift; HDD heads in the free-molecular regime.
42. Exercises: SAR vs flash at 16 bits; optical clock timestamps in double (relative vs absolute ε, 2⁻²² s at 1.8e9 s); fake √4 proof; Kn for a 10 µm channel.

### B (testable ideas)
1. Formal definitions: geometric body and figure; axiom and theorem ("a theorem holds exactly where its axioms hold").
2. Lobachevsky (1829) as the limit of experience-derived axioms.
3. Egypt 256/81 (+0.60%) vs Babylon 25/8 (−0.53%).
4. Geometry vs astronomy, geodesy, crystallography.
5. Sphere fills π/6 ≈ 0.52 of its bounding cube.
6. Definition of measurement (n·e ≤ a < (n+1)e; assumes the count is finite).
7. Definition of a rational number, including equality ps=qr.
8. **Definition of commensurable, with a proof that it is equivalent to a rational ratio.**
9. Think block: atomism implies everything is commensurable, so one counterexample kills it.
10. Definition of proof by contradiction, relying on the excluded middle.
11. Think block: p² even implies p even.
12. √2 proof with assumption tags (Euclidean plane, reducibility, parity).
13. Structure: counting factors of 2 via unique factorization.
14. Think block: √3 yes, √4 no (the factor count is even on both sides).
15. Limit: √n is irrational iff n is not a perfect square; Pythagoras fails on a sphere.
16. Mental √2 by a Newton correction (1.4 + 0.04/2.8), error 0.005%.
17. Pell solutions; eq. (2) error ≈ 0.35/q²; computed table with sign alternation and ×6 per row.
18. **Think block plus exercise: a finite measurement cannot decide rationality** (a denominator around 19,000 suffices for 10⁻⁹).
19. Incommensurability is a property of the model, not of a measurement.
20. Trade-off: accuracy vs denominator size (gears 99/70 vs 41/29); the 3-4-5 rope sidesteps the problem.
21. Python: sqrt(2)**2 ≠ 2; a double is a dyadic fraction.
22. Critique: (a) the source's elliptic "p² divisible by 4" step; (b) "irrational means unmeasurable"; (c) `x*x==2`.
23. Domain block (signals): commensurable periods resync at the LCM; the 99/70 near-resync; the analogy breaks because digital clocks are rational.
24. Domain block (computing): 0.1 is not dyadic (factor-5 count); 0.1+0.2.
25. Field map: Pythagorean comma (3¹² ≠ 2¹⁹ by parity; equal temperament −0.11%); synthesizers.
26. Eudoxus' definition, Dedekind 1872; the cost of bypassing number: algebra became geometry.
27. **ISO 216 case study**: (h/w)² = 2; A0 and A4 are exactly 41/29 and 99/70; A0 area 0.99995 m²; A5 rounding gives a 0.33% error, below the cutting tolerance.
28. Exercises: 50 m diagonal; tile "proof"; gear choice (why 58/41 is worse); bits needed for 0.1 (20).
29. Today: IEEE 754 error 2⁻⁵³, computer algebra, Wiedijk's 17 provers, 113-bit format.
30. Real number: descriptive definition, then formal definition (no trailing 9s, digit-wise equality).
31. Think block: **why each n_k is a digit**.
32. **Derivation of the decimal protocol with explicit assumptions** (finite count, i.e. Archimedean; infinite divisibility; exact endpoints).
33. **Terminating decimal iff q = 2ᵃ5ᵇ**; otherwise periodic (1/7); irrationals are non-periodic.
34. Base 10 is arbitrary.
35. Digit ≈ 3.32 bits; double ≈ 16 digits, float ≈ 7.
36. Addition error < 2·10⁻ᵏ (think block, with the π+√2 example 1.22e−6).
37. **Multiplication error ≈ |a|ε_b + |b|ε_a** (think block with a,b ≈ 1000).
38. Order via c>0; continuity definition; failure in Q via √2 truncations; uniqueness when widths go to 0.
39. Trade-off: every digit costs; JPL uses π to 15 digits (Voyager error about 1 cm).
40. Critique: "double gives 16 correct digits" (accumulation and cancellation).
41. **Fire-adjustment bracketing as base-2 nested intervals**; stop at about 50 m because the scatter is the grain.
42. Field map: binary search/bisection; SAR.
43. **Grain vs resolution definitions**; continuum model valid when δ ≫ q.
44. **D ≈ log10(L/q)** (derivation with assumptions); random grains give about D/2 stable digits.
45. Anchors: 1 m rod ≈ 10 digits (9.6 at 0.25 nm); 1 A = 6.24e18 e/s; nA·ns ≈ 6 e.
46. Trade-off continuous vs discrete (2.7e19 molecules/cm³). Practitioner facts: SI 2019 fixes e (the ampere is a count); a 1.2 nm gate oxide broke the continuum model.
47. Critique: a float return value does not make a 7-digit measurement; there is no universal grain (time).
48. Domain blocks: current as a count; pressure as a sum of impacts (15 digits, 7–8 stable). Field map: fluids (λ ≈ 66 nm), signals, computing.
49. Discrete/continuous definition; grandmother; history block; why indivisibles fail.
50. Complex numbers: Wessel 1799, Argand 1806, Gauss 1831; vector definition; tensor.
51. Patriot (think block, case study, chart): 9.54e−8, 0.343 s, 575 m, 46 m at 8 h; mixed old/new code did not cancel (one sentence).
52. Exercises: digits of a rangefinder and caliper; centisecond clock (47.5 s per day); pA vs mA sensor; 800 m bracket. Today: optical clocks, interval arithmetic (IEEE 1788), "24-bit" ADCs ≈ 20 effective bits.

### Diff: in A, not in B
**Real depth:** A4–A7 (crystallographic restriction, its proof and its assumption, Shechtman as a hidden assumption breaking; this is the best "limits/critique" example in either text). A9 (well-ordering as the assumption; FTA is not needed). A11 (descent ≡ reduction, failure in Q⁺). A12–A13 (anthyphairesis, YBC 7289). A14 (the lower bound for *all* fractions follows from the integer numerator). A20 (the hidden re-truncation assumption in (5), the link from definition to failure). A25 (Nε vs √Nε). A28 (Patriot differencing mechanism, quantified). A29 (counter overflow/stall cases plus the "when does it run out" test). A34 (Knudsen regimes). A38 (the Democritus cone actually computed, with error order). A40 (three discretization error budgets, stability cost).

**Lower-tier, practitioner or cross-domain depth that is legitimate but beyond the source:** A24 and A26–A27 (ADC SNR, SAR/flash, fixed vs float), A33 (kT/C, shot noise), A35–A36 (heat equation and Navier–Stokes, Cattaneo), A39 (FIR), A41 (bfloat16/FP8/FP4, ENOB, jitter).

**Non-essential:** A6 (FCC ductility, coordination numbers), the 3D scene captions, A19 (animation double-precision artifact), the HDD/helium detail, the meta "no web access" note in `today`.

### Diff: in B, not in A
**Real depth:** B8 (commensurable ⇔ rational *proved*). B18–B19 (a finite measurement cannot decide rationality, stated and exercised). B31–B32 (digit bound; the Archimedean "finite count" assumption made explicit). B33 (terminating-decimal criterion, periodic 1/7). B37 (multiplication error propagation, the one real gap in A's treatment of operations). B43–B44 (an explicit grain/resolution formula D ≈ log10(L/q) and D/2; A has the same numbers case by case but no general law). B1–B2 (theorem holds exactly where its axioms hold; Lobachevsky). B4 (astronomy/geodesy contrast, from the source).

**Moderate depth:** B27 (ISO 216: an irrational requirement realized by Pell fractions within tolerance; a very good level-2.5 case), B20 (gears/denominator trade-off), B41 (bisection with a noise floor, a good "stop when δ≈q" lesson), B25 (Pythagorean comma by parity).

**Non-essential:** B3 (Babylonian π), B5 (π/6), B23 signals blinkers, JPL π, Wessel/Argand/Gauss dates, Wiedijk.

---

## 3. Cross-examination

### 15 questions from A, answered from B alone
| # | Question | B |
|---|---|---|
| 1 | Prove that a periodic crystal admits only rotation orders 1, 2, 3, 4 and 6. Where does periodicity enter? | no |
| 2 | Did Shechtman refute the crystallographic theorem? What exactly broke, and how was "crystal" redefined? | no |
| 3 | Which property of the integers justifies "take the reduced fraction"? Why does the descent argument fail in Q⁺? | partly (reducibility named as an assumption; no well-ordering, no Q⁺ failure) |
| 4 | Does the √2 proof need unique prime factorization? | no (B's structure paragraph uses FTA) |
| 5 | Show that no p/q comes closer to √2 than about 1/(2.83q²). Why does the integer numerator give a *lower* bound? | partly (B has the approximation for Pell fractions, not the general bound) |
| 6 | Evaluate YBC 7289 (1;24,51,10) and its error relative to its last-digit resolution. | no |
| 7 | Run the anthyphairesis on side and diagonal. Why does it never stop? | no |
| 8 | Patriot: if both times had used the same truncated conversion, what would the error in a 1 s difference be? Why did the partial fix make things worse? | partly (one sentence that the errors did not cancel; no mechanism or number) |
| 9 | Distinguish Nε from √Nε accumulation and say which applied to Patriot. | partly (systematic linear accumulation yes; random √N appears only for grains) |
| 10 | Derive e_rms = q/√12 and SNR = 6.02N+1.76 dB. Which assumption breaks for small signals? | no |
| 11 | Fixed vs floating point: which suits a time counter and why? | no |
| 12 | When does a float32 counter incremented by 0.1 stall, and why? | no |
| 13 | Compute Kn for a 10 µm air channel at 1 atm and at 0.1 atm, and name the regimes. | partly (λ ≈ 66 nm and "continuum fails in tiny channels"; no Kn regimes) |
| 14 | Compute Democritus' stepped cone volume and its error order. How do you get O(1/n²)? | no (deferred) |
| 15 | Name three discretization errors and how each scales in cost. Why balance them? | no |

Score: B answers 0 fully, 5 partly and 10 not at all.

### 15 questions from B, answered from A alone
| # | Question | A |
|---|---|---|
| 1 | Define commensurable and prove it is equivalent to a rational ratio. | partly (equivalence stated, not proved) |
| 2 | Why must each n_k be a digit 0–9? | yes (the nines paragraph: "once nine hundredths fit, a tenth fits") |
| 3 | List the assumptions behind the decimal measurement protocol (finite count, infinite divisibility, exact endpoints). | partly (no Archimedean/finite-count assumption) |
| 4 | When does p/q give a terminating decimal? | yes (prime factors of the denominator must divide the base) |
| 5 | a,b ≈ 1000, each known to 10⁻⁶: how accurate is ab? | no |
| 6 | Can a 10⁻⁹ instrument decide whether a ratio is rational? | partly (implied by eq. 3 and §4.4; never stated or computed) |
| 7 | Why do A-series paper sizes need √2? Which fractions does ISO 216 use, and why is A5 off by 0.33%? | no |
| 8 | Choose a gear ratio for √2 within 0.01% using at most 100 teeth. Why is 58/41 no better than 41/29? | no |
| 9 | Why can 12 pure fifths never equal 7 octaves? | no |
| 10 | When do two periodic signals resync? | no |
| 11 | How many meaningful digits does a 1 m steel rod have? When do random grains halve that? | partly (Si 9.27 digits and 1/√N, but no general D formula) |
| 12 | Fire-adjustment bracketing: how many rounds from 800 m to 50 m, and why stop there? | partly (SAR as bisection; no noise-floor stopping rule) |
| 13 | Why is c unique when b_n − a_n → 0? | yes |
| 14 | "A theorem holds exactly where its axioms hold": give the Lobachevsky example. | partly (Pythagoras and the parallel postulate on a sphere; Lobachevsky only historical) |
| 15 | How does geometry differ from geodesy or astronomy? | no |

Score: A answers 3 fully, 6 partly and 6 not at all.

The asymmetry is clear. B misses about 10 of A's ideas outright. A misses about 6 of B's, and roughly 3 of those (music, signals, ISO 216) are illustrations rather than core ideas.

---

## 4. Numbers recomputed in Python

**A** (about 80 values checked). All correct except:
- `scene3d` Democritus caption: "ב-n=30 הוא 0.351". The correct value is (31·61)/(6·900) = **0.3502**. Minor.
- §4.2: the convergent list "7/5, 17/12, 41/29, 99/70, 577/408, וכן הלאה" **skips 239/169** while presenting the list as the convergents. Minor.
- Everything else matched, including Ahmes (+0.60%), 2cos(2π/n), 0.382a, binary 372 / 93² / 2·93², YBC (−5.99e−7, 4.63e−6), 99/70 (7.2e−5), 577/408 (2.124e−6), the Patriot figures (0.0999999046, 9.537e−8, 0.3433 s, 575 m, 0.0275 s, 46 m, 2001 m/s, 1.19, 1.6 mm), ε and digit counts, the ADC values (0.806 mV, 0.233 mV, 74.0 / 98.1 / 146.2 dB), Nε and √Nε, 24.3 days, 248.55 days, 49.7 days, the spacing 0.25 / 0.125, Si 9.27 / 6.7, n = 2.55e25, v̄ = 459 / 467 m/s, the flux 2.92e27, N and 1/√N (5.8e−10, 1.8e−5), 6242 e, 2.0 mV, 17.9 nA, λ = 64.5 nm / 0.14 m, Kn = 21.5 / 0.032 / 0.00645 / 32, the cone sums (0.385, 0.33835, 0.33383; errors 0.0517 / 0.00502 / 0.000500), 1.41 Mbit/s, 0.0687 s and 115 m, 76.3 µV, 2⁻²² = 2.38e−7, 18.4 s and 585 years, bfloat16 / FP16 / FP8 / FP4 ε, ENOB 9.7, jitter 60.5 dB.

**B** (about 60 values checked). No numerical errors found. Babylon −0.53%, π/6, 1.41429 (0.005%), 7/5 (−1.0%), 99/70 (+0.0051%), the ×6 table ratio, 18,708 ≈ 19,000, 0.00505 T₁, 3¹² vs 2¹⁹, −0.113%, A0 = 41/29 exactly, 0.99995 m², A5 0.33%, 148.49, 70.711 (0.015%), 1.44e−6 vs 3.5e−6, 58/41 (+0.030%), 2⁻²⁰, π+√2 truncation 1.22e−6, Voyager ≈ 1 cm, 9.6 digits, 6.24 e, 2.9e15 impacts (15.5 digits), log10 5000 = 3.70, log10 15000 = 4.18, 0.01 at 16 bits gives 5.49e−6 per tick and 47.46 s per day ("≈47.5"), √6/6 = 40%, 2.7e19 molecules, Patriot values.

One historical overstatement in B: "ב-1829 הראה לובצ'בסקי ש… גאומטריה עקבית". Relative consistency came later (Beltrami 1868).

---

## 5. Pedagogy (strong adult, weaker formal math)

- **Definition before example.** B is far better: 12 explicit `definition` blocks, each placed before its use (measurement, rational, commensurable, contradiction, real number twice, continuity, grain/resolution). A has none. Its definitions are embedded in long prose paragraphs, and some arrive after the example; Kn, for instance, comes after the HDD numbers in the same block.
- **Key vs illustration.** B marks key claims with bold topic sentences, `keep` blocks and anchors, so the core and the decoration are easy to separate. In A the core (√2, the decimal protocol, continuity) is clear, but it is buried among large engineering excursions of similar visual weight (ADC SNR, Knudsen, heat equation, bfloat16).
- **Thread.** A is stronger. The Dhahran story opens the lesson, recurs at (5), comes back in a full case study and closes in the exercises; the three "central results" (machine error, world limit, grid error) form a real synthesis. B's thread is the square (field, tile, A4, gears), then digits and grain. It is coherent but more episodic, and Patriot is tacked onto the end of lesson 2's §4.6.
- **Commit-before-reveal.** B: 11 think blocks, almost all placed *before* the result they test (atoms, p² parity, √3/√4, the 10⁻⁹ instrument, A4, n_k digit, addition, multiplication, rationals continuity, rod digits, Patriot). This is very good. A: 4 think blocks, all deep but placed after the derivation they probe (order 5, unreduced fraction, Patriot differencing, heat equation "wrong?"). They are good reflection prompts but weak as predictions.
- **Cognitive load.** A at 14k words in one lesson, with about 13 numbered equations and excursions into quantization theory, kinetic theory, CFD regimes, numerical stability and ML number formats, is heavy for a learner with weaker formal math. Many concepts are used before they are taught (well-ordering, trace invariance, Poisson, Nyquist), with "we'll derive it in node X" deferrals. B splits the material into two lessons of about 3.8k words each, stays mostly within the source, and defers the derivations it skips (cone, √n generalization, Pell optimality) to explicit on-request "depth layers".
- **Engagement.** Both are high. A's Shechtman, Patriot forensics and float32 stall are memorable; B's ISO 216, gears, fire bracketing and the Pythagorean comma are concrete and close to the learner.
- **Length vs value.** B carries more source-relevant depth per word, about 1.6× A's density by my count. A's extra ~6.5k words buy real depth (section 2 lists about 12 high-value items), but a further 30–40% of A is engineering extension. That extension is useful for level 2.5's cross-domain and practitioner layers, yet not needed to master K1:29–44.

---

## 6. Verdict

**The shorter text (B) does lose real depth.** Exactly:
1. The crystallographic restriction (trace argument plus geometric argument) and where periodicity enters.
2. Shechtman and quasicrystals as the case of a hidden assumption breaking while the theorem survives.
3. Well-ordering as the assumption behind "reduce"; the fact that FTA is not needed; descent ≡ reduction; failure in Q⁺.
4. The general lower bound |p/q−√2| ≳ 1/(2√2q²) read off the integer numerator (B has it only for Pell fractions).
5. Anthyphairesis/continued fraction and YBC 7289.
6. The hidden re-truncation assumption in definition (5), the bridge from the textbook definition to the machine failure.
7. Nε vs √Nε accumulation.
8. The Patriot differencing/cancellation mechanism, quantified.
9. Counter stall/overflow cases and the "when does the representation run out" test.
10. Knudsen number and continuum regimes.
11. Democritus' cone computed, with error order.
12. Three discretization error budgets, with stability cost.

(Plus the lower-tier extensions: ADC q/√12 and 6.02N+1.76, fixed vs floating point, kT/C and shot noise, heat-equation validity.)

**The longer text (A) contains depth that B lacks, not only length.** But it also lacks some real depth that B has:
1. Commensurable ⇔ rational proved.
2. Finite measurement cannot decide rationality.
3. Multiplication error propagation.
4. The digit-bound proof and the Archimedean assumption in the decimal protocol.
5. The terminating-decimal criterion (A has only a partial version).
6. A general grain/resolution law D ≈ log10(L/q) with D/2 for random grains.
7. The theorem-holds-where-axioms-hold framing.
8. The astronomy/geodesy contrast (a source item).

The ISO 216 and gear trade-offs are strong illustrations, but not core.

**Which is better for a learner who must cover a huge syllabus with no loss of depth? A, narrowly, on depth; B clearly on pedagogy and efficiency.** Under a strict "no loss of depth" rule B fails: about 10 of 15 hard questions drawn from A are unanswerable from B. A fails a smaller and less central set: about 6 of 15, about half of them illustrations. A also covers the source more completely. A is not efficient, though. Its ~14k words carry about 30–40% engineering extension, few commit-before-reveal prompts and no definition-first structure, which is costly for this learner.

Recommended target: A's depth items 1–12 above, delivered in B's format (definition blocks first, think blocks before results, two lessons, `keep` summaries), plus B's items 1–6. The engineering extensions (ADC SNR, Kn regimes, ML number formats, heat equation) should be compressed to field-map lines with pointers to the nodes where they are derived.
