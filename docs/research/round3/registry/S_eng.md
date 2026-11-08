# S_eng. Gilua section-level registry: counting topics instead of pages

Scripts (run with `python3 -I`, in order): `S_eng_build.py` (TOC parse, module→section map, features, type classifier; 25 s) → `S_eng_sample.py` (stratified sample + reading digests in `digests/`) → `S_eng_counts.py` (hand counts) → `S_eng_model.py` (validation, model, CV, overlap, registry, totals → `S_eng_model.out`; 7 s) → `S_eng_boot.py` (bootstrap → `S_eng_boot.out`).
Outputs: `S_eng_registry.json` (4,492 sections), `S_eng_overlap_pairs.json` (top 3,000 scored pairs), `S_eng_sections.json`, `S_eng_map.json`.

## 1. Mapping (step 1)
- 34 TOCs parsed into 5,063 leaf sections. A chapter with pages before its first section gets an "opener" section, and a chapter with no S lines becomes one section. Section span = [start, next start); sections that share a page get 0.3 pp.
- Every main and supp source of the 316 modules is intersected with the spans. Each row is (module, tier, role, doc, section, title, pages, frac covered), so partial sections carry `frac`.
- **Coverage is exact:** 16,367 main + 1,499 supp pages mapped. That is every page, and **4,492 sections are used**. E13a (solutions manual) has no main/supp role.

## 2. Section types (step 2)
The rule classifier uses title regexes plus text features: equation-like lines per page, theorem/definition and example markers, and year/history markers.

**Hand check:** the true type was labelled for all 125 random sampled sections (`S_eng_model.out` §2).

| | accuracy |
|---|---|
| exact, 9 types | **0.71** |
| teaching vs non-teaching | **0.94** |

- summary, notes and appendix: precision 0.78–1.0.
- **examples: precision 0.27.** Titles do not mark them, and "war story" or "case study" sections go to history.
- problems: precision 0.33. Titles such as "The problems to be solved" are not problem sets.
- The type therefore enters the model only as a weak factor. Book class carries most of the signal.

**Used sections by type** (unique pages):

| type | sections | pages |
|---|---|---|
| theory | 2,255 | 9,720 |
| derivation | 672 | 2,737 |
| examples | 513 | 2,193 |
| history/narrative | 421 | 1,124 |
| appendix/reference | 256 | 1,226 |
| notes/bibliography | 137 | 375 |
| problems | 97 | 269 |
| summary | 141 | 221 |

About **2,090 pages (12%) inside module ranges are non-teaching sections.**

## 3. Counts and model (step 3)
**Sample:**
- 125 random sections: at least 3 from each of the 33 used books, at least 9 per auto-type, plus a random top-up;
- plus 24 sections that overlap the R8 calibration chapters.

**How they were counted:**
- Read through digests: the opening text plus every line with an equation, definition or theorem marker, capped at about 700 + 260 chars/page. Book knowledge was used where a digest was thin.
- Rubric: R8 strict CR and R10 K/S/C.
- E07's text layer is garbled, so E07 was counted from content knowledge.

**Calibration:**
- On the 7 Gilua R8 chapters the counts reproduce R8 strict exactly (3, 3, 1, 3, 2, 1, 0) and R10's K per chapter within ±1.
- This is **not blind**: the same session had read R8. A blind second rater is still needed.

**Measured on the random sample** (strict / K / S / C per page):

| | strict | K | S | C |
|---|---|---|---|---|
| all | **0.103** | 0.076 | 0.223 | 0.282 |
| theory | 0.151 | | | |
| derivation | 0.138 | | | |
| examples | 0.045 | | | |
| appendix | 0.031 | | | |
| history, summary, notes, problems | 0 | | | |

| class | strict / page |
|---|---|
| Feynman | 0.26 |
| theorem-dense (Wasserman, Boyd, MacKay, Trefethen, MCS, 6.011) | 0.15 |
| Kolmogorov | 0.14 (but K only 0.06) |
| engineering textbooks | 0.11 |
| descriptive/practice (AoE, Hughes, Ashby, MacKay-energy, Skiena, P&H, Weste, NASA) | 0.05 |

**Model:**
- A Poisson GLM on type group, book class, log pages, equation lines/page, theorem+definition/page and examples/page.
- It is compared with class-rate × pages. The target used for each count is the lower held-out error:
  - strict = mean of the two;
  - K = class rate;
  - S and C = GLM.

**Held-out error** (5-fold × 40 repeats, folds of 25 sections):

| target | MAE/section | fold-total bias | median |fold-total error| |
|---|---|---|---|
| strict | 0.30 | −1% | 13% |
| K (class rate) | 0.30 | +5% | 17% |
| S | 0.49 | +2% | 8% |
| C | 0.57 | +3% | 7% |
| R8's flat 0.124 × pages, same folds | 0.38 | **+24%** | 22% |

Sampled sections keep their hand counts. Every other section takes the model estimate.

## 4. Overlap (step 4)
**Scoring:**
- Score = 0.7 × TF-IDF cosine of section text (title tokens ×6) + 0.3 × title Jaccard.
- Pairs inside one chapter are excluded.
- Garbled E07 is excluded.
- Two generic titles are excluded (introduction, pitfalls, software, implementation, solutions…).
- The later module in syllabus order is the delta.

**Precision, read on 15 random pairs per bin [M, judged]:**

| score bin | precision | delta keeps |
|---|---|---|
| ≥ 0.45 | ≈ 0.85 after the generic filter | 50% of its counts |
| 0.38–0.45 | ≈ 0.8 | 75% |
| 0.33–0.38 | ≈ 0.55 | 90% |

The keep fractions are [J].

**Result:**
- 57 strong, 65 moderate and 110 weak deltas, of which 40 are cross-book.
- Examples of cross-book deltas: PAM (E01→E02), counters (E09→E25), entropy (F1→E15), DT processing of CT signals, D&C recurrences (E20→E21), FM (E09→E01), thermionic emission (F1→E24), boundary layers (E16→E11), graph colouring (E20→E21).
- Most deltas are within a book: CT→DT parallels in Oppenheim, gas→vapour→refrigeration second-law analyses, beam/torsion analogues.
- Exact reuse (the same section in two modules) is negligible.
- **Within-Gilua dedup is only −1.7%** (strict 1,860 → 1,828). R8's 6–20% dedup belongs to cross-app and test-out, not to sections inside Gilua.

## 5. Totals (main sources; supp separately)

| scope | pages | strict CR | → dedup | K | S | C | R8 0.124 × pages |
|---|---|---|---|---|---|---|---|
| core | 11,743 | 1,358 | **1,336** | 1,200 | 3,114 | 4,060 | 1,456 |
| adv | 3,891 | 462 | 453 | 407 | 992 | 1,294 | 482 |
| ref | 733 | 40 | 39 | 34 | 117 | 183 | 91 |
| **all** | 16,367 | 1,860 | **1,828** | **1,640** | **4,223** | **5,538** | **2,030** |
| supp (all tiers) | 1,499 | 127 | 127 | 117 | 317 | 432 | 186 |

- K, S and C are dedup-adjusted.
- **Bootstrap within class** (`S_eng_boot.out`), main, all tiers: strict P10–P90 is 1,770–2,170, and K is 1,270–1,720.
- **Single-rater uncertainty is not included.** R10's κ = 0.65 on K/S suggests about ±15% more on K.

## 6. Against R8's 0.124 CR/page
**In aggregate:**
- The registry is **8–10% lower** (1,828 vs 2,030 all tiers; core 1,336 vs 1,456).
- R8's net figure was right to within its own uncertainty.
- Its pre-correction Gilua-core density (0.148) was **about 30% too high**. R8's ×0.87 selection-bias correction roughly undid that, but by luck of aggregation.

**Per book, the flat rate is badly wrong in both directions:**

| | books | registry / R8 |
|---|---|---|
| **Too high** | P&H 0.40, NASA SE 0.36, MacKay-energy 0.44, Hughes motors 0.48, Ashby 0.50, AoE 0.50–0.53, Skiena 0.58, Weste 0.64 | 0.36–0.64× |
| **Too low** | Feynman I–III, Wasserman | 1.5–1.7× |
| | Boyd, MacKay ITILA, 6.011, MCS | 1.2–1.3× |
| About right | Kolmogorov, Cengel, Åström | 1.0–1.1× |

Why the descriptive books are over-estimated:
- they spend pages on catalogues, data sheets, war stories, "real stuff", process descriptions and labs;
- 12% of all module pages are summaries, notes, appendices or problems with ~0 CRs.

**Implications:**
- **Pacing should follow the registry, not pages.** A 40-page P&H module has about 2 CRs, while a 15-page Feynman module has about 3.
- **K is where the page model misleads most.** On random sections K/strict is 0.9 and K is 0.076/page. R10's 0.24/page Gilua-core K came from chapters picked for named results. Random sections hold more S and C (S+C 0.50/page) and fewer keystones. The total item count is close to R10 (about 11,400 vs about 10,700 from R10's Gilua per-page rates × 16,367 pages × 0.87), but **the K share is roughly 15%, not 31%.** That cuts the costly 7-facet work and moves the effort to S/C items.

## Limitations
- One rater, not blind, working from digests rather than full text. E07 and some scanned pages (F1, K) have noisy text.
- Only 3 problem-set sections were sampled, because module ranges mostly exclude them.
- The overlap keep factors are judgement calls, and its precision is measured on 45 pairs.
- K is rated by judged fan-out. R10's F1 regex count was not run.
