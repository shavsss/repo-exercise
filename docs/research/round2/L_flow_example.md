# L: worked flow of a real active lesson

**The lesson:** Gilua M0.1, lesson 2, "גאומטריה, מדידה והמספר הממשי" (K1:29–44, about 15.5 source pages). Source files: `round2/ruletest2/lesson_1.md` (6,282 Hebrew words, 89 depth units U1–U89, 25 of them key) and `plan.json`. Every unit has a one-line `text` and a question `q`, and these are what the flow uses as the collapsed form and the hidden key.

**Notation**
- ⏱ gives seconds as **fast path / slow path**.
- Reading time assumes 145 wpm, the R8 mode.
- **✓ב** means right and sure; **✓ל** means right but unsure; **✗** means wrong (or "don't know").
- **Collapse** means the unit's text is replaced by a 1–2 line confirmation (about 25 words), with "הצג את ההסבר המלא" one click away. **Skim** means the unit shows only its one-line `text` (about 12 words), also with the full text one click away.
- **Key** is the hidden answer key that the app or the grader sees and the learner does not.
- Answer widgets:
  - **[בחירה]**: multiple choice, graded in the page.
  - **[מספר]**: a number with a tolerance, graded in the page.
  - **[שורה]**: one written line, graded by Haiku against the key and rubric in 2–4 s.
  - **[צעד]**: a blank step in a derivation; same grader.
- Every commit also asks for confidence with three buttons: **"מנחש" / "די בטוח" / "בטוח"**. "בטוח" is required for a collapse.

---

## Screen 0: opening (about 4 min)

### 0.1 Retrieval from lesson 1
Two cards, typed answers, no text visible.
⏱ 90 / 120

> **מהשיעור הקודם, בלי להציץ:**
> 1. בשורה אחת: מה האפס עושה בייצוג מיקומי, ומה היה קורה בלעדיו? [שורה]
> 2. "מיליון" ו"מספר מדומה" נוצרו לפני שהיה בהם צורך מעשי. מה זה מלמד על הדרך שבה מושג מתמטי נולד? [שורה]

- **Key:** (1) It holds an empty place, so that 205 ≠ 25 and each string of digits has exactly one value. (2) Abstraction runs ahead of practice: a concept is built from inner logic and finds its use later.
- **Feedback:** one line per item. For example, ✓: "נכון: מקום ריק, ולכן ייצוג חד-ערכי." ✗: "חסר: בלי אפס 205 ו-25 נכתבים אותו דבר."
- **Log:** both results go to the SRS states of lesson 1. A miss there reschedules that item for tomorrow and does not interrupt this lesson.

### 0.2 The story, shortened, and the thread question
The `story` block (A4 paper) appears whole; it is short, about 90 words.

> **לפני שממשיכים:** גיליון שחציו דומה לו. מה יחס הצלעות? [מספר, ±0.01] + ביטחון

- **Key:** √2 ≈ 1.414 (U1).
- **✓ב:** "נכון: $r=2/r$ ⇒ $r^2=2$." The U1–U2 paragraph collapses to its confirmation line; the A4/A0/A5 numbers stay visible, since they are one line.
- **✗:** U1 opens with a one-line derivation of $r=2/r$.

⏱ 35 / 50

### 0.3 Three pre-questions on the lesson's central results
These are pretests: errors are expected and nothing is explained yet. The screen says: "טעות כאן לא עולה כלום; זה מכין את הקריאה."

> **שאלת החוט:** אם רק נקטין את היחידה מספיק, האם תמיד יש זוג שלמים שיחסם הוא בדיוק יחס האלכסון לצלע? [בחירה: כן / לא / תלוי במכשיר] + ביטחון
>
> **ש-2:** מכשיר מדויק עד $10^{-9}$. האם מדידה כזאת יכולה להראות שהיחס אינו שבר? [בחירה, אפשרויות (א)–(ד) של ה-think במקור]
>
> **ש-3:** מחברים מיליון מספרים אקראיים בין 0 ל-1, כל אחד קטוע ל-6 ספרות. השגיאה בסכום, בערך? [בחירה: $10^{-6}$ / $3\cdot10^{-4}$ / 0.5 / 2]

- **Keys:** no (R1, U34); (ג) (U36); 0.5 (U61).
- **Feedback** is shown at the end of the screen, without the answer and without explanation: "שמרנו את התשובות. נחזור לכל אחת במקום שבו השיעור עונה עליה."
- **Branch:**
  - If Q2 is ✓ב, the think at U36 is not asked again; U36 collapses when reached, with the line "ענית נכון בפתיחה: (ג)".
  - If Q3 is ✓ב, the "predict" step of the POE at screen 3.4 is skipped.
  - Q1 is never used to skip anything. It is the thread question and is answered again at the end (screen 5.2).

⏱ 100 / 120

---

## Screen 1: "צורה בלי חומר" (U3–U21, 1,066 words)

### 1.1 Section gate (two items before the text)

> **ש-1:** בכתובות אדפו שטח מרובע = ממוצע זוג צלעות נגדיות × ממוצע הזוג השני. מעוין שצלעו 10 וזוויתו 60°: מה נותן הכלל, ומה השטח האמיתי? [מספר, שני ערכים] + ביטחון
>
> **ש-2:** בשורה אחת: למה גאומטריה לא יכולה להיות מדע ניסויי כמו כימיה? [שורה] + ביטחון

- **Key 1:** 100 against 86.6 (U9). The hidden assumption is right angles.
- **Key 2:** "There is no experiment on a line without width; only inference from inference" (U10). Rubric: must mention the ideal object.
- **Both ✓ב → skim mode for the section.** All non-key units (U3–U8, U11–U15, U19–U21, roughly 800 words) appear as one-line chips. A chip looks like this:
  > ▸ **גוף גאומטרי:** גוף ממשי שנשארו בו רק צורה ומידות. ‏[הצג]

  The two definition blocks (U3–U4, U19, U21) remain as compact `definition` blocks, title plus first line, and open fully on click. Key units U9, U16 and U18 are still taught as usual (below).
- **Otherwise,** the section is read as written. A unit whose gate item was ✓ב (U9, or U10–U11) collapses to its confirmation line, and its satellites (U7–U8 and U12–U13) collapse too.
- **✗ on Q1:** U9 opens with one extra line: "הכלל מניח זוויות ישרות. במעוין: $\tfrac{10+10}{2}\cdot\tfrac{10+10}{2}=100$, אבל השטח $10\cdot10\cdot\sin60°=86.6$."

⏱ gate 136 / 150; section reading in skim mode ≈ 3 min, in full mode ≈ 6.5 min.

### 1.2 Fedorov: a hard point with a "your step" gap
The `[[K1:33]]` paragraph is shown in full. Before the "על מה המספר נשען" paragraph:

> **צפו:** אילו סדרי סיבוב אפשריים בסריג מחזורי? [בחירה מרובה: 1, 2, 3, 4, 5, 6, 8] + ביטחון

- **Key:** {1, 2, 3, 4, 6} (U16).
- **✓ב:** U15 and U16 collapse to "נכון. הסיבה בשורה: העקבה $2\cos\theta$ חייבת להיות שלמה." The full explanation is one click away.
- **✗ (usually because 5 or 8 was ticked):** the text opens, followed by a step:

> **הצעד שלך:** סובבו נקודת סריג $B$ סביב $A$ ב-72°, ואת $A$ סביב $B$ ב-72°−. המרחק בין הנקודות החדשות הוא $a\,|1-2\cos\theta|$. הציבו θ=72°: [מספר, ±0.01]. ומה הסתירה? [שורה]

- **Key:** 0.382a, which is less than the minimum distance a (U17).
- **Hint ladder** if the step is ✗:
  1. $\cos72°\approx0.309$.
  2. $1-0.618$.
  3. The full answer.

  The rung used is logged.

⏱ ✓ב 35 / ✗ 35 + 90 = 125

### 1.3 Shechtman
Asked only if 1.2 was not ✓ב (adaptive density).

> **מה נשבר ב-1982?** [בחירה: המשפט על הסריג / ההנחה שכל מוצק מסודר הוא מחזורי / מדידת העקיפה]

- **Key:** the assumption (U18).

⏱ 0 / 30

---

## Screen 2: "האלכסון והצלע" (R1, U22–U45, 1,571 words)

### 2.1 Definition, read in full
The `definition` block is not collapsed in a first encounter. Rule 5א stays.
⏱ ~60 s reading

### 2.2 Before the proof: an existing think, now a commit

> ההוכחה תתחיל ב"נניח ש-$b/a=p/q$, שבר מצומצם". על מה נשען "אפשר לקחת אותו מצומצם"? [בחירה (א)–(ד)] + ביטחון

- **Key:** (ב), well-ordering (U31).
- **✓ב:** "נכון: מכנה קטן ביותר." The U29–U30 paragraph collapses to the line "פיתגורס: $b^2=2a^2$; הנחה: מישור אוקלידי."
- **✓ל:** the same confirmation, plus the full sentence about well-ordering.
- **✗ (usually (א)):** "לא דרוש פירוק יחיד: מבין כל השברים השווים בוחרים את בעל המכנה הקטן ביותר; זו תכונת הסדר הטוב." The "על מה זה באמת נשען" paragraph (U37) is marked "חשוב לך" and opened.

⏱ 48 / 60

### 2.3 The derivation with a faded step
The `derivation` block is shown with step 4 blank:

> צעד 3: מ-$(p/q)^2=2$ נקבל $p^2=2q^2$, ולכן $p^2$ זוגי.
> **צעד 4 (שלכם):** למה מכאן $p$ עצמו זוגי? שורה אחת. [צעד]
> צעד 5: …

- **Key:** "The square of an odd number is odd: $(2m+1)^2=4m^2+4m+1$" (U32).
- **✓:** step 4 is revealed with the line "בדיוק." Steps 5–6 follow.
- **✗:** a Socratic dialogue begins. This is hard point #1 of 2, reached by about 60% of those who answered ✗:
  > **המורה:** נניח ש-$p$ אי-זוגי. איך נכתוב אותו? ← **לומד:** $2m+1$ ← **המורה:** מה הריבוע שלו, זוגי או לא? ← **לומד:** … ← **המורה:** אז אם $p^2$ זוגי, מה זה אומר על $p$?

  The dialogue has at most 4 short turns. The main model is grounded in the derivation text and the key, and never gives the step before the second turn.

⏱ ✓ 98 / ✗ 98 + 180

### 2.4 The bound (2), as a prediction

> **לפני הנוסחה:** שבר עם מכנה 1000. עד כמה קרוב ל-√2 הוא יכול להגיע, לכל היותר? [סדר גודל: $10^{-3}$ / $10^{-5}$ / $10^{-7}$ / בלי גבול] + ביטחון

- **Key:** $\sim3.5\cdot10^{-7}$ (U35). This is exercise 1, moved into the flow.
- **✓ב:** the `formula` block (2) is shown in full, because a key formula is never collapsed. The "הקריאה הכמותית" paragraph and the anchors paragraph (U39) collapse.
- **✗:** the text opens, plus one step: "$|p^2-2q^2|\ge1$, ולכן השגיאה לפחות $1/(q^2\cdot2.83)$."

⏱ 53 / 60

### 2.5 Measurement does not decide (U36)
- If the opening Q2 was ✓ב: collapsed, "ענית נכון בפתיחה: אף מספר סופי של ספרות."
- Otherwise the same think is asked again (post-question): ⏱ 0 / 38.

### 2.6 Spotting the error (U43)

> מהנדס כותב בקוד: `if x*x == 2: print("x הוא שורש 2")`. מה לא בסדר, ומה הבדיקה הנכונה? [שורה] + ביטחון

- **Key:** "Every float is rational, so the square is never 2 (by (1)); check $|x^2-2|<\varepsilon$."
- **✓ב:** the `[[2.5: ביקורת]]` paragraph collapses.
- **✗:** the paragraph opens.

⏱ 53 / 60

### 2.7 History, YBC, Eudoxus
Read; for the fast path, in skim mode.
- Fast path: the `casestudy` block (U44) stays whole, because a case is always read. The Eudoxus paragraph (U41) and U40 are kept as text (≈ 2 min).
- Slow path: everything (≈ 4 min).

### 2.8 Contrast case: two blinkers (domain)
Asked only if 2.6 was not ✓ב, or on the slow path.

> **מפו בעצמכם:** שני פנסים במחזורים $T_1,T_2$. מה מקביל ל-$a$, ל-$b$ ול-$e$ שבהגדרה, ומתי הם חוזרים לסנכרון? [שורה]

- **Key:** the periods are the segments; the common time is $e$; they resynchronize only if $T_2/T_1$ is rational (U45).
- After the commit the `domain` block is shown in full, as the corrected map.

⏱ 0 / 68

### 2.9 The mils trade-off (U42)
Slow path only.

> 6400 או 6000 אלפיות: מה כל בחירה מרוויחה ומשלמת? [שורה]

⏱ 0 / 48

---

## Screen 3: "המספר הממשי: מדידה שלא נגמרת" (R2, U46–U78, 2,680 words)

This is the densest section and is never skimmed by a gate. Only its probes collapse anything.

### 3.1 The measurement as a run, before the derivation

> הצלע היא היחידה. הריצו בראש את תהליך המדידה על האלכסון: מה $n_0$ ושתי הספרות הבאות? וכמה ביטים שווה ספרה עשרונית? [מספר ×2] + ביטחון

- **Key:** 1.41; ≈ 3.32 (U52–U53).
- **✓ב:** after the derivation, which is always shown, the "תוצאת המדידה" example and the bits paragraph collapse.

⏱ 53 / 60

### 3.2 Hard point #2: adding infinite fractions (U59)
An existing think:

> $0.333\ldots+0.666\ldots$. מה אפשר לקבוע מן הקטיעות לבדן על הספרה השלמה של הסכום? [בחירה (א)–(ד)] + ביטחון

- **Key:** (ג).
- **✓ב:** U58 and U59 collapse.
- **✗:** a Socratic dialogue of at most 4 turns:
  > **המורה:** קטעו בשלוש ספרות. מה הסכום? ← $0.999$ ← **המורה:** והסכום האמיתי נמצא בין? ← … ← **המורה:** האם הקטע הזה מכיל מספרים משני צדי 1?

⏱ ✓ 38 / ✗ 38 + 180

### 3.3 The hidden assumption (U60)
Read in full; it is a 2.5 "assumption" unit. ≈ 30 s.

### 3.4 Predict–observe–explain with the chart (U61)
1. **Predict.** This step is skipped if the opening Q3 was ✓ב.
   > אחרי $N=10{,}000$ חיבורים: פי כמה שגיאת הקטיעה גדולה משגיאת העיגול? [מספר, סדר גודל] + ביטחון
2. **Observe.** The `chart` block opens with an $N$ slider, and the learner drags it.
3. **Explain.**
   > **שורה אחת:** למה היחס עצמו גדל עם $N$? [שורה]

   - **Key:** ≈ 170, because $\sqrt{3N}$; truncation is systematic, $\propto N$, while rounding cancels, $\propto\sqrt N$.
   - **✓ב:** the "שגיאה שיטתית מול אקראית" paragraph and the Vancouver case shrink to 2 lines, and U62 (multiplication) collapses.

⏱ fast (prediction skipped) 73 / slow 118

### 3.5 Continuity (5)
The formula is always shown.

> באיזו מערכת מספרים (5) נכשלת? תנו זוג סדרות. [שורה] + ביטחון

- **Key:** the rationals; truncations of √2 against truncation + $10^{-n}$ (U66).
- **✓ב:** U63, U65 and U66 collapse.
- **Never collapsed:** the Euclid I.1 paragraph (U67) is a key assumption unit with no probe of its own.

⏱ 68 / 68

### 3.6 Limits: Knudsen and fluctuations (U70–U73)
Asked only if 3.5 was not ✓ב.

> אמדו בראש: $Kn$ לכנף של 10 מ' בגובה פני הים ($\lambda\approx65$ ננומטר). [סדר גודל]

⏱ 0 / 53

### 3.7 float32 (U74–U75)
Asked only if the previous probe was not ✓ב.

> מונה זמן ב-float32, מוסיפים 0.1 בכל טיק. מתי הוא נעצר לגמרי? [בחירה: אף פעם / כ-24 ימים / כ-10 שנים]

⏱ 0 / 53

### 3.8 Patriot: number (U76), then why (U77)

> **מספר:** 0.1 נמוך ב-$9.5\cdot10^{-8}$ ש'. שגיאת השעון אחרי 100 שעות? [בחירה (א)–(ד)] + ביטחון
> **ואז, אחרי ה-casestudy עד "הפער":** למה התיקון החלקי של התוכנה **החמיר** את המצב? שורה אחת. [שורה] + ביטחון

- **Keys:** 0.34 s (U76). For U77: the gate uses a difference of two times; with the same conversion the error cancels; the partial fix made one time accurate and the other not.
- **✓ב on the "why":** "המנגנון" collapses to 2 lines, and the `domain` block about the register (U78) collapses to its title and its "where it breaks" line.
- **✗ on the "why":** this hard point may be used if a dialogue slot is left:
  > **המורה:** מה השער צריך, זמן או הפרש זמנים? ← … ← **המורה:** אם שני הזמנים טועים באותו סכום, מה קורה להפרש?

⏱ 53 + 83 = 136 / 136 + (180 if needed)

### 3.9 Without a probe
The `today`, `fieldmap` and `erratum` blocks are compact: one line each, opening on click. Their text is counted as read on the fast path too.

---

## Screen 4: "הבדיד והרציף" (U79–U89, 625 words)

### 4.1 Section gate

> טוריצ'לי: מלבן $a\times2a$, אלכסון, קווים אופקיים במשולש העליון ואנכיים בתחתון, זוג לכל נקודה. איזו הנחה של "סכום הקווים" נשברת? [שורה] + ביטחון

- **Key:** that lines without width contribute area in proportion to their count; the spacings differ by a factor of 2 (U82).
- **✓ב:** skim mode for U79–U81 and U83–U86. U85 (a critique) stays visible as one line.
- Slow path, or when 4.1 was ✗, adds:
  > מה עושה כפל ב-$i$ לנקודה $(a,b)$? [בחירה]

  - **Key:** a rotation of 90° (U88).

⏱ 68 / 96; reading: skim ≈ 1.5 min, full ≈ 4.5 min.

---

## Screen 5: closing (about 7 min fast, 12 min slow)

### 5.1 The keep card with blanks (retrieval before the summary)
The `keep` block appears with 2 blanks, chosen from units that were ✗ or ✓ל in this session. If there are none, the defaults are (2) and (5):

> - **חסם הקירוב:** $|p/q-\sqrt2|\ge$ ____ (2)
> - **רציפות:** $a_n$ לא יורדת, $b_n$ לא עולה, $a_n<b_n$ ⇒ ____ (5); נכון ב-____, לא ב-____.

Then the full card is shown. ⏱ 120 / 150

### 5.2 Teach-back: answering the thread question in two sentences

> **בשתי שורות, כאילו לעמית:** בתחילת השיעור עניתם "___" על שאלת החוט. מה התשובה עכשיו, ולמה מדידה לא הייתה מכריעה אותה?

- **Rubric (Haiku):**
  1. "No."
  2. Proof by parity / well-ordering.
  3. Measurement returns an interval with fractions in it.
- **Feedback:** one line naming which of the 3 points is missing. If the pretest answer was "yes" and the answer now is "no", the screen notes "שינית את דעתך; טוב."

⏱ 90 / 120

### 5.3 One exercise
The rest go to the queue.
- Fast path: exercise 2 (float32, spot the error).
- Slow path: exercise 1 (the bound with $q=1000$, an estimate), with the hint ladder.

⏱ 240 / 480

### 5.4 Scheduling
The screen proposes 3 items for review:
- every key ✗;
- every ✓ל;
- if neither exists: U34, U61 and U77.

The learner can tap to swap one. ⏱ 15 / 15

### 5.5 Log
Written silently: `profile/commits/M0.1__2`.
- **For every commit:** `{unit, kind, answer, confidence, verdict, rung, ms}`.
- **For every collapsed unit:** `{unit, collapsed: true, expanded: bool}`.

A collapsed unit enters the queue with a **shortened** first interval, 3 days instead of 7. The collapse is checked again, closed-book, before it counts as known.

---

## Time totals for this lesson (one pass of the script)

| Step | Fast (strong, ✓ב on most) | Slow (struggling) |
|---|---|---|
| Opening 0.1–0.3 | 3.8 min | 4.8 |
| Screen 1, probes + reading | 2.8 + 3.0 (skim) | 5.1 + 6.5 |
| Screen 2, probes + reading | 4.3 + 6.5 | 9.2 + 10.8 |
| Screen 3, probes + reading | 4.6 + 12.0 | 13.1 + 18.5 |
| Screen 4, probes + reading | 1.1 + 1.5 (skim) | 1.6 + 4.5 |
| Closing | 7.8 | 12.8 |
| **Total** | **≈ 47 min** (scripted best case) | **≈ 87 min** |
| Words read | ≈ 3,900 of 6,282 | ≈ 6,500 (with expansions) |
| Active moments | 22 | 30 + 2 dialogues |

Reference points for the same lesson:
- **Plain reading:** ≈ 44 min, 2.85 min/page, 5 click-through thinks.
- **Read, then separate active work and dialogue** (R8's priced model): ≈ 81 min, 5.2 min/page.

The Monte Carlo model in `L_active_lesson.md` §5 spreads these: fast ≈ 62 min median (55–71), slow ≈ 80 (72–89).
