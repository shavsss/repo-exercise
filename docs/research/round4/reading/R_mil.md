# R_mil: a fixed reading list for Lanchester (open primary sources beyond the textbooks)

Round 4, reading. 2026-10-30. Data: `R_mil.json` (same folder). Host module IDs follow `round3/final/F_curriculum.json`.

## How to use it

- **Decided in advance.** Each item has a host module. Read it when that module is taught; nothing else needs searching. *Core* means you read it with the module. *Optional* means you read it only if the module raises the question, or if you are writing about it.
- **Read the focus portion only.** The hours are for the focus portion, not the whole document. Annual series (DOT&E, GAO Weapon Systems Annual Assessment, SWF, CSIS Space Threat, DoD China report) are listed once: open the latest edition when the module comes up.
- **Selection rule.** Each item must change a judgment: a classic analytic model (Lanchester, Koopman, Morse and Kimball, Hughes, Marcum, Swerling, Wilkening), an official evidence source (GAO, CBO, CRS, DOT&E, NAS), a quantitative think-tank study (RAND, CNA, CSIS, CSBA, RUSI, FOI, CNAS), a data source (SIPRI, Oryx, GCAT, ESA), or a method guide (Heuer, Berkeley Protocol, Bellingcat, Kent, ICD 203). Items already in `library/military/articles` or `doctrine` are not repeated.
- **Totals.** 110 items: 81 core and 29 optional. That is about 160.9 hours for the core items and 200.6 hours for everything. The core items are spread over 50 host modules, about 3.2 hours per host module.
- **Link checks (2026-10-30).** 75 links returned HTTP 200. 30 sit on sites that block automated fetches with HTTP 403 (gao.gov, cbo.gov, crsreports, csbaonline, dote, dni, amacad, spaceforce, some RAND). Their titles and IDs were confirmed by web search or catalog, and they open in a browser. 5 timed out from the sandbox. Each item's status is in `link_status` in the JSON.

## Gaps and rough spots

- RM items with link_status "rough" (Conflict Armament Research, CRS Red Sea Insight) point to a landing/search page.
- Fetter & Wright 2025 and OEG-51 links timed out from the sandbox.
- Year/edition of annual series (DOT&E, GAO WSAA, SWF, CSIS, DoD China) should be refreshed to the latest edition when the module is taught.
- Not included because they are not open: IISS The Military Balance (paywalled; use a library copy for OOB numbers, cite with year); Hughes 1995 NRL salvo paper (paywalled; NPS-OR-93-001 used instead); Mearsheimer 1989 / Epstein 3:1 debate (International Security, paywalled; B14 covers it); Fleeman NATO RTO-EN-018 lecture notes (no open full text found; Fleeman B13 is in the library); Engel 1954 Iwo Jima Lanchester fit (paywalled).
- Already in the library, so not repeated: 07.1 Sessler Countermeasures, 07.2 APS Boost-Phase Intercept, 06.2 Acton Hypersonic Boost-Glide, 05.1 Humphreys Spoofing, 08.1 Boyd Aerial Attack Study, 02.1 Ward STAP, 08.9 RAND MG268 Link 16, D9 ATP 3-01.81 C-UAS, D5/D6 Russian/Chinese tactics.
- Thin coverage by design: P2 radar, P3 EO/IR and P4 EW are heavy textbook parts, so they get only the classics and one handbook. P10 has no open mine-warfare or torpedo source worth the time. P11 skips M11.3-M11.5 (JMEM and weaponeering data are not open).

## P0: יסודות: הכלים המתמטיים והפיזיקליים (3 items, 7.0 h)

**RM001 · M0.5 · optional · 2.0 h**: [A Mathematical Theory of Communication](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf). C. E. Shannon, Bell System Technical Journal, 1948.  
Why: The source of channel capacity C = B log2(1+S/N); every 'jam-resistant link' or 'bandwidth vs range' claim is bounded by it.  
Focus: Part I sec. 1-2 for the idea of information; Part IV (continuous channel) sec. 24-25 for the capacity theorem and the power-limited regime. Skip the proofs.

**RM002 · M0.6 · core · 2.0 h**: [A New Approach to Linear Filtering and Prediction Problems](https://www.cs.yale.edu/homes/yry/readings/general/Kalman1960.pdf). R. E. Kalman, ASME J. Basic Engineering 82(1), 1960.  
Why: The original Kalman filter; tracking (M2.15), INS/GNSS integration (M5.8) and guidance filters all rest on it.  
Focus: Sections 1-3 (problem statement, orthogonal projection) and the summary table of the filter equations; read for where the Gaussian/linear assumptions enter.

**RM003 · M0.7 · optional · 3.0 h**: [Feedback Systems: An Introduction for Scientists and Engineers](https://www.cds.caltech.edu/~murray/books/AM08/pdf/am08-complete_22Feb09.pdf). K. J. Astrom, R. M. Murray, Princeton UP (free author PDF), 2008. *[link: timeout from sandbox; URL from publisher/search result, verify in a browser]*  
Why: Free, rigorous control text at exactly the 'why loops behave this way' level; fills gaps before autopilots (M6.2) and guidance loops.  
Focus: Ch.1 (feedback principles), ch.9-10 (loop transfer function, Nyquist, gain/phase margin). Read only where M0.7 feels thin.

## P1: השכבה הפיזית: אנטנות, התפשטות וקשר (3 items, 4.0 h)

**RM004 · M1.2 · core · 1.5 h**: [The Development of Phased-Array Radar Technology](https://archive.ll.mit.edu/publications/journal/pdf/vol12_no2/12_2devphasedarray.pdf). A. J. Fenn, D. H. Temme, W. P. Delaney, W. E. Courtney, MIT Lincoln Laboratory Journal 12(2), 2000.  
Why: 40 years of array history from the lab that built many of them; shows why cost per T/R module, not physics, decided adoption.  
Focus: Sections on element cost, solid-state T/R modules and the cost curve; the BMD and ATC case histories.

**RM005 · M1.3 · core · 1.5 h**: [ITU-R P.525 (free-space attenuation) and P.676 (attenuation by atmospheric gases)](https://www.itu.int/rec/R-REC-P.676/en). ITU-R Study Group 3, ITU, 2019.  
Why: The authoritative curves for atmospheric loss vs frequency; lets you check any 'mmWave/60 GHz' or 'W-band seeker' range claim yourself.  
Focus: P.676 Annex 2 (approximate method) and its attenuation-vs-frequency figure; P.525 is 4 pages (https://www.itu.int/rec/R-REC-P.525/en). Note the 22 GHz and 60 GHz lines.

**RM006 · M1.3 · optional · 1.0 h**: [ITU-R P.838 (rain attenuation) and P.526 (propagation by diffraction)](https://www.itu.int/rec/R-REC-P.838/en). ITU-R Study Group 3, ITU, 2005.  
Why: Rain fade and knife-edge diffraction are the two most-ignored terms in link and low-altitude radar budgets.  
Focus: P.838: the k*R^alpha model and coefficient table; P.526 (https://www.itu.int/rec/R-REC-P.526/en) sec. 4 single knife-edge.

## P2: מכ"ם (5 items, 12.5 h)

**RM007 · M2.1 · core · 4.0 h**: [Introduction to Radar Systems (lecture series, slides)](https://ocw.mit.edu/courses/res-ll-001-introduction-to-radar-systems-spring-2007/). R. M. O'Donnell, MIT OpenCourseWare / Lincoln Laboratory, 2007.  
Why: Lincoln Lab's own course: compact, numerically grounded slides that map 1:1 to M2.1-M2.16; ideal second view of each topic.  
Focus: Lectures on the radar equation, detection, CFAR, Doppler/MTI, tracking. Use as a 20-minute check per module, not cover to cover.

**RM008 · M2.2 · core · 3.0 h**: [Electronic Warfare and Radar Systems Engineering Handbook (4th ed., NAWCWD TP 8347)](https://apps.dtic.mil/sti/tr/pdf/ADA617071.pdf). Naval Air Warfare Center Weapons Division, US Navy, 2013.  
Why: The US Navy's own 'back of the envelope' handbook for radar and EW; the best open source of rule-of-thumb formulas and numbers.  
Focus: Sections 4 (radar equations), 4-4 (jamming-to-signal), 4-8/4-11 (burn-through), 5 (radar cross section), 2 (dB math). Keep as a lookup reference.

**RM009 · M2.5 · core · 1.5 h**: [Probability of Detection for Fluctuating Targets (RM-1217)](https://www.rand.org/pubs/research_memoranda/RM1217.html). P. Swerling, RAND, 1954.  
Why: Defines Swerling cases I-IV; explains why a fluctuating target costs 5-10 dB at high Pd, a common error in public range estimates.  
Focus: Case definitions and the comparison figure of required SNR vs Pd for steady vs fluctuating targets.

**RM010 · M2.10 · core · 2.0 h**: [A Statistical Theory of Target Detection by Pulsed Radar (RM-754)](https://www.rand.org/pubs/research_memoranda/RM754.html). J. I. Marcum, RAND, 1947.  
Why: The origin of Pd/Pfa curves and integration gain; every detection-range number descends from it.  
Focus: Introduction and the definitions of false-alarm number and detection probability; the integration-loss discussion. Skip the tables.

**RM011 · M2.17 · optional · 2.0 h**: [Performance Limits for Synthetic Aperture Radar, 2nd ed. (SAND2006-0821)](https://www.osti.gov/biblio/878591). A. W. Doerry, Sandia National Laboratories, 2006. *[link: timeout from sandbox; URL from publisher/search result, verify in a browser]*  
Why: Physics limits on SAR resolution, area rate and noise-equivalent sigma-zero; lets you judge commercial and military SAR claims (also M2.25, M13.11).  
Focus: The SNR/area-coverage-rate equations and the weather/frequency band discussion; the summary of fundamental limits.

## P3: EO/IR (4 items, 9.5 h)

**RM012 · M3.9 · core · 3.0 h**: [The Targeting Task Performance (TTP) Metric: A New Model for Predicting Target Acquisition Performance](https://apps.dtic.mil/sti/pdfs/ADA422493.pdf). R. H. Vollmerhausen, E. Jacobs, US Army NVESD (DTIC ADA422493), 2004.  
Why: The Army's replacement for the Johnson criteria; the basis of every 'detect/recognize/identify at X km' claim for thermal sights and drone cameras.  
Focus: Ch.1-2 (Johnson criteria and why they fail for sampled imagers), the TTP definition, and the V50 tables. Skip the experiment appendices.

**RM013 · M3.11 · core · 4.0 h**: [Search and Screening (OEG Report No. 56)](https://www.informs.org/content/download/288001/2755862/file/OEG56.pdf). B. O. Koopman, Operations Evaluation Group, US Navy, 1946.  
Why: Founding text of search theory: sweep width, random-search formula, inverse-cube law; also host for ASW search in M10.3.  
Focus: Ch.1-3 (contacts, sweep width, random search 1 - exp(-WL/A)) and ch.7 (optimal distribution of effort). OCR is rough; read the formulas carefully.

**RM014 · M3.11 · core · 1.5 h**: [Search for the Wreckage of Air France Flight AF 447](https://arxiv.org/abs/1405.4720). L. D. Stone, C. M. Keller, T. M. Kratzke, J. P. Strumpfer, Statistical Science 29(1) (arXiv:1405.4720), 2014.  
Why: Modern Bayesian search theory applied to a real case: shows how combining priors and failed searches found the wreck in a week.  
Focus: Sections 2-4: the prior, the likelihood of failed searches, and the posterior map. Note how the analysts handled a possibly failed beacon.

**RM015 · M3.13 · core · 1.0 h**: [Department of Defense Directed Energy Weapons: Background and Issues for Congress (R46925)](https://crsreports.congress.gov/product/pdf/R/R46925). K. M. Sayler et al., Congressional Research Service, 2024. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Neutral summary of HEL and HPM programs with power levels and funding; the base for any laser C-UAS / ship-defense claim.  
Focus: The program tables (power class, platform) and the 'issues' section on dwell time, atmospherics and magazine depth.

## P4: לוחמה אלקטרונית (3 items, 6.5 h)

**RM016 · M4.1 · core · 2.0 h**: [Preliminary Lessons in Conventional Warfighting from Russia's Invasion of Ukraine: February-July 2022](https://rusi.org/explore-our-research/publications/special-resources/preliminary-lessons-conventional-warfighting-russias-invasion-ukraine-february-july-2022). M. Zabrodskyi, J. Watling, O. Danylyuk, N. Reynolds, RUSI, 2022.  
Why: First open data-rich analysis of the war from inside Ukrainian staffs: EW effects on drones and comms, artillery dominance, air defense.  
Focus: The sections on electronic warfare, air defense and artillery/ISR; note which numbers come from Ukrainian sources.

**RM017 · M4.6 · core · 2.5 h**: [Statistical Theory of Passive Location Systems](https://apps.dtic.mil/sti/pdfs/ADA128346.pdf). D. J. Torrieri, US Army CM/CCM Office (DTIC ADA128346), 1983.  
Why: The standard derivation of DF and TDOA location accuracy (CEP, GDOP); lets you check claims about how fast SIGINT can locate an emitter.  
Focus: Sections on the triangulation (DF) estimator, hyperbolic (TDOA) location and the CEP approximation. Scan is rough; the IEEE AES-20(2) 1984 version is cleaner.

**RM018 · M4.16 · optional · 2.0 h**: [Winning the Airwaves: Regaining America's Dominance in the Electromagnetic Spectrum](https://csbaonline.org/research/publications/winning-the-airwaves-sustaining-americas-advantage-in-the-electronic-spectrum). B. Clark, M. Gunzinger, CSBA, 2015. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Clear statement of the 'low-signature + passive + distributed' shift in EW thinking; good background for EP and LPI.  
Focus: Ch.2 (the competition between sensors and countermeasures) and ch.3 (proposed concepts). Treat the program advocacy critically.

## P5: ניווט ו-GNSS (4 items, 5.5 h)

**RM019 · M5.5 · core · 1.5 h**: [Above Us Only Stars: Exposing GPS Spoofing in Russia and Syria](https://c4ads.org/reports/above-us-only-stars/). C4ADS, C4ADS, 2019.  
Why: How AIS and GNSS receiver data exposed nearly 10,000 spoofing incidents; a model of OSINT method applied to EW (also M14.4).  
Focus: Methodology section (how spoofing is detected from AIS tracks), and the case studies near Russian leadership sites and Khmeimim.

**RM020 · M5.5 · optional · 0.5 h**: [EASA Safety Information Bulletin 2022-02R3: GNSS Outages and Alterations](https://ad.easa.europa.eu/ad/2022-02R3). EASA, European Union Aviation Safety Agency, 2024.  
Why: Official regulator acknowledgment of wide GNSS jamming/spoofing around the Baltic, Black Sea and Middle East; shows the civil spillover.  
Focus: The affected-area list and recommended crew actions.

**RM021 · M5.6 · core · 1.5 h**: [GPS Standard Positioning Service (SPS) Performance Standard, 5th ed.](https://archive.gps.gov/technical/ps/2020-SPS-performance-standard.pdf). US Department of Defense, gps.gov, 2020.  
Why: The official, committed numbers (signal-in-space URE, availability, accuracy); the yardstick against which every degraded-GPS claim is measured.  
Focus: Sec. 3.4-3.8 (SIS accuracy, integrity, continuity, availability) and the position-domain accuracy standards. Compare committed vs typical performance.

**RM022 · M5.11 · core · 2.0 h**: [Analyzing a More Resilient National Positioning, Navigation, and Timing Capability (RR-2970)](https://www.rand.org/pubs/research_reports/RR2970.html). R. Mason et al., RAND, 2021.  
Why: Systematic comparison of alt-PNT options (eLoran, LEO PNT, terrestrial, quantum) on coverage, accuracy and cost.  
Focus: The options comparison table and the summary; skip the stakeholder sections.

## P6: טילים: דינמיקה, הנחיה ובקרה (8 items, 15.2 h)

**RM023 · M6.4 · core · 4.0 h**: [Basic Principles of Homing Guidance; Modern Homing Missile Guidance Theory and Techniques](https://jhuapl.edu/technical-digest/issues/vol-29-no-1-2010). N. F. Palumbo, R. A. Blauwkamp, J. M. Lloyd, JHU APL Technical Digest 29(1), 2010.  
Why: The clearest open treatment of PN, miss distance, zero-effort miss and optimal guidance, from the lab that designs Standard Missile guidance.  
Focus: Palumbo 'Basic Principles' (PN derivation, ZEM, adjoint miss-distance) and 'Modern Homing...' (https://jhuapl.edu/sites/default/files/2024-09/29-01-Palumbo_Homing.pdf). Also skim the issue's seeker and guidance-filter articles for M6.6.

**RM024 · M6.7 · optional · 0.7 h**: [Precision-Guided Munitions: Background and Issues for Congress (R45996)](https://crsreports.congress.gov/product/pdf/R/R45996). J. R. Hoehn, Congressional Research Service, 2021. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Inventory, guidance types (GPS/INS, laser, multimode) and procurement numbers of US PGMs; numbers for stockpile and weapon-delivery lessons.  
Focus: The guidance-type summary and the procurement tables.

**RM025 · M6.8 · core · 2.5 h**: [A Simple Model for Calculating Ballistic Missile Defense Effectiveness](https://scienceandglobalsecurity.org/archive/sgs08wilkening.pdf). D. A. Wilkening, Science & Global Security 8(2), 1999.  
Why: The standard open model linking SSPK, shoot-look-shoot, reliability and leakage to interceptor inventory; read before M7.1-M7.4.  
Focus: Sections 2-4 (the probability model, SLS, imperfect discrimination) and the NMD/TMD worked examples. Re-derive one example by hand.

**RM026 · M6.8 · core · 2.0 h**: [An Analysis of the North Korean Nodong Missile](https://scienceandglobalsecurity.org/archive/sgs04wright.pdf). D. C. Wright, T. Kadyshev, Science & Global Security 4, 1994.  
Why: Model example of reverse-engineering a missile from open data (clustered Scud engines, mass fractions, range, CEP); the method you need for any new missile.  
Focus: The modeling method: staging, burn time, drag, range-payload curve and CEP estimate; redo the rocket-equation step yourself.

**RM027 · M6.9 · core · 2.5 h**: [Modeling the Performance of Hypersonic Boost-Glide Missiles](https://scienceandglobalsecurity.org/archive/sgs28tracy.pdf). C. L. Tracy, D. Wright, Science & Global Security 28(3), 2020.  
Why: Physics-based critique showing glide vehicles lose speed to drag and stay IR-bright; judgment-changing for 'unstoppable hypersonic' claims.  
Focus: The trajectory model, the speed/range comparison with ballistic missiles, and the IR detectability section. Then read the Candler-Leyva comment and the authors' reply (SGS 31, 2023).

**RM028 · M6.9 · core · 1.5 h**: [U.S. Hypersonic Weapons and Alternatives](https://www.cbo.gov/publication/58255). CBO (C. Kramer et al.), Congressional Budget Office, 2023. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Cost-effectiveness comparison of hypersonic vs ballistic and cruise alternatives: ~1/3 more cost per missile for a capability many missions do not need.  
Focus: Summary, the cost comparison (300 missiles, 20 years), and the mission-by-mission analysis of when speed matters.

**RM029 · M6.10 · core · 1.5 h**: [National Cruise Missile Defense: Issues and Alternatives](https://www.cbo.gov/publication/56950). CBO, Congressional Budget Office, 2021. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Shows the geometry problem of low-flying cruise missiles (radar horizon, area to cover) and its cost: $75-465 billion options.  
Focus: The radar-horizon and coverage discussion and the cost-of-options table.

**RM030 · M6.12 · optional · 0.5 h**: [CSIS Missile Threat: missile database](https://missilethreat.csis.org/missile/). CSIS Missile Defense Project, CSIS, 2025.  
Why: Open, sourced reference sheets (range, payload, propulsion, status) for most ballistic and cruise missiles; the quick lookup for design-trade sanity checks.  
Focus: Use per missile when a lesson cites one; check the sources at the bottom of each sheet before quoting.

## P7: הגנה אווירית ומפני טילים, ושו"ב (13 items, 24.1 h)

**RM031 · M7.1 · core · 2.0 h**: [The Russian Air War and Ukrainian Requirements for Air Defence](https://rusi.org/explore-our-research/publications/special-resources/russian-air-war-and-ukrainian-requirements-air-defence). J. Bronk, N. Reynolds, J. Watling, RUSI, 2022.  
Why: How ground-based air defense denied Russia air superiority and how Russia adapted (low flight, stand-off, Shaheds); AMD MOEs in a real war.  
Focus: Sections on SEAD failure, Russian low-altitude tactics, and Ukrainian GBAD needs by threat class.

**RM032 · M7.4 · core · 2.5 h**: [Winning the Salvo Competition: Rebalancing America's Air and Missile Defenses](https://csbaonline.org/research/publications/winning-the-salvo-competition-rebalancing-americas-air-and-missile-defenses). M. Gunzinger, B. Clark, CSBA, 2016. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Frames AMD as a salvo/magazine and cost-exchange competition; the conceptual bridge between M7.4 and M14.1.  
Focus: Ch.2 (salvo competition and cost exchange), ch.3 (layered defense options: HPM, EW, guns). Compare numbers with Red Sea expenditures.

**RM033 · M7.4 · core · 0.7 h**: [Cost and Value in Air and Missile Defense Intercepts](https://www.csis.org/analysis/cost-and-value-air-and-missile-defense-intercepts). W. Rumbaugh, CSIS, 2024.  
Why: Argues that interceptor-vs-threat cost ratios mislead; the right comparison is value defended and cost of the alternative. Uses the Red Sea case.  
Focus: The full piece; write down the three cost metrics it distinguishes.

**RM034 · M7.4 · core · 1.5 h**: [Missile defense in the 2024 Iranian attacks on Israel (Washington Quarterly 48:2)](https://cissm.umd.edu/sites/default/files/2025-07/FetterWright_TWQ_48_2.pdf). S. Fetter, D. Wright, CISSM, University of Maryland, 2025. *[link: timeout from sandbox; URL from publisher/search result, verify in a browser]*  
Why: A physicist's analysis of the April/October 2024 salvos: what the interception claims mean, the denominator problem, interceptor use.  
Focus: Sections on the salvo composition, the claimed intercept rates and how to read them. [link timed out from the sandbox; verify in a browser]

**RM035 · M7.6 · core · 4.0 h**: [Making Sense of Ballistic Missile Defense: An Assessment of Concepts and Systems for U.S. Boost-Phase Missile Defense in Comparison to Other Alternatives](https://nap.nationalacademies.org/catalog/13189). National Research Council, National Academies Press, 2012.  
Why: The most authoritative open technical assessment of BMD: boost-phase infeasibility, the role of radar discrimination, shoot-look-shoot economics.  
Focus: Summary; ch.2 (boost-phase timelines); ch.5 (radar and discrimination); appendices on the 'shoot-look-shoot' cost model.

**RM036 · M7.8 · core · 2.0 h**: [History and the Current Status of the Russian Early-Warning System](https://scienceandglobalsecurity.org/archive/sgs10podvig.pdf). P. Podvig, Science & Global Security 10, 2002.  
Why: Detailed open history of Russian EW radars and satellites, with coverage gaps; the reference case for early-warning architecture and its strategic stakes.  
Focus: Sections on the radar network coverage and the Oko/US-KS satellite system; the coverage maps.

**RM037 · M7.9 · core · 2.5 h**: [Mosaic Warfare: Exploiting Artificial Intelligence and Autonomous Systems to Implement Decision-Centric Operations](https://csbaonline.org/research/publications/mosaic-warfare-exploiting-artificial-intelligence-and-autonomous-systems-to-implement-decision-centric-operations). B. Clark, D. Patt, H. Schramm, CSBA, 2020. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: The intellectual source of 'kill webs' and decision-centric warfare behind JADC2; know it to critique it.  
Focus: Ch.1-3: the argument against monolithic kill chains, the composability idea, and the wargame evidence offered (judge its strength).

**RM038 · M7.9 · optional · 0.7 h**: [Joint All-Domain Command and Control (JADC2) (R46725)](https://crsreports.congress.gov/product/pdf/R/R46725). J. R. Hoehn, Congressional Research Service, 2022. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Neutral summary of what JADC2 is, its service programs and its open problems (data standards, EW, cost).  
Focus: Background and 'issues for Congress'.

**RM039 · M7.10 · core · 2.0 h**: [Technical Debate over Patriot Performance in the Gulf War](https://scienceandglobalsecurity.org/archive/1999/01/technical_debate_over_patriot.html). J. D. Sullivan, D. Fenstermacher, D. Fetter, R. Ruggiero, A. Shanks, Science & Global Security 8(1), 1999.  
Why: The classic case of intercept claims collapsing under evidence (claims of ~80% vs evidence of few warhead kills); the template for reading every later claim.  
Focus: How 'intercept' was defined, what video evidence can and cannot show, and the role of the scoring criteria.

**RM040 · M7.10 · core · 0.7 h**: [Operation Desert Storm: Data Does Not Exist to Conclusively Say How Well Patriot Performed (NSIAD-92-340)](https://www.gao.gov/products/nsiad-92-340). GAO, US GAO, 1992. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: GAO on why the Army's Patriot claims could not be verified; a short, sharp lesson in test-evidence standards.  
Focus: Results in brief and the section on the Army's evidence categories.

**RM041 · M7.10 · core · 3.0 h**: [DOT&E Annual Report (latest: FY2025, March 2026): BMDS and AMD program sections](https://www.dote.osd.mil/annualreport/). Director, Operational Test and Evaluation, US DoD, 2026. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: The only open source that grades major weapons against operational test evidence; teaches what 'operationally effective and suitable' means in practice.  
Focus: The Missile Defense Agency (BMDS/GMD/THAAD/Aegis) sections and 2-3 programs you study (e.g., IBCS, SM-6, F-35). Read the 'Assessment' paragraphs. Older years were briefly removed from the site in 2026; archived copies via USNI News.

**RM042 · M7.10 · optional · 0.5 h**: [Patriot Missile Defense: Software Problem Led to System Failure at Dhahran (IMTEC-92-26)](https://www.gao.gov/products/imtec-92-26). GAO, US GAO, 1992. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: The clock-drift range-gate error (0.34 s after 100 h) that killed 28 soldiers; the classic example of an operational-use assumption breaking a system.  
Focus: The technical explanation of the timing error and the range-gate shift.

**RM043 · M7.10 · optional · 2.0 h**: [Statistics, Testing, and Defense Acquisition: New Approaches and Methodological Improvements](https://nap.nationalacademies.org/catalog/6037). National Research Council, National Academies Press, 1998.  
Why: How few test shots support (or don't) a reliability claim; the open source for the 'few-shot statistics' item in M7.10.  
Focus: Ch.3 (statistical issues in operational testing) and the success-run/confidence discussion.

## P8: פלטפורמות אוויר ואוויוניקה (6 items, 12.0 h)

**RM044 · M8.1 · core · 4.0 h**: [Gulf War Air Power Survey, Vol. II: Operations and Effects and Effectiveness](https://apps.dtic.mil/sti/pdfs/ADA279742.pdf). E. A. Cohen (dir.), T. A. Keaney et al., US Air Force, 1993.  
Why: The most rigorous open air-campaign effectiveness study: Scud hunt failure, BDA problems, PGM vs unguided effects.  
Focus: Part II 'Effects and Effectiveness': the Scud-hunt chapter and the strategic-target chapters; the Summary Report (Keaney & Cohen) gives the overview.

**RM045 · M8.3 · core · 2.0 h**: [Trends in Air-to-Air Combat: Implications for Future Air Superiority](https://csbaonline.org/research/publications/trends-in-air-to-air-combat-implications-for-future-air-superiority). J. Stillion, CSBA, 2015. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Data on 1965-2010 air-to-air kills: share of BVR kills, role of situational awareness, decline of dogfights. Changes intuition from Top Gun to sensors.  
Focus: The kill-data charts (WVR vs BVR, by war) and the argument on range/endurance; check how 'kills' were counted.

**RM046 · M8.4 · core · 1.0 h**: [Report of the Defense Science Board Task Force on Patriot System Performance: Report Summary](https://www.govinfo.gov/content/pkg/GOVPUB-D-PURL-LPS66633/pdf/GOVPUB-D-PURL-LPS66633.pdf). Defense Science Board, US DoD, 2005.  
Why: 2003 Patriot fratricides (Tornado, F/A-18): how IFF, ROE and automation interacted; the canonical combat-ID lesson.  
Focus: The whole summary (short): combat-ID findings and the automation/operator-trust discussion.

**RM047 · M8.8 · optional · 1.0 h**: [Air Power Survey data on losses: see GWAPS Vol. V Statistical Compendium](https://media.defense.gov/2010/Sep/27/2001329816/-1/-1/0/gulf_war_air_power_survey-vol5.pdf). US Air Force, US Air Force, 1993. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Sortie counts and loss data per aircraft type; lets you compute loss rates per sortie (the campaign-survivability input in Ball ch.1).  
Focus: Loss tables and sortie tables; compute losses per 1,000 sorties by type and altitude regime.

**RM048 · M8.9 · core · 2.0 h**: [Airbase Vulnerability to Conventional Cruise-Missile and Ballistic-Missile Attacks (MR-1028)](https://www.rand.org/pubs/monograph_reports/MR1028.html). J. Stillion, D. T. Orletsky, RAND, 1999.  
Why: The classic quantitative model of how many missiles close an airbase (submunitions vs parked aircraft, runway cuts).  
Focus: The attack model (CEP, submunition patterns, aircraft on ramps) and the results tables; then ask how Ukraine 2022-25 airbase strikes compare.

**RM049 · M8.9 · optional · 2.0 h**: [Sortie Generation Capacity of Embarked Airwings (CRM 98-111)](https://apps.dtic.mil/sti/tr/pdf/ADA359178.pdf). J. Jewell et al., CNA, 1998.  
Why: Measured carrier surge and sustained sortie rates and their limits (deck cycle, maintenance, aircrew); the empirical base for 'sorties per day'.  
Focus: The constraints analysis (airframe, pilots, turnaround) and the surge-vs-sustained results.

## P9: כטב"מים, רחפנים והגנה מפניהם (9 items, 10.5 h)

**RM050 · M9.3 · core · 1.0 h**: [DoD Directive 3000.09: Autonomy in Weapon Systems (2023)](https://www.esd.whs.mil/portals/54/documents/dd/issuances/dodd/300009p.pdf). US DoD, US DoD, 2023. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: The binding US policy on autonomous weapons ('appropriate levels of human judgment'); needed to write accurately about autonomy and IHL.  
Focus: Sec. 1.2 (policy), the definitions (autonomous vs semi-autonomous), and the senior review requirements.

**RM051 · M9.3 · optional · 1.5 h**: [Autonomous Weapons and Operational Risk](https://www.cnas.org/publications/reports/autonomous-weapons-and-operational-risk). P. Scharre, CNAS, 2016.  
Why: Systems-safety view of autonomy: failure modes, coupling, why fratricide risk scales; ties to the Patriot 2003 case.  
Focus: Sections on 'normal accidents' and the Patriot fratricide case study.

**RM052 · M9.7 · core · 0.5 h**: [Department of Defense Counter-Unmanned Aircraft Systems (IF11426)](https://crsreports.congress.gov/product/pdf/IF/IF11426). A. Gettinger / CRS, Congressional Research Service, 2024. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Two-page map of US C-UAS programs, organizations and technologies; pairs with doctrine D9 in the library.  
Focus: All of it; note the categories (kinetic, EW, DE) and the authority issues.

**RM053 · M9.9 · core · 2.0 h**: [Evolution Not Revolution: Drone Warfare in Russia's 2022 Invasion of Ukraine](https://www.cnas.org/publications/reports/evolution-not-revolution). S. Pettyjohn, CNAS, 2024.  
Why: Balanced, data-based assessment of drones in Ukraine: what changed, what did not, loss rates to EW, the adaptation cycle.  
Focus: Sections on FPV effectiveness and loss rates, EW countermeasure cycles, and implications. Contrast its caution with media claims.

**RM054 · M9.9 · core · 1.5 h**: [Mass Precision Strike: Designing UAV Complexes for Land Forces](https://rusi.org/explore-our-research/publications/occasional-papers/mass-precision-strike-designing-uav-complexes-land-forces). J. Watling, RUSI, 2024.  
Why: Turns Ukraine experience into force-design numbers: drones per target, hit rates, EW attrition, the mix of recon, strike and FPV.  
Focus: The numbers on sortie success and EW losses, and the recommended UAV complex structure.

**RM055 · M9.9 · core · 1.0 h**: [Drone Saturation: Russia's Shahed Campaign](https://csis-website-prod.s3.amazonaws.com/s3fs-public/2025-05/250513_Jensen_Drone_Saturations.pdf). B. Jensen, Y. Atalan, CSIS, 2025.  
Why: Launch-count data series (about 200/week mid-2024 to 1,000+/week 2025) and the logic of saturation; numbers for cost-exchange estimates.  
Focus: Charts of launches per week and interception share; note the data source (Ukrainian Air Force) and its limits.

**RM056 · M9.9 · core · 1.0 h**: [Updated Analysis of Russian Shahed-136 Deployment Against Ukraine (series)](https://isis-online.org/isis-reports/may-2025-updated-analysis-of-russian-shahed-136-deployment-against-ukraine). D. Albright et al., Institute for Science and International Security, 2025.  
Why: Hit/interception rates and production estimates (Alabuga) for Shahed/Geran; a worked example of OSINT-based production estimation (also M14.4).  
Focus: The hit-rate method and the Alabuga production-rate estimate; check the time window each figure covers.

**RM057 · M9.9 · core · 1.0 h**: [The Air and Missile War in Nagorno-Karabakh: Lessons for the Future of Strike and Defense](https://www.csis.org/analysis/air-and-missile-war-nagorno-karabakh-lessons-future-strike-and-defense). S. Shaikh, W. Rumbaugh, CSIS, 2020.  
Why: The 2020 war as a preview: TB2 and loitering munitions against unadapted air defenses; what was really new and what was poor Armenian AD.  
Focus: Full piece; list the conditions (no layered SHORAD, no EW, open terrain) that made drones decisive.

**RM058 · M9.9 · optional · 1.0 h**: [Conflict Armament Research: UAV component reports (Iranian UAVs in Ukraine 2022; Geran-2 2023)](https://www.conflictarm.com/reports/). Conflict Armament Research, CAR, 2023. *[link: rough: landing/search page, pick the specific report]*  
Why: Physical teardown evidence: components, origins, Russian localization of Shahed; shows what hardware forensics can establish.  
Focus: Search the reports page for the Shahed/Geran dispatches; read component tables and method notes. [rough: no single stable report URL chosen]

## P10: מערכות ימיות (4 items, 6.7 h)

**RM059 · M10.3 · core · 3.0 h**: [Antisubmarine Warfare in World War II (OEG Report No. 51)](https://www.ibiblio.org/hyperwar/USN/rep/ASW-51/index.html). C. M. Sternhell, A. M. Thorndike, Operations Evaluation Group, US Navy, 1946. *[link: timeout from sandbox; URL from publisher/search result, verify in a browser]*  
Why: The original operations-research case: measured effectiveness of aircraft, radar, sonar and convoy measures against U-boats; pairs with Koopman.  
Focus: Part II (antisubmarine measures and their effectiveness): the sections on aircraft search, radar and countermeasures. [ibiblio timed out from the sandbox; verify in a browser]

**RM060 · M10.5 · core · 2.0 h**: [The Value of Warship Attributes in Missile Combat (NPS-OR-93-001) [the salvo model]](https://archive.org/details/valueofwarshipat00hugh). W. P. Hughes Jr., Naval Postgraduate School, 1992.  
Why: The open report version of Hughes' salvo equations (Naval Research Logistics 1995): offensive power, defensive power, staying power, and why missile combat is unstable.  
Focus: The salvo equations, the definition of staying power, and the parametric results showing first-strike advantage. Also used in M14.1.

**RM061 · M10.5 · core · 1.0 h**: [Navy Shipboard Lasers: Background and Issues for Congress (R44175)](https://crsreports.congress.gov/product/pdf/R/R44175). R. O'Rourke, Congressional Research Service, 2025. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Neutral status of HELIOS, ODIN, LWSD and the deep-magazine/low-cost-per-shot argument; with numbers on power and range.  
Focus: Background and the 'potential advantages and limitations' section (weather, dwell time, saturation).

**RM062 · M10.5 · optional · 0.7 h**: [Navy DDG(X), Aegis and Red Sea operations: Houthi attacks and the U.S. Navy response (CRS Insight series)](https://crsreports.congress.gov/search/#/?termsToSearch=Houthi%20Red%20Sea). R. O'Rourke / CRS, Congressional Research Service, 2024. *[link: rough: landing/search page, pick the specific report]*  
Why: Official-adjacent summary of the Red Sea campaign: interceptor use, cost, magazine reload at sea. [rough: search link; choose the latest Insight]  
Focus: Interceptor counts, munitions cost, and the at-sea reloading discussion.

## P11: אפקטים של נשק ושריון (4 items, 11.0 h)

**RM063 · M11.2 · core · 2.0 h**: [Stormbreak: Fighting Through Russian Defences in Ukraine's 2023 Offensive](https://rusi.org/explore-our-research/publications/special-resources/stormbreak-fighting-through-russian-defences-ukraines-2023-offensive). J. Watling, N. Reynolds, RUSI, 2023.  
Why: Why the 2023 offensive failed: mines, ISR-strike, counter-battery and drones; data on vehicle losses and engineer breaching.  
Focus: Sections on minefields, the reconnaissance-fire cycle, and counterbattery timelines.

**RM064 · M11.6 · core · 3.0 h**: ['We Were Caught Unprepared': The 2006 Hezbollah-Israeli War](https://www.armyupress.army.mil/Portals/7/combat-studies-institute/csi-books/we-were-caught-unprepared.pdf). M. M. Matthews, US Army Combat Studies Institute, 2008. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: ATGM vs Merkava data and the doctrinal causes behind them; the background to Trophy and active protection.  
Focus: Chapters on the ground campaign and ATGM losses; the conclusions on combined arms.

**RM065 · M11.10 · core · 4.0 h**: [The Effects of Nuclear Weapons, 3rd ed.](https://www.osti.gov/biblio/6852629). S. Glasstone, P. J. Dolan (eds.), US DoD / DOE, 1977. *[link: timeout from sandbox; URL from publisher/search result, verify in a browser]*  
Why: The standard open reference on blast, thermal, radiation and EMP effects and their scaling laws (cube-root scaling).  
Focus: Ch.3 (blast), ch.7 (thermal), ch.11 (EMP) and the scaling-law sections; use the nuclear bomb effects computer idea as an exercise.

**RM066 · M11.10 · optional · 2.0 h**: [The Effects of Nuclear War](https://ota.fas.org/reports/7906.pdf). Office of Technology Assessment, US Congress OTA, 1979. *[link: exists; site blocks automated fetch (HTTP 202); title/ID confirmed by web search or known catalog]*  
Why: Four scenario-based analyses of what nuclear use does to a society; shows how to turn effects data into consequences.  
Focus: Ch.2 (effects) and Case 1 (single weapon on a city).

## P12: האויב: דוקטרינה והפעלה (7 items, 18.0 h)

**RM067 · M12.1 · core · 2.5 h**: [Bursting the Bubble: Russian A2/AD in the Baltic Sea Region: Capabilities, Countermeasures, and Implications (FOI-R--4651--SE)](https://www.foi.se/rest-api/report/FOI-R--4651--SE). R. Dalsjo, C. Berglund, M. Jonsson, Swedish Defence Research Agency (FOI), 2019.  
Why: Physics-based deflation of 'A2/AD bubble' maps: radar horizon, engagement envelopes vs low targets, real S-400 effectiveness. Judgment-changing.  
Focus: The S-400 and Iskander sections, the radar-horizon argument and the countermeasures section.

**RM068 · M12.1 · core · 1.5 h**: [Moscow's Lessons from the 1982 Lebanon Air War (R-3000)](https://www.rand.org/pubs/reports/R3000.html). B. S. Lambeth, RAND, 1984.  
Why: The Bekaa Valley SEAD as seen by Soviet analysts: drones as decoys and ELINT, integrated SEAD; the classic SEAD case.  
Focus: The account of the SAM-suppression sequence and the Soviet lessons drawn.

**RM069 · M12.1 · optional · 2.0 h**: [NATO's Air War for Kosovo: A Strategic and Operational Assessment (MR-1365)](https://www.rand.org/pubs/monograph_reports/MR1365.html). B. S. Lambeth, RAND, 2001.  
Why: How a dated Serbian IADS survived 78 days and downed an F-117 by emission control and mobility; the 'survive, don't win' AD strategy.  
Focus: The chapter on the SEAD campaign and the F-117 loss.

**RM070 · M12.3 · core · 4.0 h**: [The U.S.-China Military Scorecard: Forces, Geography, and the Evolving Balance of Power, 1996-2017 (RR-392)](https://www.rand.org/pubs/research_reports/RR392.html). E. Heginbotham et al., RAND, 2015.  
Why: Ten transparent quantitative scorecards (airbase attack, air superiority, ASUW, counterspace...) with models and assumptions shown; a template for net assessment.  
Focus: Scorecard 1 (Chinese attacks on air bases) and 2 (air superiority) in full, with their models; skim the others' conclusions.

**RM071 · M12.3 · core · 2.0 h**: [Systems Confrontation and System Destruction Warfare (RR-1708)](https://www.rand.org/pubs/research_reports/RR1708.html). J. Engstrom, RAND, 2018.  
Why: How the PLA itself thinks about war as system-vs-system destruction; necessary to read PLA writing and the D6 doctrine correctly.  
Focus: Ch.2-3: the concepts and the target systems (C2, ISR, logistics).

**RM072 · M12.3 · core · 3.0 h**: [Military and Security Developments Involving the People's Republic of China (annual, 2025 ed.)](https://media.defense.gov/2025/dec/23/2003849070/-1/-1/1/annual-report-to-congress-military-and-security-developments-involving-the-peoples-republic-of-china-2025.pdf). US Department of Defense, US DoD, 2025. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: The official annual baseline on PLA forces, missiles, space and nuclear numbers; the source most think-tank numbers trace back to.  
Focus: Chapters on PLA Rocket Force, space/counterspace, and the Taiwan contingency; record the stated numbers with their year.

**RM073 · M12.3 · optional · 3.0 h**: [The First Battle of the Next War: Wargaming a Chinese Invasion of Taiwan](https://www.csis.org/analysis/first-battle-next-war-wargaming-chinese-invasion-taiwan). M. Cancian, M. Cancian, E. Heginbotham, CSIS, 2023.  
Why: 24 iterations of an open, rules-published wargame; good for both content and (in M14.1) for judging wargames as evidence.  
Focus: Executive summary, the methodology chapter (combat results tables, sources), and the base-case results.

## P13: חלל: מסלולים, לוויינים, תקשורת לוויינית ושיגור (12 items, 19.3 h)

**RM074 · M13.1 · optional · 1.5 h**: [Spacepower: Doctrine for Space Forces (Space Capstone Publication)](https://www.spaceforce.mil/Portals/1/Space%20Capstone%20Publication_10%20Aug%202020.pdf). US Space Force, US Space Force, 2020. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: The official statement of military space missions and spacepower concepts; vocabulary for M13.1 and M13.23.  
Focus: Ch.2-4: the space domain, spacepower, and core competencies (space security, combat power projection, space mobility, information mobility, domain awareness).

**RM075 · M13.3 · core · 1.0 h**: [ESA Space Environment Report 2025](https://www.esa.int/Space_Safety/Space_Debris/ESA_Space_Environment_Report_2025). ESA Space Debris Office, ESA, 2025.  
Why: Authoritative debris and traffic statistics (objects tracked, fragmentation events, compliance); needed for any ASAT-debris argument.  
Focus: Executive summary and the trends charts (object counts by orbit, fragmentations).

**RM076 · M13.4 · core · 4.0 h**: [The Physics of Space Security: A Reference Manual](https://www.amacad.org/publication/physics-space-security). D. Wright, L. Grego, L. Gronlund, American Academy of Arts and Sciences, 2005. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Exactly the level needed: orbital mechanics, maneuver delta-v, ASAT, debris and space-based weapons physics, with numbers.  
Focus: Sec. 5-7 (orbits, maneuvering and delta-v), sec. 9-11 (ASAT interception, space-based missile defense, debris).

**RM077 · M13.6 · core · 1.5 h**: [Large Constellations of Low-Altitude Satellites: A Primer](https://www.cbo.gov/publication/58794). M. Bennett, C. Kramer, Congressional Budget Office, 2023. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: How altitude drives satellite count, cost, coverage and resilience; the analytic base for SDA tranches and Starlink-type architectures.  
Focus: The coverage/altitude figures and the cost comparison of LEO vs MEO/GEO architectures.

**RM078 · M13.6 · optional · 0.5 h**: [General Catalog of Artificial Space Objects (GCAT)](https://planet4589.org/space/gcat/). J. McDowell, planet4589.org, 2025.  
Why: The most careful open satellite/launch catalog; the source for counting constellations, launches and military satellites yourself.  
Focus: Learn the satcat and launch-log formats; do one count (e.g., Chinese military launches per year).

**RM079 · M13.10 · optional · 0.3 h**: [KA-SAT Network Cyber Attack Overview](https://news.viasat.com/blog/corporate/ka-sat-network-cyber-attack-overview). Viasat, Viasat, 2022.  
Why: The 24 Feb 2022 attack on Ukrainian SATCOM terminals: counterspace done through the ground segment; a key data point for M13.23.  
Focus: Whole note: attack vector (management network, modem wiper) and effect.

**RM080 · M13.11 · core · 0.5 h**: [National Imagery Interpretability Rating Scale (NIIRS)](https://irp.fas.org/imint/niirs.htm). IRIS / US intelligence community (FAS mirror), FAS, 1998.  
Why: The scale that links GSD to tasks (detect a car vs identify a missile type); the common language for imagery claims (also M14.4).  
Focus: The visible NIIRS 0-9 criteria and the GSD equivalences.

**RM081 · M13.12 · core · 1.0 h**: [The Recent Large Reduction in Space Launch Cost (ICES-2018-81)](https://ntrs.nasa.gov/citations/20200001093). H. W. Jones, NASA Ames, 2018.  
Why: Launch cost per kg history (factor ~20 fall); a premise behind proliferated constellations and responsive space.  
Focus: The cost-per-kg table and the reasons for the decline.

**RM082 · M13.18 · optional · 2.0 h**: [State-of-the-Art of Small Spacecraft Technology](https://www.nasa.gov/smallsat-institute/sst-soa/). NASA Small Spacecraft Systems Virtual Institute, NASA, 2024.  
Why: Current numbers for smallsat subsystems (power, propulsion, comms, ADCS); quick check for any 'cubesat can do X' claim.  
Focus: Chapters on communications, propulsion and GNC; use the tables.

**RM083 · M13.23 · core · 4.0 h**: [Global Counterspace Capabilities: An Open Source Assessment (annual)](https://swfound.org/counterspace/). B. Weeden, V. Samson (eds.), Secure World Foundation, 2025.  
Why: The reference open assessment of counterspace capabilities by country and type (DA-ASAT, co-orbital, EW, DE, cyber), with evidence ratings.  
Focus: The introduction (taxonomy and evidence standards), the China and Russia chapters, and the summary tables.

**RM084 · M13.23 · core · 2.0 h**: [Space Threat Assessment (annual; 2025 and 2026 eds.)](https://www.csis.org/programs/aerospace-security-project/projects/space-threat-assessments). C. Swope, K. Bingen, M. Young et al., CSIS Aerospace Security Project, 2026.  
Why: Annual update of counterspace developments, including the Ukraine war's GNSS/SATCOM jamming and Russian nuclear ASAT concerns.  
Focus: The 'year in review' and the Russia/China sections; compare with SWF where they differ.

**RM085 · M13.23 · optional · 1.0 h**: [A History of Anti-Satellite Programs](https://www.ucsusa.org/resources/history-anti-satellite-programs). L. Grego, Union of Concerned Scientists, 2012.  
Why: Short history of US/Soviet/Chinese ASAT programs and tests, including the 2007 debris event; the background for the SWF/CSIS annuals.  
Focus: Whole report; note the technical type of each system (DA, co-orbital, DE).

## P14: ניתוח, הערכה וכתיבה (מודולים חדשים M14.x) (25 items, 38.8 h)

**RM086 · M14.1 · core · 1.5 h**: [Aircraft in Warfare: The Dawn of the Fourth Arm](https://archive.org/details/aircraftinwarfar00lancrich). F. W. Lanchester, Constable, London, 1916.  
Why: The source of the linear and N-square laws; reading it shows how modest and conditional the original claims were.  
Focus: Chapters V and VI (the N-square law, its derivation and the Nelson/Trafalgar illustration).

**RM087 · M14.1 · core · 4.0 h**: [Methods of Operations Research (OEG Report 54; 1951 public edition)](https://catalog.hathitrust.org/Record/001474843). P. M. Morse, G. E. Kimball, OEG / MIT Press-Wiley, 1951. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: The founding OR text: measures of effectiveness, exchange rates, sweep rates, and how wartime analysts actually used data.  
Focus: Ch.1 (introduction), ch.3 (measures of effectiveness: exchange rates, constants of the operation), ch.5 (Lanchester equations). Full view on HathiTrust.

**RM088 · M14.1 · core · 1.0 h**: [The Base of Sand Problem: A White Paper on the State of Military Combat Modeling (N-3148)](https://www.rand.org/pubs/notes/N3148.html). P. K. Davis, D. Blumenthal, RAND, 1991.  
Why: The canonical critique of combat models: attrition rules without empirical base; what a model can and cannot be evidence for. Judgment-changing.  
Focus: All of it (short): the diagnosis and the proposed remedies.

**RM089 · M14.1 · core · 1.0 h**: [Why Wargaming Works](https://digital-commons.usnwc.edu/nwc-review/vol64/iss3/8/). P. P. Perla, E. D. McGrady, Naval War College Review 64(3), 2011.  
Why: The best short account of what wargames produce (insight, not prediction); needed to judge CSIS/RAND wargame claims.  
Focus: Whole article; list the kinds of claims a wargame can legitimately support.

**RM090 · M14.1 · optional · 2.0 h**: [Decision in Battle: Breakpoint Hypotheses and Engagement Termination Data (R-772)](https://apps.dtic.mil/sti/pdfs/AD0729769.pdf). R. L. Helmbold, RAND (R-772-PR; DTIC AD0729769; landing page rand.org/pubs/reports/R0772.html), 1971.  
Why: Empirical study of when battles end (casualty breakpoints); the data side that Lanchester models lack. Pairs with Base of Sand.  
Focus: The breakpoint hypotheses and the data tests; note how weak the casualty-fraction rule is.

**RM091 · M14.2 · core · 3.0 h**: [Weapon Systems Annual Assessment (GAO-25-107569; 2026 ed. also out)](https://www.gao.gov/products/gao-25-107569). GAO, US GAO, 2025. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Program-by-program cost, schedule and technology-maturity data for ~100 major programs; the base data for cost growth and TRL arguments.  
Focus: Introduction (portfolio cost/schedule trends) and 4-5 two-page program assessments you study (e.g., F-35, SM-6, NGI, LRDR).

**RM092 · M14.2 · core · 3.0 h**: [Cost Estimating and Assessment Guide (GAO-20-195G)](https://www.gao.gov/products/gao-20-195g). GAO, US GAO, 2020. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: The open standard for how a credible cost estimate is built (WBS, learning curves, risk, LCC); tells you what to ask of any cost figure.  
Focus: Ch.1-3 (characteristics of credible estimates), the learning-curve and cost-risk chapters; skip process checklists.

**RM093 · M14.2 · core · 1.5 h**: [Why Has the Cost of Fixed-Wing Aircraft Risen? (MG-696)](https://www.rand.org/pubs/monographs/MG696.html). M. V. Arena, O. Younossi, K. Brancato et al., RAND, 2008.  
Why: Decomposes aircraft cost growth (performance, materials, quantities) vs inflation; antidote to 'Augustine's law' slogans.  
Focus: The cost-escalation decomposition and the summary tables.

**RM094 · M14.2 · core · 1.0 h**: [SIPRI Military Expenditure Database (and Arms Transfers Database)](https://www.sipri.org/databases/milex). SIPRI, Stockholm International Peace Research Institute, 2025.  
Why: The standard open budget data, with a stated method; learn what is and isn't counted before quoting any 'defense budget' comparison.  
Focus: The sources-and-methods page; then compare two countries in constant USD and % GDP. Arms transfers (TIV method): https://www.sipri.org/databases/armstransfers

**RM095 · M14.2 · core · 1.5 h**: [Empty Bins in a Wartime Environment: The Challenge to the U.S. Defense Industrial Base](https://www.csis.org/analysis/empty-bins-wartime-environment-challenge-us-defense-industrial-base). S. G. Jones, CSIS, 2023.  
Why: Munition production rates vs wartime consumption (Ukraine, Taiwan wargames); the surge problem in numbers.  
Focus: The production-rate tables and the Taiwan-wargame munition consumption estimates.

**RM096 · M14.2 · optional · 1.5 h**: [Technology Readiness Assessment Guide (GAO-20-48G)](https://www.gao.gov/products/gao-20-48g). GAO, US GAO, 2020. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: TRL definitions and how GAO scores maturity; needed to read the Weapon Systems Assessment correctly.  
Focus: Ch.1-2 and the TRL definition table.

**RM097 · M14.3 · core · 0.5 h**: [The Return of Industrial Warfare](https://rusi.org/explore-our-research/publications/commentary/return-industrial-warfare). A. Vershinin, RUSI, 2022.  
Why: Short, influential piece comparing artillery shell consumption in Ukraine with Western production; the start of the munitions debate.  
Focus: Whole piece; check the consumption and production numbers against later sources.

**RM098 · M14.3 · core · 1.0 h**: [Weapon System Sustainment: Aircraft Mission Capable Goals Were Generally Not Met (GAO-23-106217)](https://www.gao.gov/products/gao-23-106217). GAO, US GAO, 2022. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Only 2 of 49 aircraft types met mission-capable goals in FY2021; readiness and sustainment costs as data, not slogans.  
Focus: The summary table of MC rates and cost per flight hour by aircraft.

**RM099 · M14.3 · core · 1.5 h**: [Meatgrinder: Russian Tactics in the Second Year of Its Invasion of Ukraine](https://rusi.org/explore-our-research/publications/special-resources/meatgrinder-russian-tactics-second-year-its-invasion-ukraine). J. Watling, N. Reynolds, RUSI, 2023.  
Why: Ukraine losing ~10,000 drones/month to EW, Russian artillery and logistics adaptation; numbers for the drone-war logistics item.  
Focus: The EW, drone and artillery-consumption sections.

**RM100 · M14.3 · optional · 2.0 h**: [The U.S. Military's Force Structure: A Primer, 2021 Update](https://www.cbo.gov/publication/57088). CBO, Congressional Budget Office, 2021. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Unit sizes, equipment and cost per unit for each service; the orders-of-magnitude table behind force and logistics estimates.  
Focus: Ch.1 (overview) and the chapters for the Army and Air Force; build a one-page table of cost per unit.

**RM101 · M14.3 · optional · 0.5 h**: [Ukraine Support Tracker](https://www.ifw-kiel.de/topics/war-against-ukraine/ukraine-support-tracker/). Kiel Institute for the World Economy, IfW Kiel, 2025.  
Why: Itemized aid commitments vs deliveries by country and system; data for stockpile and production arguments.  
Focus: Methodology note (commitment vs allocation vs delivery) and the weapons-delivery tables.

**RM102 · M14.4 · core · 4.0 h**: [Psychology of Intelligence Analysis](https://www.cia.gov/resources/csi/books-monographs/psychology-of-intelligence-analysis-2/). R. J. Heuer Jr., CIA Center for the Study of Intelligence, 1999.  
Why: The classic on cognitive bias in analysis and Analysis of Competing Hypotheses (ACH); the core of 'analytic bias' in M14.4.  
Focus: Ch.2-4 (perception, memory, strategies), ch.8 (ACH), ch.9-12 (biases). Apply ACH to one open question.

**RM103 · M14.4 · core · 1.0 h**: [A Tradecraft Primer: Structured Analytic Techniques for Improving Intelligence Analysis](https://www.cia.gov/resources/csi/static/Tradecraft-Primer-apr09.pdf). US Government (CIA), CIA, 2009.  
Why: Short catalog of techniques (key assumptions check, devil's advocacy, red team, indicators); the practical toolbox.  
Focus: All 12 techniques; pick 3 to use in your article workflow.

**RM104 · M14.4 · core · 2.0 h**: [Berkeley Protocol on Digital Open Source Investigations](https://www.ohchr.org/sites/default/files/2024-01/OHCHR_BerkeleyProtocol.pdf). UN OHCHR and UC Berkeley Human Rights Center, OHCHR, 2022.  
Why: The professional standard for collecting, preserving and verifying open-source evidence; defines what 'verified' should mean.  
Focus: Ch. on investigative process: online inquiries, preservation, verification, analysis. Skip the legal framework chapter.

**RM105 · M14.4 · core · 2.0 h**: [Bellingcat Online Investigations Toolkit](https://bellingcat.gitbook.io/toolkit). Bellingcat, Bellingcat, 2025.  
Why: Maintained guide to geolocation, satellite imagery, flight/ship tracking (ADS-B/AIS) and image verification tools.  
Focus: Sections: maps and satellites, transport (flights, ships), image/video verification. Do one geolocation exercise.

**RM106 · M14.4 · core · 1.0 h**: [Oryx: Documenting Equipment Losses (Russia / Ukraine lists and method)](https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html). S. Mitzer, J. Janovsky et al., Oryx, 2022.  
Why: The visually confirmed loss list behind most attrition claims; a lower bound with selection bias, ideal for teaching survivorship and selection bias (M14.1).  
Focus: The method notes at the top (what counts, 'visually confirmed'), then compute a loss ratio and list its biases.

**RM107 · M14.4 · core · 1.0 h**: [Problems of Estimating Military Power (P-3417)](https://www.rand.org/pubs/papers/P3417.html). A. W. Marshall, RAND, 1966.  
Why: The founder of net assessment on why counting forces misleads; still the best short text on what 'military power' estimates can mean.  
Focus: All of it (short).

**RM108 · M14.5 · core · 0.5 h**: [Words of Estimative Probability](https://www.cia.gov/resources/csi/static/Words-of-Estimative-Probability.pdf). S. Kent, CIA Studies in Intelligence, 1964.  
Why: How to express uncertainty in words readers interpret consistently; directly applicable to articles.  
Focus: Whole essay; adopt a fixed word-to-probability table for your own writing.

**RM109 · M14.5 · core · 0.5 h**: [Intelligence Community Directive 203: Analytic Standards](https://www.dni.gov/files/documents/ICD/ICD-203.pdf). ODNI, Office of the Director of National Intelligence, 2015. *[link: exists; site blocks automated fetch (HTTP 403); title/ID confirmed by web search or known catalog]*  
Why: Nine analytic tradecraft standards (sourcing, uncertainty, assumptions vs judgments, alternatives); a checklist for every article.  
Focus: Section D.6 (the analytic tradecraft standards).

**RM110 · M14.5 · optional · 0.3 h**: [Standards for High-Quality Research and Analysis](https://www.rand.org/about/standards.html). RAND, RAND, 2024.  
Why: RAND's own quality criteria; a yardstick for critiquing think-tank reports (including RAND's).  
Focus: The list of standards; turn it into a critique checklist.
