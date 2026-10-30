# Panel P3: thermo-fluids, structures, systems engineering, engineering judgment

**Panel:** a thermal-fluids/aerospace engineer, a structures and materials engineer, and a chief systems engineer.

**Domains (Gilua):**
- Thermodynamics and heat transfer
- Fluids, aerodynamics and propulsion
- Structures and materials
- Systems engineering
- Engineering judgment (cross-cutting)

**Method:**
- Every K/S subtopic was re-checked with regex searches over the full text of every Gilua book (`eng/app/artifact/lib/text`) and the readable Lanchester texts (B14–B17), and against the TOCs. Candidate pages were read where the verdict depended on them.
- SMAD (B12) is image-only. Items that only SMAD covers are cited by chapter, and the panel could not read them.
- The section review covers every unmatched, C-only and non-teaching section in parts P13, P14, P15, P16 and P27.

**Output:** `P3_thermo_fluids_structures_systems.json`, with full per-item references.

## Counts

**Subtopics:** 219 in total, 198 of them K/S, plus 14 added (3 of them K).

| | full | partial | missing |
|---|---|---|---|
| K, merge | 28 | 8 | 18 |
| **K, panel** | **29** | **19** | **6** |
| S, merge | 75 | 30 | 39 |
| **S, panel** | **82** | **37** | **25** |

- **The panel changed the merge's status for 63 of the 198 K/S items.** The automatic map was wrong in both directions.
- **False misses.** The merge marked these missing, but the books cover them fully:
  - fins (E16 4.5);
  - semi-infinite conduction (E16 5.6);
  - correlation uncertainty (E16 7.7, 9.x);
  - units and dimensional homogeneity (E15 1-2, E11 2.4);
  - integration planning (E26 5.2, App H);
  - fluid properties;
  - Bernoulli and control-volume balances (E11 4.1–4.7, E15 5).
- **Items the merge undercounted.** The books cover these in part, not fully as the merge said:
  - trade studies (E26 4.4, 6.8; Ashby ch. 7);
  - weighted-scoring pitfalls (Ashby 7.6, an appendix);
  - FMEA and FTA (Ball 5.3, Lanchester);
  - fracture toughness (Ashby 3.4, 4.3, 6.11, B.10);
  - factor and margin of safety (Gere 1.7).
- **False "full" matches.** The merge marked these full on wrong-domain hits:
  - turbulence models (it matched optical turbulence in B03);
  - cavitation (Feynman, wrong chapter);
  - phase diagrams (E15 pure-substance P-v-T);
  - J2 perturbations (Boyd duality);
  - joints (Chinese-tactics doctrine);
  - test qualification (semiconductor reliability).
- **Importance changes (4):**
  - additive manufacturing C→S (defense production articles);
  - resilience and graceful degradation S→K (kill webs, AMD);
  - tolerancing and GD&T K→S;
  - precision-engineering principles S→C.

**Gaps to add:** 87 K/S items in total.
- 31 missing, 6 of them K:
  - FEM in practice;
  - common-cause failure;
  - anomaly and root-cause investigation;
  - sanity checks of computer and AI outputs;
  - GUM measurement uncertainty;
  - resilience.
- 56 partial, 19 of them K.

**Sections reviewed:** 621 sections, 2,412 pp.

| decision | sections | pages |
|---|---|---|
| NOT NEEDED | 332 | 984 |
| KEEP | 289 | 1,428 |

## The most important gaps

Grouped by host module; the full items are in the JSON.

**Judgment.** This is the weakest domain relative to its importance. Its K items exist only as scattered instances, and no lesson names them.
- **Missing:**
  - **Sanity-check protocol for computer and AI outputs** (M27.5, but teach it early): units, limits, conservation, OOM, an independent rough model, LLM failure patterns.
  - **GUM measurement uncertainty** (M6.4).
- **Partial:**
  - **Explicit Fermi method:** MacKay (E14) demonstrates it and never names it (M13.15).
  - **Curated by-heart numbers:** E14 App I and E16 A.7 are the seeds (M13.15).
  - **Square-cube and scaling laws** (M14.4).
  - **Approximation hierarchy** (M10.8).
- **Added K, A-J1: fundamental limits as anchors.** Carnot, Betz, Tsiolkovsky, Shannon, diffraction and Landauer, each with "how close real systems get".

**Systems engineering (M27.x).** NASA E26 gives the process well (requirements, ConOps, reviews, V&V, CM, risk, TRL). It has almost none of the quantitative SE tools.
- **K gaps:**
  - decision analysis under uncertainty and value models (M27.5);
  - technical budgets and margins (M27.4);
  - common-cause failures (M27.4);
  - anomaly and root-cause investigation (M27.3);
  - failure case studies (M27.1);
  - systems thinking (M27.1).
- **Unify with Lanchester:**
  - reliability and redundancy (B15 ch. 9, readable; host L:M13.17 and L:M8.7);
  - cost estimation and learning curves (SMAD ch. 11, image-only; host L:M13.7);
  - FMEA and FTA (Ball 5.3).
- **Missing S:** PRA, hazard analysis, STPA, software assurance, MBSE, security, standards map, EVM detail.
- **Added K, A-Y1: success-run test statistics.** For example, 22 straight successes are needed to show R = 0.9 at 90% confidence. This is central to judging weapon-test claims.

**Structures (M16.x).**
- **Partial K items to complete with the derivation skeleton:**
  - fatigue: no Goodman or Miner anywhere in the books (M16.2);
  - fracture mechanics, LEFM (M16.11);
  - FS vs MS vs probabilistic design (M16.2);
  - shell and local buckling with knockdown factors (M16.7).
- **FEM in practice (K, M16.6).** The syllabus already admits that FEM has no source.
- **Missing S:**
  - random vibration and the Miles equation, and SRS (M16.6);
  - structural MDOF modes (M10.4);
  - damage tolerance and failure analysis (M16.11);
  - A/B allowables (M16.10);
  - tolerance stack-up, worst case vs RSS (M16.16);
  - machine elements (M16.3).

**Fluids (M15.x).**
- **Navier–Stokes structure (K, partial, M15.1).** Feynman II ch. 40 is missing from the PDF, so Euler and vorticity have no Feynman text.
- **Turbulence (K, partial, M14.6).** Lienhard 6.7–6.8 is the real host. Missing: the energy cascade and Kolmogorov scales.
- **Missing S:**
  - CFD practice and turbulence models (M15.7);
  - aeroelasticity and flutter (M15.9);
  - turbomachinery, velocity triangles and affinity laws (M15.16);
  - cavitation (M15.1);
  - system curves (M14.7).
- **Partial:** dynamic stability modes (M15.14; only descriptive in Lanchester B09).
- **Hohmann and Delta-V budgets (K, partial).** The word "Hohmann" appears in no readable book. Only image-only SMAD covers them (L:M13.4, L:M13.6), so M15.15 needs the content.
- **Added K, A-F1: hover and multirotor power.** P = T^1.5/sqrt(2ρA) and battery endurance. It is the most-used estimate in UAS writing, and absent from both maps.

**Thermo and heat transfer (M13.x, M14.x).**
- Well covered: Çengel and Lienhard are complete for every K item.
- Gaps:
  - thermal design margins (M14.10);
  - one synthesizing lesson on electronics and spacecraft thermal control (M14.10);
  - battery electrochemistry at OOM level (M13.17).
- Added:
  - cryocoolers for IR seekers (A-T1; E15 12-5, the JT coefficient, is the seed);
  - aerothermal heating and TPS (A-T2);
  - IR signature physics as a cross-app bridge (A-T3).

## The biggest NOT-NEEDED blocks

| block | pp | note |
|---|---|---|
| E16 end-of-chapter problems and references | ~190 | keep the problems as an exercise pool only |
| E15 App 2 (English-unit tables) + E16 App A–C | ~84 | E15 App 1 (SI) is kept as reference |
| E11 ch. 1 history + all Historical Notes | ~120 | test-out |
| E11 App D airfoil data | 29 | |
| E12 openers, synopses, summaries, further reading | ~45 | |
| E12 App A data tables, App D data sources | ~50 | **A.W "Ways of checking and estimating data" kept** |
| E12 ch. 16 industrial design + most of ch. 17 | ~19 | |
| E14 chapter notes | 64 | a source pool for checking MacKay's numbers |
| E14 policy chapters 27, 29, 30, 32 | 29 | |
| E15 HVAC (14-4..14-7), "Topics of special interest" (bio, fridges, compressed air, driving), second-law of reacting systems, real-gas relations | ~66 | |
| E13 code column-design formulas 11.9, units appendix, shape tables | ~56 | |
| E26 glossary, acronyms, template outlines (SEMP, CM, SOW, HSI, interface), Phase E | ~57 | **App C, D, E, F, G, H, I, N, S kept** |

## Surprises

1. **MacKay chapters were nearly dropped.** Each E14 chapter's whole body sits in a unit titled "(opener)", and the classifier typed those units as history. That put about 223 pp of the best order-of-magnitude material in the book into "non-teaching". All of it is KEEP.
2. **The merge undercounted the books' coverage.** About 90% of the pages in unmatched teaching sections are core content: Gere ch. 5 bending stresses, Anderson 6.5–6.11 performance, Feynman thermo ch. 44–46. The merge left them unmatched because of weak scoring, not because the content is absent. The books cover more than MG reported; the gaps above are the genuine ones.
3. **Three appendices the merge discarded are among the most judgment-relevant pages in the part:**
   - Ashby 7.6 (weighting pitfalls);
   - Ashby A.W (checking data);
   - E26 App C (requirement checklist).
4. **SMAD is image-only, which is risky for an unverified cluster.** Several ENG gaps are "covered" only by SMAD chapters in Lanchester: Delta-V, cost and learning curves, mass margins, random vibration, thermal margins. The tutor must read page images, or the content must be written in.
5. **Missing source pages.** Feynman II ch. 40 (Flow of Dry Water) is missing from the PDF, so potential flow, vorticity and Euler's equation rely on Anderson and Kolmogorov.

## Rough items

- Page numbers marked "~" are estimated from the TOC.
- C/N subtopics were not re-verified, except additive manufacturing.
- Section decisions for E14 notes and E16 problems are "not lesson text", not deletion.
