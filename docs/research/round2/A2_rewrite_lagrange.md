# A2 rewrite 2: the extremum / Lagrange section of Gilua M0.1 L3

**Source:** Gilua M0.1 lesson 3, section "בעיות קיצון: המכל שצורך הכי מעט פח" (blocks 131–148, 18 blocks, of which the `scene3d` and the `chart` are interactive payload and are kept unchanged).
**Checklist:** 43 depth units, E1–E43 (`A2_units.json` → `rewrite_checklists.lagrange`). Source with unit markers: `A2_src/lagrange_v2.md`. The audit script is `A2_audit.py lagrange v2`.

## Result

| | original | v1 | v2 (final) |
|---|---|---|---|
| prose words (without the scene and chart JSON) | 1,692 | 1,142 | **1,167** |
| ratio to original | 1.00 | 0.675 | **0.690** |
| ratio, without the `keep` block | – | 0.639 | 0.662 |
| depth units kept | 43/43 | 43/43 (one partly) | **43/43** |
| words per depth unit | 39.3 | 26.6 | **27.1** |
| sentences, mean words / share under 8 words | 12.6 / 23% | – | 14.4 / 19% |

This was already the densest section of the lesson (77% core words, against 50% for the lesson as a whole), so the gain is smaller than in the Napier section. The words were saved by:
- removing the page narration ("היישום השלישי ב-K1:62 הוא החלק שבו נתעמק", 40% of block 131);
- removing the figure walk-through ("באיור רואים גליל 'ריבועי'...");
- removing announcements ("ולכן נגזור את השיטה הכללית... השיטה תחזור בצומת האופטימיזציה...");
- removing the repeated "we skipped the algebra" notes and the "המספרים מפתיעים" lead-ins;
- moving the generalisations into one mapping table.

## v1 → v2 audit
- Marker audit: all 43 markers were present in v1.
- Number-fidelity audit: it found a real partial loss in **E16**. The mental route to the *area*, $6\pi r^2=1.5\pi d^2\approx4.7\times1.17\approx5.5$ m², had been dropped, and only the route to the diameter was left. Restored in v2.
- The audit also flagged the gradient numbers $\nabla S=(13.62,3.405)$ and $\nabla V=(3.69,0.923)$. They are illustration, not a unit, but they are the only place where $\lambda$ becomes a number you can see. Restored as one sentence.
- Content audit: v1 dropped the link to the learner's own note ("נקודה 2 בחידוד הלוגי"). It is not a depth unit, but it ties the critique to his article work. It is the kind of personal hook that keeps a dense text engaging, so it was restored (+28 words).
- The `keep` block was cut from 5 lines to 3.
- Net result: +25 words. v2 is slightly *longer* than v1, by choice: the one unit that was partly lost and the one personal hook are worth more than 2% of length.

## Final text (v2)

## בעיות קיצון עם אילוץ: המכל שצורך הכי מעט פח

**השאלה.** מכל גלילי סגור בנפח נתון: איזו צורה צורכת הכי מעט פח? מכל נמוך ורחב משלם על התחתית והמכסה, מכל גבוה וצר משלם על הדופן, ולכן יש ביניהם מינימום. התשובה המוכרת: הגובה שווה לקוטר. החידוש לעומת "בשיא המשיק אופקי": יש שני משתנים, $r$ ו-$h$, והם אינם חופשיים, כי הנפח קבוע.

**דרך ההצבה, ולמה היא לא מספיקה.** מחלצים $h=V/(\pi r^2)$ ומציבים: $S(r)=2\pi r^2+2V/r$. איפוס הנגזרת, $4\pi r-2V/r^2=0$, נותן $V=2\pi r^3$, ומכיוון ש-$V=\pi r^2h$, ‏$h=2r=d$. זה עובד רק כשאפשר לחלץ משתנה מהאילוץ. במסלולים, ברובוטים ובתכנון מערכות לרוב אי אפשר, ולכן צריך שיטה כללית.

```definition
@title: נגזרת חלקית וגרדיאנט
לפונקציה של שני משתנים $S(r,h)$, הנגזרת החלקית $\partial S/\partial r$ היא הנגזרת לפי $r$ כש-$h$ מוחזק קבוע, ו-$\partial S/\partial h$ להפך. הגרדיאנט $\nabla S=(\partial S/\partial r,\ \partial S/\partial h)$ הוא חץ שמצביע לכיוון שבו $S$ עולה הכי מהר, והוא ניצב לקווי הגובה של $S$, כי לאורכם $S$ אינו משתנה.
```

```think
בנקודת המינימום על עקומת האילוץ $V=V_0$: מה הזווית בין $\nabla S$ לבין העקומה? התחייבו לתשובה לפני שתפתחו.
---
90°. אילו היה ל-$\nabla S$ רכיב לאורך העקומה, תזוזה קטנה בכיוון ההפוך הייתה מקטינה את $S$ בלי לשבור את האילוץ.
```

```derivation
@title: כופלי לגרנז' על המכל
נקודת מוצא: ממזערים $S=2\pi r^2+2\pi rh$ (תחתית, מכסה ודופן) בתנאי $V=\pi r^2h=V_0$.
צעד 1: $\partial S/\partial r=4\pi r+2\pi h$ ו-$\partial S/\partial h=2\pi r$.
צעד 2, **ההנחה** ($S$ ו-$V$ חלקות, ובודקים בסדר ראשון): במינימום, תזוזה קטנה לאורך האילוץ אינה משנה את $S$, ולכן $\nabla S$ ניצב לעקומת האילוץ. גם $\nabla V$ ניצב לה, כי היא קו גובה של $V$. שני חצים במישור שניצבים לאותו כיוון הם מקבילים:
$$\nabla S=\lambda\,\nabla V\tag{28}$$
צעד 3, הניסוח המכני: $\mathcal L(r,h,\lambda)=S-\lambda(V-V_0)$. איפוס הנגזרות לפי $r$ ו-$h$ נותן את (28), ואיפוס לפי $\lambda$ נותן את האילוץ.
צעד 4: לפי $h$: $2\pi r-\lambda\pi r^2=0$, ולכן $\lambda=2/r$. לפי $r$: $4\pi r+2\pi h-\lambda\cdot2\pi rh=0$, כלומר $4\pi r=2\pi h$ ו-$h=2r=d$. האילוץ קובע את הגודל: $V_0=2\pi r^3$.
```

```formula
@title: המכל הגלילי האופטימלי
$$h=d,\quad r=\Big(\frac V{2\pi}\Big)^{1/3},\quad S_{\min}=6\pi r^2,\quad \lambda=\frac{dS_{\min}}{dV}=\frac2r=\frac23\,\frac{S_{\min}}V\tag{29}$$
 תקף לגליל סגור, כשלכל מ"ר של תחתית, מכסה ודופן אותו מחיר ואותו עובי, וכשרק השטח נספר.
```

**מה $\lambda$ אומר.** $\lambda$ הוא **מחיר הצל** של האילוץ: כמה מ"ר פח עולה עוד מ"ק של נפח. מ-(29), $S_{\min}\propto V^{2/3}$, ולכן הכפלת הנפח מגדילה את השטח רק פי $2^{2/3}=1.59$. ב-1 מ"ק זה 3.69 מ"ר לכל מ"ק נוסף. הצורה עצמה נקבעת באיזון בין מחיר הקצוות, שגדל כמו $r^2$, לבין מחיר הדופן, שגדל כמו $rh$. במספרים, ב-1 מ"ק: $\nabla S=(13.62,\,3.405)$ ו-$\nabla V=(3.69,\,0.923)$, והיחס בשני הרכיבים הוא $\lambda=3.69$. בסצנה, במבט מלמעלה, רואים את (28): קו הגובה $S=S_{\min}$ **נוגע** בעקומת הנפח ואינו חוצה אותה. אילו חצה אותה, היה קטע של העקומה שבו המכל זול יותר. בכל מכל אופטימלי $\nabla S\propto(4,1)$, ושינוי של $V$ רק מחליק את הנקודה לאורך הישר $h=2r$: אותה צורה בכל קנה מידה.

**עוגנים לזכור.** מכל של 1 מ"ק: $r=0.542$ מ', $d=h=1.084$ מ', $S=5.54$ מ"ר. בראש: גליל עם $h=d=1$ מ' מכיל $\pi/4\approx0.79$ מ"ק, ולכן מגדילים אותו פי $(1/0.79)^{1/3}\approx1.08$, והשטח הוא $6\pi r^2=1.5\pi d^2\approx4.7\times1.17\approx5.5$ מ"ר. לקוביה של 1 מ"ק יש 6 מ"ר (יותר ב-8%), ולכדור 4.84 מ"ר, פי 0.874 מהגליל: הגליל הטוב ביותר גרוע מהכדור בכ-14%, וזה המשפט האיזופרימטרי של היוונים. ובכל זאת בונים גליל, כי אפשר לגלגל אותו מפח ולהעמיד אותו על הרצפה.

```think
נחשו לפני החישוב: מכל עם $h/d=1.5$ במקום 1. בכמה יגדל השטח? 1%, 10% או 30%?
---
ב-1.75% בלבד. הסיבה בפסקה הבאה.
```

**המינימום השטוח.** נסמן $\kappa=h/d$. בנפח קבוע
$$\frac S{S_{\min}}=\frac{\kappa^{-2/3}(1+2\kappa)}3\approx1+\frac{(\kappa-1)^2}9\tag{30}$$
(הנגזרת השנייה של הלוגריתם של אגף שמאל ב-$\kappa=1$ היא $2/9$). ב-$\kappa=1.1$ התוספת היא 0.10%, ב-1.5 היא 1.75%, ב-2 היא 5.0% וב-0.5 היא 5.8%. זה נכון לכל מינימום חלק: הנגזרת הראשונה מתאפסת, ולכן הסטייה הראשונה שנשארת ריבועית. **ליד אופטימום אי אפשר להפסיד הרבה, ואי אפשר להרוויח הרבה מדיוק נוסף.** כך גם בתותח: 30° במקום 45° עלו רק 13% מהטווח. לכן הגבול האמיתי של (29) הוא ההנחות שלו: הנחה שנשברת מזיזה את האופטימום עצמו, לא רק את המחיר סביבו.

**אותו מבנה במקומות אחרים.**

| תחום | המקבילה |
|---|---|
| בקרה, למידה ומיקום | ליד כל מינימום חלק המחיר הוא קערה ריבועית, $\tfrac12ax^2$ של (13): בכיול של בקר, באימון בריבוע השגיאה ובנקודה הקרובה ביותר לשלושה מעגלי מדידה |
| כלכלה ותכנון | מחיר מינימלי תחת תקציב הוא נקודת המגע של קו שווה-מחיר בקו התקציב, ו-$\lambda$ הוא השווי של יחידת תקציב נוספת |
| תרמודינמיקה | הטמפרטורה מתבררת ככופל לגרנז' כזה, בגשר התרמודינמיקה |

```think
כל מ"ר של תחתית ומכסה עולה פי $k$ ממ"ר של דופן. נחשו לאן תזוז הצורה האופטימלית, ואז גזרו לפי צעד 4.
---
$\lambda=2/r$ לא משתנה. לפי $r$: $4\pi kr+2\pi h-4\pi h=0$, ולכן $h=2kr$:
$$\frac hd=k\tag{31}$$
הצורה חושפת את יחס המחירים: קצוות יקרים נותנים מכל גבוה וצר, ורצפה בחינם נותנת מכל שטוח. אם הקצוות יקרים פי 2 ובכל זאת בונים $h=d$, משלמים 5.8% יותר.
```

**פחית משקה: פשרה, לא טעות.** לפחית של 355 מ"ל יש קוטר של כ-66 מ"מ וגובה של כ-122 מ"מ, כלומר $h/d\approx1.85$ [[ודאות: בינונית]]. לפי (29) היא "צריכה" להיות 76.7 מ"מ על 76.7. אבל המכסה והתחתית עבים פי כמה מהדופן (כעשירית מ"מ) ועשויים מסגסוגת קשה יותר, כי הם נושאים את לחץ הגז ואת הפותחן. זה $k\approx2$, ולפי (31) $h/d\approx2$, קרוב למדוד. גליל אידאלי בקוטר 66.2 מ"מ שמכיל 355 מ"ל גבוה 103 מ"מ ($h/d=1.56$; שאר הגובה הוא הצוואר, הקמרון שבתחתית ומרווח האוויר), ושטחו גדול רק ב-2.1% מהאופטימום. מול 2% האלה עומדים אחיזה ביד, מכונות מילוי ומכונות מכירה שבנויות לקוטר אחד, ומקום על המדף. פונקציית המחיר האמיתית סופרת גם אותם.

**מכל אגירה גדול: כשהעובי תלוי בעומק.** **הנחה חדשה:** הדופן נושאת את לחץ המים, ולכן העובי שלה בעומק $z$ הוא $\rho gzr/\sigma$, כאשר $\sigma$ הוא המאמץ המותר בפלדה. אינטגרל על הגובה והצבת האילוץ נותנים כמות פלדה של $V\,(2t_{\min}/h+\rho gh/\sigma)$, כש-$t_{\min}$ הוא העובי המינימלי של התחתית והגג. איפוס הנגזרת לפי $h$:
$$h_{\text{opt}}=\sqrt{\frac{2t_{\min}\sigma}{\rho g}}\tag{32}$$
**הגובה האופטימלי אינו תלוי בנפח**. עם $t_{\min}=6$ מ"מ ו-$\sigma=160$ MPa [[היפותטי]] מתקבלים 14.0 מ' למים ו-15.2 מ' לנפט. ואכן מכלי דלק גדולים הם בגובה של כ-15–20 מ', וגדלים בקוטר עד עשרות מטרים [[ודאות: בינונית]]. המודל מתעלם מרוח, מרעידות אדמה, מהיסודות וממחיר הקרקע.

**ביקורת: "גובה שווה לקוטר הוא הצורה האופטימלית".** שלוש בדיקות. *מה ממוזער?* (29) ממזערת שטח ולא עלות. כשמחירי הקצוות שונים, התשובה היא (31). *מקרי גבול:* רצפה בחינם (מכל על משטח בטון קיים) נותנת $h/d=\tfrac12$, ועובי שגדל עם העומק נותן את (32), מכל רחב מאוד. *שיפוע המחיר:* סטייה של 50% מ-$h=d$ עולה פחות משני אחוזים, ולכן מה שמכריע הוא האילוצים שמחוץ למודל. הניסוח הנכון: **"בגליל סגור שכל מ"ר שלו עולה אותו דבר, השטח מינימלי ב-$h=d$, והמינימום שטוח מאוד"**. ובמינימום שטוח, הנחה שגויה מזיזה את ההחלטה יותר מכל אי-דיוק במספרים. זו נקודה 2 ב"חידוד הלוגי" שבמחברת שלכם, על הנחות יסוד: המסקנה לא שגויה בהכרח, אבל בלי בדיקת ההנחה אין לה עוגן.

```keep
- $\nabla S=\lambda\nabla V$: קו שווה-מחיר נוגע באילוץ; $\lambda=dS_{\min}/dV$ הוא מחיר הצל.
- גליל סגור במחיר אחיד: $h=d$, $S_{\min}\propto V^{2/3}$; קצוות יקרים פי $k$: $h/d=k$; עובי לפי לחץ: $h_{\rm opt}=\sqrt{2t_{\min}\sigma/\rho g}$, בלי תלות בנפח.
- מינימום חלק שטוח ($h/d=1.5$ עולה 1.75%), ולכן ההנחות מכריעות, לא דיוק החישוב.
```

## Unit checklist (v2)

Paragraph indices count blank-line-separated blocks of `A2_src/lagrange_v2.md`.

| unit | content (from the coding) | original block | where in v2 (paragraph ¶, first words) |
|---|---|---|---|
| E1 | RES closed cylinder of given volume with least surface has h=d | 131 | ¶1: **השאלה.** מכל גלילי סגור בנפח נתון: איזו צורה צורכת הכי מעט |
| E2 | TRD why it is an optimisation: squat tank pays for ends, tall thin tank pays for wall | 133 | ¶1: **השאלה.** מכל גלילי סגור בנפח נתון: איזו צורה צורכת הכי מעט |
| E3 | STR new difficulty: two variables (r,h) tied by a constraint (V fixed) | 133 | ¶1: **השאלה.** מכל גלילי סגור בנפח נתון: איזו צורה צורכת הכי מעט |
| E4 | RES substitution method: h=V/(pi r^2), S(r)=2pi r^2+2V/r, S'=0 => V=2pi r^3 => h=2r | 134 | ¶2: **דרך ההצבה, ולמה היא לא מספיקה.** מחלצים $h=V/(\pi r^2)$ ומ |
| E5 | LIM substitution needs a solvable constraint; usually impossible (trajectories, robots, system design) -> Lagrange | 134 | ¶2: **דרך ההצבה, ולמה היא לא מספיקה.** מחלצים $h=V/(\pi r^2)$ ומ |
| E6 | DEF partial derivative (others held fixed): dS/dr=4pi r+2pi h, dS/dh=2pi r | 135 | ¶3: ```definition @title: נגזרת חלקית וגרדיאנט לפונקציה של שני מ |
| E7 | DEF gradient: points to steepest ascent, perpendicular to level curves | 135 | ¶3: ```definition @title: נגזרת חלקית וגרדיאנט לפונקציה של שני מ |
| E8 | STEP at constrained min a small move along the constraint leaves S unchanged to first order => grad S perp constraint; grad V perp constraint => grad S = lambda grad V | 135 | ¶5: ```derivation @title: כופלי לגרנז' על המכל נקודת מוצא: ממזער |
| E9 | DEF Lagrangian L=S-lambda(V-V0): stationarity in r,h gives (28), in lambda gives the constraint | 135 | ¶5: ```derivation @title: כופלי לגרנז' על המכל נקודת מוצא: ממזער |
| E10 | RES dL/dh => lambda=2/r; dL/dr => 4pi r+2pi h-4pi h=0 => h=2r; V0=2pi r^3 | 135 | ¶5: ```derivation @title: כופלי לגרנז' על המכל נקודת מוצא: ממזער |
| E11 | RES r=(V/2pi)^(1/3), S_min=6 pi r^2 | 136 | ¶6: ```formula @title: המכל הגלילי האופטימלי $$h=d,\quad r=\Big( |
| E12 | LIM valid for closed cylinder, same price and thickness per m2 everywhere, only area counted | 136 | ¶6: ```formula @title: המכל הגלילי האופטימלי $$h=d,\quad r=\Big( |
| E13 | STR lambda = shadow price = dS_min/dV: area cost of one more unit of volume | 137 | ¶7: **מה $\lambda$ אומר.** $\lambda$ הוא **מחיר הצל** של האילוץ: |
| E14 | RES/OOM S_min ~ V^(2/3): doubling V => x1.59 area; dS/dV=(2/3)S/V=2/r = 3.69 m2 per m3 at 1 m3 | 137 | ¶7: **מה $\lambda$ אומר.** $\lambda$ הוא **מחיר הצל** של האילוץ: |
| E15 | STR the shape is set by balancing end cost (~r^2) against wall cost (~rh) | 137 | ¶7: **מה $\lambda$ אומר.** $\lambda$ הוא **מחיר הצל** של האילוץ: |
| E16 | OOM 1 m3: r=0.542 m, d=h=1.084 m, S=5.54 m2; mental route: h=d=1 m holds pi/4=0.79 m3 -> scale by 1.08 | 138 | ¶8: **עוגנים לזכור.** מכל של 1 מ"ק: $r=0.542$ מ', $d=h=1.084$ מ' |
| E17 | OOM cube of 1 m3 = 6 m2 (+8%); sphere 4.84 m2 (0.874x); best cylinder ~14% worse than sphere (isoperimetric) | 138 | ¶8: **עוגנים לזכור.** מכל של 1 מ"ק: $r=0.542$ מ', $d=h=1.084$ מ' |
| E18 | PRX cylinder wins anyway: rolled sheet, stands on the floor | 138 | ¶8: **עוגנים לזכור.** מכל של 1 מ"ק: $r=0.542$ מ', $d=h=1.084$ מ' |
| E19 | STR at the optimum the level curve S=S_min TOUCHES the constraint curve; crossing would mean a cheaper tank exists | 140 | ¶7: **מה $\lambda$ אומר.** $\lambda$ הוא **מחיר הצל** של האילוץ: |
| E20 | STR grad S ~ (4,1) at every optimum; optimum slides along h=2r as V changes (scale invariance) | 140 | ¶7: **מה $\lambda$ אומר.** $\lambda$ הוא **מחיר הצל** של האילוץ: |
| E21 | RES shape penalty S/S_min = k^(-2/3)(1+2k)/3 ~ 1+(k-1)^2/9 with k=h/d (2nd log-derivative = 2/9) | 141 | ¶10: **המינימום השטוח.** נסמן $\kappa=h/d$. בנפח קבוע $$\frac S{S |
| E22 | OOM h/d 1.1 => +0.10%, 1.5 => +1.75%, 2 => +5.0%, 0.5 => +5.8% | 143 | ¶10: **המינימום השטוח.** נסמן $\kappa=h/d$. בנפח קבוע $$\frac S{S |
| E23 | STR smooth minimum: 1st derivative 0 => deviation is quadratic => near the optimum you cannot lose much nor gain much from precision (cannon: 30 deg loses 13%) | 143 | ¶10: **המינימום השטוח.** נסמן $\kappa=h/d$. בנפח קבוע $$\frac S{S |
| E24 | STR the real limit is the assumptions: breaking one moves the optimum itself, not just the cost around it | 143 | ¶10: **המינימום השטוח.** נסמן $\kappa=h/d$. בנפח קבוע $$\frac S{S |
| E25 | MAP near any smooth minimum the cost is a quadratic bowl (y=a x^2/2): control tuning, squared-error training, least-squares position fix | 144 | ¶12: / תחום / המקבילה / /---/---/ / בקרה, למידה ומיקום / ליד כל מ |
| E26 | MAP minimum cost under a budget = tangency of iso-cost and budget curves; lambda = value of one more budget unit | 144 | ¶12: / תחום / המקבילה / /---/---/ / בקרה, למידה ומיקום / ליד כל מ |
| E27 | MAP temperature is a Lagrange multiplier (thermo bridge) | 144 | ¶12: / תחום / המקבילה / /---/---/ / בקרה, למידה ומיקום / ליד כל מ |
| E28 | RES ends k times dearer per m2 => h/d=k (lambda=2/r unchanged; step 6 gives h=2kr) | 145 | ¶13: ```think כל מ"ר של תחתית ומכסה עולה פי $k$ ממ"ר של דופן. נחש |
| E29 | OOM ends 2x dearer but built with h=d => +5.8% | 145 | ¶13: ```think כל מ"ר של תחתית ומכסה עולה פי $k$ ממ"ר של דופן. נחש |
| E30 | STR the optimal shape reveals the price ratio: dear ends -> tall/narrow; free floor -> squat | 145 | ¶13: ```think כל מ"ר של תחתית ומכסה עולה פי $k$ ממ"ר של דופן. נחש |
| E31 | PRX 355 ml can: d~66 mm, h~122 mm, h/d~1.85; area-optimal would be d=h=76.7 mm | 146 | ¶14: **פחית משקה: פשרה, לא טעות.** לפחית של 355 מ"ל יש קוטר של כ- |
| E32 | PRX can ends are several times thicker and harder alloy (pressure, opening) => k~2 => h/d~2, close to 1.85 | 146 | ¶14: **פחית משקה: פשרה, לא טעות.** לפחית של 355 מ"ל יש קוטר של כ- |
| E33 | OOM ideal cylinder of d=66.2 mm holding 355 ml: h=103 mm (h/d 1.56), only +2.1% area; rest of height = neck, domed bottom, headspace | 146 | ¶14: **פחית משקה: פשרה, לא טעות.** לפחית של 355 מ"ל יש קוטר של כ- |
| E34 | TRD real cost function adds grip, filling and vending machines built for one diameter, shelf space | 146 | ¶14: **פחית משקה: פשרה, לא טעות.** לפחית של 355 מ"ל יש קוטר של כ- |
| E35 | STEP big tanks: wall thickness set by hoop stress = rho g z r / sigma (grows with depth and radius) | 147 | ¶15: **מכל אגירה גדול: כשהעובי תלוי בעומק.** **הנחה חדשה:** הדופן |
| E36 | RES steel volume = V(2 t_min/h + rho g h/sigma) (integral over height + constraint) | 147 | ¶15: **מכל אגירה גדול: כשהעובי תלוי בעומק.** **הנחה חדשה:** הדופן |
| E37 | RES h_opt = sqrt(2 t_min sigma/(rho g)) - independent of volume | 147 | ¶15: **מכל אגירה גדול: כשהעובי תלוי בעומק.** **הנחה חדשה:** הדופן |
| E38 | OOM t_min=6 mm, sigma=160 MPa => 14.0 m (water), 15.2 m (oil) | 147 | ¶15: **מכל אגירה גדול: כשהעובי תלוי בעומק.** **הנחה חדשה:** הדופן |
| E39 | PRX real large fuel tanks ~15-20 m tall, grow in diameter to tens of m | 147 | ¶15: **מכל אגירה גדול: כשהעובי תלוי בעומק.** **הנחה חדשה:** הדופן |
| E40 | LIM model ignores wind, earthquake, foundations, land cost | 147 | ¶15: **מכל אגירה גדול: כשהעובי תלוי בעומק.** **הנחה חדשה:** הדופן |
| E41 | CRT check "h=d is optimal": what is minimised (area vs cost -> (31)); limiting cases: free floor -> h/d=1/2; thickness ~ depth -> h/d<<1 | 148 | ¶16: **ביקורת: "גובה שווה לקוטר הוא הצורה האופטימלית".** שלוש בדי |
| E42 | STR flatness: +/-50% from h=d costs <2%, so constraints outside the model decide; correct statement: closed cylinder, equal price per m2 -> area min at h=d, very flat | 148 | ¶16: **ביקורת: "גובה שווה לקוטר הוא הצורה האופטימלית".** שלוש בדי |
| E43 | STR with a flat minimum a wrong assumption moves the decision more than numerical inaccuracy | 148 | ¶16: **ביקורת: "גובה שווה לקוטר הוא הצורה האופטימלית".** שלוש בדי |
