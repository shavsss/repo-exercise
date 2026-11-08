D = []
D.append(("COM", "Communications, datalinks and networks", [
 ("Digital communications fundamentals", ["CRAN_MESE","NPSEW","ADAMY"], "P0", [
  "Shannon capacity and bandwidth-power trade|K|N||limits of any datalink claim",
  "Modulation schemes and Eb/N0 vs BER|S|N||link margin under jamming",
  "Error-correcting codes and interleaving (coding gain)|S|N||why links degrade gracefully or not",
  "Multiple access (TDMA, FDMA, CDMA, OFDM)|S|P||Link 16 and LTE/5G structure",
 ]),
 ("Tactical datalinks", ["JP","BOORD","HIST"], "P7", [
  "Link 16: TDMA, J-series messages, NPGs, relay, capacity|K|P||backbone of air/missile defense C2",
  "Link 11/22, VMF, JREAP and gateways|S|P||coalition interoperability",
  "Cooperative Engagement Capability-class composite tracking|K|N||engage-on-remote enabler",
  "Weapon datalinks (in-flight updates, terminal handover)|K|P||mid-course guidance and retargeting",
  "LPI/LPD datalinks for stealth platforms (MADL, IFDL)|S|N||fifth-gen networking limits",
  "Datalink latency and message timeliness budgets|K|P|m|sensor-to-shooter latency starts here",
 ]),
 ("UAS and C2 links", ["CRAN_MESE","HIST"], "P9", [
  "Line-of-sight vs SATCOM vs mesh relay control links|K|Y||drone operations",
  "Commercial radios, FHSS hobby links and their jamming/geolocation|K|P||FPV drone war dynamics",
  "Fiber-optic controlled drones as EW counter|K|P|m|current countermeasure cycle example",
 ]),
 ("Networks and C2 systems", ["JP","RAND","CYB"], "P7", [
  "Network-centric warfare theory and its critiques|S|P||articles must assess the concept",
  "Resilience: degraded, intermittent, limited bandwidth (DIL)|K|P||real-world C2",
  "Commercial proliferated SATCOM (Starlink-class) in war|K|P||Ukraine lesson",
  "Cellular networks and civilian infrastructure use/exploitation|S|Y||OSINT and targeting risk",
  "Cyber vulnerabilities of weapon-system networks|S|N|m|GAO weapon-system cyber findings",
  "Crypto, key management and COMSEC basics|C|Y||awareness",
 ]),
]))

D.append(("PNT", "Positioning, navigation and timing", [
 ("GNSS principles", ["KAPL","NPSSS"], "P5", [
  "Pseudorange, trilateration and clock bias|K|N||why 4 satellites; timing is central",
  "GPS segments, signals (L1/L2/L5, C/A, P(Y), M-code)|S|P||military vs civil resilience",
  "Error budget: ephemeris, clock, iono, tropo, multipath; UERE|K|N||accuracy claims",
  "DOP and constellation geometry|K|N||urban/terrain degradation",
  "Other GNSS: GLONASS, Galileo, BeiDou (incl. BeiDou military)|S|P||adversary independence",
  "Receiver acquisition and tracking loops|C|N||background for jamming tolerance",
  "Differential GNSS, RTK, SBAS|S|N||precision targeting",
 ]),
 ("GNSS vulnerability", ["KAPL","HIST","ADAMY"], "P5", [
  "Jamming: J/S at the receiver, jammer power vs range|K|P||ubiquitous in current wars",
  "Spoofing: methods and detection|K|P||ships and drones misled",
  "Anti-jam antennas (CRPA), nulling, and their limits|K|N||weapon resilience",
  "Effects on weapons: JDAM/GMLRS-class degradation under jamming|K|P|m|why 'GPS weapons stopped working' claims arise",
 ]),
 ("Inertial and alternative navigation", ["KAPL","SIOU"], "P5", [
  "INS principles, drift rates by grade (nav/tactical/MEMS)|K|N||accuracy after GNSS loss",
  "GNSS/INS integration (loose/tight)|S|N||resilience",
  "TERCOM, DSMAC, scene matching, vision-based navigation|K|N||cruise missile and drone navigation without GPS",
  "Signals of opportunity, celestial, magnetic/gravity navigation, eLoran|S|N||emerging alternatives",
  "Quantum sensors (atomic clocks, cold-atom inertial)|C|N|m|separate hype from timelines",
 ]),
]))

D.append(("MSL", "Missiles: propulsion, guidance, control and design", [
 ("Missile systems overview", ["FLEE","CRAN_GWS","SIOU"], "P6", [
  "Missile classes (SAM, AAM, ASM, ASCM, LACM, BM, HGV) and mission requirements|S|Y||taxonomy",
  "Design drivers and measures of merit (range, speed, Pk, cost, weight, signature)|K|N||Fleeman-style trades for evaluating weapons",
  "Missile sizing rules of thumb|K|N||sanity-check range/weight claims",
  "Cost of missiles: unit cost drivers, production rate effects|K|N|m|magazine and cost-exchange depend on it",
 ]),
 ("Propulsion", ["FLEE","CRAN_GWS","SMAD"], "P6", [
  "Rocket equation, specific impulse, mass fraction|K|N||range and speed bounds",
  "Solid vs liquid motors; boost-sustain; pulse motors|K|P||readiness, logistics, energy management",
  "Air-breathing: turbojet/turbofan, ramjet, scramjet|K|N||cruise and ramjet missiles' range envelopes",
  "Energy management and no-escape zone dependence on altitude|K|P||why launch range != effective range",
  "Solid rocket motor industrial base (energetics bottleneck)|K|N|m|production surge limits",
 ]),
 ("Aerodynamics and flight mechanics", ["FLEE","SIOU","CRAN_GWS"], "P6", [
  "Lift, drag, Mach regimes; max g vs altitude|K|N||maneuverability vs altitude",
  "Rigid-body equations of motion, frames|S|N||background for 6DOF",
  "Stability and control surfaces, thrust vector control|S|N||agility limits",
  "Aerothermal heating at high Mach|S|N||hypersonic constraints",
 ]),
 ("Guidance laws", ["ZARCH","SIOU","CRAN_GWS"], "P6", [
  "Guidance phases: launch, midcourse, terminal; handover|K|P||engagement architecture",
  "Proportional navigation, navigation constant, zero-effort miss|K|N||the core result of missile guidance",
  "Acceleration requirement vs target maneuver (3:1 rule)|K|N||interceptor vs maneuvering target claims",
  "Augmented PN and optimal guidance|S|N||modern interceptors",
  "Command guidance, beam riding, SACLOS|S|P||older SAMs and ATGMs",
 ]),
 ("Miss distance analysis", ["ZARCH"], "P6", [
  "Guidance time constant and miss distance|K|N||why fast airframes and short time constants matter",
  "Adjoint method and miss-distance budgets (noise, maneuver, heading error)|S|N||how designers budget miss",
  "Weaving and evasive maneuvers vs interceptors|K|N||BM and HGV defense arguments",
  "Radome error and parasitic loops|S|N||limits at high speed",
  "Hit-to-kill vs blast-frag miss requirements|K|N||BMD lethality",
 ]),
 ("Seekers", ["ZARCH","DRIG","CRAN_GWS"], "P6", [
  "Seeker types: active RF, semi-active, passive RF, IR imaging, multi-mode|K|P||counter-measure vulnerability",
  "Lock-on before/after launch; acquisition range|K|P||engagement envelope",
  "Seeker gimbal limits, look angle, tracking rate|S|N||off-boresight capability",
  "Seeker counter-countermeasures|K|N||EW duel at terminal phase",
 ]),
 ("Autopilot and control", ["ZARCH","SIOU"], "P6", [
  "Airframe transfer functions, three-loop autopilot|C|N||engineer detail",
  "Flight control design and actuator limits|N|N||engineer detail",
 ]),
 ("Ballistic missiles", ["ZARCH","SIOU","SMAD"], "P6", [
  "Ballistic trajectory, minimum energy, lofted/depressed|K|N||warning time and defense geometry",
  "Range vs burnout velocity relation|K|N||check range claims from measured burnout",
  "Reentry: heating, deceleration, RV design, MaRVs|K|N||terminal defense difficulty",
  "Accuracy sources: boost errors, reentry dispersion, CEP|K|N||targeting and strategic implications",
  "Lambert guidance and strategic intercepts|S|N||midcourse defense",
  "Countermeasures: decoys, chaff, MIRV, penaids|K|N||midcourse discrimination problem",
 ]),
 ("Cruise and hypersonic missiles", ["FLEE","SIOU","RAND"], "P6", [
  "Cruise missile profiles: altitude, routing, terrain following|K|P||detection timelines",
  "Anti-ship missiles: sea-skimming, supersonic vs subsonic trade|K|P||ship defense timelines",
  "Hypersonic glide vehicles: physics, range, heating, maneuver|K|N||separate hype from physics",
  "Hypersonic cruise (scramjet) state of the art|S|N||realistic timelines",
  "Quasi-ballistic missiles (Iskander-class)|S|P||regional threat",
 ]),
 ("Weapon delivery and accuracy", ["SIOU","JMEM"], "P6", [
  "Bombing problem, unguided vs guided delivery errors|S|Y||operators know practice",
  "Launch acceptability regions and envelopes|S|Y||mission planning",
  "Precision-guided munitions families and kit concepts (JDAM, SDB, glide kits)|S|Y||current war usage",
 ]),
]))

D.append(("AMD", "Air and missile defense", [
 ("AMD problem and effectiveness", ["BOORD","PRZ","WK","JP"], "P7", [
  "Defended area/footprint, keep-out altitude, battlespace|K|P||what a battery actually protects",
  "Engagement timeline: detection to intercept|K|P||the core arithmetic",
  "Probability of raid annihilation (PRA) and leakage|K|N||effectiveness metric",
  "Shoot-look-shoot vs salvo doctrine and interceptor consumption|K|P||magazine vs leakage trade",
  "Layered defense and multi-tier Pk combination|K|P||Arrow/David's Sling/Iron Dome-type architecture",
  "Correlated failures and common-mode in layered defense|K|N|m|real layered Pk is lower than product formula",
 ]),
 ("Architecture and requirements", ["BOORD","JP"], "P7", [
  "CONOPS, threat definition and design reference missions|K|P||how requirements are born",
  "Sensor-weapon pairing and coverage design|K|P||placement decisions",
  "Interceptor fly-out and kinematic reach|K|N||what interceptor can catch which threat",
  "Requirements allocation and trade studies|S|N||engineering process",
 ]),
 ("BMD specifics", ["BOORD","ZARCH","RAND"], "P7", [
  "Boost, midcourse, terminal phases: pros and cons|K|N||policy debates",
  "Discrimination problem in midcourse|K|N||credibility of national missile defense",
  "BMD radars (X-band, UEWR, sea-based)|S|N||sensor architecture",
  "Space-based sensors (IR early warning, tracking layers)|K|N||HBTSS/SBIRS-class value",
  "Exo vs endo interceptors, KKV lethality|S|N||interceptor choice",
  "Space-based interceptors debates (physics and numbers)|S|N|m|absentee ratio arithmetic",
 ]),
 ("Point and short-range defense", ["BOORD","HIST","BALL"], "P7", [
  "C-RAM/rocket defense: impact point prediction, selective engagement|K|Y||Iron Dome logic",
  "CIWS and gun-based defense; programmable ammunition|S|P||last-ditch layer",
  "SHORAD and MANPADS|S|Y||air threat to low fliers",
  "Counter-UAS layered approaches|K|P||current priority",
 ]),
 ("Economics and capacity", ["CSIS","CSBA","RAND"], "P7", [
  "Cost-exchange ratio: definitions and pitfalls|K|N|m|core public debate; misused constantly",
  "Value-of-defended-asset framing vs cost-per-shot|K|N|m|correct framing for articles",
  "Magazine depth, reload time and launcher count|K|P|m|decisive in Ukraine/Israel/Red Sea",
  "Interceptor production rates and inventory depletion|K|N|m|sustainability of defense",
  "Saturation raids and attacker salvo optimization|K|N||how attackers break defenses",
  "Defense vs offense dominance over time|S|N||strategic argument",
 ]),
 ("Integrated air and missile defense C2", ["JP","BOORD","HIST"], "P7", [
  "IAMD battle management: track management, threat evaluation and weapon assignment (TEWA)|K|P||brain of the defense",
  "Engage-on-remote / launch-on-remote|K|N||network-enabled defense",
  "Fratricide and IFF in AMD (Patriot 2003 lessons)|K|P||classic failure mode",
  "Human-on-the-loop automation and decision timelines|K|P||autonomy debate",
 ]),
]))

D.append(("C4", "C4ISR, kill chains and targeting", [
 ("Kill chain/web concepts", ["JP","BALL","RAND","CSBA"], "P7", [
  "F2T2EA kill chain and find/fix/finish|S|Y||operator native vocabulary",
  "Kill-chain timing: time-critical targets, dwell vs latency|K|P|m|key to mobile target problem",
  "Sensor-to-shooter latency budgets end-to-end|K|P|m|single biggest gap in textbooks",
  "Kill webs and mosaic warfare concepts|S|P||current concept debates",
  "Kill-chain disruption as strategy (system destruction warfare)|K|P||Chinese doctrine and US counter",
 ]),
 ("ISR architecture", ["JP","NPSSS","RAND"], "P10", [
  "ISR collection disciplines (IMINT, SIGINT, MASINT, HUMINT, OSINT)|S|Y||vocabulary",
  "Persistence, revisit, coverage trade across platforms|K|P||why no single sensor suffices",
  "Processing, exploitation, dissemination (PED) bottlenecks|K|P|m|analyst bottleneck, AI promise",
  "Wide-area search vs point surveillance|K|P||search theory link",
 ]),
 ("Targeting process", ["JMEM","JP"], "P11", [
  "Joint targeting cycle and target development|S|Y||operational core",
  "Target location error (TLE) categories and their weapon implications|K|P|m|cross-links sensor and weapon",
  "Collateral damage estimation methodology|S|Y||legal-operational constraint",
  "Battle damage assessment and its biases|K|P|m|overclaiming in every war",
  "Dynamic targeting and time-sensitive targeting|S|Y||operational core",
 ]),
 ("Data fusion and AI", ["CRAN_MESE","RAND"], "P2", [
  "JDL fusion levels|S|N||vocabulary",
  "AI/ML for detection/targeting (e.g., Maven-class) and limits|K|P|m|current debates",
  "Automation bias and human-machine teaming|K|P||decision quality",
  "Data quality, labeling and adversarial ML|S|N|m|why AI claims fail in field",
 ]),
 ("Command and control", ["JP","HUGH"], "P7", [
  "C2 philosophies: centralized vs mission command, in a degraded spectrum|S|Y||operator native",
  "Decision cycles (OODA) and tempo quantification|S|Y||known but rarely quantified",
  "Battle management aircraft (AEW&C, JSTARS) vs space alternatives|S|P||force structure debate",
 ]),
]))

D.append(("SP", "Space systems and space warfare", [
 ("Orbital mechanics", ["SMAD","NPSSS","AFIT"], "P13", [
  "Kepler's laws, orbital period, vis-viva|K|N||all space claims start here",
  "Orbit types: LEO, MEO, GEO, HEO/Molniya, SSO|K|P||mission matching",
  "Perturbations (J2, drag), orbit lifetime|S|N||constellation upkeep",
  "Delta-v budgets and maneuver costs (Hohmann, plane change)|K|N||counterspace and maneuver claims",
  "Ground track and revisit|K|N||ISR timing and adversary predictability",
 ]),
 ("Mission geometry and coverage", ["SMAD","NPSSS"], "P13", [
  "Earth-central angle, footprint, elevation constraints|K|N||coverage calculations",
  "Constellation design (Walker), number of satellites for continuous coverage|K|N||proliferated constellation debates",
  "Access windows and revisit statistics|K|N||how often a target is seen",
 ]),
 ("Space payloads and missions", ["SMAD","NPSSS"], "P13", [
  "EO imaging from space: aperture, GSD, swath trade|K|N||imagery resolution claims",
  "Space SAR: resolution, revisit, area rate|K|N||all-weather ISR",
  "SIGINT and RF geolocation constellations|S|N||ship tracking",
  "Missile warning and tracking IR satellites|K|N||BMD enabler",
  "SATCOM payloads: transponders, spot beams, protected SATCOM|K|N||resilient C2",
  "Commercial imagery and analytics market|K|P|m|OSINT revolution",
 ]),
 ("Spacecraft engineering", ["SMAD"], "P13", [
  "Subsystem budgets: mass, power, thermal, propulsion|S|N||feasibility checks",
  "ADCS and pointing|C|N||awareness",
  "TT&C and ground segment|S|N||vulnerable node",
  "Onboard processing and edge computing|C|N||emerging",
  "Structures, mechanisms, thermal detail|N|N||engineer detail",
  "Small satellites, CubeSats capability limits|K|N||what small sats can and cannot do",
 ]),
 ("Launch", ["SMAD","NPSSS"], "P13", [
  "Launch vehicle performance and cost per kg trends|K|N||space economics revolution",
  "Responsive launch and reconstitution|S|N||resilience strategy",
  "Launch site and range operations|C|N||awareness",
 ]),
 ("Space environment", ["SMAD"], "P13", [
  "Radiation, space weather effects on systems|S|N||outage explanations",
  "Debris and Kessler syndrome; ASAT test consequences|K|N||policy debates",
 ]),
 ("Counterspace and space control", ["CSIS","JP","NPSSS"], "P13", [
  "Counterspace taxonomy: kinetic, co-orbital, directed energy, EW, cyber|K|P|m|textbooks (SMAD) omit it",
  "Space domain awareness: sensors and catalog|K|N||attribution and targeting",
  "Resilience via proliferation, maneuver, disaggregation|K|N||force design",
  "Space law and norms (OST, debris norms)|S|N||articles and policy",
 ]),
 ("Space economics and programs", ["SMAD","DAU","CSIS"], "P13", [
  "Space cost estimation and program risk|S|N||budget debates",
  "Commercial-military integration and dependency|K|P|m|Starlink, Maxar lessons",
 ]),
]))
