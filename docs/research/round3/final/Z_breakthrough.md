# Z. Attacking the two numbers that set the calendar

Scripts: `Z_ret.py` → `Z_ret.out`, `Z_ret_curves.npz` (P's FSRS simulation with the logic unchanged, plus per-tier bookkeeping and per-tier recall probes; 700 days). `Z_model.py` → `Z_model.out` (imports `F_model.py` unchanged and swaps only its retention curves and lever parameters). Monte Carlo N = 6,000, seed 31. All figures are at 8 h + 1 phone hour.

## 0. Answer

| Plan | Everything P10 / **P50** / P90 | Core P10 / **P50** / P90 |
|---|---|---|
| F as published | 23.5 / **28.5** / 35.4 | 18.9 / **23.0** / 28.7 |
| F corrected (real tier mix, same policy, same depth) | 20.5 / **25.1** / 31.5 | 16.6 / **20.5** / 25.8 |
| **Best defensible plan** (retention policy P5 + levers B1–B5) | **17.9 / 21.8 / 27.6** | **14.5 / 17.9 / 22.5** |
| Best plan, every lever at its low end | 18.9 / 23.5 / 29.4 | 15.4 / 19.1 / 24.1 |
| Best plan, and the pilot confirms schema memory | 17.5 / 21.6 / 27.1 | 14.3 / 17.5 / 22.1 |

**Gain:** −6.7 months on everything and −5.1 on the core at P50. About half of it is a correction to F's model, not a new lever.

## 1. A correction to F, found first

F's model has an error that overstates the cost of retention.
- `F_model.py` multiplies the counted items (12.6% K, 34.9% S, 52.4% C) by I's per-item cost curve.
- That curve was built for R10's mix of 31% K, 35% S and 34% C. A K item costs about 6 times as much as a C item to hold.
- The result is that every C item is priced as an average item, which is mostly a K item's cost.
- Repricing with per-tier curves on the real mix brings retention from 1,135 + 723 h to 780 + 399 h (explicit + hooks, mode). That alone is −3.4 months.
- The policy is unchanged: every tier is still held at r = 0.90. About 0.7 of those months comes from cleaner age-based curves: the method check, run at R10's mix, gives 27.8 against 28.5.

## 2. A: retention policy

Each policy was simulated at the tier level. The recall columns give mean recall at 6 and 12 months, with the 5th percentile in brackets.

| Policy | Retention h, explicit + hooks | K recall | S recall | C recall | Everything / core P50 |
|---|---|---|---|---|---|
| P0: every tier r = .90 | 780 + 399 | .97 / .96 | .97 / .96 | .96 / .96 | 25.1 / 20.5 |
| P1: C held only by a safety floor at .75; uses carry the rest | 668 + 458 | same | same | .94 / .93 (.81) | 24.6 / 20.0 |
| P2: C by use only (hooks, on-demand lookup) | 588 + 529 | same | same | **.90 / .86 (.43)** | 24.6 / 20.0 |
| P3: P2 + S reviewed through its keystone (floor .85) | 511 + 547 | same | .95 / .94 (.87) | .90 / .86 | 24.1 / 19.8 |
| P4: P2 + S floor .80 | 465 + 564 | same | .95 / .93 (.83) | .90 / .85 | 24.1 / 19.8 |
| **P5: S through the keystone (.85) + C floor .75** | 592 + 478 | .96 / .96 | **.95 / .94** | **.94 / .93** | **24.4 / 19.8** |

**Findings**
- **Use alone is not enough for C items.**
  - Under P2, C recall falls to .86 at 12 months, and 1 item in 20 is below .45.
  - The money saved on explicit review comes back as failed lookups inside lessons (hooks +130 h). The net gain is only 0.5 months.
  - Recognition probably stays above .90, but no study measures that for definitions with their conditions **[P]**.
- **P5 is the policy to adopt.**
  - Every tier keeps a mean recall of ≥ .93 at 12 months, so held-out exams on K and S and recall of C (not just recognition) still pass.
  - It costs ~0.7 months less than P0. The real saving here is small, because C items were already cheap at about 1.8 min each.
- **The evidence behind the floors:**
  - mean R stays far above the floor r (Z_ret probes);
  - the exam KPI is mean recall;
  - P already found that per-tier targets save little, which agrees.
- **S under P5:** these items stay retrieval-graded inside the keystone rebuild (bundled hooks, credit .7). An S item gets a solo card only when its R falls below .85.

## 3. B: the dense-lesson floor (lesson hours at mode)

**The dense-lesson cap does not bind.**
- In F, the cap binds 1 week out of the whole course. Removing it entirely gives the same P50.
- So naps, two dense blocks and interleaving the apps against fatigue gain **0** in this model (B6: 24.4 → 24.3).
- The nap is already inside R9's effective-hours curve.
- What limits the calendar is total effective hours, so only fewer lesson minutes help.

| Lever (on P5) | Assumption (range) | Lesson h | Everything P50 | Evidence and risk |
|---|---|---|---|---|
| **B1:** reading speed rises with practice on familiar formats | 145 → 160 wpm (115–200) | −86 | −0.7 | Gains come from vocabulary and domain knowledge (Rayner 2016); speed-reading methods fail. **Risk:** a speed–comprehension trade-off; keep the delayed recheck. |
| **B2:** worked-example fading in the derivation steps | ×0.95 (0.90–1.0) | −84 | −0.9 | Novices learn more per minute from worked examples (Sweller & Cooper 1985; Renkl 2002 on fading). **Risk:** expertise reversal. Fading must end in an unaided step, or depth is lost. |
| **B3:** tables and diagrams for structure-type units only | ×0.97 | −50 | −0.5 | Mayer's multimedia principle; concept maps g ≈ .4 (Nesbit & Adesope). **Hidden-depth flag:** never replace a derivation or a mechanism paragraph with a diagram. |
| **B4:** pretest fast path grows as earlier modules accumulate | math .35 → .42, mil .60 → .65 | −26 | −0.3 | Already gated by "בטוח" plus a delayed recheck. **Risk:** collapse on overconfidence. Test-out of the ~2,160 Lanchester pages is already in F, and doubling its pass rate gives only 0.4 months. |
| **B5:** the phone hour pre-reads narrative units and C-glossary previews | pre-reading 1.5 → 6 min per lesson | 0 desk-dense | −0.5 | Screen reading is weaker for expository text (Delgado 2018, g ≈ −.2) and about even for narrative. **Flag:** narrative only, with recall-first at the desk. |
| All together | | 1,691 → 1,455 h | **24.4 → 21.8** | At the low end of every range: 23.5 |

## 4. What the 2-week pilot must measure

1. **Words per minute against delayed recheck**, by book type and by week. B1 holds only if speed rises with no drop in recheck.
2. **Lesson minutes per CR** on worked-example items with fading against items without it, with a matched transfer item. B2 holds only if transfer is not lower.
3. **Diagram units against prose units:** time, plus a held-out "explain the mechanism" item (B3).
4. **The fast-path share and the false-collapse rate** (said "בטוח", then failed the recheck); B4.
5. **Phone pre-read:** comprehension of the same narrative unit at the desk against on the phone (B5).
6. **Retention:**
   - the personal FSRS weights after about 1,000 reviews, which tells whether schema memory holds (−0.2 months);
   - for C: recall and recognition on items from the off-schedule draw;
   - for S: recall of bundled S items against S items with their own cards.
   - Pass criterion: ≥ .90 mean on a held-out exam.

**Limits:**
- the anchor is a single lesson (n = 1);
- the lever sizes are judgement **[J/P]**;
- the curves come from one seed, and their 5th percentiles are noisy.
