# D. Landscape survey: AI tutors, mastery systems, explorables, judgment training (2025–2026)

*Research date: 30 Oct 2026. Scope: ideas worth borrowing for Gilua (engineering, 316 modules) and Lanchester (military-technical), two claude.ai Artifact tutors for one adult learner targeting "level 2.5" in about 2 months.*

**Note on evidence.** Most product claims in this field are self-reported. I flag the strength of each item: **[RCT]** randomized trial, **[obs]** observational or internal data, **[claim]** vendor or anecdote. Where a number comes from a secondary write-up, I say so.

---

## 0. The headline finding before the survey

Two 2025 papers set the frame for everything below:

- **Kestin et al., *Scientific Reports* 15:17458 (June 2025)** [RCT, crossover, n≈194, Harvard intro physics]. An AI tutor built on the lecturers' own worked solutions, with rules like "one step at a time, do not give the full answer", produced roughly double the learning gains of an in-class active-learning session, in less time (median ~49 vs 75 minutes, per secondary summaries). Caveat: no delayed test, two topics only. [doi.org/10.1038/s41598-025-97652-6](https://doi.org/10.1038/s41598-025-97652-6); critique: [etcjournal, "eleven months later"](https://etcjournal.com/2026/10/17/the-harvard-ai-tutor-study-eleven-months-later/).
- **Bastani et al., "Generative AI without guardrails can harm learning", *PNAS* 122(26), 2025** [field RCT, ~1,000 high-school students]. Plain GPT-4 raised practice scores 48% but students then did *worse* on unaided exams (−17% in the working-paper version). A "GPT Tutor" prompt that contained the solution and the common mistakes and gave only incremental hints raised practice scores 127% and removed the harm. [SSRN](https://papers.ssrn.com/abstract=4895486), [Wharton summary](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education).

**The implication for these apps:** today's lessons are long AI-written readings. Reading a fluent explanation is the "GPT Base" failure mode in disguise: it feels like learning, and the learner does little generation. The biggest gains come from making the learner *produce* (predict, derive, estimate, explain, critique) *before* the tutor reveals, with the tutor holding the answer key and the known mistakes. Almost every idea below is a variant of that.

---

## 1. AI tutors and learning modes

### Khanmigo (Khan Academy)
- **What:** GPT-4-based Socratic tutor inside Khan Academy exercises; refuses to give answers, asks "what do you think the next step is?".
- **Evidence:** Weak on durable gains. Secondary reports say only ~15% of students with access use it regularly, and in 2026 Khan made it auto-activate because students weren't seeking it out [obs, unverified: [dev.to analysis](https://dev.to/max_quimby/khanmigo-was-a-non-event-whats-next-for-ai-tutors-376k)]. The underlying Khan practice platform has decent correlational evidence (skills mastered ↔ test gains).
- **Steal:** *The tutor speaks inside the exercise, not in a separate chat.* Khanmigo's value is context: it sees the exact problem and the learner's work. **In the apps:** the "check my solution" button in the scratchpad already does this; extend it so every think-question in the lesson has an inline "I'm stuck" that returns a *hint ladder* (nudge → key idea → first step → worked step), never the full answer on the first click. Log which rung the learner needed: that is mastery data.

### Google LearnLM / Gemini Guided Learning / NotebookLM / Learn Your Way
- **What:** LearnLM is Gemini fine-tuned on learning-science principles; Guided Learning (Aug 2025) is the Gemini mode built on it: breaks problems down, interleaves images/diagrams/video, quizzes. NotebookLM (Sep 2025) added source-grounded flashcards and quizzes where every question links back to the source passage, plus a "Learning Guide" mode ([Workspace blog](https://workspaceupdates.googleblog.com/2025/09/flashcards-quizzes-reports-notebook-lm-google-education.html)). **Learn Your Way** (Google Research, Sep 2025) re-renders a textbook chapter into multiple representations (immersive text with embedded questions, narrated slides, audio lesson, mind map) personalized to the learner's interests.
- **Evidence:** Learn Your Way RCT, n=60 teens, one chapter: +9 points immediate (77% vs 68%), +11 on a 3–5-day retention test vs a PDF reader [small RCT; [Google Research blog](https://research.google/blog/learn-your-way-reimagining-textbooks-with-generative-ai/), [arXiv 2509.13348](https://arxiv.org/abs/2509.13348)].
- **Steal:** *Multiple representations of the same section, chosen by the learner, all grounded with back-links to the source page.* **In the apps:** a lesson section can be "re-rendered" on demand as (a) a one-screen mind map/structure diagram, (b) a derivation skeleton only, (c) a 5-question pre-quiz, (d) an "explain it in my domain" version. Every claim and every quiz item carries a `[p. 241]` anchor that opens the published page image. The page-image and book-JSON infrastructure already exists.

### OpenAI ChatGPT Study Mode (Jul 2025) and Anthropic Claude Learning Mode (Apr 2025, all users Aug 2025)
- **What:** System-prompt-level modes: Socratic questioning, scaffolded hints, check-for-understanding, and refusal to just hand over answers. Claude Code also has "learning" and "explanatory" output styles that leave `TODO(human)` gaps for the user to fill in. Independent comparisons say they converge on the same pattern and differ mainly in how firmly they hold the line ([comparison](https://glasp.ai/articles/ai-study-modes-compared), [hands-on test](https://www.whytryai.com/p/ai-study-modes)).
- **Evidence:** No published RCTs; OpenAI and Anthropic describe them as built with educators.
- **Steal:** *The "TODO(human)" gap.* Claude's learning style deliberately leaves a load-bearing step for the human. **In the apps:** every derivation skeleton in a lesson has 1–2 deliberately blank steps marked "your step", which the learner fills in the scratchpad before the next part unlocks or is revealed. This is cheaper than full Socratic chat and keeps the long-reading format.

### Synthesis Tutor
- **What:** Kids' (5–11) math tutor from the SpaceX-school lineage; the interface is the key point: manipulatives on screen, and the AI watches the *manipulation*, not just the answer.
- **Evidence:** Mostly parent testimonials and mixed reviews [claim; [Unite.AI review](https://www.unite.ai/synthesis-tutor-review)].
- **Steal:** *The tutor reacts to what you do with an object, not only to text.* **In the apps:** the 3D scenes (`shared/scene3d/`) become *questions*: "drag the radar beam until the return disappears into clutter", "set the gain so the closed loop just oscillates", and the final scene state goes to Claude as structured JSON for feedback.

### Alpha School / "2 Hour Learning"
- **What:** Private schools where students do ~2 hours/day of app-based mastery learning (dashboard "Timeback" selects the next item), with afternoons for projects; adults act as guides.
- **Evidence:** Self-reported "2x faster" and top-1–2% MAP scores; no independent study; selection effects (US$40–75k tuition, motivated families) [claim; [news coverage](https://www.wfsb.com/2025/12/19/school-says-it-gets-better-grades-with-ai-instruction-than-teachers/)].
- **Steal:** *Time-boxed mastery block plus a separate "project" block.* Alpha's real insight is the split between efficient drill and applied making. **In the apps:** a daily plan with two blocks: (1) the mastery/review queue (fixed 30–45 min), (2) the "authority" block: write a paragraph for an article, prepare an expert-interview question set, or run a case. The learner's articles and interviews *are* the project block, and the app should schedule them, not treat them as outside work.

### Duolingo Max
- **What:** GPT-4 tier with "Explain My Answer" (free to all since Jan 2026) and "Roleplay"/"Video Call" with an AI character.
- **Steal:** *"Explain my answer" on every graded item.* After any quiz answer, right or wrong, one click gives the *why* plus the specific misconception. **In the apps:** the end-of-module quiz stores, per item, the misconception tag; wrong answers feed the review queue tagged with the misconception, not just the item.

### Other 2025–2026 entrants worth knowing
- **AI oral examiners.** NYU Stern's *Viva* runs personalized oral exams and grades transcripts with a panel of three LLMs that score independently, read each other, and revise; under US$1 per exam ([arXiv 2603.18221](https://www.alphaxiv.org/abs/2603.18221)). Oxford/Hillsdale "viva voce simulator" ([arXiv 2511.05530](https://arxiv.org/abs/2511.05530)). Bayreuth *ExamSim* avatar examiner for practice.
- **Teachable agents / "LLM protégés".** BEA 2025: students who correctly diagnosed an LLM that was prompted to make course-specific errors gained more ([ACL Anthology 2025.bea-1.19](https://preview.aclanthology.org/landing_page/2025.bea-1.19.pdf)); *Chrysalis* compares tutoring vs teaching an agent ([arXiv 2510.05271](https://arxiv.org/html/2510.05271v1)). Small samples, promising.

---

## 2. Mastery and spacing systems

### Math Academy (Justin Skycak's FIRe model)
- **What:** Hand-built knowledge graph of ~thousands of topics with *two* kinds of edges: **prerequisite** (what you must know to start) and **encompassing** (practicing topic B implicitly practices topic A). Spaced repetition runs on the graph: a review of an advanced topic gives *fractional implicit credit* to the simpler topics it encompasses, and a failure sends penalty back down. Result: far fewer explicit reviews ("repetition compression"). Diagnostic placement test at start; lessons are short with immediate practice; tasks interleaved.
- **Evidence:** Strong user traction among adults; published methodology is high level ([Skycak, "Optimized individualized spaced repetition in hierarchical knowledge structures"](https://www.justinmath.com/), [How the knowledge graph is built](https://justinmath.com/how-math-academy-creates-its-knowledge-graph/), Frank Hecker's [notes on *The Math Academy Way*](https://frankhecker.com/2025/02/14/math-academy-part-7/)) [obs].
- **Steal (the single most valuable idea in this survey for a 4,000-page / 2-month plan):** *Encompassing-edge credit so review is mostly free.* With 316 modules and no time for Anki-style card-by-card review, the only way spacing scales is if doing an advanced exercise counts as review of what it uses. **In the apps:** the syllabus already has module dependencies. Add, per module, a short list of 5–15 **key results** (the "keep" block already lists these) and, per exercise/think-question, which key results it *exercises* (Claude tags this in JSON when it writes the exercise). Each key result has a memory state (FSRS-style stability). Doing an exercise successfully updates all tagged results; the daily queue only explicitly asks about results whose predicted recall has dropped and that *haven't been implicitly hit*. Cross-domain exercises (Laplace transform used in a radar tracking loop) become the main review mechanism, which is exactly the level-2.5 goal.

### Anki / FSRS
- **What:** FSRS (Free Spaced Repetition Scheduler) is the open, data-fitted scheduler now default in Anki; models difficulty, stability, retrievability. Benchmarked on ~1.7 billion reviews from ~20k users; FSRS-6 beats SM-2 and Duolingo's HLR on log-loss ([srs-benchmark](https://github.com/open-spaced-repetition/srs-benchmark), [Expertium's benchmark page](https://expertium.github.io/Benchmark.html)).
- **Steal:** *Use ts-fsrs as-is.* There is a maintained TypeScript implementation ([ts-fsrs](https://open-spaced-repetition.github.io/ts-fsrs)), small and dependency-free, bundleable by Vite. **In the apps:** per key-result state `{stability, difficulty, due, lastReview}` in `profile/srs/<id>`, scheduled with ts-fsrs, desired retention ~0.85 (not 0.9: at this pace, cheaper reviews beat higher retention).

### RemNote / Readwise-style "cards from your notes"
- **What:** Flashcards authored inline in notes (`::` syntax), so the note and the card are one object.
- **Steal:** *Cards live in the summaries notebook.* **In the apps:** a block type or marker in `src/summaries/` ("remember this") turns any line, formula or definition box into a review prompt. The learner's own summary becomes the deck, which matters because self-written prompts are remembered better and are on the right abstraction.

### SuperMemo incremental reading (Piotr Woźniak)
- **What:** Read many sources in small slices interleaved by priority; highlight → *extract* → later convert extracts into cloze cards; everything (articles, extracts, cards) is scheduled ([Wikipedia](https://en.wikipedia.org/wiki/Incremental_reading), [Woźniak, "How to read a book in an hour"](https://supermemo.guru/wiki/How_to_read_a_book_in_an_hour)).
- **Steal:** *Priority-weighted reading queue across many books, not linear completion.* For 4,000 pages in 2 months, linear reading is impossible anyway. **In the apps:** each module gets a priority (core / supporting / skim); low-priority modules get a "triage lesson" (one-page structural map + key results + where to look later), with the full lesson available on demand. Margin notes become "extracts" that can be promoted to review items.

### Quantum Country / mnemonic medium / Orbit (Andy Matuschak & Michael Nielsen)
- **What:** Essays with spaced-repetition prompts embedded *in the text*, reviewed later by email/app. In Quantum Country 97% of 112 prompts had >50% in-essay accuracy; withheld-prompt experiments showed retention held from 5 days to 1 month for reviewed material ([Mnemonic medium notes](https://notes.andymatuschak.org/Mnemonic_medium), [In-essay prompts boost first repetition](https://notes.andymatuschak.org/zHMuXkWrGpDVQ6j82YNK2iD)). Matuschak's key design lessons: prompts should be *atomic, precise, consistent, tractable, effortful*; prompts can *extend* the text rather than repeat it ([note](https://notes.andymatuschak.org/zWseCLfA8e3FiyggqNqGTRNW51bCTyZ8YYb)); and the medium works best for linear primers in established fields ([note](https://notes.andymatuschak.org/zY1nxKoZCJmCd6EpMxzWHwmCyiQUG7nX17Z)), which is exactly what these textbooks are.
- **Steal:** *Prompts written by the lesson author at write time, embedded in the lesson, then scheduled.* The lessons are AI-written, so Claude can emit 6–12 Matuschak-quality prompts per lesson in a JSON side channel (with the five properties above as a rubric in the prompt). The learner answers them inline at the end of each part (first repetition = the strongest one), and they enter the FSRS queue. For level 2.5, use prompt *types* beyond facts: "what limits this?", "order of magnitude of X?", "what breaks if Y doubles?", "which other domain has the same equation?".

**Caveat on AI-generated prompts:** practitioner reports put a large fraction of auto-generated cards as low-value; human review roughly fixes it ([arXiv 2602.14431](https://arxiv.org/pdf/2602.14431) and practitioner posts). So: Claude proposes, learner accepts/edits/rejects with one tap, rejections feed back into the prompt.

---

## 3. Interactive explanation

### Brilliant
- **What:** Short interactive lessons, every screen a manipulable problem with custom feedback on wrong answers ([brilliant.org](https://brilliant.org)). Marketing claims "6x more effective than lectures" [claim].
- **Steal:** *Ask before you tell.* Each concept opens with a question the learner can't fully answer yet. Supported by pretesting research: taking a test *before* studying improves later retention of the tested material ([Pan & Sana 2021](https://pubmed.ncbi.nlm.nih.gov/33793291/); St. Hilaire et al. 2024 meta-analysis: the effect is reliable mainly for the pretested information itself). **In the apps:** every lesson part starts with 1–2 "predict first" questions (numeric estimate or qualitative prediction) logged before the text is shown; the text then resolves them. Cheap to add to `composeLesson`.

### Bartosz Ciechanowski's explainers ([ciechanow.ski](https://ciechanow.ski))
- **What:** Long essays (GPS, mechanical watch, airfoil, sound) where *every* paragraph has a small live, draggable simulation showing exactly the one variable the paragraph discusses.
- **Steal:** *One tiny focused widget per idea rather than one big scene per lesson.* **In the apps:** the scene3d spec can add a "micro" mode: one parameter slider + one plot, generated by Claude from a small whitelist of templates (1D function plot, phasor, Bode plot, 2D field arrows, link budget bar). Ciechanowski's discipline is that each widget has *one* knob.

### 3Blue1Brown / Manim
- **What:** Animated derivations where the visual carries the argument. Manim is Python, offline-rendered.
- **Steal:** *Visual derivation steps*. Rendering Manim is not possible in the Artifact; the borrowable part is the storyboard pattern: each derivation step has a picture state. Claude can emit SVG frames (stepper with "next step") cheaply.

### Explorable Explanations (Bret Victor, Nicky Case)
- **What:** Victor's "Explorable Explanations" (reactive documents: numbers in text you can drag) and "Up and Down the Ladder of Abstraction" (see a system at a fixed parameter, then over all parameters, then over all time); Nicky Case's *Parable of the Polygons*, *Evolution of Trust* ([explorabl.es](https://explorabl.es), [worrydream.com](https://worrydream.com)).
- **Steal:** *Reactive numbers in prose.* "A 1 m² radar cross-section at **100 km** returns **−X dBm**": drag 100 km and every dependent number in the paragraph updates. This is directly the "orders of magnitude and trade-offs" skill. **In the apps:** a block type `calc` with a tiny expression DAG (Claude writes `{vars, formulas, text}` in JSON; the page evaluates). No server needed; safest to evaluate with a small math parser (math.js from cdnjs) rather than `eval`.

### Desmos / GeoGebra / PhET / Observable
- **What:** Desmos and GeoGebra: embeddable calculators with APIs; PhET (Colorado): ~150 research-tested physics sims, HTML5, open source; Observable: reactive notebooks with Plot/D3.
- **Steal:** *PhET's "implicit scaffolding": the sim's controls themselves constrain exploration, and the sim asks nothing.* Where a PhET sim matches a module (waves, circuits, optics, fourier), it can be bundled (PhET HTML5 sims are single-file downloads, CC-BY) and linked from the lesson. Desmos API needs a key and a network call, so it is likely out; GeoGebra's applet loads from its CDN, which the Artifact allowlist probably blocks. Observable Plot is on jsDelivr and usable.

---

## 4. Building judgment

### Fermi problems and orders of magnitude
- **What:** Estimation drills (Fermi, *Guesstimation*, Sanjoy Mahajan's *Street-Fighting Mathematics* and *The Art of Insight* (MIT OCW), "Order of magnitude physics" courses).
- **Steal:** *Daily Fermi item with scored log-error.* **In the apps:** 2–3 quick estimates a day drawn from the current and past modules ("power of a fighter radar transmitter", "Δv to GEO", "bandwidth of a 1 ns pulse"), answered as a number, scored by |log10(guess/true)|, tracked as a curve over time. Claude produces the item *and a decomposition* so the learner sees where the estimate went off. Mahajan's toolbox (dimensional analysis, lumping, proportional reasoning, easy cases) becomes a named set of moves the tutor refers to.

### Calibration (Hubbard; Clearer Thinking; Open Philanthropy)
- **What:** Hubbard's training: give 90% confidence intervals, use the "equivalent bet" test, get feedback; he reports most people start at ~50–55% hit rate for 90% intervals and most reach good calibration within a half-day of feedback [obs, from his book via [summary](https://www.supersummary.com/how-to-measure-anything/summary)]. Clearer Thinking and Open Philanthropy built free calibration games; Open Phil publishes its own forecast Brier score (.217 vs .25 chance) ([Open Phil](https://www.openphilanthropy.org/research/how-accurate-are-our-predictions)).
- **Steal:** *Confidence on every answer, and a calibration chart.* **In the apps:** every quiz item and Fermi estimate asks for confidence (50/70/90/99% or an interval). The app plots a calibration curve per domain. For an aspiring authority this is the most directly relevant meta-skill: knowing which of your own claims to trust when you write or interview.

### Forecasting (Good Judgment, Metaculus)
- **What:** Superforecasting research: <1 hour of "CHAMPS KNOW" training (base rates/outside view, decomposition, updating, bias awareness) improved Brier scores 6–11% over control in IARPA tournaments ([Chang et al. 2016](https://www.cambridge.org/core/product/123EB18425391D05FA6581FDBB3F309F/core-reader)). Metaculus hosts questions on defense, space, AI.
- **Steal:** *Tie the technical material to resolvable real-world questions.* **In the apps (Lanchester especially):** each module ends with a forecasting question about the real world ("Will an operational X with property Y be fielded by 2028?"), with a probability and a written rationale using the module's physics as the constraint. Stored with a resolution date; revisited. This trains "outside view + physics limits" judgment, and it's material for articles.

### Harvard case method
- **What:** Learner reads a real, messy situation, must make a decision with incomplete information, defends it under cold-calling; the instructor withholds "the answer".
- **Steal:** *Decision-forcing cases built from the library.* **In the apps:** a "case" block: 1–2 pages of a real scenario (a design decision, an engagement, a program review) cut off at the decision point; learner writes the decision and rationale in the scratchpad; then Claude reveals what actually happened and critiques. Lanchester has military history and doctrine in `library/military/`; Gilua can use engineering failures.

### Wargaming and red teaming
- **What:** US Army War College uses LLMs to flesh out adjudication in strategy wargames; Army units have tested LLM adjudicators and found them most valuable as red-teamers reasoning from enemy doctrine without friendly bias ([War Room](https://warroom.armywarcollege.edu/articles/back-to-the-basics/), [Small Wars Journal, Feb 2026](https://smallwarsjournal.com/2026/02/09/accelerating-military-decision/)). Matrix games with LLM facilitator assistants ([Fight Club International report](https://www.fightclubinternational.org/_files/ugd/47ca60_14c65c7cd1a346b7b6d6713b5eb321e0.pdf)); *Snow Globe* LLM-run qualitative wargames ([arXiv 2404.11446](https://arxiv.org/abs/2404.11446)).
- **Steal:** *A matrix-game turn as a module capstone.* The learner states an action, the expected result and the physical/technical reasons (the matrix-game "argument"); a red-team Claude persona responds with counter-actions grounded in the module's physics; an adjudicator call rules with stated probabilities. Three short LLM calls, fits the Artifact. Keep it technical and analytical (radar vs. countermeasure, sensor vs. signature trade-offs), consistent with Lanchester's engineering framing, which the 28.10 refusal episode shows matters.

### Engineering failure-analysis libraries
- **What:** NASA Lessons Learned Information System (now under NASA Engineering Network), Petroski's *To Engineer Is Human*, Tacoma Narrows, Challenger, Mars Climate Orbiter, Ariane 501, Therac-25, Hyatt Regency; the CSB (Chemical Safety Board) videos.
- **Steal:** *"Find the failure" exercises.* **In the apps:** after a module (e.g., control loops, structures, software, units), a 1-page failure case written *without* the cause; the learner diagnoses using the module's tools; then the actual cause. This is the most efficient way to build the "limits and failure modes" sense that separates authority from fluency.

### Feynman technique / teach-back
- **What:** Explain the idea simply, as to a novice; where you stumble is the gap. The LLM protégé research above makes this concrete.
- **Steal:** *A "confused student" persona that the learner must teach.* **In the apps:** at the end of a module, a Claude persona with a specific seeded misconception (from the module's known common mistakes) asks naive questions; the learner explains in writing (or by voice); the persona only "gets it" if the explanation addresses the misconception. A grader call then scores coverage of the key results. This is 3–5 calls, entirely feasible.

---

## 5. Knowledge management for a writer and interviewer

### Readwise / Readwise Reader
- **What:** Collects highlights from everywhere, resurfaces them via daily spaced review; "Ghostreader" LLM on any document.
- **Steal:** *A daily resurfacing digest of the learner's own margin notes and highlights.* **In the apps:** the daily review screen mixes 2–3 of the learner's own past margin notes (especially "idea for an article" and "question for an expert" types, which already exist) alongside the FSRS prompts.

### Obsidian / Logseq / Zettelkasten
- **What:** Atomic notes, each one idea, densely linked; the graph is the thinking tool. Luhmann's Zettelkasten emphasises writing notes *in your own words* and linking each new note to existing ones.
- **Steal:** *Cross-domain link notes as first-class objects.* The level-2.5 goal "cross-domain structure" is literally the links. **In the apps:** a "connection" note type ("Kalman filter in Gilua M7 ≅ track filter in Lanchester radar module"), stored once in a shared place and visible in *both* apps' notebooks; Claude proposes candidate connections at the end of each lesson from the course memory; the learner accepts and writes one sentence on *why* they are the same. Export to Markdown with `[[wikilinks]]` so it drops into Obsidian if wanted (the nightly `notes/` backup already writes MD).

### Elicit / Consensus / Scite
- **What:** LLM literature search over Semantic Scholar etc.; extract claims from papers into tables; Consensus gives a "consensus meter".
- **Steal:** The tutor has no internet, so the search part is out. *The claim-table pattern* is in: **in the apps**, for an article the learner is writing, a "claims table" (claim, source page in the library, confidence, counter-evidence, open question for an expert). Claude fills it from the library books the app already has.

### Interview preparation
- **What:** Journalistic practice (e.g., the "know enough to ask the second question" principle; question ladders from factual → mechanism → trade-off → counterfactual → "what do people get wrong?"); prep by writing the expert's likely answers first, then asking where the expert would disagree.
- **Steal:** *A rehearsal persona.* **In the apps:** "Interview rehearsal" generates a simulated expert (role and stance specified by the learner, explicitly labelled as simulated), the learner asks questions, and a coach call critiques the questions (too broad? leading? missed the trade-off?). Output: a refined question list exported to Word.

---

## 6. Other ideas a 2026 "best possible" system should include

1. **Hidden-parameter simulators ("system identification" games).** Show a black-box system (a plant with unknown time constant and gain; a radar with unknown RCS and noise figure; a missile with unknown drag coefficient); the learner may run experiments (step input, change range) and must infer the parameters within a budget. This trains exactly the "infer the structure from behaviour" judgment of an authority, and it can't be faked by reading. Fully client-side: the simulator is a JS function with seeded random parameters; Claude only writes the scenario and critiques the experiment design.
2. **Oral exam by voice.** The 2025 viva systems show it works and is cheap. In the browser, the Web Speech API (or the Artifact microphone capability, if granted) can transcribe; Claude acts as examiner with follow-up questions and a multi-pass grade. Speaking forces retrieval without the crutch of the page.
3. **Adversarial expert panel.** For critique skills: two or three personas (the optimistic program manager, the sceptical test engineer, the adversary's analyst) review the learner's written analysis. Personas are generic roles, never impersonations of real people.
4. **Derivation skeleton drills.** For level 2.5, the key artefact is the 5–8-line skeleton of a derivation (assumptions → key step → result → validity limits). A drill shows the result and asks the learner to reconstruct the skeleton; Claude compares it with a reference skeleton step by step.
5. **Interleaved mixed review.** Rohrer et al. 2020 cluster RCT (54 classes): interleaved practice gave 61% vs 38% on a one-month delayed test, d≈0.83 ([IES summary](https://ies.ed.gov/use-work/awards/efficacy-study-interleaved-mathematics-practice)). The daily review queue should mix domains deliberately, and the end-of-module quiz should include 20–30% items from earlier modules.
6. **"Where would this break?" prompts.** Every key result gets a limits prompt (assumption, regime of validity, what dominates outside it). This is cheap and is the single most "level 2.5" prompt type.
7. **Learning analytics the learner can see.** Time on task, hint-rung usage, calibration curve, Fermi log-error trend, retention forecast per domain. Adults pacing themselves over 2 months need a dashboard of whether the plan is on track.

---

## 7. Feasibility inside a claude.ai Artifact

The apps already use: `claude.use("sample")` with images, the per-user database (`db`), `user`, `assets`, `downloads`; no server; no internet for the tutor; external scripts only from approved CDNs.

### Feasible now (client-side + LLM calls + JSON + small DB)

| Idea | How |
|---|---|
| FSRS scheduling of key results | `ts-fsrs` bundled by Vite; state in `profile/srs/*` |
| Math-Academy-style implicit credit | Claude tags each exercise with key-result IDs (structured JSON); update all tagged states on success |
| Embedded mnemonic prompts | Extra JSON output from `composeLesson`; inline answer UI; accept/edit/reject |
| Predict-first / pretest questions | Extra step at the start of each lesson part |
| Hint ladders and "TODO(human)" gaps | Prompt changes; reveal on click; log rung used |
| Reactive numbers in prose (`calc` block) | JSON `{vars, formulas}` + math.js from cdnjs; no `eval` |
| One-knob micro-widgets | Template whitelist in scene3d or SVG/Plot |
| Fermi trainer + log-error tracking | Claude writes item + reference decomposition; DB stores history |
| Calibration (confidence on every answer, curve) | Pure client; DB |
| Forecast questions with resolution dates | DB; reminder shown when due (no push notifications) |
| Decision-forcing cases, failure-diagnosis cases | Claude writes from library text; reveal step |
| Matrix-game turn (player / red team / adjudicator) | 3 sequential LLM calls with role prompts |
| Teach-back to a confused persona; adversarial review panel | Multi-call; grader call with rubric |
| Hidden-parameter simulators | JS models with seeded parameters; Claude writes scenario and critique |
| Image checking of hand-drawn work | Already done ("check the solution"); extend to photo of paper |
| Multi-representation re-render with page back-links | Book JSON and page images already published |
| Daily plan (mastery block + authority block), dashboard | Client; DB |
| Interview rehearsal, claims table, export to Word/MD | LLM + `downloads` |
| Cross-app "connection" notes | Each app has its own DB; so: export/import a JSON file, or keep connections in each app and sync via the nightly repo backup |

### Needs a check before relying on it
- **Voice input** (Web Speech API in the sandboxed iframe, or the microphone capability): load the `artifact-capabilities` skill to see if microphone is available for this account; otherwise typed oral exams still work.
- **Embedding PhET sims** as published files (single HTML each, CC-BY; size fine) and **Observable Plot** from jsDelivr: should work, verify CSP.
- **Haiku for cheap high-volume calls** (Fermi items, grading of short answers, prompt drafting): already used for "explain simply"; extend if quota matters.

### Needs infrastructure the learner does not have
- Push notifications / email reminders for reviews (no server; the nearest substitute is a scheduled Claude Code task that writes a reminder, or simply opening the app daily).
- Live web retrieval (Elicit-style literature search, Metaculus question import, current news for forecasts): the tutor has no internet. The learner could paste or upload sources.
- Cross-user data to fit FSRS parameters on a population (single learner; default parameters plus personal optimization after ~1,000 reviews is fine).
- Rendering Manim video; heavy physics engines beyond what runs in the browser; desktop-grade CAD/SPICE (a small JS SPICE-like solver or `circuitjs` (Falstad) could cover basic circuits client-side).
- Real-time multi-person wargames with human opponents (possible with shared DB state but not the use case).

---

## 8. Ranked: the 12 ideas most worth borrowing

1. **Generate before reveal** (Bastani, Kestin): predict-first questions at the start of every part, and 1–2 blank "your step" lines in every derivation skeleton.
2. **Key-results graph with implicit-credit spacing** (Math Academy FIRe + ts-fsrs): reviews mostly come free from advanced and cross-domain exercises.
3. **Embedded mnemonic prompts** (Quantum Country), level-2.5 flavoured (limits, magnitudes, analogues), answered inline, scheduled, learner-curated.
4. **Hint ladder with logged rung** (Khanmigo/GPT Tutor) inside think-questions and exercises.
5. **Confidence on every answer + calibration curve** (Hubbard).
6. **Daily Fermi item with log-error trend** (Mahajan).
7. **Reactive numbers / one-knob widgets** (Victor, Ciechanowski) for trade-offs and orders of magnitude.
8. **Decision-forcing and failure-diagnosis cases** (case method, NASA LLIS, Petroski).
9. **Hidden-parameter simulators** to infer (system ID games).
10. **Teach-back to a seeded-misconception persona and an oral exam** (LLM protégé, Viva).
11. **Matrix-game / red-team turn as Lanchester capstone; forecast questions with resolution dates.**
12. **Cross-domain connection notes + claims table + interview rehearsal**, scheduled as the daily "authority block" (Zettelkasten, Readwise, Alpha's two-block day).
