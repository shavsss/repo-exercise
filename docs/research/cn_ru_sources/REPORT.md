# מקורות ברוסית ובסינית: מה חסר במערב ומה כדאי להוסיף (24.11.2026)

**השאלה.** אילו תחומים, אסכולות וספרים ברוסית (כולל סובייטית) או בסינית לא תורגמו, או תורגמו רק בחלקם, וגם חזקים שם במיוחד או חלשים במערב? ואילו מהם רלוונטיים לגילואה (eng) וללנצ'סטר (core)?

**היקף.** לפי התיקון של הלומד נבדקו רק תחומים שבהם לרוסיה או לסין יש חוזק ידוע, ותחומים שקיימים רק אצלן. לא נסרק כל תחום בסילבוס. נעשו כ-55 חיפושים ושליפות: חיפוש ברשת, DTIC, CASI ו-Springer. מול הסילבוס נבדק ב-`grep` בקבצים `docs/research/round3/final/F_curriculum.md`, `tools/curriculum/round8_items.json` ו-`round8_sources.json`. הבדיקה נעשתה על ידי סוכן מחקר אחד, והטקסט הועבר מהטיוטה שלו.

**הממצא המרכזי.** רוב הקלאסיקה הסובייטית תורגמה. התרגומים נעשו בהוצאות Mir ו-Pergamon, וגם במשרדי התרגום של צבא ארה"ב, FTD ו-FSTC (תרגומי מכונה ערוכים שנמצאים ב-DTIC). מעט מאוד "אוצרות" לא תורגמו וגם אין להם תחליף מערבי. הערך הייחודי מתרכז בשלוש נקודות:
1. **איך הצד השני חושב ומחשב:** יחסי כוחות, פוטנציאלים קרביים, קיברנטיקה צבאית ושליטה רפלקסיבית. זה החומר של M12.1, M12.3 ו-M14.1.
2. **תכן מערכות הגנה אווירית ותורת הירי של טילי קרקע-אוויר, מנקודת המבט של המגן.** בספרות המערבית הפתוחה זה כמעט לא קיים.
3. **גופי ידע סיניים שתורגמו לאחרונה ועדיין אינם בסילבוס:** מכ"ם בגל מטרי נגד חמקנות, לוחמה אלקטרונית סינית, והבלוג של Su Jianlin על AI.

---

## 1. טבלת הכרעה

| נושא | יצירות | שפה | מתורגם? | תחליף מערבי? | ערך ייחודי | תחום בסילבוס, ומה כבר מכוסה | המלצה | ביטחון |
|---|---|---|---|---|---|---|---|---|
| יחסי כוחות ואמצעים (COFM), פוטנציאלים קרביים, קוואלימטריה | המתודולוגיה של המטה הכללי, כפי שהיא מוצגת ב-Военная мысль. סינתזה באנגלית: RAND RR-4235 (Reach, Kilambi, Cozad 2020) | רוסית; סינתזה באנגלית | המקורות לא. RAND כן | QJM/TNDM של Dupuy (ב-M14.1 ברמה S) | השיטה הרוסית לחישוב יחסי כוחות: מקדמי פוטנציאל קרבי, שיטות קוואלימטריות ונורמות יחס לכל סוג פעולה. זו העדשה שדרכה מטה רוסי שופט את נאט"ו, ואין לה תחליף מערבי | M14.1, M12.1. **לא מכוסה**: אין בסילבוס "correlation of forces", יש רק 3:1 ו-QJM | **להוסיף תת-נושא** ב-M14.1 (S): "COFM ופוטנציאלים קרביים: השיטה הרוסית מול QJM". מקור: RAND RR-4235 | גבוה |
| קיברנטיקה צבאית ומודלים של פעולות קרב (מצב 2025) | Новиков Д.А. (ред.), «Модели военных, боевых и специальных действий», ИПУ РАН/URSS 2025, 528 עמ' (PDF חופשי באתר ИПУ). Шумов, Корепанов, "Mathematical models of combat and military operations", КИМ 2020 | רוסית (למאמר מ-2020 יש תקציר באנגלית) | לא | Washburn ו-Kress; Przemieniecki (B15) | מודלים רוסיים עדכניים: לנצ'סטר סטוכסטי, מודלים "מעורבים", הגבולות שלהם והשמירה עליהם, בניסוח של הקיברנטיקה. נותן תמונה של מה שהאסכולה הרוסית מלמדת היום | M14.1. לנצ'סטר וסלבו מכוסים | **להוסיף מקור** (supp/ref) ל-M14.1 ולשיעור על COFM, בפרקים נבחרים בלבד ולא את כל הספר | בינוני-גבוה |
| חקר ביצועים צבאי סובייטי (קלאסי) | Вентцель, «Исследование операций» (1972); Чуев и др., «Основы исследования операций в военной технике» (1965) | רוסית | **כן**: Ventsel ב-Mir ‏1983 ובתרגום FTD ‏1978 (ADA066460/1). Chuev ב-FTD-HT-23-51-68 (‏AD0683365), כולל פרק על הערכת היעילות של הגנה אווירית | Morse ו-Kimball; Washburn | שיטת "יעילות הנשק" (эффективность) המלאה של האסכולה, כולל הסתברויות פגיעה בהגנה אווירית | M14.1, M7.1 | **להוסיף מקור ref** (Chuev, בעיקר הפרק על הערכת היעילות של הגנה אווירית). לא תת-נושא חדש | גבוה |
| שליטה רפלקסיבית (рефлексивное управление) ומסקירובקה | Лефевр (1965, 1984); Чаусов; Леоненко; מאמרים ב-Военная мысль. באנגלית: T. Thomas, JSMS ‏2004, ו-Army ‏2019 | רוסית, עם ניתוחים באנגלית | המקורות בחלקם (Lefebvre כתב גם באנגלית). Thomas מקובל כתחליף | אין דיסציפלינה מערבית מקבילה. הקרוב ביותר הוא military deception | **קיים רק שם**: תורה שעוסקת בעיצוב ההחלטה של היריב, ומחוברת ללוחמה אלקטרונית ולהטעיה | M12.1. ב-M8.x יש counter-ISR והטעיה, אבל לא את התורה הרוסית | **להוסיף תת-נושא קצר (C/K)** ב-M12.1: "שליטה רפלקסיבית ומסקירובקה כמסגרת ללוחמה אלקטרונית ולהטעיה". מקור: Thomas 2019 | בינוני-גבוה |
| תכן טילי קרקע-אוויר ותורת הירי (зона поражения, координатный закон поражения) | Голубев, Светлов (ред.), «Проектирование зенитных управляемых ракет», МАИ 2001, 732 עמ'; Василин, «Зенитные ракетные комплексы», 2001. מתורגמים: Zimin (ред.), *Air Defense Officer's Handbook* (JPRS L/10540, 1982); FSTC-HT-23-217-70 | רוסית | Golubev ו-Svetlov **לא**. Zimin ו-FSTC כן | Fleeman (טילים טקטיים באופן כללי, B13); Zarchan. **אין** בספרות המערבית הפתוחה ספר על תכן מערכת קרקע-אוויר ועל אזור ההשמדה שלה כמערכת | הדרך הסובייטית לגזור את אזור ההשמדה מביצועי הטיל, מהמכ"ם ומדינמיקת ההנחיה, והחוק הקואורדינטי של ההשמדה. מתאים בדיוק למהנדס שמוביל: מגדירים את המעטפת וחוזים את Pk | M7.x (הגנה מפני טילים), M6.12, M12.1. "engagement zone" לא מופיע בסילבוס, ו-"engagement envelope" מופיע פעם אחת | **להוסיף תת-נושא** (K) ב-M7.x או ב-M12.1: "אזור ההשמדה של טיל קרקע-אוויר: גזירה מהביצועים (הגבול הקרוב והרחוק, הפרמטר והגובה) וחוק ההשמדה הקואורדינטי". מקורות: Zimin (מתורגם) ופרקים מ-Golubev ו-Svetlov בתרגום AI | בינוני (את התוכן של Golubev ראה הסוכן רק דרך הפניות) |
| תורת הלוחמה האלקטרונית הרוסית (радиоэлектронное подавление) | Палий; Куприянов, Сахаров, «Теоретические основы РЭБ»; Вакин, Шустов | רוסית | **כן, בחלקו ובצורה טובה**: Vakin, Shustov ו-Dunwell, *Fundamentals of Electronic Warfare*, Artech 2001 (מחברים מאקדמיית ז'וקובסקי). Палий תורגם ב-FSTC ‏1968 | Schleher, Adamy, Neri | מקדם הדיכוי, וקריטריונים ליעילות של שיבוש ושל פיתיונות מנקודת המבט הסובייטית. Vakin מכסה את זה באנגלית | M12.1 ולוחמה אלקטרונית. שמות הספרים האלה לא מופיעים במקורות | **להוסיף מקור** (Vakin ושותפיו) ל-M12.1 ולמודול הלוחמה האלקטרונית. את Куприянов לא צריך | גבוה |
| לוחמה אלקטרונית ומכ"ם בסין (DRFM, שיבוש פעיל, רשת לוחמה אלקטרונית) | *Techniques and System Design of Radar Active Jamming* (NDIP/Springer 2023); *Theory to Countermeasures Against New Radars* (BIT Press/Springer 2022); *Network Radar Countermeasure Systems* (Springer 2016) | סינית | **כן**, בהוצאה משותפת עם Springer | Neri, Schleher; על DRFM ראו Pace | מבט סיני עדכני על שיבוש של SAR, של מכ"ם LPI ושל MIMO. זה גם מודיעין על מה שהיריב חושב | לוחמה אלקטרונית, M12.3. DRFM מופיע פעם אחת | **להוסיף מקור ref** ללוחמה אלקטרונית ול-M12.3, בפרקים נבחרים | בינוני-גבוה |
| מכ"ם בגל מטרי נגד חמקנות | 吴剑旗 (Wu Jianqi) ושותפיו, *Advanced Metric Wave Radar*, Springer 2019 (תרגום מ-NDIP) | סינית | **כן** | חלש במערב: המערב זנח את ה-VHF, ויש רק מאמרים בודדים | בעיית מדידת הגובה בזוויות נמוכות, ריבוי נתיבים ופיצול אונות, והפתרונות הסיניים ל-VHF כמכ"ם נגד חמקנות | נגד חמקנות **מכוסה** כתת-נושא (F_curriculum שורות 597-598: "low-band, Nebo, Chinese/Russian claims"), בלי מקור | **להוסיף מקור** לתת-הנושא הקיים | גבוה |
| מלחמת מערכות ו"השמדת מערכות" של צבא השחרור (体系破击战) | ספרי צבא השחרור: 战役学, 战略学 (2013, 2020), 联合战役信息作战. מחקר: Engstrom, RAND RR-1708 (2018) | סינית | **כן**: סדרת "In Their Own Words" של CASI (תרגום בסיוע מכונה): SMS 2013, SMS 2020, Science of Campaigns, Science of Second Artillery Campaigns, Lectures on Joint Campaign Information Operations, Cognitive Domain Operations | — | הטקסטים המקוריים, ולא פרשנות עליהם | M12.3. תת-הנושא ("system destruction warfare") **מכוסה**, אבל Engstrom ו-CASI **אינם** במקורות | **להוסיף מקורות** ל-M12.3: Engstrom RR-1708 כמקור עיקרי, ו-SMS 2020 ו-Science of Campaigns כ-supp | גבוה |
| "מלחמה מבוססת בינה" (智能化战争) | מאמרים ב-PLA Daily וב-中国军事科学 | סינית | בחלקו: CSET, CMSI (Erickson) ו-CSBA מתרגמים מאמרים. אין תרגום של ספר | — | הכוונות הסיניות לגבי AI צבאי | M12.3 | **לשבועון בלבד** | בינוני |
| מנועי רקטה בדלק נוזלי, כולל בעירה מדורגת עשירת חמצן (ORSC) | Добровольский, «ЖРД. Основы проектирования» (1968/2005); Алемасов и др., «Теория ракетных двигателей»; Квасников; Володин | רוסית | **כן**: Dobrovolsky ב-FTD-MT-24-155-69 (‏AD0695929); Alemasov ב-FTD (‏AD0713034, 752 עמ'); Volodin ו-Kvasnikov ב-FTD | Sutton; Huzel ו-Huang | הידע המעשי של ORSC (מבערים מקדימים עשירי חמצן, ציפויים) לא נמצא בספרי לימוד בשום שפה. בספרים הרוסיים יש את העיקרון ולא את ה-know-how | M13.12 (הנעה רקטית), שבו אין תת-נושא על מחזורי מנוע. בגילואה: הנעה | **לדלג** כספר. אם יתווסף תת-נושא על מחזורי מנוע (gas generator, staged, expander), Sutton מספיק, ו-Dobrovolsky ב-FTD כ-ref אופציונלי | גבוה |
| פיזיקת הפיצוץ ובליסטיקה סופית | Орленко (ред.), «Физика взрыва», מהדורה 3, 2 כרכים (2002/2004); המקור: Баум, Станюкович, Шехтер, 1959 | רוסית | **בחלקו**: רק פרק 12 של מהדורת 1959 (FRL-TN-94, ‏1961); Яковлев ב-FTD | Zukas; Walters ו-Zukas (מטענים חלולים); Cooper; Meyers | ספר עיון אחד שמקיף פיצוץ, מטען חלול, EFP, רסיסים וחדירה. מקיף, אבל לא ייחודי | M11.12 (סילון של מטען חלול ו-EFP) **מכוסה** | **לדלג** (לכל היותר ref אופציונלי) | בינוני |
| תורת הגילוי ותורת המכ"ם | Ширман (ред.), «Радиоэлектронные системы: основы построения и теория», 2007; Бакулев; Тихонов, Харисов, «Статистический анализ и синтез радиотехнических устройств» | רוסית | Ширман 2007 **לא**. אבל Shirman, *Computer Simulation of Aerial Target Radar Scattering, Recognition, Detection and Tracking* (Artech 2002) **כן**. Leonov ו-Fomichev, *Monopulse Radar* (Artech 1986, FTD 1971) **כן**. Dulevich, *Theoretical Fundamentals of Radar* (FTD 1967) **כן** | Richards (POMR); Skolnik; Van Trees | אין ייחוד מהותי. מה שייחודי אצל Shirman (זיהוי מטרות לפי פרופיל טווח) תורגם | מכ"ם | **לדלג** (אולי Shirman 2002 כ-ref לזיהוי מטרות אוטומטי) | גבוה |
| ספרי לימוד סיניים במכ"ם | 丁鹭飞, 《雷达原理》; 张明友, 《雷达系统》 | סינית | לא | Skolnik, Richards | מקבילים ל-Skolnik, בלי ייחוד | — | **לדלג** | גבוה |
| הבלוג של Su Jianlin על AI (科学空间, kexue.fm), ממציא RoPE | כ-670 רשומות: הסדרה Transformer 升级之路, דיפוזיה, אופטימייזרים (Muon, ירידה תלולה על יריעות, muP), MoE, msign ו-Newton-Schulz | סינית | **כן, לא רשמי**: תרגום מכונה (Gemini) של Rohin Garg, ‏rohin-garg.github.io/kexue-en | **אין מקבילה**: הסברים מתמטיים עמוקים לבחירות ההנדסיות ב-LLM, לפעמים לפני הספרות המערבית | גוף ידע ייחודי ברמה של "המהנדס שמבין למה": RoPE, הארכת חלון ההקשר ו-Muon | ML/AI בגילואה. "positional" מופיע ב-2 פריטים, ו-MoE מכוסה. Muon והארכת ההקשר **לא** מכוסים | **להוסיף מקור** (ref/supp) לשיעורי ה-Transformer והאופטימיזציה, ו**תת-נושא (S)**: "קידוד מיקום (RoPE) והארכת ההקשר", מסדרות נבחרות. גם לשבועון | בינוני-גבוה |
| רשתות במתח על-גבוה (UHV AC/DC) | Liu Zhenya, *Ultra-High Voltage AC/DC Grids*, Academic Press 2015 (758 עמ') | סינית | **כן** | חלש במערב: אין במערב רשת UHV בהיקף כזה | הפרקטיקה היחידה בעולם של UHV בקנה מידה גדול | M13.19 (מערכות הספק). HVDC מופיע פעם אחת | **להוסיף מקור ref** (פרקי HVDC ו-UHV) אם HVDC נלמד. לא תת-נושא חדש | גבוה |
| דינמיקה של רכבת מהירה (דינמיקה מצומדת של רכב ומסילה) | 翟婉明 (Zhai Wanming), *Vehicle–Track Coupled Dynamics*, Springer 2020 (מ-Science Press 2015) | סינית | **כן** | חלקי | תחום שסין מובילה בו | אין רכבות בסילבוס | **לדלג** (רלוונטיות נמוכה). לכל היותר דוגמה בתנודות | גבוה |
| מערכות הספק משולבות לספינות ושיגור אלקטרומגנטי (DC במתח בינוני) | 马伟明 (Ma Weiming): מאמרים ב-Proc. CSEE (סינית); IEEE TPS ‏2019 (אנגלית) | סינית | בחלקו: סקירה באנגלית ב-IEEE TPS, והגוף העיקרי בסינית. אין ספר | MVDC של הצי האמריקאי (ESRDC) | סין מובילה ב-MVDC IPS וב-EMALS (פוג'יאן) | M30.4 ("Integrated electric propulsion and power") **מכוסה** | **לשבועון**, ו-Ma ושותפיו 2019 כ-ref | בינוני |
| "האינטגרציה המטא-סינתטית" של Qian Xuesen (综合集成) והנדסת "体系" | 钱学森, 《论系统工程》; Qian, Yu, Dai 1990; CASI, *Complex Systems Engineering* (2024) | סינית | בחלקו (מאמרים ו-CASI) | הנדסת מערכת של מערכות (Maier); mission engineering | **קיים רק שם**, וזה הבסיס הרעיוני ל-体系作战 | M13.2 (מערכת של מערכות **מכוסה**), M12.3 | **לשבועון בלבד** (או משפט ב-M12.3) | בינוני |
| TRIZ (Альтшуллер) | «Алгоритм изобретения», «Найти идею» | רוסית | **כן**: *Creativity as an Exact Science* (1984); *The Innovation Algorithm* (1999) | אין מקבילה ישירה | **קיים רק שם**: שיטה לפתרון סתירות הנדסיות | הנדסת מערכות ותכן. **לא בסילבוס** | **לשקול תת-נושא (C)** בהנדסת מערכות או בתכן מכני ("סתירות טכניות ו-40 העקרונות"). ערך בינוני לרמה 3, ומעמד אקדמי שנוי במחלוקת | בינוני |
| קוואלימטריה (Азгальдов) | «Квалиметрия» | רוסית | בחלקו (*The ABC of Qualimetry*, 2016) | MCDA, MAUT | **קיים רק שם**, ומשמש בחישובי הפוטנציאל הקרבי | M14.1, M14.2 | **לא כתת-נושא נפרד**. להזכיר בתוך תת-הנושא על COFM | בינוני |
| אקרנופלנים (WIG) | Белавин, «Экранопланы»; Rozhdestvensky | רוסית | בחלקו: Rozhdestvensky כתב באנגלית (Springer 2000) | מעט | **כמעט רק שם** | ימי ואווירונאוטיקה. לא בסילבוס | **לדלג** (נישה) | בינוני |
| קוויטציית-על (Шквал) | Логвинович, 1969 | רוסית | **כן**: NASA-TT-F-658 (1972) | — | — | supercavitation מופיע ב-2 פריטים | **לדלג** | גבוה |
| עקיפה (PTD) | Уфимцев, 1962 | רוסית | **כן**: Wiley-IEEE ‏2007/2014 | — | — | RCS | **לדלג** | גבוה |
| דינמיקת טיסה וטילים מונחים | Лебедев, Чернобровкин, 1973; Лебедев, Герасюта (בליסטיקה, FTD 1972) | רוסית | בחלקו (Gerasyuta ב-FTD) | Zarchan, Siouris, Fleeman | בלי ייחוד | M6.x | **לדלג** | בינוני |
| דוקטרינה צבאית סובייטית | הסדרה "Soviet Military Thought" של חיל האוויר האמריקאי (Savkin; Druzhinin ו-Kontorov, *Concept, Algorithm, Decision*; Chuev, *Forecasting*; Officer's Handbook) | רוסית | **כן** (כ-20 כרכים) | — | — | M12.1 | **ref אופציונלי**: Druzhinin ו-Kontorov (קבלת החלטות ואוטומציה) | גבוה |

---

## 2. מה באמת כדאי להוסיף, לפי הסדר

1. **תת-נושא חדש ב-M14.1 (S): "יחסי כוחות ואמצעים (COFM) ופוטנציאלים קרביים: השיטה הרוסית".** איך מחשבים מקדמי פוטנציאל, מהן נורמות היחס לכל סוג פעולה, ההשוואה ל-QJM, והטעויות. מקור עיקרי: RAND RR-4235 (באנגלית). Supp: פרקים מ-Новиков 2025 (ИПУ РАН, PDF חופשי). זה הפער הכי חד: הסילבוס מלמד את לנצ'סטר ואת כלל ה-3:1, אבל לא את הכלי שבו מטכ"ל רוסי משתמש בפועל.
2. **תת-נושא חדש (K) בהגנה מפני טילים או ב-M12.1: "אזור ההשמדה של טיל קרקע-אוויר וחוק ההשמדה הקואורדינטי".** האסכולה הסובייטית שגוזרת את גבולות האזור מביצועי הטיל והמכ"ם. מקורות: Zimin, *Air Defense Officer's Handbook* (JPRS, מתורגם); Chuev 1965 (FTD, הפרק על הערכת היעילות של הגנה אווירית); ופרקים נבחרים מ-Голубев ו-Светлов 2001 בתרגום AI. בספרות המערבית הפתוחה אין כמעט כלום בנושא.
3. **מקורות ל-M12.3 (הנושא קיים, בלי מקור):** Engstrom RR-1708, ו-SMS 2020, Science of Campaigns ו-Science of Second Artillery Campaigns בתרגום CASI.
4. **מקור לתת-הנושא הקיים על נגד חמקנות ומכ"ם בתדר נמוך:** Wu Jianqi, *Advanced Metric Wave Radar* (Springer 2019).
5. **מקורות ללוחמה אלקטרונית ול-M12.1:** Vakin, Shustov ו-Dunwell, *Fundamentals of Electronic Warfare* (תורת הלוחמה האלקטרונית הרוסית באנגלית). מהצד הסיני: *Techniques and System Design of Radar Active Jamming* (2023) ו-*Theory to Countermeasures Against New Radars* (2022).
6. **הבלוג של Su Jianlin (kexue.fm) כמקור ל-ML/AI בגילואה, ותת-נושא (S): "קידוד מיקום (RoPE) והארכת ההקשר".** במקביל, לשבועון: פוסטים על Muon ועל muP.
7. **תת-נושא קצר (C/K) ב-M12.1: שליטה רפלקסיבית ומסקירובקה** (Thomas 2019).
8. **רשות:** Liu Zhenya על UHV כ-ref ל-M13.19, ו-TRIZ כתת-נושא (C) בהנדסת מערכות.

## 3. מה נבדק ונמצא מתורגם או מיותר

- **מתורגם במלואו או בחלקו:**
  - חקר ביצועים: Вентцель (Mir 1983, FTD 1978); Чуев 1965 (FTD-HT-23-51-68) ו-*Prognozirovanie* (USAF).
  - מנועי רקטה: Добровольский, Алемасов, Володин, Квасников (FTD).
  - מכ"ם ולוחמה אלקטרונית: Леонов ו-Фомичев (Artech, FTD); Ширман 2002 (Artech); Дулевич (FTD 1967); Палий (FSTC 1968); Вакин ו-Шустов (Artech 2001).
  - פיזיקה ודינמיקה של זורמים: Уфимцев (Wiley); Логвинович (NASA TT).
  - Altshuller (Gordon & Breach, TIC); Liu Zhenya (Academic Press); Zhai Wanming (Springer).
  - דוקטרינה: ספרי צבא השחרור (CASI); הסדרה Soviet Military Thought.
- **לא מתורגם, אבל יש תחליף מערבי שקול:**
  - Ширман 2007, Бакулев, Тихонов ו-Харисов: Van Trees ו-Bar-Shalom מספיקים.
  - 丁鹭飞 ו-张明友: Skolnik ו-Richards.
  - Лебедев ו-Чернобровкин: Zarchan.
  - Орленко, «Физика взрыва»: Zukas, ו-Walters עם Zukas.
  - Сивухин, «Общий курс физики»: לא תורגם, אבל Feynman וסדרת ברקלי מקבילים לו.
- **לא אומת:**
  - Ткаченко (מודלים של קרב): הספר לא נמצא, ו-Новиков 2025 מכסה את התחום עדכני יותר.
  - ספר נוסף של Куприянов ו-Сахаров לא נמצא, ו-Vakin מחליף אותו.
  - תרגום FTD לספר של Бюшгенс (צאג"י) על יציבות של מטוסים על-קוליים לא נמצא, אבל יש תחליפים מערביים (Etkin; Stevens ו-Lewis).
- **היפרסוניקה (צאג"י, JF-12):** הספרות המערבית חזקה (Anderson, Bertin), וספר ה-JF-12 של Jiang Zonglin יצא ב-Cambridge UP ב-2023. אין פער.
- **סוללות סיניות:** הידע הייחודי (ייצור, LFP, נתרן-יון) נמצא בפטנטים ובמאמרים באנגלית, לא בספר סיני. **לשבועון בלבד.**
- **המתמטיקה של אסכולות קולמוגורוב, פונטריאגין, גלפנד וקרסובסקי (משחקים דיפרנציאליים):** תורגמה כמעט כולה (Springer, Pergamon, AMS). לא נמצא פער רלוונטי.

## 4. מקורות

- RAND RR-4235, *Russian Assessments and Applications of the Correlation of Forces and Means*: https://www.rand.org/pubs/research_reports/RR4235.html
- Новиков (ред.), *Модели военных, боевых и специальных действий*, 2025: https://www.ipu.ru/sites/default/files/publications/79723/80166-79723.pdf
- Shumov, Korepanov, 2020: https://crm-en.ics.org.ru/journal/article/2895/
- Ventsel, FTD 1978: https://apps.dtic.mil/sti/pdfs/ADA066460.pdf ; Mir 1983: https://archive.org/details/WentzelOperationsResearchMir1983
- Chuev et al., FTD-HT-23-51-68: https://apps.dtic.mil/sti/pdfs/AD0683365.pdf
- Zimin, *Air Defense Officer's Handbook* (JPRS): https://www.cia.gov/readingroom/node/1860084
- Golubev ו-Svetlov 2001 (הפניה): https://dx.doi.org/10.15587/1729-4061.2021.225594
- Vasilin, *Зенитные ракетные комплексы*: https://epizodyspace.ru/bibl/vasilin/zenitnye/vasilin-zenitnye-2001.pdf
- Thomas, *Russia's Reflexive Control Theory* (2019): https://apps.dtic.mil/sti/trecms/pdf/AD1157096.pdf
- Vakin, Shustov, Dunwell: https://us.artechhouse.com/Fundamentals-of-Electronic-Warfare-P770.aspx
- Palii (FSTC): https://apps.dtic.mil/sti/pdfs/ADA083358.pdf
- McDermott, ICDS 2017: https://icds.ee/en/russias-electronic-warfare-capabilities-to-2025-challenging-nato-in-the-electromagnetic-spectrum/
- *Radar Active Jamming* (NDIP/Springer 2023): https://link.springer.com/10.1007/978-981-19-9944-4
- *Theory to Countermeasures Against New Radars*: https://link.springer.com/10.1007/978-981-16-6715-2
- *Network Radar Countermeasure Systems*: https://link.springer.com/10.1007/978-3-662-48471-5
- *Advanced Metric Wave Radar*: https://rd.springer.com/content/pdf/10.1007%2F978-981-10-7647-3_1.pdf
- Engstrom, RR-1708: https://capstone.ndu.edu/Portals/83/Systems%20Destruction%20Warfare%20RAND.pdf
- CASI, SMS 2020: https://www.airuniversity.af.edu/Portals/10/CASI/documents/Translations/2022-01-26%202020%20Science%20of%20Military%20Strategy.pdf
- CASI, *Science of Campaigns*: https://www.airuniversity.af.edu/CASI/Display/Article/2421219/in-their-ownwords-plas-science-of-campaigns/
- CASI, *Science of Second Artillery Campaigns*: https://www.airuniversity.af.edu/CASI/Articles/Article-Display/Article/4411340/itow-science-of-second-artillery-campaigns/
- CASI, *Complex Systems Engineering*: https://airuniversity.af.edu/Portals/10/CASI/documents/Research/Infrastructure/2024-02-20%20Complex%20Systems%20Engineering.pdf
- CSET, *China's Military AI Roadblocks*: https://cset.georgetown.edu/wp-content/uploads/CSET-Chinas-Military-AI-Roadblocks-1.pdf
- Dobrovolsky, FTD: https://apps.dtic.mil/sti/trecms/pdf/AD0695929.pdf ; Alemasov, FTD: https://apps.dtic.mil/sti/pdfs/AD0713034.pdf
- Baum et al., תרגום פרק 12: https://firedoc.nist.gov/article/ZXcxXYQBWEcjUZEY9jHz
- Shirman, Artech 2002: https://www.schweitzer-online.de/en/buch/Shirman/Computer-Simulation-Aerial-Target-Radar-Scattering-Recognition-Detection-Tracking/9781580531726/A15418210/
- Leonov ו-Fomichev, FTD: https://apps.dtic.mil/sti/html/tr/AD0742696/index.html ; Dulevich, FTD: https://apps.dtic.mil/sti/html/tr/AD0673149/index.html
- Ufimtsev (Wiley 2014): https://www.oreilly.com/library/view/fundamentals-of-the/9781118753668/
- Logvinovich (NASA TT): https://apps.dtic.mil/sti/tr/pdf/ADP012080.pdf
- kexue.fm, המראה באנגלית: https://rohin-garg.github.io/kexue-en/index.html
- Liu Zhenya, UHV: https://shop.elsevier.com/books/ultra-high-voltage-ac-dc-grids/liu/978-0-12-802161-3
- Zhai Wanming: https://link.springer.com/10.1007/978-981-32-9283-3
- Ma Weiming (רקע, SCMP): https://www.scmp.com/news/china/military/article/3332503/meet-ma-weiming-chinese-naval-engineering-genius-behind-fujian-aircraft-carrier-catapult
- Jiang Zonglin, Cambridge 2023: https://www.cambridge.org/core/books/theories-and-technologies-of-hypervelocity-shock-tunnels/detonationdriven-highenthalpy-shock-tunnels/2CA06FBD42D45B19B4C4B852E6EE0574
- ספרי TRIZ באנגלית (MATRIZ): https://matriz.org/wp-content/uploads/2026/05/TRIZ-books-in-English.pdf
- קוואלימטריה: https://en.wikipedia.org/wiki/Qualimetry
- הסדרה Soviet Military Thought: https://de.wikipedia.org/wiki/Soviet_Military_Thought
