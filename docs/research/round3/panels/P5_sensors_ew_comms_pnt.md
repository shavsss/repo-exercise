# Panel P5: sensors, EW, communications, PNT (Lanchester P1–P5)

Panel: radar systems engineer, EW officer-engineer, EO/IR and PNT specialist. Domains: Antennas and propagation; Radar; EO/IR; EW and EMSO; Communications, datalinks and networks; PNT.

Method: section headings were extracted for every source range of modules M1.1–M5.11 (plus host modules M6.6, M6.7, M7.x, M9.5, M11.10, M12.1) from the PDFs with `pdftotext`. Every K/S subtopic was then checked against those headings and against keyword searches over all military books, articles and doctrine. Key pages were read directly. SMAD (B12) is image-only and has no text layer, so items the merge placed in M13.x could not be text-verified.

## Counts

- Subtopics: 185 (K 93, S 68, C 13, N 11).
- Final status, all: full 124, partial 45, missing 16. K+S only: full 105, partial 42, missing 14.
- The merge was far too pessimistic here. 34 items it marked *missing* are actually taught (full or partial), and 26 items it marked *partial* are full. The worst misses are EW.4.1 (J/S equations: B01 §9.1–9.3 and B02a §12.3), R.7.1 (the EP catalogue: all of B02a ch.12 in M4.16), EW.5.1 (RGPO/VGPO/cross-eye: B01 §9.5–9.9), R.1.5 (losses: B02 §2.7), EO.5.2 (hyperspectral: M3.12 is a whole article on it), PNT.1.4 (DOP: B05 §7.3.1, not SMAD) and COM.3.1 (all of M9.5).
- Importance changes (10, all upward): M:AP.2.4 S->K, M:R.6.9 C->S, M:R.6.10 N->C, M:EO.5.3 C->S, M:EW.1.4 S->K, M:EW.4.6 S->K, M:EW.5.5 S->K, M:EW.9.3 N->C, M:COM.4.6 C->S, M:PNT.3.5 C->S.
- Unmatched / N-only / C-only / non-teaching sections reviewed: 383 sections, 1738 pages. **NOT NEEDED: 114 sections, 416 pp.** KEEP: 269 sections, 1322 pp. Of the kept sections, 47 (185 pp) are test-out candidates, and the problem sets (71 pp) are kept as exercise sources, not as reading.
- Added subtopics that neither the map nor the books cover: 12.

## Truly missing (no teaching text anywhere in the library)

| id | imp | what to add | host |
|---|---|---|---|
| M:AP.2.5 Cost per T/R module and aperture economics | S | cost per T/R module trend ($/element), array cost vs aperture, digital-array cost curves; ref figures for sizing claims (e.g. 1000s elements x $k) | M1.2 |
| M:R.7.4 Countermeasure/counter-countermeasure cycle and its timescales | K | historical CM/CCM cycles with timescales (Vietnam SA-2/QRC pods ~months; 1973 SA-6 gap; 1982 Bekaa; Ukraine 2022-25 weekly adaptation of drones/EW); reprogramming loop latency; why EW advantage is transient | M4.1 |
| M:R.10.4 Counter-stealth architectures (low-band + IRST + passive + network) | K | counter-stealth architecture: low-band (VHF/UHF) search + IRST + PCL + multistatic + network fusion to fire-control quality; why low-band tracks are not weapons-quality; Chinese/Russian claims | M2.4 |
| M:EO.5.3 Lidar | S | lidar/ladar: range equation (1/R^2 vs 1/R^4 for extended target), flash lidar seekers, autonomy/drone nav use | M3.13 |
| M:EW.1.3 EW reprogramming and mission data files | K | reprogramming cycle, mission data files, threat libraries, latency of updates; Ukraine weekly reprogramming | M4.3 |
| M:EW.1.5 EW-cyber convergence (CEMA) | S | CEMA convergence, RF-delivered cyber effects | M4.1 |
| M:EW.8.2 Anti-radiation missiles: seekers, memory, shutdown tactics | K | ARM seeker physics (broadband passive, DF accuracy, memory/INS/GPS and MMW terminal), shutdown tactics, AARGM-ER | M4.10 |
| M:EW.10.3 Cost per shot and magazine of directed energy | K | cost per shot, magazine depth, weather availability of DE vs interceptors; cost-exchange arithmetic | M3.13 |
| M:EW.12.4 Cost and production of EW systems vs drones | S | unit costs of EW systems vs drones; production rates (Ukraine/Russia) | M4.1 |
| M:COM.2.5 LPI/LPD datalinks for stealth platforms (MADL, IFDL) | S | LPI/LPD directional datalinks for stealth fleets (MADL/IFDL), interoperability gap with Link 16 | M7.9 |
| M:COM.3.3 Fiber-optic controlled drones as EW counter | K | fiber-optic FPV drones: spool length/weight, immunity to RF jamming, counter-measures | M9.7 |
| M:COM.4.2 Resilience: degraded, intermittent, limited bandwidth (DIL) | K | DDIL operations: store-and-forward, mission command, graceful degradation design | M7.9 |
| M:COM.4.6 Crypto, key management and COMSEC basics | S | COMSEC basics, key management, crypto in datalinks; consequences of unencrypted comms | M7.9 |
| M:PNT.3.5 Quantum sensors (atomic clocks, cold-atom inertial) | S | quantum clocks/inertial: physics, maturity, claims | M5.11 |

## Most important partial gaps (K)

| id | have | missing | host |
|---|---|---|---|
| M:AP.2.2 AESA vs PESA: T/R modules, graceful degradation, power-aperture | M1.2 B08 4.4.3-4.4.4 181-186 (ESA, AESA); M2.8 B02 10.3.3-10.3.4 401-407 (solid-state, MPM); M2.22 B02b 4.2.4  | explicit AESA-vs-PESA comparison table: graceful degradation numbers, distributed vs central transmitter losses, T/R count vs power-aperture, why AESA enables LPI/EA modes; partly scattered | M1.2 |
| M:R.2.4 Shaping vs RAM; stealth limits at low band | M2.4 B08 4.6.1-4.6.2 196-202 (shaping, RAM, inlets); M2.4 B02 6.4 261-264 (Rayleigh/resonance regimes); B16 4. | explicit statement + numbers: shaping effective only in optics region (L > ~10 lambda); VHF/UHF radars see resonance-region RCS; RAM thickness/weight vs wavelength; counter-stealth low-band radars (Nebo, 1L13) | M2.4 |
| M:R.5.5 Track quality, latency and fire-control-quality tracks | M2.22 B02b 4.1.2-4.1.3 146-147, 4.3.1 185-190 (FCR, kill chain); M2.15 B02 19.7 803; B16 3.2.3 283 (ref) | explicit track-quality metrics (covariance, update rate, latency) required for fire control vs surveillance; why surveillance tracks cannot cue interceptors without handover; numbers | M2.22 |
| M:R.10.1 Radar coverage diagrams and low-altitude gaps as tactical facts | M1.3 B02 4.2,4.9 155,181-192 (propagation factor, lobing); M2.15 B08 3.8 152-155; M7.2 B07 5.5 96-104 | vertical coverage diagram reading, radar horizon table (h=10 m target at 9-13 km vs 30 km for 50 m), gap-filler/aerostat/AEW logic as tactical facts | M1.3 |
| M:R.10.2 Ground-based radar survivability vs ARMs and drones | M7.8 B02b 8.6 382-383 (EMCON, ARM decoys); B16 3.x (ref) ARM mentions | ARM survivability measures (decoys, blinking, displacement times), loitering-munition threat to radars (Harop, Lancet), loss data from Ukraine | M7.8 |
| M:EO.4.2 IRST detection ranges against aircraft and missiles | M3.13 B04 4.4.3 110-111; M3.10 B08 5.5.3 227; M3.10 B10 ch.14 171-176 (IRST, Hebrew block); M2.22 B02b 4.2 144 | quantitative IRST detection range vs aircraft aspect/afterburner (tail 50-100 km, head-on 20-50 km), contrast/clutter limits, IRST vs stealth, PIRATE/OLS examples | M3.10 |
| M:EO.5.4 Missile warning (UV/IR MAWS) and false alarm problem | M4.10 B08 6.5.2 271 (MWS IR/UV); M7.6 A07.2 (MAWS for BMD); B16 4.4.2 566-568 (ref, threat warning) | UV vs IR MAWS physics (solar-blind UV, short range), false-alarm rates, declaration time vs MANPADS time-of-flight | M4.10 |
| M:EW.1.2 EW in the kill chain (find/fix/track/target/engage/assess) | M2.22 B02b 4.1.2 146-147 (kill chain & FCR); M4.1 B16 3.2.2-3.2.3 282-288 (ref, AD operational functions); M7. | mapping of each EW/EP function onto F2T2EA steps, which step EW breaks cheapest | M4.1 |
| M:EW.1.4 Spectrum as maneuver space; EMCON | M4.16 B02a 12.6.3 587 (EMCON); M2.4 B08 4.6.4 203-204 (LPI); M2.4 B09 11.5.5 301 (emitted signals); M12.1 D5 2 | EMCON doctrine and 'emit and die'; spectrum as maneuver space | M4.1 |
| M:EW.2.5 RWR design and limitations | M4.10 B08 6.5.1 270-271 (RWR layout, spiral antennas, vs AESA LPI); M4.14 B01 11.7.4 293-295 (RWR antenna); M4 | RWR sensitivity budget vs threat ERP, ambiguity/ID errors, limitations vs LPI and CW | M4.2 |
| M:EW.4.4 Stand-in jamming and expendable jammers | M4.16 B02a 12.2.1-12.2.2 557-564 (SSJ, ESJ, SOJ, SIJ, expendable, TRD); M4.7 B08 6.4.3 267-268 | stand-in jammer math (range advantage, R^2 vs R^4), drone-borne stand-in jammers, numbers | M4.7 |
| M:EW.5.5 Decoy realism requirements (signature fidelity in multiple bands) | M4.9 B01 10.7 259-264 (effective RCS through an engagement); A10.4 Reed IR off-board CM; M7.6 A07.1 Sessler co | multi-band signature fidelity, kinematic realism, cost-exchange of decoys (Gerbera-type)  | M4.9 |
| M:EW.6.2 DIRCM and lasers vs IR seekers | M4.10 B04 4.7.2 120-121 (IR jammers incl. laser); M6.6 B06 3.4.4 140-143; B16 580-581 (ref) | DIRCM: closed-loop jam codes, laser power, imaging-seeker resistance | M4.10 |
| M:EW.7.3 Comms intercept and direction finding of tactical radios/phones | M4.11 B01 7.2.4-7.4.8 149-160 (detect/intercept/locate hoppers, DS); M4.11 B04 5.10 167-171; M4.6 B01 8.4.2 17 | cellular/handset intercept and geolocation (IMSI catchers, Ukraine phone-based targeting) | M4.11 |
| M:EW.8.1 SEAD/DEAD concepts and history (Bekaa 1982, Desert Storm, Kosovo, Ukraine) | B16 1.1 61-70 (ref Ball, SEAD/escort-jamming package example; pages NOT attached to any module); M8.1 B16 3.1  | SEAD/DEAD case history and lessons: 1973, Bekaa 1982, Desert Storm, Kosovo 1999, Ukraine 2022-; attach Ball 61-70 as ref | M12.1 |
| M:EW.8.3 Integrated air defense system architecture and its seams | M12.1 D5 4 100-110, C 223-234 (Russian AD organization); M12.3 D6 217-230; M7.2 B07 5 70-113 (AMD architecture | IADS seams: sensor-shooter networks, C2 nodes, radar horizon gaps, mobility; analytical decomposition | M12.1 |
| M:EW.10.1 High-energy lasers: power, beam quality, dwell time, atmospheric limits | M3.13 B08 5.6.3 236 (ABL); M7.6 A07.2 APS boost-phase report (lasers, thermal blooming); B06 6.1 25-26 | HEL fundamentals: power-on-target, beam quality M^2, dwell time vs hardness (kJ/cm^2), thermal blooming, turbulence, numbers for 50-300 kW C-UAS/C-RAM lasers (Iron Beam) | M3.13 |
| M:EW.12.1 EW order of battle and density on modern fronts | M12.1 D5 5 138-142 (Russian REB complexes, table 5-1), F 238-240 (EM capabilities table); M12.2 D5 | EW density/order of battle on modern fronts (Ukraine: systems per km of front), Chinese EW OOB | M12.1 |
| M:EW.12.2 Electromagnetic signature management of ground forces | M12.2 D5 (camouflage/EMCON practice); M2.4 B09 11.5.5 301; M4.16 B02a 12.6.3 587 | ground-force signature management: radio discipline, CP emissions, Starlink/phones as beacons, detection ranges by ESM | M4.1 |
| M:COM.2.3 Cooperative Engagement Capability-class composite tracking | M2.29 B02a 15.3 716-719 (fusion architectures); M2.23 B02b 6.8 306-307 (netcentric MPARS); M7.9 B08 7.4.2-7.5  | CEC/IBCS: composite tracking, engage-on-remote, timing/registration requirements, data rates | M7.9 |
| M:COM.2.4 Weapon datalinks (in-flight updates, terminal handover) | M2.22 B02b 4.3.3 191-195 (missile guidance principles, command/TVM); M4.1 B04 2.3.3 33 (command guidance); M7. | in-flight target updates, two-way weapon datalinks (network-enabled weapons), jamming exposure | M6.3 |
| M:COM.2.6 Datalink latency and message timeliness budgets | M7.9 A08.9 RAND (Link 16 timeliness/latency in air combat); A08.7 (latency over IP/Link16); M9.5 B09 13 326,34 | end-to-end latency budget sensor->C2->shooter; track staleness vs target speed | M7.9 |
| M:COM.3.2 Commercial radios, FHSS hobby links and their jamming/geolocation | M5.8 B08 8.2 306-307 (radio nav, wrong match); M9.5 B09 14.3 (AJ generic); M4.11 B01 7.2 (FHSS hopping, interc | COTS 2.4/5.8 GHz drone links (OcuSync-class), their jamming and geolocation (Aeroscope), video link frequency shifts in Ukraine | M9.7 |
| M:COM.4.3 Commercial proliferated SATCOM (Starlink-class) in war | M5.11 A05.4 Kassas Starlink carrier-phase (nav use only); M12.4 D6 198-213 (Chinese view, mentions); M13.10 SM | Starlink-class use in war: terminals, jamming resistance, geolocation of terminals, dependence on a private actor | M13.10 |
| M:PNT.2.4 Effects on weapons: JDAM/GMLRS-class degradation under jamming | M11.10 B10 340-351 (wrong match); M6.7 B06 5 331, 352-353 (JDAM accuracy); M6.11 B06 659-664 | JDAM/GMLRS/Excalibur degradation under jamming in Ukraine, CEP growth with INS-only, M-code/SAASM | M5.8 |

## Pattern

The books (EW101/102, the three PoMR volumes, Driggers, Kaplan, Moir) cover the **physics and the engineering equations** almost completely. What is missing is the operational and current layer that an authority writes about:
- **Dynamics and history:** CM/CCM cycles and their timescales, SEAD/DEAD history (1973, Bekaa, 1991, Kosovo, Ukraine), reprogramming and mission data.
- **Post-2015 technology:** GaN, Starlink in war, fiber-optic FPVs, COTS drone links, BeiDou-3, cognitive EW/radar claims, quantum PNT.
- **Architecture questions:** counter-stealth (low-band + IRST + PCL + fusion), CEC/IBCS composite tracking, weapon datalinks, latency budgets, DDIL resilience.
- **Economics:** cost per shot and magazine depth for directed energy, cost of EW systems vs drones, T/R-module economics, LO sustainment.
Most gaps fit in short added lessons on the existing host modules (M4.1, M4.10, M7.9, M12.1, M9.7, M3.13, M2.4) and need no new modules. Exceptions: (a) a SEAD/DEAD module or a large extension of M12.1; (b) Ball (B16) pp. 44–70, which already contain a worked SEAD package and mission-level survivability arithmetic but are attached to no module. Attach them as `ref` to M4.7/M12.1.

## Biggest NOT-NEEDED blocks

| module | doc pp | n | section | reason |
|---|---|---|---|---|
| M2.17 | B02 893-911 | 19 | Image Formation | SAR image-formation derivations (DBS/PFA detail, N); keep only 893-897 concept v |
| M5.2 | B05 84-102 | 19 | Space Segment Description  68 | GPS satellite block-by-block hardware history (keep 1-page summary of blocks/M-c |
| M2.33 | B02a 191-207 | 17 | SR Algorithms | sparse-reconstruction algorithms (N) |
| M5.10 | B05 559-574 | 16 | Types of Network Assistance 543 | types of network assistance (civil cellular detail) |
| M2.34 | B02a 296-310 | 15 | Doppler Beam Sharpening Extensions | Doppler beam sharpening algorithm extensions (N) |
| M2.34 | B02a 330-342 | 13 | Range Migration Algorithm | range migration algorithm (N) |
| M2.19 | B02 477-488 | 12 | Exciter Components | exciter components (synthesizer hardware), engineering detail |
| M3.9 | B03 426-436 | 11 | Validation of Eye–Display Contrast Threshold  | validation experiments of eye-display CTF model |
| M2.19 | B02 467-476 | 10 | Exciter Design Considerations | exciter design detail (C) |
| M2.33 | B02a 222-231 | 10 | References | bibliography / further-reading list |
| M2.36 | B02a 626-635 | 10 | Scattering Matrix | scattering-matrix derivation (N) |
| M5.10 | B05 544-550 | 7 | Requirements of the FCC Mandate 528 | FCC E911 mandate requirements |
| M2.34 | B02a 239-244 | 6 | Mathematical Background | Fourier/sinc math review, already in eng app |
| M2.37 | B02a 687-692 | 6 | References | bibliography / further-reading list |
| M2.38 | B02a 755-760 | 6 | References | bibliography / further-reading list |
| M3.11 | B03 550-555 | 6 | Appendix 15B: Detection Times and Probabiliti | appendix: shared-search derivation |

By module (pp): M2.34 46, M5.10 37, M2.33 30, M2.19 26, M2.36 23, M2.17 21, M3.9 21, M5.2 19, M3.3 17, M5.1 16, M3.11 14, M4.14 14. Of the 416 pp, ~157 are bibliographies, further-reading lists and chapter summaries. The rest is algorithm detail (SAR image formation, RMA, sparse reconstruction, polarimetric scattering matrices), civil GNSS (E911, A-GPS, QZSS, RTCM formats), GPS satellite-block history, display hardware (CRT/LED/LCD) and lens formalisms.

## Kept although the merge flagged them

- B02 §17.4 MTI (666–680) was C_only in the merge. It is K (R.4.6).
- B05 §5.6 tracking thresholds (199–215) and §5.8 acquisition (235–246) were C_only as 'receiver loops'. They are what sets a receiver's jamming tolerance, so they serve PNT.2.1 (K).
- B02 §21.6 SAR image phenomenology (912–924: shadow, layover): needed for reading imagery in OSINT work.
- B02 §10.6 transmitter effects on the EM environment (412–417): spectrum and EMC.
- B02b §6.8 netcentric MPARS (306–309): the only text close to composite tracking (COM.2.3).
- B05 frequency-standard stability appendix (681–683): the basis of the added timing subtopic P5.A1.
- B02a ch.12 (558–605, flagged weak-hit): the EA/EP core of M4.16.

## Test-out candidates (strong operational background; never removal)

M:AP.1.3 Antenna types (dish, horn, spiral, log-periodic, array), M:AP.3.4 Foliage, building and terrain loss, M:R.1.1 Pulse radar basics: range, PRF, duty cycle, unambiguous range, M:R.6.4 Fire-control radars and illuminators, M:R.10.1 Radar coverage diagrams and low-altitude gaps as tactical facts, M:R.10.3 Mobility, emplacement time and radar netting, M:EO.3.4 Image intensifiers and night vision generations, M:EO.4.4 Human perception and operator fatigue, M:EO.5.1 Laser rangefinders and designators, spot size, beam divergence, M:EO.5.5 Camouflage, concealment and decoys against EO, M:EW.1.1 ES/EA/EP definitions; EMSO, spectrum management, M:EW.1.4 Spectrum as maneuver space; EMCON, M:EW.2.4 ELINT vs COMINT vs ESM roles, M:EW.4.6 Jamming of GNSS and datalinks, M:EW.5.3 Chaff and corner reflectors, M:EW.7.3 Comms intercept and direction finding of tactical radios/phones, M:EW.8.1 SEAD/DEAD concepts and history (Bekaa 1982, Desert Storm, Kosovo, Ukraine), M:EW.9.3 EW operator interfaces, M:EW.12.2 Electromagnetic signature management of ground forces, M:COM.2.1 Link 16: TDMA, J-series messages, NPGs, relay, capacity, M:COM.3.1 Line-of-sight vs SATCOM vs mesh relay control links, M:COM.4.4 Cellular networks and civilian infrastructure use/exploitation, M:PNT.1.2 GPS segments, signals (L1/L2/L5, C/A, P(Y), M-code).

Section level: the descriptive/history openings of M4.1, M4.3, M4.6, M4.11 (FH/chirp descriptions), M2.1 (radar applications, B02 73–90), M3.10 (B08 IR imaging, B09 stabilization), M5.1/M5.8 (GPS overview, nav aids), and the B10 Hebrew blocks. Test out with a short quantitative probe, because operators usually know the *what* and not the *numbers* (J/S, burn-through, horizon, POI).

## Added subtopics

- **P5.A1 (K)** Timing: GNSS-disciplined clocks, holdover, Allan deviation; dependence of datalinks (Link 16 TDMA), cellular, power grid on GNSS time. Host M5.6. Partial: B05 Appendix 681-683 (frequency standard stability), B05 2.6 77-78. Missing: holdover times by oscillator class (TCXO/OCXO/Rb/Cs), timing as a jamming target.
- **P5.A2 (K)** Tactical radio networks: CNR/MANET waveforms, range-throughput-latency trade, relay. Host M7.9. Partial: B08 7.2 281-287 (HF/VHF), B09 13. Missing: MANET concepts, throughput vs hops, examples.
- **P5.A3 (S)** Protected military SATCOM (AEHF/MUOS/PTS-class), anti-jam SATCOM: hopping, nulling, processing payloads. Host M13.10. Partial: B04 7.8 232-235; SMAD (image-only). Missing: protected SATCOM architecture and numbers.
- **P5.A4 (S)** Space-based SIGINT/RF geolocation constellations (incl. commercial HawkEye-360-class) and their accuracy. Host M4.6. Partial: B04 6.3 TDOA/FDOA math. Missing: orbital geometry, revisit, commercial availability.
- **P5.A5 (S)** GNSS interference detection and localization in practice (ADS-B NIC maps, crowd-sourced monitoring, Baltic/Middle-East jamming). Host M5.5. Partial: A05.3 Liu ADS-B GNSS RFI localization. Missing: operational picture 2022-2026.
- **P5.A6 (S)** Software-defined radio proliferation: low-cost EW/ESM/jammers built from COTS SDR; consequences for EW density. Host M4.2. Partial: B01 4.9 80 (digital receivers). Missing: cost/performance of COTS SDR.
- **P5.A7 (S)** Electromagnetic compatibility and spectrum fratricide (own jammers vs own links/GNSS); deconfliction. Host M4.1. Partial: B02 10.6 412-417 (transmitter impacts on EM environment). Missing: operational deconfliction.
- **P5.A8 (S)** Laser dazzlers and anti-sensor lasers vs EO/IR (ISR drones, satellites), laser warning. Host M3.13. Partial: B04 4.6.2-4.6.3 116-118. Missing: dazzle/damage thresholds, ranges.
- **P5.A9 (K)** Combat identification: IFF Mode 4/5, NCTR, fratricide data; cross-ref M8.4. Host M8.4. Partial: M8.4 (other panel), B02b 12.2.3 SSR. Missing: check by C4ISR panel.
- **P5.A10 (C)** HF communications and NVIS/ALE as resilient beyond-LOS comms. Host M1.3. Partial: B04 5.2 124-129; B08 7.2.1 283. Missing: ALE, NVIS for ground forces.
- **P5.A11 (C)** Quantum radar claims: physics limits (critique). Host M2.32. Partial: none. Missing: critique note.
- **P5.A12 (K)** Small-drone radar/RF detection specifics (RCS -20..-30 dBsm, birds discrimination) - cross-ref C-UAS panel. Host M9.7. Partial: A02.4, A02.5, A09.1. Missing: handled by C-UAS panel.

## Surprises and caveats

- The merge matcher misses EW/radar sections whose titles are generic ("Electronic Attack", "EW-Related Formulas", "Jamming-to-Signal Ratio"). Trust heading-level verification over similarity scores in this domain.
- Several merge hosts were wrong: PNT.1.4 → SMAD (correct: B05 §7.3), EW.12.x → SMAD cost pages (irrelevant), COM.3.2 → B08 radio navigation, PNT.2.4 → B10 nuclear chapter.
- Dated sources need explicit update notes: Kaplan 2006 (BeiDou-3, Galileo FOC, M-code status), Moir 2006 (AESA, MADL), EW101 2001 (DRFM, digital receivers), Driggers 2012 (T2SL/HOT detectors).
- Rough items: exact page ranges of the gap hosts, and the C/N subtopics (checked lightly).