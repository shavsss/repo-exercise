D = []
D.append(("UAS", "Unmanned systems and counter-UAS", [
 ("UAS fundamentals", ["WK","HIST","RAND"], "P9", [
  "UAS classes (Group 1-5), missions and trade-offs|S|Y||taxonomy",
  "Endurance and range equations (Breguet, battery energy density)|K|N||check endurance claims",
  "Payload-endurance-cost trade|K|P||force design",
  "Attritable vs exquisite: cost per effect|K|P|m|current force-design debate",
  "Launch and recovery|C|Y||operators know",
 ]),
 ("Control, autonomy and payloads", ["RAND","CRAN_GWS"], "P9", [
  "Levels of autonomy and human control|K|P||ethics and doctrine",
  "Terminal guidance autonomy (machine vision lock-on) under EW|K|P|m|current EW-autonomy cycle",
  "Swarm concepts: coordination, communication needs, real state|S|N||hype vs reality",
  "Payload types: EO/IR, SIGINT, EW, munitions|S|Y||operators know",
 ]),
 ("Loitering munitions and one-way attack drones", ["HIST","CSIS","WK"], "P9", [
  "Loitering munition design and kill chain|K|Y||current war",
  "Shahed-class one-way attack drones: cost, range, raid sizes|K|P|m|cost-exchange and saturation",
  "FPV drones: kill rates, supply, operator training, EW cycle|K|P|m|Ukraine-era lesson",
  "Mass production and supply chains of drones|K|N|m|industrial dimension",
 ]),
 ("Counter-UAS", ["HIST","CSIS","DOTE"], "P9", [
  "Detection: radar, RF, EO/IR, acoustic; small-RCS problem|K|P||C-UAS kill chain",
  "Defeat: jamming, spoofing, guns, missiles, lasers, interceptor drones, nets|K|P||layering",
  "C-UAS cost-exchange and layered economics|K|N|m|defining debate",
  "Passive defenses (nets, cages, hardening)|S|Y||field practice",
 ]),
 ("Maritime and ground unmanned systems", ["HIST","RAND"], "P9", [
  "USVs (Black Sea attack drones) and their defense|K|P||naval lesson",
  "UUVs and seabed warfare|S|N||emerging",
  "UGVs: logistics and combat roles|S|P||emerging",
 ]),
 ("Learning from UAS models", ["WK"], "P9", [
  "Washburn & Kress UAV chapter: search, detection, information value|S|N||links UAS to OR",
 ]),
]))

D.append(("WE", "Weapons effects, lethality and protection", [
 ("Ballistics", ["NPS533","URICK","JMEM"], "P11", [
  "Interior ballistics: chamber pressure, muzzle velocity|C|N||awareness",
  "Exterior ballistics: drag, range, dispersion sources|S|P||artillery accuracy",
  "Terminal ballistics: penetration (KE long rods, shaped charges)|K|N||armor duel",
 ]),
 ("Warheads and explosives", ["NPS533","JMEM","PRZ"], "P11", [
  "Explosive energetics, TNT equivalence|S|N||effects claims",
  "Blast: overpressure, impulse, scaling laws (Hopkinson-Cranz)|K|N||scale-distance estimates",
  "Fragmentation: Gurney velocity, fragment density, Mott distribution|K|N||lethal radius estimates",
  "Shaped charges and EFPs|K|N||anti-armor effects",
  "Penetrators, bunker busters, hard-target defeat|S|N||deeply buried targets",
  "Thermobaric and special warheads|S|P||effects claims",
  "Insensitive munitions|C|N||logistics/safety",
 ]),
 ("Lethality and Pk", ["JMEM","PRZ","WK","BALL"], "P11", [
  "Damage functions (cookie-cutter, Carleton), lethal area|K|N||weaponeering core",
  "CEP and single-shot kill probability|K|P||accuracy vs warhead trade",
  "Number of weapons to achieve damage level (weaponeering)|K|P||munitions demand",
  "Fuzing and proximity fuzes|S|N||kill mechanism",
  "Vulnerable-area and component kill (kill trees)|K|N||targets' vulnerability",
  "Live-fire test and evaluation of lethality|S|N|m|how Pk numbers are validated",
 ]),
 ("Armor and land combat systems", ["NPS533","HIST"], "P11", [
  "Armor types: RHA, composite, ERA; protection equivalence|K|P||armored vehicle debate",
  "Active protection systems (hard/soft kill)|K|P||tank survivability vs ATGM/drones",
  "Top-attack threats and drone-era armor adaptations|K|Y|m|current lesson",
  "Mobility: power-to-weight, ground pressure|C|Y||awareness",
  "Tank history and design generations|C|Y||context",
 ]),
 ("Fires and counter-fire", ["JP","HIST","WK"], "P11", [
  "Artillery and rocket systems: range, accuracy, rate|S|Y||operator native",
  "Weapon-locating radars and counter-battery timelines|K|P||counter-fire race",
  "Shoot-and-scoot and survivability|S|Y||field practice",
  "Ammunition consumption and production (155mm case)|K|P|m|industrial lesson of Ukraine",
  "Precision vs mass fires trade|K|P||force design",
 ]),
 ("Nuclear weapons effects", ["GLAS","NPS533"], "P11", [
  "Blast, thermal, radiation, fallout scaling|S|N||strategic literacy",
  "EMP (HEMP) effects|S|N||infrastructure and C2",
  "Nuclear delivery systems and strategic balance|S|P||context for missile defense",
  "Nuclear weapon design detail|N|N||not needed",
 ]),
]))

D.append(("SUR", "Platforms and survivability", [
 ("Survivability framework", ["BALL","AFIT"], "P8", [
  "Survivability = 1 - susceptibility x vulnerability|K|N||organizing equation",
  "Kill chain from threat's view (search-detect-track-engage-hit-kill)|K|P||where to break it",
  "Mission attrition rate and campaign survivability|K|P||why 1% matters",
 ]),
 ("Susceptibility reduction", ["BALL"], "P8", [
  "Signature reduction across RF, IR, visual, acoustic|K|N||stealth economics",
  "Threat warning, expendables, jamming, tactics|S|Y||operator native",
  "Engagement envelopes and exposure calculation|K|P||mission planning",
 ]),
 ("Vulnerability reduction", ["BALL"], "P8", [
  "FMECA, critical components, kill trees, P(k/h)|S|N||how vulnerability is computed",
  "Redundancy, separation, shielding, fire suppression|S|N||design choices",
  "Battle damage repair|C|Y||awareness",
 ]),
 ("Air platforms and avionics", ["BALL","HIST"], "P8", [
  "Fighter generations and capability discriminators|S|Y||operator native",
  "Avionics architecture and data buses|C|N||awareness",
  "Sensor fusion in fighters|S|P||fifth-gen claims",
  "HUD/HMD and cueing|C|Y||awareness",
  "IFF and transponders|S|Y||fratricide",
  "Air combat maneuvering energy concepts|S|Y||operator native",
  "FMS and air traffic management|N|Y||outside core",
 ]),
 ("Sortie generation and basing", ["RAND","HIST"], "P8", [
  "Sortie generation rate and its drivers|K|P|m|airpower capacity measure",
  "Air base attack and resilience (runway cratering, shelters, dispersal)|K|P|m|central to Pacific/Israel debates",
  "Tanker and range constraints|K|P||reach",
 ]),
]))

D.append(("NAV", "Naval and undersea warfare", [
 ("Underwater acoustics", ["URICK","NPS533"], "P10", [
  "Sound speed profile, propagation paths, convergence zones|K|N||submarine detection",
  "Sonar equation (active and passive)|K|N||detection range claims",
  "Noise sources and ship/submarine signatures|S|N||quieting",
 ]),
 ("ASW systems", ["URICK","WK","HUGH"], "P10", [
  "Sonar types (hull, towed array, dipping, sonobuoys)|S|P||ASW",
  "Non-acoustic detection (MAD, wake, space-based)|S|N||transparent-ocean debates",
  "ASW search and barrier models|K|N||search theory application",
 ]),
 ("Torpedoes and mines", ["WK","URICK"], "P10", [
  "Torpedo guidance and effects|S|N||naval lethality",
  "Mine warfare: minefield models, MCM rates|K|N||Hormuz/Black Sea scenarios",
 ]),
 ("Ship defense and naval salvo warfare", ["HUGH","BOORD","HIST"], "P10", [
  "Ship self-defense layers vs ASCM|K|P||Red Sea lessons",
  "Hughes salvo model and staying power|K|N||naval force comparison",
  "VLS reload at sea and magazine constraints|K|N|m|naval sustainment",
  "Anti-ship ballistic missiles and long-range kill chains|K|N||Pacific debate",
 ]),
]))

D.append(("OR", "Operations research and combat modeling", [
 ("Modeling philosophy", ["WK","NPS360","RAND"], "ref", [
  "Model types: analytic, simulation, wargame, exercise; fidelity vs insight|K|N||choosing the right tool",
  "MOE/MOP selection and the 'measure what matters' problem|K|P||article framing",
  "Verification, validation and accreditation (VV&A)|S|N|m|trust in model results",
  "Deterministic vs stochastic models|K|N||when expected values mislead",
 ]),
 ("Shooting theory", ["WK","PRZ","NPS360"], "ref", [
  "Shooting without feedback: salvo Pk, independent and correlated shots|K|N||weapon allocation",
  "Shooting with feedback: shoot-look-shoot|K|N||magazine economy",
  "Damage functions and coverage problems|S|N||area target coverage",
  "Weapon-target assignment|S|N||allocation optimization",
 ]),
 ("Target defense", ["WK","PRZ"], "ref", [
  "Prim-Read and defense-allocation games|S|N||optimal defense",
  "Attacker-defender games over multiple targets|S|N||allocation logic",
  "Leakage and penetration models|K|N||AMD analysis",
 ]),
 ("Attrition models", ["WK","PRZ","HUGH","NPS360"], "ref", [
  "Lanchester linear and square laws; force-ratio implications|K|N||the classic result",
  "Lanchester extensions (mixed, logarithmic, heterogeneous)|S|N||realism",
  "Empirical validation of Lanchester (historical battles) and limits|K|N|m|knowing when the model fails",
  "Stochastic attrition (Markov) vs deterministic|S|N||small-force battles",
  "Salvo models (Hughes) and their extensions|K|N||missile-age combat",
  "Breakpoints and force ratio rules (3:1, etc.) critique|K|P||common myths",
  "Exchange ratios and loss-exchange analysis|K|P||campaign assessment",
 ]),
 ("Search and detection theory", ["WK","NPS360"], "P3", [
  "Random search formula (Koopman)|K|N||ISR/ASW coverage",
  "Sweep width and lateral range curves|S|N||sensor planning",
  "Optimal search allocation, Bayesian search|S|N||SAR/ASW",
  "Search against moving targets and datum search|C|N||awareness",
 ]),
 ("Game theory and wargaming", ["WK","NPS360","RAND"], "ref", [
  "Two-person zero-sum games, mixed strategies|S|N||strategy logic",
  "Wargame design and adjudication; matrix games|K|P||authority must judge wargame claims",
  "Using wargames as evidence: strengths and abuses|K|P|m|public-wargame critique (e.g., CSIS Taiwan)",
 ]),
 ("Simulation and campaign analysis", ["NPS360","RAND","CSBA"], "ref", [
  "Monte Carlo simulation and statistical output analysis|K|N||reading simulation results",
  "Campaign analysis (Joint Campaign Analysis method)|K|P||the bridge to policy",
  "Design of experiments and exploratory modeling under deep uncertainty|S|N||robust conclusions",
  "Commercial/government combat sims (JTLS, OneSAF, AFSIM, STORM)|C|N||vocabulary",
 ]),
 ("Optimization and decision analysis", ["NPS360","PRZ"], "ref", [
  "Linear programming and network flows (logistics, allocation)|S|N||allocation insight",
  "Decision theory, expected value, value of information|K|N||ISR value",
  "Multi-criteria decision analysis and its pitfalls|S|N||procurement scoring",
  "Nonlinear optimization detail|N|N||tools level",
 ]),
 ("Statistics for analysts", ["NPS360"], "ref", [
  "Small-sample statistics: test results with few shots|K|N|m|interpreting T&E and combat claims",
  "Regression and data analysis basics|S|N||reading studies",
  "Survivorship and selection bias in combat data|K|P|m|e.g., claims from viral videos",
 ]),
 ("Special models", ["WK","PRZ"], "ref", [
  "Mine warfare models|S|N||see naval",
  "Insurgency and terror models (Washburn & Kress ch.10)|S|P||irregular warfare analysis",
  "Reliability and availability models in defense analysis (Przemieniecki)|S|N||system readiness",
  "Cost-effectiveness analysis (Przemieniecki)|K|N||the policy question",
 ]),
]))

D.append(("LOG", "Logistics, sustainment and force generation", [
 ("Operational logistics", ["VANC","RAND","HIST"], "ref", [
  "Supply consumption rates and tonnage planning|K|P||what limits operations",
  "Lines of communication, distances and transport capacity|S|Y||van Creveld's core",
  "Logistics as operational constraint: historical cases|K|P||van Creveld themes",
  "Fuel and ammunition as dominant tonnages|S|Y||field experience",
 ]),
 ("Munitions and readiness", ["CSBA","RAND","CSIS"], "ref", [
  "Munitions expenditure in high-intensity war vs stockpiles|K|N|m|core current issue",
  "Readiness rates, maintenance cycles|S|Y||known",
  "Attrition and replacement of platforms and crews|K|P|m|war sustainability",
 ]),
]))

D.append(("ACQ", "Acquisition, cost, test & evaluation, industrial base, policy", [
 ("Acquisition process", ["DAU"], "-", [
  "Acquisition framework (DoD 5000/AAF; Israeli MAFAT/IMOD equivalents)|S|P|m|how systems come to be",
  "Budget process (PPBE) and budget documents as data sources|K|N|m|best open data on quantities and costs",
  "Technology and manufacturing readiness (TRL/MRL)|K|N|m|judge 'ready' claims",
  "Requirements process (JCIDS) and urgent operational needs|S|P|m|speed vs process",
 ]),
 ("Cost analysis", ["DAU","NPS360","FLEE"], "-", [
  "Life-cycle cost: RDT&E, procurement, O&S shares|K|N|m|unit cost confusion in media",
  "Unit cost definitions (flyaway, APUC, PAUC)|K|N|m|cost comparisons misuse",
  "Learning curves and production-rate effects|K|N|m|why cost falls (or not)",
  "Cost estimating methods (analogy, parametric, engineering)|S|N|m|evaluate cost claims",
  "Inflation and currency adjustment|S|N|m|comparing across years/countries",
 ]),
 ("Test and evaluation", ["DOTE","DAU"], "-", [
  "DT&E vs OT&E vs LFT&E|K|N|m|knowing what a test proves",
  "Test realism: scripted tests, threat representativeness|K|P|m|critiquing 'successful test' claims",
  "Statistical confidence from limited test shots|K|N|m|Pk claims from 10 shots",
  "Combat data as evidence: claims vs verified intercepts|K|P|m|war claims",
 ]),
 ("Industrial base", ["CSIS","CSBA","DAU"], "-", [
  "Surge capacity, long-lead items, sole sources|K|N|m|production decides long wars",
  "Critical materials and components (rare earths, energetics, microelectronics)|K|N|m|supply chain vulnerability",
  "Defense industry structure (US, Europe, Israel, Russia, China)|S|P|m|who makes what",
  "Commercial technology spin-in and startups|S|P|m|new entrants",
 ]),
 ("Export and publication constraints", ["EXPORT"], "-", [
  "ITAR/EAR and Wassenaar basics|S|N|m|what is controlled and why",
  "MTCR thresholds (500 kg / 300 km)|K|N|m|frequently cited in missile articles",
  "Prepublication review and military censorship; handling classified-adjacent info|K|P|m|authors' legal and ethical obligations",
  "Mosaic effect of aggregating open info|K|P|m|responsible publication",
 ]),
 ("Arms control and strategic policy", ["EXPORT","GLAS","IISS"], "-", [
  "Arms control regimes (NPT, INF history, New START) and verification|S|N||context",
  "Deterrence theory and escalation dynamics with long-range strike|S|P||articles' strategic framing",
  "International humanitarian law and weapons review (Art. 36)|S|P||autonomy debate",
 ]),
]))

D.append(("ADV", "Adversary systems, doctrine and capability assessment", [
 ("Russian systems and doctrine", ["ATP","HIST"], "P12", [
  "Russian IADS (S-300/400, Buk, Tor, Pantsir) architecture|K|P||threat knowledge",
  "Russian EW systems and doctrine (Krasukha, Zhitel, etc.)|K|P||threat knowledge",
  "Reconnaissance-strike/fire complexes|K|P||doctrine",
  "Russian ground tactics and force structure|S|Y||operator familiar",
 ]),
 ("Chinese systems and doctrine", ["ATP","RAND","CSBA"], "P12", [
  "PLA systems confrontation / systems destruction warfare|K|N||doctrine",
  "PLARF missile forces and A2/AD kill chain|K|N||Pacific debate",
  "PLA air, naval and space/counterspace capabilities|K|N||threat",
  "PLA tactics and organization|S|N||context",
 ]),
 ("Iran and proxy networks", ["HIST","CSIS","IISS"], "-", [
  "Iranian missile and drone arsenal and production|K|P|m|region-specific must-know not in syllabus",
  "Proxy capabilities (Hezbollah, Houthis, Iraqi militias): rockets, drones, ASCMs|K|Y|m|operational relevance",
  "Technology transfer channels and reverse engineering|S|P|m|proliferation analysis",
 ]),
 ("Capability assessment methods", ["IISS","RAND","CNS"], "-", [
  "Order-of-battle estimation from open sources|K|P|m|assessing forces",
  "Net assessment approach|K|N|m|holistic comparison",
  "Mirror-imaging and other analytic biases|K|P|m|common error",
 ]),
]))

D.append(("CRAFT", "Defense analysis craft: OSINT, claims checking and communication", [
 ("OSINT methods", ["CNS","BELL"], "-", [
  "Satellite imagery interpretation (vehicles, launchers, damage)|K|P|m|core OSINT skill",
  "Geolocation and chronolocation of photos/video|K|P|m|verify war claims",
  "Social media and video verification, deepfake awareness|K|P|m|information war",
  "Measuring from imagery (photogrammetry, shadow lengths) and 3D modeling|S|N|m|missile dimension estimates",
  "Flight/ship tracking (ADS-B, AIS) and its spoofing|S|P|m|activity indicators",
  "Scientific publication and patent analysis for capability|S|N|m|technology intelligence",
  "Archiving and chain-of-custody (Berkeley Protocol)|C|N|m|evidence integrity",
 ]),
 ("Claims checking", ["CNS","RAND","DOTE"], "-", [
  "Physics sanity checks of performance claims (range, speed, accuracy)|K|P|m|the 2.5-level superpower",
  "Interception rate and kill claim analysis (denominators, definitions)|K|P|m|war reporting",
  "Debris and fragment analysis for weapon identification|S|P|m|attribution",
  "Reading test reports and budget documents critically|K|N|m|primary sources",
  "Source reliability grading and triangulation|S|Y|m|intelligence practice",
 ]),
 ("Communicating analysis", ["RAND"], "-", [
  "Structuring an analytic article: question, model, assumptions, sensitivity|K|P|m|authority output",
  "Interviewing technical experts: question design, detecting evasion|K|P|m|stated goal",
  "Explaining uncertainty and ranges to lay readers|K|N|m|credibility",
  "Visualizing technical data honestly|S|N|m|charts",
 ]),
 ("Lessons of recent wars", ["HIST"], "-", [
  "Ukraine 2022-: drones, EW, artillery, air defense economics|K|Y|m|current baseline",
  "Israel 2023-25: multi-front AMD, Iran salvos, intercept stats|K|Y|m|home ground",
  "Red Sea/Houthi campaign: naval AMD and costs|K|P|m|naval AMD case",
  "Nagorno-Karabakh 2020: drones vs legacy air defense|S|P|m|precursor",
  "Desert Storm/Kosovo/2006: classic case studies (SEAD, stealth, Scud hunt)|S|Y|m|baseline history",
 ]),
]))
