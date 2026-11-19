# Source Plan for the Round 8 Modules

תוכנית מקורות אחת ל-93 המודולים החדשים של סבב 8 (55 בגילואה, 38 בלנצ'סטר). המטרה: לקנות ולהעלות כמה שפחות ספרים. מקור הוא המפה שממנה השיעור נכתב ונבדק לפי תתי-הנושאים, לא חומר קריאה מלא. סדר העדיפות: מה שכבר בספרייה (של אחת המעבדות), אחר כך מקור חינמי וחוקי, ורק אז ספר בתשלום.

**בסיכום:** 15 ספרים לקנות, 99 מקורות חינמיים (חלקם צרורות מאמרים), 40 מקורות שכבר בספרייה. הפירוט המלא לכל מודול ב-`sources.json`.

לא תוכננו ספרים שכבר ידוע שלא יגיעו: Khalil, Bar-Shalom/Simon, ספר EE263, Erickson & Maksimović, Thrun, Szeliski, Mahajan, Sutton & Biblarz, Friedenthal, ובלנצ'סטר Kay, Groves, Liggins, Driels, Murthy & Manoj, Urick ומאמר ה-salvo של Hughes (1995). לכל אחד מהם נבחרה חלופה (מצוין בעמודת 'למה' ב-JSON).

## 1. ספרים לקנות ולהעלות

ממוינים לפי מספר המודולים שהספר מכסה. ספר שמשרת כמה מודולים נספר פעם אחת.

| # | ספר | מודולים | כמה |
|---|---|---|---|
| 1 | Carlucci & Jacobson, *Ballistics: Theory and Design of Guns and Ammunition*, 3rd ed. (CRC 2018) | M11.11 (לנצ'סטר), M11.12 (לנצ'סטר), M11.13 (לנצ'סטר), M11.14 (לנצ'סטר), M11.19 (לנצ'סטר) | 5 |
| 2 | Tupper, *Introduction to Naval Architecture*, 5th ed. (Butterworth-Heinemann 2013) | M30.1 (גילואה), M30.2 (גילואה), M30.3 (גילואה), M30.4 (גילואה) | 4 |
| 3 | Hennessy & Patterson, *Computer Architecture: A Quantitative Approach*, 6th ed. (2017) | M28.1 (גילואה), M28.2 (גילואה), M28.4 (גילואה) | 3 |
| 4 | Blackman & Popoli, *Design and Analysis of Modern Tracking Systems*, 1999 (Artech House) | M5.17 (גילואה), M7.12 (לנצ'סטר) | 2 |
| 5 | Paul, *Introduction to Electromagnetic Compatibility*, 2nd ed. (Wiley 2006) | M11.24 (גילואה), M15.6 (לנצ'סטר) | 2 |
| 6 | Burcher & Rydill, *Concepts in Submarine Design*, 1994 (CUP) | M30.6 (גילואה), M10.7 (לנצ'סטר) | 2 |
| 7 | Wong, *Theory of Ground Vehicles*, 4th ed. (Wiley 2008) | M11.15 (לנצ'סטר), M11.16 (לנצ'סטר) | 2 |
| 8 | Haykin, *Adaptive Filter Theory*, 5th ed. (Pearson 2014) | M7.20 (גילואה) | 1 |
| 9 | Slotine & Li, *Applied Nonlinear Control*, 1991 (Prentice Hall) | M5.18 (גילואה) | 1 |
| 10 | Kassakian, Perreault, Verghese & Schlecht, *Principles of Power Electronics*, 2nd ed. (CUP 2023) | M12.12 (גילואה) | 1 |
| 11 | Buttazzo, *Hard Real-Time Computing Systems*, 4th ed. (Springer 2024) | M28.5 (גילואה) | 1 |
| 12 | Jensen, Kuperman, Porter & Schmidt, *Computational Ocean Acoustics*, 2nd ed. (Springer 2011) | M30.5 (גילואה) | 1 |
| 13 | Saleh & Teich, *Fundamentals of Photonics*, 3rd ed. (Wiley 2019) | M24.15 (גילואה) | 1 |
| 14 | Raymer, *Aircraft Design: A Conceptual Approach*, 6th ed. (AIAA 2018) | M8.10 (לנצ'סטר) | 1 |
| 15 | Hughes & Girrier, *Fleet Tactics and Naval Operations*, 3rd ed. (Naval Institute Press 2018) | M10.9 (לנצ'סטר) | 1 |

הערות לקנייה:
- **Carlucci & Jacobson** הוא הקנייה המשתלמת ביותר: חמישה מודולים יבשתיים (בליסטיקה, ראשי קרב, נ"ט, ייצוב נשק, ארטילריה).
- **Tupper** מכסה ארבעה מתוך ששת מודולי ההנדסה הימית; Newman (חינם) משלים את ההידרודינמיקה.
- **Blackman & Popoli, Paul, Burcher & Rydill** משרתים כל אחד מודול בגילואה ומודול בלנצ'סטר. אפשר להעלות עותק אחד ולהפנות אליו משתי הספריות.
- ספרים שנקנים למודול אחד בלבד (Haykin, Slotine & Li, Kassakian, Buttazzo, Jensen, Saleh & Teich, Raymer, Hughes & Girrier): לא נמצא להם מקור חינמי באותה איכות. אם צריך לקצץ, המועמדים הראשונים הם המודולים המתקדמים (adv): Saleh & Teich (M24.15) ו-Raymer (M8.10). במקרה כזה המודולים יילמדו מפריטי המורה, כמו היום.
- שדרוגים אפשריים, לא חובה: Madhow, *Fundamentals of Digital Communication* (2008) לסנכרון נושא ותזמון ב-M23.17, ש-Madhow החינמי מכסה רק ברמת מבוא; Ferziger, Perić & Street (2020) ל-M15.32 אם רשימות CFD Direct לא יספיקו; Benford, *High Power Microwaves* (2016) למקורות HPM ב-M7.18.

## 2. מקורות חינמיים

כתובות שסומנו *url unverified* לא נבדקו מכאן (רוב האתרים הממשלתיים חוסמים בדיקה אוטומטית), אבל המסמך עצמו פתוח לציבור. כל השאר נבדקו ב-15.11.2026 והחזירו את הדף או את הקובץ.

### תכנות

- Irving, Hertweck, Johnston, Ostblom, Wickham & Wilson, *Research Software Engineering with Python*, CRC 2021, free online. https://third-bit.com/py-rse/. מודולים: M0.3 (גילואה).
- VanderPlas, *Python Data Science Handbook*, 2nd ed. (2022), free online. https://jakevdp.github.io/PythonDataScienceHandbook/. מודולים: M0.3 (גילואה).
- Gustedt, *Modern C*, Manning, free author edition. https://gustedt.gitlabpages.inria.fr/modern-c/. מודולים: M22.13 (גילואה).

### מתמטיקה ונומריקה

- Kochenderfer & Wheeler, *Algorithms for Optimization*, MIT Press 2019, free PDF from the authors. https://algorithmsbook.com/optimization/. מודולים: M8.24 (גילואה).
- Madsen, Nielsen & Tingleff, *Methods for Non-Linear Least Squares Problems*, DTU IMM, 2nd ed. 2004. https://www2.imm.dtu.dk/pubdb/edoc/imm3215.pdf. מודולים: M8.24 (גילואה).
- Süli, *Numerical Solution of Ordinary Differential Equations (lecture notes)*, Oxford, free. https://people.maths.ox.ac.uk/suli/nsodes.pdf. מודולים: M10.13 (גילואה).
- LLNL (Hindmarsh, Reynolds, Serban, Woodward et al.), *SUNDIALS documentation (CVODE, IDA, sensitivity analysis)*, current. https://sundials.readthedocs.io/en/latest/. מודולים: M10.13 (גילואה).
- Baydin, Pearlmutter, Radul & Siskind, *Automatic Differentiation in Machine Learning: a Survey*, JMLR 2018, arXiv 1502.05767. https://arxiv.org/abs/1502.05767. מודולים: M10.13 (גילואה).
- Särkkä & Solin, *Applied Stochastic Differential Equations*, CUP 2019, free author PDF. https://users.aalto.fi/~asolin/sde-book/sde-book.pdf. מודולים: M7.21 (גילואה).

### סטטיסטיקה, ניסויים ואמינות

- NIST, *NIST/SEMATECH e-Handbook of Statistical Methods*, online, current. https://www.itl.nist.gov/div898/handbook/. מודולים: M6.13 (גילואה), M27.11 (גילואה), M7.14 (לנצ'סטר).
- National Research Council, *Statistics, Testing, and Defense Acquisition: New Approaches and Methodological Improvements*, NAP 1998. https://nap.nationalacademies.org/catalog/6037. מודולים: M6.13 (גילואה), M7.14 (לנצ'סטר).
- US DoD, *MIL-HDBK-338B, Electronic Reliability Design Handbook*, 1998. https://everyspec.com/MIL-HDBK/MIL-HDBK-0300-0499/MIL-HDBK-338B_15041/ *(url unverified)*. מודולים: M27.11 (גילואה).

### עיבוד אותות

- J. O. Smith III, *Spectral Audio Signal Processing*, CCRMA, free online. https://ccrma.stanford.edu/~jos/sasp/. מודולים: M4.17 (גילואה).

### בקרה ומערכות

- Boyd, *EE263 Introduction to Linear Dynamical Systems (lecture slides)*, Stanford Engineering Everywhere. https://see.stanford.edu/Course/EE263. מודולים: M5.16 (גילואה).
- Dahleh, Dahleh & Verghese, *Lectures on Dynamic Systems and Control (6.241J notes)*, MIT OCW 2011. https://ocw.mit.edu/courses/6-241j-dynamic-systems-and-control-spring-2011/pages/readings/. מודולים: M5.16 (גילואה), M5.21 (גילואה).
- Skogestad & Postlethwaite, *Multivariable Feedback Control: Analysis and Design*, 1st ed. (1996), full PDF on the author's site. https://skoge.folk.ntnu.no/skoge/book/ps/bookall.pdf. מודולים: M5.21 (גילואה).
- Rawlings, Mayne & Diehl, *Model Predictive Control: Theory, Computation, and Design*, 2nd ed. (2017/2022), free from the authors. https://sites.engineering.ucsb.edu/~jbraw/mpc/. מודולים: M5.19 (גילואה).
- Liberzon, *Calculus of Variations and Optimal Control Theory*, Princeton 2012, free draft from the author. https://liberzon.csl.illinois.edu/teaching/cvoc.pdf. מודולים: M5.19 (גילואה).
- Söderström & Stoica, *System Identification*, Prentice Hall 1989, free from the authors. https://user.it.uu.se/~ts/sysidbook.pdf. מודולים: M5.20 (גילואה).
- Wittenmark, Åström & Årzén, *Computer Control: An Overview (IFAC Professional Brief)*, IFAC 2002. https://www.kth.se/social/upload/4f311a97f2765461cf00000d/IFAC_control.pdf. מודולים: M5.22 (גילואה).

### תקשורת ורשתות

- Banerjee, *PLL Performance, Simulation, and Design*, 5th ed. (2017), free from TI (SNAA106C). https://www.ti.com/lit/ml/snaa106c/snaa106c.pdf. מודולים: M23.18 (גילואה).
- Madhow, *Introduction to Communication Systems (author draft)*, Jan 2014 draft of the CUP 2014 book. https://wcsl.ece.ucsb.edu/sites/default/files/f/intro_comm_systems_madhow_jan2014b_0.pdf. מודולים: M23.17 (גילואה).
- 3GPP, *3GPP TS 38.300, NR and NG-RAN Overall Description*, Rel-18. https://www.3gpp.org/ftp/Specs/archive/38_series/38.300/ *(url unverified)*. מודולים: M23.19 (גילואה).
- Lin et al. (Ericsson), *5G New Radio: Unveiling the Essentials of the Next Generation Wireless Access Technology*, arXiv 1806.06898 (2018). https://arxiv.org/abs/1806.06898. מודולים: M23.19 (גילואה).
- IETF, *IETF RFC 3561 (AODV), RFC 3626 (OLSR), RFC 4838 (DTN architecture)*, 2003-2007. https://www.rfc-editor.org/rfc/rfc3626. מודולים: M15.2 (לנצ'סטר).

### אלקטרומגנטיות, חישה ואנרגיה מכוונת

- Schneider, *Understanding the Finite-Difference Time-Domain Method*, free online. https://eecs.wsu.edu/~schneidj/ufdtd/. מודולים: M10.12 (גילואה).
- Degen, Reinhard & Cappellaro, *Quantum Sensing*, Rev. Mod. Phys. 89, 035002 (2017), arXiv 1611.02427. https://arxiv.org/abs/1611.02427. מודולים: M24.14 (גילואה).
- US DoD, *MIL-STD-461G and MIL-STD-464C (EMI test methods; system E3 requirements)*, 2015 / 2010. https://quicksearch.dla.mil/ *(url unverified)*. מודולים: M7.18 (לנצ'סטר), M15.6 (לנצ'סטר).
- Nielsen, *Effects of Directed Energy Weapons*, NDU Press 1994/2004. https://digitalcommons.ndu.edu/ndupress-books/16. מודולים: M7.17 (לנצ'סטר), M7.18 (לנצ'סטר).

### ראייה, רובוטיקה וניווט

- Prince, *Computer Vision: Models, Learning, and Inference*, CUP 2012, free PDF from the author. http://www.computervisionmodels.com/. מודולים: M19.12 (גילואה).
- Barfoot, *State Estimation for Robotics*, 2nd ed. (CUP 2024), free from the author. https://asrl.utias.utoronto.ca/~tdb/bib/barfoot_ser24.pdf. מודולים: M19.12 (גילואה).
- Solà, Deray & Atchuthan, *A micro Lie theory for state estimation in robotics*, arXiv 1812.01537. https://arxiv.org/abs/1812.01537. מודולים: M19.12 (גילואה).
- Dellaert & Kaess, *Factor Graphs for Robot Perception*, Foundations and Trends in Robotics 2017. https://www.cs.cmu.edu/~kaess/pub/Dellaert17fnt.pdf. מודולים: M5.13 (לנצ'סטר).
- Forster, Carlone, Dellaert & Scaramuzza, *On-Manifold Preintegration for Real-Time Visual-Inertial Odometry*, IEEE T-RO 2017, arXiv 1512.02363. https://arxiv.org/abs/1512.02363. מודולים: M5.13 (לנצ'סטר).
- Canciani, *Absolute Positioning Using the Earth's Magnetic Anomaly Field (PhD dissertation)*, AFIT 2016. https://scholar.afit.edu/etd/251. מודולים: M5.13 (לנצ'סטר).
- US DOT Volpe Center, *Complementary PNT and GPS Backup Technologies Demonstration Report*, 2021. https://rosap.ntl.bts.gov/view/dot/55765. מודולים: M5.14 (לנצ'סטר).
- LaValle, *Planning Algorithms*, CUP 2006, free from the author. https://lavalle.pl/planning/. מודולים: M11.16 (לנצ'סטר).
- Ebadi et al., *Present and Future of SLAM in Extreme Environments: The DARPA SubT Challenge*, IEEE T-RO 2023, arXiv 2208.01787. https://arxiv.org/abs/2208.01787. מודולים: M11.16 (לנצ'סטר), M11.17 (לנצ'סטר).

### מחשוב, חומרה ו-MBSE

- Arpaci-Dusseau & Arpaci-Dusseau, *Operating Systems: Three Easy Pieces*, v1.10, free. https://pages.cs.wisc.edu/~remzi/OSTEP/. מודולים: M22.14 (גילואה).
- van Steen & Tanenbaum, *Distributed Systems*, 4th ed. (2023), free personal PDF. https://www.distributed-systems.net/index.php/books/ds4/. מודולים: M22.16 (גילואה).
- NVIDIA, *CUDA C++ Programming Guide and Best Practices Guide*, current. https://docs.nvidia.com/cuda/cuda-programming-guide/. מודולים: M28.2 (גילואה).
- Sze, Chen, Yang & Emer, *Efficient Processing of Deep Neural Networks: A Tutorial and Survey*, Proc. IEEE 2017, arXiv 1703.09039. https://arxiv.org/abs/1703.09039. מודולים: M28.2 (גילואה), M29.7 (גילואה), M15.4 (לנצ'סטר).
- Das Sharma et al., *An Introduction to the Compute Express Link (CXL) Interconnect*, ACM Computing Surveys 2024, arXiv 2306.11227. https://arxiv.org/abs/2306.11227. מודולים: M28.4 (גילואה).
- AMD/Xilinx, *UltraFast Design Methodology Guide (UG949) and Vivado timing guides (UG903, UG906)*, current. https://docs.amd.com/r/en-US/ug949-vivado-design-methodology *(url unverified)*. מודולים: M28.3 (גילואה).
- Cummings, *Clock Domain Crossing (CDC) Design & Verification Techniques Using SystemVerilog*, SNUG Boston 2008. https://www.sunburst-design.com/papers/CummingsSNUG2008Boston_CDC.pdf. מודולים: M28.3 (גילואה).
- IEEE, *IEEE 1800-2023, SystemVerilog Language Reference Manual (IEEE GET Program)*, 2023. https://standards.ieee.org/ieee/1800/7743/ *(url unverified)*. מודולים: M28.3 (גילואה).
- Barry, *Mastering the FreeRTOS Real Time Kernel*, 2016, free. https://www.freertos.org/media/2018/161204_Mastering_the_FreeRTOS_Real_Time_Kernel-A_Hands-On_Tutorial_Guide.pdf. מודולים: M28.5 (גילואה).
- OMG / Systems Modeling (Seidewitz et al.), *SysML v2 Release: Intro to the SysML v2 Language (Textual Notation) and the OMG SysML v2 specification*, 2025 release. https://github.com/Systems-Modeling/SysML-v2-Release *(url unverified)*. מודולים: M27.10 (גילואה).

### אבטחה וקריפטוגרפיה

- Boneh & Shoup, *A Graduate Course in Applied Cryptography*, v0.6 (2023), free. https://toc.cryptobook.us/. מודולים: M22.15 (גילואה).
- NIST, *FIPS 203, Module-Lattice-Based Key-Encapsulation Mechanism Standard*, 2024. https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf. מודולים: M22.15 (גילואה).
- Anderson, *Security Engineering*, 2nd ed. (2008), free from the author. https://www.cl.cam.ac.uk/~rja14/book.html. מודולים: M28.6 (גילואה).
- NIST, *NIST SP 800-193, Platform Firmware Resiliency Guidelines*, 2018. https://csrc.nist.gov/pubs/sp/800/193/final. מודולים: M28.6 (גילואה).
- Kocher et al., *Spectre Attacks: Exploiting Speculative Execution*, IEEE S&P 2019, arXiv 1801.01203. https://arxiv.org/abs/1801.01203. מודולים: M28.6 (גילואה).

### AI מודרני

- Achiam (OpenAI), *Spinning Up in Deep RL*, 2018. https://spinningup.openai.com/. מודולים: M18.11 (גילואה).
- Murphy, *Reinforcement Learning: A Comprehensive Overview*, arXiv 2412.05265 (2025 version). https://arxiv.org/abs/2412.05265. מודולים: M18.11 (גילואה).
- Jurafsky & Martin, *Speech and Language Processing*, 3rd ed. draft (2025), free. https://web.stanford.edu/~jurafsky/slp3/ *(url unverified)*. מודולים: M29.1 (גילואה).
- Su et al.; Dao et al.; DeepSeek-AI, *RoFormer (arXiv 2104.09864); FlashAttention (2205.14135); DeepSeek-V3 Technical Report (2412.19437)*, 2021-2024. https://arxiv.org/abs/2412.19437. מודולים: M29.1 (גילואה).
- Austin et al. (Google DeepMind), *How to Scale Your Model*, 2025, free online. https://jax-ml.github.io/scaling-book/. מודולים: M29.2 (גילואה), M29.4 (גילואה).
- Hugging Face (Tazi et al.), *The Ultra-Scale Playbook: Training LLMs on GPU Clusters*, 2025, free. https://huggingface.co/spaces/nanotron/ultrascale-playbook. מודולים: M29.2 (גילואה).
- Hoffmann et al., *Training Compute-Optimal Large Language Models*, arXiv 2203.15556 (2022). https://arxiv.org/abs/2203.15556. מודולים: M29.2 (גילואה).
- Lambert, *Reinforcement Learning from Human Feedback*, 2025, free online. https://rlhfbook.com/. מודולים: M29.3 (גילואה).
- Shao et al.; DeepSeek-AI, *DeepSeekMath / GRPO (arXiv 2402.03300); DeepSeek-R1 (2501.12948)*, 2024-2025. https://arxiv.org/abs/2501.12948. מודולים: M29.3 (גילואה).
- Kwon et al.; Leviathan et al.; Frantar et al.; Lin et al.; Pope et al., *vLLM/PagedAttention (arXiv 2309.06180); Speculative decoding (2211.17192); GPTQ (2210.17323); AWQ (2306.00978); Efficiently Scaling Transformer Inference (2211.05102)*, 2022-2024. https://arxiv.org/abs/2309.06180. מודולים: M29.4 (גילואה).
- Carion; Oquab; Kirillov; Ravi; Mildenhall; Kerbl; Hafner et al., *DETR (arXiv 2005.12872); DINOv2 (2304.07193); SAM (2304.02643); SAM 2 (2408.00714); NeRF (2003.08934); 3D Gaussian Splatting (2308.04079); DreamerV3 (2301.04104)*, 2020-2024. https://arxiv.org/abs/2308.04079. מודולים: M29.5 (גילואה).
- Anthropic; Yao et al.; Kim et al., *Building Effective Agents (Anthropic 2024); ReAct (arXiv 2210.03629); OpenVLA (2406.09246)*, 2022-2024. https://www.anthropic.com/engineering/building-effective-agents. מודולים: M29.6 (גילואה).
- Jacob et al.; Madry et al.; Hendrycks & Dietterich, *Quantization and Training of NNs for Integer-Arithmetic-Only Inference (arXiv 1712.05877); Towards Deep Learning Models Resistant to Adversarial Attacks (1706.06083); Benchmarking NN Robustness to Common Corruptions (1903.12261)*, 2018-2019. https://arxiv.org/abs/1706.06083. מודולים: M29.7 (גילואה), M15.4 (לנצ'סטר).
- Huyen (Stanford), *CS 329S: Machine Learning Systems Design (lecture notes)*, 2022. https://stanford-cs329s.github.io/syllabus.html. מודולים: M29.8 (גילואה).
- Sculley et al., *Hidden Technical Debt in Machine Learning Systems*, NeurIPS 2015. https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems *(url unverified)*. מודולים: M29.8 (גילואה).

### אווירונאוטיקה, זורמים והנעה

- Leishman, *Introduction to Aerospace Flight Vehicles*, ERAU open textbook (2025). https://eaglepubs.erau.edu/introductiontoaerospaceflightvehicles/. מודולים: M15.31 (גילואה).
- Greenshields & Weller, *Notes on Computational Fluid Dynamics: General Principles*, CFD Direct 2022, free online. https://doc.cfd.direct/notes/cfd-general-principles/. מודולים: M15.32 (גילואה).
- NASA Langley, *Turbulence Modeling Resource*, online. https://turbmodels.larc.nasa.gov/ *(url unverified)*. מודולים: M15.32 (גילואה).
- NASA, *NASA SP-8076, Solid Propellant Grain Design and Internal Ballistics*, 1972. https://ntrs.nasa.gov/citations/19730007077. מודולים: M6.15 (לנצ'סטר).

### הנדסה ימית

- Newman, *Marine Hydrodynamics*, 40th anniversary ed. (MIT Press 2018, open access). https://direct.mit.edu/books/oa-monograph/3970/Marine-Hydrodynamics-40th-anniversary-edition *(url unverified)*. מודולים: M30.2 (גילואה), M30.3 (גילואה).

### צבא, מדיניות ודוקטרינה (פתוח)

- National Research Council, *Autonomous Vehicles in Support of Naval Operations*, NAP 2005. https://nap.nationalacademies.org/catalog/11379. מודולים: M10.8 (לנצ'סטר).
- National Research Council, *Naval Mine Warfare: Operational and Technical Challenges for Naval Forces*, NAP 2001. https://nap.nationalacademies.org/catalog/10176. מודולים: M10.10 (לנצ'סטר).
- Reid, *The Response of Surface Ships to Underwater Explosions (DSTO-GD-0109)*, DSTO 1996. https://apps.dtic.mil/sti/pdfs/ADA326738.pdf *(url unverified)*. מודולים: M10.8 (לנצ'סטר).
- Tracy & Wright, *Modeling the Performance of Hypersonic Boost-Glide Missiles*, Science & Global Security 28(3), 2020. https://scienceandglobalsecurity.org/archive/sgs28tracy.pdf. מודולים: M6.16 (לנצ'סטר).
- Congressional Research Service, *Hypersonic Weapons: Background and Issues for Congress (R45811)*, latest update. https://crsreports.congress.gov/product/pdf/R/R45811 *(url unverified)*. מודולים: M6.16 (לנצ'סטר).
- Congressional Research Service, *Department of Defense Directed Energy Weapons: Background and Issues for Congress (R46925)*, latest update. https://crsreports.congress.gov/product/pdf/R/R46925 *(url unverified)*. מודולים: M7.17 (לנצ'סטר).
- Congressional Research Service, *Joint All-Domain Command and Control (R46725)*, latest update. https://crsreports.congress.gov/product/pdf/R/R46725 *(url unverified)*. מודולים: M7.13 (לנצ'סטר).
- Alberts & Hayes, *Understanding Command and Control*, CCRP 2006. http://www.dodccrp.org/files/Alberts_UC2.pdf. מודולים: M7.13 (לנצ'סטר).
- Defense Science Board, *The Role of Autonomy in DoD Systems*, 2012. https://dsb.cto.mil/ *(url unverified)*. מודולים: M7.13 (לנצ'סטר).
- DoD Office of General Counsel, *Department of Defense Law of War Manual*, June 2015, updated July 2023. https://media.defense.gov/2023/Jul/31/2003271432/-1/-1/0/DOD-LAW-OF-WAR-MANUAL-JUNE-2015-UPDATED-JULY%202023.PDF *(url unverified)*. מודולים: M7.15 (לנצ'סטר).
- DoD, *DoD Directive 3000.09, Autonomy in Weapon Systems*, 25 Jan 2023. https://www.esd.whs.mil/portals/54/documents/dd/issuances/dodd/300009p.pdf *(url unverified)*. מודולים: M7.15 (לנצ'סטר).
- State of Israel, Ministry of Defense (DECA), *Defense Export Control Law, 5766-2007 (and orders)*, 2007, with amendments. https://www.exportctrl.mod.gov.il/ *(url unverified)*. מודולים: M7.15 (לנצ'סטר).
- Rubin, *Israel's Air and Missile Defense During the 2014 Gaza War (Mideast Security and Policy Studies 111)*, BESA 2015. https://besacenter.org/wp-content/uploads/2015/02/111eng_web1.pdf. מודולים: M7.16 (לנצ'סטר).
- Holland Michel, *Counter-Drone Systems*, 2nd ed. (Bard Center for the Study of the Drone, 2019). https://dronecenter.bard.edu/files/2019/12/CSD-CUAS-2nd-Edition-Web.pdf. מודולים: M9.10 (לנצ'סטר).
- Pettyjohn, *Evolution Not Revolution: Drone Warfare in Russia's 2022 Invasion of Ukraine*, CNAS 2024. https://www.cnas.org/publications/reports/evolution-not-revolution. מודולים: M9.10 (לנצ'סטר).
- US Army, *FM 3-09, Fire Support and Field Artillery Operations*, 2020. https://armypubs.army.mil/ *(url unverified)*. מודולים: M11.19 (לנצ'סטר).
- US Army/USMC/USN/USAF, *FM 3-11.9, Potential Military Chemical/Biological Agents and Compounds*, 2005. https://irp.fas.org/doddir/army/fm3-11-9.pdf *(url unverified)*. מודולים: M11.20 (לנצ'סטר).
- Glasstone & Dolan, *The Effects of Nuclear Weapons*, 3rd ed. (1977). https://www.osti.gov/biblio/6852629. מודולים: M11.20 (לנצ'סטר).
- Glaser, *Characteristics of the Gas Centrifuge for Uranium Enrichment and Their Relevance for Nuclear Weapon Proliferation*, Science & Global Security 16 (2008). https://scienceandglobalsecurity.org/archive/sgs16glaser.pdf. מודולים: M12.5 (לנצ'סטר).
- IAEA, *IAEA Safeguards Glossary*, 2022 ed.. https://www.iaea.org/publications/15286/iaea-safeguards-glossary *(url unverified)*. מודולים: M12.5 (לנצ'סטר).
- UK MOD, DCDC, *Wargaming Handbook*, 2017. https://assets.publishing.service.gov.uk/media/5a82e90d40f0b6230269d575/doctrine_uk_wargaming_handbook.pdf. מודולים: M14.8 (לנצ'סטר).
- ESA/ECSS, *ECSS-E-ST-50-12C Rev.1, SpaceWire: Links, Nodes, Routers and Networks*, 2019. https://ecss.nl/standard/ecss-e-st-50-12c-rev-1-spacewire-links-nodes-routers-and-networks-15-may-2019/. מודולים: M15.1 (לנצ'סטר).
- US Army, *FM 3-12, Cyberspace Operations and Electromagnetic Warfare*, 2021. https://armypubs.army.mil/epubs/DR_pubs/DR_a/ARN31186-FM_3-12-000-WEB-1.pdf. מודולים: M15.5 (לנצ'סטר).
- GAO, *GAO-19-128, Weapon Systems Cybersecurity: DOD Just Beginning to Grapple with Scale of Vulnerabilities*, 2018. https://www.gao.gov/products/gao-19-128 *(url unverified)*. מודולים: M15.5 (לנצ'סטר).
- US Army Corps of Engineers, *EM 1110-1-1802, Geophysical Exploration for Engineering and Environmental Investigations*, 1995. https://www.publications.usace.army.mil/Portals/76/Publications/EngineerManuals/EM_1110-1-1802.pdf *(url unverified)*. מודולים: M11.17 (לנצ'סטר).
- US DoD, *UFC 3-340-02, Structures to Resist the Effects of Accidental Explosions*, 2008 (change 2). https://www.wbdg.org/ffc/dod/unified-facilities-criteria-ufc/ufc-3-340-02. מודולים: M11.17 (לנצ'סטר).

## 3. כבר בספרייה

מקור שנמצא בספרייה של מעבדה אחת ומשמש מודול של המעבדה השנייה מסומן **(חוצה)**. אין צורך להעלות אותו שוב, רק להפנות אליו.

| מזהה | מקור | ספרייה | מודולים |
|---|---|---|---|
| E02 | Oppenheim & Verghese, *Signals, Systems and Inference (MIT 6.011 notes)* | גילואה | M7.19 (גילואה) |
| E03 | Åström & Murray, *Feedback Systems* | גילואה | M5.22 (גילואה), M11.14 (לנצ'סטר) **(חוצה)** |
| E09 | Horowitz & Hill, *The Art of Electronics* | גילואה | M11.25 (גילואה) |
| E17 | Prince, *Understanding Deep Learning* | גילואה | M29.1 (גילואה) |
| E22 | Patterson & Hennessy, *Computer Organization and Design, RISC-V Edition* | גילואה | M22.13 (גילואה) |
| E25 | Weste & Harris, *CMOS VLSI Design* | גילואה | M28.3 (גילואה) |
| E26 | NASA, *NASA Systems Engineering Handbook* | גילואה | M27.10 (גילואה) |
| E30 | Oppenheim, Schafer & Buck, *Discrete-Time Signal Processing* | גילואה | M4.17 (גילואה), M4.18 (גילואה) |
| E31 | Stoica & Moses, *Spectral Analysis of Signals* | גילואה | M10.6 (לנצ'סטר) **(חוצה)** |
| E34 | Kurose & Ross, *Computer Networking: A Top-Down Approach* | גילואה | M22.15 (גילואה), M15.2 (לנצ'סטר), M15.5 (לנצ'סטר) **(חוצה)** |
| E39 | Hill & Peterson, *Mechanics and Thermodynamics of Propulsion* | גילואה | M15.31 (גילואה), M6.15 (לנצ'סטר) **(חוצה)** |
| E48 | Särkkä, *Bayesian Filtering and Smoothing* | גילואה | M7.21 (גילואה) |
| E52 | NASA, *Probabilistic Risk Assessment Procedures Guide* | גילואה | M27.11 (גילואה) |
| A02.3 | Vo, Vo & Phung, *Labeled Random Finite Sets and the Bayes Multi-Target Tracking Filter* | לנצ'סטר | M5.17 (גילואה) **(חוצה)** |
| A02.5 | JMOe, *Micro-Doppler: Drones vs Birds* | לנצ'סטר | M9.10 (לנצ'סטר) |
| A05.4 | Khalife, Neinavaie & Kassas, *Starlink Carrier Phase Positioning* | לנצ'סטר | M5.14 (לנצ'סטר) |
| A05.5 | Riley, *Handbook of Frequency Stability Analysis, NIST SP 1065* | לנצ'סטר | M28.5 (גילואה), M24.14 (גילואה), M5.14 (לנצ'סטר) **(חוצה)** |
| A05.6 | Woodman, *An Introduction to Inertial Navigation, Cambridge TR-696* | לנצ'סטר | M11.25 (גילואה), M5.13 (לנצ'סטר) **(חוצה)** |
| A06.2 | Acton, *Hypersonic Boost-Glide Weapons* | לנצ'סטר | M6.16 (לנצ'סטר) |
| A08.4 | SISO, *SISO-STD-002-2021, Standard for Link 16 Simulation* | לנצ'סטר | M15.3 (לנצ'סטר) |
| A08.9 | Gonzales et al., *Air-to-Air Combat With and Without Link 16, RAND MG-268* | לנצ'סטר | M15.3 (לנצ'סטר) |
| A10.3 | Kumar, *Defense of Surface Ships Against Anti-Ship Missiles* | לנצ'סטר | M10.9 (לנצ'סטר) |
| A10.5 | Coraluppi & Carthel, *Advances in Active Sonar Tracking* | לנצ'סטר | M10.6 (לנצ'סטר) |
| B02a | Melvin & Scheer (eds.), *Principles of Modern Radar, Vol. II: Advanced Techniques* | לנצ'סטר | M5.17 (גילואה), M7.12 (לנצ'סטר), M10.6 (לנצ'סטר) **(חוצה)** |
| B03 | Driggers et al., *Introduction to Infrared and Electro-Optical Systems* | לנצ'סטר | M11.25 (גילואה), M3.15 (לנצ'סטר), M7.17 (לנצ'סטר) **(חוצה)** |
| B04 | Adamy, *EW 102: A Second Course in Electronic Warfare* | לנצ'סטר | M13.24 (לנצ'סטר) |
| B07 | Boord & Hoffman, *Air and Missile Defense Systems Engineering* | לנצ'סטר | M7.13 (לנצ'סטר), M7.16 (לנצ'סטר) |
| B08 | Moir & Seabridge, *Military Avionics Systems* | לנצ'סטר | M5.13 (לנצ'סטר), M15.1 (לנצ'סטר) |
| B10 | Hall (ed.), *Principles of Naval Weapons Systems* | לנצ'סטר | M10.6 (לנצ'סטר), M10.7 (לנצ'סטר), M10.10 (לנצ'סטר), M11.11 (לנצ'סטר) |
| B11 | Ogorkiewicz, *Tanks: 100 Years of Evolution* | לנצ'סטר | M11.13 (לנצ'סטר) |
| B12 | Wertz, Everett & Puschell (eds.), *Space Mission Engineering: The New SMAD* | לנצ'סטר | M13.24 (לנצ'סטר) |
| B13 | Fleeman, *Tactical Missile Design* | לנצ'סטר | M6.15 (לנצ'סטר), M11.13 (לנצ'סטר) |
| B14 | Washburn & Kress, *Combat Modeling* | לנצ'סטר | M10.9 (לנצ'סטר), M10.10 (לנצ'סטר) |
| B15 | Przemieniecki, *Mathematical Methods in Defense Analyses* | לנצ'סטר | M11.12 (לנצ'סטר), M11.18 (לנצ'סטר) |
| B16 | Ball, *The Fundamentals of Aircraft Combat Survivability Analysis and Design* | לנצ'סטר | M3.15 (לנצ'סטר), M8.10 (לנצ'סטר) |
| B19 | Orfanidis, *Electromagnetic Waves and Antennas* | לנצ'סטר | M10.12 (גילואה) **(חוצה)** |
| B22 | Hero, *Statistical Methods for Signal Processing (EECS 564 notes)* | לנצ'סטר | M7.19 (גילואה) **(חוצה)** |
| D10 | Joint Chiefs of Staff, *JP 3-60 Joint Targeting* | לנצ'סטר | M7.15 (לנצ'סטר), M11.18 (לנצ'סטר) |
| D8 | US Army, *ATP 3-09.12 Field Artillery Target Acquisition* | לנצ'סטר | M11.19 (לנצ'סטר) |
| D9 | US Army, *ATP 3-01.81 Counter-Unmanned Aircraft System* | לנצ'סטר | M9.10 (לנצ'סטר) |
