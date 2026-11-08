# Vision v2 — after critique round 1 (R1 science, R2 learner, R3 tech)

## What changed from v1 and why
- **Authority is T-shaped (R1).** No one is an authority on 316 + military modules. Every module keeps full level-2.5 lessons (nothing taught less deeply — R2), but the heavy "ownership" apparatus (projects, oral exams, deep review, primary sources, expert contact) goes to 2–3 *spikes* the learner chooses. Candidate spikes at the intersection of his background and the two libraries: (a) sensing & EW — detection, link/radar budgets, signal processing; (b) guidance, control & autonomy — missiles, drones, robotics; (c) space systems; (d) operations research / force modelling. He chooses; the system does not.
- **Measurement moves outside the closed loop (R1).** The system that writes, teaches and grades cannot be the judge of "authority". External anchors: a frozen held-out exam per spike (pretest now, unannounced retests), numeric items graded deterministically, a monthly practitioner review, real-world predictions with resolution dates, and published pieces with their corrections.
- **Framing (R2).** Word floor kept: a core thread ≥ 4,000 words (his rule) with depth layers *written on demand* (R3: cost-neutral, shorter waits), plus an automatic coverage proof per lesson. Mastery is a "proven" mark that accelerates, never a lock. Spaced review is reopened openly with evidence, and lives inside lessons and his notebook rather than as a separate deck. Opus writes everything that teaches and every answer key; cheaper tiers only check answers against Opus's key, with an Opus-only switch.
- **Feedback grounded in keys and reality, not the tutor's opinion (R1).** Answer keys are generated with the lesson; "catch" drills use real errors (source errata, documented failures, wrong claims in the wild, outputs of other models) rather than errors the tutor plants.
- **Capacity (R1, R2).** A hard cap of ~5 h/day for everything, a short-day mode (2 h), a weekly consolidation day; one product change at a time; app-building capped at ~10% of the week.
- **Phase 0 is hardening and truth (R3, R2).** Reputation depends on accuracy, and today there are silent failure modes.

## 1. North star — what we measure, and where it comes from
| Ability | Measured by | Source of truth |
|---|---|---|
| Rebuild a central result | closed-book typed reconstruction in warm-ups/oral exam | Opus key + blind second grader; learner audits a sample |
| Estimate | 90% intervals and log-error on numeric items | deterministic (true value known) |
| Judge | decision cases with documented outcomes | the documented outcome + practitioner review monthly |
| Catch | real errors found in real texts | errata/failure records |
| Transfer | bridge sessions (Gilua structure ↔ Lanchester system) | practitioner review |
| Practice layer | oral-exam practice items | practitioner review |
| Produce | published articles, interviews held, corrections received | the world |
Pretest the spike exams now; that baseline is the honest progress line.

## 2. The day (≤ 5 h, three modes)
- **Full day:** warm-up 15 min (≤ 12 due items, typed, with confidence) → 3–4 lessons (each ≈ 45–60 min: ≥4,000-word core, 4–6 committed answers, depth layers on click) → write the lesson's summary section *from memory first*, then compare with the lesson (his notebook is the generation step and the future review deck) → one judgment item (estimate or decision case) → close.
- **Short day (2 h):** warm-up + one lesson + notebook.
- **Consolidation day (weekly):** no new material; spike project, bridge session, article/interview work, monthly oral exam.

## 3. Lesson v3
- Opening: 2–3 retrieval questions from earlier lessons (answer first), one pre-question on today's central result.
- Core thread ≥ 4,000 words, one central result (≤ 2), definition order (rules 5א–5ד), topics not pages (8א).
- Commit-before-reveal: think blocks take a number / choice / one line + confidence before opening; derivations have one "your step"; scene/sim captions ask for a prediction.
- Practitioner paragraph per central result (conventions, standards, tools, 2–3 professional misconceptions, one interview question + what a strong answer contains). Marked as model knowledge with certainty.
- Keep card: definitions, key formulas, 5–7 numbers with their mental derivation (becomes review items).
- Depth layers listed in the plan; each written on click with the lesson in context (history colour, extra domains, long derivations, `today` catalogue).
- Answer keys for every think/exercise produced with the part (hidden), used by the checker.
- Certainty tags 5–10 per lesson; completeness lint with auto-continue; a facts check once per lesson on the plan facts + keep card.
- Escalation of examples/connections with the course stage stays (his top priority), now verifiable: the bridge log shows connections closing over time.

## 4. Learner model (lean)
- Per app db: `concepts/<id>` (from keep cards; edges: prerequisite, same-structure, used-by), `events/<day>_<session>` shards (answers, confidence, hint level, clarify questions, Explain asks, scratch verdicts, quiz items), `reviewIndex` (Leitner boxes, capped daily load), `calibration/<month>`.
- Course memory becomes a short profile + per-concept notes retrieved per lesson; a version log; fix the overwrite race.
- Use: next lesson's warm-up and depth adaptation (fade scaffolding where strong; Lanchester skips what he knows operationally), "proven" marks on the map.
- Cross-app: a nightly bridge (the existing scheduled backup task reads both dbs) writes a `peer` summary doc into each app, so each tutor knows the other app's concepts and can cross-reference.

## 5. Judgment and authority
- Calibration log (numeric, deterministic) across both apps; trend by spike, not by every domain (R1: small samples).
- Decision cases cut at the decision point, from documented histories (failures, procurement, design reviews); learner decides, then the record is revealed.
- Black-box experiments in the browser (hidden gain/τ, RCS, drag) — Gilua first.
- Lanchester: a war-game turn per module capstone (later, after a probe for refusals).
- Monthly oral exam per spike ("senior engineer" persona), graded against keys, blind second grader, transcript kept for the practitioner review.
- Production: notebook items → claims table (source + certainty) → outline (thesis, counter-thesis, key number) → draft from memory → fact-check; interview kit per module; predictions logged before real interviews; failure ledger across lessons.

## 6. Phase 0 — hardening and truth (first)
1. Completeness: Gilua M0.1 lesson 3 ended mid-exercise with no keep/coverage/today; add lint + one auto-continue.
2. Fix the three shaky claims (ballistic optimum under drag, ERP vs EIRP, GPS ↔ Lobachevsky) in place.
3. Port Lanchester's refusal protections to Gilua (titles-only part instructions, retry); re-wire diagnostics capped at ≤ 4 calls.
4. Cost bugs: graders that name Opus count as Opus — remove `model` from quick calls.
5. Per-part source pages; byte guard on fixed context (prompt_too_large risk in late parts).
6. Memory: version log + overwrite race fix. Docs drift (onDiag, history budget).
7. Begin the shared package (`shared/lab`) only for files the next phases touch.

## 7. Roadmap
Phase 0 (≈3 sessions) → Evidence layer: think commit + logging + checker; structured quiz + "proven" (≈3–4) → Lesson v3 + notebook-from-memory step (≈3–4) → Learner model + warm-up + review index (≈4–5) → Judgment (calibration, cases, black boxes) + oral exam (≈4–6) → Cross-app bridge + production pipeline (≈4–5). ~23–30 sessions, one change at a time, each validated in real lessons before the next.

## 8. Schedule — three honest options
- **A. Keep 2 months for P0–P10 (~70 pages/day):** possible only by making most modules lighter — which contradicts "no reduction". Not recommended.
- **B. Full depth everywhere, ~4–5 months for P0–P10:** ~25–35 pages/day, with production and review.
- **C. Spike-first:** the spike chains at full apparatus first (~6–8 weeks to a publishable first piece), the rest at full lessons without the heavy apparatus, in parallel.
The system reports the real pace from data weekly; he decides.
