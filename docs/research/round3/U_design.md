# U. Design system v2 for the lesson screen and the app

**Prototype:** `round3/U_sketches_v2.html`, a working lesson screen in Hebrew RTL built from real content in `round2/ruletest2/lesson_1.md`, sections 1–2 (the `<!--U…-->` markers are stripped).
**Screenshots:** `round3/shots/` (`v2_<width>_<theme>_<step>.png`, plus `zoom_*` and `v2_flow_*`).
**Test scripts:** `scratchpad/shoot.js` and `scratchpad/flow2.js` (Playwright/Chromium).

**Hard constraint:** nothing is removed and no depth is cut. Every technique below changes *when* and *how* material appears, never *whether* it does. Folded text is still in the lesson, still counted in the word total, and one click away.

---

## 1. Research: what the evidence says, and what follows for this learner

The learner reads about 8 hours a day, works in Hebrew with heavy math, and wants depth and enjoyment. Items marked ✔ were checked against a source in this round. Items marked ◇ are well-known findings cited from memory.

| Topic | Evidence | Design consequence |
|---|---|---|
| **Line length** | ✔ Dyson & Kipping 1998: 100 cpl was read faster than 25 cpl at equal comprehension, but readers *preferred* about 55. Dyson & Haselgrove 2001 (secondary report): 55 cpl was fastest. Chaparro et al. 2005: 95 cpl was fastest, with no comprehension difference. Dyson's review warns that line length interacts with font, spacing and screen. | Comprehension is flat between about 55 and 100 cpl, so choose for comfort over an 8-hour day. Measure 39rem at 18px ≈ 62–68 Hebrew characters. Unpointed Hebrew packs more meaning per character, so the old 70-char column was at the upper edge. Never drop below about 45 chars; the old 40-char case had both side panels open. |
| **Scroll vs page** | ◇ Sanchez & Wiley 2009 (*Human Factors*): scrolling hurt comprehension of complex text for readers with low working-memory capacity. Other studies found no difference. | Use continuous scroll, because derivations need look-back. Reduce scroll cost with a "you are here" outline, equation peeks (hovering "(2)" shows the formula), and gates that stop him at natural beats. This is scrollytelling without the scroll-jacking. |
| **Polarity** | ✔ Piepenbrock, Mayr & Buchner 2013/2014: dark-on-light gave better proofreading and smaller pupils, at all ages. NN/g agrees for normal vision. | Light (cream) is the default for daytime. Dark stays, as a warm graphite for evenings, with *raised* luminance on accents and figures. Auto-switching follows the OS. |
| **Embedded retrieval** | ✔ Quantum Country, in Matuschak's own grading: strong evidence for retention of embedded prompts within QC, moderate for time cost, causality not yet established by RCT. | Commits live in the text flow, not in a separate quiz screen. Every commit feeds the review queue (the "נכנס לתור החזרה" chip). |
| **Pretesting** | ✔ Richland, Kornell & Kao 2009, and a 2023 review (d ≈ 0.3 over retrieval practice). Corrective feedback is required, and learners mispredict the benefit. | The thread question before reading says explicitly that an error costs nothing. The correction comes in the keep card at the end, so the pretest is never left hanging. |
| **Hypercorrection** | ✔ Butterfield & Metcalfe 2001, replicated many times. The mechanism is extra attention to feedback after a confident error. | A dedicated **confident-error card**: amber, not red; "why your answer is attractive"; a one-line fix; review chips; and an optional "in your own words" line. It catches attention at the moment it is already high. |
| **Confidence capture** | ✔ Certainty-based marking (Gardner-Medwin, as implemented in Moodle CBM) uses 3 levels at about <67%, 67–80% and >80%. | Use **3 buttons, not a slider**. Each button *is* the commit, so there is one click, no default, and no "untouched 50" problem. |
| **Feedback content** | ✔ Draper and Open edX guidance: say why the right answer is right *and* what is wrong with yours. Brilliant shows the explanation after correct answers too. ◇ Shute 2008: elaborated feedback beats bare verification. | Every verdict has a reason line. A wrong answer also gets a "למה זה מפתה" line, written per distractor. A lucky guess still gets the full reasoning. |
| **Collapse after mastery** | ◇ Expertise-reversal effect (Kalyuga et al. 2003): redundant explanation hurts learners who already know the material. | **Earned collapse** applies only after a correct answer at "בטוח". It is drawn as a green "הוכחת את זה" strip with the word count and a "פתח" button. It never triggers on a guess. |
| **RTL plus math** | ✔ W3C inline-bidi guidance: isolate with `dir`/`bdi` or `unicode-bidi:isolate`. KaTeX in RTL pages is a known problem, and browser extensions exist only to force it to LTR. | Every math box is an isolated LTR island that never wraps. A real bug found in testing: plain-text "√2" rendered as "2√", and "2, 3, 4, 6" rendered reversed in an RTL line. Rule: digits combined with symbols, and lists of numbers, go in math or `<bdi>`. |
| **Rest during long days** | ◇ Albulescu et al. 2022 (meta-analysis of micro-breaks): micro-breaks raise vigour and lower fatigue, with small effects on performance. | Show a quiet break chip after about 25–30 minutes of continuous reading (bar slot; not in the prototype). There is no forced lockout. |
| **Reward, sound, motion** | Little rigorous evidence. Variable-reward mechanics are known to drive compulsion rather than learning. | Sounds and motion are **deterministic and tied to actions**: a soft two-note chime on correct, a low two-note figure on a confident error, a small tick on folding. There are no streak fireworks. `prefers-reduced-motion` turns off every animation. |

**What the best products show** (from the round-1 landscape and the current examples):
- **Distill and Ciechanowski:** the figure sits in the text where it is discussed and responds to the reader. Use one figure per idea, with an explicit caption.
- **Quantum Country:** prompts are part of the prose and visibly saved.
- **Brilliant:** answer first, then the explanation, and short screens. Its paging does not suit 6,000-word lessons, so take the rhythm and not the pagination.
- **Readwise Reader and Kindle:** selection opens one small toolbar (highlight, note, ask), and the reading position is persistent.
- **Linear and Notion:** opaque, quiet chrome; keyboard first; one accent.

---

## 2. Design system v2

### 2.1 Tokens

There is one sheet for both apps (`shared/theme.css`), and the lab accent is the only difference between them. All values are in the prototype's `:root`, with dark-mode redefinitions under `@media (prefers-color-scheme: dark){:root:not([data-theme="light"])}` and under `:root[data-theme="dark"]`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` / `--paper` / `--raised` | #ebe3d4 / #f7f2e8 / #fdfaf4 | #1b1a19 / #232220 / #2b2a27 | desk / reading sheet / cards and popovers |
| `--ink` / `--ink-2` | #1f2319 / #3e4335 | #ebe7dd / #cdc8bc | text |
| `--muted` | **#565947** (was #676a58, 4.4:1) | #a9a497 | meta at ≥13px; now passes AA |
| `--line` / `--line-2` | #dccfb9 / #b9aa8d | #38362f / #56534b | rules |
| `--accent` | #a8321f | #f08a7e | lab mark, "you are here", progress hairline. **Nothing else.** |
| `--core` (+`-bg`) | #2e3a86 | #aeb7f2 | tier 1 |
| `--act` (+`-bg`) | #17577f | #86c1e6 | tier 2 and every interactive control |
| `--ctx` (+`-bg`) | #7d7659 | #bdb594 | tier 3 |
| `--ok` / `--bad` / `--hot` | #2c6a28 / #a1281d / #8f5300 | #93d08b / #ff958a / #efbd62 | right / wrong / confident-error |

That is **3 hues for blocks** plus **3 state hues**, down from 19 block hues and 7 level-2.5 hues. The seven 2.5 categories become one neutral mono pill (`2.5 · מקור`), so the label carries the meaning instead of a colour.

**Type**
- Fonts: IBM Plex Sans Hebrew for text, IBM Plex Mono for numbers in tables, chips and equation numbers.
- Desktop: body 18px/1.8; h3 20.5px; h2 25px; h1 31px (a ratio of about 1.2); meta 13–14px, never below 12.5px.
- Phone: body 17px/1.75.
- Vertical rhythm: paragraphs 1em apart, blocks 22px, sections 56px.

### 2.2 Three block tiers (core / support / meta)

| Tier | Kinds | Drawing |
|---|---|---|
| **1 Core**: what he must keep | `definition`, `formula`, `keep` | The **only framed** blocks: 1px hairline in `--core`, tinted `--core-bg`, label in core colour. `formula` adds larger display math, the equation number, and a "תחום תקפות" footer. `keep` gets a 1.5px frame. |
| **2 Support**: where he works | `think` (now commit), `derivation`, `exercise`, `refresh`, `model`, `notebook`, `domain`, `fieldmap`, scene and chart | A 4px `--act` spine on the inline-start side with an `--act-bg` tint. Interactive items (commit, exercise) are **raised cards** (`--raised` plus a spine). Shape, not colour, says "you can act here". |
| **3 Meta**: context and colour | `story`, `history`, `casestudy`, `today`, `fieldsystems`, `erratum`, `plan`, `coverage` | A 3px `--ctx` spine at 55% opacity with no frame. `story` and `casestudy` get a faint `--ctx-bg` box because they are long. `erratum` is just a small spine with mono page references. |

Each kind keeps its Hebrew label word (הגדרה, נוסחה מרכזית, גזירה, סיפור, מקרה…). Dashed full frames are gone.

### 2.3 Commit components

All three types share one anatomy: label → question → answer area → **confidence row = commit buttons** (מנחש / די בטוח / בטוח, each with 1–3 bars) → "דלג, הראה תשובה".

- **בחירה (choice):** option cards labelled א–ד. The keys 1–4 choose an option and move focus to the confidence row, the arrow keys move between levels, and Enter commits.
- **מספר (number):** an LTR mono field with a visible "סובלנות ±x". It accepts "√2", "sqrt2" and "שורש 2". Enter moves to the confidence row.
- **שורה (one line):** a text field plus a **hint ladder** of 3 dots that fill as hints are used; the rung used is logged. In the app it is graded by Haiku against the key and rubric. The prototype greps for key phrases and says so.

**States**

| State | Treatment |
|---|---|
| idle | Commit buttons are disabled until there is an answer. |
| right + בטוח | Green pill "✓ צדקת · בטוח", reason line, then **earned collapse** of the linked text. |
| right + מנחש / די בטוח | Green pill, "ניחשת נכון, אז הנה למה" with the full reasoning, and **no collapse** ("ביטחון נמוך משאיר את ההסבר פתוח"). |
| wrong + low or mid confidence | Red pill "✗ לא הפעם", "ענית …", "למה זה מפתה" (per distractor), the reasoning, and "נכנס לתור החזרה: מחר". |
| **wrong + בטוח** | The **confident-error card** (§2.6). |
| skipped | Neutral pill "דילגת · ההסבר פתוח". Scheduled for review like a miss. |
| pretest | Neutral "נשמר". No verdict until the keep card. |

### 2.4 Gates (progressive reveal without locking)

Content that a commit would spoil, such as the derivation after "על מה נשען 'מצומצם'", is **present but veiled**: blurred, faded, with a height cap, plus "ההמשך נפתח כשתתחייב למעלה · [פתח בלי לענות]". Committing or skipping opens it, and so does the open button. Nothing is ever locked.

### 2.5 Earned collapse

- **Trigger:** only right + בטוח on the commit linked by `data-earn`.
- **Folded state:** a green dashed strip with ✓, the text "הוכחת את זה" plus a one-line summary *written by the tutor* (it is a summary, not a teaser), "N מילים, מקופלות", and "פתח".
- **Reopened state:** the text keeps a thin green inline-start rule, so he sees it was earned.
- The outline footer always says "במסך: X מילים · מתוכן Y מקופלות כי הוכחת אותן. כולן נשארות בשיעור." The rule becomes visible as a number.
- **The opposite case:** after a wrong answer, the related depth paragraph is flagged "חשוב לך: כאן נמצאת הטעות מן ההתחייבות" (amber outline) and forced open.

### 2.6 The confident-error card

An amber (`--hot`) card, 1.5px frame, sliding up 6px. Its contents, in order:
1. "זה הרגע הכי טוב ללמוד" (framed as an opportunity, not a failure);
2. **למה התשובה שלך מפתה**, specific to the chosen distractor (for example, "פירוק יחיד… נדרש בהוכחה האחרת");
3. **the fix in one line**, on a raised background (this is what the review card will show);
4. the reasoning;
5. review chips: מחר · +3 ימים · +8 ימים;
6. an optional "במילים שלך, שורה אחת" field. Generation boosts memory, and it is optional so it never blocks him.

The sound is a soft low two-note figure, never a buzzer. The calibration rail records it as a filled amber square.

### 2.7 The keep card

The last block is a 1.5px `--core` frame headed "לסיכום · מה לקחת מהשיעור". It has one row per result, using the formula/definition text with **(n)** links. Each row carries a state pill driven by the commits:
- **נלמד** (read only), outline grey;
- **חושל** (right but unsure), outline action blue;
- **הוכח ✓** (right and sure), filled green;
- **בתור החזרה** (missed), amber.

Under the rows, the **thread question comes back**: "בפתיחה ענית (א)… עכשיו: (1): אין זוג כזה."

### 2.8 Depth layers

`.depth` is a quiet indented layer with a 2px `--line-2` rule and a header "▾ [עומק] על מה זה באמת נשען". It is **open by default**, because nothing is cut, and the reader can fold it. Typography marks it as the second reading layer (17px, `--ink-2`), so the main argument can be skimmed by reading the full-ink text only. Earned collapse can act inside it, and an error flags it open.

### 2.9 Equations: numbering and bidi rules
1. Number **only** equations in `formula` blocks, consecutively per lesson. Illustrative display math gets no number. This becomes a prompt rule as well.
2. The number sits on the **inline-end (left) side**, in mono core colour, outside the math box.
3. Every in-text reference "(n)" is a link. Hover or focus shows a **peek** of the equation; a click scrolls to it.
4. Inline math is an isolated LTR island (`unicode-bidi:isolate; direction:ltr; white-space:nowrap`). The tutor promotes any chain longer than about 40 characters to display math.
5. Display math never wraps. It scrolls horizontally, and an **edge fade** appears only when it overflows (tested at 400px on formula (2)).
6. In Hebrew prose, `√2`, number lists and "A4 = …" must be in math or `<bdi dir=ltr>`. The renderer also wraps `√\d+` automatically. Both bugs were caught in testing.

### 2.10 Figures, scenes and tables
- **Figures:** centred and full measure, with an inline SVG that uses `currentColor` and tokens so it works in both themes. The caption says what it is and where it comes from (for example "סכמה שצוירה לשיעור, לא מן הספר", or a source chip for book figures).
- **3D scenes:** the same frame, but they **never autoplay**: a poster frame plus "▶ סיור". Dark materials need emissive light (the round-2 audit found this).
- **Tables:** mono numerals, LTR cells, a caption above that states the pattern ("השגיאה מחליפה סימן ויורדת פי 6"), zebra rows, and horizontal scroll inside their own wrapper.

### 2.11 Margin
On screens ≥1180px, the sheet reserves a 12.5rem **end-side margin column**.
- **Source chips** (`K1:35`) float there as mono text aligned to the paragraph's first line, so paragraphs start with words again.
- **Margin notes** (the existing 4 kinds) sit there as sticky notes and are pushed down so they never overlap.
- Below 1180px, chips move to the paragraph **end** ("· K1:35") and notes go inline under their paragraph.

### 2.12 Consultation entry points
1. **Selection toolbar:** a dark pill with שאל · הסבר פשוט · פתק. It sits above the selection on desktop, and on phones it is fixed just above the bottom bar, so it never fights the OS menu.
2. **Anchored answer bubble:** inserted *after the top-level block* that holds the selection, with a caret. It shows the quote, then a 2–3 line answer, then chips **העמק · גזור · דוגמה · שמור לפתק**. Each chip appends a labelled section in place (the bubble grows, and the reading position stays). Only one bubble is open at a time, and Esc closes it.
3. **"הסבר פשוט"** uses the same bubble with the fixed מושגים / הרעיון / דוגמה structure (Haiku in the app).
4. **The bar's ask pill** asks about the current paragraph (the one at about 38% of the viewport) and anchors the answer there.

In the prototype every answer carries a dashed "דוגמה: תשובה מוכנה מראש" badge.

### 2.13 The bottom bar
One **opaque** 56px strip replaces the floating translucent dock *and* the 150px composer. It holds:
- (phone) ☰ תוכן;
- **where you are**: the section name and "עוד כ-N דק' בסעיף" (computed at 145 wpm from unfolded words);
- the **ask pill**, a single line that grows on focus;
- פתק and ריכוז.

Noise and Aa stay in the top bar and the Aa panel. This frees about 110px of reading height on desktop and about 150px on a phone.

### 2.14 The outline ("you are here")
A sticky column on the **inline-start (right)** side, where the RTL eye starts. It contains:
- h2 and h3 headings;
- **key results** in core colour ("(2) חסם הקירוב של √2");
- **commits**, each with a state glyph: ○ pending, ✓ right, ✗ wrong, ! confident error, – skipped;
- a red dot on the inline-start rail plus "אתה כאן" on the current item;
- a header with the minutes left in the section;
- a footer with the **calibration rail** (rows בטוח / די בטוח / מנחש, coloured squares for each commit) and the word ledger.

On phones it becomes a bottom sheet over a scrim.

The current app puts "תוכן השיעור" in the left dock. **v2 moves it to the right** and gives the left side to the margin. The notebook (מחברת) tab stays in the left dock and opens over the margin.

### 2.15 Focus mode and long sessions
- **ריכוז** hides the outline and breadcrumb and centres the sheet. The bar stays, because commits and ask must remain reachable.
- Planned for the app, not in the prototype:
  - a break chip after about 25–30 minutes;
  - a "warm night" variant of dark, with lower blue in `--bg` and `--paper`;
  - noise kept as is.
- Sounds are on by default at low gain, only on actions, with one toggle in the top bar (volume in Aa).

### 2.16 Mobile at 400px
- One column with an 18px sheet gutter; the outer gutter is `max(16px, safe-area)`.
- Measured `scrollWidth` is exactly 400 in light and dark, before and after the whole flow. The current app measured 445.
- Commit buttons flex to equal thirds, and "התחייב:" wraps above them.
- Display math scrolls with a fade; tables scroll in their wrapper.
- The bar shows icons only. The selection toolbar sits above the bar.

---

## 3. The other screens (design only; the prototype covers the lesson)

**היום (Day).** A day timeline with blocks:
- **retrieval** (10–15 min of due review cards, with confident errors first);
- **lesson part(s)** (each showing the commits waiting in it);
- **forge** (one production task);
- **project** milestone;
- **breaks** as visible gaps.

Each block shows estimated minutes from the R8 model, and the day total is shown against the 8-hour budget. Yesterday's three confident errors sit at the top as a "התחל כאן" card. The rule is the same: one accent, tiers by spine.

**Ledger (פנקס התוצאות).** One row per central result (CR), grouped by part. Columns:
- the result name with its formula number;
- state pills נלמד / חושל / הוכח (the keep-card vocabulary);
- next review date;
- calibration (the last 5 commits as squares);
- source page coverage as a thin bar;
- "same structure" links, shown as small chips that jump to other CRs.

Filters: due today, confident errors, not yet proved. The ledger and the keep cards are the same data, so a fold earned in a lesson shows up here as "הוכח".

**Forge (כור).** One task at a time on a wide raised card: the task (estimate, derive, find the error, trade-off) and a work area (the scratchpad: text, equations, sketches). Then "בדוק" calls the main model in a separate call, and the result comes back as the same verdict, confident-error and keep components. Artefacts produced (a calculation, a mini-article paragraph, a figure) are listed and exportable, so the forge produces things for his articles. Forge credit updates the ledger.

All three screens reuse the tokens, the bar, the commit and verdict components, and the 400px rules unchanged.

---

## 4. Prototype: what it does and how it was tested

**Features, all working in vanilla JS:**
- **Commits:** the pretest thread question (choice, neutral), the A4 ratio (number, ±0.01), the "מצומצם" think (choice), derivation step 4 (one line with a 3-rung hint ladder), and the 10⁻⁹ measurement think (choice). All have 3-button confidence and right / wrong / confident-wrong / skip states, with distractor-specific feedback.
- **Reveal and collapse:** gates with "פתח בלי לענות", earned collapse with reopen, the error flag on the depth layer, and a depth layer that can be toggled.
- **Navigation:** the outline with you-are-here, minutes left, state glyphs and the calibration rail; a progress hairline; equation peeks.
- **Asking:** the selection toolbar, the anchored bubble with deeper/derive/example chips, "הסבר פשוט", and the ask pill.
- **Notes and blocks:** margin notes (pre-seeded, added from the bar or the selection, kind cycling); the keep card with state pills and thread-question return; a computed convergents table; an inline SVG figure.
- **Environment:** focus mode; auto/light/dark theme; synthesised sounds with a toggle; state persisted in try/catch `localStorage`; reduced motion respected; keyboard support (1–4, arrows, Enter, Esc).

**Math rendering.** KaTeX 0.16.9 from cdnjs with `output:"mathml"` and Noto Sans Math from Google Fonts. This avoids a third-party stylesheet, which the page contract forbids. The app itself should keep KaTeX's HTML output with its bundled CSS. The page contract (no doctype) puts the page in quirks mode when opened raw, and **KaTeX refuses to render in quirks mode**. The published skeleton adds the doctype, and the tests use a wrapper that adds it too. A fallback renders TeX as isolated mono text if KaTeX is missing.

**Playwright passes** at 1300×900 and 400×860, light and dark (36 screenshots plus zooms):
- **Pass 1 found and fixed:**
  - a scrim `div` occupying a grid cell, which pushed the sheet into a 250px column;
  - a precedence bug in the pretest pill;
  - bidi of "√2" in titles and the outline;
  - bidi of the number list in the keep card;
  - display formula (2) clipped at the end (now `justify-content:safe center` with a smaller size and an edge fade);
  - a sliver of folded text visible during the transition;
  - the answer bubble inserted *inside* the definition frame (it now anchors after the top-level block).
- **Pass 2, all green:**
  - "open the gate without answering";
  - skip;
  - keyboard commit (2 → ← ← → Enter gives conf 3);
  - fold and reopen;
  - wrong number with an unsure verdict and the "you forgot the root" distractor line;
  - adding a note;
  - focus mode hides the outline;
  - the theme cycle;
  - the equation peek;
  - the ask pill;
  - "הסבר פשוט";
  - state survives a reload.
- No page errors, and `scrollWidth` equals the viewport width in every state.

**Known limits of the prototype:**
- Sections 1 and 3 are excerpts, marked with a dashed "בסקיצה…" line.
- Answers are canned, and the one-line grader is a regex.
- Neither the Aa panel nor the noise toggle is reproduced.
- The ask bubble anchors after a whole gated derivation rather than after a single step.

---

## 5. Port to the app (order by impact)

1. **`Commit` component** replacing the `think` renderer. The tutor already writes options and answers; the renderer adds `@key` and `@attract` (per-distractor lines) and `@fix` to the block grammar.
2. **Tokens and tiers** in `shared/theme.css`, the block CSS swap (frames → spines), and the 2.5 pills unified.
3. **The bottom bar** (merge dock and composer), plus the 400px overflow fixes.
4. **Math hygiene:** bidi isolation, display-math scrolling, numbering rule and peeks (renderer plus a prompt rule).
5. **The outline** with commits, key results and calibration, moved to the right.
6. **Gates, earned collapse and depth layers.** These need `data-earn` links between a commit and the units it proves; the plan JSON already has units and questions.
7. **Inline ask bubble and chips**, wired to the existing Explain (Haiku) and main-tutor calls.
8. **Keep-card states → ledger.** Then build the Day and Forge screens from the same components.

---

## Sources
- [Dyson & Kipping 1998, line length and scrolling (Visible Language)](https://journals.uc.edu/index.php/vl/article/view/5671)
- [Line length summaries](https://www.blog.theteamw.com/2009/10/26/100-things-you-should-know-about-people-2-line-length/)
- [Piepenbrock dissertation, polarity](https://docserv.uni-duesseldorf.de/servlets/DerivateServlet/Derivate-31413)
- [Quantum Country evidence notes](https://notes.andymatuschak.org/zqetsQERteJhyPitmRoaeE)
- [Quantum Country embedded prompts](https://notes.andymatuschak.org/z3kzMVAPanLdwuE4MQYt2ZW3p67Ce57ZVXjwZ)
- [Richland, Kornell & Kao 2009](https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf)
- [Pretesting review 2023](https://link.springer.com/10.1007/s10648-023-09814-5)
- [Hypercorrection replication](https://pmc.ncbi.nlm.nih.gov/articles/PMC4084803)
- [Hypercorrection mechanism (Metcalfe & Finn)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3079415)
- [Certainty-based marking (Moodle docs, Gardner-Medwin)](https://docs.moodle.org/31/en/Using_certainty-based_marking)
- [Draper on feedback](https://www.psy.gla.ac.uk/~steve/evs/feedback.html)
- [Open edX feedback practices](https://docs.openedx.org/en/open-release-sumac.master/educators/concepts/instructional_design/feedback_best_practices.html)
- [Brilliant on explanations](https://brilliant.org/help/why-brilliant/is-brilliant-good-for-remediation)
- [W3C inline bidi markup](https://www.w3.org/International/articles/inline-bidi-markup/bidi_examples.html)
- [Directionality in math zones](https://learn.microsoft.com/en-us/archive/blogs/murrays/directionality-in-math-zones)
- Cited from memory, not re-checked this round: Sanchez & Wiley 2009 (*Human Factors* 51:730); Kalyuga et al. 2003 (*Educational Psychologist*); Shute 2008 (*Review of Educational Research*); Albulescu et al. 2022 (*PLOS ONE*).
