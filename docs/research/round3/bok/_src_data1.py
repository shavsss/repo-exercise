# Subtopic line: "name|IMP|OP|M|why"  IMP in K,S,C,N ; OP: Y likely covered by operational background, P partial, N no ; M: 'm' = commonly missing from textbook curricula
D = []
D.append(("F", "Foundations: the quantitative toolkit", [
 ("Decibels and budget arithmetic", ["ADAMY","CRAN_MESE","NPSEW"], "P0", [
  "dB, dBm, dBW, dBi, dBsm and dB-Hz conversions|K|P||every RF claim is a dB budget; fluency is the entry ticket",
  "Link budget bookkeeping (gains, losses, margins)|K|P||the universal template for radar, EW, comms, GNSS",
  "Fourth-power vs square-law scaling (radar vs one-way)|K|N||explains why jammers out-shout radars and range barely moves with power",
  "Mental estimation to 10-20% (logs, powers of ten, rule-of-thumb constants)|K|P|m|authority = instant sanity check of claims in interviews",
  "Noise power kTB and noise figure|K|N||sets every sensitivity number",
 ]),
 ("Electromagnetic waves", ["NPS533","CRAN_MESE","SKOL"], "P0", [
  "Wavelength, frequency, band designations (IEEE and NATO letter bands)|S|Y||operators know bands by name; must map to physics",
  "Plane waves, power density, inverse-square law|K|P||basis of all range equations",
  "Polarization (linear, circular, cross-pol)|S|N||matters for jamming, clutter, antenna mismatch",
  "Reflection, refraction, diffraction, scattering regimes (Rayleigh/resonance/optical)|K|N||explains RCS vs frequency and why low-band radars see stealth",
  "Atmospheric and rain attenuation vs frequency|S|P||drives band choice and weather limits",
  "Maxwell's equations derivation detail|N|N||engineer-level; not needed to judge systems",
 ]),
 ("Signals and spectra", ["RICH","CRAN_MESE","NPS533"], "P0", [
  "Fourier transform intuition: time-bandwidth duality|K|N||resolution = 1/bandwidth governs radar, comms, ELINT",
  "Convolution and linear filtering|S|N||needed to read matched-filter and imaging arguments",
  "Sampling theorem, aliasing, ambiguity of sampled measurements|K|N||PRF ambiguities, digital receivers, Doppler folding",
  "Windowing and sidelobes|S|N||sidelobes = clutter leakage and jamming entry",
  "DFT/FFT processing gain|S|N||coherent integration gain arguments",
  "Modulation basics (AM/FM/PM, I/Q)|S|P||understanding receivers and DRFM",
  "Z-transforms, filter design detail|N|N||implementation level",
 ]),
 ("Probability, noise and detection", ["RICH","SKOL","NPS360","CRAN_MESE"], "P0", [
  "Random variables, distributions (Gaussian, Rayleigh, exponential, Poisson, binomial)|K|N||all Pd/Pk/attrition models rest on these",
  "Detection as hypothesis test: Pd, Pfa, ROC|K|N||central to radar, sonar, IR, ESM claims",
  "SNR required for given Pd/Pfa (Albersheim/Shnidman level)|K|N||lets one turn a range claim into a check",
  "Independence assumptions and their failure (correlated shots, common-mode)|K|N|m|most inflated Pk/leakage claims hide correlated failures",
  "Bayes' rule and base rates (false alarms, classification)|K|P||ATR, IFF, intelligence assessment",
  "Random processes, power spectral density|S|N||noise jamming and clutter spectra",
  "Order statistics and extreme values|C|N||CFAR and leakage tails",
 ]),
 ("Estimation and measurement accuracy", ["RICH","KAPL","ZARCH"], "P0", [
  "Least squares and error propagation|K|N||geolocation, tracking, navigation accuracy",
  "Cramer-Rao bound idea: accuracy ~ resolution / sqrt(SNR)|K|N||one formula checks most accuracy claims",
  "Dilution of precision / geometry of measurements|K|P||GNSS, TDOA, triangulation all share it",
  "Error ellipses, CEP vs sigma conversions|K|P||targeting and weapon accuracy language",
  "Bias vs random error; calibration|S|P||systematic errors dominate real systems",
 ]),
 ("Control and dynamics basics", ["CRAN_GWS","ZARCH","NPS533"], "P0", [
  "Feedback loops, time constants, bandwidth|K|N||guidance time constant drives miss distance",
  "Transfer functions and frequency response (Bode level)|S|N||needed to read autopilot and tracking-loop arguments",
  "Stability margins|C|N||awareness",
  "State-space representation|S|N||Kalman filter and modern guidance language",
 ]),
 ("Geometry, coordinates and time", ["KAPL","SMAD","ADAMY"], "P0", [
  "Earth models, ECEF/ENU/geodetic frames|S|P||navigation and targeting coordinates",
  "Radar/radio horizon (4/3 earth)|K|Y||low-altitude penetration and cruise-missile detection",
  "Spherical trigonometry for bearing/range on Earth|S|P||EW geolocation and long-range engagements",
  "Time systems (UTC, GPS time) and synchronization|S|N||TDOA, networks, fires timing",
 ]),
 ("Systems engineering basics for analysts", ["SE","DAU","BOORD"], "P7", [
  "Requirements hierarchy: KPP/KSA, MOE/MOP/TPM|K|P|m|articles must separate effectiveness from performance",
  "Trade studies and sensitivity analysis|K|P||how to judge design choices",
  "Reliability, availability, maintainability (MTBF, Ao)|K|P|m|availability often dominates delivered capability",
  "Interfaces, integration risk and system-of-systems|S|P||integration is where programs fail",
  "MBSE and digital engineering|C|N||vocabulary for program interviews",
 ]),
]))

D.append(("AP", "Antennas and propagation", [
 ("Antenna fundamentals", ["SKOL","CRAN_MESE","ADAMY"], "P1", [
  "Gain, effective aperture, beamwidth ~ lambda/D|K|N||links size, frequency and angular accuracy",
  "Sidelobes and back lobes|K|N||sidelobe jamming and ARM homing",
  "Antenna types (dish, horn, spiral, log-periodic, array)|S|P||recognize systems from photos",
  "Polarization diversity|C|N||awareness",
 ]),
 ("Phased and digital arrays", ["RICH","GTRI","CRAN_MESE"], "P1", [
  "Electronic steering, grating lobes, scan loss|K|N||AESA claims and field-of-regard limits",
  "AESA vs PESA: T/R modules, graceful degradation, power-aperture|K|P||central to modern radar/EW comparisons",
  "Digital beamforming and simultaneous beams|K|N||multi-function radar timelines and EP",
  "GaN vs GaAs vs TWT power sources|S|N||explains generational capability jumps",
  "Cost per T/R module and aperture economics|S|N|m|why some radars are rare and expensive",
 ]),
 ("Propagation", ["SKOL","ADAMY","CRAN_MESE"], "P1", [
  "Line of sight, two-ray multipath, Fresnel zones|K|P||low-altitude detection and datalink range",
  "Anomalous propagation and ducting|S|P||over-sea surprises",
  "Ionospheric propagation (HF, OTH radar, scintillation)|S|P||OTH radar and GNSS errors",
  "Foliage, building and terrain loss|S|Y||urban comms and FOPEN",
  "Propagation models (ITM/Longley-Rice) detail|N|N||tool level",
 ]),
 ("One-way link and receiver sensitivity", ["ADAMY","NPSEW"], "P1", [
  "One-way link equation and free-space loss|K|P||basis of ESM, comms, jamming",
  "Receiver sensitivity: kTB + NF + required SNR|K|N||why ESM detects radars far beyond radar range",
  "Dynamic range and intermodulation|S|N||receiver saturation by friendly emitters/jammers",
 ]),
]))

D.append(("R", "Radar", [
 ("Radar principles and range equation", ["SKOL","RICH","GTRI","NPSEW","CRAN_MESE"], "P2", [
  "Pulse radar basics: range, PRF, duty cycle, unambiguous range|K|P||vocabulary of every radar discussion",
  "Radar range equation (peak-power form)|K|P||the master equation",
  "Search radar equation (power-aperture, frame time)|K|N||determines surveillance capacity",
  "Track radar equation (power-aperture^2 trade)|S|N||fire-control sizing",
  "Losses budget realism (system, atmospheric, processing)|K|N|m|vendor ranges omit losses; analyst must add them",
  "R^4 scaling: what doubling range costs|K|N||key to judging claims",
 ]),
 ("Target signatures (RCS)", ["SKOL","RICH","BALL"], "P2", [
  "RCS definition, dBsm, typical values by target class|K|P||orders of magnitude for stealth debates",
  "RCS vs aspect and frequency; specular vs edge/creeping|K|N||why stealth is band- and aspect-limited",
  "Swerling fluctuation models and fluctuation loss|S|N||Pd realism",
  "Shaping vs RAM; stealth limits at low band|K|N||counter-stealth (VHF/UHF, bistatic, IR) arguments",
  "RCS measurement and prediction (ranges, CEM)|C|N||awareness of how numbers are produced",
  "Stealth sustainment and cost of low observability|S|N|m|operational availability of LO fleets",
 ]),
 ("Clutter and environment", ["RICH","SKOL","GTRI"], "P2", [
  "Surface and volume clutter, sigma-zero, clutter-to-noise|K|N||look-down and littoral performance",
  "Sea clutter and sea-skimmer detection|K|P||ship defense timelines",
  "Rain and chaff as volume clutter|S|P||weather-limited operations",
  "Clutter statistics (K, Weibull, log-normal)|C|N||awareness",
 ]),
 ("Detection and signal processing", ["RICH","GTRI"], "P2", [
  "Matched filter and SNR = E/N0|K|N||energy, not power, detects",
  "Coherent vs non-coherent integration|K|N||dwell time trade",
  "Threshold detection and CFAR|S|N||false-alarm control, CFAR capture by jammers",
  "Pulse compression (LFM, phase codes), range resolution|K|N||how low-peak radars get resolution; LPI basis",
  "Ambiguity function|S|N||Doppler tolerance and waveform choice",
  "MTI and pulse-Doppler, blind speeds, PRF regimes (low/medium/high)|K|P||notch exploitation by attackers",
  "Range-Doppler ambiguity resolution|S|N||MPRF tactics",
  "Signal processor architectures detail|N|N||implementation",
 ]),
 ("Measurements and tracking", ["RICH","SKOL","ZARCH"], "P2", [
  "Angle measurement: monopulse, conical scan|K|N||why some deception works and some does not",
  "Range and Doppler accuracy|S|N||fire-control quality",
  "Kalman filter tracking, alpha-beta, motion models (IMM)|K|N||maneuvering targets and track loss",
  "Data association, multi-target tracking (GNN, JPDA, MHT)|S|N||saturation raids and decoys",
  "Track quality, latency and fire-control-quality tracks|K|P|m|sensor-to-shooter and engage-on-remote depend on it",
  "Sensor fusion and multi-sensor tracking (centralized/distributed)|K|P||CEC-type networks",
 ]),
 ("Radar modes and system types", ["RICH","SKOL","GTRI","BOORD"], "P2", [
  "Multifunction phased-array radar timeline/resource management|K|N||how saturation actually defeats radars",
  "Airborne radar: look-down, PD, GMTI, STAP|K|P||AEW&C, fighters, JSTARS-class",
  "SAR/ISAR imaging, resolution, revisit|K|P||ISR claims, space SAR",
  "Fire-control radars and illuminators|S|Y||SAM engagement chain",
  "Early warning and OTH radars|S|P||strategic warning time",
  "FMCW/CW radars (proximity fuzes, seekers, short range)|S|N||fuzes, C-UAS radars",
  "MMW radars (seekers, APS, C-UAS)|S|P||APS and seekers",
  "Passive/bistatic radar (PCL)|K|N||counter-stealth and covert detection claims",
  "MIMO and cognitive radar|C|N||emerging claims; know hype vs reality",
  "Weather, ATC, GPR, police radars|N|Y||outside the core",
  "FOPEN radar|C|N||niche",
  "Polarimetry, compressed sensing, space-time coding detail|N|N||research-level",
 ]),
 ("Radar ECCM / electronic protection", ["GTRI","SCHL","ADAMY"], "P4", [
  "EP techniques catalogue: low sidelobes, SLB/SLC, frequency agility, PRF jitter, burn-through modes|K|N||the radar half of the EW duel",
  "Adaptive nulling and STAP against jamming|S|N||why some jammers fail",
  "Home-on-jam and passive tracking|S|P||jammer self-protection limits",
  "Countermeasure/counter-countermeasure cycle and its timescales|K|P|m|authority must explain who leads and for how long",
 ]),
 ("Radar ATR and classification", ["RICH","GTRI"], "P2", [
  "NCTR: HRR profiles, JEM, micro-Doppler|S|N||ID before engagement, drones vs birds",
  "ML-based ATR performance and brittleness|S|N|m|claims of AI target recognition need skeptical evaluation",
 ]),
]))

D.append(("EO", "Electro-optical and infrared sensing", [
 ("EO/IR fundamentals", ["DRIG","NPS533","CRAN_GWS","CRAN_MESE"], "P3", [
  "Spectral bands (VIS, NIR, SWIR, MWIR, LWIR) and what each sees|K|P||sensor choice and countermeasure choice",
  "Blackbody radiation, emissivity, Planck/Wien/Stefan-Boltzmann|K|N||plume and skin signatures",
  "Radiometry chain: source - atmosphere - optics - detector|K|N||range estimates for IRST/MAWS",
  "Atmospheric transmission windows, MODTRAN-level awareness|S|N||weather limits",
 ]),
 ("Optics and resolution", ["DRIG","NPS533"], "P3", [
  "Diffraction limit and IFOV; GSD from space|K|N||checks imagery-resolution claims",
  "MTF and system blur|S|N||image quality",
  "Sampling and detector pitch|S|N||pixel-limited vs optics-limited",
 ]),
 ("Detectors and sensors", ["DRIG","NPS533"], "P3", [
  "Detector types: InSb, HgCdTe, microbolometer, QWIP/T2SL; cooled vs uncooled|K|P||cost, availability, export-controlled tech",
  "NETD, D*, noise sources|S|N||sensitivity comparisons",
  "Focal-plane arrays, NUC, ROIC|C|N||awareness",
  "Image intensifiers and night vision generations|S|Y||operators know them",
 ]),
 ("Performance modeling", ["DRIG"], "P3", [
  "Johnson criteria and TTP/NV-IPM: detect/recognize/identify ranges|K|P||ID range drives ROE and fratricide",
  "IRST detection ranges against aircraft and missiles|K|N||counter-stealth and passive fire control",
  "Search with EO sensors (FOV vs FOR)|S|P||soda-straw problem of ISR",
  "Human perception and operator fatigue|S|Y||operator-in-the-loop performance",
 ]),
 ("Special EO systems", ["DRIG","NPS533"], "P3", [
  "Laser rangefinders and designators, spot size, beam divergence|K|Y||laser-guided weapon chain",
  "Hyperspectral and multispectral detection|S|N||camouflage defeat, space ISR",
  "Lidar|C|N||awareness",
  "Missile warning (UV/IR MAWS) and false alarm problem|K|P||self-protection",
  "Camouflage, concealment and decoys against EO|S|Y||operators know practice",
  "Lab measurement of IR cameras|N|N||test-engineer detail",
 ]),
]))

D.append(("EW", "Electronic warfare and electromagnetic spectrum operations", [
 ("EW concepts and doctrine", ["JP","ADAMY","SCHL","NPSEW"], "P4", [
  "ES/EA/EP definitions; EMSO, spectrum management|S|Y||doctrine vocabulary",
  "EW in the kill chain (find/fix/track/target/engage/assess)|K|P||where each EW action bites",
  "EW reprogramming and mission data files|K|P|m|threat library currency decides outcomes",
  "Spectrum as maneuver space; EMCON|S|Y||operational practice",
  "EW-cyber convergence (CEMA)|S|P||modern doctrine",
 ]),
 ("ES, ESM and SIGINT", ["ADAMY","SCHL","NPSEW"], "P4", [
  "EW receiver types (crystal video, IFM, superhet, channelized, digital)|S|N||why some threats are missed",
  "Probability of intercept and search strategies|K|N||LPI and scanning-search trade",
  "Pulse deinterleaving, PDWs, emitter ID and libraries|S|N||ambiguous/new modes",
  "ELINT vs COMINT vs ESM roles|S|Y||intelligence architecture",
  "RWR design and limitations|K|P||pilot experience vs physics",
 ]),
 ("Emitter geolocation", ["ADAMY","NPSEW"], "P4", [
  "AOA triangulation, interferometry, accuracy vs baseline|K|N||targeting from passive sensors",
  "TDOA/FDOA and precision geolocation|K|N||SIGINT satellites, artillery against emitters",
  "Single-platform passive ranging|S|N||fighters/drones locating SAMs",
  "Geolocation error ellipse to weapon delivery|K|N|m|link between SIGINT and strike",
 ]),
 ("Electronic attack: jamming", ["ADAMY","SCHL","GTRI"], "P4", [
  "J/S equations: self-protection vs stand-off vs escort|K|N||the core EW duel arithmetic",
  "Burn-through range|K|P||what jamming really buys",
  "Noise jamming: spot, barrage, swept; power density limits|K|N||spreading power thins it",
  "Stand-in jamming and expendable jammers|K|P||drone-enabled EW trends",
  "Communications jamming geometry (jammer-to-receiver vs transmitter-to-receiver)|K|P||why comms jamming works on the receiver end",
  "Jamming of GNSS and datalinks|S|Y||ubiquitous in current wars",
 ]),
 ("Deception and decoys", ["ADAMY","SCHL"], "P4", [
  "Range/velocity gate pull-off, inverse gain, cross-eye|S|N||how self-protection jammers break tracks",
  "DRFM: coherent deception and false targets|K|N||modern EA centerpiece",
  "Chaff and corner reflectors|S|Y||naval and air expendables",
  "Towed and active decoys (towed RF decoys, MALD-class)|K|P||air campaign enablers",
  "Decoy realism requirements (signature fidelity in multiple bands)|S|N|m|how discriminating sensors defeat decoys",
 ]),
 ("IR countermeasures", ["ADAMY","DRIG","BALL"], "P4", [
  "Flares (conventional, spectral, kinematic) and seeker counter-countermeasures|K|P||MANPADS survival",
  "DIRCM and lasers vs IR seekers|K|P||helicopter/transport protection",
  "Signature suppression (plume, skin)|S|N||LO in IR",
 ]),
 ("LPI and communications EW", ["ADAMY","SCHL"], "P4", [
  "Spread spectrum: DSSS, FHSS, processing gain vs jamming|K|N||why some links survive",
  "LPI radar waveforms and detectability|K|N||ESM vs LPI duel",
  "Comms intercept and direction finding of tactical radios/phones|K|Y||emitter discipline kills (Ukraine lessons)",
  "Satellite link jamming (uplink vs downlink)|S|N||SATCOM resilience",
 ]),
 ("Suppression and destruction of enemy air defenses", ["JP","HIST","ADAMY","BALL"], "P4", [
  "SEAD/DEAD concepts and history (Bekaa 1982, Desert Storm, Kosovo, Ukraine)|K|Y||operational core",
  "Anti-radiation missiles: seekers, memory, shutdown tactics|K|P||ARM vs emission control game",
  "Integrated air defense system architecture and its seams|K|P||where to hit",
  "SEAD force ratios and attrition expectations|S|N|m|cost of rolling back an IADS",
 ]),
 ("EW modeling, simulation, test", ["ADAMY","DOTE"], "P4", [
  "EW engagement M&S levels (engineering/engagement/mission/campaign)|S|N|m|claims cite models at the wrong level",
  "Threat simulators, ranges and hardware-in-the-loop|S|N|m|why EW performance is hard to verify",
  "EW operator interfaces|N|Y||operators know",
 ]),
 ("Directed energy", ["NPS533","DOTE","RAND"], "P11", [
  "High-energy lasers: power, beam quality, dwell time, atmospheric limits|K|N||counter-drone hype checking",
  "High-power microwave weapons and EMP effects on electronics|S|N||C-swarm claims",
  "Cost per shot and magazine of directed energy|K|N|m|core of the cost-exchange argument",
 ]),
]))
