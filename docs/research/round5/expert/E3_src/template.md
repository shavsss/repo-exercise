# E3: מסלול הניסיון המעשי, AI-native, לכל תחום

תאריך: 30.10.2026. נתונים מלאים (מעבדות, שעות, ציוד, מחירים): `E3_practice_track.json`. התחומים הם 36 התחומים של `docs/research/round4/LV_benchmark.md`, וה-"Next level" של כל תחום שם הוא נקודת המוצא של המעבדות כאן.

סימון: [evidence] נבדק במקור, [inference] מסקנה ממקורות, [estimate] אומדן שלי. מחירים: USD לפי מחירון ספק או מפיץ באוקטובר 2026, ו-₪ = USD × 3.05 × 1.18 (שער של תחילת אוקטובר 2026 [evidence], מע"מ 18% [inference]), בלי משלוח [estimate].

## תקציר

- **{{N_LABS}} מעבדות ב-36 תחומים**, בחמש רמות (כניסה, מעשי, מתקדם, מומחה, מחקר). בכל תחום יש לפחות בנייה או מדידה אמיתית אחת: חומרה, נתונים אמיתיים או מערכת שעובדת.
- **שעות:** {{H_ALL}} בסך הכל. גל 1 הוא {{HW1}} שעות, ומתוכן ליבה של {{H_CORE1}} שעות. הנתיב למומחה (כל המעבדות עד רמה 4, ורמת המחקר בגל 1 ובתחומים הרציפים) הוא {{H_EXP}} שעות [estimate].
- **תקציב:** מינימלי ${{T_MIN}} (≈ ₪{{T_MIN_ILS}}), מומלץ ${{T_REC}} (≈ ₪{{T_REC_ILS}}), מלא ${{T_FULL}} (≈ ₪{{T_FULL_ILS}}). השכבה המינימלית מכסה {{H_TMIN}} שעות מעבדה, המומלצת {{H_TREC}}, והמלאה את כל {{H_TFULL}} [estimate].
- **תפקיד הלומד:** הוא מגדיר, מנבא, בוחר ומאמת. ה-AI כותב קוד, מפעיל מכשירים ב-Python/SCPI, מעבד נתונים וכותב טיוטות. אף תוצאה לא נכנסת לתיק בלי חיזוי שנכתב לפני המדידה, ובלי בדיקה בדרך שנייה ובלתי תלויה.
- **ישראל:** כל שידור נעשה בכבל או בקופסה מסוככת, אחרי בדיקת דליפה (EW2). באוויר: רק קליטה של שידורים ציבוריים. רישיון חובב רדיו הוא פריט בתוכנית, בחודשים 2–4 של גל 1. בקרת יצוא (DECA) נבדקת לפני כל מוצר או פרסום טכני רגיש. פירוט בסעיף 10.

## 1. העיקרון: מתכנן שמכוון סוכנים

ההנחה שבודקים (BRIEF, "Sharpening"): אדם אחד עם הבנה עמוקה, שה-AI משמש לו מחשבון, מתכנת וטכנאי, יכול לעשות עבודת מומחה ברמת מתכנן ובונה. המעבדות בנויות כדי לבדוק את ההנחה הזו על חומרה ועל נתונים אמיתיים, ולא רק להניח אותה [inference].

| מה הלומד מחזיק בראש | מה מוסר ל-AI | מה הוא חייב לאמת בעצמו |
|---|---|---|
| המודל הפיזיקלי ושלד הגזירה, סדרי גודל, גבולות תוקף, פשרות | קוד עיבוד, דרייברים (pyvisa/SCPI, pyadi-iio, pyubx2), סקריפטי sweep, גרפים, טיוטות | החיזוי המספרי לפני ההרצה, תקציב השגיאה, מקרה ייחוס ידוע, ושההשוואה לתיאוריה הוגנת |
| הגדרת השאלה והניסוי (מה מודדים, למה, מה ישנה החלטה) | חיפוש ספרות, השוואת שיטות, הצעת טופולוגיה ו-layout | יחידות, סימנים, כיול, ושהקוד מודד את מה שהוא אמור למדוד |
| בחירת ארכיטקטורה ורכיבים | BOM, חישובי עזר, סימולציות SPICE/EM/CFD | יציבות, מרווחים, תנאי שפה, ומה קורה מחוץ לתחום המודל |
| שיפוט: האם התוצאה מספיקה להחלטה | סיכום, ניסוח דוח | כל מספר בדוח, וכל טענה שיוצאת החוצה |

## 2. פרוטוקול המעבדה (חוזה מעבדה)

כל מעבדה, בכל רמה, עוברת את אותם תשעה צעדים. הצעדים מתועדים בקובץ אחד, `lab.md`, בריפו של המעבדה.

1. **מסגור:** שאלה אחת, וההחלטה שהתשובה תשנה.
2. **חיזוי:** מספר עם רווח (למשל "SNR = 23 ± 2 dB ב-5 מ'"), שנכתב לפני כל הרצה. נכנס ליומן החיזויים (JU1).
3. **תקציב שגיאה:** טבלת מקורות (כיול, הפסדי כבל, מנחתים ±0.5 dB, רעש קוונטיזציה, גאומטריה) וסכום RSS.
4. **AI בונה:** קוד, דרייבר SCPI, צינור עיבוד. הלומד כותב את המפרט וסוקר את ה-diff.
5. **בדיקת מקרה ידוע:** הקוד רץ קודם על קלט שהתשובה שלו ידועה (טון בכבל, דוגמה מהספר, נתון סינתטי), ורק אחר כך על הנתון האמיתי.
6. **מדידה:** מכשיר אמיתי, הקלטה ב-SigMF או CSV עם מטא-דאטה (תאריך, תצורה, גרסת קוד).
7. **השוואה לתיאוריה:** שארית (residual), ובדיקה אם היא בתוך התקציב. אם לא, מחפשים את הסיבה לפני שממשיכים.
8. **יומן שגיאות AI:** כל מקום שבו ה-AI טעה (יחידות, סימן, הנחה, API), איך זה נתפס, וכמה זמן לקח (JU3).
9. **תוצר לתיק:** ריפו, נתונים, דוח קצר עם גרף "חזוי מול נמדד". ברמה 4–5 גם טיוטת פרסום.

שלושה כללים שמגינים מפני שחיקת מיומנות ומפני ביטחון שווא [inference]:
- **בלי AI בסדר הגודל:** את החיזוי בצעד 2 הלומד עושה בעצמו, בראש או על נייר, ורק אחר כך בודק עם rfcalc.
- **שתי דרכים:** תוצאה מרכזית מאומתת בשיטה נוספת (סימולציה מול מדידה, שני מכשירים, נוסחה סגורה מול Monte Carlo).
- **הסבר חוזר:** בסוף כל מעבדה, הסבר של 5 דקות בלי מסמכים: למה התוצאה יצאה כך, ומה היה משנה אותה.

כרטיס מעבדה (פורמט אחיד, שגם המורים בגילואה ובלנצ'סטר יכולים להוציא כבלוק):

```yaml
id: RD2
question: "האם מחזיר פינתי בגודל 10 ס\"מ נראה ב-SNR > 20 dB ב-10 מ' עם chirp X?"
prediction: {value: 24, unit: dB, interval: [21, 27], written: 2027-01-12}
error_budget: [cal 1.0, cable 0.3, RCS 1.5, pointing 1.0]   # dB, RSS 2.1
known_case: "מחזיר ב-2 מ', מול משוואת מכ\"ם"
ai_tasks: [chirp config, range-Doppler, CFAR, plot]
result: {measured: 22.8, within_budget: true}
ai_errors: ["dBsm↔m² בקוד RCS, נתפס בצעד 5"]
output: portfolio/radar/rd2/
```

## 3. הספסל: ארבע תצורות

**א. ספסל RF בכבל ובקופסה (כל שידור).**

```
 [Pluto TX] ─ 30 dB ─┐
                     ├─ combiner ─ step-att (0–60 dB) ─ [bladeRF/RTL RX]
 [bladeRF TX "jammer"]─ 30 dB ─┘                  │
                     כל השרשרת בתוך קופסה מסוככת, ומחוץ לה tinySA בודק דליפה
```

לפני כל שידור: בדיקת דליפה (EW2) בתדר העבודה, עם עומס 50 אוהם בכל יציאה פתוחה. סף קבלה: אות שנמדד מחוץ לקופסה נמוך מרצפת הרעש של ה-tinySA [estimate: יעד 60–80 dB סיכוך לקופסה מסחרית].

**ב. קליטה בלבד באוויר:** ADS-B 1090 MHz, AIS, FM ו-DVB-T (מאירים למכ"ם פסיבי), GNSS, לוויני מזג אוויר NOAA/Meteor, ועוצמת downlink סלולרי בלי פענוח תוכן.

**ג. שידור ברישיון חובב:** אחרי הרישיון, ניסויים באוויר רק בפסי חובבים ובמגבלות ההספק של הדרגה (סעיף 10).

**ד. ספסל אלקטרוניקה ו-SCPI:** סקופ Siglent וספק מתוכנת שמופעלים מ-Python (pyvisa). ה-AI כותב את הדרייברים, והלומד כותב את תסריט המדידה.

## 4. גל 1 בפירוט: חישה, אותות ו-EW, ועמוד השדרה

גל 1 בונה מערכת אחת שגדלה לאורכו: **צומת חישה** על Raspberry Pi 5, עם מכ"ם פסיבי (RD4), ניטור הפרעות GNSS (PN4), סקר ספקטרום (EW1) ו-DF (EW4). המעבדות בתחומי עמוד השדרה (מתמטיקה, אותות, שערוך, אלקטרוניקה, ML) משתמשות באותם אותות ובאותה חומרה. כך כל שעה במתמטיקה נמדדת גם על חומרה אמיתית [inference].

מקורות נתונים לגל 1:
- **מכ"ם:** RadarScenes, נתוני מכ"ם רכב, ענני נקודות מ-4 חיישנים, ‏~11 GB [evidence]; CARRADA, מצלמה ומכ"ם עם תיוג range-angle-Doppler, רישיון CC BY-NC-SA [evidence]; DIAT-μSAT, ‏4,849 ספקטרוגרמות מיקרו-דופלר ממכ"ם CW ב-10 GHz של רחפנים וציפור ביונית, בגישה אקדמית [evidence]; MSTAR, עשר מחלקות, דרך IEEE DataPort [evidence]; Real Doppler RAD-DAR, מאגר מכ"ם דופלר בקגל, צריך לאמת את הגרסה והרישיון לפני שמשתמשים [inference].
- **EW:** RadioML 2018.01A, ‏24 אפנונים ו-2 מיליון דגימות ב-HDF5, ברישיון CC BY-NC-SA. המאגר סינתטי בחלקו ותיקון שלו מגיע בהקלטות עצמיות (ML2) [evidence].
- **PNT:** GSDC 2023, יותר מ-150 הקלטות טלפון עם ground truth [evidence]; TEXBAT, הקלטות זיוף של UT Austin [inference: זמין לחוקרים]; נתוני ADS-B NIC/NACp מ-OpenSky, ומפות GPSJam ו-Flightradar24 [evidence].
- **ישראל כמקור נתונים:** UT Austin איתרו ביולי 2024 משדר זיוף בבסיס אווירי בצפון ישראל, עם השפעה על לבנון, ישראל, סוריה, ירדן, מצרים, טורקיה וקפריסין [evidence]. ב-ION ITM 2025 (Stanford) נותחו נתוני שני מקלטי u-blox F9P על כלי שיט בדרך לחיפה, בקיץ 2024 [evidence]. IATA מדווחת על עלייה של 193% באירועי זיוף במטוסים בין 2023 ל-2025, ומונה את מזרח הים התיכון בין האזורים הנפגעים ביותר. המספר הגיע דרך דיווח משני ולא נבדק במקור [inference]. PN4 ו-PN6 בונים על המקורות האלה, ומוסיפים את המקלט של הלומד כתחנה עצמאית.

{{W1}}

## 5. תחומים רציפים (לאורך כל הגלים)

שיקול דעת הנדסי ומלאכת הניתוח רצים במקביל לכל גל. יומן החיזויים (JU1) מתמלא מכל מעבדה בכל תחום.

{{W0}}

## 6. גלים 2–4

כל תחום כאן מקבל לפחות בנייה או מדידה אמיתית אחת (שורת "חובה"). העמודות מקוצרות, ואת תפקיד ה-AI לכל מעבדה אפשר למצוא ב-JSON. התבנית זהה לגל 1: ה-AI בונה ומעבד, והלומד מגדיר, מנבא ומאמת.

### גל 2: תקשורת, EO/IR, כטב"מים, רובוטיקה, חלל, C4ISR

{{W2}}

### גל 3: טילים, הגנה אווירית, זורמים, מבנים, חום, הספק, ימי

{{W3}}

### גל 4: הנדסת מערכות, חקר ביצועים, לוגיסטיקה, רכש, מערכות יריב

{{W4}}

## 7. סיכום שעות

{{SUMMARY_TABLE}}

לפי גל: גל 1 {{HW1}} שעות, גל 2 {{HW2}}, גל 3 {{HW3}}, גל 4 {{HW4}}, ורציף {{HW0}}.

**תרגום לזמן [estimate]:** אם המעבדות לוקחות בערך חצי מיום של 8–10 שעות (כ-4.5 שעות ביום, 6 ימים בשבוע, 48 שבועות בשנה), יש כ-1,300 שעות מעבדה בשנה.
- ליבת גל 1 ({{H_CORE1}} שעות) לוקחת כ-18–21 חודשים, כולל שלושת פרויקטי המחקר (RD6, EW6, PN6). פרויקטי המחקר ממשיכים כחוט מחקר גם לתוך גל 2.
- הקטלוג המלא ({{H_ALL}} שעות) הוא כ-5.5 שנים בקצב הזה. זה ארוך מ-28.5 החודשים של `F_timeline`, כי שם לא נכללו שעות מעבדה.
- **שתי דרכים לקצר בלי לוותר על חומר:** שיעורים שנבנים סביב מעבדה, כך שהקריאה והמדידה הן אותה שעה, ומעבדות משותפות לכמה תחומים (ML4=RD6, PN5≈CE3, EW5≈CM3, PS1≈PH5). הערכה גסה: חיסכון של 15–25% [estimate].
- המעבדות שנדחו מליבת גל 1 (12 מעבדות, ברשימה `wave1_deferred_labs` ב-JSON) נשארות בתוכנית, כמעבר העמקה בתחילת גל 2.

## 8. תקציב בשכבות

| שכבה | USD | ₪ (כולל מע"מ) | שעות מעבדה שאפשר להריץ | מה היא מאפשרת |
|---|---|---|---|---|
| מינימלי | {{T_MIN}} | {{T_MIN_ILS}} | {{H_TMIN}} | RTL-SDR, Pluto, NanoVNA, tinySA, ערכת SMA, F9P אחד, מכ"ם 60 GHz IWRL6432, ספסל בסיסי. מספיק לרוב המעבדות ברמה 1–3 בגל 1, ולכל המעבדות שרצות על נתונים בלבד |
| מומלץ | {{T_REC}} | {{T_REC_ILS}} | {{H_TREC}} | + KrakenSDR, bladeRF, IWR6843+DCA1000, בסיס RTK, סקופ, ספק, קופסה מסוככת, מצלמה תרמית, Crazyflie, מדפסת, הידרופון, כ-400 שעות H100 |
| מלא | {{T_FULL}} | {{T_FULL_ILS}} | {{H_TFULL}} | + Phaser CN0566, ‏USRP B210, ‏HackRF Pro, ‏LimeSDR, ‏ZED-F9R, ‏X500/PX4, ‏rover ל-ROS 2, ‏Ramsey, ‏GPSDO, ‏KrakenSDR שני, כ-1,400 שעות GPU |

עלויות שוטפות שלא נכללו: מנוי AI לסוכנים (Claude ודומיו), כ-100–200 דולר בחודש [estimate]. ענן GPU: שעת H100 עולה כ-2–3.3 דולר ב-RunPod וכ-3.3–4.3 דולר ב-Lambda, לפי סוג המופע (אוקטובר 2026) [evidence].

סדר קנייה: שכבת המינימום בחודש 1. KrakenSDR, bladeRF, קופסה וסקופ כשמגיעים ל-EW3/RD4 (חודשים 3–6). IWR6843+DCA1000 ב-RD3. Phaser ו-B210 רק כשמגיעים ל-AN3/RD5/EW6, וכשיש החלטה על פרויקט מחקר שצריך אותם [inference].

### קטלוג הציוד

{{EQUIP_TABLE}}

הערות מחיר:
- ‏ADALM-Pluto הושק ב-149 דולר, ובאוקטובר 2026 מחירו ב-DigiKey ארה"ב כ-230 דולר [evidence].
- ‏KrakenSDR: 499 דולר אצל היצרן, ואצל משווקים 800–1,250 [evidence].
- ‏Phaser CN0566: ‏2,500–2,875 דולר. הערכה כוללת Pluto ו-Raspberry Pi 4 [evidence].
- ‏DCA1000EVM: כ-697 דולר ב-LCSC, במלאי משתנה [evidence].
- ‏HackRF Pro: הושק ב-400 דולר, ומשלוחים מספטמבר 2025 [evidence].
- ‏RTL-SDR Blog V4: מוכר כעת כ-V4L [inference].

## 9. שלבים לאורך הגלים

| שלב | חודשים [estimate] | מעבדות מרכזיות | רכש |
|---|---|---|---|
| גל 1א: ספסל ויסודות | 0–4 | SG1–SG3, MA1–MA2, CE1–CE2, FQ1–FQ3, EW1–EW2, AN1, RD1–RD2, PN1–PN2, EL1, PE1–PE2, ML1, JU1 | מינימום + סקופ, ספק; מבחן רישיון חובב |
| גל 1ב: מערכות | 4–12 | EW3–EW4, RD3–RD4, PN3–PN4, AN2, AN4, CE3–CE4, EL2–EL3, ML2, MA3–MA4, SG4 | KrakenSDR, bladeRF, קופסה, IWR6843+DCA1000, בסיס RTK, Crazyflie |
| גל 1ג: מחקר | 10–21 | RD5–RD6, EW5–EW6, PN5–PN6, AN3, AN5, ML4 | Phaser, ‏B210, ‏ZED-F9R, ‏GPSDO (שכבה מלאה) |
| גל 2 | 18–36 | תקשורת, EO/IR, כטב"מים, רובוטיקה, RL, חלל, C4ISR, פיזיקה, ומעבר ההעמקה של גל 1 | מצלמה תרמית, X500, rover, LoRa |
| גל 3 | 34–52 | טילים, AMD, זורמים, מבנים, חום, הספק, ימי, שרידות, השפעת נשק | מדפסת, ספסל דחף, הידרופון, טיל דגם |
| גל 4 | 50–66 | SE, OR, לוגיסטיקה, רכש, מערכות יריב | בעיקר נתונים |
| רציף | כל הזמן | JU1–JU4, OS1–OS4 | — |

הגלים חופפים: פרויקט המחקר של גל אחד ממשיך בזמן שהגל הבא מתחיל [inference].

## 10. ישראל: חוק, רישוי ובטיחות (פריטים בתוכנית)

**שידור.** הפעלת משדר דורשת רישיון ממשרד התקשורת לפי פקודת הטלגרף האלחוטי, חוץ מציוד שפטור בתקנות הפטור. תקנות הפטור תוקנו ב-2024 [inference, לפי TÜV]. בתוכנית:
- כל ניסוי שידור (EW3, EW5, IC1–IC4, CM3, RL4) נעשה בכבל עם מנחתים ועומסים, בתוך קופסה מסוככת, ואחרי בדיקת דליפה מתועדת (EW2).
- הפרעה מכוונת (jamming) וזיוף GNSS נעשים רק בכבל סגור. לזיוף משתמשים בהקלטות מוכנות (TEXBAT) ובנתונים האזוריים.

**קליטה.** קליטה של שידורים ציבוריים (ADS-B, AIS, שידורי רדיו וטלוויזיה, GNSS, לוויני מזג אוויר) היא הבסיס של המכ"ם הפסיבי, של מפת ההפרעות ושל OSINT. תוכן של תקשורת פרטית לא מפענחים ולא שומרים (חוק האזנת סתר, התשל"ט-1979) [inference]. בסלולר מודדים עוצמה בלבד, בלי פענוח.

**מכ"ם mmWave ו-Phaser.** אלה משדרים בהספק נמוך. לפני שימוש באוויר הפתוח בודקים שהתדר והשימוש ברשימת הפטורים של משרד התקשורת (60 GHz, 77 GHz), או מפעילים בפס חובבים ברישיון (Phaser ב-10 GHz, בכפוף להקצאה לדרגה). עד אז: מעבדה סגורה, עם בולעים ובמרחקים קצרים [inference]. בישראל צומצמה ב-2021 הגישה של חובבים לפסי מיקרוגל [evidence], ולכן צריך לבדוק את טבלת הפסים העדכנית לפני RD5/AN3.

**רישיון חובב רדיו (פריט בגל 1א).**
1. לומדים לפי חוברת הבחינה של אגודת חובבי הרדיו (IARC). ל-2026 יש גם מוסף לדרגה Extra [evidence].
2. נרשמים לבחינה של משרד התקשורת: טופס פרטים, הצהרת סודיות, בקשה להיבחן, תעודה מזהה ותמונה. המסמכים מגיעים עד שבועיים לפני הבחינה [evidence].
3. אחרי שעוברים: אות קריאה ורישיון תחנה עם אגרה, וחידוש כל 5 שנים [evidence]. הדרגות הן A/Extra (4X1/4Z1), ‏B/General ו-C/Novice [evidence, ויקיפדיה].

יעד: דרגה B או A. זמן משוער: 6–10 שבועות לימוד בצד, כ-60 שעות שלא נספרו בטבלה. הקורס מכסה את רוב יסודות ה-RF של גל 1 [estimate]. ברישיון חובב אין הצפנה ואין שימוש מסחרי (נורמה בינלאומית [inference]), ולכן מוצרים לא נבדקים על ציוד ברישיון חובב.

**רחפנים.** רחפן מעל 250 גרם דורש רישום ורישיון מפעיל מרשות התעופה האזרחית (רת"א) [evidence, Shibolet]. מנובמבר 2023, רחפן מעל 200 גרם חייב חיבור UTM [evidence]. בזמן מלחמה יש הגבלות נוספות. בתוכנית: SITL ו-Gazebo, ‏Crazyflie (פחות מ-50 גרם) בתוך מבנה, וכלוב רשת. X500 מוטס רק בשדה מורשה, אחרי רישיון מפעיל.

**טילי דגם.** מנועים עשויים להיות מוסדרים כחומר נפץ [inference, לא נבדק בחיפוש]. בתוכנית: MS3 נעשה דרך מועדון מורשה, או על לוגים פומביים של שיגורים. אם שתי האפשרויות לא זמינות, נשארים בסימולציה, וההשוואה נעשית מול נתוני טיסה שפורסמו.

**בקרת יצוא.** חוק הפיקוח על יצוא ביטחוני (2007) מחייב רישיון מאגף הפיקוח על היצוא הביטחוני (אפ"י, DECA) גם להעברת ידע ביטחוני ולשירות ביטחוני [evidence]. רשימת הדו-שימושי מבוססת על Wassenaar [evidence]. בשנת 2026 הוצעה הצעת חוק חדשה לדו-שימושי [evidence]. בתוכנית:
- הפרסומים נשענים על מקורות פתוחים, ערכות מסחריות ונתונים ציבוריים.
- לפני מכירת מוצר (למשל צומת ניטור GNSS או מכ"ם פסיבי) או ייעוץ לגורם בחו"ל, נעשית בדיקת סיווג מול אפ"י או מול יחידת הדו-שימושי במשרד הכלכלה.
- נתונים בעלי רגישות לא מעלים לשירותי AI בענן.

**רישיונות נתונים.** RadioML ו-CARRADA ברישיון שאינו מסחרי (NC). למוצר משתמשים בנתונים שהלומד הקליט בעצמו [evidence].

**בטיחות.**
- RF: Pluto משדר בהספק של מיליוואטים, וכל השידור בכבל [inference].
- סוללות LiPo: טעינה בשקית חסינת אש.
- אדי הלחמה: יניקה.
- ספק ומתח רשת: מבודדים.
- מדחפים: כלוב, ומשקפי מגן במבחני שבר.
- הידרופון: רק מכשירים שמוזנים מסוללה.
- ESD: רצועה ומשטח, במיוחד ליד ה-front-end של ה-SDR וה-EVM.

## 11. התיק החי ופוטנציאל מוצר

כל מעבדה מוציאה ריפו ודוח "חזוי מול נמדד". מעל אלה יש חמש ספינות דגל [inference]:
1. **‏rfcalc:** ספריית חישוב פתוחה (FQ1–FQ4), עם בדיקות מול דוגמאות מהספרים ומול מדידות.
2. **צומת חישה:** מכ"ם פסיבי, ניטור הפרעות GNSS וסקר ספקטרום (RD4, PN4, EW1, EW4). פוטנציאל: מוצר או שירות נתונים, אחרי בדיקת DECA.
3. **מאגרי SigMF פתוחים:** הקלטות בכבל (ML2) ונתוני מיקרו-דופלר (RD6).
4. **שלושה מאמרי מחקר בגל 1:** רחפן מול ציפור, מסווג עמיד ל-domain shift, וזיהוי זיוף במקלטים זולים. יעדים: IEEE RadarConf, ‏ION GNSS+.
5. **לוח מחוונים חי של הפרעות GNSS** במזרח הים התיכון (PN4), שמשמש גם ל-OSINT (OS4).

## 12. סיכונים והגנות

| סיכון | איך זה נראה | הגנה |
|---|---|---|
| שחיקת מיומנות | הלומד מקבל מספרים בלי לדעת להעריך אותם | חיזוי ידני בצעד 2, הסבר חוזר בסוף כל מעבדה, ציון Brier ביומן החיזויים |
| ביטחון שווא | גרף יפה, יחידות שגויות | מקרה ידוע לפני נתון אמיתי, תקציב שגיאה, אימות בשתי דרכים |
| שגיאות AI שלא נתפסות | באג שקט בעיבוד | יומן שגיאות AI, תרגיל seeded bugs (JU3), בדיקות pytest מול דוגמאות הספר |
| נתון סינתטי שמטעה | RadioML מול העולם | הקלטות עצמיות, בדיקות OOD (ML2, EW6) |
| חומרה שמתעכבת | מלאי משתנה (DCA1000, IWR6843) | שכבת מינימום שעובדת לבד, ומעבדות נתונים בינתיים [evidence: מלאי חסר אצל מפיצים] |
| חוק | שידור מחוץ לכבל | בדיקת דליפה EW2 כתנאי, רישיון חובב, בדיקת DECA |

## מקורות

ציוד ומחירים:
- ADALM-Pluto, DigiKey: https://www.digikey.com/en/products/detail/analog-devices-inc/ADALM-PLUTO/6624230 ; השקה ב-149 דולר: https://www.rtl-sdr.com/adalm-pluto-new-149-tx-capable-sdr-325-3800-mhz-range-12-bit-adc-20-mhz-bandwidth/
- KrakenSDR: https://www.krakenrf.com/product-page/krakensdr ; https://crowdsupply.com/krakenrf/krakensdr
- CN0566 Phaser: https://www.analog.com/en/resources/reference-designs/circuits-from-the-lab/cn0566.html ; https://findchips.com/search/EVAL-CN0566-RPIZ
- HackRF Pro: https://www.sparkfun.com/hackrf-pro.html ; https://www.hackster.io/news/great-scott-gadgets-unveils-the-bigger-better-wider-range-hackrf-pro-software-defined-radio-c97bc78841b1
- bladeRF: https://nuand.com/shop
- USRP: https://www.ettus.com/product-categories/usrp-bus-series/ ; https://www.digikey.at/en/product-highlight/d/digilent/ettus-usrp-b210-2-x-2-70-mhz-to-6-ghz-sdr-cognitive-radio
- TI IWR6843ISK: https://www.arrow.com/en/products/iwr6843isk/texas-instruments ; DCA1000EVM: https://fat.lcsc.com/product-image/C3647167.html ; AWR1843BOOST: https://octopart.com/part/texas-instruments/AWR1843BOOST ; IWRL6432BOOST: https://www.digikey.es/en/products/detail/texas-instruments/IWRL6432BOOST/21296838
- Infineon BGT60TR13C: https://uk.farnell.com/infineon/demobgt60tr13ctobo1/demo-eval-board-radar-sensor-60ghz/dp/4035678
- tinySA: https://www.cnx-software.com/2025/12/15/tinysa-is-a-low-cost-handheld-spectrum-analyzer-with-built-in-signal-generator/ ; NanoVNA/LiteVNA: https://eleshop.eu/test-measure/vector-network-analysers/vna.html
- ZED-F9P: https://www.sparkfun.com/sparkfun-gps-rtk2-board-zed-f9p-qwiic-gps-15136.html ; https://www.ardusimple.com/
- Siglent SDS804X HD: https://shop-us.siglent.com/?p=2831 ; Rigol DHO804: https://www.atomic14.com/bench/scopes/rigol-dho804/
- Ramsey: https://www.saelig.com/RWTTE/ste3300.htm ; STE3000B משומש: https://www.ebay.de/itm/146416082221
- GPU: https://www.spheron.network/blog/runpod-h100-pricing-2026/ ; https://www.spheron.network/blog/lambda-cloud-h100-pricing-2026/
- שער: https://moneyexchangerate.org/currencyexchange/usd/ils/1250

נתונים:
- RadioML: https://www.deepsig.ai/datasets
- RadarScenes: https://arxiv.org/abs/2104.02493 ; https://zenodo.org/records/4559821
- CARRADA: https://arxiv.org/abs/2005.01456
- MSTAR: https://ieee-dataport.org/documents/mstar-dataset-10-classes
- DIAT-μSAT: https://ieee-dataport.org/documents/diat-msat-micro-doppler-signature-dataset-small-unmanned-aerial-vehicle-suav
- GSDC 2023: https://developer.android.com/guide/topics/sensors/gnss ; https://www.ion.org/gnss/googlecompetition.cfm
- GPSJam: https://gpsjam.org ; Flightradar24: https://www.flightradar24.com/data/gps-jamming ; Inside GNSS: https://insidegnss.com/?p=197872
- OpenSky: https://opensky-network.org

זיוף GNSS באזור:
- UT Austin: https://radionavlab.ae.utexas.edu/?p=4756
- Kreizis et al., ION ITM 2025: https://web.stanford.edu/group/scpnt/gpslab/pubs/papers/Kreizis_ION_ITM_2025_Real_World_Spoofing_Detection.pdf
- GPS World: https://www.gpsworld.com/electronic-warfare-takes-centerstage-with-gnss-spoofing-by-israel/
- IATA (דרך מקור משני): https://migflug.com/jetflights/gps-spoofing-up-193-pilots-are-flying-blind/

כלים:
- PySDR: https://pysdr.org
- GNU Radio: https://www.gnuradio.org
- inspectrum: https://github.com/miek/inspectrum
- SigMF: https://github.com/sigmf/SigMF
- blah2: https://github.com/30hours/blah2
- RTKLIB: https://github.com/tomojitakasu/RTKLIB
- GNSS-SDR: https://gnss-sdr.org
- gnss_lib_py: https://github.com/Stanford-NavLab/gnss_lib_py
- Sionna: https://developer.nvidia.com/sionna
- srsRAN: https://github.com/srsran
- ns-3: https://www.nsnam.org
- EMANE: https://github.com/adjacentlink/emane
- PX4: https://px4.io
- ArduPilot: https://ardupilot.org
- RocketPy: https://github.com/RocketPy-Team/RocketPy
- OpenVSP: https://openvsp.org
- XFOIL: https://web.mit.edu/drela/Public/web/xfoil/
- SU2: https://su2code.github.io
- CalculiX: http://www.calculix.de
- FEniCS: https://fenicsproject.org
- Orekit: https://www.orekit.org
- Basilisk: https://hanspeterschaub.info/basilisk
- openEMS: https://openems.de
- SatNOGS: https://satnogs.org
- Gymnasium: https://gymnasium.farama.org
- SimPy: https://simpy.readthedocs.io
- pandapower: https://www.pandapower.org
- pyadi-iio: https://github.com/analogdevicesinc/pyadi-iio
- OpenRadar: https://github.com/PreSenseRadar/OpenRadar
- RadarSimPy: https://github.com/radarsimx/radarsimpy
- Copernicus: https://dataspace.copernicus.eu
- SIPRI: https://www.sipri.org/databases
- Oryx: https://www.oryxspioenkop.com
- DoD SAR: https://www.esd.whs.mil/FOID/Reading-Room/Selected_Acquisition_Reports/
- DOT&E: https://www.dote.osd.mil/annual-reports/
- CASI: https://www.airuniversity.af.edu/CASI/

ישראל, חוק:
- רישיון חובב: https://www.gov.il/he/service/radio-amateurs-certificates ; https://www.gov.il/en/service/radio-amateurs-certificates
- IARC, מוסף Extra 2026: https://www.iarc.org/wp-content/uploads/2026/01/Rosenne_Extra_Class_Supplement_2026.pdf
- צמצום פסי מיקרוגל: https://www.icqpodcast.com/news/2021/2/1/microwave-access-decreases-for-israels-radio-hams
- אותות קריאה: https://en.wikipedia.org/wiki/Call_signs_in_the_Middle_East
- פטור מרישוי (טלגרף אלחוטי): https://www.tuv.com/regulations-and-standards/en/israel-wireless-telegraphy-regulations-exemption-from-licensing-amendment-5784-2024.html
- חוק הפיקוח על יצוא ביטחוני: https://exportctrl.mod.gov.il/Documents/חוק%20הפיקוח%20+%20צווים%20+%20תקנות/Defense_Export_Contro_Law.pdf
- הצעת חוק דו-שימושי 2026: https://www.shibolet.com/en/client-alert-israels-proposed-new-dual-use-export-control-law-a-paradigm-shift-for-exporters/
- רחפנים: https://www.shibolet.com/en/new-civilian-drone-regulations-israel-moves-one-step-closer-to-its-own-version-of-part-107/ ; https://www.thedronegirl.com/2023/12/01/utm-connection-law-israel/

מה שלא נבדק בחיפוש ומסומן [estimate] או [inference]:
- מחירי Crazyflie, ‏X500, ‏rover, מצלמה תרמית, הידרופון ו-LimeSDR.
- הסדרת טילי דגם בישראל.
- הדרגות והפסים המדויקים ברישיון חובב.
- תקנות הפטור לגבי 60/77 GHz.

את הנקודות האלה בודקים לפני הרכש.
