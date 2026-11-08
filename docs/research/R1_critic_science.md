# R1. Adversarial review of Vision v1 (learning science and expertise)

Reviewer stance: the diagnosis in §0 is mostly right. Lessons are too long, there is no retrieval, and nothing measures what the learner can do. The cure, though, imports a full classroom research programme into one adult's day without pricing it. It also lets one model write, deliver, grade and report on the whole thing. The result is a plan that will feel rigorous, produce good-looking numbers and may not produce an authority.

---

## 1. Where the vision over-claims or cargo-cults the evidence

**1.1 Effect sizes do not stack, and most were measured against restudy.** The 0.4–0.6 SD figures in A §0 are mostly *retrieval versus rereading*, measured in undergraduates and schoolchildren on course material, with tests days to weeks later. Yang et al. 2021 (A §1.1) is the key caveat, and the vision ignores it: quizzing was **not significantly better than other generative activities**. So pre-questions, commit-before-reveal, teach-back, red-team paragraphs, oral exams, Fermi items, warm-up retrieval and article drafting are largely substitutes. They are not seven independent 0.5 SD gains. Once the learner is producing *something* every 10 minutes, the marginal value of adding a fifth kind of production is small, and each kind still costs time.

**1.2 "AI explains, learner reads can *harm*" misstates Bastani.** Bastani's harm came from students copying answers during *practice problems* and then sitting an exam without the AI. Nothing in A shows that reading a good, accurate exposition harms an adult relative to reading a textbook. The honest claim is weaker: long AI text is an inefficient *input* and gives a fluency illusion (Deslauriers). That matters, because the overstated version is used to justify turning almost every reading moment into a test.

**1.3 Kestin is two weeks, two topics, elite volunteers, with grounded solutions.** It shows that a scaffolded tutor beats a lecture over a short window. It says nothing about month 4 of a 5-hour daily regime, about operational or military content, or about a tutor without vetted answer keys. The vision borrows its effect size and leaves out its precondition: the AI was grounded in *correct, human-written solutions* (A §4.1, §6.4).

**1.4 FSRS is a recall-prediction model for self-graded flashcards.** Its benchmark (A §5.3) predicts *binary recall of cards graded by the user*. "Rebuild the radar-equation skeleton and say where each assumption enters" is not a card. It has partial credit, its LLM grade is noisy, and its "stability" mixes memory with understanding. Running FSRS on it is precision theatre. A §5.3 itself says that "a simple FSRS-style or Leitner-style scheduler is enough." Use fixed expanding intervals (1–3–7–21–60 days) per *module prompt set*, not per node.

**1.5 Calibration transfer is assumed, not shown.** Hubbard's "calibrated in half a day" is unreviewed consulting data (A §3.1). Calibration is largely **domain-specific**: being well calibrated on Fermi trivia does not make you calibrated on "will this seeker meet its miss distance". Statistically, a 90% interval hit rate needs about 100 resolved items to tell 90% from 80% (the standard error is about 3–4 points). At one estimation item a day, a "calibration dashboard by domain" will mostly display noise for months, and the learner will over-read it.

**1.6 An oral exam graded by the lesson-writing model is not a validity instrument.** Three problems:
- **Shared blind spots.** The model that wrote a wrong claim (C §2 found three factual errors in five lessons) will grade the learner's answer *against that same claim*.
- **Leniency and sycophancy.** LLM judges reward fluent, confident, well-structured answers and long answers, which is exactly the fluency illusion the vision says it is fighting.
- **Rubric drift.** Item difficulty and grading standards change from session to session.

A score from this loop measures "agreement with Opus in Hebrew prose", not authority.

**1.7 Planted errors teach the planted-error game.** Exactly one planted error per lesson, written by an LLM, has a recognisable style: a wrong exponent, a dropped factor of 2, a flipped sign. Within weeks the learner will hunt for the *kind of error LLMs plant*. Real errors look different: wrong assumptions, a scope mismatch, a stale number from a vendor sheet, a mistake of omission. The error-detection literature is "promising but thin" (A §6.4).

**1.8 The practitioner layer is the riskiest content in the plan.** Industry conventions, typical values, "which ITU-R recommendation you'd open", "what a strong interview answer contains": this is exactly where an LLM with no practice behind it is most confidently wrong, and least checkable by a learner who is still building his model. It is labelled "practice", but it is generated folklore unless it is sourced.

**1.9 Mastery learning and expertise reversal are cited selectively.** Mastery-learning gains (Bloom) come from K-12 with *human-validated* tests. Expertise reversal (Kalyuga) actually argues *against* scaffolding everything for an adult who already knows the operational side. Yet the plan adds pre-questions and "your step" gaps to every lesson, including Lanchester material he partly knows.

---

## 2. What will fail in practice: one adult, 5 hours a day, for months

**2.1 Review debt.** A §5.4 suggests 3–8 prompts per module, or 1,500–2,500 prompts in all. Introduce 2 modules a day, about 10 new prompts, and a standard expanding schedule settles at roughly **5–8 reviews per new item over its life**, which is about 50–80 reviews a day in steady state. Typed structural answers in Hebrew with math take 1.5–3 minutes each, plus reading the grader's feedback. That comes to **1.5–4 hours a day**, against a warm-up budget of **15 minutes and 6–10 items**. Either the queue explodes, or it silently drops items and the "stability" numbers become fiction. The vision never reconciles these two numbers.

**2.2 Production is far more tiring than reading.** Five hours of commit, rebuild, estimate, teach-back and oral exam is closer to deliberate practice. Ericsson's own data put elite performers at about **4 hours a day, in sessions of 60–90 minutes, with naps**. The vision's loop has six different activity types every day, plus context switches between two apps. Expect a crash in week 3–5, or quiet skipping of the hard blocks while the reading continues.

**2.3 Gaming is the default under a self-graded, self-reported system.** Nobody forces him to:
- type a real answer before the reveal (instead of "?");
- set confidence honestly (instead of always 50% or always 90%);
- avoid opening the Explain panel or the book mid-exam;
- skip the reroll button when a grade is unfair.

None of this is dishonesty. It is what tired people do. The system must be designed so that the cheap path still produces learning: short items, low stakes, no streak pressure.

**2.4 LLM grading errors erode trust quickly.** If 1 grade in 10 is visibly wrong (penalising a correct alternate derivation, or accepting a wrong sign), a sharp learner will start arguing with the grader. Each argument costs 5–10 minutes and wears down his faith in every number on the dashboard.

**2.5 Loss of joy is the biggest risk, and the plan doesn't name it.** Look at what this learner chose to build:
- reading aids, a focus mode, background noise and mechanical-keyboard sounds;
- a beautiful summary notebook with numbered headings and MathLive;
- margin notes and 3D scenes.

That is someone who *loves reading and crafting knowledge*. A regime that interrupts every page with a test, scores him daily on seven gauges and greys out modules until a gate is passed turns a passion into a compliance job. In self-directed adult learning, persistence matters more than any effect size in A. A 0.5 SD method he abandons in week 6 is worth less than a 0.2 SD method he keeps for 8 months.

**2.6 Tool-building displaces learning.** Roadmap phases 2–3 cover a concept graph, FSRS, shared nodes across apps, black-box simulators, a war-game engine, an article pipeline, a monorepo and a verification pass. That is months of building, and the repo history shows building is a pleasurable activity of its own. Every hour spent on the learning machine is an hour not spent learning.

---

## 3. What is missing that matters more than what is there

**3.1 Choosing the 20%, and the curse of breadth.** The vision says "material is never cut", but authority is never broad. The 316 Gilua modules and the Lanchester syllabus together span numerics, signals, control, RF, radar, EW, operations research and military history. No one is an authority on all of that, and *claiming* authority across it reads as a talker's tell to the experts he wants to interview. The single most consequential decision is missing: **in which 1–3 niches will he be an authority, and which modules are survey only?** The tiering in §9 is offered only as a schedule fix. It should be a strategic choice made first.

**3.2 How real authorities actually got there.** Analysts, defence journalists and engineer-writers became authorities through:
- deep, primary-source work in a niche: original reports, GAO and CRS reports, test data, patents;
- **public output that got corrected by experts** (articles, talks, threads);
- a network of practitioners who answer their calls;
- years of predictions on the record.

None of this runs through an internal score. The vision puts "produce" seventh, when it should be the spine from month 1.

**3.3 Humans in the loop.** The plan has no real expert anywhere in it. One 45-minute conversation a month with a practising engineer or analyst, where the learner explains a design trade and gets grilled, is worth more validity than all the internal oral exams together. The same goes for one editor or knowledgeable reader per published piece.

**3.4 Problems with trustworthy answers.** The books (Feynman, *Mathematics: Its Content…*, the E- and B-series) contain **exercises with known answers**, and many engineering quantities can be *computed* in Python or a spreadsheet. These are the cheapest reliable feedback available, and the vision barely uses them. It prefers LLM-generated items and LLM grading.

**3.5 Projects and real artefacts.** For example:
- a working link-budget spreadsheet, checked against a published system;
- a Lanchester or Monte-Carlo simulation reproducing a historical engagement within stated error;
- reproducing a figure from a paper;
- a one-page technical brief reviewed by a practitioner.

Each artefact exercises the same knowledge across several modules, so it doubles as interleaved retrieval. It is also something he can show an expert.

**3.6 Sleep, rest and recovery.** Consolidation (A §2.3) argues for one full rest day a week, protected sleep and a hard daily cap. The vision has no rest days, no deload weeks and no rule for what happens when he misses a day. A missed day is exactly when review debt compounds.

**3.7 Source fluency.** An authority quotes the primary source, not a paraphrase of it. Lessons should push him into the original pages at key moments. Reading the book directly at the right moment is itself a valuable, cheap and reliable activity.

---

## 4. The "seven numbers": Goodhart by construction

As specified, the same model:
- **generates the items** (difficulty drifts, and items resemble the lessons);
- **grades the answers** (lenient, fluent-biased, wrong where the lesson was wrong);
- **reports the trend** (the close-of-day gauge).

The learner sees the gauges every day, which motivates exactly the gaming described in §2.3. It is a closed loop with no external anchor, and the numbers *will* go up whether or not he becomes an authority. Several of the seven ("Judge", "Transfer", "Produce") are also not measurable from typed answers by an LLM at all.

**A better measurement design:**

1. **Few metrics, measured rarely.** Drop the daily dashboard. Measure monthly and at phase ends.
2. **A frozen held-out benchmark.** At the start of each phase, assemble 30–40 items that are never used in teaching:
   - book exercises with answer keys;
   - numeric estimates with known true values;
   - 3–5 decision cases with documented outcomes.

   Give a **pretest** now and the same items, unannounced, 4–8 weeks after the phase. Grade numeric items automatically. For prose items, two different models grade blind against a fixed rubric, and the learner audits about 20% of them. Track grader disagreement as a quality metric of its own.
3. **Calibration on real resolutions.** Keep a log of predictions about the real world (test results, procurement decisions, conflict outcomes, published specs) with resolution dates. Report the score quarterly, with confidence intervals. Do not report it per domain until there are about 50 resolved items.
4. **External validation, which is the actual definition of authority.**
   - **A monthly expert session.** A practitioner asks 5 questions of their own choice and rates each answer on a 1–4 scale: talker, informed amateur, colleague, someone I'd consult. Log the ratings.
   - **Publications.** Track pieces accepted by an editor, corrections received, and experts who reply or cite him.
   - **Interviews.** Count how many predictions logged before a real interview were confirmed, and how many follow-up questions the interviewee called "good".
5. **Input metrics, kept honest.** Track hours, pages and modules at each tier. They are not success measures, but they keep the pace visible without dressing it up as mastery.

---

## 5. Components ranked by (learning impact) ÷ (learner time cost)

| Rank | Component | Verdict |
|---|---|---|
| 1 | Scope budget, ~3–4k-word core | **Keep.** It *saves* time, so the ratio is effectively unbounded. |
| 2 | Commit-before-reveal on existing think blocks | **Keep.** About 1 minute each, and it converts reading to production. |
| 3 | Keep card with 5–7 numbers and their derivations | **Keep.** Cheap; this is where spaced retrieval is unambiguously effective. |
| 4 | Module-end closed-book check plus a delayed re-check | **Keep**, using frozen items and book answer keys. |
| 5 | Case comparison (Gentner) replacing passive cross-domain reading | **Keep.** It is the best-evidenced route to transfer. |
| 6 | Small structural review queue, time-capped at ~20 min | **Keep**, with simple Leitner, not FSRS. |
| 7 | Book exercises and computed checks | **Add.** Reliable feedback at low cost. |
| 8 | Estimation with an anchor bank and feedback | Keep, 2–3 items a week, not daily. |
| 9 | Teach-back | Keep weekly, not daily. It overlaps with retrieval (Yang). |
| 10 | Decision cases with known outcomes | Keep for Lanchester, weekly, sourced from real documented cases. |
| 11 | Pre-questions at every lesson opening | Reduce. They help only the pre-questioned content, and they overlap with the opening retrieval. |
| 12 | Practitioner layer | Keep only where sourced. Otherwise mark it as unverified. |
| 13 | Planted-error paragraph | **Cut**, and replace it with real errors from real documents, about weekly. |
| 14 | Daily oral exam, internal "authority score" | **Cut** as a metric. Keep it as an occasional practice tool. |
| 15 | Daily seven-number dashboard | **Cut.** It is the Goodhart engine. |
| 16 | Per-node FSRS concept graph shared across apps | **Cut** to a module-level list of prompts. |
| 17 | Black-box simulators, war-game engine | Defer. High build cost, untested benefit. |
| 18 | Article pipeline *infrastructure* | Cut the tooling and **keep the habit**: write and publish. |
| 19 | Simulated-expert interview rehearsal | Low value compared with one real conversation. |
| 20 | Certainty tags, clarify-question-as-confusion signal | Cut. The signal is noise: questions show engagement, not confusion. |

---

## 6. The five most important changes

**1. Decide the niche before building anything.** Choose 1–3 authority niches, for example RF/EW link and detection budgets plus Lanchester-style force modelling, or whatever his writing actually targets. Tag about 25–35% of modules as *core*: full depth, review, projects. Tag the rest as *survey*: short lessons, a single retrieval pass, no gate. This replaces "material is never cut" with "material is never hidden, but most of it is not owned". It also fixes the schedule and the review debt at the same time.

**2. Move measurement outside the loop.** Use a frozen held-out benchmark with a pretest, delayed unannounced retests, auto-graded numeric items and dual-model blind grading with learner audits. Add a monthly human expert rating, a real-world prediction log, and publication or correction counts. Delete the daily seven-number gauge. "Authority" is defined by whether external experts treat him as a colleague, and that is the only thing reported as the north star.

**3. Ground feedback in truth, not in the tutor.** Prefer book exercises with keys, computed answers (Python or spreadsheet) and documented real cases with known outcomes. Every LLM-graded item states its rubric and source page. The practitioner layer appears only when sourced. Measure the grader's own error rate monthly, and show it to the learner, so trust is earned rather than assumed.

**4. Build around artefacts and people, not features.** Give each core niche one project per phase (a model, a spreadsheet, a reproduced figure, a brief) reviewed by a real practitioner. Have a published piece by month 2. Hold one expert conversation a month, with predictions logged beforehand. Cap tool-building at a fixed share of the week, about 10%. The Phase 2–3 engineering should be justified only by a measured shortfall, not built in advance.

**5. Design for sustainability and joy.** The schedule:
- 5 hours *total*, including all production and review;
- blocks of at most 75 minutes;
- review time-boxed (anything unfinished rolls over or is retired, and never accumulates);
- one full rest day a week and a light week every 6–8 weeks.

Keep pleasurable reading as the core experience, with production woven in lightly: a commit on 3–5 think blocks, not a test on every page. Introduce changes one at a time, about every two weeks, and keep a change only if the next delayed benchmark or the learner's own enthusiasm shows it earned its place. A system he still loves in month 6 beats an optimal one he quit in month 2.
