# R4. Final red-team review of Vision v2

Verdict: V2 fixed the framing well (T-shaped authority, external measurement, the floor in the core thread). It did not fix the arithmetic. Three of its numbers can't all hold at once: the day, the review cap and the build budget. It also quietly dropped four of R1's and R3's concrete safeguards.

## 1. Objection by objection: resolved or papered over

| Objection | V2's answer | Status |
|---|---|---|
| R2: "no reduction", ≥4,000 words | Core thread ≥4,000 words, depth layers, coverage proof | **Resolved in framing, open in practice.** Opus beats a floor by 2–3× (C §0); without a **ceiling** the core runs 6–10k words and the day breaks (§2). On-demand layers mean the coverage proof certifies material *can be* taught, not that it was. Say so plainly. |
| R1: authority is narrow | Spikes (2–3), full lessons everywhere | **Mostly resolved.** Unsaid: non-spike modules get full text but no review, so he keeps 10–35% after a week (C). A reduction in what he *owns*, not *reads*; he should accept it explicitly. |
| R1: closed-loop measurement | Held-out exam, deterministic numerics, practitioner, predictions | **Partly resolved.** Missing: (a) the blind second grader has no identity; Opus again is not independent. (b) No leakage control: `search_library` can pull held-out book exercises into lessons. (c) No named practitioner. |
| R1 §2.1: review debt | Warm-up ≤12 items, Leitner, "capped daily load" | **Papered over.** The cap is stated, but the inflow is never reconciled with it (§2). |
| R1 §2.2/3.6: rest | ≤5 h cap, short day, weekly consolidation day | **Papered over.** Consolidation is a heavy production day; R1's weekly rest day and light week every 6–8 weeks are gone. |
| R1 §2.4 / R3 §3.3: grader trust | Opus keys, cheap checker, Opus-only switch | **Regressed.** R3's "I disagree" button, the golden set of ~30 items and the dispute rate as a quality metric have all disappeared. |
| R1 §1.8: practitioner layer is folklore | "Marked as model knowledge with certainty" | **Weak.** Still unsourced, and the material he is most likely to quote. Keep it out of the claims table until verified. |
| R3: cost | Depth on demand, "cost-neutral" | **Not neutral** (§2). |
| R3 §3.2: refusals via fed-back prose | Port the protections to Gilua | **Partly resolved.** `peer`, per-concept notes and warm-up items are new fed-back channels; R3's "structured fields only" rule is missing. |
| R2: summaries notebook at the centre | Summary written from memory per lesson | **Half resolved.** There are now two review sources, keep cards → `reviewIndex` and "the notebook is the future review deck". Pick one: "remember this" markers in his summary, seeded from the keep card. |

## 2. Arithmetic, checked and corrected

**Hours per full day.** Reading speed from C: 150–200 words per minute for dense Hebrew technical text.
- Core reading: 4,000 words takes 20–27 min. At the likely real length of 5,000–6,000 words it takes 25–40 min.
- Commits: 4–6 per lesson at 1–2 min each, 5–12 min.
- One depth layer clicked: an Opus wait of 1–3 min, plus 8–12 min of reading.
- Notebook "from memory, then compare": realistically 15–20 min per lesson. V2 does not budget it.
- Per lesson that comes to **50–80 min**, not 45–60.
- Fixed items: warm-up 15 min (12 typed items take 15–25 min) and a judgment item of 10–15 min.
- **3 lessons: 3.0–4.7 h + 0.4–0.7 h = 3.4–5.4 h. 4 lessons: 4.4–6.1 h.** Four lessons break the 5-hour cap in practice. Generation waits (B: 10–25 min per lesson, partly overlapping reading) come on top.
- **Correction:** a full day is **3 lessons**. Four is possible only on a day with no depth clicks and a light notebook.

**Words per day.** 3 × 4,000 = 12,000 core words minimum, and 15–18k with real overshoot and one layer per lesson. That is acceptable. The rule needs a **core band of 4,000–5,000 words**, enforced by the planner and the lint; everything above it goes into layers.

**Opus calls per day** (3 lessons):
- Plans and parts: 3 × (1 + 3–5) = 12–18.
- Auto-continue: 0–3. Depth layers: 3–6. Facts check: 3, unless it runs on the default tier.
- Escalations: commits below "clearly right" go to Opus. At 15–18 commits a day with 25–40% escalated, that is 4–7.
- Notebook comparison: 3. Scratch checks: 1–3. Judgment grading: 1. Oral-exam scoring: about 1 a week.
- **Total ≈ 30–45 a day; ≈ 45–60 with the Opus-only switch.**

R3's baseline is about 30 calls a day. So V2 is not cost-neutral: each call is cheaper on input, but there are more calls, and the answer keys add 10–20% to each part's output. `rate_limited` stays the binding limit, so a Phase 0 usage counter must replace these estimates with measurements.

**Review items at steady state.**
- Inflow: a keep card has definitions, formulas and 5–7 numbers, so 8–12 items per lesson, or 24–36 a day.
- Expanding Leitner (1–3–7–21–60) takes about 5 reviews per item, 6–8 with lapses.
- **Steady-state demand: 120–290 reviews a day.**
- Capacity: 12 warm-up slots plus 6–9 opening questions is about 20 a day, which sustains only **3–4 new items a day**.
- Without a rule, the backlog grows by 100+ items a day, and after a month the Leitner state is fiction.
- **Fix:** review covers spike modules only. Each lesson nominates 1–2 items (his "remember this" markers win). Non-spike modules get one delayed check at module end and are then retired. Overflow is retired, never accumulated, and the warm-up says how many were retired.

**Calibration.** One judgment item a day, split between estimation and decision cases, gives about 0.5 numeric items a day. Telling 90% from 80% needs about 100 resolved items (R1). Pooled, that takes ~200 days; per spike, more than a year. "Trend by spike" will show noise until 2027. **Fix:** pool across spikes and report quarterly with CIs. Raise the volume by putting intervals on keep-card numbers. Report that as recall calibration, a separate series from estimation calibration.

**Schedule options** (B: P0–P10 is 114 modules and 4,452 main pages; V1's 4,150 is the plan figure):
- **A:** 4,452 / 60 days = 74 pages a day (4,150 gives 69). Correct as stated.
- **B:** 4,452 pages at 25–35 pages a day = 127–178 lesson days. With 6 lesson days a week (consolidation day off) that is 21–30 weeks; with a real rest day, 25–36 weeks. **So 5–8 months, not 4–5.** Bigger omission: B covers **only 114 of the 316 Gilua modules and none of Lanchester**. Both apps draw on the same 3 lessons a day, so every Lanchester lesson slows Gilua.
- **C:** "6–8 weeks to a publishable piece" ignores prerequisites. (`prereq` locks): EW or guidance needs signals, probability and control after the P0–P3 foundations. Only spike (d), OR and force modelling, fits 6–8 weeks. "In parallel" needs a lesson split, such as 2 spike lessons and 1 backbone lesson a day.

**Build budget.** The roadmap is 23–30 sessions of 2–4 h each, or 46–120 h. At 10% of a 5 h × 7 day week (3.5 h a week), that is **13–34 weeks of building**. Either the cap is fiction or most features arrive mid-course, so cut whatever does not pay back within ~8 weeks.

## 3. Still wrong, risky or missing (including second-order effects)

1. **He disagrees with a grade.** There is no path for it today. Each argument costs 5–10 min (R1 §2.4). Restore the dispute button: one re-grade on another tier, then the item is logged and excluded from the stats. Show the dispute rate per grader prompt. If he wins a dispute and the Opus key was wrong, the error goes into the errata log and the lesson gets a correction note.
2. **A spike choice turns out wrong.** V2 makes the choice irreversible by default, because the pretest baseline, projects and review history are tied to it. Make the choice provisional, with a checkpoint at week 6 and explicit criteria: interest, publishing opportunities, practitioner access, pretest gain.
3. **The practitioner is unavailable.** Then two of the seven anchors (Judge, Transfer) and the whole Practice row have no source of truth. Name two people before Phase 2, ask for **one session a quarter per spike** (monthly × 2–3 spikes is too much to ask of a volunteer), and use editor feedback on published pieces as the fallback. Military-technical transcripts and articles may also be subject to publication rules, such as the military censor. Check this before the first piece.
4. **The two apps diverge.** The rules already live in four places, two prompts and two docs. The evidence layer will be built twice unless `shared/lab` comes first for the touched files. The bridge writes model-derived text into each app's context, which is a new refusal channel in Lanchester. Write `peer` as structured fields only. V2 also says nothing about the **third app** (`app/`, the original math lab, where the recorded position is p. 240). Freeze or retire it explicitly, or progress gets split three ways.
5. **Held-out exam hygiene.** Frozen items must come from pages excluded from lesson assignment, or be computed items. Store them outside the tutor's tools. A pretest of 30–40 items per spike takes about 2–3 h per spike; budget it.
6. **Error base rate.** C found 3 errors in 5 lessons. Fixing those three claims is cosmetic. What protects his reputation is the per-lesson facts check plus the errata log, and both are currently scheduled late.

## 4. Phase 0: right and complete?

Items 1–6 are right. Item 7 (shared package) belongs in Phase 1; leaving it in inflates Phase 0. **Missing:**
- **Keep partial text on refusal**; today it is blanked (R3).
- **A usage counter** (Opus calls a day, words a lesson, generation minutes) plus one week of baseline measurement before anything changes. Every later "it worked" claim needs this.
- **The core band rule** (4,000–5,000 words) in planner, prompt and lint. It is a prompt change, and it is what makes the day arithmetic hold.
- **A minimal facts check** (plan `facts` plus keep card, default tier) and an errata log.
- **Prompt byte snapshot tests** (vitest), so the byte guard is tested and not just written.
- **Learner-side work, no code:** a provisional spike choice, the pretest for spike 1, a named practitioner, and a decision on `app/`.

**A better first 3 sessions:**
1. **Gilua safety.** Port the refusal protections, keep partial text, fix the grader tiers, add the lint with one auto-continue and the usage counter.
2. **Inputs and truth.** Per-part pages, a byte guard with snapshot tests, the memory version log and race fix, the facts check plus errata log, fixes for the 3 claims, and the core band rule.
3. **The first thing he feels.** Commit-before-reveal on `think` (a number, choice or line, plus confidence; a satisfying lock; logged; no grading yet), built in `shared/lab` for `Think.tsx` only.

Without session 3, two weeks pass with nothing he can feel.

## 5. The 10 decisions that matter most, ranked

1. **A core band of 4,000–5,000 words, enforced.** It keeps his floor and is the only way 3 lessons fit in 5 h.
2. **3 lessons on a full day, plus one rest day and one production day a week.** The current day and week arithmetic does not close.
3. **Review covers spike items only, 1–2 per lesson, and overflow retires.** Otherwise the 120–290 reviews a day make the learner model fiction within a month.
4. **Pick spike 1 now, provisionally, preferably OR and force modelling.** It is his strength, has the fewest prerequisites, and is the only spike that can be published within 8 weeks.
5. **Restate the schedule with both apps included: 5–8 months for Gilua P0–P10 alone.** He should decide on true numbers.
6. **Restore the dispute path and the golden set.** Grader trust is the single point of failure for every measurement.
7. **Name two practitioners and set a quarterly protocol.** Without them, external validation exists only on paper.
8. **Usage counter and baseline week in Phase 0.** V2 is not cost-neutral, and rate limits will decide what survives.
9. **Move the facts check and errata log into Phase 0.** His reputation depends on accuracy, and the measured base rate is about 0.6 errors a lesson.
10. **Cut the roadmap to what pays back within 8 weeks, and freeze or retire `app/`.** At 3.5 h of building a week, the full roadmap takes 13–34 weeks.
