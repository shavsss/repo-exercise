# S_mil: a section-level registry for Lanchester (military-technical app)

Scope: all 169 modules, their **main + supp** sources (8,350 pages). Articles (role `article`, no page ranges) and the B14–B17 `ref` books are out of scope, as in R8. The registry is `S_mil_registry.json`: 1,548 units, each with module, tier, doc, pages, heading number and title, how the structure was found, type, CR/K/S/C (observed or predicted), engineering overlap, internal repeat share and a test-out flag. It also has per-module rollups, the CV results and the totals.

Pipeline (all `python3 -I`, read-only on the repo):
`S_mil_outline.py` (PDF bookmarks) → `S_mil_sections.py` (units) → `S_mil_classify.py` (features and type) → `S_mil_sample.py` (stratified sample and reading digests in `digests/batch0–6.txt`) → `S_mil_counts.py` (hand counts) → `S_mil_model.py` (fit, CV, bootstrap, registry; output in `S_mil_model.out`).

Note: the `digests/batch_0x.txt` files with an underscore were not written by this agent.

## 1. Structure: where the sections came from

| Method | Units | Docs | Note |
|---|---|---|---|
| PDF outline | 897 | B02, B02a, B03, B05, B06, B09, D8, D9 | numbered X.Y heads |
| Numbered heads detected in the text | 328 | B01, B04, B07, B08, B02b | TOC and skip pages excluded. Missing X.Y parents were rebuilt from X.Y.Z heads and running headers |
| Inferred ~6-page heading blocks | 203 | B10, B11, D5, D6 (+ split chapter-only spans) | **flagged** |
| SMAD, image-only | 120 | B12 (958 pp) | ~8-page blocks from the module notes and page counts. **Flagged**, estimated, not read |

- 1,144 units carry a real section number.
- 1,727 X.Y.Z subsections were counted inside them.
- A section of more than 22 pages is split at its X.Y.Z heads.
- Mean unit size: 5.4 pages.

## 2. Types (heuristic classifier: equation, example, year and doctrine-word densities plus the title)

| Type | Units | Pages |
|---|---|---|
| Theory / results | 465 | 3,279 (of which SMAD ~860) |
| Derivation | 63 | 414 |
| Worked examples | 93 | 362 |
| History / narrative | 104 | 542 |
| Doctrine / operational | 175 | 931 |
| Descriptive / systems (added type) | 449 | 2,157 |
| Summary | 28 | 70 |
| Problems | 52 | 153 |
| Appendix / reference | 119 | 442 |

- On the sample, the type was correct for 82% of units (17 of 96 hand re-typed).
- The errors are mostly between neighbouring types: theory vs derivation, history vs descriptive.

## 3. Sample, counts and the predictor

**Sample.**
- 96 units, 465 pages, 17 docs, every book group × type stratum. SMAD was excluded because it is image-only.
- One rater (this agent) used R8's strict CR rubric and R10's K/S/C rubric.
- The reading was done on structured digests: headings, numbered equations and definition/"law" sentences. These are not full text. **This is a limitation:** a full read would likely add some S and C items.

**Observed counts per page.**

| | CR | K | S | C |
|---|---|---|---|---|
| Per page | 0.069 | 0.069 | 0.226 | 0.49 |

- In this pass K = strict CR. R10 found K ≈ 1.54 × strict, because it splits out folded load-bearing items such as RCS, aperture and R⁻² spreading. Both bases are reported below.
- **The key finding is the density by section class:**
  - math-bearing sections (theory, derivation, examples; 3,365 pp): **0.124 CR/page**, the same as R8's 0.124;
  - narrative sections (history, doctrine, descriptive; 3,402 pp): **0.016**;
  - auxiliary sections: 0.032.
- So R8's chapter density is right *for the chapters it sampled*. But 41% of Lanchester's pages are narrative and almost free of CRs.

**Predictor.** A Poisson GLM on log(pages), the feature densities, nsub and a class.

Held-out error (5-fold CV × 20 repeats; a fold is ~19 units / ~93 pages):

| | MAE per unit, GLM | MAE per unit, type-rate | Fold-total RMS rel. error |
|---|---|---|---|
| CR | 0.27 | 0.25 | 41% |
| K | 0.26 | 0.25 | 57% |
| S | 0.54 | 0.76 | 18% |
| C | 0.81 | 1.00 | 12% |

- **CR and K are rare events.** The GLM does not beat plain type rates for them.
- For S and C, the GLM is clearly better than type rates.

Bootstrap of the corpus totals (300 refits), P10–P50–P90:

| | P10 | P50 | P90 |
|---|---|---|---|
| CR | 495 | 567 | 633 |
| S | 1,692 | 1,832 | 1,957 |
| C | 3,870 | 4,048 | 4,274 |

## 4. Totals (main + supp)

| Scope | Units | Pages | CR (= K strict) | S | C | K at R10 granularity |
|---|---|---|---|---|---|---|
| Core, raw | 1,068 | 5,275 | 423 | 1,325 | 2,513 | – |
| Adv, raw | 358 | 2,161 | 102 | 366 | 1,075 | – |
| Ref, raw | 122 | 914 | 26 | 131 | 469 | – |
| **All, raw** | 1,548 | 8,350 | **551** | 1,822 | 4,057 | K 849 / S 1,524 |
| **All, dedup** (internal repeats, Gilua duplicates → delta), supp × 0.5 | – | 7,982 eff. | **436** | 1,463 | 3,820 | K 672 / S 1,228 |
| Core, dedup, supp × 0.5 | – | 4,941 | 324 | 1,020 | 2,300 | ≈ K 500 |

**Engineering overlap.** Topic keywords were matched against the titles of 85 Gilua modules (unit titles + module title + note).
- **506 units (2,702 pp) are marked `delta`**:
  - EM/antennas/optics 171 units;
  - signals 139;
  - mechanics/flight 100;
  - control 86;
  - estimation 57;
  - probability 45;
  - optimisation 35.
- Measured on the sample: **32% of the K+S items in flagged units duplicate generic Gilua content**, against 5% in unflagged units. That is ≈ 390 of 2,370 K+S items.

**Test-out candidates (not removals).**
- **475 units, 2,278 pages: 27% of the pages but only ~28 CRs (5%).**
- They are mostly doctrine, operational, platform and history description (D5/D6/D8/D9, B08, B09, B11, B07 and the descriptive parts of B01/B04).
- About 1,730 C items sit there: what a learner with a strong operational background should be able to show he knows.

Internal repeats (the same pages in two Lanchester modules): only 47 pages.

## 5. Against R8's page-based estimate, same scope (main + 0.5 supp)

| Tier | Eff. pages | R8 CR (raw / ×0.87) | Registry CR | R10 K/S/C (×0.87) | Registry K(R10-equiv) / S / C |
|---|---|---|---|---|---|
| Core | 4,972 | 626 / 545 | **405** | 908 / 779 / 952 | ~620 / 1,040 / 2,325 |
| Adv | 2,143 | 240 / 209 | **101** | 392 / 336 / 410 | ~155 / 310 / 1,062 |
| Ref | 898 | 101 / 88 | **26** | 164 / 141 / 172 | ~40 / 115 / 459 |

**What the comparison shows:**
- Section-level counting gives **~0.65–0.75× R8's CRs** for Lanchester core, and ~0.45× for adv and ref, which are SMAD-, doctrine- and history-heavy.
- **Cause.** R8 put 58% of core in a radar/EW/missile class at 0.159/page and assumed articles at 0.08. In fact, even inside B01–B06 a large share of the sections are descriptive. Doctrine and history (≈ 1,500 pp) carry ≈ 0.
- **K at R10 granularity is ~0.7× R10's estimate.** C is ~2.4× R10's estimate, because this pass listed taxonomy and fact items in the descriptive sections more liberally.
- **For the time model:** Lanchester CR work should be costed on ~410–440 strict CRs (raw 551; P10–P90 495–633), not ~630.
  - About a quarter of the pages are test-out candidates.
  - About 16% of K+S are Gilua deltas.
  - The C load is large but cheap, since C items are reading only.

## 6. Limitations

- **One rater, digests rather than full text.** κ is unknown. A blind second rater on `digests/` + `S_mil_sample.json` is the next step.
- **SMAD (958 pp, 11%) is estimated, not read**, using rates borrowed from the B03/B05–B07/B09 sample: 0.085 CR/page for theory-type and 0 for descriptive. It needs OCR.
- **Inferred blocks** (B10, B11, D5, D6) are topic proxies, not true sections.
- **Engineering overlap is matched on titles and keywords.** The dup share is measured on 36 flagged sample units only.
- Articles were not included. R8 assumed they make up 15% of core pages at 0.08 CR/page. This registry does not count them.
