# A3 v3 unit checklist

Every unit of the original (the A2 checklist N1–N40 / E1–E43, plus the judges' inventories) and every item on the judges' lost/weakened lists → where it sits in v3. Each row has a probe string that `A3v3_checklist_build.py` checks is present in the v3 file; the build fails if one is missing. Result: **log 58/58, Lagrange 58/58 present.**

## Napier / logarithm (`A3v3_log.md`)

| id | unit | location in v3 | probe |
|---|---|---|---|
| N1 | Log defined by rate y'=c/x, not as inverse of a^y | definition block (5) | ✓ |
| N2 | Domain x>0; x→0 rate diverges, y→−∞ | definition block (5) | ✓ |
| N3 | y(1)=0 → unique y=c ln x | definition block (5) | ✓ |
| N4 | P speed = remaining x → 1/x; never arrives | "איך נאפייר" ¶, הנחה ראשונה | ✓ |
| N5 | Q constant speed = clock; NL = Q distance | "איך נאפייר" ¶, הנחה שנייה | ✓ |
| N6 | 10^7 = sine-table radius, integer sines | "איך נאפייר" ¶ | ✓ |
| N7 | NL(x)=10^7 ln(10^7/x), c=−10^7, y=0 at 10^7; NL(5e6) | (6) | ✓ |
| N8 | No instantaneous velocity; motion intuition | after (6) | ✓ |
| N9 | Need: 7-digit multiplication → addition | opening ¶ | ✓ |
| N10 | k cancels: where 1/x works | derivation steps 2–3 | ✓ |
| N11 | y(kx)=y(x)+y(k) | derivation step 4 (7) | ✓ |
| N12 | y(k^m)=m y(k); base b with y(b)=1 | derivation step 5 | ✓ |
| N13 | c=1→ln, e=2.71828; log10 needs 0.4343 | derivation step 6 | ✓ |
| N14 | Scale invariance; ratio not difference; ratios as distances (continuous-only qualifier added) | "העיקרון" ¶ | ✓ |
| N15 | ln=2.3026 log10; c only a unit | (8) | ✓ |
| N16 | NL decreasing, NL(x)+NL(y)=NL(xy/10^7); powers of 10^7; Briggs log1=0, log10=1 | ¶ after (8) | ✓ |
| N17 | ln x ≤ x−1 by slope argument | refresh block | ✓ |
| N18 | b/ln b ≥ e, min at e | refresh block | ✓ |
| N19 | base 3 +0.46%, 2 +6.1%, 10 +60% | refresh block | ✓ |
| N20 | 2^10≈10^3 → log2≈0.30 (0.34%); log5, log8, log6 | "עוגנים" bullet 1 | ✓ |
| N21 | dB: ×2=3.01, ×10^6=60; voltage ×2=6.02 (P∝V²) | "עוגנים" bullet 2 | ✓ |
| N22 | ADC bit = +6.02 dB | "עוגנים" bullet 2 | ✓ |
| N23 | Table: 14 digits, 3 lookups+add+interp, one-time cost used for centuries | "הפשרה" ¶ | ✓ |
| N24 | 0.1 mm on 25 cm → 9.2e-4 → ~3 digits | "הפשרה" ¶ | ✓ |
| N25 | Constant relative error = floating point (uniform rel. precision, few digits, max speed) | "הפשרה" ¶ | ✓ |
| N26 | 3 digits sufficed 300 years: loads/material data no better | "הפשרה" ¶ | ✓ |
| N27 | No 0, no negatives; left end 1 | think 2 answer | ✓ |
| N28 | log(a+b) not simple | think 2 answer | ✓ |
| N29 | Every transform: one op cheap, another dear | think 2 answer | ✓ |
| N30 | User tracks sign & power of 10 = mantissa/exponent | think 2 answer | ✓ |
| N31 | Two 60 dB → 63.0 dB; chain +20−6+20=34 | domain block, דציבל | ✓ |
| N32 | Octave ×2, 12 equal semitones, log2 f, transposition = scale invariance | domain block, אוקטבה | ✓ |
| N33 | Richter ×10 amplitude, E∝A^1.5 → ×31.6, ×1000 | domain block, ריכטר | ✓ |
| N34 | Log scale when many orders of magnitude & ratios; senses; ear = biological slide rule | domain block, last ¶ | ✓ |
| N35 | Digit count ≈ log | fieldmap line 1 | ✓ |
| N36 | Log-log plots: cascades add | fieldmap line 3 | ✓ |
| N37 | Information = log of possibilities; adds | fieldmap line 4 | ✓ |
| N38 | Isothermal work ∝ ln(V2/V1) | fieldmap line 5 | ✓ |
| N39 | Diode-type log circuit | fieldmap line 6 | ✓ |
| N40 | Binary search: ×1000 → ~10 steps | fieldmap line 7 | ✓ |
| J1L#1 | Contrast with the modern definition x=a^y | opening ¶ | ✓ |
| J1L#3 | y' used intuitively, defined in part 4 | definition block | ✓ |
| J1L#15 | §5 cites the log as the variable concept before Newton–Leibniz | opening ¶ | ✓ |
| J1L#25 | NL numeric check: ratio ½ gives the same distance | "העיקרון" ¶ | ✓ |
| J1L#28ex | Example 2×6,931,472=NL(2.5×10^6) | ¶ after (8) | ✓ |
| J1L#30 | WHY C(b)∝b/ln b: price per digit ∝ b × digits ∝ 1/ln b | refresh block | ✓ |
| J1L#27 | K1:52 OCR formula erratum with verification | erratum block, line 1 | ✓ |
| J1L#51tags | Fieldmap status tags (נלמד / צומת / גשר / פריפריה) = open-connections record | fieldmap block | ✓ |
| J1L#52 | Names/dates errata (Tusi, Viète, al-Kashi, 158 years, cubic history) | erratum block, lines 2–4 | ✓ |
| J1L#53 | Closing synthesis and transition to §6 | closing ¶ | ✓ |
| J1L-w42 | "few digits, max speed" restored | "הפשרה" ¶ | ✓ |
| J1L-wstep1 | "approximately" kept in derivation step 1 | derivation step 1 | ✓ |
| J2L-dt | dt removed; "בפרק זמן קצר" instead; every symbol named at first use | "איך נאפייר" ¶ | ✓ |
| J2L-NL | NL paragraph linked into the thread | ¶ after (8), opening clause | ✓ |
| J2L-link | Link sentence "why is c/x useful?" before the derivation | end of Napier ¶ | ✓ |
| J2L-commit | Commit-before-reveal think placed just before its derivation | think 1 | ✓ |
| FMT-def | Definition before example (definition block before Napier instance) | definition block | ✓ |
| FMT-keep | Key vs illustration: keep block only key formulas | keep block | ✓ |

J1's other log units (#2, #4–14, #16–24, #26, #29, #31–50) are the same content as N1–N40 above. J1 #51 (fieldmap) is covered by N35–N40 plus the status tags.

## Tank / Lagrange (`A3v3_lagrange.md`)

| id | unit | location in v3 | probe |
|---|---|---|---|
| E1 | Closed cylinder, fixed V: min surface at h=d (K1:62–63) | opening ¶ | ✓ |
| E1fig | Book figure K1:63:0, verbatim | figure block | ✓ |
| E2 | Squat pays ends, tall pays wall → interior min | ¶ after figure | ✓ |
| E3 | Two variables tied by a constraint | ¶ after figure | ✓ |
| E4 | Substitution: S(r)=2πr²+2V/r → V=2πr³ → h=2r | "דרך ההצבה" ¶ | ✓ |
| E5 | Substitution fails for trajectories/robots/systems; Lagrange recurs in optimisation, thermo, learning | "דרך ההצבה" ¶ | ✓ |
| E6 | Partial derivative (other held fixed); each an ordinary derivative as in (20); values for S | definition block + derivation step 1 | ✓ |
| E7 | Gradient: steepest ascent, ⊥ level curves | definition block | ✓ |
| E8 | First-order move along constraint leaves S unchanged (else move downhill) → ∇S=λ∇V; smoothness assumption named | derivation step 2 | ✓ |
| E8b | Explicit assumption: S, V smooth, first order (v2 gain kept) | derivation step 2 | ✓ |
| E9 | Lagrangian L; stationarity gives (28) and constraint | derivation step 3 | ✓ |
| E10 | λ=2/r; h=2r; V0=2πr³ (steps split) | derivation steps 4–6 | ✓ |
| E11 | r=(V/2π)^{1/3}, S_min=6πr² | formula (29) | ✓ |
| E12 | Validity: closed, uniform price & thickness, area only | formula (29) body | ✓ |
| E13 | λ = shadow price | "מה λ אומר" ¶ | ✓ |
| E14 | S∝V^{2/3}; ×1.59; dS/dV=(2/3)S/V=3.69=2/r | "מה λ אומר" ¶ | ✓ |
| E15 | Balance ends ∝r² vs wall ∝rh | "מה λ אומר" ¶ | ✓ |
| E16 | 1 m³: 0.5419, 1.084, 5.536; π/4 mental route ×1.08 | "עוגנים" ¶ | ✓ |
| E17 | Cube 6 m² (+8%); sphere 4.836 (×0.874); isoperimetric (dating corrected); cylinder 14% worse | "עוגנים" ¶ | ✓ |
| E18 | Cylinder: rolled sheet, stands on floor | "עוגנים" ¶ | ✓ |
| E19 | Level curve touches, not crosses | ¶ after scene | ✓ |
| E20 | ∇S∝(4,1); slides along h=2r; scale invariance (Napier link) | ¶ after scene | ✓ |
| E21 | κ=h/d; r∝κ^{-1/3}; S=2πr²(1+2κ); (30); ln-derivatives 0 and 2/9 | ¶ before (30) + after | ✓ |
| E22 | Penalties 1.1→0.10%, 1.5→1.75%, 2→5.0%, 0.5→5.8% | ¶ after chart | ✓ |
| E23 | Smooth min quadratic: cannot lose/gain much; cannon 30° vs 45° = 13% | ¶ after chart | ✓ |
| E24 | Real limit = assumptions; broken one moves the optimum | ¶ after chart | ✓ |
| E25 | Quadratic bowl in control tuning, squared-error training, position fix | fieldmap line 1 | ✓ |
| E26 | Iso-cost tangent to budget; λ = value of one more budget unit | fieldmap line 2 | ✓ |
| E27 | Thermo multiplier — CORRECTED to 1/(k_B T) | fieldmap line 3 | ✓ |
| E28 | Ends ×k → λ unchanged, h/d=k (31) | think 3 | ✓ |
| E29 | k=2 built h=d → +5.8% (third chart curve) | think 3 | ✓ |
| E30 | Shape reveals price ratio; "flat but moves" | think 3 | ✓ |
| E31 | Can 66×122, h/d≈1.85; (29) says 76.7 | "פחית" ¶ | ✓ |
| E32 | Ends thicker/harder alloy → k≈2 → h/d≈2 | "פחית" ¶ | ✓ |
| E33 | Body 66.2 mm → 103 mm, h/d 1.56; neck/dome/headspace; +2.1% | "פחית" ¶ | ✓ |
| E34 | Other cost terms: lid metal saving, grip, filling & vending machines, shelf | "פחית" ¶ | ✓ |
| E35 | Hoop stress: t=ρgzr/σ; ρ, g, z, σ named | "מכל אגירה" ¶ | ✓ |
| E36 | Steel = V(2t_min/h+ρgh/σ) WITH intermediate wall integral πr²ρgh²/σ | "מכל אגירה" ¶ | ✓ |
| E37 | h_opt=√(2t_min σ/ρg), independent of V | (32) | ✓ |
| E38 | 13.99 m water, 15.17 m oil | after (32) | ✓ |
| E38b | Oil lighter → taller (∝1/√ρ), ρ≈850 | after (32) | ✓ |
| E39 | Real tanks 15–20 m, grow in diameter; 1 ML vs 100 ML | after (32) | ✓ |
| E40 | Ignores wind, quakes, foundations, land; assumptions enter in two places | after (32) | ✓ |
| E41 | Critique: what is minimised; limits free floor (k=½) → ½, depth → h/d≪1 | "ביקורת" ¶ | ✓ |
| E42 | Flatness (CORRECTED, asymmetric) → outside constraints decide; correct formulation | "ביקורת" ¶ | ✓ |
| E43 | Flat min: wrong assumption moves decision more than numbers; notebook link | "ביקורת" ¶ | ✓ |
| J1G#21 | 3D scene + tour, verbatim | scene3d block | ✓ |
| J1G#22 | Numeric gradients (13.62, 3.405), (3.69, 0.923) | ¶ after scene | ✓ |
| J1G#29 | (30) ↔ (13): x=κ−1, a=2/9 | ¶ after (30) | ✓ |
| J1G#34 | Chart (exact, quadratic, k=2), verbatim | chart block | ✓ |
| J2G-sym | Every symbol named at first use (ρ, g, z, σ, t_min, d, S_min, λ, κ, k_B, T) | tank ¶, (29), fieldmap | ✓ |
| FIX-asym | "50% costs <2%" made correct and asymmetric (+50%: 1.75%; −50%: 5.8%; <2% only for 0.66<κ<1.54) | ¶ after chart + critique + keep | ✓ |
| FIX-asym2 | Why asymmetric: symmetric in ratio; ln-κ approximation (5.3% vs 11% at κ=2) | ¶ after chart | ✓ |
| FIX-can | Can: compare body h/d 1.56 (not 1.85) with model; 2.1% vs k=1, 0.7% vs k=2 | "פחית" ¶ | ✓ |
| FIX-iso | Isoperimetric: Greeks claimed, full proof 19th c. | "עוגנים" ¶ | ✓ |
| FMT-def | Definition block (general f(x,y)) before the tank example | definition block | ✓ |
| FMT-think | Commit-first thinks just before their answers (angle; κ=1.5/0.5; ends ×k) | 3 think blocks | ✓ |
| FMT-keep | keep block: key formulas only | keep block | ✓ |

J1's other Lagrange units (#1–20, #23–33, #35–46) are the same content as E1–E43 above.

## Notes
- **Verbatim blocks.** `figure` K1:63:0, `scene3d` and `chart` were copied byte-for-byte from `blind/lagrange_X.md` (the build script asserts it). The log section had no visual blocks.
- **Block semantics kept.** `domain`, `fieldmap` (with status tags, which feed the course memory's open connections), `refresh` (@first) and `erratum` stay as typed blocks rather than the v2 table, because the app uses them. Duplication was removed inside them instead.
- **Placement.** The erratum and fieldmap come at the end of the section (rule 3). The two K1:49–51 name/date slips are one-liners in the same erratum block (the rule for trivial OCR slips).
- **Think budget.** 2 (log) + 3 (Lagrange) = 5 think blocks. The rule allows about 6 per lesson, so the rest of lesson 3 has room for about one more.
- **Word counts** (`A3v3_count.py`; Hebrew-letter tokens, JSON of scene3d/chart excluded; v2 with its ⟦⟧ markers stripped):

| section | original | v2 | v3 | v3/orig | v3/orig, without errata and keep | v2/orig |
|---|---|---|---|---|---|---|
| log | 1,601 | 776 | 1,093 | 0.68 | 0.70 | 0.48 |
| Lagrange | 1,457 | 896 | 1,131 | 0.78 | 0.76 | 0.62 |
| both | 3,058 | 1,672 | 2,224 | 0.73 | 0.73 | 0.55 |

  Counting all tokens, LaTeX included (the A2 convention), the ratios are 0.72 for log and 0.84 for Lagrange.
- **Numbers.** `A3v3_numbers.py` recomputes every number in both files: 78/78 OK.
