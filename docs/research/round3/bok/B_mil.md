# B_mil: independent reference map for a technical-military authority (Lanchester scope)

Date: 2026-10-30. Machine-readable map: `B_mil_map.json` (same folder). Built from external curricula and standard references, not from the app's syllabus. The syllabus was used only to set the scope and to tag each topic with the nearest Lanchester part (`lab_part`).

## 1. Goal and grading

The target reader is an authority on the technical-military core at level 2.5 with operational meaning. He should be able to derive the skeleton, estimate to 10-20%, name the limits and critique claims, and say what a result means for system and force performance. He writes articles and interviews experts. Importance is graded for that goal only:

- **K**: Key: master at full 2.5 depth (structure, derivation skeleton, limits, orders of magnitude, trade-offs, critique, operational meaning)
- **S**: Supporting: solid working use; know the result, its assumptions and how it is misused; no full derivation
- **C**: Context: conversant; vocabulary, order of magnitude, who to ask
- **N**: Not needed for this goal (engineer/implementer detail)

`op_bg` says whether a strong operational background probably already covers the subtopic (likely / partial / unlikely). `test_out` = true for K/S items rated *likely*. These are candidates for a short diagnostic test. They are not candidates for removal.

`commonly_missing` = true marks a must-know item that standard engineering textbooks and most university curricula leave out or treat thinly. These items come from think-tank, DOT&E, acquisition and OSINT practice rather than from textbooks.

## 2. Counts

603 subtopics in 139 topics and 20 domains.

| Importance | Count | Share |
|---|---|---|
| K | 318 | 53% |
| S | 212 | 35% |
| C | 37 | 6% |
| N | 36 | 6% |

Commonly missing: **127** (K: 91). Test-out candidates: **56**. With no home in the current Lanchester syllabus (`lab_part` = '-'): **51**.

The share of K is high on purpose. The map lists only what an authority needs, plus explicit *skip-lists* (the N/C items, most of them in topics named '(skip-list)'). The skip-lists cover the engineering detail that the app's books spend many pages on.

### By domain

| Domain | Subtopics | K | S | C | N | Missing | Test-out |
|---|---|---|---|---|---|---|---|
| F Foundations: the quantitative toolkit | 47 | 27 | 15 | 3 | 2 | 6 | 2 |
| AP Antennas and propagation | 17 | 8 | 7 | 1 | 1 | 1 | 1 |
| R Radar | 62 | 27 | 20 | 6 | 9 | 6 | 2 |
| EO Electro-optical and infrared sensing | 21 | 9 | 9 | 2 | 1 | 0 | 4 |
| EW Electronic warfare and electromagnetic spectrum operations | 50 | 26 | 19 | 3 | 2 | 11 | 8 |
| COM Communications, datalinks and networks | 19 | 10 | 8 | 1 | 0 | 3 | 2 |
| PNT Positioning, navigation and timing | 16 | 9 | 5 | 2 | 0 | 2 | 0 |
| MSL Missiles: propulsion, guidance, control and design | 51 | 30 | 15 | 2 | 4 | 4 | 4 |
| AMD Air and missile defense | 30 | 23 | 7 | 0 | 0 | 6 | 2 |
| C4 C4ISR, kill chains and targeting | 25 | 13 | 12 | 0 | 0 | 8 | 8 |
| SP Space systems and space warfare | 37 | 19 | 8 | 4 | 6 | 3 | 0 |
| UAS Unmanned systems and counter-UAS | 21 | 13 | 7 | 1 | 0 | 6 | 4 |
| WE Weapons effects, lethality and protection | 36 | 17 | 11 | 5 | 3 | 4 | 3 |
| SUR Platforms and survivability | 28 | 10 | 10 | 3 | 5 | 2 | 5 |
| NAV Naval and undersea warfare | 17 | 9 | 6 | 0 | 2 | 1 | 0 |
| OR Operations research and combat modeling | 50 | 25 | 22 | 2 | 1 | 11 | 0 |
| LOG Logistics, sustainment and force generation | 17 | 6 | 10 | 1 | 0 | 5 | 5 |
| ACQ Acquisition, cost, test & evaluation, industrial base, policy | 24 | 14 | 10 | 0 | 0 | 21 | 0 |
| ADV Adversary systems, doctrine and capability assessment | 14 | 11 | 3 | 0 | 0 | 6 | 2 |
| CRAFT Defense analysis craft: OSINT, claims checking and communication | 21 | 12 | 8 | 1 | 0 | 21 | 4 |

## 3. Main findings

1. **Physics textbooks miss the force-level layer of the authority's knowledge.** Skolnik, Richards, Adamy, Zarchan and SMAD give the physics. NPS OA (Search, Joint Combat Modeling, Joint Campaign Analysis, Wargaming, Cost Estimation), DAU, DOT&E and CSIS/CSBA/RAND work give the *force-level* layer, and the authority is judged on that layer: cost-exchange, magazine depth, production rates, kill-chain timing, test realism. The app's syllabus is book-driven, so it is strong on the first layer and weak on the second.
2. **There are four clusters of gaps** (lab_part '-' or thin): (a) acquisition, cost, T&E and industrial base; (b) export, publication and responsible-disclosure constraints; (c) OSINT and claims-checking craft; (d) Iran and proxy threat systems plus recent-war case studies. Without them the learner cannot write credible articles, even with perfect physics.
3. **Every domain has a 'force terms' layer.** This layer links an engineering result to an operational quantity: the radar equation to emit-and-die survivability, J/S to EW density per km of front, PN to salvo sizing, the rocket equation to stockpile and production arithmetic. Lessons should end each central result with this step. The operational meaning rule in the app already points this way, and the map lists the specific links.
4. **The skip-lists are large and match the app's heaviest page counts.** Examples: CFAR variant algebra, SAR image-formation algorithms, waveform-design mathematics, autopilot design, strapdown mechanization, spacecraft thermal, mechanisms and computers, avionics bus standards, tank powertrains, and EW microwave component design. This is where the learner's principle "do not spend time on unimportant things" saves the most time.
5. **Test-out candidates are mostly doctrine vocabulary and field practice.** Examples: F2T2EA, the targeting cycle, SEAD history, flares and DIRCM practice, shoot-and-scoot, camouflage, proxies' arsenals. The physics and arithmetic behind these items are almost never covered by operational experience, so they stay in the course.

## 4. Commonly missing must-know items


**Foundations: the quantitative toolkit**

- [K] Mental estimation to 10-20% (logs, powers of ten, rule-of-thumb constants) (Decibels and budget arithmetic; lab: P0). authority = instant sanity check of claims in interviews
- [K] Independence assumptions and their failure (correlated shots, common-mode) (Probability, noise and detection; lab: P0). most inflated Pk/leakage claims hide correlated failures
- [K] Requirements hierarchy: KPP/KSA, MOE/MOP/TPM (Systems engineering basics for analysts; lab: P7). articles must separate effectiveness from performance
- [K] Reliability, availability, maintainability (MTBF, Ao) (Systems engineering basics for analysts; lab: P7). availability often dominates delivered capability
- [K] Fermi estimation and bounding (Analyst's reasoning tools; lab: P0). central authority skill
- [K] Uncertainty propagation and ranges vs point estimates (Analyst's reasoning tools; lab: P0). honest claims

**Antennas and propagation**

- [S] Cost per T/R module and aperture economics (Phased and digital arrays; lab: P1). why some radars are rare and expensive

**Radar**

- [K] Losses budget realism (system, atmospheric, processing) (Radar principles and range equation; lab: P2). vendor ranges omit losses; analyst must add them
- [S] Stealth sustainment and cost of low observability (Target signatures (RCS); lab: P2). operational availability of LO fleets
- [K] Track quality, latency and fire-control-quality tracks (Measurements and tracking; lab: P2). sensor-to-shooter and engage-on-remote depend on it
- [K] Countermeasure/counter-countermeasure cycle and its timescales (Radar ECCM / electronic protection; lab: P4). authority must explain who leads and for how long
- [S] ML-based ATR performance and brittleness (Radar ATR and classification; lab: P2). claims of AI target recognition need skeptical evaluation
- [K] Ground-based radar survivability vs ARMs and drones (Radar in the force; lab: P2). emit-and-die problem

**Electronic warfare and electromagnetic spectrum operations**

- [K] EW reprogramming and mission data files (EW concepts and doctrine; lab: P4). threat library currency decides outcomes
- [K] Geolocation error ellipse to weapon delivery (Emitter geolocation; lab: P4). link between SIGINT and strike
- [S] Decoy realism requirements (signature fidelity in multiple bands) (Deception and decoys; lab: P4). how discriminating sensors defeat decoys
- [S] SEAD force ratios and attrition expectations (Suppression and destruction of enemy air defenses; lab: P4). cost of rolling back an IADS
- [S] EW engagement M&S levels (engineering/engagement/mission/campaign) (EW modeling, simulation, test; lab: P4). claims cite models at the wrong level
- [S] Threat simulators, ranges and hardware-in-the-loop (EW modeling, simulation, test; lab: P4). why EW performance is hard to verify
- [K] Cost per shot and magazine of directed energy (Directed energy; lab: P11). core of the cost-exchange argument
- [K] EW order of battle and density on modern fronts (EW in force terms; lab: P4). Ukraine: EW per km of front
- [K] Electromagnetic signature management of ground forces (EW in force terms; lab: P4). command posts found by emissions
- [S] Cognitive/AI-enabled EW claims and realities (EW in force terms; lab: P4). hype filter
- [S] Cost and production of EW systems vs drones (EW in force terms; lab: P4). economics of the EW-drone cycle

**Communications, datalinks and networks**

- [K] Datalink latency and message timeliness budgets (Tactical datalinks; lab: P7). sensor-to-shooter latency starts here
- [K] Fiber-optic controlled drones as EW counter (UAS and C2 links; lab: P9). current countermeasure cycle example
- [S] Cyber vulnerabilities of weapon-system networks (Networks and C2 systems; lab: P7). GAO weapon-system cyber findings

**Positioning, navigation and timing**

- [K] Effects on weapons: JDAM/GMLRS-class degradation under jamming (GNSS vulnerability; lab: P5). why 'GPS weapons stopped working' claims arise
- [C] Quantum sensors (atomic clocks, cold-atom inertial) (Inertial and alternative navigation; lab: P5). separate hype from timelines

**Missiles: propulsion, guidance, control and design**

- [K] Cost of missiles: unit cost drivers, production rate effects (Missile systems overview; lab: P6). magazine and cost-exchange depend on it
- [K] Solid rocket motor industrial base (energetics bottleneck) (Propulsion; lab: P6). production surge limits
- [K] Mixed raids (drones + cruise + ballistic) timing and composition (Missile force employment; lab: P6). Iran-Israel and Russia-Ukraine pattern
- [K] Missile stockpiles and production estimates of adversaries (Missile force employment; lab: P6). sustainability of strike campaigns

**Air and missile defense**

- [K] Correlated failures and common-mode in layered defense (AMD problem and effectiveness; lab: P7). real layered Pk is lower than product formula
- [S] Space-based interceptors debates (physics and numbers) (BMD specifics; lab: P7). absentee ratio arithmetic
- [K] Cost-exchange ratio: definitions and pitfalls (Economics and capacity; lab: P7). core public debate; misused constantly
- [K] Value-of-defended-asset framing vs cost-per-shot (Economics and capacity; lab: P7). correct framing for articles
- [K] Magazine depth, reload time and launcher count (Economics and capacity; lab: P7). decisive in Ukraine/Israel/Red Sea
- [K] Interceptor production rates and inventory depletion (Economics and capacity; lab: P7). sustainability of defense

**C4ISR, kill chains and targeting**

- [K] Kill-chain timing: time-critical targets, dwell vs latency (Kill chain/web concepts; lab: P7). key to mobile target problem
- [K] Sensor-to-shooter latency budgets end-to-end (Kill chain/web concepts; lab: P7). single biggest gap in textbooks
- [K] Processing, exploitation, dissemination (PED) bottlenecks (ISR architecture; lab: P10). analyst bottleneck, AI promise
- [K] Target location error (TLE) categories and their weapon implications (Targeting process; lab: P11). cross-links sensor and weapon
- [K] Battle damage assessment and its biases (Targeting process; lab: P11). overclaiming in every war
- [K] AI/ML for detection/targeting (e.g., Maven-class) and limits (Data fusion and AI; lab: P2). current debates
- [S] Data quality, labeling and adversarial ML (Data fusion and AI; lab: P2). why AI claims fail in field
- [K] Space-based ISR for tactical targeting (latency, tasking) (ISR platforms and capabilities; lab: P10). what space can really do for kill chains

**Space systems and space warfare**

- [K] Commercial imagery and analytics market (Space payloads and missions; lab: P13). OSINT revolution
- [K] Counterspace taxonomy: kinetic, co-orbital, directed energy, EW, cyber (Counterspace and space control; lab: P13). textbooks (SMAD) omit it
- [K] Commercial-military integration and dependency (Space economics and programs; lab: P13). Starlink, Maxar lessons

**Unmanned systems and counter-UAS**

- [K] Attritable vs exquisite: cost per effect (UAS fundamentals; lab: P9). current force-design debate
- [K] Terminal guidance autonomy (machine vision lock-on) under EW (Control, autonomy and payloads; lab: P9). current EW-autonomy cycle
- [K] Shahed-class one-way attack drones: cost, range, raid sizes (Loitering munitions and one-way attack drones; lab: P9). cost-exchange and saturation
- [K] FPV drones: kill rates, supply, operator training, EW cycle (Loitering munitions and one-way attack drones; lab: P9). Ukraine-era lesson
- [K] Mass production and supply chains of drones (Loitering munitions and one-way attack drones; lab: P9). industrial dimension
- [K] C-UAS cost-exchange and layered economics (Counter-UAS; lab: P9). defining debate

**Weapons effects, lethality and protection**

- [S] Live-fire test and evaluation of lethality (Lethality and Pk; lab: P11). how Pk numbers are validated
- [K] Top-attack threats and drone-era armor adaptations (Armor and land combat systems; lab: P11). current lesson
- [K] Ammunition consumption and production (155mm case) (Fires and counter-fire; lab: P11). industrial lesson of Ukraine
- [K] Munitions required per target set (campaign weaponeering) (Effects in force terms; lab: P11). campaign munitions demand

**Platforms and survivability**

- [K] Sortie generation rate and its drivers (Sortie generation and basing; lab: P8). airpower capacity measure
- [K] Air base attack and resilience (runway cratering, shelters, dispersal) (Sortie generation and basing; lab: P8). central to Pacific/Israel debates

**Naval and undersea warfare**

- [K] VLS reload at sea and magazine constraints (Ship defense and naval salvo warfare; lab: P10). naval sustainment

**Operations research and combat modeling**

- [S] Verification, validation and accreditation (VV&A) (Modeling philosophy; lab: ref). trust in model results
- [K] Empirical validation of Lanchester (historical battles) and limits (Attrition models; lab: ref). knowing when the model fails
- [K] Using wargames as evidence: strengths and abuses (Game theory and wargaming; lab: ref). public-wargame critique (e.g., CSIS Taiwan)
- [K] Small-sample statistics: test results with few shots (Statistics for analysts; lab: ref). interpreting T&E and combat claims
- [K] Survivorship and selection bias in combat data (Statistics for analysts; lab: ref). e.g., claims from viral videos
- [S] Dupuy QJM/TNDM and empirical combat data critique (Historical and empirical combat analysis; lab: ref). known alternative to Lanchester
- [K] Biddle's force employment theory (Historical and empirical combat analysis; lab: ref). why technology alone does not predict outcomes
- [K] Historical loss rates per day/sortie by era (Historical and empirical combat analysis; lab: ref). order-of-magnitude reference for claims
- [K] Queuing/saturation models of defenses (servers = fire channels) (AMD and strike modeling; lab: ref). fire-channel limits vs raid size
- [K] Attacker-defender cost models (who wins the marginal dollar) (AMD and strike modeling; lab: ref). cost-exchange done right
- [S] Modeling C2 delay and decision latency (Information and C2 in models; lab: ref). links to kill-chain timing

**Logistics, sustainment and force generation**

- [K] Munitions expenditure in high-intensity war vs stockpiles (Munitions and readiness; lab: ref). core current issue
- [K] Attrition and replacement of platforms and crews (Munitions and readiness; lab: ref). war sustainability
- [K] Contested logistics under long-range fires (Strategic mobility and contested logistics; lab: ref). current concern
- [S] Maintenance, spare parts and depot capacity (Strategic mobility and contested logistics; lab: ref). readiness reality
- [S] Logistics for drone/EW-heavy warfare (batteries, components) (Strategic mobility and contested logistics; lab: ref). new demand

**Acquisition, cost, test & evaluation, industrial base, policy**

- [S] Acquisition framework (DoD 5000/AAF; Israeli MAFAT/IMOD equivalents) (Acquisition process; lab: -). how systems come to be
- [K] Budget process (PPBE) and budget documents as data sources (Acquisition process; lab: -). best open data on quantities and costs
- [K] Technology and manufacturing readiness (TRL/MRL) (Acquisition process; lab: -). judge 'ready' claims
- [S] Requirements process (JCIDS) and urgent operational needs (Acquisition process; lab: -). speed vs process
- [K] Life-cycle cost: RDT&E, procurement, O&S shares (Cost analysis; lab: -). unit cost confusion in media
- [K] Unit cost definitions (flyaway, APUC, PAUC) (Cost analysis; lab: -). cost comparisons misuse
- [K] Learning curves and production-rate effects (Cost analysis; lab: -). why cost falls (or not)
- [S] Cost estimating methods (analogy, parametric, engineering) (Cost analysis; lab: -). evaluate cost claims
- [S] Inflation and currency adjustment (Cost analysis; lab: -). comparing across years/countries
- [K] DT&E vs OT&E vs LFT&E (Test and evaluation; lab: -). knowing what a test proves
- [K] Test realism: scripted tests, threat representativeness (Test and evaluation; lab: -). critiquing 'successful test' claims
- [K] Statistical confidence from limited test shots (Test and evaluation; lab: -). Pk claims from 10 shots
- [K] Combat data as evidence: claims vs verified intercepts (Test and evaluation; lab: -). war claims
- [K] Surge capacity, long-lead items, sole sources (Industrial base; lab: -). production decides long wars
- [K] Critical materials and components (rare earths, energetics, microelectronics) (Industrial base; lab: -). supply chain vulnerability
- [S] Defense industry structure (US, Europe, Israel, Russia, China) (Industrial base; lab: -). who makes what
- [S] Commercial technology spin-in and startups (Industrial base; lab: -). new entrants
- [S] ITAR/EAR and Wassenaar basics (Export and publication constraints; lab: -). what is controlled and why
- [K] MTCR thresholds (500 kg / 300 km) (Export and publication constraints; lab: -). frequently cited in missile articles
- [K] Prepublication review and military censorship; handling classified-adjacent info (Export and publication constraints; lab: -). authors' legal and ethical obligations
- [K] Mosaic effect of aggregating open info (Export and publication constraints; lab: -). responsible publication

**Adversary systems, doctrine and capability assessment**

- [K] Iranian missile and drone arsenal and production (Iran and proxy networks; lab: -). region-specific must-know not in syllabus
- [K] Proxy capabilities (Hezbollah, Houthis, Iraqi militias): rockets, drones, ASCMs (Iran and proxy networks; lab: -). operational relevance
- [S] Technology transfer channels and reverse engineering (Iran and proxy networks; lab: -). proliferation analysis
- [K] Order-of-battle estimation from open sources (Capability assessment methods; lab: -). assessing forces
- [K] Net assessment approach (Capability assessment methods; lab: -). holistic comparison
- [K] Mirror-imaging and other analytic biases (Capability assessment methods; lab: -). common error

**Defense analysis craft: OSINT, claims checking and communication**

- [K] Satellite imagery interpretation (vehicles, launchers, damage) (OSINT methods; lab: -). core OSINT skill
- [K] Geolocation and chronolocation of photos/video (OSINT methods; lab: -). verify war claims
- [K] Social media and video verification, deepfake awareness (OSINT methods; lab: -). information war
- [S] Measuring from imagery (photogrammetry, shadow lengths) and 3D modeling (OSINT methods; lab: -). missile dimension estimates
- [S] Flight/ship tracking (ADS-B, AIS) and its spoofing (OSINT methods; lab: -). activity indicators
- [S] Scientific publication and patent analysis for capability (OSINT methods; lab: -). technology intelligence
- [C] Archiving and chain-of-custody (Berkeley Protocol) (OSINT methods; lab: -). evidence integrity
- [K] Physics sanity checks of performance claims (range, speed, accuracy) (Claims checking; lab: -). the 2.5-level superpower
- [K] Interception rate and kill claim analysis (denominators, definitions) (Claims checking; lab: -). war reporting
- [S] Debris and fragment analysis for weapon identification (Claims checking; lab: -). attribution
- [K] Reading test reports and budget documents critically (Claims checking; lab: -). primary sources
- [S] Source reliability grading and triangulation (Claims checking; lab: -). intelligence practice
- [K] Structuring an analytic article: question, model, assumptions, sensitivity (Communicating analysis; lab: -). authority output
- [K] Interviewing technical experts: question design, detecting evasion (Communicating analysis; lab: -). stated goal
- [K] Explaining uncertainty and ranges to lay readers (Communicating analysis; lab: -). credibility
- [S] Visualizing technical data honestly (Communicating analysis; lab: -). charts
- [K] Ukraine 2022-: drones, EW, artillery, air defense economics (Lessons of recent wars; lab: -). current baseline
- [K] Israel 2023-25: multi-front AMD, Iran salvos, intercept stats (Lessons of recent wars; lab: -). home ground
- [K] Red Sea/Houthi campaign: naval AMD and costs (Lessons of recent wars; lab: -). naval AMD case
- [S] Nagorno-Karabakh 2020: drones vs legacy air defense (Lessons of recent wars; lab: -). precursor
- [S] Desert Storm/Kosovo/2006: classic case studies (SEAD, stealth, Scud hunt) (Lessons of recent wars; lab: -). baseline history

## 5. Test-out candidates (K/S, operational background likely covers)

- [S] Wavelength, frequency, band designations (IEEE and NATO letter bands) (F)
- [K] Radar/radio horizon (4/3 earth) (F)
- [S] Foliage, building and terrain loss (AP)
- [S] Fire-control radars and illuminators (R)
- [S] Mobility, emplacement time and radar netting (R)
- [S] Image intensifiers and night vision generations (EO)
- [S] Human perception and operator fatigue (EO)
- [K] Laser rangefinders and designators, spot size, beam divergence (EO)
- [S] Camouflage, concealment and decoys against EO (EO)
- [S] ES/EA/EP definitions; EMSO, spectrum management (EW)
- [S] Spectrum as maneuver space; EMCON (EW)
- [S] ELINT vs COMINT vs ESM roles (EW)
- [S] Jamming of GNSS and datalinks (EW)
- [S] Chaff and corner reflectors (EW)
- [K] Comms intercept and direction finding of tactical radios/phones (EW)
- [K] SEAD/DEAD concepts and history (Bekaa 1982, Desert Storm, Kosovo, Ukraine) (EW)
- [K] Electromagnetic signature management of ground forces (EW)
- [K] Line-of-sight vs SATCOM vs mesh relay control links (COM)
- [S] Cellular networks and civilian infrastructure use/exploitation (COM)
- [S] Missile classes (SAM, AAM, ASM, ASCM, LACM, BM, HGV) and mission requirements (MSL)
- [S] Bombing problem, unguided vs guided delivery errors (MSL)
- [S] Launch acceptability regions and envelopes (MSL)
- [S] Precision-guided munitions families and kit concepts (JDAM, SDB, glide kits) (MSL)
- [K] C-RAM/rocket defense: impact point prediction, selective engagement (AMD)
- [S] SHORAD and MANPADS (AMD)
- [S] F2T2EA kill chain and find/fix/finish (C4)
- [S] ISR collection disciplines (IMINT, SIGINT, MASINT, HUMINT, OSINT) (C4)
- [S] Joint targeting cycle and target development (C4)
- [S] Collateral damage estimation methodology (C4)
- [S] Dynamic targeting and time-sensitive targeting (C4)
- [S] C2 philosophies: centralized vs mission command, in a degraded spectrum (C4)
- [S] Decision cycles (OODA) and tempo quantification (C4)
- [K] Counter-ISR: camouflage, decoys, deception, emission control (C4)
- [S] UAS classes (Group 1-5), missions and trade-offs (UAS)
- [S] Payload types: EO/IR, SIGINT, EW, munitions (UAS)
- [K] Loitering munition design and kill chain (UAS)
- [S] Passive defenses (nets, cages, hardening) (UAS)
- [K] Top-attack threats and drone-era armor adaptations (WE)
- [S] Artillery and rocket systems: range, accuracy, rate (WE)
- [S] Shoot-and-scoot and survivability (WE)
- [S] Threat warning, expendables, jamming, tactics (SUR)
- [S] Fighter generations and capability discriminators (SUR)
- [S] IFF and transponders (SUR)
- [S] Air combat maneuvering energy concepts (SUR)
- [K] Armored vehicle survivability onion (don't be seen... don't be killed) (SUR)
- [S] Lines of communication, distances and transport capacity (LOG)
- [S] Fuel and ammunition as dominant tonnages (LOG)
- [S] Readiness rates, maintenance cycles (LOG)
- [S] Prepositioning and forward stocks (LOG)
- [S] Maintenance, spare parts and depot capacity (LOG)
- [S] Russian ground tactics and force structure (ADV)
- [K] Proxy capabilities (Hezbollah, Houthis, Iraqi militias): rockets, drones, ASCMs (ADV)
- [S] Source reliability grading and triangulation (CRAFT)
- [K] Ukraine 2022-: drones, EW, artillery, air defense economics (CRAFT)
- [K] Israel 2023-25: multi-front AMD, Iran salvos, intercept stats (CRAFT)
- [S] Desert Storm/Kosovo/2006: classic case studies (SEAD, stealth, Scud hunt) (CRAFT)

## 6. Skip-list (N) and context-only (C)


**N**: Maxwell's equations derivation detail (F); Z-transforms, filter design detail (F); Propagation models (ITM/Longley-Rice) detail (AP); Signal processor architectures detail (R); Weather, ATC, GPR, police radars (R); Polarimetry, compressed sensing, space-time coding detail (R); CFAR variant algebra (CA/OS/GO/SO) (R); Kalman filter matrix derivation (R); SAR image formation algorithms (RDA, PFA, backprojection) (R); Radar calibration and range-test practice (R); Waveform design math (Costas, NLFM, polyphase) (R); Sparse reconstruction / compressed sensing (R); Lab measurement of IR cameras (EO); EW operator interfaces (EW); Microwave component design (filters, mixers, amplifiers) (EW); Flight control design and actuator limits (MSL); Numerical integration methods for simulations (MSL); Strapdown mechanization equations (MSL); Missile databases/appendices memorization (MSL); Structures, mechanisms, thermal detail (SP); Spacecraft computer architecture detail (SP); Mechanisms and deployables (SP); Thermal control design (SP); Planetary data appendices (SP); Inflatable structures (SP); Nuclear weapon design detail (WE); Hydrocode and penetration mechanics equations (WE); Explosive chemistry detail (WE); FMS and air traffic management (SUR); Avionics bus standards (1553, ARINC, Fibre Channel) detail (SUR); Vehicle management systems (fuel, hydraulics) (SUR); Displays technology detail (SUR); Tank powertrain and suspension detail (SUR); Transducer and array design detail (NAV); Detailed ray-tracing computation (NAV); Nonlinear optimization detail (OR)

**C**: Order statistics and extreme values (F); Stability margins (F); MBSE and digital engineering (F); Polarization diversity (AP); RCS measurement and prediction (ranges, CEM) (R); Clutter statistics (K, Weibull, log-normal) (R); MIMO and cognitive radar (R); FOPEN radar (R); Transmitter tube types and modulators (R); Receiver/exciter design, ADC dynamic range (R); Focal-plane arrays, NUC, ROIC (EO); Lidar (EO); Detailed spherical-trig EW geometry problems (EW); Solved-problem banks (EW 101 exercises) (EW); DRFM hardware internals (bits, latency) (EW); Crypto, key management and COMSEC basics (COM); Receiver acquisition and tracking loops (PNT); Quantum sensors (atomic clocks, cold-atom inertial) (PNT); Airframe transfer functions, three-loop autopilot (MSL); Gimbal and seeker stabilization loops detail (MSL); ADCS and pointing (SP); Onboard processing and edge computing (SP); Launch site and range operations (SP); Manufacturing and integration process detail (SP); Launch and recovery (UAS); Interior ballistics: chamber pressure, muzzle velocity (WE); Insensitive munitions (WE); Mobility: power-to-weight, ground pressure (WE); Tank history and design generations (WE); Tank history pre-1945 detail (WE); Battle damage repair (SUR); Avionics architecture and data buses (SUR); HUD/HMD and cueing (SUR); Search against moving targets and datum search (OR); Commercial/government combat sims (JTLS, OneSAF, AFSIM, STORM) (OR); Wallenstein to Napoleon: living off the land (LOG); Archiving and chain-of-custody (Berkeley Protocol) (CRAFT)


## 7. Full map (K items in bold)


### F Foundations: the quantitative toolkit

- **Decibels and budget arithmetic** (lab P0; evidence: ADAMY, CRAN_MESE, NPSEW)
  - [K] **dB, dBm, dBW, dBi, dBsm and dB-Hz conversions**: every RF claim is a dB budget; fluency is the entry ticket
  - [K] **Link budget bookkeeping (gains, losses, margins)**: the universal template for radar, EW, comms, GNSS
  - [K] **Fourth-power vs square-law scaling (radar vs one-way)**: explains why jammers out-shout radars and range barely moves with power
  - [K] **Mental estimation to 10-20% (logs, powers of ten, rule-of-thumb constants)** `missing`: authority = instant sanity check of claims in interviews
  - [K] **Noise power kTB and noise figure**: sets every sensitivity number
- **Electromagnetic waves** (lab P0; evidence: NPS533, CRAN_MESE, SKOL)
  - [S] Wavelength, frequency, band designations (IEEE and NATO letter bands) `test-out`: operators know bands by name; must map to physics
  - [K] **Plane waves, power density, inverse-square law**: basis of all range equations
  - [S] Polarization (linear, circular, cross-pol): matters for jamming, clutter, antenna mismatch
  - [K] **Reflection, refraction, diffraction, scattering regimes (Rayleigh/resonance/optical)**: explains RCS vs frequency and why low-band radars see stealth
  - [S] Atmospheric and rain attenuation vs frequency: drives band choice and weather limits
  - [N] Maxwell's equations derivation detail: engineer-level; not needed to judge systems
- **Signals and spectra** (lab P0; evidence: RICH, CRAN_MESE, NPS533)
  - [K] **Fourier transform intuition: time-bandwidth duality**: resolution = 1/bandwidth governs radar, comms, ELINT
  - [S] Convolution and linear filtering: needed to read matched-filter and imaging arguments
  - [K] **Sampling theorem, aliasing, ambiguity of sampled measurements**: PRF ambiguities, digital receivers, Doppler folding
  - [S] Windowing and sidelobes: sidelobes = clutter leakage and jamming entry
  - [S] DFT/FFT processing gain: coherent integration gain arguments
  - [S] Modulation basics (AM/FM/PM, I/Q): understanding receivers and DRFM
  - [N] Z-transforms, filter design detail: implementation level
- **Probability, noise and detection** (lab P0; evidence: RICH, SKOL, NPS360, CRAN_MESE)
  - [K] **Random variables, distributions (Gaussian, Rayleigh, exponential, Poisson, binomial)**: all Pd/Pk/attrition models rest on these
  - [K] **Detection as hypothesis test: Pd, Pfa, ROC**: central to radar, sonar, IR, ESM claims
  - [K] **SNR required for given Pd/Pfa (Albersheim/Shnidman level)**: lets one turn a range claim into a check
  - [K] **Independence assumptions and their failure (correlated shots, common-mode)** `missing`: most inflated Pk/leakage claims hide correlated failures
  - [K] **Bayes' rule and base rates (false alarms, classification)**: ATR, IFF, intelligence assessment
  - [S] Random processes, power spectral density: noise jamming and clutter spectra
  - [C] Order statistics and extreme values: CFAR and leakage tails
- **Estimation and measurement accuracy** (lab P0; evidence: RICH, KAPL, ZARCH)
  - [K] **Least squares and error propagation**: geolocation, tracking, navigation accuracy
  - [K] **Cramer-Rao bound idea: accuracy ~ resolution / sqrt(SNR)**: one formula checks most accuracy claims
  - [K] **Dilution of precision / geometry of measurements**: GNSS, TDOA, triangulation all share it
  - [K] **Error ellipses, CEP vs sigma conversions**: targeting and weapon accuracy language
  - [S] Bias vs random error; calibration: systematic errors dominate real systems
- **Control and dynamics basics** (lab P0; evidence: CRAN_GWS, ZARCH, NPS533)
  - [K] **Feedback loops, time constants, bandwidth**: guidance time constant drives miss distance
  - [S] Transfer functions and frequency response (Bode level): needed to read autopilot and tracking-loop arguments
  - [C] Stability margins: awareness
  - [S] State-space representation: Kalman filter and modern guidance language
- **Geometry, coordinates and time** (lab P0; evidence: KAPL, SMAD, ADAMY)
  - [S] Earth models, ECEF/ENU/geodetic frames: navigation and targeting coordinates
  - [K] **Radar/radio horizon (4/3 earth)** `test-out`: low-altitude penetration and cruise-missile detection
  - [S] Spherical trigonometry for bearing/range on Earth: EW geolocation and long-range engagements
  - [S] Time systems (UTC, GPS time) and synchronization: TDOA, networks, fires timing
- **Systems engineering basics for analysts** (lab P7; evidence: SE, DAU, BOORD)
  - [K] **Requirements hierarchy: KPP/KSA, MOE/MOP/TPM** `missing`: articles must separate effectiveness from performance
  - [K] **Trade studies and sensitivity analysis**: how to judge design choices
  - [K] **Reliability, availability, maintainability (MTBF, Ao)** `missing`: availability often dominates delivered capability
  - [S] Interfaces, integration risk and system-of-systems: integration is where programs fail
  - [C] MBSE and digital engineering: vocabulary for program interviews
- **Analyst's reasoning tools** (lab P0; evidence: RAND, NPS360)
  - [K] **Dimensional analysis and scaling laws**: fast derivation of trade-offs
  - [K] **Fermi estimation and bounding** `missing`: central authority skill
  - [K] **Sensitivity, elasticity and the 'which parameter matters' question**: article logic
  - [K] **Uncertainty propagation and ranges vs point estimates** `missing`: honest claims

### AP Antennas and propagation

- **Antenna fundamentals** (lab P1; evidence: SKOL, CRAN_MESE, ADAMY)
  - [K] **Gain, effective aperture, beamwidth ~ lambda/D**: links size, frequency and angular accuracy
  - [K] **Sidelobes and back lobes**: sidelobe jamming and ARM homing
  - [S] Antenna types (dish, horn, spiral, log-periodic, array): recognize systems from photos
  - [C] Polarization diversity: awareness
- **Phased and digital arrays** (lab P1; evidence: RICH, GTRI, CRAN_MESE)
  - [K] **Electronic steering, grating lobes, scan loss**: AESA claims and field-of-regard limits
  - [K] **AESA vs PESA: T/R modules, graceful degradation, power-aperture**: central to modern radar/EW comparisons
  - [K] **Digital beamforming and simultaneous beams**: multi-function radar timelines and EP
  - [S] GaN vs GaAs vs TWT power sources: explains generational capability jumps
  - [S] Cost per T/R module and aperture economics `missing`: why some radars are rare and expensive
- **Propagation** (lab P1; evidence: SKOL, ADAMY, CRAN_MESE)
  - [K] **Line of sight, two-ray multipath, Fresnel zones**: low-altitude detection and datalink range
  - [S] Anomalous propagation and ducting: over-sea surprises
  - [S] Ionospheric propagation (HF, OTH radar, scintillation): OTH radar and GNSS errors
  - [S] Foliage, building and terrain loss `test-out`: urban comms and FOPEN
  - [N] Propagation models (ITM/Longley-Rice) detail: tool level
- **One-way link and receiver sensitivity** (lab P1; evidence: ADAMY, NPSEW)
  - [K] **One-way link equation and free-space loss**: basis of ESM, comms, jamming
  - [K] **Receiver sensitivity: kTB + NF + required SNR**: why ESM detects radars far beyond radar range
  - [S] Dynamic range and intermodulation: receiver saturation by friendly emitters/jammers

### R Radar

- **Radar principles and range equation** (lab P2; evidence: SKOL, RICH, GTRI, NPSEW, CRAN_MESE)
  - [K] **Pulse radar basics: range, PRF, duty cycle, unambiguous range**: vocabulary of every radar discussion
  - [K] **Radar range equation (peak-power form)**: the master equation
  - [K] **Search radar equation (power-aperture, frame time)**: determines surveillance capacity
  - [S] Track radar equation (power-aperture^2 trade): fire-control sizing
  - [K] **Losses budget realism (system, atmospheric, processing)** `missing`: vendor ranges omit losses; analyst must add them
  - [K] **R^4 scaling: what doubling range costs**: key to judging claims
- **Target signatures (RCS)** (lab P2; evidence: SKOL, RICH, BALL)
  - [K] **RCS definition, dBsm, typical values by target class**: orders of magnitude for stealth debates
  - [K] **RCS vs aspect and frequency; specular vs edge/creeping**: why stealth is band- and aspect-limited
  - [S] Swerling fluctuation models and fluctuation loss: Pd realism
  - [K] **Shaping vs RAM; stealth limits at low band**: counter-stealth (VHF/UHF, bistatic, IR) arguments
  - [C] RCS measurement and prediction (ranges, CEM): awareness of how numbers are produced
  - [S] Stealth sustainment and cost of low observability `missing`: operational availability of LO fleets
- **Clutter and environment** (lab P2; evidence: RICH, SKOL, GTRI)
  - [K] **Surface and volume clutter, sigma-zero, clutter-to-noise**: look-down and littoral performance
  - [K] **Sea clutter and sea-skimmer detection**: ship defense timelines
  - [S] Rain and chaff as volume clutter: weather-limited operations
  - [C] Clutter statistics (K, Weibull, log-normal): awareness
- **Detection and signal processing** (lab P2; evidence: RICH, GTRI)
  - [K] **Matched filter and SNR = E/N0**: energy, not power, detects
  - [K] **Coherent vs non-coherent integration**: dwell time trade
  - [S] Threshold detection and CFAR: false-alarm control, CFAR capture by jammers
  - [K] **Pulse compression (LFM, phase codes), range resolution**: how low-peak radars get resolution; LPI basis
  - [S] Ambiguity function: Doppler tolerance and waveform choice
  - [K] **MTI and pulse-Doppler, blind speeds, PRF regimes (low/medium/high)**: notch exploitation by attackers
  - [S] Range-Doppler ambiguity resolution: MPRF tactics
  - [N] Signal processor architectures detail: implementation
- **Measurements and tracking** (lab P2; evidence: RICH, SKOL, ZARCH)
  - [K] **Angle measurement: monopulse, conical scan**: why some deception works and some does not
  - [S] Range and Doppler accuracy: fire-control quality
  - [K] **Kalman filter tracking, alpha-beta, motion models (IMM)**: maneuvering targets and track loss
  - [S] Data association, multi-target tracking (GNN, JPDA, MHT): saturation raids and decoys
  - [K] **Track quality, latency and fire-control-quality tracks** `missing`: sensor-to-shooter and engage-on-remote depend on it
  - [K] **Sensor fusion and multi-sensor tracking (centralized/distributed)**: CEC-type networks
- **Radar modes and system types** (lab P2; evidence: RICH, SKOL, GTRI, BOORD)
  - [K] **Multifunction phased-array radar timeline/resource management**: how saturation actually defeats radars
  - [K] **Airborne radar: look-down, PD, GMTI, STAP**: AEW&C, fighters, JSTARS-class
  - [K] **SAR/ISAR imaging, resolution, revisit**: ISR claims, space SAR
  - [S] Fire-control radars and illuminators `test-out`: SAM engagement chain
  - [S] Early warning and OTH radars: strategic warning time
  - [S] FMCW/CW radars (proximity fuzes, seekers, short range): fuzes, C-UAS radars
  - [S] MMW radars (seekers, APS, C-UAS): APS and seekers
  - [K] **Passive/bistatic radar (PCL)**: counter-stealth and covert detection claims
  - [C] MIMO and cognitive radar: emerging claims; know hype vs reality
  - [N] Weather, ATC, GPR, police radars: outside the core
  - [C] FOPEN radar: niche
  - [N] Polarimetry, compressed sensing, space-time coding detail: research-level
- **Radar ECCM / electronic protection** (lab P4; evidence: GTRI, SCHL, ADAMY)
  - [K] **EP techniques catalogue: low sidelobes, SLB/SLC, frequency agility, PRF jitter, burn-through modes**: the radar half of the EW duel
  - [S] Adaptive nulling and STAP against jamming: why some jammers fail
  - [S] Home-on-jam and passive tracking: jammer self-protection limits
  - [K] **Countermeasure/counter-countermeasure cycle and its timescales** `missing`: authority must explain who leads and for how long
- **Radar ATR and classification** (lab P2; evidence: RICH, GTRI)
  - [S] NCTR: HRR profiles, JEM, micro-Doppler: ID before engagement, drones vs birds
  - [S] ML-based ATR performance and brittleness `missing`: claims of AI target recognition need skeptical evaluation
- **Radar hardware and engineering detail (skip-list)** (lab P2; evidence: RICH, SKOL)
  - [C] Transmitter tube types and modulators: only to explain power/cost generations
  - [C] Receiver/exciter design, ADC dynamic range: awareness of digital receiver limits
  - [S] Phase noise and stability effects on MTI/PD: explains clutter-limited performance in look-down
  - [N] CFAR variant algebra (CA/OS/GO/SO): implementation detail
  - [N] Kalman filter matrix derivation: use the result, skip the algebra
  - [N] SAR image formation algorithms (RDA, PFA, backprojection): implementation detail
  - [S] InSAR and coherent change detection (what they reveal): ISR applications for OSINT
  - [N] Radar calibration and range-test practice: test-engineer detail
  - [N] Waveform design math (Costas, NLFM, polyphase): research-level
  - [N] Sparse reconstruction / compressed sensing: research-level
- **Radar in the force** (lab P2; evidence: HIST, RAND, BOORD)
  - [K] **Radar coverage diagrams and low-altitude gaps as tactical facts**: planning routes and placements
  - [K] **Ground-based radar survivability vs ARMs and drones** `missing`: emit-and-die problem
  - [S] Mobility, emplacement time and radar netting `test-out`: field practice
  - [K] **Counter-stealth architectures (low-band + IRST + passive + network)**: central stealth-era debate

### EO Electro-optical and infrared sensing

- **EO/IR fundamentals** (lab P3; evidence: DRIG, NPS533, CRAN_GWS, CRAN_MESE)
  - [K] **Spectral bands (VIS, NIR, SWIR, MWIR, LWIR) and what each sees**: sensor choice and countermeasure choice
  - [K] **Blackbody radiation, emissivity, Planck/Wien/Stefan-Boltzmann**: plume and skin signatures
  - [K] **Radiometry chain: source - atmosphere - optics - detector**: range estimates for IRST/MAWS
  - [S] Atmospheric transmission windows, MODTRAN-level awareness: weather limits
- **Optics and resolution** (lab P3; evidence: DRIG, NPS533)
  - [K] **Diffraction limit and IFOV; GSD from space**: checks imagery-resolution claims
  - [S] MTF and system blur: image quality
  - [S] Sampling and detector pitch: pixel-limited vs optics-limited
- **Detectors and sensors** (lab P3; evidence: DRIG, NPS533)
  - [K] **Detector types: InSb, HgCdTe, microbolometer, QWIP/T2SL; cooled vs uncooled**: cost, availability, export-controlled tech
  - [S] NETD, D*, noise sources: sensitivity comparisons
  - [C] Focal-plane arrays, NUC, ROIC: awareness
  - [S] Image intensifiers and night vision generations `test-out`: operators know them
- **Performance modeling** (lab P3; evidence: DRIG)
  - [K] **Johnson criteria and TTP/NV-IPM: detect/recognize/identify ranges**: ID range drives ROE and fratricide
  - [K] **IRST detection ranges against aircraft and missiles**: counter-stealth and passive fire control
  - [S] Search with EO sensors (FOV vs FOR): soda-straw problem of ISR
  - [S] Human perception and operator fatigue `test-out`: operator-in-the-loop performance
- **Special EO systems** (lab P3; evidence: DRIG, NPS533)
  - [K] **Laser rangefinders and designators, spot size, beam divergence** `test-out`: laser-guided weapon chain
  - [S] Hyperspectral and multispectral detection: camouflage defeat, space ISR
  - [C] Lidar: awareness
  - [K] **Missile warning (UV/IR MAWS) and false alarm problem**: self-protection
  - [S] Camouflage, concealment and decoys against EO `test-out`: operators know practice
  - [N] Lab measurement of IR cameras: test-engineer detail

### EW Electronic warfare and electromagnetic spectrum operations

- **EW concepts and doctrine** (lab P4; evidence: JP, ADAMY, SCHL, NPSEW)
  - [S] ES/EA/EP definitions; EMSO, spectrum management `test-out`: doctrine vocabulary
  - [K] **EW in the kill chain (find/fix/track/target/engage/assess)**: where each EW action bites
  - [K] **EW reprogramming and mission data files** `missing`: threat library currency decides outcomes
  - [S] Spectrum as maneuver space; EMCON `test-out`: operational practice
  - [S] EW-cyber convergence (CEMA): modern doctrine
- **ES, ESM and SIGINT** (lab P4; evidence: ADAMY, SCHL, NPSEW)
  - [S] EW receiver types (crystal video, IFM, superhet, channelized, digital): why some threats are missed
  - [K] **Probability of intercept and search strategies**: LPI and scanning-search trade
  - [S] Pulse deinterleaving, PDWs, emitter ID and libraries: ambiguous/new modes
  - [S] ELINT vs COMINT vs ESM roles `test-out`: intelligence architecture
  - [K] **RWR design and limitations**: pilot experience vs physics
- **Emitter geolocation** (lab P4; evidence: ADAMY, NPSEW)
  - [K] **AOA triangulation, interferometry, accuracy vs baseline**: targeting from passive sensors
  - [K] **TDOA/FDOA and precision geolocation**: SIGINT satellites, artillery against emitters
  - [S] Single-platform passive ranging: fighters/drones locating SAMs
  - [K] **Geolocation error ellipse to weapon delivery** `missing`: link between SIGINT and strike
- **Electronic attack: jamming** (lab P4; evidence: ADAMY, SCHL, GTRI)
  - [K] **J/S equations: self-protection vs stand-off vs escort**: the core EW duel arithmetic
  - [K] **Burn-through range**: what jamming really buys
  - [K] **Noise jamming: spot, barrage, swept; power density limits**: spreading power thins it
  - [K] **Stand-in jamming and expendable jammers**: drone-enabled EW trends
  - [K] **Communications jamming geometry (jammer-to-receiver vs transmitter-to-receiver)**: why comms jamming works on the receiver end
  - [S] Jamming of GNSS and datalinks `test-out`: ubiquitous in current wars
- **Deception and decoys** (lab P4; evidence: ADAMY, SCHL)
  - [S] Range/velocity gate pull-off, inverse gain, cross-eye: how self-protection jammers break tracks
  - [K] **DRFM: coherent deception and false targets**: modern EA centerpiece
  - [S] Chaff and corner reflectors `test-out`: naval and air expendables
  - [K] **Towed and active decoys (towed RF decoys, MALD-class)**: air campaign enablers
  - [S] Decoy realism requirements (signature fidelity in multiple bands) `missing`: how discriminating sensors defeat decoys
- **IR countermeasures** (lab P4; evidence: ADAMY, DRIG, BALL)
  - [K] **Flares (conventional, spectral, kinematic) and seeker counter-countermeasures**: MANPADS survival
  - [K] **DIRCM and lasers vs IR seekers**: helicopter/transport protection
  - [S] Signature suppression (plume, skin): LO in IR
- **LPI and communications EW** (lab P4; evidence: ADAMY, SCHL)
  - [K] **Spread spectrum: DSSS, FHSS, processing gain vs jamming**: why some links survive
  - [K] **LPI radar waveforms and detectability**: ESM vs LPI duel
  - [K] **Comms intercept and direction finding of tactical radios/phones** `test-out`: emitter discipline kills (Ukraine lessons)
  - [S] Satellite link jamming (uplink vs downlink): SATCOM resilience
- **Suppression and destruction of enemy air defenses** (lab P4; evidence: JP, HIST, ADAMY, BALL)
  - [K] **SEAD/DEAD concepts and history (Bekaa 1982, Desert Storm, Kosovo, Ukraine)** `test-out`: operational core
  - [K] **Anti-radiation missiles: seekers, memory, shutdown tactics**: ARM vs emission control game
  - [K] **Integrated air defense system architecture and its seams**: where to hit
  - [S] SEAD force ratios and attrition expectations `missing`: cost of rolling back an IADS
- **EW modeling, simulation, test** (lab P4; evidence: ADAMY, DOTE)
  - [S] EW engagement M&S levels (engineering/engagement/mission/campaign) `missing`: claims cite models at the wrong level
  - [S] Threat simulators, ranges and hardware-in-the-loop `missing`: why EW performance is hard to verify
  - [N] EW operator interfaces: operators know
- **Directed energy** (lab P11; evidence: NPS533, DOTE, RAND)
  - [K] **High-energy lasers: power, beam quality, dwell time, atmospheric limits**: counter-drone hype checking
  - [S] High-power microwave weapons and EMP effects on electronics: C-swarm claims
  - [K] **Cost per shot and magazine of directed energy** `missing`: core of the cost-exchange argument
- **EW engineering detail (skip-list)** (lab P4; evidence: ADAMY, SCHL)
  - [N] Microwave component design (filters, mixers, amplifiers): engineer detail
  - [C] Detailed spherical-trig EW geometry problems: solved-exercise level
  - [C] Solved-problem banks (EW 101 exercises): practice only, not new knowledge
  - [C] DRFM hardware internals (bits, latency): know latency limits only
- **EW in force terms** (lab P4; evidence: HIST, RAND, CSBA)
  - [K] **EW order of battle and density on modern fronts** `missing`: Ukraine: EW per km of front
  - [K] **Electromagnetic signature management of ground forces** `missing` `test-out`: command posts found by emissions
  - [S] Cognitive/AI-enabled EW claims and realities `missing`: hype filter
  - [S] Cost and production of EW systems vs drones `missing`: economics of the EW-drone cycle

### COM Communications, datalinks and networks

- **Digital communications fundamentals** (lab P0; evidence: CRAN_MESE, NPSEW, ADAMY)
  - [K] **Shannon capacity and bandwidth-power trade**: limits of any datalink claim
  - [S] Modulation schemes and Eb/N0 vs BER: link margin under jamming
  - [S] Error-correcting codes and interleaving (coding gain): why links degrade gracefully or not
  - [S] Multiple access (TDMA, FDMA, CDMA, OFDM): Link 16 and LTE/5G structure
- **Tactical datalinks** (lab P7; evidence: JP, BOORD, HIST)
  - [K] **Link 16: TDMA, J-series messages, NPGs, relay, capacity**: backbone of air/missile defense C2
  - [S] Link 11/22, VMF, JREAP and gateways: coalition interoperability
  - [K] **Cooperative Engagement Capability-class composite tracking**: engage-on-remote enabler
  - [K] **Weapon datalinks (in-flight updates, terminal handover)**: mid-course guidance and retargeting
  - [S] LPI/LPD datalinks for stealth platforms (MADL, IFDL): fifth-gen networking limits
  - [K] **Datalink latency and message timeliness budgets** `missing`: sensor-to-shooter latency starts here
- **UAS and C2 links** (lab P9; evidence: CRAN_MESE, HIST)
  - [K] **Line-of-sight vs SATCOM vs mesh relay control links** `test-out`: drone operations
  - [K] **Commercial radios, FHSS hobby links and their jamming/geolocation**: FPV drone war dynamics
  - [K] **Fiber-optic controlled drones as EW counter** `missing`: current countermeasure cycle example
- **Networks and C2 systems** (lab P7; evidence: JP, RAND, CYB)
  - [S] Network-centric warfare theory and its critiques: articles must assess the concept
  - [K] **Resilience: degraded, intermittent, limited bandwidth (DIL)**: real-world C2
  - [K] **Commercial proliferated SATCOM (Starlink-class) in war**: Ukraine lesson
  - [S] Cellular networks and civilian infrastructure use/exploitation `test-out`: OSINT and targeting risk
  - [S] Cyber vulnerabilities of weapon-system networks `missing`: GAO weapon-system cyber findings
  - [C] Crypto, key management and COMSEC basics: awareness

### PNT Positioning, navigation and timing

- **GNSS principles** (lab P5; evidence: KAPL, NPSSS)
  - [K] **Pseudorange, trilateration and clock bias**: why 4 satellites; timing is central
  - [S] GPS segments, signals (L1/L2/L5, C/A, P(Y), M-code): military vs civil resilience
  - [K] **Error budget: ephemeris, clock, iono, tropo, multipath; UERE**: accuracy claims
  - [K] **DOP and constellation geometry**: urban/terrain degradation
  - [S] Other GNSS: GLONASS, Galileo, BeiDou (incl. BeiDou military): adversary independence
  - [C] Receiver acquisition and tracking loops: background for jamming tolerance
  - [S] Differential GNSS, RTK, SBAS: precision targeting
- **GNSS vulnerability** (lab P5; evidence: KAPL, HIST, ADAMY)
  - [K] **Jamming: J/S at the receiver, jammer power vs range**: ubiquitous in current wars
  - [K] **Spoofing: methods and detection**: ships and drones misled
  - [K] **Anti-jam antennas (CRPA), nulling, and their limits**: weapon resilience
  - [K] **Effects on weapons: JDAM/GMLRS-class degradation under jamming** `missing`: why 'GPS weapons stopped working' claims arise
- **Inertial and alternative navigation** (lab P5; evidence: KAPL, SIOU)
  - [K] **INS principles, drift rates by grade (nav/tactical/MEMS)**: accuracy after GNSS loss
  - [S] GNSS/INS integration (loose/tight): resilience
  - [K] **TERCOM, DSMAC, scene matching, vision-based navigation**: cruise missile and drone navigation without GPS
  - [S] Signals of opportunity, celestial, magnetic/gravity navigation, eLoran: emerging alternatives
  - [C] Quantum sensors (atomic clocks, cold-atom inertial) `missing`: separate hype from timelines

### MSL Missiles: propulsion, guidance, control and design

- **Missile systems overview** (lab P6; evidence: FLEE, CRAN_GWS, SIOU)
  - [S] Missile classes (SAM, AAM, ASM, ASCM, LACM, BM, HGV) and mission requirements `test-out`: taxonomy
  - [K] **Design drivers and measures of merit (range, speed, Pk, cost, weight, signature)**: Fleeman-style trades for evaluating weapons
  - [K] **Missile sizing rules of thumb**: sanity-check range/weight claims
  - [K] **Cost of missiles: unit cost drivers, production rate effects** `missing`: magazine and cost-exchange depend on it
- **Propulsion** (lab P6; evidence: FLEE, CRAN_GWS, SMAD)
  - [K] **Rocket equation, specific impulse, mass fraction**: range and speed bounds
  - [K] **Solid vs liquid motors; boost-sustain; pulse motors**: readiness, logistics, energy management
  - [K] **Air-breathing: turbojet/turbofan, ramjet, scramjet**: cruise and ramjet missiles' range envelopes
  - [K] **Energy management and no-escape zone dependence on altitude**: why launch range != effective range
  - [K] **Solid rocket motor industrial base (energetics bottleneck)** `missing`: production surge limits
- **Aerodynamics and flight mechanics** (lab P6; evidence: FLEE, SIOU, CRAN_GWS)
  - [K] **Lift, drag, Mach regimes; max g vs altitude**: maneuverability vs altitude
  - [S] Rigid-body equations of motion, frames: background for 6DOF
  - [S] Stability and control surfaces, thrust vector control: agility limits
  - [S] Aerothermal heating at high Mach: hypersonic constraints
- **Guidance laws** (lab P6; evidence: ZARCH, SIOU, CRAN_GWS)
  - [K] **Guidance phases: launch, midcourse, terminal; handover**: engagement architecture
  - [K] **Proportional navigation, navigation constant, zero-effort miss**: the core result of missile guidance
  - [K] **Acceleration requirement vs target maneuver (3:1 rule)**: interceptor vs maneuvering target claims
  - [S] Augmented PN and optimal guidance: modern interceptors
  - [S] Command guidance, beam riding, SACLOS: older SAMs and ATGMs
- **Miss distance analysis** (lab P6; evidence: ZARCH)
  - [K] **Guidance time constant and miss distance**: why fast airframes and short time constants matter
  - [S] Adjoint method and miss-distance budgets (noise, maneuver, heading error): how designers budget miss
  - [K] **Weaving and evasive maneuvers vs interceptors**: BM and HGV defense arguments
  - [S] Radome error and parasitic loops: limits at high speed
  - [K] **Hit-to-kill vs blast-frag miss requirements**: BMD lethality
- **Seekers** (lab P6; evidence: ZARCH, DRIG, CRAN_GWS)
  - [K] **Seeker types: active RF, semi-active, passive RF, IR imaging, multi-mode**: counter-measure vulnerability
  - [K] **Lock-on before/after launch; acquisition range**: engagement envelope
  - [S] Seeker gimbal limits, look angle, tracking rate: off-boresight capability
  - [K] **Seeker counter-countermeasures**: EW duel at terminal phase
- **Autopilot and control** (lab P6; evidence: ZARCH, SIOU)
  - [C] Airframe transfer functions, three-loop autopilot: engineer detail
  - [N] Flight control design and actuator limits: engineer detail
- **Ballistic missiles** (lab P6; evidence: ZARCH, SIOU, SMAD)
  - [K] **Ballistic trajectory, minimum energy, lofted/depressed**: warning time and defense geometry
  - [K] **Range vs burnout velocity relation**: check range claims from measured burnout
  - [K] **Reentry: heating, deceleration, RV design, MaRVs**: terminal defense difficulty
  - [K] **Accuracy sources: boost errors, reentry dispersion, CEP**: targeting and strategic implications
  - [S] Lambert guidance and strategic intercepts: midcourse defense
  - [K] **Countermeasures: decoys, chaff, MIRV, penaids**: midcourse discrimination problem
- **Cruise and hypersonic missiles** (lab P6; evidence: FLEE, SIOU, RAND)
  - [K] **Cruise missile profiles: altitude, routing, terrain following**: detection timelines
  - [K] **Anti-ship missiles: sea-skimming, supersonic vs subsonic trade**: ship defense timelines
  - [K] **Hypersonic glide vehicles: physics, range, heating, maneuver**: separate hype from physics
  - [S] Hypersonic cruise (scramjet) state of the art: realistic timelines
  - [S] Quasi-ballistic missiles (Iskander-class): regional threat
- **Weapon delivery and accuracy** (lab P6; evidence: SIOU, JMEM)
  - [S] Bombing problem, unguided vs guided delivery errors `test-out`: operators know practice
  - [S] Launch acceptability regions and envelopes `test-out`: mission planning
  - [S] Precision-guided munitions families and kit concepts (JDAM, SDB, glide kits) `test-out`: current war usage
- **Missile engineering detail (skip-list)** (lab P6; evidence: SIOU, ZARCH)
  - [N] Numerical integration methods for simulations: tool detail
  - [N] Strapdown mechanization equations: engineer detail
  - [C] Gimbal and seeker stabilization loops detail: know limits only
  - [N] Missile databases/appendices memorization: lookup, not learning
- **Missile force employment** (lab P6; evidence: CSBA, RAND, HIST)
  - [K] **Salvo sizing against defended targets**: attack planning and defense design
  - [K] **Mixed raids (drones + cruise + ballistic) timing and composition** `missing`: Iran-Israel and Russia-Ukraine pattern
  - [K] **Launcher survivability and the Scud-hunt problem**: mobile launcher targeting
  - [K] **Missile stockpiles and production estimates of adversaries** `missing`: sustainability of strike campaigns

### AMD Air and missile defense

- **AMD problem and effectiveness** (lab P7; evidence: BOORD, PRZ, WK, JP)
  - [K] **Defended area/footprint, keep-out altitude, battlespace**: what a battery actually protects
  - [K] **Engagement timeline: detection to intercept**: the core arithmetic
  - [K] **Probability of raid annihilation (PRA) and leakage**: effectiveness metric
  - [K] **Shoot-look-shoot vs salvo doctrine and interceptor consumption**: magazine vs leakage trade
  - [K] **Layered defense and multi-tier Pk combination**: Arrow/David's Sling/Iron Dome-type architecture
  - [K] **Correlated failures and common-mode in layered defense** `missing`: real layered Pk is lower than product formula
- **Architecture and requirements** (lab P7; evidence: BOORD, JP)
  - [K] **CONOPS, threat definition and design reference missions**: how requirements are born
  - [K] **Sensor-weapon pairing and coverage design**: placement decisions
  - [K] **Interceptor fly-out and kinematic reach**: what interceptor can catch which threat
  - [S] Requirements allocation and trade studies: engineering process
- **BMD specifics** (lab P7; evidence: BOORD, ZARCH, RAND)
  - [K] **Boost, midcourse, terminal phases: pros and cons**: policy debates
  - [K] **Discrimination problem in midcourse**: credibility of national missile defense
  - [S] BMD radars (X-band, UEWR, sea-based): sensor architecture
  - [K] **Space-based sensors (IR early warning, tracking layers)**: HBTSS/SBIRS-class value
  - [S] Exo vs endo interceptors, KKV lethality: interceptor choice
  - [S] Space-based interceptors debates (physics and numbers) `missing`: absentee ratio arithmetic
- **Point and short-range defense** (lab P7; evidence: BOORD, HIST, BALL)
  - [K] **C-RAM/rocket defense: impact point prediction, selective engagement** `test-out`: Iron Dome logic
  - [S] CIWS and gun-based defense; programmable ammunition: last-ditch layer
  - [S] SHORAD and MANPADS `test-out`: air threat to low fliers
  - [K] **Counter-UAS layered approaches**: current priority
- **Economics and capacity** (lab P7; evidence: CSIS, CSBA, RAND)
  - [K] **Cost-exchange ratio: definitions and pitfalls** `missing`: core public debate; misused constantly
  - [K] **Value-of-defended-asset framing vs cost-per-shot** `missing`: correct framing for articles
  - [K] **Magazine depth, reload time and launcher count** `missing`: decisive in Ukraine/Israel/Red Sea
  - [K] **Interceptor production rates and inventory depletion** `missing`: sustainability of defense
  - [K] **Saturation raids and attacker salvo optimization**: how attackers break defenses
  - [S] Defense vs offense dominance over time: strategic argument
- **Integrated air and missile defense C2** (lab P7; evidence: JP, BOORD, HIST)
  - [K] **IAMD battle management: track management, threat evaluation and weapon assignment (TEWA)**: brain of the defense
  - [K] **Engage-on-remote / launch-on-remote**: network-enabled defense
  - [K] **Fratricide and IFF in AMD (Patriot 2003 lessons)**: classic failure mode
  - [K] **Human-on-the-loop automation and decision timelines**: autonomy debate

### C4 C4ISR, kill chains and targeting

- **Kill chain/web concepts** (lab P7; evidence: JP, BALL, RAND, CSBA)
  - [S] F2T2EA kill chain and find/fix/finish `test-out`: operator native vocabulary
  - [K] **Kill-chain timing: time-critical targets, dwell vs latency** `missing`: key to mobile target problem
  - [K] **Sensor-to-shooter latency budgets end-to-end** `missing`: single biggest gap in textbooks
  - [S] Kill webs and mosaic warfare concepts: current concept debates
  - [K] **Kill-chain disruption as strategy (system destruction warfare)**: Chinese doctrine and US counter
- **ISR architecture** (lab P10; evidence: JP, NPSSS, RAND)
  - [S] ISR collection disciplines (IMINT, SIGINT, MASINT, HUMINT, OSINT) `test-out`: vocabulary
  - [K] **Persistence, revisit, coverage trade across platforms**: why no single sensor suffices
  - [K] **Processing, exploitation, dissemination (PED) bottlenecks** `missing`: analyst bottleneck, AI promise
  - [K] **Wide-area search vs point surveillance**: search theory link
- **Targeting process** (lab P11; evidence: JMEM, JP)
  - [S] Joint targeting cycle and target development `test-out`: operational core
  - [K] **Target location error (TLE) categories and their weapon implications** `missing`: cross-links sensor and weapon
  - [S] Collateral damage estimation methodology `test-out`: legal-operational constraint
  - [K] **Battle damage assessment and its biases** `missing`: overclaiming in every war
  - [S] Dynamic targeting and time-sensitive targeting `test-out`: operational core
- **Data fusion and AI** (lab P2; evidence: CRAN_MESE, RAND)
  - [S] JDL fusion levels: vocabulary
  - [K] **AI/ML for detection/targeting (e.g., Maven-class) and limits** `missing`: current debates
  - [K] **Automation bias and human-machine teaming**: decision quality
  - [S] Data quality, labeling and adversarial ML `missing`: why AI claims fail in field
- **Command and control** (lab P7; evidence: JP, HUGH)
  - [S] C2 philosophies: centralized vs mission command, in a degraded spectrum `test-out`: operator native
  - [S] Decision cycles (OODA) and tempo quantification `test-out`: known but rarely quantified
  - [S] Battle management aircraft (AEW&C, JSTARS) vs space alternatives: force structure debate
- **ISR platforms and capabilities** (lab P10; evidence: NPSSS, HIST)
  - [K] **Airborne ISR (MALE UAS, manned SIGINT, AEW) capabilities and vulnerabilities**: survivability in contested airspace
  - [K] **Space-based ISR for tactical targeting (latency, tasking)** `missing`: what space can really do for kill chains
  - [S] Ground and maritime sensor networks: persistent surveillance
  - [K] **Counter-ISR: camouflage, decoys, deception, emission control** `test-out`: cheap counter to expensive sensors

### SP Space systems and space warfare

- **Orbital mechanics** (lab P13; evidence: SMAD, NPSSS, AFIT)
  - [K] **Kepler's laws, orbital period, vis-viva**: all space claims start here
  - [K] **Orbit types: LEO, MEO, GEO, HEO/Molniya, SSO**: mission matching
  - [S] Perturbations (J2, drag), orbit lifetime: constellation upkeep
  - [K] **Delta-v budgets and maneuver costs (Hohmann, plane change)**: counterspace and maneuver claims
  - [K] **Ground track and revisit**: ISR timing and adversary predictability
- **Mission geometry and coverage** (lab P13; evidence: SMAD, NPSSS)
  - [K] **Earth-central angle, footprint, elevation constraints**: coverage calculations
  - [K] **Constellation design (Walker), number of satellites for continuous coverage**: proliferated constellation debates
  - [K] **Access windows and revisit statistics**: how often a target is seen
- **Space payloads and missions** (lab P13; evidence: SMAD, NPSSS)
  - [K] **EO imaging from space: aperture, GSD, swath trade**: imagery resolution claims
  - [K] **Space SAR: resolution, revisit, area rate**: all-weather ISR
  - [S] SIGINT and RF geolocation constellations: ship tracking
  - [K] **Missile warning and tracking IR satellites**: BMD enabler
  - [K] **SATCOM payloads: transponders, spot beams, protected SATCOM**: resilient C2
  - [K] **Commercial imagery and analytics market** `missing`: OSINT revolution
- **Spacecraft engineering** (lab P13; evidence: SMAD)
  - [S] Subsystem budgets: mass, power, thermal, propulsion: feasibility checks
  - [C] ADCS and pointing: awareness
  - [S] TT&C and ground segment: vulnerable node
  - [C] Onboard processing and edge computing: emerging
  - [N] Structures, mechanisms, thermal detail: engineer detail
  - [K] **Small satellites, CubeSats capability limits**: what small sats can and cannot do
- **Launch** (lab P13; evidence: SMAD, NPSSS)
  - [K] **Launch vehicle performance and cost per kg trends**: space economics revolution
  - [S] Responsive launch and reconstitution: resilience strategy
  - [C] Launch site and range operations: awareness
- **Space environment** (lab P13; evidence: SMAD)
  - [S] Radiation, space weather effects on systems: outage explanations
  - [K] **Debris and Kessler syndrome; ASAT test consequences**: policy debates
- **Counterspace and space control** (lab P13; evidence: CSIS, JP, NPSSS)
  - [K] **Counterspace taxonomy: kinetic, co-orbital, directed energy, EW, cyber** `missing`: textbooks (SMAD) omit it
  - [K] **Space domain awareness: sensors and catalog**: attribution and targeting
  - [K] **Resilience via proliferation, maneuver, disaggregation**: force design
  - [S] Space law and norms (OST, debris norms): articles and policy
- **Space economics and programs** (lab P13; evidence: SMAD, DAU, CSIS)
  - [S] Space cost estimation and program risk: budget debates
  - [K] **Commercial-military integration and dependency** `missing`: Starlink, Maxar lessons
- **SMAD detail (skip-list)** (lab P13; evidence: SMAD)
  - [N] Spacecraft computer architecture detail: engineer detail
  - [N] Mechanisms and deployables: engineer detail
  - [N] Thermal control design: engineer detail
  - [N] Planetary data appendices: lookup
  - [C] Manufacturing and integration process detail: awareness only
  - [N] Inflatable structures: niche

### UAS Unmanned systems and counter-UAS

- **UAS fundamentals** (lab P9; evidence: WK, HIST, RAND)
  - [S] UAS classes (Group 1-5), missions and trade-offs `test-out`: taxonomy
  - [K] **Endurance and range equations (Breguet, battery energy density)**: check endurance claims
  - [K] **Payload-endurance-cost trade**: force design
  - [K] **Attritable vs exquisite: cost per effect** `missing`: current force-design debate
  - [C] Launch and recovery: operators know
- **Control, autonomy and payloads** (lab P9; evidence: RAND, CRAN_GWS)
  - [K] **Levels of autonomy and human control**: ethics and doctrine
  - [K] **Terminal guidance autonomy (machine vision lock-on) under EW** `missing`: current EW-autonomy cycle
  - [S] Swarm concepts: coordination, communication needs, real state: hype vs reality
  - [S] Payload types: EO/IR, SIGINT, EW, munitions `test-out`: operators know
- **Loitering munitions and one-way attack drones** (lab P9; evidence: HIST, CSIS, WK)
  - [K] **Loitering munition design and kill chain** `test-out`: current war
  - [K] **Shahed-class one-way attack drones: cost, range, raid sizes** `missing`: cost-exchange and saturation
  - [K] **FPV drones: kill rates, supply, operator training, EW cycle** `missing`: Ukraine-era lesson
  - [K] **Mass production and supply chains of drones** `missing`: industrial dimension
- **Counter-UAS** (lab P9; evidence: HIST, CSIS, DOTE)
  - [K] **Detection: radar, RF, EO/IR, acoustic; small-RCS problem**: C-UAS kill chain
  - [K] **Defeat: jamming, spoofing, guns, missiles, lasers, interceptor drones, nets**: layering
  - [K] **C-UAS cost-exchange and layered economics** `missing`: defining debate
  - [S] Passive defenses (nets, cages, hardening) `test-out`: field practice
- **Maritime and ground unmanned systems** (lab P9; evidence: HIST, RAND)
  - [K] **USVs (Black Sea attack drones) and their defense**: naval lesson
  - [S] UUVs and seabed warfare: emerging
  - [S] UGVs: logistics and combat roles: emerging
- **Learning from UAS models** (lab P9; evidence: WK)
  - [S] Washburn & Kress UAV chapter: search, detection, information value: links UAS to OR

### WE Weapons effects, lethality and protection

- **Ballistics** (lab P11; evidence: NPS533, URICK, JMEM)
  - [C] Interior ballistics: chamber pressure, muzzle velocity: awareness
  - [S] Exterior ballistics: drag, range, dispersion sources: artillery accuracy
  - [K] **Terminal ballistics: penetration (KE long rods, shaped charges)**: armor duel
- **Warheads and explosives** (lab P11; evidence: NPS533, JMEM, PRZ)
  - [S] Explosive energetics, TNT equivalence: effects claims
  - [K] **Blast: overpressure, impulse, scaling laws (Hopkinson-Cranz)**: scale-distance estimates
  - [K] **Fragmentation: Gurney velocity, fragment density, Mott distribution**: lethal radius estimates
  - [K] **Shaped charges and EFPs**: anti-armor effects
  - [S] Penetrators, bunker busters, hard-target defeat: deeply buried targets
  - [S] Thermobaric and special warheads: effects claims
  - [C] Insensitive munitions: logistics/safety
- **Lethality and Pk** (lab P11; evidence: JMEM, PRZ, WK, BALL)
  - [K] **Damage functions (cookie-cutter, Carleton), lethal area**: weaponeering core
  - [K] **CEP and single-shot kill probability**: accuracy vs warhead trade
  - [K] **Number of weapons to achieve damage level (weaponeering)**: munitions demand
  - [S] Fuzing and proximity fuzes: kill mechanism
  - [K] **Vulnerable-area and component kill (kill trees)**: targets' vulnerability
  - [S] Live-fire test and evaluation of lethality `missing`: how Pk numbers are validated
- **Armor and land combat systems** (lab P11; evidence: NPS533, HIST)
  - [K] **Armor types: RHA, composite, ERA; protection equivalence**: armored vehicle debate
  - [K] **Active protection systems (hard/soft kill)**: tank survivability vs ATGM/drones
  - [K] **Top-attack threats and drone-era armor adaptations** `missing` `test-out`: current lesson
  - [C] Mobility: power-to-weight, ground pressure: awareness
  - [C] Tank history and design generations: context
- **Fires and counter-fire** (lab P11; evidence: JP, HIST, WK)
  - [S] Artillery and rocket systems: range, accuracy, rate `test-out`: operator native
  - [K] **Weapon-locating radars and counter-battery timelines**: counter-fire race
  - [S] Shoot-and-scoot and survivability `test-out`: field practice
  - [K] **Ammunition consumption and production (155mm case)** `missing`: industrial lesson of Ukraine
  - [K] **Precision vs mass fires trade**: force design
- **Nuclear weapons effects** (lab P11; evidence: GLAS, NPS533)
  - [S] Blast, thermal, radiation, fallout scaling: strategic literacy
  - [S] EMP (HEMP) effects: infrastructure and C2
  - [S] Nuclear delivery systems and strategic balance: context for missile defense
  - [N] Nuclear weapon design detail: not needed
- **Effects engineering detail (skip-list)** (lab P11; evidence: NPS533)
  - [N] Hydrocode and penetration mechanics equations: research-level
  - [N] Explosive chemistry detail: not needed
  - [C] Tank history pre-1945 detail: context only
- **Effects in force terms** (lab P11; evidence: JMEM, HIST, RAND)
  - [K] **Munitions required per target set (campaign weaponeering)** `missing`: campaign munitions demand
  - [K] **Hardened and underground facilities: defeat feasibility**: Iran nuclear sites debate
  - [K] **Infrastructure targeting effects (power grids, energy)**: strategic strike campaigns

### SUR Platforms and survivability

- **Survivability framework** (lab P8; evidence: BALL, AFIT)
  - [K] **Survivability = 1 - susceptibility x vulnerability**: organizing equation
  - [K] **Kill chain from threat's view (search-detect-track-engage-hit-kill)**: where to break it
  - [K] **Mission attrition rate and campaign survivability**: why 1% matters
- **Susceptibility reduction** (lab P8; evidence: BALL)
  - [K] **Signature reduction across RF, IR, visual, acoustic**: stealth economics
  - [S] Threat warning, expendables, jamming, tactics `test-out`: operator native
  - [K] **Engagement envelopes and exposure calculation**: mission planning
- **Vulnerability reduction** (lab P8; evidence: BALL)
  - [S] FMECA, critical components, kill trees, P(k/h): how vulnerability is computed
  - [S] Redundancy, separation, shielding, fire suppression: design choices
  - [C] Battle damage repair: awareness
- **Air platforms and avionics** (lab P8; evidence: BALL, HIST)
  - [S] Fighter generations and capability discriminators `test-out`: operator native
  - [C] Avionics architecture and data buses: awareness
  - [S] Sensor fusion in fighters: fifth-gen claims
  - [C] HUD/HMD and cueing: awareness
  - [S] IFF and transponders `test-out`: fratricide
  - [S] Air combat maneuvering energy concepts `test-out`: operator native
  - [N] FMS and air traffic management: outside core
- **Sortie generation and basing** (lab P8; evidence: RAND, HIST)
  - [K] **Sortie generation rate and its drivers** `missing`: airpower capacity measure
  - [K] **Air base attack and resilience (runway cratering, shelters, dispersal)** `missing`: central to Pacific/Israel debates
  - [K] **Tanker and range constraints**: reach
- **Platform detail (skip-list)** (lab P8; evidence: BALL)
  - [N] Avionics bus standards (1553, ARINC, Fibre Channel) detail: engineer detail
  - [N] Vehicle management systems (fuel, hydraulics): engineer detail
  - [N] Displays technology detail: engineer detail
  - [N] Tank powertrain and suspension detail: engineer detail
- **Land platform survivability** (lab P11; evidence: BALL, HIST)
  - [K] **Armored vehicle survivability onion (don't be seen... don't be killed)** `test-out`: framework transfer from Ball
  - [S] Signature management of ground vehicles (thermal, acoustic): drone-era hide
  - [S] Crew survivability vs vehicle kill (mobility/firepower/catastrophic kills): kill categories
- **Naval platform survivability** (lab P10; evidence: BALL, HUGH)
  - [K] **Ship vulnerability: how many hits to put out of action (staying power)**: salvo model input
  - [S] Ship signatures and EMCON at sea: targeting by adversary

### NAV Naval and undersea warfare

- **Underwater acoustics** (lab P10; evidence: URICK, NPS533)
  - [K] **Sound speed profile, propagation paths, convergence zones**: submarine detection
  - [K] **Sonar equation (active and passive)**: detection range claims
  - [S] Noise sources and ship/submarine signatures: quieting
- **ASW systems** (lab P10; evidence: URICK, WK, HUGH)
  - [S] Sonar types (hull, towed array, dipping, sonobuoys): ASW
  - [S] Non-acoustic detection (MAD, wake, space-based): transparent-ocean debates
  - [K] **ASW search and barrier models**: search theory application
- **Torpedoes and mines** (lab P10; evidence: WK, URICK)
  - [S] Torpedo guidance and effects: naval lethality
  - [K] **Mine warfare: minefield models, MCM rates**: Hormuz/Black Sea scenarios
- **Ship defense and naval salvo warfare** (lab P10; evidence: HUGH, BOORD, HIST)
  - [K] **Ship self-defense layers vs ASCM**: Red Sea lessons
  - [K] **Hughes salvo model and staying power**: naval force comparison
  - [K] **VLS reload at sea and magazine constraints** `missing`: naval sustainment
  - [K] **Anti-ship ballistic missiles and long-range kill chains**: Pacific debate
- **Naval engineering detail (skip-list)** (lab P10; evidence: URICK)
  - [N] Transducer and array design detail: engineer detail
  - [N] Detailed ray-tracing computation: tool detail
- **Naval force employment** (lab P10; evidence: HUGH, RAND, HIST)
  - [S] Distributed maritime operations and fleet architecture debates: force design
  - [S] Submarine vs surface fleet balance and undersea advantage: strategic
  - [K] **Littoral threats (coastal missiles, drones, mines) to navies**: Black Sea and Red Sea lessons

### OR Operations research and combat modeling

- **Modeling philosophy** (lab ref; evidence: WK, NPS360, RAND)
  - [K] **Model types: analytic, simulation, wargame, exercise; fidelity vs insight**: choosing the right tool
  - [K] **MOE/MOP selection and the 'measure what matters' problem**: article framing
  - [S] Verification, validation and accreditation (VV&A) `missing`: trust in model results
  - [K] **Deterministic vs stochastic models**: when expected values mislead
- **Shooting theory** (lab ref; evidence: WK, PRZ, NPS360)
  - [K] **Shooting without feedback: salvo Pk, independent and correlated shots**: weapon allocation
  - [K] **Shooting with feedback: shoot-look-shoot**: magazine economy
  - [S] Damage functions and coverage problems: area target coverage
  - [S] Weapon-target assignment: allocation optimization
- **Target defense** (lab ref; evidence: WK, PRZ)
  - [S] Prim-Read and defense-allocation games: optimal defense
  - [S] Attacker-defender games over multiple targets: allocation logic
  - [K] **Leakage and penetration models**: AMD analysis
- **Attrition models** (lab ref; evidence: WK, PRZ, HUGH, NPS360)
  - [K] **Lanchester linear and square laws; force-ratio implications**: the classic result
  - [S] Lanchester extensions (mixed, logarithmic, heterogeneous): realism
  - [K] **Empirical validation of Lanchester (historical battles) and limits** `missing`: knowing when the model fails
  - [S] Stochastic attrition (Markov) vs deterministic: small-force battles
  - [K] **Salvo models (Hughes) and their extensions**: missile-age combat
  - [K] **Breakpoints and force ratio rules (3:1, etc.) critique**: common myths
  - [K] **Exchange ratios and loss-exchange analysis**: campaign assessment
- **Search and detection theory** (lab P3; evidence: WK, NPS360)
  - [K] **Random search formula (Koopman)**: ISR/ASW coverage
  - [S] Sweep width and lateral range curves: sensor planning
  - [S] Optimal search allocation, Bayesian search: SAR/ASW
  - [C] Search against moving targets and datum search: awareness
- **Game theory and wargaming** (lab ref; evidence: WK, NPS360, RAND)
  - [S] Two-person zero-sum games, mixed strategies: strategy logic
  - [K] **Wargame design and adjudication; matrix games**: authority must judge wargame claims
  - [K] **Using wargames as evidence: strengths and abuses** `missing`: public-wargame critique (e.g., CSIS Taiwan)
- **Simulation and campaign analysis** (lab ref; evidence: NPS360, RAND, CSBA)
  - [K] **Monte Carlo simulation and statistical output analysis**: reading simulation results
  - [K] **Campaign analysis (Joint Campaign Analysis method)**: the bridge to policy
  - [S] Design of experiments and exploratory modeling under deep uncertainty: robust conclusions
  - [C] Commercial/government combat sims (JTLS, OneSAF, AFSIM, STORM): vocabulary
- **Optimization and decision analysis** (lab ref; evidence: NPS360, PRZ)
  - [S] Linear programming and network flows (logistics, allocation): allocation insight
  - [K] **Decision theory, expected value, value of information**: ISR value
  - [S] Multi-criteria decision analysis and its pitfalls: procurement scoring
  - [N] Nonlinear optimization detail: tools level
- **Statistics for analysts** (lab ref; evidence: NPS360)
  - [K] **Small-sample statistics: test results with few shots** `missing`: interpreting T&E and combat claims
  - [S] Regression and data analysis basics: reading studies
  - [K] **Survivorship and selection bias in combat data** `missing`: e.g., claims from viral videos
- **Special models** (lab ref; evidence: WK, PRZ)
  - [S] Mine warfare models: see naval
  - [S] Insurgency and terror models (Washburn & Kress ch.10): irregular warfare analysis
  - [S] Reliability and availability models in defense analysis (Przemieniecki): system readiness
  - [K] **Cost-effectiveness analysis (Przemieniecki)**: the policy question
- **Historical and empirical combat analysis** (lab ref; evidence: RAND, HIST, WK)
  - [S] Dupuy QJM/TNDM and empirical combat data critique `missing`: known alternative to Lanchester
  - [K] **Biddle's force employment theory** `missing`: why technology alone does not predict outcomes
  - [K] **Historical loss rates per day/sortie by era** `missing`: order-of-magnitude reference for claims
  - [S] Air campaign models (halt phase, sortie-based attrition): RAND classic
- **AMD and strike modeling** (lab ref; evidence: WK, PRZ, CSBA)
  - [K] **Queuing/saturation models of defenses (servers = fire channels)** `missing`: fire-channel limits vs raid size
  - [S] Optimal interceptor allocation across layers and targets: defense design
  - [K] **Attacker-defender cost models (who wins the marginal dollar)** `missing`: cost-exchange done right
- **Information and C2 in models** (lab ref; evidence: WK, HUGH)
  - [K] **Value of information and scouting effectiveness in salvo models**: Hughes' 'fire effectively first'
  - [S] Modeling C2 delay and decision latency `missing`: links to kill-chain timing
  - [S] Deception and false targets in models: decoys' operational value

### LOG Logistics, sustainment and force generation

- **Operational logistics** (lab ref; evidence: VANC, RAND, HIST)
  - [K] **Supply consumption rates and tonnage planning**: what limits operations
  - [S] Lines of communication, distances and transport capacity `test-out`: van Creveld's core
  - [K] **Logistics as operational constraint: historical cases**: van Creveld themes
  - [S] Fuel and ammunition as dominant tonnages `test-out`: field experience
- **Munitions and readiness** (lab ref; evidence: CSBA, RAND, CSIS)
  - [K] **Munitions expenditure in high-intensity war vs stockpiles** `missing`: core current issue
  - [S] Readiness rates, maintenance cycles `test-out`: known
  - [K] **Attrition and replacement of platforms and crews** `missing`: war sustainability
- **Strategic mobility and contested logistics** (lab ref; evidence: RAND, VANC, JP)
  - [S] Airlift and sealift capacity arithmetic: deployment timelines
  - [S] Prepositioning and forward stocks `test-out`: planning
  - [K] **Contested logistics under long-range fires** `missing`: current concern
  - [S] Fuel demand of modern forces: constraint
  - [S] Maintenance, spare parts and depot capacity `missing` `test-out`: readiness reality
  - [S] Logistics for drone/EW-heavy warfare (batteries, components) `missing`: new demand
- **Historical logistics** (lab ref; evidence: VANC)
  - [C] Wallenstein to Napoleon: living off the land: context from van Creveld
  - [S] 1914 Schlieffen logistics and railheads: classic case
  - [S] 1941 Barbarossa and 1944 Patton: motor transport limits: classic case
  - [K] **Van Creveld's conclusions on logistics shaping strategy**: central thesis

### ACQ Acquisition, cost, test & evaluation, industrial base, policy

- **Acquisition process** (lab -; evidence: DAU)
  - [S] Acquisition framework (DoD 5000/AAF; Israeli MAFAT/IMOD equivalents) `missing`: how systems come to be
  - [K] **Budget process (PPBE) and budget documents as data sources** `missing`: best open data on quantities and costs
  - [K] **Technology and manufacturing readiness (TRL/MRL)** `missing`: judge 'ready' claims
  - [S] Requirements process (JCIDS) and urgent operational needs `missing`: speed vs process
- **Cost analysis** (lab -; evidence: DAU, NPS360, FLEE)
  - [K] **Life-cycle cost: RDT&E, procurement, O&S shares** `missing`: unit cost confusion in media
  - [K] **Unit cost definitions (flyaway, APUC, PAUC)** `missing`: cost comparisons misuse
  - [K] **Learning curves and production-rate effects** `missing`: why cost falls (or not)
  - [S] Cost estimating methods (analogy, parametric, engineering) `missing`: evaluate cost claims
  - [S] Inflation and currency adjustment `missing`: comparing across years/countries
- **Test and evaluation** (lab -; evidence: DOTE, DAU)
  - [K] **DT&E vs OT&E vs LFT&E** `missing`: knowing what a test proves
  - [K] **Test realism: scripted tests, threat representativeness** `missing`: critiquing 'successful test' claims
  - [K] **Statistical confidence from limited test shots** `missing`: Pk claims from 10 shots
  - [K] **Combat data as evidence: claims vs verified intercepts** `missing`: war claims
- **Industrial base** (lab -; evidence: CSIS, CSBA, DAU)
  - [K] **Surge capacity, long-lead items, sole sources** `missing`: production decides long wars
  - [K] **Critical materials and components (rare earths, energetics, microelectronics)** `missing`: supply chain vulnerability
  - [S] Defense industry structure (US, Europe, Israel, Russia, China) `missing`: who makes what
  - [S] Commercial technology spin-in and startups `missing`: new entrants
- **Export and publication constraints** (lab -; evidence: EXPORT)
  - [S] ITAR/EAR and Wassenaar basics `missing`: what is controlled and why
  - [K] **MTCR thresholds (500 kg / 300 km)** `missing`: frequently cited in missile articles
  - [K] **Prepublication review and military censorship; handling classified-adjacent info** `missing`: authors' legal and ethical obligations
  - [K] **Mosaic effect of aggregating open info** `missing`: responsible publication
- **Arms control and strategic policy** (lab -; evidence: EXPORT, GLAS, IISS)
  - [S] Arms control regimes (NPT, INF history, New START) and verification: context
  - [S] Deterrence theory and escalation dynamics with long-range strike: articles' strategic framing
  - [S] International humanitarian law and weapons review (Art. 36): autonomy debate

### ADV Adversary systems, doctrine and capability assessment

- **Russian systems and doctrine** (lab P12; evidence: ATP, HIST)
  - [K] **Russian IADS (S-300/400, Buk, Tor, Pantsir) architecture**: threat knowledge
  - [K] **Russian EW systems and doctrine (Krasukha, Zhitel, etc.)**: threat knowledge
  - [K] **Reconnaissance-strike/fire complexes**: doctrine
  - [S] Russian ground tactics and force structure `test-out`: operator familiar
- **Chinese systems and doctrine** (lab P12; evidence: ATP, RAND, CSBA)
  - [K] **PLA systems confrontation / systems destruction warfare**: doctrine
  - [K] **PLARF missile forces and A2/AD kill chain**: Pacific debate
  - [K] **PLA air, naval and space/counterspace capabilities**: threat
  - [S] PLA tactics and organization: context
- **Iran and proxy networks** (lab -; evidence: HIST, CSIS, IISS)
  - [K] **Iranian missile and drone arsenal and production** `missing`: region-specific must-know not in syllabus
  - [K] **Proxy capabilities (Hezbollah, Houthis, Iraqi militias): rockets, drones, ASCMs** `missing` `test-out`: operational relevance
  - [S] Technology transfer channels and reverse engineering `missing`: proliferation analysis
- **Capability assessment methods** (lab -; evidence: IISS, RAND, CNS)
  - [K] **Order-of-battle estimation from open sources** `missing`: assessing forces
  - [K] **Net assessment approach** `missing`: holistic comparison
  - [K] **Mirror-imaging and other analytic biases** `missing`: common error

### CRAFT Defense analysis craft: OSINT, claims checking and communication

- **OSINT methods** (lab -; evidence: CNS, BELL)
  - [K] **Satellite imagery interpretation (vehicles, launchers, damage)** `missing`: core OSINT skill
  - [K] **Geolocation and chronolocation of photos/video** `missing`: verify war claims
  - [K] **Social media and video verification, deepfake awareness** `missing`: information war
  - [S] Measuring from imagery (photogrammetry, shadow lengths) and 3D modeling `missing`: missile dimension estimates
  - [S] Flight/ship tracking (ADS-B, AIS) and its spoofing `missing`: activity indicators
  - [S] Scientific publication and patent analysis for capability `missing`: technology intelligence
  - [C] Archiving and chain-of-custody (Berkeley Protocol) `missing`: evidence integrity
- **Claims checking** (lab -; evidence: CNS, RAND, DOTE)
  - [K] **Physics sanity checks of performance claims (range, speed, accuracy)** `missing`: the 2.5-level superpower
  - [K] **Interception rate and kill claim analysis (denominators, definitions)** `missing`: war reporting
  - [S] Debris and fragment analysis for weapon identification `missing`: attribution
  - [K] **Reading test reports and budget documents critically** `missing`: primary sources
  - [S] Source reliability grading and triangulation `missing` `test-out`: intelligence practice
- **Communicating analysis** (lab -; evidence: RAND)
  - [K] **Structuring an analytic article: question, model, assumptions, sensitivity** `missing`: authority output
  - [K] **Interviewing technical experts: question design, detecting evasion** `missing`: stated goal
  - [K] **Explaining uncertainty and ranges to lay readers** `missing`: credibility
  - [S] Visualizing technical data honestly `missing`: charts
- **Lessons of recent wars** (lab -; evidence: HIST)
  - [K] **Ukraine 2022-: drones, EW, artillery, air defense economics** `missing` `test-out`: current baseline
  - [K] **Israel 2023-25: multi-front AMD, Iran salvos, intercept stats** `missing` `test-out`: home ground
  - [K] **Red Sea/Houthi campaign: naval AMD and costs** `missing`: naval AMD case
  - [S] Nagorno-Karabakh 2020: drones vs legacy air defense `missing`: precursor
  - [S] Desert Storm/Kosovo/2006: classic case studies (SEAD, stealth, Scud hunt) `missing` `test-out`: baseline history

## 8. Evidence sources

- **NPS360**: NPS Operations Analysis curriculum 360 (OA3602 Search Theory & Detection, OA4655 Joint Combat Modeling, OA4602 Joint Campaign Analysis, OA4604 Wargaming, OA4702 Cost Estimation, OA3304 Decision Theory, OA3302/OA4333 Simulation; ESR 3211P incl. 'Analysis of Military Applications') - nps.smartcatalogiq.com
- **NPS533**: NPS Applied Physics of Combat Systems curriculum 533 (EM radiation, signal processing, optoelectronics, servo/control, explosives & warheads, combat simulation, detectors) + SE2101/SE3113/SE3116/SE4117 (sensors, conventional weapons, lasers, directed energy)
- **NPSEW**: NPS EW Engineer certificates 292/293 (EC3600, EC3615, EC3630, EC3700, EC4685: EW principles, radar, microwave/optical aspects of sensor & EW systems); NPS EW (Intl) 596
- **NPSSS**: NPS Space Systems Operations 366 / Space Systems Engineering 591 (SS3011 Space Technology & Applications, SS3051 Military Applications of DoD & Commercial Space, SS3613 Military SATCOM, SS4055 Space Operations for the Warfighter)
- **AFIT**: AFIT graduate programs (EW, space systems, OR/combat modeling, systems engineering), AFIT/CSRA short courses
- **CRAN_GWS**: Cranfield/Defence Academy Shrivenham MSc Guided Weapon Systems (Control & Guidance, EO/IR, Propulsion, Aerodynamics, Systems Integration, Missile Systems Design, Radar EW / GW-EW, Hypersonic GW)
- **CRAN_MESE**: Cranfield MSc Military Electronic Systems Engineering (EM propagation, signal processing, statistics, EO/IR 1-2, comms principles & systems, radar principles, advanced sensor data processing, comms EW, M&S)
- **GTRI**: Georgia Tech Professional Education: Principles of Modern Radar (DEF 3502), Basic Radar Concepts (DEF 3501), Principles of Radar Electronic Protection (DEF 2505)
- **SKOL**: Skolnik, Introduction to Radar Systems / Radar Handbook - TOC
- **RICH**: Richards, Fundamentals of Radar Signal Processing; Richards/Scheer/Holm, Principles of Modern Radar vols I-III - TOC
- **ADAMY**: Adamy, EW101-EW104 (link eq., receivers, search, emitter location, jamming, decoys, LPI, comms EW, EW against new threats) - TOC
- **SCHL**: Schleher, Electronic Warfare in the Information Age; Neri, Introduction to EW Systems - TOC
- **DRIG**: Driggers/Friedman/Nichols, Intro to IR & EO Systems; Holst; NV-IPM/TTP performance modeling
- **KAPL**: Kaplan & Hegarty, Understanding GPS/GNSS; Groves, Principles of GNSS, Inertial & Multisensor Integrated Navigation - TOC
- **ZARCH**: Zarchan, Tactical and Strategic Missile Guidance (PN, adjoints, miss distance, noise, Kalman, Lambert, strategic intercepts, weaving targets, autopilots) - TOC
- **FLEE**: Fleeman, Tactical Missile Design / Missile Design and System Engineering (aero, propulsion, weight, flight performance, measures of merit, cost, sizing) - TOC
- **SIOU**: Siouris, Missile Guidance and Control Systems - TOC
- **BALL**: Ball, Fundamentals of Aircraft Combat Survivability Analysis & Design (kill chain, susceptibility/vulnerability, FMECA, kill trees, P(k/h), signatures, survivability enhancement)
- **SMAD**: Wertz et al., Space Mission Engineering: The New SMAD - TOC
- **WK**: Washburn & Kress, Combat Modeling (shooting with/without feedback, target defense, attrition models, game theory & wargames, search, mine warfare, UAVs, terror & insurgency)
- **PRZ**: Przemieniecki, Mathematical Methods in Defense Analyses (Lanchester, kill probabilities, target coverage, reliability, cost-effectiveness)
- **HUGH**: Hughes & Girrier, Fleet Tactics and Naval Operations (salvo equations, scouting, C2, attrition at sea)
- **BOORD**: Boord & Hoffman, Air and Missile Defense Systems Engineering - TOC
- **URICK**: Urick, Principles of Underwater Sound; USNA Principles of Naval Weapons Systems
- **GLAS**: Glasstone & Dolan, The Effects of Nuclear Weapons
- **JMEM**: Joint Munitions Effectiveness Manual concepts, JP 3-60 Joint Targeting, weaponeering practice
- **JP**: US Joint doctrine: JP 3-01 Countering Air & Missile Threats, JP 3-85 Joint Electromagnetic Spectrum Operations, JP 3-14 Space Operations, JP 3-09 Joint Fire Support, JP 2-0 Intelligence, JP 3-30, JP 5-0
- **DAU**: Defense Acquisition University curricula: DoD 5000 / Adaptive Acquisition Framework, PPBE, cost estimating (CEBoK), TRL/MRL, DT&E/OT&E, sustainment, industrial base
- **DOTE**: DOT&E annual reports and OT&E practice; TEMP structure; live-fire T&E (LFT&E)
- **RAND**: RAND methods & reports: campaign analysis, sortie generation, exchange ratios, wargaming, uncertainty (RDM/exploratory modeling), munitions demand, Hidden in plain sight / scorecards (e.g., US-China Military Scorecard)
- **CSBA**: CSBA analyses: precision-strike regime, salvo competition, cost-imposing strategies, munitions & magazine depth, budget analysis
- **CSIS**: CSIS Missile Defense Project (cost & value of intercepts, interceptor inventory depletion), Aerospace Security Project (space threat assessment), CSIS wargames
- **CNS**: James Martin CNS (Middlebury) OSINT: satellite imagery, GIS, 3D modeling, photo/video analysis, scientific-publication analysis, missile-test databases, sanctions-evasion tracking
- **BELL**: Bellingcat / Berkeley Protocol on Digital Open Source Investigations: geolocation, chronolocation, verification, archiving, ethics
- **EXPORT**: ITAR/USML, EAR/CCL, Wassenaar, MTCR Category I/II thresholds, US/Israeli security review of publications (DoDI 5230.09 prepublication review; Israeli military censor)
- **IISS**: IISS Military Balance, SIPRI arms transfers/expenditure databases, FAS
- **VANC**: van Creveld, Supplying War; Huston/Kress operational logistics; RAND sustainment studies
- **HIST**: Operational history & lessons literature (Gulf War Air Power Survey, Kosovo, 2006/2014/2021-2024 Israel campaigns, Ukraine 2022-, Nagorno-Karabakh 2020, Red Sea 2023-25, Iran-Israel exchanges 2024-25)
- **ATP**: Russian/Chinese military writings via FMSO/ATP 7-100.x (US Army threat doctrine), CASI (China Aerospace Studies Institute), Grau & Bartles 'The Russian Way of War'
- **SE**: INCOSE/NASA SE Handbook, MIL-STD-882 (system safety), reliability (MIL-HDBK-217/338), MBSE practice
- **CYB**: Cyber/EMSO convergence literature (JP 3-12, NPS cyber-EW courses, MIT/CSIS work on cyber-physical weapon systems)

## 9. Method and caveats

- Curricula checked on the web (2026-10): the NPS OA 360 matrix (OA3602, OA4655, OA4602, OA4604, OA4702, OA3304, ESR 3211P incl. 'Analysis of Military Applications'); NPS 533 Applied Physics of Combat Systems; the NPS EW certificates 292/293; NPS Space Systems Operations 366 (SS3011/SS3051/SS3613/SS4055); the Cranfield GWS and MESE module lists; GTRI Principles of Modern Radar (DEF 3502) and Radar EP (DEF 2505); the Washburn & Kress chapter list; the scope and method of Ball's book via DTIC case studies; the CSIS Missile Defense Project work on cost/value of intercepts and interceptor depletion; CNS OSINT course topics. The other reference tables of contents (Skolnik, Richards, Adamy EW101-104, Zarchan, Fleeman, SMAD, Przemieniecki, Hughes, Glasstone, DAU) come from my knowledge of those books and were not re-fetched.
- Sources often list modules without weights. The importance grades are my judgment for *this* goal, explained per item in `why`. They are not a consensus ranking.
- `op_bg` is a prior about an experienced operator, not knowledge of this learner. Use it to choose diagnostic tests, never to drop content.
- Granularity is aimed at one subtopic = one idea that can be tested (roughly a 20-60 minute learning unit at 2.5 depth). Skip-list items are kept coarse on purpose.
- Source links: https://nps.smartcatalogiq.com/en/current/academic-catalog/departments/department-of-operations-research/operations-analysis-curriculum-360 ; https://nps.smartcatalogiq.com/en/current/academic-catalog/departments/department-of-physics/applied-physics-of-combat-systems-curriculum-533 ; https://online.nps.edu/-/292-electronic-warfare-engineer-academic-certificate ; https://nps.smartcatalogiq.com/en/current/academic-catalog/groups-and-committees/space-systems-academic-group/space-systems-operations-curriculum-366 ; https://da.mod.uk/courses/guided-weapon-systems-msc ; https://www.cranfield.ac.uk/courses/taught/military-electronic-systems-engineering ; https://production.pe.gatech.edu/courses/principles-modern-radar ; https://ideas.repec.org/b/spr/isorms/978-1-4419-0790-5.html ; https://apps.dtic.mil/sti/pdfs/ADA183335.pdf ; https://www.csis.org/analysis/cost-and-value-air-and-missile-defense-intercepts ; https://nonproliferation.org/short-course-tracking-north-koreas-wmd-and-sanctions-evasion-with-open-sources/
- Build files (also in this folder): `_src_sources.py`, `_src_data1..4.py`, `_build.py`, `_report.py`.
