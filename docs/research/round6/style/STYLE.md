# סגנון הכתיבה של המורה: מחקר, אבחון וכללים (סבב 6)

הלומד כתב: "I struggle with the explanations and Claude's usual style. Research this, and find the writing style of the best writer or writers on technical topics." המסמך עונה על כך בחמישה חלקים: מה עושים הכותבים הטובים ביותר (1), מה המחקר אומר על הסברים (2), איפה הסגנון הרגיל של המורה נכשל, עם ציטוטים משיעור אמיתי (3), כללים שאפשר לבדוק (4), ודוגמה לפני ואחרי (5).

עיקרון שחל על כל הכללים: **הם משנים איך יחידה נכתבת, לא אם היא קיימת.** אף כלל לא מוחק תוצאה, צעד, מספר, הנחה או חיבור. כשיש סתירה בין כלל כאן לבין כללי השיעור (`docs/ENG_TEACHING_RULES.md`, `docs/CORE_TEACHING_RULES.md`), כללי השיעור קובעים. בייחוד, הסדר של כלל 5א (הקשר, הגדרה כללית, מבנה, ורק אחר כך דוגמה) נשאר, כי הלומד ביקש אותו אחרי שיעורי M0.1.

מקור השיעור שנבדק: `scratchpad/bench/eng_lesson.md`, גילואה, M0.1 שיעור 4, "המתמטיקה המודרנית (א)", 10,482 מילים (קראתי את כולו עד הסעיף על יציבות, ובפירוט את 2,500 המילים הראשונות ואת החלק על ליאפונוב).

---

## 1. הכותבים

רמת האימות: **אומת** = הציטוט נבדק מול הטקסט עצמו (קובץ ההוצאה או עמוד המחבר). **אומת ממקור משני** = הציטוט מופיע זהה בכמה מקורות משניים אמינים, אבל לא ראיתי את העמוד המקורי.

### ריצ'רד פיינמן, The Feynman Lectures on Physics
- "If, in some cataclysm, all of scientific knowledge were to be destroyed, and only one sentence passed on to the next generations of creatures, what statement would contain the most information in the fewest words?" (כרך I, 1-2; אומת ממקור משני: The Marginalian, Goodreads, תמליל ההרצאה ב-feynmanlectures.caltech.edu)
- "I believe it is the atomic hypothesis ... that all things are made of atoms" (שם, המשך הפסקה)

**מה הוא עושה.** פותח בשאלה אמיתית ומוחשית ("איזה משפט אחד?") ועונה עליה בטענה אחת חדה, ורק אחר כך בונה ממנה. כל רעיון מופיע קודם בתמונה (טיפת מים מוגדלת עד שרואים אטומים מתנועעים) ואחר כך בנוסחה. הוא אומר במפורש מה מקורב ומה הוא מדלג עליו, ולמה. המשפטים קצרים ומדוברים, אבל הטיעון רציף: כל משפט נשען על הקודם ב"אז", "אבל", "כי".

### ריצ'רד המינג, The Art of Doing Science and Engineering
- "The purpose of computing is insight, not numbers." (עמ' 35; אומת גם בשקפי הקורס שלו ב-NPS, Hamming00.pdf)
- "Mathematics is nothing but clear thinking" (עמ' 270; אומת ממקור משני)

**מה הוא עושה.** כל חישוב מגיע עם השאלה מה הוא מלמד. מספר בלי תובנה הוא בעיניו כישלון. הוא מלמד דרך סיפורים מהעבודה שלו (מה ניסה, איפה טעה, מה למד), כי לדבריו את הסגנון אפשר ללמוד רק מדוגמה. הוא מעדיף אומדן גס ומהיר על פני חישוב מדויק שמסתיר את המבנה.

### גילברט סטרנג, Introduction to Linear Algebra
- "You will be learning the language of linear algebra in the best and most efficient way: by using it." (הקדמה למהדורה הרביעית; אומת, math.mit.edu/~gs)
- "I have to stop here or you won't read the book." (שם; אומת)

**מה הוא עושה.** מתחיל ממטריצה קטנה וממשית, ומהשאלה Ax = b, ורק אחר כך מכליל למרחבים. רעיון אחד מרכזי (צירופים לינאריים) עובר כחוט דרך כל הספר, והוא אומר את זה בקול. הוא מדבר אל הקורא בגוף שני, בקול של אדם, ומודה בגבולות ("I have to stop here"). מבחינת הסגנון: הקול האישי לא בא על חשבון העומק.

### טריסטן נידהם, Visual Complex Analysis
- "The present book openly challenges the current dominance of purely symbolic logical reasoning by using new, visually accessible arguments to explain the truths of elementary complex analysis." (הקדמה, 1997; אומת, תצוגת OUP למהדורת 25 שנה)
- "an initial lack of rigour is a small price to pay if it allows the reader to see into this world more directly and pleasurably than would otherwise be possible." (שם; אומת)

**מה הוא עושה.** כל משפט מקבל תמונה שבה רואים *למה* הוא נכון, לא רק *שהוא* נכון (הנגזרת המרוכבת כ"amplitwist": סיבוב ומתיחה מקומיים). הוא אומר במפורש מה הוא לא מוכיח, ושולח למקום שבו זה מוכח. הלקח: הסבר אינטואיטיבי וגבולות תוקף מפורשים הולכים יחד.

### קלפנר וקולנקאו, An Introduction to Mechanics
- "Throughout the book we have attempted to make the math more user friendly by solving problems from a physical point of view before presenting a mathematical solution." (הקדמה למהדורה השנייה; אומת, Cambridge frontmatter)
- "They generally require symbolic solutions: numerical values, if needed, come last. Only by looking at a symbolic solution can one decide if an answer is reasonable." (שם; אומת)

**מה הם עושים.** קודם הפיזיקה (מה קורה ולמה), ואז המתמטיקה. דוגמאות פתורות רבות, וכל אחת בנויה כמו בעיה שהקורא יכול לפתור בעצמו. פתרון סימבולי לפני מספרים, ובדיקת מקרי גבול על הפתרון הסימבולי. הם לא מתנצלים על בעיות "משעממות" (מישור משופע), אלא הופכים אותן למעניינות בשינוי אחד (המישור מאיץ).

### הורוביץ והיל, The Art of Electronics
- "The treatment is largely non-mathematical, with strong encouragement of circuit brainstorming, and mental (or, at most, back-of-the-envelope) calculation of circuit values and performance." (הקדמה; אומת ממקור משני, SolderSmoke 2023)

**מה הם עושים.** כותבים כמו מתכנן שמסביר לעמית: הכלל המעשי, המספר הטיפוסי, למה המעגל הנאיבי נכשל ואיך מתקנים אותו. כל טענה נבחנת מול רכיב אמיתי עם מספרים אמיתיים. הם מראים קודם את הגרסה הגרועה ("bad circuits") ואז את הטובה, וכך הקורא מבין מה כל רכיב עושה.

### סנג'וי מהג'אן, Street-Fighting Mathematics
- "Too much mathematical rigor teaches rigor mortis: the fear of making an unjustified leap even when it lands on a correct result." (הקדמה; אומת ממקור משני, ביקורת MAA)

**מה הוא עושה.** מלמד כלים (ממדים, מקרים קיצוניים, אומדן, צורה, סימטריה) ולא נושאים. כל כלי מופיע קודם בבעיה שאי אפשר לפתור בדרך הרגילה, ואחר כך כשם. הוא מנחש, ואז בודק את הניחוש במקרי גבול. אצלנו זה כבר קיים בחלקו (`2.5: סדר גודל`). מה שחסר הוא הסדר שלו: קודם הניחוש והנימוק בשתי שורות, ואז החישוב.

### צ'רלס פצולד, Code
- פרק 1, "Best Friends", נפתח בילד בן עשר שהחבר הכי טוב שלו גר מעבר לרחוב, ושניהם רוצים לדבר בלילה עם פנס (אומת ממקור משני, תקציר O'Reilly; לא ציטטתי מילולית).

**מה הוא עושה.** בונה מחשב שלם מצעדים קטנים, שכל אחד מהם מוחשי (פנס, ממסר, נורה), ואף צעד לא דורש קפיצה. הוא לא משתמש במונח לפני שבנה את הדבר שהמונח מתאר. הלקח עבורנו: **קודם הדבר, אחר כך השם.**

### סטיבן סטרוגץ (The Joy of x, טורי New York Times)
- "explaining math well requires empathy" (Notices of the AMS, 2014, "Writing about Math for the Perplexed and the Traumatized"; אומת ממקור משני). באותו מאמר הוא כותב שהלוגיקה והבהירות "necessary but not sufficient", ושבטור ב-Times הוא כתב לאדם אמיתי אחד ולא ל"קורא אינטליגנטי" כללי.

**מה הוא עושה.** כותב לאדם מסוים שהוא מכיר. מתחיל ממשהו מהחיים (קיפול סדין, מחיר דירה) ומגיע ממנו לרעיון. כל טור עומד בפני עצמו, עם טענה אחת. מתאר במילים מה הנוסחה *אומרת* לפני שמראה אותה.

### גרנט סנדרסון, 3Blue1Brown
- "My goal is for you to come away from this series feeling like you could have invented calculus yourself." (Essence of Calculus, פרק 1; אומת, 3blue1brown.com)

**מה הוא עושה.** מציג את הבעיה (שטח עיגול) לפני הכלי, ונותן לצופה לגלות את הכלי כמעט לבד. כל מושג מגיע עם השאלה שגורמת לו להיות הכרחי. הוא חוזר שוב ושוב לאותה תמונה, ובכל פעם מוסיף לה שכבה. שאלה לפני תשובה, ודוגמה אחת שעליה בונים הכל.

### ברט ויקטור (Explorable Explanations, Up and Down the Ladder of Abstraction)
- "People currently think of text as information to be consumed. I want text to be an environment to think in." (Explorable Explanations, 2011; אומת)
- "the most powerful way to gain insight into a system is by moving between levels of abstraction." (Ladder of Abstraction; אומת)

**מה הוא עושה.** עולה ויורד בסולם ההפשטה: מקרה אחד, משפחה של מקרים, החוק הכללי, ושוב מקרה אחד. נותן לקורא לשנות הנחה ולראות מה קורה (אצלנו: `scene3d` עם פרמטרים). הקורא צריך להיות מסוגל לבדוק כל טענה של הכותב.

### פול גרהם, "Write Simply", "Writing, Briefly"
- "I try to write using ordinary words and simple sentences." (Write Simply; אומת)
- "So you can't assume that writing about a difficult topic means you can use difficult words." (שם; אומת)
- "read your essays out loud to see (a) where you stumble over awkward phrases and (b) which bits are boring" (Writing, Briefly; אומת)

**מה הוא עושה.** מילים רגילות, משפטים פשוטים, טון של שיחה. נושא קשה לא מצדיק מילים קשות, ובמיוחד לא מול קורא שהשפה אינה שפת האם שלו. לנו זה חשוב פעמיים: המונחים באנגלית, והטקסט בעברית.

### סטיבן פינקר, The Sense of Style
- על קללת הידע: "It simply doesn't occur to the writer that readers haven't learned their jargon, don't seem to know the intermediate steps" (APS Observer, 2014; אומת)
- "And so the writer doesn't bother to explain the jargon, or spell out the logic, or supply the concrete details." (שם; אומת)
- על הסגנון הקלאסי: "The writer can see something that the reader has not yet noticed, and he orients the reader's gaze so that she can see it for herself." (אומת ממקור משני)

**מה הוא עושה.** הסגנון הקלאסי: הכותב ראה משהו בעולם ומכוון את מבט הקורא אליו, כשווה אל שווה, בלי מטא ("בפרק הזה נדון") ובלי גידור. קללת הידע היא הסיבה העיקרית לכתיבה עמומה: הכותב לא זוכר איך זה לא לדעת, ולכן מדלג על צעדים, משאיר ז'רגון ולא נותן פרט מוחשי. הוא מזהיר גם משמות פעולה ("zombie nouns" בלשונה של הלן סורד) שמחליפים פועל חי.

### עברית מדעית טובה
אין לעברית ספר סגנון אחד כמו של פינקר, אבל יש מסורת ברורה:
- **מכון דוידסון לחינוך מדעי** (davidson.org.il). מאמרים נפתחים בתמונה מוחשית: "חקלאים מכסים לפעמים את האדמה ביריעות שקופות דווקא בשיא הקיץ." (אומת). ארבעת המשפטים הראשונים במאמר הזה הם באורך 12, 15, 18 ו-23 מילים, ובממוצע כ-17. הפסקאות נפתחות בטענה, והמנגנון מוסבר בפעלים: "מצטברים", "שורדים", "עלולים לפגוע".
- **"גליליאו" וספרי מדע פופולרי מתורגמים** (למשל תרגומי פיינמן וסייגן). העברית הטובה שם בנויה כך: פועל בתחילת המשפט, מעט סמיכויות, ומונח לועזי מוסבר פעם אחת ואז נשאר אותו מונח.
- **ספרי הלימוד של האוניברסיטה הפתוחה** הם המסורת העברית הקרובה ביותר אלינו: נכתבו ללומד שלומד לבד. יש בהם שאלות שמשולבות בטקסט, דוגמאות פתורות צעד אחר צעד וסיכום בסוף כל יחידה.
- **הנחיות כתיבה בהירה** (למשל "דגשים לכתיבה בהירה", מכללת ספיר, 2025): משפט של שורה או שתיים, בלי סלנג ובלי ביטויים ליציים. כבר ב-1965 הציע "לשוננו לעם" של האקדמיה ללשון לצמצם את השימוש ב"ביצוע".

איך נראית פרוזה טכנית עברית ברורה, בפועל:
1. **פועל ולא שם פעולה:** "מחשבים את השטח" ולא "מבצעים חישוב של השטח". "בודקים" ולא "עורכים בדיקה". "משתמשים ב" ולא "עושים שימוש ב".
2. **שרשרת סמיכות של שני שמות לכל היותר:** "שגיאת הקצב של שעון הלוויין" ולא "שגיאת קצב שעון מקלט הלוויין".
3. **בלי תרגום מילולי מאנגלית:** "הגיוני" ולא "עושה שכל". "בסופו של דבר" רק כשבאמת יש סוף. "מתייחס ל" ולא "מתייחס אל ... בתור". "משמעותי" רק כשיש לו משמעות.
4. **פעיל ולא סביל:** "גאוס הוכיח" ולא "הוכח על ידי גאוס".
5. **משפט אחד, רעיון אחד:** 12–25 מילים, הנושא והפועל בתחילת המשפט, והפסוקית הארוכה בסופו.
6. **אותו מונח לאותו דבר:** אם כתבנו "זמן עצמי", לא כותבים אחר כך "זמן השעון", "זמן מקומי" ו"$\tau$" לסירוגין בלי לומר שזה אותו דבר.

---

## 2. מה המחקר אומר על הסברים

| ממצא | מה הוא אומר | מקור |
|---|---|---|
| **דוגמאות פתורות** | למתחיל, דוגמה פתורה מלמדת יותר מאותה בעיה בלי פתרון, כי היא מורידה עומס שלא תורם ללמידה. העליונות נעלמת ואפילו מתהפכת כשהלומד מתקדם (expertise reversal). אז עוברים לדוגמאות שהולכות ומתחסרות (fading) ולשאלות. דוגמה פתורה טובה מסמנת תת-מטרות ("צעד 3: המשוואה האופיינית"). | Sweller & Cooper 1985, *Cognition and Instruction* 2(1); Atkinson, Derry, Renkl & Wortham 2000, *Review of Educational Research* 70(2); Kalyuga, Ayres, Chandler & Sweller 2003, *Educational Psychologist* 38(1); Catrambone 1998, *JEP: General* 127 |
| **הסבר עצמי** | לומדים שמסבירים לעצמם *למה* כל צעד נכון לומדים הרבה יותר מאותה דוגמה. טקסט שמנמק כל צעד ("כי", "ולכן") עושה חלק מהעבודה הזאת בשביל הלומד, ושאלת think מזמינה אותו לעשות את השאר. | Chi, Bassok, Lewis, Reimann & Glaser 1989, *Cognitive Science* 13; Renkl 2014, *Cognitive Science* 38 |
| **דהיית המוחשיות** (concreteness fading) | הסדר הטוב ביותר הוא מוחשי, אחר כך ייצוג ביניים (ציור, טבלה), ורק אז הפשטה. הוא עדיף גם על מוחשי בלבד (לא עובר להקשרים חדשים) וגם על מופשט בלבד (לא מתחבר למשמעות). | Fyfe, McNeil, Son & Goldstone 2014, *Educational Psychology Review* 26, 9–25; Goldstone & Son 2005, *J. Learning Sciences* 14 |
| **קללת הידע** | מי שיודע משהו מתקשה לדמיין שמישהו אחר לא יודע אותו, וגם כשמשלמים לו כדי שיתקן, הוא מתקן מעט. "מקישים" מעריכים ש-50% מהמאזינים יזהו שיר, ובפועל מזהים 2.5%. | Camerer, Loewenstein & Weber 1989, *J. Political Economy* 97(5); Newton 1990 (עבודת דוקטורט, Stanford); Pinker 2014 |
| **שילוט** (signaling) | כותרות, משפטי פתיחה שמציגים את המבנה ומילות קישור מפורשות משפרים זכירה של המבנה והעברה, בעיקר בטקסט ארוך וקשה. שילוט מופרז או ריק ("כפי שנראה בהמשך") לא עוזר. | Lorch 1989, *Educational Psychology Review* 1(3); Mayer 2009/2021, *Multimedia Learning* (signaling principle) |
| **שאלה לפני תשובה** | שאלה שהלומד נשאל לפני שקרא את ההסבר משפרת את הזכירה של התשובה, גם כשהניחוש שלו היה שגוי (pretesting, prequestions). בעיה שהלומד ניסה לפתור לבד לפני ההוראה מעמיקה את ההבנה (productive failure). | Richland, Kornell & Kao 2009, *JEP: Applied* 15(3); Carpenter & Toftness 2017, *J. Applied Research in Memory and Cognition* 6; Kapur 2016, *Educational Psychologist* 51(2) |
| **חלוקה למקטעים** (segmenting) | חומר מורכב נלמד טוב יותר במקטעים בגודל שהלומד קובע את הקצב שלהם מאשר ברצף אחד. אצלנו זה כבר קיים בכותרות, בבלוקים ובחלקי השיעור. | Mayer 2009 (segmenting principle); Mayer & Pilegard 2014 |
| **קוהרנטיות** (coherence) | חומר מעניין שלא קשור לטיעון (seductive details) פוגע בלמידה. מה שלא משרת את הטיעון יוצא, או מתחבר אליו במפורש. | Mayer 2009 (coherence principle); Harp & Mayer 1998, *J. Educational Psychology* 90 |
| **אימון מקדים** (pretraining) | מושגי יסוד שמוגדרים לפני ההסבר המרכזי מורידים עומס בזמן ההסבר. אצלנו: מונח חדש מוגדר לפני שהוא נדרש, לא באמצע גזירה. | Mayer, Mathias & Wetzell 2002, *JEP: Applied* 8 |

שני דברים מהמחקר חשובים במיוחד ללומד הזה:
- **Expertise reversal:** הלומד שואף לרמה גבוהה ולומד מהר. דוגמה פתורה מלאה מתאימה לשלב השער (P0 בלנצ'סטר, P0–P3 בגילואה). מעבר לו, מספיק לתת את תת-המטרות ואת הצעד הקשה, ולשאול את השאר בשאלת think. כך לא מורידים עומק, רק מעבירים חלק מהעבודה ללומד.
- **דהיית המוחשיות מול כלל 5א:** כלל 5א מבקש הגדרה כללית לפני הדוגמה. אין כאן סתירה. המוחשי שבא בהתחלה הוא **הבעיה** (ההקשר, סעיף 1 בכלל 5א): שעון GPS, מטוטלת שנופלת. הוא לא מקרה פרטי של ההגדרה. אחרי הבעיה באה ההגדרה, אחריה המבנה, ואחריהם הדוגמה, ובסוף חוזרים לבעיה.

---

## 3. אבחון: איפה הסגנון הרגיל של המורה מכשיל

### מה הלומד אמר
- "I struggle with the explanations and Claude's usual style" (`docs/NIGHT_PLAN2.md`, §2ג).
- "never trade depth in one domain for another"; "לוודא שהכל יהיה בברמה הגבוהה ביותר שאפשר אין לא ואין פשרות" (`docs/research/round5/decisions/user_messages.md`). המסקנה: הפתרון לא יכול להיות לפשט או לקצר.
- ההערות שלו על שיעורי M0.1 הפכו לכללים 5א–5ד (בגילואה) ו-6א–6ד (בלנצ'סטר). לפי הכללים, אלה היו התלונות: הגדרה ודוגמה התערבבו באותה משוואה. נוסחאות קיבלו בלוק ומספר גם כשהיו רק המחשה. המורה הפנה למספר משוואה בלי לומר מה המשוואה. ולא היה סיכום של מה לזכור. כולן תלונות על **סדר ועל עומס**: הלומד לא ידע מה עיקר ומה טפל, ומה כללי ומה מקרה פרטי. כללים 8א/9ב ("לומדים נושאים, לא קוראים את הספר") מוסיפים את התלונה שהשיעור הלך לפי סדר העמודים ולא לפי הרעיון.

### מה כבר טוב בשיעור (כדי לא לשבור אותו)
השיעור שנבדק טוב בהרבה ממה שהמילים "Claude's usual style" רומזות. הוא נפתח בבעיה מוחשית חזקה (שעון ה-GPS שמקדים ב-38.5 מיקרו-שניות ביום). הגזירות מחולקות לצעדים ("הצעד הראשון... ההנחה נכנסת כאן"). כל נוסחה מגיעה עם תחום התוקף שלה, ושאלות ה-think אמיתיות. המשפטים קצרים: **ממוצע של 11.2 מילים ומדיאן של 10** (421 משפטי פרוזה, ואף משפט מעל 30 מילים). לכן הבעיה אינה "משפטים ארוכים ומגודרים". הבעיות הן במבנה הפסקה, בעומס ובקישור בין המשפטים.

### הדפוסים, עם ציטוטים
**א. מטא ותהליך לפני תוכן (קללת הידע על התכנון).** הפסקה הראשונה של השיעור:
> "השיעור הזה הוא החלק הראשון מתוך שניים שבהם נלמד את §7 ... בהתחלה תכננו שיעור אחד, אבל חילקנו אותו לשניים."

ואחרי הסיפור:
> "נאמר גם משהו על היקף החומר. העמודים שהוקצו לשני השיעורים האחרונים (K1:65–74) קצרים מטבעם."

הלומד קורא על המטבח של המורה לפני שהוא קורא על המתמטיקה. פינקר מתאר בדיוק את זה: הכותב שקוע בתהליך שלו ושוכח שזה לא מעניין את הקורא.

**ב. הגדרה מופשטת ומעגלית לפני שיש במה להיאחז.**
> "מרחב הוא כל אוסף של יחסים שדומים מספיק ליחסים במרחב, כך שאפשר להשתמש בהם בשיטות גאומטריות."

המילה "מרחב" מגדירה את עצמה. הדוגמה (צבעי המסך) באה אחר כך, אבל ההגדרה לא אומרת מה בדיוק צריך להתקיים (קואורדינטות? מרחק?), ולכן אי אפשר לבדוק את הדוגמה מולה.

**ג. קטלוג ומונחים חדשים רבים בפסקה אחת.** באותה פסקה (K1:67) מופיעים: גאומטריה פרויקטיבית, טופולוגיה, המרחב של לובצ'בסקי, מרחבים בממד ארבע, מרחבי רימן, מרחבי פינסלר, מרחבים טופולוגיים ותורת היחסות. יותר משמונה מונחים, וכך היא נגמרת:
> "הרשימה ממשיכה: המרחב של לובצ'בסקי, מרחבים בממד ארבע ובממדים גבוהים יותר, מרחבי רימן, מרחבי פינסלר, מרחבים טופולוגיים."

אין משפט שאומר מה מאחד אותם. לפי Mayer זה עומס בלי תמורה, ולפי כלל 32 זה "קטלוג בלי מנגנון".

**ד. צעדים שדולגו או לא עקביים.**
> "הצעד הרביעי הוא אלגברה פשוטה, וממנו יוצא:"

> "האלגברה המלאה דולגה כאן. היא שייכת לפריפריה של הפיזיקה המודרנית, ושם הגזירה המלאה מחכה לנו."

ובדוגמה על הסיבובים, הסדר מתחלף באמצע:
> "נסובב ספר ב-90° סביב הציר האנכי $z$, ואחר כך ב-90° סביב הציר $x$ ... כשמסובבים קודם סביב $x$ ואחר כך סביב $z$, הווקטור $(1,0,0)$ מגיע ל-$(0,1,0)$."

הסדר שהוכרז (z ואז x) מתהפך במשפט הבא, והמטריצות לא מוצגות. כל אחד מהמקרים האלה הוא מקום שבו מתחיל נעצר ואין לו איך להמשיך.

**ה. מפולת מספרים בלי תוכנית.** הפסקה "[[2.5: סדר גודל]] אפשר להגיע למספר הזה בלי מחשבון" מכילה 55 מספרים: $7\times10^{-10}$, 0.24, $5.3\times10^{-10}$, 3873.8, $0.85\times10^{-10}$, 38.46, 38.51, 11.54, 481, 74.8 ועוד. כל מספר נכון, אבל הפסקה לא אומרת מראש מה מחשבים: שני איברים, הפרש ביניהם, ואז המרה ליום ולמטרים. הקורא לא יודע איזה מספר הוא התשובה ואיזה הוא תוצאת ביניים.

**ו. שלד פנימי שחשוף לקורא.** בשיעור יש 44 תגיות ודאות, 13 תוויות `[[2.5: …]]` בראש פסקאות ו-76 קטעים מודגשים. בגוף הטקסט מופיעים גם מונחי ניהול של הקורס: "צומת" (5 פעמים), "גשר" (6), "פריפריה" (5). למשל:
> "השעון אכן התקדם, בהתאמה של כאחוז לתחזית [[ודאות: בינונית]], ואז הפעילו את התיקון."

תגית באמצע המשפט שוברת את הקריאה. "פריפריה פיזיקה מודרנית" היא מילה מתוך תוכנית הלימודים, לא מתוך העולם.

**ז. ביטויי סרק ומילות "שווה/כדאי".** "שווה" מופיע 27 פעמים ו"כדאי" 6, ובהם:
> "ומאז קרה משהו שכדאי לשים לב אליו"; "ושווה לעשות את זה פעם אחת"; "ושווה לשמור אותן נפרדות"; "יש בהגדרה שלושה חלקים שכדאי לשים לב אליהם".

כל אחד מהם מבטיח חשיבות במקום להראות אותה. לפי כלל 32 אלה "ריכוך ופתיחי סרק".

**ח. טענה עם הנימוק במקום אחר.**
> "הסיבה היא שהמרחב-זמן סביב כדור הארץ אינו אוקלידי."

המשפט הזה בא בסיפור הפתיחה, הרבה לפני שהלומד יודע מה זה מרחב-זמן לא אוקלידי. זו תשובה בלי שאלה ובלי מנגנון, והמנגנון (נוסחה (2)) מגיע רק שני סעיפים אחר כך.

**ט. משפטים קצרים בלי קישור.** הממוצע של 11 מילים למשפט טוב לקריאה. אבל בהרבה פסקאות הקשר בין המשפטים נשאר סמוי: אין "כי", "ולכן" או "אבל", והלומד צריך לנחש איך משפט אחד נובע מקודמו. לדוגמה, בפסקה על איבר הכבידה רצף של משפטים עובר מחללית מאיצה לעקרון השקילות ולשעון גבוה. רק המשפט "לפי העיקרון, אותו דבר קורה בשדה כבידה" אומר מה הקשר, וגם הוא לא אומר *למה* תדר נמוך יותר פירושו שעון איטי יותר.

**י. סיכומי ביניים ופסקאות סגירה.** 15 פעמים "ראינו", ובהן פסקאות סגירה שלמות:
> "ראינו בסעיף הזה שהגאומטריה של רימן היא חלק מהנדסה יומיומית..."

כלל 32 כבר מוחק אותן. הן מופיעות בכל זאת, כי הדפוס של המודל חזק מהכלל. לכן הכלל צריך להיות כזה שאפשר לבדוק.

**הסיכום של האבחון:** הבעיה היא לא חוסר עומק וגם לא אורך המשפט. הבעיה היא **עומס ללא סדר**. בפסקה אחת יש יותר מדי מונחים, מספרים ותגיות, השאלה שהפסקה עונה עליה לא נאמרת, הצעדים בין המשפטים לא כתובים, והתהליך הפנימי של המורה מופיע בטקסט. כל אלה הם תסמינים של קללת הידע.

---

## 4. כללי הסגנון

ארבעה עשר כללים. כל אחד משנה את *הצורה* של יחידה ולא מוחק אותה, ולכל אחד יש בדיקה שסוקר יכול להריץ (רוב הבדיקות אפשר לעשות ב-grep או בספירה).

| # | כלל (הוראה למורה, באנגלית) | הבדיקה |
|---|---|---|
| S1 | **Problem first.** Open each section with the concrete problem it solves (a device, number or puzzle), then follow rule 5a's order; the hook is the problem, not an instance of the definition. | שני המשפטים הראשונים בכל `##` מתארים מצב מוחשי, ואין בהם מונח שעוד לא הוגדר. |
| S2 | **Question before answer.** Before every derivation, key formula or computation, one sentence states the real question it answers. Rhetorical questions stay banned; a question the next lines answer is required. | לכל בלוק `formula`/`definition` ולכל גזירה יש, בשלושת המשפטים שלפניו, משפט שאלה או "רוצים לדעת X". |
| S3 | **Claim-first paragraphs.** Each paragraph's first sentence states its claim or question, never a topic, plan or remark about the lesson itself. | המשפט הראשון לבדו מסכם את הפסקה. אף פסקה לא נפתחת ב"נעבור ל", "נאמר גם משהו על", "בשיעור הזה" או "בהתחלה תכננו". |
| S4 | **Why it matters, on the spot.** Where a result or definition appears, one sentence says what it lets the reader compute, predict or decide, in this lesson's problem. | ליד כל `formula`/`definition` (באותה פסקה או בבאה אחריה) יש משפט "זה מאפשר ל...". |
| S5 | **Thing before name.** Describe a new idea in familiar words, then name it. At most one new term per sentence, three per paragraph; a catalog over four items gets one uniting sentence. | ספירה: עד 3 מונחים חדשים בפסקה, בלי שני מונחים חדשים באותו משפט, ולכל רשימה של יותר מ-4 שמות יש משפט מאחד. |
| S6 | **Visible logic.** Join sentences with explicit links (כי, לכן, אבל, כלומר, ולכן, אם...אז). Never state a claim whose reason arrives sections later; give the reason now, briefly, or postpone the claim. | אין רצף של ארבעה משפטים בלי מילת קישור. אין "הסיבה היא X" שבו X מוסבר רק בסעיף מאוחר יותר. |
| S7 | **Plain Hebrew.** One idea per sentence, 12–25 words, verb early. Use verbs, not nominalizations (לחשב, not לבצע חישוב של). Smichut chains of two nouns at most; no calques; active voice. | grep ל"ביצוע", "לבצע", "עושה שימוש", "בתור", "על ידי"; אין משפט מעל 30 מילים; אין שרשרת של שלושה שמות בסמיכות. |
| S8 | **No hidden steps.** Show every step a learner could not verify in about 30 seconds. Never write "simple algebra gives"; write the line. A deferred step is named: what it is and where it comes. | הסוקר מבצע כל צעד מתוך הטקסט בלבד. כל מקום שבו נתקע הוא כישלון. אסור "אלגברה פשוטה" בלי השורה עצמה, וסדר הפעולות לא מתחלף באמצע. |
| S9 | **Argue in prose.** Lists hold only parallel items the reader will look up (conditions, cases, catalog). Reasoning, with its because and therefore, stays in sentences. | אין פריט ברשימה שמכיל שרשרת נימוק ("לכן... ולכן"). רשימות קיימות רק במבנים מקבילים. |
| S10 | **Plan the numbers.** A numeric paragraph first says which quantities it computes and how they combine. Then one quantity per sentence, with units; it ends with the comparison that answers the question. | משפט תוכנית בתחילת כל פסקה עם יותר מ-8 מספרים. התשובה הסופית מסומנת ככזו. עד שני מספרים חדשים למשפט. |
| S11 | **Close the loop.** After the general result, return to the section's opening problem and apply the result to it: concrete, then general, then the same concrete case again. | הבעיה מראש הסעיף חוזרת אחרי הנוסחה שלו, עם הנוסחה מופעלת עליה. |
| S12 | **Quiet scaffolding.** Keep the markers the rules require, but put them at sentence end, never mid-clause. Bold only a term at its definition, or one warning per section. | אין `[[ודאות:` באמצע פסוקית (לפני פסיק). מספר ההדגשות קטן ממספר המונחים המוגדרים ועוד 1 לכל סעיף. |
| S13 | **Reader's words only.** Body prose never uses course machinery (צומת, גשר, פריפריה, 2.5, "יחידה"); those live in fieldmap/refresh blocks. At most one forward reference per section, saying what comes and why. | grep לצומת/גשר/פריפריה מחוץ לבלוקים מגודרים מחזיר 0. עד "נפגוש"/"בהמשך"/"נראה" אחד לכל `##`. |
| S14 | **One name per thing.** Each concept keeps one Hebrew name throughout the lesson, and each symbol one meaning. Changing a name requires saying so explicitly. | הסוקר עובר על המונחים המרכזיים, ולכל אחד יש שם אחד. כל שם נוסף מופיע עם "כלומר" או "שנקרא גם". |

### PROMPT BLOCK

```
STYLE (changes how units are written, never removes one; rules 5a–5d win)
1. Open each section with the concrete problem it solves, then follow 5a's order.
2. Before each derivation, formula or computation, one sentence states the real question it answers.
3. A paragraph's first sentence states its claim or question, never a topic or lesson logistics.
4. Where a result appears, say what it lets the reader compute, predict or decide here.
5. Describe an idea in familiar words before naming it. Max one new term per sentence, three per paragraph; catalogs get a uniting sentence.
6. Link sentences with explicit logic (כי, לכן, אבל, כלומר). Never give a claim whose reason comes sections later.
7. Plain Hebrew: one idea per sentence, 12–25 words, verb early; verbs not nominalizations (לחשב, not לבצע חישוב); smichut chains ≤2 nouns; no calques; active voice.
8. Show any step a learner can't check in ~30 s; never "simple algebra gives". Name deferred steps and where they come.
9. Reasoning in prose; lists only for parallel items.
10. Numeric paragraphs: first say what is computed and how it combines; one quantity per sentence, with units; end with the answer.
11. After the general result, apply it back to the opening problem.
12. Markers at sentence end, never mid-clause; bold only defined terms or one warning per section.
13. Body prose never uses course machinery (צומת, גשר, פריפריה, 2.5); at most one forward reference per section.
14. One Hebrew name per concept, one meaning per symbol.
```

(כ-245 מילים.)

---

## 5. לפני ואחרי

**הפסקה המקורית** (`eng_lesson.md`, הסעיף "מרחב אחד, מרחבים רבים", K1:67), מילה במילה:

> [[K1:67]] לגאומטריה החדשה היו שני מאפיינים, ושניהם עוד יחזרו בקורס. הראשון: המילה "מרחב" קיבלה משמעות רחבה יותר. מרחב הוא כל אוסף של יחסים שדומים מספיק ליחסים במרחב, כך שאפשר להשתמש בהם בשיטות גאומטריות. דוגמה מחיי היום-יום היא מרחב הצבעים של מסך. כל צבע הוא נקודה עם שלוש קואורדינטות, אדום, ירוק וכחול, ויש משמעות ל"מרחק" בין שני צבעים. המאפיין השני מתרחש בתוך הגאומטריה האוקלידית עצמה: מפרידים קבוצה של תכונות וחוקרים אותה בנפרד משאר התכונות, וכך נולדות "גאומטריות" עצמאיות. ב[[מונח: גאומטריה פרויקטיבית | חקר התכונות שנשמרות בהטלה, למשל בצילום: ישר נשאר ישר, אבל אורכים וזוויות משתנים]] מתעניינים רק במה שנשמר בצילום. ב[[מונח: טופולוגיה | חקר התכונות שנשמרות במתיחה ובכיפוף בלי קריעה, למשל מה מחובר למה]] מתעניינים רק במה שנשמר במתיחה, וזו הסיבה שמפת קווים של רכבת יכולה לעוות מרחקים ועדיין להיות נכונה. הרשימה ממשיכה: המרחב של לובצ'בסקי, מרחבים בממד ארבע ובממדים גבוהים יותר, מרחבי רימן, מרחבי פינסלר, מרחבים טופולוגיים. ומעל כולם תורת היחסות, שהיא תורה של מרחב, זמן וכבידה.

**מה לא עובד בה, לפי הכללים:** המשפט הראשון מכריז על נושא ("שני מאפיינים") ולא אומר מה השתנה ולמה זה חשוב (S3, S4). ההגדרה של "מרחב" מעגלית ולא אומרת מה צריך להתקיים, ולכן אי אפשר לבדוק מולה את דוגמת הצבעים (S5, וכלל 5א שלב 3: איך ההגדרה בנויה). יש בפסקה תשעה מונחים חדשים, והרשימה בסופה היא קטלוג שאין לו משפט מאחד (S5, S9). שני הרעיונות דחוסים לפסקה אחת (S3). והפסקה לא חוזרת לבעיה שבגללה התחלנו, שעון הלוויין (S11).

**אחרי** (אותו תוכן: שני המאפיינים, ההגדרה, דוגמת הצבעים, הגאומטריה הפרויקטיבית והטופולוגיה עם ההגדרות שלהן, מפת הרכבת, כל רשימת המרחבים ותורת היחסות. נוספו משפט מבנה ומשפט מאחד, ולא נמחק כלום. הסדר של כלל 5א נשמר: הגדרה, מבנה, דוגמה):

> [[K1:67]] מה השתנה בגאומטריה במאה ה-19? שני דברים, ושניהם יחזרו בקורס: המילה "מרחב" קיבלה משמעות רחבה יותר, ומתוך הגאומטריה של אוקלידס נולדו גאומטריות עצמאיות.
>
> השינוי הראשון הוא בהגדרה. מרחב הוא כל אוסף של עצמים שהיחסים ביניהם דומים מספיק ליחסים בין נקודות במרחב הרגיל, עד כדי כך שאפשר לחקור אותם בשיטות גאומטריות. בפועל ההגדרה דורשת שני דברים: שכל עצם יתואר במספרים, כמו קואורדינטות, ושיהיה ביניהם יחס שמתנהג כמו מרחק. דוגמה: צבעי המסך. כל צבע הוא שלושה מספרים, אדום, ירוק וכחול, ולכן הוא נקודה עם שלוש קואורדינטות. יש גם מרחק, כי לשני צבעים יש משמעות ל"כמה הם רחוקים זה מזה". לכן הצבעים הם מרחב, ומותר להפעיל עליהם גאומטריה.
>
> השינוי השני קורה בתוך הגאומטריה של אוקלידס עצמה: בוחרים קבוצה אחת של תכונות, חוקרים רק אותה, וכך נולדת "גאומטריה" עצמאית. צילום, למשל, משמר ישרים אבל משנה אורכים וזוויות. מי שחוקר רק את מה שנשמר בצילום עוסק ב[[מונח: גאומטריה פרויקטיבית | חקר התכונות שנשמרות בהטלה, למשל בצילום: ישר נשאר ישר, אבל אורכים וזוויות משתנים]]. מתיחה וכיפוף בלי קריעה משמרים פחות מזה, רק את מה שמחובר למה. מי שחוקר רק את זה עוסק ב[[מונח: טופולוגיה | חקר התכונות שנשמרות במתיחה ובכיפוף בלי קריעה, למשל מה מחובר למה]]. לכן מפת קווים של רכבת יכולה לעוות מרחקים ועדיין להיות נכונה: היא שומרת בדיוק את התכונה הטופולוגית, איזו תחנה מחוברת לאיזו.
>
> משני השינויים האלה צמחה משפחה שלמה של מרחבים: המרחב של לובצ'בסקי, מרחבים בממד ארבע ובממדים גבוהים יותר, מרחבי רימן, מרחבי פינסלר ומרחבים טופולוגיים. מה שמשותף לכולם הוא שלכל אחד מהם כלל מדידה משלו, או קבוצת תכונות משלו שהוא שומר. ובראשם תורת היחסות, תורה של מרחב, זמן וכבידה. היא המרחב ששעון הלוויין מתקתק בו.

**מה השתנה, כלל אחר כלל:** S2/S3: הפסקה נפתחת בשאלה אמיתית ובתשובה בשני חלקים. S5: ההגדרה כבר לא מעגלית ("עצמים" ו"נקודות במרחב הרגיל"), ומשפט המבנה ("שני דברים") מאפשר לבדוק את הדוגמה מולה. בכל פסקה עד שני מונחים חדשים, ולרשימה יש משפט מאחד. S6: מילות קישור מפורשות ("לכן", "כי", "בפועל"). S9: כל רעיון בפסקה משלו. S11: המשפט האחרון מחבר חזרה לשעון הלוויין. כמות התוכן זהה. המילים התווספו רק למשפט המבנה, למשפט המאחד ולחיבור לשעון.

---

## מקורות

- Feynman, *The Feynman Lectures on Physics* I, 1-2 — https://www.themarginalian.org/2012/09/11/richard-feynman-lectures-on-physics/ ; https://www.feynmanlectures.caltech.edu/FLP_Lecture_1_Transcript.pdf
- Hamming, *The Art of Doing Science and Engineering* — https://andars.github.io/notes/aofse.html ; https://savage.nps.edu/hamming/HammingLearningToLearnRecovered/Hamming00.pdf
- Strang, *Introduction to Linear Algebra*, 4th ed. preface — https://math.mit.edu/~gs/linearalgebra/ila5/preface.pdf
- Needham, *Visual Complex Analysis*, preface — https://api.pageplace.de/preview/DT0400.9780192695451_A46510629/preview-9780192695451_A46510629.pdf
- Kleppner & Kolenkow, *An Introduction to Mechanics*, 2nd ed. preface — https://assets.cambridge.org/97805211/98110/frontmatter/9780521198110_frontmatter.pdf
- Horowitz & Hill, *The Art of Electronics*, preface (via) — https://soldersmoke.blogspot.com/2023/09/the-art-of-electronics-by-horowitz-and.html
- Mahajan, *Street-Fighting Mathematics* (MAA review) — https://old.maa.org/node/110721
- Petzold, *Code*, ch. 1 — https://www.oreilly.com/library/view/code-the-hidden/9780735634688/ch01.xhtml
- Strogatz, "Writing about Math for the Perplexed and the Traumatized", *Notices AMS* 61(3), 2014 — https://community.ams.org/notices/201403/rnoti-p286.pdf
- Sanderson, *Essence of Calculus* — https://www.3blue1brown.com/lessons/essence-of-calculus
- Victor, *Explorable Explanations* — https://worrydream.com/ExplorableExplanations/ ; *Up and Down the Ladder of Abstraction* — https://worrydream.com/LadderOfAbstraction/
- Graham, "Write Simply" — https://paulgraham.com/simply.html ; "Writing, Briefly" — https://paulgraham.com/writing44.html
- Pinker on the curse of knowledge — https://www.psychologicalscience.org/observer/the-curse-of-knowledge-pinker-describes-a-key-cause-of-bad-writing
- מכון דוידסון — https://davidson.org.il/read-experience/askexpert/sunlight-against-pests/
- "דגשים לכתיבה בהירה", מכללת ספיר 2025 — https://it.sapir.ac.il/wp-content/uploads/2024/11/דגשים-לכתיבה-בהירה-2025.pdf
- Fyfe et al. 2014 — https://link.springer.com/content/pdf/10.1007/s10648-014-9259-1.pdf
- שאר המאמרים בטבלה בסעיף 2 מצוטטים לפי כתב העת והשנה. את אלה לא פתחתי בסבב הזה.
