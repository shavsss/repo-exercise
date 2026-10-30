# Round 4: design options board

**File:** `options.html` (111 KB, one file, vanilla JS, KaTeX 0.16.9 from cdnjs with MathML output). It follows the page contract: `<title>`, the viewport-fit meta, tokens on `:root` with both dark blocks, the `max()` side gutters, and no doctype/html/head/body. Direction is set to RTL by an inline script plus `html{direction:rtl}`.

**Publish:** declare `capabilities: {db: {}}`. The page writes collection `design_choices`, one doc per question id, shaped `{choice, label, note, at}`. Two docs carry extra fields:
- `q6-noise` adds `noiseVolume`;
- `q6-typing` adds `volume`.

When `claude.use("db")` returns null, or `window.claude` is missing, the page keeps working on localStorage and the status pill says "שמירה מקומית". There is a 10 s timeout. Each doc gets one write at a time.

## Questions (12 docs) and variants

The variant id is what gets stored as `choice`. `*` marks the v3 proposal; `app` marks what the app runs today.

| Doc | Variants (ids) |
|---|---|
| q1-layout | `outline-margin`*, `center-drawer` (☰ opens a working drawer), `two-col-rail` (sticky formula rail). Every variant has a "הצג גדול" (show large) button. |
| q2-blocks | `tiers`*, `tint`, `minimal` (icons only), `dashed` (app) |
| q3-commit | `three-buttons`*, `inline-chips`, `key-only`. All three are live. A wrong answer shows feedback for the distractor that was picked. |
| q4-confwrong | `amber-card`*, `inline-expand`, `margin-callout`. "הפעל שוב" replays the motion and the chime. |
| q5-consult | `anchored`*, `side-panel`, `bottom-sheet`. A switch adds "מצב דיון" (discussion mode), a 4-turn dialogue, to all three. |
| q6-typing | `brown` (app; the sound.ts synthesis as is), `soft` (no tactile bump or air, lowpass 2.6 kHz, about half the level), `none`. Each card has a box to type in and a "השמע משפט" (play phrase) button. |
| q6-chimes | `pair`* (from the open/done cues), `wood` (marimba: fundamental plus a short 4th partial), `tick`, `none`. Each card has buttons for right, confident error and section end. The chosen set also drives the sounds in q3 and q4. |
| q6-noise | `brown`, `pink`, `rain` (all as in sound.ts), plus two new ones: `library` (room tone: low air, a faint 120 Hz hum, one distant page turn per 12 s loop) and `ocean` (waves every 6 s that brighten as they break, with a 0.4 s lag in the right ear). It has its own volume slider (default 35, same curve as the app), a live spectrum canvas, and crossfades between beds. |
| q7-theme | `cream-graphite` (app; shown light and dark side by side), `night-warm` (no blue hues), `eink` (grey paper, black ink, almost no colour) |
| q7-density | `comfortable`*, `compact` |
| q8-cursor | `themed` (app; Lanchester's khaki arrow and reticle and Gilua's blueprint arrow and compass, copied from the CSS), `subtle` (a normal-size dark arrow with a lab dot, and a thin ring over buttons), `system`. Each card has hover zones for both labs. |
| q9-progress | `outline-here`*, `top-bar`, `dots`. All three are live: scroll inside the preview and the indicator and the minutes left update. |

**Content:** every text comes from `round2/ruletest2/lesson_1.md` section 2: the A4 story, the commensurable definition, "איך זה בנוי", derivation steps 1–3, formulas (1)–(3), the "מצומצם" think, and the headings and paragraphs from sections 1, 3 and 4. The tutor answers in q5 and the per-distractor "למה זה מפתה" lines are written for the demo and labelled as examples.

**Header:** auto/light/dark for the whole page, a Lanchester/Gilua switch for the accent, and a sound on/off toggle. The summary at the top lists all 12 choices and links to each question.

## Tests

The test script is `shots/test.js` (Playwright Chromium, run on `shots/test.html`, which is the same page with a doctype added). It ran at 1300×900 and 400×860, in light and dark. Results are in `shots/result.json`.

**Flows exercised:**
- in q3, a confident wrong answer, a right answer at "בטוח", and a key-only answer;
- the q1 large view and drawer;
- the q5 discussion switch;
- scrolling the q9 previews;
- a q6 chime, typing, and playing then stopping the ocean noise;
- saving a note and choosing in q7 and q6-noise.

**Results:**
- 0 page errors and 0 console errors in all 4 configurations.
- `scrollWidth` equalled the viewport at load, after the flows and after a reload.
- Choices were restored after a reload from localStorage.
- In the 1300-light run a mocked `claude.use("db")` was used:
  - the `onSnapshot` seed (q2 = `tint`) was shown as chosen;
  - `set()` received `{choice, label, note, at}`, plus `noiseVolume: 35` for q6-noise;
  - the status pill read "נשמר במסד".

**Screenshots:** 52 files, named `shots/<width>_<theme>_<NN>_<question>.png`. They are taken per section, with the sticky header made static so it does not cover the section.

**Fixed during testing:**
- The page had no RTL direction, because the skeleton adds no `dir`.
- In discussion mode the dialogue was duplicated, because an inline `display:grid` overrode the hide rule.
- The theme previews turned every bold word into a block label.
- The question number stretched to full width at 400px.
- Cursor and feedback previews had dead space, so they now size to their content.

## Limits
- Sounds cannot be verified by ear in headless mode. The test only checks that the AudioContext path runs without errors and that the play state toggles.
- Cursor previews need a mouse; on touch devices the card says so.
- Theme swatches are fixed samples. They do not follow the page's light or dark setting, on purpose.
