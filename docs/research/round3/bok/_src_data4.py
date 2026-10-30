# Additional topics merged into existing domains (same domain id => topics appended)
D = []
D.append(("R", "Radar", [
 ("Radar hardware and engineering detail (skip-list)", ["RICH","SKOL"], "P2", [
  "Transmitter tube types and modulators|C|N||only to explain power/cost generations",
  "Receiver/exciter design, ADC dynamic range|C|N||awareness of digital receiver limits",
  "Phase noise and stability effects on MTI/PD|S|N||explains clutter-limited performance in look-down",
  "CFAR variant algebra (CA/OS/GO/SO)|N|N||implementation detail",
  "Kalman filter matrix derivation|N|N||use the result, skip the algebra",
  "SAR image formation algorithms (RDA, PFA, backprojection)|N|N||implementation detail",
  "InSAR and coherent change detection (what they reveal)|S|N||ISR applications for OSINT",
  "Radar calibration and range-test practice|N|N||test-engineer detail",
  "Waveform design math (Costas, NLFM, polyphase)|N|N||research-level",
  "Sparse reconstruction / compressed sensing|N|N||research-level",
 ]),
 ("Radar in the force", ["HIST","RAND","BOORD"], "P2", [
  "Radar coverage diagrams and low-altitude gaps as tactical facts|K|P||planning routes and placements",
  "Ground-based radar survivability vs ARMs and drones|K|P|m|emit-and-die problem",
  "Mobility, emplacement time and radar netting|S|Y||field practice",
  "Counter-stealth architectures (low-band + IRST + passive + network)|K|N||central stealth-era debate",
 ]),
]))
D.append(("EW", "Electronic warfare and electromagnetic spectrum operations", [
 ("EW engineering detail (skip-list)", ["ADAMY","SCHL"], "P4", [
  "Microwave component design (filters, mixers, amplifiers)|N|N||engineer detail",
  "Detailed spherical-trig EW geometry problems|C|N||solved-exercise level",
  "Solved-problem banks (EW 101 exercises)|C|N||practice only, not new knowledge",
  "DRFM hardware internals (bits, latency)|C|N||know latency limits only",
 ]),
 ("EW in force terms", ["HIST","RAND","CSBA"], "P4", [
  "EW order of battle and density on modern fronts|K|P|m|Ukraine: EW per km of front",
  "Electromagnetic signature management of ground forces|K|Y|m|command posts found by emissions",
  "Cognitive/AI-enabled EW claims and realities|S|N|m|hype filter",
  "Cost and production of EW systems vs drones|S|N|m|economics of the EW-drone cycle",
 ]),
]))
D.append(("MSL", "Missiles: propulsion, guidance, control and design", [
 ("Missile engineering detail (skip-list)", ["SIOU","ZARCH"], "P6", [
  "Numerical integration methods for simulations|N|N||tool detail",
  "Strapdown mechanization equations|N|N||engineer detail",
  "Gimbal and seeker stabilization loops detail|C|N||know limits only",
  "Missile databases/appendices memorization|N|N||lookup, not learning",
 ]),
 ("Missile force employment", ["CSBA","RAND","HIST"], "P6", [
  "Salvo sizing against defended targets|K|N||attack planning and defense design",
  "Mixed raids (drones + cruise + ballistic) timing and composition|K|P|m|Iran-Israel and Russia-Ukraine pattern",
  "Launcher survivability and the Scud-hunt problem|K|P||mobile launcher targeting",
  "Missile stockpiles and production estimates of adversaries|K|N|m|sustainability of strike campaigns",
 ]),
]))
D.append(("SP", "Space systems and space warfare", [
 ("SMAD detail (skip-list)", ["SMAD"], "P13", [
  "Spacecraft computer architecture detail|N|N||engineer detail",
  "Mechanisms and deployables|N|N||engineer detail",
  "Thermal control design|N|N||engineer detail",
  "Planetary data appendices|N|N||lookup",
  "Manufacturing and integration process detail|C|N||awareness only",
  "Inflatable structures|N|N||niche",
 ]),
]))
D.append(("SUR", "Platforms and survivability", [
 ("Platform detail (skip-list)", ["BALL"], "P8", [
  "Avionics bus standards (1553, ARINC, Fibre Channel) detail|N|N||engineer detail",
  "Vehicle management systems (fuel, hydraulics)|N|N||engineer detail",
  "Displays technology detail|N|N||engineer detail",
  "Tank powertrain and suspension detail|N|N||engineer detail",
 ]),
 ("Land platform survivability", ["BALL","HIST"], "P11", [
  "Armored vehicle survivability onion (don't be seen... don't be killed)|K|Y||framework transfer from Ball",
  "Signature management of ground vehicles (thermal, acoustic)|S|P||drone-era hide",
  "Crew survivability vs vehicle kill (mobility/firepower/catastrophic kills)|S|P||kill categories",
 ]),
 ("Naval platform survivability", ["BALL","HUGH"], "P10", [
  "Ship vulnerability: how many hits to put out of action (staying power)|K|N||salvo model input",
  "Ship signatures and EMCON at sea|S|P||targeting by adversary",
 ]),
]))
D.append(("OR", "Operations research and combat modeling", [
 ("Historical and empirical combat analysis", ["RAND","HIST","WK"], "ref", [
  "Dupuy QJM/TNDM and empirical combat data critique|S|N|m|known alternative to Lanchester",
  "Biddle's force employment theory|K|N|m|why technology alone does not predict outcomes",
  "Historical loss rates per day/sortie by era|K|P|m|order-of-magnitude reference for claims",
  "Air campaign models (halt phase, sortie-based attrition)|S|N||RAND classic",
 ]),
 ("AMD and strike modeling", ["WK","PRZ","CSBA"], "ref", [
  "Queuing/saturation models of defenses (servers = fire channels)|K|N|m|fire-channel limits vs raid size",
  "Optimal interceptor allocation across layers and targets|S|N||defense design",
  "Attacker-defender cost models (who wins the marginal dollar)|K|N|m|cost-exchange done right",
 ]),
 ("Information and C2 in models", ["WK","HUGH"], "ref", [
  "Value of information and scouting effectiveness in salvo models|K|N||Hughes' 'fire effectively first'",
  "Modeling C2 delay and decision latency|S|N|m|links to kill-chain timing",
  "Deception and false targets in models|S|N||decoys' operational value",
 ]),
]))
D.append(("LOG", "Logistics, sustainment and force generation", [
 ("Strategic mobility and contested logistics", ["RAND","VANC","JP"], "ref", [
  "Airlift and sealift capacity arithmetic|S|P||deployment timelines",
  "Prepositioning and forward stocks|S|Y||planning",
  "Contested logistics under long-range fires|K|P|m|current concern",
  "Fuel demand of modern forces|S|P||constraint",
  "Maintenance, spare parts and depot capacity|S|Y|m|readiness reality",
  "Logistics for drone/EW-heavy warfare (batteries, components)|S|P|m|new demand",
 ]),
 ("Historical logistics", ["VANC"], "ref", [
  "Wallenstein to Napoleon: living off the land|C|N||context from van Creveld",
  "1914 Schlieffen logistics and railheads|S|N||classic case",
  "1941 Barbarossa and 1944 Patton: motor transport limits|S|N||classic case",
  "Van Creveld's conclusions on logistics shaping strategy|K|N||central thesis",
 ]),
]))
D.append(("C4", "C4ISR, kill chains and targeting", [
 ("ISR platforms and capabilities", ["NPSSS","HIST"], "P10", [
  "Airborne ISR (MALE UAS, manned SIGINT, AEW) capabilities and vulnerabilities|K|P||survivability in contested airspace",
  "Space-based ISR for tactical targeting (latency, tasking)|K|N|m|what space can really do for kill chains",
  "Ground and maritime sensor networks|S|P||persistent surveillance",
  "Counter-ISR: camouflage, decoys, deception, emission control|K|Y||cheap counter to expensive sensors",
 ]),
]))
D.append(("WE", "Weapons effects, lethality and protection", [
 ("Effects engineering detail (skip-list)", ["NPS533"], "P11", [
  "Hydrocode and penetration mechanics equations|N|N||research-level",
  "Explosive chemistry detail|N|N||not needed",
  "Tank history pre-1945 detail|C|Y||context only",
 ]),
 ("Effects in force terms", ["JMEM","HIST","RAND"], "P11", [
  "Munitions required per target set (campaign weaponeering)|K|N|m|campaign munitions demand",
  "Hardened and underground facilities: defeat feasibility|K|N||Iran nuclear sites debate",
  "Infrastructure targeting effects (power grids, energy)|K|P||strategic strike campaigns",
 ]),
]))
D.append(("F", "Foundations: the quantitative toolkit", [
 ("Analyst's reasoning tools", ["RAND","NPS360"], "P0", [
  "Dimensional analysis and scaling laws|K|N||fast derivation of trade-offs",
  "Fermi estimation and bounding|K|P|m|central authority skill",
  "Sensitivity, elasticity and the 'which parameter matters' question|K|N||article logic",
  "Uncertainty propagation and ranges vs point estimates|K|N|m|honest claims",
 ]),
]))
D.append(("NAV", "Naval and undersea warfare", [
 ("Naval engineering detail (skip-list)", ["URICK"], "P10", [
  "Transducer and array design detail|N|N||engineer detail",
  "Detailed ray-tracing computation|N|N||tool detail",
 ]),
 ("Naval force employment", ["HUGH","RAND","HIST"], "P10", [
  "Distributed maritime operations and fleet architecture debates|S|N||force design",
  "Submarine vs surface fleet balance and undersea advantage|S|N||strategic",
  "Littoral threats (coastal missiles, drones, mines) to navies|K|P||Black Sea and Red Sea lessons",
 ]),
]))
