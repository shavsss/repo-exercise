# Panel P2: signals, control, communications, electronics and power

**Domains (Gilua):**
- Signals and systems
- Control and estimation
- Information theory and communications
- Electronics and circuits
- Electric machines and power

**Panel:** a signal-processing and communications engineer, a control and estimation engineer, and an electronics and power engineer.

**Data:** `P2_signals_control_comms_electronics.json` in this folder. It was built by `scratchpad/p2/build.py` from `scratchpad/p2/table.py`.

**Method:**
- For every subtopic I searched the page text of all candidate books with keywords (`scratchpad/p2/s.py`).
- I read the tables of contents (E01, E02, E03) and opened the candidate sections.
- Module IDs are Gilua IDs. `MIL:Mx.y` marks a Lanchester twin.

## Counts

| | full | partial | missing | total |
|---|---|---|---|---|
| K | 33 | 10 | **0** | 43 |
| S | 90 | 30 | 13 | 133 |
| C | 7 | 4 | 1 | 12 |
| N (not needed) | | | | 10 |
| **all** | 130 | 44 | 14 | 198 subtopics |

**How the MG labels held up:**
- I changed the status of **71 of 198** MG labels.
- **17 "missing" labels were false.** The material is in the books. Examples:
  - Parseval
  - linearization
  - transient specs
  - cascade control
  - describing functions
  - Shannon-Hartley
  - Thevenin
  - device SOA and thermal design
  - ESD and latch-up
  - motor scaling laws
  - insulation classes
  - energy orders of magnitude (all of E14)
  - oscilloscope practice
- **13 "full" or "partial" labels were overstated.** The matcher hit the wrong sense of a word:
  - "Protection" matched Lanchester M4.16, which is electronic protection in EW.
  - "Power transmission lines" matched RF transmission lines (F2 §24).
  - "MIMO control/RGA" matched MIMO radar.
  - "Three-phase transformer" matched E17, the deep-learning book.
  - "ISI/raised cosine" matched the Nyquist *stability* plot.
- MG host IDs mix the two apps. M2.x, M9.5 and M13.20 are Lanchester IDs, and "M17.2" for power systems is a neural-network module. Do not use those hosts as given.

**Importance:** I changed one rating. Frequency control, inertia and renewables integration go from S to K: grid resilience comes up often in articles and interviews. I confirmed all the other ratings, rounding up where unsure.

## The most important gaps

All K-level gaps are partial. None is fully missing.

| # | Subtopic (K) | What must be added | Host |
|---|---|---|---|
| 1 | Time-bandwidth uncertainty | Δt·ΔB ≥ c. Resolution consequences: c/2B, 1/T. The trade-off as a design law. | M4.5 |
| 2 | Windowing, leakage, resolution | Window families, mainlobe vs sidelobe, scalloping, aperture-taper analogy. Lanchester M0.3 has it; Gilua has only a problem in E01. | M4.6 |
| 3 | Quantization noise, 6.02N+1.76 | q²/12, ENOB, dither, oversampling, jitter-limited SNR. Not in E02, E09 or E01. | M4.8 |
| 4 | Digital control: sampling, discretization, latency | Sampling-rate rules, ZOH as T/2 delay, Tustin, latency eating the margin | M5.9 |
| 5 | Link budget (Gilua) | Friis, EIRP, G/T, margin. No hits in the Gilua books; Lanchester M0.1/M1.4 cover it. | M23.5 |
| 6 | Latency, throughput, bandwidth-delay product | Delay types, BDP, numbers for LEO/GEO/fibre | M23.7 |
| 7 | KCL/KVL, node and mesh analysis | Systematic analysis. Chapter 1 of E09 is missing from the PDF, so only the E09a class notes and F2 ch.22 teach it. | M11.1 |
| 8 | Tolerances, worst-case and Monte Carlo | RSS vs worst case, yield, corners (E25 §7.2 is in an adv module) | M11.7 |
| 9 | Energy/co-energy force and torque | F = ∂W′/∂x, reluctance force, magnetic pressure B²/2μ₀ | M12.3 |
| 10 | Frequency control and inertia (raised to K) | Swing equation, H, df/dt, droop, low-inertia grids with inverters | M13.17 |

Others:
- DFT and FFT practice (S) are thin. Host: M4.6.
- Shannon-Hartley is full, but E23 §5.1–5.2 sits in an adv module (M23.8). Teach it inside core M23.3.

**S-level missing items (13):**

| Group | Item | Host |
|---|---|---|
| Signals | STFT/spectrogram | M4.8 |
| Signals | Finite word-length effects | M4.10 |
| Control | Cross-domain analogies and bond graphs | M5.2 |
| Control | Filter tuning and consistency (NEES/NIS) | M5.6 |
| Control | FDIR | M5.13 |
| Comms | Network security | M23.7 |
| Electronics | Two-port and S-parameters | M11.11 |
| Power | Power flow | power-systems block, see below |
| Power | Faults and symmetrical components | power-systems block |
| Power | Protection | power-systems block |
| Power | Stability | power-systems block |
| Power | Electrical safety | power-systems block |
| Power | Isolated power: ships, aircraft, vehicles | M12.10 |

**The power-systems block is the largest structural hole:**
- 6 subtopics are missing and 3 are partial. No Gilua book teaches grids. E14 gives the numbers and E10 gives the machines.
- **Recommendation:** add one module, about 40 pages equivalent and taught from outside the books, after M13.17. It would cover:
  - per-unit and three-phase
  - power flow
  - faults and protection
  - stability and frequency control
  - grid vulnerability (see the added items)

## Added: absent from the BoK map (15)

**K:**
- Complex baseband (I/Q) and the analytic signal. E23 §2.2.2 covers it, but the BoK map does not.
- The Cramér-Rao bound for signal parameters, σ ≈ resolution/√(2·SNR).

**S:**
- Bandpass sampling and SDR architecture
- IMU error models and the Allan variance
- Delay limits and the Smith predictor
- Phase noise and jitter, and their system effects
- PAPR, PA back-off and EVM
- Tactical MANET and LEO SATCOM networking
- RF power-amplifier classes, GaN, Doherty
- Electronics reliability: FIT, Arrhenius, derating
- Pulsed power for directed-energy weapons, HPM and EM launch
- Grid vulnerability to EMP/GMD and cascading failure
- Gensets and fuel cells vs batteries, by power density

**C:**
- Pilot-induced oscillation
- PDN decoupling

## Unmatched or non-teaching sections

I reviewed **490 sections (1,861 pages)** that MG left unmatched or tagged C-only, N-only or non-teaching, in modules M4, M5, M7.1–7.8, M11, M12.3–12.10, M22.10 and M23.

**KEEP: 339 sections, 1,328 pages.** Most are matcher misses on real teaching text: E09 ch.2–9 and 13, E10 throughout, E23 ch.2–3, 6 and 10, and E03 ch.3–4 and 15. 237 of these keeps are checked at title level only and are marked "title-level check" in the JSON.

**NOT NEEDED: 151 sections, 534 pages.** The biggest blocks:

| Module | Pages | What |
|---|---|---|
| M22.10 | 229 | E09 ch.10–11: the 8086/68008 instruction sets, IBM-PC bus, Centronics, SCSI and GPIB, a 68008 design project. Also E09a classes and labs 18–23. Keep only ~40 pp: interrupts, DMA, bus synchronization, serial-communication concepts, number formats, memory. |
| M11.8 | 68 | Sequential PALs, K-maps (N), gate catalogs, counter labs and class notes, specific circuits |
| M11.14 | 33 | Colour codes, resistor tables, schematic drafting, data sheets for obsolete parts, pinouts. Keep the oscilloscope and load-line appendices. |
| M7.8 | 24 | Constrained channels, crosswords, information in evolution. Keep Banburismus and decibans (weight of evidence). |
| M11.2/M11.3 | 43 | E09a bench-lab procedures and openers. Keep the class notes. |
| M11.10 | 21 | Wire-wrap, breadboards, cabinets, where to buy parts. Keep PCB design, cooling and grounding hints. |
| M23.10 | 19 | E23 §9.2: universal space-time code construction (research-level) |
| M23.4 | 18 | RA codes, LDPC encoding and improvement detail, exercises. Keep the LDPC, turbo and fountain concepts and the Viterbi/min-path material. |
| M4.9 | 12 | E01 App. A: partial-fraction drills (N) |

## Surprises

1. **Chapter 1 of E09 (Horowitz & Hill), "Foundations", is missing from the PDF.** Circuit basics therefore rest on the E09a class notes and Feynman II ch.22. The tutor must fill in AC power, node/mesh analysis and the power material in reactive circuits.
2. **Several K ideas exist only in the Lanchester twin:** link budget, windowing, quantization noise, DFT practice, adaptive filters. Gilua should either cross-link to the Lanchester module or teach a short bridge. Otherwise the military app ends up teaching the engineering foundation.
3. **Measurement practice is in a ref-tier appendix** (M11.14, oscilloscope). It needs to be pulled into core M11.1 as an applied habit.
4. **E03 (Åström & Murray) is richer than the matcher credited.** Linearization, describing functions, cascade control, feedback linearization, gain scheduling and MPC-as-receding-horizon are all there. The control domain has **no missing K items**. What is weak is the estimation craft: NEES, particle filters, FDIR.
5. **The source books predate:**
   - wide-bandgap power devices (SiC, GaN)
   - modern embedded buses
   - grid-forming inverters

   These are flagged as partial and need the tutor's own current material.

## Rough items

- Keep decisions without an explicit note are title-level.
- For pages given as `DOC@a-b` (PDF pages), the module is inferred from the syllabus.
- Lanchester coverage claims (`MIL:`) come from the MG and module titles, not from re-reading the military PDFs.
