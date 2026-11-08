# A6. The project track: projects that teach, build authority and are fun, without eating the course

Track: PROJECTS. Inputs: both `syllabus.json` files (prerequisite graphs and page counts), the existing `shared/scene3d` scenes, round-1 V2 and R4 (time budget). Computations: `round2/a6/closure.py` (prerequisite closure per project) and `round2/a6/calendar.py` (week each project unlocks under two study orders). Inputs to them: `round2/a6/projects.json`.

## 0. Findings up front

1. **Budget.** R4 caps the study week at about 5 h × 6 days = 30 h. Over 26 weeks that is ~780 h, so 10–15% gives **78–117 learner hours** for projects. That pays for **2–3 flagship projects of ~20 h each plus 4–5 small ones of ~6–12 h**, not 15 projects. Of the 19 candidates below, 8 go on the calendar.
2. **Projects need little of the curriculum.** The prerequisite closure of every candidate is ≤ 20% of Lanchester's core pages and ≤ 13% of Gilua's (§1, table). Every project can start in the first third of the course.
3. **The syllabus order pushes projects to the end.** Read in ID order, the PN sim unlocks in week 17, the air-defense salvo model in week 23 and the satellite planner in week 26. The cause is Radar (P2, 1,211 core pages) sitting before everything else. Lanchester's parts form a fan out of P0–P2, not a chain: P6 (missiles) needs only P0 and M2.14, P13's orbit modules need only M0.8, and P7's M7.1–M7.3 need P6 and M2.2 but not P4. **Recommendation: order the Lanchester parts P0 → P1 → M2.1–M2.15 → P6 → M7.1–M7.3 → P13 (orbits) → the rest of P2 → P3/P4 …** No depth is lost; the parts just come in a different order. With that order the projects spread evenly across the 26 weeks (§3).
4. **The rule that makes a project teach: the learner writes the physics and Claude Code writes the plumbing.** If Claude writes the model, the project is a demo he watched, not one he built. In every project the learner writes (a) the model spec as equations, with the assumptions and where they enter; (b) **predictions before each run** with 90% intervals, logged as calibration items; (c) the validation against a worked example from the library book; and (d) the article. Claude Code writes the UI, the plotting and the boilerplate. Only (a)–(d) count as learner hours. That makes the project the generation, retrieval and calibration step that round 1 found missing, so it is not extra time on top.
5. **Publication.** Israel has a military censor whose remit has explicitly covered bloggers and Facebook pages since 2016, and wartime directives (operational matters, defensive preparedness, impact sites). There is also defense know-how export control with a public-domain carve-out, and any secrecy obligations from his own service. Safe framing is possible (§6), but three candidate projects carry real exposure if framed carelessly: the interceptor magazine model, the GNSS interference map and the satellite revisit planner. Each gets a framing rule.

---

## 1. Candidates (19 + a wrapper series)

Abbreviations: **C:** = Lanchester (`library/military`), **E:** = Gilua (`library/engineering`). "Unlock" is the prerequisite closure from the syllabus graph: modules and main-source pages you must have studied first, with the share of core pages in brackets. Hours are learner hours (spec, predictions, validation, writing), excluding Claude Code build time. L/A/J are learning, authority and joy, scored 1–5.

| # | Project | Modules exercised | Unlock C / E | Learner h | Diff. | Deliverable | Runs on | HW cost | L/A/J | Wow for readers / interviewees |
|---|---|---|---|---|---|---|---|---|---|---|
| P01 | **Link-budget lab**: dB arithmetic, one-way link, sensitivity, horizon | C:M0.1, M1.1, M1.3, M1.4; E:M7.7 (Shannon, later) | 5 mods/123 pp (3%) / 0 | 6 | 1 | calculator + article "dB is a weapon" | Artifact (JS) | 0 | 3/3/3 | "Why a drone's video link dies at 8 km and not 80" in one slider |
| P02 | **Detection lab**: Neyman–Pearson → ROC → radar Pd (Swerling 0–4, integration, CFAR loss) | C:M2.3, M2.5, M2.9–M2.11; E:M6.6, M7.4 | 11/338 (7%) / 27/1,096 (9%) | 10 | 3 | interactive ROC/Pd explorer | Artifact | 0 | 5/4/3 | the same curve explains a COVID test, a spam filter and a radar |
| P03 | **Jamming/burn-through planner** (self-screening and stand-off, J/S, burn-through range) | C:M4.7, M4.8, M2.2, M1.4 | 10/223 (5%) / 0 | 6 | 2 | tool + article | Artifact | 0 | 3/4/4 | "how close before the jammer stops working": the 1/R² vs 1/R⁴ crossing, visible |
| P04 | **Lanchester / salvo campaign sim** (square and linear laws, Hughes salvo model, stochastic Monte Carlo, fitting a historical battle) | C:M0.4, M0.6 (+refs B14 ch.5, B15 ch.4, under M12.2); E:M3.1, M6.11 | 2/33 (1%) / 12/475 (4%) | 8 | 2 | sim + article | Artifact | 0 | 4/4/4 | the square law, then the moment it fails against real data (Ardennes / Iwo Jima fits in the literature) |
| P05 | **Layered air defense: salvo, leakage, magazine, cost exchange** (SSKP, shoot-look-shoot, P(zero leakers), inventory depletion) | C:M7.1–M7.4, M11.4, M6.4 (+refs B14 ch.2–4, B15 ch.6–7); E:M6.2, M6.11, M8.15 | 16/522 (11%) / 5/255 (2%) | 20 | 3 | sim + article series | Artifact | 0 | 5/5/4 | the most-asked question in Israel since 2023, answered with a model instead of slogans (needs framing, §6) |
| P06 | **PN guidance + miss-distance analysis** (2D/3D PN, N, τ, g-limit, adjoint) | C:M6.1–M6.5, M6.2; E:M3.1, M5.7, M4.9 | 7/269 (6%) / 24/1,138 (10%) | 12 | 3–4 | sim (extends scene `pn_engagement`) | Artifact | 0 | 5/4/5 | a missile "aims where the target will be" without knowing where it will be |
| P07 | **Kalman tracker on synthetic radar tracks** (α-β → KF → IMM, gating, track loss) | C:M0.6, M2.14, M2.15, M2.29; E:M5.4–M5.6, M7.3 | 7/183 (4%) / 19/834 (7%) | 12 | 3–4 | sim + notebook | Artifact (+Colab optional) | 0 | 5/4/4 | the algorithm behind GPS, Apollo and every radar track, shown fooled by a jinking target |
| P08 | **Satellite pass / revisit / resolution planner** (SGP4 on public TLEs, footprint, revisit over a region, GSD vs altitude) | C:M13.4–M13.6, M13.11, M3.3; E:M2.2 | 15/598 (13%) / 3/59 (1%) | 10 | 2–3 | tool + article | Artifact (satellite.js; TLE snapshot refreshed by the nightly cloud task) | 0 | 4/4/5 | "which satellites can see this place today, and how sharply": the public can't believe it's open data |
| P09 | **SDR, receive only**: ADS-B with dump1090, NOAA/Meteor weather images, the GNSS spectrum | C:M0.5, M1.4, M4.2; E:M4.8, M23.1 | 6/110 (2%) / 19/881 (8%) | 12 | 3 | photo-essay + notebook | hardware + laptop | RTL-SDR v4 + antenna ≈ $40–60 | 4/3/5 | "I pulled a weather satellite image out of the air with a $40 dongle" |
| P10 | **GNSS interference map from public ADS-B** (NIC/NACp drops, à la gpsjam / A05.3) | C:M5.4–M5.6, M8.4; E:M6.4 | 16/457 (10%) / 7/299 (3%) | 12 | 3 | map + article | Colab/cloud session for the data → Artifact | 0 | 4/5/4 | very topical in the Eastern Mediterranean, **but censor-sensitive** (§6) |
| P11 | **Quadcopter attitude control** (rigid body, PID → LQR, sim; optional real drone) | C:M9.6, M0.7; E:M2.5, M5.5, M5.9, M19.2 | 6/207 (4%) / 38/1,543 (13%) | 14 (+10 with HW) | 4 | sim (+ flight video) | Artifact; HW optional | Crazyflie ≈ $200–250 (optional) | 5/2/5 | a drone in the browser that he tuned himself |
| P12 | **Claims checker** for defense news: order-of-magnitude calculators + a public log of checked claims | starts with C:M0.1, M2.2 and grows with every module | 4/102 (2%) / 0 | 2 h setup, then ~1 h per claim | 2 | living page + short posts | Artifact (+`sample` to turn a claim into a calculation) | 0 | 4/5/4 | the authority engine: "the claim says X; physics allows Y; here is the calculation" |
| P13 | **High-energy laser engagement calculator** (diffraction spot, extinction, turbulence, dwell time vs required fluence) | C:M3.3, M3.5, M3.13; E:M9.13, M14.2, M14.10 | 8/332 (7%) / 35/1,379 (12%) | 10 | 3 | tool + article | Artifact | 0 | 4/5/4 | why a 100 kW laser kills a drone at a few km but not a rocket at 20 km, from textbook numbers |
| P14 | **C-UAS kill-chain capstone** (detect → classify → track → engage timeline, Pk chain, cost per kill) | C:M9.7, M7.1, M2.38; E:M6.7 | 24/873 (19%) / 9/352 (3%) | 14 | 3 | sim + capstone article | Artifact | 0 | 5/5/4 | ties detection, tracking and effectors into one number: the probability the swarm gets through |
| P15 | **Ballistic missile trajectory and warning time** (minimum-energy trajectory, flight time vs range, early-warning radar horizon) | C:M6.8, M7.8, M1.3, M13.4; E:M2.2 | 16/653 (14%) / 3/59 (1%) | 8 | 2 | tool + article | Artifact (extends `ballistic_trajectory`) | 0 | 3/4/4 | "why 12 minutes": the number is pure Kepler |
| P16 | **Sonar equation explorer** (transmission loss, frequency, convergence zones) | C:M10.1, M10.2; E:M9.1 | 4/60 (1%) / 16/734 (6%) | 6 | 2 | tool | Artifact | 0 | 3/2/3 | low unless he goes naval |
| P18 | **Logistics as a constraint** (fuel, tonnage and advance rate, Van Creveld cases) | C:M11.7 (+B17); E:M13.15 | 1/32 (1%) / 15/628 (5%) | 8 | 2 | model + article | Artifact | 0 | 3/4/3 | "amateurs talk tactics": with numbers |
| P19 | **FMCW "coffee-can" radar** (MIT OCW design: range and Doppler from a homemade radar) | C:M2.7, M2.20; E:M4.8, M11.5 | 8/299 (6%) / 30/1,414 (12%) | 25 (+soldering) | 4–5 | build + video | hardware + laptop | ≈ $150–350 in parts, or a $10 24 GHz Doppler module for a light version | 5/3/5 | "I built a radar" is the biggest wow, and also the biggest time sink |
| P20 | **RF modulation classifier** on the public RadioML dataset (O'Shea, A01.3) | C:M0.5, M4.3; E:M17.6 | 7/123 (3%) / 37/1,448 (12%) | 12 | 4 | notebook + article | Colab (GPU) | 0 | 4/3/3 | the AI–EW connection, though it's well-trodden ground |
| W | **Public explainer series** "The physics behind the headline": one piece per finished project | all | — | in each project | — | articles + embedded demos | — | 0 | 3/5/4 | the vehicle for authority, not a separate project |

A gloss on the closure numbers: Lanchester's own P0 (M0.1–M0.8) teaches the operational math, so on the Lanchester side most projects unlock after a few hundred pages. The binding constraint is almost always the **Gilua chain** (probability → random processes → state space), which sits behind P02, P06, P07, P11, P13 and P20. That is the argument for doing Gilua P3 → P4 → P6/P7 → P5 early.

## 2. Where each one runs

| Mode | Projects | Why |
|---|---|---|
| **Standalone published Artifact** (React/Canvas/WebGL, no server, its own URL, shareable) | P01–P08, P12–P16, P18 (and P14) | The math is closed-form or a small ODE/Monte Carlo, under ~10⁶ operations per frame. three.js r128 and the `scene3d` engine are already proven. Separate artifacts keep the private lab databases out of anything he shares. |
| **Inside the labs** as a small `scene3d`/2D block in the relevant lesson | toy versions of P02, P04, P05, P06, P07, P08 | Extending existing scenes (`pn_engagement`, `radar_horizon`, `sat_coverage`, `ballistic_trajectory`, `phased_array`, `rcs_plate`) gives the lesson a hook: "this is the toy; your project is the full version". |
| **Artifact with data snapshots** refreshed by the existing nightly cloud session | P08 (CelesTrak TLEs), P10 (aggregated ADS-B integrity grid) | Artifact pages have no internet. The scheduled Claude Code session (Python, repo access) fetches, aggregates and republishes a JSON file. The pipeline already exists for backups. |
| **Python notebook** (Colab, or the cloud session) | P10 raw data processing, P20 (GPU), optional P07 benchmarks | Data volume or GPU. The result is still shown in an Artifact. |
| **Hardware at home** | P09 (RTL-SDR), P11 (optional Crazyflie), P19 (radar build) | Receive-only SDR and indoor flight. No transmitting beyond licence-exempt modules (§6). |
| **Uses in-page Claude (`sample`)** | P12 claims checker | Claude turns a pasted claim into a structured calculation using his formulas. **The page shows the formula and inputs, never a bare verdict.** |

## 3. The six-month calendar (26 weeks, ~10–15% of study time)

The order assumes the Lanchester reordering in §0.3 and Gilua's backbone in syllabus order with P6/P7 (probability, random processes) pulled in right after P4. Unlock weeks come from `calendar.py`. Under the **syllabus order** they are: P01 wk 1.6, P04 3.9, P02 4.2, P07 8.1, P06 17.1, P15 20.5, P05 23.1, P08 25.6. Under a **just-in-time order** (study only the closure) every project unlocks by week 5. The calendar below sits between the two, with the reordering applied.

| Weeks | Project (hours) | Unlocked by | Publishable output |
|---|---|---|---|
| 1–2 | **P12 Claims checker v0 + P01 Link-budget lab** (8 h) | C:M0.1, M1.3, M1.4 | page + post: "Three numbers to check any range claim" |
| 4–5 | **P04 Lanchester / salvo mini** (6 h) | C:M0.4, M0.6; E:M3.1 | article + sim: "The square law, and where it lies" |
| 6–8 | **Flagship A: Radar–EW Budget Lab** (P02 + P03 + horizon; 20 h) | C:M2.2–M2.11, M4.7; E:M7.4 | interactive lab + 2 articles |
| 10–12 | **Flagship B: Track-to-Intercept** (P07 + P06; 22 h) | C:M2.14–M2.15, M6.1–M6.5; E:M5.6, M5.7 | 3D sim + article + notebook |
| 13–15 | **Flagship C: Interceptor arithmetic** (P05, uses P04; 20 h) | C:M7.1–M7.4, M11.4 | sim + 2-part article (framed per §6) |
| 16–17 | **P08 Satellite pass / revisit planner** (10 h) | C:M13.4–M13.6, M13.11 | tool + article |
| 19–21 | **Pick one**: P09 SDR (12 h, ~$50) *or* P13 HEL calculator (10 h) *or* P15 BM warning time (8 h) | as in table | photo-essay or tool + article |
| 22–24 | **P14 C-UAS kill-chain capstone** (12 h; reuses A, B, C) | C:M9.7 (+M7.1) | capstone article + sim; interview kit |
| 25–26 | **Portfolio week** (5 h): claims-checker log, one index page, errata | — | portfolio page |

**Total: 103 learner hours core, plus 8–12 h for the week 19–21 choice = 111–115 h**, inside the 78–117 h band at its upper end. If R4's capacity measurements show less time, drop the week 19–21 slot and fold P04 into Flagship C. That leaves ~88 h (11%).

Calendar rules:
- **Just in time, not before:** start a project in the week after its closure finishes, while the modules are fresh. That is the spacing interval that makes it a retrieval event.
- **Hard timebox:** every project has an MVP at 60% of its budget that is already publishable. The rest is polish. No project spills into lesson days; it uses the weekly consolidation day (V2) plus 2–3 evenings.
- **One project at a time.** P12 is the only standing one, at about 1 h a week per claim.
- **Build time by Claude Code is not learner time.** A spec-first session (learner writes equations, assumptions and test cases) followed by Claude Code building it typically takes 1–3 sessions per project. That falls under the app-building budget, which R4 already found tight. Reuse the scene3d engine and one shared "project shell" (sliders, plot, prediction log, export) so that each new project is mostly a model file.

## 4. How projects feed back into learning

| Channel | Mechanism | Evidence that is external, not the tutor's opinion |
|---|---|---|
| **Mastery evidence** | Each project has a *validation table*: 3–5 worked examples from the library books (e.g. Richards' radar-equation examples in B02, Siouris' PN miss-distance results in B06, Washburn & Kress SSKP / shoot-look-shoot examples in B14, SMAD footprint and coverage examples in B12) reproduced to stated tolerance. | deterministic: either the number matches the book or it doesn't |
| **Calibration** | Before each run he logs a prediction with a 90% interval ("miss distance at N=3, τ=0.5 s against a 5 g weave?"). Each project yields 15–30 items, so 8 projects give ~150–200 items. **That alone exceeds the ~100 items R4 says calibration needs**, instead of waiting until 2027. | deterministic (the sim is the truth, once validated) |
| **Review items** | Each project emits 8–12 cards into his summaries notebook ("remember this" markers, per R4's single-source fix): 3 formulas, 3 numbers with mental derivations, 2 sensitivities ("Pd is most sensitive to …"), 2 failure modes. Project items are spike items, so they get the spaced review R4 reserves for spikes. | retention checks in the warm-up |
| **Cross-domain transfer** | Each project has a required "same structure" panel. Examples: Kalman = least squares (C:M0.6) = Wiener (E:M7.3) = GPS/INS (C:M5.8) = LQR dual (E:M5.5). Neyman–Pearson ROC = medical tests = spam = sonar (C:M10.2). Lanchester ODEs = predator–prey = epidemics (E:M3.1). Salvo leakage = reliability series/parallel (B15 ch.9, E:M27.5). Link budget = sonar equation = optical radiometry (C:M3.4). The bridge log (V2) records each closed connection. | practitioner review |
| **Interview material** | Every project ends with an *assumption ledger*: the 5 assumptions the result is most sensitive to, each turned into an expert question ("my model assumes independent shots; in practice, how correlated are interceptor failures, and why?"). That list doubles as the interview kit for the module (V2 §5). | the interview itself, and corrections received |
| **Critique ("catch")** | Every published claim he checks in P12 is a real-world error-catching item. Tutor-planted errors are not needed. | the claim's later fate or correction |
| **Authority ladder** | Article + live demo per project. A demo that readers can poke is far harder to dismiss than an opinion piece, and it invites expert correspondence (errata are good outcomes: log them). | readers, editors, experts |

## 5. The three best, in detail

Selection: the highest (L+A+J) per hour, coverage of both apps' backbones, and complementarity. A is sensing, B is estimation and control, C is operations research. Together they are also the three candidate spikes from V2.

### Flagship A: Radar–EW Budget Lab ("מעבדת התקציב") — weeks 6–8, 20 h

**Question it answers:** given a radar, a target and a jammer, who sees whom, from where, with what probability, and how confident can we be in the claim?

**Modules exercised:** C:M0.1, M1.1, M1.3, M1.4, M2.2, M2.3, M2.5, M2.6 (light), M2.9, M2.10, M2.11, M4.7, M4.8 (light). E:M6.6, M7.4, M7.2 (noise PSD), M6.2.

**Features**
1. *Range equation panel:* Pt, G, λ, σ, losses, noise figure, bandwidth, integration (coherent / noncoherent). It shows SNR(R) on a dB plot, with every term's contribution as a stacked "budget waterfall" (the dB sum made visible).
2. *Detection panel:* the threshold from Pfa (Neyman–Pearson), Pd vs SNR for Swerling 0–4 (Marcum Q / closed forms for SW1/SW3, numeric for the rest), the ROC family, and cumulative Pd over N scans. CFAR loss for CA-CFAR with N reference cells.
3. *Jamming panel:* self-screening vs stand-off, J/S(R), burn-through range (where S/J crosses the required SNR), and the 1/R⁴ vs 1/R² crossing shown on the same plot.
4. *Horizon and propagation:* 4/3-Earth radar horizon, a two-ray multipath lobing option, reusing `radar_horizon`.
5. *Stealth slider:* σ from 10 m² to 0.001 m² shows the R ∝ σ^¼ law; the "40 dB stealth = 10× less range" result becomes intuitive.
6. *Claims mode:* type "radar X detects stealth fighter at 400 km". The panel shows the parameters needed to make it true (the inverse problem) and whether they are physically plausible.
7. *Prediction log* before each slider experiment; export to the notebook.

**Data:** entirely parametric. Default scenarios use generic textbook parameter sets (B02 examples, Adamy B01/B04 problem values). No real-system specifications are needed or claimed.

**Math he writes:** the radar range equation from first principles (spreading, aperture, noise kTB·F); the NP likelihood-ratio threshold for Gaussian noise; the Rayleigh/chi-square fluctuation models; the J/S equation and burn-through solved symbolically; the inverse problem as a sensitivity (∂ln R / ∂ln x = ¼ for σ, Pt, G² …).

**Milestones**
- M1 (5 h): equations spec plus 5 validation cases from B02/B01 reproduced to 0.5 dB.
- M2 (5 h): detection panel validated against standard Pd tables (B02 ch.15).
- M3 (4 h): jamming and claims mode.
- M4 (6 h): article(s), predictions reviewed, assumption ledger.

**What he learns:** the whole Lanchester P0–P2 core as one connected budget. Detection theory as the shared structure across radar, sonar, IR and medicine. Order-of-magnitude fluency in dB, which is level 2.5's "estimate within 10–20%".

**Publishes:**
- (1) "How far can a radar see? Four numbers that decide it", with the embedded lab.
- (2) "Stealth isn't invisibility: the fourth root", plus a claims-checker entry for a real headline.

### Flagship B: Track-to-Intercept — weeks 10–12, 22 h

**Question it answers:** from noisy radar plots to a hit. Where does the miss distance come from: sensor noise, filter lag, target maneuver or autopilot lag?

**Modules exercised:** C:M0.6, M0.7, M2.14, M2.15, M2.29 (gating), M6.1–M6.5, M6.6. E:M5.4–M5.7 (state space, observers/Kalman, transfer functions), M7.3 (MMSE), M3.1, M4.9.

**Features**
1. *Synthetic sensor:* a target flying straight, turning or weaving; a radar measuring range, azimuth and elevation with σ_R, σ_θ, scan rate and Pd < 1 (missed plots).
2. *Tracker ladder:* α-β, then the constant-velocity KF, then the constant-acceleration KF, then a 2-model IMM. Live covariance ellipses, NIS/NEES consistency plots, the gate and track loss.
3. *Guidance:* PN with N, τ (first-order autopilot), g-limit and seeker noise. True PN vs augmented PN. Fed either truth or the tracker's estimate (the "midcourse on track data" option).
4. *Miss-distance study:* Monte Carlo of 200 runs, with a miss-distance histogram and a breakdown by error source (switch sources on and off). The adjoint result for the miss vs time-to-go of a step maneuver is shown against the Monte Carlo (Zarchan-style, derived from B06).
5. A 3D view extending `pn_engagement`; 2D plots for the analysis.

**Data:** synthetic only. Generic kinematics (e.g. a 300 m/s target at 5–9 g, a 1,000 m/s interceptor, matching the existing scene).

**Math he writes:**
- the discrete KF from the least-squares / MMSE derivation (C:M0.6 → E:M7.3)
- the CV/CA process noise models (Q from white-noise acceleration)
- the PN law and its linearized miss-distance model
- the τ effect: the miss from a target step grows when t_go is comparable to N·τ

**Milestones**
- M1 (5 h): KF spec and its consistency check (NEES within χ² bounds) on straight flight.
- M2 (5 h): IMM vs the weave; predict the track-loss rate first.
- M3 (6 h): PN plus the Monte Carlo; reproduce a B06 miss-distance curve.
- M4 (6 h): write-up and assumption ledger.

**What he learns:** the estimation-and-control backbone of Gilua P5/P7 made concrete. The structure is identical across tracking, GPS/INS (C:M5.8), robotics (E:M19) and economics. He also gets an operational feel for why maneuvering targets, laggy autopilots and sparse revisits hurt intercept.

**Publishes:**
- (1) "The Kalman filter in pictures: from a radar plot to a track".
- (2) "Why a missile misses", using a generic, textbook interceptor.
- A notebook version for technical readers.

### Flagship C: Interceptor Arithmetic — layered defense, leakage, magazines and cost — weeks 13–15, 20 h

**Question it answers:** for a raid of N threats against a layered defense with given SSKPs, doctrines and magazines, what is P(zero leakers), how many interceptors are expended, and how does that change with raid size, decoys and shoot-look-shoot?

**Modules exercised:** C:M7.1–M7.4, M11.4, M6.4, M7.6 (decoys, light). References B14 ch.2–4 (SSKP, shoot-look-shoot, target defense), B15 ch.6–7 (layered defense, penetration probability, MIRV game theory) and B16 for survivability vocabulary. E:M6.1–M6.2, M6.11 (simulation), M8.15–M8.17 (allocation as optimization), M27.5 (decision analysis). P04's Lanchester/salvo mini is reused as the "campaign" layer.

**Features**
1. *Engagement math:* closed-form P(kill) for k shots (independent and correlated failures). Shoot-look-shoot vs shoot-shoot-look. P(zero leakers) for a raid of n with m interceptors (B14 and B15 formulas). Validated against Monte Carlo.
2. *Layers:* 1–3 layers, each with its own SSKP, battle-space time (from P15-style flight time or a simple slider) and doctrine. Leakage propagates through the layers.
3. *Decoys and discrimination:* a discrimination probability turns decoys into wasted shots. This shows the counter-intuitive cost of a poor discriminator.
4. *Magazine depletion and the campaign:* repeated raids over days. Interceptors and threats are described as abstract cost ratios, with an optional production rate. The output is "days until the defense must start rationing" for the abstract parameters, never for real forces.
5. *Allocation optimizer:* how many shots per threat type under a magazine limit (a small integer program / greedy, E:M8.15–M8.17).
6. *Assumption ledger and sensitivity tornado:* which parameter dominates.

**Data:** parameters are dimensionless or from textbooks. Historical, foreign and open cases are allowed only at the level of numbers published in the literature (e.g. the 1991 Patriot debate as documented in open congressional and academic sources). No estimates of Israeli inventories, SSKPs, production rates or deployment.

**Math he writes:**
- the binomial / Poisson leakage model
- the correlated-failure (common-mode) model, with a beta-binomial as the honest extension
- the shoot-look-shoot recursion
- the optimization formulation and its dual reading (shadow price of an interceptor)

**Milestones**
- M1 (5 h): closed forms plus 5 book examples reproduced exactly.
- M2 (5 h): layers, decoys, Monte Carlo agreement within 1%.
- M3 (4 h): campaign and allocation.
- M4 (6 h): two articles; framing review per §6 before publication.

**What he learns:** OR at level 2.5 (the structure of SSKP math, where independence enters and why it is the most dangerous assumption), the trade-offs that drive AMD requirements (C:M7.2) and the link to reliability engineering.

**Publishes:**
- (1) "The arithmetic of interception: why '90% success' and 'everything got through' can both be true", built on generic numbers.
- (2) "Decoys, doctrine and the price of a shot", with the embedded sim.

This is the highest-authority piece he can produce, and also the one that most needs the framing in §6.

## 6. Publication constraints in Israel (general level; not legal advice)

**What applies**
- **The military censor.** The Defence (Emergency) Regulations 1945 give it broad powers. Since 2016 the censor has asserted that sites, blogs and Facebook pages presenting themselves as news must submit security-related material, and it sent such orders to about 30 bloggers and page administrators. The topic list is published, at least partly, on the government censorship site and is not fully public in detail. In wartime, directives require submission of anything on operational matters, intelligence, defensive preparedness and impact sites, including on social media ([Times of Israel 2016](https://www.timesofisrael.com/military-censor-seeks-control-over-blogs-facebook-posts/), [MediaShift](https://mediashift.org/2016/02/israels-military-censor-aims-to-control-online-chatter/amp/), [+972 on the wartime censorship regime](https://www.972mag.com/israel-media-censorship-iran-war/)).
- **Defense export control.** The Defense Export Control Law (2007) controls the transfer of *defense know-how* and *defense services* abroad, which a public article read abroad or a consulting call could arguably touch. The law defines "public domain" as information made available to the public without restrictions on further dissemination, and public-domain information is the safe ground ([MOD unofficial translation](https://exportctrl.mod.gov.il/Documents/חוק%20הפיקוח%20+%20צווים%20+%20תקנות/Defense_Export_Contro_Law.pdf), [DECA](https://exportctrl.mod.gov.il/en)). ITAR is the US analogue. It matters only for US-origin technical data or collaboration with US persons on defense articles, and it likewise excludes public-domain information and fundamental research.
- **His own service.** Secrecy obligations and the Penal Law's provisions on classified information persist after service. **Nothing learned in service goes in, even as "general knowledge"**, and he should not confirm or deny real system values even when readers guess.
- **Radio.** Receive-only SDR of broadcast signals (ADS-B, weather-satellite APT/LRPT, GNSS spectrum) is ordinary hobby practice. Do not transmit (no jamming, no spoofing experiments, not even "tiny" ones), and do not decode or publish private communications (the Wiretapping Law). The 24 GHz/10 GHz Doppler modules used in hobby radar sit in licence-exempt bands, but check the Ministry of Communications rules before buying.

**Safe framing rules, applied to every project**
1. **Textbook physics, generic parameters.** Every number cites a published open source (library books, open papers, congressional and academic reports). The page shows a "sources" panel. "Representative" parameter sets are labelled as such, as `scene3d` already does ("representative, not of a specific aircraft").
2. **Structure, not targeting.** Explain why the result has its shape (the fourth root, independence, t_go vs Nτ). Do not produce answers optimized against a real system ("how many X to saturate Y at Z").
3. **No Israeli specifics** on inventories, interception rates beyond official statements, deployment locations, radar or interceptor performance, production rates or impact locations. When the topic is Israeli air defense, use dimensionless or foreign and historical cases and say so explicitly. This governs Flagship C and P14.
4. **Time-delay and aggregation for data projects.** For P10 (GNSS interference), publish only aggregated, delayed and coarse grids that mirror what is already public (e.g. existing public interference maps). No real-time, no inference of the source or location of Israeli spoofing, and do not run it during active hostilities. For P08 (satellites), use regions and generic sites, not "when can satellite X see base Y". For P09 (ADS-B), no tracking or publishing of military aircraft over Israel.
5. **Pre-publication gate.** A one-page checklist (sources for each number, no item from rule 3, no service-derived knowledge, a P12-style verified-numbers check). When in doubt, submit to the censor. Submission is routine and fast for journalists, and a pre-cleared piece is also a credibility signal. Build that time into the calendar (+1 week before publishing Flagship C, P05, P10 and P14).
6. **Collaborations abroad.** Before co-authoring or consulting with foreign defense entities, check DECA rules. Pure public articles are the low-risk mode.

## 7. What I'd tell the learner in one paragraph

Do 8 projects, not 19. Do them in the week after their prerequisites close, which needs one change to the course: bring missiles (P6) and air defense (M7.1–M7.3) forward right after the radar core. Treat each project as the exam for its modules: you write the equations, the predictions and the validation against the book, and Claude Code builds the page. Three flagships carry the authority, and together they are the three candidate spikes:
- the Radar–EW Budget Lab (sensing)
- Track-to-Intercept (estimation and control)
- Interceptor Arithmetic (operations research)

Each ends in a live demo plus an article, framed as textbook physics on open data, with a censor check before anything touches Israeli air defense.

---
Files: `round2/a6/closure.py`, `round2/a6/calendar.py`, `round2/a6/projects.json` (rerun after any syllabus change: `python3 calendar.py`).
