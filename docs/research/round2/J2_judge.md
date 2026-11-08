# J2: Blind judge (reader persona: military-systems adult, weaker formal math, aiming at authority)

Files read: blind/log_X.md (657 words), log_Y.md (389), lagrange_X.md (894), lagrange_Y.md (478). Nothing else was opened.

---

## Pair 1: Napier's logarithm

### 1. Reading as the persona

**X**
- Strong start: the formula block comes first, and it tells me honestly what is not yet defined: "ההגדרה המדויקת של המושג תבוא בחלק 4 של השיעור, וכאן מספיקה לנו המשמעות האינטואיטיבית". As a reader with weaker math, I value that. I know $y'$ is being used on credit.
- The Napier paragraph (line 11) is one long block. I had to read it twice to keep P, Q, $x$ and $y$ apart. "דילגנו על האלגברה" is fine here.
- Good link sentence: "אבל למה פונקציה עם קצב $c/x$ שימושית בכלל? ... נגזור עכשיו שהתכונה הזאת נובעת מ-(5), ורק ממנה." This is the thread made explicit.
- The derivation in six steps is clear. Steps 2 and 3 split "the $k$ cancels" from "therefore constant". That split helps a weak-math reader.
- Padding: the `fieldmap` repeats things the `domain` block already said (decibel, octave), in long prose: "יש רכיב שבו המתח עולה באותה תוספת קבועה...". The two errata take up a lot of room. The second one (Tusi's dates, Viète, al-Kashi "150 שנה") is not about the logarithm at all, and it pulled me out of the thread. The closing paragraph ("המזרח שחרר את המספר מהגאומטריה...") summarizes a whole part I have not read in this file. It feels like a section closer that was dropped in here.
- Missing: no "what to keep" list. After 650 words I had to rebuild the key formulas myself.

**Y**
- The opening sentence gives the need first: "האסטרונומים של 1600 היו צריכים דבר אחד". Good, the "why" comes before the "how".
- The formula block holds the whole chain $y'=c/x,\ y(1)=0 \Rightarrow y=c\ln x$. It is clearly the key formula.
- Lost: the line "בזמן קצר $dt$ ‏Q עוברת $10^7dt$". $dt$ appears without explanation, and $y'$ is never flagged as "used intuitively, defined later". A weak-math reader feels he is supposed to know this already.
- The `think` before the derivation is excellent: "ההפרש $y(kx)-y(x)$ עולה, יורד או קבוע? התחייבו". It made me commit, and the derivation then answers it.
- The NL paragraph (line 32, "ה-NL המקורי **יורד**...") floats. Nothing links it to the paragraph before or after, and it reads like a leftover.
- The fields table is efficient and scannable. For me, someone who writes articles, it is better than the prose `domain` and `fieldmap`. It has one undefined term, "גרף בוֹדה".
- The `keep` block at the end is exactly what I want.
- Lost from X: the erratum on the garbled formula at K1:52. Without it, a reader who opens the book sees "/ = c/x" and gets confused.

### 2. Reconstruction (5 things, text closed)
1. Napier defined the log by its rate of change: $y'=c/x$, $y(1)=0$, so $y=c\ln x$.
2. From $1/x$ the $k$ cancels, so $y(kx)=y(x)+y(k)$: product becomes sum.
3. The log measures ratios as distances, and $c$ is only a unit ($\ln=2.3026\log_{10}$).
4. $b/\ln b\ge e$ (via $\ln x\le x-1$): $e$ is the cheapest base.
5. A transform makes one operation cheap and another expensive: the slide rule gives about 3 digits at constant relative error, and it cannot add.

**Y made this easier.** The `keep` block and the bold run-in headers ("העיקרון:", "תוצאה בשורה אחת:", "הפשרה:") map almost one-to-one onto items 1–5. In X, items 3 and 5 are spread over long paragraphs and labelled with 2.5 tags, not with claims.

### 3. Criteria
| Criterion | X | Y |
|---|---|---|
| Definition before example | Partial. The formula comes first, and it is honest that $y'$ is deferred. No `definition` block. | Partial. The formula comes first, but there is no word on what $y'$ / $dt$ mean. |
| Key formula vs illustration | Formula blocks are clear. The (6)/(8) numbering is fine. No summary. | Clearer: the formula block plus a `keep` block. Examples sit in the table. |
| One thread, explicit links | Better link sentences ("אבל למה...", "הלב של הגזירה הוא צעד 3"). The thread is broken by the off-topic erratum and the closing summary. | Bold headers act as signposts, but there are fewer connective sentences. The NL paragraph is orphaned. |
| Commit-before-answer questions | Only one `think`, near the end. | Two. The first one, before the derivation, is the best device in either version. |

### 4. Over-compression in Y
- `$dt$` and $y'$ are used without any gloss (X's one-line deferral note is missing).
- Derivation step 2 merges "the $k$ cancels" and "therefore the difference is constant" into one line. It is readable, but a weak-math reader may need to read it twice. Splitting it costs about 10 words.
- The NL paragraph needs one link sentence ("שימו לב: הטבלה המקורית לא קיימה את (7) בדיוק").

### 5. Improvements to Y without adding net length
- Add, after formula (5): "$y'$ = קצב הגידול; ההגדרה המדויקת בחלק 4" (about 8 words). Replace "$dt$" with "בזמן קצר".
- Fold the NL paragraph into the end of "איך נאפייר הגיע ל-(5)", right after (6), as one sentence.
- Restore the K1:52 erratum as a one-line `erratum`: "בספר: '/ = c/x'; הנכון $y'=c/x$". Drop the Tusi/Viète erratum from this lesson.
- Gloss "בוֹדה" in 3 words or drop the name.
- Pay for the additions by trimming the Briggs/slide-rule history dates.

### Verdict, pair 1: **Y**, with the small fixes above. X has better connective tissue, but it carries roughly 40% material that adds no depth (the duplicate fieldmap, the off-topic erratum, the part summary). Y loses no essential mathematical depth. Its losses are one gloss and one erratum.

---

## Pair 2: Tank optimization, Lagrange multipliers

### 1. Reading as the persona

**X**
- The opening with the book figure and "גליל 'ריבועי'" is concrete and good. The motivation paragraph ("גליל נמוך ורחב משלם...") is clear.
- Definition-before-example is violated. Partial derivative and gradient are *defined inside step 1–2 of the tank derivation* ("צעד 1, נגזרת חלקית: לפונקציה של שני משתנים יש שני קצבי שינוי..."). For me this mixes "what is the concept" with "what is this tank". I want the concept first, alone.
- The derivation in seven steps is careful. Splitting steps 5 and 6 (one per partial derivative) helps a weak-math reader.
- The scene3d and the paragraph after it ("קו הגובה של השטח המינימלי **נוגע** בעקומת הנפח ואינו חוצה אותה") are the moment the geometry clicked for me. This is real depth, not padding.
- The `chart` of the shape penalty, with the third curve for "קצוות פי 2", makes the flat minimum *visible*. It is also valuable.
- The storage tank (32) gives the intermediate result "כמות של $\pi r^2\rho gh^2/\sigma$" and defines "$\rho gh$ (צפיפות כפול תאוצת הכובד כפול העומק)". I can follow it.
- Padding: the "[[2.5: מבנה משותף]]" paragraph is long, and so is the critique paragraph (line 108). The last two sentences of the critique ("זה קרוב לנקודה 2... המכל מראה גם את הצד השני") are good for me as an article writer, but wordy. There is no `think` until late, and no `keep`.

**Y**
- "**השאלה.**" then "**דרך ההצבה, ולמה היא לא מספיקה.**": a crisp frame. I know why I need the new tool before I get it.
- `definition` block of partial derivative and gradient *before* the derivation: exactly the order I asked for.
- The `think` "מה הזווית בין $\nabla S$ לבין העקומה? התחייבו" is placed right before the step that answers it. Excellent, it makes me derive the key insight myself.
- Step 2 names the assumption explicitly ("**ההנחה** ($S$ ו-$V$ חלקות, ובודקים בסדר ראשון)"). This is better than X, and it fits the "assumptions" thread of the whole lesson.
- **Defect:** "בסצנה, במבט מלמעלה, רואים את (28)". There is no scene in Y. Either the figures were stripped for the blind test or they were cut. In both cases the reference dangles. The book figure (איור 10) and the chart are also gone. If Y really ships without them, it loses the most intuitive part of the lesson.
- The `think` "1%, 10% או 30%?" before the flat-minimum section: very good, and the surprise of "1.75%" sticks.
- Storage tank: "אינטגרל על הגובה והצבת האילוץ נותנים כמות פלדה של..." skips the intermediate $\pi r^2\rho gh^2/\sigma$. $\rho$ and $g$ are never named. Here I would have stopped and felt the math was hidden from me.
- The "אותו מבנה במקומות אחרים" table is tight and good.
- `keep` with three lines: exactly right.

### 2. Reconstruction (5 things)
1. Constrained optimum: $\nabla S=\lambda\nabla V$. The equal-cost curve touches the constraint, it does not cross it.
2. $\lambda$ is the shadow price, $dS_{\min}/dV$ (3.69 m² per m³ at 1 m³).
3. Closed cylinder at uniform price: $h=d$, $S\propto V^{2/3}$.
4. The minimum is flat (quadratic): $h/d=1.5$ costs 1.75%. So the assumptions decide, not the precision of the calculation.
5. Change an assumption and the optimum moves: ends $k$ times dearer give $h/d=k$; thickness set by pressure gives $h_{opt}=\sqrt{2t\sigma/\rho g}$, independent of volume.

**Y made this easier.** The `keep` block is literally items 1, 3+5 and 4. The two commit questions anchored items 1 and 4. X's scene made item 1 *understood* more deeply. Y made it *retained* better.

### 3. Criteria
| Criterion | X | Y |
|---|---|---|
| Definition before example | No. Defined inside the worked tank derivation. | Yes, a separate `definition` block. |
| Key formula vs illustration | Formula blocks are clear. The pop-can/storage-tank sections are clearly applications. No summary. | Same, plus `keep`. |
| One thread, explicit links | Good prose links ("נבדוק שתיים כאלה", "במבט מהצד רואים..."), with the scene tour driving the thread. | Bold headers as signposts. Links are shorter but present ("הסיבה בפסקה הבאה"). The scene reference dangles. |
| Commit questions | One, late. | Three, each placed just before its answer. |

### 4. Over-compression in Y
- Storage-tank model: missing the intermediate integral result, and $\rho$, $g$ are undefined. This is the one place a weak-math reader cannot reconstruct the step.
- Step 4 merges two partial derivatives into one line. It is followable, but splitting at "לפי $r$:" onto a new line costs nothing.
- "(הנגזרת השנייה של הלוגריתם של אגף שמאל ב-$\kappa=1$ היא $2/9$)": dense. X's version ("הגזירה הראשונה נותנת אפס... והשנייה $2/9$") is clearer for one or two more words.
- No visual. The scene and chart should be restored (they cost no prose words).

### 5. Improvements to Y without adding net length
- Restore the scene3d and the chart (data, not prose), or delete the sentence "בסצנה...". Keep the book figure.
- In the storage tank, add "$\rho$ צפיפות, $g$ תאוצת הכובד", and the intermediate "לדופן $\pi r^2\rho gh^2/\sigma$" (about 12 words). Pay for it by cutting the cube/sphere sentence to one clause.
- Put the λ numerical check ($\nabla S$, $\nabla V$ components) inside the scene caption, not in the prose paragraph. The paragraph "מה $\lambda$ אומר" then stays on meaning only.
- Keep X's sentence "אילו שינתה, היינו זזים לכיוון שבו $S$ יורד" inside step 2. It is the actual reason, and it is 8 words.

### Verdict, pair 2: **Y**, conditional on restoring the visuals and the storage-tank intermediate step. Y is about half the length and loses nothing of the mathematical argument, and it is structurally better (definition first, three commit questions, keep). X's real advantages are its visuals and two missing steps. They are not its extra prose.

---

## 6. Overall: which format every lesson should follow

**Y's format**, made into a rule:
1. A one-paragraph need/question → a `definition` block for every new concept (separate from the example) → a `think` placed *immediately before* the step that answers it → the derivation, with assumptions named in bold → a `formula` block for key results only → applications as bold-headed short sections → a cross-field **table** (not prose domain + fieldmap) → `keep`.
2. Keep from X: every scene/chart/figure (they add depth at zero prose cost); a one-line note whenever a concept is used before it is defined; intermediate results in any modelling step; errata that concern *this* topic's formulas.
3. Drop from X: duplicated domain + fieldmap prose, off-topic errata, closing summaries of material outside the lesson, and connective sentences that only restate the previous paragraph.
4. Guardrail against over-compression: every symbol is named the first time it appears ($\rho$, $g$, $dt$, $y'$), and no "the algebra was skipped" line hides a result the reader needs to reach the next line.
