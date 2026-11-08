# Panel P4: ML, RL, robotics, periphery, and the military quantitative toolkit

**Panel:** an ML researcher, a robotics engineer, a computer-systems and chip engineer, and a defense quantitative analyst.

**Data:** `P4_ml_rl_robotics_periphery.json`, in this folder.

**How to rebuild:**
- Run `python3 -I build.py` in the scratchpad folder `p4/`.
- The search helpers are `p4/s.py` and `p4/q.py`. They search the text of every book page: the Gilua JSON, plus `pdftotext` extracts of the military PDFs.
- B12 (SMAD) and B13 (Fleeman) are image-only scans, so they could not be searched.

**Host notation:** `G:` means a Gilua module and `L:` means a Lanchester module. MG host IDs are ambiguous between the two apps. For example, MG sends the CRB, DOP and CEP gaps to "M8.5", which in Lanchester is *Displays*.

## Counts

| | K | S | C | N | total |
|---|---|---|---|---|---|
| Subtopics, after review | 50 | 102 | 15 | 10 | **177** |

K/S status after verification, against MG:

| | MG said | Panel verdict |
|---|---|---|
| full | 84 | **103** |
| partial | 34 | **37** |
| missing | 34 | **12** |

K/S status by domain (full / partial / missing):

| domain | full | partial | missing |
|---|---|---|---|
| ML | 20 | 12 | 4 |
| RL | 10 | 7 | 1 |
| Robotics | 14 | 4 | 6 |
| Periphery | 22 | 10 | 0 |
| MIL foundations | 37 | 4 | 1 |

Other counts:
- **Importance changes:** 10.
  - Raised to K: backprop/AD, evaluation metrics, adversarial robustness, ML compute, ML assurance, software failure modes, foundry economics.
  - Raised C→S: legged robots, swarms.
  - Lowered S→C: GLMs.
- **Subtopics added:** 18 (11 K, 7 S). They are listed below.
- **Unmatched or non-teaching sections reviewed:** 676 (about 3,136 pp).
  - **Not needed:** 297 sections, **1,359 pp**.
  - **Kept:** 379 sections, **1,778 pp**.
  - E22 pages are reflowed e-book pages. The 599 not-needed E22 pages are about 300 printed pages.

## What MG got wrong in these domains

**1. 36 false "missing" labels.** Each was found by reading the text:
- backprop and reverse-mode AD: E17 §7.4
- SGD, momentum and Adam: E17 ch.6
- MCTS and AlphaGo Zero: E18 §8.11 and §16.6
- POMDPs: E18 §17.3
- combinatorics: all of E20 ch.15, 39 pp
- big-O: E21 §2.2, mistyped as an appendix
- the halting problem: E20 §8.2
- windowing: B02 §14.4
- the Cramér–Rao bound: B02 §18.4.2 (OCR broke the name)
- DOP: B05 §7.3
- CEP and error ellipses: B04 §6.4–6.6
- ECEF frames: B05 §2.2
- the 4/3-earth radar horizon: B01 ch.6

Most of the military "gaps" sit in Lanchester P4/P5 modules rather than in P0. **Action:** add a one-paragraph forward pointer in M0.6 and M0.8. Nothing new needs to be written.

**2. 9 false "full" labels.** These are now partial or missing:
- **LLMs:** matched to MacKay's "simple language models".
- **ML assurance:** matched to E08's verification of numerical code.
- **Localization:** matched to generic MCMC.
- **Real-time systems:** matched to "real-time dynamic programming".

**3. Teaching sections MG would have dropped.** These must be **kept**:
- the MOSFET core, about 70 pp: E24 ch.5–7 and E25 ch.2
- CMOS delay and power: E25 ch.4–5, including logical effort and P = αCV²f
- E18 ch.16–17: DQN, AlphaGo, reward design, POMDPs and the future of AI
- E17 ch.16–17: flows and VAEs
- P&H material:
  - §4.5 pipelining, mistyped as history
  - §1.10 and §6.13 Amdahl's law
  - §6.10–6.11 roofline
  - §1.7 power wall
  - §5.1 locality
- E21 §1.9 "Estimation", typed as history. It is one of only two places that teach Fermi estimation.

## The most important true gaps

Each gap names its host module.

1. **Scaling laws and AI-compute arithmetic** (K) → G:M17.12.
   - Add: C≈6ND, about 2N FLOP per token, the Chinchilla result, the memory-bandwidth-bound regime and energy.
   - Nothing on this in any book.
2. **LLM post-training** (K, partial) → G:M17.7.
   - Add: RLHF/preference optimization, inference-time compute, agents and tool use, hallucination.
   - E17 (2023) stops at GPT-3.
3. **Assurance of learned and autonomous systems** (K) → G:M27.3. This merges ML 4.7 and Robotics 3.2.
   - Add: ODD, safety case (UL 4600), SOTIF, runtime assurance, DoD 3000.09.
   - Zero hits in the books.
4. **Evaluation and claims-checking** (K, partial) → G:M17.5.
   - Add: precision/recall under base rates, calibration, data leakage, and benchmark contamination.
   - The word "leakage" never appears in the ML books.
5. **Distribution shift and adversarial ML as an operational threat** (K, partial) → G:M17.12, with a Lanchester delta in C4ISR/EW.
6. **Mental estimation and Fermi method** (K) → L:M0.1.
   - Only Skiena §1.9 covers it.
   - This is the learner's stated level-2.5 skill, and no module teaches it as a method.
7. **Robotics perception and state estimation** → G:M19.10. MR (Modern Robotics, E19) has no perception chapter. Missing:
   - camera models and stereo (S)
   - SLAM (S)
   - VO/VIO (S)
   - robot localization (S)
8. **Swarms and multi-robot systems** (S), **legged and underactuated robots** (S), **sim-to-real** (S) and **robot software/ROS** (S).
   - All are confirmed absent.
   - All are high-salience in drone and UGV debates.
9. **Foundry economics and geopolitics** (K, partial) → G:M25.12.
   - Covered so far: only E25 §14.5 and P&H §1.5 die-cost arithmetic.
   - Missing: EUV, TSMC concentration, chiplets and export controls.
10. **Software failure modes** (K, partial) → G:M22.7.
    - Missing cases: Patriot 1991 clock drift, Ariane 5, Therac-25 and the 737 MAX.
    - Also missing: why software is the critical path in weapon programs.
11. **Independence failures and compounding** (K) → L:M0.4.
    - Add: correlated shots and common-mode failures, 1−(1−p)^n, and small-sample confidence (the rule of three).

The added subtopics (the `added` key in the JSON) cover the systems side of the AI and chip race:
- domain-specific accelerators and HBM
- cybersecurity fundamentals for weapon systems (absent from both apps)
- floating point and the Patriot case
- the MOSFET and CMOS power models, which are well covered but were absent from the BoK
- edge inference
- safe RL
- unmanned-system autonomy architecture
- relative-motion kinematics

## Biggest not-needed blocks

| block | pages | why |
|---|---|---|
| E09a lab-course classes and labs (M22.10) | 157 | 1990s lab microcomputer, assembly, wiring |
| E22 ch.2 ISA detail | 104 | strings, addressing modes, compiling C/Java (36 pp), x86/MIPS Real Stuff |
| E09 ch.11 68008 walk-through and ch.10 legacy-bus detail | 113 | 1980s hardware detail |
| E22 ch.4 Verilog tutorial, Real Stuff and history | 77 | |
| E25 appendix A (HDL coding) | 70 | |
| E22 appendix B GPU programming | 69 | CUDA, GeForce 8800, app mapping |
| E22 ch.5 cache-controller implementation and Real Stuff | 65 | |
| E22 appendix A | 60 | ALU construction, carry lookahead and SRAM/DRAM; duplicates E25 |
| E22 appendix D, RISC ISA survey | 56 | |
| E22 appendix C, microprogrammed control | 39 | |
| E21 war stories | 36 | |
| E20 recursive data types | 32 | search trees duplicate E21 |
| E18 bibliographical remarks | 31 | |
| E18 eligibility-trace variants | 18 | |
| K2 ch.XIV §1–3 (1950s computing machines) | 34 | superseded by P&H |

What these blocks mean for the modules:
- **M22.10** (adv) is about 90% not needed. Keep only E09 §10.01–10.19 on buses, interrupts, DMA and serial communications.
- **M22.9** and **M25.13** (both ref) are wholly not needed.
- **M22.1**, a core module of Kolmogorov's 1950s computing, should shrink to a short bridge.

## Surprises

- **The MIL foundations domain is the best covered of the five:** 37 of 42 K/S full. The remaining partials are about method, not content: mental estimation, independence failures, uncertainty propagation, and DoD KPPs.
- **MR (E19) is a manipulator book.** Kinematics, dynamics, planning and control are excellent. Perception, estimation, software, safety, swarms and legged locomotion are absent. Gilua's robotics is "half a field".
- **The best AI-relevant hardware material is in sections MG classed as non-teaching:** roofline, GPUs, Amdahl, the DGEMM "Going Faster" thread. It should form a unit with the ML-compute gaps.
- **E18 ch.14–15 (psychology and neuroscience)** carry a genuine cross-domain structure: the TD error corresponds to dopamine, and Rescorla–Wagner corresponds to TD. About 38 pp are kept for this. The history, addiction and experimental-detail sections (about 37 pp) are not needed.

## Rough items (to check)

- Section decisions for E22, E25 and E09 are rule-based on titles, with spot reads. They are not page-by-page.
- Borderline items that need a second look:
  - E25 ch.11 detail
  - E20 planar graphs
  - E22 §6.9
- Page numbers in `where` for Gilua P5–P7 cross-references are approximate. These are sections owned by other panels.
