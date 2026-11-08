# U v3: the lesson screen, iteration 3

**Prototype:** `round3/U_sketches_v3.html` (233 KB). It is built from the real lesson, not retyped.
- **Build:** `shots_v3/build/build.py` converts `round2/ruletest2/lesson_1.md` (comments stripped; `<!--U…-->` markers kept only to tag units) plus `template.html` and `app.js` into the deliverable.
- **Test copy:** the build also writes `shots_v3/test.html`, which is the same file with `<!doctype html>` added.
- **Content:** every paragraph and block of the lesson is in the page: 4 sections, 5 thinks, 4 exercises, the erratum, today, coverage, fieldmaps and domains.
- **Unit data:** the plan's 89 one-line unit texts and key flags (`plan.json`) are embedded, and skim chips and fold summaries use them.

**Tests:** `shots_v3/walk.js` (Playwright, Chromium) clicks through every flow at 1300×900 and 400×860, in light, dark and night.
- Three full passes were run after the fixes.
- Final pass, all 6 configurations: 0 page errors, `scrollWidth` equal to the viewport in every step, state and consultations restored after a reload (27 commits and 8 cards).
- **Screenshots:** the key shots are `shots_v3/v3_*.png`. Every step of every configuration is in `shots_v3/all/<width>_<theme>_<step>.png`.

## 1. The 15 critique problems: what changed

| # | Fix in v3 |
|---|---|
| 1 Answers visible | **Every** commit veils the units that answer it: 15 gate groups plus 2 section gates. This covers derivation + (1) under c2, (2) under c5, U36 under c4, U59, the Patriot case parts, the domain block and the story continuation. Think answers are pre-placed hidden and revealed only on answer or skip. The outline masks pending results as "(1) ···" and the section-2 heading as "האלכסון והצלע: ···" until the commit is answered or scrolled past. An equation peek on a veiled formula says "נחשפת אחרי השאלה". |
| 2 Fold costs more than it saves | Fold only when the earned group is ≥100 words: a one-line strip replaces ~10 lines. Shorter groups stay open with a thin green rule and a single label, "✓ עברת בדיקה · נשאר פתוח: N מילים, קצר מכדי לקפל". The strip *is* the reason line: "✓ why. unit one-liner · N מילים מקופלות · נשארות בשיעור · ייבדק שוב סגור בעוד 3 ימים · פתח". In the walk 2 groups folded (POE 251 words, Patriot mechanism) and 7 stayed open. |
| 3 Verdict repeats lesson | The verdict is a pill + "למה זה מפתה" + "↓ ההסבר מיד כאן", which scrolls to and highlights the lesson unit. No reasoning is restated. A think's own answer from the lesson appears once, as lesson text after the card ("התשובה מן השיעור"). |
| 4 Nesting | The story block closes before its commit. The confident-error card replaces the commit body (class `ce-on`). The fix line is `nowrap` with a scroll fade. The only nesting left is the faded derivation step, which on the phone gets a negative inset. |
| 5 Toolbar | The toolbar is C §3.2: מה זה? · למה? · דוגמה · בדוק אותי · לא מסכים · שאל… · פתק. Each button fixes the type. "הסבר פשוט" is gone. |
| 6 Escalation/persistence | Cards follow C §3.3. **L0** is the collapsed title (▾). **L1** is the body. Named **deferred chips** come from the answer, and the four fixed chips are עמוק יותר / במילים אחרות / שמור / פתח בצד. L2 opens in the side panel, and "עמוק יותר" from L2 goes to L3. Each card has a follow-up box. Quotes are rebuilt from the selection, with KaTeX turned back into `$tex$`, so they are never garbled. |
| 7 Anchor / destroy | The composer shows an editable anchor chip ("על: «…»"). It follows the top paragraph, or the selection after בדוק אותי/לא מסכים/שאל…. Its × switches to "בלי עיגון", and clicking it scrolls to the anchor. Nothing is deleted: cards only collapse to L0. |
| 8 Bubble grows | L1 stays inline. L2+ goes to the panel on desktop. On phones, L1 opens in a 46% bottom sheet that goes full height for L2. Chip sections are collapsible `<details>`. |
| 9 Confidence everywhere | Confidence is asked only on the 15 key units and the 3 pretests. The other 12 questions have one "ענה" button. Labels are "ענה", "שאלה מרכזית" and "27 שאלות, 15 מהן מרכזיות". The last confidence used is shown, never pre-selected. |
| 10 Phone card | Options are 44px. Confidence is one segmented control (full-width on a phone). "דלג" sits in the card header. |
| 11 Mono Hebrew, chips | All Hebrew labels use Plex Sans with no letter-spacing. The schedule is the plain text "חוזר מחר", with "אחרי 3 ואחרי 8 ימים" on hover. |
| 12 Figure | Labels are outside the square, with leader lines, and the steps are in the caption. The three book figures (K1:38, 40, 43) are drawn as schematics and marked as such. |
| 13 Focus leak | Notes become numbered dots at the end of the paragraph; a click opens the note inline. The top bar hides while reading down. Badges and certainty move inline. |
| 14 Stale orientation | One probe drives the outline "אתה כאן", the bar's section and minutes, the anchor chip and the section-end sound. The phone outline sheet sits above the bar with bottom padding. |
| 15 Noise | Certainty is a small ◆ with a tooltip, plus a margin list ("◆ ודאות גבוהה") on wide screens. Disabled controls are at 60% with "בחר תשובה קודם". A confident error shows an amber ◆ in the outline. The calibration rail has a "?" legend. |

## 2. Gaps closed

**Against the L-flow:**
- 0.1 two retrieval lines; a miss schedules the lesson-1 item.
- 0.2 the A4 ratio.
- 0.3 three pretests with "נשמר" and no answers. Each returns where the lesson answers it:
  - p2 ✓בטוח: the U36 think is not asked again;
  - p3 ✓בטוח: the POE prediction is skipped;
  - p3 also returns as "שאלה מהפתיחה · בפתיחה ענית …".
- **Section gate 1.1:** a two-number answer plus a line. Both ✓בטוח switch on **skim mode**: 11 non-key paragraphs (546 words) become one-line unit chips ("▸ text · N מילים · הצג"), definitions compact to title + first line, and a banner states the count and "הכל נשאר בשיעור · הצג הכל".
- **Section gate 4.1:** Torricelli, plus an adaptive *i* probe.
- **Fedorov:** a multi-select. A miss leads to the "הצעד שלך" number with a 3-rung hint ladder.
- **Adaptive probes:** Shechtman, the two blinkers, *i*. Each says why it was not asked and offers "שאל בכל זאת".
- **Socratic dialogue:** after a wrong step 4 and after a wrong 0.333…+0.666…. At most 4 tutor turns, regex-checked, and the step is never given before the 2nd turn.
- **Predict–observe–explain:** predict (key) → a working sim. The N slider uses a log axis, and "הרץ סימולציה" really sums N random numbers ×20 runs and shows the measured truncation vs rounding ratio. Then explain. A ✓ on both folds the explanation.
- **Closing:**
  - keep-card **blanks** (2 rows, chosen from misses and unsure answers, otherwise the defaults (2) and (5)), then the full card;
  - **teach-back** of the thread question, with a 3-point rubric and "שינית את דעתך; טוב";
  - an exercise choice (recommended path; the rest marked "בתור");
  - **scheduling** of 3 items with "החלף". Folded and skimmed units enter review with a shortened 3-day interval.

**Against C:**
- type-fixing toolbar; anchor chip; L0–L3; named deferred chips plus the 4 fixed chips;
- side panel with threads grouped by anchor, and a log tab;
- margin count badges that reopen the cards;
- follow-up inside the card;
- "שמור" shows the *tool* result (`profile/notes/M0.1__2`, בטל/ערוך);
- **one card per margin note** ("התייחס לפתקים שלי"): the first is open, others collapse to their verdict line, and a correction is always open;
- a router label on typed questions;
- a failure card that keeps the question in the box (נסה שוב / שלח למורה ברמה מלאה);
- a log showing type, level, chips, verdict and misconception, with "◐/✗ → כרטיס חזרה בעוד 3 ימים".

**The must-say rule is visible in the answers:**
- N4 opens with "טעות · לא נדחית ◐ חצי נכון";
- N5 opens with "תיקון · לא נדחה";
- note 2 opens with "תיקון: לא. גם double…";
- the rule is stated at the top of the log.

## 3. Honesty of collapse

- **The ledger counts lesson units only.** Formulas count as one word; badges, notes, cards, commit widgets and labels are excluded. In the walk the total held at about 6,925 before and after 8 consultations, which added 635 words that are listed separately as "תשובות המורה … לא נספרות".
- **Keep pills name the question that earned them:** "נבדק ✓ · המדידה על האלכסון · בטוח". Nothing reads "proven": the states are נקרא (לא נבדק) / חושל / נבדק ✓ / חוזר מחר, and a legend under the card explains them.
- **A fold needs a key unit, a right answer and "בטוח",** and the strip says "ייבדק שוב סגור בעוד 3 ימים".

## 4. Fatigue

- One-line widgets: answered cards shrink to "title · ענית: X · ✓" once scrolled past, and a click reopens them.
- Sound only on a confident error and at a section boundary.
- A warm **night** theme (no cool hues) joins auto/light/dark.
- A **break chip** after 25 active minutes ("הפסקה, 2 דק'" / "אחר כך") opens a 2-minute overlay. It floats above the bar on phones.

## 5. Known limits

- All answers, graders and dialogues are canned or regex-based, and the page says so.
- The word total (≈6.9k) includes the exercises, erratum and coverage, so it is higher than the plan's 6,282.
- Cards anchored inside a derivation sit after the whole block.
- The skim chip text is the unit one-liner, which for a few paragraphs names the following unit.
