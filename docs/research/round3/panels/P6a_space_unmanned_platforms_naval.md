# Panel P6a: space, unmanned systems and counter-UAS, platforms and survivability, naval and undersea warfare

Data file: `panels/P6a_space_unmanned_platforms_naval.json`. Scope: four MIL domains, with 103 subtopics in the merge map (83 of them K/S). Parts P8, P9, P10 and P13 of Lanchester, plus the ref books B14 and B16 where they serve these domains.

## Method and caveats
- **SMAD (B12) is an image-only scan with no text layer.** I verified it by viewing the table of contents (PDF 6–9) and spot pages: 156–157 (debris), 189 (Earth-central angle) and 525 (SAR and observation-payload sizing).
  - The book-to-PDF offset is **+17** through ch. 17 and **+13** from ch. 19 onward.
  - **SMAD ch. 18 (Propulsion, book pp. 527–564) is missing from the scan.** PDF 544–577 duplicates ch. 17.
- Text search covered B08, B09, B10, B11, D5, D6, D9, B02b, B04, the articles, and the B14/B15/B16 JSON text.
- **Two structural reasons for false "missing" labels in the merge.** First, SMAD units have no text, so they were matched by title only. Second, the ref books B14–B17 and all articles were outside the registry. In total, 16 subtopics flip from missing to full.
- The merge also made false positive matches, for example:
  - SP.1.5 → radar tracking (M2.15);
  - SP.5.1 → UAV launch pages;
  - NAV.5.2 → optical ray tracing;
  - NAV.1.3 → electronics noise (E09);
  - NAV.4.4 → the M6.8 intro page.

## Counts (after verification)
| | full | partial | missing |
|---|---|---|---|
| Space (37) | 27 | 10 | 0 |
| UAS / C-UAS (21) | 7 | 8 | 6 |
| Platforms / survivability (28) | 13 | 10 | 5 |
| Naval / undersea (17) | 8 | 4 | 5 |
| **K/S only (83)** | **37** | **30** | **16 (11 of them K)** |

- Importance changes (rounded up):
  - SP.3.3 space SIGINT/geolocation: S→K.
  - SP.4.2 ADCS: C→S.
  - SUR.3.1 FMECA, kill trees, P(k/h): S→K.
  - NAV.6.2 undersea balance: S→K.
- There are 10 added subtopics, and 9 subtopics are flagged as test-out candidates.

## Most important findings
1. **The core of Ball (B16) is not in the syllabus at all.** Ch. 1.1 (pp. 25–105) is unlinked. It contains:
   - P_S = 1 − P_H·P_K|H;
   - the threat chain P_A·P_D|A·P_L|D·P_I|L·P_H|I;
   - mission loss rate and campaign survivability (1 − LR)^N;
   - sortie generation;
   - managed attrition;
   - the eight system-survivability strategies.
   
   Also unlinked: 5.1–5.2 (critical components, FMECA, kill trees, pp. 627–678) and 6.1–6.2 (survivability measures, pp. 763–788). B16 enters only as scattered refs, and 5.4 (vulnerability reduction) sits in M8.7, a ref-tier module on utility systems.
   
   → **Proposed: a new core module M8.8, "Combat survivability (Ball)".** It would close SUR.1.1–1.3 and SUR.3.1–3.2, and give a cross-domain frame that applies to ships, bases and satellites. Ball's problem 1.1.74 is literally a satellite constellation.
2. **Space is much better covered than the merge said.** SMAD ch. 8–10 and ch. 17 cover:
   - Earth-central angle and footprint;
   - orbit types;
   - access and revisit;
   - delta-v;
   - GSD and aperture;
   - SAR from space.
   
   M13.5 and M13.11 must be treated as K, not C or unmapped.

   **The real gap is space control.** The counterspace taxonomy (SP.7.1), SDA (SP.7.2), resilience and proliferation (SP.7.3) and commercial–military dependence (SP.8.2) are only fragments in the books:
   - SMAD 2.1.3 (one paragraph);
   - B02b 7.1 (SSA radars);
   - the Space Fence;
   - B04 7.8 (SATCOM jamming);
   - B16's eight strategies.
   
   → **Proposed: a new core module M13.23, "Space control: counterspace, SDA, resilience".** Its physics base is already in the books (SMAD 8.5 relative motion for RPO; BMD interceptors for DA-ASAT).
3. **The current drone war is absent.** Shahed-class drones (UAS.3.2), FPV (UAS.3.3), drone mass production (UAS.3.4) and attack USVs (UAS.5.1) are all K and missing. Loitering munitions, terminal autonomy under EW, and C-UAS defeat physics and cost-exchange are only partial. The books give definitions and doctrine lists (Fahlstrom 2022, ATP 3-01.81), not numbers.
   - The analytic pieces do exist: the B14 ch. 4 target-defense math, B15 7.2 penetration probability, the B09 ch. 13–16 datalink anti-jam margin, and Ball's managed attrition.
   
   → **Proposed: a new core module M9.9, "One-way attack drones, FPV and drone-war economics".** The USV defense side should be hosted in M10.5.
4. **Naval salvo warfare is missing.** The Hughes salvo model (NAV.4.2), ship staying power (SUR.8.1) and VLS magazine depth (NAV.4.3) appear in no library book. Ship self-defense (NAV.4.1) is partial: Kumar 1990, Reed and the B15 penetration math are there, but there are no modern layer numbers or Red Sea data. The ASBM and over-the-horizon targeting chain (NAV.4.4) is partial; the merge's "full" was a false match.
5. **Air campaign capacity is missing.** This covers sortie generation drivers (SUR.5.1, which is partial via Ball 1.1.10 and B15 ch. 12), air base attack and resilience (SUR.5.2) and tankers (SUR.5.3).
   
   → **Proposed: a new core module M8.9, "Air campaign capacity: sortie generation, basing, tankers".** Prerequisites are Breguet (M9.2/Gilua) and Ball.
6. **Undersea acoustics are sound at intro level.** Hall ch. 15–17 covers the sonar equation, SVP, convergence zones and noise. ASW search and barrier models (NAV.2.3) exist in B14 ch. 7 but are linked only to radar/EO modules. Link B14 7.4 and 7.6 (PDF 146–161) to M10.3.

## Biggest blocks marked not needed (629 pages: 424 in the syllabus, 205 in unlinked B16)
These decisions are conservative, and each block is a test-out candidate, not a removal.

| Block | Pages | Reason |
|---|---|---|
| SMAD ch. 29 mission operations | 34 | — |
| SMAD 23.3–23.7 manufacturing and I&T | 42 | — |
| SMAD process/requirements chapters | 33 | Duplicates Gilua NASA systems engineering |
| SMAD ch. 20 on-board processing | 26 | — |
| SMAD 22.1 structures | 22 | — |
| SMAD 27.x launch-site detail | 15 | — |
| SMAD interplanetary and lunar orbits | 15 | — |
| B08 utility systems (M8.7) | 32 | — |
| B08 display technology | 32 | — |
| B08 FMS/GATM | 19 | — |
| B09 structures | 24 | Duplicates Gilua |
| B09 conventional takeoff | 18 | Duplicates Gilua |
| B09 MPCS hardware and regulatory detail | 18 | — |
| B16 radar/IR primer | 39 | — |
| B16 WWII appendix, probability primer and index | 128 | — |

## Kept although the merge left them unmatched (about 800 pages)
- **The B16 unlinked core:** ch. 1.1, ch. 2, 3.3–3.4, 4.1, 4.4.6–4.4.7, 5.1–5.2 and 6.1–6.2.
- **SMAD:** ch. 8 and ch. 17 (reclassify as K), and appendices A, C, D and I as lookup tables.
- **B09:** the full datalink chapters (K), quadcopters (K for the FPV era), electric energy sources, and navigation and target location.
- **D9:** the threat and defense chapters.

## Surprising
- **SMAD's propulsion chapter is physically missing from the scan.** The rocket equation is covered by Gilua M15.16. In-space and electric propulsion is covered nowhere (added as ADD:SP.3).
- **SMAD is from 2011.** Every "full" space item needs a post-2011 update: launch cost per kg, mega-constellations, commercial SAR/EO, and proliferated LEO architectures.
- **M9.1, which hosts the W&K UAV chapter, is adv tier.** M13.5 (mission geometry) was labeled C_only by the merge, although it is the most-used K content of the space part.
