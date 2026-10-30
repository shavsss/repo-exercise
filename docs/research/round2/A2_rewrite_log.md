# A2 rewrite 1: the logarithm (Napier) section of Gilua M0.1 L3

**Source:** Gilua M0.1 lesson 3, section "הלוגריתם של נאפייר: משוואה דיפרנציאלית לפני החשבון הדיפרנציאלי" (blocks 44–59 in `A2_coding.py`, 16 blocks).
**Checklist:** 40 depth units, N1–N40 (`A2_units.json` → `rewrite_checklists.log`). Source with unit markers: `A2_src/log_v2.md`. The audit script is `A2_audit.py log v2`.

## Result

| | original | v1 | v2 (final) |
|---|---|---|---|
| prose words | 1,880 | 1,043 | **1,032** |
| ratio to original | 1.00 | 0.555 | **0.549** |
| ratio, without the `keep` block | – | 0.518 | 0.521 |
| ratio, if the original's off-topic names erratum is not counted (1,681) | – | 0.620 | 0.614 |
| depth units kept | 40/40 | 40/40 | **40/40** |
| words per depth unit | 47.0 | 26.1 | **25.8** |
| sentences, mean words / share under 8 words | 13.9 / 15% | – | 16.6 / 16% |

The sentence profile hardly changes, so the text is not telegraphic. The words were saved by removing whole functions, not by squeezing sentences:
- the section recap (block 59, 73 words);
- an erratum about names and dates from §5.1–5.2 that does not belong to this topic (block 58, 95 words);
- meta paragraphs ("[[2.5: מבנה משותף]] משוואה (5) ותכונה (7) מופיעות בכל מקום... בבלוק הבא שלוש דוגמאות", block 55);
- a repeat of the lesson-1 values of $b/\ln b$;
- the check of $\mathrm{NL}(10^6)-\mathrm{NL}(2\times10^6)$, an illustration of N14 with no new unit;
- prose that was turned into one mapping table. The domain block and the fieldmap had said the same mappings twice.

## Format used (the "dense lesson" template)
1. **One question as the thread** (one sentence). History appears only where it carries a unit (N6, N8, N16, N23, N26).
2. **Definition first** (`formula` block with its domain of validity), then the derivation skeleton. Each assumption is bolded at the step where it enters.
3. **Commit-before-reveal** `think` blocks placed *before* the result they test. One comes before the derivation, one after the slide rule.
4. **"לזכור" anchors** kept apart from illustrations. Only anchors go into `keep`.
5. **The trade-off, the limits and the critique** as short paragraphs, each opening with its claim in bold.
6. **Cross-domain mappings as one table**: field | what is multiplied | what follows. One row per field, and each row is a testable unit.
7. **No** recaps, signposting, page narration or certainty tags on settled history.

## v1 → v2 audit
- Marker audit: v1 already contained all 40 markers.
- Number-fidelity audit: every number in the original that is missing from v1 is one of these: a page number, a date from the unrelated erratum, the lesson-1 values of $b/\ln b$ (restatement), the $\mathrm{NL}$ arithmetic checks (illustration), or a rounding ($0.301$→$0.30103$, $2.718$→$2.71828$, $1024$→$2^{10}$). None of them carries a unit.
- Content audit: one partial loss. N23 lost "the table was then used for centuries", the reason the one-time cost was worth it. Restored in v2.
- v2 also merged the `keep` block from 5 lines to 3. Net result: −11 words.

## Final text (v2)

## הלוגריתם: פונקציה שמוגדרת לפי קצב השינוי שלה

האסטרונומים של 1600 היו צריכים דבר אחד: להפוך כפל של מספרים בני שבע ספרות לחיבור. נאפייר פתר את זה בלי מעריכים. הוא הגדיר את הלוגריתם לפי **קצב השינוי** שלו, כלומר השתמש במושג של גודל משתנה חצי מאה לפני ניוטון ולייבניץ, בלי מושג של מהירות רגעית ובעזרת אינטואיציה של תנועה בלבד.

```formula
@title: הלוגריתם כמשוואה דיפרנציאלית
$$y'=\frac{c}{x},\quad x>0,\qquad y(1)=0\ \Longrightarrow\ y=c\ln x\tag{5}$$
קצב הגידול של $y$ הפוך לגודל $x$ עצמו. בתנאי $y(1)=0$ הפתרון יחיד. תקף רק ל-$x>0$: ב-$x\to0$ הקצב מתבדר ו-$y\to-\infty$.
```

**איך נאפייר הגיע ל-(5).** שתי נקודות יוצאות יחד. P רצה על קטע באורך $10^7$, רדיוס המעגל של טבלאות הסינוסים של זמנו, שבו כל הסינוסים היו שלמים. **הנחה ראשונה:** מהירות P שווה בכל רגע למרחק $x$ שנותר לה, ולכן היא מאטה ולעולם אינה מגיעה. מכאן ה-$1/x$. **הנחה שנייה:** Q רצה על ישר אינסופי במהירות קבועה, המהירות ההתחלתית של P, ולכן הדרך שלה היא שעון. הלוגריתם של $x$ הוא הדרך של Q ברגע שבו ל-P נותר $x$. בזמן קצר $dt$ ‏Q עוברת $10^7dt$ ו-$x$ קטן ב-$x\,dt$. היחס, $-10^7/x$, הוא (5) עם $c=-10^7$, ועם $y=0$ ב-$x=10^7$ מתקבל
$$\mathrm{NL}(x)=10^7\ln\frac{10^7}{x},\qquad \mathrm{NL}(5\times10^6)=6{,}931{,}472\tag{6}$$

```think
נניח שידוע רק ש-$y'=c/x$, ו-$k$ הוא מספר קבוע. כש-$x$ גדל, ההפרש $y(kx)-y(x)$ עולה, יורד או קבוע? התחייבו לתשובה לפני שתפתחו.
---
קבוע. זו כל תכונת הלוגריתם, והגזירה מראה למה.
```

```derivation
@title: מ-$y'=c/x$ לכפל שהופך לחיבור
צעד 1: מגדילים את $x$ בתוספת קטנה $\Delta$. לפי (5), $y(x)$ גדל ב-$c\Delta/x$.
צעד 2: באותו צעד $kx$ גדל ב-$k\Delta$, ולכן $y(kx)$ גדל ב-$c\,k\Delta/(kx)=c\Delta/x$. **כאן עובדת הצורה $1/x$:** ה-$k$ של התוספת מתקזז עם ה-$k$ שבמכנה. הגידולים שווים, ולכן $y(kx)-y(x)$ קבוע.
צעד 3: ב-$x=1$ הקבוע הוא $y(k)$:
$$y(kx)=y(x)+y(k)\tag{7}$$
צעד 4: מ-(7), $y(k^m)=m\,y(k)$ לכל $m$ שלם ואחר כך רציונלי. הבסיס $b$ הוא המספר שבו $y(b)=1$, ואז $y=\log_b$. עם $c=1$ זה $\ln$ והבסיס הוא $e=2.71828\ldots$; ל-$\log_{10}$ צריך $c=1/\ln10=0.4343$.
```

**העיקרון: הלוגריתם מודד יחסים כמרחקים.** (5) אינה משתנה כשמחליפים יחידות: מדידה של $x$ בסנטימטרים במקום במטרים רק מזיזה את $y$ בקבוע. לכן מה שקובע הוא **היחס** בין שני ערכים ולא ההפרש ביניהם: מ-1 ל-10 ומ-1,000 ל-10,000 זה אותו מרחק. $c$ קובע רק את יחידת המרחק, וזה כל ההבדל בין $\ln$, $\log_{10}$ ו-$\log_2$:
$$\ln x=2.3026\,\log_{10}x\tag{8}$$

ה-NL המקורי **יורד** כש-$x$ עולה ($c=-10^7$), ולכן אינו מקיים את (7) במדויק אלא $\mathrm{NL}(x)+\mathrm{NL}(y)=\mathrm{NL}(xy/10^7)$. המשתמשים תיקנו בחזקות של $10^7$, עד שבריגס ונאפייר עברו לבסיס שבו $\log1=0$ ו-$\log10=1$.

**תוצאה בשורה אחת: למה $e$ הוא הבסיס הזול ביותר.** לפי (5) עם $c=1$, השיפוע של $\ln$ גדול מ-1 משמאל ל-$x=1$ וקטן מ-1 מימין לו, ולכן העקומה נמצאת תמיד מתחת למשיק שלה ב-1: $\ln x\le x-1$. נציב $x=b/e$ ונקבל $\ln b\le b/e$, כלומר $b/\ln b\ge e$, עם שוויון רק ב-$b=e$. זו ההוכחה שהובטחה בשיעור 1 לעלות הייצוג $C(b)\propto b/\ln b$. בסיס 3 יקר מ-$e$ ב-0.46%, בסיס 2 ב-6.1% ובסיס 10 ב-60%.

**עוגנים לזכור.**
- $2^{10}\approx10^3$, ולכן $\log_{10}2\approx0.30$ (המדויק 0.30103, שגיאה של 0.34%). מ-(7): $\log5=0.699$, $\log8=0.903$, $\log6=0.778$.
- דציבל הוא $10\log_{10}$ של יחס הספקים: פי 2 הם 3.01 dB, ופי $10^6$ הם 60 dB. במתח פי 2 הם 6.02 dB, כי $P\propto V^2$. לכן כל ביט בממיר אנלוגי-דיגיטלי מוסיף 6.02 dB ליחס האות לרעש.

**הפשרה: טבלה מול סרגל חישוב.** הלוגריתם אינו מבטל את עבודת הכפל, הוא מעביר אותה למקום אחר. בטבלה של בריגס (1624, ‏14 ספרות) כפל עולה שלושה עיונים, חיבור ואינטרפולציה, והמחיר האמיתי שולם פעם אחת, בשנים של חישוב ידני של טבלה ששימשה מאות שנים. סרגל החישוב (משנות ה-1620 ועד שנות ה-1970) מחליק סרגל על סרגל שהשנתות שלהם ב-$\log x$, כלומר מחבר אורכים. מחירו הוא דיוק: שגיאת קריאה של 0.1 מ"מ בסרגל של 25 ס"מ היא, לפי (8), שגיאה יחסית של $\ln10\times0.1/250=9.2\times10^{-4}$, כ-3 ספרות. השגיאה **היחסית** קבועה לכל אורך הסקאלה, כי הסרגל מודד יחסים: זו נקודה צפה, לעומת נקודה קבועה. שלוש ספרות הספיקו לתכנון גשרים ומטוסים במשך שלוש מאות שנה, כי עומסים ותכונות חומר אינם ידועים טוב יותר.

```think
בסרגל חישוב אין שנתה 0, אין מספרים שליליים, ואי אפשר לחשב בו $2+3$. הסבירו כל אחת משלוש העובדות מתוך (5) ו-(7) לפני שתפתחו.
---
0 יושב ב-$-\infty$, כי התחום של (5) הוא $x>0$, ולשליליים אין לוגריתם ממשי. בקצה השמאלי עומד 1, כי $\log1=0$. חיבור הוא בדיוק מה שהלוגריתם אינו מפשט: $\log(a+b)$ אינו פונקציה פשוטה של $\log a$ ו-$\log b$. זה כלל של כל התמרה: היא מוזילה פעולה אחת ומייקרת אחרת. מי שעבד עם סרגל ניהל לבד את הסימן ואת החזקה של 10, והסרגל נתן לו רק את הספרות: החלוקה למנטיסה ולמעריך.
```

**איפה עוד זה עובד.** בכל מקום שבו "צעד שווה" פירושו כפל שווה, ובעיקר כשהגודל משתרע על סדרי גודל רבים, מודדים בסקאלה לוגריתמית. גם החושים שלנו עובדים כך בקירוב.

| תחום | מה מוכפל | מה נובע מ-(7) |
|---|---|---|
| רעש ואותות | הספקים בשרשרת | שרשרת מגברים וכבלים מתחברת: $+20-6+20=34$ dB. אבל שני מקורות לא מתואמים של 60 dB נותנים 63.0 dB: הספקים מתחברים, דציבלים לא |
| מוזיקה | תדירות: אוקטבה היא פי 2, ו-12 חצאי טון שווים ביחס | המקשים מסודרים לפי $\log_2 f$, ומנגינה שמועברת לסולם אחר נשארת "אותה" מנגינה: אי-התלות בקנה מידה של צעד 2 |
| רעידות אדמה | אמפליטודה פי 10 לכל יחידת ריכטר, אנרגיה $\propto A^{1.5}$ | כל יחידה היא פי 31.6 באנרגיה, ושתי יחידות פי 1000 |
| מספרים | המספר עצמו | מספר הספרות של מספר הוא בערך הלוגריתם שלו |
| אותות ומערכות | תגובות של מערכות משורשרות | בגרף בוֹדה, ששני הצירים שלו לוגריתמיים, שרשור מערכות הופך לחיבור של קווים |
| מידע | הסתברויות של אירועים בלתי תלויים | המידע הוא $\log$ של מספר האפשרויות, ולכן הוא מתחבר |
| תרמודינמיקה | נפח בהתפשטות בטמפרטורה קבועה | העבודה תלויה ביחס $V_2/V_1$, לא בהפרש |
| אלקטרוניקה | זרם בדיודה | המתח עולה בצעד קבוע בכל הכפלה של הזרם, וכך בונים מעגלים שמחשבים לוגריתם |
| אלגוריתמים | גודל של מילון ממוין | חיפוש בחציה דורש $\log_2N$ צעדים: מילון גדול פי 1000 עולה כ-10 צעדים נוספים |

```keep
- $y'=c/x$ ($x>0$, $y(1)=0$) ⇒ $y=c\ln x$ ⇒ $y(kx)=y(x)+y(k)$: יחסים נמדדים כמרחקים, ו-$c$ הוא רק יחידה ($\ln=2.3026\log_{10}$).
- $\log_{10}2\approx0.30$; פי 2 בהספק 3 dB, במתח 6 dB; ביט בממיר 6.02 dB; $b/\ln b\ge e$.
- כל התמרה מוזילה פעולה אחת ומייקרת אחרת (סרגל: כפל זול, חיבור אי אפשר, כ-3 ספרות בשגיאה יחסית קבועה).
```

## Unit checklist (v2)

Paragraph indices count blank-line-separated blocks of `A2_src/log_v2.md`.

| unit | content (from the coding) | original block | where in v2 (paragraph ¶, first words) |
|---|---|---|---|
| N1 | DEF Napier defines log by its rate: growth rate inversely proportional to the quantity, y'=c/x (not as inverse of a^y) | 44 | ¶2: ```formula @title: הלוגריתם כמשוואה דיפרנציאלית $$y'=\frac{c |
| N2 | LIM domain x>0; as x->0 the rate diverges and y->-inf | 45 | ¶2: ```formula @title: הלוגריתם כמשוואה דיפרנציאלית $$y'=\frac{c |
| N3 | RES with y(1)=0 the solution is unique: y=c ln x | 45 | ¶2: ```formula @title: הלוגריתם כמשוואה דיפרנציאלית $$y'=\frac{c |
| N4 | STEP Napier model: point P moves with speed = remaining distance x -> source of 1/x; P slows and never arrives | 46 | ¶3: **איך נאפייר הגיע ל-(5).** שתי נקודות יוצאות יחד. P רצה על ק |
| N5 | STEP point Q moves at constant speed = P initial speed (10^7): Q distance is a clock; NL(x)= Q distance when P has x left | 46 | ¶3: **איך נאפייר הגיע ל-(5).** שתי נקודות יוצאות יחד. P רצה על ק |
| N6 | PRX 10^7 = radius of contemporary sine tables (so all sines were integers) | 46 | ¶3: **איך נאפייר הגיע ל-(5).** שתי נקודות יוצאות יחד. P רצה על ק |
| N7 | RES NL(x)=10^7 ln(10^7/x), i.e. c=-10^7, y=0 at x=10^7; NL(5e6)=6,931,472 | 46 | ¶3: **איך נאפייר הגיע ל-(5).** שתי נקודות יוצאות יחד. P רצה על ק |
| N8 | STR Napier had no instantaneous velocity; motion intuition = variable/function concept before Newton-Leibniz | 46 | ¶1: האסטרונומים של 1600 היו צריכים דבר אחד: להפוך כפל של מספרים  |
| N9 | STR the need: turn multiplication of 7-digit numbers into addition | 47 | ¶1: האסטרונומים של 1600 היו צריכים דבר אחד: להפוך כפל של מספרים  |
| N10 | STEP compare y at x and kx: increments c*d/x and c*k*d/(kx) equal - the k cancels; this is exactly where the 1/x form is used | 48 | ¶5: ```derivation @title: מ-$y'=c/x$ לכפל שהופך לחיבור צעד 1: מג |
| N11 | RES y(kx)=y(x)+y(k): log of product = sum of logs | 48 | ¶5: ```derivation @title: מ-$y'=c/x$ לכפל שהופך לחיבור צעד 1: מג |
| N12 | RES y(k^m)=m*y(k) (integer then rational m); base b defined by y(b)=1 so y=log_b | 48 | ¶5: ```derivation @title: מ-$y'=c/x$ לכפל שהופך לחיבור צעד 1: מג |
| N13 | OOM c=1 gives ln with base e=2.71828; log10 needs c=1/ln10=0.4343 | 48 | ¶5: ```derivation @title: מ-$y'=c/x$ לכפל שהופך לחיבור צעד 1: מג |
| N14 | STR scale invariance: change of units shifts log by a constant; the ratio, not the difference, controls; log = the function that measures ratios as distances | 49 | ¶6: **העיקרון: הלוגריתם מודד יחסים כמרחקים.** (5) אינה משתנה כשמ |
| N15 | RES ln x = 2.3026 log10 x; c only sets the unit (ln/log10/log2) | 49 | ¶6: **העיקרון: הלוגריתם מודד יחסים כמרחקים.** (5) אינה משתנה כשמ |
| N16 | CRT Napier's NL decreases with x and does not satisfy (7): NL(x)+NL(y)=NL(xy/10^7); users corrected by powers of 10^7; Briggs+Napier moved to log1=0, log10=1 | 50 | ¶7: ה-NL המקורי **יורד** כש-$x$ עולה ($c=-10^7$), ולכן אינו מקיי |
| N17 | RES ln x <= x-1 (tangent bound), from rate 1/x being >1 left of 1 and <1 right of 1 | 51 | ¶8: **תוצאה בשורה אחת: למה $e$ הוא הבסיס הזול ביותר.** לפי (5) ע |
| N18 | RES radix economy b/ln b >= e, minimum at b=e (one-line proof via N17 with x=b/e) | 51 | ¶8: **תוצאה בשורה אחת: למה $e$ הוא הבסיס הזול ביותר.** לפי (5) ע |
| N19 | OOM base 3 costs +0.46% over e, base 2 +6.1%, base 10 +60% | 51 | ¶8: **תוצאה בשורה אחת: למה $e$ הוא הבסיס הזול ביותר.** לפי (5) ע |
| N20 | OOM 2^10~10^3 => log10 2~0.30 (err 0.34%); via (7): log5=0.699, log8=0.903, log6=0.778 | 52 | ¶9: **עוגנים לזכור.** - $2^{10}\approx10^3$, ולכן $\log_{10}2\ap |
| N21 | OOM dB=10log10 power ratio: x2 power = 3.01 dB, x10^6 = 60 dB; x2 voltage = 6.02 dB because P~V^2 | 52 | ¶9: **עוגנים לזכור.** - $2^{10}\approx10^3$, ולכן $\log_{10}2\ap |
| N22 | MAP ADC: each extra bit doubles levels => +6.02 dB SNR | 52 | ¶9: **עוגנים לזכור.** - $2^{10}\approx10^3$, ולכן $\log_{10}2\ap |
| N23 | TRD log table vs slide rule: table 14 digits, 3 lookups+1 add+interp, cost paid once (years of hand computation) / rule: speed, few digits | 53 | ¶10: **הפשרה: טבלה מול סרגל חישוב.** הלוגריתם אינו מבטל את עבודת  |
| N24 | OOM slide-rule error: 0.1 mm on 25 cm => ln10*0.1/250 = 9.2e-4 relative = ~3 significant figures | 53 | ¶10: **הפשרה: טבלה מול סרגל חישוב.** הלוגריתם אינו מבטל את עבודת  |
| N25 | STR slide rule has constant RELATIVE error over the scale (it measures ratios) = floating point (vs fixed point) | 53 | ¶10: **הפשרה: טבלה מול סרגל חישוב.** הלוגריתם אינו מבטל את עבודת  |
| N26 | PRX 3 digits sufficed for bridges and aircraft for ~300 years (1620s-1970s) because loads/material data are no better | 53 | ¶10: **הפשרה: טבלה מול סרגל חישוב.** הלוגריתם אינו מבטל את עבודת  |
| N27 | LIM no 0 and no negatives on a slide rule (0 is at -inf); left end is 1 (log1=0) | 54 | ¶11: ```think בסרגל חישוב אין שנתה 0, אין מספרים שליליים, ואי אפש |
| N28 | LIM log does not simplify addition: log(a+b) is no simple function of log a, log b | 54 | ¶11: ```think בסרגל חישוב אין שנתה 0, אין מספרים שליליים, ואי אפש |
| N29 | STR every transform buys one cheap operation and makes another expensive | 54 | ¶11: ```think בסרגל חישוב אין שנתה 0, אין מספרים שליליים, ואי אפש |
| N30 | STR slide-rule user tracks sign and power of ten himself; rule gives digits only = mantissa/exponent split | 54 | ¶11: ```think בסרגל חישוב אין שנתה 0, אין מספרים שליליים, ואי אפש |
| N31 | MAP dB: two uncorrelated 60 dB sources = 63.0 dB (power adds, dB do not); cascades add in dB (+20-6+20=34) | 56 | ¶13: / תחום / מה מוכפל / מה נובע מ-(7) / /---/---/---/ / רעש ואות |
| N32 | MAP octave = x2 frequency, 12 equal-ratio semitones, keys ~ log2 f; transposition invariance = scale invariance | 56 | ¶13: / תחום / מה מוכפל / מה נובע מ-(7) / /---/---/---/ / רעש ואות |
| N33 | MAP/OOM Richter: +1 = x10 amplitude, energy ~ amplitude^1.5 => x31.6 per unit, x1000 per 2 units | 56 | ¶13: / תחום / מה מוכפל / מה נובע מ-(7) / /---/---/---/ / רעש ואות |
| N34 | STR use a log scale when the quantity spans many orders of magnitude and ratios matter; senses are roughly logarithmic | 56 | ¶12: **איפה עוד זה עובד.** בכל מקום שבו "צעד שווה" פירושו כפל שוו |
| N35 | MAP number of digits of a number ~ its log | 57 | ¶13: / תחום / מה מוכפל / מה נובע מ-(7) / /---/---/---/ / רעש ואות |
| N36 | MAP Bode plots: log-log axes turn a cascade of systems into addition of lines | 57 | ¶13: / תחום / מה מוכפל / מה נובע מ-(7) / /---/---/---/ / רעש ואות |
| N37 | MAP information = log(number of possibilities); independent probabilities multiply => information adds | 57 | ¶13: / תחום / מה מוכפל / מה נובע מ-(7) / /---/---/---/ / רעש ואות |
| N38 | MAP isothermal gas work depends on volume ratio, not difference | 57 | ¶13: / תחום / מה מוכפל / מה נובע מ-(7) / /---/---/---/ / רעש ואות |
| N39 | MAP diode: voltage rises a fixed step per doubling of current => log circuits | 57 | ¶13: / תחום / מה מוכפל / מה נובע מ-(7) / /---/---/---/ / רעש ואות |
| N40 | MAP binary search: steps ~ log N; a 1000x bigger dictionary costs ~10 more steps | 57 | ¶13: / תחום / מה מוכפל / מה נובע מ-(7) / /---/---/---/ / רעש ואות |
