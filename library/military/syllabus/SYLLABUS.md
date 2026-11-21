# תוכנית הלימודים: הליבה הצבאית (טיוטה)

נבנתה מתוכני העניינים של כל הספרים. כל נושא נלמד פעם אחת, במקום שבו המקור הכי טוב, ונשען על עמודים מוגדרים. מספרי העמודים הם עמודי ה-PDF בקבצים שב-`library/military/`.

**דרגות:** ליבה = נלמד במלואו. מתקדם = אחרי הליבה של אותו חלק. עיון = לא נלמד כשיעור, זמין לפי צורך.

**תפקיד המקור:** ★ מקור ראשי. ◇ השלמה מספר אחר. 📄 מאמר או מסמך. ⚙ מקור עזר לניתוח: לא נלמד כחומר שיעור; המורה משתמש בו כדי לקחת את התוצאה הטכנית של המודול לתוצאה מבצעית, והלומד מתכנן את הניתוח (חקר ביצועים, שרידות, לוגיסטיקה). ▫ עיון: שאר העמודים של דוח שנלמד רק בחלקו; לא חומר שיעור, זמין לקריאה.

**ספירת עמודים:** Orfanidis, Electromagnetic Waves and Antennas (2004) נספר פי 2 (עמודי ספר בכל עמוד PDF).

**סה"כ:** 229 מודולים: 167 ליבה, 40 מתקדם, 22 עיון.

| חלק | מודולים | עמ' ספר בליבה | עמ' מאמרים בליבה | שיעורי ליבה (אומדן) | עמ' ספר במתקדם |
|---|---|---|---|---|---|
| P0 יסודות: הכלים המתמטיים והפיזיקליים | 8 | 210 | 0 | 16 | 0 |
| P1 השכבה הפיזית: אנטנות, התפשטות וקשר | 8 | 552 | 72 | 37 | 0 |
| P2 מכ"ם | 40 | 1296 | 448 | 86 | 841 |
| P3 EO/IR | 15 | 519 | 0 | 35 | 146 |
| P4 לוחמה אלקטרונית | 16 | 430 | 180 | 30 | 36 |
| P5 ניווט ו-GNSS | 14 | 1373 | 26 | 93 | 220 |
| P6 טילים: דינמיקה, הנחיה ובקרה | 16 | 1229 | 44 | 84 | 50 |
| P7 הגנה אווירית ומפני טילים, ושו"ב | 18 | 2454 | 348 | 163 | 67 |
| P15 ארכיטקטורת מערכות, קשר וסייבר-ספקטרום | 7 | 1408 | 0 | 94 | 0 |
| P8 פלטפורמות אוויר ואוויוניקה | 10 | 330 | 41 | 24 | 264 |
| P9 כטב"מים, רחפנים והגנה מפניהם | 10 | 397 | 41 | 27 | 51 |
| P10 מערכות ימיות | 10 | 3027 | 120 | 208 | 0 |
| P11 אפקטים של נשק ושריון | 20 | 2940 | 0 | 197 | 530 |
| P12 האויב: דוקטרינה והפעלה | 5 | 112 | 0 | 7 | 140 |
| P13 חלל: מסלולים, לוויינים, תקשורת לוויינית ושיגור | 24 | 351 | 0 | 24 | 174 |
| P14 ניתוח הגנה: מידול לחימה, עלות, לוגיסטיקה ו-OSINT | 8 | 439 | 0 | 31 | 112 |
| **סה"כ** | 229 | 17067 | 1320 | 1156 | 2631 |

האומדן: שיעור לכל כ-15 עמודי ספר, כולל השלמות. מאמר לא מוסיף שיעורים משלו: המורה משלב ממנו את מה שחדש בתוך שיעורי המודול. מודול שכולו מאמרים נספר לפי עמודי המאמר.

## חלק 0: יסודות: הכלים המתמטיים והפיזיקליים

### M0.1 דציבלים ומשוואת הקשר הבסיסית
*dB and the basic link equation* · **ליבה** · 16 עמ' ספר · כ-1 שיעורים

- ★ EW 101, עמ' PDF 29–41: 2.1–2.3: dB, משוואת הקשר לכל פונקציות ה-EW, קשר במכ"ם
- ◇ Principles of Modern Radar, עמ' PDF 932–934: A.2: The Ubiquitous dB

### M0.2 גלים ופיזיקה אלקטרומגנטית
*Waves and EM physics* · **ליבה** · 38 עמ' ספר · כ-3 שיעורים

- ★ Principles of Modern Radar, עמ' PDF 42–54: 1.3–1.4: אורך גל, פאזה, קיטוב, עקיפה, שבירה, החזרה
- ◇ Principles of Naval Weapons Systems, עמ' PDF 13–22: פרק 1: פרמטרים של גל
- ◇ Principles of Naval Weapons Systems, עמ' PDF 23–26: פרק 2: החזרה, שבירה, התאבכות, עקיפה
- ◇ Principles of Modern Radar, עמ' PDF 930–931: A.1: משוואות מקסוול
- ◇ Introduction to IR and EO Systems, עמ' PDF 88–96: 4.1–4.2: גלים וקוהרנטיות

### M0.3 אותות וספקטרום: פורייה, קונבולוציה, דגימה
*Signals, Fourier, convolution, sampling* · **ליבה** · 56 עמ' ספר · כ-4 שיעורים

- ★ Introduction to IR and EO Systems, עמ' PDF 30–47: 2.1–2.7: פונקציות מרוכבות, קונבולוציה, התמרת פורייה
- ★ Principles of Modern Radar, עמ' PDF 532–568: 14.1–14.6: דגימה, כימות, פורייה, התמרת z, מסננים דיגיטליים
- ◇ Principles of Modern Radar, עמ' PDF 313: 8.3: התמרת פורייה

### M0.4 הסתברות, רעש ואותות אקראיים
*Probability, noise and random signals* · **ליבה** · 24 עמ' ספר · כ-2 שיעורים

- ★ Introduction to IR and EO Systems, עמ' PDF 48–59: 2.8–2.9: הסתברות ודוגמאות
- ★ Principles of Modern Radar, עמ' PDF 569–572: 14.7: אותות אקראיים
- ★ Principles of Modern Radar, עמ' PDF 62–63: 1.6: רעש, SNR וגילוי
- ◇ Principles of Naval Weapons Systems, עמ' PDF 41–46: פרק 3: רכיבי מערכת תקשורת ורעש
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 239–257: נספח A: הסתברות לאנליסט
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 264–267: נספח C: סימולציית מונטה קרלו

### M0.5 אפנון ותקשורת ספרתית
*Modulation and digital communication* · **ליבה** · 42 עמ' ספר · כ-3 שיעורים

- ★ Principles of Naval Weapons Systems, עמ' PDF 47–62: פרק 4: AM, FM, PM, SSB
- ★ Principles of Naval Weapons Systems, עמ' PDF 75–82: פרק 6: ASK, FSK, PSK, קיבולת, דגימה וקידוד
- ★ EW 102, עמ' PDF 138–149: 5.6: תקשורת ספרתית
- ◇ Principles of Naval Weapons Systems, עמ' PDF 83–88: פרק 7: ריבוב ורשתות

### M0.6 שערוך: ריבועים פחותים ודיוק מדידה
*Estimation and least squares* · **ליבה** · 15 עמ' ספר · כ-1 שיעורים

- ★ Principles of Modern Radar, עמ' PDF 714–726: 18.1–18.4: דיוק ושערוך פרמטרים
- ★ Understanding GPS, עמ' PDF 679–680: נספח A: ריבועים פחותים משוקללים

### M0.7 מערכות בקרה בסיסיות
*Feedback control basics* · **ליבה** · 8 עמ' ספר · כ-1 שיעורים

- ★ Principles of Naval Weapons Systems, עמ' PDF 227–234: פרק 18: לולאה פתוחה וסגורה, פונקציית תמסורת, תגובה

### M0.8 גאומטריה כדורית בשביל EW
*Spherical trigonometry for EW* · **ליבה** · 11 עמ' ספר · כ-1 שיעורים

- ★ EW 101, עמ' PDF 42–52: 2.4–2.5: משולשים כדוריים, שגיאת אזימוט, דופלר, זווית תצפית

## חלק 1: השכבה הפיזית: אנטנות, התפשטות וקשר

### M1.1 אנטנות: פרמטרים, הגבר, אלומה, קיטוב
*Antennas* · **ליבה** · 83 עמ' ספר · כ-6 שיעורים · דרישות: M0.2, M0.1

- ★ EW 101, עמ' PDF 53–64: 3.1–3.3: פרמטרים, סוגים, פשרות באנטנה פרבולית
- ★ Principles of Modern Radar, עמ' PDF 346–356: 9.1–9.4: מושגי יסוד, טייפרים, השפעה על ביצועי מכ"ם
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 224–230: 13.1–13.5: מקורות השדה, פוטנציאלים מושהים, אנטנת תיל, דיפול חשמלי ומגנטי (Orfanidis, במקום Balanis 4)
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 233–236: 13.7–13.10: שדות הקרינה, קירוב השדה הרחוק וחישובו
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 239–247: 14.1–14.6: עוצמת קרינה, כיווניות, הגבר ורוחב אלומה, שטח אפקטיבי, מעגל שקול, אנטנות מתקשרות
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 256–260: 15.1–15.5: אנטנות לינאריות, דיפול הרץ, אנטנות גל עומד, דיפול חצי גל ומונופול
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 297–299: 17.6: אנטנות מיקרוסטריפ (patch), במקום Balanis 14
- ◇ Principles of Modern Radar, עמ' PDF 359–362: 9.6: אנטנות מחזיר

### M1.2 מערכי מופע ואנטנות מתקדמות
*Phased arrays* · **ליבה** · 106 עמ' ספר · כ-7 שיעורים · דרישות: M1.1

- ★ Principles of Modern Radar, עמ' PDF 363–383: 9.7–9.8: מערכי מופע וארכיטקטורות מערך
- ★ EW 101, עמ' PDF 65–70: 3.4: מערך מופע, מרווח, רוחב אלומה, הגבלת היגוי
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 312–324: 18.1–18.10: פקטור מערך, הכפלת דפוסים, אזור נראה, אונות סריג, כיווניות, היגוי ורוחב אלומה (Orfanidis, במקום Balanis 6)
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 334–344: 19.6–19.9: תכן לאונות צד נמוכות: בינומי, Dolph-Chebyshev, Taylor-Kaiser
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 363–370: 21.2–21.4: עכבה עצמית והדדית, מערך של שני אלמנטים ומערכי דיפולים מקבילים (צימוד הדדי, במקום Balanis 8.6)
- ◇ Military Avionics Systems, עמ' PDF 107–121: 2.6–2.7: אינטגרציית RF ו-F-35 shared aperture

### M1.3 התפשטות: הנחתה, שבירה, הולכת גלים, רב-נתיביות, אופק
*Propagation* · **ליבה** · 79 עמ' ספר + 72 עמ' מאמרים · כ-5 שיעורים · דרישות: M0.2

- ★ Principles of Modern Radar, עמ' PDF 154–201: פרק 4: מקדם התפשטות, הנחתה, שבירה, עקיפה, רב-נתיביות
- ★ EW 102, עמ' PDF 124–137: 5.1–5.5: התפשטות HF ו-VHF/UHF, רעש רקע
- ◇ Principles of Naval Weapons Systems, עמ' PDF 32–40: גל קרקע, גל שמיים, קו ראייה
- ◇ Military Avionics Systems, עמ' PDF 281–287: 7.2: התפשטות RF
- ◇ EW 101, עמ' PDF 42: 2.3.5: אותות בתדר נמוך קרוב לקרקע
- 📄 Radar Detection of Low-Altitude Targets in a Maritime Environment, Vol. 1 (כולו): מוליך אידוי ורב-נתיביות מעל הים

### M1.5 קווי תמסורת, רשתות מיקרוגל ותיאום עכבות: Smith, פרמטרי S ו-ABCD
*Transmission lines, microwave networks and impedance matching (Pozar)* · **ליבה** · 120 עמ' ספר · כ-8 שיעורים · דרישות: M0.2

- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 68–104: 2.1–2.7: מודל הקו, ניתוח שדות, קו מסתיים, דיאגרמת Smith, שנאי רבע גל, אי-תיאום מחולל ועומס, קווים עם הפסדים
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 150–154: 3.5: קו קואקסיאלי
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 167–172: 3.8: קו מיקרוסטריפ
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 177–178: 3.11: סיכום קווי תמסורת ומוליכי גל
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 186–222: 4.1–4.5: עכבה ומתחים שקולים, מטריצות Z ו-Y, מטריצת הפיזור (S), מטריצת ABCD, גרפי זרימת אות
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 249–260: 5.1–5.2: תיאום ברשת L ובענף יחיד
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 266–271: 5.4–5.5: שנאי רבע גל ותורת ההחזרות הקטנות
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 287–291: 5.9: קריטריון Bode–Fano
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 216–220: 11.11–11.12: רשתות תיאום מרוכזות L ו-Pi (Orfanidis)

### M1.6 רעש, עיוות לא-לינארי ושרשרת המקלט: נקודת רעש, IP3, טווח דינמי, יציבות מגבר ומערבלים
*Noise, nonlinear distortion and the receiver chain (Pozar)* · **ליבה** · 79 עמ' ספר · כ-5 שיעורים · דרישות: M1.5, M0.4

- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 516–543: 10.1–10.4: רעש במעגלי מיקרוגל, נקודת רעש ושרשור שלבים, עיוות לא-לינארי ו-IP3, טווח דינמי
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 578–590: 12.1–12.2: הגברי הספק של שני-מבואות ויציבות
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 657–671: 13.5: מערבלים (עד עמ' 651 המודפס)
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 678–690: 14.1: היבטים מערכתיים של אנטנות: טמפרטורת רעש ו-G/T
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 247–251: 14.7–14.8: טמפרטורת רעש של האנטנה ושל המערכת (Orfanidis)

### M1.4 משוואת הקשר החד-כיווני ורגישות מקלט
*One-way link and receiver sensitivity* · **ליבה** · 26 עמ' ספר · כ-2 שיעורים · דרישות: M0.1, M1.1, M1.6

- ★ EW 101, עמ' PDF 84–94: 4.11–4.13: רגישות, רגישות FM ורגישות ספרתית
- ★ Principles of Modern Radar, עמ' PDF 115: 2.14: משוואת הקשר החד-כיווני
- ◇ Understanding GPS, עמ' PDF 685–690: נספח C: הפסד מרחב חופשי
- ◇ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 252–255: 14.9–14.11: גבולות קצב נתונים, קישורי לוויין ומשוואת המכ"ם (Orfanidis)

### M1.7 רכיבי מיקרוגל: מחלקי הספק, מצמדים, היברידים, מסננים, מחזרים, מגבר הספק ורעש פאזה
*Microwave components: dividers, couplers, hybrids, filters, circulators, power amplifiers, phase noise (Pozar)* · **ליבה** · 59 עמ' ספר · כ-4 שיעורים · דרישות: M1.6

- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 337–343: 7.1: תכונות יסוד של מחלקים ומצמדים
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 348–352: 7.3: מחלק Wilkinson
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 363–366: 7.5: היברידי 90°
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 382–386: 7.8: היברידי 180° (ניתוח זוגי-אי-זוגי)
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 419–434: 8.3–8.4: תכן מסננים בשיטת הפסד ההחדרה והתמרות מסננים
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 507–515: 9.6: מחזרים פריטיים
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 616–623: 12.5: מגברי הספק
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 642–646: 13.3: רעש פאזה של מתנד

### M1.8 Pozar ו-Orfanidis: שאר הפרקים
*Pozar and Orfanidis: remaining chapters (reference)* · **עיון** · 1093 עמ' ספר · כ-73 שיעורים

- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 21–67: Pozar 1: תורת השדות (נלמד בגילואה, M9.9)
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 105–149: Pozar 2.8, 3.1–3.4: מעברים בקווים, גלי TEM/TE/TM ומוליכי גל (נלמדים בגילואה, M9.11)
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 155–166: Pozar 3.6–3.7: גלי שטח ו-stripline
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 173–176: Pozar 3.9–3.10: תהודה רוחבית ונפיצה
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 179–185: Pozar: תרגילי פרק 3
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 223–248: Pozar 4.6–4.8: אי-רציפויות ועירור מוליכי גל
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 261–265: Pozar 5.3: תיאום בשני ענפים
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 272–286: Pozar 5.6–5.8: שנאים רב-שלביים וקווים מחודדים
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 292–336: Pozar 6: מהודים (נלמד בגילואה, M9.11)
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 344–347: Pozar 7.2: מחלק T
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 353–362: Pozar 7.4: מצמדים במוליך גל
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 367–381: Pozar 7.6–7.7: מצמדי קווים צמודים ו-Lange
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 387–418: Pozar 7.8 (המשך), 7.9, 8.1–8.2: מצמדים נוספים, מבנים מחזוריים, שיטת פרמטרי התמונה
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 435–506: Pozar 8.5–8.8, 9.1–9.5: מימוש מסננים, חומרים פריטיים, מבודדים ומזיזי מופע
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 544–577: Pozar 11: התקנים פעילים (PoMR 10–11, גילואה)
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 591–615: Pozar 12.3–12.4: תכן מגבר טרנזיסטור
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 624–641: Pozar 13.1–13.2: מתנדים
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 647–656: Pozar 13.4: מכפילי תדר
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 672–677: Pozar 13.5 (המשך): מערבלים מאוזנים, ותרגילי פרק 13
- ★ Pozar, Microwave Engineering, 4th ed. (2012), עמ' PDF 691–741: Pozar 14.2–14.6 ונספחים: תקשורת אלחוטית, מכ"ם, רדיומטריה והתפשטות (חופף ל-PoMR 1–4 ול-M1.4)
- ★ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 14–215: Orfanidis 1–11.10: מקסוול, גלים מישוריים, החזרה ושכבות, מוליכי גל, קווי תמסורת, קווים צמודים, שנאים (חופף ל-Pozar ולגילואה)
- ★ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 221–223: Orfanidis 11.13–11.14 (פרק 12, פרמטרי S, חסר ב-PDF)
- ★ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 231–232: Orfanidis 13.6: משפט Ewald-Oseen
- ★ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 237–238: Orfanidis: תרגילי פרק 13
- ★ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 261–296: Orfanidis 15.6–17.5: אנטנות גל נע ולולאה, קרינה מצמצמים, עקיפה (Fresnel, knife-edge, GTD), צופרים
- ★ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 300–311: Orfanidis 17.7–17.13: אנטנות מחזיר ועדשה
- ★ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 325–333: Orfanidis: תרגילי פרק 18, ו-19.1–19.5: שיטות תכן מערך
- ★ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 345–362: Orfanidis 19.10–21.1: מערכים רב-אלומתיים, זרמים על אנטנות לינאריות (Hallén, Pocklington), שדות קרובים
- ★ Orfanidis, Electromagnetic Waves and Antennas (2004), עמ' PDF 371–391: Orfanidis 21.5–21.7 ונספחים: Yagi-Uda ומשוואות Hallén לאנטנות צמודות

## חלק 2: מכ"ם

### M2.1 רעיון המכ"ם, תצורות, מדידות ויישומים
*Radar overview* · **ליבה** · 42 עמ' ספר · כ-3 שיעורים · דרישות: M0.2

- ★ Principles of Modern Radar, עמ' PDF 40–41: 1.1–1.2
- ★ Principles of Modern Radar, עמ' PDF 55–61: 1.5: מונוסטטי/ביסטטי, CW/פולסי
- ★ Principles of Modern Radar, עמ' PDF 64–90: 1.7–1.9: מדידות, פונקציות ויישומים
- ◇ Principles of Modern Radar, עמ' PDF 93–95: 1.13: תרגילים
- ◇ EW 102, עמ' PDF 50–52: 3.1: המכ"ם מנקודת המבט של EW

### M2.2 משוואת המכ"ם
*The radar range equation* · **ליבה** · 42 עמ' ספר · כ-3 שיעורים · דרישות: M2.1, M0.1

- ★ Principles of Modern Radar, עמ' PDF 96–123: פרק 2: משוואת המכ"ם על כל צורותיה
- ★ EW 102, עמ' PDF 53–64: 3.2–3.3: טווח גילוי מול טווח גילוי-נגדי
- ◇ Principles of Naval Weapons Systems, עמ' PDF 101–102: משוואת הטווח המרבי

### M2.3 חיפוש וגילוי בהפרעה: סקירה
*Search and detection overview* · **ליבה** · 28 עמ' ספר · כ-2 שיעורים · דרישות: M2.2, M0.4

- ★ Principles of Modern Radar, עמ' PDF 124–151: פרק 3
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 137–164: פרק 7: חיפוש, רוחב סריקה ושלושת חוקי הגילוי
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 282–303: פרק 10: גילוי מטרה, הצצות וחיפוש רציף

### M2.4 חתימת מכ"ם (RCS), פיזור וחמקנות
*RCS, scattering and stealth* · **ליבה** · 62 עמ' ספר + 241 עמ' מאמרים · כ-4 שיעורים · דרישות: M2.2

- ★ Principles of Modern Radar, עמ' PDF 248–283: פרק 6: פיזיקת החזרה, שלושה משטרי פיזור, פיזור בתדר גבוה
- ★ Military Avionics Systems, עמ' PDF 193–204: 4.6: חמקנות
- ◇ EW 101, עמ' PDF 250–251: 10.2: RCS והספק מוחזר
- ◇ Introduction to UAV Systems, עמ' PDF 290–301: 11.5: הפחתת חתימה
- 📄 Ufimtsev, Method of Edge Waves in the Physical Theory of Diffraction (כולו): התאוריה הפיזיקלית של עקיפה: הבסיס לעיצוב חמקני
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 580–596: 4.4.4: הקטנת חתימה כחלק משרידות
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 474–560: 4.3: הערכת חשיפה (susceptibility)

### M2.5 מודלי תנודות מטרה (Swerling)
*Target fluctuation models* · **ליבה** · 26 עמ' ספר · כ-2 שיעורים · דרישות: M2.4, M0.4

- ★ Principles of Modern Radar, עמ' PDF 284–309: פרק 7

### M2.6 קלאטר
*Clutter* · **ליבה** · 52 עמ' ספר · כ-3 שיעורים · דרישות: M2.2

- ★ Principles of Modern Radar, עמ' PDF 202–247: פרק 5
- ◇ Air and Missile Defense Systems Engineering, עמ' PDF 246–251: 9.2.1–9.2.3: החזרי קרקע ונפח

### M2.7 תופעת דופלר ואיסוף נתונים פולסי
*Doppler phenomenology* · **ליבה** · 37 עמ' ספר · כ-2 שיעורים · דרישות: M0.3, M2.1

- ★ Principles of Modern Radar, עמ' PDF 310–343: פרק 8: דופלר, ספקטרום פולסי, ספקטרום טווח-דופלר
- ◇ EW 101, עמ' PDF 47–49: 2.5.2: הסטת דופלר

### M2.8 רכיבי המכ"ם: משדר, מקלט, מעורר
*Radar hardware* · **ליבה** · 95 עמ' ספר · כ-6 שיעורים · דרישות: M2.1, M1.6, M1.7

- ★ Principles of Modern Radar, עמ' PDF 384–427: פרק 10: משדרים
- ★ Principles of Modern Radar, עמ' PDF 428–440: 11.1–11.4: סוגי מקלטים, פונקציות, המרת תדר וגילוי
- ◇ Principles of Modern Radar, עמ' PDF 441–445: 11.5–11.6: הספק רעש וטווח דינמי של המקלט: סקירה מקוצרת, הדלתא מול M1.6
- ★ Principles of Modern Radar, עמ' PDF 446–453: 11.7–11.10: המרה אנלוגית-ספרתית, SFDR והמרת תדר ספרתית
- ★ Principles of Modern Radar, עמ' PDF 454–466: 12.1–12.2: השפעת המעורר על ביצועים (רעש פאזה)
- ◇ Military Avionics Systems, עמ' PDF 135–146: 3.5: ארכיטקטורת מכ"ם פולסי במטוס

### M2.9 אינטגרציה ומסנן מתואם
*Integration and matched filtering* · **ליבה** · 11 עמ' ספר · כ-1 שיעורים · דרישות: M0.3, M0.4

- ★ Principles of Modern Radar, עמ' PDF 573–583: 14.8–14.10

### M2.10 גילוי בסף
*Threshold detection* · **ליבה** · 42 עמ' ספר · כ-3 שיעורים · דרישות: M2.9, M2.5

- ★ Principles of Modern Radar, עמ' PDF 584–625: פרק 15
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 282–288: 10.1–10.2: הסתברות גילוי מצטברת מהצצות
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 141–148: 7.3: חוקי הגילוי

### M2.11 CFAR
*Constant false alarm rate* · **ליבה** · 36 עמ' ספר · כ-2 שיעורים · דרישות: M2.10

- ★ Principles of Modern Radar, עמ' PDF 626–661: פרק 16

### M2.12 דחיסת פולס ופונקציית העמימות
*Pulse compression and ambiguity* · **ליבה** · 68 עמ' ספר · כ-5 שיעורים · דרישות: M2.9

- ★ Principles of Modern Radar, עמ' PDF 810–871: פרק 20
- ◇ EW 102, עמ' PDF 65–70: 3.4–3.5: אפנון מכ"ם ופולס

### M2.13 עיבוד דופלר: MTI, פולס-דופלר, עמימויות
*Doppler processing* · **ליבה** · 67 עמ' ספר · כ-4 שיעורים · דרישות: M2.7, M2.6

- ★ Principles of Modern Radar, עמ' PDF 662–713: פרק 17
- ★ Air and Missile Defense Systems Engineering, עמ' PDF 251–256: 9.2.4–9.2.11: CPI, פולסי מילוי, ליקוי, מהירויות עיוורות
- ◇ EW 102, עמ' PDF 71–79: 3.6–3.7: CW, פולס-דופלר ו-MTI מנקודת מבט EW

### M2.14 מדידות מכ"ם ומדידת זווית (מונופולס)
*Radar measurements and monopulse* · **ליבה** · 25 עמ' ספר · כ-2 שיעורים · דרישות: M0.6, M1.1, M2.2, M1.2

- ★ Principles of Modern Radar, עמ' PDF 727–749: 18.5–18.10: טווח, פאזה, דופלר, RCS, זווית, מערכות צירים
- ★ Principles of Modern Radar, עמ' PDF 357–358: 9.5: מונופולס

### M2.40 חסם קרמר-ראו: הגבול התחתון לדיוק מדידה של השהיה, תדר וזווית
*The Cramer-Rao bound and the accuracy of delay, frequency and angle estimates* · **ליבה** · 29 עמ' ספר · כ-2 שיעורים · דרישות: M2.14, M0.4, M2.12

- ★ Hero, Statistical Methods for Signal Processing, EECS 564 notes (2016), עמ' PDF 83–111: 5.4–5.5: שערוך פרמטרים לא-אקראיים: MoM, ML, חסם קרמר-ראו סקלרי ומטריצי, ML וקטורי. את החסם להשהיה, לתדר ולזווית גוזרים בשיעור מ-PoMR 18.5–18.10 (Kay חסר), ומחברים ל-DOP ול-CEP

### M2.20 מכ"ם CW ו-FMCW
*CW and FMCW radar* · **ליבה** · 70 עמ' ספר · כ-5 שיעורים · דרישות: M2.7, M2.12

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 42–111: כרך III, פרק 2

### M2.21 מכ"ם גלים מילימטריים (MMW)
*MMW radar* · **ליבה** · 30 עמ' ספר · כ-2 שיעורים · דרישות: M1.3, M2.20

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 112–141: כרך III, פרק 3

### M2.15 עקיבה: מסנני קלמן, מודלי תנועה, שיוך
*Tracking* · **ליבה** · 60 עמ' ספר + 15 עמ' מאמרים · כ-4 שיעורים · דרישות: M2.14

- ★ Principles of Modern Radar, עמ' PDF 750–809: פרק 19
- 📄 Arulampalam et al., A Tutorial on Particle Filters (2002) (כולו): מסנן חלקיקים

### M2.23 מכ"ם מערך מופע רב-משימתי
*Multifunction phased array radar* · **ליבה** · 34 עמ' ספר · כ-2 שיעורים · דרישות: M1.2, M2.15

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 276–309: כרך III, פרק 6

### M2.24 מכ"ם ביסטטי פסיבי
*Passive bistatic radar* · **ליבה** · 44 עמ' ספר · כ-3 שיעורים · דרישות: M2.13

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 524–567: כרך III, פרק 11

### M2.30 אלומה ספרתית אדפטיבית וביטול משבשים
*Adaptive digital beamforming* · **ליבה** · 52 עמ' ספר · כ-3 שיעורים · דרישות: M1.2, M2.9

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 426–477: כרך II, פרק 9

### M2.16 מכ"ם מוטס: פולס-דופלר, GMTI ו-STAP
*Airborne radar: pulse-Doppler, GMTI, STAP* · **ליבה** · 180 עמ' ספר + 179 עמ' מאמרים · כ-12 שיעורים · דרישות: M2.13, M1.2, M2.30

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 200–275: כרך III, פרק 5: מכ"ם פולס-דופלר מוטס
- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 408–455: כרך III, פרק 9: גילוי מטרות נעות על הקרקע (SMTI)
- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 478–523: כרך II, פרק 10: דיכוי קלאטר ב-STAP
- 📄 Ward, Space-Time Adaptive Processing for Airborne Radar, LL TR-1015 (1994) (כולו): המקור של STAP
- ◇ Military Avionics Systems, עמ' PDF 146–150: 3.6–3.7: מכ"ם דופלר ושימושים נוספים
- ◇ Military Avionics Systems, עמ' PDF 48–52: 1.6–1.7: מעקב שדה קרב והתרעה מוקדמת מוטסת

### M2.17 הדמיית מכ"ם: SAR ו-ISAR
*Radar imaging* · **ליבה** · 62 עמ' ספר · כ-4 שיעורים · דרישות: M2.12, M2.7

- ★ Principles of Modern Radar, עמ' PDF 872–929: פרק 21
- ◇ EW 102, עמ' PDF 80–83: 3.8: SAR מנקודת מבט EW

### M2.18 מכ"ם LPI
*LPI radar* · **ליבה** · 10 עמ' ספר · כ-1 שיעורים · דרישות: M2.12

- ★ EW 102, עמ' PDF 84–93: 3.9

### M2.19 מעבד האותות של המכ"ם
*Radar signal processor* · **מתקדם** · 63 עמ' ספר · כ-4 שיעורים · דרישות: M2.13

- ★ Principles of Modern Radar, עמ' PDF 467–529: 12.3–12.5 ופרק 13: מבנה המעבד, FLOPS, מימוש

### M2.22 מכ"ם בקרת אש
*Fire-control radar* · **ליבה** · 58 עמ' ספר · כ-4 שיעורים · דרישות: M2.15, M2.14

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 142–199: כרך III, פרק 4
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 398–418: 3.7: מבצעי האיום, שרשרת ההיתקלות

### M2.29 עקיבה מרובת מטרות ומיזוג חיישנים
*Multitarget, multisensor tracking* · **ליבה** · 34 עמ' ספר + 13 עמ' מאמרים · כ-2 שיעורים · דרישות: M2.15

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 694–727: כרך II, פרק 15
- 📄 Vo, Vo, Phung, Labeled RFS and the Bayes Multi-Target Tracking Filter (2014) (כולו): עקיבה מודרנית אחר מטרות מרובות (GLMB)

### M2.25 SAR מהחלל
*Space-based SAR* · **מתקדם** · 68 עמ' ספר · כ-5 שיעורים · דרישות: M2.17

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 456–523: כרך III, פרק 10

### M2.26 מכ"ם חודר עלווה (FOPEN)
*Foliage-penetrating radar* · **מתקדם** · 56 עמ' ספר · כ-4 שיעורים · דרישות: M2.17

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 660–715: כרך III, פרק 14

### M2.27 מכ"ם בקרת תעבורה אווירית ו-SSR
*Air traffic control radar and SSR* · **מתקדם** · 48 עמ' ספר · כ-3 שיעורים · דרישות: M2.13

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 568–615: כרך III, פרק 12

### M2.28 מכ"ם מזג אוויר, חודר קרקע ומשטרתי
*Weather, ground-penetrating and police radar* · **עיון** · 132 עמ' ספר · כ-9 שיעורים

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 616–659: כרך III, פרק 13
- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 716–803: כרך III, פרקים 15–16

### M2.31 צורות גל מתקדמות לדחיסת פולס
*Advanced pulse compression waveforms* · **מתקדם** · 68 עמ' ספר · כ-5 שיעורים · דרישות: M2.12

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 44–111: כרך II, פרק 2: Stretch, stepped chirp, NLFM, stepped frequency, מסננים לא-מתואמים

### M2.32 מכ"ם MIMO ותכנון צורות גל
*MIMO radar* · **מתקדם** · 60 עמ' ספר · כ-4 שיעורים · דרישות: M2.30

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 112–171: כרך II, פרקים 3–4

### M2.33 שחזור דליל ו-Compressed Sensing במכ"ם
*Sparse reconstruction and compressed sensing* · **מתקדם** · 62 עמ' ספר · כ-4 שיעורים · דרישות: M2.12

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 172–233: כרך II, פרק 5

### M2.34 SAR מתקדם: Spotlight, Stripmap ו-InSAR
*Advanced SAR* · **מתקדם** · 188 עמ' ספר · כ-13 שיעורים · דרישות: M2.17

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 236–423: כרך II, פרקים 6–8

### M2.35 קידוד מרחב-זמן לאנטנות אקטיביות
*Space-time coding* · **מתקדם** · 30 עמ' ספר · כ-2 שיעורים · דרישות: M2.16

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 524–553: כרך II, פרק 11

### M2.36 פולרימטריה במכ"ם
*Radar polarimetry* · **מתקדם** · 42 עמ' ספר · כ-3 שיעורים · דרישות: M2.4

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 614–655: כרך II, פרק 13

### M2.37 זיהוי מטרות אוטומטי (ATR) במכ"ם
*Radar ATR* · **מתקדם** · 38 עמ' ספר · כ-3 שיעורים · דרישות: M2.17

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 656–693: כרך II, פרק 14

### M2.38 גילוי בני אדם במכ"ם ומיקרו-דופלר
*Dismount detection and micro-Doppler* · **מתקדם** · 34 עמ' ספר · כ-2 שיעורים · דרישות: M2.13

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 730–763: כרך II, פרק 16

### M2.39 עיבוד מתקדם במכ"ם ביסטטי פסיבי
*Advanced passive bistatic radar processing* · **מתקדם** · 84 עמ' ספר · כ-6 שיעורים · דרישות: M2.24

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 764–847: כרך II, פרק 17

## חלק 3: EO/IR

### M3.1 EO/IR: מבוא, תלות באורך גל, תרחישים
*EO/IR introduction* · **ליבה** · 14 עמ' ספר · כ-1 שיעורים · דרישות: M0.2

- ★ Introduction to IR and EO Systems, עמ' PDF 16–29: פרק 1

### M3.2 מערכות לינאריות, PSF, MTF ודגימה
*LSI systems, PSF, MTF* · **ליבה** · 28 עמ' ספר · כ-2 שיעורים · דרישות: M0.3

- ★ Introduction to IR and EO Systems, עמ' PDF 60–87: פרק 3

### M3.3 עקיפה ואופטיקה
*Diffraction and optics* · **ליבה** · 111 עמ' ספר · כ-7 שיעורים · דרישות: M3.2

- ★ Introduction to IR and EO Systems, עמ' PDF 97–131: 4.3–4.9: עקיפה, PSF ו-MTF של עדשה
- ★ Introduction to IR and EO Systems, עמ' PDF 204–279: פרק 7: אופטיקה

### M3.4 רדיומטריה, מטרות ורקעים
*Radiometry, targets and backgrounds* · **ליבה** · 46 עמ' ספר · כ-3 שיעורים · דרישות: M3.1

- ★ Introduction to IR and EO Systems, עמ' PDF 132–177: פרק 5

### M3.5 אטמוספירה
*Atmospherics* · **ליבה** · 26 עמ' ספר · כ-2 שיעורים · דרישות: M3.4

- ★ Introduction to IR and EO Systems, עמ' PDF 178–203: פרק 6

### M3.6 גלאים
*Detectors* · **ליבה** · 44 עמ' ספר · כ-3 שיעורים · דרישות: M3.4

- ★ Introduction to IR and EO Systems, עמ' PDF 280–323: פרק 8

### M3.7 אלקטרוניקה, NUC ו-ROIC
*Electronics* · **מתקדם** · 24 עמ' ספר · כ-2 שיעורים · דרישות: M3.6

- ★ Introduction to IR and EO Systems, עמ' PDF 324–347: פרק 9

### M3.8 עיבוד תמונה, מיזוג, תפיסה אנושית ו-ATR
*Image processing, perception, ATR* · **מתקדם** · 41 עמ' ספר · כ-3 שיעורים · דרישות: M3.2

- ★ Introduction to IR and EO Systems, עמ' PDF 348–369: פרק 10
- ★ Introduction to IR and EO Systems, עמ' PDF 380–388: 11.7–11.10: העין ו-ATR
- ◇ Introduction to IR and EO Systems, עמ' PDF 370–379: 11.1–11.6: תצוגות

### M3.9 מודלי ביצועים: מג'ונסון ל-TTP
*Performance models, Johnson to TTP* · **ליבה** · 66 עמ' ספר · כ-4 שיעורים · דרישות: M3.2, M3.6

- ★ Introduction to IR and EO Systems, עמ' PDF 389–412: פרק 12
- ★ Introduction to IR and EO Systems, עמ' PDF 413–454: פרק 13
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 141–148: 7.3: חוקי הגילוי

### M3.10 ביצועי מערכת ורכישת מטרה
*System performance and target acquisition* · **ליבה** · 87 עמ' ספר · כ-6 שיעורים · דרישות: M3.9

- ★ Introduction to IR and EO Systems, עמ' PDF 455–508: פרק 14: NETD, MRTD, N50/V50, NIIRS
- ★ Principles of Naval Weapons Systems, עמ' PDF 159–176: פרק 14: FOV, רזולוציה, IRST, מד טווח לייזר
- ★ Military Avionics Systems, עמ' PDF 213–227: 5.4–5.5: הדמיה ועקיבה IR במטוס
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 137–150: 7.1–7.4: חיפוש ורוחב סריקה

### M3.11 תורת החיפוש
*Search theory* · **ליבה** · 58 עמ' ספר · כ-4 שיעורים · דרישות: M3.10, M0.4

- ★ Introduction to IR and EO Systems, עמ' PDF 509–560: פרק 15
- ◇ Introduction to UAV Systems, עמ' PDF 263–268: 10.4: תהליך החיפוש
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 137–164: פרק 7: חיפוש
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 282–303: פרק 10: גילוי מטרה

### M3.12 גילוי מטרות היפרספקטרלי
*Hyperspectral detection* · **מתקדם** · 38 עמ' מאמרים · כ-3 שיעורים · דרישות: M3.4, M2.10

- 📄 Manolakis, Marden, Shaw, Hyperspectral Target Detection, LL Journal (2003) (כולו)

### M3.13 לייזרים, ראיית לילה וסימון מטרות
*Lasers, night vision, designation* · **ליבה** · 39 עמ' ספר · כ-3 שיעורים · דרישות: M3.1

- ★ Military Avionics Systems, עמ' PDF 208–212: 5.2–5.3: טלוויזיה ו-NVG
- ★ Military Avionics Systems, עמ' PDF 228–250: 5.6–5.7: לייזרים ומערכות משולבות
- ★ EW 102, עמ' PDF 107–117: 4.4–4.6: סורקים, ראיית לילה, סימון לייזר

### M3.14 מדידות מעבדה של מצלמות IR
*Lab measurements* · **עיון** · 12 עמ' ספר · כ-1 שיעורים

- ★ Introduction to IR and EO Systems, עמ' PDF 561–572: פרק 16

### M3.15 חתימות IR ורב-ספקטרליות
*IR and multispectral signatures* · **מתקדם** · 81 עמ' ספר · כ-5 שיעורים · דרישות: M3.4, M3.10

- ★ Introduction to IR and EO Systems, עמ' PDF 133–173: פרק 5: מקורות קרינה, מטרות ורקעים ב-IR וב-EO, ניגודיות
- ★ Introduction to IR and EO Systems, עמ' PDF 178–200: פרק 6: אטמוספרה: העברה, בליעה, פיזור, path radiance
- ★ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 494–502: 4.3.2.2–4.3.2.4: חתימת IR, חזותית ושמיעתית
- ★ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 590–597: 4.4.4.2–4.4.4.5: הקטנת חתימת IR, חזותית, שמיעתית ואחרות

## חלק 4: לוחמה אלקטרונית

### M4.1 EW: מבוא, הגדרות ואיומים
*EW overview and threats* · **ליבה** · 45 עמ' ספר · כ-3 שיעורים · דרישות: M2.1

- ★ EW 101, עמ' PDF 23–28: פרק 1
- ★ EW 102, עמ' PDF 18–49: פרקים 1–2: איומים, תחומי תדר, שיטות הנחיה, סריקה ואפנון
- ◇ Military Avionics Systems, עמ' PDF 251–254: 6.1
- ◇ Military Avionics Systems, עמ' PDF 53–55: 1.8: תפקיד ה-EW
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 277–305: 3.2: איום ההגנה האווירית
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 398–418: 3.7: מבצעי האיום

### M4.2 מקלטי EW
*EW receivers* · **ליבה** · 13 עמ' ספר · כ-1 שיעורים · דרישות: M1.4, M1.6

- ★ EW 101, עמ' PDF 71–83: 4.1–4.10: וידאו גבישי, IFM, סופרהטרודין, ערוצי, ברג, דחיסה, ספרתי

### M4.3 עיבוד EW: מדידת פרמטרים, הפרדת פולסים וזיהוי איום
*EW processing* · **ליבה** · 13 עמ' ספר + 73 עמ' מאמרים · כ-1 שיעורים · דרישות: M4.2

- ★ EW 101, עמ' PDF 95–107: 5.1–5.3
- 📄 Qu et al., Radar Signal Deinterleaving review (2025) (כולו): סקירת אלגוריתמי הפרדת פולסים
- 📄 O'Shea, Roy, Clancy, Over-the-Air DL Signal Classification (2018) (כולו): זיהוי אפנון בלמידה עמוקה
- 📄 Hiles & Ahmad, ML Framework for RF Fingerprinting (2025) (כולו): זיהוי משדר ספציפי

### M4.4 אסטרטגיות חיפוש ו-look-through
*Search strategies* · **ליבה** · 20 עמ' ספר · כ-1 שיעורים · דרישות: M4.2

- ★ EW 101, עמ' PDF 125–144: פרק 6
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 150–157: 7.5: חלוקה אופטימלית של מאמץ חיפוש

### M4.5 SIGINT ו-ESM
*SIGINT and ESM* · **ליבה** · 8 עמ' ספר · כ-1 שיעורים · דרישות: M4.3

- ★ Military Avionics Systems, עמ' PDF 255–262: 6.2–6.3

### M4.6 איכון משדרים: גאומטריה, דיוק, AOA, אינטרפרומטר, דופלר, TDOA/FDOA
*Emitter location* · **ליבה** · 70 עמ' ספר · כ-5 שיעורים · דרישות: M0.8, M4.2, M0.6

- ★ EW 101, עמ' PDF 165–198: פרק 8
- ★ EW 102, עמ' PDF 172–207: פרק 6: דיוק מערכות איכון

### M4.7 שיבוש: J/S, burn-through ושיבוש כיסוי
*Jamming fundamentals* · **ליבה** · 19 עמ' ספר · כ-1 שיעורים · דרישות: M2.2, M1.4

- ★ EW 101, עמ' PDF 199–217: 9.1–9.4
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 569–579: 4.4.3: משבשי רעש והטעיה כאמצעי שרידות

### M4.8 שיבוש הטעיה: RGPO, VGPO, inverse gain, AGC, Cross-eye, DRFM
*Deceptive jamming* · **ליבה** · 27 עמ' ספר + 78 עמ' מאמרים · כ-2 שיעורים · דרישות: M4.7, M2.14, M2.15, M2.12

- ★ EW 101, עמ' PDF 218–244: 9.5–9.9
- 📄 du Plessis, Retrodirective Cross-Eye Jamming, PhD (2010), עמ' PDF 6–39: Cross-eye, פרקים 1–3: מבוא, רקע ומודל המונופולס
- 📄 du Plessis, Retrodirective Cross-Eye Jamming, PhD (2010), עמ' PDF 97–99: Cross-eye, פרק 7: מסקנות
- ▫ du Plessis, Retrodirective Cross-Eye Jamming, PhD (2010), עמ' PDF 1–5: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ du Plessis, Retrodirective Cross-Eye Jamming, PhD (2010), עמ' PDF 40–96: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ du Plessis, Retrodirective Cross-Eye Jamming, PhD (2010), עמ' PDF 100–112: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- 📄 Nityananda, Spurs in DRFM and Applications of DRFM, NPS (1993), עמ' PDF 10–35: DRFM, פרקים I–III.C: מבנה ה-DRFM, דגימה וכימות, הרמוניות מהכמת
- 📄 Nityananda, Spurs in DRFM and Applications of DRFM, NPS (1993), עמ' PDF 50–64: DRFM, פרקים IV–V: יישומים (RGS, VGS, מטרות שווא), מפרטים ומסקנות
- ▫ Nityananda, Spurs in DRFM and Applications of DRFM, NPS (1993), עמ' PDF 1–9: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Nityananda, Spurs in DRFM and Applications of DRFM, NPS (1993), עמ' PDF 36–49: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Nityananda, Spurs in DRFM and Applications of DRFM, NPS (1993), עמ' PDF 65–115: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)

### M4.9 פיתיונות
*Decoys* · **ליבה** · 18 עמ' ספר · כ-1 שיעורים · דרישות: M4.7, M2.4

- ★ EW 101, עמ' PDF 245–249: 10.1
- ★ EW 101, עמ' PDF 252–264: 10.3–10.7
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 597–607: 4.4.5: אמצעים מתכלים

### M4.10 אמצעי נגד ב-IR והגנה עצמית
*IR countermeasures and defensive aids* · **ליבה** · 29 עמ' ספר + 29 עמ' מאמרים · כ-2 שיעורים · דרישות: M3.10, M4.7, M6.6

- ★ EW 102, עמ' PDF 99–106: 4.2–4.3: טילי IR וסורקי קו
- ★ EW 102, עמ' PDF 118–123: 4.7: אמצעי נגד IR
- ★ Military Avionics Systems, עמ' PDF 269–278: 6.5: מערכות הגנה עצמית
- 📄 Chang, The IR Missile (Spin-Scan and Con-Scan Seekers) Countermeasures, NPS (1994), עמ' PDF 10–37: פרקים I–IV ותחילת V: חתימת IR של מטוס, מערכת הטיל, מטרת שווא, ניתוח ראש ביות Spin-scan מול נור ומשבש IR
- 📄 Chang, The IR Missile (Spin-Scan and Con-Scan Seekers) Countermeasures, NPS (1994), עמ' PDF 75: פרק VII: מסקנות
- ▫ Chang, The IR Missile (Spin-Scan and Con-Scan Seekers) Countermeasures, NPS (1994), עמ' PDF 1–9: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Chang, The IR Missile (Spin-Scan and Con-Scan Seekers) Countermeasures, NPS (1994), עמ' PDF 38–74: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Chang, The IR Missile (Spin-Scan and Con-Scan Seekers) Countermeasures, NPS (1994), עמ' PDF 76–81: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ◇ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 561–565: 4.4.1–4.4.3: התרעת איום ומשבשים (Ball)
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 566–568: 4.4.2: התרעת איום
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 597–607: 4.4.5: אמצעים מתכלים

### M4.11 אותות LPI ול"א בתקשורת
*LPI signals and communications EW* · **ליבה** · 42 עמ' ספר · כ-3 שיעורים · דרישות: M0.5, M4.7

- ★ EW 101, עמ' PDF 145–164: פרק 7: קפיצת תדר, צ'ירפ, DSSS, שיבוש חלקי
- ★ EW 102, עמ' PDF 150–171: 5.7–5.10: פריסת ספקטרום, שיבוש תקשורת ואיכון

### M4.12 קשרי לוויין ושיבושם
*Satellite links and their jamming* · **ליבה** · 28 עמ' ספר · כ-2 שיעורים · דרישות: M1.4, M4.7, M13.10

- ★ EW 102, עמ' PDF 208–235: פרק 7

### M4.13 ממשק מפעיל ותצוגות EW
*EW operator interface* · **עיון** · 17 עמ' ספר · כ-1 שיעורים

- ★ EW 101, עמ' PDF 108–124: 5.4–5.6

### M4.14 סימולציה ואמולציה של EW
*EW simulation* · **מתקדם** · 36 עמ' ספר · כ-2 שיעורים · דרישות: M4.7, M4.8

- ★ EW 101, עמ' PDF 265–300: פרק 11 (ה-PDF נגמר בעמ' 278 המודפס)

### M4.15 מאגר תרגילים פתורים ב-EW
*EW problem bank* · **ליבה** · 40 עמ' ספר · כ-3 שיעורים

- ★ EW 102, עמ' PDF 236–275: נספחים A–B: בעיות עם פתרונות, והפניות ל-EW 101

### M4.16 הגנה אלקטרונית של המכ"ם (EP / ECCM)
*Electronic protection* · **ליבה** · 58 עמ' ספר · כ-4 שיעורים · דרישות: M4.8, M2.13, M2.30

- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 554–611: כרך II, פרק 12: התקפה, נוסחאות EW, הגנה באנטנה, במשדר, במעורר, במקלט, במעבד

## חלק 5: ניווט ו-GNSS

### M5.1 יסודות ניווט לווייני: TOA, מערכות צירים, מסלולים, זמן
*Satnav fundamentals* · **ליבה** · 70 עמ' ספר · כ-5 שיעורים · דרישות: M0.6, M0.8

- ★ Understanding GPS, עמ' PDF 37–82: פרק 2
- ◇ Understanding GPS, עמ' PDF 17–36: פרק 1: היסטוריה וסקירה
- ◇ Understanding GPS, עמ' PDF 666: 12.5: העברת זמן
- ◇ Understanding GPS, עמ' PDF 670–672: 12.9: יישומים ממשלתיים וצבאיים

### M5.3 אותות הלוויין
*Satellite signals* · **ליבה** · 40 עמ' ספר · כ-3 שיעורים · דרישות: M5.1, M0.5

- ★ Understanding GPS, עמ' PDF 129–168: פרק 4

### M5.4 המקלט: רכישה ולולאות עקיבה
*Acquisition and tracking loops* · **ליבה** · 90 עמ' ספר · כ-6 שיעורים · דרישות: M5.3, M0.7, M0.3

- ★ Understanding GPS, עמ' PDF 169–246: 5.1–5.8
- ◇ Understanding GPS, עמ' PDF 247–258: 5.9–5.14

### M5.6 ביצועים: שגיאות, DOP, שערוך PVT ואמינות
*Stand-alone performance* · **ליבה** · 109 עמ' ספר · כ-7 שיעורים · דרישות: M5.4

- ★ Understanding GPS, עמ' PDF 317–394: פרק 7
- ◇ Understanding GPS, עמ' PDF 681–684: נספח B: יציבות מקורות תדר (שעונים)
- ★ Riley, Handbook of Frequency Stability Analysis, NIST SP 1065 (2008), עמ' PDF 11–17: Riley 1–3: יציבות תדר, מודל הרעש, רעשי חוק-חזקה ומדדי יציבות
- ★ Riley, Handbook of Frequency Stability Analysis, NIST SP 1065 (2008), עמ' PDF 19–31: Riley 5.1–5.2.10: גרף σ-τ, Allan, Allan חופף, modified Allan, time variance, Hadamard
- ★ Riley, Handbook of Frequency Stability Analysis, NIST SP 1065 (2008), עמ' PDF 47–48: Riley 5.3: רווחי סמך
- ★ Riley, Handbook of Frequency Stability Analysis, NIST SP 1065 (2008), עמ' PDF 53–57: Riley 5.5: זיהוי סוג הרעש

### M5.8 ניווט אינרציאלי ושילוב עם GPS
*INS and integration* · **ליבה** · 125 עמ' ספר · כ-8 שיעורים · דרישות: M5.6, M2.15

- ★ Understanding GPS, עמ' PDF 475–506: 9.1–9.2
- ★ Woodman, An Introduction to Inertial Navigation, Cambridge TR-696 (2007), עמ' PDF 3–37: Woodman: IMU, שגיאות ג'ירו ומד-תאוצה, Allan deviation, ניווט strapdown, התפשטות שגיאה וסימולציה (במקום Groves 4.4, 5)
- ★ ESA TM-23, GNSS Data Processing, Vol. I: Fundamentals and Algorithms (2013), עמ' PDF 51–61: ESA 3.1: מערכות זמן ומערכות ייחוס (במקום Groves 2.2–2.3)
- ★ ESA TM-23, GNSS Data Processing, Vol. I: Fundamentals and Algorithms (2013), עמ' PDF 185–200: ESA נספחים A.2 ו-B: מערכות קואורדינטות והמרות ביניהן
- ★ Military Avionics Systems, עמ' PDF 332–346: 8.8–8.9
- ◇ Missile Guidance and Control Systems, עמ' PDF 558–565: 7.3: ניתוח שגיאות ניווט של טיל שיוט
- ◇ Military Avionics Systems, עמ' PDF 324–331: 8.7: עזרי ניווט: TACAN, VOR/DME, ILS

### M5.11 ניווט בלי GPS: TERCOM ואותות הזדמנות
*Alt-PNT* · **ליבה** · 25 עמ' ספר + 4 עמ' מאמרים · כ-2 שיעורים · דרישות: M5.8

- ★ Missile Guidance and Control Systems, עמ' PDF 566–590: 7.4: TERCOM
- 📄 Khalife, Neinavaie, Kassas, Starlink Carrier Phase Positioning (כולו): ניווט מאותות Starlink

### M5.13 ניווט משולב בסביבה מוכחשת-GPS: INS הדוק, VIO, TERCOM/DSMAC ו-Factor Graphs
*GPS-denied integrated navigation: tight INS, VIO, TERCOM/DSMAC, factor graphs* · **ליבה** · 368 עמ' ספר · כ-25 שיעורים · דרישות: M5.8, M5.11

- ★ Military Avionics Systems, עמ' PDF 303–314: 8.1–8.5: עקרונות ניווט, ניווט רדיו, יסודות אינרציאלי, ניווט לווייני, ניווט משולב
- ★ Military Avionics Systems, עמ' PDF 332–347: 8.8–8.9: ניווט אינרציאלי ו-GNSS כולל integrity
- ★ Woodman, An Introduction to Inertial Navigation, Cambridge TR-696 (2007), עמ' PDF 8–27: 3–6: חיישנים ושגיאותיהם, Allan variance, ניווט strapdown והתפשטות שגיאה
- ★ Woodman, An Introduction to Inertial Navigation, Cambridge TR-696 (2007), עמ' PDF 33–34: 8: הקטנת סחיפה: היתוך עם מיקום מוחלט ומגנטומטרים, הנחות תחום (ZUPT)
- ★ On-Manifold Preintegration for Real-Time Visual-Inertial Odometry, עמ' PDF 1–21: כולו: preintegration של IMU על manifold, factor graph ל-VIO
- ★ Absolute Positioning Using the Earth's Magnetic Anomaly Field (PhD dissertation), עמ' PDF 21–173: פרקים 1–4: מבוא וסקירת ספרות, רקע (שדה מגנטי, מפות, חיישנים, RBPF), תכנון המסנן, תוצאות ניסויי טיסה
- ★ Factor Graphs for Robot Perception, עמ' PDF 1–144: כולו: גרפי גורמים והחלקה לניווט רב-חיישנים

### M5.2 מקטעי המערכת
*System segments* · **מתקדם** · 46 עמ' ספר · כ-3 שיעורים · דרישות: M5.1

- ★ Understanding GPS, עמ' PDF 83–128: פרק 3

### M5.5 שיבוש, התחזות, רב-נתיביות ונצנוץ
*Interference, spoofing, multipath* · **ליבה** · 58 עמ' ספר + 22 עמ' מאמרים · כ-4 שיעורים · דרישות: M5.4, M4.7

- ★ Understanding GPS, עמ' PDF 259–316: פרק 6
- 📄 Humphreys et al., Assessing the Spoofing Threat (2008) (כולו): בניית מתחזה
- 📄 Liu, Lo, Walter, GNSS Interference Localization Using ADS-B (2022) (כולו): איכון משבש מנתוני ADS-B

### M5.7 GPS דיפרנציאלי
*Differential GPS* · **מתקדם** · 80 עמ' ספר · כ-5 שיעורים · דרישות: M5.6

- ★ Understanding GPS, עמ' PDF 395–474: פרק 8

### M5.9 מערכות GNSS אחרות: Galileo, GLONASS, BeiDou
*Other GNSS* · **מתקדם** · 26 עמ' ספר · כ-2 שיעורים · דרישות: M5.3

- ★ Understanding GPS, עמ' PDF 575–576: 10.1–10.2: יעדי Galileo ושירותיו
- ★ Understanding GPS, עמ' PDF 579–586: 10.3: תדרים, אותות ואפנון
- ★ Understanding GPS, עמ' PDF 593–597: 10.4–10.5: תאימות GPS-Galileo ומקטע החלל
- ★ Understanding GPS, עמ' PDF 613–614: 11.1.4: קונסטלציית GLONASS ומסלוליה
- ★ Understanding GPS, עמ' PDF 622–628: 11.1.9–11.1.10: אותות GLONASS ודיוק
- ★ Understanding GPS, עמ' PDF 633–634: 11.2.5–11.2.7: BeiDou: קונסטלציה ומסלולים

### M5.10 שילוב חיישנים בכלי יבשתי וסיוע רשת
*Land-vehicle sensor integration and network assistance* · **מתקדם** · 68 עמ' ספר · כ-5 שיעורים · דרישות: M5.8

- ★ Understanding GPS, עמ' PDF 507–574: 9.3–9.4: חישוב מיקום מצטבר, התאמה למפה, A-GPS

### M5.12 עיבוד נתוני GNSS (ESA TM-23): מודלי מדידה, פתרון משוואות הניווט ומעבדת gLAB
*GNSS data processing (ESA TM-23): measurement models, navigation solution, gLAB laboratory (reference)* · **עיון** · 499 עמ' ספר · כ-33 שיעורים

- ★ ESA TM-23, GNSS Data Processing, Vol. I: Fundamentals and Algorithms (2013), עמ' PDF 11–50: כרך I, 1–2: ארכיטקטורת GNSS
- ★ ESA TM-23, GNSS Data Processing, Vol. I: Fundamentals and Algorithms (2013), עמ' PDF 62–184: כרך I, 3.2–6 ו-A.1: מסלולים, מדידות ועיבוד מקדים, מודלים של מדידה (אטמוספרה, שעונים), פתרון משוואות הניווט, מערכות זמן
- ★ ESA TM-23, GNSS Data Processing, Vol. I: Fundamentals and Algorithms (2013), עמ' PDF 201–214: כרך I, נספחים C–F
- ★ ESA TM-23, GNSS Data Processing, Vol. II: Laboratory Exercises (2013), עמ' PDF 9–330: כרך II: תרגילי מעבדה ב-gLAB עם נתוני IGS: מסלולים ושעונים, ניתוח מדידות, מודלים ומיקום

### M5.14 ניווט באותות הזדמנות ושעונים אטומיים ניידים
*Signals of opportunity (LEO PNT, cellular, celestial) and portable atomic clocks* · **ליבה** · 488 עמ' ספר · כ-33 שיעורים · דרישות: M5.6, M5.11

- ★ Khalife, Neinavaie, Kassas, Starlink Carrier Phase Positioning, עמ' PDF 1–4: כל המאמר: מיקום מפאזת הגל הנושא של Starlink
- ★ Riley, Handbook of Frequency Stability Analysis, NIST SP 1065 (2008), עמ' PDF 11–31: 1–5.2.10: יציבות תדר, מודל רעש, Allan ווריאנסים נגזרים, חיזוי שגיאת זמן (holdover)
- ★ Riley, Handbook of Frequency Stability Analysis, NIST SP 1065 (2008), עמ' PDF 43–46: 5.2.17–5.2.20: MTIE, TIE rms, jitter
- ★ Riley, Handbook of Frequency Stability Analysis, NIST SP 1065 (2008), עמ' PDF 66–67: 5.18–5.19: היסט וסחיפת תדר
- ★ Complementary PNT and GPS Backup Technologies Demonstration Report (Sections 1 through 10), עמ' PDF 1–457: סעיפים 1–10 (כל הקובץ): רקע ואיומים על GPS, מבנה ההדגמה, ספקים וטכנולוגיות (LEO, סלולר, eLoran, שעונים, כוכבים), תרחישי מיקום וזמן, תוצאות

## חלק 6: טילים: דינמיקה, הנחיה ובקרה

### M6.1 מערכות צירים ומשוואות תנועה של גוף קשיח
*Equations of motion* · **ליבה** · 52 עמ' ספר · כ-3 שיעורים · דרישות: M0.6

- ★ Missile Guidance and Control Systems, עמ' PDF 16–29: פרק 1
- ★ Missile Guidance and Control Systems, עמ' PDF 30–67: פרק 2

### M6.3 שלבי ההנחיה ושיטות יירוט
*Guidance phases and intercept techniques* · **ליבה** · 30 עמ' ספר · כ-2 שיעורים · דרישות: M6.1

- ★ Missile Guidance and Control Systems, עמ' PDF 170–188: 4.1–4.2
- ★ Principles of Naval Weapons Systems, עמ' PDF 235–242: פרק 19
- ◇ EW 102, עמ' PDF 32–34: 2.3: שיטות הנחיה של איומים
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 21–51: פרק 2: ירי בלי משוב, SSKP ממרחק החטאה
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 339–358: 3.5: תהליכי נזק ואפקטים סופיים

### M6.4 ניווט יחסי (PN), APN ו-PN תלת-ממדי
*Proportional navigation* · **ליבה** · 107 עמ' ספר · כ-7 שיעורים · דרישות: M6.3

- ★ Missile Guidance and Control Systems, עמ' PDF 189–249: 4.3–4.7
- ◇ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 27–48: Zarchan 2: יסודות ההנחיה הטקטית: סימולציית PN, לינאריזציה, פתרונות סגורים ו-ZEM
- ★ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 49–72: Zarchan 3: שיטת ה-adjoint ולולאת הביות: קבוע זמן של מערכת ההנחיה, מרחק החטאה בצורה סגורה, נרמול
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 21–39: 2.2–2.3: הסתברות השמדה מיריה אחת ומכמה יריות

### M6.5 הנחיה אופטימלית, הנחיה משותפת ושלב הסיום
*Optimal guidance and end game* · **ליבה** · 87 עמ' ספר + 15 עמ' מאמרים · כ-6 שיעורים · דרישות: M6.4

- ★ Missile Guidance and Control Systems, עמ' PDF 250–283: 4.8–4.9
- 📄 Zhu, Wang, Lin, Consensus-Based Impact-Time-Control Guidance (2017) (כולו): הנחיה לשליטה בזמן פגיעה
- ◇ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 73–102: Zarchan 4: ניתוח רעש: adjoint סטוכסטי ומרחק החטאה מתמרון אקראי
- ◇ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 175–197: Zarchan 8: חוקי הנחיה מתקדמים: APN והנחיה אופטימלית

### M6.6 ראשי ביות ומודל מערכת ההנחיה
*Seekers and guidance system model* · **ליבה** · 37 עמ' ספר · כ-2 שיעורים · דרישות: M6.4, M2.14

- ★ Missile Guidance and Control Systems, עמ' PDF 114–143: 3.4
- ★ Air and Missile Defense Systems Engineering, עמ' PDF 257–263: 9.3: מקורות רעש בראש ביות: ברק (glint), כיפה

### M6.7 מסירת חימוש: בעיית ההפצצה, דיוק ומעטפת שיגור
*Weapon delivery* · **ליבה** · 106 עמ' ספר · כ-7 שיעורים · דרישות: M6.1, M11.1, M11.4

- ★ Missile Guidance and Control Systems, עמ' PDF 284–379: פרק 5
- ★ Military Avionics Systems, עמ' PDF 356: 9.1: מבוא לנשיאת חימוש
- ★ Military Avionics Systems, עמ' PDF 391–399: 9.8–9.10: ממשק החימוש MIL-STD-1760, טילי אוויר-אוויר וחימוש אוויר-קרקע
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 32–41: פרק 2: נתוני ביצועי נשק, פיזור וטעות שיטתית
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 55–62: 3.7: CEP והשמדת מטרה נקודתית

### M6.8 טילים בליסטיים: שני גופים, למברט, כניסה חוזרת
*Ballistic missiles* · **ליבה** · 139 עמ' ספר · כ-9 שיעורים · דרישות: M6.1, M13.4, M13.12

- ★ Missile Guidance and Control Systems, עמ' PDF 380–518: 6.1–6.8
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 164–185: 6.1–6.3: הגנה בשכבות, MIRV ותורת המשחקים ב-ABM

### M6.2 אווירודינמיקה, מודל הטיל וטייס אוטומטי
*Aerodynamics, missile model, autopilots* · **ליבה** · 72 עמ' ספר · כ-5 שיעורים · דרישות: M6.1, M0.7

- ★ Missile Guidance and Control Systems, עמ' PDF 68–113: 3.1–3.3
- ★ Missile Guidance and Control Systems, עמ' PDF 144–169: 3.5–3.6: טייסים אוטומטיים

### M6.9 דואה היפרסונית
*Hypersonic boost-glide* · **ליבה** · 29 עמ' מאמרים · כ-2 שיעורים · דרישות: M6.8

- 📄 Acton, Hypersonic Boost-Glide Weapons, SGS (2015) (כולו)

### M6.10 טילי שיוט
*Cruise missiles* · **ליבה** · 35 עמ' ספר · כ-2 שיעורים · דרישות: M6.2, M5.8

- ★ Missile Guidance and Control Systems, עמ' PDF 536–557: 7.1–7.2
- ◇ Missile Guidance and Control Systems, עמ' PDF 591–603: 7.5: GPS בטיל שיוט
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 186–197: 6.4–6.5: נתיבי חדירה אופטימליים ופונקציית איום
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 70–83: פרק 4: הגנת מטרה

### M6.11 נספחי Siouris: קבועים, אטמוספירה, סיווג ומאגר טילים
*Siouris appendices* · **עיון** · 66 עמ' ספר · כ-4 שיעורים

- ★ Missile Guidance and Control Systems, עמ' PDF 604–665: נספחים A–F
- ★ Missile Guidance and Control Systems, עמ' PDF 674–677: נספחים H–I

### M6.12 תכן מושגי של טיל טקטי (Fleeman): גורמי תכן, קביעת ממדים, פשרות הנעה, חימום וכיפות, עלות
*Tactical missile conceptual design (Fleeman B13): drivers, sizing, propulsion trades, heating and domes, cost* · **ליבה** · 218 עמ' ספר · כ-15 שיעורים · דרישות: M6.2, M6.4

- ★ Fleeman, Tactical Missile Design (2001), עמ' PDF 19–236: פרקים 1–7 (סריקה בתמונות: נדרש OCR)

### M6.13 תכן טילים טקטיים: הפרקים המתקדמים (Fleeman פרקים 8–9)
*Tactical missile design, advanced chapters (Fleeman ch.8-9)* · **מתקדם** · 50 עמ' ספר · כ-3 שיעורים · דרישות: M6.12

- ★ Fleeman, Tactical Missile Design (2001), עמ' PDF 237–262: פרקים 8–9
- ◇ Fleeman, Tactical Missile Design (2001), עמ' PDF 263–286: נספחים: תרגילים, מקרי תכן וטבלאות

### M6.15 הנעת טילים: מנוע רקטי מוצק, ראמג'ט וסקרמג'ט
*Missile propulsion: solid motors, ramjet, scramjet* · **ליבה** · 248 עמ' ספר · כ-17 שיעורים · דרישות: M6.2, M6.12

- ★ E39, עמ' PDF 168–176: 5.3: הרמג'ט
- ★ E39, עמ' PDF 270–277: 6.5–6.6: תאי בעירה של רמג'ט ובעירה על-קולית (סקרמג'ט)
- ★ E39, עמ' PDF 526–571: פרק 11: תאי דחף של רקטות כימיות: ביצועים, נחירים, מעבר חום
- ★ E39, עמ' PDF 582–620: פרק 12: בעירה ברקטות כימיות: הנעה נוזלית ומוצקה, תאי בעירה מוצקים, אי-יציבות בעירה
- ★ Fleeman, Tactical Missile Design (2001), עמ' PDF 78–107: פרק 3: שיקולי הנעה: חלופות, רמג'ט (Isp, דחף, מבוא, booster), מנוע מוצק: גרעין, בקרת דחף, חומרי הנעה, מעטפת, נחיר
- ★ NASA SP-8076, Solid Propellant Grain Design and Internal Ballistics, עמ' PDF 1–116: כולו (סריקה; הרלוונטי במיוחד: burn rate, grain geometry, chamber pressure, internal ballistics)

### M6.16 איומים היפרסוניים וההגנה מפניהם
*Hypersonic threats and their defense* · **ליבה** · 98 עמ' ספר · כ-7 שיעורים · דרישות: M6.9, M7.6, M2.29

- ★ Acton, Hypersonic Boost-Glide Weapons, SGS (2015), עמ' PDF 1–25: כל המאמר: מודל דאייה, ניסויי HTV-2, השלכות להגנה ויציבות אסטרטגית (בלי הערות ומקורות)
- ★ Modeling the Performance of Hypersonic Boost-Glide Missiles, עמ' PDF 1–36: כולו
- ★ Hypersonic Weapons: Background and Issues for Congress (R45811), עמ' PDF 1–37: הדוח כולו

### M6.14 Zarchan: שאר הפרקים: קווריאנס וקלמן בלולאת הביות, הנחיה אסטרטגית, בקרת טיסה ויירוט בשלב ההאצה
*Zarchan: remaining chapters (reference)* · **עיון** · 869 עמ' ספר · כ-58 שיעורים

- ★ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 16–26: פרק 1: שיטות נומריות
- ★ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 103–174: פרקים 5–7: ניתוח קווריאנס, PN ומרחק החטאה, מסנני fading memory
- ★ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 198–332: פרקים 9–14: קלמן בלולאת הביות, אזורים טקטיים, שיקולים אסטרטגיים, מאיצים, הנחיית Lambert, יירוטים אסטרטגיים
- ★ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 333–501: פרקים 15–21: מטרה בליסטית, EKF ושערוך מקדם בליסטי, מטרות מרובות ומתנודדות, גוף הטיל כפונקציית תמסורת
- ★ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 502–775: פרקים 22–29: תכן בקרת טיסה, טייס אוטומטי תלת-לולאתי, עיצוב מסלול, סינון מטרות מתנודדות, adjoint מתקדם
- ★ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 776–942: פרקים 30–34: משחק דיפרנציאלי מול הנחיה אופטימלית, קינמטיקה של יירוט מטרה בליסטית, סינון ותכן KV בשלב ההאצה
- ★ Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012), עמ' PDF 943–983: נספח: דוגמאות נוספות

## חלק 7: הגנה אווירית ומפני טילים, ושו"ב

### M7.1 בעיית ההגנה מפני טילים ומדדי האפקטיביות
*The AMD problem and MOEs* · **ליבה** · 64 עמ' ספר · כ-4 שיעורים · דרישות: M2.2, M6.4

- ★ Air and Missile Defense Systems Engineering, עמ' PDF 22–23: פרק 1
- ★ Air and Missile Defense Systems Engineering, עמ' PDF 44–69: פרקים 3–4: הסביבה, זמן תגובה, עוצמת אש, עמידות לחדירה
- ◇ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 164–185: 6.1–6.3: הגנה בשכבות, Pk מצטבר (Przemieniecki)
- ◇ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 206–219: פרק 7: הגנה מפני טילים בזירה, הסתברות חדירה
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 70–83: פרק 4: הגנת מטרה
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 12–15: מבוא: לוגיסטיקה כגבול של כל תוכנית

### M7.2 דרישות מערכת: CONOPS, ארכיטקטורה, חיישנים ומערך יירוט
*AMD system requirements* · **ליבה** · 44 עמ' ספר · כ-3 שיעורים · דרישות: M7.1

- ★ Air and Missile Defense Systems Engineering, עמ' PDF 70–113: פרק 5
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 8–20: פרק 1: סיווג מודלים וקיצורי דרך במידול
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 430–468: 3.9: ניתוח משימה-איום

### M7.3 תכנון מקדים: מרחב הקרב, ניתוח יירוט ותכנון המיירט
*Preliminary design* · **ליבה** · 132 עמ' ספר · כ-9 שיעורים · דרישות: M7.2, M6.6

- ★ Air and Missile Defense Systems Engineering, עמ' PDF 114–191: פרק 6
- ◇ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 142–163: 5.3–5.5: שחיקה סטוכסטית והקצאת shoot-look-shoot
- ◇ Washburn & Kress, Combat Modeling (2009), עמ' PDF 52–83: פרקים 3–4: ירי עם משוב, shoot-look-shoot, Pk של מטח
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 164–173: 6.1–6.2: הגנה בשכבות

### M7.4 ניתוחי פשרות והקצאת דרישות, מטחים, מלאי מיירטים ויחס עלויות
*Trades and allocation + raids, magazines and cost-exchange* · **ליבה** · 36 עמ' ספר · כ-2 שיעורים · דרישות: M7.3, M11.4, M14.1

- ★ Air and Missile Defense Systems Engineering, עמ' PDF 192–227: פרקים 7–8
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 304–319: פרק 11: שיטות אופטימיזציה
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 258–263: נספח B: אופטימיזציה
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 789–796: 6.3: ניתוחי פשרות לשיפור שרידות

### M7.5 הפיזיקה של תכנון AMD: טיסת מיירט וכדור הארץ
*Interceptor flight analysis* · **ליבה** · 18 עמ' ספר · כ-1 שיעורים · דרישות: M7.3, M6.1

- ★ Air and Missile Defense Systems Engineering, עמ' PDF 228–245: 9.1: מודל WGS-84 וניתוח טיסה

### M7.6 יירוט טילים בליסטיים ואמצעי נגד
*BMD intercept and countermeasures* · **ליבה** · 17 עמ' ספר + 245 עמ' מאמרים · כ-1 שיעורים · דרישות: M6.8, M7.1

- ★ Missile Guidance and Control Systems, עמ' PDF 519–535: 6.9
- 📄 Sessler et al., Countermeasures, UCS/MIT (2000), עמ' PDF 19–24: מטעים ואמצעי נגד: תקציר מנהלים
- 📄 Sessler et al., Countermeasures, UCS/MIT (2000), עמ' PDF 43–57: פרקים 3–4: ארכיטקטורת מערכת היירוט, רכיביה ודרישותיה
- 📄 Sessler et al., Countermeasures, UCS/MIT (2000), עמ' PDF 63–113: פרקים 6–9: סקירת אמצעי הנגד, תת-חימושים, בלוני מטעה ומעטפות מקוררות
- 📄 Sessler et al., Countermeasures, UCS/MIT (2000), עמ' PDF 143–167: נספחים A–D: התנהגות תרמית בחלל, מדידה והבחנה ב-IR ובמכ"ם, חתך מכ"ם
- ▫ Sessler et al., Countermeasures, UCS/MIT (2000), עמ' PDF 1–18: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Sessler et al., Countermeasures, UCS/MIT (2000), עמ' PDF 25–42: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Sessler et al., Countermeasures, UCS/MIT (2000), עמ' PDF 58–62: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Sessler et al., Countermeasures, UCS/MIT (2000), עמ' PDF 114–142: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Sessler et al., Countermeasures, UCS/MIT (2000), עמ' PDF 168–200: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- 📄 Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 22–38: יירוט בשלב ההאצה: תקציר מנהלים וממצאים
- 📄 Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 50–66: פרק 2: סקירת הניתוח (hit-to-kill ולייזר מוטס)
- 📄 Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 86–100: פרק 4: מאפייני ICBM, קווי זמן ההיתקלות והיתקלויות מישוריות
- 📄 Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 184–192: פרק 9: אמצעי נגד
- 📄 Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 196–285: פרקים 10–13: גילוי ועקיבה מהחלל ובמכ"ם, חיישני ה-KV, תצורות KV, חוקי הנחיה, Δv, שלב הסיום וקטלניות
- ▫ Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 1–21: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 39–49: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 67–85: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 101–183: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 193–195: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Barton et al., APS Study on Boost-Phase Intercept Systems (2004), עמ' PDF 286–463: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 77–83: 4.3: הגנת מטרות מרובות מול מתקפת ICBM
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 170–185: 6.2–6.3: MIRV ותורת המשחקים

### M7.7 מכ"ם להגנה מפני טילים בליסטיים
*Ballistic missile defense radar* · **ליבה** · 38 עמ' ספר · כ-3 שיעורים · דרישות: M7.6, M2.23

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 310–347: כרך III, פרק 7

### M7.8 מכ"ם התרעה מוקדמת קרקעי
*Ground-based early warning radar* · **ליבה** · 60 עמ' ספר · כ-4 שיעורים · דרישות: M7.1, M2.23

- ★ Principles of Modern Radar, Vol. III: Radar Applications, עמ' PDF 348–407: כרך III, פרק 8

### M7.9 Link 16, שו"ב ולוחמה מרושתת
*Link 16, C2 and networked warfare* · **ליבה** · 10 עמ' ספר + 103 עמ' מאמרים · כ-1 שיעורים · דרישות: M0.5, M4.11

- ★ Military Avionics Systems, עמ' PDF 295–302: 7.4–7.5: קישורי נתונים ולוחמה מרושתת
- 📄 SISO-STD-002-2021, Standard for Link 16 Simulation, עמ' PDF 12–28: התקן, פרקים 1–4.1: הגדרות ומאפייני ההפעלה של JTIDS: TDMA, משבצות זמן ושכבה פיזית
- ▫ SISO-STD-002-2021, Standard for Link 16 Simulation, עמ' PDF 1–11: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ SISO-STD-002-2021, Standard for Link 16 Simulation, עמ' PDF 29–90: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- 📄 Stinson, IP over Link-16, AFIT (2003), עמ' PDF 16–19: IP על גבי Link 16, פרק I: מבוא
- 📄 Stinson, IP over Link-16, AFIT (2003), עמ' PDF 36–43: 2.7: Link-16: TDMA, קצבים ואבטחה
- 📄 Stinson, IP over Link-16, AFIT (2003), עמ' PDF 60–73: 4.3–5: תפוקה והשהיה מול עומס, ומסקנות
- ▫ Stinson, IP over Link-16, AFIT (2003), עמ' PDF 1–15: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Stinson, IP over Link-16, AFIT (2003), עמ' PDF 20–35: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Stinson, IP over Link-16, AFIT (2003), עמ' PDF 44–59: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Stinson, IP over Link-16, AFIT (2003), עמ' PDF 74–87: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- 📄 Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 18–34: קרב אוויר עם Link 16 ובלעדיו: תקציר
- 📄 Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 58–75: פרקים 3–5: מאפייני הכוח, איכות המידע האורגני ודרגת הרישות
- 📄 Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 96–120: פרקים 9–11: מודעות, קבלת החלטות ומסקנות
- ▫ Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 1–17: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 35–57: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 76–95: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 121–145: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ◇ Principles of Naval Weapons Systems, עמ' PDF 135–136: רשתות עקיבה

### M7.10 הנדסת מערכות: מחזור החיים, ניסוי והערכה וראיות מניסויים
*Systems engineering lifecycle + T&E and test evidence* · **ליבה** · 20 עמ' ספר · כ-1 שיעורים

- ★ Air and Missile Defense Systems Engineering, עמ' PDF 24–43: פרק 2
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 252–281: פרק 9: אמינות, תחזוקתיות וזמינות מבצעית
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 156–197: 1.4–1.6: תכנון לשרידות, מידול וסימולציה, ניסויים
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 326–333: סיכום: לוגיסטיקה כאילוץ תכנון

### M7.11 מחזור המטרות המשותף כמודל תהליך: שלבים, זמני מחזור ומטרות רגישות לזמן
*The joint targeting cycle as a process model: phases, cycle time, time-sensitive targets* · **ליבה** · 36 עמ' ספר · כ-2 שיעורים · דרישות: M7.9

- ★ JP 3-60 Joint Targeting (2013), עמ' PDF 31–66: פרק II: ששת שלבי המחזור, F2T2EA בשלב 5, מטרות רגישות לזמן, והקשר בין מטרות לאפקטים. מודל JDL להתכת מידע (Liggins, Hall & Llinas) חסר: המורה מלמד אותו מהידע שלו, עם רמת ודאות

### M7.12 היתוך רב-חיישני ותמונת מצב משותפת
*Multisensor fusion and the common operating picture* · **ליבה** · 256 עמ' ספר · כ-17 שיעורים · דרישות: M2.29, M5.8

- ★ Design and Analysis of Modern Tracking Systems, עמ' PDF 361–471: פרק 8: Attribute data fusion: היתוך זהות (Bayes, Dempster-Shafer, evidential reasoning) ל-identity fusion
- ★ Design and Analysis of Modern Tracking Systems, עמ' PDF 472–536: פרק 9: Multiple sensor tracking: central/sensor-level, distributed, track-to-track association וקורלציית שגיאות
- ★ Design and Analysis of Modern Tracking Systems, עמ' PDF 537–611: פרק 10: System implementation: registration ו-bias estimation (10.5), angle-only ו-heterogeneous sensor fusion
- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 716–720: 15.3: עקיבה רב-חיישנית: ארכיטקטורות היתוך, היתוך מדידות ומסלולים

### M7.13 שו"ב וניהול קרב, אוטומציה של שרשרת האש וצוות אדם-מכונה
*C2 and battle management, kill-chain automation, human-machine teaming* · **ליבה** · 339 עמ' ספר · כ-23 שיעורים · דרישות: M7.11, M7.12

- ★ Air and Missile Defense Systems Engineering, עמ' PDF 71–78: 5.2–5.3: דרישות פונקציונליות של ארכיטקטורת ההגנה והקצאת פונקציות למערכות (BMC)
- ★ Air and Missile Defense Systems Engineering, עמ' PDF 118–127: 6.3–6.4: הערכת מרחב הקרב וניתוח היירוט
- ★ Understanding Command and Control, עמ' PDF 1–255: כולו
- ★ The Role of Autonomy in DoD Systems, עמ' PDF 31–77: פרק 3 (בעיות טכניות של אוטונומיה, עמ' 31-65) ופרק 4 (בעיות רכש, עמ' 66-77)
- ★ Joint All-Domain Command and Control: Background and Issues for Congress (R46725), עמ' PDF 1–19: כל הדו"ח: JADC2, ארכיטקטורת C2, בינה מלאכותית בהחלטות C2, סוגיות לקונגרס

### M7.14 ניסוי והערכה: סטטיסטיקה בפועל
*Test and evaluation: statistics in practice* · **ליבה** · 727 עמ' ספר · כ-48 שיעורים · דרישות: M7.10, M0.4

- ★ NIST/SEMATECH e-Handbook of Statistical Methods (chapters 5, 7, 8 only), עמ' PDF 1–442: פרק 5: DOE למבחן מבצעי, עמ' 28-141 ו-192-375 בעיקר
- ★ NIST/SEMATECH e-Handbook of Statistical Methods (chapters 5, 7, 8 only), עמ' PDF 599–808: פרק 8: אמינות, הדגמה וצמיחה
- ★ Statistics, Testing, and Defense Acquisition: New Approaches and Methodological Improvements, עמ' PDF 52–126: פרקים 3–6: פרדיגמה חדשה לבדיקה והערכה (52–70), שדרוג שיטות סטטיסטיות (71–82), תכנון בדיקות מבצעיות (83–110), ניתוח ודיווח תוצאות (111–126)

### M7.15 דיני לחימה, בדיקת חוקיות נשק, מדיניות אוטונומיה ופיקוח על יצוא
*Law of armed conflict, weapons review, autonomy policy, export control* · **ליבה** · 342 עמ' ספר · כ-23 שיעורים · דרישות: M7.13

- ★ JP 3-60 Joint Targeting (2013), עמ' PDF 87–94: נספח A: שיקולים משפטיים במטרות (דיני מלחמה, ROE, מידתיות)
- ★ JP 3-60 Joint Targeting (2013), עמ' PDF 45–46: II, שלב 3 (חלק): weaponeering ו-CDE
- ★ DoDD 3000.09 Autonomy in Weapon Systems (2012 text + 2023 policy analyses), עמ' PDF 1–15: נוסח הנחיה 3000.09 מ-2012 (לא ה-2023): הגדרות, דרישות סקירה בכירה
- ★ DoDD 3000.09 Autonomy in Weapon Systems (2012 text + 2023 policy analyses), עמ' PDF 16–18: CRS Defense Primer (מאי 2023): מדיניות ארה"ב ב-LAWS, תיאור הנוסח המעודכן 2023
- ★ DoDD 3000.09 Autonomy in Weapon Systems (2012 text + 2023 policy analyses), עמ' PDF 19–27: סקירת Harvard HRC של מדיניות 2023: הבדלים מול 2012, פערים לגבי meaningful human control
- ★ Department of Defense Law of War Manual, עמ' PDF 226–377: פרק V The Conduct of Hostilities: עקרונות מטרה, proportionality, precautions
- ★ Department of Defense Law of War Manual, עמ' PDF 378–474: פרק VI Weapons: weapons review, אמנות נשק ספציפיות
- ★ Defense Export Control Law, 5766-2007 (unofficial English translation), עמ' PDF 1–32: החוק כולו (תרגום לא רשמי באנגלית): פרקים A מטרה, B הגדרות, C רישום יצואנים, D רישוי ועוד
- ★ DoD Directive 3000.09 Autonomy in Weapon Systems (25.1.2023), עמ' PDF 1–24: נוסח 2023 המלא של DoDD 3000.09: מדיניות, 'רמות מתאימות של שיפוט אנושי', סקירה בכירה, הגדרות, נספח הנחיות

### M7.16 C-RAM: יירוט רקטות, ארטילריה ומרגמות
*C-RAM* · **מתקדם** · 67 עמ' ספר · כ-4 שיעורים · דרישות: M7.5, M2.22

- ★ Air and Missile Defense Systems Engineering, עמ' PDF 55–66: 4.4: מדדי יעילות: זמן תגובה, ציר זמן יירוט, עוצמת אש, עמידות לחדירה, כיסוי רציף
- ★ Air and Missile Defense Systems Engineering, עמ' PDF 118–127: 6.3–6.4: הערכת מרחב הקרב וניתוח היירוט
- ★ Israel's Air and Missile Defense During the 2014 Gaza War (Mideast Security and Policy Studies 111), עמ' PDF 1–45: כולו

### M7.17 לייזר רב-עוצמה (HEL): התפשטות בטורבולנציה, Thermal Blooming, אופטיקה אדפטיבית ו-ATP
*High-energy lasers: beam propagation in turbulence, thermal blooming, adaptive optics, ATP, laser-material* · **ליבה** · 193 עמ' ספר · כ-13 שיעורים · דרישות: M7.6, M3.5, M3.13

- ★ Introduction to IR and EO Systems, עמ' PDF 181–193: 6.2–6.7: העברה אטמוספרית, בליעה, פיזור, טורבולנציה ו-MTF אטמוספרי
- ★ Effects of Directed Energy Weapons, עמ' PDF 26–53: פרק 1: עקרונות בסיס (fluence, קריטריוני נזק)
- ★ Effects of Directed Energy Weapons, עמ' PDF 106–230: פרק 3: לייזרים — דיפרקציה, בליעה, טורבולנציה ו-adaptive optics, thermal blooming, air breakdown, אינטראקציית לייזר-חומר
- ★ Department of Defense Directed Energy Weapons: Background and Issues for Congress (R46925), עמ' PDF 1–27: כולו: סקירת נשק אנרגיה מכוונת (HEL ו-HPM), מפת הדרכים של DoD, תוכניות חיל האוויר, היבשה והים (DE M-SHORAD, IFPC-HEL, HELIOS) ושאלות לקונגרס. הערה: דו״ח מדיניות, לא מכסה פיזיקת התפשטות קרן

### M7.18 מיקרוגל רב-עוצמה (HPM): מקורות, צימוד ומודל Wunsch-Bell
*High-power microwaves: sources, front/back-door coupling, Wunsch-Bell* · **ליבה** · 122 עמ' ספר · כ-8 שיעורים · דרישות: M1.1, M7.1

- ★ Effects of Directed Energy Weapons, עמ' PDF 26–53: פרק 1: עקרונות בסיס
- ★ Effects of Directed Energy Weapons, עמ' PDF 231–285: פרק 4: מיקרוגל — התפשטות, breakdown, נזק in-band/out-of-band (front/back door, Wunsch-Bell)
- ★ MIL-STD-461G (pp 1-280) and MIL-STD-464C (pp 281-445) bundled, עמ' PDF 309–310: 464C סעיף 5.6: דרישות EMP
- ★ MIL-STD-461G (pp 1-280) and MIL-STD-464C (pp 281-445) bundled, עמ' PDF 379–385: 464C נספח A.5.6: הסבר EMP/HEMP
- ★ MIL-STD-461G (pp 1-280) and MIL-STD-464C (pp 281-445) bundled, עמ' PDF 404–411: 464C נספח A.5.9: קרינה אלקטרומגנטית מסוכנת (HERO/HERF)
- ★ MIL-STD-461G (pp 1-280) and MIL-STD-464C (pp 281-445) bundled, עמ' PDF 152–173: 461G: RS103 ו-RS105 (שדה חשמלי ושדה חולף), כרקע לצימוד ולחסינות

## חלק 15: ארכיטקטורת מערכות, קשר וסייבר-ספקטרום

### M15.1 ארכיטקטורת אוויוניקה ווטרוניקה ואפיקי נתונים: MIL-STD-1553, ARINC 429, SpaceWire ו-TSN
*Avionics and vetronics buses: MIL-STD-1553, ARINC 429, SpaceWire, TSN* · **ליבה** · 160 עמ' ספר · כ-11 שיעורים · דרישות: M7.9

- ★ Military Avionics Systems, עמ' PDF 71–106: 2.1–2.5: התפתחות ארכיטקטורות (federated, IMA), ARINC 429, MIL-STD-1553B, STANAG 3910, JIAWG, אפיקי COTS, RTOS
- ★ ECSS-E-ST-50-12C Rev.1, SpaceWire: Links, Nodes, Routers and Networks, עמ' PDF 1–124: התקן כולו; רלוונטי ישירות לתת-נושא SpaceWire (פרקים 4 סקירה, 5 דרישות: שכבות פיזית/קידוד/ערוץ/רשת, ניתוב). לא מכסה 1553/ARINC 429/AFDX/TSN

### M15.2 רשתות טקטיות ו-MANET
*Tactical networks and MANET* · **ליבה** · 182 עמ' ספר · כ-12 שיעורים · דרישות: M7.9, M4.11

- ★ E34, עמ' PDF 472–487: 6.3: פרוטוקולי גישה מרובה (MAC)
- ★ E34, עמ' PDF 543–573: 7.1–7.3: קישורים אלחוטיים, רשתות אד-הוק, WLAN 802.11
- ★ E34, עמ' PDF 589–597: 7.5: עקרונות ניהול ניידות
- ★ IETF RFC 3561 (AODV), RFC 3626 (OLSR), RFC 4838 (DTN architecture), עמ' PDF 1–32: RFC 3561 AODV: ניתוב ריאקטיבי (ניתוב לפי דרישה)
- ★ IETF RFC 3561 (AODV), RFC 3626 (OLSR), RFC 4838 (DTN architecture), עמ' PDF 33–96: RFC 3626 OLSR: ניתוב פרואקטיבי, MPR
- ★ IETF RFC 3561 (AODV), RFC 3626 (OLSR), RFC 4838 (DTN architecture), עמ' PDF 97–126: RFC 4838: ארכיטקטורת רשתות עמידות להשהיה (DTN, bundle)

### M15.3 קישורי נתונים טקטיים: Link 16 לעומק, VMF, MADL ופרוטוקולי נחילים
*Tactical datalinks: Link 16 in depth, VMF, MADL (open level), swarm protocols* · **ליבה** · 116 עמ' ספר · כ-8 שיעורים · דרישות: M15.2

- ★ SISO-STD-002-2021, Standard for Link 16 Simulation, עמ' PDF 14–19: 3: הגדרות (NPG, חריצי זמן, JU ועוד)
- ★ SISO-STD-002-2021, Standard for Link 16 Simulation, עמ' PDF 20–43: 4.1–4.2: מאפייני הפעלה של JTIDS, רמות נאמנות, סנכרון זמן, מימוש ב-DIS
- ★ SISO-STD-002-2021, Standard for Link 16 Simulation, עמ' PDF 69–88: נספח B.2: נתוני Link 16, כותרות והודעות JTIDS, RTT, קול, VMF
- ★ Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 18–35: תקציר
- ★ Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 40–49: פרק 1: מבוא ומסגרת NCO
- ★ Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 58–75: פרקים 3–5: מאפייני הכוח, איכות מידע אורגני ומידת הרישות
- ★ Gonzales et al., Air-to-Air Combat With and Without Link 16, RAND MG-268, עמ' PDF 102–121: פרקים 10–11: קבלת החלטות, הקשר ליעילות המשימה ומסקנות

### M15.5 פעילות סייבר-אלקטרומגנטית (CEMA): משטח התקיפה של קישורי RF וההגנה עליו
*Cyber-electromagnetic activity (CEMA): attack surface of RF links and its defense* · **ליבה** · 286 עמ' ספר · כ-19 שיעורים · דרישות: M15.3, M4.11

- ★ E34, עמ' PDF 619–620: 8.1: מהי אבטחת רשת, מודל התוקף
- ★ E34, עמ' PDF 635–649: 8.3–8.4: שלמות הודעה, MAC, חתימות ואימות נקודת קצה
- ★ E34, עמ' PDF 670–689: 8.8–8.9: אבטחת WLAN ו-4G/5G, חומות אש ו-IDS
- ★ FM 3-12, Cyberspace Operations and Electromagnetic Warfare, עמ' PDF 1–162: כולו
- ★ GAO-19-128, Weapon Systems Cybersecurity: DOD Just Beginning to Grapple with Scale of Vulnerabilities, עמ' PDF 1–51: כל הדוח
- ◇ AI security papers: NIST AI 100-2e2025; OWASP Top 10 for LLM Applications 2025; Greshake et al. 2023; Beurer-Kellner et al. 2025; Debenedetti et al., CaMeL 2025; Carlini et al. 2021; Shokri et al. 2017; Abadi et al., DP-SGD 2016; Gu et al., BadNets 2017; Hubinger et al., Sleeper Agents 2024; Fang et al. 2024; Zhang et al., Cybench 2025; Anthropic, AI-orchestrated espionage 2025, עמ' PDF 284–297: Anthropic 2025: מבצע ריגול שסוכן AI ביצע את רובו
- ◇ AI security papers: NIST AI 100-2e2025; OWASP Top 10 for LLM Applications 2025; Greshake et al. 2023; Beurer-Kellner et al. 2025; Debenedetti et al., CaMeL 2025; Carlini et al. 2021; Shokri et al. 2017; Abadi et al., DP-SGD 2016; Gu et al., BadNets 2017; Hubinger et al., Sleeper Agents 2024; Fang et al. 2024; Zhang et al., Cybench 2025; Anthropic, AI-orchestrated espionage 2025, עמ' PDF 263–271: Fang ואחרים 2024: סוכן שמנצל פגיעויות ידועות
- ◇ AI security papers: NIST AI 100-2e2025; OWASP Top 10 for LLM Applications 2025; Greshake et al. 2023; Beurer-Kellner et al. 2025; Debenedetti et al., CaMeL 2025; Carlini et al. 2021; Shokri et al. 2017; Abadi et al., DP-SGD 2016; Gu et al., BadNets 2017; Hubinger et al., Sleeper Agents 2024; Fang et al. 2024; Zhang et al., Cybench 2025; Anthropic, AI-orchestrated espionage 2025, עמ' PDF 110–122: Greshake ואחרים 2023: הזרקת הוראות עקיפה

### M15.6 שילוב בפלטפורמה: EMC/EMI והפרעות Co-site
*Platform integration: EMC/EMI and co-site interference* · **ליבה** · 506 עמ' ספר · כ-34 שיעורים · דרישות: M1.6, M15.1

- ★ Introduction to Electromagnetic Compatibility, עמ' PDF 73–114: פרק 2: דרישות EMC, כולל מוצרים צבאיים ובדיקות (MIL-STD-461 ברמת מבוא)
- ★ Introduction to Electromagnetic Compatibility, עמ' PDF 401–444: פרק 6: Conducted emissions ו-susceptibility
- ★ Introduction to Electromagnetic Compatibility, עמ' PDF 490–509: 7.5–7.6: Friis, השפעת החזרות (צימוד אנטנות)
- ★ Introduction to Electromagnetic Compatibility, עמ' PDF 527–582: פרק 8: Radiated emission/susceptibility
- ★ Introduction to Electromagnetic Compatibility, עמ' PDF 737–882: פרקים 10–11: shielding ו-system design. הספר אינו כולל MIL-STD-464C, co-site, HERO
- ★ MIL-STD-461G (pp 1-280) and MIL-STD-464C (pp 281-445) bundled, עמ' PDF 41–173: 461G פרקים 5.4-5.22: מבחני CE/CS/RE/RS ברמת תת-מערכת
- ★ MIL-STD-461G (pp 1-280) and MIL-STD-464C (pp 281-445) bundled, עמ' PDF 298–321: 464C סעיפים 5.1-5.14: שוליים, EMC פנים-מערכתי, HERO, EMC בין-מערכתי
- ★ MIL-STD-461G (pp 1-280) and MIL-STD-464C (pp 281-445) bundled, עמ' PDF 339–371: 464C נספח A.5.2: EMC פנים-מערכתי, הצבת אנטנות וצימוד פלטפורמה
- ★ MIL-STD-461G (pp 1-280) and MIL-STD-464C (pp 281-445) bundled, עמ' PDF 404–411: 464C נספח A.5.9: HERO

### M15.8 ארכיטקטורה פתוחה ותווכה במערכות לחימה: DDS, ממשקים בבעלות הלקוח וקונווי בתוכניות
*Open architecture and middleware in combat systems: DDS, government-owned interfaces, Conway in programs* · **ליבה** · 82 עמ' ספר · כ-5 שיעורים · דרישות: M15.1, M7.10

- ★ Middleware standards, core sections: OMG DDS 1.4 (overview, design rationale, QoS); OASIS MQTT 5.0 (introduction, operational behavior, security), עמ' PDF 1–37: DDS 1.4: רציונל ו-QoS
- ★ Architecture and organization classics: Conway 1968; Parnas 1972; Brooks, No Silver Bullet 1986; Ulrich 1995; MacCormack, Rusnak & Baldwin, mirroring 2008, עמ' PDF 1–4: Conway 1968
- ◇ Architecture and organization classics: Conway 1968; Parnas 1972; Brooks, No Silver Bullet 1986; Ulrich 1995; MacCormack, Rusnak & Baldwin, mirroring 2008, עמ' PDF 62–102: השערת השיקוף (MacCormack, Rusnak & Baldwin)

### M15.4 AI טקטי בלולאה סגורה: ATR על SoC/FPGA/GPU ותקציבי השהיה
*Tactical edge AI in the loop: ATR on SoC/FPGA/GPU, latency budgets* · **ליבה** · 76 עמ' ספר · כ-5 שיעורים · דרישות: M15.1

- ★ Quantization and Training of NNs for Integer-Arithmetic-Only Inference; Towards Deep Learning Models Resistant to Adversarial Attacks; Benchmarking NN Robustness to Common Corruptions, עמ' PDF 15–42: Madry et al.
- ★ Quantization and Training of NNs for Integer-Arithmetic-Only Inference; Towards Deep Learning Models Resistant to Adversarial Attacks; Benchmarking NN Robustness to Common Corruptions, עמ' PDF 43–58: Hendrycks & Dietterich
- ★ Efficient Processing of Deep Neural Networks: A Tutorial and Survey, עמ' PDF 1–32: כולו

## חלק 8: פלטפורמות אוויר ואוויוניקה

### M8.4 CNI: משדרים-משיבים ו-IFF
*Transponders and IFF* · **ליבה** · 9 עמ' ספר · כ-1 שיעורים

- ★ Military Avionics Systems, עמ' PDF 279–280: 7.1
- ★ Military Avionics Systems, עמ' PDF 288–294: 7.3

### M8.1 תפקידים של מטוסי קרב ופלטפורמות
*Military air roles* · **ליבה** · 25 עמ' ספר · כ-2 שיעורים

- ★ Military Avionics Systems, עמ' PDF 25–30: מבוא
- ★ Military Avionics Systems, עמ' PDF 31–36: 1.1–1.3
- ★ Military Avionics Systems, עמ' PDF 48–58: 1.6–1.9
- ★ Military Avionics Systems, עמ' PDF 65–66: 1.12
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 257–276: 3.1: תפקידים ומשימות של כלי טיס צבאיים

### M8.2 ארכיטקטורת אוויוניקה ואפיקי נתונים
*Avionics architectures* · **מתקדם** · 13 עמ' ספר · כ-1 שיעורים

- ★ Military Avionics Systems, עמ' PDF 71–83: 2.1

### M8.3 קרב אוויר: התמרון
*Air combat maneuvering* · **ליבה** · 7 עמ' ספר + 41 עמ' מאמרים · כ-1 שיעורים · דרישות: M6.1

- 📄 Boyd, Aerial Attack Study (1964), עמ' PDF 9–30: Boyd, חלק I: מגבלות הכוונת, התותח וה-AIM-9B, מכניקת עקומת המרדף וסוגי ההתקפה
- 📄 Boyd, Aerial Attack Study (1964), עמ' PDF 46–63: סיכום חלק I; חלק II, פרקים 1–2: מגבלות הטיל מול מטרה מתמרנת, מרחב התמרון והפנייה ההגנתית
- 📄 Boyd, Aerial Attack Study (1964), עמ' PDF 154: סיכום חלק II
- ▫ Boyd, Aerial Attack Study (1964), עמ' PDF 1–8: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Boyd, Aerial Attack Study (1964), עמ' PDF 31–45: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Boyd, Aerial Attack Study (1964), עמ' PDF 64–153: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Boyd, Aerial Attack Study (1964), עמ' PDF 155: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ◇ Missile Guidance and Control Systems, עמ' PDF 368–374: 5.16: מעטפת שיגור
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 134–141: 5.1–5.2: דו-קרב רציף ודו-קרב תלוי זמן

### M8.5 תצוגות: HUD ו-HMD
*Displays* · **עיון** · 71 עמ' ספר · כ-5 שיעורים

- ★ Military Avionics Systems, עמ' PDF 432–470: 11.1–11.4
- ◇ Military Avionics Systems, עמ' PDF 471–502: 11.5–11.7

### M8.6 FMS וניהול תעבורה אווירית
*FMS and air traffic management* · **עיון** · 19 עמ' ספר · כ-1 שיעורים

- ★ Military Avionics Systems, עמ' PDF 314–323: 8.6: מערכת ניהול טיסה
- ★ Military Avionics Systems, עמ' PDF 347–355: 8.10: GATM

### M8.7 מערכות ניהול הכלי
*Vehicle management systems* · **עיון** · 32 עמ' ספר · כ-2 שיעורים

- ★ Military Avionics Systems, עמ' PDF 400–431: פרק 10
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 252–257: 9.1–9.4: אמינות טורית ומקבילית, דוגמת קרב אוויר
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 720–762: 5.4: הפחתת פגיעות, יתירות והפרדה

### M8.8 שרידות כלי טיס (Ball): חשיפה, פגיעוּת, עצי השבתה, שחיקה במשימה ובמערכה, שיעורי אבדות היסטוריים
*Combat survivability (Ball): susceptibility, vulnerability, kill trees, mission and campaign attrition, historical loss rates* · **ליבה** · 289 עמ' ספר · כ-19 שיעורים · דרישות: M0.4, M2.4, M11.4, M11.3

- ★ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 25–105: 1.1: יסודות השרידות, P_S = 1 − P_H·P_K|H, שרידות במערכה
- ★ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 106–141: 1.2: שיעורי אבדות היסטוריים
- ◇ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 198–226: 1.7: סיכום ובעיות
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 227–256: פרק 2: מבנה כלי הטיס (כפילות עם גילואה M15.3; עיון)
- ★ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 303–338: 3.3–3.4: מינוח, מאפייני האיום, מנגנוני נזק
- ◇ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 469–473: 4.1–4.2: תוכנית החשיפה
- ◇ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 608–626: 4.4.6–4.4.7: דיכוי איומים וטקטיקה
- ★ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 627–678: 5.1–5.2: פגיעוּת, רכיבים קריטיים, FMECA ועצי השבתה
- ★ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 763–788: 6.1–6.2: הערכת שרידות במשימה ובמערכה
- ◇ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 797–801: 6.4: מסקנות

### M8.9 קיבולת של כוח אווירי: קצב גיחות, בסיסים ושרידותם, תדלוק אווירי
*Air campaign capacity: sortie generation, basing and air-base resilience, tankers* · **ליבה** · 0 עמ' מאמרים · כ-1 שיעורים · דרישות: M8.8, M9.2


### M8.10 תכן מטוסי קרב
*Combat aircraft design* · **מתקדם** · 251 עמ' ספר · כ-17 שיעורים · דרישות: M8.1, M8.8

- ★ Aircraft Design: A Conceptual Approach, עמ' PDF 13–84: פרקים 3–7: Sizing from a conceptual sketch (fuel fraction, takeoff weight), airfoil/geometry, T/W ו-W/S (constraint), initial sizing, configuration layout. הערה: כל עמוד PDF הוא דף כפול
- ★ Aircraft Design: A Conceptual Approach, עמ' PDF 85–98: פרק 8: Special considerations, כולל Radar/IR detectability (חמקנות) ו-vulnerability
- ★ Aircraft Design: A Conceptual Approach, עמ' PDF 104–122: פרק 10: Propulsion and fuel system integration (בחירת מנוע, jet integration)
- ★ Aircraft Design: A Conceptual Approach, עמ' PDF 174–206: פרק 14: Structures and loads
- ★ Aircraft Design: A Conceptual Approach, עמ' PDF 237–265: פרקים 17–18: Performance and flight mechanics (כולל Energy-maneuverability 17.6) ו-Cost analysis (18.4 RDT&E)
- ★ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 475–502: 4.3.2: חתימות כלי הטיס
- ★ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 561–616: 4.4: תכנון לחשיפה נמוכה: התרעה, שיבוש, הקטנת חתימה, אמצעים מתכלים, דיכוי, טקטיקה

## חלק 9: כטב"מים, רחפנים והגנה מפניהם

### M9.2 הכלי: ביצועים, הנעה ומבנה
*Air vehicle performance and propulsion* · **ליבה** · 19 עמ' ספר · כ-1 שיעורים · דרישות: M6.2

- ★ Introduction to UAV Systems, עמ' PDF 104–111: 4.2–4.4: שיוט, טווח ושהייה (דלתא מול גילואה)
- ★ Introduction to UAV Systems, עמ' PDF 152–162: 6.5.5–6.7: מנוע חשמלי, סוללות, תאים סולאריים ודלק, הספק ודחף (דלתא מול גילואה)

### M9.1 כטב"מים: היסטוריה, מחלקות ומשימות
*UAS history and classes* · **מתקדם** · 11 עמ' ספר · כ-1 שיעורים

- ★ Introduction to UAV Systems, עמ' PDF 40–43: 1.3: מרכיבי מערכת כטב"ם
- ★ Introduction to UAV Systems, עמ' PDF 59–65: 2.1–2.2: מחלקות, טווח ושהייה, משימות ושיטת הדרגים
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 188–213: פרק 9: כלי טיס בלתי מאוישים

### M9.3 תחנת שליטה, בקרת הכלי והמטען ואוטונומיה
*Control station and autonomy* · **ליבה** · 52 עמ' ספר · כ-3 שיעורים · דרישות: M5.8

- ★ Introduction to UAV Systems, עמ' PDF 215–244: פרק 9
- ◇ Introduction to UAV Systems, עמ' PDF 193–214: פרק 8: תחנת שליטה
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 188–203: 9.2: ניתוב כטב"ם

### M9.4 מטענים: חימוש, EW ואחרים
*Payloads* · **ליבה** · 32 עמ' ספר · כ-2 שיעורים

- ★ Introduction to UAV Systems, עמ' PDF 279–289: 11.1–11.4
- ★ Introduction to UAV Systems, עמ' PDF 302–308: 11.6
- ★ Introduction to UAV Systems, עמ' PDF 309–322: פרק 12

### M9.5 קישורי נתונים: פונקציות, מרווח, עמידות לשיבוש, דחיסה
*UAS data links* · **ליבה** · 70 עמ' ספר · כ-5 שיעורים · דרישות: M1.4, M4.11

- ★ Introduction to UAV Systems, עמ' PDF 325–394: פרקים 13–16

### M9.6 רב-להבי ורחפנים
*Rotary-wing and quadcopters* · **ליבה** · 16 עמ' ספר · כ-1 שיעורים · דרישות: M9.2

- ★ Introduction to UAV Systems, עמ' PDF 437–452: פרק 20

### M9.7 גילוי רחפנים והגנה מפניהם
*Drone detection and C-UAS* · **ליבה** · 39 עמ' ספר + 41 עמ' מאמרים · כ-3 שיעורים · דרישות: M2.13, M3.10, M4.3

- ★ ATP 3-01.81 Counter-Unmanned Aircraft System (2023), עמ' PDF 7–14: מבוא ופרק 1: איום הכטב"מים וערוצי התקשורת שלהם
- ★ ATP 3-01.81 Counter-Unmanned Aircraft System (2023), עמ' PDF 21–42: פרקים 3–4: אמצעים פסיביים ואקטיביים, רצף יירוט לפי זמן ומרחק, פעולה התקפית
- ★ ATP 3-01.81 Counter-Unmanned Aircraft System (2023), עמ' PDF 47–49: נספח B: מערכות C-UAS
- ◇ ATP 3-01.81 Counter-Unmanned Aircraft System (2023), עמ' PDF 15–20: פרק 2: תכנון לפי דרג
- 📄 Taha & Shoufan, ML-Based Drone Detection and Classification (2019) (כולו): גילוי וסיווג בכל אמצעי החישה
- 📄 UCL, Loaded/Unloaded Micro-Drone Classification, Multistatic Radar (כולו): סיווג לפי מטען במכ"ם רב-סטטי
- 📄 Micro-Doppler: Drones vs Birds, JMOe (2025) (כולו): מיקרו-דופלר: רחפן מול ציפור
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 70–83: פרק 4: הגנת מטרה
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 40–51: 2.4: כמה יריות, כמה מטרות, מטח אחד
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 207–219: 7.2–7.3: הסתברות חדירה

### M9.8 שיגור ונחיתה
*Launch and recovery* · **מתקדם** · 40 עמ' ספר · כ-3 שיעורים · דרישות: M9.2

- ★ Introduction to UAV Systems, עמ' PDF 397–436: פרקים 17–19

### M9.9 רחפנים חד-כיווניים, FPV וכלכלת מלחמת הרחפנים: מחלקת Shahed, FPV, סיב אופטי, ייצור המוני ויחס עלויות בהגנה
*One-way drones, FPV and drone-war economics (Shahed-class, FPV, fiber-optic, mass production, C-UAS cost-exchange)* · **ליבה** · 0 עמ' מאמרים · כ-1 שיעורים · דרישות: M9.7, M9.5, M8.8


### M9.10 הנדסת מערכות C-UAS ואמצעי יירוט
*C-UAS systems engineering and effectors* · **ליבה** · 169 עמ' ספר · כ-11 שיעורים · דרישות: M9.7, M9.9, M7.17, M7.18

- ★ Micro-Doppler: Drones vs Birds, JMOe (2025), עמ' PDF 1–23: כל המאמר: מודל הד של רחפן מרובה-רוטורים ושל ציפור, סימולציה ומדידת מיקרו-דופלר, השוואה
- ★ ATP 3-01.81 Counter-Unmanned Aircraft System (2023), עמ' PDF 9–38: פרקים 1–3: איום הכטב"מים, תכנון בשכבות, פעולות C-UAS הגנתיות (פסיביות ואקטיביות)
- ★ ATP 3-01.81 Counter-Unmanned Aircraft System (2023), עמ' PDF 47–50: נספח B: דוגמאות לציוד C-UAS
- ★ Counter-Drone Systems, עמ' PDF 1–45: כולו
- ★ Evolution Not Revolution: Drone Warfare in Russia's 2022 Invasion of Ukraine, עמ' PDF 1–67: הדוח כולו

## חלק 10: מערכות ימיות

### M10.1 אקוסטיקה תת-ימית
*Underwater acoustics* · **ליבה** · 16 עמ' ספר · כ-1 שיעורים · דרישות: M0.2

- ★ Principles of Naval Weapons Systems, עמ' PDF 177–192: פרק 15

### M10.2 משוואת הסונאר
*The sonar equation* · **ליבה** · 18 עמ' ספר · כ-1 שיעורים · דרישות: M10.1, M0.1

- ★ Principles of Naval Weapons Systems, עמ' PDF 193–210: פרק 16

### M10.3 מערכות סונאר וגילוי לא-אקוסטי
*Sonar systems and non-acoustic detection* · **ליבה** · 32 עמ' ספר + 35 עמ' מאמרים · כ-2 שיעורים · דרישות: M10.2, M2.15

- ★ Principles of Naval Weapons Systems, עמ' PDF 211–226: פרק 17
- 📄 Coraluppi & Carthel, Advances in Active Sonar Tracking (2006) (כולו): עקיבה בסונאר אקטיבי
- 📄 NURC Multistatic Tracking Benchmark (כולו): עקיבה בסונאר רב-סטטי
- 📄 Review on the Hydro- and Thermo-Dynamic Wakes of Underwater Vehicles (2024) (כולו): שובלים של כלי תת-ימי
- ◇ Washburn & Kress, Combat Modeling (2009), עמ' PDF 146–161: 7.4, 7.6: סיור מחסום ומטרות נעות (חיפוש תת-ימי)

### M10.4 טורפדות ומוקשים
*Torpedoes and mines* · **ליבה** · 10 עמ' ספר · כ-1 שיעורים · דרישות: M10.3

- ★ Principles of Naval Weapons Systems, עמ' PDF 299–308: פרק 26
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 165–187: פרק 8: לוחמת מוקשים

### M10.5 הגנה עצמית של ספינה מול טילי ים-ים
*Ship self-defense* · **ליבה** · 85 עמ' מאמרים · כ-6 שיעורים · דרישות: M1.3, M4.9, M4.10, M7.3, M7.4, M6.10, M2.23, M14.1

- ▫ Radar Detection of Low-Altitude Targets in a Maritime Environment, Vol. 1, עמ' PDF 1–72: גילוי מטרה נמוכה מעל הים: נלמד ב-M1.3 (אותו דוח פעמיים); עיון
- 📄 Kumar, Defense of Surface Ships Against Anti-Ship Missiles, NPS (1990), עמ' PDF 9–54: מוץ מספינה, פרקים I–II: בעיית הטיל נגד ספינות ומאפייני מוץ (RCS, פיזור, שקיעה, רוחב פס, פריסה)
- ▫ Kumar, Defense of Surface Ships Against Anti-Ship Missiles, NPS (1990), עמ' PDF 1–8: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Kumar, Defense of Surface Ships Against Anti-Ship Missiles, NPS (1990), עמ' PDF 55–134: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- 📄 Reed, IR Offboard Countermeasures vs IR Anti-Ship Missiles, NPS (1985), עמ' PDF 9–30: פיתיונות IR מספינה, פרקים I–III: מבוא, הסביבה האטמוספרית ותרחיש ההיתקלות
- 📄 Reed, IR Offboard Countermeasures vs IR Anti-Ship Missiles, NPS (1985), עמ' PDF 70–86: פרק VI: ראשי ביות IR ואמצעי נגד
- ▫ Reed, IR Offboard Countermeasures vs IR Anti-Ship Missiles, NPS (1985), עמ' PDF 1–8: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Reed, IR Offboard Countermeasures vs IR Anti-Ship Missiles, NPS (1985), עמ' PDF 31–69: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ▫ Reed, IR Offboard Countermeasures vs IR Anti-Ship Missiles, NPS (1985), עמ' PDF 87–111: עיון: שאר הדוח. לא חומר שיעור; זמין לקריאה לפי הצורך (קיצור שאושר ב-6.11)
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 52–69: פרק 3: shoot-look-shoot
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 207–219: 7.2–7.3: הסתברות חדירה והסתברות לאפס חודרים

### M10.6 עיבוד אותות סונאר: MVDR במערכים נגררים, LOFAR/DEMON ו-TMA
*Sonar signal processing: MVDR on towed arrays, LOFAR/DEMON, TMA* · **ליבה** · 93 עמ' ספר · כ-6 שיעורים · דרישות: M10.3, M2.30

- ★ E31, עמ' PDF 283–305: 6.1–6.4: מודל המערך, beamforming קונבנציונלי ו-Capon/MVDR, שיטות פרמטריות (MUSIC, ESPRIT)
- ★ Principles of Modern Radar, Vol. II: Advanced Techniques, עמ' PDF 429–459: 9.2–9.3: יסודות beamforming ספרתי, ביטול משבשים אדפטיבי: Wiener, max SINR, LCMV, GSC, SMI
- ★ Principles of Naval Weapons Systems, עמ' PDF 193–226: פרקים 16–17: רעש סביבה ועצמי, beamforming, משוואת הסונאר, מערכות סונאר פעיל ופסיבי, מנתח תדר, TASS
- ★ Coraluppi & Carthel, Advances in Active Sonar Tracking (2006), עמ' PDF 1–5: כל המאמר: עקיבה בסונאר פעיל

### M10.7 מערכות צוללת: השתקה, AIP מול גרעינית ותקשורת VLF/ELF
*Submarine warfare systems: quieting, AIP vs nuclear, VLF/ELF communications* · **ליבה** · 792 עמ' ספר · כ-53 שיעורים · דרישות: M10.3

- ★ Principles of Naval Weapons Systems, עמ' PDF 195–200: 16 (חלק): רעש סביבה ורעש עצמי, משוואת הסונאר
- ★ Principles of Naval Weapons Systems, עמ' PDF 225–226: 17 (חלק): גילוי לא-אקוסטי של צוללות
- ★ Principles of Naval Weapons Systems, עמ' PDF 32–40: פרק 2 (חלק): ספקטרום ואופני התפשטות: גל קרקע (ELF/VLF), גל שמיים, קו ראייה
- ★ Submarine signatures, communications and strategy bundle: Cote 'The Third Battle'; NPS non-acoustic ASW; US/Soviet SSBN comparison; ELF/VLF submarine communications satellite design; Common Submarine Radio Room, עמ' PDF 1–116: Cote: The Third Battle: היסטוריה של השתקה וגילוי, תפקיד אסטרטגי של צוללות במלחמה הקרה
- ★ Submarine signatures, communications and strategy bundle: Cote 'The Third Battle'; NPS non-acoustic ASW; US/Soviet SSBN comparison; ELF/VLF submarine communications satellite design; Common Submarine Radio Room, עמ' PDF 117–175: ניתוח מוגבל של מערכות ASW לא-אקוסטיות (MAD, לייזר, wake): חתימות לא-אקוסטיות
- ★ Submarine signatures, communications and strategy bundle: Cote 'The Third Battle'; NPS non-acoustic ASW; US/Soviet SSBN comparison; ELF/VLF submarine communications satellite design; Common Submarine Radio Room, עמ' PDF 176–438: צוללות SSBN של ארה"ב וברה"מ: השוואה, התפקיד האסטרטגי
- ★ Submarine signatures, communications and strategy bundle: Cote 'The Third Battle'; NPS non-acoustic ASW; US/Soviet SSBN comparison; ELF/VLF submarine communications satellite design; Common Submarine Radio Room, עמ' PDF 439–583: תכן לוויין ELF/VLF לתקשורת עם צוללות תחת הקרח
- ★ Submarine signatures, communications and strategy bundle: Cote 'The Third Battle'; NPS non-acoustic ASW; US/Soviet SSBN comparison; ELF/VLF submarine communications satellite design; Common Submarine Radio Room, עמ' PDF 584–775: Common Submarine Radio Room: תקשורת צוללות, מערכות

### M10.8 כלים ימיים בלתי מאוישים, נחילים ימיים ופיצוץ תת-ימי
*USV/UUV operations, naval swarms, underwater explosion: shock and whipping* · **ליבה** · 168 עמ' ספר · כ-11 שיעורים · דרישות: M10.4, M5.8

- ★ The Response of Surface Ships to Underwater Explosions (DSTO-GD-0109), עמ' PDF 1–48: כולו: shock factor, bubble pulse ו-whipping, Taylor plate, ניסויי הלם ומידול
- ★ Autonomous Vehicles in Support of Naval Operations, עמ' PDF 30–52: פרק 2: חזון ימי, משימות ויישומי כלים אוטונומיים
- ★ Autonomous Vehicles in Support of Naval Operations, עמ' PDF 53–84: פרק 3: טכנולוגיית אוטונומיה: יכולות ופוטנציאל
- ★ Autonomous Vehicles in Support of Naval Operations, עמ' PDF 85–115: פרק 4: כטב"מים (UAV), כולל נחילים ואיומים
- ★ Autonomous Vehicles in Support of Naval Operations, עמ' PDF 116–133: פרק 5: כלי שטח ותת-ימיים (USV/UUV): ניווט, אנרגיה, תקשורת, תוכנית האב של ה-UUV
- ★ Autonomous Vehicles in Support of Naval Operations, עמ' PDF 189–204: נספח B: אילוצים פיזיקליים: scaling, אנרגיה, חישה ותקשורת (תת-ימית)

### M10.9 לוחמת שטח ימית והגנה אווירית של צי
*Naval surface warfare and fleet air defense* · **ליבה** · 1677 עמ' ספר · כ-112 שיעורים · דרישות: M10.5, M7.4

- ★ Washburn & Kress, Combat Modeling (2009), עמ' PDF 84–97: 5.1–5.3: מודלי לנצ'סטר דטרמיניסטיים וסטוכסטיים (כולל הפניה למשוואות המטח של Hughes)
- ★ Washburn & Kress, Combat Modeling (2009), עמ' PDF 70–83: פרק 4: הגנת מטרה מפני תוקפים, מטחי מיירטים
- ★ Kumar, Defense of Surface Ships Against Anti-Ship Missiles, NPS (1990), עמ' PDF 9–54: פרקים I–II: האיום, בעיית הגילוי, השמדה קשה ורכה, מוץ (chaff)
- ★ Kumar, Defense of Surface Ships Against Anti-Ship Missiles, NPS (1990), עמ' PDF 63–74: פרקים V–IX: מודל הטיל והספינה, ניתוח התוכנית
- ★ Hughes' salvo model (primary paper) and NPS theses on salvo models, ASCM defense, radar propagation, soft kill, VLS magazines, distributed lethality, OTH targeting, Aegis, עמ' PDF 1–24: Hughes 1995: A Salvo Model of Warships in Missile Combat (המקור הראשוני)
- ★ Hughes' salvo model (primary paper) and NPS theses on salvo models, ASCM defense, radar propagation, soft kill, VLS magazines, distributed lethality, OTH targeting, Aegis, עמ' PDF 25–400: עבודות על Salvo: יסודות salvo warfare, בדיקת משוואות Salvo, מורכבות מודל, Heterogeneous Salvo, Hughes מותאם לצי קטן, ערך תכונות ספינה
- ★ Hughes' salvo model (primary paper) and NPS theses on salvo models, ASCM defense, radar propagation, soft kill, VLS magazines, distributed lethality, OTH targeting, Aegis, עמ' PDF 401–608: יעילות היסטורית של ASCM (Falklands, Exocet, Styx) ותכונות האיום; הגנת ספינות מפני טילי ים
- ★ Hughes' salvo model (primary paper) and NPS theses on salvo models, ASCM defense, radar propagation, soft kill, VLS magazines, distributed lethality, OTH targeting, Aegis, עמ' PDF 609–715: אופק מכ"ם, evaporation duct וזיהוי sea-skimmers: זמן תגובה
- ★ Hughes' salvo model (primary paper) and NPS theses on salvo models, ASCM defense, radar propagation, soft kill, VLS magazines, distributed lethality, OTH targeting, Aegis, עמ' PDF 716–833: kill-chain: ארכיטקטורת הגנה אווירית ו-CONOPS נגד ASCM
- ★ Hughes' salvo model (primary paper) and NPS theses on salvo models, ASCM defense, radar propagation, soft kill, VLS magazines, distributed lethality, OTH targeting, Aegis, עמ' PDF 834–1183: Soft kill: לוחמה אלקטרונית משולבת, ESM/ECM, פתיינים
- ★ Hughes' salvo model (primary paper) and NPS theses on salvo models, ASCM defense, radar propagation, soft kill, VLS magazines, distributed lethality, OTH targeting, Aegis, עמ' PDF 1184–1278: VLS loadout ומשק המחסניות; תורת Distributed Lethality
- ★ Hughes' salvo model (primary paper) and NPS theses on salvo models, ASCM defense, radar propagation, soft kill, VLS magazines, distributed lethality, OTH targeting, Aegis, עמ' PDF 1279–1492: Over-the-horizon targeting ו-scouting לצי השטח
- ★ Hughes' salvo model (primary paper) and NPS theses on salvo models, ASCM defense, radar propagation, soft kill, VLS magazines, distributed lethality, OTH targeting, Aegis, עמ' PDF 1493–1591: Aegis: תיק בוחן היסטורי וארכיטקטורת הגנה אווירית של הצי

### M10.10 לוחמה נגד צוללות, מוקשים ונטרול מוקשים
*ASW operations analysis, mines and mine countermeasures* · **ליבה** · 221 עמ' ספר · כ-15 שיעורים · דרישות: M10.6, M3.11

- ★ Principles of Naval Weapons Systems, עמ' PDF 299–308: פרק 26: טורפדות, מוקשים ימיים וניקוי מוקשים
- ★ Washburn & Kress, Combat Modeling (2009), עמ' PDF 137–164: פרק 7: תורת החיפוש: רוחב סריקה, חוקי גילוי, חלוקת מאמץ, מחסום, מטרות נעות
- ★ Washburn & Kress, Combat Modeling (2009), עמ' PDF 165–187: פרק 8: לוחמת מוקשים
- ★ Naval Mine Warfare: Operational and Technical Challenges for Naval Forces, עמ' PDF 39–139: פרקים 1–4: בעיית מוקשים, נושאים רוחביים, מוקשים אמריקאים, לוחמה נגד מוקשים הרחק מהחוף (MCM)
- ★ Naval Mine Warfare: Operational and Technical Challenges for Naval Forces, עמ' PDF 140–178: פרק 5: MCM בחוף. הדו"ח עוסק במוקשים ובנגד-מוקשים; אין בו ASW/טורפדות/sonobuoys
- ★ Naval Mine Warfare: Operational and Technical Challenges for Naval Forces, עמ' PDF 19–38: תקציר מנהלים

## חלק 11: אפקטים של נשק ושריון

### M11.1 בליסטיקה פנימית וחיצונית
*Interior and exterior ballistics* · **ליבה** · 12 עמ' ספר · כ-1 שיעורים

- ★ Principles of Naval Weapons Systems, עמ' PDF 253–264: פרק 21
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 32–41: פרק 2: פיזור ונקודת פגיעה ממוצעת

### M11.4 קריטריוני נזק, Pk ו-CEP
*Damage criteria, Pk, CEP* · **ליבה** · 34 עמ' ספר · כ-2 שיעורים · דרישות: M0.4

- ★ Principles of Naval Weapons Systems, עמ' PDF 283–294: פרק 24
- ★ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 70–91: Przemieniecki 3.11–3.16: LEP, CEP ו-SEP, נזק חלקי, פונקציות נזק, רסיסים ורדיוס אפקטיבי. Driels (Weaponeering) חסר: מתודולוגיית JMEM מהידע של המורה
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 42–91: פרק 3: מטרות סבילות, CEP ופונקציות נזק
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 21–51: פרק 2: ירי בלי משוב
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 679–719: 5.3: הערכת פגיעות

### M11.11 בליסטיקה פנימית, חיצונית וסופית
*Gun and projectile ballistics* · **ליבה** · 358 עמ' ספר · כ-24 שיעורים · דרישות: M11.1

- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 18–183: חלק I (פרקים 1–5): בליסטיקה פנימית: גזים ותרמודינמיקה, בעירת הודף, מודלים אנליטיים/חישוביים, תכן תחמושת, תכן נשק (5.1 עייפות ושחיקה, 5.2 תכן קנה)
- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 184–323: חלק II (פרקים 6–13): בליסטיקה חיצונית: דינמיקה, מסלולים (8), אירובליסטיקה ליניארית, אסימטריות מסה, throwoff, swerve, אירובליסטיקה לא-ליניארית
- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 330–369: פרק 15: Penetration theories (חדירת מתכות, קרמיקה, מרוכבים) ל-KE penetrators
- ★ Principles of Naval Weapons Systems, עמ' PDF 253–264: פרק 21: בליסטיקה פנימית וחיצונית, שגיאות כיוון

### M11.2 איתור ארטילריה ואש נגד סוללות
*Weapon-locating radar and counterfire* · **ליבה** · 85 עמ' ספר · כ-6 שיעורים · דרישות: M11.1, M2.15

- ★ ATP 3-09.12 Field Artillery Target Acquisition (2015), עמ' PDF 19–40: פרקים 2–3: אש נגד סוללות, היבטים טכניים של פריסת מכ"ם איתור
- ★ ATP 3-09.12 Field Artillery Target Acquisition (2015), עמ' PDF 51–96: פרקים 5–7: AN/TPQ-36/37, TPQ-53, TPQ-50: אפיון, גילוי, אימות ואיכון, פעולה תחת ECM
- ★ ATP 3-09.12 Field Artillery Target Acquisition (2015), עמ' PDF 113–118: נספח D: מיסוך
- ★ ATP 3-09.12 Field Artillery Target Acquisition (2015), עמ' PDF 131–141: נספח G: התרעה מפני רקטות, ארטילריה ומרגמות
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 103–107: 4.4: אש שטח, החוק הלינארי

### M11.3 חומרי נפץ, ראשי קרב, הדף ורסיסים
*Explosives and warheads* · **ליבה** · 18 עמ' ספר · כ-1 שיעורים

- ★ Principles of Naval Weapons Systems, עמ' PDF 265–282: פרקים 22–23
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 339–358: 3.5: תהליכי נזק ואפקטים סופיים
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 82–89: 3.14–3.15: פונקציות נזק לרסיסים ורדיוס אפקטיבי

### M11.5 ראשי קרב מיוחדים ותחמושת טנקים
*Special warheads and tank ammunition* · **ליבה** · 27 עמ' ספר · כ-2 שיעורים · דרישות: M11.3

- ★ Principles of Naval Weapons Systems, עמ' PDF 295–298: פרק 25: חודר שריון, EFP, אנרגיה קינטית, FAE
- ★ Tanks: 100 Years of Evolution, עמ' PDF 290–312: נספח I: עוצמת התותח

### M11.6 מיגון טנקים: שריון, ERA ו-APS
*Tank protection* · **ליבה** · 19 עמ' ספר · כ-1 שיעורים · דרישות: M11.5

- ★ Tanks: 100 Years of Evolution, עמ' PDF 312–330: נספח II
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 720–730: 5.4.1–5.4.3: עקרונות הפחתת פגיעות

### M11.7 ניידות טנקים: מנועים, תמסורת, מתלים
*Tank mobility* · **ליבה** · 32 עמ' ספר · כ-2 שיעורים

- ★ Tanks: 100 Years of Evolution, עמ' PDF 330–361: נספח III
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 205–258: פרק 5: ברברוסה, הצבא החצי-ממונע
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 288–325: פרק 7: נורמנדי, צריכת דלק וקצב התקדמות

### M11.8 התפתחות הטנק: מלחמה קרה ומעבר לה
*Tank evolution since 1945* · **עיון** · 117 עמ' ספר · כ-8 שיעורים

- ★ Tanks: 100 Years of Evolution, עמ' PDF 176–289: פרקים 9–12: חמש המעצמות, הפריפריה (כולל ישראל), אסיה, אפילוג
- ◇ Tanks: 100 Years of Evolution, עמ' PDF 8–10: מבוא: מבט על מאה שנות התפתחות
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 288–325: פרק 7: חזית רחבה או חוד צר

### M11.9 התפתחות הטנק עד 1945
*Tank evolution to 1945* · **עיון** · 163 עמ' ספר · כ-11 שיעורים

- ★ Tanks: 100 Years of Evolution, עמ' PDF 13–175: פרקים 1–8
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 205–287: פרקים 5–6: ברברוסה וצפון אפריקה

### M11.10 נשק גרעיני והשפעותיו
*Nuclear weapons and effects* · **מתקדם** · 43 עמ' ספר · כ-3 שיעורים

- ★ Principles of Naval Weapons Systems, עמ' PDF 309–351: פרקים 27–30
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 198–205: 6.6: מודלי מספיקות לכוחות אסטרטגיים

### M11.12 מכניקת ראשי קרב ומרעומים
*Warhead mechanics and fuzing* · **ליבה** · 139 עמ' ספר · כ-9 שיעורים · דרישות: M11.3, M11.11

- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 324–329: חלק III פרק 14: מבוא לבליסטיקה סופית
- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 370–483: פרקים 16–18: Shock physics (Hugoniot, detonation), Gurney, Taylor angles, Mott (רסיסים), shaped charges. הפרק אינו כולל blast scaling/fuzing/IM
- ★ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 71–89: 3.12–3.16: נזק חלקי צפוי, פונקציות נזק, פונקציות נזק לרסיסים, רדיוס אפקטיבי של נשק

### M11.13 טילי נ"ט דור 3–5, תקיפה מלמעלה והתגברות על הגנה אקטיבית
*Anti-tank missiles gen 3-5, top attack, APS and its defeat* · **ליבה** · 69 עמ' ספר · כ-5 שיעורים · דרישות: M11.6, M6.6

- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 462–483: פרק 18: Shaped charges: היווצרות ג'ט וחדירה (בסיס לטנדם מול ERA)
- ★ Tanks: 100 Years of Evolution, עמ' PDF 181–183: פרק 9 (חלק): טילי נ"ט מונחים מול תותח הטנק
- ★ Tanks: 100 Years of Evolution, עמ' PDF 188–189: פרק 9 (חלק): שריון ריאקטיבי ו-Drozd
- ★ Tanks: 100 Years of Evolution, עמ' PDF 312–329: נספח II: הגנה מוגברת: שריון מורכב, ERA, מערכות הגנה אקטיביות
- ★ Fleeman, Tactical Missile Design (2001), עמ' PDF 148–171: 6.1–6.2: עמידות (חלופות ראש ביות, מכ"ם, IIR, מולטי-מוד) וקטלניות ראש קרב (מטען חלול, EFP, KE)

### M11.14 ייצוב נשק בתנועה: חוגי בקרה של צריח ותותח
*Weapon stabilization on the move: turret and gun control loops* · **ליבה** · 57 עמ' ספר · כ-4 שיעורים · דרישות: M0.7, M11.7

- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 170–174: 5.3 Gun Dynamics: דינמיקת קנה (jump/whip, רטט); 5.4 Muzzle devices ב-175–183
- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 310–315: פרק 12: Aerodynamic jump, epicyclic swerve, drift
- ★ E03, עמ' PDF 375–397: פרק 11: בקרת PID, כיוונון, windup ומימוש
- ★ E03, עמ' PDF 401–423: 12.1–12.4: פונקציות רגישות, מפרטי ביצועים, עיצוב לולאה ו-feedforward (דחיית הפרעות)

### M11.15 טרמכניקה ומתלים אקטיביים
*Terramechanics (Bekker, Wong) and active suspension* · **ליבה** · 1329 עמ' ספר · כ-89 שיעורים · דרישות: M11.7

- ★ Terramechanics and vehicle mobility bundle: Bekker model reports, NATO Reference Mobility Model (NRMM) guide and next-generation NRMM, AMC Automotive Suspensions handbook, tracked-vehicle steerability, ride dynamics, עמ' PDF 1–75: מודל Bekker: pressure-sinkage, Mohr-Coulomb, התנגדות תנועה, כוח משיכה ו-slip, מודל אינטראקציה פיזיקלי, שיטות לנתוני חוזק קרקע (cone index)
- ★ Terramechanics and vehicle mobility bundle: Bekker model reports, NATO Reference Mobility Model (NRMM) guide and next-generation NRMM, AMC Automotive Suspensions handbook, tracked-vehicle steerability, ride dynamics, עמ' PDF 76–714: NRMM: מדריך המשתמש ומודל NRMM הדור הבא: מדדי MMP ולחץ, מהירות על שטח, speed-made-good
- ★ Terramechanics and vehicle mobility bundle: Bekker model reports, NATO Reference Mobility Model (NRMM) guide and next-generation NRMM, AMC Automotive Suspensions handbook, tracked-vehicle steerability, ride dynamics, עמ' PDF 715–773: אימות NRMM (ISTVS): מגבלות המודל
- ★ Terramechanics and vehicle mobility bundle: Bekker model reports, NATO Reference Mobility Model (NRMM) guide and next-generation NRMM, AMC Automotive Suspensions handbook, tracked-vehicle steerability, ride dynamics, עמ' PDF 774–1232: AMC Engineering Design Handbook: Automotive Suspensions: תלייה, ride, חספוס שטח, הגבלות חשיפה לרעידות, תלייה של זחלמים
- ★ Terramechanics and vehicle mobility bundle: Bekker model reports, NATO Reference Mobility Model (NRMM) guide and next-generation NRMM, AMC Automotive Suspensions handbook, tracked-vehicle steerability, ride dynamics, עמ' PDF 1233–1264: Skid steering וסטירביליות של רכב זחלי; מודל רובוט skid-steer
- ★ Terramechanics and vehicle mobility bundle: Bekker model reports, NATO Reference Mobility Model (NRMM) guide and next-generation NRMM, AMC Automotive Suspensions handbook, tracked-vehicle steerability, ride dynamics, עמ' PDF 1265–1318: Ride dynamics: חשיפה גוף-שלם לרעידות ונוהל TOP
- ★ Terramechanics and vehicle mobility bundle: Bekker model reports, NATO Reference Mobility Model (NRMM) guide and next-generation NRMM, AMC Automotive Suspensions handbook, tracked-vehicle steerability, ride dynamics, עמ' PDF 1319–1329: בקרת תלייה semi-active: סקירה ומתודולוגיות מודרניות

### M11.16 אוטונומיה קרקעית (UGV): תפיסה תלת-ממדית, עבירות ותכנון מסלול
*UGV autonomy: 3D perception, traversability, planning* · **ליבה** · 528 עמ' ספר · כ-35 שיעורים · דרישות: M11.15, M5.13

- ★ UGV traversability and autonomy bundle: Sevastopoulos traversability survey, Army TOP 02-2-541 teleoperated UGV mobility, DoD UGV Master Plan, SSC UGV lessons learned, autonomy test report, עמ' PDF 1–22: סקר הערכת traversability לרובוטים ניידים: חישה תלת-ממדית, שיטות מבוססות גיאומטריה, למידה ו-self-supervised
- ★ UGV traversability and autonomy bundle: Sevastopoulos traversability survey, Army TOP 02-2-541 teleoperated UGV mobility, DoD UGV Master Plan, SSC UGV lessons learned, autonomy test report, עמ' PDF 23–67: TOP 02-2-541: ביצועי ניידות של UGV מרוחק (teleoperation) ובדיקות
- ★ UGV traversability and autonomy bundle: Sevastopoulos traversability survey, Army TOP 02-2-541 teleoperated UGV mobility, DoD UGV Master Plan, SSC UGV lessons learned, autonomy test report, עמ' PDF 68–243: תוכנית אב UGV של DoD ולקחים מתוכניות UGV: teleoperation מול supervised autonomy, שימושים צבאיים
- ★ UGV traversability and autonomy bundle: Sevastopoulos traversability survey, Army TOP 02-2-541 teleoperated UGV mobility, DoD UGV Master Plan, SSC UGV lessons learned, autonomy test report, עמ' PDF 244–252: דוח בדיקות/הערכה לאוטונומיה
- ★ Planning Algorithms, עמ' PDF 731–802: פרק 13: Differential models: אילוצי מהירות ורכבים לא-הולונומיים, phase space, מכניקה בסיסית
- ★ Planning Algorithms, עמ' PDF 803–876: פרק 14: Sampling-based planning under differential constraints: reachability, RRT קינודינמי, תכנון משוב ותכנון מנותק (path + trajectory), אופטימיזציית מסלול
- ★ Planning Algorithms, עמ' PDF 877–940: פרק 15: System theory: DP רציף, מסלולים אופטימליים לרכבים גלגליים (Dubins/Reeds-Shepp), תורת מערכות לא-הולונומיות ו-steering
- ★ Planning Algorithms, עמ' PDF 656–700: סעיפים 12.2–12.3: לוקליזציה ומיפוי תחת אי-ודאות (רלוונטי לניווט ללא GNSS)
- ★ Present and Future of SLAM in Extreme Environments: The DARPA SubT Challenge, עמ' PDF 1–21: כולו: תפיסה תלת-ממדית ו-SLAM בשטח

### M11.17 לוחמה תת-קרקעית: גילוי מנהרות, SLAM בלי GPS ופיצוץ בחלל סגור
*Subterranean warfare: tunnel detection (GPR, seismic, microgravity), GPS-free SLAM, confined blast* · **ליבה** · 233 עמ' ספר · כ-16 שיעורים · דרישות: M11.3, M5.13

- ★ EM 1110-1-1802, Geophysical Exploration for Engineering and Environmental Investigations, עמ' PDF 13–39: פרק 3: שיטות סיסמיות (refraction, reflection, surface waves, subbottom)
- ★ EM 1110-1-1802, Geophysical Exploration for Engineering and Environmental Investigations, עמ' PDF 40–96: פרק 4: שיטות חשמליות ואלקטרומגנטיות, כולל metal detector (4-9) ו-GPR (4-10, ~עמ' 90-96)
- ★ EM 1110-1-1802, Geophysical Exploration for Engineering and Environmental Investigations, עמ' PDF 97–102: פרק 5: gravity ו-microgravity לגילוי חללים
- ★ EM 1110-1-1802, Geophysical Exploration for Engineering and Environmental Investigations, עמ' PDF 103–106: פרק 6: שיטות מגנטיות
- ★ EM 1110-1-1802, Geophysical Exploration for Engineering and Environmental Investigations, עמ' PDF 107–175: פרק 7: שיטות בתוך קידוחים, crosshole ו-surface-to-borehole (זיהוי חללים בין קידוחים)
- ★ EM 1110-1-1802, Geophysical Exploration for Engineering and Environmental Investigations, עמ' PDF 190–193: פרק 10: רעידות הנדסיות ובדיקות לא הורסות
- ★ UFC 3-340-02, Structures to Resist the Effects of Accidental Explosions, עמ' PDF 66–94: פרק 2, סעיפים 2-7 עד 2-14: תופעות הדף, שקילות TNT, קטגוריות העמסה, פיצוץ לא כלוא ו-2-14 Confined explosions (לחץ הלם פנימי ולחץ גזים, עמ׳ 80–94)
- ★ UFC 3-340-02, Structures to Resist the Effects of Accidental Explosions, עמ' PDF 391–406: פרק 2, סעיפים 2-20 עד 2-24: הלם קרקע, הלם אוויר ותנועות מבנה (רלוונטי לפיצוץ בתת-קרקע)
- ★ Present and Future of SLAM in Extreme Environments: The DARPA SubT Challenge, עמ' PDF 1–21: כולו: SLAM ללא GPS בתת-קרקע

### M11.18 Weaponeering והערכת נזק נלווה
*Weaponeering and collateral-damage estimation* · **מתקדם** · 27 עמ' ספר · כ-2 שיעורים · דרישות: M11.4, M6.7

- ★ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 70–89: 3.11–3.16: LEP/CEP/SEP, נזק חלקי צפוי, פונקציות נזק, רסיסים ורדיוס אפקטיבי
- ★ JP 3-60 Joint Targeting (2013), עמ' PDF 43–49: II, שלבים 3–4: ניתוח יכולות, weaponeering, CDE, החלטת מפקד והקצאת כוח

### M11.19 ארטילריה ואש מדויקת
*Artillery and precision fires* · **מתקדם** · 206 עמ' ספר · כ-14 שיעורים · דרישות: M11.11, M11.2

- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 212–273: פרק 8: Trajectories (חישוב מסלולים, בסיס ל-firing tables)
- ★ Ballistics: Theory and Design of Guns and Ammunition, עמ' PDF 296–315: פרקים 10–12: mass asymmetries, lateral throwoff, swerve: מקורות לפיזור. הספר כמעט אינו דן ב-dispersion/תקציב שגיאה במפורש (כמעט אין אזכורים), כיסוי חלקי
- ★ ATP 3-09.12 Field Artillery Target Acquisition (2015), עמ' PDF 11–40: פרקים 1–3: איתור מטרות לארטילריה, אש נגד (counterfire), היבטים טכניים של מכ"מי איתור נשק
- ★ FM 3-09, Fire Support and Field Artillery Operations, עמ' PDF 35–56: פרק 2: מערכת הסיוע באש: חיישנים, מערכות שיגור (קנה מול רקטות), C2 ואיתור מטרות
- ★ FM 3-09, Fire Support and Field Artillery Operations, עמ' PDF 99–116: פרק 4: מבצעי ארטילריה שדה, כולל חמש הדרישות לאש חזויה מדויקת (110–113), מיקום ותנועה, אש נגד-סוללות
- ★ FM 3-09, Fire Support and Field Artillery Operations, עמ' PDF 123–164: פרק 6: סיוע באש לעומק במלחמה בקנה מידה גדול: אש ארוכת טווח, counterfire, תפקיד הכטב"מ
- ★ FM 3-09, Fire Support and Field Artillery Operations, עמ' PDF 207–218: נספח C: פעולה בסביבה מוכחשת/מושפלת (כולל GPS/GNSS denial) וחמש הדרישות במצב מושפל

### M11.20 יסודות CBRN
*CBRN basics* · **מתקדם** · 254 עמ' ספר · כ-17 שיעורים · דרישות: M11.3

- ★ The Effects of Nuclear Weapons, עמ' PDF 396–469: פרק IX: קרינה שיורית ו-fallout — מקורות, פיזור, חיזוי, הנחתה, delayed fallout
- ★ The Effects of Nuclear Weapons, עמ' PDF 603–617: פרק XII (חלק): השפעות ביולוגיות של early fallout ו-delayed fallout
- ★ FM 3-11.9 / MCRP 3-37.1B / NTRP 3-11.32 / AFTTP(I) 3-2.55, Potential Military Chemical/Biological Agents and Compounds, עמ' PDF 17–31: פרק I: רקע ואיום
- ★ FM 3-11.9 / MCRP 3-37.1B / NTRP 3-11.32 / AFTTP(I) 3-2.55, Potential Military Chemical/Biological Agents and Compounds, עמ' PDF 32–109: פרק II: חומרי לחימה כימיים (עצבים, דם, שלפוחיות, משתקים, מקדמים) וטוקסיקולוגיה, LD50/Ct
- ★ FM 3-11.9 / MCRP 3-37.1B / NTRP 3-11.32 / AFTTP(I) 3-2.55, Potential Military Chemical/Biological Agents and Compounds, עמ' PDF 134–163: פרק IV: חומרים ביולוגיים (חיידקים, וירוסים, רעלנים)
- ★ FM 3-11.9 / MCRP 3-37.1B / NTRP 3-11.32 / AFTTP(I) 3-2.55, Potential Military Chemical/Biological Agents and Compounds, עמ' PDF 164–169: פרק V: מקורות מידע
- ★ FM 3-11.9 / MCRP 3-37.1B / NTRP 3-11.32 / AFTTP(I) 3-2.55, Potential Military Chemical/Biological Agents and Compounds, עמ' PDF 214–249: נספח H: הערכות רעילות

## חלק 12: האויב: דוקטרינה והפעלה

### M12.1 הגנה אווירית ול"א רוסיות בשטח
*Russian air defense and EW* · **ליבה** · 66 עמ' ספר · כ-4 שיעורים · דרישות: M7.1, M4.7

- ★ ATP 7-100.1 Russian Tactics (2024), עמ' PDF 100–110: IADS ו-EW בסיור ובאבטחה
- ★ ATP 7-100.1 Russian Tactics (2024), עמ' PDF 138–150: הקרב האלקטרומגנטי ותמיכה אווירית
- ★ ATP 7-100.1 Russian Tactics (2024), עמ' PDF 223–240: נספחים C, D, E, F: תמיכה אווירית, הגנה אווירית, נ"ט, EW
- ★ ATP 7-100.1 Russian Tactics (2024), עמ' PDF 255–260: נספח J: מערכות שו"ב אוטומטיות
- ◇ ATP 7-100.1 Russian Tactics (2024), עמ' PDF 163–180: מתחמי סיור-אש (recon-strike), מתוך M12.2
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 277–305: 3.2: איום ההגנה האווירית
- ⚙ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 419–429: 3.8: נשק הגנה אווירית של האיום

### M12.2 הטקטיקה הרוסית: מבנה, סיור, אש, הגנה והתקפה
*Russian tactics* · **מתקדם** · 32 עמ' ספר · כ-2 שיעורים

- ★ ATP 7-100.1 Russian Tactics (2024), עמ' PDF 13–44: מבוא ופרקים 1–2: הסביבה האסטרטגית, תולדות הצבא ומבנה הכוחות (בחירה O1: פרקי התמרון הקרקעי יצאו)
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 92–133: פרק 4: מודלי קרב דטרמיניסטיים, לנצ'סטר
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 84–114: פרק 5: מודלי שחיקה
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 205–258: פרק 5: ברברוסה, לוגיסטיקה במרחבי רוסיה

### M12.3 יכולות משולבות סיניות: חיל האוויר, הצי, כוח הרקטות, ל"מ ותקשורת
*Chinese joint capabilities* · **ליבה** · 46 עמ' ספר · כ-3 שיעורים · דרישות: M7.1

- ★ ATP 7-100.3 Chinese Tactics (2021), עמ' PDF 51–58: פרק 3
- ★ ATP 7-100.3 Chinese Tactics (2021), עמ' PDF 75–84: פרק 5: מבצעי מידע
- ★ ATP 7-100.3 Chinese Tactics (2021), עמ' PDF 217–226: נספחים C–D: הגנה אווירית ותעופה
- ★ ATP 7-100.3 Chinese Tactics (2021), עמ' PDF 229–230: נספח F: רשת ותקשורת
- ◇ ATP 7-100.3 Chinese Tactics (2021), עמ' PDF 59–74: לוחמת מערכות של צבא סין, מתוך M12.4
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 115–136: פרק 6: תורת המשחקים ומשחקי מלחמה

### M12.4 הטקטיקה הסינית: מבנה, לוחמת מערכות, הגנה והתקפה
*Chinese tactics* · **מתקדם** · 38 עמ' ספר · כ-3 שיעורים

- ★ ATP 7-100.3 Chinese Tactics (2021), עמ' PDF 13–50: מבוא ופרקים 1–2: הגישה האסטרטגית ומבנה הכוחות (בחירה O1: פרקי התמרון הקרקעי יצאו; פרק 4 נלמד ב-M12.3)
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 220–251: פרק 8: היתקלויות של כוחות הטרוגניים
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 103–114: 5.5–5.6: צבירה, ערכים ו-FATHM
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 111–157: פרק 3: מסילות ברזל ותכנון מבצעי

### M12.5 הערכת הפצת נשק גרעיני
*Nuclear proliferation assessment* · **מתקדם** · 70 עמ' ספר · כ-5 שיעורים · דרישות: M11.10

- ★ Characteristics of the Gas Centrifuge for Uranium Enrichment and Their Relevance for Nuclear Weapon Proliferation, עמ' PDF 1–25: כולו
- ★ IAEA Safeguards Glossary, 2022 Edition, עמ' PDF 34–63: פרקים 2-4 (מטרות הבטחות, מושגי safeguards, חומר גרעיני: SQ, direct-use material, enrichment, reprocessing, מתקנים); עמ' PDF = עמ' מודפס + 16
- ★ IAEA Safeguards Glossary, 2022 Edition, עמ' PDF 83–92: פרק 6: טכניקות מדידה ומתקנים
- ★ IAEA Safeguards Glossary, 2022 Edition, עמ' PDF 100–104: פרק 8: דגימות סביבתיות

## חלק 13: חלל: מסלולים, לוויינים, תקשורת לוויינית ושיגור

### M13.1 מבוא לחלל: היסטוריה, טכנולוגיה, כלכלה וקהילות החלל
*Space missions and communities* · **ליבה** · 44 עמ' ספר · כ-3 שיעורים

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 18–61: פרקים 1–2: מהי הנדסת משימת חלל, היסטוריה, TRL, כלכלה, קהילות צבאיות, אזרחיות ומסחריות

### M13.9 מטעני חלל: סוגים, ספקטרום ותכנון
*Space payloads* · **ליבה** · 16 עמ' ספר · כ-1 שיעורים · דרישות: M13.1

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 456–471: פרק 15

### M13.10 תקשורת לוויינית (SATCOM): ארכיטקטורות, תקציב קישור ותכנון מטען
*Communications payloads and SATCOM* · **ליבה** · 38 עמ' ספר · כ-3 שיעורים · דרישות: M1.4, M0.5, M13.9

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 472–509: פרק 16: ארכיטקטורות, ניתוח קישור, תכנון מטען התקשורת, משימות לדוגמה

### M13.4 מסלולים ואסטרודינמיקה: קפלר, הפרעות ותמרונים
*Orbits and astrodynamics* · **ליבה** · 27 עמ' ספר · כ-2 שיעורים · דרישות: M0.8

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 225–251: 9.3–9.7: טרמינולוגיה, הפרעות ודעיכה, מסלולים מיוחדים, תמרונים (9.1–9.2, מסלולי קפלר, נלמדים בגילואה M15.15; בעיון ב-M13.22)

### M13.12 הנעה רקטית ומשגרים: משוואת הרקטה, שלבים ומכניקת השיגור
*Rocket propulsion and launch vehicles* · **ליבה** · 32 עמ' ספר · כ-2 שיעורים · דרישות: M6.1, M13.4

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 842–873: פרק 26: בחירת משגר, היסטוריה, מכניקת השיגור, סביבת השיגור, משגרים זמינים. פרק 18 של SMAD (הנעה) חסר בסריקה: את משוואת הרקטה, השלבים וההנעה הכימית והחשמלית המורה מלמד מהידע שלו, עם רמת ודאות

### M13.11 מטעני תצפית: ביון וחישה מהחלל
*Observation payloads* · **ליבה** · 34 עמ' ספר · כ-2 שיעורים · דרישות: M3.10, M13.9

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 510–543: פרק 17: תכנון וגודל מטען תצפית, VIIRS, התפתחות

### M13.2 הנדסת משימת חלל: תהליך, קונספט, ניתוח ודרישות
*Space mission engineering process* · **עיון** · 82 עמ' ספר · כ-5 שיעורים

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 62–143: פרקים 3–6: תהליך ההנדסה, הגדרת קונספט, ניתוח משימה, דרישות ותקציבי שגיאה
- ⚙ Washburn & Kress, Combat Modeling (2009), עמ' PDF 8–20: פרק 1: סיווג מודלים וקיצורי דרך במידול

### M13.3 סביבת החלל: מזג אוויר חללי, שדה מגנטי, קרינה ופסולת
*The space environment* · **ליבה** · 22 עמ' ספר · כ-1 שיעורים · דרישות: M0.2

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 144–165: פרק 7

### M13.5 גאומטריית משימה: מבט מהחלל, כיסוי, תנועה יחסית ומיפוי
*Space mission geometry* · **ליבה** · 48 עמ' ספר · כ-3 שיעורים · דרישות: M13.4

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 166–213: פרק 8: גאומטריה כדורית, מבט על כדור הארץ, כיסוי, תנועה יחסית, תקציב מיפוי והצבעה

### M13.6 בחירת מסלול ותכנון קונסטלציה
*Orbit and constellation design* · **ליבה** · 54 עמ' ספר · כ-4 שיעורים · דרישות: M13.5

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 252–305: פרק 10: ביצועי כיסוי, תקציב Delta V, מסלולי העברה וחניה, קונסטלציות, מסלולים בין-כוכביים

### M13.7 עלות, מימון, משפט חלל והפחתת עלות
*Cost, financing, law* · **עיון** · 108 עמ' ספר · כ-7 שיעורים

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 306–413: פרקים 11–13

### M13.8 תכנון החללית: מניעים, תצורות ותקציבי מסה, הספק ודלק
*Spacecraft design* · **מתקדם** · 42 עמ' ספר · כ-3 שיעורים · דרישות: M13.6

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 414–455: פרק 14

### M13.13 קביעת כיוון ובקרה (ADCS) וניווט מסלול
*Attitude and orbit control* · **מתקדם** · 36 עמ' ספר · כ-2 שיעורים · דרישות: M0.7, M13.4

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 578–613: פרק 19

### M13.14 מחשב החללית ועיבוד על הלוויין
*Spacecraft computer systems* · **עיון** · 26 עמ' ספר · כ-2 שיעורים

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 614–639: פרק 20

### M13.15 TT&C וקישורי שליטה, ומערכת ההספק
*TT&C and power* · **ליבה** · 36 עמ' ספר · כ-2 שיעורים · דרישות: M13.10

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 640–675: פרק 21: טלמטריה, עקיבה ופיקוד; הספק

### M13.16 מבנה, מנגנונים ובקרה תרמית
*Structures and thermal control* · **עיון** · 38 עמ' ספר · כ-3 שיעורים

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 676–713: פרק 22

### M13.17 ייצור, לוגיסטיקה, סיכון ואמינות
*Manufacturing, risk and reliability* · **עיון** · 80 עמ' ספר · כ-5 שיעורים

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 714–793: פרקים 23–24
- ⚙ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 252–281: פרק 9: אמינות וזמינות
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 326–333: סיכום: לוגיסטיקה כאילוץ

### M13.18 לוויינים קטנים, CubeSat ומבנים מתנפחים
*SmallSats and CubeSats* · **מתקדם** · 48 עמ' ספר · כ-3 שיעורים · דרישות: M13.8

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 794–841: פרק 25

### M13.19 מבצעי שיגור ואתרי שיגור
*Launch operations* · **עיון** · 18 עמ' ספר · כ-1 שיעורים

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 874–891: פרק 27

### M13.20 מערכת הקרקע: אנטנות, תחנות ועיבוד נתונים
*Ground system design* · **עיון** · 24 עמ' ספר · כ-2 שיעורים · דרישות: M13.10

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 892–915: פרק 28

### M13.21 מבצעי משימה וסוף משימה
*Mission operations and end of mission* · **עיון** · 46 עמ' ספר · כ-3 שיעורים

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 916–961: פרקים 29–30

### M13.22 נספחי SMAD: נתוני חלליות, כוכבי לכת, נוסחאות מסלול וגאומטריה, זמן ויחידות
*SMAD appendices* · **עיון** · 59 עמ' ספר · כ-4 שיעורים

- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 962–1001: נספחים A–G
- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 1038–1045: טבלאות פרמטרים של לווייני כדור הארץ
- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 214–224: 9.1–9.2: מסלולי קפלר ומסלולי הירח וכוכבי הלכת (נלמדים בגילואה M15.15)

### M13.23 שליטה בחלל: טקסונומיה של יכולות נגד-חלל, מודעות למצב בחלל, פעולות קרבה, חוסן ופיזור, תלות במסחרי
*Space control: counterspace taxonomy, SDA, RPO, resilience and proliferation, commercial dependence* · **ליבה** · 0 עמ' מאמרים · כ-1 שיעורים · דרישות: M13.5, M13.6, M7.6, M4.12


### M13.24 SATCOM מוגן
*Protected SATCOM* · **מתקדם** · 48 עמ' ספר · כ-3 שיעורים · דרישות: M13.10, M4.12

- ★ EW 102, עמ' PDF 226–235: 7.6–7.8: חישובי ביצועי קישור לוויני (גאוסינכרוני ו-LEO), שיבוש קישורי לוויין: downlink ו-uplink
- ★ Space Mission Engineering: The New SMAD (2011), עמ' PDF 472–509: פרק 16: מטעני תקשורת: ארכיטקטורות, ניתוח קישור, תכנון המטען, משימות לדוגמה

## חלק 14: ניתוח הגנה: מידול לחימה, עלות, לוגיסטיקה ו-OSINT

### M14.1 מידול לחימה: סוגי מודלים ומדדי אפקטיביות, משוואות לנצ'סטר ומודל המטחים, יחסי חילוף, מודלים ומשחקי מלחמה כראיה
*Combat modeling: model types and MOEs, Lanchester and salvo attrition, exchange ratios, models and wargames as evidence* · **ליבה** · 139 עמ' ספר · כ-9 שיעורים · דרישות: M0.4, M7.1

- ★ Washburn & Kress, Combat Modeling (2009), עמ' PDF 8–20: 1.2–1.3: סוגי מודלים וקיצורי דרך
- ★ Washburn & Kress, Combat Modeling (2009), עמ' PDF 84–114: פרק 5: מודלי שחיקה, משוואות לנצ'סטר
- ★ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 92–141: פרקים 4–5: מודלי קרב דטרמיניסטיים וסטוכסטיים
- ★ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 320–329: פרק 12: מידול של מבצעים
- ◇ Przemieniecki, Mathematical Methods in Defense Analyses, 3rd ed. (2000), עמ' PDF 22–31: פרק 1: שיטות מדעיות בניתוח הגנה
- ◇ Washburn & Kress, Combat Modeling (2009), עמ' PDF 214–238: פרק 10: מודלים של טרור ומרד

### M14.7 ירי בלי משוב, תורת המשחקים ותורת החיפוש
*Shooting without feedback, game theory and search theory (Washburn & Kress ch. 2, 6, 7)* · **ליבה** · 81 עמ' ספר · כ-5 שיעורים · דרישות: M14.1

- ★ Washburn & Kress, Combat Modeling (2009), עמ' PDF 21–51: Washburn & Kress 2: ירי בלי משוב: SSKP ממרחק החטאה, כמה יריות, כמה מטרות
- ★ Washburn & Kress, Combat Modeling (2009), עמ' PDF 115–136: Washburn & Kress 6: תורת המשחקים ומשחקי מלחמה
- ★ Washburn & Kress, Combat Modeling (2009), עמ' PDF 137–164: Washburn & Kress 7: תורת החיפוש: רוחב סריקה, חוקי הגילוי, חלוקת מאמץ, מחסום ומטרות נעות

### M14.2 רכש, עלות ובסיס תעשייתי: הגדרות עלות, עלות מחזור חיים, עקומות למידה, תקציבים כנתונים, TRL/MRL, האצת ייצור וחומרים קריטיים
*Acquisition, cost and industrial base: cost definitions, LCC, learning curves, budgets as data, TRL/MRL, surge and critical materials* · **ליבה** · 53 עמ' ספר · כ-4 שיעורים · דרישות: M14.1, M7.10

- ◇ Ball, The Fundamentals of Aircraft Combat Survivability Analysis and Design, 2nd ed. (2003), עמ' PDF 139–155: 1.3.1–1.3.6: תהליך הרכש DoD 5000
- ◇ Space Mission Engineering: The New SMAD (2011), עמ' PDF 306–341: פרק 11: אומדן עלויות (פרקים 12–13, מימון ומשפט חלל, בעיון ב-M13.7)

### M14.3 לוגיסטיקה וקיימוּת: צריכה, קיבולת קווי אספקה, תחמושת מול מלאים, כשירות, לוגיסטיקה תחת איום ובמלחמת רחפנים
*Logistics and sustainment: consumption, LOC capacity, munitions vs stockpiles, readiness, contested and drone-war logistics (van Creveld promoted)* · **ליבה** · 166 עמ' ספר · כ-11 שיעורים · דרישות: M14.1

- ★ Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002), עמ' PDF 85–112: Kress 4: תהליך התכנון הלוגיסטי: מקדמי תכנון, צריכה ותגובתיות
- ★ Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002), עמ' PDF 137–160: Kress 6: חיזוי דרישות לוגיסטיות: שחיקה, צריכה ואי-ודאות
- ★ Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002), עמ' PDF 201–227: Kress 9: הצטברות כוח, טיפול ופינוי רפואי: זמן, קיבולת ואופטימיזציה
- ◇ Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002), עמ' PDF 41–47: Kress 2.4–2.5: מונחי יסוד, מודלים וכלים אנליטיים
- ★ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 164–170: פרק 4 בקיצור: הלוגיסטיקה של תוכנית שליפן
- ★ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 200–204: פרק 4: מסקנות
- ★ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 205–222: פרק 5: תכנון ברברוסה
- ★ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 251–263: פרק 5: מסקנות; פרק 6: פתיחה והמתקפה הראשונה של רומל
- ★ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 284–293: פרק 6: מסקנות; פרק 7: מנורמנדי לסיין
- ★ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 307–333: פרק 7: חזית רחבה או חוד צר, ומסקנות; פרק 8: מסקנות הספר
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 16–110: פרקים 1–2: שיטת המחסנים ונפוליאון (Kress מחליף; עיון)
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 158–163: פרק 4: פתיחה (עיון)
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 171–199: פרק 4: התוכנית המתוקנת והמרן (עיון)
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 223–250: פרק 5: לנינגרד, הדנייפר ומוסקבה (בחירה O4; עיון)
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 264–283: פרק 6: צפון אפריקה 1941–1942 (בחירה O4; עיון)
- ⚙ Van Creveld, Supplying War: Logistics from Wallenstein to Patton (1977), עמ' PDF 294–306: פרק 7: הרדיפה לגבול (בחירה O4; עיון)

### M14.4 OSINT והערכת יכולות: דימות, איכון גאוגרפי, אימות, ADS-B/AIS, הערכת סדר כוחות, הערכה כוללת והטיות ניתוח
*OSINT and capability assessment: imagery, geolocation, verification, ADS-B/AIS, OOB estimation, net assessment, analytic bias* · **ליבה** · 0 עמ' מאמרים · כ-1 שיעורים · דרישות: M3.10, M13.11, M5.5, M8.4


### M14.5 כתיבה וראיונות של אנליסט (מסכם): מבנה מאמר, ראיונות מומחים, אי-ודאות, גרפים הוגנים, ביקורת על מכוני מחקר, בדיקת AI
*Writing and interviewing as an analyst (capstone): article structure, expert interviews, uncertainty, honest charts, think-tank critique, AI-checking* · **ליבה** · 0 עמ' מאמרים · כ-1 שיעורים · דרישות: M14.1, M14.2, M14.3, M14.4


### M14.6 Kress, Operational Logistics: שאר הפרקים
*Kress, Operational Logistics: remaining chapters (reference)* · **עיון** · 155 עמ' ספר · כ-10 שיעורים

- ★ Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002), עמ' PDF 14–40: פרק 1 ו-2.1–2.3: מהי לוגיסטיקה, שלוש רמות הלוגיסטיקה
- ★ Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002), עמ' PDF 48–84: 2.6 ופרק 3: יסודות הלוגיסטיקה המבצעית ועקרונותיה
- ★ Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002), עמ' PDF 113–136: פרק 5: מידע לוגיסטי
- ★ Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002), עמ' PDF 161–200: פרקים 7–8: מודל הרשת החזותי וגמישות לוגיסטית (מדדים כמותיים)
- ★ Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002), עמ' PDF 228–254: פרק 10: אופטימיזציה של רשת הלוגיסטיקה (תכנון לינארי)

### M14.8 משחקי מלחמה
*Wargaming* · **מתקדם** · 112 עמ' ספר · כ-7 שיעורים · דרישות: M14.1

- ★ Wargaming Handbook, עמ' PDF 1–112: כולו: פרק 1 מבוא ומטרות (13), פרק 2 יסודות (31), פרק 3 סוגים וגרסאות כולל matrix ו-seminar (51), פרק 4 תהליך: תכנון, שיפוט, ניתוח ודיווח (63), נספח A יישומים בבעיות הגנה (77)

## עמודים שלא נלמדים

| מקור | עמודים | סיבה |
|---|---|---|
| EW 101 | 1–22 | שער, תוכן ופתח דבר |
| Principles of Modern Radar | 1–39 | שער, תוכן, פתח דבר ורשימות קיצורים |
| Principles of Modern Radar | 91–92 | 1.10–1.12: מבנה הספר, קריאה נוספת ומקורות |
| Principles of Modern Radar | 152–153 | דף שער לחלק |
| Principles of Modern Radar | 344–345 | דף שער לחלק |
| Principles of Modern Radar | 530–531 | דף שער לחלק |
| Principles of Modern Radar | 935–935 | עמוד ריק |
| Principles of Modern Radar | 936–941 | נספח B: תשובות לתרגילים נבחרים (משמשות את המורה בתרגילים) |
| Principles of Modern Radar | 942–962 | אינדקס |
| Principles of Modern Radar, Vol. II: Advanced Techniques | 1–25 | שער, תוכן, פתח דבר ותורמים |
| Principles of Modern Radar, Vol. II: Advanced Techniques | 42–43 | דף שער לחלק |
| Principles of Modern Radar, Vol. II: Advanced Techniques | 234–235 | דף שער לחלק |
| Principles of Modern Radar, Vol. II: Advanced Techniques | 424–425 | דף שער לחלק |
| Principles of Modern Radar, Vol. II: Advanced Techniques | 612–613 | דף שער לחלק |
| Principles of Modern Radar, Vol. II: Advanced Techniques | 728–729 | דף שער לחלק |
| Principles of Modern Radar, Vol. II: Advanced Techniques | 848–853 | תשובות לתרגילים נבחרים (משמשות את המורה בתרגילים) |
| Principles of Modern Radar, Vol. II: Advanced Techniques | 854–876 | השלמות ואינדקס |
| Principles of Modern Radar, Vol. III: Radar Applications | 1–25 | שער, תוכן, פתח דבר ותורמים |
| Principles of Modern Radar, Vol. III: Radar Applications | 804–821 | אינדקס |
| Introduction to IR and EO Systems | 1–15 | שער, תוכן ופתח דבר |
| Introduction to IR and EO Systems | 573–600 | רשימות סמלים ואינדקס |
| EW 102 | 1–17 | שער, תוכן ופתח דבר |
| EW 102 | 276–291 | ביבליוגרפיה ואינדקס |
| Understanding GPS | 1–16 | שער, תוכן ופתח דבר |
| Understanding GPS | 651–665 | 12.1–12.4: שווקים, יישומים אזרחיים ומיפוי |
| Understanding GPS | 667–669 | 12.6–12.8: שירותים מסחריים ו-LBS |
| Understanding GPS | 673–678 | 12.10–12.11: ציוד לפי שוק ותחזיות פיננסיות |
| Understanding GPS | 691–723 | על המחברים ואינדקס |
| Missile Guidance and Control Systems | 1–15 | שער, תוכן ופתח דבר |
| Missile Guidance and Control Systems | 678–681 | אינדקס |
| Air and Missile Defense Systems Engineering | 1–21 | שער, תוכן, רשימות איורים ופתח דבר |
| Air and Missile Defense Systems Engineering | 264–268 | קיצורים וכריכה |
| Military Avionics Systems | 1–24 | שער, תוכן ופתח דבר |
| Military Avionics Systems | 503–539 | ביבליוגרפיה, מילון ואינדקס |
| Introduction to UAV Systems | 1–34 | שער, תוכן ופתח דבר |
| Introduction to UAV Systems | 79–80 | דף שער לחלק |
| Introduction to UAV Systems | 191–192 | דף שער לחלק |
| Introduction to UAV Systems | 245–246 | דף שער לחלק |
| Introduction to UAV Systems | 323–324 | דף שער לחלק |
| Introduction to UAV Systems | 395–396 | דף שער לחלק |
| Introduction to UAV Systems | 453–457 | אינדקס |
| Principles of Naval Weapons Systems | 1–12 | שער ותוכן |
| Principles of Naval Weapons Systems | 63–74 | פרק 5: יסודות מחשבים |
| Tanks: 100 Years of Evolution | 1–7 | שער ותוכן |
| Tanks: 100 Years of Evolution | 11–12 | תודות |
| Tanks: 100 Years of Evolution | 362–426 | הערות ואינדקס |
| ATP 7-100.1 Russian Tactics (2024) | 1–12 | שער ותוכן |
| ATP 7-100.1 Russian Tactics (2024) | 276–280 | מילון ואינדקס |
| ATP 7-100.3 Chinese Tactics (2021) | 1–12 | שער ותוכן |
| ATP 7-100.3 Chinese Tactics (2021) | 247–252 | מילון ואינדקס |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 1–8 | שער ותוכן |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 10–10 | עמוד ריק |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 105–112 | נספחים B–C: יומן ירי ואימון מובנה |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 119–122 | נספח E: דרישות תמיכה |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 142–144 | מילון ומקורות |
| Space Mission Engineering: The New SMAD (2011) | 1–17 | שער, תוכן, הקדמה ומחברים |
| Space Mission Engineering: The New SMAD (2011) | 544–577 | כפילות של עמ' PDF 510–543 (פרק 17) בסריקה, במקום פרק 18 |
| Space Mission Engineering: The New SMAD (2011) | 1002–1037 | אינדקס |
| Space Mission Engineering: The New SMAD (2011) | 1046–1067 | כפילות של פרק 5 (עמ' 83–104) בסוף הסריקה |
| Fleeman, Tactical Missile Design (2001) | 1–18 | שער, תוכן, פתח דבר והקדמה |
| ATP 3-01.81 Counter-Unmanned Aircraft System (2023) | 1–6 | שער, תוכן והקדמה |
| ATP 3-01.81 Counter-Unmanned Aircraft System (2023) | 43–46 | נספח A: משאבי אימון |
| ATP 3-01.81 Counter-Unmanned Aircraft System (2023) | 50–58 | מילון ומקורות |
| Pozar, Microwave Engineering, 4th ed. (2012) | 1–20 | שער, הקדמה ותוכן |
| Pozar, Microwave Engineering, 4th ed. (2012) | 742–744 | תשובות לתרגילים נבחרים (משמשות את המורה בתרגילים) |
| Pozar, Microwave Engineering, 4th ed. (2012) | 745–756 | אינדקס |
| Orfanidis, Electromagnetic Waves and Antennas (2004) | 1–13 | שער, תוכן והקדמה |
| Orfanidis, Electromagnetic Waves and Antennas (2004) | 392–406 | מקורות (ה-PDF נגמר לפני האינדקס) |
| Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012) | 1–15 | שער, הקדמה ותוכן |
| Zarchan, Tactical and Strategic Missile Guidance, 6th ed. (2012) | 984–1000 | אינדקס (חלקי: ה-PDF נגמר באות B) |
| Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002) | 1–13 | שער, תוכן, הקדמה ותודות |
| Kress, Operational Logistics: The Art and Science of Sustaining Military Operations (2002) | 255–257 | אינדקס |
| Hero, Statistical Methods for Signal Processing, EECS 564 notes (2016) | 1–8 | שער ותוכן |
| Hero, Statistical Methods for Signal Processing, EECS 564 notes (2016) | 9–82 | פרקים 1–4 ו-5.1–5.3: מבוא, אלגברה לינארית, ריבועים פחותים (M0.6), התפלגויות ושערוך בייסיאני (גילואה) |
| Hero, Statistical Methods for Signal Processing, EECS 564 notes (2016) | 112–392 | 5.6 ואילך: פרמטרים מטרידים, שערוך לינארי וקלמן (M2.15), תורת הגילוי ומבחני השערות (M2.10, M2.11, גילואה) |
| ESA TM-23, GNSS Data Processing, Vol. I: Fundamentals and Algorithms (2013) | 1–10 | שער, תוכן והקדמה |
| ESA TM-23, GNSS Data Processing, Vol. I: Fundamentals and Algorithms (2013) | 215–238 | רשימת קיצורים, ביבליוגרפיה ואינדקס |
| ESA TM-23, GNSS Data Processing, Vol. II: Laboratory Exercises (2013) | 1–8 | שער, תוכן והקדמה |
| ESA TM-23, GNSS Data Processing, Vol. II: Laboratory Exercises (2013) | 331–344 | רשימת קיצורים, ביבליוגרפיה ואינדקס |
| JP 3-60 Joint Targeting (2013) | 1–18 | שער, הקדמה, שינויים, תוכן ותקציר מנהלים |
| JP 3-60 Joint Targeting (2013) | 19–30 | פרק I: הגדרות של מטרה ושל מחזור המטרות (מסוכמות בפרק II) |
| JP 3-60 Joint Targeting (2013) | 67–86 | פרק III: חלוקת אחריות וארגון בכוח המשותף |
| JP 3-60 Joint Targeting (2013) | 87–94 | נספח A: היבטים משפטיים |
| JP 3-60 Joint Targeting (2013) | 95–108 | נספחים B–C: מערכות מידע לניהול מטרות ותהליכי הזרועות |
| JP 3-60 Joint Targeting (2013) | 109–118 | נספח D: תהליך ההערכה |
| JP 3-60 Joint Targeting (2013) | 119–138 | מקורות, הוראות מנהלתיות ומילון |
| Principles of Modern Radar, Vol. II: Advanced Techniques | 26–41 | כרך II, פרק 1: סקירה של הטכניקות המתקדמות, שנלמדות במלואן ב-M2.16–M2.39 |
| Principles of Modern Radar, Vol. III: Radar Applications | 26–41 | כרך III, פרק 1: סקירת יישומי מכ"ם, שנלמדים במלואם ב-M2.20–M2.28 |
| EW 102 | 94–98 | 4.1: הספקטרום (כפילות: Driggers 1 ו-5 ב-M3.1) |
| Understanding GPS | 577–578 | 10.2: שירותי Galileo בפירוט (תיאור מ-2006) |
| Understanding GPS | 587–592 | 10.3.2–10.3.3: אפנון ותוכנית אותות החיפוש וההצלה |
| Understanding GPS | 598–612 | 10.5–10.7: מקטעי Galileo, ארכיטקטורת SAR ותוכנית הפיתוח (2006) |
| Understanding GPS | 615–621 | 11.1.5–11.1.8: חלליות, תמיכה קרקעית וציוד משתמש של GLONASS |
| Understanding GPS | 629–632 | 11.1.11–11.2.4: עתיד GLONASS ותולדות BeiDou |
| Understanding GPS | 635–650 | 11.2.8–11.3: שירותי RDSS ו-QZSS (תיאור מ-2006; המצב העדכני ממסמכי ICD ברשימת הקריאה) |
| Missile Guidance and Control Systems | 666–673 | נספח G: חתכי חרוט (כפילות עם גילואה: Anderson 8, M15.15) |
| Military Avionics Systems | 37–47 | 1.4–1.5: מפציץ אסטרטגי וסיור ימי (תיאור תפקידים) |
| Military Avionics Systems | 59–64 | 1.10–1.11: תדלוק אווירי ותובלה |
| Military Avionics Systems | 67–70 | 1.13–1.15: אימון, תפקידים מיוחדים וסיכום |
| Military Avionics Systems | 84–106 | 2.2–2.5: אפיקים, JIAWG, COTS ומערכות הפעלה (מעבר ליעד) |
| Military Avionics Systems | 122–134 | 3.1–3.4: עקרונות ואופני מכ"ם במטוס (כפילות: PoMR 1–2, נלמדים במלואם ב-M2.13, M2.16) |
| Military Avionics Systems | 151–192 | 3.8, 4.1–4.5: עקיבה, דחיסת פולס, פולס-דופלר, אנטנות ו-SAR במטוס (כפילות: PoMR 17–21, PoMR III 5; אנטנות: Orfanidis ב-M1.2) |
| Military Avionics Systems | 205–207 | 5.1: מבוא ל-EO (כפילות: Driggers 1) |
| Military Avionics Systems | 263–268 | 6.4: ECM ו-ECCM (כפילות: EW 101 9.1–9.4) |
| Military Avionics Systems | 303–313 | 8.1–8.5: ניווט אינרציאלי במטוס (מוחלף ב-Woodman, M5.8) |
| Military Avionics Systems | 357–390 | 9.2–9.7: תיאורי פלטפורמות (F-16, Apache, Typhoon, F-22, Nimrod, F-35) |
| Introduction to UAV Systems | 35–39 | 1.1–1.2: היסטוריה |
| Introduction to UAV Systems | 44–58 | 1.4–1.8: דוגמאות של מערכות |
| Introduction to UAV Systems | 66–78 | 2.3–2.4: דוגמאות לפי גודל |
| Introduction to UAV Systems | 81–103 | פרק 3 ו-4.1: אווירודינמיקה בסיסית (כפילות עם גילואה: Anderson, M15.5–M15.10) |
| Introduction to UAV Systems | 112–151 | 4.5–6.5.4: טיפוס, גלישה, יציבות ובקרה, מנועי בוכנה וטורבינה (כפילות עם גילואה: M15.11–M15.16) |
| Introduction to UAV Systems | 163–190 | שאלות פרק 6 ופרק 7: מבנה (כפילות עם גילואה P16) |
| Introduction to UAV Systems | 247–262 | 10.1–10.3: גילוי, זיהוי והזדהות מכטב"ם (כפילות: Driggers 14, M3.10) |
| Introduction to UAV Systems | 269–278 | 10.5 (כפילות: Driggers 14) |
| Principles of Naval Weapons Systems | 27–31 | דיפול, קיטוב ועיצוב אלומה (מוחלף ב-Orfanidis, M1.1) |
| Principles of Naval Weapons Systems | 89–100 | פרקים 8–9: מכ"ם פולסי ו-CW (כפילות: PoMR 1–2, M2.20) |
| Principles of Naval Weapons Systems | 103–110 | פרק 9: CW ו-FMCW (כפילות: M2.20) |
| Principles of Naval Weapons Systems | 111–134 | פרק 10–11: MTI, דחיסת פולס, SAR, מערך מופע ועקיבה (כפילות: PoMR 17–21; מערך מופע: Orfanidis ב-M1.2) |
| Principles of Naval Weapons Systems | 137–158 | פרקים 12–13: מקורות קרינה והתפשטות (כפילות: Driggers 1, 5) |
| Principles of Naval Weapons Systems | 243–252 | פרק 20: ניווט אינרציאלי (מוחלף ב-Woodman, M5.8) |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 9–9 | מבוא |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 11–18 | פרק 1: ארגון איתור המטרות (דוקטרינה תיאורית) |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 41–50 | פרק 4: אופן ההפעלה (נהלים) |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 97–104 | נספח A (נהלים) |
| ATP 3-09.12 Field Artillery Target Acquisition (2015) | 123–130 | נספח F: כלים ונהלים |
| ATP 7-100.1 Russian Tactics (2024) | 45–99 | בחירה O1: פרקים 3–4, כוחות היבשה, סיור ואבטחה |
| ATP 7-100.1 Russian Tactics (2024) | 111–137 | בחירה O1: פרק 5 עד הקרב האלקטרומגנטי |
| ATP 7-100.1 Russian Tactics (2024) | 151–162 | בחירה O1: פרק 6 עד מתחמי הסיור-אש |
| ATP 7-100.1 Russian Tactics (2024) | 181–222 | בחירה O1: פרקים 6–7 ונספחים A–B |
| ATP 7-100.1 Russian Tactics (2024) | 241–254 | בחירה O1: נספחים G–I |
| ATP 7-100.1 Russian Tactics (2024) | 261–275 | בחירה O1: נספח K |
| ATP 7-100.3 Chinese Tactics (2021) | 85–216 | בחירה O1: פרקים 6–9 ונספחים A–B |
| ATP 7-100.3 Chinese Tactics (2021) | 227–228 | בחירה O1: נספח E |
| ATP 7-100.3 Chinese Tactics (2021) | 231–246 | בחירה O1: נספח G |

## מקורות חסרים

מקורות שהתוכנית ביקשה (`docs/research/round7/mapping/`), שאינם בספרייה ולא יגיעו.

| מקור | מה מכסה במקומו | מה נשאר פתוח |
|---|---|---|
| Kay, Fundamentals of Statistical Signal Processing, Vol. I–II | Hero, EECS 564 (B22), 5.4–5.5, ב-M2.40 | בחלקו: חסם קרמר-ראו הסקלרי והמטריצי ו-ML נלמדים מ-Hero; הדוגמאות של השהיה, תדר וזווית (Kay 3.11) נגזרות בשיעור מ-PoMR 18.5–18.10. המודול נמצא ב-P2 ולא ב-M0.6, כי מודולי P0 לא משתנים |
| Balanis, Antenna Theory, 4th ed. | Orfanidis (B19), פרקים 13–15, 17.6, 18–19, 21, ב-M1.1, M1.2 | נסגר. ב-PDF של Orfanidis חסר פרק 12 (פרמטרי S; נלמד מ-Pozar 4.3 ב-M1.5) וחסרים כמה עמודים בתחילת פרק 8 |
| Groves, Principles of GNSS, Inertial, and Multisensor Integrated Navigation, 2nd ed. | Woodman TR-696 (A05.6) ו-ESA TM-23 (B23) ב-M5.8; ESA (B23, B24) בעיון ב-M5.12 | בחלקו: מסגרות והמרות, שגיאות חיישנים, strapdown והתפשטות שגיאה נסגרים. שילוב GNSS/INS ברמת תכן (Groves 14, מסנן מצב-שגיאה) נשען על Kaplan 9.1–9.2 ו-Moir 8.8–8.9, ולכן Moir 8.8–8.9 נשאר |
| Liggins, Hall & Llinas, Handbook of Multisensor Data Fusion, 2nd ed. | — | פתוח: מודל JDL להתכת מידע (M7.11) בלי מקור; המורה מלמד אותו מהידע שלו, עם רמת ודאות |
| Driels, Weaponeering, 3rd ed. | Przemieniecki 3.11–3.16 (B15) ב-M11.4 | בחלקו: CEP→Pk ושטח קטלני נלמדים מ-Przemieniecki; מתודולוגיית JMEM פתוחה |
| Murthy & Manoj, Ad Hoc Wireless Networks | — | פתוח: ניתוב ב-MANET (DSDV, AODV, OLSR) ב-M7.9 בלי מקור. ניתוב LS/DV ו-802.11 נלמדים בגילואה (Kurose & Ross) |
| Hughes, A Salvo Model of Warships in Missile Combat (1995) | — | פתוח: מודל ה-salvo ממקור ראשוני (M14.1, M10.2); Washburn & Kress 5 נותן את משוואות לנצ'סטר |
| Urick, Principles of Underwater Sound, 3rd ed. | — | פתוח: משוואת הסונאר ואובדן התפשטות מעל רמת USNA (M10.2); לא ברשימת הספרים שהלומד מביא |
| SMAD (2011), עותק מלא | — | פתוח: פרק 18 (הנעה בחלל) חסר בסריקה; M13.12 נלמד מפרק 26 ומהידע של המורה |
| Bar-Shalom, Li & Kirubarajan, Estimation with Applications to Tracking and Navigation | — | לא נדרש בלנצ'סטר: העקיבה נלמדת מ-PoMR 19, PoMR II 15, Arulampalam ו-Vo. Särkkä נשאר ב-library/incoming לגילואה |

## בדיקת כיסוי

- ⚠️ Aircraft Design: A Conceptual Approach: עמודים לא ממופים 1-12, 99-103, 123-173, 207-236, 266-391
- ⚠️ Ballistics: Theory and Design of Guns and Ammunition: עמודים לא ממופים 1-17, 484-514
- ⚠️ Introduction to Electromagnetic Compatibility: עמודים לא ממופים 1-72, 115-400, 445-489, 510-526, 583-736, 883-1014
- ⚠️ Design and Analysis of Modern Tracking Systems: עמודים לא ממופים 1-360
- ⚠️ E03: עמודים לא ממופים 1-374, 398-400, 424-573
- ⚠️ E31: עמודים לא ממופים 1-282, 306-447
- ⚠️ E34: עמודים לא ממופים 1-471, 488-542, 574-588, 598-618, 621-634, 650-669, 690-775
- ⚠️ E39: עמודים לא ממופים 1-167, 177-269, 278-525, 572-581, 621-768
- ⚠️ Effects of Directed Energy Weapons: עמודים לא ממופים 1-25, 54-105, 286-369
- ⚠️ Quantization and Training of NNs for Integer-Arithmetic-Only Inference; Towards Deep Learning Models Resistant to Adversarial Attacks; Benchmarking NN Robustness to Common Corruptions: עמודים לא ממופים 1-14
- ⚠️ The Effects of Nuclear Weapons: עמודים לא ממופים 1-395, 470-602, 618-662
- ⚠️ Absolute Positioning Using the Earth's Magnetic Anomaly Field (PhD dissertation): עמודים לא ממופים 1-20, 174-264
- ⚠️ The Role of Autonomy in DoD Systems: עמודים לא ממופים 1-30, 78-126
- ⚠️ NIST/SEMATECH e-Handbook of Statistical Methods (chapters 5, 7, 8 only): עמודים לא ממופים 443-598
- ⚠️ Statistics, Testing, and Defense Acquisition: New Approaches and Methodological Improvements: עמודים לא ממופים 1-51, 127-277
- ⚠️ Department of Defense Law of War Manual: עמודים לא ממופים 1-225, 475-1236
- ⚠️ IAEA Safeguards Glossary, 2022 Edition: עמודים לא ממופים 1-33, 64-82, 93-99, 105-320
- ⚠️ EM 1110-1-1802, Geophysical Exploration for Engineering and Environmental Investigations: עמודים לא ממופים 1-12, 176-189, 194-208
- ⚠️ Planning Algorithms: עמודים לא ממופים 1-655, 701-730, 941-1023
- ⚠️ Autonomous Vehicles in Support of Naval Operations: עמודים לא ממופים 1-29, 134-188, 205-233
- ⚠️ FM 3-09, Fire Support and Field Artillery Operations: עמודים לא ממופים 1-34, 57-98, 117-122, 165-206, 219-284
- ⚠️ UFC 3-340-02, Structures to Resist the Effects of Accidental Explosions: עמודים לא ממופים 1-65, 95-390, 407-1982
- ⚠️ MIL-STD-461G (pp 1-280) and MIL-STD-464C (pp 281-445) bundled: עמודים לא ממופים 1-40, 174-297, 322-338, 372-378, 386-403, 412-445
- ⚠️ Naval Mine Warfare: Operational and Technical Challenges for Naval Forces: עמודים לא ממופים 1-18, 179-279
- ⚠️ FM 3-11.9 / MCRP 3-37.1B / NTRP 3-11.32 / AFTTP(I) 3-2.55, Potential Military Chemical/Biological Agents and Compounds: עמודים לא ממופים 1-16, 110-133, 170-213, 250-318
- ⚠️ Architecture and organization classics: Conway 1968; Parnas 1972; Brooks, No Silver Bullet 1986; Ulrich 1995; MacCormack, Rusnak & Baldwin, mirroring 2008: עמודים לא ממופים 5-61
- ⚠️ Middleware standards, core sections: OMG DDS 1.4 (overview, design rationale, QoS); OASIS MQTT 5.0 (introduction, operational behavior, security): עמודים לא ממופים 38-73
- ⚠️ AI security papers: NIST AI 100-2e2025; OWASP Top 10 for LLM Applications 2025; Greshake et al. 2023; Beurer-Kellner et al. 2025; Debenedetti et al., CaMeL 2025; Carlini et al. 2021; Shokri et al. 2017; Abadi et al., DP-SGD 2016; Gu et al., BadNets 2017; Hubinger et al., Sleeper Agents 2024; Fang et al. 2024; Zhang et al., Cybench 2025; Anthropic, AI-orchestrated espionage 2025: עמודים לא ממופים 1-109, 123-262, 272-283
