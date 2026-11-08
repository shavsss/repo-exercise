# I. One integrated model: both curricula, full depth, durable recall ≥ 90%, at 8 h/day

Files:
- `round3/I_model.py` is the model. Run it with `python3 -I I_model.py`; it takes about 10 s.
- `round3/I_model.out` is its output.
- `round3/I_work/ret_curves.py` builds the retention cost curves from P's FSRS model, and saves them in `ret_curves.npz`.

Evidence tags: **[M]** measured in this research, **[D]** taken from a document in this folder, **[J]** judgement, **[P]** only the pilot can measure it.

## 0. Answer

The headline, P10 / **P50** / P90 months, Monte Carlo with N = 6,000, on R9's 8-hour effective-hours curve and a realistic calendar:

| Scope | 8 h | 8 h + 1 phone hour |
|---|---|---|
| **Everything**: both apps, core + adv, about 24,400 weighted pages | 21.8 / **28.1** / 36.3 | 19.3 / **24.8** / 32.2 |
| **Core of both**: about 18,200 pages | 16.1 / **20.7** / 26.9 | 14.5 / **18.4** / 24.1 |

**Probability of finishing by a given month:**

| | ≤ 6 | ≤ 8 | ≤ 10 | ≤ 12 | ≤ 15 |
|---|---|---|---|---|---|
| Everything, either day | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| Core, 8 h | 0.00 | 0.00 | 0.00 | 0.00 | 0.05 |
| Core, 8 + 1 | 0.00 | 0.00 | 0.00 | 0.01 | 0.15 |

0.00 means fewer than 1 draw in 6,000 within this model.

**How much is done by a given month, in the everything plan (core first, both apps interleaved), at 8 + 1:**

| | Month 6 | Month 8 | Month 12 |
|---|---|---|---|
| Share of all pages | **26%** (P10–P90: 20–34%) | **35%** (27–45%) | 51% |
| Share of the core | **35%** (27–45%) | **47%** (36–60%) | – |

Without the phone hour, month 6 is 24% of all pages (32% of the core), and month 8 is 32% (43%).

**Learner hours at the mode:**
- Everything: about **3,180 h net**. That is 7.8 all-in minutes per raw weighted page, or about 9.0 per effective page.
  - Lessons (the active flow): 1,671 h.
  - Consultation, forge and notebook: 345 h.
  - Retention: 678 h explicit + 445 h of hooks, of which about half are already inside the lesson.
  - Projects, articles and build: 220 h.
  - Exams: 42 h.
- Core of both: about 2,350 h net.

**Keeping recall at ≥ 90% costs about 2 h/day when the course ends.** P50 is 123 min/day (96–149). By P's curve this falls to roughly 45–60 min/day a year later.

## 1. How each component was built (bottom-up from the new design)

| Part | Basis | Value used (low / mode / high) |
|---|---|---|
| **(a) + (b) Lesson: the new format plus the active flow** | The rules-v2 lesson K1:29–44: 15.5 pages, 6,282 words (405 words per source page; the old lesson was ≈ 12,200), 89 units, 25 of them key, 2 strict CRs = 0.129 per page **[M]**. J6 judged it deeper on its own topic at about half the length **[D]**. L walked it turn by turn: scripted 47 min fast path / 87 min slow path; L's Monte Carlo gives 62 (55–71) fast and 80 (72–89) slow **[D]**. This includes the opening retrieval, the gates, collapse on right answers, 2 Socratic hard points, the keep card, the teach-back and one exercise | <ul><li>Share of lessons on the fast path: math books 0.15 / 0.35 / 0.60; military books 0.35 / 0.60 / 0.85 **[J]**</li><li>Reading speed 110 / 145 / 190 wpm, applied to a reading share of about 55% **[P]**</li><li>Scaling to each book class by R8's measured strict-CR density × selection bias (0.75 / 0.87 / 1.0): time = anchor × (φ + (1 − φ)·density ratio), with φ = 0.3 / 0.4 / 0.5 the share that does not depend on density</li><li>"Is one K1 lesson representative?" factor 0.85 / 1.0 / 1.3</li><li>Top-up to R10's full keystone count 1.0 / 1.05 / 1.2</li></ul>Result: **5.0 min per new page** for Gilua core, 4.3 for Lanchester core |
| **(c) Consultation** | R8's logs: 2 / 6 / 12 min per CR. C_consultation: answers at 18% of the old words (1,761 against 9,528 on the 7 real turns) **[M]** | Reading share 0.55 × a word ratio of 0.18 / 0.25 / 0.40 (the higher values allow for chips he follows), plus a question-and-thinking share 0.45 × 0.6 / 0.85 / 1.2. This gives about **3 min per CR, 0.35–0.43 min per page** |
| Forge and notebook beyond the lesson | R8 | 0 / 2.5 / 6 and 0.5 / 2 / 5 min per CR. The lesson's own closing exercise is already in (b) |
| **(d) Retention** | P's FSRS-4.5 model, every item at r = 0.90. R10's 13,600 K/S/C items × an item-count factor of 0.8 / 1.0 / 1.15. The memory parameter mixes P's "best" (schema memory) and "FSRS default" (pessimistic) at a weight of 0 / 0.4 / 1 **[P]**. Composites and designed hooks come from P | <ul><li>The cost curve C(age) per item is convolved with the actual week-by-week learning schedule, so a faster course pays less review *during* the course and more after it</li><li>Share of hook minutes already inside the measured lesson: 0.3 / 0.5 / 0.7</li><li>Share of explicit review that works in pocket mode: 0.40 / 0.55 / 0.70</li><li>Monthly held-out exam plus quarterly viva: 1.7 h/month</li><li>Recall at 6 and 12 months: mean 0.96, 5th percentile 0.91 (P's run)</li></ul> |
| **(e) Projects and articles** | R8 / A6 | Projects 80 / 120 / 200 h, articles 10 / 40 / 120, build approvals 10 / 25 / 60. From-memory work is credited against explicit review at 0.2 / 0.4 / 0.7 minutes per minute, capped at 30% of explicit review |
| **(f) Factory, dedup, test-out** | R6 / R8 / X | <ul><li>Generation wait: 0, except lessons not on the shelf, 0 / 4 / 12% × 20 min</li><li>Dedup 6 / 13 / 20%, with delta lessons at 0.15 / 0.25 / 0.40 of the cost</li><li>Test-out: Lanchester 3 / 10 / 20%, Gilua 0 / 2 / 5%, each costing a probe of 0.05 / 0.1 / 0.2 of a lesson</li><li>Diagnostics 20 / 35 / 60 h</li></ul> |
| **Calendar** | R9 / R8 | <ul><li>EFH per study day at 8 h: 6.3, 6.2, 6.1, then 6.0 from month 4, × a person factor of ±15% (P10–P90)</li><li>**Dense-lesson cap: 4.1 / 4.4 / 4.75 EFH per day before 15:00**</li><li>6 study days a week; lost days 5 / 10 / 18%; light Friday × 0.953; one light week in 7, × 0.936; a pilot week</li><li>The phone hour: 60 min × done on 0.6 / 0.8 / 0.95 of days × yield 0.70 / 0.85 / 0.95. **It absorbs only movable work** (pocket review and pre-questions)</li></ul> |

## 2. Tornado (everything, 8 + 1, all other inputs at their mode; base 21.8 months)

| Input | Range | Months, low → high | Swing |
|---|---|---|---|
| Person factor (EFH at 8 h) | P10 → P90 | 25.5 → 18.9 | **6.7** |
| Is the K1 lesson representative of dense pages? | 0.85 → 1.3 | 19.8 → 26.2 | **6.4** |
| Selection bias on CR density | 0.75 → 1.0 | 19.5 → 24.4 | 4.8 |
| Reading speed | 110 → 190 wpm | 24.4 → 20.0 | 4.4 |
| CR rubric judgement | P10 → P90 | 20.0 → 24.1 | 4.1 |
| Days lost | 5 → 18% | 20.7 → 24.1 | 3.4 |
| Dedup | 6 → 20% | 23.5 → 20.5 | 3.0 |
| Keystone top-up | 1.0 → 1.2 | 21.2 → 23.9 | 2.8 |
| Forge per CR | 0 → 6 | 20.9 → 23.2 | 2.3 |
| Slow-path lesson minutes | 72 → 89 | 20.9 → 23.0 | 2.1 |
| Memory parameters (schema → FSRS default) | 0 → 1 | 21.2 → 23.2 | 2.1 |
| Item count | 0.8 → 1.15 | 20.9 → 22.8 | 1.8 |
| Old consultation minutes per CR | 2 → 12 | 21.2 → 23.0 | 1.8 |
| Notebook | 0.5 → 5 | 21.4 → 23.0 | 1.6 |
| Hooks already inside the lesson | 0.3 → 0.7 | 22.5 → 21.2 | 1.4 |
| Fast-path share, math | 0.15 → 0.6 | 22.3 → 21.2 | 1.1 |

Four of the top five are pilot numbers: the person's EFH, real lesson minutes on dense pages (the representativeness factor), the CR density of whole modules, and reading speed.

## 3. What must be true for ≤ 8 and ≤ 6 months

**Required all-in minutes per raw page** (lessons + light work + retention), all other inputs at their mode, 8 + 1. The modelled value is **7.8**.

| Target | Everything | Core of both |
|---|---|---|
| ≤ 6 months | ≤ **2.5** min/page (× 0.32); lessons ≤ 1.3 | ≤ **3.2** (× 0.41); lessons ≤ 1.7 |
| ≤ 8 months | ≤ **3.2** (× 0.40); lessons ≤ 1.7 | ≤ **4.1** (× 0.52); lessons ≤ 2.2 |
| ≤ 10 months | ≤ 3.9 (× 0.50) | ≤ 5.0 (× 0.65) |
| ≤ 12 months | ≤ 4.6 (× 0.59) | ≤ 5.9 (× 0.77) |

Making only the lessons faster cannot reach ≤ 8 for either scope. The non-lesson work alone (retention, consultation, projects) already exceeds the 8-month capacity.

**Is each target plausible?**
- **Everything ≤ 8 or ≤ 6: no.**
  - Lessons would have to run at ≤ 1.7 min/page. The *scripted best case* of the measured flow is 3.0 min/page, and L's fast-path Monte Carlo gives 3.5–4.6.
  - Retention would have to cost about 40% of P's best design, which is below the FSRS lower bound of 4–6 spaced retrievals per item for 90% recall.
  - Even with every input at its favourable end at once, it is 6.7 months for everything and 4.8 for the core. That corner has P ≈ 0.
- **Core ≤ 8: no.** Lessons at ≤ 2.2 min/page are faster than the scripted fast path on every lesson, and on top of that review and consultation would have to halve.
- **Core ≤ 12: plausible only as a joint favourable outcome of the pilot.** The "optimistic-plausible" corner gives **core 11.0 and everything 14.9 months** at 8 + 1. It needs all of these:
  - the fast path on 60% of math lessons and 80% of military lessons;
  - reading at 170 wpm;
  - the K1 lesson at least as slow as a dense page (factor 0.9);
  - memory near schema (weight 0.2);
  - old-equivalent consultation of 4 min per CR, forge 1.5, notebook 1;
  - 6% of days lost;
  - EFH 6.6 per day.

  The Monte Carlo gives it P(≤ 12) = 0.01. A "strong individual" (R9: EFH 7.3 at 8 h) gives core 15.2 months with P(≤ 12) = 0.07, and everything 20.5 months.

**A structural floor.** Lessons alone use 1,671 h for everything and 1,250 h for the core. At the dense cap of 4.4 EFH/day, the lessons alone, with no review, consultation or projects, take **18.2 months for everything and 13.6 for the core**.
- More desk hours do not move this floor.
- In the base case the cap binds in only 2 weeks, because lessons are 49% of the work. But it means "8 h a day of lessons" is not a lever.

## 4. Comparison with R8, R10 and X

**R8** (R9 curve at 8 h: everything 22.7, core 17.4) → here 28.1 / 20.7.
- Hours rise from 2,454 to about 3,180 net.
- **Retention +590 h.**
  - R8 priced 349 h of review for about 2,600 CRs.
  - Here every one of R10's 13,600 K/S/C items is held at ≥ 90%, using P's model: about 900 h net, plus exams.
- **Lessons +170 h.**
  - The measured new lesson has 405 words per page, not R8's 250, and 22–30 commits per 15.5 pages.
  - Collapse brings the words actually read back to about 250–420 per page.
  - Net, the active flow is 4.1 min/raw page, against R8's 3.5 for reading + active + overhead + waiting.
- **Consultation, forge and notebook −80 h**, thanks to the short answers.

**R10** (R9 curve at 8 h: 31.6 / 24.0) → here 28.1 / 20.7.
- **Lessons −390 h.** R10 priced reading + active + support + overhead + waiting at about 2,060 h. Collapse on right answers and the factory bring it to 1,671 h.
- **Consultation −150 h**: 306 → about 150.
- **Retention +450 h**: R10 had about 490 h, here about 940.
- Net about −180 h, plus a slightly kinder schedule for review, because the review is convolved with the real pace.

**X** (≈ 20 months everything, ≈ 15 core at 8 + 1, on R8's calendar) → here 24.8 / 18.4.
- X applied −25 to −30% to R10, including 90–120 h of review cuts. It did not include P's retention price, about +410 to +550 h.
- X's mobile hour was capped at 10–18% of all work. Here the phone hour can only take pocket work, and it is worth −3.3 months for everything and −2.3 for the core, which agrees with R7/R8's −2.5 to −3.

**Where all four now agree:**
- At full depth with durable recall, both curricula take **about 2 years at 8 h/day** (P50 25–28 months).
- The core takes **about 1.5 years** (18–21 months).
- Month 8 holds **about a third of everything, or half of the core**.

## 5. Limitations

- The lesson anchor is **one** lesson (n = 1), from a K1 survey chapter, and its times are scripted and modelled, not observed.
  - The density scaling (φ) is judgement.
  - The representativeness factor is the second-largest swing. The pilot must time about 60 pages across 3 book types.
- The retention curve is P's FSRS model with default or "schema" weights, never fitted to this learner.
  - The hooks' use dates are fixed in calendar days (a 150-day span). A faster course would bring uses sooner, and the model ignores that small effect.
- Parameters are drawn independently, apart from the bias, so the P10–P90 bands understate the structural uncertainty.
- "0.00" means fewer than 1 in 6,000 draws, not impossible.
