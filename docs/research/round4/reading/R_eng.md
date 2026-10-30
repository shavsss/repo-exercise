# R_eng: fixed reading list for Gilua (engineering)

Built 2026-10-30. **186 items**: 102 core, 84 optional. Core reading time ~103 h (about 20 min per module averaged over 316 modules); everything ~177 h. Data: `R_eng.json` (same content, one record per item).

## How to use it

- **Core**: read with the host module, after the lesson's first pass (the lesson gives the frame, the paper gives the original argument and the judgment). Only the listed sections; the time is for those.
- **Optional**: read only when writing or interviewing on that topic. Nothing else needs to be searched for.
- **Paywall** (marked $): the open alternative is given when one exists (author copy, arXiv, reprint). Old IEEE/Bell/Wiley papers without an open copy are usually reachable through a library or IEEE Xplore single purchase.
- **Failure reports** are in the module where the physics lives (Patriot -> M8.6, AF447 -> M15.14, Aloha -> M16.2, Hyatt -> M16.4, Ariane/Therac -> M22.7, MCO -> M15.15); the systems-level ones (Challenger, Columbia, Hubble, 737 MAX, Uber) are in P27.
- **State of the art**: 1-2 recent reviews per field are marked in the 'why' line with 'State of the art'. These age; recheck them once a year (the classic papers do not).

## Link check

- Every DOI was resolved against Crossref or the doi.org handle API, and the registered title was compared with the listed title. Every URL was fetched on 2026-10-30.
- 'exists; 403 to scripts' = GAO, IEA, FERC, MIT Press and INCOSE block automated requests; the pages exist (confirmed by search) and open in a browser.
- 'not reachable from sandbox' = sunnyday.mit.edu (Leveson's site, 503 during the check), umn.edu and cornell.edu (TLS chain error in the sandbox), github.com (blocked by the sandbox proxy). These are long-standing hosts; recheck once from a browser. Ariane 501 now points to ESA's own copy, with sunnyday as the alternative.
- Replaced after checking: AF447 (BEA path moved; FAA-hosted English copy), Rogers/CAIB (sma.nasa.gov 500; NTRS records), Feynman Appendix F (nasa.gov history copy), JATR (FAA path moved), Kalman 1960 open copy (unc.edu gone; third-party mirror), Haldane (UCLA course copy), Fault Tree Handbook (KSC copy). Black 1934 reprint DOI corrected to 10.1109/JPROC.1999.740032.

**Rough parts (marked):** focus sections for a few long reports (CAIB, AF447, 2003 blackout, GAO-20-48G) are from memory of their structure, not re-read today; check chapter numbers when opening. Reading-time estimates are mine (about 2-4 pages per 10 min for dense papers).


## P0: Gate: overview of mathematics and physics (שער: מבט על המתמטיקה והפיזיקה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M0.1 | core | **You and Your Research**. R. W. Hamming, 1986. [link](https://www.cs.virginia.edu/~robins/YouAndYourResearch.html) | How first-rate technical people choose problems; the operating manual for becoming an authority. | Whole talk; the parts on important problems, open doors, and selling the work. | 45 |
| M0.1 | opt | **The Unreasonable Effectiveness of Mathematics in the Natural Sciences**. E. P. Wigner, 1960. [link](https://doi.org/10.1002/cpa.3160130102) $ · open: [link](https://www.maths.ed.ac.uk/~v1ranick/papers/wigner.pdf) | Why abstract structures keep fitting physics; frames the whole 'same structure across fields' thread. | Whole essay (14 pp). | 30 |
| M0.2 | core | **Cargo Cult Science (Caltech commencement address)**. R. P. Feynman, 1974. [link](https://calteches.library.caltech.edu/51/2/CargoCult.htm) | The integrity standard for any claim you will judge or publish: bend over backwards to show how you could be wrong. | Whole text; the Millikan oil-drop and rat-maze examples. | 20 |
| M0.2 | core | **Street-Fighting Mathematics: The Art of Educated Guessing and Opportunistic Problem Solving**. S. Mahajan, 2010. [link](https://mitpress.mit.edu/9780262514293/street-fighting-mathematics/) (exists) · open: [link](https://ocw.mit.edu/courses/18-098-street-fighting-mathematics-january-iap-2008/) | The toolkit for the 10-20% mental estimate that level 2.5 demands (dimensions, easy cases, lumping). | Ch. 1 (dimensions), 2 (easy cases), 3 (lumping). CC-licensed. | 180 |

## P1: Backbone: analysis, geometry, algebra (עמוד השדרה: אנליזה, גאומטריה ואלגברה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M1.4 | opt | **A comparative review of recent researches in geometry (Erlangen Program)**. F. Klein (tr. M. W. Haskell), 1872. [link](https://arxiv.org/abs/0807.3161) | Geometry = invariants of a transformation group; the idea behind Lorentz, symmetry and conservation laws. | Sections 1-5. | 60 |

## P2: Backbone: mechanics (עמוד השדרה: מכניקה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M2.1 | opt | **Invariant Variation Problems (English translation)**. E. Noether (tr. M. A. Tavel), 1918. [link](https://arxiv.org/abs/physics/0503066) | Symmetry implies conservation; the reason energy/momentum conservation are trustworthy anchors. | Introduction and Section 1-2; skim the rest. | 60 |

## P3: Backbone: ODEs and oscillations (עמוד השדרה: משוואות דיפרנציאליות ותנודות)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M3.1 | core | **Deterministic Nonperiodic Flow**. E. N. Lorenz, 1963. [link](https://doi.org/10.1175/1520-0469(1963)020<0130:DNF>2.0.CO;2) | Sensitive dependence: where prediction ends even with a perfect model; sets limits on any simulation claim. | Sections 1, 5-7 and the concluding remarks. | 60 |
| M3.1 | opt | **Simple mathematical models with very complicated dynamics**. R. M. May, 1976. [link](https://doi.org/10.1038/261459a0) $ | The logistic map: a one-line nonlinear model with chaos; why linear intuition fails. | Whole review. | 30 |
| M3.2 | core | **Resonance, Tacoma Narrows bridge failure, and undergraduate physics textbooks**. K. Y. Billah, R. H. Scanlan, 1991. [link](https://doi.org/10.1119/1.16590) $ | Textbooks got the most famous resonance example wrong (it was flutter, self-excited); lesson in checking canonical stories. | Whole paper (8 pp). | 35 |

## P4: Signals and linear systems (צומת 1: אותות ומערכות לינאריות)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M4.6 | core | **An algorithm for the machine calculation of complex Fourier series**. J. W. Cooley, J. W. Tukey, 1965. [link](https://doi.org/10.1090/S0025-5718-1965-0178586-1) | The FFT: N log N changed what is computable in radar, comms, imaging. | Whole paper (5 pp); then count the operations yourself. | 30 |
| M4.6 | core | **On the use of windows for harmonic analysis with the discrete Fourier transform**. F. J. Harris, 1978. [link](https://doi.org/10.1109/PROC.1978.10837) $ · open: [link](https://web.mit.edu/xiphmont/Public/windows.pdf) | Leakage, resolution and dynamic range trade-offs behind every spectrum you will read. | Sections I-IV and the figures of merit table. | 75 |
| M4.8 | core | **Communication in the presence of noise**. C. E. Shannon, 1949. [link](https://doi.org/10.1109/JRPROC.1949.232969) $ · open: [link](https://doi.org/10.1109/JPROC.1998.659497) | Sampling theorem and the geometric picture of signals as points in 2TW dimensions; source of C = W log(1+S/N). | Sections I-III and VI. | 60 |
| M4.8 | opt | **Sampling: 50 years after Shannon**. M. Unser, 2000. [link](https://doi.org/10.1109/5.843002) $ · open: [link](http://bigwww.epfl.ch/publications/unser0001.pdf) | Modern view of sampling as approximation; what band-limiting really assumes. | Sections I-III. | 60 |

## P5: Dynamics, control and state estimation (צומת 2: דינמיקה, בקרה ושערוך מצב)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M5.1 | core | **Stabilized feed-back amplifiers**. H. S. Black, 1934. [link](https://doi.org/10.1002/j.1538-7305.1934.tb00652.x) $ · open: [link](https://doi.org/10.1109/JPROC.1999.740032) | Trading gain for precision: the founding idea of feedback engineering. | Pages 1-10 (principle, the mu-beta loop, distortion reduction). | 45 |
| M5.5 | core | **Guaranteed margins for LQG regulators**. J. C. Doyle, 1978. [link](https://doi.org/10.1109/TAC.1978.1101812) $ | Abstract: 'There are none.' Optimal does not mean robust. | Whole note (2 pp). | 15 |
| M5.6 | core | **A new approach to linear filtering and prediction problems**. R. E. Kalman, 1960. [link](https://doi.org/10.1115/1.3662552) $ · open: [link](https://www.unitedthc.com/DSP/Kalman1960.pdf) | The Kalman filter: state-space estimation that runs every navigation and tracking system. | Sections 1-3, 6-7 (problem, main result, duality); skip proofs. | 90 |
| M5.8 | core | **Regeneration theory**. H. Nyquist, 1932. [link](https://doi.org/10.1002/j.1538-7305.1932.tb02344.x) $ | The Nyquist criterion from the source: stability read from the open-loop locus. | Sections 1-6 and the rule statement. | 60 |
| M5.12 | core | **Relations between attenuation and phase in feedback amplifier design**. H. W. Bode, 1940. [link](https://doi.org/10.1002/j.1538-7305.1940.tb00839.x) $ | Gain and phase are linked; there are hard limits on loop shaping. | Sections 1-4 and the gain-phase relation; skim the network synthesis. | 75 |
| M5.12 | core | **Respect the unstable**. G. Stein, 2003. [link](https://doi.org/10.1109/MCS.2003.1213600) $ | Bode integral as a budget: X-29 and Chernobyl show what unstable plants cost; essential judgment. | Whole paper (Bode Lecture). | 45 |
| M5.13 | opt | **Industry engagement with control research: perspective and messages**. T. Samad et al., 2020. [link](https://doi.org/10.1016/j.arcontrol.2020.03.002) | State of the art: which control methods industry actually uses and why (PID dominance, MPC). | Survey results and the 'messages' section. | 45 |

## P6: Probability and statistics (צומת 3א: הסתברות וסטטיסטיקה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M6.3 | core | **Power-law distributions in empirical data**. A. Clauset, C. R. Shalizi, M. E. J. Newman, 2009. [link](https://doi.org/10.1137/070710111) $ · open: [link](https://arxiv.org/abs/0706.1062) | Heavy tails and how most claimed power laws fail proper tests. | Sections 1-4 and 8. | 75 |
| M6.4 | core | **Evaluation of measurement data: Guide to the expression of uncertainty in measurement (GUM), JCGM 100:2008**. JCGM/BIPM, 2008. [link](https://www.bipm.org/documents/20126/2071204/JCGM_100_2008_E.pdf) | The international standard for Type A/B uncertainty and propagation; the language of serious measurement claims. | Sections 2-5 and Annex H examples H.1-H.3. | 120 |
| M6.6 | core | **The ASA statement on p-values: context, process, and purpose**. R. L. Wasserstein, N. A. Lazar, 2016. [link](https://doi.org/10.1080/00031305.2016.1154108) | Six principles for what a p-value does and does not mean. | The six principles. | 25 |
| M6.6 | core | **Why most published research findings are false**. J. P. A. Ioannidis, 2005. [link](https://doi.org/10.1371/journal.pmed.0020124) | Base rates, power and bias decide whether a 'significant' result is true; applies to test reports too. | Model section and the six corollaries. | 35 |
| M6.6 | opt | **The garden of forking paths**. A. Gelman, E. Loken, 2013. [link](http://www.stat.columbia.edu/~gelman/research/unpublished/p_hacking.pdf) | Multiple comparisons without fishing; why analysis choices inflate claims. | Sections 1-3. | 35 |
| M6.7 | core | **Judgment under uncertainty: heuristics and biases**. A. Tversky, D. Kahneman, 1974. [link](https://doi.org/10.1126/science.185.4157.1124) $ | Representativeness, availability, anchoring: the errors an authority must catch in experts and in himself. | Whole paper. | 40 |
| M6.8 | core | **Statistical modeling: the two cultures**. L. Breiman, 2001. [link](https://doi.org/10.1214/ss/1009213726) | Data models vs algorithmic models; frames statistics versus machine learning. | Main paper (skip discussants on first read; read Cox and Efron). | 60 |
| M6.10 | opt | **Causal inference in statistics: an overview**. J. Pearl, 2009. [link](https://doi.org/10.1214/09-SS057) | Confounding, do-calculus and counterfactuals in one survey. | Sections 1-3. | 90 |
| M6.11 | opt | **Why so many published sensitivity analyses are false**. A. Saltelli et al., 2019. [link](https://doi.org/10.1016/j.envsoft.2019.01.012) | One-at-a-time sensitivity hides interactions; how to judge a model's uncertainty claims. | Sections 1-3. | 40 |

## P7: Information, inference, random signals (צומת 3ב: אינפורמציה, הסקה ואותות אקראיים)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M7.4 | core | **An analysis of the factors which determine signal/noise discrimination in pulsed-carrier systems**. D. O. North, 1963. [link](https://doi.org/10.1109/PROC.1963.2383) $ | The matched filter (1943 RCA report): detection SNR depends on energy, not shape. | Sections on the optimum filter and detection probability. | 60 |
| M7.5 | core | **A mathematical theory of communication**. C. E. Shannon, 1948. [link](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) $ · open: [link](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf) | Entropy, capacity and the coding theorem: the limit every link, compressor and sensor claim is judged against. | Introduction; Part I secs. 1-7; Part II secs. 11-13; Part IV Theorem 17 (C = W log(1+P/N)). | 180 |
| M7.10 | opt | **Information theory and statistical mechanics**. E. T. Jaynes, 1957. [link](https://doi.org/10.1103/PhysRev.106.620) $ | Maximum entropy as inference; one structure for thermodynamics and estimation. | Sections 1-4. | 60 |
| M7.11 | opt | **Science and statistics**. G. E. P. Box, 1976. [link](https://doi.org/10.1080/01621459.1976.10480949) $ | 'All models are wrong': worrying selectively about what matters. | Whole paper. | 30 |
| M7.12 | core | **Equation of state calculations by fast computing machines**. N. Metropolis, A. W. Rosenbluth, M. N. Rosenbluth, A. H. Teller, E. Teller, 1953. [link](https://doi.org/10.1063/1.1699114) $ | The Metropolis algorithm, root of MCMC. | Sections I-III. | 40 |
| M7.15 | opt | **Bayesian workflow**. A. Gelman et al., 2020. [link](https://arxiv.org/abs/2011.01808) | State of the art in applied Bayesian practice: model building, checking, comparison. | Sections 1-2, 6-7. | 120 |

## P8: Linear algebra, optimization, numerical methods (צומת 4: אלגברה לינארית, אופטימיזציה ושיטות חישוב)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M8.6 | core | **What every computer scientist should know about floating-point arithmetic**. D. Goldberg, 1991. [link](https://doi.org/10.1145/103162.103163) $ · open: [link](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) | Rounding, cancellation and IEEE 754: where numerical results silently lie. | Sections 1 (rounding error) and 2 (IEEE standard), skim proofs. | 120 |
| M8.6 | core | **Patriot Missile Defense: Software Problem Led to System Failure at Dhahran, Saudi Arabia (GAO/IMTEC-92-26)**. U.S. GAO, 1992. [link](https://www.gao.gov/products/imtec-92-26) (exists) · open: [link](https://www-users.cse.umn.edu/~arnold/disasters/patriot.html) | 0.1 s in 24-bit binary drifted 0.34 s after 100 h: 28 dead. Floating-point error as an operational failure. | Whole report (16 pp). | 30 |
| M8.6 | opt | **Some disasters attributable to bad numerical computing**. D. N. Arnold, 2000. [link](https://www-users.cse.umn.edu/~arnold/disasters/) (not reachable from the research sandbox (TLS/host down)) | Patriot, Ariane 5 and Sleipner on one page. | All three entries. | 15 |
| M8.10 | opt | **An introduction to the conjugate gradient method without the agonizing pain**. J. R. Shewchuk, 1994. [link](https://www.cs.cmu.edu/~quake-papers/painless-conjugate-gradient.pdf) | Geometric intuition for CG and steepest descent. | Sections 1-9. | 120 |
| M8.12 | opt | **Guest editors' introduction: the top 10 algorithms**. J. Dongarra, F. Sullivan, 2000. [link](https://doi.org/10.1109/MCISE.2000.814652) $ | Monte Carlo, simplex, Krylov, QR, FFT, multipole...: the map of 20th-century numerical algorithms. | Whole introduction. | 20 |
| M8.19 | opt | **An introduction to compressive sampling**. E. J. Candès, M. B. Wakin, 2008. [link](https://doi.org/10.1109/MSP.2007.914731) $ | When sparsity beats Nyquist; ill-posed recovery done right. | Whole tutorial. | 60 |
| M8.22 | opt | **Distributed optimization and statistical learning via the alternating direction method of multipliers**. S. Boyd, N. Parikh, E. Chu, B. Peleato, J. Eckstein, 2011. [link](https://doi.org/10.1561/2200000016) · open: [link](https://stanford.edu/~boyd/papers/pdf/admm_distr_stats.pdf) | Splitting methods for large problems; the workhorse of modern convex optimization. | Chapters 1-3. | 90 |
| M8.23 | opt | **The interior-point revolution in optimization: history, recent developments, and lasting consequences**. M. H. Wright, 2005. [link](https://doi.org/10.1090/S0273-0979-04-01040-7) | How Karmarkar changed optimization and why IPMs win on large convex problems. | Sections 1-4. | 60 |

## P9: Waves, EM, optics (צומת 5א: גלים, אלקטרומגנטיות ואופטיקה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M9.9 | core | **A physical limitation of omni-directional antennas**. L. J. Chu, 1948. [link](https://doi.org/10.1063/1.1715038) $ | The Chu limit: a small antenna cannot be broadband and efficient; a fundamental bound for judging antenna claims. | Introduction and the Q bound. | 45 |
| M9.9 | opt | **A dynamical theory of the electromagnetic field**. J. C. Maxwell, 1865. [link](https://doi.org/10.1098/rstl.1865.0008) | Light as an electromagnetic wave, from the source. | Part I (introduction) and Part VI (electromagnetic theory of light). | 60 |
| M9.11 | opt | **Dielectric-fibre surface waveguides for optical frequencies**. K. C. Kao, G. A. Hockham, 1966. [link](https://doi.org/10.1049/piee.1966.0189) $ | Predicted that purity, not physics, limited fibre loss; how a correct loss budget launched optical comms. | Introduction and conclusions. | 40 |
| M9.13 | opt | **Nobel Lecture: Nanoscopy with freely propagating light**. S. W. Hell, 2015. [link](https://doi.org/10.1103/RevModPhys.87.1169) $ | How the diffraction 'limit' was bypassed by changing an assumption; model for reading fundamental limits. | Sections I-III. | 60 |

## P10: Field equations and numerical simulation (צומת 5ב: משוואות שדה וסימולציה נומרית)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M10.1 | opt | **On physically similar systems; illustrations of the use of dimensional equations**. E. Buckingham, 1914. [link](https://doi.org/10.1103/PhysRev.4.345) $ | The Pi theorem: nondimensionalization as the first move on any PDE. | Sections 1-6. | 60 |
| M10.5 | core | **On the partial difference equations of mathematical physics (English tr. 1967)**. R. Courant, K. Friedrichs, H. Lewy, 1928. [link](https://doi.org/10.1147/rd.112.0215) $ | The CFL condition: information cannot travel faster in the scheme than in the physics. | Part II (hyperbolic case). | 60 |
| M10.8 | opt | **Verification and validation in computational fluid dynamics (SAND2002-0529)**. W. L. Oberkampf, T. G. Trucano, 2002. [link](https://www.osti.gov/biblio/793406) | Verification (solving equations right) vs validation (right equations); the standard vocabulary. | Sections 1-3. | 90 |
| M10.10 | core | **Variational methods for the solution of problems of equilibrium and vibrations**. R. Courant, 1943. [link](https://doi.org/10.1090/S0002-9904-1943-07818-4) | The mathematical origin of finite elements (Ritz/Galerkin with local triangles). | Sections 1-4 and the appendix on triangles. | 60 |
| M10.10 | core | **NASA-STD-7009A: Standard for Models and Simulations**. NASA, 2016. [link](https://standards.nasa.gov/standard/NASA/NASA-STD-7009) | How NASA decides whether a simulation result can be trusted for a decision (credibility factors). | Section 4 requirements and the credibility assessment scale. | 90 |
| M10.10 | core | **Weak baselines and reporting biases lead to overoptimism in machine learning for fluid-related partial differential equations**. N. McGreivy, A. Hakim, 2024. [link](https://doi.org/10.1038/s42256-024-00897-5) $ · open: [link](https://arxiv.org/abs/2407.07218) | State of the art with a critique: most ML-PDE speedup claims vanish against fair baselines. | Whole paper. | 45 |

## P11: Electronics (גשר: אלקטרוניקה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M11.5 | opt | **A simple model of feedback oscillator noise spectrum**. D. B. Leeson, 1966. [link](https://doi.org/10.1109/PROC.1966.4682) $ | Phase-noise model that sets limits on radar and comms oscillators. | Whole letter (2 pp). | 20 |
| M11.7 | core | **Thermal agitation of electric charge in conductors**. H. Nyquist, 1928. [link](https://doi.org/10.1103/PhysRev.32.110) $ | kTB noise derived in 4 pages; the floor under every receiver. | Whole paper. | 25 |
| M11.7 | core | **Noise figures of radio receivers**. H. T. Friis, 1944. [link](https://doi.org/10.1109/JRPROC.1944.232049) $ | The cascade formula: why the first amplifier decides sensitivity. | Definitions and the cascade formula. | 30 |
| M11.9 | core | **Analog-to-digital converter survey and analysis**. R. H. Walden, 1999. [link](https://doi.org/10.1109/49.761034) $ | ADC limits (thermal, jitter, aperture, comparator ambiguity) as one map; judge any digitizer claim. | Sections II-V. | 60 |
| M11.9 | core | **ADC Performance Survey 1997-2025**. B. Murmann, 2025. [link](https://github.com/bmurmann/ADC-survey) (not reachable from the research sandbox (TLS/host down)) | State of the art: Walden and Schreier figures of merit across 25 years of published converters. | The FoM vs speed plots; ENOB vs bandwidth. | 30 |
| M11.13 | opt | **Spectrum Analysis Basics (Application Note 150)**. Keysight Technologies, 2016. [link](https://www.keysight.com/us/en/assets/7018-06714/application-notes/5952-0292.pdf) | What RBW, noise floor and averaging do to a measured spectrum. | Ch. 2-5. | 90 |

## P12: Electric motors, drives, magnetic materials (גשר: מנועים חשמליים, הנעה וחומרים מגנטיים)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M12.4 | opt | **A survey of wide bandgap power semiconductor devices**. J. Millán, P. Godignon, X. Perpiñà, A. Pérez-Tomás, J. Rebollo, 2014. [link](https://doi.org/10.1109/TPEL.2013.2268900) $ | SiC and GaN: why switching losses and drive size are changing. | Sections I-II, V. | 60 |
| M12.8 | core | **The Role of Critical Minerals in Clean Energy Transitions**. IEA, 2021. [link](https://www.iea.org/reports/the-role-of-critical-minerals-in-clean-energy-transitions) (exists) | Rare-earth magnets and supply concentration: motors as a strategic dependency. | Executive summary; chapters on rare earths and supply risk. | 60 |

## P13: Thermodynamics and energy (גשר: תרמודינמיקה ואנרגיה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M13.3 | opt | **Irreversibility and heat generation in the computing process**. R. Landauer, 1961. [link](https://doi.org/10.1147/rd.53.0183) $ | kT ln 2 per erased bit: thermodynamics meets information. | Sections 1-4. | 45 |
| M13.7 | opt | **Reflections on the Motive Power of Fire (English)**. S. Carnot, 1824. [link](https://archive.org/details/reflectionsonmot00carnrich) | The efficiency limit argued without the first law; a model of reasoning from a single principle. | First half. | 60 |
| M13.9 | core | **Efficiency of a Carnot engine at maximum power output**. F. L. Curzon, B. Ahlborn, 1975. [link](https://doi.org/10.1119/1.10023) $ | Real plants run near 1 - sqrt(Tc/Th), not Carnot; the right benchmark for efficiency claims. | Whole paper (3 pp). | 25 |
| M13.16 | core | **Detailed balance limit of efficiency of p-n junction solar cells**. W. Shockley, H. J. Queisser, 1961. [link](https://doi.org/10.1063/1.1736034) $ | The ~30% single-junction limit; how a fundamental bound is built from detailed balance. | Sections 1-4 and the efficiency figure. | 60 |
| M13.18 | opt | **World Energy Outlook 2025**. IEA, 2025. [link](https://www.iea.org/reports/world-energy-outlook-2025) (exists) | State of the art in energy numbers and scenarios. | Executive summary and overview chapter. | 60 |
| M13.19 | core | **Final Report on the August 14, 2003 Blackout in the United States and Canada**. U.S.-Canada Power System Outage Task Force, 2004. [link](https://www.energy.gov/oe/articles/blackout-2003-final-report-august-14-2003-blackout-united-states-and-canada-causes-and) | Cascading failure in a real grid: alarms, vegetation, protection and situational awareness. | Chapters 4-6 (causes, sequence, cascade). | 150 |
| M13.19 | core | **Definition and classification of power system stability - revisited and extended**. N. Hatziargyriou et al., 2021. [link](https://doi.org/10.1109/TPWRS.2020.3041774) $ | The standard taxonomy of grid stability, now including converter-driven stability. | Sections I-IV. | 60 |
| M13.19 | core | **Analysis of the Cyber Attack on the Ukrainian Power Grid (Defense Use Case)**. E-ISAC and SANS ICS, 2016. [link](https://www.nerc.com/pa/CI/ESISAC/Documents/E-ISAC_SANS_Ukraine_DUC_18Mar2016.pdf) | The first confirmed grid outage by cyberattack: grid vulnerability as an operational fact. | Attack timeline and the defense recommendations. | 60 |
| M13.19 | opt | **Foundations and challenges of low-inertia systems**. F. Milano, F. Dörfler, G. Hug, D. J. Hill, G. Verbič, 2018. [link](https://doi.org/10.23919/PSCC.2018.8450880) $ | State of the art: what replacing machines with inverters does to frequency control. | Sections I-III. | 60 |
| M13.19 | opt | **February 2021 Cold Weather Outages in Texas and the South Central United States**. FERC and NERC staff, 2021. [link](https://www.ferc.gov/media/february-2021-cold-weather-outages-texas-and-south-central-united-states-ferc-nerc-and) (exists) | Common-mode failure of generation under one weather event; frequency within minutes of collapse. | Executive summary and the frequency-event chapter. | 60 |

## P14: Heat transfer (גשר: מעבר חום)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M14.1 | opt | **Electronics thermal management in information and communications technologies: challenges and future directions**. S. V. Garimella et al., 2017. [link](https://doi.org/10.1109/TCPMT.2016.2603600) $ | State of the art: heat is now the limit on chips, radars and data centers. | Sections I-III. | 60 |
| M14.4 | core | **On being the right size**. J. B. S. Haldane, 1926. [link](https://web.cs.ucla.edu/classes/cs217/RightSize.pdf) | Square-cube scaling as a design law in 10 minutes. | Whole essay. | 15 |
| M14.6 | opt | **The local structure of turbulence in incompressible viscous fluid for very large Reynolds numbers (English tr. 1991)**. A. N. Kolmogorov, 1941. [link](https://doi.org/10.1098/rspa.1991.0075) $ | K41: the -5/3 spectrum from dimensional reasoning alone. | Whole paper (4 pp). | 30 |
| M14.7 | opt | **Describing the uncertainties in experimental results**. R. J. Moffat, 1988. [link](https://doi.org/10.1016/0894-1777(88)90043-X) $ | How to quote uncertainty in a heat-transfer correlation or test. | Whole paper. | 45 |

## P15: Fluids and aeronautics (גשר: זורמים ואווירונאוטיקה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M15.7 | core | **Motion of fluids with very little viscosity (NACA TM 452, English tr. 1928)**. L. Prandtl, 1904. [link](https://ntrs.nasa.gov/citations/19930090813) | The boundary layer: the idea that made aerodynamics computable. | Whole paper (8 pp). | 40 |
| M15.7 | opt | **An experimental investigation of the circumstances which determine whether the motion of water shall be direct or sinuous**. O. Reynolds, 1883. [link](https://doi.org/10.1098/rstl.1883.0029) | The Reynolds number and transition, from the dye experiment. | Sections on the dye experiments and the criterion. | 60 |
| M15.7 | opt | **CFD Vision 2030 Study: A Path to Revolutionary Computational Aerosciences (NASA/CR-2014-218178)**. J. Slotnick et al., 2014. [link](https://ntrs.nasa.gov/citations/20140003093) | State of the art and gaps: where CFD still cannot be trusted (separation, transition). | Executive summary and sections 3-4. | 60 |
| M15.14 | core | **Final Report on the accident on 1st June 2009 to the Airbus A330-203 flight AF 447**. BEA, 2012. [link](https://www.faa.gov/sites/faa.gov/files/f-cp090601.en_.pdf) | Iced pitot -> autopilot off -> crew holds a stall: stability, automation and human factors together. | Synopsis, 1.16, 2.1-2.2, conclusions 3. | 150 |
| M15.15 | core | **Mars Climate Orbiter Mishap Investigation Board Phase I Report**. NASA MCO MIB, 1999. [link](https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf) | Pound-force vs newton in one interface file lost a spacecraft; the verification gap, not the units, is the lesson. | Executive summary and root/contributing causes. | 45 |
| M15.17 | opt | **Critical hypersonic aerothermodynamic phenomena**. J. J. Bertin, R. M. Cummings, 2006. [link](https://doi.org/10.1146/annurev.fluid.38.050304.092041) $ | Where hypersonic prediction fails (transition, shock interactions, real gas). | Sections 1-4. | 60 |

## P16: Structures and materials (גשר: מבנים וחומרים)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M16.2 | core | **Aircraft Accident Report: Aloha Airlines Flight 243, Boeing 737-200, April 28, 1988 (NTSB/AAR-89/03)**. NTSB, 1989. [link](https://www.ntsb.gov/investigations/AccidentReports/Reports/AAR8903.pdf) | Multiple-site fatigue damage and inspection limits in an aging fuselage. | Synopsis, analysis (sec. 2), findings. | 90 |
| M16.2 | core | **NASA-STD-5001: Structural Design and Test Factors of Safety for Spaceflight Hardware**. NASA, 2016. [link](https://standards.nasa.gov/standard/NASA/NASA-STD-5001) | Real factors of safety and test factors, and when margins are probabilistic vs deterministic. | Section 4 tables. | 45 |
| M16.2 | opt | **Fatigue failure of the de Havilland Comet I**. P. A. Withey, 1997. [link](https://doi.org/10.1016/S1350-6307(97)00005-8) $ | Fatigue at window corners: the case that created damage-tolerant design. | Whole paper. | 30 |
| M16.4 | core | **Investigation of the Kansas City Hyatt Regency walkways collapse (NBSIR 82-2465)**. R. D. Marshall et al. (NBS), 1982. [link](https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir82-2465.pdf) | A detail change doubled the load on one connection; 114 dead. Load paths and design-change review. | Summary, chapters on the connection and load capacity. | 60 |
| M16.7 | opt | **Buckling of thin-walled circular cylinders (NASA SP-8007)**. NASA, 1968. [link](https://ntrs.nasa.gov/citations/19690013955) | Knockdown factors: why measured shell buckling is far below theory (imperfection sensitivity). | Sections 1-2 and the knockdown figure. | 45 |
| M16.11 | core | **The phenomena of rupture and flow in solids**. A. A. Griffith, 1921. [link](https://doi.org/10.1098/rsta.1921.0006) | Strength is set by flaws, not bonds: the energy balance that founded fracture mechanics. | Sections 1-4 (theory) and the glass results. | 75 |
| M16.16 | opt | **Additive manufacturing of metallic components: process, structure and properties**. T. DebRoy et al., 2018. [link](https://doi.org/10.1016/j.pmatsci.2017.10.001) $ | State of the art in metal 3D printing: defects, residual stress, qualification. | Sections 1-2, 8-10. | 90 |

## P17: Machine learning and deep learning (גשר: למידת מכונה ולמידה עמוקה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M17.2 | opt | **Multilayer feedforward networks are universal approximators**. K. Hornik, M. Stinchcombe, H. White, 1989. [link](https://doi.org/10.1016/0893-6080(89)90020-8) $ | What the universal approximation theorem says and does not say (nothing about learnability). | Introduction and main theorems. | 40 |
| M17.4 | opt | **Learning representations by back-propagating errors**. D. E. Rumelhart, G. E. Hinton, R. J. Williams, 1986. [link](https://doi.org/10.1038/323533a0) $ | Backpropagation in 4 pages. | Whole letter. | 25 |
| M17.5 | core | **Hidden technical debt in machine learning systems**. D. Sculley et al., 2015. [link](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems) | The model is a small part of an ML system; where real failures live. | Whole paper. | 30 |
| M17.5 | core | **Leakage and the reproducibility crisis in machine-learning-based science**. S. Kapoor, A. Narayanan, 2023. [link](https://doi.org/10.1016/j.patter.2023.100804) | A taxonomy of data leakage found in hundreds of papers; checklist for any ML claim. | Leakage taxonomy and model info sheet. | 45 |
| M17.5 | opt | **Reconciling modern machine-learning practice and the classical bias-variance trade-off**. M. Belkin, D. Hsu, S. Ma, S. Mandal, 2019. [link](https://doi.org/10.1073/pnas.1903070116) | Double descent: why bigger models can generalize better. | Whole paper. | 40 |
| M17.5 | opt | **Do ImageNet classifiers generalize to ImageNet?**. B. Recht, R. Roelofs, L. Schmidt, V. Shankar, 2019. [link](https://arxiv.org/abs/1902.10811) | A fresh test set drops accuracy 11-14%: benchmark overfitting measured. | Sections 1-3. | 40 |
| M17.5 | opt | **On calibration of modern neural networks**. C. Guo, G. Pleiss, Y. Sun, K. Q. Weinberger, 2017. [link](https://arxiv.org/abs/1706.04599) | Confident is not correct; reliability diagrams and temperature scaling. | Sections 1-4. | 40 |
| M17.6 | core | **Deep residual learning for image recognition**. K. He, X. Zhang, S. Ren, J. Sun, 2016. [link](https://arxiv.org/abs/1512.03385) | Residual connections made depth trainable; present in every modern network. | Sections 1, 3, 4.1. | 45 |
| M17.6 | opt | **Gradient-based learning applied to document recognition**. Y. LeCun, L. Bottou, Y. Bengio, P. Haffner, 1998. [link](https://doi.org/10.1109/5.726791) $ | CNNs deployed in practice (LeNet) and the end-to-end training argument. | Sections I-II. | 60 |
| M17.7 | core | **Attention is all you need**. A. Vaswani et al., 2017. [link](https://arxiv.org/abs/1706.03762) | The transformer architecture behind all current language models. | Sections 3 (architecture) and 4 (why self-attention). | 60 |
| M17.7 | core | **Training language models to follow instructions with human feedback**. L. Ouyang et al., 2022. [link](https://arxiv.org/abs/2203.02155) | RLHF: how a pretrained model becomes an assistant, and what that costs. | Sections 1, 3, 5. | 60 |
| M17.7 | opt | **Language models are few-shot learners**. T. Brown et al., 2020. [link](https://arxiv.org/abs/2005.14165) | In-context learning and scale. | Sections 1-2 and 6 (limitations). | 60 |
| M17.8 | opt | **Geometric deep learning: grids, groups, graphs, geodesics, and gauges**. M. M. Bronstein, J. Bruna, T. Cohen, P. Veličković, 2021. [link](https://arxiv.org/abs/2104.13478) | Symmetry as the organizing principle of architectures (CNN, GNN, transformer). | Sections 1-3. | 90 |
| M17.11 | core | **Denoising diffusion probabilistic models**. J. Ho, A. Jain, P. Abbeel, 2020. [link](https://arxiv.org/abs/2006.11239) | The diffusion formulation behind current image and video generators. | Sections 2-3. | 60 |
| M17.12 | core | **Scaling laws for neural language models**. J. Kaplan et al., 2020. [link](https://arxiv.org/abs/2001.08361) | Loss falls as power laws in compute, data and parameters; the basis of AI investment forecasts. | Section 1 summary and Figure 1; Sections 3-4. | 60 |
| M17.12 | core | **Training compute-optimal large language models (Chinchilla)**. J. Hoffmann et al., 2022. [link](https://arxiv.org/abs/2203.15556) | Corrected the Kaplan allocation (~20 tokens per parameter); a scaling law revised by better experiments. | Sections 1-3. | 45 |
| M17.12 | core | **Understanding deep learning requires rethinking generalization**. C. Zhang, S. Bengio, M. Hardt, B. Recht, O. Vinyals, 2017. [link](https://arxiv.org/abs/1611.03530) | Networks memorize random labels; classical capacity theory does not explain generalization. | Sections 1-3. | 40 |
| M17.12 | core | **The Bitter Lesson**. R. S. Sutton, 2019. [link](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) | General methods that scale with compute beat hand-built knowledge; a key judgment heuristic (and its limits). | Whole essay (2 pp). | 10 |
| M17.12 | core | **Explaining and harnessing adversarial examples**. I. J. Goodfellow, J. Shlens, C. Szegedy, 2015. [link](https://arxiv.org/abs/1412.6572) | Small crafted inputs flip classifiers; central to ML under adversarial conditions. | Sections 1-6. | 40 |
| M17.12 | opt | **International AI Safety Report**. Y. Bengio et al., 2025. [link](https://arxiv.org/abs/2501.17805) | State of the art: an expert consensus on capabilities, risks and evidence gaps. | Executive summary and chapter 1 (capabilities). | 90 |
| M17.12 | opt | **The 2025 AI Index Report**. Stanford HAI, 2025. [link](https://hai.stanford.edu/ai-index/2025-ai-index-report) | Yearly numbers on compute, cost, benchmarks and adoption. | Top takeaways; technical performance chapter. | 60 |

## P18: Reinforcement learning (גשר: למידה מחיזוקים)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M18.2 | opt | **The theory of dynamic programming**. R. Bellman, 1954. [link](https://doi.org/10.1090/S0002-9904-1954-09848-8) | The principle of optimality from its author. | Sections 1-4. | 40 |
| M18.5 | core | **Human-level control through deep reinforcement learning**. V. Mnih et al., 2015. [link](https://doi.org/10.1038/nature14236) $ · open: [link](https://arxiv.org/abs/1312.5602) | DQN: deep RL from pixels; replay and target networks as stability fixes. | Main text and Methods. | 45 |
| M18.7 | core | **Proximal policy optimization algorithms**. J. Schulman, F. Wolski, P. Dhariwal, A. Radford, O. Klimov, 2017. [link](https://arxiv.org/abs/1707.06347) | The standard policy-gradient method, also used in RLHF. | Sections 1-3. | 30 |
| M18.7 | core | **A tour of reinforcement learning: the view from continuous control**. B. Recht, 2019. [link](https://arxiv.org/abs/1806.09460) | RL vs optimal control, judged on LQR; when model-based wins. | Sections 1-5. | 90 |
| M18.9 | core | **Mastering the game of Go without human knowledge**. D. Silver et al., 2017. [link](https://doi.org/10.1038/nature24270) $ | Self-play + search + learning at full strength; the template for later systems. | Main text. | 45 |
| M18.9 | core | **Concrete problems in AI safety**. D. Amodei et al., 2016. [link](https://arxiv.org/abs/1606.06565) | Reward hacking, side effects, distribution shift: failure modes of optimizers. | Sections 2-4, 7. | 60 |
| M18.9 | opt | **Specification gaming: the flip side of AI ingenuity**. V. Krakovna et al., 2020. [link](https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/) | Catalogue of agents satisfying the letter, not the intent. | Whole post and the examples list. | 20 |
| M18.9 | opt | **Champion-level drone racing using deep reinforcement learning**. E. Kaufmann et al., 2023. [link](https://doi.org/10.1038/s41586-023-06419-4) | State of the art: RL beating humans on a physical vehicle, and the sim-to-real gap. | Main text and limitations. | 40 |
| M18.9 | opt | **DeepSeek-R1: incentivizing reasoning capability in LLMs via reinforcement learning**. DeepSeek-AI, 2025. [link](https://arxiv.org/abs/2501.12948) | State of the art: RL on verifiable rewards producing reasoning in language models. | Sections 1-2. | 45 |

## P19: Robotics (גשר: רובוטיקה)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M19.7 | opt | **A formal basis for the heuristic determination of minimum cost paths**. P. E. Hart, N. J. Nilsson, B. Raphael, 1968. [link](https://doi.org/10.1109/TSSC.1968.300136) $ | A* and admissible heuristics. | Sections I-III. | 40 |
| M19.9 | opt | **pi0: a vision-language-action flow model for general robot control**. K. Black et al., 2024. [link](https://arxiv.org/abs/2410.24164) | State of the art: foundation models for manipulation. | Sections I, III, VI. | 45 |
| M19.10 | core | **Stanley: the robot that won the DARPA Grand Challenge**. S. Thrun et al., 2006. [link](https://doi.org/10.1002/rob.20147) $ | A full autonomy stack end to end, with what mattered (sensing, probabilistic terrain). | Sections 1-5, 9. | 75 |
| M19.10 | core | **Past, present, and future of simultaneous localization and mapping**. C. Cadena et al., 2016. [link](https://doi.org/10.1109/TRO.2016.2624754) $ · open: [link](https://arxiv.org/abs/1606.05830) | Review of SLAM: what is solved and what is not. | Sections I-III, VIII. | 90 |

## P20: Discrete mathematics (פריפריה: מתמטיקה דיסקרטית)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M20.3 | opt | **On computable numbers, with an application to the Entscheidungsproblem**. A. M. Turing, 1936. [link](https://doi.org/10.1112/plms/s2-42.1.230) $ | The Turing machine and the limits of computation. | Sections 1-3, 8. | 90 |
| M20.5 | core | **New directions in cryptography**. W. Diffie, M. E. Hellman, 1976. [link](https://doi.org/10.1109/TIT.1976.1055638) $ | Public-key cryptography from number theory; basis of all secure communications. | Sections I-III. | 45 |
| M20.5 | opt | **A method for obtaining digital signatures and public-key cryptosystems**. R. L. Rivest, A. Shamir, L. Adleman, 1978. [link](https://doi.org/10.1145/359340.359342) | RSA: modular arithmetic in practice. | Sections I-VII. | 40 |
| M20.5 | opt | **FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard**. NIST, 2024. [link](https://csrc.nist.gov/pubs/fips/203/final) | State of the art: the post-quantum replacement for RSA/ECC key exchange. | Sections 1-3 (introduction, overview). | 40 |

## P21: Algorithms (פריפריה: אלגוריתמים)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M21.7 | core | **Reducibility among combinatorial problems**. R. M. Karp, 1972. [link](https://doi.org/10.1007/978-1-4684-2001-2_9) $ | 21 NP-complete problems: how to recognize a hard problem in a requirement. | Sections 1-4 and the reduction tree. | 60 |
| M21.7 | opt | **Smoothed analysis of algorithms: why the simplex algorithm usually takes polynomial time**. D. A. Spielman, S.-H. Teng, 2004. [link](https://doi.org/10.1145/990308.990310) $ · open: [link](https://arxiv.org/abs/cs/0111050) | Worst case vs typical case; why exponential algorithms work in practice. | Introduction (Section 1). | 40 |
| M21.8 | opt | **Structured programming with go to statements**. D. E. Knuth, 1974. [link](https://doi.org/10.1145/356635.356640) | Source of 'premature optimization is the root of all evil', in its real context. | Introduction and efficiency sections. | 45 |

## P22: Computer systems (פריפריה: מערכות מחשב)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M22.1 | opt | **First Draft of a Report on the EDVAC**. J. von Neumann, 1945. [link](https://doi.org/10.1109/85.238389) $ · open: [link](https://web.mit.edu/sts.035/www/PDFs/edvac.pdf) | The stored-program architecture as first described. | Sections 1-5. | 60 |
| M22.2 | core | **A new golden age for computer architecture**. J. L. Hennessy, D. A. Patterson, 2019. [link](https://doi.org/10.1145/3282307) | End of Dennard scaling and Moore's law; why domain-specific hardware now. | Whole article (Turing lecture). | 45 |
| M22.6 | opt | **Spectre attacks: exploiting speculative execution**. P. Kocher et al., 2019. [link](https://arxiv.org/abs/1801.01203) | Performance features (speculation, caches) become security holes. | Sections I-IV. | 60 |
| M22.7 | core | **ARIANE 5 Flight 501 Failure: Report by the Inquiry Board**. J.-L. Lions et al., 1996. [link](https://www.esa.int/Newsroom/Press_Releases/Ariane_501_-_Presentation_of_Inquiry_Board_report) · open: [link](http://sunnyday.mit.edu/nasa-class/Ariane5-report.html) | Reused software, an unprotected conversion, and redundancy that failed identically. | Whole report, especially 2.2 and 3. | 40 |
| M22.7 | core | **An investigation of the Therac-25 accidents**. N. G. Leveson, C. S. Turner, 1993. [link](https://doi.org/10.1109/MC.1993.274940) $ · open: [link](http://sunnyday.mit.edu/papers/therac.pdf) | Software race conditions killed patients after hardware interlocks were removed. | Accident history and 'Causal factors'. | 75 |
| M22.7 | core | **Basic concepts and taxonomy of dependable and secure computing**. A. Avizienis, J.-C. Laprie, B. Randell, C. Landwehr, 2004. [link](https://doi.org/10.1109/TDSC.2004.2) $ | Fault, error, failure; the vocabulary of fault tolerance. | Sections 1-3, 5. | 75 |
| M22.7 | opt | **Designs, lessons and advice from building large distributed systems (LADIS keynote)**. J. Dean, 2009. [link](https://www.cs.cornell.edu/projects/ladis2009/talks/dean-keynote-ladis2009.pdf) (not reachable from the research sandbox (TLS/host down)) | 'Numbers everyone should know' latencies; back-of-envelope system design. | The latency table and the estimation examples. | 30 |
| M22.7 | opt | **The Byzantine generals problem**. L. Lamport, R. Shostak, M. Pease, 1982. [link](https://doi.org/10.1145/357172.357176) | Why 3f+1 replicas are needed against arbitrary faults. | Sections 1-4. | 45 |
| M22.7 | opt | **External Technical Root Cause Analysis: Channel File 291**. CrowdStrike, 2024. [link](https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf) | 2024: one content update crashed ~8.5M machines; a modern common-mode software failure. | Root cause and findings. | 30 |
| M22.8 | core | **Validity of the single processor approach to achieving large scale computing capabilities**. G. M. Amdahl, 1967. [link](https://doi.org/10.1145/1465482.1465560) $ | Amdahl's law: the serial fraction caps parallel speedup. | Whole paper (3 pp). | 15 |
| M22.8 | core | **Roofline: an insightful visual performance model for multicore architectures**. S. Williams, A. Waterman, D. Patterson, 2009. [link](https://doi.org/10.1145/1498765.1498785) | Compute-bound vs memory-bound from arithmetic intensity; judge any FLOPs claim. | Sections 1-4. | 40 |
| M22.8 | core | **In-datacenter performance analysis of a tensor processing unit**. N. P. Jouppi et al., 2017. [link](https://arxiv.org/abs/1704.04760) | The first major ML accelerator: systolic arrays, memory bandwidth, real workloads. | Sections 1-4, 8 (fallacies and pitfalls). | 60 |
| M22.10 | core | **Reflections on trusting trust**. K. Thompson, 1984. [link](https://doi.org/10.1145/358198.358210) | You cannot trust code you did not totally create yourself: supply-chain trust in 3 pages. | Whole lecture. | 15 |
| M22.10 | core | **Weapon Systems Cybersecurity: DOD Just Beginning to Grapple with Scale of Vulnerabilities (GAO-19-128)**. U.S. GAO, 2018. [link](https://www.gao.gov/products/gao-19-128) (exists) | Testers took control of weapon systems in development using simple tools. | Highlights and the 'test results' chapter. | 60 |
| M22.10 | opt | **Stuxnet: dissecting a cyberwarfare weapon**. R. Langner, 2011. [link](https://doi.org/10.1109/MSP.2011.67) $ | A cyber weapon with physical effect on centrifuges. | Whole article. | 30 |

## P23: Digital and wireless communication (פריפריה: תקשורת ספרתית ואלחוטית)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M23.3 | core | **Error detecting and error correcting codes**. R. W. Hamming, 1950. [link](https://doi.org/10.1002/j.1538-7305.1950.tb00463.x) $ | Distance and redundancy: the first practical codes. | Sections 1-5. | 45 |
| M23.3 | core | **Channel coding: the road to channel capacity**. D. J. Costello Jr., G. D. Forney Jr., 2007. [link](https://doi.org/10.1109/JPROC.2007.895188) $ · open: [link](https://arxiv.org/abs/cs/0611112) | 60 years from Hamming to LDPC/turbo in one review; how close we got to Shannon. | Sections I-II, V-VI. | 90 |
| M23.4 | opt | **Near Shannon limit error-correcting coding and decoding: turbo-codes**. C. Berrou, A. Glavieux, P. Thitimajshima, 1993. [link](https://doi.org/10.1109/ICC.1993.397441) $ | Iterative decoding within 0.5 dB of capacity. | Whole paper. | 30 |
| M23.5 | core | **A note on a simple transmission formula**. H. T. Friis, 1946. [link](https://doi.org/10.1109/JRPROC.1946.234568) $ | The Friis equation: the start of every link budget. | Whole note (2 pp). | 15 |
| M23.5 | opt | **Millimeter wave mobile communications for 5G cellular: it will work!**. T. S. Rappaport et al., 2013. [link](https://doi.org/10.1109/ACCESS.2013.2260813) | Measurement-based argument for mmWave; path loss and blockage in practice. | Sections I-III. | 45 |
| M23.7 | core | **End-to-end arguments in system design**. J. H. Saltzer, D. P. Reed, D. D. Clark, 1984. [link](https://doi.org/10.1145/357401.357402) | Where to put a function in a layered system; the design logic of the internet. | Whole paper. | 40 |
| M23.7 | opt | **A vision of 6G wireless systems: applications, trends, technologies, and open research problems**. W. Saad, M. Bennis, M. Chen, 2020. [link](https://doi.org/10.1109/MNET.001.1900287) $ · open: [link](https://arxiv.org/abs/1902.10265) | State of the art direction of cellular systems. | Sections I-III. | 45 |
| M23.9 | core | **Capacity of multi-antenna Gaussian channels**. E. Telatar, 1999. [link](https://doi.org/10.1002/ett.4460100604) $ | MIMO capacity grows with min(antennas): the result behind 4G/5G. | Sections 1-4. | 60 |

## P24: Modern physics: relativity and quantum (פריפריה: פיזיקה מודרנית: יחסות וקוונטים)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M24.1 | core | **Relativity in the Global Positioning System**. N. Ashby, 2003. [link](https://doi.org/10.12942/lrr-2003-1) | Special and general relativity as a 38 microseconds/day engineering correction. | Sections 1-5. | 60 |
| M24.4 | core | **Quantum computing in the NISQ era and beyond**. J. Preskill, 2018. [link](https://doi.org/10.22331/q-2018-08-06-79) | What near-term quantum computers can and cannot do; the reference for judging claims. | Sections 1-6. | 60 |
| M24.4 | opt | **Quantum error correction below the surface code threshold**. Google Quantum AI and collaborators, 2025. [link](https://doi.org/10.1038/s41586-024-08449-y) $ · open: [link](https://arxiv.org/abs/2408.13687) | State of the art: logical error falling with code distance. | Main text. | 45 |
| M24.6 | opt | **Simulating physics with computers**. R. P. Feynman, 1982. [link](https://doi.org/10.1007/BF02650179) $ | Why quantum systems need quantum computers to simulate. | Sections 1-5. | 60 |
| M24.7 | opt | **Quantum sensing**. C. L. Degen, F. Reinhard, P. Cappellaro, 2017. [link](https://doi.org/10.1103/RevModPhys.89.035002) $ · open: [link](https://arxiv.org/abs/1611.02427) | Review of quantum sensors (magnetometers, clocks); the base for judging 'quantum radar/navigation' claims. | Sections I-IV. | 90 |

## P25: Semiconductor devices and chip design (פריפריה: התקני מוליכים למחצה ותכנון שבבים)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M25.5 | core | **Cramming more components onto integrated circuits**. G. E. Moore, 1965. [link](https://doi.org/10.1109/JPROC.1998.658762) $ | Moore's law as an economic argument about cost per component, not physics. | Whole article (4 pp). | 20 |
| M25.5 | core | **Design of ion-implanted MOSFETs with very small physical dimensions**. R. H. Dennard et al., 1974. [link](https://doi.org/10.1109/JSSC.1974.1050511) $ | Dennard scaling and why its end (~2005) froze clock speeds. | Introduction and the scaling table. | 30 |
| M25.5 | opt | **International Roadmap for Devices and Systems (IRDS), latest edition**. IEEE IRDS, 2024. [link](https://irds.ieee.org/editions) | State of the art: projected device scaling (GAA, CFET, 3D). | More Moore executive summary. | 60 |
| M25.5 | opt | **There's plenty of room at the bottom**. R. P. Feynman, 1959. [link](https://doi.org/10.1109/84.128057) $ · open: [link](https://web.pa.msu.edu/people/yang/RFeynman_plentySpace.pdf) | Miniaturization limits reasoned from physics in 1959. | Whole talk. | 30 |
| M25.8 | core | **Computing's energy problem (and what we can do about it)**. M. Horowitz, 2014. [link](https://doi.org/10.1109/ISSCC.2014.6757323) $ | Energy per add vs per DRAM access (~1000x): data movement dominates. | The energy table and conclusions. | 30 |
| M25.12 | core | **The Semiconductor Supply Chain: Assessing National Competitiveness**. S. M. Khan, A. Mann, D. Peterson, 2021. [link](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/) | Who makes what in chips, and where the chokepoints are. | Executive summary and supply-chain map. | 60 |
| M25.12 | opt | **The mathematics of the Pentium division bug**. A. Edelman, 1997. [link](https://doi.org/10.1137/S0036144595293959) | Five missing table entries; how rare-input bugs escape testing. | Sections 1-4. | 40 |

## P26: Mathematical enrichment (העשרה מתמטית)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M26.3 | opt | **On the hypotheses which lie at the bases of geometry**. B. Riemann (tr. W. K. Clifford), 1873. [link](https://doi.org/10.1038/008014a0) $ | Curved space defined intrinsically; the root of general relativity. | Parts I-II. | 45 |
| M26.4 | opt | **On proof and progress in mathematics**. W. P. Thurston, 1994. [link](https://arxiv.org/abs/math/9404236) | How mathematical understanding is actually built and transmitted. | Sections 1-4. | 45 |

## P27: Systems engineering (גשר: הנדסת מערכות)

| module | lvl | item | why it matters | focus | min |
|---|---|---|---|---|---|
| M27.1 | core | **Report of the Presidential Commission on the Space Shuttle Challenger Accident (Rogers Commission), Vol. 1**. Presidential Commission, 1986. [link](https://ntrs.nasa.gov/citations/19860015255) | The O-ring: known erosion normalized, launch decision against engineers' data. | Chapters IV-VI (cause, contributing cause, 'an accident rooted in history'). | 180 |
| M27.1 | core | **Personal observations on the reliability of the Shuttle (Appendix F)**. R. P. Feynman, 1986. [link](https://www.nasa.gov/history/rogersrep/v2appf.htm) | 1 in 100 vs 1 in 100,000: engineers' vs management's risk estimates. 'Nature cannot be fooled.' | Whole appendix. | 30 |
| M27.1 | core | **Columbia Accident Investigation Board Report, Vol. 1**. CAIB, 2003. [link](https://ntrs.nasa.gov/citations/20030093634) | Foam strike as accepted risk; organizational causes repeated 17 years after Challenger. | Chapters 3 (cause), 6 (decision making), 7 (organizational causes), 8 (history as cause). | 300 |
| M27.1 | opt | **Systems Engineering Vision 2035**. INCOSE, 2021. [link](https://www.incose.org/publications/se-vision-2035) (exists) | State of the art: model-based SE, digital engineering. | Executive summary and 'current state'. | 45 |
| M27.2 | core | **How complex systems fail**. R. I. Cook, 1998. [link](https://how.complexsystems.fail/) | 18 short theses: systems run degraded, there is no root cause, safety is made by people. | All 18 points. | 15 |
| M27.3 | core | **The Hubble Space Telescope Optical Systems Failure Report (Allen Report)**. L. Allen et al., 1990. [link](https://ntrs.nasa.gov/citations/19910003124) | A misassembled null corrector passed every test; contradicting data was dismissed. Verify the verifier. | Executive summary, findings, chapters on the reflective null corrector. | 90 |
| M27.3 | core | **Joint Authorities Technical Review: Boeing 737 MAX Flight Control System**. JATR, 2019. [link](https://www.faa.gov/sites/faa.gov/files/2022-08/Final_JATR_Submittal_to_FAA_Oct_2019.pdf) | MCAS: single-sensor input, changed authority, and delegated certification. | Executive summary, findings F1-F5. | 90 |
| M27.3 | core | **Collision Between Vehicle Controlled by Developmental Automated Driving System and Pedestrian, Tempe, Arizona (NTSB/HAR-19/03)**. NTSB, 2019. [link](https://www.ntsb.gov/investigations/AccidentReports/Reports/HAR1903.pdf) | Classification flip-flopping, disabled braking, automation complacency: safety of autonomous systems. | Executive summary, analysis sec. 2, findings. | 90 |
| M27.3 | core | **Driving to Safety: How Many Miles of Driving Would It Take to Demonstrate Autonomous Vehicle Reliability?**. N. Kalra, S. M. Paddock, 2016. [link](https://www.rand.org/pubs/research_reports/RR1478.html) | Success-run statistics: hundreds of millions of miles needed; testing alone cannot prove rare-failure safety. | Whole report (short). | 40 |
| M27.3 | core | **A new accident model for engineering safer systems**. N. Leveson, 2004. [link](https://doi.org/10.1016/S0925-7535(03)00047-X) $ · open: [link](http://sunnyday.mit.edu/accidents/safetyscience-single.pdf) | STAMP: accidents as control failures, not chains of component failures. | Sections 1-4. | 75 |
| M27.3 | opt | **Autonomous vehicle safety: an interdisciplinary challenge**. P. Koopman, M. Wagner, 2017. [link](https://doi.org/10.1109/MITS.2016.2583491) $ | Why ML components break classical safety assurance (V-model, ISO 26262). | Whole article. | 40 |
| M27.4 | core | **An experimental evaluation of the assumption of independence in multiversion programming**. J. C. Knight, N. G. Leveson, 1986. [link](https://doi.org/10.1109/TSE.1986.6312924) $ | Independently written versions failed together; N-version redundancy is not independent. | Sections I, IV-VI. | 45 |
| M27.4 | core | **MIL-STD-1629A: Procedures for Performing a Failure Mode, Effects and Criticality Analysis**. U.S. DoD, 1980. [link](http://everyspec.com/MIL-STD/MIL-STD-1600-1699/MIL_STD_1629A_1556/) | The canonical FMECA procedure and worksheets. | Tasks 101 and 102. | 60 |
| M27.4 | opt | **Fault Tree Handbook with Aerospace Applications**. M. Stamatelatos et al. (NASA), 2002. [link](https://extapps.ksc.nasa.gov/reliability/Documents/Fault_Tree_Handbook_with_Aerospace_Applications_August_2002.pdf) | Fault trees, minimal cut sets and common-cause events. | Chapters 1-4 and the common-cause chapter. | 120 |
| M27.4 | opt | **The National Diet of Japan Fukushima Nuclear Accident Independent Investigation Commission: Executive Summary**. NAIIC, 2012. [link](https://www.nirs.org/wp-content/uploads/fukushima/naiic_report.pdf) | Common-cause flooding defeated redundant cooling; 'man-made' regulatory capture. | Executive summary and conclusions. | 60 |
| M27.4 | opt | **NASA Lessons Learned Information System**. NASA, 2024. [link](https://llis.nasa.gov/) | Searchable lessons per subsystem; use when writing about any program. | Search by the module topic. | 30 |
| M27.5 | core | **Common mistakes in making value trade-offs**. R. L. Keeney, 2002. [link](https://doi.org/10.1287/opre.50.6.935.357) $ | Twelve errors in weighted trade studies (e.g., weights without ranges). | All twelve mistakes. | 45 |
| M27.5 | core | **Technology Readiness Assessment Guide (GAO-20-48G)**. U.S. GAO, 2020. [link](https://www.gao.gov/products/gao-20-48g) (exists) | How TRLs are assessed and misused in acquisition. | Chapters 1-2 and the TRL table. | 90 |
| M27.5 | core | **Limits on fundamental limits to computation**. I. L. Markov, 2014. [link](https://doi.org/10.1038/nature13570) $ · open: [link](https://arxiv.org/abs/1408.3821) | Which limits are real (physics) and which are engineering habits; a model of judging limits. | Whole review. | 60 |
| M27.5 | opt | **A survey on hallucination in large language models**. L. Huang et al., 2023. [link](https://arxiv.org/abs/2311.05232) | State of the art: why AI answers are wrong and how to detect it. | Sections 1-3, 5. | 60 |

## Counts per part

| part | core | optional | core hours |
|---|---|---|---|
| P0 Gate: overview of mathematics and physics | 3 | 1 | 4.1 |
| P1 Backbone: analysis, geometry, algebra | 0 | 1 | 0.0 |
| P2 Backbone: mechanics | 0 | 1 | 0.0 |
| P3 Backbone: ODEs and oscillations | 2 | 1 | 1.6 |
| P4 Signals and linear systems | 3 | 1 | 2.8 |
| P5 Dynamics, control and state estimation | 6 | 1 | 5.5 |
| P6 Probability and statistics | 6 | 3 | 5.9 |
| P7 Information, inference, random signals | 3 | 3 | 4.7 |
| P8 Linear algebra, optimization, numerical methods | 2 | 6 | 2.5 |
| P9 Waves, EM, optics | 1 | 3 | 0.8 |
| P10 Field equations and numerical simulation | 4 | 2 | 4.2 |
| P11 Electronics | 4 | 2 | 2.4 |
| P12 Electric motors, drives, magnetic materials | 1 | 1 | 1.0 |
| P13 Thermodynamics and energy | 5 | 5 | 5.9 |
| P14 Heat transfer | 1 | 3 | 0.2 |
| P15 Fluids and aeronautics | 3 | 3 | 3.9 |
| P16 Structures and materials | 4 | 3 | 4.5 |
| P17 Machine learning and deep learning | 11 | 10 | 8.2 |
| P18 Reinforcement learning | 5 | 4 | 4.5 |
| P19 Robotics | 2 | 2 | 2.8 |
| P20 Discrete mathematics | 1 | 3 | 0.8 |
| P21 Algorithms | 1 | 2 | 1.0 |
| P22 Computer systems | 9 | 6 | 7.1 |
| P23 Digital and wireless communication | 5 | 3 | 4.2 |
| P24 Modern physics: relativity and quantum | 2 | 3 | 2.0 |
| P25 Semiconductor devices and chip design | 4 | 3 | 2.3 |
| P26 Mathematical enrichment | 0 | 2 | 0.0 |
| P27 Systems engineering | 14 | 6 | 20.2 |
