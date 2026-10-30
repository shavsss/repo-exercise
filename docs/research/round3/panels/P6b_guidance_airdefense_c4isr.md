# P6b: missiles, air and missile defense, C4ISR (expert panel report)

Domains covered: "MIL · Missiles: propulsion, guidance, control and design", "MIL · Air and missile defense" and "MIL · C4ISR, kill chains and targeting". The weapons-effects domain is out of scope for this panel. Data: `P6b_guidance_airdefense_c4isr.json`.

**How the check was done.** I extracted per-page text with `pdftotext` for B01–B16, the articles and the doctrine PDFs. Every page was mapped to its syllabus module and role (★/◇/⚙/📄, tier). I then ran keyword searches for each of the 106 subtopics and read the key pages. B13 (Fleeman) is an image-only scan, so I rendered its table of contents and read it as an image. On B13, PDF page = book page + 18.

## Counts

| | full | partial | missing | K/S total |
|---|---|---|---|---|
| Missiles | 26 | 13 | 6 | 45 |
| Air and missile defense | 12 | 13 | 5 | 30 |
| C4ISR | 3 | 11 | 11 | 25 |
| **Total** | **41** | **37** | **22** | **100** (plus 6 C/N) |

- **The status changed versus MG for 55 of the 106 subtopics.** Most of these were MG "missing" labels on content that is really in the books.
- MG missed real coverage in three places:
  - **Boord-Hoffman, B07:** keep-out volume; the 3:1 maneuver rule (p.145); shoot-look-shoot and salvo doctrine (p.60); depth-of-fire charts (ch.7); fly-out.
  - **Siouris, B06:** radome (pp.119–128 and 157); launch envelope (pp.368–374); end game and fuzing (pp.271–280); minimum-energy trajectories (pp.381–432).
  - **⚙ reference books and articles:** these are outside the registry.
- MG also made false "full" calls:
  - MSL.9.5 (quasi-ballistic missiles) is really missing.
  - MSL.8.4 was matched to the wrong source (EW emitter location). The real source is B06 6.4.3.
- **Importance changed for 9 subtopics, all raised:**
  - Missiles: aerothermal heating, quasi-ballistic missiles and launch envelopes, S→K; actuator limits, N→C.
  - Air and missile defense: exo/endo interceptors and SHORAD/MANPADS, S→K.
  - C4ISR: dynamic targeting, C2 philosophy and AEW&C vs space, S→K.
- **Added: 11 subtopics.**
- **Not needed: about 55 pages.** These are bibliographies, glossaries and constant tables, plus 2 pages on flapping wings.
- **Kept, although MG left them unmatched or typed them as non-teaching: 22 blocks.**

## Most important findings

1. **Fleeman's *Tactical Missile Design* (B13) is in the library but appears in no module.** It is the only source the library holds for:
   - design drivers and measures of merit;
   - sizing rules of thumb;
   - propulsion trades (solid motors, boost-sustain, ramjets, inlets);
   - aerodynamic heating and seeker domes;
   - cost and learning curves;
   - miss/weight harmonization.

   **Proposal: a new core module, M6.12**, after OCR with `core/tools/extract/extract.py`. Neither tesseract nor rapidocr is installed in this container, so the OCR could not be run here. Scope: about 150 core pages (PDF 19–236), with ch.8–9 (PDF 237–262) as advanced. This one module closes MSL.1.2, 1.3, 1.4, 2.2, 2.3, 2.4 and 3.4.

   Note that the comment at `syllabus.py:614` says M13.12 uses Fleeman. That is stale: B13 is not even in `docs`.

2. **Several AMD results are taught only from ⚙ reference books.** The tutor treats these as aids, not as lesson material:
   - layered-defense Pk and optimal allocation of interceptors between layers (Przemieniecki 6.1–6.2, 7.1–7.3, PDF 164–185 and 206–219);
   - penetration and PRA (Przemieniecki ch.7, Washburn 4.2);
   - shoot-look-shoot (Washburn ch.3, PDF 53–70).

   **Proposal:** promote these sections to ◇ in M7.1 and M7.3.

3. **B07 ch.7 (PDF 192–219) is the quantitative core of the AMD material, but it sits in M7.4, an advanced-tier module.** It covers radar/missile balance by RCS, altitude and propagation factor, interceptor average speeds and depth of fire. MG typed it as "summary". **Proposal:** move it to core.

4. **K gaps with no source anywhere in the library.** Each needs a section written by the tutor, and most suit a small simulation project:
   - correlated failures in layered defense;
   - C-RAM and impact-point prediction (Iron Dome logic);
   - mixed raids;
   - formal cost-exchange ratios;
   - magazine depth and interceptor production vs consumption;
   - quasi-ballistic missiles;
   - adjoint miss-distance budgets (Zarchan content; no Zarchan book in the library);
   - engage-on-remote and CEC;
   - human-on-the-loop and automation bias;
   - the solid-rocket-motor industrial base.

5. **C4ISR is the weakest of the three domains: 11 of its 25 K/S subtopics are missing.**
   - Doctrine fragments are spread over D8 (TLE categories, D3A targeting) and D5/D6. D5 and D6 sit in advanced-tier modules (M12.2, M12.4) and cover reconnaissance-strike complexes and system destruction warfare.
   - There is no source on latency budgets, time-sensitive targeting, PED, BDA biases or C2 under denial.
   - **Proposal:** a modelling spine in M7.9, "kill chain as a series reliability and time race" (added item P6b:ADD.10).

## Biggest blocks judged not needed
- B06 bibliographies: 13 pp.
- B06 App. A–C and H–I (constants, glossary, acronyms, radar bands, conversion factors): 26 pp.
- B06 5.2 weapon-delivery definitions: 14 pp.
- B09 flapping wings: 2 pp.

## Test-out candidates (never removal)
- Subtopics:
  - MSL.1.1 (missile classes);
  - MSL.10.1 (the bombing problem);
  - MSL.10.3 (PGM families);
  - C4.1.1 (F2T2EA);
  - C4.2.1 (collection disciplines);
  - C4.3.1 (joint targeting cycle);
  - C4.3.3 (CDE);
  - C4.5.2 (OODA).
- Sections:
  - B08 ch.9 descriptions of platform weapon systems (pp.357–387);
  - B07 ch.2 (systems engineering, which overlaps NASA SE in Gilua);
  - the B09 aerodynamics already taught from E11 in Gilua;
  - B07 9.1 (WGS-84 frames).
- I reversed MG's test-out flag on four subtopics, which are K for this goal: MSL.10.2, AMD.4.1, AMD.4.3 and C4.3.5.

## Surprises
- Siouris and Boord-Hoffman cover guidance and missile-defense physics far better than the automatic match suggested. Nearly all of the missile domain's "missing" items in guidance and the end game are in fact covered.
- The real holes are missile design economics (Fleeman), the operational-economic layer of AMD, and C4ISR.

Rough items: page ranges given for articles ("whole") were not checked page by page. Fleeman's content was judged from its table of contents only, because the text could not be OCR'd here.
