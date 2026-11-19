# גילואה: פערים וטעויות סדר בסילבוס ההנדסה (15.11.2026)

**הבסיס:** `tmp/syllabus/eng_modules.txt` (רשימת המודולים הנוכחית), `eng_docs.txt`, היעדים ב-`docs/research/round5/expert/E2_domain_targets.md`, המיפוי ב-`docs/research/round7/mapping/` (E2_COVERAGE, ENG_mapping, BOOKS, SYNTHESIS), ופריטי `library/engineering/syllabus/curriculum.json`. בדקתי גם את רשימת המודולים של לנצ'סטר (`mil_modules.txt`), כדי לא לדווח כפער נושא שנלמד שם.

**הכלל:** "פער" = נושא שמומחה בתחום צריך ב-2026, ואין מודול (קיים או מוצע על ידי הלומד) שמלמד אותו בעומק ליבה מספר מקור. כשהנושא קיים היום רק כ"פריט" של המורה (שורה אחת ב-curriculum.json, בלי עמודי מקור), כתבתי זאת. פריט כזה נותן מושג, לא עומק של מומחה. מה שהלומד כבר הציע (הקדמת P20–P22, פיצול P8, גשר המחשוב וגשר ה-AI) לא מופיע כממצא. בסעיף 3 יש להם מקורות.

**עמודים:** הערכה לפי תוכן העניינים של המהדורה שצוינה [estimate], אלא אם נכתב אחרת. כשהמקור כבר בספרייה, זה מצוין.

---

## 1. פערים

### 1.0 תשתית חוצת-תחומים

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G1 | **Scientific programming: Python, NumPy, git and testing** | Python וספריות הנומריקה (NumPy, SciPy, Matplotlib), סביבות וחבילות, git, pytest, קריאת diff וקוד של סוכן, לוגים ושחזוריות | מיד אחרי P0 (לפני P1, במקביל ל-M1.1) | M0.1 | Irving et al., *Research Software Engineering with Python* (CRC 2021, חינם ב-third-bit.com/py-rse), פרקים 1–8, 11–12; VanderPlas, *Python Data Science Handbook*, מהדורה 2 (2022, חינם), חלקים 2 ו-4 | ~300 | must |
| G2 | **C and the machine** | C ברמת קריאה: מצביעים, זיכרון, volatile, ביטים, קומפילציה וקישור; איך קוד C הופך לפקודות | אחרי M22.4 | G1, M22.4 | Kernighan & Ritchie, *The C Programming Language*, מהדורה 2, פרקים 1–6; Bryant & O'Hallaron, *CS:APP*, מהדורה 3, פרקים 3 (נבחר) ו-7 | ~220 | should |

**למה G1 חובה:** היעד שם את שטף העבודה עם סוכני קוד בגל 1 ("Python, git, pytest עם סוכן מהשבוע הראשון"). ב-ENG_mapping אין אזכור אחד של Python. git מופיע רק כפריט ב-M27.3. בנוסף, M10.4–M10.11 (Langtangen) כתובים כולם סביב קוד Python ומניחים שהלומד קורא אותו. כלומר G1 הוא גם דרישה חסרה של P10 (ראו 2.2).
**למה G2:** White (M22.11), CUDA בגשר המחשוב ו-RTOS כתובים ב-C. בלי קריאת C, הבדיקה של קוד embedded שסוכן כתב נשארת שטחית.

### 1.1 מתמטיקה ונומריקה

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G3 | **Numerical optimization beyond convexity** | line search ו-trust region, quasi-Newton (BFGS), ריבועים פחותים לא לינאריים (Gauss-Newton, Levenberg-Marquardt), SQP, אופטימיזציה בשלמים | אחרי M8.23 | M8.22 | Nocedal & Wright, *Numerical Optimization*, מהדורה 2 (2006), פרקים 2–4, 6, 10, 18; Wolsey, *Integer Programming*, מהדורה 2 (2020), פרקים 1–2, 7 | ~260 | must |
| G4 | **Numerical ODEs, stiffness and automatic differentiation** | Runge-Kutta עם צעד מסתגל, קשיחות ושיטות סתומות, DAE, משוואות לא לינאריות (Newton), גזירה אוטומטית | אחרי M10.4 | M10.4, M8.7, G1 | Ascher & Petzold, *Computer Methods for ODEs and DAEs* (SIAM 1998), פרקים 2–5, 9; Baydin et al., "Automatic Differentiation in Machine Learning: a Survey", JMLR 2018 | ~170 | should |
| G5 | **Stochastic differential equations** | תנועה בראונית, Itô, SDE לינארי, דיסקרטיזציה, מודלי רעש של חיישנים (random walk, Gauss-Markov), הקשר למסנן קלמן רציף ולמודלי דיפוזיה | אחרי M7.12 | M7.1, M3.1, M5.6 | Särkkä & Solin, *Applied Stochastic Differential Equations* (CUP 2019, חינם מהמחברים), פרקים 1–7, 10 | ~150 | should |

**למה G3 חובה:** היעד במתמטיקה הוא "חוקר שמפתח שיטה בנישת האומדן והאופטימיזציה לחישה". Boyd מכסה את הקמור בלבד. Gauss-Newton ו-LM הם הלב של כיול, bundle adjustment, SLAM, זיהוי מערכות ו-MPC לא לינארי, ואינם נלמדים בשום מודול. אופטימיזציה בשלמים מופיעה רק כפריט ב-M21.7.

### 1.2 אותות ומערכות (תחום עומק, גל 1)

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G6 | **Filter banks and polyphase channelizers** | DFT filter banks, ערוצון polyphase (ה-channelizer של מקלט ES ו-SDR רחב-פס), CIC ו-half-band, שחזור מושלם, resampling בקצב שרירותי | אחרי M4.15 | M4.12, M4.13, M4.14 | harris, *Multirate Signal Processing for Communication Systems*, מהדורה 2 (River 2021), פרקים 6–10, 13 | ~220 | must |
| G7 | **Finite word-length and real-time DSP implementation** | נקודה קבועה, סקיילינג וגלישה, רעש קוונטיזציה של מקדמים ושל מכפלות, מבנים (direct, cascade, lattice), CORDIC, תקציב מחזורים | אחרי G6 | M4.13, M4.14, M4.8 | Oppenheim, Schafer & Buck, מהדורה 2 (**E30, כבר בספרייה**), §6.6–6.10; Lyons, *Understanding Digital Signal Processing*, מהדורה 3 (2010), פרקים 12–13 ו-§10.5 | ~150 | must |
| G8 | **Adaptive filtering** | LMS, NLMS, RLS, התכנסות מול misadjustment, ביטול הפרעות ו-equalization, הבסיס ל-STAP ולאלומה מסתגלת | אחרי M7.4 | M7.3, M8.5, M8.8 | Haykin, *Adaptive Filter Theory*, מהדורה 5 (2014), פרקים 5–6, 10 (ו-§2 לחזרה על Wiener) | ~170 | must |
| G9 | **Statistical signal processing: estimation and detection theory** | MVU, CRB במלואו, BLUE, ML ואומדנים בייסיאניים, Neyman-Pearson, GLRT ובעיות מורכבות, גילוי אות ברעש צבעוני, תכונות CFAR | אחרי M7.4 (לפני G8) | M7.4, M6.5, M8.5 | Hero, *Statistical Methods for Signal Processing* (EECS 564, **B22 בספרייה של לנצ'סטר**), פרקים 4–5, 7–9; חלופה מלאה יותר: Kay, *Fundamentals of SSP*, כרך I פרקים 2–7, 10–12 וכרך II פרקים 3–7 | ~200 (Hero) / ~470 (Kay) | must |

**למה:**
- G6 ו-G7: היעד ב"אותות ומערכות" מונה במפורש multirate, נקודה קבועה ואילוצי זמן אמת, ו-PYNQ RFSoC. M4.12 הוא 18 עמודים בלבד (decimation ו-polyphase בסיסי). קבלן ערוצים לא נלמד בשום מקום, וגם בלנצ'סטר M4.2–M4.3 (EW 101) הם סקירה של 13 עמודים. נקודה קבועה קיימת רק כפריט ב-M4.10.
- G8: קיים רק כפריט ב-M7.3. לרמת principal DSP ולרמת EW (ביטול הפרעות, equalization, STAP) זה עומק חסר.
- G9: ב-ENG יש את Oppenheim & Verghese (M7.3–M7.4, כ-90 עמ'), ובלנצ'סטר רק 29 עמודים מ-Hero (M2.40, ה-CRB). Kay הוחלף ב-Hero, אבל רק פרק אחד שלו נכנס. ליעד "חוקר שיטה" זה לא מספיק. רוב העבודה כבר בספרייה.

### 1.3 בקרה ושערוך (תחום עומק, גל 1)

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G10 | **Linear systems theory at graduate depth** | Gramians, least-norm, SVD של מערכות, ריאליזציה מינימלית, צורות קנוניות, balanced truncation, LQR/LQE בניסוח מטריצי מלא | אחרי M5.6 (אחרי בלוק האלגברה הלינארית) | M5.6, M8.4, M8.8 | Boyd, *EE263 Introduction to Linear Dynamical Systems* (רשימות הקורס, Stanford, חינם); Hespanha, *Linear Systems Theory*, מהדורה 2 (Princeton 2018), פרקים 3–4, 11–16 | ~200 | must |
| G11 | **Nonlinear control** | מישור פאזה ומחזורי גבול, יציבות ליאפונוב ו-LaSalle, describing function ו-circle criterion, feedback linearization, backstepping, sliding mode, בקרה מסתגלת | אחרי M5.13 | M5.3, M5.4, M5.8, G10 | Slotine & Li, *Applied Nonlinear Control* (1991), פרקים 1–3, 5–8; Khalil, *Nonlinear Systems*, מהדורה 3, פרק 4 ו-§13–14 לעיון | ~230 | must |
| G12 | **Optimal control and model predictive control** | עקרון המקסימום של פונטריאגין, HJB, שיטות ישירות (shooting, collocation), MPC לינארי ולא לינארי, יציבות דרך עלות סופית, אילוצים ופתרון בזמן אמת | אחרי G3 (סוף P8) | M5.5, M5.6, M8.13, M8.18, M8.22, G3 | Rawlings, Mayne & Diehl, *Model Predictive Control: Theory, Computation, and Design*, מהדורה 2 (2017/2022, חינם מהמחברים), פרקים 1–2, 8; Kirk, *Optimal Control Theory* (Dover), פרק 5 | ~230 | must |
| G13 | **System identification** | ARX, ARMAX, Box-Jenkins, prediction-error, תכן אות עירור, תגובת תדר אמפירית, אימות מודל, זיהוי בלולאה סגורה | אחרי G12 | M5.7, M6.5, M7.2, M8.5 | Ljung, *System Identification: Theory for the User*, מהדורה 2 (1999), פרקים 1–4, 6–7, 13, 16 | ~200 | must |
| G14 | **Target tracking and data association** | מודלי תנועה, עקביות (NEES/NIS) לעומק, IMM, PDA ו-JPDA, MHT, track management, היכרות עם RFS ו-PMBM | אחרי M5.14 (שעובר לאחר P7, ראו 2.1) | M5.14, M7.4, M6.6 | Bar-Shalom, Li & Kirubarajan, *Estimation with Applications to Tracking and Navigation* (2001), פרקים 5–6, 11; Blackman & Popoli, *Design and Analysis of Modern Tracking Systems* (1999), פרקים 6–7 | ~270 | must |
| G15 | **Multivariable and robust control** | MIMO: ערכים סינגולריים, RGA, כיווניות, אי-ודאות מובנית, H∞ ו-μ, מגבלות ביצועים | אחרי G11 | G10, M5.11 | Skogestad & Postlethwaite, *Multivariable Feedback Control*, מהדורה 2 (2005), פרקים 2–4, 6, 8–9 | ~220 | should |
| G16 | **Digital control** | דגימה וסדר-אפס, דיסקרטיזציה, השהיה, aliasing בלולאה, קוונטיזציה ו-anti-windup, מימוש בזמן אמת | אחרי M5.13 | M5.9, M4.10 | Åström & Wittenmark, *Computer-Controlled Systems*, מהדורה 3 (1997), פרקים 2–4, 7–8 | ~170 | should |

**למה:** היעד הוא A4 ברמת EE263/6.241 ומסננים לא לינאריים, ותפקיד principal estimation/tracking engineer. Khalil ו-Bar-Shalom ו-EE263 תוכננו ב-round 7, אבל כש-Khalil ו-Bar-Shalom לא הגיעו, אף מודול לא נוצר. מה שנשאר: ליאפונוב כפריט ב-M3.1; MPC כפריט ב-M5.13; זיהוי מערכות כפריט ב-M5.2; H∞ כפריט ב-M5.11; IMM ושיוך נתונים כשני פריטים "ממתינים" (E2_COVERAGE). בלנצ'סטר יש M2.15 ו-M2.29 (PoMR, 94 עמ'), ברמת סקירה של מכ"ם. המעקב הרב-מטרתי בתוכנית היעד (Stone Soup, JPDA/MHT) צריך את G14.

### 1.4 תקשורת

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G17 | **Digital communication receivers** | מרחב אותות, מקלט אופטימלי, Nyquist ו-pulse shaping, BER של M-ary, סנכרון נושא ותזמון (PLL, Costas, Gardner), equalization (ZF, MMSE, DFE) | אחרי M23.2, לפני M23.5 | M23.2, M7.4, M4.14 | Madhow, *Fundamentals of Digital Communication* (CUP 2008), פרקים 2–5; Rice, *Digital Communications: A Discrete-Time Approach* (2009), פרקים 7–8 | ~350 | must |
| G18 | **5G NR and reading a standard** | ארכיטקטורת NR: numerology, מסגרת, ערוצים, beam management, HARQ; קריאת 3GPP ברמת מבנה | אחרי M23.10 | M23.10, G17 | Dahlman, Parkvall & Sköld, *5G NR*, מהדורה 2 (2020), פרקים 1–7, 12–13 | ~180 | should |

**למה G17 חובה:** M23.2 הוא 16 עמודים מ-O&V, ו-Tse & Viswanath מניח שהבסיס הזה כבר ידוע. סנכרון קיים רק כפריט ב-M23.2. היעד: "מתכנן ומדמה ערוץ: צורת גל, קידוד, סנכרון". בלנצ'סטר M5.4 מלמד לולאות PLL/DLL של GPS, וזו נקודת חיבור טובה, אבל לא מקלט תקשורת.

### 1.5 פיזיקה ואלקטרומגנטיות חישובית

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G19 | **Computational electromagnetics** | Yee ו-FDTD, יציבות CFL, PML, מקורות TF/SF, near-to-far field; רעיון MoM לאנטנות; אימות מול פתרון סגור | אחרי M10.8 | M9.17, M9.19, M10.5, G1 | Schneider, *Understanding the FDTD Method* (חינם, eecs.wsu.edu/~schneidj/ufdtd), פרקים 3–5, 8, 11, 14; Gibson, *The Method of Moments in Electromagnetics*, מהדורה 2 (2014), פרקים 1–3 | ~260 | must |
| G20 | **Quantum sensing** | שעונים אטומיים, אינטרפרומטריית אטומים (ניווט אינרציאלי), מגנטומטרים (NV, SERF) ותפקידם בלוחמה תת-ימית, גבולות קוונטיים מול רעש טכני | אחרי M24.7 (שהופך לליבה, ראו 2.3) | M24.7, M7.2 | Degen, Reinhard & Cappellaro, "Quantum sensing", *Rev. Mod. Phys.* 89, 035002 (2017); Bongs et al., "Taking atom interferometric quantum sensors from the laboratory to real-world applications", *Nat. Rev. Phys.* 1 (2019) | ~70 | should |
| G21 | **Photonics: beams, lasers and photodetectors** | אלומות גאוס ו-M², מהודים, תווך מגביר, לייזרים פולסיים, סיבים, גלאים ורעש | אחרי M24.8 | M9.13, M24.8 | Saleh & Teich, *Fundamentals of Photonics*, מהדורה 3 (2019), פרקים 3, 10, 15–16, 19 | ~220 | should |

**למה G19 חובה:** תוכנית היעד בפיזיקה מתחילה ב"FDTD של עקיפה מקצה ומחריץ, מול מדידה". P10 מלמד הפרשים סופיים כלליים, לא את Yee, PML ו-near-to-far. אין פריט FDTD אחד ב-curriculum.json.

### 1.6 אלקטרוניקה וחומרה

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G22 | **Power electronics** | buck/boost/flyback, CCM/DCM, volt-second ו-charge balance, מודל ממוצע ובקרת ממיר, מגנטיקה, SiC/GaN, הפסדים ותרמי | אחרי M12.4 | M11.6, M11.18, M5.7 | Erickson & Maksimović, *Fundamentals of Power Electronics*, מהדורה 3 (Springer 2020), פרקים 1–3, 5–8, 10 (נבחר) | ~280 | must |
| G23 | **Signal integrity, power integrity and EMC** | השתקפויות וקווי תמסורת ב-PCB, crosstalk, stackup ו-return path, PDN ו-decoupling, פליטה ורגישות, הארקה וסיכוך, MIL-STD-461 | אחרי M11.20 | M11.11, M9.17, לנצ'סטר M1.5 | Bogatin, *Signal and Power Integrity—Simplified*, מהדורה 3 (2018), פרקים 1–3, 7–11, 13; Ott, *Electromagnetic Compatibility Engineering* (Wiley 2009), פרקים 2–3, 6, 10–12, 17 | ~380 | must |
| G24 | **Frequency synthesis and PLLs** | PLL כמערכת בקרה, רעש פאזה ותרומת כל רכיב, fractional-N, spurs, jitter ו-SNR של ADC | אחרי M11.20 | M5.8, M11.20, לנצ'סטר M1.7 | Banerjee, *PLL Performance, Simulation, and Design*, מהדורה 5 (2017, חינם מהמחבר), פרקים נבחרים | ~150 | should |
| G25 | **Sensors and transducers** | MEMS IMU ומגנטומטר, מדי מאמץ ולחץ, צמדים תרמיים, גלאי IR, ממשקי חיישן, רעש וכיול | אחרי M11.13 | M11.7, M11.13 | Fraden, *Handbook of Modern Sensors*, מהדורה 5 (2016), פרקים 2–6 ונבחרים מ-8–17 | ~200 | should |

**למה:**
- G22: Erickson תוכנן ב-round 7 ולא הגיע. היום יש רק Hughes (M12.4, 33 עמ', ממירים להנעה) ו-H&H (M11.6). היעד באלקטרוניקה כולל בניית buck, והיעד בהספק כולל "סוקר אלקטרוניקת הספק". גם רחפנים וספינה חשמלית תלויים בזה.
- G23: אין בסילבוס SI/PI/EMC בעומק. EMC מופיע רק כפריט "בדיקות סביבה" ב-M27.3, ו-M11.11 (H&H) הוא ref. מהנדס חומרה בכיר במערכות ביטחוניות נבחן על EMC ועל תכן PCB מהיר. גשר המחשוב המוצע (SerDes) נשען על G23.

### 1.7 מחשבים ותוכנה (מעבר לגשר המוצע)

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G26 | **Operating systems and concurrency** | תהליכים ותזמון, זיכרון וירטואלי ו-TLB, threads, נעילות, condition variables, deadlock, I/O ו-DMA, מערכות קבצים | אחרי M22.7 (לפני ה-RTOS בגשר) | M22.7, M21.2, G1 | Arpaci-Dusseau, *Operating Systems: Three Easy Pieces* (v1.10, חינם), פרקים 4–10, 13–23, 26–33, 36 | ~300 | must |
| G27 | **Cryptography and security foundations** | הצפנה סימטרית וא-סימטרית, hash ו-MAC, חתימות, PKI ו-TLS, ניהול מפתחות, מודל איום | לפני מודול אבטחת החומרה בגשר | M20.5, M23.12 | Kurose & Ross (**E34, בספרייה**), פרק 8; Anderson, *Security Engineering*, מהדורה 3 (2020, פרקים חינם), פרקים 2–3, 5 | ~180 | must |
| G28 | **Distributed systems fundamentals** | שכפול ומחיצות, עקביות, קונצנזוס (Raft), זמן ושעונים, תורים ו-latency בזנב | אחרי M23.13 | M23.12, G26 | Kleppmann, *Designing Data-Intensive Applications* (2017; מהדורה 2, 2025), פרקים 5–9 | ~200 | should |

**למה G26 חובה:** מערכות הפעלה קיימות רק כפריט ב-M22.7, ו-concurrency כפריט ב-M22.8. RTOS ו-PTP (בגשר), GPU ו-CUDA, embedded (M22.11) ו-serving של מודלים כולם מניחים את G26.
**למה G27 חובה:** מודול אבטחת החומרה המוצע (root of trust, secure boot, side channels) בנוי על חתימות, hash וניהול מפתחות. היום זה פריט ב-M23.7 ופריט ב-M22.11 בלבד.

### 1.8 למידת מכונה, למידה מחיזוקים, רובוטיקה

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G29 | **Deep reinforcement learning algorithms** | DQN ומשפחתו, actor-critic, TRPO/PPO, SAC, GAE, RL מבוסס-מודל (Dreamer, MuZero), מתודולוגיית ניסוי (זרעים, רווחי סמך) | אחרי M18.7 | M18.7, M17.4 | Achiam, *Spinning Up in Deep RL* (OpenAI 2018, חינם); Murphy, *Reinforcement Learning: A Comprehensive Overview* (arXiv 2412.05265, גרסת 2025), פרקים על value-based, policy-based ו-model-based | ~200 | must |
| G30 | **Geometric computer vision and SLAM** | מודל מצלמה וכיול, הומוגרפיה וגאומטריה אפיפולרית, SfM ו-bundle adjustment, זרימה אופטית, Lie groups לפוזה, VIO ו-SLAM, factor graphs | אחרי M19.10 | M19.2, M5.14, G3 | Szeliski, *Computer Vision: Algorithms and Applications*, מהדורה 2 (2022, חינם), פרקים 2, 7–9, 11, 13; Barfoot, *State Estimation for Robotics*, מהדורה 2 (CUP 2024, חינם מהמחבר), פרקים 7–10; Solà et al., "A micro Lie theory for state estimation in robotics" (arXiv 1812.01537) | ~400 | must |
| G31 | **ML systems: data, evaluation and operations** | צינורות נתונים ותיוג, feature/data drift, ניטור בייצור, ניסויים וגרסאות, תכן הערכה ו-A/B, חוב טכני | אחרי M17.16 | M17.16, G1 | Huyen, *Designing Machine Learning Systems* (O'Reilly 2022), פרקים 2–9 | ~250 | should |

**למה:**
- G29: M18.7 הוא 18 עמודים מ-Sutton & Barto, תאוריית policy gradient בלי PPO, SAC או DQN. PPO מופיע רק כפריט. היעד מבקש "מריץ PPO ובסיס מבוסס-מודל". בגשר ה-AI המוצע, RLHF ו-GRPO הם וריאציות של PPO, ולכן G29 גם דרישה שלו.
- G30: Thrun ו-Szeliski תוכננו ולא נכנסו. מצלמה, epipolar, VIO ו-SLAM הם היום פריטים של המורה ב-M19.10 בלי עמוד מקור. היעד ברובוטיקה הוא VIO/SLAM וכיול מצלמה-IMU. מודול הראייה החדיש בגשר המוצע (3D Gaussian splatting, world models) בנוי על הגאומטריה הזו.

### 1.9 הנדסה ימית (תחום יעד שאין לו היום אף מודול)

ב-round 3 הנדסה ימית הייתה ברשימת הדילוג (`docs/research/round3/bok/B_mil.md`). בלנצ'סטר יש רק P10: חמישה מודולים קצרים של 10–18 עמודים מ-*Principles of Naval Weapons Systems*. בגילואה אין כלום. הלומד הגדיר את התחום כיעד אמיתי, ולכן אני מציע חלק חדש, **P16b גשר: הנדסה ימית**, אחרי P16. החלק בא אחרי זורמים, מבנים ותרמו, ו-N6 בא אחרי P7.

| # | מודול מוצע | תוכן | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|
| N1 | **Ship hydrostatics and stability** | תפוסה, מרכזי ציפה וכובד, גובה מטצנטרי, עקומת GZ, יציבות בזוויות גדולות, יציבות בפגיעה וחדירת מים, מקדמי צורה | M2.6, M1.2, M15.19 | Tupper, *Introduction to Naval Architecture*, מהדורה 5 (2013), פרקים 1–5, 7; חלופה חינם: USNA EN200 course notes | ~170 | must |
| N2 | **Ship resistance, propulsion and propellers** | Froude ושינוי קנה מידה, גרר חיכוך וגלים, תורת המדחף (momentum ו-blade element), קביטציה, התאמת מדחף-גוף-מנוע | N1, M15.20, M15.26, M14.6 | Molland, Turnock & Hudson, *Ship Resistance and Propulsion*, מהדורה 2 (CUP 2017), פרקים 3–4, 7, 12, 15–16; Newman, *Marine Hydrodynamics*, מהדורת 40 שנה (MIT Press 2018, גישה פתוחה), פרקים 2–3 | ~250 | must |
| N3 | **Seakeeping and manoeuvring** | גלי ים וספקטרום (Pierson-Moskowitz, JONSWAP), RAO ותגובה אקראית, תנועות ספינה, נגזרות תמרון ויציבות כיוונית | N2, M3.6, M7.2, M15.28 | Newman, פרק 6; Faltinsen, *Sea Loads on Ships and Offshore Structures* (CUP 1990), פרקים 1–3; Tupper, פרקים 12–13 | ~200 | must |
| N4 | **Ship structures and marine engineering** | קורת הגוף בגל (hogging/sagging), לוחות מחוזקים, עייפות בים; מערכות הנעה (דיזל, טורבינת גז, CODAG), הספינה החשמלית המשולבת | N1, M16.6, M16.19, M13.10, M12.8, G22 | Hughes & Paik, *Ship Structural Analysis and Design* (SNAME 2010), פרקים 1–3, 8 (נבחר); Woud & Stapersma, *Design of Propulsion and Electric Power Generation Systems* (IMarEST 2002), פרקים נבחרים | ~220 | should |
| N5 | **Submarines and underwater vehicles** | גוף לחץ וקריסה, ציפה ואיזון, הידרודינמיקה של גוף תת-ימי, יציבות בעומק, הנעה, חתימות (אקוסטית, מגנטית, שובל), UUV | N2, M16.7, M15.28 | Burcher & Rydill, *Concepts in Submarine Design* (CUP 1994), פרקים 1–9 (נבחר); Renilson, *Submarine Hydrodynamics*, מהדורה 2 (Springer 2018), פרקים 1–5 | ~300 | must |
| N6 | **Underwater acoustics and sonar engineering** | התפשטות (מהירות קול, ערוצים, ray ו-normal modes), אובדן ובליעה, רעש סביבה ורעש עצמי, הד, משוואת הסונר בעומק, מערכים נגררים ו-beamforming, עיבוד פסיבי (LOFAR, DEMON) ואקטיבי | M9.1, M7.4, M4.15, G9, לנצ'סטר M10.2 | Lurton, *An Introduction to Underwater Acoustics*, מהדורה 2 (Springer-Praxis 2010), פרקים 2–5, 7–8; Abraham, *Underwater Acoustic Signal Processing* (Springer 2019), פרקים 2, 7–9 | ~380 | must |

### 1.10 זורמים, מבנים, הנדסת מערכות ושיפוט

| # | מודול מוצע | תוכן | מיקום | דרישות | מקור | עמ' | חשיבות |
|---|---|---|---|---|---|---|---|
| G32 | **Model-based systems engineering (SysML v2)** | מודל כמקור אמת, מבנה, התנהגות, דרישות ו-traceability ב-SysML v2 (טקסטואלי וגרפי), trade studies, architecture frameworks | אחרי M27.4 | M27.2 | OMG, *Intro to the SysML v2 Language – Textual Notation* (חינם, ב-GitHub Systems-Modeling/SysML-v2-Release); Friedenthal, Moore & Steiner, *A Practical Guide to SysML*, מהדורה 3 (2014), פרקים 1–3 ו-16–17; INCOSE *SE Handbook*, מהדורה 5 (2023), §2.3 ו-§3 (נבחר) | ~280 | must |
| G33 | **Propellers and rotors** | תורת momentum ו-blade element, figure of merit, autorotation, ביצועי multirotor, מדחפים לרחפן | אחרי M15.13 | M15.21, M15.13 | Leishman, *Principles of Helicopter Aerodynamics*, מהדורה 2 (CUP 2006), פרקים 2–3, 7 (נבחר) | ~130 | should |
| G34 | **CFD in practice** | finite volume לזרימה, צימוד לחץ-מהירות (SIMPLE), מודלי טורבולנציה (k-ε, k-ω SST), רשתות, אימות ו-validation | אחרי M15.26 | M15.26, M14.13, M10.10 | Ferziger, Perić & Street, *Computational Methods for Fluid Dynamics*, מהדורה 4 (2020), פרקים 1–5, 7–8, 10 | ~230 | should |
| G35 | **Reliability engineering** | התפלגויות כשל, Weibull analysis של נתונים, RBD, FMECA, physics of failure, בדיקות חיים מואצות, reliability growth | אחרי M27.8 | M6.5, M27.8 | O'Connor & Kleyner, *Practical Reliability Engineering*, מהדורה 5 (2012), פרקים 2–3, 6–9, 14 | ~200 | should |
| G36 | **Estimation and insight** | ניתוח ממדים, הפשטה, קירובים, סימטריה, "lumping", כסדנה לשיפוט מספרי | אחרי M0.1, וחלק שני לצד M14.4 | M0.1 | Mahajan, *The Art of Insight in Science and Engineering* (MIT Press 2014, CC BY-NC-SA), פרקים 1–6; *Street-Fighting Mathematics* (2010, חינם), פרקים 1–4 | ~200 | should |

**למה G32 חובה:** היעד בהנדסת מערכות: "מוביל מחזור חיים עם MBSE (SysML v2)", ו-SysML v2 מופיע גם בתוכנית היעד. היום זה פריט אחד ב-M27.2.
**מה בדקתי ולא דיווחתי כפער:** אי-ודאות מדידה (פריט GUM ב-M6.4, מסומן K), תכנון ניסויים (פריט ב-M6.6), תקני בטיחות (MIL-STD-882 ו-DO-178C כפריטים ב-M27.4), אומדן ספקטרלי (M4.15 ו-M7.17), סוללות (M13.25 Plett), רשתות (M23.11–M23.16), ניווט GNSS/INS (לנצ'סטר M5.8 ו-M5.12), אנטנות ואלומה מסתגלת (לנצ'סטר M1.1–M1.2, M2.30, Orfanidis). אלה מכוסים ברמה שהיעד דורש.

---

## 2. טעויות סדר ודרישות קדם

המיספור לפי סדר הקובץ (P0, P1, ... P27). בדקתי בסקריפט כל דרישה שמופיעה אחרי המודול, וכל מודול ליבה שתלוי במודול מתקדם או עיון. אחר כך בדקתי לפי התוכן מה חסר ברשימת הדרישות.

### 2.1 דרישות שבאות אחרי המודול (נמצאו בבדיקה האוטומטית, ועוד כאלה לפי תוכן)

| מודול | מה הוא צריך | איפה זה נלמד | תיקון |
|---|---|---|---|
| M5.6 Kalman filtering (P5) | וקטור אקראי גאוסי, שונות משותפת, MMSE | P6 (M6.2) ו-M7.3, אחרי P5 | להעביר את P6 (לפחות M6.1–M6.3) לפני P4. את M5.6 עצמו (חלק הקלמן) להעביר אחרי M7.3, או להשאיר צופה דטרמיניסטי ב-P5 ולהעביר את הקלמן למודול שאחרי M7.3. להוסיף M7.3 לדרישות |
| M5.14 EKF/UKF/particle (P5) | M7.12 (מונטה קרלו), M6.7 (בייס) | P7 | להעביר את M5.14 לאחר M7.12, יחד עם G14 |
| M4.15 DFT analysis, periodogram (P4) | M7.2 (PSD) | P7 | להעביר את P6 לפני P4 (תיקון 2.4), ואז את M7.1–M7.2 מיד אחרי M4.7. או להעביר את M4.15 ל-P7, צמוד ל-M7.17 (שניהם אומדן ספקטרלי) |
| M3.6 Random vibration (P3) | M7.2 (PSD), M6.2 | P7 | להעביר את M3.6 לאחר M7.2 |
| M3.5 Continuous systems (P3) | M10.1 (PDE) | P10 | להעביר את M3.5 לאחר M9.1 ו-M4.4, ולהוריד את M10.1 ממודול קדם הכרחי לרשות. Rao פרק 8 מפריד משתנים בעצמו |
| M3.4 MDOF and modal analysis | M8.8 (בעיות ערכים עצמיים) | P8 | נפתר בפיצול P8 שהלומד הציע, **רק אם הפיצול כולל את M8.6–M8.8** (ראו 2.4) |
| M7.17 Parametric spectral estimation | M8.8 | P8 | כנ"ל |
| M14.6 boundary layers, M14.7 forced convection, M14.13 turbulence (P14) | משוואות הרציפות והתנע, צמיגות, נאוויה-סטוקס (M15.1, M15.19, M15.26) | P15, אחרי P14 | להעביר את M15.1, M15.19 ו-M15.26 לפני M14.6, או את M14.6 והלאה אחרי M15.26. להוסיף את M15.19 לדרישות של M14.6, ואת M15.26 לדרישות של M14.13 |
| M10.4–M10.11 (Langtangen) | קריאת קוד Python | אין מודול | G1 לפני P10, ולהוסיף G1 לדרישות של M10.4 ו-M10.10 |
| M11.8 Digital electronics (P11) | לוגיקה בוליאנית (M22.3, M20.1) | P20, P22 | נפתר בהקדמת P20–P22. להוסיף את M22.3 לדרישות |
| M2.7, M5.3, M5.4, M5.5, M6.8, M7.3 | מטריצות, ערכים עצמיים, ריבועים פחותים (M8.2, M8.5, M8.8) | P8 | נפתר בפיצול, אבל צריך להוסיף את הדרישות במפורש: M2.7←M8.8 (צירים ראשיים), M5.3–M5.5←M8.2 ו-M8.8, M6.8←M8.5, M7.3←M8.5 |
| M11.20 RF transistor amplifiers | קווי תמסורת, S-parameters, Smith chart | לנצ'סטר M1.5 בלבד (ב-ENG רק M11.11, ref) | להוסיף תלות בין-מעבדתית: לנצ'סטר M1.5 לפני M11.20. אחרת שיעור ההפרש של Pozar בגילואה נשען על חומר שעוד לא נלמד |

### 2.2 דרישות חסרות או שגויות (התוכן צריך משהו שלא ברשימה)

| מודול | מה הוא צריך | איפה זה נלמד | תיקון |
|---|---|---|---|
| M13.19 Power systems | שנאים ו-per-unit (M11.18), מודל קו ABCD (M11.19), מכונה סינכרונית ומשוואת swing (M12.8), Newton-Raphson וליניארית דלילה (M8.7) | P11, P12, P8 | להחליף את M12.1 (מגנטיות החומר, [adv]) ב-M11.18, M11.19 ו-M12.8. M13.23 (יציבות מעברית) ← M12.8 |
| M25.1 Electrons and holes | התפלגות Fermi-Dirac, צפיפות מצבים | M13.20 (Schroeder) | להוסיף את M13.20 |
| M24.8 Semiconductors | מערכות שני מצבים ומטריצות פאולי (Feynman III 10–11) | M24.7, [adv] | לפי החלטת 6.11 ב-SYNTHESIS ("בסיס, M24.8 נשען עליו"): להפוך את M24.7 (או את הפרקים 10–11 שבו) לליבה ולהוסיף אותו לדרישות של M24.8 |
| M22.11 Embedded systems | מכונות מצבים | M20.3, [adv] | לפי החלטת 6.11 (M20.3 "בסיס לספרתי, embedded ופרוטוקולים"): להפוך את M20.3 לליבה ולהוסיף אותו לדרישות של M22.3, M22.11 ו-M23.12 (מכונת המצבים של TCP) |
| M10.10 FEM | שיטת Ritz וחשבון וריאציות | M8.13 | להוסיף את M8.13 |
| M5.12 Bode's integral | אינטגרל קווי ומשפט קושי | M4.11, [adv] | להוסיף את M4.11. בגזירת השלד ברמה 2.5 צריך קונטור |
| M19.10 (פריטי מצלמה, VIO, SLAM) | EKF, גאומטריית מצלמה | M5.14, ואין מודול מקור | G30, ולהוסיף את M5.14 |
| M15.28 Flight dynamics | פונקציות תמסורת, מודים עצמיים | M5.7, M8.8 | להוסיף |
| M19.8 Robot control | ליאפונוב (computed torque) | M5.3 | להוסיף |

### 2.3 מודולי ליבה שתלויים במודול מתקדם או עיון

| מודול [cor] | תלוי ב- | תיקון |
|---|---|---|
| M13.19 | M12.1 [adv] | ראו 2.2 (הדרישה הזו שגויה) |
| M15.8 Airfoils | M15.7 [ref] viscous flow | להחליף ב-M15.26 ו-M14.6 (ליבה) |
| M16.24 Composites | M16.15 [adv] hybrid materials | להחליף ב-M16.1 (טנזורים, הוק לא איזוטרופי) ו-M16.10. Jones לא צריך את Ashby ההיברידי |
| M17.11 Diffusion models | M17.10 [adv] VAE ← M7.14 [adv] | ELBO הוא תנאי הכרחי: להפוך את חלק ה-VAE ב-M17.10 (Prince 17) לליבה |
| M21.3 Sorting, divide and conquer | M20.10 [adv] recurrences | להפוך את M20.10 לליבה, או להוריד את הדרישה. Skiena 5 מלמד את משפט המאסטר |
| M22.6 The processor | M22.5 [adv] ← M22.4 [adv] | הלומד השאיר את בחירה 5 ("צריך כדי להכיר שבבים"). להתאים את התיוג: M22.4 ו-M22.5 לליבה |
| M24.11 Hydrogen atom | M24.9 [adv] | להפוך את M24.9 לליבה, או להוריד את הדרישה |

### 2.4 חידוד ההצעות של הלומד בעניין הסדר

1. **פיצול P8:** M8.1–M8.5 לא מספיק. M3.4, M5.3–M5.5, M2.7, M7.17, M19.2 ו-M24.6 צריכים את M8.8 (ערכים עצמיים), ו-M8.8 דורש את M8.6–M8.7. ההמלצה: להקדים את **M8.1–M8.8**. את M8.9–M8.23 (SVD נומרי, איטרטיביות, אופטימיזציה) להשאיר במקומם.
2. **סדר מוצע לחלקים הראשונים:** P0 ← G1 ← P1 ← M8.1–M8.8 ← P6 ← P2 ← P3 (בלי M3.5 ו-M3.6) ← P4 (עם M7.1–M7.2 אחרי M4.7) ← שאר P7 ← P5 (עם M5.6 ו-M5.14 אחרי M7.3 ו-M7.12) ← P8 (אופטימיזציה) ← בלוק בקרה מתקדמת (G10–G16) ← P9...
3. **גשר המחשוב (אחרי P22):** STA ו-timing closure צריכים את M25.7–M25.8 (השהיה, interconnect) מ-P25. צריך למקם אותו אחרי M25.8, או לפחות להכניס את M25.8 לדרישות של מודול ה-RTL. מודול האבטחה בגשר צריך את G27. מודול ה-RTOS צריך את G26.
4. **גשר ה-AI (אחרי P17–P18):** ההסקה וה-scaling צריכים את מודול המאיצים מגשר המחשוב (HBM, roofline, NVLink), ולכן גשר ה-AI בא אחרי גשר המחשוב. post-training צריך את G29. הראייה החדישה צריכה את G30. הסוכנים והבקרה בלולאה סגורה צריכים את G12 (MPC).
5. **P27 (הנדסת מערכות):** אין טעות דרישות, אבל היעד שם אותו בגל 1 ו-M27.1 בלי דרישות. אפשר להריץ אותו במקביל מוקדם, לא בסוף.

---

## 3. מקורות למודולים שהלומד הציע

### 3.1 גשר: תכן ספרתי ומחשוב (אחרי P22, בפועל אחרי M25.8)

| מודול | מקורות | עמ' |
|---|---|---|
| RTL/FPGA, SystemVerilog, STA | Harris & Harris, *Digital Design and Computer Architecture: RISC-V Edition* (2021), פרקים 2–5; Sutherland, *RTL Modeling with SystemVerilog for Simulation and Synthesis* (2017), פרקים 1–9 (נבחר); Bhasker & Chadha, *Static Timing Analysis for Nanometer Designs* (2009), פרקים 1–3, 7–8; AMD UG949 *UltraFast Design Methodology Guide* (חינם, נבחר). לעיון באימות: Spear & Tumbush, *SystemVerilog for Verification*, מהדורה 3 (2012), פרקים 1–6 | ~550 |
| Micro-architecture: OoO, MESI/MOESI | Hennessy & Patterson, *Computer Architecture: A Quantitative Approach*, מהדורה 6 (2017), פרקים 2, 3, 5; Nagarajan, Sorin, Hill & Wood, *A Primer on Memory Consistency and Cache Coherence*, מהדורה 2 (2020, חינם), פרקים 1–3, 6–8 | ~420 |
| Accelerators: GPU/CUDA, HBM, roofline | Hwu, Kirk & El Hajj, *Programming Massively Parallel Processors*, מהדורה 4 (2022), פרקים 1–6, 10, 16; H&P מהדורה 6, פרקים 4 ו-7 (GPU, TPU, DSA); Williams, Waterman & Patterson, "Roofline", CACM 2009; Sze, Chen, Yang & Emer, *Efficient Processing of Deep Neural Networks* (2020), פרקים 1–6 | ~550 |
| High-speed interconnects: PCIe, NVLink, CXL, SerDes | Dally & Towles, *Principles and Practices of Interconnection Networks* (2004), פרקים 1–3, 14; Hall & Heck, *Advanced Signal Integrity for High-Speed Digital Designs* (2009), פרקים 9–12 (equalization, CDR); Das Sharma et al., "An Introduction to the Compute Express Link (CXL) Interconnect", ACM Computing Surveys 2024 (arXiv 2306.11227); NVIDIA Hopper/Blackwell architecture whitepapers (NVLink, NVSwitch). דרישה: G23 | ~320 |
| Real-time: RTOS, PTP | Buttazzo, *Hard Real-Time Computing Systems*, מהדורה 4 (Springer 2024), פרקים 1–7; Barry, *Mastering the FreeRTOS Real Time Kernel* (חינם, נבחר); Eidson, *Measurement, Control, and Communication Using IEEE 1588* (Springer 2006), פרקים 1–4; Riley, NIST SP 1065 (**כבר בספרייה של לנצ'סטר**) ליציבות שעון. דרישה: G26 | ~420 |
| Hardware/firmware security | Bhunia & Tehranipoor, *Hardware Security: A Hands-on Learning Approach* (2018), פרקים 1, 5–11 (נבחר); Anderson, *Security Engineering*, מהדורה 3, פרקים 18–19 (tamper, side channels); Mangard, Oswald & Popp, *Power Analysis Attacks* (2007), פרקים 1–4; NIST SP 800-193 *Platform Firmware Resiliency* (חינם); Kocher et al., "Spectre Attacks" (2019). דרישה: G27 | ~450 |

### 3.2 גשר: AI חדיש (אחרי P17–P18, ובפועל אחרי גשר המחשוב)

| מודול | מקורות | עמ' |
|---|---|---|
| Foundation-model architecture: LLM/VLM, FlashAttention, RoPE, MoE | Raschka, *Build a Large Language Model (From Scratch)* (Manning 2024), פרקים 2–5; Jurafsky & Martin, *Speech and Language Processing*, מהדורה 3 (טיוטה, 2025, חינם), פרקים על LLM ו-transformers; מאמרים: Su et al., RoFormer (2021); Dao et al., FlashAttention 1–3 (2022–2024); Fedus et al., Switch Transformers (2022); DeepSeek-V3 Technical Report (2024; MLA ו-MoE); Llama 3 "Herd of Models" (2024), פרקי הארכיטקטורה; Radford et al., CLIP (2021); Liu et al., LLaVA (2023) | ~400 |
| Scaling laws and distributed training: TP/PP/EP, NCCL | Kaplan et al. (2020); Hoffmann et al., Chinchilla (2022); Austin et al., *How to Scale Your Model* (Google DeepMind 2025, ספר חינם ברשת); Hugging Face, *The Ultra-Scale Playbook* (2025, חינם); Shoeybi et al. ו-Narayanan et al., Megatron-LM (2019, 2021); Rajbhandari et al., ZeRO (2020) | ~350 |
| Post-training: SFT, RLHF, DPO, GRPO, test-time compute | Lambert, *Reinforcement Learning from Human Feedback* (rlhfbook.com, 2025, חינם); Ouyang et al., InstructGPT (2022); Rafailov et al., DPO (2023); Shao et al., DeepSeekMath/GRPO (2024); DeepSeek-R1 (2025); Snell et al., "Scaling LLM Test-Time Compute Optimally" (2024). דרישה: G29 | ~280 |
| Inference optimization: KV-cache, FP8/INT4, speculative decoding | Pope et al., "Efficiently Scaling Transformer Inference" (2022); Kwon et al., vLLM/PagedAttention (2023); Leviathan et al., speculative decoding (2023); Micikevicius et al., "FP8 Formats for Deep Learning" (2022); Frantar et al., GPTQ (2022); Lin et al., AWQ (2024); Xiao et al., SmoothQuant (2023); *How to Scale Your Model*, פרקי ההסקה | ~220 |
| Modern vision: DETR, SAM, world models, 3D Gaussian splatting | Szeliski מהדורה 2, פרקים 5–6 (משותף עם G30); Carion et al., DETR (2020); Oquab et al., DINOv2 (2023); Kirillov et al., SAM (2023), Ravi et al., SAM 2 (2024); Mildenhall et al., NeRF (2020); Kerbl et al., 3D Gaussian Splatting (2023); Ha & Schmidhuber, World Models (2018); Hafner et al., DreamerV3 (2023/2025). דרישה: G30 | ~280 |
| Agent systems and closed-loop control | Yao et al., ReAct (2022); Schick et al., Toolformer (2023); Anthropic, "Building Effective Agents" (2024); Jimenez et al., SWE-bench (2023); METR, "Measuring AI Ability to Complete Long Tasks" (2025); Brohan et al., RT-2 (2023); Kim et al., OpenVLA (2024); Black et al., π0 (2024). הקשר לבקרה: G12. דרישה: G12, G29 | ~200 |
| Edge AI and robustness under SWaP | Sze et al. 2020 (משותף); Jacob et al., "Quantization and Training of NNs for Efficient Integer-Arithmetic-Only Inference" (2018); Han et al., Deep Compression (2016); Reddi et al., MLPerf Inference (2020); Banbury et al., MLPerf Tiny (2021); NVIDIA TensorRT ו-Jetson developer guides (נבחר); Madry et al., adversarial training (2018); Hendrycks & Dietterich, corruption robustness (2019) | ~220 |

---

## 4. סיכום כמותי (הערכה)

- **must:** G1, G3, G6–G14, G17, G19, G22, G23, G26, G27, G29, G30, G32, N1–N3, N5, N6. בסך הכל כ-6,350 עמודים (אם ב-G9 נלקח Hero; עם Kay כ-6,600).
- **should:** G2, G4, G5, G15, G16, G18, G20, G21, G24, G25, G28, G31, G33–G36, N4. כ-3,200 עמודים.
- **הגשרים שהלומד הציע:** כ-2,700 עמודים בגשר המחשוב וכ-1,950 בגשר ה-AI.
- **בקצב של כ-10 דקות לעמוד ו-154 שעות אפקטיביות בחודש** (ההנחה של SYNTHESIS): ה-must מוסיף כ-7 חודשים, ה-should כ-3.5 חודשים, והגשרים כ-5 חודשים.
- **ספרים שכבר בספרייה ומכסים חלק:** E30 (G7), Hero B22 (G9), E34 (G27), Riley (RTOS/PTP). מקורות חינם: G1, G5, G10, G12, G19, G26, G29, G30, G32 (SysML v2), G36, N2 (Newman), וחלק גדול ממקורות ה-AI.
