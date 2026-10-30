# Vision v3 — synthesis of round 2

Base: T_tournament.md hybrid "Ledger, Lesson, Forge" (read it; this file records only the decisions and the deltas on top of it).

## Evidence that changed the plan in round 2
1. **The task is ~24,000 main pages (16,400 core), 454 taught modules, ~1,500–2,500 central results (CRs).** The book side has little fat (<6% history/summaries/problem sets). The fat is in the *output*: a 15-page lesson becomes 8–15k words. (A1)
2. **Half of each Gilua lesson carries no new depth**; the waste is page-following narration, restatement, history colour, signposting. Tutor-led level-2.5 paragraphs are dense (49–53 words/unit); book-led paragraphs are not (109–152). (A2)
3. **Density loop with blind judges**: v2 (55–69% of words) lost ~5–10% of depth units; v3 (73% of words) restores 100% of units + fixes 5 factual issues present in the ORIGINAL (asymmetric flat minimum, can geometry, 1/kT, isoperimetric proof history, continuity condition). [J3 verdict pending.] Lesson: the safe compression for the densest sections is ~25–30%; for book-narration-heavy sections it is much larger (projected 0.4–0.6 for whole lessons). Depth-dense ≠ short; the gain is in removing functions, not squeezing sentences.
4. **Scope per lesson is the real lever**: L3 packed 230 units / 15–25 topics into one lesson. Lessons sized to 1–2 central results (~3.3–5k words) are both denser and complete. (A1, A2, T)
5. **Overlap**: 13.8% of content pages re-teach a result taught elsewhere (22% in Lanchester core); Lanchester P0 (M0.1–M0.7) is largely a compressed repeat of Gilua P4–P8 → delta lessons. Saves ~150–270 h. (A1)
6. **The binding constraint is learner hours**, not order (critical path = 11.5% of core). Monte Carlo (A1): status quo 2,734 h; hybrid ~1,400 h with retention 0.85 vs 0.21. (A1, T)
7. **The factory works on paper**: nightly cloud sessions can pre-write, verify (Python recompute, source check, rule lint, render test), and shelve lessons; zero wait; ~200–300 lines of page changes; 3 probes decide it (unattended db write permission, session length, usage). (A3)
8. **Projects**: ~8 fit (3 flagships), ~110 h; reordering Lanchester (radar core → missiles → air-defense → orbits) spreads them evenly. Israeli publication constraints are real (censor; export rules; service obligations). (A6)

## The honest trade-off (final)
At the same full depth, with projects and spaced review, the choice is only the calendar × daily hours:
- **Both apps, everything (core + adv): ~8 months at ~7 h/day, or ~12 months at ~5 h/day.**
- **Core of both first (adv as phase 2 or pulled in by projects): ~7.4 months at 6 h/day, ~6.3 at 7 h/day.**
- **4 months is not achievable at full depth** (would need ~14 h/day). Anything promising it cuts depth silently.
The three levers that get the plan from ~22 months (today's format at 5 h/day) to ~8: result-sized dense lessons (−37%), the factory (−18%), dedup/delta lessons (−6–10%). Spaced review costs +20% and is what makes the learning stay (0.85 vs 0.21 retained).

## Decisions the learner must make (with recommendations)
1. **Calendar**: recommend "core of both first" at 6 h/day (~7.4 months), adv tier as phase 2; or "everything" at 7 h/day (~8 months) if sustainable after the pilot.
2. **Lesson length rule**: replace the ≥4,000-word floor with "1–2 central results per lesson + 100% unit coverage proof + density lint (25–35 words/unit)". Most lessons land at 3.3–5k anyway. Show him the J1/J2/J3 evidence; his call.
3. **Spaced review**: reopen — capped ~25 min/day, seeded from his notebook markers, forge/project use counts as review.
4. **Spike/flagships**: OR & force modelling first (fits fastest), flagships: Radar–EW Budget Lab, Track-to-Intercept, Interceptor Arithmetic.
5. **The factory**: approve the 3 probes (one evening), then build.
6. **Practitioners**: two names; quarterly.
7. **Third app (math lab)**: freeze or merge into Gilua.
8. **Run the 2-week pilot** before committing to the calendar.

## Build sequence
- **Step 0 (≈3 sessions, from round 1, still needed)**: Gilua refusal protections, partial-text-on-refusal, cost-tier bug, truncation lint + auto-continue, usage counter, per-part pages, memory race fix, facts check + errata, fix 3 claims.
- **Step 1 (≈5 sessions, pilot build)**: commit-before-reveal + events log; CR ledger v0 (from keep/plan); dense lesson rules (צ1–צ12 + J fixes) in both apps; factory v0 (probes → one shelved lesson → ready shelf in page); forge v0 (estimates with intervals; reconstruction); review v0 (capped).
- **Pilot (2 weeks)**: measure the 5 unknowns (CR count & dedup, minutes/CR, dense vs long delayed A/B ≥95%, sustainable hours, factory delivery/usage/refusals/planted-error catch). Decision memo day 14.
- **Then**: atlas cards for ~40 high-fan-out structures, flagships, cross-app bridge, oral exams, calibration dashboard, Lanchester reorder.

## Experience (keep what he loves)
Cream/graphite look, sounds, notes, notebook, scenes — all kept. New interactions get the same craft (satisfying commit lock, typing sound, progress that matters: proven marks, connections map, "what I can now do closed-book" weekly).
