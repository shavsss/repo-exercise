# P7: OR and combat modeling, logistics, acquisition and T&E, adversary assessment, analysis craft

Panel members: an operations researcher (Lanchester, salvo and attrition models), a defense logistics and acquisition expert, and a senior defense analyst and writer. Data: `P7_or_logistics_acquisition_analysis.json`. All page numbers are PDF pages.

## Three findings that change the picture

1. **B14–B17 were left out of the MG corpus entirely.** It has no crosswalk units for them. That is why MG marks Lanchester, shoot-look-shoot, sweep width, Prim-Read, mine models and van Creveld's history as "missing". We read them against the text:
   - Washburn & Kress (B14) and Przemieniecki (B15) cover almost all of classic OR: 2.1–2.3, 3.x, 4.1–4.4, 5.x, 6.1, 8.1, 10.1, 10.3 and 13.3.
   - Van Creveld (B17) covers the four historical-logistics cases.
2. **Most MG hosts for these five domains are not meaningful modules.** Examples: Lanchester laws → M2.10 (threshold detection); supply tonnage → M13.13 (attitude control); MTCR → M2.10. We reassigned every host.
3. **Two rules hide the real state:**
   - **Rule 33 says the learner has already read B14 and B15.** So classic OR is known material, and **26 items are test-out candidates**: a diagnostic, never removal.
   - **Rule 37 makes all four books "ref, not lesson material, not coverage-checked".** So Ball (B16) and van Creveld (B17) are effectively *never taught*.
   - **Logistics, acquisition/cost/T&E, OSINT and claims craft, recent wars, and Iran have no host module anywhere** in the 169-module syllabus.

## Counts (126 subtopics, plus 11 added)

| | full | partial | missing |
|---|---|---|---|
| K (71) | 12 | 25 | 34 |
| S (50) | 18 | 14 | 18 |
| C/N (5) | 3 | 1 | 1 |

- **Status differs from MG on 64 of 126 items.** Some moved up, from missing to full (B14/B15/B17). Others moved down, from MG "full" to partial or missing, where the MG match was a false positive. Examples:
  - VV&A was matched to E08 finite-difference "verification".
  - DOE was matched to convex optimization.
  - Leakage was matched to semiconductors (E24).
  - Mirror-imaging was matched to Feynman.
- **Importance raised from S to K (3):**
  - OR.12.2: interceptor allocation across layers.
  - LOG.3.6: drone-war logistics.
  - ADV.3.3: Iran–Russia–DPRK technology transfer.
- **Not needed:** 17 blocks, about 364 pages. The biggest:
  - B15 App. E, BASIC software listings, 352–411.
  - B17 notes and bibliography, 334–421.
  - B16 3.6 radar and IR fundamentals, 359–397. This duplicates the radar and EO modules, so at most it needs a test-out check.
  - B16 index and acronyms, 802–811 and 896–928.
  - B15 probability tables, 330–337.
- **Kept but unmapped:** 23 blocks, about 600 pages, to be attached:
  - B16 ch. 1.1–1.2 (25–138): survivability fundamentals and **historical loss rates**.
  - B16 ch. 6.1–6.2 (763–788): mission survivability.
  - B16 5.1–5.2 (627–678): combat-data analysis and FMEA.
  - B14 ch. 10 (214–238): terror and insurgency.
  - B15 5.3–5.5 (142–163): stochastic attrition and SLS assignment.
  - B17 ch. 1, 2 and 4 (16–110, 158–204), including **Schlieffen**.

## Most important gaps (K, truly absent from every book)

- **AMD and strike economics:**
  - Queuing and saturation, with fire channels as servers and raid size (OR.12.1).
  - Cost-exchange done right (OR.12.3).
  - Munitions expenditure vs stockpile, and production as a war-duration stock-flow model (LOG.2.1, added P7+.5).
  - Surge capacity and long-lead items (ACQ.4.1).
- **Missile-age attrition:**
  - The Hughes salvo model and scouting/VoI (OR.4.5, OR.13.1). B14 gives it one paragraph, on p. 86.
  - The 3:1 force-ratio myth (OR.4.6).
  - Biddle's force-employment theory (OR.11.2).
  - Exchange-ratio practice (OR.4.7).
- **Evidence:**
  - Statistics from few shots, e.g. "9/10 intercepts" (OR.9.1, ACQ.3.3).
  - Survivorship and selection bias (OR.9.3).
  - Test realism (ACQ.3.2).
  - Intercept-claim denominators (CRAFT.2.2).
  - Wargames as evidence (OR.6.2–6.3). B14 6.3 is only 3 pages.
- **Cost:**
  - Unit-cost definitions (ACQ.2.2).
  - Budget books as data (ACQ.1.2).
  - Learning curves (ACQ.2.3). These exist only in SMAD ch. 11, an image-only scan in a ref-tier module.
- **Publication duties:** MTCR, censorship and prepublication review, and the mosaic effect (ACQ.5.2–5.4).
- **Craft:**
  - The whole OSINT set (CRAFT.1.x).
  - Article structure, interviewing and communicating uncertainty (CRAFT.3.x). The learner names these as goals.
- **Region:**
  - Iran and its proxies (ADV.3.x).
  - Israel 2023–25 and the Red Sea (CRAFT.4.2–4.3).
  - Net assessment, OOB estimation and analytic bias (ADV.4.x).

## Proposed hosts

There are 11 new modules (`new_hosts` in the JSON). Each is core, and each respects prerequisites: it comes after P0, M0.4 and P7.

| ID | Module |
|---|---|
| NEW-A1 | Raid, magazine and cost-exchange analysis (in P7, after M7.1) |
| NEW-A2 | Attrition, salvo and combat evidence |
| NEW-A3 | Models as evidence |
| NEW-L1 | Logistics and sustainment. Promote van Creveld ch. 4, 5, 7 and 8 from ref to main |
| NEW-Q1 | Acquisition, cost and industrial base |
| NEW-Q2 | T&E and claims |
| NEW-Q3 | Export control, arms control and publication law |
| NEW-C1 | OSINT |
| NEW-C2 | Writing and interviewing (capstone) |
| NEW-C3 | Recent wars |
| NEW-V1 | Iran and proxies, plus assessment methods |

**Re-hosting needed:**
- Lanchester (B14:84–114 and B15:92–133) now sits only in **M12.2, which is adv-tier Russian tactics**. A K result must sit in core.
- Van Creveld ch. 3 is attached to M12.4 (Chinese tactics), which does not fit.
- Two items are core-level doctrine held only in adv-tier modules:
  - PLA system warfare: D6:59–74, in M12.4.
  - Recon-strike complexes: D5:164–176, in M12.2.

## Surprising

- Ball (B16) ch. 1 is a compact, authority-level summary of survivability and historical loss rates, yet it is attached to nothing. Ball also holds the only LFT&E and DoD 5000 material in the library.
- There are no defense economics in the library outside space and NASA.

Rough items: ACQ.1.3, ACQ.2.1 and ACQ.2.3–2.4 rest on SMAD content we could not check, because the scan is image-only. The B16 page ranges near 188–212 are approximate (offset drift).
