# A. Learning-science evidence review for Gilua and Lanchester

Prepared 2026-10-30. Scope: one adult self-learner. He is Hebrew-speaking, strong in systems and military work, and weak in formal math. He uses two AI-tutor Artifacts that are mostly reading-based: about 5 lessons a day of 11–15k words each, aiming for "level 2.5" structural understanding and cross-domain judgment.

**How citations are marked**
- **[V]** means verified in this session by web search: the paper exists and the key number matches at least a reliable abstract or summary.
- **[V-sec]** means the paper exists, but the number was confirmed only through secondary sources.
- **[U]** means not verified in this session; it is from background knowledge and should be checked before citing.

**How evidence strength is graded**
- **Strong:** several meta-analyses, including classroom or field studies.
- **Moderate:** a meta-analysis that is mostly lab-based, or several RCTs.
- **Weak:** single studies, observational data, or reports from vendors and creators.

---

## 0. The core diagnosis

The current design optimizes the *input* side: excellent, long, structured explanations. The best-replicated findings in learning science concern the *output* side: retrieving, generating, explaining, comparing, predicting, and getting calibrated feedback. Most of these effects are around 0.4–0.6 SD over restudy or reading, they persist over time, and several show transfer.

Four other facts reinforce the diagnosis:
- Fluent, well-produced explanation reliably creates an *illusion* of learning (Deslauriers et al. 2019).
- The AI-tutor RCTs that found gains built in *forced learner production*. The ones that found harm let the AI do the cognitive work.
- The schedule (≈60–75k words of dense text a day) is near or beyond what attention allows for deep processing. It also leaves almost no time for the activities that create durable learning.

The single most important change is therefore to rebalance time: much less reading per day, and much more retrieval, prediction, self-explanation and estimation per idea.

---

## 1. Which learning techniques matter most for this profile?

### 1.1 Retrieval practice (the testing effect) — strong evidence, highest priority

**Evidence**
- **Dunlosky et al. 2013** [V], *Psychological Science in the Public Interest* 14(1). Of ten techniques, only practice testing and distributed practice were rated "high utility". Rereading, highlighting and summarization were rated "low".
- **Adesope, Trevisan & Sundararajan 2017** [V-sec], *Review of Educational Research* 87(3):659–701, 118 articles / 272 effect sizes. Practice tests beat restudy and all other comparison conditions. Secondary sources report g ≈ 0.61 (fixed effects) and g ≈ 0.70 (random effects); check the paper's tables for the exact values.
- **Yang, Luo, Vadillo, Yu & Shanks 2021** [V-sec], *Psychological Bulletin* 147(4):399–435. Classroom studies only (222 studies, ~48k students). Overall g ≈ 0.50, about 0.43 after a bias correction that secondary sources report and I could not confirm. Against restudy, g ≈ 0.33. Against other elaborative activities (note-taking, summarizing), quizzing was **not significantly better**. Note this nuance: retrieval beats passive re-exposure clearly, but it beats *other generative work* less clearly.
- **Pan & Rickard 2018** [V], *Psychological Bulletin* 144(7):710–756. Transfer of test-enhanced learning, d ≈ 0.40 overall. Transfer is larger when the initial test requires elaborated answers and when feedback is given; I did not verify these moderators directly [U].
- **Butler 2010** [V], *JEP:LMC* 36:1118–1133. Repeated testing beat repeated studying on *inference* and *far-domain* transfer questions, such as applying bat-wing anatomy to aircraft design. It was replicated by van Eersel et al. 2016 [V-sec]. Caveat: subjects were told the final test related to what they had studied, so this is cued transfer, not spontaneous transfer.
- **Karpicke & Blunt 2011** [V], *Science* 331:772–775. Retrieval practice beat building a concept map with the text open, even on inference questions and on a final test that *was* a concept map.

**Does it work for complex, conceptual material?** This is relevant because the learner wants structure, not facts.
- Van Gog & Sweller 2015 [V] argued that the testing effect shrinks as "element interactivity" rises.
- Karpicke & Aue 2015 [V] rebutted that they had confused material complexity with task complexity and had left out positive studies.
- Later studies (Roelle & Berthold 2017 [V-sec], among others) still find testing effects with complex material.
- **Verdict:** retrieval helps complex material, but the *retrieval task must match the target*. Free recall of a derivation skeleton, or explaining where an assumption enters, works better than recognizing a fact. Recall also works better when the material has first been understood: retrieval after a worked explanation, not instead of one.

**Implication for the apps**
- Every lesson should end with a short *closed-book* retrieval block that the learner must answer *in writing* before seeing any summary. Typical prompts:
  - "Rebuild the formula's structure."
  - "Which assumption, if dropped, breaks step 3?"
  - "Estimate X to within a factor of 2."
- Answers to the existing hidden-answer "think" questions should be *required to be typed* before they are revealed. Today they can be clicked past.
- The tutor grades the answers. Scores feed the course memory and the review queue (see §5).

### 1.2 Spacing (distributed practice) — strong evidence

**Evidence**
- **Cepeda et al. 2006** [U], *Psychological Bulletin* meta-analysis: robust spacing benefits across hundreds of studies.
- **Cepeda, Vul, Rohrer, Wixted & Pashler 2008** [V], *Psychological Science* 19(11), >1,350 participants. The optimal gap between study sessions *grows* with the retention interval but *shrinks as a fraction of it*: about 20–40% of a one-week test delay, falling to about 5–10% of a one-year delay. Too-short gaps cost much more than too-long ones.
- **Rawson, Dunlosky & Sciartelli 2013** [V-sec], *Educational Psychology Review*. "Successive relearning" means retrieving to a criterion, then relearning in several spaced sessions. In a real college course it raised exam performance by about a letter grade (C→B) and improved retention at 24 days.

**Implication**
- The earlier "no spaced repetition" decision is the design choice least supported by evidence.
- Retention is needed for months to years, because the learner will write articles and interview experts. Reviews therefore need to recur at roughly 1 day, 1 week, 3–4 weeks and 2–3 months.
- With ~316 modules, *something* must be revisited, or early modules (signals, probability, linear algebra) will have decayed by the time control, ML and RL depend on them.
- Spacing need not mean flashcards (see §5).

### 1.3 Interleaving — moderate evidence, domain-dependent

**Brunmair & Richter 2019** [V], *Psychological Bulletin* 145(11):1029–1052, 59 studies.
- Overall g = 0.42.
- Mathematics tasks: g = 0.34.
- Expository text: ambiguous, not significant.
- Words: blocking was *better* (g = −0.39).
- Heterogeneity is high (I² ≈ 77%).
- Interleaving helps most when categories are *similar between* each other and *varied within*, i.e. when the learner must discriminate *which* method or structure applies.

**Implication** Interleave *problem types and structures*, not lesson text:
- Mixed review sets: "Is this a first-order lag, a resonance, or a diffusion problem?"
- "Which approximation applies here?"

This fits the cross-domain goal (recognizing the same structure in different fields). Don't interleave the first exposure to new topics.

### 1.4 Self-explanation and elaboration — moderate-to-strong evidence

**Bisra, Liu, Nesbit, Salimi & Winne 2018** [V], *Educational Psychology Review*, ~64 reports / ~6,000 participants. Prompted self-explanation gives g = 0.55. Chi's original work (1989, 1994) is the origin [U].

The **ICAP framework (Chi & Wylie 2014)** [V] predicts that learning rises in the order passive < active < constructive < interactive. Two caveats:
- ICAP is a framework, not a law.
- At least one controlled lab study found the *reverse* ordering for some materials (UGA record, verified as existing [V]). Boundary conditions such as task complexity and learner preparation matter.

**Implication**
- Prompts should ask the learner to *explain why* each derivation step follows and *where each assumption enters*. That is exactly level 2.5.
- The tutor should then critique the explanation. This turns the "interactive" mode of ICAP into reality.
- The *learner* should produce the explanation; the AI should not pre-write it.

### 1.5 Generation effect — moderate evidence, mostly lab and word lists

**Bertsch, Pesta, Wiscott & McDaniel 2007** [V-sec], *Memory & Cognition* 35(2), 86 studies. Mean d ≈ 0.40, larger at longer delays. McCurdy et al. 2020 [V] updated this analysis. The evidence is mostly lab work with words; transfer to technical understanding is inferred, not shown.

**Implication**
- "Predict before you read" for each key result. For example: "Before the derivation: what should the dependence on L be? Guess the exponent."
- This is cheap, and it pairs with pretesting (§1.8).

### 1.6 Worked examples and the expertise-reversal effect — strong evidence for novices, reverses with expertise

**Evidence**
- The worked-example effect is among the best-replicated findings of cognitive load theory.
- **Kalyuga, Ayres, Chandler & Sweller 2003** [V] (*Educational Psychologist* 38(1)) and **Kalyuga, Rikers & Paas 2012** [V] (*Ed Psych Review* 24(2)): full guidance helps novices, but becomes redundant and even harmful as expertise grows. The standard remedy is *faded* worked examples: full example → partial example → independent problem.
- **Kirschner, Sweller & Clark 2006** [V] argue against minimal guidance for novices, with the same caveat that the advantage recedes with prior knowledge.

**Implication**
- The learner is a novice in formal math but an expert in systems and military practice, so the profile is mixed.
- In math-heavy modules, the long fully worked derivations are appropriate *at first*. Within a topic family, the tutor should fade them: later lessons give the skeleton and ask the learner to fill in steps.
- In military and operational content, where he is expert, long explanations risk redundancy. Lanchester should lean harder on cases, problems and critique.
- Gilua already has a "reader stage" mechanism (P0–P3 gate, then full level), which is a natural hook for fading.

### 1.7 Cognitive load — strong theory, mixed measurement

Cognitive load theory is well supported for novices learning high-element-interactivity material such as math derivations [V via Kirschner et al.]. The concept of "element interactivity" is criticized as hard to measure (Karpicke & Aue 2015 [V]).

**Implication**
- Hold one new structure per chunk.
- Keep the derivation skeleton visible.
- Avoid split attention between a 3D scene and text that must be read simultaneously.
- **A 13k-word lesson is not itself a cognitive-load problem if it is chunked. It becomes one if it is consumed in a single pass with no consolidation.**

### 1.8 Pre-questions / pretesting — moderate evidence

**St. Hilaire, Chan & Ahn 2024** [V], *Psychonomic Bulletin & Review* 31:411–441, preregistered meta-analysis.
- Prequestions improve memory for the *pre-questioned* content: g = 0.54.
- The general effect on non-asked content is about zero.
- The effect is larger when learners must *generate an answer* (g ≈ 0.65) than when they merely read the question (g ≈ 0.22).

**Implication**
- Open each lesson part with 2–3 pre-questions on its *central* results. The learner must guess, and errors are fine.
- Because the effect is item-specific, the pre-questions must target what matters most: the structure of the main result, a key order of magnitude, a key limit.

### 1.9 Concept mapping — weaker than retrieval

**Karpicke & Blunt 2011** [V]: building a map with the text open loses to retrieval. Blunt & Karpicke 2014 [V-sec]: *retrieval-based* concept mapping (closed-book) is about as good as free recall.

**Implication** The "same structure across fields" map, i.e. the fieldmap block, is valuable *if the learner builds it from memory* and the tutor then corrects it. A map that the AI draws and the learner only reads is low value.

### 1.10 Teaching others and writing — moderate evidence, plausible mechanism

- The "learning by teaching" and "protégé" effects are supported, but much of the advantage comes from the retrieval involved in explaining without notes [U: Koh, Lee & Lim 2018 *Applied Cognitive Psychology* is the commonly cited source for this; not verified here].
- Writing-to-learn meta-analyses show small-to-moderate effects, largest when writing prompts metacognition [U: Bangert-Drowns, Hurley & Wilkinson 2004].

**Implication**
- The learner already writes articles. That is a high-value production channel, *provided the drafts are written from memory first* and then fact-checked against sources and the tutor.
- A weekly "explain module X to a smart colleague in 600 words, closed book" exercise is a cheap, high-yield combination of retrieval, self-explanation and generation.

### 1.11 Desirable difficulties and the fluency illusion — strong evidence, directly relevant

**Deslauriers, McCarty, Miller, Callaghan & Kestin 2019** [V], PNAS 116(39). Students learned *more* in active-learning physics sessions but *felt* they learned *less* than in polished lectures.

**Freeman et al. 2014** [V], PNAS (225 STEM studies). Active learning raised exam and concept-inventory scores by 0.47 SD and cut failure from 33.8% to 21.8%.

The Bjork "desirable difficulties" framework [U, not re-verified] predicts the same pattern: conditions that slow apparent progress (spacing, testing, interleaving, generation) improve long-term retention and transfer.

**Implication** This is the biggest risk in the current design. Long, fluent AI lessons maximize the *feeling* of understanding. Learner satisfaction and "this was a great lesson" are therefore poor guides. The apps should measure understanding with delayed, closed-book probes, and show the learner that metric.

### 1.12 Ranking for this learner

Ranked by expected impact relative to the current design:
1. Retrieval with production (written answers, rebuilding structure, estimates).
2. Spacing / successive relearning across modules.
3. Self-explanation of assumptions and steps, with AI feedback.
4. Comparing cases and structures (analogical encoding, §3.6).
5. Pre-questions and prediction.
6. Fading worked examples by topic family.
7. Interleaving problem *types* in review.

Concept maps and "reading more carefully" come last.

---

## 2. Reading volume: 60–75k words a day of dense technical text

### 2.1 Arithmetic

- Typical skilled adults read ordinary prose at roughly 200–400 wpm (Rayner et al. 2016 [V], *PSPI* 17(1):4–34).
- For dense technical text with equations and diagrams, effective study speed is much lower. A reasonable working range is 80–200 wpm [U: no single authoritative figure verified; the range is consistent with the "reading for study" literature].
- At that range, 60–75k words a day takes:

| Effective speed | Daily reading time |
|---|---|
| 200 wpm | 5–6.3 h |
| 150 wpm | 6.7–8.3 h |
| 100 wpm | 10–12.5 h |

- This is *before* any retrieval, problem solving, review, writing or interviews.
- **The schedule is feasible only if the text is skimmed, and skimming gives "moderate comprehension".** Rayner et al. found that the speed–accuracy trade-off cannot be beaten by speed-reading techniques. The bottleneck is language comprehension, not eye movement. Effective "speed readers" are skimmers who already know the topic, which this learner does not, for the math.

### 2.2 Attention and fatigue

- A 2025 *Psychological Bulletin* individual-participant meta-analysis [V-sec] covered 68 reports, ~10,000 people and ~500k thought probes. Mind-wandering *rises with time on task*, along with boredom and declining performance.
- Mind-wandering during reading reliably predicts worse comprehension [U for the specific reading meta-analysis; the general association is well established in Smallwood/Schooler work].
- Forrin's thesis [V-sec] reports rising mind-wandering over time while reading.

**Robust practical conclusion** Long uninterrupted reading blocks degrade. Breaks and switching modality (read → retrieve → solve) both help. Retrieval quizzes interpolated in lectures also reduce mind-wandering [U: Szpunar, Khan & Schacter 2013, PNAS; not verified here].

### 2.3 Consolidation

Sleep supports consolidation of declarative memory [U]. That argues for spreading study across days and reviewing the next day, not cramming more per day.

### 2.4 Daily structure (evidence-based design, not a tested protocol)

Instead of 5 lessons × 13k words, aim for about **4–5 focused hours of "new" input + 1.5–2 h of output and review** per day:

1. **Opening (20–30 min):** spaced review queue of earlier modules, all production: rebuild a structure, estimate, explain an assumption.
2. **Per lesson part (about 2,500–3,500 words, ~25–40 min):**
   - pre-questions or prediction (3 min);
   - read;
   - closed-book "rebuild the skeleton" and "where does each assumption enter" (5–10 min);
   - tutor feedback;
   - short break.
3. **After 2 lessons:** a 30–60 min block of problems and estimates, interleaved across recent modules.
4. **End of day (15 min):** write a closed-book 300-word synthesis of the day's key structures and cross-domain links. The tutor checks it and enqueues the errors.

**Consequence for the schedule.** About 4,150 source pages in 2 months is ~69 pages/day.
- If the target is level-2.5 durable understanding plus transfer, the evidence suggests this pace will produce mostly *familiarity* (recognition), not recall-and-use, except for the parts that are actively retrieved and reviewed.
- Options:
  - **(a)** Lengthen the timeline to roughly 4–6 months.
  - **(b)** Triage: designate about 30–40% of modules as "core structures", which get full treatment, retrieval and spacing. The rest are "survey" modules: shorter lessons, one retrieval pass, linked to core structures.
  - **(c)** Shorten lessons. The 600–750 words per source page expansion ratio is a design choice, not a requirement. Expanding a terse textbook 2–3× is good for novices on math. Expanding operational or narrative material is probably redundant (expertise reversal).

---

## 3. Building expert judgment and intuition

### 3.1 Calibration training — moderate evidence

**Forecasting (Tetlock and colleagues)**
- **Mellers et al. 2014** [V], *Psychological Science* 25(5):1106–1115, Good Judgment Project. Probability-reasoning training beat scenario training, and scenario training beat no training. Training, teaming and tracking all improved accuracy.
- **Chang, Chen, Mellers & Tetlock 2016** [V-sec], *Judgment and Decision Making* 11(5):509–526. A brief (~1 h) "CHAMPS KNOW" debiasing module improved Brier scores by about 6–11% over control, sustained across a forecasting year. The module covers reference classes, averaging estimates and recognizing biases.
- **Important caveat:** a 2025 *Psychological Science* re-analysis, "Rethinking the Role of Teams and Training in Geopolitical Forecasting" [V], found that extraneous variables eliminated, reduced or even reversed some of the teaming and training effects. **Treat the size of training effects as uncertain.**

**Hubbard ("How to Measure Anything")**
- Typical untrained people capture the truth in their "90%" intervals only about 50–60% of the time. Hubbard reports that most people become nearly calibrated after half a day of practice with feedback [V-sec: only via secondary summaries; this is the author's own consulting data, not peer-reviewed].
- The underlying phenomenon of interval overconfidence, and its partial improvement with feedback, is well documented in the judgment literature [U for specific studies].

**Implication**
- Calibration is the most trainable judgment skill. It maps directly onto the goal of "catching errors of AI, books and engineers" and onto article writing.
- Add a **calibration log**: for each estimate or prediction (orders of magnitude, "will this design work", "is the book's claim right"), the learner records a value or interval and a confidence.
- The app scores calibration over time (Brier score; hit rate of 90% intervals) and shows a calibration curve.
- This is cheap, and it is exactly the authority skill.

### 3.2 Fermi estimation — weak direct evidence, good rationale

- I found **no controlled study** showing that Fermi training improves individual estimation accuracy.
- The one direct test found that the Fermi format (with sub-questions) did *not* give more accurate estimates than direct questions [V-sec: Burns 2023, CogSci-type paper].
- Group Fermi decomposition improved collective estimates (Barrera-Lemarchand et al. 2024 [V-sec]). Decomposition aids the "inner crowd" (PMC 10904748 [V-sec]).

**Implication** Keep estimation, since it is central to level 2.5, but *don't assume* decomposition alone builds accuracy. What evidence supports is **many estimates + immediate feedback + calibration scoring**, i.e. the Hubbard/Tetlock loop, plus a memorized bank of anchor quantities: physical constants, typical powers, losses, ranges. Spaced retrieval of anchors is the fact-learning case where SRS is unambiguously effective.

### 3.3 Deliberate practice — real but smaller than claimed

- **Macnamara, Hambrick & Oswald 2014** [V-sec], *Psychological Science*, 88 studies. Deliberate practice explained about 12% of performance variance overall: 26% in games, 21% in music, 18% in sports, 4% in education, and **<1% in professions**.
- Ericsson's camp disputes the definitions used.
- Even so, the elements that *do* robustly matter appear wherever expertise is built: targeted practice at the edge of ability, with fast, accurate feedback.

**Implication** "Reading lessons" are not deliberate practice. The closest analogue for this learner:
- graded error-spotting tasks ("find the wrong assumption in this AI derivation", "this engineer's estimate is off by 10×—why?");
- design trade-off problems;
- estimation;

each with immediate expert feedback from the tutor.

### 3.4 Naturalistic decision making (Klein) and the limits of intuition — strong conceptual consensus

**Kahneman & Klein 2009** [V], *American Psychologist* 64(6):515–526. Intuitive expertise is trustworthy only when:
- **(a)** the environment has stable regularities, and
- **(b)** the person has had adequate practice with **timely, accurate feedback**.

Klein's recognition-primed decision (RPD) model comes from fireground commander studies (Klein, Calderwood & Clinton-Cirocco 1986) [V-sec].

**Implication**
- Physics and engineering scaling laws are high-validity environments. Intuition there *can* be trained, but only through feedback on many judgments.
- Operational and military judgment (Lanchester) is lower-validity. Its "authority" should rest on explicit models, base rates and calibrated uncertainty more than on gut feel.
- In Lanchester, use **decision cases with known outcomes** (historical engagements, system programs). The learner commits to a judgment *before* seeing the outcome, then compares. NDM-style "tactical decision games" and pre-mortems are the practical tools [U for effect sizes; widely used in military training but rarely RCT-tested].

### 3.5 Cognitive flexibility theory (Spiro) — plausible, modest evidence base

CFT [V-sec: Spiro, Coulson, Feltovich and colleagues, 1987/1988 technical reports] says that in ill-structured domains, transfer needs:
- multiple representations;
- "criss-crossing" the same concepts through many cases;
- resisting the "reductive bias" of oversimplification.

The evidence comes mostly from small medical and literary-education studies and hypertext systems. It is supportive, not strong.

**Implication** For operations and trade-off judgment, revisit core concepts through several different cases and representations, as the cross-domain blocks partly do. Explicitly ask "where does this simple model fail?" This *matches* the existing "limits" and "error-catching" goals.

### 3.6 Analogical encoding and comparing cases (Gentner) — moderate-to-strong evidence, most relevant to "same structure across fields"

- **Gentner, Loewenstein & Thompson 2003** [V], *Journal of Educational Psychology* 95:393–408. Learners who *compared* two cases side by side abstracted the shared principle and transferred it much more than learners who studied the same cases separately. This held even when neither case was well understood alone.
- **Alfieri, Nokes-Malach & Schunn 2013** [V], *Educational Psychologist* 48(2):87–113, 57 experiments. Case comparison beat traditional methods with d ≈ 0.50.
- The classic finding underneath (Gick & Holyoak 1980/1983 [U]): people rarely transfer spontaneously from a single analog, but a second analog plus comparison induces a schema that does transfer.

**Implication** This is the highest-evidence route to the stated "cross-domain judgment" goal.
- Replace "here is how this structure appears in fields X, Y, Z" (read passively) with **compare-and-contrast tasks**: "Here are an RC circuit, a thermal mass, and a missile-seeker lag. Write the shared structure, then name one way each breaks the analogy."
- The learner produces the mapping; the tutor corrects it.

### 3.7 Far transfer — be realistic

**Sala & Gobet 2017** [V], *Current Directions in Psychological Science*, and later second-order meta-analyses. General "brain training" (chess, music, working memory) produces little or no far transfer once study quality is controlled.

Transfer happens when *the same structure* is learned abstractly and practiced in multiple contexts (Gentner; Pan & Rickard). It does not arise from general "thinking skills".

**Implication** Cross-domain judgment will come from *explicitly encoding shared mathematical structures* (first-order systems, resonance, diffusion, optimization trade-offs, exponential growth and decay, signal-to-noise) and *practicing recognition* across fields. "Being exposed to many fields" does not produce it. Make the shared structures first-class objects in the knowledge graph (§5).

---

## 4. AI tutors: what helps and what harms

### 4.1 Positive RCTs

**Kestin, Miller, Klales, Milbourne & Ponti 2025** [V], *Scientific Reports* 15:17458.
- Crossover RCT with 194 Harvard physics students; the AI tutor was "PS2 Pal".
- Students learned more, in less time, than in a well-run in-class active-learning session.
- Effect sizes are reported as 0.73–1.3 SD (quantile regression); linear regression gives 0.63.
- A re-analysis (Clay Ford [V]) questions the "more than double" framing and gives a wider and smaller plausible range.
- Duration was 2 weeks, on 2 topics, with elite students.
- **Design features** [V via Hechinger/KQED and the paper's description]:
  - the tutor was given the correct solutions, to reduce errors;
  - it revealed **one step at a time** and never the full solution;
  - it encouraged the student to try first;
  - it kept replies **short** (a few sentences) to limit cognitive load;
  - it used growth-mindset feedback;
  - it followed a structured sequence of problems.

**De Simone et al. 2025** [V], World Bank Policy Research Working Paper 11125, Nigeria.
- Six-week after-school program using Copilot (GPT-4) with teacher guidance.
- +0.31 SD on a composite score and +0.23 SD in English.
- Volunteers only (52% of eligible students).
- Students were *prompted to interact*, not simply given content.

**Eedi × Google DeepMind (LearnLM), arXiv 2512.23633** [V], exploratory RCT.
- 165 UK students; LearnLM drafts were supervised by human tutors.
- 93% vs 91% corrected their mistakes (human tutors), versus 65% with static hints.
- Transfer to new problems: 66.2% vs 60.7% (Bayesian posterior 93.6%).
- Small, exploratory, with possible contamination between conditions.

**Tutor CoPilot (Wang et al. 2024)** [V], arXiv 2410.03017.
- 900 tutors and 1,800 students; AI *assisted human tutors*.
- +4 percentage points in topic mastery, and +9 points for weaker tutors.

### 4.2 Negative and cautionary evidence

**Bastani et al. 2025** [V], PNAS 122(26), ~1,000 Turkish high-school students.
- Unrestricted GPT-4 ("GPT Base") improved practice performance by 48%, but cut later unassisted exam scores by **17%** relative to control.
- A guarded "GPT Tutor", which gave hints and did not give answers, raised practice performance by 127% but produced **no** exam gain. Harm was avoided, but no benefit appeared.
- Mechanism: students used the AI as a crutch.

**Lehmann, Cornelius & Sting 2024/25** [V], arXiv 2409.09047.
- Using LLMs to *complement* (asking for explanations) increased understanding.
- Using them to *substitute* for one's own work harmed it.
- Students prefer substitution.
- A field study found a long-term decline in learning outcomes.

**Fan et al. 2024/25** [V-sec], *British Journal of Educational Technology* 56(2).
- ChatGPT support improved the essay *product* but not knowledge gain or transfer.
- It reduced metacognitive activity ("metacognitive laziness").

**Kosmyna et al. 2025, "Your Brain on ChatGPT"** [V], arXiv 2506.08872.
- 54 participants writing essays.
- The LLM group showed the weakest EEG connectivity and poorer recall and ownership of their own text.
- Small, not peer-reviewed at the time; treat as suggestive.

**A warning about over-optimistic syntheses.** A widely cited 2025 meta-analysis claiming g = 0.867 for ChatGPT on learning (*Humanities & Social Sciences Communications*) was **retracted in July 2026** over data discrepancies [V via multiple news reports]. Treat sweeping "AI boosts learning by ~0.8 SD" claims with suspicion.

**Product launches.** OpenAI "Study mode" (July 2025) [V] and Anthropic's Claude "Learning mode" (April 2025 for Education, wider in Aug 2025) [V] both build in Socratic questioning and withhold answers. I found **no published RCT** of either product's learning outcomes [U/absent].

### 4.3 What separates help from harm (synthesis)

The pattern across studies is consistent. The evidence is moderate: a handful of RCTs, mostly with students.

| Helps | Harms |
|---|---|
| Learner produces each step; AI responds | AI produces the answers or explanations; learner consumes |
| Short, scaffolded turns; one step at a time | Long, complete outputs |
| AI grounded in correct solutions or sources | Ungrounded generation (hallucination risk) |
| Practice is followed by *unassisted* assessment | Only assisted performance is measured |
| AI used to explain *after* an attempt | AI used before or instead of an attempt |

**Implication for these apps.**
- The current design (long AI-written lessons consumed by reading) sits closer to the "AI produces, learner consumes" end. It is better than Bastani's GPT Base because no answers are being copied. But it *lacks the active ingredient of the positive RCTs*: forced learner production with stepwise feedback.
- Every Kestin-style ingredient can be added without discarding the long lessons. Use the lesson as the "worked example". Then run a short tutoring loop:
  - one step at a time;
  - short turns;
  - the learner attempts first;
  - grounding comes from the lesson text and source pages.
- Keep a **no-AI checkpoint**: an end-of-module quiz with no tutor help, and a *delayed* re-quiz about 2 weeks later. This is the analogue of Bastani's unassisted exam, and the only honest measure.

---

## 5. Mastery learning, knowledge graphs and spaced repetition at scale

### 5.1 Mastery learning — moderate-to-strong evidence (older literature)

**Kulik, Kulik & Bangert-Drowns 1990** [V], *Review of Educational Research* 60(2):265–299, 108 controlled evaluations. Positive effects on exam performance. The often-quoted ES ≈ 0.52 may belong to the 1986 Kulik meta-analysis rather than the 1990 paper [V-sec, ambiguous].

Bloom's "2 sigma" for one-to-one tutoring plus mastery is widely cited. It is considered an overestimate; later syntheses find tutoring effects of about 0.3–0.4 SD [U: Kraft and others; VanLehn 2011 found human tutoring ≈ 0.79 and step-based ITS ≈ 0.76].

**Implication** Gate progression on *demonstrated* mastery of prerequisite structures, through a short, closed-book, production-based check. Gate on effort, not on "lesson read". It matters a great deal in a 316-module chain where later modules (control, RL) depend on earlier ones (linear algebra, probability).

### 5.2 Math Academy — weak independent evidence, strong design logic

- Math Academy's approach is described by Skycak in *The Math Academy Way* [V, a creator's description]:
  - a knowledge graph of thousands of topics;
  - mastery gating;
  - spaced repetition calibrated per student and per topic;
  - **"Fractional Implicit Repetition" (FIRe)**: practicing an advanced topic gives partial review credit to the prerequisites it contains, discounted when it comes too early. Credit flows down the graph and penalties flow up.
- I found **no independent peer-reviewed evaluation** of its outcomes [absent].
- The design follows directly from well-supported principles: mastery, spacing, retrieval, interleaving.

**Implication** Implicit repetition is the key idea for this learner. Most review can be *embedded* in new lessons:
- e.g., a control-theory problem that requires first recalling the Laplace-transform structure;
- schedule it by tracking which prior structures each new lesson exercises;
- add explicit reviews only for structures that are not getting implicit practice.

That keeps reviews cheap.

### 5.3 FSRS / Anki — strong evidence for prediction of fact recall

- FSRS (Jarrett Ye, from 2022) is an open-source memory model. On the open-spaced-repetition benchmark of many millions of Anki reviews, it predicts recall better than SM-2: lower log loss in roughly 97–99.6% of collections, depending on version [V-sec].
- SuperMemo disputes the metric [V].
- **Caveat:** benchmark accuracy ≠ learning gain. It means more efficient scheduling (fewer reviews for the same retention), not proof that SRS builds understanding.

**Implication** The app does not need Anki. A simple FSRS-style or Leitner-style scheduler is enough, because the base intervals of a few days, then weeks, then months, are robust (Cepeda 2008). The open-source FSRS model can be used (it has a JS implementation [U]).

### 5.4 Does spaced retrieval work for conceptual and structural knowledge?

- **Yes, with design conditions**, at moderate strength:
  - Butler 2010 (inference and far transfer) [V];
  - Pan & Rickard 2018 (transfer d ≈ 0.40) [V];
  - Karpicke & Blunt 2011 (inference questions) [V];
  - successive relearning of course *concepts* (Rawson et al. 2013 [V-sec]);
  - Yang et al. 2021 classroom data [V-sec].
- **Conditions:**
  - the prompt requires *producing the structure*, not recognizing a fact;
  - feedback is given;
  - the initial understanding was in place.
- **Practitioner evidence** (Quantum Country, Matuschak and Nielsen [V, creator's notes, observational]): embedded prompts gave about 95% recall after demonstrated 5-day retention, at low review cost. It is weak causal evidence, but it is proof of concept for conceptual-physics prompts embedded in long text.

**Implication**
- Write **structural review prompts**, not trivia. Examples:
  - "Rebuild the form of the radar equation; which term dominates the range exponent and why?"
  - "What does the 4th-power dependence imply about doubling power?"
  - "Name the assumption that fails at low SNR."
- Feed them into a spaced queue. Keep about 3–8 per module, around 1,500–2,500 for the whole course, which is easily manageable at roughly 20–30 min/day of review.

---

## 6. Other robust findings that matter here

1. **Feedback quality and timing.** Feedback is among the strongest instructional influences, but its effects vary widely; some feedback *harms* [U: Kluger & DeNisi 1996; Wisniewski et al. 2020].
   - Task-focused, specific, and corrective of *misconceptions* is best.
   - Ego-focused praise is worst.
   - *Tutor feedback should name the specific structural error.*
2. **Measure delayed, unassisted performance.** Immediate performance and *felt* learning are poor proxies (Deslauriers 2019 [V]; Bastani 2025 [V]). Only a delayed, closed-book probe shows whether the reading paid off.
3. **Errorful generation followed by feedback is fine.** Pre-question errors do not hurt when corrected (St. Hilaire 2024 [V]). Don't hide the hard questions.
4. **AI reliability.** LLM tutors make errors, and the positive RCTs grounded the tutor in correct solutions (Kestin [V]). A level-2.5 learner trying to *catch AI errors* needs a reliable reference. Lessons and checks should quote source pages, and a percentage of tutor claims should be spot-checked. Error-spotting tasks with *planted* errors are themselves a strong training format; the error-detection literature is promising but thin [U].
5. **Motivation and burnout.** A 60–75k-word daily target is likely unsustainable for 60 days. Missed days compound, while spaced review recovers well from breaks. An evidence-based plan *front-loads output and limits input*.
6. **Expert interviews as learning events.** Interviews work best with prepared questions and predictions. Writing predictions down before the interview turns each one into a calibration and feedback event (§3.1, §3.4) [design inference, not tested].

---

## 7. Evidence summary table

| Technique | Strength | Typical effect | Population caveat |
|---|---|---|---|
| Retrieval practice | Strong | g ≈ 0.5–0.7 vs restudy (lab); ≈0.33 vs restudy in class | Many lab studies; robust in classrooms |
| Retrieval → transfer | Moderate | d ≈ 0.40 | Mostly near transfer; cued far transfer |
| Spacing / successive relearning | Strong | Large at long delays; ~letter grade in class | Robust across ages |
| Interleaving | Moderate | g ≈ 0.42 overall; 0.34 math | Helps discrimination of similar categories |
| Self-explanation | Moderate–strong | g ≈ 0.55 | Mixed ages |
| Generation | Moderate | d ≈ 0.40 | Mostly word lists |
| Pre-questions | Moderate | g ≈ 0.54 (asked items only) | Lab/video; item-specific |
| Worked examples / fading | Strong for novices | Reverses with expertise | — |
| Case comparison | Moderate–strong | d ≈ 0.50 | Adults included (negotiation, MBA) |
| Calibration/forecast training | Moderate (contested) | ~6–11% Brier improvement | Adults; 2025 re-analysis caution |
| Fermi training | Weak | No direct evidence | — |
| Deliberate practice | Moderate | ≈12% variance overall; <1% professions | Correlational |
| Far transfer from general training | Strong *negative* | ≈0 | — |
| Guarded AI tutor with production | Moderate | 0.2–0.7+ SD in RCTs | Short, students |
| Unguarded AI as answer source | Moderate *negative* | −17% on unassisted exam | High-school math |

---

## 8. Sources (verified in this session unless marked)

- Dunlosky et al. 2013, PSPI — https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html
- Adesope et al. 2017, RER — https://journals.sagepub.com/doi/10.3102/0034654316689306
- Yang et al. 2021, Psych Bull — https://scholars.hkbu.edu.hk/en/publications/testing-quizzing-boosts-classroom-learning-a-systematic-and-meta-/
- Pan & Rickard 2018, Psych Bull — https://sc-pan.github.io/pdf/PR_2018.pdf
- Butler 2010, JEP:LMC — https://profiles.wustl.edu/en/publications/repeated-testing-produces-superior-transfer-of-learning-relative-/
- Karpicke & Blunt 2011, Science — https://stafforini.com/works/karpicke-2011-retrieval-practice-produces/
- Van Gog & Sweller 2015 / Karpicke & Aue 2015 — https://link.springer.com/10.1007/s10648-015-9309-3
- Cepeda et al. 2008 — https://pubmed.ncbi.nlm.nih.gov/19076480/
- Rawson, Dunlosky & Sciartelli 2013 — https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-successive-relearning-dunlosky-greve-badali-wissman-rawson.pdf
- Brunmair & Richter 2019 — https://pubmed.ncbi.nlm.nih.gov/31556629/
- Bisra et al. 2018 — https://summit.sfu.ca/item/34322
- Chi & Wylie 2014 — https://csi.asu.edu/wp-content/uploads/2018/01/ChiWylie2014ICAP.pdf
- Bertsch et al. 2007 — https://pubmed.ncbi.nlm.nih.gov/17645161/
- Kalyuga et al. (expertise reversal) — https://link.springer.com/article/10.1007%2Fs10648-007-9054-3
- Kirschner, Sweller & Clark 2006 — https://www.davidlewisphd.com/courses/EDD8121/readings/2006-Kirschner_et_al.pdf
- St. Hilaire, Chan & Ahn 2024 — https://par.nsf.gov/servlets/purl/10511812
- Deslauriers et al. 2019, PNAS — https://openlab.citytech.cuny.edu/gamelab/files/2023/01/Deslauriersa-et-al-2019.pdf
- Freeman et al. 2014, PNAS — https://pmc.ncbi.nlm.nih.gov/articles/PMC4060683
- Rayner et al. 2016, PSPI — https://profiles.wustl.edu/en/publications/so-much-to-read-so-little-time-how-do-we-read-and-can-speed-readi/
- Mind-wandering time-on-task meta-analysis 2025 — https://ifp.nyu.edu/2025/meta-analyses-systematic-reviews/bul0000424/
- Mellers et al. 2014 — https://escholarship.org/content/qt4rg4n9vr/qt4rg4n9vr_noSplash_4ff67e56b3dac616e0163b75090705e6.pdf
- Chang et al. 2016, JDM — https://ideas.repec.org/a/cup/judgdm/v11y2016i5p509-526_8.html
- 2025 re-analysis of GJP teams/training — https://www.psychologicalscience.org/journals/psychological-science/09567976241266481/
- Hubbard calibration (secondary) — https://www.greaterwrong.com/posts/ybYBCK9D7MZCcdArB/how-to-measure-anything
- Fermi guesstimation and the inner crowd — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10904748/
- Macnamara et al. 2014 — https://www.sciencedaily.com/releases/2014/07/140716123835.htm
- Kahneman & Klein 2009 — https://pubmed.ncbi.nlm.nih.gov/19739881/
- Spiro CFT — https://apps.dtic.mil/sti/pdfs/ADA250147.pdf
- Gentner, Loewenstein & Thompson 2003 — https://www.kellogg.northwestern.edu/academics-research/research/detail/2003/learning-and-transfer-a-general-role-for-analogical-encoding
- Alfieri et al. 2013 — https://www.lrdc.pitt.edu/Schunn/papers/ContrastingCasesMeta-AlfieriEtAl2013.pdf
- Sala & Gobet 2017 — https://livrepository.liverpool.ac.uk/3030311/
- Kestin et al. 2025, Sci Rep — https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/ ; re-analysis https://www.clayford.net/posts/ai_tutoring_nature/ ; design https://hechingerreport.org/proof-points-ai-tutor-harvard-physics/
- Bastani et al. 2025, PNAS — https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html
- De Simone et al. 2025 — https://econpapers.repec.org/RePEc:wbk:wbrwps:11125
- Eedi/DeepMind LearnLM RCT — https://www.emergentmind.com/papers/2512.23633
- Tutor CoPilot — https://arxiv.org/pdf/2410.03017v2
- Lehmann, Cornelius & Sting — https://arxiv.org/abs/2409.09047
- Fan et al., BJET — https://arxiv.org/abs/2412.09315v1
- Kosmyna et al. 2025 — https://arxiv.org/abs/2506.08872
- Retracted ChatGPT meta-analysis — https://www.plagiarismtoday.com/2026/07/15/study-claiming-ai-helps-students-learn-retracted/
- OpenAI Study mode — https://openai.com/index/chatgpt-study-mode/ ; Claude Learning mode — https://venturebeat.com/ai/anthropic-takes-on-openai-and-google-with-new-claude-ai-features-designed-for-students-and-developers/
- Kulik et al. 1990 (DOI 10.3102/00346543060002265) — https://typeset.io/pdf/effectiveness-of-mastery-learning-programs-a-meta-analysis-45bgwh1byb.pdf
- Math Academy / FIRe — https://justinmath.com/individualized-spaced-repetition-in-hierarchical-knowledge-structures/
- FSRS benchmark — https://expertium.github.io/Benchmark.html
- Quantum Country notes — https://notes.andymatuschak.org/z2Rv4RAjXUrwa3fMYn9Q1iR

**Not verified here [U]:** Cepeda et al. 2006; Bjork's desirable-difficulties papers; Szpunar et al. 2013; Gick & Holyoak; Koh et al. 2018; Bangert-Drowns et al. 2004; Kluger & DeNisi 1996; Wisniewski et al. 2020; VanLehn 2011; the exact wpm for technical study reading.
