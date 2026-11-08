# LV. Where the learner lands: per-domain benchmark against academia and industry

**This is a projection, not a measurement.** It assumes both curricula are finished at level 2.5 and that every domain is closed by a held-out exam and an oral exam with the 'senior engineer' persona. Today the learner is on page 240 of Kolmogorov vol. 1.

Basis: the final curriculum (`round3/final/F_curriculum.md`), the verified coverage in each panel (`round3/panels`), the BoK maps (`round3/bok`), the books themselves, and the NPS course catalog (checked on the web, Oct 2026).

## Scales

- **academia_knowledge**: A1 lower-division BSc / A2 BSc core / A3 BSc + MSc electives / A4 MSc core / A5 PhD qualifying exam
- **academia_fluency**: Same scale, measured as 'could pass that course's final exam'. Level 2.5 skips problem sets and proofs by design, so fluency sits 1-2 steps below knowledge in almost every domain.
- **industry_engineering**: junior / mid / senior / principal, judged as the REVIEWER role (sanity checks, trade-offs, catching errors), not as the designer role. As a designer he is below junior everywhere: no tools, no lab, no delivered hardware or code.
- **industry_defense**: analyst ladder: research assistant / junior analyst / associate (mid) / senior analyst (RAND, CNA, IDA, CSIS, CSBA, DOT&E, program office). Open sources only: classified threat and performance data cap him below cleared analysts in every MIL domain.

## The honest headline

1. **Two axes, two answers.** On KNOWLEDGE (what he understands and can explain and critique), he typically reaches BSc core to MSc-concept level: A2–A3 in engineering and A3–A4 in the sensor and weapons domains. On FLUENCY (passing that course's final exam), he sits 1–2 steps lower almost everywhere. This is the price of level 2.5, which does no problem sets and no proofs. Concretely, he could follow and critique a graduate lecture in radar or EW, but would probably fail the MIT 6.003 or 18.06 final without drilling.
2. **Industry: the reviewer role, not the designer role.** As a designer he is below junior in every engineering domain, with no tools, lab or delivered artifact. As a reviewer (sanity checks, trade-offs, catching errors), he is mid-level in most engineering domains. He is senior only where the arithmetic is the job: OOM judgment, performance claims and materials trade-offs.
3. **Military-technical: this is where the plan is strongest.** In the sensor, EW, PNT, missile and AMD domains, the books are graduate-level (three PoMR volumes, Adamy, Kaplan, Siouris, Boord-Hoffman, Washburn-Kress). His knowledge content is close to the NPS EW Engineer certificate plus parts of the NPS combat-systems and warfare-analysis courses, and his judgment can reach **senior open-source analyst** (RAND, CNA or CSIS style). It stays below cleared analysts and engineers, because the decisive data is classified.
4. **Weak spots are structural, not effort.** These domains rest largely on tutor-written lessons the books do not contain, so confidence is low: C4ISR (11/25 missing), the OR/logistics/acquisition/adversary group (34 K items missing in P7), the drone war, counterspace, naval salvo, and weapons effects (never panel-verified). Electronics, robotics perception and power grids are 'reader' level without bench or code work.
5. **Breadth is the real differentiator.** No degree covers 36 domains at this depth. The defensible claim is 'MSc-concept level across a breadth no single program has, with senior-reviewer judgment in a few cores'. It is not 'MSc or PhD level'.

## Caveats

- Projection at completion, not now: the learner is on Kolmogorov vol. 1 p.240 and has not started physics.
- The 'senior engineer' oral exam is an AI persona. Until a real external examiner (a professor's qualifying-style oral, or a practicing engineer) agrees with its verdict on a sample of domains, every level below is an upper bound.
- The levels assume the 566 added lesson items (tutor-written, not from books) are taught correctly. Domains that depend heavily on them (C4ISR, OR, logistics, acquisition, adversary, analysis craft, drone war, counterspace, naval salvo) carry lower confidence.
- Breadth is unusual: 36 domains at this depth exceeds any single degree. The comparisons are per domain and do not add up to 'several degrees'.

## Summary table

| domain | knowledge | exam fluency | industry (reviewer role) | confidence | שורה אחת |
|---|---|---|---|---|---|
| ENG · Mathematics foundations | A2–A3 | A1 | mid | high | ידע מושגי של תואר ראשון ומעט מעבר; שטף בפתרון בעיות מתחת לתואר ראשון. מבקר טוב של מודלים, לא מי שבונה אותם. |
| ENG · Physics | A2 | A1 | senior (OOM only) | high | פיזיקה של שנה א'–ב' בתואר ראשון, בהבנה עמוקה של פיינמן; בלי כלים מתמטיים של שנה ג'. שיפוט מספרי חזק, לא פיזיקאי. |
| ENG · Signals and systems | A3 | A2- | mid | high | תוכן מושגי מלא של 6.003 ו-6.011 של MIT, אבל בלי שטף חישובי של מבחן סופי. ברמת בודק בינוני מול מהנדס DSP. |
| ENG · Control and estimation | A3 | A2- | mid | high | בקרה ברמת קורס מתקדם בתואר ראשון ומושגים של תואר שני; חסר אומנות מסננים (עקביות, כשלים). בודק בינוני, לא מכוונן. |
| ENG · Information theory and communications | A3–A4 concepts | A2 | mid | med | מושגי תקשורת אלחוטית ותורת האינפורמציה ברמת תואר שני (ספרי תואר שני), אבל בלי שטף גזירה; רשתות רק ברמת סקירה. |
| ENG · Electronics and circuits | A2- | A1 | junior | high | הבנה מושגית של תואר ראשון בלי מעבדה, ולכן יכולת מעשית מתחת לסטודנט שנה ג'. כאן הפער הגדול ביותר בין ידע ליכולת. |
| ENG · Electric machines and power | A2 (grids <A2) | A1–A2 | junior–mid | med | מנועים ברמת קורס בחירה בתואר ראשון; רשתות חשמל רק מסקירה שהמורה כותב. שיפוט מספרי חזק בטענות אנרגיה. |
| ENG · Thermodynamics and heat transfer | A2 | A1–A2 | mid | high | ליבת תרמודינמיקה ומעבר חום של תואר ראשון בהנדסת מכונות, ברמה מושגית. בודק בינוני של מאזני חום. |
| ENG · Fluids, aerodynamics and propulsion | A2 | A1–A2 | junior (senior on perf. claims) | med | אווירודינמיקה ברמת קורס מבוא בתואר ראשון; זרימה דחיסה והנעה ברמת סקירה. טוב בבדיקת טענות ביצועים, לא בתכן. |
| ENG · Structures and materials | A2 | A1–A2 | junior (mid–senior on materials) | med | חוזק חומרים של תואר ראשון ובחירת חומרים בשיטת אשבי; שיפוט פשרות חומרים טוב, תכן מבני חלש. |
| ENG · Machine learning and deep learning | A3 | A1–A2 | mid (claims only) | med | מושגי למידה עמוקה ברמת תואר שני מוקדם; אפס ניסיון באימון מודלים. מבקר טוב של טענות AI, לא מהנדס ML. |
| ENG · Reinforcement learning | A3 found., <A3 deep | A1–A2 | junior–mid | med | יסודות למידה מחיזוקים ברמת קורס בחירה לתואר שני; RL עמוק חלקי. ברמת מבקר זוטר-בינוני. |
| ENG · Robotics | A2–A3 (perception A1) | A1–A2 | junior | med | קינמטיקה ודינמיקה של תואר ראשון; תפיסה ו-SLAM רק מכתיבת המורה. רובוטיקאי זוטר על הנייר. |
| ENG · Systems engineering | A3–A4 concepts | n/a | mid (senior reviewer) | med | מושגי הנדסת מערכות ברמת קורס מבוא לתואר שני; כבודק דרישות ותכנון אימות קרוב לבכיר, אבל בלי אחריות על תוכנית. |
| ENG · Engineering judgment (cross-cutting) | >MSc grad if measured | n/a | senior–principal reviewer | low until measured | התחום שבו רמה 2.5 יכולה להגיע לבודק בכיר, אולי ראשי; צריך רשומת כיול פומבית כדי שזה ייחשב. |
| ENG · Periphery: discrete math, algorithms, computer systems, chips | A2 survey | A1 | junior eng / mid analyst | med | סקירה של תואר ראשון במדעי המחשב ובשבבים בלי יכולת תכנות; כאנליסט שבבים ומחשוב ברמה בינונית. |
| MIL · Foundations: the quantitative toolkit | A3 | A2 | senior analyst | high | ארגז הכלים הכמותי ברמת הכניסה לתואר שני ב-NPS; שליטה של אנליסט בכיר אם תיבדק בכלים. |
| MIL · Antennas and propagation | A3 | A2 | senior analyst | high | אנטנות והתפשטות ברמת קורסי 3000 ב-NPS, באופן מושגי; אנליסט בכיר בשאלות כיסוי, בלי כלי EM. |
| MIL · Radar | A4 concepts | A2–A3 | senior analyst | high | התחום החזק ביותר: ידע מושגי ברמת תואר שני מלא במכ"ם; אנליסט מערכות בכיר בקוד פתוח, לא מהנדס עיבוד אותות. |
| MIL · Electro-optical and infrared sensing | A3 | A2 | mid–senior analyst | high | חישה אלקטרו-אופטית ברמת קורס מבוא לתואר שני; אנליסט בינוני-בכיר בטענות טווח וזיהוי. |
| MIL · Electronic warfare and electromagnetic spectrum operations | A3–A4 | A2–A3 | senior analyst (open source) | high | ידע של תעודת מהנדס EW ב-NPS בלי מעבדה; אנליסט בכיר בקוד פתוח, ומעליו תקרת סיווג. |
| MIL · Communications, datalinks and networks | A3 links / A2 nets | A2 | mid analyst | med | פיזיקת הקשר ברמת תואר שני, קשרי נתונים טקטיים ברמת סקירה; אנליסט בינוני. |
| MIL · Positioning, navigation and timing | A3 | A2 | senior analyst | high | ניווט לוויני ברמת קורס לתואר שני; אנליסט בכיר בשיבוש והטעיה, לא מהנדס מקלטים. |
| MIL · Missiles: propulsion, guidance, control and design | A3–A4 concepts | A2 | senior analyst | med (Fleeman image-only) | טילים והנחיה ברמת קורסי 4000 ב-NPS, באופן מושגי; אנליסט בכיר בטענות טילים, לא מהנדס הנחיה. |
| MIL · Air and missile defense | A3 | A2 | senior analyst (open source) | med | הגנה אווירית ברמת קורס בחירה לתואר שני; כאן הוא יכול להתקרב לאנליסט בכיר בקוד פתוח. |
| MIL · C4ISR, kill chains and targeting | A2 | A1–A2 | junior–mid (unmeasured) | low | התחום החלש במקורות (11 מתוך 25 חסרים בספרים); אנליסט זוטר-בינוני על הנייר, והניסיון המבצעי שלו לא נמדד. |
| MIL · Space systems and space warfare | A3 | A2 | mid analyst | med (SMAD image-only) | מערכות חלל ברמת קורסי 3000 ב-NPS; לוחמת חלל ממודול חדש. אנליסט בינוני. |
| MIL · Unmanned systems and counter-UAS | A2–A3 | A2 | mid analyst | low–med (dates fast) | יסודות כטב"מים ברמת קורס; מלחמת הרחפנים מכתיבת המורה. אנליסט בינוני בתחום שמתיישן מהר. |
| MIL · Weapons effects, lethality and protection | A2 | A1–A2 | junior–mid analyst | low (no panel) | אפקטים וקטלניות ברמת מבוא, בביטחון הנמוך ביותר (לא נבדק על ידי פאנל). אנליסט זוטר-בינוני. |
| MIL · Platforms and survivability | A3 | A2 | mid–senior analyst | med | שרידות פלטפורמות ברמת הקורס של Ball ב-NPS; אנליסט בינוני-בכיר. |
| MIL · Naval and undersea warfare | A2 | A1–A2 | junior–mid analyst | low–med | לוחמה ימית ברמת ספר הלימוד של האקדמיה הימית האמריקאית, עם תוספות; אנליסט זוטר-בינוני. |
| MIL · Operations research and combat modeling | A3–A4 concepts | A2 | associate (mid) analyst | med | מידול לחימה ברמת תעודת ניתוח הלוחמה של NPS, בלי מעבדות סימולציה; אנליסט בינוני ב-RAND או CNA. |
| MIL · Logistics, sustainment and force generation | A2 | A1 | junior analyst | low | לוגיסטיקה ברמת מבוא עם היסטוריה חזקה; אנליסט זוטר. |
| MIL · Acquisition, cost, test & evaluation, industrial base, policy | A2–A3 | A2 | junior–mid analyst | low–med | רכש, עלות וניסוי ברמת מבוא מקצועי (DAU); אנליסט זוטר-בינוני. |
| MIL · Adversary systems, doctrine and capability assessment | A2 | n/a | junior–mid analyst | low | תורות ומערכות היריב ברמת מבוא; מתחת למומחה אזורי, בעיקר בגלל שפה ומקורות ראשוניים. |
| MIL · Defense analysis craft: OSINT, claims checking and communication | seminar | n/a | mid–senior (writing) | low until measured | כבר חזק כנראה בכתיבה; בדיקת טענות עם שפיות פיזיקלית נדירה. צריך רקורד פומבי. |

## What closes the gaps (cross-cutting)

- **One skill unlocks most 'next levels': Python analysis fluency.** Nearly every gap_to_next below is a computational project. Without code, the projects cannot be done and fluency stays at A1–A2.
- **Five projects cover about 20 domains**, each PhD-flavored if pushed to a publishable result:
  - (a) A radar/EW signal chain plus a small-drone detection study (signals, radar, EW, antennas, C-UAS, ML).
  - (b) A 6-DOF engagement sim with adjoint miss distance (missiles, control, fluids, RL).
  - (c) An AMD capacity and cost-exchange model calibrated on 2024–26 data (AMD, OR, acquisition, logistics, naval salvo).
  - (d) GNSS/INS fusion with a jamming map from real data (PNT, estimation, robotics).
  - (e) A campaign or attrition model with validation (OR, survivability, logistics).
- **Bench time for electronics** cannot be replaced by any project on paper.
- **External calibration is what turns all of this into 'authority'.** That means real examiners for a sample of domains (a professor's oral and a practitioner's review), plus a public prediction and critique record. Until then, every level in this file is an upper bound.

## Per domain

### ENG · Mathematics foundations

*ידע מושגי של תואר ראשון ומעט מעבר; שטף בפתרון בעיות מתחת לתואר ראשון. מבקר טוב של מודלים, לא מי שבונה אותם.*

- **Grades:** knowledge A2–A3 · fluency A1 · industry mid · confidence high
- **Academia:** Knowledge A2-A3: the conceptual content of an engineering math sequence (MIT 18.01/18.02/18.03/18.06, 18.05) plus conceptual parts of graduate courses through the books: Boyd EE364a (convex optimization), Trefethen and Bau (MIT 18.335-type numerical linear algebra), Wasserman (CMU 36-705-type statistics), Langtangen (finite differences). Fluency A1 or lower: no proofs or exercises are done, so he would fail an 18.02 or 18.06 final without weeks of drilling. Above BSc: the cross-domain view of structures (eigen-structure, duality, conditioning, CLT limits). Below BSc: any computation done under time pressure. Panel P1: 8 K/S items are truly missing, among them heavy tails, FEM and stiff integrators, which the tutor must add.
- **Industry:** Mid-level reviewer of numerical work: can ask the right questions about conditioning, stiffness, overfitting, multiple testing and convexity, and catch wrong assumptions in someone else's model. A working quant or computational engineer clearly does better at implementing solvers, debugging numerics, choosing libraries and deriving anything new.
- **Next level:** Level-3 fluency in a core subset (linear algebra, probability, optimization): about 150 graded exercises, or one computational project that is verified against known results, for example implementing and validating an estimator plus a convex solver for a real sensor problem. A qualifying-exam-style written test in two of these areas would certify A4.

### ENG · Physics

*פיזיקה של שנה א'–ב' בתואר ראשון, בהבנה עמוקה של פיינמן; בלי כלים מתמטיים של שנה ג'. שיפוט מספרי חזק, לא פיזיקאי.*

- **Grades:** knowledge A2 · fluency A1 · industry senior (OOM only) · confidence high
- **Academia:** Knowledge A2: Feynman I-III covers the physics of MIT 8.01/8.02/8.03, the concepts of 8.04 (quantum) and part of 8.044 (statistical), at deep conceptual quality. Fluency A1: there is no Griffiths-, Taylor- or Jackson-level problem solving. Below a physics BSc: upper-division E&M and quantum mechanics with their mathematical machinery, and lab work. Feynman II ch. 40 and 42 are missing from the PDF, so fluids and GR clocks come from other sources.
- **Industry:** In engineering use (no 'physicist' track), close to a senior systems engineer on physical sanity checks and orders of magnitude, such as diffraction limits, energy budgets and heat rejection. A working physicist or EM engineer does far better at computation, simulation and experiment.
- **Next level:** A computational physics project with real equations, for example propagation or diffraction modeling checked against measurement, or a semester of graded Griffiths E&M problems. For A3, his two weakest classical areas (E&M, stat-mech) need to reach exercise fluency.

### ENG · Signals and systems

*תוכן מושגי מלא של 6.003 ו-6.011 של MIT, אבל בלי שטף חישובי של מבחן סופי. ברמת בודק בינוני מול מהנדס DSP.*

- **Grades:** knowledge A3 · fluency A2- · industry mid · confidence high
- **Academia:** Knowledge A3: the full conceptual content of MIT 6.003 (Oppenheim and Willsky) and 6.011 (signals, systems and inference), with parts of 6.341 (DSP). Fluency A2-: he could explain convolution, sampling, the z-transform and Wiener filtering, but would likely fail a 6.003 final that asks for long transform computations. Panel P2: there is no K-level gap, but DFT and FFT practice is thin. Below MSc: multirate DSP, filter-design craft, spectral estimation in depth.
- **Industry:** Mid-level reviewer: catches aliasing, windowing, leakage, SNR and processing-gain errors in claims. A DSP engineer clearly does better on fixed-point implementation, filter design tools, real-time constraints and debugging with real data.
- **Next level:** Implement an end-to-end chain in Python on real data, for example SDR captures or radar/audio datasets with filtering, spectral estimation and detection. That closes most of the fluency gap. The same chain can serve the radar and EW projects.

### ENG · Control and estimation

*בקרה ברמת קורס מתקדם בתואר ראשון ומושגים של תואר שני; חסר אומנות מסננים (עקביות, כשלים). בודק בינוני, לא מכוונן.*

- **Grades:** knowledge A3 · fluency A2- · industry mid · confidence high
- **Academia:** Knowledge A3: Åström and Murray, the Caltech CDS 110 / MIT 6.302 level, plus the Kalman and Wiener material of 6.011; conceptual contact with robustness, MPC, describing functions and gain scheduling. Fluency A2-. Below MSc: the rigorous state-space and linear-systems theory of Stanford EE263 or MIT 6.241, nonlinear control (Khalil) and robust control synthesis. Panel P2: estimation craft is weak, with NEES and consistency tests, particle filters and FDIR missing.
- **Industry:** Mid-level reviewer: understands margins, delay, saturation, bandwidth limits and observability, and can ask the questions a design review asks. A GNC or control engineer does far better at tuning, Simulink models, filter-divergence debugging, flight-test data and certification.
- **Next level:** Tune and validate an EKF or UKF on real IMU+GNSS logs (a drone or a phone), with NEES/NIS consistency tests and a fault scenario. That is level 3 in estimation and doubles as the PNT and robotics project.

### ENG · Information theory and communications

*מושגי תקשורת אלחוטית ותורת האינפורמציה ברמת תואר שני (ספרי תואר שני), אבל בלי שטף גזירה; רשתות רק ברמת סקירה.*

- **Grades:** knowledge A3–A4 concepts · fluency A2 · industry mid · confidence med
- **Academia:** Knowledge A3-A4 (concepts) in information theory and wireless: MacKay and Tse and Viswanath are graduate texts (Stanford EE359, Berkeley EE224/226 type). He understands capacity, coding, diversity, MIMO and OFDM at MSc concept level. Fluency A2: he cannot derive outage or capacity results under exam conditions. Networks are only A2 (6 subtopics, no networks textbook). 13 S-level items are missing.
- **Industry:** Mid-level reviewer of link budgets, waveform claims and capacity claims, strong at catching inflated throughput or range. A senior comms system engineer does far better on standards (3GPP, MIL-STD waveforms), PHY implementation, RF measurement and network operations.
- **Next level:** A link-level simulator (OFDM with coding and a fading channel) checked against theory and against SDR measurements, or a MANET throughput-vs-hops study in ns-3 or EMANE (shared with the MIL comms domain).

### ENG · Electronics and circuits

*הבנה מושגית של תואר ראשון בלי מעבדה, ולכן יכולת מעשית מתחת לסטודנט שנה ג'. כאן הפער הגדול ביותר בין ידע ליכולת.*

- **Grades:** knowledge A2- · fluency A1 · industry junior · confidence high
- **Academia:** Knowledge A2-: the content of MIT 6.002/6.012 and Horowitz and Hill at a conceptual level. Chapter 1 of H&H (circuit foundations) is missing from the PDF, so node analysis and AC power rest on the class notes and tutor-written text. Fluency A1: electronics is a lab discipline, and without bench work he is below a third-year EE student in actual capability.
- **Industry:** Junior-level reviewer at best: he knows on paper the classic failures (noise, grounding, bandwidth, thermal limits). He cannot design, simulate (SPICE), lay out or debug. Any practicing electronics engineer clearly does better.
- **Next level:** Not a PhD project but bench time: build and measure 3-4 circuits (low-noise preamp, ADC front end, switching supply, an SDR front-end filter) with an oscilloscope and SPICE. Without this, the domain stays 'reader' level.

### ENG · Electric machines and power

*מנועים ברמת קורס בחירה בתואר ראשון; רשתות חשמל רק מסקירה שהמורה כותב. שיפוט מספרי חזק בטענות אנרגיה.*

- **Grades:** knowledge A2 (grids <A2) · fluency A1–A2 · industry junior–mid · confidence med
- **Academia:** Motors and drives A2-A3 (Hughes and Drury; the concepts of a BSc elective such as MIT 6.685). Energy systems: strong orders of magnitude from MacKay's 'Sustainable Energy' (which is a numeracy book, not a degree text). Power systems are below A2: P2 found 6 grid subtopics missing and 3 partial, with no book teaching grids, so they rest on tutor-written lessons. Fluency A1-A2. Power electronics is conceptual only, with SiC and GaN missing.
- **Industry:** Junior to mid on machines and drives. On energy claims, a strong analyst (catches MW-vs-MWh errors and capacity-factor errors). A power-systems engineer does far better on load flow, protection, stability studies and standards.
- **Next level:** A load-flow and contingency study on a real grid case with pandapower or PyPSA (for example grid resilience under strikes, which connects to the military interest), plus a motor-drive simulation.

### ENG · Thermodynamics and heat transfer

*ליבת תרמודינמיקה ומעבר חום של תואר ראשון בהנדסת מכונות, ברמה מושגית. בודק בינוני של מאזני חום.*

- **Grades:** knowledge A2 · fluency A1–A2 · industry mid · confidence high
- **Academia:** Knowledge A2: the mechanical-engineering core, Çengel (MIT 2.005-type thermo) and Lienhard (MIT 2.51-type heat transfer, intro-graduate text). Fluency A1-A2: cycle and property-table computations are not practiced. Turbulence (cascade, Kolmogorov scales) and battery electrochemistry at OOM level are gaps the tutor fills.
- **Industry:** Mid-level reviewer of thermal budgets and energy-conversion claims, for example IR-signature heat rejection, engine efficiency and electronics cooling. A thermal engineer does far better with thermal FEA/CFD, test chambers and design margins learned from failures.
- **Next level:** A thermal model of a real system (a drone battery pack, electronics enclosure or IR signature of an exhaust) validated against measurement. That makes the domain level 3 and feeds the EO/IR domain.

### ENG · Fluids, aerodynamics and propulsion

*אווירודינמיקה ברמת קורס מבוא בתואר ראשון; זרימה דחיסה והנעה ברמת סקירה. טוב בבדיקת טענות ביצועים, לא בתכן.*

- **Grades:** knowledge A2 · fluency A1–A2 · industry junior (senior on perf. claims) · confidence med
- **Academia:** Knowledge A2: Anderson's 'Introduction to Flight' is a sophomore text (MIT 16.00/16.100 level). With Kolmogorov and Feynman added, Navier-Stokes structure and turbulence reach partial A2-A3. Compressible flow (5 subtopics) and propulsion are survey level, below the upper-BSc courses (MIT 16.100 compressible, 16.50 propulsion). No CFD. Fluency A1-A2.
- **Industry:** On performance claims (range, endurance, L/D, thrust-to-weight, the rocket equation) he can reach a senior reviewer's sanity-check level, because the numbers are simple. On real aero design he is junior. Aero engineers do far better on CFD, wind tunnels, stability derivatives and flight test.
- **Next level:** Design and analyze a small UAV or a missile airframe with OpenVSP/XFLR5, then compare the predictions with flight data. Or a compressible-flow/hypersonic heating project that checks public hypersonic claims (ties to MIL missiles).

### ENG · Structures and materials

*חוזק חומרים של תואר ראשון ובחירת חומרים בשיטת אשבי; שיפוט פשרות חומרים טוב, תכן מבני חלש.*

- **Grades:** knowledge A2 · fluency A1–A2 · industry junior (mid–senior on materials) · confidence med
- **Academia:** Knowledge A2: Gere (MIT 2.001-type mechanics of materials) and Ashby (materials selection, a Cambridge Part IB / MSc design-course classic). Fatigue, fracture and life are partial. FEM is a tutor-added module. Fluency A1-A2. Below BSc: drawing, GD&T and design projects.
- **Industry:** Ashby-type trade-off judgment (material indices, cost per performance) can reach mid-to-senior reviewer level, which is unusual. In structural analysis and design he is junior. Practitioners do far better on FEA, manufacturing tacit knowledge, tolerancing and failure investigation.
- **Next level:** Design-analyze-build-test a part, for example an FEA-modeled bracket or drone arm that is 3D-printed and tested to failure. A fatigue-life estimate checked against a real failure case would add life prediction.

### ENG · Machine learning and deep learning

*מושגי למידה עמוקה ברמת תואר שני מוקדם; אפס ניסיון באימון מודלים. מבקר טוב של טענות AI, לא מהנדס ML.*

- **Grades:** knowledge A3 · fluency A1–A2 · industry mid (claims only) · confidence med
- **Academia:** Knowledge A3: Prince's 'Understanding Deep Learning' plus MacKay cover the concepts of Stanford CS229 and much of CS231n/CS224n, at upper-BSc/MSc level. Gaps the tutor fills: scaling laws, LLM pretraining and alignment, ML data pipelines, ML assurance. Fluency A1-A2: he does no coding and no derivations, so he would fail a CS229 problem set.
- **Industry:** Judgment on ML claims (leakage, OOD, calibration, benchmark gaming, compute arithmetic) can match a mid-level ML engineer or a technical AI program manager. He has zero hands-on training, which every ML engineer has, and practitioners do vastly better on data work, training, debugging and deployment.
- **Next level:** One end-to-end project: train and evaluate a model on a defense-relevant open dataset (for example SAR ATR on MSTAR, or drone detection from RF/acoustic data), including OOD and adversarial tests. That is a legitimate PhD-flavored project and closes the most visible gap.

### ENG · Reinforcement learning

*יסודות למידה מחיזוקים ברמת קורס בחירה לתואר שני; RL עמוק חלקי. ברמת מבקר זוטר-בינוני.*

- **Grades:** knowledge A3 found., <A3 deep · fluency A1–A2 · industry junior–mid · confidence med
- **Academia:** Knowledge A3 on foundations: Sutton and Barto are the first half of Stanford CS234 and Berkeley CS285. Deep and modern RL (PPO, SAC, offline RL, sim-to-real) is partial or missing, so it is below CS285. Fluency A1-A2.
- **Industry:** Junior to mid. He can critique reward hacking, sample-efficiency and sim-to-real claims, and he knows where RL vs optimal control applies. RL practitioners do far better at every implementation task.
- **Next level:** Implement PPO and a model-based baseline on a pursuit-evasion or drone-interception simulation, then test robustness to domain shift. This is a natural PhD-style project that links RL, control and missiles.

### ENG · Robotics

*קינמטיקה ודינמיקה של תואר ראשון; תפיסה ו-SLAM רק מכתיבת המורה. רובוטיקאי זוטר על הנייר.*

- **Grades:** knowledge A2–A3 (perception A1) · fluency A1–A2 · industry junior · confidence med
- **Academia:** Kinematics, dynamics and planning A2-A3 (Lynch and Park, the Northwestern ME 449 / Coursera 'Modern Robotics' level). Perception and SLAM are A1: Modern Robotics has no perception chapter, so camera models, SLAM, VIO and swarms are tutor-written. Fluency A1-A2.
- **Industry:** Junior. He can follow a robotics design review and question autonomy claims, but has no ROS, hardware or integration experience. A robotics engineer does far better on everything practical.
- **Next level:** A ROS 2 project on a real small robot or drone: visual-inertial odometry or SLAM plus a planner, evaluated against ground truth. This combines robotics, estimation and UAS.

### ENG · Systems engineering

*מושגי הנדסת מערכות ברמת קורס מבוא לתואר שני; כבודק דרישות ותכנון אימות קרוב לבכיר, אבל בלי אחריות על תוכנית.*

- **Grades:** knowledge A3–A4 concepts · fluency n/a · industry mid (senior reviewer) · confidence med
- **Academia:** Knowledge A3-A4 (concepts): the NASA SE Handbook plus added items cover the concepts of graduate SE introductions (MIT 16.842, NPS SE3100, the DAU SE track). Missing items the tutor adds: PRA, STPA, MBSE, security, EVM detail. In SE, fluency matters less than in technical domains; what academia adds beyond this is case work and a capstone.
- **Industry:** With his military-program background, plausibly mid-level, and senior as a REVIEWER of requirements, trade studies and V&V plans. Below a senior SE in carrying a program's accountability, running reviews, MBSE tools (Cameo/SysML), interface management and schedule pressure.
- **Next level:** Run a full SE life cycle on his own project (requirements, architecture, verification matrix, risk register) and do an STPA analysis of a real system. Publishing it as a case study turns knowledge into demonstrable practice.

### ENG · Engineering judgment (cross-cutting)

*התחום שבו רמה 2.5 יכולה להגיע לבודק בכיר, אולי ראשי; צריך רשומת כיול פומבית כדי שזה ייחשב.*

- **Grades:** knowledge >MSc grad if measured · fluency n/a · industry senior–principal reviewer · confidence low until measured
- **Academia:** No degree teaches this directly. The nearest benchmarks are MIT 6.055J 'The Art of Approximation in Science and Engineering' (Mahajan), Fermi-problem courses and capstone design reviews. If the 10-20% mental-estimate target is met and measured, he is above a typical MSc graduate here. Panel P3 called this the weakest domain in the books: K items appear only as scattered instances, so the result depends on the added lessons.
- **Industry:** This is where level 2.5 aims, and the only domain where senior to principal REVIEWER level is realistic: OOM estimates, structure transfer across fields, catching errors. Principal judgment also includes tacit knowledge of what fails in practice (integration, supply, people), which only experience gives. A principal engineer still does better on the 'what actually goes wrong' layer.
- **Next level:** A public calibration record: at least 100 dated quantitative predictions or estimates scored against ground truth (Brier or log score, error ratios), plus 10 published critiques reviewed by named domain experts. This is the external measurement that would make the claim credible.

### ENG · Periphery: discrete math, algorithms, computer systems, chips

*סקירה של תואר ראשון במדעי המחשב ובשבבים בלי יכולת תכנות; כאנליסט שבבים ומחשוב ברמה בינונית.*

- **Grades:** knowledge A2 survey · fluency A1 · industry junior eng / mid analyst · confidence med
- **Academia:** Survey level A2: MIT 6.042 (discrete math), Skiena (algorithms, a practitioner's book), Patterson and Hennessy (MIT 6.004 / Berkeley CS61C), Hu (devices), Weste and Harris (VLSI, senior/intro-grad). Fluency A1: no programming, no proofs. Below BSc CS in every assessed skill. Computer-systems material (roofline, Amdahl, GPUs) is good for ML-compute judgment.
- **Industry:** As an engineer, junior. As a semiconductor and compute analyst (foundry economics, yield, export controls, AI compute arithmetic), mid-level, comparable to an industry or think-tank analyst (CSET-type), because those roles need the same conceptual layer. Software engineers and chip designers do far better on everything practical.
- **Next level:** Real coding fluency (Python for analysis, which every other project needs too), plus one embedded real-time project. For chips, an analysis piece on AI compute supply checked by an industry expert.

### MIL · Foundations: the quantitative toolkit

*ארגז הכלים הכמותי ברמת הכניסה לתואר שני ב-NPS; שליטה של אנליסט בכיר אם תיבדק בכלים.*

- **Grades:** knowledge A3 · fluency A2 · industry senior analyst · confidence high
- **Academia:** This is the entry layer of NPS engineering-science curricula (dB arithmetic, detection theory, CRB, DOP, CEP, coordinates, MOE/MOP). With Gilua behind it, he covers it at A3 knowledge, at the level of the prerequisite review an NPS combat-systems or EW student gets. Fluency A2.
- **Industry:** Senior-analyst fluency is realistic here: dB budgets, detection probability and error-ellipse conversions are exactly what RAND/CNA analysts use daily. The remaining edge for practitioners is speed with tools (MATLAB/Python) and knowing the standard data sources.
- **Next level:** Tool fluency: a personal Python library of these calculations (radar/EW/link budgets, CEP, DOP) that is tested against textbook examples. It becomes the base of every MIL project.

### MIL · Antennas and propagation

*אנטנות והתפשטות ברמת קורסי 3000 ב-NPS, באופן מושגי; אנליסט בכיר בשאלות כיסוי, בלי כלי EM.*

- **Grades:** knowledge A3 · fluency A2 · industry senior analyst · confidence high
- **Academia:** Knowledge A3: antenna and array fundamentals and propagation at the concept level of NPS EC3600/EC3630 (Radiowave Propagation) and a BSc EE fields elective. Below MSc: computational EM, array synthesis and propagation modeling with ITU-R methods.
- **Industry:** Senior-analyst level on coverage, horizon, array-gain and sidelobe questions in force terms. Antenna and RF engineers do far better with HFSS/CST, measurement ranges, array calibration and real terrain models.
- **Next level:** An array-pattern plus terrain-propagation project (ITM / ITU-R P.526 with real DEM data), applied to radar low-altitude gaps or C-UAS sensor siting, and checked against a published measurement.

### MIL · Radar

*התחום החזק ביותר: ידע מושגי ברמת תואר שני מלא במכ"ם; אנליסט מערכות בכיר בקוד פתוח, לא מהנדס עיבוד אותות.*

- **Grades:** knowledge A4 concepts · fluency A2–A3 · industry senior analyst · confidence high
- **Academia:** Knowledge A4 (concepts): the three volumes of 'Principles of Modern Radar' (Richards; Melvin and Scheer) go beyond a single MSc course. They cover NPS EC3615 Radar Fundamentals plus much of EC4615 Advanced Radar, EC4630 RCS and EC4640 Airborne Radar, and the Georgia Tech graduate radar sequence, including STAP, SAR, MTI/MTD and EP. Fluency A2-A3: he cannot do radar signal-processing derivations or design a waveform under exam conditions. Probably the strongest domain overall.
- **Industry:** Senior radar SYSTEMS ANALYST in the open-source world: range-equation trade-offs, clutter, ambiguity, ECCM, mode selection and claim checking (for example 'stealth detected at X km'). Lincoln Lab, GTRI and industry radar engineers do far better on waveform design, processing code, hardware, test and classified threat data.
- **Next level:** An end-to-end radar processing chain (pulse compression, Doppler processing, CFAR, tracking) on simulated data and an SDR or open radar dataset. Then a PhD-level study, for example small-drone detection vs bird discrimination with RCS and micro-Doppler, aimed at a conference paper.

### MIL · Electro-optical and infrared sensing

*חישה אלקטרו-אופטית ברמת קורס מבוא לתואר שני; אנליסט בינוני-בכיר בטענות טווח וזיהוי.*

- **Grades:** knowledge A3 · fluency A2 · industry mid–senior analyst · confidence high
- **Academia:** Knowledge A3: Driggers is the standard intro-graduate EO/IR systems text, used in the NPS EO-series and in optics short courses. He covers radiometry, detectors, MTF, atmospheric transmission and target acquisition (Johnson/TTP). Fluency A2: radiometric chains and NETD/MRT computations are not drilled.
- **Industry:** Mid-to-senior analyst on EO/IR range and acquisition claims, IRST vs stealth, and the effects of weather. EO engineers do far better at running NV-IPM/TRM4 models, sensor testing, and optical design.
- **Next level:** A range-performance model (TTP-based) for a drone-mounted thermal camera, validated against published field results, together with the thermal-signature model from the ENG thermo project.

### MIL · Electronic warfare and electromagnetic spectrum operations

*ידע של תעודת מהנדס EW ב-NPS בלי מעבדה; אנליסט בכיר בקוד פתוח, ומעליו תקרת סיווג.*

- **Grades:** knowledge A3–A4 · fluency A2–A3 · industry senior analyst (open source) · confidence high
- **Academia:** Knowledge A3-A4: EW101/102 plus the EA/EP chapters of PoMR cover the content of NPS EC3700 (Joint Network-Enabled EW I) and EC4685 (Principles of EW). Combined with radar and propagation, this is roughly the knowledge of the NPS EW Engineer Academic Certificate (292), without its labs. Gaps the tutor fills: the CM/CCM cycle and its timescales, IADS seams, SEAD/DEAD. Fluency A2-A3.
- **Industry:** Senior analyst on J/S, burn-through, ES detection range, LPI and decoy plausibility, the core of an EW open-source authority. The open-source ceiling is hard here: real EW knowledge (threat parameters, reprogramming, techniques) is classified, and EW engineers and operators do far better on everything specific.
- **Next level:** An EW engagement model (jammer-vs-radar and jammer-vs-datalink/GNSS) checked against open test data, plus a historical CM/CCM timescale study (Vietnam to Ukraine). Publishable and within open-source limits. SDR transmission experiments must stay legal (receive-only or shielded).

### MIL · Communications, datalinks and networks

*פיזיקת הקשר ברמת תואר שני, קשרי נתונים טקטיים ברמת סקירה; אנליסט בינוני.*

- **Grades:** knowledge A3 links / A2 nets · fluency A2 · industry mid analyst · confidence med
- **Academia:** Knowledge A3 in link physics (from Gilua's Tse and MacKay). Tactical datalinks (Link 16, UAS C2 links, SATCOM) are at A2 survey level. Gaps: MANET and tactical networks, LPI datalinks for stealth fleets (MADL/IFDL), protected SATCOM, which are mostly tutor-written. Below an MSc in network engineering.
- **Industry:** Mid-level analyst: link budgets, capacity and jamming vulnerability of datalinks. Network and comms engineers, and C4 officers with operational experience, do far better on networks in practice.
- **Next level:** A MANET simulation (ns-3 or EMANE) of a drone-swarm or brigade network under jamming: throughput vs hops vs latency. It is shared with the ENG comms domain.

### MIL · Positioning, navigation and timing

*ניווט לוויני ברמת קורס לתואר שני; אנליסט בכיר בשיבוש והטעיה, לא מהנדס מקלטים.*

- **Grades:** knowledge A3 · fluency A2 · industry senior analyst · confidence high
- **Academia:** Knowledge A3: Kaplan and Hegarty cover the content of a graduate GNSS course (Stanford AA272) and the navigation parts of NPS EC4330. Inertial and alternative navigation are partial. Timing (holdover, Allan deviation) is a tutor-added K item. Fluency A2.
- **Industry:** Senior analyst on GNSS jamming and spoofing, DOP and timing dependence. A GNSS engineer does far better on receiver processing, spoofing detection implementation and INS integration.
- **Next level:** Process raw GNSS data (RINEX, or gnss-sdr on recorded IQ) and build a jamming map from ADS-B NIC data. A follow-on, loosely coupled GNSS/INS fusion, is shared with the control project.

### MIL · Missiles: propulsion, guidance, control and design

*טילים והנחיה ברמת קורסי 4000 ב-NPS, באופן מושגי; אנליסט בכיר בטענות טילים, לא מהנדס הנחיה.*

- **Grades:** knowledge A3–A4 concepts · fluency A2 · industry senior analyst · confidence med (Fleeman image-only)
- **Academia:** Knowledge A3-A4 (concepts): Siouris plus Fleeman (image-only scan) plus Boord-Hoffman cover the concepts of NPS ME4703 (Missile Flight and Control), ME4704 (Missile Design) and EC4330, including PN, miss-distance analysis and seekers. Missing: quasi-ballistic missiles and some hypersonic detail. Fluency A2: no 6-DOF simulation and no adjoint analysis done by hand.
- **Industry:** Senior analyst on range, PN, miss distance, maneuverability and hypersonic claims (for example whether an interceptor can match a target's g). Missile GNC and aero engineers do far better on 6-DOF models, aero databases, seeker design and classified performance.
- **Next level:** A 3-DOF and then 6-DOF engagement simulation with PN, seeker noise and target maneuver, with adjoint miss-distance analysis compared to published curves (Zarchan-style). This is a strong PhD-level project and links ENG control and fluids.

### MIL · Air and missile defense

*הגנה אווירית ברמת קורס בחירה לתואר שני; כאן הוא יכול להתקרב לאנליסט בכיר בקוד פתוח.*

- **Grades:** knowledge A3 · fluency A2 · industry senior analyst (open source) · confidence med
- **Academia:** Knowledge A3: Boord and Hoffman (JHU APL authors) cover AMD systems-engineering concepts at the level of JHU EP / NPS graduate electives. Economics and capacity (interceptor inventory, cost exchange, raid size) were partial or missing and are now tutor lessons in M7.4. Fluency A2.
- **Industry:** The domain where open-source analyst judgment can come closest to senior RAND/CSIS/CSBA level: layered-defense arithmetic, leakage, magazine depth and intercept-claim denominators, made concrete by recent Israel, Ukraine and Red Sea data. MDA, APL and industry engineers with classified data do far better on actual system performance.
- **Next level:** An open-source AMD capacity and cost-exchange model (raid vs layered inventory vs production rate), calibrated against 2024-26 public data and peer-reviewed by a practitioner. This is publishable and PhD-grade if done rigorously.

### MIL · C4ISR, kill chains and targeting

*התחום החלש במקורות (11 מתוך 25 חסרים בספרים); אנליסט זוטר-בינוני על הנייר, והניסיון המבצעי שלו לא נמדד.*

- **Grades:** knowledge A2 · fluency A1–A2 · industry junior–mid (unmeasured) · confidence low
- **Academia:** Knowledge A2: the weakest-sourced MIL domain. Panel P6b found 11 of its 25 K/S subtopics missing from every book, so it rests on tutor-written lessons. Below the NPS C3/ISR curricula. His operational background may raise his practical understanding, but nothing in the plan measures that yet.
- **Industry:** Junior to mid analyst on the book layer. With his military background he may be higher, but this must be shown by the held-out exam with practitioner-style scenarios, not assumed. C2 practitioners and targeting officers do far better on process, timelines and systems as they really work.
- **Next level:** A kill-chain latency model (sensor to decision to shooter, with time-sensitive-target windows), calibrated with practitioner interviews. The interviews are his comparative advantage as a writer.

### MIL · Space systems and space warfare

*מערכות חלל ברמת קורסי 3000 ב-NPS; לוחמת חלל ממודול חדש. אנליסט בינוני.*

- **Grades:** knowledge A3 · fluency A2 · industry mid analyst · confidence med (SMAD image-only)
- **Academia:** Knowledge A3 in space systems: SMAD is the standard text of USAFA, AFIT and NPS space courses (SS3011 Space Technology and Applications, SS3400 Orbital Mechanics), but here it is an image-only scan and its propulsion chapter is missing. Counterspace, SDA and resilience were fragmentary and now have a new module (M13.23). Below MSc in astrodynamics problem-solving (orbit determination, perturbations).
- **Industry:** Mid-level analyst: orbits, coverage, revisit, link budgets and the plausibility of counterspace claims. Space engineers and the Secure World / CSIS space analysts do far better with STK/GMAT and in tracking real space activity.
- **Next level:** A constellation coverage and revisit study plus an ASAT/proliferation resilience analysis (poliastro or GMAT, with public TLEs), in the style of a CSIS 'Space Threat Assessment' chapter.

### MIL · Unmanned systems and counter-UAS

*יסודות כטב"מים ברמת קורס; מלחמת הרחפנים מכתיבת המורה. אנליסט בינוני בתחום שמתיישן מהר.*

- **Grades:** knowledge A2–A3 · fluency A2 · industry mid analyst · confidence low–med (dates fast)
- **Academia:** UAS fundamentals A2-A3 (Fahlstrom; ATP 3-01.81 for C-UAS). The current drone war (Shahed, FPV, mass production, attack USVs) was missing and is now a tutor-written module (M9.9). There is no strong academic benchmark: academia lags this field.
- **Industry:** Mid-level analyst, mainly through his synthesis of open sources. Practitioners in Ukraine and in industry do far better on the tacit layer (EW-resistant links, production, tactics changing weekly). The knowledge also dates fast.
- **Next level:** Hands-on: build or instrument a small drone, and model C-UAS detection (RCS -20 to -30 dBsm, birds) and cost exchange, checked against field reports. Periodic re-study is needed because the domain changes every few months.

### MIL · Weapons effects, lethality and protection

*אפקטים וקטלניות ברמת מבוא, בביטחון הנמוך ביותר (לא נבדק על ידי פאנל). אנליסט זוטר-בינוני.*

- **Grades:** knowledge A2 · fluency A1–A2 · industry junior–mid analyst · confidence low (no panel)
- **Academia:** Knowledge A2, with the lowest confidence: no panel verified this domain, and the plan keeps the book material as is. The sources are Przemieniecki's methods, Hall, Ogorkiewicz (tanks), Ball and Fleeman. Below Cranfield/Shrivenham MSc programs (explosives ordnance, weapons effects) and below an NPS weapons-effects course in terminal ballistics and blast modeling.
- **Industry:** Junior to mid analyst: Pk chains, lethal area, CEP-to-Pk and armor trends. Lethality engineers (JTCG/ME, JMEM, national labs) do far better, and much of the data is classified.
- **Next level:** First, a coverage panel for this domain (it was skipped). Then a Pk and lethal-area model (Gurney velocities, fragment density, Carleton vs cookie-cutter) applied to a public case.

### MIL · Platforms and survivability

*שרידות פלטפורמות ברמת הקורס של Ball ב-NPS; אנליסט בינוני-בכיר.*

- **Grades:** knowledge A3 · fluency A2 · industry mid–senior analyst · confidence med
- **Academia:** Knowledge A3 once Ball is taught (new module M8.8). Ball's book is the text of the aircraft combat survivability course Ball taught at NPS, and the field's standard reference. Avionics (Moir and Seabridge) at A2. Sortie generation, basing and tankers were missing and are now added (M8.9). Fluency A2.
- **Industry:** Mid to senior analyst on susceptibility vs vulnerability, attrition rates and air-campaign capacity. LFT&E and survivability engineers do far better on vulnerability models (COVART/AJEM) and test.
- **Next level:** A survivability and campaign-attrition analysis of a real air campaign (for example Ukraine 2022-25 or a historical case) using Ball's framework and B15 math, with sensitivity analysis.

### MIL · Naval and undersea warfare

*לוחמה ימית ברמת ספר הלימוד של האקדמיה הימית האמריקאית, עם תוספות; אנליסט זוטר-בינוני.*

- **Grades:** knowledge A2 · fluency A1–A2 · industry junior–mid analyst · confidence low–med
- **Academia:** Knowledge A2: Hall is the US Naval Academy's undergraduate 'Principles of Naval Weapons Systems' text. The sonar equation and acoustics are at intro level. The Hughes salvo model, ship staying power and VLS magazine depth were missing (now in M14.1 and M7.4). NPS OS4655 teaches the salvo equations at the graduate level, so he is around USNA plus parts of NPS.
- **Industry:** Junior to mid analyst. Naval officers and CNA naval analysts do far better on fleet operations, ASW practice and classified acoustic data.
- **Next level:** Hughes salvo plus magazine-depth model applied to Red Sea 2023-25 open data, with sensitivity analysis. It is CNA-style work and publishable.

### MIL · Operations research and combat modeling

*מידול לחימה ברמת תעודת ניתוח הלוחמה של NPS, בלי מעבדות סימולציה; אנליסט בינוני ב-RAND או CNA.*

- **Grades:** knowledge A3–A4 concepts · fluency A2 · industry associate (mid) analyst · confidence med
- **Academia:** Knowledge A3-A4 (concepts) once the new module M14.1 teaches it: Washburn and Kress is the NPS OR text (OA4655 Joint Combat Modeling, OA3602 Search Theory), and Przemieniecki covers shooting and target defense. This is roughly the knowledge of the NPS Warfare Analysis Certificate (OA4604, OA4655) without its simulation labs and statistics coursework. Panel P7 found 34 K items missing, mostly because the ref books were outside the lessons (rule 37). Fluency A2: no stochastic or simulation problem sets.
- **Industry:** Associate-level (mid) RAND/CNA analyst in model critique (Lanchester validity, 3:1 rule, salvo, search theory, wargame evidence). Practicing analysts do far better at building and running models, data work, and sponsor communication.
- **Next level:** A full combat or campaign model with sensitivity and validation against historical data, essentially an NPS OR thesis. Done on a fresh question (for example drone-war attrition or a counter-salvo economy), it is a natural PhD-level project.

### MIL · Logistics, sustainment and force generation

*לוגיסטיקה ברמת מבוא עם היסטוריה חזקה; אנליסט זוטר.*

- **Grades:** knowledge A2 · fluency A1 · industry junior analyst · confidence low
- **Academia:** Knowledge A2: van Creveld gives strong history. Modern contested logistics, munitions consumption and production are mostly tutor-written. Below an NPS or AFIT logistics MSc.
- **Industry:** Junior analyst. Military logisticians do far better on the tacit layer (planning factors, systems, real constraints). Historical judgment is above junior.
- **Next level:** A munitions consumption vs production model (artillery shells and interceptors) for Ukraine or a Taiwan scenario, using public budget and production data.

### MIL · Acquisition, cost, test & evaluation, industrial base, policy

*רכש, עלות וניסוי ברמת מבוא מקצועי (DAU); אנליסט זוטר-בינוני.*

- **Grades:** knowledge A2–A3 · fluency A2 · industry junior–mid analyst · confidence low–med
- **Academia:** Knowledge A2-A3: Ball (DoD 5000, LFT&E), SMAD cost chapters and a new cost module (M14.2) on learning curves and LCC. This is around DAU Practitioner level in concepts, below the NPS MSc in Program Management or Cost Estimating in quantitative practice.
- **Industry:** Junior to mid analyst on test evidence (few-shot statistics, DT/OT realism) and cost growth. GAO, CAPE and DOT&E practitioners do far better on data sources, process and estimating tools.
- **Next level:** A cost estimate of a real program from Selected Acquisition Reports, with learning curves and uncertainty, plus a critical reading of a DOT&E annual-report section, reviewed by a practitioner.

### MIL · Adversary systems, doctrine and capability assessment

*תורות ומערכות היריב ברמת מבוא; מתחת למומחה אזורי, בעיקר בגלל שפה ומקורות ראשוניים.*

- **Grades:** knowledge A2 · fluency n/a · industry junior–mid analyst · confidence low
- **Academia:** Knowledge A2: ATP 7-100.1 and 7-100.3 (Russian and Chinese tactics), plus assessment methods (OOB, net assessment, bias) moved to M14.4. By the learner's choice, Iran and proxies are only C-level mentions. Below a graduate security-studies seminar and well below regional specialists.
- **Industry:** Junior to mid analyst. Regional specialists (CNA Russia studies, RAND China) do far better because of language, primary sources and years of tracking. This gap does not close through technical study.
- **Next level:** Systematic primary-source reading (translated Russian and Chinese military writing, PLA journals via CASI) and one capability assessment reviewed by a specialist. Language is the real long-term gap.

### MIL · Defense analysis craft: OSINT, claims checking and communication

*כבר חזק כנראה בכתיבה; בדיקת טענות עם שפיות פיזיקלית נדירה. צריך רקורד פומבי.*

- **Grades:** knowledge seminar · fluency n/a · industry mid–senior (writing) · confidence low until measured
- **Academia:** No degree benchmark. Comparable to graduate methods seminars (for example OSINT and intelligence-analysis modules in War Studies or security-studies programs). Mostly tutor-written, because the books do not teach it.
- **Industry:** As a working writer and interviewer, he may already be mid to senior in communication. The plan adds claims checking with physics sanity checks, which is rare among defense journalists. Bellingcat-type OSINT investigators do far better on geolocation and imagery-analysis tools.
- **Next level:** A published track record: claims checked, a public corrections log, and pieces reviewed by named experts before publication. Practical OSINT tool skills (geolocation, satellite imagery).

## Sources (web)

- [NPS EC 3000 courses](https://nps.smartcatalogiq.com/en/current/academic-catalog/courses/ec/3000)
- [NPS EC3700 Joint Network-Enabled EW I](https://online.nps.edu/w/ec3700-joint-network-enabled-electronic-warfare-i)
- [NPS EW Engineer Academic Certificate (292)](https://nps.smartcatalogiq.com/en/current/academic-catalog/departments/department-of-electrical-and-computer-engineering/electronic-warfare-engineer-academic-certificate-curriculum-292)
- [NPS EC 4000 courses (EC4615, EC4630, EC4640, EC4685)](https://nps.smartcatalogiq.com/en/current/academic-catalog/courses/ec/4000)
- [NPS Warfare Analysis Certificate](https://nps.smartcatalogiq.com/current/academic-catalog/departments/department-of-operations-research/warfare-analysis-certificate-curriculum-263-dl-267-res)
- [NPS OA4655 Joint Combat Modeling](https://nps.smartcatalogiq.com/en/current/academic-catalog/courses/oa/4000/oa4655)
- [NPS OS4655 (Hughes salvo)](https://nps.smartcatalogiq.com/en/current/academic-catalog/courses/os/4000/os4655)
- [NPS SS3011](https://nps.smartcatalogiq.com/en/current/academic-catalog/courses/ss/3000/ss3011)
- [NPS SS3400](https://nps.smartcatalogiq.com/en/current/academic-catalog/courses/ss/3000/ss3400)
- [NPS ME4703](https://nps.smartcatalogiq.com/en/current/academic-catalog/courses/me/4000/me4703)
- [NPS ME4704](https://nps.smartcatalogiq.com/current/academic-catalog/courses/me/4000/me4704)
- [NPS EC4330](https://nps.smartcatalogiq.com/en/current/academic-catalog/courses/ec/4000/ec4330)

MIT, Stanford, Berkeley and Caltech course numbers are cited from general knowledge, as standard benchmarks. They were not re-fetched.
