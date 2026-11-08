# F. The calendar, recomputed on the final curriculum

Model: `F_model.py` (adapted from `round3/I_model.py`). Output: `F_model.out`. Run `python3 -I F_build.py && python3 -I F_model.py > F_model.out` (about 10 s). Inputs: `F_curriculum.json` totals per segment (Gilua core/adv, Lanchester core/adv; ref tiers are excluded, as in I).

## 0. Answer

P10 / **P50** / P90 months, Monte Carlo N = 6,000, R9's 8-hour effective-hours curve, same calendar as I:

| Scope | 8 h | 8 h + 1 phone hour | (I, 8 + 1, for comparison) |
|---|---|---|---|
| **Everything** (core + adv of both apps) | 26.7 / **32.7** / 40.7 | 23.5 / **28.5** / 35.4 | 19.3 / 24.8 / 32.2 |
| **Core of both** | 21.4 / **26.4** / 33.1 | 18.9 / **23.0** / 28.7 | 14.5 / 18.4 / 24.1 |

P(finish by month 6, 8, 10 or 12) is 0.00 for both scopes, with and without the phone hour (fewer than 1 draw in 6,000). P(core ≤ 15) = 0.01 at 8 + 1.

**Share done by a given month** (everything plan, core first, both apps interleaved):

| | Month 6 | Month 8 | Month 12 |
|---|---|---|---|
| 8 h: share of all pages | **22%** (P10–P90 17–26%) | **28%** (23–35%) | 40% |
| 8 h: share of the core | **27%** (22–33%) | **36%** (29–43%) | – |
| 8 + 1: share of all pages | **24%** (19–29%) | **32%** (25–38%) | 45% |
| 8 + 1: share of the core | **30%** (24–37%) | **40%** (32–48%) | – |

Review load when the course ends: P50 about 163 min/day (P10–P90 134–199) at 8 + 1.

## 1. What changed in the model

Everything else is I's model unchanged: the anchor lesson (K1:29–44, 62/80 min fast/slow), fast-path shares, reading speed, φ, the representativeness and top-up factors, consultation/forge/notebook per CR, the FSRS retention curves convolved with the weekly schedule, hooks, the pocket share and phone hour, projects/articles/build, exams, R9 EFH and the dense-lesson cap, lost days, light Fridays/weeks and the pilot week.

Replaced: **pages × R8 class density → the final in-scope counts per segment.**

| Segment | Kept weighted pp (new / test-out / dup) | Book CR new / test-out / delta | Added CR | K+S+C items (book + added) | Page mix by book type |
|---|---|---|---|---|---|
| Gilua core | 11,195 (10,927 / 70 / 198) | 1,372 / 6 / 23 | 122 | 8,569 + 882 | Kolmogorov 558, Feynman 1,004, theorem-dense 1,770, eng. textbook 4,828, descriptive 2,965 |
| Gilua adv | 2,787 (2,693 / 45 / 50) | 335 / 4 / 6 | 12 | 1,958 + 90 | 227 / 414 / 390 / 881 / 831 |
| Lanchester core | 5,837 (3,725 / 1,426 / 686) | 365 / 53 / 76 | 206 | 4,528 + 1,249 | math-bearing 2,794, narrative 2,328, SMAD 416, auxiliary 298 |
| Lanchester adv | 1,861 (1,019 / 737 / 105) | 76 / 10 / 9 | 2 | 1,292 + 20 | 726 / 862 / 214 / 59 |

How lesson time is built now (per segment):
- **Lesson minutes** = page part × equivalent pages + CR part × equivalent CRs.
  - Page part: the anchor's minutes per page × φ (the share that does not depend on density). CR part: the anchor's minutes per page × (1 − φ) ÷ the anchor's 0.129 CR/page.
  - Equivalent pages = new pages + added-item text (4 page-equivalents per added CR, range 3–6, plus 0.1 per added C item) + duplicate pages × delta cost (0.15/0.25/0.40) + test-out pages × test-out cost.
  - **Test-out cost** = 2 probes (diagnostic + delayed recheck, 0.05/0.10/0.20 of a lesson each) + pass share × condensed lesson (0.15/0.25/0.35) + fail share × full lesson. Pass share: Lanchester 0.4/0.6/0.8, Gilua 0.2/0.4/0.6 **[P]**.
  - CRs carry the CR-rubric noise (lognormal, as in I) and a new registry-count factor 0.85/1.0/1.2 **[M]** (S_mil bootstrap ±12%, S_eng fold error). R8's selection-bias factor and the class-density noise are dropped, because the counts now come from random samples, not from R8's chosen chapters.
- **Light work** = equivalent CRs × (consultation + forge + notebook), as in I.
- **Retention items** = the counted K + S + C (book + added), × I's item factor 0.8/1.0/1.15, instead of R10's 13,600 × pages.
- Added items carry their own factor 0.7/1.0/1.5 **[J]** on CR and items.
- The "dedup" and test-out page shares are no longer parameters; they are counted.

## 2. Why the calendar got longer, not shorter

At the mode (8 h, no phone), everything is 29.9 months (I: 25.1) and the core 24.1 (I: 18.4):

| Component (everything, mode) | I | F | Change |
|---|---|---|---|
| Lessons | 1,671 h | 1,692 h | +1% |
| Consultation, forge, notebook | 345 h | 344 h | 0 |
| Explicit retention | 678 h | 1,135 h | **+67%** |
| Hooks (half already in lessons) | 445 h | 723 h | +62% |
| Projects, articles, build | 220 h | 220 h | 0 |
| Exams | 42 h | 50 h | longer course |

- **Lessons are almost unchanged.** Four things cancel:
  - Lower: the registry's random-sample density (Gilua 0.12 CR/kept page, Lanchester 0.09) is below R8's chosen-chapter density (Gilua core blend 0.13 after bias).
  - Lower: about 3,500 not-needed pages are gone.
  - Higher: 345 added CRs (566 lesson items) with tutor-written text.
  - Higher: 1,100 ref-book pages now taught (Ball, Fleeman, B14/B15 attrition, van Creveld). Test-out holds most of the B14/B15 cost down.
- **Retention is the whole difference.** The counted K + S + C in scope is about 19,400 items (book 16,350 + added 2,240 in the timed tiers ≈ 18,600), against R10's 13,600. Holding every one of them at r = 0.90 costs about +450 h explicit and +280 h of hooks. Most of the extra items are C items: 9,200 in the books, plus 1,060 added.
- **Sensitivity on the item count** (tornado, 8 + 1, mode 26.0 months): items × 0.8 gives 23.7 months; × 1.15 gives 27.8. If C items were held at a lower recall target than K and S, the calendar would move toward I's numbers. That is a design choice for the retention policy, not a modelling error, and the pilot should measure it.

Tornado, everything at 8 + 1 (base 26.0 at the modes):

| Input | Range | Months | Swing |
|---|---|---|---|
| Person factor (EFH at 8 h) | P10 → P90 | 30.1 → 22.1 | 8.0 |
| Is the K1 lesson representative? | 0.85 → 1.3 | 23.9 → 30.1 | 6.2 |
| Reading speed | 110 → 190 wpm | 28.3 → 24.1 | 4.1 |
| CR rubric | P10 → P90 | 24.1 → 28.3 | 4.1 |
| Item count | 0.8 → 1.15 | 23.7 → 27.8 | 4.1 |
| Memory parameters | schema → FSRS default | 24.4 → 28.3 | 3.9 |
| Days lost | 5 → 18% | 24.6 → 28.5 | 3.9 |
| Registry count | 0.85 → 1.2 | 24.4 → 28.1 | 3.7 |
| Keystone top-up | 1.0 → 1.2 | 25.3 → 28.1 | 2.8 |
| Added-item size | 0.7 → 1.5 | 25.1 → 27.6 | 2.5 |

## 3. Corners and floors (8 + 1)

- Optimistic-plausible corner (I's definition: fast path 60%/80%, 170 wpm, representativeness 0.9, memory 0.2, consultation 4, forge 1.5, notebook 1, 6% lost days, person factor 1.1): **everything 18.2, core 14.5 months.**
- Every input at its favourable end at once: everything 8.5, core 6.7 months (P ≈ 0).
- Lessons only, with no consultation, review or projects: everything 18.4, core 14.9 months.
- Strong individual (R9: EFH 7.3 at 8 h): everything P50 23.7, core P50 19.1 months.
- To finish the core in 8 months, every learner minute per page would have to fall to × 0.44 (about 4.4 all-in minutes per raw page, against 10.0 modelled). For everything in 8 months: × 0.36.

## 4. Limits

- The anchor is still one lesson (n = 1). The page part / CR part split (φ) is judgement. Representativeness remains the second-largest swing.
- Added-item sizes (CR, K/S/C, page equivalents) are fixed estimates by importance and status, not counted lessons.
- Test-out pass rates are pilot numbers. Lanchester carries 2,160 weighted test-out pages in core + adv, but the pass rate matters little: pass 0.4 → 0.8 moves everything by only 0.4 months (26.2 → 25.8), because those pages carry few CRs.
- Retention prices every K/S/C item at r = 0.90, as in I. The C count (registry GLM) has the smallest relative error (±12% fold total) but is the largest block.
- Ref tiers (Gilua 315 wpp, Lanchester 838 wpp) are outside the calendar, as in I.
