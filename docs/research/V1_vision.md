# Vision v1 — the ideal learning system for "becoming an authority" (Gilua + Lanchester)

Inputs: A_learning_science.md, B_app_audit.md, C_lesson_critique.md, D_landscape.md (same folder).

## 0. The diagnosis in one paragraph
Today both apps are world-class *lesson writers* bolted to a *reading* experience. "Done" means "the text finished generating" (finishLesson), there is no measurement of what the learner can do, no retrieval, no spacing, and the learner's best signals (questions, quiz answers, Explain chats, scratchpad checks) are thrown away. Lessons are 8–15k words (5–9 h/day of reading at 5 lessons/day); a careful reader keeps an estimated 10–35% a week later. The best-replicated effects in learning science (retrieval, spacing, generation, comparison, calibration feedback) are almost entirely absent, and the AI-tutor trials show that "AI explains, learner reads" is the configuration that can *harm* unassisted performance. The fix is not more or better text; it is to turn the learner from reader into producer, and to make the system know what he can do.

## 1. North star: define "authority" operationally (so we can measure it)
An authority in a topic can, without help:
1. **Rebuild** each central result: structure, derivation skeleton, where each assumption enters (oral/typed, closed book).
2. **Estimate**: give 90% intervals that contain the truth ~90% of the time, and point estimates within ×1.5 for the standard quantities.
3. **Judge**: given an under-specified real decision, list the questions that matter and the number that would flip the decision.
4. **Catch**: find a planted error in a fluent text (AI, vendor, paper).
5. **Transfer**: map the structure to another field and say where the analogy breaks.
6. **Practice layer**: know how practitioners actually do it — conventions, standards, tools, common professional misconceptions.
7. **Produce**: write a publishable explainer/op-ed and run a sharp expert interview.
Every feature below exists to move one of these seven numbers, and the app measures them.

## 2. Principles
- Produce before you receive (commit-before-reveal everywhere).
- Material is never cut; it is layered (core thread vs depth on demand). Depth stays — the reading path gets shorter.
- The system must know what the learner can do (a learner model), and adapt to it.
- Spacing comes "for free" through the curriculum (encompassing practice), plus a short daily review.
- Judgment is trained with feedback loops (calibration, cases with hidden outcomes), not with prose about judgment.
- The tutor reveals one step at a time when the learner is working; it writes long only when it is the worked example.
- Truth first: verified numbers, flagged uncertainty, a correction loop.

## 3. The new daily loop (≈ 4.5–5 h)
1. **Warm-up (15 min):** 6–10 spaced retrieval items from the due queue (structure, numbers, "why", spot-the-error), typed answers, confidence; graded by a cheap model call.
2. **Lesson blocks (2–3 × 60–75 min):** the new lesson format (§4).
3. **Judgment drill (20 min):** one estimation item (log-error scored, interval + confidence), one decision case cut at the decision point, or one black-box experiment.
4. **Authority block (30 min):** teach-back of today's central result to a "confused student" persona with a planted misconception; or an oral exam turn; or drafting an article paragraph/interview questions from today's material.
5. **Close (5 min):** the app shows the 7 numbers' movement today and what is due tomorrow.

## 4. Lesson format v3 (both apps)
- **Scope budget instead of word floor:** one central result (max two), max two new anchor cases, core path ~3,000–4,000 words. All assigned material is still covered: historical colour, extra domains, catalogues and long derivations go into collapsible "עומק" layers that are part of the lesson but not of the core reading path.
- **Opening:** 3 retrieval questions from earlier lessons (answered first), then a pre-question about today's central result (guess before learning).
- **Definition order** (already in rules 5א–5ד): context → general definition → construction → separate example.
- **Commit-before-reveal:** every think block requires a typed answer / number / choice + confidence before it opens; derivations have 1–2 "your step" gaps; scene/sim captions ask for a prediction first.
- **Practitioner layer** per central result: how it is used in industry (tools, standards, typical values), 2–3 professional misconceptions, one interview question with what a strong answer contains.
- **Red-team paragraph:** one planted error per lesson, found by the learner before the reveal.
- **Keep card:** definitions, key formulas, and 5–7 numbers to remember with their mental derivation.
- **Certainty tags on a diet** (5–10 per lesson, typed: computed / source page / memory).
- **Completeness lint:** the app detects a truncated lesson (missing keep/coverage/exercises) and auto-continues.

## 5. The learner model (the missing organ)
- **Concept graph:** every module's central results become nodes (from the plan + keep blocks), with edges (prerequisite, same structure in another field, used-by). Shared between the two apps where concepts overlap (link budget ↔ signals; Lanchester laws ↔ ODEs).
- **Per-node state:** attempts, correctness, hint level used, confidence, last seen, stability (FSRS), calibration record.
- **Every interaction writes evidence:** think answers, exercise answers, quiz items, clarify questions (= confusion signal), Explain chats, scratchpad checks, teach-back scores.
- **Course memory becomes structured** (per-node notes + a short global profile) and is retrieved per lesson, instead of a 2,000-word blob rewritten every lesson.
- **Adaptation:** lesson depth and pace by node state (fade worked steps where strong, more scaffolding where weak; Lanchester shortens explanation of what he already knows operationally); the next lesson's warm-up and the review queue come from the weakest/most-due nodes.
- **Mastery gate:** a module is "learned" when its central nodes pass a closed-book check (not when text was generated). A delayed re-check after ~2 weeks.

## 6. Judgment trainers
- **Calibration log** across both apps: every estimate with interval + confidence; dashboard of hit rate and log-error by domain.
- **Fermi/estimation daily item** with the reference decomposition.
- **Decision cases** cut at the decision point (NASA lessons learned, failures, design choices): learner decides and justifies; the tutor reveals what happened and grades the reasoning.
- **Black-box simulators:** the learner probes a system with hidden parameters (gain/τ, RCS, drag) and infers them.
- **Lanchester:** module capstone war-game turn (move → red-team call → judge call); forecasting questions with resolution dates.
- **Senior-engineer oral exam** per module (6–8 questions mixing in-model and practice layer), scored; the scores are the "authority" metric.

## 7. Authority production
- **Article pipeline:** notebook items (article/interview) → claims table with sources and certainty → outline with thesis/counter-thesis/key number → draft from memory → fact-check pass.
- **Interview prep:** question bank per module with "strong answer contains" and follow-ups that separate experts from talkers; rehearsal against a clearly-labelled simulated expert; predictions logged before the real interview.
- **Failure ledger** across lessons ("how models broke") as an article backbone.
- **Cross-app synthesis:** weekly "bridge" session connecting a Gilua structure to a Lanchester system.

## 8. Platform and engineering
- One shared codebase (monorepo package) for the 46 duplicated files; app-specific prompts/config only.
- Learner-model tools (read/write nodes, log attempts) via structured JSON calls; cheap model for grading/warm-ups, Opus for lessons.
- Smaller input per call (rules split by phase; source pages by part), refusal handling in both apps.
- Pre-generation of the next lesson while the current one is read; usage meter.
- Send figures (images) to the tutor, and the learner's scratchpad drawings.
- A verification pass: second call re-checks numbers/claims of each part; errata log.
- Tests: snapshot tests of prompts, lesson-format linter, runtime harness.

## 9. Schedule realism
4,150 pages in 2 months = ~70 pages/day. With production-heavy learning (which is what makes it stick) realistic is ~25–40 pages/day for backbone + hubs → ~4–5 months for P0–P10, or keep 2 months by tiering modules (core full depth / survey level 2 with targeted depth on demand). The learner decides; the system shows the real pace from data.

## 10. Roadmap (priority × effort)
Phase 1 (1–2 weeks): commit-before-reveal + answer logging; warm-up retrieval; keep card with numbers; scope budget + depth layers; completeness lint + auto-continue; fix 3 factual errors; Gilua refusal handling.
Phase 2: learner model + concept graph + FSRS review queue; mastery gate + oral exam; calibration log; structured memory.
Phase 3: judgment trainers (cases, black boxes, war-game), article/interview pipeline, cross-app bridge, shared codebase, pre-generation, verification pass.
