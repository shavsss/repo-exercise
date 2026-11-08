# A2: The depth-density experiment

*Where Gilua's length adds depth and where it does not, measured paragraph by paragraph, and a lesson format that keeps every depth unit in about half the words.*

## 0. Answer in five lines
1. **The learner is half right.** In Gilua L3 only **49.6%** of the prose words carry a new depth unit. In L1 the figure is **50.2%**. The rest is restatement, narration of the book, history colour, illustration, signposting and errata.
2. **Length does add depth in one place: the tutor's own level-2.5 work.** Derivations, `think` blocks, limits, critique and trade-offs run at 49–53 words per unit, with 68–78% core words. Length without depth comes from **following the book page by page**. Paragraphs anchored to a `[[K1:nn]]` page run at **109–152 words per unit**, with only 26–30% core words.
3. **The second cause is breadth, not padding.** L3 introduces **230** depth units, about 11 per book page. Even at a perfect density this lesson cannot be short.
4. **The rewrite experiment** covered two full sections of L3 and kept 100% of the coded units (40/40 and 43/43, checked by audit script):
   - the Napier section fell to **0.549** of its length (1,880 → 1,032 words);
   - the extremum/Lagrange section, which was already the densest part of the lesson, fell to **0.690** (1,692 → 1,167 words);
   - both converge on about **26 words per unit**, with an unchanged sentence-length profile, so the text is not telegraphic.
5. **Projection:** the same template applied to whole lessons gives about **0.44** of the length for L3 (15.8k → 6.9k words) and **0.41** for L1. Lanchester L1, which has a lot of scaffolding, comes to 0.30. The precondition is that the tutor plans **units, not pages**, and that an automatic check enforces it (§8).

## 1. The coding scheme (operational)

**Depth unit:** a distinct idea the learner could be tested on at level 2.5. A sentence carries a unit if removing it would make some exam question unanswerable. There are 11 types:

| code | type | test question it supports | example (L3) |
|---|---|---|---|
| DEF | definition | "define X" | Napier's log: $y'=c/x$ |
| RES | result / formula | "state / use X" | $y(kx)=y(x)+y(k)$ |
| STEP | derivation step that carries an assumption | "where does assumption A enter?" | P's speed = remaining distance → $1/x$ |
| LIM | limit / domain of validity | "when does X fail?" | slide rule has no 0 or negatives |
| OOM | order-of-magnitude anchor | "estimate X in your head" | $\log_{10}2\approx0.30$; ±50% of $h/d$ costs <2% |
| TRD | trade-off | "what do you pay for X?" | table (14 digits, paid once) vs slide rule (3 digits, fast) |
| MAP | cross-domain mapping | "where else does this structure appear?" | Bode plot: a cascade becomes a sum of lines |
| CRT | critique / error-catching | "what's wrong with this claim?" | "h=d is optimal": what is minimised? |
| OPS | operational meaning (Lanchester) | "so what for the operator?" | GPS sits 17.6 dB below thermal noise → a jammer starts with a huge advantage |
| PRX | practitioner fact | "what do real systems do?" | big fuel tanks are 15–20 m tall and grow in diameter |
| STR | structural / epistemic insight | "why does it work / what is the principle?" | the log measures ratios as distances (scale invariance) |

**Coding rules:**
- A unit is counted once, in the block that first introduces it. Later occurrences are coded as **restatement words**, not as units.
- A worked example counts as a unit only if it changes what the learner can do: it gives a number to remember, a limiting case, or another field. Otherwise it is *illus*.
- History counts only when the event *is* the idea: Napier had no instantaneous velocity (N8), NL does not obey (7) (N16), 3 digits sufficed for 300 years (N26). Otherwise it is *hist*.

**Word functions:** each block's words are split by percentage across 11 functions:
- **core**: carries a new unit;
- **illus**: confirms a unit already given;
- **restate**: recap, refresh, summary, or a re-told story;
- **narr**: narration of the book ("לפי K1:62…", "הטקסט נוקט עמדה");
- **hist**: colour;
- **meta**: signposting, previews, lesson-structure talk, plus inline `[[2.5:…]]` and `[[K1:nn]]` labels;
- **scaf**: below level 2.5 (school algebra, calculator keys, figure walk-throughs);
- **dup**: a figure, table or chart that repeats the prose;
- **err**: OCR errata;
- **payload**: scene, anim or notebook JSON (excluded from the prose ratios);
- **practice**: exercises.

**Hedge** words are measured automatically: `[[ודאות:…]]` and `[[היפותטי]]` tags.

Coded: every block of **Gilua M0.1 L3** (164 blocks) and **L1** (109), and **Lanchester M0.1 L1** (108) as the contrast. That is **462 depth units** in total. The data is in `A2_coding.py`, the unit list in `A2_units.json`, and the measurement in `A2_measure.py` → `A2_measure_out.json`.

## 2. Results

### 2.1 Lesson totals (prose = without interactive JSON)

| lesson | prose words | new units | words/unit | core words/unit | core | restate | narr | hist | illus | meta | err | scaf | practice | hedge |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Gilua L3 | 15,779 | 230 | **68.6** | 34.0 | **49.6%** | 10.8 | 9.3 | 8.0 | 7.1 | 6.3 | 2.6 | 1.8 | 3.2 | 0.4 |
| Gilua L1 | 12,418 | 148 | **83.9** | 42.1 | **50.2%** | 7.7 | 11.4 | 10.5 | 2.6 | 7.1 | 1.7 | 0.1 | 7.4 | 0.7 |
| Lanchester L1 | 9,921 | 84 | **118.1** | 50.5 | **42.8%** | 5.4 | 3.2 | 3.7 | 11.1 | 9.3 | 2.4 | **11.6** | 6.9 | 0.3 |

The two apps fail in different ways:
- **Gilua** loses words to the *book*: narration, history and restatement add up to 27–30%.
- **Lanchester** loses words to *teaching below the level*: scaffolding and illustration add up to 23%. It derives the exponent rules by counting zeros and lists calculator keystrokes ("מקישים את המספר הליניארי, לוחצים על log ומכפילים ב-10").
- **Certainty tags are not the problem** (0.3–0.7%).

### 2.2 The decisive split: book-following vs the tutor's own analysis

| block kind | Gilua L3: words/unit, core | Gilua L1: words/unit, core | Lanchester L1: words/unit, core |
|---|---|---|---|
| paragraphs with a `[[K1:nn]]` page tag (following the book) | **108.8**, 30% | **151.6**, 26% | 120.6, 47% |
| paragraphs with a `[[2.5:…]]` tag (the tutor's level-2.5 analysis) | **48.8**, 68% | **53.4**, 78% | 81.6, 66% |
| other paragraphs | 66.0, 53% | 91.6, 48% | 113.4, 40% |

**In Gilua, the length that does not add depth is overwhelmingly the length spent walking the reader through the source text.** The length spent on level-2.5 analysis is the depth. This is the quantitative case for the rule "נושאים, לא עמודים" (8א/9ב).

### 2.3 By block type (Gilua L3)

| type | n | prose words | units | words/unit | core |
|---|---|---|---|---|---|
| derivation | 4 | 805 | 18 | **44.7** | **90%** |
| formula | 3 | 190 | 6 | 31.7 | 85% |
| think | 12 | 1,306 | 21 | 62.2 | **78%** |
| fieldmap | 3 | 487 | 16 | **30.4** | 65% (dense, but each row is shallow) |
| domain | 5 | 957 | 15 | 63.8 | 62% |
| para | 107 | 9,992 | 144 | 69.4 | 47% |
| refresh | 5 | 532 | 5 | 106.4 | 31% |
| history | 1 | 139 | 1 | 139 | 20% |
| erratum | 5 | 463 | 1 | 463 | 8% |
| figure captions | 8 | 163 | 0 | – | 0% |

In L1 the `casestudy` block runs at **217 words per unit** (25% core): it re-tells the FDIV story the lesson had just told. The `coverage` block is 210 words with no units.

### 2.4 By section (Gilua L3): where the length went

| section | prose words | units | words/unit | core |
|---|---|---|---|---|
| intro (gunner story + "four floors") | 532 | 5 | 106 | 31% |
| four periods | 259 | 2 | **130** | 19% |
| Greece | 1,729 | 20 | 87 | 45% |
| the East | 861 | 7 | **123** | 41% |
| Renaissance | 550 | 4 | **138** | 34% |
| **Napier / log** | 1,880 | 40 | **47** | 61% |
| variable & function | 1,488 | 22 | 68 | 44% |
| Descartes + ballistics | 1,632 | 28 | 58 | 60% |
| derivative & integral | 1,876 | 24 | 78 | 52% |
| ODEs | 1,155 | 17 | 68 | 46% |
| critique: numerical derivative | 729 | 8 | 91 | 52% |
| **extremum / Lagrange** | 1,692 | 43 | **39** | **77%** |
| brachistochrone | 491 | 7 | 70 | 37% |
| foundations | 369 | 3 | 123 | 44% |

The four history-led sections (Greece through the Renaissance) take **3,399 words for 33 units**, at 103 words per unit. They are the "background" the learner senses, and they are exactly where the book is being narrated. The two sections chosen for the rewrite are the *densest* in the lesson, so the rewrite ratios below understate the gain available on the whole lesson.

### 2.5 Breadth: the second cause of length
L3 introduces 230 units over about 20 book pages (K1:45–64). By type:

| RES | STR | MAP | DEF | OOM | LIM | PRX | STEP | CRT | TRD |
|---|---|---|---|---|---|---|---|---|---|
| 53 | 52 | 31 | 26 | 22 | 12 | 11 | 10 | 7 | 6 |

Even at the floor this experiment found (about 26 words per unit), 230 units need about 6,000 words. Part of "long" is therefore **too many units per lesson**, not padding.
- Many STR units in the history sections are of low test value ("Rome contributed nothing", "content preceded form").
- The 31 MAP units are mostly one-line fieldmap rows.

**Unit triage is a separate lever from compression.** Mark each planned unit key, support or context. Key units get the full template. Context units get one clause or go to an optional "רקע" fold.

## 3. Where length adds depth, and where it does not (precise list)

**Length that adds depth (keep it, and do not compress below these sizes):**
- **Derivation skeletons with marked assumptions**: 90% core. The Napier derivation went 173 → about 150 words in the rewrite. It is the one block that cannot shrink much.
- **`think` blocks**: 78% core. They carry the critique and structure units (e.g. "בסרגל חישוב אין שנתה 0…", which carries 4 units in 117 words). In the rewrite they moved *before* the reveal.
- **Limits and critique paragraphs** (`[[2.5: גבולות/ביקורת]]`): 75–85% core. Examples are the three assumptions of the trajectory checked in numbers (block 86, 5 units) and the "h=d is optimal" critique (block 148).
- **Trade-off paragraphs that carry numbers** (block 53: the slide-rule error $9.2\times10^{-4}$ ≈ 3 significant figures).
- **Domain blocks whose mapping explains a mechanism** (dB, octave, Richter). Here *more* length would add depth at P4+, because the fieldmap rows (30 words per unit) are too thin to be tested beyond recall.

**Length that does not add depth:** the top 10 sources, measured across Gilua L3 + L1 (28,197 prose words).

| # | source | words (L3+L1) | typical quote |
|---|---|---|---|
| 1 | **Narrating the book** (what K1 says, in its order, its stance) | **2,881** | "[[K1:48]] … כאן מופיע מה שאפשר לקרוא לו 'הכלל הכללי' של ההתפתחות. תורות ישנות מולידות בעיות עמוקות…" (L3 b24); "הטקסט שלנו, שנכתב בברית המועצות של שנות ה-50, נוקט כאן עמדה פילוסופית מפורשת" (L1 b38); "לפי K1:62 הכלי הראשון הוא…" (L3 b130) |
| 2 | **Restatement: recaps, refresh, re-told stories** | **2,660** | "אפשר לסכם את הדרך שעשינו בחלק הזה כך…" (L3 b59); "סיכום הדרך עד כאן: הפכנו תלות לאובייקט מתמטי…" (b92); "סיכום החלק: ראינו ש…" (b129); the refresh "שלוש מדרגות ההפשטה של המספר" (b73) re-teaches L1; the L1 case study repeats the FDIV story (326 non-core words) |
| 3 | **History colour** | **2,564** | "באותה תקופה הופיעו באירופה השברים העשרוניים, שהמציא ההולנדי סטווין (1585)…" (b43, 0 units); "רומא… לא תרמה למתמטיקה דבר" (b8); al-Kashi's $2\pi$ to 16 digits (b36); "אצל עמים מסוימים 'חמש' נקרא 'יד'…" (L1 b40) |
| 4 | **Signposting and meta-talk** (incl. inline labels) | **1,889** | "זה השיעור השלישי מתוך ארבעה במודול M0.1, והארוך שבהם…" (b1); "בכך סיימנו את יוון… בחלק הבא נעבור למזרח" (b27); "ניתן כבר עכשיו הבטחה אחת, שנממש בחלק הבא" (b69); "לפני שנמשיך, הערה על מבנה השיעור" (L1 b5) |
| 5 | **Confirmatory illustrations** | **1,438** | "מכונית של 1500 ק"ג שנוסעת ב-100 קמ"ש… צוברת 578.7 kJ" (b65); "גוף חימום של 2000 W… 8.70 A… 26.45 Ω" (b66); al-Khwarizmi's worked example after the method was already given (b33, 102 words, 0 units) |
| 6 | **"Background" sections that follow the book's chronology** | 3,399 (L3 §Greece–Renaissance; overlaps #1–3) | 103 words per unit, against 39–47 in the analytic sections |
| 7 | **Errata in the main flow** | 622 | a names-and-dates erratum ("Nasireddin Tusi, 120112-74"…) inside the *Napier* section (b58); errata with an "איך בדקנו" paragraph |
| 8 | **Coverage and plan blocks** | 311 | L1 `coverage` (210 words, 0 units); the `plan` blocks |
| 9 | **Scaffolding below the level** | 294 (Gilua), **1,150** (Lanchester) | "נסתכל באיור 8. בציר האופקי הזמן, בציר האנכי הדרך…" (b97); Lanchester deriving $10^a10^b=10^{a+b}$ by counting zeros, and calculator keystrokes |
| 10 | **Captions and charts that repeat the prose** | 228 | figure captions that restate the next paragraph |

Not a source: **hedges** (144 words in two lessons). Exercises are also not a source: they are retrieval practice and should stay.

## 4. The rewrite experiment

**Design.**
- Two full sections of L3 were rewritten in Hebrew: Napier/log (40 units) and extremum/Lagrange (43 units).
- Every unit has a marker ⟦N7⟧ in the source (`A2_src/*_v2.md`), stripped from the deliverables.
- `A2_audit.py` does three things:
  - fails if any unit marker is missing;
  - measures the word ratio against the original prose (scene and chart JSON excluded, since they are kept unchanged);
  - runs a **number-fidelity check**: it lists every number in the original that does not appear in the rewrite, for manual review. This catches silent loss of anchors.
- v1 was audited; the losses were fixed in v2.

| section | original | v2 | ratio | units kept | words/unit, before → after | sentence mean (words), before → after |
|---|---|---|---|---|---|---|
| Napier / log | 1,880 | 1,032 | **0.549** | 40/40 | 47.0 → **25.8** | 13.9 → 16.6 |
| Extremum / Lagrange | 1,692 | 1,167 | **0.690** | 43/43 | 39.3 → **27.1** | 12.6 → 14.4 |
| together | 3,572 | 2,199 | **0.616** | 83/83 | 43.0 → 26.5 | – |

**Iteration (v1 → v2):**
- The marker audit passed in v1.
- The number-fidelity audit found a real partial loss in E16. The mental route to the *area* of the 1 m³ tank ($1.5\pi d^2\approx4.7\times1.17\approx5.5$ m²) had been dropped.
- The content audit found that N23 had lost "the table then served for centuries".
- Both were restored. Two non-unit elements were also restored on purpose: the gradient numbers that make $\lambda=3.69$ visible, and the link to the learner's own note ("נקודה 2 בחידוד הלוגי"). Both make a dense text engaging. The `keep` blocks were cut from 5 lines to 3.
- Net change: Napier −11 words, Lagrange +25.

**Not telegraphic.**
- The share of sentence fragments under 8 words did not rise: 15% → 16% (log) and 23% → 19% (Lagrange).
- Mean sentence length rose slightly.
- Compression came from deleting whole functions (recaps, page narration, signposting, duplicate presentation of the same mappings in a domain block and a fieldmap, an off-topic erratum), not from squeezing prose.

**The template** that produced this (in the two rewrite files):
1. One thread question.
2. Definition block with its domain of validity.
3. Derivation skeleton with each **assumption** bolded at its step.
4. A commit-before-reveal `think` placed before the result.
5. Bolded "לזכור" anchors, kept apart from illustration.
6. Trade-off, limits and critique as claim-first short paragraphs.
7. One mapping table (field | what is multiplied or conserved | what follows).
8. A 3-line `keep`.

**Projection to whole lessons** (`A2_project.py`): units × 26.5 words + 5% for `keep` + exercises unchanged, never expanding a section.

| lesson | now | projected | ratio | words saved |
|---|---|---|---|---|
| Gilua L3 | 15,779 | 6,909 | **0.44** | 8,870 |
| Gilua L1 | 12,418 | 5,031 | **0.41** | 7,387 |
| Lanchester L1 | 9,921 | 3,021 | 0.30* | 6,900 |

\*The Lanchester figure assumes its scaffolding is genuinely below this learner's level. For dB basics that is plausible but should be confirmed.

At 150–200 words per minute of technical reading, the projection saves **45–60 minutes of reading per lesson** with no depth unit lost. Unit triage (§2.5) comes on top of that.

## 5. Rules for the tutor prompt (Hebrew, ready to paste)

These are numbered צ1–צ12 so they do not collide with the existing rule numbers. They belong in `eng/app/src/prompt.ts` + `docs/ENG_TEACHING_RULES.md`, and in a parallel form in `core/app/src/prompt.ts` + `docs/CORE_TEACHING_RULES.md`. In Lanchester, OPS is added to the unit types.

```text
כללי צפיפות (צ1–צ12)

צ1. יחידת עומק. יחידת עומק היא רעיון אחד שאפשר לבחון עליו ברמה 2.5: הגדרה, תוצאה, צעד גזירה שבו נכנסת הנחה, גבול תוקף, עוגן מספרי לחישוב בראש, פשרה, מיפוי לתחום אחר, ביקורת (טעות לתפוס), עובדה מהשטח, תובנה מבנית (ובלנצ'סטר גם משמעות מבצעית). כל פסקה מכניסה לפחות יחידה חדשה אחת. פסקה שאינה מכניסה יחידה חדשה נמחקת או מתמזגת בפסקה אחרת.

צ2. מתכננים יחידות, לא עמודים. בקריאת התכנון כותבים לכל חלק רשימה ממוספרת של היחידות (U1, U2, …) עם הסוג שלהן ועם סימון: מפתח, תומכת או רקע. תקציב החלק הוא כ-30 מילים ליחידה (20–40). יחידות מפתח מקבלות את המבנה המלא (צ8), ויחידות רקע מקבלות חצי משפט. תרגילים ובלוקי think מחוץ לתקציב.

צ3. בלי חזרות. לא מסכמים בתוך השיעור את מה שכבר נאמר בו, מלבד בלוק keep אחד בסוף. לא פותחים חלק ב"בחלק הקודם ראינו". הפניה לשיעור קודם היא חצי משפט עם מספר משוואה, לא הסבר מחדש. בלוק refresh רק לכלי שלא הופיע בשלושת השיעורים האחרונים, ועד 40 מילים. סיפור שכבר סופר לא מסופר שוב בבלוק אחר.

צ4. בלי שילוט. אין משפטים שמתארים את השיעור עצמו ("בחלק הבא", "נעצור כאן", "נתחיל ב…", "כפי שנראה", "זה השיעור השלישי מתוך…", "ניתן הבטחה"). הכותרת עושה את העבודה.

צ5. נושאים, לא עמודים. לא מספרים מה הספר אומר ובאיזה סדר ("לפי K1:62…", "הטקסט נוקט עמדה", "בהערת שוליים מסתתרת"). תגית העמוד באה ליד הטענה, וזהו. עמדה של הספר מובאת רק אם היא עצמה יחידה, ואז כטענה שבודקים.

צ6. היסטוריה רק כשהיא נושאת רעיון. עד משפט אחד לדמות או לתאריך, ורק אם הוא מסביר למה המושג נולד, איזו הנחה נכפתה, או איזו טעות מלמדת. סיפור פתיחה עד 120 מילים, ובו לפחות שתי יחידות.

צ7. דוגמה מספרית אחת לכל תוצאה: זו שמבססת עוגן לזכור. דוגמה נוספת רק אם היא מכניסה יחידה חדשה (מקרה גבול, תחום אחר, סדר גודל אחר). עוגנים מסומנים "לזכור". מספרים להמחשה לא חוזרים בבלוק keep.

צ8. מבנה קבוע לתוצאה מרכזית: שאלה במשפט אחד, הגדרה (בלוק definition או formula עם תחום תוקף), שלד הגזירה עם "הנחה:" מודגשת בצעד שבו היא נכנסת, think "התחייבו לתשובה לפני שתפתחו" לפני התוצאה שהוא בודק, עוגנים לזכור, פשרה, גבולות וביקורת כפסקאות קצרות שנפתחות בטענה מודגשת, ומיפוי בין-תחומי כטבלה אחת (תחום | מה מוכפל או נשמר | מה נובע) בלי לחזור עליו בפרוזה.

צ9. errata מחוץ לזרם. בלוק erratum בתוך החלק רק לשגיאה שמשנה נוסחה או מספר שהלומד ישתמש בו, עד 40 מילים. שמות, תאריכים ושגיאות סריקה טריוויאליות עוברים לרשימה אחת בסוף השיעור.

צ10. בלי בסיס מתחת לרמה. לא גוזרים חוקי חזקות, לא מתארים מקשי מחשבון ולא מתארים צירים של איור. לכל היותר משפט תזכורת אחד.

צ11. תגית ודאות רק על מספר או טענה שבאמת לא ודאיים, לא על היסטוריה מוכרת.

צ12. בדיקה עצמית לפני שליחה. בסוף כל חלק מוסיפים הערה נסתרת <!--units: U3,U4,U7 | words: 812--> עם היחידות שנכתבו מתוך התוכנית. כל יחידה מסומנת במקום שבו היא נכנסת בסימון נסתר ⟦U7⟧. אם יש יותר מ-40 מילים ליחידה, מקצרים לפני השליחה.
```

## 6. The automatic depth-density check (for the app)

**Why it has to be semantic.** Cheap lexical features do not predict which paragraphs are padding. The test: Spearman correlation against the manual non-core share, per prose block (n = 148 / 100 / 96).
- Meta-phrase rate: ρ = 0.04–0.14.
- 4-gram overlap with earlier text: −0.17 to 0.13.
- Year and date density: −0.10 to 0.24.
- Certainty tags: ~0.
- A combined lexical score: 0.08–0.21.
- **Units per word**: **0.75–0.89**.

This last correlation is partly built in, since both come from the same coding. The point is that the signal lives in unit extraction, which needs the plan's unit list or an LLM, not in regexes.

**Design** (fits the existing in-page architecture: `composeLesson` in `tutor.ts`; no server needed):
1. **Plan call** → adds `units: [{id, part, type, tier, text}]` to the plan JSON (rule צ2). The unit list is stored with the lesson (`profile/modules/<m>` → lesson.units).
2. **Part call** → writes hidden markers ⟦U7⟧ and the `<!--units…-->` footer (rule צ12). The renderer strips them, the same way the A2 audit strips ⟦N7⟧.
3. **In-page check** (pure TypeScript, about 1 ms per lesson) after each part:
   - `unitsCovered / unitsPlanned` (must be 1.0, or the missing ids are named);
   - `wordsPerUnit` per part (warn above 35, fail above 45);
   - `zeroUnitParagraphShare` (warn above 10% of prose words);
   - `restateShare` (paragraphs whose 4-grams overlap earlier parts by more than 0.3);
   - `metaSentences` (regex lexicon from `A2_measure.py`, warn above 3%);
   - `erratumWordsInFlow` (warn above 40 per block);
   - `pageNarrationParagraphs` (paragraphs that start with `[[K1:nn]]` and carry no unit marker).
4. **Verifier call** (Haiku, run only on failing parts, or on a 1-in-5 sample): input is the paragraph text plus the unit list; output is the units it actually states. It catches fake markers and silent loss, the job the number-fidelity audit did in A2.
5. **Repair** for a failing part: one "compress" call with the failing paragraph ids and rules צ3–צ7. The draft logic (`draft: true`, `partsDone`) already supports re-writing a single part.
6. **Show it.** A small badge on the lesson ("214 יחידות · 27 מילים ליחידה · 0 חסרות") and a density report in `profile/diag/`. The **unit list doubles as the question bank** for retrieval and spaced review, the lever that round 1 found strongest. The unit list is not overhead: it is the curriculum's atomic inventory.

Sketch of the core of step 3:
```ts
function density(parts: string[], plan: {id:string; part:number}[]) {
  const mark = /⟦(U\d+)⟧/g, words = (s:string)=> (s.match(/\S+/g)||[]).length;
  const seen = new Set<string>(); let prose = 0, zero = 0;
  for (const p of parts.join('\n\n').split(/\n\s*\n/)) {
    if (/^```(scene3d|anim|chart|notebook|exercise)/.test(p)) continue;
    const w = words(p.replace(mark,'')); prose += w;
    const ids = [...p.matchAll(mark)].map(m=>m[1]).filter(id=>!seen.has(id));
    ids.forEach(id=>seen.add(id)); if (!ids.length) zero += w;
  }
  const missing = plan.map(u=>u.id).filter(id=>!seen.has(id));
  return { wordsPerUnit: prose/Math.max(1,seen.size), zeroShare: zero/prose, missing };
}
```

## 7. Caveats and how to validate
- **One coder.** The unit coding and the function percentages are one coder's judgement, with consistent rules but not blind.
  - Next step: a second, independent coder (an Opus session without the checklist) re-extracts units from the original and from the rewrite, and agreement is compared (target κ ≥ 0.7).
  - Learner test: 20 units sampled, the learner reads one version, and is quizzed after 2 days.
- **The rewriter knew the checklist.** That is the intended production setting (the plan lists the units), but it flatters "100% preserved". The number-fidelity audit and the v1→v2 content audit are the guard.
- **The rewritten sections were the densest ones.** Whole-lesson ratios are a projection from 26.5 words per unit, not a measurement. They are probably conservative for the history-led sections.
- **Some "non-depth" words have value.**
  - History colour and the opening story support motivation and memory.
  - The learner asked for engaging lessons.
  - The rules keep one story (at most 120 words, at least 2 units) and one-sentence history. They do not remove narrative entirely.
- **Breadth (230 units per lesson) is a curriculum decision**, not a writing one. Triage into key, support and context is proposed (צ2), but which units are "context" for this learner should be decided with him.

## 8. Files (all in `round2/`)
- `A2_density.md`: this report.
- `A2_rewrite_log.md`, `A2_rewrite_lagrange.md`: the final rewrites (v2), with measurements, the v1→v2 audit and the unit → location checklist.
- `A2_units.json`: the coding scheme, all 462 coded units (L3 230, L1 148, Lanchester 84) and both rewrite checklists.
- `A2_blocks.py`: block splitter.
- `A2_coding.py`: the manual coding.
- `A2_measure.py`: the measurement, written to `A2_measure_out.json`.
- `A2_audit.py`: the unit, ratio and number-fidelity audit.
- `A2_readability.py`: the sentence-length profile.
- `A2_project.py`: the whole-lesson projection.
- `A2_units_export.py`, `A2_build_docs.py`: export and assembly.
- `A2_src/`: v1 and v2 sources with unit markers, the audit JSONs and the doc headers.
