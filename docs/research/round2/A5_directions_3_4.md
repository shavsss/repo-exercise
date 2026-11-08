# A5: two whole-system directions, D3 "Structure Atlas First" and D4 "Dual Track: Fast Read + Deep Forge"

Round 2, track A5. For each direction I write as its advocate and make the strongest case I can. After that I state, with numbers, where each one leaks depth. Throughput numbers come from a reproducible model, `round2/A5_throughput_model.py`. It reads both syllabi read-only and keeps every assumption as a named constant. Run it with `python3 -I A5_throughput_model.py`.

---

## 0. Bottom line

1. **Neither direction finishes both curricula at full depth in 3–4 months at 5 h/day.** The model also gives a hard floor that holds for any design. The core tier has about 1,236 central results (CRs). At ~2,000 words per CR, which is what seven level-2.5 sections need at ~285 words each, that is 2.47 M words. At 175 wpm that is **235 h of reading alone, or 2.7 months** at 4 h/day × 5 days, with no commits, no review and no production. For all tiers the floor is 3.5 months. "A few months" means 5–7, or it means more hours a day. Anyone who promises 3 is cutting depth without saying so.
2. **Central estimates (core tier):** D3 takes **~6.9 months** (6.2–7.9). D4 takes **~6.1 months** (4.8–8.6). Today's page-driven lessons take **~17 months**. For all tiers: D3 ~8.0, D4 ~7.8, today ~25. Both directions get their gain the same way: **the unit of work changes from pages to central results.** That change alone accounts for most of the 2.5–3× speed-up. The two directions differ in what each lesson-hour buys.
3. **D4 covers ground faster, and D3 gives more ownership per hour.** D4's fast track gives coverage, and its forge reaches only ~40–50% of CRs directly (§D4.2). D3's instance lessons cost less because the structure is already owned. D3 is the only design in which "rising cross-domain connections", his top stated priority, happen by construction rather than by decoration.
4. **The two converge.** The best hybrid uses D3's atlas as the spine, D4's depth-dense format for instance lessons, and D4's forge for spikes. At 4 h/day of lessons it reaches the core tier in about 5.4 months (464 h ÷ 20 h/wk ≈ 23 weeks; see §3). That puts it in the D4 band while keeping D3's ownership profile. I recommend the round-2 synthesis test this hybrid.

### Shared accounting (both directions use it)
| Quantity | Value | Source |
|---|---|---|
| Modules | core 353, adv 101, ref 31 (485) | syllabus.json files |
| Main pages | core 16,411; all 24,042 | computed from `sources[].pages`, role=main |
| CRs per module | core 3.5, adv 3.0, ref 1.5 (assumed) | sampled from module titles and tables of contents, e.g. M4.5 FT has ~4–5 and M2.2 radar equation ~3 |
| CRs | core 1,236; all 1,585 | model |
| Depth-dense lesson | ≤2 CRs, every one of the 7 sections present, ~4–4.5k words | V2 §3 + R4 core band |
| Reading speed | 150–200 wpm dense Hebrew | C, R4 |
| Week | 5 lesson days + 1 consolidation day + 1 rest day | V2, R1 |

---

# D3: STRUCTURE ATLAS FIRST

## D3.0 The thesis, argued

There are not 485 different subjects here. There are about 60 structures, each re-derived dozens of times under different names. The radar equation, the sonar equation, the one-way EW link, the SATCOM link budget, the EO/IR range equation, the laser designator budget and Shannon's capacity with path loss are **one structure**: a source spread over a sphere, an aperture, a loss chain, noise kT·B·F, and a threshold. The current syllabus teaches it at least 7 times (L M0.1, M1.4, M2.2, M3.10, M4.7, M10.2, M13.10, plus E M23.5). Kalman filtering appears in E M5.6, E M7.3, L M0.6, L M2.15, L M2.29 and L M5.8. Matched filtering appears in E M7.4, L M2.9 and L M2.12. Exponential/Boltzmann factors run from the diode (E M25.3) and Arrhenius through the atmosphere (E M15.4) to statistical mechanics (E M13.2). The eigenvalue problem shows up as normal modes (E M3.2), buckling (E M16.7), stability (E M5.3), PCA/SVD (E M8.4), waveguide cutoff (E M9.11), quantum energy levels (E M24.11) and Markov stationary distributions (E M7.1).

Each re-teaching today costs a full lesson, and the learner experiences it as "long for nothing" (his words about Gilua). Re-teaching a structure he already owns adds length without adding depth. D3 fixes this at the root: **own each structure once, deeply, and treat each module as an instance.** The instance lesson spends its words on what is genuinely new: the parameters, which assumptions break and what happens then, the numbers, the hardware and practice, the trade-offs, the operational meaning, and the critique.

D3 is not foreign to this repo. **The Gilua syllabus is already built this way.** P0–P3 are the "backbone" (עמוד השדרה), P4–P10 are the "junctions" (צמתים) and P11–P19 are the "bridges" (גשרים). D3 takes that architecture seriously, makes the structures explicit objects with state, and extends the same spine under Lanchester. It also matches two things the learner asked for: **mathematical definitions before examples** (the brief), and **rising level of cross-domain connections**. In D3, every connection is a typed edge between a structure and an instance, so connections cannot stay flat.

## D3.1 The atlas: 64 structures in 8 families (plus a grammar layer)

**Grammar (prerequisite and taught first, not counted as structures):** limits/derivative/Taylor; integrals and multiple variables; complex numbers and phasors; vectors and linear spaces; probability axioms and random variables; logs and dB.

| Family | Structures (id: name) | Typical instances, both apps |
|---|---|---|
| **A. Linear systems** | A1 superposition and LTI/convolution · A2 eigen-decomposition and modes · A3 Fourier and spectral representation · A4 Laplace/z, poles and zeros · A5 sampling, aliasing and reconstruction · A6 projection, least squares and SVD · A7 conditioning and numerical stability · A8 correlation and the matched filter | E P4, P8, M11.5, M23.2; L M0.3, M2.9, M2.12, M2.13, M3.2, M2.30 |
| **B. Dynamics** | B1 first-order exponential, τ · B2 oscillator, resonance, Q · B3 coupled/normal modes · B4 state space · B5 stability (eigenvalues, Lyapunov) · B6 linearization and its limits · B7 rigid-body rotation and frames | E M3.x, M5.3–5.4, M12, M14.5, M19.2–19.6; L M6.1–6.2, M13.13 |
| **C. Feedback** | C1 the loop: sensitivity, gain–bandwidth · C2 Bode/Nyquist margins · C3 fundamental limits (Bode integral, waterbed) · C4 PID · C5 observers/Kalman · C6 LQR/optimal control · C7 guidance as feedback (PN, ZEM) | E P5, M11.4, M12.10, M19.8; L M0.7, M5.4, M5.8, M6.3–6.6, M2.15 |
| **D. Fields and waves** | D1 conservation and flux (divergence theorem, control volume) · D2 potentials and gradient flow · D3 diffusion · D4 wave equation and dispersion · D5 aperture/diffraction (θ≈λ/D) and interference · D6 impedance, reflection and matching · D7 radiation and inverse square · D8 guided modes and cutoff · D9 momentum flux (lift, thrust, drag) | E P9, P10, M13.6, P14, P15, M16.1; L M0.2, M1.1–1.3, M2.4, M3.3, M10.1 |
| **E. Stochastic and inference** | E1 noise (kTB, shot, 1/f, F) · E2 SNR and integration gain (√N vs N) · E3 detection, ROC, Neyman–Pearson, CFAR · E4 Bayesian updating · E5 estimation bounds (CRLB, MMSE) · E6 Markov processes · E7 information and capacity · E8 Monte Carlo · E9 fluctuation/extreme value (Swerling, tails) | E P6, P7, M17.3, M23.3–23.8; L M0.4, M2.5, M2.10–2.11, M3.6, M3.9, M4.3, M5.6 |
| **F. Optimization and decision** | F1 constrained optimization, Lagrange and duality · F2 convexity · F3 gradient descent and learning · F4 dynamic programming/Bellman · F5 expected utility and decision theory · F6 Pareto fronts and performance indices (Ashby) · F7 attrition and force-ratio laws (Lanchester) · F8 search theory (sweep width, Koopman) | E M8.13–8.23, P17, P18, M16.9–16.14, M21.6, M27.5; L M3.11, M4.4, M7.1–7.4, M11.4 |
| **G. Budgets and scaling** | G1 dimensional analysis, π-groups and similarity (Re, Ma, Nu, Bi) · G2 scaling laws (square–cube, power laws) · G3 the link/range budget (radar, sonar, EO, SATCOM, EW) · G4 energy budgets and efficiency limits (Carnot, exergy) · G5 resistance networks (thermal, electrical, fluid analogies) · G6 rocket equation and mass fraction · G7 central-force orbits · G8 Boltzmann factor e^(−E/kT) (diode, Arrhenius, atmosphere) | E M13.x, M14.2–14.4, M15.4–15.16, M25.1–25.5; L M0.1, M1.4, M2.2, M4.7, M6.8, M10.2, M13.4–13.12 |
| **H. Discrete and systems** | H1 complexity and asymptotics · H2 locality and hierarchy (caches, memory) · H3 graphs and flows · H4 queues and Little's law · H5 reliability, redundancy and exponential failure · H6 quantization and discretization (ADC, finite differences, CFL) · H7 requirements flow-down and margins · H8 two-state/quantum superposition | E P20–P22, M10.4–10.8, M11.9, M24.3–24.7, P27; L M7.9, M7.10, M13.17 |

Count: 8 + 7 + 7 + 9 + 9 + 8 + 8 + 8 = **64**. Each structure gets 2–6 atlas lessons, depending on weight: A3 Fourier gets 6, H4 Little's law gets 1. With the grammar layer the atlas is **220–270 lessons** of ~80 min each, drills included. **The atlas absorbs Gilua P0–P10 and Lanchester P0** (138 modules, ~357 core CRs). The atlas lessons *are* those modules, reordered by structure, and Kolmogorov, Feynman, Oppenheim, Åström–Murray, Wasserman, MacKay, Trefethen and Boyd become the atlas's texts. A coverage proof (§D3.2) shows that every CR of those modules lands in some atlas lesson.

### The atlas lesson (what "owning a structure" means)
1. **Concrete opening (concreteness fading).** Three instances from different apps are shown side by side, with numbers. The learner commits a guess about what they share.
2. **Definition** in a `definition` block, general and without examples (rules 5א–5ד).
3. **Derivation skeleton.** Each assumption gets a number (S-A1, S-A2, …). These numbered assumptions become the "assumption register" that every later instance lesson checks.
4. **Invariants and limits:** what the structure guarantees and where it fails (e.g. A1 fails under saturation, B1 under nonlinearity).
5. **Parameter slots and typical numbers** for 6–10 instances, each with its mental derivation (estimation within 10–20%).
6. **Cross-instance table:** the same structure in 6–10 fields, showing what each field calls the parameters.
7. **Critique:** 2–3 real errors of misapplying the structure, e.g. adding noise powers in volts, or using √N integration on correlated clutter.
8. **Keep card**, which becomes the structure's "card" in the atlas and its review item.

### The instance lesson (every module after the atlas parts)
- **Structure recall:** commit-before-reveal. "Which structures? Write the equation skeleton from memory."
- **Parameterize:** what the slots are here, with typical values. The learner estimates first.
- **Assumption delta (the anti-leak section):** each numbered assumption of each structure is checked against this instance and marked *holds*, *bent* or *broken*. Every bent or broken assumption is taught at **full** level-2.5 depth, because that is where this field's own depth lives (range-ambiguous clutter breaks stationarity; the boundary layer breaks inviscid flow; Swerling breaks constant RCS).
- **What only this field has:** hardware, practice, standards, history, operational meaning (Lanchester), and the `today` catalogue.
- **Trade-offs, critique, interview question.**
- **Instance row:** a new row is appended to the structure's cross-instance table, so the atlas visibly grows.

## D3.2 Coverage without depth loss, and where depth leaks
**Guarantee mechanism.** A nightly cloud session builds `atlas/instances.json`. For every module it records the CR list (from source pages and table of contents) and, for each CR, one of: (a) `atlas:<lesson>` (taught there), (b) `instance:<module>/<section>` (taught in the instance lesson), or (c) `delta:<structure>.<assumption>` (taught as a broken assumption). A lint step refuses to mark a module complete while any CR is unmapped or any of its 7 sections is missing. The learner can audit the map, and it doubles as the coverage proof V2 asked for.

**Where depth leaks (honestly):**
1. **Parts that are not structural.** Doctrine (L P12), tank evolution, avionics architectures, VLSI methodology, NASA SE process, mission operations and materials processes: about 25–30% of CRs have little reusable mathematical structure. D3 compresses these by only ~10% (`cd` in the model). The leak risk is that the atlas framing makes them feel second-class and they get skimmed. **Rule:** a descriptive module gets the full V2 lesson. It is never shrunk to look like an instance.
2. **Derivations specific to the instance.** "It's just Fourier" can hide the specific mathematics of the ambiguity function: its volume invariance and its waveform constraints. The assumption-delta section exists to catch this, but it depends on the CR mapping. A missed CR is a silent loss. Mitigation: map CRs from the source text, not from the title, and the learner spot-audits 1 in 10 modules.
3. **Book order is lost for atlas-source modules.** Kolmogorov's narrative arc and Feynman's voice are lost if he wanted to *read those books*. The current rule 8א ("topics, not pages") already accepts this.
4. **Abstraction tax up front.** Months 1–2 are heavy on abstraction for a learner who is weaker in formal math, and they bring less "radar" than he is used to. See §D3.6.

## D3.3 Throughput (model, core tier)
- Atlas: 220–270 lessons × 80 min = **293–360 h**.
- Instance CRs: each CR in a non-atlas module is split into a structural share f, set per part (e.g. radar 0.8, EW 0.8, computer systems 0.2, doctrine 0.1), and a descriptive share 1−f. Words are compressed by cs = 0.30–0.55 on the structural share and cd = 0.05–0.15 on the descriptive share. The result is **270–352 instance lessons** × 55 min.
- One hour a day is reserved for warm-up, structure gym and notebook, so lessons get 4 h/day × 5 = 20 h/week.
- **Core: 540–683 h → 27–34 weeks → 6.2–7.9 months (central 6.9). All tiers: 7.2–9.1 months (central 8.0).**
- Read this honestly. D3's saving shows up late: the atlas months feel slow, and instance lessons then run about 40% shorter than today's. The cs value matters most. If instance compression on structural CRs is only 30%, D3 is the slowest of the four new options.

## D3.4 The day, the week, the month
**Day (5 h, atlas-heavy phase, months 1–2)**
| Block | min | What |
|---|---|---|
| Warm-up | 15 | ≤10 items drawn from structure cards (interleaved: "which structure is this?") |
| Atlas lesson | 80 | One structure segment, with commits |
| Instance flush | 55 | An instance lesson on the structure *just* owned, preferring the other app (Fourier → L M0.3/M2.12) |
| Break | 20 | |
| Structure gym | 30 | Same structure, 5 instances, deterministic numeric items (estimate with a 90% interval) |
| Instance lesson 2 | 55 | |
| Notebook | 25 | Writes the structure page in his summary notebook from memory, then compares |

**Day (instance phase, month 3 on):** warm-up 15 → 4 instance lessons × 55 → gym 20 → notebook 25 (~4.8 h). Roughly one atlas top-up lesson a week, for late structures (H, G8).

**Week:** 5 lesson days. Day 6 is a consolidation day, a "bridge day": one cross-instance case (the same structure in Gilua and Lanchester, e.g. "why does SATCOM jamming obey the same budget as the radar burn-through range?"), spike project work, and an article paragraph. Day 7 is rest. The app ratio is not fixed: D3 schedules by structure, so Lanchester instances follow the Gilua structures they need.

**Month (central plan, core tier):**
| Month | Atlas | Instances (main) | Visible milestone |
|---|---|---|---|
| 1 | grammar, A, B (~70% of lessons) | L P0–P1, E M3 | Link budget is owned: radar, sonar, SATCOM and EW done from one structure card |
| 2 | C, E (~50%) | L P2 (radar, part), P4 EW, P5 nav | Detection + Kalman owned; first spike article |
| 3 | D, F (~35%) | L P2 rest, P3, P6; E P11, P12 | Guidance/feedback owned; monthly oral exam on 2 families |
| 4 | G, H (~15%) | E P13–P16, L P7, P13 | |
| 5–6 | top-ups only | E P17–P19, P23, P24; L P8–P11 | |
| 7 | — | E P20–P22, P25, P27; L P12 (descriptive, full V2 lessons) | Core complete |

## D3.5 Authority
- **Articles:** the structural lens is a genre few writers can produce, e.g. "Why burn-through range, sonar detection range and a drone link's range are one equation, and the three places each breaks." It is hard to copy because it needs both libraries.
- **Interviews:** the best expert questions come from the assumption register: "In your system, which of the five assumptions of the matched filter actually fails?" Experts respect a question that names where *their* field breaks the textbook.
- **Judgment:** checking a claim becomes fast pattern-matching. Any claimed range, rate or time constant can be checked against the structure's scaling within a minute (G1, G2, G3).
- **Risk:** the "analogy merchant", who sees an oscillator everywhere and gets dismissed by specialists. The assumption delta and the numbers on every instance row are what protect against it.

## D3.6 What must be built, and the effort
| Piece | Where | Effort (sessions) |
|---|---|---|
| Atlas factory: 64 structure cards (definition, numbered assumptions, slots, typical numbers, failure modes), built from the atlas-source texts | **Nightly cloud session**: repo + PDF text + Python + Opus, writes to both dbs via ArtifactData | 3–4 |
| CR mapping and coverage map `atlas/instances.json`, plus lint; the learner audits a sample | Nightly cloud session | 2–3 |
| Instance-lesson prompt (structure recall, delta, instance row) and new blocks `structure`, `delta`, `instances` | In-page (`prompt.ts`, `tutor.ts`) in both apps | 2 |
| Atlas screen (map, card, instance table, owned state) | In-page, shared component | 2–3 |
| Structure gym (deterministic numeric items generated per structure, graded locally) | Cloud generates, page grades | 2 |
| **Total** | | **~11–14 sessions**, on top of V2 Phase 0 |

The atlas lives in **both** apps' dbs, keyed by structure id. The nightly bridge (V2 §4) syncs owned state, so a structure owned in Gilua counts in Lanchester.

## D3.7 Failure modes, strongest objection, answer
- **F1. Front-loaded abstraction stalls motivation.** Mitigation: the instance flush every day from day 1, a concrete opening in every atlas lesson, and Lanchester instances in week 1 (the link budget is structure G3, taught in week 1 because his background is strongest there).
- **F2. Wrong structure assignment** (forcing a module into a structure it does not fit). Mitigation: the assumption delta exposes it when most assumptions come out "broken", and the module is then re-classified as descriptive and gets the full lesson.
- **F3. Atlas lessons run long**, repeating today's problem one level up. Mitigation: the same core band (4–5k words) and depth layers on demand.
- **F4. Factory errors propagate.** One wrong structure card contaminates every instance that uses it. Mitigation: each card gets an Opus facts check, a learner review, and an errata log with a "dependents" list for re-generation.

**Strongest objection:** *"Abstraction-first transfer is weak in the research (Gick & Holyoak: people rarely carry a principle into a new context unprompted), the learner is weak in formal math, and real expertise lives in the specifics that don't compress. You pay the atlas cost up front and save little."*

**Answer.** (1) The cited failure is spontaneous transfer from *one* example. D3 teaches every structure on 6–10 instances, with an explicit comparison table and a prompt to compare, which is the condition under which transfer *does* occur (analogical encoding: Gentner, Loewenstein & Thompson). (2) D3 does not claim that the specifics compress. The model compresses only the structural share (45% central) and leaves descriptive modules almost untouched. The assumption delta puts *more* words, not fewer, on the field-specific breaks. (3) The learner asked for definitions before examples, and for cross-domain connections that rise over time. D3 is the design that delivers both by construction. (4) Gilua's own syllabus already assumes it: backbone, then junctions, then bridges.

## D3.8 Two key screens

**Screen 1: the atlas (home page for D3)**
```
+------------------------------------------------------------------+
| אטלס המבנים            בבעלות 23/64   מופעים 141/347   [חיפוש]   |
+------------------------------------------------------------------+
| A מערכות לינאריות  ■■■■■□□□   | G תקציבים וקני מידה  ■■□□□□□□    |
| B דינמיקה          ■■■■□□□    | E הסתברות והסקה      ■■■□□□□□□   |
+------------------------------------------------------------------+
| G3 תקציב קשר/טווח                          [בבעלות ✓]  [חזרה]   |
|  P_r = P_t G_t G_r λ² σ / ((4π)³ R⁴ L)  ~ k T B F · SNR_req       |
|  הנחות: S-A1 מקור נקודתי  S-A2 מרחב חופשי  S-A3 רעש לבן  S-A4 ...  |
|  ┌──────────┬────────┬────────┬────────┬───────────────────────┐ |
|  | מופע     | אפליקציה| R^?   | מספר טיפוסי | הנחה שנשברת     | |
|  | מכ"ם     | L M2.2 | R⁴    | 150 ק"מ     | S-A3 (קלאטר)    | |
|  | סונאר    | L M10.2| R²·α  | 10 ק"מ      | S-A2 (שכבות)    | |
|  | SATCOM   | L M13.10| R²   | 36,000 ק"מ  | —               | |
|  | burn-thru| L M4.7 | R² מול R⁴ | ...     | S-A1            | |
|  | [ ] אופטי EO | L M3.10 | עוד לא נלמד                        | |
|  └──────────┴────────┴────────┴────────┴───────────────────────┘ |
+------------------------------------------------------------------+
```

**Screen 2: the head of an instance lesson (the assumption delta)**
```
+------------------------------------------------------------------+
| L M2.6 קלאטר     מבנים: G3 תקציב · E3 גילוי · A3 ספקטרום        |
+------------------------------------------------------------------+
| ① מהזיכרון: כתוב את שלד G3 ואת תנאי הגילוי    [התחייבות ⏎]      |
| ② הערך לפני שמגלים: SCR טיפוסי לקלאטר קרקע ב-X-band? [__ dB ±__] |
| ③ דלתא בהנחות:                                                   |
|    S-A3 רעש לבן, סטציונרי ........ נשבר  → סעיף מלא (2.5)        |
|    E3-A2 מטרה בודדת בתא ........... מתכופף → סעיף מלא           |
|    A3-A1 סטציונריות ............... נשבר (תנועת אנטנה) → מלא    |
|    G3-A2 מרחב חופשי ............... מחזיק → שורה אחת            |
| ④ מה יש רק כאן: מודלי σ⁰, Weibull/K, MTI, מוסכמות, מקרה אמיתי   |
+------------------------------------------------------------------+
```

---

# D4: DUAL TRACK, FAST READ + DEEP FORGE

## D4.0 The thesis, argued

Two jobs are tangled together in every current lesson: **covering** (meeting each central result once, correctly and completely) and **owning** (being able to rebuild it, estimate with it and judge with it). The current lesson tries to do both by writing more, and it fails at both. It is too long to cover 485 modules, and it is passive, so the learner does not own what he reads. D4 separates the two jobs and gives each its best-fit format:

- **Fast track = coverage.** Depth-dense lessons of 3–5k words, ≤2 CRs each. All 7 level-2.5 sections are present for every CR, at about 285 words per section. Every CR is introduced with commit-before-reveal (predict, then derive, then estimate, then reveal). No padding, no history beyond one line, and depth layers only on click.
- **Forge = ownership.** A smaller daily block where the learner *produces*, always on material the fast track introduced 1–3 days earlier. That gap gives spacing for free, and production gives the generation effect, which round 1 found to be the strongest levers.
- **Review stream = retention.** 20 minutes a day of interleaved items with encompassing credit: a forge task that uses a CR also counts as a review of it (D_landscape).

The argument rests on learning science and on proven formats. The best-replicated finding is that people own what they produce, not what they read (generation, retrieval, the AI-tutor trials in round 1). Any design that tries to make *reading* deep is fighting that finding. D4 stops asking reading to do the owning: reading only has to be complete, correct and compact, and the forge does the rest. It is also the format serious professional learning already uses, such as a medical resident's reading plus rounds, or a pilot's ground school plus simulator. Nobody owns cardiology from the textbook. Everyone covers it from the textbook.

D4 also answers the learner's own complaint directly. The fast track is the "not long for nothing" lesson: every paragraph carries a depth unit. Where he wants more, the forge goes deeper than any lesson could, because he has to rebuild the result himself.

## D4.1 The fast lesson and the forge, concretely
**Fast lesson (≈45 min: ~25 min reading + 8 commits + 10 depth/Explain + keep card):**
for each CR: pre-question (commit) → definition → structure → derivation skeleton with one "your step" (commit) → where the assumptions enter → limits → orders of magnitude (estimate before reveal, commit with interval) → trade-off → same structure elsewhere (1 short paragraph, linked) → critique (one real error) → [Lanchester: operational meaning] → keep card. A lint step checks that every CR has all 7 sections, and the core band is 3–5k words.

**Forge menu** (tasks of 20–30 min each, 3–4 per day; chosen nightly):
| Task | Input | Graded by |
|---|---|---|
| Reconstruction | "Rebuild the CFAR threshold derivation closed-book; mark where the exponential noise assumption enters" | Opus key + checklist of steps |
| Estimate set | 5 Fermi items across yesterday's CRs, 90% intervals | deterministic |
| Design review | A 1-page flawed design or claim (real errata or failures where possible); find and fix the faults | key + list of the real faults |
| Teach-back | Explain to a persona with a planted misconception | rubric + Opus |
| Black box | Hidden τ/gain/RCS in a browser sim; identify it in ≤N probes | deterministic |
| Project step | One step of the spike project (e.g. the link-budget calculator, the tracker) | tests and numbers |
| Article draft | One paragraph or claims table from this week's CRs | fact-check pass |

**Forge priority score** (nightly): `fan_out(CR)` (how many later modules use it) × `spike_weight` × `(1 − proven)` × `days_since_intro∈[1,3]`. The spine and the spikes get forged first. Each task deliberately touches 2–4 CRs (a design review of a SAM radar uses the range equation, detection, clutter and the tracker).

## D4.2 Coverage without depth loss, and where depth leaks
**Guarantee.** Coverage = 100% of CRs at **fast depth**: all 7 sections, committed, with a keep card. This is checked by lint plus a coverage proof per lesson, generated with the plan (a CR list from the source text, each one ticked with a section anchor).

**Where depth leaks (honestly):**
1. **Forge reach is about 40–50% of CRs directly.** At 4 lessons/day × 2 CRs × 5 days, the fast track introduces ~40 CRs a week. Forge time is ~85 min/day ≈ 7 h/week ≈ 15–18 tasks. Each task touches 2–4 CRs, so it reaches ~35–60 CR-touches, or **~50–75% of CRs touched at least once and ~40–50% forged as the primary target.** The rest stay at "read + committed + in the review stream". The coverage map shows this openly in 3 states: *covered*, *forged*, *proven* (proven means passed on a later unannounced retest).
2. **Terse sections for a learner weak in math.** At ~285 words, a derivation section in P0–P3 or P8 may be too thin. Mitigation: those parts run at 1.5 CRs per lesson, and depth layers and Explain stay on click. The model's pessimistic case (55 min/lesson) prices this in.
3. **Cross-domain connections are thinner** than in D3: one linked paragraph per CR. The rise of connections over time comes from the forge (design reviews across fields) and the weekly bridge day, so it is not built in by construction.
4. **Ownership of descriptive material.** Forge priority by fan-out ranks doctrine and history low, so they stay "covered" only. Arguably that is fine for authority, since those are the places where one consults sources rather than derives.

## D4.3 Throughput (model, core tier)
- Fast lessons: 1,236 CRs × (1 − reuse 0.10–0.20) ÷ 2 = **494–556 lessons**.
- 38–55 min each, at 2.75–3 h/day of fast track × 5 days.
- **Core: 313–510 h → 21–37 weeks → 4.8–8.6 months (central 6.1, at 4 fast lessons/day). All tiers: 6.2–11.0 (central 7.8).**
- The spread is wide because everything depends on fast-lesson minutes. At 38 min (4.7/day) the core tier fits in 5 months, which is the only path in this document under 5.5 months. But 4.7 lessons/day is ~19k words/day of dense reading, the top of the band C called sustainable. The **pre-generation factory is mandatory**: at 4–5 lessons/day, a 10–25 min generation wait per lesson would eat 1–2 hours.

## D4.4 The day, the week, the month
**Day (5 h).** The forge comes first, while the learner is fresh. R1 warned that production is more tiring than reading, and the hard block should not go last.
| Block | min | What |
|---|---|---|
| Review stream | 20 | ≤12 interleaved items, typed with confidence; encompassing credit |
| **Forge** | 85 | 3–4 tasks on CRs introduced 1–3 days ago (queue ready from last night) |
| Break | 15 | |
| Fast 1, Fast 2 | 90 | Pre-generated; Gilua or Lanchester, by the dependency planner |
| Break | 15 | |
| Fast 3, Fast 4 | 90 | |
| Close | 10 | Marks "remember this" in the notebook; the summary is written in the forge, not here |

Short day (2 h): review 20 + forge 40 + 1 fast lesson.

**Week.** 5 lesson days. Day 6 is the "forge day": monthly oral exam (week 4), spike project milestone, article draft into a publishable piece, black-box challenge, and the practitioner review packet (monthly). Day 7 is rest. App mix: about 2/3 Gilua and 1/3 Lanchester fast lessons, which matches the core CR ratio of 819 to 417. Lanchester modules are scheduled only after their Gilua prerequisites are covered; the dependency planner reads `prereq` and `sources`.

**Month (central plan, core tier, ~80 fast lessons/month):**
| Month | Fast track | Forge focus | Milestone |
|---|---|---|---|
| 1 | E P0–P5, L P0–P1 | reconstructions of the spine (Fourier, convolution, state space) | pretest baseline vs month-1 retest |
| 2 | E P6–P8, L P2 (radar) | estimate sets + radar design reviews | first article (spike) |
| 3 | E P9–P10, L P3–P5 | black boxes, link/detection project step | oral exam 1 |
| 4 | E P11–P15, L P6–P7 | guidance project | article 2 + practitioner review |
| 5 | E P16–P19, L P8–P11 | teach-backs, cross-domain reviews | oral exam 2 |
| 6 | E P20–P25, P27, L P12–P13 | interview kits, critique drills | core complete; adv tier in month 7–8 |

## D4.5 Authority
- **A portfolio is produced daily.** In 6 months the forge yields about 400 design reviews, reconstructions and estimates, 6–8 article drafts, ~20 teach-back transcripts, and 3–4 project steps per spike. Authority is visible output, and D4 makes output the daily habit, not a weekend extra.
- **Interviews:** every fast lesson ends in an interview question and what a strong answer contains, and the forge rehearses them. A "pre-interview" forge task generates the question set and the predicted answers before a real interview, then logs the gap afterwards.
- **Judgment:** design reviews on real failures train the exact skill of catching errors in AI output, books and engineers. That is level 2.5's critique section turned into practice.
- **Risk:** breadth looks thin outside the forged CRs, and an expert can tell "covered" from "owned". Mitigation: the 3-state map tells *him* where he is thin before he publishes, and articles are allowed only on forged or proven CRs.

## D4.6 What must be built, and the effort
| Piece | Where | Effort (sessions) |
|---|---|---|
| Depth-dense fast format: prompt rewrite (both apps), core band 3–5k, 7-section lint, coverage proof, commit blocks | In-page | 2–3 |
| **Lesson factory:** nightly pre-generation of tomorrow's 4–5 fast lessons + answer keys + facts check into the db; the page reads them. Must be tested against the ArtifactData message size and against whether cloud and page quotas are shared | **Nightly cloud session** | 3–4 |
| Forge queue + priority score + task generators (keys hidden) | Nightly cloud session | 2 |
| Forge workspace (reconstruction editor reusing MathLive from summaries, estimate-with-interval, design-review annotator, teach-back chat, black-box sim) | In-page, shared component | 4–5 |
| Review stream with encompassing credit + 3-state coverage map | In-page + nightly scheduler | 3 |
| **Total** | | **~14–17 sessions**, on top of V2 Phase 0 |

## D4.7 Failure modes, strongest objection, answer
- **F1. The conveyor belt.** Fast lessons are pleasant and the forge is hard, so the forge gets skipped and D4 becomes "shorter lessons". Mitigation: the forge comes first in the day, and its queue is ready before he opens the app. The fast lessons of day *n* unlock after the forge of day *n* has started (a soft gate: one click, "skip today", which is logged and shown weekly).
- **F2. Terse = shallow** for weak-math parts. Mitigation: 1.5 CRs per lesson in P0–P3/P8, depth layers, and the forge reconstruction exposes holes within 1–3 days.
- **F3. Factory dependence.** If the nightly session fails, the day has no lessons. Mitigation: a 2-day buffer, with in-page generation as the fallback.
- **F4. Grading drift.** Forge grading by the same Opus that wrote the lesson is the closed loop R1 criticised. Mitigation: numeric items are graded deterministically, design reviews against *real* fault records, and the oral exam has a blind second grader.

**Strongest objection:** *"'Every depth unit kept' at 285 words a section is depth on paper. The fast track is exposure. Half the CRs never get forged, so in the end you have read 1,236 results and own 600. That is a depth cut wearing a coverage badge."*

**Answer.** (1) Every design faces the same arithmetic. No design forges 1,236 CRs in 6 months at 5 h/day: at 25 min per forge, that alone is 515 h, more than the entire D4 fast track. The only question is whether the gap is *visible* and *chosen*. D4 makes it visible (the 3-state map) and chooses it by fan-out and spike. Today's long lessons hide the same gap behind word count. (2) The comparison is not D4 versus perfect ownership. It is D4 versus long passive lessons, where C estimated 10–35% retention a week later. A committed, keep-carded, spaced CR that is never forged still beats that. (3) Encompassing forge tasks give ~50–75% of CRs at least one production touch. (4) The words were never the depth: the learner said today's 12k-word lessons are long *without* adding depth.

## D4.8 Two key screens

**Screen 1: Today (the dual-track home page)**
```
+------------------------------------------------------------------+
| היום · יום ג'                  רצף 23 · שבוע 9/26 · ליבה 38%      |
+------------------------------------------------------------------+
| ① חזרה (20 דק')     12 פריטים  [התחל]                            |
| ② כור (85 דק')      ← קודם                                       |
|    ▸ שחזור: סף CFAR מהזיכרון (L M2.11)           ~25 דק'         |
|    ▸ סקירת תכן: מכ"ם SAM עם 3 טעויות (M2.2/2.6)  ~30 דק'         |
|    ▸ סט הערכות: 5 מספרים, רווח 90%               ~15 דק'         |
| ③ קריאה מהירה        [מוכנים מהלילה ✓]                          |
|    E M5.6 משקיפים וקלמן · 2 תוצאות · ~45 דק'                    |
|    L M2.15 מעקב · 2 תוצאות · ~45 דק'   (נפתח אחרי תחילת הכור)    |
|    E M5.7 בודה · ~40 דק'      L M5.4 לולאות עקיבה · ~45 דק'       |
+------------------------------------------------------------------+
| מפת כיסוי:  כוסה ████████████░░░░  חושל ██████░░░░  הוכח ███░░   |
+------------------------------------------------------------------+
```

**Screen 2: the forge workspace (reconstruction)**
```
+------------------------------------------------------------------+
| כור · שחזור · L M2.11 CFAR                  ⏱ 18:40  [ספר סגור]  |
+-------------------------------+----------------------------------+
| המשימה:                       | המחברת שלך (MathLive):           |
| גזור את סף ה-CA-CFAR עבור     | 1. רעש אקספוננציאלי: p(x)=…      |
| P_fa נתון, ציין היכן נכנסת    | 2. אומדן הרמה: Z = Σ x_i / N     |
| כל הנחה, ותן ערך מספרי ל-N=16 | 3. ‏P_fa = (1+T/N)^(-N)  ← ?     |
| ו-P_fa=10⁻⁶.                  | 4. T ≈ …   הערכה: [__ dB ±__]    |
|                               |                                  |
| [רמז 1] [רמז 2] (נרשם)        | [הגש לבדיקה]                     |
+-------------------------------+----------------------------------+
| משוב: שלב 3 נכון ✓ · חסר: היכן נכנסת הומוגניות הקלאטר (CFAR loss) |
| מספר: 11.6 dB אמת: 12.3 dB → בתוך 10% ✓ · ביטחון 70% מכויל      |
+------------------------------------------------------------------+
```

---

## 3. Head to head, and what each should steal

| | D3 Atlas | D4 Dual track |
|---|---|---|
| Core tier, central | 6.9 months | 6.1 months |
| All tiers, central | 8.0 | 7.8 |
| Best case (core) | 6.2 | 4.8 (requires 4.7 lessons/day) |
| Where depth is strongest | structures and cross-domain transfer | forged CRs (spine + spikes) |
| Where depth leaks | descriptive modules; missed CR mapping; the first 2 months feel abstract | ~50% of CRs are covered but not forged; terse math sections |
| Rising cross-domain connections | by construction (instance rows) | by forge and bridge day |
| Build | 11–14 sessions | 14–17 sessions |
| Biggest single risk | wrong structure card spreads to every instance | the forge gets skipped and D4 becomes "short lessons" |

**Convergent design (my recommendation for the synthesis):** take D3's atlas as the spine (only the ~40 highest-fan-out structures, ~180 lessons). Write instance lessons in D4's depth-dense fast format, which is shorter still because the structure is owned, plus the assumption delta. Use D4's forge, prioritised by D3's fan-out, for the spikes. A rough calculation: 220 × 80 min + 270 × 38 min ≈ 464 h for the core tier. At 4 h/day × 5 that is ~23 weeks (**~5.4 months**); at 3.25 h/day it is 6.6 months. The point is that it lands in D4's time band while keeping D3's ownership profile. What to test first is the parameter both directions depend on and nobody has measured: **minutes per fast or instance lesson at full 7-section depth** (38 vs 55 changes every result by ~40%). Run one week of real lessons in both formats on adjacent modules (e.g. L M2.10 and M2.11) and time them.

**Unavoidable trade-off, stated precisely.** At 5 h/day, the core tier at full level-2.5 depth needs ≥235 h of reading alone, and 450–600 h with commits and the minimum of production. So "finish both, full depth, ≤4 months" is impossible. "Finish core, full depth, ~5.5–6 months, with ~50% of CRs forged and all of the spikes proven" is achievable. Getting to 4 months requires either ~7 h/day or moving adv and ref to on-demand. The second option is the honest lever: it is a depth *deferral* the learner chooses, not a depth cut.
