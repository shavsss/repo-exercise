# R8. Arbiter: one reconciled time model for both apps at full depth

Inputs: CONTEXT, V3, T, R7, R6 (+ `R6_model.py`), A1, A2, A4, A5. New evidence here: hand counts of central results on 14 sampled chapters (192 pages, `R8_samples/`, extracted by `R8_extract.py`), the timestamps of the real lesson logs, and a reconciled Monte Carlo (`R8_model.py`, output in `R8_model.out`; it runs in under 1 s with `python3 -I R8_model.py`).

Evidence tags: **[M]** measured in this round, **[D]** taken from a document in this folder, **[L]** literature, cited from memory and not checked in this session, **[J]** judgement, **[P]** cannot be measured now, so the pilot must measure it.

---

## 0. Verdict

**Scope: everything in both apps (core + adv), full level 2.5, spaced review, 8 projects.** Months to finish, Monte Carlo P10 / **P50** / P90 (N = 20,000):

| Desk h/day | no mobile hour | + 1 mobile hour |
|---|---|---|
| 5 | 25.9 / **30.8** / 36.6 | 22.5 / **26.6** / 31.7 |
| 6 | 22.0 / **26.1** / 31.1 | 19.4 / **23.0** / 27.3 |
| 7 | 20.1 / **23.8** / 28.4 | 17.9 / **21.1** / 25.2 |
| 8 | 18.9 / **22.5** / 26.9 | 16.9 / **20.0** / 24.0 |
| 9 | 18.1 / **21.7** / 26.2 | 16.3 / **19.4** / 23.4 |
| 10 | 17.7 / **21.5** / 26.3 | 16.0 / **19.3** / 23.4 |

**Scope: the core of both apps:**

| Desk h/day | no mobile hour | + 1 mobile hour |
|---|---|---|
| 5 | 19.9 / **23.5** / 27.9 | 17.3 / **20.4** / 24.2 |
| 6 | 16.9 / **20.0** / 23.7 | 14.9 / **17.6** / 20.8 |
| 7 | 15.4 / **18.3** / 21.7 | 13.7 / **16.2** / 19.2 |
| 8 | 14.5 / **17.2** / 20.6 | 13.0 / **15.4** / 18.3 |
| 9 | 13.9 / **16.6** / 20.0 | 12.5 / **14.9** / 17.9 |
| 10 | 13.6 / **16.5** / 20.1 | 12.3 / **14.7** / 17.9 |

**Probability of finishing:**
- **Everything:**
  - P(≤ 6), P(≤ 8), P(≤ 10) and P(≤ 12 months) are 0.00 in every row, 5 to 10 h, with or without the mobile hour.
  - P(≤ 15) peaks at 0.04 (10 + 1).
  - P(≤ 18) is 0.21 at 8 + 1 and 0.32 at 10 + 1.
- **Core:**
  - P(≤ 12) is 0.00–0.07.
  - P(≤ 15) is 0.28 at 7 + 1, 0.43 at 8 + 1 and 0.55 at 10 + 1.

**On R9's evidence-based effective-hours curve** (`R9_long_days.md` §4: EFH/day by month, ±15%, with dense lessons capped at 4.3–5 h/day; §4.5 here), P10 / **P50** / P90 months:

| R9 day | Everything | Core of both |
|---|---|---|
| 7 h | 19.3 / **24.0** / 30.1 | 14.8 / **18.3** / 22.9 |
| 8 h | 18.3 / **22.7** / 28.6 | 14.0 / **17.4** / 21.8 |
| 9 h | 18.5 / **23.1** / 29.1 | 14.2 / **17.5** / 22.1 |
| 10 h | 18.7 / **23.3** / 29.4 | 14.3 / **17.7** / 22.3 |

On this curve, 9–10 h days finish slightly *later* than 8 h, because the gain in month 1 is lost to decline in sustainment by month 4. The R9 day already contains the walk / mobile block, so do not add a separate +1 mobile hour to these rows.

**If he is right that 8–10 h cost him almost nothing** (fatigue slope at its low end, a = 0.07, and no loss of adherence above 6 h):
- everything: 18.2 months at 8 + 1, 16.8 at 9 + 1 and **15.6 months at 10 + 1** (P50; P(≤ 12) = 0.02);
- core: **12.0 months at 10 + 1** (P(≤ 12) = 0.50).

**What fits in 6 and 8 months at full depth** (P50, core first, both apps interleaved):

| Plan | Core done by month 6 | Core done by month 8 |
|---|---|---|
| 7 + 1 h | 38% | 50% (P10–P90: 42–59%) |
| 8 + 1 h | 40% | 53% |
| 10 + 1 h | 41% | 55% (45–67%) |

None of the adv tier is reached by month 8 in any row. "Both apps in about 8 months" is not reachable at full depth with up to 10 + 1 hours a day under any combination this model treats as plausible.

**Closest agent: R6** (P50 for both apps 23.7 months at 7 h, against R8's 23.8 at 7 + 0 and 21.1 at 7 + 1). V3/T are off by 2.5× and R7 by about 3×. The reasons are in §5.

**The single number the pilot must measure first:** **all-in learner minutes per source page.** This is reading + active work + dialogue + forge + notebook + review time, attributed per page, over about 60 pages of 3 book types. V3 implies 4.0 minutes per page; R8's mode is **7.0**.

---

## 1. Every disputed input, side by side

"V3/T" is V3 with A1 and T underneath it. R7 = V3's hours minus 6–12%, plus a mobile hour. Effective pages after dedup and test-out are ≈ 21,100 for both apps in all models.

| # | Input | V3 / T (A1) | R7 | R6 | **R8 (chosen)** | Basis |
|---|---|---|---|---|---|---|
| 1 | Central results (CR) per page | ≈ 0.074 (f_central 0.4 × sections) | = V3 | 0.06 / 0.09 / 0.16 | **0.124 measured** (strict rubric, page-weighted). Per-CR minutes shrink with CR size, exponent 0.3 / 0.5 / 0.8 | [M] §2 |
| 2 | CRs to teach (both, after dedup) | ≈ 1,680 | ≈ 1,680 | 1,900 (P10–P90 1,620–2,820) | **2,750** (2,030–3,770). Smaller each: about 0.75× of A1's | [M] |
| 3 | Dense words per source page | ≈ 225 | = V3 | 150 / 240 / 400 | 160 / **250** / 400 | [D] V3's 3.3–5k words per 1–2 CRs × measured density ≈ 260–340; A2 units × 30 words ≈ 240–360 for K1 |
| 4 | Reading speed, dense Hebrew | 150–220 (≈ 185) | = V3 | 110 / 140 / 190 | 110 / **145** / 190 | [L] adult silent reading ≈ 240 wpm English non-fiction (Brysbaert 2019), slower for study reading; Hebrew packs more per word (prefixes), so fewer words per minute. **[P]** |
| 5 | Active minutes per CR (in lesson) | 12–22 (17) | = V3 | 10 / 15 / 22 at 0.09/page | 10 / **15** / 22 at 0.09/page, scaled to 12.5 at 0.124 | **[P]**, no data |
| 6 | All-in minutes per CR | ≈ 50 | ≈ 45 | 71 | **56** (mode), 60 (MC P50) | output |
| 7 | All-in minutes per source page | **4.0** | ≈ 3.6 | 6.4 | **7.0** | output; the pilot's first number |
| 8 | Post-lesson dialogue / clarify per CR | 0 | 0 | 2 / 5 / 12 | 2 / **6** / 12 | [M] logs §2.4 |
| 9 | Forge beyond in-lesson work | 0 in hours (50 min/day in the day plan) | partly moved to mobile | 0 / 4 / 10 per CR | same | [D] V3's own day plan |
| 10 | Own notebook | 0 (15 min/day in the plan) | 0 | 0 / 1.5 / 5 per CR | same | [D] |
| 11 | Review minutes per item; total review | ≈ 1.0 min; ≈ 210–220 h | ≈ 210, 60% mobile | 0.8 / 1.5 / 3 min + module checks; 314 h | same; **349 h** | [J] a level-2.5 retrieval is not a flashcard |
| 12 | Lesson overhead; generation wait | 0; 0 (factory) | 0 | 2 / 4 / 7 min; factory fails 15–50% | same: 109 h; 85 h | [D] A3 probes not run |
| 13 | Dedup; test-out | MID 13.8%; Lanchester 15%, Gilua 7.5% | same, plus facet collapse etc. 95–170 h | 6 / 13 / 20%; L 3 / 10 / 20%, G 0 / 2 / 5% | R6 values **plus R7's 0 / 60 / 150 h** of collapse, instance compression and project certification | [D] R7 §2 (test-out matches A1 only on descriptive pages) |
| 14 | Projects; articles; build | 110 h; 0; 0 | 110; 0; 0 | 80 / 120 / 200; 10 / 40 / 120; 15 / 40 / 90 | same | [D] A6, V3 build plan |
| 15 | Days lost (holidays, illness, reserve duty) | 3–10% (6.5%) | = A1 | 5 / 10 / 18% | same | [J] Israeli holiday months 3–5%, illness 2–3%, reserve duty 0–8% (unknown) **[P]** |
| 16 | Light week every 7th | not deducted | kept, not deducted | 0.90 / 0.93 / 0.96 | same | [D] V3's own rule |
| 17 | Net study share of nominal hours | 1.0 | 1.0 | 0.85 / 0.93 / 1.0 | same | [D] V3's 5-h day schedules 250 min |
| 18 | Adherence | 1.0 | 1.0 | 0.82 / 0.92 / 1.0, −3% per h above 5 | 0.85 / 0.92 / 1.0 up to 6 h, **−0 / 2.5 / 5% per planned h above 6** | [J] **[P]** |
| 19 | Yield of hours beyond 5–6 | 1.0 ("unmodelled") | 1.0 | hours above 5 × 0.6 / 0.8 / 0.95 | **explicit curve:** hour k > 5 yields 1 − a(k − 5), a = 0.07 / 0.13 / 0.20 (§4.1) | [L] |
| 20 | Mobile hour | – | +1 h; ≈ 200–215 h movable | – | yield 0.70 / 0.85 / 0.95, done on 60 / 80 / 95% of days, **capped at the movable share 10 / 15 / 18%** of all hours | [D] R7 §1.2 **[P]** (R7's U6) |
| 21 | Study days | 6 per week | 6 | 6 | 6 | all agree |
| 22 | Pilot | not deducted | – | +0.25 month | +0.25 month | [D] |
| 23 | Book exercises (3,241 `ex` pages) | out | out | out | out (adds 270+ h if wanted) | – |

---

## 2. Measuring instead of arguing

### 2.1 Rubric for counting central results

A **central result (CR)** is a stated law, theorem, model, design equation or method that meets all three conditions:
- (a) a level-2.5 treatment would give it its own seven facets: structure, derivation skeleton and assumptions, limits, OOM, trade-off, cross-field, critique;
- (b) later material uses it;
- (c) it is not a special case, extension, worked example or restatement of a CR already counted.

Definitions are folded into the CR they serve. Three counts were recorded per sample:
- **strict**: the headline results, i.e. what a one-page chapter summary would list. This is the granularity the tutor itself uses for its "תוצאה מרכזית" labels (L2 of M0.1: 3 labels in 16 pages, 0.19 per page, on a survey chapter).
- **standard**: every result worth its own 10–20-minute production task and review item.
- **liberal**: every named theorem, law or formula.

The model uses **strict**, so that minutes per CR keep their meaning. Standard and liberal show how much finer a tagger could cut.

### 2.2 The 14 samples (text from `eng/app/artifact/lib/text/*.json` and `cache/mil_text.json`)

| # | Source (pdf pp.) | Kind | pp | Strict | Std | Lib | Strict CRs counted |
|---|---|---|---|---|---|---|---|
| S1 | K2 127–142, calculus of variations | derivation-heavy math | 16 | 3 | 4 | 6 | Euler equation (with the fundamental lemma); Hamilton's least-action principle; Euler–Ostrogradsky equation for multiple integrals. Std adds the functional / variational formulation. Lib adds the Euler system and the brachistochrone = cycloid |
| S2 | F1 221–235, ch. 23–24 | Feynman | 15 | 3 | 6 | 9 | forced damped response (ρ, θ); resonance width and Q (including the energy definition); free damped transients (under- and overdamped, initial conditions). Std adds the phasor method and its linearity condition, the LRC/impedance analogue, and mean power |
| S3 | E01 316–330, §4.1–4.2 | signals | 15 | 1 | 3 | 5 | the CTFT pair as the limit of a Fourier series. Std adds the FT of periodic signals as impulse trains and rect↔sinc with the inverse time–bandwidth relation |
| S4 | E05 64–75, ch. 3 | probability | 12 | 3 | 7 | 13 | expectation and its algebra; variance/covariance algebra including σ²/n and AΣAᵀ; conditional expectation (iterated expectations, total variance). Std adds LOTUS, correlation bounds, the random-vector moments and the MGF |
| S5 | B02 96–110 (2 pages image-only) | radar | 15 | 3 | 5 | 10 | radar range equation (Pr ∝ R⁻⁴); thermal noise kT₀FB and SNR; coherent vs non-coherent integration. Std adds the loss budget and the average-power/energy form |
| S6 | B01 199–212 | EW | 14 | 2 | 3 | 5 | J/S for communications and radar, with the R² vs R⁴ asymmetry; burn-through range |
| S7 | B06 189–203 | missiles | 15 | 2 | 4 | 7 | engagement kinematics plus pure pursuit (κ > 1 condition, terminal g blow-up); collision / constant bearing. Std adds the point-mass missile model and lead collision |
| S8 | E13 325–340, §5.2–5.5 | engineering bridge | 16 | 2 | 3 | 6 | plane sections and strain ε = −κy; flexure formula with M = EIκ and the neutral axis through the centroid |
| S9 | B07 44–58 | OR / systems | 15 | 1 | 2 | 5 | engagement timeline under speed mismatch. Std adds the radar horizon R ∝ √h |
| S10 | B09 103–117 | UAV performance | 15 | 3 | 6 | 9 | Breguet range and endurance; (L/D)max and its speeds; rate of climb from excess power. Std adds stall speed, glide and V_E/V_R = 3^(−1/4) |
| S11 | E22 734–745 | computer systems | 12 | 1 | 2 | 3 | locality and the hierarchy illusion. Std adds hit rate, miss penalty and effective access time |
| S12 | E26 53–62 | SE process | 10 | 0 | 1 | 2 | (std: the stakeholder expectations → ConOps → requirements flow) |
| S13 | D5 100–110 | doctrine | 11 | 0 | 1 | 2 | (std: layered IADS + REB structure, an operational model) |
| S14 | B08 25–35 | descriptive | 11 | 0 | 0 | 1 | – |
| | **Pooled** | | **192** | **24** | **47** | **83** | **0.125 / 0.245 / 0.432 per page** |

### 2.3 Weighting to the curricula

Each book was assigned to one of 8 classes, and each class density was weighted by that class's share of effective pages in each app and tier.

| | Strict CRs/page | Main page mix |
|---|---|---|
| Gilua core | **0.148** | 52% example-rich engineering texts (0.097); 25% theorem-dense texts (0.25); K and F 13.5% |
| Gilua adv | 0.158 | |
| Lanchester core | **0.126** | 58% radar/EW/missile texts (0.159); 22% applied (0.096); 15% articles (assumed 0.08); 5% doctrine (0.02) |
| Lanchester adv | 0.112 | |

**Corrections and uncertainty in the model:**
- **Selection bias.** I picked chapters that contain named results, so a whole module's pages are diluted by examples and descriptive stretches. The model applies × 0.75 / 0.87 / 1.0.
- **Per-class sampling uncertainty.** Lognormal, sd 0.45/√n.
- **Rubric judgement.** Lognormal, sd 0.15.

The net density used is **0.124 per page**. It is 1.7× V3's 0.074 and 1.4× R6's mode. **The measurement confirms R6's direction and rejects V3/A1's section-based count.** That count missed the coarse-section books and the theorem-dense texts: Wasserman alone has 3 strict CRs in 12 pages.

### 2.4 What the lesson logs show (`review/*/convs/*/msgs/*.json`, field `ts`)

| Lesson conversation | Lesson generated | Later activity |
|---|---|---|
| Gilua `ktrbl…` | 26.10 07:03 | **27.10, 11:19:55 → 12:07:22**: 5 learner messages (one of 608 words: article ideas), 5 replies of 216–1,884 words. **47 min**, plus ≈ 8 min to read the last reply |
| Gilua `06x36…` | 28.10 07:25 | **29.10, 18:02:40 → 18:38:45**: 2 messages, replies of 2,695 and 2,179 words. **36 min**, plus ≈ 13 min to read the last reply |
| Gilua `th61…` | 27.10 12:49 | none |
| Lanchester `7btt…`, `jf4i…` | 28.10 09:20 and 09:59 | none. The 39-minute gap between them, set against a 10.4k-word lesson, means the first lesson was not fully read before the second was requested |

**Readings from the logs:**
- **Dialogue.** About 83–104 minutes of post-lesson dialogue over 5 lessons, so **≈ 17–21 min per lesson**. At 2.5–4 strict CRs per lesson that is **≈ 5–8 min per CR**: mode 6, range 2–12. The discussions happen the next day, as a separate session, and part of them (article ideas) is authority work.
- **Reading speed** cannot be inferred: no "opened" or "done" timestamps exist. That is a pilot item.

---

## 3. The chosen value of each disputed input, and why

| Input | Chosen (low / mode / high) | Why this value wins | Status |
|---|---|---|---|
| CR density | 0.124 strict (model draws ≈ 0.08–0.19) | 14 hand counts over 8 classes against no measurement at all (V3) or 2 survey chapters (R6) | **[M]**. Pilot: tag 50 random sections with this rubric |
| CR size scaling | exponent 0.3 / 0.5 / 0.8 | Finer tagging means smaller CRs. Without it, the higher density would add 30% instead of about 15% | [J] |
| Active min per CR | 10 / 15 / 22 at 0.09 | No data. A1's and R6's ranges agree | **[P] U2** |
| Words per page | 160 / 250 / 400 | Three independent routes (V3's own lesson size × measured density; A2 units; R6's compression) give 240–340 | [D] |
| wpm | 110 / 145 / 190 | Study reading of dense technical text is far below the 240-wpm leisure norm; Hebrew word counts run low. A1's 185 is the leisure end | [L] **[P]** |
| Dialogue | 2 / 6 / 12 per CR | the logs | [M] (n = 5 lessons) |
| Forge, notebook | 0 / 4 / 10; 0 / 1.5 / 5 | V3's own day plan contains them, but its hours do not | [D] |
| Review | 0.8 / 1.5 / 3 min per item, 5 reviews, 35% credit | A level-2.5 retrieval needs 1–3 minutes. V3's 25-minute cap either binds, which is a silent loss of depth, or costs more than it says | [J] **[P]** |
| Dedup / test-out / R7 savings | R6 + 0 / 60 / 150 h | R7's own recount shows module test-out ≈ A1's assumption only on descriptive pages. Facet collapse and instance compression are new but unmeasured | [D] |
| Calendar haircuts | lost 10%, light weeks 7%, net 93%, adherence 92% | Each is V3's own rule or a standard figure. Together they leave ≈ 0.72 of A1's nominal hours | [D] [J] **[P] U4** |
| Fatigue curve | a = 0.07 / 0.13 / 0.20 | §4.1 | [L] **[P] U4** |
| Mobile hour | ≤ 15% of the work; 0.85 yield; done 80% of days | R7's movable-work recount | [D] **[P] U6** |

Nothing in rows 4, 5, 11, 15, 18–20 of §1 can be measured now. These are exactly pilot units U2, U4 and U6.

---

## 4. The reconciled model

### 4.1 Fatigue and diminishing returns (requested explicitly)

**The curve:**
- Hours 1–5 of a desk day count at full yield.
- Hour k (k > 5) yields **1 − a·(k − 5)**, with a = 0.07 / **0.13** / 0.20.
- On top of that, **adherence** falls by 0 / **2.5** / 5% per planned hour above 6. This is the share of planned hours actually done, sustained over months.

| Desk h/day | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|
| Effective hours, a = 0.13 | 5.0 | 5.87 | 6.61 | 7.22 | 7.70 | **8.05** |
| Effective hours, a = 0.07 | 5.0 | 5.93 | 6.79 | 7.58 | 8.30 | 8.95 |
| Effective hours, a = 0.20 | 5.0 | 5.80 | 6.40 | 6.80 | 7.00 | 7.00 |
| Delivered learner-h per month (mode, all haircuts) | 91 | 107 | 118 | 125 | 130 | **132** |

Going from 7 to 10 desk hours buys **+12%** of delivered learning, not +43%.

**Evidence behind the curve:**
- **Pencavel 2014** [L], hours vs output in munitions work: output per hour is flat to ≈ 49 h/week, falls beyond, and ≈ 63+ h/week added almost nothing. Six days at 8 h = 48 h; at 10 h = 60 h.
- **Ericsson, Krampe & Tesch-Römer 1993** [L]: sustained deliberate practice tops out at ≈ 4 h/day for experts. Dense first-time study is closer to deliberate practice than factory work, so the knee comes earlier.
- **Time-on-task mind-wandering** [D, R7 §1.3]: rises within a session.
- **A1 and T** both flag ">~7 h of dense first-time study" as the point where quality drops, but did not model it.

**What would move the curve:**
- Interleaving modalities (forge, project, review, the other app) is the best argument for a lower a.
- Pilot U4 (late-hour yield vs early-hour yield on day 10–12) sets a directly.

**If he is right** (a = 0.07, no adherence slope), everything takes 18.2 / 16.8 / 15.6 months at 8 / 9 / 10 + 1, and the core 13.9 / 12.8 / 12.0.

### 4.1b R9's curve and the split between dense and lighter hours

**How R9's curve is used** (`months_r9` in the model):
- **Input:** R9's effective full-depth hours per study day (EFH), month by month:
  - 7 h: 5.9 / 5.8 / 5.8 / 5.7
  - 8 h: 6.3 / 6.2 / 6.1 / 6.0
  - 10 h: 6.8 / 6.4 / 6.0 / 5.8
  - 9 h: interpolated
- **Already inside it:** plan adherence and multi-month sustainment.
- **Uncertainty:** a person-level factor of ±15% at P10/P90.
- **Calendar:**
  - 6 study days a week minus lost days (5 / 10 / 18%);
  - a light Friday (≈ 4.3 EFH instead of a full day), × 0.953;
  - one light week in 7 at 55%, × 0.936;
  - monthly exam hours.
- **No net-share haircut and no separate mobile hour**, because R9 counts breaks outside the study hours and its day already contains the walk / pocket block.

**The cross-check holds.** R8's own curve gives 5.7 delivered effective hours per day at 8 h, against R9's 6.0 steady state. The two curves agree within 5%. That is why both put everything at 8 h at ≈ 22.5 months without a mobile hour.

**Which activities can absorb the later hours.** The work splits into two load classes (mode values, everything):
- **D1, dense first pass: 1,499 h (61%).** Reading, in-lesson active work on CRs and support sections, lesson overhead and generation wait. R9 caps D1 at 4.3–5 h before 15:00, worth ≈ 4.1–4.75 EFH.
- **Lighter modes (D2–D4): 955 h (39%).** Review and module checks 349, dialogue 223, forge 149, projects 120, notebook 56, articles 40, build 40, diagnostics 38.

At 8 h steady state (6.0 EFH):
- the work mix needs **3.7 EFH/day of D1**, which is under the cap, and **2.3 EFH/day of light work**;
- so the **total-EFH limit binds, not the D1 cap**;
- the D1 cap would bind only if dense work exceeded ≈ 73% of all work at 8 h (76% at 10 h).

**Two consequences:**
1. **Longer days cannot speed up the dense core.** Hours 9–10 can only carry review, forge, projects, articles and dialogue, which are 39% of the job. Their supply already roughly matches demand at 8 h. Extra late hours therefore move light work forward, not the lessons, and the lessons pace the curriculum. That is a second reason, beside R9's sustainment decline, why 10 h ≈ 8 h on the finish date.
2. **Shrinking light work below ≈ 35%**, for example by cutting review or forge, would not let him go faster either. It would leave late hours with nothing useful to do, and it would cut depth. The only lever that speeds the core is more EFH per D1 hour: naps, exercise, sleep-timed relearning (R9 §4), and fewer minutes per page (the pilot number).

### 4.2 Hours at the mode (deterministic)

| Component | Both apps | Core only |
|---|---|---|
| Reading | 607 | 448 |
| Active work per CR | 557 | 411 |
| Active work on support sections | 141 | 104 |
| Review + module checks | 349 | 262 |
| Dialogue / clarify | 223 | 164 |
| Forge | 149 | 110 |
| Notebook | 56 | 41 |
| Lesson overhead | 109 | 80 |
| Generation wait | 85 | 63 |
| Diagnostics | 38 | 30 |
| Projects + articles + build | 200 | 200 |
| R7 savings | −60 | −45 |
| **Total** | **2,454** (MC P10–P90 2,342–3,198, P50 2,728) | **1,868** (P50 2,081) |
| CRs | 2,614 | 1,926 |
| All-in minutes per CR | 56 | 58 |
| All-in minutes per effective page | **7.0** | 7.2 |

### 4.3 Full results

See §0. The ideal calendar check: the same hours put on V3/A1's calendar (every planned hour delivered at full yield) still give **16.2 months** for everything at 7 h, and 11.4 at 10 h.

So roughly 55% of the gap to V3 is hours (1,400 → 2,450–2,730) and 45% is the calendar.

### 4.4 Sensitivity (everything, 8 + 1 h, others at mode, base 17.6 months)

| Input | Months, low → high end | Swing |
|---|---|---|
| Words per page (160 → 400) | 16.1 → 20.2 | 4.1 |
| CR density (× 0.70 → × 1.42) | 15.9 → 19.9 | 4.0 |
| Active minutes per CR (10 → 22) | 16.3 → 19.5 | 3.2 |
| Base adherence | 19.0 → 16.3 | 2.7 |
| Days lost | 16.7 → 19.4 | 2.7 |
| Dialogue per CR | 16.6 → 19.2 | 2.6 |
| Forge per CR | 16.6 → 19.2 | 2.6 |
| Net study share | 19.1 → 16.5 | 2.6 |
| Review minutes | 16.9 → 19.3 | 2.4 |
| Reading speed | 19.0 → 16.6 | 2.4 |
| Adherence slope above 6 h | 16.8 → 18.6 | 1.8 |
| Fatigue slope | 16.9 → 18.6 | 1.7 |
| Dedup | 18.5 → 16.8 | 1.6 |

**Best plausible corner after the pilot** (wpm 190, 10 min per CR, little dialogue, density × 0.7, 180 words per page, a = 0.07, full adherence, 5% lost):
- everything: 10.2 months at 8 + 1, **8.8 at 10 + 1**;
- core: 6.8 at 10 + 1.

**Only this corner reaches V3's dates.** It needs every one of these inputs to land at its favourable end simultaneously, which has P ≈ 0 in the joint distribution.

---

## 5. Who was closest, and why

**R6 was closest.** Its best estimate for both apps at 7 h (P50 23.7 months, realistic calendar) matches R8's 23.8 at 7 + 0, and its core at 6–7 h (18–20) matches R8's 18.3–20.0. Its four structural claims all survive the new evidence:
1. CR density is higher than V3 counts, and this measurement confirms it (0.124 vs 0.074).
2. V3's own day plan contains about 600 h of work that its hour total leaves out: forge, dialogue, notebook, overhead and waits.
3. V3's calendar delivers every nominal hour at full yield, and ignores its own light weeks.
4. Dense reading speed and review minutes were set at the leisure end.

**Where R6 was slightly off:**
- Its 0.09 density mode was too low. The CR size scaling absorbs most of that.
- Its dialogue mode of 5 is now 6, from the logs.
- It had no explicit fatigue curve and no mobile hour.

These roughly cancel.

**V3 / T (≈ 8 months at 7 h) were furthest.** The arithmetic is right; the inputs are not. V3 implies **4.0 all-in minutes per source page**, while the reconciled estimate is **7.0**, and it puts those minutes on an ideal calendar. The levers V3 identified are correct and remain in the model: dense result-sized lessons, the factory, dedup and review. Only its dates fail.

**R9 (8.5–9.5 months at 8 h)** has the right curve, which R8 adopts, but it also applies it to V3's 1,400 hours. On R8's 2,450–2,730 hours the same curve gives 22.7 months.

**R7 (5.7–7.9 months) correctly added two real multipliers.** The mobile hour is worth −2.5 to −3 months at this scale. R7's work savings are 60–150 h. But R7 stood on V3's 1,400 hours and V3's calendar, so it inherits V3's error and lowers it further.

---

## 6. What the pilot must measure first, and the decision rule

**First number: all-in learner minutes per source page** on about 60 pages across three book types (Kolmogorov or Wasserman type, Oppenheim or Gere type, Richards or EW101 type). Log open → commits → done → dialogue → forge / notebook / review per CR, and divide by the pages covered.

It folds together the top four tornado inputs (words per page, CR density, active minutes, reading speed) plus dialogue and review.

| All-in minutes per source page | Implied hours (both) | Everything at 8 + 1 (modal calendar) |
|---|---|---|
| ≤ 4 | ≈ 1,400 | ≈ 11–12 months |
| 5.5 | ≈ 1,950 | ≈ 15 months |
| 7 (R8 mode) | ≈ 2,450 | ≈ 18–20 months |
| ≥ 8.5 | ≈ 3,000 | ≥ 23 months |

**Second number** (pilot days 8–12): delivered learner-hours per month at the planned daily load, and late-hour yield. This sets a and the adherence slope, which decide whether 9–10 h is worth more than 8. Then:

> months ≈ 21,100 × (minutes per page) / 60 / (delivered hours per month).

---

## 7. Limitations

- **One sample per class** for classes A, B and C. Article density (H, about 15% of Lanchester core) is assumed, not measured. Hand counts are one rater's judgement; a second rater should recount S1–S14 from `R8_samples/`.
- **Two pages of S5 were image-only**, which slightly understates radar density.
- **The fatigue curve and adherence slope are literature-anchored, not measured on this learner.** His claim that 8–10 h are sustainable is modelled as the low-slope scenario, not dismissed.
- **Dialogue evidence is 5 lessons, 2 of them with dialogue.** Dense lessons might reduce clarify time, or increase it.
- **Parameters are independent** except words per page with selection bias (ρ = 0.4). The P10–P90 ranges are therefore narrower than the true structural uncertainty. Read "0.00" as "<1% within this model".

## Files
- `round2/R8_reconciled.md`: this report.
- `round2/R8_model.py`: the reconciled model.
- `round2/R8_model.out`: its full output.
- `round2/R8_extract.py`: extracts the sampled pages.
- `round2/R8_samples/S1–S14_*.txt` and `index.json`: the sampled text the counts were made on.
