# P. Retention, practice and application: the "perfection" system, priced

Inputs: CONTEXT, A_learning_science (§1.1–1.3, 3.1, 3.6, 5.2–5.4), D_landscape (§2, 5, 6), R10 (tiers: K 4,200 / S 4,750 / C 4,670 = 13,600 items, both apps), T (hybrid), A6 (projects), R9 (day blueprint, effective hours).
Model: `P_retention_model.py` (output `P_retention_model.out`). FSRS-4.5 memory equations with default weights, every item simulated day by day, plus Math-Academy-style fractional implicit credit.
Tags: **[M]** modelled here, **[S]** strong evidence, **[E]** moderate evidence, **[J]** judgement, **[P]** the pilot must measure it.

---

## 0. Answer

1. **≥90% recall at 6 and 12 months for every central result, at tier depth, is achievable.** The model gives a mean of **0.95–0.96** at both probes, with the 5th percentile at 0.89–0.91 **[M]**. The cost is lower bounded by the forgetting curve: 4–6 spaced retrievals per item in its first year.
   - Best design: **≈12 min per K item, 5 per S item and 2 per C item**, from learning to 12 months after the course.
   - Flashcard-style design: 24 / 10 / 3.7 min.
2. **The load grows with the stock of items, so it has no steady state while the course runs.**
   - **R10 pace (~17 items/day, all tiers):**

     | | Best design | Naive design |
     |---|---|---|
     | Month 3 | 43 min/day | — |
     | Month 6 | 61 min/day | — |
     | Month 13 | 80 min/day | — |
     | Months 22–27 (peak) | **~105 min/day** | 220 min/day |

     About 40% of the best design's load is recall-first hooks inside lessons. After the course, the load falls to **88 min/day** in months 1–3 and **47 min/day** in months 10–12.
   - **The pace in the brief (17 R8-CRs/day ≈ 84 items/day, both curricula in 5.4 months):**
     - review reaches **4.0 h/day (best design) and 8–9 h/day (naive)** by months 5–6;
     - post-course months 1–3 still cost 3.4 h/day.

     **Perfect retention and finishing in a few months are incompatible.** This is the binding limit, and it is arithmetic, not motivation.
3. **The price over R10:** retention work (explicit reviews plus hooks) totals 1,013 h during the course, against the 377 h that R10 budgeted.
   - If hooks replace prerequisite recap paragraphs (about half), the net cost is **+410 h ≈ +3.4 months** on R10's P50 (27.8 → ~31 at 8 + 1).
   - It is **≈ +1.5 months** if the explicit part runs in ~35 min/day of genuinely extra dead time (pocket mode) on top of R10's mobile hour.
4. **Retention target costs (R10 pace, FSRS default memory):**

   | Retention target | Total hours | Change vs 0.90 |
   |---|---|---|
   | 0.85 | 2,404 h | −14% |
   | **0.90** | **2,793 h** | — |
   | 0.95 | 4,363 h | **+56%** |

   **Use 0.90.** Setting the tiers at K 0.90 / S 0.87 / C 0.85 saves only 1%, so give every tier 0.90 and honour "no compromise".

---

## 1. Target and model

### 1.1 Definition of the target

**"Recalled"** means that, at an unannounced moment and with no notes, he passes the tier rubric:

| Tier | To pass he must… |
|---|---|
| **K** | Rebuild the structure; name where each assumption enters; state 2 limits; give 1 number within 20% by mental derivation |
| **S** | Give the assumptions and 1 limit; give the number within 30%; name the K it serves |
| **C** | Give the definition with its conditions, plus one correct use |

**KPI:** the share of probed items passed in the monthly held-out exam (§3), stratified by item age.
- The target is ≥90% at ages of 6 and 12 months.
- In the model this is the mean predicted recall R at those ages. FSRS's scheduler keeps every item's R at or above its target r.

### 1.2 Evidence that sets the parameters

| Finding | What it sets |
|---|---|
| Spacing is robust, and the optimal gap is ~5–10% of a 1-year retention interval (Cepeda 2008) **[S]** | Intervals grow to months |
| Expanding vs uniform spacing: **no difference** (Latimier, Peyre & Ramus 2021, g = 0.034) **[E]**. Expansion pays off when testing is frequent | Use FSRS's adaptive intervals for **workload**, not as a law. First gap ≥ 1 night |
| Successive relearning: 3 spaced correct recalls more than doubled retention vs 3 in one session (68% vs 26%; Rawson et al. 2018). About a letter grade in real courses (2013) **[E]** | Criterion = 1 correct retrieval per session |
| Bahrick 1993: longer gaps (56 vs 14 d) cost a little during training and gave much higher retention at 1–5 years; *more sessions* and *spacing* add independently **[E]** | Lapse cost is worth paying |
| Conceptual course knowledge without rehearsal: about 2/3–3/4 retained at 1 year and <50% at 2 years (Custers 2010) **[E]** | Integrated schemas decay slower than flashcards. This justifies the "schema" memory variant, but only the pilot can confirm it **[P]** |
| Retrieval works for complex material when the task demands **production** of the structure (Karpicke & Aue 2015; Pan & Rickard transfer d ≈ 0.40) **[E]** | Review = rebuilding and using, not recognition |
| Sleep: evening study plus morning relearning needs half the trials and retains better at 1 week (Mazza 2016) **[E]** | Morning warm-up relearns yesterday's items |
| FIRe (Math Academy): practising B gives fractional, discounted credit to A when B encompasses A; there is no independent RCT (Skycak) **[J]** | Hooks get credit w = 0.25–0.5, and zero when they come too early |

### 1.3 Model assumptions [J, P]

**Per-review costs:**

| Tier | Minutes per review | Extra minutes on a lapse | Difficulty D |
|---|---|---|---|
| K | 3.0 | 6 | 7 |
| S | 1.3 | 2.5 | 6.5 |
| C | 0.5 | 0.8 | 5.5 |

**Starting stability:** about 6 days. That is the FSRS "good" value × 1.6, for the same-day rebuild plus the next-morning relearning.

**Implicit uses:**
- Each item's later uses follow R10's measured fan-out: K median 16 / mean 25.5; S 3 / 9.7; C 9 / 10.7.
- Use dates are spread exponentially over about 150 days.
- A use becomes a *recall-first hook* only if R ≤ 0.95. Otherwise it is too early, earns no credit and costs nothing.
- Hook cost and credit:

  | Tier | Hook cost (min) | Credit w |
  |---|---|---|
  | K | 0.75 | 0.5 |
  | S | 0.4 | 0.4 |
  | C | 0.15 | 0.25 |

- A failed hook is relearned on the spot and counted as a lapse.

**Bundling:** a K's explicit review carries its attached S items as 30-second hooks, with credit 0.7.

**After the course:** projects, articles and interviews keep using 35% of K and S items, about every 45 days.

**Best design adds four levers on top:**
- **Schema memory:** starting stability ×2 and stability gain ×1.3 **[P]**.
- **Composite tasks:** one 5-min task retrieves about 3 items, so cost ×0.6 **[J]**.
- **Designed hooks:** 1.5 hooks per using module, against 0.6 when incidental.
- **Per-tier targets:** K 0.90 / S 0.87 / C 0.85.

### 1.4 Results [M] (R10 pace, 13,600 items, 800 study days + 365 days after)

| Scenario | Peak min/day (explicit + hooks) | Last 90 course days | After the course, m1–3 → m10–12 | Recall at 6 / 12 mo (5th pct) | Min/item K / S / C |
|---|---|---|---|---|---|
| FSRS default, no credit (flashcards) | 226 | 221 + 0 | 149 → 88 | .95 / .94 (.91) | 25.5 / 10.7 / 3.5 |
| FSRS default + incidental credit | 217 | 170 + 39 | 164 → 75 | .96 / .96 (.91) | 24.2 / 10.0 / 3.7 |
| r = 0.95 | 330 | 323 + 4 | 234 → 117 | .97 / .98 (.95) | 38.1 / 15.8 / 5.3 |
| Schema memory, r = 0.90 | 166 | 124 + 32 | 132 → 60 | .96 / .96 (.91) | 17.6 / 7.8 / 2.8 |
| **Best (all four levers)** | **106** | **62 + 43** | **88 → 47** | **.96 / .95 (.89–.90)** | **12.0 / 5.3 / 1.8** |
| Best, all tiers r = 0.90 | 106 | 67 + 38 | 86 → 45 | .96 / .96 (.91) | 11.7 / 5.6 / 2.0 |
| Best but FSRS default memory (pessimistic) | 145 | 91 + 51 | 111 → 51 | .95 / .95 (.87–.88) | 16.1 / 6.9 / 2.4 |
| **Brief pace (84 items/day, 162 d), best** | **258** | 127 + 110 | 205 → 62 | .95 / .95 (.88) | 10.0 / 4.4 / 1.5 |
| Brief pace, naive | 597 | 578 + 0 | 381 → 149 | .95 / .94 | 21.8 / 9.1 / 3.1 |

**Curve, best design, R10 pace (min/day, explicit + hooks):**

| Month | Explicit | Hooks | Explicit items/day |
|---|---|---|---|
| 1 | 6 | 5 | 4 |
| 3 | 24 | 19 | 16 |
| 6 | 33 | 28 | 22 |
| 10 | 39 | 37 | 27 |
| 13 | 43 | 37 | 30 |
| 19 | 51 | 44 | 36 |
| 25 | 62 | 44 | 44 |
| 28 (course ends) | 76 | 11 | 49 |
| 31 | 62 | 9 | 43 |
| 37 | 41 | 10 | 28 |

**Reading the results:**
- **Encompassing alone saves ~20%** (226 → 217 at peak, 2,926 → 2,319 explicit hours).
- Together with composites and schema-integrated learning the saving is **~50%**.
- Desk-equivalent hours fall from 2,926 to ~1,413 over the course plus a year.
- The pessimistic memory case (FSRS defaults) is +37%. **The pilot's first retention number to fit is the personal FSRS weights after ~1,000 graded reviews (week 4–6).**

---

## 2. Review that is practice and application

One queue across both apps. The nightly factory builds it from both databases, which the cloud session can read. Each task is generated *for the item's tier* and draws its keys from the source pages. 60% of slots are **composite**, covering 2–4 items, preferably from different modules and apps (interleaving pays most when the categories are similar but must be discriminated: Brunmair & Richter 2019 **[E]**; Rohrer 2020 classroom d ≈ 0.83).

| Format | Retrieves | Time | Doubles as |
|---|---|---|---|
| **Rebuild** (K): skeleton, the assumption at each step, 2 limits | K | 3 min | derivation practice |
| **Estimate with an interval + confidence** ("Pd at 1.5× range?") | K number + S assumption | 1–2 min | calibration log (Brier, 90% hit rate) |
| **Spot the error** (a planted error in a derivation, or a real published claim from P12) | K/S limits | 2–3 min | critique, i.e. authority |
| **Explain to an editor** (90-s voice, graded on structure / assumption / number / implication) | K + S | 2 min | article sentences |
| **Cross-domain match** (3 items, shared structure + where each breaks) | 3 K | 4–5 min | Gentner comparison; fieldmap |
| **Mini design decision** (choose N, τ, aperture…, justify the trade-off) | K + 2 S | 4 min | project and interview judgment |
| **Which one, and why** (discriminate confusable pairs across the apps) | 2 similar items | 1 min | interference counter (§6) |
| **Define with conditions** (C) | C | 20 s | reading the literature |

**Pocket mode** (phone, ≤5-min units):
- voice answers transcribed and graded by the default model, with Opus on dispute;
- estimates and "which one" items need no typing;
- rebuilds are queued for the desk.

**Grading** uses Opus keys built from the source pages, scores 0–4 per facet and feeds FSRS.
- "From memory? yes/no" is logged. Looking before answering earns no credit.

---

## 3. Mastery: what counts as "proven"

| Tier | Proven when, with no help |
|---|---|
| **K** | **3 passes on unannounced delayed checks** at ≥21, ≥60 and ≥120 days (full rebuild ≥ 3/4 on every facet), **plus one application**: a project validation row matching the book number to tolerance, or a held-out problem from unseen pages. Confidence must also be calibrated, i.e. not "sure" on a failed item. |
| **S** | 2 delayed passes (≥21 and ≥60 d): assumption, limit, number within 30%, and the K it serves. |
| **C** | 1 delayed pass at ≥30 d (definition with its conditions), plus correct use in a sampled sentence. |

**Delayed unannounced checks:** about 10% of queue slots are drawn *off schedule*, from items not due. They measure the true R (unbiased by the scheduler) and calibrate FSRS.

**Held-out exams:**
- **Monthly, 60 min, 30 items:** stratified by tier and by month learned. 20% are novel variants from pages the lessons never used. No app, no notes, voice or paper. **This is the ≥90% KPI.**
- **Quarterly, 2-hour oral viva** (voice examiner with follow-ups) across both apps.

**Projects, articles and interviews as evidence and as review:**
- an article draft written **from memory first** logs retrievals of every item it cites (credit as hooks; lapses are logged);
- a project validation table = K application evidence;
- interview prep (the predicted strong answer written before the interview) = retrieval;
- the expert's corrections = lapse entries plus failure-ledger items;
- a published claim later corrected = a calibration data point.

---

## 4. Application pipeline: every module yields reusable assets

The nightly factory drafts; he accepts, edits or rejects with one tap; rejections tune the prompt. Assets are stored per app under `profile/assets/<type>/<id>`, with a nightly cross-app mirror in `notes/ASSETS.md`. Each asset is tagged with item ids, so reviewing an item also surfaces its assets.

| Asset | Per module | Course total | Contents |
|---|---|---|---|
| **Claim card** | 3–5 | ~1,900 | claim, number + units + range, certainty %, source page, "what would change it" |
| **Interview question + strong-answer rubric** | 2–3 | ~1,200 | ladder fact → mechanism → trade-off → counterfactual → "what do people get wrong"; what a strong answer contains; red flags; expert type |
| **Article angle** | 1 | ~480 | "one equation, three places it breaks", "the number behind the headline", myth vs number; novelty score |
| **Failure-ledger entry** | 0–2 | ~400 | a real case where an assumption broke, its tie to items, the lesson |

**Resurfacing:**
1. Inside the review queue as application prompts ("you're interviewing a seeker engineer: ask the second question; the rubric grades it").
2. A weekly **editor's desk** (Friday, 45 min): pick 1 angle with ≥5 proven claim cards → outline from memory → draft.
3. Before every interview, an auto-built kit from the claim cards and questions linked to that expert type.

**Month 2–3:** by week 6 ~150 claim cards and ~80 questions exist in the first parts (P0–P1, M2.1–2.15), enough for the first article (A6's P12 claims checker / link lab) and the first interview. Flagship A follows in weeks 6–8.

---

## 5. Time: where it fits

**Best design, R10 pace, minutes per day:**

| | Months 1–6 | Months 7–18 | Months 19–27 | After the course |
|---|---|---|---|---|
| Hooks inside lessons (replace recap text) | 5–28 | 28–40 | 40–44 | 9–12 (projects, articles) |
| Desk warm-up (sleep-timed relearning + due K rebuilds) | 10 | 15 | 20 | 20 |
| Pocket mode (walks, commute, queues) | 0–25 | 25–35 | 35–45 | 25–60 |
| **Total** | **11–61** | **60–90** | **90–106** | **88 → 47** |

**Dense day (8 + 1, R9 blueprint):**
- the 07:30 warm-up becomes 15–20 min: yesterday's items plus due rebuilds;
- hooks run in lesson openings;
- the R9 15:50 walk is pocket mode, 30 min;
- add another 15–30 min of pocket time across the day;
- Friday holds the monthly or weekly exam and the editor's desk.

**Light day (4–5 h):** pocket mode only, 30–45 min. FSRS load-balancing spreads the backlog; a skipped Saturday costs <1% in recall **[J]**.

**Calendar effect vs R10's P50 (27.8 months at 8 + 1):**
- **+3.4 months** if all explicit review takes desk time;
- **+1.5 months** if ~35 min/day of extra pocket time is found;
- **≈ +0.5 months** if projects and articles are also written from memory first and counted as hooks. This assumes ~250 h of explicit review is replaced **[J, P]**; it is not modelled.

**The brief's pace** (both curricula in ~5.5 months) **cannot hold this retention in any day:** at its month 5 review alone needs 4–9 h.

---

## 6. Limits and counter-measures

| Limit (evidence) | Counter-measure | Effect |
|---|---|---|
| **The forgetting curve:** without reviews, conceptual knowledge falls to ~70% at 1 y and <50% at 2 y (Custers) **[E]** | FSRS at r = 0.90. Successive relearning to criterion. Never a first gap of less than one night | holds ≥ 0.9 |
| **Load ∝ stock**, with no steady state during the course **[M]** | Encompassing hooks (designed, not incidental), composites, bundles of S under K, dedup across the apps (teach once) | −50% |
| **Cost of 0.95 retention:** +56% **[M]** | Stay at 0.90 and spend the saving on applications | — |
| **Interference across the two apps** (similar structures, notation, dB and sign conventions: Kalman vs α-β track filter; radar equation forms; Lanchester ODE vs epidemic ODE) | (a) teach once, plus `same-structure` edges with a "where it breaks" note; (b) **"which one, and why" discrimination pairs**, generated from lapse logs (each confusion becomes a pair); (c) one canonical notation and conventions card per structure; (d) interleave similar items in the same session (Brunmair & Richter: interleaving helps most for similar categories); (e) interpolated tests cut proactive interference (Szpunar et al. 2013) | turns interference into transfer |
| **Fluency illusion:** felt recall > real recall (Deslauriers 2019) **[S]** | Unannounced off-schedule probes and held-out exams are the only KPI. Show the calibration curve | honest metric |
| **Unverified memory parameters** **[P]** | Fit personal FSRS weights at ~1,000 reviews (weeks 4–6). Rerun `P_retention_model.py` with them | ±37% range |
| **Hooks give unknown credit (FIRe unvalidated)** | Log hook-vs-probe outcomes. If hook credit < 0.3, raise explicit reviews | ±15% |
| **Sleep and fatigue** | Morning relearning (Mazza 2016); no new dense study after 20:00; pocket review counts as light (D3/D4) load | protects encoding |

## Sources
- [Latimier, Peyre & Ramus 2021, Educ Psychol Rev (expanding vs uniform)](https://link.springer.com/10.1007/s10648-020-09572-8)
- [Rawson, Vaughn, Walsh & Dunlosky 2018 (successive relearning)](https://www.retrievalpractice.org/archive/2018/successive-relearning); [Dunlosky et al., successive relearning guide](https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-successive-relearning-dunlosky-greve-badali-wissman-rawson.pdf)
- [Bahrick et al. 1993, Psychological Science](https://digitalcommons.fiu.edu/psychology_fac/50)
- [Custers 2010 review, as summarized](https://www.globalfamilydoctor.com/Resources/A-Ztopiclisting/JournalWatch/Reasonablelong-termretentionofbasicscienceknowledgeindoctors.aspx); [Med Sci Educ 2017 citing Custers](https://link.springer.com/10.1007/s40670-017-0431-3)
- [FSRS optimal retention wiki](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-optimal-retention)
- [Skycak, FIRe / The Math Academy Way](https://www.justinmath.com/); [Hecker's notes](https://frankhecker.com/2025/02/14/math-academy-part-7/)
- Everything else as cited in A_learning_science.md and R9.
