# Learning science for short in-lesson engineering-judgment exercises

Prepared 2026-11-17. This file builds on `docs/research/A_learning_science.md` (§1–§7). Topics covered there are cited by section number and are not repeated: retrieval, spacing, interleaving, self-explanation (g≈0.55), generation (d≈0.40), pre-questions, worked examples and expertise reversal, calibration (Tetlock/Hubbard), Kahneman & Klein 2009, Gentner analogical encoding / Alfieri d≈0.50, far transfer (Sala & Gobet), and AI-tutor RCTs.

**Citation tags**
- **[V]** verified in this session against the primary text, an abstract, or an author-hosted PDF.
- **[V-sec]** confirmed only via secondary sources or search snippets.
- **[U]** not verified in this session; from background knowledge, check before citing.

**Evidence grades**
- **Strong:** several meta-analyses or a large replicated body.
- **Moderate:** one meta-analysis or several RCTs.
- **Weak:** single studies, descriptive work, or practitioner claims.

---

## Q1. Expert–novice differences in engineering design: what experts do in framing, scoping and generating alternatives, and what can be trained

### Takeaway
Experts spend more time and effort *before* solving: they scope the problem, gather information, choose a predictive model, choose approximations and plan. They also reflect: they check assumptions and try to break the solution. Novices jump to execution. Empirical "decision" taxonomies (Wieman's group, 29 decisions) turn this into a trainable list. Short exercises can target individual decisions, but evidence that drilling single decisions transfers to full projects is still preliminary.

### Cited Findings
- **Atman et al. 2007** [V-sec], *J. Engineering Education* 96(4):359–379. Compared students with expert practitioners on a design task.
  - Experts spent significantly more time overall and in every design stage, especially **problem scoping**.
  - They gathered significantly more information, across more categories.
  - The authors conclude that problem scoping and information gathering are the major expert–student differences and should be developed.
  - Grade: moderate (single well-cited study, protocol method). Sources: [FIU record](https://discovery.fiu.edu/display/pub199304); [Morozov, Kilgore & Atman 2007, breadth in problem scoping](https://peer.asee.org/breadth-in-design-problem-scoping-using-insights-from-experts-to-investigate-student-processes).
- **Price, Kim, Burkholder, Fritz & Wieman 2021** [V], *CBE—Life Sciences Education* 20(3):ar43. [PMC8715817](https://pmc.ncbi.nlm.nih.gov/articles/PMC8715817)
  - **Sample:** interviews with 52 successful scientists and engineers in 10 fields (incl. electrical, mechanical and chemical engineering, physics, medicine).
  - **Main result:** across all experts, the work was framed around **29 specific decisions** in six categories, the last of which is in two parts:
    - selection and goals;
    - framing (key features, *choosing a predictive framework*, narrowing, recalling related problems, generating potential solutions, judging whether the problem is solvable);
    - planning (*approximations and simplifications*, decomposition, *identifying the most uncertain areas*, information needs, priorities, contingencies);
    - interpretation (choosing calculations, judging whether information is believable, comparing results with predictions, investigating anomalies);
    - reflection (whether assumptions still hold, whether the approach works, how good the solution is, including trying to "break" it and examining failure modes);
    - implications and communication.
  - **Weak solvers** make "a smaller subset of decisions … particularly lack of reflection decisions."
  - **Textbook problems** remove most of these decisions: they are "already made for them."
  - **What matters**, the authors write, is "not what content they have seen, but rather what decisions they have had practice making."
  - **Recommendation:** deliberate practice on specific decisions, using problems with incomplete information. Decision-based assessment is described as preliminary, ongoing work.
  - Grade: moderate (descriptive interview study, not randomized).
- **Expert "predictive framework"** [V, same paper]. Every expert adopted early a mental model of the key features and the relations between them. They used it to simulate, predict and interpret data, and revised it as new data arrived. [PMC8715817](https://pmc.ncbi.nlm.nih.gov/articles/PMC8715817)
- **Graduating students vs engineers** [V-sec]. Burkholder & Wieman report that graduating engineering students score about 40–70% of practicing engineers' scores on their decision-based problem-solving assessments. [ASEE Prism](https://www.asee-prism.org/2022/page/66); [UW STEP summary](https://depts.washington.edu/stepuw/learning-and-teaching-in-stem-fields-using-authentic-problems)
- **Burkholder et al. 2020** [V-sec], *Phys. Rev. PER* 16:010123. [Catalog record](https://katalog.lib.cas.cz/KNAV/EdsRecord/edsdoj,edsdoj.8787b4e0de1b4eafa04effc8aba6427b)
  - An expert-derived problem-solving template, used both as a scaffold and as a generic rubric.
  - Using the template's elements correlated with success.
  - Explicit use **did not add cognitive load**.
  - The relationship depended on problem type and difficulty.
  - Grade: weak–moderate (correlational).
- **Chi, Feltovich & Glaser 1981** [V-sec], *Cognitive Science* 5(2):121–152. [ASU record](https://education.asu.edu/lcl/publications/chi-m-t-h-feltovich-p-glaser-r-1981-categorization-and-representation-physics); [DTIC tech report](https://apps.dtic.mil/sti/pdfs/ADA100301.pdf)
  - Experts sort physics problems by underlying principle; novices sort by literal or surface features.
  - Experts use fewer, larger categories.
  - Small samples: the novice group was about 8 introductory students and the "experts" were grad students. Later work finds advanced novices mix deep and surface features ([arXiv 1602.08781](https://arxiv.org/pdf/1602.08781)).
  - Grade: strong as a replicated phenomenon; the original study is small.
- **Dorst & Cross 2001** [V-sec], *Design Studies* 22(5):425–437. [OU repository](https://oro.open.ac.uk/3278); [PDF](https://cschan.arch.iastate.edu/235/20_Dorst-Creativity_coevolution.pdf)
  - Protocol studies of 9 experienced industrial designers.
  - Creative design is the **co-evolution of problem and solution spaces**: designers frame a partial problem, try a partial solution, and reframe. Experts do not finish framing first and then solve.
  - Grade: weak–moderate (small protocol study, very influential).
- **Ericsson's deliberate practice** [U for the primary sources]. The magnitude caveats are in A §3.3: Macnamara 2014, <1% of variance in professions.

### Inferences
- The 29-decision list is a ready-made **taxonomy for exercise types**. Each 5–20-minute exercise can isolate one or two decisions while keeping the full-project frame visible. Examples:
  - "choose the predictive framework";
  - "choose approximations and state where they break";
  - "identify the most uncertain area";
  - "judge whether this information is believable";
  - "compare result with prediction / investigate the anomaly";
  - "try to break it".
- This directly matches the requested exercise types: choosing a method, planning an analysis, stating a model's domain of validity, diagnosing a failure, breaking a design.
- **Scoping** (asking what information is missing, which requirements are implicit, who the stakeholders and threats are) is the best-documented expert–novice gap (Atman). It deserves its own recurring exercise type: "Before solving: list what you'd need to know and which constraints are unstated."
- Because experts co-evolve problem and solution (Dorst & Cross), a good exercise lets the learner sketch a solution early and then forces a reframe, for example by revealing a new requirement or threat. A strict linear "frame first, then solve" template would misrepresent expert practice.
- **Why textbook-style calculation exercises do not build judgment:** the decisions are pre-made. This is the strongest empirical argument for the learner's request.

### Gaps
- No RCT found showing that practicing isolated decisions in short exercises improves full-project performance. Wieman's group calls its decision-based teaching "ongoing work".
- I did not verify Cross's 2004 "Expertise in design" overview or Ericsson's primary papers in this session.
- No study found specific to defense or aerospace engineers' framing behavior.

---

## Q2. Productive failure and invention activities: effect sizes, boundary conditions, design

### Takeaway
Problem solving before instruction (PS-I) beats instruction-first on conceptual understanding and transfer: g ≈ 0.36 observed, larger with high-fidelity design. The effect is about the same on procedural skill. It depends on (a) enough prior knowledge to generate meaningful attempts, (b) a well-designed task with multiple solution paths and contrasting cases, and (c) **instruction afterwards that builds on the students' own attempts**. Without the later instruction, or with young learners and domain-general skills, it does not help or reverses.

### Cited Findings
- **Sinha & Kapur 2021** [V-sec], *Review of Educational Research*, DOI 10.3102/00346543211019105. [phys.org](https://phys.org/news/2021-09-productively-wiser.html); [X-MOL abstract mirror](https://www.x-mol.com/paper/1406031499744456704)
  - 53 studies, 166 comparisons of PS-I vs I-PS.
  - Overall effect **g = 0.36 [0.20, 0.51]**.
  - The publication-bias-adjusted estimate is **g = 0.87**. Treat it as model-dependent; cite 0.36 as the observed effect.
  - **Fidelity** to productive-failure design principles is a moderator: high-fidelity studies give g ≈ 0.37–0.58.
  - Grade level and domain are moderators too: **younger learners (grades 2–5) and domain-general skills favored instruction-first**.
  - Grade: moderate.
- **Kapur on prior knowledge** [V-sec]. PF needs a minimum of prior knowledge. [Edutopia interview](https://edutopia.org/article/if-youre-not-failing-youre-not-learning); [Education Today](https://www.educationtoday.com.au/news-detail/Have-we-been-getting-5403)
- **Kapur 2014a**, *Cognitive Science*, "Productive Failure in Learning Math" [V-sec]. [Zendy record](https://zendy.io/title/10.1111/cogs.12107)
  - Two RCTs. Both conditions reached similar procedural knowledge.
  - PS-I gave greater conceptual understanding and transfer.
  - Learning from **peers' failed attempts** (vicarious failure) beat instruction-first but **not** generating one's own attempts.
- **Kapur 2014b**, "Comparing learning from productive failure and vicarious failure" [V-sec]. [record](https://data.zhenzhi.com/details/1/897646054)
  - N = 136 grade-8 students.
  - People learn better from their own failed solutions than from evaluating others', provided instruction follows.
- **Loibl, Roll & Rummel 2017** [V-sec], *Educational Psychology Review* 29(4):693–715. [CRIS](https://cris.iucc.ac.il/en/publications/towards-a-theory-of-when-and-how-problem-solving-followed-by-inst/)
  - Proposed mechanisms: prior-knowledge activation, **awareness of knowledge gaps**, and **recognition of deep features**.
  - Later work finds that addressing deep features *during* the problem-solving phase (e.g., via contrasting cases) works better than highlighting them only in later instruction ([Instructional Science 2020 PDF](https://link.springer.com/content/pdf/10.1007/s11251-020-09525-2.pdf)).
- **Schwartz & Martin 2004** [V-sec], *Cognition and Instruction* 22(2):129–184. [eScholarship PDF](https://escholarship.org/content/qt78d7k1zs/qt78d7k1zs.pdf); [CAUSEweb](https://causeweb.org/cause/node/6647)
  - Grade-9 students **invented** indices of variability for contrasting data sets (e.g., pitching machines) before being taught mean deviation.
  - "Tell-and-practice" and invention looked **equal on standard tests**.
  - Invention students did better on a *preparation-for-future-learning* test, in which a worked-example resource was embedded in the test.
  - **The benefit is hidden** unless you measure the ability to learn from a new resource.
  - Replicated in Study 2 by classroom teachers.
- **Holmes et al.** at UBC [V-sec] adapted guided invention for university physics labs. [CWSEI](https://cwsei.ubc.ca/files/outcomes/EOY/Holmes_Roll_Bonn_Day_GuidedInvention.pdf)
- **Expertise reversal and minimal guidance** (Kalyuga; Kirschner, Sweller & Clark): see A §1.6. Instruction-first is better for novices on high-element-interactivity material.

### Inferences
- **Fit for this learner.** Invent-before-told fits him well in systems and military-adjacent topics, where he has strong prior knowledge to generate with: seeker design, EW tactics, salvo or engagement logic. It fits less well for brand-new formal math, such as deriving a matched filter from scratch with no stats background. There, attempts would not be "meaningful", and a worked example should come first (expertise reversal).
- **Design recipe from the literature:**
  1. a problem with **multiple plausible approaches** and **contrasting cases**, e.g., "here are 3 clutter environments; invent a detection rule that works for all";
  2. the learner commits to an attempt in writing (5–10 min);
  3. the lesson's canonical solution is shown **explicitly compared to the learner's attempt**: what it handled that the attempt missed (the "consolidation" step Kapur stresses);
  4. a short transfer check.
- **Skipping step 3 removes the effect** (Kapur 2014b; Sinha & Kapur fidelity moderator).
- **Measure the right outcome.** Schwartz & Martin imply that the gain shows up as faster learning of the *next* topic and better transfer, not as better immediate scores. An app that judges exercises by immediate correctness will undervalue invention tasks.
- **Showing a worked failure is not a full substitute.** The AI should not show a "typical novice failed attempt" instead of letting the learner fail: vicarious failure < own failure.

### Gaps
- I could not get the moderator tables of Sinha & Kapur 2021 (fidelity criteria, adult or university subgroup). Effects for adult self-learners in engineering specifically are unknown.
- No PF studies found on *design or judgment* tasks, as opposed to math concepts. The extension is inferred.
- Time cost: PF sessions in the studies are usually class-period length (~1 h+). Whether 5–20-min micro-invention tasks keep the effect is untested [no source found].

---

## Q3. Cognitive apprenticeship, worked examples vs problem solving, expertise reversal, fading: implications for an advanced learner

### Takeaway
For an advanced or mixed learner, the evidence favors giving fully worked solutions only where he is a novice (formal math). Elsewhere, move quickly to completion problems, then independent decisions, while still making the expert's *reasoning* visible ("modeling" in cognitive apprenticeship). Expert reasoning should be shown *after* the learner commits, as a comparison, not before.

### Cited Findings
- **Expertise reversal; faded worked examples** (Kalyuga et al. 2003, 2012): see A §1.6 [V there].
- **Collins, Brown & Newman 1989**, cognitive apprenticeship [U].
  - Methods: modeling, coaching, scaffolding, articulation, reflection, exploration.
  - The core idea is to make the expert's tacit reasoning visible.
  - I did not verify the primary text in this session. No meta-analysis was found in this session.
- **Expert reasoning shown after commitment (ShadowBox)** [V]: see Q5. Expert reasoning works as feedback after commitment, without the expert present. [Klein & Borders 2016 PDF](https://www.gary-klein.com/_files/ugd/2360d8_32306473d35f4022ac49e0456830f8dc.pdf)
- **Structured reflection vs studying expert examples** (medicine) [V-sec]. Structured reflection was "as effective as other approaches that provided students with additional knowledge such as studying examples of experts' reasoning". [Chamberland et al. 2020, Perspectives on Medical Education](https://link.springer.com/article/10.1007/s40037-020-00603-2)
- **Expert-derived templates** (Burkholder et al. 2020) [V-sec] did not add cognitive load for physics students (Q1).

### Inferences
- **Per-domain fading.** Use a per-domain "reader stage" (A §1.6) to choose the exercise format:
  - *novice domain* → "complete the expert's partially worked analysis plan";
  - *intermediate* → "choose between 3 methods and justify";
  - *strong domain* → "invent / design from scratch, then compare with expert".
- **Model, then fade.** Cognitive apprenticeship's "modeling" maps to a short expert think-aloud in the lesson (why *this* filter, *this* approximation), not just the result. Later exercises fade it: "articulate your own".

### Gaps
- Primary cognitive-apprenticeship sources were not verified. No effect size was found for cognitive apprenticeship as a package.
- No study found comparing faded worked examples for *judgment/design* tasks (vs math procedures) in experts.

---

## Q4. Case-based learning across medicine, the military and aviation: what makes it memorable and transferable

### Takeaway
The best quantitative evidence is for **structured debriefs and after-action reviews** (two meta-analyses, d ≈ 0.67–0.79). For medical **structured reflection on cases**, the evidence is moderate (experimental studies refining illness scripts). The military **decision-forcing case** (USMC) and **tactical decision games** have essentially **no outcome studies**: they are institution-endorsed practice. The shared active ingredients are:
- a real or realistic situation with incomplete information;
- a **forced commitment** to a decision under time or uncertainty;
- **comparison** with what the experts or history actually did (or with a structured differential);
- a structured debrief that names lessons.

### Cited Findings
- **Tannenbaum & Cerasoli 2013** [V-sec], *Human Factors* 55(1):231–245. [PubMed](https://pubmed.ncbi.nlm.nih.gov/23516804/); [CEBMa PDF](https://cebma.org/assets/Uploads/Tannenbaum-Cerasoli.pdf)
  - 46 samples, N = 2,136.
  - Debriefs improve performance about 25% over control, **d = 0.67**.
  - The effect is similar for individuals and teams, and for simulated and real settings.
  - Alignment matters, and facilitation and structure probably matter too.
  - Grade: moderate–strong.
- **Keiser & Arthur 2020/21** [V-sec], *Journal of Applied Psychology*. [QIC-WD summary](https://www.qic-wd.org/sites/default/files/Umbrella%20Summary%20-%20After-Action%20Reviews%20050221.pdf); [EconBiz 2022 moderators paper](https://www.econbiz.de/Record/meta-analysis-task-and-training-characteristics-that-contribute-attenuate-the-effectiveness-the-after-action-review-debrief-keiser-nathanael/10013438768)
  - 61 studies; AAR **d = 0.79**.
  - Their 2022 moderator meta-analysis (*J. Business & Psychology*) found two consistent contributors:
    - alignment to the individual or the team;
    - **objective performance-review media** (e.g., recordings or data, not memory alone).
  - Highly structured AARs beat less structured ones in the military, but not in healthcare.
- **Medicine: structured reflection** [V-sec].
  - Students compare and contrast plausible diagnoses for a case, which refines **illness scripts**: a representation of the disease's causes, presentation, and the conditions under which it occurs.
  - Mamede et al. 2012 (N = 46): structured reflection during case practice beat generating immediate or differential diagnoses for learning clinical knowledge.
  - Schmidt & Mamede's review judges self-explanation and structured reflection the experimentally supported strategies.
  - Grade: moderate (several small RCTs).
  - Sources: [Chamberland et al. 2020](https://link.springer.com/article/10.1007/s40037-020-00603-2); [PMC8906925](https://pmc.ncbi.nlm.nih.gov/articles/PMC8906925); [Erasmus repository](https://repub.eur.nl/pub/129323/Repub_129323_O-A.pdf)
- **USMC decision-forcing cases** (Marine Corps University Case Method Project) [V-sec].
  - Format: the learner is placed in a real historical commander's role at a decision point with the information available then, must decide, and then learns what happened.
  - **No outcome studies**: a consultant who works with the USMC on DFCs told the blog author there are "no studies that show decision making and leadership benefits of DFCs". Their use rests on institutional belief.
  - Only a descriptive GWU dissertation was found.
  - Grade: weak (practice-based).
  - Sources: [Butler, Medium](https://medium.com/agileinsider/decision-forcing-cases-gaining-experience-without-the-hurt-217a4f846606); [Marine Corps Gazette, O'Connell](https://mca-marines.org/wp-content/uploads/OConnell-1.pdf); [Canadian Army Line of Sight](https://www.canada.ca/en/army/services/line-sight/articles/2021/09/decision-forcing-cases.html); [Quantico, Operation Eastern Exit case](https://www.quantico.marines.mil/News/News-Article-Display/Article/600089/case-method-used-to-study-operation-eastern-exit/)
- **Tactical decision games, M&M conferences, CRM debriefs** [U]. Widely used, but no controlled outcome evidence was retrieved in this session (consistent with A §3.4).
- **Hypercorrection effect** [V-sec] (memorability mechanism; see Q8).
  - High-confidence errors that are corrected are *more* likely to be fixed on retest than low-confidence errors (Butterfield & Metcalfe 2001, 2006).
  - Explanation: surprise draws attention to the feedback.
  - [PMC3970786](https://pmc.ncbi.nlm.nih.gov/articles/PMC3970786); [Duke](https://dukespace.lib.duke.edu/items/d6ab09ca-f55c-4efb-9d32-2788bc5838b2/full)

### Inferences
- **Transferable format: the "decision-forcing mini-case".** It combines the components that *do* have evidence:
  1. a real engineering or operational situation stopped at a decision point, with only the information then available (e.g., the Patriot Dhahran clock drift, Ariane 5 501, an AN/SPY radar trade, an anti-ship salvo);
  2. a forced written commitment plus a confidence rating;
  3. the reveal of what was done and why, ideally the real engineers' rationale;
  4. a structured self-debrief, AAR-style: what did I expect, what happened, why the gap, what will I do differently.
- **Objective review media matter** (Keiser & Arthur). The debrief should compare against the actual data and record (the learner's own logged answer, real outcome numbers), not vague recollection.
- **Engineering illness scripts.** Medicine's structured reflection maps well onto *diagnosing a failure*: list 2–3 candidate causes, state the findings for and against each, then pick one. This builds failure-mode scripts per subsystem: "seeker lock loss" → gimbal rate limit / glint / ECM / thermal.
- **Be honest that DFCs and TDGs are unproven.** Their elements are separately supported: commitment, generation, feedback against an expert or the outcome, and debriefs. The package itself is not.

### Gaps
- No controlled evaluation of DFCs, TDGs, wargaming or M&M conferences was found.
- No transfer data for structured reflection to new disease categories (only within-category).
- No engineering-specific case-method outcome studies were retrieved; Harvard and engineering case-method literature was not searched.

---

## Q5. Recognition-primed decision making, ShadowBox, deliberate practice of judgment, calibration

### Takeaway
ShadowBox is the most directly usable evidence-backed protocol for short judgment exercises. It is unfacilitated and scenario-based:
1. the learner ranks options at decision points;
2. he writes a rationale;
3. he sees an expert panel's ranking and rationale;
4. he writes what the experts noticed that he did not.

In military samples it improved agreement with experts (d ≈ 0.5–0.6) in 1–3 hours. Caveats: there is a vendor conflict of interest, the outcome is "match to experts" (not field performance), and the samples are small. Calibration training is in A §3.1.

### Cited Findings
- **Klein & Borders 2016** [V, author-hosted preprint read in this session], *J. Cognitive Engineering and Decision Making* 10(3):268–280. [PDF](https://www.gary-klein.com/_files/ugd/2360d8_32306473d35f4022ac49e0456830f8dc.pdf)
  - **Evaluation 1:** Marines, N = 59, about 3 h, paper-based, 4 scenarios.
    - The SME-feedback group's top-ranked choice matched experts more often over time: .46 → .59, **d = .51**, within-subject.
    - At Time 4 they beat a "no feedback" group that also wrote rationales: .59 vs .44, **d = .63**, p = .02.
    - In the feedback group, 20 of 29 improved. In the no-feedback group, 17 of 31 got *worse*.
  - **Evaluation 2:** 30 Army 2nd lieutenants on tablets, 1 h; a 21% improvement.
  - **The procedure after each decision point:** see the SME choices and rationale, compare, and "write down any lessons they learned about what the experts noticed that they had not."
  - An earlier firefighter study (Hintze), 14 vs 15 officers, found an 18% difference.
  - **Limitations:**
    - The outcome is agreement with an expert panel, not real performance.
    - The experts can disagree (majority choice used).
    - Klein co-founded ShadowBox LLC: a conflict of interest.
    - The "no feedback" comparison group also did reflection.
  - Grade: weak–moderate.
- **Reflection without feedback can drift** (same paper) [V]. In the no-feedback group, more than half declined in agreement with experts. Self-generated rationales *without* expert comparison did not reliably improve judgment.
- **Kahneman & Klein 2009** (when intuition is trustworthy) and **Mellers/Chang calibration training**: see A §3.1 and §3.4.
- **Klein's RPD model** [V-sec in A]. Experts recognize the situation as typical, generate one workable option, and mentally simulate it rather than comparing many options. Implication: training judgment means building a **library of typical situations, cues and expectancies**, which is what ShadowBox targets.

### Inferences
- **ShadowBox as the standard in-lesson exercise type.** It fits 5–20 minutes and needs no live expert. The "expert panel" can be:
  - the real program's documented decision;
  - published design rationale;
  - the lesson author's carefully sourced expert reasoning.
- **Risk:** if the AI fabricates "expert" rationales, the method's foundation is gone. Expert rationales should be grounded in documented sources (see Q7).
- **Score cue-noticing, not just the choice.** The key learner act is "what did experts notice that I did not". This trains RPD cue recognition. Score the *cues noticed*, which is the ShadowBox emphasis on what experts attend to.
- **Pair with calibration.** Add a confidence rating to each ShadowBox decision to feed the calibration log in A §3.1, and to trigger hypercorrection when a confident choice is wrong.

### Gaps
- No independent, non-vendor replication of ShadowBox was found.
- No study on ShadowBox for technical engineering decisions.
- Ericsson's deliberate-practice primary sources were not re-verified.

---

## Q6. Self-explanation, elaborative interrogation, contrasting cases, analogical encoding: choosing between methods and recognizing a method's domain of validity

### Takeaway
Most of this is in A §1.4 and §3.6:
- self-explanation, g ≈ 0.55;
- case comparison, d ≈ 0.50;
- interleaving helps discriminate similar categories, g ≈ 0.42.

What is new here: contrasting cases work best when placed *during* the problem-solving or invention phase (Loibl et al.; Schwartz & Martin), and structured reflection in medicine is in effect contrasting candidate explanations.

### Cited Findings
- **Contrasting cases inside invention** [V-sec]. Schwartz & Martin's invention task used contrasting data distributions so that students noticed which features a formula must handle. [eScholarship](https://escholarship.org/content/qt78d7k1zs/qt78d7k1zs.pdf)
- **Deep features addressed during problem solving** [V-sec]. Addressing the deep features during the problem-solving phase was more effective than highlighting them only in later instruction. [Springer PDF](https://link.springer.com/content/pdf/10.1007/s11251-020-09525-2.pdf); [Bohrium record](https://www.bohrium.com/paper-details/the-effect-of-contrasting-cases-during-problem-solving-prior-to-and-after-instruction/812667688944926720-11376)
- **Structured reflection on competing diagnoses** [V-sec]. Comparing plausible diagnoses refines illness scripts (Q4). [Chamberland et al.](https://link.springer.com/article/10.1007/s40037-020-00603-2)
- **Dunlosky et al. 2013** rated elaborative interrogation and self-explanation as "moderate utility" [V in A §1.1 for the paper; the specific ratings are U here].
- **Gentner, Loewenstein & Thompson 2003; Alfieri 2013**: see A §3.6.

### Inferences
- **"Which method, and where does it break?"** is best taught as contrasting cases. Present 2–3 situations that differ in exactly the feature that flips the method choice:
  - far-field vs near-field;
  - high vs low SNR;
  - linear vs saturated actuator;
  - Lanchester square vs linear law conditions.
- The learner (a) picks a method for each, (b) names the feature that decides it, and (c) states where each method's validity ends. Because the cases share surface features but differ in deep structure, this trains the Chi-style deep-feature sorting directly.
- **Elaborative "why does this hold here / when would it fail?"** prompts are a cheap 2-minute add-on to any method-choice exercise.

### Gaps
- No study found that specifically trains "domain of validity" recognition for physical models. The application is inferred from the contrasting-cases and analogical-encoding literature.

---

## Q7. Feedback that improves judgment: expert-model comparison, rubrics, open-ended answers, risks of AI feedback

### Takeaway
For judgment tasks, the best-supported feedback is **comparison with expert reasoning after commitment, plus learner-written "what did I miss"**:
- ShadowBox: d ≈ 0.6 vs reflection alone;
- structured debriefs: d ≈ 0.67–0.79;
- reflection *without* expert comparison can drift.

LLM grading of open-ended answers approaches human-TA quality when given **rubrics** (essential for harder, open questions). Failure modes remain: hallucination when domain knowledge is lacking, and rubric non-adherence. This argues for source-grounded expert rationales and decision-based rubrics.

### Cited Findings
- **ShadowBox: expert comparison vs rationale-only** [V]. Rationale-only drifted for most participants. [Klein & Borders 2016](https://www.gary-klein.com/_files/ugd/2360d8_32306473d35f4022ac49e0456830f8dc.pdf)
- **Debriefs and AARs**: structure and objective review media increase the effect [V-sec]. [PubMed](https://pubmed.ncbi.nlm.nih.gov/23516804/); [EconBiz](https://www.econbiz.de/Record/meta-analysis-task-and-training-characteristics-that-contribute-attenuate-the-effectiveness-the-after-action-review-debrief-keiser-nathanael/10013438768)
- **Decision-based rubric** [V/V-sec]. Wieman's group proposes using the expert decision list as a rubric that reveals discipline-specific strengths and weaknesses relative to expert benchmarks. The Burkholder 2020 template doubles as a generic rubric. [PMC8715817](https://pmc.ncbi.nlm.nih.gov/articles/PMC8715817)
- **LLM grading (2025 preprints)** [V-sec].
  - With well-designed prompts, LLM grading accuracy and feedback quality were comparable to human graders (1,527 answers). Students rated feedback blind to its source.
  - For harder or open-ended questions, a **rubric was essential**.
  - Reported failure modes: hallucination when the model lacks domain knowledge; occasional rubric non-adherence.
  - Proposed mitigations: repeated prompting, uncertainty flagging, and deferral to a human.
  - Sources: [arXiv 2502.13337](https://arxiv.org/html/2502.13337v1); [arXiv 2511.10819](https://arxiv.org/pdf/2511.10819v1); [EmergentMind 2501.14499](https://www.emergentmind.com/papers/2501.14499.md)
  - Grade: weak (preprints, university course contexts).
- **AI crutch effects; AI feedback risks**: see A §4.2 (Bastani 2025; Fan et al.: metacognitive laziness).
- **Feedback meta-analyses** (Kluger & DeNisi 1996; Wisniewski 2020) [U]; see A §6.

### Inferences
- **Feedback protocol for each exercise:**
  1. The learner commits: answer, reasoning and confidence, before *any* AI hint.
  2. The tutor reveals a **pre-written, source-grounded expert rationale**. It is authored at lesson-generation time and checked, not improvised at feedback time.
  3. The learner writes "what the expert noticed that I didn't".
  4. The tutor scores against a short decision rubric, for example:
     - Did he state the assumptions?
     - Did he identify the most uncertain element?
     - Did he consider at least two alternatives?
     - Did he state the validity limits?
     - Did he propose a check or test?

     It names the single most important missed decision.
- **Grounding over improvisation.** Pre-authoring the expert answer reduces hallucination risk compared with improvising feedback on the fly. It mirrors Kestin's grounding in A §4.1.
- **Do not let the AI judge "correctness"** of genuinely open design choices as if there were a single answer. ShadowBox explicitly treats the expert panel as a reference point, not ground truth. Feedback should ask whether the learner's alternative is defensible and what it costs.

### Gaps
- No study found on AI-generated feedback for *engineering design or judgment* answers specifically.
- No study found on whether AI-authored "expert rationales" (vs real expert panels) preserve the ShadowBox effect. This is the key untested assumption of an AI-tutor implementation.

---

## Q8. Memorability: generation, surprise / prediction error, ownership, desirable difficulties; dosing

### Takeaway
Committing to a prediction or decision with confidence, then getting corrective feedback, is the most memorability-relevant mechanism. It combines:
- the generation effect (A §1.5);
- pre-questions (A §1.8, g ≈ 0.54, larger when answers are generated);
- **hypercorrection**: confident errors are corrected best, via surprise and attention.

Learning from one's *own* failed attempt beats learning from others' (Kapur 2014b): an "ownership" effect. No evidence was found on optimal dosing (how many exercises per lesson). Dosing must be inferred from time budgets and the "replace reading, don't add" argument in A §0 and §2.4.

### Cited Findings
- **Hypercorrection** [V-sec]. Corrected high-confidence errors are more likely corrected on retest than low-confidence errors. Attention to surprising feedback is the proposed mechanism, and a residual effect remains after controlling for difficulty (Metcalfe & Finn 2011). [PMC3970786](https://pmc.ncbi.nlm.nih.gov/articles/PMC3970786); [PMC4084803](https://pmc.ncbi.nlm.nih.gov/articles/PMC4084803); [Duke](https://dukespace.lib.duke.edu/items/d6ab09ca-f55c-4efb-9d32-2788bc5838b2/full)
  - Grade: moderate–strong for factual material; untested for design judgments.
- **Own vs vicarious failure** [V-sec]: Kapur 2014b. [record](https://data.zhenzhi.com/details/1/897646054)
- **Generation, pre-questions, desirable difficulties, fluency illusion**: see A §1.5, §1.8, §1.11.
- **Dorst & Cross: "surprise" problem/solution spaces** [V-sec]. Creative design events are often triggered by surprise (a design-cognition finding, not a memory study). [OU](https://oro.open.ac.uk/3278)

### Inferences
- **Always ask for a confidence rating with a commitment.** It enables hypercorrection, calibration tracking, and the emotional "I was sure and wrong" moment that makes cases memorable.
- **Dosing (inference, no direct evidence):**
  - A §2.4 already proposes chunks of about 2.5–3.5k words with 5–10 min of production each.
  - A reasonable starting point is **1 short engineering-act exercise (5–10 min) per lesson part**, plus **1 longer one (15–20 min, e.g., a ShadowBox or decision-forcing mini-case) per lesson**. That gives about 3–4 per lesson and about 30–40 min of a roughly 2-h lesson.
  - **They should replace reading, not be added to it.** The evidence in A says the output side is underweighted, and fluent reading creates illusions of learning.
  - Monitor via delayed, unassisted probes.
- **Vary the exercise type across a lesson** (choose method / diagnose / invent / break) to get interleaving's discrimination benefit (A §1.3).

### Gaps
- **No study found on the optimal number of embedded judgment exercises per lesson.**
- No study found on emotional salience for *engineering case* memory specifically.
- The "ownership of ideas" literature (e.g., the IKEA effect, self-reference effect) was not searched or verified in this session.

---

## Q9. Transfer to full projects: near vs far transfer of design and judgment skills

### Takeaway
Transfer of judgment is realistic only as **near-to-moderate transfer within domains whose structures were explicitly practiced**. A §3.7 found far transfer from general training ≈ 0. The pieces that support transfer:
- PS-I/PF, on conceptual transfer (g ≈ 0.36);
- invention, on preparation for future learning;
- case comparison, d ≈ 0.50;
- debriefs and AARs, whose effects hold across simulated and real settings.

Full-project transfer is most likely if short exercises use **the same decision vocabulary and the same template** as full projects (Wieman's 29 decisions). Then the short exercise is literally a sub-part of the project process.

### Cited Findings
- **PS-I gains are on conceptual understanding and transfer**, not procedures [V-sec]. Sources: Kapur 2014a ([Zendy](https://zendy.io/title/10.1111/cogs.12107)); Sinha & Kapur 2021 ([phys.org](https://phys.org/news/2021-09-productively-wiser.html)).
- **Invention prepares for future learning**; the benefit is invisible on standard tests [V-sec]. Schwartz & Martin 2004, [eScholarship](https://escholarship.org/content/qt78d7k1zs/qt78d7k1zs.pdf).
- **Debrief effects similar in simulated and real settings** [V-sec]. Tannenbaum & Cerasoli 2013, [PubMed](https://pubmed.ncbi.nlm.nih.gov/23516804/).
- **"What decisions they have had practice making"** predicts student performance on authentic problems better than content seen [V]. [PMC8715817](https://pmc.ncbi.nlm.nih.gov/articles/PMC8715817)
- **Far transfer of general training ≈ 0** [V in A]. Sala & Gobet 2017, A §3.7.

### Inferences
- **Shared template.** Make the short exercises and the full projects share one explicit decision template, built from the 29 decisions condensed to about 8–10 for this domain. A full project is then a chain of the same decision types already practiced in isolation. This is "practice the parts in the whole-task frame" (cf. 4C/ID [U, van Merriënboer, not verified]).
- **Rotate the same decision types across subsystems.** Use radar, propulsion, control and EW to create the multiple-context practice that Gentner-style transfer requires.
- **Measure transfer honestly.** Periodically give a mini-project, or a novel decision-forcing case in an *untaught* subsystem. Score it with the same decision rubric, closed-book and without AI help (A §4.3).

### Gaps
- No longitudinal study found linking short judgment exercises to later full engineering-project performance.
- 4C/ID (van Merriënboer) and whole-task-practice evidence were not verified in this session.
