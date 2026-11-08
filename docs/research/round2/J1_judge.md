# J1: Blind judgment, two pairs of level-2.5 teaching texts

Files read: `blind/log_X.md` (657 words), `blind/log_Y.md` (389), `blind/lagrange_X.md` (894, of which about 200 are scene3d/chart JSON), `blind/lagrange_Y.md` (478). I recomputed every number in all four texts.

---

## PAIR 1: Napier's logarithm (log_X vs log_Y)

### 1a. Idea inventory, X (58 testable units)

Definitions and results
1. Napier did not use the modern definition ("if x=a^y then y is the log"). That definition came later.
2. Definition: the log is a function whose rate of growth is inversely proportional to the quantity: y'=c/x, x>0 (5).
3. y' is meant intuitively here. The precise definition of the derivative is deferred to part 4, "as it sufficed for Napier".
4. c sets the base.
5. y(1)=0 gives a unique solution, y=c ln x.
6. Validity: x>0. As x→0 the rate diverges and y→−∞.

Napier's derivation skeleton, with its assumptions
7. Segment of 10^7 = radius of the sine tables, so all sines were integers.
8. Assumption A: P's speed equals the remaining distance x. This is where 1/x comes from, and P never arrives.
9. Assumption B: Q moves at constant speed equal to P's initial speed, so Q's path acts as a clock.
10. NL(x) = Q's distance when P has x left.
11. Ratio of the increments is −10^7/x, so c=−10^7.
12. The initial condition y=0 at x=10^7 fixes the constant.
13. NL(x)=10^7 ln(10^7/x) (6).
14. Anchor: NL(5×10^6)=6,931,472.
15. Done without instantaneous velocity. §5 cites it as the variable concept arising before Newton and Leibniz.
16. Motivation: astronomers needed to turn 7-digit multiplication into addition.

Derivation from (5) to the product rule
17. Compare y at x and at kx. Increments: cΔ/x and c·kΔ/(kx)=cΔ/x. The k cancels, and this is the job of the 1/x form.
18. So the difference is constant, giving y(kx)=y(x)+y(k) (7).
19. y(k^m)=m·y(k) for integer m, then for rational m.
20. b with y(b)=1 makes y=log_b.
21. c=1 gives ln, with base e=2.71828.
22. log10 needs c=1/ln10=0.4343.

Structure
23. (5) is scale invariant: changing units shifts y by a constant.
24. So ratio, not difference, controls the result. The log measures ratios as distances (1→10 equals 1000→10000), and the text claims it is the only such function.
25. Numerical check: NL(10^6)−NL(2×10^6)=23,025,851−16,094,379=6,931,472=NL(5×10^6).
26. c is only a unit: ln x=2.3026 log10 x (8).

Errata and critique of the source
27. OCR-garbled formulas restored (x=a^y, y'=c/x), with a reason why each must be so.
28. NL decreases (c<0) and does not satisfy (7). Instead NL(x)+NL(y)=NL(xy/10^7). Example: 2×6,931,472=NL(2.5×10^6).
29. Users corrected by powers of 10^7. Briggs and Napier moved to log1=0 and log10=1, the origin of common logs.

Refresh: base economy
30. Cost model: price per digit ∝ b (the states each digit must distinguish) × number of digits ∝ 1/ln b, so C∝b/ln b.
31. ln x≤x−1 from the slope argument (slope >1 left of 1, <1 right of 1), with equality only at 1.
32. Substituting x=b/e gives b/ln b≥e, with the minimum only at b=e.
33. Anchors: base 3 costs +0.46%, base 2 +6.1%, base 10 +60%.

Orders of magnitude
34. 2^10≈10^3, so log10 2≈0.30 (exact 0.30103, error 0.34%).
35. log5=0.699, log8=0.903, log6=0.778 via (7).
36. dB=10 log10 of a power ratio: ×2 is 3.01 dB, ×10^6 is 60 dB.
37. Voltage: P∝V², so ×2 is 6.02 dB. Each ADC bit adds 6.02 dB.

Trade-off: table vs slide rule
38. The log does not remove the work of multiplication. It relocates it, and you pay in table and in precision.
39. Briggs (1624) has 14 digits. A product costs 3 lookups, one addition and interpolation. The table was a one-time cost amortized over centuries.
40. Slide rule: 1620s–1970s. Scales are log-spaced, and sliding adds lengths.
41. A 0.1 mm reading error on 25 cm gives a relative error of ln10·0.1/250=9.2e-4, about 3 significant figures.
42. Relative error is constant along the scale, a consequence of (5). Analogy: floating point vs fixed point (uniform relative precision, few digits, maximum speed).
43. Three digits were enough because loads and material data are no more accurate.
44. Think: no 0 (it sits at −∞), no negatives, 1 at the left end, no addition (log(a+b) is not simple). Every transform makes one operation cheap and another expensive.
45. The user manages sign and power of ten, which maps to the mantissa/exponent split.

Cross-domain structure
46. Two uncorrelated 60 dB sources give 63.0 dB. Powers add, dB do not.
47. Gains in a chain add: +20−6+20=34 dB.
48. Octave = ×2, with 12 equal-ratio semitones. Keys follow log2 f. Transposition invariance = scale invariance.
49. Richter: ×10 amplitude per unit and E∝A^1.5, so ×31.6 per unit and about ×1000 for two units.
50. General rule: use a log scale when a quantity spans many orders of magnitude and ratios matter. The senses work this way, "the ear is a biological slide rule".
51. Fieldmap: digit count ≈ log. Log-log system plots make cascades add. Information = log of possibilities, so independent probabilities multiply and information adds. Isothermal work depends on V2/V1. A diode-type element gives a log circuit. Binary search costs log N, so ×1000 costs about 10 steps. Each entry has a "learned / node / bridge" status tag.

History
52. Erratum on names and dates: Tusi 1201–1274; Viète; al-Kashi; "150 years" is really 158 (1427 vs 1585); history of the cubic (del Ferro/Tartaglia solved it, Cardano published, Ferrari solved the quartic).
53. Closing synthesis: the East freed number from geometry, Europe added form (letters, complex numbers forced by Cardano), and Napier's log already needed variable and function. Transition to §6.

(Items 46–51 contain several sub-facts. I count about 58 testable units overall.)

### 1b. Idea inventory, Y

Y contains items 2, 4–24, 26, 28 (the formula only), 29, 31–51, plus these additions:
- A prediction "think" before the derivation ("is y(kx)−y(x) rising, falling or constant? commit first").
- The Bode plot named explicitly, the diode named explicitly, and log2 N stated explicitly.
- A `keep` summary with the 3 take-aways.
- The cross-domain material compressed into one table with columns "what is multiplied" and "what follows from (7)". This table is a real structural gain: it makes the shared mechanism explicit row by row.

### 1c. Diff

Missing in Y:
- **#1**, the contrast with the modern definition x=a^y. Y never states the modern definition at all.
- **#3**, the note that the derivative is used intuitively and defined later. This matters pedagogically, because the learner meets y' before it is defined.
- **#25**, the NL numerical check that "ratio ½ gives the same distance". This is the one concrete numerical demonstration of #24.
- **#28 example**: 2×6,931,472=NL(2.5×10^6). The formula is kept, but the example is dropped.
- **#30, the rationale of the cost model.** Y says only "C(b)∝b/ln b promised in lesson 1" and never explains why the cost is b × 1/ln b. A reader of Y alone cannot reconstruct the model. This is the most substantive loss.
- **#27 and #52 (errata)**: the OCR formula fix, the Tusi/al-Kashi/Viète names, the 150 vs 158 years, and the history of the cubic.
- **#53**, the closing synthesis and transition to §6.
- The status tags in the fieldmap (learned / node / bridge), i.e. the "open connections" bookkeeping.

Weakened in Y:
- #42: "זו נקודה צפה, לעומת נקודה קבועה" without "uniform relative precision, few digits, max speed".
- #50: "גם החושים שלנו עובדים כך בקירוב" without "ear = biological slide rule".
- #15: the §5 citation is gone, though the substance is kept.
- Derivation step 1: X writes "גדל **בערך** ב-cΔ/x", while Y drops the "approximately". This is a small rigor loss: it reads as exact for a finite Δ.
- #17: the "in each small step the difference does not change" wording is compressed.

Missing in X:
- The prediction question before the derivation. X does have one think block (the slide-rule one).
- The keep summary.
- The explicit names Bode and diode.
- The table that aligns "what is multiplied" across the domains.

### 1d. Exam from X (10 questions), checked against Y

1. Where in Napier's construction does 1/x enter, and what role does Q's constant speed play? **Yes.** Y names both assumptions explicitly ("הנחה ראשונה/שנייה").
2. Derive NL(x) and compute NL(5×10^6). **Yes.**
3. Prove y(kx)=y(x)+y(k) from y'=c/x and say exactly which feature of 1/x makes it work. **Yes.**
4. Show NL does not satisfy (7), find the correct law, and verify it on 5×10^6. **Partly.** Y gives the law but no numeric check. A reader can do it, but it is not modeled.
5. Why does the base-b representation cost ∝ b/ln b? Then prove the minimum is at e. **Partly.** The proof is present, but the cost model's justification (states per digit × digit count) is absent.
6. log10 2, log10 5 and log10 6 without a calculator. Why is each ADC bit 6.02 dB? **Yes.**
7. Relative error of a 25 cm slide rule read to 0.1 mm, and why it is uniform along the scale. **Yes.**
8. Why can a slide rule not add, and what general lesson about transforms follows? **Yes.**
9. Verify numerically from NL values that the log depends only on ratios. **Partly.** The principle is in Y, the numbers are not.
10. What is wrong in the source's footnote formula "x = a”", and how do you verify the correction? **No.** The erratum is absent.

Score: Y alone gets 7 yes, 2 partly, 1 no.

### 1e. Exam from Y (10 questions), checked against X

1. Predict whether y(kx)−y(x) rises, falls or stays constant. **Yes.**
2. Find c for log10 and for ln. **Yes.**
3. Two 60 dB sources: what total, and why does a cable/amp chain add instead? **Yes.**
4. Explain transposition invariance from (7). **Yes.**
5. Richter magnitude 6 vs 8 energy ratio. **Yes.**
6. Why is binary search log N, and what does ×1000 cost? **Yes.**
7. Why is isothermal work a log? **Yes**, at the level stated.
8. Why does a Bode plot make cascades additive? **Yes.** X describes it without the name.
9. State the 3 take-aways (keep). **Yes**, since all are in X.
10. Explain the three slide-rule facts from (5) and (7). **Yes.**

Score: 10/10. Y has no content that X lacks. Only its packaging (prediction prompt, keep block, table) is new.

### 1f. Learner judgment

**X:**
- The thread is good and the derivation is fully explained.
- The 2.5 tags ([[2.5: מבנה]] etc.) make it look like a checklist, but the argument holds together.
- Cognitive load is higher. Two long errata blocks (one historical, unrelated to the log) and a closing synthesis interrupt the thread. The erratum on names and dates sits between the fieldmap and the conclusion, which is a detour.
- Definition comes before example: (5) is shown, then Napier, then the derivation.
- Key results (5), (6), (7), (8) are clearly separated from illustrations.

**Y:**
- The thread is tighter: motivation, definition (5), Napier, a prediction, the derivation, the principle, the NL caveat, the e result, anchors, the trade-off, the domains table, keep.
- Bold run-in heads mark the key result and the illustrations.
- The prediction "think" before the derivation is a good engagement device.
- The table cuts the reading load of the cross-domain section by about 3× and is easier to review.

**Errors:**
- I found no mathematical errors in either text. Every number checks: NL values, 0.46%, 6.1%, 60%, 0.34%, 9.2e-4, 63.0 dB, 31.6, the Briggs date, the Tusi/al-Kashi/cubic history.
- Minor point, in both: "the only function that measures ratios as distances" needs a continuity or monotonicity qualifier.
- Minor point, in both: the ln x≤x−1 slope argument is valid but informal (it relies on the mean value theorem implicitly).

### 1g. Verdict, pair 1

**Give Y to a strong adult learner on a huge syllabus.**
- Y retains about 49 of X's 58 units fully, about 4 in weakened form, and drops about 5.
- Of the dropped units, 3 are source errata and history and 1 is narrative context (#53). These are not level-2.5 engineering content.
- Real level-2.5 loss amounts to 2 units: the b/ln b cost-model rationale (#30) and the NL numerical demonstration of ratio dependence (#25 and the #28 example). Also a small one: the explicit "y' is intuitive here, defined later" (#3).
- If source errata are a course requirement, they must be added back. Otherwise Y gives roughly 95% of the level-2.5 depth in about 60% of the words.
- Fix to apply to Y: one sentence on why C(b)∝b·(1/ln b).

---

## PAIR 2: Cylindrical tank and Lagrange multipliers (lagrange_X vs lagrange_Y)

### 2a. Idea inventory, X (46 units)

Problem and naive method
1. The problem: a closed cylinder of fixed V with minimum surface (material, cost). Answer h=d (K1:62–63), with a figure.
2. Trade-off: short and wide pays for ends, tall and narrow pays for the wall, so the minimum is interior.
3. New difficulty: two variables tied by a constraint.
4. Substitution: S(r)=2πr²+2V/r. Setting the derivative to zero gives V=2πr³, so h=2r.
5. Limit: substitution needs a variable you can solve for, which usually fails for trajectories, robots and systems. The method recurs in optimization, thermodynamics and learning.

Lagrange derivation
6. Partial derivative defined (other variable fixed): ∂S/∂r=4πr+2πh, ∂S/∂h=2πr. Each is an ordinary derivative of type (20).
7. Gradient: the vector of steepest ascent, perpendicular to level curves because S is constant along them.
8. At the constrained minimum, a first-order move along the constraint does not change S (otherwise you would move downhill). So ∇S⊥constraint.
9. ∇V⊥constraint (it is a level curve of V), so the two are parallel: ∇S=λ∇V (28).
10. The Lagrangian L. Zeroing its r and h partials gives (28), and zeroing the λ partial gives the constraint.
11. λ=2/r. h=2r. The constraint fixes the scale: V0=2πr³.

Formula and validity
12. (29): r=(V/2π)^{1/3}, S_min=6πr², λ=dS_min/dV=2/r=(2/3)S/V.
13. Validity: closed cylinder, uniform price and thickness, only area counted.

Meaning of λ and scaling
14. λ = shadow price of the constraint.
15. S_min∝V^{2/3}, so doubling V multiplies area by 1.59.
16. dS/dV=(2/3)S/V = 3.69 m²/m³ at 1 m³, the same as 2/r.
17. The shape comes from balancing end cost (∝r²) against wall cost (∝rh).

Order-of-magnitude anchors
18. At 1 m³: r=0.5419 m, d=1.084 m, S=5.536 m².
19. Mental estimate via the π/4 cylinder: ×1.08 in size, then 1.5πd² ≈ 5.5.
20. Cube: 6 m² (+8%). Sphere: 4.836 m² (×0.874). Isoperimetric theorem. The best cylinder is about 14% worse than the sphere but can be rolled from sheet and stands on the floor.

Geometry, shown in a 3D scene
21. An interactive 3D scene (surface, constraint curve, level curve, gradient vectors, tour). Tangency, not crossing: crossing would give a cheaper tank.
22. Numeric gradients (13.62, 3.405) and (3.69, 0.923), ratio 3.69 in both components.
23. ∇S∝(4,1) at every optimum. Changing V slides the point along h=2r. Scale invariance, linked to Napier.

Flat minimum
24. κ=h/d. r∝κ^{-1/3}, S=2πr²(1+2κ). (30): S/S_min = κ^{-2/3}(1+2κ)/3 ≈ 1+(κ−1)²/9.
25. The approximation comes from derivatives of ln at κ=1: the first is zero, the second is 2/9.
26. Penalty numbers: κ=1.1 gives 0.10%, 1.5 gives 1.75%, 2 gives 5.0%, 0.5 gives 5.8%.
27. Every smooth minimum is quadratic, so you can't lose much near an optimum or gain much from extra precision. Cannon: 30° instead of 45° loses 13%.
28. The real limit is the assumptions. A broken assumption moves the optimum itself, not just the cost around it.
34. A chart: exact (30), the quadratic approximation, and the k=2 cost curve.

Cross-domain structure
29. (30) is exactly (13) with x=κ−1 and a=2/9. Quadratic bowls appear in controller tuning, least-squares training and trilateration.
30. (28) as structure: cost under a budget is minimized where the iso-cost curve touches the budget, and λ is the value of one more unit of budget.
31. In thermodynamics, temperature is such a multiplier.

Ends cost k× the wall
32. Think: if ends cost k× the wall, λ is unchanged and h/d=k (31). The shape reveals the price ratio. A free floor flattens the tank.
33. With k=2 and h=d you pay +5.8% (the third chart curve). The minimum is flat but it moves.

The drink can
35. 355 ml, about 66×122 mm, h/d≈1.85. (29) predicts 76.7 mm.
36. The ends are thicker and of a harder alloy (they carry gas pressure and the opener), so k≈2 and h/d≈2.
37. The ideal cylinder at 66.2 mm is 103 mm tall (h/d=1.56). The rest of the height is neck, bottom dome and headspace. Penalty +2.1%.
38. Against the 2%: saving on lid metal, grip, filling and vending machines, shelf space. "Engineers didn't miscalculate."

Large storage tank
39. Thickness grows with depth: t=ρgzr/σ (hoop stress). Wall steel by integral: πr²ρgh²/σ.
40. Total steel V(2t_min/h+ρgh/σ), so h_opt=√(2t_min σ/ρg) (32).
41. Independent of V. Water 13.99 m, oil 15.17 m (oil is lighter, so the tank is taller).
42. Where the assumptions enter: thickness is set entirely by stress, and cost is steel only. Ignored: wind, earthquakes, foundations, land.
43. Real tanks are 15–20 m tall and grow in diameter. A 1 ML tank and a 100 ML tank differ in diameter, not height.

Critique
44. Three checks. What is minimized (area, not cost)? Limit cases (free floor gives h/d=½; depth-dependent thickness gives h/d≪1). Cost slope (<2% for 50%).
45. Correct formulation: "closed cylinder, uniform price: minimum area at h=d, and the minimum is very flat".
46. Link to the notebook note on untested assumptions. On a flat minimum, a wrong assumption moves the decision more than numerical error does.

### 2b. Idea inventory, Y

Y contains items 2–4, part of 5, 6 (in a `definition` block), 7–20, 22, 23, 24–28, 29 (weakened), 30–33, 35–38 (38 weakened), 39–41 (weakened), 42 (weakened), 43 (weakened), 44–46. Additions:
- **The smoothness and first-order assumption is stated explicitly** as "ההנחה" at the key step. This is a level-2.5 gain: X leaves it implicit.
- A definition block before the derivation (definition before example).
- A think on the angle between ∇S and the constraint, with the argument.
- A prediction think on κ=1.5 (1%/10%/30%) before (30).
- A table for the cross-domain mappings.
- A keep block.

### 2c. Diff

Missing in Y:
- #1, the source anchor and figure (K1:63).
- #21, the 3D scene and its tour.
- #34, the chart.
- **Y still says "בסצנה, במבט מלמעלה, רואים את (28)" with no scene in the file, a dangling reference.** Standalone, this is a defect.
- #5, the signpost that Lagrange recurs in optimization, thermodynamics and learning. The table partly covers it.
- #6, "each partial is an ordinary derivative of type (20)", a link back to the earlier result.

Weakened in Y:
- #29: Y says "½ax² של (13)" but drops the exact mapping x=κ−1, a=2/9.
- #38: drops "a larger saving on lid metal" (the narrower lid as a cost-saving reason).
- #39: drops the intermediate wall-steel integral πr²ρgh²/σ ("אינטגרל על הגובה והצבת האילוץ"). The derivation skeleton loses a checkable step.
- #41: drops "oil is lighter, therefore taller", the one-line physical reading of ρ in (32).
- #42: drops "the assumptions enter in two places: thickness set by stress, cost = steel". Y keeps only the list of ignored loads and costs.
- #43: drops the 1 ML vs 100 ML illustration.
- #33: drops "the minimum is flat, but it moves".
- #25: kept, but only in a parenthetical.

Missing in X:
- The explicit smoothness and first-order assumption.
- The definition block, the angle think and the prediction think on κ.
- The keep summary and the table.

### 2d. Exam from X (10 questions), checked against Y

1. Solve by substitution, and state when substitution fails. **Yes.**
2. Derive ∇S=λ∇V geometrically, and say where optimality enters. **Yes.** Y is even clearer about the assumption.
3. Solve the Lagrange system for the tank, and give λ at 1 m³. **Yes.**
4. Interpret λ and verify λ=dS_min/dV from the V^{2/3} law. **Yes.**
5. Give the gradient vectors at 1 m³ and show the tangency. **Yes** (numbers present). The scene is missing.
6. Derive (30) and its quadratic coefficient, and map it to the generic quadratic (13). **Partly.** The coefficient is given but the mapping a=2/9, x=κ−1 is not.
7. Ends cost k× the wall: derive h/d=k and the cost of building h=d at k=2. **Yes.**
8. Explain the can's h/d≈1.85 vs the 1.56 cylinder body, and list the non-material costs. **Yes**, minus the lid-metal point.
9. Derive h_opt for a large tank, including the wall-steel integral, and explain why oil tanks are taller. **Partly.** The integral's intermediate result and the "oil lighter" reasoning are not given (the numbers are).
10. Critique "h=d is optimal" in three steps and reformulate it correctly. **Yes.**

Score: Y alone gets 8 yes, 2 partly, 0 no.

### 2e. Exam from Y (10 questions), checked against X

1. Define partial derivative and gradient, and explain why the gradient is perpendicular to level curves. **Yes.**
2. What angle does ∇S make with the constraint at the optimum, and why? **Yes.**
3. Which assumption makes "∇S⊥constraint" valid? **Partly.** X implies first order ("בסדר ראשון") but never names smoothness as the assumption.
4. Predict the penalty at h/d=1.5. **Yes.**
5. Area of a doubled-volume tank. **Yes.**
6. Cube vs sphere vs cylinder at 1 m³. **Yes.**
7. Why does the minimum's flatness make assumptions decisive? **Yes.**
8. Give the economic analogue of (28). **Yes.**
9. Give h_opt for water with t_min=6 mm and σ=160 MPa. **Yes.**
10. State the three keep items. **Yes.**

Score: 9 yes, 1 partly.

### 2f. Learner judgment

**X:**
- Richer and better grounded. It has the figure, an interactive 3D scene with a tour that directly shows tangency, and a chart of the flat minimum with the k=2 curve.
- These visuals carry real conceptual weight for a geometric idea (tangency).
- It is long, and the derivation is spread over 7 steps with a definition embedded inside the derivation (step 1 defines the partial derivative). That is weaker on definition before example.
- The prose is clear and the narrative is good.

**Y:**
- Definition block first, then a commit-first think, then the derivation with the assumption flagged, then the formula with validity. This is exactly the right order for level 2.5.
- Results and illustrations are clearly separated by bold heads.
- About half the load. The prediction questions improve engagement.

**Errors in both:**
- **"סטייה של 50% מ-h=d עולה פחות משני אחוזים"** holds only for κ=1.5 (+1.75%). For κ=0.5, also a 50% deviation, both texts' own number is +5.8%. This is an internal inconsistency in the critique paragraph. The flat minimum is asymmetric.
- The can: k≈2 predicts h/d≈2, which both call "close to the measured 1.85". But both then show the effective cylinder body is h/d=1.56, so the comparison should be with 1.56. The argument is muddled, though the conclusion (that it is a trade-off) holds. At k=2, h/d=1.56 costs only about 0.7% over its own optimum, which would have been the cleaner point.
- "Temperature itself is a Lagrange multiplier": strictly it is β=1/(kT), the multiplier on the energy constraint in max-entropy. Loose, in both.
- "The isoperimetric theorem of the Greeks" for the 3D sphere: Zenodorus and Archimedes argued it, but proof came in the 19th century (Schwarz). Minor, in both.
- All numeric values check: r=0.5419, S=5.536, λ=3.69, the gradients, 4.836, 0.874, the κ penalties, the 76.7 mm and 103 mm can figures, the 2.1%, the √(2tσ/ρg) derivation, 13.99/15.17 m (ρ_oil≈850 kg/m³), and the k=2 chart expression.

**Y only:** the dangling scene reference.

### 2g. Verdict, pair 2

**Give Y, with the scene and chart attached (or the scene reference removed).**
- Y retains about 36 of X's 46 units fully, about 7 in weakened form, and drops about 3 outright.
- Of the dropped units, 2 are visualizations (the scene and the chart). In a geometric topic these are real pedagogical depth, not decoration. The third is the figure/source anchor.
- Level-2.5 depth lost in Y amounts to about 4 units: the wall-steel integral step, "oil lighter, so taller", the a=2/9 ↔ (13) mapping, and "where the assumptions enter" in (32).
- Y gains 1 unit X lacks: the explicit smoothness/first-order assumption at the Lagrange step.
- Net: Y loses about 5 of 46 (about 11%), mostly in the storage-tank skeleton and the visuals, at about 55% of the length.
- Both texts share the asymmetric-penalty error, which should be fixed ("+50% costs <2%; −50% costs ~6%").

---

## Overall

| | X units | Y full | Y weakened | Y dropped | Real level-2.5 loss in Y |
|---|---|---|---|---|---|
| Log | ~58 | ~49 | ~4 | ~5 | 2–3 units (b/ln b cost rationale, NL ratio numeric demo, "y' defined later") |
| Lagrange | ~46 | ~36 | ~7 | ~3 | ~5 units (scene and chart visuals, wall-steel integral, "oil lighter", a=2/9 mapping) |

For a strong adult on a huge syllabus I would pick **Y in both pairs**. Y has better ordering (definition block, assumption flagged), commit-first prediction questions, keep summaries and tables, at about 55–60% of the words. The cost:
- The Log pair loses mainly source errata and history, which are not engineering depth.
- The Lagrange pair loses the visuals and two steps of the storage-tank derivation skeleton, which are.

Fixes to apply to Y:
- One sentence on why C(b)∝b/ln b.
- Restore πr²ρgh²/σ and "oil lighter, so taller".
- Attach the scene and chart, or remove the "בסצנה" reference.
- Correct the "50% costs <2%" claim (in both texts).
