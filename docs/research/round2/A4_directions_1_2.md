# A4: Two whole-system directions, each argued by its advocate

D1 is the "Concept Engine" and D2 is the "Project Spine". Each one is argued as strongly as I can. Each section ends with what would prove it wrong, and §3 says where the two meet.

---

## 0. The arithmetic both directions must beat

These figures come from the syllabus files (computed on 30.10 from `library/*/syllabus/syllabus.json`, main-source pages only):

| | Modules core / adv / ref | Main pages core / adv / ref | Pages per core module |
|---|---|---|---|
| Gilua | 234 / 66 / 16 | 11,743 / 3,891 / 733 | 50 |
| Lanchester | 119 / 35 / 15 | 4,668 / 2,125 / 882 | 39 |
| **Both** | **353 / 101 / 31** | **16,411 / 6,016 / 1,615** | |

The prerequisite graph already exists, though it is sparse: 402 edges in Gilua and 189 in Lanchester, at module level only.

**Learner hours.** The V2 cap is 5 h/day, 6 study days a week, plus 1 consolidation day, and app-building is capped at about 10%. That gives about **120 h/month for learning** plus about **22 h/month on consolidation days**.

**The page-driven baseline (today's model, even with the V3 fixes).** A lesson covers about 15 pages and takes about 90 min: roughly 10k words at 150 wpm plus the thinking.
- Core: 16,411 / 15 ≈ 1,090 lessons × 1.5 h ≈ 1,640 h ≈ **13.7 months**.
- Everything: about 1,600 lessons × 1.5 h ≈ 2,400 h ≈ **20 months**.

**What "a few months" means in hours.** Four months is about 480 h and six months about 720 h. To finish the core in six months, the system has to turn **about 23 source pages per learner-hour** into level-2.5 mastery. The baseline turns about 10. So any direction that keeps the "one lesson per page range" unit is already beaten on time. The question is where the missing factor of 2.3 comes from, and whether depth gets lost along the way.

---

## 1. D1: "CONCEPT ENGINE" (Math Academy-style)

### Thesis (advocate's voice)

The page is the wrong unit, because the books overlap.
- The radar range equation is the link equation, which is the dB algebra of Lanchester M0.1.
- The matched filter turns up in signals (Gilua P4), radar (Lanchester P2), EO/IR, communications (P23) and ML.
- Kalman appears in control (P5), GNSS (Lanchester P5), missile guidance (P6) and robotics (P19).
- Fourier, Bayes, the Lanchester laws, the Tsiolkovsky equation and the heat equation each have three to five homes.

Teaching by page re-teaches each of them every time a new book reaches it. The learner's own complaint ("terribly long, without adding depth") is what that re-teaching feels like. If the unit is the **central result** (the thing level 2.5 is defined on), each result is taught once and fully, and every later appearance becomes a **delta lesson**: "same structure, these assumptions change, these numbers, this operational meaning". Depth is defined per central result, so a design built on central results is the only one that can *prove* there is no depth loss: every node passes the same seven-section bar and the same mastery check.

### 1.1 The object: one global graph across both apps

- **Node** = one central result, with:
  - `id`, `statement`, the 2.5 skeleton (structure, derivation skeleton with where each assumption enters, limits, orders of magnitude, trade-offs, cross-field structure, critique), and for Lanchester nodes, operational meaning
  - `sources[]` (doc, pages, role), `tier`, `apps[]`
- **Edges**, all first-class:
  - `prereq` (hard)
  - `encompasses` (weighted 0–1: practising B exercises A; this is the Math Academy "FIRe" mechanism)
  - `same-structure` (cross-domain, such as radar detection ↔ hypothesis testing ↔ sonar ↔ medical screening)
  - `used-by` (engineering result → operational result)
- **Node types.** Not everything is a derivation, and pretending it is would be where depth leaks first.
  - **Result node** (~75%): a derivation or law, checked with numeric and structural problems.
  - **Delta node** (~included above): the same result in a new domain, checked with problems in the new domain.
  - **Case node** (~10%): doctrine, history, a system class, an enemy employment pattern (Lanchester P12, M9.1 UAS classes). It is checked with a *decision case* and a written "what would you expect and why", not a number.
  - **Spine essay** (one per part, 42 in total): the narrative a node graph lacks. It covers why these questions arise in this order, what the book's author was building toward, and the Kolmogorov and Feynman "view". It is read once, before the part's first node, and re-read at the part's end with one written reflection.
- **Size (estimate, to be measured in the pilot).**
  - About 4.5 raw central results per Gilua core module and about 4 per Lanchester core module gives about 1,525 raw core nodes. Deduplicating across apps (~20%) and within apps (~10%) leaves **about 1,100 core nodes**.
  - Adv: about 400 raw, about 300 after dedup, because adv overlaps core heavily.
  - Ref modules (31) are attachments to nodes, not lessons, plus about 60 nodes.
  - **Total about 1,460 ± 300 nodes.** That is within the brief's range of 1,000–3,000 and at its low end, because the dedup is real.

### 1.2 The day, the week, the month

**Day (5 h, a fixed loop that the app sequences; the learner presses "next" and does not choose material):**

| min | block | what it is |
|---|---|---|
| 0–15 | warm-up | 8–12 encompassing review items chosen by the scheduler: typed answers with confidence. Most are delta problems that also exercise their parents. |
| 15–150 | 4 node lessons | each node: lesson core of 1,800–2,500 words (12–17 min) → worked example → 4–6 committed problems with faded scaffolding → mastery check of 3 items. Foundation nodes take about 50 min; delta nodes about 25 min. |
| 150–165 | break, then the notebook | the learner writes the summary for the node cluster *from memory*, then compares (the existing `#summary` notebook) |
| 165–270 | 3–4 more nodes, or 1 spine essay + 2 nodes | the frontier moves forward in at most 2–3 active "lanes" (for example Gilua P1 analysis, Lanchester P2 radar, and the cross-lane bridge) |
| 270–300 | quiz / judgment | every ~15 nodes, a 20-min mixed quiz (spaced, unannounced in content); otherwise one estimation or decision item |

That comes to **about 8 nodes on a full day and 3 on a short day.**

**Week:** 6 node days (about 45 nodes) plus 1 consolidation day:
- 1 h of "bridge" work: the learner writes a one-page "same structure" note on the week's best cross-domain edge, which is the seed of an article
- a 1-h placement re-test on the next lane, which can skip nodes he already masters
- spike reading of one primary source
- the article draft

**Month:**
- about 190 nodes, which is about 13% of the graph
- one oral exam per spike lane, "senior engineer" persona, graded against keys
- the monthly coverage report: pages covered by mastered nodes per book and the red list of uncovered page ranges
- one published piece built from that month's edges

**Months 1–6 (core):** P0–P3 Gilua and P0–P1 Lanchester first, because everything depends on them. Then the two apps interleave by lane: signals ↔ radar, control and estimation ↔ guidance, probability ↔ detection and EW, orbits ↔ space. **Months 7–8 (adv):** mostly delta nodes.

### 1.3 Coverage without depth loss, and where depth hides or leaks

**The guarantee mechanism is a page-coverage ledger built by the nightly factory.**
1. Every main-source page range of every module is mapped either to the node or nodes that teach it, or to an explicit tag: `narrative` (served by a spine essay), `data` (tables or design data, attached to a node as a reference card), `example` (becomes a problem in the node's bank), `skip-with-reason` (for example "a 1962 tube-circuit detail, superseded; stated in node X's 'today' section").
2. **Every numbered equation, figure, table and worked example in a main source must appear in the ledger.** Anything unmapped is red. A module counts as "covered" only when its ledger is all green *and* all of its nodes are mastered.
3. A second Opus pass (blind to the first) samples 10% of the ledger against the PDF pages and reports mismaps. Its error rate is published on the coverage page.

That gives a checkable claim: "every result in every book is either a mastered node or deliberately classified". No other design can produce that claim. Today's design can't either, because "done" means "generated".

**Where depth honestly leaks (I name these rather than hide them):**
- **Long derivations as content.** Examples: Maxwell → the wave equation (Feynman II), Kolmogorov's construction of the integral, the Kalman derivation, the SMAD design sequences. A 2,000-word node can hold the *skeleton* and "where the assumption enters", but not the full flow. **Fix:** an optional "derivation node" type, about 4,000 words, that takes the learner through the derivation step by step with "your step" commits. It is used for about 80 nodes. The learner can't buy this fix with fewer words.
- **The author's voice.** Feynman's and Kolmogorov's way of seeing is the content of K1 ch. I and of half of Feynman. The graph flattens it. **Fix:** spine essays, plus "read the original" cards: 3–8 pages of the actual book, guided, for about 60 key passages. The learner reads Feynman himself where Feynman is the point.
- **Doctrine and history** (Lanchester P12, the classes and history modules). These are not problem-shaped. Case nodes with decision cases are an honest fix, but the mastery evidence there is weaker: it is graded by Opus against a key, not deterministically.
- **The "sense of place".** A learner on the frontier of 1,460 nodes can lose the map. The cap on lanes and the module/part view of the same graph (§1.7) are the fix.
- **Dedup errors.** "Gain" (antenna, control, processing), "bandwidth" and "noise figure" mean different things in different books. A merge that is too aggressive teaches a false identity. **Fix:** the factory merges only when the *equations* match, and otherwise it creates `same-structure` edges with an explicit "where the analogy breaks" section. That section is itself level-2.5 "critique".

### 1.4 Throughput (the arithmetic)

Learner time per node: foundation nodes (no parent in the graph, about 35%) take 50 min; delta nodes (about 65%) take 25 min.
- Mean = 0.35·50 + 0.65·25 = **34 min**.
- Plus encompassing review overhead of +15% (FIRe-style credit flow makes most review implicit) gives **39 min**.
- Less diagnostic placement of about 5% (his operational background lets him place out of some Lanchester case nodes and simple delta nodes; little else) gives **≈ 37 min/node**.

| Scope | Nodes | Node hours | + spine essays & derivation nodes | Total | Months at 120 h |
|---|---|---|---|---|---|
| Core, both apps | 1,100 | 678 | 42 + 60 | **780 h** | **≈ 6.5** |
| All tiers | 1,460 | 900 | 42 + 80 | **1,020 h** | **≈ 8.5** |
| Sensitivity: nodes +30% (1,900) | 1,900 | 1,170 | 130 | 1,300 h | ≈ 10.8 |
| Sensitivity: delta nodes at 20 min | 1,460 | 790 | 120 | 910 h | ≈ 7.6 |

That works out to about 21 core pages per learner-hour, roughly twice the baseline. **Where the factor comes from:**
- dedup (~30% of raw results are not taught again)
- delta lessons (65% of nodes cost half)
- reading time cut from about 67 min to about 15 min per unit, which the learner says adds nothing
- no waiting for generation: today that is 10–25 min per lesson, and the factory pre-builds everything

**Honest verdict:** D1 finishes **the core of both apps in about 6–7 months and everything in about 8–9**. It does not fit four months. The only levers left after that are a larger placement credit (which depends on whether he really knows the material, and the diagnostic will tell) or more hours (which V2 forbids).

### 1.5 Authority

- **A verified map instead of a reading list.** "I have mastered 1,100 results, and here is the closed-book evidence per node." Mastery is backed by deterministic numeric items and calibration.
- **Cross-domain edges are his article engine.** A graph with about 1,000 `same-structure` edges is a list of ready theses. Examples:
  - "the Lanchester square law and the radar range equation share one fourth-power structure"
  - "why every detection problem is the same Neyman–Pearson problem, from radar to medical screening"
  - "the Kalman filter in your phone and in a Patriot battery"

  No single-field expert writes these. A T-shaped generalist with a verified graph can.
- **Interviews:** before an interview, the app produces the expert's subgraph, marks the learner's weak nodes on it, and lists the "interview questions + what a strong answer contains" from the practitioner paragraphs.
- **Judgment is D1's weak point.** Judgment means integrating many nodes under uncertainty with incomplete data, and D1 trains components. It gets judgment only from case nodes, the oral exams and the consolidation day. An advocate has to concede that D1 produces *competence and range* faster than D2, and *voice* more slowly.

### 1.6 What must be built

**A. The nightly cloud "lesson factory".** This is scheduled Claude Code sessions with the repo, the PDFs and text, Python, Opus, and ArtifactData:

| Job | Per night | Effort to build |
|---|---|---|
| Node extraction: read a module's source pages → candidate nodes + ledger rows | 20–30 modules | 2 sessions |
| Global dedup and edge proposal across both apps (equation matching + Opus judgment) | incremental | 2 sessions |
| Node lesson + problem bank (8–15 items with keys, numeric ones verified by Python) + 3 mastery-check variants | 10–15 nodes | 2 sessions |
| Verification: a second Opus pass against the source pages; Python checks every number | same nodes | 1 session |
| Ledger audit sample and coverage report | nightly | 1 session |
| State sync: mastery from both apps' dbs → a `peer` doc in each (exists in rough form as the backup task) | nightly | 1 session |

**Pace check:** the learner consumes about 8 nodes/day, so the factory must make at least 10 nodes/night with verification. One session per night is marginal; two parallel sessions are comfortable. **Lead time:** the factory needs about 2 weeks of runs before the learner starts P0 (about 150 nodes ahead) and stays about 1 week ahead after that.

**B. In-page (both apps, `shared/lab`, same code):**

| Component | Effort |
|---|---|
| Graph loader (`graph.json` published with the page; mastery state in db `nodes/<id>`) | 1 session |
| Task selector: the next node on the frontier within the active lanes, due review, quiz trigger | 2 sessions |
| Placement diagnostic, adaptive, about 40 items per lane | 1–2 sessions |
| Node lesson view (reuses the current renderer + think-commit) + mastery check runner + checker against keys | 2 sessions |
| Encompassing review scheduler (repetition credit flows down the `encompasses` edges; a simplified FIRe) | 2 sessions |
| Knowledge map / coverage page (§1.7) | 2 sessions |
| Spine essay and "read the original" card views | 0.5 session |

**Total: about 10 factory sessions and about 11–12 in-page sessions.** That is in line with V2's 23–30 sessions, but it *replaces* most of V2's roadmap rather than adding to it, because the evidence layer, review index and learner model are all built into the graph.

**Unifying the two apps:** both apps keep their identity (look, sound, cursor) as two entrances to one graph. A node mastered in Gilua is credited in Lanchester the same night. Lanchester shows the `used-by` operational nodes and the operational-meaning section, and Gilua shows the field structure.

### 1.7 Failure modes, the strongest objection, and my answer

| Failure mode | Sign | Mitigation |
|---|---|---|
| Bad prerequisite edges → walls of failing checks | mastery-check failure rate > 30% on one node | the factory re-plans; an "insert missing node" job |
| Grind fatigue: no story, no project | short days pile up | spine essays, weekly bridge note, consolidation-day project, visible map growth |
| Gaming the mastery checks | high pass rate, low quiz retention | unannounced mixed quizzes; deterministic numeric items |
| Dedup creates false identities | learner catches "gain ≠ gain" | equation-match rule; "where the analogy breaks" section |
| Opus refusals on Lanchester nodes | refusal log | the small unit helps (one physics result per call); the engineering-language plan already fixed the main cause on 28.10 |
| Factory falls behind | queue < 3 days | second session; the learner can always generate a node in-page as a fallback |

**Strongest objection:** *"You turn Feynman and Kolmogorov into a flash-card deck. Level 2.5 is about the connected argument (how a result is built, where the assumptions enter, how it echoes in other fields), and atomisation destroys exactly that. Math Academy works for school mathematics with crisp problems, not for radar doctrine or Feynman's essays. You will finish the graph and know 1,460 isolated facts."*

**Answer:**
1. A node is a *central result with its seven 2.5 sections*, not a fact. The derivation skeleton, assumptions, limits and critique are inside every node, and the mastery check tests them, including "where does assumption X enter".
2. The connected argument is a first-class object in three places: `same-structure` edges (taught as delta lessons with an "analogy breaks here" section), spine essays per part, and derivation nodes for the about 80 results where the derivation *is* the content.
3. For the about 10% of material that isn't problem-shaped, I concede the weaker evidence and use decision cases.
4. The test is empirical. In the 2-week pilot, run one Gilua part both ways and compare a closed-book reconstruction 10 days later (§3).

If D1 loses that test on the derivation-heavy parts, it falls back to longer derivation nodes *only there*. That costs about 40 h, not the design.

### 1.8 Screens

**Screen D1-a: "Today" + knowledge map**
```
┌─ גילואה · לנצ'סטר ─── היום: 3/8 צמתים ── רצף 12 ימים ── שליטה 214/1,100 ליבה ─┐
│ ▶ הבא:  [P4·S07] מסנן מותאם  — צומת יסוד · ~50 דק'  ← משמש ב: מכ"ם 2.9, EO/IR 3.4  │
│   אחריו: [L2·R12] רווח עיבוד בדחיסת פולס (דלתא, ~25 דק')                            │
│ ⟲ חזרה מובלעת: 9 פריטים (בתוך הצמתים של היום)   ◆ בוחן מעורב בעוד 6 צמתים            │
├──────────────── מפה (נתיבים פעילים: אותות ↔ מכ"ם ↔ הסתברות) ──────────────────────┤
│  P1 אנליזה ████████████ 100%     L0 יסודות ████████████ 100%                       │
│  P4 אותות  ███████░░░░░  58% ──≡── L2 מכ"ם  ████░░░░░░░░  31%   (≡ = אותו מבנה)    │
│  P6 הסתברות █████░░░░░░  41% ──≡── L4 ל"א   ██░░░░░░░░░░  15%                       │
│  כיסוי עמודים: 4,812/16,411 ירוק · 37 טווחים אדומים · דיוק ספר החשבונות 96%        │
└──────────────────────────────────────────────────────────────────────────────┘
```
**Screen D1-b: node lesson with mastery check**
```
┌ מסנן מותאם · S07 ──────────────── מקורות: E05 עמ' 212–226 · B03 עמ' 88–94 ┐
│ 1 מבנה  2 שלד גזירה  3 גבולות  4 סדרי גודל  5 פשרות  6 אותו מבנה  7 ביקורת │
│ ...core text 2,000 words...                                               │
│ ┌ צעד שלך ─────────────────────────────────────────────────────────────┐ │
│ │ איפה נכנסת ההנחה "רעש לבן"? [________________]  ביטחון: ○50 ●70 ○90   │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
│ ── בדיקת שליטה (3) ── 1 ✓  2 ✓  3 ✗ → פריט נוסף, ואז צומת הבא          │
│ ≡ אותו מבנה: גלאי לוח רדאר · סונאר · בדיקת סקר רפואית  [פתח צומת דלתא]   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. D2: "PROJECT SPINE"

### Thesis (advocate's voice)

Authority has never come from finishing a syllabus. It comes from having *built and defended something*. Engineers learn the matched filter properly the week their detector fails, and they remember the Kalman gain because their track wandered. The curriculum is the right *inventory*, but it is the wrong *order* and the wrong *reason*. Give him about 10 ambitious projects that together touch every part of both libraries, and lessons become answers to questions he has already asked. Then the "long for nothing" problem disappears, because every paragraph has a customer. Each project ends as a portfolio piece, a published article and an open model, and those are what experts will judge him by. Projects also give the strongest retrieval practice: using a result to make a design decision *is* the retrieval, the spacing and the transfer, all three at once.

### 2.1 The spine: 10 projects plus a gate project

All projects are **analysis, modelling and trade-study projects** using public textbook methods: budgets, simulations, design reviews. They are not build instructions. This keeps them within what the tutor will write, and it matches what an authority actually produces.

| # | Project | Lanchester parts | Gilua parts | Deliverable |
|---|---|---|---|---|
| 0 | **Gate: "The estimator's toolkit"** (4–6 weeks): a personal calculator of everything (dB, orders of magnitude, an ODE integrator, an FFT, a Monte Carlo) built while learning the spine | P0 | P0–P3, P26 | toolkit + "10 numbers every engineer should know" essay |
| 1 | Ground air-defence radar: a performance study from end to end | P1, P2, P7 | P4, P6, P7, P9, P8 (beamforming), P11 | radar trade-study notebook + article |
| 2 | Interceptor / drone guidance and control simulation | P6, P9 | P2, P3, P5, P15, P19 | 6-DoF-lite sim + "why PN works" piece |
| 3 | Satellite link and constellation design | P13, P5 | P2 (orbits), P23, P13, P14, P16 | link budget + coverage model |
| 4 | SDR receiver and the EW picture | P1, P4 | P4, P7, P11, P23, P22 | signal-chain sim on recorded or public I/Q |
| 5 | EO/IR sensing + a small ML perception model | P3 | P9 (optics), P14 (radiation), P17, P25 (detectors) | detection-range model + trained toy classifier |
| 6 | Lanchester / OR campaign model | P12, P7, P11 | P6, P8 (optimisation), P18, P20, P21 | open campaign model + analysis article |
| 7 | Navigation and sensor fusion box (INS/GNSS) | P5 | P5, P8, P22, P24 (relativistic clock correction) | EKF on public data |
| 8 | Long-endurance electric drone: power, propulsion, thermal, structure | P8, P9 | P12, P13, P15, P16, P11 | sizing tool |
| 9 | Maritime defence and weapon effects | P10, P11 | P10 (field simulation), P16 | engagement model |
| 10 | Capstone: a counter-UAS architecture trade study (systems engineering) | P9, P7 | P27 + all | design-review package, defended orally to a practitioner |

**Rough pull, by an estimate per part:**
- **about 70% of modules** are pulled naturally by some project question
- **about 20%** are "stretch-assigned": attached to a project through an honest side-question. Examples: P24 relativity → the GNSS clock in project 7; quantum → semiconductor detectors in project 5; P20 discrete maths → the graph of the campaign network in project 6.
- **about 10% (about 50 modules)** have no honest home: parts of P24 and P25, P26 enrichment, some P21 algorithms, and some adv data modules. They go into **sweep weeks**.

### 2.2 The day, the week, the month

**Day (5 h):**

| min | block |
|---|---|
| 0–15 | warm-up: retrieval items drawn from the *previous* projects' modules (spacing comes from the project order) |
| 15–30 | **project board**: the next open question, e.g. "Q1.7: what PRF avoids blind speeds for a 300 m/s target at 3 GHz?" The learner writes his *guess and reasoning* first. |
| 30–180 | **2 lessons around the question.** Each is a full level-2.5 lesson on its module (≥4,000-word core, as V2 requires), but framed by the question and ending by answering it with the learner's numbers. |
| 180–240 | **project work**: plug the result into the model, run it, write the decision into the design log (decision, alternatives, the number that decided it, confidence) |
| 240–300 | notebook from memory + one "closure" lesson: the parts of the module the project did *not* need |

**Week:** 5 project days + 1 sweep/closure day (orphan modules and closure lessons) + 1 consolidation day (design review with an Opus "review board" persona against keys; article section draft).

**Month:** finish about 1 project (projects 1, 3 and 6 take about 6 weeks each, the others about 3–4), a design review, a published piece, and a talk with a practitioner about the project ("here is my design: where would your team disagree?").

### 2.3 Coverage without depth loss, and where depth leaks

**Mechanisms:**
1. **An assignment matrix** (module × project, one primary owner per module), built by the factory. It is complete by construction: every module is owned by a project or by a sweep week, and the matrix is shown on the coverage page.
2. **The closure rule.** A module is "closed" only when *all* of its central results are taught at 2.5, not only the slice the project needed. The project lesson covers the slice, and the "closure lesson" covers the rest with the same rules.
3. **Rotation guard.** No module is learned only inside one application. Each closed module's keep card must include one example from a *different* project's domain. This is the cross-domain requirement, enforced.

**Where depth leaks, honestly:**
- **The closure lesson is where depth dies.** Material the project didn't need arrives without a customer, and the learner (and the tutor) will treat it as a chore. It is about 30–40% of each module's central results. *This is D2's real weakness.* Partial fix: closure lessons are framed with the *next* project's question when possible, and otherwise as "what would change your design if…".
- **Mathematical generality.** A project needs Fourier for sampled radar returns. Kolmogorov's Fourier is about function spaces. The general structure is a 2.5 requirement, and a project never asks for it. The gate project and the closure lessons carry it, under pressure.
- **Order damage.** JIT order can violate prerequisites (the radar project needs probability before P6 is done). Fix: the factory inserts the prerequisite modules *before* the question, so the project waits. This is slower, but not shallower.
- **Sweep weeks** are the old page-driven model, kept for about 50 modules. They are not worse than today, but not better either.

### 2.4 Throughput (the arithmetic)

- **Lessons stay full length.** V2's ≥4,000-word core, about 55 min with commits, about 20 pages per lesson. Core modules average 2.4 lessons (about 2.2 h), adv modules about 2 h, ref modules about 1 h (reading).
- **Projects:** about 45 h each × 10, plus the gate project's work of about 30 h, gives **about 480 h**. Of that, about 20% replaces exercise and review time inside lessons (the project *is* the exercise), a credit of about 15% of lesson hours.

| Scope | Lesson hours | − project credit 15% | + project work | Total | Months at 142 h (incl. consolidation day) |
|---|---|---|---|---|---|
| Core | 353 × 2.2 = 777 | 660 | 480 | **1,140 h** | **≈ 8** |
| All tiers | 777 + 202 + 31 = 1,010 | 860 | 480 | **1,340 h** | **≈ 9.5** |
| Optimistic: projects 30 h each | | 660 | 330 | 990 h | ≈ 7 (core) |

**Honest verdict:** D2 is **slower than D1 on coverage** (core about 8 months, everything about 9.5). The advocate's real argument is not speed, for two reasons:
- **Adherence.** A 5-h day that is a project is sustained, while a 5-h node grind often is not. Plans that run at 70% adherence take 1/0.7 of their nominal time, so D1 at 70% takes about 9 months for core and D2 at 95% takes about 8.5. *This is a hypothesis, not data.*
- **Authority output.** By month 8, D2 has 10 portfolio pieces. D1 has a map.

### 2.5 Authority

D2 is the strongest direction on this axis.
- **Portfolio:** 10 public models and studies, each with an article: "I modelled a ground radar's detection envelope against a small drone; here is where the textbook range equation lies." Experts respect a model they can argue with.
- **Interviews as a peer:** he brings his design log. The best interview question is "here is my number for X; what did I miss?", and that is how practitioners talk to each other.
- **Judgment:** the design log is a decision record, with each decision, the number behind it and its confidence. A design review against keys, plus a practitioner review once a month, trains exactly the "critique" and "trade-offs" sections of level 2.5 in their real form.
- **Failure ledger:** each project collects its wrong guesses (Q-guess vs answer). That is calibration data grounded in his own decisions, not quiz items.

### 2.6 What must be built

**Nightly factory:**

| Job | Effort |
|---|---|
| Project charter generator: a tree of questions → modules → the order of lessons and prerequisites; the assignment matrix and sweep list | 2 sessions |
| Lesson pre-generation "around Qn": module sources + question + design-log context; the closure lesson | 1–2 sessions (adapting today's composeLesson) |
| Project model builder: JS calculators and sims published with the page (radar envelope, PN guidance, link budget, Lanchester ODEs, EKF) | **2–4 sessions per project ≈ 25–35 sessions** |
| Design-review keys + review-board persona + practitioner pack | 1 session |

**In-page:** project board (questions, guesses, decisions, the numbers sheet) 2 sessions; design log + export to article outline 1 session; the existing lesson view; coverage matrix page 1 session.

**Total: about 8 sessions of engine plus about 30 sessions of project models.** **This breaks the 10% app-building cap** unless the models are built by the nightly factory, not with the learner. Even then the learner has to review each one: about 1 h per model per week.

### 2.7 Failure modes, the strongest objection, and my answer

| Failure mode | Sign | Mitigation |
|---|---|---|
| Scope creep: "a radar end to end" is a career | project > 1.5× its budget | each project has a fixed question tree (about 25 questions) and a fixed end date; the rest goes to "future work" |
| Building code instead of learning | hours in the model > hours in lessons | the factory builds the models; the learner only sets parameters and makes decisions |
| Closure lessons become a guilt pile | closure backlog > 10 modules | the sweep day is non-negotiable; the closure backlog blocks starting the next project |
| Refusals: weapons framing raises the rate | refusal log | analysis and trade-study framing, textbook-public parameters, the engineering-language plans from 28.10; never "how to build" |
| Projects skew the T to 2–3 spikes | modules done only as stretch | the rotation guard; the matrix shows a per-part "native vs stretch" ratio |

**Strongest objection:** *"Projects pull what they need. The rest of every module becomes a closure chore taught without motivation, and about 50 modules become a sweep, which is exactly today's page-driven model. You haven't solved coverage; you've moved the boring 40% to the end of each module and the boring 10% of modules to Fridays. Meanwhile the project hours make the calendar longer, not shorter."*

**Answer:**
1. Partly conceded: D2 does not finish faster. Its claim is that it finishes *with authority*, and that a design with 95% adherence beats a faster design with 70%.
2. Closure is not unmotivated if it is framed by the *next* project's questions: the project order is chosen so that one project's closure material is the next one's demand (radar closure → EW; guidance closure → navigation).
3. The sweep is about 10% of modules, taught exactly as the improved V3 lessons, so it is no worse than the alternative.
4. Project hours are not overhead: by learning science (generation, retrieval in use, transfer), 45 h of building decisions is the most effective review in the whole plan, and it replaces separate review.

### 2.8 Screens

**Screen D2-a: project board**
```
┌ פרויקט 1 · מכ"ם הגנה אווירית קרקעי ── שבוע 3/6 ── 14/26 שאלות סגורות ──────┐
│ ❓ Q1.15  איזה PRF מונע מהירויות עיוורות למטרה ב-300 מ/ש, ב-3 GHz?        │
│    הניחוש שלך (לפני השיעור): [ 4 kHz ]  ביטחון ○50 ●70 ○90  נימוק: [...] │
│    → שיעורים: L2.13 עיבוד דופלר (מוכן) · G4.06 דגימה ו-aliasing (מוכן)    │
├ יומן החלטות ─────────────────────────────────────────────────────────────┤
│ D9  תדר S, לא X: שגיאת הניחוש −18%, נקבע ע"י גשם בטווח 40 ק"מ ✓          │
│ D10 מספר פולסים מצטבר 16 → Pd 0.9 על RCS 0.01 מ"ר ב-12 ק"מ   [פתח מודל] │
├ כיסוי ───── מודולים בבעלות הפרויקט: 22 · נסגרו 9 · סגירה ממתינה 4 ───────┤
└──────────────────────────────────────────────────────────────────────────┘
```
**Screen D2-b: lesson around a question + the live model**
```
┌ L2.13 עיבוד דופלר · בשביל Q1.15 ────────────┬ מודל: מעטפת גילוי ──────────┐
│ ...full 2.5 lesson (≥4,000-word core)...     │ PRF [ 4.0 kHz ]◄►           │
│ ┌ צעד שלך: v_blind = ? [______] ┐            │ v_blind: 200 מ/ש ✗ (מטרה 300)│
│ └───────────────────────────────┘            │ ▁▂▅█▅▂▁ ▁▂▅█▅▂▁  טווח/דופלר  │
│ סוף השיעור: עדכן את ההחלטה ← D11              │ [רשום החלטה ביומן]           │
│ ⟶ חלק הסגירה של המודול: 2 תוצאות שלא נדרשו    │                              │
└──────────────────────────────────────────────┴──────────────────────────────┘
```

---

## 3. The two side by side, and the experiment that decides

| | D1 Concept Engine | D2 Project Spine |
|---|---|---|
| Core of both apps | ≈ 6–7 months | ≈ 8 months |
| Everything | ≈ 8–9 months | ≈ 9.5 months |
| Coverage proof | strongest (page ledger, per-node mastery) | matrix + closure rule; weak spot in closure lessons |
| Where depth leaks | long derivations, the author's voice, doctrine | general mathematical structure, closure material |
| Authority | range + cross-domain theses; weak voice | portfolio + peer interviews + judgment; T-skewed |
| Build effort | ~22 sessions, mostly engine | ~8 engine + ~30 project models |
| Risk to the learner | grind | scope creep |
| Fits "a few months" | the closest of the two, and still over by ~50% | no |

**Neither direction fits four months at full depth.** Under the 5-h cap, the floor for the core is about 650–780 h, which is 5.5–6.5 months, and only a dedup + delta design reaches it. That is the unavoidable trade-off, stated precisely: time ≥ (number of distinct central results) × (minimum time to master one at 2.5). Only the first factor can shrink without losing depth, and D1 is the design that shrinks it.

**Where they meet (for the synthesis round):** D2's projects running on D1's engine. The graph gives dedup, delta lessons and the ledger. The projects order the frontier, so one project's open questions select which lane of nodes comes next, and the closure problem disappears because "closure" is just the remaining nodes of the lane. The calendar is D1's (about 6.5 months core) plus about 4 lighter projects on consolidation days instead of 10 heavy ones.

**The 2-week pilot that decides between them (falsifiable):**
1. The factory builds the graph and ledger for Gilua P4 and Lanchester P2 (about 50 modules). **Measure:** nodes per module and dedup ratio. If there are more than 7 nodes per module or dedup is under 15%, D1's arithmetic fails.
2. The learner does half of P4 as nodes and half as V3 lessons. After 10 days: closed-book reconstruction + 10 numeric estimation items per half. **Measure:** the minutes per mastered result and the retention for each half.
3. Project 1, questions 1–5, runs over the same material. **Measure:** adherence (planned vs actual hours) and his own rating. If adherence in the node half is ≥ 90%, D2's main argument (adherence) falls away.
