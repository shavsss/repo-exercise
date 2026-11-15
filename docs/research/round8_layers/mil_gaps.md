# לנצ'סטר: ביקורת פערים, סדר דרישות קדם ותלויות בגילואה (15.11.2026)

**קלט:** `tmp/syllabus/mil_modules.txt`, `mil_docs.txt`, `eng_modules.txt`, היעדים ב-`docs/research/round5/expert/E2_domain_targets.md` (20 תחומי MIL), והמיפוי ב-`docs/research/round7/mapping/` (MIL_mapping, BOOKS, SYNTHESIS). בדקתי גם את גרף החלקים (`partgraph.py`) ואת תוכן `library/military/`.

**מה לא נכלל כממצא:** כל מה שהלומד כבר הציע (P0 עם M0.8; הרחבת M5.11 ומודול SoOP ושעונים אטומיים; שני מודולי אנרגיה מכוונת; בלוק האוויוניקה, קשרי הנתונים, AI בקצה, CEMA ו-EMC; 6 מודולים ימיים; 5 מודולים יבשתיים). להם יש מקורות בסעיף 4.

**מוסכמה:** `L:` מודול לנצ'סטר, `E:` מודול גילואה, `G#` פער מהדוח הזה. "חובה" = בלי זה אין רמת מומחה בתחום לפי E2. "רצוי" = מחזק, אבל אפשר להגיע לרמת מומחה בלעדיו.

---

## 0. ממצאי רקע שמשנים את התמונה

1. **ספרים שהמיפוי תכנן ולא נכנסו לרשימת המודולים.** ב-MIL_mapping תוכננו Murthy & Manoj (MANET), Liggins, Hall & Llinas (היתוך), Driels (Weaponeering), Urick ו-Hughes (ימי), Balanis ו-Groves. אף אחד מהם לא נמצא ב-`library/military/`, ואף מודול לא מפנה אליהם. בפועל: M7.9 (Link 16, ‏C2 ולוחמה מרושתת) הוא 8 עמודים, ואין מודול MANET ואין מודול היתוך. לכן חלק מהפערים כאן הם פערים "ידועים" שנפלו בדרך מהמיפוי לרשימה.
2. **עשרה מודולי ליבה בלי עמוד מקור (0p):** M3.12, M6.9, M8.3, M8.9, M9.9, M10.5, M13.23, M14.2, M14.4, M14.5. לחלקם יש מקור במאגר שלא שויך (A03.1 ל-M3.12, A06.2 ל-M6.9, A08.1 ל-M8.3, A10.2–A10.4 ל-M10.5). מקורות לכולם בסעיף 1.ב.
3. **אין בגילואה ראייה ממוחשבת, הידרודינמיקה ימית, בליסטיקה, תכנון ניסויים או אבטחת מידע.** כמה מהמודולים שהלומד הציע (VIO, ‏DSMAC, ‏ATR בקצה, תפיסה ל-UGV, צוללות, CEMA) נשענים על הנושאים האלה. לכן חלק מהפערים הם פערים חוצי-מעבדות (G20, ‏G21, ‏G7, ‏G15).
4. **סדר השכבות בגילואה:** תרמו (P13), מעבר חום (P14) וזורמים (P15) הם שכבות 11–13, כלומר מאוחרים מאוד. לעומת זאת, טילים בלנצ'סטר (P6) נמצאים בשכבה 4. אי אפשר ללמד את M6.2 ו-M6.12 ברמת מומחה לפני E:P15. ההמלצה: לפצל את P6 (סעיף 3).

---

## 1. פערים

### 1.א פערים בתוכן (נושאים שאף מודול, קיים או מוצע, לא מלמד בעומק ליבה)

#### תקשורת, היתוך ושו"ב

**G1. Tactical networks: MANET, mesh radios and capacity under jamming** · **חובה**
- **תוכן:** ניתוב פרואקטיבי וריאקטיבי (OLSR, ‏AODV, ‏DSDV), ‏MAC ב-TDMA ו-CSMA, תפוקה והשהיה מול מספר קפיצות, גבול Gupta–Kumar, רדיו mesh טקטי (MANET waveforms), ‏DTN, ורשת תחת שיבוש.
- **מיקום:** בבלוק קשרי הנתונים שהלומד הציע, לפני מודול Link 16/VMF/MADL (ואחרי L:M7.9).
- **דרישות קדם:** L:M0.5, ‏L:M4.11, ‏L:M7.9, ‏E:M23.13, ‏E:M23.14, ‏E:M23.15, ‏E:M21.5.
- **מקור:** Murthy & Manoj, *Ad Hoc Wireless Networks: Architectures and Protocols* (Prentice Hall, 2004), פרקים 5–7 ו-10; ‏Gupta & Kumar, "The Capacity of Wireless Networks", IEEE Trans. Inf. Theory 46(2), 2000.
- **היקף:** כ-170 עמודים.
- **למה זה פער:** E2 מגדיר "ניתוב ב-MANET" ב"מה מחזיקים בראש", ו-MIL_mapping תכנן את Murthy & Manoj. הם לא נכנסו לרשימה. "swarm protocols" בבלוק המוצע לא מחליף את זה: נחיל הוא מקרה פרטי של MANET. אוקראינה (רדיו mesh בדרג טקטי, Starlink כשדרה) הופכת את זה לליבה.

**G2. Protected and resilient SATCOM** · **רצוי**
- **תוכן:** תקציב לינק עם הפרעה ושיבוש, ‏transponder שקוף מול מעבד-על-הלוויין, אנטנות nulling, ‏beam hopping, ‏PTW/MUOS, וחוסן של LEO מרובה לוויינים (Starlink באוקראינה).
- **מיקום:** אחרי L:M13.10, ולהעביר את L:M4.12 לאותו מקום (ראו O4).
- **דרישות קדם:** L:M13.10, ‏L:M4.12, ‏L:M1.2, ‏E:M23.3.
- **מקור:** Maral, Bousquet & Sun, *Satellite Communications Systems*, מהדורה 6 (Wiley, 2020), פרקים 5 ו-9 (נבחרים).
- **היקף:** כ-120 עמודים.

**G3. Multisensor data fusion and the common operational picture** · **חובה**
- **תוכן:** מודל JDL ‏(רמות 0–4), היתוך track-to-track, ‏covariance intersection, רישום והטיות חיישנים (registration), היתוך זיהוי (Bayes ו-Dempster–Shafer), ‏COP מרובה חיישנים, ומדדי איכות תמונה.
- **מיקום:** אחרי L:M2.29, או בתחילת P7 לפני L:M7.11.
- **דרישות קדם:** L:M2.29, ‏L:M5.8, ‏E:M5.14, ‏E:M6.7.
- **מקור:** Liggins, Hall & Llinas, *Handbook of Multisensor Data Fusion*, מהדורה 2 (CRC, 2009), פרקים 1–3 ו-12–14 (נבחרים). חלופה: Bar-Shalom, Willett & Tian, *Tracking and Data Fusion: A Handbook of Algorithms* (YBS, 2011).
- **היקף:** כ-180 עמודים.
- **למה זה פער:** M2.29 עוסק במעקב רב-מטרות (34 עמודים מ-PoMR II). היתוך ברמת המערכת, זה ש"שרשרת ההשמדה" נשענת עליו, לא נלמד באף מקום. המיפוי תכנן את Liggins פרק 2, אבל זה לא נכנס.

**G4. C2 and battle management: kill-chain automation and human–machine teaming** · **חובה**
- **תוכן:**
  - ארכיטקטורות שו"ב: Aegis, ‏CEC, ‏IBCS, ‏JADC2.
  - "מפעל מטרות" ומערכות תומכות החלטה מבוססות AI.
  - תקציב השהיה מחיישן לירי (sensor-to-shooter), ‏OODA כמודל השהיה.
  - ניהול איסוף ו-PED.
  - automation bias, עומס מפעיל, human-in/on-the-loop.
- **מיקום:** אחרי L:M7.11, ולפני בלוק האוויוניקה וקשרי הנתונים שהלומד הציע (או בסופו).
- **דרישות קדם:** L:M7.9, ‏L:M7.11, ‏G3, ‏E:M27.4, ‏E:M27.6.
- **מקור:** Alberts & Hayes, *Understanding Command and Control* (CCRP, 2006; פתוח); ‏Parasuraman & Riley, "Humans and Automation: Use, Misuse, Disuse, Abuse", Human Factors 39(2), 1997; ‏CRS R46725, *Joint All-Domain Command and Control* (מהדורה עדכנית).
- **היקף:** כ-150 עמודים.
- **למה זה פער:** E2 שם F2T2EA, השהיות, VoI וארכיטקטורות C2 בראש. היום יש רק M7.11 (מחזור המטרות כתהליך). ה-AI בקצה שהלומד הציע עוסק בחומרה ובהשהיה של ATR, לא בשו"ב.

#### טילים, הנעה והגנה אווירית

**G5. Missile propulsion: solid rocket motors and air-breathing (ramjet, ducted rocket, scramjet)** · **חובה**
- **תוכן:**
  - מנוע רקטי מוצק: בליסטיקה פנימית, חוק קצב שריפה, גאומטריית גרעין, שריפה ארוזיבית, אי-יציבות בעירה, נחיר וחומרי הגנה תרמית.
  - נשימת אוויר: ramjet, ‏ducted rocket ו-scramjet, כולל מחזור, ‏inlet ו-unstart.
- **מיקום:** אחרי L:M6.12. צריך להקדים את L:M13.12 לפניו (ראו O3).
- **דרישות קדם:** L:M13.12, ‏L:M6.12, ‏E:M15.16, ‏E:M15.24, ‏E:M13.13.
- **מקור:** Sutton & Biblarz, *Rocket Propulsion Elements*, מהדורה 9 (Wiley, 2017), פרקים 12–15; ‏Heiser & Pratt, *Hypersonic Airbreathing Propulsion* (AIAA, 1994), פרקים 1, 2 ו-5.
- **היקף:** כ-250 עמודים.
- **למה זה פער:** התחום נקרא "Missiles: propulsion, …". היום ההנעה נלמדת רק דרך ה-trades של Fleeman, ‏32 עמודים מ-SMAD ו-Hill & Peterson בגילואה, שמכסה טורבינות ורקטות באופן כללי. איומים היפרסוניים ו-ramjet (Meteor, ‏BrahMos) דורשים עומק.

**G6. Hypersonic threats and defense** · **חובה**
- **תוכן:**
  - ביצועי HGV ו-HCM (מודל Tracy–Wright).
  - שכבת חיישנים בחלל (OPIR, ‏HBTSS).
  - מעקב מטרה מתמרנת (IMM).
  - יירוט בשלב הדאייה, מעטפת פלזמה ו-RF blackout.
  - מקרי בוחן: Kinzhal, ‏Oreshnik, ‏Fattah.
- **מיקום:** אחרי L:M7.7. בנוסף, צריך לשייך מקור ל-L:M6.9 (היום 0p).
- **דרישות קדם:** L:M6.9, ‏L:M7.7, ‏L:M2.29, ‏L:M13.11, ‏E:M15.17, ‏E:M5.14.
- **מקור:** Tracy & Wright, "Modeling the Performance of Hypersonic Boost-Glide Missiles", Science & Global Security 28(3), 2020; ‏Acton (2015, ‏A06.2, כבר במאגר); ‏CRS R45811, *Hypersonic Weapons: Background and Issues for Congress* (עדכני); ‏Li & Jilkov, "Survey of Maneuvering Target Tracking, Part I", IEEE TAES 39(4), 2003.
- **היקף:** כ-120 עמודים.

**G12. Rocket, artillery and mortar defense (C-RAM)** · **רצוי**
- **תוכן:** חיזוי נקודת פגיעה, חלון התקיפה בזמן טיסה קצר, מדיניות "יירוט רק מה שמאיים", וכלכלה של Iron Dome-class.
- **מיקום:** אחרי L:M7.5.
- **דרישות קדם:** L:M7.4, ‏L:M2.22, ‏G7.
- **מקור:** Rubin, *Israel's Air and Missile Defense During the 2014 Gaza War* (BESA, Mideast Security and Policy Studies 111, 2015); ‏ATP 3-01.60 / CSIS Missile Threat לנתונים.
- **היקף:** כ-60 עמודים.

#### אפקטים, נשק ויבשה

**G7. Gun and projectile ballistics (interior, exterior, terminal)** · **חובה**
- **תוכן:** משוואות בליסטיקה פנימית (Résal, ‏Lagrange gradient), שחיקת קנה, בליסטיקה חיצונית ב-6-DOF וב-modified point mass (נגזרות אווירודינמיות, יציבות ג'ירוסקופית ודינמית), וחדירה (Lambert–Jonas, ‏Tate).
- **מיקום:** מחליף ומרחיב את L:M11.1 (12 עמודים היום).
- **דרישות קדם:** E:M2.7, ‏E:M13.13, ‏E:M15.23, ‏E:M16.5.
- **מקור:** Carlucci & Jacobson, *Ballistics: Theory and Design of Guns and Ammunition*, מהדורה 3 (CRC, 2018), נבחרים מכל שלושת החלקים. תוספת ל-6-DOF: McCoy, *Modern Exterior Ballistics* (Schiffer, 1999).
- **היקף:** כ-280 עמודים.

**G8. Warhead mechanics and fuzing** · **חובה**
- **תוכן:** משוואות Gurney, ‏Mott לפיזור רסיסים, קנה מידה של הדף (Hopkinson–Cranz, ‏Kingery–Bulmash), היווצרות סילון במטען חלול ו-EFP, ‏Tate, ‏proximity fuze (RF ולייזר), תיאום fuze–warhead, ו-insensitive munitions.
- **מיקום:** מרחיב את L:M11.3 (18 עמודים היום), אחרי G7.
- **דרישות קדם:** G7, ‏L:M11.3, ‏E:M15.23, ‏E:M16.22.
- **מקור:** Carleone (ed.), *Tactical Missile Warheads* (AIAA Progress in Astronautics and Aeronautics vol. 155, 1993); ‏Walters & Zukas, *Fundamentals of Shaped Charges* (Wiley, 1989); ‏Kinney & Graham, *Explosive Shocks in Air*, מהדורה 2 (Springer, 1985).
- **היקף:** כ-220 עמודים (נבחרים).
- **למה זה פער:** E2 שם את Gurney בראש. בפועל, 18 עמודים מ-Hall הם רמת USNA, לא רמת מומחה.

**G9. Weaponeering and collateral damage estimation** · **רצוי**
- **תוכן:** מתודולוגיית JMEM, ‏target vulnerability, מספר הנשקים הנדרש, ‏CDE בעקרון, וחיבור למחזור המטרות.
- **מיקום:** אחרי L:M11.4.
- **דרישות קדם:** L:M11.4, ‏G8, ‏L:M7.11.
- **מקור:** Driels, *Weaponeering: An Introduction*, מהדורה 2 (AIAA, 2013). היה בתכנון המיפוי ולא הגיע.
- **היקף:** כ-180 עמודים.

**G24. Artillery and long-range precision fires** · **רצוי**
- **תוכן:** פיזור ותיקון ירי, ‏GMLRS, ‏PGK, טילים טקטיים, תחמושת משוטטת, צריכה ותעשייה, ומקרה אוקראינה (Excalibur מול EW).
- **מיקום:** אחרי L:M11.2.
- **דרישות קדם:** G7, ‏L:M6.7, ‏L:M11.2, ‏L:M11.4, ‏L:M5.5.
- **מקור:** FM 3-09, *Fire Support and Field Artillery Operations* (2020), נבחרים; ‏Watling, *The Arms of the Future* (Bloomsbury, 2023), פרק האש.
- **היקף:** כ-130 עמודים.

**G14. Nuclear fuel cycle and proliferation assessment** · **רצוי** (גבולי לחובה בהקשר הישראלי)
- **תוכן:** ‏SWU וזמן פריצה, צנטריפוגות, פלוטוניום, תכנון נשק ברמה העקרונית, ואימות (IAEA).
- **מיקום:** אחרי L:M11.10.
- **דרישות קדם:** L:M11.10, ‏E:M24.11.
- **מקור:** Feiveson, Glaser, Mian & von Hippel, *Unmaking the Bomb* (MIT Press, 2014); ‏Glasstone & Dolan, *The Effects of Nuclear Weapons*, מהדורה 3 (1977), פרקים נבחרים.
- **היקף:** כ-200 עמודים.

**G26. CBRN defense** · **רצוי**
- **תוכן:** סוכנים כימיים וביולוגיים, פיזור (מודל plume גאוסי), גילוי והגנה.
- **מיקום:** אחרי G14.
- **דרישות קדם:** E:M10.3, ‏E:M14.11.
- **מקור:** Ellison, *Handbook of Chemical and Biological Warfare Agents*, מהדורה 2 (CRC, 2007), נבחרים.
- **היקף:** כ-100 עמודים.

#### פלטפורמות, חתימות ורחפנים

**G10. Signature management: IR stealth and multispectral low observability** · **רצוי**
- **תוכן:** חתימת IR של פלומה ושל עור מחומם, דיכוי חתימה, חתימה אקוסטית וחזותית, ‏EMCON, ומחיר החתימה במשקל ובביצועים.
- **מיקום:** אחרי L:M8.8.
- **דרישות קדם:** L:M2.4, ‏L:M3.4, ‏L:M8.8, ‏E:M14.10, ‏E:M15.16.
- **מקור:** Mahulikar, Sonawane & Rao, "Infrared Signature Studies of Aerospace Vehicles", Progress in Aerospace Sciences 43 (2007); וגם פרקי susceptibility reduction ב-Ball (B16), אם לא כלולים ב-M8.8.
- **היקף:** כ-80 עמודים.

**G11. C-UAS system engineering and effectors** · **חובה**
- **תוכן:**
  - שכבות C-UAS.
  - יורטים: רחפן מיירט, תותח עם airburst, ‏RF defeat וניצול פרוטוקולים, ‏HEL.
  - הבחנה בין רחפן לציפור ושיעור אזעקות שווא.
  - EW מול רחפנים בקנה מידה: hopping, ‏fiber-optic, ניווט חזותי.
  - כלכלת עלות-החלפה וכללי פתיחה באש.
- **מיקום:** אחרי L:M9.9, ואחרי מודולי האנרגיה המכוונת שהלומד הציע.
- **דרישות קדם:** L:M9.7, ‏L:M9.9, ‏L:M2.38, ‏L:M4.11, מודולי HEL ו-HPM המוצעים, ‏E:M17.6.
- **מקור:** Holland Michel, *Counter-Drone Systems*, מהדורה 2 (Bard Center for the Study of the Drone, 2019); ‏Watling, *The Arms of the Future* (2023); ‏Pettyjohn, *Evolution Not Revolution: Drone Warfare in Russia's 2022 Invasion of Ukraine* (CNAS, 2024).
- **היקף:** כ-150 עמודים.
- **למה זה פער:** M9.7 הוא 33 עמודים של תורת הפעלה (ATP 3-01.81), ו-M9.9 הוא 0p. היעד הוא "senior C-UAS systems engineer".

**G25. Combat aircraft conceptual design** · **רצוי**
- **תוכן:** sizing לקרב, ‏supercruise, מפרצים פנימיים, ומחיר החמקנות.
- **מיקום:** אחרי L:M8.1.
- **דרישות קדם:** E:M15.12, ‏E:M15.16, ‏L:M2.4.
- **מקור:** Raymer, *Aircraft Design: A Conceptual Approach*, מהדורה 6 (AIAA, 2018), פרקים נבחרים.
- **היקף:** כ-150 עמודים.

#### ימי (משלים את 6 המודולים שהלומד הציע)

**G21. Naval architecture fundamentals (surface ships)** · **חובה**
- **תוכן:** הידרוסטטיקה, יציבות (GM ועקום GZ), יציבות בנזק, התנגדות והנעה (Froude, ‏Holtrop), ‏seakeeping, תמרון וחוזק אורכי.
- **מיקום:** תחילת הבלוק הימי, לפני מודולי הצוללת.
- **דרישות קדם:** E:M2.5, ‏E:M15.19, ‏E:M15.26, ‏E:M16.23.
- **מקור:** Tupper, *Introduction to Naval Architecture*, מהדורה 5 (Butterworth-Heinemann, 2013); להתנגדות: Molland, Turnock & Hudson, *Ship Resistance and Propulsion*, מהדורה 2 (CUP, 2017).
- **היקף:** כ-250 עמודים.
- **למה זה פער:** אין בגילואה אף מודול הידרודינמיקה ימית. הידרודינמיקה של צוללת ב-6-DOF (Renilson) מניחה הידרוסטטיקה, יציבות והתנגדות. הנדסה ימית היא יעד מפורש של הלומד.

**G22. Naval surface warfare and fleet air defense** · **חובה**
- **תוכן:** טילי ים-ים (ASCM) מעל גובה הים ואופק המכ"ם, ‏Aegis ו-CEC, ‏salvo של Hughes ממקור ראשוני, ‏scouting, ו-Red Sea 2023–2025 כמקרה בוחן (עלות-החלפה, מחסנית VLS, טעינה בים).
- **מיקום:** אחרי L:M10.5.
- **דרישות קדם:** L:M10.5, ‏L:M7.4, ‏L:M2.23, ‏L:M6.10, ‏L:M14.1.
- **מקור:** Hughes & Girrier, *Fleet Tactics and Naval Operations*, מהדורה 3 (NIP, 2018); ‏Hughes, "A Salvo Model of Warships in Missile Combat", Naval Research Logistics 42, 1995.
- **היקף:** כ-170 עמודים.
- **למה זה פער:** E2 שם את Hughes salvo בראש, והמיפוי תכנן אותו. היום הוא מופיע רק בכותרת M14.1, בלי המקור הראשוני.

**G23. ASW operations analysis, mine warfare and MCM** · **חובה** (אפשר לפצל לשני מודולים)
- **תוכן:**
  - ASW: שדות sonobuoy, מחסומים, ‏MPA ומסוק, ו-MAD.
  - מוקשים ו-MCM: מוקשי השפעה (מגנטי, אקוסטי ולחץ), ‏SAS, ‏MCM מבוסס UUV, ‏sweep width וכיסוי.
  - טורפדות: הנחיה, הנעה ו-wire guidance.
- **מיקום:** אחרי מודול עיבוד הסונאר שהלומד הציע.
- **דרישות קדם:** L:M10.4, ‏L:M3.11 (או L:M14.7), מודולי האקוסטיקה והסונאר המוצעים.
- **מקור:** Wagner, Mylander & Sanders, *Naval Operations Analysis*, מהדורה 3 (NIP, 1999); ‏National Research Council, *Naval Mine Warfare: Operational and Technical Challenges for Naval Forces* (NAP, 2001; פתוח).
- **היקף:** כ-270 עמודים.
- **למה זה פער:** M10.4 (טורפדות ומוקשים) הוא 10 עמודים. מוקשים בים השחור, במצר הורמוז ובים האדום הם נושא חי.

#### יריב

**G13. Iran and its axis: missile, drone and proxy forces** · **חובה**
- **תוכן:** כוח הטילים והכטב"מים האיראני, יצור ו-OOB, ‏Hezbollah (רקטות וטילים מדויקים), החות'ים (ASCM, ‏ASBM), ‏Hamas (רקטות ומנהרות), והלקחים של אפריל ואוקטובר 2024 ויוני 2025.
- **מיקום:** P12, אחרי L:M12.4.
- **דרישות קדם:** L:M7.1, ‏L:M12.1, ‏L:M9.9.
- **מקור:** DIA, *Iran Military Power* (2019; פתוח); ‏IISS, *Iran's Networks of Influence in the Middle East* (2019); ‏IISS, *The Military Balance* (מהדורה עדכנית, פרק MENA).
- **היקף:** כ-250 עמודים.
- **למה זה פער:** P12 מכסה רק את רוסיה וסין. מומחה בישראל ב-2026 בלי היריב הקרוב הוא חור ברור.

#### ניתוח, מדיניות ו-T&E

**G15. T&E statistics and design of experiments** · **חובה**
- **תוכן:** ‏DOE פקטוריאלי ו-RSM, גודל מדגם להוכחת Pk ושיעור גילוי, ‏sequential testing, ‏VV&A של סימולציה, וקריאה ביקורתית של דוחות DOT&E.
- **מיקום:** אחרי L:M7.10 (או ב-P14 לפני L:M14.2).
- **דרישות קדם:** E:M6.5, ‏E:M6.6, ‏E:M6.8, ‏L:M7.10.
- **מקור:** Montgomery, *Design and Analysis of Experiments*, מהדורה 9 (Wiley, 2017), פרקים 1–6 ו-11; ‏NRC, *Statistics, Testing, and Defense Acquisition* (NAP, 1998).
- **היקף:** כ-250 עמודים.
- **למה זה פער:** E2 שם "סטטיסטיקת ניסוי" ו"תכנון ניסויים, אימות" בראש. M7.10 הוא 20 עמודים, ואין DOE בגילואה.

**G16. Reliability, availability and maintainability (RAM)** · **רצוי**
- **תוכן:** ‏Weibull, ‏MTBF, ‏Ao, חלקי חילוף, מוכנות, ואמינות כרכיב ב-Pk של מיירט.
- **מיקום:** אחרי G15, או לפני L:M14.3.
- **דרישות קדם:** E:M6.2, ‏E:M27.8, ‏L:M14.3.
- **מקור:** O'Connor & Kleyner, *Practical Reliability Engineering*, מהדורה 5 (Wiley, 2012), פרקים 2–6 ו-15–16.
- **היקף:** כ-150 עמודים.

**G17. Law of armed conflict, weapons review, autonomy policy and Israeli export control** · **חובה**
- **תוכן:** הבחנה, מידתיות וזהירות, סקירת נשק (סעיף 36), ‏DoDD 3000.09 (2023), ויכוח ה-LAWS, וחוק הפיקוח על יצוא ביטחוני (2007, כולל ההנחיה מנובמבר 2025, מסעיף 1.6 ב-E2).
- **מיקום:** אחרי L:M7.11 (או לפני L:M14.5).
- **דרישות קדם:** L:M7.11, ‏G4.
- **מקור:** DoD *Law of War Manual* (2015, עדכון 2023), פרקים 5–6; ‏DoDD 3000.09, *Autonomy in Weapon Systems* (2023); ‏Scharre, *Army of None* (Norton, 2018).
- **היקף:** כ-300 עמודים.

**G18. Wargaming: design, adjudication and analysis** · **רצוי**
- **תוכן:** תכנון משחק מלחמה, שיפוט (adjudication), ניתוח התוצאות, ומתי משחק הוא ראיה.
- **מיקום:** אחרי L:M14.7.
- **דרישות קדם:** L:M14.1, ‏L:M14.7.
- **מקור:** Perla, *The Art of Wargaming* (NIP, 1990); ‏Sabin, *Simulating War* (Bloomsbury, 2012).
- **היקף:** כ-200 עמודים.

#### ניווט וחישה

**G19. Quantum and magnetic sensing** · **רצוי**
- **תוכן:** ‏MagNav (ניווט לפי אנומליה מגנטית), ‏MAD לצוללות, ‏IMU של אטומים קרים, ובדיקת מציאות ל"מכ"ם קוונטי".
- **מיקום:** אחרי מודול SoOP והשעונים האטומיים שהלומד הציע.
- **דרישות קדם:** L:M5.11, ‏E:M24.7, ‏E:M12.1.
- **מקור:** Degen, Reinhard & Cappellaro, "Quantum Sensing", Rev. Mod. Phys. 89, 035002 (2017); ‏Canciani & Raquet, "Absolute Positioning Using the Earth's Magnetic Anomaly Field", NAVIGATION 63(2), 2016.
- **היקף:** כ-120 עמודים.

**G20. Computer vision and multi-view geometry** · **חובה** (חוצה מעבדות)
- **תוכן:** מודל מצלמה וכיול, הומוגרפיה, גאומטריה אפיפולרית, ‏bundle adjustment, ‏feature matching ו-dense stereo.
- **מיקום:** לפני M5.11 המורחב (VIO ו-DSMAC), לפני UGV autonomy ולפני ATR בקצה. אפשר גם בגילואה, ב-P17 או ב-P19.
- **דרישות קדם:** E:M8.4, ‏E:M8.22, ‏E:M17.6, ‏E:M19.2.
- **מקור:** Szeliski, *Computer Vision: Algorithms and Applications*, מהדורה 2 (2022; פתוח), פרקים 2, 7, 8, 11 ו-12; או Hartley & Zisserman, *Multiple View Geometry*, מהדורה 2 (CUP, 2004).
- **היקף:** כ-250 עמודים.
- **למה זה פער:** Szeliski מופיע ב-BOOKS.md כספר פתוח שלא הורד, ואין מודול שמפנה אליו. שלושה מהמודולים שהלומד הציע נשענים עליו.

**סיכום היקף:**

| | עמודים | שעות (כ-10 דקות לעמוד) |
|---|---|---|
| חובה | כ-3,260 | כ-540 |
| רצוי | כ-1,490 | כ-250 |
| **סך הכל** | **כ-4,750** | **כ-790** |

בקצב של 8–10 שעות ביום, זה כ-11–14 שבועות.

### 1.ב מודולים קיימים בלי מקור (0p): מקור מוצע

| מודול | מקור | עמודים |
|---|---|---|
| M3.12 Hyperspectral | Manolakis, Marden & Shaw (2003), כבר במאגר (A03.1) | 30 |
| M6.9 HGV | Acton (2015, ‏A06.2, במאגר) ו-Tracy & Wright (2020) | 70 |
| M8.3 ACM | Shaw, *Fighter Combat: Tactics and Maneuvering* (NIP, 1985), נבחרים, ו-Boyd (A08.1, במאגר) | 120 |
| M8.9 Air campaign capacity | Stillion & Orletsky, *Airbase Vulnerability to Conventional Cruise-Missile and Ballistic-Missile Attacks* (RAND MR-1028, 1999); ‏Vick, *Air Base Attacks and Defensive Counters* (RAND RR-968, 2015) | 150 |
| M9.9 One-way drones | Pettyjohn (CNAS, 2024); ‏Zabrodskyi, Watling et al., *Preliminary Lessons in Conventional Warfighting from Russia's Invasion of Ukraine* (RUSI, 2022); ‏Watling (2023) | 130 |
| M10.5 Ship self-defense | A10.2, ‏A10.3 ו-A10.4 (במאגר), ופרקים מ-Hughes & Girrier | 90 |
| M13.23 Space control | Secure World Foundation, *Global Counterspace Capabilities* (2025); ‏CSIS, *Space Threat Assessment* (2025) | 150 |
| M14.2 Acquisition and cost | GAO, *Cost Estimating and Assessment Guide* (GAO-20-195G, 2020); ‏Mislick & Nussbaum, *Cost Estimation: Methods and Tools* (Wiley, 2015) | 200 |
| M14.4 OSINT | Heuer, *Psychology of Intelligence Analysis* (CIA, 1999); ‏Dubberley, Koenig & Murray (eds.), *Digital Witness* (OUP, 2020) | 180 |
| M14.5 Capstone | Heuer & Pherson, *Structured Analytic Techniques for Intelligence Analysis*, מהדורה 3 (2020) | 120 |

### 1.ג מה בדקתי ומצאתי מכוסה (או מכוסה בהצעות הלומד)

- **שיבוש והטעיית GNSS בקנה מידה:** M5.5, ‏A05.1, ‏A05.3, וההרחבה של M5.11 שהלומד הציע.
- **כלכלת הגנה אווירית ועלות-החלפה:** M7.4 ו-M9.9.
- **EW מול רחפנים:** M9.7 ו-CEMA. העומק ההנדסי עובר ל-G11.
- **סייבר:** CEMA שהלומד הציע. דיוק אחד: להוסיף לו את Kurose & Ross פרק 8 (אבטחת רשתות), שהיום נמצא ב-E:M23.16 כעיון, ו-GAO-19-128, *Weapon Systems Cybersecurity* (2018).
- **שליטה בחלל:** M13.23 (חסר מקור, ראו 1.ב).
- **גורמי אנוש:** נכנסים ל-G4. אין צורך במודול נפרד, כי E2 לא דורש אותם בנפרד.
- **חתימת RCS:** M2.4. חתימת IR עוברת ל-G10.
- **פיזור התפקידים בין M3.11 ל-M14.7 (תורת החיפוש):** ראו O16.

---

## 2. טעויות בסדר דרישות הקדם בתוך לנצ'סטר

**טעויות סדר (מודול צריך משהו שנלמד אחריו):**

| # | המודול | חסר לו | התיקון |
|---|---|---|---|
| O1 | M8.8 (P8) | M11.4 (P11), וגם M11.3 (רסיסים והדף ב-vulnerability) | להעביר את M8.8 אחרי ליבת P11 (M11.1, ‏M11.3, ‏M11.4), או להקדים את ליבת P11 לפני P8. זוהה גם ב-`partgraph.py` |
| O2 | M8.9 (P8) | M9.2 (P9), בזמן ש-M9.9 (P9) צריך את M8.8 (P8) | מעגל P8↔P9. התיקון: יחידת "Survivability & campaign" (M8.8, ‏M8.9) אחרי P9 ו-P11 |
| O3 | M6.8 (טילים בליסטיים) | קפלר ו-Lambert (M13.4), והמשוואה הרקטית ושלבים (M13.12, ‏P13) | להקדים את M13.4 ו-M13.12 לפני M6.8 ולהוסיף אותם כדרישות קדם (גם ל-M6.12 ול-G5) |
| O4 | M4.12 (שיבוש לוויינים) | transponder וגאומטריה (M13.10, ‏M13.4/M13.5) | להעביר אחרי M13.10, יחד עם G2 |
| O5 | M2.16 (STAP) | beamforming אדפטיבי (M2.30), שנלמד אחריו ולא מופיע כדרישה | להקדים את M2.30 ולהוסיף אותו כדרישה |
| O6 | M4.10 (IRCM) | סוגי מחפשים (reticle, ‏con-scan, ‏imaging) מ-M6.6 (P6), ו-A03.3 | להוסיף את M6.6 כדרישה ולהעביר אחריו, או ללמד את המחפשים בתוך M4.10 |
| O7 | M6.7 (weapon delivery) | בליסטיקה חיצונית (M11.1/G7) ו-CEP (M11.4) | להוסיף כדרישות, ולהעביר אחרי P11 |
| O8 | M7.4 (raids ועלות-החלפה) | SSPK ו-shoot-look-shoot (M11.4, ‏M14.7) ו-salvo (M14.1) | ל-M14.1 יש רק M0.4 ו-M7.1 כדרישות, ולכן אפשר להעביר אותו מיד אחרי M7.1. להוסיף את M11.4 |
| O9 | M10.5 (הגנה עצמית של ספינה) | הגנה בשכבות (M7.3, ‏M7.4), ‏ASCM (M6.10), ‏MFR (M2.23) ו-salvo (M14.1) | להוסיף כדרישות. ‏M14.1 יוקדם לפי O8 |

**דרישות קדם חסרות (הסדר בפועל תקין):**

| # | המודול | חסר לו | הערה |
|---|---|---|---|
| O10 | M2.40 (CRB) | M2.12 (פונקציית העמימות) | עקמומיות פונקציית העמימות היא מה שקובע את הדיוק |
| O11 | M2.14 (monopulse) | M2.2 (SNR) ו-M1.2 (אלומות סכום והפרש) | |
| O12 | M2.8 (חומרת מכ"ם) | M1.7 (מחזרים, PA ורעש פאזה) | M1.7 מסומן adv. צריך להעלות אותו ל-cor, או להוסיף אותו כדרישה |
| O13 | M4.8 (שיבוש מטעה) | M2.15 (RGPO/VGPO תוקפים לולאות עקיבה) ו-M2.12 (DRFM מול דחיסת פולס) | |
| O15 | M6.10 (טילי שיוט) | M5.8 ו-M5.11 (TERCOM ו-DSMAC) | |
| O20 | M13.23 (שליטה בחלל) | M4.12 (שיבוש לוויינים) | |

**בעיות מבנה וכפילויות:**

- **O14. M6.1 ו-M6.2 נשענים על M0.6 ו-M0.7 בלבד.** הדרישה האמיתית היא E:M2.7 (גוף קשיח) ו-E:M19.2 (רוטציות). ל-M6.2 צריך גם E:M15.19–15.25 ו-E:M5.7–5.10. ‏M0.7 (8 עמודים) לא מספיק. ראו סעיף 3.
- **O16. כפילות בתורת החיפוש:** M3.11 ו-M14.7 מלמדים את אותה תורה. ‏M14.7 צריך להפנות ל-M3.11 ולא ללמד אותה מחדש.
- **O17. M5.4 (לולאות PLL/DLL):** חסרה לו הדרישה M0.3, ובפועל הוא צריך את E:M5.7 (פונקציות תמסורת).
- **O18. M9.3 (אוטונומיה):** צריך את E:M19.7 (תכנון תנועה).
- **O19. M7.10 (הנדסת מערכות):** אין לו דרישות קדם, אבל הוא חוזר על E:M27.1–27.3. כדאי להפוך אותו לשיעור הפרש אחרי E:P27.
- **O21. M7.9 ו-M7.11 לעומת בלוק קשרי הנתונים:** M7.9 (Link 16) יושב ב-P7, אבל בלוק קשרי הנתונים שהלומד הציע בא אחרי P7, ו-M7.11 נשען על M7.9. אפשר לבחור באחת משתי דרכים:
  - M7.9 נשאר בסקירה קצרה, והעומק עובר לבלוק.
  - M7.11 ו-G4 עוברים לסוף הבלוק.

---

## 3. תלויות בגילואה

### 3.א מה חייב להיות גמור בגילואה לפני כל חלק בלנצ'סטר (לעומק מומחה)

| חלק בלנצ'סטר | חייב לפניו בגילואה | אפשר במקביל ל- |
|---|---|---|
| P0 יסודות | אין (P0 הוא שכבת סיכום) | E:P1–P3, ‏E:P6. ‏M0.3 מקביל ל-E:M4.1–4.8; ‏M0.4 ל-E:M6.1–6.2; ‏M0.6 ל-E:M8.5 |
| P1 אנטנות ו-RF | E:M9.9, ‏M9.17, ‏M9.19, ‏M9.11, ‏M11.17, ‏M11.19, ‏M7.2 (רעש) | E:P11 (‏M11.20 הוא שיעור הפרש ל-M1.5–M1.7) |
| P2 מכ"ם, ליבה (M2.1–M2.15) | E:M4.14, ‏M4.15, ‏M7.4 (גילוי), ‏M5.6 (Kalman, ל-M2.15) | E:P7, ‏E:P8 |
| P2 מתקדם | M2.29: ‏E:M5.14 · ‏M2.30–M2.32: ‏E:M8.4, ‏M8.5, ‏M7.17 · ‏M2.33: ‏E:M8.17 · ‏M2.37: ‏E:M17.6 · ‏M2.38: ‏E:M4.15 · ‏M2.4: ‏E:M9.14 | E:P17 |
| P3 EO/IR | E:M9.12, ‏M9.13, ‏M4.5 (MTF), ‏M13.20 (גוף שחור), ‏M14.10; ל-M3.6: ‏E:M25.3; ל-M3.7: ‏E:M11.7; ל-M3.8: ‏E:M17.6 | E:P14 (מעבר חום קרינתי) |
| P4 EW | E:M7.4, ‏M4.12 (ערוצים פוליפאזיים, ל-M4.2 ו-M4.3), ‏M7.17 (DOA, ל-M4.6), ‏M23.6 (ל-M4.11) | E:P23 |
| P5 ניווט | E:M5.6, ‏M5.14, ‏M5.7 (לולאות), ‏M2.7, ‏M19.2 (רוטציות), ‏M24.1 (יחסות בשעוני GPS) | E:P19 ו-E:P24 |
| P6 טילים, הנחיה (M6.1, ‏M6.3–M6.6) | E:M2.7, ‏M3.1, ‏M5.4–M5.10; ל-M6.5: ‏E:M5.5 ו-M8.13 | E:P5 |
| P6 טילים, אווירודינמיקה ותכן (M6.2, ‏M6.8–M6.13) | E:M15.19–M15.25, ‏M15.28, ‏M15.16, ‏M14.10 (חימום וכיפות). ל-M6.9: ‏E:M15.17 | **להפריד את M6.2 ו-M6.12 עד אחרי E:P15**. הנחיה יכולה לרוץ מוקדם, מקביל ל-E:P5 |
| P7 הגנה אווירית ושו"ב | E:M27.1–M27.5 (ל-M7.2, ‏M7.3, ‏M7.10), ‏M6.7, ‏M8.15–M8.17 (הקצאת נשק-מטרה), ‏M21.6 | E:P27, ‏E:P21 |
| P8 פלטפורמות | E:M15.11–M15.14, ‏M15.28, ‏M22.11 (אוויוניקה), ‏M27.8 (עצי תקלה, ל-kill trees ב-M8.8) | E:P15 בסופו |
| P9 כטב"מים | E:M15.13, ‏M5.9, ‏M19.7–M19.10, ‏M12.3–M12.8 (מנועי רחפן), ‏M13.25 (סוללות), ‏M17.6, ‏M23.5 | E:P19, ‏E:P12 |
| P10 ימי, וגם 6 המודולים המוצעים | אקוסטיקה: ‏E:M9.1, ‏M10.1, ‏M10.5 (PE ו-FD) · סונאר: ‏E:M7.17, ‏M5.14 (TMA), ‏M8.4 · צוללת: ‏E:M15.19–M15.26, ‏M14.13 (רעש זרימה), ‏M16.7, ‏M16.23 · שקט: ‏E:M3.3–M3.6, ‏M12.1 (degaussing) · הנעה: ‏E:M13.10, ‏M12.6–M12.8, ‏M13.25 · USV/UUV: ‏E:M19.7, ‏M5.14, ‏G20 | רק אחרי E:P15. ‏G21 צריך לבוא ראשון |
| P11 נשק, וגם 5 המודולים היבשתיים המוצעים | E:M13.13 (בעירה ובליסטיקה פנימית), ‏M15.23–M15.24 (גלי הלם והדף), ‏M16.5, ‏M16.10, ‏M16.22, ‏M2.7 · ייצוב נשק: ‏E:M5.10 · ‏terramechanics: ‏E:M16.5 · ‏UGV: ‏E:M19.7–M19.10, ‏G20 | E:P16 |
| P12 יריב | אין | כל דבר. טוב כ"מנוחה" בין חלקים כבדים |
| P13 חלל | E:M2.2, ‏M15.15, ‏M14.10, ‏M5.4 (ל-M13.13), ‏M23.3 (ל-TT&C), ‏M13.25 | E:P14 ו-E:P15. **‏M13.4 ו-M13.12 יוקדמו לפי O3** |
| P14 ניתוח הגנה | E:M6.5–M6.8, ‏M6.11, ‏M7.12, ‏M8.15–M8.18, ‏M18.2 (MDP לחיפוש ומשחקים), ‏M21.6, ‏M27.5; ל-G15: ‏E:M6.6 ו-M6.8 | E:P18 |
| בלוק אוויוניקה, קשרי נתונים, AI בקצה, CEMA ו-EMC (הצעת הלומד) | E:M22.6–M22.8, ‏M22.11, ‏M23.11–M23.15, ‏M17.6–M17.7, ‏M11.11, ‏M9.17; ל-CEMA: ‏E:M23.16 (פרק 8 של K&R, לקדם); ל-EMC: ‏E:M11.11 ו-M9.11 | E:P22, ‏E:P25 |
| בלוק אנרגיה מכוונת (הצעת הלומד) | HEL: ‏E:M9.13, ‏M14.13 (Kolmogorov, ל-Cn²), ‏M14.5 (חימום חולף), ‏M14.10 · ‏HPM: ‏E:M9.10, ‏M9.11, ‏M25.3 (מודל Wunsch–Bell) | רק אחרי E:P14 |
| ניווט בלי GPS ו-SoOP (הצעת הלומד) | E:M5.14, ‏M8.22, ‏G20 (VIO), ‏M24.7 (שעונים אטומיים) | E:P24 |

### 3.ב מסקנות לסידור הזמנים

1. **לנצ'סטר מוקדם (P0–P5 ו-P6 הנחיה)** תואם את גילואה P1–P8. אפשר להריץ במקביל: P0 עם E:P1–P3, ‏P1 עם E:P9–P11, ‏P2 עם E:P7–P8, ו-P4 ו-P5 עם E:P5.
2. **לנצ'סטר מאוחר** תלוי בגילואה P13–P16, שהם שכבות 11–13 בגילואה:
   - P6 תכן, ‏P8 ו-P13 תלויים ב-E:P15.
   - P10 והבלוק הימי תלויים ב-E:P15 וב-E:P16.
   - P11 ובלוק היבשה תלויים ב-E:P13 וב-E:P16.
   - אנרגיה מכוונת תלויה ב-E:P14.
3. **בפועל:** P7, ‏P12, ‏P14 ובלוק האוויוניקה והקשר הם מה שאפשר ללמוד בזמן ש-גילואה עוברת את P11–P15.

---

## 4. מקורות למודולים שהלומד הציע

| מודול מוצע | מקור מומלץ | עמודים |
|---|---|---|
| P0 עם M0.8 | B01 קיים. העמקה: Todhunter, *Spherical Trigonometry* (1886; פתוח), פרקים 1–6 | 40 |
| הרחבת M5.11: ניווט בלי GPS | Groves, *Principles of GNSS, Inertial, and Multisensor Integrated Navigation Systems*, מהדורה 2 (2013), פרקים 13–16; ‏Dellaert & Kaess, *Factor Graphs for Robot Perception* (FnT Robotics, 2017; פתוח); ‏Forster et al., "On-Manifold Preintegration for Real-Time Visual-Inertial Odometry", IEEE T-RO 33(1), 2017 | 220 |
| SoOP ושעונים אטומיים | Morton, van Diggelen, Spilker & Parkinson (eds.), *Position, Navigation, and Timing Technologies in the 21st Century* (Wiley-IEEE, 2021), שני כרכים: פרקי LEO, סלולר, ניווט שמימי, שעונים בגודל שבב ו-Kassas; ‏A05.4 ו-A05.5 (Riley) במאגר | 160 |
| HEL | Perram, Cusumano, Hengehold & Fiorino, *An Introduction to Laser Weapon Systems* (DEPS, 2010); ‏Andrews & Phillips, *Laser Beam Propagation through Random Media*, מהדורה 2 (SPIE, 2005), פרקים נבחרים; ‏Tyson, *Principles of Adaptive Optics* (CRC), פרקים 1–3; ‏Merritt, *Beam Control for Laser Systems* (DEPS, 2012) | 250 |
| HPM | Benford, Swegle & Schamiloglu, *High Power Microwaves*, מהדורה 3 (CRC, 2016); ‏Wunsch & Bell, IEEE Trans. Nucl. Sci. 15(6), 1968; ‏Nielsen, *Effects of Directed Energy Weapons* (NDU, 1994; פתוח), פרקי HPM | 200 |
| אוויוניקה ורכיבי ובטרוניקה | Spitzer et al. (eds.), *Digital Avionics Handbook*, מהדורה 3 (CRC, 2015), פרקי MIL-STD-1553, ‏ARINC 429 ו-664; ‏ECSS-E-ST-50-12C (SpaceWire); ‏Finn, "Introduction to Time-Sensitive Networking", IEEE Comm. Standards Mag. (2018); ‏B08 פרקי האדריכלות | 130 |
| קשרי נתונים טקטיים | Northrop Grumman, *Understanding Voice and Data Link Networking* (2014; פתוח); ‏A08.4, ‏A08.7 ו-A08.9 במאגר; ‏Chung et al., "A Survey on Aerial Swarm Robotics", IEEE T-RO 34(4), 2018. ‏MADL ו-VMF: רק תיאורים פתוחים | 200 |
| AI בקצה ו-ATR | Sze, Chen, Yang & Emer, *Efficient Processing of Deep Neural Networks* (Morgan & Claypool, 2020); ‏Schachter, *Automatic Target Recognition* (SPIE Press, מהדורה עדכנית); ‏Kastner et al., *Parallel Programming for FPGAs* (2018; פתוח) | 220 |
| CEMA | FM 3-12, *Cyberspace Operations and Electromagnetic Warfare* (2021); ‏JP 3-85, *Joint Electromagnetic Spectrum Operations* (2020); ‏GAO-19-128; ‏Kurose & Ross, פרק 8 (קידום מ-E:M23.16) | 200 |
| הנדסת ממשקים ו-EMC/EMI/co-site | Paul, *Introduction to Electromagnetic Compatibility*, מהדורה 2 (Wiley, 2006); ‏MIL-STD-461G ו-MIL-STD-464C (פתוחים); ‏Adamy, *EW 103* (2008), פרקי co-site | 220 |
| אקוסטיקה של האוקיינוס | Jensen, Kuperman, Porter & Schmidt, *Computational Ocean Acoustics*, מהדורה 2 (Springer, 2011), פרקים 1–3, 5 ו-6; ‏Urick, *Principles of Underwater Sound*, מהדורה 3 (1983) | 250 |
| עיבוד סונאר | Van Trees, *Optimum Array Processing* (Wiley, 2002), פרקים 6–7 (MVDR); ‏Waite, *Sonar for Practising Engineers*, מהדורה 3 (Wiley, 2002) (LOFAR ו-DEMON); ‏Nardone, Lindgren & Gong, IEEE TAC 29(9), 1984 (TMA); ‏A10.5 ו-A10.6 במאגר | 200 |
| צוללת: הידרודינמיקה, בקרה וגוף לחץ | Renilson, *Submarine Hydrodynamics*, מהדורה 2 (Springer, 2018); ‏Fossen, *Handbook of Marine Craft Hydrodynamics and Motion Control*, מהדורה 2 (Wiley, 2021), פרקים נבחרים; ‏Burcher & Rydill, *Concepts in Submarine Design* (CUP, 1994); ‏Ross, *Pressure Vessels: External Pressure Technology*, מהדורה 2 (Woodhead, 2011) | 300 |
| שקט (quieting) | Ross, *Mechanics of Underwater Noise* (Pergamon, 1976); ‏Brennen, *Cavitation and Bubble Dynamics* (OUP, 1995; פתוח); ‏Holmes, *Exploitation of a Ship's Magnetic Field Signatures* (Morgan & Claypool, 2006); ‏A10.8 במאגר | 200 |
| הנעה (גרעינית מול AIP) ו-VLF/ELF | Burcher & Rydill, פרקי ההנעה; ‏Glasstone & Sesonske, *Nuclear Reactor Engineering*, מהדורה 4 (1994), פרקים 1–3; ‏Barr, Jones & Rodger, "ELF and VLF Radio Waves", J. Atmos. Sol.-Terr. Phys. 62 (2000) | 150 |
| USV ו-UUV | Paull et al., "AUV Navigation and Localization: A Review", IEEE J. Oceanic Eng. 39(1), 2014; ‏Fossen (שם); ‏Cole, *Underwater Explosions* (Princeton, 1948); ‏Reid, *The Response of Surface Ships to Underwater Explosions* (DSTO-GD-0109, 1996; פתוח) | 200 |
| ‏ATGM דורות 3–5 ו-APS | Hazell, *Armour: Materials, Theory, and Design*, מהדורה 2 (CRC, 2022); ‏Ogorkiewicz (B11, במאגר); ‏Watling, *The Arms of the Future* (2023) | 150 |
| Terramechanics | Wong, *Theory of Ground Vehicles*, מהדורה 4 (Wiley, 2008), פרקים 2–4; או Wong, *Terramechanics and Off-Road Vehicle Engineering*, מהדורה 2 (2010) | 150 |
| ייצוב נשק | Hilkert, "Inertially Stabilized Platform Technology", IEEE Control Systems Mag. 28(1), 2008; ‏Masten, שם; ‏Carlucci & Jacobson, פרקי דינמיקת קנה | 60 |
| אוטונומיה של UGV | Siegwart, Nourbakhsh & Scaramuzza, *Introduction to Autonomous Mobile Robots*, מהדורה 2 (MIT, 2011); ‏LaValle, *Planning Algorithms* (CUP, 2006; פתוח), פרקים נבחרים | 250 |
| לוחמה תת-קרקעית | Richemond-Barak, *Underground Warfare* (OUP, 2018); ‏Daniels (ed.), *Ground Penetrating Radar*, מהדורה 2 (IET, 2004), פרקים נבחרים; ‏Telford, Geldart & Sheriff, *Applied Geophysics*, מהדורה 2 (CUP, 1990), פרקי גרביטציה וסייסמיקה; ‏Ebadi et al., "Present and Future of SLAM in Extreme Environments: The DARPA SubT Challenge", IEEE T-RO (2023); ‏UFC 3-340-02 (2008), פרק הפיצוץ הסגור | 250 |

**היקף המודולים שהלומד הציע:** כ-4,200 עמודים, כ-700 שעות. יחד עם הפערים בדוח הזה (כ-4,750 עמודים): כ-8,950 עמודים, כ-1,500 שעות. בקצב של 8–10 שעות ביום, זה כ-5–6 חודשים נוספים.
