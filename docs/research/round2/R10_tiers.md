# R10. Required depth: tiers of central results, measured and costed

Inputs: CONTEXT, R8 (`R8_reconciled.md`, `R8_model.py`, `R8_samples/`), A2, A1 §1.4 and §3, A6, and the level-2.5 `<goal>` with rules 5א–14 in `eng/app/src/prompt.ts` (Lanchester: rules 6א–6ד and 17–19, 38–40 in `core/app/src/prompt.ts`).

New work in this round:
- re-extracted **119 items** from the 14 R8 samples (192 pages);
- two raters plus an adjudication pass, with objective keystone signals computed from the full text of both libraries;
- a tier-aware Monte Carlo built on R8's calendar.

Scripts: `R10_items.py`, `R10_classify.py` (→ `R10_classify.out`) and `R10_model.py` (→ `R10_model.out`).

Evidence tags as in R8: **[M]** measured here, **[D]** from a document in this folder, **[J]** judgement, **[P]** only the pilot can measure it.

---

## 0. Answer

1. **"Full 7-facet treatment for every item" is not the required depth, and it is not what R8 costed.** Taken literally, it means all seven facets plus forge and review for every definition, special case and worked example.
   - That is about **13,600 items** for both apps, **7,200 h**, and **58 months at 8 + 1 h** (P10–P90 47–72).
   - R8's ~2,750 "CRs" were already *headline* results, with satellites folded in and costed only as reading.
2. **The rubric (§1) puts the 119 measured items into three tiers.** K (keystone) gets all 7 facets + forge + spaced review. S (supporting) gets definition, structure, origin/assumptions, limits and one number, and is reviewed through its keystone. C (context) gets a precise definition and where it is used.
   - The measured split is **K 31% / S 35% / C 34%** **[M]**.
   - Inter-rater agreement: Cohen κ = **0.65** (raw 76%, linear-weighted κ 0.73). Every disagreement was one tier apart: none between K and C.
3. **The surprise: tiering does not shorten R8. It lengthens it.** The rubric finds **37 keystones where R8 counted 24 strict CRs** in the same pages.
   - 21 of R8's 24 strict CRs are K.
   - R8 also folded 16 further load-bearing results into its CRs: antenna aperture, RCS, R⁻² spreading, impedance, phasors, rect↔sinc, σ²/n, the covariance matrix, correlation, energy on target, M = EIκ, radar horizon, the kill chain, cost exchange, layered IADS and the SE flow.
   - R8 also gave the ~35% of S items no work beyond reading.
   - Doing what "required depth" actually requires costs **+37%** over R8 (§3.4 waterfall).
4. **New calendar, P50 months (P10–P90), principled tiers, R8 calendar, + 1 mobile hour:**

| Desk h/day | Everything (both apps) | Core of both |
|---|---|---|
| 7 + 1 | **29.3** (24.2–35.9) | **22.2** (18.5–27.2) |
| 8 + 1 | **27.8** (22.9–34.1) | **21.1** (17.5–25.9) |
| 9 + 1 | **26.9** (22.2–33.3) | **20.5** (16.9–25.3) |
| 10 + 1 | **26.7** (21.7–33.2) | **20.3** (16.6–25.2) |

   - With the safeguards of §4 (promotion of ~15% of S to K, exams across all tiers): **+2.4 months** (everything 30.2 at 8 + 1, core 23.0).
   - With **keystone clusters** (facets 5–7 and forge written once per cluster of co-taught keystones; an unmeasured **[P]** parameter): everything 25.8, core **19.7** at 8 + 1. That is the only lever found here that buys months without cutting a facet.
   - R8, for reference: 20.0 / 15.4 at 8 + 1.
5. **What the learner gets from tiering is depth, not time.** The tiers make visible, and testable, a choice that R8 left implicit and cheaper than the goal demands. "No compromise" is honoured by the tier plan, not by the literal plan, which no authority actually holds (§4).

---

## 1. The rubric: required depth by what an authority must DO

### 1.1 What the goal demands

The `<goal>` says that each central result must produce "an authority … above all in judgment questions that cross fields", through seven facets. Read as *capabilities*, an authority must be able to do five things:

| # | Capability | Facets it needs |
|---|---|---|
| D1 | **Wield**: estimate in the head, decide a trade-off, size a system | magnitude, trade-off, structure |
| D2 | **Transfer**: see the same structure in another field and use it there | shared structure (Lanchester: operational meaning) |
| D3 | **Catch**: spot the error of an AI, a book or an engineer | critique, limits, origin |
| D4 | **Check**: follow a derivation and say where an assumption enters and when it breaks | origin, limits, structure |
| D5 | **Read**: follow the professional literature and talk to experts in their terms | precise definitions, notation, typical numbers |

**No authority holds every lemma at D1–D3.** What separates the expert from the reader is the set of results they can *wield, transfer and catch with*. Everything else they can *check* (D4) or *read* (D5). This set of results is exactly the load-bearing set.

### 1.2 The three tiers

**Nothing is skipped: every item is taught. The tier sets how much work an item gets, not whether it is learned.**

| Tier | An authority must be able to… | What the lesson gives | What the learner does | Review |
|---|---|---|---|---|
| **K, keystone** | D1 + D2 + D3, and D4 for itself | All 7 facets (rule 10), a definition block (5א), a formula block (5ב), a full domain block, think-before-reveal, `keep` | Commit before the reveal, a forge item, an entry in his notebook | Own spaced-review item(s), ~5 reviews; in every module quiz |
| **S, supporting** | D4: follow and check it, recognise it in context, and give its number | A full mathematical definition with every assumption (5א), structure, origin (where each assumption enters), limits, one number with a mental estimate, and one sentence naming the K it serves and where it returns. Its trade-off, shared structure and critique are written *inside the K it serves, by name* | One commit (predict the number or locate the assumption) | Through its keystone's review items; sampled in held-out exams |
| **C, context** | D5: read it correctly | A precise definition with its conditions (not a description), and where it is used. Book examples and figures stay in full (rule 8) | Reads | Sampled in exams (one-line definition) |

### 1.3 The test

This is a decision rule, not an impression. It is also what rater B applied.

An item is **K** if both of the following hold:
1. **Objective load signal:** F1 (textual fan-out: used in ≥ 8 other modules of the two apps) **or** F2 (used in an A6 project model or validation table);
2. **Load type:** F3 (invoked in an engineering or operational judgement: a number, a go/no-go, a claims check) **or** F4 (the same structure carries weight in ≥ 2 other fields).

A definition or descriptive fact (F6) is K only if F4 also holds. Example: RCS is a definition, but its scattering-cross-section structure recurs in sonar target strength and in physics.

Otherwise:
- **S** if it is a step, lemma, special case, extension or practical form of another item (F5);
- **C** if it is a definition, notation, taxonomy, worked example or descriptive fact (F6).

**If in doubt, take the higher tier.** In production the app runs the objective half (F1, F2) and the tutor answers F3–F6; §5 gives the instructions.

### 1.4 Why each tier is justified by the goal, not by convenience

**K:** the seven facets are what the goal lists, and they are aimed at judgement and crossing fields. The rubric sends the full treatment to exactly the items that are used in judgement and that cross fields. The objective signals in §2.4 confirm it:
- **73%** of K items are used in a project, against 7% of S and 0% of C;
- **73%** of K items appear in both apps, against 45% of S and of C.

**S:** the four facets it keeps (structure, origin, limits, magnitude) are the ones D4 needs. The three it does not get on its own are trade-off, shared structure and critique. These belong to a *system-level* result, not to a lemma:
- "What is the trade-off of the fundamental lemma of the calculus of variations?" has no honest answer. The trade-off belongs to the Euler–Lagrange equation it serves.
- An S item's critique is usually *the K's critique*, e.g. "σ²/n assumes independence; correlated interceptor failures break the leakage arithmetic". The S rule requires the S item to be named there.

**C:** for a definition, the facets are vacuous ("what is the order of magnitude of 'sign convention'?"). What the goal needs from a definition is precision and its conditions. The repo's own rule 5א already demands exactly that.

---

## 2. Measurement: 119 items in 192 pages, two raters

### 2.1 Re-extraction

**What the list contains.** R8 counted 24 strict / 47 standard / 83 liberal items. Here every *named result, model or method* and every *definition, taxonomy, worked example or typical number the chapter teaches* was listed: **119 items**. The list is `R10_items.py`, with name, kind, signature regex and A6 project use.

| Kind | n | K | S | C |
|---|---|---|---|---|
| RES (law / theorem / formula) | 58 | 27 | 30 | 1 |
| MOD (model / method) | 13 | 7 | 5 | 1 |
| DEF (definition / notation) | 11 | 3 | 2 | 6 |
| FACT (taxonomy / example / fact) | 37 | 0 | 5 | 32 |

### 2.2 Raters

- **Rater A (holistic).** One pass over the list, asking only "what must an authority DO with this?".
- **Rater B (feature rule).** A second pass that coded F3–F6 per item from the item text and the sample. B then applied the fixed rule of §1.3 to those codes, F1 computed from the libraries and F2 taken from A6.
  - **F1** comes from `R10_classify.py`: for each item's regex, the number of *other* modules (both apps, core + adv, main/supp/article text, articles capped at 80 pages) with ≥ 3 hits.
  - The threshold of 8 was fixed before agreement was computed: about one mid-size part.
- **Adjudication.** Each of the 28 disagreements was resolved with a written reason (`ADJ` in `R10_items.py`). The adjudicator overruled F1 only where the regex was visibly polluted or blind:
  - polluted: "functional" matched "functional requirements"; "curvature" and "equations of motion" are generic phrases;
  - blind: Q and EI cannot be matched as bare letters.

### 2.3 Agreement [M]

| | A vs B | Adjudicated vs A | Adjudicated vs B |
|---|---|---|---|
| Raw agreement | 0.76 | – | – |
| Cohen's κ | **0.65** | 0.92 | 0.72 |
| Linear-weighted κ | 0.73 | – | – |

Confusion matrix (rows = A, columns = B):

| | B: K | B: S | B: C |
|---|---|---|---|
| **A: K** | 24 | 9 | 0 |
| **A: S** | 16 | 27 | 3 |
| **A: C** | 0 | 0 | 40 |

- **C is unambiguous:** 40 of 40.
- **All the disagreement is on the K/S boundary.** B was more generous with K: an item with high fan-out that also serves another item, such as covariance or the SNR form of the RRE.
- **Robust to the F1 threshold:** κ is 0.70 / 0.65 / 0.70 at thresholds 4 / 12 / 20.
- **Caveat:** both raters are the same model in one session. This shows that the *rule* reproduces the *judgement* at κ ≈ 0.65. It does not show that two humans would agree. A blind second rater (an Opus session given only `R8_samples/` and §1) is the next step, with a target of κ ≥ 0.6.

### 2.4 Objective keystone signals by final tier [M]

| Final tier | n | Fan-out (other modules), median / mean | Used in both apps | Used by an A6 project | Downstream modules of its home module (prereq graph) |
|---|---|---|---|---|---|
| K | 37 | **16** / 25.5 | 73% | **73%** | 41.4 |
| S | 42 | 3 / 9.7 | 45% | 7% | 31.9 |
| C | 40 | 9 / 10.7 | 45% | 0% | 25.6 |

- **P(a K item has higher fan-out than an S item) = 0.75.**
- **C has more fan-out than S.** Vocabulary such as "initial conditions", "binomial" or "battalion" appears everywhere. That is why the rubric needs the F3/F4/F6 tests and cannot run on fan-out alone.
- **Project use is the cleanest single signal.**

### 2.5 Distribution per book type (adjudicated; items per page) [M]

| Class (R8) | Sample(s) | Pages | K / page | S / page | C / page | Shares K / S / C |
|---|---|---|---|---|---|---|
| A Kolmogorov survey math | S1 | 16 | 0.06 | 0.38 | 0.06 | **12 / 75 / 12%** |
| B Feynman | S2 | 15 | 0.33 | 0.20 | 0.20 | 45 / 27 / 27% |
| C theorem-dense (Wasserman) | S4 | 12 | **0.50** | 0.42 | 0.33 | 40 / 33 / 27% |
| D engineering textbook | S3, S8 | 31 | 0.13 | 0.26 | 0.19 | 22 / 44 / 33% |
| E radar / EW / missile | S5–S7 | 44 | 0.25 | 0.20 | 0.23 | 37 / 30 / 33% |
| F applied / systems | S9–S12 | 52 | 0.17 | 0.17 | 0.21 | 31 / 31 / 38% |
| G doctrine / roles | S13, S14 | 22 | 0.05 | 0.09 | 0.23 | **12 / 25 / 62%** |
| **Pooled** | 14 | 192 | **0.19** | **0.22** | **0.21** | **31 / 35 / 34%** |

Page-weighted to the curricula (main + 0.5 supp + 0.35 articles; articles = class F × 0.08/0.096, as in R8):

| App and tier | K / page | S / page | C / page | Shares K / S / C |
|---|---|---|---|---|
| Gilua core | 0.24 | 0.29 | 0.22 | 32 / 39 / 30% |
| Lanchester core | 0.21 | 0.18 | 0.22 | 34 / 30 / 36% |

Totals after dedup, test-out and the selection-bias correction (mode):

| | K | S | C | All items |
|---|---|---|---|---|
| Both apps | **4,200** | 4,750 | 4,670 | 13,600 |
| Core of both | 3,110 | 3,530 | 3,450 | 10,100 |

### 2.6 R8's strict CRs against the tiers

**R8's strict count ≈ the K tier, at a coarser cut.**
- 21 of R8's 24 strict CRs are K. The 3 exceptions are Hamilton's principle (2 modules use it, no project), the Euler–Ostrogradsky extension, and "plane sections stay plane", which serves the flexure formula.
- 16 items R8 did not count as strict are K: phasors, impedance, rect↔sinc, σ²/n, correlation, the covariance matrix, R⁻² spreading, antenna aperture, RCS, energy on target, M = EIκ, the kill chain, radar horizon, cost exchange, the SE flow and layered IADS.

Each of the 16 passes the objective test. They were inside R8's CRs, sharing the CR's minutes (R8 scaled minutes per CR by size, exponent 0.5).

**So the answer to "is full 7 facets for every CR what required depth means?" has two halves:**
- **At R8's granularity, almost yes:** R8's CRs are keystones. But each R8 CR is a *cluster* of 1.5 keystones plus 2 supporting items, and R8 gave the satellites no time of their own.
- **At item granularity, no:** 69% of items are S or C.

---

## 3. Re-running the time model

### 3.1 Construction (`R10_model.py`)

**Reused unchanged from R8:** inventory, supplement and article weights, dedup and delta cost, test-out, selection bias (applied to K and S only), reading speed, and the whole calendar (fatigue curve, adherence, lost days, light weeks, monthly exams, mobile hour, R9 curve).

**Replaced:** the work per page.
- **K items** get exactly R8's per-CR minutes (active, dialogue, forge, notebook, 5-fold spaced review), using **R8's own size scaling evaluated at the K-item density**. K items are about 0.65× an R8 strict CR, so they get 0.67× its minutes.
- **S and C minutes and all word budgets** are built bottom-up from A2: 26.5 words per depth unit after compression, with the units counted per facet.
- **Lesson words are built from the tiers** instead of a flat 250 per page. Lessons = words ÷ 2,600–3,200–4,000 words (R8 implied ≈ 3,230).

| Per item (low / mode / high) | K | S | C |
|---|---|---|---|
| Lesson words | 500 / **750** / 1,100 (≈ 22 units: 7 facets, definition, derivation skeleton, plus formula blocks; A2's full-template sections ran 1,032–1,167 words for a keystone *with* its satellites) | 180 / **280** / 420 (≈ 9 units) | 50 / **80** / 130 (≈ 3 units) |
| Active (commit / think) | R8 `act_cr` 10 / 15 / 22 × size (**≈ 10 min**) | 2 / **3.5** / 6 | 0 / 0.5 / 1.5 |
| Dialogue | R8 2 / 6 / 12 × size (≈ 4) | 0 / 0.3 / 1 (R8's logs already include satellite talk) | 0 / 0 / 0.3 |
| Forge | R8 0 / 4 / 10 × size (≈ 2.7) | – | – |
| Notebook | R8 0 / 1.5 / 5 × size | 0 / 0.3 / 1 | – |
| Review | R8: 1.3 items × 5 × 1.5 min × 0.65 × size (≈ 4.3) | 0.3 / **0.8** / 1.5 | 0 / 0.2 / 0.5 |

Other inputs:
- **Per page:** book worked examples and figures `w0` 25 / 50 / 90 words, plus R8's 0.4 min/page of active work on them.
- **Boundary judgement:** K density × e^t, t ∈ ±0.15, with S absorbing the difference.
- **R7 savings** reduced to the project-certification part only (0 / 20 / 50 h), because facet collapse *is* tiering.

**Cross-check.** With K set to R8's strict density, S/C at "read only" and 250 words per page, the code reproduces R8 exactly: **2,455 h vs 2,454, and 20.1 vs 20.0 months at 8 + 1.**

**Word cross-check.** The tier budgets give **280 lesson words per source page**. R8 chose 250 from three other routes. Two independent derivations agree within 12%.

### 3.2 Hours at the mode

| Scenario | Both apps (h) | Core (h) | Words / page | Lessons |
|---|---|---|---|---|
| R8 reference | 2,454 | 1,868 | 250 | ≈ 1,630 |
| **TIERED (adjudicated)** | **3,360** | **2,545** | 280 | 1,847 |
| Tiered, rater A labels | 3,285 | 2,489 | 271 | 1,785 |
| Tiered, rater B labels | 3,418 | 2,586 | 288 | 1,899 |
| Tiered-max (each disagreement resolved upward) | 3,558 | 2,692 | 307 | 2,026 |
| Tiered + safeguards | 3,640 | 2,760 | 296 | 1,951 |
| Tiered + safeguards + keystone clusters **[P]** | 3,069 | 2,337 | 254 | 1,674 |
| **LITERAL** (every item: 7 facets + forge + review) | **7,198** | **5,386** | 534 | 3,521 |

TIERED components (both apps, h):

| Component | Hours |
|---|---|
| Reading | 679 |
| Active K | 706 |
| Active S | 277 |
| Active C | 39 |
| Active on support (examples, figures) | 141 |
| Review K | 298 |
| Review S + C | 79 |
| Module checks | 114 |
| Dialogue | 306 |
| Forge (K) | 188 |
| Notebook | 94 |
| Lesson overhead | 123 |
| Generation wait | 96 |
| Diagnostics | 38 |
| Projects + articles + build | 200 |
| Savings | −20 |

Dense first-pass share: 61%, the same as R8, so R9's D1 cap does not bind either.

### 3.3 Months: Monte Carlo, N = 20,000, P10 / **P50** / P90, R8 calendar

**Everything (both apps, core + adv), + 1 mobile hour:**

| Scenario | 7 + 1 | 8 + 1 | 9 + 1 | 10 + 1 |
|---|---|---|---|---|
| R8 reference | 17.9 / **21.1** / 25.1 | 16.9 / **20.0** / 23.9 | 16.3 / **19.5** / 23.3 | 16.0 / **19.2** / 23.3 |
| **TIERED** | 24.2 / **29.3** / 35.9 | 22.9 / **27.8** / 34.1 | 22.2 / **26.9** / 33.3 | 21.7 / **26.7** / 33.2 |
| Tiered + safeguards | 26.3 / **31.8** / 39.1 | 24.9 / **30.2** / 37.2 | 24.0 / **29.3** / 36.3 | 23.6 / **29.0** / 36.2 |
| + keystone clusters [P] | 22.6 / **27.2** / 33.2 | 21.3 / **25.8** / 31.6 | 20.6 / **25.0** / 30.8 | 20.2 / **24.8** / 30.8 |
| LITERAL | 49.9 / **61.1** / 75.8 | 47.2 / **58.0** / 72.0 | 45.6 / **56.2** / 70.3 | 44.8 / **55.7** / 70.1 |

**Core of both apps, + 1 mobile hour:**

| Scenario | 7 + 1 | 8 + 1 | 9 + 1 | 10 + 1 |
|---|---|---|---|---|
| R8 reference | 13.7 / **16.2** / 19.2 | 13.0 / **15.4** / 18.2 | 12.5 / **14.9** / 17.8 | 12.3 / **14.7** / 17.8 |
| **TIERED** | 18.5 / **22.2** / 27.2 | 17.5 / **21.1** / 25.9 | 16.9 / **20.5** / 25.3 | 16.6 / **20.3** / 25.2 |
| Tiered + safeguards | 20.0 / **24.2** / 29.7 | 19.0 / **23.0** / 28.2 | 18.3 / **22.3** / 27.5 | 18.0 / **22.0** / 27.4 |
| + keystone clusters [P] | 17.3 / **20.8** / 25.3 | 16.4 / **19.7** / 24.1 | 15.8 / **19.1** / 23.5 | 15.5 / **18.9** / 23.5 |
| LITERAL | 37.4 / **45.9** / 56.8 | 35.4 / **43.5** / 54.0 | 34.2 / **42.2** / 52.8 | 33.6 / **41.7** / 52.6 |

**Without the mobile hour (P50):** TIERED everything 33.0 / 31.1 / 30.1 / 29.8 months at 7 / 8 / 9 / 10 h; core 25.1 / 23.7 / 22.9 / 22.6.

**On R9's effective-hours curve (P50):**

| Scenario | Everything, 7 / 8 / 10 h | Core, 7 / 8 / 10 h |
|---|---|---|
| TIERED | 33.3 / 31.6 / 32.5 | 25.3 / 24.0 / 24.5 |
| + safeguards + clusters | 30.9 / 29.3 / 30.1 | 23.6 / 22.4 / 23.0 |

As in R8, 8 h beats 10 h on that curve.

**Probabilities:**
- P(core ≤ 18 months): 0.14 at 8 + 1 and 0.23 at 10 + 1 (TIERED); 0.27 / 0.38 with clusters.
- P(everything ≤ 18): ≤ 0.02 in every tiered row.

### 3.4 Where the extra time comes from (waterfall, both apps)

| Step | Hours (mode) | P50 months at 8 + 1 |
|---|---|---|
| W0. R8's regime: K = strict CRs; S/C read only; 250 words/page | 2,455 | 20.1 |
| W1. + keystones at the rubric's granularity (37 vs 24 per 192 pp), full treatment each, size-scaled | 2,782 | 22.5 |
| W2. + S items get their supporting treatment (one commit, review via keystone) | 3,170 | 25.9 |
| W3. + C items get definition + where-used minutes | 3,224 | 26.5 |
| W4. + lesson words built per tier; R7 savings reduced to 20 h (= TIERED) | 3,360 | 27.7 |

Two thirds of the increase is **depth R8 assumed was free**: 4,750 supporting items with no commit and no review. The rest is keystones R8 had folded.

### 3.5 Tornado (TIERED, both apps, 8 + 1, others at mode; base 24.1 at mode)

| Input | Range | Months, low → high | Swing |
|---|---|---|---|
| R8 size exponent (how K minutes shrink with granularity) | 0.3 … 0.8 | 26.0 → 21.8 | **4.2** |
| K active minutes | 10 … 22 | 22.4 → 26.4 | 4.0 |
| Selection bias | 0.75 … 1.0 | 22.2 → 26.0 | 3.8 |
| K dialogue | 2 … 12 | 22.7 → 26.1 | 3.3 |
| K forge | 0 … 10 | 22.7 → 26.1 | 3.3 |
| K review minutes | 0.8 … 3.0 | 23.1 → 26.2 | 3.1 |
| K words | 500 … 1,100 | 22.9 → 25.7 | 2.7 |
| Reading speed | 110 … 190 wpm | 25.6 → 22.9 | 2.7 |
| S active minutes | 2 … 6 | 23.2 → 25.5 | 2.2 |
| Tier boundary | t ± 0.15 | 23.3 → 24.9 | 1.6 |

The top input is the same thing the cluster scenario models: **the marginal cost of a second and third keystone taught in the same lesson.** It is the pilot's new first-order number (§6).

---

## 4. Stress test against "no compromise"

### 4.1 The strongest case that tiering IS a compromise

1. **Authority is shown at the unexpected question.** The expert is caught out on the "minor" item:
   - the independence assumption hidden in σ²/n;
   - the 1–2 dB CFAR and straddle losses that move a claimed detection range by 15–25%;
   - the overdamped case nobody reviewed.

   Load-bearing is decided by the world, not by fan-out *inside two syllabi*. A rubric fitted to the books favours textbook-central over frontier-relevant results.
2. **Trade-off, shared structure and critique are the facets that make authority.** They are the cross-field, error-catching part. Tier S removes exactly those three. "Recognised in context" is the reading level the learner already called insufficient.
3. **Tier labels drift down under time pressure (Goodhart).** A K costs ~4× an S (≈ 27 vs ≈ 7 learner minutes). A planner, Claude or the learner, that is short on budget has a standing incentive to call things S. The tutor is grading its own homework.
4. **The measurement is soft.** κ = 0.65 means a quarter of items are boundary cases. The raters were the same model, and fan-out regexes are noisy (2.2–2.3). A 24% boundary zone at 13,600 items is about 3,000 items whose depth depends on a coin.
5. **Spaced review through the keystone is weaker than review of the item itself.** S knowledge may decay unseen.

### 4.2 The answer

1. **The comparison is not "tiered vs full depth".** It is tiered (27.8 months at 8 + 1) against literal (58 months), and against R8 (20 months), which was *less* deep than tiered.
   - Literal does not exist in any expert. No radar engineer can give the trade-off and the cross-field structure of "Doppler straddle loss". They know its number and where it enters the RRE, which is exactly tier S.
   - The rubric is built from the goal's own clause ("above all in judgement questions that cross fields"). It is not built from time: the time model came after the labelling, and tiering *raises* the bill relative to R8.
2. **S keeps the facets that catch the "minor" error.** The classic catches in 4.1 #1 are *assumption* and *limit* errors: independence, losses, regime. S keeps origin (where each assumption enters), limits and a number, and the S rule makes the K's critique name the S item.
   - What S drops is the *stand-alone* trade-off and cross-field mapping of a lemma, which usually have no honest content (§1.4).
   - Where they do have content, the item meets F4, which makes it K.
3. **Drift is blocked by mechanism, not goodwill (§4.3):**
   - the objective half of the test runs in the app;
   - ties go up;
   - the learner can promote;
   - the S share is audited per module against the measured band.
4. **The boundary zone is resolved upward by construction.**
   - TIERED-MAX resolves every disagreement upward and costs only +1.4 months at 8 + 1 (29.2 vs 27.8).
   - Rater A and rater B labels give 27.3 and 28.1.
   - **The calendar is insensitive to the coin**: all four labellings lie within 2 months.
5. **S decay is measured, not assumed.** Held-out exams sample every tier in proportion. Two S failures under the same K promote those S items to their own review cards.

### 4.3 Safeguards: what makes it not a compromise (all costed in "+ safeguards")

1. **Promote anything.**
   - A "קדם למפתח" button on every S item, or the learner writes "קדם את X": the tutor writes the missing facets at once, as an addendum with think + forge.
   - Automatic promotion when an S item appears in a project, an article, a claims check (P12) or an interview question.
   - Costed at 5 / **15** / 30% of S promoted.
2. **Ties go up.** In the plan, any item the tutor is unsure about is K. Each part's audit compares the tutor's tier with the app's objective half (fan-out from the module graph, A6 project list) and flags "K-candidate labelled S".
3. **Tiers are visible.**
   - A pill at the first appearance of each K/S item.
   - The tier list with one-line reasons in the coverage block.
   - A per-module tier ledger in `profile/tiers/<module>` that the learner can edit.
   - The S share per module is shown against the measured band for its book class. A module whose K share falls more than 10 points below its class band is flagged.
4. **Exams sample all tiers**, in proportion, at each tier's standard: K = estimate + trade-off + catch; S = assumption + limit + number; C = exact definition. Costed: +10 / 25 / 45 h. Failures promote.
5. **The floor never moves.** S and C items get the **full mathematical definition with all conditions** (rule 5א/6א). No item is described instead of defined. Every book example and figure stays (rule 8/9). Tiering only decides who gets the seven facets, the forge and their own review cards.
6. **The tier never drops inside a lesson to save space.** If a lesson runs long, context and base compress first (A2's צ3–צ7), never a planned K.

---

## 5. Tutor instructions (Hebrew, ready to paste)

**Where they go:**
- **Gilua:** after rule 10 in `eng/app/src/prompt.ts` and `docs/ENG_TEACHING_RULES.md`, as 10א–10ו.
- **Lanchester:** after rule 38 in `core/app/src/prompt.ts` and `docs/CORE_TEACHING_RULES.md`, as 38א–38ו, with "משמעות מבצעית" in place of "מבנה משותף". Rule 17 (four domain blocks) then reads "לכל פריט מפתח".

**Shared app work:**
- the pills `[[דרגה: …]]`;
- the "קדם למפתח" button;
- `profile/tiers/`;
- the part audit, which reads the hidden `⟦K3⟧`-style markers the way A2 §6 reads `⟦U7⟧`.

### 5.1 Teaching rules

```text
10א. שלוש דרגות עומק. כל פריט שהשיעור מלמד (תוצאה, מודל, שיטה, הגדרה, עובדה, דוגמה) מקבל בתכנון דרגה אחת, לפי מה שסמכות צריכה לעשות איתו. אף פריט לא מדולג: הדרגה קובעת כמה עבודה הוא מקבל, לא אם הוא נלמד.
- מפתח: תוצאה שסמכות צריכה להפעיל בעצמה: לאמוד בה בראש, להכריע בה פשרה, לתפוס בה טעות ולזהות אותה בתחום אחר. "תוצאה מרכזית" בכללים 10–14 פירושה פריט מפתח. הוא מקבל את שבעת הסעיפים, בלוק definition ובלוק formula לפי 5א–5ב, בלוק domain מלא, שאלת think שמתחייבים בה לפני התשובה, תרגיל חישול אחד לפחות בסוף השיעור, ושורה בבלוק keep.
- תומך: תוצאה שסמכות צריכה לעקוב אחריה ולבדוק אותה: צעד או למה בגזירה של פריט מפתח, מקרה פרטי, הרחבה, או צורה מעשית של נוסחה. הוא מקבל: הגדרה מתמטית מלאה עם כל ההנחות והתנאים (כלל 5א), [[2.5: מבנה]], [[2.5: מקור]] (באיזה צעד נכנסת כל הנחה), [[2.5: גבולות]], מספר אחד עם דרך לאמוד אותו בראש, ומשפט שאומר איזה פריט מפתח הוא משרת ואיפה הוא חוזר בקורס. הפשרה, המבנה המשותף והביקורת שלו נכתבים בתוך אלה של פריט המפתח שהוא משרת, ובשמו ("ההנחה של (7) על אי-תלות היא בדיוק מה ששובר את…").
- הקשר: מה שצריך כדי לקרוא את התחום ולדבר עם מומחים: הגדרה, סימון, טקסונומיה, עובדה תיאורית, דוגמה מהספר, מספר טיפוסי. הוא מקבל הגדרה מדויקת עם התנאים שלה (לא תיאור במילים כלליות), ומשפט "איפה משתמשים בזה". דוגמאות ואיורים מעמודי השיעור נשארים במלואם (כלל 8).

10ב. מבחן הדרגה (לא תחושה). פריט הוא מפתח כשמתקיימים שני תנאים: (1) סימן אובייקטיבי: הוא חוזר במודולים אחרים (לפי תוכנית המודולים ו-<course_memory>, בגילואה או בלנצ'סטר), או שפרויקט משתמש בו; (2) הוא נכנס לשיפוט (אומדן, הכרעה, בדיקת טענה), או שהמבנה שלו נושא משקל בשני תחומים אחרים לפחות. הגדרה או עובדה תיאורית הן מפתח רק אם גם המבנה שלהן חוצה תחומים (כמו שטח חתך מכ"מי, שחוזר בעוצמת מטרה בסונאר ובחתך פיזור בפיזיקה). אחרת: תומך, אם הוא משרת פריט אחר; הקשר, אם הוא הגדרה, טקסונומיה, דוגמה או עובדה. בספק, הדרגה הגבוהה.

10ג. הדרגה גלויה. בהופעה הראשונה של כל פריט מפתח ותומך באה תגית [[דרגה: מפתח]] או [[דרגה: תומך]], ובסימון נסתר ⟦K3⟧ / ⟦S5⟧ לפי המזהה מהתכנון. בלוק coverage בסוף השיעור מפרט את כל הפריטים לפי דרגה: לכל פריט מפתח ולכל פריט שהיה גבולי, משפט אחד שמנמק את הדרגה.

10ד. קידום. כשהלומד כותב "קדם את X" (או לוחץ "קדם למפתח"), כותבים מיד את מה שחסר ל-X כדי להיות פריט מפתח: [[2.5: פשרה]], [[2.5: מבנה משותף]] עם בלוק domain, [[2.5: ביקורת]], שאלת think ותרגיל חישול. שומרים בזיכרון הקורס: "X — קודם למפתח בידי הלומד". פריט תומך שעולה בפרויקט, ברעיון למאמר, בבדיקת טענה או בשאלה לראיון מקודם באותה שיחה, בלי שיתבקשו.

10ה. בחינה בכל הדרגות. בוחן מודול דוגם פריטים מכל שלוש הדרגות, ביחס למספרם, וכל שאלה בדרישה של הדרגה שלה: פריט מפתח: אומדן בראש, פשרה ותפיסת טעות; פריט תומך: איפה נכנסת הנחה, מתי זה נשבר, ומספר; פריט הקשר: הגדרה מדויקת. שתי טעויות בפריטים תומכים של אותו פריט מפתח מקדמות אותם לפריטי חזרה משלהם.

10ו. הדרגה לא יורדת בתוך שיעור. פריט שתוכנן כמפתח לא נכתב כתומך כדי לחסוך מקום. כשהשיעור ארוך מדי, מקצרים קודם את פריטי ההקשר, את הרקע ואת החזרות (צ3–צ7), לעולם לא פריט מפתח ולא ההגדרה המלאה של פריט כלשהו.
```

### 5.2 Planning step

The text goes into `PART_PLAN_INSTRUCTIONS` in `*/app/src/tutor.ts`. The Hebrew version is for the rules documents. An English drop-in follows, because that string is in English.

```text
שלב התכנון — פריטים ודרגות. לפני חלוקת השיעור לחלקים, כתבו את רשימת הפריטים של השיעור: כל תוצאה, מודל, שיטה, הגדרה, עובדה ודוגמה שעמודי השיעור מלמדים. לכל פריט: מזהה (K1, S1, C1…), שם קצר, דרגה לפי כלל 10ב, הנימוק במשפט (איזה סימן אובייקטיבי ואיזה סוג שיפוט או מבנה), ולפריט תומך — איזה פריט מפתח הוא משרת. כל פריט משויך לחלק אחד בדיוק. תקציב המילים של חלק הוא סכום הפריטים שלו: כ-750 מילים לפריט מפתח (500–1100), כ-280 לתומך (180–420), כ-80 להקשר (50–130), ועוד דוגמאות ואיורים מהספר. שבעת סעיפי 2.5 משויכים לכל פריט מפתח; מבנה, מקור, גבולות ומספר — לכל פריט תומך. פריטי מפתח שנלמדים יחד באותו חלק חולקים את פסקת הפשרה, את טבלת המבנה המשותף ואת שאלת הביקורת, אבל כל אחד מהם מופיע בהן בשמו ועם המספר שלו. בספק בין שתי דרגות, הגבוהה.
```

```text
ITEMS AND TIERS (add to the planning step). Before splitting into parts, list every item these pages teach (result, model, method, definition, fact, worked example) in "items": [{"id": "K1", "name": "…", "tier": "K|S|C", "why": "objective signal + judgement/structure, one sentence", "serves": "K1 (S only)", "part": 2}]. Tier by rule 10ב (core: 38ב); when unsure, the higher tier. Every item goes to exactly one part. A part's word budget is the sum of its items: K ≈ 750 (500–1100), S ≈ 280 (180–420), C ≈ 80 (50–130), plus the book's examples and figures. Assign all seven level-2.5 sections ("l25") to every K item, and structure/origin/limits/one number to every S item. K items taught in the same part may share the trade-off paragraph, the shared-structure table and the critique, provided each K item is named in them with its own number. Never downgrade a planned K item while writing.
```

**Schema change:** add `items?: {id: string; name: string; tier: "K" | "S" | "C"; why: string; serves?: string; part: number}[]` to `PartPlan`.

**Audit change.** The part audit checks:
- every K has its 7 tags and one `⟦K⟧` marker;
- every S has its 3 tags, a number and a "serves" sentence;
- the K share is within the module's book-class band from §2.5.

The 4,200-word minimum in rule 22 becomes the tier sum. Short material is said so, as before.

---

## 6. What the pilot must add (to R8 §6)

1. **Minutes per K item as a function of the number of keystones co-taught.** This is the size exponent / cluster parameter: the largest swing, worth −2 to +2 months. Log commit, forge and review per K in lessons with 1, 2 and 3+ keystones.
2. **S minutes and S retention.** Does one commit plus review through the keystone hold at 30 days? Run held-out S items over ~40 items. If retention is below about 70%, promote the class, which costs ≈ +1.3 months per 10% of S promoted.
3. **A blind second rater** on `R8_samples/` with §1 only, plus the learner's own tiers on two modules. Targets: κ ≥ 0.6, and his promotions under about 15%.

**The decision rule stays R8's:**

> months ≈ 21,100 × (all-in minutes per source page) / 60 / (delivered hours per month)

TIERED predicts **≈ 9.5** all-in minutes per page (mode 3,360 h). R8 predicted 7.0. The same pilot measures it.

## 7. Limitations

- **Sampling.** One sample each for classes A, B and C. Class C (Wasserman, 0.50 K/page) carries a quarter of Gilua core pages. A second theorem-dense sample could move Gilua by ±10%.
- **Raters.** Both are the same model (§2.3). Adjudication chose K in 13 of the 28 disagreements and S in 15. Relative to rater A, it moved 5 items up and 1 down.
- **Regex fan-out** is an approximate signal: it is polluted by everyday words and blind to letters. It is used only as one of two conditions, and the adjudication notes every override.
- **Cost parameters.** S/C minutes and the K word budget are derived from A2's unit densities, not timed. K review keeps R8's 1.3 items per CR, which slightly double-counts satellite cards: about −50 h, −0.4 months.
- **Untouched assumptions.** Dedup and test-out are R8's and are assumed to apply equally across tiers. Keystones are likelier to be re-taught across apps, so dedup should favour K slightly, which is in the learner's favour.

## Files

- `round2/R10_tiers.md`: this report.
- `round2/R10_items.py`: 119 items, rater A labels, F3–F6 codes, A6 project links, adjudication notes, R8 strict mapping.
- `round2/R10_classify.py` → `R10_classify.out`: fan-out, rule B, κ, signals, distribution. Cache: `cache/R10_fanout.json`, `cache/R10_classify.json`. Runs in ~4 min the first time, seconds after.
- `round2/R10_model.py` → `R10_model.out`: the tier model; reuses `R8_model.py`; runs in about 1 s.
