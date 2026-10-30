# A1. Curriculum analytics and schedule simulation (Gilua + Lanchester)

Round 2, track A1. Everything below was computed from the repo (read-only) with the scripts in this folder:

| Script | What it does | Output |
|---|---|---|
| `A1_extract_mil.py` | `pdftotext` of every Lanchester source (53 docs, 12,700 PDF pages) | `cache/mil_text.json` |
| `A1_stats.py` | Exact inventory, page roles, prerequisite graph, words per page, page types | `cache/A1_stats.json`, `cache/A1_pages_*.json` |
| `A1_concepts.py` | Concept units (TOC sections in taught ranges), title deduplication | `cache/A1_units.json` |
| `A1_overlap.py` | Assigns each section to one of 48 central results by phrase density | `cache/A1_results.json`, `cache/A1_assign.json` |
| `A1_redundancy.py` | Three estimates (LOW/MID/HIGH) of re-taught material, cross-app map | `cache/A1_redundancy.json` |
| `A1_sim.py` | Monte Carlo schedule model, policy ladder, levers, frontier | `cache/A1_sim.json`, `cache/A1_sim.out` |
| `A1_sens.py` | Tornado sensitivity, hour breakdown, hours/day needed per deadline | `cache/A1_need.json`, `cache/A1_sens.out` |

Run order: `A1_extract_mil.py` → `A1_stats.py` → `A1_concepts.py` → `A1_overlap.py` → `A1_redundancy.py` → `A1_sim.py` → `A1_sens.py` (total about 6 minutes).

---

## 0. Bottom line

1. **The real size of the job is about 4,900 concept units (numbered sections), and roughly 1,500 to 2,500 of them are central results.** In pages (core + adv) it is 24,519 main+supp pages plus 2,542 article pages, or 25,150 when articles count at 25%. The depth requirement attaches to the central results, not to the pages. At the midpoint assumptions, giving every central result the full level-2.5 treatment with active work and spaced review takes **about 1,330 learner-hours for both curricula (core + adv)**, or 1,570 with projects. The status quo takes **about 2,730 hours** and keeps only about 20% of what it teaches by the end (§4).
2. **Finishing both in 4 months without losing depth is impossible at a sustainable daily load.** It needs 13.7 h/day at the midpoint, and 6.9 h/day even when every parameter is at its optimistic end. **Six months needs 9.5 h/day** (P50; 10.5 at P80; 11 with projects). **Eight months needs 7.0 h/day** (8.5 with projects). **Twelve months needs 5.0 h/day** (5.5–6.0 with projects). "A few months" at 6–7 h/day is achievable for the **core of both apps at full depth: 7.4 months at 6 h/day, 6.3 months at 7 h/day**, with the adv tier as a second phase.
3. **The three biggest levers (learner-hours, both curricula):**
   - **Lesson length set by the concept budget instead of a word floor: −1,015 h (−37%)**, or −1,114 h on top of the other fixes. This is the "long for nothing" complaint in numbers. A status-quo Gilua lesson spends about 4,300 words per section and about 10,700 per central result. The lean budget is 1,300–2,200 words per central result (all seven 2.5 facets plus an example) and 300–550 per supporting section, which gives about 3,300–3,600 words per 15-page lesson. That is close to the "4–5k core" figure, and every central result keeps every facet.
   - **Removing the generation wait** (pre-generated offline, or at least pipelined in the page): **−490 h (−18%)**, about 3 months at 6 h/day. With lean lessons, sequential in-page waiting costs +546 h (+41%), and pipelining still leaves +92 h, because a 20-minute lean lesson no longer hides a 10–25-minute generation.
   - **Daily hours and days per week.** Going from 4 to 7 h/day is a 1.75× calendar factor; 5→6→7 days/week moves S6 from 15.5 to 12.9 to 11.0 months (at 5 h/day). This lever is the learner's, not the app's.

   The next levers, both depth-neutral, are **teach-once deduplication** (−150 to −270 h, −10%; it matters most in Lanchester core, where 22% of content pages re-teach results already taught elsewhere) and **test-out of known material** (−100 to −195 h). **Spaced review costs +543 h (+20%) but lifts retained depth from about 0.25 to about 0.85.** No design without it keeps depth in any real sense.
4. **The biggest unknown is not reading speed but two numbers no one has measured:** what share of sections are central results (f_central), and how many minutes of active work one central result needs. Each swings the finish date by about ±1.7 months at 5 h/day (tornado, §5.5). Measuring both on 50 sections is the most valuable next experiment.

---

## 1. Exact inventory

### 1.1 Modules, tiers and pages by source role

Pages are summed over source ranges ("distinct" removes pages listed twice within a tier). Lanchester articles with `pages: null` are counted as the whole document.

| | Gilua core | Gilua adv | Gilua ref | Lanchester core | Lanchester adv | Lanchester ref |
|---|---|---|---|---|---|---|
| Modules | 234 | 66 | 16 | 119 | 35 | 15 |
| main | 11,743 | 3,891 | 733 | 4,668 (4,665 distinct) | 2,125 | 882 |
| supp | 1,275 | 174 | 50 | 607 (599) | 36 | 32 |
| ex (exercises, Gilua only) | 2,899 | 342 | 153 | – | – | – |
| article | – | – | – | 2,504 (2,432) | 38 | – |
| ref (analysis aids B14–B17, Lanchester only) | – | – | – | 1,117 (748) | 320 (308) | 263 (219) |
| **Teaching pages (main + supp)** | **13,018** | **4,065** | 783 | **5,275 + 2,504 art.** | **2,161 + 38 art.** | 914 |

- **Both apps, core + adv:** 454 modules taught as lessons (300 Gilua + 154 Lanchester; the other 31 of the 485 are ref, not taught), and **24,519 main+supp pages plus 2,542 article pages.**
- Distinct teaching pages (main + supp + article, all tiers): Gilua 17,866; Lanchester 10,773.
- **Lesson estimate used by both syllabi (one lesson per ~15 pages):** Gilua 874 core + 271 adv, Lanchester 380 core + 144 adv, so **about 1,670 lessons for core + adv** (the simulation counts Lanchester articles at 25%, which gives 1,677).

### 1.2 Main pages per module

| | n | min | p10 | p25 | median | mean | p75 | p90 | max |
|---|---|---|---|---|---|---|---|---|---|
| Gilua core | 234 | 7 | 19 | 30 | 42 | 50.2 | 62 | 84 | 262 |
| Gilua adv | 66 | 11 | 22 | 32 | 53.5 | 59.0 | 77 | 101 | 195 |
| Lanchester core (main + article) | 119 | 8 | 13 | 25 | 38 | 60.3 | 61 | 105 | 680 |
| Lanchester adv | 35 | 13 | 26 | 36 | 44 | 61.8 | 68 | 114 | 215 |

The Lanchester tail comes from whole-document articles: M7.6 includes the 463-page APS boost-phase study plus the 200-page UCS countermeasures report. These must be read selectively, never as page throughput.

### 1.3 Pages by part (core / adv / ref main pages)

Gilua: P22 computer systems 1,014 / 444, P16 structures 975 / 196, P13 thermo 816 / 183, P15 aero 738 / 82, P8 LA/optimization 718 / 249, P11 electronics 716 / 120. These six parts hold **42% of Gilua core pages.** The five "nodes" (P4–P10) hold 3,197 core pages.
Lanchester: P2 radar 1,659 / 841, P7 air & missile defense 1,276 (mostly articles), P4 EW 799, P6 missiles 628, P3 EO/IR 513, P10 naval 412 (mostly articles), P5 GNSS 409 / 270, P13 space 362 / 214. **P0 foundations is only 169 pages, and almost all of it re-teaches Gilua material** (§3).

### 1.4 Prerequisite graph

| | Gilua all | Gilua core | Lanchester all | Lanchester core |
|---|---|---|---|---|
| Modules / edges | 316 / 402 | 234 / 302 | 169 / 189 | 119 / 159 |
| Roots (no prereq) | 4 | 6 | 39 (no `prereq` field on 39) | 16 |
| **Depth (longest chain, modules)** | 23 | **23** | 8 | **8** |
| Width (largest level) | 28 | 20 | 39 | 23 |
| **Critical path, pages** | 1,432 | **1,353** | 924 | **924** |
| Total ÷ critical path (parallelism) | 11.4 | 8.7 | 11.1 | 7.8 |

- The Gilua core critical path is `M0.1 → M1.1 → M1.2 → M1.5 → M3.1 → M3.2 → M4.1 → M4.2 → M4.4 → M4.5 → M4.6 → M4.7 → M11.1 … M11.6 → M12.4 … M12.10`, 23 modules and 1,353 pages: math spine → ODEs → signals → electronics → motors. **It covers only 11.5% of core pages.** The curriculum is wide, not deep, so the order is almost free. Interleaving the two apps costs nothing structurally, and Lanchester modules can be placed right after their Gilua prerequisites.
- Lanchester core: depth 8, critical path 924 pages (`M0.6 → M6.1 → M6.8 → M7.6 → M7.7`, inflated by the articles in M7.6). The longest chain in modules is `M0.6 → M6.1 → M6.3 → M6.4 → M7.1 → M7.2 → M7.3 → M7.5`.
- Implication: **the schedule is throughput-bound, not dependency-bound.** Even an unlimited tutor cannot shorten it by reordering. Only less learner time per unit, or more units per hour, helps.

### 1.5 Words per page and page types (measured from text)

Gilua text comes from `eng/app/artifact/lib/text/*.json` (all 34 docs, 15,634 core+adv main pages). Lanchester text comes from `pdftotext` (9,260 core+adv main/article pages).

| | Gilua | Lanchester |
|---|---|---|
| Pages with ≥60 words | 15,023 of 15,634 | 7,787 of 9,260 (1,473 near-empty: **SMAD, 1,067 pp., is an image-only scan**, plus figure pages) |
| Words per page, median (mean) | **306** (323) | **320** (332) |
| Total words in core+adv main text | 4.87 M | 2.60 M (excluding SMAD) |
| Densest / sparsest books (median w/p) | Feynman I 668, II 516, Sutton-Barto 435, NASA SE 422 / Trefethen-Bau 143, Wasserman 169, Langtangen 203, Patterson-Hennessy 217 | Articles 500–900; Fahlstrom 450, doctrine 410–470 / Hall 198, EW102 225, Ufimtsev 142 |

Page types inside the taught (main) ranges. Gilua uses the TOC section titles. Lanchester uses text heuristics and is approximate.

| Page type | Gilua | Lanchester |
|---|---|---|
| Body (exposition) | 14,763 (94.4%) | 8,527 (92%) |
| Problem sets inside main ranges | 190 (1.2%); **the problems are mostly held separately as `ex` sources: 3,394 pages, 2,899 of them in core** | not separable (no problem sets in most of these books) |
| Summary / notes / references | 409 (2.6%) | 227 (2.5%) |
| Historical narrative (sections titled "Historical…", "A Historical Perspective", Anderson's "Historical Note") | 271 (1.7%) | ~506 (5.5%, heuristic: ≥4 years and no equations; Ogorkiewicz, van Creveld, doctrine) |
| Appendix | ≈0 (excluded by the syllabus) | ≈0 |
| Pages carrying a numbered worked example ("Example n.m") | 1,279 (8.2%; 1,501 examples) | 65 (0.7%, under-detected: radar and EW books use unnumbered examples) |

**Reading:** the curricula are already lean in what they assign. Less than 6% of assigned pages are narrative, summaries or problems, so there is no cheap 20% to cut from the source side. The excess is on the output side: the tutor expands each 15-page unit into 8–15k words, which is 1.7–3.2 Hebrew words per source word.

---

## 2. Concept units: the real unit of depth

### 2.1 Sections inside taught ranges

A concept unit is a level-2 numbered section (x.y, Kolmogorov §, Feynman n-m). For Gilua these come from `toc/*.md` (4,693 S-lines). For Lanchester, the books' contents pages were parsed from text with a fitted PDF offset per book (offsets 3–39 pages; 18 documents parsed). Books with no numbered contents (SMAD scan, Hall, Ogorkiewicz, doctrine, most articles) were imputed at the measured Lanchester rate of 0.193 sections per page. Administrative sections (Problems, Summary, References, Introduction, Further reading…) are excluded.

| | Content sections | Pages per section |
|---|---|---|
| Gilua core | **2,537** | 5.1 |
| Gilua adv | **808** | 5.0 |
| Gilua ref | 140 | – |
| Lanchester core | **1,253** (769 parsed + 484 imputed) | 4.7 |
| Lanchester adv | **307** (131 + 176) | 7.1 |
| Lanchester ref | 149 | – |
| **Core + adv, both apps** | **≈4,900** | |

### 2.2 Distinct concepts after deduplication by title

Sections from different books are merged when their title token sets have Jaccard similarity ≥ t:

| Threshold | Clusters of 4,429 parsed content sections | Reduction |
|---|---|---|
| 0.75 | 4,356 | 1.6% |
| 0.6 | 4,234 | 4.4% |
| 0.5 | 3,812 | 13.9% (many false merges: "Design Considerations", "Signal Models") |

Exact title duplicates across books are rare (109 clusters span more than one book; 18 span both apps). Books name the same result differently, so title matching underestimates overlap. The result-level analysis in §3 is the better estimate.

### 2.3 Central results

Not every section is a central result. Many are worked applications, special cases or extensions of a result introduced one section earlier. No measurement of this share exists. The model uses **f_central = 0.30–0.50**, which gives:

| | Central results (f = 0.3 / 0.4 / 0.5) |
|---|---|
| Gilua core | 761 / 1,015 / 1,269 |
| Gilua adv | 242 / 323 / 404 |
| Lanchester core | 376 / 501 / 627 |
| Lanchester adv | 92 / 123 / 154 |
| **Both apps, core + adv** | **1,470 / 1,960 / 2,450** |
| after MID dedup (§3) | ≈1,260 / 1,680 / 2,100 |

This range of **about 1,500–2,500 central results** is what "no loss of depth" must protect. It works out to about 1.2 central results per 15-page Gilua lesson and 1.3 per Lanchester lesson.

---

## 3. Overlap: the same result taught in several places

### 3.1 Method and three estimates

Each content section was assigned to at most one of 48 central results ("radar range equation", "Kalman filter", "Fourier transform"…), by phrase density in its text (≥4 hits and ≥2.5 per 1,000 words, or a title match). 56% of content pages (11,406 of 20,203) were dominated by one of the 48 results. Curriculum order is Gilua first, then Lanchester.

| Estimate | Definition | Re-taught pages | Share of content pages |
|---|---|---|---|
| **LOW** | near-duplicate titles in another book | 814 | 4.0% |
| **MID** (used in the simulation) | section whose *title* names a result that an earlier module already taught from a *different book* (≥3 pages) | **2,778** | **13.8%**: Gilua core 13%, adv 6%; **Lanchester core 22%**, adv 13% |
| HIGH (upper bound, not redundancy) | text dominated by a result family seen earlier in any module | 11,154 | 55.2% (includes legitimate progression, e.g. 39 structures modules) |

MID, largest re-taught results: stress/strain/beams (Gere vs Ashby vs Anderson, 355 pp.), **Doppler/MTI (216, all cross-app)**, systems engineering (NASA vs Boord-Hoffman vs Moir, 215), rocket/propulsion (159, mostly cross-app), heat transfer (Lienhard vs Çengel, 140), Laplace/z/transfer function (133), atmosphere/Mach (109), propagation (106, mostly cross-app), thermodynamics (105), Gaussian/random variables (99), modulation (99), optimization (87), jamming (76, EW101 vs EW102 vs radar books), PN guidance (73, mostly cross-app).

### 3.2 Cross-app map: concept → modules in each app

Module-level map from module titles (c = core, a = adv, r = ref) with main pages:

| Concept | Gilua | Lanchester | Teach once where |
|---|---|---|---|
| Fourier, convolution, sampling, spectra | 22 mods, 996 pp: M4.1–M4.8, M7.2, M7.4, M23.x … | 9 mods, 344 pp: **M0.3**, M0.4, M2.23, M2.29, M4.11, M5.3 … | Gilua P4; Lanchester M0.3 becomes a delta (radar/IR application) |
| Probability, noise, random signals | 11 mods, 453 pp: M6.1–M6.4, M7.1, M7.3, M11.7 … | 1 mod, 18 pp: **M0.4** | Gilua P6–P7 |
| Estimation, least squares, Kalman, tracking | 9 mods, 388 pp: M5.6, M7.3, M8.5, M8.13, M17.15 … | 5 mods, 198 pp: **M0.6**, M2.9, M2.15, M2.29, M5.4 | Gilua M5.6/M7.3/M8.5; Lanchester keeps tracking specifics (M2.15, M2.29 multi-target) |
| Detection, hypothesis tests, CFAR | 3 mods, 118 pp: M6.6, M7.4, M23.6 | 7 mods, 197 pp: M2.3, M2.10, M3.6, M9.7, M10.3 … | Gilua M6.6/M7.4 for the theory; Lanchester owns CFAR/Swerling |
| EM waves, antennas, arrays, propagation | 14 mods, 778 pp: M9.1–M9.16, M10.5, M24.x | 7 mods, 338 pp: **M0.2**, **M1.1–M1.3**, M2.23, M3.3 | Gilua P9 for Maxwell/radiation; Lanchester M1.x as engineering deltas |
| Link budget, modulation, comms, information | 13 mods, 727 pp: M7.5–M7.8, M23.1–M23.10 | 9 mods, 277 pp: **M0.1**, **M0.5**, M1.4, M4.11, M4.12, M7.9, M13.10 | Lanchester M0.1 dB/link first (shortest route); Gilua P23 as the theory delta |
| Control, feedback, guidance | 14 mods, 844 pp: M5.1–M5.10, M11.4, M19.8 … | 11 mods, 466 pp: **M0.7**, M6.2–M6.6, M9.3 … | Gilua P5 for feedback; Lanchester P6 guidance (PN) stays full; M0.7 is redundant |
| Optimization, linear algebra | 11 mods, 418 pp | 1 mod, 15 pp (M0.6) | Gilua P8 |
| ODEs, dynamics, oscillations | 20 mods, 913 pp | 4 mods, 242 pp: M6.1, M6.2, M13.4, M5.7 | Gilua P2–P3; Lanchester M6.1 (missile EOM) as a delta |
| Orbits, rockets, propulsion | 9 mods, 393 pp: M2.2, M15.15, M15.16 … | 16 mods, 640 pp: P13 (SMAD) | Lanchester P13 owns it; Gilua M15.15/M15.16 become a delta |
| Aero / flight | 10 mods, 440 pp (P15) | 4 mods, 132 pp | Gilua P15 |
| Thermal / IR radiometry | 6 mods, 348 pp | 2 mods, 84 pp (M3.4) | Gilua M14.10 for radiation physics; Lanchester M3.4 for IR systems |
| Systems engineering | 3 mods, 118 pp (P27) | 3 mods, 100 pp (M7.2, M7.4, M7.10) | Gilua P27, then Lanchester as the AMD case study |
| ML / classification | 8 mods, 265 pp (P17) | 0 modules (articles inside M4.3, M9.7) | Gilua P17 |

**Structural finding: Lanchester P0 (M0.1–M0.7, 169 core pages, ~16 lessons) is almost entirely a compressed re-teaching of Gilua's nodes P4–P8**, and M1.1–M1.3 overlaps Gilua P9. If the two apps share one concept ledger, these become 1–2-hour delta lessons after the matching Gilua module. That alone saves about 12–14 lessons and removes the risk of two inconsistent treatments of the same result.

### 3.3 Savings from teaching once

Model: the primary occurrence is taught in full, and each repeat becomes a delta lesson costing δ = 20–40% of a full one ("what is new here: notation, regime, numbers, operational meaning").

| Estimate | Pages saved, δ = 0.3 | S6 at 5 h/day, months |
|---|---|---|
| no dedup | 0 | 14.3 |
| LOW | 570 | 13.9 |
| **MID** | **1,945** | **12.9**: −270 h against the status quo, −152 h on top of S5 |
| HIGH (bound) | 7,808 | 8.6, not achievable: most of it is progression, not repetition |

---

## 4. Simulation model

**Time per unit.** Learner minutes = reading (words ÷ wpm) + active work + generation wait. This is multiplied by (1 + review share) when spaced retrieval is on, and divided by (1 − project share) when projects are on. Calendar time: 6 study days a week, minus 3–10% lost days.

**Lesson modes**
- *sq* (status quo): pages ÷ 15 lessons; Gilua 11–15k words and Lanchester 7.9–9.2k words per lesson (round-1 measurements, `C_lesson_critique.md`); 10–25 min of active work per lesson.
- *lean* (concept budget): 1,300–2,200 words per central result (all 7 facets of level 2.5 plus a worked example) + 300–550 per supporting section + 400–700 words of framing per lesson. Active work is 12–22 min per central result (attempt, estimate, derivation skeleton, own summary) and 2–5 min per supporting section. This gives about **3,300 words per Gilua 15-page lesson and 3,600 per Lanchester lesson**.
- *lean45*: a fixed 4–5k words per lesson plus the same active work.

**Other parameters.** Reading speed is 150–220 wpm. Study load is 4–7 h/day; the grid also goes up to 12. Dedup applies the MID share per app and tier. Test-out removes 15% of Lanchester core and 7.5% of Gilua core after a graded diagnostic.

**Generation wait.** In the page, sequential: 10–25 min per lesson. Pipelined (next lesson generated while reading): residual wait = max(0, gen − 0.8 × read time). Offline (nightly cloud session): 0.

**Depth metrics**
- **D_t** (treatment depth) = share of central results that get the full 2.5 budget. The status quo counts as 1.0, and adv surveyed as delta counts as 0.35.
- **R** (retention at the end) = power-law forgetting without review (0.85 just after the lesson, half-life 1–2 months, averaged over the course); 0.80–0.90 with expanding-interval retrieval.
- **D_r** = D_t × R.

Each cell is 2,000 Monte Carlo runs. Rows S0–S9 add one change each.

### 4.1 Policy ladder: months to finish BOTH curricula (P10 / P50 / P90)

| Policy | Learner-hours | Lessons | 5 h/day | 7 h/day | D_t | R | **D_r** |
|---|---|---|---|---|---|---|---|
| S0 status quo (core+adv, long lessons, wait in page) | 2,734 | 1,677 | 20.0 / **22.4** / 25.5 | 14.3 / **16.0** / 18.2 | 1.00 | 0.21 | **0.21** |
| S1 + pipelined in-page generation | 2,241 | 1,677 | 16.2 / 18.4 / 21.4 | 11.6 / 13.2 / 15.3 | 1.00 | 0.23 | 0.23 |
| S2 + offline pre-generation (with long lessons, same as S1) | 2,241 | 1,677 | 16.2 / 18.4 / 21.4 | 11.6 / 13.2 / 15.3 | 1.00 | 0.23 | 0.23 |
| S3 + lean concept-budget lessons | 1,227 | 1,677 | 8.8 / 10.1 / 11.7 | 6.3 / 7.2 / 8.3 | 1.00 | 0.32 | 0.32 |
| S3b (fixed 4–5k-word lessons instead) | 1,409 | 1,677 | 10.3 / 11.6 / 13.0 | 7.3 / 8.3 / 9.3 | 1.00 | 0.30 | 0.30 |
| S4 + teach-once dedup (MID) | 1,112 | 1,511 | 7.9 / 9.2 / 10.5 | 5.7 / 6.5 / 7.5 | 1.00 | 0.34 | 0.34 |
| **S5 + spaced retrieval** | **1,325** | 1,511 | 9.4 / **10.9** / 12.7 | 6.7 / **7.8** / 9.1 | 1.00 | 0.85 | **0.85** |
| S6 + projects (10–20% of time) | 1,556 | 1,512 | 11.0 / 12.8 / 15.0 | 7.8 / 9.1 / 10.7 | 1.00 | 0.85 | 0.85 |
| **S7 + test-out (Lanchester 15%, Gilua 7.5%)** | **1,440** | 1,403 | 10.1 / **11.9** / 13.9 | 7.2 / **8.5** / 9.9 | 1.00 | 0.85 | **0.85** |
| S8 = S7, adv tier as delta/survey | 1,246 | 1,187 | 8.7 / 10.3 / 12.0 | 6.2 / 7.3 / 8.6 | 0.85 | 0.85 | 0.72 |
| **S9 = S7, adv deferred (core only now)** | **1,075** | 1,012 | 7.5 / **8.8** / 10.4 | 5.4 / **6.3** / 7.4 | 0.77* | 0.85 | 0.66* |

\* For S9, D_t counts adv central results as not taught *yet*. On the core it teaches, S9 has D_t = 1.0 and D_r = 0.85.

At 6 h/day (midpoint, deterministic): S0 18.7 months, S5 9.1, S6 10.7, S7 9.9, S9 7.4.

**The status quo is the worst on both axes:** it takes the longest, and because nothing is reviewed it ends with about 1 in 5 central results recallable. S5 takes half the time and retains 4× more.

### 4.2 Hour breakdown (midpoint)

| | S0 | S5 |
|---|---|---|
| Reading | ≈ 1,750 h (1,677 lessons at ~63 min) | ≈ 455 h |
| Active work | ≈ 490 h (status-quo think/exercises, as practised) | ≈ 655 h (attempt-first work on every central result) |
| Generation wait | **489 h** | 0 |
| Review | 0 | ≈ 220 h |
| **Total** | **2,727 h** | **1,332 h** |

S5 spends **more** time on active work than S0 and still finishes about 1,400 hours earlier. **The time goes from passive reading to retrieval and production, which is the direction the round-1 learning science asks for.**

---

## 5. Levers, frontier and sensitivity

### 5.1 One lever at a time against the status quo (learner-hours, both curricula)

| Lever | Δ hours | Δ % | Depth effect |
|---|---|---|---|
| **Lean, concept-budget lessons** | **−1,015** | **−37%** | none on D_t (same central results, same 7 facets); removes padding, adds scheduled active work |
| **Offline / pipelined generation** | **−492** | **−18%** | none |
| Adv tier deferred | −680 | −25% | D_t 0.77 now (adv later) |
| Adv tier as delta/survey | −366 | −13% | D_t 0.85 |
| **Teach-once dedup (MID)** | **−270** | **−10%** | none; also removes inconsistent double treatments |
| Test-out (Lanchester 15%, Gilua 7.5%) | −195 | −7% | none if the test is real (retrieval + estimate, graded) |
| Spaced retrieval | +543 | +20% | **R 0.2 → 0.85**: the only lever that protects retained depth |
| Projects 10–20% | +486 | +18% | authority, transfer; partly double-counts as active work |

Marginal effects on top of S5 (1,325 h): going back to status-quo lesson length **+1,114 h**; waiting in the page sequentially **+546 h** (pipelined in the page +92 h, offline 0); no dedup +152 h; test-out −100 h; adv deferred −313 h.

### 5.2 Frontier: what finishes BOTH, by deadline, with depth kept

Minimum hours/day (6 days/week) at P50 / P80, in half-hour steps. Depth kept means D_t ≥ 0.95 and R ≥ 0.8. ">12" means no solution up to 12 h/day.

| Design | 4 mo | 6 mo | 8 mo | 12 mo |
|---|---|---|---|---|
| S5 full depth, no projects | >12 | 9.5 / 10.5 | **7.0 / 8.0** | **5.0 / 5.5** |
| S6 full depth + projects | >12 | 11.0 / 12.0 | 8.5 / 9.0 | **5.5 / 6.0** |
| S6' (fixed 4–5k-word lessons) | >12 | >12 | 9.5 / 10.5 | 6.5 / 7.0 |
| S7 full + projects + test-out | >12 | 10.0 / 11.5 | **7.5 / 8.5** | **5.0 / 6.0** |
| S8 adv as delta (D_t 0.85, fails the depth test) | >12 | 8.5 / 9.5 | 6.5 / 7.5 | 4.5 / 5.0 |
| S9 core only (adv afterwards) | 11.5 / >12 | **7.5 / 8.5** | **6.0 / 6.5** | 4.0 / 4.5 |

Required hours/day from the deterministic runs (`A1_sens.py`), optimistic / mid / pessimistic ends of every range:

| Design | Learner-hours | 4 mo | 6 mo | 8 mo | 12 mo |
|---|---|---|---|---|---|
| S5 full depth | 695 / 1,332 / 2,267 | 6.9 / 13.7 / 24 | 4.6 / 9.1 / 16 | 3.4 / 6.8 / 12 | 2.3 / 4.6 / 8.1 |
| S6 full depth + projects | 773 / 1,567 / 2,834 | 7.7 / 16.1 / 30 | 5.1 / 10.7 / 20 | 3.8 / 8.1 / 15 | 2.6 / 5.4 / 10 |
| S7 full + projects + test-out | 715 / 1,449 / 2,621 | 7.1 / 14.9 / 28 | 4.7 / 9.9 / 19 | 3.5 / 7.5 / 14 | 2.4 / 5.0 / 9.3 |
| S9 core only | 528 / 1,074 / 1,947 | 5.2 / 11.0 / 21 | 3.5 / 7.4 / 14 | 2.6 / 5.5 / 10 | 1.7 / 3.7 / 6.9 |
| S0 status quo | 2,029 / 2,727 / 3,554 | 20 / 28 / 38 | 13 / 19 / 25 | 10 / 14 / 19 | 6.7 / 9.3 / 13 |

**What this proves**
- **4 months, both curricula, full depth: infeasible.** Even at the optimistic floor (every parameter at its fastest end) it needs 6.9–7.7 h/day of dense study for 17 weeks without a break, and at the midpoint 13.7–16 h/day.
- **6 months, both, full depth: infeasible at the midpoint** (9.5–11 h/day). It becomes feasible only if the measured parameters turn out near the optimistic end (4.6–5.1 h/day). The measurement in §5.5 decides which case holds.
- **8 months, both, full depth: 7–8.5 h/day.** This is borderline: at the top of the sustainable range.
- **12 months, both, full depth, with projects: 5.0–6.0 h/day.** Comfortable. This is the realistic frontier for "everything, no depth lost, with projects".
- **Smallest unavoidable trade-off for "a few months":** do the **core of both** at full depth with review in **6–8 months at 6–7.5 h/day** (S9: 7.4 months at 6 h/day, 6.3 at 7). Then do the adv tier (about 450 of the ~2,000 central results, 6,200 pages) as a second phase of about 3 months, or as just-in-time deltas pulled by projects. This is a trade on *timing*, not on depth: no central result is taught shallower.
- **The status quo cannot finish both inside 12 months at any sustainable load** (9.3 h/day at the midpoint), and what it does finish is mostly forgotten.

### 5.3 Why lean lessons do not lose depth (quantified)

Status-quo Gilua lesson: 12.5k words for 2.9 sections, about **4,300 words per section** and about **10,700 per central result** (f = 0.4). Round-1 critique (`C_lesson_critique.md`) found 700–830 numbers per lesson, 200–330-word bookkeeping blocks, and "think" moments that are answered immediately. The lean budget of 1,300–2,200 words per central result covers the seven level-2.5 facets at about 150–300 words each, plus a worked example. The words removed are expansion around the facets, not the facets themselves. The simulation keeps D_t = 1.0 because every central result still receives every facet. What lean lessons add is time for active work (12–22 min per central result), which the status quo did not actually schedule.

The fixed "4–5k words per lesson" variant (S3b/S6') costs +180 h against the bottom-up concept budget. A budget per central result is better than any fixed lesson length, because the number of central results per 15 pages varies by about 3× between books.

### 5.4 Pages versus concepts as the throughput unit

Under the page model, time grows with pages: 1,677 lessons regardless of content. Under the concept model, time grows with central results, and the two diverge per book. Kolmogorov, Feynman and Trefethen-Bau pack more central results per page and should get *more* time per page. Fahlstrom, Hall, the doctrine, Ogorkiewicz and the long NPS theses pack fewer and should get *less*. Scheduling by pages gives every page the same time, so it overspends on narrative books and underspends on dense ones. This fits the learner's complaint that some lessons are "long for nothing" while depth is still demanded.

### 5.5 Sensitivity (tornado): S6 at 5 h/day, midpoint 12.9 months

| Parameter (range) | Months at low end | Months at high end | Swing |
|---|---|---|---|
| **f_central, share of sections that are central results (0.30–0.50)** | 11.1 | 14.7 | **3.5** |
| **active minutes per central result (12–22)** | 11.2 | 14.6 | **3.4** |
| reading speed (150–220 wpm) | 14.1 | 12.0 | 2.1 |
| words per central result (1,300–2,200) | 12.1 | 13.7 | 1.7 |
| active minutes per supporting section (2–5) | 12.1 | 13.7 | 1.5 |
| project share (10–20%) | 12.2 | 13.7 | 1.5 |
| review share (15–25%) | 12.4 | 13.4 | 1.1 |
| lost days (3–10%) | 12.4 | 13.4 | 1.0 |
| words per supporting section | 12.5 | 13.2 | 0.7 |
| framing words per lesson | 12.7 | 13.1 | 0.5 |
| delta-lesson cost (20–40%) | 12.7 | 13.1 | 0.4 |
| dedup estimate LOW / MID / HIGH | 13.9 / 12.9 / 8.6 | | |
| study days per week 5 / 6 / 7 | 15.5 / 12.9 / 11.0 | | |

The two largest uncertainties are about the *structure of the content* (how many central results there are) and the *learner's active time per result*. Neither has been measured. Both can be measured in a week: tag 50 random sections as central or supporting with Opus plus the learner's review, and time 20 central results end to end in the current app.

---

## 6. The three biggest levers on time to finish, ranked

| Rank | Lever | Size (both curricula) | Depth cost | Who controls it |
|---|---|---|---|---|
| **1** | **Concept-budgeted lessons** (words per central result, not a word floor) | **−1,015 to −1,114 h (−37% to −45%)**; about 7 months at 6 h/day | none, if each central result keeps its 7 facets and an attempt-first exercise | prompt rules (`depthBar`, the "≥4,200 words" rule) |
| **2** | **No generation wait** (offline nightly pre-generation; pipelining is second best) | **−490 to −546 h (−18% to −41%)**; about 3–3.5 months at 6 h/day | none | architecture (a cloud session writes lessons into the db) |
| **3** | **Study hours per day and days per week** | 4→7 h/day: ×1.75 on the calendar; 6→7 days: −15% | none up to the fatigue limit (not modelled; above ~7 h/day of dense first-time study, quality drops) | the learner |
| next | Teach-once dedup across books and apps (MID) | −150 to −270 h (−10%); Lanchester core −22% of content pages | none; improves consistency | shared concept ledger between the apps |
| next | Test-out of known material (Lanchester background) | −100 to −195 h | none if the test is real | diagnostic quizzes |
| scope | Adv tier timing (defer, or delta/survey) | −310 to −680 h | delays adv results, or drops them to 0.35 depth if surveyed | the learner's priorities |
| cost | Spaced retrieval | +543 h | **required**: without it R ≈ 0.2–0.35 | app (SRS on central results) |

## 7. Caveats and what would sharpen the numbers

- **f_central and active minutes per result are assumptions** (ranges shown). They dominate the uncertainty, and they are the first things to measure.
- **Lanchester sections are 39% imputed in core** (SMAD is image-only, and Hall, Ogorkiewicz and the doctrine have no numbered contents). The rate of 0.193 sections per page was measured on 18 parsed documents.
- **The overlap analysis is lexical.** Assignment uses 48 hand-written result patterns, so some false positives remain (e.g. a "Radar range equation" hit inside a transistor module). MID requires a title match plus an earlier module from another book, which keeps it conservative. LOW and HIGH bound it at 4% and 54%.
- **The retention model is generic** (power-law forgetting; SRS plateau 0.8–0.9), not measured on this learner. The ranking of S0 against S5 does not depend on its exact constants.
- **Fatigue is not modelled.** Hours above about 7 per day of dense first-time study are unlikely to keep the same per-hour yield, so the 8–12 h/day cells are not realistic plans.
- **Status-quo active time (10–25 min per lesson) is generous.** Round 1 found lessons mostly passive. If the true figure is lower, S0 is a little faster but its retention is worse.
- **Lanchester articles count at 25% of their pages**, following the syllabus rule that "an article does not add lessons of its own". Counting them in full would add about 125 lessons to S0.
