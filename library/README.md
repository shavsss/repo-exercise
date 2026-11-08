# הספרייה

| תיקייה | מה יש בה |
|---|---|
| `math-physics/` | הספרים של מעבדת הלמידה: מתמטיקה (כרכים 1–3) ופיינמן (כרכים I–III) |
| `military/books/` | ספרי הליבה הצבאית, ממוספרים לפי סדר הלימוד |
| `military/books/reference/` | ספרי עזר שאינם חלק מתוכנית הלימודים |
| `military/articles/` | המאמרים שמשלימים את הספרים. מפתח ב-[`military/articles/README.md`](military/articles/README.md) |
| `military/doctrine/` | דוקטרינה שהספרים לא מכסים. מפתח ב-[`military/doctrine/README.md`](military/doctrine/README.md) |
| `engineering/books/` | ספרי אפליקציית ההנדסה (בתכנון), ממוספרים E01–E25. מפתח ומי מביא כל ספר ב-[`engineering/README.md`](engineering/README.md) |
| `military/syllabus/` | תוכנית הלימודים: `syllabus.py` הוא המקור, `build.py` בודק כיסוי ומייצר את `SYLLABUS.md` ו-`syllabus.json` |

## ספרי הליבה הצבאית

| # | ספר | מחברים | מהדורה | קובץ |
|---|---|---|---|---|
| 01 | EW 101: A First Course in Electronic Warfare | David Adamy | Artech House, 2001 | PDF |
| 02 | Principles of Modern Radar: Basic Principles | Richards, Scheer, Holm | SciTech, 2010 (מהדורה 1) | PDF |
| 02a | Principles of Modern Radar, Vol. II: Advanced Techniques | Melvin, Scheer | SciTech, 2013 | PDF |
| 02b | Principles of Modern Radar, Vol. III: Radar Applications | Melvin, Scheer | SciTech, 2014 | PDF |
| 03 | Introduction to Infrared and Electro-Optical Systems | Driggers, Friedman, Nichols | Artech House, 2012 (מהדורה 2) | PDF |
| 04 | EW 102: A Second Course in Electronic Warfare | David Adamy | Artech House, 2004 | PDF |
| 05 | Understanding GPS: Principles and Applications | Kaplan, Hegarty | Artech House, 2006 (מהדורה 2) | PDF |
| 06 | Missile Guidance and Control Systems | George M. Siouris | Springer, 2004 | PDF |
| 07 | Air and Missile Defense Systems Engineering | Boord, Hoffman | CRC Press, 2016 | PDF |
| 08 | Military Avionics Systems | Moir, Seabridge | Wiley, 2006 | PDF |
| 09 | Introduction to UAV Systems | Fahlstrom, Gleason, Sadraey | Wiley, 2022 (מהדורה 5) | PDF |
| 10 | Principles of Naval Weapons Systems | CDR Joseph Hall (עורך), USNA | — | PDF |
| 11 | Tanks: 100 Years of Evolution | Richard M. Ogorkiewicz | Osprey, 2015 | PDF |
| 12 | Space Mission Engineering: The New SMAD | Wertz, Everett, Puschell (עורכים) | Microcosm, 2011 | תיקייה `12_SMAD/` עם 11 חלקי PDF מצולמים, בלי שכבת טקסט. בסריקה חסר פרק 18 (הנעה), ובמקומו פרק 17 מופיע פעמיים |
| 13 | Tactical Missile Design | Eugene L. Fleeman | AIAA, 2001 (מהדורה 1) | PDF סרוק, נקרא ב-OCR (B13). בספריית לנצ'סטר; עמוד PDF = עמוד מודפס + 19 |
| 14 | Combat Modeling | Alan Washburn, Moshe Kress | Springer, 2009 | PDF. מקור עזר לניתוח (לא נלמד כמודול) |
| 15 | Mathematical Methods in Defense Analyses | J. S. Przemieniecki | AIAA, 2000 (מהדורה 3) | PDF. מקור עזר לניתוח |
| 16 | The Fundamentals of Aircraft Combat Survivability Analysis and Design | Robert E. Ball | AIAA, 2003 (מהדורה 2) | PDF. מקור עזר לניתוח: שרידות, חשיפה ופגיעות |
| 17 | Supplying War: Logistics from Wallenstein to Patton | Martin van Creveld | Cambridge, 1977 | PDF. מקור עזר לניתוח: לוגיסטיקה |
| 18 | Microwave Engineering | David M. Pozar | Wiley, 2012 (מהדורה 4) | PDF. שרשרת ה-RF: M1.5–M1.7. גילואה מפנה לאותו קובץ. עמוד PDF = עמוד מודפס + 20 |
| 19 | Electromagnetic Waves and Antennas | Sophocles J. Orfanidis | Rutgers, 2004 | PDF, שני עמודי ספר בכל עמוד PDF (טווחי העמודים בתוכנית הם עמודי PDF, ונספרים פי 2). במקום Balanis: אנטנות ומערכים ב-M1.1, M1.2. חסר פרק 12 (פרמטרי S) וכמה עמודים בתחילת פרק 8; מספרי העמודים המודפסים לא עקביים בין פרקים. גילואה מפנה לאותו קובץ |
| 20 | Tactical and Strategic Missile Guidance | Paul Zarchan | AIAA, 2012 (מהדורה 6) | PDF, שני חלקים שאוחדו (הרצף בעמ' 500–501 נבדק). בלי העמודים הריקים, ולכן ההפרש בין עמוד PDF לעמוד מודפס משתנה. האינדקס חלקי (נגמר באות B) |
| 21 | Operational Logistics: The Art and Science of Sustaining Military Operations | Moshe Kress | Kluwer, 2002 (מהדורה 1) | PDF. הפרקים הכמותיים ב-M14.3, השאר בעיון ב-M14.6 |
| 22 | Statistical Methods for Signal Processing (EECS 564) | Alfred O. Hero | University of Michigan, 2016 (רשימות קורס) | PDF. במקום Kay: חסם קרמר-ראו ב-M2.40. עמוד PDF = עמוד מודפס |
| 23 | GNSS Data Processing, Vol. I: Fundamentals and Algorithms | Sanz Subirana, Juan Zornoza, Hernández-Pajares | ESA TM-23, 2013 | PDF. במקום Groves (צד ה-GNSS): מסגרות והמרות ב-M5.8, השאר בעיון ב-M5.12 |
| 24 | GNSS Data Processing, Vol. II: Laboratory Exercises | Sanz Subirana, Juan Zornoza, Hernández-Pajares | ESA TM-23, 2013 | PDF. תרגילי gLAB עם נתוני IGS, בעיון ב-M5.12 |

ספרים חדשים (6.11): 18–24 הגיעו בסבב 7. הספרים שלא יגיעו, ומה מכסה במקומם, ברשימה "מקורות חסרים" בסוף `military/syllabus/SYLLABUS.md` (המקור: `MISSING` ב-`syllabus.py`). Särkkä נשאר ב-`incoming/` לגילואה.

ספרים 14–17 הם מקורות עזר לניתוח (`role: "ref"` ב-`syllabus.py`): הם לא מתחלקים לשיעורים ולא נכנסים לבדיקת הכיסוי, והמורה משתמש בהם במודולים שמקושרים אליהם כדי לקחת את התוצאה הטכנית לתוצאה מבצעית (כללים 33–37 ב-`docs/CORE_TEACHING_RULES.md`). מאז תוכנית הלימודים לפי נושאים חלק מהעמודים שלהם נלמדים גם כחומר שיעור (למשל Washburn & Kress 2, 6, 7 ב-M14.7, Przemieniecki 3.11–3.16 ב-M11.4). EW 103 הוצא מהתוכנית. ספרים 01–11 שלמים, עם שכבת טקסט ואיורים. את 12 קוראים דרך OCR (`core/tools/extract/extract.py`).
