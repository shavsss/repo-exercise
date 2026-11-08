# R6. Independent recount: how long both apps take at full depth

Red team, round 2. I built my own model from the raw syllabi, the TOC files, A2's measured lesson facts and the real lessons in `scratchpad/review/`. I did not use A1's scripts or caches. Code: `R6_model.py` (runs in about 1 s; every number below comes from its output).

**The claim tested (V3):** "At full depth with projects and spaced review, both apps take about 8 months at about 7 h/day, or about 12 months at about 5 h/day. The core of both takes about 7.4 months at 6 h/day. 4 months is impossible (about 14 h/day)."

---

## 0. Verdict

1. **"4 months is impossible": right, and understated.** Under the accounting most favourable to V3, 4 months for both apps needs **18.5 h/day** (P50), not 14. Even with every parameter at its best end (813 h), it needs about 8 h/day at perfect adherence.
2. **"8 months at 7 h/day" and "12 months at 5 h/day": too optimistic, by 1.5 to 3 times.**
   - Most V3-friendly accounting (V3's own hour categories, A1's own calendar, only my re-measured inputs): P(both ≤ 8 months at 7 h/day) = **1%**; P(both ≤ 12 months at 5 h/day) = **5%**.
   - Full accounting (adds the time sinks V3's own day plan contains but its hour total leaves out): **0%** for both.
   - My best estimate (full hours, realistic calendar): **both P50 ≈ 24 months at 7 h/day and ≈ 29 at 5 h/day.**
3. **"Core of both in 7.4 months at 6 h/day": too optimistic.**
   - P = 3% in the friendly accounting (P50 9.4 months) and 0% otherwise.
   - Best estimate: **P50 ≈ 14 months** if every planned hour is delivered (A1 calendar), **≈ 20 months** on a realistic calendar.
4. **Why V3 is off: not the arithmetic.** My model reproduces V3 almost exactly when fed V3's inputs: both apps in 6.9 months at 7 h/day (V3: about 8.2). The gap comes from four inputs, each of which V3's own documents contradict:
   - reading speed for dense text;
   - minutes per review item;
   - components that V3's own day plan contains but its hour total leaves out (forge, notebook, clarify dialogue, per-lesson overhead);
   - a calendar that delivers every nominal hour at full yield, with no light weeks, even though V3 prescribes those light weeks itself.
5. **V3 is not consistent with itself.** Its own day plan (about 6 CRs per 5-hour day, 5 lesson days a week, a light week every 7th) applied to its own 1,680 CRs gives **about 14.6 months at 5 h/day, not 12.**

---

## 1. What I built from raw data

### 1.1 Inventory (from `syllabus.json`, ref tier excluded)

| | Modules | main | supp | article | ex (not taught) |
|---|---|---|---|---|---|
| Gilua core | 234 | 11,743 | 1,275 | – | 2,899 |
| Gilua adv | 66 | 3,891 | 174 | – | 342 |
| Lanchester core | 119 | 4,668 | 607 | 2,504 | – |
| Lanchester adv | 35 | 2,125 | 36 | 38 | – |

Effective taught pages are main + w_supp·supp + w_art·article, then dedup and test-out. At the mode this gives **21,100 effective pages for both apps** and 15,600 for the core.

### 1.2 Section granularity (my count from `toc/*.md`)
- Gilua has 2,492 core and 801 adv content sections in main ranges, about 4.7 pages per section.
- **Granularity varies 7-fold across books.** Feynman runs 1.8–1.9 pages per section. K1 runs 8.1, K2 9.2, Lienhard 10.1 and Patterson-Hennessy 12.6.
- So counting central results (CRs) as "sections × f_central", as A1 does, undercounts the coarse-section books and overcounts Feynman.
- I therefore model **CRs per effective page** directly.

### 1.3 My own unit count on a sample (lesson L2 of Gilua M0.1, §4.1–§4.2, K1 pp. 34–37)
- About **37 depth units in about 1,920 words over about 3.5 source pages**: about 10.5 units per page, at 52 words per unit.
- That fits A2's figures: K1 L1 had 8.2 units per page, K1 L3 had 11.5, and Lanchester L1 had 12 (84 units over B01 29–32 + B02 932–934).
- L2 also labels **3 explicit "תוצאה מרכזית" (central results) in 16 pages**, about 0.19 per page. L3 has 4 derivation blocks in 20 pages.
- These are survey chapters (K1 ch. I, EW101 ch. 2), so 0.19 is an upper-end anchor. The section-based estimate (f = 0.3–0.5 × 0.21 sections per page) gives 0.06–0.10.
- **Range used: 0.06–0.16 per page, mode 0.09** (about 1,900 CRs for both apps after dedup and test-out, against V3's about 1,680).

### 1.4 Dense words per source page
I estimated this two independent ways:
- **from units:** 8–12 units per page × v3's about 30–34 words per unit (v3 = 73% of the original words in sections at 39–47 words per unit) gives 260–400 words per page for K1. Less dense books carry fewer units.
- **from compression:** status-quo Gilua lessons run 690–830 words per K1 page, and V3's whole-lesson projection is 0.4–0.6, which gives 280–500.

**Range used: 150–400 words per page, mode 240.** This is close to A1's about 225 at the mode, with a fatter upper tail. It agrees with V3's own lesson size: 3.3–5k words per 1–2 CRs is about 2,600 words per CR, against my 2,670.

### 1.5 Timestamps in the review data
- After two Gilua lessons the learner held **post-lesson discussions of 47 and 36 minutes**. These were Q&A, article ideas, and one message of his own of 608 words.
- None of V3's hour totals contain this time.
- Lanchester L1→L2 was requested 39 minutes after L1, including generation. So the 10.4k-word lesson was not read in full at that sitting. Real reading pace cannot be inferred from the logs.

---

## 2. Assumptions (all triangular low / mode / high; see `PARAMS` in the code)

| Parameter | Range | Basis |
|---|---|---|
| supp pages taught | 0.3 / 0.5 / 0.7 | supp is read selectively (A1 counted 100%) |
| Lanchester article pages taught | 0.2 / 0.35 / 0.5 | A1 used 0.25. Articles are 500–900 source words per page |
| dedup share of pages | 0.06 / 0.13 / 0.20 | lexical MID ≈ 13.8%. Shape by app/tier: Lanchester core ×1.6 |
| delta-lesson cost | 0.20 / 0.30 / 0.45 | |
| test-out, Lanchester / Gilua | 0.03 / 0.10 / 0.20 ; 0 / 0.02 / 0.05 | His background is operational, not radar math. He re-studied K1 from M0.1 despite having reached p. 240 |
| diagnostic cost per Lanchester module | 10 / 15 / 30 min | test-out is not free |
| dense words per effective page | 150 / 240 / 400 (ρ = 0.5 with CR density) | §1.4 |
| reading speed, dense technical Hebrew | 110 / 140 / 190 wpm | at 30 words per unit, 140 wpm is one depth unit every 13 s. A1 assumed 150–220 |
| CRs per effective page | 0.06 / 0.09 / 0.16 | §1.3 |
| in-lesson active minutes per CR | 10 / 15 / 22 | A1's 12–22 |
| per-CR minutes scale with CR size | × (0.09 / CR density)^0.5 | finer tagging means smaller CRs. This damps the CR-count lever |
| active minutes per page for support sections | 0.2 / 0.4 / 0.7 | ≈ 0.12 support sections per page × 2–5 min |
| CRs per lesson; overhead per lesson | 1.3 / 1.6 / 2.0 ; 2 / 4 / 7 min | open, commit, done, transition |
| clarify / Explain / discussion per CR | 2 / 5 / 12 min | observed 36–47 min after long lessons of about 3–6 CRs |
| own summaries notebook per CR | 0 / 1.5 / 5 min | V3's day budgets 15 min/day ≈ 2.5 per CR. Partly overlaps A1's "own summary" |
| forge beyond in-lesson active work, per CR | 0 / 4 / 10 min | V3's day budgets 50 min/day ≈ 8 per CR, on top of A1's active work |
| review | 1.1–1.5 items/CR × 4–6 reviews × 0.8 / 1.5 / 3 min × (1 − credit 0.2 / 0.35 / 0.5) | a level-2.5 retrieval (assumptions, skeleton, estimate) is not a 1-minute flashcard |
| module-end check; monthly exam | 8 / 15 / 25 min per module ; 1.5 / 2.5 / 4 h per month | V3 retires overflow reviews to module-end checks |
| projects; articles and interviews; build + pilot overhead | 80 / 120 / 200 h ; 10 / 40 / 120 h ; 15 / 40 / 90 h | A6 ≈ 110 h with scope-creep skew; quarterly practitioner interviews; about 25–30 build sessions that he drives |
| factory failure probability; live share if it works; waits | 0.15 / 0.30 / 0.50 ; 3–15% of lessons × 10–25 min ; pipelined 3 / 8 / 15 min per lesson if it fails | three probes not yet run |
| days lost | 0.05 / 0.10 / 0.18 | holidays 3–5%, illness 2–3%, life 1–4%, reserve duty 0–8% (unknown) |
| light week | 0.90 / 0.93 / 0.96 | **V3's own rule** (a light week every 7th) |
| net study share of nominal hours | 0.85 / 0.93 / 1.0 | V3's own "5-hour day" schedules 250 min (0.83) |
| adherence at 5 h; loss per hour above 5 | 0.82 / 0.92 / 1.0 ; 0 / 0.03 / 0.05 | V3's warning trigger is < 80% |
| yield of hours above 5/day | 0.6 / 0.8 / 0.95 | A1 and T both say yield falls with long dense days (not modelled there) |
| pilot | +0.25 months | 2 weeks at about 50% yield |

**The A1 calendar** (used as the V3-friendly bound) is 6 days a week, 6.5% lost, every nominal hour delivered at full yield, and no light weeks. That gives 122 / 146 / 171 learner-hours a month at 5 / 6 / 7 h/day. The **realistic calendar** at the mode gives 91 / 102 / 113.

Excluded from scope, but a large sink if he wants it: the **3,241 pages of Gilua book exercises** (`ex`). Even 5 minutes a page adds about 270 h.

---

## 3. Results

### 3.1 Hours at the mode (deterministic)

| Component | Both (core + adv) | Core only |
|---|---|---|
| Reading | 603 | 445 |
| Active work per CR | 475 | 351 |
| Active work on support sections | 141 | 104 |
| Review (items + module checks) | 314 | 236 |
| Projects | 120 | 120 |
| *Subtotal: what V3/A1 count* | *1,653* | *1,257* |
| Clarify / discussion | 158 | 117 |
| Forge (beyond in-lesson active work) | 127 | 94 |
| Lesson overhead | 79 | 58 |
| Generation wait (expected) | 62 | 46 |
| Notebook | 48 | 35 |
| Articles and interviews | 40 | 40 |
| Build + pilot | 40 | 40 |
| Test-out diagnostics | 38 | 30 |
| **Total** | **2,245** | **1,716** |
| CRs taught / lessons | 1,900 / 1,188 | 1,403 / 877 |

All-in, that is **71 minutes per CR**, against V3's 50 (1,400 h / 1,680 CRs).

**Monte Carlo (20,000 runs).** Hours for both apps: P10 / P50 / P90 = **2,206 / 2,578 / 3,016**. Core only: 1,695 / 1,973 / 2,301. The V3-scope categories alone give 1,534 / 1,809 / 2,134 for both apps.

The best case, with every parameter at its favourable end, is **813 h for both apps**, or about 6 months at 6 h/day. The ranges are wide, and the pilot will collapse them.

### 3.2 Probability of finishing (P(months ≤ d))

**(a) Most V3-friendly: V3's hour categories + A1 calendar**

| | P50 months | ≤6 | ≤8 | ≤10 | ≤12 | ≤15 | ≤18 |
|---|---|---|---|---|---|---|---|
| Both, 5 h | 14.8 | 0.00 | 0.00 | 0.00 | **0.05** | 0.54 | 0.94 |
| Both, 6 h | 12.4 | 0.00 | 0.00 | 0.05 | 0.41 | 0.94 | 1.00 |
| Both, 7 h | 10.6 | 0.00 | **0.01** | 0.33 | 0.83 | 1.00 | 1.00 |
| Core, 5 h | 11.3 | 0.00 | 0.00 | 0.17 | 0.69 | 0.99 | 1.00 |
| Core, 6 h | 9.4 | 0.00 | 0.10 (≤7.4: **0.03**) | 0.69 | 0.98 | 1.00 | 1.00 |
| Core, 7 h | 8.1 | 0.01 | 0.48 (≤6.3: 0.02) | 0.96 | 1.00 | 1.00 | 1.00 |

**(b) Full hours + A1 calendar** (every nominal hour delivered)

| | P50 | ≤8 | ≤10 | ≤12 | ≤15 | ≤18 | ≤24 |
|---|---|---|---|---|---|---|---|
| Both, 5 h | 21.4 | 0 | 0 | 0 | 0 | 0.07 | 0.83 |
| Both, 6 h | 17.9 | 0 | 0 | 0 | 0.07 | 0.52 | 1.00 |
| Both, 7 h | 15.3 | 0 | 0 | 0.02 | 0.42 | 0.91 | 1.00 |
| Core, 5 h | 16.4 | 0 | 0 | 0 | 0.22 | 0.78 | 1.00 |
| Core, 6 h | 13.7 | 0 | 0 | 0.12 | 0.77 | 0.99 | 1.00 |
| Core, 7 h | 11.8 | 0 | 0.07 | 0.55 | 0.98 | 1.00 | 1.00 |

**(c) R6 best estimate: full hours + realistic calendar**

| | P10 / P50 / P90 months | ≤12 | ≤15 | ≤18 | ≤24 |
|---|---|---|---|---|---|
| Both, 5 h | 24.7 / 29.4 / 35.0 | 0 | 0 | 0 | 0.07 |
| Both, 6 h | 21.9 / 26.1 / 31.1 | 0 | 0 | 0 | 0.27 |
| Both, 7 h | 19.8 / 23.7 / 28.4 | 0 | 0 | 0.02 | 0.54 |
| Core, 5 h | 19.0 / 22.6 / 26.7 | 0 | 0 | 0.04 | 0.68 |
| Core, 6 h | 16.9 / 20.1 / 23.8 | 0 | 0.01 | 0.21 | 0.91 |
| Core, 7 h | 15.3 / 18.2 / 21.7 | 0 | 0.08 | 0.47 | 0.98 |

P(≤6), P(≤8) and P(≤10) are 0.00 in every row of (b) and (c).

**Hours per day needed:**
- **Most friendly accounting (a), P50 / P80:**
  - both apps: 4 months 18.5 / 20.7; 6 months 12.4 / 13.8; 8 months 9.3 / 10.3; 12 months 6.2 / 6.9;
  - core only: 8 months 7.1 / 7.9; 12 months 4.7 / 5.2.
- **Full hours + A1 calendar, both apps:** 12 months needs about 9.0 h/day; 8 months about 13.6.
- **Realistic calendar:** both apps in 12 months is out of reach below 14 h/day. 18 months needs 11.4 h (both) or 7.1 h (core).

### 3.3 Waterfall: from V3's inputs to R6 (both apps, months at 7 h/day)

| Step | Months | Hours |
|---|---|---|
| V3/A1 inputs through the R6 model | **6.9** | 1,180 |
| + scope (supp 50%, articles 35%, test-out L10% / G2%, dedup 13%) | 7.1 | 1,214 |
| + CR density 0.074 → 0.09 per page (CRs smaller) | 7.4 | 1,270 |
| + reading: 225 words/page at 185 wpm → 240 at 140 | 8.5 | 1,445 |
| + review: 1.0 → 1.5 min per item, plus module-end checks | 9.5 | 1,626 |
| + support active work, projects 110 → 120 h | 9.7 | 1,653 |
| + hidden sinks (forge, dialogue, notebook, overhead, wait, articles, build, diagnostics) | 13.2 | 2,245 |
| + realistic calendar (lost 10%, light weeks, net 93%, adherence, fatigue, pilot) | **20.2** | 2,245 |

The single largest step is the **calendar (+7.0 months)**. The second is the **sinks V3's own day plan contains (+3.5)**. Reading speed and review time add about 1 month each.

### 3.4 Sensitivity

**Tornado** (both apps, 6 h/day, realistic calendar, base 22.2 months, each input moved low → high with the others at the mode):

| Input | Range | Months | Swing |
|---|---|---|---|
| CRs per page | 0.06–0.16 | 19.9 → 26.6 | **6.6** |
| Dense words per page | 150–400 | 20.0 → 26.1 | **6.1** |
| Adherence | 0.82–1.0 | 25.0 → 20.3 | 4.7 |
| Active minutes per CR | 10–22 | 20.6 → 24.4 | 3.7 |
| Net study share | 0.85–1.0 | 24.3 → 20.6 | 3.7 |
| Days lost | 0.05–0.18 | 21.0 → 24.4 | 3.4 |
| Reading speed | 110–190 | 23.8 → 20.6 | 3.2 |
| Forge per CR | 0–10 | 21.0 → 24.0 | 3.1 |
| Dialogue per CR | 2–12 | 21.3 → 24.4 | 3.1 |
| Minutes per review | 0.8–3 | 21.3 → 24.2 | 2.9 |
| Dedup | 0.06–0.20 | 23.2 → 21.2 | 2.0 |
| Factory failure (fails vs works for sure) | – | 23.1 vs 21.8 | 1.3 |

**Spearman rank correlation with months** (Monte Carlo): CR density +0.61, words per page +0.55, adherence −0.31, net share −0.23, days lost +0.21, active per CR +0.21.

**Two content numbers dominate:** how many CRs there are, and how many dense words each page needs. The learner's delivery numbers come next. These are exactly V3's pilot unknowns U1, U2 and U4, so the pilot design is right.

---

## 4. Hidden sinks and hidden savings

| Item | Mean hours (both) | Months at 6 h, realistic | In V3's total? |
|---|---|---|---|
| Clarify / Explain / discussion (observed 36–47 min per long lesson) | 213 | 2.1 | No |
| Forge (V3's day: 50 min/day on top of in-lesson active work) | 157 | 1.5 | No (A1's S7 has none) |
| Review at a realistic 1.5 min per item + module checks | +180 over V3 | 1.8 | Partly |
| Lesson overhead | 97 | 1.0 | No |
| Generation wait (factory fails 30%; refusals; first lesson of the day) | 83 | 0.8 | No. A factory failure alone adds +1.1 months |
| Notebook (V3's day: 15 min/day) | 73 | 0.7 | No |
| Articles and interviews beyond projects | 57 | 0.6 | No |
| Build + pilot (≈25–30 sessions he drives) | 48 | 0.5 | No |
| Test-out diagnostics | 47 | 0.5 | No |
| Light weeks (V3's own rule) | – | ≈ +7% calendar | **No, the months ignore them** |
| Holidays, illness, reserve duty | 5–18% of days | 1.3 → 3.4 swing | 6.5% only |
| Fatigue and adherence above 5 h/day | – | 7 h buys only ≈ 1.24× of 5 h, not 1.4× | No |
| Book exercises (3,241 `ex` pages) | 270+ if wanted | 2.6+ | Out of scope; say so |

| Saving | Effect (both apps, mode) |
|---|---|
| Test-out Lanchester 25% / Gilua 5% plus dedup 20% (the high end of everything) | −2.2 to −2.5 months |
| Factory certain to work | −0.4 months (the base already expects 70% success) |
| Adv as reference (25% of adv pulled in by projects, the rest deferred) | about 17–21 months at 7–5 h, against 20–25 for both in full |
| Adv as phase 2 after the core | 4.7–5.8 months on its own |
| Lean content (0.06 CR/page, 180 words/page) | −3.4 to −4.2 months |

No saving that can be defended closes the gap. Test-out cannot be large, because the curriculum is physics and mathematics, not operational knowledge. Dedup is already in the base.

---

## 5. V3's internal consistency
1. **Day plan against months.** V3's day: 6 CRs per 5-hour day, 5 lesson days, 1 project day, 1 rest day, and a light week every 7th. On its own 1,680 CRs that is 280 lesson days ÷ (5 × 6.5/7 × 0.95 per week) = **about 14.6 months at 5 h/day.** V3 says 12.
2. **"121 learner-hours a month at 5 h/day".** This needs 5 full net hours on 26 days a month at 93.5% attendance. But V3's own 5-hour day schedules 250 minutes, and its light weeks are not deducted. V3's own schedule therefore delivers about 100 hours a month.
3. **The review cap against retention.** About 26 reviews a day in 25 minutes is under 1 minute per item. A level-2.5 retrieval (assumption, skeleton, estimate) takes 1–3 minutes. Either the cap binds, and retention falls below the claimed 0.85 (a silent depth loss), or review costs 2–3× what V3 budgets.
4. **Lesson size against lesson time.** V3's lessons are 3.3–5k words per 1–2 CRs, about 2,600 words per CR. At 140–185 wpm that is 14–19 minutes of reading per CR, plus 12–22 minutes of active work, so 26–41 minutes. The day plan allows 27.5 minutes per CR: the very bottom of that range.
5. **Four months.** V3 says about 14 h/day. On V3's own categories with my inputs it is 18.5 (P50). With full accounting it is far beyond any sustainable load.

---

## 6. Comparison: A1, V3 and R6

| Question | A1 | V3 | R6 | Verdict on V3 |
|---|---|---|---|---|
| Inventory and the "≈24k pages" scope | measured | uses A1 | same totals from the raw syllabi | **Right** |
| CR count | 1,470–2,450 before dedup; uses ≈1,680 after dedup | ≈1,680 | 1,620–2,820 (P10–P90), mode 1,900 | Slightly optimistic. Section-based counting misses the coarse-section books (K1/K2/K3, E16, E22) |
| Words per CR | 1,300–2,200 + supports | 3.3–5k per 1–2 CRs | ≈2,670 per CR, all-in | **Right** (consistent) |
| Reading speed | 150–220 | inherits | 110–190 | Too optimistic for dense text (+1 month) |
| Review | +20% share | 25-min cap, 0.85 retention | 1.5 min per item + checks | Too optimistic, or hides a depth loss |
| Forge, notebook, dialogue | not in the hours | in the day plan, **not in the hours** | counted | Too optimistic (+3.5 months at 7 h on the A1 calendar) |
| Calendar | 6 days, 3–10% lost | 121 h/month at 5 h | 91–113 h/month at the mode | Too optimistic (+7 months) |
| Levers (dense lessons, no wait, dedup, review is required) | ranked | adopted | confirmed. Dense words per page and CR count top the tornado | **Right** |
| 4 months impossible | 13.7 h/day | about 14 h/day | 18.5 at the friendliest; realistic >14 | **Right**, and understated |
| Core-first as the minimal trade | 7.4 months at 6 h | 7.4 months at 6 h | P50 14 (A1 calendar) to 20 (realistic) | Right as the *trade*, **wrong as a date** |
| The pilot and its five unknowns | – | U1–U5 | the tornado's top 6 are U1, U2, U4 | **Right**: the most valuable thing in V3 |

**Where V3 is too pessimistic.** I found nothing material.
- Its "≈14 h/day" for 4 months is, if anything, too *low*.
- Its adv-phase estimate (about 3 months) is short: alone it takes 4.7–5.8 months.
- The one open upside is CR density near 0.06 with lean pages. That gives about 18.5 months at 6 h/day realistic, and about 6 months at the full optimistic corner. Only the pilot can show that.

**Where A1 stands.** Its *pessimistic* end (S7: 2,621 h) is close to my P50 (2,578 h). A1 reported the midpoint of ranges whose inputs (reading speed, the calendar, the sinks it left out) all lean optimistic. V3 then took that midpoint as the plan.

---

## 7. What to tell the learner instead
- **Both apps at full depth, with projects and review: about 15–24 months at 6–7 h/day** (P50; the lower number if he delivers every planned hour). It is about 2 years at 5 h/day. 12 months needs about 9 h/day of fully delivered study.
- **Core of both: about 12–20 months at 6–7 h/day.** In 8 months at 7 h/day he completes about **50–75% of the core** at full depth.
- **4–6 months is not a schedule for full depth under any assumption.** "A few months" can only mean a chosen slice, such as a spike (radar → EW → missiles plus the Gilua nodes they need), or a promise that is not kept.
- Put **dates only after the pilot.** Use these refined thresholds:

| Pilot measure | Threshold | Implication |
|---|---|---|
| CRs per page | ≤ 0.07 | V3's CR count holds |
| All-in minutes per CR (reading + active + dialogue + notebook + forge + review) | ≤ 50 | V3's per-CR budget holds |
| | 70 | R6's mode |
| Delivered net hours ÷ planned hours over days 8–12 | ≥ 0.9 | the A1 calendar is plausible |
| | ≈ 0.7 | use the realistic calendar |
| Minutes per review item | > 1.2 at a 25-min cap | retention will fall short of 0.85; raise the cap or accept less depth |

A quick check: months ≈ CRs × minutes-per-CR ÷ (60 × delivered hours per month).

---

## 8. Limitations
- **Parameter independence.** Apart from words per page against CR density (ρ = 0.5), the Monte Carlo treats parameters as independent and triangular. Its P10–P90 is therefore narrower than the true structural uncertainty. The best-case corner (813 h) shows how far favourable data could move the answer. Read the 0.00 cells as "under 1% *within this model*", not as proof.
- **Source of the unit and CR anchors.** These come from survey chapters only: K1 ch. I and EW101 ch. 2. No lesson exists yet for a Gere-style or Oppenheim-style book.
- **Clarify time.** The figure comes from two sessions. Dense lessons might reduce it, or might increase it.
- **The calendar haircuts.** Each is modest (5–10%), but together they compound to about 0.72 of A1's calendar. Each is either V3's own rule or a typical figure, and none has been measured on this learner (pilot U4).
- **Dedup shape.** The relative shape by app and tier follows the lexical MID shape. I did not re-derive overlap from the texts.

## Files
- `round2/R6_model.py`: the model (inventory from the syllabi, TOC section counts, parameters, Monte Carlo, tornado, waterfall, scenarios, probability grid). Run it with `python3 -I R6_model.py`.
- `round2/R6_recount.md`: this report.
