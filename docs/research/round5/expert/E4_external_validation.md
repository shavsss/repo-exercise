# E4: מדידה חיצונית של יכולת ברמת מומחה (30.10.2026)

השאלה: איך לומד עצמאי בישראל, בלי תוכנית תואר, מקבל מדידה חיצונית ואמינה של היכולת שלו בגל 1 (מכ"ם, לוחמה אלקטרונית, PNT, אנטנות, עיבוד אותות, שערוך), ואחר כך בתחומים הבאים. המסמך ממפה את הערוצים, מדרג אותם לפי מה שהם באמת מאשרים, ובונה סולם אימות לכל רמה ולוח שנה ל-2027.

סימון: [evidence] = מקור שנבדק, עם קישור. [inference] = מסקנה ממקורות. [estimate] = הערכה שלי, לבדיקה.

## 1. העיקרון: אימות חיצוני = מישהו שלא תלוי בך מריץ, קורא או בוחן את העבודה

לכל ערוץ שלוש שאלות: מי שופט (אלגוריתם ניקוד, עמית בתחום, לקוח), על מה (פלט מספרי, טיעון, קוד, החלטה), ומה נשאר אחרי (דירוג, DOI, merge, מכתב, הכנסה). בעולם שבו AI עושה את החישוב הקל, הערוצים החזקים הם אלה שבודקים **שיפוט**: בחירת הבעיה, הנחות, גבולות תקפות, ותגובה לביקורת. Leaderboard בודק פלט; review של מאמר או של PR בודק שיפוט; לקוח משלם בודק ערך [inference].

## 2. תחרויות ואתגרים

| ערוץ | מה מאשר | עלות / זמן | תנאים | אמינות (תעשייה / ביטחון / אקדמיה) |
|---|---|---|---|---|
| IEEE Signal Processing Cup | דירוג מול צוותי סטודנטים, גמר ב-ICASSP | חינם; 3–5 חודשים | צוות סטודנטים עם מנחה; לומד עצמאי משתתף רק דרך מוסד [inference] | בינונית / נמוכה / גבוהה |
| IEEE AESS Radar Challenge (ב-RadarConf) | פתרון בעיית מכ"ם על נתונים אמיתיים, הצגה בכנס | חינם + נסיעה | פורמט אוניברסיטאי; צריך לבדוק פתיחות לעצמאים | בינונית / בינונית / גבוהה |
| AESS Challenge Problem (מענקים של $24,000) | פתרון מתוקצב שמוצג בסשן מיוחד ב-RadarConf | ממומן | הצעה עם ביוגרפיות חוקרים | גבוהה באקדמיה; מתאים לשלב senior+ |
| Google Smartphone Decimeter Challenge (Kaggle + ION GNSS+) | דיוק מיקום GNSS/IMU מול ground truth; מאמר לזוכים | חינם; 8 חודשים | פתוח | גבוהה ב-PNT; הנתונים נשארים לשימוש כ-benchmark |
| MAFAT Challenge (מפא"ת) | דירוג על נתוני ביטחון ישראליים (למשל מכ"ם אדם/בעל חיים) | חינם; 3 חודשים | פתוח לציבור | גבוהה מאוד בישראל; קשר ישיר לגופי הביטחון |
| DARPA challenges (AIxCC, Triage) | מערכות אוטונומיות בקנה מידה גדול | צוות + חודשים רבים | AIxCC הסתיים; Triage בגמר | גבוהה; כרגע אין אתגר פתוח בגל 1 |
| DEF CON RF Village CTF / Aerospace Village (Starpwn) | פענוח RF מעשי, SDR, ניצול מערכות חלל | כרטיס DEF CON או מרחוק | RF CTF ניתן לשחק מרחוק דרך ssh | בינונית בתעשייה, טובה בקהילת RF/סייבר |
| AIAA Design Competitions | דוח תכנון מלא של מערכת (טיל, מטוס, חלל) | חינם; שנה אקדמית | סטודנטים, יש Open Division | בינונית / בינונית / גבוהה בהנדסת אווירונאוטיקה |
| NATO DIANA | האצה לחברות | — | חברות ממדינות נאט"ו | לא רלוונטי ישירות לישראלי [inference] |
| Metaculus / Good Judgment Open | Brier / log score על שאלות אמיתיות | חינם; רציף | פתוח | גבוהה לאנליסטים; נמוכה להנדסה |

ראיות:
- SP Cup 2026 עסק ב-AV Zoom בסמארטפונים, גמר ב-ICASSP 2026; ההרשמה נסגרה ב-10.11.2025 [evidence] ([SPS](https://signalprocessingsociety.org/newsletter/2025/11/ignite-your-innovation-compete-2026-signal-processing-cup)). SP Cup 2027: הצעות נבחרו ב-18.8.2026, גמר ב-ICASSP 2027 בטורונטו, 16–21.5.2027, פרס $5,000 [evidence] ([SPS](https://signalprocessingsociety.org/newsletter/2026/07/call-proposals-organize-prestigious-sp-cup-2027), [PDF](https://signalprocessingsociety.org/sites/default/files/2026-05/2027_SP_Cup_Call_for_Proposals.pdf)). הנושא תלוי בשנה, לכן הוא ערוץ מזדמן [inference].
- Radar Challenge רץ ב-RadarConf 2025 (זכו Virginia Tech ו-Manchester) והמשיך ב-RadarConf 2026 בפיניקס [evidence] ([AESS](https://ieee-aess.org/radar-challenge/radar-challenge-2025), [AESS blog](https://ieee-aess.org/post/blog/story-behind-success-radar-challenge-winners-2025-ieee-radar-conference)). AESS Challenge Problem: הצעה עד $24,000, ואחר כך ארבעה מענקים לפתרונות [evidence] ([AESS](https://ieee-aess.org/aess-challenge-problem-radar)).
- Decimeter Challenge השלישי: 12.9.2023–23.5.2024, פרסים $7,000/$5,000/$3,000 והרצאה ב-ION GNSS+ 2024, בתנאי מאמר טכני [evidence] ([ION](https://www.ion.org/gnss/googlecompetition.cfm)). לא נמצאה מהדורה רביעית; הנתונים זמינים, ואפשר להריץ עליהם ולהשוות לפתרונות הזוכים כ-benchmark פרטי [inference].
- MAFAT Radar Challenge: 15.7–15.10.2020, יותר מ-1,000 משתתפים, I/Q עם slow-time ו-fast-time, ROC AUC; התארח ב-CodaLab, לא ב-Kaggle [evidence] ([CodaLab](https://competitions.codalab.org/forums/22085/4816/), [GSI](https://gsitechnology.com/target-classification-with-doppler-pulse-radar-and-neural-networks/)). הסדרה היא שיתוף של רשות החדשנות, האוצר ומפא"ת, ומודיעה ברשימת תפוצה [evidence] ([mafatchallenge.mod.gov.il](https://mafatchallenge.mod.gov.il)). פריט בתוכנית: להירשם לרשימת התפוצה עכשיו.
- AIxCC הסתיים ב-DEF CON 33 (8.2025), Team Atlanta ראשונה, $8.5M פרסים [evidence] ([DARPA](https://www.darpa.mil/news/2025/aixcc-results)). Triage Challenge: גמר בנובמבר 2026 [evidence] ([DARPA](https://www.darpa.mil/research/challenges/darpa-triage-challenge/finals)). אתגר DARPA בגל 1 לא פתוח כרגע; Spectrum Collaboration Challenge (2016–2019) נשאר כמורשת וכמקור רעיונות [inference].
- Hack-A-Sat 4 (2023) היה ה-CTF הראשון מול לוויין במסלול (Moonlighter) [evidence] ([Freethink](https://www.freethink.com/technology/hacking-satellites)). ב-2026 ה-CTF הרשמי של Aerospace Village הוא Starpwn, מקוון, 6–9.8.2026 [evidence] ([CTFtime](https://ctftime.org/event/3342/), [BankInfoSecurity](https://www.bankinfosecurity.net/defcon-aerospace-village-seeks-broader-appeal-this-year-a-32400)). ה-RF CTF של RF Hackers Sanctuary משוחק גם מרחוק, והקוד פתוח (`rfhs/rfctf-container`) [evidence] ([DEF CON forum](https://forum.defcon.org/node/236762?p=236762)).
- AIAA 2026–2027: RFPs ל-Open Division Missile ול-Hybrid STOL, ולתואר ראשון Human Mars Base Camp [evidence] ([Missile RFP](https://aiaa.org/wp-content/uploads/2026/08/2026-2027-Open-Division-Missile.pdf), [Design Competitions](https://aiaa.org/get-involved/university-students/design-competitions/)). תנאי ה-Open Division צריכים בדיקה [estimate].
- NATO DIANA: קבוצת 2027 נסגרה ב-3.7.2026; כולל אתגר Multidomain Sensing; זכאות לחברות ממדינות נאט"ו [evidence] ([DIANA](https://www.diana.nato.int/connect/nato-diana-unveils-six-new-challenges-to-tackle-evolving-defence-and-security-needs.html)).
- Kaggle: לא נמצאה תחרות מכ"ם/RF פעילה ב-2025–2026; RadioML 2018 ו-RadDet זמינים כ-datasets [evidence] ([RadDet, arXiv](https://arxiv.org/html/2501.10407v1)). WARC 2025 (AI + Radio) נסגר ב-30.8.2025 [evidence] ([CFP](https://lists.cs.umbc.edu/pipermail/agents/Week-of-Mon-20250609/015394.html)). פריט בתוכנית: חיפוש חודשי ב-Kaggle, CodaLab ו-ICASSP Grand Challenges.

## 3. פרסומים

| ערוץ | מה מאשר | עלות | הערות |
|---|---|---|---|
| arXiv (eess.SP, eess.SY) | חותמת זמן וזמינות, לא ביקורת עמיתים | חינם | מ-21.1.2026 כתובת מוסדית כבר לא מספיקה ל-endorsement; צריך מחבר מבוסס בתחום [evidence] ([arXiv blog](https://blog.arxiv.org/2026), [endorsement](https://arxiv.org/mirrorhelp/endorsement.html)) |
| IEEE RadarConf | ביקורת עמיתים, מאמר כנס ב-Xplore | רישום כנס, בערך $700–1,100 [estimate] | RadarConf'27 מתוכנן לאפריל/מאי 2027; רשימה צד-שלישי: בנגלור, הגשה 31.10.2026 [evidence חלש] ([AESS](https://ieee-aess.org/node/3039), [myhuiban](https://www.myhuiban.com/conference/2080?lang=en-us)) |
| IET Radar 2027 | ביקורת עמיתים, IET | רישום כנס | גלאזגו 25–28.10.2027, מאמר מלא עד 22.2.2027 [evidence] ([IET](https://radar.theiet.org/call-for-submissions)) |
| ION GNSS+ | הקהילה המרכזית ב-PNT; הרצאה + proceedings | רישום כנס | 2026: אורלנדו 14–18.9 [evidence] ([ION](https://www.ion.org/gnss/)); 2027: 20–24.9 אורלנדו, לא רשמי [evidence חלש] ([EPN calendar](https://epncb.oma.be/_newseventslinks/calendar.php)) |
| EuRAD (European Microwave Week) | ביקורת עמיתים אירופית | רישום כנס | EuMW 2027: מילאנו, 3–8.10.2027 [evidence חלש] ([showsbee](https://www.showsbee.com/fairs/95043-European-Microwave-Week-2027.html)) |
| IEEE Aerospace Conference | מאמר מלא 6–20 עמ' שעובר ביקורת | רישום כנס | 2027: ביג סקיי 6–13.3.2027; תקציר 1.7.2026, מאמר 2.10.2026 [evidence] ([AIAA listing](https://www.aiaa.org/events/2027-ieee-aerospace-conference/), [CFP](https://www.aeroconf.org/CFP)). ל-2028: תקציר בערך 1.7.2027 [estimate] |
| IEEE COMCAS (ישראל) | ביקורת עמיתים, קהילת RF הישראלית | רישום כנס | 8–10.11.2027, תל אביב [evidence חלש] ([clocate](https://www.clocate.com/ieee-comcas-international-conference-on-microwaves-communications-antennas-and-electronic-systems/52981/)) |
| IACAS (ישראל) | תקציר שעובר ועדה, קהל התעשייה האווירית | נמוכה | IACAS 2026: 19.3.2026, תל אביב, תקצירים עד 14.12.2025 [evidence] ([IACAS](https://iacas.technion.ac.il/call-for-abstracts)) |
| GRCon (GNU Radio) | הרצאה שהקהילה בחרה, וידאו פומבי | רישום + נסיעה | GRCon26: ראלי, 21–24.9.2026; הרצאות 15/30 דקות, חי בלבד [evidence] ([GNU Radio](https://www.gnuradio.org/news/2025-11-01-grcon26-location-announcement/), [Indico](https://events.gnuradio.org/e/grcon26)) |
| JOSS | ביקורת פומבית של קוד ותיעוד, DOI | חינם | מינואר 2026: נדרש שימוש חוזר אמיתי והיסטוריה; קוד שנוצר רובו ב-AI עשוי לצאת מה-scope [evidence] ([JOSS blog](https://blog.joss.theoj.org/2026/01/preparing-joss-for-a-generative-ai-future)) |
| כתבי עת (IEEE TAES, TSP, Sensors) | ביקורת עמיתים מלאה | חינם במסלול רגיל; open access בתשלום | אין דרישת שיוך מוסדי; מקובל לכתוב "Independent Researcher" [inference] |

נקודות:
- **שיוך:** כנסים וכתבי עת של IEEE מקבלים מחברים עצמאיים. המכשול האמיתי הוא איכות הכתיבה והתאמה לשפת הקהילה, לא השיוך [inference]. arXiv הוא החריג: endorsement מעמית. פריט בתוכנית: המאמר הראשון נשלח לכנס עם ביקורת, ואחרי שמחבר-שותף או מבקר מוכר מכיר את העבודה, מבקשים ממנו endorsement.
- **להיות סוקר:** IEEE בוחר סוקרים לפי פרסומים קודמים. אחרי 2–3 מאמרים בכנס אפשר להירשם כסוקר דרך מערכת הכנס או לבקש מיו"ר סשן [estimate]. סקירה היא אימות חזק: הקהילה סומכת על השיפוט שלך.
- **בקרת יצוא:** חוק הפיקוח על יצוא ביטחוני (2007) מפנה לרשימות Wassenaar, והגדרות צו היבוא והיצוא מוציאות מחקר בסיסי ומידע שהוא נחלת הכלל [evidence] ([MOD](https://exportctrl.mod.gov.il/Documents/חוק%20הפיקוח%20+%20צווים%20+%20תקנות/Defense_Export_Contro_Law.pdf), [BIS](https://www.bis.doc.gov/index.php?id=1147)). ב-26.3.2026 פורסמה טיוטת חוק דו-שימושי חדש [evidence] ([Shibolet](https://www.shibolet.com/en/client-alert-israels-proposed-new-dual-use-export-control-law-a-paradigm-shift-for-exporters/)). פריט בתוכנית: כל פרסום בנוי על נתונים ציבוריים וספרות פתוחה, בלי ידע מסווג ובלי שיטות שמכוונות למערכת ספציפית; לפני פרסום על EW או טכניקות שיבוש עושים בדיקה מול DECA או עורך דין [inference].

## 4. תרומה לקוד פתוח: ה-review של המתחזקים

Merge בפרויקט מוכר אומר שמתחזק שלא מכיר אותך קרא את הקוד, הבין את השינוי וקיבל אחריות עליו. זה אימות של שיפוט הנדסי, לא רק של פלט [inference].

| פרויקט | גל 1 | איך נראה ה-review |
|---|---|---|
| GNU Radio, gr-radar, gr-satellites | עיבוד אותות, מכ"ם, SDR | PR ב-GitHub, CI, דרישת DCO; בלוקים חדשים עוברים לרוב דרך OOT קודם [estimate] |
| GNSS-SDR | PNT, receivers | fork, branch, PR, clang-format, GPL; ארגון מנחה ב-GSoC 12 שנים [evidence] ([contribute](https://gnss-sdr.org/contribute), [GSoC 2025](https://gnss-sdr.org/google-summer-code-2025-ideas-list/)) |
| RTKLIB / RTKLIB-demo5 | PNT, RTK/PPP | פרויקט עם מתחזק אחד; כדאי issue מפורט עם נתונים לפני PR [estimate] |
| KrakenSDR | DF, coherent arrays | קוד פתוח, קהילת חומרה; תרומה = תיעוד, בדיקות שדה, אלגוריתמים [estimate] |
| Sionna (NVIDIA) | ערוץ, ray tracing, 6G | review של צוות מקצועי; תרומות קטנות ומדויקות [estimate] |
| PX4 | שערוך (EKF2), ניווט | review קפדני, דיון בפורום ובשיחות dev שבועיות [estimate] |
| poliastro / hapsira | מסלולים | poliastro הועבר לארכיון ב-2023, והמשכו הוא hapsira [estimate] |

Google Summer of Code פתוח ללא-סטודנטים מאז 2022, מגיל 18, בתנאי שמותר לעבוד במדינת המגורים [evidence] ([GSoC timeline](https://developers.google.com/open-source/gsoc/timeline)). זה מנטור צמוד מפרויקט כמו GNSS-SDR או GNU Radio, עם הערכה באמצע ובסוף [inference]. פריט בתוכנית: הצעה ל-GSoC 2027 (פתיחת הגשות בערך במרץ 2027 [estimate]).

עלות: אפס. זמן: PR ראשון משמעותי 2–6 שבועות; מעמד committer 1–2 שנים של תרומה רציפה [estimate]. אמינות: גבוהה מאוד בתעשייה (קוד שאפשר לבדוק), בינונית באקדמיה, בינונית בביטחון [inference].

## 5. הסמכות וקורסים עם בחינה

| ערוץ | מה מאשר | עלות | זמן | תנאים | אמינות |
|---|---|---|---|---|---|
| INCOSE ASEP | ידע בתהליכי הנדסת מערכות (SE Handbook) | $180 (חבר) + $80 בחינה [evidence] | 2–3 חודשי הכנה [estimate] | אין דרישת השכלה או ניסיון [evidence] | בינונית בתעשייה, טובה בתעשיות הביטחוניות שעובדות לפי INCOSE |
| INCOSE CSEP | ניסיון מתועד + ידע | $350 (חבר) + $80 [evidence] | — | 5+ שנות ניסיון SE עם ממליצים; פחות שנים למי שיש תואר [evidence] | גבוהה; שלב senior+ |
| Georgia Tech PE (GTRI): Principles of Modern Radar ותעודות Radar Systems / Radar Signal Processing | השתתפות בקורס פרונטלי של GTRI | $2,095 לקורס [evidence] | 5 ימים | אין | בינונית-גבוהה בתעשיית המכ"ם בארה"ב |
| AOC (Association of Old Crows) | קורסי EW (EW 101 ועוד), webinars | הנחה לחברים | 1–3 ימים | אין; תוכנית התעודה הוקפאה ב-2025, אולי תחודש סוף 2026/2027 [evidence] | נמוכה-בינונית כהסמכה; טובה כרשת |
| NPS Distance Learning | תעודה ממוסד אקדמי של חיל הים | — | — | מיועד לאנשי צבא וממשל אמריקאים [evidence] | לא רלוונטי לישראלי אזרח [inference] |
| MITx MicroMasters (SDS) | בחינת capstone בהשגחה מקוונת | בערך $1,500 לכל התוכנית [estimate] | 1–1.5 שנים | אין | בינונית; נקודות זכות במוסדות שותפים |
| האוניברסיטה הפתוחה: קורסים בודדים | ציון בבחינה בהשגחה, נקודות זכות | בערך ₪2,000–2,600 לקורס [estimate] ([שכר לימוד](https://www.openu.ac.il/Lists/MediaServer_Documents/registration/nispach%20kaiz%202026c.pdf)) | סמסטר | קבלה פתוחה [inference] | גבוהה בישראל: ציון רשמי ונקודות זכות |
| האוניברסיטה הפתוחה: תואר מלא | B.Sc. (מתמטיקה, מדעי המחשב, הנדסת תעשייה) | עשרות אלפי ₪ [estimate] | 3–6 שנים | אין | גבוהה; יש מסלול מעבר מוגדר מהאו"פ להנדסת חשמל בטכניון [evidence] ([Technion ECE](https://ece.technion.ac.il/wp-content/uploads/2021/08/אפיק-מעבר-מהאוניברסיטה-הפתוחה-לטכניון.pdf)) |
| הטכניון: לימודי חוץ והמשך | קורסים מקצועיים, תעודה | משתנה | משתנה | משתנה | בינונית; לא נמצא קורס מכ"ם/EW פתוח [evidence: חיפוש] |
| רישיון חובב רדיו (משרד התקשורת) | ידע בחשמל, RF, תקנות; זכות לשדר בפסים מותרים | ₪105 בקשת רישיון [evidence] | 1–3 חודשי הכנה [estimate] | בחינה במשרד התקשורת; שלוש דרגות [evidence] ([gov.il](https://www.gov.il/he/service/radio-amateurs-certificates), [IARC](https://www.iarc.org/english-visiting/)) | נמוכה כהסמכה מקצועית; **חיונית** כבסיס חוקי לשידור |

ראיות: INCOSE ([apply ASEP](https://www.incose.org/systems-engineering-certification/apply-for-asep), [FAQ](https://www.incose.org/systems-engineering-certification/certification-faqs)); GT PE ([Modern Radar](https://pe.gatech.edu/product/53005), [Radar Systems Certificate](https://pe.gatech.edu/certificates/radar-systems-certificate), [אוקטובר 2027](https://pe.gatech.edu/product/53883)); AOC ([PD](https://crows.org/professional-development), [Education Board 10.2025](https://crows.org/wp-content/uploads/2025/09/Prof_Dev_Education_Board_ReadAhead_Oct2025.pdf)); NPS ([catalog](https://nps.smartcatalogiq.com/current/academic-catalog/nonresident-education-opportunities-distance-learning)); MITx ([SDS](https://support.learn.mit.edu/hc/en-us/articles/41953138415131-What-is-the-MITx-MicroMasters-Program-Credential-in-Statistics-and-Data-Science)); IARC מדריך דרגת Extra 2026 ([PDF](https://www.iarc.org/wp-content/uploads/2026/01/Rosenne_Extra_Class_Supplement_2026.pdf)).

שתי מסקנות:
1. **ציון רשמי ישראלי** הוא הדרך הזולה ביותר להפוך "למדתי לבד" למשהו שמערכת גיוס בתעשייה הביטחונית קוראת. קורסי האו"פ במתמטיקה (אינפי, אלגברה לינארית, הסתברות) עם בחינה בהשגחה מאמתים את הבסיס שהלומד בונה עכשיו בקולמוגורוב [inference]. פריט בתוכנית: לבדוק בקטלוג האו"פ אילו קורסים (אותות ומערכות, הסתברות, אלגברה לינארית, משוואות דיפרנציאליות) זמינים, ולשבץ 1–2 בחינות בשנה.
2. **רישיון חובב רדיו** הוא פריט חובה בתוכנית, לא מדליה: הוא מה שהופך ניסויי שידור (מכ"ם FMCW קטן, beacon, מדידות אנטנה) לחוקיים בפסים המותרים. שיבוש (jamming) אסור גם לבעל רישיון; ניסויי EW נעשים בכבלים, בתא מסוכך או בקליטה בלבד [inference].

## 6. בוחנים אנושיים

| ערוץ | מה מאשר | עלות | הערות |
|---|---|---|---|
| ביקורת בתשלום (Kolabtree, Upwork, GLG) | מומחה קורא דוח תכנון ומחזיר הערות | $25–200 לשעה בפרופילי מכ"ם ב-Kolabtree [evidence] ([Kolabtree RF](https://kolabtree.com/find-an-expert/subject/radio-frequency)) | ברירת המחדל: מכ"מיסט בדימוס, 2–4 שעות לדוח [estimate] |
| מנטור מהתעשייה (גמלאי רפאל/אלתא/תע"א) | בחינה בעל פה חוזרת | חינם עד בתשלום | מגיעים דרך IEEE Israel, COMCAS, IACAS ו-LinkedIn [inference] |
| IEEE Israel Section, AESS chapter | הרצאה בפני קהילה, היכרות | חברות IEEE בערך $200 לשנה [estimate] | לוח האירועים ב-[ieee.org.il](https://ieee.org.il/events/month/2025-05); חוקרים כמו Igal Bilik (BGU) מרצים ב-AESS [evidence] ([AESS](https://ieee-aess.org/post/igal-bilik-uk-and-ireland-section-chapter)) |
| ION (Institute of Navigation) | קהילת PNT, ועדות, כנסים | חברות שנתית | פריט בתוכנית: חברות לפני ION GNSS+ 2027 |
| האגודה הישראלית לבקרה אוטומטית | קהילת שערוך ובקרה | — | כנס שנתי בטכניון [estimate] |
| בחינה בעל פה מפרופסור | הערכה ישירה של עומק | חינם עד שכר שעה | **שיטה:** פונים לפרופסור עם מאמר טיוטה או דוח, מבקשים שעה אחת של "תקפו אותי"; במקביל מציעים להיות נבדק כשומע חופשי בקורס מתקדם [inference] |

הבחינה בעל פה היא הבדיקה הקרובה ביותר לאופן שבו התעשייה בוחנת מומחה: ראיון טכני, שאלות "למה" ו"מה אם" [inference]. היא גם המקום שבו כלי AI עוזר הכי מעט, ולכן היא האות הנקי ביותר ליכולת עצמאית.

## 7. רקורד לאנליסטים

- **Good Judgment Open:** ציון Brier יחסי מול הקהל. ההמלצה הרשמית: לפחות 100 שאלות; מגויסים עוברים 3 חודשי ניסיון; לא בודקים השכלה ומיקום [evidence] ([GJ](https://goodjudgment.com/how-to-become-a-superforecaster/)). ה-superforecasters היו מדויקים בכ-25% יותר מהקהל [evidence] ([GJ PDF](https://goodjudgment.com/wp-content/uploads/2021/10/Superforecasters-A-Decade-of-Stochastic-Dominance.pdf)).
- **Metaculus:** log score; Metaculus Cup שלוש פעמים בשנה, ארבעה חודשים, $5,000 [evidence] ([Metaculus](https://www.metaculus.com/tournaments/), [EA Forum](https://forum.effectivealtruism.org/posts/XpdtiySZsHJmGL6dM/the-metaculus-cup-series-is-live-usd5-000-prize-pool)).
- **מאמרי ניתוח:** War on the Rocks דוחה בערך 95% מההצעות; pitch עד 200 מילים ל-editor@warontherocks.com; Cogs of War לטכנולוגיה ותעשייה ביטחונית, 1,500–2,000 מילים [evidence] ([WOTR](https://warontherocks.com/guidelines/), [Cogs of War](https://warontherocks.com/how-to-contribute-to-cogs-of-war/)). Breaking Defense מקבל op-eds דרך עורכים [estimate].
- **Substack אישי:** לא מאמת לבד. מאמת כשמומחים מצטטים, מגיבים או מתקנים. מדד: ציטוטים, הזמנות לפודקאסט, הפניות מחוקרים [inference].
- **שיטה:** כל ניתוח מבצעי מסתיים בתחזית מספרית שנרשמת (Metaculus או יומן ציבורי עם חותמת זמן), כך שהניתוח נבדק מול העולם [inference].

## 8. מוצר כאימות

- **משתמשים משלמים** הם האימות היחיד שבודק שהידע פותר בעיה למישהו אחר. אפילו 10 לקוחות לכלי (למשל ספריית ניתוח link budget, כלי RTK לחקלאות, מודול GNU Radio מסחרי) שווים יותר מכוכבים [inference].
- **כוכבי GitHub** מודדים חשיפה, לא נכונות. אות חזק יותר: issues מאנשים אחרים, forks שמתוחזקים, ציטוט בספרות [inference].
- **שימוש של ארגון** (מכתב, case study) הוא הגשר בין תיק העבודות לתעסוקה [inference].
- בקרת יצוא חלה גם כאן: מוצר שמבצע פונקציה ביטחונית או דו-שימושית מחייב בדיקת רישוי לפני מכירה לחו"ל. פריט בתוכנית: מוצרים ראשונים בתחומים אזרחיים (GNSS, SDR, מדידות אנטנה) [inference].

## 9. סולם אימות חיצוני לפי רמה

כל שלב דורש **שני ערוצים שונים** (למשל ציון + review, או merge + כנס), כדי שהאות לא יהיה תלוי בשופט אחד [inference].

| רמה | מה צריך להראות | אימות חיצוני שמסמן את המעבר | זמן מצטבר [estimate] |
|---|---|---|---|
| **junior** | בסיס נכון, יכולת להריץ ולבדוק | 2–3 קורסי האו"פ עם ציון (אינפי, אלגברה לינארית, הסתברות); רישיון חובב רדיו; 2–3 PRs קטנים שמוזגו (GNU Radio / GNSS-SDR); פתרון מלא ל-Decimeter / MAFAT Radar על הנתונים הציבוריים, מול ציון הזוכים | 6–12 חודשים |
| **mid** | פרויקט עצמאי שעובד על נתונים אמיתיים | תרומת feature ב-GNSS-SDR או בלוק ב-gr-radar; RF CTF בטופ 25%; ASEP; דוח תכנון שעבר ביקורת בתשלום של מכ"מיסט; GSoC; הרצאה ב-GRCon או ב-IACAS | 12–24 חודשים |
| **senior** | שיפוט: בחירת בעיה, הנחות, גבולות | 2–3 מאמרים בכנסים עם ביקורת (RadarConf, ION GNSS+, EuRAD, COMCAS, IEEE Aerospace); מיקום גבוה בתחרות חיה (MAFAT, SP Cup דרך שיתוף עם מוסד, Radar Challenge); בחינה בעל פה מפרופסור; JOSS לכלי עם משתמשים | 24–40 חודשים |
| **expert** | הקהילה סומכת על השיפוט שלך | סוקר בכנס IEEE/ION; מאמר בכתב עת (TAES, TSP, NAVIGATION); מתחזק או committer בפרויקט; פתרון ממומן ב-AESS Challenge Problem; ציטוטים מאחרים; לקוחות משלמים | 40–60 חודשים |
| **principal** | מגדיר בעיות לאחרים | מארגן תחרות (הצעת SP Cup / Challenge Problem), יו"ר סשן, מאמר מוזמן או tutorial, ייעוץ בתשלום לארגון, מוצר עם הכנסה חוזרת; לאנליסט: רקורד Brier ציבורי של שנתיים ופרסום ב-WOTR | 60+ חודשים |

הערה: בתחומים הבאים (אחרי גל 1) אותו סולם עובד עם ערוצים מקבילים: AIAA לאווירונאוטיקה, ION ו-PX4 לשערוך וניווט, IACAS ו-AIAA Open Division לטילים, Metaculus ו-WOTR לניתוח אסטרטגי [inference].

## 10. לוח שנה 2027

| מתי | אירוע | פעולה | סטטוס |
|---|---|---|---|
| עכשיו–12.2026 | MAFAT Challenge | הרשמה לרשימת התפוצה | [evidence] אתר פעיל |
| 7.12.2026 | AOC 2026, National Harbor | קורס EW לא-מהנדסים (מחוץ לישראל, אופציונלי) | [evidence] |
| 12.2026 | IACAS 2027 | הגשת תקציר (לפי מועד 2026: אמצע דצמבר) | [estimate] |
| 1.2027 | Metaculus Cup | התחלת רקורד רציף | [estimate] |
| 1–3.2027 | GSoC 2027 | בחירת פרויקט (GNSS-SDR / GNU Radio), PR ראשון, הגשת הצעה בערך במרץ | [estimate] |
| 22.2.2027 | IET Radar 2027 | מועד אחרון למאמר מלא | [evidence] |
| 6–13.3.2027 | IEEE Aerospace Conference, ביג סקיי | צפייה בהקלטות, תכנון הגשה ל-2028 | [evidence] |
| 3.2027 | IACAS 2027, ישראל | הצגה; פגישות עם התעשייה | [estimate] |
| מועד ההרשמה של משרד התקשורת | בחינת חובב רדיו | לעבור בחינה | [evidence] שירות פעיל |
| 4–5.2027 | IEEE RadarConf'27 (בנגלור, לא רשמי) | צפייה ב-Radar Challenge; תכנון ל-RadarConf'28 | [evidence חלש] |
| 16–21.5.2027 | ICASSP 2027, טורונטו (גמר SP Cup) | מעקב אחרי נושא SP Cup 2028 | [evidence] |
| 1.7.2027 | IEEE Aerospace 2028 | הגשת תקציר | [estimate] |
| 8.2027 | DEF CON 35 (RF CTF מרחוק, Aerospace Village) | השתתפות מרחוק | [estimate] |
| 9.2027 | GRCon27 | הרצאה (CFP בערך מאי–יוני) | [estimate] |
| 20–24.9.2027 | ION GNSS+ 2027, אורלנדו | מאמר / פוסטר PNT (תקציר בערך מרץ) | [evidence חלש] |
| 3–8.10.2027 | EuMW 2027 / EuRAD, מילאנו | מאמר (מועד הגשה בערך פברואר) | [evidence חלש] |
| 25–28.10.2027 | IET Radar 2027, גלאזגו | הצגת מאמר אם התקבל | [evidence] |
| 25–29.10.2027 | GT PE: Principles of Modern Radar, אטלנטה | אופציה, $2,095 | [evidence] |
| 8–10.11.2027 | IEEE COMCAS 2027, תל אביב | מאמר; היכרות עם קהילת RF הישראלית | [evidence חלש] |
| כל סמסטר | בחינות האו"פ | 1–2 קורסים לשנה | [inference] |

## 11. סדר מעשי לגל 1 (המלצה)

1. **מיידי:** רישום ל-MAFAT; חשבונות ב-GJ Open ו-Metaculus; התחלת הכנה לבחינת חובב רדיו; issue ראשון ב-GNSS-SDR או GNU Radio [inference].
2. **רבעון 1 2027:** פתרון מלא ל-Decimeter Challenge על הנתונים הציבוריים, השוואה לזוכים, כתיבת דוח קצר שעובר ביקורת בתשלום; הצעת GSoC [inference].
3. **2027 כולו:** מאמר ראשון ל-ION GNSS+ או ל-COMCAS; הרצאה ב-GRCon או ב-IACAS; 1–2 בחינות באו"פ; ASEP [inference].
4. **2028:** מאמרים ל-RadarConf'28 ול-EuRAD, בקשה להיות סוקר, מוצר ראשון בתחום אזרחי [inference].
