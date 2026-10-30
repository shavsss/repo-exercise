# F. The final curriculum for both apps

Built by `F_build.py` (data in `F_curriculum.json`), report by `F_report.py`. Panels win over the merge; where panels disagree, importance is rounded up and the material is kept. The learner's decisions are applied (section 1). The weapons-effects domain had no panel: all its book material is kept as is, with no additions.

## 1. Decisions applied, and the one structural judgement

- **Region and publication duties are lower priority.** No module for them. Iran and proxies, Israel 2023-25, the Red Sea, tunnels, North Korea, MTCR, censorship, mosaic effect, export control and arms-control regimes become **C-level mentions** inside existing modules (M6.8, M9.9, M7.4, M10.5, M14.2, M14.5). P7's NEW-Q3, NEW-V1 and NEW-C3 are dropped as modules. Deterrence/escalation (S, M6.8) and IHL/Art. 36 (S, with autonomy in M9.3) are kept as items, not modules. The assessment *methods* of NEW-V1 (OOB estimation, net assessment, analytic bias) move to M14.4. Ukraine and Nagorno-Karabakh lessons go to M9.9, classic SEAD cases to M12.1.
- **Cost stays K and is in the plan:** new core module M14.2 (cost definitions, LCC, learning curves, budgets as data, surge, critical materials), with SMAD ch.11 and Ball 1.3 as sources. Cost-exchange and interceptor stocks/production are lessons in M7.4 (AMD, promoted to core) and M14.3 (logistics).
- **Evidence judgment and attrition are not separate modules.** Each item has a host:
  - few-shot test statistics (OR.9.1, ACQ.3.3, P3 success-run, P4 MF.1: one merged item), DT/OT/LFT&E, test realism, combat claims, reading DOT&E/GAO -> **M7.10** (SE lifecycle, promoted ref -> core, now "+ T&E and test evidence");
  - intercept-claim denominators (CRAFT.2.2 + P6b ADD.7) -> **M7.4** (AMD);
  - survivorship/selection bias, wargames as evidence, physics sanity checks of claims -> **M14.1**;
  - salvo model, 3:1 critique, exchange ratios, scouting/VoI, Lanchester laws (moved from adv M12.2) -> **M14.1**.
  - **Judgement call:** Lanchester has no OR/combat-modeling module at all (OR lives only in ref books B14/B15). The plan therefore has exactly one: **M14.1 "Combat modeling"**, which merges P7's NEW-A2 and NEW-A3. Attrition and evidence are lessons inside it, not modules. P7's NEW-A1 (raid, magazine, cost-exchange) is merged into M7.4, NEW-Q2 into M7.10.
- **Test-out is never removal.** Each test-out page gets a short diagnostic: pass -> condensed lesson with the full text one click away plus a delayed recheck; fail -> full lesson. P6a's in-syllabus "not needed" blocks were all flagged test-out by P6a, so they are test-out here, not removed. P3's E11 history is test-out too.

## 2. Totals

Pages are book pages in module sources: main + supp (weighted pages = main + 0.5 supp). Counts are after dedup: the duplicate share of cross-app delta units (32% of K+S in S_mil's flagged units) and of Gilua internal repeats is moved to `CR delta` (taught as a short delta). Lanchester K is on the strict basis (K = CR in S_mil; R10 granularity would be about 1.5x).

| | Gilua core | Gilua adv | Gilua ref | **Gilua** | Lanch. core | Lanch. adv | Lanch. ref | **Lanchester** |
|---|---|---|---|---|---|---|---|---|
| modules | 236 | 66 | 16 | **318** | 131 | 35 | 14 | **180** |
| of which new | 2 | 0 | 0 | **2** | 10 | 1 | 0 | **11** |
| kept pages, main | 10,684 | 2,782 | 309 | **13,774** | 5,323 | 1,846 | 822 | **7,991** |
| kept pages, supp | 1,022 | 11 | 12 | **1,045** | 1,028 | 30 | 32 | **1,090** |
| kept weighted pages | 11,195 | 2,787 | 315 | **14,297** | 5,837 | 1,861 | 838 | **8,536** |
| not-needed pages | 1,388 | 1,204 | 454 | **3,046** | 196 | 241 | 40 | **477** |
| test-out weighted pages | 70 | 45 | 0 | **115** | 1,426 | 737 | 431 | **2,594** |
| ref pages re-hosted into lessons | 0 | 0 | 0 | **0** | 1,074 | 26 | 0 | **1,100** |
| book CR in scope (after dedup) | 1,378 | 338 | 21 | **1,737** | 418 | 86 | 24 | **529** |
| book CR taught as delta | 23 | 6 | 1 | **30** | 76 | 9 | 0 | **86** |
| book K | 1,248 | 306 | 17 | **1,571** | 418 | 86 | 24 | **529** |
| book S | 3,222 | 740 | 66 | **4,028** | 1,350 | 307 | 120 | **1,778** |
| book C | 4,099 | 913 | 103 | **5,115** | 2,759 | 898 | 431 | **4,088** |
| added lesson items | 232 | 27 | 2 | **261** | 293 | 8 | 4 | **305** |
| added CR | 122 | 12 | 1 | **135** | 206 | 2 | 2 | **210** |
| added K | 95 | 8 | 1 | **104** | 189 | 2 | 2 | **192** |
| added S | 351 | 35 | 4 | **389** | 500 | 7 | 5 | **512** |
| added C | 437 | 46 | 4 | **487** | 560 | 11 | 6 | **577** |

- **Kept vs not needed.** Gilua keeps 14,820 pp and drops 3,046 pp (17%). Lanchester keeps 9,081 pp (including 1,100 pp of ref books now taught) and drops 477 pp (6% of its syllabus pages). Outside the syllabus, 441 pp of ref books are not needed ({'B16': 220, 'B14': 21, 'B15': 101, 'B17': 99}).
- **In scope after dedup and additions:** CR 1,872 Gilua + 739 Lanchester = **2,611**, plus 115 taught as cross-app or internal deltas. K/S/C items: Gilua 1,675 / 4,417 / 5,602; Lanchester 721 / 2,290 / 4,664; together **19,370**.
- **Added lesson items: 566** (330 deepen existing lesson, 176 new lesson item, 22 C-level mention, 38 delta link to primary). They come from 1418 merged subtopics; duplicates across panels and apps were merged into one primary item, with a delta link where the other app needs it. Per-item estimates: {'K/missing': [1.5, 1.5, 3.0, 3.0], 'S/missing': [0.8, 0.5, 2.5, 3.0], 'K/partial': [0.6, 0.6, 1.5, 1.5], 'S/partial': [0.3, 0.2, 1.0, 1.5], 'C/missing': [0, 0, 0, 1.0], 'C/partial': [0, 0, 0, 0.5]} (CR, K, S, C; judgement).
- **Test-out:** 115 weighted pp in Gilua, 2,594 in Lanchester; 66 subtopics flagged test-out by panels.

## 3. New and re-hosted modules

### Gilua

| module | tier | status | prereq | weighted pp | book CR | added items (CR) | what changed |
|---|---|---|---|---|---|---|---|
| **M6.2** Random variables and expectation | core | re-hosted | M6.1 | 98 | 25.9 | 1 (0.8) | E05:14/14.2 from M6.9 (Multivariate Gaussian conditioning as core delta in M6.2 (P1)); E05:14/14.3 from M6.9 (Multivariate Gaussian conditioning as core delta in M6.2 (P1)); E05:16/16.1 from M6.10 (Causal confounding as core delta in M6.2 (P1)); E05:16/16.2 from M6.10 (Causal confounding as core delta in M6.2 (P1)) |
| **M9.9** Maxwell's equations, their solutions, EM radiation | core | re-hosted | M9.8, M9.1 | 91 | 20.5 | 1 (0.3) | F1:34/34-1 from M9.14 (F1 34-6/7 Doppler as core delta (P1)); F1:34/34-2 from M9.14 (F1 34-6/7 Doppler as core delta (P1)); F1:34/34-3 from M9.14 (F1 34-6/7 Doppler as core delta (P1)); F1:34/34-5 from M9.14 (F1 34-6/7 Doppler as core delta (P1)); +22 more |
| **M10.10** Finite elements and finite volumes: Galerkin/Ritz, meshing, FEM in practice and how to read an FEM result | core | new | M10.6, M10.1 | 0 | 0.0 | 2 (2.3) | P1 (K, no book teaches FEM/FV; seeds K2 VI/5 Galerkin, K2 VIII/3 Ritz) + P3 (FEM in practice) |
| **M11.1** Circuit foundations and AC circuits | core | re-hosted | M9.8, M4.7 | 98 | 9.2 | 3 (1.2) | E09:APP:A from M11.14 (Oscilloscope / measurement appendix pulled into core M11.1 (P2)); E09:APP:F from M11.14 (Oscilloscope / measurement appendix pulled into core M11.1 (P2)) |
| **M13.19** Power systems and the grid: per-unit and three-phase, power flow, faults and protection, stability and frequency control, grid vulnerability | core | new | M13.17, M12.1 | 0 | 0.0 | 9 (6.0) | P2: largest structural hole in electric power; no Gilua book teaches grids |
| **M23.3** Error-correcting codes and real channels | core | re-hosted | M7.7, M8.1 | 55 | 8.2 | 0 (0.0) | E23:5/5.1 from M23.8 (Shannon-Hartley E23 5.1-5.2 taught in core M23.3 (P2)); E23:5/5.2 from M23.8 (Shannon-Hartley E23 5.1-5.2 taught in core M23.3 (P2)) |

### Lanchester

| module | tier | status | prereq | weighted pp | book CR | added items (CR) | what changed |
|---|---|---|---|---|---|---|---|
| **M4.10** IR countermeasures and defensive aids | core | re-hosted | M3.10, M4.7 | 26 | 0.9 | 3 (2.7) | B16 561-565 (supp): Ball 4.4.1-4.4.3 threat warning, jammers |
| **M6.12** Tactical missile conceptual design (Fleeman B13): drivers, sizing, propulsion trades, heating and domes, cost | core | new | M6.2, M6.4 | 218 | 27.0 | 8 (7.5) | P6b: B13 is in the library but in no module; needs OCR first; B13 19-236 (main): Fleeman ch.1-7 (PDF 19-236), image-only scan -> OCR first |
| **M6.13** Tactical missile design, advanced chapters (Fleeman ch.8-9) | adv | new | M6.12 | 26 | 3.2 | 0 (0.0) | P6b; B13 237-262 (main): Fleeman ch.8-9 (PDF 237-262) |
| **M7.1** The AMD problem and MOEs | core | re-hosted | M2.2, M6.4 | 46 | 5.7 | 8 (6.8) | B15 164-185 (supp): B15 6.1-6.2 layered defense Pk (ref -> supp); B15 206-219 (supp): B15 7.1-7.3 penetration, PRA (ref -> supp) |
| **M7.3** Preliminary design | core | re-hosted | M7.2, M6.6 | 104 | 11.9 | 5 (4.8) | B15 142-163 (supp): B15 5.3-5.5 stochastic attrition, SLS assignment; B14 53-83 (supp): B14 ch.3-4 shoot-look-shoot, salvo Pk (ref -> supp) |
| **M7.4** Trades and allocation + raids, magazines and cost-exchange | core (was adv) | re-hosted | M7.3 | 36 | 1.1 | 9 (4.0) | P6b: B07 ch.7 is the quantitative core of AMD; module also hosts raid/magazine/cost-exchange (P7 NEW-A1, merged here) |
| **M7.10** Systems engineering lifecycle + T&E and test evidence | core (was ref) | re-hosted |  | 20 | 0.3 | 5 (4.1) | Hosts T&E and test evidence (P7 NEW-Q2 merged here: DT/OT/LFT&E, test realism, few-shot statistics, reading DOT&E/GAO) |
| **M8.8** Combat survivability (Ball): susceptibility, vulnerability, kill trees, mission and campaign attrition, historical loss rates | core | new | M0.4, M2.4, M11.4 | 275 | 17.9 | 5 (2.2) | P6a + P7 (P7+.11): Ball ch.1, 5.1-5.2, 6.1-6.2 attached to nothing today; B16 25-105 (main): Ball 1.1 survivability fundamentals, P_S = 1 - P_H P_K|H, campaign survivability; B16 106-141 (main): Ball 1.2 historical loss rates; B16 198-226 (supp): Ball 1.7 conclusions and problems; B16 227-256 (supp): Ball ch.2 aircraft anatomy; +6 more |
| **M8.9** Air campaign capacity: sortie generation, basing and air-base attack, tankers | core | new | M8.8, M9.2 | 0 | 0.0 | 3 (4.5) | P6a + P7 (P7+.1) |
| **M9.9** One-way attack drones, FPV and drone-war economics (Shahed-class, FPV, fiber-optic, mass production, C-UAS cost-exchange) | core | new | M9.7, M9.5, M8.8 | 0 | 0.0 | 11 (8.5) | P6a + P5 + P6b + P7 (Ukraine lessons) |
| **M10.3** Sonar systems and non-acoustic detection | core | re-hosted | M10.2, M2.15 | 24 | 2.4 | 4 (3.7) | B14 146-161 (supp): B14 7.4 barrier patrol, 7.6 moving targets (ASW search) |
| **M12.1** Russian air defense and EW | core | re-hosted | M7.1, M4.7 | 66 | 0.4 | 6 (3.0) | M12.2/2/D5:163-168 from M12.2 (D5 recon-strike complexes pulled into core M12.1 (P7)); M12.2/2/D5:169-174 from M12.2 (D5 recon-strike complexes pulled into core M12.1 (P7)); M12.2/2/D5:175-180 from M12.2 (D5 recon-strike complexes pulled into core M12.1 (P7)) |
| **M12.3** Chinese joint capabilities | core | re-hosted | M7.1 | 46 | 0.2 | 4 (2.4) | M12.4/1/D6:59-63 from M12.4 (D6 PLA system warfare pulled into core M12.3 (P7)); M12.4/1/D6:64-69 from M12.4 (D6 PLA system warfare pulled into core M12.3 (P7)); M12.4/1/D6:70-74 from M12.4 (D6 PLA system warfare pulled into core M12.3 (P7)) |
| **M13.23** Space control: counterspace taxonomy, SDA, RPO, resilience and proliferation, commercial dependence | core | new | M13.5, M13.6, M7.6 | 0 | 0.0 | 7 (4.0) | P6a |
| **M14.1** Combat modeling: model types and MOEs, Lanchester and salvo attrition, exchange ratios, models and wargames as evidence | core | new | M0.4, M7.1 | 122 | 16.1 | 17 (10.7) | P7 NEW-A2 + NEW-A3 merged into ONE module (Lanchester has no OR host; decision: attrition and evidence are lessons, not separate modules). Lanchester laws move here from adv M12.2; B14 84-114 (main): Lanchester laws, moved from adv M12.2 (rule 33: already read -> diagnostic); B15 92-141 (main): Przemieniecki attrition, moved from adv M12.2; B14 8-20 (main): B14 1.2-1.3 model types and shortcuts; B15 22-31 (supp): B15 ch.1 scientific methods; +2 more |
| **M14.2** Acquisition, cost and industrial base: cost definitions, LCC, learning curves, budgets as data, TRL/MRL, surge and critical materials | core | new | M14.1, M7.10 | 62 | 0.3 | 17 (12.3) | P7 NEW-Q1 (cost stays K, decision); B16 139-155 (supp): Ball 1.3.1-1.3.6 DoD 5000 / acquisition deskbook; SMAD ch.11 cost estimating (108 pp of M13.7, image-only) as supp; M13.7 itself stays ref |
| **M14.3** Logistics and sustainment: consumption, LOC capacity, munitions vs stockpiles, readiness, contested and drone-war logistics (van Creveld promoted) | core | new | M14.1 | 224 | 4.4 | 13 (8.8) | P7 NEW-L1; B17 158-204 (main): van Creveld ch.4 Schlieffen logistics (ref -> main); B17 205-333 (main): van Creveld ch.5-8 (Barbarossa, Patton, conclusions; page split approximate, unpaginated e-book) - ch.6 kept as supp share; B17 16-110 (supp): van Creveld ch.1-2 (magazine system, Napoleon) |
| **M14.4** OSINT and capability assessment: imagery, geolocation, verification, ADS-B/AIS, OOB estimation, net assessment, analytic bias | core | new | M3.10, M13.11, M5.5, M8.4 | 0 | 0.0 | 13 (13.0) | P7 NEW-C1 + the method half of NEW-V1 (ADV.4.x); the Iran half is dropped by decision |
| **M14.5** Writing and interviewing as an analyst (capstone): article structure, expert interviews, uncertainty, honest charts, think-tank critique, AI-checking | core | new | M14.1, M14.2, M14.3, M14.4 | 0 | 0.0 | 8 (7.6) | P7 NEW-C2 |

## 4. Added lesson items by host module (what must be taught)

K first. "new" = a lesson item with no book source; "deepen" = the book is partial; "delta" = taught in the primary host, linked here; "C" = a mention.

### Gilua

**M0.2 Atoms in motion and basic physics**
- K delta: Order-of-magnitude physics with fundamental constants (Fermi estimates) -> primary mil:M0.1. Teach: A small set of constants and derived scales (kT at 300 K = 25 meV, eV, Bohr radius, c, solar constant, energy densities of fuels/batteries) drilled for estimation (P1_)

**M1.2 Analysis: integrals, several variables, series**
- S deepen: Improper integrals, Gaussian integral, Gamma function. Teach: Gaussian integral (derivation via polar coordinates); Gamma function as object (Gamma(n+1)=n!, Gamma(1/2)); improper-integral convergence tests in one place (P1_)
- S deepen: Multiple integrals, change of variables (Jacobian determinant). Teach: Change of variables with the Jacobian determinant (polar, cylindrical, spherical); worked use in probability densities and field integrals (P1_)
- S deepen: Implicit and inverse function theorems. Teach: Implicit function theorem statement (when F(x,y)=0 defines y(x)), inverse function theorem and its link to Jacobian invertibility / singular configurations (P1_)

**M2.5 Rotation, center of mass, moment of inertia**
- S deepen: Rotating frames, Coriolis and centrifugal. Teach: Full derivation of Coriolis and centrifugal terms, Foucault pendulum, Earth-frame drift of projectiles/INS, Rossby number (P1_)
- S deepen: Rigid-body rotation stability (intermediate axis, energy dissipation). Teach: Intermediate-axis instability, energy dissipation turning a prolate spinner (Explorer 1), spin stabilization of satellites and projectiles (P1_)

**M3.1 Ordinary differential equations**
- S deepen: Limit cycles, bifurcations, chaos basics. Teach: Chaos basics: sensitive dependence, Lyapunov exponent, Lorenz/logistic map, predictability horizon; bifurcation types (saddle-node, Hopf) named (P1_)

**M3.2 Harmonic oscillator, resonance, transients, linear systems**
- S deepen: Vibration isolation. Teach: Transmissibility curve, isolation above sqrt2 f_n, isolator design for sensors/gimbals (P3_)

**M4.5 The continuous-time Fourier transform**
- K deepen: Time-bandwidth uncertainty. Teach: Explicit statement Δt·ΔB ≥ const (RMS widths), resolution consequences: range resolution c/2B, Doppler resolution 1/T, spectral resolution 1/T; link to Heisenberg; 'you cannot have both' design trade. (P2_)

**M4.6 The discrete-time Fourier transform**
- K deepen: Windowing, leakage, resolution in spectral analysis. Teach: Windowing (rectangular/Hann/Hamming/Blackman), mainlobe width vs sidelobe level, scalloping, resolution = 1/T, leakage; same structure as antenna-aperture taper. (P2_)
- S deepen: DTFT, DFT and their relationship. Teach: DFT as sampled DTFT, circular convolution, DFT-bin spacing 1/(NT). Only a problem (5.54) in E01 and OFDM use in E23 §3.4.4. (P2_)
- S deepen: FFT use in practice (zero-padding, bins, scaling). Teach: FFT cost N log N, zero-padding (interpolates, adds no resolution), bin scaling to amplitude/PSD, coherent vs non-coherent integration gain. (P2_)

**M4.8 Sampling**
- K deepen: Quantization noise, ADC resolution, SNR=6.02N+1.76. Teach: Quantization noise q²/12, SNR = 6.02N+1.76 dB, ENOB, dither, oversampling gain; jitter-limited SNR. (P2_)
- S new: Short-time Fourier transform, spectrograms. Teach: STFT/spectrogram, window-length time-frequency trade, examples (micro-Doppler, speech, chirp). (P2_)
- S new: Bandpass sampling, IF/direct sampling, SDR receiver architecture. Teach: Undersampling bandpass signals, superhet vs zero-IF vs direct RF sampling, image rejection, digital down-conversion. (P2_)

**M4.10 The z-transform**
- S deepen: FIR vs IIR filter design, linear phase. Teach: Design methods: window method, Parks-McClellan/equiripple, IIR via bilinear transform; FIR vs IIR trade (linear phase, stability, order). (P2_)
- S new: Finite word-length effects, limit cycles. Teach: Coefficient quantization, round-off noise, overflow, limit cycles, fixed vs floating point. (P2_)

**M4.11 Line integrals, Cauchy's formula, analytic continuation**
- S deepen: Analytic continuation, Kramers-Kronig/causality relations. Teach: Kramers-Kronig relations: causality forces real and imaginary parts of a response to be linked (dispersion <-> absorption, minimum-phase systems, Bode gain-phase) (P1_)
- S new: Laurent series, residues, residue theorem. Teach: Laurent series, residue theorem, inverse Laplace/Z by residues, evaluating real integrals by contours (one or two examples only) (P1_)

**M5.2 System modeling and examples**
- S deepen: System identification (step tests, frequency response, ARX). Teach: Step-test fitting (FOPDT), frequency-response measurement, ARX/least-squares identification, persistent excitation, validation. (P2_)
- S new: Analogies across domains (bond graphs, effort/flow). Teach: Effort/flow analogies across electrical, mechanical, hydraulic, thermal domains (force-voltage analogy, impedance in each domain), bond-graph idea, energy-port modelling. (P2_)

**M5.6 Output feedback, observers, Kalman filtering**
- S deepen: Extended and unscented Kalman filters. Teach: EKF linearization, failure modes (inconsistency), UKF sigma points. (P2_)
- S delta: Inertial sensor error models: bias, scale factor, angle/velocity random walk, Allan variance -> primary mil:M5.6. Teach: Error budget growth (position error ∝ t², t³), grades of IMU (consumer→navigation→strategic), Allan plot reading. (P2_)
- S new: Filter tuning, consistency checks (NEES/NIS), divergence. Teach: Innovation whiteness, NEES/NIS tests, Q/R tuning, divergence and fixes; process-noise as modelling-error knob. (P2_)

**M5.9 PID control**
- K deepen: Digital control: sampling effects, discretization, latency. Teach: Sampling-rate rules (10-30× bandwidth), ZOH ≈ half-sample delay → phase loss, Tustin discretization, computational latency as delay margin consumer, quantization in loop. (P2_)

**M5.10 Frequency-domain design, loop shaping, root locus**
- S deepen: Sensor noise and filter placement in loops. Teach: Noise-to-control-signal transfer CS, derivative filtering, sensor bandwidth vs loop bandwidth, placement of filters and the phase they cost. (P2_)

**M5.11 Robust performance**
- S deepen: LQG and its lack of guaranteed margins. Teach: Doyle's result: LQG has no guaranteed margins; loop transfer recovery. (P2_)
- S deepen: Robust control: H-infinity, mu concept. Teach: H∞ as worst-case gain minimization, structured uncertainty/μ concept. (P2_)

**M5.12 Fundamental limits: Bode's integral**
- S deepen: Time delay in loops: Padé, Smith predictor, delay as bandwidth limit (ωc < ~1/τ). Teach: Smith predictor; rule-of-thumb bandwidth limit from delay stated explicitly. (P2_)

**M5.13 Architecture and system design**
- S deepen: MIMO control and interaction (RGA). Teach: RGA, decoupling, MIMO directionality (singular values). (P2_)
- S deepen: Model predictive control. Teach: MPC as constrained QP over horizon, constraints handling, computational cost, stability via terminal cost. (P2_)
- S new: Observability-based failure detection and FDIR. Teach: Residual generation, analytic redundancy, voting, FDIR architectures in aircraft/spacecraft. (P2_)
- C C: Human-in-the-loop control and pilot-induced oscillation. Teach: Crossover model, PIO cases. (P2_)

**M6.2 Random variables and expectation**
- S new: Reliability mathematics: exponential/Weibull failure, MTBF, series/parallel and k-of-n systems. Teach: Hazard rate, bathtub curve, Weibull, availability, redundancy math and common-cause failure (P1_)

**M6.3 Inequalities and convergence**
- K new: Heavy tails, power laws and failure of Gaussian intuition (merged: ADD:MF.3 (P4_)). Teach: Power laws and Pareto tails, infinite variance, failure of CLT and sample means, tail index estimation, log-normal vs power law, consequences for risk, reliability and data claims (P1_)
- S new: Extreme value statistics. Teach: Distribution of the maximum of n samples, Gumbel/Frechet/Weibull, return periods and design loads, weakest-link (Weibull) strength (P1_)

**M6.4 Statistical inference, the cdf, the bootstrap**
- K new: Measurement uncertainty (GUM), Type A/B, propagation (merged: P1:add.3 (P1_), M:F.9.4 (P4_)). Teach: GUM: Type A/B uncertainty, combined standard uncertainty by first-order propagation (RSS of sensitivities), coverage factor k=2, correlated inputs; ties to error budgets (P3_)
- S deepen: Descriptive statistics, robust measures (median, MAD). Teach: Median, quantiles, MAD, breakdown point, outlier diagnosis, why the mean misleads with skew (P1_)
- S deepen: Calibration and traceability. Teach: Traceability chain to SI, calibration intervals, calibration vs adjustment (P3_)

**M6.5 Parametric inference**
- K deepen: Fisher information and Cramer-Rao bound (merged: P2_:Estimation accuracy limits: Cramér-Rao b (P2_)). Teach: Cramer-Rao bound stated and derived in sketch; Fisher information as curvature; CRB for range/bearing/frequency estimation as a sanity check on claimed accuracies (P1_)
- K delta: First-order uncertainty propagation (linear RSS, covariance propagation J P J^T) -> primary eng:M6.4. Teach: RSS for independent errors, covariance propagation, error budgets, when linearization fails (go Monte Carlo) (P1_)

**M6.6 Hypothesis testing and p-values**
- S new: Design of experiments (factorial, blocking, randomization). Teach: Randomization, blocking, factorial and fractional-factorial designs, interactions, power and sample size, response surfaces (P1_)
- S new: Statistical process control, capability Cp/Cpk. Teach: Control charts, common vs special cause, Cp/Cpk and sigma levels, link to tolerancing and yield (P1_)
- S new: Experimental design for engineering tests. Teach: Designing a test campaign: factors/levels, factorial and fractional designs, randomization/blocking, how many trials for a given confidence (success-run R^n) (P3_)

**M6.11 Simulation methods**
- K delta: Uncertainty quantification and sensitivity analysis -> primary mil:M14.1. Teach: Uncertainty propagation (linear RSS and Monte Carlo), global sensitivity (Sobol/tornado), aleatory vs epistemic, model-form uncertainty (P1_)
- S deepen: Operations research basics: queues, inventory, scheduling. Teach: Queueing (M/M/1, Little's law, utilization blow-up 1/(1-rho)), inventory (EOQ), scheduling basics (P3_)

**M7.1 Random processes and Markov chains**
- S deepen: Poisson process and queueing basics (Little's law). Teach: Little's law L = lambda W, M/M/1 waiting time blow-up near utilization 1, Erlang intuition (P1_)
- S deepen: Queueing in networks. Teach: Little's law, M/M/1 delay 1/(μ-λ), utilization knee. (P2_)

**M7.2 Power spectral density**
- S deepen: Correlation and spectral estimation (periodogram, Welch). Teach: Periodogram variance does not shrink with N; Welch/Bartlett averaging; resolution vs variance trade; parametric (AR) estimation. (P2_)

**M7.3 Probabilistic models, MMSE estimation, Wiener filtering**
- S deepen: Adaptive filters (LMS, RLS). Teach: LMS (stochastic-gradient Wiener), RLS, convergence/misadjustment trade; adaptive noise cancelling, equalizers. (P2_)

**M7.4 Hypothesis testing and signal detection**
- K delta: Estimation accuracy limits: Cramér-Rao bound, σ ≈ resolution/√(2·SNR) -> primary eng:M6.5. Teach: CRB for time delay/frequency/angle, link resolution vs accuracy, SNR scaling. (P2_)

**M7.7 The noisy channel and Shannon's coding theorem**
- S deepen: Rate-distortion theory. Teach: Rate-distortion function R(D), Gaussian source R(D)=½log(σ²/D), lossy compression limits (images/video bandwidth for ISR). (P2_)

**M7.12 Monte Carlo methods**
- S deepen: Particle filters. Teach: Bootstrap particle filter, resampling, degeneracy, when to use (multimodal, non-Gaussian). (P2_)

**M8.4 The singular value decomposition**
- S deepen: PCA and its link to SVD. Teach: PCA as variance-maximizing projection, its link to SVD/eigendecomposition of covariance, explained variance, whitening. No book derives PCA. (P4_)

**M8.10 Iterative methods: Arnoldi, GMRES, conjugate gradients**
- S deepen: Sparse and structured matrices (banded, Toeplitz, circulant). Teach: Toeplitz and circulant structure, diagonalization of circulants by the DFT, banded storage and fill-in, cost scaling O(N) vs O(N^3) (P1_)

**M8.12 Approximation methods and computing techniques**
- S new: Perturbation methods: regular and singular perturbation, boundary layers, multiple scales. Teach: Small-parameter expansion, when it breaks (singular), boundary-layer idea, secular terms and multiple scales; examples: drag boundary layer, weakly nonlinear oscillator, two-state perturbation (F3 9-5) (P1_)

**M8.13 Calculus of variations and the principle of least action**
- S deepen: Optimal control, Pontryagin principle. Teach: Calculus-of-variations to optimal control, Pontryagin/Hamiltonian, bang-bang, Bellman/DP link. (P2_)

**M8.19 Approximation and fitting**
- K deepen: Ill-posed inverse problems: deconvolution, resolution limits, regularization. Teach: Why inversion amplifies noise (small singular values), resolution vs noise trade-off, L-curve/Tikhonov, super-resolution claims critique (P1_)

**M8.22 Unconstrained and equality-constrained minimization**
- S deepen: Derivative-free and global methods (GA, simulated annealing, Bayesian opt). Teach: Bayesian optimization/surrogate models, Nelder-Mead, CMA-ES, when derivative-free is the right call (P1_)

**M9.2 Vector calculus of fields**
- S deepen: Curvilinear coordinates (cylindrical, spherical) operators. Teach: Grad/div/curl/Laplacian in cylindrical and spherical coordinates, scale factors; when to use symmetry coordinates (P1_)

**M9.9 Maxwell's equations, their solutions, EM radiation**
- S deepen: Radiation from dipoles, antenna basics. Teach: Antenna gain/directivity, effective aperture, reciprocity, Friis (P1_)

**M9.13 Interference, diffraction, polarization**
- K deepen: Superposition, interference, coherence. Teach: Coherence time/length, temporal vs spatial coherence, linewidth relation, partial coherence (van Cittert-Zernike idea) (P1_)

**M9.14 Refractive index, scattering, reflection, relativistic radiation**
- K deepen: Scattering regimes (Rayleigh, resonance/Mie, optical) and the cross-section concept. Teach: Size/wavelength regimes, lambda^-4 law, resonance region, geometric limit; cross section as the universal link (radar RCS, atmospheric attenuation, particle interactions) (P1_)
- S deepen: Attenuation and absorption in media (Beer-Lambert, atmospheric windows). Teach: Exponential attenuation law, optical depth, atmospheric transmission windows (IR, mm-wave), rain attenuation idea (P1_)

**M10.1 Partial differential equations of mathematical physics**
- K deepen: Nondimensionalization of PDEs (merged: P1:add.1 (P1_)). Teach: Systematic nondimensionalization, Buckingham Pi, reading dimensionless groups (Re, Pe, Bi, Ma, Strouhal) as ratios of effects, scale models (P1_)
- S deepen: Classification: elliptic, parabolic, hyperbolic and what each means physically. Teach: Explicit elliptic/parabolic/hyperbolic classification and what each means for information propagation, BCs and numerics (P1_)
- S delta: Weak/variational formulation (basis of FEM) -> primary eng:M10.10. Teach: Weak form derivation, Galerkin with local basis -> FEM link (P1_)

**M10.4 Finite differences: vibration ODEs**
- K deepen: ODE integrators: Euler, RK, implicit, stability regions. Teach: Stability regions in the complex plane, adaptive step-size (RK45 error control), stiffness (see 3.10), symplectic vs dissipative integrators for long runs (P1_)
- S deepen: Stiff ODEs (concept). Teach: Stiffness concept: widely separated time constants, explicit step limited by fastest mode, implicit methods; examples (chemistry, circuits) (P1_)
- S deepen: SDOF and MDOF vibration, modes. Teach: Structural MDOF: mass and stiffness matrices, generalized eigenproblem, modal superposition, effective modal mass; frequency estimates f ~ (1/2pi) sqrt(k/m) for beams/plates (P3_)

**M10.7 Advection-dominated equations and nonlinear problems**
- S deepen: Conservation-law form, fluxes, shocks (intro). Teach: Conservation form u_t + f(u)_x = 0, characteristics crossing, shock speed (Rankine-Hugoniot), why conservative schemes (P1_)

**M10.8 Truncation error analysis**
- K deepen: Approximation hierarchy: when to linearize, lump, neglect. Teach: Explicit approximation hierarchy as a cross-domain lesson: small-parameter identification, when linearization fails, lumping criteria (Bi, Kn, quasi-static), neglect checks (P3_)

**M10.10 Finite elements and finite volumes: Galerkin/Ritz, meshing, FEM in practice and how to rea**
- K new: Finite element method concepts (merged: E:Structures a|4.7 (P3_), E:Mathematics |4.9 (P1_)). Teach: Weak form, basis functions and assembly, stiffness matrix, h/p convergence, element quality and locking, singularities and mesh refinement, reading FEM results critically, verification (P1_)
- S new: Finite volume method and conservation. Teach: Integral conservation form on cells, fluxes, upwinding, why CFD uses FV (P1_)

**M11.1 Circuit foundations and AC circuits**
- K deepen: KCL, KVL, node and mesh analysis. Teach: Systematic node/mesh analysis (matrix form), superposition of sources; E09 ch.1 is missing from the PDF. (P2_)
- S deepen: Power in AC: real, reactive, apparent, power factor. Teach: Real/reactive/apparent power, power factor, complex power S=VI*; E09 §1.x 'power in reactive circuits' lives in the missing chapter 1. (P2_)
- S deepen: Reading datasheets and specifications critically. Teach: Critical datasheet reading as a skill: typical vs guaranteed, test conditions, derating curves, marketing specs (e.g., peak vs continuous thrust/power), installed vs uninstalled performance (P3_)

**M11.6 Voltage regulators and power circuits**
- S deepen: Electronics reliability: failure rates (FIT/MTBF), Arrhenius acceleration, derating, bathtub curve. Teach: Arrhenius rule (×2 per ~10°C), derating practice, MIL-HDBK-217 critique. (P2_)

**M11.7 Precision circuits and low-noise techniques**
- K deepen: Component tolerances, worst-case and Monte Carlo circuit analysis. Teach: Monte Carlo/statistical tolerance analysis, root-sum-square vs worst case, yield; design corners. (P2_)

**M11.9 Digital meets analog: converters**
- S new: Oscillator phase noise, jitter and their system effects (Leeson; reciprocal mixing; ADC jitter-limited SNR; Do. Teach: dBc/Hz spec, integrated jitter, SNR_jitter = −20log(2πf·σt), effect on MTI/coherent radar. (P2_)

**M11.11 High-frequency and high-speed techniques**
- S deepen: Maximum power transfer and impedance matching. Teach: Maximum power transfer theorem (conjugate match) vs. efficiency, matching networks, VSWR loss. (P2_)
- S deepen: RF electronics: mixers, LNAs, nonlinearity (IP3), dynamic range. Teach: IP3/intermodulation, 1-dB compression, spurious-free dynamic range, LNA noise/linearity trade. (P2_)
- S deepen: RF power amplifiers: classes A/B/C/D/E/F, efficiency vs linearity, GaN PA, Doherty. Teach: Efficiency per class, linearity trade, PA in AESA T/R modules. (P2_)
- S new: Two-port networks and S-parameters. Teach: Two-port parameters (Z/Y/h), S-parameters as wave ratios, |S21| gain, return loss/VSWR. (P2_)
- C C: Power integrity and decoupling (PDN impedance, ground bounce). Teach: Target impedance, decoupling hierarchy. (P2_)

**M12.3 Electric motors: the basics**
- K deepen: Energy/co-energy method for force and torque. Teach: Energy/co-energy, F = ∂W'/∂x, reluctance force/torque, why force density ~B²/2μ0 (magnetic pressure). (P2_)
- S deepen: Core losses: hysteresis and eddy; lamination. Teach: Steinmetz loss scaling (∝f·B^n hysteresis, ∝f²B²t² eddy), lamination thickness vs frequency, ferrites for high frequency. (P2_)

**M12.4 Power electronic converters for drives**
- S deepen: Switching devices: MOSFET, IGBT, SiC, GaN trade-offs. Teach: SiC/GaN wide-bandgap trade-offs (voltage, switching speed, temperature) — book predates them. (P2_)
- S deepen: Converter control loops. Teach: Small-signal averaged converter model, voltage-mode vs current-mode loop, RHP zero of boost. (P2_)
- S deepen: Magnetics design for converters. Teach: Inductor/transformer sizing (area product), saturation, frequency-size trade. (P2_)

**M12.6 Induction motors**
- S deepen: Three-phase transformer connections. Teach: Star/delta relations, three-phase power √3·V·I·cosφ. (P2_)
- S deepen: Single- and three-phase power, per-unit system. Teach: Per-unit system, three-phase balanced analysis, single-line diagram. (P2_)

**M12.10 Motor/drive selection and closed-loop control**
- S new: Microgrids and isolated power (ships, aircraft, vehicles). Teach: Isolated power systems: ships (IPS), aircraft (MEA, 270 VDC), vehicles; generator sizing, pulsed loads (radar, lasers) on microgrids. (P2_)
- S new: Pulsed power: energy storage (capacitors, flywheels, inductive), Marx generators, switches; feeding DEW, HPM, . Teach: Energy/power density of storage options, rise time, recharge rate, mass budget for a laser or railgun. (P2_)

**M13.2 Statistical mechanics, Brownian motion, applications**
- S deepen: Fluctuation-dissipation theorem. Teach: General statement: noise and dissipation are two faces of one coupling (Johnson, Brownian, Einstein relation) - one synthesis section (P1_)

**M13.3 The laws of thermodynamics, illustrations, ratchet and pawl**
- S deepen: Information entropy vs thermodynamic entropy, Landauer. Teach: Landauer bound kT ln2 per erased bit, Maxwell demon resolution, numerical scale vs today's chips (P1_)
- S deepen: Information and entropy across thermo, comms, ML. Teach: An explicit bridge lesson: Boltzmann S=k ln W vs Shannon H, Landauer limit kT ln2, cross-entropy in ML (P3_)

**M13.11 Refrigeration cycles and heat pumps**
- S deepen: Cryocoolers for IR detectors (Joule-Thomson, Stirling), cooldown time and cooling budget. Teach: JT and Stirling cryocooler cycles, why 77 K / 120-150 K detector temperatures, cooldown-time and power trade for seekers (P3_)

**M13.15 The energy balance sheet: consumption and production**
- K deepen: Key physical constants and benchmark numbers by heart. Teach: A curated by-heart list (~60 numbers across domains: c, k_B T at 300 K, sigma, E of steel/Al/CFRP, rho air, a, g, 1 eV, specific energies of fuels vs batteries, kT/q, Earth radius, LEO speed, etc.) with spaced review (P3_)
- K delta: Order-of-magnitude estimation (Fermi problems) -> primary mil:M0.1. Teach: Explicit Fermi method: decomposition, geometric-mean guessing, error-in-log reasoning, "within 2x" self-calibration (P3_)

**M13.17 Living on sustainable energy: transport, heating, nuclear, storage**
- S deepen: Fuel cells and electrochemical conversion. Teach: Battery electrochemistry basics (cell voltage, specific energy limits, C-rate, Peukert, thermal runaway) at OOM level (P3_)

**M13.19 Power systems and the grid: per-unit and three-phase, power flow, faults and protection, s**
- K deepen: Frequency control, inertia, renewables integration. Teach: Swing equation and system inertia H, df/dt after loss of generation, droop, reserves; inverter-based (grid-forming) renewables reduce inertia. (P2_)
- S deepen: Transmission lines: models, losses, voltage drop. Teach: Power-line model (R, X, I²R loss, voltage drop, why HV, AC vs HVDC). (P2_)
- S deepen: Generators and engines as power sources: specific power of gensets, fuel cells, turbines vs batteries. Teach: kW/kg of gensets/APUs, fuel cell efficiency, comparison table for drones/vehicles. (P2_)
- S new: Power flow (load flow). Teach: Power-flow concept (P∝V1V2 sinδ/X, Q∝ΔV), why grids congest. (P2_)
- S new: Faults and short-circuit analysis, symmetrical components. Teach: Short-circuit currents, symmetrical components idea, fault levels, breakers. (P2_)
- S new: Protection: relays, breakers, coordination. Teach: Protection relays, coordination, selectivity. (P2_)
- S new: Power system stability (transient, voltage, frequency). Teach: Rotor-angle (swing equation, equal-area), voltage collapse, frequency stability. (P2_)
- S new: Electrical safety, grounding, arc flash. Teach: Shock physiology thresholds, earthing systems, arc flash energy. (P2_)
- S new: Grid vulnerability: EMP/GMD effects on transformers, cascading failures, black start. Teach: Geomagnetic induced currents, large-transformer lead times, cascading outages (2003, Ukraine 2015), black-start. (P2_)

**M14.4 Conduction analysis, dimensional analysis, fins**
- K delta: Scaling laws and similarity (square-cube etc.) -> primary eng:M17.12. Teach: Square-cube law and allometric scaling as a named tool (strength/weight, heat loss/volume, power/mass for drones and missiles), Reynolds-number scale effects (P3_)

**M14.6 Laminar and turbulent boundary layers**
- K deepen: Turbulence: nature, Reynolds averaging, closure problem. Teach: Energy cascade and Kolmogorov scales (eta ~ L Re^-3/4), the closure problem stated explicitly, why turbulence is unsolved (P3_)

**M14.7 Forced convection**
- S deepen: Pipe flow: Hagen-Poiseuille, friction factor, Moody. Teach: Moody chart and pressure-drop calculation for a duct/pipe network as a fluid-system tool (E16 gives f for heat-transfer purposes) (P3_)
- S new: Minor losses and system curves. Teach: Minor-loss coefficients (K), system curve vs pump curve, operating point, pumping power = Q dp/eta; Hardy Cross stays N (P3_)
- C C: Hydraulic and pneumatic systems [host assigned (no panel host)]. Teach: (see subtopic) (P3_)

**M14.10 Radiative heat transfer**
- S deepen: Electronics and spacecraft thermal control. Teach: Electronics cooling chain (junction-case-sink, W/cm2 limits by cooling method); spacecraft radiator sizing worked in text (SMAD is image-only) (P3_)
- S new: Thermal management design margins. Teach: Thermal design margins and temperature-limit philosophy (qual/acceptance temperature ranges, derating, uncertainty margins ~5-11 K for spacecraft, junction-temperature derating and Arrhenius life) (P3_)

**M15.1 The flow of wet water: viscosity**
- K deepen: Navier-Stokes equations: structure, terms, assumptions. Teach: A full term-by-term reading of NS (unsteady, convective, pressure, viscous, body), the nondimensional form and which term is dropped in each regime (Stokes, Euler, b.l., potential); the existence/smoothness caveat (P3_)
- S new: Cavitation and water hammer. Teach: Cavitation number, NPSH, propeller/torpedo cavitation and supercavitation; water hammer (Joukowsky dp = rho c dv) (P3_)

**M15.7 Viscous flow: boundary layers, transition, separation**
- S new: Turbulence models and their limits (RANS, LES, DNS). Teach: RANS vs LES vs DNS: cost scaling (DNS ~ Re^3), what each predicts badly (separation, transition), how to read a CFD claim (P3_)
- S new: CFD in practice. Teach: What CFD solves, meshes and y+, verification vs validation, typical errors in drag (±5-10%) and separation, why tunnel+CFD are combined; critique of CFD images in claims (P3_)
- S new: Underwater vehicle hydrodynamics: drag at high Re, added mass, propulsor cavitation, supercavitation. Teach: Drag power ~ V^3 and torpedo/UUV range-speed trade, added mass, cavitation inception depth/speed, supercavitating weapons (P3_)

**M15.9 Finite wings: induced drag, swept wings, flaps**
- S new: Aeroelasticity: divergence, flutter. Teach: Static divergence and control reversal, flutter as coupled bending-torsion instability (frequency coalescence), flutter speed scaling, why it constrains thin wings/fins (P3_)

**M15.10 Cylinders and spheres, how lift is produced, history**
- S deepen: Vorticity and circulation. Teach: Kelvin/Helmholtz theorems, Kutta-Joukowski L'=rho V Gamma as a result, starting vortex / wingtip vortices link to induced drag (P3_)
- S deepen: Potential flow. Teach: Elementary flows + superposition, d'Alembert paradox, thin-airfoil result a0=2pi as the outcome of potential theory (P3_)

**M15.13 UAVs, micro air vehicles, aerodynamic efficiency**
- K deepen: Hover and rotorcraft/multirotor power: actuator-disk P = T^1.5/sqrt(2 rho A), disk loading, figure of merit, b. Teach: Hover-power derivation, disk-loading trade, endurance = E_batt*eta/P_hover with specific-energy numbers; scaling with size (P3_)

**M15.14 Stability and control**
- S deepen: Dynamic stability modes (phugoid, short period, Dutch roll). Teach: Linearized longitudinal/lateral modes: short period, phugoid (Lanchester-ratio period ~ pi*sqrt2*V/g), Dutch roll, spiral, roll subsidence; handling qualities link to control (P3_)
- S deepen: Flight control systems, fly-by-wire. Teach: Stability augmentation, relaxed static stability, control-law architecture, redundancy (quad/triplex) — partly in Lanchester avionics (P3_)

**M15.15 Space flight (astronautics)**
- K deepen: Orbital elements, Hohmann transfers, delta-v budgets. Teach: Orbital elements, Hohmann transfer and plane-change Delta-V, a full mission Delta-V budget (LEO~9.4 km/s incl. losses); none of this is in readable ENG text (word "Hohmann" absent) (P3_)

**M15.16 Propulsion**
- S deepen: Launch vehicle sizing. Teach: Structural fraction, optimal staging, payload fraction ~2-4% to LEO, gravity/drag losses (P3_)
- S new: Pumps, fans, compressors: performance curves, affinity laws. Teach: Pump/fan/compressor performance curves, affinity laws (Q~N D^3, H~N^2 D^2, P~N^3 D^5), specific speed, surge/stall (P3_)
- S new: Turbomachinery basics (velocity triangles). Teach: Euler turbomachine equation, velocity triangles, stage loading/flow coefficients, why compressor stages are many and turbine stages few (P3_)

**M15.17 Hypersonic vehicles**
- S deepen: Aerothermal heating and thermal protection: stagnation-point heating scaling, ablation, radome/window limits. Teach: q_s ~ rho^0.5 V^3 / sqrt(R_n) (Sutton-Graves) as an estimation tool, ablative vs heat-sink vs radiative TPS, seeker-window heating as a hypersonic-missile constraint (P3_)

**M16.2 Tension, compression, shear, axially loaded members**
- K deepen: Fatigue: S-N curves, endurance, Goodman, Miner rule. Teach: Mean-stress (Goodman/Gerber), Miner cumulative damage, notch sensitivity, scatter (factor ~10 in life), crack-initiation vs propagation; words Goodman/Miner absent from all books (P3_)
- K deepen: Factors of safety vs margins of safety vs probabilistic design. Teach: Limit vs ultimate load (x1.5), stress-strength interference/probabilistic design, why FS hides different uncertainties, MS bookkeeping in reviews (P3_)
- S deepen: Joints: bolted, welded, bonded; preload. Teach: Bolt preload and joint stiffness diagram, weld fatigue categories, adhesive joint peel/shear (P3_)
- S deepen: Design loads: limit vs ultimate, load factors (V-n), MEOP, launch/gun-launch g-loads. Teach: Load-case definition, 1.5 ultimate factor, gun-launch 10^4 g environment for smart munitions (P3_)

**M16.3 Torsion**
- S new: Machine elements: shafts, bearings, gears, fasteners, springs. Teach: Bearing life (L10, cube law), gear stress basics, spring rates, fastener preload/joint diagram; catalogue detail stays N (5.1) (P3_)

**M16.5 Analysis of stress and strain, plane stress applications**
- S deepen: Yield criteria (Tresca, von Mises). Teach: Tresca vs von Mises derived and compared, equivalent stress on the Mohr circle, brittle criteria (max normal stress, Mohr-Coulomb) (P3_)

**M16.6 Deflections of beams, statically indeterminate beams**
- K delta: Finite element analysis in practice and pitfalls -> primary eng:M10.10. Teach: FEM idea (weak form, shape functions, stiffness assembly), mesh convergence, singularities at corners, boundary-condition errors, why "the colours" lie; verification checks against hand calcs (P3_)
- S new: Random vibration and PSD loading. Teach: Miles equation g_rms = sqrt(pi/2 f_n Q PSD), launch/gunfire random vibe specs, 3-sigma peaks and fatigue under random load (P3_)
- S new: Shock response spectrum. Teach: Shock response spectrum concept, pyroshock/gun-launch/drop shock, why SRS is not a Fourier spectrum (P3_)

**M16.7 Columns and buckling**
- K deepen: Buckling (Euler, local buckling). Teach: Local/plate/shell buckling and imperfection sensitivity (knockdown factors ~0.2-0.6 for cylinders) beyond Ashby formula sheet; post-buckling (P3_)

**M16.10 Engineering materials and their properties**
- S deepen: Corrosion and environmental degradation. Teach: Galvanic series and couples, stress-corrosion cracking, pitting, coatings/cathodic protection, hydrogen embrittlement; corrosion as the dominant sustainment cost driver (P3_)
- S deepen: Atomic bonding to properties (stiffness, strength). Teach: Bond type -> modulus (E ~ S0/r0, ~10 GPa per eV-scale estimates), why theoretical strength ~E/10 and real strength ~E/1000 (defects) (P3_)
- S deepen: Metals: steels, aluminum, titanium, superalloys. Teach: Characteristic numbers and roles of steels, Al (2xxx/7xxx), Ti, Ni superalloys; temperature limits (P3_)
- S deepen: Ceramics and glasses, brittleness and Weibull. Teach: Weibull modulus and size effect for brittle strength, thermal-shock resistance, glass/ceramic armor and radome links; Weibull absent from ENG books (B15 ch.9 uses Weibull for reliability only) (P3_)
- S new: Material property variability and allowables (A/B basis). Teach: A/B-basis allowables (99%/95% and 90%/95% tolerance bounds), batch-to-batch scatter, why design uses allowables not typical values (P3_)
- C C: Wear and tribology [host assigned (no panel host)]. Teach: (see subtopic) (P3_)

**M16.11 Material property charts**
- K deepen: Fracture mechanics, stress intensity, toughness. Teach: LEFM structure (K = Y sigma sqrt(pi a), Griffith energy argument), critical crack size estimate, plastic zone, ductile-brittle transition, why toughness not strength governs large structures (P3_)
- S new: Damage tolerance and inspection intervals. Teach: Paris law da/dN = C dK^m, inspection interval from crack growth between detectable and critical size, safe-life vs fail-safe vs damage tolerance (aircraft, pressure vessels) (P3_)
- S new: Failure analysis and fractography. Teach: Failure-analysis workflow: fracture surface reading (beach marks = fatigue, cup-cone = ductile, cleavage = brittle), root-cause chain, classic cases (Comet, Liberty ships, Aloha 243) (P3_)

**M16.14 Selection of material and shape**
- C C: Precision engineering principles (exact constraint, kinematic coupling). Teach: Exact constraint/kinematic coupling, Abbe principle, thermal-centre design for optics/gimbals (P3_)

**M16.16 Processes and process selection**
- S deepen: Phase diagrams, heat treatment. Teach: Binary phase diagram reading, lever rule, eutectic, precipitation hardening mechanism (P3_)
- S deepen: Additive manufacturing materials. Teach: AM processes, design freedom vs qualification burden, cost/rate economics (P3_)
- S deepen: Design for manufacture and assembly. Teach: DFMA rules (part count, Boothroyd index) (P3_)
- S new: Tolerancing, fits, GD&T. Teach: Tolerances and fits (ISO hole-basis), GD&T datum logic, process capability (Cp/Cpk) and cost-vs-tolerance curve (P3_)
- S new: Tolerance stack-up: worst case vs statistical (RSS). Teach: Worst-case vs RSS stack-up, sqrt(n) behaviour, the same structure in error budgets (pointing, link margins) (P3_)

**M17.4 Fitting models: gradient descent, backpropagation, initialization**
- S deepen: Automatic differentiation. Teach: Forward vs reverse mode, cost of gradients, dual numbers, why AD beats finite differences (P1_)

**M17.5 Measuring performance and regularization**
- K deepen: Generalization, train/validation/test splits, data leakage. Teach: Data leakage (temporal/group leakage, test-set reuse, benchmark contamination) is absent; split discipline only in passing. (P4_)
- K deepen: Evaluation metrics: precision/recall, ROC/AUC, calibration. Teach: Confusion matrix, precision/recall/F1, PR vs ROC under class imbalance, base-rate effect on precision, calibration curves/reliability diagrams, top-k and mAP for detection. (P4_)
- K deepen: Distribution shift and dataset bias. Teach: Train/deploy mismatch as the main failure mode: covariate/label/concept shift, sim-to-real for perception, adversary-induced shift, monitoring in deployment. (P4_)
- K new: Benchmarks and evaluations: test-set reuse, contamination, leaderboard overfitting, eval design for LLMs/ATR. Teach: (see subtopic) (P4_)
- S deepen: No free lunch, inductive bias. Teach: No-free-lunch theorem statement and its practical meaning (no universally best learner; priors/architecture must match the problem). (P4_)
- S deepen: Uncertainty in ML, calibration, out-of-distribution detection. Teach: Calibration of deep nets, ensembles/MC-dropout, conformal prediction, OOD detection. (P4_)

**M17.6 Convolutional and residual networks**
- S deepen: Learned perception (detection, segmentation). Teach: Detection metrics (mAP, IoU), failure modes in clutter/weather, sensor fusion with learned perception. (P4_)

**M17.7 Transformers**
- K deepen: Large language models: pretraining, fine-tuning, RLHF, in-context learning. Teach: RLHF / preference optimization, instruction tuning, inference-time compute (chain-of-thought, test-time search), tool use and agents, hallucination and its causes. Book (2023) stops at GPT-3. (P4_)
- S deepen: Recurrent networks and sequence modeling. Teach: RNN/LSTM recurrence, vanishing gradients through time, and modern state-space sequence models (S4/Mamba) as discretized linear systems - the latter a strong cross-domain link to E02/E03 state-space. (P4_)
- S new: LLM agents, tool use and AI-enabled autonomy (planning loops, failure modes, human-on-the-loop). Teach: (see subtopic) (P4_)

**M17.12 Why deep learning works, and ethics**
- K new: Scaling laws (compute, data, parameters) (merged: ADD:ML.1 (P4_), E:Engineering |0.3 (P3_)). Teach: Power-law scaling of loss with parameters N, data D, compute C (Kaplan 2020; Chinchilla 2022: ~20 tokens/parameter); training compute C≈6ND, inference ≈2N FLOP/token; limits (data wall, emergent-ability debate). (P4_)
- K new: ML under adversarial operational conditions: ATR with scarce/synthetic data, deception and decoys against lear (merged: E:Machine lear|4.3 (P4_), M:C4.4.4 (P6b)). Teach: (see subtopic) (P4_)
- S deepen: Interpretability and explainability. Teach: Attribution/saliency methods and their unreliability, mechanistic interpretability, what explanations can and cannot certify. (P4_)
- S deepen: Model compression and edge inference: quantization, pruning, distillation, SWaP limits on drones/missiles. Teach: (see subtopic) (P4_)
- S new: Physics-informed ML and surrogate models. Teach: Physics-informed losses, neural surrogates for CFD/FEM, neural operators; when a surrogate is trustworthy (extrapolation, conservation laws); digital twins. (P4_)
- S new: Data pipelines, labeling, technical debt in ML systems. Teach: Data collection and labeling cost/quality, label noise, data pipelines, ML technical debt (Sculley 2015), MLOps/monitoring. (P4_)

**M17.15 Nonparametric estimation, smoothing, classification**
- S deepen: Decision trees, random forests, gradient boosting. Teach: Random forests, bagging, gradient boosting (XGBoost) - the workhorse for tabular data - absent; MG match E20 "Forests & Trees" is graph theory (false). (P4_)

**M18.7 Policy gradient methods and deep RL**
- K deepen: RL vs optimal control: relationship and when each wins. Teach: Explicit map: RL = sampled approximate DP; LQR/MPC vs model-free RL; when model-based control wins (known dynamics, safety, data cost) and when RL wins (contact, combinatorial, unknown models). (P4_)
- S deepen: Actor-critic, PPO, SAC. Teach: PPO clipped objective and SAC entropy-regularization only named in notes. (P4_)
- S deepen: Offline RL and imitation learning. Teach: Behaviour cloning compounding error, DAgger. (P4_)

**M18.9 Applications, case studies, frontiers**
- K deepen: Reward design, reward hacking, specification gaming. Teach: Reward hacking / specification gaming catalogue and Goodhart; reward models in RLHF. (P4_)
- S deepen: Sample efficiency and compute cost of RL. Teach: Explicit sample-complexity and compute cost comparison (env steps, GPU-days) and its implication for real systems. (P4_)
- S deepen: Multi-agent RL and game theory basics. Teach: Markov games, Nash equilibria, non-stationarity, self-play/league training (AlphaStar), MARL for swarms. (P4_)
- S deepen: POMDPs and belief states. Teach: (see subtopic) (P4_)
- S new: Sim-to-real transfer and domain randomization. Teach: Reality gap, domain randomization, system identification vs randomization, residual RL; why legged robots/drone racing succeeded. (P4_)
- S new: Safe/constrained RL and RL for control of physical systems (constraints, shielding, sim-validated policies). Teach: (see subtopic) (P4_)

**M19.10 Wheeled mobile robots**
- S deepen: Sensors: cameras, LIDAR, IMU, encoders, radar. Teach: Robot sensor suite characteristics (camera, LIDAR, IMU grades, wheel encoders, radar): range, rate, noise, failure modes, cost. (P4_)
- S deepen: Localization (Markov, Monte Carlo localization). Teach: Robot localization proper (motion model + measurement model, particle filter MCL, EKF localization). (P4_)
- S deepen: Visual odometry and visual-inertial navigation. Teach: Visual and visual-inertial odometry (feature tracking, scale observability). (P4_)
- S deepen: Autonomy architecture of unmanned systems: sense-plan-act layers, behavior trees/state machines, mission manag. Teach: (see subtopic) (P4_)
- S deepen: Robot state estimation in practice (EKF/particle filter applied to pose; sensor fusion IMU+GNSS+vision). Teach: (see subtopic) (P4_)
- S new: Camera models, calibration, stereo, epipolar geometry. Teach: Pinhole model, intrinsics/extrinsics, calibration, stereo depth ~ fB/d and its error growing as Z^2, epipolar geometry. (P4_)
- S new: SLAM. Teach: SLAM problem structure (joint state of pose + map, data association, loop closure, graph-SLAM as least squares), drift vs closure, GNSS-denied relevance. (P4_)
- S new: Legged locomotion and underactuated robotics. Teach: Underactuation, ZMP/whole-body control at concept level, why RL+sim made quadrupeds robust; energy cost of transport. (P4_)
- S new: Multi-robot systems and swarms. Teach: Swarm/multi-robot: consensus, task allocation (auction/market), formation control, communication limits, scaling claims vs reality. (P4_)

**M21.7 NP-completeness and dealing with hard problems**
- S deepen: Integer/combinatorial optimization, NP-hardness in practice. Teach: Branch-and-bound / MILP practice, LP relaxation gaps, what "NP-hard" means for real sizes (P1_)

**M21.9 Catalog: numerical and combinatorial problems**
- S deepen: FFT algorithm and its cost. Teach: FFT cost N log N vs N^2, leakage and windowing, zero padding vs resolution (P1_)

**M22.5 Arithmetic for computers**
- K deepen: Floating-point representation and numerical error (IEEE 754, rounding, cancellation, Patriot 1991 clock drift). Teach: Patriot case and error accumulation in long-running systems. (P4_)

**M22.7 The memory hierarchy**
- K deepen: Numbers every engineer should know (latencies, bandwidths). Teach: A one-page table of order-of-magnitude latencies/bandwidths (L1 ~1 ns, DRAM ~100 ns, SSD ~100 us, WAN RTT ~100 ms; HBM/PCIe/Ethernet bandwidths; energy per op vs per DRAM access) and how to use it. (P4_)
- K deepen: Software failure modes and fault tolerance. Teach: Software failure case studies (Ariane 5, Patriot clock drift 1991, Therac-25, F-35/737 MAX), defensive design, N-version myths, software as dominant cause of weapon-program delay. (P4_)
- S deepen: Operating systems: processes, scheduling, memory, I/O. Teach: Processes/threads, scheduling, I/O model at OS level. (P4_)

**M22.8 Parallel processors and GPUs**
- K deepen: Compute and hardware for ML (FLOPs, memory, GPUs). Teach: ML-specific compute: FLOPs per token/sample, memory-bandwidth-bound inference, HBM, interconnect, training cluster size/energy, accelerators (TPU/systolic arrays), quantization effects. (P4_)
- K deepen: Domain-specific accelerators: systolic arrays/TPU, HBM, chiplets and advanced packaging, FPGA vs ASIC vs GPU t. Teach: Systolic arrays/TPU, HBM, chiplets, packaging. (P4_)
- S deepen: Parallel and distributed algorithms. Teach: Work/span model, communication cost, MapReduce-style data parallelism. (P4_)
- S deepen: Concurrency, race conditions, deadlock. Teach: Race conditions, deadlock, priority inversion (Mars Pathfinder) at concept level. (P4_)
- S deepen: Distributed systems: consistency, fault tolerance, CAP. Teach: CAP/consistency, consensus, partial failure, replication; why distributed C2 networks fail. (P4_)

**M22.10 Microcomputers and microprocessors in circuits**
- K deepen: Cybersecurity fundamentals for weapon systems: attack surface, crypto primitives (symmetric, public-key, hashe. Teach: Everything beyond RSA/hash basics. (P4_)
- S deepen: Microcontrollers and embedded interfacing (GPIO, SPI, I2C, UART, interrupts). Teach: Modern serial buses (SPI, I2C, UART, CAN), microcontroller peripherals, RTOS/interrupt latency. Book material is 1980s (8086/68008, ISA). (P2_)
- S new: Robot software architecture, ROS, real-time constraints. Teach: Robot software stack: ROS 2 publish/subscribe, real-time loops vs best-effort, timing jitter, software as dominant failure source. (P4_)

**M23.5 The wireless channel**
- K deepen: Link budget: Friis equation, EIRP, G/T, margins. Teach: Friis transmission, EIRP, G/T, link margin, worked budget. (P2_)

**M23.7 Cellular systems: multiple access and interference**
- K deepen: Latency, throughput, bandwidth-delay product. Teach: Latency vs throughput, bandwidth-delay product, propagation vs serialization vs queueing delay; numbers for SATCOM/LEO/fiber. (P2_)
- S deepen: Layered models (OSI, TCP/IP). Teach: Layered model (physical→application), encapsulation, what each layer guarantees; IP vs. tactical datalinks. (P2_)
- S deepen: Routing and switching, packet vs circuit. Teach: Packet vs circuit switching, store-and-forward, routing protocols at concept level. (P2_)
- S deepen: PAPR, power-amplifier back-off and EVM. Teach: EVM, AM/AM-AM/PM, back-off cost in efficiency. (P2_)
- S delta: Tactical/MANET networking and SATCOM/LEO broadband (latency, capacity per beam) -> primary mil:M7.9. Teach: Mesh routing, contention, LEO constellation capacity arithmetic. (P2_)
- S new: Network security: threats, firewalls, defense in depth. Teach: Threat model, CIA, attack surfaces, defense in depth, encryption at link vs network layer, jamming vs cyber. (P2_)
- C C: Spectrum regulation and allocation [host assigned (no panel host)]. Teach: (see subtopic) (P2_)

**M24.1 Special relativity**
- S new: General relativity effects on clocks. Teach: Equivalence principle, gravitational time dilation dPhi/c^2, GPS clock correction (+45 us/day gravity, -7 us/day velocity, net +38 us/day) (P1_)

**M24.3 Quantum behavior: waves and particles**
- S deepen: Photoelectric effect, photons, wave-particle duality. Teach: Photoelectric effect and work function, photon counting, quantum efficiency and shot noise of detectors (P1_)

**M24.7 Two-state systems and the hyperfine splitting**
- S delta: Quantum computing and quantum sensing basics -> primary mil:M5.11. Teach: Quantum sensing: atomic clocks (hyperfine transition = F3 12), atom interferometers, magnetometers; realistic status of quantum computing and QKD (P1_)

**M24.8 Propagation in a crystal lattice and semiconductors**
- S deepen: Particle in a box, tunneling, harmonic oscillator. Teach: Tunneling probability ~exp(-2 kappa a) and its engineering uses (gate leakage, flash, STM, Josephson) (P1_)

**M25.5 MOSFETs in ICs: scaling and leakage**
- S deepen: Power semiconductors (SiC, GaN). Teach: Wide-bandgap physics (breakdown field, Baliga figure of merit), SiC vs GaN application map (EV/inverters vs RF PA/radar T/R modules), GaN for AESA. (P4_)

**M25.9 Robustness and circuit simulation**
- S deepen: Radiation effects on electronics (SEU, TID). Teach: TID, SEU/SEL, rad-hard by design vs process, space/nuclear environment numbers. (P2_)

**M25.12 Design methodology, testing, verification**
- K deepen: Yield, cost per transistor, foundry economics. Teach: Foundry economics and geopolitics: fab cost ($20B+), node naming vs density, concentration (TSMC, ASML EUV), advanced packaging/chiplets, export controls; mature-node chips in munitions. (P4_)

**M27.1 Systems engineering fundamentals and the project life cycle**
- K deepen: Systems thinking, emergence, boundaries. Teach: Emergence, boundaries, unintended interactions, leverage points, "the system includes the operators and the adversary" (P3_)
- K deepen: Case studies of failures (Challenger, Columbia, Tacoma, Therac-25, Mars Climate Orbiter, 737 MAX). Teach: Systematic case set: Challenger, Columbia, Tacoma Narrows, Therac-25, Mars Climate Orbiter, Comet, Hyatt Regency, Boeing 737 MAX, Ariane 5 — each tied to the principle it violated (P3_)
- S deepen: Engineering economics: time value, life-cycle cost. Teach: Discounting/NPV, life-cycle cost split (O&S ~60-70% for weapon systems) (P3_)
- S deepen: Engineering ethics and professional responsibility. Teach: Engineering ethics and professional responsibility in the defense context (whistle-blowing, Challenger) (P3_)

**M27.2 System design: expectations, requirements, decomposition, design solution**
- K new: Resilience and graceful degradation. Teach: Resilience and graceful degradation: degraded modes, fail-operational vs fail-safe, attrition-tolerant architectures (link to kill webs) (P3_)
- S deepen: Modularity, coupling, design structure matrices. Teach: DSM as a tool, modularity vs integral architectures, coupling as cost/schedule driver (P3_)
- S new: Model-based systems engineering (SysML). Teach: What MBSE/SysML changes (single source of truth, diagrams BDD/IBD/activity), and its limits; digital thread/digital twin (P3_)
- S new: Security engineering and cyber-resilience. Teach: Security engineering: attack surface, defense-in-depth, supply-chain and cyber-resilience requirements in SE (P3_)

**M27.3 Product realization: integration, verification, validation, transition**
- K new: Anomaly investigation and root cause analysis. Teach: Anomaly investigation: fault trees for root cause, 5-whys/Ishikawa limits, fault isolation, "no fault found", organizational root causes (CAIB) (P3_)
- K new: Verification and assurance of ML in safety-critical systems. Teach: Assurance of learned components: data-coverage arguments, ODD, runtime monitors/safety envelopes, testing limits (rare events), DoD 3000.09/RAI, standards (UL 4600, ISO PAS 8800, EASA AI guidance). (P4_)
- K new: Safety of autonomous systems (standards, ODD). Teach: Operational design domain, safety case (UL 4600), functional safety (IEC 61508/ISO 26262 SOTIF), runtime assurance (simplex architecture), DoD 3000.09. (P4_)
- K new: Test statistics for small samples: success-run theorem (C = 1 - R^n), demonstrated vs required reliability, OC (merged: M:OR.9.1 (P7_), M:ACQ.3.3 (P7_), ADD:MF.1 (P4_)). Teach: n = ln(1-C)/ln R (e.g., 0.9 reliability at 90% confidence needs 22 successes), why a few flight tests prove little (P3_)
- S deepen: Structural testing and qualification. Teach: Qualification factors (e.g., 1.25 x limit for proof, ultimate test), static/fatigue test campaigns, test-to-failure value (P3_)
- S deepen: Modeling and simulation in SE, model credibility. Teach: Model credibility: VV&A, intended use, NASA-STD-7009 credibility factors, validation domain (P3_)
- S deepen: Environmental testing (vibe, thermal-vac, EMC). Teach: Vibe, thermal-vac, shock, EMC test types and why each exists; test levels vs flight levels (qual +3 dB / +10 C) (P3_)
- S deepen: Software engineering: testing, version control, verification. Teach: Software testing levels, regression, version control/configuration management, code review; V-model for software. (P4_)
- S new: SE for software-intensive and AI-enabled systems: data as requirement, ML assurance, continuous V&V, update ca. Teach: How ML components break V&V assumptions; operational drift; assurance cases (P3_)

**M27.4 Crosscutting technical management: planning, requirements, interfaces, risk, configuration**
- K deepen: Technical budgets: mass, power, link, pointing, timing, margins and contingency policy. Teach: Budget mechanics: allocation, contingency vs margin, mass growth allowance by maturity (AIAA S-120: 5-30%), power/pointing/timing budgets, RSS vs worst-case; margin erosion curves (P3_)
- K deepen: FMEA/FMECA (merged: M:SUR.3.1 (P6a), E:Systems engi|4.4 (P3_)). Teach: FMEA/FMECA worksheet, RPN and its known flaws, criticality matrix (P3_)
- K new: Common-cause failures and limits of redundancy. Teach: Common-cause/common-mode failures, beta-factor model (beta ~ 0.01-0.1 caps redundancy gains), diversity vs redundancy (P3_)
- S deepen: Work breakdown structure and scheduling (critical path). Teach: Critical path method with float, schedule risk (merge bias: parallel paths make late finish likely) (P3_)
- S deepen: Earned value management. Teach: PV/EV/AC, CPI/SPI, EAC = BAC/CPI and the CPI-stability finding (P3_)
- S new: Probabilistic risk assessment. Teach: PRA: scenario/event-tree/fault-tree linkage, uncertainty distributions, what PRA numbers mean (Shuttle 1/100 vs 1/100,000 claims) (P3_)
- S new: System safety process, hazard analysis. Teach: Hazard analysis (PHA, hazard tracking), MIL-STD-882 risk matrix, safety vs reliability distinction (P3_)
- S new: STAMP/STPA systems-theoretic safety. Teach: STAMP/STPA: accidents as control-structure failures, unsafe control actions; contrast with chain-of-events models (P3_)
- S new: Software safety and assurance (DO-178C, IEC 61508 SIL). Teach: Software assurance levels (DO-178C DAL A-E, IEC 61508 SIL), why software fails differently (no wear-out, specification errors), assurance of ML components (P3_)

**M27.5 Technical assessment, decision analysis, technology readiness**
- K deepen: Trade studies and decision analysis. Teach: Trade-space exploration, Pareto/knee, sensitivity of the winner to weights and assumptions, cost-effectiveness ratio, decision under uncertainty (expected value, decision trees, value of information) (P3_)
- K deepen: Multi-attribute utility, value models, pitfalls of weighted scoring. Teach: Utility/value functions (additive independence condition), swing weighting, rank reversal and scale-normalization traps, why weighted scoring is often wrong (P3_)
- K deepen: Fundamental limits as judgment anchors: Carnot, Betz, Tsiolkovsky, Shannon, diffraction, specific strength/ene. Teach: A single comparative lesson + card set: each limit, its assumptions, how close real systems get (fraction of limit) (P3_)
- K new: Sanity checks of computer outputs and AI answers (merged: M:CRAFT.2.1 (P7_)). Teach: Sanity-check protocol for computer and AI outputs: units, limits/asymptotes, conservation, OOM, sign/monotonicity, independent rough model; LLM-specific failure patterns (confident wrong numbers, fake citations) (P3_)
- S deepen: Documentation, technical writing, presenting trade-offs. Teach: Writing a trade-off memo/article for decision makers: bottom line first, assumptions table, sensitivity, uncertainty language (P3_)
- S delta: Sensitivity analysis of system models -> primary mil:M14.1. Teach: Tornado/one-at-a-time vs global (Sobol) sensitivity, elasticities, finding the assumption that flips the decision (P3_)
- S delta: Technology trends and learning curves: Wright's law, S-curves, cost per unit vs quantity -> primary mil:M13.7. Teach: Wright/Moore laws, experience curves for drones/munitions/solar, limits of extrapolation (P3_)
- S delta: Interviewing experts and extracting assumptions: questions that expose margins, limits and test evidence -> primary mil:M14.5. Teach: A question bank per domain (what margin? what was tested vs analysed? what is the limiting physics? what fails first?) (P3_)
- S new: Model fidelity selection (fit-for-purpose models). Teach: Fit-for-purpose modeling: question-driven fidelity, model hierarchy, cost of fidelity vs decision value (P3_)
- S new: Programme failure patterns and forecasting: optimism bias, reference-class forecasting, Augustine laws, schedu. Teach: Empirical cost/schedule growth distributions and how to forecast a programme from its class (P3_)
- C C: Intellectual property and patents [host assigned (no panel host)]. Teach: (see subtopic) (P3_)

**M27.6 Glossary, acronyms, human systems integration, operations**
- S new: Standards landscape (ISO 15288, MIL-STDs, IEEE, IEC). Teach: Map of ISO/IEC/IEEE 15288, MIL-STD-882, -810, -461, DO-178C/254, IEC 61508: what each governs (P3_)

### Lanchester

**M0.1 dB and the basic link equation**
- K new: Mental estimation to 10-20% (logs, powers of ten, rule-of-thumb constants) (merged: P1:add.10 (P1_), E:Engineering |0.1 (P3_), M:F.9.2 (P4_), P7+.4 (P7_)). Teach: Explicit mental-math kit: log10 of 2,3,5,7; dB anchors (3/10/20); rules of thumb (kTB=-174 dBm/Hz, c, 1 nmi, earth radius, g); error budgets in dB; drills to 10-20%. (P4_)

**M0.4 Probability, noise and random signals**
- K deepen: Independence assumptions and their failure (correlated shots, common-mode). Teach: Where independence fails in practice: correlated shots against the same target, common-mode failures in redundant systems, correlated sensor errors in fusion; consequences for Pk compounding and reliability claims. (P4_)
- K deepen: Compounding probabilities: 1-(1-p)^n, series/parallel reliability, layered-defense leakage. Teach: Explicit P0 treatment with the independence caveat (F.4.4). (P4_)
- K delta: Small-sample confidence for test claims: binomial CI, rule of three (0 failures in n -> p<3/n), how many shots -> primary eng:M27.3. Teach: Binomial/rule-of-three worked on T&E numbers. (P4_)
- S delta: Log-normal and heavy-tailed quantities; multiplicative error budgets (why dB/log thinking works) -> primary eng:M6.3. Teach: (see subtopic) (P4_)

**M0.6 Estimation and least squares**
- K delta: Uncertainty propagation and ranges vs point estimates -> primary eng:M6.4. Teach: First-order error propagation (sum of variances, relative errors), Monte Carlo propagation, presenting ranges instead of points. (P4_)

**M1.2 Phased arrays**
- K deepen: AESA vs PESA: T/R modules, graceful degradation, power-aperture. Teach: explicit AESA-vs-PESA comparison table: graceful degradation numbers, distributed vs central transmitter losses, T/R count vs power-aperture, why AESA enables LPI/EA modes; partly scattered (P5_)
- S new: Cost per T/R module and aperture economics. Teach: cost per T/R module trend ($/element), array cost vs aperture, digital-array cost curves; ref figures for sizing claims (e.g. 1000s elements x $k) (P5_)

**M1.3 Propagation**
- K deepen: Radar coverage diagrams and low-altitude gaps as tactical facts. Teach: vertical coverage diagram reading, radar horizon table (h=10 m target at 9-13 km vs 30 km for 50 m), gap-filler/aerostat/AEW logic as tactical facts (P5_)
- S deepen: Foliage, building and terrain loss. Teach: building/urban penetration loss values (10-20 dB), terrain masking statistics for low fliers (P5_)
- C C: HF communications and NVIS/ALE as resilient beyond-LOS comms. Teach: ALE, NVIS for ground forces (P5_)

**M2.4 RCS, scattering and stealth**
- K deepen: Shaping vs RAM; stealth limits at low band. Teach: explicit statement + numbers: shaping effective only in optics region (L > ~10 lambda); VHF/UHF radars see resonance-region RCS; RAM thickness/weight vs wavelength; counter-stealth low-band radars (Nebo, 1L13) (P5_)
- K new: Counter-stealth architectures (low-band + IRST + passive + network). Teach: counter-stealth architecture: low-band (VHF/UHF) search + IRST + PCL + multistatic + network fusion to fire-control quality; why low-band tracks are not weapons-quality; Chinese/Russian claims (P5_)
- S deepen: Stealth sustainment and cost of low observability. Teach: sustainment cost data (F-22/F-35 LO maintenance hours, coating repair), availability impact (P5_)

**M2.22 Fire-control radar**
- K deepen: Track quality, latency and fire-control-quality tracks. Teach: explicit track-quality metrics (covariance, update rate, latency) required for fire control vs surveillance; why surveillance tracks cannot cue interceptors without handover; numbers (P5_)

**M2.29 Multitarget, multisensor tracking**
- S deepen: JDL fusion levels. Teach: JDL levels as a framework; track-to-track fusion. (P6b)

**M2.32 MIMO radar**
- S deepen: MIMO and cognitive radar. Teach: cognitive radar concept and claims; book is MIMO only (P5_)
- C C: Quantum radar claims: physics limits (critique). Teach: critique note (P5_)

**M2.37 Radar ATR**
- S deepen: NCTR: HRR profiles, JEM, micro-Doppler. Teach: JEM (jet engine modulation) and HRR-profile NCTR for aircraft ID; reliability limits (P5_)

**M3.3 Diffraction and optics**
- S deepen: Fourier optics (lens as Fourier transformer, MTF). Teach: Lens as Fourier transformer, PSF/MTF (P1_)

**M3.4 Radiometry, targets and backgrounds**
- S deepen: Thermal (IR) signature physics of platforms: plume, hot parts, skin, and suppression. Teach: Unified ENG->MIL lesson: emissivity, plume band radiation (CO2 4.3 um), skin aero-heating, suppression trade-offs (P3_)
- S deepen: Camouflage, concealment and decoys against EO. Teach: multispectral camouflage physics (emissivity control, thermal blankets), decoys vs EO/IR and their tell-tales (P5_)

**M3.8 Image processing, perception, ATR**
- K deepen: AI/ML for detection/targeting (e.g., Maven-class) and limits. Teach: AI for targeting (Maven, Lavender-class debates), error rates, base-rate effects. (P6b)
- S delta: Data quality, labeling and adversarial ML -> primary eng:M17.12. Teach: Data labeling, distribution shift, adversarial ML (Gilua ML has theory). (P6b)

**M3.10 System performance and target acquisition**
- K deepen: IRST detection ranges against aircraft and missiles. Teach: quantitative IRST detection range vs aircraft aspect/afterburner (tail 50-100 km, head-on 20-50 km), contrast/clutter limits, IRST vs stealth, PIRATE/OLS examples (P5_)

**M3.13 Lasers, night vision, designation**
- K deepen: High-energy lasers: power, beam quality, dwell time, atmospheric limits. Teach: HEL fundamentals: power-on-target, beam quality M^2, dwell time vs hardness (kJ/cm^2), thermal blooming, turbulence, numbers for 50-300 kW C-UAS/C-RAM lasers (Iron Beam) (P5_)
- K new: Cost per shot and magazine of directed energy (merged: M:OR.12.3 (P7_), M:UAS.4.3 (P6a), M:AMD.5.1 (P6b)). Teach: cost per shot, magazine depth, weather availability of DE vs interceptors; cost-exchange arithmetic (P5_)
- S deepen: Laser dazzlers and anti-sensor lasers vs EO/IR (ISR drones, satellites), laser warning. Teach: dazzle/damage thresholds, ranges (P5_)
- S new: Lidar. Teach: lidar/ladar: range equation (1/R^2 vs 1/R^4 for extended target), flash lidar seekers, autonomy/drone nav use (P5_)

**M4.1 EW overview and threats**
- K deepen: EW in the kill chain (find/fix/track/target/engage/assess). Teach: mapping of each EW/EP function onto F2T2EA steps, which step EW breaks cheapest (P5_)
- K deepen: Spectrum as maneuver space; EMCON. Teach: EMCON doctrine and 'emit and die'; spectrum as maneuver space (P5_)
- K deepen: Electromagnetic signature management of ground forces. Teach: ground-force signature management: radio discipline, CP emissions, Starlink/phones as beacons, detection ranges by ESM (P5_)
- K new: Countermeasure/counter-countermeasure cycle and its timescales. Teach: historical CM/CCM cycles with timescales (Vietnam SA-2/QRC pods ~months; 1973 SA-6 gap; 1982 Bekaa; Ukraine 2022-25 weekly adaptation of drones/EW); reprogramming loop latency; why EW advantage is transient (P5_)
- S deepen: ES/EA/EP definitions; EMSO, spectrum management. Teach: EMSO/spectrum-management terms (JEMSO, EMBM) and modern doctrine (P5_)
- S deepen: Electromagnetic compatibility and spectrum fratricide (own jammers vs own links/GNSS); deconfliction. Teach: operational deconfliction (P5_)
- S new: EW-cyber convergence (CEMA). Teach: CEMA convergence, RF-delivered cyber effects (P5_)
- S new: Cost and production of EW systems vs drones. Teach: unit costs of EW systems vs drones; production rates (Ukraine/Russia) (P5_)

**M4.2 EW receivers**
- K deepen: RWR design and limitations. Teach: RWR sensitivity budget vs threat ERP, ambiguity/ID errors, limitations vs LPI and CW (P5_)
- S deepen: Software-defined radio proliferation: low-cost EW/ESM/jammers built from COTS SDR; consequences for EW density. Teach: cost/performance of COTS SDR (P5_)

**M4.3 EW processing**
- K new: EW reprogramming and mission data files. Teach: reprogramming cycle, mission data files, threat libraries, latency of updates; Ukraine weekly reprogramming (P5_)
- S deepen: Cognitive/AI-enabled EW claims and realities. Teach: cognitive EW claims vs reality (P5_)

**M4.6 Emitter location**
- S deepen: Single-platform passive ranging. Teach: phase-rate-of-change / angle-rate passive ranging from one aircraft (bearing-only TMA) (P5_)
- S deepen: Space-based SIGINT/RF geolocation constellations (incl. commercial HawkEye-360-class) and their accuracy. Teach: orbital geometry, revisit, commercial availability (P5_)

**M4.7 Jamming fundamentals**
- K deepen: Stand-in jamming and expendable jammers. Teach: stand-in jammer math (range advantage, R^2 vs R^4), drone-borne stand-in jammers, numbers (P5_)

**M4.9 Decoys**
- K deepen: Decoy realism requirements (signature fidelity in multiple bands). Teach: multi-band signature fidelity, kinematic realism, cost-exchange of decoys (Gerbera-type)  (P5_)
- K deepen: Counter-ISR: camouflage, decoys, deception, emission control. Teach: Integrated counter-ISR model (decoy ratio vs sensor discrimination). (P6b)

**M4.10 IR countermeasures and defensive aids**
- K deepen: Missile warning (UV/IR MAWS) and false alarm problem. Teach: UV vs IR MAWS physics (solar-blind UV, short range), false-alarm rates, declaration time vs MANPADS time-of-flight (P5_)
- K deepen: DIRCM and lasers vs IR seekers. Teach: DIRCM: closed-loop jam codes, laser power, imaging-seeker resistance (P5_)
- K new: Anti-radiation missiles: seekers, memory, shutdown tactics. Teach: ARM seeker physics (broadband passive, DF accuracy, memory/INS/GPS and MMW terminal), shutdown tactics, AARGM-ER (P5_)

**M4.11 LPI signals and communications EW**
- K deepen: Comms intercept and direction finding of tactical radios/phones. Teach: cellular/handset intercept and geolocation (IMSI catchers, Ukraine phone-based targeting) (P5_)
- S deepen: Cellular networks and civilian infrastructure use/exploitation. Teach: military use/exploitation of civil cellular (targeting of phones, using networks for drones) (P5_)

**M4.14 EW simulation**
- S deepen: EW engagement M&S levels (engineering/engagement/mission/campaign). Teach: explicit M&S hierarchy for EW (engineering-engagement-mission-campaign), tools (ESAMS/BRAWLER/SUPPRESSOR) and validity (P5_)

**M5.5 Interference, spoofing, multipath**
- S deepen: GNSS interference detection and localization in practice (ADS-B NIC maps, crowd-sourced monitoring, Baltic/Mid. Teach: operational picture 2022-2026 (P5_)

**M5.6 Stand-alone performance**
- K deepen: Timing: GNSS-disciplined clocks, holdover, Allan deviation; dependence of datalinks (Link 16 TDMA), cellular,  (merged: P2_:Inertial sensor error models: bias, scal (P2_)). Teach: holdover times by oscillator class (TCXO/OCXO/Rb/Cs), timing as a jamming target (P5_)

**M5.8 INS and integration**
- K deepen: Effects on weapons: JDAM/GMLRS-class degradation under jamming. Teach: JDAM/GMLRS/Excalibur degradation under jamming in Ukraine, CEP growth with INS-only, M-code/SAASM (P5_)

**M5.11 Alt-PNT**
- S deepen: Signals of opportunity, celestial, magnetic/gravity navigation, eLoran. Teach: magnetic/gravity map navigation, eLoran revival (P5_)
- S new: Quantum sensors (atomic clocks, cold-atom inertial) (merged: E:Physics|4.10 (P1_)). Teach: quantum clocks/inertial: physics, maturity, claims (P5_)

**M6.2 Aerodynamics, missile model, autopilots**
- S deepen: Missile and projectile aerodynamics basics: body lift, fin effectiveness, base drag, ballistic coefficient. Teach: Slender-body lift, CNalpha of fins, base drag fraction, coast range from ballistic coefficient (P3_)

**M6.3 Guidance phases and intercept techniques**
- K deepen: Weapon datalinks (in-flight updates, terminal handover). Teach: in-flight target updates, two-way weapon datalinks (network-enabled weapons), jamming exposure (P5_)

**M6.6 Seekers and guidance system model**
- K deepen: Guidance time constant and miss distance. Teach: Quantitative: miss vs guidance time constant and flight time (tgo >~10 tau), normalized miss curves (Zarchan) are absent from Siouris/Boord. (P6b)
- K deepen: Weaving and evasive maneuvers vs interceptors. Teach: Weave-induced miss resonance vs guidance time constant; why TBM corkscrew/MaRV maneuvers hurt PN interceptors. (P6b)
- K deepen: Lock-on before/after launch; acquisition range. Teach: LOBL vs LOAL, acquisition range vs seeker sensitivity, datalink-supported midcourse and its jamming exposure. (P6b)
- S deepen: Adjoint method and miss-distance budgets (noise, maneuver, heading error). Teach: Adjoint method and miss-distance budget by error source (heading error, target step maneuver, glint, range-independent/dependent noise, radome). Needs Zarchan-style content: write as tutor-generated derivation with a sma (P6b)

**M6.7 Weapon delivery**
- K deepen: Energy management and no-escape zone dependence on altitude. Teach: NEZ/Rmax/Rne vs launch altitude and speed; coast velocity decay; loft trajectory; why AAM range claims depend on geometry. (P6b)
- K deepen: Air-to-air missile kinematics: Rmax/Rne/NEZ, loft, A-pole/F-pole, launch altitude effects. Teach: (see subtopic) (P6b)
- S deepen: Sensor fusion in fighters. Teach: Multi-sensor track fusion concept in 5th-gen fighters (link M2.15 tracking, Gilua estimation) (P6a)

**M6.8 Ballistic missiles**
- K deepen: Launcher survivability and the Scud-hunt problem. Teach: Scud-hunt: TEL dwell/hide times, sensor revisit, sensor-to-shooter latency → P(kill before relocation); 1991 Gulf War evidence. (P6b)
- K new: Quasi-ballistic missiles (Iskander-class). Teach: Quasi-ballistic (depressed, aerodynamically maneuvering in atmosphere: Iskander, Fateh, KN-23, Kinzhal) – trajectory, why lower-tier defenses struggle, IPP uncertainty. MG "full" was a false match on Siouris intro. (P6b)
- S new: Deterrence theory and escalation dynamics with long-range strike [NEW-Q3 dropped; deterrence/escalation kept S in M6.8]. Teach: Deterrence theory, escalation dynamics with long-range conventional strike. (P7_)
- C C: MTCR thresholds (500 kg / 300 km) [decision: MTCR -> C mention]. Teach: MTCR Category I (500 kg/300 km) and range-payload trade (links M6.8 ballistic missiles). (P7_)
- C C: Arms control regimes (NPT, INF history, New START) and verification [decision: arms-control regimes grouped with MTCR -> C mention]. Teach: NPT, INF history, New START, verification technology. (P7_)
- C C: Iranian missile and drone arsenal and production [decision: region -> C mention]. Teach: Iranian missile families (Shahab/Emad/Kheibar Shekan/Fattah, Shahed-136), production, April/Oct 2024 salvos. (P7_)
- C C: North Korean missile program and its links to Iran/Russia [decision: region -> C mention]. Teach: (see subtopic) (P7_)

**M6.9 Hypersonic boost-glide**
- K new: Guidance against maneuvering hypersonic/MaRV targets: predicted-intercept uncertainty, glide-phase intercept. Teach: (see subtopic) (P6b)
- S deepen: Hypersonic cruise (scramjet) state of the art. Teach: Scramjet state of the art (X-51, HAWC, Zircon claims). (P6b)

**M6.10 Cruise missiles**
- K deepen: Anti-ship missiles: sea-skimming, supersonic vs subsonic trade. Teach: Supersonic vs subsonic ASCM trade (detection horizon time vs signature/cost/range), terminal maneuvers. (P6b)
- K deepen: Salvo sizing against defended targets. Teach: Attacker-side salvo sizing vs defended target (salvo equation, leakers needed = n_attack - capacity), Hughes salvo model link to naval panel. (P6b)
- K delta: Low-cost long-range strike weapons (Shahed/Geran-class, cheap cruise missiles): cost-driven design and kinemat -> primary mil:M9.9. Teach: (see subtopic) (P6b)

**M6.12 Tactical missile conceptual design (Fleeman B13): drivers, sizing, propulsion trades, heat**
- K deepen: Cost of missiles: unit cost drivers, production rate effects. Teach: Unit cost drivers, learning-curve and production-rate effects; cost vs weight regression; current unit prices (PAC-3, SM-6, Tamir, Shahed) from open budget docs (P-1/P-40 exhibits). (P6b)
- K deepen: Solid vs liquid motors; boost-sustain; pulse motors. Teach: Boost-sustain and pulse motors, grain geometry -> thrust profile, burn time vs boost-phase vulnerability. Fleeman ch.3 covers all. (P6b)
- K deepen: Air-breathing: turbojet/turbofan, ramjet, scramjet. Teach: Ramjet Isp vs Mach curve, temperature limit, inlet options; scramjet limits; compare with turbojet for cruise missiles. (P6b)
- K deepen: Aerothermal heating at high Mach. Teach: Stagnation temperature ~ T(1+0.2M^2); dome/radome heating limits for interceptors and hypersonic cruise; heat load vs flight time. (P6b)
- K deepen: Tactical missile conceptual design as a module (Fleeman B13): add the book to the syllabus via OCR. Teach: (see subtopic) (P6b)
- K new: Design drivers and measures of merit (range, speed, Pk, cost, weight, signature). Teach: Measures of merit and how range/speed/Pk/cost/weight/signature trade; MG wrongly saw no source: Boord-Hoffman 6.5 gives the interceptor-only version. (P6b)
- K new: Missile sizing rules of thumb. Teach: Fleeman sizing rules: diameter vs range/drag, L/D, weight fractions, propellant fraction vs range, wing sizing for maneuverability, Breguet for ramjets; spreadsheet-level sizing. (P6b)
- K new: Solid rocket motor industrial base (energetics bottleneck). Teach: SRM industrial base: energetics suppliers, ammonium perchlorate, single-source bottleneck, surge timelines (open GAO/CSIS reports). (P6b)

**M7.1 The AMD problem and MOEs**
- K deepen: Probability of raid annihilation (PRA) and leakage. Teach: The PRA term and the closed form PRA = (1-(1-Pssk)^n·...)^N with reliability and detection factors; naval self-defense PRA requirement framing. (P6b)
- K deepen: Value-of-defended-asset framing vs cost-per-shot. Teach: Value of defended asset, denial value, deterrence framing. (P6b)
- K deepen: Saturation raids and attacker salvo optimization. Teach: Attacker salvo optimization vs fire channels, simultaneous-engagement limits. (P6b)
- K delta: Cost-exchange ratio: definitions and pitfalls -> primary mil:M3.13. Teach: Formal cost-exchange ratio definitions, the asset-value vs cost-per-shot argument, marginal cost at margin (Glaser-Kaysen), worked numbers. (P6b)
- K delta: Interceptor production rates and inventory depletion -> primary mil:M10.5. Teach: Interceptor production rates (PAC-3, SM-3/6, THAAD, Arrow, Tamir) vs consumption; depletion curves. (P6b)
- K new: Mixed raids (drones + cruise + ballistic) timing and composition. Teach: Mixed raids: timing so drones/cruise/ballistic arrive together, sensor/weapon channel saturation, decoy-drone use (Iran April 2024 / Oct 2024, Russian raids on Ukraine). (P6b)
- K new: Human-on-the-loop automation and decision timelines. Teach: Human-on-the-loop for AMD: decision time vs threat timeline, auto-engage modes (Aegis, Patriot), automation bias (cross-ref C4.4.3). (P6b)
- K new: Checking interceptor-performance claims (Patriot 1991 Postol/Lewis debate, 2024 Iran raids, Ukraine) (merged: M:CRAFT.2.2 (P7_), M:ACQ.3.4 (P7_)). Teach: (see subtopic) (P6b)

**M7.2 AMD system requirements**
- K deepen: Requirements hierarchy: KPP/KSA, MOE/MOP/TPM. Teach: DoD specifics: KPP/KSA, threshold/objective values, JCIDS; MOE->MOP->TPM chain on a military example. (P4_)

**M7.3 Preliminary design**
- K deepen: SHORAD and MANPADS. Teach: Western/own SHORAD and MANPADS engagement envelopes, IR seeker vs flares link (M4.10), lessons from Ukraine. (P6b)
- K deepen: IAMD battle management: track management, threat evaluation and weapon assignment (TEWA). Teach: TEWA as explicit decision problem (threat ranking, weapon-target assignment, sequential assignment), track management in IAMD. (P6b)
- K deepen: Fire-control channels and simultaneous-engagement capacity (illuminators, uplinks, launch rate). Teach: (see subtopic) (P6b)
- K new: Correlated failures and common-mode in layered defense. Teach: Correlated failures: shared sensor/C2 between layers, common decoy discrimination failure → layered Pk far below independence product; Garwin/Wilkening-style critique. (P6b)
- K new: C-RAM/rocket defense: impact point prediction, selective engagement. Teach: C-RAM: impact-point prediction from radar track, selective engagement (only threats to defended area), Iron Dome economics logic, gun/laser vs missile interceptors. (P6b)

**M7.4 Trades and allocation + raids, magazines and cost-exchange**
- K deepen: Optimal interceptor allocation across layers and targets. Teach: Optimal allocation of interceptors across layers and targets (Bellman/marginal return) only implicit. (P7_)
- K delta: Attacker-defender cost models (who wins the marginal dollar) -> primary mil:M3.13. Teach: Cost-exchange done right: attacker cost per target vs defender cost per protected value, marginal-dollar rule, value-of-asset denominator, Iron Dome/Iron Beam arithmetic. (P7_)
- K delta: Munitions expenditure in high-intensity war vs stockpiles -> primary mil:M10.5. Teach: Expenditure rates (Ukraine 155 mm ~5-20k/day vs US production), interceptor expenditure vs stock (Israel 2024, Red Sea SM-2/SM-6), magazine depth as strategic variable. (P7_)
- K delta: Kill-chain time-sensitive targeting model (F2T2EA durations, dwell vs exposure time, probability chain) -> primary mil:M7.9. Teach: (see subtopic) (P7_)
- K delta: Interception rate and kill claim analysis (denominators, definitions) -> primary mil:M7.1 [evidence: intercept-claim denominators in AMD]. Teach: Interception-rate claims: denominators (engaged vs launched vs threatening), definitions of kill, partial intercepts. (P7_)
- K new: Queuing/saturation models of defenses (servers = fire channels). Teach: Queuing/saturation model of a defense: fire channels as servers, engagement time, Erlang-loss leakage vs raid size and arrival spread. (P7_)
- S deepen: Weapon-target assignment. Teach: Formal weapon-target assignment (static WTA as nonlinear integer program, greedy/marginal-return heuristic, dynamic WTA in AMD battle management) is not stated as such. (P7_)
- S deepen: Modeling C2 delay and decision latency. Teach: C2 latency in kill-chain models partially via AMD timeline; no general model. (P7_)
- C C: Israel 2023-25: multi-front AMD, Iran salvos, intercept stats [decision: Israel 2023-25 -> C mention]. Teach: Israel 2023-25: multi-front AMD, Iran salvos April/Oct 2024, June 2025, intercept statistics. (P7_)

**M7.6 BMD intercept and countermeasures**
- S deepen: Space-based interceptors debates (physics and numbers). Teach: Absentee ratio, constellation size vs response time (Golden Dome debate 2025). (P6b)
- S deepen: Defense vs offense dominance over time. Teach: Historical offense-defense balance arguments. (P6b)
- S deepen: Divert and attitude control (DACS) and IIR seekers for HTK kill vehicles. Teach: (see subtopic) (P6b)

**M7.8 Ground-based early warning radar**
- K deepen: Ground-based radar survivability vs ARMs and drones. Teach: ARM survivability measures (decoys, blinking, displacement times), loitering-munition threat to radars (Harop, Lancet), loss data from Ukraine (P5_)
- K deepen: Space-based sensors (IR early warning, tracking layers). Teach: Space tracking layers (SBIRS/OPIR, HBTSS, PWSA) and their role vs HGVs. (P6b)
- S deepen: Ionospheric propagation (HF, OTH radar, scintillation). Teach: OTH radar (skywave) performance: range 1000-3000 km, resolution, Doppler-only targeting, examples (Jindalee, Container/Kontainer, Chinese OTH) - only mentions (P5_)
- S deepen: Mobility, emplacement time and radar netting. Teach: emplacement/displacement times, shoot-and-scoot for radars, netting of multiple radars (P5_)
- S new: Ballistic-missile warning and civil-defense timelines (warning time vs shelter time). Teach: (see subtopic) (P6b)

**M7.9 Link 16, C2 and networked warfare**
- K deepen: Cooperative Engagement Capability-class composite tracking. Teach: CEC/IBCS: composite tracking, engage-on-remote, timing/registration requirements, data rates (P5_)
- K deepen: Datalink latency and message timeliness budgets. Teach: end-to-end latency budget sensor->C2->shooter; track staleness vs target speed (P5_)
- K deepen: Tactical radio networks: CNR/MANET waveforms, range-throughput-latency trade, relay (merged: P2_:Tactical/MANET networking and SATCOM/LEO (P2_)). Teach: MANET concepts, throughput vs hops, examples (P5_)
- K delta: Fratricide and IFF in AMD (Patriot 2003 lessons) -> primary mil:M8.4. Teach: Patriot 2003 fratricides, IFF/ROE, automated engagement modes. (P6b)
- K new: Resilience: degraded, intermittent, limited bandwidth (DIL). Teach: DDIL operations: store-and-forward, mission command, graceful degradation design (P5_)
- K new: Engage-on-remote / launch-on-remote. Teach: Engage/launch-on-remote, CEC composite tracking, sensor-shooter decoupling, latency and track quality requirements. (P6b)
- K new: Kill-chain timing: time-critical targets, dwell vs latency. Teach: Time-critical targets: dwell vs latency model, P(target still there). (P6b)
- K new: Sensor-to-shooter latency budgets end-to-end. Teach: End-to-end sensor-to-shooter latency budget (detection, processing, decision, communication, flight). (P6b)
- K new: Processing, exploitation, dissemination (PED) bottlenecks. Teach: PED bottleneck: analyst-hours per sensor-hour, data volume vs bandwidth, AI triage. (P6b)
- K new: Automation bias and human-machine teaming. Teach: Automation bias, human-machine teaming, workload; Patriot 2003 as case. (P6b)
- K new: C2 philosophies: centralized vs mission command, in a degraded spectrum. Teach: Centralized vs mission command under EW/comm denial; quantitative link to latency. (P6b)
- K new: Dynamic targeting and time-sensitive targeting (merged: P6b:ADD.10 (P6b), P7+.2 (P7_)). Teach: Dynamic/time-sensitive targeting process and timelines. (P6b)
- S deepen: Network-centric warfare theory and its critiques. Teach: critiques of NCW (Vego, 2003-2010 debate, OIF lessons) (P5_)
- S deepen: Cyber vulnerabilities of weapon-system networks. Teach: cyber vulnerability of weapon-system networks (GAO-19-128 style) (P5_)
- S deepen: Kill webs and mosaic warfare concepts. Teach: Kill webs/mosaic concepts and critique. (P6b)
- S deepen: ISR collection disciplines (IMINT, SIGINT, MASINT, HUMINT, OSINT). Teach: Collection-discipline taxonomy. (P6b)
- S new: LPI/LPD datalinks for stealth platforms (MADL, IFDL). Teach: LPI/LPD directional datalinks for stealth fleets (MADL/IFDL), interoperability gap with Link 16 (P5_)
- S new: Crypto, key management and COMSEC basics. Teach: COMSEC basics, key management, crypto in datalinks; consequences of unencrypted comms (P5_)
- S new: F2T2EA kill chain and find/fix/finish. Teach: F2T2EA definitions; find/fix/finish; kill chain as series reliability product (cross-ref B15 ch.9). (P6b)
- S new: Decision cycles (OODA) and tempo quantification. Teach: OODA and its critique; tempo metrics. (P6b)
- S new: JADC2/CJADC2 and similar multi-domain C2 programs: claims vs measurable latency. Teach: (see subtopic) (P6b)

**M7.10 Systems engineering lifecycle + T&E and test evidence**
- K deepen: DT&E vs OT&E vs LFT&E [evidence]. Teach: LFT&E present via Ball; DT&E vs OT&E distinction and DOT&E role missing. (P7_)
- K delta: Small-sample statistics: test results with few shots -> primary eng:M27.3 [evidence: few-shot statistics in T&E]. Teach: Binomial confidence bounds from few shots (Clopper-Pearson, rule of three: 0/n failures gives ~3/n), Bayesian beta update, sequential testing; why "9 of 10 intercepts" means Pk in [0.55,0.997]. (P7_)
- K delta: Combat data as evidence: claims vs verified intercepts -> primary mil:M7.1 [evidence]. Teach: Claims vs verified intercepts (Patriot 1991 Postol debate, Iron Dome), definitions of "intercept". (P7_)
- K new: Test realism: scripted tests, threat representativeness [evidence]. Teach: Scripted vs operationally realistic tests, threat-representative targets, test-target gaming (BMD tests). (P7_)
- K new: Reading test reports and budget documents critically [evidence]. Teach: Reading DOT&E annual reports, GAO, budget books critically (MG partial on B04 was off-target). (P7_)

**M8.1 Military air roles**
- K deepen: Battle management aircraft (AEW&C, JSTARS) vs space alternatives. Teach: Battle management aircraft vs space alternatives (E-7 debate), survivability vs long-range SAMs. (P6b)
- K deepen: Airborne ISR (MALE UAS, manned SIGINT, AEW) capabilities and vulnerabilities. Teach: Vulnerability of MALE/manned ISR to modern AD (Ukraine, Yemen MQ-9 losses). (P6b)
- S deepen: Fighter generations and capability discriminators. Teach: Generation taxonomy and real discriminators (signature, sensor fusion, networking, range/payload), 6th-gen programs, J-20/Su-57 assessment (P6a)

**M8.2 Avionics architectures**
- S deepen: Real-time and embedded systems, determinism, WCET. Teach: Deterministic scheduling (rate-monotonic), WCET, jitter budgets in control loops. (P4_)

**M8.4 Transponders and IFF**
- K deepen: Combat identification: IFF Mode 4/5, NCTR, fratricide data; cross-ref M8.4 (merged: M:AMD.6.3 (P6b)). Teach: check by C4ISR panel (P5_)

**M8.7 Vehicle management systems**
- S deepen: Reliability block diagrams, redundancy, k-of-n. Teach: k-of-n, standby redundancy with switching reliability (P3_)

**M8.8 Combat survivability (Ball): susceptibility, vulnerability, kill trees, mission and campai**
- K deepen: Survivability = 1 - susceptibility x vulnerability. Teach: Material exists but is NOT linked to any module: the core of Ball is outside the syllabus (P6a)
- K deepen: Kill chain from threat's view (search-detect-track-engage-hit-kill). Teach: Link B16 1.1 chain to the new module; teach the threat kill chain as product of conditional probabilities and where each countermeasure acts (P6a)
- K deepen: Mission attrition rate and campaign survivability (merged: ADD:SUR.1 (P6a), P7+.11 (P7_)). Teach: Modern loss-rate data (Ukraine air war, 1991, 2003) to calibrate (P6a)
- K delta: FMECA, critical components, kill trees, P(k/h) -> primary eng:M27.4. Teach: Link B16 5.1-5.2 and ch.2 (P6a)
- S deepen: Rotary-wing survivability (MANPADS, small arms, low-level flight). Teach: Loss data and countermeasures (DIRCM) (P6a)

**M8.9 Air campaign capacity: sortie generation, basing and air-base attack, tankers**
- K new: Air base attack and resilience (runway cratering, shelters, dispersal). Teach: Runway cratering and repair time, hardened shelters, dispersal (ACE), missile threat to bases (PLARF), sortie degradation models (P6a)
- K new: Tanker and range constraints. Teach: Combat radius vs tanker offload (Breguet), tanker vulnerability, Pacific distances (P6a)
- K new: Sortie generation rate and its drivers (turnaround, basing distance, tanker support) [merged with P6a air-campaign module] (merged: M:SUR.5.1 (P6a), M:OR.11.3 (P7_), M:OR.11.4 (P7_)). Teach: (see subtopic) (P7_)

**M9.2 Air vehicle performance and propulsion**
- K deepen: Payload-endurance-cost trade. Teach: Explicit sizing loop: payload mass fraction -> gross weight -> endurance -> unit cost; worked trade curves (P6a)

**M9.3 Control station and autonomy**
- S deepen: Swarm concepts: coordination, communication needs, real state. Teach: Coordination/communication scaling of swarms; real fielded state vs claims (P6a)
- S new: Drone navigation without GNSS (visual odometry, terrain/scene matching, CRPA antennas). Teach: Methods, accuracy, EW resistance (P6a)
- S new: International humanitarian law and weapons review (Art. 36) [NEW-Q3 dropped; IHL/Art.36 kept S with autonomy in M9.3]. Teach: IHL distinction/proportionality, Art. 36 weapons review, autonomy debate. (P7_)

**M9.4 Payloads**
- K deepen: Terminal guidance autonomy (machine vision lock-on) under EW. Teach: Terminal ("last-mile") visual lock-on autonomy under jamming; ATR error rates and their consequences; Fiber-optic-controlled drones as the counter-EW response; Link to Gilua E17 learned perception (P6a)

**M9.7 Drone detection and C-UAS**
- K deepen: Commercial radios, FHSS hobby links and their jamming/geolocation. Teach: COTS 2.4/5.8 GHz drone links (OcuSync-class), their jamming and geolocation (Aeroscope), video link frequency shifts in Ukraine (P5_)
- K deepen: Small-drone radar/RF detection specifics (RCS -20..-30 dBsm, birds discrimination) - cross-ref C-UAS panel. Teach: handled by C-UAS panel (P5_)
- K deepen: Detection: radar, RF, EO/IR, acoustic; small-RCS problem. Teach: Quantitative detection range for RCS 0.001-0.01 m2 (R ~ sigma^1/4) and low/slow clutter; RF detection fails against autonomous and fiber-optic drones; acoustic ranges (P6a)
- K deepen: Defeat: jamming, spoofing, guns, missiles, lasers, interceptor drones, nets. Teach: Physics and numbers per defeat: laser power/dwell (tens of kW, seconds), HPM range, gun Pk vs small targets (airburst), interceptor drones; Layered defense design (P6a)
- K deepen: Counter-UAS layered approaches. Teach: Owned by C-UAS panel. (P6b)
- K delta: C-UAS cost-exchange and layered economics -> primary mil:M3.13. Teach: Cost-exchange ratio model and magazine depth; layered cost-per-intercept economics (P6a)
- K new: Fiber-optic controlled drones as EW counter. Teach: fiber-optic FPV drones: spool length/weight, immunity to RF jamming, counter-measures (P5_)

**M9.9 One-way attack drones, FPV and drone-war economics (Shahed-class, FPV, fiber-optic, mass p**
- K deepen: Attritable vs exquisite: cost per effect. Teach: Cost-per-effect formalism: platform cost x loss rate + munition cost per target killed; Mass vs quality (link Lanchester square law), attritable CCA concepts, Ukraine data (P6a)
- K deepen: Loitering munition design and kill chain. Teach: Design trade: warhead mass vs range vs loiter time vs seeker vs datalink; Kill chain timing and effectiveness data (Harop, Lancet, Switchblade 600) (P6a)
- K deepen: EW vs drone datalinks: J/S geometry for control/video links, frequency agility, relays, fiber-optic tethers. Teach: Application to FPV/Group 1-2 links; fiber-optic drones (P6a)
- K deepen: Ukraine 2022-: drones, EW, artillery, air defense economics [NEW-C3 dropped; Ukraine lessons distributed (M9.9, M4.1, M14.3)]. Teach: D5 mentions Ukraine; a systematic lessons module (drones, EW, artillery, AD economics) missing. (P7_)
- K new: FPV drones: kill rates, supply, operator training, EW cycle. Teach: FPV kill chain, hit-rate estimates, production volumes, operator training pipeline; EW <-> counter-EW cycle (frequency agility, relays, fiber-optic, terminal autonomy) (P6a)
- K new: Mass production and supply chains of drones. Teach: Mass production and supply chains (motors, batteries, cameras, Chinese components), unit cost learning curves (P6a)
- K new: Shahed-class one-way attack drones: cost, range, raid sizes (merged: P6b:ADD.3 (P6b)). Teach: Shahed-136/Geran-2 design (piston engine, ~40-50 kg warhead, ~1,500-2,500 km, unit cost tens of $k), navigation (GNSS+CRPA), production; Raid size, saturation and interception statistics (Ukraine 2022-26, Israel April 20 (P6a)
- S new: UGVs: logistics and combat roles. Teach: UGV logistics/casevac/combat roles, mobility and comms limits, Ukraine use (P6a)
- S new: Nagorno-Karabakh 2020: drones vs legacy air defense [NEW-C3 dropped]. Teach: Nagorno-Karabakh 2020 (MG partial off-target). (P7_)
- C C: Proxy capabilities (Hezbollah, Houthis, Iraqi militias): rockets, drones, ASCMs [decision: region -> C mention]. Teach: Hezbollah rockets/ATGM/drones, Houthi ASBM/ASCM/drones, Iraqi militias. (P7_)
- C C: Technology transfer channels and reverse engineering [decision: region -> C mention]. Teach: Tech transfer (Iran-Russia Shahed/Geran, DPRK), reverse engineering, sanctions evasion. (P7_)

**M10.3 Sonar systems and non-acoustic detection**
- K deepen: ASW search and barrier models. Teach: Link B14 7.4 barrier patrol (pp.146-148) and 7.6 (pp.154-161) to M10.3; ASW applications (datum search, sonobuoy patterns, barrier vs transiting SSN) (P6a)
- K new: Submarine vs surface fleet balance and undersea advantage. Teach: Undersea advantage: SSN/SSK capabilities, AUKUS, Chinese ASW gap, submarine vs surface survivability under missile threat (P6a)
- S new: UUVs and seabed warfare. Teach: UUV energy/endurance underwater, navigation and acoustic-comms limits (bits/s), seabed warfare and cable/pipeline vulnerability (P6a)
- S new: Seabed infrastructure (cables, pipelines) vulnerability and protection. Teach: Cable network facts, repair capacity, sabotage incidents (Nord Stream, Baltic 2023-25) (P6a)

**M10.5 Ship self-defense**
- K deepen: Ship self-defense layers vs ASCM. Teach: Modern layers with numbers (SM-2/SM-6/ESSM/RAM/CIWS ranges, Pk, reaction time); Red Sea 2023-25 and Moskva lessons; cost per intercept (P6a)
- K deepen: Anti-ship ballistic missiles and long-range kill chains. Teach: ASBM specifics (DF-21D/DF-26 terminal seeker, MaRV), OTH targeting chain (space ISR, OTH radar, SIGINT) and its disruption (P6a)
- K deepen: Over-the-horizon maritime targeting kill chain (find-fix-track-target at sea). Teach: End-to-end chain with latencies; counter-targeting (P6a)
- K new: USVs (Black Sea attack drones) and their defense. Teach: Attack USVs (Magura, Sea Baby) vs Black Sea Fleet: design, guidance, detection difficulty (low freeboard/RCS), defense by guns/helicopters, cost exchange (P6a)
- K new: Ship vulnerability: how many hits to put out of action (staying power). Teach: Ship staying power: hits to put out of action vs displacement (historical data), damage control; Hughes salvo model link (NAV.4.2) (P6a)
- K new: Littoral threats (coastal missiles, drones, mines) to navies. Teach: Littoral A2/AD: coastal ASCM batteries, drones, mines vs navies (Black Sea, Red Sea, Taiwan Strait) (P6a)
- K new: Hughes salvo model and staying power (merged: M:OR.13.1 (P7_), M:OR.4.5 (P7_)). Teach: Hughes salvo equations (striking power, staying power, defensive power, scouting), "fire effectively first", stochastic critique (Armstrong) (P6a)
- K new: VLS reload at sea and magazine constraints (merged: M:MSL.12.4 (P6b), M:AMD.5.4 (P6b), M:LOG.2.1 (P7_), P7+.5 (P7_), M:AMD.5.3 (P6b)). Teach: VLS magazine depth, at-sea reload limits, magazine-depth vs salvo-size arithmetic (P6a)
- S deepen: Ship signatures and EMCON at sea. Teach: Integrated ship signature management; EMCON tactics vs passive ESM/OTH targeting (P6a)
- S deepen: CIWS and gun-based defense; programmable ammunition. Teach: Gun engagement math: dispersion, rounds per kill, programmable airburst (AHEAD) vs drones. (P6b)
- S new: Distributed maritime operations and fleet architecture debates. Teach: Distributed maritime operations, numbers vs quality, unmanned fleet architecture debates (P6a)
- C C: Red Sea/Houthi campaign: naval AMD and costs [decision: Red Sea -> C mention]. Teach: Red Sea/Houthi campaign: naval AMD, interceptor costs, shipping effect. (P7_)

**M11.2 Weapon-locating radar and counterfire**
- K new: Battle damage assessment and its biases. Teach: BDA methods, overclaiming biases (1991 Scud, Kosovo decoys), statistical treatment. (P6b)
- S deepen: Joint targeting cycle and target development. Teach: Joint targeting cycle phases. (P6b)
- S new: Collateral damage estimation methodology. Teach: CDE methodology levels. (P6b)

**M11.6 Tank protection**
- K deepen: Armored vehicle survivability onion (don't be seen... don't be killed). Teach: Explicit layered "onion" (not seen / not acquired / not hit / not penetrated / not killed) mapped to Ball's susceptibility x vulnerability; Top-attack and drone threat to armor, cages, APS performance (P6a)
- S deepen: Armor and impact mechanics bridge: penetration scaling, areal density, ceramic/composite armor. Teach: ENG basis for Lanchester protection: impact energy, areal-density comparison, why ceramics + backing (P3_)
- S new: Signature management of ground vehicles (thermal, acoustic). Teach: Thermal/acoustic/visual signature management of ground vehicles (multispectral camouflage, exhaust cooling) (P6a)
- S new: Crew survivability vs vehicle kill (mobility/firepower/catastrophic kills). Teach: M/F/K-kill definitions for AFVs, crew survivability (ammunition compartmentalization, blow-out panels), turret-toss data (P6a)

**M11.10 Nuclear weapons and effects**
- S deepen: High-power microwave weapons and EMP effects on electronics. Teach: HPM weapons (Leonidas-class), coupling front/back door, range scaling, vs drones (P5_)

**M12.1 Russian air defense and EW**
- K deepen: SEAD/DEAD concepts and history (Bekaa 1982, Desert Storm, Kosovo, Ukraine). Teach: SEAD/DEAD case history and lessons: 1973, Bekaa 1982, Desert Storm, Kosovo 1999, Ukraine 2022-; attach Ball 61-70 as ref (P5_)
- K deepen: Integrated air defense system architecture and its seams. Teach: IADS seams: sensor-shooter networks, C2 nodes, radar horizon gaps, mobility; analytical decomposition (P5_)
- K deepen: EW order of battle and density on modern fronts. Teach: EW density/order of battle on modern fronts (Ukraine: systems per km of front), Chinese EW OOB (P5_)
- K deepen: Reconnaissance-strike/fire complexes. Teach: Concept spread across D5 and partly in adv M12.2; Ogarkov origin and 2022 Lancet/Orlan practice missing. (P7_)
- S deepen: SEAD force ratios and attrition expectations. Teach: historical SEAD loss rates/force ratios (P5_)
- S deepen: Desert Storm/Kosovo/2006: classic case studies (SEAD, stealth, Scud hunt) [NEW-C3 dropped; SEAD history in M12.1 (2006 as C)]. Teach: Air-loss view only; SEAD, Scud hunt, stealth, 2006 Lebanon missing. (P7_)

**M12.3 Chinese joint capabilities**
- K deepen: Kill-chain disruption as strategy (system destruction warfare). Teach: Both sources are in advanced-tier modules; operational modelling of kill-chain disruption missing. (P6b)
- K deepen: PLA systems confrontation / systems destruction warfare. Teach: Systems confrontation/systems destruction warfare at campaign level is only in an adv module at tactical level. (P7_)
- K deepen: PLARF missile forces and A2/AD kill chain. Teach: PLARF inventory (DF-21D/26/17), A2/AD kill chain vs carriers (OTH radar, Yaogan) missing. (P7_)
- K deepen: PLA air, naval and space/counterspace capabilities. Teach: Counterspace (ASAT 2007, co-orbital), PLAN numbers missing. (P7_)

**M13.2 Space mission engineering process**
- S deepen: Systems of systems and mission engineering. Teach: Mission engineering, SoS types (directed/acknowledged/collaborative/virtual), emergent SoS behaviour (P3_)

**M13.3 The space environment**
- K deepen: Debris and Kessler syndrome; ASAT test consequences. Teach: Kessler cascade: critical density and self-sustaining fragmentation altitudes; ASAT tests and their debris (FY-1C 2007, USA-193 2008, Mission Shakti 2019, Kosmos-1408 2021): debris lifetime vs altitude; Mega-constellatio (P6a)

**M13.4 Orbits and astrodynamics**
- S deepen: Perturbations: J2, drag, sun-synchronous orbits. Teach: J2 nodal regression, sun-synchronous condition, drag decay lifetime scaling (P3_)

**M13.7 Cost, financing, law**
- K deepen: Cost estimation: parametric, analogy, bottom-up, learning curves (merged: M:ACQ.2.3 (P7_), A-J2 (P3_)). Teach: Parametric CERs, analogy, bottom-up, learning curves (Wright 85-95%), cost-estimate uncertainty and growth (P3_)

**M13.9 Space payloads**
- K deepen: SIGINT and RF geolocation constellations. Teach: Space-based RF geolocation: formation-flying TDOA/FDOA from LEO, accuracy vs baseline and SNR; History/roles: ELINT satellites (GRAB, NOSS-type ocean surveillance), commercial RF sensing (HawkEye 360) and its use against (P6a)

**M13.10 Communications payloads and SATCOM**
- K deepen: Commercial proliferated SATCOM (Starlink-class) in war (merged: ADD:SP.2 (P6a)). Teach: Starlink-class use in war: terminals, jamming resistance, geolocation of terminals, dependence on a private actor (P5_)
- S deepen: Protected military SATCOM (AEHF/MUOS/PTS-class), anti-jam SATCOM: hopping, nulling, processing payloads. Teach: protected SATCOM architecture and numbers (P5_)

**M13.11 Observation payloads**
- K deepen: Missile warning and tracking IR satellites. Teach: Physics of plume detection from GEO/HEO/LEO (SWIR/MWIR, solar-blind band, Earth background clutter, revisit/latency); Architecture evolution DSP -> SBIRS -> Next-Gen OPIR -> proliferated tracking layer (PWSA/HBTSS) and w (P6a)
- K deepen: Commercial imagery and analytics market. Teach: Today's commercial EO/SAR/RF market: players, price per image, resolution/revisit tiers, analytics; Use of commercial imagery in Ukraine/Gaza; shutter control and licensing; dependence risk (P6a)
- K deepen: Persistence, revisit, coverage trade across platforms. Teach: Persistence/revisit/coverage trade across satellites, HALE/MALE, aerostats. (P6b)
- K deepen: Space-based ISR for tactical targeting (latency, tasking). Teach: Tasking-to-delivery latency, commercial constellations, revisit for mobile targets. (P6b)
- K new: Commercial space ISR and OSINT imagery in wars (EO/SAR constellations, revisit, latency). Teach: (see subtopic) (P6b)

**M13.12 Rocket propulsion and launch vehicles**
- K deepen: Launch vehicle performance and cost per kg trends. Teach: Cost-per-kg trend after 2011 (Falcon 9 reuse, Starship projections), launch cadence, Chinese commercial launchers (P6a)
- S deepen: Responsive launch and reconstitution. Teach: Tactically responsive space (e.g. Victus Nox), reconstitution after ASAT attack, on-orbit spares (P6a)
- S new: In-space and electric propulsion (missing SMAD ch.18). Teach: Isp vs thrust, Hall thrusters, maneuverable satellites, station-keeping budgets (P6a)

**M13.17 Manufacturing, risk and reliability**
- K deepen: Reliability basics: failure rate, MTBF, bathtub curve, exponential/Weibull. Teach: In ENG text only chip-level; the general treatment is in Lanchester B15 ch.9 (readable text) (P3_)

**M13.23 Space control: counterspace taxonomy, SDA, RPO, resilience and proliferation, commercial d**
- K deepen: Counterspace taxonomy: kinetic, co-orbital, directed energy, EW, cyber. Teach: Taxonomy: direct-ascent kinetic, co-orbital (RPO), directed energy (dazzle/blind), RF jamming/spoofing, cyber, ground-segment attack; Physics of each: DA-ASAT reach from BMD-class interceptors (link M6.8/M7.6), co-orbita (P6a)
- K deepen: Space domain awareness: sensors and catalog. Teach: Optical/telescopic GEO surveillance and its limits (sunlight, weather); Catalog maintenance, orbit determination and covariance; conjunction probability (Pc); Object characterization (light curves, ISAR); commercial SDA  (P6a)
- K deepen: Resilience via proliferation, maneuver, disaggregation. Teach: Proliferated LEO architectures (SDA PWSA, Starlink/Starshield) as a resilience argument, with cost-exchange vs ASAT; Maneuver, on-orbit spares, hosted payloads, multi-orbit diversity; Starlink in Ukraine: jamming and res (P6a)
- K deepen: Commercial-military integration and dependency. Teach: Military dependence on commercial SATCOM/imagery (Starlink, Maxar) and legal status of commercial satellites as targets; Contracting models (data buys, Starshield), shutter control, wartime reliability (P6a)
- K deepen: Satellite relative motion and RPO (Clohessy-Wiltshire): inspector and co-orbital operations. Teach: Application to RPO/co-orbital ASAT timelines and delta-v (P6a)
- K delta: Mega-constellations (Starlink/Guowang): capacity, economics, military use and vulnerability -> primary mil:M13.10. Teach: 2019-2026 constellation data, user terminals, jamming resistance (P6a)
- S new: Space-object signatures and detectability (optical brightness, RCS of satellites). Teach: Visual magnitude vs size/altitude; stealthy satellites claims (P6a)

**M14.1 Combat modeling: model types and MOEs, Lanchester and salvo attrition, exchange ratios, mo**
- K deepen: MOE/MOP selection and the 'measure what matters' problem. Teach: Domain MOEs exist (AMD, survivability) but the general "measure what matters" problem (MOE vs MOP hierarchy, proxy metrics, Goodhart, MOE chosen to favor a system) is not taught anywhere. (P7_)
- K deepen: Breakpoints and force ratio rules (3:1, etc.) critique [attrition: 3:1 critique]. Teach: The 3:1 rule, its origin, Mearsheimer-Epstein debate, Dupuy force-ratio-vs-outcome data and breakpoint (casualty threshold) data are missing. (P7_)
- K deepen: Exchange ratios and loss-exchange analysis [attrition: exchange ratios]. Teach: Formula present; missing loss-exchange analysis practice: air-to-air exchange ratios by era (Korea, SEA, 1973, 1982 Bekaa), tank exchange ratios, how to read claimed ratios. (P7_)
- K deepen: Campaign analysis (Joint Campaign Analysis method). Teach: Joint Campaign Analysis method (NPS OA4602 style: back-of-envelope campaign with sortie rates, attrition, logistics) missing; FATHM is in an adv module. MG match to D6 was off-target. (P7_)
- K deepen: Wargame design and adjudication; matrix games [evidence: wargames] (merged: M:OR.6.3 (P7_)). Teach: Missing: wargame design (objectives, scenario, adjudication: rigid/free/matrix, cell structure), matrix games, analytic vs educational games, data capture. (P7_)
- K deepen: Decision theory, expected value, value of information. Teach: Military side: value of information of ISR (EVPI of a scouting asset), decision trees for targeting are not taught. (P7_)
- K delta: Fermi estimation and back-of-envelope checking discipline for defense quantities -> primary mil:M0.1. Teach: (see subtopic) (P7_)
- K delta: Physics sanity checks of performance claims (range, speed, accuracy) -> primary eng:M27.5 [evidence: physics sanity checks of claims]. Teach: Distributed across lessons (rule 38-40); missing a dedicated method (range from rocket equation, speed from video frames, CEP from imagery) as a checklist. (P7_)
- K delta: Historical loss rates per day/sortie by era -> primary mil:M8.9. Teach: Air loss rates by era present (Ball) but unmapped; ground/naval loss rates per day (Dupuy-style) and modern drone-era loss data missing. (P7_)
- K delta: Value of information and scouting effectiveness in salvo models -> primary mil:M10.5 [attrition: scouting/VoI]. Teach: Scouting effectiveness and VoI in the salvo model (Hughes: "fire effectively first"), detection-before-fire as decisive variable. (P7_)
- K delta: Missile stockpiles and production estimates of adversaries -> primary mil:M10.5. Teach: Estimating adversary missile stockpiles and production (OSINT: launch counts, factory imagery, budget docs). (P6b)
- K new: Survivorship and selection bias in combat data [evidence: survivorship/selection bias]. Teach: Survivorship bias (Wald), selection bias in released videos, reporting bias, denominator neglect - only implicit in Ball 5.2.1. (P7_)
- K new: Biddle's force employment theory. Teach: Biddle modern-system force employment (cover, concealment, dispersion, combined arms), 1991 Desert Storm test, relevance to Ukraine. (P7_)
- K new: Sensitivity analysis and tornado diagrams; finding the dominant parameter (merged: E:Mathematics |9.12 (P1_), E:Systems engi|2.2 (P3_)). Teach: (see subtopic) (P7_)
- S deepen: Verification, validation and accreditation (VV&A). Teach: MG "full" match on E08 2.2 is a false positive (numerical-code verification). Defense VV&A of combat models (accreditation for a use, face validity vs results validation, why combat models cannot be validated in the usua (P7_)
- S deepen: Design of experiments and exploratory modeling under deep uncertainty. Teach: DOE for simulation (factorial, Latin hypercube) and exploratory modeling/RDM under deep uncertainty are missing in both libraries (MG "full" is a false positive). (P7_)
- S new: Dupuy QJM/TNDM and empirical combat data critique. Teach: Dupuy QJM/TNDM (OLI, combat effectiveness value), its critique. (P7_)

**M14.2 Acquisition, cost and industrial base: cost definitions, LCC, learning curves, budgets as **
- K deepen: Cost-effectiveness analysis (Przemieniecki). Teach: Military cost-effectiveness analysis (cost per target killed, equal-cost comparisons, Hitch-McKean) only partial; MG naming "Przemieniecki" is wrong (B15 has none). (P7_)
- K deepen: Technology and manufacturing readiness (TRL/MRL). Teach: TRL present (space/NASA); MRL, readiness gaming, valley of death missing. (P7_)
- K deepen: Life-cycle cost: RDT&E, procurement, O&S shares. Teach: Defense LCC shares (RDT&E ~10-20, procurement ~25-30, O&S ~55-70%) only via space/NASA; host is ref tier. (P7_)
- K delta: Learning curves and production-rate effects -> primary mil:M13.7. Teach: Wright learning curve and production-rate effects in a defense context (interceptors, F-35), quantity-unit-cost spiral. (P7_)
- K new: Budget process (PPBE) and budget documents as data sources. Teach: PPBE, budget justification books (P-1/R-1, P-40/R-2 exhibits) as data sources for quantities and unit costs; Israeli budget/FMF. (P7_)
- K new: Unit cost definitions (flyaway, APUC, PAUC). Teach: Flyaway vs weapon-system vs APUC vs PAUC, then-year vs base-year. (P7_)
- K new: Surge capacity, long-lead items, sole sources. Teach: Surge capacity, long-lead items (rocket motors, seekers), sole sources, ramp-up times (GMLRS, PAC-3 MSE, 155 mm). (P7_)
- K new: Critical materials and components (rare earths, energetics, microelectronics). Teach: Critical materials/components: rare earths, energetics (TNT, nitrocellulose), microelectronics, gallium/germanium export bans. (P7_)
- S deepen: Multi-criteria decision analysis and its pitfalls. Teach: Weighted-sum scoring pitfalls (rank reversal, double counting, scale effects) missing. (P7_)
- S deepen: Acquisition framework (DoD 5000/AAF; Israeli MAFAT/IMOD equivalents). Teach: 2003-era DoD 5000 only; Adaptive Acquisition Framework, MTA, Israeli IMOD/MAFAT/SIBAT process missing. (P7_)
- S deepen: Requirements process (JCIDS) and urgent operational needs. Teach: JCIDS/UON/IDF requirements process missing. (P7_)
- S deepen: Cost estimating methods (analogy, parametric, engineering). Teach: Analogy/parametric/engineering methods in defense; cost growth statistics. (P7_)
- S new: Inflation and currency adjustment. Teach: Constant vs then-year dollars, deflators, PPP and exchange-rate pitfalls (Russian/Chinese budgets). (P7_)
- S new: Defense industry structure (US, Europe, Israel, Russia, China). Teach: Industry structure (primes, consolidation; Israel IAI/Rafael/Elbit; Russian Rostec; Chinese NORINCO/CASC/CASIC). (P7_)
- S new: Commercial technology spin-in and startups. Teach: Spin-in, startups, commercial drones and components, DIU-style processes. (P7_)
- S new: Defense economics basics: defense spending as % GDP, PPP comparisons, burden sharing, US FMF to Israel. Teach: (see subtopic) (P7_)
- C C: ITAR/EAR and Wassenaar basics [decision: publication/export -> C mention]. Teach: ITAR/EAR, Wassenaar basics. (P7_)

**M14.3 Logistics and sustainment: consumption, LOC capacity, munitions vs stockpiles, readiness, **
- K deepen: Supply consumption rates and tonnage planning. Teach: Historical tonnage per division-day present (ref only). Modern consumption planning factors (Class III/V per brigade-day, ~tons per soldier-day) missing. van Creveld (B17) is ref-only (rule 37: not lesson material, not c (P7_)
- K deepen: Logistics as operational constraint: historical cases. Teach: Present as history but ref-only; Russian Kyiv 2022 failure as modern case missing. van Creveld (B17) is ref-only (rule 37: not lesson material, not coverage-checked), so even covered history is not taught. (P7_)
- K deepen: Attrition and replacement of platforms and crews. Teach: Replacement rates of platforms and crews, training pipeline as bottleneck missing. (P7_)
- K delta: Interceptor and munition production rate vs expenditure rate as a war-duration model (stock-flow) -> primary mil:M10.5. Teach: (see subtopic) (P7_)
- K new: Contested logistics under long-range fires. Teach: Contested logistics under long-range fires: depots in range of HIMARS/precision strike, dispersion cost, ports/airfields as targets. (P7_)
- K new: Logistics for drone/EW-heavy warfare (batteries, components). Teach: Drone/EW war logistics: batteries, components, attrition of FPV (tens of thousands/month), commercial supply chains. (P7_)
- S deepen: Lines of communication, distances and transport capacity. Teach: Modern LOC capacity (truck/rail/port throughput, the 2022 Russian rail dependence) missing. (P7_)
- S deepen: Fuel and ammunition as dominant tonnages. Teach: Modern shares (fuel ~50-70% of tonnage in mechanized ops; precision munitions lowering tonnage) missing. (P7_)
- S deepen: Readiness rates, maintenance cycles. Teach: Fleet readiness rates (mission-capable rates) and maintenance cycles missing. (P7_)
- S deepen: Maintenance, spare parts and depot capacity. Teach: Depot capacity and spare-parts pipeline missing. (P7_)
- S new: Airlift and sealift capacity arithmetic. Teach: Airlift/sealift arithmetic (million-ton-miles/day, C-17 payload x sorties, RoRo). (P7_)
- S new: Prepositioning and forward stocks. Teach: Prepositioning, forward stocks (e.g., WRSA-I in Israel). (P7_)
- S new: Fuel demand of modern forces. Teach: Fuel demand of modern forces (gallons/soldier-day trend). (P7_)

**M14.4 OSINT and capability assessment: imagery, geolocation, verification, ADS-B/AIS, OOB estima**
- K new: Order-of-battle estimation from open sources. Teach: OOB estimation from open sources (Oryx-type counting, imagery, IISS Military Balance limits). (P7_)
- K new: Net assessment approach. Teach: Net assessment (Marshall): asymmetries, long competition, diagnosis not prescription. (P7_)
- K new: Mirror-imaging and other analytic biases. Teach: Mirror-imaging, anchoring, confirmation, ACH; Oct 7 / 1973 conceptzia as case. (P7_)
- K new: Satellite imagery interpretation (vehicles, launchers, damage). Teach: Satellite imagery: resolution (GSD, NIIRS), vehicle/launcher signatures, BDA from imagery (links M13.11 observation payloads). (P7_)
- K new: Geolocation and chronolocation of photos/video. Teach: Geolocation/chronolocation (shadows, sun azimuth, terrain matching). (P7_)
- K new: Social media and video verification, deepfake awareness. Teach: Video verification, metadata, deepfake awareness. (P7_)
- S new: Measuring from imagery (photogrammetry, shadow lengths) and 3D modeling. Teach: Photogrammetry: missile dimension from imagery, shadow-length math (links M3.2 optics). (P7_)
- S new: Flight/ship tracking (ADS-B, AIS) and its spoofing. Teach: ADS-B/AIS tracking and spoofing (links M5.5 GNSS spoofing, M8.4 transponders). (P7_)
- S new: Scientific publication and patent analysis for capability. Teach: Publication/patent analysis for technology intelligence. (P7_)
- S new: Debris and fragment analysis for weapon identification. Teach: Debris/fragment analysis for weapon ID (Bellingcat-style: tail sections, serials). (P7_)
- S new: Source reliability grading and triangulation. Teach: NATO Admiralty code, triangulation, source independence. (P7_)
- C C: Archiving and chain-of-custody (Berkeley Protocol). Teach: Archiving, chain of custody (Berkeley Protocol). (P7_)
- C C: Hezbollah/Hamas tunnel and underground warfare and subterranean ISR [decision: region -> C mention]. Teach: (see subtopic) (P7_)

**M14.5 Writing and interviewing as an analyst (capstone): article structure, expert interviews, u**
- K new: Structuring an analytic article: question, model, assumptions, sensitivity. Teach: Analytic article: question, model, assumptions, sensitivity, bottom line (rule 35 analysis-design exercises train it implicitly). (P7_)
- K new: Explaining uncertainty and ranges to lay readers. Teach: Communicating uncertainty and ranges (words of estimative probability, Kent). (P7_)
- K new: Reading and critiquing think-tank reports (RAND, CSIS, IISS, INSS): method sections, assumptions, funding. Teach: (see subtopic) (P7_)
- K new: Interviewing technical experts: question design, detecting evasion (merged: A-J3 (P3_)). Teach: Interviewing: question ladders, detecting evasion, numbers verification, attribution rules. (P7_)
- S new: Visualizing technical data honestly. Teach: Honest charts (log scales, baselines, uncertainty bars). (P7_)
- S new: Using LLM/AI tools in analysis: verification of AI-produced numbers, hallucinated sources. Teach: (see subtopic) (P7_)
- C C: Prepublication review and military censorship; handling classified-adjacent info [decision: censorship -> C mention]. Teach: Prepublication review, Israeli military censorship rules, handling classified-adjacent info. (P7_)
- C C: Mosaic effect of aggregating open info [decision: mosaic effect -> C mention]. Teach: Mosaic effect of aggregation; responsible publication. (P7_)

## 5. Data fixes the library needs

1. **[eng] E07 Trefethen & Bau: Type-3 fonts with no Unicode map, lib/text/E07.json is garbage (only 17 pages have OCR images); M8.3-M8.10 (~330 pp core) send noise to the tutor.** Fix: Re-extract with OCR like K1-K3 (eng/tools/extract.py); then re-type the E07 registry sections (whole lectures were typed history/problems). (P1)
2. **[mil] B13 Fleeman, Tactical Missile Design: image-only scan, in the library but in no module and not in syllabus docs.** Fix: OCR (core/tools/extract/extract.py; tesseract/RapidOCR not installed in the research container), add to docs, create M6.12 (PDF 19-236 core) and M6.13 (PDF 237-262 adv). PDF page = book page + 18. (P6b)
3. **[mil] B12 SMAD: image-only scan, no text layer (958 pp); every SMAD-only item (Delta-V, cost and learning curves, mass/thermal margins, random vibration, mission geometry) is unverifiable by text.** Fix: OCR the whole book; book->PDF offset +17 through ch.17, +13 from ch.19. (P3, P5, P6a, P7)
4. **[mil] SMAD ch.18 Propulsion (book pp. 527-564) is missing from the scan; PDF 544-577 duplicates ch.17.** Fix: Obtain a clean copy of ch.18 and re-scan; until then in-space/electric propulsion (ADD:SP.3) is tutor-written in M13.12. (P6a)
5. **[eng] Feynman Vol. II ch.40 (Flow of Dry Water) missing from the library copy.** Fix: Restore the chapter (feyn2.json / PDF); until then Euler, vorticity and potential flow rest on Anderson and Kolmogorov. (P1, P3)
6. **[eng] Feynman Vol. II ch.42 (Curved Space) missing from the library copy.** Fix: Restore; GR clocks / GPS correction (S, M24.1) depends on it. (P1)
7. **[eng] Horowitz & Hill (E09) ch.1 Foundations missing from the PDF.** Fix: Restore ch.1; until then KCL/KVL, node/mesh, AC power rest on E09a class notes and F2 ch.22 (gap item in M11.1). (P2)
8. **[mil] library/military/syllabus/syllabus.py line ~614: comment says M13.12 uses Fleeman; B13 is not even in docs.** Fix: Fix the stale comment when B13 is added. (P6b)
9. **[mil] Rule 37 makes B14-B17 "ref, not lesson material, not coverage-checked", so Ball (B16) and van Creveld (B17) are never taught; rule 33 says B14/B15 are already read.** Fix: Give B14-B17 supplementary/main roles in specific modules (list in rehosted_in: M14.1, M7.1, M7.3, M10.3, M8.8, M4.10, M14.2, M14.3); keep rule 33 as the test-out diagnostic, not as exclusion; add B14-B17 to the coverage registry. (P5, P6a, P6b, P7)
10. **[mil] Lanchester laws (B14:84-114, B15:92-163) sit only in adv M12.2 (Russian tactics).** Fix: Move to core M14.1 (combat modeling); B15:142-163 to M7.3. (P7)
11. **[mil] B07 ch.7 (PDF 192-219) battlespace performance typed "summary" and held in adv M7.4.** Fix: Promote M7.4 to core; re-type the section as theory. (P6b)
12. **[mil] Ball (B16) ch.1.1-1.2, 5.1-5.2, 6.1-6.2 attached to no module; pp. 44-70 worked SEAD package unlinked.** Fix: Attach to new M8.8 (main) and as ref to M4.7 and M12.1. (P5, P6a, P7)
13. **[mil] B14 7.4 and 7.6 (PDF 146-161, ASW barrier and moving-target search) linked only to radar/EO modules.** Fix: Link to M10.3 as supp. (P6a)
14. **[mil] D5:164-176 recon-strike complexes in adv M12.2; D6:59-74 PLA system warfare in adv M12.4.** Fix: Pull into core M12.1 and M12.3. (P7)
15. **[mil] van Creveld ch.3 attached to M12.4 (Chinese tactics), which does not fit; ch.4,5,7,8 ref-only.** Fix: Promote to main in M14.3 logistics; detach ch.3 from M12.4. (P7)
16. **[eng] Shannon-Hartley (E23 5.1-5.2) sits only in adv M23.8.** Fix: Teach it in core M23.3. (P2)
17. **[eng] Measurement practice (oscilloscope, load line) only in ref appendix M11.14.** Fix: Pull into core M11.1. (P2)
18. **[eng] K-level physics held in adv modules: Poynting (F2 27, M9.16), Fresnel and skin depth (F2 32-33, M9.14), Doppler (F1 34-6/7); multivariate Gaussian conditioning (M6.9), confounding (M6.10); K3 XIX/1-4 Hilbert space (M8.14).** Fix: Move to core as deltas (M9.9, M6.2) or make the sections core. (P1)
19. **[eng] MacKay E14 chapter bodies sit in units titled "(opener)" and were typed history (~223 pp of the best OOM material).** Fix: Re-type as teaching (all KEEP). (P3)
20. **[eng] P&H (E22) 4.5 pipelining, 1.10/6.13 Amdahl, 6.10-6.11 roofline, 1.7 power wall typed history/notes; Skiena 1.9 Estimation typed history; E21 2.2 big-O typed appendix.** Fix: Re-type as teaching (KEEP). (P4)
21. **[eng] E22 pages are reflowed e-book pages (599 not-needed E22 pages ~ 300 printed pages).** Fix: Normalise page counts for E22 before using pages as a measure. (P4)
22. **[both] MG host IDs mix the two apps (e.g. M2.x, M9.5, M13.20 are Lanchester; "M17.2" for power systems is a neural-network module; CRB/DOP/CEP sent to Lanchester M8.5 Displays).** Fix: Use app-qualified IDs (G:/L:) everywhere; the panels reassigned every host. (P2, P4, P7)
23. **[mil] Several Lanchester K ideas exist only in Lanchester while their engineering foundation is missing in Gilua (link budget, windowing, quantization noise, DFT practice, adaptive filters).** Fix: Teach the foundation in Gilua (gap items in M4.6, M4.8, M23.5) and make the Lanchester modules deltas. (P2)
24. **[mil] B10 Hebrew blocks and SMAD units were split into ~6-8 page heading blocks without real section numbers.** Fix: Recover true headings when OCR is done, so sections can be kept/dropped individually. (S_mil, P5)
25. **[mil] Dated sources need explicit update notes: Kaplan 2006 (BeiDou-3, Galileo FOC, M-code), Moir 2006 (AESA, MADL), EW101 2001 (DRFM, digital receivers), Driggers 2012 (T2SL/HOT), SMAD 2011 (launch $/kg, mega-constellations), E17 2023 (stops at GPT-3), power books (SiC/GaN, grid-forming inverters).** Fix: Add an "update since the book" note per module (tutor-written, dated). (P2, P4, P5, P6a)
26. **[mil] Articles and B14-B17 are outside the S_mil registry, so their CR/K/S/C are estimated here from class rates.** Fix: Add them to the registry with real section counts. (P7, F)

## 6. Every module: kept / not needed / test-out

Per module: weighted kept pp; not-needed pp with the main reasons; test-out pp; book CR/K/S/C in scope; CR taught as delta; added items. Section-level lists (every kept, not-needed and test-out section, with reasons and panel) are in `F_curriculum.json`.

### Gilua

| module | tier | kept wpp | not needed pp (top reasons) | test-out pp | CR | K | S | C | CR delta | added (CR) |
|---|---|---|---|---|---|---|---|---|---|---|
| M0.1 A general view of mathematics | core | 29 | 35 (history (age of elementary mathematics) 10; history (mathematics of variable magnitu 10) | 0 | 3.0 | 1.6 | 4 | 7 | 0.0 | 0 (0.0) |
| M0.2 Atoms in motion and basic physics | core | 19 | 11 (physics-biology survey, not needed 4; intro paragraph 3) | 0 | 3.3 | 4.8 | 4 | 10 | 0.0 | 1 (0.1) |
| M1.1 Analysis: functions, limits, derivatives, Taylor | core | 63 | 0 | 0 | 9.2 | 3.4 | 20 | 19 | 0.0 | 0 (0.0) |
| M1.2 Analysis: integrals, several variables, series | core | 50 | 5 (catalog of integration techniques (BoK N 5) | 0 | 6.9 | 4.2 | 11 | 11 | 0.0 | 3 (0.9) |
| M1.3 Analytic geometry: curves, conics, vectors | core | 36 | 8 (Descartes' geometric solution of cubics/ 3; elementary textbook problems 2) | 0 | 5.4 | 2.0 | 12 | 12 | 0.0 | 0 (0.0) |
| M1.4 Transformations, invariants, projective geometry | core | 30 | 4 (chapter summary 4) | 0 | 4.0 | 1.2 | 8 | 8 | 0.0 | 0 (0.0) |
| M1.5 Algebra: algebraic equations and complex numbers | core | 41 | 19 (solution by radicals (Cardano/Ferrari, G 15; intro 4) | 0 | 7.0 | 4.2 | 15 | 15 | 0.0 | 0 (0.0) |
| M1.6 Vectors | core | 10 | 0 | 0 | 2.1 | 2.4 | 5 | 6 | 0.0 | 0 (0.0) |
| M2.1 Conservation of energy, time and distance | core | 18 | 0 | 0 | 3.3 | 4.6 | 6 | 11 | 0.0 | 0 (0.0) |
| M2.2 Gravitation | core | 11 | 0 | 0 | 1.9 | 2.8 | 3 | 6 | 0.0 | 0 (0.0) |
| M2.3 Motion, Newton's laws, momentum | core | 40 | 0 | 0 | 8.8 | 10.2 | 17 | 24 | 0.0 | 0 (0.0) |
| M2.4 Work and potential energy | core | 19 | 0 | 0 | 4.5 | 4.8 | 8 | 9 | 0.0 | 0 (0.0) |
| M2.5 Rotation, center of mass, moment of inertia | core | 25 | 0 | 0 | 6.0 | 6.6 | 11 | 12 | 0.0 | 2 (0.6) |
| M3.1 Ordinary differential equations | core | 46 | 0 | 0 | 6.7 | 2.5 | 14 | 15 | 0.0 | 1 (0.3) |
| M3.2 Harmonic oscillator, resonance, transients, line | core | 30 | 0 | 0 | 6.5 | 8.8 | 15 | 18 | 0.0 | 1 (0.3) |
| M4.1 Signals and systems: definitions and properties | core | 68 | 1 (chapter summary (redundant) 1; chapter intro 0) | 0 | 10.4 | 10.1 | 20 | 20 | 0.0 | 0 (0.0) |
| M4.2 LTI systems and convolution | core | 62 | 1 (chapter intro 1) | 0 | 7.5 | 6.0 | 13 | 11 | 0.0 | 0 (0.0) |
| M4.3 Functions of a complex variable | core | 35 | 0 | 0 | 5.2 | 1.9 | 10 | 9 | 0.0 | 0 (0.0) |
| M4.4 Fourier series | core | 79 | 0 | 0 | 10.2 | 7.6 | 22 | 24 | 0.0 | 0 (0.0) |
| M4.5 The continuous-time Fourier transform | core | 59 | 0 | 0 | 7.0 | 7.5 | 16 | 18 | 1.1 | 1 (0.6) |
| M4.6 The discrete-time Fourier transform | core | 42 | 0 | 0 | 3.4 | 2.5 | 8 | 7 | 2.1 | 3 (1.2) |
| M4.7 Time and frequency characterization, filters | core | 59 | 1 (chapter summary 1; chapter intro 0) | 0 | 6.6 | 5.7 | 13 | 13 | 0.0 | 0 (0.0) |
| M4.8 Sampling | core | 42 | 0 | 0 | 4.2 | 3.5 | 9 | 10 | 0.7 | 3 (2.2) |
| M4.9 The Laplace transform | core | 67 | 12 (long partial-fraction drills (BoK item 5 12) | 0 | 7.4 | 6.0 | 14 | 16 | 0.4 | 0 (0.0) |
| M4.10 The z-transform | core | 56 | 0 | 0 | 3.5 | 2.7 | 8 | 8 | 3.4 | 2 (1.1) |
| M4.11 Line integrals, Cauchy's formula, analytic conti | adv | 20 | 5 (chapter conclusion/summary 5) | 0 | 3.0 | 1.1 | 6 | 6 | 0.0 | 2 (1.1) |
| M5.1 Introduction to feedback and feedback principles | core | 54 | 0 | 0 | 5.5 | 4.7 | 17 | 22 | 0.0 | 0 (0.0) |
| M5.2 System modeling and examples | core | 70 | 0 | 0 | 8.9 | 6.8 | 21 | 20 | 0.0 | 2 (1.1) |
| M5.3 Dynamic behavior, stability, Lyapunov | core | 34 | 0 | 0 | 4.5 | 3.2 | 10 | 9 | 0.0 | 0 (0.0) |
| M5.4 Linear state-space systems | core | 51 | 1 (further reading 1) | 0 | 10.2 | 9.8 | 21 | 20 | 0.0 | 0 (0.0) |
| M5.5 State feedback and LQR | core | 32 | 0 | 0 | 4.5 | 3.1 | 10 | 9 | 0.0 | 0 (0.0) |
| M5.6 Output feedback, observers, Kalman filtering | core | 41 | 0 | 0 | 7.3 | 6.7 | 16 | 15 | 0.1 | 3 (1.3) |
| M5.7 Transfer functions and the Bode plot | core | 40 | 0 | 0 | 5.4 | 3.8 | 12 | 10 | 0.0 | 0 (0.0) |
| M5.8 Frequency-domain analysis: Nyquist and margins | core | 52 | 1 (further reading 1) | 0 | 9.5 | 7.4 | 20 | 21 | 0.0 | 0 (0.0) |
| M5.9 PID control | core | 23 | 0 | 0 | 2.9 | 2.2 | 7 | 8 | 0.0 | 1 (0.6) |
| M5.10 Frequency-domain design, loop shaping, root locu | core | 30 | 0 | 0 | 3.9 | 3.1 | 10 | 10 | 0.0 | 1 (0.3) |
| M5.11 Robust performance | adv | 27 | 0 | 0 | 3.0 | 2.3 | 6 | 7 | 0.5 | 2 (0.6) |
| M5.12 Fundamental limits: Bode's integral | core | 29 | 0 | 0 | 4.0 | 2.8 | 10 | 11 | 0.0 | 1 (0.3) |
| M5.13 Architecture and system design | core | 40 | 2 (chapter intro 1; further reading 1) | 0 | 4.4 | 3.9 | 9 | 11 | 0.0 | 4 (1.4) |
| M6.1 Probability: laws, axioms, law of large numbers | core | 32 | 0 | 0 | 6.0 | 4.2 | 13 | 14 | 0.0 | 0 (0.0) |
| M6.2 Random variables and expectation | core | 98 | 5 (part divider 4; references 1) | 0 | 25.9 | 28.6 | 73 | 77 | 0.0 | 1 (0.8) |
| M6.3 Inequalities and convergence | core | 27 | 3 (bibliographic remarks 2; appendix (proofs) 1) | 0 | 8.0 | 7.8 | 22 | 28 | 0.0 | 2 (2.3) |
| M6.4 Statistical inference, the cdf, the bootstrap | core | 28 | 0 | 0 | 5.1 | 5.0 | 13 | 16 | 0.0 | 3 (2.1) |
| M6.5 Parametric inference | core | 15 | 12 (appendix: proofs 11; one-line opener 1) | 0 | 2.8 | 2.6 | 12 | 13 | 0.2 | 2 (0.8) |
| M6.6 Hypothesis testing and p-values | core | 21 | 0 | 0 | 3.7 | 3.8 | 11 | 12 | 0.0 | 3 (2.4) |
| M6.7 Bayesian inference and decision theory | core | 26 | 0 | 0 | 5.0 | 4.8 | 16 | 18 | 0.0 | 0 (0.0) |
| M6.8 Linear and logistic regression | core | 19 | 0 | 0 | 3.3 | 3.4 | 10 | 11 | 0.0 | 0 (0.0) |
| M6.9 Multivariate models, inference about independenc | adv | 10 | 4 (appendix 4; bibliographic remarks 0) | 0 | 1.9 | 1.8 | 7 | 7 | 0.0 | 0 (0.0) |
| M6.10 Causal inference, graphical and log-linear model | adv | 31 | 1 (bibliographic remarks 1) | 0 | 4.9 | 5.4 | 16 | 22 | 0.0 | 0 (0.0) |
| M6.11 Simulation methods | core | 17 | 0 | 0 | 3.1 | 3.1 | 7 | 7 | 0.0 | 2 (0.5) |
| M7.1 Random processes and Markov chains | core | 56 | 1 (bibliographic remarks 1) | 0 | 9.9 | 10.0 | 21 | 26 | 0.0 | 2 (0.6) |
| M7.2 Power spectral density | core | 12 | 0 | 0 | 1.9 | 2.1 | 5 | 5 | 0.1 | 1 (0.3) |
| M7.3 Probabilistic models, MMSE estimation, Wiener fi | core | 56 | 0 | 0 | 8.8 | 9.8 | 18 | 19 | 0.2 | 1 (0.3) |
| M7.4 Hypothesis testing and signal detection | core | 44 | 0 | 0 | 7.7 | 8.4 | 15 | 14 | 0.0 | 1 (0.1) |
| M7.5 Introduction to information theory, entropy, inf | core | 62 | 2 (summary 1; exercise stub 1) | 0 | 11.3 | 11.5 | 25 | 27 | 0.0 | 0 (0.0) |
| M7.6 Source coding theorem, symbol and stream codes | core | 72 | 0 | 0 | 11.4 | 13.2 | 25 | 32 | 0.0 | 0 (0.0) |
| M7.7 The noisy channel and Shannon's coding theorem | core | 52 | 0 | 0 | 9.3 | 9.3 | 27 | 29 | 0.0 | 1 (0.3) |
| M7.8 Constrained channels, codebreaking, information  | adv | 8 | 24 (evolution model (outside goal) 4; constrained channels (as above) 3) | 0 | 1.2 | 1.5 | 4 | 5 | 0.0 | 0 (0.0) |
| M7.9 Clustering, maximum likelihood, exact enumeratio | core | 30 | 0 | 0 | 4.8 | 5.2 | 12 | 13 | 0.0 | 0 (0.0) |
| M7.10 Useful distributions, exact marginalization | core | 28 | 0 | 0 | 5.0 | 5.1 | 15 | 16 | 0.0 | 0 (0.0) |
| M7.11 Laplace's method, model comparison, Occam's razo | core | 12 | 0 | 0 | 1.8 | 2.2 | 4 | 5 | 0.0 | 0 (0.0) |
| M7.12 Monte Carlo methods | core | 52 | 0 | 0 | 8.1 | 9.3 | 20 | 25 | 0.1 | 1 (0.3) |
| M7.13 Ising models | adv | 13 | 0 | 0 | 2.1 | 2.4 | 5 | 4 | 0.0 | 0 (0.0) |
| M7.14 Variational methods and independent component an | adv | 22 | 0 | 0 | 3.6 | 4.1 | 11 | 11 | 0.0 | 0 (0.0) |
| M7.15 Decision theory, Bayesian vs sampling theory | core | 18 | 0 | 0 | 2.8 | 3.2 | 9 | 10 | 0.0 | 0 (0.0) |
| M7.16 Appendices: notation, some physics, some mathema | ref | 16 | 0 | 0 | 1.3 | 1.4 | 3 | 3 | 0.0 | 0 (0.0) |
| M8.1 Linear algebra: linear spaces and systems | core | 37 | 0 | 0 | 5.8 | 2.0 | 11 | 11 | 0.0 | 0 (0.0) |
| M8.2 Linear transformations, quadratic forms, matrix  | core | 23 | 0 | 0 | 3.5 | 1.3 | 8 | 8 | 0.0 | 0 (0.0) |
| M8.3 Matrix-vector multiplication, orthogonality, nor | core | 23 | 0 | 0 | 2.6 | 3.8 | 3 | 6 | 0.0 | 0 (0.0) |
| M8.4 The singular value decomposition | core | 10 | 0 | 0 | 1.6 | 1.8 | 3 | 3 | 0.0 | 1 (0.3) |
| M8.5 Projectors, QR factorization, least squares | core | 40 | 0 | 0 | 5.8 | 6.1 | 13 | 8 | 0.0 | 0 (0.0) |
| M8.6 Conditioning, floating point, stability | core | 47 | 0 | 0 | 6.5 | 7.7 | 13 | 13 | 0.0 | 0 (0.0) |
| M8.7 Gaussian elimination, pivoting, Cholesky | core | 28 | 0 | 0 | 4.7 | 5.1 | 9 | 7 | 0.0 | 0 (0.0) |
| M8.8 Eigenvalue problems and algorithms | core | 13 | 0 | 0 | 2.1 | 2.0 | 5 | 2 | 0.0 | 0 (0.0) |
| M8.9 Eigenvalue algorithms and computing the SVD | adv | 36 | 0 | 0 | 6.8 | 6.6 | 15 | 9 | 0.0 | 0 (0.0) |
| M8.10 Iterative methods: Arnoldi, GMRES, conjugate gra | adv | 65 | 0 | 0 | 9.8 | 11.9 | 18 | 17 | 0.0 | 1 (0.3) |
| M8.11 Approximation of functions, interpolation, quadr | core | 26 | 0 | 0 | 4.4 | 1.9 | 10 | 9 | 0.0 | 0 (0.0) |
| M8.12 Approximation methods and computing techniques | core | 16 | 12 (slide rules, nomograms, mechanical calcu 12) | 0 | 2.4 | 0.9 | 4 | 3 | 0.0 | 1 (0.8) |
| M8.13 Calculus of variations and the principle of leas | core | 34 | 0 | 0 | 6.5 | 4.8 | 10 | 10 | 0.0 | 1 (0.3) |
| M8.14 Functional analysis: Hilbert space and operators | adv | 35 | 1 (opener 1) | 0 | 5.1 | 1.9 | 12 | 13 | 0.0 | 0 (0.0) |
| M8.15 Introduction to optimization | core | 13 | 7 (notation list 7) | 0 | 1.9 | 2.4 | 5 | 7 | 0.0 | 0 (0.0) |
| M8.16 Convex sets and functions | core | 95 | 0 | 0 | 18.0 | 18.7 | 36 | 32 | 0.0 | 0 (0.0) |
| M8.17 Convex optimization problems | core | 62 | 0 | 0 | 10.0 | 10.7 | 18 | 17 | 0.0 | 0 (0.0) |
| M8.18 Duality | core | 58 | 7 (appendix: strong-duality proofs 4; appendix: single-constraint QP proofs 2) | 0 | 10.1 | 10.4 | 20 | 16 | 0.4 | 0 (0.0) |
| M8.19 Approximation and fitting | core | 53 | 0 | 0 | 8.2 | 9.5 | 12 | 11 | 0.0 | 1 (0.6) |
| M8.20 Statistical estimation | core | 42 | 0 | 0 | 7.2 | 7.7 | 12 | 10 | 0.0 | 0 (0.0) |
| M8.21 Geometric problems | adv | 24 | 26 (floor planning: niche 9; centering (analytic center etc.): niche 6) | 0 | 4.1 | 4.4 | 8 | 6 | 0.0 | 0 (0.0) |
| M8.22 Unconstrained and equality-constrained minimizat | core | 93 | 12 (self-concordance: theory for complexity  12) | 0 | 14.5 | 16.8 | 27 | 24 | 0.0 | 1 (0.3) |
| M8.23 Interior-point methods | adv | 38 | 24 (generalized inequalities in barrier meth 13; complexity via self-concordance: proof m 11) | 0 | 6.0 | 6.6 | 12 | 10 | 0.3 | 0 (0.0) |
| M9.1 Sound, the wave equation, beats, modes, harmonic | core | 47 | 0 | 0 | 9.7 | 12.0 | 18 | 23 | 0.0 | 0 (0.0) |
| M9.2 Vector calculus of fields | core | 25 | 0 | 0 | 5.2 | 6.0 | 11 | 13 | 0.0 | 1 (0.3) |
| M9.3 Electromagnetism: overview | core | 11 | 0 | 0 | 2.0 | 2.8 | 3 | 6 | 0.0 | 0 (0.0) |
| M9.4 Electrostatics and Gauss's law | core | 58 | 0 | 0 | 13.0 | 15.3 | 24 | 32 | 0.0 | 0 (0.0) |
| M9.5 Electricity in the atmosphere | adv | 7 | 4 (atmospheric currents: niche 2; fair-weather atmospheric potential: nich 1) | 0 | 1.2 | 1.8 | 2 | 4 | 0.0 | 0 (0.0) |
| M9.6 Dielectrics | core | 20 | 0 | 0 | 4.6 | 5.1 | 9 | 12 | 0.0 | 0 (0.0) |
| M9.7 Magnetostatics and the vector potential | core | 32 | 6 (vector potential and quantum mechanics ( 6) | 0 | 7.4 | 8.2 | 15 | 17 | 0.0 | 0 (0.0) |
| M9.8 Induced currents and the laws of induction | core | 25 | 0 | 0 | 5.8 | 7.1 | 9 | 12 | 0.0 | 0 (0.0) |
| M9.9 Maxwell's equations, their solutions, EM radiati | core | 91 | 2 (index of a mixture: minor note 2; cosmic synchrotron radiation: astrophysi 0) | 0 | 20.5 | 23.1 | 38 | 41 | 0.2 | 1 (0.3) |
| M9.10 Motion of charges in electric and magnetic field | core | 5 | 3 (accelerator guide fields: niche 2; electron microscope: niche instrument 1) | 0 | 1.0 | 1.4 | 2 | 4 | 0.0 | 0 (0.0) |
| M9.11 Cavity resonators and waveguides | core | 23 | 0 | 0 | 4.7 | 5.9 | 9 | 11 | 0.0 | 0 (0.0) |
| M9.12 Optics: least time and geometrical optics | core | 16 | 0 | 0 | 3.1 | 3.8 | 7 | 13 | 0.0 | 0 (0.0) |
| M9.13 Interference, diffraction, polarization | core | 29 | 0 | 0 | 6.0 | 7.4 | 12 | 18 | 0.0 | 1 (0.6) |
| M9.14 Refractive index, scattering, reflection, relati | adv | 20 | 0 | 0 | 4.1 | 4.7 | 8 | 10 | 0.0 | 2 (0.9) |
| M9.15 Color vision and mechanisms of seeing | adv | 9 | 13 (neurology of vision 4; physiology of the eye 3) | 0 | 1.7 | 2.2 | 3 | 5 | 0.0 | 0 (0.0) |
| M9.16 Field energy and momentum, electromagnetic mass | adv | 5 | 9 (attempts to modify Maxwell theory (class 6; nuclear force field (Yukawa): not needed 3) | 0 | 1.1 | 1.3 | 2 | 3 | 0.0 | 0 (0.0) |
| M10.1 Partial differential equations of mathematical p | core | 52 | 2 (intro 2) | 0 | 6.7 | 2.8 | 12 | 11 | 0.0 | 3 (1.0) |
| M10.2 The same equations have the same solutions | core | 13 | 0 | 0 | 2.8 | 3.3 | 5 | 6 | 0.0 | 0 (0.0) |
| M10.3 Diffusion | core | 10 | 0 | 0 | 2.1 | 2.5 | 4 | 5 | 0.0 | 0 (0.0) |
| M10.4 Finite differences: vibration ODEs | core | 91 | 12 (exercises (practice source, not reading) 12) | 0 | 11.2 | 8.9 | 23 | 17 | 0.0 | 3 (1.2) |
| M10.5 Finite differences: wave equations | core | 121 | 0 | 0 | 14.0 | 10.9 | 31 | 22 | 0.2 | 0 (0.0) |
| M10.6 Finite differences: diffusion equations | core | 129 | 0 | 0 | 15.9 | 12.4 | 26 | 18 | 0.2 | 0 (0.0) |
| M10.7 Advection-dominated equations and nonlinear prob | adv | 92 | 0 | 0 | 10.6 | 8.6 | 21 | 16 | 0.0 | 1 (0.3) |
| M10.8 Truncation error analysis | adv | 44 | 0 | 0 | 3.5 | 3.4 | 8 | 7 | 0.0 | 1 (0.6) |
| M10.9 Software engineering for simulation | ref | 15 | 22 (migrating loops to Cython (matched KS) 6; saving large arrays to files (matched KS 5) | 0 | 1.5 | 1.5 | 4 | 2 | 0.0 | 0 (0.0) |
| M10.10 Finite elements and finite volumes: Galerkin/Rit | core | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 2 (2.3) |
| M11.1 Circuit foundations and AC circuits | core | 98 | 9 (bench lab procedure 7; jargon list 2) | 0 | 9.2 | 8.0 | 18 | 25 | 0.1 | 3 (1.2) |
| M11.2 Bipolar transistors | core | 64 | 23 (bench lab procedure 17; jargon list 3) | 0 | 6.6 | 3.9 | 24 | 36 | 0.0 | 0 (0.0) |
| M11.3 Field-effect transistors | core | 72 | 20 (bench lab procedure 16; jargon list 3) | 0 | 6.0 | 3.5 | 20 | 31 | 0.0 | 0 (0.0) |
| M11.4 Feedback and operational amplifiers | core | 98 | 0 | 0 | 8.1 | 5.7 | 29 | 53 | 0.0 | 0 (0.0) |
| M11.5 Active filters and oscillators | core | 58 | 0 | 0 | 5.4 | 3.6 | 18 | 29 | 0.0 | 0 (0.0) |
| M11.6 Voltage regulators and power circuits | core | 84 | 1 (jargon list 1) | 0 | 5.5 | 4.2 | 20 | 38 | 0.0 | 1 (0.3) |
| M11.7 Precision circuits and low-noise techniques | core | 75 | 0 | 0 | 5.2 | 3.5 | 20 | 32 | 0.1 | 1 (0.6) |
| M11.8 Digital electronics | core | 103 | 68 (bench lab procedure 24; counter IC class notes, redundant with E 20) | 0 | 9.2 | 6.5 | 31 | 53 | 0.0 | 0 (0.0) |
| M11.9 Digital meets analog: converters | core | 104 | 11 (logic-family chronology (historical part 5; NMOS LSI interfacing (obsolete) 2) | 0 | 7.3 | 5.5 | 26 | 51 | 0.0 | 1 (0.8) |
| M11.10 Electronic construction techniques | ref | 14 | 21 (advanced hand-construction techniques (s 11; stuffing PC boards: shop practice 2) | 0 | 0.8 | 0.7 | 3 | 7 | 0.0 | 0 (0.0) |
| M11.11 High-frequency and high-speed techniques | adv | 47 | 3 (exotic RF amplifiers/devices (BoK: N) 2; open-collector bus driver (obsolete deta 1) | 0 | 3.1 | 2.2 | 16 | 30 | 0.0 | 5 (1.7) |
| M11.12 Low-power design | adv | 58 | 12 (microprocessor design example (degree-da 7; introduction 2) | 0 | 3.7 | 2.6 | 13 | 21 | 0.1 | 0 (0.0) |
| M11.13 Measurements and signal processing | core | 50 | 5 (circuit ideas 4; chapter opener 1) | 0 | 3.2 | 2.3 | 13 | 24 | 0.0 | 0 (0.0) |
| M11.14 Appendices: oscilloscope, schematics, data sheet | ref | 0 | 33 (data sheets of obsolete 1980s parts (2N5 14; lab parts list 4) | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 0 (0.0) |
| M12.1 Magnetism of matter, ferromagnetism, magnetic ma | adv | 40 | 0 | 0 | 8.5 | 10.2 | 15 | 19 | 0.0 | 0 (0.0) |
| M12.2 Paramagnetism and magnetic resonance | adv | 12 | 0 | 0 | 2.5 | 3.1 | 4 | 5 | 0.0 | 0 (0.0) |
| M12.3 Electric motors: the basics | core | 38 | 0 | 0 | 2.9 | 2.5 | 8 | 14 | 0.0 | 2 (0.9) |
| M12.4 Power electronic converters for drives | core | 33 | 0 | 0 | 2.4 | 2.1 | 6 | 12 | 0.0 | 3 (0.9) |
| M12.5 DC motors and drives | core | 65 | 2 (toy motors (anecdotal) 2) | 0 | 3.7 | 3.0 | 11 | 25 | 0.1 | 0 (0.0) |
| M12.6 Induction motors | core | 91 | 1 (lab measurement procedure for induction- 1) | 0 | 4.7 | 3.0 | 14 | 30 | 0.3 | 2 (0.6) |
| M12.7 Variable-frequency operation and inverter-fed dr | core | 74 | 0 | 0 | 4.2 | 3.5 | 12 | 26 | 0.1 | 0 (0.0) |
| M12.8 Synchronous and brushless permanent-magnet machi | core | 33 | 0 | 0 | 1.8 | 1.5 | 6 | 13 | 0.1 | 0 (0.0) |
| M12.9 Stepping and switched-reluctance motors | adv | 33 | 0 | 0 | 1.9 | 1.5 | 6 | 14 | 0.0 | 0 (0.0) |
| M12.10 Motor/drive selection and closed-loop control | core | 33 | 0 | 0 | 1.6 | 1.5 | 5 | 10 | 0.2 | 2 (1.6) |
| M13.1 The kinetic theory of gases | core | 12 | 0 | 0 | 2.5 | 3.1 | 4 | 4 | 0.0 | 0 (0.0) |
| M13.2 Statistical mechanics, Brownian motion, applicat | core | 30 | 0 | 0 | 7.0 | 7.9 | 13 | 15 | 0.0 | 1 (0.3) |
| M13.3 The laws of thermodynamics, illustrations, ratch | core | 31 | 0 | 0 | 6.6 | 7.9 | 12 | 15 | 0.0 | 2 (0.6) |
| M13.4 Basic concepts, energy and energy transfer | core | 72 | 12 (Energy and environment (pollution, C) 6; Chapter opener/synopsis, 1.0 pp 3) | 0 | 9.9 | 7.0 | 27 | 29 | 0.0 | 0 (0.0) |
| M13.5 Properties of pure substances | core | 38 | 2 (Chapter opener/synopsis, 1.0 pp 1; Chapter summary (recap only) 1) | 0 | 5.2 | 3.7 | 13 | 15 | 0.0 | 0 (0.0) |
| M13.6 Energy analysis of closed systems and control vo | core | 58 | 12 (Thermodynamics of biological systems, 7  7; Chapter opener/synopsis, 1.0 pp 2) | 0 | 8.3 | 5.9 | 20 | 18 | 0.0 | 0 (0.0) |
| M13.7 The second law and entropy | core | 87 | 17 (Cost of compressed air, 9 pp 9; Household refrigerators, 4 pp 4) | 0 | 10.6 | 7.6 | 30 | 32 | 1.3 | 0 (0.0) |
| M13.8 Exergy | core | 44 | 3 (Chapter opener/synopsis, 1.0 pp 1; Chapter summary (recap only) 1) | 0 | 5.5 | 3.9 | 14 | 14 | 0.6 | 0 (0.0) |
| M13.9 Gas power cycles | core | 43 | 10 (Saving fuel by driving sensibly, 7 pp 7; Chapter opener/synopsis, 1.0 pp 1) | 0 | 5.7 | 4.1 | 15 | 15 | 0.1 | 0 (0.0) |
| M13.10 Vapor and combined power cycles | core | 31 | 6 (Second-law analysis of vapor cycles: exe 2; Binary vapor cycles (C) 2) | 0 | 4.2 | 2.9 | 11 | 10 | 0.1 | 0 (0.0) |
| M13.11 Refrigeration cycles and heat pumps | core | 28 | 4 (Selecting the right refrigerant (refrige 2; Chapter opener/synopsis, 1.0 pp 1) | 0 | 3.5 | 2.5 | 11 | 12 | 0.3 | 1 (0.3) |
| M13.12 Property relations, gas mixtures, air conditioni | adv | 40 | 37 (Air-conditioning processes, 11 pp (N HVA 11; General du/dh/ds relations: derivation d 7) | 0 | 6.0 | 3.6 | 19 | 16 | 0.1 | 0 (0.0) |
| M13.13 Chemical reactions, combustion, equilibrium | adv | 44 | 12 (Second-law analysis of reacting systems  5; Chapter opener/synopsis, 1.0 pp 2) | 0 | 6.9 | 4.0 | 18 | 18 | 0.1 | 0 (0.0) |
| M13.14 Property tables and charts | ref | 50 | 42 (English-units property tables duplicate  42) | 0 | 1.9 | 1.7 | 2 | 2 | 0.0 | 0 (0.0) |
| M13.15 The energy balance sheet: consumption and produc | core | 68 | 34 (MacKay chapter notes: source pool for ch 34) | 0 | 4.1 | 3.2 | 9 | 24 | 0.0 | 2 (0.8) |
| M13.16 Technical chapters: the physics behind the numbe | core | 66 | 8 (MacKay chapter notes: source pool for ch 8) | 0 | 5.0 | 3.4 | 13 | 17 | 0.2 | 0 (0.0) |
| M13.17 Living on sustainable energy: transport, heating | core | 82 | 18 (MacKay chapter notes: source pool for ch 18) | 0 | 4.8 | 3.9 | 8 | 19 | 0.0 | 1 (0.3) |
| M13.18 Energy plans, costs and reference data | adv | 22 | 39 (Five energy plans for Britain (policy sc 10; What to do now (policy advocacy) 8) | 0 | 1.4 | 1.2 | 3 | 6 | 0.0 | 0 (0.0) |
| M13.19 Power systems and the grid: per-unit and three-p | core | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 9 (6.0) |
| M14.1 Introduction to heat transfer | core | 31 | 17 (End-of-chapter problems: exercise pool,  11; Chapter opener/synopsis, 2.0 pp 2) | 0 | 3.9 | 3.0 | 7 | 7 | 0.0 | 0 (0.0) |
| M14.2 Conduction, thermal resistance, overall coeffici | core | 36 | 14 (End-of-chapter problems: exercise pool,  11; References / further reading 2) | 0 | 4.2 | 3.5 | 8 | 9 | 0.0 | 0 (0.0) |
| M14.3 Heat exchanger design | core | 31 | 9 (End-of-chapter problems: exercise pool,  7; References / further reading 2) | 0 | 3.8 | 3.0 | 7 | 7 | 0.0 | 0 (0.0) |
| M14.4 Conduction analysis, dimensional analysis, fins | core | 42 | 12 (End-of-chapter problems: exercise pool,  9; Chapter opener/synopsis, 2.0 pp 2) | 0 | 5.4 | 4.4 | 10 | 9 | 0.0 | 1 (0.1) |
| M14.5 Transient and multidimensional conduction | core | 59 | 17 (End-of-chapter problems: exercise pool,  15; References / further reading 2) | 0 | 7.3 | 5.7 | 15 | 13 | 0.1 | 0 (0.0) |
| M14.6 Laminar and turbulent boundary layers | core | 66 | 16 (End-of-chapter problems: exercise pool,  9; References / further reading 5) | 0 | 7.8 | 6.4 | 16 | 15 | 0.0 | 1 (0.6) |
| M14.7 Forced convection | core | 48 | 14 (End-of-chapter problems: exercise pool,  10; References / further reading 4) | 0 | 6.4 | 4.6 | 13 | 11 | 0.1 | 3 (1.1) |
| M14.8 Natural convection and film condensation | adv | 43 | 15 (End-of-chapter problems: exercise pool,  10; References / further reading 5) | 0 | 5.4 | 4.0 | 10 | 8 | 0.2 | 0 (0.0) |
| M14.9 Boiling and phase change | adv | 57 | 13 (References / further reading 7; End-of-chapter problems: exercise pool,  6) | 0 | 6.2 | 5.5 | 14 | 16 | 0.0 | 0 (0.0) |
| M14.10 Radiative heat transfer | core | 61 | 17 (End-of-chapter problems: exercise pool,  10; References / further reading 5) | 0 | 7.2 | 6.1 | 13 | 14 | 0.0 | 2 (1.1) |
| M14.11 Introduction to mass transfer | adv | 86 | 24 (End-of-chapter problems: exercise pool,  14; References / further reading 8) | 0 | 10.7 | 8.3 | 23 | 21 | 0.0 | 0 (0.0) |
| M14.12 Thermophysical properties, units, nomenclature | ref | 0 | 46 (Property/reference tables: consult only 39; References / further reading 7) | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 0 (0.0) |
| M15.1 The flow of wet water: viscosity | core | 12 | 0 | 0 | 2.6 | 3.1 | 5 | 6 | 0.0 | 2 (1.4) |
| M15.2 The first aeronautical engineers | adv | 45 | 7 (Chapter summary (recap only) 5; Chapter opener/synopsis, 2.0 pp 2) | 45 | 3.9 | 4.3 | 5 | 13 | 0.0 | 0 (0.0) |
| M15.3 Fundamental thoughts | core | 47 | 6 (Introductory/historical framing, 4.0 pp 4; Chapter summary (recap only) 2) | 3 | 5.2 | 4.5 | 11 | 15 | 0.0 | 0 (0.0) |
| M15.4 The standard atmosphere | core | 23 | 12 (English-units atmosphere table duplicate 8; Chapter opener/synopsis, 2.0 pp 2) | 2 | 2.6 | 2.0 | 7 | 9 | 0.0 | 0 (0.0) |
| M15.5 Basic aerodynamics: the equations, speed of soun | core | 72 | 4 (Introductory/historical framing, 4.0 pp 4) | 0 | 9.6 | 7.0 | 19 | 18 | 0.0 | 0 (0.0) |
| M15.6 Compressible flow, supersonic tunnels, rocket en | core | 40 | 3 (Chapter summary (recap only) 2; Chapter opener/synopsis, 1.0 pp 1) | 0 | 9.1 | 6.1 | 21 | 18 | 0.0 | 0 (0.0) |
| M15.7 Viscous flow: boundary layers, transition, separ | core | 47 | 5 (Chapter summary (recap only) 5) | 10 | 4.7 | 4.3 | 10 | 15 | 0.1 | 3 (2.4) |
| M15.8 Airfoils: coefficients, pressure, compressibilit | core | 69 | 31 (Airfoil data plots: reference data, 29 p 29; Chapter opener/synopsis, 2.0 pp 2) | 0 | 8.2 | 6.6 | 17 | 19 | 0.0 | 0 (0.0) |
| M15.9 Finite wings: induced drag, swept wings, flaps | core | 41 | 0 | 0 | 5.0 | 4.0 | 10 | 10 | 0.0 | 1 (0.8) |
| M15.10 Cylinders and spheres, how lift is produced, his | core | 32 | 3 (Chapter summary (recap only) 3) | 17 | 3.2 | 3.1 | 5 | 9 | 0.0 | 2 (0.6) |
| M15.11 Performance: drag polar, thrust and power, climb | core | 59 | 0 | 0 | 7.5 | 6.2 | 16 | 17 | 0.0 | 0 (0.0) |
| M15.12 Performance: range, endurance, takeoff, landing, | core | 50 | 0 | 0 | 6.5 | 4.5 | 16 | 14 | 0.0 | 0 (0.0) |
| M15.13 UAVs, micro air vehicles, aerodynamic efficiency | core | 34 | 4 (Chapter summary (recap only) 4) | 12 | 3.7 | 3.3 | 7 | 10 | 0.0 | 1 (0.6) |
| M15.14 Stability and control | core | 57 | 2 (Chapter summary (recap only) 2) | 1 | 5.9 | 5.3 | 18 | 28 | 0.0 | 2 (0.6) |
| M15.15 Space flight (astronautics) | core | 68 | 2 (Chapter summary (recap only) 2) | 11 | 7.5 | 6.6 | 18 | 23 | 0.0 | 1 (0.6) |
| M15.16 Propulsion | core | 81 | 2 (Chapter summary (recap only) 2) | 14 | 8.9 | 7.8 | 19 | 26 | 0.1 | 3 (1.9) |
| M15.17 Hypersonic vehicles | adv | 29 | 1 (Chapter summary (recap only) 1) | 0 | 3.4 | 2.2 | 6 | 7 | 0.0 | 1 (0.3) |
| M15.18 Symbols and conversion factors | ref | 0 | 1 (Symbols/conversion table 1) | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 0 (0.0) |
| M16.1 Tensors, elasticity, elastic materials | core | 39 | 0 | 0 | 8.9 | 9.9 | 16 | 16 | 0.0 | 0 (0.0) |
| M16.2 Tension, compression, shear, axially loaded memb | core | 133 | 3 (Introductory/historical framing, 2.0 pp 2; Chapter opener/synopsis, 1.0 pp 1) | 0 | 12.6 | 12.9 | 22 | 40 | 0.0 | 4 (1.8) |
| M16.3 Torsion | core | 59 | 1 (Chapter opener/synopsis, 1.0 pp 1) | 0 | 4.4 | 4.6 | 8 | 14 | 0.8 | 1 (0.8) |
| M16.4 Shear forces, bending moments, stresses in beams | core | 149 | 2 (Chapter opener/synopsis, 1.0 pp 1; Chapter opener/synopsis, 0.3 pp 1) | 0 | 12.8 | 13.2 | 23 | 42 | 1.0 | 0 (0.0) |
| M16.5 Analysis of stress and strain, plane stress appl | core | 102 | 1 (Chapter opener/synopsis, 1.0 pp 1; Chapter opener/synopsis, 0.3 pp 0) | 0 | 10.0 | 8.9 | 16 | 19 | 1.0 | 1 (0.3) |
| M16.6 Deflections of beams, statically indeterminate b | core | 123 | 1 (Chapter opener/synopsis, 1.0 pp 1; Chapter opener/synopsis, 0.3 pp 0) | 0 | 10.1 | 10.2 | 16 | 30 | 1.4 | 3 (2.0) |
| M16.7 Columns and buckling | core | 46 | 19 (Code column-design formulas (AISC/alumin 18; Chapter opener/synopsis, 1.0 pp 1) | 0 | 4.5 | 4.3 | 8 | 12 | 0.1 | 1 (0.6) |
| M16.8 Centroids, moments of inertia, reference tables, | ref | 30 | 38 (Property/reference tables: consult only 38) | 0 | 2.4 | 2.6 | 6 | 14 | 0.0 | 0 (0.0) |
| M16.9 Introduction to materials selection and the desi | core | 12 | 18 (References / further reading 6; History: evolution of engineering materi 4) | 0 | 0.7 | 0.6 | 3 | 8 | 0.0 | 0 (0.0) |
| M16.10 Engineering materials and their properties | core | 22 | 4 (References / further reading 2; Chapter opener/synopsis, 1.0 pp 1) | 0 | 1.9 | 1.0 | 5 | 6 | 0.0 | 6 (2.0) |
| M16.11 Material property charts | core | 34 | 6 (Chapter opener/synopsis, 1.0 pp 2; Chapter summary (recap only) 2) | 0 | 2.3 | 1.6 | 5 | 6 | 0.0 | 3 (2.2) |
| M16.12 Materials selection: the basics and case studies | core | 93 | 10 (References / further reading 4; Chapter opener/synopsis, 1.0 pp 4) | 0 | 6.8 | 4.2 | 28 | 37 | 0.2 | 0 (0.0) |
| M16.13 Multiple constraints and conflicting objectives | core | 40 | 6 (Chapter opener/synopsis, 1.0 pp 3; Chapter summary (recap only) 2) | 0 | 3.1 | 1.7 | 12 | 13 | 0.2 | 0 (0.0) |
| M16.14 Selection of material and shape | core | 45 | 43 (Property/reference tables: consult only 30; Chapter summary (recap only) 5) | 0 | 3.7 | 2.1 | 16 | 18 | 0.0 | 1 (0.0) |
| M16.15 Designing hybrid materials | adv | 58 | 10 (References / further reading 4; Chapter opener/synopsis, 3.0 pp 3) | 0 | 4.3 | 2.7 | 15 | 21 | 0.0 | 0 (0.0) |
| M16.16 Processes and process selection | adv | 62 | 8 (Chapter opener/synopsis, 1.0 pp 3; Computer-aided process selection (softwa 2) | 0 | 4.0 | 2.9 | 12 | 20 | 0.0 | 5 (2.5) |
| M16.17 Materials and the environment, industrial design | adv | 26 | 32 (Industrial design: product personality v 9; References / further reading 8) | 0 | 1.5 | 1.2 | 5 | 11 | 0.1 | 0 (0.0) |
| M16.18 Data for engineering materials and data sources | ref | 3 | 57 (Property/reference tables: consult only 47; Chapter opener/synopsis, 2.0 pp 2) | 0 | 0.1 | 0.1 | 0 | 1 | 0.0 | 0 (0.0) |
| M17.1 Introduction and supervised learning | core | 20 | 3 (book structure / other books / how to re 2; chapter summary 1) | 0 | 1.8 | 1.9 | 5 | 9 | 0.0 | 0 (0.0) |
| M17.2 Shallow and deep neural networks | core | 36 | 1 (exercise blocks 1) | 0 | 5.8 | 6.1 | 20 | 24 | 0.0 | 0 (0.0) |
| M17.3 Loss functions and learning as inference | core | 24 | 1 (chapter summary 1) | 0 | 4.1 | 4.0 | 13 | 14 | 0.1 | 0 (0.0) |
| M17.4 Fitting models: gradient descent, backpropagatio | core | 37 | 0 (summary 0) | 0 | 4.1 | 4.1 | 13 | 19 | 0.1 | 1 (0.3) |
| M17.5 Measuring performance and regularization | core | 40 | 0 (summary 0) | 0 | 3.9 | 3.8 | 11 | 17 | 0.0 | 6 (3.9) |
| M17.6 Convolutional and residual networks | core | 42 | 0 | 0 | 3.6 | 3.9 | 10 | 17 | 0.0 | 1 (0.3) |
| M17.7 Transformers | core | 32 | 0 | 0 | 3.1 | 3.1 | 9 | 15 | 0.0 | 3 (1.7) |
| M17.8 Graph neural networks | adv | 26 | 0 | 0 | 2.6 | 2.4 | 8 | 12 | 0.0 | 0 (0.0) |
| M17.9 Unsupervised learning and GANs | core | 34 | 0 | 0 | 3.3 | 3.2 | 10 | 15 | 0.0 | 0 (0.0) |
| M17.10 Normalizing flows and variational autoencoders | adv | 39 | 2 (summary 2) | 0 | 4.1 | 3.8 | 13 | 19 | 0.0 | 0 (0.0) |
| M17.11 Diffusion models | core | 23 | 0 (summary 0) | 0 | 2.4 | 2.1 | 7 | 8 | 0.1 | 0 (0.0) |
| M17.12 Why deep learning works, and ethics | core | 29 | 4 (summary 2; case-study narrative 1) | 0 | 2.5 | 2.8 | 6 | 13 | 0.0 | 6 (5.2) |
| M17.13 Appendices: notation, mathematics, probability | ref | 9 | 17 (notation and math/probability refresher; 17) | 0 | 0.7 | 0.7 | 3 | 3 | 0.0 | 0 (0.0) |
| M17.14 Hopfield networks, Boltzmann machines, Gaussian  | adv | 39 | 2 (deconvolution-in-humans aside 2) | 0 | 6.2 | 7.4 | 17 | 22 | 0.0 | 0 (0.0) |
| M17.15 Nonparametric estimation, smoothing, classificat | core | 67 | 2 (technical proof appendices 2) | 0 | 12.7 | 12.1 | 32 | 30 | 0.2 | 1 (0.3) |
| M18.1 Introduction and multi-armed bandits | core | 46 | 0 | 0 | 4.2 | 4.1 | 12 | 20 | 0.0 | 0 (0.0) |
| M18.2 Finite MDPs and dynamic programming | core | 44 | 0 | 0 | 4.1 | 3.6 | 13 | 20 | 0.0 | 0 (0.0) |
| M18.3 Monte Carlo, temporal-difference, n-step bootstr | core | 68 | 0 | 0 | 6.9 | 5.9 | 22 | 32 | 0.0 | 0 (0.0) |
| M18.4 Planning and learning with tabular methods | core | 32 | 4 (bibliographical and historical remarks 3; chapter summary 1) | 0 | 2.6 | 2.7 | 7 | 14 | 0.1 | 0 (0.0) |
| M18.5 On-policy prediction and control with approximat | core | 49 | 13 (bibliographical and historical remarks 7; opener narrative 3) | 0 | 5.8 | 4.6 | 16 | 19 | 0.2 | 0 (0.0) |
| M18.6 Off-policy methods and eligibility traces | adv | 36 | 28 (eligibility-trace algorithm variants (tr 18; emphatic-TD / variance-reduction variant 4) | 0 | 4.1 | 3.1 | 14 | 14 | 0.2 | 0 (0.0) |
| M18.7 Policy gradient methods and deep RL | core | 31 | 0 | 0 | 4.4 | 4.0 | 14 | 21 | 0.0 | 3 (1.2) |
| M18.8 Psychology and neuroscience | adv | 45 | 37 (bibliographical and historical remarks 14; psychology history/summary (adv M18.8) 10) | 0 | 4.2 | 4.3 | 10 | 17 | 0.1 | 0 (0.0) |
| M18.9 Applications, case studies, frontiers | core | 51 | 9 (Samuel checkers history; Watson wagering 6; bibliographical and historical remarks 3) | 0 | 4.9 | 4.9 | 12 | 19 | 0.0 | 6 (3.1) |
| M19.1 Preview and configuration space | core | 37 | 0 | 0 | 4.7 | 4.2 | 9 | 12 | 0.0 | 0 (0.0) |
| M19.2 Rigid-body motions | core | 62 | 0 | 0 | 7.5 | 6.0 | 16 | 15 | 0.0 | 0 (0.0) |
| M19.3 Forward kinematics | core | 29 | 0 | 0 | 3.3 | 2.5 | 10 | 8 | 0.2 | 0 (0.0) |
| M19.4 Velocity kinematics and statics | core | 29 | 2 (summary 1; notes and references 1) | 0 | 4.1 | 2.3 | 10 | 7 | 0.2 | 0 (0.0) |
| M19.5 Inverse kinematics and closed chains | core | 35 | 0 | 0 | 4.0 | 3.2 | 13 | 13 | 0.1 | 0 (0.0) |
| M19.6 Dynamics of open chains | core | 44 | 6 (summary (formula recap) 4; software library listing 1) | 0 | 5.2 | 4.2 | 14 | 13 | 0.1 | 0 (0.0) |
| M19.7 Trajectory generation and motion planning | core | 62 | 6 (summary 4; notes and references 2) | 0 | 6.8 | 6.0 | 17 | 18 | 0.0 | 0 (0.0) |
| M19.8 Robot control | core | 45 | 5 (summary 2; opener 1) | 0 | 5.4 | 4.3 | 13 | 13 | 0.0 | 0 (0.0) |
| M19.9 Grasping and manipulation | adv | 43 | 0 | 0 | 5.2 | 4.0 | 10 | 9 | 0.0 | 0 (0.0) |
| M19.10 Wheeled mobile robots | core | 42 | 0 | 0 | 5.3 | 3.9 | 13 | 12 | 0.0 | 9 (4.7) |
| M19.11 Useful formulas, optimization and Lagrange multi | ref | 12 | 0 | 0 | 1.0 | 1.0 | 2 | 2 | 0.0 | 0 (0.0) |
| M20.1 Proofs, well ordering, logical formulas | core | 41 | 5 (part dividers 3; references 1) | 0 | 5.6 | 7.2 | 17 | 32 | 0.0 | 0 (0.0) |
| M20.2 Mathematical data types and induction | core | 32 | 0 | 0 | 4.8 | 5.9 | 11 | 19 | 0.0 | 0 (0.0) |
| M20.3 State machines and recursive data types | adv | 29 | 32 (recursive data types detail; search tree 32) | 0 | 4.5 | 5.4 | 10 | 18 | 0.0 | 0 (0.0) |
| M20.4 Infinite sets | adv | 18 | 3 (foundations-of-set-theory aside 2; non-teaching: history 1) | 0 | 2.7 | 3.1 | 6 | 9 | 0.2 | 0 (0.0) |
| M20.5 Number theory and prime numbers | core | 57 | 18 (Vinogradov's method: research-level numb 8; Chebyshev's method for prime distributio 6) | 0 | 9.4 | 8.9 | 26 | 36 | 0.0 | 0 (0.0) |
| M20.6 Directed graphs, partial orders, communication n | core | 36 | 4 (non-teaching: history 2; summary table 2) | 0 | 5.4 | 6.6 | 14 | 28 | 0.0 | 0 (0.0) |
| M20.7 Simple and planar graphs | core | 39 | 14 (formal planar-graph definitions; polyhed 14) | 0 | 5.5 | 7.0 | 16 | 35 | 0.1 | 0 (0.0) |
| M20.8 Sums and asymptotics | core | 31 | 4 (part dividers 4) | 0 | 5.0 | 5.8 | 13 | 16 | 0.0 | 0 (0.0) |
| M20.9 Cardinality rules and generating functions | core | 53 | 5 (poker-hand counting practice 5) | 0 | 8.0 | 9.7 | 20 | 27 | 0.0 | 0 (0.0) |
| M20.10 Recurrences | adv | 26 | 0 | 0 | 3.1 | 3.4 | 7 | 8 | 0.6 | 0 (0.0) |
| M21.1 Algorithm design and analysis | core | 46 | 6 (war story 6; about war stories 0) | 0 | 3.6 | 2.2 | 17 | 21 | 0.0 | 0 (0.0) |
| M21.2 Data structures | core | 37 | 10 (war story 9; opener 1) | 0 | 3.1 | 2.1 | 12 | 20 | 0.0 | 0 (0.0) |
| M21.3 Sorting, divide and conquer | core | 43 | 7 (war story 7) | 0 | 3.5 | 2.0 | 14 | 19 | 0.1 | 0 (0.0) |
| M21.4 Hashing and randomized algorithms | core | 28 | 3 (opener 2; exercise blocks 1) | 0 | 3.5 | 3.0 | 13 | 19 | 0.0 | 0 (0.0) |
| M21.5 Graph traversal and weighted graph algorithms | core | 90 | 3 (war story 3) | 0 | 8.1 | 5.1 | 31 | 47 | 0.0 | 0 (0.0) |
| M21.6 Combinatorial search and dynamic programming | core | 54 | 6 (war story 6) | 0 | 4.6 | 2.5 | 19 | 22 | 0.0 | 0 (0.0) |
| M21.7 NP-completeness and dealing with hard problems | core | 77 | 6 (war story 6) | 0 | 7.0 | 4.3 | 27 | 40 | 0.2 | 1 (0.3) |
| M21.8 How to design algorithms | core | 7 | 0 | 0 | 0.4 | 0.3 | 1 | 3 | 0.0 | 0 (0.0) |
| M21.9 Catalog: numerical and combinatorial problems | ref | 62 | 14 (generating subsets/partitions; calendric 9; catalog openers 5) | 0 | 4.3 | 2.8 | 18 | 26 | 0.2 | 1 (0.3) |
| M21.10 Catalog: computational geometry, sets and string | ref | 97 | 0 (online resources 0) | 0 | 5.8 | 4.3 | 23 | 43 | 0.4 | 0 (0.0) |
| M22.1 Electronic computing machines: principles | core | 10 | 34 (superseded by E22 ch.4-5 (vacuum-tube/dr 15; superseded by E22 ch.2 (1950s programmin 14) | 0 | 1.0 | 0.6 | 1 | 2 | 0.0 | 0 (0.0) |
| M22.2 Computer abstractions and technology | core | 73 | 43 (chapter intro narrative, Real Stuff benc 42; chapter openers 1) | 0 | 4.3 | 3.5 | 10 | 21 | 0.0 | 0 (0.0) |
| M22.3 The basics of logic design | core | 64 | 99 (HDL, ALU construction, carry-lookahead ( 60; microprogrammed control-to-hardware mapp 39) | 0 | 2.4 | 2.1 | 5 | 9 | 0.0 | 0 (0.0) |
| M22.4 Instructions: language of the computer | adv | 88 | 107 (ISA detail (strings, addressing, C/Java  104; chapter openers 3) | 0 | 6.4 | 3.6 | 16 | 26 | 0.0 | 0 (0.0) |
| M22.5 Arithmetic for computers | adv | 51 | 46 (multiply/divide algorithms, Real Stuff S 42; chapter openers 2) | 0 | 3.5 | 2.4 | 6 | 11 | 0.0 | 1 (0.6) |
| M22.6 The processor: datapath, control, pipelining | core | 164 | 79 (intro narrative, Real Stuff pipelines, V 77; chapter openers 2) | 0 | 9.5 | 7.6 | 17 | 31 | 0.2 | 0 (0.0) |
| M22.7 The memory hierarchy | core | 157 | 68 (cache-controller FSM/implementation deta 65; chapter openers 3) | 0 | 9.5 | 7.5 | 19 | 35 | 0.1 | 3 (1.5) |
| M22.8 Parallel processors and GPUs | core | 161 | 101 (CUDA programming, GeForce 8800 Real Stuf 69; cluster networking detail, concluding re 30) | 0 | 7.5 | 5.8 | 18 | 37 | 0.1 | 5 (2.1) |
| M22.9 A survey of RISC architectures | ref | 0 | 56 (survey of RISC instruction sets 56) | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 0 (0.0) |
| M22.10 Microcomputers and microprocessors in circuits | adv | 38 | 271 (lab-course classes/labs on a 1990s lab m 157; 68008 complete design walk-through and L 83) | 0 | 2.3 | 1.8 | 9 | 18 | 0.0 | 3 (1.7) |
| M23.1 Communication systems: AM, FM, multiplexing | core | 40 | 3 (chapter summary 2; chapter intro 1) | 0 | 3.6 | 3.3 | 9 | 11 | 0.8 | 0 (0.0) |
| M23.2 Pulse amplitude and quadrature amplitude modulat | core | 16 | 0 | 0 | 2.0 | 2.4 | 4 | 4 | 0.5 | 0 (0.0) |
| M23.3 Error-correcting codes and real channels | core | 55 | 0 | 0 | 8.2 | 8.8 | 23 | 28 | 0.2 | 0 (0.0) |
| M23.4 Message passing and modern codes: LDPC, turbo, f | adv | 31 | 18 (generalized parity-check matrices (detai 4; exercises 2) | 0 | 4.4 | 5.4 | 13 | 18 | 0.0 | 0 (0.0) |
| M23.5 The wireless channel | core | 35 | 6 (book outline 5; book objective 1) | 0 | 5.5 | 4.8 | 10 | 12 | 0.0 | 1 (0.6) |
| M23.6 Point-to-point communication: detection, diversi | core | 61 | 1 (bibliographical notes 1) | 0 | 7.2 | 5.9 | 13 | 12 | 0.0 | 0 (0.0) |
| M23.7 Cellular systems: multiple access and interferen | core | 35 | 0 | 0 | 4.2 | 3.8 | 7 | 8 | 0.0 | 7 (2.5) |
| M23.8 Capacity of wireless channels, opportunistic com | adv | 88 | 1 (bibliographical notes 1) | 0 | 9.8 | 7.9 | 18 | 17 | 0.6 | 0 (0.0) |
| M23.9 MIMO I: spatial multiplexing and channel modelin | core | 40 | 0 | 0 | 4.5 | 3.8 | 8 | 8 | 0.0 | 0 (0.0) |
| M23.10 MIMO II–IV: capacity, architectures, multiuser | adv | 115 | 19 (universal space-time code construction f 17; bibliographical notes 2) | 0 | 12.2 | 9.8 | 22 | 22 | 1.7 | 0 (0.0) |
| M24.1 Special relativity | core | 29 | 0 | 0 | 6.2 | 7.4 | 12 | 15 | 0.0 | 1 (0.8) |
| M24.2 Relativistic electrodynamics, Lorentz transforma | adv | 24 | 0 | 0 | 5.0 | 5.4 | 10 | 10 | 0.1 | 0 (0.0) |
| M24.3 Quantum behavior: waves and particles | core | 22 | 0 | 0 | 4.2 | 5.5 | 8 | 13 | 0.1 | 1 (0.3) |
| M24.4 Probability amplitudes and identical particles | core | 52 | 0 | 0 | 10.0 | 13.3 | 12 | 15 | 0.0 | 0 (0.0) |
| M24.5 Spin one and spin one-half | adv | 43 | 12 (spin-1/2 rotation matrices about z: form 5; 180/90 degree rotations: formalism detai 5) | 0 | 8.2 | 10.6 | 11 | 14 | 0.2 | 0 (0.0) |
| M24.6 Time dependence, the Hamiltonian matrix, the amm | core | 71 | 0 | 0 | 14.9 | 17.9 | 20 | 22 | 0.0 | 0 (0.0) |
| M24.7 Two-state systems and the hyperfine splitting | adv | 74 | 27 (neutral K-meson: particle physics 14; projection matrix for spin one: formalis 5) | 0 | 16.0 | 18.7 | 19 | 18 | 0.1 | 1 (0.1) |
| M24.8 Propagation in a crystal lattice and semiconduct | core | 48 | 0 | 0 | 9.3 | 12.2 | 13 | 18 | 0.0 | 1 (0.3) |
| M24.9 Independent-particle approximation, dependence o | adv | 31 | 24 (benzene (independent-particle): chemistr 7; spin waves: specialised solid-state 6) | 0 | 6.2 | 7.9 | 8 | 9 | 0.0 | 0 (0.0) |
| M24.10 Symmetry, conservation laws, angular momentum | adv | 80 | 2 (parity violation history 2; parity anecdote 0) | 0 | 16.1 | 19.4 | 21 | 25 | 0.5 | 0 (0.0) |
| M24.11 The hydrogen atom and the periodic table | core | 33 | 0 | 0 | 6.8 | 8.2 | 8 | 9 | 0.2 | 0 (0.0) |
| M24.12 Operators, the Schrödinger equation, superconduc | adv | 61 | 1 (Feynman's epilogue 1) | 0 | 12.6 | 15.2 | 16 | 18 | 0.3 | 0 (0.0) |
| M24.13 The internal geometry of crystals | adv | 8 | 18 (Bragg-Nye bubble model: photo plates and 18) | 0 | 1.5 | 2.1 | 3 | 6 | 0.0 | 0 (0.0) |
| M25.1 Electrons and holes: motion and recombination | core | 47 | 3 (chapter summary 3) | 0 | 6.4 | 4.2 | 19 | 24 | 0.1 | 0 (0.0) |
| M25.2 Device fabrication technology and CMOS processin | core | 40 | 7 (openers 2; chapter summary 2) | 0 | 4.3 | 3.9 | 12 | 25 | 0.0 | 0 (0.0) |
| M25.3 PN and metal–semiconductor junctions | core | 59 | 0 | 0 | 6.8 | 5.5 | 24 | 29 | 0.1 | 0 (0.0) |
| M25.4 The MOS capacitor and the MOS transistor | core | 93 | 5 (chapter summary 4; openers 1) | 0 | 12.0 | 8.9 | 39 | 50 | 0.0 | 0 (0.0) |
| M25.5 MOSFETs in ICs: scaling and leakage | core | 26 | 1 (chapter summary 1) | 0 | 2.6 | 2.5 | 8 | 14 | 0.0 | 1 (0.3) |
| M25.6 The bipolar transistor | adv | 27 | 1 (chapter summary 1) | 0 | 3.3 | 2.6 | 12 | 13 | 0.0 | 0 (0.0) |
| M25.7 Introduction to CMOS VLSI design | core | 46 | 10 (chapter introductions (<=2 pp) 5; MIPS example walk-through 5) | 0 | 3.2 | 2.0 | 11 | 17 | 0.1 | 0 (0.0) |
| M25.8 Delay, power, interconnect | core | 87 | 3 (historical perspective 3) | 0 | 7.8 | 4.1 | 24 | 32 | 0.0 | 0 (0.0) |
| M25.9 Robustness and circuit simulation | adv | 47 | 33 (SPICE tutorial (tool usage) 10; device characterization procedure 10) | 0 | 3.9 | 2.2 | 12 | 16 | 0.0 | 1 (0.3) |
| M25.10 Combinational and sequential circuit design | adv | 82 | 11 (SOI circuit design detail 4; historical perspective 3) | 0 | 6.0 | 3.8 | 14 | 20 | 0.2 | 0 (0.0) |
| M25.11 Datapath, array and special-purpose subsystems | adv | 149 | 30 (ROM 6; counters 5) | 0 | 11.3 | 6.9 | 27 | 37 | 0.0 | 0 (0.0) |
| M25.12 Design methodology, testing, verification | adv | 70 | 10 (chip-book narrative/history 7; chapter introductions (<=2 pp) 2) | 0 | 4.5 | 3.3 | 13 | 24 | 0.1 | 1 (0.6) |
| M25.13 Hardware description languages | ref | 7 | 70 (HDL appendix (SystemVerilog/VHDL coding) 70) | 0 | 0.6 | 0.6 | 1 | 1 | 0.0 | 0 (0.0) |
| M26.1 Curves and surfaces | adv | 30 | 32 (intrinsic geometry and bending of surfac 17; research developments in curves and surf 11) | 0 | 4.1 | 1.6 | 7 | 7 | 0.0 | 0 (0.0) |
| M26.2 Real-variable theory: sets, measure, the Lebesgu | adv | 25 | 9 (point-set topology (Cantor sets etc.): n 7; intro 2) | 0 | 3.8 | 1.0 | 9 | 10 | 0.0 | 0 (0.0) |
| M26.3 Non-Euclidean and Riemannian geometry | adv | 44 | 52 (generalized geometries (projective/affin 13; Lobachevskian plane geometry: pure geome 9) | 0 | 3.5 | 1.6 | 7 | 9 | 0.0 | 0 (0.0) |
| M26.4 Topology | adv | 23 | 11 (combinatorial topology (simplicial homol 8; history of topology 3) | 0 | 2.6 | 1.2 | 6 | 10 | 0.0 | 0 (0.0) |
| M26.5 Groups and other algebraic systems | adv | 50 | 40 (associative algebras: pure algebra 9; Fedorov crystallographic groups: crystal 8) | 0 | 7.3 | 2.7 | 17 | 19 | 0.0 | 0 (0.0) |
| M27.1 Systems engineering fundamentals and the project | core | 40 | 2 (Phase F closeout (C) 2) | 0 | 2.5 | 1.9 | 10 | 26 | 0.0 | 4 (1.8) |
| M27.2 System design: expectations, requirements, decom | core | 38 | 0 | 0 | 1.6 | 2.2 | 5 | 17 | 0.0 | 4 (3.4) |
| M27.3 Product realization: integration, verification,  | core | 42 | 0 | 0 | 2.2 | 1.8 | 6 | 15 | 0.1 | 9 (8.0) |
| M27.4 Crosscutting technical management: planning, req | core | 42 | 17 (SEMP content outline, 12 pp (template) 12; Interface requirements template (6.3 suf 3) | 0 | 2.5 | 2.0 | 7 | 14 | 0.0 | 9 (6.5) |
| M27.5 Technical assessment, decision analysis, technol | core | 22 | 1 (SOW review checklist (template) 1) | 0 | 1.2 | 1.0 | 3 | 6 | 0.1 | 11 (5.5) |
| M27.6 Glossary, acronyms, human systems integration, o | ref | 0 | 37 (Glossary, 21 pp (reference; consult as n 21; HSI plan outline (template; 2.6 suffices 7) | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 1 (0.8) |

### Lanchester

| module | tier | kept wpp | not needed pp (top reasons) | test-out pp | CR | K | S | C | CR delta | added (CR) |
|---|---|---|---|---|---|---|---|---|---|---|
| M0.1 dB and the basic link equation | core | 14 | 0 | 1 | 2.6 | 2.6 | 9 | 7 | 0.0 | 1 (1.5) |
| M0.2 Waves and EM physics | core | 26 | 0 | 0 | 2.2 | 2.2 | 9 | 14 | 1.0 | 0 (0.0) |
| M0.3 Signals, Fourier, convolution, sampling | core | 56 | 0 | 0 | 4.8 | 4.8 | 14 | 13 | 2.2 | 0 (0.0) |
| M0.4 Probability, noise and random signals | core | 15 | 6 (exercises, references, software list 6) | 0 | 2.0 | 2.0 | 7 | 5 | 0.9 | 4 (1.6) |
| M0.5 Modulation and digital communication | core | 39 | 0 | 12 | 1.5 | 1.5 | 6 | 16 | 0.7 | 0 (0.0) |
| M0.6 Estimation and least squares | core | 15 | 0 | 0 | 1.4 | 1.4 | 4 | 5 | 0.7 | 1 (0.1) |
| M0.7 Feedback control basics | core | 8 | 0 | 0 | 0.5 | 0.5 | 2 | 2 | 0.2 | 0 (0.0) |
| M0.8 Spherical trigonometry for EW | core | 11 | 0 | 0 | 1.3 | 1.3 | 4 | 4 | 0.0 | 0 (0.0) |
| M1.1 Antennas | core | 28 | 0 | 8 | 1.4 | 1.4 | 6 | 15 | 0.7 | 0 (0.0) |
| M1.2 Phased arrays | core | 38 | 2 (bibliography / further-reading list 2) | 18 | 1.7 | 1.7 | 7 | 22 | 0.5 | 2 (1.4) |
| M1.3 Propagation | core | 70 | 0 | 12 | 3.0 | 3.0 | 12 | 32 | 1.9 | 3 (0.9) |
| M1.4 One-way link and receiver sensitivity | core | 15 | 0 | 0 | 1.7 | 1.7 | 7 | 8 | 0.3 | 0 (0.0) |
| M2.1 Radar overview | core | 72 | 2 (bibliography / further-reading list 2) | 15 | 4.7 | 4.7 | 20 | 61 | 0.3 | 0 (0.0) |
| M2.2 The radar range equation | core | 41 | 0 | 0 | 8.9 | 8.9 | 25 | 14 | 1.8 | 0 (0.0) |
| M2.3 Search and detection overview | core | 27 | 1 (bibliography / further-reading list 1) | 0 | 1.5 | 1.5 | 4 | 7 | 0.7 | 0 (0.0) |
| M2.4 RCS, scattering and stealth | core | 54 | 1 (bibliography / further-reading list 1) | 18 | 2.0 | 2.0 | 8 | 22 | 0.9 | 3 (2.4) |
| M2.5 Target fluctuation models | core | 26 | 0 | 0 | 1.6 | 1.6 | 6 | 11 | 0.6 | 0 (0.0) |
| M2.6 Clutter | core | 46 | 3 (bibliography / further-reading list 3) | 0 | 4.3 | 4.3 | 11 | 15 | 0.1 | 0 (0.0) |
| M2.7 Doppler phenomenology | core | 36 | 0 | 0 | 2.1 | 2.1 | 8 | 15 | 1.0 | 0 (0.0) |
| M2.8 Radar hardware | core | 80 | 9 (bibliography / further-reading list 4; modulator circuits (C) 2) | 4 | 4.5 | 4.5 | 17 | 44 | 0.3 | 0 (0.0) |
| M2.9 Integration and matched filtering | core | 11 | 0 | 0 | 1.2 | 1.2 | 4 | 3 | 0.6 | 0 (0.0) |
| M2.10 Threshold detection | core | 42 | 0 | 0 | 9.2 | 9.2 | 26 | 15 | 0.2 | 0 (0.0) |
| M2.11 Constant false alarm rate | core | 34 | 2 (bibliography / further-reading list 2) | 0 | 3.0 | 3.0 | 9 | 8 | 1.4 | 0 (0.0) |
| M2.12 Pulse compression and ambiguity | core | 68 | 0 | 3 | 6.1 | 6.1 | 19 | 29 | 1.5 | 0 (0.0) |
| M2.13 Doppler processing | core | 76 | 6 (pulse-pair processing (weather radar tec 5; bibliography / further-reading list 1) | 18 | 6.2 | 6.2 | 17 | 35 | 0.2 | 0 (0.0) |
| M2.14 Radar measurements and monopulse | core | 24 | 1 (bibliography / further-reading list 1) | 0 | 2.1 | 2.1 | 8 | 7 | 0.9 | 0 (0.0) |
| M2.15 Tracking | core | 66 | 3 (bibliography / further-reading list 3) | 4 | 6.9 | 6.9 | 16 | 19 | 3.2 | 0 (0.0) |
| M2.16 Airborne radar: pulse-Doppler, GMTI, STAP | core | 175 | 0 | 16 | 16.7 | 16.7 | 47 | 62 | 2.0 | 0 (0.0) |
| M2.17 Radar imaging | core | 44 | 21 (SAR image-formation derivations (DBS/PFA 19; bibliography / further-reading list 2) | 0 | 3.4 | 3.4 | 11 | 19 | 0.8 | 0 (0.0) |
| M2.18 LPI radar | core | 10 | 0 | 0 | 0.6 | 0.6 | 1 | 2 | 0.2 | 0 (0.0) |
| M2.19 Radar signal processor | adv | 37 | 26 (exciter components (synthesizer hardware 12; exciter design detail (C) 10) | 4 | 1.7 | 1.7 | 7 | 20 | 0.3 | 0 (0.0) |
| M2.20 CW and FMCW radar | core | 70 | 0 | 0 | 4.0 | 4.0 | 8 | 13 | 1.6 | 0 (0.0) |
| M2.21 MMW radar | core | 30 | 0 | 8 | 0.8 | 0.8 | 4 | 19 | 0.2 | 0 (0.0) |
| M2.22 Fire-control radar | core | 58 | 0 | 0 | 1.2 | 1.2 | 5 | 19 | 0.6 | 1 (0.6) |
| M2.23 Multifunction phased array radar | core | 34 | 0 | 20 | 1.5 | 1.5 | 7 | 18 | 0.1 | 0 (0.0) |
| M2.24 Passive bistatic radar | core | 44 | 0 | 0 | 2.6 | 2.6 | 7 | 12 | 0.0 | 0 (0.0) |
| M2.25 Space-based SAR | adv | 68 | 0 | 0 | 5.2 | 5.2 | 13 | 18 | 0.0 | 0 (0.0) |
| M2.26 Foliage-penetrating radar | adv | 56 | 0 | 0 | 3.6 | 3.6 | 7 | 8 | 0.0 | 0 (0.0) |
| M2.27 Air traffic control radar and SSR | adv | 48 | 0 | 0 | 2.2 | 2.2 | 5 | 5 | 1.0 | 0 (0.0) |
| M2.28 Weather, ground-penetrating and police radar | ref | 132 | 0 | 0 | 4.8 | 4.8 | 11 | 25 | 0.0 | 0 (0.0) |
| M2.29 Multitarget, multisensor tracking | core | 31 | 3 (bibliography / further-reading list 3) | 4 | 2.0 | 2.0 | 4 | 7 | 0.9 | 1 (0.3) |
| M2.30 Adaptive digital beamforming | core | 52 | 0 | 0 | 3.2 | 3.2 | 9 | 22 | 0.0 | 0 (0.0) |
| M2.31 Advanced pulse compression waveforms | adv | 65 | 3 (bibliography / further-reading list 3) | 0 | 4.3 | 4.3 | 11 | 16 | 2.0 | 0 (0.0) |
| M2.32 MIMO radar | adv | 60 | 0 | 0 | 5.0 | 5.0 | 18 | 25 | 0.3 | 2 (0.3) |
| M2.33 Sparse reconstruction and compressed sensing | adv | 32 | 30 (sparse-reconstruction algorithms (N) 17; bibliography / further-reading list 11) | 0 | 3.1 | 3.1 | 7 | 9 | 0.0 | 0 (0.0) |
| M2.34 Advanced SAR | adv | 142 | 46 (Doppler beam sharpening algorithm extens 15; range migration algorithm (N) 13) | 7 | 10.1 | 10.1 | 30 | 61 | 0.7 | 0 (0.0) |
| M2.35 Space-time coding | adv | 28 | 2 (chapter summary, redundant with teaching 1; bibliography / further-reading list 1) | 0 | 0.9 | 0.9 | 4 | 17 | 0.0 | 0 (0.0) |
| M2.36 Radar polarimetry | adv | 19 | 23 (scattering-matrix derivation (N) 10; problems of an N-level chapter 5) | 0 | 1.2 | 1.2 | 4 | 8 | 0.3 | 0 (0.0) |
| M2.37 Radar ATR | adv | 31 | 7 (bibliography / further-reading list 7) | 2 | 1.1 | 1.1 | 5 | 16 | 0.1 | 1 (0.3) |
| M2.38 Dismount detection and micro-Doppler | adv | 27 | 7 (bibliography / further-reading list 7) | 0 | 2.6 | 2.6 | 8 | 8 | 0.1 | 0 (0.0) |
| M2.39 Advanced passive bistatic radar processing | adv | 84 | 0 | 0 | 5.4 | 5.4 | 16 | 27 | 0.6 | 0 (0.0) |
| M3.1 EO/IR introduction | core | 20 | 3 (bibliography / further-reading list 2; chapter summary, redundant with teaching 1) | 5 | 1.8 | 1.8 | 9 | 19 | 0.1 | 0 (0.0) |
| M3.2 LSI systems, PSF, MTF | core | 26 | 2 (bibliography / further-reading list 2) | 0 | 2.5 | 2.5 | 8 | 8 | 1.1 | 0 (0.0) |
| M3.3 Diffraction and optics | core | 94 | 17 (bibliography / further-reading list 5; vergence formalism 5) | 0 | 7.4 | 7.4 | 24 | 24 | 3.4 | 1 (0.3) |
| M3.4 Radiometry, targets and backgrounds | core | 50 | 2 (bibliography / further-reading list 2) | 0 | 4.2 | 4.2 | 13 | 14 | 1.9 | 2 (0.6) |
| M3.5 Atmospherics | core | 26 | 0 | 2 | 1.1 | 1.1 | 7 | 10 | 0.5 | 0 (0.0) |
| M3.6 Detectors | core | 41 | 3 (bibliography / further-reading list 3) | 0 | 4.1 | 4.1 | 16 | 20 | 0.2 | 0 (0.0) |
| M3.7 Electronics | adv | 24 | 0 | 0 | 2.1 | 2.1 | 9 | 10 | 0.4 | 0 (0.0) |
| M3.8 Image processing, perception, ATR | adv | 26 | 13 (bibliography / further-reading list 6; CRT displays (obsolete) 2) | 0 | 2.2 | 2.2 | 9 | 13 | 0.5 | 2 (0.8) |
| M3.9 Performance models, Johnson to TTP | core | 45 | 21 (validation experiments of eye-display CT 11; bibliography / further-reading list 6) | 1 | 5.9 | 5.9 | 19 | 17 | 0.3 | 0 (0.0) |
| M3.10 System performance and target acquisition | core | 98 | 2 (bibliography / further-reading list 2) | 26 | 9.1 | 9.1 | 31 | 51 | 0.8 | 1 (0.6) |
| M3.11 Search theory | core | 41 | 14 (appendix: shared-search derivation 6; appendix: time-unlimited FOR search deri 3) | 3 | 4.4 | 4.4 | 13 | 13 | 2.0 | 0 (0.0) |
| M3.12 Hyperspectral detection | adv | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 0 (0.0) |
| M3.13 Lasers, night vision, designation | core | 39 | 0 | 39 | 0.9 | 0.9 | 5 | 28 | 0.0 | 4 (3.2) |
| M3.14 Lab measurements | ref | 4 | 8 (lab resolution measurement practice 2; lab MRTD practice (concept taught in M3. 2) | 0 | 0.4 | 0.4 | 2 | 2 | 0.0 | 0 (0.0) |
| M4.1 EW overview and threats | core | 42 | 0 | 42 | 0.8 | 0.8 | 6 | 42 | 0.0 | 8 (5.5) |
| M4.2 EW receivers | core | 13 | 0 | 10 | 0.5 | 0.5 | 4 | 13 | 0.1 | 2 (0.9) |
| M4.3 EW processing | core | 13 | 0 | 13 | 0.2 | 0.2 | 2 | 11 | 0.0 | 2 (1.8) |
| M4.4 Search strategies | core | 20 | 0 | 20 | 0.3 | 0.3 | 2 | 11 | 0.1 | 0 (0.0) |
| M4.5 SIGINT and ESM | core | 8 | 0 | 8 | 0.1 | 0.1 | 1 | 8 | 0.0 | 0 (0.0) |
| M4.6 Emitter location | core | 70 | 0 | 21 | 4.2 | 4.2 | 17 | 43 | 0.0 | 2 (0.6) |
| M4.7 Jamming fundamentals | core | 22 | 0 | 8 | 1.9 | 1.9 | 7 | 15 | 0.0 | 1 (0.6) |
| M4.8 Deceptive jamming | core | 27 | 0 | 27 | 0.6 | 0.6 | 3 | 12 | 0.1 | 0 (0.0) |
| M4.9 Decoys | core | 18 | 0 | 10 | 1.1 | 1.1 | 5 | 12 | 0.0 | 2 (1.2) |
| M4.10 IR countermeasures and defensive aids | core | 26 | 0 | 21 | 0.9 | 0.9 | 4 | 20 | 0.0 | 3 (2.7) |
| M4.11 LPI signals and communications EW | core | 42 | 0 | 33 | 2.2 | 2.2 | 8 | 26 | 0.2 | 2 (0.9) |
| M4.12 Satellite links and their jamming | core | 28 | 0 | 6 | 2.3 | 2.3 | 8 | 15 | 0.2 | 0 (0.0) |
| M4.13 EW operator interface | ref | 11 | 6 (operator-interface generalities (compute 6) | 11 | 0.1 | 0.1 | 1 | 9 | 0.0 | 0 (0.0) |
| M4.14 EW simulation | adv | 22 | 14 (operator-interface simulation for traini 5; receiver emulation hardware detail 5) | 18 | 0.7 | 0.7 | 4 | 18 | 0.0 | 1 (0.3) |
| M4.15 EW problem bank | core | 40 | 0 | 0 | 2.2 | 2.2 | 4 | 6 | 0.0 | 0 (0.0) |
| M4.16 Electronic protection | core | 57 | 1 (bibliography / further-reading list 1) | 0 | 3.3 | 3.3 | 12 | 34 | 0.1 | 0 (0.0) |
| M5.1 Satnav fundamentals | core | 48 | 16 (bibliography / further-reading list 6; organization of the book 5) | 2 | 4.0 | 4.0 | 14 | 26 | 0.6 | 0 (0.0) |
| M5.2 System segments | adv | 27 | 19 (GPS satellite block-by-block hardware hi 19) | 1 | 1.1 | 1.1 | 4 | 10 | 0.4 | 0 (0.0) |
| M5.3 Satellite signals | core | 34 | 6 (navigation message bit format 3; bibliography / further-reading list 3) | 0 | 2.1 | 2.1 | 6 | 10 | 0.3 | 0 (0.0) |
| M5.4 Acquisition and tracking loops | core | 78 | 11 (bibliography / further-reading list 3; special baseband functions (lock detecto 2) | 0 | 5.7 | 5.7 | 14 | 16 | 2.6 | 0 (0.0) |
| M5.5 Interference, spoofing, multipath | core | 54 | 4 (bibliography / further-reading list 4) | 0 | 5.0 | 5.0 | 11 | 18 | 0.0 | 1 (0.3) |
| M5.6 Stand-alone performance | core | 76 | 5 (bibliography / further-reading list 5) | 1 | 5.5 | 5.5 | 13 | 27 | 0.7 | 1 (0.6) |
| M5.7 Differential GPS | adv | 71 | 9 (bibliography / further-reading list 5; RTCM message formats 4) | 0 | 4.9 | 4.9 | 15 | 25 | 0.3 | 0 (0.0) |
| M5.8 INS and integration | core | 71 | 0 | 30 | 5.3 | 5.3 | 19 | 48 | 0.2 | 1 (0.6) |
| M5.9 Other GNSS | adv | 71 | 5 (Japanese QZSS program 5) | 29 | 1.5 | 1.5 | 6 | 44 | 0.0 | 0 (0.0) |
| M5.10 Land-vehicle sensor integration and network assi | adv | 31 | 37 (types of network assistance (civil cellu 16; FCC E911 mandate requirements 7) | 0 | 2.5 | 2.5 | 7 | 10 | 0.0 | 0 (0.0) |
| M5.11 Alt-PNT | core | 25 | 0 | 0 | 2.0 | 2.0 | 7 | 12 | 0.3 | 2 (1.1) |
| M6.1 Equations of motion | core | 48 | 4 (Bibliography only (13 pp). 4) | 0 | 5.4 | 5.4 | 10 | 11 | 2.5 | 0 (0.0) |
| M6.2 Aerodynamics, missile model, autopilots | core | 90 | 4 (Bibliography only (13 pp). 2; Not relevant to missiles (2 pp). 2) | 8 | 8.3 | 8.3 | 22 | 24 | 3.8 | 1 (0.3) |
| M6.3 Guidance phases and intercept techniques | core | 28 | 0 | 20 | 0.4 | 0.4 | 3 | 17 | 0.1 | 1 (0.6) |
| M6.4 Proportional navigation | core | 61 | 0 | 0 | 7.0 | 7.0 | 14 | 7 | 3.2 | 0 (0.0) |
| M6.5 Optimal guidance and end game | core | 34 | 0 | 0 | 3.9 | 3.9 | 7 | 6 | 1.3 | 0 (0.0) |
| M6.6 Seekers and guidance system model | core | 37 | 0 | 0 | 3.7 | 3.7 | 11 | 9 | 0.9 | 4 (2.1) |
| M6.7 Weapon delivery | core | 125 | 15 (Glossary (14 pp); tutor can define terms 14; Bibliography only (13 pp). 1) | 67 | 8.5 | 8.5 | 28 | 71 | 0.7 | 3 (1.5) |
| M6.8 Ballistic missiles | core | 142 | 2 (Bibliography only (13 pp). 2) | 1 | 20.3 | 20.3 | 39 | 20 | 9.4 | 7 (2.9) |
| M6.9 Hypersonic boost-glide | core | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 2 (1.8) |
| M6.10 Cruise missiles | core | 28 | 2 (Bibliography only (13 pp). 2) | 6 | 2.5 | 2.5 | 7 | 11 | 0.0 | 3 (1.6) |
| M6.11 Siouris appendices | ref | 40 | 26 (Look-up material (26 pp); keep App. D at 26) | 0 | 0.6 | 0.6 | 2 | 14 | 0.0 | 0 (0.0) |
| M6.12 Tactical missile conceptual design (Fleeman B13) | core | 218 | 0 | 0 | 27.0 | 27.0 | 72 | 63 | 0.0 | 8 (7.5) |
| M6.13 Tactical missile design, advanced chapters (Flee | adv | 26 | 0 | 0 | 3.2 | 3.2 | 9 | 8 | 0.0 | 0 (0.0) |
| M7.1 The AMD problem and MOEs | core | 46 | 0 | 42 | 5.7 | 5.7 | 15 | 34 | 0.0 | 8 (6.8) |
| M7.2 AMD system requirements | core | 44 | 0 | 20 | 2.3 | 2.3 | 8 | 20 | 0.1 | 1 (0.6) |
| M7.3 Preliminary design | core | 104 | 0 | 44 | 11.9 | 11.9 | 35 | 43 | 0.2 | 5 (4.8) |
| M7.4 Trades and allocation + raids, magazines and cos | core | 36 | 0 | 7 | 1.1 | 1.1 | 3 | 8 | 0.5 | 9 (4.0) |
| M7.5 Interceptor flight analysis | core | 18 | 0 | 18 | 3.3 | 3.3 | 6 | 3 | 0.0 | 0 (0.0) |
| M7.6 BMD intercept and countermeasures | core | 15 | 2 (Bibliography only (13 pp). 2) | 0 | 0.5 | 0.5 | 1 | 2 | 0.2 | 3 (0.9) |
| M7.7 Ballistic missile defense radar | core | 38 | 0 | 22 | 0.7 | 0.7 | 3 | 14 | 0.3 | 0 (0.0) |
| M7.8 Ground-based early warning radar | core | 60 | 0 | 14 | 2.2 | 2.2 | 8 | 25 | 0.8 | 5 (2.6) |
| M7.9 Link 16, C2 and networked warfare | core | 9 | 0 | 9 | 0.1 | 0.1 | 1 | 6 | 0.1 | 21 (19.1) |
| M7.10 Systems engineering lifecycle + T&E and test evi | core | 20 | 0 | 20 | 0.3 | 0.3 | 3 | 18 | 0.0 | 5 (4.1) |
| M8.1 Military air roles | core | 47 | 0 | 47 | 0.6 | 0.6 | 6 | 61 | 0.0 | 3 (1.5) |
| M8.2 Avionics architectures | adv | 24 | 0 | 24 | 0.4 | 0.4 | 3 | 28 | 0.0 | 1 (0.3) |
| M8.3 Air combat maneuvering | core | 4 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 1.3 | 0 (0.0) |
| M8.4 Transponders and IFF | core | 9 | 0 | 9 | 0.1 | 0.1 | 1 | 6 | 0.1 | 1 (0.6) |
| M8.5 Displays | ref | 55 | 0 | 55 | 1.2 | 1.2 | 6 | 48 | 0.0 | 0 (0.0) |
| M8.6 FMS and air traffic management | ref | 19 | 0 | 19 | 0.2 | 0.2 | 1 | 14 | 0.0 | 0 (0.0) |
| M8.7 Vehicle management systems | ref | 32 | 0 | 32 | 0.5 | 0.5 | 3 | 24 | 0.0 | 1 (0.3) |
| M8.8 Combat survivability (Ball): susceptibility, vul | core | 275 | 0 | 15 | 17.9 | 17.9 | 62 | 174 | 0.0 | 5 (2.2) |
| M8.9 Air campaign capacity: sortie generation, basing | core | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 3 (4.5) |
| M9.1 UAS history and classes | adv | 44 | 0 | 44 | 0.3 | 0.3 | 3 | 41 | 0.0 | 0 (0.0) |
| M9.2 Air vehicle performance and propulsion | core | 56 | 0 | 27 | 6.0 | 6.0 | 16 | 25 | 2.8 | 1 (0.6) |
| M9.3 Control station and autonomy | core | 41 | 0 | 41 | 0.6 | 0.6 | 5 | 33 | 0.3 | 3 (1.9) |
| M9.4 Payloads | core | 32 | 0 | 32 | 0.6 | 0.6 | 5 | 29 | 0.0 | 1 (0.6) |
| M9.5 UAS data links | core | 70 | 0 | 51 | 2.2 | 2.2 | 11 | 50 | 0.1 | 0 (0.0) |
| M9.6 Rotary-wing and quadcopters | core | 16 | 0 | 6 | 0.5 | 0.5 | 2 | 9 | 0.0 | 0 (0.0) |
| M9.7 Drone detection and C-UAS | core | 36 | 0 | 36 | 0.2 | 0.2 | 3 | 25 | 0.0 | 7 (4.7) |
| M9.8 Launch and recovery | adv | 40 | 0 | 40 | 1.9 | 1.9 | 8 | 26 | 0.0 | 0 (0.0) |
| M9.9 One-way attack drones, FPV and drone-war economi | core | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 11 (8.5) |
| M10.1 Underwater acoustics | core | 16 | 0 | 0 | 1.7 | 1.7 | 5 | 7 | 0.0 | 0 (0.0) |
| M10.2 The sonar equation | core | 18 | 0 | 0 | 1.8 | 1.8 | 6 | 7 | 0.0 | 0 (0.0) |
| M10.3 Sonar systems and non-acoustic detection | core | 24 | 0 | 8 | 2.4 | 2.4 | 8 | 15 | 0.0 | 4 (3.7) |
| M10.4 Torpedoes and mines | core | 10 | 0 | 5 | 0.3 | 0.3 | 2 | 7 | 0.0 | 0 (0.0) |
| M10.5 Ship self-defense | core | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 12 (10.7) |
| M11.1 Interior and exterior ballistics | core | 12 | 0 | 0 | 0.5 | 0.5 | 2 | 4 | 0.2 | 0 (0.0) |
| M11.2 Weapon-locating radar and counterfire | core | 102 | 0 | 98 | 0.8 | 0.8 | 9 | 70 | 0.0 | 3 (2.6) |
| M11.3 Explosives and warheads | core | 18 | 0 | 0 | 1.8 | 1.8 | 7 | 7 | 0.0 | 0 (0.0) |
| M11.4 Damage criteria, Pk, CEP | core | 12 | 0 | 0 | 1.4 | 1.4 | 5 | 4 | 0.0 | 0 (0.0) |
| M11.5 Special warheads and tank ammunition | core | 27 | 0 | 0 | 0.3 | 0.3 | 3 | 14 | 0.0 | 0 (0.0) |
| M11.6 Tank protection | core | 19 | 0 | 0 | 0.3 | 0.3 | 1 | 7 | 0.0 | 4 (2.5) |
| M11.7 Tank mobility | core | 32 | 0 | 0 | 0.5 | 0.5 | 3 | 13 | 0.0 | 0 (0.0) |
| M11.8 Tank evolution since 1945 | adv | 116 | 0 | 116 | 0.5 | 0.5 | 6 | 80 | 0.0 | 0 (0.0) |
| M11.9 Tank evolution to 1945 | ref | 163 | 0 | 163 | 0.7 | 0.7 | 10 | 111 | 0.0 | 0 (0.0) |
| M11.10 Nuclear weapons and effects | adv | 43 | 0 | 0 | 1.9 | 1.9 | 9 | 24 | 0.0 | 1 (0.3) |
| M12.1 Russian air defense and EW | core | 66 | 0 | 66 | 0.4 | 0.4 | 5 | 46 | 0.0 | 6 (3.0) |
| M12.2 Russian tactics | adv | 197 | 0 | 197 | 1.1 | 1.1 | 17 | 132 | 0.0 | 0 (0.0) |
| M12.3 Chinese joint capabilities | core | 46 | 0 | 46 | 0.2 | 0.2 | 3 | 32 | 0.0 | 4 (2.4) |
| M12.4 Chinese tactics | adv | 188 | 0 | 188 | 0.8 | 0.8 | 14 | 126 | 0.0 | 0 (0.0) |
| M13.1 Space missions and communities | core | 44 | 0 | 0 | 3.8 | 3.8 | 12 | 13 | 0.0 | 0 (0.0) |
| M13.2 Space mission engineering process | ref | 82 | 0 | 33 | 7.0 | 7.0 | 23 | 24 | 0.0 | 1 (0.3) |
| M13.3 The space environment | core | 22 | 0 | 2 | 1.9 | 1.9 | 6 | 7 | 0.0 | 1 (0.6) |
| M13.4 Orbits and astrodynamics | core | 38 | 0 | 3 | 2.2 | 2.2 | 7 | 8 | 1.0 | 1 (0.3) |
| M13.5 Space mission geometry | core | 48 | 0 | 0 | 4.1 | 4.1 | 13 | 14 | 0.0 | 0 (0.0) |
| M13.6 Orbit and constellation design | core | 54 | 0 | 12 | 3.1 | 3.1 | 10 | 11 | 1.4 | 0 (0.0) |
| M13.7 Cost, financing, law | ref | 108 | 0 | 12 | 0.0 | 0.0 | 20 | 76 | 0.0 | 1 (0.6) |
| M13.8 Spacecraft design | adv | 42 | 0 | 0 | 3.6 | 3.6 | 12 | 12 | 0.0 | 0 (0.0) |
| M13.9 Space payloads | core | 16 | 0 | 0 | 1.4 | 1.4 | 4 | 5 | 0.0 | 1 (0.6) |
| M13.10 Communications payloads and SATCOM | core | 38 | 0 | 0 | 3.2 | 3.2 | 11 | 11 | 0.0 | 2 (0.9) |
| M13.11 Observation payloads | core | 34 | 0 | 2 | 2.9 | 2.9 | 9 | 10 | 0.0 | 5 (3.9) |
| M13.12 Rocket propulsion and launch vehicles | core | 32 | 0 | 13 | 0.0 | 0.0 | 4 | 15 | 0.0 | 3 (1.7) |
| M13.13 Attitude and orbit control | adv | 36 | 0 | 0 | 2.1 | 2.1 | 7 | 7 | 1.0 | 0 (0.0) |
| M13.14 Spacecraft computer systems | adv | 26 | 0 | 26 | 2.2 | 2.2 | 7 | 8 | 0.0 | 0 (0.0) |
| M13.15 TT&C and power | core | 36 | 0 | 0 | 3.1 | 3.1 | 10 | 11 | 0.0 | 0 (0.0) |
| M13.16 Structures and thermal control | adv | 38 | 0 | 22 | 2.2 | 2.2 | 7 | 8 | 1.0 | 0 (0.0) |
| M13.17 Manufacturing, risk and reliability | ref | 80 | 0 | 42 | 6.8 | 6.8 | 22 | 24 | 0.0 | 1 (0.6) |
| M13.18 SmallSats and CubeSats | adv | 48 | 0 | 10 | 4.1 | 4.1 | 13 | 14 | 0.0 | 0 (0.0) |
| M13.19 Launch operations | ref | 18 | 0 | 15 | 0.0 | 0.0 | 3 | 13 | 0.0 | 0 (0.0) |
| M13.20 Ground system design | adv | 24 | 0 | 9 | 0.0 | 0.0 | 4 | 17 | 0.0 | 0 (0.0) |
| M13.21 Mission operations and end of mission | ref | 46 | 0 | 34 | 0.0 | 0.0 | 9 | 32 | 0.0 | 0 (0.0) |
| M13.22 SMAD appendices | ref | 48 | 0 | 15 | 2.0 | 2.0 | 7 | 14 | 0.0 | 0 (0.0) |
| M13.23 Space control: counterspace taxonomy, SDA, RPO,  | core | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 7 (4.0) |
| M14.1 Combat modeling: model types and MOEs, Lancheste | core | 122 | 0 | 122 | 16.1 | 16.1 | 44 | 45 | 0.0 | 17 (10.7) |
| M14.2 Acquisition, cost and industrial base: cost defi | core | 62 | 0 | 0 | 0.3 | 0.3 | 22 | 88 | 0.0 | 17 (12.3) |
| M14.3 Logistics and sustainment: consumption, LOC capa | core | 224 | 0 | 0 | 4.4 | 4.4 | 31 | 196 | 0.0 | 13 (8.8) |
| M14.4 OSINT and capability assessment: imagery, geoloc | core | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 13 (13.0) |
| M14.5 Writing and interviewing as an analyst (capstone | core | 0 | 0 | 0 | 0.0 | 0.0 | 0 | 0 | 0.0 | 8 (7.6) |

## 7. Limits

- Book CR/K/S/C come from the section registries (hand-counted samples + GLM); fold-level error is large for CR (about 40% per 90 pages) but corpus totals are within about +-12%.
- Added-item counts are fixed per-item estimates by importance and status, not counted lessons.
- Ref-book pages re-hosted into lessons (B13-B17) are outside the registries; their counts use Lanchester class rates per page. B17 chapter page splits are approximate (unpaginated e-book). B13 and B12 are image-only, so their sections were judged from tables of contents.
- Panel section decisions were partly title-level (P2, P4 mark these in their JSON).
