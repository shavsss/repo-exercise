# U critique: lesson screen v2, walked as the learner

**How it was tested:** `round3/U_sketches_v2.html` was opened through `critique_shots/v2_test.html`, which is the same file with a doctype added. The run used Playwright with Chromium at 1300×900 and 400×860, in light and dark. The scripts are `critique_shots/walk.js` and `scratchpad/critwalk2.js`.

**Results:**
- There were no page errors.
- `scrollWidth` matched the viewport in every state.
- The reading column measured 624px on desktop and 338px on the phone.
- Body text was 18px on desktop and 17px on the phone.

**Screenshots:** every reference below is a file in `critique_shots/`, named `<width>_<theme>_<step>.png`, plus the `x_*` and `z_*` crops.

---

## 1. The 15 most important problems, ranked (no fix cuts any content)

1. **Answers are visible before he commits.** This breaks the whole mechanism.
   - **What happens:**
     - The paragraph that answers c4 ("מדידה אינה מכריעה. שום מדידה סופית…") sits unveiled directly under the c4 question (`x_c2wrong_depthflag.png`, `1300_light_14_c4_after.png`).
     - Under the blurred derivation, formula (1) $p^2\ne2q^2$ is fully readable (`1300_light_07_c2_gate.png`).
     - The outline shows "(1) אי-פריקות האלכסון והצלע" and the h2 "קטעים בלי מידה משותפת" before he has answered the thread question (`1300_light_01_top.png`).
   - **Fix:**
     - Generate a gate from every commit's key units. Today only 2 of the 5 commits have one.
     - Veil any key-result block that answers a commit that is still pending.
     - In the outline, show a pending key result as "(1) ···" until he scrolls past it or commits. The text itself is unchanged.

2. **The earned collapse costs more than it saves.**
   - **What happens:**
     - The c4 fold hides 40 words behind a dashed green strip that is as tall as the text it hides. On the phone it is taller: about 120px (`400_dark_15_folded.png`).
     - Its one-line summary repeats the verdict reason that sits 3cm above it, so he reads the same idea three times.
   - **Fix:**
     - Fold only when the unit is at least about 120 words or at least 4 lines.
     - For a shorter unit, keep the text and mark it with the thin green "הוכחת" rule only.
     - Merge the verdict reason and the fold strip into one line.

3. **The verdict repeats the lesson text.**
   - **What happens:**
     - The c1 "fix line" ("הצורה נשמרת ⇔ r=2/r ⇔ r²=2") is followed at once by the same sentence in the lesson (`1300_light_06_c1_confwrong.png`).
     - In c3, the reasoning is printed twice, once in the card and again as step 4 (`1300_light_12_c3_wrong.png`).
   - **Fix:**
     - The verdict card shows only "למה זה מפתה" and a pointer, "↓ ההסבר מיד כאן".
     - The lesson unit that follows is highlighted. When the lesson already says it, the card does not restate it.

4. **Boxes are nested four deep.**
   - **What happens:**
     - The story box holds the commit card, which holds the amber card, which holds the fix box.
     - On the phone this leaves a measure of about 230px.
     - The chain "⇔ r=2/r ⇔ / 2=r²" breaks across lines, which violates the rule that display math never wraps (`400_light_06_c1_confwrong.png`).
   - **Fix:**
     - Close a meta block before a commit begins.
     - The amber card *replaces* the commit body instead of nesting inside it.
     - Apply `nowrap` and the scroll fade to the fix line as well.

5. **The selection toolbar is not the consultation design.**
   - **What happens:**
     - The toolbar offers שאל · הסבר פשוט · פתק (`1300_light_17_selpop.png`). C wants מה זה? · למה? · דוגמה · בדוק אותי · לא מסכים · שאל… · פתק, where each button fixes the question type.
     - C drops "הסבר פשוט" on Haiku altogether, but the prototype keeps it.
   - **Fix:** port C §3.2 exactly.

6. **The bubble is missing the escalation and persistence model.**
   - **What happens:**
     - There is no L0 title or collapsed state, no ⧉ "פתח בצד" panel, and no follow-up box inside the bubble.
     - The fixed chips "במילים אחרות", "שמור" and "פתח בצד" are missing, and so is the margin count badge.
     - The quote is garbled ("| ממשש את זה במילימטרי", `1300_light_18_bubble.png`).
   - **Fix:** use C §3.3–3.6 cards. They stay as collapsed cards with a badge, and the ladder is L1 → L2 → L3.

7. **The ask pill anchors the wrong paragraph, invisibly, and destroys the previous answer.**
   - **What happens:**
     - He asked "למה דווקא מכנה?" while the probe stood on the A4 story, so the answer was attached there.
     - The earlier selection answer vanished (`1300_light_20_askpill.png`).
   - **Fix:**
     - Show an editable anchor chip in the composer before he sends ("על: «…»").
     - Never close a consultation by deleting it. Collapse it to its L0 line instead.

8. **The bubble grows inline and pushes the lesson down.**
   - **What happens:** after three chips it is 405px on desktop and 541px on the phone (`1300_light_19_bubble_chips.png`, `400_light_19_bubble_chips.png`).
   - **Fix:**
     - On the phone, use the 45% bottom sheet from C §5.2.
     - On desktop, move L2 and higher to the side panel.
     - Keep each chip's section collapsible.

9. **Confidence is required on every commit, and the label sounds like a contract.**
   - **What happens:**
     - The prototype has 5 commits in 1,800 words. The L-flow has 22–30 per lesson, which is about 150–250 confidence decisions in an 8-hour day.
     - The words "התחייב:" and "5 התחייבויות" read as legal obligation.
   - **Fix:**
     - Ask for confidence only on key units, which are the only ones that can earn a collapse, and on pretests. Everywhere else the commit is the answer alone.
     - Rename the labels to "ענה" and "5 שאלות".

10. **On the phone, one question fills a whole screen.**
    - **What happens:** the c2 card is about 550px tall: options wrap, the confidence buttons sit on their own row, and "דלג" sits on another (`400_dark_07_c2_gate.png`).
    - **Fix:**
      - Make the option rows 44px.
      - Make the confidence row a single segmented control.
      - Put "דלג" in the card header.

11. **Hebrew is set in a monospace font with letter-spacing, and the chips are ambiguous.**
    - **What happens:**
      - The chips "מחר · +3 ימים · +8 ימים" look clickable, but nothing says whether they are choices or information (`z_chips.png`).
      - The labels "2.5 · גבולות" and "עומק" are tracked out, and Hebrew should never be letter-spaced.
    - **Fix:**
      - Set Hebrew labels in Plex Sans with `letter-spacing:0`.
      - Replace the chips with plain text: "חוזר מחר", with the schedule shown on hover.

12. **The figure labels collide with the drawing.** They cross the diagonal and overlap "b−a" (`z_fig.png`).
    - **Fix:** put the labels outside the square with leader lines, and move the step list into the caption.

13. **Focus mode leaks the margin.** A margin note floats off the sheet onto the desk, and the top bar stays (`1300_light_26_focus.png`).
    - **Fix:**
      - In focus mode, show notes as numbered dots at the end of their paragraph.
      - Auto-hide the top bar.

14. **Orientation is stale or clipped.**
    - **What happens:**
      - The bar says "פתיחה · עוד 1 דק'" while he is reading section 1 (`1300_light_18_bubble.png`).
      - On the phone, the outline sheet's calibration rail is cut off by the bar (`400_light_21_outline_sheet.png`).
    - **Fix:**
      - Drive the bar and the outline from one probe.
      - Give the sheet bottom padding equal to the bar height.

15. **Small sources of noise.**
    - **What happens:**
      - An inline "◆ ודאות בינונית" interrupts a sentence (`1300_light_22_depth.png`).
      - The disabled confidence buttons are nearly invisible in dark mode (`1300_dark_07_c2_gate.png`).
      - The confident-error glyph "!" in the outline reads as an alarm.
      - The calibration squares have no legend.
    - **Fix:**
      - Move certainty to a margin chip.
      - Show disabled buttons at 60% contrast, with "בחר תשובה קודם".
      - Use an amber "◆" for a confident error.
      - Give the calibration rail a tooltip legend.

## 2. What is delightful and must stay
- The cream sheet on a desk, warm graphite in dark mode, and Plex Hebrew at 18/1.8. It looks calm and serious.
- The block tiers: three hues and spines instead of frames.
- The confident-error card's tone ("זה הרגע הכי טוב ללמוד") and the per-distractor "למה זה מפתה".
- "ניחשת נכון, אז הנה למה", and keeping the text open after a lucky guess.
- The hint ladder dots.
- The blur gate with "פתח בלי לענות". Nothing is ever locked.
- The outline with commit glyphs and "אתה כאן", and the (n) equation peeks.
- The word ledger "כולן נשארות בשיעור".
- No horizontal overflow at 400px, full keyboard support, and reduced motion respected.

## 3. Fatigue risks over an 8-hour day

| Risk | Measure | Fix |
|---|---|---|
| Interaction frequency | about one commit every 2–3 minutes of reading, about 200 per day | At most one commit per screen of text. Optionally, a per-section "רציף" mode that moves non-key commits to the section's end. They are still asked. |
| Confidence decisions | one per commit | Confidence on key units only (#9). The remembered default is shown, but never pre-selected. |
| Visual noise after answering | the verdict pill, the reason, the amber card, the chips, the green strip, and the depth flag all stay open | Once resolved and scrolled past, the widget shrinks to one line: question · your answer · ✓/✗. The lesson text is untouched, and the line reopens the full card. |
| Sound | a chime on every commit, about 200 per day | By default, sound only on a confident error and at the end of a section. |
| Eye strain | the cream is good; dark mode is good; there is no night variant | Add the warm-night variant and the 25–30 minute break chip. Neither is in the prototype yet. |

## 4. Does the earned collapse honestly respect "no material removed"?

**Mostly yes in the interface:**
- the fold shows its word count;
- one click reopens it;
- the reopened text keeps a green rule;
- a wrong answer forces the related depth open.

**Three dishonesties to fix:**
1. **The ledger is polluted.** Asking a question raised "במסך" from 1,802 to 2,003 words, because consultation text is counted as lesson text. Count only the lesson's units.
2. **The keep card overclaims.** It marks "(2) חסם הקירוב — הוכח" although no commit tested (2). c4 tested measurement (`1300_light_23_keep.png`). A pill must cite the commit that earned it.
3. **One confident multiple-choice answer can fold text with a 25% guess base.** The L-flow's 3-day closed-book recheck of collapsed units is not shown anywhere.
   - Show "ייבדק שוב בעוד 3 ימים" on the strip.
   - On a choice question, require both "בטוח" and a key unit before anything folds.

## 5. Gaps v3 must close

**Against C (the unified consultation design):**
- the type-fixing toolbar;
- the anchor chip in the composer;
- the L0, L1, L2 and L3 levels with the four fixed chips;
- the side panel and the margin badges;
- the follow-up box inside a card;
- per-note cards for "תתייחס לפתקים שלי";
- the "שמור" chip showing the tool result;
- a failure card that keeps the question;
- a consultation log, together with the `check` verdict and how it feeds review.

**Against the L-flow:**
- 0.1, retrieval from the previous lesson;
- 0.3, three pre-questions where the prototype has one;
- the section gates 1.1 and 4.1, with **skim mode**, the one-line unit chips (the second fold form, which is missing entirely);
- multi-select and two-value number commits;
- **Socratic dialogue** after a wrong step (2.3, 3.2, 3.8): a hint ladder is not a dialogue;
- the adaptive "asked only if…" probes;
- predict–observe–explain with the chart slider (3.4);
- the closing:
  - keep-card **blanks** before the full card (5.1);
  - a real **teach-back** of the thread question with a rubric (5.2). Today the card just tells him the answer;
  - choosing the exercise;
  - the scheduling swap (5.4).
