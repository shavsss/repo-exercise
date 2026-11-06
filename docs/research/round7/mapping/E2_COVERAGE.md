# כיסוי יעדי E2: מה להחזיק בראש ומה לאמת (6.11)

לכל תחום ב-`docs/research/round5/expert/E2_domain_targets.json`, כל פריט של `hold_in_head_he` (H) ושל `must_verify_he` (V), ואיפה הוא נלמד. **נלמד**: מודול ומקור, או פריט קיים ב-`curriculum.json` (מזהה הפריט). **נוסף פריט**: פריט נושא חדש `E2:…` ב-`tools/curriculum/e2_items.json`, שנכנס ל-`curriculum.json` דרך `build_curriculum.py`. **ממתין למודול חדש**: המקום הטבעי הוא מודול שמתוכנן ב-`round7/mapping` ועוד לא קיים; הפריט נשמר ברשימת `pending` ומחכה למשלב.

| מעבדה | פריטים | נלמד | נוסף פריט | ממתין |
|---|---|---|---|---|
| eng | 159 | 119 | 38 | 2 |
| mil | 148 | 116 | 32 | 0 |

## גילואה (ENG)

### ENG · Mathematics foundations

| | פריט | מצב | איפה |
|---|---|---|---|
| H | פירוק עצמי ו-SVD | נלמד | M8.4 (Trefethen & Bau 4–5), M8.8–M8.9 |
| H | התניה | נלמד | M8.6 (Trefethen & Bau 12, 18) |
| H | ריבועים פחותים כהטלה | נלמד | M8.5 (Trefethen & Bau 6, 11) |
| H | דואליות וקמירות | נלמד | M8.16–M8.18 (Boyd & Vandenberghe 2–5) |
| H | חוק המספרים הגדולים | נלמד | M6.1 (Kolmogorov XI), M6.3 (Wasserman 5) |
| H | CLT | נלמד | M6.3 (Wasserman 5) |
| H | זנבות כבדים | נלמד | M6.3 · E:Mathematics \|6.10 |
| H | יציבות שיטות נומריות | נלמד | M8.6 (Trefethen & Bau 14–17), M10.4 · E:Mathematics \|9.5 |
| H | כ-30 תוצאות עוגן שהוא משחזר על נייר בדקות | נוסף פריט | M0.1 · `E2:ENG.MATH.H9` |
| V | כל תוצאה בשתי דרכים: אנליטית מול נומרית, או שני סוכנים בלתי תלויים | נוסף פריט | M6.11 · `E2:ENG.MATH.V1` |
| V | בדיקת ממדים ומקרי קצה | נלמד | M10.1 · E:Mathematics \|4.8, M27.5 · E:Engineering \|0.5 |
| V | השוואה למקרה סגור ידוע | נלמד | M10.9 (Langtangen & Linge C: verification against exact solutions) |
| V | נימוק קצר במילים שלו למה זה נכון | נלמד | M20.1 (Lehman 1: what a proof is) |

### ENG · Physics

| | פריט | מצב | איפה |
|---|---|---|---|
| H | משוואות מקסוול בשתי הצורות | נלמד | M9.2–M9.3, M9.9 (Feynman II 1–3, 18) |
| H | משוואת הגלים | נלמד | M9.1 (Feynman I 47), M9.9 (Feynman II 20) |
| H | עכבה | נוסף פריט | M9.9 · `E2:ENG.PHYS.H3` |
| H | גבול עקיפה λ/D | נלמד | M9.13 (Feynman I 30) |
| H | פרנל והחזרה | נלמד | M9.9 ◇ / M9.14 (Feynman II 33) |
| H | קרינת גוף שחור | נלמד | M13.2 (Feynman I 41), M14.10 (Lienhard 10) |
| H | kT ורעש תרמי | נלמד | M13.2 (Feynman I 41: Johnson-Nyquist noise), M11.7 (Horowitz & Hill 7) |
| H | רעש שוט | נלמד | M11.7 (Horowitz & Hill 7) |
| H | ניתוח ממדים | נלמד | M14.4 (Lienhard 4), M10.1 · E:Mathematics \|4.8 |
| H | חוקי שימור | נלמד | M2.1, M2.3 (Feynman I 4, 10), M24.10 |
| V | מקרי גבול | נוסף פריט | M3.2 · `E2:ENG.PHYS.V1` |
| V | שימור אנרגיה בסימולציה | נלמד | M10.4 (Langtangen & Linge 1: energy considerations of vibration schemes) |
| V | מבחן התכנסות רשת | נלמד | M10.4, M10.8 (Langtangen & Linge: convergence rates, truncation error), M10.10 |
| V | מדידה מול מודל | נוסף פריט | M11.13 · `E2:ENG.PHYS.V4` |

### ENG · Signals and systems

| | פריט | מצב | איפה |
|---|---|---|---|
| H | משפט הדגימה ו-aliasing | נלמד | M4.8 (Oppenheim & Willsky 7) |
| H | רזולוציית DFT מול חלון | נלמד | M4.6 · E:Signals and \|1.5 |
| H | רווח עיבוד 10log(N) | נוסף פריט | M7.4 · `E2:ENG.SIG.H3` |
| H | מסנן מותאם | נלמד | M7.4 (Oppenheim & Verghese 14) |
| H | Wiener והלבנה | נלמד | M7.3 (Oppenheim & Verghese 11) |
| H | ROC | נלמד | M7.4 (Oppenheim & Verghese 13–14) |
| H | CFAR | נוסף פריט | M7.4 · `E2:ENG.SIG.H7` |
| H | יציבות במישור z | נלמד | M4.10 (Oppenheim & Willsky 10) |
| H | רעש קוונטיזציה 6.02N+1.76 dB | נלמד | M4.8 · E:Signals and \|3.1 |
| V | חבילת וקטורי בדיקה זהובים (טון ידוע + רעש: SNR יוצא = SNR נכנס + רווח) | נוסף פריט | M4.6 · `E2:ENG.SIG.V1` |
| V | Parseval | נלמד | M4.5–M4.6 (Oppenheim & Willsky 4–5) |
| V | השוואה ל-GNU Radio או MATLAB | נוסף פריט | M4.10 · `E2:ENG.SIG.V3` |
| V | הקלטות אמת | נוסף פריט | M4.8 · `E2:ENG.SIG.V4` |

### ENG · Control and estimation

| | פריט | מצב | איפה |
|---|---|---|---|
| H | מרחב מצב | נלמד | M5.4 (Åström & Murray 6) |
| H | צפיות ובקרות | נלמד | M5.5–M5.6 (Åström & Murray 7–8) |
| H | משוואות קלמן ומשמעותן | נלמד | M5.6 (Åström & Murray 8), M5.6 · E:Control and \|4.2 |
| H | Riccati | נלמד | M5.5 (Åström & Murray 7: LQR), M5.6 |
| H | מרווחי הגבר ופאזה | נלמד | M5.8 (Åström & Murray 10) |
| H | גבול השהיה | נלמד | M5.12 · P2_:Time delay in loops |
| H | אינטגרל Bode | נלמד | M5.12 (Åström & Murray 14) |
| H | רעיון IMM | ממתין למודול חדש | מודול השערוך החדש (Bar-Shalom, Li & Kirubarajan; Simon) (אחרי M5.6) · `E2:ENG.CTRL.H8` |
| H | שיוך נתונים | ממתין למודול חדש | מודול השערוך החדש (Bar-Shalom, Li & Kirubarajan; Simon) (אחרי M5.6) · `E2:ENG.CTRL.H9` |
| V | NEES/NIS מול χ² | נלמד | M5.6 · E:Control and \|4.4 |
| V | מונטה קרלו מול אמת | נוסף פריט | M5.6 · `E2:ENG.CTRL.V2` |
| V | יעקוביאן סימבולי מול הפרש סופי | נוסף פריט | M5.6 · `E2:ENG.CTRL.V3` |
| V | תגובת מדרגה ותדר בחומרה | נלמד | M5.2 · E:Control and \|0.3 |

### ENG · Information theory and communications

| | פריט | מצב | איפה |
|---|---|---|---|
| H | שאנון | נלמד | M7.7 (MacKay 9–10), M23.3 ◇ Tse 5.1–5.2 |
| H | Eb/N0 | נלמד | M23.8 (Tse & Viswanath 5: power-limited regime) |
| H | רווח קידוד | נוסף פריט | M23.4 · `E2:ENG.COMM.H3` |
| H | סדר פיזור | נלמד | M23.6 (Tse & Viswanath 3) |
| H | OFDM (CP, תת-נושאים) | נלמד | M23.6 (Tse & Viswanath 3.4.4) |
| H | סנכרון | נוסף פריט | M23.2 · `E2:ENG.COMM.H6` |
| H | סטטיסטיקת דעיכה | נלמד | M23.5 (Tse & Viswanath 2) |
| H | near-far | נלמד | M23.7 (Tse & Viswanath 4: CDMA power control) |
| H | רווח עיבוד בפיזור ספקטרום | נלמד | M23.7 (Tse & Viswanath 4.3) |
| V | BER מול תאוריה ב-AWGN וריילי | נוסף פריט | M23.6 · `E2:ENG.COMM.V1` |
| V | לולאת כבל ב-SDR | נוסף פריט | M23.2 · `E2:ENG.COMM.V2` |
| V | השוואה בין כלים | נלמד | E2:ENG.SIG.V3 (M4.10, the same cross-tool method) |

### ENG · Electronics and circuits

| | פריט | מצב | איפה |
|---|---|---|---|
| H | אוהם | נלמד | M11.1 |
| H | KCL/KVL | נלמד | M11.1 · E:Electronics \|0.0 |
| H | עכבה והתאמה | נלמד | M11.11 · E:Electronics \|0.6 |
| H | יציבות מגבר ו-GBW | נלמד | M11.4 (Horowitz & Hill 4) |
| H | noise figure | נלמד | M11.7 (Horowitz & Hill 7) |
| H | Friis | נוסף פריט | M11.7 · `E2:ENG.ELEC.H6` |
| H | לולאות הארקה | נלמד | M11.7 (Horowitz & Hill 7: grounding and shielding) |
| H | ניתוק | נלמד | M11.11 · P2_:Power integrity and decoupling, M11.10 (Horowitz & Hill 12) |
| H | הפחתה תרמית | נלמד | M11.6 · P2_:Electronics reliability (derating) |
| H | יסודות S-parameters | נלמד | M11.11 · E:Electronics \|0.5 |
| V | מדידה (סקופ, NanoVNA, מנתח ספקטרום) מול SPICE | נוסף פריט | M11.13 · `E2:ENG.ELEC.V1` |
| V | רשימת בדיקת first-article | נוסף פריט | M11.10 · `E2:ENG.ELEC.V2` |
| V | שתי דרכים לכל מספר קריטי | נלמד | M11.7 · E:Electronics \|4.3, E2:ENG.ELEC.V1 |

### ENG · Electric machines and power

| | פריט | מצב | איפה |
|---|---|---|---|
| H | P=VI | נלמד | M11.1 |
| H | הפסדים | נלמד | M12.3 · E:Electric mac\|0.2, M12.6 (Hughes & Drury 5–6) |
| H | שרשרת נצילות | נוסף פריט | M12.10 · `E2:ENG.PWR.H3` |
| H | צפיפות אנרגיה | נלמד | M27.5 · A-J1, M13.17 (MacKay 26) |
| H | עקומת מומנט-מהירות | נלמד | M12.5–M12.6 (Hughes & Drury 3–6) |
| H | per-unit | נלמד | M12.6 · E:Electric mac\|3.0 |
| H | N-1 | נוסף פריט | M13.19 · `E2:ENG.PWR.H7` |
| V | מאזן אנרגיה | נלמד | M13.6 (Çengel & Boles 4–5) |
| V | מקרי IEEE 14-bus | נוסף פריט | M13.19 · `E2:ENG.PWR.V2` |
| V | מדידת דחף וזרם של מנוע רחפן | נוסף פריט | M12.8 · `E2:ENG.PWR.V3` |

### ENG · Thermodynamics and heat transfer

| | פריט | מצב | איפה |
|---|---|---|---|
| H | שלושת המנגנונים | נלמד | M14.1 (Lienhard 1) |
| H | התנגדות תרמית | נלמד | M14.2 (Lienhard 2) |
| H | מספרי Biot ו-Nusselt בסדר גודל | נלמד | M14.5 (Lienhard 5: Biot), M14.7 (Lienhard 7: Nusselt) |
| H | סטפן-בולצמן | נלמד | M14.10 (Lienhard 10) |
| H | נצילות קרנו | נלמד | M13.3 (Feynman I 44), M13.7 (Çengel & Boles 6) |
| V | מאזן אנרגיה | נלמד | M13.6 (Çengel & Boles 4–5) |
| V | מדידה תרמית | נוסף פריט | M14.2 · `E2:ENG.THERM.V2` |

### ENG · Fluids, aerodynamics and propulsion

| | פריט | מצב | איפה |
|---|---|---|---|
| H | עילוי וגרר | נלמד | M15.3, M15.8 (Anderson, Introduction to Flight 2, 5) |
| H | L/D | נלמד | M15.11 (Anderson 6) |
| H | ריינולדס ומאך | נלמד | M15.5, M15.7 (Anderson 4) |
| H | Breguet | נלמד | M15.12 (Anderson 6: range and endurance) |
| H | משוואת הרקטה | נלמד | M15.15–M15.16 (Anderson 8–9) |
| H | חימום אווירודינמי בסדר גודל | נלמד | M15.17 · A-T2 |
| V | השוואה ללוגי טיסה | נוסף פריט | M15.12 · `E2:ENG.FLU.V1` |
| V | מקרים מהספר | נלמד | M15.11–M15.12 (Anderson worked examples) |

### ENG · Structures and materials

| | פריט | מצב | איפה |
|---|---|---|---|
| H | מאמץ ועיבור | נלמד | M16.2, M16.5 (Gere 1, 7) |
| H | קורה ופיתול | נלמד | M16.3–M16.4 (Gere 3–6) |
| H | קריסה | נלמד | M16.7 (Gere 11), M16.7 · E:Structures a\|0.5 |
| H | עייפות (S-N) | נלמד | M16.2 · E:Structures a\|1.2 |
| H | מדדי חומר של Ashby | נלמד | M16.12 (Ashby) |
| V | פתרון קורה אנליטי | נלמד | M16.6 (Gere 9–10) |
| V | מבחן הרס | נלמד | M27.3 · E:Structures a\|4.8 |

### ENG · Machine learning and deep learning

| | פריט | מצב | איפה |
|---|---|---|---|
| H | הטיה-שונות | נלמד | M17.5 (Prince 8) |
| H | הכללה | נלמד | M17.5 · E:Machine lear\|0.2 |
| H | כיול | נלמד | M17.5 · E:Machine lear\|4.0, \|4.1 |
| H | אופני דליפה | נלמד | M17.5 · E:Machine lear\|0.2 |
| H | חשבון קנה מידה ו-compute | נלמד | M17.12 · E:Machine lear\|3.9, M22.8 · E:Machine lear\|4.4 |
| H | הטיה אינדוקטיבית של קונבולוציה ו-attention | נלמד | M17.6–M17.7 (Prince 10, 12), M17.5 · E:Machine lear\|0.6 |
| H | מדדים | נלמד | M17.5 · E:Machine lear\|4.0 |
| V | held-out לפי זמן וחיישן | נוסף פריט | M17.5 · `E2:ENG.ML.V1` |
| V | baselines פשוטים | נוסף פריט | M17.5 · `E2:ENG.ML.V2` |
| V | ablations | נוסף פריט | M17.5 · `E2:ENG.ML.V3` |
| V | ביקורת תוויות | נוסף פריט | M17.12 · `E2:ENG.ML.V4` |

### ENG · Reinforcement learning

| | פריט | מצב | איפה |
|---|---|---|---|
| H | MDP | נלמד | M18.2 (Sutton & Barto 3) |
| H | Bellman | נלמד | M18.2 (Sutton & Barto 3–4) |
| H | policy gradient | נלמד | M18.7 (Sutton & Barto 13) |
| H | exploration | נלמד | M18.1 (Sutton & Barto 2) |
| H | sim-to-real | נלמד | M18.9 · E:Reinforcemen\|1.6 |
| V | זרעים מרובים | נוסף פריט | M18.7 · `E2:ENG.RL.V1` |
| V | baseline של בקרה קלאסית | נלמד | M18.7 · E:Reinforcemen\|1.9 |

### ENG · Robotics

| | פריט | מצב | איפה |
|---|---|---|---|
| H | קינמטיקה | נלמד | M19.3–M19.5 (Lynch & Park 4–6) |
| H | מצלמת חריר | נלמד | M19.10 · E:Robotics\|1.1 |
| H | epipolar | נלמד | M19.10 · E:Robotics\|1.1 |
| H | VIO | נלמד | M19.10 · E:Robotics\|1.4 |
| H | תכנון מסלול | נלמד | M19.7 (Lynch & Park 10) |
| V | אמת קרקעית | נוסף פריט | M19.10 · `E2:ENG.ROB.V1` |
| V | כיול מצלמה-IMU | נוסף פריט | M19.10 · `E2:ENG.ROB.V2` |

### ENG · Systems engineering

| | פריט | מצב | איפה |
|---|---|---|---|
| H | מחזור החיים | נלמד | M27.1 (NASA SE Handbook 3) |
| H | תכונות דרישה טובה | נלמד | M27.2 (NASA appendix C) |
| H | פירוק פונקציונלי | נלמד | M27.2 (NASA 4, appendix F) |
| H | ניהול ממשקים | נלמד | M27.4 (NASA 6.3, appendix L) |
| H | מטריצת אימות | נלמד | M27.3 (NASA appendix D) |
| H | STPA | נלמד | M27.4 · E:Systems engi\|4.7 |
| H | ניהול סיכונים ו-margins | נלמד | M27.4 (NASA 6.4), M27.4 · E:Systems engi\|1.6 |
| V | כל דרישה נעקבת לבדיקה | נלמד | M27.3 (NASA appendix D), M27.4 (NASA 6.2) |
| V | ביקורת עמיתים חיצונית | נלמד | M27.5 (NASA appendix N) |
| V | הערכה לפי SECF | נוסף פריט | M27.1 · `E2:ENG.SE.V3` |

### ENG · Engineering judgment (cross-cutting)

| | פריט | מצב | איפה |
|---|---|---|---|
| H | ספריית סדרי גודל לכל תחום | נלמד | M13.15 · E:Engineering \|0.2, \|0.1, M22.7 · E:Periphery: d\|2.1 |
| H | רשימות כשל טיפוסיות | נלמד | M27.1 · E:Systems engi\|5.12, M27.4 · E:Systems engi\|4.3 |
| H | כללי אצבע ומקורם | נוסף פריט | M13.15 · `E2:ENG.JUDG.H3` |
| V | רשומת תחזיות מתוארכת מול אמת (Brier, יחס שגיאה) | נוסף פריט | M27.5 · `E2:ENG.JUDG.V1` |

### ENG · Periphery: discrete math, algorithms, computer systems, chips

| | פריט | מצב | איפה |
|---|---|---|---|
| H | סיבוכיות | נלמד | M21.1 (Skiena 2) |
| H | מבני נתונים | נלמד | M21.2 (Skiena 3) |
| H | זיכרון ומטמון | נלמד | M22.7 (Patterson & Hennessy 5) |
| H | roofline | נוסף פריט | M22.8 · `E2:ENG.PERI.H4` |
| H | Amdahl | נלמד | M22.8 (Patterson & Hennessy 6) |
| H | זמן אמת ופסיקות | נלמד | M22.10 · E:Electronics \|3.5, M22.10 · E:Robotics\|3.0 |
| H | git | נלמד | M27.3 · E:Periphery: d\|2.7 |
| V | בדיקות אוטומטיות | נלמד | M27.3 · E:Periphery: d\|2.7, M10.9 (Langtangen & Linge C) |
| V | קריאת diff | נוסף פריט | M10.9 · `E2:ENG.PERI.V2` |
| V | profiling | נוסף פריט | M22.7 · `E2:ENG.PERI.V3` |

## לנצ׳סטר (MIL)

### MIL · Foundations: the quantitative toolkit

| | פריט | מצב | איפה |
|---|---|---|---|
| H | אריתמטיקת dB | נלמד | M0.1 (EW 101 2.1–2.3), M0.1 · M:F.1.4 |
| H | משוואות מכ"ם ו-J/S בצורה אחת לפחות | נלמד | M2.2 (PoMR 2), M4.7 (EW 101 9) |
| H | Pd/Pfa | נלמד | M2.10 (PoMR 15) |
| H | CRB | נוסף פריט | M0.6 · `E2:MIL.FND.H4` |
| H | DOP | נלמד | M5.6 (Kaplan 7) |
| H | CEP | נלמד | M11.4, M6.7 |
| H | מערכות קואורדינטות | נלמד | M6.1 (Siouris), M5.1 (Kaplan 2), M0.8 |
| H | MOE/MOP | נלמד | M7.2 · M:F.8.1, M14.1 · M:OR.1.2 |
| V | כל פונקציה מול דוגמה מספרית מהספר (PoMR, EW101, Kaplan) | נוסף פריט | M0.1 · `E2:MIL.FND.V1` |
| V | CI | נוסף פריט | M0.1 · `E2:MIL.FND.V2` |

### MIL · Antennas and propagation

| | פריט | מצב | איפה |
|---|---|---|---|
| H | רווח | נלמד | M1.1 (EW 101 3, PoMR 9) |
| H | צמצם | נלמד | M1.1 (PoMR 9) |
| H | רוחב אלומה | נלמד | M1.1 (EW 101 3) |
| H | פקטור מערך | נלמד | M1.2 (PoMR 9.7) |
| H | אונות סבכה | נלמד | M1.2 (PoMR 9.7, EW 101 3.4) |
| H | צימוד הדדי | נוסף פריט | M1.2 · `E2:MIL.ANT.H6` |
| H | Friis | נלמד | M1.4 (PoMR 2.14, Kaplan appendix C) |
| H | אזורי פרנל | נלמד | M1.3 (PoMR 4) |
| H | כדור 4/3 | נלמד | M1.3 (PoMR 4) |
| H | multipath | נלמד | M1.3 (PoMR 4, NRL Low-Altitude vol. 1) |
| H | סדרי גודל של ניחות גשם וגזים | נלמד | M1.3 (PoMR 4) |
| V | דיפול אנליטי | נוסף פריט | M1.1 · `E2:MIL.ANT.V1` |
| V | patch אנליטי | נוסף פריט | M1.2 · `E2:MIL.ANT.V2` |
| V | התכנסות רשת | נוסף פריט | M1.2 · `E2:MIL.ANT.V3` |
| V | דפוס מדוד | נוסף פריט | M1.1 · `E2:MIL.ANT.V4` |
| V | מדידות שפורסמו | נלמד | M1.3 (NRL Low-Altitude vol. 1: measured propagation over sea) |

### MIL · Radar

| | פריט | מצב | איפה |
|---|---|---|---|
| H | משוואת המכ"ם בכל צורותיה | נלמד | M2.2 (PoMR 2), M2.3 |
| H | פונקציית עמימות | נלמד | M2.12 (PoMR 20) |
| H | רזולוציה | נלמד | M2.1, M2.12, M2.14 |
| H | clutter ו-MTI | נלמד | M2.6, M2.13 |
| H | רעיון STAP | נלמד | M2.16 |
| H | CFAR | נלמד | M2.11 (PoMR 16) |
| H | תורת גילוי | נלמד | M2.10 (PoMR 15) |
| H | מיקרו-דופלר | נלמד | M2.38, M2.37 · M:R.8.1 |
| H | ECCM | נלמד | M4.16 |
| V | כיול במחזיר פינתי | נוסף פריט | M2.4 · `E2:MIL.RAD.V1` |
| V | מטרות ידועות | נוסף פריט | M2.2 · `E2:MIL.RAD.V2` |
| V | סימולציה מול מדידה | נוסף פריט | M2.10 · `E2:MIL.RAD.V3` |
| V | השוואה בין כלים | נוסף פריט | M2.2 · `E2:MIL.RAD.V4` |
| V | תקציב SNR מראש | נלמד | M2.2 (PoMR 2: loss budget) |

### MIL · Electro-optical and infrared sensing

| | פריט | מצב | איפה |
|---|---|---|---|
| H | פלאנק | נלמד | M3.4 (Driggers) |
| H | MTF | נלמד | M3.2 (Driggers) |
| H | NETD | נלמד | M3.10 (Driggers 14), M3.6 |
| H | Johnson/TTP | נלמד | M3.9 (Driggers 12–13) |
| H | תמסורת | נלמד | M3.5 (Driggers) |
| H | ניגוד | נלמד | M3.4, M3.10 (Driggers) |
| V | מדידה בשטח | נוסף פריט | M3.10 · `E2:MIL.EOIR.V1` |
| V | השוואה לתוצאות שפורסמו | נלמד | M3.9–M3.10 (Driggers worked examples) |

### MIL · Electronic warfare and electromagnetic spectrum operations

| | פריט | מצב | איפה |
|---|---|---|---|
| H | J/S | נלמד | M4.7 (EW 101 9) |
| H | burn-through | נלמד | M4.7 (EW 101 9) |
| H | משוואת טווח ES | נלמד | M0.1 (EW 101 2.2), M4.5 |
| H | רווח עיבוד LPI | נלמד | M4.11, M2.18 |
| H | deinterleaving | נלמד | M4.3 |
| H | דיוק DOA | נלמד | M4.6 |
| H | מחזור CM/CCM וקצביו | נלמד | M4.1 · M:R.7.4 |
| V | ספסל כבל עם אותות ידועים | נוסף פריט | M4.2 · `E2:MIL.EW.V1` |
| V | סימולציה מול מדידה | נלמד | M4.14 · M:EW.9.1 |
| V | נתוני ניסוי פתוחים | נוסף פריט | M4.3 · `E2:MIL.EW.V3` |

### MIL · Communications, datalinks and networks

| | פריט | מצב | איפה |
|---|---|---|---|
| H | תקציב לינק | נלמד | M1.4 (EW 101 4.11–4.13), M13.10 (SMAD 16) |
| H | TDMA ו-Link 16 ברמת ארכיטקטורה | נלמד | M7.9 (SISO Link 16) |
| H | LPI | נלמד | M4.11, M7.9 · M:COM.2.5 |
| H | ניתוב ב-MANET | נוסף פריט | M7.9 · `E2:MIL.COM.H4` |
| H | השהיה | נלמד | M7.9 · M:COM.2.6 |
| V | מול תאוריה | נוסף פריט | M1.4 · `E2:MIL.COM.V1` |
| V | מול מדידת SDR | נוסף פריט | M9.5 · `E2:MIL.COM.V2` |

### MIL · Positioning, navigation and timing

| | פריט | מצב | איפה |
|---|---|---|---|
| H | משוואת הפסאודו-טווח | נלמד | M5.1 (Kaplan 2) |
| H | DOP | נלמד | M5.6 (Kaplan 7) |
| H | C/N0 | נלמד | M5.3–M5.4 (Kaplan 4–5) |
| H | J/N | נלמד | M5.5 (Kaplan 6) |
| H | ספי לולאות עקיבה | נלמד | M5.4 (Kaplan 5) |
| H | צמיחת שגיאת INS | נלמד | M5.8 |
| H | Allan deviation | נלמד | M5.6 · P5.A1, M5.6 (Kaplan appendix B) |
| H | מסגרות | נלמד | M5.1 (Kaplan 2), M6.1 |
| V | נתוני תחנות IGS | נוסף פריט | M5.6 · `E2:MIL.PNT.V1` |
| V | השוואת מקלטים | נוסף פריט | M5.6 · `E2:MIL.PNT.V2` |
| V | IQ מוקלט | נוסף פריט | M5.4 · `E2:MIL.PNT.V3` |
| V | מפות קליטה מול NIC | נלמד | M5.5 · P5.A5 |

### MIL · Missiles: propulsion, guidance, control and design

| | פריט | מצב | איפה |
|---|---|---|---|
| H | PN ו-APN | נלמד | M6.4 (Siouris 4.3–4.7) |
| H | קבוע זמן מערכת | נלמד | M6.6 · M:MSL.5.1 |
| H | מרחק החטאה | נלמד | M6.6 · M:MSL.5.1, M:MSL.5.2 |
| H | Δv | נלמד | M6.8 (Siouris 6), M13.12 |
| H | אווירודינמיקה בסדר גודל | נלמד | M6.2 · A-F3, M6.12 (Fleeman) |
| H | עמידות מבנית | נלמד | M6.12 (Fleeman 1–7: airframe and motor-case structure) |
| V | Zarchan | נוסף פריט | M6.4 · `E2:MIL.MSL.V1` |
| V | פתרון סגור | נלמד | M6.4 (Siouris 4.3–4.7: closed-form PN) |
| V | adjoint מול מונטה קרלו | נוסף פריט | M6.6 · `E2:MIL.MSL.V3` |

### MIL · Air and missile defense

| | פריט | מצב | איפה |
|---|---|---|---|
| H | דליפה שכבתית | נלמד | M7.1 · M:AMD.1.3, M0.4 · ADD:MF.2 |
| H | עומק מחסנית | נלמד | M7.1 · M:AMD.5.4, M7.4 |
| H | Pk | נלמד | M7.1, M11.4 |
| H | עלות-החלפה | נלמד | M7.1 · M:AMD.5.1 |
| H | מכנים | נלמד | M7.4 · M:CRAFT.2.2 |
| V | נתונים ציבוריים מוצלבים | נלמד | M7.1 · P6b:ADD.7 |
| V | רגישות | נלמד | M14.1 · P7+.3 |

### MIL · C4ISR, kill chains and targeting

| | פריט | מצב | איפה |
|---|---|---|---|
| H | F2T2EA | נלמד | M7.9 · M:C4.1.1 |
| H | השהיות | נלמד | M7.9 · M:C4.1.2, M:C4.1.3 |
| H | VoI | נלמד | M14.1 · M:OR.8.2, M:OR.13.1 |
| H | ארכיטקטורות C2 | נלמד | M7.9 · M:C4.5.1 |
| V | ראיונות ומקרים מתועדים | נלמד | M14.5 · M:CRAFT.3.2, M12.1 · M:CRAFT.4.5 |

### MIL · Space systems and space warfare

| | פריט | מצב | איפה |
|---|---|---|---|
| H | קפלר | נלמד | M13.4 (SMAD 9) |
| H | Δv | נלמד | M13.4 (SMAD 9), M13.12 |
| H | J2 | נלמד | M13.4 · E:Fluids, aero\|6.1 |
| H | כיסוי | נלמד | M13.5–M13.6 (SMAD 8, 10) |
| H | תקציב לינק לווייני | נלמד | M13.10 (SMAD 16) |
| V | TLE מול תצפית | נוסף פריט | M13.4 · `E2:MIL.SPC.V1` |
| V | מקרי ספר | נלמד | M13.5–M13.6 (SMAD worked examples) |

### MIL · Unmanned systems and counter-UAS

| | פריט | מצב | איפה |
|---|---|---|---|
| H | RCS של רחפנים | נלמד | M9.7 · P5.A12 |
| H | טווחי גילוי | נלמד | M9.7 · M:UAS.4.1 |
| H | קשרי C2 | נלמד | M9.5 (Fahlstrom 13–16) |
| H | עלות-החלפה | נלמד | M9.7 · M:UAS.4.3 |
| V | טיסות | נוסף פריט | M9.6 · `E2:MIL.UAS.V1` |
| V | מדידות | נוסף פריט | M9.7 · `E2:MIL.UAS.V2` |
| V | דיווחי שטח | נלמד | M9.9 · M:CRAFT.4.1, M:UAS.3.3 |

### MIL · Weapons effects, lethality and protection

| | פריט | מצב | איפה |
|---|---|---|---|
| H | Gurney | נלמד | M11.3 (Hall 22–23; Ball 3.5) |
| H | CEP→Pk | נוסף פריט | M11.4 · `E2:MIL.WPN.H2` |
| H | שטח קטלני | נוסף פריט | M11.4 · `E2:MIL.WPN.H3` |
| V | מקרים מהספר | נלמד | M11.4 (Hall 24, Przemieniecki 3 examples) |

### MIL · Platforms and survivability

| | פריט | מצב | איפה |
|---|---|---|---|
| H | susceptibility מול vulnerability | נלמד | M8.8 · M:SUR.1.1 |
| H | שיעורי שחיקה | נלמד | M8.8 · M:SUR.1.3, M14.1 · M:OR.11.3 |
| V | היסטוריה | נלמד | M8.8 (Ball: historical loss rates), M14.1 · M:OR.11.3 |

### MIL · Naval and undersea warfare

| | פריט | מצב | איפה |
|---|---|---|---|
| H | Hughes salvo | נלמד | M10.5 · M:NAV.4.2 |
| H | משוואת הסונאר | נלמד | M10.2 (Hall 16) |
| V | נתונים פתוחים | נוסף פריט | M10.5 · `E2:MIL.NAV.V1` |

### MIL · Operations research and combat modeling

| | פריט | מצב | איפה |
|---|---|---|---|
| H | לנצ'סטר | נלמד | M14.1 (Washburn & Kress 5) |
| H | salvo | נלמד | M14.1, M10.5 · M:NAV.4.2 |
| H | תורת חיפוש | נלמד | M3.11 |
| H | תכנון ניסויים | נלמד | M14.1 · M:OR.7.3 |
| H | אימות | נלמד | M14.1 · M:OR.1.3 |
| V | היסטוריה | נלמד | M14.1 · M:OR.11.1, M:OR.11.3 |
| V | רגישות | נלמד | M14.1 · P7+.3 |
| V | השוואה | נלמד | M14.1 · M:OR.1.3 (VV&A) |

### MIL · Logistics, sustainment and force generation

| | פריט | מצב | איפה |
|---|---|---|---|
| H | מקדמי תכנון | נלמד | M14.3 · M:LOG.1.1 |
| H | צריכה | נלמד | M14.3 · M:LOG.1.1, M:LOG.1.4 |
| H | ייצור | נלמד | M14.3 · P7+.5 |
| V | נתונים מוצלבים | נלמד | M14.4 · M:CRAFT.2.5 |

### MIL · Acquisition, cost, test & evaluation, industrial base, policy

| | פריט | מצב | איפה |
|---|---|---|---|
| H | LCC | נלמד | M14.2 · M:ACQ.2.1 |
| H | עקומות למידה | נלמד | M14.2 · M:ACQ.2.3 |
| H | סטטיסטיקת ניסוי | נלמד | M7.10 · M:OR.9.1, M0.4 · ADD:MF.1 |
| V | נתונים | נלמד | M14.2 · M:ACQ.1.2 |

### MIL · Adversary systems, doctrine and capability assessment

| | פריט | מצב | איפה |
|---|---|---|---|
| H | מבנה כוח | נלמד | M12.1–M12.4 (ATP 7-100.1, 7-100.3) |
| H | תורות | נלמד | M12.1–M12.4 |
| H | שיטות הערכה | נלמד | M14.4 · M:ADV.4.1, M:ADV.4.2, M:ADV.4.3 |
| V | מונחים מול מילון צבאי | נוסף פריט | M12.1 · `E2:MIL.ADV.V1` |
| V | מומחה | נלמד | M14.5 · M:CRAFT.3.2 |

### MIL · Defense analysis craft: OSINT, claims checking and communication

| | פריט | מצב | איפה |
|---|---|---|---|
| H | שיטות אימות | נלמד | M14.4 · M:CRAFT.1.1–1.3 |
| H | הטיות | נלמד | M14.4 · M:ADV.4.3 |
| H | סדרי גודל | נלמד | M14.1 · P7+.4, M0.1 · M:F.1.4 |
| V | כל מקור נפתח ונקרא | נוסף פריט | M14.4 · `E2:MIL.CRAFT.V1` |
| V | גיאולוקציה כפולה | נוסף פריט | M14.4 · `E2:MIL.CRAFT.V2` |

## הערות למשלב

- **ממתינים:** שני פריטים בגילואה (רעיון IMM ושיוך נתונים) מחכים למודול השערוך החדש אחרי M5.6. כשהמודול ייווצר, מעבירים אותם מ-`pending` ל-`items` תחת המזהה הסופי שלו. בלנצ'סטר אין ממתינים: Kay (CRB), Balanis (צימוד הדדי, דיפול, patch), Kurose & Ross ו-Murthy & Manoj (ניתוב MANET), Zarchan ו-Przemieniecki/Driels נכנסים למודולים קיימים (M0.6, M1.1–M1.2, M7.9, M6.4, M11.4), ולכן הפריטים שלהם נוספו כבר עכשיו.
- **פריטים שנוספו למודולים שהמקור החדש ייכנס אליהם:** Friis של רעש (M11.7) ועכבת גל (M9.9) יילמדו גם מ-Pozar כשמודול ה-RF של גילואה (M11.15 המתוכנן) ופרק 1 של Pozar ייכנסו; אז אפשר להפוך אותם ל-`delta` עם `primary`.
- **מודולים שיוחלפו:** כמה פריטים "נלמד" מצטטים פריטים קיימים במודולים שהמיפוי מחליף במקור מלא יותר (M11.11 ← Pozar, M15.5–M15.10 ← Anderson Fundamentals, M22.10 ← White). בשילוב צריך להעביר את פריטי ה-curriculum שלהם למודול המחליף.
- **שיטה:** ההתאמה לפי נושא, לא לפי מחרוזת. "נלמד" מבוסס על כותרות הפרקים ב-SYLLABUS.md ועל פריטי curriculum.json הקיימים, לא על קריאת העמודים עצמם.

