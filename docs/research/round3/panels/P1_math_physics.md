# Panel P1: mathematics and physics (Gilua)

**Panel:** an applied mathematician and a physicist who train senior engineers.

**Domains:**
- ENG · Mathematics foundations: 138 subtopics.
- ENG · Physics: 65 subtopics.

**Scope:** 107 modules:
- P0–P3, P6, P8, P9, P10, P24 and P26;
- every module with a Kolmogorov (K1–K3) or Feynman (F1–F3) source: M4.3, M4.4, M4.11, M11.1, M12.1–2, M13.1–3, M15.1, M16.1, M20.5 and M22.1;
- M7.1 and M7.12.

**Method:**
- Every K/S subtopic was checked against the book text by regex search over `eng/app/artifact/lib/text/*.json`. Each hit was mapped to its module and its registry section.
- Key Kolmogorov pages were read: K1 II/8, II/12, II/13 and K2 VI/5, VI/6.
- The machine data is in `P1_math_physics.json`. The search tools are in the session scratchpad under `p1/tools/`.

## Counts

| | K | S | C | N | all |
|---|---|---|---|---|---|
| subtopics after review | 64 | 114 | 14 | 11 | 203 |

| K+S status | merge said | panel verdict |
|---|---|---|
| full | 100 | **139** |
| partial | 38 | **31** |
| missing | 39 | **8** |

- **The merge badly undercounted Kolmogorov and Feynman.** It moved 23 subtopics from missing to full and 29 from partial to full. The core sections of K1 II (derivative, differential, integral, several variables, series), K1 V, K2 VI and K3 XVI were left "unmatched". The BoK phrasing never hit their titles. Examples that were marked missing but are fully taught:
  - derivative as linear approximation (K1 II/5, II/8);
  - eigenvalues (K3 XVI/4);
  - inner products and projections (K3 XVI/2);
  - Laplace equation, separation of variables and Sturm–Liouville (K2 VI/3, VI/5);
  - first-order ODE and time constant (K1 V/1–2, F1 24);
  - forced response and resonance (F1 23);
  - root finding (K1 IV/5);
  - quadrature (K2 XII/3);
  - Lorentz force (F2 13, 29);
  - lumped vs distributed circuits (F2 23);
  - multiple comparisons (E05 10.7);
  - Neyman–Pearson (E02 13.2).
- **9 subtopics were downgraded from full to partial or missing.** The merge's matches were spurious:
  - design of experiments was matched to E06 7.5, which is *optimal* experiment design;
  - PDE classification was matched to E05 and E06 sections;
  - implicit function theorem was matched to E17 and E08;
  - Kramers–Kronig;
  - Little's law;
  - Hamiltonian mechanics was matched to F3 8, which is the quantum Hamiltonian;
  - rigid-body stability;
  - Fourier optics;
  - quantum sensing.
- **Importance changes (5):**
  - FEM S→K: you cannot judge structural, thermal or EM design claims without reading FEM.
  - GR clock effects C→S: GPS/PNT.
  - Quantum sensing and computing C→S: a frequent article topic that needs critique.
  - Lebesgue N→C: one lesson on why L² makes Fourier converge.
  - Hamiltonian mechanics S→C: phase-plane thinking is already covered.
- **10 subtopics added** that are absent from both maps:
  - dimensional analysis / Buckingham Π (K);
  - first-order uncertainty propagation (K);
  - ill-posed inverse problems (K);
  - order-of-magnitude physics with constants (K);
  - scattering regimes and cross-section (K);
  - perturbation methods;
  - reliability mathematics;
  - rotation representations;
  - plasma frequency and ionosphere;
  - attenuation / Beer–Lambert.
- **Unmatched sections in scope:** 607, about 2,470 pp.
  - **KEEP:** 489 sections, 1,909 pp.
  - **NOT NEEDED:** 118 sections, 560 pp. This includes 23 pp that the merge had matched as K/S by keyword: K2 X/3–5 (prime-number research methods) and the E08 appendix C sections on porting code to Cython, Fortran and C.

## The most important gaps (K first, then S), with hosts

1. **Heavy tails and power laws** (K, missing → M6.3). The books never show where Gaussian intuition, the CLT and sample means fail.
2. **Cramér–Rao bound / Fisher information** (K, partial → M6.5). Fisher information appears only inside asymptotic normality (E05 9.7–9.8). The bound itself, the basic sanity check on any sensor-accuracy claim, is never stated.
3. **FEM** (K, missing → new module M10.10 after M10.6). The syllabus already notes "FEM has no source". The seeds are K2 VI/5 (Galerkin) and K2 VIII/3 (Ritz). Finite volume (S) goes in the same module.
4. **Nondimensionalization / Buckingham Π** (K, partial → M10.1). It appears only in passing (E08, F2 41).
5. **UQ and sensitivity, plus linear error propagation** (K, partial → M6.11 / M6.5).
6. **ODE integrators** (K, partial → M10.4). Missing: stability regions, adaptive step, stiffness (S) and symplectic integrators.
7. **Coherence** (K, partial → M9.13). Interference is fully taught, but coherence time, coherence length and spatial coherence are not.
8. **S-level missing items:**
   - residue theorem (M4.11);
   - extreme-value statistics (M6.3);
   - design of experiments and SPC (M6.6);
   - GR clocks / GPS correction (M24.1). Feynman II ch. 42 is missing from the library copy.
9. **S-level partial items:**
   - chaos (M3.1);
   - Kramers–Kronig (M4.11);
   - Little's law (M7.1);
   - Jacobian change of variables, Gaussian integral and Gamma function (M1.2);
   - curvilinear operators (M9.2);
   - PDE classification and shocks (M10.1, M10.7);
   - Coriolis and free-rotation stability (M2.5);
   - tunneling formula (M24.8);
   - photoelectric effect and detectors (M24.3);
   - Landauer bound (M13.3);
   - general statement of the fluctuation–dissipation theorem (M13.2).

## Biggest NOT-NEEDED blocks (pp)

| module | pages | what |
|---|---|---|
| M26.3 | 52 | K3 XVII/1–6, 8: history of the parallel postulate, Lobachevskian geometry, axiomatics. Kept: many-dimensional spaces, Riemannian geometry, abstract geometry and real space |
| M26.5 | 40 | K3 XX: Fedorov groups, Galois groups, fundamental groups, associative algebras, rings, lattices. Kept: symmetry groups, continuous groups, representations, quaternions, Lie algebras |
| M22.1 | 39 | K2 XIV/2–4: programming, vacuum-tube units and forecasts of 1950s computers |
| M0.1 | 35 | K1 I/3, 5–7: history chapters (the content is retaught in K1 II) |
| M26.1 | 32 | K2 VII/1, 4, 5: history, bending of surfaces, 1950s research |
| M24.7 + M24.9 | 51 | F3 benzene, dyes, organic chemistry, K-meson, nuclear forces, spin waves |
| M8.21 + M8.23 + M8.22 | 62 | Boyd: floor planning, placement, centering, self-concordance theory, barrier methods for generalized inequalities |
| M10.9 | 22 | E08 C: porting loops to Cython, Fortran and C |
| M1.5 | 19 | K1 IV/1–2: solution by radicals. Keep one paragraph: no general formula above degree 4, hence numerical methods |
| M20.5 | 18 | K2 X/3–5: Chebyshev's and Vinogradov's methods, sums of two squares |
| M24.13 | 18 | F2 30-9: Bragg–Nye bubble-model photo plates |
| M9.15 | 13 | F1 35–36: physiology and neurology of vision. Colorimetry and the compound-eye diffraction argument are kept |

Smaller blocks are listed in the JSON: E05 bibliographic remarks and appendices, F2 accelerator optics, the Aharonov–Bohm section, the classical electron self-energy, and E08 exercises as reading.

## Surprising findings

- **The Trefethen & Bau text (E07) is unreadable in the app.**
  - **Cause:** the PDF uses Type-3 fonts with no Unicode map, so `lib/text/E07.json` is garbage. Only 17 pages have OCR images.
  - **Impact:** M8.3–M8.10 (core numerical linear algebra, about 330 pp) send the tutor noise instead of the source.
  - **Fix:** re-extract with OCR, the way K1–K3 were done (`eng/tools/extract.py`). The registry's section typing for E07 is wrong for the same reason: whole lectures were typed "history" or "problems".
- **Several K-level physics results sit in adv-tier modules:**
  - Poynting vector and field energy (F2 27, M9.16);
  - Fresnel reflection and skin depth (F2 32–33, M9.14);
  - Doppler effect (F1 34-6/7, M9.14);
  - multivariate Gaussian conditioning (M6.9);
  - causal confounding (M6.10).

  Move these sections to core, or teach them as a delta in M9.9 / M6.2.
- **K3 XIX (Hilbert space and operators, M8.14, adv) carries the L²/Fourier/Green-function view** that signals and quantum mechanics rely on. Recommend making XIX/1–4 core.
- **No book in the library teaches** DOE, SPC, extreme values, heavy tails, the residue theorem, the CRB, FEM/FV, or the general relativity of clocks. These are true additions, not search misses (confirmed by search).

## Rough or unverified items

- Statuses for E07 are taken from the table of contents; the text could not be searched.
- Domain overlaps:
  - "Free energies" is counted full via Çengel, which belongs to the thermo panel.
  - The rocket equation is counted full via Anderson (E11).
- Section-level KEEP reasons are assigned per module ("serves …"), not per section, except where a section was singled out.
